/* 補充單元：有理根候選 */
(function () {
  var C = SK.C, s = SK.s;
  function f(x) { return 2 * x * x * x - 3 * x * x - 3 * x + 2; }

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 220, "數線上有無限多個有理數");
    s("line", { x1: 20, y1: 110, x2: 380, y2: 110, class: "m-axis" }, svg);
    for (var i = 0; i < 60; i++) { var x = 30 + (i * 37) % 340; s("circle", { cx: x, cy: 110, r: 2, fill: C.line }, svg); }
    SK.label(svg, 200, 70, "2x³ − 3x² − 3x + 2 = 0", { size: 16 });
    SK.label(svg, 200, 160, "有理數這麼多，要從哪裡開始試？", { size: 13, color: C.soft });
  }

  SK.mountUnit({
    slug: "rational-root",
    en: "Only finitely many candidates",
    formula: "\\frac{\\co{p}}{\\cb{q}}\\ \\text{是根（最簡分數）}\\ \\Rightarrow\\ \\co{p}\\mid a_0,\\ \\ \\cb{q}\\mid a_n",

    hook: {
      html: "要解 $2x^3-3x^2-3x+2=0$。如果它有有理數根，可能是哪一個？有理數有無限多個，不可能一個一個試。",
      ask: "有沒有辦法把「值得試的候選人」縮小到只剩幾個？",
      visual: hookVisual
    },

    guess: {
      q: "$2x^3-3x^2-3x+2=0$ 的有理根，下列哪一個<b>不可能</b>是？",
      options: [
        { t: "$\\frac13$", truth: true, explain: "分母 3 不是首項係數 2 的因數，所以 $\\frac13$ 連候選人都不是。這個方程式的根是 $2,\\ -1,\\ \\frac12$。" },
        { t: "$2$", explain: "2 是常數項 2 的因數、分母 1 整除首項 2，是候選人。代入：$16-12-6+2=0$，真的是根！" },
        { t: "$\\frac12$", common: true, explain: "分數看起來很奇怪，但分子 1 整除 2、分母 2 整除首項係數 2，它是合格的候選人，而且真的是根。" },
        { t: "$-1$", explain: "$-1$ 是候選人：$-2-3+3+2=0$，也是根。" }
      ]
    },

    derive: {
      intro: "數線上標出所有候選人 $\\pm\\frac{p}{q}$，再逐一代入檢驗（因式定理）。",
      frames: [
        { cap: "假設最簡分數 $\\frac pq$ 是根，代入後兩邊同乘 $q^3$，變成整數的等式。", tex: "2p^3-3p^2q-3pq^2+2q^3=0" },
        { cap: "把含 $p$ 的項移到一邊：左邊是 $p$ 的倍數，所以 $p$ 整除 $2q^3$。$p$、$q$ 互質，所以 $p$ 整除常數項 2。", tex: "p(2p^2-3pq-3q^2)=-2q^3\\ \\Rightarrow\\ \\co{p\\mid 2}" },
        { cap: "同理，把含 $q$ 的項移到一邊：$q$ 整除 $2p^3$，所以 $q$ 整除首項係數 2。", tex: "q(-3p^2-3pq+2q^2)=-2p^3\\ \\Rightarrow\\ \\cb{q\\mid 2}" },
        { cap: "候選人只剩有限個：$p\\in\\{\\pm1,\\pm2\\}$、$q\\in\\{1,2\\}$，也就是 $\\pm1,\\pm2,\\pm\\frac12$。逐一代入，綠色的就是真正的根。", tex: "\\pm1,\\ \\pm2,\\ \\pm\\tfrac12" },
        { cap: "找到一個根就能用因式定理降次。三個根都找到了，就能完全分解。", tex: "\\begin{aligned}&2x^3-3x^2-3x+2\\\\&=(x-2)(x+1)(2x-1)\\end{aligned}" }
      ],
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 520, 360, "有理根候選在數線與圖形上");
        var g = s("g", {}, svg);
        var read = SK.h("div", { class: "readout" });
        ctx.extra.appendChild(read);
        var cands = [-2, -1, -.5, .5, 1, 2];
        function draw() {
          var fr = ctx.frame, X = function (x) { return 260 + x * 90; }, Y = function (y) { return 200 - y * 14; };
          g.innerHTML = "";
          s("line", { x1: 20, y1: Y(0), x2: 500, y2: Y(0), class: "m-axis" }, g);
          var d = "";
          for (var x = -2.5; x <= 2.5; x += .02) d += (d ? "L" : "M") + X(x) + " " + SK.clamp(Y(f(x)), 10, 350);
          s("path", { d: d, fill: "none", stroke: fr >= 3 ? C.ink : "#DDD3C4", "stroke-width": 2.2 }, g);
          if (fr >= 3) cands.forEach(function (c) {
            var isRoot = Math.abs(f(c)) < 1e-9;
            s("line", { x1: X(c), y1: Y(0), x2: X(c), y2: SK.clamp(Y(f(c)), 10, 350), stroke: isRoot ? C.green.s : C.pink.s, "stroke-dasharray": "3 4" }, g);
            s("circle", { cx: X(c), cy: Y(0), r: 7, fill: isRoot ? C.green.f : C.pink.f, stroke: isRoot ? C.green.s : C.pink.s, "stroke-width": 1.4 }, g);
            SK.label(g, X(c), Y(0) + 22, c === .5 ? "1/2" : c === -.5 ? "−1/2" : SK.fmt(c, 0), { size: 13 });
            SK.label(g, X(c), Y(0) + 40, "f = " + SK.fmt(f(c), 2), { size: 11, color: isRoot ? C.green.s : C.soft });
          });
          if (fr < 3) SK.label(g, 260, 60, fr === 0 ? "設 p/q 是根（最簡分數）" : fr === 1 ? "p 必須整除常數項 2" : "q 必須整除首項係數 2", { size: 16, color: fr === 1 ? C.orange.s : fr === 2 ? C.blue.s : C.ink });
          read.innerHTML = SK.tex(fr >= 3 ? "f(2)=0,\\ f(-1)=0,\\ f(\\tfrac12)=0" : "f(x)=2x^3-3x^2-3x+2", true);
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "它只能找有理根", icon: "sparkle",
        html: "候選人檢驗法只能告訴你「如果有有理根，一定在這些裡面」。像 $x^2-2=0$ 的根 $\\pm\\sqrt2$ 是無理數，候選人 $\\pm1,\\pm2$ 全部代進去都不是 0，但方程式明明有實根。這時要改用勘根定理和牛頓法去逼近（見「複數與方程式」和「導數」單元）。" }
    ],

    challenges: [
      { q: "$3x^3-x^2-3x+1=0$ 的有理根候選有哪些？找出所有的根。", idea: "候選 $\\pm1,\\pm\\frac13$。$f(1)=0$、$f(-1)=0$、$f(\\frac13)=0$，所以 $(x-1)(x+1)(3x-1)=0$。" },
      { q: "為什麼首項係數是 1 的整係數多項式，有理根一定是整數？", idea: "$q$ 必須整除 1，所以 $q=1$，根 $\\frac p1$ 是整數。這也證明了 $\\sqrt2$ 不是有理數：$x^2-2=0$ 的有理根只能是整數 $\\pm1,\\pm2$，都不是根。" }
    ],

    where: {
      codes: [["A-10-2", "（接點）多項式除法原理：因式定理"], ["A-12甲-1", "（接點）複數與方程式"]],
      exam: "<b>課綱外補充</b>：教材稱為「一次因式檢驗法」。可以用來說明為什麼候選人有限，但課程手冊明確表示，數甲<b>不宜評量</b>整係數方程式的有理根技巧題。",
      stop: "用一個簡單的例子說明原理，再回到代入與因式定理就好；不做大量的候選人篩選練習。"
    }
  });
})();
