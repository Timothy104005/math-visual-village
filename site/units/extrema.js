/* 單元：導函數的應用——單調、凹凸、極值 */
(function () {
  var C = SK.C, s = SK.s;
  function V(x) { return x * (12 - 2 * x) * (12 - 2 * x); }
  function V1(x) { return 12 * x * x - 96 * x + 144; }
  function V2(x) { return 24 * x - 96; }

  function hookVisual(el) {
    var svg = SK.svg(el, 420, 250, "正方形紙板四角剪掉小正方形，折成無蓋盒子");
    var x0 = 30, y0 = 30, L = 180, cut = 40;
    s("rect", { x: x0, y: y0, width: L, height: L, fill: C.gold.f, stroke: C.cocoa, "stroke-width": 1.3 }, svg);
    [[0, 0], [L - cut, 0], [0, L - cut], [L - cut, L - cut]].forEach(function (p) { s("rect", { x: x0 + p[0], y: y0 + p[1], width: cut, height: cut, fill: "#FDFBF6", stroke: C.pink.s, "stroke-dasharray": "4 3" }, svg); });
    SK.label(svg, x0 + cut / 2, y0 + cut / 2, "x", { it: true, color: C.pink.s });
    SK.label(svg, x0 + L / 2, y0 + L + 16, "12 cm", { size: 13 });
    // 盒子
    var bx = 270, by = 150, w = 100, d = 40, h = 45;
    s("path", { d: "M" + bx + " " + by + " l" + w + " 0 l" + d * .6 + " " + (-d * .5) + " l0 " + (-h) + " l" + (-w) + " 0 l" + (-d * .6) + " " + (d * .5) + "z", fill: C.orange.f, stroke: C.cocoa, "stroke-width": 1.2 }, svg);
    s("path", { d: "M" + bx + " " + by + " l0 " + (-h) + " l" + w + " 0 l0 " + h, fill: "none", stroke: C.cocoa, "stroke-width": 1.2 }, svg);
    SK.label(svg, 330, 200, "剪多少，容積最大？", { size: 14, color: C.soft });
  }

  SK.mountUnit({
    slug: "extrema",
    en: "What the slope tells you about the shape",
    formula: "\\cb{f'(x)}>0\\Rightarrow\\text{遞增},\\quad \\cb{f'(x)}<0\\Rightarrow\\text{遞減},\\quad \\cp{f''(x)}>0\\Rightarrow\\text{凹向上}",

    hook: {
      html: "一張 12 公分見方的紙板，四個角各剪掉邊長 $x$ 的小正方形，再把四邊折起來，做成一個無蓋的盒子。容積是 $V(x)=x(12-2x)^2$。",
      ask: "$x$ 剪太小，盒子很淺；剪太大，底很小。剪多少，容積最大？",
      visual: hookVisual
    },

    guess: {
      q: "要讓盒子容積最大，$x$ 應該剪多少公分？",
      options: [
        { t: "1 公分", explain: "$V(1)=100$。還不是最大，再多剪一點，盒子變深的好處大過底變小的損失。" },
        { t: "2 公分", truth: true, explain: "$V(2)=2\\times8^2=128$，是最大值。等一下你會看到：這裡的切線是水平的，也就是 $V'(2)=0$。" },
        { t: "3 公分", common: true, explain: "3 是 0 到 6 的正中間，猜「中間最好」很自然！但 $V(3)=3\\times6^2=108$，比 $x=2$ 小。容積不是對稱的，最大值不一定在正中間。" },
        { t: "6 公分", explain: "剪 6 公分，底邊就變成 $12-12=0$，盒子沒有底，容積是 0。" }
      ]
    },

    derive: {
      intro: "上圖是容積 $V(x)$，下圖是它的導函數 $V'(x)$。拖動滑桿移動點 $x$。",
      tall: true,
      frames: [
        { cap: "畫出 $V(x)=x(12-2x)^2$，$0\\le x\\le6$。曲線先上升、再下降，中間有一個最高點。", tex: "V(x)=4x^3-48x^2+144x" },
        { cap: "在每一點畫切線：切線往上斜（$V'>0$）的地方曲線<b>遞增</b>（綠色），往下斜（$V'<0$）的地方<b>遞減</b>（玫瑰色）。", tex: "\\begin{aligned}V'(x)&=12x^2-96x+144\\\\&=12(x-2)(x-6)\\end{aligned}" },
        { cap: "下圖畫出 $V'(x)$。它在 $x=2$ 從正變負：曲線從上升轉為下降，那裡就是<b>極大值</b>。", tex: "V'(2)=0,\\quad V'\\ \\text{由正變負}\\ \\Rightarrow\\ \\text{極大}" },
        { cap: "再看彎曲的方向：$V''(x)=24x-96$。$x<4$ 時 $V''<0$，曲線<b>凹向下</b>（像山頂）；$x>4$ 時凹向上。$x=4$ 是<b>反曲點</b>。", tex: "V''(x)=24x-96,\\quad V''(4)=0" },
        { cap: "回到盒子：剪 2 公分，容積最大 128 立方公分。不用一個一個試，導數直接告訴我們答案在哪裡。", tex: "V_{\\max}=V(2)=2\\times8^2=128" }
      ],
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 520, 460, "容積函數與它的導函數");
        var g = s("g", {}, svg);
        var st = { x: 1.2 };
        var read = SK.h("div", { class: "readout" });
        ctx.sliders.appendChild(SK.slider({ label: "$x$", min: 0, max: 6, step: .05, value: st.x, onInput: function (v) { st.x = v; draw(); } }).el);
        ctx.extra.appendChild(read);
        var X = function (x) { return 50 + x * 75; }, Y1 = function (v) { return 230 - v * 1.5; }, Y2 = function (v) { return 360 - v * .55; };
        function draw() {
          var f = ctx.frame, x = st.x;
          g.innerHTML = "";
          s("line", { x1: 40, y1: Y1(0), x2: 510, y2: Y1(0), class: "m-axis" }, g);
          s("line", { x1: X(0), y1: 20, x2: X(0), y2: 240, class: "m-axis" }, g);
          for (var t = 1; t <= 6; t++) SK.label(g, X(t), Y1(0) + 14, String(t), { size: 11, color: C.soft });
          SK.label(g, X(0) + 6, 24, "V(x)", { size: 13, anchor: "start" });
          // 曲線，依導數正負上色
          for (var a = 0; a < 6; a += .05) {
            var col = f >= 1 ? (V1(a + .025) > 0 ? C.green.s : C.pink.s) : C.ink;
            if (f === 3) col = V2(a + .025) < 0 ? C.orange.s : C.blue.s;
            s("line", { x1: X(a), y1: Y1(V(a)), x2: X(a + .05), y2: Y1(V(a + .05)), stroke: col, "stroke-width": 3, "stroke-linecap": "round" }, g);
          }
          var m = V1(x);
          if (f >= 1) s("line", { x1: X(x - .7), y1: Y1(V(x) - .7 * m), x2: X(x + .7), y2: Y1(V(x) + .7 * m), stroke: C.ink, "stroke-width": 1.4, "stroke-dasharray": "5 4" }, g);
          s("circle", { cx: X(x), cy: Y1(V(x)), r: 6, fill: C.gold.f, stroke: C.cocoa, "stroke-width": 1.3 }, g);
          if (f >= 2) {
            s("circle", { cx: X(2), cy: Y1(128), r: 5, fill: C.orange.s }, g);
            SK.label(g, X(2), Y1(128) - 14, "極大 (2, 128)", { size: 12, color: C.orange.s });
          }
          if (f >= 3) { s("circle", { cx: X(4), cy: Y1(V(4)), r: 5, fill: C.blue.s }, g); SK.label(g, X(4) + 8, Y1(V(4)) - 12, "反曲點", { size: 12, anchor: "start", color: C.blue.s }); }
          // 下圖：導函數
          if (f >= 2) {
            s("line", { x1: 40, y1: Y2(0), x2: 510, y2: Y2(0), class: "m-axis" }, g);
            SK.label(g, X(0) + 6, Y2(150) - 4, "V′(x)", { size: 13, anchor: "start", color: C.blue.s });
            var d = "";
            for (var b = 0; b <= 6; b += .05) d += (b ? "L" : "M") + X(b) + " " + Y2(V1(b));
            s("path", { d: d, fill: "none", stroke: C.blue.s, "stroke-width": 2.4 }, g);
            [2, 6].forEach(function (r) { s("circle", { cx: X(r), cy: Y2(0), r: 4.5, fill: C.blue.f, stroke: C.blue.s }, g); });
            s("line", { x1: X(x), y1: Y1(V(x)), x2: X(x), y2: Y2(m), stroke: C.line, "stroke-dasharray": "3 4" }, g);
            s("circle", { cx: X(x), cy: Y2(m), r: 4.5, fill: C.gold.f, stroke: C.cocoa }, g);
          }
          read.innerHTML = SK.tex("V(" + SK.fmt(x, 2) + ")=" + SK.fmt(V(x), 2) + ",\\quad V'(" + SK.fmt(x, 2) + ")=" + SK.fmt(m, 2) + (f >= 3 ? ",\\quad V''=" + SK.fmt(V2(x), 1) : ""), true);
        }
        return { show: draw };
      }
    },

    drills: [
      { title: "閉區間最值：臨界點和端點一起比", code: "F-12甲-4／F-12乙-4",
        demo: {
          q: "求 $f(x)=x^3-3x^2-9x+5$ 在 $[-2,4]$ 的最大值與最小值；再把區間改成 $[0,2]$。",
          steps: [
            "$f'(x)=3x^2-6x-9=3(x-3)(x+1)$，臨界點 $x=-1$、$x=3$，兩個都在 $[-2,4]$ 裡。",
            "列出<b>所有候選</b>：$f(-2)=3$、$f(-1)=10$、$f(3)=-22$、$f(4)=-15$。",
            "最大值 $10$（$x=-1$），最小值 $-22$（$x=3$）。",
            "區間改成 $[0,2]$：兩個臨界點都在區間外，$-1<x<3$ 時 $f'<0$，函數在區間上一路遞減，只要比端點：最大 $f(0)=5$、最小 $f(2)=-17$。"
          ]
        },
        tries: [
          { q: "求 $f(x)=2x^3-3x^2$ 在 $[-1,2]$ 的最大值與最小值。", ans: "$f'=6x(x-1)$，臨界點 $0,1$。候選：$f(-1)=-5$、$f(0)=0$、$f(1)=-1$、$f(2)=4$。最大 $4$、最小 $-5$——<b>兩個都在端點</b>，雖然函數在 $x=0$ 有極大。" }
        ],
        edge: "極大值不一定是最大值：上一題的極大 $f(0)=0$ 比端點 $f(2)=4$ 小。$f'(c)=0$ 也不保證是極值（$x^3$ 在 $0$）。候選清單永遠是「區間內的臨界點＋兩個端點」；若是開區間或無界區間，端點取不到，最值可能不存在。"
      },
      { title: "邊際成本：導數 ≈ 多做一件的增量（數乙）", code: "F-12乙-4",
        demo: {
          q: "生產 $q$ 件的總成本 $C(q)=0.5q^2+3q+20$（千元）。求 $C'(10)$ 並解釋，與第 $11$ 件的實際增量比較。",
          steps: [
            "先看單位：$C$ 是千元、$q$ 是件，所以 $C'(q)$ 的單位是「千元／件」。",
            "$C'(q)=q+3$，$C'(10)=13$：產量在 $10$ 件附近時，每多做一件，成本<b>大約</b>增加 $13$ 千元——這就是<b>邊際成本</b>。",
            "實際第 $11$ 件：$C(11)-C(10)=113.5-100=13.5$ 千元。",
            "差別：$C'(10)$ 是 $q=10$ 那一瞬間的變化率；$C(11)-C(10)$ 是 $[10,11]$ 上的平均變化率。導數給的是一次估計 $C(11)\\approx C(10)+C'(10)\\cdot1$。",
            "別混淆：固定成本 $C(0)=20$；平均成本 $\\frac{C(10)}{10}=10$ 千元／件，和邊際成本 $13$ 是不同的量。"
          ]
        },
        tries: [
          { q: "收益 $R(q)=40q-q^2$（千元），成本同上。利潤最大時，邊際收益和邊際成本有什麼關係？若 $q$ 只能取整數，產量多少最好？", ans: "$P=R-C=-1.5q^2+37q-20$，$P'=0\\iff R'(q)=C'(q)$，即 $40-2q=q+3$，$q=\\frac{37}3\\approx12.3$。整數時比較 $P(12)=208$、$P(13)=207.5$，取 $q=12$，利潤 $208$ 千元。" },
          { q: "$C(q)=q^3-6q^2+15q+10$。邊際成本在哪個產量最小？", ans: "$C'(q)=3q^2-12q+15$，$C''(q)=6q-12=0\\Rightarrow q=2$，此時邊際成本 $C'(2)=3$ 最小（$C'$ 是開口向上的拋物線）。" }
        ],
        edge: "邊際成本是「下一件的<b>近似</b>增量」；$C$ 越彎，近似越不準。單位一定要跟著題目：若 $q$ 以「百件」計，$C'(q)$ 是每多一百件的增量。邊際 $\\ne$ 平均，兩者只在平均成本的最低點相等。"
      }
    ],

    angles: [
      { title: "$f'(a)=0$ 不一定是極值", icon: "sparkle",
        html: "$f(x)=x^3$ 在 $x=0$ 時 $f'(0)=0$，切線是水平的。但左右兩邊都是往上走，導數沒有變號，所以 $x=0$ 不是極大也不是極小，而是一個平坦的反曲點。判斷極值要看 $f'$ <b>有沒有變號</b>，而不只是等不等於 0。" },
      { title: "一次估計與泰勒展開", icon: "leaf",
        html: "在 $x=a$ 附近，切線是最好的直線近似：$f(a+h)\\approx f(a)+f'(a)h$。再加上彎曲的修正，就更準：$$f(a+h)\\approx f(a)+f'(a)h+\\frac{f''(a)}{2}h^2.$$ 對多項式來說，一直加到最高次，就完全相等，這就是<b>多項式的泰勒展開</b>。例如 $V(2+h)=128+0\\cdot h-24h^2+4h^3$：$h$ 很小時，盒子容積只比 128 少一點點，這也說明了為什麼在最大值附近「差一點點沒關係」。" }
    ],

    challenges: [
      { q: "「算幾不等式」單元的圍籬問題：周長 20，長方形面積 $A(x)=x(10-x)$ 何時最大？用導數再做一次。", idea: "$A'(x)=10-2x=0$，$x=5$，面積 25。兩種方法得到同一個答案。" },
      { q: "$f(x)=x^3-3x$ 的極大值、極小值在哪裡？", idea: "$f'(x)=3(x-1)(x+1)$，$x=-1$ 極大 $f(-1)=2$，$x=1$ 極小 $f(1)=-2$。和「三次函數的樣子」單元的對稱中心 $(0,0)$ 互相呼應。" },
      { q: "把紙板換成長 16、寬 10 的長方形，四角剪 $x$，容積最大時 $x$ 是多少？", hint: "$V(x)=x(16-2x)(10-2x)$，展開後微分。",
        idea: "$V'(x)=12x^2-104x+160=4(3x-20)(x-2)$，在 $0<x<5$ 中只有 $x=2$，最大容積 $2\\times12\\times6=144$。" }
    ],

    where: {
      codes: [["F-12甲-4", "導函數：乘法律、連鎖律、高階導數、單調性、凹凸性、一次估計、基本最佳化、多項式泰勒展開"], ["F-12甲-1", "函數：凹凸的意義"], ["F-12乙-4", "導函數：二階導數、萊布尼茲符號、單調與凹凸的判定、基本最佳化與邊際的意涵"]],
      exam: "12 年級<b>選修數學甲</b>，分科測驗數甲的範圍。對應教材「多項式函數的微積分」中的遞增遞減、凹性與極值。　<b>選修數學乙</b>也學，並強調「邊際成本、邊際收益」這類經濟意涵。",
      stop: "以多項式為主要操作對象；極值的位置應該能用簡單的因式分解判定，不逼迫用牛頓法找難根。高於二階的導數以概念介紹為主。"
    }
  });
})();
