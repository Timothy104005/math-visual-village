/* 單元：多項式的根與因式（餘式定理、因式定理） */
(function () {
  var C = SK.C, s = SK.s;

  /* (x-r1)(x-r2)(x-r3) 展開成係數 [1, c2, c1, c0] */
  function expand(r) {
    var a = r[0], b = r[1], c = r[2];
    return [1, -(a + b + c), a * b + b * c + c * a, -a * b * c];
  }
  function polyTex(co) {
    var names = ["x^3", "x^2", "x", ""], out = "";
    co.forEach(function (c, i) {
      c = Math.round(c * 100) / 100;
      if (Math.abs(c) < 1e-9) return;
      var abs = Math.abs(c), sgn = c < 0 ? "-" : (out ? "+" : "");
      var num = (abs === 1 && i < 3) ? "" : SK.fmt(abs, 2);
      out += sgn + num + names[i];
    });
    return out || "0";
  }
  function evalP(co, x) { return ((co[0] * x + co[1]) * x + co[2]) * x + co[3]; }

  function hookVisual(el) {
    var svg = SK.svg(el, 420, 280, "一條三次曲線在 x 等於 1、2、4 穿過 x 軸");
    var X = function (x) { return 40 + (x + .5) * 70; }, Y = function (y) { return 150 - y * 28; };
    s("line", { x1: 20, y1: 150, x2: 410, y2: 150, class: "m-axis" }, svg);
    var d = "";
    for (var x = -.3; x <= 4.8; x += .05) d += (d ? "L" : "M") + X(x) + " " + Math.max(10, Math.min(270, Y((x - 1) * (x - 2) * (x - 4))));
    s("path", { d: d, fill: "none", stroke: C.ink, "stroke-width": 2.4 }, svg);
    [1, 2, 4].forEach(function (r) {
      s("circle", { cx: X(r), cy: 150, r: 6, fill: C.orange.f, stroke: C.cocoa, "stroke-width": 1.4 }, svg);
      SK.label(svg, X(r), 172, String(r), { size: 14 });
    });
    SK.label(svg, 210, 262, "y = ? （你能寫出式子嗎？）", { size: 14, color: C.soft });
  }

  function syntheticAngle(el) {
    var wrap = SK.h("div", { class: "two-col" });
    var left = SK.h("div", {}), side = SK.h("div", { class: "sliders" });
    wrap.appendChild(left); wrap.appendChild(side); el.appendChild(wrap);
    var co = [1, -7, 14, -8], stt = { a: 3 };
    function draw() {
      var a = stt.a, row = [co[0]], mid = [""];
      for (var i = 1; i < 4; i++) { mid.push(row[i - 1] * a); row.push(co[i] + row[i - 1] * a); }
      var cell = function (v, cls) { return '<td style="padding:6px 12px;text-align:center;' + (cls || "") + '">' + v + "</td>"; };
      left.innerHTML = '<table style="border-collapse:collapse;font-variant-numeric:tabular-nums;font-size:1.05rem;margin:0 auto">' +
        "<tr>" + cell("") + co.map(function (c) { return cell(c); }).join("") + cell("", "") + '<td rowspan="2" style="padding:0 12px;border-left:1.4px solid #4A3F37;color:#B8674A">' + a + "</td></tr>" +
        "<tr>" + cell("") + mid.map(function (c) { return cell(c === "" ? "" : "+" + c, "color:#6F645A"); }).join("") + cell("") + "</tr>" +
        '<tr style="border-top:1.4px solid #4A3F37">' + cell("") + row.map(function (c, i) { return cell("<b>" + c + "</b>", i === 3 ? "background:#FAE8DD;border-radius:8px" : ""); }).join("") + cell("") + "</tr></table>" +
        '<p class="muted" style="text-align:center;font-size:.9rem;margin:8px 0 0">最後一格（蜜桃色）就是餘數</p>';
      side.querySelector(".readout").innerHTML = SK.tex("f(" + a + ")=" + a + "^3-7\\cdot" + a + "^2+14\\cdot" + a + "-8=\\co{" + evalP(co, a) + "}", true);
    }
    side.insertAdjacentHTML("afterbegin", '<p style="margin-top:0">' + SK.md("用綜合除法把 $f(x)=x^3-7x^2+14x-8$ 除以 $x-a$。往下加、往斜上乘 $a$，最後一格就是餘數。拖動 $a$，比對下面直接代入的結果。") + "</p>");
    side.appendChild(SK.slider({ label: "$a$", min: -2, max: 6, value: stt.a, onInput: function (v) { stt.a = v; draw(); } }).el);
    side.insertAdjacentHTML("beforeend", '<div class="readout"></div><p class="muted" style="margin:0;font-size:.95rem">' + SK.md("試試 $a=1,2,4$：餘數都是 0，所以 $x-1$、$x-2$、$x-4$ 都是因式，$f(x)=(x-1)(x-2)(x-4)$。") + "</p>");
    draw();
  }

  SK.mountUnit({
    slug: "poly-roots",
    en: "Why x − a is special",
    formula: "f(x)=(x-\\co{a})\\,q(x)+\\cb{f(a)},\\qquad \\cb{f(a)}=0\\iff (x-\\co{a})\\mid f(x)",

    hook: {
      html: "這條三次曲線在 $x=1$、$x=2$、$x=4$ 三個地方穿過 $x$ 軸。",
      ask: "只知道這三個交點，你能寫出它的式子嗎？交點和式子之間，到底有什麼關係？",
      visual: hookVisual
    },

    guess: {
      q: "已知 $f(x)=x^3-6x^2+11x-6$，而且 $f(1)=0$。下面哪一句說得最完整？",
      options: [
        { t: "圖形通過 $(1,0)$，而且 $x-1$ 是 $f(x)$ 的因式", truth: true, explain: "三件事其實是同一件事：$f(1)=0$、$1$ 是根、圖形通過 $(1,0)$、$f(x)$ 含因式 $x-1$。事實上 $f(x)=(x-1)(x-2)(x-3)$。" },
        { t: "只知道 $x=1$ 是方程式的解", explain: "這句話沒錯，只是還能說得更多！等一下你會看到，「是解」和「含有因式 $x-1$」是同一件事，知道一個就等於知道另一個。" },
        { t: "$x+1$ 是 $f(x)$ 的因式", common: true, explain: "正負號是最常見的小陷阱。根是 $1$，因式是讓括號等於 0 的那個：$x-1$，代 $x=1$ 才會變 0。代 $x=-1$：$f(-1)=-24\\ne0$，所以 $x+1$ 不是因式。" },
        { t: "什麼都不能確定", explain: "謹慎是好習慣。不過這裡有一條很強的定理保證：只要 $f(1)=0$，就一定能把 $x-1$ 從 $f(x)$ 裡整個抽出來。" }
      ]
    },

    derive: {
      intro: "拖動 $x$ 軸上的三個蜜桃色點（根），以及灰藍色的探測點 $a$。曲線固定寫成 $f(x)=(x-r_1)(x-r_2)(x-r_3)$。",
      tall: true,
      frames: [
        { cap: "多項式 $f(x)$ 的圖形和 $x$ 軸的交點，就是方程式 $f(x)=0$ 的<b>根</b>。", tex: "f(\\co{r})=0\\iff\\text{圖形通過 }(\\co{r},0)" },
        { cap: "把 $f(x)$ 除以 $x-a$：商是 $q(x)$、餘數是一個常數 $R$。這是一條恆等式，任何 $x$ 代進去都成立。", tex: "f(x)=(x-a)\\,q(x)+R" },
        { cap: "代入 $x=a$，第一項整個變成 0，只剩 $R$。所以餘數就是 $f(a)$：探測點的<b>高度</b>。這就是<b>餘式定理</b>。", tex: "f(\\cb{a})=(\\cb{a}-\\cb{a})\\,q(\\cb{a})+R=R" },
        { cap: "把探測點 $a$ 拖到交點上：高度變 0，餘數是 0，$x-a$ 整除 $f(x)$。這就是<b>因式定理</b>。", tex: "f(\\cb{a})=0\\iff f(x)=(x-\\cb{a})\\,q(x)" },
        { cap: "每個根都貢獻一個因式，所以知道三個根，就知道整個多項式（再乘上一個常數）。拖動根，看展開式一起變。", tex: "f(x)=(x-\\co{r_1})(x-\\co{r_2})(x-\\co{r_3})" },
        { cap: "把兩個根拖到一起，變成<b>重根</b>：圖形在那裡碰一下 $x$ 軸就回頭，不再穿過去。", tex: "(x-r)^2\\ \\text{的地方：碰到就回頭}" }
      ],
      hint: "拖動 x 軸上的點；每一步都可以改變根與探測點。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 520, 440, "三次多項式的根、因式與餘數");
        var g = s("g", {}, svg), hg = s("g", {}, svg);
        var st = { r: [1, 2, 4], a: 3 };
        var X = function (x) { return 50 + (x + 1) * 70; }, Y = function (y) { return 230 - y * 26; }, invX = function (px) { return (px - 50) / 70 - 1; };
        var read = SK.h("div", { class: "readout" });
        ctx.extra.appendChild(read);
        var hs = st.r.map(function (r, i) {
          var hd = SK.handle(hg, X(r), Y(0), C.orange.s, "第 " + (i + 1) + " 個根");
          SK.drag(svg, hd, function (px) { st.r[i] = Math.round(SK.clamp(invX(px), -.8, 5.8) * 4) / 4; draw(); }, function () { return [X(st.r[i]), Y(0)]; }, 17.5);
          return hd;
        });
        var hA = SK.handle(hg, X(st.a), Y(0), C.blue.s, "探測點 a");
        SK.drag(svg, hA, function (px) { st.a = Math.round(SK.clamp(invX(px), -.8, 5.8) * 4) / 4; draw(); }, function () { return [X(st.a), Y(0)]; }, 17.5);
        function draw() {
          var f = ctx.frame, co = expand(st.r), fa = evalP(co, st.a);
          g.innerHTML = "";
          for (var i = -1; i <= 6; i++) { s("line", { x1: X(i), y1: 20, x2: X(i), y2: 430, class: "m-grid" }, g); SK.label(g, X(i), Y(0) + 18, String(i), { size: 12, color: C.soft }); }
          s("line", { x1: 30, y1: Y(0), x2: 510, y2: Y(0), class: "m-axis" }, g);
          var d = "";
          for (var x = -1; x <= 6; x += .03) { var y = evalP(co, x); d += (d ? "L" : "M") + X(x) + " " + SK.clamp(Y(y), 10, 430); }
          s("path", { d: d, fill: "none", stroke: C.ink, "stroke-width": 2.4 }, g);
          SK.label(g, 60, 26, "y = f(x)", { size: 14, anchor: "start" });
          var showA = f >= 1 && f <= 3;
          hA.style.display = showA ? "" : "none";
          if (showA) {
            var ya = SK.clamp(Y(fa), 10, 430);
            s("line", { x1: X(st.a), y1: Y(0), x2: X(st.a), y2: ya, stroke: C.blue.s, "stroke-width": 4, "stroke-linecap": "round" }, g);
            s("circle", { cx: X(st.a), cy: ya, r: 5, fill: C.blue.f, stroke: C.cocoa, "stroke-width": 1.2 }, g);
            if (f >= 2) SK.label(g, X(st.a) + 10, (Y(0) + ya) / 2, "餘數 = f(a) = " + SK.fmt(fa, 2), { size: 13, anchor: "start", color: C.blue.s });
          }
          var uniq = {};
          st.r.forEach(function (r) { uniq[r] = (uniq[r] || 0) + 1; });
          if (f === 5) Object.keys(uniq).forEach(function (k) { if (uniq[k] > 1) SK.label(g, X(+k), Y(0) - 22, "重根", { size: 13, color: C.pink.s }); });
          hs.forEach(function (hd, i) { hd.moveTo(X(st.r[i]), Y(0)); });
          hA.moveTo(X(st.a), Y(0));
          var fac = st.r.map(function (r) { return "(x" + (r >= 0 ? "-" : "+") + SK.fmt(Math.abs(r), 2) + ")"; }).join("");
          read.innerHTML = SK.tex("f(x)=" + fac + "=" + polyTex(co), true) + (showA ? SK.tex("f(" + SK.fmt(st.a, 2) + ")=" + SK.fmt(fa, 3) + (Math.abs(fa) < 1e-9 ? "\\ \\Rightarrow\\ (x" + (st.a >= 0 ? "-" : "+") + SK.fmt(Math.abs(st.a), 2) + ")\\mid f(x)" : ""), true) : "");
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "綜合除法：餘數表格", icon: "sparkle", render: syntheticAngle },
      { title: "為什麼三次函數一定碰得到 x 軸", icon: "leaf",
        html: "$x$ 很大時，$x^3$ 這一項壓過其他所有項，所以 $f(x)$ 在最右邊往上衝、在最左邊往下掉（首項係數為正時）。一條從下面連續走到上面的曲線，中間一定會穿過 $x$ 軸。所以實係數三次方程式<b>至少有一個實根</b>，找到它，就能用因式定理把三次降成二次。" }
    ],

    challenges: [
      { q: "$f(x)=x^3-2x^2-5x+6$。你能「猜」出一個根，再把它完全分解嗎？", hint: "先試 $x=1$、$x=-1$、$x=2$……代進去看哪個讓 $f$ 變成 0。",
        idea: "$f(1)=0$，所以 $f(x)=(x-1)(x^2-x-6)=(x-1)(x-3)(x+2)$。根是 $1,3,-2$。" },
      { q: "$f(x)$ 除以 $x-2$ 的餘數是 3。你能不做除法，說出 $f(2)$ 是多少嗎？圖形通過哪一點？", idea: "餘式定理：$f(2)=3$，圖形通過 $(2,3)$。除法的餘數和圖形上的一個點，是同一個資訊。" },
      { q: "如果 $f(x)$ 除以 $(x-1)(x-2)$，餘式會是什麼樣子？你能用 $f(1)$ 和 $f(2)$ 決定它嗎？", hint: "除以二次式，餘式最多是一次式 $px+q$。",
        idea: "$f(x)=(x-1)(x-2)q(x)+px+q$，代入 $x=1,2$ 得到 $p+q=f(1)$、$2p+q=f(2)$。餘式就是通過 $(1,f(1))$、$(2,f(2))$ 的那條直線！" }
    ],

    where: {
      codes: [["A-10-2", "多項式除法原理：因式定理、餘式定理、除以 $x-a$、以 $x-a$ 的形式表達"], ["F-10-3", "多項式不等式：以圖形連結解區間"]],
      exam: "高一共同必修，學測數 A、數 B 都在範圍內。「根＝因式＝圖形交點」會一路用到多項式不等式、三次函數，以及數甲的代數基本定理。",
      stop: "綜合除法的除式以 $x-a$ 為核心；不延伸分離係數法或大量高次特殊因式技巧。有理根候選可以說明原理，但屬課綱外鄰接補充，不要變成檢驗技巧題庫。"
    }
  });
})();
