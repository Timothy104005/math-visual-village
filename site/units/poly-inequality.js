/* 單元：多項式不等式 */
(function () {
  var C = SK.C, s = SK.s;
  var DIRS = [[">", "> 0"], ["<", "< 0"], [">=", "≥ 0"], ["<=", "≤ 0"]];

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 250, "拋物線在 x 軸上方的部分");
    var O = [200, 170], u = 34;
    function P(x, y) { return [O[0] + x * u, O[1] - y * u]; }
    s("line", { x1: 20, y1: O[1], x2: 380, y2: O[1], class: "m-axis" }, svg);
    var d = "";
    for (var x = -3.4; x <= 4.4; x += .05) { var y = (x + 2) * (x - 3) / 2.2; if (Math.abs(y) > 4.4) continue; var p = P(x, y); d += (d ? "L" : "M") + p[0] + " " + p[1]; }
    s("path", { d: d, fill: "none", stroke: C.orange.s, "stroke-width": 2.8 }, svg);
    [[-2, "−2"], [3, "3"]].forEach(function (r) {
      var p = P(r[0], 0);
      s("circle", { cx: p[0], cy: p[1], r: 5, fill: C.cocoa }, svg);
      SK.label(svg, p[0], p[1] + 20, r[1], { size: 13 });
    });
    s("line", { x1: 20, y1: O[1], x2: P(-2, 0)[0], y2: O[1], stroke: C.green.s, "stroke-width": 6 }, svg);
    s("line", { x1: P(3, 0)[0], y1: O[1], x2: 380, y2: O[1], stroke: C.green.s, "stroke-width": 6 }, svg);
    SK.label(svg, 200, 232, "圖形在 x 軸上方的地方，就是 f(x) > 0 的解", { size: 12, color: C.soft });
  }

  SK.mountUnit({
    slug: "poly-inequality",
    en: "Where the graph sits above the axis",
    formula: "f(x)>0\\iff \\text{圖形在 }x\\text{ 軸上方};\\qquad (x-r_1)(x-r_2)\\cdots\\ \\text{用符號表判斷}",

    hook: {
      html: "解方程式 $f(x)=0$ 是找圖形和 $x$ 軸的<b>交點</b>；解不等式 $f(x)>0$ 則是找圖形在 $x$ 軸<b>上方</b>的那些 $x$。",
      ask: "只要把式子分解、標出根，能不能不畫圖就直接讀出答案？",
      visual: hookVisual
    },

    guess: {
      q: "$(x+2)(x-3)>0$ 的解是什麼？",
      options: [
        { t: "$x<-2$ 或 $x>3$", truth: true, explain: "兩個因式<b>同號</b>時乘積才是正的：兩個都負（$x<-2$）或兩個都正（$x>3$）。圖上就是拋物線在 $x$ 軸上方的兩段。" },
        { t: "$-2<x<3$", common: true, explain: "這是 $<0$ 的解！中間那一段，兩個因式一正一負，乘積是負的。開口向上的拋物線，中間是凹下去的部分。" },
        { t: "$x>-2$ 且 $x>3$，也就是 $x>3$", explain: "把「乘積為正」拆成「兩個都正」只對了一半，還有「兩個都負」的情形。" },
        { t: "$x>3$ 或 $x<3$（除了 3 以外都可以）", explain: "$x=0$ 時 $(2)(-3)=-6<0$，所以 0 不是解。中間整段都不行。" }
      ]
    },

    derive: {
      intro: "拖動滑桿改變根的位置，點按鈕換不等號的方向。綠色是解、灰色不是。",
      tall: true,
      frames: [
        { cap: "<b>一次不等式</b>：$ax+b>0$ 的圖形是直線，解就是直線在 $x$ 軸上方的那一段（$a<0$ 時方向相反，這正是「兩邊同乘負數要變號」的圖像意義）。", tex: "2x-6>0\\iff x>3" },
        { cap: "<b>二次不等式</b>：先因式分解找出兩個根，圖形是拋物線。開口向上時，兩根<b>之外</b>是正、<b>之間</b>是負。", tex: "\\begin{gathered}(x-r_1)(x-r_2)>0\\\\\\iff x<r_1\\ \\text{或}\\ x>r_2\\end{gathered}" },
        { cap: "<b>符號表</b>：兩個根把數線切成三段。在每一段裡，每個因式的正負固定，乘起來就知道整體的正負。不必畫圖也能判斷。", tex: "(+)(+)=+,\\ (+)(-)=-,\\ (-)(-)=+" },
        { cap: "<b>已分解的高次式</b>：每經過一個根，就有一個因式變號，所以整體的正負<b>交替</b>出現。從最右邊（最高次項的符號）往左，正負正負地填。", tex: "(x-r_1)(x-r_2)(x-r_3)\\ \\text{：正負交替}" },
        { cap: "<b>重根不變號</b>：$(x-r)^2$ 永遠 $\\ge0$，經過這種根時整體符號<b>不會</b>改變（圖形碰到 $x$ 軸又彈回去）。偶次重根不變號、奇次重根變號。", tex: "(x-1)^2(x-3)>0\\iff x>3" }
      ],
      hint: "拖動根的位置、點按鈕換不等號。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 540, 440, "多項式不等式");
        var g = s("g", {}, svg);
        var st = { r: [-2, 3, 5], dir: 0 };
        var O = [270, 250], u = 44;
        function P(x, y) { return [O[0] + x * u, O[1] - y * u]; }
        var read = SK.h("div", { class: "readout" });
        var btns = SK.h("div", { style: "display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px" });
        DIRS.forEach(function (d, i) {
          var b = SK.h("button", { class: "chip", type: "button", "aria-pressed": i === 0 ? "true" : "false" }, "f(x) " + d[1]);
          b.addEventListener("click", function () { st.dir = i; Array.prototype.forEach.call(btns.children, function (x, k) { x.setAttribute("aria-pressed", k === i ? "true" : "false"); }); draw(); });
          btns.appendChild(b);
        });
        var sr = [0, 1, 2].map(function (k) {
          var o = SK.slider({ label: "$r_" + (k + 1) + "$", min: -5, max: 5.5, step: .5, value: st.r[k], color: ["", "blue", "green"][k], onInput: function (v) { st.r[k] = v; draw(); } });
          ctx.sliders.appendChild(o.el); return o;
        });
        ctx.extra.appendChild(btns); ctx.extra.appendChild(read);
        function num(v) { return SK.fmt(v, 1).replace("−", "-"); }
        function roots(f) { return f === 0 ? [st.r[0]] : f === 4 ? [st.r[0], st.r[0], st.r[1]] : f === 3 ? st.r.slice(0, 3) : st.r.slice(0, 2); }
        function fval(rs, x) { return rs.reduce(function (m, r) { return m * (x - r); }, 1) / Math.pow(1.7, rs.length - 1); }
        function draw() {
          var f = ctx.frame, rs = roots(f).slice().sort(function (a, b) { return a - b; });
          g.innerHTML = "";
          btns.style.display = f >= 1 ? "flex" : "none";
          sr.forEach(function (o, k) { o.el.style.display = (f === 0 && k === 0) || (f >= 1 && f <= 2 && k <= 1) || (f === 3 && k <= 2) || (f === 4 && k <= 1) ? "" : "none"; });
          sr[0].el.querySelector("label").innerHTML = SK.md(f === 4 ? "重根 $r$" : "$r_1$");
          for (var i = -6; i <= 6; i++) { var a = P(i, -3), b = P(i, 3); s("line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1], class: "m-grid" }, g); }
          for (var j = -3; j <= 3; j++) { var c = P(-6, j), d = P(6, j); s("line", { x1: c[0], y1: c[1], x2: d[0], y2: d[1], class: "m-grid" }, g); }
          var ax = P(-6, 0), bx = P(6, 0);
          s("line", { x1: ax[0], y1: ax[1], x2: bx[0], y2: bx[1], class: "m-axis" }, g);
          var ay = P(0, -3), by = P(0, 3);
          s("line", { x1: ay[0], y1: ay[1], x2: by[0], y2: by[1], class: "m-axis" }, g);
          // 曲線
          var dd = "", pen = false;
          for (var x = -6; x <= 6; x += .02) {
            var y = fval(rs, x);
            if (Math.abs(y) > 3.2) { pen = false; continue; }
            var p = P(x, y); dd += (pen ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1); pen = true;
          }
          s("path", { d: dd, fill: "none", stroke: C.orange.s, "stroke-width": 2.8 }, g);
          // 解集合
          var dir = DIRS[st.dir][0], eq = dir.length > 1;
          var segs = [], uniq = rs.filter(function (r, i) { return rs.indexOf(r) === i; });
          var bounds = [-6].concat(uniq).concat([6]);
          for (var k = 0; k + 1 < bounds.length; k++) {
            var mid = (bounds[k] + bounds[k + 1]) / 2, v = fval(rs, mid);
            var ok = dir[0] === ">" ? v > 0 : v < 0;
            if (ok) segs.push([bounds[k], bounds[k + 1]]);
          }
          segs.forEach(function (sg) {
            var p1 = P(sg[0], 0), p2 = P(sg[1], 0);
            s("line", { x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1], stroke: C.green.s, "stroke-width": 7, opacity: .8 }, g);
          });
          uniq.forEach(function (r) {
            var p = P(r, 0);
            s("circle", { cx: p[0], cy: p[1], r: 6, fill: eq ? C.green.s : C.paper, stroke: C.cocoa, "stroke-width": 2 }, g);
            SK.label(g, p[0], p[1] + 22, num(r), { size: 12, color: C.soft });
          });
          // 符號表
          if (f >= 2) {
            var ty = 330, cw = 480 / (uniq.length + 1), x0 = 30;
            var rowsN = uniq.length + 1;
            SK.label(g, x0 - 4, ty - 18, "符號表", { size: 12, color: C.soft, anchor: "start" });
            for (var q = 0; q < uniq.length + 1; q++) {
              var lo = q === 0 ? -6 : uniq[q - 1], hi = q === uniq.length ? 6 : uniq[q], m2 = (lo + hi) / 2;
              var cx = x0 + q * cw;
              uniq.forEach(function (r, ri) {
                var sgn = m2 - r > 0 ? "+" : "−";
                s("rect", { x: cx, y: ty + ri * 26, width: cw - 4, height: 24, fill: sgn === "+" ? "rgba(207,224,211,.6)" : "rgba(233,193,191,.5)", stroke: C.line, "stroke-width": .8 }, g);
                SK.label(g, cx + cw / 2, ty + ri * 26 + 12, "(x" + (r >= 0 ? "−" + num(r) : "+" + num(-r)) + ") " + sgn, { size: 11 });
              });
              var tot = fval(rs, m2) > 0 ? "+" : "−";
              s("rect", { x: cx, y: ty + uniq.length * 26 + 4, width: cw - 4, height: 26, fill: tot === "+" ? C.green.f : C.pink.f, stroke: C.cocoa, "stroke-width": 1.2 }, g);
              SK.label(g, cx + cw / 2, ty + uniq.length * 26 + 17, "f(x) " + tot, { size: 12, bold: true });
              if (q < uniq.length) SK.label(g, cx + cw - 2, ty - 4, num(uniq[q]), { size: 11, color: C.cocoa });
            }
          }
          var facTex = rs.map(function (r) { return "(x" + (r >= 0 ? "-" + num(r) : "+" + num(-r)) + ")"; }).join("");
          var solTex = segs.length === 0 ? "\\text{無解}" : segs.map(function (sg) {
            var L = sg[0] <= -6, R = sg[1] >= 6;
            if (L && R) return "\\text{所有實數}";
            if (L) return "x" + (eq ? "\\le" : "<") + num(sg[1]);
            if (R) return "x" + (eq ? "\\ge" : ">") + num(sg[0]);
            return num(sg[0]) + (eq ? "\\le" : "<") + "x" + (eq ? "\\le" : "<") + num(sg[1]);
          }).join("\\ \\text{或}\\ ");
          read.innerHTML = SK.tex(facTex + "\\ " + (dir === ">" ? ">" : dir === "<" ? "<" : dir === ">=" ? "\\ge" : "\\le") + "0", true) + SK.tex("\\text{解：}" + solTex, true);
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "先移項，再分解", icon: "sparkle",
        html: "$x^2>x+6$ 不能兩邊開根號，也不能直接「約掉 $x$」。正確做法是先移到同一邊：$x^2-x-6>0$，分解成 $(x-3)(x+2)>0$，再看圖或符號表。<b>兩邊同乘或同除一個式子</b>很危險，因為不知道它的正負；移項到一邊最安全。" },
      { title: "分式不等式也一樣", icon: "leaf",
        html: "$\\dfrac{x-1}{x+2}>0$ 不要交叉相乘（$x+2$ 可能是負的）。分數的正負只看分子分母的<b>符號</b>：兩者同號就是正。所以它和 $(x-1)(x+2)>0$ 的解一樣，只是要多排除 $x=-2$。" }
    ],

    challenges: [
      { q: "解 $x^2\\le4$。", idea: "移項分解：$(x-2)(x+2)\\le0$，兩根之間：$-2\\le x\\le2$。注意不是「$x\\le\\pm2$」。" },
      { q: "解 $(x+1)(x-2)^2>0$。", idea: "$(x-2)^2\\ge0$ 不影響符號（$x=2$ 時等於 0 要排除），所以解是 $x>-1$ 且 $x\\ne2$。" },
      { q: "$x^2+x+1>0$ 的解是什麼？", hint: "配方：$\\left(x+\\tfrac12\\right)^2+\\tfrac34$。", idea: "判別式 $1-4<0$，沒有實根，拋物線整條在 $x$ 軸上方，所以<b>所有實數</b>都是解。" }
    ],

    where: {
      codes: [["F-10-3", "多項式不等式：一次、二次或已分解的多項式不等式，並與函數圖形連結；區間只用來表達解"]],
      exam: "10 年級<b>共同必修</b>，學測數 A、數 B 都考，也是線性規劃與微積分求極值的基礎。",

      past: [] /* Examination text excluded; see docs/PROVENANCE.md. */,
      stop: "以一次、二次或<b>已分解</b>的多項式為主；未分解的三次以上不等式不要求。區間符號只用來寫解，不做區間的集合運算。"
    }
  });
})();
