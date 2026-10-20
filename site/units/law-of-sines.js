/* 單元：正弦定理與測量 */
(function () {
  var C = SK.C, s = SK.s;

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 250, "河對岸的距離");
    s("path", { d: "M0 150 Q100 130 200 150 T400 148 L400 250 L0 250Z", fill: "rgba(207,221,218,.55)", stroke: "none" }, svg);
    s("circle", { cx: 60, cy: 210, r: 6, fill: C.cocoa }, svg);
    s("circle", { cx: 250, cy: 210, r: 6, fill: C.cocoa }, svg);
    s("circle", { cx: 300, cy: 70, r: 7, fill: C.orange.s }, svg);
    s("line", { x1: 60, y1: 210, x2: 250, y2: 210, stroke: C.cocoa, "stroke-width": 2 }, svg);
    s("line", { x1: 60, y1: 210, x2: 300, y2: 70, stroke: C.blue.s, "stroke-width": 1.6, "stroke-dasharray": "5 4" }, svg);
    s("line", { x1: 250, y1: 210, x2: 300, y2: 70, stroke: C.blue.s, "stroke-width": 1.6, "stroke-dasharray": "5 4" }, svg);
    SK.label(svg, 155, 228, "量得的基線", { size: 12, color: C.soft });
    SK.label(svg, 330, 60, "對岸的塔", { size: 13, color: C.orange.s });
    SK.label(svg, 200, 30, "過不去，只能量角度", { size: 13, color: C.pink.s });
  }

  SK.mountUnit({
    slug: "law-of-sines",
    en: "Every side over its sine is the same",
    formula: "\\frac{a}{\\sin A}=\\frac{b}{\\sin B}=\\frac{c}{\\sin C}=2R",

    hook: {
      html: "河的對岸有一座塔，過不去、也拉不了尺。但我們可以在這一岸量出一段基線，再量兩個角度。",
      ask: "只用「一段長度 + 兩個角度」，怎麼算出過不去的距離？",
      visual: hookVisual
    },

    guess: {
      q: "三角形中 $a=6$、$\\angle A=30^\\circ$、$\\angle B=45^\\circ$。邊 $b$ 是多少？",
      options: [
        { t: "$6\\sqrt2\\approx8.49$", truth: true, explain: "正弦定理：$\\tfrac{b}{\\sin45^\\circ}=\\tfrac{6}{\\sin30^\\circ}=12$，所以 $b=12\\times\\tfrac{\\sqrt2}{2}=6\\sqrt2$。大角對大邊：$45^\\circ>30^\\circ$，所以 $b>a$，合理。" },
        { t: "9", common: true, explain: "用角度的比例 $\\tfrac{45}{30}\\times6=9$ 很直覺，但邊長和角度<b>不成正比</b>，和角度的<b>正弦</b>才成正比。" },
        { t: "$6$", explain: "兩個角不一樣大，對邊就不會一樣長。" },
        { t: "還要知道第三個角才能算", explain: "第三個角固然可以算出（$105^\\circ$），但求 $b$ 只需要 $a$、$\\angle A$、$\\angle B$。" }
      ]
    },

    derive: {
      intro: "拖動圓上的點 $A$，看 $\\angle A$ 和邊 $a$ 的關係；後面幾步換成正射影與測量。",
      tall: true,
      frames: [
        { cap: "把三角形放進它的<b>外接圓</b>。固定 $B$、$C$，把 $A$ 沿著圓弧移動：$\\angle A$ 不變（<b>圓周角定理</b>：同一段弧對的圓周角都相等），$a$ 當然也不變。", tex: "\\angle A\\ \\text{只由弧 }BC\\ \\text{決定}" },
        { cap: "把 $A$ 移到讓 $\\overline{BA}$ 成為<b>直徑</b>的位置：直徑對的圓周角是直角，所以 $\\angle BCA=90^\\circ$。於是 $a=\\overline{BC}=2R\\sin A$，也就是 $\\tfrac{a}{\\sin A}=2R$。對每一邊都一樣。", tex: "a=2R\\sin A\\ \\Rightarrow\\ \\frac{a}{\\sin A}=2R" },
        { cap: "<b>正射影定理</b>：從 $A$ 作高，把 $\\overline{BC}$ 分成兩段，一段是 $b\\cos C$、一段是 $c\\cos B$。所以 $a=b\\cos C+c\\cos B$：每一邊都是另外兩邊的<b>投影</b>相加。", tex: "a=b\\cos C+c\\cos B" },
        { cap: "<b>斜角與斜率</b>：直線和 $x$ 軸正向的夾角 $\\theta$（$0^\\circ\\le\\theta<180^\\circ$）叫斜角，斜率就是 $\\tan\\theta$。$\\theta=90^\\circ$ 時斜率不存在。", tex: "m=\\tan\\theta" },
        { cap: "<b>三角測量</b>：在基線兩端量出兩個角，第三個角就知道了。用正弦定理求出一條斜距，再用 $\\sin$ 求高度。這是測量學與導航的基本手法。", tex: "\\frac{\\overline{AP}}{\\sin\\beta}=\\frac{d}{\\sin(180^\\circ-\\alpha-\\beta)}" }
      ],
      hint: "第 1、2 步拖動圓上的 A；第 4 步拖動斜角；第 5 步拖動兩個測角。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 540, 440, "正弦定理與測量");
        var g = s("g", {}, svg), hg = s("g", {}, svg);
        var st = { A: 2.2, th: 35, al: 62, be: 48 };
        var Oc = [250, 250], R = 130;
        var read = SK.h("div", { class: "readout" });
        var sth = SK.slider({ label: "斜角 $\\theta$", min: 0, max: 179, step: 1, value: st.th, fmt: function (v) { return v + "°"; }, onInput: function (v) { st.th = v; draw(); } });
        var sal = SK.slider({ label: "左邊測角 $\\alpha$", min: 20, max: 80, step: 1, value: st.al, fmt: function (v) { return v + "°"; }, onInput: function (v) { st.al = v; draw(); } });
        var sbe = SK.slider({ label: "右邊測角 $\\beta$", min: 20, max: 80, step: 1, value: st.be, color: "blue", fmt: function (v) { return v + "°"; }, onInput: function (v) { st.be = v; draw(); } });
        [sth, sal, sbe].forEach(function (o) { ctx.sliders.appendChild(o.el); });
        ctx.extra.appendChild(read);
        var hA = SK.handle(hg, 0, 0, C.orange.s, "頂點 A");
        SK.drag(svg, hA, function (x, y) { st.A = Math.atan2(Oc[1] - y, x - Oc[0]); draw(); }, function () { return [Oc[0] + R * Math.cos(st.A), Oc[1] - R * Math.sin(st.A)]; }, 8);
        function num(v, d) { return SK.fmt(v, d == null ? 2 : d).replace("−", "-"); }
        function pt(ang) { return [Oc[0] + R * Math.cos(ang), Oc[1] - R * Math.sin(ang)]; }
        function ang3(P, Q, S) { // ∠PQS
          var u = [P[0] - Q[0], P[1] - Q[1]], v = [S[0] - Q[0], S[1] - Q[1]];
          return Math.acos((u[0] * v[0] + u[1] * v[1]) / (Math.hypot(u[0], u[1]) * Math.hypot(v[0], v[1])));
        }
        function draw() {
          var f = ctx.frame;
          g.innerHTML = "";
          hA.style.display = f <= 1 ? "" : "none";
          sth.el.style.display = f === 3 ? "" : "none";
          sal.el.style.display = sbe.el.style.display = f === 4 ? "" : "none";
          if (f <= 2) {
            var bAng = Math.PI * 1.18, cAng = Math.PI * 1.82;
            var B = pt(bAng), Cc = pt(cAng), A = f === 2 ? pt(1.9) : pt(st.A);
            if (f === 1) A = pt(bAng + Math.PI); // 讓 BA 成為直徑
            if (f <= 1) {
              s("circle", { cx: Oc[0], cy: Oc[1], r: R, fill: "none", stroke: C.line, "stroke-width": 1.6 }, g);
              s("circle", { cx: Oc[0], cy: Oc[1], r: 4, fill: C.cocoa }, g);
              SK.label(g, Oc[0] - 14, Oc[1] + 14, "O", { it: true, size: 13 });
              s("path", { d: SK.arcPath(Oc[0], Oc[1], R, cAng, bAng + 2 * Math.PI), fill: "none", stroke: C.pink.s, "stroke-width": 4 }, g);
            }
            s("path", { d: "M" + A + " L" + B + " L" + Cc + "Z", fill: C.gold.f, stroke: C.cocoa, "stroke-width": 1.8 }, g);
            s("line", { x1: B[0], y1: B[1], x2: Cc[0], y2: Cc[1], stroke: C.pink.s, "stroke-width": 3.4 }, g);
            [[A, "A", C.orange], [B, "B", C.blue], [Cc, "C", C.green]].forEach(function (q) {
              s("circle", { cx: q[0][0], cy: q[0][1], r: 5, fill: q[2].s }, g);
              SK.label(g, q[0][0] + (q[1] === "A" ? 0 : q[1] === "B" ? -16 : 16), q[0][1] + (q[1] === "A" ? -18 : 16), q[1], { it: true, color: q[2].s, size: 15 });
            });
            var Aang = ang3(B, A, Cc), a = Math.hypot(B[0] - Cc[0], B[1] - Cc[1]);
            var arc = SK.arcPath(A[0], A[1], 26, Math.atan2(A[1] - B[1], B[0] - A[0]), Math.atan2(A[1] - Cc[1], Cc[0] - A[0]));
            s("path", { d: arc, fill: "none", stroke: C.orange.s, "stroke-width": 2 }, g);
            SK.label(g, (B[0] + Cc[0]) / 2, (B[1] + Cc[1]) / 2 + 22, "a", { it: true, color: C.pink.s, size: 15 });
            if (f === 1) {
              s("line", { x1: B[0], y1: B[1], x2: A[0], y2: A[1], stroke: C.purple.s, "stroke-width": 3 }, g);
              SK.rightMark(g, Cc[0], Cc[1], (A[0] - Cc[0]) / Math.hypot(A[0] - Cc[0], A[1] - Cc[1]), (A[1] - Cc[1]) / Math.hypot(A[0] - Cc[0], A[1] - Cc[1]), (B[0] - Cc[0]) / Math.hypot(B[0] - Cc[0], B[1] - Cc[1]), (B[1] - Cc[1]) / Math.hypot(B[0] - Cc[0], B[1] - Cc[1]), 13, C.purple.s);
              SK.label(g, (A[0] + B[0]) / 2 - 14, (A[1] + B[1]) / 2, "2R", { color: C.purple.s, size: 14, anchor: "end" });
            }
            if (f === 2) {
              // 正射影：從 A 作高
              var t = ((A[0] - B[0]) * (Cc[0] - B[0]) + (A[1] - B[1]) * (Cc[1] - B[1])) / ((Cc[0] - B[0]) * (Cc[0] - B[0]) + (Cc[1] - B[1]) * (Cc[1] - B[1]));
              var H = [B[0] + t * (Cc[0] - B[0]), B[1] + t * (Cc[1] - B[1])];
              s("line", { x1: A[0], y1: A[1], x2: H[0], y2: H[1], stroke: C.cocoa, "stroke-dasharray": "5 4" }, g);
              s("line", { x1: B[0], y1: B[1], x2: H[0], y2: H[1], stroke: C.blue.s, "stroke-width": 5 }, g);
              s("line", { x1: H[0], y1: H[1], x2: Cc[0], y2: Cc[1], stroke: C.green.s, "stroke-width": 5 }, g);
              SK.label(g, (B[0] + H[0]) / 2, H[1] + 22, "c cos B", { size: 12, color: C.blue.s });
              SK.label(g, (H[0] + Cc[0]) / 2, H[1] + 22, "b cos C", { size: 12, color: C.green.s });
              var b = Math.hypot(A[0] - Cc[0], A[1] - Cc[1]), c = Math.hypot(A[0] - B[0], A[1] - B[1]);
              var Bang = ang3(A, B, Cc), Cang = ang3(A, Cc, B);
              read.innerHTML = SK.tex("b\\cos C+c\\cos B=" + num(b * Math.cos(Cang) / 40) + "+" + num(c * Math.cos(Bang) / 40) + "=" + num((b * Math.cos(Cang) + c * Math.cos(Bang)) / 40) + "=a", true);
              return;
            }
            var twoR = a / Math.sin(Aang);
            read.innerHTML = SK.tex("\\angle A=" + num(SK.deg(Aang), 1) + "^\\circ,\\ a=" + num(a / 40) + ",\\ \\frac{a}{\\sin A}=" + num(twoR / 40) + "=2R", true) +
              (f === 0 ? '<p class="muted" style="margin:4px 0 0;font-size:.9rem">拖動 A：角度和比值都不變。</p>' : "");
            return;
          }
          if (f === 3) {
            var O = [120, 330], u = 46;
            for (var i = -1; i <= 8; i++) { s("line", { x1: O[0] + i * u, y1: 40, x2: O[0] + i * u, y2: 420, class: "m-grid" }, g); }
            for (var j = -1; j <= 6; j++) { s("line", { x1: 40, y1: O[1] - j * u, x2: 520, y2: O[1] - j * u, class: "m-grid" }, g); }
            s("line", { x1: 40, y1: O[1], x2: 520, y2: O[1], class: "m-axis" }, g);
            s("line", { x1: O[0], y1: 40, x2: O[0], y2: 420, class: "m-axis" }, g);
            var th = SK.rad(st.th), L = 300;
            var P1 = [O[0] - L * Math.cos(th), O[1] + L * Math.sin(th)], P2 = [O[0] + L * Math.cos(th), O[1] - L * Math.sin(th)];
            s("line", { x1: P1[0], y1: P1[1], x2: P2[0], y2: P2[1], stroke: C.orange.s, "stroke-width": 2.8 }, g);
            s("path", { d: SK.arcPath(O[0], O[1], 40, 0, th), fill: "none", stroke: C.pink.s, "stroke-width": 2.4 }, g);
            SK.label(g, O[0] + 56 * Math.cos(th / 2), O[1] - 56 * Math.sin(th / 2), st.th + "°", { size: 13, color: C.pink.s });
            if (Math.abs(st.th - 90) > .5) {
              var dx = u * 2, dy = dx * Math.tan(th);
              if (Math.abs(dy) < 260) {
                s("line", { x1: O[0], y1: O[1], x2: O[0] + dx, y2: O[1], stroke: C.blue.s, "stroke-width": 3 }, g);
                s("line", { x1: O[0] + dx, y1: O[1], x2: O[0] + dx, y2: O[1] - dy, stroke: C.green.s, "stroke-width": 3 }, g);
                SK.label(g, O[0] + dx / 2, O[1] + 18, "1", { size: 13, color: C.blue.s });
                SK.label(g, O[0] + dx + 16, O[1] - dy / 2, "tan θ", { size: 13, color: C.green.s, anchor: "start" });
              }
            }
            read.innerHTML = SK.tex(Math.abs(st.th - 90) < .5 ? "\\theta=90^\\circ：\\text{斜率不存在（鉛直線）}" : "m=\\tan" + st.th + "^\\circ=" + num(Math.tan(th), 3), true);
            return;
          }
          // f === 4：三角測量
          var gy = 360, Ax = 90, Bx = 330, d = 40; // 基線 40 公尺
          var al = SK.rad(st.al), be = SK.rad(st.be), gam = Math.PI - al - be;
          s("line", { x1: 40, y1: gy, x2: 500, y2: gy, stroke: C.cocoa, "stroke-width": 2 }, g);
          s("line", { x1: Ax, y1: gy, x2: Bx, y2: gy, stroke: C.gold.s, "stroke-width": 6 }, g);
          SK.label(g, (Ax + Bx) / 2, gy + 22, "基線 d = " + d + " 公尺", { size: 13, color: C.gold.s });
          // 交點 P
          var t1 = Math.tan(al), t2 = Math.tan(be);
          var px = (Bx * t2 + Ax * t1) / (t1 + t2), py = gy - (Bx - Ax) * t1 * t2 / (t1 + t2);
          s("line", { x1: Ax, y1: gy, x2: px, y2: py, stroke: C.orange.s, "stroke-width": 2.4 }, g);
          s("line", { x1: Bx, y1: gy, x2: px, y2: py, stroke: C.blue.s, "stroke-width": 2.4 }, g);
          s("line", { x1: px, y1: py, x2: px, y2: gy, stroke: C.green.s, "stroke-width": 2, "stroke-dasharray": "5 4" }, g);
          s("circle", { cx: px, cy: py, r: 7, fill: C.pink.s }, g);
          [[Ax, "A"], [Bx, "B"]].forEach(function (q) { s("circle", { cx: q[0], cy: gy, r: 5, fill: C.cocoa }, g); SK.label(g, q[0], gy + 42, q[1], { it: true, size: 14 }); });
          s("path", { d: SK.arcPath(Ax, gy, 34, 0, al), fill: "none", stroke: C.orange.s, "stroke-width": 2 }, g);
          s("path", { d: SK.arcPath(Bx, gy, 34, Math.PI - be, Math.PI), fill: "none", stroke: C.blue.s, "stroke-width": 2 }, g);
          SK.label(g, Ax + 48, gy - 16, st.al + "°", { size: 12, color: C.orange.s });
          SK.label(g, Bx - 48, gy - 16, st.be + "°", { size: 12, color: C.blue.s });
          SK.label(g, px + 14, py - 10, "P", { it: true, size: 15, color: C.pink.s, anchor: "start" });
          var AP = d * Math.sin(be) / Math.sin(gam), h = AP * Math.sin(al);
          read.innerHTML = SK.tex("\\gamma=180^\\circ-" + st.al + "^\\circ-" + st.be + "^\\circ=" + num(SK.deg(gam), 1) + "^\\circ", true) +
            SK.tex("\\overline{AP}=\\frac{" + d + "\\sin" + st.be + "^\\circ}{\\sin" + num(SK.deg(gam), 1) + "^\\circ}=" + num(AP, 1) + "\\ \\text{公尺}", true) +
            SK.tex("\\text{高}=\\overline{AP}\\sin" + st.al + "^\\circ=" + num(h, 1) + "\\ \\text{公尺}", true);
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "大角對大邊", icon: "sparkle",
        html: "$\\tfrac{a}{\\sin A}=2R$ 說：邊長和對角的<b>正弦</b>成正比。在 $0^\\circ$ 到 $90^\\circ$ 之間，角越大正弦越大，所以大角對大邊。但要小心：$\\sin150^\\circ=\\sin30^\\circ$，已知兩邊和一個非夾角時，可能有兩個三角形（模稜兩可的情形）。" },
      { title: "和餘弦定理分工", icon: "leaf",
        html: "已知兩角一邊（AAS、ASA）或兩邊一對角（SSA），用<b>正弦</b>定理；已知兩邊夾角（SAS）或三邊（SSS），用<b>餘弦</b>定理。測量時通常角度比長度好量，所以正弦定理特別常用。" }
    ],

    challenges: [
      { q: "三角形中 $\\angle A=45^\\circ$、$\\angle B=60^\\circ$、$a=10$。求外接圓半徑 $R$ 與邊 $b$。", idea: "$2R=\\tfrac{10}{\\sin45^\\circ}=10\\sqrt2$，$R=5\\sqrt2$；$b=2R\\sin60^\\circ=10\\sqrt2\\cdot\\tfrac{\\sqrt3}{2}=5\\sqrt6\\approx12.2$。" },
      { q: "在河岸相距 50 公尺的 A、B 兩點，測得對岸一棵樹 $P$ 的角度分別是 $\\angle PAB=65^\\circ$、$\\angle PBA=50^\\circ$。求 $\\overline{AP}$。", idea: "$\\angle P=65^\\circ$，$\\overline{AP}=\\tfrac{50\\sin50^\\circ}{\\sin65^\\circ}\\approx42.3$ 公尺。" },
      { q: "一條直線的斜角是 $120^\\circ$，斜率是多少？它和 $x$ 軸正向夾 $60^\\circ$ 的直線垂直嗎？", idea: "$\\tan120^\\circ=-\\sqrt3$。斜角 $60^\\circ$ 的斜率是 $\\sqrt3$，乘積 $-3\\ne-1$，不垂直（兩線夾角是 $60^\\circ$）。" }
    ],

    where: {
      codes: [["G-10-7", "三角的應用：正弦定理與外接圓、正射影定理、直線的斜角與斜率、三角測量；餘弦定理見「餘弦定理」單元"]],
      exam: "10 年級<b>共同必修</b>，學測數 A、數 B 都考。三角測量在大考標為 ＃，常以素養情境出現。",
      stop: "會用正弦、餘弦定理解三角形與測量問題就夠了。SSA 的兩解情形要能察覺，但不必窮舉各種分類；球面三角不在範圍內。"
    }
  });
})();
