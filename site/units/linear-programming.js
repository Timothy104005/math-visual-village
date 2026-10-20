/* 單元：線性規劃 */
(function () {
  var C = SK.C, s = SK.s;
  // 限制式：x≥0、y≥0、x+2y≤8、3x+2y≤12
  var CONS = [
    { a: 1, b: 0, c: 0, op: ">=", t: "x\\ge0" },
    { a: 0, b: 1, c: 0, op: ">=", t: "y\\ge0" },
    { a: 1, b: 2, c: 8, op: "<=", t: "x+2y\\le8" },
    { a: 3, b: 2, c: 12, op: "<=", t: "3x+2y\\le12" }
  ];
  var VERT = [[0, 0], [4, 0], [2, 3], [0, 4]];

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 250, "工廠的兩種產品");
    s("rect", { x: 30, y: 40, width: 150, height: 90, rx: 10, fill: C.orange.f, stroke: C.orange.s }, svg);
    s("rect", { x: 220, y: 40, width: 150, height: 90, rx: 10, fill: C.blue.f, stroke: C.blue.s }, svg);
    SK.label(svg, 105, 66, "產品 A", { size: 15 }); SK.label(svg, 105, 92, "利潤 3 萬", { size: 13, color: C.soft });
    SK.label(svg, 105, 114, "要 1 天機器、2 人", { size: 11, color: C.soft });
    SK.label(svg, 295, 66, "產品 B", { size: 15 }); SK.label(svg, 295, 92, "利潤 1 萬", { size: 13, color: C.soft });
    SK.label(svg, 295, 114, "要 2 天機器、2 人", { size: 11, color: C.soft });
    SK.label(svg, 200, 170, "機器最多 8 天、人力最多 12 單位", { size: 13 });
    SK.label(svg, 200, 206, "各做幾個，利潤最大？", { size: 14, color: C.pink.s });
  }

  SK.mountUnit({
    slug: "linear-programming",
    en: "Push a line as far as it goes",
    formula: "\\max\\ (\\co a x+\\cb b y)\\quad\\text{在可行區域上，最佳解出現在}\\ \\cg{\\text{頂點}}",

    hook: {
      html: "工廠要決定兩種產品各做幾個。機器時間、人力都有上限，每種產品的利潤不同。",
      ask: "可行的做法有無限多種組合，怎麼<b>不用一個一個試</b>就找到利潤最大的那一種？",
      visual: hookVisual
    },

    guess: {
      q: "在一個由幾條直線圍出的區域上，求 $3x+y$ 的最大值。最大值會出現在哪裡？",
      options: [
        { t: "區域的某個頂點", truth: true, explain: "$3x+y=k$ 是一組平行線。把線往利潤變大的方向平移，最後離開區域前碰到的地方，一定是一個頂點（或剛好是一整條邊）。所以只要檢查頂點就好。" },
        { t: "區域的正中央", common: true, explain: "「中間」對某些問題（例如距離最短）是對的，但一次式沒有山頂：它沿著固定方向一路遞增，所以最大值一定被擠到邊界上。" },
        { t: "要把區域裡每一點都代進去算", explain: "區域裡有無限多點，不可能一個個算。線性規劃厲害的地方，就是把無限多個候選壓縮成有限幾個頂點。" },
        { t: "沒有最大值", explain: "只要可行區域有界又不是空的，一次式一定有最大值和最小值。（區域無界時才可能沒有。）" }
      ]
    },

    derive: {
      intro: "拖動滑桿改目標函數的係數或等值線的高度，看那條線怎麼在區域上移動。",
      tall: true,
      frames: [
        { cap: "每個限制式都是一個<b>半平面</b>。把它們疊在一起，共同的部分就是<b>可行區域</b>：所有符合條件的做法。", tex: "\\begin{cases}x\\ge0,\\ y\\ge0\\\\x+2y\\le8\\\\3x+2y\\le12\\end{cases}" },
        { cap: "<b>目標函數</b> $ax+by$ 的等值線 $ax+by=k$ 是一組<b>平行線</b>：同一條線上的做法利潤一樣。$k$ 越大，線越往右上移。", tex: "ax+by=k\\ \\text{（一組平行線）}" },
        { cap: "把等值線慢慢往利潤變大的方向推。最後<b>還碰得到</b>可行區域的位置，就是最大值；通常停在一個<b>頂點</b>上。", tex: "\\max k：\\text{離開區域前的最後接觸點}" },
        { cap: "所以只要算出所有頂點，把它們一個個代進目標函數比大小就好。這是線性規劃的核心方法。", tex: "(0,0),(4,0),(2,3),(0,4)\\ \\to\\ ax+by" },
        { cap: "兩種特殊情形：目標函數和某一條邊<b>平行</b>時，整條邊都是最佳解（有無限多組最佳做法）；可行區域<b>無界</b>時，某個方向可能沒有最大值。", tex: "\\text{平行於一邊}\\ \\Rightarrow\\ \\text{整條邊都最佳}" }
      ],
      hint: "拖動 a、b 改利潤；拖動 k 推動等值線。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 540, 440, "可行區域與目標函數");
        var g = s("g", {}, svg);
        var O = [110, 370], u = 56, st = { a: 3, b: 1, k: 6 };
        function P(v) { return [O[0] + v[0] * u, O[1] - v[1] * u]; }
        var read = SK.h("div", { class: "readout" });
        var sa = SK.slider({ label: "$a$（A 的利潤）", min: 0, max: 6, step: .5, value: st.a, onInput: function (v) { st.a = v; draw(); } });
        var sb = SK.slider({ label: "$b$（B 的利潤）", min: 0, max: 6, step: .5, value: st.b, color: "blue", onInput: function (v) { st.b = v; draw(); } });
        var sk = SK.slider({ label: "$k$", min: 0, max: 24, step: .5, value: st.k, color: "green", onInput: function (v) { st.k = v; draw(); } });
        [sa, sb, sk].forEach(function (o) { ctx.sliders.appendChild(o.el); });
        ctx.extra.appendChild(read);
        function num(v) { return SK.fmt(v, 2).replace("−", "-"); }
        function draw() {
          var f = ctx.frame, a = st.a, b = st.b;
          g.innerHTML = "";
          sa.el.style.display = sb.el.style.display = f >= 1 ? "" : "none";
          sk.el.style.display = f === 1 || f === 2 ? "" : "none";
          // 格線與軸
          for (var i = -1; i <= 6; i++) { var p1 = P([i, -1]), p2 = P([i, 5.5]); s("line", { x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1], class: "m-grid" }, g); }
          for (var j = -1; j <= 5; j++) { var q1 = P([-1, j]), q2 = P([7, j]); s("line", { x1: q1[0], y1: q1[1], x2: q2[0], y2: q2[1], class: "m-grid" }, g); }
          var ax0 = P([-1, 0]), ax1 = P([7, 0]), ay0 = P([0, -1]), ay1 = P([0, 5.5]);
          s("line", { x1: ax0[0], y1: ax0[1], x2: ax1[0], y2: ax1[1], class: "m-axis" }, g);
          s("line", { x1: ay0[0], y1: ay0[1], x2: ay1[0], y2: ay1[1], class: "m-axis" }, g);
          for (var t = 1; t <= 6; t++) SK.label(g, P([t, 0])[0], P([t, 0])[1] + 16, String(t), { size: 11, color: C.soft });
          for (var t2 = 1; t2 <= 5; t2++) SK.label(g, P([0, t2])[0] - 12, P([0, t2])[1], String(t2), { size: 11, color: C.soft });
          SK.label(g, P([6.4, 0])[0], P([6.4, 0])[1] + 16, "A 的個數 x", { size: 12, color: C.soft });
          SK.label(g, P([0, 5.2])[0] + 40, P([0, 5.2])[1], "B 的個數 y", { size: 12, color: C.soft });
          // 可行區域
          s("path", { d: "M" + VERT.map(P).join(" L") + "Z", fill: C.gold.f, stroke: C.cocoa, "stroke-width": 1.6 }, g);
          // 限制線
          CONS.slice(2).forEach(function (c, i) {
            var p = c.b ? [[-1, (c.c + c.a) / c.b], [7, (c.c - 7 * c.a) / c.b]] : [[c.c / c.a, -1], [c.c / c.a, 5.5]];
            var A = P(p[0]), B = P(p[1]);
            s("line", { x1: A[0], y1: A[1], x2: B[0], y2: B[1], stroke: [C.orange.s, C.blue.s][i], "stroke-width": 2, "stroke-dasharray": "6 4" }, g);
            var lab = P([[5, 1.5], [3.2, 1.2]][i]);
            SK.label(g, lab[0] + 10, lab[1] - 10, ["x+2y=8", "3x+2y=12"][i], { size: 11, color: [C.orange.s, C.blue.s][i], anchor: "start" });
          });
          if (f === 0) {
            SK.label(g, 300, 40, "四個限制式圍出的可行區域", { size: 14, color: C.soft });
            read.innerHTML = SK.tex("\\text{可行區域的頂點：}(0,0),(4,0),(2,3),(0,4)", true);
            return;
          }
          var best = VERT.reduce(function (m, v) { return a * v[0] + b * v[1] > a * m[0] + b * m[1] + 1e-9 ? v : m; }, VERT[0]);
          var kMax = a * best[0] + b * best[1];
          function level(k, col, w, dash) {
            if (Math.abs(a) < 1e-9 && Math.abs(b) < 1e-9) return;
            var pts = [];
            if (Math.abs(b) > 1e-9) { pts = [[-1, (k + a) / b], [7, (k - 7 * a) / b]]; } else { pts = [[k / a, -1], [k / a, 5.5]]; }
            var A = P(pts[0]), B = P(pts[1]);
            s("line", { x1: A[0], y1: A[1], x2: B[0], y2: B[1], stroke: col, "stroke-width": w, "stroke-dasharray": dash || null }, g);
          }
          if (f >= 1) {
            [0, 4, 8, 12, 16, 20].forEach(function (k) { if (k !== st.k) level(k, "rgba(100,122,88,.35)", 1.4, "4 4"); });
            level(st.k, C.green.s, 3);
            var lp = P([5.6, (st.k - 5.6 * a) / (b || 1)]);
            if (b) SK.label(g, lp[0] + 8, lp[1], "k = " + num(st.k), { size: 12, color: C.green.s, anchor: "start" });
          }
          if (f === 2 || f === 3) {
            level(kMax, C.pink.s, 3.4);
            var Bp = P(best);
            s("circle", { cx: Bp[0], cy: Bp[1], r: 9, fill: C.pink.s, stroke: C.paper, "stroke-width": 2 }, g);
            SK.label(g, Bp[0] + 14, Bp[1] - 14, "最佳 (" + best[0] + ", " + best[1] + ")", { size: 13, color: C.pink.s, anchor: "start" });
          }
          if (f >= 3) {
            VERT.forEach(function (v, i) {
              var p = P(v), val = a * v[0] + b * v[1];
              s("circle", { cx: p[0], cy: p[1], r: 6, fill: C.paper, stroke: C.cocoa, "stroke-width": 1.6 }, g);
              SK.label(g, 330, 40 + i * 26, "(" + v[0] + ", " + v[1] + ") → " + num(val), { size: 13, anchor: "start", color: Math.abs(val - kMax) < 1e-9 ? C.pink.s : C.soft, bold: Math.abs(val - kMax) < 1e-9 });
            });
          }
          if (f === 4) {
            var par = Math.abs(a * 2 - b * 1) < 1e-9 || Math.abs(a * 2 - b * 3) < 1e-9;
            SK.label(g, 300, 40, par ? "目標函數和一條邊平行：整條邊都是最佳解" : "把 a、b 調成 (1,2) 或 (3,2) 試試看", { size: 13, color: par ? C.pink.s : C.soft });
            if (par) {
              var edge = Math.abs(a * 2 - b * 1) < 1e-9 ? [[0, 4], [2, 3]] : [[2, 3], [4, 0]];
              var e1 = P(edge[0]), e2 = P(edge[1]);
              s("line", { x1: e1[0], y1: e1[1], x2: e2[0], y2: e2[1], stroke: C.pink.s, "stroke-width": 6, opacity: .8 }, g);
            }
          }
          read.innerHTML = SK.tex("\\text{目標}=" + num(a) + "x+" + num(b) + "y", true) +
            (f >= 2 ? SK.tex("\\max=" + num(kMax) + "\\ \\text{在}\\ (" + best[0] + "," + best[1] + ")", true) : "");
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "為什麼最佳解一定在頂點", icon: "sparkle",
        html: "沿著可行區域裡的任何一條線段走，目標函數 $ax+by$ 的變化是<b>均勻</b>的（一次式）：不是一路變大、就是一路變小、或者完全不變。所以最大值不可能出現在線段內部而兩端比較小。一路推到底，就停在角落。" },
      { title: "現實中的線性規劃", icon: "leaf",
        html: "排班表、運輸路線、飼料配方、投資組合，都是「在一堆限制下把某個量做到最大或最小」。實際問題可能有上萬個變數，電腦用的單純形法（simplex）做的事情，就是<b>有效率地在頂點之間移動</b>，一次往目標更好的鄰居跳。" }
    ],

    challenges: [
      { q: "承本單元的區域，若 A 的利潤變成 1 萬、B 變成 3 萬，最佳做法是什麼？", idea: "目標 $x+3y$：四個頂點值分別是 0、4、11、12，最大在 $(0,4)$：全部做 B。把 $b$ 調大，最佳解會從 $(4,0)$ 移到 $(2,3)$ 再到 $(0,4)$。" },
      { q: "同樣的區域，$3x+2y$ 的<b>最小值</b>在哪裡？", idea: "在 $(0,0)$，值是 0。最小值也一定在頂點：把等值線往反方向推就好。" },
      { q: "如果再加一個限制 $x\\le1$，可行區域和最佳解會怎麼變？", idea: "區域被切掉右邊一塊，新的頂點變成 $(0,0),(1,0),(1,3.5),(0,4)$。以 $3x+2y$ 來算：$0,3,10,8$，最佳解變成 $(1,3.5)$。限制越多，最佳值只會變差或不變。" }
    ],

    where: {
      codes: [["A-12乙-1", "線性規劃：目標函數為一次式的極值問題、平行直線系、可行區域與頂點"]],
      exam: "12 年級<b>選修數學乙</b>，是數乙特有的單元（數甲沒有）。前置是 10 年級的二元一次不等式（見「直線方程式」）。",
      stop: "限制式以二元、少數幾條為主，用圖解法找頂點。單純形法、對偶問題與多變數的線性規劃是大學內容。"
    }
  });
})();
