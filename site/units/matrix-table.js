/* 單元：矩陣與資料表格 */
(function () {
  var C = SK.C, s = SK.s;
  var SHOPS = ["東店", "西店"], ITEMS = ["紅茶", "奶茶", "綠茶"];
  var A = [[30, 50, 20], [40, 20, 60]], B = [[20, 40, 30], [50, 10, 40]];

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 250, "兩家店的銷售表");
    var x0 = 90, y0 = 60, cw = 80, ch = 40;
    ITEMS.forEach(function (t, j) { SK.label(svg, x0 + cw * (j + .5), y0 - 16, t, { size: 13, color: C.soft }); });
    SHOPS.forEach(function (t, i) {
      SK.label(svg, x0 - 14, y0 + ch * (i + .5), t, { size: 13, color: C.soft, anchor: "end" });
      A[i].forEach(function (v, j) {
        s("rect", { x: x0 + cw * j, y: y0 + ch * i, width: cw, height: ch, fill: i ? C.blue.f : C.orange.f, stroke: C.cocoa }, svg);
        SK.label(svg, x0 + cw * (j + .5), y0 + ch * (i + .5), v + " 杯", { size: 14 });
      });
    });
    SK.label(svg, 200, 180, "紅茶 30 元、奶茶 45 元、綠茶 35 元", { size: 13 });
    SK.label(svg, 200, 214, "兩家店今天各收了多少錢？", { size: 13, color: C.pink.s });
  }

  SK.mountUnit({
    slug: "matrix-table",
    en: "Multiply a table by a table",
    formula: "\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}\\begin{bmatrix}x\\\\y\\end{bmatrix}=x\\co{\\begin{bmatrix}a\\\\c\\end{bmatrix}}+y\\cb{\\begin{bmatrix}b\\\\d\\end{bmatrix}},\\qquad A^{-1}=\\frac{1}{ad-bc}\\begin{bmatrix}d&-b\\\\-c&a\\end{bmatrix}",

    hook: {
      html: "兩家飲料店今天賣出的杯數排成一張表。價格也可以排成一列數字。",
      ask: "「每家店的營收」要怎麼從這兩張表算出來？這種「表格乘表格」的算法，和聯立方程式有什麼關係？",
      visual: hookVisual
    },

    guess: {
      q: "東店賣紅茶 30 杯、奶茶 50 杯、綠茶 20 杯；價格 30、45、35 元。東店營收是多少？",
      options: [
        { t: "$30\\times30+50\\times45+20\\times35=3850$ 元", truth: true, explain: "每一種飲料「杯數 × 單價」再加起來。這正是矩陣乘法的一格：<b>列</b>和<b>行</b>對應相乘再相加（就像內積）。" },
        { t: "$(30+50+20)\\times(30+45+35)=11000$ 元", common: true, explain: "先各自加總再相乘很省事，但這樣等於假設每一杯都能配上每一種價格：100 杯 × 110 元，把紅茶也當奶茶賣了。要一種一種對應相乘。" },
        { t: "$(30\\times30,\\ 50\\times45,\\ 20\\times35)$", explain: "這是每種飲料各自的營收，還差最後一步：加起來才是整家店的營收。" },
        { t: "$110$ 元", explain: "$30+45+35=110$ 是三種飲料各買一杯的價錢，不是營收。" }
      ]
    },

    derive: {
      intro: "拖動滑桿改價格或方程式右邊的數；觀察表格和圖形怎麼一起變。",
      tall: true,
      frames: [
        { cap: "資料表就是<b>矩陣</b>：$m$ 列 $n$ 行排成的數。兩個月的銷售表同樣大小，對應位置相加就是兩個月的合計：<b>矩陣加法</b>。", tex: "A+B=\\big[a_{ij}+b_{ij}\\big]" },
        { cap: "<b>矩陣乘向量</b>：每一列和價格向量對應相乘再相加，得到每家店的營收。換個角度看：它也是以<b>價格</b>當係數，把三個「行」（每種飲料在兩家店的杯數）做線性組合。", tex: "A\\vec p=p_1\\vec a_1+p_2\\vec a_2+p_3\\vec a_3" },
        { cap: "<b>矩陣乘矩陣</b>：把「售價」和「成本」兩個向量並排成矩陣 $P$，$AP$ 的每一行就是一次矩陣乘向量：一次算出兩家店的營收和成本。第 $i$ 列第 $j$ 行 = $A$ 的第 $i$ 列 · $P$ 的第 $j$ 行。", tex: "(AP)_{ij}=\\sum_k a_{ik}p_{kj}" },
        { cap: "<b>二元一次方程組</b>也是矩陣乘向量：$A\\vec x=\\vec b$。幾何上是在問：兩個行向量要各取幾倍，才能拼出 $\\vec b$？", tex: "\\begin{cases}2x+y=b_1\\\\x+3y=b_2\\end{cases}\\iff x\\co{\\begin{bmatrix}2\\\\1\\end{bmatrix}}+y\\cb{\\begin{bmatrix}1\\\\3\\end{bmatrix}}=\\begin{bmatrix}b_1\\\\b_2\\end{bmatrix}" },
        { cap: "<b>反方陣</b>：若 $\\det A=ad-bc\\ne0$，就有 $A^{-1}$ 使 $A^{-1}A=I$，於是 $\\vec x=A^{-1}\\vec b$。$\\det A=0$ 時兩個行向量平行，拼不出（或有無限多種拼法），沒有反方陣。", tex: "A^{-1}=\\frac{1}{ad-bc}\\begin{bmatrix}d&-b\\\\-c&a\\end{bmatrix}" }
      ],
      hint: "第 2、3 步拖動價格；第 4、5 步拖動 b₁、b₂。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 540, 440, "矩陣與資料表");
        var g = s("g", {}, svg);
        var st = { p: [30, 45, 35], cost: [12, 20, 10], b: [5, 5] };
        var read = SK.h("div", { class: "readout" });
        var sp = ITEMS.map(function (t, j) {
          var o = SK.slider({ label: t, min: 10, max: 80, step: 5, value: st.p[j], color: ["", "blue", "green"][j], fmt: function (v) { return v + " 元"; }, onInput: function (v) { st.p[j] = v; draw(); } });
          ctx.sliders.appendChild(o.el); return o;
        });
        var sb = ["$b_1$", "$b_2$"].map(function (lab, k) {
          var o = SK.slider({ label: lab, min: -4, max: 9, step: .5, value: st.b[k], color: k ? "blue" : "", onInput: function (v) { st.b[k] = v; draw(); } });
          ctx.sliders.appendChild(o.el); return o;
        });
        ctx.extra.appendChild(read);
        function num(v) { return SK.fmt(v, 2).replace("−", "-"); }
        function table(x0, y0, M, rowLab, colLab, fills, cw, ch, fmt) {
          cw = cw || 62; ch = ch || 34;
          colLab.forEach(function (t, j) { SK.label(g, x0 + cw * (j + .5), y0 - 14, t, { size: 12, color: C.soft }); });
          M.forEach(function (row, i) {
            if (rowLab) SK.label(g, x0 - 8, y0 + ch * (i + .5), rowLab[i], { size: 12, color: C.soft, anchor: "end" });
            row.forEach(function (v, j) {
              s("rect", { x: x0 + cw * j, y: y0 + ch * i, width: cw, height: ch, fill: fills(i, j), stroke: C.cocoa, "stroke-width": .8 }, g);
              SK.label(g, x0 + cw * (j + .5), y0 + ch * (i + .5), fmt ? fmt(v) : String(v), { size: 13 });
            });
          });
        }
        var colF = [C.orange.f, C.blue.f, C.green.f];
        function draw() {
          var f = ctx.frame, p = st.p;
          g.innerHTML = "";
          sp.forEach(function (o) { o.el.style.display = f === 1 || f === 2 ? "" : "none"; });
          sb.forEach(function (o) { o.el.style.display = f >= 3 ? "" : "none"; });
          if (f === 0) {
            table(90, 50, A, SHOPS, ITEMS, function () { return C.gold.f; });
            SK.label(g, 300, 84, "+", { size: 26 });
            table(90, 170, B, SHOPS, ITEMS, function () { return C.purple.f; });
            SK.label(g, 60, 34, "五月", { size: 12, color: C.gold.s, anchor: "start" });
            SK.label(g, 60, 154, "六月", { size: 12, color: C.purple.s, anchor: "start" });
            s("line", { x1: 60, y1: 262, x2: 300, y2: 262, stroke: C.cocoa, "stroke-width": 1.4 }, g);
            table(90, 290, A.map(function (r, i) { return r.map(function (v, j) { return v + B[i][j]; }); }), SHOPS, ITEMS, function () { return C.mint.f; });
            SK.label(g, 60, 274, "合計", { size: 12, color: C.mint.s, anchor: "start" });
            read.innerHTML = SK.tex("\\begin{bmatrix}30&50&20\\\\40&20&60\\end{bmatrix}+\\begin{bmatrix}20&40&30\\\\50&10&40\\end{bmatrix}=\\begin{bmatrix}50&90&50\\\\90&30&100\\end{bmatrix}", true);
            return;
          }
          if (f === 1 || f === 2) {
            var P = f === 1 ? p.map(function (v) { return [v]; }) : p.map(function (v, j) { return [v, st.cost[j]]; });
            table(80, 60, A, SHOPS, ITEMS, function (i, j) { return colF[j]; });
            SK.label(g, 280, 94, "×", { size: 24 });
            table(310, 60, P, ITEMS, f === 1 ? ["售價"] : ["售價", "成本"], function (i, j) { return j ? C.pink.f : C.gold.f; }, 56);
            var R = A.map(function (r) { return P[0].map(function (_, c) { return r.reduce(function (acc, v, k) { return acc + v * P[k][c]; }, 0); }); });
            SK.label(g, 200, 250, "=", { size: 24 });
            table(250, 220, R, SHOPS, f === 1 ? ["營收"] : ["營收", "成本"], function (i, j) { return j ? C.pink.f : C.mint.f; }, 70, 34, function (v) { return v + " 元"; });
            if (f === 1) {
              // 行向量的線性組合：長條圖
              var bx = 70, by = 420, sc = .025;
              SK.label(g, bx, 318, "東店營收 = 各行 × 價格 疊起來：", { size: 12, color: C.soft, anchor: "start" });
              var x = bx;
              A[0].forEach(function (v, j) { var w = v * p[j] * sc * 3; s("rect", { x: x, y: 340, width: w, height: 26, fill: colF[j], stroke: C.cocoa }, g); if (w > 50) SK.label(g, x + w / 2, 353, v + "×" + p[j], { size: 11 }); x += w; });
              x = bx;
              SK.label(g, bx, 384, "西店：", { size: 12, color: C.soft, anchor: "start" });
              A[1].forEach(function (v, j) { var w = v * p[j] * sc * 3; s("rect", { x: x, y: 394, width: w, height: 26, fill: colF[j], stroke: C.cocoa }, g); if (w > 50) SK.label(g, x + w / 2, 407, v + "×" + p[j], { size: 11 }); x += w; });
            }
            read.innerHTML = f === 1 ? SK.tex("\\begin{bmatrix}30&50&20\\\\40&20&60\\end{bmatrix}\\begin{bmatrix}" + p.join("\\\\") + "\\end{bmatrix}=\\begin{bmatrix}" + R.map(function (r) { return r[0]; }).join("\\\\") + "\\end{bmatrix}", true)
              : SK.tex("\\text{利潤}=\\text{營收}-\\text{成本}=(" + R.map(function (r) { return r[0] - r[1]; }).join(",\\ ") + ")\\ \\text{元}", true);
            return;
          }
          // f 3、4：方程組的幾何
          var O = [150, 330], u = 36, a1 = [2, 1], a2 = [1, 3], b = st.b;
          var det = a1[0] * a2[1] - a2[0] * a1[1];
          var x1 = (b[0] * a2[1] - a2[0] * b[1]) / det, y1 = (a1[0] * b[1] - b[0] * a1[1]) / det;
          function P2(v) { return [O[0] + v[0] * u, O[1] - v[1] * u]; }
          for (var i = -4; i <= 10; i++) { s("line", { x1: O[0] + i * u, y1: 0, x2: O[0] + i * u, y2: 440, class: "m-grid" }, g); }
          for (var j = -3; j <= 9; j++) { s("line", { x1: 0, y1: O[1] - j * u, x2: 540, y2: O[1] - j * u, class: "m-grid" }, g); }
          s("line", { x1: 0, y1: O[1], x2: 540, y2: O[1], class: "m-axis" }, g);
          s("line", { x1: O[0], y1: 0, x2: O[0], y2: 440, class: "m-axis" }, g);
          var Z = P2([0, 0]), X1 = P2([x1 * a1[0], x1 * a1[1]]), Bp = P2(b);
          SK.arrow(g, Z[0], Z[1], X1[0], X1[1], C.orange.s, 3);
          SK.arrow(g, X1[0], X1[1], Bp[0], Bp[1], C.blue.s, 3);
          var A1 = P2(a1), A2 = P2(a2);
          SK.arrow(g, Z[0], Z[1], A1[0], A1[1], C.orange.s, 5); SK.arrow(g, Z[0], Z[1], A2[0], A2[1], C.blue.s, 5);
          s("circle", { cx: Bp[0], cy: Bp[1], r: 7, fill: C.pink.s }, g);
          SK.label(g, Bp[0] + 12, Bp[1] - 12, "b = (" + num(b[0]) + ", " + num(b[1]) + ")", { size: 13, color: C.pink.s, anchor: "start" });
          SK.label(g, (Z[0] + X1[0]) / 2, (Z[1] + X1[1]) / 2 + 18, num(x1) + " 倍", { size: 12, color: C.orange.s });
          SK.label(g, (X1[0] + Bp[0]) / 2 + 10, (X1[1] + Bp[1]) / 2, num(y1) + " 倍", { size: 12, color: C.blue.s, anchor: "start" });
          if (f === 3) read.innerHTML = SK.tex("x=" + num(x1) + ",\\ y=" + num(y1), true);
          else read.innerHTML = SK.tex("\\begin{bmatrix}x\\\\y\\end{bmatrix}=\\frac{1}{" + det + "}\\begin{bmatrix}3&-1\\\\-1&2\\end{bmatrix}\\begin{bmatrix}" + num(b[0]) + "\\\\" + num(b[1]) + "\\end{bmatrix}=\\begin{bmatrix}" + num(x1) + "\\\\" + num(y1) + "\\end{bmatrix}", true);
        }
        return { show: draw };
      }
    },

    drills: [
      { title: "克拉瑪公式：$D$、$D_x$、$D_y$ 完整算一次", code: "A-11A-1",
        demo: {
          q: "解 $\\begin{cases}2x+y=5\\\\x-y=1\\end{cases}$；再把第二式改成 $4x+2y=10$ 與 $4x+2y=11$，比較三種情形。",
          steps: [
            "$D$ 是係數行列式；$D_x$ 把 <b>$x$ 的係數那一行</b>換成常數行；$D_y$ 把 <b>$y$ 的係數那一行</b>換成常數行：$$D=\\begin{vmatrix}2&1\\\\1&-1\\end{vmatrix}=-3,\\quad D_x=\\begin{vmatrix}5&1\\\\1&-1\\end{vmatrix}=-6,\\quad D_y=\\begin{vmatrix}2&5\\\\1&1\\end{vmatrix}=-3.$$",
            "$D\\ne0$，唯一解 $x=\\dfrac{D_x}{D}=2$、$y=\\dfrac{D_y}{D}=1$。代回驗算：$2(2)+1=5$、$2-1=1$ ✓。",
            "改成 $4x+2y=10$：$D=\\begin{vmatrix}2&1\\\\4&2\\end{vmatrix}=0$，$D_x=\\begin{vmatrix}5&1\\\\10&2\\end{vmatrix}=0$，$D_y=\\begin{vmatrix}2&5\\\\4&10\\end{vmatrix}=0$。$D=0$ 不能用公式，<b>回到方程組</b>：第二式正是第一式的 $2$ 倍，兩直線重合，無限多解 $(t,\\,5-2t)$。",
            "改成 $4x+2y=11$：$D=0$，但 $D_x=\\begin{vmatrix}5&1\\\\11&2\\end{vmatrix}=-1\\ne0$。兩直線平行不重合，<b>無解</b>。",
            "整理：$D\\ne0$ ⇒ 唯一解；$D=0$ 且 $D_x,D_y$ 有一個不為 $0$ ⇒ 無解；$D=D_x=D_y=0$ ⇒ 回到方程組判斷（通常是重合、無限多解）。"
          ]
        },
        lab: function (el) {
          var st = { a: 2, b: 1, e: 5, c: 4, d: 2, f: 11 };
          var r1 = SK.h("div", { class: "row" }), r2 = SK.h("div", { class: "row" }), out = SK.h("div", { class: "readout" });
          el.insertAdjacentHTML("beforeend", '<p style="margin:0 0 4px">' + SK.md("改改看係數：第一式 $ax+by=e$、第二式 $cx+dy=f$。") + "</p>");
          [["a", r1], ["b", r1], ["e", r1], ["c", r2], ["d", r2], ["f", r2]].forEach(function (z) {
            z[1].appendChild(SK.numIn("$" + z[0] + "$", st[z[0]], function (v) { st[z[0]] = v; draw(); }));
          });
          el.appendChild(r1); el.appendChild(r2);
          var svg = SK.svg(el, 300, 300, "兩條直線的位置關係"), g = s("g", {}, svg);
          el.appendChild(out);
          function P(x, y) { return [150 + x * 22, 150 - y * 22]; }
          function line(a, b, e, col) {
            var p1, p2;
            if (Math.abs(b) > 1e-9) { p1 = P(-7, (e + 7 * a) / b); p2 = P(7, (e - 7 * a) / b); }
            else if (Math.abs(a) > 1e-9) { p1 = P(e / a, -7); p2 = P(e / a, 7); }
            else return;
            s("line", { x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1], stroke: col, "stroke-width": 2.6 }, g);
          }
          function draw() {
            var D = st.a * st.d - st.b * st.c, Dx = st.e * st.d - st.b * st.f, Dy = st.a * st.f - st.e * st.c;
            g.innerHTML = "";
            for (var i = -6; i <= 6; i++) {
              var A = P(i, -7), B = P(i, 7), E = P(-7, i), F = P(7, i);
              s("line", { x1: A[0], y1: A[1], x2: B[0], y2: B[1], class: i ? "m-grid" : "m-axis" }, g);
              s("line", { x1: E[0], y1: E[1], x2: F[0], y2: F[1], class: i ? "m-grid" : "m-axis" }, g);
            }
            line(st.a, st.b, st.e, C.orange.s); line(st.c, st.d, st.f, C.blue.s);
            var verdict;
            if (Math.abs(D) > 1e-9) {
              var X = Dx / D, Y = Dy / D, Q = P(X, Y);
              s("circle", { cx: Q[0], cy: Q[1], r: 5, fill: C.pink.s }, g);
              verdict = "D \\ne 0:\\ x=\\frac{D_x}{D}=" + SK.fmt(X, 3) + ",\\ y=\\frac{D_y}{D}=" + SK.fmt(Y, 3);
            } else if (Math.abs(Dx) > 1e-9 || Math.abs(Dy) > 1e-9) verdict = "D=0,\\ D_x\\text{ 或 }D_y\\ne0:\\ \\text{無解（平行）}";
            else verdict = "D=D_x=D_y=0:\\ \\text{回到方程組判斷}";
            out.innerHTML = SK.tex("D=" + SK.fmt(D, 3) + ",\\quad D_x=" + SK.fmt(Dx, 3) + ",\\quad D_y=" + SK.fmt(Dy, 3), true) + SK.tex(verdict, true);
          }
          draw();
        },
        tries: [
          { q: "用克拉瑪公式解 $\\begin{cases}3x-2y=4\\\\5x+4y=3\\end{cases}$。", ans: "$D=12+10=22$，$D_x=\\begin{vmatrix}4&-2\\\\3&4\\end{vmatrix}=22$，$D_y=\\begin{vmatrix}3&4\\\\5&3\\end{vmatrix}=-11$。$x=1$、$y=-\\frac12$。驗算：$3+1=4$、$5-2=3$ ✓。" },
          { q: "$k$ 為何值時，$\\begin{cases}kx+2y=4\\\\2x+ky=k+2\\end{cases}$ 無解？何時有無限多解？", hint: "先把 $D,D_x,D_y$ 都因式分解。",
            ans: "$D=k^2-4=(k-2)(k+2)$，$D_x=4k-2(k+2)=2(k-2)$，$D_y=k(k+2)-8=(k-2)(k+4)$。<br>$k=-2$：$D=0$、$D_x=-8\\ne0$，<b>無解</b>。<br>$k=2$：三者皆 $0$，回到方程組：兩式都是 $2x+2y=4$，<b>無限多解</b>。<br>其餘 $k$：唯一解。" }
        ],
        edge: "$D=0$ 時公式要除以 $0$，<b>不能用</b>。而且 $D=D_x=D_y=0$ 也<b>不保證</b>無限多解：$\\begin{cases}0x+0y=1\\\\0x+0y=2\\end{cases}$ 三個行列式都是 $0$，卻無解。所以 $D=0$ 時一律回到方程組（兩直線平行或重合）判斷。另一個常見錯：$D_x$ 換的是 $x$ 的係數<b>那一行</b>，換成第二行就整個算錯。"
      },
      { title: "矩陣運算：尺寸、係數積、加減乘、左乘與右乘", code: "A-11A-3",
        demo: {
          q: "$A=\\begin{bmatrix}1&2\\\\3&4\\end{bmatrix}$、$B=\\begin{bmatrix}0&1\\\\1&0\\end{bmatrix}$、$C=\\begin{bmatrix}1&0&2\\\\-1&3&1\\end{bmatrix}$。算 $2A-B$、$AB$、$BA$、$AC$，判斷 $CA$ 是否有定義，再分別解 $AX=B$ 與 $XA=B$。",
          steps: [
            "係數積與加減都是<b>逐元素</b>，尺寸必須相同：$2A-B=\\begin{bmatrix}2&4\\\\6&8\\end{bmatrix}-\\begin{bmatrix}0&1\\\\1&0\\end{bmatrix}=\\begin{bmatrix}2&3\\\\5&8\\end{bmatrix}$。",
            "乘法是「列 · 行」：$AB=\\begin{bmatrix}2&1\\\\4&3\\end{bmatrix}$（右乘 $B$ 交換兩<b>行</b>），$BA=\\begin{bmatrix}3&4\\\\1&2\\end{bmatrix}$（左乘 $B$ 交換兩<b>列</b>）。$AB\\ne BA$。",
            "尺寸：$(2\\times2)(2\\times3)$ 內側相同，結果 $2\\times3$：$AC=\\begin{bmatrix}-1&6&4\\\\-1&12&10\\end{bmatrix}$。$CA$ 是 $(2\\times3)(2\\times2)$，內側 $3\\ne2$，<b>沒有定義</b>。",
            "$\\det A=-2\\ne0$，$A^{-1}=\\frac1{-2}\\begin{bmatrix}4&-2\\\\-3&1\\end{bmatrix}=\\begin{bmatrix}-2&1\\\\\\frac32&-\\frac12\\end{bmatrix}$。",
            "$AX=B$：兩邊<b>左乘</b> $A^{-1}$，$X=A^{-1}B=\\begin{bmatrix}1&-2\\\\-\\frac12&\\frac32\\end{bmatrix}$。$XA=B$：兩邊<b>右乘</b> $A^{-1}$，$X=BA^{-1}=\\begin{bmatrix}\\frac32&-\\frac12\\\\-2&1\\end{bmatrix}$。兩個答案不同。"
          ]
        },
        tries: [
          { q: "$A=\\begin{bmatrix}2&1\\\\1&1\\end{bmatrix}$，解 $XA=\\begin{bmatrix}3&2\\\\1&0\\end{bmatrix}$。", ans: "$A^{-1}=\\begin{bmatrix}1&-1\\\\-1&2\\end{bmatrix}$，$X=\\begin{bmatrix}3&2\\\\1&0\\end{bmatrix}A^{-1}=\\begin{bmatrix}1&1\\\\1&-1\\end{bmatrix}$。驗算 $XA=\\begin{bmatrix}3&2\\\\1&0\\end{bmatrix}$ ✓。" },
          { q: "用上面示範的 $A,B$ 說明 $(A+B)^2\\ne A^2+2AB+B^2$。", ans: "$(A+B)^2=A^2+AB+BA+B^2$，與 $A^2+2AB+B^2$ 差 $BA-AB=\\begin{bmatrix}1&3\\\\-3&-1\\end{bmatrix}\\ne O$。乘法不交換，乘法公式就不能照搬。" }
        ],
        edge: "矩陣乘法<b>沒有交換律</b>，解方程時要分清楚左右：$AX=B$ 左乘 $A^{-1}$，$XA=B$ 右乘 $A^{-1}$；寫成 $\\frac BA$ 沒有意義。$A^{-1}$ 存在的條件是 $\\det A\\ne0$。加減要尺寸完全相同；乘法要「左邊的行數＝右邊的列數」。"
      }
    ],

    angles: [
      { title: "電腦的試算表就是矩陣", icon: "sparkle",
        html: "試算表裡的 <span class=\"code\">SUMPRODUCT</span>、<span class=\"code\">MMULT</span> 函數，做的就是列與行的對應相乘相加。成績單的加權平均（各科分數 × 學分數）、購物車結帳（數量 × 單價）、營養計算（份量 × 每份熱量），都是一次矩陣乘向量。" },
      { title: "矩陣乘法不能交換", icon: "leaf",
        html: "$AP$ 是「杯數表 × 價格表」，意思清楚；$PA$ 可能根本不能乘（大小對不上），就算能乘，意義也完全不同。一般來說 $AB\\ne BA$。矩陣乘法的順序，就是「先做什麼、再做什麼」的順序。" }
    ],

    challenges: [
      { q: "計算 $\\begin{bmatrix}1&2\\\\3&4\\end{bmatrix}\\begin{bmatrix}0&1\\\\1&0\\end{bmatrix}$ 和 $\\begin{bmatrix}0&1\\\\1&0\\end{bmatrix}\\begin{bmatrix}1&2\\\\3&4\\end{bmatrix}$。", idea: "前者 $\\begin{bmatrix}2&1\\\\4&3\\end{bmatrix}$（兩行交換），後者 $\\begin{bmatrix}3&4\\\\1&2\\end{bmatrix}$（兩列交換）。順序不同，結果不同。" },
      { q: "求 $\\begin{bmatrix}3&1\\\\5&2\\end{bmatrix}$ 的反方陣，並驗算。", idea: "$\\det=6-5=1$，$A^{-1}=\\begin{bmatrix}2&-1\\\\-5&3\\end{bmatrix}$。驗算 $AA^{-1}=\\begin{bmatrix}6-5&-3+3\\\\10-10&-5+6\\end{bmatrix}=I$。" },
      { q: "$\\begin{bmatrix}2&4\\\\1&2\\end{bmatrix}\\begin{bmatrix}x\\\\y\\end{bmatrix}=\\begin{bmatrix}6\\\\3\\end{bmatrix}$ 有幾組解？換成右邊是 $\\begin{bmatrix}6\\\\4\\end{bmatrix}$ 呢？", idea: "$\\det=0$，兩行 $(2,1)$、$(4,2)$ 平行。$(6,3)$ 在同一條線上，有無限多解（例如 $x=3,y=0$；$x=1,y=1$）；$(6,4)$ 不在那條線上，無解。" }
    ],

    where: {
      codes: [["A-11B-1", "矩陣與資料表格：矩陣乘向量（線性組合）、二元一次方程組的矩陣意涵、矩陣的加減與乘法、二階反方陣；以電腦處理資料表"], ["A-11A-1", "二元一次方程組的矩陣表達：方陣乘向量的線性組合、解的情形（唯一、無限多、無解）；克拉瑪公式見「行列式與面積」"]],
      exam: "11 年級<b>數學 B</b> 的核心單元；<b>數學 A</b> 的二元一次方程組矩陣表達也用同樣的想法。",
      stop: "筆算以二階為主，三階以上交給電腦。不討論矩陣的秩、一般 $n$ 階反方陣的求法或矩陣的代數結構。"
    }
  });
})();
