/* 單元：積分的應用——切片求體積 */
(function () {
  var C = SK.C, s = SK.s;
  var SHAPES = {
    sphere: { name: "球", f: function (x) { return Math.sqrt(Math.max(0, 4 - x * x)); }, a: -2, b: 2, exact: 32 * Math.PI / 3, tex: "\\int_{-2}^{2}\\pi(4-x^2)\\,dx=\\frac{32\\pi}{3}" },
    cone: { name: "圓錐", f: function (x) { return x / 2; }, a: 0, b: 4, exact: 16 * Math.PI / 3, tex: "\\int_0^4\\pi\\left(\\tfrac x2\\right)^2dx=\\frac{16\\pi}{3}" },
    bowl: { name: "碗（拋物面）", f: function (x) { return Math.sqrt(x); }, a: 0, b: 4, exact: 8 * Math.PI, tex: "\\int_0^4\\pi x\\,dx=8\\pi" }
  };

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 240, "西瓜切成很多薄片");
    for (var i = -5; i <= 5; i++) {
      var x = 200 + i * 22, r = 90 * Math.sqrt(Math.max(0, 1 - (i * 22 / 120) * (i * 22 / 120)));
      s("ellipse", { cx: x + (i > 0 ? 6 : i < 0 ? -6 : 0), cy: 120, rx: 8, ry: r, fill: i % 2 ? C.pink.f : "rgba(233,193,191,.4)", stroke: C.green.s, "stroke-width": 2 }, svg);
    }
    SK.label(svg, 200, 226, "每一片都很像一個薄薄的圓柱", { size: 13, color: C.soft });
  }

  function averageAngle(el) {
    var wrap = SK.h("div", { class: "two-col" });
    var st = SK.h("div", { class: "stage" }), side = SK.h("div", {});
    wrap.appendChild(st); wrap.appendChild(side); el.appendChild(wrap);
    var svg = SK.svg(st, 420, 260, "函數在區間上的平均值");
    var X = function (x) { return 40 + x * 90; }, Y = function (y) { return 230 - y * 45; };
    function f(x) { return x * x / 4 + .5; }
    var avg = (64 / 12 + 2) / 4;
    var d = "M" + X(0) + " " + Y(0);
    for (var x = 0; x <= 4.001; x += .05) d += " L" + X(x) + " " + Y(f(x));
    d += " L" + X(4) + " " + Y(0) + "Z";
    s("path", { d: d, fill: C.orange.f, stroke: C.orange.s, "stroke-width": 1.4 }, svg);
    s("rect", { x: X(0), y: Y(avg), width: X(4) - X(0), height: Y(0) - Y(avg), fill: "none", stroke: C.blue.s, "stroke-width": 2, "stroke-dasharray": "6 5" }, svg);
    s("line", { x1: 30, y1: Y(0), x2: 410, y2: Y(0), class: "m-axis" }, svg);
    SK.label(svg, X(4) + 6, Y(avg), "平均高度 ≈ " + SK.fmt(avg, 2), { size: 12, anchor: "start", color: C.blue.s });
    side.innerHTML = '<p style="margin-top:0">' + SK.md("函數在 $[a,b]$ 上的平均值，就是把曲線下的面積「推平」成一個同寬的長方形，它的高度：$$\\bar f=\\frac1{b-a}\\int_a^bf(x)\\,dx.$$ 圖中 $f(x)=\\frac{x^2}4+\\frac12$ 在 $[0,4]$ 上的平均值是 $\\frac14\\left(\\frac{16}3+2\\right)=\\frac{11}{6}\\approx1.83$。蜜桃色面積和灰藍虛線長方形的面積一樣。") + "</p>";
  }

  SK.mountUnit({
    slug: "volume",
    en: "Slice it thin, add it up",
    formula: "V=\\int_a^b\\co{A(x)}\\,dx,\\qquad \\text{旋轉體}\\ V=\\int_a^b\\pi\\,\\cb{f(x)}^2\\,dx",

    hook: {
      html: "把一顆西瓜切成很多很薄的片。每一片都很接近一個薄薄的圓柱，圓柱的體積我們會算。",
      ask: "把所有薄片的體積加起來，切得越來越薄，會不會就是整顆西瓜的體積？",
      visual: hookVisual
    },

    guess: {
      q: "半徑 $r$ 的球，放進剛好裝得下它的圓柱（底半徑 $r$、高 $2r$）。球的體積是圓柱的幾分之幾？",
      options: [
        { t: "$\\frac12$", common: true, explain: "球看起來大概占了圓柱的一半，很合理的估計！但球其實比一半還胖一些，實際是 $\\frac23$。" },
        { t: "$\\frac23$", truth: true, explain: "圓柱體積 $\\pi r^2\\cdot2r=2\\pi r^3$，球體積 $\\frac43\\pi r^3$，比值剛好 $\\frac23$。阿基米德非常喜歡這個結果，據說要求把它刻在自己的墓碑上。" },
        { t: "$\\frac34$", explain: "比 $\\frac23$ 稍大。可以用等一下的切片方法精確算出來。" },
        { t: "$\\frac\\pi4$", explain: "$\\frac\\pi4$ 是圓面積除以外切正方形面積的比值，那是二維的答案。三維的比值不一樣。" }
      ]
    },

    derive: {
      intro: "把曲線 $y=f(x)$ 繞 $x$ 軸旋轉一圈，得到一個立體。按按鈕換形狀，拖動滑桿改變切片數 $n$。",
      tall: true,
      frames: [
        { cap: "把立體沿著 $x$ 軸切成 $n$ 片。每一片都近似一個薄圓柱：半徑 $f(x_k)$、厚度 $\\Delta x$。", tex: "\\text{第 }k\\text{ 片}\\approx\\pi\\,f(x_k)^2\\,\\Delta x" },
        { cap: "把所有薄片加起來，就得到體積的近似值。這和「微積分基本定理」單元的黎曼和是同一個想法，只是每一片從長方形換成圓柱。", tex: "V\\approx\\sum_{k=1}^n\\pi\\,f(x_k)^2\\,\\Delta x" },
        { cap: "切得越薄，誤差越小。讓 $n\\to\\infty$，和的極限就是定積分。", tex: "V=\\int_a^b\\pi\\,f(x)^2\\,dx" },
        { cap: "球：半徑 2 的半圓 $f(x)=\\sqrt{4-x^2}$ 旋轉。每片截面積是 $\\pi(4-x^2)$，用反導函數算出來。", tex: "\\int_{-r}^{r}\\pi(r^2-x^2)\\,dx=\\frac43\\pi r^3" },
        { cap: "切片不一定要是圓：只要知道每個位置的<b>截面積</b> $A(x)$，體積就是 $\\int A(x)\\,dx$。截面積處處相同的兩個立體，體積也相同（卡瓦列里原理）。", tex: "V=\\int_a^bA(x)\\,dx" }
      ],
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 520, 420, "旋轉體與薄片");
        var g = s("g", {}, svg);
        var st = { shape: "sphere", n: 8 };
        var read = SK.h("div", { class: "readout" });
        var row = SK.h("div", { class: "controls" });
        Object.keys(SHAPES).forEach(function (k) {
          var b = SK.h("button", { class: "btn small ghost", type: "button" }, SHAPES[k].name);
          b.onclick = function () { st.shape = k; draw(); };
          row.appendChild(b);
        });
        ctx.sliders.appendChild(row);
        ctx.sliders.appendChild(SK.slider({ label: "$n$", min: 2, max: 60, value: st.n, fmt: function (v) { return v + " 片"; }, onInput: function (v) { st.n = v; draw(); } }).el);
        ctx.extra.appendChild(read);
        function draw() {
          var f = ctx.frame, S = SHAPES[f === 3 ? "sphere" : st.shape], n = st.n;
          var u = 80, cx = 260 - (S.a + S.b) / 2 * u, cy = 210;
          function X(x) { return cx + x * u; }
          g.innerHTML = "";
          s("line", { x1: 20, y1: cy, x2: 500, y2: cy, class: "m-axis" }, g);
          // 外形輪廓
          var top = "", bot = "";
          for (var x = S.a; x <= S.b + 1e-9; x += (S.b - S.a) / 120) { top += (top ? "L" : "M") + X(x) + " " + (cy - S.f(x) * u); bot += (bot ? "L" : "M") + X(x) + " " + (cy + S.f(x) * u); }
          s("path", { d: top, fill: "none", stroke: C.ink, "stroke-width": 2.2 }, g);
          s("path", { d: bot, fill: "none", stroke: C.ink, "stroke-width": 1.4, "stroke-dasharray": "5 5" }, g);
          // 薄片
          var dx = (S.b - S.a) / n, sum = 0;
          for (var k = 0; k < n; k++) {
            var xm = S.a + (k + .5) * dx, r = S.f(xm), x1 = X(S.a + k * dx), x2 = X(S.a + (k + 1) * dx);
            sum += Math.PI * r * r * dx;
            if (f === 4) {
              s("rect", { x: x1 + .5, y: cy - r * u, width: x2 - x1 - 1, height: 2 * r * u, fill: k % 2 ? C.blue.f : C.orange.f, stroke: "none" }, g);
            } else {
              s("rect", { x: x1 + .5, y: cy - r * u, width: x2 - x1 - 1, height: 2 * r * u, fill: k % 2 ? C.orange.f : C.gold.f, stroke: C.orange.s, "stroke-width": .6 }, g);
              s("ellipse", { cx: x2, cy: cy, rx: Math.max(2, Math.min(10, (x2 - x1) * .5)), ry: r * u, fill: C.gold.f, stroke: C.orange.s, "stroke-width": .8 }, g);
            }
          }
          if (f === 0 && n <= 20) {
            var km = Math.floor(n / 2), xk = S.a + (km + .5) * dx;
            SK.brace(g, X(S.a + km * dx), cy - S.f(xk) * u - 8, X(S.a + (km + 1) * dx), cy - S.f(xk) * u - 8, -12);
            SK.label(g, X(xk), cy - S.f(xk) * u - 34, "Δx", { size: 13, color: C.orange.s });
          }
          if (f === 4) SK.label(g, 260, 30, "每個位置的截面積 A(x) 決定體積", { size: 13, color: C.blue.s });
          read.innerHTML = SK.tex("\\text{" + S.name + "：}\\ \\sum\\approx" + SK.fmt(sum, 4) + ",\\quad \\text{真正體積 }" + SK.fmt(S.exact, 4), true) + (f >= 2 ? SK.tex(S.tex, true) : "");
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "函數的平均值", icon: "sparkle", render: averageAngle },
      { title: "球的體積微分，就是球的表面積", icon: "leaf",
        html: "$V(r)=\\frac43\\pi r^3$，對 $r$ 微分得到 $V'(r)=4\\pi r^2$，剛好是球的表面積。為什麼？把半徑增加一點點 $\\Delta r$，多出來的是一層薄薄的球殼，體積約「表面積 × 厚度」。這和「微積分基本定理」說的「面積的變化率就是高度」是同一件事，只是升了一個維度。課程手冊把這個想法列為程度較佳的學生的補充。" }
    ],

    challenges: [
      { q: "用切片法推出圓錐的體積公式 $\\frac13\\pi r^2h$。", hint: "把圓錐的頂點放在原點、軸放在 $x$ 軸上，半徑隨 $x$ 線性增加：$f(x)=\\frac rhx$。",
        idea: "$V=\\int_0^h\\pi\\left(\\frac rhx\\right)^2dx=\\pi\\frac{r^2}{h^2}\\cdot\\frac{h^3}3=\\frac13\\pi r^2h$。那個 $\\frac13$ 來自 $\\int x^2dx$。" },
      { q: "把 $y=x^2$（$0\\le x\\le1$）繞 $x$ 軸旋轉，體積是多少？", idea: "$\\int_0^1\\pi x^4dx=\\frac\\pi5$。" },
      { q: "一疊硬幣堆得整整齊齊，和把它推歪成斜斜的一疊，體積一樣嗎？用今天的想法說明。", idea: "一樣。每個高度的截面都是同樣大小的圓，截面積函數 $A(x)$ 完全相同，所以 $\\int A(x)\\,dx$ 也相同。這就是卡瓦列里原理。" }
    ],

    where: {
      codes: [["F-12甲-7", "積分的應用：連續函數值的平均、圓面積、球體積、切片積分法、旋轉體體積"]],
      exam: "12 年級<b>選修數學甲</b>，求體積是數甲獨有的內容，分科測驗數甲的範圍。對應教材「定積分求面積、區間內函數的平均、定積分求體積」。",
      stop: "不涉及其他積分法（分部積分、變數變換）。核心是用切片與旋轉理解並計算體積；球表面積的微分推論只作為程度較佳學生的補充。"
    }
  });
})();
