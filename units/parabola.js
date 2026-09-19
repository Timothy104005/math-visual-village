/* 單元：拋物線的定義與標準式 */
(function () {
  var C = SK.C, s = SK.s;

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 250, "丟出去的球畫出一條拋物線");
    s("line", { x1: 20, y1: 220, x2: 380, y2: 220, stroke: C.cocoa, "stroke-width": 1.3 }, svg);
    var d = "";
    for (var t = 0; t <= 1; t += .02) { var x = 40 + t * 320, y = 220 - 640 * t * (1 - t) * .28; d += (t ? "L" : "M") + x + " " + y; }
    s("path", { d: d, fill: "none", stroke: C.orange.s, "stroke-width": 2, "stroke-dasharray": "5 5" }, svg);
    [.15, .35, .5, .65, .85].forEach(function (t) { s("circle", { cx: 40 + t * 320, cy: 220 - 640 * t * (1 - t) * .28, r: 6, fill: C.gold.f, stroke: C.cocoa, "stroke-width": 1.1 }, svg); });
    SK.label(svg, 200, 242, "形狀知道了，但它的「幾何定義」是什麼？", { size: 13, color: C.soft });
  }

  SK.mountUnit({
    slug: "parabola",
    en: "Equally far from a point and a line",
    formula: "\\overline{P\\co{F}}=d(P,\\cb{L})\\ \\Longrightarrow\\ y^2=4\\co{c}x\\quad(F(c,0),\\ L:x=-c)",

    hook: {
      html: "丟出去的球、噴泉的水柱、手電筒的反光罩，形狀都是拋物線。國中我們把它當成 $y=ax^2$ 的圖形。",
      ask: "如果不用方程式，只用「點、線、距離」，要怎麼描述這條曲線？",
      visual: hookVisual
    },

    guess: {
      q: "平面上所有「到一個定點 $F$ 和到一條定直線 $L$ 距離相等」的點，會排成什麼形狀？",
      options: [
        { t: "一條拋物線", truth: true, explain: "定點叫<b>焦點</b>，定直線叫<b>準線</b>。等一下你會看到，把這個條件寫成坐標，就得到 $y^2=4cx$。" },
        { t: "一條直線", common: true, explain: "你可能想到「到兩個<b>點</b>等距的點形成中垂線」，這個類比很好！但把其中一個點換成直線後，距離的量法變了，點會彎成一條曲線。" },
        { t: "一個圓", explain: "到一個定點距離固定才是圓。這裡的距離不是固定的，而是「和另一個距離相等」。" },
        { t: "一個橢圓", explain: "橢圓是到<b>兩個</b>定點的距離和固定，是這一章的下一站。" }
      ]
    },

    derive: {
      intro: "拖動曲線上的點 $P$（上下移動），用滑桿改變焦點到頂點的距離 $c$。",
      tall: true,
      frames: [
        { cap: "一個定點 $F(c,0)$（焦點）和一條定直線 $L:\\ x=-c$（準線），它們到原點的距離一樣是 $c$。", tex: "\\co{F}(c,0),\\quad \\cb{L}:x=-c" },
        { cap: "取一點 $P$，量兩段距離：到焦點的 $\\overline{PF}$（蜜桃色），和到準線的垂直距離（灰藍色）。拖動 $P$，兩段永遠一樣長。", tex: "\\co{\\overline{PF}}=\\cb{d(P,L)}" },
        { cap: "把所有這樣的點都畫出來，就是一條<b>拋物線</b>。原點是頂點，$x$ 軸是對稱軸。", tex: "\\text{頂點 }(0,0),\\ \\text{對稱軸 }y=0" },
        { cap: "寫成坐標：左邊是 $\\sqrt{(x-c)^2+y^2}$，右邊是 $x+c$。兩邊平方、消去 $x^2$ 與 $c^2$，就得到標準式。", tex: "\\begin{aligned}(x-c)^2+y^2&=(x+c)^2\\\\ y^2&=4cx\\end{aligned}" },
        { cap: "$c$ 越大，焦點離頂點越遠，開口越大。頂點搬到 $(h,k)$ 時，就把 $x$、$y$ 換成 $x-h$、$y-k$。", tex: "(y-k)^2=4c(x-h)" }
      ],
      hint: "拖動點 P 沿著拋物線移動；用滑桿改變 c。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 520, 440, "拋物線的焦點與準線");
        var g = s("g", {}, svg), hg = s("g", {}, svg);
        var st = { c: 1, y: 2.4 };
        var cx = 200, cy = 220, u = 48;
        function P(x, y) { return [cx + x * u, cy - y * u]; }
        var read = SK.h("div", { class: "readout" });
        ctx.sliders.appendChild(SK.slider({ label: "$c$", min: .4, max: 2.4, step: .05, value: st.c, onInput: function (v) { st.c = v; draw(); } }).el);
        ctx.extra.appendChild(read);
        var hd = SK.handle(hg, 0, 0, C.green.s, "拋物線上的點 P");
        SK.drag(svg, hd, function (x, y) { st.y = SK.clamp((cy - y) / u, -4.2, 4.2); draw(); }, function () { var p = P(st.y * st.y / (4 * st.c), st.y); return p; }, 8);
        function draw() {
          var f = ctx.frame, c = st.c, py = st.y, px = py * py / (4 * c);
          g.innerHTML = "";
          for (var i = -4; i <= 6; i++) s("line", { x1: P(i, 0)[0], y1: 10, x2: P(i, 0)[0], y2: 430, class: "m-grid" }, g);
          for (var j = -4; j <= 4; j++) s("line", { x1: 10, y1: P(0, j)[1], x2: 510, y2: P(0, j)[1], class: "m-grid" }, g);
          s("line", { x1: 10, y1: cy, x2: 510, y2: cy, class: "m-axis" }, g);
          s("line", { x1: cx, y1: 10, x2: cx, y2: 430, class: "m-axis" }, g);
          var Lx = P(-c, 0)[0];
          s("line", { x1: Lx, y1: 10, x2: Lx, y2: 430, stroke: C.blue.s, "stroke-width": 2.4 }, g);
          SK.label(g, Lx - 8, 24, "準線 x = −c", { size: 12, anchor: "end", color: C.blue.s });
          var F = P(c, 0);
          if (f >= 2) {
            var d = "";
            for (var t = -4.4; t <= 4.4; t += .05) { var q = P(t * t / (4 * c), t); d += (d ? "L" : "M") + q[0] + " " + q[1]; }
            s("path", { d: d, fill: "none", stroke: C.ink, "stroke-width": 2.6 }, g);
          }
          var Pp = P(px, py);
          if (f >= 1) {
            s("line", { x1: Pp[0], y1: Pp[1], x2: F[0], y2: F[1], stroke: C.orange.s, "stroke-width": 3 }, g);
            s("line", { x1: Pp[0], y1: Pp[1], x2: Lx, y2: Pp[1], stroke: C.blue.s, "stroke-width": 3, "stroke-dasharray": "7 4" }, g);
            SK.rightMark(g, Lx, Pp[1], 1, 0, 0, py >= 0 ? 1 : -1, 9);
            SK.label(g, (Pp[0] + F[0]) / 2 + 10, (Pp[1] + F[1]) / 2, SK.fmt(Math.hypot(px - c, py), 2), { size: 13, anchor: "start", color: C.orange.s });
            SK.label(g, (Pp[0] + Lx) / 2, Pp[1] - 12, SK.fmt(px + c, 2), { size: 13, color: C.blue.s });
          }
          s("circle", { cx: F[0], cy: F[1], r: 6, fill: C.orange.f, stroke: C.cocoa, "stroke-width": 1.4 }, g);
          SK.label(g, F[0] + 10, F[1] + 18, "F(c, 0)", { size: 12, anchor: "start", color: C.orange.s });
          hd.style.display = f >= 1 ? "" : "none";
          hd.moveTo(Pp[0], Pp[1]);
          read.innerHTML = SK.tex("c=" + SK.fmt(c, 2) + ":\\quad y^2=" + SK.fmt(4 * c, 2) + "x" + (f >= 1 ? ",\\quad P(" + SK.fmt(px, 2) + ",\\ " + SK.fmt(py, 2) + ")" : ""), true);
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "和國中的 $y=ax^2$ 是同一條曲線", icon: "sparkle",
        html: "把 $y^2=4cx$ 的 $x$、$y$ 對調，就是 $x^2=4cy$，也就是 $y=\\dfrac{1}{4c}x^2$。所以國中的 $y=ax^2$ 是焦點在 $\\left(0,\\dfrac1{4a}\\right)$、準線 $y=-\\dfrac1{4a}$ 的拋物線。$a$ 越大開口越窄，焦點也越靠近頂點。" },
      { title: "為什麼叫「焦點」？", icon: "leaf",
        html: "和對稱軸平行射進來的光，碰到拋物線反射後都會穿過同一點，所有能量聚在那裡，所以叫「焦」點。衛星天線、太陽能集熱器都是這個形狀。這個光學性質不在數甲的正式範圍，但很值得看看，請到補充單元「二次曲線的反射性」。" }
    ],

    challenges: [
      { q: "$y^2=8x$ 的焦點和準線是什麼？", idea: "$4c=8$，$c=2$：焦點 $(2,0)$、準線 $x=-2$。" },
      { q: "焦點 $(0,3)$、準線 $y=-3$ 的拋物線方程式是什麼？", idea: "開口向上，$x^2=12y$。和 $y^2=4cx$ 是同一個想法，只是 $x$、$y$ 對調。" },
      { q: "頂點在 $(1,2)$、焦點在 $(3,2)$ 的拋物線呢？", hint: "頂點到焦點的距離就是 $c$，開口朝焦點的方向。",
        idea: "$c=2$、開口向右：$(y-2)^2=8(x-1)$。" }
    ],

    where: {
      codes: [["G-12甲-1", "二次曲線：拋物線、橢圓、雙曲線的標準式；平移、伸縮"]],
      exam: "12 年級<b>選修數學甲</b>，二次曲線是數甲獨有的單元，分科測驗數甲的範圍。",
      stop: "重點是幾何定義與標準式的互譯、平移。不含光學性質，也不含弦、切線等問題。拋物線參數式、焦半徑屬於教材的延伸，不是官方明列的核心。"
    }
  });
})();
