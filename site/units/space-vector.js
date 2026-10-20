/* 單元：空間向量與內積 */
(function () {
  var C = SK.C, s = SK.s;

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 250, "空中兩根竿子的夾角");
    var v = SK.view3d(svg, { cx: 190, cy: 175, scale: 30, yaw: -125, pitch: 20 });
    var g = s("g", {}, svg);
    v.poly(g, [[-1, -1, 0], [5, -1, 0], [5, 5, 0], [-1, 5, 0]], { fill: C.gold.f, stroke: "none" });
    v.axes(g, 5);
    v.arrow(g, [0, 0, 0], [4, 1, 2], C.orange.s, 3.4);
    v.arrow(g, [0, 0, 0], [1, 3, 3], C.blue.s, 3.4);
    SK.label(svg, 200, 238, "看不到「平面」，夾角要怎麼量？", { size: 13, color: C.soft });
  }

  SK.mountUnit({
    slug: "space-vector",
    en: "One more component, same ideas",
    formula: "\\co{\\vec a}\\cdot\\cb{\\vec b}=a_1b_1+a_2b_2+a_3b_3=|\\vec a||\\vec b|\\cos\\theta,\\qquad (\\vec a\\cdot\\vec b)^2\\le|\\vec a|^2|\\vec b|^2",

    hook: {
      html: "空中有兩根從同一點伸出去的竿子，方向是 $(4,1,2)$ 和 $(1,3,3)$。",
      ask: "它們的夾角是多少？手邊沒有量角器，也找不到一個平面把它們畫下來。",
      visual: hookVisual
    },

    guess: {
      q: "$\\vec a=(1,2,2)$、$\\vec b=(2,-2,1)$。它們的夾角是？",
      options: [
        { t: "$90^\\circ$", truth: true, explain: "$\\vec a\\cdot\\vec b=2-4+2=0$，內積為 0 就是垂直。在空間裡，這是判斷垂直最快的方法。" },
        { t: "看不出來，要畫圖量", common: true, explain: "空間的圖很難畫準，這正是內積派上用場的地方：只要算三個乘積相加，就能知道角度。" },
        { t: "$45^\\circ$", explain: "$\\cos\\theta=\\tfrac{\\vec a\\cdot\\vec b}{|\\vec a||\\vec b|}=\\tfrac{0}{3\\times3}=0$，所以是 $90^\\circ$，不是 $45^\\circ$。" },
        { t: "$0^\\circ$", explain: "夾角 $0^\\circ$ 代表同方向，分量要成比例。$(1,2,2)$ 和 $(2,-2,1)$ 顯然不成比例。" }
      ]
    },

    derive: {
      intro: "拖動滑桿改 $\\vec b$ 的三個分量（$\\vec a=(3,1,2)$ 固定）；在圖上按住拖曳可以旋轉。",
      tall: true,
      frames: [
        { cap: "空間向量多了一個分量，其他都一樣：加法頭接尾、分量相加；係數積把每個分量乘同一個數。長度是兩次畢氏定理。", tex: "\\begin{aligned}\\vec a+\\vec b&=(a_1+b_1,\\,a_2+b_2,\\,a_3+b_3)\\\\|\\vec a|&=\\sqrt{a_1^2+a_2^2+a_3^2}\\end{aligned}" },
        { cap: "<b>線性組合</b> $s\\vec a+t\\vec b$：兩個不平行的向量張出一個<b>平面</b>，所有組合都落在這個平面上。要到達空間中任何一點，需要第三個不在這平面上的向量。", tex: "s\\,\\co{\\vec a}+t\\,\\cb{\\vec b}\\ \\in\\ \\text{兩向量張出的平面}" },
        { cap: "<b>內積</b>：兩個向量不管在空間怎麼擺，總是在同一個平面上（它們張出的平面）。在那個平面裡，內積就是平面上學過的 $|\\vec a||\\vec b|\\cos\\theta$；用坐標算，就是對應分量相乘再相加。", tex: "\\cos\\theta=\\frac{a_1b_1+a_2b_2+a_3b_3}{|\\vec a|\\,|\\vec b|}" },
        { cap: "<b>正射影</b>：$\\vec b$ 在 $\\vec a$ 方向上的影子。<b>垂直</b>：內積為 0；<b>平行</b>：分量成比例。", tex: "\\text{proj}_{\\vec a}\\vec b=\\frac{\\vec a\\cdot\\vec b}{|\\vec a|^2}\\vec a,\\quad \\vec a\\perp\\vec b\\iff\\vec a\\cdot\\vec b=0" },
        { cap: "<b>柯西不等式</b>：因為 $|\\cos\\theta|\\le1$，所以 $|\\vec a\\cdot\\vec b|\\le|\\vec a||\\vec b|$。平方後寫成分量，就是柯西不等式；等號成立 $\\iff$ 兩向量平行。", tex: "\\begin{aligned}&(a_1b_1+a_2b_2+a_3b_3)^2\\\\&\\le(a_1^2+a_2^2+a_3^2)(b_1^2+b_2^2+b_3^2)\\end{aligned}" }
      ],
      hint: "按住圖形拖曳可以旋轉視角。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 540, 440, "空間向量");
        var g = s("g", {}, svg);
        var v = SK.view3d(svg, { cx: 250, cy: 280, scale: 46, yaw: 23, pitch: 40, onRotate: function () { draw(); } });
        var A = [3, 1, 2], st = { b: [1, 3, 3], s: 1, t: 1 };
        var read = SK.h("div", { class: "readout" });
        var sb = ["$b_1$", "$b_2$", "$b_3$"].map(function (lab, k) {
          var o = SK.slider({ label: lab, min: -3, max: 4, step: .5, value: st.b[k], color: ["", "blue", "green"][k], onInput: function (x) { st.b[k] = x; draw(); } });
          ctx.sliders.appendChild(o.el); return o;
        });
        var ss = SK.slider({ label: "$s$", min: -1.5, max: 1.5, step: .1, value: 1, onInput: function (x) { st.s = x; draw(); } });
        var stt = SK.slider({ label: "$t$", min: -1.5, max: 1.5, step: .1, value: 1, color: "blue", onInput: function (x) { st.t = x; draw(); } });
        ctx.sliders.appendChild(ss.el); ctx.sliders.appendChild(stt.el);
        ctx.extra.appendChild(read);
        function num(x) { return SK.fmt(x, 2).replace("−", "-"); }
        function dot(p, q) { return p[0] * q[0] + p[1] * q[1] + p[2] * q[2]; }
        function len(p) { return Math.sqrt(dot(p, p)); }
        function add(p, q, k) { k = k == null ? 1 : k; return [p[0] + k * q[0], p[1] + k * q[1], p[2] + k * q[2]]; }
        function sc(p, k) { return [p[0] * k, p[1] * k, p[2] * k]; }
        function vs(p) { return "(" + p.map(num).join(",") + ")"; }
        function draw() {
          var f = ctx.frame, B = st.b, Z = [0, 0, 0];
          g.innerHTML = "";
          sb.forEach(function (o) { o.el.style.display = f === 1 ? "none" : ""; });
          ss.el.style.display = stt.el.style.display = f === 1 ? "" : "none";
          v.poly(g, [[-3, -3, 0], [5, -3, 0], [5, 5, 0], [-3, 5, 0]], { fill: "rgba(241,226,184,.3)", stroke: "none" });
          v.axes(g, 5.3, 3);
          var lines = [], d = dot(A, B), la = len(A), lb = len(B);
          if (f === 0) {
            var S = add(A, B);
            v.line(g, A, S, { stroke: C.blue.s, "stroke-dasharray": "4 4" }); v.line(g, B, S, { stroke: C.orange.s, "stroke-dasharray": "4 4" });
            v.arrow(g, Z, S, C.green.s, 3.6);
            var Sp = v.P(S); SK.label(g, Sp[0] + 10, Sp[1] - 10, "a+b", { size: 13, color: C.green.s, anchor: "start" });
            lines.push("\\vec a+\\vec b=" + vs(S) + ",\\ \\ |\\vec b|=" + num(lb));
          }
          if (f === 1) {
            // 張出的平面：畫一片平行四邊形網格
            for (var k = -2; k <= 2; k++) {
              v.line(g, add(sc(A, k * .75), B, -1.5), add(sc(A, k * .75), B, 1.5), { stroke: C.purple.s, "stroke-width": .8, opacity: .5 });
              v.line(g, add(sc(B, k * .75), A, -1.5), add(sc(B, k * .75), A, 1.5), { stroke: C.purple.s, "stroke-width": .8, opacity: .5 });
            }
            v.poly(g, [add(sc(A, -1.5), B, -1.5), add(sc(A, 1.5), B, -1.5), add(sc(A, 1.5), B, 1.5), add(sc(A, -1.5), B, 1.5)], { fill: C.purple.f, stroke: "none", opacity: .5 });
            var W = add(sc(A, st.s), B, st.t);
            v.arrow(g, Z, sc(A, st.s), C.orange.s, 2.4); v.arrow(g, sc(A, st.s), W, C.blue.s, 2.4);
            v.arrow(g, Z, W, C.green.s, 3.8);
            lines.push(num(st.s) + "\\vec a+" + num(st.t) + "\\vec b=" + vs(W));
          }
          v.arrow(g, Z, A, C.orange.s, 3.8); v.arrow(g, Z, B, C.blue.s, 3.8);
          var Ap = v.P(A), Bp = v.P(B);
          SK.label(g, Ap[0] + 12, Ap[1] + 4, "a", { it: true, color: C.orange.s, anchor: "start" });
          SK.label(g, Bp[0] + 12, Bp[1] - 8, "b", { it: true, color: C.blue.s, anchor: "start" });
          if (f >= 2 && lb > 1e-9) {
            var cos = d / (la * lb), th = Math.acos(SK.clamp(cos, -1, 1));
            // 夾角弧：在 a、b 張出的平面上
            var ua = sc(A, 1 / la), w = add(sc(B, 1 / lb), ua, -cos), lw = len(w), arc = [];
            if (lw > 1e-6) { w = sc(w, 1 / lw); for (var i = 0; i <= 20; i++) { var t = th * i / 20; arc.push(v.P(add(sc(ua, .9 * Math.cos(t)), w, .9 * Math.sin(t)))); } s("path", { d: "M" + arc.join(" L"), fill: "none", stroke: C.pink.s, "stroke-width": 2 }, g); }
            if (f === 3) {
              var pr = sc(A, d / (la * la));
              v.line(g, B, pr, { stroke: C.pink.s, "stroke-dasharray": "5 4", "stroke-width": 1.6 });
              v.arrow(g, Z, pr, C.purple.s, 5);
              var Pp = v.P(pr); SK.label(g, Pp[0], Pp[1] + 18, "b 在 a 上的正射影", { size: 12, color: C.purple.s });
              lines.push("\\text{proj}=\\frac{" + num(d) + "}{" + num(la * la) + "}\\vec a=" + vs(pr));
              var par = Math.abs(Math.abs(cos) - 1) < 1e-9;
              lines.push(Math.abs(d) < 1e-9 ? "\\vec a\\cdot\\vec b=0\\ \\Rightarrow\\ \\vec a\\perp\\vec b" : par ? "\\vec b\\parallel\\vec a" : "\\vec a\\cdot\\vec b=" + num(d));
            } else if (f === 2) {
              lines.push("\\vec a\\cdot\\vec b=3(" + num(B[0]) + ")+1(" + num(B[1]) + ")+2(" + num(B[2]) + ")=" + num(d));
              lines.push("\\cos\\theta=\\frac{" + num(d) + "}{" + num(la) + "\\times" + num(lb) + "}=" + num(cos) + ",\\ \\theta\\approx" + num(SK.deg(th)) + "^\\circ");
            } else {
              var L = d * d, R = la * la * lb * lb;
              lines.push(num(d) + "^2=" + num(L) + "\\ \\le\\ " + num(la * la) + "\\times" + num(lb * lb) + "=" + num(R));
              // 長條比較
              var bx = 430, by = 410, hmax = 150, m = Math.max(R, 1);
              [[L, C.pink, "(a·b)²"], [R, C.gold, "|a|²|b|²"]].forEach(function (q, k) {
                var h = q[0] / m * hmax;
                s("rect", { x: bx + k * 46, y: by - h, width: 30, height: h, fill: q[1].f, stroke: q[1].s }, g);
                SK.label(g, bx + k * 46 + 15, by + 14, q[2], { size: 11, color: q[1].s });
              });
              if (Math.abs(L - R) < 1e-9) lines.push("\\text{等號成立：}\\vec a\\parallel\\vec b");
            }
          }
          read.innerHTML = lines.map(function (t) { return SK.tex(t, true); }).join("");
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "柯西不等式求最大值", icon: "sparkle",
        html: "$x^2+y^2+z^2=9$ 時，$x+2y+2z$ 最大是多少？把它看成 $(1,2,2)\\cdot(x,y,z)$，內積最大是長度相乘 $3\\times3=9$，發生在 $(x,y,z)$ 和 $(1,2,2)$ 同方向，也就是 $(1,2,2)$ 本身。代數題變成「兩個箭頭什麼時候對齊」。" },
      { title: "相關係數為什麼在 −1 到 1 之間（延伸）", icon: "leaf",
        html: "把兩組資料減去平均後，當成兩個（很多維的）向量 $\\vec x$、$\\vec y$，相關係數 $r=\\tfrac{\\vec x\\cdot\\vec y}{|\\vec x||\\vec y|}$ 就是它們夾角的餘弦。柯西不等式保證 $|r|\\le1$，而 $r=\\pm1$ 正好是兩向量平行：資料完全落在一條直線上。" }
    ],

    challenges: [
      { q: "$\\vec a=(1,1,0)$、$\\vec b=(1,0,1)$ 的夾角是多少？", idea: "$\\cos\\theta=\\tfrac{1}{\\sqrt2\\sqrt2}=\\tfrac12$，$\\theta=60^\\circ$。在正立方體上，這是兩條面對角線的夾角，它們和另一條面對角線構成正三角形。" },
      { q: "$(2,k,-1)$ 和 $(k,3,4)$ 垂直，求 $k$。", idea: "$2k+3k-4=0$，$k=\\tfrac45$。" },
      { q: "$2x+y-2z=6$ 時，$x^2+y^2+z^2$ 的最小值是多少？", hint: "柯西：$(2x+y-2z)^2\\le(4+1+4)(x^2+y^2+z^2)$。", idea: "$36\\le9(x^2+y^2+z^2)$，最小值 4。幾何意義：原點到平面 $2x+y-2z=6$ 的距離是 2，距離的平方是 4。" }
    ],

    where: {
      codes: [["G-11A-3", "空間向量：坐標表示、係數積、加減、線性組合"], ["G-11A-7", "空間向量的運算：正射影與內積、平行與垂直的判定、柯西不等式（外積見下一個單元）；以柯西不等式解釋相關係數範圍為延伸"]],
      exam: "11 年級<b>數學 A</b>，學測數 A、分科數甲都在範圍內。用柯西不等式解釋相關係數範圍標為 ※ 延伸，不列入考試。",
      stop: "內積的計算、夾角、正射影、垂直與平行、柯西不等式的基本應用就夠了。高維向量空間、內積空間的公理不是高中範圍。"
    }
  });
})();
