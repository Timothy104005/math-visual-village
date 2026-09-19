/* 單元 4：配方法與頂點式 */
(function () {
  var C = SK.C, s = SK.s;

  function hookVisual(el) {
    var svg = SK.svg(el, 420, 300, "一塊 x 乘 x 的正方形和一條 6 乘 x 的長條");
    var X = 170, u = 16, x0 = 40, y0 = 60;
    s("rect", { x: x0, y: y0, width: X, height: X, fill: C.orange.f, stroke: C.orange.s, "stroke-width": 2, filter: "url(#sk-soft)" }, svg);
    SK.label(svg, x0 + X / 2, y0 + X / 2, "x²", { it: true, size: 24, color: C.orange.s });
    s("rect", { x: x0 + X + 40, y: y0, width: 6 * u, height: X, fill: C.blue.f, stroke: C.blue.s, "stroke-width": 2, filter: "url(#sk-soft)" }, svg);
    SK.label(svg, x0 + X + 40 + 3 * u, y0 + X / 2, "6x", { it: true, size: 22, color: C.blue.s });
    SK.label(svg, x0 + X / 2, y0 - 18, "x", { it: true });
    SK.label(svg, x0 + X + 40 + 3 * u, y0 - 18, "6", { size: 16 });
    SK.label(svg, x0 + X + 20, y0 + X / 2, "+", { size: 24 });
    SK.label(svg, 210, 270, "能不能剪一剪，拼成一個正方形？", { size: 15, color: C.soft });
  }

  function parabolaAngle(el) {
    var wrap = SK.h("div", { class: "two-col" });
    var st = SK.h("div", { class: "stage" }), side = SK.h("div", { class: "sliders" });
    wrap.appendChild(st); wrap.appendChild(side); el.appendChild(wrap);
    var W = 420, H = 380, sc = 20, ox = 210, oy = 230;
    var svg = SK.svg(st, W, H, "拋物線 y 等於 x 平方加 bx 加 c 與它的頂點");
    var g = s("g", {}, svg);
    var stt = { b: 4, c: 1 };
    function X(x) { return ox + x * sc; } function Y(y) { return oy - y * sc; }
    function draw() {
      g.innerHTML = "";
      for (var i = -10; i <= 10; i++) {
        s("line", { x1: X(i), y1: 0, x2: X(i), y2: H, class: "m-grid" }, g);
      }
      for (var j = -8; j <= 12; j++) s("line", { x1: 0, y1: Y(j), x2: W, y2: Y(j), class: "m-grid" }, g);
      s("line", { x1: 0, y1: oy, x2: W, y2: oy, class: "m-axis" }, g);
      s("line", { x1: ox, y1: 0, x2: ox, y2: H, class: "m-axis" }, g);
      var b = stt.b, c = stt.c, h = -b / 2, k = c - b * b / 4;
      // y = x^2 的淡影子
      var d0 = "", d = "";
      for (var x = -11; x <= 11; x += .1) {
        d0 += (d0 ? "L" : "M") + X(x) + " " + Y(x * x) + " ";
        d += (d ? "L" : "M") + X(x) + " " + Y(x * x + b * x + c) + " ";
      }
      s("path", { d: d0, fill: "none", stroke: C.line, "stroke-width": 2, "stroke-dasharray": "5 5" }, g);
      s("path", { d: d, fill: "none", stroke: C.green.s, "stroke-width": 3.2 }, g);
      s("line", { x1: X(h), y1: 0, x2: X(h), y2: H, stroke: C.purple.s, "stroke-dasharray": "6 5", "stroke-width": 1.6 }, g);
      // 平移箭頭：從 (0,0) 到頂點
      SK.arrow(g, X(0), Y(0), X(h), Y(k), C.orange.s, 2.5);
      s("circle", { cx: X(h), cy: Y(k), r: 7, fill: C.orange.s, stroke: "#fff", "stroke-width": 2 }, g);
      SK.label(g, X(h) + (h <= 0 ? -10 : 10), Y(k) + 22, "(" + SK.fmt(h) + ", " + SK.fmt(k) + ")", { size: 14, anchor: h <= 0 ? "end" : "start", color: C.orange.s });
      side.querySelector(".readout").innerHTML =
        SK.tex("y=x^2" + (b ? (b > 0 ? "+" : "-") + Math.abs(b) + "x" : "") + (c ? (c > 0 ? "+" : "-") + Math.abs(c) : ""), true) +
        SK.tex("=\\left(x" + (h ? (h > 0 ? "-" : "+") + SK.fmt(Math.abs(h)) : "") + "\\right)^2" + (k ? (k > 0 ? "+" : "-") + SK.fmt(Math.abs(k)) : ""), true);
    }
    side.appendChild(SK.slider({ label: "$b$", min: -8, max: 8, value: stt.b, onInput: function (v) { stt.b = v; draw(); } }).el);
    side.appendChild(SK.slider({ label: "$c$", min: -6, max: 8, value: stt.c, color: "blue", onInput: function (v) { stt.c = v; draw(); } }).el);
    side.insertAdjacentHTML("beforeend", '<div class="readout"></div><p class="muted" style="margin:0;font-size:.95rem">' +
      SK.md("虛線是 $y=x^2$。配方後的式子直接告訴你：整條拋物線被<b>平移</b>到頂點 $\\left(-\\tfrac b2,\\ c-\\tfrac{b^2}{4}\\right)$，形狀完全沒變。灰紫色虛線是對稱軸。") + "</p>");
    draw();
  }

  function khwarizmiAngle(el) {
    var svg = SK.svg(el, 520, 250, "花拉子米用補正方形解 x 平方加 6x 等於 16");
    var x0 = 30, y0 = 30, X = 120, u = 20, w = 3 * u;
    function r(x, y, W, H, col, dash) { s("rect", { x: x, y: y, width: W, height: H, fill: col.f, stroke: col.s, "stroke-width": 2, "stroke-dasharray": dash || null }, svg); }
    r(x0, y0, X, X, C.orange); r(x0 + X, y0, w, X, C.blue); r(x0, y0 + X, X, w, C.blue); r(x0 + X, y0 + X, w, w, C.gold, "5 4");
    SK.label(svg, x0 + X / 2, y0 + X / 2, "x²", { it: true, size: 20 });
    SK.label(svg, x0 + X + w / 2, y0 + X / 2, "3x", { it: true, size: 15 });
    SK.label(svg, x0 + X / 2, y0 + X + w / 2, "3x", { it: true, size: 15 });
    SK.label(svg, x0 + X + w / 2, y0 + X + w / 2, "9", { size: 16, color: C.gold.s });
    var tx = 270;
    [["L 形面積 = 16", 50], ["補上角落 9 → 大正方形 25", 90], ["大正方形邊長 = 5", 130], ["所以 x + 3 = 5，x = 2", 170]].forEach(function (t) {
      SK.label(svg, tx, t[1], t[0], { anchor: "start", size: 16 });
    });
  }

  SK.mountUnit({
    slug: "completing-square",
    en: "Cut a strip, fill a corner",
    formula: "x^2+\\cb{b}x+c=\\left(x+\\cb{\\tfrac b2}\\right)^2-\\cy{\\left(\\tfrac b2\\right)^2}+c",

    hook: {
      html: "桌上有一塊 $x\\times x$ 的正方形紙片，和一條 $6\\times x$ 的長條紙片。",
      ask: "只能剪、不能丟，也可以再拿一小塊新紙片來補。你要怎麼把它們拼成一個<b>正方形</b>？",
      visual: hookVisual
    },

    guess: {
      q: "要讓 $x^2+6x+\\square$ 變成「某個東西的平方」，框框裡要填多少？",
      options: [
        { t: "$6$", explain: "直覺上把 $6$ 補回去很合理，但我們要補的是一塊<b>面積</b>，它的大小由長條被剪開後的寬度決定，不是直接用 6。" },
        { t: "$9$", truth: true, explain: "把 $6x$ 的長條剪成兩條 $3\\times x$，一條放右邊、一條放下面，角落剛好缺一塊 $3\\times3=9$。補上後 $x^2+6x+9=(x+3)^2$。" },
        { t: "$36$", common: true, explain: "很多人會想「6 就平方一下」。可是長條要<b>對半</b>剪，分到兩邊，所以缺的是 $\\left(\\tfrac62\\right)^2=9$，不是 $6^2$。代 $x=1$ 驗算：$1+6+36=43$ 不是平方數，$1+6+9=16=4^2$ 才是。" },
        { t: "$3$", explain: "你抓到了關鍵的「一半」！不過 3 是缺角的<b>邊長</b>；要補上的是一整塊面積 $3\\times3=9$。" }
      ]
    },

    derive: {
      intro: "把 $x^2+bx$ 當成紙片來剪貼。拖動滑桿改變 $b$，$x$ 則是任意長度。",
      frames: [
        { cap: "一塊 $\\co{x^2}$ 的正方形，加上一條寬 $\\cb{b}$、長 $x$ 的長條 $\\cb{bx}$。", tex: "\\co{x^2}+\\cb{bx}" },
        { cap: "把長條從中間剪開，變成兩條寬 $\\cb{\\tfrac b2}$ 的細長條。", tex: "\\co{x^2}+\\cb{\\tfrac b2x}+\\cb{\\tfrac b2x}" },
        { cap: "把其中一條<b>轉 90°</b> 搬到正方形下面，圖形變成一個 L 形。面積沒變！", tex: "\\co{x^2}+\\cb{bx}=\\text{L 形}" },
        { cap: "L 形的右下角缺了一小塊邊長 $\\tfrac b2$ 的正方形。補上它，就拼成邊長 $x+\\tfrac b2$ 的大正方形。", tex: "\\co{x^2}+\\cb{bx}+\\cy{\\left(\\tfrac b2\\right)^2}=\\left(x+\\tfrac b2\\right)^2" },
        { cap: "補了多少就要扣回多少，這就是「配方」：", tex: "\\co{x^2}+\\cb{bx}=\\left(x+\\tfrac b2\\right)^2-\\cy{\\left(\\tfrac b2\\right)^2}" },
        { cap: "兩邊再加上 $c$，就得到頂點式。它告訴我們 $x=-\\tfrac b2$ 時平方項最小（等於 0），所以拋物線的頂點在那裡。", tex: "x^2+bx+c=\\left(x+\\tfrac b2\\right)^2+\\left(c-\\tfrac{b^2}{4}\\right)" }
      ],
      setup: function (ctx) {
        var st = { b: 6 };
        var svg = SK.svg(ctx.stage, 520, 420, "配方法的剪貼過程");
        var g = s("g", {}, svg), top = s("g", {}, svg);
        var X = 220, u = 20, x0 = 50, y0 = 50;
        var sq = s("rect", { x: x0, y: y0, width: X, height: X, fill: C.orange.f, stroke: C.orange.s, "stroke-width": 2.2 }, g);
        SK.label(g, x0 + X / 2, y0 + X / 2, "x²", { it: true, size: 30, color: C.orange.s });
        var h1 = s("g", { class: "move" }, g), h2 = s("g", { class: "move" }, g), corner = s("g", { class: "fade" }, g);
        var labels = s("g", {}, top);
        function draw() {
          var f = ctx.frame, b = st.b, w = b / 2 * u;
          h1.innerHTML = ""; h2.innerHTML = ""; corner.innerHTML = ""; labels.innerHTML = "";
          [h1, h2].forEach(function (hg) {
            s("rect", { x: 0, y: 0, width: w, height: X, fill: C.blue.f, stroke: C.blue.s, "stroke-width": 2 }, hg);
            SK.label(hg, w / 2, X / 2, f === 0 ? "" : "b/2·x", { size: 12, color: C.blue.s }).setAttribute("transform", "rotate(-90 " + w / 2 + " " + X / 2 + ")");
            hg.style.transformOrigin = "0px 0px";
          });
          h1.style.transform = "translate(" + (x0 + X) + "px," + y0 + "px)";
          var gapX = f === 0 ? 0 : 14;
          if (f <= 1) h2.style.transform = "translate(" + (x0 + X + w + gapX) + "px," + y0 + "px) rotate(0deg)";
          else h2.style.transform = "translate(" + (x0 + X) + "px," + (y0 + X) + "px) rotate(90deg)";
          if (f === 0) {
            // 還沒剪：畫成一整條
            s("rect", { x: x0 + X, y: y0, width: 2 * w, height: X, fill: "none", stroke: C.blue.s, "stroke-width": 2.4 }, labels);
            SK.label(labels, x0 + X + w, y0 + X / 2, "bx", { it: true, size: 22, color: C.blue.s });
            SK.label(labels, x0 + X + w, y0 - 18, "b", { it: true, color: C.blue.s });
          } else {
            SK.label(labels, x0 + X + w / 2, y0 - 18, "b/2", { size: 15, color: C.blue.s });
            if (f >= 2) SK.label(labels, x0 - 26, y0 + X + w / 2, "b/2", { size: 15, color: C.blue.s });
          }
          if (f === 1) s("line", { x1: x0 + X + w, y1: y0 - 6, x2: x0 + X + w, y2: y0 + X + 6, stroke: C.ink, "stroke-width": 1.6, "stroke-dasharray": "5 4" }, labels);
          SK.label(labels, x0 + X / 2, y0 - 18, "x", { it: true, color: C.orange.s });
          SK.label(labels, x0 - 22, y0 + X / 2, "x", { it: true, color: C.orange.s });
          if (f >= 3) {
            s("rect", { x: x0 + X, y: y0 + X, width: w, height: w, fill: f >= 3 ? C.gold.f : "none", stroke: C.gold.s, "stroke-width": 2, "stroke-dasharray": "6 4" }, corner);
            if (w > 26) SK.label(corner, x0 + X + w / 2, y0 + X + w / 2, "(b/2)²", { size: Math.min(14, w / 3.2), color: C.gold.s });
            s("rect", { x: x0, y: y0, width: X + w, height: X + w, fill: "none", stroke: C.ink, "stroke-width": 2.6, rx: 2 }, corner);
            SK.brace(corner, x0 + X + w + 10, y0, x0 + X + w + 10, y0 + X + w, -16);
            SK.label(corner, x0 + X + w + 44, y0 + (X + w) / 2, "x + b/2", { size: 15 });
          } else if (f === 2) {
            s("rect", { x: x0 + X, y: y0 + X, width: w, height: w, fill: "none", stroke: C.gold.s, "stroke-width": 2, "stroke-dasharray": "4 4", class: "pulse" }, corner);
            SK.label(corner, x0 + X + w + 16, y0 + X + w / 2, "缺一角？", { size: 14, anchor: "start", color: C.gold.s });
          }
        }
        ctx.sliders.appendChild(SK.slider({ label: "$b$", min: 1, max: 8, value: st.b, color: "blue", onInput: function (v) { st.b = v; draw(); } }).el);
        return { show: draw };
      }
    },

    angles: [
      { title: "同一件事，在拋物線上看", icon: "sparkle", render: parabolaAngle },
      { title: "一千兩百年前的解法", icon: "bulb",
        html: "九世紀的數學家花拉子米（al-Khwārizmī，「演算法」algorithm 這個字就來自他的名字）就是這樣解 $x^2+6x=16$ 的：他沒有用符號，而是真的畫正方形、補角落。",
        render: khwarizmiAngle,
        after: "有趣的是，他的圖只給出 $x=2$。代數還會告訴你 $x+3=-5$，也就是 $x=-8$。圖像幫我們<b>理解</b>，符號帶我們<b>走得更遠</b>，兩個一起用最強。" }
    ],

    challenges: [
      { q: "用同一種補正方形的步驟處理 $ax^2+bx+c=0$，推出公式解 $x=\\dfrac{-b\\pm\\sqrt{b^2-4ac}}{2a}$。", hint: "先把 $a$ 提出來（或兩邊同除以 $a$），讓 $x^2$ 的係數變成 1。",
        idea: "$x^2+\\tfrac bax=-\\tfrac ca$，兩邊補上 $\\left(\\tfrac{b}{2a}\\right)^2$，得到 $\\left(x+\\tfrac{b}{2a}\\right)^2=\\tfrac{b^2-4ac}{4a^2}$，再開根號就完成了。判別式 $b^2-4ac$ 就是「補完之後的大正方形面積」乘上 $4a^2$，負的時候就拼不出來了。" },
      { q: "如果 $b$ 是負的，例如 $x^2-6x$，剪貼圖要怎麼畫？", hint: "這次不是「加一條長條」，而是從 $x\\times x$ 的正方形「剪掉」長條。",
        idea: "從正方形剪掉兩條 $3\\times x$，剩下 $(x-3)^2$，但右下角 $3\\times3$ 被剪了兩次，所以 $x^2-6x=(x-3)^2-9$。這和「乘法公式」單元的 $(a-b)^2$ 是同一張圖。" },
      { q: "二次函數 $y=x^2+bx+c$ 的頂點，隨著 $b$ 改變（$c$ 固定）會畫出什麼形狀的軌跡？", hint: "頂點是 $\\left(-\\tfrac b2,\\ c-\\tfrac{b^2}{4}\\right)$。令 $h=-\\tfrac b2$，把 $k$ 用 $h$ 表示。",
        idea: "$k=c-h^2$，頂點本身沿著一條開口向下的拋物線移動！可以在「換個角度看」的圖上拉 $b$ 驗證看看。" }
    ],

    where: {
      codes: [["F-10-1", "一次與二次函數：函數符號、圖形與平移、配方與二次函數、閉區間情境應用"]],
      exam: "高一共同必修，學測數 A、數 B 都在範圍內。配方是找頂點、求最大最小值、推公式解的共同工具，之後在數甲的二次曲線標準式裡還會再用到。",
      stop: "熟練配方找頂點與在閉區間求最值就好。含參數的二次函數在區間上的大量分類討論是舊課綱的技巧題，不必當成核心反覆練習。"
    }
  });
})();
