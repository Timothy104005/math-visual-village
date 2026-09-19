/* 單元 2：等差級數求和 */
(function () {
  var C = SK.C, s = SK.s;

  /* 畫一個由方塊組成的階梯；heights[i] 為第 i 欄方塊數，從底部往上疊 */
  function stairs(g, x0, yBase, u, heights, col, opts) {
    opts = opts || {};
    heights.forEach(function (h, i) {
      for (var k = 0; k < h; k++) {
        var y = opts.fromTop ? opts.top + k * u : yBase - (k + 1) * u;
        s("rect", { x: x0 + i * u + 1, y: y + 1, width: u - 2, height: u - 2, rx: Math.min(4, u * .15), fill: col.f, stroke: col.s, "stroke-width": 1.4 }, g);
      }
    });
  }

  function hookVisual(el) {
    var svg = SK.svg(el, 420, 300, "1 到 10 的方塊階梯");
    var u = 24, x0 = 80, yb = 270;
    stairs(svg, x0, yb, u, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], C.orange);
    SK.label(svg, x0 + 5 * u, yb + 16, "1 + 2 + 3 + … + 10 = ?", { size: 15 });
    var n = s("g", { transform: "translate(330 40) scale(1.6)" }, svg);
    n.innerHTML = SK.icons.sparkle.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "");
  }

  /* 猜測題的示意圖 */
  function guessVisual(el) {
    var svg = SK.svg(el, 480, 190, "兩個 1 到 10 的階梯，一個蜜桃色一個灰藍色倒放");
    var u = 15;
    stairs(svg, 20, 175, u, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], C.orange);
    SK.label(svg, 220, 100, "＋", { size: 30 });
    var g = s("g", { transform: "translate(270 0) rotate(180 75 94)" }, svg);
    stairs(g, 0, 175, u, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], C.blue);
    SK.label(svg, 440, 100, "→ ?", { size: 20 });
  }

  function oddMini(el) {
    var svg = SK.svg(el, 360, 220, "1 加 3 加 5 加 7 的 L 形拼成正方形");
    var cols = [C.orange, C.blue, C.green, C.gold, C.pink];
    var u = 36, x0 = 30, y0 = 20;
    for (var n = 0; n < 5; n++) {
      for (var i = 0; i <= n; i++) {
        [[n, i], [i, n]].forEach(function (p, j) {
          if (j === 1 && i === n) return;
          s("rect", { x: x0 + p[0] * u + 1.5, y: y0 + p[1] * u + 1.5, width: u - 3, height: u - 3, rx: 5, fill: cols[n].f, stroke: cols[n].s, "stroke-width": 1.4 }, svg);
        });
      }
    }
    SK.label(svg, 290, 60, "1+3+5+7+9", { size: 16 });
    SK.label(svg, 290, 95, "= 5²", { size: 20 });
    SK.label(svg, 290, 135, "每一層 L 形", { size: 13, color: C.soft });
    SK.label(svg, 290, 155, "比前一層多 2 塊", { size: 13, color: C.soft });
  }

  function trapezoidAngle(el) {
    var wrap = SK.h("div", { class: "two-col" });
    var st = SK.h("div", { class: "stage" }), side = SK.h("div", { class: "sliders" });
    wrap.appendChild(st); wrap.appendChild(side); el.appendChild(wrap);
    var svg = SK.svg(st, 440, 330, "階梯與梯形面積相同");
    var g = s("g", {}, svg);
    var stt = { n: 6, a: 2, d: 1 };
    function draw() {
      g.innerHTML = "";
      var n = stt.n, a = stt.a, d = stt.d, an = a + (n - 1) * d;
      var u = Math.min(300 / n, 250 / an), x0 = 60, yb = 290;
      var hs = []; for (var i = 0; i < n; i++) hs.push(a + i * d);
      stairs(g, x0, yb, u, hs, C.orange);
      // 梯形：通過每一欄頂端的中點
      var h0 = a - d / 2, h1 = an + d / 2;
      s("path", { d: "M" + x0 + " " + yb + " L" + x0 + " " + (yb - h0 * u) + " L" + (x0 + n * u) + " " + (yb - h1 * u) + " L" + (x0 + n * u) + " " + yb + "Z",
        fill: "none", stroke: C.blue.s, "stroke-width": 3, "stroke-dasharray": "9 6", "stroke-linejoin": "round" }, g);
      for (var k = 0; k < n; k++) {
        if (d === 0) break;
        var xL = x0 + k * u, xM = xL + u / 2, xR = xL + u, top = yb - hs[k] * u;
        // 左半邊凸出的小三角形（多的）與右半邊缺的小三角形（少的）
        s("path", { d: "M" + xL + " " + top + " L" + xM + " " + top + " L" + xL + " " + (top + d * u / 2) + "Z", fill: C.pink.f, stroke: "none" }, g);
        s("path", { d: "M" + xM + " " + top + " L" + xR + " " + top + " L" + xR + " " + (top - d * u / 2) + "Z", fill: C.green.f, stroke: "none" }, g);
      }
      SK.label(g, x0 + n * u / 2, yb + 18, "n = " + n + " 欄", { size: 13, color: C.soft });
      side.querySelector(".readout").innerHTML = SK.tex("\\text{梯形}=\\frac{(" + SK.fmt(h0) + "+" + SK.fmt(h1) + ")\\times" + n + "}{2}=" + SK.fmt((h0 + h1) * n / 2), true) +
        SK.tex("\\text{方塊總數}=" + hs.join("+") + "=" + hs.reduce(function (p, q) { return p + q; }, 0), true);
    }
    side.appendChild(SK.slider({ label: "$n$", min: 2, max: 10, value: stt.n, onInput: function (v) { stt.n = v; draw(); } }).el);
    side.appendChild(SK.slider({ label: "$a_1$", min: 1, max: 4, value: stt.a, color: "blue", onInput: function (v) { stt.a = v; draw(); } }).el);
    side.appendChild(SK.slider({ label: "$d$", min: 0, max: 3, value: stt.d, color: "green", onInput: function (v) { stt.d = v; draw(); } }).el);
    side.insertAdjacentHTML("beforeend", '<div class="readout"></div><p class="muted" style="margin:0;font-size:.95rem">灰藍色虛線是一個梯形，穿過每一欄頂端的中點。每一欄<span style="color:#A85E66">凸出去的玫瑰色小三角形</span>，剛好補進旁邊<span style="color:#647A58">缺掉的綠色小三角形</span>，所以階梯和梯形一樣大！</p>');
    draw();
  }

  SK.mountUnit({
    slug: "arithmetic-series",
    en: "Two staircases make a rectangle",
    formula: "S_n=\\co{a_1}+(a_1+d)+\\cdots+\\cb{a_n}=\\frac{n(\\co{a_1}+\\cb{a_n})}{2}",

    hook: {
      html: "據說高斯小時候，老師要全班算 $1+2+3+\\cdots+100$，他幾秒就算完了。我們先看小一點的：把 $1,2,3,\\dots,10$ 疊成方塊階梯。",
      ask: "不要一格一格數，你能想到什麼聰明的方法，看出總共有幾塊嗎？",
      visual: hookVisual
    },

    guess: {
      q: "再做一個一模一樣的階梯，把它<b>倒過來</b>放在原本的階梯上面。兩個階梯會拼成什麼？",
      visual: guessVisual,
      options: [
        { t: "$10\\times10$ 的正方形", common: true, explain: "很接近！可是最高那一欄：蜜桃色有 10 塊，倒過來的灰藍色在那一欄還有 1 塊，所以每一欄是 $10+1=11$ 塊，不是 10 塊。" },
        { t: "$10\\times11$ 的長方形", truth: true, explain: "每一欄都是「蜜桃色 $k$ 塊＋灰藍色 $11-k$ 塊」＝ 11 塊，一共 10 欄，所以是 $10\\times11=110$ 塊。兩個階梯是 110，一個階梯就是 $110\\div2=55$。" },
        { t: "$11\\times11$ 的正方形", explain: "高度的確是 11，很敏銳！但寬度呢？階梯只有 10 欄，倒過來還是 10 欄，所以寬度是 10。" },
        { t: "拼不起來，會有縫", explain: "直覺上倒過來的階梯好像會卡住，這個懷疑很有道理！不過因為兩個階梯每一步的高度差都一樣（都是 1），一個往上一格、另一個就往下一格，所以剛好密合。這個「每步差一樣」正是<b>等差</b>的意思。" }
      ]
    },

    derive: {
      intro: "我們用一般的等差數列：首項 $a_1$、公差 $d$、共 $n$ 項。拖動滑桿改變階梯的形狀。",
      frames: [
        { cap: "把 $a_1, a_1+d, a_1+2d, \\dots, a_n$ 疊成階梯，每一欄比前一欄多 $d$ 塊。我們要數的是全部的方塊 $S_n$。", tex: "S_n=\\co{a_1}+(a_1+d)+\\cdots+\\co{a_n}" },
        { cap: "做一份一模一樣的複製品（灰藍色）。", tex: "2S_n=\\co{S_n}+\\cb{S_n}" },
        { cap: "把灰藍色階梯<b>轉 180°</b>，疊到蜜桃色上面。倒過來後，灰藍色由高到低排列：$a_n, a_{n-1}, \\dots, a_1$。", tex: "\\begin{aligned}S_n&=\\co{a_1}+\\co{a_2}+\\cdots+\\co{a_n}\\\\S_n&=\\cb{a_n}+\\cb{a_{n-1}}+\\cdots+\\cb{a_1}\\end{aligned}" },
        { cap: "看任何一欄：蜜桃色少一點，灰藍色就多一點，加起來永遠是 $a_1+a_n$。兩個階梯拼成一個長方形！", tex: "\\text{每一欄}=\\co{a_k}+\\cb{a_{n+1-k}}=a_1+a_n" },
        { cap: "長方形有 $n$ 欄、每欄高 $a_1+a_n$，所以兩個階梯是 $n(a_1+a_n)$，一個階梯是它的一半。", tex: "S_n=\\frac{n(\\co{a_1}+\\cb{a_n})}{2}" }
      ],
      setup: function (ctx) {
        var st = { n: 6, a: 2, d: 1 };
        var svg = SK.svg(ctx.stage, 520, 440, "等差數列的方塊階梯與倒放的複製品");
        var g = s("g", {}, svg);
        var read = SK.h("div", { class: "readout" });
        ctx.extra.appendChild(read);
        function draw() {
          var f = ctx.frame, n = st.n, a = st.a, d = st.d, an = a + (n - 1) * d, H = a + an;
          var u = Math.min(200 / n, 360 / H), x0 = 40, yb = 410;
          var hs = []; for (var i = 0; i < n; i++) hs.push(a + i * d);
          g.innerHTML = "";
          // 蜜桃色階梯
          stairs(g, x0, yb, u, hs, C.orange);
          // 灰藍色階梯（local 座標：底部對齊的階梯），用 CSS transform 做平移 + 旋轉
          var bl = s("g", { class: "move" }, g);
          stairs(bl, 0, H * u, u, hs, C.blue);
          var cx = n * u / 2, cy = H * u / 2;
          bl.style.transformOrigin = cx + "px " + cy + "px";
          var besideX = x0 + n * u + 40, besideY = yb - H * u;
          var tr;
          if (f === 0) { bl.style.opacity = 0; tr = "translate(" + besideX + "px," + besideY + "px) rotate(0deg)"; }
          else if (f === 1) { bl.style.opacity = 1; tr = "translate(" + besideX + "px," + besideY + "px) rotate(0deg)"; }
          else { bl.style.opacity = 1; tr = "translate(" + x0 + "px," + besideY + "px) rotate(180deg)"; }
          bl.style.transform = tr;
          bl.style.transition = "transform .9s cubic-bezier(.5,0,.2,1), opacity .4s";
          // 標示
          if (f >= 3) {
            s("rect", { x: x0, y: yb - H * u, width: n * u, height: H * u, fill: "none", stroke: C.ink, "stroke-width": 2.5, rx: 3 }, g);
            SK.brace(g, x0, yb + 8, x0 + n * u, yb + 8, 14);
            SK.label(g, x0 + n * u / 2, yb + 26 > 432 ? 430 : yb + 26, "n = " + n, { size: 15 });
            SK.brace(g, x0 + n * u + 8, yb - H * u, x0 + n * u + 8, yb, 14);
            SK.label(g, x0 + n * u + 60, yb - H * u / 2, "a₁ + aₙ = " + H, { size: 15 });
          } else if (f === 0) {
            SK.label(g, x0 + n * u / 2, yb + 20, "共 " + n + " 欄", { size: 14, color: C.soft });
          }
          var sum = hs.reduce(function (p, q) { return p + q; }, 0);
          read.innerHTML = SK.tex(hs.map(function (h) { return "\\co{" + h + "}"; }).join("+") + "=" + sum, true) +
            (f >= 4 ? SK.tex("\\frac{" + n + "\\times(" + a + "+" + an + ")}{2}=" + sum, true) : "");
        }
        ctx.sliders.appendChild(SK.slider({ label: "$n$", min: 2, max: 10, value: st.n, onInput: function (v) { st.n = v; draw(); } }).el);
        ctx.sliders.appendChild(SK.slider({ label: "$a_1$", min: 1, max: 5, value: st.a, color: "blue", onInput: function (v) { st.a = v; draw(); } }).el);
        ctx.sliders.appendChild(SK.slider({ label: "$d$", min: 0, max: 3, value: st.d, color: "green", onInput: function (v) { st.d = v; draw(); } }).el);
        return { show: draw };
      }
    },

    angles: [
      { title: "把階梯看成梯形", icon: "sparkle",
        html: "公式 $\\dfrac{n(a_1+a_n)}{2}$ 長得很像梯形面積 $\\dfrac{(\\text{上底}+\\text{下底})\\times\\text{高}}{2}$，這不是巧合。",
        render: trapezoidAngle },
      { title: "奇數的祕密：$1+3+5+\\cdots$ 永遠是平方數", icon: "bulb",
        html: "公差 $d=2$、首項 1 的等差級數，把每一項折成 L 形，會一層一層包出正方形。用公式驗算：$\\dfrac{n(1+(2n-1))}{2}=n^2$。兩種看法，同一個答案。",
        render: oddMini }
    ],

    challenges: [
      { q: "用公式算 $1+2+\\cdots+100$，再試試 $2+5+8+\\cdots+302$。先想想：一共有幾項？", hint: "從 2 到 302，每次加 3。$302=2+(n-1)\\times3$。",
        idea: "$n=101$ 項，和為 $\\dfrac{101\\times(2+302)}{2}=15352$。「有幾項」往往比「怎麼加」更容易出錯，畫出階梯的欄數就不會數錯。" },
      { q: "如果公差 $d$ 是負的（階梯往下走），兩個階梯還能拼成長方形嗎？", hint: "把滑桿想像成往下的樓梯，倒過來的那一份會是什麼形狀？",
        idea: "可以！往下走的階梯倒過來，變成往上走的，每一欄仍然是 $a_1+a_n$。公式不在乎階梯往哪個方向走。" },
      { q: "$1^2+2^2+\\cdots+n^2$ 要用三個「方塊金字塔」才拼得起來。你能想像三個金字塔怎麼拼成一個 $n\\times(n+1)\\times(2n+1)$ 的長方體嗎？", hint: "每一層是一個正方形板子：$1\\times1$、$2\\times2$、……疊成金字塔。",
        idea: "三份金字塔恰好拼成長方體，所以 $1^2+\\cdots+n^2=\\dfrac{n(n+1)(2n+1)}{6}$。高一的求和公式都能用類似的「拼起來」思路看。" }
    ],

    where: {
      codes: [["N-10-6", "數列、級數與遞迴：有限等比級數、常用求和公式、數學歸納法"]],
      exam: "高一共同必修，學測數 A、數 B 都在範圍內。等差級數的「首尾配對」想法，之後在數甲會變成黎曼和與積分的直覺：一堆細長條加起來，逼近曲線下的面積。",
      stop: "會等差、等比有限級數與常用求和公式（$\\sum k$、$\\sum k^2$、$\\sum k^3$）就好。差分法、特徵方程、高階遞迴與生成函數都不是高中核心，不必提前追。"
    }
  });
})();
