/* 單元：數列的極限 */
(function () {
  var C = SK.C, s = SK.s;

  var SEQS = [
    { key: "1+1/n", tex: "a_n=\\frac{n+1}{n}=1+\\frac1n", f: function (n) { return 1 + 1 / n; }, L: 1 },
    { key: "(-1)^n/n", tex: "a_n=\\frac{(-1)^n}{n}", f: function (n) { return Math.pow(-1, n) / n; }, L: 0 },
    { key: "(-1)^n", tex: "a_n=(-1)^n", f: function (n) { return Math.pow(-1, n); }, L: null },
    { key: "sin n / n", tex: "a_n=\\frac{\\sin n}{n}", f: function (n) { return Math.sin(n) / n; }, L: 0, squeeze: true }
  ];

  function hookVisual(el) {
    var svg = SK.svg(el, 420, 200, "每次走剩下距離的一半");
    s("line", { x1: 40, y1: 110, x2: 380, y2: 110, stroke: C.cocoa, "stroke-width": 1.4 }, svg);
    s("rect", { x: 380, y: 50, width: 12, height: 80, fill: C.oat || "#F1EADC", stroke: C.cocoa, "stroke-width": 1.2 }, svg);
    SK.label(svg, 386, 144, "牆", { size: 13 });
    var x = 40;
    for (var k = 0; k < 7; k++) {
      var nx = x + (380 - x) / 2;
      s("path", { d: "M" + x + " 104 Q" + (x + nx) / 2 + " " + (80 + k * 3) + " " + nx + " 104", fill: "none", stroke: C.orange.s, "stroke-width": 1.6 }, svg);
      s("circle", { cx: nx, cy: 110, r: 3.5, fill: C.orange.f, stroke: C.cocoa, "stroke-width": 1 }, svg);
      x = nx;
    }
    SK.label(svg, 210, 180, "走了無限多步，會「到」牆嗎？", { size: 14, color: C.soft });
  }

  SK.mountUnit({
    slug: "limit",
    en: "Does an endless process settle down?",
    formula: "\\lim_{n\\to\\infty}a_n=\\co{L},\\qquad b_n\\le a_n\\le c_n,\\ \\lim b_n=\\lim c_n=L\\ \\Rightarrow\\ \\lim a_n=L",

    hook: {
      html: "你站在離牆 2 公尺的地方。每一步都走「剩下距離的一半」：1 公尺、0.5 公尺、0.25 公尺……",
      ask: "你永遠沒有真的碰到牆，但你離牆的距離會變成什麼？「無限多步之後」到底是什麼意思？",
      visual: hookVisual
    },

    guess: {
      q: "數列 $1,-1,1,-1,1,-1,\\dots$ 有沒有極限？",
      options: [
        { t: "有，極限是 0（兩個數的平均）", common: true, explain: "很合理的想法：它在 0 的兩邊跳，平均下來是 0。但極限問的是「數列本身」最後會不會待在某個值附近，而這個數列永遠在 1 和 −1 之間跳，從不靠近 0。" },
        { t: "有，極限是 1", explain: "奇數項後面確實一直是 1，但偶數項一直是 −1。極限必須讓「從某一項以後的<b>全部</b>項」都靠近它。" },
        { t: "沒有極限", truth: true, explain: "不管你猜極限是多少，都能找到一條很窄的帶子，讓 1 和 −1 不能同時待在裡面。所以這個數列<b>發散</b>，而且是「擺動發散」。" },
        { t: "有兩個極限：1 和 −1", explain: "你觀察到它有兩個「聚集點」，這在大學會有名字！但高中所說的極限必須是唯一的一個數，所以這個數列沒有極限。" }
      ]
    },

    derive: {
      intro: "把數列畫成點 $(n,a_n)$。綠色帶子是「離 $L$ 的誤差範圍」，拖動滑桿把帶子調窄。",
      tall: true,
      frames: [
        { cap: "數列就是一串數：$a_1,a_2,a_3,\\dots$。把第 $n$ 項畫在 $(n,a_n)$，看它往右走的趨勢。", tex: "a_n=1+\\frac1n:\\ 2,\\ 1.5,\\ 1.33,\\ 1.25,\\ \\dots" },
        { cap: "畫一條以 1 為中心的帶子。不管帶子多窄，<b>從某一項以後</b>，所有的點都在帶子裡。這就是「極限是 1」的意思。", tex: "\\lim_{n\\to\\infty}\\left(1+\\frac1n\\right)=\\co{1}" },
        { cap: "來回擺動也可以收斂：$\\frac{(-1)^n}{n}$ 一上一下，但擺動越來越小，最後都擠進 0 附近的帶子。", tex: "\\lim_{n\\to\\infty}\\frac{(-1)^n}{n}=0" },
        { cap: "$(-1)^n$ 就不行了：把帶子調窄到寬度小於 1，1 和 −1 就不可能同時在裡面。沒有任何 $L$ 能當它的極限。", tex: "(-1)^n\\ \\text{發散（擺動）}" },
        { cap: "<b>夾擠定理</b>：$\\frac{\\sin n}{n}$ 很難直接算，但它被夾在 $-\\frac1n$ 和 $\\frac1n$ 之間（虛線）。兩邊都往 0 擠，中間的也只能跟著到 0。", tex: "-\\frac1n\\le\\frac{\\sin n}{n}\\le\\frac1n\\ \\Rightarrow\\ \\lim\\frac{\\sin n}{n}=0" }
      ],
      hint: "拖動「帶寬」滑桿；圖上會標出從第幾項以後全部落在帶子裡。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 520, 400, "數列的點與誤差帶");
        var g = s("g", {}, svg);
        var st = { eps: .2 };
        var X = function (n) { return 50 + n * 11.5; }, Y = function (y) { return 205 - y * 88; };
        var read = SK.h("div", { class: "readout" });
        ctx.sliders.appendChild(SK.slider({ label: "帶寬", min: .02, max: .8, step: .01, value: st.eps, color: "green", fmt: function (v) { return "±" + SK.fmt(v, 2); }, onInput: function (v) { st.eps = v; draw(); } }).el);
        ctx.extra.appendChild(read);
        function draw() {
          var fr = ctx.frame, sq = SEQS[fr <= 1 ? 0 : fr === 2 ? 1 : fr === 3 ? 2 : 3], Nmax = 40, eps = st.eps;
          var L = sq.L === null ? 0 : sq.L;
          g.innerHTML = "";
          [-1, 0, 1, 2].forEach(function (v) { s("line", { x1: 40, y1: Y(v), x2: 510, y2: Y(v), class: "m-grid" }, g); SK.label(g, 32, Y(v), String(v), { size: 11, anchor: "end", color: C.soft }); });
          s("line", { x1: 40, y1: Y(0), x2: 510, y2: Y(0), class: "m-axis" }, g);
          [10, 20, 30, 40].forEach(function (n) { SK.label(g, X(n), 390, "n=" + n, { size: 11, color: C.soft }); });
          if (fr >= 1) {
            s("rect", { x: 40, y: Y(L + eps), width: 470, height: Y(L - eps) - Y(L + eps), fill: C.mint.f, stroke: C.green.s, "stroke-width": 1, "stroke-dasharray": "5 4" }, g);
            s("line", { x1: 40, y1: Y(L), x2: 510, y2: Y(L), stroke: C.green.s, "stroke-width": 1.4 }, g);
          }
          if (sq.squeeze) {
            ["+", "-"].forEach(function (sg) {
              var d = "";
              for (var t = 1; t <= Nmax; t += .25) d += (t > 1 ? "L" : "M") + X(t) + " " + Y((sg === "+" ? 1 : -1) / t);
              s("path", { d: d, fill: "none", stroke: C.purple.s, "stroke-width": 1.4, "stroke-dasharray": "5 4" }, g);
            });
          }
          // 從第 N 項以後都在帶子裡
          var N = null;
          if (sq.L !== null) { for (var n = Nmax; n >= 1; n--) { if (Math.abs(sq.f(n) - L) >= eps) { N = n + 1; break; } } if (N === null) N = 1; }
          for (var k = 1; k <= Nmax; k++) {
            var v = sq.f(k), inside = Math.abs(v - L) < eps;
            var col = fr >= 1 && sq.L !== null && k >= N ? C.green : fr >= 1 && !inside ? C.pink : C.orange;
            s("circle", { cx: X(k), cy: SK.clamp(Y(v), 8, 380), r: 4.2, fill: col.f, stroke: col.s, "stroke-width": 1.1 }, g);
          }
          if (fr >= 1 && sq.L !== null && N <= Nmax) {
            s("line", { x1: X(N) - 6, y1: 20, x2: X(N) - 6, y2: 372, stroke: C.ink, "stroke-dasharray": "3 4" }, g);
            SK.label(g, X(N), 28, "從第 " + N + " 項起全部在帶子裡", { size: 12, anchor: X(N) > 380 ? "end" : "start", color: C.green.s });
          }
          if (fr === 3) SK.label(g, 280, 28, eps < .5 ? "帶子太窄：1 和 −1 不能同時放進去" : "把帶寬調到 0.5 以下試試", { size: 13, color: C.pink.s });
          var first = [1, 2, 3, 4, 5].map(function (k) { return SK.fmt(sq.f(k), 3); }).join(",\\ ");
          read.innerHTML = SK.tex(sq.tex + ":\\ " + first + ",\\ \\dots", true);
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "$e$ 也是一個數列的極限", icon: "sparkle",
        html: "「按比例成長與 e」單元裡的 $\\left(1+\\tfrac1n\\right)^n$ 是一個數列：$2,\\ 2.25,\\ 2.37,\\ 2.44,\\ \\dots$。它一直變大，卻永遠不超過 3。<b>有上界又一直遞增的數列一定會收斂</b>，它的極限就定義成 $e=2.71828\\ldots$。很多重要的常數，都是用「無限過程的終點」來定義的。" },
      { title: "為什麼微積分離不開極限", icon: "leaf",
        html: "切線斜率是割線斜率的極限（「導數」單元），曲線下面積是長條總和的極限（「微積分基本定理」單元），$0.999\\ldots=1$ 是部分和的極限（「無窮等比級數」單元）。極限是一把鑰匙，讓我們能精確地談「無限靠近」而不必真的走到無限。" }
    ],

    challenges: [
      { q: "求 $\\displaystyle\\lim_{n\\to\\infty}\\frac{2n+1}{n+3}$。", hint: "分子、分母同除以 $n$。",
        idea: "$\\dfrac{2+\\frac1n}{1+\\frac3n}\\to\\dfrac{2}{1}=2$。$n$ 很大時，只有最高次項說了算，和「三次函數」單元的大域行為是同一個道理。" },
      { q: "開頭走向牆的問題：第 $n$ 步後離牆多遠？極限是多少？「到達」和「極限是 0」有什麼不同？", idea: "離牆 $2\\cdot\\left(\\tfrac12\\right)^n$，極限是 0。每一步都還沒到，但距離可以小於任何你指定的正數，這就是「極限是 0」的意思。" },
      { q: "用夾擠定理求 $\\displaystyle\\lim_{n\\to\\infty}\\frac{\\cos n}{n^2}$。", idea: "$-\\dfrac1{n^2}\\le\\dfrac{\\cos n}{n^2}\\le\\dfrac1{n^2}$，兩邊都趨近 0，所以極限是 0。" }
    ],

    where: {
      codes: [["N-12甲-1", "數列的極限：極限運算、夾擠定理、由連續複利認識 $e$、牛頓求根法"], ["F-12甲-2", "函數的極限：左右極限、連續、介值定理、夾擠定理"]],
      exam: "12 年級<b>選修數學甲</b>，只在分科測驗數甲的範圍內，學測不考。它是無窮級數、導數、積分共同的基礎。",
      stop: "用圖、表、數式理解「越來越接近」就好，不進入 $\\varepsilon$-$N$ 或 $\\varepsilon$-$\\delta$ 的嚴格證明，也不做人造的極限技巧題。極限要服務微積分主線。"
    }
  });
})();
