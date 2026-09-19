/* 單元 9：無窮等比級數 */
(function () {
  var C = SK.C, s = SK.s;
  var PAL = [C.orange, C.blue, C.green, C.gold, C.pink, C.purple];

  /* 把正方形不斷對半切：回傳前 n 塊的矩形與剩下的矩形 */
  function halves(x, y, w, h, n) {
    var out = [];
    for (var k = 1; k <= n; k++) {
      if (k % 2) { out.push([x, y, w / 2, h]); x += w / 2; w /= 2; }
      else { out.push([x, y, w, h / 2]); y += h / 2; h /= 2; }
    }
    return { pieces: out, rest: [x, y, w, h] };
  }

  function hookVisual(el) {
    var svg = SK.svg(el, 420, 260, "一條巧克力每次吃掉剩下的一半");
    var x0 = 30, w = 360, y = 40, h = 44;
    var row = 0, x = x0, W = w;
    for (var k = 0; k < 4; k++) {
      var yy = y + k * 52;
      s("rect", { x: x0, y: yy, width: w, height: h, rx: 6, fill: "rgba(74,63,55,.12)", stroke: C.line, "stroke-width": 1.5, "stroke-dasharray": "5 4" }, svg);
      var eaten = w * (1 - Math.pow(.5, k + 1));
      s("rect", { x: x0, y: yy, width: eaten, height: h, rx: 6, fill: "#D9C3A8", stroke: "#4A3F37", "stroke-width": 1.5 }, svg);
      SK.label(svg, x0 + w + 12, yy + h / 2, ["½", "¾", "⅞", "15/16"][k], { size: 15, anchor: "start" });
    }
    SK.label(svg, 210, 250, "第 1、2、3、4 口之後，吃掉的總量", { size: 13, color: C.soft });
  }

  function lineAngle(el) {
    var wrap = SK.h("div", {});
    var st = SK.h("div", { class: "stage" });
    wrap.appendChild(st); el.appendChild(wrap);
    var svg = SK.svg(st, 700, 230, "等比級數的每一項在數線上一段一段接起來");
    var g = s("g", {}, svg);
    var stt = { r: .5 };
    var X = function (v) { return 60 + v * 190; };
    function draw() {
      g.innerHTML = "";
      var r = stt.r, S = 1 / (1 - r);
      s("line", { x1: 30, y1: 150, x2: 690, y2: 150, class: "m-axis" }, g);
      for (var t = 0; t <= 3; t += .5) {
        s("line", { x1: X(t), y1: 145, x2: X(t), y2: 155, class: "m-axis" }, g);
        SK.label(g, X(t), 172, SK.fmt(t, 1), { size: 12, color: C.soft });
      }
      var pos = 0, term = 1;
      for (var k = 0; k < 16; k++) {
        var np = pos + term, lvl = 118 - (k % 2) * 18 - (r < 0 ? 0 : k % 3 * 10);
        var col = PAL[k % PAL.length];
        SK.arrow(g, X(pos), lvl, X(np), lvl, col.s, Math.max(1.4, 4 - k * .25));
        pos = np; term *= r;
        if (Math.abs(term) < .004) break;
      }
      s("line", { x1: X(S), y1: 40, x2: X(S), y2: 160, stroke: C.pink.s, "stroke-width": 2, "stroke-dasharray": "6 5" }, g);
      SK.label(g, X(S), 30, "1/(1−r) = " + SK.fmt(S, 3), { size: 14, color: C.pink.s });
      s("circle", { cx: X(0), cy: 150, r: 4, fill: C.ink }, g);
      out.innerHTML = SK.tex("1+" + SK.fmt(r, 2) + "+(" + SK.fmt(r, 2) + ")^2+\\cdots=\\frac{1}{1-(" + SK.fmt(r, 2) + ")}=" + SK.fmt(S, 3), true);
    }
    var ctr = SK.h("div", { class: "sliders", style: "margin-top:12px" });
    var out = SK.h("div", { class: "readout" });
    ctr.appendChild(SK.slider({ label: "$r$", min: -.9, max: .7, step: .05, value: stt.r, onInput: function (v) { stt.r = v; draw(); } }).el);
    ctr.appendChild(out);
    wrap.appendChild(ctr);
    wrap.insertAdjacentHTML("beforeend", '<p class="muted" style="font-size:.95rem">' + SK.md("首項 1、公比 $r$：每一段都是前一段的 $r$ 倍，一段一段接下去。$r$ 為正時一路往前、越走越小步；$r$ 為負時<b>來回跳</b>，但擺動越來越小，一樣停在 $\\frac{1}{1-r}$。為什麼是這個數？整串 $S=1+r+r^2+\\cdots$ 去掉第一段後，剩下的正好是整串縮小 $r$ 倍：$S=1+rS$，解出 $S=\\frac1{1-r}$。") + "</p>");
    draw();
  }

  SK.mountUnit({
    slug: "infinite-geometric",
    en: "Keep cutting in half, and it fills up exactly",
    formula: "\\co{\\tfrac12}+\\cb{\\tfrac14}+\\cg{\\tfrac18}+\\cdots=1,\\qquad \\sum_{k=1}^{\\infty}ar^{k-1}=\\frac{a}{1-r}\\ \\ (|r|<1)",

    hook: {
      html: "你有一條巧克力。第一口吃掉一半，第二口吃掉<b>剩下的</b>一半，第三口再吃剩下的一半……一直吃下去。",
      ask: "你會把整條巧克力吃完嗎？全部加起來總共吃了多少？",
      visual: hookVisual
    },

    guess: {
      q: "$\\dfrac12+\\dfrac14+\\dfrac18+\\dfrac1{16}+\\cdots$ 無限加下去，結果是？",
      options: [
        { t: "無限大，因為加了無限多個正數", common: true, explain: "「無限多個正數加起來一定無限大」是非常自然的直覺，古希臘的芝諾也為此困惑了很久！但這些數越來越小，小得夠快的話，總和就會被困在一個有限的範圍裡：正方形只有 1 那麼大，怎麼塗都塗不出去。" },
        { t: "剛好是 1", truth: true, explain: "每一步都只塗「剩下的一半」，沒塗到的部分依序是 $\\tfrac12,\\tfrac14,\\tfrac18,\\dots$，越來越接近 0。所以部分和越來越接近 1，無窮級數的和<b>定義成</b>這個極限，就是 1。" },
        { t: "非常接近 1，但永遠不到 1", common: true, explain: "你說的完全正確，但說的是<b>部分和</b>：每一個有限步的和 $1-\\left(\\tfrac12\\right)^n$ 的確都小於 1。而「無限加下去」的意思是取極限，極限剛好等於 1。分清楚「每一步」和「極限」，是這個單元最重要的一件事。" },
        { t: "沒有答案，因為加不完", explain: "加不完是真的，我們確實無法做完無限次加法。所以數學家換了一個問法：「前 $n$ 項的和，當 $n$ 越來越大時，會不會穩定在某個值？」會的話，那個值就是答案。" }
      ]
    },

    derive: {
      intro: "拿一個面積為 1 的正方形，每次塗掉「還沒塗的部分」的一半。",
      frames: [
        { cap: "一個面積 1 的正方形，還沒開始塗。", tex: "S_0=0" },
        { cap: "塗掉一半。", tex: "S_1=\\co{\\tfrac12}" },
        { cap: "再塗掉<b>剩下部分</b>的一半，也就是 $\\tfrac14$。", tex: "S_2=\\co{\\tfrac12}+\\cb{\\tfrac14}=\\tfrac34" },
        { cap: "拖動滑桿多塗幾次。注意虛線框：沒塗到的部分，永遠剛好等於<b>最後一塊</b>的大小 $\\left(\\tfrac12\\right)^n$。", tex: "S_n=\\tfrac12+\\tfrac14+\\cdots+\\tfrac1{2^n}=1-\\left(\\tfrac12\\right)^n" },
        { cap: "$n$ 越大，剩下的 $\\left(\\tfrac12\\right)^n$ 越接近 0，小到比任何你說得出的正數都還小。所以部分和的極限是 1。", tex: "\\sum_{k=1}^{\\infty}\\frac1{2^k}=\\lim_{n\\to\\infty}\\left(1-\\tfrac1{2^n}\\right)=1" },
        { cap: "一般的首項 $a$、公比 $r$ 也一樣：部分和的公式裡有一項 $r^n$，只要 $|r|<1$，它就會趨近 0。", tex: "S_n=\\frac{a(1-r^n)}{1-r}\\ \\xrightarrow{\\ n\\to\\infty\\ }\\ \\frac{a}{1-r}" }
      ],
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 480, 440, "面積 1 的正方形不斷對半塗色");
        var g = s("g", {}, svg);
        var st = { n: 5 };
        var read = SK.h("div", { class: "readout" });
        var sl = SK.slider({ label: "$n$", min: 0, max: 14, value: st.n, fmt: function (v) { return v + " 塊"; }, onInput: function (v) { st.n = v; paint(); } });
        ctx.sliders.appendChild(sl.el);
        ctx.extra.appendChild(read);
        var x0 = 60, y0 = 40, S = 360;
        function paint() {
          var f = ctx.frame, n = st.n;
          g.innerHTML = "";
          s("rect", { x: x0, y: y0, width: S, height: S, fill: "#FDFBF6", stroke: C.ink, "stroke-width": 2.4 }, g);
          var hv = halves(x0, y0, S, S, n);
          var fillG = s("g", { filter: "url(#sk-soft)" }, g);
          hv.pieces.forEach(function (p, i) {
            var col = PAL[i % PAL.length];
            s("rect", { x: p[0], y: p[1], width: p[2], height: p[3], fill: col.f, stroke: col.s, "stroke-width": 1.4 }, fillG);
            if (p[2] > 38 && p[3] > 26) SK.label(g, p[0] + p[2] / 2, p[1] + p[3] / 2, "1/" + Math.pow(2, i + 1), { size: Math.max(12, 22 - i * 2), color: col.s });
          });
          var r = hv.rest;
          if (n > 0 && r[2] > 2) s("rect", { x: r[0], y: r[1], width: r[2], height: r[3], fill: "none", stroke: C.pink.s, "stroke-width": 2, "stroke-dasharray": "5 4", class: f >= 3 ? "pulse" : "" }, g);
          if (n > 0 && r[2] > 40) SK.label(g, r[0] + r[2] / 2, r[1] + r[3] / 2, "剩 1/" + Math.pow(2, n), { size: 13, color: C.pink.s });
          SK.label(g, x0 + S / 2, y0 + S + 22, "面積 = 1", { size: 14, color: C.soft });
          var Sn = 1 - Math.pow(.5, n);
          read.innerHTML = SK.tex("\\begin{gathered}S_{" + n + "}=1-\\left(\\tfrac12\\right)^{" + n + "}=" + (n <= 10 ? SK.fmt(Sn, 6) : Sn.toFixed(8)) + "\\\\ \\text{剩下 }" + (n <= 10 ? "\\tfrac1{" + Math.pow(2, n) + "}" : "\\approx" + Math.pow(.5, n).toExponential(1).replace("e-", "\\times10^{-") + "}") + "\\end{gathered}", true);
        }
        var anim = null;
        function show(i) {
          if (anim) { clearInterval(anim); anim = null; }
          var preset = [0, 1, 2, 5, 14, 14][i];
          if (i === 4) {
            // 動畫：一塊一塊塗到很多塊
            var k = 3;
            anim = setInterval(function () { k++; st.n = k; sl.set(k, true); paint(); if (k >= 14) { clearInterval(anim); anim = null; } }, 260);
          } else { st.n = preset; sl.set(preset, true); paint(); }
        }
        return { show: show };
      }
    },

    angles: [
      { title: "一般的公比：在數線上一段一段接起來", icon: "sparkle", render: lineAngle },
      { title: "所以 $0.999\\ldots=1$", icon: "bulb",
        html: "循環小數 $0.999\\ldots$ 的意思就是 $0.9+0.09+0.009+\\cdots$，首項 $0.9$、公比 $0.1$ 的無窮等比級數：$$0.\\overline{9}=\\frac{0.9}{1-0.1}=1.$$ 部分和 $0.9,\\ 0.99,\\ 0.999,\\dots$ 每一個都小於 1，但它們的極限是 1。這和巧克力永遠吃不完、總量卻是一整條，是同一件事。任何循環小數都可以用同樣方法化成分數。" }
    ],

    challenges: [
      { q: "$\\dfrac14+\\dfrac1{16}+\\dfrac1{64}+\\cdots$ 等於多少？你能畫一張圖讓人「一眼看出來」嗎？", hint: "把正方形切成四個小正方形，塗一個、留一個不動、再把另一個繼續切。或者想想：三份一樣大的東西。",
        idea: "$\\dfrac{1/4}{1-1/4}=\\dfrac13$。圖像版：每次把角落的小正方形切成四格，三個 L 形各塗一個顏色，三種顏色永遠一樣多，所以每種都是 $\\tfrac13$。" },
      { q: "$1-\\dfrac12+\\dfrac14-\\dfrac18+\\cdots$ 會停在哪裡？在「換個角度看」的數線上把 $r$ 拉到 $-0.5$ 驗證看看。", idea: "$\\dfrac{1}{1-(-\\frac12)}=\\dfrac23$。來回跳動，但越跳越小，最後停在 $\\tfrac23$。" },
      { q: "科赫雪花：每一步把每條邊的中間三分之一往外長出一個小三角形。它的周長會變成無限大，面積卻是有限的。為什麼？", hint: "每一步周長變成原來的 $\\tfrac43$ 倍；而新加的面積，每一步是上一步新增面積的幾倍？",
        idea: "周長是公比 $\\tfrac43>1$ 的等比數列，發散；每一步新增的小三角形面積則構成公比 $\\tfrac49$ 的等比級數，收斂。同一個圖形，兩個公比，兩種命運。" }
    ],

    where: {
      codes: [["N-12甲-2", "無窮等比級數：循環小數、部分和、收斂與發散、無窮等比級數求和、$\\Sigma$ 符號與基本性質"]],
      exam: "12 年級<b>選修數學甲</b>，只在分科測驗數甲的範圍內，學測不考。前置知識是高一 `N-10-6` 的有限等比級數；它也是數甲極限、微積分的第一個「無限過程」例子。",
      stop: "只處理等比級數：部分和、$|r|<1$ 時收斂、循環小數化分數。級數重排、絕對收斂與條件收斂、比值檢定等一般收斂判別法都是大學的內容。"
    }
  });
})();
