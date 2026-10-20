/* 單元：標準化與相關係數 */
(function () {
  var C = SK.C, s = SK.s;

  /* 固定種子的亂數，讓每次看到的班級資料一樣 */
  function rng(seed) { return function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }
  function gauss(r) { var u = r(), v = r(); return Math.sqrt(-2 * Math.log(u + 1e-12)) * Math.cos(2 * Math.PI * v); }
  function mean(a) { return a.reduce(function (p, q) { return p + q; }, 0) / a.length; }
  function sd(a) { var m = mean(a); return Math.sqrt(mean(a.map(function (x) { return (x - m) * (x - m); }))); }
  function corr(xs, ys) {
    var mx = mean(xs), my = mean(ys), sx = sd(xs), sy = sd(ys);
    return mean(xs.map(function (x, i) { return (x - mx) / sx * (ys[i] - my) / sy; }));
  }

  function hookVisual(el) {
    var svg = SK.svg(el, 420, 220, "兩科成績單");
    [["數學", 80, "全班平均 70　標準差 10", C.orange], ["英文", 70, "全班平均 55　標準差 5", C.blue]].forEach(function (r, i) {
      var y = 40 + i * 80;
      s("rect", { x: 40, y: y, width: 340, height: 60, rx: 10, fill: r[3].f, stroke: C.cocoa, "stroke-width": 1.2 }, svg);
      SK.label(svg, 70, y + 30, r[0], { size: 16, anchor: "start" });
      SK.label(svg, 150, y + 30, r[1] + " 分", { size: 20, anchor: "start" });
      SK.label(svg, 366, y + 30, r[2], { size: 12, anchor: "end", color: C.soft });
    });
    SK.label(svg, 210, 208, "哪一科考得比較「好」？", { size: 14, color: C.soft });
  }

  SK.mountUnit({
    slug: "standardize",
    en: "Compare on the same ruler",
    formula: "z=\\frac{x-\\co{\\mu}}{\\cb{\\sigma}},\\qquad r=\\frac1n\\sum z_{x,i}\\,z_{y,i}",

    hook: {
      html: "小明數學考 80 分、英文考 70 分。數學全班平均 70、標準差 10；英文全班平均 55、標準差 5。",
      ask: "只看分數，數學比較高。但如果看「在班上的相對位置」，哪一科其實考得比較好？",
      visual: hookVisual
    },

    guess: {
      q: "小明的哪一科表現比較突出？",
      options: [
        { t: "數學，因為 80 > 70", common: true, explain: "直接比原始分數是最自然的做法。但兩科的難度和分數分散程度不同：數學 80 分只比平均高 1 個標準差；英文 70 分卻比平均高了 3 個標準差！" },
        { t: "英文", truth: true, explain: "數學 $z=\\frac{80-70}{10}=1$，英文 $z=\\frac{70-55}{5}=3$。英文在班上遠遠領先，是非常突出的表現。" },
        { t: "一樣好", explain: "兩科都高於平均，這點沒錯！但高出的「程度」不一樣，用標準差當尺來量，差很多。" },
        { t: "不同科目不能比", explain: "直接比原始分數確實不公平！標準化就是為了解決這個問題：把兩科都換成「離平均幾個標準差」，就能放在同一把尺上比。" }
      ]
    },

    derive: {
      intro: "一個 20 人的班級。前三步看「標準化」，後三步看兩科之間的「相關」。拖動滑桿改變兩科的關聯強度。",
      tall: true,
      frames: [
        { cap: "兩科的分數點圖。數學（蜜桃）比較分散，英文（灰藍）比較集中，平均也不同。★ 是小明。", tex: "\\text{原始分數：尺度不同，不能直接比}" },
        { cap: "第一步：<b>減掉平均</b>，把兩科的中心都移到 0。現在看的是「比平均高多少分」。", tex: "x-\\co{\\mu}" },
        { cap: "第二步：<b>除以標準差</b>，把「典型的偏離距離」都縮放成 1。這就是 $z$ 分數，兩科終於在同一把尺上。", tex: "z=\\frac{x-\\co{\\mu}}{\\cb{\\sigma}}" },
        { cap: "換個問題：數學好的人，英文也比較好嗎？把每個人畫成一點（數學, 英文），再畫出兩科平均線，平面分成四塊。", tex: "(x_i,\\ y_i)\\quad i=1,\\dots,20" },
        { cap: "每一點算 $z_x\\times z_y$：右上、左下的點是正的（蜜桃），左上、右下的點是負的（灰藍）。<b>相關係數</b>就是它們的平均。", tex: "r=\\frac1n\\sum z_{x,i}\\,z_{y,i}" },
        { cap: "拖動小明（★）到遠處當離群值，看 $r$ 怎麼被拉動。記得：$r$ 大只代表「一起變動」，<b>不代表因果</b>。", tex: "-1\\le r\\le1" }
      ],
      hint: "拖動「關聯」滑桿；最後一步可以拖動 ★。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 520, 440, "標準化與散布圖");
        var g = s("g", {}, svg), hg = s("g", {}, svg);
        var st = { rho: .7, star: null };
        var base = (function () { var r = rng(7), a = []; for (var i = 0; i < 19; i++) a.push([gauss(r), gauss(r)]); return a; })();
        var read = SK.h("div", { class: "readout" });
        ctx.sliders.appendChild(SK.slider({ label: "關聯", min: -.95, max: .95, step: .05, value: st.rho, color: "green", onInput: function (v) { st.rho = v; st.star = null; draw(); } }).el);
        ctx.extra.appendChild(read);
        function data() {
          var xs = [], ys = [];
          base.forEach(function (p) {
            xs.push(70 + 10 * p[0]);
            ys.push(55 + 5 * (st.rho * p[0] + Math.sqrt(1 - st.rho * st.rho) * p[1]));
          });
          var sx = st.star || [80, 70];
          xs.push(sx[0]); ys.push(sx[1]);
          return { xs: xs, ys: ys };
        }
        var hd = SK.handle(hg, 0, 0, C.pink.s, "小明的點");
        var PX = function (x) { return 70 + (x - 30) * 5.5; }, PY = function (y) { return 400 - (y - 30) * 7; };
        SK.drag(svg, hd, function (x, y) { st.star = [SK.clamp((x - 70) / 5.5 + 30, 32, 110), SK.clamp((400 - y) / 7 + 30, 32, 85)]; draw(); },
          function () { var d = data(); return [PX(d.xs[19]), PY(d.ys[19])]; }, 8);
        function draw() {
          var f = ctx.frame, d = data(), xs = d.xs, ys = d.ys;
          var mx = mean(xs), my = mean(ys), sx = sd(xs), sy = sd(ys), r = corr(xs, ys);
          g.innerHTML = "";
          hd.style.display = f === 5 ? "" : "none";
          if (f <= 2) {
            var rows = [[xs, mx, sx, C.orange, "數學", 150], [ys, my, sy, C.blue, "英文", 300]];
            var lo = f === 0 ? 20 : f === 1 ? -50 : -3.5, hi = f === 0 ? 110 : f === 1 ? 50 : 3.5;
            var X = function (v) { return 60 + (v - lo) / (hi - lo) * 420; };
            rows.forEach(function (row) {
              var y0 = row[5];
              s("line", { x1: 50, y1: y0, x2: 490, y2: y0, class: "m-axis" }, g);
              SK.label(g, 40, y0 - 40, row[4], { size: 14, anchor: "start", color: row[3].s });
              var stack = {};
              row[0].forEach(function (v, i) {
                var t = f === 0 ? v : f === 1 ? v - row[1] : (v - row[1]) / row[2];
                var key = Math.round(X(t) / 9), k = stack[key] = (stack[key] || 0) + 1;
                var cx = X(t), cy = y0 - 7 - (k - 1) * 11;
                if (i === 19) SK.label(g, cx, cy, "★", { size: 18, color: C.pink.s });
                else s("circle", { cx: cx, cy: cy, r: 5, fill: row[3].f, stroke: row[3].s, "stroke-width": 1 }, g);
              });
              var c0 = f === 0 ? row[1] : 0;
              s("line", { x1: X(c0), y1: y0 + 4, x2: X(c0), y2: y0 - 60, stroke: C.ink, "stroke-dasharray": "4 4" }, g);
              if (f === 2) [-1, 1].forEach(function (k) { s("line", { x1: X(k), y1: y0 + 4, x2: X(k), y2: y0 - 30, stroke: C.line, "stroke-dasharray": "2 4" }, g); });
              for (var tk = Math.ceil(lo / (f === 2 ? 1 : 10)) * (f === 2 ? 1 : 10); tk <= hi; tk += (f === 2 ? 1 : 10)) SK.label(g, X(tk), y0 + 16, String(tk), { size: 11, color: C.soft });
            });
            var zx = (xs[19] - mx) / sx, zy = (ys[19] - my) / sy;
            read.innerHTML = SK.tex("\\text{★ 小明：}\\ \\co{z_{\\text{數}}=" + SK.fmt(zx, 2) + "},\\quad \\cb{z_{\\text{英}}=" + SK.fmt(zy, 2) + "}", true);
            return;
          }
          // 散布圖
          for (var gx = 30; gx <= 110; gx += 10) { s("line", { x1: PX(gx), y1: 20, x2: PX(gx), y2: 400, class: "m-grid" }, g); SK.label(g, PX(gx), 414, String(gx), { size: 11, color: C.soft }); }
          for (var gy = 30; gy <= 80; gy += 10) { s("line", { x1: 60, y1: PY(gy), x2: 510, y2: PY(gy), class: "m-grid" }, g); SK.label(g, 52, PY(gy), String(gy), { size: 11, anchor: "end", color: C.soft }); }
          SK.label(g, 500, 430, "數學 →", { size: 12, anchor: "end", color: C.orange.s });
          SK.label(g, 64, 14, "↑ 英文", { size: 12, anchor: "start", color: C.blue.s });
          s("line", { x1: PX(mx), y1: 20, x2: PX(mx), y2: 400, stroke: C.ink, "stroke-dasharray": "5 4" }, g);
          s("line", { x1: 60, y1: PY(my), x2: 510, y2: PY(my), stroke: C.ink, "stroke-dasharray": "5 4" }, g);
          xs.forEach(function (x, i) {
            var prod = (x - mx) * (ys[i] - my), col = f >= 4 ? (prod >= 0 ? C.orange : C.blue) : C.green;
            if (i === 19) { SK.label(g, PX(x), PY(ys[i]), "★", { size: 20, color: C.pink.s }); hd.moveTo(PX(x), PY(ys[i])); }
            else s("circle", { cx: PX(x), cy: PY(ys[i]), r: 6, fill: col.f, stroke: col.s, "stroke-width": 1.2 }, g);
          });
          if (f >= 4) {
            SK.label(g, 490, 36, "＋", { size: 22, color: C.orange.s }); SK.label(g, 80, 386, "＋", { size: 22, color: C.orange.s });
            SK.label(g, 80, 36, "－", { size: 22, color: C.blue.s }); SK.label(g, 490, 386, "－", { size: 22, color: C.blue.s });
          }
          read.innerHTML = SK.tex(f >= 4 ? "r=\\frac1{20}\\sum z_x z_y\\approx" + SK.fmt(r, 3) : "\\text{數學平均 }" + SK.fmt(mx, 1) + ",\\ \\text{英文平均 }" + SK.fmt(my, 1), true);
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "相關不等於因果", icon: "sparkle",
        html: "夏天冰淇淋賣得越多，中暑的人也越多，兩者的相關係數很高。但吃冰淇淋不會讓人中暑，是「天氣熱」同時影響了兩者。看到 $r$ 很大時，先問三個問題：會不會是第三個因素造成的？方向會不會相反？會不會只是巧合？散布圖和 $r$ 只描述「一起變動」，因果要靠實驗或更多證據。" },
      { title: "$r$ 為什麼沒有單位", icon: "leaf",
        html: "把數學成績從百分制換成一百五十分制，每個人的分數都乘上 1.5：平均和標準差也跟著乘 1.5，所以每個人的 $z$ 分數完全不變，$r$ 也不變。這就是先標準化再相乘的好處：$r$ 只看「相對位置」，和單位、尺度無關，所以永遠在 $-1$ 到 $1$ 之間。" }
    ],

    challenges: [
      { q: "如果老師把全班每個人的數學都加 5 分，小明的 $z$ 分數會變嗎？如果都乘 1.2 呢？", idea: "都不會變。加 5 分時平均也加 5、標準差不變；乘 1.2 時平均和標準差都乘 1.2。$z$ 分數只記錄「相對位置」。" },
      { q: "$r=0$ 代表兩個變數完全沒有關係嗎？", hint: "想想看點排成一個「U」形的散布圖。",
        idea: "不一定。例如 $y=x^2$ 在 $-3$ 到 $3$ 之間的點，$y$ 完全由 $x$ 決定，但左右對稱，$z_xz_y$ 正負抵消，$r=0$。相關係數只測量「直線」關係。" },
      { q: "在上面的散布圖把 ★ 拖到最右下角，$r$ 下降多少？只動一個點就能讓結論改變嗎？", idea: "一個極端的離群值可以大幅改變 $r$。所以看相關係數之前，一定要先看散布圖。" }
    ],

    where: {
      codes: [["D-10-2", "數據分析：平均數、標準差、百分位數、散布圖、相關係數、最適直線、標準化"]],
      exam: "高一共同必修，學測數 A、數 B 都在範圍內。它也是數 A「柯西不等式」與數甲「隨機變數」的前置直覺。",
      stop: "重點是讀散布圖、判斷方向與強弱、解釋離群值與預測限制，不急著推導完整的最小平方法。用柯西不等式證明 $-1\\le r\\le1$ 屬於 `※` 延伸。"
    }
  });
})();
