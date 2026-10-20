/* 單元：邏輯與條件 */
(function () {
  var C = SK.C, s = SK.s;

  var CONDS = [
    ["x 是 4 的倍數", function (x) { return x % 4 === 0; }],
    ["x 是偶數", function (x) { return x % 2 === 0; }],
    ["x 是 3 的倍數", function (x) { return x % 3 === 0; }],
    ["x 是 6 的倍數", function (x) { return x % 6 === 0; }],
    ["x 是 12 的倍數", function (x) { return x % 12 === 0; }],
    ["x 是質數", function (x) { if (x < 2) return false; for (var k = 2; k * k <= x; k++) if (x % k === 0) return false; return true; }],
    ["x 是奇數", function (x) { return x % 2 === 1; }],
    ["x < 10", function (x) { return x < 10; }]
  ];

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 250, "小圈在大圈裡面");
    s("ellipse", { cx: 200, cy: 125, rx: 170, ry: 100, fill: C.blue.f, stroke: C.blue.s, "stroke-width": 1.6 }, svg);
    s("ellipse", { cx: 150, cy: 135, rx: 75, ry: 55, fill: C.orange.f, stroke: C.orange.s, "stroke-width": 1.6 }, svg);
    SK.label(svg, 150, 135, "下雨", { size: 18, color: C.orange.s });
    SK.label(svg, 290, 110, "地面濕", { size: 18, color: C.blue.s });
    SK.label(svg, 200, 240, "「下雨 ⇒ 地面濕」反過來也對嗎？", { size: 13, color: C.soft });
  }

  SK.mountUnit({
    slug: "logic",
    en: "If–then is a statement about which set sits inside which",
    formula: "\\text{「若 }\\co p\\text{ 則 }\\cb q\\text{」為真}\\iff \\co P\\subseteq \\cb Q",

    hook: {
      html: "「下雨，地面就會濕。」這句話大致是對的。那麼「地面濕，就一定下過雨」呢？（也可能是灑水車經過。）",
      ask: "為什麼一句話對，把它反過來就不一定對？有沒有一種「反過來說」永遠和原句一樣對？",
      visual: hookVisual
    },

    guess: {
      q: "「若 $x$ 是 4 的倍數，則 $x$ 是偶數」是真的。下列哪一句<b>也一定</b>是真的？",
      options: [
        { t: "若 $x$ 不是偶數，則 $x$ 不是 4 的倍數", truth: true, explain: "這是原句的<b>逆否命題</b>。4 的倍數這一圈整個在偶數那一圈裡面；所以在偶數圈<b>外面</b>的數，一定也在 4 的倍數圈外面。逆否命題和原命題永遠同真同假。" },
        { t: "若 $x$ 是偶數，則 $x$ 是 4 的倍數", common: true, explain: "把條件和結論對調，叫做<b>逆命題</b>，是最常見的推理陷阱！$x=6$ 是偶數，卻不是 4 的倍數。大圈裡的東西不一定在小圈裡。" },
        { t: "若 $x$ 不是 4 的倍數，則 $x$ 不是偶數", explain: "這叫<b>否命題</b>，它和逆命題同真同假。反例一樣是 $x=6$：不是 4 的倍數，但是偶數。" },
        { t: "以上都不一定", explain: "其實有一句一定成立。想一想：在「偶數」這一圈外面的數，可能落在「4 的倍數」那一圈裡嗎？" }
      ]
    },

    derive: {
      intro: "在 1 到 30 裡挑兩個條件 $p$、$q$。<b>蜜桃色外框</b>是滿足 $p$ 的數（集合 $P$），<b>灰藍色底</b>是滿足 $q$ 的數（集合 $Q$）。",
      tall: true,
      frames: [
        { cap: "<b>命題</b>是可以判斷真假的敘述。「若 $p$ 則 $q$」是說：只要 $p$ 成立，$q$ 就一定成立。把滿足條件的數圈起來，就得到集合 $P$、$Q$。", tex: "P=\\{x\\mid p\\},\\quad Q=\\{x\\mid q\\}" },
        { cap: "「若 $p$ 則 $q$」為真，就是 $P$ 的每一個數都在 $Q$ 裡：$P\\subseteq Q$。只要找到一個在 $P$ 裡、卻不在 $Q$ 裡的數，就是<b>反例</b>，命題為假。", tex: "p\\Rightarrow q\\iff \\co P\\subseteq\\cb Q" },
        { cap: "$p\\Rightarrow q$ 時，說 $p$ 是 $q$ 的<b>充分條件</b>（有 $p$ 就夠了），$q$ 是 $p$ 的<b>必要條件</b>（沒有 $q$ 就不可能有 $p$）。小圈是充分，大圈是必要；兩圈一樣大就是<b>充要條件</b>。", tex: "\\co P\\subseteq\\cb Q:\\ \\co p\\text{ 充分}，\\cb q\\text{ 必要}" },
        { cap: "<b>逆否命題</b>「若非 $q$ 則非 $p$」：在 $Q$ 外面的，一定在 $P$ 外面。它和原命題永遠同真同假。<b>逆命題</b>「若 $q$ 則 $p$」就不一定了。", tex: "(p\\Rightarrow q)\\iff(\\sim q\\Rightarrow\\ \\sim p)" },
        { cap: "否定「$p$ 且 $q$」：只要有一個不成立就好，所以是「非 $p$ <b>或</b> 非 $q$」。同理，否定「或」會變成「且」。圖上塗色的是「非（$p$ 且 $q$）」。", tex: "\\sim(p\\wedge q)\\iff(\\sim p)\\vee(\\sim q)" }
      ],
      hint: "換換看不同的 p、q，找出反例，判斷誰是誰的充分或必要條件。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 540, 440, "1 到 30 的數字格與兩個集合");
        var g = s("g", {}, svg);
        var st = { p: 0, q: 1 };
        function sel(label, key) {
          var wrap = SK.h("div", { class: "slider" });
          wrap.appendChild(SK.h("label", {}, SK.md(label)));
          var se = SK.h("select", { style: "font:inherit;padding:4px 8px;border-radius:8px;border:1px solid #9C8C7C;background:#FDFBF6" });
          CONDS.forEach(function (c, i) { var o = SK.h("option", { value: i }, c[0]); if (i === st[key]) o.selected = true; se.appendChild(o); });
          se.addEventListener("change", function () { st[key] = +se.value; draw(); });
          wrap.appendChild(se);
          wrap.appendChild(SK.h("span"));
          ctx.sliders.appendChild(wrap);
        }
        sel("$p$", "p"); sel("$q$", "q");
        var read = SK.h("div", { class: "readout" });
        ctx.extra.appendChild(read);
        function venn(y0, rel) {
          // rel: sub（P⊆Q）、sup（Q⊆P）、eq、meet、apart
          var cx = 270, cy = y0;
          var shapes = {
            sub: [[245, cy + 8, 60, 38], [270, cy, 150, 70]], sup: [[270, cy, 150, 70], [245, cy + 8, 60, 38]],
            eq: [[270, cy, 130, 62], [270, cy, 130, 62]], meet: [[215, cy, 110, 60], [325, cy, 110, 60]], apart: [[150, cy, 90, 55], [390, cy, 90, 55]]
          }[rel];
          var qP = shapes[1], pP = shapes[0];
          s("ellipse", { cx: qP[0], cy: qP[1], rx: qP[2], ry: qP[3], fill: C.blue.f, stroke: C.blue.s, "stroke-width": 1.6 }, g);
          s("ellipse", { cx: pP[0], cy: pP[1], rx: pP[2], ry: pP[3], fill: "rgba(243,195,168,.35)", stroke: C.orange.s, "stroke-width": 2.2 }, g);
          SK.label(g, pP[0] - (rel === "eq" ? 40 : 0), pP[1], "P", { it: true, color: C.orange.s });
          SK.label(g, qP[0] + qP[2] - 24, qP[1] - qP[3] + 18, "Q", { it: true, color: C.blue.s });
        }
        function draw() {
          var f = ctx.frame, p = CONDS[st.p][1], q = CONDS[st.q][1];
          g.innerHTML = "";
          var P = [], Q = [], ce = null, ceRev = null;
          for (var x = 1; x <= 30; x++) {
            if (p(x)) P.push(x);
            if (q(x)) Q.push(x);
            if (p(x) && !q(x) && ce == null) ce = x;
            if (q(x) && !p(x) && ceRev == null) ceRev = x;
          }
          for (var i = 0; i < 30; i++) {
            var n = i + 1, cx = 60 + (i % 10) * 46, cy = 40 + Math.floor(i / 10) * 52, inP = p(n), inQ = q(n);
            var fill = inQ ? C.blue.f : C.paper;
            if (f === 3) fill = !inQ ? "rgba(233,193,191,.55)" : C.paper;
            if (f === 4) fill = !(inP && inQ) ? C.gold.f : C.paper;
            s("rect", { x: cx - 19, y: cy - 19, width: 38, height: 38, rx: 7, fill: fill, stroke: inP ? C.orange.s : C.line, "stroke-width": inP ? 3 : 1 }, g);
            SK.label(g, cx, cy, String(n), { size: 15, bold: inP });
            var bad = f === 3 ? (!inQ && inP) : (f >= 1 && f <= 2 && n === ce);
            if (bad) s("circle", { cx: cx, cy: cy, r: 24, fill: "none", stroke: C.pink.s, "stroke-width": 2.4, "stroke-dasharray": "4 3" }, g);
          }
          var sub = !ce, sup = !ceRev;
          var rel = sub && sup ? "eq" : sub ? "sub" : sup ? "sup" : P.some(function (v) { return Q.indexOf(v) >= 0; }) ? "meet" : "apart";
          if (f === 3) SK.label(g, 270, 196, "粉紅底：不在 Q 裡（非 q）。它們有沒有蜜桃色外框？", { size: 13, color: C.pink.s });
          else if (f === 4) SK.label(g, 270, 196, "奶油黃：p、q 至少有一個不成立", { size: 13, color: C.gold.s });
          else SK.label(g, 270, 196, "外框 = P（" + P.length + " 個）　藍底 = Q（" + Q.length + " 個）", { size: 13, color: C.soft });
          venn(320, rel);
          var kind = sub && sup ? "充要條件" : sub ? "充分（但不必要）條件" : sup ? "必要（但不充分）條件" : "既不充分也不必要的條件";
          read.innerHTML = '<p style="margin:4px 0">「若 p 則 q」：' + (sub ? "<b>真</b>" : "<b>假</b>，反例 x = " + ce) + "</p>" +
            (f >= 3 ? '<p style="margin:4px 0">逆否「若非 q 則非 p」：' + (sub ? "<b>真</b>" : "<b>假</b>") + "　逆命題「若 q 則 p」：" + (sup ? "<b>真</b>" : "<b>假</b>，反例 x = " + ceRev) + "</p>" : "") +
            (f >= 2 ? '<p style="margin:4px 0">p 是 q 的<b>' + kind + "</b></p>" : "");
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "「所有」的否定是「有些不」", icon: "sparkle",
        html: "「班上所有人都及格」的否定，不是「所有人都不及格」，而是「<b>至少有一個人</b>不及格」。只要一個反例，就能推翻一個「所有」的敘述；但要證明「所有」成立，就得說明每一個都對。這也是為什麼數學證明要寫一般的情形。" },
      { title: "充分、必要，用生活想", icon: "leaf",
        html: "「是台北人」是「是台灣人」的充分條件：只要是台北人就夠了。「是台灣人」是「是台北人」的必要條件：不是台灣人，就不可能是台北人。記法：<b>小的推得出大的</b>，小的是充分，大的是必要。" }
    ],

    challenges: [
      { q: "「$x^2=4$」是「$x=2$」的什麼條件？", idea: "$x=2\\Rightarrow x^2=4$，但 $x^2=4$ 時 $x$ 也可能是 $-2$。所以 $\\{2\\}\\subseteq\\{2,-2\\}$，「$x^2=4$」是必要但不充分條件。" },
      { q: "寫出「若 $ab=0$，則 $a=0$ 或 $b=0$」的逆否命題。", hint: "「$a=0$ 或 $b=0$」的否定是什麼？",
        idea: "否定「或」變成「且」：「若 $a\\ne0$ 且 $b\\ne0$，則 $ab\\ne0$」。這就是「兩個非零數相乘不會是 0」。" },
      { q: "用逆否命題證明：若 $n^2$ 是偶數，則 $n$ 是偶數。", idea: "改證「若 $n$ 是奇數，則 $n^2$ 是奇數」：$n=2k+1$，$n^2=4k^2+4k+1=2(2k^2+2k)+1$ 是奇數。這正是「實數與數線」單元證明 $\\sqrt2$ 是無理數時用到的一步。" }
    ],

    where: {
      codes: [["N-10-7", "邏輯：命題及其否定、「或」「且」「推論」、充分條件、必要條件、充要條件"]],
      exam: "10 年級<b>共同必修</b>。大考標為 ★＃：不直接命題，但所有推理題都用得到。",
      stop: "會判斷命題真假、找反例、分辨充分／必要、寫出否定與逆否命題就夠了。真值表的系統演算、形式邏輯與量詞的符號化不是高中重點。"
    }
  });
})();
