/* 單元：數值計算的誤差 */
(function () {
  var C = SK.C, s = SK.s;

  function rnd(x, d) { return Number(x.toPrecision(d)); }

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 250, "只有四位數的計算機");
    s("rect", { x: 110, y: 20, width: 180, height: 214, rx: 16, fill: C.paper, stroke: C.cocoa, "stroke-width": 1.4 }, svg);
    s("rect", { x: 126, y: 36, width: 148, height: 46, rx: 6, fill: C.mint.f, stroke: C.cocoa }, svg);
    SK.label(svg, 262, 60, "0.02", { size: 24, anchor: "end" });
    for (var r = 0; r < 3; r++) for (var c = 0; c < 4; c++) s("rect", { x: 128 + c * 36, y: 100 + r * 42, width: 28, height: 30, rx: 6, fill: r === 2 && c === 3 ? C.orange.f : C.gold.f, stroke: C.cocoa, "stroke-width": .8 }, svg);
    SK.label(svg, 60, 70, "√1001 − √1000", { size: 13, color: C.soft });
    SK.label(svg, 340, 70, "真的是 0.02？", { size: 13, color: C.pink.s });
    SK.label(svg, 200, 244, "（一台只保留 4 位有效數字的計算機）", { size: 11, color: C.soft });
  }

  SK.mountUnit({
    slug: "numeric-error",
    en: "Calculators only keep finitely many digits",
    formula: "\\sqrt{1001}-\\sqrt{1000}=\\frac{1}{\\co{\\sqrt{1001}+\\sqrt{1000}}}\\approx0.01581",

    hook: {
      html: "計算機螢幕只放得下有限位數，所以每一次計算都悄悄「四捨五入」一下。平常差一點點沒關係，但有時候這一點點會被放大。",
      ask: "一台只保留 4 位有效數字的計算機算 $\\sqrt{1001}-\\sqrt{1000}$，得到 $0.02$。這個答案可信嗎？",
      visual: hookVisual
    },

    guess: {
      q: "$\\sqrt{1001}\\approx31.64$、$\\sqrt{1000}\\approx31.62$（各 4 位有效數字）。相減得 $0.02$，它和真正答案差多少？",
      options: [
        { t: "差了超過 25%", truth: true, explain: "真正的值約 $0.01581$。$0.02$ 比它大了約 27%！兩個數各只差不到 $0.005$，可是相減之後，前面相同的「31.6」全部抵消，只剩最後一位不可靠的數字。" },
        { t: "差不到 1%，因為每個數都很準", common: true, explain: "每個數的相對誤差確實很小（約 0.01%）。但「很準」是相對於 31.6 這麼大的數；相減後答案只有 0.0158，同樣的絕對誤差變成了很大的比例。" },
        { t: "完全正確", explain: "$0.02$ 只有一位有效數字，而且那一位還是被捨入出來的。等一下你會看到它的真值是 $0.0158\\ldots$。" },
        { t: "沒辦法知道", explain: "其實有辦法！把式子改寫成 $\\dfrac{1}{\\sqrt{1001}+\\sqrt{1000}}$，就能在同一台計算機上算得很準。" }
      ]
    },

    derive: {
      intro: "拖動「有效位數」，模擬不同精度的計算機。每一格是一位數字：<b>有顏色</b>的是計算機保留下來的，<b>淡灰</b>的是被捨掉的。",
      tall: true,
      frames: [
        { cap: "計算機只保留有限位數。$\\tfrac13$ 存成 $0.3333$，乘回 3 變成 $0.9999$，不是 1：這個差距叫做<b>捨入誤差</b>。", tex: "3\\times0.3333=0.9999\\ne1" },
        { cap: "四捨五入到某一位，誤差最多是那一位的<b>一半</b>。$31.64$ 代表真值在 $31.635$ 到 $31.645$ 之間。有效位數越多，區間越窄。", tex: "31.64\\ \\Rightarrow\\ |\\text{誤差}|\\le0.005" },
        { cap: "兩個很接近的數相減，前面一樣的數字全部抵消，只剩後面不可靠的位數。4 位的計算機算出 $0.02$，只剩 1 位有效數字，而且還錯了。", tex: "\\co{31.6}4-\\co{31.6}2=0.02\\quad(\\text{真值 }0.0158\\ldots)" },
        { cap: "換一個不必相減的算法：分子有理化。分母是兩數<b>相加</b>，不會抵消，同一台 4 位計算機就算得出 $0.01581$。", tex: "\\frac{1}{\\sqrt{1001}+\\sqrt{1000}}\\approx\\frac{1}{63.26}\\approx0.01581" },
        { cap: "報告答案時，位數不要比資料可靠：乘除的結果，有效位數取資料中<b>最少</b>的那一個。多寫的數字不是更精確，只是假裝精確。", tex: "2.5\\times3.14159\\approx7.9\\quad(\\text{不是 }7.853975)" }
      ],
      hint: "把有效位數拖到 3，再拖到 8，比較兩種算法的誤差。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 540, 440, "逐位數字格與誤差比較");
        var g = s("g", {}, svg);
        var st = { d: 4 };
        var read = SK.h("div", { class: "readout" });
        ctx.sliders.appendChild(SK.slider({ label: "有效位數", min: 2, max: 9, step: 1, value: 4, onInput: function (v) { st.d = v; draw(); } }).el);
        ctx.extra.appendChild(read);
        var CW = 26;
        // 把數字寫成一列格子；keep = 保留的有效位數
        function row(y, label, x, keep, color, opts) {
          opts = opts || {};
          SK.label(g, 96, y + 14, label, { size: 13, anchor: "end", color: C.soft });
          var str = x.toFixed(opts.dec == null ? 12 : opts.dec), sig = 0, started = false, px = 110;
          for (var i = 0; i < str.length && px < 520; i++) {
            var ch = str[i];
            if (ch === ".") { SK.label(g, px + 4, y + 16, ".", { size: 18 }); px += 10; continue; }
            if (ch !== "0") started = true;
            var isSig = started, kept = !isSig || sig < keep;
            if (isSig) sig++;
            var cancel = opts.cancel && i < opts.cancel;
            s("rect", { x: px, y: y, width: CW - 3, height: 28, rx: 4, fill: cancel ? "rgba(156,140,124,.25)" : kept ? color : "rgba(236,229,216,.5)", stroke: kept ? C.cocoa : C.line, "stroke-width": .8 }, g);
            SK.label(g, px + (CW - 3) / 2, y + 15, ch, { size: 14, color: kept ? C.ink : C.line });
            px += CW;
          }
        }
        function draw() {
          var f = ctx.frame, d = st.d;
          g.innerHTML = "";
          var a = Math.sqrt(1001), b = Math.sqrt(1000), tru = a - b;
          if (f === 0) {
            var t = rnd(1 / 3, d);
            SK.label(g, 270, 70, "計算機把 1/3 存成 " + d + " 位", { size: 15 });
            row(110, "1/3", 1 / 3, d, C.gold.f);
            row(170, "存下來", t, 30, C.gold.f, { dec: d });
            row(230, "× 3", rnd(3 * t, d), 30, C.orange.f, { dec: d });
            SK.label(g, 270, 310, "誤差 = 1 − " + rnd(3 * t, d) + " = " + (1 - rnd(3 * t, d)).toExponential(0).replace("e-", " × 10^-"), { size: 14, color: C.pink.s });
            read.innerHTML = SK.tex("3\\times" + t + "=" + rnd(3 * t, d), true);
            return;
          }
          var ar = rnd(a, d), br = rnd(b, d), m1 = rnd(ar - br, d), m2 = rnd(1 / rnd(ar + br, d), d);
          SK.label(g, 270, 24, d + " 位有效數字的計算機", { size: 15 });
          row(44, "√1001", a, d, C.orange.f);
          row(80, "√1000", b, d, C.blue.f);
          var same = 0, sa = a.toFixed(12), sb = b.toFixed(12);
          while (same < sa.length && sa[same] === sb[same]) same++;
          if (f >= 2) {
            s("line", { x1: 110, y1: 118, x2: 520, y2: 118, stroke: C.cocoa, "stroke-width": 1.4 }, g);
            row(126, "直接相減", tru, Math.max(0, d - (same - 1)), C.pink.f, { cancel: 3 });
            SK.label(g, 110 + 58, 172, "↑ 相同的位數互相抵消", { size: 12, color: C.soft, anchor: "start" });
          }
          if (f === 1) {
            var ulp = Math.pow(10, Math.floor(Math.log10(a)) - d + 1) / 2;
            SK.label(g, 270, 150, "保留 " + d + " 位 → 誤差最多 " + ulp.toPrecision(1) + "（最後一位的一半）", { size: 13, color: C.soft });
            // 放大看 √1001 附近：計算機的值代表一整個區間
            var ny = 300, lo = ar - ulp, hi = ar + ulp, pad = ulp * 1.6;
            var NX = function (v) { return 60 + (v - (lo - pad)) / (hi - lo + 2 * pad) * 420; };
            s("line", { x1: 40, y1: ny, x2: 500, y2: ny, class: "m-axis" }, g);
            s("rect", { x: NX(lo), y: ny - 14, width: NX(hi) - NX(lo), height: 28, fill: C.orange.f, stroke: C.orange.s }, g);
            [lo, ar, hi].forEach(function (v, i) {
              s("line", { x1: NX(v), y1: ny - 18, x2: NX(v), y2: ny + 18, stroke: C.cocoa, "stroke-width": i === 1 ? 2 : 1 }, g);
              SK.label(g, NX(v), ny + (i === 1 ? -32 : 34), String(Number(v.toPrecision(d + 1))), { size: 12, color: i === 1 ? C.orange.s : C.soft, bold: i === 1 });
            });
            s("circle", { cx: NX(a), cy: ny, r: 5, fill: C.ink }, g);
            SK.label(g, NX(a), ny + 62, "真值 √1001 在這個區間裡的某處", { size: 12, color: C.soft });
            SK.label(g, 270, 210, "螢幕上的 " + ar + " 其實代表：", { size: 14 });
          }
          // 下方：兩種算法的相對誤差（對數刻度）
          var gx = 110, gy = 250, gh = 150, gw = 400;
          var E = function (e) { var l = Math.log10(Math.max(e, 1e-12)); return gy + gh - (SK.clamp(l, -10, 0) + 10) / 10 * gh; };
          if (f >= 2) {
            s("line", { x1: gx, y1: gy, x2: gx, y2: gy + gh, class: "m-axis" }, g);
            s("line", { x1: gx, y1: gy + gh, x2: gx + gw, y2: gy + gh, class: "m-axis" }, g);
            [0, -2, -4, -6, -8, -10].forEach(function (p) { s("line", { x1: gx, y1: E(Math.pow(10, p)), x2: gx + gw, y2: E(Math.pow(10, p)), class: "m-grid" }, g); SK.label(g, gx - 8, E(Math.pow(10, p)), p === 0 ? "100%" : "10^" + p, { size: 10, anchor: "end", color: C.soft }); });
            SK.label(g, gx + gw / 2, gy + gh + 22, "有效位數 2 → 9", { size: 12, color: C.soft });
            SK.label(g, 60, gy - 14, "相對誤差", { size: 12, color: C.soft });
            var p1 = "", p2 = "";
            for (var k = 2; k <= 9; k++) {
              var x = gx + (k - 2) / 7 * gw;
              var ak = rnd(a, k), bk = rnd(b, k);
              var e1 = Math.abs(rnd(ak - bk, k) - tru) / tru, e2 = Math.abs(rnd(1 / rnd(ak + bk, k), k) - tru) / tru;
              p1 += (k === 2 ? "M" : "L") + x + " " + E(e1);
              p2 += (k === 2 ? "M" : "L") + x + " " + E(e2);
              if (k === d) s("line", { x1: x, y1: gy, x2: x, y2: gy + gh, stroke: C.green.s, "stroke-dasharray": "3 4" }, g);
            }
            s("path", { d: p1, fill: "none", stroke: C.pink.s, "stroke-width": 2.4 }, g);
            SK.label(g, gx + gw - 4, gy + 10, "直接相減", { size: 12, color: C.pink.s, anchor: "end" });
            if (f >= 3) {
              s("path", { d: p2, fill: "none", stroke: C.green.s, "stroke-width": 2.4 }, g);
              SK.label(g, gx + gw - 4, gy + 26, "有理化後", { size: 12, color: C.green.s, anchor: "end" });
            }
          }
          var r1 = Math.abs(m1 - tru) / tru * 100, r2 = Math.abs(m2 - tru) / tru * 100;
          read.innerHTML = SK.tex("\\text{真值 }0.0158074\\ldots", true) +
            (f >= 2 ? SK.tex("\\text{相減：}" + ar + "-" + br + "=" + m1 + "\\ \\ (\\text{誤差 }" + SK.fmt(r1, 2) + "\\%)", true) : "") +
            (f >= 3 ? SK.tex("\\text{有理化：}1\\div" + rnd(ar + br, d) + "=" + m2 + "\\ \\ (\\text{誤差 }" + SK.fmt(r2, 3) + "\\%)", true) : "");
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "0.1 + 0.2 ≠ 0.3？", icon: "sparkle",
        html: "電腦用二進位存數字。$0.1$ 在二進位是無限循環小數（就像 $\\tfrac13$ 在十進位），只能存個近似值。所以很多程式語言算 $0.1+0.2$ 會得到 $0.30000000000000004$。這不是電腦壞掉，而是有限位數的必然結果。" },
      { title: "有效位數說出測量有多準", icon: "leaf",
        html: "寫「長 12.0 cm」和「長 12 cm」不一樣：前者代表量到 0.1 cm，真值在 11.95 到 12.05 之間。計算時，答案的精確度不會超過最不精確的那個資料。把 $12.0\\times3.1$ 寫成 $37.2$ 比 $37.20$ 誠實。" }
    ],

    challenges: [
      { q: "用 4 位有效數字的計算機算 $\\dfrac{1}{3}+\\dfrac{1}{3}+\\dfrac{1}{3}$，結果是多少？", idea: "每個 $\\tfrac13$ 存成 $0.3333$，加起來 $0.9999$。先相加再除（$\\tfrac{1+1+1}{3}$）就不會有這個問題：運算順序也會影響誤差。" },
      { q: "解 $x^2-100x+1=0$ 的較小根，用公式 $\\dfrac{100-\\sqrt{9996}}{2}$ 在 4 位計算機上算，會發生什麼事？怎麼補救？", hint: "$\\sqrt{9996}\\approx99.98$，和 100 很接近。",
        idea: "$\\tfrac{100-99.98}{2}=0.01$，但真值約 $0.010001$……看似還好，換成 $x^2-1000x+1$ 就會完全失準。補救：兩根乘積是 1，先算較大根 $\\approx99.99$，再用 $\\tfrac{1}{99.99}$ 得較小根。" },
      { q: "$\\left(1+10^{-10}\\right)^{10^{10}}$ 應該很接近 $e\\approx2.718$，為什麼有些計算機會算出 1？", idea: "$1+10^{-10}$ 超出計算機的有效位數，被存成 1，而 $1$ 的任何次方都是 1。差距在第一步就被捨掉了。" }
    ],

    where: {
      codes: [["N-10-5", "數值計算的誤差：認識計算機的有限性，察覺誤差的發生，並取適當的有效位數"]],
      exam: "10 年級<b>共同必修</b>。大考標為 ★＃（不直接命題、可在素養題情境出現）。",
      stop: "重點是「察覺」：知道捨入會發生、知道相近數相減會放大誤差、會取合理的有效位數。誤差傳播公式與正式的數值分析不是高中範圍。"
    }
  });
})();
