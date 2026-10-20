/* 單元：平面截圓錐 */
(function () {
  var C = SK.C, s = SK.s;
  var PRESET = [0, 0, 25, 45, 65];

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 250, "手電筒照在牆上的光斑");
    s("path", { d: "M40 125 L170 70 L170 180 Z", fill: C.gold.f, stroke: "none" }, svg);
    s("rect", { x: 10, y: 110, width: 40, height: 30, rx: 6, fill: C.cocoa }, svg);
    s("line", { x1: 170, y1: 20, x2: 170, y2: 230, stroke: C.line, "stroke-width": 2 }, svg);
    s("ellipse", { cx: 250, cy: 125, rx: 26, ry: 26, fill: C.gold.f, stroke: C.gold.s }, svg);
    s("ellipse", { cx: 320, cy: 125, rx: 40, ry: 24, fill: C.gold.f, stroke: C.gold.s }, svg);
    s("path", { d: "M380 60 Q330 125 380 190", fill: "none", stroke: C.gold.s, "stroke-width": 3 }, svg);
    SK.label(svg, 300, 222, "手電筒斜斜照牆，光斑會變成什麼形狀？", { size: 12, color: C.soft });
  }

  SK.mountUnit({
    slug: "conic-sections",
    en: "One cone, four curves",
    formula: "\\text{平面截圓錐：}\\ \\co{\\text{圓}}\\ \\to\\ \\cb{\\text{橢圓}}\\ \\to\\ \\cg{\\text{拋物線}}\\ \\to\\ \\cp{\\text{雙曲線}}",

    hook: {
      html: "手電筒的光是一個圓錐。正對著牆照，光斑是圓；慢慢把手電筒斜過來，光斑被拉長；斜到某個角度，光斑的一邊突然「開口」跑到無限遠。",
      ask: "同一個圓錐，被不同角度的平面切開，為什麼會出現四種不同的曲線？",
      visual: hookVisual
    },

    guess: {
      q: "用平面去切圓錐，切口<b>不可能</b>是哪一種？",
      options: [
        { t: "正方形", truth: true, explain: "圓錐的側面是彎曲的，平面切出來的是光滑的曲線：圓、橢圓、拋物線、雙曲線（通過頂點時還會退化成點、一條或兩條直線）。不會有尖角，所以不會是正方形。" },
        { t: "雙曲線", common: true, explain: "雙曲線有兩支，好像不是一刀切得出來的！其實是「雙圓錐」：上下兩個錐對頂相接，陡峭的平面同時切到上下兩個，切口就是兩支。" },
        { t: "拋物線", explain: "平面和圓錐的一條母線平行時，切口就是拋物線：它只切到一個錐，而且永遠不會封閉。" },
        { t: "橢圓", explain: "平面稍微傾斜、但沒有斜過母線時，切口就是封閉的橢圓。" }
      ]
    },

    derive: {
      intro: "拖動滑桿改變切面的傾斜角度；在左圖上按住拖曳可以旋轉圓錐。右下角是切口的真實形狀。",
      tall: true,
      frames: [
        { cap: "一條直線（<b>母線</b>）繞著一條軸旋轉，掃出一個<b>雙圓錐</b>：上下兩個錐對頂相接。這裡母線和軸的夾角是 $45^\\circ$。", tex: "\\text{母線繞軸旋轉}\\ \\Rightarrow\\ \\text{雙圓錐}" },
        { cap: "切面和軸<b>垂直</b>（水平切）：切口是<b>圓</b>。", tex: "\\text{傾斜角}=0^\\circ\\ \\Rightarrow\\ \\text{圓}" },
        { cap: "切面稍微傾斜，但比母線<b>平緩</b>：切口仍然封閉，但被拉長成<b>橢圓</b>。", tex: "0^\\circ<\\text{傾斜角}<45^\\circ\\ \\Rightarrow\\ \\text{橢圓}" },
        { cap: "切面和一條母線<b>平行</b>：切口一邊永遠追不上圓錐，無法封閉，是<b>拋物線</b>。", tex: "\\text{傾斜角}=45^\\circ\\ \\Rightarrow\\ \\text{拋物線}" },
        { cap: "切面比母線<b>更陡</b>：同時切到上下兩個錐，得到兩支曲線的<b>雙曲線</b>。在生活中：斜照牆壁的檯燈光、噴泉的水柱、行星的軌道，都藏著這四種曲線。", tex: "\\text{傾斜角}>45^\\circ\\ \\Rightarrow\\ \\text{雙曲線}" }
      ],
      hint: "每一步會先把角度設好，你也可以自己拖動試試。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 540, 440, "平面截圓錐");
        var g = s("g", {}, svg);
        var v = SK.view3d(svg, { cx: 200, cy: 215, scale: 42, yaw: -110, pitch: 12, onRotate: function () { draw(); } });
        var st = { phi: 25, c: 1.6 }, H = 3.6, lastF = -1;
        var read = SK.h("div", { class: "readout" });
        var sp = SK.slider({ label: "傾斜角", min: 0, max: 85, step: 1, value: st.phi, fmt: function (x) { return x + "°"; }, onInput: function (x) { st.phi = x; draw(); } });
        var sc = SK.slider({ label: "切面高度", min: .6, max: 2.6, step: .1, value: st.c, color: "blue", onInput: function (x) { st.c = x; draw(); } });
        ctx.sliders.appendChild(sp.el); ctx.sliders.appendChild(sc.el);
        ctx.extra.appendChild(read);
        function kind(phi) { return phi === 0 ? ["圓", C.orange] : phi < 45 ? ["橢圓", C.blue] : phi === 45 ? ["拋物線", C.green] : ["雙曲線", C.pink]; }
        function draw() {
          var f = ctx.frame;
          if (f !== lastF) { if (f >= 1) { st.phi = PRESET[f]; sp.set(st.phi, true); } lastF = f; }
          g.innerHTML = "";
          sp.el.style.display = sc.el.style.display = f === 0 ? "none" : "";
          var phi = SK.rad(st.phi), cc = st.c, K = kind(st.phi);
          // 圓錐：水平圓與母線
          for (var z = -H; z <= H + 1e-9; z += H / 3) {
            var pts = [];
            for (var k = 0; k <= 48; k++) { var t = k / 48 * 2 * Math.PI; pts.push(v.P([Math.abs(z) * Math.cos(t), Math.abs(z) * Math.sin(t), z])); }
            s("path", { d: "M" + pts.join(" L"), fill: "none", stroke: C.line, "stroke-width": Math.abs(Math.abs(z) - H) < 1e-9 ? 1.4 : .7 }, g);
          }
          for (var m = 0; m < 12; m++) { var a = m / 12 * 2 * Math.PI; v.line(g, [-H * Math.cos(a), -H * Math.sin(a), -H], [H * Math.cos(a), H * Math.sin(a), H], { stroke: C.line, "stroke-width": .7 }); }
          if (f === 0) {
            v.line(g, [-H, 0, -H], [H, 0, H], { stroke: C.orange.s, "stroke-width": 3 });
            v.line(g, [0, 0, -H - .6], [0, 0, H + .6], { stroke: C.cocoa, "stroke-width": 1.4, "stroke-dasharray": "6 4" });
            var Ap = v.P([H, 0, H]); SK.label(g, Ap[0] + 10, Ap[1], "母線", { size: 13, color: C.orange.s, anchor: "start" });
            var Zp = v.P([0, 0, H + .8]); SK.label(g, Zp[0], Zp[1], "軸", { size: 13 });
            read.innerHTML = "<p style=\"margin:4px 0\">母線和軸的夾角 45°：之後切面「比母線平緩或陡峭」就是和 45° 比。</p>";
            return;
          }
          // 切面：原點 (0,0,c)，方向 e1=(cosφ,0,sinφ)、e2=(0,1,0)
          var e1 = [Math.cos(phi), 0, Math.sin(phi)], O = [0, 0, cc], R = 4.6;
          function PL(u, w) { return [O[0] + u * e1[0], w, O[2] + u * e1[2]]; }
          v.poly(g, [PL(-R, -R), PL(R, -R), PL(R, R), PL(-R, R)], { fill: "rgba(241,226,184,.45)", stroke: C.gold.s });
          // 切口：v² = c² + 2cu sinφ + u²(sin²φ − cos²φ)
          var A2 = Math.sin(phi) * Math.sin(phi) - Math.cos(phi) * Math.cos(phi), B1 = 2 * cc * Math.sin(phi);
          // 取樣 u（含頂點的根），切成連續的段；每段畫成「下半 → 頂點 → 上半」
          function segments(keep) {
            var us = [];
            for (var u = -8; u <= 8; u += .02) us.push(u);
            if (Math.abs(A2) > 1e-9) { var D = B1 * B1 - 4 * A2 * cc * cc; if (D >= 0) [(-B1 + Math.sqrt(D)) / (2 * A2), (-B1 - Math.sqrt(D)) / (2 * A2)].forEach(function (r) { us.push(r); }); }
            else if (Math.abs(B1) > 1e-9) us.push(-cc * cc / B1);
            us.sort(function (a, b) { return a - b; });
            var segs = [], cur = [];
            us.forEach(function (u) {
              var rad = cc * cc + B1 * u + A2 * u * u;
              if (rad < -1e-9 || !keep(u, Math.sqrt(Math.max(0, rad)))) { if (cur.length > 1) segs.push(cur); cur = []; return; }
              cur.push([u, Math.sqrt(Math.max(0, rad))]);
            });
            if (cur.length > 1) segs.push(cur);
            return segs;
          }
          function pathOf(seg, map, closed) {
            var up = seg.map(function (q) { return map(q[0], q[1]); }), dn = seg.map(function (q) { return map(q[0], -q[1]); });
            var rootAtStart = seg[0][1] < 1e-6;
            var pts = rootAtStart ? dn.slice().reverse().concat(up) : dn.concat(up.slice().reverse());
            return "M" + pts.join(" L") + (closed ? "Z" : "");
          }
          var closed = st.phi < 45;
          segments(function (u, w) { var P3 = PL(u, w); return Math.abs(P3[2]) <= H + 1e-9 && Math.abs(u) <= R && w <= R; }).forEach(function (seg) {
            s("path", { d: pathOf(seg, function (u, w) { return v.P(PL(u, w)); }, closed), fill: "none", stroke: K[1].s, "stroke-width": 3 }, g);
          });
          // 右下：真實形狀
          var bx = 430, by = 330, bs = 18;
          s("rect", { x: bx - 100, y: by - 100, width: 200, height: 200, rx: 10, fill: C.paper, stroke: C.line }, g);
          SK.label(g, bx, by - 112, "切口的真實形狀", { size: 12, color: C.soft });
          var shift = st.phi < 45 && st.phi > 0 ? -B1 / (2 * A2) : 0;
          var to2 = function (u, w) { return [(bx + (u - shift) * bs).toFixed(1), (by - w * bs).toFixed(1)]; };
          segments(function (u, w) { var X = bx + (u - shift) * bs; return X >= bx - 96 && X <= bx + 96 && w * bs <= 96; }).forEach(function (seg) {
            s("path", { d: pathOf(seg, to2, closed), fill: "none", stroke: K[1].s, "stroke-width": 2.6 }, g);
          });
          SK.label(g, bx, by + 86, K[0], { size: 16, color: K[1].s, bold: true });
          read.innerHTML = '<p style="margin:4px 0">傾斜角 ' + st.phi + "°" + (st.phi === 45 ? " = " : st.phi < 45 ? " < " : " > ") + "母線的 45° → <b>" + K[0] + "</b></p>";
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "為什麼叫「圓錐曲線」", icon: "sparkle",
        html: "兩千多年前，希臘數學家阿波羅尼斯（Apollonius）就是從「切圓錐」研究這四種曲線，並取了名字。一千八百年後，克卜勒發現行星沿橢圓繞太陽運行，牛頓再證明這是萬有引力的必然結果。同一組曲線，從純粹的幾何走進了天文學。" },
      { title: "生活中的四種曲線", icon: "leaf",
        html: "<b>圓</b>：正上方看水杯的杯口。<b>橢圓</b>：斜著看杯口、地球的軌道。<b>拋物線</b>：丟出去的球、噴泉的水柱、衛星天線的剖面。<b>雙曲線</b>：檯燈燈罩投在牆上的光影、冷卻塔的側面輪廓。下次看到它們，想想是哪一個平面切過了哪一個圓錐。" }
    ],

    challenges: [
      { q: "切面通過圓錐的<b>頂點</b>時，切口會是什麼？", idea: "會「退化」：水平時只剩頂點一個點；和一條母線平行（相切）時是一條直線；更陡時是兩條相交的直線。它們是圓錐曲線的極端情形。" },
      { q: "手電筒垂直照地面得到圓形光斑。慢慢傾斜，光斑依序會變成什麼？", idea: "圓 → 越來越長的橢圓 → 當光錐的邊緣和地面平行時變成拋物線（一邊延伸到很遠）→ 再斜就變成雙曲線的一支。" },
      { q: "雙圓錐被一個平面切出雙曲線時，兩支分別在哪裡？", idea: "一支在上面的錐、一支在下面的錐。這就是為什麼雙曲線有兩支、而且兩支的開口方向相反。" }
    ],

    where: {
      codes: [["S-11B-2", "圓錐曲線：由平面截圓錐，視覺性認識圓、橢圓、拋物線、雙曲線，以及它們在自然與生活中的呈現"]],
      exam: "11 年級<b>數學 B</b>。考試以認識與素養情境為主。數學甲在 12 年級會學它們的方程式（見拋物線、橢圓、雙曲線單元）。",
      stop: "數 B 只要求<b>視覺性的認識</b>：可以認識標準式，但不計算焦點坐標、正焦弦長、切線與離心率。"
    }
  });
})();
