/* 單元 8：內積與正射影 */
(function () {
  var C = SK.C, s = SK.s;

  function hookVisual(el) {
    var svg = SK.svg(el, 420, 280, "斜斜拉行李箱，只有沿地面的分力幫你前進");
    s("line", { x1: 20, y1: 230, x2: 400, y2: 230, stroke: C.line, "stroke-width": 3 }, svg);
    for (var i = 0; i < 12; i++) s("line", { x1: 30 + i * 32, y1: 232, x2: 20 + i * 32, y2: 244, stroke: C.line, "stroke-width": 1.4 }, svg);
    s("rect", { x: 70, y: 130, width: 90, height: 96, rx: 12, fill: C.gold.f, stroke: C.gold.s, "stroke-width": 2.4 }, svg);
    s("line", { x1: 95, y1: 150, x2: 95, y2: 208, stroke: C.gold.s, "stroke-width": 2 }, svg);
    s("line", { x1: 135, y1: 150, x2: 135, y2: 208, stroke: C.gold.s, "stroke-width": 2 }, svg);
    s("circle", { cx: 90, cy: 228, r: 7, fill: "#fff", stroke: C.ink, "stroke-width": 2 }, svg);
    s("circle", { cx: 140, cy: 228, r: 7, fill: "#fff", stroke: C.ink, "stroke-width": 2 }, svg);
    var hx = 160, hy = 132, ang = SK.rad(40), L = 190;
    var fx = hx + L * Math.cos(ang), fy = hy - L * Math.sin(ang);
    SK.arrow(svg, hx, hy, fx, fy, C.orange.s, 4);
    s("line", { x1: fx, y1: fy, x2: fx, y2: hy, stroke: C.line, "stroke-dasharray": "4 4" }, svg);
    SK.arrow(svg, hx, hy, fx, hy, C.purple.s, 4);
    SK.label(svg, (hx + fx) / 2 - 20, (hy + fy) / 2 - 16, "你的力", { size: 14, color: C.orange.s });
    SK.label(svg, (hx + fx) / 2, hy + 18, "真正幫你前進的部分", { size: 13, color: C.purple.s });
    s("path", { d: SK.arcPath(hx, hy, 40, 0, ang), fill: "none", stroke: C.pink.s, "stroke-width": 2 }, svg);
    SK.label(svg, hx + 54, hy - 14, "θ", { it: true, color: C.pink.s });
  }

  function signAngle(el) {
    var wrap = SK.h("div", { class: "two-col" });
    var st = SK.h("div", { class: "stage" }), side = SK.h("div", {});
    wrap.appendChild(st); wrap.appendChild(side); el.appendChild(wrap);
    var svg = SK.svg(st, 400, 360, "固定向量 a，內積為正、為零、為負的區域");
    var g = s("g", {}, svg), hg = s("g", {}, svg);
    var cx = 200, cy = 180, u = 40;
    var ax = 2, ay = 1, bb = { x: .5, y: 3 };
    var hd = SK.handle(hg, 0, 0, C.blue.s, "向量 b 的終點");
    SK.drag(svg, hd, function (x, y) { bb.x = SK.clamp((x - cx) / u, -4.5, 4.5); bb.y = SK.clamp((cy - y) / u, -4, 4); draw(); },
      function () { return [cx + bb.x * u, cy - bb.y * u]; });
    function draw() {
      g.innerHTML = "";
      var L = Math.hypot(ax, ay), nx = -ay / L, ny = ax / L, far = 12;
      // 正的半平面（橘）與負的半平面（灰藍）
      var p1 = [cx + nx * far * u, cy - ny * far * u], p2 = [cx - nx * far * u, cy + ny * far * u];
      var dx = ax / L * far * u, dy = -ay / L * far * u;
      s("path", { d: "M" + p1 + " L" + p2 + " L" + [p2[0] + dx, p2[1] + dy] + " L" + [p1[0] + dx, p1[1] + dy] + "Z", fill: "rgba(243,195,168,.18)" }, g);
      s("path", { d: "M" + p1 + " L" + p2 + " L" + [p2[0] - dx, p2[1] - dy] + " L" + [p1[0] - dx, p1[1] - dy] + "Z", fill: "rgba(157,181,178,.25)" }, g);
      s("line", { x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1], stroke: C.green.s, "stroke-width": 2.5, "stroke-dasharray": "8 5" }, g);
      SK.label(g, cx + nx * 150 + 8, cy - ny * 150, "內積 = 0", { size: 13, anchor: "start", color: C.green.s });
      SK.label(g, cx + ax / L * 150, cy - ay / L * 150 + 40, "內積 > 0", { size: 14, color: C.orange.s });
      SK.label(g, cx - ax / L * 150, cy + ay / L * 150 - 40, "內積 < 0", { size: 14, color: C.blue.s });
      SK.arrow(g, cx, cy, cx + ax * u, cy - ay * u, C.orange.s, 4);
      SK.arrow(g, cx, cy, cx + bb.x * u, cy - bb.y * u, C.blue.s, 4);
      SK.label(g, cx + ax * u + 12, cy - ay * u - 10, "a", { it: true, color: C.orange.s });
      hd.moveTo(cx + bb.x * u, cy - bb.y * u);
      var d = ax * bb.x + ay * bb.y;
      side.querySelector(".readout").innerHTML = SK.tex("\\vec a\\cdot\\vec b=" + SK.fmt(d, 2) + (Math.abs(d) < .15 ? "\\approx0\\ (\\perp)" : d > 0 ? ">0" : "<0"), true);
    }
    side.innerHTML = '<p style="margin-top:0">' + SK.md("固定 $\\vec a$，拖動 $\\vec b$ 的終點。和 $\\vec a$ 垂直的那條綠色線把平面切成兩半：$\\vec b$ 在 $\\vec a$ 那一側，影子朝前，內積為正；在另一側，影子朝後，內積為負；剛好在線上，影子縮成一點，內積為 0。") + '</p><div class="readout"></div>' +
      '<p class="muted" style="font-size:.95rem">' + SK.md("所以「$\\vec a\\cdot\\vec b=0\\iff\\vec a\\perp\\vec b$」不是規定，而是影子消失了。") + "</p>";
    draw();
  }

  SK.mountUnit({
    slug: "dot-product",
    en: "The length of a shadow, times a length",
    formula: "\\co{\\vec a}\\cdot\\cb{\\vec b}=|\\co{\\vec a}|\\,\\cv{|\\vec b|\\cos\\theta}=a_1b_1+a_2b_2",

    hook: {
      html: "拉行李箱時，手總是斜斜地往上拉。你用的力氣有一部分往上、一部分往前，只有往前的那部分讓箱子前進。",
      ask: "能不能用一個數字描述「一個向量有多少用在另一個向量的方向上」？",
      visual: hookVisual
    },

    guess: {
      q: "兩個向量的夾角是 $120^\\circ$，它們的內積是正的、負的，還是 0？",
      options: [
        { t: "正的", common: true, explain: "長度都是正的，乘起來感覺也該是正的，這很合理！但內積不只看長度，還看方向。夾角超過 $90^\\circ$，$\\vec b$ 的影子會落在 $\\vec a$ 的<b>反方向</b>，就像逆風走路，力氣在扯後腿。" },
        { t: "負的", truth: true, explain: "$\\cos120^\\circ=-\\tfrac12<0$。圖上看：$\\vec b$ 在 $\\vec a$ 方向的影子朝後，所以內積是負的。" },
        { t: "0", explain: "0 是夾角剛好 $90^\\circ$ 時的情況，那時影子縮成一個點。$120^\\circ$ 已經超過垂直了。" },
        { t: "看向量長度而定", explain: "長度會影響內積的<b>大小</b>，但不影響<b>正負</b>。正負只由夾角決定：小於 $90^\\circ$ 正、大於 $90^\\circ$ 負。" }
      ]
    },

    derive: {
      intro: "拖動兩個向量的終點（會自動對齊格子點），看影子怎麼變成內積。",
      tall: true,
      frames: [
        { cap: "兩個向量 $\\co{\\vec a}$、$\\cb{\\vec b}$，夾角 $\\theta$。", tex: "\\co{\\vec a},\\ \\cb{\\vec b},\\ \\theta" },
        { cap: "從垂直 $\\vec a$ 的方向打光，$\\vec b$ 在 $\\vec a$ 所在直線上留下<b>影子</b>。影子的（帶號）長度是 $|\\vec b|\\cos\\theta$，也叫正射影長。", tex: "\\text{影子}=\\cv{|\\vec b|\\cos\\theta}" },
        { cap: "內積就是「$\\vec a$ 的長度 × $\\vec b$ 在 $\\vec a$ 上的影子」。", tex: "\\co{\\vec a}\\cdot\\cb{\\vec b}=|\\co{\\vec a}|\\times\\cv{|\\vec b|\\cos\\theta}" },
        { cap: "拖動 $\\vec b$ 讓夾角超過 $90^\\circ$：影子跑到後面，內積變負。剛好垂直時影子消失，內積為 0。", tex: "\\begin{aligned}\\theta>90^\\circ&\\Rightarrow\\vec a\\cdot\\vec b<0\\\\ \\vec a\\perp\\vec b&\\iff\\vec a\\cdot\\vec b=0\\end{aligned}" },
        { cap: "為什麼坐標公式也成立？把 $\\vec a$、$\\vec b$ 和 $\\vec b-\\vec a$ 圍成三角形，用餘弦定理，再把長度寫成坐標。", tex: "|\\cg{\\vec b-\\vec a}|^2=|\\vec a|^2+|\\vec b|^2-2|\\vec a||\\vec b|\\cos\\theta" },
        { cap: "兩邊展開比一比，$a_1^2$、$b_1^2$ 這些平方項全部消掉，只剩交叉項。", tex: "\\begin{aligned}&(b_1-a_1)^2+(b_2-a_2)^2\\\\&=a_1^2+a_2^2+b_1^2+b_2^2-2\\,\\vec a\\cdot\\vec b\\\\&\\Rightarrow\\ \\vec a\\cdot\\vec b=a_1b_1+a_2b_2\\end{aligned}" },
        { cap: "最後，把影子當成一個向量：它在 $\\vec a$ 的方向上，長度是 $\\frac{\\vec a\\cdot\\vec b}{|\\vec a|}$。這就是<b>正射影向量</b>。", tex: "\\text{正射影}=\\cv{\\frac{\\vec a\\cdot\\vec b}{|\\vec a|^2}\\,\\vec a}" }
      ],
      hint: "拖動蜜桃色、灰藍色的終點，每一步都可以改變向量。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 520, 440, "兩個向量、影子與內積");
        var gridG = s("g", {}, svg), g = s("g", {}, svg), hg = s("g", {}, svg);
        var cx = 200, cy = 260, u = 44;
        var st = { a: [5, 1], b: [2, 4] };
        for (var i = -4; i <= 7; i++) s("line", { x1: cx + i * u, y1: 16, x2: cx + i * u, y2: 434, class: "m-grid" }, gridG);
        for (var j = -3; j <= 5; j++) s("line", { x1: 16, y1: cy - j * u, x2: 510, y2: cy - j * u, class: "m-grid" }, gridG);
        s("line", { x1: 16, y1: cy, x2: 510, y2: cy, class: "m-axis" }, gridG);
        s("line", { x1: cx, y1: 16, x2: cx, y2: 434, class: "m-axis" }, gridG);
        var read = SK.h("div", { class: "readout" });
        ctx.extra.appendChild(read);
        var hA = SK.handle(hg, 0, 0, C.orange.s, "向量 a 的終點");
        var hB = SK.handle(hg, 0, 0, C.blue.s, "向量 b 的終點");
        function snap(v, lo, hi) { return SK.clamp(Math.round(v), lo, hi); }
        SK.drag(svg, hA, function (x, y) {
          var nx = snap((x - cx) / u, -4, 7), ny = snap((cy - y) / u, -3, 5);
          if (nx || ny) { st.a = [nx, ny]; draw(); }
        }, function () { return [cx + st.a[0] * u, cy - st.a[1] * u]; }, u);
        SK.drag(svg, hB, function (x, y) {
          var nx = snap((x - cx) / u, -4, 7), ny = snap((cy - y) / u, -3, 5);
          if (nx || ny) { st.b = [nx, ny]; draw(); }
        }, function () { return [cx + st.b[0] * u, cy - st.b[1] * u]; }, u);
        function P(v) { return [cx + v[0] * u, cy - v[1] * u]; }
        function draw() {
          var f = ctx.frame, a = st.a, b = st.b;
          var la = Math.hypot(a[0], a[1]), lb = Math.hypot(b[0], b[1]);
          var dot = a[0] * b[0] + a[1] * b[1], k = dot / (la * la);
          var F = [a[0] * k, a[1] * k];
          var th = Math.acos(SK.clamp(dot / (la * lb), -1, 1));
          g.innerHTML = "";
          var A = P(a), B = P(b), Fp = P(F), O = [cx, cy];
          // a 所在的直線
          if (f >= 1) {
            var ux = a[0] / la, uy = a[1] / la;
            var e1 = P([ux * 12, uy * 12]), e2 = P([-ux * 12, -uy * 12]);
            s("line", { x1: e1[0], y1: e1[1], x2: e2[0], y2: e2[1], stroke: C.orange.s, "stroke-width": 1.2, "stroke-dasharray": "3 6", opacity: .7 }, g);
            s("line", { x1: B[0], y1: B[1], x2: Fp[0], y2: Fp[1], stroke: C.line, "stroke-width": 1.8, "stroke-dasharray": "5 4" }, g);
            if (lb * Math.abs(Math.sin(th)) > .3 && Math.abs(k) * la > .3) SK.rightMark(g, Fp[0], Fp[1], -ux * Math.sign(k || 1), uy * Math.sign(k || 1), (B[0] - Fp[0]) / Math.hypot(B[0] - Fp[0], B[1] - Fp[1]), (B[1] - Fp[1]) / Math.hypot(B[0] - Fp[0], B[1] - Fp[1]), 10);
            if (f >= 6) SK.arrow(g, O[0], O[1], Fp[0], Fp[1], C.purple.s, 7);
            else s("line", { x1: O[0], y1: O[1], x2: Fp[0], y2: Fp[1], stroke: C.purple.s, "stroke-width": 7, "stroke-linecap": "round", opacity: .85 }, g);
            SK.label(g, (O[0] + Fp[0]) / 2 + uy * 22, (O[1] + Fp[1]) / 2 + ux * 22, "影子", { size: 13, color: C.purple.s });
          }
          if (f >= 4) {
            SK.arrow(g, A[0], A[1], B[0], B[1], C.green.s, 2.6);
            SK.label(g, (A[0] + B[0]) / 2 + 14, (A[1] + B[1]) / 2 - 10, "b − a", { size: 14, anchor: "start", color: C.green.s });
          }
          SK.arrow(g, O[0], O[1], A[0], A[1], C.orange.s, 4);
          SK.arrow(g, O[0], O[1], B[0], B[1], C.blue.s, 4);
          SK.label(g, A[0] + 14, A[1] + 14, "a (" + a[0] + ", " + a[1] + ")", { size: 13, anchor: "start", color: C.orange.s });
          SK.label(g, B[0] + 14, B[1] - 12, "b (" + b[0] + ", " + b[1] + ")", { size: 13, anchor: "start", color: C.blue.s });
          var angA = Math.atan2(a[1], a[0]), angB = Math.atan2(b[1], b[0]);
          var d = angB - angA; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
          s("path", { d: SK.arcPath(cx, cy, 30, angA, angA + d), fill: "none", stroke: C.pink.s, "stroke-width": 2 }, g);
          SK.label(g, cx + 46 * Math.cos(angA + d / 2), cy - 46 * Math.sin(angA + d / 2), "θ", { it: true, color: C.pink.s });
          if (f === 3) {
            var msg = Math.abs(dot) < 1e-9 ? "垂直：影子消失，內積 = 0" : dot > 0 ? "影子同向：內積 > 0" : "影子反向：內積 < 0";
            SK.label(g, 260, 30, msg, { size: 15, color: Math.abs(dot) < 1e-9 ? C.green.s : dot > 0 ? C.orange.s : C.blue.s });
          }
          hA.moveTo(A[0], A[1]); hB.moveTo(B[0], B[1]);
          read.innerHTML = SK.tex("\\theta\\approx" + SK.fmt(SK.deg(th), 1) + "^\\circ,\\quad \\text{影子}=\\cv{" + SK.fmt(lb * Math.cos(th), 2) + "}", true) +
            SK.tex("|\\vec a|\\times\\text{影子}=" + SK.fmt(la, 2) + "\\times" + SK.fmt(lb * Math.cos(th), 2) + "=" + SK.fmt(dot, 2), true) +
            (f >= 5 ? SK.tex("a_1b_1+a_2b_2=" + a[0] + "\\times" + (b[0] < 0 ? "(" + b[0] + ")" : b[0]) + "+" + (a[1] < 0 ? "(" + a[1] + ")" : a[1]) + "\\times" + (b[1] < 0 ? "(" + b[1] + ")" : b[1]) + "=" + dot, true) : "");
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "內積的正負，就是平面的兩半", icon: "sparkle", render: signAngle },
      { title: "柯西不等式：影子不會比本人長", icon: "bulb",
        html: "因為 $|\\cos\\theta|\\le1$，影子的長度永遠不超過 $|\\vec b|$，所以 $$|\\vec a\\cdot\\vec b|\\le|\\vec a||\\vec b|\\quad\\Longleftrightarrow\\quad (a_1b_1+a_2b_2)^2\\le(a_1^2+a_2^2)(b_1^2+b_2^2).$$ 等號成立的時候，$\\vec b$ 和 $\\vec a$ 平行，影子就是本人。這條不等式在數 A 裡叫做柯西不等式（數 B 不需要）。" }
    ],

    challenges: [
      { q: "$\\vec b=(3,4)$ 在 $\\vec a=(1,0)$ 方向上的影子有多長？在 $(1,1)$ 方向上呢？", hint: "影子長 $=\\dfrac{\\vec a\\cdot\\vec b}{|\\vec a|}$。",
        idea: "在 $(1,0)$ 上是 $3$，就是 $x$ 坐標！在 $(1,1)$ 上是 $\\dfrac{7}{\\sqrt2}\\approx4.95$。坐標其實就是在坐標軸上的影子。" },
      { q: "用 50 牛頓的力，沿著和地面夾 $60^\\circ$ 的方向拉箱子前進 10 公尺，做了多少功？（功＝力 · 位移）", hint: "只有沿地面的分量在做功。",
        idea: "$W=50\\times10\\times\\cos60^\\circ=250$ 焦耳。物理的功本來就是內積。" },
      { q: "找出所有和 $(2,1)$ 內積等於 $5$ 的向量終點。它們排成什麼形狀？", hint: "內積等於 5 代表「在 $(2,1)$ 方向的影子長」固定。",
        idea: "影子固定，終點就在一條和 $(2,1)$ 垂直的直線上：$2x+y=5$。這就是直線方程式的向量看法，$(2,1)$ 是它的法向量。" }
    ],

    where: {
      codes: [["G-11A-6", "（數 A）平面向量內積、正射影、面積與二階行列式、夾角、平垂判定、柯西不等式"], ["G-11B-2", "（數 B）平面向量的正射影、內積、平垂判定、兩向量夾角"]],
      exam: "11 年級數 A、數 B 都有，學測數 A、數 B 都在範圍內。數 A 會再往空間向量、外積、平面方程式發展，法向量的想法就從這裡開始。",
      stop: "數 B 只到內積、正射影、夾角與垂直判定；柯西不等式和行列式是數 A 的內容。用柯西不等式解釋相關係數的範圍屬於 `※` 延伸，可以欣賞一次，不必發展成抽象的內積空間。"
    }
  });
})();
