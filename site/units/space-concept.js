/* 單元：空間中的線與面 */
(function () {
  var C = SK.C, s = SK.s;

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 250, "長方體上兩條不相交也不平行的邊");
    var v = SK.view3d(svg, { cx: 200, cy: 150, scale: 34, yaw: -130, pitch: 22 });
    var g = s("g", {}, svg), a = 4, b = 3, c = 2.5;
    var V = [[0, 0, 0], [a, 0, 0], [a, b, 0], [0, b, 0], [0, 0, c], [a, 0, c], [a, b, c], [0, b, c]];
    [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]].forEach(function (e) { v.line(g, V[e[0]], V[e[1]], { stroke: C.line }); });
    v.line(g, V[0], V[1], { stroke: C.orange.s, "stroke-width": 4 });
    v.line(g, V[2], V[6], { stroke: C.blue.s, "stroke-width": 4 });
    SK.label(svg, 200, 236, "這兩條邊會相交嗎？平行嗎？", { size: 13, color: C.soft });
  }

  SK.mountUnit({
    slug: "space-concept",
    en: "Skew lines and the theorem of three perpendiculars",
    formula: "\\overline{PA}\\perp E,\\ \\ \\overline{AB}\\perp L\\ \\Rightarrow\\ \\overline{PB}\\perp L\\qquad(\\text{三垂線定理})",

    hook: {
      html: "平面上的兩條直線，不是相交就是平行。可是看看長方體上這兩條邊：",
      ask: "它們永遠不會碰到，可是方向也不一樣。空間裡的線和面，還有哪些平面上沒有的關係？",
      visual: hookVisual
    },

    guess: {
      q: "直線 $L$ 和平面 $E$ 上的<b>一條</b>直線垂直，$L$ 就一定垂直於平面 $E$ 嗎？",
      options: [
        { t: "不一定，要和平面上兩條相交直線都垂直才行", truth: true, explain: "只和一條垂直，$L$ 還可以往另一個方向傾斜。例如長方體底面的一條邊 $AB$，和另一個側面上斜斜的對角線也可能垂直，但那條對角線並不垂直底面。要和平面上<b>兩條相交</b>的直線都垂直，才能保證垂直整個平面。" },
        { t: "一定，垂直就是垂直", common: true, explain: "平面上的「垂直」只有一個方向可以選，所以很容易這樣想！但空間多了一個維度，和一條線垂直的方向有無限多個，組成一整個平面。" },
        { t: "一定不會", explain: "如果 $L$ 真的垂直平面，它和平面上<b>每一條</b>直線都垂直，當然也和那一條垂直。所以不是「一定不會」。" },
        { t: "要和平面上所有直線都垂直才算", explain: "定義確實是這樣！但實際上只要檢查兩條相交直線就夠了，其他的線都是它們的組合。" }
      ]
    },

    derive: {
      intro: "按住圖形拖曳可以旋轉視角，從不同角度看才看得清楚空間的關係。",
      tall: true,
      frames: [
        { cap: "空間中兩條直線有三種關係：<b>相交</b>、<b>平行</b>（在同一平面、不相交）、<b>歪斜</b>（不在同一平面）。歪斜線是平面上沒有的。點選按鈕看長方體上的例子。", tex: "\\text{相交},\\quad \\text{平行},\\quad \\text{歪斜}" },
        { cap: "直線<b>垂直於平面</b>：和平面上兩條相交直線都垂直，就和平面上每一條直線都垂直。長方體的鉛直邊垂直於底面。", tex: "L\\perp m,\\ L\\perp n,\\ m\\cap n\\ne\\varnothing\\ \\Rightarrow\\ L\\perp E" },
        { cap: "<b>三垂線定理</b>：$\\overline{PA}$ 垂直平面 $E$，在平面上從 $A$ 做 $\\overline{AB}\\perp L$，那麼 $\\overline{PB}$ 也垂直 $L$。理由：$L$ 同時垂直 $\\overline{PA}$ 和 $\\overline{AB}$，所以垂直它們張出的平面 $PAB$。", tex: "\\overline{PA}\\perp E,\\ \\overline{AB}\\perp L\\ \\Rightarrow\\ \\overline{PB}\\perp L" },
        { cap: "<b>兩面角</b>：兩個平面沿一條交線相交。在交線上取一點，兩個平面裡各畫一條和交線垂直的線，它們的夾角就是兩面角。拖動滑桿把面打開。", tex: "\\text{兩面角}=\\angle(\\text{兩條和交線垂直的線})" },
        { cap: "<b>表面最短路徑</b>：螞蟻從長方體一角爬到對角。把經過的兩個面<b>展開</b>成平面，最短路就是直線。三種展開方式要比較。", tex: "\\min\\left\\{\\begin{gathered}\\sqrt{(a+b)^2+c^2}\\\\\\sqrt{(a+c)^2+b^2}\\\\\\sqrt{(b+c)^2+a^2}\\end{gathered}\\right\\}" }
      ],
      hint: "按住圖形拖曳旋轉；第 1 步點按鈕、第 3～5 步用滑桿。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 540, 440, "長方體與空間中的線面關係");
        var g = s("g", {}, svg);
        var v = SK.view3d(svg, { cx: 270, cy: 250, scale: 44, yaw: -128, pitch: 24, onRotate: function () { draw(); } });
        var st = { rel: 2, L: .6, ang: 60, a: 4, b: 3, c: 2, net: 0 };
        var read = SK.h("div", { class: "readout" });
        var btns = SK.h("div", { style: "display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px" });
        ["相交", "平行", "歪斜"].forEach(function (t, i) {
          var b = SK.h("button", { class: "chip", type: "button", "aria-pressed": i === st.rel ? "true" : "false" }, t);
          b.addEventListener("click", function () { st.rel = i; Array.prototype.forEach.call(btns.children, function (x, k) { x.setAttribute("aria-pressed", k === i ? "true" : "false"); }); draw(); });
          btns.appendChild(b);
        });
        var slL = SK.slider({ label: "直線 $L$ 的方向", min: .2, max: 1.4, step: .02, value: st.L, onInput: function (x) { st.L = x; draw(); } });
        var slA = SK.slider({ label: "兩面角", min: 20, max: 180, step: 1, value: st.ang, color: "blue", fmt: function (x) { return x + "°"; }, onInput: function (x) { st.ang = x; draw(); } });
        var sa = SK.slider({ label: "長 $a$", min: 1, max: 5, step: .5, value: st.a, onInput: function (x) { st.a = x; draw(); } });
        var sb = SK.slider({ label: "寬 $b$", min: 1, max: 5, step: .5, value: st.b, color: "blue", onInput: function (x) { st.b = x; draw(); } });
        var sc = SK.slider({ label: "高 $c$", min: 1, max: 5, step: .5, value: st.c, color: "green", onInput: function (x) { st.c = x; draw(); } });
        [slL, slA, sa, sb, sc].forEach(function (o) { ctx.sliders.appendChild(o.el); });
        ctx.extra.appendChild(btns); ctx.extra.appendChild(read);
        function num(x) { return SK.fmt(x, 2).replace("−", "-"); }
        function box(a, b, c, col) {
          var V = [[0, 0, 0], [a, 0, 0], [a, b, 0], [0, b, 0], [0, 0, c], [a, 0, c], [a, b, c], [0, b, c]];
          [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]].forEach(function (e) { v.line(g, V[e[0]], V[e[1]], { stroke: col || C.line, "stroke-width": 1.2 }); });
          "ABCDEFGH".split("").forEach(function (n, i) { var p = v.P(V[i]); SK.label(g, p[0] + 10, p[1] + 10, n, { size: 12, color: C.soft }); });
          return V;
        }
        // 螢幕上的直角記號：p 為頂點，沿 d1、d2 兩個 3D 方向
        function right3(p, d1, d2, col) {
          var k = .35, n1 = Math.hypot.apply(null, d1), n2 = Math.hypot.apply(null, d2);
          var a = [p[0] + d1[0] / n1 * k, p[1] + d1[1] / n1 * k, p[2] + d1[2] / n1 * k], b = [a[0] + d2[0] / n2 * k, a[1] + d2[1] / n2 * k, a[2] + d2[2] / n2 * k], c = [p[0] + d2[0] / n2 * k, p[1] + d2[1] / n2 * k, p[2] + d2[2] / n2 * k];
          s("path", { d: "M" + v.P(a) + " L" + v.P(b) + " L" + v.P(c), fill: "none", stroke: col || C.pink.s, "stroke-width": 1.5 }, g);
        }
        function draw() {
          var f = ctx.frame;
          g.innerHTML = "";
          btns.style.display = f === 0 ? "flex" : "none";
          slL.el.style.display = f === 2 ? "" : "none";
          slA.el.style.display = f === 3 ? "" : "none";
          [sa, sb, sc].forEach(function (o) { o.el.style.display = f === 4 ? "" : "none"; });
          v.cx = 270; v.cy = 250;
          if (f === 0) {
            v.s = 50; v.cx = 250; v.cy = 280;
            var V = box(4, 3, 2.5);
            var pairs = [[[0, 1], [1, 2]], [[0, 1], [7, 6]], [[0, 1], [2, 6]]][st.rel];
            v.line(g, V[pairs[0][0]], V[pairs[0][1]], { stroke: C.orange.s, "stroke-width": 4.5 });
            v.line(g, V[pairs[1][0]], V[pairs[1][1]], { stroke: C.blue.s, "stroke-width": 4.5 });
            if (st.rel === 1) v.poly(g, [V[0], V[1], V[6], V[7]], { fill: C.gold.f, stroke: "none", opacity: .6 });
            var desc = ["AB 和 BC 交於 B", "AB 和 HG 平行：它們在同一個斜切面 ABGH 上", "AB 和 CG 歪斜：找不到一個平面同時包含它們"][st.rel];
            read.innerHTML = '<p style="margin:4px 0">' + desc + "</p>";
            return;
          }
          if (f === 1) {
            v.s = 50; v.cx = 250; v.cy = 280;
            var V1 = box(4, 3, 2.5);
            v.poly(g, [V1[0], V1[1], V1[2], V1[3]], { fill: C.gold.f, stroke: "none", opacity: .7 });
            v.line(g, V1[0], V1[4], { stroke: C.pink.s, "stroke-width": 4.5 });
            v.line(g, V1[0], V1[1], { stroke: C.orange.s, "stroke-width": 3 });
            v.line(g, V1[0], V1[3], { stroke: C.blue.s, "stroke-width": 3 });
            v.line(g, V1[0], V1[2], { stroke: C.green.s, "stroke-width": 2, "stroke-dasharray": "5 4" });
            right3(V1[0], [0, 0, 1], [1, 0, 0]); right3(V1[0], [0, 0, 1], [0, 1, 0]);
            read.innerHTML = '<p style="margin:4px 0">AE ⊥ AB、AE ⊥ AD，而 AB、AD 在底面相交，所以 AE ⊥ 底面；於是 AE 也垂直底面上的 AC（綠色虛線）。</p>';
            return;
          }
          if (f === 2) {
            v.s = 44;
            var E = [[-3, -3, 0], [4, -3, 0], [4, 4, 0], [-3, 4, 0]];
            v.poly(g, E, { fill: C.gold.f, stroke: C.line });
            var A = [0, 0, 0], P = [0, 0, 3.2];
            // 直線 L：在平面上，方向與位置由滑桿決定
            var ang = st.L, dir = [Math.cos(ang), Math.sin(ang), 0], nrm = [Math.sin(ang), -Math.cos(ang), 0], dist = 2;
            var B = [nrm[0] * dist, nrm[1] * dist, 0];
            v.line(g, [B[0] - 5 * dir[0], B[1] - 5 * dir[1], 0], [B[0] + 4 * dir[0], B[1] + 4 * dir[1], 0], { stroke: C.ink, "stroke-width": 2.4 });
            var Le = v.P([B[0] + 3.6 * dir[0], B[1] + 3.6 * dir[1], 0]); SK.label(g, Le[0] + 10, Le[1], "L", { it: true });
            v.poly(g, [P, A, B], { fill: C.purple.f, stroke: "none", opacity: .7 });
            v.line(g, P, A, { stroke: C.pink.s, "stroke-width": 3.4 });
            v.line(g, A, B, { stroke: C.orange.s, "stroke-width": 3 });
            v.line(g, P, B, { stroke: C.blue.s, "stroke-width": 3.4 });
            right3(A, [0, 0, 1], nrm, C.pink.s); right3(B, [-nrm[0], -nrm[1], 0], dir, C.orange.s); right3(B, [-B[0], -B[1], 3.2], dir, C.blue.s);
            [[P, "P"], [A, "A"], [B, "B"]].forEach(function (q) { v.dot(g, q[0], C.ink, 4.5); var p = v.P(q[0]); SK.label(g, p[0] - 12, p[1] - 10, q[1], { it: true }); });
            var pb = [B[0] - P[0], B[1] - P[1], B[2] - P[2]], dot = pb[0] * dir[0] + pb[1] * dir[1] + pb[2] * dir[2];
            read.innerHTML = SK.tex("\\overrightarrow{PB}\\cdot\\vec d_L=" + num(Math.abs(dot) < 1e-9 ? 0 : dot) + "\\ \\Rightarrow\\ \\overline{PB}\\perp L", true);
            return;
          }
          if (f === 3) {
            v.s = 46;
            var th = SK.rad(st.ang);
            var F1 = [[-3, 0, 0], [3, 0, 0], [3, 3, 0], [-3, 3, 0]];
            var w = [0, 3 * Math.cos(th), 3 * Math.sin(th)];
            var F2 = [[-3, 0, 0], [3, 0, 0], [3, w[1], w[2]], [-3, w[1], w[2]]];
            v.poly(g, F1, { fill: C.gold.f, stroke: C.line });
            v.poly(g, F2, { fill: C.blue.f, stroke: C.line, opacity: .85 });
            v.line(g, [-3.6, 0, 0], [3.6, 0, 0], { stroke: C.ink, "stroke-width": 2.6 });
            var O = [0, 0, 0];
            v.line(g, O, [0, 2.4, 0], { stroke: C.orange.s, "stroke-width": 3.4 });
            v.line(g, O, [0, 2.4 * Math.cos(th), 2.4 * Math.sin(th)], { stroke: C.blue.s, "stroke-width": 3.4 });
            var arc = [];
            for (var k = 0; k <= 20; k++) { var t = th * k / 20; arc.push(v.P([0, 1 * Math.cos(t), 1 * Math.sin(t)])); }
            s("path", { d: "M" + arc.join(" L"), fill: "none", stroke: C.pink.s, "stroke-width": 2 }, g);
            right3(O, [1, 0, 0], [0, 1, 0], C.orange.s); right3(O, [1, 0, 0], [0, Math.cos(th), Math.sin(th)], C.blue.s);
            var mp = v.P([0, 1.3 * Math.cos(th / 2), 1.3 * Math.sin(th / 2)]); SK.label(g, mp[0] + 8, mp[1], st.ang + "°", { size: 14, color: C.pink.s, anchor: "start" });
            read.innerHTML = '<p style="margin:4px 0">兩面角 = ' + st.ang + "°" + (st.ang === 90 ? "：兩個平面<b>互相垂直</b>" : st.ang === 180 ? "：兩個面攤成一個平面" : "") + "</p>";
            return;
          }
          // f === 4：展開圖
          var a = st.a, b = st.b, c = st.c;
          var opts = [[a + b, c, "前面＋右面"], [a + c, b, "右面＋上面"], [b + c, a, "前面＋上面"]].map(function (o) { return { w: o[0], h: o[1], L: Math.hypot(o[0], o[1]), name: o[2] }; });
          var best = opts.reduce(function (m, o, i) { return o.L < opts[m].L - 1e-9 ? i : m; }, 0);
          // 左上：小長方體；下方：三種展開
          v.s = 22; v.cx = 90; v.cy = 300;
          var yaw0 = v.yaw; v.yaw = yaw0 + 1.2; // 換個角度，避免對角線剛好朝向觀看者
          var Vb = box(a, b, c);
          v.line(g, Vb[0], Vb[6], { stroke: C.pink.s, "stroke-width": 1.5, "stroke-dasharray": "4 4" });
          v.dot(g, Vb[0], C.orange.s, 5); v.dot(g, Vb[6], C.blue.s, 5);
          v.yaw = yaw0;
          SK.label(g, 110, 210, "螞蟻：A → G", { size: 13, color: C.soft });
          var sc2 = Math.min(28, 250 / Math.max(a + b, a + c, b + c), 95 / Math.max(a, b, c));
          opts.forEach(function (o, i) {
            var x0 = 250, oy = 20 + i * 140;
            var W = o.w * sc2, H = o.h * sc2;
            var split = [a, a, b][i] * sc2;
            s("rect", { x: x0, y: oy, width: split, height: H, fill: C.gold.f, stroke: C.cocoa }, g);
            s("rect", { x: x0 + split, y: oy, width: W - split, height: H, fill: C.blue.f, stroke: C.cocoa }, g);
            s("line", { x1: x0, y1: oy + H, x2: x0 + W, y2: oy, stroke: i === best ? C.pink.s : C.soft, "stroke-width": i === best ? 3.4 : 2 }, g);
            s("circle", { cx: x0, cy: oy + H, r: 5, fill: C.orange.s }, g); s("circle", { cx: x0 + W, cy: oy, r: 5, fill: C.blue.s }, g);
            SK.label(g, x0 + W / 2, oy + H + 18, o.name + "：" + num(o.L), { size: 12, color: i === best ? C.pink.s : C.soft, bold: i === best });
          });
          read.innerHTML = SK.tex("\\sqrt{" + num(opts[0].w) + "^2+" + num(opts[0].h) + "^2},\\ \\sqrt{" + num(opts[1].w) + "^2+" + num(opts[1].h) + "^2},\\ \\sqrt{" + num(opts[2].w) + "^2+" + num(opts[2].h) + "^2}", true) + '<p style="margin:4px 0 0">最短：<b>' + opts[best].name + "</b>，長 " + num(opts[best].L) + "</p>";
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "為什麼三垂線定理有用", icon: "sparkle",
        html: "要在空間裡畫出「點 $P$ 到直線 $L$ 的距離」很難，因為垂足藏在空中。三垂線定理說：先把 $P$ 垂直投影到平面上的 $A$，在<b>平面上</b>從 $A$ 做 $L$ 的垂線到 $B$，$\\overline{PB}$ 就是答案。空間問題變成平面問題，再用畢氏定理：$\\overline{PB}^2=\\overline{PA}^2+\\overline{AB}^2$。" },
      { title: "歪斜線之間也有最短距離", icon: "leaf",
        html: "兩條歪斜線雖然不相交，但有一條線段同時垂直兩者，它的長度就是兩線的距離。長方體裡 $AB$ 和 $CG$ 是歪斜線，$\\overline{BC}$ 同時垂直它們，所以距離就是 $\\overline{BC}$ 的長。" }
    ],

    challenges: [
      { q: "正立方體的 12 條邊中，和某一條邊歪斜的有幾條？", idea: "扣掉自己 1 條、平行的 3 條、相交的 4 條，剩下 $12-1-3-4=4$ 條。" },
      { q: "長方體長 3、寬 4、高 12，體對角線多長？", idea: "$\\sqrt{3^2+4^2+12^2}=\\sqrt{169}=13$：先算底面對角線 5，再和高 12 用畢氏定理。" },
      { q: "$\\overline{PA}$ 垂直平面、長 4；平面上直線 $L$ 和 $A$ 的距離是 3。$P$ 到 $L$ 的距離是多少？", idea: "三垂線定理：$\\sqrt{4^2+3^2}=5$。" }
    ],

    where: {
      codes: [["S-11A-1", "空間概念：線線、線面、面面的位置關係，三垂線定理；認識兩面角（一般兩面角不作幾何處理）"], ["S-11B-1", "空間概念：線線、線面、面面位置關係，長方體展開圖上的表面距離，球面的經緯線與大圓、小圓"]],
      exam: "11 年級<b>數學 A</b>、<b>數學 B</b> 都有。三垂線定理只在數 A；長方體展開最短路徑、經緯線在數 B（經緯度見「空間坐標與經緯度」單元）。",
      stop: "兩面角要認識，但除了直角以外，不用幾何方法處理一般兩面角（數 A 之後用法向量算）。不做正式的立體幾何公理推演。"
    }
  });
})();
