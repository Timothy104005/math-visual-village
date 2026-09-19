/* 單元：複數與方程式（虛根、代數基本定理、虛根成對、勘根） */
(function () {
  var C = SK.C, s = SK.s;

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 250, "y 等於 x 平方加 1 的圖形碰不到 x 軸");
    var X = function (x) { return 200 + x * 60; }, Y = function (y) { return 200 - y * 30; };
    s("line", { x1: 20, y1: Y(0), x2: 380, y2: Y(0), class: "m-axis" }, svg);
    s("line", { x1: X(0), y1: 20, x2: X(0), y2: 235, class: "m-axis" }, svg);
    var d = "";
    for (var x = -2.6; x <= 2.6; x += .05) d += (d ? "L" : "M") + X(x) + " " + Y(x * x + 1);
    s("path", { d: d, fill: "none", stroke: C.ink, "stroke-width": 2.4 }, svg);
    SK.label(svg, X(1.9), Y(5.2), "y = x² + 1", { size: 14, anchor: "start" });
    SK.label(svg, 200, 228, "碰不到 x 軸：x² + 1 = 0 沒有「實數」根", { size: 13, color: C.soft });
  }

  SK.mountUnit({
    slug: "complex-equations",
    en: "Every polynomial has all its roots — in the complex plane",
    formula: "\\deg f=\\co{n}\\ \\Rightarrow\\ f(x)=0\\ \\text{恰有}\\ \\co{n}\\ \\text{個複數根},\\qquad f(\\cb{z})=0\\Rightarrow f(\\cb{\\bar z})=0",

    hook: {
      html: "$y=x^2+1$ 的圖形整條都在 $x$ 軸上方，所以 $x^2+1=0$ 沒有實數根。可是加入 $i$ 之後，$x=\\pm i$ 就是它的兩個根。",
      ask: "那三次、四次、一百次的方程式呢？會不會又需要發明新的數，才能讓它們有根？",
      visual: hookVisual
    },

    guess: {
      q: "實係數的三次方程式 $x^3+x^2+x+1=0$，一共有幾個複數根？",
      options: [
        { t: "3 個（重根算重複次數）", truth: true, explain: "代數基本定理：$n$ 次方程式在複數中恰有 $n$ 個根。這一題是 $(x+1)(x^2+1)=0$，根是 $-1,\\ i,\\ -i$：一個實根、一對共軛虛根。" },
        { t: "1 個，因為圖形只穿過 $x$ 軸一次", common: true, explain: "圖形上只看得到<b>實數</b>根，這個觀察完全正確！另外兩個根是虛數 $\\pm i$，它們不在 $x$ 軸上，所以圖上看不到。" },
        { t: "可能 0 個", explain: "實係數三次方程式兩端方向相反，一定穿過 $x$ 軸，至少有一個實根；加上虛根，總共一定是 3 個。" },
        { t: "不一定，要看係數", explain: "實根的個數確實要看係數（1 個或 3 個），但把虛根算進去之後，總數永遠等於次數。" }
      ]
    },

    derive: {
      intro: "上圖是實數的函數圖形；下圖是複數平面，標出所有的根。拖動滑桿改變方程式 $x^3+bx+c=0$ 的係數。",
      tall: true,
      frames: [
        { cap: "上圖中，函數圖形和 $x$ 軸的交點就是<b>實根</b>。下圖是複數平面，實根會落在實軸上。", tex: "f(x)=x^3+bx+c" },
        { cap: "調整係數讓圖形只碰到 $x$ 軸一次：實根只剩一個，另外兩個根跑出實軸，變成<b>虛根</b>。", tex: "\\text{實根 }1\\text{ 個}+\\text{虛根 }2\\text{ 個}=3" },
        { cap: "兩個虛根永遠對實軸<b>鏡射</b>成對：$a+bi$ 和 $a-bi$。這是因為係數都是實數，取共軛不會改變方程式。", tex: "f(\\bar z)=\\overline{f(z)}=\\bar 0=0" },
        { cap: "不管係數怎麼調，根的總數永遠是 3（重根算重複次數）。這就是<b>代數基本定理</b>：複數已經「夠用」了，不必再發明新的數。", tex: "f(x)=a(x-z_1)(x-z_2)\\cdots(x-z_n)" },
        { cap: "找實根的實用工具：<b>勘根定理</b>。若 $f(a)$ 和 $f(b)$ 一正一負，連續的圖形中間一定穿過 $x$ 軸。", tex: "\\begin{gathered}f(a)f(b)<0\\\\ \\Rightarrow\\ (a,b)\\ \\text{中至少有一個實根}\\end{gathered}" }
      ],
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 520, 460, "三次函數圖形與複數平面上的根");
        var g = s("g", {}, svg);
        var st = { b: -3, c: 1 };
        var read = SK.h("div", { class: "readout" });
        ctx.sliders.appendChild(SK.slider({ label: "$b$", min: -6, max: 4, step: .1, value: st.b, onInput: function (v) { st.b = v; draw(); } }).el);
        ctx.sliders.appendChild(SK.slider({ label: "$c$", min: -5, max: 5, step: .1, value: st.c, color: "blue", onInput: function (v) { st.c = v; draw(); } }).el);
        ctx.extra.appendChild(read);
        function roots(b, c) {
          // 用數值方法找 x^3+bx+c 的一個實根，再解剩下的二次式
          var x = 0, lo = -10, hi = 10;
          for (var k = 0; k < 80; k++) { var m = (lo + hi) / 2, fm = m * m * m + b * m + c; if (fm > 0) hi = m; else lo = m; }
          x = (lo + hi) / 2;
          // x^3+bx+c = (x - r)(x^2 + r x + (r^2 + b))
          var p = x, q = x * x + b, D = p * p - 4 * q, out = [[x, 0]];
          if (D >= 0) { out.push([(-p + Math.sqrt(D)) / 2, 0]); out.push([(-p - Math.sqrt(D)) / 2, 0]); }
          else { out.push([-p / 2, Math.sqrt(-D) / 2]); out.push([-p / 2, -Math.sqrt(-D) / 2]); }
          return out;
        }
        function draw() {
          var f = ctx.frame, b = st.b, c = st.c, rs = roots(b, c);
          var X = function (x) { return 260 + x * 55; }, Y1 = function (y) { return 120 - y * 9; }, Y2 = function (y) { return 350 - y * 55; };
          g.innerHTML = "";
          // 上：實函數
          s("rect", { x: 20, y: 12, width: 480, height: 200, rx: 12, fill: "rgba(253,251,246,.6)", stroke: C.line, "stroke-width": .8 }, g);
          s("line", { x1: 24, y1: Y1(0), x2: 496, y2: Y1(0), class: "m-axis" }, g);
          SK.label(g, 30, 26, "y = x³ + bx + c（實數圖形）", { size: 12, anchor: "start", color: C.soft });
          var d = "";
          for (var x = -4.2; x <= 4.2; x += .03) d += (d ? "L" : "M") + X(x) + " " + SK.clamp(Y1(x * x * x + b * x + c), 14, 210);
          s("path", { d: d, fill: "none", stroke: C.ink, "stroke-width": 2.2 }, g);
          if (f === 4) {
            var a0 = -3, b0 = 3, fa = a0 * a0 * a0 + b * a0 + c, fb = b0 * b0 * b0 + b * b0 + c;
            [[a0, fa], [b0, fb]].forEach(function (pt) { s("circle", { cx: X(pt[0]), cy: SK.clamp(Y1(pt[1]), 14, 210), r: 5, fill: pt[1] > 0 ? C.orange.f : C.blue.f, stroke: C.cocoa }, g); });
            SK.label(g, X(a0), 200, "f(−3) " + (fa > 0 ? "> 0" : "< 0"), { size: 12, color: fa > 0 ? C.orange.s : C.blue.s });
            SK.label(g, X(b0), 200, "f(3) " + (fb > 0 ? "> 0" : "< 0"), { size: 12, color: fb > 0 ? C.orange.s : C.blue.s });
          }
          // 下：複數平面
          s("rect", { x: 20, y: 228, width: 480, height: 224, rx: 12, fill: "rgba(253,251,246,.6)", stroke: C.line, "stroke-width": .8 }, g);
          s("line", { x1: 24, y1: Y2(0), x2: 496, y2: Y2(0), class: "m-axis" }, g);
          s("line", { x1: X(0), y1: 232, x2: X(0), y2: 448, class: "m-axis" }, g);
          SK.label(g, 30, 242, "複數平面：所有的根", { size: 12, anchor: "start", color: C.soft });
          rs.forEach(function (r) {
            var isReal = Math.abs(r[1]) < 1e-9, px = X(r[0]), py = SK.clamp(Y2(r[1]), 236, 444);
            s("line", { x1: px, y1: Y1(0), x2: px, y2: Y2(0), stroke: isReal ? C.green.s : "none", "stroke-dasharray": "3 4", opacity: .6 }, g);
            s("circle", { cx: px, cy: py, r: 7, fill: isReal ? C.green.f : C.pink.f, stroke: isReal ? C.green.s : C.pink.s, "stroke-width": 1.6 }, g);
            if (isReal) s("circle", { cx: px, cy: Y1(0), r: 4.5, fill: C.green.s }, g);
          });
          if (f >= 2 && Math.abs(rs[1][1]) > 1e-9) {
            s("line", { x1: X(rs[1][0]), y1: Y2(rs[1][1]), x2: X(rs[2][0]), y2: Y2(rs[2][1]), stroke: C.pink.s, "stroke-dasharray": "4 4" }, g);
            SK.label(g, X(rs[1][0]) + 14, Y2(0) - 12, "對實軸鏡射", { size: 12, anchor: "start", color: C.pink.s });
          }
          var nReal = rs.filter(function (r) { return Math.abs(r[1]) < 1e-9; }).length;
          read.innerHTML = SK.tex("\\text{根：}" + rs.map(function (r) { return Math.abs(r[1]) < 1e-9 ? SK.fmt(r[0], 2) : SK.fmt(r[0], 2) + (r[1] > 0 ? "+" : "-") + SK.fmt(Math.abs(r[1]), 2) + "i"; }).join(",\\ ") + "\\quad(\\text{實根 }" + nReal + "\\text{ 個})", true);
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "二次方程式的判別式，換個角度看", icon: "sparkle",
        html: "$ax^2+bx+c=0$ 的根是 $\\dfrac{-b\\pm\\sqrt{D}}{2a}$。$D>0$ 時兩個實根對稱地站在 $x=-\\frac{b}{2a}$ 兩側；$D$ 變小時兩根往中間靠攏；$D=0$ 時重合成重根；$D<0$ 時兩根<b>轉個方向</b>，沿著垂直實軸的方向分開，變成一對共軛虛根。在複數平面上看，根從來沒有消失，只是離開了實軸。" },
      { title: "一次因式檢驗法：先猜，再用因式定理確認", icon: "leaf",
        html: "要找整係數多項式的根，可以先從常數項、首項係數的因數「猜」幾個候選，代入看是否為 0（因式定理）。找到一個實根後就能降次，剩下的交給二次公式。它是好用的工具，但課綱提醒：不要把它變成大量的有理根檢驗題（詳見補充單元「有理根候選」）。" }
    ],

    challenges: [
      { q: "已知實係數三次方程式有一根是 $2+i$，另外兩個根可能是什麼？如果常數項告訴你三根乘積是 $-10$ 呢？", hint: "虛根成對。再用根與係數的關係。",
        idea: "$2-i$ 一定也是根。$(2+i)(2-i)=5$，所以第三根 $r$ 滿足 $5r=-10$，$r=-2$。" },
      { q: "用勘根定理說明 $x^3-3x+1=0$ 在 $0$ 和 $1$ 之間有一個根。", idea: "$f(0)=1>0$、$f(1)=-1<0$，連續的圖形從正變負，中間一定穿過 $x$ 軸。再用「導數」單元的牛頓法，就能快速逼近這個根。" },
      { q: "為什麼「實係數」這個條件很重要？舉一個虛根不成對的方程式。", idea: "$x-i=0$ 只有一個根 $i$，它的共軛 $-i$ 不是根。係數本身有虛數時，取共軛會改變方程式，成對的性質就不成立了。" }
    ],

    where: {
      codes: [["A-12甲-1", "複數與方程式：方程式的虛根、代數基本定理、實係數方程式的虛根成對性質"], ["F-12甲-2", "介值定理（勘根）"]],
      exam: "12 年級<b>選修數學甲</b>，分科測驗數甲的範圍。對應教材「複數平面」章的前半：複數、二次方程式、一次因式檢驗法、虛根成對、勘根定理。",
      stop: "重點是方程式次數與根的個數、實根與虛根的結構。不含特殊解根技巧、三次以上的求根公式，也不含整係數方程式的有理根技巧題。"
    }
  });
})();
