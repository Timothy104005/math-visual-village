/* 單元：週期性數學模型 */
(function () {
  var C = SK.C, s = SK.s;

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 250, "摩天輪");
    var cx = 130, cy = 115, R = 85;
    s("circle", { cx: cx, cy: cy, r: R, fill: "none", stroke: C.cocoa, "stroke-width": 2 }, svg);
    for (var k = 0; k < 8; k++) {
      var a = k * Math.PI / 4, x = cx + R * Math.cos(a), y = cy - R * Math.sin(a);
      s("line", { x1: cx, y1: cy, x2: x, y2: y, stroke: C.line }, svg);
      s("rect", { x: x - 9, y: y - 6, width: 18, height: 14, rx: 4, fill: k === 1 ? C.orange.f : C.blue.f, stroke: C.cocoa }, svg);
    }
    s("path", { d: "M" + (cx - 40) + " 235 L" + cx + " " + cy + " L" + (cx + 40) + " 235", fill: "none", stroke: C.cocoa, "stroke-width": 2 }, svg);
    s("line", { x1: 20, y1: 235, x2: 390, y2: 235, stroke: C.cocoa }, svg);
    SK.label(svg, 310, 100, "橘色車廂的高度", { size: 13, color: C.orange.s });
    SK.label(svg, 310, 122, "隨時間怎麼變？", { size: 13, color: C.orange.s });
  }

  SK.mountUnit({
    slug: "periodic-model",
    en: "The height of a Ferris wheel car",
    formula: "y=\\cg k+\\co A\\sin\\!\\left(\\frac{2\\pi}{\\cb T}\\,t\\right)\\qquad(\\co A\\text{ 振幅},\\ \\cb T\\text{ 週期},\\ \\cg k\\text{ 中心高度})",

    hook: {
      html: "摩天輪等速旋轉。坐在車廂裡，你的高度一下升高、一下降低，而且每轉一圈就重複一次。",
      ask: "高度隨時間的變化，能不能用一個函數描述？半徑、轉一圈的時間、中心的高度，各會出現在函數的哪裡？",
      visual: hookVisual
    },

    guess: {
      q: "摩天輪中心離地 60 公尺、半徑 50 公尺，轉一圈 20 分鐘。車廂離地最高、最低各是多少？",
      options: [
        { t: "最高 110 公尺、最低 10 公尺", truth: true, explain: "最高是中心往上一個半徑：$60+50=110$；最低是往下一個半徑：$60-50=10$。高度在中心高度上下擺動，擺動的幅度（振幅）就是半徑。" },
        { t: "最高 110 公尺、最低 0 公尺", common: true, explain: "很多人會以為最低點在地面上！但中心離地 60 公尺、半徑只有 50 公尺，最低點離地還有 10 公尺，乘客才能走進車廂。" },
        { t: "最高 60 公尺、最低 10 公尺", explain: "60 公尺是中心的高度，也就是高度變化的「中線」，不是最高點。" },
        { t: "和轉一圈的時間有關", explain: "轉得快或慢，只影響多久到達最高點（週期），不影響最高、最低的位置。" }
      ]
    },

    derive: {
      intro: "按「轉起來」或拖動時間滑桿，看車廂的高度怎麼畫成右邊的曲線。第 2～4 步可以改半徑、中心高度、週期。",
      tall: true,
      frames: [
        { cap: "車廂從和中心同高的位置出發，逆時針轉。轉過的角度隨時間均勻增加；高度就是「中心高度 + 半徑 × sin(角度)」。把高度對時間畫圖，就是一條正弦曲線。", tex: "\\text{高度}=k+A\\sin(\\text{轉過的角度})" },
        { cap: "<b>振幅</b> $A$ 是最高點（或最低點）離中線的距離，也就是半徑；<b>中線</b> $y=k$ 是中心高度。最高 $k+A$、最低 $k-A$。", tex: "\\text{最高}=k+A,\\qquad \\text{最低}=k-A" },
        { cap: "<b>週期</b> $T$：轉一圈、曲線重複一次所花的時間。每經過 $T$，角度增加 $2\\pi$，所以角度是 $\\tfrac{2\\pi}{T}t$。<b>頻率</b> $\\tfrac1T$ 是每單位時間轉幾圈。", tex: "\\text{角度}=\\frac{2\\pi}{T}t,\\qquad \\text{頻率}=\\frac1T" },
        { cap: "合起來就是週期模型 $y=k+A\\sin\\left(\\tfrac{2\\pi}{T}t\\right)$。和 $y=\\sin t$ 比：上下拉長 $A$ 倍、左右伸縮讓週期變成 $T$、再往上平移 $k$。", tex: "y=\\cg k+\\co A\\sin\\!\\left(\\frac{2\\pi}{\\cb T}t\\right)" },
        { cap: "生活中的週期現象：日照長度、潮汐、氣溫、聲音。圖是台北各月白天長度的<b>近似</b>資料和一條正弦模型：中線約 12.1 小時、振幅約 1.6 小時、週期 12 個月（$m$ 是月份）。", tex: "y\\approx12.1+1.6\\sin\\!\\left(\\frac{2\\pi}{12}(m-3.2)\\right)" }
      ],
      hint: "按「轉起來」看動畫；也可以拖動時間 t。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 540, 440, "摩天輪與高度曲線");
        var g = s("g", {}, svg);
        var st = { t: 3, A: 50, k: 60, T: 20 }, playing = false, raf = null;
        var read = SK.h("div", { class: "readout" });
        var sT0 = SK.slider({ label: "時間 $t$", min: 0, max: 40, step: .1, value: st.t, fmt: function (v) { return SK.fmt(v, 1) + " 分"; }, onInput: function (v) { st.t = v; draw(); } });
        var sA = SK.slider({ label: "半徑 $A$", min: 10, max: 60, step: 5, value: st.A, fmt: function (v) { return v + " m"; }, onInput: function (v) { st.A = Math.min(v, st.k); if (st.A !== v) sA.set(st.A, true); draw(); } });
        var sk = SK.slider({ label: "中心 $k$", min: 20, max: 80, step: 5, value: st.k, color: "green", fmt: function (v) { return v + " m"; }, onInput: function (v) { st.k = v; if (st.k - st.A < 0) { st.A = st.k; sA.set(st.A, true); } draw(); } });
        var sT = SK.slider({ label: "週期 $T$", min: 5, max: 40, step: 1, value: st.T, color: "blue", fmt: function (v) { return v + " 分"; }, onInput: function (v) { st.T = v; draw(); } });
        [sT0, sA, sk, sT].forEach(function (o) { ctx.sliders.appendChild(o.el); });
        var btn = SK.h("button", { class: "btn small ghost", type: "button" }, "▶ 轉起來");
        btn.addEventListener("click", function () {
          playing = !playing; btn.textContent = playing ? "❚❚ 暫停" : "▶ 轉起來";
          if (playing) (function step() { if (!playing) return; st.t = (st.t + .08) % 40; sT0.set(st.t, true); draw(); raf = requestAnimationFrame(step); })();
          else cancelAnimationFrame(raf);
        });
        ctx.extra.appendChild(btn); ctx.extra.appendChild(read);
        function num(v, d) { return SK.fmt(v, d == null ? 1 : d).replace("−", "-"); }
        // 台北各月白天長度（小時，約略值）
        var DAY = [10.6, 11.2, 12.0, 12.8, 13.4, 13.7, 13.5, 13.0, 12.3, 11.5, 10.8, 10.5];
        function draw() {
          var f = ctx.frame, A = st.A, k = st.k, T = st.T, t = st.t;
          g.innerHTML = "";
          sA.el.style.display = sk.el.style.display = f >= 1 && f <= 3 ? "" : "none";
          sT.el.style.display = f >= 2 && f <= 3 ? "" : "none";
          sT0.el.style.display = btn.style.display = f === 4 ? "none" : "";
          if (f === 4) {
            var X = function (m) { return 70 + (m - .5) / 12 * 440; }, Y = function (h) { return 380 - (h - 9.5) / 5 * 320; };
            s("line", { x1: 60, y1: Y(9.5), x2: 520, y2: Y(9.5), class: "m-axis" }, g);
            s("line", { x1: 60, y1: 40, x2: 60, y2: Y(9.5), class: "m-axis" }, g);
            [10, 11, 12, 13, 14].forEach(function (h) { s("line", { x1: 60, y1: Y(h), x2: 520, y2: Y(h), class: "m-grid" }, g); SK.label(g, 52, Y(h), h + " 時", { size: 11, color: C.soft, anchor: "end" }); });
            for (var m = 1; m <= 12; m++) SK.label(g, X(m), Y(9.5) + 16, m + "月", { size: 10, color: C.soft });
            s("line", { x1: 60, y1: Y(12.1), x2: 520, y2: Y(12.1), stroke: C.green.s, "stroke-dasharray": "6 4" }, g);
            var d = "";
            for (var mm = .5; mm <= 12.5; mm += .05) d += (mm === .5 ? "M" : "L") + X(mm) + " " + Y(12.1 + 1.6 * Math.sin(2 * Math.PI / 12 * (mm - 3.2)));
            s("path", { d: d, fill: "none", stroke: C.purple.s, "stroke-width": 2.6 }, g);
            DAY.forEach(function (h, i) { s("circle", { cx: X(i + 1), cy: Y(h), r: 6, fill: C.orange.f, stroke: C.orange.s, "stroke-width": 1.6 }, g); });
            SK.label(g, 290, 28, "橘點：各月約略的白天長度　紫線：正弦模型", { size: 12, color: C.soft });
            read.innerHTML = SK.tex("\\text{中線 }12.1,\\ \\text{振幅}\\approx1.6,\\ \\text{週期 }12\\ \\text{個月}", true);
            return;
          }
          if (f < 1) { A = 50; k = 60; }
          if (f < 2) T = 20;
          // 左：摩天輪（比例尺 1 m = 2.4 px）
          var sc = 2.2, gy = 400, cx = 125, cy = gy - k * sc, R = A * sc, ang = 2 * Math.PI * t / T;
          s("line", { x1: 10, y1: gy, x2: 530, y2: gy, stroke: C.cocoa, "stroke-width": 1.4 }, g);
          s("path", { d: "M" + (cx - 36) + " " + gy + " L" + cx + " " + cy + " L" + (cx + 36) + " " + gy, fill: "none", stroke: C.line, "stroke-width": 2 }, g);
          s("circle", { cx: cx, cy: cy, r: R, fill: "none", stroke: C.cocoa, "stroke-width": 1.6 }, g);
          for (var q = 0; q < 8; q++) { var aa = ang + q * Math.PI / 4; s("line", { x1: cx, y1: cy, x2: cx + R * Math.cos(aa), y2: cy - R * Math.sin(aa), stroke: C.line }, g); }
          var Px = cx + R * Math.cos(ang), Py = cy - R * Math.sin(ang);
          s("rect", { x: Px - 9, y: Py - 7, width: 18, height: 14, rx: 4, fill: C.orange.s }, g);
          if (f >= 1) {
            s("line", { x1: cx, y1: cy, x2: 520, y2: cy, stroke: C.green.s, "stroke-dasharray": "6 4" }, g);
            SK.label(g, 516, cy - 10, "中線 y = " + k, { size: 11, color: C.green.s, anchor: "end" });
            [k + A, k - A].forEach(function (h) { s("line", { x1: cx, y1: gy - h * sc, x2: 520, y2: gy - h * sc, stroke: C.line, "stroke-dasharray": "2 4" }, g); });
            s("line", { x1: cx, y1: cy, x2: cx, y2: cy - R, stroke: C.orange.s, "stroke-width": 3 }, g);
            SK.label(g, cx + 8, cy - R / 2, "A = " + A, { size: 12, color: C.orange.s, anchor: "start" });
          }
          // 右：高度曲線（橫軸 0～40 分鐘）
          var gx = 265, gw = 260, X2 = function (tt) { return gx + tt / 40 * gw; };
          s("line", { x1: gx, y1: gy, x2: gx, y2: 30, class: "m-axis" }, g);
          [10, 20, 30, 40].forEach(function (tt) { SK.label(g, X2(tt), gy + 14, tt + " 分", { size: 10, color: C.soft }); });
          var d2 = "";
          for (var tt = 0; tt <= 40; tt += .1) d2 += (tt ? "L" : "M") + X2(tt).toFixed(1) + " " + (gy - (k + A * Math.sin(2 * Math.PI * tt / T)) * sc).toFixed(1);
          s("path", { d: d2, fill: "none", stroke: C.purple.s, "stroke-width": 2.4, opacity: .35 }, g);
          var d3 = "";
          for (var t3 = 0; t3 <= t; t3 += .1) d3 += (t3 ? "L" : "M") + X2(t3).toFixed(1) + " " + (gy - (k + A * Math.sin(2 * Math.PI * t3 / T)) * sc).toFixed(1);
          s("path", { d: d3, fill: "none", stroke: C.purple.s, "stroke-width": 3 }, g);
          s("line", { x1: Px, y1: Py, x2: X2(t), y2: Py, stroke: C.orange.s, "stroke-dasharray": "3 4" }, g);
          s("circle", { cx: X2(t), cy: Py, r: 5, fill: C.orange.s }, g);
          if (f >= 2 && T <= 40) {
            SK.brace(g, X2(T / 4 + T), gy - (k + A) * sc - 8, X2(T / 4), gy - (k + A) * sc - 8, 10, C.blue.s);
            SK.label(g, X2(T / 4 + T / 2), gy - (k + A) * sc - 30, "週期 T = " + T, { size: 12, color: C.blue.s });
          }
          var h = k + A * Math.sin(ang);
          read.innerHTML = SK.tex("y=" + k + "+" + A + "\\sin\\left(\\frac{2\\pi}{" + T + "}\\times" + num(t) + "\\right)=" + num(h) + "\\ \\text{m}", true);
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "頻率：聲音的高低", icon: "sparkle",
        html: "音叉的「La」每秒振動 440 次，頻率 440 Hz，週期 $\\tfrac1{440}$ 秒。頻率加倍（880 Hz）就是高八度。振幅則決定聲音的大小。同一個正弦模型，在聲學裡：$A$ 是響度，$\\tfrac1T$ 是音高。" },
      { title: "為什麼是正弦？", icon: "leaf",
        html: "只要是「等速轉圈」的東西，它在某個方向上的投影就是正弦曲線：摩天輪、地球自轉帶來的日夜、月球繞地球帶來的潮汐。很多週期現象背後都藏著一個看不見的圓周運動，所以正弦函數特別常出現。" }
    ],

    challenges: [
      { q: "摩天輪中心離地 45 公尺、半徑 40 公尺、每 15 分鐘轉一圈。寫出高度模型（從中線高度開始往上轉）。", idea: "$y=45+40\\sin\\left(\\tfrac{2\\pi}{15}t\\right)$。最高 85 公尺、最低 5 公尺。" },
      { q: "某港口一天兩次滿潮，滿潮水深 8 公尺、乾潮 2 公尺。振幅、中線、週期各是多少？", idea: "中線 $\\tfrac{8+2}{2}=5$，振幅 $\\tfrac{8-2}{2}=3$，週期約 12 小時（一天兩次）。" },
      { q: "$y=3+2\\sin(4t)$ 的最大值、最小值、週期是多少？", idea: "最大 5、最小 1、週期 $\\tfrac{2\\pi}{4}=\\tfrac\\pi2$。" }
    ],

    where: {
      codes: [["F-11B-1", "週期性數學模型：正弦函數的圖形與週期性、振幅、週期、頻率，以及生活中的週期現象"]],
      exam: "11 年級<b>數學 B</b>，學測數 B 常以素養情境出現。數學 A 的三角函數圖形見「三角函數的圖形」。",
      stop: "數 B 只學<b>正弦函數</b>，不含餘弦、正切的圖形。$y=k+A\\sin(\\omega t+\\varphi)$ 只要理解伸縮與平移的意義，不考變換的操作順序或求平移量。"
    }
  });
})();
