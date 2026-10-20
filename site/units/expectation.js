/* 單元：期望值 */
(function () {
  var C = SK.C, s = SK.s;

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 240, "夜市的抽獎攤位");
    s("rect", { x: 90, y: 40, width: 220, height: 150, rx: 14, fill: "#FDFBF6", stroke: C.cocoa, "stroke-width": 1.4 }, svg);
    s("path", { d: "M90 70 Q145 40 200 70 Q255 40 310 70", fill: C.orange.f, stroke: C.cocoa, "stroke-width": 1.2 }, svg);
    SK.label(svg, 200, 96, "一次 50 元", { size: 15 });
    [["頭獎 500 元", "機率 5%"], ["小獎 50 元", "機率 20%"], ["銘謝惠顧", "機率 75%"]].forEach(function (r, i) {
      SK.label(svg, 112, 126 + i * 22, r[0], { size: 12, anchor: "start" });
      SK.label(svg, 288, 126 + i * 22, r[1], { size: 12, anchor: "end", color: C.soft });
    });
    SK.label(svg, 200, 222, "玩很多次，平均會賺還是賠？", { size: 13, color: C.soft });
  }

  function fairAngle(el) {
    var wrap = SK.h("div", { class: "two-col" });
    var left = SK.h("div", {}), side = SK.h("div", { class: "sliders" });
    wrap.appendChild(left); wrap.appendChild(side); el.appendChild(wrap);
    var stt = { price: 50 };
    function draw() {
      var E = 500 * .05 + 50 * .2 + 0 * .75, net = E - stt.price;
      left.innerHTML = '<div class="readout">' + SK.tex("E(\\text{獎金})=500\\times0.05+50\\times0.2+0\\times0.75=" + E, true) +
        SK.tex("E(\\text{淨賺})=" + E + "-" + stt.price + "=" + (net > 0 ? "\\cg{" + net + "}" : "\\cp{" + net + "}"), true) + "</div>" +
        '<p class="muted" style="font-size:.95rem">' + (net < 0 ? "平均每玩一次賠 " + (-net) + " 元：玩得越多，平均結果越接近這個數。" : net === 0 ? "剛好公平：長期下來不賺也不賠。" : "平均每次賺 " + net + " 元，老闆大概不會這樣定價！") + "</p>";
    }
    side.appendChild(SK.slider({ label: "票價", min: 10, max: 60, value: stt.price, fmt: function (v) { return v + " 元"; }, onInput: function (v) { stt.price = v; draw(); } }).el);
    side.insertAdjacentHTML("beforeend", '<p class="muted" style="margin:0;font-size:.95rem">' + SK.md("開頭的攤位：票價調到多少才算「公平」？期望值告訴你長期的平均，但不保證任何一次的結果。") + "</p>");
    draw();
  }

  SK.mountUnit({
    slug: "expectation",
    en: "Where the long-run average settles",
    formula: "E=\\sum \\co{x_i}\\,\\cb{p_i}=\\co{x_1}\\cb{p_1}+\\co{x_2}\\cb{p_2}+\\cdots+\\co{x_n}\\cb{p_n}",

    hook: {
      html: "夜市的抽獎攤位：一次 50 元，5% 抽中 500 元、20% 抽中 50 元，其餘什麼都沒有。",
      ask: "玩一次可能大賺也可能全賠。如果玩很多很多次，平均下來每次會賺還是賠？賺賠多少？",
      visual: hookVisual
    },

    guess: {
      q: "擲一顆公正的骰子，點數的期望值（長期平均）是多少？",
      options: [
        { t: "3", common: true, explain: "1 到 6 的「中間」感覺是 3，這個直覺很接近了！但 1 到 6 的正中間其實是 $\\frac{1+6}{2}=3.5$，剛好在 3 和 4 之間。" },
        { t: "3.5", truth: true, explain: "$\\frac{1+2+3+4+5+6}{6}=3.5$。骰子永遠擲不出 3.5，但擲很多次的平均會越來越接近 3.5。期望值是「長期平均」，不一定是會出現的值。" },
        { t: "6", explain: "6 是最大值。期望值要把每一種結果都考慮進去，大的小的都算。" },
        { t: "每次都不一樣，沒有答案", explain: "每一次的結果確實不一樣！但「很多次的平均」會穩定下來，那個穩定的值就是期望值。" }
      ]
    },

    derive: {
      intro: "下面的長條是每一種點數的機率，可以上下拖動長條頂端，做出一顆「不公正」的骰子。",
      tall: true,
      frames: [
        { cap: "一顆公正骰子：六種結果，每種機率 $\\frac16$。把機率畫成數線上的長條。", tex: "P(1)=P(2)=\\cdots=P(6)=\\tfrac16" },
        { cap: "按「擲 500 次」，看累積平均怎麼變。一開始跳來跳去，擲越多次越穩定。", tex: "\\text{平均}=\\frac{\\text{總點數}}{\\text{次數}}\\ \\longrightarrow\\ ?" },
        { cap: "長期平均穩定在哪裡？每種點數大約出現「機率 × 次數」次，所以平均就是「點數 × 機率」全部加起來。", tex: "E=1\\cdot\\tfrac16+2\\cdot\\tfrac16+\\cdots+6\\cdot\\tfrac16=3.5" },
        { cap: "把機率想成放在數線上的<b>重量</b>：期望值就是讓這根蹺蹺板<b>平衡</b>的支點。", tex: "\\sum (x_i-E)\\,p_i=0" },
        { cap: "拖動長條，讓骰子偏向大點數：支點跟著往右移。重量放在哪裡，平衡點就往哪裡跑。", tex: "E=\\sum x_i\\,p_i" }
      ],
      hint: "拖動長條頂端的圓點改變機率（會自動重新調整成總和 1）。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 520, 440, "骰子點數的機率長條、平衡點與累積平均");
        var g = s("g", {}, svg), hg = s("g", {}, svg);
        var w = [1, 1, 1, 1, 1, 1], rolls = [];
        var X = function (v) { return 60 + (v - .5) * 70; }, yb = 370, hs = 480;
        var read = SK.h("div", { class: "readout" });
        var btn = SK.h("button", { class: "btn small", type: "button" }, "擲 500 次");
        var btn2 = SK.h("button", { class: "btn small ghost", type: "button" }, "清除");
        var ctr = SK.h("div", { class: "controls" }); ctr.appendChild(btn); ctr.appendChild(btn2);
        ctx.sliders.appendChild(ctr); ctx.extra.appendChild(read);
        function probs() { var t = w.reduce(function (a, b) { return a + b; }, 0); return w.map(function (x) { return x / t; }); }
        function E() { var p = probs(); return p.reduce(function (a, q, i) { return a + q * (i + 1); }, 0); }
        btn.onclick = function () {
          var p = probs(), cum = [];
          p.reduce(function (a, q, i) { cum[i] = a + q; return cum[i]; }, 0);
          for (var k = 0; k < 500; k++) { var r = Math.random(), v = 1; while (v < 6 && r > cum[v - 1]) v++; rolls.push(v); }
          if (ctx.frame < 1) SK.players.forEach(function (pl) { if (pl.root.contains(ctx.stage)) pl.go(1); });
          draw();
        };
        btn2.onclick = function () { rolls = []; draw(); };
        var handles = w.map(function (_, i) {
          var hd = SK.handle(hg, 0, 0, C.orange.s, "點數 " + (i + 1) + " 的機率");
          SK.drag(svg, hd, function (x, y) {
            var p = SK.clamp((yb - y) / hs, .01, .45);
            var others = probs().reduce(function (a, q, j) { return j === i ? a : a + q; }, 0);
            // 讓第 i 個的機率變成 p，其他按比例縮放
            var t = w.reduce(function (a, b) { return a + b; }, 0);
            w = w.map(function (x, j) { return j === i ? p : (x / t) / others * (1 - p); });
            rolls = []; draw();
          }, function () { return [X(i + 1), yb - probs()[i] * hs]; }, 10);
          return hd;
        });
        function draw() {
          var f = ctx.frame, p = probs(), e = E();
          g.innerHTML = "";
          // 上方：累積平均
          var top = 30, hh = 110;
          s("rect", { x: 40, y: top, width: 460, height: hh, rx: 8, fill: "rgba(253,251,246,.7)", stroke: C.line, "stroke-width": 1 }, g);
          var Ya = function (v) { return top + hh - (v - 1) / 5 * hh; };
          s("line", { x1: 40, y1: Ya(e), x2: 500, y2: Ya(e), stroke: C.green.s, "stroke-dasharray": "6 5", "stroke-width": 1.4 }, g);
          SK.label(g, 496, Ya(e) - 9, "E = " + SK.fmt(e, 2), { size: 12, anchor: "end", color: C.green.s });
          if (rolls.length) {
            var sum = 0, d = "";
            rolls.forEach(function (r, k) { sum += r; d += (k ? "L" : "M") + (40 + (k + 1) / rolls.length * 460).toFixed(1) + " " + Ya(sum / (k + 1)).toFixed(1); });
            s("path", { d: d, fill: "none", stroke: C.orange.s, "stroke-width": 1.6 }, g);
          } else SK.label(g, 270, top + hh / 2, "按「擲 500 次」看累積平均", { size: 13, color: C.soft });
          SK.label(g, 44, top - 12, "累積平均（擲的次數 →）", { size: 12, anchor: "start", color: C.soft });
          // 下方：長條與蹺蹺板
          s("line", { x1: 40, y1: yb, x2: 500, y2: yb, stroke: C.cocoa, "stroke-width": f >= 3 ? 3.4 : 1.3 }, g);
          for (var i = 0; i < 6; i++) {
            var h = p[i] * hs;
            s("rect", { x: X(i + 1) - 18, y: yb - h, width: 36, height: h, rx: 4, fill: C.blue.f, stroke: C.blue.s, "stroke-width": 1.2 }, g);
            SK.label(g, X(i + 1), yb + 18, String(i + 1), { size: 14 });
            SK.label(g, X(i + 1), yb - h - 20, SK.fmt(p[i], 3), { size: 11, color: C.soft });
            handles[i].moveTo(X(i + 1), yb - h);
            handles[i].style.display = f >= 4 ? "" : "none";
          }
          if (f >= 3) {
            var fx = X(e);
            s("path", { d: "M" + fx + " " + (yb + 2) + " l-14 28 h28z", fill: C.green.f, stroke: C.cocoa, "stroke-width": 1.4 }, g);
            SK.label(g, fx, yb + 44, "支點 " + SK.fmt(e, 2), { size: 13, color: C.green.s });
          }
          var avg = rolls.length ? rolls.reduce(function (a, b) { return a + b; }, 0) / rolls.length : null;
          read.innerHTML = SK.tex("E=" + p.map(function (q, i) { return (i + 1) + "\\times" + SK.fmt(q, 3); }).join("+") + "\\approx" + SK.fmt(e, 3), true) +
            (avg != null ? SK.tex("\\text{實際擲了 }" + rolls.length + "\\text{ 次，平均}=" + SK.fmt(avg, 3), true) : "");
        }
        return { show: function (i) { if (i < 4) { w = [1, 1, 1, 1, 1, 1]; } draw(); } };
      }
    },

    angles: [
      { title: "公平的票價是多少？", icon: "sparkle", render: fairAngle },
      { title: "期望值可以相加", icon: "leaf",
        html: "擲兩顆骰子，點數和的期望值是多少？不用列出 36 種情況：一顆是 3.5，兩顆就是 $3.5+3.5=7$。期望值有「可以拆開相加」的好性質，這讓很多看起來複雜的問題變得很簡單。這也和最常出現的點數和剛好是 7 相呼應。" }
    ],

    challenges: [
      { q: "開頭的抽獎攤位，玩一次的期望淨賺是多少？", idea: "期望獎金 $500\\times0.05+50\\times0.2=35$ 元，扣掉 50 元，期望淨賺 $-15$ 元：平均每玩一次賠 15 元。" },
      { q: "丟一枚硬幣直到出現正面為止，平均要丟幾次？", hint: "丟 $k$ 次才成功的機率是 $\\left(\\tfrac12\\right)^k$，期望值是 $\\sum k\\left(\\tfrac12\\right)^k$。也可以想：第一次失敗後，情況和一開始一模一樣。",
        idea: "設答案為 $E$：一半機會 1 次就成功，一半機會失敗後「重新開始」，所以 $E=\\tfrac12\\cdot1+\\tfrac12(1+E)$，得 $E=2$。這個「自我相似」的想法在數甲的幾何分布還會再見到。" },
      { q: "保險公司賣給你的保險，對你的期望淨值通常是負的。那為什麼買保險仍然可能是合理的選擇？", idea: "期望值只看長期平均，但一個人只活一次：一次意外的損失可能大到承受不起。用小小的確定成本換掉「很小機率的巨大損失」，考慮的是風險，而不只是平均。這沒有標準答案，很值得討論。" }
    ],

    where: {
      codes: [["D-10-4", "複合事件的古典機率：樣本空間、事件、機率性質、期望值"]],
      exam: "高一共同必修，學測數 A、數 B 都在範圍內。數甲的離散型隨機變數（`D-12甲-1`）會把期望值擴充成完整的分布模型，並加上變異數。",
      stop: "高一只談有限多種結果的期望值與它的意義。變異數、標準差、二項分布與幾何分布是數甲的內容；複雜的同物排列、分堆問題只在有情境時補充。"
    }
  });
})();
