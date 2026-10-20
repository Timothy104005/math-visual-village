/* 單元：柯西不等式 */
(function () {
  var C = SK.C, s = SK.s;

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 250, "圓上的點與一條移動的直線");
    var O = [200, 130], u = 30;
    function P(x, y) { return [O[0] + x * u, O[1] - y * u]; }
    s("line", { x1: 20, y1: O[1], x2: 380, y2: O[1], class: "m-axis" }, svg);
    s("line", { x1: O[0], y1: 10, x2: O[0], y2: 240, class: "m-axis" }, svg);
    var R = Math.sqrt(13);
    s("circle", { cx: O[0], cy: O[1], r: R * u, fill: "none", stroke: C.blue.s, "stroke-width": 2 }, svg);
    [6, 10, 13].forEach(function (k, i) {
      var p1 = P(-3.4, (k + 2 * 3.4) / 3), p2 = P(3.4, (k - 2 * 3.4) / 3);
      s("line", { x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1], stroke: i === 2 ? C.pink.s : "rgba(156,140,124,.6)", "stroke-width": i === 2 ? 2.6 : 1.4, "stroke-dasharray": i === 2 ? null : "5 4" }, svg);
    });
    var T = P(2, 3);
    s("circle", { cx: T[0], cy: T[1], r: 6, fill: C.pink.s }, svg);
    SK.label(svg, 330, 40, "2x + 3y = k", { size: 13, color: C.pink.s });
    SK.label(svg, 200, 240, "k 最大能到多少？", { size: 13, color: C.soft });
  }

  SK.mountUnit({
    slug: "cauchy",
    en: "The shadow is never longer than the object",
    formula: "(\\co{a_1}\\cb{b_1}+\\co{a_2}\\cb{b_2})^2\\le(\\co{a_1^2+a_2^2})(\\cb{b_1^2+b_2^2}),\\qquad \\text{等號}\\iff \\co{\\vec a}\\parallel\\cb{\\vec b}",

    hook: {
      html: "$x^2+y^2=13$ 的點在一個圓上。把直線 $2x+3y=k$ 往右上推，$k$ 越大，直到直線剛好和圓相切。",
      ask: "這個「最大的 $k$」是多少？有沒有一個公式，不畫圖就能直接算出各種類似問題的極值？",
      visual: hookVisual
    },

    guess: {
      q: "$x^2+y^2=13$ 時，$2x+3y$ 的最大值是多少？",
      options: [
        { t: "13", truth: true, explain: "把 $2x+3y$ 看成 $(2,3)\\cdot(x,y)$。兩個向量的長度分別是 $\\sqrt{13}$ 和 $\\sqrt{13}$，內積最大是長度相乘 $=13$，發生在 $(x,y)$ 和 $(2,3)$ 同方向，也就是 $(x,y)=(2,3)$。" },
        { t: "$\\sqrt{13}\\approx3.61$", common: true, explain: "$\\sqrt{13}$ 是圓的半徑，也就是 $(x,y)$ 的長度。但 $2x+3y$ 還要再乘上 $(2,3)$ 的長度 $\\sqrt{13}$，所以是 $\\sqrt{13}\\times\\sqrt{13}=13$。" },
        { t: "5，在 $(x,y)=(1,\\ 1)$ 附近", explain: "$(1,1)$ 不在圓上（$1+1\\ne13$）。要在圓上找，而且方向要對準 $(2,3)$。" },
        { t: "沒有最大值", explain: "$(x,y)$ 被限制在一個圓上（有界），$2x+3y$ 連續，所以一定有最大值和最小值（最小是 $-13$）。" }
      ]
    },

    derive: {
      intro: "拖動圓上的向量 $\\vec b$，看內積和「兩個長度相乘」差多少。",
      tall: true,
      frames: [
        { cap: "內積有兩種算法：坐標的 $a_1b_1+a_2b_2$，以及長度與夾角的 $|\\vec a||\\vec b|\\cos\\theta$。把它們接起來，就是這個單元的全部祕密。", tex: "\\vec a\\cdot\\vec b=a_1b_1+a_2b_2=|\\vec a||\\vec b|\\cos\\theta" },
        { cap: "因為 $|\\cos\\theta|\\le1$，所以內積<b>永遠不超過</b>兩個長度相乘：$\\vec b$ 在 $\\vec a$ 上的影子，不會比 $\\vec b$ 本人長。這就是<b>柯西不等式</b>的幾何版本。", tex: "|\\vec a\\cdot\\vec b|\\le|\\vec a|\\,|\\vec b|" },
        { cap: "兩邊平方、換成坐標，就是柯西不等式的<b>代數形式</b>。兩邊的差剛好是一個平方（拉格朗日恆等式），所以差永遠 $\\ge0$——這也是不用向量的證明。", tex: "\\begin{aligned}&(a_1^2+a_2^2)(b_1^2+b_2^2)-(a_1b_1+a_2b_2)^2\\\\&=(a_1b_2-a_2b_1)^2\\ \\ge0\\end{aligned}" },
        { cap: "<b>等號什麼時候成立？</b>$\\cos\\theta=\\pm1$，也就是兩向量<b>平行</b>；用坐標說，就是那個平方項 $a_1b_2-a_2b_1=0$（它正好是行列式，等於 0 代表兩向量平行，也就是線性相依）。別寫成 $\\frac{b_1}{a_1}=\\frac{b_2}{a_2}$：分量有 0 時會出現 $\\frac00$，例如 $\\vec a=(1,0)$、$\\vec b=(2,0)$ 平行，比例式卻寫不出來。", tex: "\\text{等號}\\iff a_1b_2-a_2b_1=0\\iff \\vec a\\parallel\\vec b\\ (\\text{或有一個是零向量})" },
        { cap: "<b>拿來求極值</b>：把目標式看成內積，把限制條件看成長度。$2x+3y\\le\\sqrt{2^2+3^2}\\sqrt{x^2+y^2}$，代入 $x^2+y^2=13$ 得上界 13，等號在 $(x,y)\\parallel(2,3)$ 時成立。圖上就是直線推到與圓相切。", tex: "2x+3y\\le\\sqrt{13}\\sqrt{13}=13" }
      ],
      hint: "拖動圓上的 b；第 5 步拖動直線的 k。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 540, 440, "柯西不等式");
        var g = s("g", {}, svg), hg = s("g", {}, svg);
        var O = [230, 280], u = 34, A = [2, 3], st = { th: .5, k: 8 };
        var R = Math.sqrt(13);
        function P(v) { return [O[0] + v[0] * u, O[1] - v[1] * u]; }
        var read = SK.h("div", { class: "readout" });
        var sk = SK.slider({ label: "$k$", min: -14, max: 14, step: .5, value: st.k, color: "green", onInput: function (v) { st.k = v; draw(); } });
        ctx.sliders.appendChild(sk.el);
        ctx.extra.appendChild(read);
        var hB = SK.handle(hg, 0, 0, C.blue.s, "向量 b");
        SK.drag(svg, hB, function (x, y) { st.th = Math.atan2(O[1] - y, x - O[0]); draw(); }, function () { return P([R * Math.cos(st.th), R * Math.sin(st.th)]); }, 8);
        function num(v, d) { return SK.fmt(v, d == null ? 2 : d).replace("−", "-"); }
        function draw() {
          var f = ctx.frame, B = [R * Math.cos(st.th), R * Math.sin(st.th)];
          g.innerHTML = "";
          sk.el.style.display = f === 4 ? "" : "none";
          hB.style.display = f === 4 ? "none" : "";
          for (var i = -5; i <= 8; i++) { var p1 = P([i, -4]), p2 = P([i, 4.6]); s("line", { x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1], class: "m-grid" }, g); }
          for (var j = -4; j <= 4; j++) { var q1 = P([-5, j]), q2 = P([8, j]); s("line", { x1: q1[0], y1: q1[1], x2: q2[0], y2: q2[1], class: "m-grid" }, g); }
          var ax = P([-5, 0]), bx = P([8, 0]), ay = P([0, -4]), by = P([0, 4.6]);
          s("line", { x1: ax[0], y1: ax[1], x2: bx[0], y2: bx[1], class: "m-axis" }, g);
          s("line", { x1: ay[0], y1: ay[1], x2: by[0], y2: by[1], class: "m-axis" }, g);
          s("circle", { cx: O[0], cy: O[1], r: R * u, fill: "none", stroke: C.line, "stroke-width": 1.4, "stroke-dasharray": "5 5" }, g);
          var Z = P([0, 0]), Ap = P(A), Bp = P(B);
          SK.arrow(g, Z[0], Z[1], Ap[0], Ap[1], C.orange.s, 4);
          SK.label(g, Ap[0] + 12, Ap[1] - 10, "a = (2, 3)", { size: 13, color: C.orange.s, anchor: "start" });
          var dot = A[0] * B[0] + A[1] * B[1], la = Math.hypot(A[0], A[1]), lb = Math.hypot(B[0], B[1]);
          if (f < 4) {
            SK.arrow(g, Z[0], Z[1], Bp[0], Bp[1], C.blue.s, 4);
            SK.label(g, Bp[0] + 12, Bp[1] + 14, "b", { it: true, size: 14, color: C.blue.s, anchor: "start" });
            hB.moveTo(Bp[0], Bp[1]);
            // 正射影
            var pr = [A[0] * dot / (la * la), A[1] * dot / (la * la)], Pp = P(pr);
            s("line", { x1: Bp[0], y1: Bp[1], x2: Pp[0], y2: Pp[1], stroke: C.pink.s, "stroke-dasharray": "4 4" }, g);
            s("line", { x1: Z[0], y1: Z[1], x2: Pp[0], y2: Pp[1], stroke: C.pink.s, "stroke-width": 5 }, g);
            SK.label(g, (Z[0] + Pp[0]) / 2, (Z[1] + Pp[1]) / 2 + 20, "影子", { size: 12, color: C.pink.s });
            // 夾角弧
            var a0 = Math.atan2(A[1], A[0]), arc = SK.arcPath(Z[0], Z[1], 30, a0, st.th);
            s("path", { d: arc, fill: "none", stroke: C.purple.s, "stroke-width": 2 }, g);
          }
          if (f === 1 || f === 2 || f === 3) {
            // 長條比較
            var bx0 = 400, by0 = 400, sc = 250 / (la * lb);
            [[Math.abs(dot), C.blue, "|a·b|"], [la * lb, C.gold, "|a||b|"]].forEach(function (q, k2) {
              var h = q[0] * sc;
              s("rect", { x: bx0 + k2 * 56, y: by0 - h, width: 42, height: h, fill: q[1].f, stroke: q[1].s }, g);
              SK.label(g, bx0 + k2 * 56 + 21, by0 + 14, q[2], { size: 11, color: q[1].s });
              SK.label(g, bx0 + k2 * 56 + 21, by0 - h - 12, num(q[0], 1), { size: 11 });
            });
          }
          var lines = [];
          if (f === 0) lines.push("\\vec a\\cdot\\vec b=" + num(dot) + "=|\\vec a||\\vec b|\\cos\\theta=" + num(la) + "\\times" + num(lb) + "\\times" + num(dot / (la * lb)));
          if (f === 1) lines.push("|\\vec a\\cdot\\vec b|=" + num(Math.abs(dot)) + "\\ \\le\\ |\\vec a||\\vec b|=" + num(la * lb));
          if (f === 2) {
            var lhs = dot * dot, rhs = (A[0] * A[0] + A[1] * A[1]) * (B[0] * B[0] + B[1] * B[1]), det = A[0] * B[1] - A[1] * B[0];
            lines.push("(\\vec a\\cdot\\vec b)^2=" + num(lhs, 1) + "\\ \\le\\ " + num(rhs, 1) + "=|\\vec a|^2|\\vec b|^2");
            lines.push("\\text{差}=" + num(rhs - lhs, 1) + "=(" + num(det, 2) + ")^2");
          }
          if (f === 3) {
            var det2 = A[0] * B[1] - A[1] * B[0], par = Math.abs(det2) < .05;
            lines.push("a_1b_2-a_2b_1=" + num(det2) + (par ? "\\approx0" : ""));
            read.innerHTML = lines.map(function (t) { return SK.tex(t, true); }).join("") +
              '<p style="margin:4px 0 0">' + (par ? "✓ 兩向量平行：等號成立" : "把 b 轉到和 a 同方向（或正對面），等號才成立") + "</p>";
            return;
          }
          if (f === 4) {
            // 直線 2x+3y=k
            var k = st.k, pts = [[-5, (k - 2 * -5) / 3], [8, (k - 2 * 8) / 3]];
            var l1 = P(pts[0]), l2 = P(pts[1]);
            /* 圓心到直線距離 |k|/√13 與半徑 √13 比較：只有 |k| = 13 才相切 */
            var touch = Math.abs(Math.abs(k) - 13) < 1e-9, sg = k > 0 ? 1 : -1;
            s("line", { x1: l1[0], y1: l1[1], x2: l2[0], y2: l2[1], stroke: touch ? C.pink.s : C.green.s, "stroke-width": 3 }, g);
            s("circle", { cx: O[0], cy: O[1], r: R * u, fill: "none", stroke: C.blue.s, "stroke-width": 2.4 }, g);
            var T = P([2 * sg, 3 * sg]), tl = sg > 0 ? "(2, 3)" : "(−2, −3)";
            if (touch) { s("circle", { cx: T[0], cy: T[1], r: 7, fill: C.pink.s }, g); SK.label(g, T[0] + 14, T[1] - 12 * sg, tl, { size: 13, color: C.pink.s, anchor: "start" }); }
            SK.label(g, 400, 60, "圓：x² + y² = 13", { size: 13, color: C.blue.s, anchor: "start" });
            SK.label(g, 400, 86, "直線：2x + 3y = " + num(k, 1), { size: 13, color: touch ? C.pink.s : C.green.s, anchor: "start" });
            SK.label(g, 400, 118, Math.abs(k) > 13 ? "碰不到圓：無解" : touch ? (sg > 0 ? "相切：最大值 13" : "相切：最小值 −13") : "交圓於兩點：還能再推", { size: 13, color: C.soft, anchor: "start" });
            read.innerHTML = SK.tex("-13\\le 2x+3y\\le\\sqrt{2^2+3^2}\\cdot\\sqrt{x^2+y^2}=\\sqrt{13}\\sqrt{13}=13", true) +
              SK.tex("\\text{相切}\\iff\\frac{|k|}{\\sqrt{13}}=\\sqrt{13}\\iff k=\\pm13", true) +
              SK.tex("k=13:\\ (x,y)=(2,3);\\qquad k=-13:\\ (x,y)=(-2,-3)", true);
            return;
          }
          read.innerHTML = lines.map(function (t) { return SK.tex(t, true); }).join("");
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "三維、n 維都一樣", icon: "sparkle",
        html: "$(a_1b_1+a_2b_2+a_3b_3)^2\\le(a_1^2+a_2^2+a_3^2)(b_1^2+b_2^2+b_3^2)$，證明完全相同：內積 $\\le$ 長度相乘。維度再高也成立，因為兩個向量永遠落在同一個平面上，夾角的餘弦仍然被 1 夾住。" },
      { title: "和算幾不等式的分工", icon: "leaf",
        html: "<b>算幾不等式</b>擅長處理「乘積固定，求和的最小」這類問題；<b>柯西不等式</b>擅長「平方和固定，求一次式的最大」。兩者都是「等號在某種對稱／平行時成立」。遇到最值問題，先看看式子能不能寫成內積的樣子。" }
    ],

    challenges: [
      { q: "$x^2+y^2=25$ 時，$3x+4y$ 的最大值和最小值是多少？", idea: "$|3x+4y|\\le\\sqrt{9+16}\\sqrt{25}=25$，所以最大 25、最小 $-25$；等號在 $(x,y)=(3,4)$ 與 $(-3,-4)$。" },
      { q: "$a+2b+3c=14$ 時，$a^2+b^2+c^2$ 的最小值是多少？", hint: "把 14 寫成 $(1,2,3)\\cdot(a,b,c)$。", idea: "$14^2\\le(1+4+9)(a^2+b^2+c^2)$，所以 $a^2+b^2+c^2\\ge\\tfrac{196}{14}=14$，等號在 $(a,b,c)=(1,2,3)$。幾何意義：原點到平面 $a+2b+3c=14$ 的距離平方。" },
      { q: "$x>0$、$y>0$ 且 $x+y=1$ 時，用柯西不等式證明 $\\dfrac1x+\\dfrac1y\\ge4$。", hint: "取 $\\vec a=(\\sqrt x,\\sqrt y)$、$\\vec b=\\left(\\tfrac{1}{\\sqrt x},\\tfrac{1}{\\sqrt y}\\right)$。",
        idea: "$(1+1)^2\\le(x+y)\\left(\\tfrac1x+\\tfrac1y\\right)=\\tfrac1x+\\tfrac1y$，所以 $\\ge4$，等號在 $x=y=\\tfrac12$。" }
    ],

    where: {
      codes: [["G-11A-6", "平面向量的運算：正射影與內積、夾角、柯西不等式"], ["G-11A-7", "空間向量的運算：內積與柯西不等式；以柯西不等式解釋二維資料相關係數的範圍為 ※ 延伸"]],
      exam: "11 年級<b>數學 A</b>，學測數 A、分科數甲都在範圍內。數學 B 只學到內積與夾角，不含柯西不等式。",
      stop: "以二維、三維的柯西不等式與它的極值應用為主，理解等號成立的條件。各種變形（如權方和、赫爾德不等式）與競賽技巧不是課綱重點。"
    }
  });
})();
