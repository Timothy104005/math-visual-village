/* 單元：一維數據分析（中位數、四分位數、箱型圖） */
(function () {
  var C = SK.C, s = SK.s;

  var BASE = [52, 58, 61, 65, 68, 70, 72, 75, 78, 82, 95];

  function mean(a) { return a.reduce(function (p, q) { return p + q; }, 0) / a.length; }
  function sd(a) { var m = mean(a); return Math.sqrt(mean(a.map(function (x) { return (x - m) * (x - m); }))); }
  /* 台灣高中定義：n 為奇數時，中位數不列入上下兩半 */
  function med(a) { var n = a.length; return n % 2 ? a[(n - 1) / 2] : (a[n / 2 - 1] + a[n / 2]) / 2; }
  function quart(a) {
    var n = a.length, h = Math.floor(n / 2);
    return { q1: med(a.slice(0, h)), q2: med(a), q3: med(a.slice(n - h)) };
  }

  function hookVisual(el) {
    var svg = SK.svg(el, 420, 230, "兩個班級的成績分布，平均都是 70");
    [["甲班", [66, 68, 69, 70, 70, 71, 72, 74], C.blue], ["乙班", [40, 48, 55, 68, 72, 85, 92, 100], C.orange]].forEach(function (row, i) {
      var y = 70 + i * 80;
      s("line", { x1: 50, y1: y, x2: 390, y2: y, stroke: C.line, "stroke-width": 1.2 }, svg);
      SK.label(svg, 46, y, row[0], { size: 14, anchor: "end" });
      row[1].forEach(function (v) {
        s("circle", { cx: 50 + (v - 35) / 70 * 340, cy: y, r: 6, fill: row[2].f, stroke: row[2].s, "stroke-width": 1.4 }, svg);
      });
      s("line", { x1: 50 + 35 / 70 * 340, y1: y - 24, x2: 50 + 35 / 70 * 340, y2: y + 24, stroke: C.pink.s, "stroke-width": 2, "stroke-dasharray": "4 3" }, svg);
    });
    SK.label(svg, 220, 30, "兩班的平均都是 70 分", { size: 14, color: C.pink.s });
    SK.label(svg, 220, 214, "但這兩班的成績，真的一樣嗎？", { size: 13, color: C.soft });
  }

  SK.mountUnit({
    slug: "data-spread",
    en: "What one number hides",
    formula: "\\co{Q_1}\\ \\cp{Q_2}\\ \\cb{Q_3},\\qquad \\text{IQR}=\\cb{Q_3}-\\co{Q_1}",

    hook: {
      html: "段考成績單發下來，老師只公布一個數字：「全班平均 70 分」。甲班和乙班的平均都是 70。",
      ask: "只知道平均 70，你能想像出這個班的成績長什麼樣子嗎？平均這個數字，把什麼藏起來了？",
      visual: hookVisual
    },

    guess: {
      q: "新聞<b>只</b>說「某公司員工平均年薪 120 萬」，沒有其他資料。只憑這一句，你能判斷這家公司「典型」員工（站在正中間的那位）領多少嗎？",
      options: [
        { t: "能：大約 120 萬", common: true, explain: "這是最直覺的讀法，但「平均」很容易被少數極端值拉高。如果老闆年薪 5000 萬，其他 49 個人都領 60 萬，平均就是 $\\frac{5000+49\\times60}{50}\\approx158$ 萬——沒有任何一個員工領到接近這個數字。" },
        { t: "能：一定明顯低於 120 萬", explain: "現實中薪資分布<b>常常</b>右偏，少數高薪把平均往上拉，中位數因此常低於平均。但「常常」不是「一定」：如果這家公司人人都領 115～125 萬，中位數就很接近 120 萬。只有一個平均數，推不出這個結論。" },
        { t: "能：中位數剛好也是 120 萬", explain: "分布<b>對稱</b>時平均會等於中位數，但我們不知道它對不對稱；而且反過來也不成立——平均等於中位數<b>不代表</b>對稱。例如 $0,1,2,2,2,5$：平均 $=\\frac{12}{6}=2$、中位數也是 $2$，但資料明顯不對稱（右邊拖了一個 5）。" },
        { t: "不能：資訊不夠", truth: true, explain: "沒錯，一個數字不夠！<b>只給平均</b>時，典型員工可能領得比它少很多（右偏），也可能差不多（集中）。要再知道<b>中位數</b>，或「分散到什麼程度」「分布偏向哪一邊」，才能想像出整份資料的樣子。<br>這就是為什麼很多國家的薪資統計會同時公布平均與中位數——薪資通常右偏，兩個數字常常差很多。" }
      ]
    },

    derive: {
      intro: "11 位同學的成績。<b>拖動最右邊那個點</b>（或用方向鍵），看看平均和中位數誰會跟著跑、誰站得住。",
      tall: true,
      frames: [
        { cap: "先把資料<b>由小到大排好</b>，畫在同一條數線上。這一步做完，很多問題就看得見了。", tex: "x_{(1)}\\le x_{(2)}\\le\\cdots\\le x_{(n)}" },
        { cap: "<b>中位數 $Q_2$</b>：站在正中間的那一個。$n=11$ 是奇數，所以就是第 6 個人。左邊 5 個、右邊 5 個，剛好對半。", tex: "\\cp{Q_2}=x_{(6)}" },
        { cap: "把左半邊、右半邊<b>各自再對半切一次</b>，得到 $Q_1$ 和 $Q_3$。（$n$ 是奇數時，中位數本人不算進兩邊。）三刀下去，資料被分成四等份，每份各 25%。", tex: "\\co{Q_1},\\ \\cp{Q_2},\\ \\cb{Q_3}" },
        { cap: "把 $Q_1$ 到 $Q_3$ 畫成一個<b>盒子</b>——中間 50% 的人都住在裡面。盒子的寬度叫 <b>IQR</b>（四分位距），它就是「中間那一半有多散」。", tex: "\\text{IQR}=\\cb{Q_3}-\\co{Q_1}" },
        { cap: "再從盒子往兩邊拉出<b>鬍鬚</b>，到最小值與最大值，就是<b>箱型圖</b>。一張小圖同時說出：中心在哪、散得多開、左右對不對稱。", tex: "\\min\\ \\co{Q_1}\\ \\cp{Q_2}\\ \\cb{Q_3}\\ \\max" },
        { cap: "現在把最大的那一點往右拖到底。<b>平均</b>（虛線）一路跟著跑，<b>中位數</b>卻紋風不動——因為中位數只在乎「排第幾個」，不在乎「差多少」。", tex: "\\text{離群值：平均會動，中位數不動}" }
      ],
      hint: "拖動最右邊的圓點，或先點它再按方向鍵。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 540, 400, "成績的數線圖與箱型圖");
        var g = s("g", {}, svg);
        var X0 = 60, X1 = 500, LO = 30, HI = 110, AY = 150, BY = 280;
        var st = { top: 95 };
        var read = SK.h("div", { class: "readout" });
        ctx.extra.appendChild(read);
        function px(v) { return X0 + (v - LO) / (HI - LO) * (X1 - X0); }
        function val(x) { return SK.clamp(LO + (x - X0) / (X1 - X0) * (HI - LO), 84, HI); }

        var handle = SK.handle(svg, px(st.top), AY, C.pink.s, "最高分，可拖動");
        SK.drag(svg, handle, function (x) {
          st.top = Math.round(val(x)); draw();
        }, function () { return [px(st.top), AY]; }, 8);

        function data() { return BASE.slice(0, 10).concat([st.top]).sort(function (a, b) { return a - b; }); }

        function draw() {
          var f = ctx.frame, d = data(), q = quart(d), m = mean(d), sdv = sd(d);
          g.innerHTML = "";
          /* 數線 */
          s("line", { x1: X0, y1: AY, x2: X1, y2: AY, stroke: C.line, "stroke-width": 1.4 }, g);
          for (var v = 40; v <= 110; v += 10) {
            s("line", { x1: px(v), y1: AY - 5, x2: px(v), y2: AY + 5, stroke: C.line, "stroke-width": 1 }, g);
            SK.label(g, px(v), AY + 20, String(v), { size: 11, color: C.soft });
          }
          /* 資料點 */
          d.forEach(function (x, i) {
            var inBox = f >= 3 && x >= q.q1 && x <= q.q3;
            s("circle", { cx: px(x), cy: AY, r: 7, fill: inBox ? C.gold.f : C.blue.f, stroke: inBox ? C.gold.s : C.blue.s, "stroke-width": 1.5 }, g);
            if (f >= 0) SK.label(g, px(x), AY - 20, String(i + 1), { size: 10, color: C.soft });
          });
          /* 中位數 */
          if (f >= 1) {
            s("line", { x1: px(q.q2), y1: AY - 46, x2: px(q.q2), y2: AY + 34, stroke: C.pink.s, "stroke-width": 2.6 }, g);
            SK.label(g, px(q.q2), AY - 56, "Q₂ = " + SK.fmt(q.q2, 1), { size: 13, color: C.pink.s, bold: true });
          }
          /* 四分位 */
          if (f >= 2) {
            [[q.q1, C.orange.s, "Q₁"], [q.q3, C.blue.s, "Q₃"]].forEach(function (t) {
              s("line", { x1: px(t[0]), y1: AY - 34, x2: px(t[0]), y2: AY + 26, stroke: t[1], "stroke-width": 2.2, "stroke-dasharray": "5 3" }, g);
              SK.label(g, px(t[0]), AY - 44, t[2] + " = " + SK.fmt(t[0], 1), { size: 12, color: t[1] });
            });
          }
          /* 箱型圖 */
          if (f >= 3) {
            s("rect", { x: px(q.q1), y: BY - 26, width: px(q.q3) - px(q.q1), height: 52, rx: 4, fill: C.gold.f, stroke: C.cocoa, "stroke-width": 1.6 }, g);
            s("line", { x1: px(q.q2), y1: BY - 26, x2: px(q.q2), y2: BY + 26, stroke: C.pink.s, "stroke-width": 3 }, g);
            SK.brace(g, px(q.q1), BY + 40, px(q.q3), BY + 40, 12, C.cocoa);
            SK.label(g, (px(q.q1) + px(q.q3)) / 2, BY + 72, "IQR = " + SK.fmt(q.q3 - q.q1, 1) + "（中間 50% 的人）", { size: 12, color: C.cocoa });
          }
          if (f >= 4) {
            var lo = d[0], hi = d[d.length - 1];
            [[lo, q.q1], [q.q3, hi]].forEach(function (seg) {
              s("line", { x1: px(seg[0]), y1: BY, x2: px(seg[1]), y2: BY, stroke: C.cocoa, "stroke-width": 1.6 }, g);
            });
            [lo, hi].forEach(function (t) {
              s("line", { x1: px(t), y1: BY - 14, x2: px(t), y2: BY + 14, stroke: C.cocoa, "stroke-width": 1.8 }, g);
            });
            SK.label(g, px(lo), BY + 30, "min " + lo, { size: 11, color: C.soft });
            SK.label(g, px(hi), BY + 30, "max " + hi, { size: 11, color: C.soft });
          }
          /* 平均 */
          if (f >= 5) {
            s("line", { x1: px(m), y1: AY - 70, x2: px(m), y2: BY + 30, stroke: C.green.s, "stroke-width": 2.2, "stroke-dasharray": "3 4" }, g);
            SK.label(g, px(m), AY - 80, "平均 = " + SK.fmt(m, 2), { size: 13, color: C.green.s, bold: true });
          }
          handle.moveTo(px(st.top), AY);
          svg.appendChild(handle);

          read.innerHTML = SK.tex(
            "\\co{Q_1}=" + SK.fmt(q.q1, 1) + ",\\quad\\cp{Q_2}=" + SK.fmt(q.q2, 1) + ",\\quad\\cb{Q_3}=" + SK.fmt(q.q3, 1) +
            ",\\quad\\text{IQR}=" + SK.fmt(q.q3 - q.q1, 1), true) +
            SK.tex("\\cg{\\text{平均}}=" + SK.fmt(m, 2) + ",\\qquad \\text{標準差}=" + SK.fmt(sdv, 2), true);
        }
        return { show: draw };
      }
    },

    drills: [
      { title: "由資料或 $\\Sigma x$、$\\Sigma x^2$ 算標準差；線性變換與百分位數", code: "D-10-2",
        demo: {
          q: "5 位同學的分數：$4,6,7,8,10$。求平均數、標準差、第 $40$ 百分位數；若每個分數改成 $y=-2x+10$，新的平均數與標準差是多少？",
          steps: [
            "平均 $\\mu=\\frac{35}5=7$。",
            "定義：$\\sigma=\\sqrt{\\frac1n\\sum(x_i-\\mu)^2}$（高中用除以 $n$）。離差 $-3,-1,0,1,3$，平方和 $9+1+0+1+9=20$，$\\sigma^2=4$，$\\sigma=2$。",
            "只給總和時用捷徑 $\\sigma^2=\\frac{\\Sigma x^2}n-\\mu^2$：$\\Sigma x^2=265$，$\\sigma^2=53-49=4$ ✓。",
            "線性變換 $y=-2x+10$：$\\mu_y=-2(7)+10=-4$；$\\sigma_y=|-2|\\cdot2=4$——標準差乘的是<b>絕對值</b>，不會變成 $-4$。",
            "百分位數（由小到大排）：$n\\times\\frac{k}{100}=5\\times0.4=2$ 是整數，取第 $2$、$3$ 個的平均 $\\frac{6+7}2=6.5$；若不是整數，就取無條件進位那一個。"
          ]
        },
        tries: [
          { q: "某資料 $n=10$、$\\Sigma x=60$、$\\Sigma x^2=400$，求平均與標準差。", ans: "$\\mu=6$，$\\sigma^2=40-36=4$，$\\sigma=2$。" },
          { q: "承上題，每筆資料改成 $y=3-0.5x$，求 $\\mu_y,\\sigma_y$。", ans: "$\\mu_y=3-0.5(6)=0$，$\\sigma_y=|-0.5|\\cdot2=1$。" },
          { q: "資料 $2,3,5,7,8,9,12,15$ 的第 $75$ 百分位數。", ans: "$8\\times0.75=6$ 是整數，取第 $6$、$7$ 個的平均：$\\frac{9+12}2=10.5$。" }
        ],
        edge: "$\\sigma_{ax+b}=|a|\\,\\sigma_x$：負倍率只把資料左右翻轉，分散程度不會變號；加常數 $b$ 完全不影響 $\\sigma$。捷徑 $\\frac{\\Sigma x^2}n-\\mu^2$ 在數字很大時容易因四捨五入出錯，先把資料都減去一個整數再算比較穩。計算機或統計軟體常給除以 $n-1$ 的樣本標準差，和高中的 $\\sigma$ 不同。"
      }
    ],

    angles: [
      { title: "兩組工具，各有脾氣", icon: "bulb",
        html: "描述一份資料，有兩套搭配：<br>・<b>平均 ＋ 標準差</b>：用到每一個數字，計算方便，後面的常態分布、標準化都靠它。缺點是<b>怕離群值</b>。<br>・<b>中位數 ＋ IQR</b>：只看「排第幾」，一個極端值動不了它，叫做<b>穩健</b>。<br>資料大致對稱就用前者；有離群值或明顯偏斜（例如薪資、房價）就用後者。這不是誰對誰錯，是看你想讓數字回答什麼問題。" },
      { title: "箱型圖為什麼好用", icon: "sparkle",
        html: "箱型圖把五個數字（最小、$Q_1$、$Q_2$、$Q_3$、最大）畫成一張小圖，所以可以<b>好幾組並排比較</b>——五個班級、十二個月份、三種品牌，一眼就看出誰的中心高、誰比較穩定、誰有長尾巴。<br>盒子偏左、右鬚特別長 ⇒ 資料右偏，平均會被拉到中位數右邊。開頭那則「平均年薪」新聞，畫成箱型圖就再也騙不了人。" }
    ],

    challenges: [
      { q: "甲班 8 人成績 66、68、69、70、70、71、72、74，乙班 8 人成績 40、48、55、68、72、85、92、100。兩班平均都是 70，算出兩班的 $Q_1$、$Q_2$、$Q_3$ 與 IQR。",
        hint: "$n=8$ 是偶數，中位數取中間兩個的平均；上下各 4 個，$Q_1$、$Q_3$ 也各取中間兩個的平均。",
        idea: "甲班：$Q_1=68.5$、$Q_2=70$、$Q_3=71.5$，IQR $=3$。乙班：$Q_1=51.5$、$Q_2=70$、$Q_3=88.5$，IQR $=37$。中位數一樣，IQR 差了十倍以上——這正是平均藏起來的東西。" },
      { q: "一份資料有 20 個數，每個數都加 5，中位數、IQR、標準差各會怎麼變？如果改成每個數都乘以 2 呢？", lv: "Explore",
        hint: "先想「整條數線一起平移」和「整條數線拉長兩倍」時，圖會怎麼變。",
        idea: "加 5：中位數、$Q_1$、$Q_3$ 都加 5，但 IQR 與標準差<b>不變</b>（分散程度不受平移影響）。乘 2：中位數、$Q_1$、$Q_3$ 都乘 2，IQR 與標準差也都<b>乘 2</b>。一句話：位置量隨平移與伸縮改變，分散量只隨伸縮改變。" },
      { q: "常見的離群值判定是「小於 $Q_1-1.5\\times\\text{IQR}$ 或大於 $Q_3+1.5\\times\\text{IQR}$」。為什麼是 1.5 而不是 1 或 2？你覺得一個「被判定為離群值」的資料，應該直接刪掉嗎？", lv: "Wonder",
        idea: "1.5 是統計學家 Tukey 提出的經驗值：對常態分布而言，約只有 0.7% 的資料會被標記，既不會太寬鬆也不會抓到一堆正常值——它是慣例，不是定理。<br>至於刪不刪：離群值有時是打錯的資料（該修），有時卻是最重要的訊息（該查）。天文學的新星、醫學的罕見反應、工廠的瑕疵品，都是離群值。<b>先問它為什麼在那裡，再決定怎麼辦。</b>" }
    ],

    where: {
      codes: [["D-10-2", "數據分析：一維數據的平均數、標準差（備註明訂「將四分位數延伸至百分位數」）；二維數據的散布圖、最適直線與相關係數、數據的標準化"]],
      exam: "10 年級<b>共同必修</b>，學測數 A、數 B 都在範圍內。常以「讀圖表、判斷敘述對錯」的多選題出現，也常和標準化、常態分布合併命題。分科數甲、數乙的隨機變數會把這些量推廣到機率分布上。",
      stop: "會算、會讀、知道每個量怕什麼就夠了。四分位數在不同軟體有不同的定義（插值法），高中只用課本這一種；離群值的 1.5×IQR 規則知道即可，不必深究來源；變異數的 $n$ 與 $n-1$ 之分屬於大學統計。"
    }
  });
})();
