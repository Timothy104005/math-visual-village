/* 單元：直線方程式 */
(function () {
  var C = SK.C, s = SK.s;

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 250, "兩條坡道哪一條比較陡");
    s("path", { d: "M30 220 L200 220 L200 120 Z", fill: C.orange.f, stroke: C.orange.s, "stroke-width": 1.5 }, svg);
    s("path", { d: "M220 220 L370 220 L370 60 Z", fill: C.blue.f, stroke: C.blue.s, "stroke-width": 1.5 }, svg);
    SK.label(svg, 115, 236, "走 170", { size: 12, color: C.soft }); SK.label(svg, 214, 170, "升 100", { size: 12, color: C.soft, anchor: "end" });
    SK.label(svg, 295, 236, "走 150", { size: 12, color: C.soft }); SK.label(svg, 384, 140, "升 160", { size: 12, color: C.soft, anchor: "start" });
    SK.label(svg, 200, 24, "陡不陡，要看「升高 ÷ 前進」", { size: 13, color: C.pink.s });
  }

  SK.mountUnit({
    slug: "line-equation",
    en: "Slope is how much you climb per step",
    formula: "m=\\frac{\\co{\\Delta y}}{\\cb{\\Delta x}},\\qquad y-y_0=m(x-x_0),\\qquad d=\\frac{|ax_0+by_0+c|}{\\sqrt{a^2+b^2}}",

    hook: {
      html: "一條直線上，不管從哪裡開始走，每往右走 1 步，高度都改變一樣多。這個「坡度」就是斜率。",
      ask: "知道斜率和一個點，能不能寫出整條直線？兩條線要多「歪」才會互相垂直？",
      visual: hookVisual
    },

    guess: {
      q: "直線 $L$ 的斜率是 $2$。和 $L$ 垂直的直線，斜率是多少？",
      options: [
        { t: "$-\\tfrac12$", truth: true, explain: "把「往右 1、往上 2」的斜率三角形轉 $90^\\circ$，變成「往右 2、往下 1」，斜率 $\\tfrac{-1}{2}$。垂直的兩條線斜率相乘等於 $-1$。" },
        { t: "$-2$", common: true, explain: "只把符號改掉是很自然的猜測！但 $-2$ 的線是把原來的線對 $y$ 軸翻過去，兩者夾角不是直角。轉 $90^\\circ$ 時，三角形的「高」和「底」會互換。" },
        { t: "$\\tfrac12$", explain: "這是把線對 $y=x$ 翻過去的斜率（底和高互換，但沒有變號）。它和原來的線夾角也不是直角。" },
        { t: "$0$", explain: "斜率 0 是水平線，它和斜率 2 的線不垂直。和水平線垂直的是鉛直線（沒有斜率）。" }
      ]
    },

    derive: {
      intro: "拖動 $A$、$B$ 決定直線，拖動 $P$ 看它和直線的關係。",
      tall: true,
      frames: [
        { cap: "<b>斜率</b>：從 $A$ 走到 $B$，高度改變 $\\Delta y$、水平前進 $\\Delta x$，$m=\\tfrac{\\Delta y}{\\Delta x}$。直線上任取兩點算，答案都一樣（相似三角形）。$|m|$ 越大越陡；$m<0$ 往右下。", tex: "m=\\frac{\\co{y_2-y_1}}{\\cb{x_2-x_1}}" },
        { cap: "<b>點斜式</b>：線上任一點 $(x,y)$ 和 $A(x_0,y_0)$ 算出的斜率都是 $m$，所以 $\\tfrac{y-y_0}{x-x_0}=m$。整理後得到<b>一般式</b> $ax+by+c=0$。", tex: "y-y_0=m(x-x_0)\\ \\Rightarrow\\ ax+by+c=0" },
        { cap: "過 $P$ 畫<b>平行線</b>：斜率一樣。畫<b>垂直線</b>：把斜率三角形轉 $90^\\circ$，底和高互換、一邊變號，所以 $m_1m_2=-1$。", tex: "\\begin{gathered}L_1\\parallel L_2\\iff m_1=m_2\\\\L_1\\perp L_2\\iff m_1m_2=-1\\end{gathered}" },
        { cap: "<b>點到直線的距離</b>：從 $P$ 做垂線到直線，垂足為 $H$，$\\overline{PH}$ 就是最短距離。算出來是一個好記的公式。兩平行線 $ax+by+c_1=0$、$ax+by+c_2=0$ 的距離是 $\\tfrac{|c_1-c_2|}{\\sqrt{a^2+b^2}}$。", tex: "d(P,L)=\\frac{|ax_0+by_0+c|}{\\sqrt{a^2+b^2}}" },
        { cap: "<b>二元一次不等式</b>：直線把平面分成兩半。$ax+by+c>0$ 的點全部在同一側，$<0$ 的在另一側。代一個點進去看正負，就知道是哪一側。", tex: "ax+by+c>0\\ \\text{是一個半平面}" }
      ],
      hint: "拖動 A、B、P（都會對齊到半格）。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 540, 440, "直線、斜率三角形與點到直線距離");
        var gridG = s("g", {}, svg), g = s("g", {}, svg), hg = s("g", {}, svg);
        var O = [230, 250], u = 34, st = { A: [-3, -1], B: [3, 2], P: [1, 4] };
        function Pt(v) { return [O[0] + v[0] * u, O[1] - v[1] * u]; }
        var xmin = -O[0] / u, xmax = (540 - O[0]) / u, ymin = -(440 - O[1]) / u, ymax = O[1] / u;
        for (var i = Math.ceil(xmin); i <= xmax; i++) s("line", { x1: O[0] + i * u, y1: 0, x2: O[0] + i * u, y2: 440, class: "m-grid" }, gridG);
        for (var j = Math.ceil(ymin); j <= ymax; j++) s("line", { x1: 0, y1: O[1] - j * u, x2: 540, y2: O[1] - j * u, class: "m-grid" }, gridG);
        s("line", { x1: 0, y1: O[1], x2: 540, y2: O[1], class: "m-axis" }, gridG);
        s("line", { x1: O[0], y1: 0, x2: O[0], y2: 440, class: "m-axis" }, gridG);
        var H = {};
        [["A", C.orange.s], ["B", C.blue.s], ["P", C.pink.s]].forEach(function (k) {
          H[k[0]] = SK.handle(hg, 0, 0, k[1], "點 " + k[0]);
          SK.drag(svg, H[k[0]], function (x, y) {
            var v = [SK.clamp(Math.round((x - O[0]) / u * 2) / 2, -6.5, 8.5), SK.clamp(Math.round((O[1] - y) / u * 2) / 2, -5.5, 7)];
            var other = k[0] === "A" ? st.B : k[0] === "B" ? st.A : null;
            if (other && v[0] === other[0] && v[1] === other[1]) return;
            st[k[0]] = v; draw();
          }, function () { return Pt(st[k[0]]); }, u / 2);
        });
        var read = SK.h("div", { class: "readout" });
        ctx.extra.appendChild(read);
        // 在畫面範圍內畫出 ax+by+c=0
        function lineABC(a, b, c, attrs) {
          var pts = [];
          if (Math.abs(b) > 1e-9) { [xmin, xmax].forEach(function (x) { pts.push([x, -(a * x + c) / b]); }); }
          else { [ymin, ymax].forEach(function (y) { pts.push([-c / a, y]); }); }
          var p = Pt(pts[0]), q = Pt(pts[1]);
          return s("line", Object.assign({ x1: p[0], y1: p[1], x2: q[0], y2: q[1] }, attrs), g);
        }
        function num(v) { return SK.fmt(v, 2).replace("−", "-"); }
        function eqStr(a, b, c) {
          var t = "", first = true;
          [[a, "x"], [b, "y"], [c, ""]].forEach(function (p) {
            var v = p[0]; if (Math.abs(v) < 1e-9) return;
            var sgn = v < 0 ? "-" : first ? "" : "+", av = Math.abs(v);
            t += sgn + (p[1] && Math.abs(av - 1) < 1e-9 ? "" : num(av)) + p[1]; first = false;
          });
          return (t || "0") + "=0";
        }
        function draw() {
          var f = ctx.frame, A = st.A, B = st.B, P = st.P;
          g.innerHTML = "";
          var dx = B[0] - A[0], dy = B[1] - A[1];
          var a = dy, b = -dx, c = -(a * A[0] + b * A[1]);
          var val = a * P[0] + b * P[1] + c, nrm = Math.hypot(a, b), d = Math.abs(val) / nrm;
          if (f === 4) {
            // 塗半平面：取一個大多邊形與直線的同側
            var poly = [[xmin, ymin], [xmax, ymin], [xmax, ymax], [xmin, ymax]], side = [], sgnP = val >= 0 ? 1 : -1;
            for (var k = 0; k < 4; k++) {
              var p1 = poly[k], p2 = poly[(k + 1) % 4], v1 = a * p1[0] + b * p1[1] + c, v2 = a * p2[0] + b * p2[1] + c;
              if (v1 * sgnP >= 0) side.push(p1);
              if (v1 * v2 < 0) { var t = v1 / (v1 - v2); side.push([p1[0] + t * (p2[0] - p1[0]), p1[1] + t * (p2[1] - p1[1])]); }
            }
            s("path", { d: "M" + side.map(Pt).join(" L") + "Z", fill: sgnP > 0 ? C.gold.f : C.purple.f, opacity: .7 }, g);
          }
          lineABC(a, b, c, { stroke: C.ink, "stroke-width": 2.6 });
          var Ap = Pt(A), Bp = Pt(B), Pp = Pt(P);
          if (f <= 1 && Math.abs(dx) > 1e-9) {
            var Cp = Pt([B[0], A[1]]);
            s("path", { d: "M" + Ap + " L" + Cp + " L" + Bp, fill: "none", stroke: C.cocoa, "stroke-dasharray": "4 4" }, g);
            s("line", { x1: Ap[0], y1: Ap[1], x2: Cp[0], y2: Cp[1], stroke: C.blue.s, "stroke-width": 3 }, g);
            s("line", { x1: Cp[0], y1: Cp[1], x2: Bp[0], y2: Bp[1], stroke: C.orange.s, "stroke-width": 3 }, g);
            SK.label(g, (Ap[0] + Cp[0]) / 2, Cp[1] + (dy >= 0 ? 16 : -16), "Δx = " + SK.fmt(dx, 1), { size: 13, color: C.blue.s });
            SK.label(g, Cp[0] + (dx >= 0 ? 10 : -10), (Cp[1] + Bp[1]) / 2, "Δy = " + SK.fmt(dy, 1), { size: 13, color: C.orange.s, anchor: dx >= 0 ? "start" : "end" });
          }
          if (f === 2) {
            lineABC(a, b, -(a * P[0] + b * P[1]), { stroke: C.green.s, "stroke-width": 2, "stroke-dasharray": "8 5" });
            lineABC(b, -a, -(b * P[0] - a * P[1]), { stroke: C.purple.s, "stroke-width": 2, "stroke-dasharray": "8 5" });
            // 轉 90 度的斜率三角形
            var s1 = Pt([P[0] + dx / 2, P[1] + dy / 2]), s2 = Pt([P[0] - dy / 2, P[1] + dx / 2]);
            s("path", { d: "M" + Pp + " L" + Pt([P[0] + dx / 2, P[1]]) + " L" + s1, fill: C.green.f, stroke: C.green.s }, g);
            s("path", { d: "M" + Pp + " L" + Pt([P[0], P[1] + dx / 2]) + " L" + s2, fill: C.purple.f, stroke: C.purple.s }, g);
            SK.label(g, 30, 20, "綠：平行　紫：垂直（三角形轉 90°）", { size: 13, anchor: "start", color: C.soft });
          }
          if (f === 3) {
            var t2 = -val / (nrm * nrm), Hh = [P[0] + a * t2, P[1] + b * t2], Hp = Pt(Hh);
            s("line", { x1: Pp[0], y1: Pp[1], x2: Hp[0], y2: Hp[1], stroke: C.pink.s, "stroke-width": 3 }, g);
            s("circle", { cx: Hp[0], cy: Hp[1], r: 4.5, fill: C.pink.s }, g);
            var ux = -b / nrm, uy = -a / nrm; // 螢幕上沿線與法向
            SK.rightMark(g, Hp[0], Hp[1], (Pp[0] - Hp[0]) / (Math.hypot(Pp[0] - Hp[0], Pp[1] - Hp[1]) || 1), (Pp[1] - Hp[1]) / (Math.hypot(Pp[0] - Hp[0], Pp[1] - Hp[1]) || 1), ux, uy, 11, C.pink.s);
            SK.label(g, Hp[0] + 10, Hp[1] + 16, "H", { it: true, color: C.pink.s });
            SK.label(g, (Pp[0] + Hp[0]) / 2 + 10, (Pp[1] + Hp[1]) / 2, "d = " + SK.fmt(d, 2), { size: 14, color: C.pink.s, anchor: "start" });
          }
          SK.label(g, Ap[0] - 12, Ap[1] + 16, "A", { it: true, color: C.orange.s });
          SK.label(g, Bp[0] + 12, Bp[1] - 14, "B", { it: true, color: C.blue.s });
          H.A.moveTo(Ap[0], Ap[1]); H.B.moveTo(Bp[0], Bp[1]); H.P.moveTo(Pp[0], Pp[1]);
          H.P.style.display = f >= 2 ? "" : "none";
          if (f >= 2) SK.label(g, Pp[0] + 12, Pp[1] - 14, "P", { it: true, color: C.pink.s });
          var m = Math.abs(dx) < 1e-9 ? null : dy / dx;
          var lines = [];
          lines.push(m === null ? "\\text{鉛直線：斜率不存在}" : "m=\\frac{" + num(dy) + "}{" + num(dx) + "}=" + num(m));
          if (f >= 1) lines.push(eqStr(a, b, c));
          if (f === 2 && m !== null) lines.push("m_{\\parallel}=" + num(m) + ",\\ \\ m_{\\perp}=" + (Math.abs(m) < 1e-9 ? "\\text{不存在}" : num(-1 / m)));
          if (f === 3) lines.push("d=\\frac{|" + num(val) + "|}{\\sqrt{" + num(a * a + b * b) + "}}=" + num(d));
          if (f === 4) lines.push("P\\ \\text{代入}：" + num(val) + (val > 0 ? ">0" : val < 0 ? "<0" : "=0"));
          read.innerHTML = lines.map(function (t) { return SK.tex(t, true); }).join("");
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "為什麼點線距離公式長這樣", icon: "sparkle",
        html: "把 $P$ 沿著水平方向走到直線上，走的距離是 $\\tfrac{|ax_0+by_0+c|}{|a|}$（因為 $x$ 每改 1，$ax+by+c$ 改 $a$）。這段水平線和垂線 $\\overline{PH}$ 構成直角三角形，夾角的餘弦是 $\\tfrac{|a|}{\\sqrt{a^2+b^2}}$。兩者相乘，$|a|$ 消掉，就得到公式。" },
      { title: "平移一條直線", icon: "leaf",
        html: "把 $y=mx$ 往右移 $h$、往上移 $k$，每一點 $(x,y)$ 變成 $(x+h,y+k)$，方程式變成 $y-k=m(x-h)$：這正是點斜式。所以點斜式的意思是「把過原點的直線搬到 $(h,k)$」。" }
    ],

    challenges: [
      { q: "求過 $(2,-1)$ 且與 $3x-4y+5=0$ 垂直的直線。", idea: "原線斜率 $\\tfrac34$，垂線斜率 $-\\tfrac43$：$y+1=-\\tfrac43(x-2)$，即 $4x+3y-5=0$。小技巧：$a,b$ 對調、一個變號。" },
      { q: "點 $(1,2)$ 到直線 $3x+4y-1=0$ 的距離是？", idea: "$\\tfrac{|3+8-1|}{\\sqrt{9+16}}=\\tfrac{10}{5}=2$。" },
      { q: "畫出同時滿足 $y\\ge x$、$x+y\\le4$、$x\\ge0$ 的區域，它的面積是多少？", hint: "三條線兩兩相交，先求三個頂點；再代一個點（例如 $(0,1)$）確認是哪一側。",
        idea: "頂點是 $(0,0)$、$(2,2)$、$(0,4)$。以 $y$ 軸上從 0 到 4 的那一段當底（長 4），高是 $(2,2)$ 到 $y$ 軸的距離 2，面積 $\\tfrac12\\times4\\times2=4$。" }
    ],

    where: {
      codes: [["G-10-2", "直線方程式：斜率（含絕對值的意義）、點斜式、平移、平行與垂直、點到直線距離、平行線距離、二元一次不等式"]],
      exam: "10 年級<b>共同必修</b>，學測數 A、數 B 都考。",

      past: [] /* Examination text excluded; see docs/PROVENANCE.md. */,
      stop: "二元一次不等式到「畫出區域、判斷點在哪一側」為止；線性規劃在 12 年級數學乙。直線的法向量、參數式留到 11 年級向量。"
    }
  });
})();
