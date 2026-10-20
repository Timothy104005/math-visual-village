/* 單元：比例與透視 */
(function () {
  var C = SK.C, s = SK.s;

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 250, "鐵軌往遠方收成一點");
    var VP = [200, 80];
    s("rect", { x: 0, y: 0, width: 400, height: 80, fill: "rgba(207,221,218,.6)" }, svg);
    s("rect", { x: 0, y: 80, width: 400, height: 170, fill: C.gold.f }, svg);
    s("line", { x1: 0, y1: 80, x2: 400, y2: 80, stroke: C.cocoa, "stroke-width": 1 }, svg);
    s("line", { x1: 60, y1: 250, x2: VP[0], y2: VP[1], stroke: C.cocoa, "stroke-width": 2 }, svg);
    s("line", { x1: 340, y1: 250, x2: VP[0], y2: VP[1], stroke: C.cocoa, "stroke-width": 2 }, svg);
    for (var k = 0; k < 9; k++) {
      var d = 1 + k * .8, y = 80 + 170 / d, t = 1 / d;
      s("line", { x1: 200 - 140 * t, y1: y, x2: 200 + 140 * t, y2: y, stroke: C.orange.s, "stroke-width": 3 * t + .5 }, svg);
    }
    s("circle", { cx: VP[0], cy: VP[1], r: 4, fill: C.pink.s }, svg);
    SK.label(svg, 200, 62, "消失點", { size: 12, color: C.pink.s });
  }

  SK.mountUnit({
    slug: "perspective",
    en: "Why far things look small",
    formula: "\\frac{\\cb{h'}}{\\co h}=\\frac{f}{d}\\qquad(\\text{相似三角形：看起來的大小和距離成反比})",

    hook: {
      html: "站在鐵軌中間往前看，兩條平行的鐵軌在遠方收成一個點，一樣長的枕木也越來越短、越排越密。",
      ask: "畫家要怎麼決定遠方的枕木該畫多短、間隔該多窄，畫出來才像真的？",
      visual: hookVisual
    },

    guess: {
      q: "一根電線桿離你 10 公尺，另一根一樣高的離你 30 公尺。在你眼中（或照片上），遠的那根看起來是近的幾分之幾高？",
      options: [
        { t: "$\\tfrac13$", truth: true, explain: "從眼睛拉到桿頂的光線，和畫面構成相似三角形：畫面上的高度 $h'=\\tfrac{f}{d}h$，和距離成反比。距離變 3 倍，看起來就變成 $\\tfrac13$。" },
        { t: "比 $\\tfrac13$ 大一點，因為只遠了 20 公尺", common: true, explain: "直覺上「多遠了 20 公尺」好像只該縮一點點。但縮小的比例看的是距離的<b>倍數</b>，不是差距：30 公尺是 10 公尺的 3 倍。" },
        { t: "$\\tfrac19$", explain: "$\\tfrac19$ 是面積的比（長度的比平方）。電線桿的「高度」只縮成 $\\tfrac13$。" },
        { t: "一樣高，因為它們真的一樣高", explain: "真的一樣高沒錯，但「看起來」的大小取決於它在你視線中占的角度，遠的東西占的角度比較小。" }
      ]
    },

    derive: {
      intro: "拖動滑桿，觀察距離、高度和畫面上的大小之間的比例。",
      tall: true,
      frames: [
        { cap: "從側面看：眼睛、畫面（或底片）、物體。從眼睛到物體頂端的光線，在畫面上留下高度 $h'$。兩個直角三角形<b>相似</b>，所以對應邊成比例。", tex: "\\frac{h'}{f}=\\frac{h}{d}\\ \\Rightarrow\\ h'=\\frac{f}{d}\\,h" },
        { cap: "<b>一點透視</b>：往正前方延伸的平行線，在畫面上都收向同一個<b>消失點</b>，它就在<b>地平線</b>（和眼睛一樣高的水平線）上。", tex: "\\text{平行線}\\ \\to\\ \\text{交於消失點}" },
        { cap: "等距排列的枕木，畫面上到地平線的距離是 $\\tfrac{fH}{d}$（$H$ 是眼睛高度）。距離 1、2、3、4 倍，畫面上就是 $1,\\tfrac12,\\tfrac13,\\tfrac14$：越遠越擠。", tex: "y'_k=\\frac{fH}{d_k}" },
        { cap: "<b>設計中的比例</b>：A4 紙的長寬比是 $\\sqrt2:1$。對摺之後的 A5，長寬比還是 $\\sqrt2:1$，和原來相似。所以放大縮印（A4↔A3）不會變形。", tex: "\\frac{\\text{長}}{\\text{寬}}=\\frac{\\text{寬}}{\\text{長}/2}\\ \\Rightarrow\\ \\text{長}:\\text{寬}=\\sqrt2:1" },
        { cap: "<b>比例尺</b>：相似圖形的長度比是 $k$，面積比就是 $k^2$。地圖比例尺 1:1000，地圖上 1 平方公分代表 $1000^2$ 平方公分 = 100 平方公尺。", tex: "\\text{長度比}\\ k\\ \\Rightarrow\\ \\text{面積比}\\ k^2" }
      ],
      hint: "每一步的滑桿不同：距離與高度、眼睛高度、放大倍數。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 540, 440, "透視與比例");
        var g = s("g", {}, svg);
        var st = { d: 6, h: 3, H: 1.6, k: 1.5 };
        var read = SK.h("div", { class: "readout" });
        var sd = SK.slider({ label: "距離 $d$", min: 4, max: 12, step: .5, value: st.d, onInput: function (v) { st.d = v; draw(); } });
        var sh = SK.slider({ label: "高度 $h$", min: 1, max: 5, step: .5, value: st.h, color: "blue", onInput: function (v) { st.h = v; draw(); } });
        var sH = SK.slider({ label: "眼睛高度 $H$", min: .6, max: 3, step: .1, value: st.H, color: "green", onInput: function (v) { st.H = v; draw(); } });
        var sk = SK.slider({ label: "放大倍數 $k$", min: .5, max: 2.5, step: .1, value: st.k, onInput: function (v) { st.k = v; draw(); } });
        [sd, sh, sH, sk].forEach(function (o) { ctx.sliders.appendChild(o.el); });
        ctx.extra.appendChild(read);
        function num(v) { return SK.fmt(v, 2).replace("−", "-"); }
        function draw() {
          var f = ctx.frame;
          g.innerHTML = "";
          sd.el.style.display = sh.el.style.display = f === 0 ? "" : "none";
          sH.el.style.display = f === 1 || f === 2 ? "" : "none";
          sk.el.style.display = f === 4 ? "" : "none";
          if (f === 0) {
            var gy = 330, ex = 40, ey = gy - 60, fpx = 130, U = 38;
            s("line", { x1: 20, y1: gy, x2: 530, y2: gy, stroke: C.cocoa, "stroke-width": 1.4 }, g);
            s("circle", { cx: ex, cy: ey, r: 8, fill: C.paper, stroke: C.cocoa, "stroke-width": 1.6 }, g);
            s("circle", { cx: ex + 3, cy: ey, r: 3, fill: C.cocoa }, g);
            var px = ex + fpx;
            s("line", { x1: px, y1: 40, x2: px, y2: gy, stroke: C.blue.s, "stroke-width": 3, opacity: .5 }, g);
            SK.label(g, px, 28, "畫面", { size: 12, color: C.blue.s });
            // 兩個物體：距離 d 與 2d 同高
            [[st.d, C.orange], [st.d * 2, C.purple]].forEach(function (o, i) {
              var tx = ex + o[0] * U; if (tx > 520) return;
              var top = gy - st.h * U;
              s("rect", { x: tx - 6, y: top, width: 12, height: gy - top, fill: o[1].f, stroke: o[1].s }, g);
              s("line", { x1: ex, y1: ey, x2: tx, y2: top, stroke: o[1].s, "stroke-width": 1.4, "stroke-dasharray": "5 4" }, g);
              s("line", { x1: ex, y1: ey, x2: tx, y2: gy, stroke: o[1].s, "stroke-width": 1, "stroke-dasharray": "2 4" }, g);
              var yTop = ey + (top - ey) * fpx / (tx - ex), yBot = ey + (gy - ey) * fpx / (tx - ex);
              s("line", { x1: px - 10 + i * 20, y1: yTop, x2: px - 10 + i * 20, y2: yBot, stroke: o[1].s, "stroke-width": 6 }, g);
              SK.label(g, px - 10 + i * 20 + (i ? 10 : -10), (yTop + yBot) / 2, "h'", { size: 12, color: o[1].s, anchor: i ? "start" : "end" });
              SK.label(g, tx, gy + 18, (i ? "2d" : "d") + " = " + num(o[0]), { size: 12, color: o[1].s });
            });
            SK.label(g, ex, ey - 22, "眼睛", { size: 12 });
            read.innerHTML = SK.tex("h'=\\frac{f}{d}h\\ \\propto\\ \\frac{" + num(st.h) + "}{" + num(st.d) + "}", true) + '<p style="margin:4px 0 0">距離加倍，畫面上的高度（紫）剛好是橘色的一半。</p>';
            return;
          }
          if (f === 1 || f === 2) {
            var VP = [270, 150], FH = 520, H = st.H;
            s("rect", { x: 0, y: 0, width: 540, height: VP[1], fill: "rgba(207,221,218,.5)" }, g);
            s("rect", { x: 0, y: VP[1], width: 540, height: 440 - VP[1], fill: "rgba(241,226,184,.6)" }, g);
            s("line", { x1: 0, y1: VP[1], x2: 540, y2: VP[1], stroke: C.cocoa, "stroke-width": 1.2 }, g);
            SK.label(g, 520, VP[1] - 12, "地平線（眼睛高度）", { size: 11, color: C.soft, anchor: "end" });
            // 軌道：兩條相距 1.4 的平行線 x=±0.7
            var proj = function (x, y, d) { return [VP[0] + FH * x / d, VP[1] + FH * (H - y) / d / 2.2]; };
            [-.7, .7].forEach(function (x) { var a = proj(x, 0, .9), b = proj(x, 0, 400); s("line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: C.cocoa, "stroke-width": 2.2 }, g); });
            if (f === 1) {
              // 其他平行線：路邊的電線
              [[-2.2, 2.4], [2.2, 2.4], [-2.2, 0], [2.2, 0]].forEach(function (p) { var a = proj(p[0], p[1], 1.2), b = proj(p[0], p[1], 400); s("line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: C.blue.s, "stroke-width": 1.4, "stroke-dasharray": "6 4" }, g); });
            }
            var ys = [];
            for (var k = 0; k < 16; k++) {
              var d = 1.5 * (k + 1), A = proj(-.9, 0, d), B = proj(.9, 0, d);
              if (A[1] > 440) continue;
              s("line", { x1: A[0], y1: A[1], x2: B[0], y2: B[1], stroke: k < 4 && f === 2 ? C.orange.s : "rgba(184,103,74,.5)", "stroke-width": Math.max(1, 6 / d) }, g);
              ys.push([k + 1, A[1] - VP[1]]);
            }
            s("circle", { cx: VP[0], cy: VP[1], r: 5, fill: C.pink.s }, g);
            SK.label(g, VP[0], VP[1] - 16, "消失點", { size: 12, color: C.pink.s });
            if (f === 2 && ys.length >= 4) {
              var rows = ys.slice(0, 4), y1 = rows[0][1];
              rows.forEach(function (r) {
                SK.label(g, 20, VP[1] + r[1], r[0] + " 倍遠", { size: 11, anchor: "start", color: C.soft });
                s("line", { x1: 75, y1: VP[1], x2: 75, y2: VP[1] + r[1], stroke: C.purple.s, "stroke-width": 2, opacity: .5 }, g);
              });
              read.innerHTML = SK.tex("y'\\ \\text{的比}=" + rows.map(function (r) { return num(r[1] / y1); }).join(":") + "=1:\\tfrac12:\\tfrac13:\\tfrac14", true);
            } else read.innerHTML = SK.tex("\\text{眼睛高度 }H=" + num(H) + "\\ \\text{：地平線永遠和眼睛一樣高}", true);
            return;
          }
          if (f === 3) {
            // A 系列紙：A0 → A5 依序對摺
            var W0 = 420 * .95, H0 = W0 / Math.SQRT2, x = 60, y = 50, w = W0, h = H0, horiz = true;
            for (var i = 0; i < 6; i++) {
              s("rect", { x: x, y: y, width: w, height: h, fill: [C.gold, C.orange, C.blue, C.green, C.purple, C.pink][i].f, stroke: C.cocoa }, g);
              SK.label(g, x + w / 2, y + h / 2, "A" + i, { size: Math.max(11, 26 - i * 3), bold: true });
              if (horiz) { w = w / 2; x = x + w; } else { h = h / 2; y = y + h; }
              horiz = !horiz;
            }
            SK.label(g, 270, 340, "每一張都是上一張的一半，形狀完全相似", { size: 14, color: C.soft });
            read.innerHTML = SK.tex("\\frac{\\sqrt2}{1}=\\frac{1}{\\sqrt2/2}\\approx1.414", true);
            return;
          }
          // f === 4：相似圖形的面積比
          var kk = st.k, base = [[0, 0], [2, 0], [2.6, 1.4], [1, 2.2], [-.4, 1.2]], Uu = 45;
          var draw2 = function (ox, oy, sc, col) {
            s("path", { d: "M" + base.map(function (p) { return [ox + p[0] * Uu * sc, oy - p[1] * Uu * sc]; }).join(" L") + "Z", fill: col.f, stroke: col.s, "stroke-width": 1.6 }, g);
          };
          draw2(60, 380, 1, C.blue);
          draw2(250, 380, kk, C.orange);
          // 單位正方形
          s("rect", { x: 60, y: 120, width: Uu, height: Uu, fill: C.blue.f, stroke: C.blue.s }, g);
          s("rect", { x: 140, y: 120 - Uu * (kk - 1), width: Uu * kk, height: Uu * kk, fill: C.orange.f, stroke: C.orange.s }, g);
          SK.label(g, 60 + Uu / 2, 180, "1", { size: 13 }); SK.label(g, 140 + Uu * kk / 2, 180, num(kk) + "² = " + num(kk * kk), { size: 13 });
          read.innerHTML = SK.tex("\\text{長度}\\times" + num(kk) + "\\ \\Rightarrow\\ \\text{面積}\\times" + num(kk * kk), true);
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "文藝復興畫家的發明", icon: "sparkle",
        html: "十五世紀，布魯內萊斯基和阿伯提把「相似三角形」帶進繪畫：畫布就是一扇窗，每一條從眼睛出發的光線在窗上留下一點。從此畫裡的地板磚、柱廊有了真實的深度。今天的 3D 遊戲、電腦繪圖，用的還是同一個 $\\tfrac{f}{d}$。" },
      { title: "攝影的焦距", icon: "leaf",
        html: "公式裡的 $f$ 就是相機的焦距。焦距加倍，畫面上的東西放大兩倍，但視野變窄。用長焦距在遠處拍人像，前後景物的大小比例比較接近（$\\tfrac{d_1}{d_2}$ 接近 1），臉看起來比較自然。" }
    ],

    challenges: [
      { q: "一棵樹的影子長 12 公尺，同時一根 1.5 公尺的竿子影子長 2 公尺。樹多高？", idea: "陽光平行，兩個直角三角形相似：$\\tfrac{h}{12}=\\tfrac{1.5}{2}$，$h=9$ 公尺。" },
      { q: "A4 紙寬 21 公分，長大約多少？A3 的長和寬呢？", idea: "長 $\\approx21\\sqrt2\\approx29.7$ 公分。A3 是兩張 A4 拼起來：$29.7\\times42$ 公分。" },
      { q: "照片上等距排列的路燈，第 1、2 根到地平線的距離是 60 和 30 像素，第 3、4 根會是多少？", idea: "畫面距離和實際距離成反比：若第 1 根在 $d$、第 2 根在 $2d$，則第 3、4 根在 $3d$、$4d$，畫面上分別是 20 和 15 像素。" }
    ],

    where: {
      codes: [["G-11B-3", "平面上的比例：生活情境與平面幾何中的比例問題，特別是設計與透視"]],
      exam: "11 年級<b>數學 B</b>，學測數 B 常以素養情境出現。",
      stop: "以相似形與比例為核心：透視中的縮小比例、設計中的長寬比、比例尺與面積比。兩點、三點透視的作圖技法與射影幾何的正式理論不是範圍。"
    }
  });
})();
