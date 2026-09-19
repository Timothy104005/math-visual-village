/* 單元：行列式與面積 */
(function () {
  var C = SK.C, s = SK.s;

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 280, "兩個向量張出一個平行四邊形");
    var O = [80, 230], u = 40, a = [5, 1], b = [2, 3.5];
    function P(v) { return [O[0] + v[0] * u, O[1] - v[1] * u]; }
    var A = P(a), B = P(b), S = P([a[0] + b[0], a[1] + b[1]]);
    s("path", { d: "M" + O + " L" + A + " L" + S + " L" + B + "Z", fill: C.gold.f, stroke: C.cocoa, "stroke-width": 1.3 }, svg);
    SK.arrow(svg, O[0], O[1], A[0], A[1], C.orange.s, 3.4);
    SK.arrow(svg, O[0], O[1], B[0], B[1], C.blue.s, 3.4);
    SK.label(svg, A[0] + 16, A[1] + 8, "u = (5, 1)", { size: 13, anchor: "start", color: C.orange.s });
    SK.label(svg, B[0] - 10, B[1] - 12, "v = (2, 3.5)", { size: 13, anchor: "end", color: C.blue.s });
    SK.label(svg, (O[0] + S[0]) / 2, (O[1] + S[1]) / 2, "面積 = ?", { size: 15 });
  }

  SK.mountUnit({
    slug: "determinant",
    en: "The area spanned by two vectors",
    formula: "\\begin{vmatrix}\\co{a_1}&\\cb{b_1}\\\\\\co{a_2}&\\cb{b_2}\\end{vmatrix}=\\co{a_1}\\cb{b_2}-\\co{a_2}\\cb{b_1}=\\text{平行四邊形的有向面積}",

    hook: {
      html: "兩個向量 $\\vec u$、$\\vec v$ 從同一點出發，張出一個平行四邊形。",
      ask: "如果只知道它們的坐標，不量角度、不畫高，能直接算出面積嗎？",
      visual: hookVisual
    },

    guess: {
      q: "$\\vec u=(3,0)$、$\\vec v=(1,2)$ 張出的平行四邊形，面積是多少？",
      options: [
        { t: "$6$", truth: true, explain: "底是 $\\vec u$ 的長度 3，高是 $\\vec v$ 往上的距離 2，所以面積 $3\\times2=6$。也就是 $3\\times2-0\\times1=6$，這正是行列式。" },
        { t: "$3\\times\\sqrt5\\approx6.7$（兩邊長相乘）", common: true, explain: "長方形是「長 × 寬」，所以很自然把兩邊長相乘！但平行四邊形斜了，要用「底 × 高」，高比斜邊 $\\sqrt5$ 短。只有兩邊垂直時，兩邊長相乘才是面積。" },
        { t: "$3$", explain: "這是三角形的面積（平行四邊形的一半）。對角線把平行四邊形切成兩個一樣的三角形。" },
        { t: "只有坐標沒辦法算", explain: "今天就要證明可以！而且公式出奇地簡單：交叉相乘再相減。" }
      ]
    },

    derive: {
      intro: "拖動兩個向量的終點（會對齊格子點）。先讓兩個向量都在第一象限、$\\vec u$ 在 $\\vec v$ 的右下方，比較好看清楚。",
      tall: true,
      frames: [
        { cap: "兩個向量 $\\vec u=(a_1,a_2)$、$\\vec v=(b_1,b_2)$，張出一個平行四邊形。", tex: "\\co{\\vec u}=(a_1,a_2),\\quad \\cb{\\vec v}=(b_1,b_2)" },
        { cap: "用一個大長方形把它框起來，大長方形的寬是 $a_1+b_1$、高是 $a_2+b_2$。", tex: "\\text{大長方形}=(a_1+b_1)(a_2+b_2)" },
        { cap: "扣掉四周多出來的部分：兩個<b>淡蜜桃</b>三角形 $\\tfrac12a_1a_2$、兩個<b>淡灰藍</b>三角形 $\\tfrac12b_1b_2$、兩個<b>玫瑰色</b>小長方形 $a_2b_1$。", tex: "2\\cdot\\tfrac12a_1a_2+2\\cdot\\tfrac12b_1b_2+2a_2b_1" },
        { cap: "展開相減，大部分都消掉了，只剩交叉相乘再相減。這就是二階<b>行列式</b>。", tex: "\\begin{aligned}&(a_1+b_1)(a_2+b_2)-a_1a_2-b_1b_2-2a_2b_1\\\\&=\\co{a_1}\\cb{b_2}-\\co{a_2}\\cb{b_1}\\end{aligned}" },
        { cap: "把 $\\vec v$ 拖到 $\\vec u$ 的右下方：行列式變成負的。它是<b>有向面積</b>：從 $\\vec u$ 逆時針轉到 $\\vec v$ 為正，順時針為負。兩向量平行時面積為 0。", tex: "\\begin{gathered}\\det(\\vec u,\\vec v)=-\\det(\\vec v,\\vec u)\\\\ \\vec u\\parallel\\vec v\\iff\\det=0\\end{gathered}" }
      ],
      hint: "拖動蜜桃色（u）與灰藍色（v）的終點。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 520, 440, "兩向量張出的平行四邊形與外框長方形");
        var gridG = s("g", {}, svg), g = s("g", {}, svg), hg = s("g", {}, svg);
        var ox = 100, oy = 390, u = 40;
        var st = { a: [4, 1], b: [1, 3] };
        for (var i = -2; i <= 9; i++) s("line", { x1: ox + i * u, y1: 10, x2: ox + i * u, y2: 430, class: "m-grid" }, gridG);
        for (var j = -1; j <= 8; j++) s("line", { x1: 10, y1: oy - j * u, x2: 510, y2: oy - j * u, class: "m-grid" }, gridG);
        s("line", { x1: 10, y1: oy, x2: 510, y2: oy, class: "m-axis" }, gridG);
        s("line", { x1: ox, y1: 10, x2: ox, y2: 430, class: "m-axis" }, gridG);
        function P(v) { return [ox + v[0] * u, oy - v[1] * u]; }
        var read = SK.h("div", { class: "readout" });
        ctx.extra.appendChild(read);
        var hA = SK.handle(hg, 0, 0, C.orange.s, "向量 u 的終點"), hB = SK.handle(hg, 0, 0, C.blue.s, "向量 v 的終點");
        function mk(key, hd) {
          SK.drag(svg, hd, function (x, y) {
            var nx = SK.clamp(Math.round((x - ox) / u), -2, 5), ny = SK.clamp(Math.round((oy - y) / u), -1, 4);
            if (nx || ny) { st[key] = [nx, ny]; draw(); }
          }, function () { return P(st[key]); }, u);
        }
        mk("a", hA); mk("b", hB);
        function rect(x0, y0, x1, y1, fill) {
          var p = P([x0, y0]), q = P([x1, y1]);
          s("rect", { x: Math.min(p[0], q[0]), y: Math.min(p[1], q[1]), width: Math.abs(q[0] - p[0]), height: Math.abs(q[1] - p[1]), fill: fill, stroke: C.cocoa, "stroke-width": .8, "stroke-dasharray": "3 3" }, g);
        }
        function tri(pts, fill) { s("path", { d: "M" + pts.map(P).join(" L") + "Z", fill: fill, stroke: C.cocoa, "stroke-width": .8, "stroke-dasharray": "3 3" }, g); }
        function draw() {
          var f = ctx.frame, a = st.a, b = st.b, det = a[0] * b[1] - a[1] * b[0];
          var nice = a[0] >= 0 && a[1] >= 0 && b[0] >= 0 && b[1] >= 0 && a[0] > b[0] && b[1] > a[1];
          g.innerHTML = "";
          var O = P([0, 0]), A = P(a), B = P(b), S = P([a[0] + b[0], a[1] + b[1]]);
          if (f >= 1 && f <= 3 && nice) {
            var W = a[0] + b[0], H = a[1] + b[1];
            rect(0, 0, W, H, "rgba(253,251,246,.6)");
            if (f >= 2) {
              tri([[0, 0], [a[0], 0], a], "rgba(243,195,168,.5)");
              tri([b, [W, H], [b[0], H]], "rgba(243,195,168,.5)");
              tri([[0, 0], b, [0, b[1]]], "rgba(157,181,178,.5)");
              tri([[a[0], a[1]], [W, H], [W, a[1]]], "rgba(157,181,178,.5)");
              rect(a[0], 0, W, a[1], "rgba(233,193,191,.6)");
              rect(0, b[1], b[0], H, "rgba(233,193,191,.6)");
            }
          }
          s("path", { d: "M" + O + " L" + A + " L" + S + " L" + B + "Z", fill: det >= 0 ? C.gold.f : C.pink.f, stroke: C.cocoa, "stroke-width": 1.4 }, g);
          SK.arrow(g, O[0], O[1], A[0], A[1], C.orange.s, 3.6);
          SK.arrow(g, O[0], O[1], B[0], B[1], C.blue.s, 3.6);
          SK.label(g, A[0] + 12, A[1] + 14, "u (" + a + ")", { size: 13, anchor: "start", color: C.orange.s });
          SK.label(g, B[0] - 10, B[1] - 12, "v (" + b + ")", { size: 13, anchor: "end", color: C.blue.s });
          if (f >= 1 && f <= 3 && !nice) SK.label(g, 260, 24, "把 u 拖到 v 的右下方（都在第一象限）才看得到剪貼圖", { size: 12, color: C.pink.s });
          if (f === 4) SK.label(g, 260, 24, det > 0 ? "u → v 逆時針：正" : det < 0 ? "u → v 順時針：負" : "平行：面積 0", { size: 14, color: det > 0 ? C.gold.s : C.pink.s });
          hA.moveTo(A[0], A[1]); hB.moveTo(B[0], B[1]);
          var pn = function (v) { return v < 0 ? "(" + v + ")" : String(v); };
          read.innerHTML = SK.tex("\\begin{vmatrix}" + a[0] + "&" + b[0] + "\\\\" + a[1] + "&" + b[1] + "\\end{vmatrix}=" + pn(a[0]) + "\\times" + pn(b[1]) + "-" + pn(a[1]) + "\\times" + pn(b[0]) + "=" + det, true) +
            (f >= 1 && f <= 3 && nice ? SK.tex("(" + (a[0] + b[0]) + ")(" + (a[1] + b[1]) + ")-" + a[0] * a[1] + "-" + b[0] * b[1] + "-" + 2 * a[1] * b[0] + "=" + det, true) : "");
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "推一推，面積不變", icon: "sparkle",
        html: "把 $\\vec v$ 換成 $\\vec v+t\\vec u$，就像沿著 $\\vec u$ 的方向把平行四邊形「推斜」：底沒變，高也沒變，所以面積不變。行列式也一樣：$\\det(\\vec u,\\vec v+t\\vec u)=\\det(\\vec u,\\vec v)+t\\det(\\vec u,\\vec u)=\\det(\\vec u,\\vec v)$。高斯消去法的列運算不改變行列式，背後就是這張圖。" },
      { title: "升到三維：平行六面體的體積", icon: "leaf",
        html: "三個空間向量張出一個平行六面體，它的（有向）體積就是三階行列式：$$\\begin{vmatrix}a_1&b_1&c_1\\\\a_2&b_2&c_2\\\\a_3&b_3&c_3\\end{vmatrix}=\\vec a\\cdot(\\vec b\\times\\vec c).$$ 體積為 0，代表三個向量擠在同一個平面上。聯立方程式的係數行列式為 0，也就是沒有唯一解，說的是同一件事。" }
    ],

    challenges: [
      { q: "三角形頂點 $(0,0)$、$(4,1)$、$(1,3)$，面積是多少？", idea: "平行四邊形的一半：$\\tfrac12|4\\times3-1\\times1|=\\tfrac{11}{2}$。" },
      { q: "頂點不在原點的三角形 $(1,1)$、$(5,2)$、$(2,4)$ 呢？", hint: "先把 $(1,1)$ 當成新的原點，算出兩個邊向量。",
        idea: "邊向量 $(4,1)$、$(1,3)$，和上一題一樣，面積 $\\tfrac{11}{2}$。平移不改變面積。" },
      { q: "二元一次聯立方程式 $\\begin{cases}a_1x+b_1y=c_1\\\\a_2x+b_2y=c_2\\end{cases}$ 的係數行列式為 0 時，兩條直線有什麼關係？", idea: "係數行列式 $a_1b_2-a_2b_1=0$，代表兩條直線的法向量 $(a_1,b_1)$ 和 $(a_2,b_2)$ 平行，所以兩線平行或重合，沒有唯一解。克拉瑪公式的分母為 0，正好反映這件事。" }
    ],

    where: {
      codes: [["G-11A-6", "平面向量內積、正射影、面積與二階行列式"], ["G-11A-8", "三階行列式、平行六面體體積、三重積"], ["A-11A-1", "二元一次方程組的矩陣表達、克拉瑪公式"]],
      exam: "11 年級<b>數學 A</b>，學測數 A、分科數甲都在範圍內；數學 B 的平面向量不含行列式。",
      stop: "二階、三階行列式的幾何意義與計算就夠了。更高階行列式、降階展開技巧與大量行列式性質的代數操作不是高中核心，性質要盡量用「面積、體積」理解。"
    }
  });
})();
