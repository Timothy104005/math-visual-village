/* 單元：最適直線（迴歸直線） */
(function () {
  var C = SK.C, s = SK.s;

  /* 10 位同學：每週讀數學的小時數 → 段考分數 */
  var PTS = [[2, 48], [3, 55], [4, 52], [5, 64], [6, 61], [7, 72], [8, 70], [9, 81], [10, 78], [12, 88]];

  function mean(a) { return a.reduce(function (p, q) { return p + q; }, 0) / a.length; }
  function stats() {
    var xs = PTS.map(function (p) { return p[0]; }), ys = PTS.map(function (p) { return p[1]; });
    var mx = mean(xs), my = mean(ys);
    var sxx = mean(xs.map(function (x) { return (x - mx) * (x - mx); }));
    var syy = mean(ys.map(function (y) { return (y - my) * (y - my); }));
    var sxy = mean(xs.map(function (x, i) { return (x - mx) * (ys[i] - my); }));
    var sx = Math.sqrt(sxx), sy = Math.sqrt(syy), r = sxy / (sx * sy);
    return { mx: mx, my: my, sx: sx, sy: sy, r: r, m: sxy / sxx, b: my - sxy / sxx * mx };
  }
  var S = stats();

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 250, "讀書時間與分數的散佈圖");
    var X0 = 55, X1 = 370, Y0 = 210, Y1 = 30;
    function px(x) { return X0 + (x - 0) / 13 * (X1 - X0); }
    function py(y) { return Y0 - (y - 40) / 55 * (Y0 - Y1); }
    s("line", { x1: X0, y1: Y0, x2: X1, y2: Y0, stroke: C.line, "stroke-width": 1.3 }, svg);
    s("line", { x1: X0, y1: Y0, x2: X0, y2: Y1, stroke: C.line, "stroke-width": 1.3 }, svg);
    PTS.forEach(function (p) {
      s("circle", { cx: px(p[0]), cy: py(p[1]), r: 5.5, fill: C.blue.f, stroke: C.blue.s, "stroke-width": 1.4 }, svg);
    });
    SK.label(svg, 212, 236, "每週讀數學的時數 →", { size: 12, color: C.soft });
    SK.label(svg, 30, 120, "分數", { size: 12, color: C.soft });
    SK.label(svg, 250, 55, "該畫哪一條線？", { size: 13, color: C.pink.s });
  }

  SK.mountUnit({
    slug: "best-fit-line",
    en: "The line that misses by the least",
    formula: "y-\\cp{\\bar y}=\\co{r}\\,\\frac{\\cb{s_y}}{\\cb{s_x}}\\,(x-\\cp{\\bar x})",

    hook: {
      html: "十位同學回報「每週讀數學幾小時」，對上他們的段考分數。點畫在坐標平面上，看得出一個往右上走的趨勢，但沒有任何一條直線能穿過全部的點。",
      ask: "如果一定要用<b>一條直線</b>來代表這團點，該畫哪一條？而且——「最好」到底是什麼意思？",
      visual: hookVisual
    },

    guess: {
      q: "在一張散佈圖上，「最適直線」是指哪一條？",
      options: [
        { t: "穿過最多資料點的那條", common: true, explain: "很自然的想法，但這條線只討好少數剛好在線上的點，其他點錯得再離譜它也不在乎。而且資料稍微變動，這條線就會整個跳掉——它不穩定。" },
        { t: "讓每點到直線的<b>鉛直差距</b>平方和最小的那條", truth: true, explain: "這就是<b>最小平方法</b>。用鉛直差距（而不是垂直距離），是因為我們想用 $x$ 去<b>預測</b> $y$，在乎的是「預測值差多少」。平方則讓正負不互相抵消，而且錯得越離譜罰得越重。" },
        { t: "連接最左邊和最右邊兩點的那條", explain: "這條線只用到兩筆資料，中間八個人說的話全部被忽略。萬一那兩點剛好是離群值，整條線就歪掉了。" },
        { t: "一定通過原點的那條", explain: "只有在「$x=0$ 時 $y$ 必為 0」有道理時才該這樣要求。這裡完全不讀書也未必考 0 分，硬逼它過原點反而讓線偏掉。" }
      ]
    },

    derive: {
      intro: "拖動兩個滑桿改變直線的<b>斜率</b>與<b>截距</b>，看看粉紅色的差距條會怎麼變。右邊會即時算出誤差平方和。",
      tall: true,
      frames: [
        { cap: "十個點，還有一條你可以亂調的直線。問題只有一個：怎麼幫「這條線畫得好不好」<b>打一個分數</b>？", tex: "y=\\co{m}x+\\cb{k}" },
        { cap: "對每個人，看實際分數和直線預測分數<b>差多少</b>——這段鉛直線段叫做<b>殘差</b>。線在點下方就是正的，上方就是負的。", tex: "e_i=y_i-(\\co{m}x_i+\\cb{k})" },
        { cap: "直接把殘差加起來沒用：正負會互相抵消，一條爛線也可能加起來剛好是 0。所以把每個殘差<b>平方</b>——變成小正方形的面積，再全部加起來。", tex: "\\text{SSE}=\\sum e_i^2" },
        { cap: "現在「好不好」有分數了：<b>SSE 越小越好</b>。慢慢調滑桿，把右邊那根長條壓到最短，你就是在手動做最小平方法。", tex: "\\min_{m,k}\\ \\sum\\big(y_i-(mx_i+k)\\big)^2" },
        { cap: "第一個發現：最好的那條線一定通過<b>兩個平均的交點</b> $(\\bar x,\\bar y)$。道理很直接——固定斜率去調截距，等於整條線上下平移，殘差和為 0 時最好，而那正好把線釘在資料的重心上。", tex: "\\cp{(\\bar x,\\bar y)}\\ \\text{一定在線上}" },
        { cap: "第二個發現：最好的斜率是 $r\\dfrac{s_y}{s_x}$。$\\frac{s_y}{s_x}$ 是把 $x$ 的尺度換成 $y$ 的尺度，再乘上相關係數 $r$ 縮一點——<b>關聯越弱，線越平</b>。$r=0$ 時直線是水平的：$x$ 幫不上忙，只好一律猜 $\\bar y$。", tex: "\\co{m}=\\co{r}\\,\\frac{\\cb{s_y}}{\\cb{s_x}}" }
      ],
      hint: "第 4 步之後會出現灰色的最佳直線，可以比對你調得多接近。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 540, 420, "散佈圖、可調整的直線與殘差");
        var g = s("g", {}, svg);
        var X0 = 70, X1 = 430, Y0 = 350, Y1 = 40;
        var st = { m: 2, k: 50 };
        var read = SK.h("div", { class: "readout" });
        ctx.extra.appendChild(read);
        function px(x) { return X0 + x / 13 * (X1 - X0); }
        function py(y) { return Y0 - (y - 35) / 60 * (Y0 - Y1); }

        var slM = SK.slider({ label: "斜率 $m$", min: -1, max: 8, step: .1, value: st.m, onInput: function (v) { st.m = v; draw(); } });
        var slK = SK.slider({ label: "截距 $k$", min: 20, max: 80, step: 1, value: st.k, color: "blue", onInput: function (v) { st.k = v; draw(); } });
        ctx.sliders.appendChild(slM.el); ctx.sliders.appendChild(slK.el);

        function sse(m, k) {
          return PTS.reduce(function (acc, p) { var e = p[1] - (m * p[0] + k); return acc + e * e; }, 0);
        }
        var BEST = sse(S.m, S.b);

        function draw() {
          var f = ctx.frame, m = st.m, k = st.k;
          g.innerHTML = "";
          /* 坐標軸 */
          s("line", { x1: X0, y1: Y0, x2: X1 + 14, y2: Y0, stroke: C.line, "stroke-width": 1.4 }, g);
          s("line", { x1: X0, y1: Y0, x2: X0, y2: Y1 - 10, stroke: C.line, "stroke-width": 1.4 }, g);
          for (var t = 2; t <= 12; t += 2) { SK.label(g, px(t), Y0 + 16, String(t), { size: 11, color: C.soft }); }
          for (var u = 40; u <= 90; u += 10) {
            s("line", { x1: X0 - 4, y1: py(u), x2: X0, y2: py(u), stroke: C.line, "stroke-width": 1 }, g);
            SK.label(g, X0 - 16, py(u), String(u), { size: 11, color: C.soft, anchor: "end" });
          }
          SK.label(g, (X0 + X1) / 2, Y0 + 34, "每週時數", { size: 12, color: C.soft });

          /* 最佳直線（第 4 步起顯示） */
          if (f >= 4) {
            s("line", { x1: px(0), y1: py(S.b), x2: px(13), y2: py(S.m * 13 + S.b), stroke: C.line, "stroke-width": 2, "stroke-dasharray": "6 4" }, g);
            SK.label(g, px(12.4), py(S.m * 12.4 + S.b) - 14, "最佳", { size: 11, color: C.soft });
          }
          /* 殘差 */
          if (f >= 1) {
            PTS.forEach(function (p) {
              var yhat = m * p[0] + k;
              s("line", { x1: px(p[0]), y1: py(p[1]), x2: px(p[0]), y2: py(yhat), stroke: C.pink.s, "stroke-width": 2.4, "stroke-linecap": "round" }, g);
              if (f === 2) {
                /* 把殘差畫成一個正方形：邊長就是殘差，面積就是殘差平方 */
                var h = Math.abs(py(p[1]) - py(yhat));
                s("rect", { x: px(p[0]), y: Math.min(py(p[1]), py(yhat)), width: h, height: h, fill: C.pink.f, stroke: C.pink.s, "stroke-width": .8, opacity: .55 }, g);
              }
            });
          }
          /* 使用者的直線 */
          s("line", { x1: px(0), y1: py(k), x2: px(13), y2: py(m * 13 + k), stroke: C.orange.s, "stroke-width": 3.2 }, g);
          /* 資料點 */
          PTS.forEach(function (p) {
            s("circle", { cx: px(p[0]), cy: py(p[1]), r: 6, fill: C.blue.f, stroke: C.blue.s, "stroke-width": 1.6 }, g);
          });
          /* 重心 */
          if (f >= 4) {
            s("circle", { cx: px(S.mx), cy: py(S.my), r: 8, fill: "none", stroke: C.pink.s, "stroke-width": 2.4 }, g);
            s("line", { x1: px(S.mx), y1: Y0, x2: px(S.mx), y2: py(S.my), stroke: C.pink.s, "stroke-width": 1, "stroke-dasharray": "3 3" }, g);
            s("line", { x1: X0, y1: py(S.my), x2: px(S.mx), y2: py(S.my), stroke: C.pink.s, "stroke-width": 1, "stroke-dasharray": "3 3" }, g);
            SK.label(g, px(S.mx) + 12, py(S.my) - 16, "(x̄, ȳ)", { size: 12, color: C.pink.s, anchor: "start" });
          }

          /* SSE 長條 */
          var cur = sse(m, k), maxBar = 2600;
          var BX = 470, BH = 300;
          s("rect", { x: BX, y: Y0 - BH, width: 40, height: BH, rx: 6, fill: "none", stroke: C.line, "stroke-width": 1.2 }, g);
          var h = SK.clamp(cur / maxBar, 0, 1) * BH;
          s("rect", { x: BX, y: Y0 - h, width: 40, height: h, rx: 6, fill: C.pink.f, stroke: C.pink.s, "stroke-width": 1.4 }, g);
          var hb = SK.clamp(BEST / maxBar, 0, 1) * BH;
          s("line", { x1: BX - 6, y1: Y0 - hb, x2: BX + 46, y2: Y0 - hb, stroke: C.mint.s, "stroke-width": 2.4 }, g);
          SK.label(g, BX + 20, Y0 - BH - 16, "SSE", { size: 12, color: C.soft });
          SK.label(g, BX + 20, Y0 - hb - 12, "最小 " + SK.fmt(BEST, 0), { size: 10, color: C.mint.s });

          read.innerHTML =
            SK.tex("y=" + SK.fmt(m, 2) + "x+" + SK.fmt(k, 1) + ",\\qquad \\text{SSE}=" + SK.fmt(cur, 1), true) +
            (f >= 5 ? SK.tex("\\co{r}=" + SK.fmt(S.r, 3) + ",\\ \\cb{s_x}=" + SK.fmt(S.sx, 2) + ",\\ \\cb{s_y}=" + SK.fmt(S.sy, 2) +
              "\\Rightarrow \\co{m}=" + SK.fmt(S.m, 3), true) : "");
        }
        return { show: draw };
      }
    },

    drills: [
      { title: "由表格算相關係數與最適直線", code: "D-10-2",
        demo: {
          q: "五筆資料 $(x,y)$：$(1,2),(2,4),(3,5),(4,4),(5,5)$。求相關係數 $r$ 與 $y$ 對 $x$ 的最適直線。",
          steps: [
            "平均：$\\mu_x=3$、$\\mu_y=4$。",
            "離差：$x-\\mu_x=-2,-1,0,1,2$；$y-\\mu_y=-2,0,1,0,1$。乘積和 $\\Sigma(x-\\mu_x)(y-\\mu_y)=4+0+0+0+2=6$；$\\Sigma(x-\\mu_x)^2=10$；$\\Sigma(y-\\mu_y)^2=6$。",
            "$r=\\dfrac{6}{\\sqrt{10\\cdot6}}=\\dfrac6{\\sqrt{60}}\\approx0.77$，中度正相關。",
            "斜率 $m=\\dfrac{\\Sigma(x-\\mu_x)(y-\\mu_y)}{\\Sigma(x-\\mu_x)^2}=\\dfrac6{10}=0.6$（也等於 $r\\cdot\\frac{\\sigma_y}{\\sigma_x}$）。",
            "最適直線一定通過 $(\\mu_x,\\mu_y)$：$y-4=0.6(x-3)$，即 $y=0.6x+2.2$。用它預測 $x=6$ 得 $5.8$——但 $6$ 已超出資料範圍，是<b>外插</b>，要小心。"
          ]
        },
        tries: [
          { q: "四筆資料 $(1,3),(2,6),(3,4),(4,7)$。已知 $\\Sigma x=10$、$\\Sigma y=20$、$\\Sigma x^2=30$、$\\Sigma y^2=110$、$\\Sigma xy=55$，求 $r$ 與最適直線。", hint: "$\\Sigma(x-\\mu_x)(y-\\mu_y)=\\Sigma xy-n\\mu_x\\mu_y$，平方和同理。", ans: "$\\mu_x=2.5$、$\\mu_y=5$。$S_{xy}=55-4(2.5)(5)=5$、$S_{xx}=30-25=5$、$S_{yy}=110-100=10$。$r=\\frac5{\\sqrt{50}}\\approx0.71$；斜率 $\\frac55=1$，直線 $y=x+2.5$。" }
        ],
        edge: "$y$ 對 $x$ 與 $x$ 對 $y$ 的最適直線不是同一條（斜率不是互為倒數，除非 $|r|=1$）。$r$ 只量<b>線性</b>關係：$y=x^2$ 在 $x=-2,-1,0,1,2$ 上 $r=0$，兩者卻完全相關。平移與正倍率伸縮（例如換單位）不改變 $r$，但會改變斜率；乘上負數則 $r$ 變號。"
      }
    ],

    angles: [
      { title: "為什麼是「鉛直」差距，不是垂直距離", icon: "bulb",
        html: "點到直線最短的是<b>垂直</b>距離，為什麼這裡量<b>鉛直</b>？<br>因為這條線的任務是<b>用 $x$ 預測 $y$</b>：我告訴你一個讀書時數，你回答一個分數，錯的量就是分數的差，那是上下量的。<br>這也解釋了一件常讓人意外的事：用 $y$ 去預測 $x$ 會得到<b>另一條</b>不同的線。兩條線都通過 $(\\bar x,\\bar y)$，但只有在 $r=\\pm1$ 時才會重合。「誰預測誰」不是可以隨便調換的。" },
      { title: "$r$ 越小，線越平——迴歸的原意", icon: "sparkle",
        html: "斜率 $r\\frac{s_y}{s_x}$ 裡的 $r$ 是一個介於 $-1$ 與 $1$ 的縮小因子。用標準化後的座標看更乾淨：$z_y=r\\,z_x$。<br>意思是：某人的 $x$ 高出平均 2 個標準差，預測他的 $y$ 只高出 $2r$ 個標準差——<b>會往平均靠回去一點</b>。<br>這就是「迴歸」這個名字的由來：高爾頓發現高個子父親的兒子平均而言比父親矮一些，他稱之為「向平均迴歸」。它不是什麼神祕的力量，只是 $|r|<1$ 的算術結果。" },
      { title: "相關不是因果", icon: "leaf",
        html: "這條線說「讀得多的人分數高」，它<b>沒有</b>說「多讀就會高分」。也許本來就喜歡數學的人既讀得多又考得好；也許讀得順的人才願意多讀。<br>另外，這條線只在資料範圍內可信。把 $x=40$ 小時代進去會算出 160 分——公式會很樂意給你答案，但那叫<b>外推</b>，已經超出資料說話的範圍了。" }
    ],

    challenges: [
      { q: "如果把所有人的分數都加 5 分，最適直線的斜率和截距會怎麼變？相關係數 $r$ 呢？",
        hint: "整團點一起往上平移，形狀完全沒變。",
        idea: "斜率不變、截距加 5、$r$ 不變。$r$ 和斜率都只看「形狀」，不看位置。同理，若把時數的單位從小時改成分鐘（乘 60），$r$ 也不會變，但斜率會變成原來的 $\\frac{1}{60}$。" },
      { q: "把散佈圖最右上角那個點（12, 88）改成（12, 40），斜率會怎麼變？為什麼單一個點能有這麼大的影響力？", lv: "Explore",
        hint: "想想殘差是被<b>平方</b>的，而且這個點的 $x$ 離 $\\bar x$ 很遠。",
        idea: "斜率會明顯變小甚至接近水平。原因有兩層：平方讓大殘差的懲罰特別重，而 $x$ 離平均越遠的點，對斜率的槓桿越長（它像一根長桿的末端，輕輕一壓就把線轉動）。這種點叫<b>高槓桿點</b>，是畫完圖一定要回頭看一眼的原因。" },
      { q: "如果改用「殘差絕對值的總和」最小，而不是平方和，會得到不一樣的直線嗎？你覺得為什麼課本選了平方？", lv: "Wonder",
        idea: "會得到不一樣的線（這叫最小絕對偏差法，它對離群值比較不敏感，是一種穩健迴歸）。課本選平方有幾個理由：平方函數可微，用配方或微分就能解出漂亮的公式；平方和的最小值剛好和相關係數、標準差連在一起，整套理論能接起來；絕對值在 0 處不可微，必須用別的演算法去解。<br>所以「用平方」是一個帶著代價的選擇，不是唯一的真理——這正是統計裡常見的樣子。" }
    ],

    where: {
      codes: [["D-10-2", "數據分析：二維數據的散布圖，最適直線與相關係數，數據的標準化（備註：教學重點是先辨識可能有直線關係，再討論「最適」的評量標準）"]],
      exam: "10 年級<b>共同必修</b>，學測數 A、數 B 都在範圍內。常考的是<b>讀圖與判斷</b>：斜率的意義、$r$ 的正負與強弱、平移伸縮後哪些量會變、以及「相關不等於因果」的敘述對錯。要手算整條迴歸直線的題目較少，但公式必須會用。",
      stop: "會算、會解釋、知道它的極限就夠了。最小平方法的完整推導（偏微分或配方）不是高中要求；多元迴歸、$R^2$ 的檢定、殘差圖診斷都屬於大學統計。重點是<b>不要把迴歸直線當成因果關係的證據</b>。"
    }
  });
})();
