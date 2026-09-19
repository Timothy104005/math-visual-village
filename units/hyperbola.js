/* 單元：雙曲線的定義、標準式與漸近線 */
(function () {
  var C = SK.C, s = SK.s;
  function cosh(t) { return (Math.exp(t) + Math.exp(-t)) / 2; }
  function sinh(t) { return (Math.exp(t) - Math.exp(-t)) / 2; }

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 250, "兩個基地台收到訊號的時間差");
    var A = [110, 150], B = [290, 150], P = [240, 60];
    [A, B].forEach(function (p, i) {
      s("path", { d: "M" + (p[0] - 12) + " " + (p[1] + 20) + " L" + p[0] + " " + (p[1] - 16) + " L" + (p[0] + 12) + " " + (p[1] + 20), fill: "none", stroke: C.cocoa, "stroke-width": 1.6 }, svg);
      s("circle", { cx: p[0], cy: p[1] - 16, r: 4, fill: C.orange.f, stroke: C.cocoa }, svg);
      SK.label(svg, p[0], p[1] + 36, i ? "基地台 B" : "基地台 A", { size: 12, color: C.soft });
    });
    s("circle", { cx: P[0], cy: P[1], r: 7, fill: C.blue.f, stroke: C.cocoa, "stroke-width": 1.3 }, svg);
    s("line", { x1: A[0], y1: A[1] - 16, x2: P[0], y2: P[1], stroke: C.orange.s, "stroke-dasharray": "5 4" }, svg);
    s("line", { x1: B[0], y1: B[1] - 16, x2: P[0], y2: P[1], stroke: C.orange.s, "stroke-dasharray": "5 4" }, svg);
    SK.label(svg, P[0] + 12, P[1] - 10, "手機", { size: 13, anchor: "start" });
    SK.label(svg, 200, 236, "只知道「距離差」，手機可能在哪裡？", { size: 13, color: C.soft });
  }

  SK.mountUnit({
    slug: "hyperbola",
    en: "A constant difference of distances",
    formula: "\\left|\\overline{PF_1}-\\overline{PF_2}\\right|=2\\co{a}\\ \\Longrightarrow\\ \\frac{x^2}{\\co{a}^2}-\\frac{y^2}{\\cb{b}^2}=1,\\quad \\cg{c}^2=\\co{a}^2+\\cb{b}^2",

    hook: {
      html: "手機發出的訊號，被兩個基地台 A、B 收到的時間差，可以換算成手機到 A、B 的<b>距離差</b>。",
      ask: "只知道距離差是固定的，手機可能的位置會排成什麼形狀？",
      visual: hookVisual
    },

    guess: {
      q: "平面上到兩個定點的距離「差」固定的點，會排成什麼形狀？",
      options: [
        { t: "橢圓", common: true, explain: "橢圓是距離的<b>和</b>固定，很容易和「差」搞混！和固定時，點被繩子圍在兩焦點周圍；差固定時，點會越走越遠，永遠不會繞回來。" },
        { t: "雙曲線（兩支分開的曲線）", truth: true, explain: "比較靠近 $F_2$ 的點形成一支，比較靠近 $F_1$ 的形成另一支。兩支都往外無限延伸，越來越貼近兩條直線（漸近線）。" },
        { t: "兩焦點的中垂線", explain: "中垂線上的點到兩焦點距離差是 0。這是差固定為 0 的特例；差不是 0 的時候，點會彎成曲線。" },
        { t: "一個圓", explain: "圓只需要一個中心和固定的距離。這裡有兩個定點、比的是距離差，形狀完全不同。" }
      ]
    },

    derive: {
      intro: "拖動滑桿改變 $a$、$c$，以及曲線上的點 $P$ 的位置。",
      tall: true,
      frames: [
        { cap: "兩個焦點 $F_1(-c,0)$、$F_2(c,0)$。取一點 $P$，量它到兩焦點的距離。在右邊那一支上，$\\overline{PF_1}-\\overline{PF_2}$ 永遠等於 $2a$。", tex: "\\overline{P\\co{F_1}}-\\overline{P\\co{F_2}}=2a" },
        { cap: "把所有這樣的點畫出來：右邊一支（差是 $+2a$），左邊一支（差是 $-2a$），合起來叫<b>雙曲線</b>。因為差比兩焦點的距離小，所以 $a<c$。", tex: "0<a<c" },
        { cap: "寫成坐標、兩次平方整理，得到<b>標準式</b>。和橢圓只差一個正負號，而 $b$ 的關係變成 $c^2=a^2+b^2$。", tex: "\\frac{x^2}{a^2}-\\frac{y^2}{b^2}=1,\\quad c^2=a^2+b^2" },
        { cap: "以 $2a\\times2b$ 畫一個長方形，它的兩條對角線延長，就是<b>漸近線</b> $y=\\pm\\frac bax$。曲線往外走時越來越貼近它們，但永遠碰不到。", tex: "y=\\pm\\frac{\\cb{b}}{\\co{a}}x" },
        { cap: "為什麼會貼近？把標準式改寫：$y=\\pm\\frac bax\\sqrt{1-\\frac{a^2}{x^2}}$。$x$ 越大，根號裡越接近 1，曲線就越接近直線。", tex: "\\frac{y}{x}=\\pm\\frac ba\\sqrt{1-\\frac{a^2}{x^2}}\\ \\xrightarrow{|x|\\to\\infty}\\ \\pm\\frac ba" }
      ],
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 520, 440, "雙曲線的焦點與漸近線");
        var g = s("g", {}, svg);
        var st = { a: 1.6, c: 2.6, t: .8, side: 1 };
        var cx = 260, cy = 220, u = 44;
        function P(x, y) { return [cx + x * u, cy - y * u]; }
        var read = SK.h("div", { class: "readout" });
        ctx.sliders.appendChild(SK.slider({ label: "$a$", min: .6, max: 3, step: .05, value: st.a, onInput: function (v) { st.a = v; if (st.c <= v) st.c = v + .1; draw(); } }).el);
        ctx.sliders.appendChild(SK.slider({ label: "$c$", min: .8, max: 5, step: .05, value: st.c, color: "green", onInput: function (v) { st.c = Math.max(v, st.a + .05); draw(); } }).el);
        ctx.sliders.appendChild(SK.slider({ label: "$P$", min: -2, max: 2, step: .02, value: st.t, color: "blue", fmt: function (v) { return SK.fmt(v, 2); }, onInput: function (v) { st.t = v; draw(); } }).el);
        var btn = SK.h("button", { class: "btn small ghost", type: "button" }, "換到另一支");
        btn.onclick = function () { st.side *= -1; draw(); };
        ctx.sliders.appendChild(btn);
        ctx.extra.appendChild(read);
        function draw() {
          var f = ctx.frame, a = st.a, c = st.c, b = Math.sqrt(c * c - a * a);
          var px = st.side * a * cosh(st.t), py = b * sinh(st.t);
          g.innerHTML = "";
          s("line", { x1: 10, y1: cy, x2: 510, y2: cy, class: "m-axis" }, g);
          s("line", { x1: cx, y1: 10, x2: cx, y2: 430, class: "m-axis" }, g);
          if (f >= 3) {
            var R1 = P(-a, b), R2 = P(a, -b);
            s("rect", { x: R1[0], y: R1[1], width: R2[0] - R1[0], height: R2[1] - R1[1], fill: C.mint.f, stroke: C.green.s, "stroke-dasharray": "4 4" }, g);
            [1, -1].forEach(function (sg) { var e1 = P(-6, -6 * sg * b / a), e2 = P(6, 6 * sg * b / a); s("line", { x1: e1[0], y1: e1[1], x2: e2[0], y2: e2[1], stroke: C.blue.s, "stroke-width": 1.4, "stroke-dasharray": "7 5" }, g); });
            SK.label(g, P(a, 0)[0] + 6, P(0, b)[1] - 10, "2a × 2b", { size: 12, anchor: "start", color: C.green.s });
          }
          if (f >= 1) {
            [1, -1].forEach(function (sd) {
              var d = "";
              for (var t = -2.4; t <= 2.4; t += .04) { var q = P(sd * a * cosh(t), b * sinh(t)); d += (d ? "L" : "M") + q[0] + " " + q[1]; }
              s("path", { d: d, fill: "none", stroke: C.ink, "stroke-width": 2.6 }, g);
            });
          }
          var F1 = P(-c, 0), F2 = P(c, 0), Pp = P(px, py);
          s("line", { x1: F1[0], y1: F1[1], x2: Pp[0], y2: Pp[1], stroke: C.orange.s, "stroke-width": 2.6 }, g);
          s("line", { x1: F2[0], y1: F2[1], x2: Pp[0], y2: Pp[1], stroke: C.orange.s, "stroke-width": 2.6, "stroke-dasharray": "7 4" }, g);
          s("circle", { cx: Pp[0], cy: Pp[1], r: 6.5, fill: C.blue.f, stroke: C.cocoa, "stroke-width": 1.3 }, g);
          [F1, F2].forEach(function (F, i) { s("circle", { cx: F[0], cy: F[1], r: 6, fill: C.gold.f, stroke: C.cocoa, "stroke-width": 1.3 }, g); SK.label(g, F[0], F[1] + 18, i ? "F₂" : "F₁", { size: 13 }); });
          var d1 = Math.hypot(px + c, py), d2 = Math.hypot(px - c, py);
          read.innerHTML = SK.tex("\\overline{PF_1}-\\overline{PF_2}=" + SK.fmt(d1, 2) + "-" + SK.fmt(d2, 2) + "=" + SK.fmt(d1 - d2, 2) + "=" + (st.side > 0 ? "" : "-") + "2a", true) +
            SK.tex("\\frac{x^2}{" + SK.fmt(a * a, 2) + "}-\\frac{y^2}{" + SK.fmt(b * b, 2) + "}=1" + (f >= 3 ? ",\\quad y=\\pm" + SK.fmt(b / a, 3) + "x" : ""), true);
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "三種曲線放在一起看", icon: "sparkle",
        html: "拋物線：到焦點 = 到準線；橢圓：到兩焦點的距離<b>和</b>固定；雙曲線：到兩焦點的距離<b>差</b>固定。標準式也很像：橢圓 $\\dfrac{x^2}{a^2}+\\dfrac{y^2}{b^2}=1$、雙曲線 $\\dfrac{x^2}{a^2}-\\dfrac{y^2}{b^2}=1$、拋物線 $y^2=4cx$。它們都是用平面去切圓錐得到的截痕，所以合稱<b>圓錐曲線</b>（數 B 的 `S-11B-2` 從這裡開始看）。" },
      { title: "定位系統", icon: "leaf",
        html: "一組基地台的時間差，把手機限制在一條雙曲線上；再用另一組基地台，得到另一條雙曲線。兩條曲線的交點，就是手機的位置。早期的船舶導航系統（LORAN）就是用這個原理。" }
    ],

    challenges: [
      { q: "$\\dfrac{x^2}{16}-\\dfrac{y^2}{9}=1$ 的焦點和漸近線是什麼？", idea: "$c=\\sqrt{16+9}=5$，焦點 $(\\pm5,0)$；漸近線 $y=\\pm\\dfrac34x$。" },
      { q: "焦點 $(\\pm5,0)$、頂點 $(\\pm3,0)$ 的雙曲線方程式是什麼？", idea: "$a=3$、$c=5$、$b=4$：$\\dfrac{x^2}{9}-\\dfrac{y^2}{16}=1$。" },
      { q: "如果 $a=b$，漸近線有什麼特別？這種雙曲線叫什麼？", idea: "漸近線 $y=\\pm x$ 互相垂直，稱為等軸雙曲線。反比例函數 $y=\\frac1x$ 的圖形就是轉了 $45^\\circ$ 的等軸雙曲線（這屬於教材的延伸內容）。" }
    ],

    where: {
      codes: [["G-12甲-1", "二次曲線：雙曲線的標準式；平移、伸縮"]],
      exam: "12 年級<b>選修數學甲</b>，數甲獨有，分科測驗數甲的範圍。漸近線是理解雙曲線形狀的關鍵。",
      stop: "重點是幾何定義、標準式與漸近線。等軸雙曲線、共軛雙曲線、共焦點等屬於教材延伸，不是官方明列的核心；不處理弦、切線與光學性質。"
    }
  });
})();
