/* 單元：線性變換與轉移矩陣 */
(function () {
  var C = SK.C, s = SK.s;
  /* 一個不對稱的「F」形，方便看出旋轉、翻面 */
  var SHAPE = [[0, 0], [.3, 0], [.3, .6], [.8, .6], [.8, .9], [.3, .9], [.3, 1.2], [1, 1.2], [1, 1.5], [0, 1.5]];

  function hookVisual(el) {
    var svg = SK.svg(el, 420, 240, "同一個圖形經過旋轉、翻面、拉伸、推斜");
    var mats = [[[1, 0], [0, 1], "原圖"], [[0, 1], [-1, 0], "旋轉"], [[-1, 0], [0, 1], "翻面"], [[1.6, 0], [0, .8], "拉伸"], [[1, 0], [.7, 1], "推斜"]];
    mats.forEach(function (m, i) {
      var ox = 36 + i * 78, oy = 150, u = 34;
      var pts = SHAPE.map(function (p) { var x = m[0][0] * p[0] + m[1][0] * p[1], y = m[0][1] * p[0] + m[1][1] * p[1]; return [ox + x * u, oy - y * u]; });
      s("path", { d: "M" + pts.join(" L") + "Z", fill: [C.gold, C.orange, C.blue, C.green, C.purple][i].f, stroke: C.cocoa, "stroke-width": 1.2 }, svg);
      SK.label(svg, ox + 10, 200, m[2], { size: 13, color: C.soft });
    });
    SK.label(svg, 210, 228, "每一種都能用一個 2×2 的表格描述", { size: 13, color: C.soft });
  }

  function markovAngle(el) {
    var wrap = SK.h("div", { class: "two-col" });
    var st = SK.h("div", { class: "stage" }), side = SK.h("div", {});
    wrap.appendChild(st); wrap.appendChild(side); el.appendChild(wrap);
    var svg = SK.svg(st, 420, 260, "兩個品牌的市占率每月依轉移矩陣變化");
    var g = s("g", {}, svg);
    var hist = [[.9, .1]];
    function step() { var v = hist[hist.length - 1]; hist.push([.8 * v[0] + .3 * v[1], .2 * v[0] + .7 * v[1]]); }
    function draw() {
      g.innerHTML = "";
      s("line", { x1: 30, y1: 220, x2: 410, y2: 220, class: "m-axis" }, g);
      hist.slice(-8).forEach(function (v, i, arr) {
        var x = 40 + i * 46, month = hist.length - arr.length + i;
        s("rect", { x: x, y: 220 - v[0] * 190, width: 18, height: v[0] * 190, fill: C.orange.f, stroke: C.orange.s }, g);
        s("rect", { x: x + 20, y: 220 - v[1] * 190, width: 18, height: v[1] * 190, fill: C.blue.f, stroke: C.blue.s }, g);
        SK.label(g, x + 19, 236, "第" + month + "月", { size: 11, color: C.soft });
      });
      var v = hist[hist.length - 1];
      out.innerHTML = SK.tex("\\begin{pmatrix}0.8&0.3\\\\0.2&0.7\\end{pmatrix}\\begin{pmatrix}" + SK.fmt(hist[hist.length - 2] ? hist[hist.length - 2][0] : v[0], 3) + "\\\\" + SK.fmt(hist[hist.length - 2] ? hist[hist.length - 2][1] : v[1], 3) + "\\end{pmatrix}=\\begin{pmatrix}\\co{" + SK.fmt(v[0], 3) + "}\\\\\\cb{" + SK.fmt(v[1], 3) + "}\\end{pmatrix}", true);
    }
    var out = SK.h("div", { class: "readout" });
    side.innerHTML = '<p style="margin-top:0">' + SK.md("甲牌（蜜桃）的顧客每月有 80% 留下、20% 換到乙牌；乙牌（灰藍）有 70% 留下、30% 換到甲牌。矩陣的每一行，就是「從這家出發的人往哪裡去」。") + "</p>";
    var b1 = SK.h("button", { class: "btn small", type: "button" }, "下個月 " + SK.icon("arrow"));
    var b2 = SK.h("button", { class: "btn small ghost", type: "button" }, "重來");
    b1.onclick = function () { step(); draw(); };
    b2.onclick = function () { hist = [[.9, .1]]; draw(); };
    var ctr = SK.h("div", { class: "controls", style: "margin-bottom:10px" }); ctr.appendChild(b1); ctr.appendChild(b2);
    side.appendChild(ctr); side.appendChild(out);
    side.insertAdjacentHTML("beforeend", '<p class="muted" style="font-size:.92rem">' + SK.md("多按幾次，你會發現比例好像停在某個數字附近。這是探索活動：「穩定狀態」不在高中必修範圍內，但它是大學線性代數（特徵向量）的入口。") + "</p>");
    draw();
  }

  SK.mountUnit({
    slug: "linear-map",
    en: "A matrix is an action",
    formula: "\\begin{pmatrix}\\co{a}&\\cb{b}\\\\\\co{c}&\\cb{d}\\end{pmatrix}\\begin{pmatrix}x\\\\y\\end{pmatrix}=x\\co{\\begin{pmatrix}a\\\\c\\end{pmatrix}}+y\\cb{\\begin{pmatrix}b\\\\d\\end{pmatrix}}",

    hook: {
      html: "修圖軟體裡的「旋轉」「翻轉」「拉伸」「傾斜」，每一種都會把整張圖的每一個點搬到新位置。",
      ask: "要描述這樣一個動作，最少需要記錄幾個數字？",
      visual: hookVisual
    },

    guess: {
      q: "矩陣 $\\begin{pmatrix}0&-1\\\\1&0\\end{pmatrix}$ 會對圖形做什麼事？",
      options: [
        { t: "逆時針旋轉 $90^\\circ$", truth: true, explain: "看兩行：$(1,0)$ 被送到 $(0,1)$，$(0,1)$ 被送到 $(-1,0)$。兩個基本向量都逆時針轉了 $90^\\circ$，整張圖也就跟著轉了 $90^\\circ$。" },
        { t: "對直線 $y=x$ 鏡射", common: true, explain: "很接近！對 $y=x$ 鏡射會把 $(1,0)$ 送到 $(0,1)$，這一點一樣；但它會把 $(0,1)$ 送到 $(1,0)$，而不是 $(-1,0)$。鏡射的矩陣是 $\\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}$，差一個負號就差很多。" },
        { t: "放大 2 倍", explain: "放大的矩陣會長得像 $\\begin{pmatrix}2&0\\\\0&2\\end{pmatrix}$，對角線上是倍率。這個矩陣的對角線是 0，所以不是單純的放大。" },
        { t: "順時針旋轉 $90^\\circ$", explain: "方向剛好相反。順時針 $90^\\circ$ 會把 $(1,0)$ 送到 $(0,-1)$，矩陣是 $\\begin{pmatrix}0&1\\\\-1&0\\end{pmatrix}$。" }
      ]
    },

    derive: {
      intro: "拖動蜜桃色與灰藍色箭頭的尖端，就是在改矩陣的兩行。也可以按下面的按鈕試試常見的變換。",
      tall: true,
      frames: [
        { cap: "原本的方格紙，和兩個基本向量 $\\vec e_1=(1,0)$、$\\vec e_2=(0,1)$。", tex: "\\vec e_1=\\begin{pmatrix}1\\\\0\\end{pmatrix},\\quad \\vec e_2=\\begin{pmatrix}0\\\\1\\end{pmatrix}" },
        { cap: "先只看 $\\vec e_1$ 被送到哪裡：$(a,c)$。它就是矩陣的<b>第一行</b>。", tex: "A\\vec e_1=\\co{\\begin{pmatrix}a\\\\c\\end{pmatrix}}" },
        { cap: "再看 $\\vec e_2$ 被送到哪裡：$(b,d)$，矩陣的<b>第二行</b>。", tex: "A\\vec e_2=\\cb{\\begin{pmatrix}b\\\\d\\end{pmatrix}}" },
        { cap: "任何一點 $(x,y)=x\\vec e_1+y\\vec e_2$，變換後就是 $x$ 份新的 $\\vec e_1$ 加 $y$ 份新的 $\\vec e_2$。整張方格紙（和 F 字）跟著一起變。", tex: "A\\begin{pmatrix}x\\\\y\\end{pmatrix}=x\\co{\\begin{pmatrix}a\\\\c\\end{pmatrix}}+y\\cb{\\begin{pmatrix}b\\\\d\\end{pmatrix}}" },
        { cap: "原本面積 1 的小正方形，變成兩行張出的平行四邊形，面積倍率就是<b>行列式</b>。行列式為負時，F 字會翻面。", tex: "\\text{面積倍率}=\\det A=ad-bc" }
      ],
      hint: "拖動兩個箭頭的尖端（對齊 0.5 格），或按按鈕套用常見變換。",
      setup: function (ctx) {
        var W = 520, H = 440, svg = SK.svg(ctx.stage, W, H, "線性變換把方格紙變形");
        var g = s("g", {}, svg), hg = s("g", {}, svg);
        var cx = 250, cy = 250, u = 52;
        var st = { a: 1.5, c: .5, b: -.5, d: 1 };
        function P(x, y) { return [cx + x * u, cy - y * u]; }
        function T(x, y) { return [st.a * x + st.b * y, st.c * x + st.d * y]; }
        var read = SK.h("div", { class: "readout" });
        var h1 = SK.handle(hg, 0, 0, C.orange.s, "e1 的像"), h2 = SK.handle(hg, 0, 0, C.blue.s, "e2 的像");
        function snap(v) { return Math.round(v * 2) / 2; }
        SK.drag(svg, h1, function (x, y) { st.a = SK.clamp(snap((x - cx) / u), -4, 4); st.c = SK.clamp(snap((cy - y) / u), -4, 4); draw(); }, function () { return P(st.a, st.c); }, u / 2);
        SK.drag(svg, h2, function (x, y) { st.b = SK.clamp(snap((x - cx) / u), -4, 4); st.d = SK.clamp(snap((cy - y) / u), -4, 4); draw(); }, function () { return P(st.b, st.d); }, u / 2);
        var presets = [["還原", [1, 0, 0, 1]], ["旋轉 90°", [0, 1, -1, 0]], ["鏡射 x 軸", [1, 0, 0, -1]], ["拉伸", [2, 0, 0, .5]], ["推斜", [1, 0, 1, 1]]];
        var row = SK.h("div", { class: "controls" });
        presets.forEach(function (p) {
          var b = SK.h("button", { class: "btn small ghost", type: "button" }, p[0]);
          b.onclick = function () { st.a = p[1][0]; st.c = p[1][1]; st.b = p[1][2]; st.d = p[1][3]; if (ctx.frame < 3) SK.players.forEach(function (pl) { if (pl.root.contains(ctx.stage)) pl.go(3); }); draw(); };
          row.appendChild(b);
        });
        ctx.sliders.appendChild(row);
        ctx.extra.appendChild(read);
        function draw() {
          var f = ctx.frame, det = st.a * st.d - st.b * st.c;
          g.innerHTML = "";
          for (var i = -6; i <= 6; i++) {
            s("line", { x1: P(i, -6)[0], y1: P(i, -6)[1], x2: P(i, 6)[0], y2: P(i, 6)[1], class: "m-grid" }, g);
            s("line", { x1: P(-6, i)[0], y1: P(-6, i)[1], x2: P(6, i)[0], y2: P(6, i)[1], class: "m-grid" }, g);
          }
          s("line", { x1: 0, y1: cy, x2: W, y2: cy, class: "m-axis" }, g);
          s("line", { x1: cx, y1: 0, x2: cx, y2: H, class: "m-axis" }, g);
          var orig = SHAPE.map(function (p) { return P(p[0], p[1]); });
          s("path", { d: "M" + orig.join(" L") + "Z", fill: f >= 3 ? "none" : C.gold.f, stroke: C.line, "stroke-width": 1.2, "stroke-dasharray": f >= 3 ? "4 4" : null }, g);
          if (f >= 3) {
            for (var k = -6; k <= 6; k++) {
              var p1 = T(k, -6), p2 = T(k, 6), q1 = T(-6, k), q2 = T(6, k);
              s("line", { x1: P(p1[0], p1[1])[0], y1: P(p1[0], p1[1])[1], x2: P(p2[0], p2[1])[0], y2: P(p2[0], p2[1])[1], stroke: C.blue.s, "stroke-width": .9, opacity: .45 }, g);
              s("line", { x1: P(q1[0], q1[1])[0], y1: P(q1[0], q1[1])[1], x2: P(q2[0], q2[1])[0], y2: P(q2[0], q2[1])[1], stroke: C.orange.s, "stroke-width": .9, opacity: .45 }, g);
            }
            if (f >= 4) {
              var sq = [T(0, 0), T(1, 0), T(1, 1), T(0, 1)].map(function (p) { return P(p[0], p[1]); });
              s("path", { d: "M" + sq.join(" L") + "Z", fill: det >= 0 ? C.mint.f : C.pink.f, stroke: C.cocoa, "stroke-width": 1.2 }, g);
            }
            var img = SHAPE.map(function (p) { var q = T(p[0], p[1]); return P(q[0], q[1]); });
            s("path", { d: "M" + img.join(" L") + "Z", fill: C.gold.f, stroke: C.cocoa, "stroke-width": 1.4 }, g);
          }
          SK.arrow(g, cx, cy, P(1, 0)[0], P(1, 0)[1], C.line, 1.6);
          SK.arrow(g, cx, cy, P(0, 1)[0], P(0, 1)[1], C.line, 1.6);
          h1.style.display = f >= 1 ? "" : "none"; h2.style.display = f >= 2 ? "" : "none";
          if (f >= 1) SK.arrow(g, cx, cy, P(st.a, st.c)[0], P(st.a, st.c)[1], C.orange.s, 3.6);
          if (f >= 2) SK.arrow(g, cx, cy, P(st.b, st.d)[0], P(st.b, st.d)[1], C.blue.s, 3.6);
          h1.moveTo(P(st.a, st.c)[0], P(st.a, st.c)[1]); h2.moveTo(P(st.b, st.d)[0], P(st.b, st.d)[1]);
          read.innerHTML = SK.tex("A=\\begin{pmatrix}\\co{" + SK.fmt(st.a, 1) + "}&\\cb{" + SK.fmt(st.b, 1) + "}\\\\\\co{" + SK.fmt(st.c, 1) + "}&\\cb{" + SK.fmt(st.d, 1) + "}\\end{pmatrix}" + (f >= 4 ? ",\\quad \\det A=" + SK.fmt(det, 2) : ""), true);
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "轉移矩陣：本月 → 下月", icon: "sparkle", render: markovAngle },
      { title: "先做一個動作，再做另一個", icon: "leaf",
        html: "先旋轉 $\\alpha$、再旋轉 $\\beta$，等於一次旋轉 $\\alpha+\\beta$。用矩陣寫就是兩個旋轉矩陣相乘：$$\\begin{pmatrix}\\cos\\beta&-\\sin\\beta\\\\\\sin\\beta&\\cos\\beta\\end{pmatrix}\\begin{pmatrix}\\cos\\alpha&-\\sin\\alpha\\\\\\sin\\alpha&\\cos\\alpha\\end{pmatrix}=\\begin{pmatrix}\\cos(\\alpha+\\beta)&-\\sin(\\alpha+\\beta)\\\\\\sin(\\alpha+\\beta)&\\cos(\\alpha+\\beta)\\end{pmatrix}.$$ 把左邊乘開、對照右邊，和角公式就出現了。矩陣乘法的規則，就是為了讓「連續做兩個動作」剛好對應相乘而設計的。" }
    ],

    challenges: [
      { q: "寫出「對 $x$ 軸鏡射」和「對直線 $y=x$ 鏡射」的矩陣。", hint: "只要想 $(1,0)$ 和 $(0,1)$ 各被送到哪裡。",
        idea: "對 $x$ 軸：$\\begin{pmatrix}1&0\\\\0&-1\\end{pmatrix}$；對 $y=x$：$\\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}$。兩個的行列式都是 $-1$：面積不變，但翻面了。" },
      { q: "寫出逆時針旋轉 $\\theta$ 的矩陣。為什麼它的行列式永遠是 1？", idea: "$\\begin{pmatrix}\\cos\\theta&-\\sin\\theta\\\\\\sin\\theta&\\cos\\theta\\end{pmatrix}$，行列式 $\\cos^2\\theta+\\sin^2\\theta=1$：旋轉不改變面積，也不翻面。" },
      { q: "在「換個角度看」的轉移矩陣裡，如果一開始兩家各占一半，下個月甲牌占多少？你猜長期會停在哪裡？", hint: "$0.8\\times0.5+0.3\\times0.5$。長期時，甲牌流出的人數等於流入的人數。",
        idea: "下個月甲牌占 $0.55$。長期停在 $x$：$0.2x=0.3(1-x)$，得 $x=0.6$。這是探索，不是必修內容。" }
    ],

    where: {
      codes: [["F-11A-3", "平面線性變換與二階轉移方陣"], ["A-11A-3", "矩陣的加減乘、反方陣（實算限二階）"]],
      exam: "11 年級<b>數學 A</b>，學測數 A、分科數甲都在範圍內。數學 B 的矩陣以資料表格與基本運算為主（`A-11B-1`），不含線性變換。",
      stop: "只處理平面（二階）的線性變換與二階轉移方陣。高階轉移矩陣、穩定狀態、特徵值與特徵向量都不是高中核心；若展示長期趨勢，要明標為探索活動。"
    }
  });
})();
