/* 單元：三次函數的圖形特徵 */
(function () {
  var C = SK.C, s = SK.s;

  /* 在 svg 群組 g 中，以世界座標視窗 [cx±hw, cy±hh] 畫出函數 */
  function plot(g, W, H, view, fns) {
    var cx = view.cx, cy = view.cy, hw = view.hw, hh = hw * H / W;
    function X(x) { return (x - cx + hw) / (2 * hw) * W; }
    function Y(y) { return H - (y - cy + hh) / (2 * hh) * H; }
    var step = Math.pow(10, Math.floor(Math.log10(hw)));
    if (hw / step < 2) step /= 2;
    for (var gx = Math.ceil((cx - hw) / step) * step; gx <= cx + hw; gx += step) s("line", { x1: X(gx), y1: 0, x2: X(gx), y2: H, class: "m-grid" }, g);
    for (var gy = Math.ceil((cy - hh) / step) * step; gy <= cy + hh; gy += step) s("line", { x1: 0, y1: Y(gy), x2: W, y2: Y(gy), class: "m-grid" }, g);
    s("line", { x1: 0, y1: Y(0), x2: W, y2: Y(0), class: "m-axis" }, g);
    s("line", { x1: X(0), y1: 0, x2: X(0), y2: H, class: "m-axis" }, g);
    fns.forEach(function (fn) {
      var d = "", N = 240;
      for (var i = 0; i <= N; i++) {
        var x = cx - hw + 2 * hw * i / N, y = fn.f(x), py = SK.clamp(Y(y), -40, H + 40);
        d += (i ? "L" : "M") + X(x).toFixed(1) + " " + py.toFixed(1);
      }
      s("path", { d: d, fill: "none", stroke: fn.color, "stroke-width": fn.w || 2.6, "stroke-dasharray": fn.dash || null }, g);
    });
    return { X: X, Y: Y };
  }

  function hookVisual(el) {
    var svg = SK.svg(el, 420, 280, "三條不同的三次函數圖形");
    var g = s("g", {}, svg);
    plot(g, 420, 280, { cx: 0, cy: 0, hw: 3 }, [
      { f: function (x) { return x * x * x / 3; }, color: C.orange.s },
      { f: function (x) { return x * x * x / 3 - 1.5 * x; }, color: C.blue.s },
      { f: function (x) { return -(x - 1) * (x - 1) * (x - 1) / 2 + 1; }, color: C.green.s }
    ]);
    SK.label(svg, 210, 266, "它們有什麼共同的「個性」？", { size: 14, color: C.soft });
  }

  function signAngle(el) {
    var wrap = SK.h("div", { class: "two-col" });
    var st = SK.h("div", { class: "stage" }), side = SK.h("div", {});
    wrap.appendChild(st); wrap.appendChild(side); el.appendChild(wrap);
    var W = 420, H = 260, svg = SK.svg(st, W, H, "由圖形讀出不等式的解");
    var g = s("g", {}, svg);
    function f(x) { return (x - 1) * (x - 2) * (x - 4); }
    var v = plot(g, W, H, { cx: 2.4, cy: 0, hw: 3 }, [{ f: f, color: C.ink }]);
    var bands = [[1, 2], [4, 5.4]];
    bands.forEach(function (b) { s("rect", { x: v.X(b[0]), y: v.Y(0) - 5, width: v.X(b[1]) - v.X(b[0]), height: 10, rx: 5, fill: C.orange.f, stroke: C.orange.s }, g); });
    [1, 2, 4].forEach(function (r) { s("circle", { cx: v.X(r), cy: v.Y(0), r: 5, fill: "#FDFBF6", stroke: C.cocoa, "stroke-width": 1.4 }, g); SK.label(g, v.X(r), v.Y(0) + 20, String(r), { size: 13 }); });
    side.innerHTML = '<p style="margin-top:0">' + SK.md("解 $(x-1)(x-2)(x-4)>0$ 不必背口訣：先畫出三次函數，再看圖形在 $x$ 軸<b>上方</b>的區間（蜜桃色）。") + "</p>" +
      '<div class="readout">' + SK.tex("1<x<2\\quad\\text{或}\\quad x>4", true) + "</div>" +
      '<p class="muted" style="font-size:.95rem">' + SK.md("右邊一路往上，是因為首項 $x^3$ 主導大域行為；每經過一個根，正負號就翻一次。函數、方程式、不等式，其實是同一張圖的三種問法。") + "</p>";
  }

  SK.mountUnit({
    slug: "cubic-shape",
    en: "Far away it looks like x³, up close it looks like a line",
    formula: "y=\\co{a}(x-\\cb{h})^3+\\cg{p}(x-\\cb{h})+\\cb{k}\\quad\\text{對稱中心}\\ (\\cb{h},\\cb{k})",

    hook: {
      html: "這三條曲線都是三次函數：$y=ax^3+bx^2+cx+d$。有的單調、有的彎兩次、有的倒過來。",
      ask: "看起來很不一樣，但它們有沒有共同的「個性」？如果把畫面拉遠或拉近，又會看到什麼？",
      visual: hookVisual
    },

    guess: {
      q: "$y=x^3-100x$ 這條曲線，當 $x$ 非常大（例如幾百、幾千）時，看起來最像哪一條？",
      options: [
        { t: "$y=x^3$", truth: true, explain: "$x=1000$ 時，$x^3=10^9$，而 $100x=10^5$，連它的萬分之一都不到。$x$ 越大，最高次項越是完全主導，拉遠看就只剩 $x^3$ 的形狀。" },
        { t: "$y=-100x$", common: true, explain: "$-100x$ 的係數很大，看起來很有份量，這個直覺很合理！在 $x$ 小的時候它確實很重要。但 $x$ 夠大之後，$x^3$ 成長得快太多，係數再大也追不上。" },
        { t: "一條拋物線", explain: "三次函數的確有彎曲的地方，但兩端一個往上、一個往下，不像拋物線兩端同方向。" },
        { t: "一條水平線", explain: "如果是把畫面「縮得很扁」可能會有這種感覺，但實際上 $x$ 越大，$y$ 越是衝向無限大。" }
      ]
    },

    derive: {
      intro: "拖動滑桿改變 $a$、$p$、$h$、$k$。任何三次函數都能寫成 $y=a(x-h)^3+p(x-h)+k$（和配方法同一個想法）。",
      tall: true,
      frames: [
        { cap: "最簡單的 $y=x^3$：把圖繞原點轉 $180^\\circ$ 會和自己重合，原點是它的<b>對稱中心</b>。", tex: "(-x)^3=-x^3" },
        { cap: "加上一次項 $p(x-h)$，再平移到 $(h,k)$：對稱中心跟著搬到 $(h,k)$。灰紫色虛線是轉 $180^\\circ$ 的影子，和原圖完全重合。", tex: "y=a(x-\\cb{h})^3+p(x-\\cb{h})+\\cb{k}" },
        { cap: "$p$ 的正負決定形狀：$a>0$ 時，$p\\ge0$ 一路往上；$p<0$ 會先上、再下、再上，出現兩個轉折。", tex: "\\begin{aligned}a>0,\\ \\cg{p}\\ge0&:\\ \\text{單調遞增}\\\\ a>0,\\ \\cg{p}<0&:\\ \\text{兩個轉折}\\end{aligned}" },
        { cap: "拉遠看（拖「視野」滑桿變大）：不管 $p$、$h$、$k$ 是多少，圖形越來越像 $y=ax^3$（灰藍虛線）。<b>最高次項決定大域行為</b>。", tex: "|x|\\ \\text{很大}:\\ y\\approx \\co{a}x^3" },
        { cap: "拉近看（把「視野」調小）：在任何一點附近，曲線看起來都像一條<b>直線</b>。這就是數甲「切線、導數」的起點。", tex: "x\\ \\text{在某點附近}:\\ \\text{曲線}\\approx\\text{直線}" }
      ],
      setup: function (ctx) {
        var W = 520, H = 440, svg = SK.svg(ctx.stage, W, H, "可縮放的三次函數圖形");
        var g = s("g", {}, svg);
        var st = { a: 1, p: -3, h: .5, k: 1, zoom: 4 };
        var read = SK.h("div", { class: "readout" });
        var sls = {};
        [["a", "$a$", -2, 2, .1, ""], ["p", "$p$", -6, 6, .5, "green"], ["h", "$h$", -2, 2, .1, "blue"], ["k", "$k$", -3, 3, .5, "blue"], ["zoom", "視野", .05, 60, .05, ""]].forEach(function (d) {
          sls[d[0]] = SK.slider({ label: d[1], min: d[2], max: d[3], step: d[4], value: st[d[0]], color: d[5],
            fmt: d[0] === "zoom" ? function (v) { return "±" + SK.fmt(v, 2); } : null,
            onInput: function (v) { if (d[0] === "a" && Math.abs(v) < .05) v = .1; st[d[0]] = v; draw(); } });
          ctx.sliders.appendChild(sls[d[0]].el);
        });
        ctx.extra.appendChild(read);
        function f(x) { var t = x - st.h; return st.a * t * t * t + st.p * t + st.k; }
        function draw() {
          var fr = ctx.frame;
          g.innerHTML = "";
          var cx = st.h, cy = st.k, hw = st.zoom;
          if (fr === 3) { cx = 0; cy = 0; }
          if (fr === 4) { cx = st.h + 1; cy = f(st.h + 1); }
          var fns = [{ f: f, color: C.ink, w: 2.8 }];
          if (fr === 0) fns = [{ f: function (x) { return x * x * x; }, color: C.ink, w: 2.8 }, { f: function (x) { return -Math.pow(-x, 3); }, color: C.purple.s, dash: "6 6", w: 2 }];
          if (fr === 1 || fr === 2) fns.push({ f: function (x) { return 2 * st.k - f(2 * st.h - x); }, color: C.purple.s, dash: "6 6", w: 2 });
          if (fr === 3) fns.push({ f: function (x) { return st.a * x * x * x; }, color: C.blue.s, dash: "7 5", w: 2.2 });
          var v = plot(g, W, H, fr === 0 ? { cx: 0, cy: 0, hw: 3 } : { cx: cx, cy: cy, hw: hw }, fns);
          if (fr === 1 || fr === 2) {
            s("circle", { cx: v.X(st.h), cy: v.Y(st.k), r: 6, fill: C.orange.f, stroke: C.cocoa, "stroke-width": 1.4 }, g);
            SK.label(g, v.X(st.h) + 12, v.Y(st.k) - 12, "(h, k)", { size: 13, anchor: "start", color: C.orange.s });
          }
          if (fr === 4) {
            var x1 = st.h + 1, m = 3 * st.a + st.p;
            s("line", { x1: v.X(x1 - hw), y1: v.Y(f(x1) - m * hw), x2: v.X(x1 + hw), y2: v.Y(f(x1) + m * hw), stroke: C.green.s, "stroke-width": 1.6, "stroke-dasharray": "5 5" }, g);
            s("circle", { cx: v.X(x1), cy: v.Y(f(x1)), r: 5, fill: C.orange.f, stroke: C.cocoa, "stroke-width": 1.3 }, g);
            SK.label(g, 12, 22, "視野 ±" + SK.fmt(hw, 2) + "：越小越像直線（綠色虛線）", { size: 13, anchor: "start", color: C.green.s });
          }
          if (fr === 3) SK.label(g, 12, 22, "視野 ±" + SK.fmt(hw, 1) + "：拉遠後兩條線幾乎重合", { size: 13, anchor: "start", color: C.blue.s });
          var sh = function (v, pre) { return v === 0 ? "" : (v > 0 ? "+" : "-") + SK.fmt(Math.abs(v), 2) + (pre || ""); };
          read.innerHTML = SK.tex("y=" + SK.fmt(st.a, 2) + "(x" + sh(-st.h) + ")^3" + (st.p ? sh(st.p, "(x" + sh(-st.h) + ")") : "") + sh(st.k), true);
        }
        function show(i) {
          if (i === 3 && st.zoom < 8) { st.zoom = 30; sls.zoom.set(30, true); }
          if (i === 4 && st.zoom > 1) { st.zoom = .3; sls.zoom.set(.3, true); }
          if (i <= 2 && (st.zoom > 8 || st.zoom < 2)) { st.zoom = 4; sls.zoom.set(4, true); }
          draw();
        }
        return { show: show };
      }
    },

    angles: [
      { title: "用圖形解多項式不等式", icon: "sparkle", render: signAngle },
      { title: "局部像直線：用數字看", icon: "leaf",
        html: "$f(x)=x^3$ 在 $x=1$ 附近：$f(1.01)=1.030301$、$f(1.001)=1.003003\\ldots$。每往右多走 $0.001$，高度大約多 $0.003$，就像一條斜率 3 的直線 $y=1+3(x-1)$。「放大後像直線」是課綱 `F-10-2` 的直觀說法，到數甲就叫做<b>導數</b>與<b>一次估計</b>。" }
    ],

    challenges: [
      { q: "$y=x^3-3x$ 的對稱中心在哪裡？$y=x^3-3x^2+2$ 呢？", hint: "第二個：試著寫成 $(x-1)^3+p(x-1)+k$ 的形式。",
        idea: "第一個是 $(0,0)$。第二個：$(x-1)^3=x^3-3x^2+3x-1$，所以 $x^3-3x^2+2=(x-1)^3-3(x-1)+0$，對稱中心 $(1,0)$。一般來說，$h=-\\dfrac{b}{3a}$。" },
      { q: "為什麼三次函數的圖形一定會穿過 $x$ 軸至少一次？二次函數呢？", idea: "三次函數兩端的方向相反（一端 $+\\infty$、一端 $-\\infty$），連續的曲線中間一定穿過 $x$ 軸。二次函數兩端同方向，所以可以完全不碰到 $x$ 軸。" },
      { q: "把 $y=x^3-3x$ 在 $x=1$ 附近放大，看起來像哪一條直線？在 $x=0$ 附近呢？", hint: "用「換個角度看」的方法，代 $x=1.001$、$x=0.001$ 算算看高度變化。",
        idea: "$x=1$ 附近像水平線 $y=-2$（那裡是轉折點）；$x=0$ 附近像 $y=-3x$。到了數甲，你會用導數 $3x^2-3$ 一次算出每一點的斜率。" }
    ],

    where: {
      codes: [["F-10-2", "三次函數圖形特徵：二、三次函數的對稱性、最高次項決定大域行為、局部近似直線"], ["F-10-3", "多項式不等式：以圖形連結解區間"]],
      exam: "高一共同必修，學測數 A、數 B 都在範圍內。它為數甲的微分（切線、單調、凹凸）先建立圖形直覺。",
      stop: "高一只要求圖形的直觀特徵：對稱中心、大域行為、局部像直線。用導數求極值、判斷凹凸是數甲 `F-12甲-4` 的內容，不必提前。"
    }
  });
})();
