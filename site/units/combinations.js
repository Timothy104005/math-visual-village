/* 單元：排列與組合（含二項式展開） */
(function () {
  var C = SK.C, s = SK.s;
  var PAL = [C.orange, C.blue, C.green, C.pink, C.gold, C.purple, C.mint];
  var NAMES = "ABCDEFG";

  function fact(n) { return n <= 1 ? 1 : n * fact(n - 1); }
  function comb(n, k) { return k < 0 || k > n ? 0 : Math.round(fact(n) / fact(k) / fact(n - k)); }
  // 所有 k 個一組的組合（遞增序）
  function combos(n, k) {
    var out = [];
    (function rec(start, cur) {
      if (cur.length === k) { out.push(cur.slice()); return; }
      for (var i = start; i < n; i++) { cur.push(i); rec(i + 1, cur); cur.pop(); }
    })(0, []);
    return out;
  }
  function perms(arr) {
    if (arr.length <= 1) return [arr.slice()];
    var out = [];
    arr.forEach(function (x, i) { perms(arr.slice(0, i).concat(arr.slice(i + 1))).forEach(function (p) { out.push([x].concat(p)); }); });
    return out;
  }

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 250, "五個人選三個");
    [0, 1, 2, 3, 4].forEach(function (i) {
      var x = 60 + i * 70;
      s("circle", { cx: x, cy: 70, r: 22, fill: PAL[i].f, stroke: PAL[i].s, "stroke-width": 1.5 }, svg);
      SK.label(svg, x, 70, NAMES[i], { size: 16 });
    });
    s("rect", { x: 30, y: 130, width: 160, height: 80, rx: 12, fill: C.paper, stroke: C.cocoa }, svg);
    SK.label(svg, 110, 150, "選 3 位當幹部", { size: 13 });
    SK.label(svg, 110, 182, "班長・副班長・學藝", { size: 12, color: C.soft });
    s("rect", { x: 210, y: 130, width: 160, height: 80, rx: 12, fill: C.paper, stroke: C.cocoa }, svg);
    SK.label(svg, 290, 150, "選 3 位去比賽", { size: 13 });
    SK.label(svg, 290, 182, "（不分職位）", { size: 12, color: C.soft });
    SK.label(svg, 200, 234, "哪一種的方法數比較多？多幾倍？", { size: 13, color: C.pink.s });
  }

  SK.mountUnit({
    slug: "combinations",
    en: "Order matters, or it doesn't",
    formula: "P^n_k=\\frac{n!}{(n-k)!},\\qquad C^n_k=\\frac{P^n_k}{\\co{k!}},\\qquad (a+b)^n=\\sum_{k=0}^{n}C^n_k\\,a^{n-k}b^k",

    hook: {
      html: "五個人裡選三個。一種是選班長、副班長、學藝（<b>有順序</b>），另一種是選三個人去比賽（<b>不分順序</b>）。",
      ask: "這兩種選法的方法數差多少？為什麼剛好差那麼多倍？",
      visual: hookVisual
    },

    guess: {
      q: "5 人選 3 人當班長、副班長、學藝有 60 種。選 3 人去比賽（不分職位）有幾種？",
      options: [
        { t: "10 種", truth: true, explain: "同樣三個人（例如 A、B、C）當幹部有 $3!=6$ 種分配職位的方法，但去比賽只算一種。所以 $60\\div6=10$。" },
        { t: "20 種", common: true, explain: "很多人會除以 3（因為選 3 個人）。但同一組三個人的排法是 $3\\times2\\times1=6$ 種，不是 3 種：要除以 $3!$。" },
        { t: "60 種", explain: "60 是有順序的算法。「A、B、C 去比賽」和「B、A、C 去比賽」是同一件事，不能分開算。" },
        { t: "15 種", explain: "15 是 $C^6_2$ 或 $5\\times3$，不是這題。試著用樹狀圖或列出 A、B、C、D、E 的三人組看看，會數到 10 組。" }
      ]
    },

    derive: {
      intro: "每一個小方框是一種「組合」（不管順序的一組人），框裡的每一列是這組人的一種「排列」。",
      tall: true,
      frames: [
        { cap: "<b>排列</b>：從 $n$ 個不同的東西選 $k$ 個<b>排成一列</b>。第一個位置 $n$ 種、第二個 $n-1$ 種……共乘 $k$ 項。", tex: "P^n_k=n(n-1)\\cdots(n-k+1)=\\frac{n!}{(n-k)!}" },
        { cap: "把用到<b>同一組人</b>的排列放進同一個框。每一框的排列數一樣多：$k$ 個人自己排成一列，有 $k!$ 種。", tex: "\\text{每一框}=\\co{k!}\\ \\text{種排列}" },
        { cap: "<b>組合</b>：只管選了誰、不管順序，就是「框」的數量。排列總數除以每框的 $k!$。", tex: "C^n_k=\\frac{P^n_k}{\\co{k!}}=\\frac{n!}{k!\\,(n-k)!}" },
        { cap: "把 $C^n_k$ 排成三角形（<b>巴斯卡三角形</b>）：每一個數是它肩上兩數的和。理由：選 $k$ 個時，某個人「被選」有 $C^{n-1}_{k-1}$ 種、「沒被選」有 $C^{n-1}_k$ 種。", tex: "C^n_k=C^{n-1}_{k-1}+C^{n-1}_k,\\qquad C^n_k=C^n_{n-k}" },
        { cap: "<b>二項式展開</b>：$(a+b)^n$ 是 $n$ 個 $(a+b)$ 相乘，每個括號挑 $a$ 或 $b$。挑出 $k$ 個 $b$ 的方法有 $C^n_k$ 種，所以 $a^{n-k}b^k$ 的係數就是 $C^n_k$。", tex: "(a+b)^n=\\sum_{k=0}^{n}C^n_k\\,a^{n-k}b^k" }
      ],
      hint: "改 n、k。框太多時只顯示數字；第 4、5 步看巴斯卡三角形。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 540, 440, "排列分組成組合");
        var g = s("g", {}, svg);
        var st = { n: 5, k: 3 };
        var read = SK.h("div", { class: "readout" });
        var slK;
        ctx.sliders.appendChild(SK.slider({ label: "$n$", min: 2, max: 7, value: 5, onInput: function (v) { st.n = v; if (st.k > v) { st.k = v; slK.set(v, true); } slK.input.max = v; draw(); } }).el);
        slK = SK.slider({ label: "$k$", min: 0, max: 5, value: 3, color: "blue", onInput: function (v) { st.k = Math.min(v, st.n); draw(); } });
        ctx.sliders.appendChild(slK.el);
        ctx.extra.appendChild(read);
        function dotRow(x, y, p, r) {
          p.forEach(function (i, j) {
            s("circle", { cx: x + j * (2 * r + 3), cy: y, r: r, fill: PAL[i].f, stroke: PAL[i].s, "stroke-width": 1 }, g);
            if (r >= 6) SK.label(g, x + j * (2 * r + 3), y, NAMES[i], { size: r * 1.4 });
          });
        }
        function pascal(n, k) {
          var rows = 8, top = 40, dy = 48, dx = 58;
          for (var r = 0; r < rows; r++) for (var c = 0; c <= r; c++) {
            var x = 270 + (c - r / 2) * dx, y = top + r * dy;
            var hi = r === n && c === k, sh = r === n - 1 && (c === k - 1 || c === k);
            if (sh && ctx.frame === 3) s("line", { x1: x, y1: y + 14, x2: 270 + (k - n / 2) * dx, y2: top + n * dy - 14, stroke: C.blue.s, "stroke-width": 1.6 }, g);
            s("circle", { cx: x, cy: y, r: 18, fill: hi ? C.orange.f : sh && ctx.frame === 3 ? C.blue.f : r === n && ctx.frame === 4 ? C.gold.f : C.paper, stroke: hi ? C.orange.s : C.line, "stroke-width": hi ? 2.2 : 1 }, g);
            SK.label(g, x, y, String(comb(r, c)), { size: 14, bold: hi });
          }
          SK.label(g, 30, top + n * dy, "n=" + n, { size: 12, color: C.soft, anchor: "start" });
        }
        function draw() {
          var f = ctx.frame, n = st.n, k = Math.min(st.k, n);
          g.innerHTML = "";
          var P = fact(n) / fact(n - k), Cc = comb(n, k);
          if (f >= 3) {
            pascal(n, k);
            if (f === 4) {
              var terms = [];
              for (var j = 0; j <= n; j++) terms.push((comb(n, j) > 1 ? comb(n, j) : "") + (n - j ? "a" + (n - j > 1 ? "^{" + (n - j) + "}" : "") : "") + (j ? "b" + (j > 1 ? "^{" + j + "}" : "") : ""));
              read.innerHTML = SK.tex((n >= 5 ? "\\footnotesize " : "") + "(a+b)^{" + n + "}=" + terms.join("+"), true);
            } else read.innerHTML = SK.tex("C^{" + n + "}_{" + k + "}=" + (k && k < n ? "C^{" + (n - 1) + "}_{" + (k - 1) + "}+C^{" + (n - 1) + "}_{" + k + "}=" + comb(n - 1, k - 1) + "+" + comb(n - 1, k) + "=" : "") + Cc, true);
            return;
          }
          // 人物列
          for (var i = 0; i < n; i++) {
            s("circle", { cx: 60 + i * 34, cy: 26, r: 13, fill: PAL[i].f, stroke: PAL[i].s }, g);
            SK.label(g, 60 + i * 34, 26, NAMES[i], { size: 13 });
          }
          SK.label(g, 60 + n * 34 + 10, 26, "選 " + k + " 個", { size: 13, color: C.soft, anchor: "start" });
          if (P > 120 || k === 0) {
            SK.label(g, 270, 200, k === 0 ? "一個都不選：只有 1 種（空的選法）" : "排列太多了（" + P + " 種），只看數字", { size: 15, color: C.soft });
          } else {
            var groups = combos(n, k), r = k >= 4 ? 5 : 6, rowH = 2 * r + 3, kf = fact(k);
            var cols = Math.min(groups.length, Math.max(1, Math.floor(500 / (k * (2 * r + 3) + 22))));
            var cw = 500 / cols, rowsN = Math.ceil(groups.length / cols), chH = Math.min(380 / rowsN, kf * rowH + 14);
            var rr = r;
            if (kf * rowH + 14 > chH) { rr = Math.max(2.5, (chH - 14) / kf / 2 - 1.5); rowH = 2 * rr + 3; }
            groups.forEach(function (grp, gi) {
              var gx = 20 + (gi % cols) * cw, gy = 50 + Math.floor(gi / cols) * chH;
              var boxed = f >= 1;
              if (boxed) s("rect", { x: gx + 3, y: gy + 3, width: cw - 6, height: chH - 6, rx: 8, fill: gi % 2 ? "rgba(241,226,184,.35)" : "rgba(210,198,218,.3)", stroke: f === 2 ? C.orange.s : C.line, "stroke-width": f === 2 ? 1.8 : 1 }, g);
              perms(grp).forEach(function (p, pi) {
                if (f === 2 && pi > 0) return;
                dotRow(gx + 14, gy + 10 + rr + pi * rowH, p, rr);
              });
            });
          }
          read.innerHTML = f === 0 ? SK.tex("P^{" + n + "}_{" + k + "}=" + (k ? Array.apply(null, Array(k)).map(function (_, i) { return n - i; }).join("\\times") : "1") + "=" + P, true)
            : f === 1 ? SK.tex(P + "\\ \\text{種排列}=" + Cc + "\\ \\text{框}\\times" + fact(k) + "\\ (=" + k + "!)", true)
            : SK.tex("C^{" + n + "}_{" + k + "}=\\frac{" + P + "}{" + k + "!}=" + Cc, true);
        }
        return { show: draw };
      }
    },

    drills: [
      { title: "二項式展開：用一般項找指定係數與常數項", code: "D-10-3",
        demo: {
          q: "(a) 求 $(2x-3)^5$ 展開式中 $x^3$ 的係數。(b) 求 $\\left(x^2-\\dfrac2x\\right)^6$ 展開式的常數項。",
          steps: [
            "$(a+b)^n$ 的一般項（第 $k+1$ 項）是 $\\binom nk a^{n-k}b^k$。把負號<b>留在 $b$ 裡</b>：(a) 取 $a=2x$、$b=-3$。",
            "要 $x^3$，$a$ 必須取 $3$ 次：$n-k=3$，$k=2$。這一項是 $\\binom52(2x)^3(-3)^2=10\\cdot8x^3\\cdot9=720x^3$，係數 $720$。",
            "(b) 取 $a=x^2$、$b=-2x^{-1}$。一般項 $\\binom6k(x^2)^{6-k}(-2)^kx^{-k}=\\binom6k(-2)^k\\,x^{12-3k}$。",
            "常數項要 $12-3k=0$，$k=4$：$\\binom64(-2)^4=15\\cdot16=240$。",
            "驗算的小技巧：令 $x=1$ 可得所有係數的和，例如 $(2x-3)^5$ 的係數和是 $(2-3)^5=-1$。"
          ]
        },
        tries: [
          { q: "求 $(1-2x)^7$ 中 $x^3$ 的係數。", ans: "$\\binom73(-2)^3=35\\cdot(-8)=-280$。負號跟著 $k=3$（奇數）留下來。" },
          { q: "求 $\\left(x+\\dfrac1{2x}\\right)^8$ 的常數項。", ans: "一般項 $\\binom8k\\left(\\frac12\\right)^kx^{8-2k}$，$k=4$：$70\\cdot\\frac1{16}=\\frac{35}8$。" },
          { q: "$\\left(x^2+\\dfrac1x\\right)^5$ 的展開式有沒有常數項？", ans: "指數 $2(5-k)-k=10-3k=0$ 沒有整數解，所以<b>沒有</b>常數項（常數項為 $0$）。" }
        ],
        edge: "最常見的錯是把負號丟掉：$(2x-3)^5$ 的 $b$ 是 $-3$，$(-3)^k$ 的正負跟著 $k$ 的奇偶走。「第 $k$ 項」不是「$x^k$ 項」：第 $k+1$ 項才是 $\\binom nk a^{n-k}b^k$。指數方程若沒有 $0\\le k\\le n$ 的<b>整數</b>解，就沒有那一項。問「係數」時不含 $x$，問「項」時要連 $x$ 一起寫。"
      }
    ],

    angles: [
      { title: "選誰留下 = 選誰離開", icon: "sparkle",
        html: "從 5 人選 3 人去比賽，和選 2 人留下來，是同一件事：每一種「選 3 人」恰好對應一種「留 2 人」。所以 $C^5_3=C^5_2=10$。巴斯卡三角形左右對稱，就是這個原因。" },
      { title: "走格子路線也是組合", icon: "leaf",
        html: "在棋盤格上從左下走到右上，只能往右或往上，右 4 步、上 3 步。每條路線就是 7 步裡挑哪 3 步往上：$C^7_3=35$ 條。巴斯卡三角形的「肩上兩數相加」，就是「最後一步從左邊來或從下面來」。" }
    ],

    challenges: [
      { q: "$(x+2)^5$ 展開後，$x^3$ 的係數是多少？", idea: "挑 2 個括號出 2、3 個括號出 $x$：$C^5_2\\cdot2^2=10\\times4=40$。" },
      { q: "巴斯卡三角形第 $n$ 列的數字加起來是多少？", hint: "在 $(a+b)^n$ 裡代 $a=b=1$。", idea: "$\\sum_k C^n_k=(1+1)^n=2^n$。也可以這樣想：$n$ 個人，每個人「選或不選」，一共 $2^n$ 種子集。" },
      { q: "10 人圍成一圈坐，有幾種坐法？（旋轉後一樣的算同一種）", idea: "排成一列有 $10!$ 種，但每一種圓形坐法對應 10 種一列的排法（從誰開始數），所以是 $\\tfrac{10!}{10}=9!$。和組合除以 $k!$ 是同一個想法：扣掉「看不出來的差別」。" }
    ],

    where: {
      codes: [["D-10-3", "有系統的計數：直線排列、組合、巴斯卡三角形與二項式展開的基本應用（窮舉、樹狀圖與加乘、取捨原理見上一單元）"]],
      exam: "10 年級<b>共同必修</b>，學測數 A、數 B 都考。是古典機率與 12 年級二項分布的基礎。",

      past: [] /* Examination text excluded; see docs/PROVENANCE.md. */,
      stop: "目標是能數古典機率需要的情況。二項式展開只作基本應用（求某一項係數、係數和）；重複組合 $H^n_k$、複雜分組分配等技巧題不是課綱重點。"
    }
  });
})();
