/* 單元 3：算幾不等式 */
(function () {
  var C = SK.C, s = SK.s;

  function hookVisual(el) {
    var svg = SK.svg(el, 440, 300, "周長都是 20 公尺的三種長方形圍籬");
    var u = 18, y0 = 40;
    var list = [[9, 1, C.pink], [7, 3, C.blue], [5, 5, C.green]];
    var x = 20;
    list.forEach(function (r, i) {
      var w = r[0] * u, h = r[1] * u, yy = y0 + (5 - r[1]) * u / 2 + 20;
      if (i === 0) { w = 9 * u; }
      s("rect", { x: x, y: yy, width: w, height: h, rx: 4, fill: r[2].f, stroke: r[2].s, "stroke-width": 2, filter: "url(#sk-soft)" }, svg);
      SK.label(svg, x + w / 2, yy + h + 18, r[0] + " × " + r[1], { size: 14 });
      SK.label(svg, x + w / 2, yy + h + 38, "面積 " + r[0] * r[1] + "？", { size: 13, color: C.soft });
      x += w + 22;
      if (i === 0) { x = 20; y0 = 130; }
    });
  }

  function squareHoleAngle(el) {
    var wrap = SK.h("div", { class: "two-col" });
    var st = SK.h("div", { class: "stage" }), side = SK.h("div", { class: "sliders" });
    wrap.appendChild(st); wrap.appendChild(side); el.appendChild(wrap);
    var svg = SK.svg(st, 380, 380, "四個 a 乘 b 長方形圍成大正方形，中間留一個洞");
    var g = s("g", {}, svg);
    var stt = { a: 6, b: 3 };
    function draw() {
      g.innerHTML = "";
      var a = Math.max(stt.a, stt.b), b = Math.min(stt.a, stt.b), u = 320 / (a + b), x0 = 30, y0 = 30;
      var R = [[0, 0, a, b], [a, 0, b, a], [b, a, a, b], [0, b, b, a]];
      R.forEach(function (r) {
        s("rect", { x: x0 + r[0] * u, y: y0 + r[1] * u, width: r[2] * u, height: r[3] * u, fill: C.blue.f, stroke: C.blue.s, "stroke-width": 2 }, g);
        SK.label(g, x0 + (r[0] + r[2] / 2) * u, y0 + (r[1] + r[3] / 2) * u, "ab", { it: true, size: 18, color: C.blue.s });
      });
      if (a > b) {
        s("rect", { x: x0 + b * u, y: y0 + b * u, width: (a - b) * u, height: (a - b) * u, fill: C.gold.f, stroke: C.gold.s, "stroke-width": 2, "stroke-dasharray": "6 4" }, g);
        if ((a - b) * u > 40) SK.label(g, x0 + (a + b) / 2 * u, y0 + (a + b) / 2 * u, "(a−b)²", { it: true, size: 15, color: C.gold.s });
      }
      side.querySelector(".readout").innerHTML =
        SK.tex("(a+b)^2=\\cb{4ab}+\\cy{(a-b)^2}\\ \\ge\\ \\cb{4ab}", true) +
        SK.tex(stt.a + "+" + stt.b + "=" + (stt.a + stt.b) + ",\\quad (" + (stt.a + stt.b) + ")^2=" + Math.pow(stt.a + stt.b, 2) + "\\ \\ge\\ 4\\times" + stt.a * stt.b + "=" + 4 * stt.a * stt.b, true);
    }
    side.appendChild(SK.slider({ label: "$a$", min: 1, max: 9, value: stt.a, onInput: function (v) { stt.a = v; draw(); } }).el);
    side.appendChild(SK.slider({ label: "$b$", min: 1, max: 9, value: stt.b, color: "blue", onInput: function (v) { stt.b = v; draw(); } }).el);
    side.insertAdjacentHTML("beforeend", '<div class="readout"></div>' +
      '<p class="muted" style="margin:0;font-size:.95rem">' + SK.md("四塊 $a\\times b$ 長方形像風車一樣圍成邊長 $a+b$ 的正方形，中間留下邊長 $a-b$ 的洞。洞的面積不會是負的，所以 $(a+b)^2\\ge4ab$，開根號再除以 2 就是算幾不等式。把 $a$、$b$ 拉成一樣，洞就消失了。") + "</p>");
    draw();
  }

  function fenceAngle(el) {
    var wrap = SK.h("div", { class: "two-col" });
    var st = SK.h("div", { class: "stage" }), side = SK.h("div", { class: "sliders" });
    wrap.appendChild(st); wrap.appendChild(side); el.appendChild(wrap);
    var svg = SK.svg(st, 420, 320, "周長 20 的長方形，面積隨邊長變化的圖");
    var g = s("g", {}, svg);
    var X = function (a) { return 50 + a * 34; }, Y = function (A) { return 280 - A * 9.5; };
    var stt = { a: 3 };
    function draw() {
      g.innerHTML = "";
      s("line", { x1: 50, y1: 280, x2: 400, y2: 280, class: "m-axis" }, g);
      s("line", { x1: 50, y1: 280, x2: 50, y2: 20, class: "m-axis" }, g);
      SK.label(g, 395, 298, "a", { it: true });
      SK.label(g, 30, 30, "面積", { size: 13 });
      var d = "";
      for (var t = 0; t <= 10.001; t += .1) d += (t ? "L" : "M") + X(t) + " " + Y(t * (10 - t)) + " ";
      s("path", { d: d, fill: "none", stroke: C.green.s, "stroke-width": 3 }, g);
      s("line", { x1: 50, y1: Y(25), x2: 400, y2: Y(25), stroke: C.gold.s, "stroke-dasharray": "6 5", "stroke-width": 1.5 }, g);
      SK.label(g, 380, Y(25) - 12, "25", { size: 13, color: C.gold.s });
      var a = stt.a, A = a * (10 - a);
      s("line", { x1: X(a), y1: 280, x2: X(a), y2: Y(A), stroke: C.orange.s, "stroke-dasharray": "4 4" }, g);
      s("circle", { cx: X(a), cy: Y(A), r: 7, fill: C.orange.s, stroke: "#fff", "stroke-width": 2 }, g);
      // 右上角的小長方形
      var u = 9, w = a * u, h = (10 - a) * u;
      s("rect", { x: 300 - w / 2, y: 60, width: w, height: h, fill: C.orange.f, stroke: C.orange.s, "stroke-width": 1.5 }, g);
      side.querySelector(".readout").innerHTML = SK.tex(SK.fmt(a, 1) + "\\times" + SK.fmt(10 - a, 1) + "=" + SK.fmt(A, 2) + "\\ \\le\\ 25", true);
    }
    side.appendChild(SK.slider({ label: "邊長 $a$", min: .5, max: 9.5, step: .1, value: stt.a, onInput: function (v) { stt.a = v; draw(); } }).el);
    side.insertAdjacentHTML("beforeend", '<div class="readout"></div><p class="muted" style="margin:0;font-size:.95rem">' +
      SK.md("周長 20，所以兩邊 $a+b=10$、算術平均是 5。算幾不等式說 $\\sqrt{ab}\\le5$，也就是面積 $ab\\le25$；只有正方形 $5\\times5$ 才碰得到。這條曲線也是一條拋物線，可以用「配方法與頂點式」單元的方法找到頂點。") + "</p>");
    draw();
  }

  SK.mountUnit({
    slug: "am-gm",
    en: "Inside a semicircle, the radius is always the tallest",
    formula: "\\frac{\\co{a}+\\cb{b}}{2}\\ \\ge\\ \\sqrt{\\co{a}\\cb{b}}\\qquad(a,b>0)",

    hook: {
      html: "你有 20 公尺長的圍籬，要圍出一塊長方形的菜園。長和寬可以自己決定。",
      ask: "怎麼圍，菜園的面積最大？先憑感覺猜，再想想看為什麼。",
      visual: hookVisual
    },

    guess: {
      q: "兩個正數 $a$、$b$，它們的算術平均 $\\dfrac{a+b}{2}$ 和幾何平均 $\\sqrt{ab}$，哪一個比較大？",
      options: [
        { t: "算術平均總是 $\\ge$ 幾何平均", truth: true, explain: "試試 $a=1,b=9$：算術平均 $5$，幾何平均 $\\sqrt9=3$。只有 $a=b$ 時兩者相等。等一下你會在半圓裡「看到」為什麼永遠如此。" },
        { t: "幾何平均總是 $\\ge$ 算術平均", explain: "「幾何」聽起來比較厲害，所以有人會覺得它比較大。但 $a=1,b=9$ 時，$\\sqrt{9}=3$ 比 $5$ 小。乘法讓兩個差很多的數互相「拉低」了。" },
        { t: "要看 $a$、$b$ 是多少", common: true, explain: "謹慎是好習慣！很多數學比較的確要看情況。不過這一題不管代什麼正數，算術平均都不會輸；最多只是在 $a=b$ 時打成平手。" },
        { t: "永遠一樣大", explain: "代 $a=b=4$ 會發現兩個都是 4，所以你可能剛好試了相等的例子！再試試 $a=2,b=8$：$5$ 對上 $4$。" }
      ]
    },

    derive: {
      intro: "把 $a$ 和 $b$ 接成一條線，畫一個半圓，兩種平均就會同時出現在圖上。拖動蜜桃色的點來改變 $a$ 和 $b$。",
      tall: true,
      frames: [
        { cap: "把長度 $\\co{a}$ 和 $\\cb{b}$ 接成一條線段，接點叫做 $P$。整條線段長 $a+b$。", tex: "\\overline{AP}=\\co{a},\\quad \\overline{PB}=\\cb{b}" },
        { cap: "以整條線段為直徑畫半圓。半徑就是直徑的一半：這正是<b>算術平均</b>。", tex: "\\text{半徑}=\\cg{\\frac{a+b}{2}}" },
        { cap: "從接點 $P$ 往上畫垂直線，碰到半圓的點叫 $Q$。這條高有多長？", tex: "\\overline{PQ}=\\cv{h}=\\;?" },
        { cap: "直徑所對的圓周角是直角，所以 $\\angle AQB=90^\\circ$。兩個小三角形 $\\triangle APQ$ 和 $\\triangle QPB$ 相似，對應邊成比例。", tex: "\\frac{\\co{a}}{\\cv{h}}=\\frac{\\cv{h}}{\\cb{b}}\\ \\Rightarrow\\ \\cv{h}^2=\\co{a}\\cb{b}\\ \\Rightarrow\\ \\cv{h}=\\sqrt{ab}" },
        { cap: "高 $h$ 是<b>幾何平均</b>。半圓裡最高的高就是半徑，所以 $h$ 永遠不會超過半徑。把 $P$ 拖到正中間，兩者才相等。", tex: "\\cg{\\frac{a+b}{2}}\\ \\ge\\ \\cv{\\sqrt{ab}},\\quad\\text{等號成立}\\iff a=b" }
      ],
      hint: "拖動直徑上的蜜桃色點 $P$；也可以用鍵盤方向鍵移動它。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 520, 360, "半圓中的算術平均與幾何平均");
        var g = s("g", {}, svg);
        var hg = s("g", {}, svg);
        var X0 = 60, X1 = 460, Y = 300, R = (X1 - X0) / 2, OX = (X0 + X1) / 2, total = 10;
        var st = { a: 3 };
        var read = SK.h("div", { class: "readout" });
        ctx.extra.appendChild(read);
        var hd = SK.handle(hg, 0, Y, C.orange.s, "接點 P，左右拖動改變 a 與 b");
        SK.drag(svg, hd, function (x) {
          st.a = SK.clamp((x - X0) / (X1 - X0) * total, .3, total - .3); draw();
        }, function () { return [X0 + st.a / total * (X1 - X0), Y]; }, 8);
        function draw() {
          var f = ctx.frame, a = st.a, b = total - a;
          var Px = X0 + a / total * (X1 - X0), h = Math.sqrt(R * R - (Px - OX) * (Px - OX)), Qy = Y - h;
          g.innerHTML = "";
          if (f >= 1) {
            s("path", { d: "M" + X0 + " " + Y + " A" + R + " " + R + " 0 0 1 " + X1 + " " + Y, fill: "rgba(241,226,184,.25)", stroke: C.line, "stroke-width": 2.2 }, g);
            s("line", { x1: OX, y1: Y, x2: OX, y2: Y - R, stroke: C.green.s, "stroke-width": 3.5, "stroke-linecap": "round", "stroke-dasharray": f >= 4 ? null : "2 7" }, g);
            SK.label(g, OX + (Px < OX ? 32 : -32), Y - R + 22, "(a+b)/2", { size: 14, color: C.green.s });
            s("circle", { cx: OX, cy: Y, r: 4, fill: C.green.s }, g);
            SK.label(g, OX, Y + 18, "O", { size: 13, color: C.soft });
          }
          if (f >= 3) {
            s("path", { d: "M" + X0 + " " + Y + " L" + Px + " " + Qy + " L" + X1 + " " + Y, fill: "none", stroke: C.soft, "stroke-width": 1.6, "stroke-dasharray": "5 4" }, g);
            var u1 = [(X0 - Px), (Y - Qy)], u2 = [(X1 - Px), (Y - Qy)];
            var l1 = Math.hypot(u1[0], u1[1]), l2 = Math.hypot(u2[0], u2[1]);
            SK.rightMark(g, Px, Qy, u1[0] / l1, u1[1] / l1, u2[0] / l2, u2[1] / l2, 13, C.pink.s);
            s("path", { d: "M" + X0 + " " + Y + " L" + Px + " " + Qy + " L" + Px + " " + Y + "Z", fill: C.orange.f, opacity: .5 }, g);
            s("path", { d: "M" + X1 + " " + Y + " L" + Px + " " + Qy + " L" + Px + " " + Y + "Z", fill: C.blue.f, opacity: .5 }, g);
          }
          // 直徑上的 a、b
          s("line", { x1: X0, y1: Y, x2: Px, y2: Y, stroke: C.orange.s, "stroke-width": 6, "stroke-linecap": "round" }, g);
          s("line", { x1: Px, y1: Y, x2: X1, y2: Y, stroke: C.blue.s, "stroke-width": 6, "stroke-linecap": "round" }, g);
          SK.label(g, (X0 + Px) / 2, Y + 26, "a = " + SK.fmt(a, 1), { size: 15, color: C.orange.s });
          SK.label(g, (Px + X1) / 2, Y + 26, "b = " + SK.fmt(b, 1), { size: 15, color: C.blue.s });
          SK.label(g, X0 - 14, Y, "A", { size: 13, color: C.soft });
          SK.label(g, X1 + 14, Y, "B", { size: 13, color: C.soft });
          if (f >= 2) {
            s("line", { x1: Px, y1: Y, x2: Px, y2: Qy, stroke: C.purple.s, "stroke-width": 4, "stroke-linecap": "round" }, g);
            s("circle", { cx: Px, cy: Qy, r: 5, fill: C.purple.s }, g);
            SK.label(g, Px + (Px < OX ? -18 : 18), Qy - 14, "Q", { size: 13, color: C.soft });
            SK.label(g, Px + (Px < OX ? -30 : 30), (Y + Qy) / 2, "h", { it: true, color: C.purple.s });
            SK.rightMark(g, Px, Y, Px < OX ? 1 : -1, 0, 0, -1, 10);
          }
          hd.moveTo(Px, Y);
          var am = (a + b) / 2, gm = Math.sqrt(a * b);
          read.innerHTML = SK.tex("\\cg{\\tfrac{a+b}{2}=" + SK.fmt(am, 2) + "}\\quad\\ge\\quad\\cv{\\sqrt{ab}=" + SK.fmt(gm, 2) + "}", true);
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "四塊長方形圍出一個洞", icon: "sparkle", render: squareHoleAngle },
      { title: "回到圍籬：面積曲線", icon: "bulb", render: fenceAngle }
    ],

    challenges: [
      { q: "開頭的圍籬題：周長 20 公尺，面積最大是多少？用算幾不等式寫出理由。", hint: "長 $a$、寬 $b$，$a+b=10$。",
        idea: "$\\sqrt{ab}\\le\\dfrac{a+b}{2}=5$，所以 $ab\\le25$，在 $a=b=5$ 時達到。答案是正方形。" },
      { q: "如果菜園一邊靠著牆，只需要圍三邊（兩條寬 $x$、一條長 $y$），圍籬一樣 20 公尺。現在最大面積是多少？", hint: "$2x+y=20$。試著把 $2x$ 和 $y$ 當成算幾不等式的兩個數。",
        idea: "$xy=\\tfrac12(2x)(y)\\le\\tfrac12\\left(\\tfrac{2x+y}{2}\\right)^2=50$，在 $2x=y=10$ 時達到，也就是 $5\\times10$。靠牆時最佳形狀不再是正方形，這很值得討論為什麼。" },
      { q: "同一張半圓圖裡還藏著第三種平均：調和平均 $\\dfrac{2ab}{a+b}$。你找得到它嗎？", hint: "從 $P$ 往半徑 $OQ$ 畫一條垂線，垂足叫 $F$。量量看 $QF$ 有多長。",
        idea: "在直角三角形 $OPQ$ 中，$QF=\\dfrac{h^2}{OQ}=\\dfrac{ab}{(a+b)/2}=\\dfrac{2ab}{a+b}$。因為 $QF$ 是 $\\triangle PFQ$ 的一股、比斜邊 $h$ 短，所以幾何平均 $\\ge$ 調和平均。一張圖就排出了三種平均的大小順序。" }
    ],

    where: {
      codes: [["N-10-3", "指數：幾何平均數與算幾不等式、非負實數的次方"]],
      exam: "高一共同必修，學測數 A、數 B 都在範圍內。常出現在「和固定求積最大」「積固定求和最小」的情境裡。",
      stop: "以<b>兩個正數</b>的算幾不等式為主。$n$ 個數的算幾、柯西不等式的各種變形（柯西在數 A `G-11A-6` 會正式出現）與競賽式的最值技巧，都不是高一的核心。"
    }
  });
})();
