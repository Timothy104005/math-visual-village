/* 單元：絕對值 */
(function () {
  var C = SK.C, s = SK.s;

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 200, "數線上離 3 不超過 2 的點");
    var X = function (t) { return 40 + (t + 1) * 40; };
    s("line", { x1: 20, y1: 120, x2: 385, y2: 120, class: "m-axis" }, svg);
    for (var t = -1; t <= 7; t++) {
      s("line", { x1: X(t), y1: 114, x2: X(t), y2: 126, stroke: C.cocoa }, svg);
      SK.label(svg, X(t), 144, String(t), { size: 13, color: C.soft });
    }
    s("rect", { x: X(1), y: 108, width: X(5) - X(1), height: 24, fill: C.blue.f, stroke: C.blue.s }, svg);
    s("circle", { cx: X(3), cy: 120, r: 6, fill: C.orange.s }, svg);
    SK.label(svg, X(3), 86, "家", { size: 16, color: C.orange.s });
    SK.brace(svg, X(3), 100, X(5), 100, 12, C.blue.s);
    SK.label(svg, X(4), 70, "走 2 步以內", { size: 13, color: C.blue.s });
    SK.label(svg, 200, 182, "這一段要怎麼用一個式子寫出來？", { size: 13, color: C.soft });
  }

  SK.mountUnit({
    slug: "abs-value",
    en: "Absolute value is distance",
    formula: "|x-\\co{a}|=\\text{數線上 } x \\text{ 到 }\\co{a}\\text{ 的距離}",

    hook: {
      html: "$|x|$ 常被說成「把負號拿掉」。但它真正的意思更有用：$|x|$ 是 $x$ 到 $0$ 的<b>距離</b>，$|x-a|$ 是 $x$ 到 $a$ 的距離。",
      ask: "「離家不超過 2 步」和「離家超過 2 步」各是數線上的哪些點？",
      visual: hookVisual
    },

    guess: {
      q: "$|x-3|<2$ 的解是什麼？",
      options: [
        { t: "$1<x<5$", truth: true, explain: "到 3 的距離小於 2，就是從 3 往左、往右各走不到 2 步：$3-2<x<3+2$。" },
        { t: "$x<5$", common: true, explain: "把絕對值直接拿掉得到 $x-3<2$，這是很自然的第一步！但絕對值同時管兩邊：$x=-10$ 也滿足 $x<5$，可是它離 3 有 13 步遠。" },
        { t: "$x<-1$ 或 $x>5$", explain: "這是「距離大於 2」的解（還差一點點：應該是 $x<1$ 或 $x>5$）。小於是中間一段，大於是兩邊往外。" },
        { t: "$-5<x<5$", explain: "這是 $|x|<5$ 的解，以 0 為中心。$|x-3|$ 的中心在 3。" }
      ]
    },

    derive: {
      intro: "拖動滑桿改中心 $a$、距離 $b$，或直接拖動數線上的點 $x$。",
      frames: [
        { cap: "$|x|$ 是 $x$ 到 $0$ 的距離，所以 $|3|=|-3|=3$。代數上：$x\\ge0$ 時 $|x|=x$；$x<0$ 時 $|x|=-x$（負數變正）。", tex: "|x|=\\begin{cases}x,&x\\ge0\\\\-x,&x<0\\end{cases}" },
        { cap: "兩數相減就是往前或往後走了幾步：$|x-a|$ 是 $x$ 和 $a$ 之間的距離，方向不重要。", tex: "|x-\\co a|=|\\co a-x|=\\text{距離}" },
        { cap: "$|x-a|<b$：離 $a$ 不到 $b$ 步，是以 $a$ 為中心、左右各 $b$ 的一段。", tex: "|x-\\co a|<\\cb b\\iff \\co a-\\cb b<x<\\co a+\\cb b" },
        { cap: "$|x-a|>b$：離 $a$ 超過 $b$ 步，是往兩邊跑出去的兩條射線。", tex: "|x-\\co a|>\\cb b\\iff x<\\co a-\\cb b\\ \\text{或}\\ x>\\co a+\\cb b" },
        { cap: "方程式 $|x-a|=b$（$b>0$）只剩兩個端點。解可以用區間寫：$(a-b,a+b)$ 表示不含端點，$[a-b,a+b]$ 表示含端點。", tex: "|x-\\co a|=\\cb b\\iff x=\\co a\\pm\\cb b" }
      ],
      hint: "拖動數線上的蜜桃色點 x，看它什麼時候落在灰藍色範圍裡。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 540, 440, "絕對值的 V 形圖與數線上的解");
        var g = s("g", {}, svg), hg = s("g", {}, svg);
        var st = { a: 3, b: 2, x: 4.2 }, NY = 360;
        var X = function (t) { return 30 + (t + 5) * 32; }, T = function (px) { return (px - 30) / 32 - 5; }, Y = function (v) { return NY - v * 32; };
        var read = SK.h("div", { class: "readout" });
        ctx.sliders.appendChild(SK.slider({ label: "中心 $a$", min: -3, max: 6, step: .5, value: 3, onInput: function (v) { st.a = v; draw(); } }).el);
        ctx.sliders.appendChild(SK.slider({ label: "距離 $b$", min: .5, max: 5, step: .5, value: 2, color: "blue", onInput: function (v) { st.b = v; draw(); } }).el);
        ctx.extra.appendChild(read);
        var hx = SK.handle(hg, 0, NY, C.orange.s, "點 x");
        SK.drag(svg, hx, function (px) { st.x = Math.round(SK.clamp(T(px), -5, 10) * 10) / 10; draw(); }, function () { return [X(st.x), NY]; }, 16);
        function draw() {
          var f = ctx.frame, a = f === 0 ? 0 : st.a, b = st.b, x = st.x, d = Math.abs(x - a);
          g.innerHTML = "";
          // 上半部：y = |x − a| 的 V 形圖，高度就是距離
          for (var v = 1; v <= 8; v++) s("line", { x1: 15, y1: Y(v), x2: 525, y2: Y(v), class: "m-grid" }, g);
          s("path", { d: "M" + X(-5) + " " + Y(Math.min(9, a + 5)) + " L" + X(a) + " " + NY + " L" + X(10) + " " + Y(Math.min(9, 10 - a)), fill: "none", stroke: C.purple.s, "stroke-width": 2.6 }, g);
          SK.label(g, X(a) + (a < 3 ? 140 : -140), 40, f === 0 ? "y = |x|" : "y = |x − a|", { size: 15, color: C.purple.s });
          if (f >= 2) {
            s("line", { x1: 15, y1: Y(b), x2: 525, y2: Y(b), stroke: C.blue.s, "stroke-width": 1.8, "stroke-dasharray": "6 5" }, g);
            SK.label(g, 510, Y(b) - 12, "y = b", { size: 13, color: C.blue.s, anchor: "end" });
            [a - b, a + b].forEach(function (e) { s("line", { x1: X(e), y1: Y(b), x2: X(e), y2: NY, stroke: C.blue.s, "stroke-dasharray": "2 4" }, g); });
          }
          s("line", { x1: X(x), y1: NY, x2: X(x), y2: Y(d), stroke: C.orange.s, "stroke-width": 3 }, g);
          s("circle", { cx: X(x), cy: Y(d), r: 5, fill: C.orange.s }, g);
          SK.label(g, X(x) + 10, (NY + Y(d)) / 2, "高 = 距離 " + SK.fmt(d, 1), { size: 13, color: C.orange.s, anchor: "start" });
          // 下半部：數線與解集合
          s("line", { x1: 15, y1: NY, x2: 525, y2: NY, class: "m-axis" }, g);
          for (var t = -5; t <= 10; t++) {
            s("line", { x1: X(t), y1: NY - 6, x2: X(t), y2: NY + 6, stroke: C.cocoa }, g);
            SK.label(g, X(t), NY + 24, String(t), { size: 12, color: C.soft });
          }
          if (f === 2 || f === 4) s("rect", { x: X(a - b), y: NY - 12, width: X(a + b) - X(a - b), height: 24, fill: f === 2 ? C.blue.f : "none", stroke: C.blue.s, "stroke-dasharray": f === 4 ? "4 4" : null }, g);
          if (f === 3) {
            s("rect", { x: 15, y: NY - 12, width: Math.max(0, X(a - b) - 15), height: 24, fill: C.blue.f }, g);
            s("rect", { x: X(a + b), y: NY - 12, width: Math.max(0, 525 - X(a + b)), height: 24, fill: C.blue.f }, g);
          }
          if (f >= 2) [a - b, a + b].forEach(function (e) {
            s("circle", { cx: X(e), cy: NY, r: 6, fill: f === 4 ? C.blue.s : C.paper, stroke: C.blue.s, "stroke-width": 2 }, g);
          });
          s("rect", { x: X(a) - 5, y: NY - 5, width: 10, height: 10, fill: C.cocoa }, g);
          SK.label(g, X(a), NY + 48, f === 0 ? "0" : "a", { it: f !== 0, size: 16 });
          if (f >= 2) SK.label(g, 270, 425, f === 3 ? "V 形圖高過虛線的部分 → 兩條射線" : f === 4 ? "V 形圖碰到虛線 → 兩個點" : "V 形圖低於虛線的部分 → 中間一段", { size: 13, color: C.blue.s });
          hx.moveTo(X(x), NY);
          var inside = f === 3 ? d > b : f === 4 ? Math.abs(d - b) < 1e-9 : d < b;
          var lhs = f === 0 ? "|" + SK.fmt(x, 1) + "|" : "|" + SK.fmt(x, 1) + (a < 0 ? "+" + SK.fmt(-a, 1) : "-" + SK.fmt(a, 1)) + "|";
          var sol = f === 3 ? "x<" + SK.fmt(a - b, 1) + "\\ \\text{或}\\ x>" + SK.fmt(a + b, 1) : f === 4 ? "x=" + SK.fmt(a - b, 1) + "\\ \\text{或}\\ " + SK.fmt(a + b, 1) : SK.fmt(a - b, 1) + "<x<" + SK.fmt(a + b, 1);
          read.innerHTML = SK.tex(lhs.replace(/−/g, "-") + "=" + SK.fmt(d, 1).replace("−", "-"), true) +
            (f >= 2 ? SK.tex("\\text{解：}" + sol.replace(/−/g, "-"), true) + '<p class="muted" style="margin:4px 0 0;font-size:.9rem">目前的 x ' + (inside ? "✓ 是解" : "✗ 不是解") + "</p>" : "");
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "兩個絕對值：距離和", icon: "sparkle",
        html: "$|x-1|+|x-5|$ 是 $x$ 到 1 和到 5 的距離和。站在 1 和 5 之間，不管站哪裡，距離和都剛好是 4；一走出去就變大。所以最小值是 4，發生在 $1\\le x\\le5$。用圖想，完全不用分段討論。" },
      { title: "為什麼 $\\sqrt{x^2}=|x|$", icon: "leaf",
        html: "$\\sqrt{\\ }$ 規定取非負的那個根，所以 $\\sqrt{(-3)^2}=\\sqrt9=3$，不是 $-3$。平面上兩點距離 $\\sqrt{(x_2-x_1)^2}$ 在一維時也就退化成 $|x_2-x_1|$：絕對值就是一維的距離公式。" }
    ],

    challenges: [
      { q: "解 $|2x-1|\\le5$。", hint: "先把 2 提出來：$|2x-1|=2\\left|x-\\tfrac12\\right|$。", idea: "$\\left|x-\\tfrac12\\right|\\le\\tfrac52$，所以 $-2\\le x\\le3$。" },
      { q: "解 $|x-2|>|x+4|$。", hint: "到 2 的距離大於到 $-4$ 的距離，代表 $x$ 比較靠近誰？",
        idea: "$x$ 比較靠近 $-4$，也就是在兩點的中點 $-1$ 的左邊：$x<-1$。" },
      { q: "$|x-1|+|x-5|=6$ 的解是什麼？$=3$ 呢？", idea: "距離和 6 比兩點間的 4 多 2，要往外各多走 1：$x=0$ 或 $x=6$。距離和 3 比最小值 4 還小，無解。" }
    ],

    where: {
      codes: [["N-10-2", "絕對值：絕對值的意義、一次絕對值方程式與不等式，以 $|x-a|<b$、$|x-a|>b$ 為原則"]],
      exam: "10 年級<b>共同必修</b>，學測數 A、數 B 都在範圍內。",
      stop: "以一次式為原則。區間符號只用來表達解，不做區間的集合運算；多重絕對值的複雜分段題不是重點。"
    }
  });
})();
