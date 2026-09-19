/* 單元 1：乘法公式 (a+b)^2、(a+b)^3 */
(function () {
  var C = SK.C, s = SK.s;

  /* 共用：畫一個被切成四塊的正方形（面積模型） */
  function areaSquare(g, x0, y0, S, a, b, opt) {
    opt = opt || {};
    var u = S / (a + b), A = a * u, B = b * u;
    var pieces = [
      { k: "aa", x: x0, y: y0, w: A, h: A, lab: "a²" },
      { k: "ab1", x: x0 + A, y: y0, w: B, h: A, lab: "ab" },
      { k: "ab2", x: x0, y: y0 + A, w: A, h: B, lab: "ab" },
      { k: "bb", x: x0 + A, y: y0 + A, w: B, h: B, lab: "b²" }
    ];
    return pieces;
  }

  function hookVisual(el) {
    var svg = SK.svg(el, 420, 330, "邊長 a 的正方形花圃向右、向下各加寬 b");
    var x0 = 70, y0 = 50, A = 170, B = 90;
    // 新增的 L 形
    s("path", { d: "M" + (x0 + A) + " " + y0 + "h" + B + "v" + (A + B) + "h-" + (A + B) + "v-" + B + "h" + A + "z",
      fill: "rgba(241,226,184,.55)", stroke: C.line, "stroke-width": 2, "stroke-dasharray": "7 6" }, svg);
    s("rect", { x: x0, y: y0, width: A, height: A, rx: 4, fill: "rgba(201,212,188,.55)", stroke: C.green.s, "stroke-width": 2.2, filter: "url(#sk-soft)" }, svg);
    // 小花
    [[40, 40], [120, 70], [70, 125], [140, 140], [30, 150]].forEach(function (p, i) {
      var f = s("g", { transform: "translate(" + (x0 + p[0] - 9) + " " + (y0 + p[1] - 9) + ") scale(.75)" }, svg);
      f.innerHTML = SK.icons[i % 2 ? "flower" : "leaf"].replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "");
    });
    SK.label(svg, x0 + A / 2, y0 + A / 2 + 50, "原本的花圃", { size: 14 });
    SK.brace(svg, x0, y0 - 8, x0 + A, y0 - 8, -14);
    SK.label(svg, x0 + A / 2, y0 - 34, "a", { it: true });
    SK.brace(svg, x0 + A, y0 - 8, x0 + A + B, y0 - 8, -14);
    SK.label(svg, x0 + A + B / 2, y0 - 34, "b", { it: true });
    SK.brace(svg, x0 - 8, y0 + A, x0 - 8, y0, -14);
    SK.label(svg, x0 - 34, y0 + A / 2, "a", { it: true });
    SK.brace(svg, x0 - 8, y0 + A + B, x0 - 8, y0 + A, -14);
    SK.label(svg, x0 - 34, y0 + A + B / 2, "b", { it: true });
    SK.label(svg, x0 + A + B / 2 + 10, y0 + A + B / 2 + 8, "新增的地？", { size: 14, color: C.soft });
  }

  /* 選項 A 的小圖：漏掉的兩塊 */
  function missingMini(el) {
    var svg = SK.svg(el, 360, 200, "a 平方加 b 平方漏掉了兩個 ab 長方形");
    var ps = areaSquare(svg, 20, 15, 170, 3, 2);
    var fills = { aa: C.orange.f, ab1: "rgba(233,193,191,.35)", ab2: "rgba(233,193,191,.35)", bb: C.gold.f };
    ps.forEach(function (p) {
      var miss = p.k.indexOf("ab") === 0;
      s("rect", { x: p.x, y: p.y, width: p.w, height: p.h, fill: fills[p.k], stroke: miss ? C.pink.s : C.line, "stroke-width": 2, "stroke-dasharray": miss ? "6 5" : null }, svg);
      SK.label(svg, p.x + p.w / 2, p.y + p.h / 2, miss ? "漏掉!" : p.lab, { it: !miss, color: miss ? C.pink.s : null, size: miss ? 13 : null });
    });
    SK.label(svg, 280, 70, "a² + b²", { it: true, size: 20 });
    SK.label(svg, 280, 100, "只算到兩個角落", { size: 13, color: C.soft });
    SK.label(svg, 280, 130, "少了 2 塊 ab", { size: 13, color: C.pink.s });
  }

  /* 立方體 (a+b)^3 的等角投影 */
  function cubeAngle(el) {
    var wrap = SK.h("div", { class: "two-col" });
    var st = SK.h("div", { class: "stage" }), side = SK.h("div", { class: "sliders" });
    wrap.appendChild(st); wrap.appendChild(side); el.appendChild(wrap);
    var svg = SK.svg(st, 460, 400, "邊長 a+b 的立方體拆成八塊");
    var g = s("g", {}, svg);
    var st8 = { a: 3, b: 2, e: .6 };
    var cols = [C.orange, C.blue, C.green, C.gold];
    var cos30 = Math.cos(Math.PI / 6), sin30 = .5;
    function P(x, y, z, sc) { return [230 + (x - y) * cos30 * sc, 190 + (x + y) * sin30 * sc - z * sc]; }
    function draw() {
      g.innerHTML = "";
      var a = st8.a, b = st8.b, sc = 150 / (a + b), gap = st8.e * 1.3;
      var blocks = [];
      for (var i = 0; i < 2; i++) for (var j = 0; j < 2; j++) for (var k = 0; k < 2; k++) blocks.push([i, j, k]);
      blocks.sort(function (p, q) { return (p[0] + p[1] + p[2]) - (q[0] + q[1] + q[2]); });
      var solid = ["#F3C3A8", "#C3D5D2", "#CBD8BF", "#F1E2B8"];
      blocks.forEach(function (bk) {
        // 座標 1 的那一段是 a（離觀看者近），0 的那一段是 b
        var i = bk[0], j = bk[1], k = bk[2], nb = 3 - (i + j + k);
        var x = i ? b + gap : 0, y = j ? b + gap : 0, z = k ? b + gap : 0;
        var dx = i ? a : b, dy = j ? a : b, dz = k ? a : b;
        var col = cols[nb];
        var faces = [
          [[x + dx, y, z], [x + dx, y + dy, z], [x + dx, y + dy, z + dz], [x + dx, y, z + dz]],
          [[x, y + dy, z], [x + dx, y + dy, z], [x + dx, y + dy, z + dz], [x, y + dy, z + dz]],
          [[x, y, z + dz], [x + dx, y, z + dz], [x + dx, y + dy, z + dz], [x, y + dy, z + dz]]
        ];
        var shade = [.86, .94, 1.06];
        faces.forEach(function (f, fi) {
          var pts = f.map(function (p) { var m = (a + b + gap) / 2; return P(p[0] - m, p[1] - m, p[2] - m, sc).join(","); }).join(" ");
          var poly = s("polygon", { points: pts, fill: solid[nb], stroke: col.s, "stroke-width": 1.6, "stroke-linejoin": "round" }, g);
          poly.style.filter = "brightness(" + shade[fi] + ")";
        });
      });
      var lab = s("text", { x: 230, y: 385, "text-anchor": "middle", class: "m-label", "font-size": 13 }, g);
      lab.textContent = "1 塊 a³　3 塊 a²b　3 塊 ab²　1 塊 b³";
    }
    [["a", "a", 2, 5, 1, ""], ["b", "b", 1, 4, 1, "blue"], ["e", "拆開", 0, 1, .05, "green"]].forEach(function (d) {
      var sl = SK.slider({ label: d[0] === "e" ? d[1] : "$" + d[1] + "$", min: d[2], max: d[3], step: d[4], value: st8[d[0]], color: d[5],
        fmt: d[0] === "e" ? function (v) { return Math.round(v * 100) + "%"; } : null,
        onInput: function (v) { st8[d[0]] = v; draw(); } });
      side.appendChild(sl.el);
    });
    side.insertAdjacentHTML("beforeend",
      '<div class="readout">' + SK.tex("(a+b)^3=\\co{a^3}+\\cb{3a^2b}+\\cg{3ab^2}+\\cy{b^3}", true) + "</div>" +
      '<p class="muted" style="margin:0;font-size:.95rem">把「拆開」拉到 0%，八塊就合回一個大立方體。顏色一樣的積木形狀也一樣：灰藍色是 $a\\times a\\times b$ 的厚板，綠色是 $a\\times b\\times b$ 的長條。</p>'.replace(/\$([^$]+)\$/g, function (m, t) { return SK.tex(t); }));
    draw();
  }

  /* 心算的秘密：兩位數平方的面積模型 */
  function mentalAngle(el) {
    var wrap = SK.h("div", { class: "two-col" });
    var st = SK.h("div", { class: "stage" }), side = SK.h("div", {});
    wrap.appendChild(st); wrap.appendChild(side); el.appendChild(wrap);
    var svg = SK.svg(st, 400, 330, "兩位數平方拆成十位與個位的面積");
    var out = SK.h("div", { class: "readout", style: "margin-top:10px" });
    function draw(n) {
      svg.innerHTML = "";
      var t = Math.floor(n / 10) * 10, o = n % 10;
      var S = 260, u = S / n, A = t * u, B = o * u, x0 = 90, y0 = 50;
      var ps = [[x0, y0, A, A, C.orange, t * t], [x0 + A, y0, B, A, C.blue, t * o], [x0, y0 + A, A, B, C.blue, t * o], [x0 + A, y0 + A, B, B, C.gold, o * o]];
      ps.forEach(function (p) {
        if (p[2] < .5 || p[3] < .5) return;
        s("rect", { x: p[0], y: p[1], width: p[2], height: p[3], fill: p[4].f, stroke: p[4].s, "stroke-width": 1.8 }, svg);
        if (p[2] > 22 && p[3] > 16) SK.label(svg, p[0] + p[2] / 2, p[1] + p[3] / 2, String(p[5]), { size: 14 });
      });
      SK.label(svg, x0 + A / 2, y0 - 16, String(t), { size: 15 });
      if (o) SK.label(svg, x0 + A + B / 2, y0 - 16, String(o), { size: 15 });
      SK.label(svg, x0 - 20, y0 + A / 2, String(t), { size: 15 });
      if (o) SK.label(svg, x0 - 20, y0 + A + B / 2, String(o), { size: 15 });
      out.innerHTML = SK.tex(n + "^2=(" + t + "+" + o + ")^2=\\co{" + t * t + "}+\\cb{2\\times" + t * o + "}+\\cy{" + o * o + "}=" + n * n, true);
    }
    var sl = SK.slider({ label: "數字", min: 11, max: 99, value: 23, onInput: draw, fmt: function (v) { return String(v); } });
    side.innerHTML = '<p style="margin-top:0">心算 $23^2$ 有點難？把 23 拆成 20 和 3，正方形立刻切成四塊：一大塊 $400$、兩條 $60$、一小塊 $9$。這就是數學家說的 number talk——同一題可以有很多種算法。</p>'.replace(/\$([^$]+)\$/g, function (m, t) { return SK.tex(t); });
    side.appendChild(sl.el); side.appendChild(out);
    draw(23);
  }

  SK.mountUnit({
    slug: "square-of-sum",
    en: "Cut a square once — it tells you the answer",
    formula: "(\\co{a}+\\cb{b})^2=\\co{a^2}+\\cb{2ab}+\\cy{b^2}",

    hook: {
      html: "小花有一塊邊長 $a$ 公尺的正方形花圃。今年她往右、往下各加寬 $b$ 公尺，花圃還是正方形。新花圃比原本多了多少面積？",
      ask: "先別急著算：你能用「看」的，說出多出來的那塊 L 形地是由哪幾塊拼成的嗎？",
      visual: hookVisual
    },

    guess: {
      q: "你覺得 $(a+b)^2$ 等於什麼？憑直覺選一個就好。",
      options: [
        { t: "$a^2+b^2$", common: true, explain: "因為 $(ab)^2=a^2b^2$ 是對的，大家很自然地以為加法也能把平方「分進去」。但畫出來就看得到：$a^2$ 和 $b^2$ 只占了對角的兩塊，旁邊兩個 $ab$ 長方形被漏掉了。代數字試試：$(3+2)^2=25$，可是 $9+4=13$。", mini: missingMini },
        { t: "$a^2+2ab+b^2$", truth: true, explain: "大正方形切一刀直的、一刀橫的，剛好是四塊：一塊 $a^2$、一塊 $b^2$，還有<b>兩塊</b>一模一樣的 $ab$ 長方形。下面我們一步一步看它長出來。" },
        { t: "$a^2+ab+b^2$", explain: "你已經發現中間不只有 $a^2$ 和 $b^2$，很棒！但仔細數：右上角和左下角<b>各有一塊</b> $a\\times b$ 的長方形，所以是 $2ab$。" },
        { t: "$2a+2b$", explain: "$2a+2b$ 是正方形「繞一圈」的長度（周長）。$(a+b)^2$ 問的是「鋪滿要幾塊地磚」（面積）。長度和面積是兩種不同的量，混在一起很常見，分清楚就是一大步！" }
      ]
    },

    derive: {
      intro: "我們不背公式，而是把 $(a+b)^2$ 真的畫成一塊邊長 $a+b$ 的正方形，看它自己說出答案。",
      frames: [
        { cap: "這是一塊邊長 $a+b$ 的正方形，面積就是 $(a+b)^2$。", tex: "(a+b)^2=\\;?" },
        { cap: "沿著 $a$ 和 $b$ 的分界，直的切一刀、橫的切一刀，正方形變成四塊。", tex: "(a+b)^2=\\square+\\square+\\square+\\square" },
        { cap: "左上角是邊長 $a$ 的正方形：$\\co{a^2}$。", tex: "(a+b)^2=\\co{a^2}+\\square+\\square+\\square" },
        { cap: "右上和左下是兩塊<b>一模一樣</b>的長方形，都是 $a\\times b$。把其中一塊轉 90° 就能疊到另一塊上。", tex: "(a+b)^2=\\co{a^2}+\\cb{ab}+\\cb{ab}+\\square" },
        { cap: "右下角是邊長 $b$ 的小正方形：$\\cy{b^2}$。四塊加起來，公式就完成了！拖動滑桿，不管 $a$、$b$ 是多少都成立。", tex: "(a+b)^2=\\co{a^2}+\\cb{2ab}+\\cy{b^2}" }
      ],
      setup: function (ctx) {
        var st = { a: 3, b: 2 };
        var svg = SK.svg(ctx.stage, 480, 440, "邊長 a 加 b 的正方形切成四塊");
        var g = s("g", {}, svg);
        var read = SK.h("div", { class: "readout" });
        ctx.extra.appendChild(read);
        function draw() {
          var f = ctx.frame;
          g.innerHTML = "";
          var x0 = 80, y0 = 60, S = 340;
          var ps = areaSquare(g, x0, y0, S, st.a, st.b);
          var colorOf = { aa: [2, C.orange], ab1: [3, C.blue], ab2: [3, C.blue], bb: [4, C.gold] };
          var fillG = s("g", { filter: "url(#sk-soft)" }, g);
          ps.forEach(function (p) {
            var c = colorOf[p.k], on = f >= c[0];
            s("rect", { x: p.x, y: p.y, width: p.w, height: p.h, fill: on ? c[1].f : "rgba(241,226,184,.3)", class: "fade" }, fillG);
          });
          s("rect", { x: x0, y: y0, width: S, height: S, fill: "none", stroke: C.cocoa || "#4A3F37", "stroke-width": 2.6, rx: 3 }, g);
          var u = S / (st.a + st.b), A = st.a * u;
          if (f >= 1) {
            s("line", { x1: x0 + A, y1: y0, x2: x0 + A, y2: y0 + S, stroke: "#4A3F37", "stroke-width": 2, "stroke-dasharray": f === 1 ? "8 6" : null }, g);
            s("line", { x1: x0, y1: y0 + A, x2: x0 + S, y2: y0 + A, stroke: "#4A3F37", "stroke-width": 2, "stroke-dasharray": f === 1 ? "8 6" : null }, g);
            ps.forEach(function (p) {
              var c = colorOf[p.k], on = f >= c[0];
              if (p.w > 30 && p.h > 22) SK.label(g, p.x + p.w / 2, p.y + p.h / 2, on ? p.lab : "?", { it: on, size: on ? 22 : 18, color: on ? c[1].s : "#9C8C7C" });
            });
            if (f === 3) {
              var p1 = ps[1];
              s("rect", { x: p1.x, y: p1.y, width: p1.w, height: p1.h, fill: "none", stroke: C.blue.s, "stroke-width": 3, class: "pulse" }, g);
              var p2 = ps[2];
              s("rect", { x: p2.x, y: p2.y, width: p2.w, height: p2.h, fill: "none", stroke: C.blue.s, "stroke-width": 3, class: "pulse" }, g);
            }
          }
          // 邊長標示
          if (f === 0) {
            SK.brace(g, x0, y0 - 10, x0 + S, y0 - 10, -16);
            SK.label(g, x0 + S / 2, y0 - 40, "a + b", { it: true });
            SK.brace(g, x0 - 10, y0 + S, x0 - 10, y0, -16);
            SK.label(g, x0 - 46, y0 + S / 2, "a + b", { it: true });
          } else {
            SK.brace(g, x0, y0 - 10, x0 + A, y0 - 10, -14);
            SK.label(g, x0 + A / 2, y0 - 38, "a", { it: true, color: C.orange.s });
            SK.brace(g, x0 + A, y0 - 10, x0 + S, y0 - 10, -14);
            SK.label(g, x0 + A + (S - A) / 2, y0 - 38, "b", { it: true, color: C.blue.s });
            SK.brace(g, x0 - 10, y0 + A, x0 - 10, y0, -14);
            SK.label(g, x0 - 38, y0 + A / 2, "a", { it: true, color: C.orange.s });
            SK.brace(g, x0 - 10, y0 + S, x0 - 10, y0 + A, -14);
            SK.label(g, x0 - 38, y0 + A + (S - A) / 2, "b", { it: true, color: C.blue.s });
          }
          var a = st.a, b = st.b;
          read.innerHTML = SK.tex("a=" + a + ",\\ b=" + b + ":\\quad (" + a + "+" + b + ")^2=" + (a + b) * (a + b) + (f >= 4 ? "=\\co{" + a * a + "}+\\cb{" + 2 * a * b + "}+\\cy{" + b * b + "}" : ""), true);
        }
        ctx.sliders.appendChild(SK.slider({ label: "$a$", min: 1, max: 9, value: st.a, onInput: function (v) { st.a = v; draw(); } }).el);
        ctx.sliders.appendChild(SK.slider({ label: "$b$", min: 1, max: 9, value: st.b, color: "blue", onInput: function (v) { st.b = v; draw(); } }).el);
        return { show: draw };
      }
    },

    angles: [
      { title: "升級成立方體：$(a+b)^3$", icon: "sparkle",
        html: "平方是正方形，那立方呢？把邊長 $a+b$ 的立方體每個方向都切一刀，會切出 $2\\times2\\times2=8$ 塊積木。拉「拆開」滑桿，把它們分開來數一數。",
        render: cubeAngle },
      { title: "心算的秘密：兩位數平方", icon: "bulb", render: mentalAngle }
    ],

    challenges: [
      { q: "用同一種切正方形的想法，說明 $(a-b)^2=a^2-2ab+b^2$。", hint: "這次從邊長 $a$ 的大正方形出發，想像把邊長縮短 $b$。",
        idea: "從 $a^2$ 剪掉右邊一條 $a\\times b$、下面一條 $a\\times b$。但右下角那塊 $b\\times b$ 被剪了兩次，所以要加回一次：$a^2-2ab+b^2$。" },
      { q: "$(a+b+c)^2$ 會把正方形切成幾塊？每一種形狀各有幾塊？", hint: "每一邊切成 $a$、$b$、$c$ 三段，所以是 $3\\times3$ 的格子。",
        idea: "九塊：對角線上 $a^2,b^2,c^2$ 各一塊，$ab$、$bc$、$ca$ 各兩塊，所以 $(a+b+c)^2=a^2+b^2+c^2+2ab+2bc+2ca$。" },
      { q: "正方形的係數是 $1,2,1$，立方體是 $1,3,3,1$。你猜「四維立方體」$(a+b)^4$ 的係數是什麼？這串數字有什麼規律？", hint: "把 $1,2,1$ 和 $1,3,3,1$ 上下排好，看看每個數和上一行哪兩個數有關。",
        idea: "$1,4,6,4,1$。每個數是上一行左上、右上兩數的和，也就是巴斯卡三角形。這正是高一「組合」會學到的二項式展開，同一個規律換了一種方式出現。" }
    ],

    where: {
      codes: [["A-10-1", "式的運算：三次乘法公式、根式與分式運算"]],
      exam: "高一共同必修，學測數 A、數 B 都在範圍內。它也是配方法、二次函數、算幾不等式與二項式展開的「工具箱」，後面幾乎每一章都會用到。",
      stop: "三次以內的乘法公式就夠了。$(a+b)^n$ 的一般展開交給二項式定理（`D-10-3` 組合的應用），不必另外背四次、五次的展開式，也不必刷大量「湊公式」的因式分解技巧題。"
    }
  });
})();
