/* 單元：三角形面積公式 */
(function () {
  var C = SK.C, s = SK.s;

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 240, "只量得到兩邊與夾角的三角形土地");
    var A = [80, 190], B = [330, 190], P = [190, 70];
    s("path", { d: "M" + A + " L" + B + " L" + P + "Z", fill: "rgba(243,195,168,.45)", stroke: C.cocoa, "stroke-width": 1.6 }, svg);
    s("line", { x1: A[0], y1: A[1], x2: B[0], y2: B[1], stroke: C.orange.s, "stroke-width": 3.2 }, svg);
    s("line", { x1: A[0], y1: A[1], x2: P[0], y2: P[1], stroke: C.blue.s, "stroke-width": 3.2 }, svg);
    s("path", { d: SK.arcPath(A[0], A[1], 34, 0, Math.atan2(A[1] - P[1], P[0] - A[0])), fill: "none", stroke: C.pink.s, "stroke-width": 2 }, svg);
    SK.label(svg, 128, 172, "47°", { size: 12, color: C.pink.s });
    SK.label(svg, 205, 208, "30 m", { size: 13, color: C.orange.s });
    SK.label(svg, 118, 120, "22 m", { size: 13, color: C.blue.s, anchor: "end" });
    SK.label(svg, 200, 228, "量不到高，只量得到兩邊和夾角——面積呢？", { size: 13, color: C.soft });
  }

  SK.mountUnit({
    slug: "triangle-area",
    en: "Area from two sides and the angle between",
    formula: "K=\\tfrac12\\,\\co{a}\\,\\cb{b}\\,\\sin \\cp{C}",

    hook: {
      html: "一塊三角形的空地。從角落量得出兩條邊：30 公尺、22 公尺，還有它們的夾角 47°。但空地中間有房子，<b>量不到高</b>。",
      ask: "國小學的面積公式是「底 × 高 ÷ 2」，可是高量不到。能不能改用<b>兩邊和夾角</b>直接算出面積？",
      visual: hookVisual
    },

    guess: {
      q: "兩邊長 8 和 6、夾角 30° 的三角形，面積是多少？",
      options: [
        { t: "12", truth: true, explain: "$K=\\frac12\\cdot8\\cdot6\\cdot\\sin30^\\circ=\\frac12\\cdot48\\cdot\\frac12=12$。夾角的 $\\sin$ 就是「把一條邊折算成高」的那個係數。" },
        { t: "24", common: true, explain: "這是 $\\frac12\\cdot8\\cdot6$，等於把夾角當成 $90^\\circ$ 算（因為 $\\sin90^\\circ=1$）。夾角只有 30°，三角形被壓扁了，面積只剩一半。" },
        { t: "48", explain: "$8\\times6$ 是以這兩邊為鄰邊的<b>長方形</b>面積，而且還假設了它們垂直。三角形要再打折兩次：一次因為夾角、一次因為是三角形。" },
        { t: "還要知道第三邊才算得出來", explain: "兩邊夾一角就把三角形完全決定了（SAS 全等），所以面積一定算得出來。第三邊其實也已經被決定了——那是餘弦定理的事。" }
      ]
    },

    derive: {
      intro: "拖動滑桿改變<b>夾角 $C$</b>，兩邊長固定。注意看高（灰藍色）怎麼跟著變，以及角度超過 $90^\\circ$ 之後發生什麼事。",
      tall: true,
      frames: [
        { cap: "從國小的公式出發：面積 = 底 × 高 ÷ 2。取 $a$ 當底，問題只剩一個——<b>高在哪裡？</b>", tex: "K=\\tfrac12\\cdot\\co{a}\\cdot h" },
        { cap: "從頂點往底邊作垂線。這條高 $h$ 落在一個<b>直角三角形</b>裡：斜邊是 $b$、和底邊的夾角是 $C$。", tex: "\\sin \\cp{C}=\\frac{h}{\\cb{b}}" },
        { cap: "所以 $h=b\\sin C$。<b>$\\sin C$ 就是把邊 $b$ 折算成高的係數</b>：角越接近 $90^\\circ$ 折得越少，角越扁折得越多。", tex: "h=\\cb{b}\\sin \\cp{C}" },
        { cap: "代回去，公式就完成了。它只用到<b>兩邊和它們的夾角</b>——完全不需要量高。", tex: "K=\\tfrac12\\,\\co{a}\\,\\cb{b}\\,\\sin \\cp{C}" },
        { cap: "夾角是<b>鈍角</b>時呢？高落到了三角形外面，但 $\\sin C$ 在 $90^\\circ$ 到 $180^\\circ$ 之間仍然是正的，而且 $\\sin C=\\sin(180^\\circ-C)$——公式<b>原封不動</b>成立。這正是廣義角定義帶來的好處。", tex: "\\sin C=\\sin(180^\\circ-C)" },
        { cap: "三個角都可以當「夾角」，所以同一個面積有三種寫法。把它們兜在一起，<b>正弦定理就掉出來了</b>：三式同除以 $\\frac12abc$。", tex: "\\tfrac12ab\\sin C=\\tfrac12bc\\sin A=\\tfrac12ca\\sin B\\ \\Rightarrow\\ \\frac{\\sin A}{a}=\\frac{\\sin B}{b}=\\frac{\\sin C}{c}" }
      ],
      hint: "把角度拉過 90° 看看高跑到哪裡去了。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 540, 400, "兩邊夾一角的三角形與它的高");
        var g = s("g", {}, svg);
        var st = { deg: 47 };
        var read = SK.h("div", { class: "readout" });
        ctx.extra.appendChild(read);
        var sl = SK.slider({
          label: "夾角 $C$", min: 10, max: 170, step: 1, value: st.deg,
          fmt: function (v) { return v + "°"; },
          onInput: function (v) { st.deg = v; draw(); }
        });
        ctx.sliders.appendChild(sl.el);

        var aLen = 6, bLen = 4.4, SC = 46; /* 單位長 46px */

        function draw() {
          var f = ctx.frame, th = SK.rad(st.deg);
          g.innerHTML = "";
          var Cx = 150, Cy = 320;                       /* 夾角頂點 */
          var Bx = Cx + aLen * SC, By = Cy;             /* 沿水平的邊 a */
          var Ax = Cx + bLen * SC * Math.cos(th), Ay = Cy - bLen * SC * Math.sin(th);

          /* 三角形 */
          s("path", { d: "M" + Cx + " " + Cy + " L" + Bx + " " + By + " L" + Ax + " " + Ay + "Z", fill: "rgba(243,195,168,.4)", stroke: "none" }, g);
          s("line", { x1: Cx, y1: Cy, x2: Bx, y2: By, stroke: C.orange.s, "stroke-width": 3.4 }, g);
          s("line", { x1: Cx, y1: Cy, x2: Ax, y2: Ay, stroke: C.blue.s, "stroke-width": 3.4 }, g);
          s("line", { x1: Ax, y1: Ay, x2: Bx, y2: By, stroke: C.cocoa, "stroke-width": 1.8 }, g);

          /* 夾角 */
          s("path", { d: SK.arcPath(Cx, Cy, 36, 0, th), fill: "none", stroke: C.pink.s, "stroke-width": 2.2 }, g);
          SK.label(g, Cx + 54 * Math.cos(th / 2), Cy - 54 * Math.sin(th / 2), "C = " + st.deg + "°", { size: 13, color: C.pink.s });

          /* 高 */
          if (f >= 1) {
            var Fx = Ax, Fy = Cy; /* 垂足在底邊所在的水平線上 */
            s("line", { x1: Ax, y1: Ay, x2: Fx, y2: Fy, stroke: C.blue.s, "stroke-width": 2.6, "stroke-dasharray": st.deg > 90 ? "6 4" : "" }, g);
            SK.rightMark(g, Fx, Fy, 0, -1, Ax > Cx ? -1 : 1, 0, 11, C.blue.s);
            SK.label(g, Ax + (Ax > Cx ? 16 : -16), (Ay + Cy) / 2, "h", { size: 13, color: C.blue.s, anchor: Ax > Cx ? "start" : "end" });
            if (st.deg > 90) {
              s("line", { x1: Cx, y1: Cy, x2: Fx, y2: Fy, stroke: C.line, "stroke-width": 1.4, "stroke-dasharray": "3 3" }, g);
              SK.label(g, (Cx + Fx) / 2, Cy + 22, "高落在三角形外", { size: 11, color: C.soft });
            }
          }
          /* 邊長標示 */
          SK.label(g, (Cx + Bx) / 2, Cy + 24, "a = " + aLen, { size: 13, color: C.orange.s });
          SK.label(g, (Cx + Ax) / 2 - 18, (Cy + Ay) / 2 - 8, "b = " + bLen, { size: 13, color: C.blue.s, anchor: "end" });
          SK.label(g, Cx - 18, Cy + 16, "C", { size: 13 });

          /* 面積長條：和最大值（90°）比較 */
          if (f >= 2) {
            var K = .5 * aLen * bLen * Math.sin(th), Kmax = .5 * aLen * bLen;
            var BX = 470, BH = 240, BY = 320;
            s("rect", { x: BX - 22, y: BY - BH, width: 44, height: BH, rx: 6, fill: "none", stroke: C.line, "stroke-width": 1.2 }, g);
            var h = K / Kmax * BH;
            s("rect", { x: BX - 22, y: BY - h, width: 44, height: h, rx: 6, fill: C.gold.f, stroke: C.gold.s, "stroke-width": 1.5 }, g);
            SK.label(g, BX, BY - h - 14, SK.fmt(K, 2), { size: 13, color: C.gold.s, bold: true });
            SK.label(g, BX, BY - BH - 16, "面積", { size: 12, color: C.soft });
            s("line", { x1: BX - 30, y1: BY - BH, x2: BX + 30, y2: BY - BH, stroke: C.mint.s, "stroke-width": 2 }, g);
            SK.label(g, BX, BY + 20, "C = 90° 時最大", { size: 11, color: C.mint.s });
          }

          var K2 = .5 * aLen * bLen * Math.sin(th);
          read.innerHTML = SK.tex(
            "K=\\tfrac12(\\co{" + aLen + "})(\\cb{" + bLen + "})\\sin " + st.deg + "^\\circ=" + SK.fmt(K2, 3), true) +
            (f >= 1 ? SK.tex("h=\\cb{" + bLen + "}\\sin " + st.deg + "^\\circ=" + SK.fmt(bLen * Math.sin(th), 3), true) : "");
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "三個面積式子 = 正弦定理", icon: "sparkle",
        html: "同一個三角形，挑哪兩邊夾哪個角都可以，所以 $$K=\\tfrac12ab\\sin C=\\tfrac12bc\\sin A=\\tfrac12ca\\sin B.$$ 三式同除以 $\\frac12abc$，每一項都剛好消掉兩個邊長：$$\\frac{\\sin C}{c}=\\frac{\\sin A}{a}=\\frac{\\sin B}{b}.$$ <b>正弦定理其實是「面積只有一個」的另一種說法。</b><br>這也解釋了為什麼正弦定理長那個樣子：分子分母的搭配不是巧合，是消去的結果。" },
      { title: "和外積、行列式是同一件事", icon: "bulb",
        html: "到了向量單元你會看到：兩個向量 $\\vec u$、$\\vec v$ 張出的平行四邊形面積是 $|\\vec u||\\vec v|\\sin\\theta$，也等於行列式 $|u_1v_2-u_2v_1|$ 的絕對值；三角形則是它的一半。<br>換句話說，$\\frac12ab\\sin C$ 只是同一個量的「邊長＋角度」版本，行列式是它的「坐標」版本。<br>知道兩邊與夾角就用前者，知道坐標就用後者——<b>同一個面積，兩種資料，兩條公式。</b>" },
      { title: "為什麼 90° 時最大", icon: "leaf",
        html: "兩邊長固定時，面積 $\\frac12ab\\sin C$ 只隨 $\\sin C$ 變動，而 $\\sin C$ 在 $C=90^\\circ$ 時達到最大值 1。<br>用圖形想更直接：$b$ 這條邊像一根固定長度的竿子繞著 $C$ 點轉，高就是它的鉛直投影——竿子立直的時候，高最大。<br>所以「兩邊長固定，何時面積最大」這類題目，答案永遠是<b>夾角 90°</b>，不必微分。" }
    ],

    challenges: [
      { q: "開頭那塊空地：兩邊 30 公尺、22 公尺，夾角 47°，面積是多少平方公尺？",
        idea: "$K=\\frac12(30)(22)\\sin47^\\circ=330\\times0.7314\\approx241.4$ 平方公尺。<br>順帶一提：如果夾角改成 $133^\\circ$（$=180^\\circ-47^\\circ$），面積<b>完全一樣</b>，因為 $\\sin133^\\circ=\\sin47^\\circ$。兩塊形狀差很多的地，面積卻相同。" },
      { q: "一個平行四邊形的兩鄰邊是 $a$、$b$，夾角 $\\theta$。它的面積是多少？再想想：菱形的面積為什麼可以寫成「兩對角線乘積的一半」？", lv: "Explore",
        hint: "平行四邊形是兩個全等三角形拼起來的。菱形的對角線互相垂直平分。",
        idea: "平行四邊形面積 $=ab\\sin\\theta$（兩倍的三角形）。<br>菱形：設對角線長 $p$、$q$，它們互相垂直平分，把菱形切成 4 個直角三角形，每個的兩股是 $\\frac p2$、$\\frac q2$，總面積 $=4\\cdot\\frac12\\cdot\\frac p2\\cdot\\frac q2=\\frac{pq}{2}$。<br>其實這也是 $\\frac12 d_1d_2\\sin90^\\circ$——同一條公式換成用對角線當「兩邊」。" },
      { q: "圓內接四邊形 $ABCD$ 的面積，能不能只用四個邊長算出來？（提示：對角互補）", lv: "Wonder",
        hint: "用一條對角線把它切成兩個三角形，兩個夾角互補，$\\sin$ 相等而 $\\cos$ 相反。",
        idea: "可以。切成兩個三角形後，面積 $=\\frac12ab\\sin B+\\frac12cd\\sin D$，而 $B+D=180^\\circ$ 所以 $\\sin B=\\sin D$；再用餘弦定理讓同一條對角線的兩種算法相等（$\\cos D=-\\cos B$），就能解出 $\\cos B$，進而得到 $$K=\\sqrt{(s-a)(s-b)(s-c)(s-d)},\\quad s=\\frac{a+b+c+d}{2}.$$ 這叫<b>婆羅摩笈多公式</b>，海龍公式是它 $d=0$ 的特例。<br>注意這裡用的手法和中線定理一模一樣：<b>互補角讓 $\\cos$ 相消、$\\sin$ 相同</b>。同一個結構，在不同題目裡反覆出現。" }
    ],

    where: {
      codes: [["G-10-7", "三角比的性質：正弦定理、餘弦定理與三角形面積，以及在平面圖形的應用"]],
      exam: "10 年級<b>共同必修</b>，學測數 A、數 B 都在範圍內。單獨考的機會不多，但它是<b>測量與應用題的主力工具</b>，也常和正弦定理、餘弦定理一起出現在同一題裡。海龍公式、向量的行列式面積都以它為起點。",
      stop: "會用兩邊夾角求面積、知道鈍角時仍然成立、看得出它和正弦定理的關係就夠了。內切圓半徑公式 $K=rs$、外接圓公式 $K=\\frac{abc}{4R}$ 可以當延伸認識，不必列為必背；圓內接四邊形的面積公式屬於競賽範圍。"
    }
  });
})();
