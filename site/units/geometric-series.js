/* 單元：等比數列與等比級數（有限） */
(function () {
  var C = SK.C, s = SK.s;

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 240, "棋盤上一格一格加倍的米粒");
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        s("rect", { x: 40 + j * 22, y: 40 + i * 22, width: 22, height: 22, fill: (i + j) % 2 ? "rgba(241,226,184,.5)" : C.paper, stroke: C.line, "stroke-width": .6 }, svg);
      }
    }
    [[0, 0, "1"], [1, 0, "2"], [2, 0, "4"], [3, 0, "8"], [4, 0, "16"]].forEach(function (d) {
      SK.label(svg, 51 + d[0] * 22, 51 + d[1] * 22, d[2], { size: 9, color: C.orange.s });
    });
    SK.label(svg, 292, 100, "每一格", { size: 13, color: C.soft, anchor: "start" });
    SK.label(svg, 292, 122, "都是前一格", { size: 13, color: C.soft, anchor: "start" });
    SK.label(svg, 292, 144, "的兩倍", { size: 13, color: C.orange.s, anchor: "start" });
    SK.label(svg, 200, 228, "64 格放滿，一共要多少米？", { size: 13, color: C.pink.s });
  }

  SK.mountUnit({
    slug: "geometric-series",
    en: "Multiplying instead of adding",
    formula: "S_n=a+ar+\\cdots+ar^{n-1}=\\frac{a(1-\\co{r}^n)}{1-\\co{r}}\\quad(\\co{r}\\ne1)",

    hook: {
      html: "傳說中發明西洋棋的人只要求一個報酬：棋盤第 1 格放 1 粒米，第 2 格放 2 粒，第 3 格放 4 粒……每一格都是前一格的兩倍，放滿 64 格就好。國王覺得這個要求很謙虛。",
      ask: "放滿 64 格到底要多少米？國王有辦法兌現嗎？而且——有沒有辦法<b>不要真的一格一格加</b>，直接算出總數？",
      visual: hookVisual
    },

    guess: {
      q: "棋盤 64 格全部放滿，米粒總數大約是多少？",
      options: [
        { t: "幾千粒，一袋米就夠", common: true, explain: "前幾格確實很少（1、2、4、8…），這讓人嚴重低估了後面。問題是<b>倍增</b>不是慢慢加，它是每一步都把累積的量整個再翻一次。" },
        { t: "約 $1.8\\times10^{19}$ 粒，全世界幾百年的產量", truth: true, explain: "$S_{64}=2^{64}-1\\approx1.8\\times10^{19}$ 粒，大約是 4600 億公噸——全球稻米年產量的好幾百倍。<br>更驚人的是：<b>最後一格</b>就比前面 63 格加起來還多一粒。這是等比數列的招牌性格。" },
        { t: "約 $64^2=4096$ 粒", explain: "把「倍增」誤看成「乘以格數」了。這裡每一格是<b>乘以 2</b> 而不是<b>加上某個數</b>，成長方式完全不同。" },
        { t: "無限多，算不出來", explain: "只有 64 格，一定是有限的數。真正的難處不是算不出來，而是它大得超乎直覺——等一下就會看到一個只要兩行的算法。" }
      ]
    },

    derive: {
      intro: "上面的長條是每一項，下面的粗線是累積的總和。拖動<b>公比 $r$</b> 和<b>項數 $n$</b>，看總和怎麼變。",
      tall: true,
      frames: [
        { cap: "每一項都是前一項<b>乘上同一個數</b> $r$（公比），這樣的數列叫<b>等比數列</b>。等差是「一直加同一個數」，等比是「一直乘同一個數」。", tex: "a_n=a\\,\\co{r}^{\\,n-1}" },
        { cap: "要求前 $n$ 項的和 $S_n$。硬加會很慘，所以用一個漂亮的招數：把整串<b>乘上 $r$</b>，得到 $rS_n$。注意它和 $S_n$ 幾乎一模一樣，只是整體往右挪了一格。", tex: "\\begin{aligned}S_n&=a+ar+\\cdots+ar^{n-1}\\\\ \\co{r}S_n&=\\ \\ \\ \\ \\ \\ ar+\\cdots+ar^{n-1}+ar^{n}\\end{aligned}" },
        { cap: "兩式<b>相減</b>。中間那一大串完全對消，只剩頭和尾——這就是<b>錯位相減</b>。", tex: "\\co{r}S_n-S_n=ar^{n}-a" },
        { cap: "提出 $S_n$ 再除，公式就出來了。分母 $1-r$ 提醒我們一件事：$r=1$ 必須另外處理（那時每一項都一樣，$S_n=na$）。", tex: "S_n=\\frac{a(1-\\co{r}^n)}{1-\\co{r}}\\quad(\\co{r}\\ne1)" },
        { cap: "棋盤問題就是 $a=1$、$r=2$、$n=64$：$S_{64}=\\frac{1-2^{64}}{1-2}=2^{64}-1$。式子裡的 $r^n$ 就是那個把國王嚇壞的東西。", tex: "S_{64}=2^{64}-1\\approx1.8\\times10^{19}" },
        { cap: "$|r|<1$ 時反而相反：$r^n$ 會越來越小，總和逐漸<b>逼近一個定值</b> $\\frac{a}{1-r}$。小心：「逼近」不等於「從同一側靠近」。$a>0$、$0<r<1$ 時部分和一路往上、跨不過極限；但 $r<0$ 時部分和會在極限兩側<b>來回跳</b>——例如 $a=1$、$r=-\\frac12$，極限是 $\\frac23$，而 $S_1=1>\\frac23$、$S_2=\\frac12<\\frac23$、$S_3=\\frac34>\\frac23$……把 $r$ 調成負的看看。把 $n$ 拉大看看——這正是數甲「無窮等比級數」的入口。", tex: "|\\co{r}|<1:\\quad S_n\\to\\frac{a}{1-\\co{r}}" }
      ],
      hint: "把 $r$ 調到 1 附近看看公式為什麼要排除 $r=1$。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 540, 400, "等比數列的每一項與累積和");
        var g = s("g", {}, svg);
        var X0 = 60, X1 = 500, Y0 = 300;
        var st = { r: 2, n: 8, a: 1 };
        var read = SK.h("div", { class: "readout" });
        ctx.extra.appendChild(read);
        var slR = SK.slider({ label: "公比 $r$", min: -1.5, max: 2.5, step: .1, value: st.r, onInput: function (v) { st.r = v; draw(); } });
        var slN = SK.slider({ label: "項數 $n$", min: 2, max: 14, step: 1, value: st.n, color: "blue", onInput: function (v) { st.n = v; draw(); } });
        ctx.sliders.appendChild(slR.el); ctx.sliders.appendChild(slN.el);

        function draw() {
          var f = ctx.frame, r = st.r, n = st.n, a = st.a;
          g.innerHTML = "";
          var terms = [], sums = [], acc = 0;
          for (var i = 0; i < n; i++) { var t = a * Math.pow(r, i); terms.push(t); acc += t; sums.push(acc); }
          var all = terms.concat(sums).map(Math.abs);
          var top = Math.max.apply(null, all) || 1;
          var bw = (X1 - X0) / n;
          function hy(v) { return Y0 - SK.clamp(v / top, -1, 1) * 230; }

          s("line", { x1: X0 - 12, y1: Y0, x2: X1 + 12, y2: Y0, stroke: C.line, "stroke-width": 1.3 }, g);

          terms.forEach(function (t, i) {
            var x = X0 + i * bw + bw * .18, w = bw * .64;
            var y = Math.min(Y0, hy(t)), h = Math.abs(Y0 - hy(t));
            s("rect", { x: x, y: y, width: w, height: Math.max(h, 1.5), rx: 3, fill: C.orange.f, stroke: C.orange.s, "stroke-width": 1.2 }, g);
            if (n <= 9) SK.label(g, x + w / 2, Y0 + 16, "a" + (i + 1), { size: 10, color: C.soft });
          });
          /* 累積和折線 */
          if (f >= 1) {
            var d = sums.map(function (v, i) { return (i ? "L" : "M") + (X0 + i * bw + bw * .5) + " " + hy(v); }).join(" ");
            s("path", { d: d, fill: "none", stroke: C.blue.s, "stroke-width": 3, "stroke-linejoin": "round" }, g);
            sums.forEach(function (v, i) {
              s("circle", { cx: X0 + i * bw + bw * .5, cy: hy(v), r: 4, fill: C.blue.f, stroke: C.blue.s, "stroke-width": 1.4 }, g);
            });
            SK.label(g, X1 - 10, hy(sums[n - 1]) - 18, "累積和 S", { size: 12, color: C.blue.s, anchor: "end" });
          }
          /* |r|<1 的極限線 */
          if (f >= 5 && Math.abs(r) < 1) {
            var L = a / (1 - r);
            s("line", { x1: X0 - 12, y1: hy(L), x2: X1 + 12, y2: hy(L), stroke: C.mint.s, "stroke-width": 2, "stroke-dasharray": "6 4" }, g);
            SK.label(g, X0 + 40, hy(L) - 14, "a/(1−r) = " + SK.fmt(L, 3), { size: 12, color: C.mint.s, anchor: "start" });
          }
          SK.label(g, 280, 350, "r = " + SK.fmt(r, 2) + "　n = " + n, { size: 14, color: C.cocoa });

          var Sn = Math.abs(r - 1) < 1e-9 ? n * a : a * (1 - Math.pow(r, n)) / (1 - r);
          read.innerHTML = Math.abs(r - 1) < 1e-9
            ? SK.tex("r=1\\ \\Rightarrow\\ S_n=na=" + SK.fmt(Sn, 3), true)
            : SK.tex("S_{" + n + "}=\\frac{1\\cdot(1-(" + SK.fmt(r, 2) + ")^{" + n + "})}{1-(" + SK.fmt(r, 2) + ")}=" + SK.fmt(Sn, 4), true);
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "和等差比一比", icon: "bulb",
        html: "兩者的求和都靠同一個念頭：<b>製造一個幾乎一樣的式子，再相減讓中間全部消掉</b>。<br>・等差：把數列<b>倒過來</b>再相加，每一對的和都相同 → $S_n=\\frac{n(a_1+a_n)}{2}$。<br>・等比：把數列<b>乘上 $r$</b> 再相減，中間整串對消 → $S_n=\\frac{a(1-r^n)}{1-r}$。<br>一個用「對稱」，一個用「平移」，但都是為了把 $n$ 項變成 2 項。這個手法在數甲的望遠鏡級數（telescoping）還會再見到。" },
      { title: "複利就是等比數列", icon: "sparkle",
        html: "本金 $P$、年利率 $i$，第 $n$ 年的本利和是 $P(1+i)^n$——一個公比 $1+i$ 的等比數列。<br>如果<b>每年都再存入</b> $P$ 元（年金），$n$ 年後的總額就是一串等比數列的和：$$P(1+i)+P(1+i)^2+\\cdots+P(1+i)^n=P(1+i)\\frac{(1+i)^n-1}{i}$$ 房貸、儲蓄險、退休金的公式全部從這裡來。<b>你在這一格學的東西，之後會在銀行的合約書上再遇到一次。</b>" },
      { title: "為什麼最後一項特別大", icon: "leaf",
        html: "$r=2$ 時，$S_n=2^n-1$，而最後一項是 $2^{n-1}$。也就是說<b>最後一項比前面所有項的總和還多 1</b>。<br>換個方式看：$1+2+4+\\cdots+2^{n-1}$ 寫成二進位就是 $\\underbrace{111\\cdots1}_{n}$，再加 1 就進位成 $1\\underbrace{00\\cdots0}_{n}=2^n$。<br>這也是為什麼「指數成長」的直覺這麼難建立：不管你已經走了多遠，下一步都和你走過的全部一樣長。" }
    ],

    challenges: [
      { q: "一張紙對摺 42 次，厚度會超過地球到月球的距離嗎？（一張紙約 0.1 公釐，地月距離約 38 萬公里）",
        hint: "每摺一次厚度乘 2，是公比 2 的等比數列——這題只要算<b>第 42 項</b>，不是總和。",
        idea: "$0.1\\text{mm}\\times2^{42}\\approx4.4\\times10^{11}\\text{mm}=44$ 萬公里 > 38 萬公里，<b>會超過</b>。<br>（實際上紙對摺 8 次左右就摺不動了，但數學不管這個。）這題和棋盤是同一件事：倍增 42 次就足以從地球排到月球。" },
      { q: "$3+3^2+3^3+\\cdots+3^{10}$ 是多少？如果改成 $3+3^3+3^5+\\cdots+3^{19}$ 呢？", lv: "Explore",
        hint: "第二題也是等比數列——公比不是 3，先看相鄰兩項差幾倍。",
        idea: "第一題：$a=3$、$r=3$、$n=10$，$S=\\frac{3(3^{10}-1)}{2}=88572$。<br>第二題：相鄰兩項差 $3^2=9$ 倍，所以 $a=3$、$r=9$、$n=10$，$S=\\frac{3(9^{10}-1)}{8}$。<br>重點：<b>公比是相鄰兩項的比值</b>，不是題目裡最顯眼的那個數字。" },
      { q: "$0.999\\ldots=1$ 嗎？把它寫成等比級數看看。你覺得這是「無限靠近」還是「真的相等」？", lv: "Wonder",
        hint: "$0.999\\ldots=0.9+0.09+0.009+\\cdots$，首項 $0.9$、公比 $0.1$。",
        idea: "前 $n$ 項的和是 $\\frac{0.9(1-0.1^n)}{1-0.1}=1-0.1^n$。$n$ 越大，它離 1 越近，差距 $0.1^n$ 要多小有多小。<br>「$0.999\\ldots$」這個符號的<b>定義</b>就是這串部分和的極限，而那個極限精確地等於 1——所以是<b>真的相等</b>，不是「非常接近」。<br>會覺得怪，是因為我們把「小數點後有無限多位」想成一個永遠在進行的過程。它不是過程，它是一個已經確定的數。這個轉念，就是數甲「極限」整章要處理的事。" }
    ],

    where: {
      codes: [["N-10-6", "數列、級數與遞迴：等差與等比數列、有限等比級數、常用求和公式、數學歸納法"]],
      exam: "10 年級<b>共同必修</b>，學測數 A、數 B 都在範圍內。最常見的考法是複利與分期付款的情境題，以及和遞迴、對數一起出現的成長模型題。分科數甲的無窮等比級數、數乙的循環小數都以它為前置。",
      stop: "會等比數列的一般項、會用錯位相減推出有限和、會處理 $r=1$ 的例外就夠了。無窮等比級數（$|r|<1$ 時的極限）留給數甲、數乙；差分法、高階遞迴、生成函數都不是高中核心。"
    }
  });
})();
