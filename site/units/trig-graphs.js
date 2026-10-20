/* 單元：三角函數的圖形 */
(function () {
  var C = SK.C, s = SK.s;

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 250, "旋轉的點與它的高度");
    var cx = 70, cy = 125, R = 50;
    s("circle", { cx: cx, cy: cy, r: R, fill: "none", stroke: C.line, "stroke-width": 1.4 }, svg);
    var t = 1, P = [cx + R * Math.cos(t), cy - R * Math.sin(t)];
    s("line", { x1: cx, y1: cy, x2: P[0], y2: P[1], stroke: C.cocoa, "stroke-width": 1.4 }, svg);
    s("circle", { cx: P[0], cy: P[1], r: 5, fill: C.orange.s }, svg);
    s("line", { x1: P[0], y1: P[1], x2: 140 + t / (2 * Math.PI) * 240, y2: P[1], stroke: C.orange.s, "stroke-dasharray": "3 3" }, svg);
    var d = "";
    for (var u = 0; u <= t; u += .03) d += (u ? "L" : "M") + (140 + u / (2 * Math.PI) * 240) + " " + (cy - R * Math.sin(u));
    s("path", { d: d, fill: "none", stroke: C.orange.s, "stroke-width": 2.6 }, svg);
    s("line", { x1: 140, y1: cy, x2: 385, y2: cy, class: "m-axis" }, svg);
    SK.label(svg, 260, 220, "點繼續轉，高度畫出什麼形狀？", { size: 13, color: C.soft });
  }

  SK.mountUnit({
    slug: "trig-graphs",
    en: "Unroll the unit circle",
    formula: "y=\\co{\\sin x},\\quad y=\\cb{\\cos x}=\\sin\\left(x+\\tfrac\\pi2\\right),\\quad y=\\cg{\\tan x}=\\frac{\\sin x}{\\cos x}",

    hook: {
      html: "單位圓上一個點以固定速度逆時針轉。把它的<b>高度</b>隨著轉過的角度畫下來。",
      ask: "畫出來會是什麼形狀？橫坐標換成水平位置、或換成「斜率」，又會怎麼樣？",
      visual: hookVisual
    },

    guess: {
      q: "$y=\\tan x$ 的週期是多少？",
      options: [
        { t: "$\\pi$", truth: true, explain: "$\\tan x$ 是從原點到圓上點的<b>斜率</b>。轉半圈後，點跑到正對面，但連線還是同一條直線，斜率一樣。所以每 $\\pi$ 就重複一次。" },
        { t: "$2\\pi$", common: true, explain: "$\\sin$、$\\cos$ 的週期都是 $2\\pi$，很自然會猜一樣！但 $\\tan x=\\tfrac{\\sin x}{\\cos x}$，轉半圈時分子分母同時變號，比值不變，所以週期只有一半。" },
        { t: "$\\tfrac\\pi2$", explain: "$\\tan0=0$ 但 $\\tan\\tfrac\\pi2$ 沒有定義，所以 $\\tfrac\\pi2$ 不是週期。" },
        { t: "沒有週期", explain: "$\\tan x$ 雖然會衝到無限大，但它的形狀每 $\\pi$ 就完整重複一次。" }
      ]
    },

    derive: {
      intro: "拖動滑桿讓點在單位圓上轉動（角度用弧度），看右邊的圖一路畫出來。",
      tall: true,
      frames: [
        { cap: "單位圓上角度 $x$ 的點，縱坐標是 $\\sin x$。轉一圈，高度從 0 升到 1、降到 $-1$、再回到 0。把圓「攤開」，就是正弦曲線。", tex: "y=\\sin x" },
        { cap: "橫坐標是 $\\cos x$。把它也畫成圖，形狀和 $\\sin x$ 一模一樣，只是提前了 $\\tfrac\\pi2$：$\\cos$ 比 $\\sin$ 早四分之一圈到達最高點。", tex: "\\cos x=\\sin\\left(x+\\tfrac\\pi2\\right)" },
        { cap: "$\\tan x=\\tfrac{\\sin x}{\\cos x}$ 是半徑的<b>斜率</b>，也是半徑延長後和直線 $X=1$ 交點的高度。轉到 $\\tfrac\\pi2$ 時半徑鉛直，斜率不存在：圖形有<b>漸近線</b>。", tex: "\\tan x=\\frac{\\sin x}{\\cos x},\\quad x\\ne\\tfrac\\pi2+k\\pi" },
        { cap: "整理三個函數的定義域、值域和週期。", tex: "\\begin{array}{c|c|c|c}&\\text{定義域}&\\text{值域}&\\text{週期}\\\\\\hline\\sin&\\mathbb R&[-1,1]&2\\pi\\\\\\cos&\\mathbb R&[-1,1]&2\\pi\\\\\\tan&x\\ne\\frac\\pi2+k\\pi&\\mathbb R&\\pi\\end{array}" },
        { cap: "<b>週期模型</b>：$y=a\\sin(bx)$。$|a|$ 是<b>振幅</b>（最高離中線多遠），週期變成 $\\tfrac{2\\pi}{|b|}$：$b$ 越大，轉得越快，波越密。", tex: "y=\\co a\\sin(\\cb bx),\\quad \\text{振幅 }|a|,\\ \\text{週期 }\\frac{2\\pi}{|b|}" }
      ],
      hint: "拖動角度 x；最後一步拖動 a、b。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 540, 440, "單位圓與三角函數圖形");
        var g = s("g", {}, svg);
        var st = { x: 2.2, a: 1.5, b: 2 };
        var cx = 80, cy = 220, R = 56, gx = 170, gw = 350, U = 56;
        function GX(t) { return gx + t / (2 * Math.PI) * gw; }
        function GY(y) { return cy - y * U; }
        var read = SK.h("div", { class: "readout" });
        var sx = SK.slider({ label: "$x$", min: 0, max: 6.28, step: .01, value: st.x, fmt: function (v) { return SK.fmt(v, 2) + "（" + SK.fmt(SK.deg(v), 0) + "°）"; }, onInput: function (v) { st.x = v; draw(); } });
        var sa = SK.slider({ label: "$a$", min: -2.5, max: 2.5, step: .1, value: st.a, onInput: function (v) { st.a = v; draw(); } });
        var sb = SK.slider({ label: "$b$", min: .5, max: 4, step: .5, value: st.b, color: "blue", onInput: function (v) { st.b = v; draw(); } });
        ctx.sliders.appendChild(sx.el); ctx.sliders.appendChild(sa.el); ctx.sliders.appendChild(sb.el);
        ctx.extra.appendChild(read);
        function num(v) { return SK.fmt(v, 2).replace("−", "-"); }
        function curve(fn, x1, col, w, dash) {
          var d = "", pen = false;
          for (var t = 0; t <= x1 + 1e-9; t += .02) {
            var y = fn(t);
            if (!isFinite(y) || Math.abs(y) > 3.6) { pen = false; continue; }
            d += (pen ? "L" : "M") + GX(t).toFixed(1) + " " + GY(y).toFixed(1); pen = true;
          }
          s("path", { d: d, fill: "none", stroke: col, "stroke-width": w || 2.6, "stroke-dasharray": dash || null }, g);
        }
        function axes() {
          s("line", { x1: gx - 6, y1: cy, x2: 530, y2: cy, class: "m-axis" }, g);
          s("line", { x1: gx, y1: 20, x2: gx, y2: 420, class: "m-axis" }, g);
          [[Math.PI / 2, "π/2"], [Math.PI, "π"], [1.5 * Math.PI, "3π/2"], [2 * Math.PI, "2π"]].forEach(function (p) {
            s("line", { x1: GX(p[0]), y1: cy - 4, x2: GX(p[0]), y2: cy + 4, stroke: C.cocoa }, g);
            SK.label(g, GX(p[0]), cy + 16, p[1], { size: 11, color: C.soft });
          });
          [1, -1].forEach(function (y) { s("line", { x1: gx, y1: GY(y), x2: 530, y2: GY(y), class: "m-grid" }, g); SK.label(g, gx - 8, GY(y), String(y), { size: 11, color: C.soft, anchor: "end" }); });
          s("circle", { cx: cx, cy: cy, r: R, fill: "none", stroke: C.line, "stroke-width": 1.4 }, g);
          s("line", { x1: cx - R - 10, y1: cy, x2: cx + R + 14, y2: cy, class: "m-axis" }, g);
          s("line", { x1: cx, y1: cy - R - 14, x2: cx, y2: cy + R + 14, class: "m-axis" }, g);
        }
        function draw() {
          var f = ctx.frame, x = st.x;
          g.innerHTML = "";
          sx.el.style.display = f === 4 ? "none" : "";
          sa.el.style.display = sb.el.style.display = f === 4 ? "" : "none";
          axes();
          var P = [cx + R * Math.cos(x), cy - R * Math.sin(x)];
          if (f === 4) {
            var a = st.a, b = st.b;
            curve(Math.sin, 2 * Math.PI, "rgba(184,103,74,.35)", 1.6, "4 4");
            curve(function (t) { return a * Math.sin(b * t); }, 2 * Math.PI, C.purple.s, 2.8);
            var T = 2 * Math.PI / b;
            if (T <= 2 * Math.PI + 1e-9) { SK.brace(g, GX(0), GY(-Math.abs(a)) + 22, GX(T), GY(-Math.abs(a)) + 22, -10, C.blue.s); SK.label(g, GX(T / 2), GY(-Math.abs(a)) + 48, "一個週期", { size: 12, color: C.blue.s }); }
            s("line", { x1: GX(Math.PI / (2 * b)), y1: cy, x2: GX(Math.PI / (2 * b)), y2: GY(a), stroke: C.orange.s, "stroke-width": 2.4 }, g);
            SK.label(g, GX(Math.PI / (2 * b)) + 8, GY(a / 2), "振幅 " + num(Math.abs(a)), { size: 12, color: C.orange.s, anchor: "start" });
            read.innerHTML = SK.tex("y=" + num(a) + "\\sin(" + num(b) + "x),\\ \\ \\text{振幅 }" + num(Math.abs(a)) + ",\\ \\text{週期 }\\frac{2\\pi}{" + num(b) + "}\\approx" + num(T), true);
            return;
          }
          s("line", { x1: cx, y1: cy, x2: P[0], y2: P[1], stroke: C.cocoa, "stroke-width": 1.6 }, g);
          var arc = SK.arcPath(cx, cy, 16, 0, x);
          s("path", { d: arc, fill: "none", stroke: C.pink.s, "stroke-width": 1.6 }, g);
          var showSin = f === 0 || f === 1 || f === 3, showCos = f === 1 || f === 3, showTan = f === 2 || f === 3;
          if (showSin) {
            curve(Math.sin, f === 3 ? 2 * Math.PI : x, C.orange.s, 2.8);
            s("line", { x1: P[0], y1: cy, x2: P[0], y2: P[1], stroke: C.orange.s, "stroke-width": 3 }, g);
            if (f !== 3) s("line", { x1: P[0], y1: P[1], x2: GX(x), y2: P[1], stroke: C.orange.s, "stroke-dasharray": "3 4" }, g);
          }
          if (showCos) {
            curve(Math.cos, f === 3 ? 2 * Math.PI : x, C.blue.s, 2.8);
            s("line", { x1: cx, y1: cy, x2: P[0], y2: cy, stroke: C.blue.s, "stroke-width": 3 }, g);
          }
          if (showTan) {
            var T0 = [cx + R, cy - R * Math.tan(x)];
            s("line", { x1: cx + R, y1: cy - 3.6 * R, x2: cx + R, y2: cy + 3.6 * R, stroke: C.green.s, "stroke-width": 1, "stroke-dasharray": "3 4" }, g);
            if (Math.abs(Math.cos(x)) > .05 && Math.abs(Math.tan(x)) < 3.6) {
              s("line", { x1: cx, y1: cy, x2: T0[0], y2: T0[1], stroke: C.green.s, "stroke-width": 1.4, "stroke-dasharray": "4 3" }, g);
              s("line", { x1: T0[0], y1: cy, x2: T0[0], y2: T0[1], stroke: C.green.s, "stroke-width": 3 }, g);
              if (f === 2) s("line", { x1: T0[0], y1: T0[1], x2: GX(x), y2: GY(Math.tan(x)), stroke: C.green.s, "stroke-dasharray": "3 4" }, g);
            }
            curve(Math.tan, f === 3 ? 2 * Math.PI : x, C.green.s, 2.8);
            [Math.PI / 2, 1.5 * Math.PI].forEach(function (a) { s("line", { x1: GX(a), y1: 20, x2: GX(a), y2: 420, stroke: C.green.s, "stroke-dasharray": "6 5", opacity: .6 }, g); });
          }
          s("circle", { cx: P[0], cy: P[1], r: 6, fill: C.pink.s }, g);
          if (f !== 3) s("circle", { cx: GX(x), cy: GY(f === 2 ? SK.clamp(Math.tan(x), -3.6, 3.6) : Math.sin(x)), r: 5, fill: f === 2 ? C.green.s : C.orange.s }, g);
          var tn = Math.abs(Math.cos(x)) < 1e-3 ? "\\text{不存在}" : num(Math.tan(x));
          read.innerHTML = SK.tex("\\sin x=" + num(Math.sin(x)) + ",\\ \\cos x=" + num(Math.cos(x)) + ",\\ \\tan x=" + tn, true);
        }
        return { show: draw };
      }
    },

    drills: [
      { title: "一般式 $y=a\\sin(bx+c)+d$：讀圖、變換次序、反建模與區間最值", code: "F-11A-1",
        demo: {
          q: "$y=3\\sin\\left(2x-\\dfrac\\pi3\\right)+1$。求振幅、週期、水平平移量、值域；說明它如何由 $y=\\sin x$ 變換而來；並求它在 $\\left[0,\\dfrac\\pi2\\right]$ 上的最大值與最小值。",
          steps: [
            "振幅 $|a|=3$；週期 $\\frac{2\\pi}{|b|}=\\pi$；中線 $y=1$；值域 $[1-3,\\,1+3]=[-2,4]$。",
            "先把 $b$ 提出來：$3\\sin\\left(2\\left(x-\\frac\\pi6\\right)\\right)+1$。水平平移量是向右 $\\frac\\pi6$，<b>不是</b> $\\frac\\pi3$。",
            "一種安全的變換次序：$\\sin x$ → 右移 $\\frac\\pi3$ 得 $\\sin\\left(x-\\frac\\pi3\\right)$ → 水平壓縮成 $\\frac12$ 倍得 $\\sin\\left(2x-\\frac\\pi3\\right)$ → 鉛直伸縮 $3$ 倍 → 上移 $1$。若先壓縮再平移，平移量要改成 $\\frac\\pi6$。",
            "區間最值：令 $u=2x-\\frac\\pi3$。$x\\in\\left[0,\\frac\\pi2\\right]\\Rightarrow u\\in\\left[-\\frac\\pi3,\\frac{2\\pi}3\\right]$。在這段上 $\\sin u$ 最大 $1$（$u=\\frac\\pi2$，即 $x=\\frac{5\\pi}{12}$）、最小 $-\\frac{\\sqrt3}2$（$u=-\\frac\\pi3$，即端點 $x=0$）。",
            "所以最大值 $4$、最小值 $1-\\frac{3\\sqrt3}2\\approx-1.60$——最小值出現在<b>端點</b>，並不是值域的下界 $-2$。"
          ]
        },
        tries: [
          { q: "某正弦曲線 $y=a\\sin(bx+c)+d$（$a,b>0$）的一個最高點是 $\\left(\\frac\\pi4,5\\right)$，相鄰的最低點是 $\\left(\\frac{3\\pi}4,-1\\right)$。求 $a,b,d$ 及一個 $c$。", ans: "$d=\\frac{5+(-1)}2=2$、$a=3$。最高到最低是半個週期 $\\frac\\pi2$，週期 $\\pi$，$b=2$。在 $x=\\frac\\pi4$ 取最大：$2\\cdot\\frac\\pi4+c=\\frac\\pi2$，$c=0$。$y=3\\sin2x+2$（$c$ 也可加 $2\\pi$ 的整數倍）。" },
          { q: "港口水深 $D(t)=4\\sin\\frac{\\pi t}6+10$（公尺），$0\\le t\\le24$（小時）。哪些時段水深至少 $12$ 公尺？", ans: "$\\sin\\frac{\\pi t}6\\ge\\frac12\\Rightarrow\\frac{\\pi t}6\\in\\left[\\frac\\pi6,\\frac{5\\pi}6\\right]$（再加 $2\\pi$ 的倍數），$t\\in[1,5]\\cup[13,17]$。" },
          { q: "$y=\\tan2x$ 的週期與漸近線。", ans: "週期 $\\frac\\pi2$；$2x=\\frac\\pi2+k\\pi$，漸近線 $x=\\frac\\pi4+\\frac{k\\pi}2$（$k$ 為整數），這些 $x$ 不在定義域內。" }
        ],
        edge: "水平平移量是 $-\\frac cb$，不是 $-c$。$a<0$ 時圖形上下翻轉，振幅仍是 $|a|$。反建模時 $c$ 不唯一（可差週期的整數倍，也可和 $a$ 的正負互換），題目通常會限制範圍。$\\tan$ 的週期是 $\\frac\\pi{|b|}$，漸近線處沒有定義，不能當成解。限定區間的最值，一定要比較端點。"
      }
    ],

    angles: [
      { title: "sin 和 cos 其實是同一條曲線", icon: "sparkle",
        html: "把 $y=\\sin x$ 往左平移 $\\tfrac\\pi2$，就和 $y=\\cos x$ 完全重合。一個點在圓上轉，高度和水平位置是同一個運動，只是看的方向差了 $90^\\circ$。這也是為什麼「波的疊合」單元能把 $a\\sin x+b\\cos x$ 合成一個正弦波。" },
      { title: "cot、sec、csc 的圖形（延伸）", icon: "leaf",
        html: "$\\cot x=\\tfrac{\\cos x}{\\sin x}$、$\\sec x=\\tfrac{1}{\\cos x}$、$\\csc x=\\tfrac{1}{\\sin x}$。倒數的圖形：原函數靠近 0 的地方，倒數衝向無限大，變成漸近線；原函數是 $\\pm1$ 的地方，倒數也是 $\\pm1$。這三個函數在課綱標為 ※ 延伸，不列入考試。" }
    ],

    challenges: [
      { q: "$y=3\\sin2x$ 的最大值、最小值、週期各是多少？", idea: "最大 3、最小 $-3$、週期 $\\tfrac{2\\pi}{2}=\\pi$。" },
      { q: "在 $0\\le x\\le2\\pi$ 中，$\\sin x=\\cos x$ 有幾個解？", idea: "兩條曲線交兩次：$x=\\tfrac\\pi4$ 和 $\\tfrac{5\\pi}{4}$，也就是 $\\tan x=1$ 的兩個解。" },
      { q: "$y=\\tan x$ 的圖形對原點對稱嗎？", idea: "對。$\\tan(-x)=\\tfrac{\\sin(-x)}{\\cos(-x)}=\\tfrac{-\\sin x}{\\cos x}=-\\tan x$。$\\sin$ 也對原點對稱，$\\cos$ 則對 $y$ 軸對稱。" }
    ],

    where: {
      codes: [["F-11A-1", "三角函數的圖形：$\\sin$、$\\cos$、$\\tan$ 的圖形、定義域與值域、週期性，週期現象的數學模型；$\\cot$、$\\sec$、$\\csc$ 的定義與圖形為 ※ 延伸"]],
      exam: "11 年級<b>數學 A</b>，學測數 A、分科數甲都在範圍內。數學 B 只學正弦函數的週期模型（見「週期性數學模型」）。",

      past: [] /* Examination text excluded; see docs/PROVENANCE.md. */,
      stop: "三個基本函數的圖形、振幅與週期就夠了。$\\cot$、$\\sec$、$\\csc$ 只作延伸；複雜的平移伸縮組合在波的疊合單元處理。"
    }
  });
})();
