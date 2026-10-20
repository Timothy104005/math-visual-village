/* 單元：有系統的計數 */
(function () {
  var C = SK.C, s = SK.s;

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 250, "上衣、褲子、鞋子的搭配");
    var cols = [C.orange, C.blue, C.green];
    SK.label(svg, 70, 24, "上衣", { size: 13, color: C.soft }); SK.label(svg, 200, 24, "褲子", { size: 13, color: C.soft }); SK.label(svg, 330, 24, "鞋子", { size: 13, color: C.soft });
    [0, 1, 2].forEach(function (i) { s("path", { d: "M" + (45) + " " + (50 + i * 62) + " l14 -8 h22 l14 8 l-8 10 h-4 v28 h-36 v-28 h-4z", fill: cols[i].f, stroke: cols[i].s, "stroke-width": 1.3, transform: "translate(0 0)" }, svg); });
    [0, 1].forEach(function (i) { s("path", { d: "M" + (185) + " " + (60 + i * 80) + " h32 v52 h-12 l-4 -34 l-4 34 h-12z", fill: cols[i + 1].f, stroke: cols[i + 1].s, "stroke-width": 1.3 }, svg); });
    [0, 1].forEach(function (i) { s("path", { d: "M" + (310) + " " + (80 + i * 70) + " h20 v12 h22 a6 6 0 0 1 0 12 h-42z", fill: C.gold.f, stroke: C.gold.s, "stroke-width": 1.3 }, svg); });
    SK.label(svg, 200, 236, "一共有幾種穿法？", { size: 14, color: C.pink.s });
  }

  SK.mountUnit({
    slug: "counting",
    en: "Count without missing, count without repeating",
    formula: "\\text{乘法原理 } n_1\\times n_2\\times n_3,\\qquad |A\\cup B|=|A|+|B|-|A\\cap B|",

    hook: {
      html: "3 件上衣、2 條褲子、2 雙鞋。每天挑一套，最多能連續幾天不重複？",
      ask: "當選項一多，要怎麼數才<b>不漏掉</b>、也<b>不重複</b>？",
      visual: hookVisual
    },

    guess: {
      q: "擲兩顆骰子，「至少有一顆是 6」有幾種結果？",
      options: [
        { t: "11 種", truth: true, explain: "第一顆是 6 有 6 種、第二顆是 6 有 6 種，但 (6,6) 被算了兩次，所以 $6+6-1=11$。這就是<b>取捨原理</b>。" },
        { t: "12 種", common: true, explain: "$6+6=12$ 非常直覺！但「兩顆都是 6」同時屬於兩種情況，被重複數了一次。畫出 $6\\times6$ 的格子就看得到重疊的那一格。" },
        { t: "6 種", explain: "這只數了其中一顆是 6 的情況。另一顆也可以是 6。" },
        { t: "36 種", explain: "36 是兩顆骰子全部的結果數。其中有 $5\\times5=25$ 種完全沒有 6，所以至少一顆 6 的是 $36-25=11$ 種：另一種數法，答案一樣。" }
      ]
    },

    derive: {
      intro: "拖動滑桿改變每一步的選項數，看樹狀圖怎麼長出來。",
      tall: true,
      frames: [
        { cap: "<b>樹狀圖</b>：每做一個選擇就分岔一次，每一條從根到葉的路徑就是一種結果。有系統地畫，就不會漏也不會重複。", tex: "\\text{結果數}=\\text{葉子數}" },
        { cap: "如果每一步的選項數都不受前一步影響，每個分岔點長出的枝數一樣，葉子數就是各步選項數<b>相乘</b>：<b>乘法原理</b>。", tex: "\\co{n_1}\\times\\cb{n_2}\\times\\cg{n_3}" },
        { cap: "如果事情分成<b>互不重疊</b>的幾類，每一類各自數完再<b>相加</b>：<b>加法原理</b>。例如搭公車有 $n_1$ 條路線、搭火車有 $n_2$ 班，去程共有 $n_1+n_2$ 種。", tex: "\\text{互斥的情況：}\\ \\co{n_1}+\\cb{n_2}" },
        { cap: "如果兩類<b>有重疊</b>，直接相加會把重疊的部分算兩次，要扣掉一次：<b>取捨原理</b>。圖是兩顆骰子的 36 種結果。", tex: "|\\co A\\cup\\cb B|=|\\co A|+|\\cb B|-|A\\cap B|" },
        { cap: "枝數會隨前一步改變時，仍然可以用樹狀圖。從 A、B、C、D 中選 3 個<b>排成一列、不可重複</b>：第一格 4 種、第二格剩 3 種、第三格剩 2 種。這就是下一個單元的「排列」。", tex: "4\\times3\\times2=24" }
      ],
      hint: "每一層的枝數由滑桿決定；第 4 步看骰子格子，第 5 步是不可重複的排列。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 540, 440, "樹狀圖與計數");
        var g = s("g", {}, svg);
        var st = { n: [3, 2, 2] };
        var cols = [C.orange.s, C.blue.s, C.green.s];
        var read = SK.h("div", { class: "readout" });
        var sl = [0, 1, 2].map(function (k) {
          var o = SK.slider({ label: "$n_" + (k + 1) + "$", min: 1, max: k === 0 ? 4 : 3, value: st.n[k], color: ["", "blue", "green"][k], onInput: function (v) { st.n[k] = v; draw(); } });
          ctx.sliders.appendChild(o.el);
          return o;
        });
        ctx.extra.appendChild(read);
        function tree(counts, names) {
          var leaves = counts.reduce(function (a, b) { return a * b; }, 1);
          var X = [40, 180, 320, 460], top = 24, h = 392, gap = h / leaves, idx = 0;
          function node(level, path, y0, y1) {
            var y = (y0 + y1) / 2;
            if (level === counts.length) {
              if (leaves <= 24) SK.label(g, X[level] + 12, y, path.join(""), { size: leaves > 16 ? 10 : 12, anchor: "start" });
              idx++;
              return y;
            }
            var avail = names ? names.filter(function (c) { return path.indexOf(c) < 0; }) : null;
            var n = counts[level], span = (y1 - y0) / n;
            for (var i = 0; i < n; i++) {
              var cy = node(level + 1, path.concat([names ? avail[i] : ["ABCD", "123", "xyz"][level][i]]), y0 + i * span, y0 + (i + 1) * span);
              s("line", { x1: X[level], y1: y, x2: X[level + 1], y2: cy, stroke: cols[level], "stroke-width": leaves > 24 ? 1 : 1.6 }, g);
              s("circle", { cx: X[level + 1], cy: cy, r: leaves > 24 ? 2.5 : 4, fill: cols[level] }, g);
            }
            return y;
          }
          var ry = node(0, [], top, top + h);
          s("circle", { cx: X[0], cy: ry, r: 6, fill: C.cocoa }, g);
          return leaves;
        }
        function draw() {
          var f = ctx.frame, n = st.n;
          g.innerHTML = "";
          sl.forEach(function (o, k) { o.el.style.display = f === 3 || f === 4 || (f === 2 && k === 2) ? "none" : ""; });
          if (f <= 1) {
            var L = tree(n);
            SK.label(g, 180, 432, "× " + n[0], { size: 12, color: cols[0] }); SK.label(g, 320, 432, "× " + n[1], { size: 12, color: cols[1] }); SK.label(g, 460, 432, "× " + n[2], { size: 12, color: cols[2] });
            read.innerHTML = f === 0 ? "數一數葉子：<b>" + L + "</b> 種" : SK.tex("\\co{" + n[0] + "}\\times\\cb{" + n[1] + "}\\times\\cg{" + n[2] + "}=" + L, true);
          } else if (f === 2) {
            var a = n[0], b = n[1], tot = a + b, y = 30, step = 380 / tot;
            var root = [60, 220];
            [["公車", a, C.orange], ["火車", b, C.blue]].forEach(function (grp, gi) {
              var y0 = y, cy = y0 + grp[1] * step / 2;
              s("line", { x1: root[0], y1: root[1], x2: 220, y2: cy, stroke: grp[2].s, "stroke-width": 2 }, g);
              s("rect", { x: 190, y: cy - 16, width: 60, height: 32, rx: 8, fill: grp[2].f, stroke: grp[2].s }, g);
              SK.label(g, 220, cy, grp[0], { size: 13 });
              for (var i = 0; i < grp[1]; i++) {
                var ly = y + (i + .5) * step;
                s("line", { x1: 250, y1: cy, x2: 400, y2: ly, stroke: grp[2].s, "stroke-width": 1.4 }, g);
                s("circle", { cx: 400, cy: ly, r: 5, fill: grp[2].s }, g);
                SK.label(g, 414, ly, grp[0] + (i + 1), { size: 12, anchor: "start" });
              }
              y += grp[1] * step;
              if (gi === 0) s("line", { x1: 180, y1: y, x2: 500, y2: y, stroke: C.line, "stroke-dasharray": "4 4" }, g);
            });
            s("circle", { cx: root[0], cy: root[1], r: 6, fill: C.cocoa }, g);
            read.innerHTML = SK.tex("\\co{" + a + "}+\\cb{" + b + "}=" + tot, true);
          } else if (f === 3) {
            var ox = 150, oy = 60, c = 50;
            SK.label(g, ox + 3 * c, oy - 30, "第二顆", { size: 13, color: C.soft });
            SK.label(g, ox - 50, oy + 3 * c, "第一顆", { size: 13, color: C.soft });
            for (var i2 = 1; i2 <= 6; i2++) {
              SK.label(g, ox + (i2 - .5) * c, oy - 10, String(i2), { size: 12, color: C.soft });
              SK.label(g, ox - 12, oy + (i2 - .5) * c, String(i2), { size: 12, color: C.soft });
              for (var j = 1; j <= 6; j++) {
                var inA = i2 === 6, inB = j === 6;
                s("rect", { x: ox + (j - 1) * c + 2, y: oy + (i2 - 1) * c + 2, width: c - 4, height: c - 4, rx: 6, fill: inA && inB ? C.purple.f : inA ? C.orange.f : inB ? C.blue.f : C.paper, stroke: inA && inB ? C.purple.s : C.line, "stroke-width": inA && inB ? 2.4 : 1 }, g);
                if (inA && inB) SK.label(g, ox + (j - .5) * c, oy + (i2 - .5) * c, "算兩次", { size: 10, color: C.purple.s });
              }
            }
            SK.label(g, ox + 3 * c, oy + 6 * c + 30, "蜜桃列：第一顆是 6（A）　灰藍行：第二顆是 6（B）", { size: 12, color: C.soft });
            read.innerHTML = SK.tex("6+6-1=11", true);
          } else {
            tree([4, 3, 2], ["A", "B", "C", "D"]);
            SK.label(g, 180, 432, "4 種", { size: 12, color: cols[0] }); SK.label(g, 320, 432, "剩 3 種", { size: 12, color: cols[1] }); SK.label(g, 460, 432, "剩 2 種", { size: 12, color: cols[2] });
            read.innerHTML = SK.tex("4\\times3\\times2=24", true);
          }
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "反面比較好數：扣掉不要的", icon: "sparkle",
        html: "「至少一顆 6」要分情況，但它的反面「一顆 6 都沒有」很好數：$5\\times5=25$。全部 36 種扣掉 25 種，剩 11 種。遇到「至少」，先想想反面。" },
      { title: "乘法原理的格子圖", icon: "leaf",
        html: "兩步的選擇可以畫成一張表：列是第一步的 $n_1$ 種、行是第二步的 $n_2$ 種，每一格是一種結果，一共 $n_1\\times n_2$ 格。骰子的 36 格就是 $6\\times6$。三步就是一個長方體的小方塊。" }
    ],

    challenges: [
      { q: "用 0、1、2、3、4 可以組成幾個三位數（數字可重複）？", hint: "百位數不能是 0。", idea: "百位 4 種、十位 5 種、個位 5 種：$4\\times5\\times5=100$ 個。" },
      { q: "1 到 60 中，不是 2、3、5 任何一個的倍數的有幾個？", hint: "先數「是 2 或 3 或 5 的倍數」，三個集合的取捨原理。",
        idea: "$30+20+12-10-6-4+2=44$，所以答案是 $60-44=16$ 個。" },
      { q: "從家到學校要經過 A 或 B 兩座橋其中一座。到 A 橋有 3 條路、A 橋到學校 2 條；到 B 橋 2 條、B 橋到學校 4 條。一共幾種走法？", idea: "兩類互斥，類內用乘法、類間用加法：$3\\times2+2\\times4=14$ 種。" }
    ],

    where: {
      codes: [["D-10-3", "有系統的計數：窮舉、樹狀圖、加法原理、乘法原理、取捨原理（本單元）；直線排列、組合與二項式展開見下一單元"]],
      exam: "10 年級<b>共同必修</b>，學測數 A、數 B 都考。是古典機率的基礎。",
      stop: "目標是能有系統地數，供古典機率使用。取捨原理到三個集合就夠了；複雜的分配問題、錯排公式等競賽技巧不是重點。"
    }
  });
})();
