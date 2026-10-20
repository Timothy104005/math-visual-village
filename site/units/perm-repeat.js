/* 補充單元：同物排列 */
(function () {
  var C = SK.C, s = SK.s;
  var TILE = { B: C.blue, A: C.orange, N: C.green, P: C.purple, L: C.gold, E: C.pink, M: C.blue, I: C.orange, S: C.green };
  function fact(n) { var r = 1; for (var i = 2; i <= n; i++) r *= i; return r; }
  function counts(w) { var c = {}; w.split("").forEach(function (ch) { c[ch] = (c[ch] || 0) + 1; }); return c; }

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 200, "BANANA 的字母卡");
    "BANANA".split("").forEach(function (ch, i) {
      var x = 50 + i * 52, col = TILE[ch];
      s("rect", { x: x, y: 60, width: 44, height: 56, rx: 8, fill: col.f, stroke: C.cocoa, "stroke-width": 1.2 }, svg);
      SK.label(svg, x + 22, 88, ch, { size: 22 });
    });
    SK.label(svg, 200, 160, "這六張卡片能排出幾種不同的「字」？", { size: 13, color: C.soft });
  }

  SK.mountUnit({
    slug: "perm-repeat",
    en: "Arrangements when some items look the same",
    formula: "\\frac{n!}{\\co{n_1!}\\,\\cb{n_2!}\\cdots\\cg{n_k!}}",

    hook: {
      html: "把 B、A、N、A、N、A 六張字母卡排成一列。如果六張都不一樣，會有 $6!=720$ 種排法。",
      ask: "但三個 A 長得一模一樣，兩個 N 也一樣。很多排法其實看起來相同，要怎麼扣掉重複的？",
      visual: hookVisual
    },

    guess: {
      q: "BANANA 可以排出幾種看起來不同的字？",
      options: [
        { t: "720", common: true, explain: "720 是把六張卡片當成都不一樣的排法。但交換兩個 A 的位置，看起來完全一樣，這些都被重複計算了。" },
        { t: "60", truth: true, explain: "$\\dfrac{6!}{3!\\,2!}=\\dfrac{720}{12}=60$。三個 A 互換有 $3!$ 種、兩個 N 互換有 $2!$ 種，每一種「看得到的字」都被重複算了 12 次。" },
        { t: "120", explain: "只扣掉了 A 的重複（$\\frac{720}{3!}$），還要再扣掉兩個 N 的重複。" },
        { t: "20", explain: "這是 $C^6_3$：只決定三個 A 放在哪裡。剩下三格還要放 B 和兩個 N，有 3 種放法，$20\\times3=60$。" }
      ]
    },

    derive: {
      intro: "按按鈕換一個字。先把相同的字母加上小編號，當成不同的卡片，再把編號拿掉。",
      frames: [
        { cap: "先<b>假裝</b>相同的字母可以區分：$A_1,A_2,A_3$、$N_1,N_2$。這樣就是 $n$ 個不同物件的排列。", tex: "n!" },
        { cap: "現在把編號拿掉。一個看得到的字，例如 BANANA，對應到幾種有編號的排法？A 的編號可以任意調換：$3!$ 種。", tex: "\\text{A 的編號互換：}\\ \\co{3!}" },
        { cap: "N 的編號也可以任意調換：$2!$ 種。所以每一個看得到的字，都被重複算了 $3!\\times2!$ 次。", tex: "\\text{每個字被重複算}\\ \\co{3!}\\times\\cb{2!}\\ \\text{次}" },
        { cap: "把總數除以重複的次數，就是答案。一般的公式：每一種相同的物件，都除以它數量的階乘。", tex: "\\frac{n!}{n_1!\\,n_2!\\cdots n_k!}" }
      ],
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 520, 380, "字母卡片的排列");
        var g = s("g", {}, svg);
        var st = { w: "BANANA" };
        var read = SK.h("div", { class: "readout" });
        var row = SK.h("div", { class: "controls" });
        ["BANANA", "APPLE", "MISSISSIPPI", "LEVEL"].forEach(function (w) {
          var b = SK.h("button", { class: "btn small ghost", type: "button" }, w);
          b.onclick = function () { st.w = w; draw(); };
          row.appendChild(b);
        });
        ctx.sliders.appendChild(row); ctx.extra.appendChild(read);
        function draw() {
          var f = ctx.frame, w = st.w, n = w.length, cnt = counts(w), seen = {}, tw = Math.min(44, 470 / n);
          g.innerHTML = "";
          w.split("").forEach(function (ch, i) {
            seen[ch] = (seen[ch] || 0) + 1;
            var x = 260 - n * tw / 2 + i * tw, col = TILE[ch] || C.gold;
            s("rect", { x: x + 2, y: 50, width: tw - 4, height: 60, rx: 7, fill: col.f, stroke: C.cocoa, "stroke-width": 1.2 }, g);
            SK.label(g, x + tw / 2, 78, ch, { size: tw > 36 ? 22 : 16 });
            if (f === 0 && cnt[ch] > 1) SK.label(g, x + tw / 2 + tw * .22, 96, String(seen[ch]), { size: 11, color: C.pink.s });
          });
          var reps = Object.keys(cnt).filter(function (k) { return cnt[k] > 1; });
          if (f >= 1) {
            reps.forEach(function (ch, j) {
              if (f === 1 && j > 0) return;
              var y = 150 + j * 44;
              SK.label(g, 40, y, ch + " 有 " + cnt[ch] + " 張：編號互換 " + cnt[ch] + "! = " + fact(cnt[ch]) + " 種", { size: 15, anchor: "start", color: (TILE[ch] || C.gold).s });
            });
          }
          var denom = reps.reduce(function (a, k) { return a * fact(cnt[k]); }, 1);
          var texDen = reps.map(function (k) { return cnt[k] + "!"; }).join("\\,") || "1";
          read.innerHTML = SK.tex(f >= 3 ? "\\frac{" + n + "!}{" + texDen + "}=\\frac{" + fact(n) + "}{" + denom + "}=" + fact(n) / denom : n + "!=" + fact(n), true);
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "捷徑走法也是同物排列", icon: "sparkle",
        html: "在棋盤格上從左下走到右上，只能往右（R）或往上（U）。走 3 格右、2 格上，每一條路徑就是 R、R、R、U、U 的一種排列，共有 $\\dfrac{5!}{3!\\,2!}=10$ 條。這和「從 5 步中選 2 步往上」的 $C^5_2=10$ 是同一件事，也是二項分布裡「路徑數 $C^n_k$」的來源。" }
    ],

    challenges: [
      { q: "MISSISSIPPI 有幾種排法？", idea: "11 個字母：I 四個、S 四個、P 兩個、M 一個。$\\dfrac{11!}{4!\\,4!\\,2!}=34650$。" },
      { q: "用 1、1、2、2、2 可以排出幾個五位數？", idea: "$\\dfrac{5!}{2!\\,3!}=10$ 個。" },
      { q: "什麼時候<b>不能</b>直接用這個公式？", idea: "先問三件事：物件是否可辨識？順序是否重要？能不能重複取？例如排成一個圓圈、或者有「某兩個不能相鄰」的條件，就要重新想樣本空間，不能直接套公式。" }
    ],

    where: {
      codes: [["D-10-3", "（接點）有系統計數：直線排列、組合"]],
      exam: "<b>課綱外補充</b>：高一正式條目只明列直線排列與組合。同物排列只在真實情境出現時補充，用來練習檢查「有沒有重複計數」。",
      stop: "從具體列舉與「除去重複」出發，再給簡式；不建立龐大的排列組合公式表，也不把分堆分組技巧當成基本能力。"
    }
  });
})();
