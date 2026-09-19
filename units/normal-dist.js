/* 補充單元：常態分布（直觀） */
(function () {
  var C = SK.C, s = SK.s;
  function comb(n, k) { var r = 1; for (var i = 1; i <= k; i++) r = r * (n - k + i) / i; return r; }

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 220, "身高分布呈鐘形");
    var d = "", X = function (x) { return 40 + x * 32; }, Y = function (y) { return 190 - y * 150; };
    for (var x = 0; x <= 10; x += .05) d += (x ? "L" : "M") + X(x) + " " + Y(Math.exp(-(x - 5) * (x - 5) / 3));
    s("path", { d: d + " L" + X(10) + " 190 L" + X(0) + " 190Z", fill: C.blue.f, stroke: C.blue.s, "stroke-width": 2 }, svg);
    s("line", { x1: 30, y1: 190, x2: 380, y2: 190, stroke: C.cocoa, "stroke-width": 1.2 }, svg);
    SK.label(svg, 200, 208, "身高、測量誤差、考試分數……為什麼常常長這樣？", { size: 12, color: C.soft });
  }

  SK.mountUnit({
    slug: "normal-dist",
    en: "Why so many things are bell-shaped",
    formula: "\\text{很多獨立的小影響相加}\\ \\Longrightarrow\\ \\text{鐘形分布},\\qquad \\mu\\pm\\sigma\\approx68\\%,\\ \\mu\\pm2\\sigma\\approx95\\%",

    hook: {
      html: "全校學生的身高、同一個物體量很多次的結果、大型考試的分數，畫成直方圖常常是中間高、兩邊低的「鐘形」。",
      ask: "這些東西彼此毫無關係，為什麼會長成同一個形狀？",
      visual: hookVisual
    },

    guess: {
      q: "丟 100 次公平硬幣，正面次數落在 40 到 60 之間的機率大約是？",
      options: [
        { t: "約 50%", common: true, explain: "40 到 60 看起來只是「中間一段」，猜一半很自然。但正面次數會高度集中在 50 附近，實際的機率高很多。" },
        { t: "約 95%", truth: true, explain: "平均 50、標準差 5。40 到 60 是平均 $\\pm2$ 個標準差，鐘形分布在這個範圍內大約占 95%（精確的二項分布值約 96.5%）。" },
        { t: "約 20%", explain: "恰好 50 次的機率只有約 8%，但 40 到 60 包含了 21 種結果，而且都是最常出現的那些。" },
        { t: "100%", explain: "很接近，但還是有小機率出現 35 次或 65 次這種比較極端的結果。" }
      ]
    },

    derive: {
      intro: "每一次「小影響」是往右或往左一步（丟一次硬幣）。拖動滑桿改變加起來的次數 $n$。",
      tall: true,
      frames: [
        { cap: "只有一個影響（$n=1$）：兩種結果，長條一樣高，一點都不像鐘。", tex: "n=1" },
        { cap: "把很多個獨立的小影響<b>加起來</b>（二項分布）：$n$ 越大，形狀越平滑，越來越像一個對稱的鐘。", tex: "X=X_1+X_2+\\cdots+X_n" },
        { cap: "把橫軸標準化成「離平均幾個標準差」，不同 $n$ 的形狀幾乎疊在一起（灰藍曲線），這條曲線叫做<b>常態分布</b>。", tex: "z=\\frac{X-\\mu}{\\sigma}" },
        { cap: "鐘形分布有一個好記的規則：平均 $\\pm1$ 個標準差內約 68%，$\\pm2$ 個標準差內約 95%。", tex: "\\mu\\pm\\sigma:\\ 68\\%,\\qquad \\mu\\pm2\\sigma:\\ 95\\%" }
      ],
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 520, 400, "二項分布趨近鐘形");
        var g = s("g", {}, svg);
        var st = { n: 12 };
        var read = SK.h("div", { class: "readout" });
        var sl = SK.slider({ label: "$n$", min: 1, max: 60, value: st.n, onInput: function (v) { st.n = v; draw(); } });
        ctx.sliders.appendChild(sl.el); ctx.extra.appendChild(read);
        function draw() {
          var f = ctx.frame, n = f === 0 ? 1 : st.n, mu = n / 2, sd = Math.sqrt(n) / 2;
          var Xz = function (z) { return 260 + z * 70; }, base = 340, H = 260;
          g.innerHTML = "";
          sl.el.style.display = f === 0 ? "none" : "";
          s("line", { x1: 20, y1: base, x2: 500, y2: base, stroke: C.cocoa, "stroke-width": 1.3 }, g);
          // 以「每單位 z 的機率密度」畫長條：高度 = P(X=k) * sd
          var maxDen = .45;
          for (var k = 0; k <= n; k++) {
            var z = (k - mu) / Math.max(sd, .5), w = 70 / Math.max(sd, .5), p = comb(n, k) * Math.pow(.5, n), h = p * Math.max(sd, .5) / maxDen * H;
            var inBand = f === 3 && Math.abs(k - mu) <= 2 * sd + 1e-9;
            if (Xz(z) < 10 || Xz(z) > 510) continue;
            s("rect", { x: Xz(z) - w * .45, y: base - h, width: w * .9, height: h, fill: inBand ? C.mint.f : C.orange.f, stroke: inBand ? C.green.s : C.orange.s, "stroke-width": .8 }, g);
          }
          if (f >= 2) {
            var d = "";
            for (var zz = -3.5; zz <= 3.5; zz += .05) d += (d ? "L" : "M") + Xz(zz) + " " + (base - Math.exp(-zz * zz / 2) / Math.sqrt(2 * Math.PI) / maxDen * H);
            s("path", { d: d, fill: "none", stroke: C.blue.s, "stroke-width": 2.6 }, g);
          }
          [-3, -2, -1, 0, 1, 2, 3].forEach(function (zt) { SK.label(g, Xz(zt), base + 16, zt === 0 ? "μ" : (zt > 0 ? "+" : "−") + Math.abs(zt) + "σ", { size: 12, color: C.soft }); });
          if (f === 3) {
            var inside = 0;
            for (var k2 = 0; k2 <= n; k2++) if (Math.abs(k2 - mu) <= 2 * sd + 1e-9) inside += comb(n, k2) * Math.pow(.5, n);
            SK.label(g, 260, 40, "μ ± 2σ 之內（綠色）≈ " + SK.fmt(inside * 100, 1) + "%", { size: 14, color: C.green.s });
          }
          read.innerHTML = SK.tex("n=" + n + ":\\quad \\mu=" + SK.fmt(mu, 1) + ",\\ \\sigma=" + SK.fmt(sd, 2), true);
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "民調的「誤差範圍」從哪裡來", icon: "sparkle",
        html: "隨機訪問 $n$ 個人，支持率的估計值會在真實值附近波動，波動的標準差大約是 $\\dfrac{0.5}{\\sqrt n}$。$n=1000$ 時約 1.6%，兩倍就是約 3.1%，這就是新聞常說的「誤差 ±3 個百分點、信心水準 95%」。注意 $\\sqrt n$：想把誤差減半，要訪問四倍的人。" },
      { title: "資料的分布 vs. 平均的分布", icon: "leaf",
        html: "要小心分清楚兩件事：一群人的<b>收入</b>本身通常不是鐘形（少數人非常高），但如果反覆隨機抽 100 人、算他們的<b>平均收入</b>，這些平均值的分布會接近鐘形。不是所有資料都是常態分布，但「很多獨立的量加起來或平均起來」常常是。" }
    ],

    challenges: [
      { q: "丟 400 次公平硬幣，正面次數大約會落在哪個範圍內（95% 的把握）？", idea: "$\\mu=200$、$\\sigma=\\sqrt{400}/2=10$，大約在 180 到 220 之間。" },
      { q: "某次考試平均 60 分、標準差 10 分，分數近似鐘形。考 80 分大約贏過多少比例的人？", hint: "80 分是平均加幾個標準差？$\\mu\\pm2\\sigma$ 內約 95%，剩下的 5% 平均分在兩邊。",
        idea: "80 分是 $+2\\sigma$。高於它的約 2.5%，所以大約贏過 97.5% 的人。這和「標準化」單元的 $z$ 分數是同一個想法。" }
    ],

    where: {
      codes: [["D-10-2", "（接點）數據分析：標準差、標準化"], ["D-12甲-1", "（接點）離散型隨機變數"], ["D-12甲-2", "（接點）二項分布"]],
      exam: "<b>課綱外補充</b>：數甲的隨機變數只處理離散型，常態分布與信賴區間都<b>不在</b>現行正式內容裡。它是統計素養很重要的下一站，所以放在這裡欣賞。",
      stop: "只用圖形與模擬說明中心、散布與抽樣波動；不要把常態分布的公式計算、查表或檢定程序偽裝成必修內容。"
    }
  });
})();
