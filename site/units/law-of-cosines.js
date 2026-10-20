/* 單元 6：餘弦定理 */
(function () {
  var C = SK.C, s = SK.s;

  function hookVisual(el) {
    var svg = SK.svg(el, 440, 260, "兩根長 3 和 4 的木條，夾角 60 度、90 度、120 度");
    var u = 26, list = [[60, 20], [90, 160], [120, 310]];
    list.forEach(function (it) {
      var ang = SK.rad(it[0]), cx = it[1], cy = 200;
      var bx = cx + 4 * u, ax = cx + 3 * u * Math.cos(ang), ay = cy - 3 * u * Math.sin(ang);
      s("line", { x1: cx, y1: cy, x2: bx, y2: cy, stroke: C.orange.s, "stroke-width": 5, "stroke-linecap": "round" }, svg);
      s("line", { x1: cx, y1: cy, x2: ax, y2: ay, stroke: C.blue.s, "stroke-width": 5, "stroke-linecap": "round" }, svg);
      s("line", { x1: ax, y1: ay, x2: bx, y2: cy, stroke: C.green.s, "stroke-width": 2.5, "stroke-dasharray": "6 5" }, svg);
      s("circle", { cx: cx, cy: cy, r: 5, fill: C.ink }, svg);
      SK.label(svg, (ax + bx) / 2 + 12, (ay + cy) / 2 - 10, "c = ?", { size: 14, color: C.green.s, anchor: "start" });
      SK.label(svg, cx + 10, cy + 22, it[0] + "°", { size: 14 });
    });
    SK.label(svg, 220, 240, "a = 4（橘）、b = 3（灰藍），只有 90° 時 c = 5", { size: 13, color: C.soft });
  }

  function barsAngle(el) {
    var wrap = SK.h("div", { class: "two-col" });
    var st = SK.h("div", { class: "stage" }), side = SK.h("div", { class: "sliders" });
    wrap.appendChild(st); wrap.appendChild(side); el.appendChild(wrap);
    var svg = SK.svg(st, 440, 230, "比較 c 平方與 a 平方加 b 平方");
    var g = s("g", {}, svg);
    var stt = { C: 120 }, a = 4, b = 3;
    function draw() {
      g.innerHTML = "";
      var u = 5.2, x0 = 70, cosC = Math.cos(SK.rad(stt.C)), c2 = a * a + b * b - 2 * a * b * cosC;
      s("rect", { x: x0, y: 40, width: a * a * u, height: 40, fill: C.orange.f, stroke: C.orange.s, "stroke-width": 1.6 }, g);
      s("rect", { x: x0 + a * a * u, y: 40, width: b * b * u, height: 40, fill: C.blue.f, stroke: C.blue.s, "stroke-width": 1.6 }, g);
      SK.label(g, x0 + a * a * u / 2, 60, "a² = 16", { size: 13 });
      SK.label(g, x0 + (a * a + b * b / 2) * u, 60, "b² = 9", { size: 13 });
      SK.label(g, 36, 60, "a²+b²", { size: 12, color: C.soft });
      s("rect", { x: x0, y: 120, width: c2 * u, height: 40, fill: C.green.f, stroke: C.green.s, "stroke-width": 1.6 }, g);
      SK.label(g, 36, 140, "c²", { size: 12, color: C.soft });
      SK.label(g, x0 + c2 * u / 2, 140, "c² = " + SK.fmt(c2, 2), { size: 13 });
      var x25 = x0 + 25 * u;
      s("line", { x1: x25, y1: 26, x2: x25, y2: 176, stroke: C.ink, "stroke-dasharray": "4 4" }, g);
      var diff = -2 * a * b * cosC;
      var xa = Math.min(x25, x0 + c2 * u), xb = Math.max(x25, x0 + c2 * u);
      if (Math.abs(diff) > .05) {
        s("rect", { x: xa, y: 166, width: xb - xa, height: 12, fill: diff > 0 ? C.pink.f : C.gold.f, stroke: diff > 0 ? C.pink.s : C.gold.s }, g);
        SK.label(g, (xa + xb) / 2, 200, "−2ab cos C = " + SK.fmt(diff, 2), { size: 13, color: diff > 0 ? C.pink.s : C.gold.s });
      } else SK.label(g, x25, 200, "剛好相等：畢氏定理！", { size: 13, color: C.green.s });
    }
    side.appendChild(SK.slider({ label: "$\\angle C$", min: 20, max: 170, value: stt.C, fmt: function (v) { return v + "°"; }, onInput: function (v) { stt.C = v; draw(); } }).el);
    side.insertAdjacentHTML("beforeend", '<p class="muted" style="margin:0;font-size:.95rem">' + SK.md("固定 $a=4$、$b=3$，只改變夾角。虛線是 $a^2+b^2=25$。修正項 $-2ab\\cos C$ 就是 $c^2$ 和 25 的差：銳角時扣掉、直角時是 0、鈍角時加上。") + "</p>");
    draw();
  }

  SK.mountUnit({
    slug: "law-of-cosines",
    en: "Pythagoras, plus a correction term",
    formula: "\\cg{c}^2=\\co{a}^2+\\cb{b}^2\\cp{\\,-\\,2ab\\cos C}",

    hook: {
      html: "兩根木條長 $4$ 和 $3$，用鉸鏈接在一起。張開 $90^\\circ$ 時，兩端距離是 $5$（畢氏定理）。",
      ask: "如果只張開 $60^\\circ$，或者張到 $120^\\circ$ 呢？畢氏定理還能用嗎？要怎麼「修正」它？",
      visual: hookVisual
    },

    guess: {
      q: "三角形中，如果角 $C$ 大於 $90^\\circ$，對邊 $c$ 的平方和 $a^2+b^2$ 比起來會怎樣？",
      options: [
        { t: "$c^2>a^2+b^2$", truth: true, explain: "角張得越開，對面的邊就被撐得越長。$90^\\circ$ 時剛好相等，超過 $90^\\circ$ 就比畢氏定理還長。等一下你會看到多出來的量正好是 $-2ab\\cos C$（這時 $\\cos C<0$，所以是加上一個正數）。" },
        { t: "$c^2<a^2+b^2$", common: true, explain: "這是<b>銳角</b>時的情況！角小於 $90^\\circ$ 時，兩邊夾得比較緊，$c$ 比較短。很多人會把兩種情況記反，所以我們用圖來記：角越開、邊越長。" },
        { t: "$c^2=a^2+b^2$", explain: "這是畢氏定理，只在 $C=90^\\circ$ 時成立。「畢氏定理適用所有三角形」是很常見的誤會，今天就是要把它推廣到任何角度。" },
        { t: "無法判斷", explain: "謹慎很好！不過只要知道角 $C$ 是鈍角，就一定能判斷，因為答案不受 $a$、$b$ 是多少影響。" }
      ]
    },

    derive: {
      intro: "把一般三角形切出一個直角三角形，就能借用畢氏定理。拖動頂點 $A$（改變 $b$ 和角 $C$）或頂點 $B$（改變 $a$）。",
      tall: true,
      frames: [
        { cap: "一個三角形，已知兩邊 $\\co{a}$、$\\cb{b}$ 和它們的夾角 $C$，想求第三邊 $\\cg{c}$。", tex: "\\cg{c}=\\;?" },
        { cap: "從 $A$ 往直線 $CB$ 畫垂線，垂足是 $H$。$\\overline{CH}$ 是 $b$ 在 $CB$ 方向上的<b>影子</b>，長度 $b\\cos C$；高度 $\\overline{AH}=b\\sin C$。（就是單位圓放大 $b$ 倍！）", tex: "\\overline{CH}=\\cy{b\\cos C},\\quad \\overline{AH}=\\cv{b\\sin C}" },
        { cap: "看右邊的直角三角形 $AHB$：底 $\\overline{HB}=a-b\\cos C$，高 $b\\sin C$，斜邊就是 $c$。用畢氏定理！", tex: "\\cg{c}^2=(a-\\cy{b\\cos C})^2+(\\cv{b\\sin C})^2" },
        { cap: "把兩個平方展開。", tex: "\\begin{aligned}\\cg{c}^2&=a^2-2ab\\cos C\\\\&\\quad+b^2\\cos^2C+b^2\\sin^2C\\end{aligned}" },
        { cap: "$\\cos^2C+\\sin^2C=1$，後面兩項合起來剛好是 $b^2$。完成！", tex: "\\cg{c}^2=\\co{a}^2+\\cb{b}^2\\cp{\\,-\\,2ab\\cos C}" },
        { cap: "把 $A$ 拖到左邊讓 $C$ 變成鈍角：垂足 $H$ 跑到 $C$ 的外面，$\\cos C<0$，修正項變成<b>加上</b>，$c$ 比畢氏定理還長。同一條公式照顧了所有情況。", tex: "C>90^\\circ\\Rightarrow \\cp{-2ab\\cos C}>0" }
      ],
      hint: "拖動頂點 $A$ 或 $B$；在任何一步都可以改變三角形的形狀。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 520, 420, "餘弦定理的推導圖");
        var g = s("g", {}, svg), hg = s("g", {}, svg);
        var Cx = 200, Cy = 340, u = 46;
        var st = { a: 6, bx: 1.9, by: 4.4 };
        var read = SK.h("div", { class: "readout" });
        ctx.extra.appendChild(read);
        var hA = SK.handle(hg, 0, 0, C.blue.s, "頂點 A");
        var hB = SK.handle(hg, 0, 0, C.orange.s, "頂點 B");
        SK.drag(svg, hA, function (x, y) {
          st.bx = SK.clamp((x - Cx) / u, -4.1, 6.4); st.by = SK.clamp((Cy - y) / u, .5, 6.8); draw();
        }, function () { return [Cx + st.bx * u, Cy - st.by * u]; });
        SK.drag(svg, hB, function (x) { st.a = SK.clamp((x - Cx) / u, 1.5, 6.6); draw(); },
          function () { return [Cx + st.a * u, Cy]; });
        function draw() {
          var f = ctx.frame, a = st.a, b = Math.hypot(st.bx, st.by), Cang = Math.atan2(st.by, st.bx);
          var Ax = Cx + st.bx * u, Ay = Cy - st.by * u, Bx = Cx + a * u, Hx = Ax;
          g.innerHTML = "";
          // 延長線
          s("line", { x1: Math.min(Cx, Hx) - 20, y1: Cy, x2: Math.max(Bx, Hx) + 20, y2: Cy, stroke: C.line, "stroke-dasharray": "3 5", "stroke-width": 1.3 }, g);
          if (f >= 2) s("path", { d: "M" + Ax + " " + Ay + " L" + Hx + " " + Cy + " L" + Bx + " " + Cy + "Z", fill: C.green.f, stroke: "none", opacity: .6 }, g);
          s("path", { d: "M" + Cx + " " + Cy + " L" + Bx + " " + Cy + " L" + Ax + " " + Ay + "Z", fill: "rgba(241,226,184,.3)", stroke: "none" }, g);
          // 邊
          s("line", { x1: Cx, y1: Cy, x2: Bx, y2: Cy, stroke: C.orange.s, "stroke-width": 4, "stroke-linecap": "round" }, g);
          s("line", { x1: Cx, y1: Cy, x2: Ax, y2: Ay, stroke: C.blue.s, "stroke-width": 4, "stroke-linecap": "round" }, g);
          s("line", { x1: Ax, y1: Ay, x2: Bx, y2: Cy, stroke: C.green.s, "stroke-width": 4, "stroke-linecap": "round" }, g);
          SK.label(g, (Cx + Bx) / 2, Cy + 22, "a", { it: true, color: C.orange.s });
          SK.label(g, (Cx + Ax) / 2 - 16, (Cy + Ay) / 2 - 6, "b", { it: true, color: C.blue.s });
          SK.label(g, (Ax + Bx) / 2 + 16, (Ay + Cy) / 2 - 6, "c", { it: true, color: C.green.s });
          s("path", { d: SK.arcPath(Cx, Cy, 30, 0, Cang), fill: "none", stroke: C.pink.s, "stroke-width": 2 }, g);
          SK.label(g, Cx + 46 * Math.cos(Cang / 2), Cy - 46 * Math.sin(Cang / 2), "C", { size: 14, color: C.pink.s });
          SK.label(g, Cx - 12, Cy + 16, "C", { size: 13, color: C.soft });
          SK.label(g, Bx + 12, Cy + 16, "B", { size: 13, color: C.soft });
          SK.label(g, Ax, Ay - 20, "A", { size: 13, color: C.soft });
          if (f >= 1) {
            s("line", { x1: Ax, y1: Ay, x2: Hx, y2: Cy, stroke: C.purple.s, "stroke-width": 3, "stroke-dasharray": "7 5" }, g);
            s("line", { x1: Cx, y1: Cy + 40, x2: Hx, y2: Cy + 40, stroke: C.gold.s, "stroke-width": 5, "stroke-linecap": "round" }, g);
            s("line", { x1: Hx, y1: Cy, x2: Hx, y2: Cy + 44, stroke: C.gold.s, "stroke-dasharray": "2 4" }, g);
            s("line", { x1: Cx, y1: Cy, x2: Cx, y2: Cy + 44, stroke: C.gold.s, "stroke-dasharray": "2 4" }, g);
            SK.label(g, (Cx + Hx) / 2, Cy + 60, "b cos C" + (Hx < Cx ? "（負的）" : ""), { size: 13, color: C.gold.s });
            SK.label(g, Hx + (Hx < Cx ? -10 : 10), (Cy + Ay) / 2 + 30, "b sin C", { size: 13, anchor: Hx < Cx ? "end" : "start", color: C.purple.s });
            SK.label(g, Hx, Cy - 12 + 30, "H", { size: 12, color: C.soft });
            if (Math.abs(Hx - Bx) > 14) SK.rightMark(g, Hx, Cy, Bx > Hx ? 1 : -1, 0, 0, -1, 11);
          }
          hA.moveTo(Ax, Ay); hB.moveTo(Bx, Cy);
          var cosC = Math.cos(Cang), c2 = a * a + b * b - 2 * a * b * cosC, cReal = Math.hypot(st.bx - a, st.by);
          read.innerHTML = SK.tex("a=" + SK.fmt(a, 2) + ",\\ b=" + SK.fmt(b, 2) + ",\\ C=" + SK.fmt(SK.deg(Cang), 1) + "^\\circ", true) +
            SK.tex("\\text{量到的 }c^2=" + SK.fmt(cReal * cReal, 2) + "\\qquad \\text{公式算的 }" + SK.fmt(c2, 2), true);
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "修正項在做什麼", icon: "sparkle", render: barsAngle },
      { title: "一行證明：用向量內積", icon: "bulb",
        html: "11 年級學到向量後，令 $\\vec{c}=\\vec{a}-\\vec{b}$，自己跟自己做內積：$$|\\vec a-\\vec b|^2=|\\vec a|^2+|\\vec b|^2-2\\,\\vec a\\cdot\\vec b=a^2+b^2-2ab\\cos C.$$ 同一個定理，一次用直角三角形、一次用向量。「內積與正射影」單元會告訴你為什麼 $\\vec a\\cdot\\vec b=ab\\cos C$，它說的其實也是「影子」。" }
    ],

    challenges: [
      { q: "令 $C=90^\\circ$，餘弦定理變成什麼？用這個說說看：為什麼餘弦定理是畢氏定理的「推廣」？", idea: "$\\cos90^\\circ=0$，修正項消失，剩下 $c^2=a^2+b^2$。畢氏定理是餘弦定理的一個特例。" },
      { q: "三邊長 $3,5,7$ 的三角形，最大的角是幾度？邊長 $6,7,10$ 的三角形是銳角、直角還是鈍角三角形？", hint: "最大的角對最長的邊。把公式改寫成 $\\cos C=\\dfrac{a^2+b^2-c^2}{2ab}$。",
        idea: "$\\cos C=\\dfrac{9+25-49}{30}=-\\dfrac12$，所以最大角是 $120^\\circ$。$6^2+7^2=85<100=10^2$，所以是鈍角三角形。只看 $a^2+b^2$ 和 $c^2$ 誰大就能判斷。" },
      { q: "平行四邊形的兩條對角線，它們的平方和與四個邊有什麼關係？", hint: "兩條對角線分別對著夾角 $C$ 和 $180^\\circ-C$，而 $\\cos(180^\\circ-C)=-\\cos C$。",
        idea: "$d_1^2+d_2^2=2(a^2+b^2)$：兩個修正項一正一負剛好抵消。這叫平行四邊形定律，在向量裡也會看到。" }
    ],

    where: {
      codes: [["G-10-7", "三角比性質：正弦定理、餘弦定理、正射影、斜率與斜角、反三角比鍵（三角測量為 ＃）"]],
      exam: "高一共同必修，學測數 A、數 B 都在範圍內。它是解三角形、三角測量的核心工具，也和 11 年級的向量內積是同一個想法。",
      stop: "會用餘弦定理求邊、求角、判斷三角形形狀就好。海龍公式可以當作補充由面積關係推出，但不需要變成另一條死背的公式；繁複的三角恆等式化簡也不是重點。"
    }
  });
})();
