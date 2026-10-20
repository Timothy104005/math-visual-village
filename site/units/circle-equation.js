/* 單元：圓方程式 */
(function () {
  var C = SK.C, s = SK.s;

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 250, "用一條繩子畫圓");
    s("circle", { cx: 200, cy: 125, r: 90, fill: C.gold.f, stroke: C.cocoa, "stroke-width": 1.4, "stroke-dasharray": "6 5" }, svg);
    s("line", { x1: 200, y1: 125, x2: 200 + 90 * Math.cos(.6), y2: 125 - 90 * Math.sin(.6), stroke: C.orange.s, "stroke-width": 3 }, svg);
    s("circle", { cx: 200, cy: 125, r: 5, fill: C.cocoa }, svg);
    s("circle", { cx: 200 + 90 * Math.cos(.6), cy: 125 - 90 * Math.sin(.6), r: 6, fill: C.orange.s }, svg);
    SK.label(svg, 238, 110, "繩長 r", { size: 13, color: C.orange.s });
    SK.label(svg, 200, 238, "圓上每一點到圓心都一樣遠，怎麼寫成方程式？", { size: 13, color: C.soft });
  }

  SK.mountUnit({
    slug: "circle-equation",
    en: "The Pythagorean theorem, walked around a circle",
    formula: "(x-\\co h)^2+(y-\\cb k)^2=\\cg r^2",

    hook: {
      html: "釘一根釘子、綁一條長 $r$ 的繩子，拉緊繞一圈，就畫出一個圓。圓上每一點到圓心的距離都是 $r$。",
      ask: "「到圓心距離是 $r$」要怎麼寫成 $x$、$y$ 的方程式？",
      visual: hookVisual
    },

    guess: {
      q: "$x^2+y^2-6x+4y=3$ 的圖形是什麼？",
      options: [
        { t: "圓心 $(3,-2)$、半徑 4 的圓", truth: true, explain: "配方：$(x^2-6x+9)+(y^2+4y+4)=3+9+4$，得 $(x-3)^2+(y+2)^2=16$。圓心 $(3,-2)$、半徑 $\\sqrt{16}=4$。" },
        { t: "圓心 $(-6,4)$、半徑 $\\sqrt3$ 的圓", common: true, explain: "直接從係數讀圓心是很自然的猜測！但 $-6x$ 來自 $(x-3)^2$ 展開的 $-2\\cdot3x$，所以圓心坐標是係數的 $-\\tfrac12$；半徑也要把配方補的數加進去。" },
        { t: "圓心 $(3,-2)$、半徑 $\\sqrt3$ 的圓", explain: "圓心對了！但配方時左邊加了 $9$ 和 $4$，右邊也要加，所以 $r^2=3+9+4=16$。" },
        { t: "不是圓", explain: "$x^2$、$y^2$ 係數相同、沒有 $xy$ 項，配方後只要右邊是正數就是圓。這題右邊是 16。" }
      ]
    },

    derive: {
      intro: "拖動滑桿改圓心 $(h,k)$ 和半徑 $r$；拖動圓上的點 $T$，看它和圓心構成的直角三角形。",
      tall: true,
      frames: [
        { cap: "點 $T(x,y)$ 到圓心 $O'(h,k)$：水平差 $x-h$、垂直差 $y-k$，斜邊就是距離。這是<b>畢氏定理</b>，也就是兩點距離公式。", tex: "\\overline{O'T}=\\sqrt{(\\co{x-h})^2+(\\cb{y-k})^2}" },
        { cap: "「$T$ 在圓上」就是「距離等於 $r$」。兩邊平方，得到圓的<b>標準式</b>。不管 $T$ 轉到哪裡，三角形的兩股會變，斜邊永遠是 $r$。", tex: "(x-\\co h)^2+(y-\\cb k)^2=\\cg r^2" },
        { cap: "把標準式展開，整理成<b>一般式</b>：$x^2$ 和 $y^2$ 的係數都是 1、沒有 $xy$ 項。", tex: "\\begin{gathered}x^2+y^2+dx+ey+f=0\\\\d=-2h,\\ \\ e=-2k,\\ \\ f=h^2+k^2-r^2\\end{gathered}" },
        { cap: "反過來，拿到一般式就<b>配方</b>找圓心和半徑。右邊若是正數才是圓；等於 0 只剩一個點；負數則沒有任何點。", tex: "\\left(x+\\tfrac d2\\right)^2+\\left(y+\\tfrac e2\\right)^2=\\frac{d^2+e^2-4f}{4}" },
        { cap: "點 $Q$ 在圓內、圓上還是圓外？把它代進左邊，和 $r^2$ 比大小，也就是比「$Q$ 到圓心的距離」和「$r$」。", tex: "(x_0-h)^2+(y_0-k)^2\\ \\lesseqgtr\\ r^2" }
      ],
      hint: "拖動圓上的 T；第 5 步拖動 Q。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 540, 440, "圓與圓上一點的直角三角形");
        var gridG = s("g", {}, svg), g = s("g", {}, svg), hg = s("g", {}, svg);
        var O = [230, 250], u = 30, st = { h: 2, k: 1, r: 4, t: .8, Q: [-2, 5] };
        function P(v) { return [O[0] + v[0] * u, O[1] - v[1] * u]; }
        for (var i = -7; i <= 10; i++) s("line", { x1: O[0] + i * u, y1: 0, x2: O[0] + i * u, y2: 440, class: "m-grid" }, gridG);
        for (var j = -6; j <= 8; j++) s("line", { x1: 0, y1: O[1] - j * u, x2: 540, y2: O[1] - j * u, class: "m-grid" }, gridG);
        s("line", { x1: 0, y1: O[1], x2: 540, y2: O[1], class: "m-axis" }, gridG);
        s("line", { x1: O[0], y1: 0, x2: O[0], y2: 440, class: "m-axis" }, gridG);
        var read = SK.h("div", { class: "readout" });
        [["h", "圓心 $h$", -3, 5, ""], ["k", "圓心 $k$", -3, 4, "blue"], ["r", "半徑 $r$", 1, 5, "green"]].forEach(function (p) {
          ctx.sliders.appendChild(SK.slider({ label: p[1], min: p[2], max: p[3], step: .5, value: st[p[0]], color: p[4], onInput: function (v) { st[p[0]] = v; draw(); } }).el);
        });
        ctx.extra.appendChild(read);
        var hT = SK.handle(hg, 0, 0, C.orange.s, "圓上的點 T"), hQ = SK.handle(hg, 0, 0, C.purple.s, "點 Q");
        SK.drag(svg, hT, function (x, y) { var c = P([st.h, st.k]); st.t = Math.atan2(c[1] - y, x - c[0]); draw(); }, function () { return P([st.h + st.r * Math.cos(st.t), st.k + st.r * Math.sin(st.t)]); }, 8);
        SK.drag(svg, hQ, function (x, y) { st.Q = [SK.clamp(Math.round((x - O[0]) / u * 2) / 2, -7, 10), SK.clamp(Math.round((O[1] - y) / u * 2) / 2, -6, 8)]; draw(); }, function () { return P(st.Q); }, u / 2);
        function num(v) { return SK.fmt(v, 2).replace("−", "-"); }
        function sq(name, c) { return Math.abs(c) < 1e-9 ? name + "^2" : "(" + name + (c > 0 ? "-" + num(c) : "+" + num(-c)) + ")^2"; }
        function draw() {
          var f = ctx.frame, h = st.h, k = st.k, r = st.r;
          g.innerHTML = "";
          var Cc = P([h, k]);
          s("circle", { cx: Cc[0], cy: Cc[1], r: r * u, fill: f === 4 ? C.gold.f : "rgba(241,226,184,.35)", stroke: C.ink, "stroke-width": 2.4 }, g);
          s("circle", { cx: Cc[0], cy: Cc[1], r: 4.5, fill: C.cocoa }, g);
          SK.label(g, Cc[0] - 10, Cc[1] + 16, "(" + SK.fmt(h, 1) + ", " + SK.fmt(k, 1) + ")", { size: 12, anchor: "end" });
          var T = [h + r * Math.cos(st.t), k + r * Math.sin(st.t)], Tp = P(T), Kp = P([T[0], k]);
          hT.style.display = f === 4 ? "none" : "";
          hQ.style.display = f === 4 ? "" : "none";
          if (f <= 1) {
            s("line", { x1: Cc[0], y1: Cc[1], x2: Kp[0], y2: Kp[1], stroke: C.orange.s, "stroke-width": 3 }, g);
            s("line", { x1: Kp[0], y1: Kp[1], x2: Tp[0], y2: Tp[1], stroke: C.blue.s, "stroke-width": 3 }, g);
            s("line", { x1: Cc[0], y1: Cc[1], x2: Tp[0], y2: Tp[1], stroke: C.green.s, "stroke-width": 3 }, g);
            if (Math.abs(Kp[0] - Cc[0]) > 14 && Math.abs(Kp[1] - Tp[1]) > 14) SK.rightMark(g, Kp[0], Kp[1], Math.sign(Cc[0] - Kp[0]), 0, 0, Math.sign(Tp[1] - Kp[1]), 10);
            SK.label(g, (Cc[0] + Kp[0]) / 2, Kp[1] + (T[1] >= k ? 16 : -16), "x − h = " + SK.fmt(T[0] - h, 2), { size: 12, color: C.orange.s });
            SK.label(g, Kp[0] + (T[0] >= h ? 8 : -8), (Kp[1] + Tp[1]) / 2, "y − k = " + SK.fmt(T[1] - k, 2), { size: 12, color: C.blue.s, anchor: T[0] >= h ? "start" : "end" });
            SK.label(g, (Cc[0] + Tp[0]) / 2 - 12, (Cc[1] + Tp[1]) / 2 - 10, "r", { it: true, color: C.green.s });
          }
          hT.moveTo(Tp[0], Tp[1]);
          var d = -2 * h, e = -2 * k, ff = h * h + k * k - r * r;
          var lines = [];
          if (f <= 1) lines.push("(" + num(T[0] - h) + ")^2+(" + num(T[1] - k) + ")^2=" + num((T[0] - h) * (T[0] - h) + (T[1] - k) * (T[1] - k)) + "=" + num(r) + "^2");
          if (f >= 1) lines.push(sq("x", h) + "+" + sq("y", k) + "=" + num(r * r));
          if (f >= 2 && f <= 3) {
            var gen = "x^2+y^2" + [[d, "x"], [e, "y"], [ff, ""]].map(function (p) { return Math.abs(p[0]) < 1e-9 ? "" : (p[0] > 0 ? "+" : "-") + num(Math.abs(p[0])) + p[1]; }).join("") + "=0";
            lines.push(gen);
          }
          if (f === 3) lines.push("d^2+e^2-4f=" + num(d * d + e * e - 4 * ff) + "=4r^2");
          if (f === 4) {
            var Q = st.Q, Qp = P(Q), v = (Q[0] - h) * (Q[0] - h) + (Q[1] - k) * (Q[1] - k), dist = Math.sqrt(v);
            s("line", { x1: Cc[0], y1: Cc[1], x2: Qp[0], y2: Qp[1], stroke: C.purple.s, "stroke-width": 2, "stroke-dasharray": "5 4" }, g);
            SK.label(g, Qp[0] + 12, Qp[1] - 14, "Q", { it: true, color: C.purple.s });
            hQ.moveTo(Qp[0], Qp[1]);
            var rel = Math.abs(v - r * r) < 1e-9 ? "=" : v < r * r ? "<" : ">";
            lines.push("(" + num(Q[0]) + (h >= 0 ? "-" : "+") + num(Math.abs(h)) + ")^2+(" + num(Q[1]) + (k >= 0 ? "-" : "+") + num(Math.abs(k)) + ")^2=" + num(v) + rel + num(r * r));
            read.innerHTML = lines.map(function (t) { return SK.tex(t, true); }).join("") + '<p style="margin:4px 0 0">Q 在圓<b>' + (rel === "=" ? "上" : rel === "<" ? "內" : "外") + "</b>（到圓心距離 " + SK.fmt(dist, 2) + "）</p>";
            return;
          }
          read.innerHTML = lines.map(function (t) { return SK.tex(t, true); }).join("");
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "單位圓是最簡單的圓", icon: "sparkle",
        html: "圓心在原點、半徑 1：$x^2+y^2=1$。圓上的點可以寫成 $(\\cos\\theta,\\sin\\theta)$，代進去就是 $\\cos^2\\theta+\\sin^2\\theta=1$。三角比那一單元的平方關係，說的正是「這個點在單位圓上」。" },
      { title: "三點決定一個圓", icon: "leaf",
        html: "一般式有 $d,e,f$ 三個未知數，所以給三個不共線的點，就能列出三個方程式解出圓。幾何上，圓心是三點連成的三角形的<b>外心</b>：兩條中垂線的交點，到三點一樣遠。" }
    ],

    challenges: [
      { q: "以 $A(1,2)$、$B(5,-4)$ 為直徑兩端的圓，方程式是什麼？", idea: "圓心是中點 $(3,-1)$，半徑是 $\\tfrac12\\overline{AB}=\\tfrac12\\sqrt{16+36}=\\sqrt{13}$：$(x-3)^2+(y+1)^2=13$。" },
      { q: "$x^2+y^2+4x-2y+k=0$ 是一個圓，$k$ 的範圍是什麼？", idea: "配方：$(x+2)^2+(y-1)^2=5-k$，需要 $5-k>0$，所以 $k<5$。" },
      { q: "圓 $x^2+y^2=25$ 上有幾個格子點（兩坐標都是整數）？", hint: "$25=0^2+5^2=3^2+4^2$。", idea: "$(\\pm5,0)$、$(0,\\pm5)$ 有 4 個，$(\\pm3,\\pm4)$、$(\\pm4,\\pm3)$ 有 8 個，共 12 個。" }
    ],

    where: {
      codes: [["G-10-3", "圓方程式：圓的標準式（含由一般式配方求圓心與半徑）"]],
      exam: "10 年級<b>共同必修</b>，學測數 A、數 B 都考。",

      past: [] /* Examination text excluded; see docs/PROVENANCE.md. */,
      stop: "標準式、配方、點與圓的位置就夠了。直線與圓的關係在下一個單元；兩圓的位置關係不在課綱內。"
    }
  });
})();
