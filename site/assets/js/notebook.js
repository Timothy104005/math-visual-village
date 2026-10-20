/* =========================================================
   我的錯題本：只收自己在練習場／雙人解題室按「加入錯題本」的題目。
   每一題保留當時的答案與觀察，加上錯因標籤和一段「下次要記得」的筆記；
   可以一題一題重做（回到練習場的題卡流程），重做時自評「穩了」就移到「已訂正」。
   資料在 SK.PR.book（localStorage sk-notebook，登入後跨裝置同步）。
   ========================================================= */
(function () {
  "use strict";
  var PR = SK.PR, esc = PR.esc, safeMd = PR.safeMd, cat = window.CATALOG;

  SK.injectFilters();
  document.body.appendChild(SK.topbar("../", false));
  var main = SK.h("main", { class: "wrap", id: "main" });
  document.body.appendChild(main);
  var hero = SK.h("section", { class: "exam-hero sk-frame" });
  var sec = SK.h("section", { class: "unit-sec sk-card sk-frame", id: "book", "aria-labelledby": "book-t" });
  main.appendChild(hero);
  main.appendChild(sec);
  document.body.appendChild(SK.footer());

  function renderHero() {
    hero.innerHTML =
      '<p class="eyebrow">Mistakes are where the brain grows</p>' +
      "<h1>解題練習場</h1>" + PR.modes("book") +
      '<p class="lead">錯題本只收你自己挑的題目。寫下為什麼卡住、下次要記得什麼，過幾天再重做一次；' +
      "能自己想通、說得出為什麼，就移到「已訂正」。</p>";
  }

  var view = { st: "open", why: "" };
  var items = {};          /* id → 完整題目（從題庫換回來） */

  function render() {
    var all = PR.book.all(), ids = Object.keys(all);
    var open = ids.filter(function (id) { return all[id].st !== "done"; });
    var shown = ids.filter(function (id) {
      var e = all[id];
      return (view.st === "all" || (view.st === "done") === (e.st === "done")) && (!view.why || (e.why || []).indexOf(view.why) >= 0);
    }).sort(function (a, b) { return (all[b].at || 0) - (all[a].at || 0); });
    var chip = function (attr, val, label, on) {
      return '<button type="button" class="chip" ' + attr + '="' + val + '" aria-pressed="' + (on ? "true" : "false") + '">' + label + "</button>";
    };
    sec.innerHTML =
      '<h2 class="sec-title" id="book-t"><span class="num">' + open.length + "</span>我的錯題本<span class=\"en\">/ My mistake notebook</span></h2>" +
      (ids.length ? "" : '<div class="pr-empty"><p>錯題本還是空的。</p><p class="muted">在<a href="index.html">練習場</a>或<a href="../duo/index.html">雙人解題室</a>對完答案後，按「加入錯題本」就會收進來。' +
        "不只是答錯的題目，猜對、靠提示才想到、或想再練一次的題目也都可以收。</p></div>") +
      (ids.length ? '<div class="pr-go book-go">' +
        (open.length ? '<a class="btn" href="index.html?book=1">重做全部待訂正（' + open.length + " 題）" + SK.icon("arrow") + "</a>" : '<p class="muted">待訂正的題目都清空了 ✓</p>') + "</div>" +
        '<div class="pr-field"><span class="pr-label">狀態</span><div class="pr-chips">' +
        chip("data-st", "open", "待訂正（" + open.length + "）", view.st === "open") +
        chip("data-st", "done", "已訂正（" + (ids.length - open.length) + "）", view.st === "done") +
        chip("data-st", "all", "全部", view.st === "all") + "</div></div>" +
        '<div class="pr-field"><span class="pr-label">錯因</span><div class="pr-chips">' +
        chip("data-why", "", "不限", !view.why) +
        PR.WHY.map(function (w) {
          var n = ids.filter(function (id) { return (all[id].why || []).indexOf(w[0]) >= 0; }).length;
          return chip("data-why", w[0], w[1] + (n ? "（" + n + "）" : ""), view.why === w[0]);
        }).join("") + "</div></div>" +
        '<div class="book-list">' + (shown.length ? shown.map(function (id) { return cardHtml(id, all[id]); }).join("") :
          '<p class="muted">這個篩選條件下沒有題目。</p>') + "</div>" : "") +
      '<div style="margin-top:20px">' + SK.note("錯誤是大腦長大的時刻。寫下「為什麼」，比記住答案更有用。", "Mistakes grow your brain.") + "</div>";

    sec.querySelectorAll("[data-st]").forEach(function (b) { b.onclick = function () { view.st = b.getAttribute("data-st"); render(); }; });
    sec.querySelectorAll("[data-why]").forEach(function (b) { b.onclick = function () { view.why = b.getAttribute("data-why"); render(); }; });
    shown.forEach(bindCard);
    loadItems(shown);
  }

  function cardHtml(id, e) {
    var u = cat.get(e.u), d = new Date(e.at || Date.now());
    return '<article class="past book-card" data-id="' + esc(id) + '">' +
      '<div class="past-head"><span class="src">' + esc(e.src || "題目") + "</span>" +
      '<span class="pr-links">' + (u ? '<a class="src-link" href="../units/' + u.slug + '.html">「' + esc(u.title) + "」</a>" : "") +
      '<span class="muted book-date">' + (d.getMonth() + 1) + "/" + d.getDate() + " 加入" + (e.rv ? "・重做 " + e.rv + " 次" : "") + "</span></span></div>" +
      '<div class="book-q past-q muted">題目載入中…</div>' +
      '<div class="pr-compare">' +
      PR.block("mine", "當時的答案", e.a ? safeMd(e.a) : '<span class="muted">（沒有記錄）</span>') +
      (e.o ? PR.block("see", "當時的觀察", safeMd(e.o)) : "") + "</div>" +
      '<div class="pr-field book-why"><span class="pr-label">錯因</span><div class="pr-chips">' +
      PR.WHY.map(function (w) {
        return '<button type="button" class="chip" data-tag="' + w[0] + '" aria-pressed="' + ((e.why || []).indexOf(w[0]) >= 0) + '">' + w[1] + "</button>";
      }).join("") + "</div></div>" +
      '<label class="pr-q" for="note-' + esc(id) + '">下次要記得…</label>' +
      '<textarea id="note-' + esc(id) + '" class="pr-ta book-note" rows="2" maxlength="500" placeholder="例如：題目問的是「可重複」，我看成不重複。">' + esc(e.note || "") + "</textarea>" +
      '<p class="book-saved muted" aria-live="polite"></p>' +
      '<details class="book-sol"><summary>再看一次解法</summary><div class="book-sol-body muted">載入中…</div></details>' +
      '<div class="pr-row">' +
      '<a class="btn small" href="index.html?book=' + encodeURIComponent(id) + '">重做這題</a>' +
      (e.st === "done" ? '<button type="button" class="btn small ghost" data-act="reopen">移回待訂正</button>'
        : '<button type="button" class="btn small ghost" data-act="done">標成已訂正</button>') +
      '<button type="button" class="btn small ghost" data-act="remove">從錯題本移除</button></div>' +
      "</article>";
  }

  function bindCard(id) {
    var el = sec.querySelector('[data-id="' + CSS.escape(id) + '"]');
    if (!el) return;
    el.querySelectorAll("[data-tag]").forEach(function (b) {
      b.onclick = function () {
        var cur = (PR.book.get(id) || {}).why || [], w = b.getAttribute("data-tag");
        var next = cur.indexOf(w) >= 0 ? cur.filter(function (x) { return x !== w; }) : cur.concat([w]);
        PR.book.update(id, { why: next });
        b.setAttribute("aria-pressed", next.indexOf(w) >= 0 ? "true" : "false");
      };
    });
    var note = el.querySelector(".book-note"), saved = el.querySelector(".book-saved");
    note.oninput = function () {
      /* 先存本機，避免立刻重做、切換篩選或離頁時遺失最後幾個字；雲端同步仍由帳號系統合併排程。 */
      PR.book.update(id, { note: note.value.slice(0, 500) });
      saved.textContent = "已儲存";
    };
    var done = el.querySelector('[data-act="done"]'), reopen = el.querySelector('[data-act="reopen"]');
    if (done) done.onclick = function () { PR.book.update(id, { st: "done" }); render(); };
    if (reopen) reopen.onclick = function () { PR.book.update(id, { st: "open" }); render(); };
    el.querySelector('[data-act="remove"]').onclick = function () {
      if (window.confirm("把這題從錯題本移除？（練習進度不受影響）")) { PR.book.remove(id); render(); }
    };
    fillItem(id);
  }

  /* 題目和解法要從題庫換回來（錯題本只存 id，題目改了也會跟著更新） */
  function loadItems(ids) {
    var all = PR.book.all();
    var need = ids.filter(function (id) { return !(id in items); });
    if (!need.length) return;
    need.forEach(function (id) { items[id] = undefined; });
    PR.resolve(need.map(function (id) { return { id: id, slug: all[id].u }; })).then(function (list) {
      need.forEach(function (id, i) { items[id] = list[i] || null; fillItem(id); });
    });
  }
  function fillItem(id) {
    var el = sec.querySelector('[data-id="' + CSS.escape(id) + '"]'), it = items[id];
    if (!el || it === undefined) return;
    var q = el.querySelector(".book-q"), sol = el.querySelector(".book-sol-body");
    if (!it) {
      q.innerHTML = "找不到這一題了，可能單元內容改過。";
      sol.innerHTML = "";
      return;
    }
    q.classList.remove("muted");
    q.innerHTML = SK.md(it.q) + (it.opts ? '<ul class="past-opts">' + it.opts.map(function (o, k) {
      return "<li>" + PR.LETTER[k] + "　" + SK.md(o) + "</li>";
    }).join("") + "</ul>" : "");
    sol.classList.remove("muted");
    sol.innerHTML = PR.solutionHtml(it);
  }

  renderHero();
  render();
  PR.onSync(function () { renderHero(); render(); });
})();
