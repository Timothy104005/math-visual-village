/* 單元：平面方程式 */
(function () {
  var C = SK.C, s = SK.s;

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 250, "斜板與垂直它的釘子");
    var v = SK.view3d(svg, { cx: 200, cy: 150, scale: 30, yaw: -120, pitch: 22 });
    var g = s("g", {}, svg);
    v.poly(g, [[-2, -2, -.8], [3, -2, 1.2], [3, 3, 1.2], [-2, 3, -.8]], { fill: C.gold.f, stroke: C.cocoa });
    v.arrow(g, [.5, .5, .2], [-.3, .5, 2.2], C.green.s, 3.6);
    v.dot(g, [.5, .5, .2], C.cocoa, 4);
    SK.label(svg, 200, 236, "一根垂直的釘子，就決定了整塊板子的方向", { size: 13, color: C.soft });
  }

  SK.mountUnit({
    slug: "plane-equation",
    en: "One normal vector sets the direction",
    formula: "\\cg{\\vec n}=(a,b,c)\\ \\perp\\ E\\iff E:\\ ax+by+cz=d,\\qquad d(Q,E)=\\frac{|ax_0+by_0+cz_0-d|}{\\sqrt{a^2+b^2+c^2}}",

    hook: {
      html: "一塊平板可以往各種方向傾斜。可是只要在板上釘一根和它<b>垂直</b>的釘子，板子的方向就被固定了。",
      ask: "怎麼用「一根釘子」加上「一個點」寫出整個平面的方程式？",
      visual: hookVisual
    },

    guess: {
      q: "平面 $2x-y+2z=5$ 的法向量是？",
      options: [
        { t: "$(2,-1,2)$", truth: true, explain: "$x,y,z$ 的係數直接就是法向量。因為平面上任兩點相減得到的向量 $\\vec v$，都滿足 $2v_1-v_2+2v_3=0$，也就是 $(2,-1,2)\\cdot\\vec v=0$。" },
        { t: "$(2,-1,2,5)$", explain: "向量在空間裡只有三個分量。常數 5 決定平面的位置（離原點多遠），不影響方向。" },
        { t: "平面上的點 $(0,0,\\tfrac52)$", common: true, explain: "它確實在平面上！但法向量是平面的「方向」，不是位置。從係數就讀得出來。" },
        { t: "要先找三個點才知道", explain: "三個點可以找出平面，但反過來，已經有方程式時，法向量就寫在係數上了。" }
      ]
    },

    derive: {
      intro: "拖動滑桿改法向量 $(a,b,c)$ 與常數 $d$；在圖上按住拖曳可以旋轉。",
      tall: true,
      frames: [
        { cap: "平面 $E$ 過點 $P_0$、法向量 $\\vec n$。點 $P$ 在平面上，就是 $\\overrightarrow{P_0P}$ 躺在平面裡，也就是和 $\\vec n$ 垂直。", tex: "P\\in E\\iff \\vec n\\cdot\\overrightarrow{P_0P}=0" },
        { cap: "展開 $a(x-x_0)+b(y-y_0)+c(z-z_0)=0$，就得到平面的一般式。係數 $(a,b,c)$ 是方向，常數 $d$ 決定位置：$d$ 改變時，平面沿著 $\\vec n$ 平移。", tex: "ax+by+cz=d,\\ \\ d=ax_0+by_0+cz_0" },
        { cap: "給三個不共線的點 $A,B,C$：兩個邊向量的<b>外積</b>就是法向量，再代入一點求 $d$。", tex: "\\vec n=\\overrightarrow{AB}\\times\\overrightarrow{AC}" },
        { cap: "<b>兩平面的夾角</b>：看兩個法向量的夾角 $\\theta$。兩平面的夾角是 $\\theta$ 或 $180^\\circ-\\theta$（兩面角有兩個互補的值）。法向量垂直 $\\iff$ 平面垂直；法向量平行 $\\iff$ 平面平行或重合。", tex: "\\cos\\theta=\\frac{\\vec n_1\\cdot\\vec n_2}{|\\vec n_1||\\vec n_2|}" },
        { cap: "<b>點到平面的距離</b>：從平面上任一點 $P_0$ 到 $Q$ 的向量，在 $\\vec n$ 方向上的正射影長，就是垂線長。", tex: "\\begin{aligned}d(Q,E)&=\\frac{|\\vec n\\cdot\\overrightarrow{P_0Q}|}{|\\vec n|}\\\\&=\\frac{|ax_0+by_0+cz_0-d|}{\\sqrt{a^2+b^2+c^2}}\\end{aligned}" }
      ],
      hint: "按住圖形拖曳旋轉，從側面看最容易看出垂直。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 540, 440, "平面與法向量");
        var g = s("g", {}, svg);
        var v = SK.view3d(svg, { cx: 250, cy: 270, scale: 44, yaw: -62, pitch: 22, onRotate: function () { draw(); } });
        var st = { n: [1, 1, 2], d: 4 }, Q = [3, 2.5, 3.5], A = [2, 0, 1], B = [0, 2, 1], Cc = [0, 0, 2];
        var read = SK.h("div", { class: "readout" });
        var sn = ["$a$", "$b$", "$c$"].map(function (lab, k) {
          var o = SK.slider({ label: lab, min: -2, max: 3, step: .5, value: st.n[k], color: ["", "blue", "green"][k], onInput: function (x) { st.n[k] = x; draw(); } });
          ctx.sliders.appendChild(o.el); return o;
        });
        var sd = SK.slider({ label: "$d$", min: -4, max: 8, step: .5, value: st.d, color: "", onInput: function (x) { st.d = x; draw(); } });
        ctx.sliders.appendChild(sd.el);
        ctx.extra.appendChild(read);
        function num(x) { return SK.fmt(x, 2).replace("−", "-"); }
        function dot(p, q) { return p[0] * q[0] + p[1] * q[1] + p[2] * q[2]; }
        function len(p) { return Math.sqrt(dot(p, p)); }
        function add(p, q, k) { k = k == null ? 1 : k; return [p[0] + k * q[0], p[1] + k * q[1], p[2] + k * q[2]]; }
        function sc(p, k) { return [p[0] * k, p[1] * k, p[2] * k]; }
        function cross(p, q) { return [p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0]]; }
        function vs(p) { return "(" + p.map(num).join(",") + ")"; }
        function basis(n) {
          var t = Math.abs(n[2]) < .9 * len(n) ? [0, 0, 1] : [1, 0, 0];
          var u1 = cross(n, t); u1 = sc(u1, 1 / len(u1));
          var u2 = cross(n, u1); u2 = sc(u2, 1 / len(u2));
          return [u1, u2];
        }
        function plane(n, d, fill, R) {
          var ln2 = dot(n, n), P0 = sc(n, d / ln2), bs = basis(n); R = R || 3;
          var pts = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(function (q) { return add(add(P0, bs[0], q[0] * R), bs[1], q[1] * R); });
          v.poly(g, pts, { fill: fill, stroke: C.line, opacity: .85 });
          for (var k = -2; k <= 2; k++) {
            v.line(g, add(add(P0, bs[0], k * R / 2.5), bs[1], -R), add(add(P0, bs[0], k * R / 2.5), bs[1], R), { stroke: C.line, "stroke-width": .6 });
            v.line(g, add(add(P0, bs[1], k * R / 2.5), bs[0], -R), add(add(P0, bs[1], k * R / 2.5), bs[0], R), { stroke: C.line, "stroke-width": .6 });
          }
          return P0;
        }
        function eq(n, d) {
          var t = "", first = true;
          [[n[0], "x"], [n[1], "y"], [n[2], "z"]].forEach(function (p) {
            if (Math.abs(p[0]) < 1e-9) return;
            t += (p[0] < 0 ? "-" : first ? "" : "+") + (Math.abs(Math.abs(p[0]) - 1) < 1e-9 ? "" : num(Math.abs(p[0]))) + p[1]; first = false;
          });
          return (t || "0") + "=" + num(d);
        }
        function draw() {
          var f = ctx.frame, n = st.n, d = st.d, Z = [0, 0, 0];
          g.innerHTML = "";
          var degenerate = len(n) < 1e-9;
          sn.forEach(function (o) { o.el.style.display = f === 2 ? "none" : ""; });
          sd.el.style.display = f === 2 || f === 3 ? "none" : "";
          v.axes(g, 4.6, 2);
          var lines = [];
          if (f === 2) {
            var AB = add(B, A, -1), AC = add(Cc, A, -1), N = cross(AB, AC), dd = dot(N, A);
            plane(N, dd, C.gold.f, 3);
            v.poly(g, [A, B, Cc], { fill: C.orange.f, stroke: C.orange.s, "stroke-width": 1.6 });
            v.arrow(g, A, B, C.orange.s, 3); v.arrow(g, A, Cc, C.blue.s, 3);
            v.arrow(g, A, add(A, sc(N, .5)), C.green.s, 3.6);
            [[A, "A"], [B, "B"], [Cc, "C"]].forEach(function (q) { v.dot(g, q[0], C.ink, 4); var p = v.P(q[0]); SK.label(g, p[0] + 10, p[1] + 12, q[1], { it: true }); });
            lines.push("\\overrightarrow{AB}\\times\\overrightarrow{AC}=" + vs(AB) + "\\times" + vs(AC) + "=" + vs(N));
            lines.push(eq(N, dd));
            read.innerHTML = lines.map(function (t) { return SK.tex(t, true); }).join("");
            return;
          }
          if (degenerate) { read.innerHTML = SK.tex("\\vec n=\\vec 0：\\text{不是平面}", true); return; }
          var P0 = plane(n, d, C.gold.f, 3);
          var nu = sc(n, 1.6 / len(n));
          v.arrow(g, P0, add(P0, nu), C.green.s, 4);
          var Np = v.P(add(P0, nu)); SK.label(g, Np[0] + 10, Np[1] - 6, "n", { it: true, color: C.green.s, anchor: "start" });
          v.dot(g, P0, C.cocoa, 4.5);
          var P0p = v.P(P0); SK.label(g, P0p[0] - 10, P0p[1] + 14, "P₀", { size: 13, anchor: "end" });
          if (f === 0) {
            var bs = basis(n), P = add(add(P0, bs[0], 2), bs[1], 1.2);
            v.arrow(g, P0, P, C.orange.s, 3);
            v.dot(g, P, C.orange.s, 5);
            var Pp = v.P(P); SK.label(g, Pp[0] + 10, Pp[1], "P", { it: true, color: C.orange.s, anchor: "start" });
            lines.push("\\vec n\\cdot\\overrightarrow{P_0P}=" + num(dot(n, add(P, P0, -1))));
          }
          if (f === 1) lines.push(eq(n, d));
          if (f === 3) {
            var n2 = [0, 0, 1], d2 = 0;
            plane(n2, d2, "rgba(157,181,178,.35)", 3.4);
            v.arrow(g, Z, [0, 0, 1.6], C.blue.s, 3.4);
            var cos = dot(n, n2) / len(n), th = SK.deg(Math.acos(SK.clamp(cos, -1, 1)));
            lines.push(eq(n, d) + "\\ \\text{與}\\ z=0");
            lines.push("\\cos\\theta=\\frac{" + num(dot(n, n2)) + "}{" + num(len(n)) + "}\\Rightarrow\\theta\\approx" + num(th) + "^\\circ" + (Math.abs(cos) < 1e-9 ? "\\ (\\text{垂直})" : ""));
          }
          if (f === 4) {
            var dist = (dot(n, Q) - d) / len(n), foot = add(Q, sc(n, -dist / len(n)));
            v.line(g, Q, foot, { stroke: C.pink.s, "stroke-width": 3 });
            v.line(g, P0, Q, { stroke: C.purple.s, "stroke-dasharray": "5 4" });
            v.dot(g, Q, C.pink.s, 6); v.dot(g, foot, C.pink.s, 4);
            var Qp = v.P(Q); SK.label(g, Qp[0] + 10, Qp[1] - 8, "Q(3, 2.5, 3.5)", { size: 12, color: C.pink.s, anchor: "start" });
            lines.push("d(Q,E)=\\frac{|" + num(dot(n, Q)) + "-" + num(d) + "|}{" + num(len(n)) + "}=" + num(Math.abs(dist)));
          }
          if (f <= 1) lines.push("\\vec n=" + vs(n) + ",\\ \\ P_0=" + vs(P0));
          read.innerHTML = lines.map(function (t) { return SK.tex(t, true); }).join("");
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "截距式：一眼看出平面在哪", icon: "sparkle",
        html: "平面和三軸交在 $(p,0,0)$、$(0,q,0)$、$(0,0,r)$ 時，方程式可以寫成 $\\tfrac xp+\\tfrac yq+\\tfrac zr=1$。例如 $\\tfrac x2+\\tfrac y4+\\tfrac z3=1$：在三軸上各點一個點，連成三角形，就把平面畫出來了。" },
      { title: "和平面上的直線是同一個樣子", icon: "leaf",
        html: "平面上的直線 $ax+by=c$，係數 $(a,b)$ 是法向量，點到直線距離是 $\\tfrac{|ax_0+by_0-c|}{\\sqrt{a^2+b^2}}$。升一維，平面 $ax+by+cz=d$ 的法向量和距離公式，長得一模一樣：多一個分量而已。" }
    ],

    challenges: [
      { q: "求過 $(1,2,3)$ 且與 $2x-y+z=0$ 平行的平面。", idea: "法向量相同 $(2,-1,1)$：$2x-y+z=2-2+3=3$。" },
      { q: "兩平行平面 $x+2y+2z=3$ 和 $x+2y+2z=12$ 的距離是？", idea: "在第一個平面上取 $(3,0,0)$，代入：$\\tfrac{|3-12|}{3}=3$。或直接 $\\tfrac{|12-3|}{\\sqrt{1+4+4}}=3$。" },
      { q: "平面 $x+y=1$ 和 $y+z=1$ 的夾角是多少？", idea: "法向量 $(1,1,0)$、$(0,1,1)$，$\\cos\\theta=\\tfrac12$，$\\theta=60^\\circ$，所以兩平面的夾角是 $60^\\circ$（或 $120^\\circ$）。" }
    ],

    where: {
      codes: [["G-11A-9", "平面方程式：法向量與平面的一般式、兩平面的夾角、點到平面的距離"]],
      exam: "11 年級<b>數學 A</b>，學測數 A、分科數甲都在範圍內。",
      stop: "法向量、一般式、夾角、點到平面距離就夠了。平面族（過兩平面交線的平面系）等技巧不是課綱重點。"
    }
  });
})();
