/* 單元 10：微積分基本定理 */
(function () {
  var C = SK.C, s = SK.s;
  function f(t) { return t * t / 4 + 1; }
  function F(t) { return t * t * t / 12 + t; }

  function hookVisual(el) {
    var svg = SK.svg(el, 420, 280, "一台車的速度隨時間變化的圖");
    var X = function (t) { return 50 + t * 34; }, Y = function (v) { return 240 - v * 3.2; };
    s("line", { x1: 50, y1: 240, x2: 400, y2: 240, class: "m-axis" }, svg);
    s("line", { x1: 50, y1: 240, x2: 50, y2: 20, class: "m-axis" }, svg);
    SK.label(svg, 395, 258, "時間", { size: 12, color: C.soft });
    SK.label(svg, 50, 12, "速度", { size: 12, color: C.soft });
    var d = "", area = "M" + X(0) + " " + Y(0) + " ";
    for (var t = 0; t <= 10; t += .1) {
      var v = 30 + 25 * Math.sin(t / 1.8) + t * 2;
      d += (t ? "L" : "M") + X(t) + " " + Y(v) + " ";
      area += "L" + X(t) + " " + Y(v) + " ";
    }
    area += "L" + X(10) + " " + Y(0) + "Z";
    s("path", { d: area, fill: "rgba(157,181,178,.35)" }, svg);
    s("path", { d: d, fill: "none", stroke: C.blue.s, "stroke-width": 3 }, svg);
    SK.label(svg, 220, 200, "走了多遠？", { size: 16, color: C.blue.s });
  }

  function twinAngle(el) {
    var wrap = SK.h("div", {});
    var st = SK.h("div", { class: "stage" });
    wrap.appendChild(st); el.appendChild(wrap);
    var svg = SK.svg(st, 700, 440, "上圖是 f，下圖是面積函數 A，A 的切線斜率等於 f 的高度");
    var g = s("g", {}, svg);
    var stt = { x: 2.2 };
    var X = function (t) { return 70 + t * 130; };
    var Y1 = function (y) { return 190 - y * 30; }, Y2 = function (y) { return 420 - y * 15; };
    function draw() {
      g.innerHTML = "";
      var x = stt.x;
      // 上：f 與面積
      s("line", { x1: 60, y1: Y1(0), x2: 680, y2: Y1(0), class: "m-axis" }, g);
      s("line", { x1: 70, y1: Y1(0), x2: 70, y2: 15, class: "m-axis" }, g);
      var area = "M" + X(0) + " " + Y1(0), d = "";
      for (var t = 0; t <= 4.6; t += .05) { d += (t ? "L" : "M") + X(t) + " " + Y1(f(t)); if (t <= x) area += " L" + X(t) + " " + Y1(f(t)); }
      area += " L" + X(x) + " " + Y1(f(x)) + " L" + X(x) + " " + Y1(0) + "Z";
      s("path", { d: area, fill: C.orange.f }, g);
      s("path", { d: d, fill: "none", stroke: C.ink, "stroke-width": 2.6 }, g);
      s("line", { x1: X(x), y1: Y1(0), x2: X(x), y2: Y1(f(x)), stroke: C.blue.s, "stroke-width": 5, "stroke-linecap": "round" }, g);
      SK.label(g, X(x) + 12, Y1(f(x) / 2), "高度 f(x) = " + SK.fmt(f(x), 2), { size: 13, anchor: "start", color: C.blue.s });
      SK.label(g, X(x / 2), Y1(.5), "A(x)", { it: true, color: C.orange.s });
      SK.label(g, 600, 30, "y = f(t)", { size: 14 });
      // 下：A(x)
      s("line", { x1: 60, y1: Y2(0), x2: 680, y2: Y2(0), class: "m-axis" }, g);
      s("line", { x1: 70, y1: Y2(0), x2: 70, y2: 225, class: "m-axis" }, g);
      var d2 = "";
      for (var t2 = 0; t2 <= 4.6; t2 += .05) d2 += (t2 ? "L" : "M") + X(t2) + " " + Y2(F(t2));
      s("path", { d: d2, fill: "none", stroke: C.orange.s, "stroke-width": 3 }, g);
      var m = f(x), dx = .8;
      s("line", { x1: X(x - dx), y1: Y2(F(x) - m * dx), x2: X(x + dx), y2: Y2(F(x) + m * dx), stroke: C.blue.s, "stroke-width": 2.6 }, g);
      s("circle", { cx: X(x), cy: Y2(F(x)), r: 6, fill: C.orange.s, stroke: "#fff", "stroke-width": 2 }, g);
      s("line", { x1: X(x), y1: Y1(0), x2: X(x), y2: Y2(F(x)), stroke: C.line, "stroke-dasharray": "3 5" }, g);
      SK.label(g, 600, 240, "y = A(x)", { size: 14, color: C.orange.s });
      SK.label(g, X(x) - 14, Y2(F(x)) - 18, "切線斜率 = " + SK.fmt(m, 2), { size: 13, anchor: "end", color: C.blue.s });
    }
    var ctr = SK.h("div", { class: "sliders", style: "margin-top:12px" });
    ctr.appendChild(SK.slider({ label: "$x$", min: .2, max: 4.2, step: .05, value: stt.x, onInput: function (v) { stt.x = v; draw(); } }).el);
    wrap.appendChild(ctr);
    wrap.insertAdjacentHTML("beforeend", '<p class="muted" style="font-size:.95rem">' + SK.md("上面的蜜桃色面積 $A(x)$ 畫成下面的曲線。拖動 $x$，會發現：上圖灰藍色的<b>高度</b>，永遠等於下圖灰藍色切線的<b>斜率</b>。高度大的地方，面積長得快，下圖就陡；高度小，面積長得慢，下圖就平。") + "</p>");
    draw();
  }

  SK.mountUnit({
    slug: "fundamental-theorem",
    en: "How fast the area grows is the height",
    formula: "\\frac{d}{dx}\\co{\\int_a^x f(t)\\,dt}=\\cb{f(x)},\\qquad \\int_a^b f(t)\\,dt=F(b)-F(a)",

    hook: {
      html: "一台車的速度一直在變。等速時很簡單：距離＝速度×時間。可是速度忽快忽慢呢？",
      ask: "如果手上只有「每一刻的速度」這張圖，你能不能算出它總共走了多遠？和圖上的哪個東西有關？",
      visual: hookVisual
    },

    guess: {
      q: "用很多細長條（黎曼和）去估計曲線下的面積。長條越切越細、越來越多，會發生什麼事？",
      options: [
        { t: "誤差越來越小，逼近真正的面積", truth: true, explain: "每一條長條頂端和曲線之間的小縫隙，會隨著長條變細而縮小，而且縮小得比長條增加的速度還快，所以總誤差趨近 0。這個極限就是定積分。" },
        { t: "永遠有一段固定的誤差", explain: "長條頂端是平的，曲線是彎的，所以總會有縫隙，這個觀察很敏銳！不過縫隙會跟著長條一起變小，總和也跟著趨近 0，不會卡在一個固定值。" },
        { t: "長條越多越不準", explain: "直覺上，切得越碎、誤差累積越多，這種擔心很合理！但每條的誤差縮小得更快：寬度減半時，每條的誤差大約變成四分之一，總誤差反而減半。" },
        { t: "長條無限多，面積就無限大", common: true, explain: "這和「無窮等比級數」單元是同一種迷思！長條數量變多時，每一條也變細了，總面積一直被困在曲線下面。無限多個越來越小的東西，加起來可以是有限的。" }
      ]
    },

    derive: {
      intro: "以 $f(t)=\\tfrac{t^2}{4}+1$ 為例，從 $t=0$ 到 $t=x$ 的面積叫做 $A(x)$。",
      tall: true,
      frames: [
        { cap: "曲線 $y=f(t)$ 下方，從 $0$ 到 $x$ 的面積叫做 $A(x)$。它會隨著 $x$ 往右移而變大。", tex: "\\co{A(x)}=\\text{從 }0\\text{ 到 }x\\text{ 的面積}" },
        { cap: "先用 $n$ 條長方形估計：每條寬 $\\Delta t$，高度取該段右端的函數值，加起來就是<b>黎曼和</b>。拖動滑桿改變 $n$。", tex: "A(x)\\approx\\sum_{k=1}^{n}f(t_k)\\,\\Delta t" },
        { cap: "讓 $n\\to\\infty$，長條越來越細，誤差消失。黎曼和的極限就是<b>定積分</b>。", tex: "\\co{A(x)}=\\lim_{n\\to\\infty}\\sum_{k=1}^{n}f(t_k)\\,\\Delta t=\\int_0^x f(t)\\,dt" },
        { cap: "現在換個問題：把 $x$ 往右推一點點 $h$，面積<b>多了多少</b>？多出來的是一條細細的長條，寬 $h$、高差不多是 $f(x)$。", tex: "A(x+h)-A(x)\\approx\\cb{f(x)}\\cdot h" },
        { cap: "兩邊除以 $h$，再讓 $h\\to0$。左邊正是 $A$ 的導數，也就是面積的變化率。<b>面積長大的速度，就是那裡的高度！</b>", tex: "A'(x)=\\lim_{h\\to0}\\frac{A(x+h)-A(x)}{h}=\\cb{f(x)}" },
        { cap: "所以只要找到任何一個 $F$ 滿足 $F'=f$（反導函數），面積就是 $F$ 的差。這裡 $F(t)=\\tfrac{t^3}{12}+t$。", tex: "\\int_0^x\\left(\\tfrac{t^2}{4}+1\\right)dt=F(x)-F(0)=\\tfrac{x^3}{12}+x" }
      ],
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 520, 440, "曲線下的面積、黎曼和與細長條");
        var g = s("g", {}, svg);
        var st = { x: 3.4, n: 6 };
        var X = function (t) { return 60 + t * 100; }, Y = function (y) { return 400 - y * 64; };
        var read = SK.h("div", { class: "readout" });
        var slX = SK.slider({ label: "$x$", min: .5, max: 4.2, step: .05, value: st.x, onInput: function (v) { st.x = v; draw(); } });
        var slN = SK.slider({ label: "$n$", min: 1, max: 60, value: st.n, color: "blue", fmt: function (v) { return v + " 條"; }, onInput: function (v) { st.n = v; draw(); } });
        ctx.sliders.appendChild(slX.el); ctx.sliders.appendChild(slN.el);
        ctx.extra.appendChild(read);
        var anim = null;
        function draw() {
          var fr = ctx.frame, x = st.x, n = st.n;
          slN.el.style.display = fr === 1 || fr === 2 ? "" : "none";
          g.innerHTML = "";
          s("line", { x1: 40, y1: Y(0), x2: 510, y2: Y(0), class: "m-axis" }, g);
          s("line", { x1: X(0), y1: Y(0), x2: X(0), y2: 20, class: "m-axis" }, g);
          SK.label(g, 505, Y(0) + 16, "t", { it: true });
          for (var k = 1; k <= 4; k++) {
            s("line", { x1: X(k), y1: Y(0) - 4, x2: X(k), y2: Y(0) + 4, class: "m-axis" }, g);
            SK.label(g, X(k), Y(0) + 18, String(k), { size: 12, color: C.soft });
          }
          var area = "M" + X(0) + " " + Y(0), d = "";
          for (var t = 0; t <= 4.5; t += .04) { d += (t ? "L" : "M") + X(t) + " " + Y(f(t)); if (t <= x) area += " L" + X(t) + " " + Y(f(t)); }
          area += " L" + X(x) + " " + Y(f(x)) + " L" + X(x) + " " + Y(0) + "Z";
          if (fr === 0 || fr >= 3) s("path", { d: area, fill: C.orange.f, filter: "url(#sk-soft)" }, g);
          var riem = 0;
          if (fr === 1 || fr === 2) {
            var dt = x / n;
            for (var i = 1; i <= n; i++) {
              var hgt = f(i * dt); riem += hgt * dt;
              s("rect", { x: X((i - 1) * dt), y: Y(hgt), width: dt * 100, height: hgt * 64, fill: C.blue.f, stroke: n > 30 ? "none" : C.blue.s, "stroke-width": 1.2 }, g);
            }
            s("path", { d: area, fill: "none", stroke: C.orange.s, "stroke-width": 1.5, "stroke-dasharray": "4 4" }, g);
          }
          s("path", { d: d, fill: "none", stroke: C.ink, "stroke-width": 2.8 }, g);
          SK.label(g, X(4.3), Y(f(4.3)) - 16, "y = f(t)", { size: 14, anchor: "end" });
          if (fr >= 3) {
            var h = .32;
            s("rect", { x: X(x), y: Y(f(x + h)), width: h * 100, height: f(x + h) * 64, fill: C.blue.f, stroke: C.blue.s, "stroke-width": 2, class: fr === 3 ? "pulse" : "" }, g);
            s("line", { x1: X(x), y1: Y(0), x2: X(x), y2: Y(f(x)), stroke: C.blue.s, "stroke-width": 4 }, g);
            SK.label(g, X(x + h / 2), Y(0) + 34, "h", { it: true, color: C.blue.s });
            SK.label(g, X(x) - 8, Y(f(x) / 2), "f(x)", { it: true, anchor: "end", color: C.blue.s });
          }
          if (fr === 0 || fr >= 3) SK.label(g, X(x / 2), Y(f(x / 2) / 2), "A(x)", { it: true, size: 20, color: C.orange.s });
          SK.label(g, X(x), Y(0) + 18, "x", { it: true, color: C.orange.s });
          var exact = F(x);
          if (fr === 1 || fr === 2) read.innerHTML = SK.tex("\\begin{aligned}\\text{黎曼和}&=" + SK.fmt(riem, 4) + "\\\\ \\text{真正面積}&=" + SK.fmt(exact, 4) + "\\\\ \\text{誤差}&=" + SK.fmt(riem - exact, 4) + "\\end{aligned}", true);
          else if (fr >= 5) read.innerHTML = SK.tex("A(" + SK.fmt(x, 2) + ")=\\tfrac{" + SK.fmt(x, 2) + "^3}{12}+" + SK.fmt(x, 2) + "=" + SK.fmt(exact, 4), true);
          else if (fr >= 3) read.innerHTML = SK.tex("\\begin{aligned}h=0.32:&\\ \\tfrac{A(x+h)-A(x)}{h}=" + SK.fmt((F(x + .32) - F(x)) / .32, 3) + "\\\\ h=0.01:&\\ \\tfrac{A(x+h)-A(x)}{h}=" + SK.fmt((F(x + .01) - F(x)) / .01, 3) + "\\\\ &\\ f(x)=" + SK.fmt(f(x), 3) + "\\end{aligned}", true);
          else read.innerHTML = SK.tex("A(" + SK.fmt(x, 2) + ")\\approx" + SK.fmt(exact, 3), true);
        }
        function show(i) {
          if (anim) { clearInterval(anim); anim = null; }
          if (i === 1 && st.n > 12) { st.n = 6; slN.set(6, true); }
          if (i === 2) {
            var k = Math.max(st.n, 4);
            anim = setInterval(function () { k = Math.min(60, Math.round(k * 1.25) + 1); st.n = k; slN.set(k, true); draw(); if (k >= 60) { clearInterval(anim); anim = null; } }, 280);
          }
          draw();
        }
        return { show: show };
      }
    },

    angles: [
      { title: "兩張圖並排：高度 = 斜率", icon: "sparkle", render: twinAngle },
      { title: "回到開頭的車子", icon: "bulb",
        html: "如果 $f(t)$ 是速度，一小段時間 $\\Delta t$ 走的距離約是 $f(t)\\Delta t$，也就是一條細長條的面積。全部加起來、再取極限，<b>速度曲線下的面積就是位移</b>。反過來，位置函數的導數就是速度。「累積」和「變化率」互為反向操作，這就是微積分基本定理把微分和積分綁在一起的原因。" }
    ],

    challenges: [
      { q: "用黎曼和直接算 $\\displaystyle\\int_0^1 t^2\\,dt$，看看是不是 $\\tfrac13$。", hint: "把 $[0,1]$ 切成 $n$ 等份，取右端點：$\\displaystyle\\sum_{k=1}^n\\left(\\tfrac kn\\right)^2\\cdot\\tfrac1n=\\tfrac1{n^3}\\sum_{k=1}^n k^2$。高一的平方和公式派上用場了。",
        idea: "$\\dfrac{1}{n^3}\\cdot\\dfrac{n(n+1)(2n+1)}{6}\\to\\dfrac{2}{6}=\\dfrac13$。再用微積分基本定理：$\\left.\\tfrac{t^3}{3}\\right|_0^1=\\tfrac13$。兩條完全不同的路，同一個答案。" },
      { q: "如果 $f(t)$ 是速度，而且有一段時間是負的（倒車），$\\displaystyle\\int_a^b f(t)\\,dt$ 代表什麼？和「總共開了多少公里」一樣嗎？", hint: "負的速度在圖上是 $t$ 軸下方的面積。",
        idea: "定積分是<b>帶號</b>面積：$t$ 軸下方算負的，代表位移（最後離起點多遠）。總路程要把負的部分取絕對值再加。" },
      { q: "「等差級數」單元的階梯 $1+2+\\cdots+n$ 和三角形面積 $\\displaystyle\\int_0^n t\\,dt=\\tfrac{n^2}{2}$ 差了多少？差的那些是什麼形狀？", hint: "把階梯和直線 $y=t$ 畫在一起。",
        idea: "$\\dfrac{n(n+1)}{2}-\\dfrac{n^2}{2}=\\dfrac n2$，正好是 $n$ 個面積 $\\tfrac12$ 的小三角形。黎曼和和積分之間的誤差，從高一就藏在那裡了。" }
    ],

    where: {
      codes: [["F-12甲-5", "黎曼和：上和、下和與黎曼和的極限，連結定積分"], ["F-12甲-6", "積分：多項式反導函數、不定積分、定積分的面積／位移／總變化量、微積分基本定理"]],
      exam: "12 年級<b>選修數學甲</b>，只在分科測驗數甲的範圍內，學測不考。它把 `F-12甲-3/4` 的微分和這裡的積分連成一條故事線，後面的 `F-12甲-7` 面積、體積應用都靠它。",
      stop: "計算以多項式為主。分部積分、變數變換等積分技巧都不在高中範圍；$\\sin x$、$e^x$ 等超越函數的微積分只作 `※` 的示例，不擴張成完整的技巧訓練。"
    }
  });
})();
