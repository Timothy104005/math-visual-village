/* =========================================================
   解題練習場：一次一題，慢慢刷。
   每一題都照小鎮題卡的順序走，不能跳：
     ① 先別動筆，寫下「你看到什麼」→ ② 動手算，卡住再一層一層打開看法一、看法二、
     最多人卡在這裡 → ③ 交出答案後才對答案 → ④ 自評「再來／有點卡／穩了」，排下次見面的日子。
   題庫、進度與題卡片段在 practice-pool.js（SK.PR），雙人解題室也用同一份。
   ========================================================= */
(function () {
  "use strict";
  var PR = SK.PR, esc = PR.esc, safeMd = PR.safeMd;

  /* ---------- 版面 ---------- */
  SK.injectFilters();
  document.body.appendChild(SK.topbar("../", false));
  var main = SK.h("main", { class: "wrap", id: "main" });
  document.body.appendChild(main);
  main.innerHTML =
    '<section class="exam-hero sk-frame">' +
    '<p class="eyebrow">Slow practice, one problem at a time</p>' +
    "<h1>解題練習場</h1>" + PR.modes("solo") +
    '<p class="lead">一次只看一題，沒有計時。每一題都照小鎮的順序走：先寫下你看到什麼，卡住再一層一層打開看法，最後才對答案。' +
    "答完告訴我們這題穩不穩，我們會在你快忘記的時候再把它拿出來。</p>" +
    '<ol class="pr-rule">' +
    "<li><b>先別動筆</b>寫下你看到什麼</li><li><b>兩種看法</b>卡住再一層層打開</li>" +
    "<li><b>小心陷阱</b>最多人卡在這裡</li><li><b>最後才對答案</b>再決定下次何時見</li></ol>" +
    "</section>";
  var setup = SK.h("section", { class: "unit-sec sk-card sk-frame", id: "pr-setup", "aria-labelledby": "pr-setup-t" });
  var play = SK.h("section", { class: "unit-sec sk-card sk-frame", id: "pr-play", "aria-live": "polite", hidden: "" });
  main.appendChild(setup);
  main.appendChild(play);
  document.body.appendChild(SK.footer());

  /* ---------- 選範圍 ---------- */
  var pick = PR.newPick(10);
  setup.innerHTML =
    '<h2 class="sec-title" id="pr-setup-t"><span class="num">GO</span>今天想練什麼？<span class="en">/ Pick a path</span></h2>' +
    '<p class="pr-stats"></p><div class="pr-picker"></div>' +
    '<div style="margin-top:20px">' + SK.note("沒有計時。一題想十分鐘也很好——看得深比刷得快重要。", "Depth over speed.") + "</div>";
  function renderStats() {
    var s = PR.stats();
    setup.querySelector(".pr-stats").innerHTML = "<span><b>" + s.seen + "</b> 題練過</span><span><b>" + s.due +
      "</b> 題今天到期</span><span><b>" + s.solid + "</b> 題已經穩穩記住</span>";
  }
  var renderPicker = PR.picker(setup.querySelector(".pr-picker"), pick, { due: true, house: true, start: "開始慢慢刷", onStart: start });
  function renderSetup() { renderStats(); renderPicker(); }
  PR.onSync(function () { if (!setup.hidden) renderSetup(); });

  function start() {
    var msg = setup.querySelector(".pr-msg"), btn = setup.querySelector('[data-act="start"]');
    btn.disabled = true;
    msg.textContent = "正在把題目搬出來…";
    PR.buildQueue(pick).then(function (res) {
      btn.disabled = false;
      msg.textContent = res.msg || "";
      if (res.queue) runSession(res.queue);
    });
  }

  /* ---------- 一輪 ---------- */
  var sess = null;
  function runSession(queue) {
    sess = { queue: queue, i: 0, again: {}, tally: { again: 0, shaky: 0, solid: 0 }, notes: [], cleared: 0 };
    setup.hidden = true;
    play.hidden = false;
    showItem();
  }

  function showItem() {
    if (sess.i >= sess.queue.length) return finish();
    var it = sess.queue[sess.i], rec = PR.read()[it.id] || null;
    var st = { obs: "", chosen: [], text: "", hints: 0, gaveUp: false };

    play.innerHTML =
      '<div class="pr-top">' +
      '<span class="pr-count">' + (pick.house ? PR.esc(CATALOG.get(pick.house).title) + ' 小屋・' : '') + '第 ' + (sess.i + 1) + " / " + sess.queue.length + " 題</span>" +
      '<button class="btn small ghost" type="button" data-act="quit">結束這一輪</button></div>' +
      '<div class="past pr-card">' + PR.cardHtml(it) + '<div class="pr-stage"></div></div>';

    var stage = play.querySelector(".pr-stage");
    play.querySelector('[data-act="quit"]').onclick = finish;
    window.scrollTo({ top: play.offsetTop - 70, behavior: "smooth" });

    /* ① 你看到什麼 */
    PR.step(play, 0);
    stage.innerHTML =
      '<div class="pr-block see"><label class="pr-q" for="pr-obs">先別動筆：你看到什麼？</label>' +
      '<p class="muted pr-tip">條件有哪些？主角是誰？像不像哪張你看過的圖或公式？寫一句就好，沒有對錯。</p>' +
      (rec && rec.o ? '<p class="pr-last">上次你寫：' + safeMd(rec.o) + "</p>" : "") +
      (pick.book && PR.book.get(it.id) && PR.book.get(it.id).note ? '<p class="pr-last">你在錯題本提醒自己：' + safeMd(PR.book.get(it.id).note) + "</p>" : "") +
      '<textarea id="pr-obs" class="pr-ta" rows="3" placeholder="我看到……（可以用 $x^2$ 打公式）"></textarea>' +
      '<div class="pr-row"><button class="btn small" type="button" disabled data-act="obs">寫好了，開始動手 ' + SK.icon("arrow") + "</button></div></div>";
    var ta = stage.querySelector("#pr-obs"), go = stage.querySelector('[data-act="obs"]');
    ta.oninput = function () { go.disabled = ta.value.trim().length < 2; };
    go.onclick = function () { st.obs = ta.value.trim(); work(); };

    /* ② 動手算：作答，卡住時看法一層一層開 */
    function work() {
      PR.step(play, 1);
      var layers = PR.layers(it);
      stage.innerHTML =
        '<div class="pr-compare">' + PR.block("mine", "你的觀察", safeMd(st.obs)) +
        (it.see ? PR.block("see", "小鎮的觀察", SK.md(it.see)) : "") + "</div>" +
        (it.opts
          ? '<p class="pr-q">' + PR.prompt(it) + "</p>"
          : '<label class="pr-q" for="pr-ans">寫下你的答案或關鍵算式</label>' +
            '<textarea id="pr-ans" class="pr-ta" rows="4" placeholder="可以用 $\\frac{a}{b}$、$x^2$ 打公式"></textarea>' +
            '<div class="pr-preview muted" aria-live="polite"></div>') +
        '<div class="pr-hints"></div>' +
        '<div class="pr-row">' +
        '<button class="btn small" type="button" disabled data-act="submit">交出答案</button>' +
        (it.opts ? '<span class="pr-picked" aria-live="polite">還沒選答案（選項在上面）</span>' : "") +
        (layers.length ? '<button class="btn small sky" type="button" data-act="hint"></button>' : "") +
        '<button class="btn small ghost" type="button" data-act="giveup">我卡住了，直接看解法</button></div>';

      var submit = stage.querySelector('[data-act="submit"]'), hintBtn = stage.querySelector('[data-act="hint"]');
      var hints = stage.querySelector(".pr-hints");
      function label() {
        if (!hintBtn) return;
        if (st.hints >= layers.length) { hintBtn.remove(); hintBtn = null; return; }
        hintBtn.innerHTML = "還卡著？打開：" + SK.md(layers[st.hints].t);
      }
      label();
      if (hintBtn) hintBtn.onclick = function () {
        var L = layers[st.hints++];
        hints.insertAdjacentHTML("beforeend", PR.block(L.cls, SK.md(L.t), SK.md(L.html)));
        label();
      };

      if (it.opts) {
        var btns = play.querySelectorAll(".pr-opt");
        btns.forEach(function (b) {
          b.disabled = false;
          b.onclick = function () {
            var k = +b.getAttribute("data-opt");
            if (it.multi) {
              var at = st.chosen.indexOf(k);
              if (at >= 0) st.chosen.splice(at, 1); else st.chosen.push(k);
            } else st.chosen = [k];
            btns.forEach(function (x) { x.setAttribute("aria-pressed", st.chosen.indexOf(+x.getAttribute("data-opt")) >= 0 ? "true" : "false"); });
            submit.disabled = !st.chosen.length;
            stage.querySelector(".pr-picked").innerHTML = st.chosen.length ? "你選了 <b>" + PR.answerText(it, st.chosen) + "</b>" : "還沒選答案（選項在上面）";
          };
        });
      } else {
        var ans = stage.querySelector("#pr-ans"), pv = stage.querySelector(".pr-preview");
        ans.oninput = function () {
          st.text = ans.value.trim();
          submit.disabled = !st.text;
          pv.innerHTML = /\$/.test(st.text) ? "預覽：" + safeMd(st.text) : "";
        };
      }
      submit.onclick = function () { reveal(); };
      stage.querySelector('[data-act="giveup"]').onclick = function () { st.gaveUp = true; reveal(); };
    }

    /* ③ 對答案：兩種看法、陷阱、答案全部攤開；④ 自評 */
    function reveal() {
      PR.step(play, 2);
      var g = PR.grade(it, st.chosen, st.gaveUp), verdict;
      PR.markOpts(play, it, st.chosen);
      if (it.key) {
        verdict = st.gaveUp ? "<h4>✦ 沒關係，卡住就是在長大。</h4><p>正確答案是 <b>" + g.keyText + "</b>。先讀下面的看法，想想自己是卡在哪一步。</p>"
          : g.correct ? "<h4>✦ 對了！</h4><p>再讀一次下面的另一種看法：考場上想到任何一種就夠，但多一種看法會讓你更穩。</p>"
          : "<h4>✦ 差一點。</h4><p>正確答案是 <b>" + g.keyText + "</b>，你選了 <b>" + g.gotText + "</b>。對照下面的看法，找找看是哪個條件看漏了。</p>";
      } else if (!st.gaveUp) {
        verdict = PR.block("mine", "你的答案", safeMd(st.text)) +
          '<p class="muted">和下面的解答對照看看。算法不一樣沒關係，重點是你能不能說出每一步為什麼。</p>';
      } else {
        verdict = "<h4>✦ 卡住也沒關係。</h4><p>讀完下面的想法後，試著不看解答、自己重寫一遍。</p>";
      }
      stage.innerHTML = '<div class="explain">' + verdict + "</div>" + PR.solutionHtml(it) +
        PR.rateHtml(it, PR.suggest(g, st.gaveUp, st.hints));
      if (!pick.book) stage.querySelector(".pr-rate-wrap").before(PR.bookWidget(it, PR.answerText(it, st.chosen, st.text, st.gaveUp), st.obs));
      else stage.querySelector(".pr-rate-wrap").insertAdjacentHTML("beforebegin",
        '<p class="pr-book-head">這是錯題本裡的題目：選「穩了」就會移到「已訂正」。</p>');
      stage.querySelectorAll("[data-rate]").forEach(function (btn) {
        btn.onclick = function () { done(btn.getAttribute("data-rate")); };
      });
    }

    function done(r) {
      PR.step(play, 3);
      PR.record(it, r, st.obs);
      if (pick.book && PR.book.get(it.id)) {
        var e = PR.book.get(it.id);
        PR.book.update(it.id, { rv: (e.rv || 0) + 1, st: r === "solid" ? "done" : "open" });
        if (r === "solid") sess.cleared++;
      }
      sess.tally[r]++;
      sess.notes.push({ src: it.src, obs: st.obs });
      if (r === "again" && !pick.house && !sess.again[it.id]) {
        sess.again[it.id] = 1;
        sess.queue.splice(Math.min(sess.i + 4, sess.queue.length), 0, it);
      }
      sess.i++;
      showItem();
    }
  }

  /* ---------- 一輪結束 ---------- */
  function finish() {
    var s = PR.stats(), T = sess.tally;
    play.innerHTML =
      '<h2 class="sec-title"><span class="num">✓</span>這一輪先到這裡<span class="en">/ Nice work</span></h2>' +
      '<p class="pr-stats"><span><b>' + T.solid + "</b> 題穩了</span><span><b>" + T.shaky + "</b> 題有點卡</span><span><b>" + T.again + "</b> 題再來</span></p>" +
      "<p>" + (s.due ? "目前還有 <b>" + s.due + "</b> 題今天到期。" : "今天到期的題目都清空了。") +
      (s.tomorrow ? "明天會有 <b>" + s.tomorrow + "</b> 題回來找你。" : "") + "</p>" +
      (pick.book ? "<p>錯題本：這一輪訂正好 <b>" + sess.cleared + "</b> 題，還有 <b>" + PR.book.open().length + '</b> 題待訂正。<a href="notebook.html">回錯題本 →</a></p>' : "") +
      (sess.notes.length ? '<h3 class="hand">你今天寫下的觀察</h3><ul class="pr-notes">' + sess.notes.map(function (n) {
        return "<li><span class=\"chip\">" + esc(n.src) + "</span> " + safeMd(n.obs) + "</li>";
      }).join("") + "</ul>" : "") +
      '<div class="pr-row"><button class="btn" type="button" data-act="again">同樣範圍再一輪</button>' +
      '<button class="btn ghost" type="button" data-act="back">換個範圍</button></div>' +
      '<div style="margin-top:20px">' + SK.note("回頭看看自己寫的觀察：哪一句幫你最多？下次先問自己那一句。", "Notice what you notice.") + "</div>";
    play.querySelector('[data-act="again"]').onclick = function () { setup.hidden = false; play.hidden = true; start(); };
    play.querySelector('[data-act="back"]').onclick = function () {
      if (pick.house) {
        delete pick.house; pick.deep = false;
        var url = new URL(location.href); url.searchParams.delete("house"); history.replaceState(history.state, "", url.toString());
      }
      play.hidden = true; setup.hidden = false; renderSetup(); window.scrollTo({ top: setup.offsetTop - 70, behavior: "smooth" });
    };
  }

  renderSetup();
  if (pick.deep) start();
})();
