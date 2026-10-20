/* 單元：對數律（計算尺） */
(function () {
  var C = SK.C, s = SK.s;
  var LG = Math.log10;

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 250, "計算尺");
    s("rect", { x: 20, y: 70, width: 360, height: 44, rx: 6, fill: C.gold.f, stroke: C.cocoa }, svg);
    s("rect", { x: 90, y: 114, width: 290, height: 44, rx: 6, fill: C.blue.f, stroke: C.cocoa }, svg);
    [1, 2, 3, 4, 5, 6, 8, 10].forEach(function (k) {
      var x = 30 + LG(k) * 340;
      s("line", { x1: x, y1: 114, x2: x, y2: 104, stroke: C.cocoa }, svg);
      SK.label(svg, x, 92, String(k), { size: 12 });
    });
    SK.label(svg, 200, 40, "工程師以前靠一把尺做乘法", { size: 14, color: C.pink.s });
    SK.label(svg, 200, 200, "尺上的刻度，為什麼不是等距的？", { size: 13, color: C.soft });
  }

  SK.mountUnit({
    slug: "log-laws",
    en: "A ruler that turns multiplication into addition",
    formula: "\\log(\\co a\\cb b)=\\log\\co a+\\log\\cb b,\\qquad \\log\\frac ab=\\log a-\\log b,\\qquad \\log a^n=n\\log a",

    hook: {
      html: "計算機發明以前，工程師口袋裡放著一把「計算尺」：把兩把刻度奇怪的尺<b>錯開一段</b>，就能讀出兩個數的<b>乘積</b>。",
      ask: "滑動（加上長度）怎麼會變成乘法？刻度要怎麼刻才能做到？",
      visual: hookVisual
    },

    guess: {
      q: "已知 $\\log2\\approx0.301$、$\\log3\\approx0.477$。$\\log6$ 大約是多少？",
      options: [
        { t: "$0.778$", truth: true, explain: "$6=2\\times3$，$10^{0.301}\\times10^{0.477}=10^{0.301+0.477}=10^{0.778}$。乘法在指數上變成加法，所以 $\\log6=\\log2+\\log3$。" },
        { t: "$0.301\\times0.477\\approx0.144$", common: true, explain: "看到乘法就想相乘，非常自然！但 $\\log$ 是「10 的幾次方」，而指數律告訴我們：次方<b>相乘</b>的時候，指數是<b>相加</b>。" },
        { t: "$0.176$", explain: "這是 $\\log3-\\log2=\\log1.5$。減法對應的是除法。" },
        { t: "$0.903$", explain: "這是 $3\\log2=\\log8$。係數在前面，對應的是次方。" }
      ]
    },

    derive: {
      intro: "上面是可以滑動的尺（C 尺），下面是固定的尺（D 尺），兩把的刻度都依 $\\log$ 值來刻。拖動滑桿滑動尺，讀讀看乘積。",
      tall: true,
      frames: [
        { cap: "從指數律出發：$10^m\\times10^n=10^{m+n}$。把 $a=10^m$、$b=10^n$ 寫成對數：$m=\\log a$、$n=\\log b$，乘積 $ab=10^{m+n}$，所以……", tex: "\\log(ab)=m+n=\\log a+\\log b" },
        { cap: "<b>計算尺</b>：把數字 $x$ 刻在離起點 $\\log x$ 的地方。把 C 尺的 1 對準 D 尺的 $a$，C 尺上的 $b$ 就對到 D 尺的 $ab$：因為長度 $\\log a+\\log b=\\log(ab)$。", tex: "\\text{長度相加}\\ \\Longleftrightarrow\\ \\text{數字相乘}" },
        { cap: "反過來把尺往回滑就是除法；同一段長度走 $n$ 次就是 $n$ 次方。", tex: "\\log\\frac ab=\\log a-\\log b,\\qquad \\log a^n=n\\log a" },
        { cap: "<b>換底</b>：$\\log_2x$ 和 $\\log x$ 的刻度只差一個倍數。因為 $x=2^{\\log_2x}$，取常用對數得 $\\log x=\\log_2x\\cdot\\log2$。", tex: "\\log_2x=\\frac{\\log x}{\\log 2}" },
        { cap: "<b>解指數方程式</b>：$2^x=10$，兩邊取 $\\log$，$x\\log2=1$，$x=\\tfrac{1}{\\log2}\\approx3.32$。也能估計大數的位數：$2^{100}$ 的 $\\log$ 是 $30.1$，所以是 31 位數。", tex: "2^x=10\\Rightarrow x=\\frac{1}{\\log2}\\approx3.32" }
      ],
      hint: "滑桿 a 滑動上尺，b 移動游標。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 540, 440, "計算尺");
        var g = s("g", {}, svg);
        var st = { a: 2, b: 3, n: 3 };
        var x0 = 40, L = 230; // 每一個十倍 230 像素；D 尺從 1 到 100
        function X(v) { return x0 + LG(v) * L; }
        var read = SK.h("div", { class: "readout" });
        var sa = SK.slider({ label: "$a$", min: 1, max: 10, step: .1, value: st.a, onInput: function (v) { st.a = v; draw(); } });
        var sb = SK.slider({ label: "$b$", min: 1, max: 10, step: .1, value: st.b, color: "blue", onInput: function (v) { st.b = v; draw(); } });
        var sn = SK.slider({ label: "$n$", min: 1, max: 4, step: 1, value: st.n, color: "green", onInput: function (v) { st.n = v; draw(); } });
        ctx.sliders.appendChild(sa.el); ctx.sliders.appendChild(sb.el); ctx.sliders.appendChild(sn.el);
        ctx.extra.appendChild(read);
        function num(v, d) { return SK.fmt(v, d == null ? 3 : d).replace("−", "-"); }
        function scale(y, off, lo, hi, fill, up, label) {
          var xa = off + x0 + LG(lo) * L, xb = off + x0 + LG(hi) * L;
          s("rect", { x: xa - 12, y: y, width: xb - xa + 24, height: 46, rx: 6, fill: fill, stroke: C.cocoa }, g);
          SK.label(g, xa - 22, y + 23, label, { size: 13, color: C.soft, anchor: "end" });
          for (var dec = lo; dec < hi; dec *= 10) {
            for (var k = 1; k < 10; k += (k < 2 ? .1 : k < 5 ? .5 : 1)) {
              var v = dec * k, x = off + x0 + LG(v) * L, major = Math.abs(k - Math.round(k)) < 1e-9;
              s("line", { x1: x, y1: up ? y : y + 46, x2: x, y2: up ? y + (major ? 14 : 7) : y + 46 - (major ? 14 : 7), stroke: C.cocoa, "stroke-width": major ? 1.3 : .7 }, g);
              if (major && (dec === 1 || k <= 5)) SK.label(g, x, up ? y + 26 : y + 20, String(Math.round(v)), { size: 11 });
            }
          }
          var xe = off + x0 + LG(hi) * L;
          s("line", { x1: xe, y1: up ? y : y + 46, x2: xe, y2: up ? y + 14 : y + 32, stroke: C.cocoa, "stroke-width": 1.3 }, g);
          SK.label(g, xe, up ? y + 26 : y + 20, String(hi), { size: 11 });
        }
        function draw() {
          var f = ctx.frame, a = st.a, b = st.b;
          g.innerHTML = "";
          g.setAttribute("transform", f <= 2 ? "translate(0 50)" : "");
          sn.el.style.display = f === 2 ? "" : "none";
          sb.el.style.display = f === 3 || f === 4 ? "none" : "";
          sa.el.style.display = f === 3 || f === 4 ? "none" : "";
          if (f <= 2) {
            var off = f === 2 && st.n ? 0 : LG(a) * L, prod = a * b;
            if (f === 2) {
              // a 的 n 次方：同一段長度重複 n 次
              var n = st.n, y = 140;
              scale(230, 0, 1, 100, C.gold.f, true, "D");
              var len = LG(a) * L;
              for (var k = 0; k < n && (k + 1) * len <= 2 * L + 1; k++) {
                SK.arrow(g, x0 + k * len, y + 60 - k * 0, x0 + (k + 1) * len, y + 60, [C.orange.s, C.blue.s, C.green.s, C.purple.s][k], 3);
              }
              var an = Math.pow(a, n), ok = LG(an) <= 2;
              if (ok) { s("line", { x1: X(an), y1: 150, x2: X(an), y2: 300, stroke: C.pink.s, "stroke-width": 2 }, g); SK.label(g, X(an), 136, a + "^" + n + " ≈ " + num(an, 2), { size: 13, color: C.pink.s }); }
              else SK.label(g, 270, 136, a + "^" + n + " 超過 100，超出尺的範圍", { size: 13, color: C.soft });
              // 除法示意：a·b 往回滑 b 回到 a
              read.innerHTML = SK.tex("\\log " + a + "^{" + n + "}=" + n + "\\times" + num(LG(a)) + "=" + num(n * LG(a)), true) + SK.tex("\\log\\frac{" + num(a * b, 2) + "}{" + b + "}=" + num(LG(a * b)) + "-" + num(LG(b)) + "=\\log " + a, true);
              return;
            }
            scale(150, off, 1, 10, C.blue.f, false, "C");
            scale(196, 0, 1, 100, C.gold.f, true, "D");
            // 游標
            var xb = X(a) + LG(b) * L;
            s("rect", { x: xb - 10, y: 130, width: 20, height: 130, fill: "rgba(253,251,246,.35)", stroke: C.pink.s, "stroke-width": 1.4 }, g);
            s("line", { x1: xb, y1: 128, x2: xb, y2: 262, stroke: C.pink.s, "stroke-width": 1.6 }, g);
            // 長度標示
            SK.brace(g, x0, 300, X(a), 300, -12, C.orange.s);
            SK.label(g, (x0 + X(a)) / 2, 324, "log " + a + " = " + num(LG(a)), { size: 12, color: C.orange.s });
            SK.brace(g, X(a), 300, xb, 300, -12, C.blue.s);
            SK.label(g, (X(a) + xb) / 2, 348, "log " + b + " = " + num(LG(b)), { size: 12, color: C.blue.s });
            SK.label(g, xb, 110, "≈ " + num(prod, 2), { size: 15, color: C.pink.s, bold: true });
            if (f === 0) {
              SK.label(g, 270, 40, "10^" + num(LG(a)) + " × 10^" + num(LG(b)) + " = 10^" + num(LG(a) + LG(b)), { size: 15 });
            }
            read.innerHTML = SK.tex("\\log" + a + "+\\log" + b + "=" + num(LG(a)) + "+" + num(LG(b)) + "=" + num(LG(prod)) + "=\\log" + num(prod, 2), true);
            return;
          }
          if (f === 3) {
            // 兩把尺：常用對數與以 2 為底，刻度成比例
            var sc2 = 460 / 7; // log2 從 0 到 7
            s("rect", { x: 30, y: 110, width: 480, height: 40, rx: 6, fill: C.gold.f, stroke: C.cocoa }, g);
            s("rect", { x: 30, y: 230, width: 480, height: 40, rx: 6, fill: C.purple.f, stroke: C.cocoa }, g);
            SK.label(g, 270, 94, "以 10 為底：log x", { size: 13, color: C.soft });
            SK.label(g, 270, 290, "以 2 為底：log₂ x", { size: 13, color: C.soft });
            var lg128 = LG(128), sc10 = 460 / lg128;
            [1, 2, 4, 8, 16, 32, 64, 128].forEach(function (x, i) {
              var px = 40 + LG(x) * sc10;
              s("line", { x1: px, y1: 150, x2: px, y2: 230, stroke: C.line, "stroke-dasharray": "3 4" }, g);
              s("line", { x1: px, y1: 110, x2: px, y2: 124, stroke: C.cocoa }, g);
              s("line", { x1: px, y1: 256, x2: px, y2: 270, stroke: C.cocoa }, g);
              SK.label(g, px, 136, num(LG(x), 2), { size: 10, color: C.soft });
              SK.label(g, px, 244, String(i), { size: 12, color: C.purple.s, bold: true });
              SK.label(g, px, 190, String(x), { size: 12 });
            });
            SK.label(g, 270, 340, "上下兩排數字的比值都一樣：log x ÷ log₂ x = log 2 ≈ 0.301", { size: 13, color: C.pink.s });
            read.innerHTML = SK.tex("\\log_2 64=\\frac{\\log64}{\\log2}=\\frac{" + num(LG(64)) + "}{" + num(LG(2)) + "}=6", true);
            return;
          }
          // f === 4：2^x = 10
          var X2 = function (t) { return 50 + t / 4 * 440; }, Y2 = function (y) { return 380 - y / 16 * 320; };
          s("line", { x1: 40, y1: Y2(0), x2: 510, y2: Y2(0), class: "m-axis" }, g);
          s("line", { x1: X2(0), y1: 40, x2: X2(0), y2: 390, class: "m-axis" }, g);
          for (var t = 1; t <= 4; t++) { s("line", { x1: X2(t), y1: Y2(0) - 4, x2: X2(t), y2: Y2(0) + 4, stroke: C.cocoa }, g); SK.label(g, X2(t), Y2(0) + 16, String(t), { size: 11, color: C.soft }); }
          [5, 10, 15].forEach(function (y) { SK.label(g, X2(0) - 8, Y2(y), String(y), { size: 11, color: C.soft, anchor: "end" }); s("line", { x1: X2(0), y1: Y2(y), x2: 510, y2: Y2(y), class: "m-grid" }, g); });
          var d = "";
          for (var u = 0; u <= 4; u += .02) d += (u ? "L" : "M") + X2(u) + " " + Y2(Math.pow(2, u));
          s("path", { d: d, fill: "none", stroke: C.orange.s, "stroke-width": 2.6 }, g);
          s("line", { x1: X2(0), y1: Y2(10), x2: 510, y2: Y2(10), stroke: C.blue.s, "stroke-width": 1.8, "stroke-dasharray": "6 4" }, g);
          var xs = 1 / LG(2);
          s("line", { x1: X2(xs), y1: Y2(10), x2: X2(xs), y2: Y2(0), stroke: C.pink.s, "stroke-width": 2, "stroke-dasharray": "4 3" }, g);
          s("circle", { cx: X2(xs), cy: Y2(10), r: 6, fill: C.pink.s }, g);
          SK.label(g, X2(xs), Y2(0) + 34, "x ≈ " + num(xs), { size: 14, color: C.pink.s });
          SK.label(g, X2(3.6), Y2(13.5), "y = 2ˣ", { size: 14, color: C.orange.s });
          SK.label(g, 480, Y2(10) - 12, "y = 10", { size: 13, color: C.blue.s, anchor: "end" });
          read.innerHTML = SK.tex("x=\\frac{1}{\\log 2}=\\frac{1}{0.30103}\\approx" + num(xs), true) + SK.tex("\\log 2^{100}=100\\times0.30103=30.1\\Rightarrow 31\\ \\text{位數}", true);
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "為什麼以 10 為底特別好用", icon: "sparkle",
        html: "$\\log(3.7\\times10^5)=\\log3.7+5$。整數部分（首數）只告訴你「幾位數」，小數部分（尾數）只和 $3.7$ 有關。所以一張 1 到 10 的對數表就能處理所有正數：科學記號和常用對數是天生一對。" },
      { title: "星等、分貝、pH 值", icon: "leaf",
        html: "聲音強度相差 10 倍，分貝差 10；相差 100 倍，分貝只差 20。地震規模、酸鹼值也都是對數尺：把「倍數」變成「差距」，讓相差幾千萬倍的量可以放在同一把尺上比較。" }
    ],

    challenges: [
      { q: "不用計算機，求 $\\log 5$。", hint: "$5=\\tfrac{10}{2}$。", idea: "$\\log5=\\log10-\\log2\\approx1-0.301=0.699$。" },
      { q: "$3^{20}$ 是幾位數？首位數字是多少？", idea: "$\\log3^{20}=20\\times0.4771=9.542$，所以是 10 位數。$10^{0.542}\\approx3.48$（$\\log3.48\\approx0.542$），首位是 3。事實上 $3^{20}=3486784401$。" },
      { q: "解 $5^x=3^{x+1}$。", idea: "取 $\\log$：$x\\log5=(x+1)\\log3$，$x=\\tfrac{\\log3}{\\log5-\\log3}\\approx\\tfrac{0.477}{0.222}\\approx2.15$。" }
    ],

    where: {
      codes: [["A-11A-4", "對數律：由 $10^x$ 與指數律理解對數律、基本應用、解指數方程式；認識一般底數（換底），但不過度練習"]],
      exam: "11 年級<b>數學 A</b>，學測數 A、分科數甲都在範圍內。數學 B 用常用對數處理成長模型。",
      stop: "以常用對數為主，一般底數要認識、會換底就好。複雜的對數恆等式化簡、不同底數混合的方程式不是重點。"
    }
  });
})();
