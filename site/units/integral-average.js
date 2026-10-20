/* 單元：積分的應用——平均與總量 */
(function () {
  var C = SK.C, s = SK.s;
  var RATES = [
    { name: "變速前進", f: function (t) { return t * (5 - t) / 2.2 + .4; }, F: function (t) { return (2.5 * t * t - t * t * t / 3) / 2.2 + .4 * t; }, unit: "公尺／秒", tot: "位移" },
    { name: "有進有退", f: function (t) { return 2.2 * Math.cos(t * 1.1); }, F: function (t) { return 2.2 * Math.sin(t * 1.1) / 1.1; }, unit: "公尺／秒", tot: "位移" },
    { name: "固定速度", f: function (t) { return 1.6; }, F: function (t) { return 1.6 * t; }, unit: "公尺／秒", tot: "位移" }
  ];

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 250, "速度表與走過的距離");
    var O = [50, 190], u = 55;
    s("line", { x1: 30, y1: O[1], x2: 380, y2: O[1], class: "m-axis" }, svg);
    s("line", { x1: O[0], y1: 30, x2: O[0], y2: 210, class: "m-axis" }, svg);
    var d = "";
    for (var t = 0; t <= 5.6; t += .05) { var y = t * (5 - t) / 2.2 + .4; d += (d ? "L" : "M") + (O[0] + t * u) + " " + (O[1] - y * 40); }
    s("path", { d: d + " L" + (O[0] + 5.6 * u) + " " + O[1] + " L" + O[0] + " " + O[1] + "Z", fill: C.gold.f, stroke: "none" }, svg);
    s("path", { d: d, fill: "none", stroke: C.orange.s, "stroke-width": 2.6 }, svg);
    SK.label(svg, 200, 130, "面積 = ?", { size: 16 });
    SK.label(svg, 200, 226, "速度隨時間變化，怎麼知道總共走了多遠？", { size: 12, color: C.soft });
  }

  SK.mountUnit({
    slug: "integral-average",
    en: "Totals and averages from a rate",
    formula: "\\text{總變化量}=\\int_a^b f'(t)\\,dt,\\qquad \\bar f=\\frac{1}{b-a}\\int_a^b f(x)\\,dx",

    hook: {
      html: "車子的速度一直在變。速度表只告訴你「此刻多快」，可是我們想知道「一共走了多遠」。",
      ask: "把速度圖下方的面積算出來，為什麼就是走過的距離？「平均速度」又在圖上的哪裡？",
      visual: hookVisual
    },

    guess: {
      q: "一段旅程前 2 小時時速 30 公里，後 1 小時時速 60 公里。全程的平均速度是多少？",
      options: [
        { t: "40 公里／小時", truth: true, explain: "總距離 $30\\times2+60\\times1=120$ 公里，總時間 3 小時，平均 $\\tfrac{120}{3}=40$。平均速度是<b>總距離 ÷ 總時間</b>，也就是「面積 ÷ 區間長度」。" },
        { t: "45 公里／小時", common: true, explain: "$\\tfrac{30+60}{2}=45$ 是把兩段<b>一樣看待</b>的算法。但前一段開了 2 小時、後一段只有 1 小時，慢的那段佔的時間比較長，平均會被拉低。" },
        { t: "90 公里／小時", explain: "這是把兩個速度相加，不是平均。" },
        { t: "資料不足", explain: "有速度和各自的時間就夠了：先算總距離（面積），再除以總時間。" }
      ]
    },

    derive: {
      intro: "上圖是<b>速度</b>（變化率），下圖是<b>累積的距離</b>。拖動滑桿改變時間區間。",
      tall: true,
      frames: [
        { cap: "把時間切成很多小段，每一小段「速度 × 時間」是一個細長方形的面積，加起來就是走過的距離。取極限，就是定積分：<b>變化率的積分 = 總變化量</b>。", tex: "\\int_a^b v(t)\\,dt=\\text{位移}" },
        { cap: "速度是負的時候（往回走），面積算成<b>負的</b>。所以積分給的是<b>淨變化</b>（位移）；要算實際走的路程，得把負的部分也當正的加起來。", tex: "\\text{位移}=\\int_a^b v\\,dt,\\qquad \\text{路程}=\\int_a^b|v|\\,dt" },
        { cap: "<b>平均值</b>：把高低起伏抹平成一個等高的長方形，面積一樣。高度就是平均值：面積除以區間長度。", tex: "\\bar f=\\frac{1}{b-a}\\int_a^b f(x)\\,dx" },
        { cap: "平均值一定介於最小值和最大值之間；而且連續函數<b>一定</b>在某個時刻剛好等於它的平均（均值定理）：圖上那條水平線至少和曲線交一次。", tex: "\\min f\\le\\bar f\\le\\max f" },
        { cap: "<b>存量與剩餘</b>：水槽每分鐘流入 $r_{\\text{in}}$、流出 $r_{\\text{out}}$，那麼「現在的水量 = 一開始的水量 + 淨流入的積分」。流入大於流出時水位上升，反之下降。", tex: "Q(t)=Q(0)+\\int_0^t\\big(r_{\\text{in}}-r_{\\text{out}}\\big)ds" }
      ],
      hint: "拖動 a、b 改區間；前四步可以點按鈕換速度的樣子。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 540, 440, "變化率與累積量");
        var g = s("g", {}, svg);
        var st = { i: 0, a: 0, b: 4 };
        var read = SK.h("div", { class: "readout" });
        var btns = SK.h("div", { style: "display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px" });
        RATES.forEach(function (r, i) {
          var b = SK.h("button", { class: "chip", type: "button", "aria-pressed": i === 0 ? "true" : "false" }, r.name);
          b.addEventListener("click", function () { st.i = i; Array.prototype.forEach.call(btns.children, function (x, k) { x.setAttribute("aria-pressed", k === i ? "true" : "false"); }); draw(); });
          btns.appendChild(b);
        });
        var sa = SK.slider({ label: "$a$", min: 0, max: 5, step: .1, value: st.a, onInput: function (v) { st.a = Math.min(v, st.b - .2); draw(); } });
        var sb = SK.slider({ label: "$b$", min: .5, max: 5.5, step: .1, value: st.b, color: "blue", onInput: function (v) { st.b = Math.max(v, st.a + .2); draw(); } });
        ctx.sliders.appendChild(sa.el); ctx.sliders.appendChild(sb.el);
        ctx.extra.appendChild(btns); ctx.extra.appendChild(read);
        var X0 = 70, XW = 430, TMAX = 5.6;
        function X(t) { return X0 + t / TMAX * XW; }
        function num(v, d) { return SK.fmt(v, d == null ? 2 : d).replace("−", "-"); }
        function axes(y0, h, ylo, yhi, lab) {
          var Y = function (v) { return y0 + h - (v - ylo) / (yhi - ylo) * h; };
          s("line", { x1: X0 - 10, y1: Y(0), x2: X0 + XW + 10, y2: Y(0), class: "m-axis" }, g);
          s("line", { x1: X0, y1: y0 - 6, x2: X0, y2: y0 + h + 6, class: "m-axis" }, g);
          for (var t = 1; t <= 5; t++) { s("line", { x1: X(t), y1: Y(0) - 4, x2: X(t), y2: Y(0) + 4, stroke: C.cocoa }, g); SK.label(g, X(t), Y(0) + 16, String(t), { size: 10, color: C.soft }); }
          SK.label(g, X0 - 6, y0 - 4, lab, { size: 12, color: C.soft, anchor: "end" });
          return Y;
        }
        function area(fn, a, b, Y, col) {
          var d = "M" + X(a) + " " + Y(0);
          for (var t = a; t <= b; t += .02) d += " L" + X(t).toFixed(1) + " " + Y(fn(t)).toFixed(1);
          d += " L" + X(b) + " " + Y(0) + "Z";
          s("path", { d: d, fill: col, stroke: "none" }, g);
        }
        function curve(fn, t0, t1, Y, col, w, dash) {
          var d = "";
          for (var t = t0; t <= t1; t += .02) d += (d ? "L" : "M") + X(t).toFixed(1) + " " + Y(fn(t)).toFixed(1);
          s("path", { d: d, fill: "none", stroke: col, "stroke-width": w || 2.6, "stroke-dasharray": dash || null }, g);
        }
        function draw() {
          var f = ctx.frame, R = RATES[st.i], a = st.a, b = st.b;
          g.innerHTML = "";
          btns.style.display = f <= 3 ? "flex" : "none";
          sa.el.style.display = sb.el.style.display = f <= 3 ? "" : "none";
          if (f === 4) {
            // 水槽：流入與流出
            var rin = function (t) { return 2 + Math.sin(t * 1.3) * 1.4; }, rout = function (t) { return 1.2 + t * .35; };
            var Y1 = axes(40, 150, 0, 4, "流量");
            area(rin, 0, 5.6, Y1, "rgba(157,181,178,.35)");
            area(rout, 0, 5.6, Y1, "rgba(233,193,191,.5)");
            curve(rin, 0, 5.6, Y1, C.blue.s, 2.6);
            curve(rout, 0, 5.6, Y1, C.pink.s, 2.6);
            SK.label(g, X(5.6) - 4, Y1(rin(5.6)) - 14, "流入", { size: 12, color: C.blue.s, anchor: "end" });
            SK.label(g, X(5.6) - 4, Y1(rout(5.6)) + 16, "流出", { size: 12, color: C.pink.s, anchor: "end" });
            var Q = [], q = 3;
            for (var t2 = 0; t2 <= 5.6; t2 += .02) { q += (rin(t2) - rout(t2)) * .02; Q.push([t2, q]); }
            var Y2 = axes(250, 150, 0, 8, "水量");
            var d2 = "";
            Q.forEach(function (p) { d2 += (d2 ? "L" : "M") + X(p[0]).toFixed(1) + " " + Y2(p[1]).toFixed(1); });
            s("path", { d: d2, fill: "none", stroke: C.green.s, "stroke-width": 3 }, g);
            // 交點：流入 = 流出的時刻，水量最高
            var cross = 0;
            for (var t3 = .1; t3 <= 5.5; t3 += .01) if ((rin(t3) - rout(t3)) * (rin(t3 - .01) - rout(t3 - .01)) < 0) { cross = t3; break; }
            if (cross) {
              s("line", { x1: X(cross), y1: 40, x2: X(cross), y2: 400, stroke: C.cocoa, "stroke-dasharray": "4 5" }, g);
              SK.label(g, X(cross), 434, "流入 = 流出：水量最高", { size: 12, color: C.soft });
            }
            read.innerHTML = SK.tex("Q(t)=Q(0)+\\int_0^t(r_{\\text{in}}-r_{\\text{out}})\\,ds", true) + '<p style="margin:4px 0 0">流入曲線在流出曲線上方時，水量上升。</p>';
            return;
          }
          var ylo = st.i === 1 ? -2.6 : 0, yhi = 3.2;
          var Y = axes(40, 190, ylo, yhi, R.unit);
          var pos = "rgba(241,226,184,.85)", neg = "rgba(233,193,191,.7)";
          // 面積（分正負）
          var step = .02;
          for (var t = a; t < b; t += step) {
            var v = R.f(t + step / 2), x1 = X(t), x2 = X(t + step);
            s("rect", { x: x1, y: Math.min(Y(v), Y(0)), width: x2 - x1 + .6, height: Math.abs(Y(v) - Y(0)), fill: v >= 0 ? pos : neg, stroke: "none" }, g);
          }
          if (f === 0) {
            // 幾個粗矩形示意
            var n = 6, w = (b - a) / n;
            for (var k = 0; k < n; k++) {
              var tm = a + (k + .5) * w;
              s("rect", { x: X(a + k * w), y: Math.min(Y(R.f(tm)), Y(0)), width: X(a + w) - X(a) - 1, height: Math.abs(Y(R.f(tm)) - Y(0)), fill: "none", stroke: C.cocoa, "stroke-width": .8 }, g);
            }
          }
          curve(R.f, 0, TMAX, Y, C.orange.s, 2.8);
          [a, b].forEach(function (t, i) { s("line", { x1: X(t), y1: 40, x2: X(t), y2: 230, stroke: [C.blue.s, C.green.s][i], "stroke-dasharray": "4 4" }, g); });
          var tot = R.F(b) - R.F(a), len = b - a, avg = tot / len;
          if (f >= 2) {
            s("line", { x1: X(a), y1: Y(avg), x2: X(b), y2: Y(avg), stroke: C.purple.s, "stroke-width": 3 }, g);
            s("rect", { x: X(a), y: Math.min(Y(avg), Y(0)), width: X(b) - X(a), height: Math.abs(Y(avg) - Y(0)), fill: "none", stroke: C.purple.s, "stroke-width": 1.6, "stroke-dasharray": "5 4" }, g);
            SK.label(g, X(b) + 8, Y(avg), "平均 " + num(avg), { size: 12, color: C.purple.s, anchor: "start" });
          }
          if (f === 3) {
            var hits = [];
            for (var t4 = a; t4 <= b; t4 += .01) if ((R.f(t4) - avg) * (R.f(t4 - .01) - avg) < 0) hits.push(t4);
            hits.forEach(function (t5) { s("circle", { cx: X(t5), cy: Y(avg), r: 6, fill: C.purple.s }, g); });
            SK.label(g, 270, 258, hits.length ? "曲線至少在一個時刻剛好等於平均值" : "調整區間，看看曲線在哪裡穿過平均線", { size: 13, color: C.purple.s });
          }
          // 下圖：累積量
          var Ylo = st.i === 1 ? -2.5 : 0, Yhi = st.i === 2 ? 9 : 8;
          var Y2b = axes(285, 130, Ylo, Yhi, "累積 " + R.tot);
          curve(function (t) { return R.F(t) - R.F(a); }, a, b, Y2b, C.green.s, 3);
          var endp = [X(b), Y2b(tot)];
          s("circle", { cx: endp[0], cy: endp[1], r: 6, fill: C.green.s }, g);
          SK.label(g, endp[0] + 10, endp[1] - 10, num(tot) + " 公尺", { size: 12, color: C.green.s, anchor: "start" });
          var lines = [SK.tex("\\int_{" + num(a, 1) + "}^{" + num(b, 1) + "}v(t)\\,dt=" + num(tot) + "\\ \\text{公尺}", true)];
          if (f === 1 && st.i === 1) {
            var pathLen = 0;
            for (var t6 = a; t6 < b; t6 += .005) pathLen += Math.abs(R.f(t6)) * .005;
            lines.push(SK.tex("\\text{路程}=\\int|v|\\,dt=" + num(pathLen) + "\\ \\text{公尺}", true));
          }
          if (f >= 2) lines.push(SK.tex("\\bar v=\\frac{" + num(tot) + "}{" + num(len, 1) + "}=" + num(avg) + "\\ \\text{公尺／秒}", true));
          read.innerHTML = lines.join("");
        }
        return { show: draw };
      }
    },

    drills: [
      { title: "總成本＝固定成本＋邊際成本的積分", code: "F-12乙-6",
        demo: {
          q: "邊際成本 $C'(q)=2q+3$（千元／件），固定成本 $C(0)=10$ 千元。求總成本 $C(q)$、生產 $5$ 件的總成本與平均成本，以及第 $6$ 件的增量。",
          steps: [
            "總量＝起始量＋變化率的積分：$C(q)=C(0)+\\displaystyle\\int_0^q C'(t)\\,dt=10+\\left[t^2+3t\\right]_0^q=q^2+3q+10$。",
            "$C(5)=25+15+10=50$ 千元；平均成本 $\\frac{C(5)}5=10$ 千元／件。",
            "第 $6$ 件的精確增量：$C(6)-C(5)=\\displaystyle\\int_5^6(2q+3)\\,dq=\\left[q^2+3q\\right]_5^6=54-40=14$ 千元。",
            "用邊際估計：$C'(5)=13$，比精確值少 $1$——邊際成本在 $[5,6]$ 上一直增加，取左端點會低估。",
            "單位：千元／件 × 件 ＝ 千元。積分把「變化率」累積成「總量」。"
          ]
        },
        tries: [
          { q: "水庫進水速率 $r(t)=20-2t$（萬噸／天，$0\\le t\\le10$），一開始有 $300$ 萬噸。求 $10$ 天後的水量與這 $10$ 天的平均進水速率。", ans: "$300+\\int_0^{10}(20-2t)dt=300+[20t-t^2]_0^{10}=300+100=400$ 萬噸；平均速率 $\\frac{100}{10}=10$ 萬噸／天。" }
        ],
        edge: "只知道變化率時，總量少了一個起點：$\\int_0^q C'(t)dt$ 只是<b>增加的部分</b>，要加回固定成本 $C(0)$。邊際成本的一次估計 $C'(q)$ 是近似，精確增量要用積分 $\\int_q^{q+1}C'(t)dt$。"
      },
      { title: "供需均衡與消費者剩餘、生產者剩餘", code: "F-12乙-6",
        demo: {
          q: "需求 $p=10-q$、供給 $p=2+q$（$p$：元，$q$：千件）。求均衡，並求消費者剩餘與生產者剩餘。",
          steps: [
            "均衡：$10-q=2+q$，$q^*=4$，$p^*=6$。",
            "<b>消費者剩餘</b>：每一位買家「願意付的價格」（需求曲線）比「實際付的 $p^*$」多出的部分加總：$CS=\\displaystyle\\int_0^4\\big[(10-q)-6\\big]dq=\\left[4q-\\frac{q^2}2\\right]_0^4=8$。",
            "<b>生產者剩餘</b>：實際收到的 $p^*$ 比「最低願意賣的價格」（供給曲線）多出的部分：$PS=\\displaystyle\\int_0^4\\big[6-(2+q)\\big]dq=8$。",
            "圖上兩塊都是三角形，$\\frac12\\cdot4\\cdot4=8$，積分和幾何一致。單位：元 × 千件 ＝ 千元，所以兩種剩餘各 $8$ 千元。",
            "若曲線不是直線，三角形公式就失效，只能用積分——下面的第二題就是這種情況。"
          ]
        },
        lab: function (el) {
          var st = { A: 10, B: 1, Cc: 2, D: 1 };
          el.insertAdjacentHTML("beforeend", '<p style="margin:0 0 4px">' + SK.md("需求 $p=A-Bq$、供給 $p=C+Dq$。改改看數字：") + "</p>");
          var row = SK.h("div", { class: "row" }), out = SK.h("div", { class: "readout" });
          [["A", "$A$"], ["B", "$B$"], ["Cc", "$C$"], ["D", "$D$"]].forEach(function (z) {
            row.appendChild(SK.numIn(z[1], st[z[0]], function (v) { st[z[0]] = v; draw(); }, .5));
          });
          el.appendChild(row);
          var svg = SK.svg(el, 340, 260, "供需曲線與兩種剩餘"), g = s("g", {}, svg);
          el.appendChild(out);
          function draw() {
            g.innerHTML = "";
            var A = st.A, B = st.B, Cc = st.Cc, D = st.D;
            if (!(B > 0 && D > 0 && A > Cc)) {
              out.innerHTML = '<p class="muted" style="margin:0">' + SK.md("需要 $B>0$、$D>0$（需求往下、供給往上）且 $A>C$，兩條線才會在第一象限相交。") + "</p>";
              return;
            }
            var q = (A - Cc) / (B + D), p = A - B * q, qMax = q * 1.6, pMax = A * 1.08;
            function P(x, y) { return [40 + x / qMax * 280, 230 - y / pMax * 210]; }
            var O = P(0, 0), Xe = P(qMax, 0), Ye = P(0, pMax);
            s("line", { x1: O[0], y1: O[1], x2: Xe[0], y2: Xe[1], class: "m-axis" }, g);
            s("line", { x1: O[0], y1: O[1], x2: Ye[0], y2: Ye[1], class: "m-axis" }, g);
            var a1 = P(0, A), a2 = P(q, p), a3 = P(0, p), a4 = P(0, Cc);
            s("path", { d: "M" + a1 + " L" + a2 + " L" + a3 + "Z", fill: C.orange.f, opacity: .8 }, g);
            s("path", { d: "M" + a3 + " L" + a2 + " L" + a4 + "Z", fill: C.blue.f, opacity: .8 }, g);
            var d2 = P(Math.min(qMax, A / B), A - B * Math.min(qMax, A / B)), s2 = P(qMax, Cc + D * qMax);
            s("line", { x1: a1[0], y1: a1[1], x2: d2[0], y2: d2[1], stroke: C.orange.s, "stroke-width": 2.4 }, g);
            s("line", { x1: a4[0], y1: a4[1], x2: s2[0], y2: s2[1], stroke: C.blue.s, "stroke-width": 2.4 }, g);
            s("circle", { cx: a2[0], cy: a2[1], r: 5, fill: C.pink.s }, g);
            SK.label(g, a2[0] + 8, a2[1] - 10, "(" + SK.fmt(q, 2) + ", " + SK.fmt(p, 2) + ")", { size: 12, color: C.pink.s, anchor: "start" });
            SK.label(g, P(qMax, 0)[0], O[1] + 16, "q", { size: 12, color: C.soft });
            SK.label(g, O[0] - 12, P(0, pMax)[1] + 6, "p", { size: 12, color: C.soft });
            var CS = .5 * q * (A - p), PS = .5 * q * (p - Cc);
            out.innerHTML = SK.tex("q^*=" + SK.fmt(q, 3) + ",\\ p^*=" + SK.fmt(p, 3), true) +
              SK.tex("\\co{CS}=\\int_0^{q^*}\\big[(A-Bq)-p^*\\big]dq=" + SK.fmt(CS, 3) + ",\\quad \\cb{PS}=\\int_0^{q^*}\\big[p^*-(C+Dq)\\big]dq=" + SK.fmt(PS, 3), true);
          }
          draw();
        },
        tries: [
          { q: "需求 $p=20-2q$、供給 $p=5+q$。求均衡與兩種剩餘。", ans: "$q^*=5$、$p^*=10$。$CS=\\int_0^5(10-2q)dq=25$，$PS=\\int_0^5(5-q)dq=12.5$。" },
          { q: "需求曲線 $p=16-q^2$、供給 $p=4+q$（$q\\ge0$）。求均衡與兩種剩餘。", hint: "需求不是直線，消費者剩餘那塊不是三角形。", ans: "$16-q^2=4+q\\Rightarrow q^2+q-12=0$，$q^*=3$、$p^*=7$。$CS=\\int_0^3(9-q^2)dq=27-9=18$；$PS=\\int_0^3(3-q)dq=4.5$。" }
        ],
        edge: "剩餘的被積函數是「曲線與均衡價格的<b>差</b>」，上限是<b>均衡數量</b>。$\\int_0^4(10-q)dq=32$ 是消費者願付的總額，扣掉實付 $p^*q^*=24$ 才是剩餘 $8$。這裡的供需是簡化模型，數值與單位跟著題目（元 × 千件 ＝ 千元）。"
      }
    ],

    angles: [
      { title: "平均值就是「抹平」", icon: "sparkle",
        html: "把曲線下方高高低低的部分削掉、填進凹下去的地方，直到變成一個平坦的長方形，高度就是平均值。削掉的面積和填進去的面積一樣多，所以總面積不變。統計的平均數也是同一件事：把每個人的數值重新分配成一樣多。" },
      { title: "微積分基本定理的另一種讀法", icon: "leaf",
        html: "$\\int_a^b F'(x)\\,dx=F(b)-F(a)$：把每一瞬間的變化率累積起來，就等於頭尾的差。水位、里程、存款、人口，只要知道「變化的速率」，就能還原「總量的改變」。" }
    ],

    challenges: [
      { q: "$f(x)=x^2$ 在 $[0,3]$ 上的平均值是多少？", idea: "$\\int_0^3x^2dx=9$，平均 $\\tfrac93=3$。而 $f(x)=3$ 發生在 $x=\\sqrt3\\approx1.73$，確實落在區間內。" },
      { q: "速度 $v(t)=t-2$（公尺／秒），$0\\le t\\le4$。位移和路程各是多少？", idea: "位移 $\\int_0^4(t-2)dt=0$（先退後進，回到原點）；路程 $\\int_0^4|t-2|dt=2+2=4$ 公尺。" },
      { q: "水槽一開始有 3 公升，流入速率 $2$ 公升／分、流出 $0.5t$ 公升／分。什麼時候水最多？那時有多少水？", idea: "流入 = 流出 時水量最大：$2=0.5t\\Rightarrow t=4$ 分。水量 $3+\\int_0^4(2-0.5t)dt=3+(8-4)=7$ 公升。" }
    ],

    where: {
      codes: [["F-12乙-6", "積分的應用：連續函數的平均值、總量與剩餘（存量）的意涵"]],
      exam: "12 年級<b>選修數學乙</b>。數學甲的積分應用以體積為主（見「積分求體積」）。",
      stop: "以「變化率 → 總量」與平均值的意義為主，函數以一次、二次式為主。不含分部積分與變數變換。"
    }
  });
})();
