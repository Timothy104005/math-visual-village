/* 單元：空間中的直線 */
(function () {
  var C = SK.C, s = SK.s;

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 250, "飛機的航線");
    var v = SK.view3d(svg, { cx: 190, cy: 170, scale: 28, yaw: -125, pitch: 20 });
    var g = s("g", {}, svg);
    v.poly(g, [[-2, -2, 0], [6, -2, 0], [6, 6, 0], [-2, 6, 0]], { fill: C.gold.f, stroke: "none" });
    v.line(g, [-1, -1, .3], [5, 5, 4], { stroke: C.blue.s, "stroke-width": 2, "stroke-dasharray": "6 5" });
    [0, 1, 2].forEach(function (k) { v.dot(g, [0 + k * 1.6, 0 + k * 1.6, 1 + k * 1.1], C.orange.s, 5); });
    v.arrow(g, [0, 0, 1], [1.6, 1.6, 2.1], C.orange.s, 3);
    SK.label(svg, 200, 236, "每秒往同一個方向前進同樣多", { size: 13, color: C.soft });
  }

  SK.mountUnit({
    slug: "space-line",
    en: "A starting point plus t times a direction",
    formula: "L:\\ P=\\co A+t\\,\\cb{\\vec d}\\iff \\frac{x-x_0}{d_1}=\\frac{y-y_0}{d_2}=\\frac{z-z_0}{d_3}",

    hook: {
      html: "飛機從某個位置出發，每秒往同一個方向移動同樣的距離，它在空中留下一條直線。",
      ask: "在空間裡，一條直線沒辦法寫成 $y=mx+b$。那要怎麼用式子描述它？",
      visual: hookVisual
    },

    guess: {
      q: "直線 $P=(1,0,2)+t(2,1,-1)$ 和平面 $z=0$ 交在哪裡？",
      options: [
        { t: "$(5,2,0)$", truth: true, explain: "$z=2-t=0$ 得 $t=2$，代回 $(1+4,\\ 0+2,\\ 2-2)=(5,2,0)$。參數式把「找交點」變成解一個一次方程式。" },
        { t: "$(1,0,0)$", common: true, explain: "直接把 $z$ 改成 0 很直覺，但直線是斜的，往下走到 $z=0$ 的途中，$x$、$y$ 也跟著變了。" },
        { t: "$(2,1,0)$", explain: "$(2,1,-1)$ 是方向，不是位置。要從起點 $(1,0,2)$ 出發，走 $t$ 倍的方向。" },
        { t: "不會相交", explain: "方向的 $z$ 分量是 $-1\\ne0$，直線會一路往下，一定會穿過 $z=0$。只有方向和平面平行時才可能不相交。" }
      ]
    },

    derive: {
      intro: "拖動滑桿 $t$，看點 $P$ 在直線上移動；在圖上按住拖曳可以旋轉。",
      tall: true,
      frames: [
        { cap: "<b>參數式</b>：從點 $A$ 出發，沿方向向量 $\\vec d$ 走 $t$ 倍。$t$ 取遍所有實數，$P$ 就走遍整條直線；$t<0$ 往反方向走。", tex: "(x,y,z)=(x_0,y_0,z_0)+t(d_1,d_2,d_3)" },
        { cap: "<b>比例式</b>：三個式子都等於同一個 $t$，把 $t$ 消掉就得到比例式（分母為 0 時，那個坐標固定不變）。", tex: "\\frac{x-x_0}{d_1}=\\frac{y-y_0}{d_2}=\\frac{z-z_0}{d_3}\\ (=t)" },
        { cap: "<b>直線與平面</b>：把參數式代入平面方程式，解出 $t$ 就是交點。如果 $\\vec d\\cdot\\vec n=0$，方向和平面平行：直線在平面上，或完全不相交。", tex: "\\vec n\\cdot(A+t\\vec d)=k\\ \\Rightarrow\\ t=\\frac{k-\\vec n\\cdot A}{\\vec n\\cdot\\vec d}" },
        { cap: "<b>點到直線的距離</b>：直線上離 $Q$ 最近的點 $H$，滿足 $\\overrightarrow{HQ}\\perp\\vec d$。拖動 $t$ 看 $\\overline{PQ}$ 的長度，最短時正好垂直。", tex: "\\overrightarrow{HQ}\\cdot\\vec d=0,\\qquad d(Q,L)=\\frac{|\\overrightarrow{AQ}\\times\\vec d|}{|\\vec d|}" },
        { cap: "<b>歪斜線的距離</b>：兩條歪斜線之間有一條<b>公垂線</b>同時垂直兩者。它的方向是 $\\vec d_1\\times\\vec d_2$，距離是任一條連線在這個方向上的正射影長。", tex: "d=\\frac{|\\overrightarrow{AB}\\cdot(\\vec d_1\\times\\vec d_2)|}{|\\vec d_1\\times\\vec d_2|}" }
      ],
      hint: "按住圖形拖曳旋轉；t 滑桿移動直線上的點。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 540, 440, "空間中的直線");
        var g = s("g", {}, svg);
        var v = SK.view3d(svg, { cx: 240, cy: 280, scale: 44, yaw: -30, pitch: 18, onRotate: function () { draw(); } });
        var A = [1, -1, 0], D = [1, 1, 1.2], st = { t: 2.2, u: 0 };
        var NP = [1, 1, 1], KP = 6;            // 平面 x+y+z=6
        var Q = [.9, -.3, 2.4];                // 第 4 步的點
        var B = [-1, 3, 3], E = [2, -1, .5];   // 第 5 步的另一條直線
        var read = SK.h("div", { class: "readout" });
        var sl = SK.slider({ label: "$t$", min: -2, max: 3, step: .05, value: st.t, onInput: function (x) { st.t = x; draw(); } });
        var su = SK.slider({ label: "$s$", min: -1, max: 2.5, step: .05, value: st.u, color: "blue", onInput: function (x) { st.u = x; draw(); } });
        ctx.sliders.appendChild(sl.el); ctx.sliders.appendChild(su.el);
        ctx.extra.appendChild(read);
        function num(x) { return SK.fmt(x, 2).replace("−", "-"); }
        function dot(p, q) { return p[0] * q[0] + p[1] * q[1] + p[2] * q[2]; }
        function len(p) { return Math.sqrt(dot(p, p)); }
        function add(p, q, k) { k = k == null ? 1 : k; return [p[0] + k * q[0], p[1] + k * q[1], p[2] + k * q[2]]; }
        function cross(p, q) { return [p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0]]; }
        function vs(p) { return "(" + p.map(num).join(",") + ")"; }
        function draw() {
          var f = ctx.frame, t = st.t, P = add(A, D, t);
          g.innerHTML = "";
          su.el.style.display = f === 4 ? "" : "none";
          v.axes(g, 4.5, 2);
          var lines = [];
          if (f === 2) {
            // 平面 x+y+z=6 的一塊（三角形，截在第一卦限附近）
            v.poly(g, [[6, 0, 0], [0, 6, 0], [0, 0, 6]], { fill: C.gold.f, stroke: C.gold.s, opacity: .8 });
          }
          v.line(g, add(A, D, -2.5), add(A, D, 3.5), { stroke: C.blue.s, "stroke-width": 2.2 });
          v.dot(g, A, C.cocoa, 5);
          var Ap = v.P(A); SK.label(g, Ap[0] - 10, Ap[1] + 14, "A", { it: true, anchor: "end" });
          v.arrow(g, A, add(A, D), C.orange.s, 3.6);
          var Dp = v.P(add(A, D, .5)); SK.label(g, Dp[0] + 8, Dp[1] + 14, "d", { it: true, color: C.orange.s, anchor: "start" });
          v.dot(g, P, C.pink.s, 6);
          var Pp = v.P(P); SK.label(g, Pp[0] + 10, Pp[1] - 10, "P", { it: true, color: C.pink.s, anchor: "start" });
          if (f <= 1) {
            lines.push("P=" + vs(A) + "+" + num(t) + vs(D) + "=" + vs(P));
            if (f === 1) lines.push("\\frac{x-1}{1}=\\frac{y+1}{1}=\\frac{z-0}{1.2}");
          }
          if (f === 2) {
            var tt = (KP - dot(NP, A)) / dot(NP, D), X = add(A, D, tt);
            v.dot(g, X, C.green.s, 7);
            var Xp = v.P(X); SK.label(g, Xp[0] + 10, Xp[1] + 14, "交點", { size: 13, color: C.green.s, anchor: "start" });
            lines.push("(1+t)+(-1+t)+1.2t=6\\Rightarrow t=" + num(tt));
            lines.push("\\text{交點}=" + vs(X) + ",\\ \\ P\\text{ 代入左邊}=" + num(dot(NP, P)));
          }
          if (f === 3) {
            var th = dot(add(Q, A, -1), D) / dot(D, D), H = add(A, D, th), dPQ = len(add(Q, P, -1)), dH = len(add(Q, H, -1));
            v.line(g, P, Q, { stroke: C.pink.s, "stroke-width": 2.4, "stroke-dasharray": "6 4" });
            v.line(g, H, Q, { stroke: C.green.s, "stroke-width": 2.6 });
            v.dot(g, Q, C.purple.s, 6); v.dot(g, H, C.green.s, 4.5);
            var Qp = v.P(Q), Hp = v.P(H);
            SK.label(g, Qp[0] + 10, Qp[1] - 8, "Q", { it: true, color: C.purple.s, anchor: "start" });
            SK.label(g, Hp[0] - 10, Hp[1] + 14, "H", { it: true, color: C.green.s, anchor: "end" });
            lines.push("\\overline{PQ}=" + num(dPQ) + "\\ \\ge\\ \\overline{HQ}=" + num(dH) + "\\ (t=" + num(th) + ")");
            lines.push("\\frac{|\\overrightarrow{AQ}\\times\\vec d|}{|\\vec d|}=" + num(len(cross(add(Q, A, -1), D)) / len(D)));
          }
          if (f === 4) {
            v.line(g, add(B, E, -1.5), add(B, E, 2.8), { stroke: C.purple.s, "stroke-width": 2.2 });
            var Rq = add(B, E, st.u);
            v.dot(g, Rq, C.purple.s, 6);
            var N = cross(D, E), w = add(B, A, -1), dist = Math.abs(dot(w, N)) / len(N);
            // 公垂線端點：解 (A+tD − B − sE) ⟂ D、E
            var a11 = dot(D, D), a12 = -dot(D, E), a21 = dot(E, D), a22 = -dot(E, E), b1 = dot(w, D), b2 = dot(w, E), det = a11 * a22 - a12 * a21;
            var t0 = (b1 * a22 - a12 * b2) / det, s0 = (a11 * b2 - a21 * b1) / det, H1 = add(A, D, t0), H2 = add(B, E, s0);
            v.line(g, H1, H2, { stroke: C.green.s, "stroke-width": 3 });
            v.line(g, P, Rq, { stroke: C.pink.s, "stroke-width": 1.8, "stroke-dasharray": "5 4" });
            lines.push("\\overline{PR}=" + num(len(add(Rq, P, -1))) + "\\ \\ge\\ d=" + num(dist));
            lines.push("\\vec d_1\\times\\vec d_2=" + vs(N));
          }
          read.innerHTML = lines.map(function (t2) { return SK.tex(t2, true); }).join("");
        }
        return { show: draw };
      }
    },

    drills: [
      { title: "兩直線：相交、平行還是歪斜？距離怎麼算？", code: "G-11A-10",
        demo: {
          q: "$L_1:(x,y,z)=(1,0,2)+t(1,2,-1)$，$L_2:(x,y,z)=(2,3,1)+s(2,1,1)$。判斷兩線關係並求距離。",
          steps: [
            "方向 $(1,2,-1)$ 與 $(2,1,1)$ 不成比例，所以<b>不平行</b>。",
            "找交點時兩條線要用<b>不同的參數</b> $t,s$：$1+t=2+2s$、$2t=3+s$、$2-t=1+s$。",
            "由前兩式：$t=1+2s$，代入得 $2+4s=3+s$，$s=\\frac13$、$t=\\frac53$。<b>代第三式檢查</b>：左邊 $2-\\frac53=\\frac13$，右邊 $1+\\frac13=\\frac43$，不相等——沒有交點。不平行又不相交，是<b>歪斜線</b>。",
            "公垂方向 $\\vec n=\\vec d_1\\times\\vec d_2=(3,-3,-3)$。取 $P_1(1,0,2)$、$P_2(2,3,1)$，距離是 $\\overrightarrow{P_1P_2}=(1,3,-1)$ 在 $\\vec n$ 方向上投影的長：$\\dfrac{|3-9+3|}{\\sqrt{27}}=\\dfrac{3}{3\\sqrt3}=\\dfrac{\\sqrt3}3$。",
            "如果兩條線都用同一個 $t$，等於要求兩個動點「同一時刻」到同一點，會把其實相交的直線誤判成歪斜。"
          ]
        },
        tries: [
          { q: "$L_1:(1,2,0)+t(1,1,1)$、$L_2:(3,0,1)+s(2,2,2)$。判斷關係並求距離。", hint: "方向成比例時外積是 $\\vec0$，不能拿來當公垂方向。", ans: "方向成比例，平行或重合。$\\overrightarrow{P_1P_2}=(2,-2,1)$ 不與 $(1,1,1)$ 平行，所以<b>平行不重合</b>。距離用點到直線：$\\dfrac{|(2,-2,1)\\times(1,1,1)|}{|(1,1,1)|}=\\dfrac{|(-3,-1,4)|}{\\sqrt3}=\\dfrac{\\sqrt{26}}{\\sqrt3}=\\dfrac{\\sqrt{78}}3$。" },
          { q: "判斷 $(1,1,1)+t(1,0,2)$ 與 $(2,3,5)+s(0,1,1)$ 是否相交；若相交，求交點。", ans: "$1+t=2$、$1=3+s$、$1+2t=5+s$。前兩式 $t=1$、$s=-2$，第三式 $3=3$ ✓。交點 $(2,1,3)$。" }
        ],
        edge: "平行兩線的 $\\vec d_1\\times\\vec d_2=\\vec0$，公式 $\\frac{|\\overrightarrow{PQ}\\cdot\\vec n|}{|\\vec n|}$ 會除以 $0$，要改用點到直線距離 $\\frac{|\\overrightarrow{PQ}\\times\\vec d|}{|\\vec d|}$。三個方程只用兩個解出 $t,s$ 後，<b>一定要代第三式</b>。歪斜只在空間中發生：方向不平行而且沒有交點。"
      }
    ],

    angles: [
      { title: "t 是時間", icon: "sparkle",
        html: "把 $t$ 想成秒數：$t=0$ 在起點 $A$，每過 1 秒前進一個 $\\vec d$。這也是物理描述等速直線運動的方法：位置 = 起點 + 時間 × 速度。同一條直線，換一個起點或把 $\\vec d$ 放大，式子不同，但畫出來還是同一條。" },
      { title: "兩平面的交線", icon: "leaf",
        html: "兩個不平行的平面交成一條直線。它同時躺在兩個平面裡，所以同時垂直兩個法向量，方向就是 $\\vec n_1\\times\\vec n_2$。再找一個同時滿足兩個方程式的點，就能寫出交線的參數式。" }
    ],

    challenges: [
      { q: "過 $A(1,2,3)$、$B(4,0,5)$ 的直線，參數式和比例式各是什麼？", idea: "方向 $\\overrightarrow{AB}=(3,-2,2)$：$(1+3t,\\ 2-2t,\\ 3+2t)$；比例式 $\\tfrac{x-1}{3}=\\tfrac{y-2}{-2}=\\tfrac{z-3}{2}$。" },
      { q: "直線 $(1+t,\\ 2t,\\ 3-t)$ 和平面 $x+y+3z=4$ 的關係？", idea: "$\\vec d\\cdot\\vec n=1+2-3=0$，方向平行平面。再代起點 $(1,0,3)$：$1+0+9=10\\ne4$，不在平面上，所以直線和平面平行、不相交。" },
      { q: "求點 $(0,0,0)$ 到直線 $(1+t,\\ 1-t,\\ 2)$ 的距離。", idea: "$\\overrightarrow{HQ}\\cdot\\vec d=0$：$-(1+t)+(1-t)=0$，$t=0$，$H=(1,1,2)$，距離 $\\sqrt6$。" }
    ],

    where: {
      codes: [["G-11A-10", "空間中的直線方程式：參數式與比例式、直線與平面的關係、點到直線的距離、兩平行線或歪斜線的距離"]],
      exam: "11 年級<b>數學 A</b>，學測數 A、分科數甲都在範圍內。",
      stop: "參數式、比例式、與平面的交點、點線距離、歪斜線距離就夠了。兩直線的夾角、共平面判定等可以用同樣的向量工具處理，不需要背額外公式。"
    }
  });
})();
