/* 單元：平面向量 */
(function () {
  var C = SK.C, s = SK.s;

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 250, "兩段位移接起來");
    var A = [60, 200], B = [200, 150], D = [300, 60];
    SK.arrow(svg, A[0], A[1], B[0], B[1], C.orange.s, 3.4);
    SK.arrow(svg, B[0], B[1], D[0], D[1], C.blue.s, 3.4);
    s("line", { x1: A[0], y1: A[1], x2: D[0], y2: D[1], stroke: C.green.s, "stroke-width": 2.4, "stroke-dasharray": "6 5" }, svg);
    SK.label(svg, 120, 190, "往東 4、往北 1.5", { size: 12, color: C.orange.s });
    SK.label(svg, 270, 120, "往東 3、往北 3", { size: 12, color: C.blue.s, anchor: "start" });
    SK.label(svg, 140, 100, "合起來走了多少？", { size: 13, color: C.green.s });
  }

  SK.mountUnit({
    slug: "plane-vector",
    en: "Displacements you can add and stretch",
    formula: "\\cg{\\vec w}=\\co s\\,\\co{\\vec u}+\\cb t\\,\\cb{\\vec v},\\qquad (a_1,a_2)+(b_1,b_2)=(a_1+b_1,\\,a_2+b_2)",

    hook: {
      html: "先往東 4、往北 1.5，再往東 3、往北 3。像這種有<b>方向</b>又有<b>大小</b>的量，叫做向量。",
      ask: "兩段位移可以「相加」嗎？加起來的結果怎麼從坐標算出來？",
      visual: hookVisual
    },

    guess: {
      q: "$\\vec u=(2,1)$、$\\vec v=(1,3)$。$(7,6)$ 能寫成 $s\\vec u+t\\vec v$ 嗎？",
      options: [
        { t: "可以，$s=3$、$t=1$", truth: true, explain: "$3(2,1)+1(1,3)=(6,3)+(1,3)=(7,6)$。其實平面上<b>任何</b>一個向量都能這樣寫，只要 $\\vec u$、$\\vec v$ 不平行。等一下你會看到 $\\vec u,\\vec v$ 張出的「斜格子」蓋滿整個平面。" },
        { t: "不行，因為 7 和 6 不是 2 和 1 的倍數", common: true, explain: "只用 $\\vec u$ 的倍數確實到不了 $(7,6)$！但同時用兩個不平行的向量，就像有了兩個方向的格線，可以走到平面上任何地方。" },
        { t: "可以，但 $s$、$t$ 有很多組", explain: "當 $\\vec u$、$\\vec v$ 不平行時，$s$、$t$ 是<b>唯一</b>的。兩條不平行的格線，交點只有一個。" },
        { t: "只有 $s$、$t$ 是整數才行", explain: "$s$、$t$ 可以是任何實數。例如 $(1,0)=\\tfrac35\\vec u-\\tfrac15\\vec v$。" }
      ]
    },

    derive: {
      intro: "拖動 $\\vec u$、$\\vec v$ 的終點（對齊格子點），第 4 步起拖動滑桿 $s$、$t$。",
      tall: true,
      frames: [
        { cap: "向量是一個<b>位移</b>：只管方向和長度，不管從哪裡出發。從 $A$ 到 $B$ 的向量 $\\overrightarrow{AB}=(x_B-x_A,\\,y_B-y_A)$；長度用畢氏定理。平移之後的箭頭是<b>同一個</b>向量。", tex: "\\vec u=(a_1,a_2),\\quad |\\vec u|=\\sqrt{a_1^2+a_2^2}" },
        { cap: "<b>加法</b>：頭接尾，先走 $\\vec u$ 再走 $\\vec v$。兩種順序會圍出平行四邊形，所以 $\\vec u+\\vec v=\\vec v+\\vec u$。坐標是分量各自相加。", tex: "\\co{\\vec u}+\\cb{\\vec v}=(a_1+b_1,\\ a_2+b_2)" },
        { cap: "<b>係數積</b>：$r\\vec u$ 把長度變成 $|r|$ 倍，$r<0$ 時方向相反。<b>減法</b> $\\vec u-\\vec v=\\vec u+(-\\vec v)$，是從 $\\vec v$ 的終點指向 $\\vec u$ 的終點。", tex: "r\\vec u=(ra_1,ra_2),\\qquad \\co{\\vec u}-\\cb{\\vec v}=\\overrightarrow{VU}" },
        { cap: "<b>線性組合</b>：$s\\vec u+t\\vec v$。把 $\\vec u$、$\\vec v$ 的倍數當成兩組格線，就得到一張「斜格子」。只要 $\\vec u\\not\\parallel\\vec v$，斜格子蓋滿整個平面，每一點都有唯一的 $(s,t)$。", tex: "\\cg{\\vec w}=\\co s\\,\\vec u+\\cb t\\,\\vec v" },
        { cap: "<b>分點公式</b>：$P$ 在 $\\overline{AB}$ 上、$\\overline{AP}:\\overline{PB}=t:(1-t)$，則 $\\overrightarrow{OP}$ 是 $\\overrightarrow{OA}$、$\\overrightarrow{OB}$ 的線性組合，係數加起來是 1。$t=\\tfrac12$ 是中點。", tex: "\\overrightarrow{OP}=(1-t)\\overrightarrow{OA}+t\\,\\overrightarrow{OB}" }
      ],
      hint: "拖動 u（蜜桃）與 v（灰藍）的終點；最後兩步用滑桿。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 540, 440, "向量加法與線性組合");
        var gridG = s("g", {}, svg), g = s("g", {}, svg), hg = s("g", {}, svg);
        var O = [170, 330], u = 34, st = { u: [2, 1], v: [1, 3], s: 3, t: 1, r: 1.5 };
        function P(v) { return [O[0] + v[0] * u, O[1] - v[1] * u]; }
        for (var i = -5; i <= 11; i++) s("line", { x1: O[0] + i * u, y1: 0, x2: O[0] + i * u, y2: 440, class: "m-grid" }, gridG);
        for (var j = -4; j <= 10; j++) s("line", { x1: 0, y1: O[1] - j * u, x2: 540, y2: O[1] - j * u, class: "m-grid" }, gridG);
        s("line", { x1: 0, y1: O[1], x2: 540, y2: O[1], class: "m-axis" }, gridG);
        s("line", { x1: O[0], y1: 0, x2: O[0], y2: 440, class: "m-axis" }, gridG);
        var hU = SK.handle(hg, 0, 0, C.orange.s, "向量 u 的終點"), hV = SK.handle(hg, 0, 0, C.blue.s, "向量 v 的終點");
        function mk(key, hd) {
          SK.drag(svg, hd, function (x, y) {
            var v = [SK.clamp(Math.round((x - O[0]) / u), -4, 6), SK.clamp(Math.round((O[1] - y) / u), -3, 6)];
            if (v[0] || v[1]) { st[key] = v; draw(); }
          }, function () { return P(st[key]); }, u);
        }
        mk("u", hU); mk("v", hV);
        var read = SK.h("div", { class: "readout" });
        var slS = SK.slider({ label: "$s$", min: -2, max: 4, step: .25, value: st.s, onInput: function (v) { st.s = v; draw(); } });
        var slT = SK.slider({ label: "$t$", min: -2, max: 4, step: .05, value: st.t, color: "blue", onInput: function (v) { st.t = v; draw(); } });
        var slR = SK.slider({ label: "$r$", min: -2, max: 2.5, step: .25, value: st.r, color: "green", onInput: function (v) { st.r = v; draw(); } });
        ctx.sliders.appendChild(slR.el); ctx.sliders.appendChild(slS.el); ctx.sliders.appendChild(slT.el);
        ctx.extra.appendChild(read);
        function num(v) { return SK.fmt(v, 2).replace("−", "-"); }
        function vec(a, b, col, w) { var A = P(a), B = P(b); return SK.arrow(g, A[0], A[1], B[0], B[1], col, w || 3.4); }
        var lastF = -1;
        function draw() {
          var f = ctx.frame, U = st.u, V = st.v, Z = [0, 0];
          if (f !== lastF && (f === 4 || lastF === 4)) { st.t = f === 4 ? .3 : 1; slT.set(st.t, true); }
          lastF = f;
          g.innerHTML = "";
          slR.el.style.display = f === 2 ? "" : "none";
          slS.el.style.display = f === 3 ? "" : "none";
          slT.el.style.display = f >= 3 ? "" : "none";
          slT.el.querySelector("label").innerHTML = SK.md(f === 4 ? "$t$（分點）" : "$t$");
          var lines = [];
          if (f === 0) {
            [[-3, 5], [3, -2], [5, 5]].forEach(function (o) { vec(o, [o[0] + U[0], o[1] + U[1]], "rgba(184,103,74,.45)", 2.4); });
            vec(Z, U, C.orange.s);
            SK.label(g, P(U)[0] + 12, P(U)[1] - 12, "u", { it: true, color: C.orange.s });
            lines.push("\\vec u=(" + U + "),\\ \\ |\\vec u|=\\sqrt{" + (U[0] * U[0] + U[1] * U[1]) + "}\\approx" + num(Math.hypot(U[0], U[1])));
          } else if (f === 1) {
            var S = [U[0] + V[0], U[1] + V[1]];
            vec(U, S, "rgba(79,116,121,.45)", 2.4); vec(V, S, "rgba(184,103,74,.45)", 2.4);
            vec(Z, U, C.orange.s); vec(Z, V, C.blue.s); vec(Z, S, C.green.s, 4);
            SK.label(g, P(S)[0] + 12, P(S)[1] - 12, "u + v", { color: C.green.s });
            lines.push("(" + U + ")+(" + V + ")=(" + S + ")");
          } else if (f === 2) {
            var R = [st.r * U[0], st.r * U[1]];
            vec(Z, U, C.orange.s, 5); vec(Z, R, C.purple.s, 2.6);
            SK.label(g, P(R)[0] + 12, P(R)[1] + 14, "r u", { color: C.purple.s });
            vec(Z, V, C.blue.s); vec(V, U, C.pink.s, 3);
            var mid = P([(U[0] + V[0]) / 2, (U[1] + V[1]) / 2]);
            SK.label(g, mid[0] + 12, mid[1] - 8, "u − v", { color: C.pink.s, anchor: "start" });
            lines.push(num(st.r) + "(" + U + ")=(" + num(R[0]) + "," + num(R[1]) + ")");
            lines.push("\\vec u-\\vec v=(" + (U[0] - V[0]) + "," + (U[1] - V[1]) + ")");
          } else if (f === 3) {
            var det = U[0] * V[1] - U[1] * V[0];
            if (det !== 0) for (var k = -8; k <= 8; k++) {
              var a1 = P([k * U[0] - 10 * V[0], k * U[1] - 10 * V[1]]), a2 = P([k * U[0] + 10 * V[0], k * U[1] + 10 * V[1]]);
              var b1 = P([k * V[0] - 10 * U[0], k * V[1] - 10 * U[1]]), b2 = P([k * V[0] + 10 * U[0], k * V[1] + 10 * U[1]]);
              s("line", { x1: a1[0], y1: a1[1], x2: a2[0], y2: a2[1], stroke: C.blue.s, "stroke-width": .9, opacity: .35 }, g);
              s("line", { x1: b1[0], y1: b1[1], x2: b2[0], y2: b2[1], stroke: C.orange.s, "stroke-width": .9, opacity: .35 }, g);
            }
            var sU = [st.s * U[0], st.s * U[1]], W = [sU[0] + st.t * V[0], sU[1] + st.t * V[1]];
            vec(Z, sU, C.orange.s, 3); vec(sU, W, C.blue.s, 3); vec(Z, W, C.green.s, 4);
            vec(Z, U, C.orange.s, 5); vec(Z, V, C.blue.s, 5);
            SK.label(g, P(W)[0] + 12, P(W)[1] - 12, "w", { it: true, color: C.green.s });
            lines.push(num(st.s) + "(" + U + ")+" + num(st.t) + "(" + V + ")=(" + num(W[0]) + "," + num(W[1]) + ")");
            if (det === 0) lines.push("\\vec u\\parallel\\vec v：\\text{只能走在一條直線上}");
          } else {
            var t = st.t, Pp = [(1 - t) * U[0] + t * V[0], (1 - t) * U[1] + t * V[1]];
            var A = P(U), B = P(V), Q = P(Pp), Oo = P(Z);
            s("line", { x1: A[0] + (A[0] - B[0]) * 2, y1: A[1] + (A[1] - B[1]) * 2, x2: B[0] + (B[0] - A[0]) * 2, y2: B[1] + (B[1] - A[1]) * 2, stroke: C.line, "stroke-dasharray": "4 5" }, g);
            s("line", { x1: A[0], y1: A[1], x2: B[0], y2: B[1], stroke: C.ink, "stroke-width": 2 }, g);
            vec(Z, U, C.orange.s, 3); vec(Z, V, C.blue.s, 3); vec(Z, Pp, C.green.s, 3.6);
            s("circle", { cx: Q[0], cy: Q[1], r: 6, fill: C.green.s }, g);
            SK.label(g, A[0] + 12, A[1] + 12, "A", { it: true, color: C.orange.s }); SK.label(g, B[0] - 12, B[1] - 12, "B", { it: true, color: C.blue.s });
            SK.label(g, Q[0] + 12, Q[1] - 12, "P", { it: true, color: C.green.s });
            SK.label(g, Oo[0] - 12, Oo[1] + 14, "O", { it: true });
            lines.push("\\overrightarrow{OP}=" + num(1 - t) + "\\overrightarrow{OA}+" + num(t) + "\\overrightarrow{OB}=(" + num(Pp[0]) + "," + num(Pp[1]) + ")");
            lines.push(t >= 0 && t <= 1 ? "\\overline{AP}:\\overline{PB}=" + num(t) + ":" + num(1 - t) : "t<0\\ \\text{或}\\ t>1：P\\ \\text{在線段外}");
          }
          var Up = P(U), Vp = P(V);
          hU.moveTo(Up[0], Up[1]); hV.moveTo(Vp[0], Vp[1]);
          hV.style.display = f === 0 ? "none" : "";
          if (f >= 1 && f <= 3) {
            SK.label(g, Up[0] + 14, Up[1] + 12, "u", { it: true, color: C.orange.s, anchor: "start" });
            SK.label(g, Vp[0] - 12, Vp[1] - 12, "v", { it: true, color: C.blue.s });
          }
          read.innerHTML = lines.map(function (t) { return SK.tex(t, true); }).join("");
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "解聯立方程式 = 找斜格子的坐標", icon: "sparkle",
        html: "求 $s(2,1)+t(1,3)=(7,6)$，拆開分量就是 $\\begin{cases}2s+t=7\\\\s+3t=6\\end{cases}$。所以二元一次聯立方程式，其實是在問「$(7,6)$ 在 $\\vec u,\\vec v$ 的斜格子上是哪一格」。係數行列式為 0，就是兩個向量平行、斜格子壓扁成一條線。" },
      { title: "重心：三個頂點的平均", icon: "leaf",
        html: "三角形 $ABC$ 的重心 $G$ 滿足 $\\overrightarrow{OG}=\\tfrac13(\\overrightarrow{OA}+\\overrightarrow{OB}+\\overrightarrow{OC})$，坐標就是三頂點坐標的平均。用分點公式：$G$ 在中線上，把中線分成 $2:1$。" }
    ],

    challenges: [
      { q: "$A(1,2)$、$B(7,5)$，$P$ 在 $\\overline{AB}$ 上且 $\\overline{AP}:\\overline{PB}=1:2$，求 $P$。", idea: "$t=\\tfrac13$：$P=\\tfrac23(1,2)+\\tfrac13(7,5)=(3,3)$。" },
      { q: "把 $(1,0)$ 寫成 $s(2,1)+t(1,3)$。", idea: "$2s+t=1$、$s+3t=0$，得 $s=\\tfrac35$、$t=-\\tfrac15$。" },
      { q: "平行四邊形 $ABCD$ 中，$\\overrightarrow{AB}=\\vec u$、$\\overrightarrow{AD}=\\vec v$。兩條對角線向量是什麼？它們互相平分嗎？", idea: "$\\overrightarrow{AC}=\\vec u+\\vec v$、$\\overrightarrow{BD}=\\vec v-\\vec u$。$\\overline{AC}$ 的中點是 $\\tfrac12(\\vec u+\\vec v)$，$\\overline{BD}$ 的中點是 $\\vec u+\\tfrac12(\\vec v-\\vec u)=\\tfrac12(\\vec u+\\vec v)$，同一點，所以互相平分。" }
    ],

    where: {
      codes: [["G-11A-1", "平面向量：坐標表示、係數積、加減、線性組合；以位置向量與線性組合為主"], ["G-11B-1", "平面向量：坐標向量的係數積、加減與線性組合（服務坐標幾何與矩陣資料表）"]],
      exam: "11 年級<b>數學 A</b> 與<b>數學 B</b> 都有，學測兩科都考。數 A 接著學內積、行列式；數 B 接著學內積與矩陣。",
      stop: "數 B 不觸及基底、線性相關／獨立等名詞；數 A 也以「兩不平行向量可表示平面上任一向量」的直觀為主，不做抽象的向量空間。"
    }
  });
})();
