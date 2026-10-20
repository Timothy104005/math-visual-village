/* 單元 7：和角公式 */
(function () {
  var C = SK.C, s = SK.s;

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 300, "30 度加 45 度等於 75 度");
    var cx = 70, cy = 260, R = 210;
    s("path", { d: "M" + (cx + R) + " " + cy + " A" + R + " " + R + " 0 0 0 " + cx + " " + (cy - R), fill: "none", stroke: C.line, "stroke-width": 2 }, svg);
    s("line", { x1: cx, y1: cy, x2: cx + R + 10, y2: cy, class: "m-axis" }, svg);
    s("line", { x1: cx, y1: cy, x2: cx, y2: cy - R - 10, class: "m-axis" }, svg);
    [[30, C.orange], [75, C.blue]].forEach(function (d) {
      var a = SK.rad(d[0]);
      s("line", { x1: cx, y1: cy, x2: cx + R * Math.cos(a), y2: cy - R * Math.sin(a), stroke: d[1].s, "stroke-width": 3 }, svg);
    });
    s("path", { d: SK.arcPath(cx, cy, 60, 0, SK.rad(30)), fill: "none", stroke: C.orange.s, "stroke-width": 2.5 }, svg);
    s("path", { d: SK.arcPath(cx, cy, 90, SK.rad(30), SK.rad(75)), fill: "none", stroke: C.green.s, "stroke-width": 2.5 }, svg);
    SK.label(svg, cx + 78, cy - 18, "30°", { size: 14, color: C.orange.s });
    SK.label(svg, cx + 84, cy - 78, "45°", { size: 14, color: C.green.s });
    var a75 = SK.rad(75), px = cx + R * Math.cos(a75), py = cy - R * Math.sin(a75);
    s("circle", { cx: px, cy: py, r: 6, fill: C.blue.s }, svg);
    s("line", { x1: px, y1: py, x2: px, y2: cy, stroke: C.blue.s, "stroke-dasharray": "4 4" }, svg);
    SK.label(svg, px + 16, (py + cy) / 2, "sin 75° = ?", { size: 15, anchor: "start", color: C.blue.s });
  }

  function rotateAngle(el) {
    var wrap = SK.h("div", { class: "two-col" });
    var st = SK.h("div", { class: "stage" }), side = SK.h("div", { class: "sliders" });
    wrap.appendChild(st); wrap.appendChild(side); el.appendChild(wrap);
    var svg = SK.svg(st, 400, 400, "旋轉後的坐標軸與和角");
    var g = s("g", {}, svg);
    var stt = { a: 35, b: 30 };
    var cx = 200, cy = 220, R = 150;
    function P(x, y) { return [cx + x * R, cy - y * R]; }
    function draw() {
      g.innerHTML = "";
      var a = SK.rad(stt.a), b = SK.rad(stt.b);
      s("circle", { cx: cx, cy: cy, r: R, fill: "none", stroke: C.line, "stroke-width": 1.8 }, g);
      s("line", { x1: cx - R - 20, y1: cy, x2: cx + R + 20, y2: cy, class: "m-axis" }, g);
      s("line", { x1: cx, y1: cy + R + 20, x2: cx, y2: cy - R - 20, class: "m-axis" }, g);
      var e1 = [Math.cos(a), Math.sin(a)], e2 = [-Math.sin(a), Math.cos(a)];
      [e1, e2].forEach(function (e) {
        var p = P(e[0] * 1.2, e[1] * 1.2), q = P(-e[0] * 1.2, -e[1] * 1.2);
        s("line", { x1: q[0], y1: q[1], x2: p[0], y2: p[1], stroke: C.purple.s, "stroke-dasharray": "6 5", "stroke-width": 1.4 }, g);
      });
      var A = P(e1[0] * Math.cos(b), e1[1] * Math.cos(b));
      var Pp = P(Math.cos(a + b), Math.sin(a + b));
      SK.arrow(g, cx, cy, A[0], A[1], C.orange.s, 3);
      SK.arrow(g, A[0], A[1], Pp[0], Pp[1], C.green.s, 3);
      s("line", { x1: cx, y1: cy, x2: Pp[0], y2: Pp[1], stroke: C.ink, "stroke-width": 2 }, g);
      s("circle", { cx: Pp[0], cy: Pp[1], r: 6, fill: C.blue.s }, g);
      SK.label(g, (cx + A[0]) / 2 + 12 * Math.sin(a), (cy + A[1]) / 2 + 12 * Math.cos(a) + 4, "cos β", { size: 13, color: C.orange.s });
      SK.label(g, (A[0] + Pp[0]) / 2 + 26, (A[1] + Pp[1]) / 2, "sin β", { size: 13, color: C.green.s });
      s("path", { d: SK.arcPath(cx, cy, 28, 0, a), fill: "none", stroke: C.purple.s, "stroke-width": 2 }, g);
      SK.label(g, cx + 42 * Math.cos(a / 2), cy - 42 * Math.sin(a / 2), "α", { it: true, color: C.purple.s });
      side.querySelector(".readout").innerHTML = SK.tex("\\begin{pmatrix}\\cos(\\alpha+\\beta)\\\\\\sin(\\alpha+\\beta)\\end{pmatrix}=\\co{\\cos\\beta}\\begin{pmatrix}\\cos\\alpha\\\\\\sin\\alpha\\end{pmatrix}+\\cg{\\sin\\beta}\\begin{pmatrix}-\\sin\\alpha\\\\\\cos\\alpha\\end{pmatrix}", true);
    }
    side.appendChild(SK.slider({ label: "$\\alpha$", min: 0, max: 180, value: stt.a, fmt: function (v) { return v + "°"; }, onInput: function (v) { stt.a = v; draw(); } }).el);
    side.appendChild(SK.slider({ label: "$\\beta$", min: 0, max: 180, value: stt.b, color: "green", fmt: function (v) { return v + "°"; }, onInput: function (v) { stt.b = v; draw(); } }).el);
    side.insertAdjacentHTML("beforeend", '<div class="readout"></div><p class="muted" style="margin:0;font-size:.95rem">' +
      SK.md("把整個坐標系統轉 $\\alpha$（灰紫色虛線）。在新坐標系裡，角 $\\beta$ 的點是「沿新 $x$ 軸走 $\\cos\\beta$，再沿新 $y$ 軸走 $\\sin\\beta$」。分別取兩個分量，就一次得到兩條和角公式；而且這個方法對<b>任何角度</b>都成立，不限銳角。這也是數 A「線性變換」裡旋轉矩陣的由來。") + "</p>");
    draw();
  }

  SK.mountUnit({
    slug: "angle-sum",
    en: "Two right triangles stacked into a rectangle",
    formula: "\\begin{aligned}\\sin(\\alpha+\\beta)&=\\cb{\\sin\\alpha\\cos\\beta}+\\cg{\\cos\\alpha\\sin\\beta}\\\\\\cos(\\alpha+\\beta)&=\\co{\\cos\\alpha\\cos\\beta}-\\cp{\\sin\\alpha\\sin\\beta}\\end{aligned}",

    hook: {
      html: "我們背得出 $\\sin30^\\circ=\\tfrac12$、$\\sin45^\\circ=\\tfrac{\\sqrt2}{2}$。而 $75^\\circ=30^\\circ+45^\\circ$。",
      ask: "能不能只用 $30^\\circ$ 和 $45^\\circ$ 的三角比，算出 $\\sin75^\\circ$？",
      visual: hookVisual
    },

    guess: {
      q: "你覺得 $\\sin(\\alpha+\\beta)$ 等於什麼？",
      options: [
        { t: "$\\sin\\alpha+\\sin\\beta$", common: true, explain: "這是最自然的猜測，因為很多運算都可以「分配」。但試試 $\\alpha=\\beta=45^\\circ$：左邊 $\\sin90^\\circ=1$，右邊 $\\sqrt2\\approx1.41$。$\\sin$ 值不可能超過 1，所以一定不對！$\\sin$ 是「高度」，高度不是這樣疊加的。" },
        { t: "$\\sin\\alpha\\cos\\beta+\\cos\\alpha\\sin\\beta$", truth: true, explain: "每一項都是一個「影子乘影子」。等一下你會在圖上看到這兩項分別是兩段高度，疊起來就是 $\\sin(\\alpha+\\beta)$。" },
        { t: "$\\cos\\alpha\\cos\\beta+\\sin\\alpha\\sin\\beta$", explain: "好眼力，你已經知道答案會有「兩項相乘再相加」的形狀！不過這個式子其實是 $\\cos(\\alpha-\\beta)$。試試 $\\alpha=\\beta$：它等於 $1=\\cos0^\\circ$。" },
        { t: "$\\sin\\alpha\\cdot\\sin\\beta$", explain: "$\\alpha=90^\\circ,\\beta=0^\\circ$ 時，左邊 $\\sin90^\\circ=1$，右邊卻是 $1\\times0=0$。乘法也不對，得看圖才知道怎麼組合。" }
      ]
    },

    derive: {
      intro: "我們把兩個直角三角形疊在一起，再用一個長方形把它們框起來。拖動滑桿改變 $\\alpha$、$\\beta$（這張圖先處理 $\\alpha+\\beta<90^\\circ$）。",
      tall: true,
      frames: [
        { cap: "從原點出發，先轉 $\\alpha$，再轉 $\\beta$，到達點 $P$，$\\overline{OP}=1$。在 $P$ 往第一條射線作垂線，垂足是 $Q$。", tex: "\\overline{OP}=1,\\quad \\angle POQ=\\beta" },
        { cap: "在直角三角形 $OQP$ 中，斜邊是 1，所以兩股就是 $\\cos\\beta$ 和 $\\sin\\beta$。", tex: "\\overline{OQ}=\\cos\\beta,\\quad \\overline{QP}=\\sin\\beta" },
        { cap: "$P$ 和 $x$ 軸夾 $\\alpha+\\beta$，所以 $P$ 的高度和水平距離正是我們要的答案。用長方形把它框起來。", tex: "P=(\\cos(\\alpha+\\beta),\\ \\sin(\\alpha+\\beta))" },
        { cap: "下面的直角三角形：斜邊 $\\cos\\beta$、角 $\\alpha$。底邊是 $\\cos\\alpha\\cos\\beta$，高是 $\\sin\\alpha\\cos\\beta$。", tex: "\\co{\\cos\\alpha\\cos\\beta},\\quad \\cb{\\sin\\alpha\\cos\\beta}" },
        { cap: "上面的直角三角形：斜邊 $\\sin\\beta$。$QP$ 垂直 $OQ$，所以 $QP$ 和鉛直線的夾角也是 $\\alpha$。直立邊是 $\\cos\\alpha\\sin\\beta$，水平邊是 $\\sin\\alpha\\sin\\beta$。", tex: "\\cg{\\cos\\alpha\\sin\\beta},\\quad \\cp{\\sin\\alpha\\sin\\beta}" },
        { cap: "看長方形的<b>右邊</b>：$P$ 的高度由灰藍、綠兩段疊成。", tex: "\\sin(\\alpha+\\beta)=\\cb{\\sin\\alpha\\cos\\beta}+\\cg{\\cos\\alpha\\sin\\beta}" },
        { cap: "看長方形的<b>上邊</b>：$P$ 的水平距離是蜜桃色的整段，扣掉玫瑰色那段。", tex: "\\cos(\\alpha+\\beta)=\\co{\\cos\\alpha\\cos\\beta}-\\cp{\\sin\\alpha\\sin\\beta}" }
      ],
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 520, 440, "兩個直角三角形疊成長方形");
        var g = s("g", {}, svg);
        var st = { a: 30, b: 35 };
        var ox = 70, oy = 400, u = 330;
        function P(x, y) { return [ox + x * u, oy - y * u]; }
        var read = SK.h("div", { class: "readout" });
        ctx.extra.appendChild(read);
        var slA, slB;
        function draw() {
          var f = ctx.frame, a = SK.rad(st.a), b = SK.rad(st.b);
          var ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b);
          var O = P(0, 0), Q = P(ca * cb, sa * cb), Pp = P(Math.cos(a + b), Math.sin(a + b));
          var E = P(ca * cb, 0), R = P(ca * cb, Math.sin(a + b)), T = P(0, Math.sin(a + b));
          g.innerHTML = "";
          s("line", { x1: ox - 20, y1: oy, x2: 500, y2: oy, class: "m-axis" }, g);
          s("line", { x1: ox, y1: oy + 20, x2: ox, y2: 20, class: "m-axis" }, g);
          if (f >= 2) {
            s("rect", { x: T[0], y: T[1], width: E[0] - O[0], height: O[1] - T[1], fill: "rgba(241,226,184,.25)", stroke: C.ink, "stroke-width": 1.6, "stroke-dasharray": "7 5" }, g);
          }
          if (f >= 3) s("path", { d: "M" + O + " L" + E + " L" + Q + "Z", fill: C.gold.f, opacity: .7 }, g);
          if (f >= 4) s("path", { d: "M" + Q + " L" + R + " L" + Pp + "Z", fill: C.sky || "rgba(157,181,178,.35)", opacity: .7 }, g);
          // 第一條射線（角 α）
          var far = P(Math.cos(a) * 1.15, Math.sin(a) * 1.15);
          s("line", { x1: O[0], y1: O[1], x2: far[0], y2: far[1], stroke: C.purple.s, "stroke-width": 1.4, "stroke-dasharray": "4 5" }, g);
          s("path", { d: SK.arcPath(O[0], O[1], 46, 0, a), fill: "none", stroke: C.purple.s, "stroke-width": 2 }, g);
          SK.label(g, O[0] + 62 * Math.cos(a / 2), O[1] - 62 * Math.sin(a / 2), "α", { it: true, color: C.purple.s });
          s("path", { d: SK.arcPath(O[0], O[1], 76, a, a + b), fill: "none", stroke: C.pink.s, "stroke-width": 2 }, g);
          SK.label(g, O[0] + 92 * Math.cos(a + b / 2), O[1] - 92 * Math.sin(a + b / 2), "β", { it: true, color: C.pink.s });
          // 三角形 OQP
          s("line", { x1: O[0], y1: O[1], x2: Pp[0], y2: Pp[1], stroke: C.ink, "stroke-width": 3 }, g);
          s("line", { x1: O[0], y1: O[1], x2: Q[0], y2: Q[1], stroke: C.ink, "stroke-width": 2.2 }, g);
          s("line", { x1: Q[0], y1: Q[1], x2: Pp[0], y2: Pp[1], stroke: C.ink, "stroke-width": 2.2 }, g);
          SK.rightMark(g, Q[0], Q[1], -ca, sa, -sa, -ca, 12);
          SK.label(g, (O[0] + Pp[0]) / 2 - 14, (O[1] + Pp[1]) / 2 - 8, "1", { size: 16 });
          if (f >= 1 && f < 3) {
            SK.label(g, (O[0] + Q[0]) / 2 + 10, (O[1] + Q[1]) / 2 + 20, "cos β", { size: 14 });
            SK.label(g, (Q[0] + Pp[0]) / 2 + 30, (Q[1] + Pp[1]) / 2, "sin β", { size: 14 });
          }
          s("circle", { cx: Pp[0], cy: Pp[1], r: 6, fill: C.blue.s }, g);
          SK.label(g, Pp[0] - 4, Pp[1] - 16, "P", { size: 13, color: C.soft });
          SK.label(g, Q[0] + 14, Q[1] + 4, "Q", { size: 13, color: C.soft });
          SK.label(g, O[0] - 12, O[1] + 14, "O", { size: 13, color: C.soft });
          if (f >= 3) {
            s("line", { x1: O[0], y1: O[1] + 16, x2: E[0], y2: E[1] + 16, stroke: C.orange.s, "stroke-width": 5, "stroke-linecap": "round" }, g);
            SK.label(g, (O[0] + E[0]) / 2, O[1] + 30, "cos α cos β", { size: 13, color: C.orange.s });
            s("line", { x1: E[0] + 16, y1: E[1], x2: Q[0] + 16, y2: Q[1], stroke: C.blue.s, "stroke-width": 5, "stroke-linecap": "round" }, g);
            SK.label(g, E[0] + 26, (E[1] + Q[1]) / 2, "sin α cos β", { size: 13, anchor: "start", color: C.blue.s });
            SK.rightMark(g, E[0], E[1], -1, 0, 0, -1, 10);
          }
          if (f >= 4) {
            s("line", { x1: Q[0] + 16, y1: Q[1], x2: R[0] + 16, y2: R[1], stroke: C.green.s, "stroke-width": 5, "stroke-linecap": "round" }, g);
            SK.label(g, R[0] + 26, (R[1] + Q[1]) / 2, "cos α sin β", { size: 13, anchor: "start", color: C.green.s });
            s("line", { x1: Pp[0], y1: T[1] - 16, x2: R[0], y2: R[1] - 16, stroke: C.pink.s, "stroke-width": 5, "stroke-linecap": "round" }, g);
            SK.label(g, (Pp[0] + R[0]) / 2, T[1] - 30, "sin α sin β", { size: 13, color: C.pink.s });
            s("path", { d: SK.arcPath(Q[0], Q[1], 26, Math.PI / 2, Math.PI / 2 + a), fill: "none", stroke: C.purple.s, "stroke-width": 2 }, g);
            SK.label(g, Q[0] - 10, Q[1] - 38, "α", { it: true, size: 16, color: C.purple.s });
            SK.rightMark(g, R[0], R[1], -1, 0, 0, 1, 10);
          }
          if (f >= 5) {
            s("line", { x1: R[0] + 42, y1: E[1], x2: R[0] + 42, y2: R[1], stroke: C.ink, "stroke-width": 1.4 }, g);
            SK.label(g, R[0] + 50, R[1] - 8, "sin(α+β)", { size: 12, anchor: "start" });
          }
          if (f >= 6) {
            s("line", { x1: T[0], y1: T[1] - 44, x2: Pp[0], y2: Pp[1] - 44, stroke: C.ink, "stroke-width": 1.4 }, g);
            SK.label(g, (T[0] + Pp[0]) / 2, T[1] - 56, "cos(α+β)", { size: 12 });
          }
          var fmt = function (x) { return SK.fmt(x, 3); };
          read.innerHTML = SK.tex("\\sin(" + st.a + "^\\circ+" + st.b + "^\\circ)=" + fmt(Math.sin(a + b)) + "=\\cb{" + fmt(sa * cb) + "}+\\cg{" + fmt(ca * sb) + "}", true) +
            SK.tex("\\cos(" + st.a + "^\\circ+" + st.b + "^\\circ)=" + fmt(Math.cos(a + b)) + "=\\co{" + fmt(ca * cb) + "}-\\cp{" + fmt(sa * sb) + "}", true);
        }
        slA = SK.slider({ label: "$\\alpha$", min: 5, max: 70, value: st.a, fmt: function (v) { return v + "°"; }, onInput: function (v) { st.a = v; if (st.a + st.b > 85) { st.b = 85 - st.a; slB.set(st.b, true); } draw(); } });
        slB = SK.slider({ label: "$\\beta$", min: 5, max: 70, value: st.b, color: "green", fmt: function (v) { return v + "°"; }, onInput: function (v) { st.b = v; if (st.a + st.b > 85) { st.a = 85 - st.b; slA.set(st.a, true); } draw(); } });
        ctx.sliders.appendChild(slA.el); ctx.sliders.appendChild(slB.el);
        return { show: draw };
      }
    },

    angles: [
      { title: "轉動整個坐標系統", icon: "sparkle", render: rotateAngle },
      { title: "順手得到倍角公式", icon: "bulb",
        html: "令 $\\beta=\\alpha$，兩條和角公式馬上變成倍角公式，不必另外背：$$\\sin2\\alpha=2\\sin\\alpha\\cos\\alpha,\\qquad \\cos2\\alpha=\\cos^2\\alpha-\\sin^2\\alpha.$$ 再用 $\\sin^2\\alpha+\\cos^2\\alpha=1$ 改寫，就得到 $\\cos2\\alpha=1-2\\sin^2\\alpha=2\\cos^2\\alpha-1$，半角公式也從這裡解出來。一張圖，一整個家族。" }
    ],

    challenges: [
      { q: "用和角公式算出 $\\sin75^\\circ$ 的精確值，再用計算機檢查。", hint: "$75^\\circ=45^\\circ+30^\\circ$。",
        idea: "$\\sin75^\\circ=\\tfrac{\\sqrt2}{2}\\cdot\\tfrac{\\sqrt3}{2}+\\tfrac{\\sqrt2}{2}\\cdot\\tfrac12=\\tfrac{\\sqrt6+\\sqrt2}{4}\\approx0.966$。" },
      { q: "不畫新圖，只用「把 $\\beta$ 換成 $-\\beta$」推出 $\\cos(\\alpha-\\beta)$ 和 $\\sin(\\alpha-\\beta)$。", hint: "單位圓上 $-\\beta$ 的點是 $\\beta$ 的點對 $x$ 軸鏡射：$\\cos(-\\beta)=\\cos\\beta$，$\\sin(-\\beta)=-\\sin\\beta$。",
        idea: "$\\cos(\\alpha-\\beta)=\\cos\\alpha\\cos\\beta+\\sin\\alpha\\sin\\beta$，$\\sin(\\alpha-\\beta)=\\sin\\alpha\\cos\\beta-\\cos\\alpha\\sin\\beta$。「換個角度看」的旋轉圖本來就對任何角度都成立，所以可以放心代負角。" },
      { q: "自己推推看 $\\tan(\\alpha+\\beta)$ 的公式。這條公式課綱說「以推論練習為原則」，你覺得為什麼？", hint: "$\\tan=\\dfrac{\\sin}{\\cos}$，分子分母同除以 $\\cos\\alpha\\cos\\beta$。",
        idea: "$\\tan(\\alpha+\\beta)=\\dfrac{\\tan\\alpha+\\tan\\beta}{1-\\tan\\alpha\\tan\\beta}$。它完全可以從 $\\sin$、$\\cos$ 的公式推出來，所以重點是會推，不是多背一條。" }
    ],

    where: {
      codes: [["G-11A-5", "正弦、餘弦的和差角、倍角、半角公式；正切公式以推論練習為原則"]],
      exam: "11 年級<b>數學 A</b> 的內容，學測數 A、分科數甲都在範圍內；數學 B 沒有這個單元。它是 `F-11A-2` 波的疊合（把 $a\\sin x+b\\cos x$ 合成一個波）的基礎。",
      stop: "正弦、餘弦的和差角、倍角、半角就是全部。正切公式以推論練習為主；積化和差、和差化積這類大量變形與多層化簡不是核心；$\\cot$、$\\sec$、$\\csc$ 的圖形屬於 `※` 延伸。"
    }
  });
})();
