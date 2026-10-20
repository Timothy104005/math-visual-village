/* 單元：主觀機率與客觀機率 */
(function () {
  var C = SK.C, s = SK.s;

  // 可重現的亂數
  function rng(seed) { return function () { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; }; }

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 250, "圖釘落地的兩種姿勢");
    s("rect", { x: 20, y: 190, width: 360, height: 8, fill: C.gold.f }, svg);
    // 釘尖朝上
    s("ellipse", { cx: 120, cy: 180, rx: 34, ry: 9, fill: C.orange.f, stroke: C.orange.s, "stroke-width": 1.5 }, svg);
    s("line", { x1: 120, y1: 172, x2: 120, y2: 110, stroke: C.cocoa, "stroke-width": 3 }, svg);
    SK.label(svg, 120, 220, "尖端朝上", { size: 13 });
    // 側躺
    s("ellipse", { cx: 270, cy: 160, rx: 10, ry: 30, fill: C.blue.f, stroke: C.blue.s, "stroke-width": 1.5, transform: "rotate(-60 270 160)" }, svg);
    s("line", { x1: 280, y1: 170, x2: 330, y2: 188, stroke: C.cocoa, "stroke-width": 3 }, svg);
    SK.label(svg, 290, 220, "側躺", { size: 13 });
    SK.label(svg, 200, 40, "尖端朝上的機率是多少？", { size: 14, color: C.pink.s });
    SK.label(svg, 200, 62, "它不像硬幣，沒辦法「數」出來", { size: 12, color: C.soft });
  }

  SK.mountUnit({
    slug: "subjective-prob",
    en: "Belief versus frequency",
    formula: "\\text{客觀機率}\\approx\\frac{\\text{事件發生次數}}{\\text{試驗次數}},\\qquad \\text{主觀機率也要滿足 } 0\\le P\\le1,\\ \\sum P=1",

    hook: {
      html: "丟硬幣，大家都同意正面的機率是 $\\tfrac12$。但丟一個<b>圖釘</b>呢？它的兩種落地姿勢顯然不對稱。",
      ask: "沒辦法用「對稱」算出機率時，機率從哪裡來？每個人的猜測都算數嗎？",
      visual: hookVisual
    },

    guess: {
      q: "小明說：「明天晴天的機率 50%、陰天 40%、下雨 30%。」這組機率有什麼問題？",
      options: [
        { t: "加起來 120%，超過 1", truth: true, explain: "三種天氣互斥、而且一定會發生其中一種，機率總和必須是 1。主觀機率可以因人而異，但必須遵守機率的基本性質，否則會自相矛盾。" },
        { t: "沒問題，主觀機率每個人可以隨便給", common: true, explain: "主觀機率確實可以因人而異！但「隨便給」會出問題：等一下你會看到，總和不等於 1 的人，會被設計成穩賠的賭局。" },
        { t: "晴天應該比雨天高很多", explain: "那是對天氣的判斷，每個人可以不同。這組數字的問題不在大小，而在總和。" },
        { t: "機率不能用百分比表示", explain: "百分比只是另一種寫法，50% 就是 0.5。" }
      ]
    },

    derive: {
      intro: "前兩步調整你心中的天氣機率；後面三步用模擬實驗看頻率怎麼變成機率。",
      tall: true,
      frames: [
        { cap: "<b>主觀機率</b>：根據個人的經驗與判斷，對一件事有多相信。它可以因人而異，但必須遵守機率的性質：每個機率在 0 到 1 之間，互斥且涵蓋所有情況的事件，機率加起來等於 1。", tex: "\\begin{gathered}0\\le P(A)\\le1\\\\P(\\text{晴})+P(\\text{陰})+P(\\text{雨})=1\\end{gathered}" },
        { cap: "為什麼一定要加起來是 1？假設每張「若成真就付 100 元」的彩券，你願意用「機率 × 100」元購買。總和超過 1，別人把三張都賣給你：你付的錢超過 100，但只會中一張，<b>穩賠</b>。總和小於 1，反過來跟你買也讓你穩賠。", tex: "\\text{總和}\\ne1\\ \\Rightarrow\\ \\text{有讓你穩賠的組合}" },
        { cap: "<b>客觀機率</b>：從資料得到。重複丟圖釘，記錄「尖端朝上」的<b>相對次數</b>。一開始跳動很大，次數越多越穩定。按按鈕丟丟看。", tex: "\\hat p=\\frac{\\text{朝上次數}}{\\text{試驗次數}}" },
        { cap: "試驗次數越多，相對次數離真正機率通常越近（<b>大數法則</b>）。灰色帶子是大約的波動範圍，寬度和 $\\tfrac{1}{\\sqrt n}$ 成正比：次數變成 100 倍，誤差才縮小成 $\\tfrac1{10}$。", tex: "\\text{波動}\\ \\propto\\ \\frac{1}{\\sqrt n}" },
        { cap: "兩種機率會相遇：氣象預報說「降雨機率 70%」是一種判斷，但我們可以回頭檢查——在他說 70% 的那些天，真的有大約 70% 下雨了嗎？這叫<b>校準</b>。點越靠近對角線，預報越可信。", tex: "\\text{說 }70\\%\\text{ 的那些天}\\ \\Rightarrow\\ \\text{實際約 }70\\%\\text{ 下雨}" }
      ],
      hint: "前兩步拖滑桿；後面按按鈕丟圖釘，或調整預報員的自信程度。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 540, 440, "機率的主觀與客觀");
        var g = s("g", {}, svg);
        var st = { p: [50, 40, 30], tosses: [], bias: 0 }, TRUE_P = .62, rand = rng(7);
        var names = ["晴", "陰", "雨"], cols = [C.gold, C.blue, C.purple];
        var read = SK.h("div", { class: "readout" });
        var sl = names.map(function (n, k) {
          var o = SK.slider({ label: "P(" + n + ")", min: 0, max: 100, step: 5, value: st.p[k], color: ["", "blue", "green"][k], fmt: function (v) { return v + "%"; }, onInput: function (v) { st.p[k] = v; draw(); } });
          ctx.sliders.appendChild(o.el); return o;
        });
        var sb = SK.slider({ label: "預報員", min: -1, max: 1, step: .1, value: 0, fmt: function (v) { return v > .05 ? "過度自信" : v < -.05 ? "太保守" : "剛剛好"; }, onInput: function (v) { st.bias = v; draw(); } });
        ctx.sliders.appendChild(sb.el);
        var btns = SK.h("div", { style: "display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px" });
        [["丟 1 次", 1], ["丟 10 次", 10], ["丟 100 次", 100], ["丟 1000 次", 1000], ["重來", 0]].forEach(function (b) {
          var e = SK.h("button", { class: "btn small" + (b[1] ? "" : " ghost"), type: "button" }, b[0]);
          e.addEventListener("click", function () {
            if (!b[1]) { st.tosses = []; rand = rng(Math.floor(Math.random() * 1e6)); }
            for (var i = 0; i < b[1] && st.tosses.length < 5000; i++) st.tosses.push(rand() < TRUE_P ? 1 : 0);
            draw();
          });
          btns.appendChild(e);
        });
        ctx.extra.appendChild(btns); ctx.extra.appendChild(read);
        for (var i0 = 0; i0 < 30; i0++) st.tosses.push(rand() < TRUE_P ? 1 : 0);
        function num(v, d) { return SK.fmt(v, d == null ? 3 : d).replace("−", "-"); }
        function draw() {
          var f = ctx.frame;
          g.innerHTML = "";
          sl.forEach(function (o) { o.el.style.display = f <= 1 ? "" : "none"; });
          sb.el.style.display = f === 4 ? "" : "none";
          btns.style.display = f === 2 || f === 3 ? "flex" : "none";
          if (f <= 1) {
            var tot = st.p[0] + st.p[1] + st.p[2];
            // 一條 100% 長的條，三段堆疊
            var x0 = 60, W = 420, y = 90, sc = W / Math.max(100, tot), x = x0;
            s("rect", { x: x0, y: y, width: 100 * sc, height: 44, fill: "none", stroke: C.cocoa, "stroke-width": 1.6, "stroke-dasharray": "6 4" }, g);
            SK.label(g, x0 + 100 * sc, y - 14, "100%", { size: 12, color: C.soft, anchor: "end" });
            st.p.forEach(function (p, k) {
              s("rect", { x: x, y: y + 6, width: p * sc, height: 32, fill: cols[k].f, stroke: cols[k].s }, g);
              if (p >= 8) SK.label(g, x + p * sc / 2, y + 22, names[k] + " " + p + "%", { size: 12 });
              x += p * sc;
            });
            var ok = tot === 100;
            SK.label(g, 270, 170, ok ? "總和 100%：這組主觀機率是一致的" : "總和 " + tot + "%：" + (tot > 100 ? "超過 1" : "不到 1") + "，自相矛盾", { size: 15, color: ok ? C.green.s : C.pink.s, bold: true });
            if (f === 1) {
              var cost = tot, gain = 100;
              var rows = tot > 100 ? [["你買下三張彩券，共付", cost + " 元"], ["不管明天什麼天氣，只中一張", gain + " 元"], ["你一定損失", (cost - gain) + " 元"]]
                : tot < 100 ? [["別人向你買三張彩券，付你", cost + " 元"], ["明天一定有一張中獎，你要付", gain + " 元"], ["你一定損失", (gain - cost) + " 元"]]
                : [["三張彩券共值", cost + " 元"], ["保證的獎金", gain + " 元"], ["沒有人能讓你穩賠", "✓"]];
              rows.forEach(function (r, k) {
                s("rect", { x: 90, y: 220 + k * 52, width: 360, height: 40, rx: 8, fill: k === 2 ? (ok ? C.green.f : C.pink.f) : C.paper, stroke: C.line }, g);
                SK.label(g, 110, 240 + k * 52, r[0], { size: 13, anchor: "start" });
                SK.label(g, 430, 240 + k * 52, r[1], { size: 14, anchor: "end", bold: true });
              });
            }
            read.innerHTML = SK.tex("P(\\text{晴})+P(\\text{陰})+P(\\text{雨})=" + (tot / 100).toFixed(2), true);
            return;
          }
          if (f === 2 || f === 3) {
            var T = st.tosses, n = T.length, gx = 60, gw = 440, gy = 60, gh = 300;
            var logX = f === 3;
            var X = function (k) { return logX ? gx + Math.log10(k) / Math.log10(Math.max(n, 10)) * gw : gx + (k - 1) / Math.max(n - 1, 1) * gw; };
            var Y = function (p) { return gy + gh - p * gh; };
            s("line", { x1: gx, y1: gy, x2: gx, y2: gy + gh, class: "m-axis" }, g);
            s("line", { x1: gx, y1: gy + gh, x2: gx + gw, y2: gy + gh, class: "m-axis" }, g);
            [0, .25, .5, .75, 1].forEach(function (p) { s("line", { x1: gx, y1: Y(p), x2: gx + gw, y2: Y(p), class: "m-grid" }, g); SK.label(g, gx - 8, Y(p), String(p), { size: 11, color: C.soft, anchor: "end" }); });
            if (f === 3) {
              var band = "", band2 = "";
              for (var k = 1; k <= n; k += Math.max(1, Math.floor(n / 200))) { var w = 2 * Math.sqrt(TRUE_P * (1 - TRUE_P) / k); band += (band ? "L" : "M") + X(k) + " " + Y(Math.min(1, TRUE_P + w)); band2 = "L" + X(k) + " " + Y(Math.max(0, TRUE_P - w)) + band2; }
              s("path", { d: band + band2 + "Z", fill: "rgba(156,140,124,.18)", stroke: "none" }, g);
              s("line", { x1: gx, y1: Y(TRUE_P), x2: gx + gw, y2: Y(TRUE_P), stroke: C.green.s, "stroke-dasharray": "6 4" }, g);
              SK.label(g, gx + gw, Y(TRUE_P) - 12, "（模擬時設定的真實機率 0.62）", { size: 11, color: C.green.s, anchor: "end" });
            }
            var d = "", c = 0;
            for (var k2 = 1; k2 <= n; k2++) { c += T[k2 - 1]; if (n > 400 && k2 % Math.floor(n / 400) && k2 !== n) continue; d += (d ? "L" : "M") + X(k2).toFixed(1) + " " + Y(c / k2).toFixed(1); }
            s("path", { d: d, fill: "none", stroke: C.orange.s, "stroke-width": 2.4 }, g);
            var ph = n ? c / n : 0;
            if (n) s("circle", { cx: X(n), cy: Y(ph), r: 5, fill: C.orange.s }, g);
            SK.label(g, gx + gw / 2, gy + gh + 24, logX ? "試驗次數（對數刻度）" : "試驗次數 1 → " + n, { size: 12, color: C.soft });
            SK.label(g, gx - 30, gy - 20, "尖端朝上的相對次數", { size: 12, color: C.soft, anchor: "start" });
            // 最近 60 次的結果
            var last = T.slice(-60);
            if (last.length) SK.label(g, gx, 404, "最近 " + last.length + " 次：", { size: 11, color: C.soft, anchor: "start" });
            last.forEach(function (t, i) { s("circle", { cx: gx + 70 + i * 6.2, cy: 404, r: 2.6, fill: t ? C.orange.s : C.blue.s }, g); });
            read.innerHTML = SK.tex("\\hat p=\\frac{" + c + "}{" + n + "}=" + num(ph), true);
            return;
          }
          // f === 4：校準圖
          var gx2 = 90, gy2 = 40, gs = 340, rnd = rng(11), pts = [];
          s("rect", { x: gx2, y: gy2, width: gs, height: gs, fill: C.paper, stroke: C.cocoa }, g);
          s("line", { x1: gx2, y1: gy2 + gs, x2: gx2 + gs, y2: gy2, stroke: C.green.s, "stroke-dasharray": "6 4" }, g);
          for (var q = 1; q <= 9; q++) {
            var said = q / 10, truth = SK.clamp(.5 + (said - .5) * (1 - .7 * st.bias), .02, .98), hit = 0, N = 60;
            for (var j = 0; j < N; j++) if (rnd() < truth) hit++;
            pts.push([said, hit / N]);
            s("line", { x1: gx2 + said * gs, y1: gy2 + gs - 4, x2: gx2 + said * gs, y2: gy2 + gs + 4, stroke: C.cocoa }, g);
            SK.label(g, gx2 + said * gs, gy2 + gs + 16, q * 10 + "%", { size: 10, color: C.soft });
            SK.label(g, gx2 - 8, gy2 + gs - said * gs, q * 10 + "%", { size: 10, color: C.soft, anchor: "end" });
          }
          pts.forEach(function (p) { s("circle", { cx: gx2 + p[0] * gs, cy: gy2 + gs - p[1] * gs, r: 7, fill: C.orange.f, stroke: C.orange.s, "stroke-width": 1.6 }, g); });
          SK.label(g, gx2 + gs / 2, gy2 + gs + 36, "預報員說的降雨機率", { size: 12, color: C.soft });
          SK.label(g, gx2 - 50, gy2 - 16, "實際下雨的比例", { size: 12, color: C.soft, anchor: "start" });
          var err = pts.reduce(function (m, p) { return m + Math.abs(p[0] - p[1]); }, 0) / pts.length;
          read.innerHTML = '<p style="margin:4px 0">平均偏差約 ' + Math.round(err * 100) + " 個百分點" + (st.bias > .05 ? "：說 90% 的日子其實沒那麼常下雨，太自信了" : st.bias < -.05 ? "：說 90% 的日子幾乎都下雨，太保守了" : "：點大致落在對角線上，這位預報員的主觀機率經得起資料檢驗") + "</p>";
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "三種機率從哪裡來", icon: "sparkle",
        html: "<b>古典機率</b>：情況對稱、可以數（骰子、撲克牌）。<b>客觀機率</b>：情況不對稱，但可以重複觀察（圖釘、罰球命中率、保險的死亡率表）。<b>主觀機率</b>：無法重複的事（明天的比賽、某個新藥是否有效），只能依判斷給。三者都要遵守同樣的機率性質。" },
      { title: "新的資料來了，信念要更新", icon: "leaf",
        html: "主觀機率不是固執的意見。看到新的證據，合理的做法是依機率規則調整信念：這就是下一個單元「條件機率與貝氏」要學的。主觀機率經過一次次的資料修正，會越來越接近客觀的頻率。" }
    ],

    challenges: [
      { q: "某籃球員本季罰球 80 投 62 中。估計他下一球罰進的機率，這是哪一種機率？", idea: "$\\tfrac{62}{80}=0.775$，是由資料得到的客觀機率（相對次數）。它假設這位球員的狀態大致穩定。" },
      { q: "小華認為「甲隊贏」的機率是 0.6、「乙隊贏」是 0.3（沒有和局）。怎麼和他打賭，讓他穩賠？", idea: "他的兩個機率加起來只有 0.9。依他的看法，「甲贏付 100 元」的彩券值 60 元、「乙贏付 100 元」值 30 元，所以他願意用這個價錢賣。你用 90 元向他買下這兩張；比賽一定有一隊贏，他一定要付你 100 元，穩賠 10 元。" },
      { q: "丟 10 次圖釘有 7 次朝上，和丟 1000 次有 700 次朝上，都估計 $p\\approx0.7$。哪一個比較可信？為什麼？", idea: "1000 次的比較可信。波動大約和 $\\tfrac1{\\sqrt n}$ 成正比：10 次時誤差可能到 $\\pm0.3$，1000 次時只剩 $\\pm0.03$ 左右。" }
    ],

    where: {
      codes: [["D-11A-1", "主觀機率與客觀機率：以機率的性質檢視主觀機率的合理性；由數據（相對次數）取得客觀機率"], ["D-11B-1", "主觀機率與客觀機率：與數 A 相同的核心意涵"]],
      exam: "11 年級<b>數學 A</b> 與<b>數學 B</b> 都有，學測兩科都在範圍內，常以素養情境出現。",
      stop: "重點是理解機率的不同來源、用機率性質檢查主觀判斷、用相對次數估計機率。抽樣誤差的正式計算、信賴區間與隨機變數都不在這個單元（數 B 明定不含）。"
    }
  });
})();
