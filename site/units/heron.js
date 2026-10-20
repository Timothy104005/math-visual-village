/* 補充單元：海龍公式 */
(function () {
  var C = SK.C, s = SK.s;

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 240, "一塊只量得到三邊長的三角形土地");
    s("path", { d: "M60 200 L330 200 L230 60 Z", fill: "rgba(201,212,188,.6)", stroke: C.cocoa, "stroke-width": 1.6 }, svg);
    SK.label(svg, 195, 218, "13 m", { size: 14 });
    SK.label(svg, 295, 125, "15 m", { size: 14, anchor: "start" });
    SK.label(svg, 130, 118, "14 m", { size: 14, anchor: "end" });
    SK.label(svg, 200, 234, "沒有量角器、也量不到高，面積是多少？", { size: 13, color: C.soft });
  }

  SK.mountUnit({
    slug: "heron",
    en: "Area from three sides alone",
    formula: "K=\\sqrt{s(s-\\co{a})(s-\\cb{b})(s-\\cg{c})},\\qquad s=\\frac{a+b+c}{2}",

    hook: {
      html: "一塊三角形的土地，只量得到三條邊：13、14、15 公尺。角度量不到，高也量不到。",
      ask: "只有三邊長，能不能算出面積？如果能，要怎麼把「角度」消掉？",
      visual: hookVisual
    },

    guess: {
      q: "三邊長 3、4、5 的三角形，面積是多少？",
      options: [
        { t: "6", truth: true, explain: "3、4、5 是直角三角形，面積 $\\frac12\\times3\\times4=6$。用海龍公式：$s=6$，$\\sqrt{6\\cdot3\\cdot2\\cdot1}=6$，一模一樣。" },
        { t: "7.5", common: true, explain: "$\\frac12\\times3\\times5$ 用了斜邊當底，但 3 不是對應斜邊的高。三角形面積要用「底 × 對應的高」。" },
        { t: "12", explain: "$3\\times4=12$ 是長方形的面積，三角形是它的一半。" },
        { t: "只有三邊算不出來", explain: "三邊決定了唯一的三角形（SSS 全等），所以面積一定是確定的。今天就是要找出算法。" }
      ]
    },

    derive: {
      intro: "拖動滑桿改變三邊長 $a$、$b$、$c$（必須滿足三角不等式）。",
      tall: true,
      frames: [
        { cap: "已知三邊 $a,b,c$。面積公式 $K=\\frac12ab\\sin C$ 需要角度，所以要想辦法把角 $C$ 消掉。", tex: "K=\\tfrac12\\co{a}\\cb{b}\\sin C" },
        { cap: "餘弦定理用三邊告訴我們 $\\cos C$。", tex: "\\cos C=\\frac{a^2+b^2-c^2}{2ab}" },
        { cap: "用 $\\sin^2C=1-\\cos^2C$，把面積的平方整理成一個<b>平方差</b>。", tex: "16K^2=(2ab)^2-(a^2+b^2-c^2)^2" },
        { cap: "平方差分解兩次，每一步都是乘法公式。", tex: "\\begin{aligned}16K^2&=\\left[(a+b)^2-c^2\\right]\\left[c^2-(a-b)^2\\right]\\\\&=(a+b+c)(a+b-c)\\\\&\\quad\\times(c+a-b)(c-a+b)\\end{aligned}" },
        { cap: "令半周長 $s=\\frac{a+b+c}2$，四個因式剛好是 $2s,\\ 2(s-c),\\ 2(s-b),\\ 2(s-a)$。除以 16、開根號，就是<b>海龍公式</b>。", tex: "K=\\sqrt{s(s-a)(s-b)(s-c)}" }
      ],
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 520, 400, "由三邊長決定的三角形");
        var g = s("g", {}, svg);
        var st = { a: 13, b: 14, c: 15 }, sls = {};
        var read = SK.h("div", { class: "readout" });
        [["a", "", 4], ["b", "blue", 4], ["c", "green", 4]].forEach(function (d) {
          sls[d[0]] = SK.slider({ label: "$" + d[0] + "$", min: 3, max: 20, value: st[d[0]], color: d[1], onInput: function (v) { st[d[0]] = v; draw(); } });
          ctx.sliders.appendChild(sls[d[0]].el);
        });
        ctx.extra.appendChild(read);
        function draw() {
          var f = ctx.frame, a = st.a, b = st.b, c = st.c;
          g.innerHTML = "";
          if (a + b <= c || b + c <= a || a + c <= b) {
            SK.label(g, 260, 200, "這三個長度圍不成三角形（三角不等式）", { size: 15, color: C.pink.s });
            read.innerHTML = SK.tex("a+b>c,\\ b+c>a,\\ c+a>b", true);
            return;
          }
          // C 在左下，CB = a 沿水平，CA = b
          var cosC = (a * a + b * b - c * c) / (2 * a * b), sinC = Math.sqrt(1 - cosC * cosC);
          var sc = 300 / Math.max(a, b * Math.abs(cosC) + a, b + 1), Cx = 110 - Math.min(0, b * cosC) * sc, Cy = 330;
          var Bx = Cx + a * sc, Ax = Cx + b * cosC * sc, Ay = Cy - b * sinC * sc;
          s("path", { d: "M" + Cx + " " + Cy + " L" + Bx + " " + Cy + " L" + Ax + " " + Ay + "Z", fill: "rgba(201,212,188,.45)", stroke: "none" }, g);
          s("line", { x1: Cx, y1: Cy, x2: Bx, y2: Cy, stroke: C.orange.s, "stroke-width": 3.5 }, g);
          s("line", { x1: Cx, y1: Cy, x2: Ax, y2: Ay, stroke: C.blue.s, "stroke-width": 3.5 }, g);
          s("line", { x1: Ax, y1: Ay, x2: Bx, y2: Cy, stroke: C.green.s, "stroke-width": 3.5 }, g);
          SK.label(g, (Cx + Bx) / 2, Cy + 20, "a = " + a, { size: 14, color: C.orange.s });
          SK.label(g, (Cx + Ax) / 2 - 12, (Cy + Ay) / 2, "b = " + b, { size: 14, anchor: "end", color: C.blue.s });
          SK.label(g, (Ax + Bx) / 2 + 12, (Ay + Cy) / 2, "c = " + c, { size: 14, anchor: "start", color: C.green.s });
          if (f <= 1) {
            var ang = Math.acos(cosC);
            s("path", { d: SK.arcPath(Cx, Cy, 30, 0, ang), fill: "none", stroke: C.pink.s, "stroke-width": 2 }, g);
            SK.label(g, Cx + 44 * Math.cos(ang / 2), Cy - 44 * Math.sin(ang / 2), "C", { size: 13, color: C.pink.s });
          }
          var sp = (a + b + c) / 2, K = Math.sqrt(sp * (sp - a) * (sp - b) * (sp - c));
          read.innerHTML = f >= 4
            ? SK.tex("s=" + SK.fmt(sp, 1) + ",\\quad K=\\sqrt{" + SK.fmt(sp, 1) + "\\cdot" + SK.fmt(sp - a, 1) + "\\cdot" + SK.fmt(sp - b, 1) + "\\cdot" + SK.fmt(sp - c, 1) + "}\\approx" + SK.fmt(K, 3), true)
            : SK.tex("\\cos C=" + SK.fmt(cosC, 4) + ",\\quad K=\\tfrac12ab\\sin C\\approx" + SK.fmt(.5 * a * b * sinC, 3), true);
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "公式裡藏著三角不等式", icon: "sparkle",
        html: "$s-a=\\frac{b+c-a}{2}$。三角形存在，需要 $b+c>a$，也就是 $s-a>0$；另外兩個因式也一樣。所以根號裡是正數，正好等價於三邊能圍成三角形。如果某一個等於 0，三角形被壓扁成一條線段，面積也剛好是 0。一條公式，把「能不能圍成三角形」也一起檢查了。" }
    ],

    challenges: [
      { q: "開頭 13、14、15 的土地，面積是多少？", idea: "$s=21$，$K=\\sqrt{21\\cdot8\\cdot7\\cdot6}=\\sqrt{7056}=84$ 平方公尺。這是一個三邊和面積都是整數的「海龍三角形」。" },
      { q: "周長固定時，三邊怎麼選面積最大？", hint: "$s$ 固定，要讓 $(s-a)(s-b)(s-c)$ 最大，而 $(s-a)+(s-b)+(s-c)=s$ 也固定。想想「算幾不等式」。",
        idea: "三個數的和固定時，乘積在三數相等時最大，所以 $a=b=c$：正三角形的面積最大。" }
    ],

    where: {
      codes: [["G-10-7", "（接點）三角比性質：正弦定理、餘弦定理與三角形面積"]],
      exam: "<b>課綱外補充</b>：海龍公式不是正式條目，考試不會要求背它。它的價值在於把「餘弦定理＋面積公式」一路推到底，示範如何消去角度。",
      stop: "會用、會推導就好；不延伸繁複的代數證明或衍生不等式。不要把它變成另一條只背不懂的公式。"
    }
  });
})();
