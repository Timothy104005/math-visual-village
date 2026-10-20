/* 單元：分組分堆 */
(function () {
  var C = SK.C, s = SK.s;

  var NAME = ["A", "B", "C", "D", "E", "F"];
  var COL = [C.orange, C.blue, C.green, C.pink, C.gold, C.purple];

  /* 把 6 個人分成 3 個「沒有名字」的兩人堆：共 15 種 */
  function partitions() {
    var out = [];
    var rest0 = [1, 2, 3, 4, 5];
    rest0.forEach(function (b) {
      var r1 = rest0.filter(function (x) { return x !== b; });
      var c = r1[0];
      r1.slice(1).forEach(function (d) {
        var r2 = r1.slice(1).filter(function (x) { return x !== d; });
        out.push([[0, b], [c, d], r2]);
      });
    });
    return out;
  }
  var PARTS = partitions();

  function fact(n) { var r = 1; for (var i = 2; i <= n; i++) r *= i; return r; }
  function perms3() { return [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]]; }

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 235, "六個人與三個兩人小組");
    NAME.forEach(function (n, i) {
      var x = 60 + i * 56;
      s("circle", { cx: x, cy: 50, r: 17, fill: COL[i].f, stroke: COL[i].s, "stroke-width": 1.6 }, svg);
      SK.label(svg, x, 50, n, { size: 15 });
    });
    ["甲組", "乙組", "丙組"].forEach(function (t, i) {
      var x = 90 + i * 110;
      s("rect", { x: x - 42, y: 120, width: 84, height: 58, rx: 10, fill: "none", stroke: C.cocoa, "stroke-width": 1.5, "stroke-dasharray": "5 4" }, svg);
      SK.label(svg, x, 149, t, { size: 14, color: C.soft });
    });
    SK.label(svg, 200, 202, "有名字的三組，和「就只是分成三堆」", { size: 13, color: C.soft });
    SK.label(svg, 200, 222, "算出來的答案會一樣嗎？", { size: 13, color: C.pink.s });
  }

  SK.mountUnit({
    slug: "grouping",
    en: "When the groups have no names",
    formula: "\\frac{C^6_2\\,C^4_2\\,C^2_2}{\\co{3!}}=\\frac{90}{6}=15",

    hook: {
      html: "班上 6 個人（A 到 F）要兩兩一組，分成三組。<br>情況一：三組分別進<b>甲、乙、丙三間教室</b>。情況二：只是<b>分成三堆</b>一起討論，堆沒有名字。",
      ask: "這兩種情況的分法數會一樣嗎？如果不一樣，差在哪裡、差幾倍？",
      visual: hookVisual
    },

    guess: {
      q: "6 個人分成 3 <b>堆</b>，每堆 2 人（堆沒有名字），共有幾種分法？",
      options: [
        { t: "90", common: true, explain: "$C^6_2\\times C^4_2\\times C^2_2=15\\times6\\times1=90$。這個算式非常合理，但它偷偷地把堆<b>編了號</b>：先選的是第一堆、再選的是第二堆。堆沒有名字的時候，同一種分堆方式被重複算了好幾次。" },
        { t: "15", truth: true, explain: "90 要再除以 $3!=6$。因為 $\\{AB\\},\\{CD\\},\\{EF\\}$ 這一種分堆，在 90 的算法裡以 6 種不同的「先後順序」各被算了一次。$90\\div6=15$。" },
        { t: "720", explain: "$6!=720$ 是六個人<b>排成一列</b>的方法數。分堆不管堆內誰先誰後，也不管堆的順序，要扣掉的重複多得多。" },
        { t: "20", explain: "$C^6_3=20$ 是「從 6 人選 3 人」的方法數，和「分成三個兩人堆」是不同的問題。" }
      ]
    },

    derive: {
      intro: "下面畫出<b>全部 15 種</b>分堆方式。走到第 3 步時，會把其中一種攤開，看它在「有名字」的算法裡被數了幾次。",
      tall: true,
      frames: [
        { cap: "先做<b>有名字</b>的版本：甲組先挑 2 人，從 6 人中選，有 $C^6_2=15$ 種。", tex: "C^6_2=15" },
        { cap: "甲組挑完後剩 4 人，乙組再挑 2 人有 $C^4_2=6$ 種；最後 2 人自動進丙組，$C^2_2=1$ 種。三個步驟接在一起用<b>乘法原理</b>。", tex: "C^6_2\\,C^4_2\\,C^2_2=15\\times6\\times1=90" },
        { cap: "現在把名字拿掉。看被圈起來的那一種分堆：它在剛才 90 的算法裡，<b>出現了 6 次</b>——同樣三堆人，誰當甲、誰當乙、誰當丙，有 $3!$ 種排法。", tex: "3!=6\\ \\text{種「誰是甲乙丙」}" },
        { cap: "每一種分堆方式都剛好被重複算 $3!$ 次，一次也不多、一次也不少。所以<b>除以 $3!$</b> 就得到答案。這 15 種就全部畫在上面了。", tex: "\\frac{90}{\\co{3!}}=15" },
        { cap: "一般規則：先當成有名字去算，再把<b>大小相同</b>的堆數 $k$ 除掉一個 $k!$。注意只除大小相同的那幾堆——大小不同的堆本來就分得出來，不會被重複算。", tex: "\\frac{C^n_{a}C^{n-a}_{a}\\cdots}{k!}\\quad(k\\ \\text{堆大小相同})" },
        { cap: "對照：6 人分成 <b>3 人、2 人、1 人</b>三堆。三堆大小都不一樣，光看人數就知道誰是誰，<b>不用除</b>。$C^6_3C^3_2C^1_1=20\\times3\\times1=60$。", tex: "C^6_3\\,C^3_2\\,C^1_1=60\\quad(\\text{不用除})" }
      ],
      hint: "用滑桿換一種被圈起來的分堆，看它攤開後的 6 種排法。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 540, 430, "全部 15 種分堆方式");
        var g = s("g", {}, svg);
        var st = { pick: 0 };
        var read = SK.h("div", { class: "readout" });
        ctx.extra.appendChild(read);
        var sl = SK.slider({
          label: "圈起來看第幾種", min: 1, max: 15, step: 1, value: 1,
          fmt: function (v) { return "第 " + v + " 種"; },
          onInput: function (v) { st.pick = v - 1; draw(); }
        });
        ctx.sliders.appendChild(sl.el);

        function person(px, py, i, r) {
          s("circle", { cx: px, cy: py, r: r || 11, fill: COL[i].f, stroke: COL[i].s, "stroke-width": 1.3 }, g);
          SK.label(g, px, py, NAME[i], { size: (r || 11) - 1 });
        }
        function pile(px, py, pair, w) {
          w = w || 1;
          s("rect", { x: px - 26 * w, y: py - 15 * w, width: 52 * w, height: 30 * w, rx: 8, fill: "rgba(241,226,184,.35)", stroke: C.cocoa, "stroke-width": 1.1 }, g);
          person(px - 12 * w, py, pair[0], 11 * w);
          person(px + 12 * w, py, pair[1], 11 * w);
        }

        function draw() {
          var f = ctx.frame;
          g.innerHTML = "";
          /* 上方：15 種分堆的縮圖 */
          PARTS.forEach(function (p, idx) {
            var col = idx % 5, row = Math.floor(idx / 5);
            var cx = 100 + col * 92, cy = 42 + row * 74;
            var on = f >= 2 && idx === st.pick;
            if (on) s("rect", { x: cx - 44, y: cy - 30, width: 88, height: 60, rx: 10, fill: "none", stroke: C.pink.s, "stroke-width": 2.4 }, g);
            [0, 1, 2].forEach(function (k) {
              var pr = p[k], yy = cy - 18 + k * 18;
              s("rect", { x: cx - 32, y: yy - 8, width: 64, height: 16, rx: 5, fill: on ? "rgba(233,193,191,.3)" : "rgba(241,226,184,.3)", stroke: C.line, "stroke-width": .8 }, g);
              SK.label(g, cx - 14, yy, NAME[pr[0]], { size: 11, color: COL[pr[0]].s });
              SK.label(g, cx + 14, yy, NAME[pr[1]], { size: 11, color: COL[pr[1]].s });
            });
            SK.label(g, cx, cy + 40, String(idx + 1), { size: 10, color: C.soft });
          });
          SK.label(g, 270, 258, f >= 3 ? "這 15 種就是全部的答案" : "全部 15 種分堆方式", { size: 13, color: C.cocoa });

          /* 下方：被圈起來那一種攤開成 6 種「誰是甲乙丙」 */
          if (f >= 2 && f <= 3) {
            var p = PARTS[st.pick];
            SK.label(g, 270, 288, "同一種分堆，在「甲乙丙」的算法裡被數了 3! = 6 次：", { size: 12, color: C.pink.s });
            perms3().forEach(function (pm, j) {
              var bx = 70 + (j % 3) * 170, by = 330 + Math.floor(j / 3) * 56;
              ["甲", "乙", "丙"].forEach(function (lab, k) {
                var pr = p[pm[k]];
                SK.label(g, bx - 52 + k * 46, by - 18, lab, { size: 10, color: C.soft });
                s("rect", { x: bx - 70 + k * 46, y: by - 10, width: 40, height: 18, rx: 5, fill: "rgba(210,198,218,.3)", stroke: C.line, "stroke-width": .8 }, g);
                SK.label(g, bx - 59 + k * 46, by, NAME[pr[0]], { size: 10, color: COL[pr[0]].s });
                SK.label(g, bx - 41 + k * 46, by, NAME[pr[1]], { size: 10, color: COL[pr[1]].s });
              });
            });
          }
          if (f >= 4) {
            SK.label(g, 270, 300, "大小相同的 k 堆 → 除以 k!", { size: 15, color: C.cocoa, bold: true });
            SK.label(g, 270, 330, f >= 5 ? "3 人 / 2 人 / 1 人：大小都不同 → 不用除" : "2 人 / 2 人 / 2 人：三堆同大小 → 除以 3!", { size: 13, color: C.pink.s });
            if (f >= 5) {
              SK.label(g, 270, 366, "C⁶₃ × C³₂ × C¹₁ = 20 × 3 × 1 = 60", { size: 14, color: C.blue.s });
            } else {
              SK.label(g, 270, 366, "C⁶₂ × C⁴₂ × C²₂ ÷ 3! = 90 ÷ 6 = 15", { size: 14, color: C.blue.s });
            }
          }

          read.innerHTML = f >= 5
            ? SK.tex("C^6_3\\,C^3_2\\,C^1_1=60", true)
            : f >= 3
              ? SK.tex("\\frac{C^6_2\\,C^4_2\\,C^2_2}{\\co{3!}}=\\frac{90}{6}=15", true)
              : SK.tex("C^6_2\\,C^4_2\\,C^2_2=90", true);
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "一句話判斷要不要除", icon: "bulb",
        html: "問自己：<b>把兩堆整個交換，結果有沒有變成「不同的分法」？</b><br>・進甲教室和進乙教室交換 ⇒ 不同的分法（有名字）⇒ <b>不用除</b>。<br>・只是分成兩堆一起討論，交換 ⇒ 完全一樣 ⇒ <b>要除</b>。<br>再加一條：只有<b>大小相同</b>的堆才會混淆。6 人分成 4 人、1 人、1 人三堆，只有後面兩個一人堆需要除 $2!$，答案是 $\\frac{C^6_4C^2_1C^1_1}{2!}=\\frac{15\\times2\\times1}{2}=15$。" },
      { title: "先分堆，再分配", icon: "sparkle",
        html: "很多題目是兩件事合起來：<b>先分堆，再把堆送到不同地方</b>。<br>6 人分成三個兩人堆送進甲乙丙教室 $=15\\times3!=90$，繞一圈又回到原來的算式——這不是巧合，而是同一件事從兩個方向數。<br>能用兩種方法數出同一個答案，是檢查自己有沒有算錯最好用的辦法。" }
    ],

    challenges: [
      { q: "8 個人分成 4 堆，每堆 2 人（堆沒有名字），有幾種分法？",
        hint: "先當成有名字：$C^8_2C^6_2C^4_2C^2_2$，再除以 $4!$。",
        idea: "$\\frac{28\\times15\\times6\\times1}{24}=\\frac{2520}{24}=105$。另一種數法：A 一定和某人一組（7 種），剩下 6 人再分成 3 堆（15 種），$7\\times15=105$，答案一致。" },
      { q: "10 個人分成 3 堆，人數分別是 4、3、3，有幾種分法？如果這三堆要分別派去三個不同的任務呢？", lv: "Explore",
        hint: "只有兩個 3 人堆大小相同，所以只除 $2!$。",
        idea: "分堆：$\\frac{C^{10}_4C^6_3C^3_3}{2!}=\\frac{210\\times20\\times1}{2}=2100$。派任務：三堆此時變得可分辨，再乘 $3!$，得 $2100\\times6=12600$（也等於直接算 $C^{10}_4C^6_3C^3_3\\times3=$ 同一個數）。" },
      { q: "「分堆要除以 $k!$」和「同物排列要除以重複字母的階乘」，看起來是兩條不同的規則。你能說出它們其實是同一件事嗎？", lv: "Wonder",
        idea: "兩者都是<b>先多算、再把重複除掉</b>：先假裝每個東西都分得出來（堆有名字、字母有編號），算出一個大數，再問「同一個結果被重複算了幾次」，把那個倍數除掉。<br>這個手法有個名字叫「除以對稱性」，在高中是分堆與同物排列，到了大學會變成群論裡的軌道計數。你現在用的，是同一個想法的小學版本。" }
    ],

    where: {
      codes: [["D-10-3", "有系統的計數：加法原理、乘法原理、排列與組合，及其在分組分堆問題的應用"]],
      exam: "10 年級<b>共同必修</b>，學測數 A、數 B 都可能出現，也常被包在機率題的分母裡。最容易錯的就是「要不要除以 $k!$」，判斷方法看上面那句話。",
      stop: "會判斷有沒有名字、會處理大小相同與不同的混合情況就夠了。重複組合 $H^n_k$、不盡相異物的複雜分配、排容原理的多層應用屬於競賽或大學內容，不在這裡。"
    }
  });
})();
