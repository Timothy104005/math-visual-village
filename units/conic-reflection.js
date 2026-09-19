/* 補充單元：二次曲線的反射性質 */
(function () {
  var C = SK.C, s = SK.s;

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 240, "屋頂上的碟形天線");
    s("path", { d: "M120 60 Q200 230 280 60", fill: "rgba(188,208,205,.5)", stroke: C.cocoa, "stroke-width": 2 }, svg);
    s("line", { x1: 200, y1: 150, x2: 200, y2: 95, stroke: C.cocoa, "stroke-width": 2 }, svg);
    s("circle", { cx: 200, cy: 92, r: 6, fill: C.orange.f, stroke: C.cocoa }, svg);
    [140, 170, 230, 260].forEach(function (x) { s("line", { x1: x, y1: 10, x2: x, y2: 60 + (x - 200) * (x - 200) / 45, stroke: C.gold.s, "stroke-dasharray": "4 4" }, svg); });
    SK.label(svg, 200, 226, "為什麼接收器要放在那個位置？", { size: 13, color: C.soft });
  }

  SK.mountUnit({
    slug: "conic-reflection",
    en: "Why the focus is called the focus",
    formula: "\\text{拋物線：平行光}\\ \\to\\ \\co{\\text{焦點}},\\qquad \\text{橢圓：}\\cb{F_1}\\ \\to\\ \\cb{F_2}",

    hook: {
      html: "碟形衛星天線的剖面是一條拋物線，接收器不是放在正中間的底部，而是架在前方的某個點上。",
      ask: "這個點是怎麼決定的？為什麼所有訊號都會集中到那裡？",
      visual: hookVisual
    },

    guess: {
      q: "和拋物線對稱軸平行射入的光線，碰到拋物線反射後，會往哪裡走？",
      options: [
        { t: "全部穿過同一點（焦點）", truth: true, explain: "每一條平行光反射後都會通過焦點，所以能量集中在那裡。「焦點」這個名字就是這樣來的：可以把東西「燒焦」的點。" },
        { t: "沿原路反彈回去", common: true, explain: "只有正對著射入、打在頂點上的那一條才會原路反彈。其他光線打在斜斜的曲面上，反射方向會偏向中間。" },
        { t: "各自往不同方向散開", explain: "凸面鏡才會讓光散開。拋物線的凹面剛好讓光線聚在一起。" },
        { t: "反射後也互相平行", explain: "平面鏡才會這樣。拋物線彎曲的程度剛好讓所有反射光匯聚到一點。" }
      ]
    },

    derive: {
      intro: "拖動滑桿改變入射光的位置，觀察反射後的方向。",
      tall: true,
      frames: [
        { cap: "反射定律：在反射點畫切線，入射光和反射光與切線的夾角相等（也就是和法線的夾角相等）。", tex: "\\text{入射角}=\\text{反射角}" },
        { cap: "拋物線 $y^2=4cx$ 上，一條平行於對稱軸的光打到點 $P$。反射後，它剛好通過焦點 $F(c,0)$。", tex: "\\text{平行光}\\ \\xrightarrow{\\text{反射}}\\ F(c,0)" },
        { cap: "多畫幾條：每一條平行光都會通過焦點。反過來，把燈泡放在焦點，光反射後會平行射出，這就是車燈、探照燈。", tex: "\\text{焦點的光}\\ \\xrightarrow{\\text{反射}}\\ \\text{平行光}" },
        { cap: "橢圓也有類似的性質：從一個焦點 $F_1$ 發出的光，碰到橢圓反射後，一定會通過另一個焦點 $F_2$。", tex: "\\cb{F_1}\\ \\xrightarrow{\\text{反射}}\\ \\cb{F_2}" }
      ],
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 520, 420, "拋物線與橢圓的反射");
        var g = s("g", {}, svg);
        var st = { y: 1.6 };
        var read = SK.h("div", { class: "readout" });
        ctx.sliders.appendChild(SK.slider({ label: "光線", min: -3.2, max: 3.2, step: .05, value: st.y, fmt: function (v) { return SK.fmt(v, 2); }, onInput: function (v) { st.y = v; draw(); } }).el);
        ctx.extra.appendChild(read);
        function draw() {
          var f = ctx.frame;
          g.innerHTML = "";
          if (f <= 2) {
            var c = 1, u = 55, ox = 90, oy = 210;
            var P = function (x, y) { return [ox + x * u, oy - y * u]; };
            s("line", { x1: 20, y1: oy, x2: 510, y2: oy, class: "m-axis" }, g);
            var d = "";
            for (var t = -3.5; t <= 3.5; t += .05) { var q = P(t * t / (4 * c), t); d += (d ? "L" : "M") + q[0] + " " + q[1]; }
            s("path", { d: d, fill: "none", stroke: C.ink, "stroke-width": 2.6 }, g);
            var F = P(c, 0);
            var ys = f === 2 ? [-3, -2.2, -1.4, -.7, .7, 1.4, 2.2, 3] : [st.y];
            ys.forEach(function (y0, idx) {
              var x0 = y0 * y0 / (4 * c), Pt = P(x0, y0), col = f === 2 ? [C.orange, C.blue, C.green, C.pink][idx % 4].s : C.orange.s;
              s("line", { x1: 505, y1: Pt[1], x2: Pt[0], y2: Pt[1], stroke: col, "stroke-width": 2 }, g);
              var dx = F[0] - Pt[0], dy = F[1] - Pt[1], L = Math.hypot(dx, dy);
              var ext = f === 2 ? 1.25 : 1.6;
              SK.arrow(g, Pt[0], Pt[1], Pt[0] + dx * ext, Pt[1] + dy * ext, col, 2);
              if (f === 0 || f === 1) {
                // 切線方向：dx/dy = y/(2c)
                var tx = y0 / (2 * c), ty = 1, tl = Math.hypot(tx, ty);
                var T1 = P(x0 - tx / tl * 1.4, y0 - ty / tl * 1.4), T2 = P(x0 + tx / tl * 1.4, y0 + ty / tl * 1.4);
                s("line", { x1: T1[0], y1: T1[1], x2: T2[0], y2: T2[1], stroke: C.purple.s, "stroke-width": 1.4, "stroke-dasharray": "5 4" }, g);
                if (f === 0) SK.label(g, T2[0] + 6, T2[1], "切線", { size: 12, anchor: "start", color: C.purple.s });
              }
            });
            s("circle", { cx: F[0], cy: F[1], r: 6, fill: C.gold.f, stroke: C.cocoa, "stroke-width": 1.4 }, g);
            SK.label(g, F[0] + 4, F[1] + 20, "焦點 F", { size: 13, color: C.gold.s });
            read.innerHTML = SK.tex("y^2=4x,\\quad F(1,0)", true);
          } else {
            var a = 3.6, b = 2.4, cc = Math.sqrt(a * a - b * b), U = 60, X0 = 260, Y0 = 210;
            var Q = function (x, y) { return [X0 + x * U, Y0 - y * U]; };
            s("ellipse", { cx: X0, cy: Y0, rx: a * U, ry: b * U, fill: "rgba(241,226,184,.25)", stroke: C.ink, "stroke-width": 2.6 }, g);
            var F1 = Q(-cc, 0), F2 = Q(cc, 0);
            for (var k = 0; k < 10; k++) {
              var th = (k + .5) * 2 * Math.PI / 10 + st.y * .1, Pe = Q(a * Math.cos(th), b * Math.sin(th)), col2 = [C.orange, C.blue, C.green, C.pink, C.purple][k % 5].s;
              s("line", { x1: F1[0], y1: F1[1], x2: Pe[0], y2: Pe[1], stroke: col2, "stroke-width": 1.4 }, g);
              SK.arrow(g, Pe[0], Pe[1], F2[0], F2[1], col2, 1.4);
            }
            [F1, F2].forEach(function (Fp, i) { s("circle", { cx: Fp[0], cy: Fp[1], r: 6, fill: C.gold.f, stroke: C.cocoa, "stroke-width": 1.4 }, g); SK.label(g, Fp[0], Fp[1] + 20, i ? "F₂" : "F₁", { size: 13 }); });
            read.innerHTML = SK.tex("\\text{從 }F_1\\text{ 出發的光，反射後都到 }F_2", true);
          }
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "生活裡的反射", icon: "sparkle",
        html: "衛星天線、太陽爐：平行的訊號或陽光聚到焦點。車燈、手電筒：燈泡放在焦點，射出平行光。醫院的「體外震波碎石」：在橢圓反射器的一個焦點產生震波，反射後集中到另一個焦點，也就是結石的位置。有些建築的「耳語廊」是橢圓形的：站在一個焦點小聲說話，另一個焦點的人聽得很清楚。" }
    ],

    challenges: [
      { q: "拋物線 $y^2=12x$ 做成的反射鏡，燈泡應該放在哪裡，才能射出平行光？", idea: "$4c=12$，$c=3$，放在焦點 $(3,0)$。" },
      { q: "為什麼橢圓的反射性質和「$\\overline{PF_1}+\\overline{PF_2}$ 固定」有關？（提示：光走最短路徑）", idea: "光從 $F_1$ 經過鏡面到 $F_2$，會走總長度最短的路徑。橢圓上每一點的 $\\overline{PF_1}+\\overline{PF_2}$ 都一樣，而切線上其他點都在橢圓外、總長更長，所以切點就是「最短路徑」的反射點。這是一個漂亮的幾何論證，但不在高中範圍。" }
    ],

    where: {
      codes: [["G-12甲-1", "（接點）二次曲線"], ["S-11B-2", "（接點，數 B）平面截圓錐，認識圓錐曲線的自然呈現"]],
      exam: "<b>課綱外補充</b>：數甲的課程手冊明確寫著「不含二次曲線的光學性質」，所以這不是考試內容。它是用來說明「焦點」這個名字從何而來，以及二次曲線為什麼在科技上這麼重要。",
      stop: "只作為現象與模型的補充，用圖形與模擬觀察；不做角度追逐的證明題，也不做弦、切線的計算。"
    }
  });
})();
