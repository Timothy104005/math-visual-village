/* 單元：實數與數線 */
(function () {
  var C = SK.C, s = SK.s;

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 250, "用圓規把正方形的對角線轉到數線上");
    var O = [90, 190], u = 110;
    s("line", { x1: 20, y1: O[1], x2: 385, y2: O[1], class: "m-axis" }, svg);
    [0, 1, 2].forEach(function (k) {
      s("line", { x1: O[0] + k * u, y1: O[1] - 6, x2: O[0] + k * u, y2: O[1] + 6, stroke: C.cocoa, "stroke-width": 1.4 }, svg);
      SK.label(svg, O[0] + k * u, O[1] + 22, String(k), { size: 15 });
    });
    s("rect", { x: O[0], y: O[1] - u, width: u, height: u, fill: C.gold.f, stroke: C.cocoa, "stroke-width": 1.2 }, svg);
    s("line", { x1: O[0], y1: O[1], x2: O[0] + u, y2: O[1] - u, stroke: C.orange.s, "stroke-width": 3 }, svg);
    s("path", { d: SK.arcPath(O[0], O[1], u * Math.SQRT2, Math.PI / 4, 0), fill: "none", stroke: C.orange.s, "stroke-width": 1.6, "stroke-dasharray": "5 4" }, svg);
    s("circle", { cx: O[0] + u * Math.SQRT2, cy: O[1], r: 6, fill: C.orange.s }, svg);
    SK.label(svg, O[0] + u * Math.SQRT2, O[1] - 20, "?", { size: 20, color: C.orange.s });
    SK.label(svg, O[0] + 40, O[1] - 70, "對角線", { size: 13, color: C.orange.s });
  }

  SK.mountUnit({
    slug: "real-numbers",
    en: "Every point on the line is a number",
    formula: "\\text{實數}=\\co{\\text{有理數（有限或循環小數）}}\\ \\cup\\ \\cb{\\text{無理數（不循環的無限小數）}}",

    hook: {
      html: "邊長 1 的正方形，對角線長 $\\sqrt2$。用圓規把對角線轉下來，它就在數線上點出一個確實存在的點。",
      ask: "這個點是某個分數 $\\tfrac pq$ 嗎？它的小數會不會在某處開始循環？",
      visual: hookVisual
    },

    guess: {
      q: "把 $\\tfrac{1}{7}$ 寫成小數，會發生什麼事？",
      options: [
        { t: "一定會在某處開始循環", truth: true, explain: "長除法每一步的餘數只可能是 $0,1,\\dots,6$，最多 7 種。做到第 8 步一定有餘數重複，之後就照抄前面的步驟，所以循環。事實上 $\\tfrac17=0.\\overline{142857}$，循環節長 6。" },
        { t: "除不盡，所以是無理數", common: true, explain: "「除不盡」和「無理數」很容易被混在一起！但無理數的意思是「不能寫成分數」。$\\tfrac17$ 明明就是分數，它的小數雖然無限長，卻會循環。" },
        { t: "除到第 7 位剛好除盡", explain: "如果除得盡，分母只能有 2 和 5 這兩個質因數（因為 $10=2\\times5$）。7 不是，所以永遠除不盡。" },
        { t: "數字會越來越亂，沒有規律", explain: "餘數只有有限種，所以不可能一直亂下去。沒有規律的無限小數，才是無理數。" }
      ]
    },

    derive: {
      intro: "拖動滑桿，一位一位地把 $\\sqrt2$ 夾在越來越小的區間裡；或換成一個分數，看長除法的餘數怎麼繞圈。",
      frames: [
        { cap: "有理數 $\\tfrac pq$ 做長除法，每一步的餘數都在 $0$ 到 $q-1$ 之間。有限種餘數，必然重複，所以小數<b>有限或循環</b>。", tex: "\\frac pq\\ \\Rightarrow\\ \\text{餘數}\\in\\{0,1,\\dots,q-1\\}" },
        { cap: "反過來，循環小數也一定是分數：$x=0.\\overline{27}$，乘 100 再相減，循環的尾巴就消掉了。", tex: "100x-x=27\\ \\Rightarrow\\ x=\\frac{27}{99}=\\frac{3}{11}" },
        { cap: "$\\sqrt2$ 呢？$1^2<2<2^2$，所以 $1<\\sqrt2<2$。再切成十等分：$1.4^2=1.96<2<2.25=1.5^2$。每多一位，區間縮小成十分之一。", tex: "\\cb{1.41}<\\sqrt2<\\cb{1.42}" },
        { cap: "若 $\\sqrt2=\\tfrac pq$（已約到最簡），則 $p^2=2q^2$ 是偶數，$p$ 是偶數；設 $p=2m$，得 $q^2=2m^2$，$q$ 也是偶數，和「最簡」矛盾。所以 $\\sqrt2$ <b>不是</b>分數，它的小數永不循環。", tex: "p^2=2q^2\\Rightarrow 2\\mid p\\Rightarrow 2\\mid q\\ \\ (\\text{矛盾})" },
        { cap: "有理數和無理數一起把數線填滿：每一個點都是一個實數，任兩個實數也可以比大小（三一律：$a<b$、$a=b$、$a>b$ 恰有一個成立）。很大或很小的數，用<b>科學記號</b> $a\\times10^n$（$1\\le a<10$）表示。", tex: "299792458\\approx\\co{3.00}\\times10^{\\cg{8}}" }
      ],
      hint: "第 1、2 步可以換分母；第 3 步起拖動「位數」，看區間怎麼收縮。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 540, 440, "數線上逐位逼近根號二");
        var g = s("g", {}, svg);
        var st = { k: 3, q: 7 };
        var read = SK.h("div", { class: "readout" });
        var slK = SK.slider({ label: "位數", min: 0, max: 5, step: 1, value: 3, color: "blue", onInput: function (v) { st.k = v; draw(); } });
        var slQ = SK.slider({ label: "分母 $q$", min: 3, max: 13, step: 1, value: 7, onInput: function (v) { st.q = v; draw(); } });
        ctx.sliders.appendChild(slQ.el); ctx.sliders.appendChild(slK.el);
        ctx.extra.appendChild(read);
        function division(q) {
          var r = 1, rs = [], ds = [], seen = {};
          for (var i = 0; i < 16; i++) {
            if (r === 0) break;
            if (seen[r] != null) return { ds: ds, rs: rs, start: seen[r] };
            seen[r] = i; rs.push(r);
            ds.push(Math.floor(r * 10 / q)); r = (r * 10) % q;
          }
          return { ds: ds, rs: rs, start: -1 };
        }
        function draw() {
          var f = ctx.frame;
          g.innerHTML = "";
          slQ.el.style.display = f <= 1 ? "" : "none";
          slK.el.style.display = f >= 2 && f <= 3 ? "" : "none";
          if (f <= 1) {
            var q = st.q, dv = division(q), cx = 270, cy = 215, R = 150;
            SK.label(g, cx, 24, "1 ÷ " + q + " 的餘數圈", { size: 15 });
            for (var i = 0; i < q; i++) {
              var a = Math.PI / 2 - i * 2 * Math.PI / q, x = cx + R * Math.cos(a), y = cy + 10 - R * Math.sin(a);
              var used = dv.rs.indexOf(i) >= 0;
              s("circle", { cx: x, cy: y, r: 15, fill: used ? C.gold.f : C.paper, stroke: used ? C.gold.s : C.line, "stroke-width": 1.3 }, g);
              SK.label(g, x, y, String(i), { size: 13, color: used ? C.ink : C.soft });
            }
            var pos = function (r) { var a = Math.PI / 2 - r * 2 * Math.PI / q; return [cx + (R - 17) * Math.cos(a), cy + 10 - (R - 17) * Math.sin(a)]; };
            for (var j = 0; j + 1 < dv.rs.length; j++) {
              var A = pos(dv.rs[j]), B = pos(dv.rs[j + 1]);
              SK.arrow(g, A[0], A[1], B[0], B[1], C.orange.s, 1.8);
            }
            if (dv.start >= 0) { var A2 = pos(dv.rs[dv.rs.length - 1]), B2 = pos(dv.rs[dv.start]); SK.arrow(g, A2[0], A2[1], B2[0], B2[1], C.pink.s, 2.4); }
            var dec = dv.start < 0 ? "0." + dv.ds.join("") : "0." + dv.ds.slice(0, dv.start).join("") + "\\overline{" + dv.ds.slice(dv.start).join("") + "}";
            read.innerHTML = SK.tex("\\frac{1}{" + q + "}=" + dec, true) + '<p class="muted" style="margin:4px 0 0;font-size:.9rem">' +
              (dv.start < 0 ? "餘數變成 0：除盡了（分母只有 2 和 5）。" : "餘數回到 " + dv.rs[dv.start] + "，之後一路重複：循環節長 " + (dv.rs.length - dv.start) + "。") + "</p>";
            return;
          }
          // 每一位一層：上一層框住的區間，在下一層被放大成整條線、切成十等分
          var K = f === 4 ? 5 : st.k, x0 = 40, W = 460, L = 0, span = 3, lo, hi;
          for (var k = 0; k <= K; k++) {
            var y = 46 + k * 70, step = Math.pow(10, -k), tick = k === 0 ? 1 : step;
            lo = Math.floor(Math.SQRT2 / step + 1e-12) * step; hi = lo + step;
            var X = (function (L0, sp) { return function (t) { return x0 + (t - L0) / sp * W; }; })(L, span);
            s("line", { x1: x0 - 12, y1: y, x2: x0 + W + 12, y2: y, class: "m-axis" }, g);
            for (var i = 0; i <= Math.round(span / tick); i++) {
              var t = L + i * tick;
              s("line", { x1: X(t), y1: y - 5, x2: X(t), y2: y + 5, stroke: C.cocoa }, g);
              var edge = Math.abs(t - lo) < 1e-9 || Math.abs(t - hi) < 1e-9;
              if (k <= 1 || edge) SK.label(g, X(t), y + 17, t.toFixed(k), { size: edge ? 12 : 11, color: edge ? C.blue.s : C.soft, bold: edge });
            }
            s("rect", { x: X(lo), y: y - 9, width: X(hi) - X(lo), height: 18, fill: C.blue.f, stroke: C.blue.s }, g);
            s("circle", { cx: X(Math.SQRT2), cy: y, r: 4.5, fill: C.orange.s }, g);
            SK.label(g, x0 + W + 20, y - 14, "×" + Math.pow(10, k), { size: 11, color: C.soft, anchor: "end" });
            if (k < K) {
              s("line", { x1: X(lo), y1: y + 9, x2: x0, y2: y + 61, stroke: C.blue.s, "stroke-dasharray": "3 4" }, g);
              s("line", { x1: X(hi), y1: y + 9, x2: x0 + W, y2: y + 61, stroke: C.blue.s, "stroke-dasharray": "3 4" }, g);
            }
            L = lo; span = step;
          }
          SK.label(g, X(Math.SQRT2), 46 + K * 70 - 22, "√2", { size: 15, color: C.orange.s });
          if (f === 3) SK.label(g, 270, 425, "放大再多次，√2 也不會落在刻度上，小數也不會循環", { size: 13, color: C.pink.s });
          if (f === 4) SK.label(g, 270, 425, "每個無限小數都對應數線上的一個點：數線被實數填滿", { size: 13, color: C.green.s });
          var d = K;
          read.innerHTML = SK.tex(lo.toFixed(d) + "<\\sqrt2<" + hi.toFixed(d), true) +
            SK.tex("(" + (lo * lo).toFixed(Math.min(2 * d, 6)) + "<2<" + (hi * hi).toFixed(Math.min(2 * d, 6)) + ")", true);
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "0.999… 等於 1 嗎？", icon: "sparkle",
        html: "設 $x=0.\\overline{9}$，則 $10x-x=9$，所以 $x=1$。換個角度：如果 $0.\\overline9<1$，兩者之間一定夾著別的數，例如它們的平均。可是你找不到任何數字比 $0.999\\ldots$ 大又比 1 小。同一個點，兩種寫法而已。" },
      { title: "科學記號：先看位數，再看細節", icon: "leaf",
        html: "$a\\times10^n$ 中，$10^n$ 告訴你「大概多大」，$a$ 告訴你「更精確是多少」。光速 $3.00\\times10^8$ m/s、氫原子半徑約 $5.3\\times10^{-11}$ m：比大小只要先比指數。$a$ 寫幾位，也同時說出了你量得多準（有效位數）。" }
    ],

    challenges: [
      { q: "把 $0.1\\overline{6}$ 化成最簡分數。", hint: "先乘 10 讓循環從小數點後開始。", idea: "$x=0.1\\overline6$，$100x-10x=16.\\overline6-1.\\overline6=15$，$x=\\tfrac{15}{90}=\\tfrac16$。" },
      { q: "$\\sqrt2+\\sqrt3$ 是有理數嗎？", hint: "假設它是有理數 $r$，把 $\\sqrt3=r-\\sqrt2$ 平方看看。",
        idea: "平方得 $3=r^2-2r\\sqrt2+2$，所以 $\\sqrt2=\\tfrac{r^2-1}{2r}$ 是有理數，矛盾。因此 $\\sqrt2+\\sqrt3$ 是無理數。" },
      { q: "兩個無理數相加，一定是無理數嗎？相乘呢？", idea: "都不一定：$\\sqrt2+(-\\sqrt2)=0$，$\\sqrt2\\times\\sqrt2=2$。但「有理數 + 無理數」一定是無理數，你能說明為什麼嗎？" }
    ],

    where: {
      codes: [["N-10-1", "實數：數線、十進制小數、有理數的小數特徵、無理數的估算、三一律、科學記號；$\\sqrt2$ 為無理數的證明與有效位數"]],
      exam: "10 年級<b>共同必修</b>。$\\sqrt2$ 無理數的證明與有效位數在大考標為 ★（不直接命題，可融入其他題目）。",
      stop: "知道有理數的小數是有限或循環、會化循環小數為分數、會估算根號、會用科學記號就夠了。實數完備性、戴德金分割等嚴格建構是大學內容。"
    }
  });
})();
