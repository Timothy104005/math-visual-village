/* 單元：導數 */
(function () {
  var C = SK.C, s = SK.s;
  function f(x) { return x * x / 2; }

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 240, "汽車儀表板上的時速表");
    var cx = 200, cy = 170, R = 110;
    s("path", { d: SK.arcPath(cx, cy, R, Math.PI, 0), fill: "rgba(241,226,184,.35)", stroke: C.cocoa, "stroke-width": 1.6 }, svg);
    for (var k = 0; k <= 10; k++) {
      var a = Math.PI - k * Math.PI / 10;
      s("line", { x1: cx + (R - 12) * Math.cos(a), y1: cy - (R - 12) * Math.sin(a), x2: cx + R * Math.cos(a), y2: cy - R * Math.sin(a), stroke: C.cocoa, "stroke-width": 1.2 }, svg);
      if (k % 2 === 0) SK.label(svg, cx + (R - 28) * Math.cos(a), cy - (R - 28) * Math.sin(a), String(k * 12), { size: 11, color: C.soft });
    }
    var na = Math.PI - .62 * Math.PI;
    s("line", { x1: cx, y1: cy, x2: cx + (R - 20) * Math.cos(na), y2: cy - (R - 20) * Math.sin(na), stroke: C.orange.s, "stroke-width": 3, "stroke-linecap": "round" }, svg);
    s("circle", { cx: cx, cy: cy, r: 6, fill: C.orange.f, stroke: C.cocoa, "stroke-width": 1.2 }, svg);
    SK.label(svg, cx, cy + 26, "此刻的速度 = ?", { size: 14 });
    SK.label(svg, cx, cy + 50, "一瞬間沒有時間經過，要怎麼算？", { size: 12, color: C.soft });
  }

  function newtonAngle(el) {
    var wrap = SK.h("div", { class: "two-col" });
    var st = SK.h("div", { class: "stage" }), side = SK.h("div", {});
    wrap.appendChild(st); wrap.appendChild(side); el.appendChild(wrap);
    var svg = SK.svg(st, 420, 300, "用切線逼近 x 平方減 2 的根");
    var g = s("g", {}, svg);
    var X = function (x) { return 40 + x * 150; }, Y = function (y) { return 200 - y * 40; };
    var xs = [2];
    function draw() {
      g.innerHTML = "";
      s("line", { x1: 20, y1: Y(0), x2: 410, y2: Y(0), class: "m-axis" }, g);
      var d = "";
      for (var x = 0; x <= 2.5; x += .02) d += (x ? "L" : "M") + X(x) + " " + SK.clamp(Y(x * x - 2), 5, 295);
      s("path", { d: d, fill: "none", stroke: C.ink, "stroke-width": 2.4 }, g);
      xs.forEach(function (x0, i) {
        if (i === xs.length - 1) return;
        var y0 = x0 * x0 - 2, x1 = xs[i + 1];
        s("line", { x1: X(x0), y1: Y(0), x2: X(x0), y2: Y(y0), stroke: C.line, "stroke-dasharray": "3 4" }, g);
        s("line", { x1: X(x0), y1: Y(y0), x2: X(x1), y2: Y(0), stroke: C.orange.s, "stroke-width": 1.8 }, g);
      });
      xs.forEach(function (x0, i) { s("circle", { cx: X(x0), cy: Y(0), r: 4.5, fill: i === xs.length - 1 ? C.orange.s : C.orange.f, stroke: C.cocoa, "stroke-width": 1 }, g); });
      s("line", { x1: X(Math.SQRT2), y1: Y(0) - 8, x2: X(Math.SQRT2), y2: Y(0) + 8, stroke: C.green.s, "stroke-width": 2 }, g);
      SK.label(g, X(Math.SQRT2), Y(0) + 22, "√2", { size: 13, color: C.green.s });
      out.innerHTML = xs.map(function (x, i) { return "x" + i + " = " + x.toFixed(10); }).join("<br>");
    }
    var out = SK.h("div", { class: "readout", style: "font-family:ui-monospace,Consolas,monospace;font-size:.85rem" });
    side.innerHTML = '<p style="margin-top:0">' + SK.md("求 $x^2-2=0$ 的正根：從 $x_0=2$ 出發，在曲線上的那一點畫切線，切線碰到 $x$ 軸的地方就是下一個更好的估計。<b>牛頓法</b>就是「用切線當成曲線」反覆逼近。") + "</p>";
    var b1 = SK.h("button", { class: "btn small", type: "button" }, "再畫一條切線"), b2 = SK.h("button", { class: "btn small ghost", type: "button" }, "重來");
    b1.onclick = function () { var x = xs[xs.length - 1]; if (xs.length < 6) xs.push(x - (x * x - 2) / (2 * x)); draw(); };
    b2.onclick = function () { xs = [2]; draw(); };
    var c = SK.h("div", { class: "controls", style: "margin-bottom:10px" }); c.appendChild(b1); c.appendChild(b2);
    side.appendChild(c); side.appendChild(out);
    side.insertAdjacentHTML("beforeend", '<p class="muted" style="font-size:.92rem">' + SK.md("每一步 $x_{n+1}=x_n-\\dfrac{f(x_n)}{f'(x_n)}$。只要三、四步，就和 $\\sqrt2=1.41421356\\ldots$ 一致到小數點後很多位。") + "</p>");
    draw();
  }

  SK.mountUnit({
    slug: "derivative",
    en: "The secant becomes the tangent",
    formula: "f'(a)=\\lim_{\\cb{h}\\to0}\\frac{f(a+\\cb{h})-f(a)}{\\cb{h}}=\\text{切線斜率}",

    hook: {
      html: "汽車的時速表顯示「此刻」的速度。可是速度是「距離 ÷ 時間」，而「此刻」是一瞬間，沒有時間經過。",
      ask: "那時速表上的數字，到底是怎麼定義出來的？",
      visual: hookVisual
    },

    guess: {
      q: "在曲線上取兩點畫一條割線，讓第二點沿著曲線越來越靠近第一點。割線最後會變成什麼？",
      options: [
        { t: "那一點的切線", truth: true, explain: "兩點越靠越近，割線的斜率越來越接近一個固定的數，那條極限位置的直線就是切線。「一瞬間的速度」就是用同樣的方法定義的。" },
        { t: "什麼都沒有，兩點重合就畫不出直線了", common: true, explain: "非常敏銳的觀察！兩點真的重合時，確實畫不出唯一的直線，斜率會變成 $\\frac00$。所以我們不讓它們重合，只看「越來越接近」時斜率的趨勢，也就是取極限。" },
        { t: "越來越陡，最後變成鉛直線", explain: "有些曲線在特殊點上會這樣，但一般的平滑曲線不會。割線的斜率會穩定在一個有限的數。" },
        { t: "一定是水平線", explain: "只有在曲線的「山頂」或「谷底」切線才是水平的。其他地方的切線都有斜率。" }
      ]
    },

    derive: {
      intro: "以 $f(x)=\\tfrac12x^2$ 為例。拖動曲線上的點 $P$ 改變 $a$，用滑桿改變 $h$。",
      tall: true,
      frames: [
        { cap: "曲線 $y=f(x)$ 上的一點 $P(a,f(a))$。我們想知道「曲線在 $P$ 有多陡」。", tex: "P=(a,\\ f(a))" },
        { cap: "再取一點 $Q(a+h,\\ f(a+h))$。割線 $PQ$ 的斜率是<b>平均變化率</b>：高度差除以水平差。", tex: "\\text{割線斜率}=\\frac{f(a+\\cb{h})-f(a)}{\\cb{h}}" },
        { cap: "讓 $h$ 越來越小（按「讓 h 變小」）：$Q$ 沿著曲線滑向 $P$，割線跟著轉。", tex: "\\cb{h}\\to0" },
        { cap: "割線斜率的極限就是切線斜率，叫做 $f$ 在 $a$ 的<b>導數</b>。以 $f(x)=\\frac12x^2$ 為例，算出來剛好是 $a$。", tex: "\\begin{aligned}\\frac{\\frac12(a+h)^2-\\frac12a^2}{h}&=a+\\frac h2\\\\&\\xrightarrow{h\\to0}\\ \\co{a}=f'(a)\\end{aligned}" },
        { cap: "切線是曲線在 $P$ 附近的「最佳直線」：用它來估計附近的值，誤差比 $h$ 還小得多。這叫<b>一次估計</b>。", tex: "f(a+h)\\approx f(a)+f'(a)\\,h" },
        { cap: "把 $P$ 從左拖到右，記下每個位置的切線斜率，就畫出一個新的函數：<b>導函數</b> $f'(x)=x$（灰藍虛線）。", tex: "f'(x)=x" }
      ],
      hint: "拖動曲線上的蜜桃色點 P；用滑桿或按鈕改變 h。",
      setup: function (ctx) {
        var W = 520, H = 440, svg = SK.svg(ctx.stage, W, H, "割線逼近切線");
        var g = s("g", {}, svg), hg = s("g", {}, svg);
        var st = { a: 1, h: 1.6 }, anim = null;
        var X = function (x) { return 260 + x * 80; }, Y = function (y) { return 330 - y * 55; };
        var read = SK.h("div", { class: "readout" });
        var slH = SK.slider({ label: "$h$", min: .01, max: 2, step: .01, value: st.h, color: "blue", onInput: function (v) { st.h = v; draw(); } });
        var btn = SK.h("button", { class: "btn small", type: "button" }, "讓 h 變小");
        btn.onclick = function () {
          if (anim) clearInterval(anim);
          anim = setInterval(function () { st.h = Math.max(.01, st.h * .85); slH.set(Math.round(st.h * 100) / 100, true); draw(); if (st.h <= .011) { clearInterval(anim); anim = null; } }, 90);
        };
        ctx.sliders.appendChild(slH.el); ctx.sliders.appendChild(btn); ctx.extra.appendChild(read);
        var hd = SK.handle(hg, 0, 0, C.orange.s, "點 P");
        SK.drag(svg, hd, function (x) { st.a = Math.round(SK.clamp((x - 260) / 80, -2.8, 2.6) * 20) / 20; draw(); }, function () { return [X(st.a), Y(f(st.a))]; }, 8);
        var trail = [];
        function draw() {
          var fr = ctx.frame, a = st.a, h = st.h, P = [X(a), Y(f(a))], Q = [X(a + h), Y(f(a + h))];
          g.innerHTML = "";
          for (var i = -3; i <= 3; i++) { s("line", { x1: X(i), y1: 10, x2: X(i), y2: 430, class: "m-grid" }, g); SK.label(g, X(i), Y(0) + 16, String(i), { size: 11, color: C.soft }); }
          s("line", { x1: 10, y1: Y(0), x2: 510, y2: Y(0), class: "m-axis" }, g);
          s("line", { x1: X(0), y1: 10, x2: X(0), y2: 430, class: "m-axis" }, g);
          if (fr >= 5) {
            if (!trail.some(function (t) { return Math.abs(t - a) < 1e-9; })) trail.push(a);
            s("path", { d: "M" + X(-3) + " " + Y(-3) + " L" + X(3) + " " + Y(3), stroke: C.blue.s, "stroke-width": 1.6, "stroke-dasharray": "6 5", fill: "none" }, g);
            trail.forEach(function (t) { s("circle", { cx: X(t), cy: Y(t), r: 4, fill: C.blue.f, stroke: C.blue.s }, g); });
            SK.label(g, X(2.9), Y(2.9) + 18, "y = f′(x)", { size: 13, anchor: "end", color: C.blue.s });
          }
          var d = "";
          for (var x = -3.2; x <= 3.2; x += .04) d += (d ? "L" : "M") + X(x) + " " + Y(f(x));
          s("path", { d: d, fill: "none", stroke: C.ink, "stroke-width": 2.6 }, g);
          function line(m, x0, y0, col, w, dash) {
            s("line", { x1: X(x0 - 4), y1: Y(y0 - 4 * m), x2: X(x0 + 4), y2: Y(y0 + 4 * m), stroke: col, "stroke-width": w, "stroke-dasharray": dash || null }, g);
          }
          if (fr >= 1 && fr <= 3) {
            var m = (f(a + h) - f(a)) / h;
            line(m, a, f(a), C.orange.s, 2);
            s("line", { x1: P[0], y1: P[1], x2: Q[0], y2: P[1], stroke: C.blue.s, "stroke-width": 1.6, "stroke-dasharray": "4 4" }, g);
            s("line", { x1: Q[0], y1: P[1], x2: Q[0], y2: Q[1], stroke: C.green.s, "stroke-width": 1.6, "stroke-dasharray": "4 4" }, g);
            s("circle", { cx: Q[0], cy: Q[1], r: 5, fill: C.blue.f, stroke: C.cocoa, "stroke-width": 1.2 }, g);
            SK.label(g, Q[0] + 10, Q[1] - 10, "Q", { size: 13, anchor: "start", color: C.soft });
          }
          if (fr >= 3) line(a, a, f(a), C.green.s, fr === 3 ? 1.6 : 2.4, fr === 3 ? "6 5" : null);
          if (fr === 4) {
            var hh = 1.2;
            s("line", { x1: X(a + hh), y1: Y(f(a + hh)), x2: X(a + hh), y2: Y(f(a) + a * hh), stroke: C.pink.s, "stroke-width": 3 }, g);
            SK.label(g, X(a + hh) + 8, (Y(f(a + hh)) + Y(f(a) + a * hh)) / 2, "誤差 = h²/2", { size: 12, anchor: "start", color: C.pink.s });
          }
          SK.label(g, P[0] - 10, P[1] - 14, "P", { size: 13, anchor: "end", color: C.soft });
          hd.moveTo(P[0], P[1]);
          slH.el.style.display = btn.style.display = fr >= 1 && fr <= 3 ? "" : "none";
          var ms = (f(a + h) - f(a)) / h;
          read.innerHTML = fr >= 1 && fr <= 3 ? SK.tex("a=" + SK.fmt(a, 2) + ",\\ h=" + SK.fmt(h, 2) + ":\\quad \\frac{f(a+h)-f(a)}{h}=" + SK.fmt(ms, 4) + "\\ \\to\\ " + SK.fmt(a, 2), true)
            : SK.tex("f'(" + SK.fmt(a, 2) + ")=" + SK.fmt(a, 2), true);
        }
        return { show: function (i) { if (anim) { clearInterval(anim); anim = null; } if (i !== 5) trail = []; draw(); } };
      }
    },

    angles: [
      { title: "牛頓法：用切線找根", icon: "sparkle", render: newtonAngle },
      { title: "位置、速度、加速度", icon: "leaf",
        html: "物體自由落下 $t$ 秒走了約 $s(t)=4.9t^2$ 公尺。從 $t=2$ 到 $t=2+h$ 的平均速度是 $\\dfrac{4.9(2+h)^2-4.9\\cdot4}{h}=19.6+4.9h$。$h=0.1$ 時是 $20.09$，$h=0.001$ 時是 $19.6049$，越來越接近 $19.6$：這就是 $t=2$ 秒的瞬時速度 $s'(2)$。再對速度微分一次，得到加速度 $9.8$，正是重力加速度。" }
    ],

    challenges: [
      { q: "用定義證明 $(x^3)'=3x^2$。", hint: "$(x+h)^3=x^3+3x^2h+3xh^2+h^3$。",
        idea: "$\\dfrac{(x+h)^3-x^3}{h}=3x^2+3xh+h^2\\ \\to\\ 3x^2$。乘法公式的立方體（第一個單元）在這裡派上用場：多出來的那幾塊積木，只有 $3x^2h$ 那三塊厚板在 $h\\to0$ 時留下來。" },
      { q: "$f(x)=|x|$ 在 $x=0$ 有沒有導數？在圖上看看會發生什麼。", hint: "從右邊逼近（$h>0$）和從左邊逼近（$h<0$），割線斜率分別是多少？",
        idea: "右邊是 $1$、左邊是 $-1$，兩邊不一致，所以 $x=0$ 沒有導數。圖上是一個尖角，放大多少倍都不會變成一條直線。" },
      { q: "用牛頓法從 $x_0=1$ 開始求 $\\sqrt2$，前兩步是多少？", idea: "$x_1=1-\\dfrac{1-2}{2}=1.5$，$x_2=1.5-\\dfrac{0.25}{3}\\approx1.4167$。已經和 $\\sqrt2\\approx1.4142$ 很接近了。" }
    ],

    where: {
      codes: [["F-12甲-3", "微分：導數與導函數的極限定義、割線與切線、變化率、多項式的導數"], ["F-12甲-4", "導函數：乘法律、連鎖律、單調與凹凸、一次估計、泰勒展開"], ["N-12甲-1", "牛頓求根法、以勘根定理選初始值"]],
      exam: "12 年級<b>選修數學甲</b>，只在分科測驗數甲的範圍內，學測不考。它和「微積分基本定理」連成一條故事線：導數描述瞬間的變化，積分把變化累積起來。",
      stop: "操作以多項式為主，連鎖律以 $(x-a)^n$ 為主。$\\sin x$、$\\cos x$、$2^x$ 的導數只作 `※` 示例；牛頓法不研究收斂速度與誤差分析。"
    }
  });
})();
