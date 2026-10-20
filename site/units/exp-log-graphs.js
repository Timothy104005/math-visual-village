/* 單元：指數與對數函數 */
(function () {
  var C = SK.C, s = SK.s;

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 250, "摺紙厚度與層數");
    var X = function (n) { return 40 + n * 36; };
    for (var n = 0; n <= 8; n++) {
      var h = Math.pow(2, n) * .7;
      s("rect", { x: X(n) - 12, y: 210 - Math.min(h, 190), width: 24, height: Math.min(h, 190), fill: n % 2 ? C.orange.f : C.gold.f, stroke: C.cocoa, "stroke-width": .8 }, svg);
      SK.label(svg, X(n), 226, String(n), { size: 11, color: C.soft });
    }
    SK.label(svg, 200, 20, "每摺一次，厚度變兩倍", { size: 13, color: C.pink.s });
    SK.label(svg, 200, 244, "摺的次數", { size: 11, color: C.soft });
  }

  SK.mountUnit({
    slug: "exp-log-graphs",
    en: "Two curves mirrored across y = x",
    formula: "y=\\co{a^x}\\quad\\overset{y=x}{\\longleftrightarrow}\\quad y=\\cb{\\log_a x}\\qquad(a>0,\\ a\\ne1)",

    hook: {
      html: "一張 0.1 公釐的紙，每對摺一次厚度就變兩倍。摺 42 次，理論上的厚度會超過地球到月球的距離。",
      ask: "這種「每一步乘同一個倍數」的成長，圖形長什麼樣？要知道摺幾次才能超過某個厚度，又要用什麼函數？",
      visual: hookVisual
    },

    guess: {
      q: "$y=2^x$ 和 $y=\\log_2x$ 的圖形有什麼關係？",
      options: [
        { t: "對直線 $y=x$ 對稱", truth: true, explain: "$(3,8)$ 在 $y=2^x$ 上，代表 $2^3=8$，也就是 $\\log_28=3$：$(8,3)$ 在 $y=\\log_2x$ 上。每一點的坐標都互換，所以兩條曲線對 $y=x$ 對稱。" },
        { t: "對 $x$ 軸對稱", common: true, explain: "兩條曲線一條在上、一條偏下，看起來像上下翻！但對 $x$ 軸翻會得到 $y=-2^x$，它整條都在 $x$ 軸下方。" },
        { t: "對 $y$ 軸對稱", explain: "對 $y$ 軸翻會得到 $y=2^{-x}=(\\tfrac12)^x$，一條遞減的指數曲線。" },
        { t: "沒有特別關係", explain: "它們互為<b>反函數</b>：一個問「2 的 $x$ 次方是多少」，另一個問「2 的幾次方是 $x$」。" }
      ]
    },

    derive: {
      intro: "拖動滑桿改底數 $a$，看兩條曲線一起變化。",
      tall: true,
      frames: [
        { cap: "$y=a^x$：$a>1$ 時遞增，越來越陡；$0<a<1$ 時遞減。不管 $a$ 是多少，都經過 $(0,1)$，而且永遠在 $x$ 軸上方。", tex: "y=a^x,\\ \\ a^0=1,\\ \\ a^x>0" },
        { cap: "把每一點的坐標互換，就得到 $y=\\log_ax$：它是 $a^x$ 的<b>反函數</b>，圖形對 $y=x$ 對稱。經過 $(1,0)$，只有 $x>0$ 才有定義。", tex: "q=a^p\\iff p=\\log_aq" },
        { cap: "<b>比例成長</b>：$x$ 每增加 1，$y$ 就乘上 $a$（不是加上固定量）。所以等距的 $x$ 對應到等比的 $y$。", tex: "\\frac{a^{x+1}}{a^x}=a" },
        { cap: "<b>半對數圖</b>：把縱軸改成 $\\log y$，指數曲線就變成直線，斜率是 $\\log a$。科學家就用這招判斷資料是不是指數成長。", tex: "\\log(a^x)=x\\log a\\ \\ \\text{（對 }x\\text{ 是一次函數）}" },
        { cap: "<b>應用：半衰期</b>。某藥物在體內每 6 小時剩一半：$N=N_0\\left(\\tfrac12\\right)^{t/6}$。要剩 10% 需要多久？取常用對數解出 $t$。", tex: "\\left(\\tfrac12\\right)^{t/6}=0.1\\Rightarrow t=\\frac{6}{\\log2}\\approx19.9\\ \\text{小時}" }
      ],
      hint: "拖動底數 a；最後一步拖動時間 t。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 540, 440, "指數與對數函數圖形");
        var g = s("g", {}, svg);
        var O = [170, 300], u = 40, st = { a: 2, t: 6 };
        function P(x, y) { return [O[0] + x * u, O[1] - y * u]; }
        var read = SK.h("div", { class: "readout" });
        var sa = SK.slider({ label: "$a$", min: .2, max: 4, step: .05, value: st.a, onInput: function (v) { if (Math.abs(v - 1) < .03) v = 1.05; st.a = v; draw(); } });
        var stt = SK.slider({ label: "$t$（小時）", min: 0, max: 30, step: .5, value: st.t, color: "blue", onInput: function (v) { st.t = v; draw(); } });
        ctx.sliders.appendChild(sa.el); ctx.sliders.appendChild(stt.el);
        ctx.extra.appendChild(read);
        function num(v, d) { return SK.fmt(v, d == null ? 2 : d).replace("−", "-"); }
        function grid(xmin, xmax, ymin, ymax) {
          for (var i = xmin; i <= xmax; i++) { var a = P(i, ymin), b = P(i, ymax); s("line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1], class: "m-grid" }, g); }
          for (var j = ymin; j <= ymax; j++) { var c = P(xmin, j), d = P(xmax, j); s("line", { x1: c[0], y1: c[1], x2: d[0], y2: d[1], class: "m-grid" }, g); }
          var x0 = P(xmin, 0), x1 = P(xmax, 0), y0 = P(0, ymin), y1 = P(0, ymax);
          s("line", { x1: x0[0], y1: x0[1], x2: x1[0], y2: x1[1], class: "m-axis" }, g);
          s("line", { x1: y0[0], y1: y0[1], x2: y1[0], y2: y1[1], class: "m-axis" }, g);
        }
        function curve(fn, x0, x1, col, w, dash) {
          var d = "", pen = false;
          for (var x = x0; x <= x1; x += .02) {
            var y = fn(x);
            if (!isFinite(y) || y > 7.2 || y < -7.5) { pen = false; continue; }
            var p = P(x, y); d += (pen ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1); pen = true;
          }
          s("path", { d: d, fill: "none", stroke: col, "stroke-width": w || 2.6, "stroke-dasharray": dash || null }, g);
        }
        function draw() {
          var f = ctx.frame, a = st.a, la = Math.log(a);
          g.innerHTML = "";
          sa.el.style.display = f === 4 ? "none" : "";
          stt.el.style.display = f === 4 ? "" : "none";
          if (f === 4) {
            // 半衰期：t 從 0 到 30 小時
            var X = function (t) { return 60 + t / 30 * 440; }, Y = function (p) { return 380 - p / 100 * 320; };
            s("line", { x1: 50, y1: Y(0), x2: 510, y2: Y(0), class: "m-axis" }, g);
            s("line", { x1: X(0), y1: 40, x2: X(0), y2: 390, class: "m-axis" }, g);
            [0, 6, 12, 18, 24, 30].forEach(function (t) { s("line", { x1: X(t), y1: Y(0) - 4, x2: X(t), y2: Y(0) + 4, stroke: C.cocoa }, g); SK.label(g, X(t), Y(0) + 16, String(t), { size: 11, color: C.soft }); });
            [25, 50, 100].forEach(function (p) { s("line", { x1: X(0), y1: Y(p), x2: 510, y2: Y(p), class: "m-grid" }, g); SK.label(g, X(0) - 8, Y(p), p + "%", { size: 11, color: C.soft, anchor: "end" }); });
            var d = "";
            for (var t = 0; t <= 30; t += .2) d += (t ? "L" : "M") + X(t) + " " + Y(100 * Math.pow(.5, t / 6));
            s("path", { d: d, fill: "none", stroke: C.orange.s, "stroke-width": 2.8 }, g);
            s("line", { x1: X(0), y1: Y(10), x2: 510, y2: Y(10), stroke: C.blue.s, "stroke-dasharray": "6 4" }, g);
            SK.label(g, 505, Y(10) - 12, "10%", { size: 12, color: C.blue.s, anchor: "end" });
            var tt = 6 / Math.log10(2);
            s("circle", { cx: X(tt), cy: Y(10), r: 5, fill: C.blue.s }, g);
            var pct = 100 * Math.pow(.5, st.t / 6);
            s("line", { x1: X(st.t), y1: Y(0), x2: X(st.t), y2: Y(pct), stroke: C.pink.s, "stroke-width": 2 }, g);
            s("circle", { cx: X(st.t), cy: Y(pct), r: 6, fill: C.pink.s }, g);
            SK.label(g, X(st.t) + 10, Y(pct) - 12, num(pct, 1) + "%", { size: 13, color: C.pink.s, anchor: "start" });
            SK.label(g, 270, 30, "每 6 小時剩下一半", { size: 14, color: C.soft });
            read.innerHTML = SK.tex("N=100\\%\\times\\left(\\tfrac12\\right)^{" + num(st.t, 1) + "/6}=" + num(pct, 1) + "\\%", true) + SK.tex("\\text{剩 10\\%}：t=\\frac{6}{\\log2}\\approx" + num(tt, 1) + "\\ \\text{小時}", true);
            return;
          }
          if (f === 3) {
            // 左：一般圖；右：半對數圖
            var X2 = function (x) { return 290 + x * 40; }, Y2 = function (l) { return 380 - (l + 1) * 110; };
            O = [60, 380]; u = 38;
            grid(0, 5, 0, 8);
            curve(function (x) { return Math.pow(a, x); }, 0, 5, C.orange.s);
            SK.label(g, 130, 30, "y = a^x", { size: 13, color: C.orange.s });
            s("line", { x1: X2(0), y1: Y2(-1), x2: X2(0), y2: Y2(2.2), class: "m-axis" }, g);
            s("line", { x1: X2(0), y1: Y2(0), x2: X2(5.5), y2: Y2(0), class: "m-axis" }, g);
            [-1, 0, 1, 2].forEach(function (l) { s("line", { x1: X2(0), y1: Y2(l), x2: X2(5.5), y2: Y2(l), class: "m-grid" }, g); SK.label(g, X2(0) - 6, Y2(l), String(Math.pow(10, l)), { size: 10, color: C.soft, anchor: "end" }); });
            var d2 = "";
            for (var x = 0; x <= 5.5; x += .1) { var l = x * Math.log10(a); if (l > 2.2 || l < -1) continue; d2 += (d2 ? "L" : "M") + X2(x) + " " + Y2(l); }
            s("path", { d: d2, fill: "none", stroke: C.purple.s, "stroke-width": 2.8 }, g);
            SK.label(g, 400, 30, "縱軸改用 log y", { size: 13, color: C.purple.s });
            O = [170, 300]; u = 40;
            read.innerHTML = SK.tex("\\log y=x\\log" + num(a) + "=" + num(Math.log10(a), 3) + "x", true);
            return;
          }
          grid(-4, 9, -3, 7);
          var d0 = P(-3, -3), d1 = P(7, 7);
          if (f === 1) s("line", { x1: d0[0], y1: d0[1], x2: d1[0], y2: d1[1], stroke: C.purple.s, "stroke-dasharray": "7 5", "stroke-width": 1.6 }, g);
          curve(function (x) { return Math.pow(a, x); }, -4, 9, C.orange.s, 2.8);
          var p1 = P(0, 1); s("circle", { cx: p1[0], cy: p1[1], r: 5, fill: C.orange.s }, g);
          if (f === 1) {
            curve(function (x) { return Math.log(x) / la; }, .01, 9, C.blue.s, 2.8);
            var p2 = P(1, 0); s("circle", { cx: p2[0], cy: p2[1], r: 5, fill: C.blue.s }, g);
            // 一對對稱點
            var q = [1.5, Math.pow(a, 1.5)];
            if (q[1] < 7) {
              var A = P(q[0], q[1]), B = P(q[1], q[0]);
              s("line", { x1: A[0], y1: A[1], x2: B[0], y2: B[1], stroke: C.pink.s, "stroke-dasharray": "4 3" }, g);
              s("circle", { cx: A[0], cy: A[1], r: 5, fill: C.pink.s }, g); s("circle", { cx: B[0], cy: B[1], r: 5, fill: C.pink.s }, g);
              SK.label(g, A[0] - 8, A[1] - 12, "(" + num(q[0]) + ", " + num(q[1]) + ")", { size: 11, color: C.pink.s, anchor: "end" });
              SK.label(g, B[0] + 8, B[1] + 14, "(" + num(q[1]) + ", " + num(q[0]) + ")", { size: 11, color: C.pink.s, anchor: "start" });
            }
            SK.label(g, P(7.5, 7)[0], P(7.5, 7)[1], "y = x", { size: 12, color: C.purple.s });
          }
          if (f === 2) {
            for (var k = 0; k < 4; k++) {
              var y0 = Math.pow(a, k), y1 = Math.pow(a, k + 1);
              if (y1 > 7) break;
              var A2 = P(k, y0), B2 = P(k + 1, y0), C2 = P(k + 1, y1);
              s("path", { d: "M" + A2 + " L" + B2 + " L" + C2, fill: "none", stroke: C.green.s, "stroke-width": 2 }, g);
              SK.label(g, C2[0] + 8, (B2[1] + C2[1]) / 2, "×" + num(a), { size: 12, color: C.green.s, anchor: "start" });
            }
          }
          read.innerHTML = SK.tex("y=" + num(a) + "^x" + (f === 1 ? ",\\ \\ y=\\log_{" + num(a) + "}x" : "") + (a > 1 ? "\\ \\ (\\text{遞增})" : "\\ \\ (\\text{遞減})"), true);
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "指數成長最後一定超過多項式", icon: "sparkle",
        html: "$x^{10}$ 一開始比 $1.1^x$ 大得多，但 $1.1^x$ 每一步都乘 1.1，而 $x^{10}$ 的倍數增長會越來越慢（$\\tfrac{(x+1)^{10}}{x^{10}}\\to1$）。所以只要走得夠遠，指數函數一定會追過任何多項式。對數函數則剛好相反：比任何正次方的 $x^p$ 都長得慢。" },
      { title: "金融：複利", icon: "leaf",
        html: "本金 $P$ 以年利率 $r$ 複利，$n$ 年後是 $P(1+r)^n$：一個底數為 $1+r$ 的指數函數。要多久才會翻倍？解 $(1+r)^n=2$，$n=\\tfrac{\\log2}{\\log(1+r)}$。年利率 2% 大約要 35 年，這就是「72 法則」的由來（$72\\div2=36$）。" }
    ],

    challenges: [
      { q: "比較 $2^{0.5}$、$\\log_2 3$、$1.5$ 的大小。", idea: "$2^{0.5}\\approx1.41$；$\\log_23=\\tfrac{0.477}{0.301}\\approx1.58$。所以 $2^{0.5}<1.5<\\log_23$。" },
      { q: "$y=\\log_2(x-1)+3$ 的圖形是 $y=\\log_2x$ 怎麼移動得到的？", idea: "往右 1、往上 3。原本過 $(1,0)$，現在過 $(2,3)$；漸近線從 $x=0$ 移到 $x=1$。" },
      { q: "細菌每 20 分鐘分裂一次，從 1 隻開始，多久會超過 100 萬隻？", idea: "$2^n>10^6$，$n>\\tfrac{6}{\\log2}\\approx19.9$，所以要分裂 20 次，約 $20\\times20=400$ 分鐘，不到 7 小時。" }
    ],

    where: {
      codes: [["F-11A-4", "指數與對數函數：圖形、比例成長與衰退模型、常用對數函數、在科學與金融上的應用；一般底數可換成常用對數處理"]],
      exam: "11 年級<b>數學 A</b>，學測數 A、分科數甲都在範圍內。數學 B 的「按比例成長」見 F-11B-2。",

      past: [] /* Examination text excluded; see docs/PROVENANCE.md. */,
      stop: "圖形性質、互為反函數、比例成長模型與常用對數的應用就夠了。不刻意在同一式子中混用不同的底數。學習路線：數學 B 在 F-11B-2 就會認識 $e$ 與自然對數 $\\ln$（見「按比例成長與 e」單元）；數學 A 這裡以常用對數為主，到數甲再用 $e^x$、$\\ln x$ 做微積分。"
    }
  });
})();
