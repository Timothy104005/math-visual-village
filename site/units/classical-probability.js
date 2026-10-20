/* 單元：古典機率 */
(function () {
  var C = SK.C, s = SK.s;
  var EVENTS = [
    { name: "和 = 7", f: function (a, b) { return a + b === 7; } },
    { name: "至少一個 6", f: function (a, b) { return a === 6 || b === 6; } },
    { name: "兩顆同點", f: function (a, b) { return a === b; } },
    { name: "和 ≥ 10", f: function (a, b) { return a + b >= 10; } }
  ];

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 250, "兩顆骰子的所有結果");
    var x0 = 70, y0 = 40, c = 28;
    for (var i = 1; i <= 6; i++) for (var j = 1; j <= 6; j++) {
      var hit = i + j === 7;
      s("rect", { x: x0 + (j - 1) * c, y: y0 + (i - 1) * c, width: c - 3, height: c - 3, rx: 4, fill: hit ? C.orange.f : C.paper, stroke: hit ? C.orange.s : C.line }, svg);
    }
    SK.label(svg, x0 + 3 * c, y0 - 14, "第二顆", { size: 12, color: C.soft });
    SK.label(svg, x0 - 26, y0 + 3 * c, "第一顆", { size: 12, color: C.soft, anchor: "end" });
    SK.label(svg, 300, 120, "36 種結果", { size: 14 });
    SK.label(svg, 300, 148, "和是 7 的有幾種？", { size: 13, color: C.pink.s });
  }

  SK.mountUnit({
    slug: "classical-probability",
    en: "Count the dots in the sample space",
    formula: "P(A)=\\frac{n(A)}{n(S)},\\qquad P(A')=1-P(A),\\qquad P(A\\cup B)=P(A)+P(B)-P(A\\cap B)",

    hook: {
      html: "擲兩顆骰子，所有可能的結果可以排成 $6\\times6$ 的格子，共 36 種。每一種<b>機會均等</b>。",
      ask: "「和是 7」的機率怎麼算？為什麼不能說「和有 2 到 12 共 11 種，所以機率是 $\\tfrac1{11}$」？",
      visual: hookVisual
    },

    guess: {
      q: "擲兩顆骰子，「和是 7」的機率是多少？",
      options: [
        { t: "$\\tfrac16$", truth: true, explain: "36 種等可能的結果中，和是 7 的有 $(1,6),(2,5),(3,4),(4,3),(5,2),(6,1)$ 共 6 種，$\\tfrac{6}{36}=\\tfrac16$。在格子圖上是一條斜線。" },
        { t: "$\\tfrac1{11}$", common: true, explain: "和的可能值確實有 2 到 12 共 11 種，但它們<b>不是等可能</b>：和是 2 只有 1 種走法，和是 7 有 6 種。古典機率的分母必須是等可能的結果數。" },
        { t: "$\\tfrac{1}{36}$", explain: "$\\tfrac1{36}$ 是某一個<b>特定</b>結果（例如 $(3,4)$）的機率。和是 7 包含 6 個這樣的結果。" },
        { t: "$\\tfrac{7}{36}$", explain: "分子要數的是「和是 7 的結果<b>個數</b>」，不是 7 這個數字。" }
      ]
    },

    derive: {
      intro: "點選不同的事件，看它在樣本空間裡佔了幾格。",
      tall: true,
      frames: [
        { cap: "<b>樣本空間</b> $S$ 是所有可能結果的集合；<b>事件</b> 是 $S$ 的子集。每個結果等可能時，機率就是「數格子」：事件的格數除以總格數。", tex: "P(A)=\\frac{n(A)}{n(S)}=\\frac{n(A)}{36}" },
        { cap: "<b>等可能</b>是關鍵。把兩顆骰子的「和」當結果，就只有 11 種，但它們不等可能——右邊的長條圖是每個和的格子數。分母一定要用等可能的結果。", tex: "P(\\text{和}=k)=\\frac{\\text{那一條斜線的格數}}{36}" },
        { cap: "<b>機率的性質</b>：每個機率介於 0 和 1 之間、$P(S)=1$、互斥事件的機率可以相加。特別是<b>餘事件</b>：$P(A')=1-P(A)$，「至少」類的問題常常從反面算比較快。", tex: "\\begin{gathered}0\\le P(A)\\le1,\\quad P(S)=1\\\\P(A')=1-P(A)\\end{gathered}" },
        { cap: "<b>複合事件</b>：兩個事件的聯集要扣掉重疊的部分，和計數的取捨原理一模一樣。", tex: "P(A\\cup B)=P(A)+P(B)-P(A\\cap B)" },
        { cap: "把每個「和」的機率乘上它的值再加起來，就是<b>期望值</b>：長期平均會落在哪裡。兩顆骰子的和，期望值是 7。", tex: "E=\\sum k\\cdot P(\\text{和}=k)=7" }
      ],
      hint: "點按鈕換事件；第 4 步同時顯示兩個事件。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 540, 440, "兩顆骰子的樣本空間");
        var g = s("g", {}, svg);
        var st = { a: 0, b: 1 };
        var read = SK.h("div", { class: "readout" });
        var btns = SK.h("div", { style: "display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px" });
        EVENTS.forEach(function (e, i) {
          var b = SK.h("button", { class: "chip", type: "button", "aria-pressed": i === 0 ? "true" : "false" }, e.name);
          b.addEventListener("click", function () { st.a = i; Array.prototype.forEach.call(btns.children, function (x, k) { x.setAttribute("aria-pressed", k === i ? "true" : "false"); }); draw(); });
          btns.appendChild(b);
        });
        ctx.extra.appendChild(btns); ctx.extra.appendChild(read);
        function num(v, d) { return SK.fmt(v, d == null ? 3 : d).replace("−", "-"); }
        function draw() {
          /* 第 4 步固定比較「和 = 7」與「至少一個 6」，標籤與計數用同一組事件 */
          var f = ctx.frame, A = f === 3 ? EVENTS[0] : EVENTS[st.a], B = EVENTS[st.b];
          g.innerHTML = "";
          btns.style.display = f === 3 ? "none" : "flex";
          var x0 = 60, y0 = 70, c = 46, nA = 0, nB = 0, nAB = 0;
          SK.label(g, x0 + 3 * c, y0 - 26, "第二顆", { size: 12, color: C.soft });
          SK.label(g, x0 - 34, y0 + 3 * c, "第一顆", { size: 12, color: C.soft, anchor: "end" });
          for (var i = 1; i <= 6; i++) {
            SK.label(g, x0 + (i - .5) * c, y0 - 8, String(i), { size: 11, color: C.soft });
            SK.label(g, x0 - 12, y0 + (i - .5) * c, String(i), { size: 11, color: C.soft, anchor: "end" });
            for (var j = 1; j <= 6; j++) {
              var inA = A.f(i, j), inB = B.f(i, j), fill = C.paper, stroke = C.line, sw = 1;
              if (f === 3) {
                if (inA) nA++;
                if (inB) nB++;
                if (inA && inB) nAB++;
                fill = inA && inB ? C.purple.f : inA ? C.orange.f : inB ? C.blue.f : C.paper;
                if (inA && inB) { stroke = C.purple.s; sw = 2.2; }
              } else if (f === 2 && st.a === 1) {
                if (inA) nA++;
                fill = inA ? C.orange.f : "rgba(207,224,211,.55)";
              } else {
                if (inA) nA++;
                fill = inA ? C.orange.f : C.paper;
                if (inA) { stroke = C.orange.s; sw = 1.8; }
              }
              s("rect", { x: x0 + (j - 1) * c + 2, y: y0 + (i - 1) * c + 2, width: c - 5, height: c - 5, rx: 6, fill: fill, stroke: stroke, "stroke-width": sw }, g);
              if (f === 1) SK.label(g, x0 + (j - .5) * c, y0 + (i - .5) * c, String(i + j), { size: 13, color: C.soft });
            }
          }
          if (f === 1) {
            // 右側：和的長條圖
            var bx = 360, by = 400, bw = 14;
            for (var k = 2; k <= 12; k++) {
              var cnt = 6 - Math.abs(7 - k);
              s("rect", { x: bx + (k - 2) * (bw + 2), y: by - cnt * 22, width: bw, height: cnt * 22, fill: k === 7 ? C.orange.f : C.gold.f, stroke: C.cocoa, "stroke-width": .8 }, g);
              SK.label(g, bx + (k - 2) * (bw + 2) + bw / 2, by + 14, String(k), { size: 10, color: C.soft });
            }
            SK.label(g, bx + 80, 180, "每個「和」的格數不一樣", { size: 12, color: C.soft });
          }
          if (f === 2) {
            var comp = 36 - nA;
            SK.label(g, 400, 120, "事件 A：" + nA + " 格", { size: 14, color: C.orange.s, anchor: "start" });
            SK.label(g, 400, 150, "餘事件 A′：" + comp + " 格", { size: 14, color: C.green.s, anchor: "start" });
            SK.label(g, 400, 190, "兩者相加 = 36", { size: 13, color: C.soft, anchor: "start" });
            read.innerHTML = SK.tex("P(A)=\\frac{" + nA + "}{36},\\quad P(A')=1-\\frac{" + nA + "}{36}=\\frac{" + comp + "}{36}", true);
            return;
          }
          if (f === 3) {
            SK.label(g, 400, 110, "A：" + A.name + "（橘）", { size: 13, color: C.orange.s, anchor: "start" });
            SK.label(g, 400, 138, "B：" + B.name + "（藍）", { size: 13, color: C.blue.s, anchor: "start" });
            SK.label(g, 400, 166, "兩者都是（紫）", { size: 13, color: C.purple.s, anchor: "start" });
            read.innerHTML = SK.tex("P(A\\cup B)=\\frac{" + nA + "}{36}+\\frac{" + nB + "}{36}-\\frac{" + nAB + "}{36}=\\frac{" + (nA + nB - nAB) + "}{36}", true);
            return;
          }
          if (f === 4) {
            var e = 0, terms = [];
            for (var k2 = 2; k2 <= 12; k2++) { var cnt2 = 6 - Math.abs(7 - k2); e += k2 * cnt2 / 36; }
            SK.label(g, 400, 120, "每個和 × 它的機率", { size: 13, color: C.soft, anchor: "start" });
            SK.label(g, 400, 150, "全部加起來 = " + num(e, 1), { size: 15, color: C.pink.s, anchor: "start" });
            read.innerHTML = SK.tex("E=2\\cdot\\tfrac1{36}+3\\cdot\\tfrac2{36}+\\cdots+12\\cdot\\tfrac1{36}=7", true);
            return;
          }
          read.innerHTML = SK.tex("P(" + A.name.replace("≥", "\\ge ") + ")=\\frac{" + nA + "}{36}=" + num(nA / 36), true);
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "「至少」從反面算", icon: "sparkle",
        html: "「至少一個 6」直接數要小心重複；用餘事件：兩顆都不是 6 有 $5\\times5=25$ 種，所以 $P=1-\\tfrac{25}{36}=\\tfrac{11}{36}$。和「有系統的計數」單元裡的取捨原理得到同樣的答案。" },
      { title: "古典、客觀、主觀", icon: "leaf",
        html: "骰子對稱，所以可以用「數格子」算機率（古典）。圖釘不對稱，只能丟很多次用相對次數估計（客觀）。明天會不會下雨無法重複實驗，只能給一個判斷（主觀）。三種來源不同，但都遵守同樣的機率性質。" }
    ],

    challenges: [
      { q: "擲兩顆骰子，「和是偶數」的機率是多少？", idea: "偶數 = 兩顆同奇或同偶：$3\\times3+3\\times3=18$ 格，機率 $\\tfrac12$。" },
      { q: "從一副 52 張的撲克牌抽一張，是紅色或是 K 的機率？", idea: "$\\tfrac{26}{52}+\\tfrac{4}{52}-\\tfrac{2}{52}=\\tfrac{28}{52}=\\tfrac{7}{13}$。紅色的 K 有 2 張，被算了兩次。" },
      { q: "三個人各自任選一天生日（假設 365 天等可能），至少兩人同一天的機率怎麼算？", idea: "從反面：三人生日都不同的機率是 $\\tfrac{365}{365}\\cdot\\tfrac{364}{365}\\cdot\\tfrac{363}{365}\\approx0.9918$，所以至少兩人同天約 $0.8\\%$。人數到 23 人時，這個機率會超過一半（生日問題）。" }
    ],

    where: {
      codes: [["D-10-4", "複合事件的古典機率：樣本空間與事件、機率的定義與性質、期望值（期望值的深入討論見「期望值」單元）"]],
      exam: "10 年級<b>共同必修</b>，學測數 A、數 B 都考。11 年級的條件機率、12 年級的隨機變數都以它為基礎。",
      stop: "以有限且等可能的樣本空間為主，事件的機率用計數得到。條件機率與獨立性在 11 年級；連續型的機率不在高中範圍。"
    }
  });
})();
