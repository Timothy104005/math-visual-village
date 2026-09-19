/* 單元：指數與對數 */
(function () {
  var C = SK.C, s = SK.s;

  function hookVisual(el) {
    var svg = SK.svg(el, 420, 300, "一張紙對折越多次越厚");
    var x0 = 40, yb = 260;
    for (var k = 0; k <= 6; k++) {
      var h = Math.pow(2, k) * 3, x = x0 + k * 52;
      for (var j = 0; j < Math.pow(2, k); j++) {
        s("rect", { x: x, y: yb - (j + 1) * 3, width: 34, height: 3, fill: j % 2 ? "#FDFBF6" : "#F1EADC", stroke: C.cocoa, "stroke-width": .5 }, svg);
      }
      SK.label(svg, x + 17, yb + 16, k + " 次", { size: 12, color: C.soft });
      SK.label(svg, x + 17, yb - h - 12, "×" + Math.pow(2, k), { size: 12, color: C.orange.s });
    }
    SK.label(svg, 210, 290, "每對折一次，厚度 ×2", { size: 13, color: C.soft });
  }

  /* 計算尺：兩把對數刻度的尺，滑動就是在做乘法 */
  function slideRule(el) {
    var wrap = SK.h("div", {});
    var st = SK.h("div", { class: "stage" });
    wrap.appendChild(st); el.appendChild(wrap);
    var svg = SK.svg(st, 700, 200, "兩把對數刻度的尺，滑動上面那把做乘法");
    var g = s("g", {}, svg);
    var L = 560, x0 = 60, stt = { a: 2, b: 3 };
    function X(v) { return x0 + Math.log10(v) * L; }
    function ruler(y, off, col, label) {
      s("rect", { x: x0 + off, y: y, width: L, height: 40, rx: 6, fill: col.f, stroke: C.cocoa, "stroke-width": 1.2 }, g);
      for (var v = 1; v <= 10; v += (v < 2 ? .1 : v < 5 ? .5 : 1)) {
        var vv = Math.round(v * 10) / 10, xx = X(vv) + off, major = Math.abs(vv - Math.round(vv)) < 1e-9;
        s("line", { x1: xx, y1: y + (y < 100 ? 40 : 0), x2: xx, y2: y + (y < 100 ? 40 - (major ? 14 : 7) : (major ? 14 : 7)), stroke: C.cocoa, "stroke-width": major ? 1.3 : .8 }, g);
        if (major) SK.label(g, xx, y + (y < 100 ? 16 : 26), String(vv), { size: 13 });
      }
      SK.label(g, x0 + off - 8, y + 20, label, { size: 12, anchor: "end", color: C.soft });
    }
    function draw() {
      g.innerHTML = "";
      var off = Math.log10(stt.a) * L;
      ruler(40, off, C.orange, "上尺");
      ruler(80, 0, C.blue, "下尺");
      var p = stt.a * stt.b, xp = X(stt.b) + off;
      s("line", { x1: X(1) + off, y1: 20, x2: X(1) + off, y2: 132, stroke: C.orange.s, "stroke-width": 1.6, "stroke-dasharray": "4 4" }, g);
      s("line", { x1: xp, y1: 20, x2: xp, y2: 132, stroke: C.pink.s, "stroke-width": 2 }, g);
      SK.label(g, X(1) + off, 12, "上尺的 1 對齊 " + SK.fmt(stt.a, 1), { size: 12, color: C.orange.s });
      SK.label(g, xp, 148, p <= 10 ? "讀到 " + SK.fmt(p, 2) : "超出尺的範圍", { size: 13, color: C.pink.s });
      out.innerHTML = SK.tex("\\log(" + SK.fmt(stt.a, 1) + "\\times" + SK.fmt(stt.b, 1) + ")=\\co{\\log " + SK.fmt(stt.a, 1) + "}+\\cb{\\log " + SK.fmt(stt.b, 1) + "}\\ \\Rightarrow\\ " + SK.fmt(stt.a, 1) + "\\times" + SK.fmt(stt.b, 1) + "=" + SK.fmt(p, 2), true);
    }
    var ctr = SK.h("div", { class: "sliders", style: "margin-top:12px" });
    var out = SK.h("div", { class: "readout" });
    ctr.appendChild(SK.slider({ label: "$a$", min: 1, max: 9, step: .1, value: stt.a, fmt: function (v) { return SK.fmt(v, 1); }, onInput: function (v) { stt.a = v; draw(); } }).el);
    ctr.appendChild(SK.slider({ label: "$b$", min: 1, max: 9, step: .1, value: stt.b, color: "blue", fmt: function (v) { return SK.fmt(v, 1); }, onInput: function (v) { stt.b = v; draw(); } }).el);
    ctr.appendChild(out); wrap.appendChild(ctr);
    wrap.insertAdjacentHTML("beforeend", '<p class="muted" style="font-size:.95rem">' + SK.md("尺上的刻度 $v$ 放在距離 $\\log v$ 的位置。把上尺往右推 $\\log a$，再往後讀 $\\log b$，總共走了 $\\log a+\\log b=\\log(ab)$，下尺正好讀到 $ab$。在計算機出現以前，工程師就是用這把尺做乘法的。") + "</p>");
    draw();
  }

  SK.mountUnit({
    slug: "exp-log",
    en: "Two directions of the same question",
    formula: "\\co{a}^{\\cb{x}}=\\cy{b}\\iff \\cb{x}=\\log_{\\co{a}}\\cy{b},\\qquad \\log(MN)=\\log M+\\log N",

    hook: {
      html: "一張 0.1 公釐厚的紙，每對折一次，厚度就變成 2 倍。",
      ask: "要對折幾次，厚度才會超過台北 101 的高度（約 508 公尺）？先憑感覺猜一個數字。",
      visual: hookVisual
    },

    guess: {
      q: "$2^{10}=1024$，大約是一千。那麼 $2^{20}$ 大約是多少？",
      options: [
        { t: "大約兩千", common: true, explain: "次方多了一倍，答案也多一倍，這是用「加法」的直覺在想。但指數多 10，代表<b>再乘</b>一次 $2^{10}$：$2^{20}=2^{10}\\times2^{10}\\approx1000\\times1000$。" },
        { t: "大約一百萬", truth: true, explain: "$2^{20}=2^{10}\\times2^{10}\\approx1000\\times1000=10^6$。指數上的「加」，對應數值上的「乘」，這正是對數要抓住的關係。" },
        { t: "大約兩萬", explain: "你感覺到不只兩倍，很好！不過每多 10 次方，是再乘上一千倍，不是十倍。" },
        { t: "大約一億", explain: "倍數成長真的很驚人，往大的猜很合理！不過一億是 $10^8\\approx2^{26.6}$，要到 $2^{27}$ 左右才會碰到。" }
      ]
    },

    derive: {
      intro: "我們畫 $y=2^x$，再問反過來的問題：「要乘幾次 2 才到 $b$？」拖動滑桿改變 $b$。",
      frames: [
        { cap: "每往右走一格，高度就 $\\times2$。一般的刻度下，曲線一下子就衝出畫面：這就是<b>倍數成長</b>。", tex: "y=\\co{2}^{\\cb{x}}" },
        { cap: "反過來問：給一個高度 $b$，要乘幾次 2 才到？這個「次數」就叫做 $\\log_2 b$。", tex: "\\co{2}^{\\cb{x}}=\\cy{b}\\iff\\cb{x}=\\log_2\\cy{b}" },
        { cap: "把縱軸換成<b>對數刻度</b>：每往上一格代表 $\\times2$，而不是 $+1$。同一條曲線，被拉成了一條直線！", tex: "\\text{對數刻度上：}\\ \\log_2 y=x\\ \\text{是直線}" },
        { cap: "在對數刻度上，「$\\times4$」就是往上走 2 格。先到 $b$、再 $\\times4$，高度是兩段相加：<b>乘法變成了加法</b>。", tex: "\\log_2(4b)=\\log_2 4+\\log_2 b=2+\\log_2 b" },
        { cap: "高一用的是以 10 為底的常用對數，和科學記號是同一件事：整數部分是「幾個 10」，小數部分交給計算機。", tex: "\\begin{aligned}\\log(3.2\\times10^5)&=5+\\log3.2\\\\&\\approx5+0.505=5.505\\end{aligned}" }
      ],
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 520, 440, "y 等於 2 的 x 次方，一般刻度與對數刻度");
        var g = s("g", {}, svg);
        var st = { b: 20 };
        var read = SK.h("div", { class: "readout" });
        ctx.sliders.appendChild(SK.slider({ label: "$b$", min: 1, max: 60, value: st.b, color: "blue", onInput: function (v) { st.b = v; draw(); } }).el);
        ctx.extra.appendChild(read);
        var x0 = 70, yb = 400, ux = 64;
        function X(x) { return x0 + x * ux; }
        function draw() {
          var f = ctx.frame, logScale = f >= 2, b = st.b, lb = Math.log2(b);
          var Y = logScale ? function (y) { return yb - Math.log2(y) * 58; } : function (y) { return yb - y * 5.6; };
          g.innerHTML = "";
          s("line", { x1: x0 - 10, y1: yb, x2: 500, y2: yb, class: "m-axis" }, g);
          s("line", { x1: x0, y1: yb + 6, x2: x0, y2: 20, class: "m-axis" }, g);
          for (var i = 0; i <= 6; i++) {
            SK.label(g, X(i), yb + 18, String(i), { size: 12, color: C.soft });
            var v = Math.pow(2, i);
            if (logScale || v >= 8) {
              s("line", { x1: x0 - 5, y1: Y(v), x2: 500, y2: Y(v), class: "m-grid" }, g);
              SK.label(g, x0 - 10, Y(v), String(v), { size: 12, anchor: "end", color: C.soft });
            }
          }
          if (!logScale) [10, 30, 50, 70].forEach(function (v) { s("line", { x1: x0 - 5, y1: Y(v), x2: 500, y2: Y(v), class: "m-grid" }, g); SK.label(g, x0 - 10, Y(v), String(v), { size: 12, anchor: "end", color: C.soft }); });
          SK.label(g, 500, yb + 18, "x", { it: true });
          SK.label(g, x0 + 4, 24, logScale ? "y（對數刻度：每格 ×2）" : "y（一般刻度）", { size: 13, anchor: "start", color: C.soft });
          // 整數點的長條
          for (var k = 0; k <= 6; k++) {
            var yy = Math.pow(2, k), top = Math.max(Y(yy), 30);
            s("rect", { x: X(k) - 9, y: top, width: 18, height: yb - top, rx: 3, fill: C.orange.f, stroke: C.orange.s, "stroke-width": 1 }, g);
          }
          var d = "";
          for (var t = 0; t <= 6.6; t += .05) d += (t ? "L" : "M") + X(t) + " " + Math.max(Y(Math.pow(2, t)), 20);
          s("path", { d: d, fill: "none", stroke: C.ink, "stroke-width": 2.4 }, g);
          if (f >= 1) {
            var yb2 = Y(b);
            s("line", { x1: x0, y1: yb2, x2: X(lb), y2: yb2, stroke: C.gold.s, "stroke-width": 2, "stroke-dasharray": "6 4" }, g);
            s("line", { x1: X(lb), y1: yb2, x2: X(lb), y2: yb, stroke: C.blue.s, "stroke-width": 2, "stroke-dasharray": "6 4" }, g);
            s("circle", { cx: X(lb), cy: yb2, r: 6, fill: C.gold.f, stroke: C.cocoa, "stroke-width": 1.4 }, g);
            SK.label(g, x0 + 8, yb2 - 12, "b = " + b, { size: 13, anchor: "start", color: C.gold.s });
            SK.label(g, X(lb), yb + 34, "log₂b ≈ " + SK.fmt(lb, 2), { size: 13, color: C.blue.s });
          }
          if (f === 3 && b * 4 > 64) SK.label(g, 480, 60, "把 b 調到 16 以下，就看得到 ×4 的箭頭", { size: 13, anchor: "end", color: C.pink.s });
          if (f === 3 && b * 4 <= 64) {
            var xa = X(lb) + 40;
            SK.arrow(g, xa, Y(1), xa, Y(b), C.gold.s, 3);
            SK.arrow(g, xa + 16, Y(b), xa + 16, Y(4 * b), C.pink.s, 3);
            SK.label(g, xa + 26, (Y(b) + Y(4 * b)) / 2, "×4 = 往上 2 格", { size: 13, anchor: "start", color: C.pink.s });
          }
          read.innerHTML = SK.tex("2^{\\,x}=" + b + "\\ \\Rightarrow\\ x=\\log_2" + b + "\\approx" + SK.fmt(lb, 3), true) +
            (f === 3 ? SK.tex("\\log_2(4\\times" + b + ")=2+" + SK.fmt(lb, 3) + "=" + SK.fmt(lb + 2, 3), true) : "") +
            (f === 4 ? SK.tex("\\log" + b + "\\approx" + SK.fmt(Math.log10(b), 3), true) : "");
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "計算尺：把乘法變成滑動", icon: "sparkle", render: slideRule },
      { title: "生活裡的對數刻度", icon: "leaf",
        html: "地震規模、聲音的分貝、酸鹼值 pH 都是對數刻度：數字每差 1，實際的量就差固定的<b>倍數</b>，不是固定的差。例如地震規模多 1，地震儀量到的震幅約是 10 倍，釋放的能量約是 32 倍。用對數，人類才能把「小到大差了幾百萬倍」的量放在同一把尺上比較。" }
    ],

    challenges: [
      { q: "開頭的紙要對折幾次，厚度才超過 508 公尺？", hint: "0.1 公釐 $\\times2^n\\ge508000$ 公釐，也就是 $2^n\\ge5.08\\times10^6$。用 $2^{10}\\approx10^3$ 估估看。",
        idea: "$2^{22}\\approx4.19\\times10^6$ 還不夠，$2^{23}\\approx8.39\\times10^6$ 就超過了，所以是 23 次。倍數成長只要二十幾步就能從一張紙長到一棟摩天大樓。" },
      { q: "只用 $2^{10}\\approx10^3$，估計 $\\log2$ 大約是多少？", hint: "兩邊取常用對數。",
        idea: "$10\\log2\\approx3$，所以 $\\log2\\approx0.3$。真正的值是 $0.30103\\ldots$，這個估計準得驚人。" },
      { q: "$2^{100}$ 是幾位數？不用算出它，你能回答嗎？", hint: "一個數的位數和它的常用對數有什麼關係？",
        idea: "$\\log2^{100}=100\\log2\\approx30.1$，所以 $2^{100}\\approx10^{30.1}$，是 31 位數。對數讓我們不用算出數字本身，就知道它有多大。" }
    ],

    where: {
      codes: [["N-10-3", "指數：非負實數的次方、指數律"], ["N-10-4", "常用對數：log 的意義、與科學記號的連結、計算機 10ˣ 與 log 鍵"]],
      exam: "高一共同必修，學測數 A、數 B 都在範圍內。11 年級數 A 會學對數律與一般底（`A-11A-4`、`F-11A-4`），數 B 會用在按比例成長模型（`F-11B-2`）。",
      stop: "高一只需要常用對數、科學記號與計算機操作；一般底、對數律與完整的函數圖形等到 11 年級。避免 $a^x\\pm a^{-x}$ 這類純技巧的連鎖題。"
    }
  });
})();
