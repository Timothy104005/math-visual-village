/* 單元：外積 */
(function () {
  var C = SK.C, s = SK.s;

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 250, "桌面上的兩支筆與一根直立的筆");
    var v = SK.view3d(svg, { cx: 200, cy: 160, scale: 34, yaw: -120, pitch: 22 });
    var g = s("g", {}, svg);
    v.poly(g, [[0, 0, 0], [3, 0, 0], [4, 2.5, 0], [1, 2.5, 0]], { fill: C.gold.f, stroke: C.line });
    v.arrow(g, [0, 0, 0], [3, 0, 0], C.orange.s, 3.4);
    v.arrow(g, [0, 0, 0], [1, 2.5, 0], C.blue.s, 3.4);
    v.arrow(g, [0, 0, 0], [0, 0, 3.5], C.green.s, 3.8);
    v.text(g, [0, 0, 3.9], "?", { size: 18, color: C.green.s });
    SK.label(svg, 200, 238, "同時垂直兩個向量的方向，怎麼從坐標算出來？", { size: 13, color: C.soft });
  }

  SK.mountUnit({
    slug: "cross-product",
    en: "A vector perpendicular to two vectors",
    formula: "\\co{\\vec a}\\times\\cb{\\vec b}=\\left(\\begin{vmatrix}a_2&a_3\\\\b_2&b_3\\end{vmatrix},\\begin{vmatrix}a_3&a_1\\\\b_3&b_1\\end{vmatrix},\\begin{vmatrix}a_1&a_2\\\\b_1&b_2\\end{vmatrix}\\right),\\quad |\\vec a\\times\\vec b|=|\\vec a||\\vec b|\\sin\\theta",

    hook: {
      html: "兩支筆平放在桌上，指著不同方向。第三支筆直立在桌面上，它同時垂直前兩支。",
      ask: "如果只知道前兩支筆的方向坐標，能不能直接算出第三支的方向？它的長度又有什麼意義？",
      visual: hookVisual
    },

    guess: {
      q: "$\\vec a=(1,0,0)$、$\\vec b=(0,1,0)$，$\\vec a\\times\\vec b$ 是什麼？",
      options: [
        { t: "$(0,0,1)$", truth: true, explain: "$x$ 軸方向叉 $y$ 軸方向，得到 $z$ 軸方向。長度 1，正是兩個向量張出的正方形面積。右手四指從 $\\vec a$ 彎向 $\\vec b$，大拇指指向 $+z$。" },
        { t: "$0$", common: true, explain: "兩個垂直向量的<b>內積</b>是 0，所以很容易想成 0！但外積是一個<b>向量</b>，而且垂直的時候它反而最長：$|\\vec a||\\vec b|\\sin90^\\circ=1$。" },
        { t: "$(0,0,-1)$", explain: "方向相反了。外積的方向用右手定則：四指從 $\\vec a$ 彎向 $\\vec b$。$(0,0,-1)$ 是 $\\vec b\\times\\vec a$。" },
        { t: "$(1,1,0)$", explain: "這是 $\\vec a+\\vec b$，它在兩向量的平面上，不垂直它們。" }
      ]
    },

    derive: {
      intro: "拖動滑桿改 $\\vec b$（$\\vec a=(3,0,1)$ 固定）；在圖上按住拖曳可以旋轉，找一個看得清楚垂直的角度。",
      tall: true,
      frames: [
        { cap: "目標：找一個向量 $\\vec n$，同時垂直 $\\vec a$ 和 $\\vec b$。用內積寫成兩個方程式：$\\vec n\\cdot\\vec a=0$、$\\vec n\\cdot\\vec b=0$。三個未知數兩個方程式，解有無限多個。<b>當 $\\vec a,\\vec b$ 不平行時</b>，這些解都在同一條直線上——方向唯一（只差倍數與正負）。若 $\\vec a\\parallel\\vec b$（例如 $\\vec a=\\vec b=(3,0,1)$），兩個方程式其實是同一個，垂直它們的向量鋪滿一整個平面，法向方向不唯一；這時外積正好是 $\\vec 0$。", tex: "\\begin{cases}a_1x+a_2y+a_3z=0\\\\b_1x+b_2y+b_3z=0\\end{cases}" },
        { cap: "解出來的一組漂亮答案，三個分量剛好都是二階行列式（遮住第 1、2、3 行），這就是<b>外積</b>。記法：把 $\\vec a$、$\\vec b$ 排兩列，依序遮掉一行交叉相乘（中間那個要注意順序）。", tex: "\\begin{aligned}\\vec a\\times\\vec b=(&a_2b_3-a_3b_2,\\\\&a_3b_1-a_1b_3,\\\\&a_1b_2-a_2b_1)\\end{aligned}" },
        { cap: "<b>長度</b>：$|\\vec a\\times\\vec b|=|\\vec a||\\vec b|\\sin\\theta$，正好是 $\\vec a$、$\\vec b$ 張出的<b>平行四邊形面積</b>。兩向量平行時面積 0，外積是零向量。", tex: "|\\vec a\\times\\vec b|=|\\vec a||\\vec b|\\sin\\theta=\\text{平行四邊形面積}" },
        { cap: "<b>方向</b>：右手定則，四指從 $\\vec a$ 彎向 $\\vec b$，大拇指就是 $\\vec a\\times\\vec b$。所以順序很重要：$\\vec b\\times\\vec a=-\\vec a\\times\\vec b$。", tex: "\\vec b\\times\\vec a=-(\\vec a\\times\\vec b)" },
        { cap: "應用：三角形面積是平行四邊形的一半。再加一個向量 $\\vec c$，$|(\\vec a\\times\\vec b)\\cdot\\vec c|$ = 底面積 × 高 = 平行六面體的體積，也就是三階行列式的絕對值。", tex: "\\triangle=\\tfrac12|\\vec a\\times\\vec b|,\\qquad V=|(\\vec a\\times\\vec b)\\cdot\\vec c|" }
      ],
      hint: "按住圖形拖曳旋轉。外積的箭頭畫成實際長度的一半。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 540, 440, "外積");
        var g = s("g", {}, svg);
        var v = SK.view3d(svg, { cx: 250, cy: 290, scale: 40, yaw: -125, pitch: 18, onRotate: function () { draw(); } });
        var A = [3, 0, 1], st = { b: [1, 2.5, 0], cz: 2 };
        var read = SK.h("div", { class: "readout" });
        var sb = ["$b_1$", "$b_2$", "$b_3$"].map(function (lab, k) {
          var o = SK.slider({ label: lab, min: -2, max: 3, step: .5, value: st.b[k], color: ["", "blue", "green"][k], onInput: function (x) { st.b[k] = x; draw(); } });
          ctx.sliders.appendChild(o.el); return o;
        });
        var scz = SK.slider({ label: "$\\vec c$ 的高", min: -3, max: 3, step: .5, value: st.cz, color: "green", onInput: function (x) { st.cz = x; draw(); } });
        ctx.sliders.appendChild(scz.el);
        ctx.extra.appendChild(read);
        function num(x) { return SK.fmt(x, 2).replace("−", "-"); }
        function cross(p, q) { return [p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0]]; }
        function dot(p, q) { return p[0] * q[0] + p[1] * q[1] + p[2] * q[2]; }
        function len(p) { return Math.sqrt(dot(p, p)); }
        function add(p, q) { return [p[0] + q[0], p[1] + q[1], p[2] + q[2]]; }
        function vs(p) { return "(" + p.map(num).join(",") + ")"; }
        function right3(p, d1, d2, col) {
          var k = .35, n1 = len(d1), n2 = len(d2);
          if (n1 < 1e-9 || n2 < 1e-9) return;
          var a = add(p, d1.map(function (x) { return x / n1 * k; })), c = add(p, d2.map(function (x) { return x / n2 * k; })), b = add(a, d2.map(function (x) { return x / n2 * k; }));
          s("path", { d: "M" + v.P(a) + " L" + v.P(b) + " L" + v.P(c), fill: "none", stroke: col, "stroke-width": 1.4 }, g);
        }
        function draw() {
          var f = ctx.frame, B = st.b, Z = [0, 0, 0], N = cross(A, B), ln = len(N);
          g.innerHTML = "";
          scz.el.style.display = f === 4 ? "" : "none";
          v.axes(g, 4.5, 2.5);
          var S = add(A, B);
          v.poly(g, [Z, A, S, B], { fill: f >= 2 ? C.gold.f : "rgba(241,226,184,.4)", stroke: C.line });
          if (f === 4) {
            // 平行六面體：c 取 N 方向加一點偏移
            var Cv = [.6, -.4, st.cz];
            var top = [Z, A, S, B].map(function (p) { return add(p, Cv); });
            v.poly(g, top, { fill: "rgba(210,198,218,.35)", stroke: C.purple.s });
            [Z, A, S, B].forEach(function (p, i) { v.line(g, p, top[i], { stroke: C.purple.s, "stroke-dasharray": "4 3" }); });
            v.arrow(g, Z, Cv, C.purple.s, 3);
            var Cp = v.P(Cv); SK.label(g, Cp[0] - 10, Cp[1] - 8, "c", { it: true, color: C.purple.s, anchor: "end" });
          }
          v.arrow(g, Z, A, C.orange.s, 3.8); v.arrow(g, Z, B, C.blue.s, 3.8);
          var Ap = v.P(A), Bp = v.P(B);
          SK.label(g, Ap[0] + 10, Ap[1] + 10, "a", { it: true, color: C.orange.s, anchor: "start" });
          SK.label(g, Bp[0] + 10, Bp[1] - 8, "b", { it: true, color: C.blue.s, anchor: "start" });
          var lines = [];
          if (ln > 1e-9) {
            var Nh = N.map(function (x) { return x / 2; }); // 畫成一半長，避免跑出畫面
            var Ns = f === 3 ? Nh.map(function (x) { return -x; }) : Nh;
            if (f === 3) { v.arrow(g, Z, Nh, "rgba(100,122,88,.45)", 2.6); }
            v.arrow(g, Z, Ns, f === 3 ? C.pink.s : C.green.s, 4);
            var Np = v.P(Ns); SK.label(g, Np[0] + 10, Np[1] - 8, f === 3 ? "b × a" : "a × b", { size: 14, color: f === 3 ? C.pink.s : C.green.s, anchor: "start" });
            right3(Z, N, A, C.orange.s); right3(Z, N, B, C.blue.s);
            if (f === 3) { var Np2 = v.P(Nh); SK.label(g, Np2[0] + 10, Np2[1] - 8, "a × b", { size: 12, color: C.green.s, anchor: "start" }); }
          }
          lines.push("\\vec a\\times\\vec b=" + vs(N));
          if (f === 0 || f === 1) lines.push("(\\vec a\\times\\vec b)\\cdot\\vec a=" + num(dot(N, A)) + ",\\ \\ (\\vec a\\times\\vec b)\\cdot\\vec b=" + num(dot(N, B)));
          if (f === 2) {
            var la = len(A), lb = len(B), sin = lb > 1e-9 ? ln / (la * lb) : 0;
            lines.push("|\\vec a\\times\\vec b|=" + num(ln) + "=" + num(la) + "\\times" + num(lb) + "\\times" + num(sin));
          }
          if (f === 4) {
            var Cv2 = [.6, -.4, st.cz], vol = dot(N, Cv2);
            lines.push("\\triangle=\\tfrac12\\times" + num(ln) + "=" + num(ln / 2) + ",\\ \\ V=|" + num(vol) + "|=" + num(Math.abs(vol)));
          }
          if (ln < 1e-9) lines.push("\\vec a\\parallel\\vec b：\\text{面積 0，外積是零向量}");
          read.innerHTML = lines.map(function (t) { return SK.tex(t, true); }).join("");
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "外積就是法向量", icon: "sparkle",
        html: "三個點 $A,B,C$ 決定一個平面。$\\overrightarrow{AB}\\times\\overrightarrow{AC}$ 同時垂直平面上的兩個方向，所以它垂直整個平面：這就是平面的<b>法向量</b>。下一個單元寫平面方程式，第一步就是它。" },
      { title: "和行列式是一家人", icon: "leaf",
        html: "二階行列式是平行四邊形的有向面積；外積把「三個坐標平面上的投影面積」排成一個向量；三階行列式 $(\\vec a\\times\\vec b)\\cdot\\vec c$ 是平行六面體的有向體積。面積、體積、垂直，全都來自同一個交叉相乘的想法。" }
    ],

    challenges: [
      { q: "求 $(1,2,3)\\times(4,5,6)$。", idea: "$(2\\cdot6-3\\cdot5,\\ 3\\cdot4-1\\cdot6,\\ 1\\cdot5-2\\cdot4)=(-3,6,-3)$。檢查：和 $(1,2,3)$ 內積 $-3+12-9=0$ ✓。" },
      { q: "$A(1,0,0)$、$B(0,2,0)$、$C(0,0,3)$ 三角形面積是多少？", idea: "$\\overrightarrow{AB}=(-1,2,0)$、$\\overrightarrow{AC}=(-1,0,3)$，外積 $(6,3,2)$，長度 7，面積 $\\tfrac72$。" },
      { q: "為什麼 $\\vec a\\times\\vec a=\\vec 0$？從公式和從幾何各說一次。", idea: "公式：每個分量都是 $a_ia_j-a_ja_i=0$。幾何：同一個向量張不出平行四邊形，面積 0。" }
    ],

    where: {
      codes: [["G-11A-7", "空間向量的運算：外積（向量表示、長度為平行四邊形面積、方向）；內積與柯西不等式見上一單元"]],
      exam: "11 年級<b>數學 A</b>，學測數 A、分科數甲都在範圍內。主要用途是求平面的法向量、三角形面積與四面體、平行六面體體積。",

      past: [] /* Examination text excluded; see docs/PROVENANCE.md. */,
      stop: "外積的計算、幾何意義與求法向量就夠了。外積的代數性質（如分配律）的證明、向量三重積等不是重點。"
    }
  });
})();
