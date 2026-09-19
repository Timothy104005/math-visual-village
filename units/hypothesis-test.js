/* 單元：合理性檢定（直觀的假設檢定） */
(function () {
  var C = SK.C, s = SK.s;
  function comb(n, k) { var r = 1; for (var i = 1; i <= k; i++) r = r * (n - k + i) / i; return r; }
  function pmf(n, p, k) { return comb(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k); }
  function tail(n, p, k) { var t = 0; for (var j = k; j <= n; j++) t += pmf(n, p, j); return t; }

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 220, "一枚硬幣丟 20 次，出現 16 次正面");
    var seq = "正正反正正正正反正正正正反正正正正反正正";
    for (var i = 0; i < 20; i++) {
      var x = 40 + (i % 10) * 34, y = 60 + Math.floor(i / 10) * 50, h = seq[i] === "正";
      s("circle", { cx: x, cy: y, r: 14, fill: h ? C.orange.f : "#EDE6DA", stroke: C.cocoa, "stroke-width": 1.2 }, svg);
      SK.label(svg, x, y, seq[i], { size: 12 });
    }
    SK.label(svg, 200, 180, "20 次裡有 16 次正面", { size: 15 });
    SK.label(svg, 200, 204, "這枚硬幣公平嗎？", { size: 13, color: C.soft });
  }

  SK.mountUnit({
    slug: "hypothesis-test",
    en: "Is this result too surprising to be chance?",
    formula: "\\text{假設 }\\co{p=p_0}\\ \\Rightarrow\\ P(X\\ge x_{\\text{觀察}})\\ \\text{很小}\\ \\Rightarrow\\ \\text{懷疑假設}",

    hook: {
      html: "朋友說他的硬幣是公平的。你丟了 20 次，出現了 16 次正面。",
      ask: "這只是運氣好，還是硬幣真的有問題？「有多不尋常」才算不尋常？",
      visual: hookVisual
    },

    guess: {
      q: "公平硬幣丟 20 次，出現 16 次<b>或更多</b>正面的機率大約是？",
      options: [
        { t: "約 20%", common: true, explain: "16 次看起來只比 10 次多一些，直覺上不算太罕見。但真的算下來，這種極端的結果比直覺少很多。" },
        { t: "約 0.6%", truth: true, explain: "$P(X\\ge16)=\\dfrac{C^{20}_{16}+C^{20}_{17}+\\cdots+C^{20}_{20}}{2^{20}}\\approx0.0059$。如果硬幣真的公平，大約 170 次裡才會發生 1 次，你有理由懷疑它。" },
        { t: "約 5%", explain: "5% 常被當作「不尋常」的門檻，所以很多人會往這裡猜。實際的機率比 5% 還小很多。" },
        { t: "0，公平硬幣不可能這樣", explain: "公平的硬幣也有可能丟出 16 次正面，只是機率很小。檢定永遠不能「證明」硬幣作弊，只能說「這麼極端的結果，用公平來解釋很勉強」。" }
      ]
    },

    derive: {
      intro: "先<b>假設</b>硬幣公平（$p_0=0.5$），畫出 $n$ 次中正面次數的二項分布，再看觀察到的結果落在哪裡。拖動滑桿改變次數與觀察值。",
      tall: true,
      frames: [
        { cap: "第一步：先<b>假設</b>「硬幣是公平的」，也就是每次正面機率 $p_0=0.5$。這是我們要檢驗的說法。", tex: "\\text{假設：}\\ p=\\co{p_0}=0.5" },
        { cap: "在這個假設下，$n$ 次中正面次數 $X$ 服從二項分布。大部分的結果會落在中間附近。", tex: "X\\sim B(n,\\ 0.5)" },
        { cap: "標出觀察到的結果（玫瑰色線）。問：如果假設是真的，出現<b>這麼極端或更極端</b>的結果，機率有多大？", tex: "P(X\\ge x_{\\text{觀察}}\\mid p=0.5)" },
        { cap: "把右尾那些長條加起來（玫瑰色）。機率很小，代表「用公平來解釋這個結果很勉強」。", tex: "\\text{右尾機率}=\\sum_{k\\ge x}C^n_k(0.5)^n" },
        { cap: "約定一個門檻（常用 5%）：右尾機率比門檻小，就說結果「不合理」，懷疑原本的假設；比門檻大，就說「沒有足夠證據」懷疑它。這就是<b>合理性檢定</b>。", tex: "\\text{右尾機率}<5\\%\\ \\Rightarrow\\ \\text{懷疑}\\ p=0.5" }
      ],
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 520, 420, "二項分布與觀察值的右尾");
        var g = s("g", {}, svg);
        var st = { n: 20, x: 16 };
        var read = SK.h("div", { class: "readout" });
        var slX;
        ctx.sliders.appendChild(SK.slider({ label: "$n$", min: 5, max: 40, value: st.n, onInput: function (v) { st.n = v; if (st.x > v) { st.x = v; } slX.input.max = v; slX.set(st.x, true); draw(); } }).el);
        slX = SK.slider({ label: "觀察", min: 0, max: st.n, value: st.x, color: "blue", fmt: function (v) { return v + " 次正面"; }, onInput: function (v) { st.x = v; draw(); } });
        ctx.sliders.appendChild(slX.el); ctx.extra.appendChild(read);
        function draw() {
          var f = ctx.frame, n = st.n, x = Math.min(st.x, n), gap = 460 / (n + 1), base = 360;
          var X = function (k) { return 30 + (k + .5) * gap; }, maxP = pmf(n, .5, Math.round(n / 2)), sc = 280 / maxP;
          g.innerHTML = "";
          s("line", { x1: 20, y1: base, x2: 500, y2: base, stroke: C.cocoa, "stroke-width": 1.3 }, g);
          if (f === 0) {
            SK.label(g, 260, 180, "假設：這枚硬幣是公平的", { size: 18 });
            SK.label(g, 260, 212, "（先相信它，再看證據）", { size: 13, color: C.soft });
            read.innerHTML = SK.tex("p_0=0.5", true);
            return;
          }
          for (var k = 0; k <= n; k++) {
            var pr = pmf(n, .5, k), inTail = f >= 3 && k >= x;
            s("rect", { x: X(k) - gap * .4, y: base - pr * sc, width: gap * .8, height: pr * sc, fill: inTail ? C.pink.f : C.blue.f, stroke: inTail ? C.pink.s : C.blue.s, "stroke-width": .8 }, g);
            if (n <= 20 || k % 5 === 0) SK.label(g, X(k), base + 14, String(k), { size: 10, color: C.soft });
          }
          var t = tail(n, .5, x);
          if (f >= 2) {
            s("line", { x1: X(x) - gap / 2, y1: 40, x2: X(x) - gap / 2, y2: base, stroke: C.pink.s, "stroke-width": 2, "stroke-dasharray": "5 4" }, g);
            SK.label(g, X(x) - gap / 2 + (x > n * .7 ? -6 : 6), 34, "觀察：" + x + " 次", { size: 13, anchor: x > n * .7 ? "end" : "start", color: C.pink.s });
          }
          if (f >= 4) {
            var verdict = t < .05;
            s("rect", { x: 30, y: 52, width: 230, height: 34, rx: 8, fill: verdict ? C.pink.f : C.mint.f, stroke: C.cocoa, "stroke-width": 1 }, g);
            SK.label(g, 145, 69, verdict ? "右尾 < 5%：懷疑硬幣不公平" : "右尾 ≥ 5%：證據不足", { size: 13 });
          }
          read.innerHTML = SK.tex("n=" + n + ":\\ E(X)=" + SK.fmt(n / 2, 1) + ",\\ \\sigma=" + SK.fmt(Math.sqrt(n) / 2, 2) + (f >= 3 ? ",\\quad P(X\\ge" + x + ")\\approx" + (t < .001 ? t.toExponential(1).replace("e", "\\times10^{") + "}" : SK.fmt(t, 4)) : ""), true);
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "檢定能說什麼，不能說什麼", icon: "sparkle",
        html: "右尾機率很小，<b>不代表</b>「硬幣作弊的機率很大」，它說的是：「如果硬幣公平，會看到這麼極端結果的機率很小」。這和「條件機率」單元的提醒一樣：$P(\\text{極端結果}\\mid\\text{公平})$ 和 $P(\\text{公平}\\mid\\text{極端結果})$ 是兩件不同的事。另外，右尾機率大也不代表硬幣一定公平，只是「沒有足夠證據」懷疑它。" },
      { title: "用模擬代替公式", icon: "leaf",
        html: "如果不想算二項分布，可以用試算表或程式模擬：讓電腦「丟」一萬次「20 次公平硬幣」，數數看有幾次出現 16 次以上的正面。大約會有 60 次左右，比例約 0.6%，和公式的結果一致。模擬是理解檢定最直觀的方式，課綱也鼓勵用工具減少繁重的手算。" }
    ],

    challenges: [
      { q: "丟 20 次得到 13 次正面，右尾機率大約是多少？你會懷疑硬幣嗎？", idea: "$P(X\\ge13)\\approx13\\%$，比 5% 大，證據不足，不應該因此懷疑硬幣。13 次只比期望值 10 多約 1.3 個標準差。" },
      { q: "同樣是「65% 正面」，丟 20 次得到 13 次，和丟 200 次得到 130 次，結論一樣嗎？", hint: "在上面的圖把 $n$ 拉到 40，看看 26 次正面的右尾機率。再想想 $n=200$ 時標準差是多少。",
        idea: "不一樣。$n=200$ 時標準差約 7.1，130 比 100 多了 4 個標準差以上，右尾機率極小，強烈懷疑硬幣。樣本越大，同樣的比例越有說服力。" },
      { q: "某藥廠宣稱新藥有 90% 的有效率。試用 20 人，只有 14 人有效。你怎麼用今天的方法評估這個宣稱？", idea: "假設 $p_0=0.9$，看<b>左尾</b>：$P(X\\le14)$，其中 $X\\sim B(20,0.9)$，大約 1.1%，比 5% 小，有理由懷疑 90% 的宣稱。檢定的方向要看「什麼樣的結果會讓你懷疑」。" }
    ],

    where: {
      codes: [["D-12甲-2", "二項分布與幾何分布：應用於事件發生機率的合理性檢定"]],
      exam: "12 年級<b>選修數學甲</b>，分科測驗數甲的範圍。課綱要求至少認識一個直觀的假設檢定例子。",
      stop: "檢定只作概念理解，不進入統計課程的第一型、第二型錯誤等正式推論架構，也不用常態分布去近似。先說清楚「在假設下，這麼極端的結果有多罕見」就夠了。"
    }
  });
})();
