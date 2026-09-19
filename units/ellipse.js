/* 單元：橢圓的定義、標準式與參數式 */
(function () {
  var C = SK.C, s = SK.s;

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 250, "兩根釘子、一條繩子、一支筆");
    var cx = 200, cy = 125, a = 150, b = 90, c = Math.sqrt(a * a - b * b), t = 1.1;
    var P = [cx + a * Math.cos(t), cy - b * Math.sin(t)];
    s("ellipse", { cx: cx, cy: cy, rx: a, ry: b, fill: "none", stroke: C.line, "stroke-width": 1.4, "stroke-dasharray": "5 5" }, svg);
    [[cx - c, cy], [cx + c, cy]].forEach(function (F) {
      s("line", { x1: F[0], y1: F[1], x2: P[0], y2: P[1], stroke: C.orange.s, "stroke-width": 2 }, svg);
      s("circle", { cx: F[0], cy: F[1], r: 6, fill: C.gold.f, stroke: C.cocoa, "stroke-width": 1.3 }, svg);
    });
    s("circle", { cx: P[0], cy: P[1], r: 6, fill: C.blue.f, stroke: C.cocoa, "stroke-width": 1.3 }, svg);
    SK.label(svg, P[0] + 12, P[1] - 10, "筆", { size: 13, anchor: "start" });
    SK.label(svg, 200, 240, "繩子拉緊，繞一圈會畫出什麼？", { size: 13, color: C.soft });
  }

  SK.mountUnit({
    slug: "ellipse",
    en: "A loop of string around two pins",
    formula: "\\overline{PF_1}+\\overline{PF_2}=2\\co{a}\\ \\Longrightarrow\\ \\frac{x^2}{\\co{a}^2}+\\frac{y^2}{\\cb{b}^2}=1,\\quad \\cb{b}^2=\\co{a}^2-\\cg{c}^2",

    hook: {
      html: "在紙上釘兩根釘子，把一條比兩釘距離長的繩子兩端綁在釘子上，用筆把繩子拉緊，繞著畫一圈。",
      ask: "畫出來的是什麼形狀？筆在任何位置時，有什麼東西是不變的？",
      visual: hookVisual
    },

    guess: {
      q: "用上面的方法畫出來的圖形是？",
      options: [
        { t: "一個圓", common: true, explain: "如果兩根釘子釘在同一個位置，確實會畫出圓！但兩釘分開時，筆在兩端能走得比較遠、上下比較近，圖形被拉長了。" },
        { t: "一個橢圓", truth: true, explain: "繩長固定，所以筆到兩根釘子的距離<b>和</b>永遠不變。滿足這個條件的點就是橢圓，兩根釘子的位置叫做<b>焦點</b>。" },
        { t: "兩個拋物線拼起來", explain: "看起來兩端有點像，但仔細量會發現形狀不一樣。拋物線會一直打開，不會繞回來。" },
        { t: "蛋形（一邊大一邊小）", explain: "兩根釘子的地位完全對稱，所以左右兩端一樣大，不會一邊胖一邊瘦。" }
      ]
    },

    derive: {
      intro: "拖動滑桿改變 $a$（半長軸）、$c$（焦點到中心的距離），以及筆的位置。",
      tall: true,
      frames: [
        { cap: "兩個焦點 $F_1(-c,0)$、$F_2(c,0)$，繩長 $2a$。筆 $P$ 在任何位置，兩段距離的和都是 $2a$。", tex: "\\overline{P\\co{F_1}}+\\overline{P\\co{F_2}}=2a" },
        { cap: "筆走一圈，畫出一個<b>橢圓</b>。$c$ 越接近 0 越像圓，$c$ 越接近 $a$ 越扁。", tex: "0<c<a" },
        { cap: "筆在最上面時，兩段繩一樣長，都是 $a$，和中心、焦點圍成直角三角形。所以半短軸 $b$ 滿足 $b^2+c^2=a^2$。", tex: "\\cb{b}^2+\\cg{c}^2=\\co{a}^2" },
        { cap: "把距離和的條件寫成坐標，兩次平方整理後，就是<b>標準式</b>。", tex: "\\begin{gathered}\\sqrt{(x+c)^2+y^2}+\\sqrt{(x-c)^2+y^2}=2a\\\\ \\Rightarrow\\ \\frac{x^2}{a^2}+\\frac{y^2}{b^2}=1\\end{gathered}" },
        { cap: "<b>參數式</b>：先在半徑 $a$ 的圓上取點 $(a\\cos\\theta,a\\sin\\theta)$，再把高度壓成 $\\frac ba$ 倍。橢圓就是被<b>伸縮</b>過的圓。", tex: "(x,y)=(\\co{a}\\cos\\theta,\\ \\cb{b}\\sin\\theta)" }
      ],
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 520, 420, "橢圓的焦點、長短軸與參數式");
        var g = s("g", {}, svg);
        var st = { a: 4, c: 2.6, t: 1 };
        var cx = 260, cy = 210, u = 52;
        function P(x, y) { return [cx + x * u, cy - y * u]; }
        var read = SK.h("div", { class: "readout" });
        var slA = SK.slider({ label: "$a$", min: 2, max: 4.6, step: .05, value: st.a, onInput: function (v) { st.a = v; if (st.c >= v) st.c = v - .1; draw(); } });
        var slC = SK.slider({ label: "$c$", min: 0, max: 4.4, step: .05, value: st.c, color: "green", onInput: function (v) { st.c = Math.min(v, st.a - .05); draw(); } });
        var slT = SK.slider({ label: "筆", min: 0, max: 6.28, step: .01, value: st.t, color: "blue", fmt: function (v) { return SK.fmt(SK.deg(v), 0) + "°"; }, onInput: function (v) { st.t = v; draw(); } });
        ctx.sliders.appendChild(slA.el); ctx.sliders.appendChild(slC.el); ctx.sliders.appendChild(slT.el);
        ctx.extra.appendChild(read);
        function draw() {
          var f = ctx.frame, a = st.a, c = st.c, b = Math.sqrt(a * a - c * c), t = st.t;
          var px = a * Math.cos(t), py = b * Math.sin(t);
          g.innerHTML = "";
          s("line", { x1: 10, y1: cy, x2: 510, y2: cy, class: "m-axis" }, g);
          s("line", { x1: cx, y1: 10, x2: cx, y2: 410, class: "m-axis" }, g);
          if (f >= 4) {
            s("circle", { cx: cx, cy: cy, r: a * u, fill: "none", stroke: C.line, "stroke-dasharray": "5 5" }, g);
            var Q = P(a * Math.cos(t), a * Math.sin(t));
            s("line", { x1: Q[0], y1: Q[1], x2: Q[0], y2: cy, stroke: C.purple.s, "stroke-dasharray": "3 4" }, g);
            s("line", { x1: cx, y1: cy, x2: Q[0], y2: Q[1], stroke: C.purple.s, "stroke-width": 1.2 }, g);
            s("circle", { cx: Q[0], cy: Q[1], r: 4.5, fill: C.purple.f, stroke: C.purple.s }, g);
            s("path", { d: SK.arcPath(cx, cy, 26, 0, t), fill: "none", stroke: C.purple.s, "stroke-width": 1.6 }, g);
            SK.label(g, cx + 40 * Math.cos(t / 2), cy - 40 * Math.sin(t / 2), "θ", { it: true, color: C.purple.s });
          }
          if (f >= 1) s("ellipse", { cx: cx, cy: cy, rx: a * u, ry: b * u, fill: "rgba(241,226,184,.25)", stroke: C.ink, "stroke-width": 2.4 }, g);
          var F1 = P(-c, 0), F2 = P(c, 0), Pp = P(px, py);
          if (f === 2) {
            var T = P(0, b);
            s("path", { d: "M" + cx + " " + cy + " L" + F2[0] + " " + F2[1] + " L" + T[0] + " " + T[1] + "Z", fill: C.mint.f, stroke: C.green.s, "stroke-width": 1.4 }, g);
            SK.rightMark(g, cx, cy, 1, 0, 0, -1, 10);
            SK.label(g, (cx + F2[0]) / 2, cy + 16, "c", { it: true, color: C.green.s });
            SK.label(g, cx - 12, (cy + T[1]) / 2, "b", { it: true, color: C.blue.s });
            SK.label(g, (F2[0] + T[0]) / 2 + 12, (F2[1] + T[1]) / 2 - 6, "a", { it: true, color: C.orange.s });
          }
          if (f !== 2) {
            s("line", { x1: F1[0], y1: F1[1], x2: Pp[0], y2: Pp[1], stroke: C.orange.s, "stroke-width": 2.6 }, g);
            s("line", { x1: F2[0], y1: F2[1], x2: Pp[0], y2: Pp[1], stroke: C.orange.s, "stroke-width": 2.6, "stroke-dasharray": "7 4" }, g);
            s("circle", { cx: Pp[0], cy: Pp[1], r: 6.5, fill: C.blue.f, stroke: C.cocoa, "stroke-width": 1.3 }, g);
          }
          [F1, F2].forEach(function (F, i) { s("circle", { cx: F[0], cy: F[1], r: 6, fill: C.gold.f, stroke: C.cocoa, "stroke-width": 1.3 }, g); SK.label(g, F[0], F[1] + 18, i ? "F₂" : "F₁", { size: 13 }); });
          if (f >= 2) {
            SK.label(g, P(a, 0)[0] + 8, cy - 10, "a", { it: true, anchor: "start", color: C.orange.s });
            SK.label(g, cx + 10, P(0, b)[1] - 10, "b", { it: true, anchor: "start", color: C.blue.s });
          }
          slT.el.style.display = f === 2 ? "none" : "";
          var d1 = Math.hypot(px + c, py), d2 = Math.hypot(px - c, py);
          read.innerHTML = SK.tex("\\overline{PF_1}+\\overline{PF_2}=" + SK.fmt(d1, 2) + "+" + SK.fmt(d2, 2) + "=" + SK.fmt(d1 + d2, 2) + "=2a", true) +
            SK.tex("\\frac{x^2}{" + SK.fmt(a * a, 2) + "}+\\frac{y^2}{" + SK.fmt(b * b, 2) + "}=1", true);
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "伸縮與平移", icon: "sparkle",
        html: "單位圓 $x^2+y^2=1$ 水平放大 $a$ 倍、鉛直放大 $b$ 倍，就是 $\\dfrac{x^2}{a^2}+\\dfrac{y^2}{b^2}=1$：把「新的 $x$」除以 $a$ 才會回到圓上。中心搬到 $(h,k)$，就寫成 $\\dfrac{(x-h)^2}{a^2}+\\dfrac{(y-k)^2}{b^2}=1$。這和「線性變換」單元把圓變成橢圓是同一件事；旋轉的橢圓會多出 $xy$ 項，高中只要能「認識」它。" },
      { title: "行星的軌道", icon: "leaf",
        html: "克卜勒發現行星繞太陽的軌道是橢圓，太陽在其中一個焦點上。地球軌道的 $\\dfrac ca$ 大約只有 $0.017$，幾乎是圓；哈雷彗星的 $\\dfrac ca\\approx0.97$，是一個非常扁的橢圓，所以它大部分時間都在遠方，每 76 年才回來一次。" }
    ],

    challenges: [
      { q: "$\\dfrac{x^2}{25}+\\dfrac{y^2}{9}=1$ 的焦點在哪裡？長軸、短軸各多長？", idea: "$a=5$、$b=3$，$c=\\sqrt{25-9}=4$。焦點 $(\\pm4,0)$，長軸 10、短軸 6。" },
      { q: "焦點 $(0,\\pm3)$、長軸長 10 的橢圓方程式是什麼？", hint: "焦點在 $y$ 軸上，所以長軸是鉛直的。",
        idea: "$a=5$、$c=3$、$b=4$，長軸在 $y$ 軸：$\\dfrac{x^2}{16}+\\dfrac{y^2}{25}=1$。" },
      { q: "橢圓 $\\dfrac{x^2}{a^2}+\\dfrac{y^2}{b^2}=1$ 的面積是多少？用「伸縮」的想法猜猜看。", hint: "圓的面積是 $\\pi r^2$。把圓水平放大 $a$ 倍、鉛直放大 $b$ 倍，面積會變成幾倍？",
        idea: "單位圓面積 $\\pi$，伸縮後面積乘 $ab$，所以是 $\\pi ab$。這也是「線性變換」單元說的：面積倍率等於行列式 $ab$。" }
    ],

    where: {
      codes: [["G-12甲-1", "二次曲線：橢圓的標準式、橢圓參數式；平移、伸縮、線性變換；由旋轉橢圓認識含 $xy$ 項的方程式"]],
      exam: "12 年級<b>選修數學甲</b>，數甲獨有，分科測驗數甲的範圍。橢圓參數式是官方明列的核心內容。",
      stop: "只藉旋轉「認識」含 $xy$ 項的方程式，不直接處理任意含 $xy$ 項的方程式。不含光學性質、弦與切線問題；焦半徑屬教材延伸，不是官方明列的核心。"
    }
  });
})();
