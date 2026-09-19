/* 單元：數學歸納法 */
(function () {
  var C = SK.C, s = SK.s;

  /* 畫一排骨牌；fallen = 已倒下的張數；gapAt = 間距太大的位置（-1 表示沒有） */
  function dominoes(g, n, fallen, x0, yb, opts) {
    opts = opts || {};
    var w = 14, h = 70, gap = 34;
    for (var i = 0; i < n; i++) {
      var x = x0 + i * gap + (opts.gapAt >= 0 && i > opts.gapAt ? 40 : 0);
      var down = i < fallen;
      var col = opts.hi && opts.hi.indexOf(i) >= 0 ? C.orange : (down ? C.blue : C.green);
      var r = s("rect", { x: x, y: yb - h, width: w, height: h, rx: 3, fill: col.f, stroke: C.cocoa, "stroke-width": 1.3 }, g);
      if (down) r.setAttribute("transform", "rotate(" + (i === n - 1 || (opts.gapAt === i) ? 90 : 64) + " " + (x + w) + " " + yb + ")");
      s("circle", { cx: x + w / 2, cy: yb - h + 12, r: 2.2, fill: C.cocoa }, g).setAttribute("transform", down ? r.getAttribute("transform") : "");
      if (opts.labels) SK.label(g, x + w / 2, yb + 16, opts.labels(i), { size: 12, color: C.soft });
    }
  }

  function hookVisual(el) {
    var svg = SK.svg(el, 420, 220, "一排骨牌");
    s("line", { x1: 10, y1: 170, x2: 410, y2: 170, stroke: C.cocoa, "stroke-width": 1.3 }, svg);
    dominoes(svg, 10, 0, 40, 170, { labels: function (i) { return i === 9 ? "…" : String(i + 1); } });
    SK.label(svg, 210, 205, "怎樣保證「每一張」都會倒？", { size: 14, color: C.soft });
  }

  SK.mountUnit({
    slug: "induction",
    en: "Push the first domino",
    formula: "\\co{P(1)}\\ \\text{成立},\\quad \\cb{P(k)\\Rightarrow P(k+1)}\\quad\\Longrightarrow\\quad P(n)\\ \\text{對所有正整數}\\ n\\ \\text{成立}",

    hook: {
      html: "桌上排了一長排骨牌，多到數不完。",
      ask: "你不可能一張一張去檢查。要確定「每一張都會倒」，最少需要知道哪幾件事？",
      visual: hookVisual
    },

    guess: {
      q: "有人把 $n=1,2,3,\\dots,39$ 一個一個代進 $n^2+n+41$，每次都得到質數。這樣就能說「對所有正整數 $n$，$n^2+n+41$ 都是質數」嗎？",
      options: [
        { t: "可以，檢查了 39 個都對", common: true, explain: "39 個例子看起來非常有說服力！可是試試 $n=40$：$40^2+40+41=1681=41^2$，不是質數。再多的例子也只是「到目前為止」，不能保證下一個。" },
        { t: "不行，例子再多也不能保證全部", truth: true, explain: "正是如此。$n=40$ 時 $1681=41\\times41$。數學歸納法要做的，就是把「無限多個例子」變成「兩件可以檢查的事」。" },
        { t: "要檢查到 100 才夠", explain: "檢查更多是好習慣，但「多少才夠」永遠說不準，因為正整數有無限多個。我們需要的是另一種推理方式。" },
        { t: "檢查一個就夠了", explain: "只檢查 $n=1$ 就相信全部，風險更大。不過你抓到了一個重點：第一個例子確實很重要，它是歸納法的第一步。" }
      ]
    },

    derive: {
      intro: "把每一個 $P(n)$ 想成一張骨牌：「$P(n)$ 成立」就是「第 $n$ 張倒下」。",
      frames: [
        { cap: "排好的骨牌 $P(1),P(2),P(3),\\dots$，一張代表一個 $n$ 的敘述。", tex: "P(1),\\ P(2),\\ P(3),\\ \\dots" },
        { cap: "<b>第一步（基底）</b>：推倒第一張，也就是證明 $P(1)$ 成立。", tex: "\\co{P(1)}\\ \\text{成立}" },
        { cap: "<b>第二步（遞推）</b>：證明「只要第 $k$ 張倒，第 $k+1$ 張就一定倒」，也就是間距夠近。注意這裡的 $k$ 是<b>任意</b>一張。", tex: "\\cb{P(k)\\ \\Rightarrow\\ P(k+1)}" },
        { cap: "兩件事合在一起，骨牌就會一路倒下去，沒有任何一張能倖免。", tex: "P(1)\\Rightarrow P(2)\\Rightarrow P(3)\\Rightarrow\\cdots" },
        { cap: "例子：$1+3+5+\\cdots+(2n-1)=n^2$。假設 $k\\times k$ 的正方形已經拼好，再加上一層 $2k+1$ 塊的 L 形，就變成 $(k+1)\\times(k+1)$。拖動滑桿改變 $k$。", tex: "\\underbrace{k^2}_{P(k)}+\\cb{(2k+1)}=(k+1)^2" },
        { cap: "少一件就不行：沒有推第一張，或者中間有一處間距太遠，後面的骨牌都不會倒。", tex: "\\text{缺基底或缺遞推}\\ \\Rightarrow\\ \\text{不能下結論}" }
      ],
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 520, 420, "數學歸納法的骨牌");
        var g = s("g", {}, svg);
        var st = { k: 4 }, anim = null, fallen = 0;
        var sl = SK.slider({ label: "$k$", min: 1, max: 8, value: st.k, onInput: function (v) { st.k = v; draw(); } });
        ctx.sliders.appendChild(sl.el);
        var read = SK.h("div", { class: "readout" });
        ctx.extra.appendChild(read);
        function draw() {
          var f = ctx.frame;
          sl.el.style.display = f === 4 ? "" : "none";
          g.innerHTML = "";
          if (f === 4) {
            var k = st.k, u = Math.min(38, 300 / (k + 1)), x0 = 60, y0 = 40;
            for (var i = 0; i <= k; i++) for (var j = 0; j <= k; j++) {
              var inL = i === k || j === k;
              s("rect", { x: x0 + i * u + 1, y: y0 + j * u + 1, width: u - 2, height: u - 2, rx: 3, fill: inL ? C.blue.f : C.orange.f, stroke: inL ? C.blue.s : C.orange.s, "stroke-width": 1.1 }, g);
            }
            SK.label(g, x0 + k * u / 2, y0 + (k + 1) * u + 20, "k × k = " + k * k, { size: 14, color: C.orange.s });
            SK.label(g, x0 + (k + 1) * u + 16, y0 + k * u / 2, "L 形 = 2k+1 = " + (2 * k + 1), { size: 14, anchor: "start", color: C.blue.s });
            read.innerHTML = SK.tex(k + "^2+(2\\times" + k + "+1)=" + k * k + "+" + (2 * k + 1) + "=" + (k + 1) * (k + 1) + "=(" + k + "+1)^2", true);
            return;
          }
          s("line", { x1: 10, y1: 250, x2: 510, y2: 250, stroke: C.cocoa, "stroke-width": 1.3 }, g);
          var n = 12, x0d = 40, labels = function (i) { return i === n - 1 ? "…" : "P(" + (i + 1) + ")"; };
          if (f === 0) dominoes(g, n, 0, x0d, 250, { labels: labels });
          else if (f === 1) dominoes(g, n, 1, x0d, 250, { labels: labels, hi: [0] });
          else if (f === 2) {
            dominoes(g, n, 5, x0d, 250, { labels: labels, hi: [4, 5] });
            SK.label(g, x0d + 5 * 34, 150, "第 k 張倒 ⟹ 第 k+1 張倒", { size: 14, color: C.orange.s });
          } else if (f === 3) dominoes(g, n, fallen, x0d, 250, { labels: labels });
          else if (f === 5) {
            dominoes(g, 6, 0, x0d, 250, { labels: labels });
            SK.label(g, x0d + 90, 150, "沒推第一張：一張都不倒", { size: 13, color: C.pink.s });
            dominoes(g, 6, 3, 270, 250, { gapAt: 2, labels: function (i) { return "P(" + (i + 1) + ")"; } });
            SK.label(g, 380, 150, "中間太遠：後面不倒", { size: 13, color: C.pink.s });
          }
          read.innerHTML = SK.tex(f === 3 ? "\\text{已倒下：}" + fallen + "\\ \\text{張}" : "P(n):\\ \\text{第 } n \\text{ 張倒下}", true);
        }
        function show(i) {
          if (anim) { clearInterval(anim); anim = null; }
          if (i === 3) {
            fallen = 0;
            anim = setInterval(function () { fallen++; draw(); if (fallen >= 12) { clearInterval(anim); anim = null; } }, 180);
          }
          draw();
        }
        return { show: show };
      }
    },

    angles: [
      { title: "用在求和公式", icon: "sparkle",
        html: "證明 $1+2+\\cdots+n=\\dfrac{n(n+1)}{2}$：<br>① $n=1$：左邊 $1$，右邊 $\\dfrac{1\\cdot2}{2}=1$，成立。<br>② 假設 $n=k$ 成立，那麼 $$1+2+\\cdots+k+\\cb{(k+1)}=\\frac{k(k+1)}{2}+\\cb{(k+1)}=\\frac{(k+1)(k+2)}{2},$$ 正好是 $n=k+1$ 時的公式。兩步都完成，公式對所有正整數成立。「等差級數」單元用圖看出這個公式，歸納法則是把它<b>證明</b>到每一個 $n$。" },
      { title: "一個錯在哪裡的「證明」", icon: "leaf",
        html: "「所有的鉛筆都是同一個顏色」：① 只有 1 支時當然同色。② 假設任何 $k$ 支都同色；拿 $k+1$ 支，先拿掉最後一支，剩下 $k$ 支同色；再拿掉第一支，剩下的 $k$ 支也同色，兩群有重疊，所以全部同色。<br>哪裡錯了？試試從 $k=1$ 走到 $k=2$：拿掉最後一支剩 1 支，拿掉第一支剩另 1 支，兩群<b>沒有重疊</b>！遞推在這一步斷了，就像骨牌中間有一個間距太遠。" }
    ],

    challenges: [
      { q: "用數學歸納法證明 $1^2+2^2+\\cdots+n^2=\\dfrac{n(n+1)(2n+1)}{6}$。", hint: "遞推時，在兩邊加上 $(k+1)^2$，再把右邊通分整理成 $\\dfrac{(k+1)(k+2)(2k+3)}{6}$。",
        idea: "$\\dfrac{k(k+1)(2k+1)}{6}+(k+1)^2=\\dfrac{(k+1)\\left[k(2k+1)+6(k+1)\\right]}{6}=\\dfrac{(k+1)(2k^2+7k+6)}{6}=\\dfrac{(k+1)(k+2)(2k+3)}{6}$。" },
      { q: "證明對所有正整數 $n$，$2^n>n$。遞推那一步要怎麼接？", hint: "假設 $2^k>k$，那 $2^{k+1}=2\\cdot2^k>2k$。$2k$ 和 $k+1$ 誰大？",
        idea: "$2^{k+1}>2k=k+k\\ge k+1$（因為 $k\\ge1$）。遞推常常需要一個「小不等式」當橋樑。" },
      { q: "「鉛筆」的錯誤證明裡，為什麼 $k\\ge2$ 之後的遞推其實是對的，只有 $k=1\\to2$ 壞掉？這告訴我們遞推要檢查什麼？", idea: "$k\\ge2$ 時兩群確實有重疊；只有 $k=1$ 時沒有。遞推必須對<b>每一個</b> $k$ 都成立，特別是最小的那幾個。" }
    ],

    where: {
      codes: [["N-10-6", "數列、級數與遞迴：一階有限遞迴、常用求和公式、數學歸納法"]],
      exam: "高一共同必修，學測數 A、數 B 都在範圍內。它把「看出規律」升級成「證明規律」，也是理解遞迴式的關鍵。",
      stop: "以求和公式、整除性與簡單不等式為主。強歸納法、複雜的不等式技巧，以及特徵方程、生成函數等高階遞迴工具都不是高中核心。"
    }
  });
})();
