/* 單元：三元一次聯立方程式 */
(function () {
  var C = SK.C, s = SK.s;
  var COLS = [C.orange, C.blue, C.green];

  // 高斯消去的每一步：[說明, 矩陣]
  var M0 = [[1, 1, 1, 6], [2, -1, 1, 3], [1, 2, -1, 2]];
  function steps() {
    var out = [["原來的方程組", M0]], M = M0.map(function (r) { return r.slice(); });
    function op(desc, fn) { M = fn(M.map(function (r) { return r.slice(); })); out.push([desc, M]); }
    op("R_2-2R_1\\to R_2", function (A) { A[1] = A[1].map(function (x, j) { return x - 2 * A[0][j]; }); return A; });
    op("R_3-R_1\\to R_3", function (A) { A[2] = A[2].map(function (x, j) { return x - A[0][j]; }); return A; });
    op("R_2\\leftrightarrow R_3", function (A) { var t = A[1]; A[1] = A[2]; A[2] = t; return A; });
    op("R_3+3R_2\\to R_3", function (A) { A[2] = A[2].map(function (x, j) { return x + 3 * A[1][j]; }); return A; });
    return out;
  }
  var STEPS = steps();
  var CASES = [
    ["唯一解", [[1, 1, 1, 6], [2, -1, 1, 3], [1, 2, -1, 2]], "三個平面交於一點"],
    ["無限多解", [[1, 1, 1, 6], [2, -1, 1, 3], [3, 0, 2, 9]], "第三式 = 前兩式相加：三個平面交於一條直線"],
    ["無解（三角柱）", [[1, 1, 1, 6], [2, -1, 1, 3], [3, 0, 2, 5]], "兩兩相交成三條平行線，沒有共同點"],
    ["無解（平行）", [[1, 1, 1, 6], [1, 1, 1, 2], [2, -1, 1, 3]], "前兩個平面平行"]
  ];

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 250, "三張紙交於一點");
    var v = SK.view3d(svg, { cx: 200, cy: 130, scale: 34, yaw: -120, pitch: 22 });
    var g = s("g", {}, svg);
    v.poly(g, [[-2, -2, 0], [2, -2, 0], [2, 2, 0], [-2, 2, 0]], { fill: C.orange.f, stroke: C.orange.s });
    v.poly(g, [[-2, 0, -1.6], [2, 0, -1.6], [2, 0, 1.6], [-2, 0, 1.6]], { fill: C.blue.f, stroke: C.blue.s });
    v.poly(g, [[0, -2, -1.6], [0, 2, -1.6], [0, 2, 1.6], [0, -2, 1.6]], { fill: C.green.f, stroke: C.green.s });
    v.dot(g, [0, 0, 0], C.pink.s, 6);
    SK.label(svg, 200, 238, "三個平面的共同點，就是方程組的解", { size: 13, color: C.soft });
  }

  function mtex(M, hi) {
    return "\\left[\\begin{array}{rrr|r}" + M.map(function (r, i) {
      var row = r.map(function (x) { return String(Math.round(x * 100) / 100); }).join("&");
      return hi && hi.indexOf(i) >= 0 ? r.map(function (x) { return "\\cp{" + Math.round(x * 100) / 100 + "}"; }).join("&") : row;
    }).join("\\\\") + "\\end{array}\\right]";
  }

  SK.mountUnit({
    slug: "linear-system-3",
    en: "Where three planes meet",
    formula: "\\begin{cases}x+y+z=6\\\\2x-y+z=3\\\\x+2y-z=2\\end{cases}\\ \\Longleftrightarrow\\ \\left[\\begin{array}{rrr|r}1&1&1&6\\\\2&-1&1&3\\\\1&2&-1&2\\end{array}\\right]",

    hook: {
      html: "一個三元一次方程式 $ax+by+cz=d$ 是空間中的一個平面。三個方程式就是三個平面。",
      ask: "解聯立方程式，就是找三個平面的共同點。消去法在做的「把兩式相減」，在圖上是什麼動作？",
      visual: hookVisual
    },

    guess: {
      q: "三個平面最多能有幾個共同點？",
      options: [
        { t: "1 個、無限多個或 0 個，就這三種", truth: true, explain: "一般情形交於一點（唯一解）；如果三個平面都經過同一條直線，就有無限多個共同點；如果有兩個平行，或三條交線互相平行（像三角柱的側面），就沒有共同點。不可能剛好 2 個。" },
        { t: "最多 3 個", common: true, explain: "一元三次方程式最多 3 個根，很容易聯想！但這裡都是一次式：如果兩個點都在三個平面上，連接它們的整條直線也都在，共同點就變成無限多個。" },
        { t: "一定剛好 1 個", explain: "大多數時候是 1 個，但平面可以平行，或者剛好共用一條直線。消去法的最後一列會告訴你是哪一種。" },
        { t: "一定有無限多個", explain: "兩個平面相交通常是一條線，但第三個平面一般只會穿過這條線的一個點。" }
      ]
    },

    derive: {
      intro: "左邊是三個方程式代表的平面，右邊是增廣矩陣。按住圖形拖曳可以旋轉。",
      tall: true,
      frames: [
        { cap: "把係數和常數排成<b>增廣矩陣</b>：每一列是一個方程式，也是一個平面。聯立方程式的解，就是三個平面的共同點 $(1,2,3)$。", tex: "(a,b,c\\,|\\,d)\\ \\leftrightarrow\\ ax+by+cz=d" },
        { cap: "<b>消去法</b>就是列運算：某一列減去另一列的倍數、兩列交換、一列乘上非零數。拖動「步驟」看每一次運算。平面的樣子變了，可是<b>共同點一直都是同一點</b>。", tex: "\\text{列運算不改變解}" },
        { cap: "消到<b>階梯形</b>後，由下往上<b>代回</b>：最後一列只剩 $z$，解出 $z$ 後代回上一列求 $y$，再求 $x$。", tex: "\\begin{aligned}-7z=-21&\\Rightarrow z=3\\\\y-2z=-4&\\Rightarrow y=2\\\\x+y+z=6&\\Rightarrow x=1\\end{aligned}" },
        { cap: "為什麼列運算不改變解？新的方程式是舊方程式的組合：原本滿足兩個方程式的點，一定也滿足它們的組合；反過來也能用列運算變回去。在圖上，新的平面繞著原本兩平面的<b>交線</b>轉動。", tex: "E_1\\cap E_2=E_1\\cap(E_2-kE_1)" },
        { cap: "消成<b>階梯形</b>後，要看<b>每一列</b>，不能只看最後一列：<br>・只要有一列是 $0\\ 0\\ 0\\,|\\,d$（$d\\ne0$）→ <b>無解</b>（矛盾）。<br>・沒有矛盾，而且 $x,y,z$ <b>每個變數都有自己的主元</b>（三列都是「階梯」，例如最後一列 $0\\ 0\\ c\\,|\\,d$、$c\\ne0$，且上面兩列分別有 $x$、$y$ 的主元）→ <b>唯一解</b>。<br>・沒有矛盾，但主元不到三個（出現 $0\\ 0\\ 0\\,|\\,0$ 而上面沒有補足）→ 有自由變數，<b>無限多解</b>。<br>例如第一列就出現 $0=1$，即使最後一列是 $0=0$ 也是無解。點選下面的例子。", tex: "\\text{有矛盾列}\\Rightarrow\\text{無解};\\quad\\text{無矛盾且主元}=3\\Rightarrow\\text{唯一};\\quad\\text{無矛盾且主元}<3\\Rightarrow\\text{無限多}" }
      ],
      hint: "按住圖形拖曳旋轉；第 2 步拖動「步驟」，第 5 步點選例子。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 540, 440, "三個平面與增廣矩陣");
        var g = s("g", {}, svg);
        var v = SK.view3d(svg, { cx: 250, cy: 240, scale: 38, yaw: -140, pitch: 20, onRotate: function () { draw(); } });
        var st = { k: 0, cs: 0 }, SOL = [1, 2, 3];
        var read = SK.h("div", { class: "readout" });
        var slK = SK.slider({ label: "步驟", min: 0, max: STEPS.length - 1, step: 1, value: 0, fmt: function (x) { return x + " / " + (STEPS.length - 1); }, onInput: function (x) { st.k = x; draw(); } });
        ctx.sliders.appendChild(slK.el);
        var btns = SK.h("div", { style: "display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px" });
        CASES.forEach(function (c, i) {
          var b = SK.h("button", { class: "chip", type: "button", "aria-pressed": i === 0 ? "true" : "false" }, c[0]);
          b.addEventListener("click", function () { st.cs = i; Array.prototype.forEach.call(btns.children, function (x, k) { x.setAttribute("aria-pressed", k === i ? "true" : "false"); }); draw(); });
          btns.appendChild(b);
        });
        ctx.extra.appendChild(btns); ctx.extra.appendChild(read);
        function dot(p, q) { return p[0] * q[0] + p[1] * q[1] + p[2] * q[2]; }
        function len(p) { return Math.sqrt(dot(p, p)); }
        function add(p, q, k) { k = k == null ? 1 : k; return [p[0] + k * q[0], p[1] + k * q[1], p[2] + k * q[2]]; }
        function sc(p, k) { return [p[0] * k, p[1] * k, p[2] * k]; }
        function cross(p, q) { return [p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0]]; }
        function plane(row, col, ref) {
          var n = row.slice(0, 3), d = row[3], ln = len(n);
          if (ln < 1e-9) return;
          var c = add(ref, n, -(dot(n, ref) - d) / (ln * ln));
          var t = Math.abs(n[2]) < .9 * ln ? [0, 0, 1] : [1, 0, 0], u1 = cross(n, t); u1 = sc(u1, 1 / len(u1)); var u2 = cross(n, u1); u2 = sc(u2, 1 / len(u2));
          var R = 2.4;
          v.poly(g, [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(function (q) { return add(add(c, u1, q[0] * R), u2, q[1] * R); }), { fill: col.f, stroke: col.s, "stroke-width": 1.2, opacity: .75 });
        }
        function draw() {
          var f = ctx.frame;
          g.innerHTML = "";
          slK.el.style.display = f === 1 || f === 3 ? "" : "none";
          btns.style.display = f === 4 ? "flex" : "none";
          v.axes(g, 4.5, 1);
          var M, info = "", hi = null;
          if (f === 4) {
            M = CASES[st.cs][1];
            M.forEach(function (r, i) { plane(r, COLS[i], [1, 2, 3]); });
            if (st.cs === 0) v.dot(g, SOL, C.pink.s, 7);
            if (st.cs === 1) { var dir = cross(M[0].slice(0, 3), M[1].slice(0, 3)); v.line(g, add(SOL, dir, -1.2), add(SOL, dir, 1.2), { stroke: C.pink.s, "stroke-width": 3.4 }); }
            // 消去後的最後一列
            var A = M.map(function (r) { return r.slice(); });
            for (var c = 0; c < 2; c++) {
              var p = c; while (p < 3 && Math.abs(A[p][c]) < 1e-9) p++;
              if (p === 3) continue;
              var tmp = A[c]; A[c] = A[p]; A[p] = tmp;
              // 不用分數的消去：R ← a·R − b·(樞紐列)
              for (var r2 = c + 1; r2 < 3; r2++) { var a0 = A[c][c], b0 = A[r2][c]; A[r2] = A[r2].map(function (x, j) { return a0 * x - b0 * A[c][j]; }); }
            }
            read.innerHTML = SK.tex("\\small " + mtex(M) + "\\to" + mtex(A, [2]), true) + '<p style="margin:4px 0 0">' + CASES[st.cs][2] + "</p>";
            return;
          }
          var k = f === 0 ? 0 : f === 2 ? STEPS.length - 1 : st.k;
          M = STEPS[k][1];
          if (f === 3 && k > 0) {
            // 顯示前一步的平面（淡）與這一步的平面
            STEPS[k - 1][1].forEach(function (r, i) { plane(r, { f: "rgba(236,229,216,.35)", s: C.line }, SOL); });
          }
          M.forEach(function (r, i) { plane(r, COLS[i], SOL); });
          v.dot(g, SOL, C.pink.s, 7);
          var Sp = v.P(SOL); SK.label(g, Sp[0] + 12, Sp[1] - 10, "(1, 2, 3)", { size: 13, color: C.pink.s, anchor: "start" });
          if (k > 0) { var prev = STEPS[k - 1][1]; hi = [0, 1, 2].filter(function (i) { return prev[i].join() !== M[i].join(); }); }
          info = k === 0 ? "" : "\\text{第 " + k + " 步：}" + STEPS[k][0];
          read.innerHTML = (info ? SK.tex(info, true) : "") + SK.tex(mtex(M, hi), true) + (f === 2 ? SK.tex("(x,y,z)=(1,2,3)", true) : "");
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "電腦怎麼解一千個未知數？", icon: "sparkle",
        html: "天氣預報、橋樑結構、網頁排名，背後都是成千上萬個未知數的聯立方程式。電腦用的方法，就是今天這套列運算（高斯消去法）：只有加減乘除、一步一步把矩陣變成階梯形。手算三元是為了看懂它在做什麼，不是為了算得快。" },
      { title: "和二元一次的比較", icon: "leaf",
        html: "二元一次方程式是平面上的直線：兩條直線交於一點、平行或重合。三元升一維，直線變成平面，情況多了「三個平面交於一條線」與「三角柱」兩種。但判斷方法一樣：消成階梯形後<b>逐列</b>檢查——有任何一列是 $0=$ 非零數就無解；沒有矛盾時，再數主元夠不夠（三元要三個主元才唯一，不夠就有自由變數、無限多解）。" }
    ],

    challenges: [
      { q: "解 $\\begin{cases}x+y=5\\\\y+z=7\\\\x+z=6\\end{cases}$。", hint: "三式相加試試看。", idea: "相加得 $2(x+y+z)=18$，$x+y+z=9$。再分別減去三式：$z=4$、$x=2$、$y=3$。" },
      { q: "$k$ 為多少時，$\\begin{cases}x+y+z=1\\\\x+2y+3z=2\\\\2x+3y+kz=3\\end{cases}$ 有無限多解？", idea: "消去後第三列是 $(0,0,k-4\\,|\\,0)$。$k=4$ 時整列為 0，有無限多解；$k\\ne4$ 時唯一解。" },
      { q: "雞腿、排骨、素食便當單價 $x,y,z$ 元。甲買三種各一個付 250 元；乙買 2 個雞腿、1 個排骨付 290 元；丙買 1 個雞腿、2 個素食付 220 元。各多少錢？如果丙改成「1 個排骨、2 個素食付 210 元」，還能算出來嗎？", hint: "寫成增廣矩陣，消去到階梯形。",
        idea: "$\\begin{cases}x+y+z=250\\\\2x+y=290\\\\x+2z=220\\end{cases}$，解得 $x=100$、$y=90$、$z=60$。改成 $y+2z=210$ 後，三列 $(1,1,1)$、$(2,1,0)$、$(0,1,2)$ 中第一列是後兩列的平均，連常數也是（$\\tfrac{290+210}{2}=250$），消去後出現 $0\\ 0\\ 0\\,|\\,0$：無限多解。三筆資料其實只提供兩條獨立的資訊，算不出唯一的價格。" }
    ],

    where: {
      codes: [["A-11A-2", "三元一次聯立方程式：消去法與方陣（增廣矩陣）表示、以電腦求解多元方程組的概念；三平面的幾何關係與代數判定（標 ★）"]],
      exam: "11 年級<b>數學 A</b>，學測數 A、分科數甲都在範圍內。三平面關係的幾何判定在大考標為 ★：不直接命題，可融入其他題目。",
      stop: "會用列運算解三元一次方程組、判斷唯一／無限多／無解就夠了。不延伸到秩（rank）、線性獨立或一般的反矩陣求法。"
    }
  });
})();
