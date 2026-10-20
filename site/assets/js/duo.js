/* =========================================================
   雙人解題室：兩位登入的同學即時一起解同一題。
   ‧ 流程和單人練習場一樣照題卡規則走，只是兩人同步：
       ① 各自寫觀察（兩人都送出才同時揭曉，不能抄）→ ② 討論、各自作答，卡住時看法共用一層一層開
       → ③ 兩人都交出才一起對答案 → ④ 各自自評（記進自己的練習進度），兩人都評完才換下一題。
   ‧ 配對：6 碼房號邀請朋友，或隨機配對一位也在等的同學。房間、配對、封鎖、檢舉都由
     C:\accounts 的 duo_* 函式決定；這裡只呼叫它們。
   ‧ 連線：Supabase Realtime 私人頻道 duo:<房號>，只有房間的兩位成員進得來。
     Presence 看對方在不在；Broadcast 傳題目狀態、聊天與白板筆畫。
   ‧ 狀態沒有伺服器端的正本：兩邊各留一份，每次變動就把整份送出，收到的一方合併
     （每個人只寫自己的欄位、共用的計數只增不減），所以誰先斷線、誰後重連都對得起來。
   ========================================================= */
(function () {
  "use strict";
  var PR = SK.PR, esc = PR.esc, safeMd = PR.safeMd;
  var NICK_KEY = "sk-duo-nick";
  var CHAT_MAX = 300, CHAT_KEEP = 200;

  /* ---------- 版面 ---------- */
  SK.injectFilters();
  document.body.appendChild(SK.topbar("../", false));
  var main = SK.h("main", { class: "wrap", id: "main" });
  document.body.appendChild(main);
  main.innerHTML =
    '<section class="exam-hero sk-frame">' +
    '<p class="eyebrow">Two heads, one problem</p>' +
    "<h1>解題練習場</h1>" + PR.modes("duo") +
    '<p class="lead">找一位同學，即時一起解同一題。規則和練習場一樣：先各自寫下看到什麼，兩人都寫好才互相看到；' +
    "接著邊聊邊算，卡住時一起打開看法；兩人都交出答案，才一起對答案。</p>" +
    '<ol class="pr-rule">' +
    "<li><b>各自觀察</b>兩人都寫好才揭曉</li><li><b>一起討論</b>聊天、白板、共用看法</li>" +
    "<li><b>各自作答</b>都交出才對答案</li><li><b>各自自評</b>記進自己的複習表</li></ol>" +
    "</section>";
  var view = SK.h("section", { class: "unit-sec sk-card sk-frame", id: "duo", "aria-live": "polite" });
  main.appendChild(view);
  document.body.appendChild(SK.footer());

  /* ---------- 小工具 ---------- */
  var ADJ = ["溫柔的", "好奇的", "安靜的", "勇敢的", "認真的", "愛畫圖的", "慢慢來的", "愛猜猜的", "不放棄的", "會發光的"];
  var ANI = ["海獺", "刺蝟", "貓頭鷹", "水豚", "企鵝", "狐狸", "松鼠", "鯨魚", "烏龜", "小鹿", "浣熊", "麻雀"];
  function randomNick() {
    return ADJ[Math.floor(Math.random() * ADJ.length)] + ANI[Math.floor(Math.random() * ANI.length)] + (10 + Math.floor(Math.random() * 90));
  }
  function cleanNick(s) { return String(s || "").replace(/[\u0000-\u001f<>]/g, "").trim().slice(0, 12); }
  function getNick() {
    var n = "";
    try { n = cleanNick(localStorage.getItem(NICK_KEY)); } catch (e) {}
    if (!n) { n = randomNick(); setNick(n); }
    return n;
  }
  function setNick(n) { try { localStorage.setItem(NICK_KEY, n); } catch (e) {} }
  function uid4() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
  /* 看起來像個人資料（Email、手機、社群帳號）：送出前先提醒 */
  var PRIVATE = /[\w.+-]+@[\w-]+\.[\w.]+|09\d{2}[-\s]?\d{3}[-\s]?\d{3}|\b(line|ig|instagram|fb|facebook|discord|dc|telegram|tg)\b\s*(id)?\s*[:：]?\s*@?\w{3,}|加我|私訊我/i;
  var ERR = {
    room_not_found: "找不到這間房：可能房號打錯、房間已經關閉，或超過一天了。",
    room_full: "這間房已經有兩個人了。",
    too_many_rooms: "開房有點太頻繁了，等幾分鐘再試。",
    too_many_reports: "今天的檢舉次數已達上限。如果真的遇到危險，請告訴老師或家長。",
    not_logged_in: "請先登入。"
  };
  function errText(e) {
    var m = (e && e.message) || String(e);
    for (var k in ERR) if (m.indexOf(k) >= 0) return ERR[k];
    return "連線出了點問題，請稍後再試。（" + m + "）";
  }
  function setRoomParam(code) {
    var u = new URL(location.href);
    if (code) u.searchParams.set("room", code); else u.searchParams.delete("room");
    history.replaceState(history.state, "", u.toString());
  }

  /* 從分享連結進來：?invite=<週次>&m=<玩法>&s=<星星>&t=<題數>（週次 0 是房主自選的題組）。
     只讀數字和已知的玩法代號，網址裡的其他文字一律不顯示。 */
  var INVITE = (function () {
    var q = new URLSearchParams(location.search);
    if (!q.has("invite")) return null;
    var num = function (v, hi) { v = Math.floor(+v); return v >= 0 && v <= hi ? v : 0; };
    return { week: num(q.get("invite"), 99999), mode: q.get("m") || "", stars: num(q.get("s"), 20), total: num(q.get("t"), 20) };
  })();

  /* ---------- 帳號 ---------- */
  var A = null, client = null, me = null, booted = false;
  SK.account().then(function (acc) {
    A = acc;
    if (!A.available()) {
      view.innerHTML = '<h2 class="sec-title">帳號功能還沒開放</h2><p>雙人解題室需要登入才能使用，目前這個網站還沒有設定帳號系統。可以先到 <a href="../practice/index.html">解題練習場</a> 自己慢慢刷。</p>';
      return;
    }
    A.onChange(function (user) {
      if (!A.known()) return;
      var id = user ? user.id : null;
      if (id === me && booted) return;
      booted = true;
      if (R) leaveRoom(null, true);
      me = id;
      if (!user) { client = null; return gate(); }
      A.client().then(function (c) {
        client = c;
        var code = new URLSearchParams(location.search).get("room");
        if (code) joinByCode(code); else lobby();
      });
    });
  }, function () { view.innerHTML = "<p>帳號功能載入失敗，請重新整理再試一次。</p>"; });

  function gate() {
    view.innerHTML =
      '<h2 class="sec-title"><span class="num">!</span>登入後才能一起解題<span class="en">/ Sign in to play</span></h2>' +
      inviteBanner() +
      "<p>為了保護每一位同學，只有登入的人可以開房、配對和聊天；遇到不舒服的狀況時，檢舉和封鎖也才有效。</p>" +
      '<p class="muted">對方只會看到你自己取的暱稱，看不到你的 Email。</p>' +
      '<div class="pr-row"><button class="btn" type="button" data-act="login">登入 ' + SK.icon("arrow") + "</button>" +
      '<a class="btn ghost" href="../practice/index.html">先自己練習</a></div>';
    view.querySelector('[data-act="login"]').onclick = function () { A.login(); };
  }

  /* ---------- 大廳 ---------- */
  var matching = null;   /* 隨機配對中：{ timer, since } */
  function lobby(notice) {
    stopMatching(true);
    setRoomParam(null);
    view.innerHTML =
      '<h2 class="sec-title"><span class="num">GO</span>跟誰一起解？<span class="en">/ Find a partner</span></h2>' +
      inviteBanner() +
      (notice ? '<p class="duo-notice">' + esc(notice) + "</p>" : "") +
      '<div class="pr-field"><label class="pr-label" for="duo-nick">暱稱</label><div class="pr-chips">' +
      '<input id="duo-nick" class="pr-select duo-nick" maxlength="12" autocomplete="off">' +
      '<button class="btn small ghost" type="button" data-act="reroll">換一個</button></div></div>' +
      '<p class="muted duo-tip">對方只看得到暱稱，看不到你的 Email。不要用真名、學號或社群帳號當暱稱。</p>' +
      '<div class="duo-choices">' +
      '<div class="duo-choice"><h3>' + SK.icon("heart") + "邀請朋友</h3>" +
      "<p>開一間房，把房號或連結傳給朋友。房間一天後自動關閉。</p>" +
      '<button class="btn" type="button" data-act="create">開一間房</button>' +
      '<div class="duo-or">或輸入朋友給你的房號</div>' +
      '<form class="pr-row duo-join" autocomplete="off"><input class="pr-select duo-code" maxlength="6" placeholder="例如 K7QF2M" aria-label="房號" autocapitalize="characters">' +
      '<button class="btn small sky" type="submit">加入</button></form></div>' +
      '<div class="duo-choice"><h3>' + SK.icon("sparkle") + "隨機找一位同學</h3>" +
      "<p>配對一位也在等的同學。只會配到登入的使用者，而且永遠不會配到你封鎖過的人。</p>" +
      '<button class="btn" type="button" data-act="match">開始配對</button>' +
      '<p class="duo-matching muted" role="status"></p></div>' +
      "</div>" + eventHtml(weekly(weekNo()), false, "開房或配對後，由房主按「開始本週挑戰」。") +
      '<div class="duo-rules"><h3 class="hand">一起解題的約定</h3><ul>' +
      "<li>對事不對人：可以說「我覺得這一步怪怪的」，不說「你好笨」。</li>" +
      "<li>不分享真名、學校、電話、地址、社群帳號，也不約見面。</li>" +
      "<li>先各自寫觀察，兩人都寫好才會互相看到，不要急著把答案講出來。</li>" +
      "<li>覺得不舒服就按「檢舉」：會立刻離開房間，你們也不會再被配到一起。真的遇到危險，請告訴老師或家長。</li>" +
      "</ul></div>";
    var nick = view.querySelector("#duo-nick");
    nick.value = getNick();
    nick.onchange = function () { var n = cleanNick(nick.value) || randomNick(); nick.value = n; setNick(n); };
    view.querySelector('[data-act="reroll"]').onclick = function () { var n = randomNick(); nick.value = n; setNick(n); };
    view.querySelector('[data-act="create"]').onclick = function (ev) {
      ev.target.disabled = true;
      client.rpc("duo_create").then(function (res) {
        if (res.error) throw res.error;
        enterRoom({ code: res.data, role: "host", kind: "friend" });
      }).catch(function (e) { lobby(errText(e)); });
    };
    view.querySelector(".duo-join").onsubmit = function (ev) {
      ev.preventDefault();
      var code = view.querySelector(".duo-code").value.trim().toUpperCase();
      if (code.length === 6) joinByCode(code);
    };
    view.querySelector('[data-act="match"]').onclick = function () { matching ? stopMatching() : startMatching(); };
  }

  function joinByCode(code) {
    client.rpc("duo_join", { p_code: code }).then(function (res) {
      if (res.error) throw res.error;
      enterRoom(res.data);
    }).catch(function (e) { lobby(errText(e)); });
  }

  function startMatching() {
    var btn = view.querySelector('[data-act="match"]'), line = view.querySelector(".duo-matching");
    matching = { since: Date.now(), timer: 0 };
    btn.textContent = "取消配對";
    function tick() {
      if (!matching) return;
      var sec = Math.round((Date.now() - matching.since) / 1000);
      if (sec > 120) {
        stopMatching();
        line.textContent = "現在還沒有其他同學在等。可以晚一點再試，或開一間房邀請朋友。";
        return;
      }
      line.textContent = "正在找同學…（已等 " + sec + " 秒）";
      client.rpc("duo_match").then(function (res) {
        if (!matching) return;
        if (res.error) throw res.error;
        if (res.data) { matching = null; enterRoom(res.data); }
        else matching.timer = setTimeout(tick, 3000);
      }).catch(function (e) { stopMatching(); line.textContent = errText(e); });
    }
    tick();
  }
  function stopMatching(silent) {
    if (!matching) return;
    clearTimeout(matching.timer);
    matching = null;
    if (client) client.rpc("duo_cancel").then(function () {}, function () {});
    if (silent) return;
    var btn = view.querySelector('[data-act="match"]');
    if (btn) btn.textContent = "開始配對";
    var line = view.querySelector(".duo-matching");
    if (line) line.textContent = "";
  }

  /* =========================================================
     房間
     ========================================================= */
  var R = null;
  /* S：兩邊各留一份、互相合併的狀態
       setup  { at, by, base, label, refs:[{id,slug}], mode, event, goal, budget }  只有房主寫；以 at 新的為準
              mode：free 自由練習／jigsaw 看法拼圖／team 團隊闖關／relay 接力解題；event：本週限定挑戰的週次
       qi     目前第幾題（全房間累計，只增不減）；這一輪的第 k 題 = qi - setup.base
       rounds { qi: { obs:{uid:{text,at}}, ans:{uid:{chosen,text,gaveUp,at}}, rate:{uid:r}, hints, clearAt,
                      relay:{ obs, obsOk, obsNo, plan, planOk, planNo, ans, ansOk, ansNo } } }
              接力的每一欄都帶 at；「同意」「退回」比較的是 at 的先後，所以時間戳一律比它回應的那一欄大
       nicks  { uid: {n, at} } */
  function emptyState() { return { setup: null, qi: 0, rounds: {}, nicks: {} }; }
  function round(S, qi) {
    var k = String(qi);
    if (!S.rounds[k]) S.rounds[k] = { obs: {}, ans: {}, rate: {}, hints: 0, clearAt: 0, relay: {} };
    if (!S.rounds[k].relay) S.rounds[k].relay = {};
    return S.rounds[k];
  }
  function newer(a, b) { return !a || (b && (b.at || 0) > (a.at || 0)); }
  function mergeState(S, T) {
    if (!T) return false;
    var before = JSON.stringify(S);
    if (T.setup && newer(S.setup, T.setup)) S.setup = T.setup;
    S.qi = Math.max(S.qi || 0, T.qi || 0);
    Object.keys(T.nicks || {}).forEach(function (u) { if (newer(S.nicks[u], T.nicks[u])) S.nicks[u] = T.nicks[u]; });
    Object.keys(T.rounds || {}).forEach(function (k) {
      var a = round(S, k), b = T.rounds[k];
      ["obs", "ans"].forEach(function (f) {
        Object.keys(b[f] || {}).forEach(function (u) { if (newer(a[f][u], b[f][u])) a[f][u] = b[f][u]; });
      });
      Object.keys(b.rate || {}).forEach(function (u) { if (!a.rate[u]) a.rate[u] = b.rate[u]; });
      Object.keys(b.relay || {}).forEach(function (f) { if (newer(a.relay[f], b.relay[f])) a.relay[f] = b.relay[f]; });
      a.hints = Math.max(a.hints || 0, b.hints || 0);
      a.clearAt = Math.max(a.clearAt || 0, b.clearAt || 0);
    });
    return JSON.stringify(S) !== before;
  }
  /* 比 refs 裡每一欄的時間都晚：兩台電腦的時鐘有落差時，「同意」也不會排到它回應的那一欄前面 */
  function stamp() {
    var t = Date.now();
    for (var i = 0; i < arguments.length; i++) if (arguments[i] && arguments[i].at >= t) t = arguments[i].at + 1;
    return t;
  }

  /* =========================================================
     合作挑戰
     ‧ 本週限定：每週一換一組 5 題歷屆題（同一週大家拿到同一組），玩法每週輪替，兩人一起拿到 3 顆星過關。
     ‧ 房主也可以自己選題，再搭配任一種玩法。
     ‧ 不計時、不排名：星星只算兩個人一起的，沒有個人分數。
     ========================================================= */
  var EVENT_SIZE = 5, EVENT_GOAL = 3, TEAM_HINTS = 3;
  var EVENT_MODES = ["jigsaw", "team", "relay"];
  var BANK_FROM_WEEK = 2964;   /* 2026-10-19 那一週起，每週題組也從新增的大考題庫挑 */
  var MODES = {
    free: { name: "自由練習", rule: "照練習場的規則一起解：各自觀察、一起討論、各自作答。" },
    jigsaw: { name: "看法拼圖", rule: "你們各自拿到不同的一片提示（看法一／看法二），只有自己看得到。把你那一片講給對方聽，一起拼出完整的解法。" },
    team: { name: "團隊闖關", rule: "兩人共用 " + TEAM_HINTS + " 次提示。兩個人都答對就拿到一顆星（沒有標準答案的題目：兩人自評都不是「再來一次」），湊滿目標星星就過關。" },
    relay: { name: "接力解題", rule: "一棒接一棒：A 寫觀察 → B 寫解題計畫 → A 交出答案。每一棒都要對方按「同意」才往下，有不同想法就退回去；下一題換人起跑。" }
  };
  var RELAY_STEPS = ["第 1 棒：觀察", "第 2 棒：計畫", "第 3 棒：作答", "對答案"];

  function weekNo() { return Math.floor((PR.today() + 3) / 7); }      /* 1970-01-01 是週四，+3 讓每週從週一開始 */
  function weekLabel(w) {
    var d = function (n) { var t = new Date(n * 86400000); return (t.getUTCMonth() + 1) + "/" + t.getUTCDate(); };
    return d(w * 7 - 3) + "–" + d(w * 7 + 3);
  }
  function seeded(seed) {
    return function () {
      seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  /* 這一週的題組：從有兩種看法的歷屆題卡裡，用週次當種子洗牌取 5 題 */
  function weekly(w) {
    var pool = PR.bankItems(w >= BANK_FROM_WEEK).filter(function (it) { return it.ways.length >= 2; })
      .sort(function (a, b) { return a.id < b.id ? -1 : 1; });
    var rnd = seeded(w * 7919 + 13);
    for (var i = pool.length - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)), t = pool[i]; pool[i] = pool[j]; pool[j] = t; }
    return { week: w, mode: EVENT_MODES[w % EVENT_MODES.length], items: pool.slice(0, EVENT_SIZE), goal: EVENT_GOAL };
  }
  function eventHtml(ev, withButton, note) {
    var best = PR.coop.get(ev.week);
    return '<div class="duo-event"><p class="eyebrow">期間限定・' + weekLabel(ev.week) + "</p>" +
      '<h3 class="hand">本週合作挑戰：' + MODES[ev.mode].name + "</h3><p>" + MODES[ev.mode].rule + "</p>" +
      '<p class="muted">' + ev.items.length + " 題歷屆題・兩人一起拿到 " + ev.goal + " 顆星就過關・不計時" +
      (best ? "・你的最佳紀錄 ★ " + best.stars + " / " + best.total + (best.stars >= best.goal ? "（已過關）" : "") : "") +
      (note ? "。" + note : "") + "</p>" +
      '<div class="pr-row">' +
      (withButton ? '<button class="btn" type="button" data-act="event">開始本週挑戰 ' + SK.icon("arrow") + "</button>" : "") +
      (best ? shareButton(Object.assign({ week: ev.week }, best), "分享我的紀錄") : "") + "</div></div>";
  }
  function shareButton(rec, label) {
    return '<button class="btn small sky" type="button" data-share="' + esc(JSON.stringify({ week: rec.week, mode: rec.mode, stars: rec.stars, total: rec.total, goal: rec.goal })) + '">' +
      SK.icon("sparkle") + label + "</button>";
  }

  function enterRoom(info) {
    stopMatching(true);
    var nick = getNick();
    R = {
      code: info.code, role: info.role, kind: info.kind, S: emptyState(), items: null, itemsFor: 0,
      chat: [], strokes: {}, online: {}, drafts: {}, lastKey: "", lastSend: 0, sendTimer: 0, chatAt: 0, gone: false
    };
    /* 重新整理時先拿回這個分頁上次的狀態；兩人同時重新整理也不會把進度弄丟 */
    var back = false;
    try {
      var saved = JSON.parse(sessionStorage.getItem(snapKey(info.code)) || "null");
      if (saved && saved.me === me) { back = true; mergeState(R.S, saved.S); (saved.chat || []).forEach(function (m) { addChat(m, true); }); }
    } catch (e) {}
    R.S.nicks[me] = { n: nick, at: Date.now() };
    setRoomParam(info.code);
    roomLayout();
    sysMsg(back ? "回到房間了。" : info.kind === "random" ? "配對成功！先打聲招呼吧。" : info.role === "host" ? "房間開好了。把房號或連結傳給朋友。" : "進房了。");

    var ch = client.channel("duo:" + info.code, {
      config: { private: true, broadcast: { self: false }, presence: { key: me, enabled: true } }
    });
    R.ch = ch;
    ch.on("broadcast", { event: "state" }, function (m) { if (mergeState(R.S, m.payload)) render(); })
      .on("broadcast", { event: "hello" }, function () { sendSync(); })
      .on("broadcast", { event: "sync" }, function (m) { applySync(m.payload); })
      .on("broadcast", { event: "chat" }, function (m) { addChat(m.payload); })
      .on("broadcast", { event: "stroke" }, function (m) { addStroke(m.payload); })
      .on("broadcast", { event: "unstroke" }, function (m) { delete R.strokes[m.payload && m.payload.id]; drawBoard(); })
      .on("presence", { event: "sync" }, function () {
        var st = ch.presenceState(), was = R.online[partnerId()];
        R.online = {};
        Object.keys(st).forEach(function (k) { R.online[k] = true; });
        var p = partnerId(), now = !!(p && R.online[p]);
        if (p && was && !now) sysMsg(nickOf(p) + " 離線了。可以等一下，或回大廳。");
        if (p && !was && now) sysMsg(nickOf(p) + " 進來了。");
        renderBar();
      })
      .on("presence", { event: "join" }, function (m) { if (m.key !== me) sendSync(); });

    client.realtime.setAuth().then(function () {
      ch.subscribe(function (status) {
        if (!R || R.ch !== ch) return;
        if (status === "SUBSCRIBED") {
          ch.track({ nick: nick, at: Date.now() });
          ch.send({ type: "broadcast", event: "hello", payload: {} });
          sendState();
        } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          if (!R.subscribedOnce) leaveRoom("進不了這間房：可能已經關閉，或你沒有這間房的權限。");
        }
        if (status === "SUBSCRIBED") R.subscribedOnce = true;
      });
    });
    render();
  }

  function leaveRoom(notice, quiet) {
    if (!R) return;
    var ch = R.ch;
    R.gone = true;
    clearTimeout(R.sendTimer);
    R = null;
    if (ch && client) client.removeChannel(ch);
    if (!quiet) lobby(notice);
  }

  /* ---------- 送出／接收 ---------- */
  function sendState() {
    if (!R || !R.ch) return;
    clearTimeout(R.sendTimer);
    var wait = Math.max(0, 120 - (Date.now() - R.lastSend));
    R.sendTimer = setTimeout(function () {
      if (!R) return;
      R.lastSend = Date.now();
      R.ch.send({ type: "broadcast", event: "state", payload: R.S });
    }, wait);
  }
  function change(fn) { fn(R.S); render(); sendState(); }
  /* 對方剛進來（或重連）：把整份狀態、聊天紀錄和這一題的白板都給他 */
  function sendSync() {
    if (!R || !R.ch) return;
    var qi = R.S.qi, strokes = Object.keys(R.strokes).map(function (k) { return R.strokes[k]; })
      .filter(function (s) { return s.qi === qi; }).slice(-300);
    R.ch.send({ type: "broadcast", event: "sync", payload: { S: R.S, chat: R.chat.filter(function (m) { return !m.sys; }).slice(-CHAT_KEEP), strokes: strokes } });
  }
  function applySync(p) {
    if (!p) return;
    (p.chat || []).forEach(function (m) { addChat(m, true); });
    renderChat();
    (p.strokes || []).forEach(function (s) { addStroke(s, true); });
    drawBoard();
    if (mergeState(R.S, p.S)) render();
  }

  function partnerId() {
    return Object.keys(R.S.nicks).filter(function (u) { return u !== me; })[0] || null;
  }
  function nickOf(u) { return (R.S.nicks[u] && R.S.nicks[u].n) || "對方"; }
  function cur() { return round(R.S, R.S.qi); }
  function curItem() {
    if (!R.S.setup || !R.items) return null;
    return R.items[R.S.qi - R.S.setup.base] || null;
  }

  /* 題目：房主排好 refs，兩邊各自從題庫換回完整題目 */
  function ensureItems() {
    var s = R.S.setup;
    if (!s || R.itemsFor === s.at) return;
    R.itemsFor = s.at;
    R.items = null;
    var room = R;
    PR.resolve(s.refs).then(function (items) {
      if (R !== room || room.itemsFor !== s.at) return;
      room.items = items;
      render();
    });
  }

  function mode() { return (R.S.setup && R.S.setup.mode) || "free"; }
  function otherOf(u) { return Object.keys(R.S.nicks).filter(function (x) { return x !== u; })[0] || null; }
  /* 拼圖與接力的 A／B：房主在第 1、3、5…題當 A，下一題換人 */
  function roleA(k) { var h = R.S.setup.by; return k % 2 === 0 ? h : otherOf(h); }
  /* 看法拼圖：A 拿看法一、B 拿看法二；只有一種看法的題目，B 拿「最多人卡在這裡」 */
  function piece(it, isA) {
    var w = it.ways;
    if (w.length >= 2) return w[isA ? 0 : 1];
    if (isA) return w[0] || null;
    return it.trap ? { t: it.trapTitle, html: it.trap } : null;
  }
  /* 接力的一欄：寫了、而且沒有被更晚的「退回」蓋掉 */
  function liveF(f, no) { return f && !(no && no.at > f.at) ? f : null; }
  function agreed(ok, f) { return !!(ok && f && ok.at > f.at); }
  function relayStage(rd, p) {
    var r = rd.relay;
    if (!p || !liveF(r.obs, r.obsNo)) return "r-obs";
    if (!agreed(r.obsOk, r.obs)) return "r-obs-ok";
    if (!liveF(r.plan, r.planNo)) return "r-plan";
    if (!agreed(r.planOk, r.plan)) return "r-plan-ok";
    if (!liveF(r.ans, r.ansNo)) return "r-ans";
    if (!agreed(r.ansOk, r.ans)) return "r-ans-ok";
    return "reveal";
  }
  /* 第 k 題拿到星星了嗎：true／false；還沒對答案或還沒自評是 null */
  function starOf(k) {
    var S = R.S, it = R.items && R.items[k], rd = S.rounds[String(S.setup.base + k)], p = partnerId();
    if (!it || !rd || !p) return null;
    if (it.key) {
      if (mode() === "relay") {
        var a = rd.relay && agreed(rd.relay.ansOk, rd.relay.ans) ? rd.relay.ans : null;
        return a ? PR.grade(it, a.chosen, a.gaveUp).correct : null;
      }
      if (!rd.ans[me] || !rd.ans[p]) return null;
      return PR.grade(it, rd.ans[me].chosen, rd.ans[me].gaveUp).correct && PR.grade(it, rd.ans[p].chosen, rd.ans[p].gaveUp).correct;
    }
    if (!rd.rate[me] || !rd.rate[p]) return null;
    return rd.rate[me] !== "again" && rd.rate[p] !== "again";
  }
  function starCount() { var n = 0; for (var k = 0; k < R.S.setup.refs.length; k++) if (starOf(k) === true) n++; return n; }
  function hintsUsed() {
    var S = R.S, n = 0;
    for (var k = 0; k < S.setup.refs.length; k++) { var rd = S.rounds[String(S.setup.base + k)]; if (rd) n += rd.hints || 0; }
    return n;
  }
  function starsHtml(big) {
    var s = R.S.setup, out = "", got = starCount();
    for (var k = 0; k < s.refs.length; k++) {
      /* 結算畫面：拿到的星星排前面；進行中的目標列照題目順序，看得出是哪一題 */
      var v = big ? (k < got) : starOf(k);
      out += '<span class="duo-star' + (v === true ? " on" : v === false ? " miss" : "") + (!big && k === R.S.qi - s.base ? " now" : "") + '">' + (v === true ? "★" : "☆") + "</span>";
    }
    return '<span class="duo-stars' + (big ? " big" : "") + '" aria-label="團隊星星 ' + starCount() + ' 顆">' + out + "</span>";
  }

  function stage() {
    var S = R.S;
    if (!S.setup) return "setup";
    /* 合作挑戰的結算要算星星，得等題目載入完（重新整理後也一樣） */
    if (S.qi - S.setup.base >= S.setup.refs.length) return R.items || mode() === "free" ? "done" : "loading";
    if (!R.items) return "loading";
    var rd = cur(), p = partnerId();
    if (mode() === "relay") return relayStage(rd, p);
    if (!rd.obs[me] || !p || !rd.obs[p]) return "observe";
    if (!rd.ans[me] || !rd.ans[p]) return "work";
    return "reveal";
  }

  /* =========================================================
     畫面
     ========================================================= */
  function roomLayout() {
    view.innerHTML =
      '<div class="duo-bar">' +
      '<div class="duo-code-box">房號 <b class="code">' + esc(R.code) + "</b>" +
      (R.kind === "friend" ? '<button class="btn small sky" type="button" data-act="copy">複製邀請連結</button>' : '<span class="chip">隨機配對</span>') + "</div>" +
      '<div class="duo-peers"></div>' +
      '<div class="duo-actions">' +
      '<button class="btn small ghost" type="button" data-act="report">檢舉</button>' +
      '<button class="btn small ghost" type="button" data-act="block">封鎖</button>' +
      '<button class="btn small ghost" type="button" data-act="leave">離開</button></div></div>' +
      '<div class="duo-grid"><div class="duo-main">' +
      '<div class="duo-goal" hidden></div>' +
      '<div class="past pr-card duo-card"></div>' +
      '<details class="duo-board" open><summary>共用白板 <span class="muted">（兩人都看得到，一起畫圖、寫算式）</span></summary>' +
      '<div class="duo-tools"></div><div class="duo-canvas-wrap"><canvas width="1000" height="625" aria-label="共用白板"></canvas>' +
      '<div class="duo-lock" hidden>先寫下觀察，寫好才開放白板</div></div></details>' +
      "</div>" +
      '<aside class="duo-side"><h3 class="hand">討論</h3><div class="duo-chat" role="log" aria-live="polite"></div>' +
      '<form class="duo-say" autocomplete="off"><textarea rows="2" maxlength="' + CHAT_MAX + '" aria-label="訊息"></textarea>' +
      '<button class="btn small" type="submit">送出</button></form>' +
      '<p class="muted duo-hint">可以用 $x^2$ 打公式。不要傳個人資料。</p></aside></div>' +
      '<dialog class="duo-dialog"></dialog>';
    var copy = view.querySelector('[data-act="copy"]');
    if (copy) copy.onclick = function () {
      var url = location.origin + location.pathname + "?room=" + R.code;
      (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).then(function () {
        copy.textContent = "已複製！";
        setTimeout(function () { copy.textContent = "複製邀請連結"; }, 1600);
      }, function () { window.prompt("複製這個連結傳給朋友：", url); });
    };
    view.querySelector('[data-act="leave"]').onclick = function () { leaveRoom(); };
    view.querySelector('[data-act="block"]').onclick = blockPartner;
    view.querySelector('[data-act="report"]').onclick = reportDialog;
    var form = view.querySelector(".duo-say");
    form.onsubmit = function (ev) { ev.preventDefault(); sendChat(); };
    form.querySelector("textarea").onkeydown = function (ev) {
      if (ev.key === "Enter" && !ev.shiftKey && !ev.isComposing) { ev.preventDefault(); sendChat(); }
    };
    setupBoard();
  }

  function snapKey(code) { return "sk-duo-room." + code; }
  function snapshot() {
    try { sessionStorage.setItem(snapKey(R.code), JSON.stringify({ me: me, S: R.S, chat: R.chat.filter(function (m) { return !m.sys; }) })); } catch (e) {}
  }

  /* 觀察還沒寫完時不開放聊天與白板（接力：第 1 棒交出觀察前） */
  function locked(st) { return st === "observe" || st === "r-obs"; }

  function render() {
    if (!R) return;
    snapshot();
    ensureItems();
    renderBar();
    var st = stage(), rd = cur(), p = partnerId();
    var key = [st, R.S.qi, R.S.setup && R.S.setup.at, !!rd.obs[me], !!rd.ans[me], !!rd.rate[me], R.role,
      mode() === "relay" ? JSON.stringify(rd.relay) : ""].join("|");
    if (key !== R.lastKey) { R.lastKey = key; buildCard(st); }
    updateLive(st, rd, p);
    renderGoal();
    var lock = locked(st);
    var ta = view.querySelector(".duo-say textarea");
    ta.disabled = lock;
    ta.placeholder = lock ? "先寫下觀察，寫好才開放討論" : "想法、問題、卡在哪裡……";
    view.querySelector(".duo-say button").disabled = lock;
    view.querySelector(".duo-lock").hidden = !lock;
    drawBoard();
  }

  /* 合作挑戰的目標列：玩法、星星、團隊提示 */
  function renderGoal() {
    var el = view.querySelector(".duo-goal"), s = R.S.setup;
    if (!s || !s.mode || s.mode === "free") { el.hidden = true; return; }
    el.hidden = false;
    el.innerHTML = "<b>" + MODES[s.mode].name + "</b>" +
      (s.event ? '<span class="chip">' + weekLabel(s.event) + " 限定</span>" : "") + starsHtml(false) +
      '<span class="muted">目標 ' + s.goal + " 顆</span>" +
      (s.mode === "team" ? '<span class="muted">團隊提示剩 ' + Math.max(0, s.budget - hintsUsed()) + " / " + s.budget + "</span>" : "") +
      '<details class="duo-rule"><summary>玩法</summary><p>' + MODES[s.mode].rule + "</p></details>";
  }

  function renderBar() {
    if (!R) return;
    var p = partnerId();
    var dot = function (on) { return '<i class="duo-dot' + (on ? " on" : "") + '"></i>'; };
    view.querySelector(".duo-peers").innerHTML =
      '<span class="chip">' + dot(true) + esc(nickOf(me)) + "（你）</span>" +
      (p ? '<span class="chip">' + dot(R.online[p]) + esc(nickOf(p)) + (R.online[p] ? "" : "・離線") + "</span>"
        : '<span class="chip muted">' + dot(false) + "等同學進來…</span>");
    var hasP = !!p;
    view.querySelector('[data-act="report"]').disabled = !hasP;
    view.querySelector('[data-act="block"]').disabled = !hasP;
  }

  /* 題卡：只在「階段」改變時重建，打到一半的字存在 drafts，不會被對方的更新洗掉 */
  function buildCard(st) {
    var card = view.querySelector(".duo-card"), S = R.S;
    var draft = R.drafts[S.qi] || (R.drafts[S.qi] = { obs: "", chosen: [], text: "", plan: "", note: "" });
    if (st === "setup") return buildSetup(card, "");
    if (st === "loading") { card.innerHTML = '<p class="muted">正在把題目搬出來…</p>'; return; }
    if (st === "done") return buildDone(card);

    var it = curItem(), rd = cur(), k = S.qi - S.setup.base, relay = mode() === "relay";
    if (!it) { card.innerHTML = '<p class="muted">這一題載入失敗了。</p><button class="btn small" type="button" data-act="skip">跳過這題</button>'; card.querySelector('[data-act="skip"]').onclick = nextQuestion; return; }
    card.innerHTML = '<div class="pr-top"><span class="pr-count">第 ' + (k + 1) + " / " + S.setup.refs.length + " 題</span></div>" +
      PR.cardHtml(it, relay ? RELAY_STEPS : null) + '<div class="pr-stage"></div>';
    var stageEl = card.querySelector(".pr-stage");
    if (relay && st !== "reveal") return buildRelay(card, stageEl, st, it, rd, draft, k);

    if (st === "observe") {
      PR.step(card, 0);
      if (!rd.obs[me]) {
        var rec = PR.read()[it.id];
        stageEl.innerHTML =
          '<div class="pr-block see"><label class="pr-q" for="duo-obs">先別動筆：你看到什麼？</label>' +
          '<p class="muted pr-tip">各自寫，兩人都送出才會同時揭曉。條件有哪些？主角是誰？像不像哪張你看過的圖？</p>' +
          (rec && rec.o ? '<p class="pr-last">上次你寫：' + safeMd(rec.o) + "</p>" : "") +
          '<textarea id="duo-obs" class="pr-ta" rows="3" placeholder="我看到……（可以用 $x^2$ 打公式）"></textarea>' +
          '<div class="pr-row"><button class="btn small" type="button" disabled data-act="obs">寫好了，送出</button>' +
          '<span class="duo-wait muted"></span></div></div>';
        var ta = stageEl.querySelector("#duo-obs"), go = stageEl.querySelector('[data-act="obs"]');
        ta.value = draft.obs;
        go.disabled = ta.value.trim().length < 2;
        ta.oninput = function () { draft.obs = ta.value; go.disabled = ta.value.trim().length < 2; };
        go.onclick = function () {
          var text = ta.value.trim().slice(0, 500);
          change(function (S) { round(S, S.qi).obs[me] = { text: text, at: Date.now() }; });
        };
      } else {
        stageEl.innerHTML = PR.block("mine", "你的觀察", safeMd(rd.obs[me].text)) +
          '<p class="duo-wait muted"></p>';
      }
      return;
    }

    var p = partnerId();
    if (relay) return buildReveal(card, stageEl, it, rd, k, relayTrail(it, rd, k) + (it.see ? PR.block("see", "小鎮的觀察", SK.md(it.see)) : ""));
    var compare = '<div class="pr-compare">' + PR.block("mine", "你的觀察", safeMd(rd.obs[me].text)) +
      PR.block("mine partner", esc(nickOf(p)) + " 的觀察", safeMd(rd.obs[p].text)) + "</div>" +
      (it.see ? PR.block("see", "小鎮的觀察", SK.md(it.see)) : "");
    /* 看法拼圖：自己那一片從一開始就攤開，而且一直留著，方便講給對方聽 */
    if (mode() === "jigsaw") {
      var pc = piece(it, me === roleA(k));
      compare += pc ? PR.block("way piece", "你的拼圖片（只有你看得到）・" + SK.md(pc.t), SK.md(pc.html)) +
        '<p class="muted duo-tip">用自己的話把這一片講給對方聽，也問問對方手上那一片是什麼。</p>'
        : '<p class="muted duo-tip">這題沒有拼圖片，一起討論吧。</p>';
    }

    if (st === "work") {
      PR.step(card, 1);
      if (!rd.ans[me]) {
        stageEl.innerHTML = compare +
          (it.opts ? '<p class="pr-q">' + PR.prompt(it) + "</p>"
            : '<label class="pr-q" for="duo-ans">寫下你的答案或關鍵算式</label>' +
              '<textarea id="duo-ans" class="pr-ta" rows="3" placeholder="可以用 $\\frac{a}{b}$、$x^2$ 打公式"></textarea>' +
              '<div class="pr-preview muted"></div>') +
          '<div class="pr-hints"></div>' +
          '<div class="pr-row"><button class="btn small" type="button" disabled data-act="submit">交出答案</button>' +
          (it.opts ? '<span class="pr-picked">還沒選答案（選項在上面）</span>' : "") +
          '<button class="btn small sky" type="button" data-act="hint" hidden></button>' +
          '<button class="btn small ghost" type="button" data-act="giveup">我卡住了，先交白卷</button>' +
          '<span class="duo-wait muted"></span></div>';
        var submit = stageEl.querySelector('[data-act="submit"]');
        answerInputs(card, stageEl, it, draft, submit);
        submit.onclick = function () { submitAnswer(it, false); };
        stageEl.querySelector('[data-act="giveup"]').onclick = function () { submitAnswer(it, true); };
        stageEl.querySelector('[data-act="hint"]').onclick = openHint;
      } else {
        stageEl.innerHTML = compare + '<div class="pr-hints"></div>' +
          PR.block("mine", "你交出的答案", answerHtml(it, rd.ans[me])) + '<p class="duo-wait muted"></p>';
        PR.markOpts(card, it, rd.ans[me].chosen);
        card.querySelectorAll(".pr-opt").forEach(function (b) { b.classList.remove("truth"); });
      }
      return;
    }
    buildReveal(card, stageEl, it, rd, k, "");
  }

  /* 選項按鈕或答案輸入框（自由／拼圖／團隊的作答，和接力的第 3 棒共用） */
  function answerInputs(card, stageEl, it, draft, submit) {
    if (it.opts) {
      var btns = card.querySelectorAll(".pr-opt"), picked = stageEl.querySelector(".pr-picked");
      var paint = function () {
        btns.forEach(function (x) { x.setAttribute("aria-pressed", draft.chosen.indexOf(+x.getAttribute("data-opt")) >= 0 ? "true" : "false"); });
        submit.disabled = !draft.chosen.length;
        if (picked) picked.innerHTML = draft.chosen.length ? "你選了 <b>" + PR.answerText(it, draft.chosen) + "</b>" : "還沒選答案（選項在上面）";
      };
      btns.forEach(function (b) {
        b.disabled = false;
        b.onclick = function () {
          var o = +b.getAttribute("data-opt");
          if (it.multi) {
            var at = draft.chosen.indexOf(o);
            if (at >= 0) draft.chosen.splice(at, 1); else draft.chosen.push(o);
          } else draft.chosen = [o];
          paint();
        };
      });
      paint();
    } else {
      var ans = stageEl.querySelector("#duo-ans"), pv = stageEl.querySelector(".pr-preview");
      var upd = function () {
        draft.text = ans.value;
        submit.disabled = !ans.value.trim();
        pv.innerHTML = /\$/.test(ans.value) ? "預覽：" + safeMd(ans.value.trim()) : "";
      };
      ans.value = draft.text;
      ans.oninput = upd;
      upd();
    }
  }

  /* 對答案：兩種看法、陷阱、答案全部攤開；各自自評；兩人都評完才換題 */
  function buildReveal(card, stageEl, it, rd, k, before) {
    var p = partnerId(), relay = mode() === "relay", head, compare, mine, gm, myText, obsText;
    PR.step(card, relay || rd.rate[me] ? 3 : 2);
    if (relay) {
      var team = rd.relay.ans, g = PR.grade(it, team.chosen, team.gaveUp);
      PR.markOpts(card, it, team.chosen);
      head = it.key ? (g.correct ? "✦ 接力成功，答對了！" : "✦ 這次沒接到正確答案。對照下面的解法，看看是哪一棒走偏了。") : "✦ 對照你們接力的答案和下面的解法。";
      compare = before;
      mine = team; gm = g;
      myText = PR.answerText(it, team.chosen, team.text, team.gaveUp);
      obsText = rd.relay.obs ? rd.relay.obs.text : "";
    } else {
      mine = rd.ans[me];
      var theirs = rd.ans[p], gp = PR.grade(it, theirs.chosen, theirs.gaveUp);
      gm = PR.grade(it, mine.chosen, mine.gaveUp);
      PR.markOpts(card, it, mine.chosen);
      var mark = function (g, a) { return a.gaveUp ? "　（先交白卷）" : g.correct === true ? "　✓" : g.correct === false ? "　✗" : ""; };
      head = it.key ? (gm.correct && gp.correct ? "✦ 兩個人都對了！" : gm.correct || gp.correct ? "✦ 有一個人想到了，互相講講看是怎麼想的。" : "✦ 這題兩個人都卡住了，這正是一起看解法的好時機。") : "✦ 對照兩個人的答案和下面的解法。";
      compare = '<div class="pr-compare">' + PR.block("mine", "你的答案" + mark(gm, mine), answerHtml(it, mine)) +
        PR.block("mine partner", esc(nickOf(p)) + " 的答案" + mark(gp, theirs), answerHtml(it, theirs)) + "</div>";
      myText = PR.answerText(it, mine.chosen, mine.text, mine.gaveUp);
      obsText = rd.obs[me] ? rd.obs[me].text : "";
    }
    stageEl.innerHTML =
      '<div class="explain"><h4>' + head + "</h4>" + (it.key ? "<p>正確答案是 <b>" + gm.keyText + "</b>。</p>" : "") + "</div>" +
      compare + PR.solutionHtml(it) +
      (rd.rate[me] ? '<p class="duo-rated">你的自評：<b>' + { again: "再來一次", shaky: "有點卡", solid: "穩了" }[rd.rate[me]] + "</b>（已記進你的練習進度）</p>"
        : PR.rateHtml(it, PR.suggest(gm, mine.gaveUp, rd.hints), "今天的練習場")) +
      '<div class="pr-row"><button class="btn" type="button" data-act="next" disabled>下一題 ' + SK.icon("arrow") + '</button><span class="duo-wait muted"></span></div>';
    stageEl.querySelector('[data-act="next"]').parentNode.before(PR.bookWidget(it, myText, obsText));
    stageEl.querySelectorAll("[data-rate]").forEach(function (btn) {
      btn.onclick = function () {
        var r = btn.getAttribute("data-rate");
        PR.record(it, r, obsText);
        change(function (S) { round(S, S.qi).rate[me] = r; });
      };
    });
    stageEl.querySelector('[data-act="next"]').onclick = nextQuestion;
  }

  /* 接力解題：一次只有一個人動手，另一個人確認 */
  function relayTrail(it, rd, k) {
    var r = rd.relay, A = roleA(k), B = otherOf(A);
    var who = function (u) { return u === me ? "你" : esc(nickOf(u)) + " "; };
    var note = function (ok, f) { return agreed(ok, f) && ok.text ? '<p class="duo-note">' + esc(nickOf(ok.by)) + " 補充：" + safeMd(ok.text) + "</p>" : ""; };
    return (liveF(r.obs, r.obsNo) ? PR.block("mine", "第 1 棒・" + who(A) + "的觀察", safeMd(r.obs.text) + note(r.obsOk, r.obs)) : "") +
      (liveF(r.plan, r.planNo) ? PR.block("mine partner", "第 2 棒・" + who(B) + "的解題計畫", safeMd(r.plan.text) + note(r.planOk, r.plan)) : "") +
      (liveF(r.ans, r.ansNo) ? PR.block("mine", "第 3 棒・" + who(A) + "交出的答案", answerHtml(it, r.ans) + note(r.ansOk, r.ans)) : "");
  }
  function buildRelay(card, el, st, it, rd, draft, k) {
    var r = rd.relay, A = roleA(k), B = otherOf(A), p = partnerId();
    var field = { "r-obs": "obs", "r-obs-ok": "obs", "r-plan": "plan", "r-plan-ok": "plan", "r-ans": "ans", "r-ans-ok": "ans" }[st];
    var leg = { obs: 1, plan: 2, ans: 3 }[field];
    var writer = field === "plan" ? B : A, reviewer = writer === A ? B : A, review = /-ok$/.test(st);
    PR.step(card, leg - 1);
    var no = r[field + "No"], rejected = no && (!r[field] || no.at > r[field].at) ? no : null;
    var roles = '<p class="duo-roles">這一題：<b>' + (A === me ? "你" : esc(nickOf(A))) + "</b> 跑第 1、3 棒，<b>" +
      (B === me ? "你" : B ? esc(nickOf(B)) : "對方") + "</b> 跑第 2 棒。</p>";
    var trail = relayTrail(it, rd, k);
    var see = leg >= 2 && it.see ? PR.block("see", "小鎮的觀察", SK.md(it.see)) : "";
    var hints = leg >= 2 ? '<div class="pr-hints"></div><div class="pr-row"><button class="btn small sky" type="button" data-act="hint" hidden></button></div>' : "";
    var html = roles + trail + see;

    if (!p) { el.innerHTML = html + '<p class="duo-wait-static muted">等同學進來…</p>'; return; }

    if (!review && writer === me) {
      var prompts = {
        obs: ["先別動筆：你看到什麼？", "條件有哪些？主角是誰？像不像哪張你看過的圖？寫好交給下一棒。", "我看到……"],
        plan: ["解題計畫：打算怎麼算？", "寫下要用的公式或關鍵的一步，不用算到最後。第 3 棒會照著你的計畫作答。", "先……再……；關鍵式是……"],
        ans: ["交出答案", "照著計畫算出答案。交出後，對方確認了才會對答案。", "可以用 $\\frac{a}{b}$、$x^2$ 打公式"]
      }[field];
      html += (rejected ? '<p class="duo-note warn">' + esc(nickOf(rejected.by)) + " 有不同想法：" + safeMd(rejected.text) + "</p>" : "") +
        '<div class="pr-block see"><label class="pr-q" for="relay-in">第 ' + leg + " 棒・" + prompts[0] + "</label>" +
        '<p class="muted pr-tip">' + prompts[1] + "</p>" +
        (field === "ans" && it.opts ? '<p class="pr-q">' + PR.prompt(it) + "</p>"
          : '<textarea id="' + (field === "ans" ? "duo-ans" : "relay-in") + '" class="pr-ta" rows="3" placeholder="' + prompts[2] + '"></textarea>' +
            (field === "ans" ? '<div class="pr-preview muted"></div>' : "")) +
        '<div class="pr-row"><button class="btn small" type="button" disabled data-act="pass">' + (field === "ans" ? "交出答案" : "寫好了，交棒") + "</button>" +
        (field === "ans" && it.opts ? '<span class="pr-picked"></span>' : "") +
        (field === "ans" ? '<button class="btn small ghost" type="button" data-act="giveup">卡住了，先交白卷</button>' : "") + "</div></div>" + hints;
      el.innerHTML = html;
      var pass = el.querySelector('[data-act="pass"]');
      if (field === "ans") {
        answerInputs(card, el, it, draft, pass);
        pass.onclick = function () { relayAnswer(it, draft, false); };
        el.querySelector('[data-act="giveup"]').onclick = function () { relayAnswer(it, draft, true); };
      } else {
        var ta = el.querySelector("#relay-in");
        ta.value = draft[field] || "";
        pass.disabled = ta.value.trim().length < 2;
        ta.oninput = function () { draft[field] = ta.value; pass.disabled = ta.value.trim().length < 2; };
        pass.onclick = function () {
          var text = ta.value.trim().slice(0, 600);
          change(function (S) { var x = round(S, S.qi).relay; x[field] = { text: text, by: me, at: stamp(x[field + "No"], x[field]) }; });
        };
      }
    } else if (review && reviewer === me) {
      html += '<div class="pr-block see"><p class="pr-q">第 ' + leg + " 棒交過來了：你同意嗎？</p>" +
        '<p class="muted pr-tip">同意就接下一棒；有不同想法就寫下來退回去，對方會看到你的話。</p>' +
        '<textarea id="relay-note" class="pr-ta" rows="2" placeholder="補充或不同的想法（同意時可以不寫）"></textarea>' +
        '<div class="pr-row"><button class="btn small" type="button" data-act="ok">同意，' + (field === "ans" ? "一起對答案" : "接下一棒") + "</button>" +
        '<button class="btn small ghost" type="button" data-act="no">我有不同想法，退回</button></div></div>' + hints;
      el.innerHTML = html;
      if (field === "ans" && r.ans) {
        PR.markOpts(card, it, r.ans.chosen);
        card.querySelectorAll(".pr-opt").forEach(function (b) { b.classList.remove("truth"); });
      }
      var note = el.querySelector("#relay-note");
      note.value = draft.note || "";
      note.oninput = function () { draft.note = note.value; };
      el.querySelector('[data-act="ok"]').onclick = function () {
        var text = note.value.trim().slice(0, 300);
        draft.note = "";
        change(function (S) { var x = round(S, S.qi).relay; x[field + "Ok"] = { text: text, by: me, at: stamp(x[field]) }; });
      };
      el.querySelector('[data-act="no"]').onclick = function () {
        var text = note.value.trim().slice(0, 300);
        if (!text) { note.focus(); note.placeholder = "先寫一下你的想法，對方才知道要怎麼改"; return; }
        draft.note = "";
        change(function (S) { var x = round(S, S.qi).relay; x[field + "No"] = { text: text, by: me, at: stamp(x[field]) }; });
      };
    } else {
      var who = esc(nickOf(review ? reviewer : writer));
      html += '<p class="duo-wait-static muted">' + (review ? "等 " + who + " 確認第 " + leg + " 棒…" :
        "等 " + who + " 跑第 " + leg + " 棒…" + (leg === 1 ? "（觀察寫完前先別提示，讓對方自己想）" : "可以在右邊一起討論。")) + "</p>" +
        (rejected && writer !== me ? '<p class="duo-note">你的想法已經傳給對方了。</p>' : "") + hints;
      el.innerHTML = html;
      if (field === "ans" && review && r.ans) {
        PR.markOpts(card, it, r.ans.chosen);
        card.querySelectorAll(".pr-opt").forEach(function (b) { b.classList.remove("truth"); });
      }
    }
    var hb = el.querySelector('[data-act="hint"]');
    if (hb) hb.onclick = openHint;
  }
  function relayAnswer(it, draft, gaveUp) {
    var chosen = gaveUp ? [] : (draft.chosen || []).slice(), text = gaveUp ? "" : String(draft.text || "").trim().slice(0, 1000);
    change(function (S) {
      var x = round(S, S.qi).relay;
      x.ans = { chosen: chosen, text: text, gaveUp: !!gaveUp, by: me, at: stamp(x.ansNo, x.ans) };
    });
  }

  function answerHtml(it, a) {
    if (!a) return "";
    if (a.gaveUp) return '<span class="muted">卡住了，先交白卷</span>';
    if (it.opts) return "<b>" + (a.chosen || []).slice().sort().map(function (k) { return PR.LETTER[k]; }).join("") + "</b>";
    return safeMd(a.text);
  }
  function submitAnswer(it, gaveUp) {
    var d = R.drafts[R.S.qi];
    change(function (S) {
      round(S, S.qi).ans[me] = {
        chosen: gaveUp ? [] : (d.chosen || []).slice(), text: gaveUp ? "" : String(d.text || "").trim().slice(0, 1000),
        gaveUp: !!gaveUp, at: Date.now()
      };
    });
  }
  /* 共用提示：團隊闖關有額度，看法拼圖沒有共用提示 */
  function openHint() {
    var it = curItem();
    if (!it || mode() === "jigsaw") return;
    if (mode() === "team" && hintsUsed() >= R.S.setup.budget) return;
    change(function (S) { var r = round(S, S.qi); r.hints = Math.min((r.hints || 0) + 1, PR.layers(it).length); });
  }
  function nextQuestion() { change(function (S) { S.qi = Math.max(S.qi, R.S.qi) + 1; }); }

  /* ---------- 選題（房主）／等待（同學） ---------- */
  function buildSetup(card, prefix) {
    var ev = weekly(weekNo()), host = R.role === "host";
    if (!host) {
      card.innerHTML = prefix + '<h3 class="hand">' + (prefix ? "等房主決定下一輪…" : "等房主選題目…") + "</h3>" +
        '<p class="muted">房主可以開始本週的合作挑戰，或自己選題。先在右邊打聲招呼吧。</p>' + eventHtml(ev, false);
      return;
    }
    var pickMode = R.pickMode || "free";
    card.innerHTML = prefix + eventHtml(ev, true) +
      '<h3 class="hand duo-or-head">或自己選題</h3>' +
      '<div class="pr-field"><span class="pr-label">玩法</span><div class="pr-chips">' +
      Object.keys(MODES).map(function (m) {
        return '<button type="button" class="chip" data-mode="' + m + '" aria-pressed="' + (m === pickMode) + '">' + MODES[m].name + "</button>";
      }).join("") + '</div></div><p class="muted duo-mode-rule">' + MODES[pickMode].rule + "</p>" +
      '<div class="pr-picker"></div>';
    card.querySelector('[data-act="event"]').onclick = function (ev2) { ev2.target.disabled = true; startEvent(); };
    card.querySelectorAll("[data-mode]").forEach(function (b) {
      b.onclick = function () {
        R.pickMode = b.getAttribute("data-mode");
        card.querySelectorAll("[data-mode]").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        card.querySelector(".duo-mode-rule").textContent = MODES[R.pickMode].rule;
      };
    });
    PR.picker(card.querySelector(".pr-picker"), PR.newPick(5), { sizes: [3, 5, 10], start: "開始這一輪", onStart: startRound });
  }
  function buildDone(card) {
    var s = R.S.setup, head = '<h3 class="hand">這一輪做完了 ✓</h3>';
    if (s.mode && s.mode !== "free") {
      var n = starCount(), pass = n >= s.goal;
      head = '<h3 class="hand">' + (pass ? "過關！" : "差一點點") + "</h3>" + starsHtml(true) +
        "<p>" + (pass ? "你們一起拿到 <b>" + n + "</b> 顆星，達成目標 " + s.goal + " 顆。"
          : "這次一起拿到 <b>" + n + "</b> 顆星，目標是 " + s.goal + " 顆。卡住的那幾題，正是最值得一起再看一次的。") + "</p>";
      if (s.event) PR.coop.save(s.event, { stars: n, total: s.refs.length, goal: s.goal, mode: s.mode, at: Date.now() });
      head += '<div class="duo-share-slot"></div>';
    }
    head += '<p class="muted">每一題的自評都記進了你自己的練習進度，之後會在 <a href="../practice/index.html?due=1">練習場的「今天到期」</a> 再出現。</p><hr class="duo-hr">';
    buildSetup(card, head);
    var slot = card.querySelector(".duo-share-slot");
    if (slot) sharePanel(slot, { week: s.event || 0, mode: s.mode, stars: starCount(), total: s.refs.length, goal: s.goal });
  }
  function setupFor(label, refs, m, extra) {
    change(function (S) {
      S.setup = Object.assign({ at: Date.now(), by: me, base: S.qi, label: label, mode: m, event: null,
        goal: Math.ceil(refs.length * 0.6), budget: TEAM_HINTS, refs: refs }, extra || {});
    });
  }
  function startEvent() {
    var ev = weekly(weekNo());
    setupFor("本週合作挑戰", ev.items.map(function (it) { return { id: it.id, slug: it.slug }; }), ev.mode, { event: ev.week, goal: ev.goal });
  }
  function startRound(pick, msg, btn) {
    btn.disabled = true;
    msg.textContent = "正在排題目…";
    PR.buildQueue(pick).then(function (res) {
      btn.disabled = false;
      if (!res.queue) { msg.textContent = res.msg; return; }
      var label = pick.unit ? window.CATALOG.get(pick.unit).title : pick.scope === "all" ? "全部單元" : window.CATALOG.region(pick.scope).name;
      setupFor(label, res.queue.map(function (it) { return { id: it.id, slug: it.slug }; }), R.pickMode || "free");
    });
  }

  /* 不重建題卡、只更新「對方的進度」與共用提示 */
  function updateLive(st, rd, p) {
    var card = view.querySelector(".duo-card"), wait = card.querySelector(".duo-wait"), pn = esc(nickOf(p));
    var it = curItem();
    if (wait) {
      var t = "";
      if (!p) t = "等同學進來…";
      else if (st === "observe") t = rd.obs[me] ? (rd.obs[p] ? "" : "你寫好了，等 " + pn + " 寫完就會同時揭曉。") : (rd.obs[p] ? pn + " 已經寫好了，慢慢來。" : pn + " 也在想。");
      else if (st === "work") t = rd.ans[me] ? "已交出，等 " + pn + "。" : (rd.ans[p] ? pn + " 已經交出答案了，不用急。" : "");
      else if (st === "reveal") t = rd.rate[me] && rd.rate[p] ? "兩個人都自評完了。" : rd.rate[me] ? "等 " + pn + " 自評…" : "";
      wait.innerHTML = t;
    }
    var next = card.querySelector('[data-act="next"]');
    if (next) next.disabled = !(rd.rate[me] && p && rd.rate[p]);
    /* 共用提示：任何一人打開，兩邊都看得到 */
    var hintsEl = card.querySelector(".pr-hints");
    if (hintsEl && it) {
      var L = mode() === "jigsaw" ? [] : PR.layers(it), n = Math.min(rd.hints || 0, L.length);
      if (+hintsEl.getAttribute("data-n") !== n) {
        hintsEl.setAttribute("data-n", n);
        hintsEl.innerHTML = L.slice(0, n).map(function (x) { return PR.block(x.cls, SK.md(x.t), SK.md(x.html)); }).join("");
      }
      var hb = card.querySelector('[data-act="hint"]');
      if (hb) {
        var out = mode() === "team" && hintsUsed() >= R.S.setup.budget;
        hb.hidden = n >= L.length;
        hb.disabled = out;
        if (n < L.length) hb.innerHTML = out ? "團隊提示用完了，靠討論吧" : "還卡著？一起打開：" + SK.md(L[n].t) +
          (mode() === "team" ? "（剩 " + (R.S.setup.budget - hintsUsed()) + " 次）" : "");
      }
    }
  }

  /* ---------- 聊天 ---------- */
  function sysMsg(text) {
    if (!R) return;
    R.chat.push({ id: uid4(), sys: true, text: text, at: Date.now() });
    renderChat();
  }
  function addChat(m, quiet) {
    if (!R || !m || !m.id || m.sys || R.chat.some(function (x) { return x.id === m.id; })) return;
    R.chat.push({ id: String(m.id).slice(0, 40), uid: m.uid, nick: cleanNick(m.nick), text: String(m.text || "").slice(0, CHAT_MAX), at: +m.at || Date.now() });
    R.chat.sort(function (a, b) { return a.at - b.at; });
    if (R.chat.length > CHAT_KEEP) R.chat.splice(0, R.chat.length - CHAT_KEEP);
    if (!quiet) renderChat();
  }
  function renderChat() {
    var box = view.querySelector(".duo-chat");
    if (!box) return;
    var stick = box.scrollHeight - box.scrollTop - box.clientHeight < 40;
    box.innerHTML = R.chat.map(function (m) {
      if (m.sys) return '<p class="duo-msg sys">' + esc(m.text) + "</p>";
      var t = new Date(m.at), hm = ("0" + t.getHours()).slice(-2) + ":" + ("0" + t.getMinutes()).slice(-2);
      return '<div class="duo-msg' + (m.uid === me ? " me" : "") + '"><span class="who">' + esc(m.nick || "同學") + " · " + hm + "</span>" +
        "<div>" + safeMd(m.text) + "</div></div>";
    }).join("");
    if (stick) box.scrollTop = box.scrollHeight;
  }
  function sendChat() {
    var ta = view.querySelector(".duo-say textarea"), text = ta.value.trim().slice(0, CHAT_MAX);
    if (!text || !R || stage() === "observe") return;
    if (Date.now() - R.chatAt < 700) return;
    if (PRIVATE.test(text) && !window.confirm("這則訊息看起來包含 Email、電話或社群帳號。\n在這裡不要分享個人資料喔。確定還是要送出嗎？")) return;
    R.chatAt = Date.now();
    var m = { id: uid4(), uid: me, nick: nickOf(me), text: text, at: Date.now() };
    addChat(m);
    R.ch.send({ type: "broadcast", event: "chat", payload: m });
    ta.value = "";
  }

  /* ---------- 共用白板 ---------- */
  var COLORS = [["#3A302A", "墨"], ["#B8674A", "橘"], ["#4F7479", "藍"], ["#647A58", "綠"]];
  var pen = { c: COLORS[0][0], w: 3 }, drawing = null;
  function setupBoard() {
    var tools = view.querySelector(".duo-tools"), cv = view.querySelector("canvas");
    tools.innerHTML = COLORS.map(function (c, i) {
      return '<button type="button" class="duo-swatch" data-c="' + c[0] + '" aria-pressed="' + (i ? "false" : "true") + '" aria-label="' + c[1] + '色" style="--sw:' + c[0] + '"></button>';
    }).join("") +
      '<button type="button" class="chip" data-w="3" aria-pressed="true">細</button><button type="button" class="chip" data-w="7" aria-pressed="false">粗</button>' +
      '<button type="button" class="btn small ghost" data-act="undo">復原我的上一筆</button>' +
      '<button type="button" class="btn small ghost" data-act="clear">清空白板</button>';
    tools.querySelectorAll("[data-c]").forEach(function (b) {
      b.onclick = function () { pen.c = b.getAttribute("data-c"); tools.querySelectorAll("[data-c]").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); }); };
    });
    tools.querySelectorAll("[data-w]").forEach(function (b) {
      b.onclick = function () { pen.w = +b.getAttribute("data-w"); tools.querySelectorAll("[data-w]").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); }); };
    });
    tools.querySelector('[data-act="undo"]').onclick = function () {
      var qi = R.S.qi, clearAt = cur().clearAt || 0;
      var mine = Object.keys(R.strokes).map(function (k) { return R.strokes[k]; })
        .filter(function (s) { return s.uid === me && s.qi === qi && s.at > clearAt; })
        .sort(function (a, b) { return b.at - a.at; })[0];
      if (!mine) return;
      delete R.strokes[mine.id];
      R.ch.send({ type: "broadcast", event: "unstroke", payload: { id: mine.id } });
      drawBoard();
    };
    tools.querySelector('[data-act="clear"]').onclick = function () {
      if (!window.confirm("清空兩個人的白板？")) return;
      change(function (S) { round(S, S.qi).clearAt = Date.now(); });
    };

    function pt(ev) {
      var r = cv.getBoundingClientRect();
      return [Math.round((ev.clientX - r.left) / r.width * 1000), Math.round((ev.clientY - r.top) / r.height * 625)];
    }
    function begin(start) {
      drawing = { id: uid4(), uid: me, qi: R.S.qi, c: pen.c, w: pen.w, p: start ? start.slice() : [], at: Date.now(), sent: 0 };
      R.strokes[drawing.id] = drawing;
    }
    cv.addEventListener("pointerdown", function (ev) {
      if (!R || stage() === "observe") return;
      try { cv.setPointerCapture(ev.pointerId); } catch (e) { /* 觸控筆或合成事件可能不支援 */ }
      begin(pt(ev));
      flushLater();
      drawBoard();
    });
    cv.addEventListener("pointermove", function (ev) {
      if (!drawing) return;
      var q = pt(ev), p = drawing.p, n = p.length;
      if (n >= 2 && Math.abs(p[n - 2] - q[0]) + Math.abs(p[n - 1] - q[1]) < 3) return;
      p.push(q[0], q[1]);
      /* 一筆太長就接著開新的一筆，讓每則訊息保持小小的 */
      if (p.length >= 600) { flush(); begin(q); }
      flushLater();
      drawBoard();
    });
    function end() { if (drawing) { flush(); drawing = null; } }
    cv.addEventListener("pointerup", end);
    cv.addEventListener("pointercancel", end);
    var timer = 0;
    function flushLater() { if (!timer) timer = setTimeout(function () { timer = 0; flush(); }, 90); }
    function flush() {
      if (!drawing || !R || drawing.sent === drawing.p.length) return;
      drawing.sent = drawing.p.length;
      var s = drawing;
      R.ch.send({ type: "broadcast", event: "stroke", payload: { id: s.id, uid: s.uid, qi: s.qi, c: s.c, w: s.w, p: s.p, at: s.at } });
    }
  }
  function addStroke(s, quiet) {
    if (!R || !s || !s.id || !Array.isArray(s.p)) return;
    if (!/^#[0-9A-Fa-f]{6}$/.test(s.c)) s.c = COLORS[0][0];
    s.w = Math.min(Math.max(+s.w || 3, 1), 12);
    s.p = s.p.slice(0, 600).map(function (v) { return +v || 0; });
    R.strokes[s.id] = s;
    if (!quiet) drawBoard();
  }
  function drawBoard() {
    if (!R) return;
    var cv = view.querySelector("canvas");
    if (!cv) return;
    var g = cv.getContext("2d"), qi = R.S.qi, clearAt = cur().clearAt || 0;
    g.clearRect(0, 0, cv.width, cv.height);
    g.lineCap = "round";
    g.lineJoin = "round";
    Object.keys(R.strokes).forEach(function (k) {
      var s = R.strokes[k], p = s.p;
      if (s.qi !== qi || s.at <= clearAt || p.length < 2) return;
      g.strokeStyle = s.c;
      g.lineWidth = s.w;
      g.beginPath();
      g.moveTo(p[0], p[1]);
      if (p.length === 2) g.lineTo(p[0] + .1, p[1]);
      for (var i = 2; i < p.length; i += 2) g.lineTo(p[i], p[i + 1]);
      g.stroke();
    });
  }

  /* ---------- 封鎖與檢舉 ---------- */
  function blockPartner() {
    var p = partnerId();
    if (!p || !window.confirm("封鎖 " + nickOf(p) + "？\n你會離開這間房，之後也不會再被配到一起。")) return;
    var code = R.code;
    client.rpc("duo_block", { p_code: code }).then(function (res) {
      if (res.error) throw res.error;
      leaveRoom("已封鎖，你們不會再被配到一起。");
    }).catch(function (e) { window.alert(errText(e)); });
  }
  function reportDialog() {
    var p = partnerId();
    if (!p) return;
    var dlg = view.querySelector(".duo-dialog");
    dlg.innerHTML =
      '<form method="dialog" class="duo-report">' +
      "<h3 class=\"hand\">檢舉 " + esc(nickOf(p)) + "</h3>" +
      "<p class=\"muted\">送出後你會立刻離開房間，系統也會封鎖對方，你們不會再被配到一起。管理員會看過檢舉內容。</p>" +
      '<fieldset><legend>發生了什麼事？</legend>' +
      [["harass", "罵人、嘲笑或霸凌"], ["sexual", "性相關或讓人不舒服的內容"], ["privacy", "問我的個人資料，或約見面"], ["spam", "洗版、廣告"], ["other", "其他"]].map(function (r, i) {
        return '<label><input type="radio" name="reason" value="' + r[0] + '"' + (i ? "" : " checked") + "> " + r[1] + "</label>";
      }).join("") + "</fieldset>" +
      '<label class="pr-q" for="duo-note">想補充的話（選填）</label><textarea id="duo-note" class="pr-ta" rows="3" maxlength="500"></textarea>' +
      '<label class="duo-check"><input type="checkbox" name="tx" checked> 附上這間房的聊天紀錄，幫管理員判斷</label>' +
      '<p class="muted">如果覺得有危險，請馬上告訴老師或家長。</p>' +
      '<div class="pr-row"><button class="btn" value="send">送出檢舉</button><button class="btn ghost" value="cancel">取消</button></div></form>';
    dlg.querySelector("form").onsubmit = function (ev) {
      if (ev.submitter && ev.submitter.value !== "send") return;
      ev.preventDefault();
      var f = ev.target, code = R.code;
      var tx = f.tx.checked ? R.chat.filter(function (m) { return !m.sys; }).slice(-100).map(function (m) {
        return { who: m.uid === me ? "reporter" : "reported", nick: m.nick, text: m.text, at: new Date(m.at).toISOString() };
      }) : null;
      f.querySelector('[value="send"]').disabled = true;
      client.rpc("duo_report", { p_code: code, p_reason: f.reason.value, p_note: f.querySelector("#duo-note").value, p_transcript: tx }).then(function (res) {
        if (res.error) throw res.error;
        dlg.close();
        leaveRoom("已送出檢舉，也已封鎖對方。謝謝你說出來。");
      }).catch(function (e) { f.querySelector('[value="send"]').disabled = false; window.alert(errText(e)); });
    };
    dlg.showModal();
  }

  /* =========================================================
     本週挑戰的分享圖：1080×1350 直式（IG 貼文／限動都適用），只放自己的暱稱
     ========================================================= */
  view.addEventListener("click", function (ev) {
    var b = ev.target.closest && ev.target.closest("[data-share]");
    if (!b) return;
    var rec;
    try { rec = JSON.parse(b.getAttribute("data-share")); } catch (e) { return; }
    shareDialog(rec);
  });

  var FH = '"LXGW WenKai TC", "Kaiti TC", "DFKai-SB", serif';
  var FB = '"Chiron GoRound TC", "PingFang TC", "Microsoft JhengHei", sans-serif';
  var FL = '"Patrick Hand", "Comic Sans MS", cursive';
  function drawShare(rec) {
    var W = 1080, H = 1350, pass = rec.stars >= rec.goal;
    var lines = {
      brand: "圖解數學小鎮・合作挑戰",
      week: rec.week ? "期間限定 " + weekLabel(rec.week) : "雙人解題室",
      head: pass ? "過關！" : "挑戰完成",
      mode: MODES[rec.mode] ? MODES[rec.mode].name : "合作挑戰",
      score: "我們一起拿到 " + rec.stars + " / " + rec.total + " 顆星",
      sub: "目標 " + rec.goal + " 顆・不計時，兩個人一起想",
      who: getNick() + " 和隊友",
      url: location.host + "/duo/",
      tag: "See it, then say it."
    };
    var text = Object.keys(lines).map(function (k) { return lines[k]; }).join("");
    var fonts = document.fonts ? Promise.all([
      document.fonts.load("700 140px " + FH, text), document.fonts.load("400 48px " + FB, text), document.fonts.load("40px " + FL, text)
    ]).catch(function () {}) : Promise.resolve();
    return fonts.then(function () {
      var cv = document.createElement("canvas");
      cv.width = W; cv.height = H;
      var g = cv.getContext("2d");
      g.fillStyle = "#F7F3EA"; g.fillRect(0, 0, W, H);
      g.fillStyle = "rgba(74,63,55,.10)";
      for (var gx = 18; gx < W; gx += 36) for (var gy = 18; gy < H; gy += 36) { g.beginPath(); g.arc(gx, gy, 1.6, 0, 7); g.fill(); }
      g.fillStyle = "#FAE8DD"; g.beginPath(); g.arc(930, 150, 230, 0, 7); g.fill();
      g.fillStyle = "#EAF2EC"; g.beginPath(); g.arc(130, 1230, 210, 0, 7); g.fill();
      roundRect(g, 70, 90, 940, 1170, 46); g.fillStyle = "#FDFBF6"; g.fill();
      g.lineWidth = 3; g.strokeStyle = "#4A3F37"; g.stroke();
      g.textAlign = "center"; g.textBaseline = "alphabetic";
      fit(g, lines.brand, "700 46px " + FH, 820); g.fillStyle = "#6F645A"; g.fillText(lines.brand, 540, 205);
      fit(g, lines.week, "400 36px " + FB, 820); g.fillStyle = "#4F8270"; g.fillText(lines.week, 540, 262);
      fit(g, lines.head, "700 150px " + FH, 820); g.fillStyle = "#3A302A"; g.fillText(lines.head, 540, 450);
      g.font = "700 50px " + FH;
      var mw = g.measureText(lines.mode).width + 90;
      roundRect(g, 540 - mw / 2, 500, mw, 84, 42); g.fillStyle = pass ? "#FAE8DD" : "#F8F1DC"; g.fill();
      g.lineWidth = 2.5; g.strokeStyle = "#B8674A"; g.stroke();
      g.fillStyle = "#3A302A"; g.fillText(lines.mode, 540, 559);
      var n = rec.total, size = Math.min(150, 760 / n), x0 = 540 - size * n / 2 + size / 2;
      for (var i = 0; i < n; i++) star(g, x0 + i * size, 720, size * 0.42, i < rec.stars);
      fit(g, lines.score, "700 56px " + FH, 840); g.fillStyle = "#3A302A"; g.fillText(lines.score, 540, 880);
      fit(g, lines.sub, "400 34px " + FB, 840); g.fillStyle = "#6F645A"; g.fillText(lines.sub, 540, 940);
      g.strokeStyle = "rgba(74,63,55,.35)"; g.lineWidth = 2; g.setLineDash([4, 10]);
      g.beginPath(); g.moveTo(170, 1000); g.lineTo(910, 1000); g.stroke(); g.setLineDash([]);
      fit(g, lines.who, "700 46px " + FH, 820); g.fillStyle = "#3A302A"; g.fillText(lines.who, 540, 1085);
      fit(g, lines.url, "400 32px " + FB, 820); g.fillStyle = "#4F7479"; g.fillText(lines.url, 540, 1165);
      g.font = "40px " + FL; g.fillStyle = "#6F645A"; g.fillText(lines.tag, 540, 1220);
      return new Promise(function (resolve, reject) { cv.toBlob(function (bl) { if (bl) resolve(bl); else reject(); }, "image/png"); });
    });
  }
  function roundRect(g, x, y, w, h, rr) {
    g.beginPath(); g.moveTo(x + rr, y); g.arcTo(x + w, y, x + w, y + h, rr); g.arcTo(x + w, y + h, x, y + h, rr);
    g.arcTo(x, y + h, x, y, rr); g.arcTo(x, y, x + w, y, rr); g.closePath();
  }
  /* 字太長就縮小，直到放得進 maxW */
  function fit(g, text, font, maxW) {
    g.font = font;
    var px = +/(\d+)px/.exec(font)[1];
    while (g.measureText(text).width > maxW && px > 20) { px -= 2; g.font = font.replace(/\d+px/, px + "px"); }
  }
  function star(g, cx, cy, R0, on) {
    g.beginPath();
    for (var i = 0; i < 10; i++) {
      var ang = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? R0 * 0.45 : R0;
      if (i) g.lineTo(cx + rr * Math.cos(ang), cy + rr * Math.sin(ang)); else g.moveTo(cx + rr * Math.cos(ang), cy + rr * Math.sin(ang));
    }
    g.closePath();
    g.fillStyle = on ? "#E2B44B" : "#FDFBF6"; g.fill();
    g.lineWidth = 4; g.lineJoin = "round"; g.strokeStyle = on ? "#9C7A2A" : "#B8AC9C"; g.stroke();
  }
  /* =========================================================
     分享畫面：合作挑戰結束後（或大廳的最佳紀錄）
     ‧ 分享圖：直接顯示，可以叫出系統分享或下載
     ‧ 邀請連結：朋友點開會看到這次的挑戰和成績，登入後開房或配對一起來
     ‧ 開新房間：離開這間，開一間新的把房號傳給下一位朋友
     連結只帶週次、玩法和星星數；分享圖上只有自己的暱稱，不帶對方的名字或任何 Email。
     ========================================================= */
  function inviteLink(rec) {
    var u = new URL(location.origin + location.pathname);
    u.searchParams.set("invite", String(rec.week || 0));
    if (MODES[rec.mode]) u.searchParams.set("m", rec.mode);
    u.searchParams.set("s", String(rec.stars));
    u.searchParams.set("t", String(rec.total));
    return u.toString();
  }
  function inviteText(rec) {
    var m = MODES[rec.mode] ? MODES[rec.mode].name : "合作挑戰";
    return "我們在圖解數學小鎮的" + (rec.week ? "本週" : "") + "雙人合作挑戰（" + m + "）一起拿到 " + rec.stars + "/" + rec.total + " 顆星！你也找個同學一起來挑戰：";
  }
  function inviteBanner() {
    if (!INVITE) return "";
    var m = MODES[INVITE.mode] ? MODES[INVITE.mode].name : "", cur = weekNo();
    var got = INVITE.total ? "他們一起拿到 ★ " + INVITE.stars + " / " + INVITE.total + "。" : "";
    var body;
    if (INVITE.week && INVITE.week !== cur) {
      body = "這是 " + weekLabel(INVITE.week) + " 的合作挑戰邀請，那一週已經結束了；本週有新的題組，一樣可以找同學一起挑戰。";
    } else if (INVITE.week) {
      body = "朋友邀請你挑戰本週的合作挑戰" + (m ? "「" + m + "」" : "") + "。" + got + "找一位同學開房，或隨機配對，看看你們能拿幾顆星！";
    } else {
      body = "朋友邀請你來雙人解題室一起刷題" + (m ? "（玩法：" + m + "）" : "") + "。" + got + "找一位同學開房，或隨機配對一起來吧！";
    }
    return '<div class="duo-invite"><b>' + SK.icon("heart") + "你收到一個邀請</b><p>" + body + "</p></div>";
  }

  function sharePanel(el, rec) {
    var link = inviteLink(rec), pass = rec.stars >= rec.goal;
    el.innerHTML = '<div class="duo-share-panel">' +
      '<div class="duo-share-pic"><p class="muted">分享圖產生中…</p></div>' +
      '<div class="duo-share-side"><h4 class="hand">' + (pass ? "過關了，讓更多人一起來刷題！" : "邀朋友一起來挑戰！") + "</h4>" +
      "<p>把邀請連結傳給朋友：他們點開就會看到這次的挑戰和你們的星星，登入後找同學開房或隨機配對，一起拿星星。</p>" +
      '<div class="duo-link"><input readonly value="' + esc(link) + '" aria-label="邀請連結"><button class="btn small" type="button" data-act="copy-link">複製連結</button></div>' +
      '<div class="pr-row">' +
      '<a class="btn small sky" target="_blank" rel="noopener" href="https://social-plugins.line.me/lineit/share?url=' + encodeURIComponent(link) + '">傳到 LINE</a>' +
      (navigator.share ? '<button class="btn small ghost" type="button" data-act="share-link">其他分享方式…</button>' : "") + "</div>" +
      '<div class="pr-row"><button class="btn small ghost" type="button" data-act="new-room">' + SK.icon("sparkle") + "開一間新房間，邀請下一位朋友</button></div>" +
      '<p class="muted duo-share-note">連結只帶週次、玩法和星星數；分享圖上只有你的暱稱，不會出現對方的名字或任何人的 Email。</p>' +
      "</div></div>";

    var input = el.querySelector(".duo-link input"), copyBtn = el.querySelector('[data-act="copy-link"]');
    input.onclick = function () { input.select(); };
    copyBtn.onclick = function () {
      var done = function () { copyBtn.textContent = "已複製！"; setTimeout(function () { copyBtn.textContent = "複製連結"; }, 1600); };
      (navigator.clipboard ? navigator.clipboard.writeText(inviteText(rec) + " " + link) : Promise.reject()).then(done, function () {
        input.select();
        try { document.execCommand("copy"); done(); } catch (e) { window.prompt("複製這個連結傳給朋友：", link); }
      });
    };
    var sl = el.querySelector('[data-act="share-link"]');
    if (sl) sl.onclick = function () { navigator.share({ title: "圖解數學小鎮・雙人合作挑戰", text: inviteText(rec), url: link }).catch(function () {}); };
    el.querySelector('[data-act="new-room"]').onclick = function (ev) {
      if (R && !window.confirm("開新房間會離開這一間。確定嗎？")) return;
      ev.target.disabled = true;
      var dlg = el.closest("dialog");
      if (dlg) dlg.close();
      if (R) leaveRoom(null, true);
      client.rpc("duo_create").then(function (res) {
        if (res.error) throw res.error;
        enterRoom({ code: res.data, role: "host", kind: "friend" });
        var roomLink = location.origin + location.pathname + "?room=" + res.data;
        if (navigator.clipboard) navigator.clipboard.writeText(roomLink).then(function () { sysMsg("新房間的邀請連結已經複製好了，貼給朋友就能直接進來。"); }, function () {});
      }).catch(function (e) { lobby(errText(e)); });
    };

    var pic = el.querySelector(".duo-share-pic");
    drawShare(rec).then(function (blob) {
      var url = URL.createObjectURL(blob), name = "合作挑戰-" + (rec.week ? weekLabel(rec.week).replace(/\//g, "") : "雙人") + ".png";
      var file = window.File ? new File([blob], name, { type: "image/png" }) : null;
      var canShare = !!(file && navigator.canShare && navigator.canShare({ files: [file] }));
      pic.innerHTML = '<img class="duo-share-img" alt="合作挑戰的分享圖" src="' + url + '">' +
        '<div class="pr-row duo-pic-row">' + (canShare ? '<button class="btn small" type="button" data-act="share-pic">分享圖片…</button>' : "") +
        '<a class="btn small' + (canShare ? " ghost" : "") + '" href="' + url + '" download="' + name + '">下載圖片</a></div>';
      var sp = pic.querySelector('[data-act="share-pic"]');
      if (sp) sp.onclick = function () { navigator.share({ files: [file], title: "圖解數學小鎮・雙人合作挑戰", text: inviteText(rec) + " " + link }).catch(function () {}); };
    }, function () { pic.innerHTML = '<p class="muted">這個瀏覽器做不出分享圖，可以直接傳邀請連結。</p>'; });
  }

  function shareDialog(rec) {
    var dlg = document.querySelector(".duo-share");
    if (!dlg) { dlg = SK.h("dialog", { class: "duo-dialog duo-share" }); document.body.appendChild(dlg); }
    dlg.innerHTML = '<h3 class="hand">分享我的紀錄</h3><div class="duo-share-slot"></div>' +
      '<div class="pr-row"><button class="btn ghost" type="button" data-act="close">關閉</button></div>';
    dlg.querySelector('[data-act="close"]').onclick = function () { dlg.close(); };
    sharePanel(dlg.querySelector(".duo-share-slot"), rec);
    dlg.showModal();
  }

  window.addEventListener("pagehide", function () { stopMatching(true); });
})();
