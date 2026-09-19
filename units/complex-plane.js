/* 單元：複數平面與極式 */
(function () {
  var C = SK.C, s = SK.s;

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 260, "乘以 -1 是轉半圈，乘以 i 呢");
    var cx = 200, cy = 140, u = 80;
    s("line", { x1: 40, y1: cy, x2: 360, y2: cy, class: "m-axis" }, svg);
    s("line", { x1: cx, y1: 30, x2: cx, y2: 250, class: "m-axis" }, svg);
    SK.arrow(svg, cx, cy, cx + u, cy, C.orange.s, 3);
    SK.arrow(svg, cx, cy, cx - u, cy, C.blue.s, 3);
    s("path", { d: SK.arcPath(cx, cy, 50, 0, Math.PI), fill: "none", stroke: C.blue.s, "stroke-dasharray": "4 4" }, svg);
    s("path", { d: SK.arcPath(cx, cy, 64, 0, Math.PI / 2), fill: "none", stroke: C.green.s, "stroke-width": 2 }, svg);
    SK.label(svg, cx + u + 16, cy + 18, "1", { size: 14, color: C.orange.s });
    SK.label(svg, cx - u - 16, cy + 18, "−1", { size: 14, color: C.blue.s });
    SK.label(svg, cx + 60, cy - 70, "× i ＝ 轉 ？", { size: 15, color: C.green.s });
    SK.label(svg, cx - 40, cy - 60, "× (−1) ＝ 轉 180°", { size: 13, anchor: "end", color: C.blue.s });
  }

  SK.mountUnit({
    slug: "complex-plane",
    en: "Multiplying is rotating and scaling",
    formula: "z_1z_2=\\cb{r_1r_2}\\left[\\cos(\\co{\\theta_1+\\theta_2})+i\\sin(\\co{\\theta_1+\\theta_2})\\right]",

    hook: {
      html: "在數線上，「乘以 $-1$」會把 $1$ 變成 $-1$，就像把箭頭轉了半圈。而 $i$ 的定義是 $i^2=-1$，也就是「乘兩次 $i$ 等於乘一次 $-1$」。",
      ask: "如果乘兩次等於轉半圈，那乘一次 $i$ 應該是什麼動作？",
      visual: hookVisual
    },

    guess: {
      q: "把複數平面上的點 $z$ 乘以 $i$，它會跑到哪裡？",
      options: [
        { t: "繞原點逆時針轉 $90^\\circ$", truth: true, explain: "轉兩次 $90^\\circ$ 就是轉 $180^\\circ$，正好對應 $i^2=-1$。例如 $(2+i)\\cdot i=-1+2i$：點從 $(2,1)$ 轉到 $(-1,2)$。" },
        { t: "變成 $-z$", common: true, explain: "$-z$ 是乘以 $-1$，也就是轉 $180^\\circ$。乘以 $i$ 只做了一半的動作。" },
        { t: "距離原點變遠", explain: "$|i|=1$，所以乘以 $i$ 不改變長度，只改變方向。" },
        { t: "沒有幾何意義，只能用代數算", explain: "代數當然可以算，但複數最迷人的地方，就是乘法有很清楚的圖像：旋轉加縮放。" }
      ]
    },

    derive: {
      intro: "拖動蜜桃色的 $z$ 和灰藍色的 $w$，看乘法在平面上做了什麼。",
      tall: true,
      frames: [
        { cap: "複數 $a+bi$ 就是平面上的點 $(a,b)$：橫軸是實部，縱軸是虛部。這就是<b>複數平面</b>。", tex: "\\co{z}=a+bi\\ \\leftrightarrow\\ (a,b)" },
        { cap: "換一種描述：離原點多遠（絕對值 $r=|z|$）、朝哪個方向（輻角 $\\theta$）。這就是<b>極式</b>，和單位圓是同一個想法。", tex: "\\begin{gathered}z=r(\\cos\\theta+i\\sin\\theta)\\\\ r=|z|=\\sqrt{a^2+b^2}\\end{gathered}" },
        { cap: "乘以 $i$：長度不變，逆時針轉 $90^\\circ$（淡綠色虛線）。", tex: "iz=r\\left[\\cos(\\theta+90^\\circ)+i\\sin(\\theta+90^\\circ)\\right]" },
        { cap: "一般的乘法 $zw$：<b>長度相乘、角度相加</b>。展開一次就會看到和角公式出現。", tex: "zw=\\cb{r_1r_2}\\left[\\cos(\\co{\\theta_1+\\theta_2})+i\\sin(\\co{\\theta_1+\\theta_2})\\right]" },
        { cap: "一直乘自己：$z,z^2,z^3,\\dots$ 每次長度乘 $r$、角度加 $\\theta$，畫出一條螺旋。這就是<b>棣美弗定理</b>。拖動滑桿改變次方數。", tex: "z^n=r^n(\\cos n\\theta+i\\sin n\\theta)" }
      ],
      hint: "拖動平面上的點 z 與 w。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 520, 460, "複數平面上的乘法");
        var gridG = s("g", {}, svg), g = s("g", {}, svg), hg = s("g", {}, svg);
        var cx = 260, cy = 240, u = 70;
        var st = { z: [1.2, .7], w: [.6, 1], n: 5 };
        for (var i = -4; i <= 4; i++) {
          s("line", { x1: cx + i * u, y1: 10, x2: cx + i * u, y2: 450, class: "m-grid" }, gridG);
          s("line", { x1: 10, y1: cy + i * u, x2: 510, y2: cy + i * u, class: "m-grid" }, gridG);
        }
        s("line", { x1: 10, y1: cy, x2: 510, y2: cy, class: "m-axis" }, gridG);
        s("line", { x1: cx, y1: 10, x2: cx, y2: 450, class: "m-axis" }, gridG);
        SK.label(gridG, 500, cy - 12, "實軸", { size: 12, anchor: "end", color: C.soft });
        SK.label(gridG, cx + 8, 22, "虛軸", { size: 12, anchor: "start", color: C.soft });
        s("circle", { cx: cx, cy: cy, r: u, fill: "none", stroke: C.line, "stroke-dasharray": "3 5" }, gridG);
        function P(v) { return [cx + v[0] * u, cy - v[1] * u]; }
        var read = SK.h("div", { class: "readout" });
        var slN = SK.slider({ label: "$n$", min: 1, max: 12, value: st.n, fmt: function (v) { return "次方 " + v; }, onInput: function (v) { st.n = v; draw(); } });
        ctx.sliders.appendChild(slN.el); ctx.extra.appendChild(read);
        var hz = SK.handle(hg, 0, 0, C.orange.s, "複數 z"), hw = SK.handle(hg, 0, 0, C.blue.s, "複數 w");
        function mk(key, hd) {
          SK.drag(svg, hd, function (x, y) { st[key] = [SK.clamp(Math.round((x - cx) / u * 20) / 20, -3.4, 3.4), SK.clamp(Math.round((cy - y) / u * 20) / 20, -3, 3)]; draw(); },
            function () { return P(st[key]); }, 7);
        }
        mk("z", hz); mk("w", hw);
        function mul(a, b) { return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]]; }
        function fz(v) { var re = SK.fmt(v[0], 2), im = SK.fmt(Math.abs(v[1]), 2); return re + (v[1] < 0 ? "-" : "+") + im + "i"; }
        function draw() {
          var f = ctx.frame, z = st.z, w = st.w;
          var r = Math.hypot(z[0], z[1]), th = Math.atan2(z[1], z[0]);
          g.innerHTML = "";
          var Z = P(z);
          hw.style.display = f === 3 ? "" : "none";
          slN.el.style.display = f === 4 ? "" : "none";
          if (f >= 1) {
            s("path", { d: SK.arcPath(cx, cy, 26, 0, th), fill: "none", stroke: C.purple.s, "stroke-width": 2 }, g);
            SK.label(g, cx + 40 * Math.cos(th / 2), cy - 40 * Math.sin(th / 2), "θ", { it: true, color: C.purple.s });
          }
          if (f === 0) {
            s("line", { x1: Z[0], y1: Z[1], x2: Z[0], y2: cy, stroke: C.line, "stroke-dasharray": "4 4" }, g);
            s("line", { x1: Z[0], y1: Z[1], x2: cx, y2: Z[1], stroke: C.line, "stroke-dasharray": "4 4" }, g);
          }
          SK.arrow(g, cx, cy, Z[0], Z[1], C.orange.s, 3.4);
          SK.label(g, Z[0] + 12, Z[1] - 12, "z", { it: true, anchor: "start", color: C.orange.s });
          if (f === 2) {
            var iz = mul(z, [0, 1]), IZ = P(iz);
            s("path", { d: SK.arcPath(cx, cy, r * u, th, th + Math.PI / 2), fill: "none", stroke: C.green.s, "stroke-width": 1.6, "stroke-dasharray": "5 5" }, g);
            SK.arrow(g, cx, cy, IZ[0], IZ[1], C.green.s, 3.4);
            SK.label(g, IZ[0] - 12, IZ[1] - 12, "iz", { it: true, anchor: "end", color: C.green.s });
          }
          if (f === 3) {
            var W = P(w), pz = mul(z, w), PZ = P(pz);
            SK.arrow(g, cx, cy, W[0], W[1], C.blue.s, 3);
            SK.label(g, W[0] + 12, W[1] - 10, "w", { it: true, anchor: "start", color: C.blue.s });
            SK.arrow(g, cx, cy, PZ[0], PZ[1], C.green.s, 3.6);
            SK.label(g, PZ[0] + 12, PZ[1] - 12, "zw", { it: true, anchor: "start", color: C.green.s });
            var tw = Math.atan2(w[1], w[0]);
            s("path", { d: SK.arcPath(cx, cy, 44, th, th + tw), fill: "none", stroke: C.blue.s, "stroke-width": 2 }, g);
            hw.moveTo(W[0], W[1]);
          }
          if (f === 4) {
            var p = [1, 0], d = "M" + P(p);
            for (var k = 1; k <= st.n; k++) {
              var q = mul(p, z), Q = P(q), mid = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
              d += " L" + Q;
              s("circle", { cx: Q[0], cy: Q[1], r: 4, fill: C.green.f, stroke: C.green.s }, g);
              if (Math.abs(Q[0] - cx) < 250 && Math.abs(Q[1] - cy) < 230) SK.label(g, Q[0] + 8, Q[1] - 8, "z" + (k > 1 ? String(k).replace(/\d/g, function (c) { return "⁰¹²³⁴⁵⁶⁷⁸⁹"[c]; }) : ""), { size: 12, anchor: "start", color: C.green.s });
              p = q;
            }
            s("path", { d: d, fill: "none", stroke: C.green.s, "stroke-width": 1.2, "stroke-dasharray": "3 4" }, g);
          }
          hz.moveTo(Z[0], Z[1]);
          var lines = SK.tex("z=" + fz(z) + "=" + SK.fmt(r, 3) + "(\\cos" + SK.fmt(SK.deg(th), 1) + "^\\circ+i\\sin" + SK.fmt(SK.deg(th), 1) + "^\\circ)", true);
          if (f === 3) { var tw2 = Math.atan2(w[1], w[0]), rw = Math.hypot(w[0], w[1]); lines += SK.tex("|zw|=" + SK.fmt(r, 2) + "\\times" + SK.fmt(rw, 2) + "=" + SK.fmt(r * rw, 3) + ",\\quad \\arg=" + SK.fmt(SK.deg(th), 1) + "^\\circ+" + SK.fmt(SK.deg(tw2), 1) + "^\\circ", true); }
          if (f === 4) lines += SK.tex("|z^{" + st.n + "}|=" + SK.fmt(r, 2) + "^{" + st.n + "}\\approx" + SK.fmt(Math.pow(r, st.n), 3) + ",\\quad " + st.n + "\\theta=" + SK.fmt(SK.deg(th) * st.n, 1) + "^\\circ", true);
          read.innerHTML = lines;
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "為什麼角度會相加？", icon: "sparkle",
        html: "把兩個極式乘開：$$(\\cos\\alpha+i\\sin\\alpha)(\\cos\\beta+i\\sin\\beta)=(\\cos\\alpha\\cos\\beta-\\sin\\alpha\\sin\\beta)+i(\\sin\\alpha\\cos\\beta+\\cos\\alpha\\sin\\beta).$$ 兩個括號正好是「和角公式」單元的兩條公式，所以結果就是 $\\cos(\\alpha+\\beta)+i\\sin(\\alpha+\\beta)$。複數乘法，其實是把和角公式包裝成一次乘法。" },
      { title: "共軛：對實軸鏡射", icon: "leaf",
        html: "$z=a+bi$ 的共軛 $\\bar z=a-bi$ 就是對實軸的鏡射：長度一樣、角度相反。所以 $z\\bar z$ 的角度是 $\\theta+(-\\theta)=0$，長度是 $r^2$，也就是 $z\\bar z=|z|^2=a^2+b^2$，一定是正實數。這也是「分母有理化」可以用在複數除法上的原因。" }
    ],

    challenges: [
      { q: "不用展開，算出 $(1+i)^8$。", hint: "先把 $1+i$ 寫成極式：長度 $\\sqrt2$，角度 $45^\\circ$。",
        idea: "$(\\sqrt2)^8\\left[\\cos360^\\circ+i\\sin360^\\circ\\right]=16$。八次方繞了剛好一整圈，回到正實軸上。" },
      { q: "$i^{2026}$ 等於多少？用「轉 $90^\\circ$」的想法說明。", idea: "每乘一次 $i$ 轉 $90^\\circ$，四次轉一圈。$2026=4\\times506+2$，所以等於 $i^2=-1$。" },
      { q: "為什麼 $|z_1z_2|=|z_1||z_2|$？你能用它說明「兩個平方和的乘積仍是平方和」嗎？", hint: "取 $z_1=a+bi$、$z_2=c+di$。",
        idea: "$(a^2+b^2)(c^2+d^2)=|z_1z_2|^2=(ac-bd)^2+(ad+bc)^2$。一個代數恆等式，背後是「長度相乘」這張圖。" }
    ],

    where: {
      codes: [["N-12甲-3", "複數：複數平面、極式、四則運算、絕對值及其幾何意涵、棣美弗定理與 $n$ 次方根"]],
      exam: "12 年級<b>選修數學甲</b>，只在分科測驗數甲的範圍內。它把三角（和角公式）、向量（平面上的點）和代數（方程式的根）三條線連在一起。",
      stop: "棣美弗定理的指數限整數；評量重點是複數平面的幾何意義與方根應用，不以繁複的三角和式為主。"
    }
  });
})();
