/* 補充單元：中線定理 */
(function () {
  var C = SK.C, s = SK.s;

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 240, "三角形與一條中線");
    var B = [70, 190], Cc = [330, 190], A = [160, 50];
    var M = [(B[0] + Cc[0]) / 2, (B[1] + Cc[1]) / 2];
    s("path", { d: "M" + A + " L" + B + " L" + Cc + "Z", fill: "rgba(201,212,188,.4)", stroke: C.cocoa, "stroke-width": 1.6 }, svg);
    s("line", { x1: A[0], y1: A[1], x2: M[0], y2: M[1], stroke: C.pink.s, "stroke-width": 3 }, svg);
    [[B, "B"], [Cc, "C"], [A, "A"]].forEach(function (p) {
      s("circle", { cx: p[0][0], cy: p[0][1], r: 4.5, fill: C.paper, stroke: C.cocoa, "stroke-width": 1.6 }, svg);
      SK.label(svg, p[0][0] + (p[1] === "C" ? 16 : -16), p[0][1] + (p[1] === "A" ? -14 : 14), p[1], { size: 14 });
    });
    s("circle", { cx: M[0], cy: M[1], r: 4.5, fill: C.pink.f, stroke: C.pink.s, "stroke-width": 1.6 }, svg);
    SK.label(svg, M[0], M[1] + 20, "M（中點）", { size: 12, color: C.pink.s });
    SK.label(svg, 118, 108, "7", { size: 14, color: C.orange.s });
    SK.label(svg, 258, 108, "5", { size: 14, color: C.blue.s });
    SK.label(svg, 232, 130, "?", { size: 16, color: C.pink.s });
    SK.label(svg, 200, 226, "兩邊長知道了，中線 AM 有多長？", { size: 13, color: C.soft });
  }

  SK.mountUnit({
    slug: "median-theorem",
    en: "The median and the two sides",
    formula: "\\co{\\overline{AB}}^2+\\cb{\\overline{AC}}^2=2\\left(\\cp{\\overline{AM}}^2+\\overline{BM}^2\\right)",

    hook: {
      html: "$\\triangle ABC$ 中，$M$ 是 $\\overline{BC}$ 的中點，$\\overline{AM}$ 叫做<b>中線</b>。已知 $\\overline{AB}=7$、$\\overline{AC}=5$。",
      ask: "中線 $\\overline{AM}$ 的長度是多少？只靠這兩個數字夠不夠？如果不夠，還缺什麼？",
      visual: hookVisual
    },

    guess: {
      q: "$\\overline{AB}=7$、$\\overline{AC}=5$，中線 $\\overline{AM}$ 的長度是？",
      options: [
        { t: "6（兩邊的平均）", common: true, explain: "中線看起來「夾在中間」，所以取平均很直覺。但把 $A$ 壓得很低（三角形很扁）時中線會變得很短，把 $A$ 拉得很高時中線會變長——它根本不是固定值，不可能永遠等於 6。" },
        { t: "還不夠，要知道 $\\overline{BC}$", truth: true, explain: "三角形要三邊才定得下來。知道 $\\overline{BC}$ 之後，中線就完全確定了，而且有一條公式直接算得出來——那就是<b>中線定理</b>。" },
        { t: "$\\sqrt{7^2+5^2}\\,$", explain: "畢氏定理只在<b>直角</b>三角形成立，而且 $\\overline{AM}$ 也不是斜邊。這個式子沒有對應的直角。" },
        { t: "3.5（$\\overline{AB}$ 的一半）", explain: "被「中點」這兩個字帶走了。$M$ 是 $\\overline{BC}$ 的中點，被切一半的是 $\\overline{BC}$，不是 $\\overline{AB}$，也不是中線本身。" }
      ]
    },

    derive: {
      intro: "拖動頂點 $A$（或用方向鍵），$\\overline{BC}$ 固定。右邊兩根長條分別是等式的左邊與右邊——<b>不管你把 $A$ 拖到哪裡，它們永遠一樣長</b>。",
      tall: true,
      frames: [
        { cap: "$M$ 是 $\\overline{BC}$ 的中點，所以 $\\overline{BM}=\\overline{CM}$。中線把 $\\triangle ABC$ 切成兩個三角形，它們共用 $\\overline{AM}$ 這條邊。", tex: "\\overline{BM}=\\overline{CM}=\\tfrac12\\overline{BC}" },
        { cap: "關鍵在 $M$ 點的兩個角：$\\angle AMB$ 和 $\\angle AMC$ 加起來是平角，它們<b>互補</b>。互補的兩個角，餘弦剛好差一個負號。", tex: "\\cos\\angle AMC=-\\cos\\angle AMB" },
        { cap: "對兩個小三角形各用一次<b>餘弦定理</b>。兩條式子長得幾乎一樣，只有最後那一項的正負號相反。", tex: "\\begin{aligned}\\co{\\overline{AB}}^2&=\\cp{\\overline{AM}}^2+\\overline{BM}^2-2\\cdot\\cp{\\overline{AM}}\\cdot\\overline{BM}\\cos\\theta\\\\ \\cb{\\overline{AC}}^2&=\\cp{\\overline{AM}}^2+\\overline{CM}^2+2\\cdot\\cp{\\overline{AM}}\\cdot\\overline{CM}\\cos\\theta\\end{aligned}" },
        { cap: "兩式<b>相加</b>。因為 $\\overline{BM}=\\overline{CM}$，那兩個帶 $\\cos\\theta$ 的項剛好一正一負，<b>完全消掉</b>——角度整個不見了，這正是我們要的。", tex: "\\co{\\overline{AB}}^2+\\cb{\\overline{AC}}^2=2\\left(\\cp{\\overline{AM}}^2+\\overline{BM}^2\\right)" },
        { cap: "把它解成中線的長度，就能直接用三邊算中線。開頭的題目補上 $\\overline{BC}=8$：$\\overline{AM}^2=\\frac{2(49+25)-64}{4}=21$，$\\overline{AM}=\\sqrt{21}\\approx4.58$。", tex: "\\cp{\\overline{AM}}^2=\\frac{2\\co{\\overline{AB}}^2+2\\cb{\\overline{AC}}^2-\\overline{BC}^2}{4}" },
        { cap: "再看一次右邊那兩根長條：$A$ 怎麼拖都一樣高。這個「拖不壞」的性質，就是<b>定理</b>兩個字的意思——它對<b>每一個</b>三角形都成立。", tex: "\\text{對任意}\\ \\triangle ABC\\ \\text{恆成立}" }
      ],
      hint: "拖動頂點 A，或先點它再按方向鍵。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 540, 420, "三角形、中線與兩邊平方和");
        var g = s("g", {}, svg);
        var Bx = 90, By = 320, Cx = 330, Cy = 320;
        var Mx = (Bx + Cx) / 2, My = (By + Cy) / 2;
        var st = { ax: 170, ay: 130 };
        var read = SK.h("div", { class: "readout" });
        ctx.extra.appendChild(read);

        var handle = SK.handle(svg, st.ax, st.ay, C.green.s, "頂點 A，可拖動");
        SK.drag(svg, handle, function (x, y) {
          st.ax = SK.clamp(x, 20, 400); st.ay = SK.clamp(y, 40, 300); draw();
        }, function () { return [st.ax, st.ay]; }, 8);

        var SCALE = 30; /* 每 30 px 當作 1 單位 */
        function draw() {
          var f = ctx.frame, Ax = st.ax, Ay = st.ay;
          g.innerHTML = "";
          var c = Math.hypot(Ax - Bx, Ay - By) / SCALE;   /* AB */
          var b = Math.hypot(Ax - Cx, Ay - Cy) / SCALE;   /* AC */
          var mLen = Math.hypot(Ax - Mx, Ay - My) / SCALE; /* AM */
          var half = Math.hypot(Cx - Mx, Cy - My) / SCALE; /* BM */

          s("path", { d: "M" + Ax + " " + Ay + " L" + Bx + " " + By + " L" + Cx + " " + Cy + "Z", fill: "rgba(201,212,188,.32)", stroke: "none" }, g);
          s("line", { x1: Bx, y1: By, x2: Cx, y2: Cy, stroke: C.cocoa, "stroke-width": 2 }, g);
          s("line", { x1: Ax, y1: Ay, x2: Bx, y2: By, stroke: C.orange.s, "stroke-width": 3.2 }, g);
          s("line", { x1: Ax, y1: Ay, x2: Cx, y2: Cy, stroke: C.blue.s, "stroke-width": 3.2 }, g);
          if (f >= 0) s("line", { x1: Ax, y1: Ay, x2: Mx, y2: My, stroke: C.pink.s, "stroke-width": 3.4 }, g);

          /* 兩半相等的記號 */
          [[Bx, Mx], [Mx, Cx]].forEach(function (seg) {
            var mx = (seg[0] + seg[1]) / 2;
            s("line", { x1: mx, y1: By - 7, x2: mx, y2: By + 7, stroke: C.pink.s, "stroke-width": 2 }, g);
          });

          /* M 點的兩個角 */
          if (f >= 1) {
            /* 以數學方向（逆時針、y 向上）表示 MA 的方向角 */
            var angA = Math.atan2(My - Ay, Ax - Mx);
            s("path", { d: SK.arcPath(Mx, My, 26, angA, Math.PI), fill: "none", stroke: C.purple.s, "stroke-width": 1.8 }, g);
            s("path", { d: SK.arcPath(Mx, My, 20, 0, angA), fill: "none", stroke: C.gold.s, "stroke-width": 1.8 }, g);
            SK.label(g, Mx - 40, My - 16, "θ", { size: 13, color: C.purple.s });
            SK.label(g, Mx + 40, My - 12, "180°−θ", { size: 11, color: C.gold.s });
          }

          /* 標點 */
          [[Bx, By, "B", -16, 20], [Cx, Cy, "C", 16, 20], [Mx, My, "M", 0, 24]].forEach(function (p) {
            s("circle", { cx: p[0], cy: p[1], r: 5, fill: p[2] === "M" ? C.pink.f : C.paper, stroke: p[2] === "M" ? C.pink.s : C.cocoa, "stroke-width": 1.7 }, g);
            SK.label(g, p[0] + p[3], p[1] + p[4], p[2], { size: 13, color: p[2] === "M" ? C.pink.s : C.ink });
          });
          SK.label(g, Ax, Ay - 26, "A", { size: 13, color: C.green.s });
          SK.label(g, (Ax + Bx) / 2 - 18, (Ay + By) / 2, SK.fmt(c, 2), { size: 12, color: C.orange.s, anchor: "end" });
          SK.label(g, (Ax + Cx) / 2 + 18, (Ay + Cy) / 2, SK.fmt(b, 2), { size: 12, color: C.blue.s, anchor: "start" });
          SK.label(g, (Ax + Mx) / 2 + 14, (Ay + My) / 2, SK.fmt(mLen, 2), { size: 12, color: C.pink.s, anchor: "start" });

          /* 兩根長條：左式與右式 */
          if (f >= 2) {
            var L = c * c + b * b, R = 2 * (mLen * mLen + half * half);
            var maxV = 90, BH = 250, BY = 340;
            [[440, L, "AB² + AC²", C.orange], [490, R, "2(AM² + BM²)", C.pink]].forEach(function (d) {
              var h = SK.clamp(d[1] / maxV, 0, 1) * BH;
              s("rect", { x: d[0] - 18, y: BY - BH, width: 36, height: BH, rx: 5, fill: "none", stroke: C.line, "stroke-width": 1 }, g);
              s("rect", { x: d[0] - 18, y: BY - h, width: 36, height: h, rx: 5, fill: d[3].f, stroke: d[3].s, "stroke-width": 1.5 }, g);
              SK.label(g, d[0], BY - h - 12, SK.fmt(d[1], 1), { size: 12, color: d[3].s, bold: true });
            });
            SK.label(g, 465, BY + 20, "永遠一樣高", { size: 12, color: C.cocoa });
            SK.label(g, 440, BY + 40, "左式", { size: 10, color: C.orange.s });
            SK.label(g, 492, BY + 40, "右式", { size: 10, color: C.pink.s });
          }

          handle.moveTo(Ax, Ay);
          svg.appendChild(handle);

          read.innerHTML = SK.tex(
            "\\co{" + SK.fmt(c, 2) + "}^2+\\cb{" + SK.fmt(b, 2) + "}^2=" + SK.fmt(c * c + b * b, 2) +
            "\\qquad 2\\left(\\cp{" + SK.fmt(mLen, 2) + "}^2+" + SK.fmt(half, 2) + "^2\\right)=" + SK.fmt(2 * (mLen * mLen + half * half), 2), true);
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "用向量看，三行就結束", icon: "sparkle",
        html: "把 $M$ 當原點，令 $\\vec m=\\overrightarrow{MA}$、$\\vec u=\\overrightarrow{MB}$。因為 $M$ 是中點，$\\overrightarrow{MC}=-\\vec u$。於是 $$\\overline{AB}^2=|\\vec u-\\vec m|^2=|\\vec m|^2-2\\vec m\\cdot\\vec u+|\\vec u|^2$$ $$\\overline{AC}^2=|-\\vec u-\\vec m|^2=|\\vec m|^2+2\\vec m\\cdot\\vec u+|\\vec u|^2$$ 相加，內積項互相抵消，得到 $2(|\\vec m|^2+|\\vec u|^2)$。<br>和餘弦定理那條路是同一件事：<b>「互補角的餘弦相反」就是「內積差一個負號」</b>。向量版本之所以短，是因為它把「中點」直接寫成了 $\\pm\\vec u$。" },
      { title: "其實是平行四邊形定理", icon: "bulb",
        html: "把 $\\triangle ABC$ 補成一個平行四邊形 $ABDC$（$D$ 是 $A$ 對 $M$ 的對稱點）。那麼 $\\overline{AD}=2\\overline{AM}$，而兩條對角線是 $\\overline{AD}$ 與 $\\overline{BC}$。中線定理改寫一下就變成：$$\\overline{AD}^2+\\overline{BC}^2=2\\left(\\overline{AB}^2+\\overline{AC}^2\\right)$$ 也就是<b>兩條對角線的平方和 ＝ 四個邊的平方和</b>。<br>這條「平行四邊形恆等式」在大學會再出現一次：它正是判斷一個長度（範數）能不能由內積定義出來的關鍵條件。一條國中就看得懂的圖形性質，在高等數學裡變成了分水嶺。" }
    ],

    challenges: [
      { q: "$\\triangle ABC$ 中 $\\overline{AB}=7$、$\\overline{AC}=5$、$\\overline{BC}=8$，求中線 $\\overline{AM}$。再求另外兩條中線。",
        hint: "$\\overline{AM}^2=\\frac{2b^2+2c^2-a^2}{4}$，記得每次要把「對邊」換成被平分的那一條。",
        idea: "$\\overline{AM}^2=\\frac{2(25)+2(49)-64}{4}=21$，$\\overline{AM}=\\sqrt{21}\\approx4.58$。<br>$B$ 出發的中線：$\\frac{2(49)+2(64)-25}{4}=\\frac{201}{4}$，長 $\\approx7.09$。$C$ 出發：$\\frac{2(25)+2(64)-49}{4}=\\frac{129}{4}$，長 $\\approx5.68$。" },
      { q: "證明：三角形三條中線的平方和 $=\\frac34\\times$（三邊的平方和）。", lv: "Explore",
        hint: "把三條中線的公式全部寫出來加起來，看看分子會湊成什麼。",
        idea: "三式相加：$\\frac{(2b^2+2c^2-a^2)+(2c^2+2a^2-b^2)+(2a^2+2b^2-c^2)}{4}=\\frac{3(a^2+b^2+c^2)}{4}$。<br>式子漂亮得有點可疑，但它只是把三次對稱的加法整理一下而已——這種「輪換對稱」的湊合，在幾何恆等式裡非常常見。" },
      { q: "中線定理消掉了角度，餘弦定理卻留著角度。回頭看第 3、4 步：那個「消掉」是運氣好，還是有結構上的理由？如果 $M$ 不是中點而是三等分點，還消得掉嗎？", lv: "Wonder",
        idea: "不是運氣。消得掉的理由有兩個，缺一不可：<b>互補角</b>讓兩個餘弦項差一個負號，<b>中點</b>讓兩項的係數 $\\overline{BM}$、$\\overline{CM}$ 相等——一正一負又等量，才會抵消。<br>若 $M$ 是三等分點（$\\overline{BM}:\\overline{MC}=1:2$），互補角仍然成立，但係數變成 1 比 2，不會抵消；這時要把第二式乘以 $\\frac12$ 再相加，才消得掉。結果是一條更一般的公式，叫做<b>斯圖爾特定理</b>（Stewart's theorem），中線定理只是它 $1:1$ 的特例。<br>能看出「一個定理是另一個定理的特例」，比多背一條公式有用得多。" }
    ],

    where: {
      codes: [["G-10-7", "（接點）三角比的性質：正弦定理、餘弦定理與三角形的計算"]],
      exam: "<b>課綱外補充</b>：中線定理不是 108 課綱的正式條目，學測不會直接考它的名字。但它在<b>學校段考</b>很常出現，而且它是餘弦定理最漂亮的應用之一——所以放在這裡。真的忘記公式時，現場用餘弦定理推一次也只要三行。",
      stop: "會推、會用就好。斯圖爾特定理、角平分線長公式、中線與重心的各種長度關係是競賽或資優延伸，不必在這裡展開。重點是理解「為什麼角度會消失」，而不是再背一條公式。"
    }
  });
})();
