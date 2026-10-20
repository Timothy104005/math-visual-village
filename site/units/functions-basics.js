/* 單元：函數的基本性質 */
(function () {
  var C = SK.C, s = SK.s;
  var FNS = [
    { name: "f(x) = x²/2", f: function (x) { return x * x / 2; }, tex: "\\tfrac12x^2", kind: "even" },
    { name: "f(x) = x³/6", f: function (x) { return x * x * x / 6; }, tex: "\\tfrac16x^3", kind: "odd" },
    { name: "f(x) = x/2 + 1", f: function (x) { return x / 2 + 1; }, tex: "\\tfrac12x+1", kind: "none" },
    { name: "f(x) = |x| − 1", f: function (x) { return Math.abs(x) - 1; }, tex: "|x|-1", kind: "even" }
  ];

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 250, "把輸入送進機器");
    s("rect", { x: 130, y: 90, width: 140, height: 80, rx: 12, fill: C.gold.f, stroke: C.cocoa, "stroke-width": 1.6 }, svg);
    SK.label(svg, 200, 130, "f", { it: true, size: 30 });
    SK.arrow(svg, 40, 130, 125, 130, C.orange.s, 3.4);
    SK.arrow(svg, 275, 130, 360, 130, C.blue.s, 3.4);
    SK.label(svg, 40, 108, "輸入 x", { size: 14, color: C.orange.s });
    SK.label(svg, 360, 108, "輸出 f(x)", { size: 14, color: C.blue.s });
    SK.label(svg, 200, 214, "一個輸入，只能有一個輸出", { size: 13, color: C.soft });
  }

  SK.mountUnit({
    slug: "functions-basics",
    en: "Correspondence, symmetry, composition, inverse",
    formula: "f(-x)=f(x)\\ \\text{（偶）},\\quad f(-x)=-f(x)\\ \\text{（奇）},\\quad (f\\circ g)(x)=f(g(x)),\\quad f^{-1}(f(x))=x",

    hook: {
      html: "函數就像一台機器：放一個數進去，吐一個數出來。同一個輸入，永遠得到同一個輸出。",
      ask: "怎麼從<b>圖形</b>一眼看出：這是不是函數？它對稱嗎？能不能倒過來用？",
      visual: hookVisual
    },

    guess: {
      q: "下列哪一個圖形<b>不是</b>函數 $y=f(x)$ 的圖形？",
      options: [
        { t: "圓 $x^2+y^2=1$", truth: true, explain: "在 $x=0$ 時，$y$ 可以是 1 或 $-1$：一個輸入對到兩個輸出。畫一條鉛直線，如果和圖形交在兩個點以上，就不是函數（<b>鉛直線檢驗</b>）。" },
        { t: "$y=|x|$", common: true, explain: "它有一個尖角，看起來「不平滑」，但每個 $x$ 都只對一個 $y$，仍然是函數。函數不必平滑，也不必連續。" },
        { t: "$y=x^3$", explain: "每個 $x$ 對一個 $y$，是函數；而且它還是一對一的，有反函數。" },
        { t: "一條水平線 $y=2$", explain: "每個 $x$ 都對到 2，是函數（常數函數）。只是它不是一對一，所以沒有反函數。" }
      ]
    },

    derive: {
      intro: "點選不同的函數，或拖動滑桿改輸入值 $x$。",
      tall: true,
      frames: [
        { cap: "<b>函數</b>是一種對應：定義域裡的每一個 $x$，恰好對到一個 $f(x)$。圖形上就是<b>鉛直線檢驗</b>：任何一條鉛直線最多只能碰到圖形一次。所有輸出所成的集合叫<b>值域</b>。", tex: "x\\ \\longmapsto\\ f(x)\\ \\text{（恰一個）}" },
        { cap: "<b>奇偶對稱</b>：$f(-x)=f(x)$ 時圖形對 $y$ 軸對稱，叫<b>偶函數</b>；$f(-x)=-f(x)$ 時對原點對稱，叫<b>奇函數</b>。多數函數兩者都不是。", tex: "\\begin{aligned}\\text{偶}&：f(-x)=f(x)\\\\\\text{奇}&：f(-x)=-f(x)\\end{aligned}" },
        { cap: "<b>函數的四則運算</b>：$(f+g)(x)=f(x)+g(x)$，圖形上就是把兩條曲線的高度<b>逐點相加</b>。減、乘、除也一樣（除法要避開分母為 0 的地方）。", tex: "(f+g)(x)=f(x)+g(x)" },
        { cap: "<b>合成函數</b>：先做 $g$、再做 $f$，寫成 $f\\circ g$。兩台機器接起來，$g$ 的輸出變成 $f$ 的輸入。順序不能隨便換：$f\\circ g$ 通常不等於 $g\\circ f$。", tex: "(f\\circ g)(x)=f(g(x))" },
        { cap: "<b>反函數</b>：把箭頭反過來。只有<b>一對一</b>的函數才有反函數（水平線檢驗）。圖形上，$y=f^{-1}(x)$ 和 $y=f(x)$ 對直線 $y=x$ 對稱。", tex: "f(a)=b\\iff f^{-1}(b)=a" }
      ],
      hint: "點按鈕換函數；拖動滑桿看輸入怎麼變成輸出。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 540, 440, "函數的性質");
        var g = s("g", {}, svg);
        var O = [270, 250], u = 34, st = { i: 0, x: 2 };
        function P(a, b) { return [O[0] + a * u, O[1] - b * u]; }
        var read = SK.h("div", { class: "readout" });
        var btns = SK.h("div", { style: "display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px" });
        FNS.forEach(function (fn, i) {
          var b = SK.h("button", { class: "chip", type: "button", "aria-pressed": i === 0 ? "true" : "false" }, fn.name);
          b.addEventListener("click", function () { st.i = i; Array.prototype.forEach.call(btns.children, function (x, k) { x.setAttribute("aria-pressed", k === i ? "true" : "false"); }); draw(); });
          btns.appendChild(b);
        });
        var sx = SK.slider({ label: "$x$", min: -4, max: 4, step: .1, value: st.x, onInput: function (v) { st.x = v; draw(); } });
        ctx.sliders.appendChild(sx.el);
        ctx.extra.appendChild(btns); ctx.extra.appendChild(read);
        function num(v) { return SK.fmt(v, 2).replace("−", "-"); }
        function grid() {
          for (var i = -7; i <= 7; i++) { var a = P(i, -5), b = P(i, 5); s("line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1], class: "m-grid" }, g); }
          for (var j = -5; j <= 5; j++) { var c = P(-7, j), d = P(7, j); s("line", { x1: c[0], y1: c[1], x2: d[0], y2: d[1], class: "m-grid" }, g); }
          var x0 = P(-7.5, 0), x1 = P(7.5, 0), y0 = P(0, -5.5), y1 = P(0, 5.5);
          s("line", { x1: x0[0], y1: x0[1], x2: x1[0], y2: x1[1], class: "m-axis" }, g);
          s("line", { x1: y0[0], y1: y0[1], x2: y1[0], y2: y1[1], class: "m-axis" }, g);
        }
        function curve(fn, col, w, dash, x0, x1) {
          var d = "", pen = false;
          for (var x = (x0 == null ? -7.5 : x0); x <= (x1 == null ? 7.5 : x1); x += .04) {
            var y = fn(x);
            if (!isFinite(y) || Math.abs(y) > 5.6) { pen = false; continue; }
            var p = P(x, y); d += (pen ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1); pen = true;
          }
          s("path", { d: d, fill: "none", stroke: col, "stroke-width": w || 2.8, "stroke-dasharray": dash || null }, g);
        }
        function dot(x, y, col) { var p = P(x, y); s("circle", { cx: p[0], cy: p[1], r: 6, fill: col }, g); return p; }
        function draw() {
          var f = ctx.frame, F = FNS[st.i], x = st.x;
          g.innerHTML = "";
          btns.style.display = f === 1 ? "flex" : "none";
          sx.el.style.display = f === 0 || f === 3 || f === 4 ? "" : "none";
          if (f === 0) {
            // 左：對應圖；右：鉛直線檢驗
            s("ellipse", { cx: 80, cy: 220, rx: 52, ry: 130, fill: C.orange.f, stroke: C.orange.s }, g);
            s("ellipse", { cx: 260, cy: 220, rx: 52, ry: 130, fill: C.blue.f, stroke: C.blue.s }, g);
            SK.label(g, 80, 70, "定義域", { size: 13, color: C.orange.s });
            SK.label(g, 260, 70, "值域", { size: 13, color: C.blue.s });
            var xs = [-2, -1, 0, 1, 2];
            xs.forEach(function (v, i) {
              var y = 140 + i * 40, fy = 140 + [3, 1, 0, 1, 3].indexOf(Math.round(v * v)) * 0;
              var out = v * v / 2, oy = 300 - out * 44;
              s("circle", { cx: 80, cy: y, r: 5, fill: C.orange.s }, g);
              SK.label(g, 60, y, String(v), { size: 12, anchor: "end" });
              s("circle", { cx: 260, cy: oy, r: 5, fill: C.blue.s }, g);
              SK.label(g, 282, oy, num(out), { size: 12, anchor: "start" });
              SK.arrow(g, 88, y, 252, oy, "rgba(74,63,55,.45)", 1.6);
            });
            SK.label(g, 170, 390, "每個輸入只射出一支箭", { size: 13, color: C.soft });
            // 右：鉛直線檢驗（圓不是函數）
            s("circle", { cx: 430, cy: 180, r: 62, fill: "none", stroke: C.pink.s, "stroke-width": 2.4 }, g);
            s("line", { x1: 452, y1: 90, x2: 452, y2: 270, stroke: C.cocoa, "stroke-dasharray": "5 4", "stroke-width": 1.6 }, g);
            [-1, 1].forEach(function (sg) { s("circle", { cx: 452, cy: 180 - sg * Math.sqrt(62 * 62 - 22 * 22), r: 5, fill: C.pink.s }, g); });
            SK.label(g, 430, 262, "碰兩次 → 不是函數", { size: 12, color: C.pink.s });
            var fx = x * x / 2;
            read.innerHTML = SK.tex("f(" + num(x) + ")=\\frac{(" + num(x) + ")^2}{2}=" + num(fx), true);
            return;
          }
          grid();
          if (f === 1) {
            curve(F.f, C.orange.s);
            curve(function (t) { return F.f(-t); }, C.blue.s, 2.2, "7 5");
            var kind = F.kind === "even" ? "偶函數：對 y 軸對稱" : F.kind === "odd" ? "奇函數：對原點對稱" : "既非奇也非偶";
            if (F.kind === "odd") curve(function (t) { return -F.f(-t); }, C.green.s, 2.2, "3 4");
            SK.label(g, 270, 24, "橘：y = f(x)　藍虛線：y = f(−x)" + (F.kind === "odd" ? "　綠：y = −f(−x)" : ""), { size: 12, color: C.soft });
            SK.label(g, 270, 420, kind, { size: 15, color: F.kind === "none" ? C.soft : C.pink.s, bold: true });
            read.innerHTML = SK.tex("f(x)=" + F.tex + ",\\quad f(-x)=" + (F.kind === "even" ? "f(x)" : F.kind === "odd" ? "-f(x)" : "\\text{都不是}"), true);
            return;
          }
          if (f === 2) {
            var fa = function (t) { return t * t / 2 - 2; }, gb = function (t) { return t / 2 + 1; };
            curve(fa, C.orange.s, 2.4); curve(gb, C.blue.s, 2.4);
            curve(function (t) { return fa(t) + gb(t); }, C.green.s, 3);
            [-3, -1, 1, 3].forEach(function (t) {
              var p1 = P(t, fa(t)), p2 = P(t, gb(t)), p3 = P(t, fa(t) + gb(t));
              s("line", { x1: p1[0], y1: p1[1], x2: p3[0], y2: p3[1], stroke: C.green.s, "stroke-dasharray": "3 3" }, g);
              s("circle", { cx: p3[0], cy: p3[1], r: 4, fill: C.green.s }, g);
            });
            SK.label(g, 270, 24, "橘 f + 藍 g = 綠 (f+g)：高度相加", { size: 13, color: C.soft });
            read.innerHTML = SK.tex("f(x)=\\tfrac12x^2-2,\\ g(x)=\\tfrac12x+1", true) + SK.tex("(f+g)(x)=\\tfrac12x^2+\\tfrac12x-1", true);
            return;
          }
          if (f === 3) {
            var gg = function (t) { return t + 1; }, ff = function (t) { return t * t / 2; };
            curve(gg, C.blue.s, 2.2, "6 4"); curve(ff, C.orange.s, 2.2, "6 4");
            curve(function (t) { return ff(gg(t)); }, C.green.s, 3.2);
            var gx = gg(x), fgx = ff(gx);
            dot(x, 0, C.cocoa); dot(x, gx, C.blue.s); dot(gx, fgx, C.orange.s); dot(x, fgx, C.green.s);
            var a1 = P(x, 0), a2 = P(x, gx), a3 = P(gx, fgx), a4 = P(x, fgx);
            s("line", { x1: a1[0], y1: a1[1], x2: a2[0], y2: a2[1], stroke: C.blue.s, "stroke-dasharray": "3 3" }, g);
            var diag = P(gx, gx);
            s("line", { x1: a2[0], y1: a2[1], x2: diag[0], y2: diag[1], stroke: C.line, "stroke-dasharray": "3 3" }, g);
            s("line", { x1: diag[0], y1: diag[1], x2: a3[0], y2: a3[1], stroke: C.orange.s, "stroke-dasharray": "3 3" }, g);
            s("line", { x1: a3[0], y1: a3[1], x2: a4[0], y2: a4[1], stroke: C.green.s, "stroke-dasharray": "3 3" }, g);
            var d0 = P(-5.4, -5.4), d1 = P(5.4, 5.4);
            s("line", { x1: d0[0], y1: d0[1], x2: d1[0], y2: d1[1], stroke: C.purple.s, "stroke-dasharray": "6 5", "stroke-width": 1.2 }, g);
            SK.label(g, 270, 24, "藍 g(x)=x+1　橘 f(x)=x²/2　綠 f(g(x))", { size: 12, color: C.soft });
            read.innerHTML = SK.tex("x=" + num(x) + "\\ \\xrightarrow{g}\\ " + num(gx) + "\\ \\xrightarrow{f}\\ " + num(fgx), true) +
              SK.tex("(f\\circ g)(x)=\\tfrac12(x+1)^2,\\quad (g\\circ f)(x)=\\tfrac12x^2+1", true);
            return;
          }
          // f === 4：反函數
          var h = function (t) { return t / 2 + 1; }, hi = function (t) { return 2 * (t - 1); };
          var dg0 = P(-5.4, -5.4), dg1 = P(5.4, 5.4);
          s("line", { x1: dg0[0], y1: dg0[1], x2: dg1[0], y2: dg1[1], stroke: C.purple.s, "stroke-dasharray": "6 5", "stroke-width": 1.4 }, g);
          curve(h, C.orange.s, 3); curve(hi, C.blue.s, 3);
          var y = h(x), A = dot(x, y, C.orange.s), B = dot(y, x, C.blue.s);
          s("line", { x1: A[0], y1: A[1], x2: B[0], y2: B[1], stroke: C.pink.s, "stroke-dasharray": "4 3" }, g);
          SK.label(g, A[0] + 10, A[1] - 12, "(" + num(x) + ", " + num(y) + ")", { size: 12, color: C.orange.s, anchor: "start" });
          SK.label(g, B[0] + 10, B[1] - 12, "(" + num(y) + ", " + num(x) + ")", { size: 12, color: C.blue.s, anchor: "start" });
          SK.label(g, 270, 24, "橘 f(x)=x/2+1　藍 f⁻¹(x)=2(x−1)　紫 y=x", { size: 12, color: C.soft });
          read.innerHTML = SK.tex("f(" + num(x) + ")=" + num(y) + "\\iff f^{-1}(" + num(y) + ")=" + num(x), true);
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "反函數是「倒帶」", icon: "sparkle",
        html: "$f$ 把 $x$ 變成 $2x+1$，$f^{-1}$ 就把它變回去：先減 1 再除以 2。所以 $f^{-1}(f(x))=x$。要能倒帶，每個輸出只能來自一個輸入——這就是「一對一」。$y=x^2$ 不行（2 和 $-2$ 都變成 4），除非先把定義域限制成 $x\\ge0$。" },
      { title: "奇偶和積分的關係", icon: "leaf",
        html: "偶函數在 $[-a,a]$ 上的積分等於 $2\\int_0^a$；奇函數在 $[-a,a]$ 上的積分是 0（左右兩塊剛好抵消）。先看對稱性，常常可以省下一半的計算。" }
    ],

    challenges: [
      { q: "$f(x)=x^2+1$、$g(x)=2x-3$。求 $(f\\circ g)(2)$ 和 $(g\\circ f)(2)$。", idea: "$(f\\circ g)(2)=f(1)=2$；$(g\\circ f)(2)=g(5)=7$。順序不同，答案不同。" },
      { q: "$f(x)=\\dfrac{x+1}{x-2}$（$x\\ne2$）的反函數是什麼？", hint: "令 $y=\\tfrac{x+1}{x-2}$，解出 $x$。", idea: "$y(x-2)=x+1\\Rightarrow x(y-1)=2y+1\\Rightarrow x=\\tfrac{2y+1}{y-1}$。所以 $f^{-1}(x)=\\tfrac{2x+1}{x-1}$（$x\\ne1$）。" },
      { q: "$f(x)=x^3+x$ 是奇函數還是偶函數？它有反函數嗎？", idea: "$f(-x)=-x^3-x=-f(x)$，是奇函數。它一路遞增（$f'=3x^2+1>0$），所以一對一，有反函數（雖然反函數的式子不好寫出來）。" }
    ],

    where: {
      codes: [["F-12甲-1", "函數：對應關係、奇偶對稱、反函數、合成函數與函數的四則運算"], ["F-12乙-1", "函數：對應關係、奇偶性、凹凸性；在微分的脈絡下認識函數的加減與合成"]],
      exam: "12 年級<b>數學甲</b>與<b>數學乙</b>都有，是微積分的共同前置。凹凸性的判定在「導函數的應用」單元。",
      stop: "以理解概念與圖形為主：鉛直線檢驗、奇偶對稱、合成與反函數的意義。不做複雜的定義域求法或反函數的存在性證明。"
    }
  });
})();
