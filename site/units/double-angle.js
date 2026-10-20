/* 單元：二倍角與半角公式 */
(function () {
  var C = SK.C, s = SK.s;

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 240, "30 度與 60 度的比較");
    var cx = 110, cy = 170, R = 86;
    [[30, C.blue, "30°"], [60, C.orange, "60°"]].forEach(function (d, i) {
      var a = SK.rad(d[0]), ox = cx + i * 180;
      s("line", { x1: ox, y1: cy, x2: ox + R, y2: cy, stroke: C.line, "stroke-width": 1.2 }, svg);
      s("line", { x1: ox, y1: cy, x2: ox + R * Math.cos(a), y2: cy - R * Math.sin(a), stroke: C.cocoa, "stroke-width": 1.6 }, svg);
      s("line", { x1: ox + R * Math.cos(a), y1: cy, x2: ox + R * Math.cos(a), y2: cy - R * Math.sin(a), stroke: d[1].s, "stroke-width": 3.4 }, svg);
      s("path", { d: SK.arcPath(ox, cy, 26, 0, a), fill: "none", stroke: d[1].s, "stroke-width": 1.6 }, svg);
      SK.label(svg, ox + 40, cy - 14, d[2], { size: 12, color: d[1].s });
      SK.label(svg, ox + R * Math.cos(a) + 16, cy - R * Math.sin(a) / 2, "sin " + d[0] + "°", { size: 12, color: d[1].s, anchor: "start" });
      SK.label(svg, ox + R * Math.cos(a) / 2, cy + 22, SK.fmt(Math.sin(a), 3), { size: 13, color: d[1].s });
    });
    SK.label(svg, 200, 34, "角度變成兩倍，sin 也會變成兩倍嗎？", { size: 13, color: C.soft });
    SK.label(svg, 200, 216, "0.5 的兩倍是 1，但 sin 60° 只有 0.866", { size: 12, color: C.pink.s });
  }

  SK.mountUnit({
    slug: "double-angle",
    en: "Doubling the angle, not the value",
    formula: "\\sin2\\theta=2\\sin\\theta\\cos\\theta,\\qquad \\cos2\\theta=1-2\\sin^2\\theta",

    hook: {
      html: "$\\sin30^\\circ=0.5$。把角度變成兩倍，$\\sin60^\\circ$ 會不會就是 $2\\times0.5=1$？<br>實際算出來是 $0.866$，比 1 小。角度變兩倍，sin 值卻<b>沒有</b>變兩倍。",
      ask: "那 $\\sin2\\theta$ 到底等於什麼？能不能只用 $\\sin\\theta$ 和 $\\cos\\theta$ 把它寫出來？",
      visual: hookVisual
    },

    guess: {
      q: "$\\sin2\\theta$ 和 $2\\sin\\theta$，哪一個比較大？（設 $0<\\theta<90^\\circ$）",
      options: [
        { t: "兩個一樣大", common: true, explain: "把 $\\sin$ 當成可以「乘進去」的東西，是最常見的誤解。但 $\\sin$ 是一個<b>函數</b>不是乘法因子：$\\sin(2\\theta)$ 是「先把角度變兩倍，再取 sin」，和「先取 sin，再乘 2」是兩件不同的事。" },
        { t: "$2\\sin\\theta$ 比較大", truth: true, explain: "因為 $\\sin2\\theta=2\\sin\\theta\\cos\\theta$，而 $0<\\theta<90^\\circ$ 時 $0<\\cos\\theta<1$，乘上一個小於 1 的數一定會變小。<br>$\\theta=30^\\circ$：$2\\sin30^\\circ=1$，$\\sin60^\\circ=2(0.5)(0.866)=0.866$。差的那一截，正是 $\\cos\\theta$ 造成的。" },
        { t: "$\\sin2\\theta$ 比較大", explain: "方向反了。$\\sin$ 的值永遠不超過 1，但 $2\\sin\\theta$ 可以接近 2，所以不可能是 $\\sin2\\theta$ 比較大。" },
        { t: "要看 $\\theta$ 是多少", explain: "在 $0<\\theta<90^\\circ$ 的範圍內其實是固定的（永遠 $2\\sin\\theta$ 大）。不過你的直覺值得鼓勵：走出這個範圍後，$\\cos\\theta$ 會變成負的，大小關係確實會翻轉。" }
      ]
    },

    derive: {
      intro: "單位圓上取 $A=(1,0)$，再取角度 $2\\theta$ 的點 $P$。<b>一個等腰三角形，就同時長出兩條倍角公式。</b>拖動滑桿改變 $\\theta$。",
      tall: true,
      frames: [
        { cap: "在單位圓上，從 $A=(1,0)$ 轉出一個角 $2\\theta$，落點是 $P=(\\cos2\\theta,\\ \\sin2\\theta)$。我們要找的兩個數，就是 $P$ 的兩個坐標。", tex: "P=(\\cos2\\theta,\\ \\sin2\\theta)" },
        { cap: "連起 $OA$、$OP$、$AP$。因為 $OA=OP=1$（都是半徑），$\\triangle OAP$ 是<b>等腰三角形</b>，頂角是 $2\\theta$，所以兩個底角都是 $90^\\circ-\\theta$。", tex: "\\angle OAP=\\angle OPA=90^\\circ-\\theta" },
        { cap: "從 $O$ 向底邊 $AP$ 作垂線，把等腰三角形<b>對半切開</b>。右邊那個直角三角形的頂角是 $\\theta$、斜邊是 1，所以半條底邊是 $\\sin\\theta$、那條高是 $\\cos\\theta$。", tex: "\\co{AP}=2\\sin\\theta,\\qquad \\cb{h}=\\cos\\theta" },
        { cap: "現在把 $\\triangle OAP$ 的面積<b>算兩次</b>。用兩腰夾頂角：$\\frac12\\cdot1\\cdot1\\cdot\\sin2\\theta$。用底乘高：$\\frac12\\cdot\\co{2\\sin\\theta}\\cdot\\cb{\\cos\\theta}$。兩個算式必須相等——<b>倍角公式就掉出來了</b>。", tex: "\\tfrac12\\sin2\\theta=\\tfrac12(\\co{2\\sin\\theta})(\\cb{\\cos\\theta})\\ \\Rightarrow\\ \\sin2\\theta=2\\sin\\theta\\cos\\theta" },
        { cap: "同一張圖再看<b>水平方向</b>：從 $P$ 走到 $A$，水平位移是 $1-\\cos2\\theta$。這段也等於弦 $AP$ 在水平方向的投影，$\\co{2\\sin\\theta}\\cdot\\sin\\theta$。", tex: "1-\\cos2\\theta=2\\sin^2\\theta" },
        { cap: "整理就得到 $\\cos2\\theta=1-2\\sin^2\\theta$。再用 $\\sin^2+\\cos^2=1$ 換一下，同一條公式有三張臉，看題目給你什麼就用哪一張。", tex: "\\cos2\\theta=1-2\\sin^2\\theta=2\\cos^2\\theta-1=\\cos^2\\theta-\\sin^2\\theta" },
        { cap: "<b>半角</b>不是新公式，是同一條倒著讀。把上面的 $\\theta$ 換成 $\\frac\\theta2$，再解出來就好。正負號由 $\\frac\\theta2$ 落在哪一象限決定。", tex: "\\sin^2\\tfrac\\theta2=\\frac{1-\\cos\\theta}{2},\\qquad \\cos^2\\tfrac\\theta2=\\frac{1+\\cos\\theta}{2}" }
      ],
      hint: "拖動 $\\theta$，注意 $\\theta$ 超過 45° 之後 $\\sin2\\theta$ 反而開始變小。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 540, 420, "單位圓上的等腰三角形");
        var g = s("g", {}, svg);
        var cx = 230, cy = 265, R = 175;
        var st = { th: 32 };
        var read = SK.h("div", { class: "readout" });
        ctx.extra.appendChild(read);
        var sl = SK.slider({
          label: "$\\theta$", min: 5, max: 80, step: 1, value: st.th,
          fmt: function (v) { return v + "°"; },
          onInput: function (v) { st.th = v; draw(); }
        });
        ctx.sliders.appendChild(sl.el);

        function draw() {
          var f = ctx.frame, th = SK.rad(st.th), t2 = 2 * th;
          g.innerHTML = "";
          var Ax = cx + R, Ay = cy;
          var Px = cx + R * Math.cos(t2), Py = cy - R * Math.sin(t2);

          /* 圓與軸 */
          s("circle", { cx: cx, cy: cy, r: R, fill: "none", stroke: C.line, "stroke-width": 1.2, "stroke-dasharray": "4 4" }, g);
          s("line", { x1: cx - R - 20, y1: cy, x2: cx + R + 30, y2: cy, stroke: C.line, "stroke-width": 1.2 }, g);
          s("line", { x1: cx, y1: cy + 30, x2: cx, y2: cy - R - 30, stroke: C.line, "stroke-width": 1.2 }, g);

          /* 角 2θ */
          s("path", { d: SK.arcPath(cx, cy, 44, 0, t2), fill: "none", stroke: C.pink.s, "stroke-width": 2 }, g);
          SK.label(g, cx + 62 * Math.cos(t2 / 2), cy - 62 * Math.sin(t2 / 2), "2θ", { size: 14, color: C.pink.s });

          /* 三角形 */
          if (f >= 1) {
            s("path", { d: "M" + cx + " " + cy + " L" + Ax + " " + Ay + " L" + Px + " " + Py + "Z", fill: "rgba(241,226,184,.28)", stroke: "none" }, g);
          }
          s("line", { x1: cx, y1: cy, x2: Ax, y2: Ay, stroke: C.cocoa, "stroke-width": 2.2 }, g);
          s("line", { x1: cx, y1: cy, x2: Px, y2: Py, stroke: C.cocoa, "stroke-width": 2.2 }, g);
          if (f >= 1) s("line", { x1: Ax, y1: Ay, x2: Px, y2: Py, stroke: C.orange.s, "stroke-width": 3.4 }, g);

          /* 中垂線與半邊 */
          if (f >= 2) {
            var Mx = (Ax + Px) / 2, My = (Ay + Py) / 2;
            s("line", { x1: cx, y1: cy, x2: Mx, y2: My, stroke: C.blue.s, "stroke-width": 3 }, g);
            SK.rightMark(g, Mx, My, (cx - Mx) / Math.hypot(cx - Mx, cy - My), (cy - My) / Math.hypot(cx - Mx, cy - My),
              (Ax - Mx) / Math.hypot(Ax - Mx, Ay - My), (Ay - My) / Math.hypot(Ax - Mx, Ay - My), 12, C.blue.s);
            SK.label(g, (cx + Mx) / 2 - 16, (cy + My) / 2 - 10, "cos θ", { size: 13, color: C.blue.s, anchor: "end" });
            SK.label(g, (Mx + Ax) / 2 + 20, (My + Ay) / 2, "sin θ", { size: 12, color: C.orange.s, anchor: "start" });
            s("path", { d: SK.arcPath(cx, cy, 30, 0, th), fill: "none", stroke: C.blue.s, "stroke-width": 1.6 }, g);
            SK.label(g, cx + 40 * Math.cos(th / 2), cy - 40 * Math.sin(th / 2), "θ", { size: 12, color: C.blue.s });
          }
          if (f >= 1 && f <= 2) {
            SK.label(g, (Ax + Px) / 2 + 30, (Ay + Py) / 2 - 16, f >= 2 ? "AP = 2 sin θ" : "AP", { size: 13, color: C.orange.s, anchor: "start" });
          }

          /* sin 2θ 的鉛直高度 */
          if (f >= 3) {
            s("line", { x1: Px, y1: Py, x2: Px, y2: cy, stroke: C.green.s, "stroke-width": 3.2 }, g);
            SK.label(g, Px - 14, (Py + cy) / 2, "sin 2θ", { size: 13, color: C.green.s, anchor: "end" });
          }
          /* 水平投影 1 - cos2θ */
          if (f >= 4) {
            s("line", { x1: Px, y1: cy + 26, x2: Ax, y2: cy + 26, stroke: C.purple.s, "stroke-width": 3.2 }, g);
            s("line", { x1: Px, y1: Py, x2: Px, y2: cy + 32, stroke: C.purple.s, "stroke-width": 1, "stroke-dasharray": "3 3" }, g);
            SK.label(g, (Px + Ax) / 2, cy + 46, "1 − cos 2θ = 2 sin²θ", { size: 12, color: C.purple.s });
          }

          /* 點 */
          s("circle", { cx: Ax, cy: Ay, r: 5.5, fill: C.paper, stroke: C.cocoa, "stroke-width": 1.8 }, g);
          SK.label(g, Ax + 18, Ay + 16, "A", { size: 13 });
          s("circle", { cx: Px, cy: Py, r: 6, fill: C.pink.f, stroke: C.pink.s, "stroke-width": 1.8 }, g);
          SK.label(g, Px + (Math.cos(t2) >= 0 ? 18 : -18), Py - 14, "P", { size: 13, color: C.pink.s });
          SK.label(g, cx - 16, cy + 18, "O", { size: 13, color: C.soft });

          var S2 = Math.sin(t2), C2 = Math.cos(t2);
          read.innerHTML =
            SK.tex("\\sin2\\theta=" + SK.fmt(S2, 4) + ",\\qquad 2\\sin\\theta\\cos\\theta=" + SK.fmt(2 * Math.sin(th) * Math.cos(th), 4), true) +
            (f >= 4 ? SK.tex("\\cos2\\theta=" + SK.fmt(C2, 4) + ",\\qquad 1-2\\sin^2\\theta=" + SK.fmt(1 - 2 * Math.sin(th) * Math.sin(th), 4), true) : "") +
            (f >= 6 ? SK.tex("\\sin\\tfrac\\theta2=" + SK.fmt(Math.sin(th / 2), 4) + ",\\qquad \\sqrt{\\tfrac{1-\\cos\\theta}{2}}=" + SK.fmt(Math.sqrt((1 - Math.cos(th)) / 2), 4), true) : "");
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "從和角公式一行得到", icon: "bulb",
        html: "如果你已經有和角公式，倍角根本不需要新的證明——把 $\\beta$ 換成 $\\alpha$ 就好：$$\\sin(\\alpha+\\alpha)=\\sin\\alpha\\cos\\alpha+\\cos\\alpha\\sin\\alpha=2\\sin\\alpha\\cos\\alpha$$ $$\\cos(\\alpha+\\alpha)=\\cos^2\\alpha-\\sin^2\\alpha$$ 上面那張圖的價值不在於「另一個證明」，而在於讓你<b>看見</b>那個 $\\cos\\theta$ 是從哪裡冒出來的：它是等腰三角形的高。<br>兩條路都通，而且互相檢查。" },
      { title: "降次：倍角公式最常被使用的方向", icon: "sparkle",
        html: "$\\cos2\\theta=1-2\\sin^2\\theta$ 倒過來寫：$$\\sin^2\\theta=\\frac{1-\\cos2\\theta}{2},\\qquad \\cos^2\\theta=\\frac{1+\\cos2\\theta}{2}$$ 左邊是<b>二次</b>、右邊是<b>一次</b>。遇到 $\\sin^2$、$\\cos^2$ 的題目，用它把次數降下來，往往整題就鬆開了。<br>這個技巧在高中用來化簡與求極值，到了大學積分 $\\int\\sin^2x\\,dx$ 時，它是唯一的入口。所以「半角公式」真正的用途，多半是<b>降次</b>而不是真的在算半個角。" },
      { title: "為什麼 45° 是分水嶺", icon: "leaf",
        html: "$\\sin2\\theta=2\\sin\\theta\\cos\\theta$：$\\theta$ 變大時 $\\sin\\theta$ 變大、$\\cos\\theta$ 變小，兩股力量在拔河。<br>$2\\theta=90^\\circ$（也就是 $\\theta=45^\\circ$）時 $\\sin2\\theta$ 達到最大值 1，之後就開始下降。這也是為什麼斜向拋射的<b>最遠射程在仰角 45°</b>——射程公式裡正是 $\\sin2\\theta$。<br>拖動上面的滑桿越過 45°，你可以親眼看到綠色那段開始變短。" }
    ],

    challenges: [
      { q: "已知 $\\sin\\theta=\\frac35$ 且 $\\theta$ 在第二象限，求 $\\sin2\\theta$ 與 $\\cos2\\theta$。",
        hint: "先決定 $\\cos\\theta$ 的<b>正負號</b>——第二象限的 $\\cos$ 是負的。",
        idea: "$\\cos\\theta=-\\frac45$。$\\sin2\\theta=2\\cdot\\frac35\\cdot(-\\frac45)=-\\frac{24}{25}$，$\\cos2\\theta=1-2(\\frac35)^2=\\frac7{25}$。<br>$\\sin2\\theta<0$ 而 $\\cos2\\theta>0$，所以 $2\\theta$ 在第四象限——這很合理：$\\theta$ 介於 $90^\\circ$ 與 $180^\\circ$，兩倍就介於 $180^\\circ$ 與 $360^\\circ$。" },
        { q: "用倍角公式求 $\\cos22.5^\\circ$ 的精確值。", lv: "Explore",
        hint: "$22.5^\\circ$ 是 $45^\\circ$ 的一半，用 $\\cos^2\\frac\\theta2=\\frac{1+\\cos\\theta}2$。",
        idea: "$\\cos^222.5^\\circ=\\frac{1+\\cos45^\\circ}{2}=\\frac{1+\\frac{\\sqrt2}{2}}{2}=\\frac{2+\\sqrt2}{4}$，所以 $\\cos22.5^\\circ=\\frac{\\sqrt{2+\\sqrt2}}{2}\\approx0.924$（取正號，因為 $22.5^\\circ$ 在第一象限）。<br>同樣的手法可以一直折半下去，得到 $\\cos11.25^\\circ$、$\\cos5.625^\\circ$…，這串巢狀根號正是古人計算三角函數表的方法之一。" },
      { q: "推推看三倍角公式 $\\sin3\\theta$。你會用什麼策略？做完之後想一想：為什麼課綱只要求到二倍角？", lv: "Wonder",
        hint: "$3\\theta=2\\theta+\\theta$，先用和角公式拆開，再把 $\\sin2\\theta$、$\\cos2\\theta$ 代進去。",
        idea: "$\\sin3\\theta=\\sin2\\theta\\cos\\theta+\\cos2\\theta\\sin\\theta=2\\sin\\theta\\cos^2\\theta+(1-2\\sin^2\\theta)\\sin\\theta=3\\sin\\theta-4\\sin^3\\theta$。<br>至於為什麼停在二倍角：因為三倍角<b>沒有帶來新的想法</b>，它完全是和角＋二倍角的組合練習。課綱把它留作推論練習而不是必背公式，正是「該背的越少越好，該懂的一個都不能少」的意思。<br>（順帶一提，$\\sin3\\theta$ 的這條式子和三次方程式的解法有一段歷史淵源——卡丹諾公式遇到三個實根時，正是靠它繞過虛數。）" }
    ],

    where: {
      codes: [["G-11A-5", "三角的和差角公式、二倍角與半角公式；正切的相關公式以推論練習為原則"]],
      exam: "11 年級<b>數學 A</b> 的內容，學測數 A、分科數甲都在範圍內；數學 B 沒有這個單元。它是正餘弦疊合（$a\\sin x+b\\cos x$）、三角方程式求解、以及三角函數極值問題的必備工具，出現頻率很高。",

      past: [] /* Examination text excluded; see docs/PROVENANCE.md. */,
      stop: "二倍角、半角（含降次公式）會推會用就夠了。三倍角留作推論練習、不必背；萬用代換 $t=\\tan\\frac\\theta2$、積化和差與和差化積屬於延伸，只在需要時當工具介紹，不要變成另一批死背的公式。"
    }
  });
})();
