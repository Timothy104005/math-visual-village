/* 單元：三角不等式 */
(function () {
  var C = SK.C, s = SK.s;

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 250, "直走和繞路");
    var A = [50, 190], B = [350, 170], M = [210, 50];
    s("line", { x1: A[0], y1: A[1], x2: B[0], y2: B[1], stroke: C.green.s, "stroke-width": 3 }, svg);
    s("path", { d: "M" + A + " L" + M + " L" + B, fill: "none", stroke: C.orange.s, "stroke-width": 3, "stroke-dasharray": "7 5" }, svg);
    [A, B, M].forEach(function (p) { s("circle", { cx: p[0], cy: p[1], r: 6, fill: C.cocoa }, svg); });
    SK.label(svg, A[0], A[1] + 20, "家", { size: 14 }); SK.label(svg, B[0], B[1] + 20, "學校", { size: 14 }); SK.label(svg, M[0], M[1] - 18, "便利商店", { size: 13 });
    SK.label(svg, 200, 232, "繞去便利商店，會不會比直走還近？", { size: 13, color: C.soft });
  }

  SK.mountUnit({
    slug: "triangle-inequality",
    en: "A detour is never shorter",
    formula: "\\big||\\vec u|-|\\vec v|\\big|\\ \\le\\ |\\cg{\\vec u+\\vec v}|\\ \\le\\ |\\co{\\vec u}|+|\\cb{\\vec v}|",

    hook: {
      html: "從家到學校，直直走過去，和先繞到便利商店再去學校，哪一個比較近？每個人都知道答案。",
      ask: "這個「常識」寫成向量，會變成什麼不等式？什麼時候兩邊會一樣長？",
      visual: hookVisual
    },

    guess: {
      q: "$|\\vec u|=3$、$|\\vec v|=5$。$|\\vec u+\\vec v|$ 可能是多少？",
      options: [
        { t: "2 到 8 之間的任何數", truth: true, explain: "同方向時最長 $3+5=8$，反方向時最短 $5-3=2$，轉動夾角可以得到中間的任何值。" },
        { t: "一定是 8", common: true, explain: "$3+5=8$ 很直覺！但向量相加要考慮方向，只有兩個向量<b>同方向</b>時長度才會直接相加。" },
        { t: "一定是 $\\sqrt{34}$", explain: "$\\sqrt{3^2+5^2}$ 是兩向量<b>垂直</b>時的長度（畢氏定理），只是其中一種情況。" },
        { t: "0 到 8 之間", explain: "長度 3 和 5 的向量相加，最多只能互相抵消掉 3，所以至少還剩 2，不會是 0。" }
      ]
    },

    derive: {
      intro: "拖動 $\\vec u$、$\\vec v$ 的終點。右邊的長條比較三個長度。",
      tall: true,
      frames: [
        { cap: "$\\vec u$、$\\vec v$ 頭接尾，$\\vec u+\\vec v$ 是第三邊。三角形的一邊小於另兩邊的和：繞路一定比較遠。", tex: "|\\cg{\\vec u+\\vec v}|\\le|\\co{\\vec u}|+|\\cb{\\vec v}|" },
        { cap: "什麼時候等號成立？三角形被壓扁成一條線，而且 $\\vec u$、$\\vec v$ <b>同方向</b>。試著把兩個向量拉成同一個方向。", tex: "|\\vec u+\\vec v|=|\\vec u|+|\\vec v|\\iff \\vec u,\\vec v\\ \\text{同向}" },
        { cap: "另一邊：一邊也<b>大於</b>另兩邊的差。反方向時 $|\\vec u+\\vec v|$ 最短，等於 $\\big||\\vec u|-|\\vec v|\\big|$。", tex: "\\big||\\co{\\vec u}|-|\\cb{\\vec v}|\\big|\\le|\\cg{\\vec u+\\vec v}|" },
        { cap: "<b>實數是特例</b>：數線上的數就是一維向量，絕對值就是長度。$a$、$b$ 同號（同方向）時等號成立，異號時會部分抵消。", tex: "|a+b|\\le|a|+|b|,\\ \\ \\text{等號}\\iff ab\\ge0" },
        { cap: "應用：$|x-a|+|x-b|\\ge|(x-a)-(x-b)|=|a-b|$。$x$ 到兩點的距離和，最小就是兩點的距離，發生在 $x$ 站在兩點之間時。", tex: "|x-a|+|x-b|\\ \\ge\\ |a-b|" }
      ],
      hint: "拖動 u、v 的終點；第 4、5 步用滑桿。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 540, 440, "三角不等式");
        var gridG = s("g", {}, svg), g = s("g", {}, svg), hg = s("g", {}, svg);
        var O = [90, 330], u = 32, st = { u: [5, 2], v: [1, 4], a: 3, b: -5, x: -2.5 };
        function P(v) { return [O[0] + v[0] * u, O[1] - v[1] * u]; }
        var planeG = s("g", {}, gridG);
        for (var i = -2; i <= 9; i++) s("line", { x1: O[0] + i * u, y1: 0, x2: O[0] + i * u, y2: 440, class: "m-grid" }, planeG);
        for (var j = -3; j <= 10; j++) s("line", { x1: 0, y1: O[1] - j * u, x2: 380, y2: O[1] - j * u, class: "m-grid" }, planeG);
        s("line", { x1: 0, y1: O[1], x2: 380, y2: O[1], class: "m-axis" }, planeG);
        s("line", { x1: O[0], y1: 0, x2: O[0], y2: 440, class: "m-axis" }, planeG);
        var hU = SK.handle(hg, 0, 0, C.orange.s, "u 的終點"), hV = SK.handle(hg, 0, 0, C.blue.s, "v 的終點");
        function mk(key, hd, base) {
          SK.drag(svg, hd, function (x, y) {
            var b = base(), v = [Math.round(((x - O[0]) / u - b[0]) * 2) / 2, Math.round(((O[1] - y) / u - b[1]) * 2) / 2];
            if (v[0] || v[1]) { st[key] = [SK.clamp(v[0], -6, 8), SK.clamp(v[1], -6, 8)]; draw(); }
          }, function () { var b = base(); return P([b[0] + st[key][0], b[1] + st[key][1]]); }, u / 2);
        }
        mk("u", hU, function () { return [0, 0]; }); mk("v", hV, function () { return st.u; });
        var read = SK.h("div", { class: "readout" });
        var sa = SK.slider({ label: "$a$", min: -6, max: 6, step: .5, value: st.a, onInput: function (v) { st.a = v; draw(); } });
        var sb = SK.slider({ label: "$b$", min: -6, max: 6, step: .5, value: st.b, color: "blue", onInput: function (v) { st.b = v; draw(); } });
        var sx = SK.slider({ label: "$x$", min: -7, max: 7, step: .25, value: st.x, color: "green", onInput: function (v) { st.x = v; draw(); } });
        ctx.sliders.appendChild(sa.el); ctx.sliders.appendChild(sb.el); ctx.sliders.appendChild(sx.el);
        ctx.extra.appendChild(read);
        function num(v) { return SK.fmt(v, 2).replace("−", "-"); }
        function bars(vals, cols, labels) {
          var bx = 410, by = 400, sc = 26;
          vals.forEach(function (v, k) {
            var x = bx + k * 40;
            s("rect", { x: x, y: by - v * sc, width: 26, height: v * sc, fill: cols[k].f, stroke: cols[k].s }, g);
            SK.label(g, x + 13, by + 14, labels[k], { size: 11, color: cols[k].s });
            SK.label(g, x + 13, by - v * sc - 10, num(v), { size: 11 });
          });
        }
        function numberLine(y, lo, hi) {
          var X = function (t) { return 40 + (t - lo) / (hi - lo) * 460; };
          s("line", { x1: 20, y1: y, x2: 520, y2: y, class: "m-axis" }, g);
          for (var t = Math.ceil(lo); t <= hi; t++) { s("line", { x1: X(t), y1: y - 5, x2: X(t), y2: y + 5, stroke: C.cocoa }, g); SK.label(g, X(t), y + 18, String(t), { size: 11, color: C.soft }); }
          return X;
        }
        function draw() {
          var f = ctx.frame;
          g.innerHTML = "";
          var plane = f <= 2;
          planeG.style.display = plane ? "" : "none";
          hU.style.display = hV.style.display = plane ? "" : "none";
          sa.el.style.display = sb.el.style.display = f === 3 ? "" : "none";
          sx.el.style.display = f === 4 ? "" : "none";
          if (plane) {
            var U = st.u, V = st.v, S = [U[0] + V[0], U[1] + V[1]], Z = P([0, 0]), Up = P(U), Sp = P(S);
            var lu = Math.hypot(U[0], U[1]), lv = Math.hypot(V[0], V[1]), ls = Math.hypot(S[0], S[1]);
            if (f === 2) {
              // 反方向的比較：把 v 反過來畫一條淡線
              var Vr = P([U[0] - V[0], U[1] - V[1]]);
              s("line", { x1: Up[0], y1: Up[1], x2: Vr[0], y2: Vr[1], stroke: C.blue.s, "stroke-dasharray": "4 4", opacity: .5 }, g);
            }
            s("path", { d: "M" + Z + " L" + Up + " L" + Sp + "Z", fill: C.gold.f, stroke: "none" }, g);
            SK.arrow(g, Z[0], Z[1], Up[0], Up[1], C.orange.s, 3.4);
            SK.arrow(g, Up[0], Up[1], Sp[0], Sp[1], C.blue.s, 3.4);
            SK.arrow(g, Z[0], Z[1], Sp[0], Sp[1], C.green.s, 4);
            SK.label(g, (Z[0] + Up[0]) / 2 + 6, (Z[1] + Up[1]) / 2 + 16, "u", { it: true, color: C.orange.s });
            SK.label(g, (Up[0] + Sp[0]) / 2 + 12, (Up[1] + Sp[1]) / 2, "v", { it: true, color: C.blue.s });
            SK.label(g, (Z[0] + Sp[0]) / 2 - 14, (Z[1] + Sp[1]) / 2 - 8, "u+v", { size: 13, color: C.green.s });
            hU.moveTo(Up[0], Up[1]); hV.moveTo(Sp[0], Sp[1]);
            if (f === 2) bars([Math.abs(lu - lv), ls, lu + lv].map(function (v) { return Math.min(v, 14); }), [C.pink, C.green, C.gold], ["||u|−|v||", "|u+v|", "|u|+|v|"]);
            else bars([ls, lu + lv].map(function (v) { return Math.min(v, 14); }), [C.green, C.gold], ["|u+v|", "|u|+|v|"]);
            var same = Math.abs(ls - lu - lv) < 1e-9;
            read.innerHTML = SK.tex(num(Math.abs(lu - lv)) + "\\le|\\vec u+\\vec v|=" + num(ls) + "\\le" + num(lu) + "+" + num(lv) + "=" + num(lu + lv), true) +
              (f === 1 ? '<p style="margin:4px 0 0">' + (same ? "✓ 同方向：等號成立！" : "還差 " + num(lu + lv - ls) + "：把兩個向量拉成同一個方向試試") + "</p>" : "");
            return;
          }
          if (f === 3) {
            var a = st.a, b = st.b, X = numberLine(300, -12, 12);
            SK.arrow(g, X(0), 200, X(a), 200, C.orange.s, 3.4);
            SK.arrow(g, X(a), 230, X(a + b), 230, C.blue.s, 3.4);
            SK.arrow(g, X(0), 260, X(a + b), 260, C.green.s, 4);
            SK.label(g, X(a / 2), 184, "a", { it: true, color: C.orange.s }); SK.label(g, X(a + b / 2), 214, "b", { it: true, color: C.blue.s }); SK.label(g, X((a + b) / 2), 276, "a+b", { size: 13, color: C.green.s });
            s("line", { x1: X(0), y1: 180, x2: X(0), y2: 300, stroke: C.cocoa, "stroke-dasharray": "3 3" }, g);
            SK.label(g, 270, 80, a * b >= 0 ? "同號：同方向，長度直接相加" : "異號：方向相反，互相抵消一部分", { size: 15, color: a * b >= 0 ? C.green.s : C.pink.s });
            read.innerHTML = SK.tex("|" + num(a) + (b >= 0 ? "+" : "") + num(b) + "|=" + num(Math.abs(a + b)) + (a * b >= 0 ? "=" : "<") + num(Math.abs(a)) + "+" + num(Math.abs(b)), true);
            return;
          }
          var A = 1, B = 5, x = st.x, X2 = numberLine(260, -7, 9);
          s("rect", { x: X2(A), y: 248, width: X2(B) - X2(A), height: 24, fill: C.green.f }, g);
          [[A, "a"], [B, "b"]].forEach(function (p) { s("circle", { cx: X2(p[0]), cy: 260, r: 6, fill: C.cocoa }, g); SK.label(g, X2(p[0]), 300, p[1] + " = " + p[0], { size: 13 }); });
          s("path", { d: "M" + X2(x) + " 260 Q" + (X2(x) + X2(A)) / 2 + " 170 " + X2(A) + " 260", fill: "none", stroke: C.orange.s, "stroke-width": 2.4 }, g);
          s("path", { d: "M" + X2(x) + " 260 Q" + (X2(x) + X2(B)) / 2 + " 150 " + X2(B) + " 260", fill: "none", stroke: C.blue.s, "stroke-width": 2.4 }, g);
          s("circle", { cx: X2(x), cy: 260, r: 7, fill: C.purple.s }, g);
          SK.label(g, X2(x), 330, "x", { it: true, color: C.purple.s });
          var sum = Math.abs(x - A) + Math.abs(x - B);
          SK.label(g, 270, 80, sum === 4 ? "x 在兩點之間：距離和最小，等於 4" : "x 在兩點外面：多走了 " + num(sum - 4) + " 的冤枉路", { size: 15, color: sum === 4 ? C.green.s : C.pink.s });
          read.innerHTML = SK.tex("|x-1|+|x-5|=" + num(Math.abs(x - A)) + "+" + num(Math.abs(x - B)) + "=" + num(sum) + "\\ge4", true);
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "代數證明：用內積", icon: "sparkle",
        html: "$|\\vec u+\\vec v|^2=|\\vec u|^2+2\\,\\vec u\\cdot\\vec v+|\\vec v|^2$。因為 $\\vec u\\cdot\\vec v=|\\vec u||\\vec v|\\cos\\theta\\le|\\vec u||\\vec v|$，所以右邊 $\\le(|\\vec u|+|\\vec v|)^2$。等號發生在 $\\cos\\theta=1$，也就是同方向。圖和算式說的是同一件事。" },
      { title: "很多段也一樣", icon: "leaf",
        html: "$|\\vec a_1+\\vec a_2+\\cdots+\\vec a_n|\\le|\\vec a_1|+|\\vec a_2|+\\cdots+|\\vec a_n|$：走一條彎彎曲曲的路，總長度一定不小於起點到終點的直線距離。GPS 算出的「直線距離」永遠是路程的下限。" }
    ],

    challenges: [
      { q: "三角形三邊長 3、7、$x$，$x$ 的範圍是什麼？", idea: "$7-3<x<7+3$，即 $4<x<10$。（等號時三角形壓扁，不算三角形。）" },
      { q: "$|x+2|+|x-3|$ 的最小值是多少？發生在哪些 $x$？", idea: "$\\ge|(x+2)-(x-3)|=5$，當 $-2\\le x\\le3$ 時等號成立。" },
      { q: "$|\\vec a|=2$、$|\\vec b|=3$，$|2\\vec a-\\vec b|$ 的最大值和最小值是多少？", idea: "$|2\\vec a|=4$、$|\\vec b|=3$：最大 $4+3=7$（$2\\vec a$ 和 $-\\vec b$ 同向），最小 $4-3=1$。" }
    ],

    where: {
      codes: [["G-11A-4", "三角不等式：向量長度與三角不等式，並以實數的三角不等式為特例"]],
      exam: "11 年級<b>數學 A</b>，學測數 A、分科數甲都在範圍內。數學 B 不含。",
      stop: "理解幾何意義、會用它求距離和的最小值或長度範圍就夠了。多個向量的一般化與柯西不等式的關係可以欣賞，不需大量代數操作。"
    }
  });
})();
