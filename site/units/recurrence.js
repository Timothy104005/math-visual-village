/* 單元：一階遞迴關係式 */
(function () {
  var C = SK.C, s = SK.s;

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 235, "每年結餘再存入的存款");
    /* 由同一條規則算出：a1 = 10，a(n+1) = 1.05 a(n) + 1 */
    var vals = [10];
    while (vals.length < 6) vals.push(vals[vals.length - 1] * 1.05 + 1);
    vals.forEach(function (v, i) {
      var x = 58 + i * 58, h = v * 6.5;
      s("rect", { x: x - 18, y: 170 - h, width: 36, height: h, rx: 4, fill: C.blue.f, stroke: C.blue.s, "stroke-width": 1.3 }, svg);
      SK.label(svg, x, 162 - h, SK.fmt(v, 1), { size: 10, color: C.blue.s });
      SK.label(svg, x, 186, "第" + (i + 1) + "年", { size: 10, color: C.soft });
    });
    s("line", { x1: 30, y1: 170, x2: 375, y2: 170, stroke: C.line, "stroke-width": 1.2 }, svg);
    SK.label(svg, 200, 26, "每年：把去年的錢 ×1.05，再存入 1 萬", { size: 13, color: C.soft });
    SK.label(svg, 200, 218, "這串數字有公式可以直接算出第 20 年嗎？", { size: 13, color: C.pink.s });
  }

  SK.mountUnit({
    slug: "recurrence",
    en: "Each step defined by the last",
    formula: "a_{n+1}=\\co{p}\\,a_n+\\cb{q}\\ \\Longrightarrow\\ a_n=(a_1-\\cp{L})\\co{p}^{\\,n-1}+\\cp{L},\\quad \\cp{L}=\\frac{\\cb{q}}{1-\\co{p}}",

    hook: {
      html: "一個存錢計畫：第一年存 10 萬。之後<b>每年</b>把帳戶裡的錢乘上 1.05（利息），再存入 1 萬。<br>第 2 年是 $10\\times1.05+1=11.5$ 萬，第 3 年是 $11.5\\times1.05+1\\approx13.1$ 萬……",
      ask: "這個規則只告訴你「下一年怎麼從今年算出來」。想知道第 20 年有多少錢，非得一年一年按 19 次計算機不可嗎？",
      visual: hookVisual
    },

    guess: {
      q: "若規則改成 $a_{n+1}=0.5\\,a_n+3$，從 $a_1=100$ 出發，數列最後會怎麼樣？",
      options: [
        { t: "一路遞減到 0", common: true, explain: "乘以 0.5 確實讓它掉得很快，但每一步還會<b>加回 3</b>。掉到很小的時候，那個 +3 就變成主角了，於是它停了下來。" },
        { t: "遞減後停在 6 附近", truth: true, explain: "如果數列停住不動，那一定是 $L=0.5L+3$，解得 $L=6$。這個 $L$ 叫<b>不動點</b>：一旦到了那裡，套規則進去還是原地不動。<br>驗算：$100\\to53\\to29.5\\to17.75\\to11.875\\to8.94\\to7.47\\to6.73\\to\\cdots$，確實往 6 靠。" },
        { t: "一直減，變成負的", explain: "$a_n>6$ 時下一項還是大於 6（因為 $0.5a_n+3>6$），所以永遠跨不過 6，更不可能變負。這個「跨不過去的界線」正是不動點。" },
        { t: "上下震盪不會停", explain: "公比是正的 0.5，所以它是<b>單調</b>地靠近，不會震盪。如果係數是負的（例如 $-0.5$），才會一左一右地跳著逼近——等一下的蛛網圖會很清楚。" }
      ]
    },

    derive: {
      intro: "下面是<b>蛛網圖</b>：橫軸是 $a_n$、縱軸是 $a_{n+1}$。斜線是規則 $y=px+q$，對角線 $y=x$ 負責把結果「送回」橫軸，一來一回就走完一步。拖動滑桿改變 $p$、$q$ 與起點。",
      tall: true,
      frames: [
        { cap: "<b>遞迴關係式</b>只說「下一項怎麼由這一項算出來」，再加上一個起點 $a_1$，整串數列就被唯一決定了。麻煩的是：想知道第 100 項，好像得先算完前 99 項。", tex: "a_{n+1}=\\co{p}\\,a_n+\\cb{q},\\qquad a_1\\ \\text{已知}" },
        { cap: "先找<b>不動點</b>：如果某個數 $L$ 代進去之後原地不動，它必須滿足 $L=pL+q$。在圖上，它就是斜線和對角線的<b>交點</b>。", tex: "\\cp{L}=\\co{p}\\cp{L}+\\cb{q}\\ \\Rightarrow\\ \\cp{L}=\\frac{\\cb{q}}{1-\\co{p}}\\quad(\\co{p}\\ne1)" },
        { cap: "關鍵的一步：改看<b>「離不動點多遠」</b>。令 $b_n=a_n-L$。把原式減掉 $L=pL+q$，那個討厭的 $q$ 就消失了。", tex: "\\begin{aligned}a_{n+1}&=\\co{p}a_n+\\cb{q}\\\\ -)\\quad \\cp{L}&=\\co{p}\\cp{L}+\\cb{q}\\\\ \\hline b_{n+1}&=\\co{p}\\,b_n\\end{aligned}" },
        { cap: "$b_n$ 是<b>等比數列</b>！距離每一步都乘上 $p$。所以 $b_n=b_1p^{\\,n-1}$，再把 $L$ 加回去，一般項就有了——不必一項一項算。", tex: "a_n=(a_1-\\cp{L})\\,\\co{p}^{\\,n-1}+\\cp{L}" },
        { cap: "分類前先寫出 $a_n-L=(a_1-L)\\,p^{\\,n-1}$，再看<b>兩個因子</b>：<br>・若 $a_1=L$（起點恰為不動點），距離一開始就是 $0$，不論 $p$ 多大，數列<b>恆等於 $L$</b>。<br>・若 $a_1\\ne L$：$|p|<1$ 時距離越乘越小，<b>收斂到 $L$</b>（蛛網往交點縮）；$|p|>1$ 時距離越乘越大，<b>發散</b>（蛛網往外甩）；$p=-1$ 時在兩個值間跳動。$p<0$ 時距離正負交替，於是左右跳著走。", tex: "a_n-\\cp{L}=(a_1-\\cp{L})\\,\\co{p}^{\\,n-1}\\quad\\begin{cases}a_1=\\cp{L}:&\\text{恆定}\\\\ a_1\\ne\\cp{L},\\ |\\co{p}|<1:&a_n\\to\\cp{L}\\\\ a_1\\ne\\cp{L},\\ |\\co{p}|>1:&\\text{發散}\\end{cases}" },
        { cap: "回到存錢計畫：$p=1.05$、$q=1$，$L=\\frac{1}{1-1.05}=-20$。$a_n=(10+20)(1.05)^{n-1}-20=30(1.05)^{n-1}-20$。第 20 年約 $30(2.527)-20\\approx55.8$ 萬。<br>$L$ 是負的沒關係——它只是個參考點，不必有實際意義。", tex: "a_{20}=30(1.05)^{19}-20\\approx55.8" }
      ],
      hint: "把 $p$ 調成負數，看蛛網怎麼變成向內繞的螺旋。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 480, 420, "遞迴數列的蛛網圖");
        var g = s("g", {}, svg);
        var X0 = 60, X1 = 420, Y0 = 370, Y1 = 40;
        var LO = -4, HI = 14;
        var st = { p: .5, q: 3, a1: 12 };
        var read = SK.h("div", { class: "readout" });
        ctx.extra.appendChild(read);
        function px(v) { return X0 + (v - LO) / (HI - LO) * (X1 - X0); }
        function py(v) { return Y0 - (v - LO) / (HI - LO) * (Y0 - Y1); }

        var slP = SK.slider({ label: "$p$", min: -1.4, max: 1.4, step: .1, value: st.p, onInput: function (v) { st.p = v; draw(); } });
        var slQ = SK.slider({ label: "$q$", min: -4, max: 8, step: .5, value: st.q, color: "blue", onInput: function (v) { st.q = v; draw(); } });
        var slA = SK.slider({ label: "起點 $a_1$", min: -3, max: 13, step: .5, value: st.a1, color: "green", onInput: function (v) { st.a1 = v; draw(); } });
        ctx.sliders.appendChild(slP.el); ctx.sliders.appendChild(slQ.el); ctx.sliders.appendChild(slA.el);

        function draw() {
          var f = ctx.frame, p = st.p, q = st.q, a1 = st.a1;
          g.innerHTML = "";
          /* 坐標軸 */
          s("line", { x1: X0, y1: py(0), x2: X1, y2: py(0), stroke: C.line, "stroke-width": 1.2 }, g);
          s("line", { x1: px(0), y1: Y0, x2: px(0), y2: Y1, stroke: C.line, "stroke-width": 1.2 }, g);
          SK.label(g, X1 - 6, py(0) + 18, "aₙ", { size: 12, color: C.soft });
          SK.label(g, px(0) - 22, Y1 + 10, "aₙ₊₁", { size: 12, color: C.soft });
          /* y = x */
          s("line", { x1: px(LO), y1: py(LO), x2: px(HI), y2: py(HI), stroke: C.line, "stroke-width": 1.6, "stroke-dasharray": "5 4" }, g);
          SK.label(g, px(HI) - 30, py(HI) + 18, "y = x", { size: 11, color: C.soft });
          /* y = px + q */
          s("line", { x1: px(LO), y1: py(p * LO + q), x2: px(HI), y2: py(p * HI + q), stroke: C.orange.s, "stroke-width": 3 }, g);
          SK.label(g, px(HI) - 20, py(p * HI + q) - 16, "y = px + q", { size: 12, color: C.orange.s, anchor: "end" });

          /* 不動點 */
          var stable = Math.abs(1 - p) > 1e-9, L = stable ? q / (1 - p) : null;
          if (f >= 1 && stable) {
            s("circle", { cx: px(L), cy: py(L), r: 8, fill: "none", stroke: C.pink.s, "stroke-width": 2.6 }, g);
            s("line", { x1: px(L), y1: py(L), x2: px(L), y2: py(0), stroke: C.pink.s, "stroke-width": 1, "stroke-dasharray": "3 3" }, g);
            SK.label(g, px(L) + 14, py(L) - 16, "L = " + SK.fmt(L, 2), { size: 13, color: C.pink.s, anchor: "start" });
          }

          /* 蛛網 */
          var x = a1, path = "M" + px(x) + " " + py(0);
          for (var i = 0; i < 16; i++) {
            var y = p * x + q;
            if (!isFinite(y) || Math.abs(y) > 400) break;
            path += " L" + px(x) + " " + py(y) + " L" + px(y) + " " + py(y);
            x = y;
          }
          s("path", { d: path, fill: "none", stroke: C.blue.s, "stroke-width": 1.8, opacity: .85 }, g);
          s("circle", { cx: px(a1), cy: py(0), r: 5, fill: C.green.f, stroke: C.green.s, "stroke-width": 1.8 }, g);
          SK.label(g, px(a1), py(0) + 22, "a₁", { size: 12, color: C.green.s });

          /* 前幾項 */
          var seq = [], v = a1;
          for (var k = 0; k < 6; k++) { seq.push(SK.fmt(v, 2)); v = p * v + q; }
          SK.label(g, 240, 400, seq.join("  →  "), { size: 12, color: C.cocoa });

          read.innerHTML =
            SK.tex("a_{n+1}=" + SK.fmt(p, 2) + "a_n+" + SK.fmt(q, 2) + ",\\qquad a_1=" + SK.fmt(a1, 2), true) +
            (f >= 1 && stable ? SK.tex("\\cp{L}=\\frac{" + SK.fmt(q, 2) + "}{1-" + SK.fmt(p, 2) + "}=" + SK.fmt(L, 3), true) : "") +
            (f >= 3 && stable ? SK.tex("a_n=(" + SK.fmt(a1 - L, 2) + ")(" + SK.fmt(p, 2) + ")^{n-1}+" + SK.fmt(L, 2), true) : "") +
            (!stable ? '<p class="muted" style="margin:6px 0">' + SK.md(Math.abs(q) > 1e-9
              ? "$p=1$、$q\\ne0$ 時斜線和對角線平行而不重合，<b>沒有不動點</b>——這時數列其實是<b>等差</b>：每一步都加上同一個 $q$。"
              : "$p=1$、$q=0$ 時斜線<b>就是</b>對角線 $y=x$：<b>每一個實數都是不動點</b>，數列恆等於起點 $a_1$（公差 $0$ 的等差數列）。") + "</p>" : "");
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "等差與等比都是它的特例", icon: "bulb",
        html: "$a_{n+1}=pa_n+q$ 這一條式子，把兩種最基本的數列都包在裡面了：<br>・$p=1$：$a_{n+1}=a_n+q$，每次加同一個數 → <b>等差數列</b>（$q\\ne0$ 時斜線和對角線平行，沒有不動點；$q=0$ 時兩線重合，每個數都是不動點）。<br>・$q=0$：$a_{n+1}=pa_n$，每次乘同一個數 → <b>等比數列</b>（不動點是 0）。<br>一般的情況「又乘又加」，處理方法就是把不動點當新原點，讓「加」的部分消失，化歸成等比。<br><b>化歸</b>——把沒看過的問題變成看過的問題——是數學裡最常用的一招。" },
      { title: "為什麼平移就能消掉 q", icon: "sparkle",
        html: "看蛛網圖：斜線 $y=px+q$ 和 $y=px$ 是<b>同一條線平移</b>的結果，斜率完全一樣。<br>斜率 $p$ 決定「距離每一步乘幾倍」，$q$ 只決定「這條線放在哪裡」，也就是不動點的位置。<br>所以把原點搬到不動點（令 $b_n=a_n-L$），$q$ 就從式子裡消失了——它從來就不影響<b>形狀</b>，只影響<b>位置</b>。<br>這和配方法把 $x^2+bx$ 的一次項消掉、和標準化把平均移到 0，是同一種動作：<b>換一個好的原點，問題就變簡單了。</b>" }
    ],

    challenges: [
      { q: "$a_1=1$、$a_{n+1}=3a_n-4$，求一般項 $a_n$，並判斷它會收斂還是發散。",
        hint: "先解不動點 $L=3L-4$。",
        idea: "$L=2$。令 $b_n=a_n-2$，則 $b_{n+1}=3b_n$、$b_1=-1$，所以 $b_n=-3^{n-1}$，$a_n=2-3^{n-1}$。<br>$|p|=3>1$，距離越來越大，<b>發散</b>（往負無窮跑）。注意起點就在不動點的左邊，一旦離開就再也回不去了。" },
      { q: "一個水池有 100 公升水。每天先倒掉 20%，再加入 30 公升。長期下來水量會穩定在多少？如果改成「先加 30 公升再倒掉 20%」，答案一樣嗎？", lv: "Explore",
        hint: "把兩種順序各寫成一條遞迴式，再各自解不動點。",
        idea: "先倒後加：$a_{n+1}=0.8a_n+30$，$L=\\frac{30}{0.2}=150$ 公升。<br>先加後倒：$a_{n+1}=0.8(a_n+30)=0.8a_n+24$，$L=\\frac{24}{0.2}=120$ 公升。<br><b>不一樣</b>——因為後者那 30 公升也被倒掉了 20%。兩種情況的 $p$ 都是 0.8，所以收斂速度相同，但停的位置差了 30 公升。<b>讀題時，動作的順序會改寫 $q$。</b>" },
      { q: "費氏數列 $F_{n+1}=F_n+F_{n-1}$ 也是遞迴式，但這一課的方法對它沒用。為什麼？你覺得該往哪個方向想？", lv: "Wonder",
        idea: "因為它是<b>二階</b>的：下一項要看<b>前兩項</b>，不能畫成「$a_n$ 對 $a_{n+1}$」的平面蛛網圖，不動點的技巧也接不上。<br>一個可以嘗試的方向：猜猜看有沒有形如 $a_n=r^n$ 的解。代進去得到 $r^2=r+1$，解出 $r=\\frac{1\\pm\\sqrt5}{2}$——<b>黃金比例</b>出現了。兩個解的線性組合就是一般項（比內公式）。<br>這叫<b>特徵方程</b>，是高中的停止線之外、但你現在已經看得懂的東西。能看出「這個工具為什麼在這裡失效」，往往比會用工具更重要。" }
    ],

    where: {
      codes: [["N-10-6", "數列、級數與遞迴：一階遞迴關係式、等差與等比數列、數學歸納法"]],
      exam: "10 年級<b>共同必修</b>，學測數 A、數 B 都在範圍內。常以「存款／貸款／族群數量／藥物濃度」的情境題出現，題目給你規則，要你求一般項或長期趨勢。也常和等比數列、對數（解 $p^n$）合併命題。",

      past: [] /* Examination text excluded; see docs/PROVENANCE.md. */,
      stop: "一階遞迴 $a_{n+1}=pa_n+q$ 會用不動點化歸成等比就夠了。二階遞迴（費氏數列）、特徵方程、生成函數都不是高中核心；收斂的嚴格證明屬於數甲的極限。"
    }
  });
})();
