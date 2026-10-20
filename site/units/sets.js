/* 單元：集合與文氏圖 */
(function () {
  var C = SK.C, s = SK.s;

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 250, "兩個社團的名單重疊");
    s("rect", { x: 14, y: 14, width: 372, height: 204, rx: 14, fill: C.paper, stroke: C.cocoa }, svg);
    s("circle", { cx: 150, cy: 116, r: 80, fill: C.orange.f, stroke: C.orange.s, "stroke-width": 1.5 }, svg);
    s("circle", { cx: 250, cy: 116, r: 80, fill: C.blue.f, stroke: C.blue.s, "stroke-width": 1.5 }, svg);
    SK.label(svg, 110, 116, "熱舞社 18 人", { size: 13 });
    SK.label(svg, 292, 116, "吉他社 15 人", { size: 13 });
    SK.label(svg, 200, 116, "?", { size: 22, color: C.pink.s });
    SK.label(svg, 200, 238, "全班 35 人，兩社都沒參加的有 8 人", { size: 13, color: C.soft });
  }

  var OPS = [
    ["A", function (a, b) { return a; }],
    ["B", function (a, b) { return b; }],
    ["A∩B", function (a, b) { return a && b; }],
    ["A∪B", function (a, b) { return a || b; }],
    ["A'", function (a, b) { return !a; }],
    ["A∩B'", function (a, b) { return a && !b; }],
    ["(A∪B)'", function (a, b) { return !(a || b); }],
    ["A'∩B'", function (a, b) { return !a && !b; }]
  ];

  SK.mountUnit({
    slug: "sets",
    en: "Draw conditions as circles",
    formula: "\\co A\\cap\\cb B,\\qquad \\co A\\cup\\cb B,\\qquad (\\co A\\cup\\cb B)'=\\co A'\\cap\\cb B'",

    hook: {
      html: "全班 35 人：熱舞社 18 人、吉他社 15 人，兩社都沒參加的有 8 人。",
      ask: "兩個社團都參加的有幾個人？不用列名單，畫兩個圈就看得出來。",
      visual: hookVisual
    },

    guess: {
      q: "承上題，兩社都參加的有幾人？",
      options: [
        { t: "6 人", truth: true, explain: "有參加社團的是 $35-8=27$ 人。$18+15=33$ 比 27 多了 6，因為兩社都參加的人被算了兩次。所以交集是 $33-27=6$ 人。" },
        { t: "0 人", common: true, explain: "如果直接把 $18+15=33$ 當成有參加的人數，就會以為沒人重疊。但 $33>27$，多出來的正是被重複計算的人。" },
        { t: "3 人", explain: "差一點點！$33-27=6$，這 6 人就是被算兩次的人，不需要再除以 2。" },
        { t: "條件不夠", explain: "其實夠了。總人數、各圈人數、圈外人數，四個數字剛好決定中間那塊。" }
      ]
    },

    derive: {
      intro: "宇集 $U=\\{1,2,\\dots,20\\}$。$A$ 是 $m$ 的倍數、$B$ 是 $n$ 的倍數。點選下面的按鈕，看每個集合是文氏圖上的哪一塊。",
      tall: true,
      frames: [
        { cap: "集合可以<b>列舉</b>（把元素寫出來），也可以<b>描述</b>（寫出條件）。元素 $x$ 在集合 $A$ 裡，記作 $x\\in A$。", tex: "\\begin{aligned}A&=\\{2,4,6,\\dots,20\\}\\\\&=\\{x\\in U\\mid x\\ \\text{是 2 的倍數}\\}\\end{aligned}" },
        { cap: "$A$ 的每個元素都在 $B$ 裡，就說 $A$ 是 $B$ 的<b>子集</b>，$A\\subseteq B$。「屬於 $\\in$」是元素和集合的關係，「包含 $\\subseteq$」是集合和集合的關係。沒有元素的集合叫<b>空集合</b> $\\varnothing$，它是每個集合的子集。", tex: "6\\in A,\\quad \\{6\\}\\subseteq A,\\quad \\varnothing\\subseteq A" },
        { cap: "<b>交集</b> $A\\cap B$：同時在兩個圈裡（中間的橄欖形）。<b>聯集</b> $A\\cup B$：至少在一個圈裡。", tex: "\\begin{gathered}A\\cap B=\\{x\\mid x\\in A\\text{ 且 }x\\in B\\}\\\\A\\cup B=\\{x\\mid x\\in A\\text{ 或 }x\\in B\\}\\end{gathered}" },
        { cap: "數聯集的元素時，中間那塊被 $A$、$B$ 各算了一次，要扣掉一次。這就是暖身題的算法。", tex: "|A\\cup B|=|\\co A|+|\\cb B|-|A\\cap B|" },
        { cap: "<b>餘集</b> $A'$：在宇集裡、但不在 $A$ 裡。「不在 $A\\cup B$ 裡」就是「既不在 $A$ 也不在 $B$」：<b>笛摩根定律</b>。點選 (A∪B)' 和 A'∩B'，比較兩塊一不一樣。", tex: "\\begin{gathered}(A\\cup B)'=A'\\cap B'\\\\(A\\cap B)'=A'\\cup B'\\end{gathered}" }
      ],
      hint: "點選不同的集合運算；也可以改 m、n，看圈裡的數字怎麼換位子。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 540, 440, "兩個集合的文氏圖");
        var id = "st" + Math.random().toString(36).slice(2, 7);
        var A = [205, 190], B = [335, 190], R = 118;
        s("defs", {}, svg).innerHTML =
          '<clipPath id="' + id + 'cA"><circle cx="' + A[0] + '" cy="' + A[1] + '" r="' + R + '"/></clipPath>' +
          '<mask id="' + id + 'nA"><rect width="540" height="440" fill="#fff"/><circle cx="' + A[0] + '" cy="' + A[1] + '" r="' + R + '" fill="#000"/></mask>' +
          '<mask id="' + id + 'nB"><rect width="540" height="440" fill="#fff"/><circle cx="' + B[0] + '" cy="' + B[1] + '" r="' + R + '" fill="#000"/></mask>';
        var gFill = s("g", {}, svg), g = s("g", {}, svg);
        var st = { m: 2, n: 3, op: 2 };
        var btns = SK.h("div", { style: "display:flex;flex-wrap:wrap;gap:6px" });
        OPS.forEach(function (o, i) {
          var b = SK.h("button", { class: "chip", type: "button", "aria-pressed": i === st.op ? "true" : "false" }, o[0]);
          b.addEventListener("click", function () { st.op = i; Array.prototype.forEach.call(btns.children, function (x, k) { x.setAttribute("aria-pressed", k === i ? "true" : "false"); }); draw(); });
          btns.appendChild(b);
        });
        ctx.sliders.appendChild(SK.slider({ label: "$m$", min: 2, max: 6, value: 2, onInput: function (v) { st.m = v; draw(); } }).el);
        ctx.sliders.appendChild(SK.slider({ label: "$n$", min: 2, max: 6, value: 3, color: "blue", onInput: function (v) { st.n = v; draw(); } }).el);
        ctx.extra.appendChild(btns);
        var read = SK.h("div", { class: "readout", style: "margin-top:10px" });
        ctx.extra.appendChild(read);
        // 每一塊區域的候選位置
        function inC(p, c) { return Math.hypot(p[0] - c[0], p[1] - c[1]) < R - 16; }
        function outC(p, c) { return Math.hypot(p[0] - c[0], p[1] - c[1]) > R + 16; }
        var slots = { ab: [], a: [], b: [], o: [] };
        for (var y = 60; y <= 400; y += 30) for (var x = 50; x <= 500; x += 30) {
          var p = [x, y];
          if (inC(p, A) && inC(p, B)) slots.ab.push(p);
          else if (inC(p, A) && outC(p, B)) slots.a.push(p);
          else if (inC(p, B) && outC(p, A)) slots.b.push(p);
          else if (outC(p, A) && outC(p, B) && y < 400) slots.o.push(p);
        }
        function center(list, c) { return list.slice().sort(function (u, v) { return Math.hypot(u[0] - c[0], u[1] - c[1]) - Math.hypot(v[0] - c[0], v[1] - c[1]); }); }
        slots.ab = center(slots.ab, [270, 190]); slots.a = center(slots.a, [150, 190]); slots.b = center(slots.b, [390, 190]); slots.o = center(slots.o, [270, 390]);
        function region(key, fill) {
          var el;
          if (key === "ab") el = s("circle", { cx: B[0], cy: B[1], r: R, "clip-path": "url(#" + id + "cA)" }, gFill);
          if (key === "a") el = s("circle", { cx: A[0], cy: A[1], r: R, mask: "url(#" + id + "nB)" }, gFill);
          if (key === "b") { var gg = s("g", { mask: "url(#" + id + "nA)" }, gFill); el = s("circle", { cx: B[0], cy: B[1], r: R }, gg); }
          if (key === "o") { var g2 = s("g", { mask: "url(#" + id + "nA)" }, gFill); var g3 = s("g", { mask: "url(#" + id + "nB)" }, g2); el = s("rect", { x: 20, y: 20, width: 500, height: 400, rx: 16 }, g3); }
          el.setAttribute("fill", fill);
        }
        function draw() {
          var f = ctx.frame, m = st.m, n = st.n, op = OPS[f === 0 || f === 1 ? 0 : st.op];
          gFill.innerHTML = ""; g.innerHTML = "";
          s("rect", { x: 20, y: 20, width: 500, height: 400, rx: 16, fill: C.paper, stroke: C.cocoa, "stroke-width": 1.2 }, gFill);
          var map = { ab: [true, true], a: [true, false], b: [false, true], o: [false, false] };
          Object.keys(map).forEach(function (k) { if (op[1](map[k][0], map[k][1])) region(k, C.gold.f); });
          s("circle", { cx: A[0], cy: A[1], r: R, fill: "none", stroke: C.orange.s, "stroke-width": 2 }, g);
          s("circle", { cx: B[0], cy: B[1], r: R, fill: "none", stroke: C.blue.s, "stroke-width": 2 }, g);
          SK.label(g, 40, 40, "U", { it: true, anchor: "start" });
          SK.label(g, A[0] - 70, A[1] - R + 8, "A", { it: true, color: C.orange.s });
          SK.label(g, B[0] + 70, B[1] - R + 8, "B", { it: true, color: C.blue.s });
          var used = { ab: 0, a: 0, b: 0, o: 0 }, res = [], cA = 0, cB = 0, cAB = 0;
          for (var x = 1; x <= 20; x++) {
            var ia = x % m === 0, ib = x % n === 0, k = ia && ib ? "ab" : ia ? "a" : ib ? "b" : "o";
            var p = slots[k][used[k]++] || [270, 425];
            var on = op[1](ia, ib);
            if (on) res.push(x);
            cA += ia; cB += ib; cAB += ia && ib;
            SK.label(g, p[0], p[1], String(x), { size: 14, bold: on, color: on ? C.ink : C.soft });
          }
          var name = op[0];
          read.innerHTML = SK.tex(name.replace(/∩/g, "\\cap ").replace(/∪/g, "\\cup ") + "=\\{" + (res.length ? res.join(",") : "\\ ") + "\\}" + (res.length ? "" : "=\\varnothing"), true) +
            (f === 3 ? SK.tex("|A\\cup B|=" + cA + "+" + cB + "-" + cAB + "=" + (cA + cB - cAB), true) : "") +
            (f === 1 && (m % n === 0 || n % m === 0) ? '<p class="muted" style="margin:4px 0 0">現在一個圈整個在另一個圈裡：' + (n % m === 0 ? "B ⊆ A" : "A ⊆ B") + "</p>" : "");
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "集合就是條件，運算就是邏輯", icon: "sparkle",
        html: "「$x\\in A\\cap B$」就是「$x\\in A$ <b>且</b> $x\\in B$」；聯集是「或」，餘集是「非」，子集是「若…則…」。所以笛摩根定律在集合和邏輯裡長得一模一樣。「邏輯與條件」單元用的就是這張圖。" },
      { title: "三個圈：八塊區域", icon: "leaf",
        html: "兩個圈把宇集分成 4 塊，三個圈分成 8 塊（每個元素對三個集合各有「在／不在」兩種，$2^3=8$）。數三個集合的聯集，要加三個圈、扣三個兩兩交集、再加回三者交集：$|A\\cup B\\cup C|=\\sum|A|-\\sum|A\\cap B|+|A\\cap B\\cap C|$。" }
    ],

    challenges: [
      { q: "1 到 100 裡，是 2 或 3 的倍數的數有幾個？", idea: "$50+33-16=67$ 個（6 的倍數有 16 個，被算了兩次）。" },
      { q: "$A=\\{1,2\\}$ 有幾個子集？$A=\\{1,2,3\\}$ 呢？", hint: "每個元素可以選「放進去」或「不放」。", idea: "$2^2=4$ 個：$\\varnothing,\\{1\\},\\{2\\},\\{1,2\\}$；三個元素有 $2^3=8$ 個。" },
      { q: "用文氏圖說明 $(A\\cap B)'=A'\\cup B'$。", idea: "左邊：把中間的橄欖形挖掉，其他三塊都塗色。右邊：$A'$ 塗 $A$ 外面、$B'$ 塗 $B$ 外面，合起來也正好是橄欖形以外的三塊。" }
    ],

    where: {
      codes: [["D-10-1", "集合：集合的表示法、宇集、空集合、子集、交集、聯集、餘集、屬於與包含關係、文氏圖"]],
      exam: "10 年級<b>共同必修</b>。大考標為 ★＃：不單獨命題，但是計數與機率的基本語言。",
      stop: "會用集合語言描述事件、會畫文氏圖、會用取捨原理數兩三個集合就夠了。脫離情境的集合符號操作、集合的代數證明不是重點。"
    }
  });
})();
