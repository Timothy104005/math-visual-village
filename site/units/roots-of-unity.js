/* 單元：複數的 n 次方根 */
(function () {
  var C = SK.C, s = SK.s;

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 260, "單位圓上的 1");
    var cx = 200, cy = 130, R = 95;
    s("line", { x1: 60, y1: cy, x2: 340, y2: cy, class: "m-axis" }, svg);
    s("line", { x1: cx, y1: 20, x2: cx, y2: 245, class: "m-axis" }, svg);
    s("circle", { cx: cx, cy: cy, r: R, fill: "rgba(241,226,184,.3)", stroke: C.line, "stroke-width": 1.6 }, svg);
    s("circle", { cx: cx + R, cy: cy, r: 7, fill: C.orange.f, stroke: C.cocoa, "stroke-width": 1.3 }, svg);
    SK.label(svg, cx + R + 18, cy - 14, "1", { size: 15 });
    [2, 4].forEach(function (k) { var a = k * Math.PI / 3; SK.label(svg, cx + R * Math.cos(a), cy - R * Math.sin(a), "?", { size: 20, color: C.pink.s }); });
    SK.label(svg, 200, 250, "還有誰的三次方也等於 1？", { size: 13, color: C.soft });
  }

  SK.mountUnit({
    slug: "roots-of-unity",
    en: "Roots sit evenly around a circle",
    formula: "z^{\\co{n}}=1\\iff z=\\cos\\frac{2k\\pi}{\\co{n}}+i\\sin\\frac{2k\\pi}{\\co{n}},\\quad k=0,1,\\dots,n-1",

    hook: {
      html: "在實數裡，三次方等於 1 的數只有 1。可是在複數平面上，乘法是「長度相乘、角度相加」。",
      ask: "有沒有別的點，轉三次之後剛好回到 1 的位置？",
      visual: hookVisual
    },

    guess: {
      q: "在複數中，方程式 $z^3=1$ 有幾個根？",
      options: [
        { t: "1 個，就是 1", common: true, explain: "在實數裡的確只有 1。但複數平面上，角度 $120^\\circ$ 的點轉三次是 $360^\\circ$，也回到 1！$240^\\circ$ 的點轉三次是 $720^\\circ$，一樣回到 1。" },
        { t: "3 個", truth: true, explain: "1、$\\cos120^\\circ+i\\sin120^\\circ$、$\\cos240^\\circ+i\\sin240^\\circ$。三個點在單位圓上等距排成正三角形。這也符合代數基本定理：三次方程式有三個根。" },
        { t: "無限多個", explain: "角度可以加任意多圈，看起來有無限多種寫法，但 $360^\\circ$ 以後的點會和前面的重複，真正不同的只有 3 個。" },
        { t: "2 個：1 和 −1", explain: "$(-1)^3=-1$，不是 1。三次方根不會是 $-1$，但偶數次方根（例如 $z^2=1$）才會有 $-1$。" }
      ]
    },

    derive: {
      intro: "拖動滑桿改變 $n$，以及右邊方程式的 $w$（它的長度與角度）。",
      tall: true,
      frames: [
        { cap: "先看 $z^n=1$。長度：$|z|^n=1$，所以 $|z|=1$，根都在<b>單位圓</b>上。", tex: "|z|^n=1\\ \\Rightarrow\\ |z|=1" },
        { cap: "角度：$n\\theta$ 必須是 $360^\\circ$ 的整數倍，也就是 $\\theta=\\dfrac{360^\\circ k}{n}$。", tex: "n\\theta=360^\\circ k\\ \\Rightarrow\\ \\theta=\\frac{360^\\circ}{n}k" },
        { cap: "$k=0,1,\\dots,n-1$ 給出 $n$ 個不同的點，再往下就開始重複。它們把單位圓 $n$ 等分，排成<b>正 $n$ 邊形</b>。", tex: "\\omega_k=\\cos\\frac{2k\\pi}{n}+i\\sin\\frac{2k\\pi}{n}" },
        { cap: "一般的 $z^n=w$：長度取 $\\sqrt[n]{|w|}$，起始角度是 $\\dfrac{\\arg w}{n}$，接著一樣每隔 $\\dfrac{360^\\circ}{n}$ 放一個點。正 $n$ 邊形被放大、轉了一個角度。", tex: "\\begin{gathered}z_k=\\sqrt[n]{|w|}\\,(\\cos\\theta_k+i\\sin\\theta_k)\\\\ \\theta_k=\\frac{\\varphi+360^\\circ k}{n}\\end{gathered}" },
        { cap: "把所有根當成向量加起來：正多邊形對稱，總和剛好是 0。例如 $1+\\omega+\\omega^2=0$。", tex: "\\sum_{k=0}^{n-1}\\omega_k=0\\quad(n\\ge2)" }
      ],
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 520, 460, "n 次方根在圓上等分");
        var g = s("g", {}, svg);
        var st = { n: 5, wr: 8, wa: 60 };
        var read = SK.h("div", { class: "readout" });
        var slN = SK.slider({ label: "$n$", min: 2, max: 12, value: st.n, onInput: function (v) { st.n = v; draw(); } });
        var slR = SK.slider({ label: "$|w|$", min: 1, max: 30, value: st.wr, color: "blue", onInput: function (v) { st.wr = v; draw(); } });
        var slA = SK.slider({ label: "$\\arg w$", min: 0, max: 355, step: 5, value: st.wa, color: "green", fmt: function (v) { return v + "°"; }, onInput: function (v) { st.wa = v; draw(); } });
        ctx.sliders.appendChild(slN.el); ctx.sliders.appendChild(slR.el); ctx.sliders.appendChild(slA.el);
        ctx.extra.appendChild(read);
        function draw() {
          var f = ctx.frame, n = st.n, cx = 260, cy = 230, U = 120;
          var general = f === 3, rad = general ? Math.pow(st.wr, 1 / n) : 1, phi = general ? SK.rad(st.wa) : 0;
          var scale = general ? Math.min(U, 190 / rad) : U;
          slR.el.style.display = slA.el.style.display = general ? "" : "none";
          g.innerHTML = "";
          s("line", { x1: 30, y1: cy, x2: 490, y2: cy, class: "m-axis" }, g);
          s("line", { x1: cx, y1: 20, x2: cx, y2: 440, class: "m-axis" }, g);
          s("circle", { cx: cx, cy: cy, r: scale, fill: "rgba(241,226,184,.25)", stroke: C.line, "stroke-width": 1.4 }, g);
          if (general) SK.label(g, cx + scale * .72, cy + scale * .72 + 16, "半徑 ⁿ√|w| ≈ " + SK.fmt(rad, 3), { size: 12, anchor: "start", color: C.soft });
          var pts = [];
          for (var k = 0; k < n; k++) { var a = (phi + 2 * Math.PI * k) / n; pts.push([cx + rad * scale * Math.cos(a), cy - rad * scale * Math.sin(a), a]); }
          if (f >= 2) s("path", { d: "M" + pts.map(function (p) { return p[0] + " " + p[1]; }).join(" L") + "Z", fill: C.mint.f, stroke: C.green.s, "stroke-width": 1.4 }, g);
          if (f === 1) {
            var a1 = 2 * Math.PI / n;
            s("path", { d: SK.arcPath(cx, cy, 40, 0, a1), fill: "none", stroke: C.purple.s, "stroke-width": 2 }, g);
            SK.label(g, cx + 58 * Math.cos(a1 / 2), cy - 58 * Math.sin(a1 / 2), SK.fmt(360 / n, 1) + "°", { size: 13, color: C.purple.s });
          }
          if (f === 4) {
            var sx = 0, sy = 0, px = cx, py = cy;
            pts.forEach(function (p, i) {
              var vx = p[0] - cx, vy = p[1] - cy;
              SK.arrow(g, px, py, px + vx, py + vy, [C.orange, C.blue, C.green, C.pink, C.purple, C.gold][i % 6].s, 2.2);
              px += vx; py += vy;
            });
            SK.label(g, cx + 12, cy + 20, "頭尾相接，回到原點", { size: 12, anchor: "start", color: C.soft });
          }
          if (general) {
            var wx = cx + Math.min(st.wr, 200 / scale) * scale * Math.cos(phi), wy = cy - Math.min(st.wr, 200 / scale) * scale * Math.sin(phi);
            s("line", { x1: cx, y1: cy, x2: wx, y2: wy, stroke: C.blue.s, "stroke-dasharray": "5 4", "stroke-width": 1.4 }, g);
            SK.label(g, wx + 8, wy - 8, "w 的方向", { size: 12, anchor: "start", color: C.blue.s });
          }
          pts.forEach(function (p, k) {
            s("circle", { cx: p[0], cy: p[1], r: 7, fill: k === 0 ? C.orange.f : C.pink.f, stroke: C.cocoa, "stroke-width": 1.3 }, g);
            if (f >= 2 && n <= 8) SK.label(g, cx + (rad * scale + 22) * Math.cos(p[2]), cy - (rad * scale + 22) * Math.sin(p[2]), (general ? "z" : "ω") + String(k).replace(/\d/g, function (c) { return "₀₁₂₃₄₅₆₇₈₉"[c]; }), { size: 13 });
          });
          read.innerHTML = general
            ? SK.tex("z^{" + n + "}=" + st.wr + "(\\cos" + st.wa + "^\\circ+i\\sin" + st.wa + "^\\circ):\\ |z|=\\sqrt[" + n + "]{" + st.wr + "}\\approx" + SK.fmt(rad, 3) + ",\\ \\theta_0=" + SK.fmt(st.wa / n, 1) + "^\\circ", true)
            : SK.tex("z^{" + n + "}=1:\\ \\text{相鄰兩根相差 }" + SK.fmt(360 / n, 2) + "^\\circ", true);
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "為什麼 $1+\\omega+\\omega^2=0$", icon: "sparkle",
        html: "$\\omega$ 是 $z^3=1$ 的虛根。三個根 $1,\\omega,\\omega^2$ 排成正三角形，當成向量相加時，對稱讓它們互相抵消，總和為 0。用代數也看得到：$z^3-1=(z-1)(z^2+z+1)$，所以 $\\omega$ 滿足 $\\omega^2+\\omega+1=0$。圖形和代數說的是同一件事。" },
      { title: "和代數基本定理對得上", icon: "leaf",
        html: "$z^n=w$ 是一個 $n$ 次方程式，代數基本定理說它恰有 $n$ 個根，而圓上等分的 $n$ 個點正好補齊了這個數量。實係數的 $z^n=1$，根對實軸對稱，也和「虛根成對」一致：除了 $\\pm1$，其餘的根都是一對一對的共軛。" }
    ],

    challenges: [
      { q: "解 $z^4=16$。這四個根排成什麼形狀？", idea: "$|z|=2$，角度 $0^\\circ,90^\\circ,180^\\circ,270^\\circ$：$2,\\ 2i,\\ -2,\\ -2i$，一個正方形。" },
      { q: "解 $z^3=8i$。", hint: "$8i$ 的長度是 8、角度是 $90^\\circ$。",
        idea: "$|z|=2$，角度 $30^\\circ,150^\\circ,270^\\circ$：$\\sqrt3+i,\\ -\\sqrt3+i,\\ -2i$。" },
      { q: "$\\omega$ 是 $z^5=1$ 的一個虛根，算出 $1+\\omega+\\omega^2+\\omega^3+\\omega^4$，再算 $\\omega^{2026}$。", idea: "總和為 0（正五邊形對稱）。$\\omega^5=1$，$2026=5\\times405+1$，所以 $\\omega^{2026}=\\omega$。" }
    ],

    where: {
      codes: [["N-12甲-3", "複數：棣美弗定理與複數的 $n$ 次方根"], ["A-12甲-1", "代數基本定理"]],
      exam: "12 年級<b>選修數學甲</b>，分科測驗數甲的範圍。教材「複數平面」章的最後一節，也是棣美弗定理最主要的應用。",
      stop: "解題限於複數的 $n$ 次方根，不擴張成技巧性的方程式求解；評量重點是方根在複數平面上的幾何意義，不以繁複的三角和式為主。"
    }
  });
})();
