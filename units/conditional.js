/* 單元：條件機率與貝氏定理 */
(function () {
  var C = SK.C, s = SK.s;

  function counts(st) {
    var N = 1000, sick = Math.round(N * st.prev), well = N - sick;
    var tp = Math.round(sick * st.sens), fp = Math.round(well * st.fpr);
    return { N: N, sick: sick, well: well, tp: tp, fn: sick - tp, fp: fp, tn: well - fp };
  }

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 240, "一張檢驗報告顯示陽性");
    s("rect", { x: 110, y: 30, width: 180, height: 190, rx: 12, fill: "#FDFBF6", stroke: C.cocoa, "stroke-width": 1.4 }, svg);
    s("rect", { x: 170, y: 20, width: 60, height: 18, fill: "rgba(188,208,205,.9)", transform: "rotate(-3 200 29)" }, svg);
    SK.label(svg, 200, 70, "篩檢報告", { size: 16 });
    [["盛行率", "1%"], ["患者驗出陽性", "90%"], ["健康者誤判陽性", "10%"]].forEach(function (r, i) {
      SK.label(svg, 128, 104 + i * 26, r[0], { size: 12, anchor: "start", color: C.soft });
      SK.label(svg, 272, 104 + i * 26, r[1], { size: 12, anchor: "end" });
    });
    s("rect", { x: 150, y: 176, width: 100, height: 30, rx: 8, fill: C.pink.f, stroke: C.pink.s, "stroke-width": 1.4 }, svg);
    SK.label(svg, 200, 191, "結果：陽性", { size: 14, color: C.pink.s });
  }

  function tableAngle(el) {
    var st = { prev: .01, sens: .9, fpr: .1 }, c = counts(st);
    var td = function (v, style) { return '<td style="padding:8px 14px;text-align:center;border:1px solid rgba(74,63,55,.35);' + (style || "") + '">' + v + "</td>"; };
    el.innerHTML = '<div style="overflow-x:auto"><table style="border-collapse:collapse;margin:0 auto;font-variant-numeric:tabular-nums">' +
      "<tr>" + td("") + td("<b>陽性</b>") + td("<b>陰性</b>") + td("合計") + "</tr>" +
      "<tr>" + td("<b>生病</b>") + td(c.tp, "background:#FAE8DD") + td(c.fn) + td(c.sick, "background:#F4EBD6") + "</tr>" +
      "<tr>" + td("<b>健康</b>") + td(c.fp, "background:#E3ECEA") + td(c.tn) + td(c.well) + "</tr>" +
      "<tr>" + td("合計") + td(c.tp + c.fp, "background:#E8EDE1") + td(c.fn + c.tn) + td(c.N) + "</tr></table></div>" +
      '<p style="margin:14px 0 0">' + SK.md("同一張表，兩種問法：<br>• 「生病的人裡，有多少驗出陽性？」看<b>生病那一列</b>：$P(\\text{陽}\\mid\\text{病})=\\dfrac{9}{10}=90\\%$。<br>• 「驗出陽性的人裡，有多少真的生病？」看<b>陽性那一欄</b>：$P(\\text{病}\\mid\\text{陽})=\\dfrac{9}{108}\\approx8.3\\%$。<br>分子一樣是 9，分母不同，答案就差了十倍以上。") + "</p>";
  }

  SK.mountUnit({
    slug: "conditional",
    en: "When new information arrives, update your belief",
    formula: "P(A\\mid B)=\\frac{P(A\\cap B)}{P(B)},\\qquad P(\\co{病}\\mid\\cb{陽})=\\frac{P(\\co{病})P(\\cb{陽}\\mid\\co{病})}{P(\\cb{陽})}",

    hook: {
      html: "某種疾病在人群中的盛行率是 1%。有一種篩檢：真正生病的人有 90% 會驗出陽性；健康的人也有 10% 會被誤判成陽性。",
      ask: "你驗出陽性了。你真的生病的機率是多少？先寫下你的直覺。",
      visual: hookVisual
    },

    guess: {
      q: "驗出陽性的人，真正生病的機率大約是？",
      options: [
        { t: "90%", common: true, explain: "90% 是「生病的人驗出陽性」的比例，$P(\\text{陽}\\mid\\text{病})$。題目問的卻是反過來的 $P(\\text{病}\\mid\\text{陽})$。這兩個很容易混在一起，連醫生在研究裡也常答錯。" },
        { t: "大約 8%", truth: true, explain: "1000 人中只有 10 人生病，其中 9 人陽性；990 位健康的人中卻有 99 人被誤判陽性。陽性的 108 人裡，真正生病的只有 9 人，約 8.3%。因為健康的人太多了，誤判的絕對人數反而更多。" },
        { t: "50%", explain: "「不是有病就是沒病，所以一半一半」是很常見的想法，但兩種情況的可能性並不相等。" },
        { t: "1%", explain: "1% 是還沒檢查之前的機率（先驗）。陽性這個新證據確實會提高你的機率，只是提高的幅度比直覺小很多。" }
      ]
    },

    derive: {
      intro: "不背公式，直接數人頭：想像 1000 個人。拖動滑桿改變盛行率與檢驗的準確度。",
      frames: [
        { cap: "想像 1000 個人，每一點代表一個人。", tex: "N=1000" },
        { cap: "其中盛行率 1% 的人生病（玫瑰色）。", tex: "\\co{\\text{生病}}=1000\\times P(\\text{病})" },
        { cap: "生病的人裡，90% 驗出陽性（加上外框）。", tex: "\\co{\\text{病}}\\cap\\cb{\\text{陽}}=\\text{生病人數}\\times P(\\text{陽}\\mid\\text{病})" },
        { cap: "但健康的人裡，也有 10% 被誤判為陽性。健康的人非常多，所以這一群也不少。", tex: "\\text{健康}\\cap\\cb{\\text{陽}}=\\text{健康人數}\\times P(\\text{陽}\\mid\\text{健康})" },
        { cap: "現在你知道自己是陽性：<b>樣本空間縮小了</b>，只剩下有外框的人。其他人都和你無關。", tex: "\\text{新的樣本空間}=\\cb{\\text{陽性的人}}" },
        { cap: "在陽性的人裡，真正生病的比例就是答案。把人數換回機率，就是<b>貝氏定理</b>；分母 $P(\\text{陽})=P(\\text{病})P(\\text{陽}\\mid\\text{病})+P(\\text{健})P(\\text{陽}\\mid\\text{健})$。", tex: "\\begin{aligned}P(\\co{\\text{病}}\\mid\\cb{\\text{陽}})&=\\frac{\\co{\\text{病}}\\cap\\cb{\\text{陽}}\\text{ 的人數}}{\\cb{\\text{陽}}\\text{ 的人數}}\\\\&=\\frac{P(\\text{病})\\,P(\\text{陽}\\mid\\text{病})}{P(\\text{陽})}\\end{aligned}" }
      ],
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 520, 360, "1000 個人的點陣圖");
        var g = s("g", {}, svg);
        var st = { prev: .01, sens: .9, fpr: .1 };
        var read = SK.h("div", { class: "readout" });
        [["prev", "盛行率", .005, .2, .005, "", function (v) { return SK.fmt(v * 100, 1) + "%"; }],
         ["sens", "病→陽", .5, 1, .01, "blue", function (v) { return Math.round(v * 100) + "%"; }],
         ["fpr", "健→陽", 0, .3, .01, "green", function (v) { return Math.round(v * 100) + "%"; }]].forEach(function (d) {
          ctx.sliders.appendChild(SK.slider({ label: d[1], min: d[2], max: d[3], step: d[4], value: st[d[0]], color: d[5], fmt: d[6], onInput: function (v) { st[d[0]] = v; draw(); } }).el);
        });
        ctx.extra.appendChild(read);
        function draw() {
          var f = ctx.frame, c = counts(st), cols = 40, gap = 12.4, x0 = 18, y0 = 22;
          g.innerHTML = "";
          // 健康者中的陽性分散開來，避免都擠在一起
          var fpIdx = {};
          for (var k = 0; k < c.fp; k++) fpIdx[c.sick + Math.floor((k + .5) * c.well / c.fp)] = true;
          for (var i = 0; i < c.N; i++) {
            var x = x0 + (i % cols) * gap + gap / 2, y = y0 + Math.floor(i / cols) * gap + gap / 2;
            var sick = i < c.sick, pos = sick ? i < c.tp : !!fpIdx[i];
            var show = f < 4 || pos;
            var fill = f >= 1 && sick ? "#D9A1A5" : "#DDD3C4";
            var circ = s("circle", { cx: x, cy: y, r: 3.8, fill: fill, opacity: show ? 1 : .15 }, g);
            var mark = (f >= 2 && sick && pos) || (f >= 3 && !sick && pos);
            if (mark) { circ.setAttribute("stroke", C.cocoa); circ.setAttribute("stroke-width", 1.4); }
          }
          var pPos = c.tp + c.fp;
          var lines = [
            SK.tex("\\text{生病 }" + c.sick + "\\text{ 人，其中陽性 }" + c.tp + "\\text{；健康 }" + c.well + "\\text{ 人，其中陽性 }" + c.fp, true)
          ];
          if (f >= 4) lines.push(SK.tex("P(\\text{病}\\mid\\text{陽})=\\frac{" + c.tp + "}{" + c.tp + "+" + c.fp + "}\\approx" + SK.fmt(pPos ? c.tp / pPos * 100 : 0, 1) + "\\%", true));
          read.innerHTML = lines.join("");
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "列聯表：同一張表的兩種分母", icon: "sparkle", render: tableAngle },
      { title: "再驗一次會怎樣？", icon: "leaf",
        html: "第一次陽性後，你生病的機率從 1% 更新成約 8.3%。如果再做一次獨立的檢驗又是陽性，就把 8.3% 當成新的「盛行率」再算一次：$$\\frac{0.083\\times0.9}{0.083\\times0.9+0.917\\times0.1}\\approx45\\%.$$ 證據一次一次累積，信念一步一步更新，這就是貝氏思考。它也說明了為什麼醫院常用「篩檢陽性再做確診檢查」的流程。" }
    ],

    challenges: [
      { q: "把盛行率改成 10%（其他不變），陽性的人真正生病的機率變成多少？在上面的點陣圖驗證看看。", hint: "1000 人中 100 人生病，90 人陽性；900 人健康，90 人誤判陽性。",
        idea: "$\\dfrac{90}{90+90}=50\\%$。同一台機器，用在不同的族群，陽性的意義完全不同，關鍵就是「基準率」。" },
      { q: "什麼叫做兩個事件<b>獨立</b>？用條件機率說說看。", idea: "$P(A\\mid B)=P(A)$：知道 $B$ 發生，對 $A$ 的機率完全沒有影響。等價的說法是 $P(A\\cap B)=P(A)P(B)$。在點陣圖裡，就是陽性的比例在生病和健康兩群裡一樣。" },
      { q: "如果想讓「陽性就幾乎一定生病」，你會改善檢驗的哪一個數字：病→陽，還是健→陽？為什麼？", idea: "盛行率低的時候，誤判主要來自龐大的健康人群，所以要壓低「健→陽」（偽陽性率）。把它從 10% 降到 1%，$P(\\text{病}\\mid\\text{陽})$ 就從約 8% 提高到約 48%。" }
    ],

    where: {
      codes: [["D-11A-2", "（數 A）條件機率、獨立事件及應用"], ["D-11A-3", "（數 A）條件機率乘法公式、貝氏定理及應用"], ["D-11B-2", "（數 B）條件機率、貝氏定理、獨立事件、列聯表與文氏圖"]],
      exam: "11 年級數 A、數 B 都有，學測數 A、數 B 都在範圍內。數 A 可做較完整的綜合題；數 B 強調列聯表與文氏圖的資料解讀。",
      stop: "數 B 的複合事件原則上以兩事件為限。不需要連續分布的貝氏推論；先用「每一千人」這樣的自然頻數把道理說清楚，再寫成公式。"
    }
  });
})();
