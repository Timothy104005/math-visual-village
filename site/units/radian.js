/* 單元：弧度量 */
(function () {
  var C = SK.C, s = SK.s;
  var PAL = [C.orange, C.blue, C.green, C.gold, C.pink, C.purple, C.mint];

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 280, "一條和半徑等長的繩子沿圓周貼上");
    var cx = 200, cy = 150, R = 100;
    s("circle", { cx: cx, cy: cy, r: R, fill: "none", stroke: C.line, "stroke-width": 1.6 }, svg);
    s("line", { x1: cx, y1: cy, x2: cx + R, y2: cy, stroke: C.ink, "stroke-width": 2.4 }, svg);
    s("path", { d: SK.arcPath(cx, cy, R, 0, 1), fill: "none", stroke: C.orange.s, "stroke-width": 6, "stroke-linecap": "round" }, svg);
    s("line", { x1: cx, y1: cy, x2: cx + R * Math.cos(1), y2: cy - R * Math.sin(1), stroke: C.ink, "stroke-width": 1.6, "stroke-dasharray": "5 4" }, svg);
    s("path", { d: SK.arcPath(cx, cy, 26, 0, 1), fill: "none", stroke: C.purple.s, "stroke-width": 2 }, svg);
    SK.label(svg, cx + R / 2, cy + 16, "半徑 r", { size: 13 });
    SK.label(svg, cx + R + 26, cy - 50, "長度也是 r", { size: 13, anchor: "start", color: C.orange.s });
    SK.label(svg, cx + 40, cy - 16, "?", { size: 16, color: C.purple.s });
  }

  function convertAngle(el) {
    var wrap = SK.h("div", { class: "two-col" });
    var left = SK.h("div", { class: "stage" }), side = SK.h("div", { class: "sliders" });
    wrap.appendChild(left); wrap.appendChild(side); el.appendChild(wrap);
    var svg = SK.svg(left, 300, 240, "角度與弧度換算");
    var g = s("g", {}, svg), stt = { d: 135 };
    function frac(deg) {
      // 以 π 的分數表示（分母取 1,2,3,4,6,12）
      for (var den of [1, 2, 3, 4, 6, 12]) { var num = deg * den / 180; if (Math.abs(num - Math.round(num)) < 1e-9) { num = Math.round(num); if (num === 0) return "0"; return (num === 1 ? "" : num) + "\\pi" + (den === 1 ? "" : "/" + den); } }
      return null;
    }
    function draw() {
      g.innerHTML = "";
      var a = SK.rad(stt.d), cx = 150, cy = 130, R = 90;
      s("circle", { cx: cx, cy: cy, r: R, fill: "rgba(241,226,184,.3)", stroke: C.line, "stroke-width": 1.4 }, g);
      s("path", { d: "M" + cx + " " + cy + " L" + (cx + R) + " " + cy + " " + SK.arcPath(cx, cy, R, 0, a).replace(/^M[^A]*/, "") + "Z", fill: C.orange.f, stroke: C.orange.s, "stroke-width": 1.4 }, g);
      SK.label(g, cx, cy + R + 22, stt.d + "°", { size: 14 });
      var fr = frac(stt.d), rad = a;
      side.querySelector(".readout").innerHTML = SK.tex(stt.d + "^\\circ=" + stt.d + "\\times\\frac{\\pi}{180}=" + (fr ? fr + "\\approx" : "") + SK.fmt(rad, 3) + "\\ \\text{弧度}", true);
    }
    side.appendChild(SK.slider({ label: "角度", min: 0, max: 360, step: 15, value: stt.d, fmt: function (v) { return v + "°"; }, onInput: function (v) { stt.d = v; draw(); } }).el);
    side.insertAdjacentHTML("beforeend", '<div class="readout"></div><p class="muted" style="margin:0;font-size:.95rem">' +
      SK.md("關鍵只有一句：半圓 $=180^\\circ=\\pi$ 弧度。其他的都按比例換算：$90^\\circ$ 是半圓的一半，也就是 $\\dfrac\\pi2$。") + "</p>");
    draw();
  }

  SK.mountUnit({
    slug: "radian",
    en: "Measure the angle with the radius",
    formula: "\\cv{\\theta}=\\frac{\\co{s}}{\\cb{r}},\\qquad \\co{s}=\\cb{r}\\cv{\\theta},\\qquad \\text{扇形面積}=\\tfrac12\\cb{r}^2\\cv{\\theta}",

    hook: {
      html: "拿一條和半徑<b>一樣長</b>的繩子，沿著圓周貼上去，兩端各連回圓心，就張出一個角。",
      ask: "這個角大約幾度？一整圈可以貼幾條這樣的繩子？",
      visual: hookVisual
    },

    guess: {
      q: "一整圈的圓周，可以貼上幾條「和半徑一樣長」的弧？",
      options: [
        { t: "剛好 6 條", common: true, explain: "很好的直覺！圓內接正六邊形的每一邊都等於半徑，所以你可能想到 6。可是弧是彎的，比弦長一點點，所以 6 條弧貼完還會剩一小段。" },
        { t: "大約 6.28 條", truth: true, explain: "圓周長是 $2\\pi r$，除以 $r$ 就是 $2\\pi\\approx6.28$。所以一整圈是 $2\\pi$ 弧度，貼完 6 條還剩 0.28 條。" },
        { t: "360 條", explain: "360 是角度制把一圈切成的份數，那是古人選的數字。這裡的單位是「一條半徑長」，數量由圓自己決定。" },
        { t: "看圓的大小而定", explain: "大圓的弧長和半徑一起變大，比例不會變，所以不管圓多大都一樣。這正是弧度好用的原因。" }
      ]
    },

    derive: {
      intro: "拖動滑桿改變半徑 $r$ 和角度 $\\theta$，看弧長、半徑和角度之間的關係。",
      frames: [
        { cap: "角度制把一圈切成 360 份，這是人類約定的數字，和圓本身無關。", tex: "\\text{一圈}=360^\\circ" },
        { cap: "改用圓自己的尺：沿著圓周量出和半徑一樣長的弧，它張開的角就叫 <b>1 弧度</b>，大約 $57.3^\\circ$。", tex: "\\co{s}=\\cb{r}\\ \\Rightarrow\\ \\theta=1\\ \\text{弧度}\\approx57.3^\\circ" },
        { cap: "一段一段貼下去：一整圈可以貼 $2\\pi\\approx6.28$ 段，所以一整圈是 $2\\pi$ 弧度，半圈是 $\\pi$。", tex: "360^\\circ=2\\pi,\\qquad 180^\\circ=\\pi" },
        { cap: "任意角：弧度就是「弧長有幾個半徑長」。把半徑放大，弧長跟著放大，比值不變。", tex: "\\cv{\\theta}=\\frac{\\co{s}}{\\cb{r}}" },
        { cap: "所以弧長公式變得超簡單，扇形面積也是：它占整個圓的 $\\frac{\\theta}{2\\pi}$。", tex: "\\co{s}=\\cb{r}\\cv{\\theta},\\qquad A=\\frac{\\theta}{2\\pi}\\cdot\\pi r^2=\\tfrac12r^2\\theta" }
      ],
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 520, 440, "用半徑量角的弧度");
        var g = s("g", {}, svg);
        var st = { r: 1.2, t: 2.2 };
        var slR = SK.slider({ label: "$r$", min: .6, max: 1.5, step: .05, value: st.r, color: "blue", onInput: function (v) { st.r = v; draw(); } });
        var slT = SK.slider({ label: "$\\theta$", min: .1, max: 6.28, step: .01, value: st.t, fmt: function (v) { return SK.fmt(v, 2) + " rad"; }, onInput: function (v) { st.t = v; draw(); } });
        ctx.sliders.appendChild(slR.el); ctx.sliders.appendChild(slT.el);
        var read = SK.h("div", { class: "readout" });
        ctx.extra.appendChild(read);
        function draw() {
          var f = ctx.frame, cx = 260, cy = 220, R = st.r * 130;
          g.innerHTML = "";
          s("circle", { cx: cx, cy: cy, r: R, fill: "rgba(241,226,184,.25)", stroke: C.line, "stroke-width": 1.6 }, g);
          s("line", { x1: cx, y1: cy, x2: cx + R, y2: cy, stroke: C.blue.s, "stroke-width": 3 }, g);
          SK.label(g, cx + R / 2, cy + 16, "r", { it: true, color: C.blue.s });
          if (f === 0) {
            for (var k = 0; k < 36; k++) { var a = k * Math.PI / 18; s("line", { x1: cx + (R - 8) * Math.cos(a), y1: cy - (R - 8) * Math.sin(a), x2: cx + R * Math.cos(a), y2: cy - R * Math.sin(a), stroke: C.cocoa, "stroke-width": 1 }, g); }
            SK.label(g, cx, cy - R - 20, "360 等分（每格 10°）", { size: 13, color: C.soft });
          } else if (f === 1) {
            s("path", { d: SK.arcPath(cx, cy, R, 0, 1), fill: "none", stroke: C.orange.s, "stroke-width": 7, "stroke-linecap": "round" }, g);
            s("line", { x1: cx, y1: cy, x2: cx + R * Math.cos(1), y2: cy - R * Math.sin(1), stroke: C.ink, "stroke-width": 1.8 }, g);
            s("path", { d: SK.arcPath(cx, cy, 30, 0, 1), fill: "none", stroke: C.purple.s, "stroke-width": 2 }, g);
            SK.label(g, cx + 48, cy - 22, "1 rad", { size: 13, color: C.purple.s });
            SK.label(g, cx + R * Math.cos(.5) + 30, cy - R * Math.sin(.5), "弧長 = r", { size: 13, anchor: "start", color: C.orange.s });
          } else if (f === 2) {
            for (var i = 0; i < 7; i++) {
              var a0 = i, a1 = Math.min(i + 1, 2 * Math.PI);
              if (a0 >= 2 * Math.PI) break;
              s("path", { d: SK.arcPath(cx, cy, R, a0, a1 - .03), fill: "none", stroke: PAL[i].s, "stroke-width": 7, "stroke-linecap": "round" }, g);
              var am = (a0 + a1) / 2;
              SK.label(g, cx + (R + 22) * Math.cos(am), cy - (R + 22) * Math.sin(am), i < 6 ? String(i + 1) : "0.28", { size: 13, color: PAL[i].s });
            }
          } else {
            var t = st.t, end = [cx + R * Math.cos(t), cy - R * Math.sin(t)];
            if (f >= 4) s("path", { d: "M" + cx + " " + cy + " L" + (cx + R) + " " + cy + " " + SK.arcPath(cx, cy, R, 0, t).replace(/^M[^A]*/, "") + "Z", fill: C.orange.f, stroke: "none" }, g);
            s("path", { d: SK.arcPath(cx, cy, R, 0, t), fill: "none", stroke: C.orange.s, "stroke-width": 7, "stroke-linecap": "round" }, g);
            s("line", { x1: cx, y1: cy, x2: end[0], y2: end[1], stroke: C.ink, "stroke-width": 1.8 }, g);
            s("path", { d: SK.arcPath(cx, cy, 30, 0, t), fill: "none", stroke: C.purple.s, "stroke-width": 2 }, g);
            SK.label(g, cx + 48 * Math.cos(t / 2), cy - 48 * Math.sin(t / 2), "θ", { it: true, color: C.purple.s });
            SK.label(g, cx + (R + 28) * Math.cos(t / 2), cy - (R + 28) * Math.sin(t / 2), "s", { it: true, color: C.orange.s });
          }
          slT.el.style.display = f >= 3 ? "" : "none";
          var s1 = st.r * st.t;
          read.innerHTML = f >= 3 ? SK.tex("\\theta=" + SK.fmt(st.t, 2) + "\\approx" + SK.fmt(SK.deg(st.t), 1) + "^\\circ,\\ \\ s=" + SK.fmt(st.r, 2) + "\\times" + SK.fmt(st.t, 2) + "=" + SK.fmt(s1, 3) + (f >= 4 ? ",\\ \\ A=" + SK.fmt(.5 * st.r * st.r * st.t, 3) : ""), true)
            : SK.tex("1\\ \\text{弧度}=\\frac{180^\\circ}{\\pi}\\approx57.3^\\circ", true);
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "角度與弧度換算", icon: "sparkle", render: convertAngle },
      { title: "為什麼微積分只用弧度", icon: "leaf",
        html: "用弧度量角時，小角度有一個漂亮的性質：$\\sin\\theta\\approx\\theta$。例如 $\\sin0.1=0.0998\\ldots$，幾乎就是 $0.1$。圖上看，很小的弧和它對應的高度幾乎一樣長。用角度制就會多出一個 $\\frac{\\pi}{180}$ 的換算常數：$\\sin1^\\circ\\approx0.01745$。所以到了微積分，$\\sin x$ 的導數在弧度下才會剛好是 $\\cos x$，公式裡沒有多餘的常數。" }
    ],

    challenges: [
      { q: "半徑 2 公尺的輪子轉了 0.3 弧度，輪緣走了多遠？", idea: "$s=r\\theta=2\\times0.3=0.6$ 公尺。用角度制就得先換算，弧度一步就完成。" },
      { q: "時鐘的分針走了 20 分鐘，轉過幾弧度？如果分針長 9 公分，針尖走了多遠？", hint: "60 分鐘轉一整圈 $2\\pi$。",
        idea: "$\\frac{20}{60}\\times2\\pi=\\frac{2\\pi}{3}$ 弧度，針尖走 $9\\times\\frac{2\\pi}{3}=6\\pi\\approx18.8$ 公分。" },
      { q: "海上用的「海里」原本定義成地球大圓上 1 角分（$\\frac1{60}$ 度）的弧長。地球半徑約 6371 公里，1 海里大約多長？", hint: "先把 1 角分換成弧度。",
        idea: "$1'=\\frac{1}{60}\\times\\frac{\\pi}{180}\\approx0.000291$ 弧度，弧長 $\\approx6371\\times0.000291\\approx1.85$ 公里。現在的 1 海里正式定為 1852 公尺。" }
    ],

    where: {
      codes: [["N-11A-1", "（數 A）弧度量、弧長、扇形面積"], ["N-11B-1", "（數 B）弧度量、弧長、扇形面積"]],
      exam: "11 年級數 A、數 B 都有，學測數 A、數 B 都在範圍內。它是三角函數圖形、週期模型與數甲微積分的共同單位。",
      stop: "會角度與弧度互換、用 $s=r\\theta$ 與 $\\frac12r^2\\theta$ 計算就好。不需要在這裡證明三角函數的導數，只先埋下「弧度是自然的角度單位」這個伏筆。"
    }
  });
})();
