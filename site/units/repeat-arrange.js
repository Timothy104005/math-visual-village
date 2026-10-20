/* 單元：重複排列 */
(function () {
  var C = SK.C, s = SK.s;
  var COL = [C.orange, C.blue, C.green, C.pink, C.purple];

  function pow(n, k) { var r = 1; for (var i = 0; i < k; i++) r *= n; return r; }
  function perm(n, k) { var r = 1; for (var i = 0; i < k; i++) r *= (n - i); return r; }

  function hookVisual(el) {
    var svg = SK.svg(el, 400, 230, "四位數字的密碼鎖");
    [0, 1, 2, 3].forEach(function (i) {
      var x = 92 + i * 60;
      s("rect", { x: x - 24, y: 60, width: 48, height: 74, rx: 9, fill: C.paper, stroke: C.cocoa, "stroke-width": 1.6 }, svg);
      SK.label(svg, x, 82, "▲", { size: 10, color: C.line });
      SK.label(svg, x, 97, "?", { size: 24, color: C.orange.s });
      SK.label(svg, x, 118, "▼", { size: 10, color: C.line });
      SK.label(svg, x, 152, "0–9", { size: 11, color: C.soft });
    });
    SK.label(svg, 200, 36, "每一格都可以是 0 到 9 的任一個數字", { size: 13, color: C.soft });
    SK.label(svg, 200, 196, "一共有幾組可能的密碼？", { size: 14, color: C.pink.s });
    SK.label(svg, 200, 216, "（數字可以重複，例如 7777 也算）", { size: 12, color: C.soft });
  }

  SK.mountUnit({
    slug: "repeat-arrange",
    en: "When you may choose the same thing again",
    formula: "\\underbrace{\\co{n}\\times \\co{n}\\times\\cdots\\times \\co{n}}_{\\cb{k}\\ \\text{次}}=\\co{n}^{\\cb{k}}",

    hook: {
      html: "一個四位數字的密碼鎖，每一格都可以轉到 0 到 9 的任一個數字，而且<b>數字可以重複</b>——0000、7777、1213 都是合法的密碼。",
      ask: "這把鎖一共有幾組密碼？如果改成「四格的數字都不能重複」，答案又會差多少？",
      visual: hookVisual
    },

    guess: {
      q: "把 3 顆<b>不同</b>的球，放進 4 個<b>不同</b>的箱子（每個箱子能放的球數不限），有幾種放法？",
      options: [
        { t: "$4^3=64$", truth: true, explain: "讓<b>球</b>去做選擇：第一顆球有 4 個箱子可挑，第二顆也是 4 個，第三顆還是 4 個。三個獨立的選擇相乘，$4\\times4\\times4=64$。" },
        { t: "$3^4=81$", common: true, explain: "底數和指數放反了——這是最常見的錯誤。檢查方法：<b>誰在做選擇，誰就當指數</b>。這裡每一顆球各做一次選擇，所以球數 3 是指數，可選的箱子數 4 是底數。" },
        { t: "$C^4_3=4$", explain: "$C^4_3$ 是「從 4 個箱子中挑 3 個出來」，它假設一個箱子最多放一顆球，而且不管哪顆球進哪個箱。這裡兩個假設都不成立。" },
        { t: "$P^4_3=24$", explain: "這是<b>每個箱子最多一顆球</b>時的答案（第一顆 4 選 1、第二顆剩 3、第三顆剩 2）。題目說「不限」，所以每次都還是 4 種選擇。" }
      ]
    },

    derive: {
      intro: "用滑桿改變<b>球數</b>與<b>箱子數</b>，看下面的選擇樹長出幾片葉子。第 4 步之後會和「不可重複」的情況並排比較。",
      tall: true,
      frames: [
        { cap: "一顆一顆處理。<b>第 1 顆球</b>站在那裡，面前有 $n$ 個箱子，所以有 $n$ 種選擇。", tex: "\\co{n}\\ \\text{種}" },
        { cap: "<b>第 2 顆球</b>登場。重點來了：第 1 顆球放過的箱子<b>還能再放</b>，所以第 2 顆球面前一樣是 $n$ 個箱子，還是 $n$ 種選擇。", tex: "\\co{n}\\times\\co{n}" },
        { cap: "每一顆球都是獨立的一次選擇，用<b>乘法原理</b>接起來。$k$ 顆球就乘 $k$ 個 $n$。", tex: "\\co{n}^{\\cb{k}}" },
        { cap: "為什麼是 $n^k$ 不是 $k^n$？看這棵樹：<b>每一層是一顆球</b>（所以有 $k$ 層），<b>每個節點分出 $n$ 條岔路</b>。層數當指數，岔路數當底數。一句話：<b>做選擇的當指數</b>。", tex: "\\text{層數}=\\cb{k}\\ \\text{（球）},\\quad \\text{岔路}=\\co{n}\\ \\text{（箱）}" },
        { cap: "對照組：如果規定<b>每個箱子最多一顆球</b>，那放過的箱子就不能再用。選擇數會一個一個遞減，變成<b>排列</b> $P^n_k$。", tex: "P^n_k=\\co{n}(\\co{n}-1)\\cdots(\\co{n}-\\cb{k}+1)" },
        { cap: "兩者的差別只有一句話：<b>「用過的還能不能再用」</b>。能 → $n^k$；不能 → $P^n_k$。開頭的密碼鎖是前者：$10^4=10000$ 組；若四格不可重複則是 $P^{10}_4=5040$ 組。", tex: "\\co{n}^{\\cb{k}}\\ \\text{vs}\\ P^{\\co{n}}_{\\cb{k}}" }
      ],
      hint: "樹太大時只畫前兩層，下面仍會算出正確的總數。",
      setup: function (ctx) {
        var svg = SK.svg(ctx.stage, 540, 420, "重複排列的選擇樹");
        var g = s("g", {}, svg);
        var st = { n: 4, k: 3 };
        var read = SK.h("div", { class: "readout" });
        ctx.extra.appendChild(read);
        var slN = SK.slider({ label: "箱子數 $n$", min: 2, max: 5, step: 1, value: st.n, onInput: function (v) { st.n = v; draw(); } });
        var slK = SK.slider({ label: "球數 $k$", min: 1, max: 4, step: 1, value: st.k, color: "blue", onInput: function (v) { st.k = v; draw(); } });
        ctx.sliders.appendChild(slN.el); ctx.sliders.appendChild(slK.el);

        function draw() {
          var f = ctx.frame, n = st.n, k = st.k;
          g.innerHTML = "";
          /* 上方：箱子 */
          var bw = Math.min(70, 380 / n);
          for (var i = 0; i < n; i++) {
            var bx = 270 - (n - 1) * bw / 2 + i * bw;
            s("rect", { x: bx - bw * .38, y: 28, width: bw * .76, height: 40, rx: 7, fill: "rgba(241,226,184,.3)", stroke: C.cocoa, "stroke-width": 1.3 }, g);
            SK.label(g, bx, 48, String(i + 1), { size: 13, color: C.soft });
          }
          SK.label(g, 270, 14, n + " 個不同的箱子", { size: 12, color: C.soft });

          /* 選擇樹：只畫前 2 層（避免爆炸） */
          var levels = Math.min(k, 2);
          var rootY = 110, dy = 84;
          var nodes = [[270, rootY]];
          s("circle", { cx: 270, cy: rootY, r: 9, fill: C.gold.f, stroke: C.cocoa, "stroke-width": 1.3 }, g);
          SK.label(g, 270, rootY - 24, "開始", { size: 11, color: C.soft });
          for (var L = 0; L < levels; L++) {
            var next = [], total = nodes.length * n, idx = 0;
            var span = 480, y2 = rootY + (L + 1) * dy;
            var showLimit = total <= 25;
            nodes.forEach(function (nd) {
              for (var c = 0; c < n; c++) {
                var x2 = 270 - span / 2 + (idx + .5) * (span / total);
                if (showLimit) {
                  s("line", { x1: nd[0], y1: nd[1] + 9, x2: x2, y2: y2 - 8, stroke: COL[c % COL.length].s, "stroke-width": 1.3, opacity: .75 }, g);
                  s("circle", { cx: x2, cy: y2, r: 7, fill: COL[c % COL.length].f, stroke: COL[c % COL.length].s, "stroke-width": 1.2 }, g);
                }
                next.push([x2, y2]); idx++;
              }
            });
            SK.label(g, 30, y2, "第 " + (L + 1) + " 顆", { size: 12, color: C.blue.s, anchor: "start" });
            SK.label(g, 510, y2, "×" + n, { size: 13, color: C.orange.s, anchor: "end" });
            if (!showLimit) SK.label(g, 270, y2, "…共 " + total + " 個分支…", { size: 12, color: C.soft });
            nodes = next;
          }
          if (k > 2) SK.label(g, 270, rootY + 3 * dy - 20, "（第 3 顆之後每個分支再各分出 " + n + " 條）", { size: 12, color: C.soft });

          /* 結果 */
          var total = pow(n, k), pk = k <= n ? perm(n, k) : 0;
          var yR = 350;
          s("rect", { x: 70, y: yR - 26, width: 180, height: 52, rx: 10, fill: C.orange.f, stroke: C.orange.s, "stroke-width": 1.5 }, g);
          SK.label(g, 160, yR - 8, "可重複", { size: 12, color: C.soft });
          SK.label(g, 160, yR + 12, n + "^" + k + " = " + total, { size: 17, color: C.orange.s, bold: true });
          if (f >= 4) {
            s("rect", { x: 290, y: yR - 26, width: 180, height: 52, rx: 10, fill: C.blue.f, stroke: C.blue.s, "stroke-width": 1.5 }, g);
            SK.label(g, 380, yR - 8, "不可重複", { size: 12, color: C.soft });
            SK.label(g, 380, yR + 12, k <= n ? ("P" + n + "," + k + " = " + pk) : "不可能（球比箱多）", { size: k <= n ? 17 : 13, color: C.blue.s, bold: true });
          }

          read.innerHTML = SK.tex("\\co{" + n + "}^{\\cb{" + k + "}}=" + total, true) +
            (f >= 4 && k <= n ? SK.tex("P^{" + n + "}_{" + k + "}=" + pk, true) : "");
        }
        return { show: draw };
      }
    },

    angles: [
      { title: "同一個式子，很多種故事", icon: "sparkle",
        html: "$n^k$ 出現的地方比你想的多，因為它們其實是同一個問題換了衣服：<br>・$k$ 個人各選一個社團（共 $n$ 個社團）→ $n^k$<br>・$k$ 題是非題的作答方式 → $2^k$<br>・$k$ 個元素的集合有幾個子集合 → 每個元素「在或不在」→ $2^k$<br>・$k$ 封信投進 $n$ 個信箱 → $n^k$<br>認出「有 $k$ 個獨立的選擇，每次都有 $n$ 個選項」這個骨架，題目換皮你也不會被騙。" },
      { title: "誰是球、誰是箱？", icon: "bulb",
        html: "「$k$ 封信投 $n$ 個信箱」是 $n^k$，但「$n$ 個信箱各收一封信」聽起來很像，卻是完全不同的問題。分辨的關鍵是問：<b>誰非做選擇不可？</b><br>每封信一定要去某一個信箱（信在選箱子）→ 信當指數。<br>如果題目反過來說「每個信箱都要恰好收到一封」，那就變成配對問題，答案是排列而不是次方。<br>讀題時先找出「一定要被安排的是誰」，式子就不會寫反。" }
    ],

    challenges: [
      { q: "開頭的四位數密碼鎖有幾組密碼？如果規定四格數字都不同，又有幾組？兩者差幾倍？",
        idea: "可重複：$10^4=10000$ 組。都不同：$P^{10}_4=10\\times9\\times8\\times7=5040$ 組。前者大約是後者的 2 倍——限制「不可重複」把可能性砍掉了將近一半。" },
      { q: "一個集合有 $n$ 個元素，它有幾個子集合？請用「每個元素做一次選擇」的角度想，不要背公式。", lv: "Explore",
        hint: "對每一個元素，你只要回答一個問題：它在不在這個子集合裡？",
        idea: "每個元素有「在」或「不在」兩種選擇，$n$ 個元素各選一次，共 $2^n$ 個子集合（包含空集合與自己）。只扣掉自身，就是 $2^n-1$ 個<b>真子集合</b>（空集合也是真子集合）；若連空集合也扣掉，才是 $2^n-2$ 個<b>非空真子集合</b>。<br>注意這裡是 $2^n$ 不是 $n^2$：做選擇的是元素，所以元素數當指數。" },
      { q: "「3 顆<b>不同</b>的球放進 4 個不同的箱子」是 $4^3=64$ 種。那如果 3 顆球<b>長得一模一樣</b>呢？答案還是 64 嗎？你覺得該怎麼數？", lv: "Wonder",
        hint: "球一樣的時候，「A 進 1 號、B 進 2 號」和「B 進 1 號、A 進 2 號」變成同一種結果了。",
        idea: "不再是 64，而且也不能單純除以 $3!$——因為三顆球全部進同一箱時沒有重複可扣，各進不同箱時才重複 $3!$ 次，重複的次數不一樣，不能一口氣除掉。<br>正確的數法是換個角度：只要決定「每個箱子各拿到幾顆」，也就是把 3 分給 4 個箱子，這叫<b>重複組合</b>，答案是 $H^4_3=C^{4+3-1}_3=20$。<br>這個題型在高中不是重點（課綱的停止線就畫在這裡），但它是個很好的提醒：<b>東西分不分得出來，會徹底改變數法。</b>" }
    ],

    where: {
      codes: [["D-10-3", "有系統的計數：加法原理、乘法原理，及其在可重複選取情境的應用"]],
      exam: "10 年級<b>共同必修</b>，學測數 A、數 B 都在範圍內。單獨命題不多，但它是機率題分母的常客（例如「擲 $k$ 次骰子的所有結果有 $6^k$ 種」），也常和排列組合放在同一題裡比較。最常見的失分就是把 $n^k$ 寫成 $k^n$。",
      stop: "會分辨「可不可以重複」、會判斷誰當指數就夠了。重複組合 $H^n_k$（相同物品分給不同的人）只需知道它存在、和這裡不同；錯排、非負整數解的個數等技巧題屬於競賽範圍。"
    }
  });
})();
