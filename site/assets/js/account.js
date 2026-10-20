/* =========================================================
   三站共用帳號 — 站台端（ACCOUNT）
   正本在 C:\accounts\client\account.js，用 scripts/sync-client.mjs 複製到各站；
   不要直接改各站裡的副本。

   ‧ 登入不在站內做：按「登入」會導到登入中心（ACCOUNT_CONFIG.hubUrl），
     登入中心驗完身分後帶著一次性的 #sso=<token_hash> 導回來，這裡換成本站自己的 session。
   ‧ 沒登入過的訪客不會下載 supabase.js（約 220 KB）；有 session 或正在交接時才載。
   ‧ 進度同步：站台把「存在 localStorage 的一個 JSON 物件」交給 syncMap，
     每個 key 各自 last-write-wins，刪除會留墓碑讓其他裝置也刪。
   ========================================================= */
(function (g) {
  "use strict";

  var cfg = g.ACCOUNT_CONFIG;
  var A = (g.ACCOUNT = {});

  /* 正式環境的設定還是 TODO 時整個帳號功能不出現，免得按鈕導到不存在的網址 */
  var configured = !!cfg && [cfg.supabaseUrl, cfg.anonKey, cfg.hubUrl].every(function (value) {
    return typeof value === "string" && value.length > 0 && !/TODO/.test(value);
  });
  A.available = function () { return configured; };

  var site = "";
  var supabaseSrc = "";
  var client = null;
  var clientPromise = null;
  var user = null;
  var known = false;          /* 是否已經確定登入狀態 */
  var verifying = false;      /* 正在用 #sso= 換 session，這段期間的「未登入」不算數 */
  var listeners = [];
  var maps = [];
  var sync = { state: "idle", at: 0, error: "" };
  var syncTimer = 0;
  var syncRunning = null;
  var syncAgain = false;
  var identityVersion = 0;
  var logoutRunning = null;

  function store(key, val) {
    try {
      if (val === undefined) return g.localStorage.getItem(key);
      if (val === null) g.localStorage.removeItem(key);
      else g.localStorage.setItem(key, val);
    } catch (e) { /* 無痕模式：靜默退回無記憶 */ }
    return null;
  }

  function authKey() { return "account." + site + ".auth"; }
  function metaKey(m) { return "account." + site + ".sync." + m.key; }
  function ownerKey(m) { return metaKey(m) + ".owner"; }
  function savedKey(m, id) { return metaKey(m) + ".saved." + encodeURIComponent(id); }

  /* 目前畫面使用的 map 與帳號綁定。失效、換人或離線登出時，先保留原帳號
     的完整資料與同步快照，再清空畫面；只有原帳號重新登入才能取回。 */
  function activateMap(m, id) {
    var rawMeta = store(metaKey(m));
    var meta;
    try { meta = JSON.parse(rawMeta || "null"); } catch (_) { /* legacy metadata */ }
    var owner = store(ownerKey(m)) || (meta && meta.user) || null;
    if (owner === id) return;
    if (owner) {
      // 不吞掉儲存失敗：備份未成功時不能清除唯一的本機資料。
      g.localStorage.setItem(savedKey(m, owner), JSON.stringify({ value: store(m.key), meta: rawMeta }));
      g.localStorage.removeItem(m.key);
      g.localStorage.removeItem(metaKey(m));
      g.localStorage.removeItem(ownerKey(m));
    }
    if (id) {
      var saved = JSON.parse(store(savedKey(m, id)) || "null");
      if (saved) {
        var guest = readMap(m);
        var own = JSON.parse(saved.value || "{}");
        var restored = Object.assign({}, guest, own);
        g.localStorage.setItem(m.key, JSON.stringify(restored));
        if (saved.meta) g.localStorage.setItem(metaKey(m), saved.meta);
      }
      g.localStorage.setItem(ownerKey(m), id);
    }
    if (m.onChange) m.onChange(readMap(m));
  }

  function acceptUser(next) {
    var before = user && user.id;
    var id = next && next.id;
    if (before !== id) {
      identityVersion++;
      clearTimeout(syncTimer);
      syncAgain = false;
      sync = { state: "idle", at: 0, error: "" };
    }
    // activateMap 也會處理頁面重載後遺留的舊帳號資料。
    maps.forEach(function (m) { activateMap(m, id); });
    user = next;
    known = true;
    emit();
    if (user && id !== before) setTimeout(function () { A.syncNow(); }, 0);
  }

  function requireIdentity(id, version) {
    if (!user || user.id !== id || identityVersion !== version) throw new Error("同步期間帳號已變更");
  }

  function emit() {
    listeners.forEach(function (fn) {
      try { fn(user, sync); } catch (e) { console.error(e); }
    });
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = function () { reject(new Error("無法載入 " + src)); };
      document.head.appendChild(s);
    });
  }

  function getClient() {
    if (!clientPromise) {
      clientPromise = (g.supabase ? Promise.resolve() : loadScript(supabaseSrc)).then(function () {
        client = g.supabase.createClient(cfg.supabaseUrl, cfg.anonKey, {
          auth: {
            storageKey: authKey(),
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: false
          }
        });
        client.auth.onAuthStateChange(function (event, session) {
          if (verifying && !session) return;
          acceptUser(session ? session.user : null);
        });
        return client;
      });
    }
    return clientPromise;
  }

  function currentUrl() {
    return g.location.href.split("#")[0];
  }

  /* ── 啟動 ─────────────────────────────────────────── */

  A.init = function (opts) {
    site = opts.site;
    supabaseSrc = opts.supabaseSrc;
    if (!configured) { known = true; return; }

    var m = /(?:^#|&)sso=([^&]+)/.exec(g.location.hash);
    var err = /(?:^#|&)sso_error=([^&]+)/.exec(g.location.hash);
    if (m || err) {
      /* token 用過一次就失效，但仍立刻從網址列與歷史紀錄拿掉 */
      g.history.replaceState(g.history.state, "", currentUrl());
    }

    if (m) {
      verifying = true;
      getClient().then(function (c) {
        return c.auth.verifyOtp({ token_hash: decodeURIComponent(m[1]), type: "magiclink" });
      }).then(function (res) {
        verifying = false;
        if (res.error) throw res.error;
      }).catch(function (e) {
        verifying = false;
        console.warn("登入交接失敗", e);
        known = true;
        emit();
        toast("登入連結已失效，請再按一次「登入」。");
      });
    } else if (store(authKey())) {
      getClient().then(function (c) { return c.auth.getSession(); }).then(function (res) {
        acceptUser(res.data.session ? res.data.session.user : null);
      }).catch(function (e) {
        /* 離線時載不到 supabase.js：當作登出顯示，但不清任何資料 */
        console.warn(e);
        known = true;
        emit();
      });
    } else {
      known = true;
    }

    g.addEventListener("online", function () { if (user) A.syncSoon(0); });
    document.addEventListener("visibilitychange", function () {
      if (!user) return;
      if (document.visibilityState === "hidden") A.syncNow();
      else if (Date.now() - sync.at > 60000) A.syncSoon(0);
    });
  };

  A.user = function () { return user; };
  A.known = function () { return known; };
  A.syncState = function () { return sync; };

  /* 登入狀態或同步狀態改變時通知；註冊時立刻呼叫一次 */
  A.onChange = function (fn) {
    listeners.push(fn);
    if (known) fn(user, sync);
  };

  A.login = function () {
    g.location.assign(cfg.hubUrl + "?return_to=" + encodeURIComponent(currentUrl()));
  };

  A.hubUrl = function () { return cfg.hubUrl; };

  /* 需要直接呼叫 Supabase 的頁面（例如數學站的雙人解題室：RPC 與 Realtime 私人頻道）共用這個 client，
     不要另外 createClient：兩個 client 共用同一支 refresh token 會互相把對方登出。 */
  A.client = function () {
    if (!configured) return Promise.reject(new Error("帳號功能未設定"));
    return getClient();
  };

  /* 登出本站，並一併登出登入中心，這樣下一個站按登入時才會要求重新驗證。
     已同步的進度從這台裝置清掉（雲端還在），避免共用電腦時下一個人登入後把它併進自己的帳號。 */
  A.logout = function () {
    if (!client) return Promise.resolve();
    if (logoutRunning) return logoutRunning;
    logoutRunning = A.syncNow().then(function (ok) {
      if (!ok && !g.confirm("還有進度沒同步到雲端（可能是離線）。仍要登出嗎？資料會保留在這台裝置，原帳號重新登入後繼續同步。")) {
        return;
      }
      return client.auth.signOut({ scope: "local" }).then(function (res) {
        if (res && res.error) throw res.error;
        // signOut 的網路等待期間仍可能有編輯；整份資料由 acceptUser 保留。
        acceptUser(null);
        g.location.assign(cfg.hubUrl + "?logout=1&return_to=" + encodeURIComponent(currentUrl()));
      });
    }).finally(function () {
      logoutRunning = null;
    });
    return logoutRunning;
  };

  /* ── 進度同步 ─────────────────────────────────────── */

  /* opts: { key: localStorage 的 key（值是 JSON 物件）, prefix: 雲端 key 前綴,
             onChange(map): 雲端資料改動了本機時呼叫，讓頁面重畫 } */
  A.syncMap = function (opts) {
    maps.push(opts);
    if (known) activateMap(opts, user && user.id);
    if (user) A.syncSoon(0);
  };

  A.syncSoon = function (delay) {
    clearTimeout(syncTimer);
    syncTimer = setTimeout(function () { A.syncNow(); }, delay == null ? 1500 : delay);
  };

  /* 回傳 Promise<boolean>：true = 全部同步成功（或沒東西要同步） */
  A.syncNow = function () {
    clearTimeout(syncTimer);
    if (!user || !client || !maps.length) return Promise.resolve(true);
    if (syncRunning) { syncAgain = true; return syncRunning; }

    var id = user.id;
    var version = identityVersion;
    sync.state = "syncing";
    emit();
    // 所有呼叫端（包含登出）等待變更排空，而不是只等待第一輪舊快照。
    function drain(round) {
      syncAgain = false;
      requireIdentity(id, version);
      return maps.reduce(function (p, m) {
        return p.then(function () { return syncOne(m, id, version); });
      }, Promise.resolve()).then(function () {
        requireIdentity(id, version);
        var pending = maps.some(function (m) {
          var meta = JSON.parse(store(metaKey(m)) || "null");
          return !meta || canon(meta.base) !== canon(snapshot(readMap(m)));
        });
        if (pending || syncAgain) {
          if (round >= 5) throw new Error("進度持續變更，尚未完成同步");
          return drain(round + 1);
        }
      });
    }
    syncRunning = Promise.resolve().then(function () { return drain(0); }).then(function () {
      sync.state = "ok";
      sync.at = Date.now();
      sync.error = "";
      return true;
    }, function (e) {
      console.warn("同步失敗", e);
      if (identityVersion === version) {
        sync.state = g.navigator.onLine === false ? "offline" : "error";
        sync.error = (e && e.message) || String(e);
      }
      return false;
    }).then(function (ok) {
      syncRunning = null;
      emit();
      if (user && identityVersion !== version) A.syncSoon(0);
      return ok;
    });
    return syncRunning;
  };

  function readMap(m) {
    try {
      var o = JSON.parse(store(m.key) || "{}");
      return o && typeof o === "object" && !Array.isArray(o) ? o : {};
    } catch (e) { return {}; }
  }

  /* 鍵排序後的 JSON：雲端 jsonb 會重排物件的鍵，比對前要先正規化 */
  function canon(v) {
    if (v === undefined) return undefined;
    return JSON.stringify(v, function (_, x) {
      if (!x || typeof x !== "object" || Array.isArray(x)) return x;
      var o = {};
      Object.keys(x).sort().forEach(function (k) { o[k] = x[k]; });
      return o;
    });
  }

  function snapshot(map) {
    var s = {};
    Object.keys(map).forEach(function (k) { s[k] = canon(map[k]); });
    return s;
  }

  /* PostgREST 一次最多回 1000 列，分頁拉完 */
  function fetchRemote(prefix, id, version, from, acc) {
    requireIdentity(id, version);
    acc = acc || [];
    from = from || 0;
    return client.from("user_data")
      .select("key,value,updated_at")
      .eq("site", site)
      .eq("user_id", id)
      .like("key", prefix + "%")
      .order("key")
      .range(from, from + 999)
      .then(function (res) {
        if (res.error) throw res.error;
        acc = acc.concat(res.data);
        requireIdentity(id, version);
        return res.data.length < 1000 ? acc : fetchRemote(prefix, id, version, from + 1000, acc);
      });
  }

  /* 一張表的一次同步：
     1. 對照上次同步完的快照（base），找出本機改過／刪過的 key，記下修改時間；
     2. 拉下雲端所有列，逐 key 比時間：雲端新就套到本機，本機新就推上去；
     3. 同步途中使用者又改了的 key 不覆蓋，下一輪再推。
     第一次在這台裝置同步某個帳號時沒有 base，本機既有資料一律當作「很舊」：
     雲端有的以雲端為準，雲端沒有的才推上去——舊裝置不會把帳號裡較新的進度蓋掉。 */
  function syncOne(m, id, version) {
    requireIdentity(id, version);
    activateMap(m, id);
    var meta = null;
    try { meta = JSON.parse(store(metaKey(m)) || "null"); } catch (e) { /* 壞掉就重來 */ }
    if (!meta || meta.user !== id) meta = { user: id, base: null, times: {} };

    var start = readMap(m);
    var startSnap = snapshot(start);
    var now = Date.now();
    var k;
    if (meta.base) {
      for (k in startSnap) if (startSnap[k] !== meta.base[k]) meta.times[k] = Math.max(now, (meta.times[k] || 0) + 1);
      for (k in meta.base) if (!(k in startSnap)) meta.times[k] = Math.max(now, (meta.times[k] || 0) + 1);
    }

    return fetchRemote(m.prefix, id, version)
      .then(function (rows) {
        var remote = {};
        rows.forEach(function (r) {
          remote[r.key.slice(m.prefix.length)] = { v: r.value, t: Date.parse(r.updated_at) };
        });

        var keys = {};
        [startSnap, remote, meta.times].forEach(function (o) { for (var x in o) keys[x] = 1; });

        var push = [];
        var apply = {};
        Object.keys(keys).forEach(function (key) {
          var lt = meta.times[key] || 0;
          var r = remote[key];
          var lv = key in start ? start[key] : null;
          /* 同分時以雲端為準：第一次同步推上去的舊資料時間都是 0，
             新裝置的本機資料也是 0，兩者之間要讓雲端的版本下來 */
          if (r && r.t >= lt) {
            if (canon(r.v) !== canon(lv)) apply[key] = r.v;
            meta.times[key] = r.t;
          } else if (r ? lt > r.t : lv !== null) {
            push.push({
              user_id: id,
              site: site,
              key: m.prefix + key,
              value: lv,
              updated_at: new Date(lt).toISOString()
            });
          }
        });

        var chunks = [];
        for (var i = 0; i < push.length; i += 500) chunks.push(push.slice(i, i + 500));
        return chunks.reduce(function (p, rows) {
          return p.then(function () {
            requireIdentity(id, version);
            return client.from("user_data")
              .upsert(rows, { onConflict: "user_id,site,key", ignoreDuplicates: false })
              .then(function (r2) { if (r2.error) throw r2.error; });
          });
        }, Promise.resolve()).then(function () { return apply; });
      })
      .then(function (apply) {
        requireIdentity(id, version);
        var fresh = readMap(m);
        var base = {};
        for (k in startSnap) base[k] = startSnap[k];
        var changed = false;
        Object.keys(apply).forEach(function (key) {
          var v = apply[key];
          if (v === null) delete base[key]; else base[key] = canon(v);
          /* 同步途中被使用者改掉的 key 保留使用者的版本 */
          if (canon(fresh[key]) !== startSnap[key]) return;
          if (v === null) delete fresh[key]; else fresh[key] = v;
          changed = true;
        });
        if (changed) store(m.key, JSON.stringify(fresh));
        meta.base = base;
        store(metaKey(m), JSON.stringify(meta));
        if (changed && m.onChange) m.onChange(fresh);
      });
  }

  /* ── 介面：頂列的帳號按鈕 ─────────────────────────── */

  var CSS =
    ".acct{position:relative;display:inline-flex}" +
    ".acct-avatar{width:1.7em;height:1.7em;border-radius:50%;display:inline-grid;place-items:center;" +
      "font-weight:700;font-size:.85em;background:var(--acct-accent,var(--accent,var(--mint,#6FCFC6)));color:#fff}" +
    ".acct-btn{display:inline-flex;align-items:center;gap:.4em;cursor:pointer}" +
    ".acct-btn[disabled]{opacity:.5;cursor:default}" +
    ".acct-menu{position:absolute;right:0;top:calc(100% + .5rem);z-index:1000;min-width:15rem;max-width:min(20rem,calc(100vw - 2rem));" +
      "padding:.9rem 1rem;display:grid;gap:.55rem;text-align:left;" +
      "background:var(--acct-bg,var(--surface,var(--card,#fff)));color:var(--acct-ink,var(--ink,#333));" +
      "border:1.5px solid var(--acct-line,var(--line,#ddd));border-radius:var(--acct-radius,var(--r,var(--radius-sm,14px)));" +
      "box-shadow:0 8px 28px rgba(60,50,80,.14);font-size:.92rem}" +
    ".acct-menu[hidden]{display:none}" +
    ".acct-email{font-weight:700;overflow-wrap:anywhere;margin:0}" +
    ".acct-sync{margin:0;opacity:.75;font-size:.85em}" +
    ".acct-menu a,.acct-menu button{font:inherit;color:inherit;text-align:left;background:none;border:0;padding:.35rem 0;" +
      "cursor:pointer;text-decoration:underline;text-underline-offset:3px}" +
    ".acct-row{display:flex;gap:1rem;flex-wrap:wrap;border-top:1px solid var(--acct-line,var(--line,#ddd));padding-top:.5rem}" +
    ".acct-email+.acct-row{border-top:0;padding-top:0}" +
    ".acct-toast{position:fixed;left:50%;bottom:1.5rem;transform:translateX(-50%);z-index:1001;max-width:calc(100vw - 2rem);" +
      "padding:.7rem 1.1rem;border-radius:999px;background:var(--acct-ink,var(--ink,#333));color:var(--acct-bg,var(--surface,var(--card,#fff)));" +
      "box-shadow:0 6px 20px rgba(0,0,0,.18);font-size:.92rem}";

  var styled = false;
  function injectCss() {
    if (styled) return;
    styled = true;
    var s = document.createElement("style");
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function el(tag, attrs, parent) {
    var e = document.createElement(tag);
    for (var k in attrs || {}) {
      if (k === "text") e.textContent = attrs[k];
      else if (k === "class") e.className = attrs[k];
      else if (k.slice(0, 2) === "on") e.addEventListener(k.slice(2), attrs[k]);
      else e.setAttribute(k, attrs[k]);
    }
    if (parent) parent.appendChild(e);
    return e;
  }

  function toast(msg) {
    injectCss();
    var t = el("div", { class: "acct-toast", role: "status", text: msg }, document.body);
    setTimeout(function () { t.remove(); }, 5000);
  }
  A.toast = toast;

  function syncText(s) {
    if (s.state === "syncing") return "同步中…";
    if (s.state === "offline") return "離線中，連上網路後會自動同步";
    if (s.state === "error") return "同步失敗，稍後會再試";
    if (s.at) {
      var d = new Date(s.at);
      return "已同步 · " + d.getHours() + ":" + String(d.getMinutes()).padStart(2, "0");
    }
    return "進度會跟著帳號跨裝置同步";
  }

  /* 在 slot 裡放帳號按鈕。opts.buttonClass：套用站台自己的按鈕樣式 */
  A.mount = function (slot, opts) {
    if (!configured) return;
    opts = opts || {};
    injectCss();
    var wrap = el("span", { class: "acct" }, slot);
    var open = false;

    function close() {
      open = false;
      var m = wrap.querySelector(".acct-menu");
      if (m) m.hidden = true;
      var b = wrap.querySelector(".acct-btn");
      if (b) b.setAttribute("aria-expanded", "false");
    }

    document.addEventListener("click", function (e) { if (open && !wrap.contains(e.target)) close(); });
    document.addEventListener("keydown", function (e) { if (open && e.key === "Escape") close(); });

    function render(u, s) {
      wrap.innerHTML = "";
      var cls = "acct-btn " + (opts.buttonClass || "");
      if (!known) {
        el("button", { class: cls, type: "button", disabled: "", text: "帳號…" }, wrap);
        return;
      }
      if (!u) {
        el("button", { class: cls, type: "button", text: "登入", onclick: A.login }, wrap);
        return;
      }
      var email = u.email || "";
      var btn = el("button", {
        class: cls, type: "button", "aria-haspopup": "true", "aria-expanded": open ? "true" : "false",
        title: email, "aria-label": "帳號：" + email
      }, wrap);
      el("span", { class: "acct-avatar", text: (email[0] || "?").toUpperCase(), "aria-hidden": "true" }, btn);
      if (opts.label !== false) el("span", { text: "帳號" }, btn);

      var menu = el("div", { class: "acct-menu", role: "menu" }, wrap);
      menu.hidden = !open;
      el("p", { class: "acct-email", text: email }, menu);
      if (maps.length) {
        el("p", { class: "acct-sync", text: syncText(s) }, menu);
        el("button", { type: "button", text: "立即同步", onclick: function () { A.syncNow(); } }, menu);
      }
      var row = el("div", { class: "acct-row" }, menu);
      el("a", { href: cfg.hubUrl, text: "帳號中心" }, row);
      el("button", { type: "button", text: "登出", onclick: function () {
        A.logout().catch(function () { toast("登出未完成，請確認網路後再試。進度仍保留在原帳號。"); });
      } }, row);

      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        open = !open;
        menu.hidden = !open;
        btn.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }

    A.onChange(render);
    if (!known) render(null, sync);
  };
})(window);
