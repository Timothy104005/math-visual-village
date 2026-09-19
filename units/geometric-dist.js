/* 單元：幾何分布 */
(function () {
  var C = SK.C, s = SK.s;

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 240, "扭蛋機");
    s("rect", { x: 140, y: 30, width: 120, height: 110, rx: 50, fill: "rgba(207,224,211,.6)", stroke: C.cocoa, "stroke-width": 1.4 }, svg);
    [[170, 70, C.orange], [205, 60, C.blue], [230, 85, C.pink], [185, 100, C.gold], [220, 110, C.green]].forEach(function (b) { s("circle", { cx: b[0], cy: b[1], r: 13, fill: b[2].f, stroke: b[2].s }, svg); });
    s("rect", { x: 150, y: 140, width: 100, height: 60, rx: 8, fill: "#FDFBF6", stroke: C.cocoa, "stroke-width": 1.4 }, svg);
    s("circle", { cx: 200, cy: 170, r: 12, fill: "none", stroke: C.cocoa, "stroke-width": 1.4 }, svg);
    SK.label(svg, 300, 60, "隱藏款", { size: 13, anchor: "start" });
    SK.label(svg, 300, 80, "機率 1/10", { size: 13, anchor: "start", color: C.pink.s });
    SK.label(svg, 200, 226, "平均要轉幾次，才抽到第一個隱藏款？", { size: 13, color: C.soft });
  }

  function sim(el) {
    var wrap = SK.h("div", { class: "two-col" });
    var st = SK.h("div", { class: "stage" }), side = SK.h("div", { class: "sliders" });
    wrap.appendChild(st); wrap.appendChild(side); el.appendChild(wrap);
    var svg = SK.svg(st, 420, 260, "模擬等待次數的分布");
    var g = s("g", {}, svg), data = [], p = .2;
    function draw() {
      g.innerHTML = "";
      var K = 20, cnt = new Array(K + 1).fill(0);
      data.forEach(function (k) { cnt[Math.min(k, K)]++; });
      var n = data.length || 1, X = function (k) { return 20 + k * 19; };
      s("line", { x1: 20, y1: 230, x2: 410, y2: 230, class: "m-axis" }, g);
      for (var k = 1; k <= K; k++) {
        var th = Math.pow(1 - p, k - 1) * p, h = cnt[k] / n * 700;
        s("rect", { x: X(k) - 7, y: 230 - h, width: 14, height: h, fill: C.orange.f, stroke: C.orange.s, "stroke-width": .8 }, g);
        s("circle", { cx: X(k), cy: 230 - th * 700, r: 3, fill: C.blue.s }, g);
        if (k % 2) SK.label(g, X(k), 244, String(k), { size: 10, color: C.soft });
      }
      var avg = data.length ? data.reduce(function (a, b) { return a + b; }, 0) / data.length : 0;
      out.innerHTML = SK.tex(data.length ? "\\text{模擬 }" + data.length + "\\text{ 次，平均等待 }" + SK.fmt(avg, 2) + "\\text{ 次}\\quad(\\tfrac1p=" + SK.fmt(1 / p, 2) + ")" : "\\tfrac1p=" + SK.fmt(1 / p, 2), true);
    }
    var out = SK.h("div", { class: "readout" });
    side.appendChild(SK.slider({ label: "$p$", min: .05, max: .6, step: .05, value: p, onInput: function (v) { p = v; data = []; draw(); } }).el);
    var b = SK.h("button", { class: "btn small", type: "button" }, "模擬 500 次");
    b.onclick = function () { for (var i = 0; i < 500; i++) { var k = 1; while (Math.random() >= p && k < 200) k++; data.push(k); } draw(); };
    side.appendChild(b); side.appendChild(out);
    side.insertAdjacentHTML("beforeend", '<p class="muted" style="margin:0;font-size:.92rem">' + SK.md("蜜桃色長條是模擬的相對次數，灰藍色點是理論機率 $(1-p)^{k-1}p$。模擬越多次，平均等待次數越接近 $\\frac1p$。") + "</p>");
    draw();
  }

  SK.mountUnit({
    slug: "geometric-dist",
    en: "How long until the first success?",
    formula: "P(X=\\co{k})=(1-\\cb{p})^{\\co{k}-1}\\cb{p},\\qquad E(X)=\\frac1{\\cb{p}}",

    hook: {
      html: "扭蛋機裡的隱藏款，每一次轉出來的機率都是 $\\frac1{10}$，而且每次都互不影響。",
      ask: "平均要轉幾次，才會轉到第一個隱藏款？轉 10 次就一定會有嗎？",
      visual: hookVisual
    },

    guess: {
      q: "隱藏款機率 $\\frac1{10}$。下面哪一句是對的？",
      options: [
        { t: "轉 10 次一定會抽到", common: true, explain: "機率 $\\frac1{10}$ 很容易讓人以為「10 次一定中一次」。但 10 次都沒中的機率是 $0.9^{10}\\approx35\\%$，大約三個人裡就有一個轉了 10 次還是沒有。" },
        { t: "平均要轉 10 次", truth: true, explain: "第一次成功所需次數的期望值是 $\\frac1p=10$。平均是 10 次，但有人第 1 次就中，也有人要 20、30 次。" },
        { t: "平均要轉 5 次", explain: "一半的人大約在第 7 次以前就會抽到（$0.9^7\\approx0.48$），但平均數會被少數運氣很差、等很久的人往上拉，所以是 10 次。" },
        { t: "已經連續沒中 9 次，第 10 次中的機率會變高", explain: "每次轉都是獨立的，第 10 次的機率仍然是 $\\frac1{10}$。這種「快輪到我了」的錯覺叫做賭徒謬誤。" }
      ]
    },

    derive: {
      intro: "每一次試驗成功機率都是 $p$、彼此獨立。$X$ 是「第一次成功時，一共試了幾次」。拖動滑桿改變 $p$。",
      tall: true,
      frames: [
        { cap: "第一次成功發生在第 $k$ 次，代表前面 $k-1$ 次都失敗、第 $k$ 次成功。", tex: "P(X=k)=\\underbrace{(1-p)\\cdots(1-p)}_{k-1\\text{ 次失敗}}\\cdot p" },
        { cap: "把機率畫成長條：每往右一格就乘上 $1-p$，是一個一路遞減的等比數列。這就是<b>幾何分布</b>名字的由來。", tex: "p,\\ (1-p)p,\\ (1-p)^2p,\\ \\dots" },
        { cap: "所有長條加起來是 1：這是一個無窮等比級數，首項 $p$、公比 $1-p$。", tex: "\\sum_{k=1}^{\\infty}(1-p)^{k-1}p=\\frac{p}{1-(1-p)}=1" },
        { cap: "期望值：第一次成功機率 $p$，就結束（1 次）；失敗的話，已經用掉 1 次，而且情況和一開始一模一樣。", tex: "E=p\\cdot1+(1-p)(1+E)\\ \\Rightarrow\\ E=\\frac1p" },
        { cap: "<b>無記憶性</b>：已經失敗 $m$ 次之後，「還要再等幾次」的分布和一開始完全一樣（蜜桃色長條往右平移後，形狀相同）。", tex: "\\begin{aligned}P(X>m+k\\mid X>m)&=P(X>k)\\\\&=(1-p)^k\\end{aligned}" }
      ],
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 520, 420, "幾何分布的機率長條");
        var g = s("g", {}, svg);
        var st = { p: .3, m: 3 };
        var read = SK.h("div", { class: "readout" });
        ctx.sliders.appendChild(SK.slider({ label: "$p$", min: .05, max: .8, step: .05, value: st.p, onInput: function (v) { st.p = v; draw(); } }).el);
        var slM = SK.slider({ label: "已失敗", min: 1, max: 8, value: st.m, color: "blue", fmt: function (v) { return v + " 次"; }, onInput: function (v) { st.m = v; draw(); } });
        ctx.sliders.appendChild(slM.el); ctx.extra.appendChild(read);
        function draw() {
          var f = ctx.frame, p = st.p, K = 16, X = function (k) { return 30 + k * 29; }, base = 360, sc = 300 / p * .9;
          slM.el.style.display = f === 4 ? "" : "none";
          g.innerHTML = "";
          s("line", { x1: 20, y1: base, x2: 505, y2: base, stroke: C.cocoa, "stroke-width": 1.3 }, g);
          var cum = 0;
          for (var k = 1; k <= K; k++) {
            var pr = Math.pow(1 - p, k - 1) * p, h = pr * sc;
            var faded = f === 4 && k <= st.m;
            s("rect", { x: X(k) - 11, y: base - h, width: 22, height: h, rx: 3, fill: faded ? "rgba(221,211,196,.5)" : C.blue.f, stroke: faded ? C.line : C.blue.s, "stroke-width": 1 }, g);
            SK.label(g, X(k), base + 14, String(k), { size: 11, color: C.soft });
            cum += pr;
            if (f === 0 && k <= 4) {
              for (var j = 1; j <= k; j++) s("circle", { cx: X(k) - 8 + (j - 1) * 5, cy: base - h - 12 - (j - 1) * 0, r: 2.4, fill: j === k ? C.green.s : C.pink.s }, g);
            }
          }
          if (f === 2) SK.label(g, 490, 40, "總和 → 1（前 " + K + " 格已經 " + SK.fmt(cum, 3) + "）", { size: 12, anchor: "end", color: C.green.s });
          if (f >= 3) {
            var E = 1 / p;
            if (E <= K) { s("path", { d: "M" + X(E) + " " + (base + 22) + " l-10 18 h20z", fill: C.green.f, stroke: C.cocoa }, g); SK.label(g, X(E), base + 52, "E = 1/p = " + SK.fmt(E, 2), { size: 12, color: C.green.s }); }
          }
          if (f === 4) {
            // 把「已失敗 m 次」之後的長條，同除以 (1-p)^m 重新放大，和原本的分布疊在一起比較
            var dd = "";
            for (var k3 = 1; k3 <= K - st.m; k3++) { var h3 = Math.pow(1 - p, k3 - 1) * p * sc; dd += (k3 > 1 ? "L" : "M") + X(k3 + st.m) + " " + (base - h3); }
            s("path", { d: dd, fill: "none", stroke: C.orange.s, "stroke-width": 2.4 }, g);
            SK.label(g, X(st.m + 1), 40, "從第 " + (st.m + 1) + " 次重新開始看：形狀一模一樣", { size: 12, anchor: "start", color: C.orange.s });
          }
          if (f === 0) SK.label(g, 490, 40, "● 失敗　● 成功", { size: 12, anchor: "end", color: C.soft });
          read.innerHTML = SK.tex("p=" + SK.fmt(p, 2) + ":\\quad P(X=1)=" + SK.fmt(p, 3) + ",\\ P(X=2)=" + SK.fmt((1 - p) * p, 3) + ",\\ E(X)=" + SK.fmt(1 / p, 2), true);
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "模擬看看", icon: "sparkle", render: sim },
      { title: "至少一次成功", icon: "leaf",
        html: "「試 $n$ 次內至少成功一次」的機率，用反面來算最快：$$P(X\\le n)=1-(1-p)^n.$$ 隱藏款 $p=\\frac1{10}$：轉 10 次至少中一次的機率約 $65\\%$；想要有 $95\\%$ 的把握，要轉 $n$ 次使 $0.9^n\\le0.05$，大約 29 次。平均 10 次，和「幾乎確定」要 29 次，差很多。" }
    ],

    challenges: [
      { q: "擲一顆公正的骰子，直到擲出 6 為止。平均要擲幾次？擲 3 次以內就出現 6 的機率是多少？", idea: "$p=\\frac16$，平均 6 次；$1-\\left(\\frac56\\right)^3=\\frac{91}{216}\\approx42\\%$。" },
      { q: "「期望值」單元的挑戰題問過：丟硬幣直到正面，平均要丟幾次？用今天的公式驗證。", idea: "$p=\\frac12$，$E=\\frac1p=2$，和當時用「自我相似」得到的答案一樣。" },
      { q: "無記憶性說：「已經等了很久」不會讓成功變得更快到來。你覺得哪些真實情況<b>不符合</b>這個假設？", idea: "例如燈泡、機器的壽命：用得越久越容易壞，每次「壞掉」的機率會變。幾何分布只適合每次機率固定、彼此獨立的情境。" }
    ],

    where: {
      codes: [["D-12甲-2", "二項分布與幾何分布：兩分布的性質、參數、期望值與標準差"]],
      exam: "12 年級<b>選修數學甲</b>，幾何分布是數甲獨有的內容（數乙不含），分科測驗數甲的範圍。",
      stop: "要認識機率公式、期望值 $\\frac1p$ 與標準差；不一定要證明幾何分布標準差的公式。它的機率總和與期望值，都是無窮等比級數的應用。"
    }
  });
})();
