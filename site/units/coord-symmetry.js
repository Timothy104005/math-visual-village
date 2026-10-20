/* 單元：坐標圖形的對稱 */
(function () {
  var C = SK.C, s = SK.s;

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 250, "沿著直線摺紙");
    s("rect", { x: 40, y: 20, width: 320, height: 210, fill: C.paper, stroke: C.cocoa }, svg);
    s("line", { x1: 60, y1: 210, x2: 340, y2: 40, stroke: C.purple.s, "stroke-width": 2, "stroke-dasharray": "7 5" }, svg);
    s("path", { d: "M120 90 l40 -20 l10 40z", fill: C.orange.f, stroke: C.orange.s, "stroke-width": 1.5 }, svg);
    s("path", { d: "M220 180 l-12 -40 l38 -6z", fill: C.blue.f, stroke: C.blue.s, "stroke-width": 1.5, "stroke-dasharray": "4 3" }, svg);
    SK.label(svg, 318, 30, "y = x", { size: 14, color: C.purple.s });
    SK.label(svg, 200, 242, "沿虛線對摺，三角形會落到哪裡？", { size: 13, color: C.soft });
  }

  var MODES = [
    ["x 軸", function (p) { return [p[0], -p[1]]; }, "(x,\\,-y)"],
    ["y 軸", function (p) { return [-p[0], p[1]]; }, "(-x,\\,y)"],
    ["原點", function (p) { return [-p[0], -p[1]]; }, "(-x,\\,-y)"],
    ["y = x", function (p) { return [p[1], p[0]]; }, "(y,\\,x)"]
  ];
  var FNS = [
    ["y = x²", function (x) { return x * x / 2; }, "y=\\tfrac12x^2"],
    ["y = x³", function (x) { return x * x * x / 6; }, "y=\\tfrac16x^3"],
    ["y = 2ˣ", function (x) { return Math.pow(2, x); }, "y=2^x"],
    ["y = x + 2", function (x) { return x / 2 + 2; }, "y=\\tfrac12x+2"]
  ];

  SK.mountUnit({
    slug: "coord-symmetry",
    en: "Folding the plane swaps coordinates",
    formula: "(x,y)\\ \\xrightarrow{\\ x\\text{ 軸}\\ }\\ (x,-y),\\quad \\xrightarrow{\\ y\\text{ 軸}\\ }\\ (-x,y),\\quad \\xrightarrow{\\ \\text{原點}\\ }\\ (-x,-y),\\quad \\xrightarrow{\\ y=x\\ }\\ (y,x)",

    hook: {
      html: "把坐標平面沿著一條線對摺，每個點都會落到另一個點上。",
      ask: "如果沿著 $y=x$ 這條斜線摺，點 $(3,1)$ 會落到哪裡？有沒有不用畫圖就知道的方法？",
      visual: hookVisual
    },

    guess: {
      q: "點 $(3,1)$ 對直線 $y=x$ 的對稱點是？",
      options: [
        { t: "$(1,3)$", truth: true, explain: "沿 $y=x$ 對摺，$x$ 軸和 $y$ 軸剛好互換，所以兩個坐標互換位子。$(3,1)$ 和 $(1,3)$ 的中點 $(2,2)$ 在 $y=x$ 上，連線斜率 $-1$ 和 $y=x$ 垂直。" },
        { t: "$(-3,-1)$", common: true, explain: "這是對<b>原點</b>的對稱點（轉半圈）。對 $y=x$ 摺的時候，點會沿著和 $y=x$ 垂直的方向移動，而不是穿過原點。" },
        { t: "$(3,-1)$", explain: "這是對 $x$ 軸的對稱點：上下翻過去。" },
        { t: "$(-1,3)$", explain: "這是把 $(3,1)$ 繞原點逆時針轉 $90^\\circ$ 的結果，不是摺出來的。旋轉不會把圖形翻面，摺紙會：摺過去的圖形是原來的鏡像。" }
      ]
    },

    derive: {
      intro: "拖動蜜桃色的點 $P$，看它的四個對稱點怎麼跟著動。",
      tall: true,
      frames: [
        { cap: "對 <b>$x$ 軸</b>對稱：上下翻，$x$ 不變、$y$ 變號。兩點的中點在 $x$ 軸上，連線垂直 $x$ 軸。", tex: "(x,y)\\to(x,-y)" },
        { cap: "對 <b>$y$ 軸</b>對稱：左右翻，$y$ 不變、$x$ 變號。", tex: "(x,y)\\to(-x,y)" },
        { cap: "對<b>原點</b>對稱：兩個坐標都變號。它等於先對 $x$ 軸、再對 $y$ 軸翻一次，也等於繞原點轉 $180^\\circ$。", tex: "(x,y)\\to(-x,-y)" },
        { cap: "對直線 <b>$y=x$</b> 對稱：兩個坐標<b>互換</b>。中點 $\\left(\\tfrac{x+y}2,\\tfrac{x+y}2\\right)$ 在 $y=x$ 上，連線斜率 $-1$ 和 $y=x$ 垂直。", tex: "(x,y)\\to(y,x)" },
        { cap: "整個圖形也可以翻：把方程式裡的 $y$ 換成 $-y$，就得到對 $x$ 軸的鏡像；換成 $x\\leftrightarrow y$，就是對 $y=x$ 的鏡像。若翻完方程式不變，圖形就自己對稱，例如 $y=x^2$ 把 $x$ 換成 $-x$ 不變，所以對 $y$ 軸對稱。", tex: "y=f(x)\\ \\xrightarrow{\\ y=x\\ }\\ x=f(y)" }
      ],
      hint: "拖動 P；第 5 步可以換函數、換對稱軸。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 540, 440, "坐標平面上的對稱點");
        var gridG = s("g", {}, svg), g = s("g", {}, svg), hg = s("g", {}, svg);
        var O = [270, 220], u = 34, st = { p: [3, 1], fn: 0, ax: 1 };
        function P(v) { return [O[0] + v[0] * u, O[1] - v[1] * u]; }
        for (var i = -7; i <= 7; i++) s("line", { x1: O[0] + i * u, y1: 10, x2: O[0] + i * u, y2: 430, class: "m-grid" }, gridG);
        for (var j = -6; j <= 6; j++) s("line", { x1: 10, y1: O[1] - j * u, x2: 530, y2: O[1] - j * u, class: "m-grid" }, gridG);
        s("line", { x1: 10, y1: O[1], x2: 530, y2: O[1], class: "m-axis" }, gridG);
        s("line", { x1: O[0], y1: 10, x2: O[0], y2: 430, class: "m-axis" }, gridG);
        SK.label(gridG, 520, O[1] + 14, "x", { it: true }); SK.label(gridG, O[0] + 12, 18, "y", { it: true });
        var hP = SK.handle(hg, 0, 0, C.orange.s, "點 P");
        SK.drag(svg, hP, function (x, y) { st.p = [SK.clamp(Math.round((x - O[0]) / u * 2) / 2, -6, 6), SK.clamp(Math.round((O[1] - y) / u * 2) / 2, -5.5, 5.5)]; draw(); }, function () { return P(st.p); }, u / 2);
        var read = SK.h("div", { class: "readout" });
        var ctl = SK.h("div", { style: "display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px" });
        FNS.forEach(function (fn, i) {
          var b = SK.h("button", { class: "chip", type: "button", "aria-pressed": i === 0 ? "true" : "false" }, fn[0]);
          b.addEventListener("click", function () { st.fn = i; Array.prototype.forEach.call(b.parentNode.querySelectorAll("[data-f]"), function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); }); draw(); });
          b.setAttribute("data-f", i); ctl.appendChild(b);
        });
        var ctl2 = SK.h("div", { style: "display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px" });
        MODES.forEach(function (m, i) {
          var b = SK.h("button", { class: "chip", type: "button", "aria-pressed": i === 1 ? "true" : "false" }, "對 " + m[0]);
          b.addEventListener("click", function () { st.ax = i; Array.prototype.forEach.call(ctl2.children, function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); }); draw(); });
          ctl2.appendChild(b);
        });
        ctx.extra.appendChild(ctl); ctx.extra.appendChild(ctl2); ctx.extra.appendChild(read);
        var cols = [C.blue, C.green, C.pink, C.purple];
        function mirrorLine(k) {
          if (k === 0) s("line", { x1: 10, y1: O[1], x2: 530, y2: O[1], stroke: cols[0].s, "stroke-width": 3, opacity: .5 }, g);
          if (k === 1) s("line", { x1: O[0], y1: 10, x2: O[0], y2: 430, stroke: cols[1].s, "stroke-width": 3, opacity: .5 }, g);
          if (k === 2) s("circle", { cx: O[0], cy: O[1], r: 7, fill: cols[2].s, opacity: .6 }, g);
          if (k === 3) { var a = P([-6.3, -6.3]), b = P([6.3, 6.3]); s("line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: cols[3].s, "stroke-width": 3, opacity: .5, "stroke-dasharray": "8 5" }, g); }
        }
        function curve(fn, map, col, dash) {
          var d = "", pen = false;
          for (var x = -8; x <= 8; x += .05) {
            var y = fn(x);
            if (!isFinite(y) || Math.abs(y) > 20) { pen = false; continue; }
            var q = P(map([x, y]));
            if (q[0] < 0 || q[0] > 540 || q[1] < -40 || q[1] > 480) { pen = false; continue; }
            d += (pen ? "L" : "M") + q[0].toFixed(1) + " " + q[1].toFixed(1); pen = true;
          }
          s("path", { d: d, fill: "none", stroke: col, "stroke-width": 2.6, "stroke-dasharray": dash || null }, g);
        }
        function draw() {
          var f = ctx.frame, p = st.p;
          g.innerHTML = "";
          ctl.style.display = ctl2.style.display = f === 4 ? "flex" : "none";
          hP.style.display = f === 4 ? "none" : "";
          if (f === 4) {
            var fn = FNS[st.fn], m = MODES[st.ax];
            mirrorLine(st.ax);
            curve(fn[1], function (q) { return q; }, C.orange.s);
            curve(fn[1], m[1], cols[st.ax].s, "7 5");
            var same = true;
            for (var t = -2; t <= 2; t += .5) { var q = m[1]([t, fn[1](t)]); if (Math.abs(fn[1](q[0]) - q[1]) > 1e-9) same = false; }
            read.innerHTML = SK.tex(fn[2] + "\\ \\text{對 " + m[0].replace("y = x", "y=x") + " 翻過去}", true) + '<p style="margin:4px 0 0">' + (same ? "✓ 翻完和原圖重合：圖形本身<b>對" + m[0] + "對稱</b>" : "翻完是另一條曲線（虛線）") + "</p>";
            return;
          }
          var show = f <= 3 ? [f] : [0, 1, 2, 3];
          show.forEach(function (k) {
            mirrorLine(k);
            var q = MODES[k][1](p), A = P(p), B = P(q);
            s("line", { x1: A[0], y1: A[1], x2: B[0], y2: B[1], stroke: cols[k].s, "stroke-width": 1.4, "stroke-dasharray": "4 4" }, g);
            var M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
            s("circle", { cx: M[0], cy: M[1], r: 3.5, fill: C.paper, stroke: cols[k].s, "stroke-width": 1.5 }, g);
            s("circle", { cx: B[0], cy: B[1], r: 8, fill: cols[k].f, stroke: cols[k].s, "stroke-width": 2 }, g);
            SK.label(g, B[0] + 12, B[1] - 14, "(" + SK.fmt(q[0], 1) + ", " + SK.fmt(q[1], 1) + ")", { size: 13, color: cols[k].s, anchor: "start" });
          });
          var A2 = P(p);
          SK.label(g, A2[0] + 12, A2[1] - 14, "P(" + SK.fmt(p[0], 1) + ", " + SK.fmt(p[1], 1) + ")", { size: 13, color: C.orange.s, anchor: "start" });
          hP.moveTo(A2[0], A2[1]);
          var q2 = MODES[f][1](p);
          read.innerHTML = SK.tex("(" + SK.fmt(p[0], 1) + "," + SK.fmt(p[1], 1) + ")\\ \\to\\ (" + SK.fmt(q2[0], 1) + "," + SK.fmt(q2[1], 1) + ")", true).replace(/−/g, "-");
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "兩次鏡子 = 一次旋轉", icon: "sparkle",
        html: "先對 $x$ 軸翻：$(x,y)\\to(x,-y)$；再對 $y$ 軸翻：$\\to(-x,-y)$。兩次鏡像合起來，變成對原點的點對稱，也就是轉 $180^\\circ$。照鏡子兩次，左右手又換回來了，所以結果是一個「不翻面」的旋轉。" },
      { title: "指數與對數：對 y = x 的一對", icon: "leaf",
        html: "$y=2^x$ 經過 $(1,2)$、$(2,4)$；把坐標互換，得到 $(2,1)$、$(4,2)$，正好在 $y=\\log_2x$ 上。一個函數和它的反函數，圖形永遠對 $y=x$ 對稱。第 5 步選 $y=2^x$ 對 $y=x$ 翻看看。" }
    ],

    challenges: [
      { q: "$y=x^3$ 的圖形對什麼對稱？怎麼從方程式看出來？", idea: "把 $(x,y)$ 換成 $(-x,-y)$：$-y=(-x)^3=-x^3$，也就是 $y=x^3$，方程式不變，所以對原點對稱。" },
      { q: "直線 $y=2x+1$ 對 $y=x$ 的鏡像是哪一條直線？", idea: "$x,y$ 互換：$x=2y+1$，即 $y=\\tfrac{x-1}{2}$。斜率從 2 變成 $\\tfrac12$：互為倒數。" },
      { q: "圓 $(x-3)^2+(y-1)^2=4$ 對 $x$ 軸的鏡像是什麼？", idea: "$y$ 換成 $-y$：$(x-3)^2+(-y-1)^2=4$，即 $(x-3)^2+(y+1)^2=4$。圓心從 $(3,1)$ 翻到 $(3,-1)$，半徑不變。" }
    ],

    where: {
      codes: [["G-10-1", "坐標圖形的對稱性：對 $x$ 軸、$y$ 軸、原點、直線 $y=x$ 的對稱"]],
      exam: "10 年級<b>共同必修</b>。大考標為 ＃（可在其他題目中出現）。",
      stop: "只處理對 $x$ 軸、$y$ 軸、原點與 $y=x$ 的對稱。對一般直線或一般點的對稱不在課綱範圍。"
    }
  });
})();
