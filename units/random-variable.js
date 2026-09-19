/* 單元：離散型隨機變數的期望值、變異數、標準差 */
(function () {
  var C = SK.C, s = SK.s;

  function hookVisual(el) {
    var svg = SK.svg(el, 420, 240, "兩個期望值一樣的遊戲");
    [["遊戲 A", [[50, 1]], C.blue, 40], ["遊戲 B", [[0, .5], [100, .5]], C.orange, 230]].forEach(function (gm) {
      var x0 = gm[3];
      s("rect", { x: x0, y: 30, width: 160, height: 150, rx: 14, fill: gm[2].f, stroke: C.cocoa, "stroke-width": 1.2 }, svg);
      SK.label(svg, x0 + 80, 54, gm[0], { size: 15 });
      gm[1].forEach(function (o, i) { SK.label(svg, x0 + 80, 96 + i * 30, (o[1] === 1 ? "一定得 " : "一半機會得 ") + o[0] + " 分", { size: 13 }); });
    });
    SK.label(svg, 210, 214, "平均都是 50 分，但感覺完全不一樣", { size: 13, color: C.soft });
  }

  SK.mountUnit({
    slug: "random-variable",
    en: "Center and spread of a random quantity",
    formula: "\\co{\\mu}=E(X)=\\sum x_ip_i,\\qquad \\cb{\\sigma}^2=\\operatorname{Var}(X)=\\sum(x_i-\\co{\\mu})^2p_i",

    hook: {
      html: "遊戲 A：一定得 50 分。遊戲 B：擲一枚硬幣，正面得 100 分，反面得 0 分。",
      ask: "兩個遊戲的平均得分一樣嗎？如果一樣，它們差在哪裡？能不能用一個數字描述這個差別？",
      visual: hookVisual
    },

    guess: {
      q: "遊戲 A 與遊戲 B，哪一個的期望值（平均得分）比較大？",
      options: [
        { t: "遊戲 A", explain: "A 很穩定，但穩定不代表平均比較高。B 的平均是 $100\\times\\frac12+0\\times\\frac12=50$。" },
        { t: "遊戲 B", explain: "B 可能拿到 100，看起來比較多，但也可能拿 0，平均下來剛好也是 50。" },
        { t: "一樣大", truth: true, explain: "兩者期望值都是 50。差別在於「分散程度」：A 永遠在 50，B 永遠離 50 差 50 分。這個分散程度，就是今天要學的<b>變異數</b>與<b>標準差</b>。" },
        { t: "無法比較", common: true, explain: "兩個遊戲的規則很不一樣，直覺上覺得不能比，這很合理！但期望值只看「長期平均」，所以可以比，而且剛好一樣。真正不一樣的是風險。" }
      ]
    },

    derive: {
      intro: "隨機變數 $X$ 可能取 $0,1,2,3,4$。拖動長條頂端改變機率，或按按鈕套用範例。",
      tall: true,
      frames: [
        { cap: "<b>隨機變數</b>把試驗的每個結果對應到一個數。列出每個值的機率，就是它的<b>機率分布</b>。", tex: "P(X=x_i)=p_i,\\quad \\sum p_i=1" },
        { cap: "期望值 $\\mu$ 是分布的平衡點（綠色三角形），也就是長期平均。", tex: "\\co{\\mu}=\\sum x_ip_i" },
        { cap: "每個值離平均有多遠？灰藍色箭頭是<b>偏差</b> $x_i-\\mu$。直接把偏差加權平均會得到 0（正負抵消），所以要先<b>平方</b>。", tex: "\\sum(x_i-\\mu)p_i=0\\ \\Rightarrow\\ \\text{改用}\\ (x_i-\\mu)^2" },
        { cap: "<b>變異數</b>是偏差平方的加權平均：每個值畫一個邊長 $|x_i-\\mu|$ 的正方形，面積乘上機率再加起來。", tex: "\\cb{\\sigma}^2=\\sum(x_i-\\mu)^2p_i=E(X^2)-\\mu^2" },
        { cap: "變異數的單位是「平方」，開根號回到原本的單位，就是<b>標準差</b> $\\sigma$。數線上的淡綠色區間是 $\\mu\\pm\\sigma$，代表「典型的偏離範圍」。", tex: "\\cb{\\sigma}=\\sqrt{\\operatorname{Var}(X)}" }
      ],
      hint: "拖動長條頂端的圓點，或按「穩」「刺激」「均勻」三個範例。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 520, 440, "機率分布、平衡點與偏差");
        var g = s("g", {}, svg), hg = s("g", {}, svg);
        var w = [1, 2, 4, 2, 1];
        var X = function (v) { return 80 + v * 90; }, yb = 300, hs = 340;
        var read = SK.h("div", { class: "readout" });
        var row = SK.h("div", { class: "controls" });
        [["穩", [0, 0, 1, 0, 0]], ["刺激", [1, 0, 0, 0, 1]], ["均勻", [1, 1, 1, 1, 1]], ["偏右", [.5, .5, 1, 2, 4]]].forEach(function (p) {
          var b = SK.h("button", { class: "btn small ghost", type: "button" }, p[0]);
          b.onclick = function () { w = p[1].slice(); draw(); };
          row.appendChild(b);
        });
        ctx.sliders.appendChild(row); ctx.extra.appendChild(read);
        function probs() { var t = w.reduce(function (a, b) { return a + b; }, 0) || 1; return w.map(function (x) { return x / t; }); }
        var handles = w.map(function (_, i) {
          var hd = SK.handle(hg, 0, 0, C.orange.s, "X=" + i + " 的機率");
          SK.drag(svg, hd, function (x, y) {
            var p = SK.clamp((yb - y) / hs, 0, .8), pr = probs(), others = 1 - pr[i];
            w = pr.map(function (q, j) { return j === i ? p : (others > 1e-9 ? q / others * (1 - p) : (1 - p) / 4); });
            draw();
          }, function () { return [X(i), yb - probs()[i] * hs]; }, 10);
          return hd;
        });
        function draw() {
          var f = ctx.frame, p = probs();
          var mu = p.reduce(function (a, q, i) { return a + q * i; }, 0);
          var v = p.reduce(function (a, q, i) { return a + q * (i - mu) * (i - mu); }, 0), sd = Math.sqrt(v);
          g.innerHTML = "";
          s("line", { x1: 40, y1: yb, x2: 490, y2: yb, stroke: C.cocoa, "stroke-width": 1.6 }, g);
          if (f >= 4) s("rect", { x: X(mu - sd), y: yb + 4, width: X(mu + sd) - X(mu - sd), height: 12, rx: 6, fill: C.mint.f, stroke: C.green.s }, g);
          for (var i = 0; i < 5; i++) {
            var h = p[i] * hs;
            s("rect", { x: X(i) - 22, y: yb - h, width: 44, height: h, rx: 4, fill: C.orange.f, stroke: C.orange.s, "stroke-width": 1.2 }, g);
            SK.label(g, X(i), yb + 30, String(i), { size: 15 });
            SK.label(g, X(i), yb - h - 20, SK.fmt(p[i], 2), { size: 11, color: C.soft });
            handles[i].moveTo(X(i), yb - h);
            if (f === 2 && p[i] > .001) SK.arrow(g, X(mu), yb + 48 + i * 7, X(i), yb + 48 + i * 7, C.blue.s, 1.8);
            if (f === 3 && p[i] > .001) {
              var side = Math.abs(i - mu) * 30;
              s("rect", { x: X(i) - side / 2, y: yb + 40, width: side, height: side, fill: C.blue.f, stroke: C.blue.s, opacity: .35 + p[i] }, g);
            }
          }
          if (f >= 1) {
            s("path", { d: "M" + X(mu) + " " + (yb + 2) + " l-12 24 h24z", fill: C.green.f, stroke: C.cocoa, "stroke-width": 1.3 }, g);
            if (f < 2) SK.label(g, X(mu), yb + 40, "μ = " + SK.fmt(mu, 2), { size: 13, color: C.green.s });
          }
          if (f === 3) SK.label(g, 480, 430, "正方形邊長 = 偏差；顏色越深 = 機率越大", { size: 11, anchor: "end", color: C.soft });
          read.innerHTML = SK.tex("\\mu=" + SK.fmt(mu, 3) + (f >= 3 ? ",\\quad \\sigma^2=" + SK.fmt(v, 3) : "") + (f >= 4 ? ",\\quad \\sigma=" + SK.fmt(sd, 3) : ""), true);
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "線性變換：加分與乘分", icon: "sparkle",
        html: "老師把每個人的分數都乘 $a$ 再加 $b$：$Y=aX+b$。平均跟著變成 $a\\mu+b$；但加 $b$ 只是整體平移，不改變分散程度，所以標準差變成 $|a|\\sigma$、變異數變成 $a^2\\sigma^2$。$$E(aX+b)=aE(X)+b,\\qquad \\operatorname{Var}(aX+b)=a^2\\operatorname{Var}(X).$$" },
      { title: "為什麼要平方，不取絕對值？", icon: "leaf",
        html: "取絕對值的「平均絕對偏差」也可以描述分散程度，而且更直觀。但平方有一個超好用的性質：兩個<b>獨立</b>隨機變數相加時，變異數也直接相加：$\\operatorname{Var}(X+Y)=\\operatorname{Var}(X)+\\operatorname{Var}(Y)$。這讓二項分布的變異數 $np(1-p)$ 可以一次算出來。" }
    ],

    challenges: [
      { q: "開頭的遊戲 A、B，標準差各是多少？", idea: "A：$\\sigma=0$。B：$\\sigma^2=(0-50)^2\\cdot\\frac12+(100-50)^2\\cdot\\frac12=2500$，$\\sigma=50$。期望值一樣，風險差很多。" },
      { q: "擲一顆公正骰子，點數的變異數是多少？", hint: "用 $E(X^2)-\\mu^2$ 比較快，$\\mu=3.5$。",
        idea: "$E(X^2)=\\frac{1+4+9+16+25+36}{6}=\\frac{91}{6}$，$\\operatorname{Var}=\\frac{91}{6}-\\frac{49}{4}=\\frac{35}{12}\\approx2.92$。" },
      { q: "全班分數的標準差是 8 分。如果老師把每個人的分數都乘 1.2 再加 10 分，新的標準差是多少？", idea: "$1.2\\times8=9.6$ 分。加 10 分不影響分散程度。" }
    ],

    where: {
      codes: [["D-12甲-1", "離散型隨機變數：期望值、變異數、標準差、獨立性、伯努力試驗與重複試驗"]],
      exam: "12 年級<b>選修數學甲</b>，分科測驗數甲的範圍。高一「期望值」的延伸：從只看平均，到同時看中心與分散。",
      stop: "不涉及連續型隨機變數，所以常態分布、信賴區間都不在範圍內。評量重在意義，標準差與變異數不應流於繁複手算，有實例時可用計算機。"
    }
  });
})();
