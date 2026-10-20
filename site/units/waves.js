/* 單元：波的疊合（同頻正餘弦疊合） */
(function () {
  var C = SK.C, s = SK.s;

  function hookVisual(el) {
    var svg = SK.svg(el, 420, 240, "兩個同頻率的波相加");
    var X = function (t) { return 20 + t / (4 * Math.PI) * 380; };
    [[function (t) { return Math.sin(t); }, C.orange, 60], [function (t) { return Math.cos(t); }, C.blue, 60]].forEach(function (w) {
      var d = "";
      for (var t = 0; t <= 4 * Math.PI; t += .05) d += (t ? "L" : "M") + X(t) + " " + (w[2] - 30 * w[0](t));
      s("path", { d: d, fill: "none", stroke: w[1].s, "stroke-width": 2.2 }, svg);
    });
    var d2 = "";
    for (var t2 = 0; t2 <= 4 * Math.PI; t2 += .05) d2 += (t2 ? "L" : "M") + X(t2) + " " + (170 - 30 * (Math.sin(t2) + Math.cos(t2)));
    s("path", { d: d2, fill: "none", stroke: C.ink, "stroke-width": 2.2, "stroke-dasharray": "5 5" }, svg);
    SK.label(svg, 210, 118, "＋", { size: 22 });
    SK.label(svg, 210, 226, "加起來會是什麼形狀？", { size: 13, color: C.soft });
  }

  SK.mountUnit({
    slug: "waves",
    en: "Waves of the same frequency add up to a wave",
    formula: "\\co{a\\sin x}+\\cb{b\\cos x}=\\cg{r}\\sin(x+\\cv{\\varphi}),\\qquad \\cg{r}=\\sqrt{a^2+b^2}",

    hook: {
      html: "兩支一樣音高的音叉同時響，空氣裡是兩個「同頻率」的波疊在一起：一個像 $\\sin x$，一個像 $\\cos x$。",
      ask: "加起來之後，還是一個波嗎？會變大聲多少？",
      visual: hookVisual
    },

    guess: {
      q: "$\\sin x+\\cos x$ 的最大值是多少？",
      options: [
        { t: "2", common: true, explain: "兩個波最大都是 1，加起來 2，很合理的想法！可是它們不會同時到達最高點：$\\sin x=1$ 的時候 $\\cos x=0$。兩個波錯開了 $90^\\circ$。" },
        { t: "$\\sqrt2\\approx1.41$", truth: true, explain: "在 $x=45^\\circ$ 時兩者都是 $\\tfrac{\\sqrt2}{2}$，加起來 $\\sqrt2$，這就是最大值。等一下你會看到它是兩個互相垂直的箭頭合成的長度。" },
        { t: "1", explain: "每個波最大是 1，但兩個加起來可以超過 1，例如 $x=45^\\circ$ 時就有 $1.41$。" },
        { t: "沒有最大值", explain: "兩個波都被夾在 $-1$ 到 $1$ 之間，加起來最多也只到 $2$，所以一定有上限。" }
      ]
    },

    derive: {
      intro: "左邊是旋轉的箭頭，右邊是它們的高度隨時間畫出的波。拖動 $a$、$b$，或讓 $x$ 轉起來。",
      tall: true,
      frames: [
        { cap: "兩個同頻率的波：$a\\sin x$（蜜桃色）和 $b\\cos x$（灰藍色）。", tex: "\\co{a\\sin x},\\quad \\cb{b\\cos x}" },
        { cap: "每一個時刻把兩個高度相加，得到的曲線（黑色）看起來還是一個波，而且<b>頻率不變</b>。", tex: "y=\\co{a\\sin x}+\\cb{b\\cos x}" },
        { cap: "把波想成旋轉箭頭的<b>高度</b>：$a\\sin x$ 是長 $a$、轉到角度 $x$ 的箭頭；$b\\cos x=b\\sin(x+90^\\circ)$ 是長 $b$、<b>提前 $90^\\circ$</b> 的箭頭。", tex: "\\cb{b\\cos x}=b\\sin(x+90^\\circ)" },
        { cap: "兩個箭頭互相垂直、一起轉。頭尾相接，合成的箭頭長度用畢氏定理就是 $r=\\sqrt{a^2+b^2}$，角度比 $a$ 箭頭提前 $\\varphi$。", tex: "\\cg{r}=\\sqrt{a^2+b^2},\\quad \\cos\\varphi=\\frac ar,\\ \\sin\\varphi=\\frac br" },
        { cap: "高度可以相加，所以兩個波的和，就是合成箭頭的高度：一個振幅 $r$、相位提前 $\\varphi$ 的新波。用和角公式展開驗證也對。", tex: "\\begin{aligned}r\\sin(x+\\varphi)&=r\\cos\\varphi\\sin x+r\\sin\\varphi\\cos x\\\\&=\\co{a\\sin x}+\\cb{b\\cos x}\\end{aligned}" }
      ],
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 560, 400, "旋轉箭頭與波形");
        var g = s("g", {}, svg);
        var st = { a: 1.2, b: .9, x: .7 }, playing = false, raf = null;
        var cx = 135, cy = 200, u = 45, gx = 272, gw = 272;
        function GX(t) { return gx + t / (2 * Math.PI) * gw; }
        var read = SK.h("div", { class: "readout" });
        ["a", "b"].forEach(function (k, i) {
          ctx.sliders.appendChild(SK.slider({ label: "$" + k + "$", min: -2, max: 2, step: .1, value: st[k], color: i ? "blue" : "", onInput: function (v) { st[k] = v; draw(); } }).el);
        });
        var slX = SK.slider({ label: "$x$", min: 0, max: 6.28, step: .01, value: st.x, color: "green", fmt: function (v) { return SK.fmt(SK.deg(v), 0) + "°"; }, onInput: function (v) { st.x = v; draw(); } });
        ctx.sliders.appendChild(slX.el);
        var btn = SK.h("button", { class: "btn small ghost", type: "button" }, "▶ 轉起來");
        btn.addEventListener("click", function () {
          playing = !playing; btn.textContent = playing ? "❚❚ 暫停" : "▶ 轉起來";
          if (playing) (function step() { if (!playing) return; st.x = (st.x + .03) % (2 * Math.PI); slX.set(st.x, true); draw(); raf = requestAnimationFrame(step); })();
          else cancelAnimationFrame(raf);
        });
        ctx.extra.appendChild(btn); ctx.extra.appendChild(read);
        function draw() {
          var f = ctx.frame, a = st.a, b = st.b, x = st.x, r = Math.hypot(a, b), ph = Math.atan2(b, a);
          g.innerHTML = "";
          s("line", { x1: 20, y1: cy, x2: 550, y2: cy, class: "m-axis" }, g);
          s("line", { x1: gx, y1: cy - 150, x2: gx, y2: cy + 150, class: "m-axis" }, g);
          [Math.PI / 2, Math.PI, 1.5 * Math.PI, 2 * Math.PI].forEach(function (t, i) { SK.label(g, GX(t), cy + 16, ["90°", "180°", "270°", "360°"][i], { size: 11, color: C.soft }); });
          function wave(fn, col, w, dash) {
            var d = "";
            for (var t = 0; t <= 2 * Math.PI + .001; t += .04) d += (t ? "L" : "M") + GX(t) + " " + (cy - u * fn(t));
            s("path", { d: d, fill: "none", stroke: col, "stroke-width": w, "stroke-dasharray": dash || null }, g);
          }
          wave(function (t) { return a * Math.sin(t); }, C.orange.s, 2);
          wave(function (t) { return b * Math.cos(t); }, C.blue.s, 2);
          if (f >= 1) wave(function (t) { return a * Math.sin(t) + b * Math.cos(t); }, C.ink, 3);
          s("line", { x1: GX(x), y1: cy - 150, x2: GX(x), y2: cy + 150, stroke: C.green.s, "stroke-dasharray": "3 4" }, g);
          // 左邊：旋轉箭頭
          if (f >= 2) {
            s("circle", { cx: cx, cy: cy, r: Math.max(Math.abs(a), .05) * u, fill: "none", stroke: C.orange.f, "stroke-width": 1.2, "stroke-dasharray": "3 4" }, g);
            var A = [cx + a * u * Math.cos(x), cy - a * u * Math.sin(x)];
            SK.arrow(g, cx, cy, A[0], A[1], C.orange.s, 3);
            var Bv = [b * u * Math.cos(x + Math.PI / 2), -b * u * Math.sin(x + Math.PI / 2)];
            if (f === 2) SK.arrow(g, cx, cy, cx + Bv[0], cy + Bv[1], C.blue.s, 3);
            else SK.arrow(g, A[0], A[1], A[0] + Bv[0], A[1] + Bv[1], C.blue.s, 3);
            if (f >= 3) {
              var P = [A[0] + Bv[0], A[1] + Bv[1]];
              s("circle", { cx: cx, cy: cy, r: r * u, fill: "none", stroke: C.green.s, "stroke-width": 1.2, "stroke-dasharray": "5 4" }, g);
              SK.arrow(g, cx, cy, P[0], P[1], C.green.s, 3.6);
              s("line", { x1: P[0], y1: P[1], x2: GX(x), y2: P[1], stroke: C.green.s, "stroke-dasharray": "4 4", "stroke-width": 1.2 }, g);
              s("circle", { cx: GX(x), cy: P[1], r: 5, fill: C.green.f, stroke: C.cocoa, "stroke-width": 1.2 }, g);
              SK.label(g, cx, cy + r * u + 18, "r = " + SK.fmt(r, 2), { size: 13, color: C.green.s });
            }
          } else {
            SK.label(g, cx, cy - 20, "（第 3 步起，", { size: 12, color: C.soft });
            SK.label(g, cx, cy + 2, "這裡會出現", { size: 12, color: C.soft });
            SK.label(g, cx, cy + 24, "旋轉箭頭）", { size: 12, color: C.soft });
          }
          read.innerHTML = SK.tex(SK.fmt(a, 1) + "\\sin x" + (b >= 0 ? "+" : "") + SK.fmt(b, 1) + "\\cos x=" + SK.fmt(r, 3) + "\\sin(x" + (ph >= 0 ? "+" : "") + SK.fmt(SK.deg(ph), 1) + "^\\circ)", true);
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "為什麼頻率不會變", icon: "sparkle",
        html: "兩個箭頭<b>用同一個速度</b>一起轉，所以它們的相對位置永遠固定，合成箭頭也用同一個速度轉。這就是「同頻率相加還是同頻率」的原因。如果兩個頻率不同，例如 $\\sin x+\\sin2x$，箭頭一快一慢，合成箭頭的長度會一直變，就不再是單一的正弦波了。" },
      { title: "抗噪耳機的原理", icon: "leaf",
        html: "如果兩個波振幅一樣、相位差 $180^\\circ$：$a\\sin x+a\\sin(x+\\pi)=0$，兩個箭頭剛好指向相反方向，合成長度是 0。抗噪耳機就是聽到外面的噪音後，即時播放一個相位相反的聲波，讓兩者互相抵消。" }
    ],

    challenges: [
      { q: "$3\\sin x+4\\cos x$ 的最大值和最小值是多少？", idea: "$r=\\sqrt{3^2+4^2}=5$，所以介於 $-5$ 和 $5$ 之間。兩個箭頭 3 和 4 互相垂直，合成長度是 5。" },
      { q: "把 $\\sqrt3\\sin x-\\cos x$ 寫成 $r\\sin(x+\\varphi)$ 的形式。", hint: "$a=\\sqrt3$、$b=-1$，先算 $r$，再找 $\\cos\\varphi=\\frac ar$、$\\sin\\varphi=\\frac br$。",
        idea: "$r=2$，$\\cos\\varphi=\\frac{\\sqrt3}{2}$、$\\sin\\varphi=-\\frac12$，所以 $\\varphi=-30^\\circ$，得到 $2\\sin(x-30^\\circ)$。" },
      { q: "「三角比與單位圓」單元的挑戰問過 $\\sin\\theta+\\cos\\theta$ 的最大值。用今天的箭頭看法，你能一眼看出答案嗎？", idea: "$a=b=1$，兩個長度 1 的垂直箭頭，合成長度 $\\sqrt2$，最大值就是 $\\sqrt2$，發生在合成箭頭指向正上方時，也就是 $x=45^\\circ$。" }
    ],

    where: {
      codes: [["F-11A-2", "同頻正餘弦波的疊合、頻率與振幅"]],
      exam: "11 年級<b>數學 A</b>，學測數 A、分科數甲都在範圍內。數學 B 不含這個單元。前置是 `G-11A-5` 和角公式與 `F-11A-1` 三角函數圖形。",
      stop: "只處理<b>同頻率</b>的正弦、餘弦疊合，重點是振幅、週期與相位的意義，而不是恆等變形。不同頻率的拍頻、傅立葉分析只作欣賞。"
    }
  });
})();
