/* 單元：空間坐標與經緯度 */
(function () {
  var C = SK.C, s = SK.s;

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 250, "房間角落的三條邊");
    var v = SK.view3d(svg, { cx: 170, cy: 175, scale: 32, yaw: -128, pitch: 20 });
    var g = s("g", {}, svg);
    v.poly(g, [[0, 0, 0], [5, 0, 0], [5, 5, 0], [0, 5, 0]], { fill: C.gold.f, stroke: C.line });
    v.poly(g, [[0, 0, 0], [0, 5, 0], [0, 5, 4], [0, 0, 4]], { fill: C.blue.f, stroke: C.line });
    v.poly(g, [[0, 0, 0], [5, 0, 0], [5, 0, 4], [0, 0, 4]], { fill: C.mint.f, stroke: C.line });
    v.axes(g, 5.5);
    var p = [3, 2, 2.5];
    v.line(g, [p[0], p[1], 0], p, { stroke: C.orange.s, "stroke-dasharray": "4 4" });
    v.dot(g, p, C.orange.s, 7);
    v.text(g, [p[0], p[1], p[2] + .7], "小蜜蜂", { size: 13, color: C.orange.s });
    SK.label(svg, 200, 238, "牆角為原點，怎麼說出蜜蜂在哪裡？", { size: 13, color: C.soft });
  }

  SK.mountUnit({
    slug: "space-coords",
    en: "Three numbers pin down a point in space",
    formula: "\\overline{OP}=\\sqrt{\\co x^2+\\cb y^2+\\cg z^2},\\qquad (R\\cos\\varphi\\cos\\theta,\\ R\\cos\\varphi\\sin\\theta,\\ R\\sin\\varphi)",

    hook: {
      html: "房間牆角有三條互相垂直的邊。把牆角當原點，一隻蜜蜂停在空中。",
      ask: "要用幾個數字才能說清楚它在哪？它離牆角多遠？地球上的經緯度又對應到哪三個數字？",
      visual: hookVisual
    },

    guess: {
      q: "點 $P(2,3,6)$ 到原點的距離是多少？",
      options: [
        { t: "7", truth: true, explain: "先在地板上：$\\sqrt{2^2+3^2}=\\sqrt{13}$；再往上 6：$\\sqrt{13+36}=\\sqrt{49}=7$。兩次畢氏定理合起來，就是 $\\sqrt{x^2+y^2+z^2}$。" },
        { t: "11", common: true, explain: "$2+3+6=11$ 是沿著三條邊「走格子」的距離。直線飛過去一定比較短：兩次畢氏定理。" },
        { t: "$\\sqrt{13}$", explain: "這只是 $P$ 在地板上的影子 $(2,3,0)$ 到原點的距離，還沒把高度 6 算進去。" },
        { t: "$\\sqrt{11}$", explain: "距離要把三個坐標<b>平方</b>再相加：$4+9+36=49$。" }
      ]
    },

    derive: {
      intro: "拖動滑桿改坐標；在圖上<b>按住拖曳</b>可以旋轉視角。",
      tall: true,
      frames: [
        { cap: "三條互相垂直的數線 $x$、$y$、$z$ 交在原點。從原點出發，沿 $x$ 走 $a$、沿 $y$ 走 $b$、再往上 $c$，就到達 $P(a,b,c)$。三個坐標面把空間分成八個<b>卦限</b>。", tex: "P(\\co a,\\cb b,\\cg c)" },
        { cap: "<b>投影</b>：從 $P$ 往 $xy$ 平面垂直落下，影子是 $(a,b,0)$；投到 $yz$、$xz$ 平面分別是 $(0,b,c)$、$(a,0,c)$。投到 $x$ 軸是 $(a,0,0)$：只留下那一個坐標。", tex: "\\begin{aligned}P\\to xy\\text{ 平面}&：(a,b,0)\\\\P\\to x\\text{ 軸}&：(a,0,0)\\end{aligned}" },
        { cap: "<b>距離</b>：地板上的影子到原點是 $\\sqrt{a^2+b^2}$；它和高度 $c$ 構成直角三角形，再用一次畢氏定理。兩點距離就是把坐標差代進去。", tex: "\\begin{aligned}\\overline{OP}&=\\sqrt{\\co a^2+\\cb b^2+\\cg c^2}\\\\\\overline{PQ}&=\\sqrt{\\Delta x^2+\\Delta y^2+\\Delta z^2}\\end{aligned}" },
        { cap: "<b>經緯度</b>：地球球心放在原點、北極在 $z$ 軸上。緯度 $\\varphi$ 決定高度 $R\\sin\\varphi$ 和緯線圈的半徑 $R\\cos\\varphi$；經度 $\\theta$ 決定在緯線圈上轉到哪。", tex: "\\big(R\\cos\\varphi\\cos\\theta,\\ R\\cos\\varphi\\sin\\theta,\\ R\\sin\\varphi\\big)" },
        { cap: "<b>大圓與小圓</b>：經線圈都通過球心，是<b>大圓</b>；緯線圈除了赤道，都不通過球心，是<b>小圓</b>，半徑 $R\\cos\\varphi$ 越往兩極越小。", tex: "\\text{緯線圈半徑}=R\\cos\\varphi" }
      ],
      hint: "按住圖形拖曳可以轉動視角。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 540, 440, "空間坐標系");
        var g = s("g", {}, svg);
        var st = { a: 3, b: 4, c: 3, lat: 25, lon: 121 };
        var v = SK.view3d(svg, { cx: 270, cy: 250, scale: 38, onRotate: function () { draw(); } });
        var read = SK.h("div", { class: "readout" });
        var sl = [["a", "$x$", -4, 5, ""], ["b", "$y$", -4, 5, "blue"], ["c", "$z$", -3, 5, "green"]].map(function (p) {
          var o = SK.slider({ label: p[1], min: p[2], max: p[3], step: .5, value: st[p[0]], color: p[4], onInput: function (x) { st[p[0]] = x; draw(); } });
          ctx.sliders.appendChild(o.el); return o;
        });
        var sLat = SK.slider({ label: "緯度 $\\varphi$", min: -80, max: 80, step: 1, value: st.lat, fmt: function (x) { return (x >= 0 ? "北緯 " : "南緯 ") + Math.abs(x) + "°"; }, onInput: function (x) { st.lat = x; draw(); } });
        var sLon = SK.slider({ label: "經度 $\\theta$", min: -180, max: 180, step: 1, value: st.lon, color: "blue", fmt: function (x) { return (x >= 0 ? "東經 " : "西經 ") + Math.abs(x) + "°"; }, onInput: function (x) { st.lon = x; draw(); } });
        ctx.sliders.appendChild(sLat.el); ctx.sliders.appendChild(sLon.el);
        ctx.extra.appendChild(read);
        function num(x) { return SK.fmt(x, 2).replace("−", "-"); }
        function draw() {
          var f = ctx.frame;
          g.innerHTML = "";
          var globe = f >= 3;
          sl.forEach(function (o) { o.el.style.display = globe ? "none" : ""; });
          sLat.el.style.display = sLon.el.style.display = globe ? "" : "none";
          if (!globe) {
            v.s = 38;
            var a = st.a, b = st.b, c = st.c, P = [a, b, c];
            v.poly(g, [[-4, -4, 0], [5, -4, 0], [5, 5, 0], [-4, 5, 0]], { fill: "rgba(241,226,184,.35)", stroke: "none" });
            v.axes(g, 5.5, 4.5);
            // 長方體的邊
            var corners = [[0, 0, 0], [a, 0, 0], [a, b, 0], [0, b, 0], [0, 0, c], [a, 0, c], [a, b, c], [0, b, c]];
            [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]].forEach(function (e) {
              v.line(g, corners[e[0]], corners[e[1]], { stroke: C.line, "stroke-dasharray": "3 4", "stroke-width": 1 });
            });
            if (f === 0) {
              v.line(g, [0, 0, 0], [a, 0, 0], { stroke: C.orange.s, "stroke-width": 3.4 });
              v.line(g, [a, 0, 0], [a, b, 0], { stroke: C.blue.s, "stroke-width": 3.4 });
              v.line(g, [a, b, 0], P, { stroke: C.green.s, "stroke-width": 3.4 });
            }
            if (f === 1) {
              [[[a, b, 0], C.gold.s, "(" + a + "," + b + ",0)"], [[0, b, c], C.blue.s, "(0," + b + "," + c + ")"], [[a, 0, c], C.mint.s, "(" + a + ",0," + c + ")"], [[a, 0, 0], C.orange.s, "(" + a + ",0,0)"]].forEach(function (q) {
                v.line(g, P, q[0], { stroke: q[1], "stroke-width": 1.6, "stroke-dasharray": "5 3" });
                v.dot(g, q[0], q[1], 5);
                var Q = v.P(q[0]); SK.label(g, Q[0] + 8, Q[1] + 14, q[2], { size: 11, color: q[1], anchor: "start" });
              });
            }
            if (f === 2) {
              v.poly(g, [[0, 0, 0], [a, b, 0], P], { fill: C.purple.f, stroke: "none" });
              v.line(g, [0, 0, 0], [a, b, 0], { stroke: C.gold.s, "stroke-width": 3 });
              v.line(g, [a, b, 0], P, { stroke: C.green.s, "stroke-width": 3 });
              v.line(g, [0, 0, 0], P, { stroke: C.pink.s, "stroke-width": 3.6 });
              v.line(g, [0, 0, 0], [a, 0, 0], { stroke: C.orange.s, "stroke-width": 2 });
              v.line(g, [a, 0, 0], [a, b, 0], { stroke: C.blue.s, "stroke-width": 2 });
            }
            v.dot(g, P, C.pink.s, 7);
            var Pp = v.P(P); SK.label(g, Pp[0] + 12, Pp[1] - 12, "P(" + a + ", " + b + ", " + c + ")", { size: 14, color: C.pink.s, anchor: "start" });
            var lines = [];
            if (f === 2) lines.push("\\sqrt{" + a * a + "+" + b * b + "}=" + num(Math.hypot(a, b)) + ",\\ \\ \\sqrt{" + num(a * a + b * b) + "+" + c * c + "}=" + num(Math.hypot(a, b, c)));
            else lines.push("P(" + a + "," + b + "," + c + ")");
            read.innerHTML = lines.map(function (t) { return SK.tex(t, true); }).join("");
            return;
          }
          // 地球
          var R = 4, phi = SK.rad(st.lat), th = SK.rad(st.lon);
          v.s = 42;
          v.axes(g, 5.4, 5.4);
          function circle(fn, attrs) {
            var d = "", pts = [];
            for (var k = 0; k <= 72; k++) pts.push(v.P(fn(k / 72 * 2 * Math.PI)));
            d = "M" + pts.join(" L");
            s("path", Object.assign({ d: d, fill: "none" }, attrs), g);
          }
          // 球的輪廓（視線方向的大圓）：用許多緯線與經線表現
          for (var la = -60; la <= 60; la += 30) circle(function (t) { var p = SK.rad(la); return [R * Math.cos(p) * Math.cos(t), R * Math.cos(p) * Math.sin(t), R * Math.sin(p)]; }, { stroke: C.line, "stroke-width": la === 0 ? 1.6 : .8 });
          for (var lo = 0; lo < 180; lo += 30) circle(function (t) { var q = SK.rad(lo); return [R * Math.cos(t) * Math.cos(q), R * Math.cos(t) * Math.sin(q), R * Math.sin(t)]; }, { stroke: C.line, "stroke-width": .8 });
          var P2 = [R * Math.cos(phi) * Math.cos(th), R * Math.cos(phi) * Math.sin(th), R * Math.sin(phi)];
          // 這一點的緯線圈（小圓）與經線圈（大圓）
          circle(function (t) { return [R * Math.cos(phi) * Math.cos(t), R * Math.cos(phi) * Math.sin(t), R * Math.sin(phi)]; }, { stroke: C.orange.s, "stroke-width": 2.6 });
          circle(function (t) { return [R * Math.cos(t) * Math.cos(th), R * Math.cos(t) * Math.sin(th), R * Math.sin(t)]; }, { stroke: C.blue.s, "stroke-width": 2.6, "stroke-dasharray": f === 4 ? null : "6 4" });
          var foot = [0, 0, R * Math.sin(phi)];
          v.line(g, [0, 0, 0], P2, { stroke: C.pink.s, "stroke-width": 2.4 });
          v.line(g, foot, P2, { stroke: C.orange.s, "stroke-width": 2, "stroke-dasharray": "4 3" });
          v.line(g, [0, 0, 0], [R * Math.cos(phi) * Math.cos(th), R * Math.cos(phi) * Math.sin(th), 0], { stroke: C.gold.s, "stroke-width": 1.6, "stroke-dasharray": "3 3" });
          v.line(g, [R * Math.cos(phi) * Math.cos(th), R * Math.cos(phi) * Math.sin(th), 0], P2, { stroke: C.green.s, "stroke-width": 1.6, "stroke-dasharray": "3 3" });
          v.dot(g, foot, C.orange.s, 4);
          v.dot(g, P2, C.pink.s, 7);
          if (f === 4) {
            var Fp = v.P(foot), Q = v.P(P2);
            SK.label(g, (Fp[0] + Q[0]) / 2, (Fp[1] + Q[1]) / 2 - 12, "R cos φ", { size: 12, color: C.orange.s });
            SK.label(g, 90, 30, "橘：緯線圈（小圓）", { size: 13, color: C.orange.s, anchor: "start" });
            SK.label(g, 90, 50, "藍：經線圈（大圓，過球心）", { size: 13, color: C.blue.s, anchor: "start" });
          }
          var xs = [R * Math.cos(phi) * Math.cos(th), R * Math.cos(phi) * Math.sin(th), R * Math.sin(phi)].map(function (x) { return num(x / R); });
          read.innerHTML = SK.tex("\\frac{P}{R}=(" + xs.join(",") + ")", true) + (f === 4 ? SK.tex("\\text{緯線圈半徑}=R\\cos" + Math.abs(st.lat) + "^\\circ\\approx" + num(Math.cos(phi)) + "R", true) : "");
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "用平面的想法走空間", icon: "sparkle",
        html: "空間裡的很多公式，都只是把平面公式「多加一項」：距離多一個 $\\Delta z^2$、中點多一個 $\\tfrac{z_1+z_2}{2}$。先用平面的圖想清楚，再加上第三個方向，通常就對了。" },
      { title: "台北在哪個坐標？", icon: "leaf",
        html: "台北約在北緯 $25^\\circ$、東經 $121.5^\\circ$。以地球半徑 $R\\approx6400$ 公里：高度 $R\\sin25^\\circ\\approx2700$ 公里，離地軸的距離 $R\\cos25^\\circ\\approx5800$ 公里。緯線圈越往北越小，所以同樣相差 1 度經度，在高緯度走的路比較短。" }
    ],

    challenges: [
      { q: "$A(1,2,3)$、$B(4,6,3)$ 的距離是多少？中點是？", idea: "$\\sqrt{9+16+0}=5$；中點 $(2.5,4,3)$。" },
      { q: "點 $(3,-4,12)$ 到 $z$ 軸的距離是多少？到 $xy$ 平面呢？", idea: "到 $z$ 軸：投影 $(0,0,12)$，距離 $\\sqrt{9+16}=5$。到 $xy$ 平面：$|12|=12$。" },
      { q: "赤道和北緯 $60^\\circ$ 的緯線圈，長度比是多少？", idea: "半徑比 $R:R\\cos60^\\circ=2:1$，所以周長也是 $2:1$。北緯 60 度的緯線只有赤道的一半長。" }
    ],

    where: {
      codes: [["G-11A-2", "空間坐標系：點坐標、兩點距離、點到坐標軸與坐標平面的投影"], ["G-11B-4", "空間坐標系：點坐標、距離、投影，含球心在原點時由經緯度求空間坐標"]],
      exam: "11 年級<b>數學 A</b> 與<b>數學 B</b> 都有。數 B 加上經緯度的應用。",
      stop: "數 B：不處理空間向量、平面與直線方程式，也不計算球面上任意兩點的球面距離。數 A：接著學空間向量。"
    }
  });
})();
