/* 單元：函數的極限與連續 */
(function () {
  var C = SK.C, s = SK.s;

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 250, "曲線上的一個洞");
    var O = [70, 200], u = 42;
    function P(x, y) { return [O[0] + x * u, O[1] - y * u]; }
    s("line", { x1: 20, y1: O[1], x2: 380, y2: O[1], class: "m-axis" }, svg);
    s("line", { x1: O[0], y1: 20, x2: O[0], y2: 235, class: "m-axis" }, svg);
    var d = "";
    for (var x = -1; x <= 6.5; x += .05) { var p = P(x, x + 1); if (p[0] > 380) break; d += (d ? "L" : "M") + p[0] + " " + p[1]; }
    s("path", { d: d, fill: "none", stroke: C.orange.s, "stroke-width": 2.8 }, svg);
    var h = P(2, 3);
    s("circle", { cx: h[0], cy: h[1], r: 6, fill: C.paper, stroke: C.orange.s, "stroke-width": 2.4 }, svg);
    s("line", { x1: h[0], y1: h[1], x2: h[0], y2: O[1], stroke: C.line, "stroke-dasharray": "3 4" }, svg);
    SK.label(svg, h[0], O[1] + 18, "2", { size: 13, color: C.soft });
    SK.label(svg, h[0] + 60, h[1] - 16, "這裡沒有定義", { size: 13, color: C.pink.s });
    SK.label(svg, 200, 238, "f(x) = (x²−x−2)/(x−2)", { size: 12, color: C.soft });
  }

  var CASES = [
    { name: "有洞", f: function (x) { return Math.abs(x - 2) < 1e-9 ? NaN : (x * x - x - 2) / (x - 2); }, lim: 3, val: null, tex: "\\frac{x^2-x-2}{x-2}" },
    { name: "跳一階", f: function (x) { return x < 2 ? x + 1 : x + 2; }, lim: null, val: 4, tex: "\\begin{cases}x+1,&x<2\\\\x+2,&x\\ge2\\end{cases}" },
    { name: "衝上去", f: function (x) { return 1 / ((x - 2) * (x - 2)); }, lim: Infinity, val: null, tex: "\\frac{1}{(x-2)^2}" },
    { name: "連續", f: function (x) { return x + 1; }, lim: 3, val: 3, tex: "x+1" }
  ];

  SK.mountUnit({
    slug: "function-limit",
    en: "Where the curve is heading",
    formula: "\\lim_{x\\to a}f(x)=L\\ \\text{（靠近時的趨勢）},\\qquad \\text{連續}\\iff \\lim_{x\\to a}f(x)=f(a)",

    hook: {
      html: "$f(x)=\\dfrac{x^2-x-2}{x-2}$ 在 $x=2$ 沒有定義（分母是 0）。但從兩邊靠近 2 的時候，$f(x)$ 的值卻越來越接近某個數。",
      ask: "「在那一點沒有定義」和「靠近那一點時的趨勢」是兩回事。要怎麼分開說清楚？",
      visual: hookVisual
    },

    guess: {
      q: "上面的 $f(x)$ 在 $x\\to2$ 時，$f(x)$ 會接近多少？",
      options: [
        { t: "3", truth: true, explain: "$x\\ne2$ 時 $\\tfrac{x^2-x-2}{x-2}=\\tfrac{(x-2)(x+1)}{x-2}=x+1$，所以靠近 2 時值靠近 3。極限只問「靠近時的趨勢」，不問那一點本身有沒有定義。" },
        { t: "沒有極限，因為 $x=2$ 沒有定義", common: true, explain: "很多人以為「沒定義就沒極限」。其實極限刻意<b>不看</b> $x=a$ 那一點，只看它附近。所以圖上那個洞不影響極限。" },
        { t: "0，因為分子分母都趨近 0", explain: "$\\tfrac00$ 不是一個數，而是「還要再算」的記號。先約分，再看趨勢。" },
        { t: "無限大", explain: "分子在 $x=2$ 時也是 0，可以和分母約掉。真正會衝到無限大的，是像 $\\tfrac{1}{(x-2)^2}$ 這種分子不為 0 的情形。" }
      ]
    },

    derive: {
      intro: "點選不同的函數，拖動滑桿讓 $x$ 從左右兩邊靠近 2。",
      tall: true,
      frames: [
        { cap: "<b>極限</b>：當 $x$ 從<b>左右兩邊</b>靠近 $a$（但不等於 $a$），$f(x)$ 都越來越接近同一個數 $L$，就說 $\\lim\\limits_{x\\to a}f(x)=L$。左右極限不一樣時，極限不存在。", tex: "\\lim_{x\\to a^-}f(x)=\\lim_{x\\to a^+}f(x)=L" },
        { cap: "<b>連續</b>：三個條件都要成立——$f(a)$ 有定義、極限存在、而且兩者相等。圖形在那裡「接得起來」，筆不用抬起來。", tex: "\\lim_{x\\to a}f(x)=f(a)" },
        { cap: "<b>極限的運算</b>：極限存在時，和、差、積、商（分母極限不為 0）都可以各算各的。所以多項式只要直接代入；分式先約分再代入。", tex: "\\begin{aligned}\\lim(f\\pm g)&=\\lim f\\pm\\lim g\\\\\\lim(fg)&=\\lim f\\cdot\\lim g\\end{aligned}" },
        { cap: "<b>介值定理</b>：$f$ 在 $[a,b]$ 上連續，$k$ 夾在 $f(a)$ 和 $f(b)$ 之間，那麼一定有某個 $c$ 使 $f(c)=k$。用它可以「勘根」：$f(a)<0<f(b)$ 時，中間一定有根。拖動滑桿看二分法一步步縮小範圍。", tex: "f(a)<k<f(b)\\Rightarrow \\exists\\,c,\\ f(c)=k" },
        { cap: "<b>夾擠定理</b>：如果 $g(x)\\le f(x)\\le h(x)$，而且 $g$、$h$ 都趨近同一個 $L$，那麼 $f$ 也只能趨近 $L$。圖是 $x\\sin\\tfrac1x$ 被 $\\pm|x|$ 夾住。", tex: "\\begin{gathered}g\\le f\\le h,\\ \\lim g=\\lim h=L\\\\\\Rightarrow\\ \\lim f=L\\end{gathered}" }
      ],
      hint: "點按鈕換函數；拖動滑桿讓 x 靠近 2（第 4 步是二分法的次數）。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 540, 440, "函數的極限與連續");
        var g = s("g", {}, svg);
        var O = [120, 300], u = 46, st = { i: 0, d: 1, n: 0 };
        function P(x, y) { return [O[0] + x * u, O[1] - y * u]; }
        var read = SK.h("div", { class: "readout" });
        var btns = SK.h("div", { style: "display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px" });
        CASES.forEach(function (c, i) {
          var b = SK.h("button", { class: "chip", type: "button", "aria-pressed": i === 0 ? "true" : "false" }, c.name);
          b.addEventListener("click", function () { st.i = i; Array.prototype.forEach.call(btns.children, function (x, k) { x.setAttribute("aria-pressed", k === i ? "true" : "false"); }); draw(); });
          btns.appendChild(b);
        });
        var sd = SK.slider({ label: "與 2 的距離", min: .01, max: 1.2, step: .01, value: 1, fmt: function (v) { return SK.fmt(v, 2); }, onInput: function (v) { st.d = v; draw(); } });
        var sn = SK.slider({ label: "二分次數", min: 0, max: 8, step: 1, value: 0, color: "blue", onInput: function (v) { st.n = v; draw(); } });
        ctx.sliders.appendChild(sd.el); ctx.sliders.appendChild(sn.el);
        ctx.extra.appendChild(btns); ctx.extra.appendChild(read);
        function num(v, d) { return SK.fmt(v, d == null ? 3 : d).replace("−", "-"); }
        function grid(xmin, xmax, ymin, ymax) {
          for (var i = Math.ceil(xmin); i <= xmax; i++) { var a = P(i, ymin), b = P(i, ymax); s("line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1], class: "m-grid" }, g); }
          for (var j = Math.ceil(ymin); j <= ymax; j++) { var c = P(xmin, j), d = P(xmax, j); s("line", { x1: c[0], y1: c[1], x2: d[0], y2: d[1], class: "m-grid" }, g); }
          var x0 = P(xmin, 0), x1 = P(xmax, 0), y0 = P(0, ymin), y1 = P(0, ymax);
          s("line", { x1: x0[0], y1: x0[1], x2: x1[0], y2: x1[1], class: "m-axis" }, g);
          s("line", { x1: y0[0], y1: y0[1], x2: y1[0], y2: y1[1], class: "m-axis" }, g);
        }
        function curve(fn, x0, x1, col, w) {
          var d = "", pen = false;
          for (var x = x0; x <= x1; x += .01) {
            var y = fn(x);
            if (!isFinite(y) || y > 6.5 || y < -2.5) { pen = false; continue; }
            var p = P(x, y); d += (pen ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1); pen = true;
          }
          s("path", { d: d, fill: "none", stroke: col, "stroke-width": w || 2.8 }, g);
        }
        function draw() {
          var f = ctx.frame, Cs = CASES[st.i];
          g.innerHTML = "";
          btns.style.display = f <= 2 ? "flex" : "none";
          sd.el.style.display = f <= 1 ? "" : "none";
          sn.el.style.display = f === 3 ? "" : "none";
          if (f <= 2) {
            grid(-.6, 4.4, -1.6, 6);
            curve(Cs.f, -.6, 1.999, C.orange.s);
            curve(Cs.f, 2.001, 4.4, C.orange.s);
            var a = P(2, 0);
            s("line", { x1: a[0], y1: 20, x2: a[0], y2: 420, stroke: C.line, "stroke-dasharray": "5 5" }, g);
            SK.label(g, a[0], P(2, 0)[1] + 18, "2", { size: 12, color: C.soft });
            if (f <= 1) {
              [[-1, C.blue], [1, C.green]].forEach(function (sg) {
                var x = 2 + sg[0] * st.d, y = Cs.f(x);
                if (!isFinite(y)) return;
                var p = P(x, SK.clamp(y, -2.4, 6.4));
                s("circle", { cx: p[0], cy: p[1], r: 6, fill: sg[1].s }, g);
                s("line", { x1: p[0], y1: p[1], x2: P(2, SK.clamp(y, -2.4, 6.4))[0], y2: p[1], stroke: sg[1].s, "stroke-dasharray": "3 3" }, g);
                SK.label(g, p[0], p[1] - 16, num(y, 2), { size: 12, color: sg[1].s });
              });
            }
            // 洞與端點
            if (st.i === 0) { var hp = P(2, 3); s("circle", { cx: hp[0], cy: hp[1], r: 6, fill: C.paper, stroke: C.orange.s, "stroke-width": 2.4 }, g); }
            if (st.i === 1) { var l1 = P(2, 3), l2 = P(2, 4); s("circle", { cx: l1[0], cy: l1[1], r: 6, fill: C.paper, stroke: C.orange.s, "stroke-width": 2.4 }, g); s("circle", { cx: l2[0], cy: l2[1], r: 6, fill: C.orange.s }, g); }
            if (st.i === 3) { var p3 = P(2, 3); s("circle", { cx: p3[0], cy: p3[1], r: 6, fill: C.orange.s }, g); }
            var L = Cs.lim, V = Cs.val;
            var cont = L !== null && V !== null && L === V;
            if (f === 1) SK.label(g, 300, 40, cont ? "三個條件都成立：在 x=2 連續" : L === null ? "左右極限不同 → 極限不存在" : L === Infinity ? "值衝向無限大 → 極限不存在" : "極限存在但 f(2) 沒有定義 → 不連續", { size: 14, color: cont ? C.green.s : C.pink.s });
            if (f === 2) {
              SK.label(g, 300, 40, "多項式：直接代入就是極限", { size: 13, color: C.soft });
              read.innerHTML = SK.tex("\\begin{aligned}\\lim_{x\\to2}\\frac{x^2-x-2}{x-2}&=\\lim_{x\\to2}\\frac{(x-2)(x+1)}{x-2}\\\\&=\\lim_{x\\to2}(x+1)=3\\end{aligned}", true);
              return;
            }
            var lTex = L === null ? "\\text{不存在（左右不同）}" : L === Infinity ? "\\text{不存在（趨向}\\infty)" : String(L);
            read.innerHTML = SK.tex("f(x)=" + Cs.tex, true) +
              SK.tex("\\lim_{x\\to2}f(x)=" + lTex + ",\\quad f(2)=" + (V === null ? "\\text{沒有定義}" : V), true);
            return;
          }
          if (f === 3) {
            // 介值定理與二分法：f(x)=x³−3x−1 在 [1,2]
            var fn = function (x) { return (x * x * x - 3 * x - 1) / 2; };
            O = [90, 300]; u = 150;
            grid(-.2, 2.6, -1.6, 2);
            curve(fn, .7, 2.45, C.orange.s);
            [1, 2].forEach(function (t) { var q = P(t, 0); SK.label(g, q[0], q[1] + 18, String(t), { size: 12, color: C.soft }); });
            var lo = 1, hi = 2.2;
            for (var i = 0; i < st.n; i++) { var mid = (lo + hi) / 2; if (fn(lo) * fn(mid) <= 0) hi = mid; else lo = mid; }
            var A = P(lo, fn(lo)), B = P(hi, fn(hi));
            s("rect", { x: P(lo, 0)[0], y: 30, width: P(hi, 0)[0] - P(lo, 0)[0], height: 380, fill: "rgba(157,181,178,.25)" }, g);
            [[lo, C.blue], [hi, C.green]].forEach(function (p) {
              var q = P(p[0], fn(p[0]));
              s("circle", { cx: q[0], cy: q[1], r: 6, fill: p[1].s }, g);
              s("line", { x1: q[0], y1: q[1], x2: P(p[0], 0)[0], y2: P(p[0], 0)[1], stroke: p[1].s, "stroke-dasharray": "3 3" }, g);
              SK.label(g, q[0], q[1] - 16, num(p[0], 4), { size: 11, color: p[1].s });
            });
            var root = 1.8793852;
            s("circle", { cx: P(root, 0)[0], cy: P(root, 0)[1], r: 5, fill: C.pink.s }, g);
            SK.label(g, 300, 40, "f 在區間兩端一正一負 → 中間一定有根", { size: 13, color: C.soft });
            O = [120, 300]; u = 46;
            read.innerHTML = SK.tex("f(x)=\\tfrac12(x^3-3x-1)", true) +
              SK.tex("f(" + num(lo, 4) + ")=" + num(fn(lo), 3) + ",\\ f(" + num(hi, 4) + ")=" + num(fn(hi), 3) + "\\Rightarrow\\ \\text{根在其間}", true);
            return;
          }
          // f === 4：夾擠
          O = [270, 250]; u = 120;
          grid(-1.6, 1.6, -1.2, 1.2);
          curve(function (x) { return Math.abs(x); }, -1.6, 1.6, C.blue.s, 2);
          curve(function (x) { return -Math.abs(x); }, -1.6, 1.6, C.green.s, 2);
          var d4 = "", pen4 = false;
          for (var x4 = -1.6; x4 <= 1.6; x4 += .002) {
            var y4 = x4 === 0 ? 0 : x4 * Math.sin(1 / x4);
            var p4 = P(x4, y4);
            d4 += (pen4 ? "L" : "M") + p4[0].toFixed(1) + " " + p4[1].toFixed(1); pen4 = true;
          }
          s("path", { d: d4, fill: "none", stroke: C.orange.s, "stroke-width": 2 }, g);
          s("circle", { cx: P(0, 0)[0], cy: P(0, 0)[1], r: 6, fill: C.pink.s }, g);
          SK.label(g, 270, 30, "藍 y=|x| 　綠 y=−|x| 　橘 y = x sin(1/x)", { size: 12, color: C.soft });
          SK.label(g, 270, 410, "兩邊一起夾到 0，中間的函數也只能到 0", { size: 13, color: C.pink.s });
          O = [120, 300]; u = 46;
          read.innerHTML = SK.tex("-|x|\\le x\\sin\\tfrac1x\\le|x|\\ \\Rightarrow\\ \\lim_{x\\to0}x\\sin\\tfrac1x=0", true);
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "極限不管那一點本身", icon: "sparkle",
        html: "$\\lim\\limits_{x\\to a}f(x)$ 只看 $x$ 靠近 $a$、但不等於 $a$ 的地方。所以就算把 $f(a)$ 改成任何數，甚至挖掉不定義，極限都不會變。導數 $\\lim\\limits_{h\\to0}\\tfrac{f(a+h)-f(a)}{h}$ 正是這樣：$h=0$ 時分母是 0，但 $h$ 靠近 0 的趨勢很清楚。" },
      { title: "連續函數的好處", icon: "leaf",
        html: "在閉區間上連續的函數，一定取得到最大值和最小值（極值定理），也一定取得到中間的每一個值（介值定理）。這兩件事看起來理所當然，卻是微積分裡許多定理的地基——而且對不連續的函數就會失效。" }
    ],

    challenges: [
      { q: "求 $\\lim\\limits_{x\\to3}\\dfrac{x^2-9}{x-3}$。", idea: "約分成 $x+3$，極限是 6。" },
      { q: "$f(x)=\\begin{cases}x^2,&x<1\\\\ax+1,&x\\ge1\\end{cases}$ 在 $x=1$ 連續，求 $a$。", idea: "左極限 1、右極限（也是函數值）$a+1$，要相等：$a=0$。" },
      { q: "用介值定理說明 $x^3=x+1$ 在 1 和 2 之間有解。", idea: "令 $f(x)=x^3-x-1$，$f(1)=-1<0$、$f(2)=5>0$，$f$ 連續，所以中間有一點使 $f=0$。二分法可以把它縮到任意精度（約 1.3247）。" }
    ],

    where: {
      codes: [["F-12甲-2", "函數的極限與連續：極限的概念與運算、連續函數、介值定理（勘根）"], ["F-12乙-2", "函數的極限：連續、實數點的極限、極限的運算性質、介值定理與夾擠定理"]],
      exam: "12 年級<b>數學甲</b>與<b>數學乙</b>都有，是導數定義的前置。",
      stop: "以圖形與直觀理解為主，課綱明訂<b>不要過度延伸</b>：不做 $\\varepsilon$-$\\delta$ 的嚴格定義，也不做複雜的極限技巧（如羅必達法則）。"
    }
  });
})();
