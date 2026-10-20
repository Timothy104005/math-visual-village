/* 單元：直線與圓 */
(function () {
  var C = SK.C, s = SK.s;

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 250, "一條直線和圓的三種關係");
    [[80, "相交"], [200, "相切"], [320, "不相交"]].forEach(function (p, i) {
      s("circle", { cx: p[0], cy: 110, r: 48, fill: C.gold.f, stroke: C.cocoa, "stroke-width": 1.4 }, svg);
      var y = 110 - [20, 48, 70][i];
      s("line", { x1: p[0] - 60, y1: y, x2: p[0] + 60, y2: y, stroke: C.blue.s, "stroke-width": 2.4 }, svg);
      SK.label(svg, p[0], 190, p[1], { size: 14 });
      SK.label(svg, p[0], 214, ["2 個交點", "1 個交點", "0 個交點"][i], { size: 12, color: C.soft });
    });
  }

  SK.mountUnit({
    slug: "line-circle",
    en: "Compare the distance with the radius",
    formula: "\\cp d<\\cg r\\iff \\text{兩交點},\\quad \\cp d=\\cg r\\iff \\text{相切},\\quad \\cp d>\\cg r\\iff \\text{不相交}",

    hook: {
      html: "一條直線和一個圓，可能穿過去（兩個交點）、剛好擦過（一個交點）、或完全碰不到。",
      ask: "不畫圖，只看方程式，怎麼知道是哪一種？",
      visual: hookVisual
    },

    guess: {
      q: "圓 $x^2+y^2=25$ 和直線 $3x+4y=20$ 的關係是？",
      options: [
        { t: "交於兩點", truth: true, explain: "圓心 $(0,0)$ 到直線的距離 $d=\\tfrac{|0+0-20|}{\\sqrt{9+16}}=4$，比半徑 5 小，所以直線穿過圓，有兩個交點。" },
        { t: "相切", common: true, explain: "$20$ 和 $25$ 看起來很有關係，或者猜 $3,4,5$ 會剛好相切！但要比的是距離 4 和半徑 5。相切的是 $3x+4y=25$。" },
        { t: "不相交", explain: "直線離圓心只有 4，比半徑 5 近，所以一定會穿過圓。" },
        { t: "要解聯立才知道", explain: "解聯立當然可以（看判別式），但用「距離和半徑比大小」快得多。等一下會看到兩種方法說的是同一件事。" }
      ]
    },

    derive: {
      intro: "拖動滑桿改直線 $y=mx+c$，看圓心到直線的距離 $d$ 和半徑 $r$ 誰大。",
      tall: true,
      frames: [
        { cap: "從圓心做直線的垂線，垂線長 $d$ 是圓心到直線的<b>最短</b>距離。$d<r$：垂足在圓內，直線穿過圓；$d=r$：剛好碰到一點；$d>r$：碰不到。", tex: "d=\\frac{|ah+bk+c|}{\\sqrt{a^2+b^2}}\\quad\\text{和}\\quad r\\ \\text{比大小}" },
        { cap: "代數的方法：把直線代入圓，得到 $x$ 的一元二次方程式。交點個數 = 實根個數，由<b>判別式</b> $D$ 決定。兩種方法永遠一致：$D>0\\iff d<r$。", tex: "\\begin{aligned}D>0&\\iff d<r\\\\D=0&\\iff d=r\\\\D<0&\\iff d>r\\end{aligned}" },
        { cap: "<b>切線</b>：在切點 $T$，半徑和切線<b>垂直</b>。所以過圓上一點 $T(x_0,y_0)$ 的切線，法向量就是 $\\overrightarrow{O'T}$。", tex: "(x_0-h)(x-h)+(y_0-k)(y-k)=r^2" },
        { cap: "給定斜率 $m$ 的切線：和圓心距離剛好等於 $r$ 的兩條平行線，一邊一條。", tex: "\\begin{gathered}\\frac{|mh-k+c|}{\\sqrt{m^2+1}}=r\\\\ \\Rightarrow\\ c=k-mh\\pm r\\sqrt{m^2+1}\\end{gathered}" },
        { cap: "直線穿過圓時，截出的<b>弦長</b>：垂足平分弦，半弦、$d$、$r$ 構成直角三角形。", tex: "\\text{弦長}=2\\sqrt{r^2-d^2}" }
      ],
      hint: "拖動 m、c 滑桿；第 3 步拖動圓上的切點 T。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 540, 440, "直線與圓");
        var gridG = s("g", {}, svg), g = s("g", {}, svg), hg = s("g", {}, svg);
        var O = [250, 230], u = 32, st = { m: -.5, c: 3, h: 1, k: 0, r: 3, t: 1 };
        function P(v) { return [O[0] + v[0] * u, O[1] - v[1] * u]; }
        var xmin = -O[0] / u, xmax = (540 - O[0]) / u;
        for (var i = -8; i <= 9; i++) s("line", { x1: O[0] + i * u, y1: 0, x2: O[0] + i * u, y2: 440, class: "m-grid" }, gridG);
        for (var j = -7; j <= 8; j++) s("line", { x1: 0, y1: O[1] - j * u, x2: 540, y2: O[1] - j * u, class: "m-grid" }, gridG);
        s("line", { x1: 0, y1: O[1], x2: 540, y2: O[1], class: "m-axis" }, gridG);
        s("line", { x1: O[0], y1: 0, x2: O[0], y2: 440, class: "m-axis" }, gridG);
        var read = SK.h("div", { class: "readout" });
        var slM = SK.slider({ label: "斜率 $m$", min: -3, max: 3, step: .1, value: st.m, onInput: function (v) { st.m = v; draw(); } });
        var slC = SK.slider({ label: "截距 $c$", min: -7, max: 7, step: .1, value: st.c, color: "blue", onInput: function (v) { st.c = v; draw(); } });
        ctx.sliders.appendChild(slM.el); ctx.sliders.appendChild(slC.el);
        ctx.extra.appendChild(read);
        var hT = SK.handle(hg, 0, 0, C.orange.s, "切點 T");
        SK.drag(svg, hT, function (x, y) { var c = P([st.h, st.k]); st.t = Math.atan2(c[1] - y, x - c[0]); draw(); }, function () { return P([st.h + st.r * Math.cos(st.t), st.k + st.r * Math.sin(st.t)]); }, 8);
        function num(v) { return SK.fmt(v, 2).replace("−", "-"); }
        function yLine(m, c, attrs) { var a = P([xmin, m * xmin + c]), b = P([xmax, m * xmax + c]); s("line", Object.assign({ x1: a[0], y1: a[1], x2: b[0], y2: b[1] }, attrs), g); }
        function draw() {
          var f = ctx.frame, m = st.m, c = st.c, h = st.h, k = st.k, r = st.r;
          g.innerHTML = "";
          slM.el.style.display = f === 2 ? "none" : "";
          slC.el.style.display = f === 2 || f === 3 ? "none" : "";
          hT.style.display = f === 2 ? "" : "none";
          var Cc = P([h, k]);
          s("circle", { cx: Cc[0], cy: Cc[1], r: r * u, fill: "rgba(241,226,184,.5)", stroke: C.ink, "stroke-width": 2.2 }, g);
          s("circle", { cx: Cc[0], cy: Cc[1], r: 4.5, fill: C.cocoa }, g);
          if (f === 2) {
            var T = [h + r * Math.cos(st.t), k + r * Math.sin(st.t)], Tp = P(T), dir = [-Math.sin(st.t), Math.cos(st.t)];
            var a1 = P([T[0] - 12 * dir[0], T[1] - 12 * dir[1]]), a2 = P([T[0] + 12 * dir[0], T[1] + 12 * dir[1]]);
            s("line", { x1: a1[0], y1: a1[1], x2: a2[0], y2: a2[1], stroke: C.blue.s, "stroke-width": 2.6 }, g);
            s("line", { x1: Cc[0], y1: Cc[1], x2: Tp[0], y2: Tp[1], stroke: C.green.s, "stroke-width": 3 }, g);
            SK.rightMark(g, Tp[0], Tp[1], -Math.cos(st.t), Math.sin(st.t), dir[0], -dir[1], 11, C.pink.s);
            hT.moveTo(Tp[0], Tp[1]);
            read.innerHTML = SK.tex("(" + num(T[0] - h) + ")(x" + (h ? "-" + num(h) : "") + ")+(" + num(T[1] - k) + ")(y" + (k ? "-" + num(k) : "") + ")=" + num(r * r), true);
            return;
          }
          var cs = f === 3 ? [k - m * h + r * Math.sqrt(m * m + 1), k - m * h - r * Math.sqrt(m * m + 1)] : [c];
          cs.forEach(function (cc) {
            var d = Math.abs(m * h - k + cc) / Math.sqrt(m * m + 1);
            var rel = Math.abs(d - r) < .02 ? 0 : d < r ? 1 : -1;
            yLine(m, cc, { stroke: rel === 1 ? C.blue.s : rel === 0 ? C.orange.s : C.pink.s, "stroke-width": 2.6 });
            // 垂足
            var t = (m * h - k + cc) / (m * m + 1), F = [h - m * t, k + t], Fp = P(F);
            s("line", { x1: Cc[0], y1: Cc[1], x2: Fp[0], y2: Fp[1], stroke: C.pink.s, "stroke-width": 2, "stroke-dasharray": "5 4" }, g);
            s("circle", { cx: Fp[0], cy: Fp[1], r: 4, fill: C.pink.s }, g);
            SK.label(g, (Cc[0] + Fp[0]) / 2 + 10, (Cc[1] + Fp[1]) / 2 - 6, "d", { it: true, color: C.pink.s, anchor: "start" });
            if (d < r) {
              var half = Math.sqrt(r * r - d * d), ux = 1 / Math.sqrt(m * m + 1), uy = m / Math.sqrt(m * m + 1);
              [1, -1].forEach(function (sg) { var X = P([F[0] + sg * half * ux, F[1] + sg * half * uy]); s("circle", { cx: X[0], cy: X[1], r: 6, fill: C.blue.s, stroke: C.paper, "stroke-width": 1.5 }, g); });
              if (f === 4) {
                var X1 = P([F[0] + half * ux, F[1] + half * uy]);
                s("line", { x1: Fp[0], y1: Fp[1], x2: X1[0], y2: X1[1], stroke: C.purple.s, "stroke-width": 4 }, g);
                s("line", { x1: Cc[0], y1: Cc[1], x2: X1[0], y2: X1[1], stroke: C.green.s, "stroke-width": 2.4 }, g);
                SK.label(g, (Fp[0] + X1[0]) / 2, (Fp[1] + X1[1]) / 2 - 14, "半弦", { size: 12, color: C.purple.s });
              }
            } else if (rel === 0) s("circle", { cx: Fp[0], cy: Fp[1], r: 7, fill: C.orange.s, stroke: C.paper, "stroke-width": 1.5 }, g);
          });
          var d0 = Math.abs(m * h - k + c) / Math.sqrt(m * m + 1);
          // 代入：x^2 + (mx+c)^2 − 2hx − 2k(mx+c) + h^2 + k^2 − r^2 = 0
          var A = 1 + m * m, B = 2 * m * c - 2 * h - 2 * k * m, Cq = c * c - 2 * k * c + h * h + k * k - r * r, D = B * B - 4 * A * Cq;
          var lines = [];
          if (f === 3) lines.push("c=" + num(cs[0]) + "\\ \\text{或}\\ " + num(cs[1]));
          else {
            lines.push("d=" + num(d0) + (Math.abs(d0 - r) < .02 ? "=" : d0 < r ? "<" : ">") + "r=" + r);
            if (f >= 1) lines.push(num(A) + "x^2" + (B >= 0 ? "+" : "") + num(B) + "x" + (Cq >= 0 ? "+" : "") + num(Cq) + "=0,\\ \\ D=" + num(D));
            if (f === 4 && d0 < r) lines.push("\\text{弦長}=2\\sqrt{" + r * r + "-" + num(d0 * d0) + "}=" + num(2 * Math.sqrt(r * r - d0 * d0)));
          }
          read.innerHTML = lines.map(function (t) { return SK.tex(t, true); }).join("") + (f <= 1 ? '<p style="margin:4px 0 0">' + (Math.abs(d0 - r) < .02 ? "相切：1 個交點" : d0 < r ? "相交：2 個交點" : "不相交：0 個交點") + "</p>" : "");
        }
        return { show: draw };
      }
    },

    drills: [
      { title: "圓外一點的兩條切線（別漏掉鉛直線）", code: "G-10-4",
        demo: {
          q: "求過點 $P(2,3)$ 且與圓 $x^2+y^2=4$ 相切的直線。",
          steps: [
            "先判斷位置：$2^2+3^2=13>4$，$P$ 在圓外，應有<b>兩條</b>切線。",
            "設斜率 $m$：$y-3=m(x-2)$，即 $mx-y+(3-2m)=0$。",
            "相切 $\\iff$ 圓心到直線的距離等於半徑：$\\dfrac{|3-2m|}{\\sqrt{m^2+1}}=2$。平方：$9-12m+4m^2=4m^2+4$，$m^2$ 消掉，只剩 $m=\\frac5{12}$。",
            "只解出<b>一個</b> $m$，另一條去哪了？設「$y-3=m(x-2)$」時已經排除了斜率不存在的直線。檢查 $x=2$：圓心到它的距離是 $2$，正好相切 ✓。",
            "答：$5x-12y+26=0$ 與 $x=2$。切點分別是 $\\left(-\\frac{10}{13},\\frac{24}{13}\\right)$ 與 $(2,0)$；切線長 $\\sqrt{13-4}=3$。"
          ]
        },
        lab: function (el) {
          var st = { x: 2, y: 3, r: 2 };
          var row = SK.h("div", { class: "row" }), out = SK.h("div", { class: "readout" });
          row.appendChild(SK.numIn("$P$ 的 $x$", st.x, function (v) { st.x = v; draw(); }, .5));
          row.appendChild(SK.numIn("$P$ 的 $y$", st.y, function (v) { st.y = v; draw(); }, .5));
          row.appendChild(SK.numIn("半徑 $r$", st.r, function (v) { st.r = v; draw(); }, .5));
          el.appendChild(row);
          var svg = SK.svg(el, 300, 300, "過圓外一點的切線"), g = s("g", {}, svg);
          el.appendChild(out);
          var u = 24;
          function P(x, y) { return [150 + x * u, 150 - y * u]; }
          function lineThrough(A, B, col) {
            var dx = B[0] - A[0], dy = B[1] - A[1], L = Math.hypot(dx, dy); dx /= L; dy /= L;
            var p1 = P(A[0] - dx * 20, A[1] - dy * 20), p2 = P(A[0] + dx * 20, A[1] + dy * 20);
            s("line", { x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1], stroke: col, "stroke-width": 2.4 }, g);
          }
          function sg(v) { return v < 0 ? "+" + SK.fmt(-v, 2) : "-" + SK.fmt(v, 2); }
          function eq(A, T) {
            if (Math.abs(T[0] - A[0]) < 1e-7) return "x=" + SK.fmt(A[0], 3) + "\\ \\text{（鉛直，斜率不存在）}";
            var m = (T[1] - A[1]) / (T[0] - A[0]);
            return "y" + sg(A[1]) + "=" + SK.fmt(m, 4) + "(x" + sg(A[0]) + ")";
          }
          function draw() {
            g.innerHTML = "";
            var x0 = st.x, y0 = st.y, r = Math.abs(st.r), d = Math.hypot(x0, y0);
            s("line", { x1: 0, y1: 150, x2: 300, y2: 150, class: "m-axis" }, g);
            s("line", { x1: 150, y1: 0, x2: 150, y2: 300, class: "m-axis" }, g);
            s("circle", { cx: 150, cy: 150, r: r * u, fill: C.blue.f, stroke: C.blue.s, "stroke-width": 2 }, g);
            var Pp = P(x0, y0);
            s("circle", { cx: Pp[0], cy: Pp[1], r: 5, fill: C.pink.s }, g);
            if (d < r - 1e-9) { out.innerHTML = '<p style="margin:0">' + SK.md("$P$ 在圓<b>內</b>：沒有切線。") + "</p>"; return; }
            if (Math.abs(d - r) < 1e-9) {
              lineThrough([x0, y0], [x0 - y0, y0 + x0], C.orange.s);
              out.innerHTML = '<p style="margin:0">' + SK.md("$P$ 在圓<b>上</b>：只有一條切線 $(" + SK.fmt(x0, 2) + ")x+(" + SK.fmt(y0, 2) + ")y=" + SK.fmt(r * r, 2) + "$。") + "</p>";
              return;
            }
            var al = Math.atan2(y0, x0), be = Math.acos(r / d), lines = [];
            [al + be, al - be].forEach(function (a, i) {
              var T = [r * Math.cos(a), r * Math.sin(a)], Tp = P(T[0], T[1]);
              lineThrough([x0, y0], T, i ? C.green.s : C.orange.s);
              s("circle", { cx: Tp[0], cy: Tp[1], r: 4, fill: C.cocoa }, g);
              lines.push(SK.tex(eq([x0, y0], T), true));
            });
            out.innerHTML = lines.join("") + SK.tex("\\text{切線長}=\\sqrt{" + SK.fmt(x0 * x0 + y0 * y0, 2) + "-" + SK.fmt(r * r, 2) + "}=" + SK.fmt(Math.sqrt(d * d - r * r), 3), true);
          }
          draw();
        },
        tries: [
          { q: "求過 $(4,2)$ 且與圓 $(x-1)^2+(y+2)^2=9$ 相切的直線。", ans: "圓心 $(1,-2)$、半徑 $3$，點到圓心距離 $5>3$。設 $y-2=m(x-4)$：$\\frac{|4-3m|}{\\sqrt{m^2+1}}=3\\Rightarrow m=\\frac7{24}$，得 $7x-24y+20=0$。另一條是鉛直線 $x=4$（圓心到它的距離 $3$）。" },
          { q: "求圓 $x^2+y^2=4$ 在其上一點 $(1,\\sqrt3)$ 的切線。", ans: "圓上點 $(x_0,y_0)$ 的切線是 $x_0x+y_0y=r^2$：$x+\\sqrt3y=4$。" }
        ],
        edge: "設 $y-y_0=m(x-x_0)$ 的那一刻，就默默排除了鉛直線。圓外一點卻只解出一個 $m$（或 $m^2$ 項整個消失），就是另一條切線是鉛直線的訊號，要補上 $x=x_0$ 檢查。點在圓上只有一條切線，在圓內沒有切線。"
      }
    ],

    angles: [
      { title: "為什麼 d 和 D 一定一致", icon: "sparkle",
        html: "把坐標轉一轉、移一移，讓圓心在原點、直線變成水平線 $y=d$。代入 $x^2+y^2=r^2$ 得 $x^2=r^2-d^2$：右邊是正、零、負，正好對應兩根、一根、無實根。轉動和平移不改變交點個數，所以一般情形也一樣。" },
      { title: "切線長", icon: "leaf",
        html: "從圓外一點 $P$ 拉一條切線到切點 $T$。因為 $\\overline{O'T}\\perp\\overline{PT}$，所以 $\\overline{PT}^2=\\overline{PO'}^2-r^2$。這正好是把 $P$ 代進圓的方程式左邊（標準式移項後）得到的值。" }
    ],

    challenges: [
      { q: "求過圓 $x^2+y^2=25$ 上一點 $(3,4)$ 的切線方程式。", idea: "$3x+4y=25$。半徑方向 $(3,4)$ 就是切線的法向量。" },
      { q: "直線 $y=x+c$ 和圓 $x^2+y^2=8$ 相切，求 $c$。", idea: "$\\tfrac{|c|}{\\sqrt2}=2\\sqrt2$，所以 $c=\\pm4$。" },
      { q: "圓 $(x-1)^2+(y-2)^2=10$ 被直線 $x+3y=2$ 截出的弦長是多少？", idea: "$d=\\tfrac{|1+6-2|}{\\sqrt{10}}=\\tfrac{5}{\\sqrt{10}}$，$d^2=2.5$，弦長 $2\\sqrt{10-2.5}=2\\sqrt{7.5}=\\sqrt{30}$。" }
    ],

    where: {
      codes: [["G-10-4", "直線與圓：圓的切線、直線與圓的位置關係（幾何判別與代數判別）"]],
      exam: "10 年級<b>共同必修</b>，學測數 A、數 B 都考。",
      stop: "直線與圓的關係、切線、弦長就夠了。課綱明定<b>不含兩圓的位置關係</b>，也不處理圓系或極線。"
    }
  });
})();
