/* 首頁：Hero、學習原則、數學小鎮地圖（含年級篩選）、手機版清單、已開放單元卡片 */
(function () {
  var C = SK.C, s = SK.s, cat = window.CATALOG;
  SK.injectFilters();
  function inner(svg) { return svg.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, ""); }
  function ico(name, x, y, sc) { return '<g transform="translate(' + x + " " + y + ") scale(" + (sc || 1) + ')">' + inner(SK.icons[name]) + "</g>"; }

  var readyN = cat.units.filter(function (u) { return u.ready; }).length, soonN = cat.units.length - readyN;
  var ZH = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
  function zhNum(n) { return n <= 10 ? ZH[n] : n < 20 ? "十" + (n % 10 ? ZH[n % 10] : "") : ZH[Math.floor(n / 10)] + "十" + (n % 10 ? ZH[n % 10] : ""); }
  document.body.appendChild(SK.topbar("", false));
  var main = SK.h("main", { class: "wrap", id: "main" });
  document.body.appendChild(main);

  /* ---------- Hero ---------- */
  var heroArt =
    '<svg viewBox="0 0 460 380" role="img" aria-label="三道拱形色塊前，兩張用紙膠帶貼住的卡片：切成四塊的正方形與單位圓">' +
    '<defs><pattern id="spk" width="44" height="44" patternUnits="userSpaceOnUse"><circle cx="7" cy="9" r=".8" fill="#4A3F37" opacity=".28"/><circle cx="29" cy="20" r=".55" fill="#4A3F37" opacity=".25"/><circle cx="18" cy="37" r=".9" fill="#B8674A" opacity=".22"/><circle cx="38" cy="5" r=".5" fill="#647A58" opacity=".3"/></pattern></defs>' +
    // 大面積拱形垂直色塊
    '<path d="M36 372V120a62 62 0 0 1 124 0v252z" fill="#CFE0D3"/>' +
    '<path d="M170 372V70a64 64 0 0 1 128 0v302z" fill="#F3D5C3"/>' +
    '<path d="M308 372V150a58 58 0 0 1 116 0v222z" fill="#D3E0DE"/>' +
    '<rect width="460" height="380" fill="url(#spk)"/>' +
    '<path d="M20 372h420" stroke="#4A3F37" stroke-width="1.4" stroke-linecap="round"/>' +
    // 卡片一：(a+b)^2
    '<g transform="translate(62 128) rotate(-4)">' +
    '<rect width="178" height="170" rx="12" fill="#FDFBF6" stroke="#4A3F37" stroke-width="1.4"/>' +
    '<rect x="62" y="-10" width="56" height="18" fill="#F3C8B0" opacity=".85" transform="rotate(3 90 0)"/>' +
    '<g transform="translate(30 24)"><rect width="70" height="70" fill="rgba(243,195,168,.7)"/><rect x="70" width="44" height="70" fill="rgba(157,181,178,.55)"/><rect y="70" width="70" height="44" fill="rgba(157,181,178,.55)"/><rect x="70" y="70" width="44" height="44" fill="rgba(241,226,184,.95)"/>' +
    '<path d="M0 0h114v114H0zM70 0v114M0 70h114" fill="none" stroke="#4A3F37" stroke-width="1.3"/></g>' +
    '<text x="65" y="64" text-anchor="middle" class="m-label it" style="font-size:18px;fill:#B8674A">a²</text>' +
    '<text x="122" y="64" text-anchor="middle" class="m-label it" style="font-size:14px;fill:#4F7479">ab</text>' +
    '<text x="65" y="121" text-anchor="middle" class="m-label it" style="font-size:14px;fill:#4F7479">ab</text>' +
    '<text x="122" y="121" text-anchor="middle" class="m-label it" style="font-size:14px;fill:#9C8038">b²</text>' +
    '<text x="89" y="158" text-anchor="middle" style="font-family:var(--font-latin-hand);font-size:14px;fill:#6F645A">(a+b)²</text></g>' +
    // 卡片二：單位圓
    '<g transform="translate(238 176) rotate(3)">' +
    '<rect width="170" height="150" rx="12" fill="#FDFBF6" stroke="#4A3F37" stroke-width="1.4"/>' +
    '<rect x="58" y="-9" width="54" height="17" fill="#BCD0CD" opacity=".9" transform="rotate(-3 85 0)"/>' +
    '<g transform="translate(85 76)"><circle r="46" fill="rgba(241,226,184,.35)" stroke="#4A3F37" stroke-width="1.3"/>' +
    '<path d="M-58 0H58M0-58V58" stroke="#9C8C7C" stroke-width="1"/>' +
    '<path d="M0 0L35.2-29.6" stroke="#3A302A" stroke-width="1.6"/>' +
    '<path d="M0 0H35.2" stroke="#B8674A" stroke-width="3.6" stroke-linecap="round"/>' +
    '<path d="M35.2 0V-29.6" stroke="#4F7479" stroke-width="3.6" stroke-linecap="round"/>' +
    '<circle cx="35.2" cy="-29.6" r="4" fill="#F3C8B0" stroke="#4A3F37" stroke-width="1.2"/></g>' +
    '<text x="85" y="140" text-anchor="middle" style="font-family:var(--font-latin-hand);font-size:14px;fill:#6F645A">cos · sin</text></g>' +
    // 植物點綴
    '<g transform="translate(8 300) scale(1.1)">' + inner(SK.botanical(0)) + "</g>" +
    '<g transform="translate(392 296) scale(1.05)">' + inner(SK.botanical(1)) + "</g>" +
    '<g transform="translate(196 22) scale(.7)">' + inner(SK.botanical(2)) + "</g>" +
    ico("sparkle", 330, 104, 1.1) + ico("sparkle", 120, 40, .8) +
    '<circle cx="300" cy="46" r="3" fill="#C9D4BC" stroke="#4A3F37" stroke-width="1"/><circle cx="84" cy="94" r="2.2" fill="#F3C8B0"/><circle cx="440" cy="120" r="2.5" fill="#F1E2B8" stroke="#4A3F37" stroke-width="1"/>' +
    "</svg>";

  var hero = SK.h("section", { class: "home-hero" });
  hero.innerHTML =
    "<div>" +
    '<p class="kicker">' + SK.icon("sprig") + 'A gentle notebook for math</p>' +
    "<h1>圖解數學小鎮</h1>" +
    '<p class="en">See it, then say it.</p>' +
    '<p class="intro">每一條公式，都是一張圖先說出來的。在這裡，你會先動手拖一拖、猜一猜，看著圖形一步一步長出公式，再把它寫成符號。沒有計時，也沒有分數，猜錯了反而最有收穫。</p>' +
    '<div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:22px">' +
    '<a class="btn" href="#town">走進小鎮 ' + SK.icon("arrow") + "</a>" +
    '<a class="btn ghost" href="units/square-of-sum.html">從第一站開始</a></div>' +
    "</div>" +
    '<div class="hero-art">' + heroArt + "</div>";
  main.appendChild(hero);

  /* ---------- 學習原則 ---------- */
  function secTitle(zh, en) {
    return '<h2 class="sec-title">' + SK.icon("sparkle").replace("<svg", '<svg class="spark"') + zh + '<span class="en">/ ' + en + "</span></h2>";
  }
  var pr = SK.h("section", { class: "unit-sec", "aria-label": "這裡怎麼學" });
  var principles = [
    ["先看圖，再看符號", "處理數學時，大腦的視覺區域和符號區域會一起工作。所以每條公式都從一張能動的圖開始。", "leaf"],
    ["錯誤讓大腦長大", "「先猜猜看」不扣分。每個錯誤選項都有它的故事，那些常見的想法，正是最好的學習材料。", "heart"],
    ["沒有計時，沒有分數", "時間壓力會引發數學焦慮。在這裡，你有慢慢看、倒回去再看的權利。", "star"],
    ["一個問題，很多看法", "每條公式至少給兩種看法：圖形、代數、數字，或生活裡的情境。", "flower"],
    ["地板低，天花板高", "人人都能從第一個問題開始；想走多遠都可以，最後還有沒有標準答案的挑戰。", "sparkle"]
  ];
  pr.innerHTML = secTitle("這裡怎麼學", "How We Learn Here") + '<div class="principles">' +
    principles.map(function (p, i) {
      return '<div class="principle sk-frame"><div class="band"><span class="n">0' + (i + 1) + "</span>" + SK.botanical(i) + "</div>" +
        '<div class="body"><h3>' + p[0] + "</h3><p>" + p[1] + "</p></div></div>";
    }).join("") + "</div>" +
    '<p class="muted" style="font-size:.88rem;margin-top:10px">教學設計參考史丹佛大學 Jo Boaler 教授的數學心態研究（<i>Mathematical Mindsets</i>、youcubed）。</p>';
  main.appendChild(pr);

  /* ---------- 小鎮地圖 ---------- */
  var town = SK.h("section", { class: "unit-sec", id: "town", "aria-label": "數學小鎮地圖" });
  town.innerHTML = secTitle("數學小鎮地圖", "Math Town Map") +
    '<p class="muted" style="margin-top:-8px">每一區是一個大概念，每一棟小房子是一條公式。虛線小路代表「這條公式用到了那條公式的想法」。' + (soonN ? "有顏色的房子已經開放，虛線的還在施工中。" : "全部 " + readyN + " 棟小房子都已經開放，點一下就能走進去。") + '</p>';
  var filters = SK.h("div", { class: "filters", role: "group", "aria-label": "依年級篩選" });
  filters.innerHTML = '<span class="lbl">我在學：</span>';
  var trackKeys = ["all", "10", "A", "B", "J", "X"];
  var current = "all";
  trackKeys.forEach(function (k) {
    var tr = cat.tracks[k];
    var b = SK.h("button", { class: "chip " + (tr ? tr.cls : ""), type: "button", "aria-pressed": k === "all" ? "true" : "false", "data-k": k },
      (tr ? '<i class="dot-i"></i>' + tr.name : "全部"));
    b.addEventListener("click", function () { setFilter(k); });
    filters.appendChild(b);
  });
  town.appendChild(filters);

  /* 版面：三欄區塊，高度依房子數量自動決定 */
  var COLS = [["algebra", "trig"], ["series", "vector", "calc"], ["function", "prob"]];
  var layout = {}, colBottom = 0;
  COLS.forEach(function (col, ci) {
    var y = 20;
    col.forEach(function (id) {
      var n = cat.units.filter(function (u) { return u.region === id; }).length;
      layout[id] = [20 + ci * 330, y];
      y += 64 + Math.ceil(n / 3) * 100 + 20;
    });
    colBottom = Math.max(colBottom, y);
  });
  var GARDEN = 150, MAPH = colBottom + GARDEN;
  var W = 300, housePos = {};
  var mapBox = SK.h("div", { class: "town sk-frame" });
  var svg = SK.svg(mapBox, 1000, MAPH, "數學小鎮地圖");
  s("defs", {}, svg).innerHTML = '<pattern id="spk-map" width="46" height="46" patternUnits="userSpaceOnUse"><circle cx="8" cy="10" r=".9" fill="#4A3F37" opacity=".25"/><circle cx="31" cy="22" r=".6" fill="#4A3F37" opacity=".22"/><circle cx="19" cy="38" r="1" fill="#FDFBF6" opacity=".8"/><circle cx="40" cy="6" r=".6" fill="#4A3F37" opacity=".25"/></pattern>';
  var gRegion = s("g", {}, svg), gRoad = s("g", {}, svg), gHouse = s("g", {}, svg), gDeco = s("g", {}, svg);

  cat.regions.forEach(function (r) {
    var units = cat.units.filter(function (u) { return u.region === r.id; });
    var rows = Math.ceil(units.length / 3), h = 64 + rows * 100;
    var p = layout[r.id], x = p[0], y = p[1];
    s("rect", { x: x, y: y, width: W, height: h, rx: 24, fill: r.color }, gRegion);
    s("rect", { x: x, y: y, width: W, height: h, rx: 24, fill: "url(#spk-map)" }, gRegion);
    s("rect", { x: x, y: y, width: W, height: h, rx: 24, fill: "none", stroke: "#4A3F37", "stroke-width": 1.3, filter: "url(#sk-wobble)" }, gRegion);
    s("rect", { x: x + 16, y: y + 16, width: 112, height: 30, rx: 8, fill: "#FDFBF6", stroke: "#4A3F37", "stroke-width": 1, transform: "rotate(-2 " + (x + 72) + " " + (y + 31) + ")" }, gRegion);
    var t = s("text", { x: x + 26, y: y + 37, class: "hand", fill: C.ink, "font-size": 18, "font-weight": 700, "letter-spacing": "1.5" }, gRegion);
    t.textContent = r.name;
    var te = s("text", { x: x + W - 20, y: y + 36, "text-anchor": "end", fill: "#6F645A", "font-size": 14, style: "font-family:var(--font-latin-hand)" }, gRegion);
    te.textContent = r.en;
    units.forEach(function (u, i) {
      var row = Math.floor(i / 3), col = i % 3, inRow = Math.min(3, units.length - row * 3);
      var cx = x + W / 2 + (col - (inRow - 1) / 2) * 96, yb = y + 112 + row * 100;
      housePos[u.slug] = [cx, yb - 26];
      drawHouse(u, r, cx, yb);
    });
  });

  function drawHouse(u, r, cx, yb) {
    var ready = u.ready;
    var a = ready ? s("a", { href: "units/" + u.slug + ".html", class: "house", "data-slug": u.slug, "aria-label": u.title + "：" + u.sub }, gHouse)
      : s("g", { class: "house soon", "data-slug": u.slug, role: "img", "aria-label": u.title + "（施工中）" }, gHouse);
    var ink = "#4A3F37", dash = ready ? null : "3 3";
    s("rect", { x: cx - 22, y: yb - 38, width: 44, height: 38, rx: 3, fill: ready ? "#FDFBF6" : "none", stroke: ready ? ink : "#9C8C7C", "stroke-width": 1.3, "stroke-dasharray": dash }, a);
    s("path", { class: "roof", d: "M" + (cx - 29) + " " + (yb - 36) + " Q" + cx + " " + (yb - 70) + " " + (cx + 29) + " " + (yb - 36) + "Z", fill: ready ? "#FDFBF6" : "none", stroke: ready ? ink : "#9C8C7C", "stroke-width": 1.3, "stroke-linejoin": "round", "stroke-dasharray": dash }, a);
    s("path", { d: "M" + (cx - 6) + " " + yb + " V" + (yb - 13) + " a6 6 0 0 1 12 0 V" + yb, fill: ready ? "#F3C8B0" : "none", stroke: ready ? ink : "#9C8C7C", "stroke-width": 1.2 }, a);
    s("circle", { cx: cx + 12, cy: yb - 24, r: 4.2, fill: ready ? "#F1E2B8" : "none", stroke: ready ? ink : "#9C8C7C", "stroke-width": 1.1 }, a);
    if (ready) {
      var sp = s("g", { transform: "translate(" + (cx - 36) + " " + (yb - 22) + ") scale(.38)" }, a);
      sp.innerHTML = inner(SK.botanical(0));
    } else {
      s("path", { d: "M" + (cx + 26) + " " + yb + " v-20 M" + (cx + 18) + " " + (yb - 26) + " h16 v9 h-16z", fill: "#F1E2B8", stroke: "#9C8C7C", "stroke-width": 1.1 }, a);
    }
    var lines = u.title.length > 6 ? [u.title.slice(0, Math.ceil(u.title.length / 2)), u.title.slice(Math.ceil(u.title.length / 2))] : [u.title];
    lines.forEach(function (ln, k) {
      var t = s("text", { x: cx, y: yb + 18 + k * 17, "text-anchor": "middle", "font-size": 14, fill: ready ? C.ink : "#8E8173", "font-weight": ready ? 600 : 400 }, a);
      t.textContent = ln;
    });
    var title = s("title", {}, a); title.textContent = u.title + (ready ? "：" + u.sub : "（施工中）");
  }

  /* 小路 */
  /* 同一區內的小路一直顯示；跨區的小路平常隱藏，指到房子時才亮起，避免整張地圖被長虛線切得很亂 */
  var roads = [];
  cat.units.forEach(function (u) {
    (u.links || []).forEach(function (to) {
      var p = housePos[u.slug], q = housePos[to];
      if (!p || !q) return;
      var cross = cat.get(to).region !== u.region;
      var mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, dx = q[0] - p[0], dy = q[1] - p[1];
      var bend = cross ? .14 : (Math.abs(dy) < 1 ? 0 : .12), cx = mx - dy * bend, cy = my + dx * bend;
      var path = s("path", { class: "road" + (cross ? " cross" : ""), d: "M" + p[0] + " " + p[1] + " Q" + cx + " " + cy + " " + q[0] + " " + q[1], fill: "none", stroke: "#4A3F37", "stroke-width": 1.5, "stroke-dasharray": "1.5 6", "stroke-linecap": "round" }, gRoad);
      roads.push({ el: path, a: u.slug, b: to, cross: cross });
    });
  });
  function lightUp(slug) {
    var lit = {};
    lit[slug] = true;
    roads.forEach(function (r) {
      var on = !!slug && (r.a === slug || r.b === slug);
      r.el.classList.toggle("hl", on);
      if (on) { lit[r.a] = true; lit[r.b] = true; }
    });
    svg.classList.toggle("focusing", !!slug);
    Array.prototype.forEach.call(gHouse.querySelectorAll(".house"), function (h) { h.classList.toggle("lit", !!slug && !!lit[h.getAttribute("data-slug")]); });
  }
  Array.prototype.forEach.call(gHouse.querySelectorAll(".house"), function (h) {
    var slug = h.getAttribute("data-slug");
    h.addEventListener("mouseenter", function () { lightUp(slug); });
    h.addEventListener("focus", function () { lightUp(slug); });
    h.addEventListener("mouseleave", function () { lightUp(null); });
    h.addEventListener("blur", function () { lightUp(null); });
  });
  var allRoads = SK.h("button", { class: "chip all-roads", type: "button", "aria-pressed": "false", style: "margin-left:auto" }, "顯示全部小路");
  allRoads.addEventListener("click", function () {
    var on = allRoads.getAttribute("aria-pressed") !== "true";
    allRoads.setAttribute("aria-pressed", on ? "true" : "false");
    mapBox.classList.toggle("show-all", on);
  });
  filters.appendChild(allRoads);

  /* 右下角的空地：池塘、樹與告示牌 */
  /* 地圖最下方的小花園：一排拱形色塊與植物 */
  var gy = MAPH - 12, arches = [[60, 90, 70, "#E3ECEA"], [170, 110, 96, "#FAE8DD"], [300, 80, 60, "#E8EDE1"], [620, 90, 78, "#F8F1DC"], [740, 110, 100, "#E3ECEA"], [870, 84, 66, "#FAE8DD"]];
  gDeco.innerHTML = arches.map(function (a) { return '<path d="M' + a[0] + " " + gy + "V" + (gy - a[2]) + "a" + a[1] / 2 + " " + a[1] / 2 + " 0 0 1 " + a[1] + " 0V" + gy + 'z" fill="' + a[3] + '"/>'; }).join("") +
    '<rect x="40" y="' + (gy - 150) + '" width="920" height="150" fill="url(#spk-map)" opacity=".7"/>' +
    '<g transform="translate(80 ' + (gy - 76) + ') scale(1.2)">' + inner(SK.botanical(0)) + "</g>" +
    '<g transform="translate(196 ' + (gy - 104) + ') scale(1.3)">' + inner(SK.botanical(1)) + "</g>" +
    '<g transform="translate(314 ' + (gy - 66) + ') scale(1)">' + inner(SK.botanical(3)) + "</g>" +
    '<g transform="translate(640 ' + (gy - 84) + ') scale(1.1)">' + inner(SK.botanical(2)) + "</g>" +
    '<g transform="translate(766 ' + (gy - 108) + ') scale(1.3)">' + inner(SK.botanical(0)) + "</g>" +
    '<g transform="translate(884 ' + (gy - 72) + ') scale(1.1)">' + inner(SK.botanical(1)) + "</g>" +
    '<g transform="translate(425 ' + (gy - 70) + ') rotate(-2)"><rect width="150" height="34" rx="8" fill="#FDFBF6" stroke="#4A3F37" stroke-width="1.2"/>' +
    '<text x="75" y="23" text-anchor="middle" style="font-family:var(--font-latin-hand);font-size:16px;fill:#4A3F37">see it, say it</text></g>' +
    '<path d="M40 ' + gy + 'H960" stroke="#4A3F37" stroke-width="1.3" stroke-linecap="round"/>' +
    ico("sparkle", 590, gy - 120, .9) + ico("sparkle", 400, gy - 130, .7);

  town.appendChild(mapBox);
  town.insertAdjacentHTML("beforeend", '<div class="town-legend"><span>' + SK.icon("house").replace("<svg", '<svg style="width:18px;height:18px"') + "有顏色的房子：已開放</span>" +
    (soonN ? '<span><svg width="18" height="18" viewBox="0 0 18 18"><rect x="3" y="6" width="12" height="10" fill="none" stroke="#9C8C7C" stroke-dasharray="2 2"/></svg>虛線房子：施工中</span>' : "") +
    '<span><svg width="30" height="10" viewBox="0 0 30 10"><path d="M2 5h26" stroke="#4A3F37" stroke-width="1.5" stroke-dasharray="1.5 5" stroke-linecap="round"/></svg>小路：想法之間的連結</span>' +
    '<span>' + SK.icon("sparkle").replace("<svg", '<svg style="width:16px;height:16px"') + "滑鼠移到房子上，看它通往哪些其他區域</span></div>");

  /* ---------- 手機版：直式小鎮地圖（點一下選取、再點一下進入） ---------- */
  var MW = 380, mBox = SK.h("div", { class: "town-m sk-frame" });
  town.insertAdjacentHTML("beforeend", '<p class="muted m-hint">' + SK.icon("sparkle").replace("<svg", '<svg style="width:16px;height:16px;vertical-align:-3px"') + " 點一下房子，看它通往哪裡；再點一下就走進去。</p>");
  var mPos = {}, mRegions = [], yCur = 14;
  cat.regions.forEach(function (r) {
    var units = cat.units.filter(function (u) { return u.region === r.id; });
    var rows = Math.ceil(units.length / 3), h = 70 + rows * 104;
    mRegions.push({ r: r, units: units, y: yCur, h: h });
    yCur += h + 38;
  });
  var MH = yCur + 90;
  var msvg = SK.svg(mBox, MW, MH, "數學小鎮直式地圖");
  s("defs", {}, msvg).innerHTML = '<pattern id="spk-m" width="46" height="46" patternUnits="userSpaceOnUse"><circle cx="8" cy="10" r=".9" fill="#4A3F37" opacity=".25"/><circle cx="31" cy="22" r=".6" fill="#4A3F37" opacity=".22"/><circle cx="19" cy="38" r="1" fill="#FDFBF6" opacity=".8"/><circle cx="40" cy="6" r=".6" fill="#4A3F37" opacity=".25"/></pattern>';
  var mStreet = s("g", {}, msvg), mRegionG = s("g", {}, msvg), mRoadG = s("g", {}, msvg), mHouseG = s("g", {}, msvg);
  var mRoads = [];
  mRegions.forEach(function (R, idx) {
    var r = R.r, x = 12, y = R.y, w = MW - 24, h = R.h;
    s("rect", { x: x, y: y, width: w, height: h, rx: 24, fill: r.color }, mRegionG);
    s("rect", { x: x, y: y, width: w, height: h, rx: 24, fill: "url(#spk-m)" }, mRegionG);
    s("rect", { x: x, y: y, width: w, height: h, rx: 24, fill: "none", stroke: "#4A3F37", "stroke-width": 1.3, filter: "url(#sk-wobble)" }, mRegionG);
    s("rect", { x: x + 14, y: y + 14, width: 118, height: 32, rx: 8, fill: "#FDFBF6", stroke: "#4A3F37", "stroke-width": 1, transform: "rotate(-2 " + (x + 73) + " " + (y + 30) + ")" }, mRegionG);
    var t = s("text", { x: x + 26, y: y + 36, class: "hand", fill: C.ink, "font-size": 19, "font-weight": 700, "letter-spacing": "1.5" }, mRegionG);
    t.textContent = r.name;
    var te = s("text", { x: x + w - 18, y: y + 35, "text-anchor": "end", fill: "#6F645A", "font-size": 14, style: "font-family:var(--font-latin-hand)" }, mRegionG);
    te.textContent = r.en;
    R.units.forEach(function (u, i) {
      var row = Math.floor(i / 3), col = i % 3, inRow = Math.min(3, R.units.length - row * 3);
      var cx = MW / 2 + (col - (inRow - 1) / 2) * 112, yb = y + 122 + row * 104;
      mPos[u.slug] = [cx, yb - 24];
      drawHouseM(u, r, cx, yb);
    });
    // 地區之間的小街道與植物
    if (idx < mRegions.length - 1) {
      var y0 = y + h, y1 = y0 + 38, side = idx % 2 ? 1 : -1;
      s("path", { d: "M" + (MW / 2) + " " + y0 + " C" + (MW / 2 + 40 * side) + " " + (y0 + 14) + " " + (MW / 2 - 40 * side) + " " + (y1 - 14) + " " + (MW / 2) + " " + y1, fill: "none", stroke: "#9C8C7C", "stroke-width": 1.6, "stroke-dasharray": "2 6", "stroke-linecap": "round" }, mStreet);
      var sp = s("g", { transform: "translate(" + (side < 0 ? 300 : 30) + " " + (y0 - 6) + ") scale(.8)" }, mStreet);
      sp.innerHTML = inner(SK.botanical(idx));
    }
  });
  // 地圖最底下的小空地
  mStreet.insertAdjacentHTML("beforeend",
    '<path d="M60 ' + (MH - 8) + 'V' + (MH - 58) + 'a36 36 0 0 1 72 0V' + (MH - 8) + 'z" fill="#E3ECEA"/><path d="M146 ' + (MH - 8) + 'V' + (MH - 72) + 'a42 42 0 0 1 84 0V' + (MH - 8) + 'z" fill="#FAE8DD"/><path d="M244 ' + (MH - 8) + 'V' + (MH - 50) + 'a34 34 0 0 1 68 0V' + (MH - 8) + 'z" fill="#E8EDE1"/>' +
    '<g transform="translate(72 ' + (MH - 70) + ') scale(.8)">' + inner(SK.botanical(0)) + '</g><g transform="translate(166 ' + (MH - 84) + ') scale(.9)">' + inner(SK.botanical(1)) + '</g><g transform="translate(254 ' + (MH - 62) + ') scale(.8)">' + inner(SK.botanical(3)) + "</g>" +
    '<path d="M40 ' + (MH - 8) + 'H340" stroke="#4A3F37" stroke-width="1.3" stroke-linecap="round"/>');

  function drawHouseM(u, r, cx, yb) {
    var ready = u.ready, ink = ready ? "#4A3F37" : "#9C8C7C", dash = ready ? null : "3 3";
    var gH = s("g", { class: "house m-house" + (ready ? "" : " soon"), "data-slug": u.slug, tabindex: 0, role: "button", "aria-label": u.title + "：" + u.sub }, mHouseG);
    s("rect", { x: cx - 48, y: yb - 74, width: 96, height: 124, fill: "transparent" }, gH);
    s("rect", { x: cx - 24, y: yb - 40, width: 48, height: 40, rx: 3, fill: ready ? "#FDFBF6" : "none", stroke: ink, "stroke-width": 1.3, "stroke-dasharray": dash }, gH);
    s("path", { class: "roof", d: "M" + (cx - 31) + " " + (yb - 38) + " Q" + cx + " " + (yb - 74) + " " + (cx + 31) + " " + (yb - 38) + "Z", fill: ready ? "#FDFBF6" : "none", stroke: ink, "stroke-width": 1.3, "stroke-linejoin": "round", "stroke-dasharray": dash }, gH);
    s("path", { d: "M" + (cx - 6) + " " + yb + " V" + (yb - 14) + " a6 6 0 0 1 12 0 V" + yb, fill: ready ? "#F3C8B0" : "none", stroke: ink, "stroke-width": 1.2 }, gH);
    s("circle", { cx: cx + 13, cy: yb - 26, r: 4.4, fill: ready ? "#F1E2B8" : "none", stroke: ink, "stroke-width": 1.1 }, gH);
    var lines = u.title.length > 5 ? [u.title.slice(0, Math.ceil(u.title.length / 2)), u.title.slice(Math.ceil(u.title.length / 2))] : [u.title];
    lines.forEach(function (ln, k) {
      var tt = s("text", { x: cx, y: yb + 19 + k * 18, "text-anchor": "middle", "font-size": 15, fill: ready ? C.ink : "#8E8173", "font-weight": 600 }, gH);
      tt.textContent = ln;
    });
  }

  // 小路：區內常駐；跨區的從畫面兩側繞過去，選取時才出現
  cat.units.forEach(function (u) {
    (u.links || []).forEach(function (to) {
      var p = mPos[u.slug], q = mPos[to];
      if (!p || !q) return;
      var cross = cat.get(to).region !== u.region, d;
      if (cross) {
        var sideX = (p[0] + q[0]) / 2 < MW / 2 ? 4 : MW - 4;
        d = "M" + p[0] + " " + p[1] + " C" + sideX + " " + p[1] + " " + sideX + " " + q[1] + " " + q[0] + " " + q[1];
      } else {
        var mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, dx = q[0] - p[0], dy = q[1] - p[1], bend = Math.abs(dy) < 1 ? 0 : .12;
        d = "M" + p[0] + " " + p[1] + " Q" + (mx - dy * bend) + " " + (my + dx * bend) + " " + q[0] + " " + q[1];
      }
      var path = s("path", { class: "road" + (cross ? " cross" : ""), d: d, fill: "none", stroke: "#4A3F37", "stroke-width": 1.5, "stroke-dasharray": "1.5 6", "stroke-linecap": "round" }, mRoadG);
      var rr = { el: path, a: u.slug, b: to, cross: cross };
      mRoads.push(rr); roads.push(rr);
    });
  });

  // 選取卡片
  var mCard = SK.h("div", { class: "m-card", role: "dialog", "aria-live": "polite", hidden: "" });
  document.body.appendChild(mCard);
  var mSel = null;
  function mSelect(slug) {
    mSel = slug;
    var lit = {};
    if (slug) lit[slug] = true;
    mRoads.forEach(function (r) {
      var on = !!slug && (r.a === slug || r.b === slug);
      r.el.classList.toggle("hl", on);
      if (on) { lit[r.a] = true; lit[r.b] = true; }
    });
    msvg.classList.toggle("focusing", !!slug);
    Array.prototype.forEach.call(mHouseG.querySelectorAll(".house"), function (h) {
      h.classList.toggle("lit", !!slug && !!lit[h.getAttribute("data-slug")]);
      h.classList.toggle("sel", h.getAttribute("data-slug") === slug);
    });
    if (!slug) { mCard.hidden = true; return; }
    var u = cat.get(slug), reg = cat.region(u.region);
    var nb = neighbors(slug);
    mCard.innerHTML = '<button class="m-close" type="button" aria-label="關閉">×</button>' +
      '<span class="m-reg" style="background:' + reg.color + '">' + reg.name + "</span>" +
      "<h3>" + u.title + "</h3><p>" + u.sub + "</p>" +
      (nb.length ? '<div class="m-roads"><span class="lbl">' + SK.icon("path") + "小路</span>" + nb.map(function (to) {
        var t = cat.get(to), cross = t.region !== u.region;
        return '<button class="road-chip' + (cross ? " cross" : "") + '" type="button" data-go="' + to + '">' + t.title + (cross ? "<small>↗ " + cat.region(t.region).name + "</small>" : "") + "</button>";
      }).join("") + "</div>" : "") +
      (u.ready ? '<a class="btn small" href="units/' + slug + '.html">走進去 ' + SK.icon("arrow") + "</a>" : '<span class="muted">施工中</span>');
    mCard.hidden = false;
    mCard.querySelector(".m-close").onclick = function () { mSelect(null); };
    Array.prototype.forEach.call(mCard.querySelectorAll(".road-chip"), function (b) {
      b.onclick = function () {
        var to = b.getAttribute("data-go"), hEl = mHouseG.querySelector('[data-slug="' + to + '"]');
        mSelect(to);
        if (hEl) hEl.scrollIntoView({ behavior: "smooth", block: "center" });
      };
    });
  }
  Array.prototype.forEach.call(mHouseG.querySelectorAll(".house"), function (h) {
    var slug = h.getAttribute("data-slug");
    function act() {
      if (mSel === slug && cat.get(slug).ready) location.href = "units/" + slug + ".html";
      else mSelect(slug);
    }
    h.addEventListener("click", function (ev) { ev.stopPropagation(); act(); });
    h.addEventListener("keydown", function (ev) { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); act(); } });
  });
  msvg.addEventListener("click", function () { mSelect(null); });
  town.appendChild(mBox);

  /* 手機版清單（收在「用清單瀏覽」裡） */
  var list = SK.h("div", { class: "town-list" });
  function neighbors(slug) {
    var out = (cat.get(slug).links || []).slice();
    cat.units.forEach(function (u) { if ((u.links || []).indexOf(slug) >= 0 && out.indexOf(u.slug) < 0) out.push(u.slug); });
    return out;
  }
  cat.regions.forEach(function (r) {
    var card = SK.h("div", { class: "region-card sk-frame", id: "m-region-" + r.id });
    card.innerHTML = '<h3 style="background-color:' + r.color + '">' + r.name + ' <span class="latin-hand" style="font-size:.85rem;color:#6F645A;font-weight:400">' + r.en + "</span></h3>";
    cat.units.filter(function (u) { return u.region === r.id; }).forEach(function (u) {
      var row = SK.h("div", { class: "unit-row", id: "m-" + u.slug, "data-slug": u.slug });
      var item = SK.h(u.ready ? "a" : "div", u.ready ? { class: "unit-item", href: "units/" + u.slug + ".html" } : { class: "unit-item soon" },
        SK.icon("house").replace("<svg", '<svg style="width:26px;height:26px;flex:none' + (u.ready ? "" : ";opacity:.4") + '"') +
        '<span><span class="t">' + u.title + (u.ready ? "" : "（施工中）") + '</span><span class="s">' + u.sub + "</span></span>" +
        (u.ready ? '<span class="go">' + SK.icon("arrow") + "</span>" : ""));
      row.appendChild(item);
      var nb = neighbors(u.slug);
      if (nb.length) {
        var roadsEl = SK.h("div", { class: "m-roads" }, '<span class="lbl">' + SK.icon("path") + "小路</span>");
        nb.forEach(function (to) {
          var t = cat.get(to), cross = t.region !== u.region;
          var chip = SK.h("button", { class: "road-chip" + (cross ? " cross" : ""), type: "button", "data-go": to, "aria-label": "跳到「" + t.title + "」" },
            t.title + (cross ? '<small>↗ ' + cat.region(t.region).name + "</small>" : ""));
          chip.addEventListener("click", function () {
            var target = document.getElementById("m-" + to);
            if (!target) return;
            target.scrollIntoView({ behavior: "smooth", block: "center" });
            target.classList.remove("flash"); void target.offsetWidth; target.classList.add("flash");
          });
          roadsEl.appendChild(chip);
        });
        row.appendChild(roadsEl);
      }
      card.appendChild(row);
    });
    list.appendChild(card);
  });
  var listWrap = SK.h("details", { class: "m-list" }, "<summary>用清單瀏覽（含每棟房子的小路）</summary>");
  listWrap.appendChild(list);
  town.appendChild(listWrap);
  main.appendChild(town);

  /* ---------- 已開放的單元 ---------- */
  var feat = SK.h("section", { class: "unit-sec", "aria-label": "已開放的單元" });
  feat.innerHTML = secTitle("已開放的" + zhNum(readyN) + "棟小房子", "Open Houses") +
    '<p class="muted" style="margin-top:-8px">依建議順序排列：高一 → 11 年級（數 A／數 B）→ 數甲。每一棟都有六站：好奇入口、先猜猜看、看圖推導、換個角度看、天花板挑戰、地圖定位。</p>';
  var grid = SK.h("div", { class: "featured" });
  cat.order.forEach(function (slug, i) {
    var u = cat.get(slug), r = cat.region(u.region);
    var a = SK.h("a", { class: "f-card sk-frame", href: "units/" + slug + ".html", "data-slug": slug });
    a.innerHTML = '<div class="thumb" style="background-color:' + r.color + '"><div class="fx" style="padding:0 12px;font-size:1.02rem">' + SK.tex(u.tex, true) + '</div><span class="leafmark" aria-hidden="true">' + SK.botanical(i) + "</span></div>" +
      '<span class="no">No.' + (i + 1 < 10 ? "0" : "") + (i + 1) + " · " + r.name + "</span>" +
      "<h3>" + u.title + "</h3>" +
      '<span class="muted" style="font-size:.9rem">' + u.sub + "</span>" +
      '<div class="meta">' + u.tracks.map(function (t) { var tr = cat.tracks[t]; return '<span class="chip ' + tr.cls + '"><i class="dot-i"></i>' + tr.name + "</span>"; }).join("") +
      u.codes.map(function (c) { return '<span class="code">' + c + "</span>"; }).join("") + "</div>";
    grid.appendChild(a);
  });
  feat.appendChild(grid);
  main.appendChild(feat);

  /* ---------- 給老師 ---------- */
  var tch = SK.h("section", { class: "unit-sec sk-card sk-frame", "aria-label": "給老師" });
  tch.innerHTML = '<div class="two-col"><div>' + secTitle("給老師：上課模式", "For Teachers") +
    '<p>每個單元右上角都有「上課模式」按鈕。打開後會全螢幕、字體放大，一次只顯示一段，用鍵盤 <kbd>←</kbd> <kbd>→</kbd>（或簡報筆）逐步推進：先走完推導的每一步，再進入下一段。按 <kbd>Esc</kbd> 離開。</p>' +
    '<p class="muted" style="font-size:.95rem">建議用法：投影「先猜猜看」時，先讓全班舉手或討論，再點選項揭曉；每個錯誤選項的解說都可以拿來討論「為什麼這個想法很合理」。</p></div>' +
    '<div style="display:flex;justify-content:center">' + SK.note("「我還不會」只是還沒而已。", "Not yet ≠ never.") + "</div></div>";
  main.appendChild(tch);
  document.body.appendChild(SK.footer());

  /* ---------- 篩選 ---------- */
  function match(slug) {
    if (current === "all") return true;
    return cat.get(slug).tracks.indexOf(current) >= 0;
  }
  function setFilter(k) {
    current = k;
    Array.prototype.forEach.call(filters.querySelectorAll("button"), function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-k") === k ? "true" : "false"); });
    Array.prototype.forEach.call(document.querySelectorAll("[data-slug]"), function (el) {
      el.classList.toggle("dim", !match(el.getAttribute("data-slug")));
    });
    roads.forEach(function (r) { r.el.classList.toggle("dim", !(match(r.a) && match(r.b))); });
    try { localStorage.setItem("sk-track", k); } catch (e) {}
  }
  try { var saved = localStorage.getItem("sk-track"); if (saved && trackKeys.indexOf(saved) >= 0) setFilter(saved); } catch (e) {}
})();
