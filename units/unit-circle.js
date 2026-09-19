/* 單元 5：三角比與單位圓 */
(function () {
  var C = SK.C, s = SK.s;

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 320, "摩天輪與車廂的高度");
    var cx = 190, cy = 150, R = 110;
    s("circle", { cx: cx, cy: cy, r: R, fill: "none", stroke: C.line, "stroke-width": 3 }, svg);
    s("circle", { cx: cx, cy: cy, r: R - 14, fill: "none", stroke: "#DDD3C4", "stroke-width": 1.5 }, svg);
    for (var i = 0; i < 12; i++) {
      var a = i * Math.PI / 6;
      s("line", { x1: cx, y1: cy, x2: cx + R * Math.cos(a), y2: cy - R * Math.sin(a), stroke: "#DDD3C4", "stroke-width": 1.4 }, svg);
      var c = [C.orange, C.blue, C.green, C.pink][i % 4];
      s("rect", { x: cx + R * Math.cos(a) - 9, y: cy - R * Math.sin(a) - 4, width: 18, height: 15, rx: 5, fill: c.f, stroke: c.s, "stroke-width": 1.4 }, svg);
    }
    s("path", { d: "M" + (cx - 50) + " 300 L" + cx + " " + cy + " L" + (cx + 50) + " 300", fill: "none", stroke: C.line, "stroke-width": 3 }, svg);
    s("circle", { cx: cx, cy: cy, r: 6, fill: C.line }, svg);
    var a2 = Math.PI / 6;
    var px = cx + R * Math.cos(a2), py = cy - R * Math.sin(a2);
    s("circle", { cx: px, cy: py + 3, r: 14, fill: "none", stroke: C.orange.s, "stroke-width": 2.5, class: "pulse" }, svg);
    s("line", { x1: 330, y1: cy, x2: 330, y2: py + 3, stroke: C.blue.s, "stroke-width": 3 }, svg);
    s("line", { x1: px + 14, y1: py + 3, x2: 330, y2: py + 3, stroke: C.blue.s, "stroke-dasharray": "4 4" }, svg);
    s("line", { x1: cx, y1: cy, x2: 340, y2: cy, stroke: C.line, "stroke-dasharray": "4 4" }, svg);
    SK.label(svg, 350, (cy + py) / 2, "高度？", { size: 13, anchor: "start", color: C.blue.s });
  }

  function waveAngle(el) {
    var wrap = SK.h("div", {});
    var st = SK.h("div", { class: "stage" });
    wrap.appendChild(st); el.appendChild(wrap);
    var svg = SK.svg(st, 700, 260, "把單位圓的旋轉攤平成正弦波");
    var g = s("g", {}, svg);
    var cx = 120, cy = 130, R = 90, gx = 250, gw = 420;
    var theta = 40, playing = false, raf = null;
    function X(t) { return gx + t / 360 * gw; }
    function draw() {
      g.innerHTML = "";
      s("circle", { cx: cx, cy: cy, r: R, fill: "none", stroke: C.line, "stroke-width": 2 }, g);
      s("line", { x1: cx - R - 10, y1: cy, x2: gx + gw + 10, y2: cy, class: "m-axis" }, g);
      s("line", { x1: gx, y1: cy - R - 10, x2: gx, y2: cy + R + 10, class: "m-axis" }, g);
      [90, 180, 270, 360].forEach(function (t) {
        s("line", { x1: X(t), y1: cy - 4, x2: X(t), y2: cy + 4, class: "m-axis" }, g);
        SK.label(g, X(t), cy + 18, t + "°", { size: 12, color: C.soft });
      });
      var dc = "", ds = "";
      for (var t = 0; t <= 360; t += 2) {
        ds += (t ? "L" : "M") + X(t) + " " + (cy - R * Math.sin(SK.rad(t))) + " ";
        dc += (t ? "L" : "M") + X(t) + " " + (cy - R * Math.cos(SK.rad(t))) + " ";
      }
      s("path", { d: dc, fill: "none", stroke: C.orange.s, "stroke-width": 1.8, "stroke-dasharray": "5 5", opacity: .6 }, g);
      var dsp = "";
      for (var t2 = 0; t2 <= theta; t2 += 1) dsp += (t2 ? "L" : "M") + X(t2) + " " + (cy - R * Math.sin(SK.rad(t2))) + " ";
      s("path", { d: ds, fill: "none", stroke: C.blue.f, "stroke-width": 2 }, g);
      s("path", { d: dsp, fill: "none", stroke: C.blue.s, "stroke-width": 3.4 }, g);
      var a = SK.rad(theta), px = cx + R * Math.cos(a), py = cy - R * Math.sin(a);
      s("line", { x1: cx, y1: cy, x2: px, y2: py, stroke: C.ink, "stroke-width": 2 }, g);
      s("line", { x1: px, y1: cy, x2: px, y2: py, stroke: C.blue.s, "stroke-width": 3.5 }, g);
      s("line", { x1: px, y1: py, x2: X(theta), y2: py, stroke: C.blue.s, "stroke-dasharray": "4 4", "stroke-width": 1.4 }, g);
      s("circle", { cx: px, cy: py, r: 6, fill: C.orange.s }, g);
      s("circle", { cx: X(theta), cy: py, r: 6, fill: C.blue.s }, g);
      SK.label(g, gx + gw - 6, 20, "y = sin θ（灰藍）", { size: 13, anchor: "end", color: C.blue.s });
      SK.label(g, gx + gw - 6, 40, "y = cos θ（蜜桃虛線）", { size: 13, anchor: "end", color: C.orange.s });
    }
    var ctr = SK.h("div", { class: "controls", style: "margin-top:12px" });
    var btn = SK.h("button", { class: "btn small", type: "button" }, "▶ 轉起來");
    var sl = SK.slider({ label: "$\\theta$", min: 0, max: 360, value: theta, fmt: function (v) { return v + "°"; }, onInput: function (v) { theta = v; draw(); } });
    sl.el.style.flex = "1"; sl.el.style.minWidth = "220px";
    ctr.appendChild(btn); ctr.appendChild(sl.el); wrap.appendChild(ctr);
    btn.addEventListener("click", function () {
      playing = !playing; btn.textContent = playing ? "❚❚ 暫停" : "▶ 轉起來";
      if (playing) {
        (function step() {
          if (!playing) return;
          theta = (theta + 1.5) % 361; sl.set(Math.round(theta), true); draw();
          raf = requestAnimationFrame(step);
        })();
      } else cancelAnimationFrame(raf);
    });
    wrap.insertAdjacentHTML("beforeend", '<p class="muted" style="font-size:.95rem">' + SK.md("點每轉一圈，高度就上下一次：這就是 11 年級會學的<b>正弦函數圖形</b>。$\\cos$ 的波形一模一樣，只是提早了 $90^\\circ$ 出發。") + "</p>");
    draw();
  }

  function similarAngle(el) {
    var wrap = SK.h("div", { class: "two-col" });
    var st = SK.h("div", { class: "stage" }), side = SK.h("div", { class: "sliders" });
    wrap.appendChild(st); wrap.appendChild(side); el.appendChild(wrap);
    var svg = SK.svg(st, 420, 300, "放大的直角三角形與單位圓的三角形相似");
    var g = s("g", {}, svg);
    var stt = { r: 2.2, t: 35 };
    function draw() {
      g.innerHTML = "";
      var u = 70, ox = 40, oy = 270, a = SK.rad(stt.t), r = stt.r;
      function tri(rr, col, fillOn) {
        var X = ox + rr * Math.cos(a) * u, Y = oy - rr * Math.sin(a) * u;
        s("path", { d: "M" + ox + " " + oy + " L" + X + " " + oy + " L" + X + " " + Y + "Z", fill: fillOn ? col.f : "none", stroke: col.s, "stroke-width": 2.2, "stroke-linejoin": "round" }, g);
        return [X, Y];
      }
      var big = tri(r, C.green, true);
      var small = tri(1, C.purple, true);
      SK.rightMark(g, big[0], oy, -1, 0, 0, -1, 10);
      SK.label(g, (ox + big[0]) / 2 - 10, (oy + big[1]) / 2 - 12, "斜邊 " + SK.fmt(r, 1), { size: 13, color: C.green.s });
      SK.label(g, big[0] + 8, (oy + big[1]) / 2, "對邊 " + SK.fmt(r * Math.sin(a), 2), { size: 13, anchor: "start", color: C.green.s });
      SK.label(g, (ox + small[0]) / 2 + 6, oy + 16, "斜邊 1", { size: 12, color: C.purple.s });
      side.querySelector(".readout").innerHTML = SK.tex("\\frac{\\text{對邊}}{\\text{斜邊}}=\\frac{" + SK.fmt(r * Math.sin(a), 2) + "}{" + SK.fmt(r, 1) + "}=" + SK.fmt(Math.sin(a), 3) + "=\\sin" + stt.t + "^\\circ", true);
    }
    side.appendChild(SK.slider({ label: "放大", min: 1, max: 4.8, step: .1, value: stt.r, fmt: function (v) { return "×" + SK.fmt(v, 1); }, onInput: function (v) { stt.r = v; draw(); } }).el);
    side.appendChild(SK.slider({ label: "$\\theta$", min: 10, max: 80, value: stt.t, color: "blue", fmt: function (v) { return v + "°"; }, onInput: function (v) { stt.t = v; draw(); } }).el);
    side.insertAdjacentHTML("beforeend", '<div class="readout"></div><p class="muted" style="margin:0;font-size:.95rem">' +
      SK.md("國中學的「對邊比斜邊」和單位圓的高度是同一件事：任何直角三角形放大縮小（相似）後，比例不變，縮到斜邊為 1 時，對邊就是單位圓上的 $\\sin\\theta$。") + "</p>");
    draw();
  }

  SK.mountUnit({
    slug: "unit-circle",
    en: "sin and cos are the lengths of shadows",
    formula: "P=(\\co{\\cos\\theta},\\ \\cb{\\sin\\theta}),\\qquad \\co{\\cos^2\\theta}+\\cb{\\sin^2\\theta}=1",

    hook: {
      html: "你坐上一座半徑 1（百公尺）的摩天輪，從和中心同高的位置出發，逆時針慢慢轉。",
      ask: "你離中心的「高度」和「左右距離」，會怎麼隨著轉過的角度改變？",
      visual: hookVisual
    },

    guess: {
      q: "單位圓上的點從 $0^\\circ$ 轉到 $180^\\circ$，它的高度 $\\sin\\theta$ 會怎麼變？",
      options: [
        { t: "一直變大", common: true, explain: "角度一直變大，很自然以為 $\\sin$ 也一直變大。但過了 $90^\\circ$ 之後，點開始往下走了！角度和高度不是同一件事。" },
        { t: "先變大，再變小", truth: true, explain: "$0^\\circ$ 時高度 0，$90^\\circ$ 時到頂端高度 1，接著往左下走，$180^\\circ$ 時又回到高度 0。左右是對稱的：$\\sin150^\\circ=\\sin30^\\circ$。" },
        { t: "一直變小", explain: "你可能想到的是 $\\cos\\theta$（左右位置）：它從 1 一路減到 $-1$，的確一直變小！$\\sin$ 看的是上下。" },
        { t: "都不變", explain: "半徑的確一直是 1，這點沒錯！但「離中心的距離」不變，「高度」卻一直在變。" }
      ]
    },

    derive: {
      intro: "單位圓就是半徑 1 的圓。拖動圓上的蜜桃色點 $P$，看它的影子長度怎麼變成 $\\cos$ 和 $\\sin$。",
      tall: true,
      frames: [
        { cap: "從 $x$ 軸正向開始，逆時針轉 $\\theta$，到達單位圓上的點 $P$。$\\overline{OP}=1$。", tex: "\\overline{OP}=1" },
        { cap: "從正上方打光，$P$ 在 $x$ 軸上的<b>影子</b>長度就是 $\\cos\\theta$。", tex: "\\co{\\cos\\theta}=P\\text{ 的 }x\\text{ 坐標}" },
        { cap: "$P$ 離 $x$ 軸的<b>高度</b>就是 $\\sin\\theta$。所以 $P$ 的坐標是 $(\\cos\\theta,\\sin\\theta)$。", tex: "P=(\\co{\\cos\\theta},\\ \\cb{\\sin\\theta})" },
        { cap: "影子、高度和半徑圍成直角三角形，用畢氏定理就得到三角比最重要的關係。", tex: "\\co{\\cos^2\\theta}+\\cb{\\sin^2\\theta}=1^2" },
        { cap: "把 $OP$ 延長，碰到 $x=1$ 那條直立的線。碰到的高度就是 $\\tan\\theta$，也就是直線 $OP$ 的<b>斜率</b>。", tex: "\\cg{\\tan\\theta}=\\frac{\\cb{\\sin\\theta}}{\\co{\\cos\\theta}}=\\text{斜率}" },
        { cap: "把 $P$ 拖過 $90^\\circ$：影子跑到左邊，$\\cos\\theta$ 變成負的。定義完全沒變，只是坐標有正負，這就是<b>廣義角</b>。", tex: "90^\\circ<\\theta<180^\\circ:\\ \\co{\\cos\\theta}<0,\\ \\cb{\\sin\\theta}>0" }
      ],
      hint: "拖動圓上的蜜桃色點，任何一步都可以轉角度（鍵盤方向鍵也可以）。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 520, 460, "單位圓上的 cos、sin 與 tan");
        var g = s("g", {}, svg), hg = s("g", {}, svg);
        var cx = 240, cy = 240, R = 150;
        var st = { t: 50 };
        var read = SK.h("div", { class: "readout" });
        ctx.extra.appendChild(read);
        var hd = SK.handle(hg, 0, 0, C.orange.s, "單位圓上的點 P，拖動改變角度");
        SK.drag(svg, hd, function (x, y) {
          var t = SK.deg(Math.atan2(cy - y, x - cx)); if (t < 0) t += 360;
          st.t = Math.round(t); draw();
        }, null);
        hd.addEventListener("keydown", function (ev) {
          if (ev.key === "ArrowLeft" || ev.key === "ArrowDown") st.t = (st.t + 359) % 360;
          else if (ev.key === "ArrowRight" || ev.key === "ArrowUp") st.t = (st.t + 1) % 360; else return;
          ev.preventDefault(); draw();
        });
        function draw() {
          var f = ctx.frame, a = SK.rad(st.t), c = Math.cos(a), sn = Math.sin(a);
          var px = cx + R * c, py = cy - R * sn;
          g.innerHTML = "";
          s("line", { x1: 30, y1: cy, x2: 500, y2: cy, class: "m-axis" }, g);
          s("line", { x1: cx, y1: 20, x2: cx, y2: 450, class: "m-axis" }, g);
          SK.label(g, 500, cy - 12, "x", { it: true, size: 15 });
          SK.label(g, cx + 12, 26, "y", { it: true, size: 15 });
          s("circle", { cx: cx, cy: cy, r: R, fill: "rgba(241,226,184,.18)", stroke: C.line, "stroke-width": 2.2 }, g);
          SK.label(g, cx + R + 10, cy + 16, "1", { size: 13, color: C.soft });
          SK.label(g, cx - R - 14, cy + 16, "−1", { size: 13, color: C.soft });
          if (f >= 5) {
            [["I (+,+)", 1, 1], ["II (−,+)", -1, 1], ["III (−,−)", -1, -1], ["IV (+,−)", 1, -1]].forEach(function (q) {
              SK.label(g, cx + q[1] * 190, cy - q[2] * 190, q[0], { size: 13, color: C.soft });
            });
          }
          // 角度弧
          s("path", { d: SK.arcPath(cx, cy, 34, 0, a), fill: "none", stroke: C.purple.s, "stroke-width": 2 }, g);
          SK.label(g, cx + 50 * Math.cos(a / 2), cy - 50 * Math.sin(a / 2), "θ", { it: true, color: C.purple.s });
          if (f >= 3) s("path", { d: "M" + cx + " " + cy + " L" + px + " " + cy + " L" + px + " " + py + "Z", fill: C.gold.f, stroke: "none" }, g);
          if (f >= 4 && Math.abs(c) > .06) {
            var tn = sn / c, ty = cy - R * tn, tx = cx + R;
            if (Math.abs(tn) < 1.45) {
              s("line", { x1: tx, y1: 20, x2: tx, y2: 450, stroke: C.green.s, "stroke-dasharray": "3 5", "stroke-width": 1.4 }, g);
              s("line", { x1: cx, y1: cy, x2: tx, y2: ty, stroke: C.green.s, "stroke-width": 1.6, "stroke-dasharray": "6 4" }, g);
              s("line", { x1: tx, y1: cy, x2: tx, y2: ty, stroke: C.green.s, "stroke-width": 5, "stroke-linecap": "round" }, g);
              SK.label(g, tx + 14, (cy + ty) / 2, "tan θ", { size: 14, anchor: "start", color: C.green.s });
            } else {
              SK.label(g, cx + R + 14, 40, "tan θ 太大，超出畫面", { size: 12, anchor: "start", color: C.green.s });
            }
          }
          s("line", { x1: cx, y1: cy, x2: px, y2: py, stroke: C.ink, "stroke-width": 2.6 }, g);
          SK.label(g, (cx + px) / 2 - 12 * sn, (cy + py) / 2 - 12 * c, "1", { size: 14 });
          if (f >= 1) {
            s("line", { x1: px, y1: py, x2: px, y2: cy, stroke: C.line, "stroke-dasharray": "4 4" }, g);
            s("line", { x1: cx, y1: cy, x2: px, y2: cy, stroke: C.orange.s, "stroke-width": 6, "stroke-linecap": "round" }, g);
            SK.label(g, (cx + px) / 2, cy + (sn >= 0 ? 20 : -20), "cos θ", { size: 14, color: C.orange.s });
          }
          if (f >= 2) {
            s("line", { x1: px, y1: cy, x2: px, y2: py, stroke: C.blue.s, "stroke-width": 6, "stroke-linecap": "round" }, g);
            SK.label(g, px + (c >= 0 ? 12 : -12), (cy + py) / 2, "sin θ", { size: 14, anchor: c >= 0 ? "start" : "end", color: C.blue.s });
            if (Math.abs(c) > .05 && Math.abs(sn) > .05) SK.rightMark(g, px, cy, c >= 0 ? -1 : 1, 0, 0, sn >= 0 ? -1 : 1, 10);
          }
          hd.moveTo(px, py);
          read.innerHTML = SK.tex("\\theta=" + st.t + "^\\circ\\quad \\co{\\cos\\theta=" + SK.fmt(c, 3) + "}\\quad \\cb{\\sin\\theta=" + SK.fmt(sn, 3) + "}", true) +
            (f >= 3 ? SK.tex("\\co{(" + SK.fmt(c, 3) + ")^2}+\\cb{(" + SK.fmt(sn, 3) + ")^2}=" + SK.fmt(c * c + sn * sn, 3), true) : "") +
            (f >= 4 ? SK.tex(Math.abs(c) > 1e-6 ? "\\cg{\\tan\\theta=" + SK.fmt(sn / c, 3) + "}" : "\\cg{\\tan\\theta\\ \\text{不存在}}", true) : "");
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "把轉圈攤平，就變成波", icon: "sparkle", render: waveAngle },
      { title: "和國中的「對邊比斜邊」是同一件事", icon: "bulb", render: similarAngle }
    ],

    challenges: [
      { q: "在單位圓上找到 $\\theta$ 和 $180^\\circ-\\theta$ 兩個點。為什麼 $\\sin(180^\\circ-\\theta)=\\sin\\theta$，而 $\\cos(180^\\circ-\\theta)=-\\cos\\theta$？", hint: "這兩個點對 $y$ 軸有什麼關係？",
        idea: "兩點對 $y$ 軸鏡射：高度一樣，左右相反。一張圖就取代了一整頁的公式表。" },
      { q: "為什麼 $\\tan90^\\circ$ 不存在？在圖上看看發生了什麼事。", hint: "把 $P$ 拖到 $90^\\circ$ 附近，觀察延長線和 $x=1$ 那條線。",
        idea: "$OP$ 變成垂直時和 $x=1$ 平行，永遠碰不到；越接近 $90^\\circ$，交點就越飛越高。「不存在」不是規定，而是圖形上真的沒有交點。" },
      { q: "$\\sin\\theta+\\cos\\theta$ 最大可以是多少？在哪個角度？你能用圖說服別人嗎？", hint: "$\\sin\\theta+\\cos\\theta$ 是 $P$ 的坐標和，想想直線 $x+y=k$ 什麼時候剛好碰到圓。",
        idea: "直線 $x+y=k$ 往右上推，最後剛好和圓相切在 $45^\\circ$ 的位置，此時 $k=\\sqrt2$。11 年級數 A 會用「波的疊合」再看一次這個 $\\sqrt2$。" }
    ],

    where: {
      codes: [["G-10-5", "廣義角與極坐標：終邊、極坐標與直角坐標的轉換"], ["G-10-6", "三角比：銳角到廣義角的 sin、cos、tan，特殊角與計算機操作"]],
      exam: "高一共同必修，學測數 A、數 B 都在範圍內。「用投影看三角比」會一路用到正餘弦定理、向量內積、和角公式與波的模型。",
      stop: "高一只需要廣義角的 $\\sin$、$\\cos$、$\\tan$。三角函數圖形、弧度量是 11 年級的內容；$\\cot$、$\\sec$、$\\csc$ 的圖形屬於 `※` 延伸，不是全國考試核心。不必提前刷大量的恆等式化簡。"
    }
  });
})();
