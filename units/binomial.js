/* 單元：二項分布（高爾頓板） */
(function () {
  var C = SK.C, s = SK.s;
  function comb(n, k) { var r = 1; for (var i = 1; i <= k; i++) r = r * (n - k + i) / i; return r; }
  function pmf(n, p, k) { return comb(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k); }

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 250, "釘板上的小球");
    for (var r = 0; r < 6; r++) for (var j = 0; j <= r; j++) s("circle", { cx: 200 + (j - r / 2) * 36, cy: 40 + r * 28, r: 4, fill: C.cocoa }, svg);
    var path = [0, 1, 1, 2, 2, 3], x = 200, y = 22;
    path.forEach(function (k, r) { var nx = 200 + (k - (r + 1) / 2) * 36 + 18 - 18, ny = 40 + r * 28 + 14; s("line", { x1: x, y1: y, x2: nx, y2: ny, stroke: C.orange.s, "stroke-width": 1.8, "stroke-dasharray": "3 3" }, svg); x = nx; y = ny; });
    s("circle", { cx: x, cy: y + 10, r: 7, fill: C.orange.f, stroke: C.cocoa }, svg);
    SK.label(svg, 200, 236, "每碰一根釘子，向左向右各一半機會", { size: 13, color: C.soft });
  }

  SK.mountUnit({
    slug: "binomial",
    en: "Many independent yes/no trials",
    formula: "P(X=\\co{k})=C^{\\,n}_{\\co{k}}\\,\\cb{p}^{\\co{k}}(1-\\cb{p})^{n-\\co{k}},\\qquad E(X)=np,\\ \\ \\sigma=\\sqrt{np(1-p)}",

    hook: {
      html: "一顆小球從釘板頂端落下，每碰到一根釘子，就隨機往左或往右彈。落到底部時，會停在某一個格子裡。",
      ask: "丟很多顆球，底部各格的球會怎麼堆？為什麼中間比較多？",
      visual: hookVisual
    },

    guess: {
      q: "公平的硬幣丟 10 次，<b>恰好</b> 5 次正面的機率大約是？",
      options: [
        { t: "50%", common: true, explain: "「正面機率一半，所以一半的次數最可能」這個直覺對了一半：5 次確實是最可能的結果，但「恰好 5 次」只是 11 種可能之一，機率沒有那麼高。" },
        { t: "約 25%", truth: true, explain: "$C^{10}_5\\left(\\tfrac12\\right)^{10}=\\dfrac{252}{1024}\\approx24.6\\%$。雖然是最可能的結果，但四次裡大約只有一次會剛好 5 正 5 反。" },
        { t: "約 10%", explain: "比 10% 高一些。11 種結果裡，中間的 5 占的比例最大，大約四分之一。" },
        { t: "幾乎一定", explain: "丟 10 次常常會得到 4、6 次，甚至 3、7 次正面，所以恰好 5 次遠遠不是「一定」。" }
      ]
    },

    derive: {
      intro: "上方是釘板，下方是每一格的機率。拖動滑桿改變次數 $n$ 與每次往右（成功）的機率 $p$，也可以按按鈕丟球模擬。",
      tall: true,
      frames: [
        { cap: "一次<b>伯努力試驗</b>：只有成功（往右）和失敗（往左）兩種結果，成功機率 $p$。", tex: "P(\\text{成功})=p,\\quad P(\\text{失敗})=1-p" },
        { cap: "重複 $n$ 次<b>獨立</b>試驗。小球落到第 $k$ 格，代表 $n$ 次中恰好成功 $k$ 次。", tex: "X=\\text{成功次數},\\quad X=0,1,\\dots,n" },
        { cap: "走到第 $k$ 格的路徑有 $C^n_k$ 條（從 $n$ 次裡挑 $k$ 次往右），每一條的機率都是 $p^k(1-p)^{n-k}$。", tex: "P(X=k)=\\underbrace{C^n_k}_{\\text{路徑數}}\\ \\underbrace{p^k(1-p)^{n-k}}_{\\text{每條路徑的機率}}" },
        { cap: "按「丟 300 顆球」，看模擬的直方圖（蜜桃色）怎麼貼近理論的機率（灰藍線）。", tex: "\\text{相對次數}\\ \\approx\\ P(X=k)" },
        { cap: "期望值是 $np$（平衡點），標準差是 $\\sqrt{np(1-p)}$。$n$ 越大，分布越寬，但相對於 $n$ 越來越集中。", tex: "E(X)=\\co{np},\\qquad \\sigma=\\cb{\\sqrt{np(1-p)}}" }
      ],
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 520, 460, "高爾頓板與二項分布");
        var g = s("g", {}, svg);
        var st = { n: 8, p: .5 }, hist = null, balls = 0;
        var read = SK.h("div", { class: "readout" });
        ctx.sliders.appendChild(SK.slider({ label: "$n$", min: 1, max: 16, value: st.n, onInput: function (v) { st.n = v; hist = null; draw(); } }).el);
        ctx.sliders.appendChild(SK.slider({ label: "$p$", min: .05, max: .95, step: .05, value: st.p, color: "blue", onInput: function (v) { st.p = v; hist = null; draw(); } }).el);
        var btn = SK.h("button", { class: "btn small", type: "button" }, "丟 300 顆球");
        btn.onclick = function () {
          hist = hist || new Array(st.n + 1).fill(0);
          for (var b = 0; b < 300; b++) { var k = 0; for (var i = 0; i < st.n; i++) if (Math.random() < st.p) k++; hist[k]++; }
          balls = hist.reduce(function (a, c) { return a + c; }, 0);
          if (ctx.frame < 3) SK.players.forEach(function (pl) { if (pl.root.contains(ctx.stage)) pl.go(3); });
          draw();
        };
        ctx.sliders.appendChild(btn); ctx.extra.appendChild(read);
        function draw() {
          var f = ctx.frame, n = st.n, p = st.p, gap = Math.min(30, 440 / (n + 1));
          g.innerHTML = "";
          // 釘板
          var rows = Math.min(n, 12), rh = Math.min(16, 180 / Math.max(rows, 1));
          for (var r = 0; r < rows; r++) for (var j = 0; j <= r; j++) s("circle", { cx: 260 + (j - r / 2) * gap, cy: 22 + r * rh, r: 2.6, fill: f >= 1 || r === 0 ? C.cocoa : "#DDD3C4" }, g);
          if (n > 12) SK.label(g, 260, 22 + rows * rh + 4, "（釘板只畫前 12 排）", { size: 11, color: C.soft });
          if (f === 0) SK.label(g, 330, 30, "右：p　左：1 − p", { size: 13, anchor: "start", color: C.orange.s });
          // 分布
          var base = 420, H = 190, probs = [], maxP = 0;
          for (var k = 0; k <= n; k++) { probs.push(pmf(n, p, k)); maxP = Math.max(maxP, probs[k]); }
          var sc = H / Math.max(maxP, .05), X = function (k) { return 260 + (k - n / 2) * gap; };
          s("line", { x1: 30, y1: base, x2: 490, y2: base, stroke: C.cocoa, "stroke-width": 1.3 }, g);
          for (var k2 = 0; k2 <= n; k2++) {
            if (hist && f >= 3) { var hh = hist[k2] / balls * sc; s("rect", { x: X(k2) - gap * .4, y: base - hh, width: gap * .8, height: hh, fill: C.orange.f, stroke: C.orange.s, "stroke-width": .8 }, g); }
            else s("rect", { x: X(k2) - gap * .4, y: base - probs[k2] * sc, width: gap * .8, height: probs[k2] * sc, fill: f >= 2 ? C.blue.f : "rgba(221,211,196,.5)", stroke: C.blue.s, "stroke-width": .8 }, g);
            if (n <= 12 || k2 % 2 === 0) SK.label(g, X(k2), base + 14, String(k2), { size: 11, color: C.soft });
          }
          if (hist && f >= 3) {
            var d = "";
            for (var k3 = 0; k3 <= n; k3++) d += (k3 ? "L" : "M") + X(k3) + " " + (base - probs[k3] * sc);
            s("path", { d: d, fill: "none", stroke: C.blue.s, "stroke-width": 2 }, g);
          }
          if (f >= 4) {
            var mu = n * p, sd = Math.sqrt(n * p * (1 - p));
            s("rect", { x: X(mu - sd), y: base + 22, width: X(mu + sd) - X(mu - sd), height: 10, rx: 5, fill: C.mint.f, stroke: C.green.s }, g);
            s("path", { d: "M" + X(mu) + " " + (base + 2) + " l-10 18 h20z", fill: C.green.f, stroke: C.cocoa }, g);
            SK.label(g, X(mu), base + 44, "μ = " + SK.fmt(mu, 2) + "，σ ≈ " + SK.fmt(sd, 2), { size: 12, color: C.green.s });
          }
          var kk = Math.round(n * p);
          read.innerHTML = SK.tex("n=" + n + ",\\ p=" + SK.fmt(p, 2) + ":\\quad P(X=" + kk + ")=C^{" + n + "}_{" + kk + "}(" + SK.fmt(p, 2) + ")^{" + kk + "}(" + SK.fmt(1 - p, 2) + ")^{" + (n - kk) + "}\\approx" + SK.fmt(pmf(n, p, kk), 4), true) +
            (hist && f >= 3 ? SK.tex("\\text{已丟 }" + balls + "\\text{ 顆}", true) : "");
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "和巴斯卡三角形是同一張圖", icon: "sparkle",
        html: "$p=\\frac12$ 時，每條路徑的機率都一樣，所以各格的機率就正比於路徑數 $C^n_k$，也就是巴斯卡三角形的第 $n$ 列。「乘法公式」單元裡 $(a+b)^n$ 的係數、組合數、釘板上的小球，全都是同一件事：$$(p+q)^n=\\sum_{k=0}^nC^n_kp^kq^{n-k}=1.$$ 二項分布的「二項」，就是這個二項式展開。" },
      { title: "期望值 $np$ 為什麼這麼簡單？", icon: "leaf",
        html: "把 $X$ 拆成 $n$ 次試驗各自的成功次數相加：$X=X_1+X_2+\\cdots+X_n$，每個 $X_i$ 只會是 0 或 1，期望值是 $p$、變異數是 $p(1-p)$。期望值可以相加，獨立時變異數也可以相加，所以 $E(X)=np$、$\\operatorname{Var}(X)=np(1-p)$，完全不用去算那一長串的 $\\sum kC^n_kp^k(1-p)^{n-k}$。" }
    ],

    challenges: [
      { q: "投籃命中率 0.7，投 10 次全部命中的機率是多少？恰好進 7 球呢？", idea: "全中：$0.7^{10}\\approx2.8\\%$。恰好 7 球：$C^{10}_7(0.7)^7(0.3)^3\\approx26.7\\%$，是最可能的結果，但也只有約四分之一。" },
      { q: "丟公平硬幣 100 次，正面次數的期望值和標準差是多少？得到 60 次以上算不算常見？", idea: "$\\mu=50$、$\\sigma=\\sqrt{25}=5$。60 次在平均之上 2 個標準差，已經不太常見，這就是下一單元「合理性檢定」的想法。" },
      { q: "什麼情況<b>不能</b>用二項分布？舉一個例子。", idea: "試驗不獨立或每次機率會變時就不行。例如從 5 紅 5 白的袋子<b>不放回</b>地抽 3 顆，每抽一顆，下一次的機率就改變了。" }
    ],

    where: {
      codes: [["D-12甲-2", "二項分布與幾何分布：兩分布的性質與參數，應用於事件發生機率的合理性檢定"], ["D-12甲-1", "伯努力試驗與重複試驗"]],
      exam: "12 年級<b>選修數學甲</b>，分科測驗數甲的範圍。要會判斷情境、計算機率，以及期望值與標準差。",
      stop: "只處理離散的二項分布，不用常態分布去近似；檢定只作概念理解。高一「組合」與「二項式定理」是它的前置知識。"
    }
  });
})();
