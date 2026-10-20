/* =========================================================
   練習場共用（SK.PR）：解題練習場（單人）與雙人解題室都用這一份。
   ‧ 題庫：歷屆題卡來自 past-bank.js；換你算、天花板挑戰與單元自己的「考過的樣子」，
     是把 units/<slug>.js 載進來、攔下它交給 SK.mountUnit 的設定取出來的——題目不另外抄一份。
   ‧ 進度：localStorage 的 sk-practice，每題一筆；登入後用 ACCOUNT.syncMap 跨裝置同步。
     雙人模式自評的結果也記在這裡，和單人練習共用同一條複習時間表。
   ‧ 題卡規則（本站的數學規則）：先寫「你看到什麼」→ 看法一／看法二 → 最多人卡在這裡 → 最後才對答案。
   ========================================================= */
(function () {
  "use strict";
  var cat = window.CATALOG;
  var KEY = "sk-practice";
  var PR = (SK.PR = {});
  PR.INTERVAL = [0, 1, 3, 7, 16, 35];       /* 第 b 格的題目幾天後再出現 */
  PR.LETTER = ["(1)", "(2)", "(3)", "(4)", "(5)"];
  PR.KINDS = {
    past: { name: "考過的題目" },
    try: { name: "換你算" },
    challenge: { name: "天花板挑戰" },
    contest: { name: "競賽題型" },
    school: { name: "段考型練習" }
  };
  PR.ready = cat.units.filter(function (u) { return u.ready; });

  /* ---------- 小工具 ---------- */
  var esc = (PR.esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  });
  /* 使用者自己打的字（包括對方傳來的）：文字一律跳脫，只有 $…$ 交給 KaTeX */
  PR.safeMd = function (s) {
    s = String(s == null ? "" : s);
    var out = "", re = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g, last = 0, m;
    while ((m = re.exec(s))) {
      out += esc(s.slice(last, m.index)) + SK.tex(m[1] || m[2], !!m[1]);
      last = re.lastIndex;
    }
    return (out + esc(s.slice(last))).replace(/\n/g, "<br>");
  };
  function hash(s) {
    var h = 5381;
    for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    return (h >>> 0).toString(36);
  }
  var shuffle = (PR.shuffle = function (a) {
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  });
  var today = (PR.today = function () {
    var d = new Date();
    return Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 86400000);
  });
  function stripTags(s) { return String(s || "").replace(/<[^>]+>/g, ""); }

  /* ---------- 進度 ---------- */
  /* 每題一筆：{ b 格子, d 到期日(本地日數), n 練過次數, ok 穩了次數, o 上次寫的觀察, u 單元, k 題型, t 時間 } */
  var acct = null, syncListeners = [];
  /* localStorage 裡的一個 JSON 物件，每個 key 一筆；三張表（進度、錯題本、合作挑戰）都用這兩個函式 */
  function readMap(key) {
    try {
      var o = JSON.parse(localStorage.getItem(key) || "{}");
      return o && typeof o === "object" && !Array.isArray(o) ? o : {};
    } catch (e) { return {}; }
  }
  function putEntry(key, id, rec) {
    var p = readMap(key);
    if (rec === null) delete p[id]; else p[id] = rec;
    try { localStorage.setItem(key, JSON.stringify(p)); } catch (e) { /* 無痕模式：這一輪仍可練，只是記不住 */ }
    if (acct && acct.user()) acct.syncSoon();
  }
  var readProg = (PR.read = function () { return readMap(KEY); });
  function saveRec(id, rec) { putEntry(KEY, id, rec); }
  /* 雲端同步改動了本機資料時通知頁面重畫 */
  PR.onSync = function (fn) { syncListeners.push(fn); };
  function changed() { syncListeners.forEach(function (fn) { fn(); }); }
  SK.account().then(function (A) {
    if (!A.available()) return;
    acct = A;
    A.syncMap({ key: KEY, prefix: "practice.", onChange: changed });
    A.syncMap({ key: BOOK, prefix: "notebook.", onChange: changed });
    A.syncMap({ key: COOP, prefix: "coop.", onChange: changed });
  });

  /* ---------- 錯題本：只收自己按「加入錯題本」的題目 ----------
     每題一筆：{ u 單元, k 題型, src 出處, a 當時的答案, o 當時的觀察, why 錯因標籤, note 錯因筆記,
                st "open" 待訂正／"done" 已訂正, rv 重做次數, at 加入時間, t 最後修改 } */
  var BOOK = "sk-notebook";
  PR.WHY = [["read", "看錯題目"], ["concept", "概念不熟"], ["calc", "計算失誤"], ["method", "沒想到方法"], ["other", "其他"]];
  PR.book = {
    all: function () { return readMap(BOOK); },
    get: function (id) { return readMap(BOOK)[id] || null; },
    open: function () {
      var b = readMap(BOOK);
      return Object.keys(b).filter(function (id) { return b[id] && b[id].st !== "done"; });
    },
    add: function (it, answer, obs) {
      var old = readMap(BOOK)[it.id];
      putEntry(BOOK, it.id, Object.assign({ why: [], note: "", rv: 0, at: Date.now() }, old || {}, {
        u: it.slug, k: it.kind, src: it.src, a: String(answer || "").slice(0, 500), o: String(obs || "").slice(0, 300),
        st: "open", t: Date.now()
      }));
    },
    update: function (id, patch) {
      var old = readMap(BOOK)[id];
      if (!old) return;
      putEntry(BOOK, id, Object.assign({}, old, patch, { t: Date.now() }));
    },
    remove: function (id) { putEntry(BOOK, id, null); }
  };
  /* 當時的答案寫成一行字，錯題本裡顯示用 */
  PR.answerText = function (it, chosen, text, gaveUp) {
    if (gaveUp) return "卡住了，沒有作答";
    if (it.opts) return (chosen || []).slice().sort().map(function (k) { return PR.LETTER[k]; }).join("");
    return String(text || "");
  };
  /* 對答案後的「加入錯題本」：加入後可以馬上點選錯因 */
  PR.bookWidget = function (it, answer, obs) {
    var el = SK.h("div", { class: "pr-book" });
    function render() {
      var e = PR.book.get(it.id);
      if (!e || e.st === "done") {
        el.innerHTML = '<button type="button" class="btn small ghost" data-act="book-add">' + SK.icon("leaf") + (e ? "再加回錯題本" : "加入錯題本") + "</button>" +
          '<span class="muted">想之後再訂正一次的題目，收進錯題本。</span>';
        el.querySelector('[data-act="book-add"]').onclick = function () { PR.book.add(it, answer, obs); render(); };
        return;
      }
      el.innerHTML = '<p class="pr-book-head">✓ 已在錯題本。為什麼會卡住？（可複選，之後也能改）</p><div class="pr-chips">' +
        PR.WHY.map(function (w) {
          return '<button type="button" class="chip" data-why="' + w[0] + '" aria-pressed="' + (e.why.indexOf(w[0]) >= 0) + '">' + w[1] + "</button>";
        }).join("") + '</div><a class="src-link" href="../practice/notebook.html">到錯題本寫錯因筆記 →</a>';
      el.querySelectorAll("[data-why]").forEach(function (b) {
        b.onclick = function () {
          var cur = (PR.book.get(it.id) || {}).why || [], w = b.getAttribute("data-why");
          var next = cur.indexOf(w) >= 0 ? cur.filter(function (x) { return x !== w; }) : cur.concat([w]);
          PR.book.update(it.id, { why: next });
          b.setAttribute("aria-pressed", next.indexOf(w) >= 0 ? "true" : "false");
        };
      });
    }
    render();
    return el;
  };

  /* ---------- 合作挑戰的紀錄：每週一筆 { stars, total, goal, mode, at } ---------- */
  var COOP = "sk-coop";
  PR.coop = {
    get: function (week) { return readMap(COOP)["w" + week] || null; },
    save: function (week, rec) {
      var old = readMap(COOP)["w" + week];
      if (old && old.stars >= rec.stars) return;      /* 只留最好的一次 */
      putEntry(COOP, "w" + week, rec);
    }
  };

  PR.stats = function () {
    var p = readProg(), t = today(), s = { seen: 0, due: 0, solid: 0, tomorrow: 0 };
    Object.keys(p).forEach(function (id) {
      var r = p[id];
      if (!r || typeof r !== "object") return;
      s.seen++;
      if (r.d <= t) s.due++;
      else if (r.d === t + 1) s.tomorrow++;
      if (r.b >= 3) s.solid++;
    });
    return s;
  };

  /* 「穩了」至少跳到第 2 格（3 天後），和「有點卡」的明天拉開 */
  function nextBox(rec) { return Math.min(Math.max((rec ? rec.b : 0) + 1, 2), PR.INTERVAL.length - 1); }
  /* 自評後寫進進度：r 是 again／shaky／solid */
  PR.record = function (it, r, obs) {
    var rec = readProg()[it.id] || null, old = rec || { b: 0, n: 0, ok: 0 };
    var b = r === "solid" ? nextBox(rec) : r === "shaky" ? 1 : 0;
    saveRec(it.id, {
      b: b, d: today() + PR.INTERVAL[b], n: (old.n || 0) + 1, ok: (old.ok || 0) + (r === "solid" ? 1 : 0),
      o: String(obs || "").slice(0, 300), u: it.slug, k: it.kind, t: Date.now()
    });
  };

  /* ---------- 題目來源 ---------- */
  var captured = {}, loading = {};
  SK.mountUnit = function (cfg) { captured[cfg.slug] = cfg; };
  function loadUnit(slug) {
    if (!loading[slug]) {
      loading[slug] = new Promise(function (resolve) {
        var el = document.createElement("script");
        el.src = "../units/" + slug + ".js";
        el.onload = function () { resolve(captured[slug] || null); };
        el.onerror = function () { resolve(null); };
        document.head.appendChild(el);
      });
    }
    return loading[slug];
  }

  /* 選擇題的答案寫成 <b>(1)(3)</b> 開頭，就能自動對答案 */
  function parseKey(ans) {
    var m = /^\s*<b>((?:\(\d\))+)<\/b>/.exec(ans || "");
    if (!m) return null;
    return m[1].match(/\d/g).map(function (d) { return +d - 1; });
  }
  function pastItem(card, slug) {
    var key = card.opts ? parseKey(card.ans) : null;
    return {
      id: "p." + hash(card.src + "|" + card.q), slug: slug, kind: "past",
      src: card.src, url: card.url, q: card.q, opts: card.opts || null,
      key: key, multi: !!key && (key.length > 1 || /多選/.test(card.src)),
      see: card.see || "", ways: card.ways || [],
      trap: card.trap || "", trapTitle: "最多人卡在這裡",
      ans: card.ans || "", ansTitle: "答案"
    };
  }
  /* bank-2026-10.js 的題卡（學測／分科題意整理、競賽題型與段考型練習的原創題） */
  function bankItem(c, slug) {
    var key = c.opts ? parseKey(c.ans) : null;
    return {
      id: "q." + c.id, slug: slug, kind: c.kind, src: c.src, url: c.url || "", q: c.q, opts: c.opts || null,
      key: key, multi: !!key && (key.length > 1 || /多選/.test(c.src)),
      see: c.see || "", ways: c.ways || [], trap: c.trap || "", trapTitle: "最多人卡在這裡",
      ans: c.ans || "", ansTitle: "答案"
    };
  }
  function unitItems(slug, cfg) {
    var out = [];
    (SK.PAST_BY_UNIT[slug] || []).forEach(function (c) { out.push(pastItem(c, slug)); });
    (SK.BANK || []).forEach(function (c) { if (c.units.indexOf(slug) >= 0) out.push(bankItem(c, slug)); });
    if (!cfg) return out.concat(SK.houseItems ? SK.houseItems(slug) : []);
    ((cfg.where && cfg.where.past) || []).forEach(function (c) { out.push(pastItem(c, slug)); });
    (cfg.drills || []).forEach(function (d) {
      (d.tries || []).forEach(function (t) {
        var ways = [];
        if (t.hint) ways.push({ t: "給我一點提示", html: t.hint });
        if (d.demo) ways.push({
          t: "回頭看一次完整示範",
          html: d.demo.q + "<ol>" + d.demo.steps.map(function (s) { return "<li>" + s + "</li>"; }).join("") + "</ol>"
        });
        out.push({
          id: slug + ".t." + hash(t.q), slug: slug, kind: "try",
          src: "換你算 · " + stripTags(SK.md(d.title)), q: t.q, opts: null, key: null,
          see: "", ways: ways, trap: d.edge || "", trapTitle: "條件與反例",
          ans: t.ans, ansTitle: "答案"
        });
      });
    });
    (cfg.challenges || []).forEach(function (c, i) {
      out.push({
        id: slug + ".c." + hash(c.q), slug: slug, kind: "challenge",
        src: "天花板挑戰 · " + (c.lv || ["Warm-up", "Explore", "Wonder"][Math.min(i, 2)]),
        q: c.q, opts: null, key: null, see: "",
        ways: c.hint ? [{ t: "給我一點提示", html: c.hint }] : [],
        trap: "", trapTitle: "",
        ans: c.idea || "這題沒有標準答案。把你的想法寫下來，下次回來再看一次，看看自己會不會想得更遠。",
        ansTitle: "看一種想法（不是唯一答案）"
      });
    });
    return out.concat(SK.houseItems ? SK.houseItems(slug) : []);
  }
  var collect = (PR.collect = function (slugs) {
    return Promise.all(slugs.map(loadUnit)).then(function (cfgs) {
      var seen = {}, out = [];
      slugs.forEach(function (slug, i) {
        unitItems(slug, cfgs[i]).forEach(function (it) {
          if (seen[it.id]) return;
          seen[it.id] = 1;
          out.push(it);
        });
      });
      return out;
    });
  });
  /* past-bank.js 的歷屆題卡（不用載入單元），合作挑戰的每週題組從這裡挑 */
  /* withBank：連 bank-2026-10.js 的大考題也算進來（合作挑戰自 2026-10-19 那一週起才用，避免本週題組中途改變） */
  PR.bankItems = function (withBank) {
    var seen = {}, out = [];
    Object.keys(SK.PAST_BY_UNIT || {}).sort().forEach(function (slug) {
      SK.PAST_BY_UNIT[slug].forEach(function (c) {
        var it = pastItem(c, slug);
        if (!seen[it.id]) { seen[it.id] = 1; out.push(it); }
      });
    });
    if (withBank) (SK.BANK || []).forEach(function (c) {
      if (c.kind === "past" && !seen["q." + c.id]) { seen["q." + c.id] = 1; out.push(bankItem(c, c.units[0])); }
    });
    return out;
  };
  /* 雙人模式：房主排好的 [{id, slug}] 換回完整題目 */
  PR.resolve = function (refs) {
    var slugs = refs.map(function (r) { return r.slug; }).filter(function (s, i, a) { return cat.get(s) && a.indexOf(s) === i; });
    return collect(slugs).then(function (items) {
      var by = {};
      items.forEach(function (it) { by[it.id] = it; });
      return refs.map(function (r) { return by[r.id] || null; });
    });
  };

  /* ---------- 選範圍 ---------- */
  /* pick = { scope: "due"|"all"|地區 id, unit, kinds: {past,try,challenge}, size } */
  PR.newPick = function (size) {
    var pick = { scope: "all", unit: "", kinds: { past: true, try: true, challenge: true, contest: true, school: true }, size: size || 10 };
    var params = new URLSearchParams(location.search), deep = params.get("unit");
    if (deep && cat.get(deep) && cat.get(deep).ready) { pick.scope = cat.get(deep).region; pick.unit = deep; pick.deep = true; }
    else if (params.get("region") && cat.region(params.get("region"))) pick.scope = params.get("region");
    else if (params.get("due")) pick.scope = "due";
    /* 從錯題本來：?book=1 重做全部待訂正，?book=<題目 id> 只重做那一題 */
    var book = params.get("book");
    if (book) { pick.book = book; pick.deep = true; pick.size = 50; }
    var house = params.get("house");
    if (!book && house && cat.get(house) && SK.houseItems && SK.houseItems(house).length === 5) {
      pick.house = house; pick.unit = house; pick.scope = cat.get(house).region; pick.size = 5; pick.deep = true;
    }
    return pick;
  };

  /* 在 el 裡畫出範圍／題型／題數的選擇器。opts: { due, sizes, start, onStart(pick, msgEl, btn) } */
  PR.picker = function (el, pick, opts) {
    function chip(val, label, on, attr) {
      return '<button type="button" class="chip" ' + attr + '="' + val + '" aria-pressed="' + (on ? "true" : "false") + '">' + label + "</button>";
    }
    function render() {
      var s = PR.stats();
      var scopes = (opts.due ? chip("due", "今天到期（" + s.due + "）", pick.scope === "due", "data-scope") : "") +
        chip("all", "全部單元", pick.scope === "all", "data-scope") +
        cat.regions.map(function (r) { return chip(r.id, r.name, pick.scope === r.id, "data-scope"); }).join("");
      var unitOpts = "";
      if (pick.scope !== "due") {
        var list = pick.scope === "all" ? PR.ready : PR.ready.filter(function (u) { return u.region === pick.scope; });
        unitOpts = '<option value="">' + (pick.scope === "all" ? "全部單元一起刷" : "這個地區全部") + "</option>" +
          list.map(function (u) { return '<option value="' + u.slug + '"' + (pick.unit === u.slug ? " selected" : "") + ">" + esc(u.title) + (opts.house ? "・單元練習" : "") + "</option>"; }).join("");
      }
      var uid = "pk-" + Math.random().toString(36).slice(2, 7);
      el.innerHTML =
        '<div class="pr-field"><span class="pr-label">範圍</span><div class="pr-chips">' + scopes + "</div></div>" +
        (unitOpts ? '<div class="pr-field"><label class="pr-label" for="' + uid + '">單元</label><select id="' + uid + '" class="pr-select">' + unitOpts + "</select></div>" : "") +
        (opts.house && unitOpts ? '<div class="pr-house-info"><p>每間小屋都有原創練習。選一個單元，從暖身開始依序做。</p>' +
          (pick.unit ? '<a class="btn small sky" href="?house=' + encodeURIComponent(pick.unit) + '">練「' + esc(cat.get(pick.unit).title) + '」的練習 ' + SK.icon("arrow") + '</a>' : '') + '</div>' : '') +
        '<div class="pr-field"><span class="pr-label">題型</span><div class="pr-chips">' +
        Object.keys(PR.KINDS).map(function (k) { return chip(k, PR.KINDS[k].name, pick.kinds[k], "data-kind"); }).join("") + "</div></div>" +
        '<div class="pr-field"><span class="pr-label">這一輪</span><div class="pr-chips">' +
        (opts.sizes || [5, 10, 20]).map(function (n) { return chip(n, n + " 題", pick.size === n, "data-size"); }).join("") + "</div></div>" +
        '<div class="pr-go"><button class="btn" type="button" data-act="start">' + (opts.start || "開始") + " " + SK.icon("arrow") + "</button>" +
        '<span class="pr-msg muted" role="status"></span></div>';
      el.querySelectorAll("[data-scope]").forEach(function (b) {
        b.onclick = function () { pick.scope = b.getAttribute("data-scope"); pick.unit = ""; render(); };
      });
      el.querySelectorAll("[data-kind]").forEach(function (b) {
        b.onclick = function () {
          var k = b.getAttribute("data-kind");
          pick.kinds[k] = !pick.kinds[k];
          if (!Object.keys(pick.kinds).some(function (x) { return pick.kinds[x]; })) pick.kinds[k] = true;
          b.setAttribute("aria-pressed", pick.kinds[k] ? "true" : "false");
        };
      });
      el.querySelectorAll("[data-size]").forEach(function (b) {
        b.onclick = function () { pick.size = +b.getAttribute("data-size"); render(); };
      });
      var sel = el.querySelector("select");
      if (sel) sel.onchange = function () { pick.unit = sel.value; if (opts.house) { render(); el.querySelector("select").focus(); } };
      el.querySelector('[data-act="start"]').onclick = function () {
        opts.onStart(pick, el.querySelector(".pr-msg"), el.querySelector('[data-act="start"]'));
      };
    }
    render();
    return render;
  };

  /* 排一輪的題目：到期的先、沒見過的其次、還沒到期的墊後。回傳 Promise<{queue} | {msg}> */
  PR.buildQueue = function (pick) {
    var p = readProg(), t = today(), slugs;
    if (pick.book) {
      var all = readMap(BOOK);
      var ids = pick.book === "1" ? PR.book.open() : all[pick.book] ? [pick.book] : [];
      if (!ids.length) return Promise.resolve({ msg: "錯題本裡沒有待訂正的題目。" });
      ids.sort(function (a, b) { return (all[a].at || 0) - (all[b].at || 0); });
      return PR.resolve(ids.map(function (id) { return { id: id, slug: all[id].u }; })).then(function (items) {
        var queue = items.filter(Boolean);
        return queue.length ? { queue: queue } : { msg: "錯題本裡的題目找不到了，可能單元內容改過。" };
      });
    }
    if (pick.house) {
      var fixed = SK.houseItems ? SK.houseItems(pick.house) : [];
      return Promise.resolve(fixed.length === 5 ? { queue: fixed } : { msg: "這間小屋的題目載入失敗，請重新整理再試。" });
    }
    if (pick.scope === "due") {
      var due = Object.keys(p).filter(function (id) { return p[id] && p[id].d <= t; });
      if (!due.length) return Promise.resolve({ msg: "今天沒有到期的題目，選一個地區練新題吧。" });
      slugs = due.map(function (id) { return p[id].u; }).filter(function (u, i, a) { return u && cat.get(u) && a.indexOf(u) === i; });
    } else if (pick.unit) slugs = [pick.unit];
    else slugs = PR.ready.filter(function (u) { return pick.scope === "all" || u.region === pick.scope; }).map(function (u) { return u.slug; });

    return collect(slugs).then(function (items) {
      items = items.filter(function (it) { return pick.kinds[it.kind]; });
      if (pick.scope === "due") items = items.filter(function (it) { return p[it.id] && p[it.id].d <= t; });
      var dueL = [], fresh = [], later = [];
      items.forEach(function (it) {
        var r = p[it.id];
        if (!r) fresh.push(it); else if (r.d <= t) dueL.push(it); else later.push(it);
      });
      dueL.sort(function (a, b) { return p[a.id].d - p[b.id].d; });
      later.sort(function (a, b) { return p[a.id].d - p[b.id].d; });
      if (!pick.unit) shuffle(fresh);   /* 單一單元照原本的順序，由淺到深 */
      var queue = dueL.concat(fresh, later).slice(0, pick.size);
      return queue.length ? { queue: queue } : { msg: "這個範圍還沒有符合題型的題目，換個題型或範圍試試。" };
    });
  };

  /* ---------- 解題練習場的入口：單人與雙人是同一個地方的兩種玩法 ---------- */
  PR.modes = function (active) {
    var open = PR.book.open().length;
    var m = [
      ["solo", "../practice/index.html", "自己慢慢刷", "自己練", "一次一題，照自己的步調"],
      ["duo", "../duo/index.html", "找同學一起解", "一起解", "即時連線・合作挑戰・需要登入"],
      ["book", "../practice/notebook.html", "我的錯題本", "錯題本", open ? open + " 題待訂正" : "收集想再訂正的題目"]
    ];
    return '<nav class="pr-modes" aria-label="解題方式" style="--modes:' + m.length + '">' + m.map(function (x) {
      return '<a href="' + x[1] + '"' + (x[0] === active ? ' aria-current="page"' : "") + '><b><span class="long">' + x[2] +
        '</span><span class="short">' + x[3] + (x[0] === "book" && open ? "・" + open : "") + "</span></b><span>" + x[4] + "</span></a>";
    }).join("") + "</nav>";
  };

  /* ---------- 題卡的各個片段 ---------- */
  PR.STEPS = ["你看到什麼", "動手算", "對答案", "下次何時見"];
  PR.cardHtml = function (it, steps) {
    var u = cat.get(it.slug);
    return '<div class="past-head"><span class="src">' + esc(it.src) + "</span>" +
      '<span class="pr-links">' + (u ? '<a class="src-link" href="../units/' + u.slug + '.html" target="_blank" rel="noopener">回「' + esc(u.title) + "」看圖 ↗</a>" : "") +
      (it.url ? '<a class="src-link" href="' + it.url + '" target="_blank" rel="noopener">原試卷 PDF ↗</a>' : "") + "</span></div>" +
      '<ol class="pr-steps">' + (steps || PR.STEPS).map(function (s, k) { return '<li data-step="' + k + '">' + s + "</li>"; }).join("") + "</ol>" +
      '<div class="past-q">' + SK.md(it.q) + "</div>" +
      (it.opts ? '<div class="pr-opts" role="group" aria-label="選項">' + it.opts.map(function (o, k) {
        return '<button type="button" class="pr-opt" data-opt="' + k + '" disabled aria-pressed="false"><span class="letter">' + PR.LETTER[k] + "</span>" + SK.md(o) + "</button>";
      }).join("") + "</div>" : "");
  };
  PR.step = function (root, k) {
    root.querySelectorAll(".pr-steps li").forEach(function (li, j) {
      li.classList.toggle("on", j === k);
      li.classList.toggle("done", j < k);
    });
  };
  /* 卡住時一層一層打開的順序：看法一、看法二…，最後是陷阱 */
  PR.layers = function (it) {
    var L = it.ways.map(function (w) { return { t: w.t, html: w.html, cls: "way" }; });
    if (it.trap) L.push({ t: it.trapTitle, html: it.trap, cls: "trap" });
    return L;
  };
  PR.block = function (cls, tag, html) {
    return '<div class="pr-block ' + cls + '"><span class="pr-tag">' + tag + "</span><div>" + html + "</div></div>";
  };
  PR.prompt = function (it) {
    return it.multi ? "多選題：選出所有正確的選項。" : it.key ? "單選題：選一個答案。" : "選出你認為正確的選項。";
  };
  /* 對答案：回傳 { correct: true/false/null, keyText, gotText } */
  PR.grade = function (it, chosen, gaveUp) {
    if (!it.key) return { correct: null };
    var key = it.key.slice().sort(), got = (chosen || []).slice().sort();
    return {
      correct: !gaveUp && key.join() === got.join(),
      keyText: it.key.map(function (k) { return PR.LETTER[k]; }).join(""),
      gotText: got.map(function (k) { return PR.LETTER[k]; }).join("")
    };
  };
  PR.markOpts = function (root, it, chosen) {
    root.querySelectorAll(".pr-opt").forEach(function (b) {
      var k = +b.getAttribute("data-opt");
      b.disabled = true;
      b.classList.toggle("truth", !!it.key && it.key.indexOf(k) >= 0);
      b.classList.toggle("chosen", (chosen || []).indexOf(k) >= 0);
    });
  };
  /* 兩種看法、陷阱、答案全部攤開 */
  PR.solutionHtml = function (it) {
    return it.ways.map(function (w) { return PR.block("way", SK.md(w.t), SK.md(w.html)); }).join("") +
      (it.trap ? PR.block("trap", esc(it.trapTitle), SK.md(it.trap)) : "") +
      PR.block("ans", "◆ " + esc(it.ansTitle), SK.md(it.ans));
  };
  /* 自評按鈕；suggest 是建議的那一顆；soon 是「再來一次」的下次見（單人：這一輪稍後） */
  PR.rateHtml = function (it, suggest, soon) {
    var rec = readProg()[it.id] || null;
    var days = function (d) { return d <= 0 ? soon || "這一輪稍後" : d === 1 ? "明天" : d + " 天後"; };
    var opts = [
      ["again", "再來一次", "錯了，或其實沒想通", days(0)],
      ["shaky", "有點卡", "對了，但靠提示或不太確定", days(1)],
      ["solid", "穩了", "自己想得出來，也說得出為什麼", days(PR.INTERVAL[nextBox(rec)])]
    ];
    return '<div class="pr-rate-wrap"><p class="pr-q">這題對你來說……</p><div class="pr-rate">' + opts.map(function (o) {
      return '<button type="button" class="pr-rate-btn' + (o[0] === suggest ? " suggest" : "") + '" data-rate="' + o[0] + '">' +
        "<b>" + o[1] + "</b><span>" + o[2] + "</span><small>下次見：" + o[3] + "</small></button>";
    }).join("") + "</div></div>";
  };
  PR.suggest = function (g, gaveUp, hints) {
    return gaveUp || g.correct === false ? "again" : hints ? "shaky" : g.correct ? "solid" : "";
  };
})();
