/* 單元：按比例成長與 e */
(function () {
  var C = SK.C, s = SK.s;

  function hookVisual(el) {
    var svg = SK.svg(el, 420, 260, "年利率百分之百的銀行，結算次數不同");
    var yb = 220, u = 70;
    [[1, 2, "一年一次"], [2, 2.25, "半年一次"], [12, Math.pow(13 / 12, 12), "每月一次"], [365, Math.pow(1 + 1 / 365, 365), "每天一次"]].forEach(function (d, i) {
      var x = 40 + i * 94, h = d[1] * u;
      s("rect", { x: x, y: yb - h, width: 56, height: h, rx: 6, fill: [C.mint, C.green, C.blue, C.orange][i].f, stroke: C.cocoa, "stroke-width": 1.3 }, svg);
      SK.label(svg, x + 28, yb - h - 14, i === 3 ? "?" : SK.fmt(d[1], 3), { size: 14 });
      SK.label(svg, x + 28, yb + 18, d[2], { size: 12, color: C.soft });
    });
    s("line", { x1: 30, y1: yb - u, x2: 410, y2: yb - u, stroke: C.line, "stroke-dasharray": "4 4" }, svg);
    SK.label(svg, 408, yb - u - 10, "本金 1", { size: 12, anchor: "end", color: C.soft });
  }

  function linearVsRatio(el) {
    var wrap = SK.h("div", { class: "two-col" });
    var st = SK.h("div", { class: "stage" }), side = SK.h("div", { class: "sliders" });
    wrap.appendChild(st); wrap.appendChild(side); el.appendChild(wrap);
    var svg = SK.svg(st, 420, 300, "每年加 10 與每年乘 1.1 的比較");
    var g = s("g", {}, svg), stt = { n: 20 };
    function draw() {
      g.innerHTML = "";
      var n = stt.n, maxV = Math.max(100 * Math.pow(1.1, n), 100 + 10 * n), bw = 360 / n;
      s("line", { x1: 30, y1: 270, x2: 410, y2: 270, class: "m-axis" }, g);
      for (var t = 0; t <= n; t++) {
        var lin = 100 + 10 * t, ex = 100 * Math.pow(1.1, t), x = 40 + t * bw;
        s("rect", { x: x, y: 270 - lin / maxV * 240, width: bw * .42, height: lin / maxV * 240, fill: C.blue.f, stroke: C.blue.s, "stroke-width": .8 }, g);
        s("rect", { x: x + bw * .45, y: 270 - ex / maxV * 240, width: bw * .42, height: ex / maxV * 240, fill: C.orange.f, stroke: C.orange.s, "stroke-width": .8 }, g);
      }
      SK.label(g, 40, 18, "灰藍：每年 +10　蜜桃：每年 ×1.1", { size: 13, anchor: "start" });
      side.querySelector(".readout").innerHTML = SK.tex("\\text{第 }" + n + "\\text{ 年：}\\ \\cb{100+10\\times" + n + "=" + (100 + 10 * n) + "}\\quad \\co{100\\times1.1^{" + n + "}\\approx" + Math.round(100 * Math.pow(1.1, n)) + "}", true);
    }
    side.appendChild(SK.slider({ label: "年數", min: 2, max: 40, value: stt.n, onInput: function (v) { stt.n = v; draw(); } }).el);
    side.insertAdjacentHTML("beforeend", '<div class="readout"></div><p class="muted" style="margin:0;font-size:.95rem">' +
      SK.md("前幾年兩者差不多，甚至「加 10」還比較多。但按比例成長每年的增加量越來越大，遲早會把固定增加遠遠甩在後面。要判斷一個現象是哪一種，看的是「每一步<b>差</b>多少」固定，還是「每一步<b>倍</b>多少」固定。") + "</p>");
    draw();
  }

  SK.mountUnit({
    slug: "exp-growth",
    en: "Where the number e comes from",
    formula: "\\lim_{n\\to\\infty}\\left(1+\\frac{1}{\\co{n}}\\right)^{\\co{n}}=\\cb{e}\\approx2.718,\\qquad A=Pe^{rt}",

    hook: {
      html: "有一家夢幻銀行，年利率 100%。存 1 元，一年結算一次利息，一年後變 2 元。如果改成半年結算一次，每次給 50% 利息，一年後變成 $1.5^2=2.25$ 元。",
      ask: "結算得越頻繁越賺。那如果每一秒、甚至每一瞬間都結算，1 元一年後會變成多少？",
      visual: hookVisual
    },

    guess: {
      q: "1 元存在年利率 100% 的銀行，利息「無限頻繁地」結算，一年後大約變成多少？",
      options: [
        { t: "無限多元", common: true, explain: "結算次數無限多，錢也無限多，這個推論很自然！但結算越頻繁，每次的利率也越小（$\\tfrac1n$），兩件事互相拉扯。結果錢會增加，但被困在一個上限底下。" },
        { t: "2 元", explain: "這是一年只結算一次的結果。半年結算一次就已經有 2.25 元了，所以更頻繁一定超過 2。" },
        { t: "大約 2.718 元", truth: true, explain: "$\\left(1+\\tfrac1n\\right)^n$ 隨著 $n$ 變大越來越接近 $2.71828\\ldots$，這個數就叫做 $e$。它不是誰規定的，而是「連續成長」自己長出來的常數。" },
        { t: "3 元", explain: "很接近的猜測！$\\left(1+\\tfrac1n\\right)^n$ 確實永遠不會超過 3，但它停在比 3 小一點的 $2.718\\ldots$。" }
      ]
    },

    derive: {
      intro: "橫軸是時間（一年），縱軸是存款。一年分成 $n$ 次結算，每次存款乘上 $1+\\tfrac1n$。拖動滑桿改變 $n$。",
      frames: [
        { cap: "一年結算一次：年底一次乘上 2。", tex: "1\\times(1+1)=2" },
        { cap: "半年結算一次：每次乘 1.5，一年兩次。", tex: "\\left(1+\\tfrac12\\right)^2=2.25" },
        { cap: "一年分成 $n$ 次：每次乘 $1+\\tfrac1n$，一共乘 $n$ 次。拖動 $n$，看階梯越來越細。", tex: "\\left(1+\\tfrac1{\\co{n}}\\right)^{\\co{n}}" },
        { cap: "$n$ 越大，階梯的頂端越來越接近一個定值，而不是無限長大。這個極限就是 $e$。", tex: "\\begin{aligned}n=12&:\\ 2.613\\\\ n=365&:\\ 2.7146\\\\ n=10^6&:\\ 2.71828\\ldots\\ \\to\\ \\cb{e}\\end{aligned}" },
        { cap: "階梯細到看不見時，變成一條平滑曲線 $y=e^t$（灰藍色）。年利率改成 $r$、存 $t$ 年，連續複利的結果就是 $Pe^{rt}$。", tex: "\\left(1+\\frac{r}{n}\\right)^{nt}\\ \\longrightarrow\\ e^{rt}" }
      ],
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 520, 420, "複利階梯與連續成長曲線");
        var g = s("g", {}, svg);
        var st = { n: 4 };
        var sl = SK.slider({ label: "$n$", min: 1, max: 60, value: st.n, fmt: function (v) { return v + " 次"; }, onInput: function (v) { st.n = v; draw(); } });
        ctx.sliders.appendChild(sl.el);
        var read = SK.h("div", { class: "readout" });
        ctx.extra.appendChild(read);
        var X = function (t) { return 70 + t * 400; }, Y = function (v) { return 390 - (v - .8) * 170; };
        function draw() {
          var f = ctx.frame, n = f === 0 ? 1 : f === 1 ? 2 : st.n;
          g.innerHTML = "";
          s("line", { x1: 60, y1: Y(.8), x2: 500, y2: Y(.8), class: "m-axis" }, g);
          s("line", { x1: X(0), y1: Y(.8), x2: X(0), y2: 20, class: "m-axis" }, g);
          [1, 1.5, 2, 2.5].forEach(function (v) { s("line", { x1: 60, y1: Y(v), x2: 500, y2: Y(v), class: "m-grid" }, g); SK.label(g, 54, Y(v), String(v), { size: 12, anchor: "end", color: C.soft }); });
          SK.label(g, X(0), Y(.8) + 18, "年初", { size: 12, color: C.soft });
          SK.label(g, X(1), Y(.8) + 18, "年底", { size: 12, color: C.soft });
          if (f >= 3) {
            s("line", { x1: 60, y1: Y(Math.E), x2: 500, y2: Y(Math.E), stroke: C.blue.s, "stroke-width": 1.6, "stroke-dasharray": "7 5" }, g);
            SK.label(g, 496, Y(Math.E) - 10, "e ≈ 2.718", { size: 13, anchor: "end", color: C.blue.s });
          }
          var v = 1, d = "M" + X(0) + " " + Y(1);
          for (var i = 1; i <= n; i++) {
            var t = i / n; d += " H" + X(t); v *= 1 + 1 / n; d += " V" + Y(v);
          }
          s("path", { d: d + " V" + Y(.8) + " H" + X(0) + "Z", fill: C.orange.f, stroke: "none" }, g);
          s("path", { d: d, fill: "none", stroke: C.orange.s, "stroke-width": 2.2, "stroke-linejoin": "round" }, g);
          if (f >= 4) {
            var dc = "";
            for (var k = 0; k <= 100; k++) dc += (k ? "L" : "M") + X(k / 100) + " " + Y(Math.exp(k / 100));
            s("path", { d: dc, fill: "none", stroke: C.blue.s, "stroke-width": 2.6 }, g);
          }
          s("circle", { cx: X(1), cy: Y(v), r: 6, fill: C.orange.f, stroke: C.cocoa, "stroke-width": 1.4 }, g);
          SK.label(g, X(1) - 10, Y(v) - 16, SK.fmt(v, 4), { size: 14, anchor: "end", color: C.orange.s });
          sl.el.style.display = f >= 2 ? "" : "none";
          read.innerHTML = SK.tex("\\left(1+\\tfrac1{" + n + "}\\right)^{" + n + "}\\approx" + SK.fmt(v, 5) + (f >= 3 ? ",\\quad e-\\text{它}\\approx" + SK.fmt(Math.E - v, 4) : ""), true);
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "固定增加 vs. 按比例成長", icon: "sparkle", render: linearVsRatio },
      { title: "自然對數與倍增時間", icon: "leaf",
        html: "$e^x$ 的反函數叫做<b>自然對數</b> $\\ln x$。以年利率 $r$ 連續成長，要多久會變 2 倍？解 $e^{rt}=2$，得 $t=\\dfrac{\\ln2}{r}\\approx\\dfrac{0.7}{r}$。所以年利率 7% 大約 10 年翻倍，2% 大約 35 年翻倍。這就是理財書上常說的「70 法則」。" }
    ],

    challenges: [
      { q: "年利率 2%、連續複利，存多少年會變成兩倍？和一年結算一次比，差多少？", hint: "連續複利：$e^{0.02t}=2$。一年一次：$1.02^t=2$。",
        idea: "連續複利 $t=\\dfrac{\\ln2}{0.02}\\approx34.7$ 年；一年一次 $t=\\dfrac{\\log2}{\\log1.02}\\approx35.0$ 年。利率低的時候，結算方式影響不大。" },
      { q: "細菌每 3 小時數量加倍。一天（24 小時）後是原來的幾倍？這是固定增加還是按比例成長？", idea: "24 小時是 8 個 3 小時，$2^8=256$ 倍。每段時間「乘」固定倍數，是按比例成長，不是每次多兩隻。" },
      { q: "為什麼 $\\left(1+\\tfrac1n\\right)^n$ 永遠不會超過 3？", hint: "用二項式展開，把每一項和 $\\dfrac1{k!}$ 比大小，再和 $1+1+\\tfrac12+\\tfrac14+\\cdots$ 比。",
        idea: "展開後第 $k$ 項 $\\le\\dfrac1{k!}\\le\\dfrac1{2^{k-1}}$，所以總和 $\\le1+\\left(1+\\tfrac12+\\tfrac14+\\cdots\\right)=1+2=3$。無窮等比級數在這裡幫了大忙。" }
    ],

    where: {
      codes: [["F-11B-2", "（數 B）按比例成長模型：指數與對數函數、地震規模、金融理財、平均成長率、連續複利、$e$ 與自然對數"], ["N-12甲-1", "（數甲）數列的極限：由連續複利認識 $e$"]],
      exam: "數 B 在學測範圍內，重點是連續複利與成長模型的解讀；數甲在分科範圍內，重點是把 $e$ 看成數列的極限。數 A 的 `F-11A-4` 也處理指數成長衰退，但以常用對數為主。",
      stop: "數 B 不評量換底公式、首數尾數與繁複演算，$e$ 也不由極限定義。數甲的標準指數函數與自然對數函數屬於 `※` 延伸；不要求背 $e$ 的長小數。"
    }
  });
})();
