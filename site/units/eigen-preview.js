/* 補充單元：特徵向量預告 */
(function () {
  var C = SK.C, s = SK.s;

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 240, "變換前後的一圈箭頭");
    var cx = 200, cy = 120, A = [[1.5, .5], [.5, 1.5]];
    for (var k = 0; k < 12; k++) {
      var t = k * Math.PI / 6, v = [Math.cos(t), Math.sin(t)], w = [A[0][0] * v[0] + A[0][1] * v[1], A[1][0] * v[0] + A[1][1] * v[1]];
      var keep = Math.abs(v[0] * w[1] - v[1] * w[0]) < 1e-6;
      SK.arrow(svg, cx, cy, cx + w[0] * 45, cy - w[1] * 45, keep ? C.orange.s : "#C9BFB2", keep ? 2.6 : 1.4);
    }
    SK.label(svg, 200, 228, "大部分箭頭都被轉了方向，只有少數沒有", { size: 13, color: C.soft });
  }

  SK.mountUnit({
    slug: "eigen-preview",
    en: "Directions a matrix only stretches",
    formula: "A\\vec v=\\co{\\lambda}\\vec v\\quad(\\vec v\\ne\\vec 0)",

    hook: {
      html: "「線性變換」單元裡，矩陣會把整張方格紙拉歪、旋轉。大部分的箭頭經過變換後，都會轉到別的方向。",
      ask: "有沒有哪些箭頭，變換後<b>還在原來那條直線上</b>，只是被拉長或縮短？",
      visual: hookVisual
    },

    guess: {
      q: "矩陣 $\\begin{pmatrix}2&0\\\\0&3\\end{pmatrix}$（水平拉 2 倍、鉛直拉 3 倍）作用後，哪些向量的方向不會改變？",
      options: [
        { t: "水平方向和鉛直方向的向量", truth: true, explain: "$(1,0)$ 變成 $(2,0)$，還在 $x$ 軸上，被拉長 2 倍；$(0,1)$ 變成 $(0,3)$，拉長 3 倍。斜的向量兩個方向拉得不一樣多，所以會轉向。" },
        { t: "所有向量", common: true, explain: "只有水平、鉛直都拉一樣多（例如 $2I$）時，所有向量的方向才不變。這裡兩個方向拉的倍數不同，斜斜的向量會被拉歪。" },
        { t: "沒有任何向量", explain: "試試 $(1,0)$：它變成 $(2,0)$，方向完全沒變。" },
        { t: "只有 $(1,1)$", explain: "$(1,1)$ 變成 $(2,3)$，方向改變了（斜率從 1 變成 1.5）。" }
      ]
    },

    derive: {
      intro: "拖動滑桿改變矩陣 $\\begin{pmatrix}a&b\\\\b&d\\end{pmatrix}$（這裡用對稱矩陣，看得比較清楚）。灰色是變換前的單位圓向量，彩色是變換後。",
      tall: true,
      frames: [
        { cap: "把單位圓上的一圈向量都做一次變換。大部分向量都被轉到新的方向（灰色虛線是原本的方向）。", tex: "\\vec v\\ \\longmapsto\\ A\\vec v" },
        { cap: "但有幾個特別的方向（蜜桃色）：變換後還在原本的直線上，只是長度乘上一個倍數 $\\lambda$。這些叫<b>特徵向量</b>，倍數叫<b>特徵值</b>。", tex: "A\\vec v=\\co{\\lambda}\\vec v" },
        { cap: "在特徵向量的方向上，複雜的矩陣變成了簡單的「拉長 $\\lambda$ 倍」。這是大學線性代數最核心的想法之一。", tex: "\\text{沿特徵方向：只是伸縮}" }
      ],
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 520, 440, "特徵向量的方向");
        var g = s("g", {}, svg);
        var st = { a: 1.6, b: .6, d: 1 };
        var read = SK.h("div", { class: "readout" });
        [["a", "$a$", ""], ["b", "$b$", "blue"], ["d", "$d$", "green"]].forEach(function (x) {
          ctx.sliders.appendChild(SK.slider({ label: x[1], min: -2, max: 2, step: .1, value: st[x[0]], color: x[2], onInput: function (v) { st[x[0]] = v; draw(); } }).el);
        });
        ctx.extra.appendChild(read);
        function draw() {
          var f = ctx.frame, a = st.a, b = st.b, d = st.d, cx = 260, cy = 220, u = 80;
          g.innerHTML = "";
          s("line", { x1: 20, y1: cy, x2: 500, y2: cy, class: "m-axis" }, g);
          s("line", { x1: cx, y1: 10, x2: cx, y2: 430, class: "m-axis" }, g);
          s("circle", { cx: cx, cy: cy, r: u, fill: "none", stroke: C.line, "stroke-dasharray": "3 5" }, g);
          // 對稱矩陣的特徵值與特徵向量
          var tr = a + d, det = a * d - b * b, disc = Math.sqrt(Math.max(0, tr * tr / 4 - det));
          var l1 = tr / 2 + disc, l2 = tr / 2 - disc, eig = [];
          [l1, l2].forEach(function (l) { var v = Math.abs(b) > 1e-9 ? [b, l - a] : (Math.abs(l - a) < 1e-9 ? [1, 0] : [0, 1]); var n = Math.hypot(v[0], v[1]); eig.push([v[0] / n, v[1] / n, l]); });
          for (var k = 0; k < 24; k++) {
            var t = k * Math.PI / 12, v = [Math.cos(t), Math.sin(t)], w = [a * v[0] + b * v[1], b * v[0] + d * v[1]];
            s("line", { x1: cx, y1: cy, x2: cx + v[0] * u, y2: cy - v[1] * u, stroke: "#DDD3C4", "stroke-width": 1, "stroke-dasharray": "2 3" }, g);
            SK.arrow(g, cx, cy, cx + w[0] * u, cy - w[1] * u, "#B8AC9E", 1.3);
          }
          if (f >= 1) eig.forEach(function (e, i) {
            [1, -1].forEach(function (sg) {
              s("line", { x1: cx, y1: cy, x2: cx + sg * e[0] * 2.6 * u, y2: cy - sg * e[1] * 2.6 * u, stroke: i ? C.blue.s : C.orange.s, "stroke-width": 1.2, "stroke-dasharray": "6 5" }, g);
            });
            SK.arrow(g, cx, cy, cx + e[0] * e[2] * u, cy - e[1] * e[2] * u, i ? C.blue.s : C.orange.s, 3.4);
            SK.label(g, cx + e[0] * 2.5 * u, cy - e[1] * 2.5 * u - 10, "λ = " + SK.fmt(e[2], 2), { size: 13, color: i ? C.blue.s : C.orange.s });
          });
          read.innerHTML = SK.tex("A=\\begin{pmatrix}" + SK.fmt(a, 1) + "&" + SK.fmt(b, 1) + "\\\\" + SK.fmt(b, 1) + "&" + SK.fmt(d, 1) + "\\end{pmatrix}" + (f >= 1 ? ",\\quad \\lambda_1\\approx" + SK.fmt(l1, 2) + ",\\ \\lambda_2\\approx" + SK.fmt(l2, 2) : ""), true);
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "轉移矩陣為什麼會穩定下來", icon: "sparkle",
        html: "「線性變換」單元的兩個品牌，每個月乘一次轉移矩陣，比例最後停在甲 60%、乙 40%。這個穩定的比例 $(0.6,0.4)$ 正是一個特徵值為 1 的特徵向量：$A\\vec v=\\vec v$，乘了之後完全不變。其他方向的特徵值小於 1，每乘一次就縮小一些，久了就消失，所以不管從哪裡出發，最後都會被拉到那個穩定狀態。" },
      { title: "為什麼有些方程式「資訊重複」", icon: "leaf",
        html: "三條方程式看起來有三個條件，但如果其中一條是另外兩條的組合，其實只有兩個有效的條件，這時就有無限多解。大學用「秩（rank）」和「線性獨立」來精確描述這件事；高中用行列式為 0、高斯消去後出現 $0=0$ 的列來觀察它。" }
    ],

    challenges: [
      { q: "矩陣 $\\begin{pmatrix}1&1\\\\1&1\\end{pmatrix}$ 的特徵方向是什麼？特徵值各是多少？在上面的圖驗證。", idea: "$(1,1)$ 方向被拉成 2 倍（$\\lambda=2$）；$(1,-1)$ 方向被壓成 0（$\\lambda=0$），整個平面被壓扁成一條線，所以行列式是 0。" },
      { q: "旋轉 $90^\\circ$ 的矩陣有沒有特徵向量（在實數平面上）？", idea: "沒有：每一個非零向量都被轉走了。這時候特徵值是複數 $\\pm i$，和「複數平面」單元裡「乘以 $i$ 就是轉 $90^\\circ$」是同一件事。" }
    ],

    where: {
      codes: [["F-11A-3", "（接點）平面線性變換與二階轉移方陣"], ["A-11A-2", "（接點）三元一次聯立方程式、高斯消去"]],
      exam: "<b>課綱外補充</b>：特徵值、特徵向量、秩、線性獨立與穩定狀態，全部都在高中正式範圍之外。這裡只作概念預告，讓有興趣的同學看到大學線性代數的方向。",
      stop: "只用圖像與電腦的計算結果展示概念；不引入完整定義與手算程序，也不要求計算特徵多項式、高階反矩陣或穩態向量。"
    }
  });
})();
