/* 補充單元：最簡單的極坐標方程式 */
(function () {
  var C = SK.C, s = SK.s;

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 240, "雷達畫面");
    var cx = 200, cy = 125;
    [30, 60, 90].forEach(function (r) { s("circle", { cx: cx, cy: cy, r: r, fill: "none", stroke: C.green.s, "stroke-width": 1, opacity: .6 }, svg); });
    for (var k = 0; k < 12; k++) { var a = k * Math.PI / 6; s("line", { x1: cx, y1: cy, x2: cx + 95 * Math.cos(a), y2: cy - 95 * Math.sin(a), stroke: C.green.s, "stroke-width": .6, opacity: .5 }, svg); }
    var a2 = Math.PI / 6;
    s("circle", { cx: cx + 60 * Math.cos(a2), cy: cy - 60 * Math.sin(a2), r: 6, fill: C.orange.f, stroke: C.cocoa }, svg);
    SK.label(svg, cx + 60 * Math.cos(a2) + 12, cy - 60 * Math.sin(a2) - 8, "距離 5 km、方位 30°", { size: 12, anchor: "start" });
    SK.label(svg, 200, 234, "用「多遠、朝哪」來定位", { size: 13, color: C.soft });
  }

  SK.mountUnit({
    slug: "polar-equation",
    en: "An equation picks out points",
    formula: "\\co{r}=\\text{常數}\\ \\Rightarrow\\ \\text{圓},\\qquad \\cb{\\theta}=\\text{常數}\\ \\Rightarrow\\ \\text{射線}",

    hook: {
      html: "雷達回報的位置是「距離 5 公里、方位 30°」，這就是<b>極坐標</b> $[r,\\theta]$。高一已經學過它和直角坐標的互換。",
      ask: "直角坐標裡，$x=3$ 是一條直線。那在極坐標裡，$r=3$ 會是什麼圖形？$\\theta=45^\\circ$ 呢？",
      visual: hookVisual
    },

    guess: {
      q: "極坐標方程式 $r=3$ 的圖形是什麼？",
      options: [
        { t: "一條鉛直線", common: true, explain: "你把它和直角坐標的 $x=3$ 類比了，這個類比很自然！但 $r$ 是「到原點的距離」，距離固定為 3、方向任意的點，會繞成一圈。" },
        { t: "以原點為圓心、半徑 3 的圓", truth: true, explain: "$r=3$ 只限制距離，不限制角度，所以是所有離原點 3 的點：一個圓。換成直角坐標就是 $x^2+y^2=9$。" },
        { t: "一個點", explain: "一個點需要同時指定 $r$ 和 $\\theta$。只給 $r$，角度可以任意變。" },
        { t: "一條射線", explain: "那是 $\\theta=$ 常數的圖形：方向固定、距離任意。" }
      ]
    },

    derive: {
      intro: "拖動滑桿改變 $r$ 與 $\\theta$ 的值或範圍。",
      tall: true,
      frames: [
        { cap: "一個點用 $[r,\\theta]$ 描述：離原點多遠、從正 $x$ 軸逆時針轉幾度。", tex: "[r,\\theta]\\ \\leftrightarrow\\ (r\\cos\\theta,\\ r\\sin\\theta)" },
        { cap: "方程式是一個<b>篩選條件</b>：滿足條件的點都留下來。$r=3$：距離固定、角度任意，所有點排成一個圓。", tex: "\\co{r=3}\\ \\Leftrightarrow\\ x^2+y^2=9" },
        { cap: "$\\theta=45^\\circ$：方向固定、距離任意（$r\\ge0$），排成一條從原點出發的射線。", tex: "\\cb{\\theta=45^\\circ}\\ (r\\ge0)\\ \\Leftrightarrow\\ y=x,\\ x\\ge0" },
        { cap: "把條件改成範圍，就能描述區域。例如 $1\\le r\\le2$、$0^\\circ\\le\\theta\\le90^\\circ$：一塊四分之一的圓環。", tex: "1\\le r\\le 2,\\quad 0^\\circ\\le\\theta\\le90^\\circ" }
      ],
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 520, 440, "極坐標網格上的圖形");
        var g = s("g", {}, svg);
        var st = { r: 3, t: 45, r1: 1, r2: 2, t2: 90 };
        var cx = 260, cy = 220, u = 45;
        var read = SK.h("div", { class: "readout" });
        var slR = SK.slider({ label: "$r$", min: .5, max: 4.5, step: .1, value: st.r, onInput: function (v) { st.r = v; draw(); } });
        var slT = SK.slider({ label: "$\\theta$", min: 0, max: 355, step: 5, value: st.t, color: "blue", fmt: function (v) { return v + "°"; }, onInput: function (v) { st.t = v; draw(); } });
        var slT2 = SK.slider({ label: "$\\theta$ 上限", min: 10, max: 350, step: 10, value: st.t2, color: "green", fmt: function (v) { return v + "°"; }, onInput: function (v) { st.t2 = v; draw(); } });
        ctx.sliders.appendChild(slR.el); ctx.sliders.appendChild(slT.el); ctx.sliders.appendChild(slT2.el);
        ctx.extra.appendChild(read);
        function P(r, t) { return [cx + r * u * Math.cos(SK.rad(t)), cy - r * u * Math.sin(SK.rad(t))]; }
        function draw() {
          var f = ctx.frame;
          g.innerHTML = "";
          for (var r = 1; r <= 4; r++) s("circle", { cx: cx, cy: cy, r: r * u, fill: "none", stroke: "#ECE5D8", "stroke-width": 1 }, g);
          for (var k = 0; k < 12; k++) { var e = P(4.6, k * 30); s("line", { x1: cx, y1: cy, x2: e[0], y2: e[1], stroke: "#ECE5D8" }, g); }
          s("line", { x1: 20, y1: cy, x2: 500, y2: cy, class: "m-axis" }, g);
          s("line", { x1: cx, y1: 10, x2: cx, y2: 430, class: "m-axis" }, g);
          slR.el.style.display = f === 0 || f === 1 ? "" : "none";
          slT.el.style.display = f === 0 || f === 2 ? "" : "none";
          slT2.el.style.display = f === 3 ? "" : "none";
          if (f === 0) {
            var Pp = P(st.r, st.t);
            s("line", { x1: cx, y1: cy, x2: Pp[0], y2: Pp[1], stroke: C.ink, "stroke-width": 2 }, g);
            s("path", { d: SK.arcPath(cx, cy, 26, 0, SK.rad(st.t)), fill: "none", stroke: C.purple.s, "stroke-width": 2 }, g);
            s("circle", { cx: Pp[0], cy: Pp[1], r: 6, fill: C.orange.f, stroke: C.cocoa }, g);
            SK.label(g, Pp[0] + 10, Pp[1] - 10, "[" + SK.fmt(st.r, 1) + ", " + st.t + "°]", { size: 13, anchor: "start" });
            read.innerHTML = SK.tex("[" + SK.fmt(st.r, 1) + ",\\ " + st.t + "^\\circ]=(" + SK.fmt(st.r * Math.cos(SK.rad(st.t)), 2) + ",\\ " + SK.fmt(st.r * Math.sin(SK.rad(st.t)), 2) + ")", true);
          } else if (f === 1) {
            s("circle", { cx: cx, cy: cy, r: st.r * u, fill: "none", stroke: C.orange.s, "stroke-width": 3 }, g);
            for (var j = 0; j < 12; j++) { var q = P(st.r, j * 30 + 15); s("circle", { cx: q[0], cy: q[1], r: 4, fill: C.orange.f, stroke: C.orange.s }, g); }
            read.innerHTML = SK.tex("r=" + SK.fmt(st.r, 1) + "\\ \\Leftrightarrow\\ x^2+y^2=" + SK.fmt(st.r * st.r, 2), true);
          } else if (f === 2) {
            var e2 = P(4.8, st.t);
            s("line", { x1: cx, y1: cy, x2: e2[0], y2: e2[1], stroke: C.blue.s, "stroke-width": 3 }, g);
            for (var j2 = 1; j2 <= 4; j2++) { var q2 = P(j2, st.t); s("circle", { cx: q2[0], cy: q2[1], r: 4, fill: C.blue.f, stroke: C.blue.s }, g); }
            s("circle", { cx: cx, cy: cy, r: 4, fill: C.blue.s }, g);
            read.innerHTML = SK.tex("\\theta=" + st.t + "^\\circ,\\ r\\ge0", true);
          } else {
            var t2 = SK.rad(st.t2), o1 = P(2, 0), o2 = P(2, st.t2), i1 = P(1, st.t2), i2 = P(1, 0);
            var large = st.t2 > 180 ? 1 : 0;
            s("path", { d: "M" + i2 + " L" + o1 + " A" + 2 * u + " " + 2 * u + " 0 " + large + " 0 " + o2 + " L" + i1 + " A" + u + " " + u + " 0 " + large + " 1 " + i2 + "Z", fill: C.mint.f, stroke: C.green.s, "stroke-width": 2 }, g);
            read.innerHTML = SK.tex("1\\le r\\le2,\\ 0^\\circ\\le\\theta\\le" + st.t2 + "^\\circ", true);
          }
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "為什麼有些曲線用極坐標比較簡單", icon: "sparkle",
        html: "圓 $x^2+y^2=9$ 在極坐標裡只是 $r=3$；射線 $y=x\\ (x\\ge0)$ 只是 $\\theta=45^\\circ$。當一個圖形是「繞著原點」長出來的（雷達、螺旋、花瓣），極坐標往往更自然。大學會看到 $r=\\theta$（阿基米德螺線）、$r=\\cos2\\theta$（四瓣玫瑰線）這些漂亮的曲線，但那些已經超出高中範圍。" }
    ],

    challenges: [
      { q: "$r=2$ 和 $\\theta=120^\\circ$ 的圖形交於哪一點？寫成直角坐標。", idea: "$[2,120^\\circ]=(2\\cos120^\\circ,2\\sin120^\\circ)=(-1,\\sqrt3)$。" },
      { q: "用極坐標的不等式描述「第一象限裡、離原點不超過 3」的區域。", idea: "$0\\le r\\le3$、$0^\\circ\\le\\theta\\le90^\\circ$，一個四分之一圓。" }
    ],

    where: {
      codes: [["G-10-5", "（接點）廣義角與極坐標：極坐標與直角坐標的轉換"]],
      exam: "<b>課綱外補充</b>：高一正式內容只有「極坐標與直角坐標的轉換」，不含極坐標方程式。這裡只用最簡單的 $r=$ 常數、$\\theta=$ 常數，說明「方程式是在挑選點」。",
      stop: "不做玫瑰線、心形線，也不做一般極坐標曲線的交點與面積；那些屬於更完整的極坐標曲線課程。"
    }
  });
})();
