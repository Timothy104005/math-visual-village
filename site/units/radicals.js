/* 單元：根式與分式運算 */
(function () {
  var C = SK.C, s = SK.s;

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 250, "面積 50 的正方形");
    var side = 150, x0 = 50, y0 = 50;
    s("rect", { x: x0, y: y0, width: side, height: side, fill: C.gold.f, stroke: C.cocoa, "stroke-width": 1.6 }, svg);
    for (var i = 1; i < 5; i++) {
      s("line", { x1: x0 + i * side / 5, y1: y0, x2: x0 + i * side / 5, y2: y0 + side, stroke: C.line, "stroke-width": .8 }, svg);
      s("line", { x1: x0, y1: y0 + i * side / 5, x2: x0 + side, y2: y0 + i * side / 5, stroke: C.line, "stroke-width": .8 }, svg);
    }
    SK.label(svg, x0 + side / 2, y0 + side / 2, "面積 50", { size: 16 });
    SK.label(svg, x0 + side / 2, y0 + side + 24, "邊長 √50", { size: 14, color: C.orange.s });
    SK.label(svg, 300, 100, "25 個小方格", { size: 13, color: C.soft });
    SK.label(svg, 300, 126, "每格面積 2", { size: 13, color: C.soft });
    SK.label(svg, 300, 170, "√50 = 5√2", { size: 15, color: C.pink.s });
  }

  var RAT = [
    { steps: [[{ n: "1", d: "√2" }], [{ n: "1 × √2", d: "√2 × √2" }], [{ n: "√2", d: "2" }]], val: 1 / Math.SQRT2 },
    { steps: [[{ n: "1", d: "√5 + √2" }], [{ n: "√5 − √2", d: "(√5+√2)(√5−√2)" }], [{ n: "√5 − √2", d: "5 − 2" }, { t: "=" }, { n: "√5 − √2", d: "3" }]], val: 1 / (Math.sqrt(5) + Math.sqrt(2)) },
    { steps: [[{ n: "2", d: "√3 − 1" }], [{ n: "2(√3 + 1)", d: "(√3−1)(√3+1)" }], [{ n: "2(√3 + 1)", d: "2" }, { t: "= √3 + 1" }]], val: 2 / (Math.sqrt(3) - 1) }
  ];

  SK.mountUnit({
    slug: "radicals",
    en: "Tidying roots and fractions",
    formula: "\\sqrt{ab}=\\sqrt a\\sqrt b,\\qquad \\frac{1}{\\sqrt a+\\sqrt b}=\\frac{\\sqrt a-\\sqrt b}{a-b},\\qquad \\frac{x^2-1}{x+1}=x-1\\ (x\\ne-1)",

    hook: {
      html: "面積 50 的正方形，邊長是 $\\sqrt{50}$。把它切成 25 個小方格，每格面積 2、邊長 $\\sqrt2$。所以整個邊長是 5 個 $\\sqrt2$。",
      ask: "$\\sqrt{50}=5\\sqrt2$。什麼時候可以這樣把根號「拆開」？分母有根號時又該怎麼辦？",
      visual: hookVisual
    },

    guess: {
      q: "$\\dfrac{1}{\\sqrt5+\\sqrt2}$ 等於下列哪一個？",
      options: [
        { t: "$\\dfrac{\\sqrt5-\\sqrt2}{3}$", truth: true, explain: "分子分母同乘 $\\sqrt5-\\sqrt2$。分母用乘法公式 $(a+b)(a-b)=a^2-b^2$ 變成 $5-2=3$，根號就消失了。這叫<b>分母有理化</b>。" },
        { t: "$\\dfrac{1}{\\sqrt5}+\\dfrac{1}{\\sqrt2}$", common: true, explain: "把分母拆開是很常見的錯誤！檢查一下：$\\tfrac{1}{\\sqrt5+\\sqrt2}\\approx0.27$，但 $\\tfrac1{\\sqrt5}+\\tfrac1{\\sqrt2}\\approx1.15$，差很多。分母是「和」的時候不能逐項取倒數。" },
        { t: "$\\sqrt5-\\sqrt2$", explain: "少除了分母的 3。$(\\sqrt5+\\sqrt2)(\\sqrt5-\\sqrt2)=3$，不是 1。" },
        { t: "$\\dfrac{1}{\\sqrt7}$", explain: "$\\sqrt5+\\sqrt2\\ne\\sqrt7$。根號<b>不能</b>對加法拆開：$\\sqrt5+\\sqrt2\\approx3.65$，而 $\\sqrt7\\approx2.65$。" }
      ]
    },

    derive: {
      intro: "下面每一步都可以用右邊的數值檢查：兩個式子如果相等，算出來的小數也會一樣。",
      tall: true,
      frames: [
        { cap: "根號對<b>乘除</b>可以拆開，對<b>加減</b>不行。因為 $(\\sqrt a\\sqrt b)^2=ab$，所以 $\\sqrt a\\sqrt b=\\sqrt{ab}$；化簡時把平方因數提出來。", tex: "\\begin{gathered}\\sqrt{50}=\\sqrt{25\\cdot2}=5\\sqrt2\\\\\\sqrt{a+b}\\ne\\sqrt a+\\sqrt b\\end{gathered}" },
        { cap: "<b>同類根式</b>才能相加，就像同類項：$2\\sqrt2+3\\sqrt2=5\\sqrt2$。$\\sqrt2+\\sqrt3$ 不能合併，只能保持原樣。", tex: "\\begin{gathered}2\\sqrt2+3\\sqrt2=5\\sqrt2\\\\\\sqrt2+\\sqrt3\\ \\text{不能合併}\\end{gathered}" },
        { cap: "<b>分母有理化</b>：分母只有一個根號時乘它自己；分母是兩項時，乘上<b>共軛</b>（把中間的符號反過來），用 $(a+b)(a-b)=a^2-b^2$ 把根號消掉。點按鈕換例子。", tex: "\\frac{1}{\\sqrt a+\\sqrt b}\\times\\frac{\\sqrt a-\\sqrt b}{\\sqrt a-\\sqrt b}=\\frac{\\sqrt a-\\sqrt b}{a-b}" },
        { cap: "<b>分式的約分</b>：先因式分解，再把相同的因式消掉。要注意消掉的因式<b>不能為 0</b>：$\\tfrac{x^2-1}{x+1}=x-1$ 只在 $x\\ne-1$ 時成立，圖上那一點是個洞。", tex: "\\frac{x^2-1}{x+1}=\\frac{(x+1)(x-1)}{x+1}=x-1" },
        { cap: "<b>分式的加減</b>：先通分再相加，和分數一樣。分母不同就找公分母（通常是各分母的乘積或最小公倍式）。", tex: "\\frac{1}{x}+\\frac{1}{x+1}=\\frac{(x+1)+x}{x(x+1)}=\\frac{2x+1}{x(x+1)}" }
      ],
      hint: "拖動 x 檢查分式的等式；第 3 步可以點按鈕換例子。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 540, 440, "根式與分式");
        var g = s("g", {}, svg);
        var st = { i: 1, x: 2 };
        var read = SK.h("div", { class: "readout" });
        var btns = SK.h("div", { style: "display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px" });
        ["分母 √2", "分母 √5+√2", "分母 √3−1"].forEach(function (t, i) {
          var b = SK.h("button", { class: "chip", type: "button", "aria-pressed": i === 1 ? "true" : "false" }, t);
          b.addEventListener("click", function () { st.i = i; Array.prototype.forEach.call(btns.children, function (x, k) { x.setAttribute("aria-pressed", k === i ? "true" : "false"); }); draw(); });
          btns.appendChild(b);
        });
        var sx = SK.slider({ label: "$x$", min: -3, max: 3, step: .1, value: st.x, onInput: function (v) { st.x = v; draw(); } });
        ctx.sliders.appendChild(sx.el);
        ctx.extra.appendChild(btns); ctx.extra.appendChild(read);
        function num(v, d) { return SK.fmt(v, d == null ? 4 : d).replace("−", "-"); }
        // 用純 SVG 畫算式卡（foreignObject 裡的 KaTeX 在 SVG 內不可靠）
        function width(it, size) {
          if (it.t != null) return it.t.length * size * .62;
          return Math.max(it.n.length, it.d.length) * size * .62 + 14;
        }
        function expr(items, cx, cy, size) {
          var total = items.reduce(function (m, it) { return m + width(it, size) + 6; }, 0);
          var x = cx - total / 2;
          items.forEach(function (it) {
            var w = width(it, size);
            if (it.t != null) SK.label(g, x + w / 2, cy, it.t, { size: size, color: it.c || C.ink });
            else {
              SK.label(g, x + w / 2, cy - size * .62, it.n, { size: size * .92, color: it.c || C.ink });
              s("line", { x1: x + 4, y1: cy, x2: x + w - 4, y2: cy, stroke: it.c || C.ink, "stroke-width": 1.4 }, g);
              SK.label(g, x + w / 2, cy + size * .68, it.d, { size: size * .92, color: it.c || C.ink });
            }
            x += w + 6;
          });
        }
        function card(y, items, col, h, x0, w0) {
          h = h || 56; x0 = x0 == null ? 60 : x0; w0 = w0 == null ? 420 : w0;
          s("rect", { x: x0, y: y, width: w0, height: h, rx: 10, fill: col || C.paper, stroke: C.line }, g);
          expr(items, x0 + w0 / 2, y + h / 2, 17);
        }
        function bar(x, y, w, col, lab) {
          s("rect", { x: x, y: y, width: w, height: 30, rx: 4, fill: col.f, stroke: col.s }, g);
          if (lab) SK.label(g, x + w / 2, y + 15, lab, { size: 13 });
        }
        function draw() {
          var f = ctx.frame, x = st.x;
          g.innerHTML = "";
          btns.style.display = f === 2 ? "flex" : "none";
          sx.el.style.display = f >= 3 ? "" : "none";
          if (f === 0) {
            // √50 的方格圖 + 反例
            var side = 190, x0 = 40, y0 = 60;
            s("rect", { x: x0, y: y0, width: side, height: side, fill: C.gold.f, stroke: C.cocoa, "stroke-width": 1.6 }, g);
            for (var i = 1; i < 5; i++) {
              s("line", { x1: x0 + i * side / 5, y1: y0, x2: x0 + i * side / 5, y2: y0 + side, stroke: C.line }, g);
              s("line", { x1: x0, y1: y0 + i * side / 5, x2: x0 + side, y2: y0 + i * side / 5, stroke: C.line }, g);
            }
            SK.brace(g, x0, y0 + side + 10, x0 + side / 5, y0 + side + 10, -10, C.orange.s);
            SK.label(g, x0 + side / 10, y0 + side + 42, "√2", { size: 13, color: C.orange.s });
            SK.brace(g, x0, y0 + side + 60, x0 + side, y0 + side + 60, -12, C.blue.s);
            SK.label(g, x0 + side / 2, y0 + side + 92, "5 個 √2 = √50", { size: 14, color: C.blue.s });
            card(70, [{ t: "√2 × √3 = √6  ✓" }], "rgba(207,224,211,.5)", 52, 270, 240);
            card(150, [{ t: "√4 + √9 = 2 + 3 = 5" }], "rgba(233,193,191,.4)", 52, 270, 240);
            card(212, [{ t: "√(4+9) = √13 ≈ 3.61 ✗" }], "rgba(233,193,191,.4)", 52, 270, 240);
            SK.label(g, 390, 130, "乘除可以拆", { size: 12, color: C.green.s });
            SK.label(g, 390, 288, "加法不能拆", { size: 12, color: C.pink.s });
            read.innerHTML = SK.tex("\\sqrt{50}=\\sqrt{25}\\sqrt2=5\\sqrt2\\approx" + num(Math.sqrt(50)), true);
            return;
          }
          if (f === 1) {
            var u = 58;
            SK.label(g, 270, 40, "同類根式：長度一樣，可以接起來", { size: 14, color: C.soft });
            bar(60, 80, 2 * u, C.orange, "2√2");
            bar(60 + 2 * u, 80, 3 * u, C.blue, "3√2");
            bar(60, 140, 5 * u, C.gold, "5√2");
            SK.label(g, 270, 210, "不同類的根式：接不起來", { size: 14, color: C.soft });
            bar(60, 240, Math.SQRT2 * u, C.orange, "√2");
            bar(60 + Math.SQRT2 * u, 240, Math.sqrt(3) * u, C.green, "√3");
            card(300, [{ t: "√2 + √3 ≈ 3.146 ≠ √5 ≈ 2.236" }], "rgba(233,193,191,.4)");
            read.innerHTML = SK.tex("2\\sqrt2+3\\sqrt2=(2+3)\\sqrt2=5\\sqrt2\\approx" + num(5 * Math.SQRT2), true);
            return;
          }
          if (f === 2) {
            var R = RAT[st.i];
            R.steps.forEach(function (t, i) {
              card(70 + i * 100, t, i === R.steps.length - 1 ? "rgba(207,224,211,.5)" : C.paper, 76);
              if (i < R.steps.length - 1) SK.label(g, 270, 158 + i * 100, "↓ 乘上共軛（等於乘 1）", { size: 12, color: C.soft });
            });
            read.innerHTML = SK.tex("\\text{數值檢查：}" + num(R.val), true) + '<p class="muted" style="margin:4px 0 0;font-size:.9rem">有理化之後，只要查根號的近似值就能手算。</p>';
            return;
          }
          if (f === 3) {
            // (x²−1)/(x+1) 與 x−1 的圖
            var O = [270, 250], u2 = 44;
            function P(a, b) { return [O[0] + a * u2, O[1] - b * u2]; }
            for (var i2 = -5; i2 <= 5; i2++) { var p1 = P(i2, -4), p2 = P(i2, 4); s("line", { x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1], class: "m-grid" }, g); }
            for (var j = -4; j <= 4; j++) { var q1 = P(-5, j), q2 = P(5, j); s("line", { x1: q1[0], y1: q1[1], x2: q2[0], y2: q2[1], class: "m-grid" }, g); }
            var ax = P(-5, 0), bx = P(5, 0), ay = P(0, -4), by = P(0, 4);
            s("line", { x1: ax[0], y1: ax[1], x2: bx[0], y2: bx[1], class: "m-axis" }, g);
            s("line", { x1: ay[0], y1: ay[1], x2: by[0], y2: by[1], class: "m-axis" }, g);
            var d = "";
            for (var t = -5; t <= 5; t += .05) { var p = P(t, t - 1); if (Math.abs(t - 1) > 4.2) continue; d += (d ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1); }
            s("path", { d: d, fill: "none", stroke: C.orange.s, "stroke-width": 2.8 }, g);
            var hole = P(-1, -2);
            s("circle", { cx: hole[0], cy: hole[1], r: 6, fill: C.paper, stroke: C.orange.s, "stroke-width": 2.4 }, g);
            SK.label(g, hole[0] + 10, hole[1] + 18, "x = −1 沒有定義", { size: 12, color: C.pink.s, anchor: "start" });
            var val = Math.abs(x + 1) < 1e-9 ? null : (x * x - 1) / (x + 1);
            if (val !== null) { var pv = P(x, val); s("circle", { cx: pv[0], cy: pv[1], r: 6, fill: C.blue.s }, g); }
            read.innerHTML = SK.tex("\\frac{x^2-1}{x+1}\\Big|_{x=" + num(x, 1) + "}=" + (val === null ? "\\text{沒有定義}" : num(val, 3)) + ",\\quad x-1=" + num(x - 1, 3), true);
            return;
          }
          card(60, [{ n: "1", d: "x" }, { t: "+" }, { n: "1", d: "x + 1" }], C.paper, 80);
          SK.label(g, 270, 156, "↓ 通分：公分母 x(x+1)", { size: 13, color: C.soft });
          card(172, [{ n: "x + 1", d: "x(x+1)" }, { t: "+" }, { n: "x", d: "x(x+1)" }], C.paper, 80);
          SK.label(g, 270, 268, "↓ 分子相加", { size: 13, color: C.soft });
          card(284, [{ n: "2x + 1", d: "x(x+1)" }], "rgba(207,224,211,.5)", 80);
          var ok = Math.abs(x) > 1e-9 && Math.abs(x + 1) > 1e-9;
          read.innerHTML = ok
            ? SK.tex("\\begin{aligned}\\tfrac1x+\\tfrac1{x+1}&=" + num(1 / x + 1 / (x + 1), 4) + "\\\\\\tfrac{2x+1}{x(x+1)}&=" + num((2 * x + 1) / (x * (x + 1)), 4) + "\\end{aligned}", true)
            : SK.tex("x=" + num(x, 1) + "：\\text{分母為 0，沒有定義}", true);
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "為什麼要有理化", icon: "sparkle",
        html: "沒有計算機的年代，$\\tfrac{1}{\\sqrt2}$ 要用 1 去除以 1.41421…，很難算；但 $\\tfrac{\\sqrt2}{2}$ 只要把 1.41421 除以 2，心算就好。今天計算機很方便，有理化仍然有用：它讓式子有統一的樣子，也常常讓後面的約分或比較變得容易。" },
      { title: "和「數值誤差」的關係", icon: "leaf",
        html: "「數值計算的誤差」單元裡，$\\sqrt{1001}-\\sqrt{1000}$ 直接相減會失準，改寫成 $\\tfrac{1}{\\sqrt{1001}+\\sqrt{1000}}$ 就準確得多。那個改寫用的正是這裡的共軛技巧——只是方向反過來：把<b>分子</b>有理化。" }
    ],

    challenges: [
      { q: "化簡 $\\sqrt{12}+\\sqrt{27}-\\sqrt{75}$。", idea: "$2\\sqrt3+3\\sqrt3-5\\sqrt3=0$。全部化成 $\\sqrt3$ 的倍數就看得出來。" },
      { q: "把 $\\dfrac{\\sqrt3}{\\sqrt5-\\sqrt2}$ 有理化。", idea: "乘上 $\\tfrac{\\sqrt5+\\sqrt2}{\\sqrt5+\\sqrt2}$：$\\tfrac{\\sqrt{15}+\\sqrt6}{3}$。" },
      { q: "化簡 $\\dfrac{x^2-4}{x^2-x-2}$，並說明 $x$ 要避開哪些值。", idea: "$\\tfrac{(x-2)(x+2)}{(x-2)(x+1)}=\\tfrac{x+2}{x+1}$，需要 $x\\ne2$（原式分母為 0）且 $x\\ne-1$。約分前後的定義域要對照清楚。" }
    ],

    where: {
      codes: [["A-10-1", "實數的四則運算：乘法公式（含三次）、根式的運算與分母有理化、分式的約分與加減；平方與立方公式的圖解見「乘法公式」單元"]],
      exam: "10 年級<b>共同必修</b>，學測數 A、數 B 都是基本工具。",
      stop: "以一般的根式化簡、二項分母的有理化、簡單分式的四則運算為主。多重根號（$\\sqrt{a+\\sqrt b}$ 的化簡）與複雜的繁分式不是重點。"
    }
  });
})();
