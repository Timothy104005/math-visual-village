/* =========================================================
   圖解數學小鎮 — 共用元件庫 (SK)
   所有單元共用：數學排版、SVG 工具、滑桿、拖曳、步驟播放器、
   選擇題預測、上課模式，以及把單元設定組成六步頁面的 mountUnit。
   ========================================================= */
(function () {
  "use strict";
  var SK = (window.SK = {});
  var NS = "http://www.w3.org/2000/svg";

  /* ---------- 顏色 ---------- */
  SK.C = {
    orange: { s: "#B8674A", f: "rgba(243,195,168,.62)" },   // 蜜桃
    blue: { s: "#4F7479", f: "rgba(157,181,178,.5)" },      // 灰藍綠
    green: { s: "#647A58", f: "rgba(190,205,176,.62)" },    // 鼠尾草
    pink: { s: "#A85E66", f: "rgba(233,193,191,.62)" },     // 乾燥玫瑰
    gold: { s: "#9C8038", f: "rgba(241,226,184,.85)" },     // 奶油黃
    purple: { s: "#7A6889", f: "rgba(210,198,218,.62)" },   // 灰紫
    mint: { s: "#4F8270", f: "rgba(207,224,211,.75)" },     // 淡薄荷
    ink: "#3A302A", soft: "#6F645A", line: "#9C8C7C", paper: "#FDFBF6", cocoa: "#4A3F37"
  };


  /* ---------- KaTeX：\co{} \cb{} … 是與圖形同色的公式片段 ---------- */
  var MACROS = {
    "\\co": "\\textcolor{B8674A}{#1}",
    "\\cb": "\\textcolor{4F7479}{#1}",
    "\\cg": "\\textcolor{647A58}{#1}",
    "\\cp": "\\textcolor{A85E66}{#1}",
    "\\cy": "\\textcolor{9C8038}{#1}",
    "\\cv": "\\textcolor{7A6889}{#1}"
  };
  SK.tex = function (src, display) {
    if (!window.katex) return src;
    return katex.renderToString(src, {
      displayMode: !!display, throwOnError: false, strict: false,
      macros: Object.assign({}, MACROS)
    });
  };
  /* 把字串中的 $$…$$ 與 $…$ 轉成 KaTeX HTML */
  SK.md = function (str) {
    if (str == null) return "";
    return String(str)
      .replace(/`([^`]+)`/g, '<span class="code">$1</span>')
      .replace(/\$\$([\s\S]+?)\$\$/g, function (m, t) { return SK.tex(t, true); })
      .replace(/\$([^$\n]+?)\$/g, function (m, t) { return SK.tex(t, false); });
  };

  /* ---------- DOM 小工具 ---------- */
  SK.h = function (tag, attrs, html) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === "class") e.className = attrs[k];
      else if (k.slice(0, 2) === "on") e.addEventListener(k.slice(2), attrs[k]);
      else e.setAttribute(k, attrs[k]);
    }
    if (html != null) e.innerHTML = html;
    return e;
  };
  SK.s = function (tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    if (attrs) SK.attr(e, attrs);
    if (parent) parent.appendChild(e);
    return e;
  };
  SK.attr = function (e, attrs) {
    for (var k in attrs) {
      if (k === "text") e.textContent = attrs[k];
      else if (attrs[k] == null) e.removeAttribute(k);
      else e.setAttribute(k, attrs[k]);
    }
    return e;
  };
  SK.svg = function (parent, w, h, label) {
    var s = SK.s("svg", { viewBox: "0 0 " + w + " " + h, role: "img", "aria-label": label || "數學圖形" }, parent);
    return s;
  };
  /* SVG 內的文字標籤；opts.it = 數學斜體 */
  SK.label = function (g, x, y, text, opts) {
    opts = opts || {};
    var t = SK.s("text", {
      x: x, y: y, "text-anchor": opts.anchor || "middle", "dominant-baseline": "middle",
      class: "m-label" + (opts.it ? " it" : ""), fill: opts.color || null,
      "font-size": opts.size || null, "font-weight": opts.bold ? 700 : null
    }, g);
    t.textContent = text;
    if (opts.color) t.style.fill = opts.color;
    if (opts.size) t.style.fontSize = opts.size + "px";
    return t;
  };
  SK.fmt = function (x, d) {
    d = d == null ? 2 : d;
    var v = Math.abs(x) < 1e-9 ? 0 : x;
    var s = v.toFixed(d);
    if (d > 0) s = s.replace(/\.?0+$/, "");
    return s === "-0" ? "0" : s.replace("-", "−");
  };
  SK.clamp = function (x, a, b) { return Math.max(a, Math.min(b, x)); };
  SK.deg = function (r) { return r * 180 / Math.PI; };
  SK.rad = function (d) { return d * Math.PI / 180; };

  /* 直角記號 */
  SK.rightMark = function (g, x, y, ux, uy, vx, vy, size, color) {
    size = size || 12;
    var p1 = [x + ux * size, y + uy * size], p2 = [x + ux * size + vx * size, y + uy * size + vy * size], p3 = [x + vx * size, y + vy * size];
    return SK.s("path", { d: "M" + p1 + " L" + p2 + " L" + p3, fill: "none", stroke: color || SK.C.soft, "stroke-width": 1.5 }, g);
  };
  /* 角度弧 */
  SK.arcPath = function (cx, cy, r, a0, a1) {
    // 角度以數學方向（逆時針、y 向上）傳入，SVG y 向下所以取負
    var x0 = cx + r * Math.cos(a0), y0 = cy - r * Math.sin(a0);
    var x1 = cx + r * Math.cos(a1), y1 = cy - r * Math.sin(a1);
    var large = Math.abs(a1 - a0) > Math.PI ? 1 : 0;
    var sweep = a1 > a0 ? 0 : 1;
    return "M" + x0 + " " + y0 + " A" + r + " " + r + " 0 " + large + " " + sweep + " " + x1 + " " + y1;
  };
  /* 花括號（用來標長度） */
  SK.brace = function (g, x1, y1, x2, y2, depth, color) {
    var dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
    var ux = dx / L, uy = dy / L, nx = -uy * depth, ny = ux * depth;
    var mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    var d = "M" + x1 + " " + y1 +
      " Q" + (x1 + nx) + " " + (y1 + ny) + " " + (x1 + nx + ux * L * .12) + " " + (y1 + ny + uy * L * .12) +
      " L" + (mx + nx - ux * 8) + " " + (my + ny - uy * 8) +
      " Q" + (mx + nx) + " " + (my + ny) + " " + (mx + nx * 1.7) + " " + (my + ny * 1.7) +
      " Q" + (mx + nx) + " " + (my + ny) + " " + (mx + nx + ux * 8) + " " + (my + ny + uy * 8) +
      " L" + (x2 + nx - ux * L * .12) + " " + (y2 + ny - uy * L * .12) +
      " Q" + (x2 + nx) + " " + (y2 + ny) + " " + x2 + " " + y2;
    return SK.s("path", { d: d, fill: "none", stroke: color || SK.C.soft, "stroke-width": 1.6, "stroke-linecap": "round" }, g);
  };
  /* 箭頭線（向量） */
  var arrowId = 0;
  SK.arrow = function (g, x1, y1, x2, y2, color, width) {
    var grp = SK.s("g", {}, g);
    var line = SK.s("line", { stroke: color, "stroke-width": width || 3.5, "stroke-linecap": "round" }, grp);
    var head = SK.s("path", { fill: color }, grp);
    grp.update = function (a, b, c, d) {
      var L = Math.hypot(c - a, d - b) || 1, ux = (c - a) / L, uy = (d - b) / L, hs = Math.min(14, L * .45);
      SK.attr(line, { x1: a, y1: b, x2: c - ux * hs * .7, y2: d - uy * hs * .7 });
      var bx = c - ux * hs, by = d - uy * hs;
      head.setAttribute("d", "M" + c + " " + d + " L" + (bx - uy * hs * .5) + " " + (by + ux * hs * .5) + " L" + (bx + uy * hs * .5) + " " + (by - ux * hs * .5) + "Z");
    };
    grp.update(x1, y1, x2, y2);
    return grp;
  };

  /* ---------- 線性小圖示：深棕細線 + 錯位的淡彩填色（絲網印刷套色偏移感） ---------- */
  var INK = "#4A3F37";
  function ic(fillPath, linePath, fill, extra) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke-linecap="round" stroke-linejoin="round">' +
      (fillPath ? '<path d="' + fillPath + '" fill="' + fill + '" stroke="none" transform="translate(1.2 1.1)"/>' : "") +
      '<path d="' + linePath + '" fill="none" stroke="' + INK + '" stroke-width="1.35"/>' + (extra || "") + "</svg>";
  }
  var P_TWINKLE = "M12 3c.6 4.6 2.6 7 7.5 9-4.9 1.4-6.9 3.6-7.5 9-.7-5.4-2.7-7.6-7.5-9 4.8-2 6.8-4.4 7.5-9z";
  var P_STAR = "M12 3.4l2.5 5.3 5.6.7-4.1 3.9 1.1 5.6L12 16.2l-5.1 2.7 1.1-5.6-4.1-3.9 5.6-.7z";
  var P_HEART = "M12 19.5c-5.6-4-8.3-7-8.1-10.4.2-2.4 2-3.9 4-3.8 1.8.1 3.2 1.1 4.1 2.6.9-1.5 2.3-2.5 4.1-2.6 2-.1 3.8 1.4 4 3.8.2 3.4-2.5 6.4-8.1 10.4z";
  var P_LEAF = "M4.5 19.5C5.5 10 10.5 5 19.5 4.5c-.6 9-5.6 14.2-15 15z";
  SK.icons = {
    sparkle: ic(P_TWINKLE, P_TWINKLE, "#F1E2B8"),
    star: ic(P_STAR, P_STAR, "#F1E2B8"),
    heart: ic(P_HEART, P_HEART, "#EBCDCB"),
    flower: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none">' +
      '<g transform="translate(1.1 1)" fill="#F3C3A8"><circle cx="12" cy="6.6" r="3.4"/><circle cx="17" cy="10.4" r="3.4"/><circle cx="15.1" cy="16.2" r="3.4"/><circle cx="8.9" cy="16.2" r="3.4"/><circle cx="7" cy="10.4" r="3.4"/></g>' +
      '<g fill="none" stroke="' + INK + '" stroke-width="1.25"><circle cx="12" cy="6.6" r="3.4"/><circle cx="17" cy="10.4" r="3.4"/><circle cx="15.1" cy="16.2" r="3.4"/><circle cx="8.9" cy="16.2" r="3.4"/><circle cx="7" cy="10.4" r="3.4"/></g>' +
      '<circle cx="12" cy="12" r="2.2" fill="#F1E2B8" stroke="' + INK + '" stroke-width="1.2"/></svg>',
    leaf: ic(P_LEAF, P_LEAF + "M5 19c4.5-4.6 8.4-8.6 12.4-12.6", "#C9D4BC"),
    sprig: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke-linecap="round" stroke-linejoin="round">' +
      '<g fill="#C9D4BC" transform="translate(1 1)"><path d="M12 8c-2.6-.4-4-2-4.3-4.6 2.6.3 4 1.9 4.3 4.6zM12 12.5c2.6-.4 4-2 4.3-4.6-2.6.3-4 1.9-4.3 4.6zM12 16.8c-2.6-.4-4-2-4.3-4.6 2.6.3 4 1.9 4.3 4.6z"/></g>' +
      '<path d="M12 21.5V3.5M12 8c-2.6-.4-4-2-4.3-4.6 2.6.3 4 1.9 4.3 4.6zM12 12.5c2.6-.4 4-2 4.3-4.6-2.6.3-4 1.9-4.3 4.6zM12 16.8c-2.6-.4-4-2-4.3-4.6 2.6.3 4 1.9 4.3 4.6z" fill="none" stroke="' + INK + '" stroke-width="1.25"/></svg>',
    bulb: ic("M12 3a6 6 0 0 0-3.5 10.9c.7.5 1.1 1.3 1.1 2.1v.8h4.8V16c0-.8.4-1.6 1.1-2.1A6 6 0 0 0 12 3z",
      "M12 3a6 6 0 0 0-3.5 10.9c.7.5 1.1 1.3 1.1 2.1v.8h4.8V16c0-.8.4-1.6 1.1-2.1A6 6 0 0 0 12 3zM10 19.5h4M10.8 21.5h2.4", "#F1E2B8"),
    map: ic("M3.5 6.5l5.5-2.2 6 2.2 5.5-2.2v13.2L15 19.7l-6-2.2-5.5 2.2z", "M3.5 6.5l5.5-2.2 6 2.2 5.5-2.2v13.2L15 19.7l-6-2.2-5.5 2.2zM9 4.3v13.2M15 6.5v13.2", "#CFDDDA"),
    teach: ic("M3.5 4.5h17v11h-17z", "M3.5 4.5h17v11h-17zM12 15.5v4M8 20.5h8M7 12l3-3 2.5 2 4-4", "#F4EBD6"),
    stop: ic("M8.3 3h7.4L21 8.3v7.4L15.7 21H8.3L3 15.7V8.3z", "M8.3 3h7.4L21 8.3v7.4L15.7 21H8.3L3 15.7V8.3zM8 12h8", "#EBCDCB"),
    path: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none"><path d="M4 20c4-2 2-6 6-8s6 1 10-8" stroke="' + INK + '" stroke-width="1.4" stroke-dasharray="1.5 3.2" stroke-linecap="round"/><circle cx="4" cy="20" r="2.2" fill="#F3C3A8" stroke="' + INK + '" stroke-width="1.1"/><circle cx="20" cy="4" r="2.2" fill="#CFDDDA" stroke="' + INK + '" stroke-width="1.1"/></svg>',
    arrow: '<svg class="arrow" viewBox="0 0 24 14" aria-hidden="true"><path d="M1.5 7.4c6-.5 13-.3 19.5-.2M15.8 2.4c1.9 1.7 3.7 3.2 5.6 4.8-2 1.5-3.8 3-5.4 4.8" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    arrowL: '<svg class="arrow" viewBox="0 0 24 14" aria-hidden="true" style="transform:scaleX(-1)"><path d="M1.5 7.4c6-.5 13-.3 19.5-.2M15.8 2.4c1.9 1.7 3.7 3.2 5.6 4.8-2 1.5-3.8 3-5.4 4.8" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    house: ic("M5.5 10.5v9.5h13v-9.5L12 5z", "M3.5 11.5L12 4l8.5 7.5M5.5 10v10h13V10M10 20v-5h4v5", "#F4EBD6")
  };
  SK.icon = function (name) { return SK.icons[name] || ""; };
  function innerSvg(svg) { return svg.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, ""); }
  SK.innerSvg = innerSvg;

  /* ---------- 植物塗鴉：放在卡片邊角與空白處的小點綴 ---------- */
  SK.botanical = function (k) {
    var L = 'stroke="' + INK + '" stroke-width="1.3" fill="none" stroke-linecap="round" stroke-linejoin="round"';
    var v = [
      // 0：一枝細長的葉子
      '<svg viewBox="0 0 60 60" aria-hidden="true"><g fill="#C9D4BC" transform="translate(1.4 1.2)"><path d="M30 20c-5-1-8-4-8.5-9 5 .5 8 3.6 8.5 9zM30 30c5-1 8-4 8.5-9-5 .5-8 3.6-8.5 9zM30 40c-5-1-8-4-8.5-9 5 .5 8 3.6 8.5 9z"/></g>' +
      '<path ' + L + ' d="M30 56C29 40 31 22 30 6M30 20c-5-1-8-4-8.5-9 5 .5 8 3.6 8.5 9zM30 30c5-1 8-4 8.5-9-5 .5-8 3.6-8.5 9zM30 40c-5-1-8-4-8.5-9 5 .5 8 3.6 8.5 9z"/></svg>',
      // 1：兩朵小花
      '<svg viewBox="0 0 60 60" aria-hidden="true"><g fill="#F3C3A8" transform="translate(1.3 1.2)"><circle cx="20" cy="18" r="7"/><circle cx="42" cy="30" r="5.5"/></g>' +
      '<path ' + L + ' d="M20 25c1 10 3 20 6 31M42 35.5c-2 7-6 14-11 20.5M20 11a7 7 0 1 1-.01 0M42 24.5a5.5 5.5 0 1 1-.01 0"/>' +
      '<circle cx="20" cy="18" r="2" fill="' + INK + '"/><circle cx="42" cy="30" r="1.6" fill="' + INK + '"/></svg>',
      // 2：圓點與一片葉
      '<svg viewBox="0 0 60 60" aria-hidden="true"><path fill="#CFE0D3" transform="translate(1.3 1.2)" d="M14 46c2-14 10-22 26-24-2 15-11 23-26 24z"/>' +
      '<path ' + L + ' d="M14 46c2-14 10-22 26-24-2 15-11 23-26 24zM15 45c7-6 14-13 22-20"/>' +
      '<circle cx="46" cy="44" r="2.2" fill="#F3C3A8"/><circle cx="50" cy="36" r="1.4" fill="' + INK + '" opacity=".5"/><circle cx="10" cy="20" r="1.8" fill="#A9B79A"/><circle cx="18" cy="12" r="1.2" fill="' + INK + '" opacity=".5"/></svg>',
      // 3：一叢小草與太陽
      '<svg viewBox="0 0 60 60" aria-hidden="true"><circle cx="42" cy="16" r="7" fill="#F1E2B8" transform="translate(1.3 1.2)"/><circle ' + L + ' cx="42" cy="16" r="7"/>' +
      '<path ' + L + ' d="M16 54c0-9-2-17-7-23M22 54c0-11 1-20 5-27M28 54c-1-7 1-13 5-17"/></svg>'
    ];
    return v[((k % v.length) + v.length) % v.length];
  };

  /* 單元頁 Hero 右側：大面積的拱形垂直色塊 + 植物塗鴉 */
  SK.bouquet = function (tint) {
    var cols = tint || ["#CFE0D3", "#F3D5C3", "#D9E2D2"];
    return '<svg class="deco" viewBox="0 0 210 170" aria-hidden="true">' +
      '<defs><pattern id="spk-h" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="6" cy="9" r=".7" fill="#4A3F37" opacity=".3"/><circle cx="27" cy="21" r=".5" fill="#4A3F37" opacity=".25"/><circle cx="17" cy="35" r=".8" fill="#B8674A" opacity=".25"/><circle cx="35" cy="4" r=".5" fill="#4A3F37" opacity=".3"/></pattern></defs>' +
      '<path d="M20 170V58a32 32 0 0 1 64 0v112z" fill="' + cols[0] + '"/>' +
      '<path d="M92 170V34a30 30 0 0 1 60 0v136z" fill="' + cols[1] + '"/>' +
      '<path d="M160 170V78a22 22 0 0 1 44 0v92z" fill="' + cols[2] + '"/>' +
      '<rect width="210" height="170" fill="url(#spk-h)"/>' +
      '<g transform="translate(26 70) scale(.95)">' + innerSvg(SK.botanical(0)) + "</g>" +
      '<g transform="translate(96 40) scale(1.05)">' + innerSvg(SK.botanical(1)) + "</g>" +
      '<g transform="translate(158 92) scale(.8)">' + innerSvg(SK.botanical(3)) + "</g>" +
      '<path d="M8 168h196" stroke="#4A3F37" stroke-width="1.3" stroke-linecap="round"/></svg>';
  };

  /* 注入手繪濾鏡（CSS 的 filter:url(#sk-wobble) 需要它在文件內） */
  function injectFilters() {
    if (document.getElementById("sk-filters")) return;
    var d = SK.h("div", { id: "sk-filters", "aria-hidden": "true", style: "position:absolute;width:0;height:0;overflow:hidden" });
    d.innerHTML = '<svg width="0" height="0"><defs>' +
      '<filter id="sk-wobble" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="7"/><feDisplacementMap in="SourceGraphic" scale="2.4"/></filter>' +
      '<filter id="sk-soft" x="-3%" y="-3%" width="106%" height="106%"><feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="1.6"/></filter>' +
      '</defs></svg>';
    document.body.insertBefore(d, document.body.firstChild);
  }

  /* ---------- 滑桿 ---------- */
  SK.slider = function (o) {
    var id = "sl-" + Math.random().toString(36).slice(2, 8);
    var wrap = SK.h("div", { class: "slider" + (o.color ? " c-" + o.color : "") });
    var lab = SK.h("label", { for: id }, SK.md(o.label));
    var inp = SK.h("input", { type: "range", id: id, min: o.min, max: o.max, step: o.step || 1, value: o.value });
    var out = SK.h("output", { for: id });
    wrap.appendChild(lab); wrap.appendChild(inp); wrap.appendChild(out);
    var fmt = o.fmt || function (v) { return SK.fmt(v, 2); };
    function sync() { out.textContent = fmt(+inp.value); }
    inp.addEventListener("input", function () { sync(); if (o.onInput) o.onInput(+inp.value); });
    sync();
    return {
      el: wrap, input: inp,
      get value() { return +inp.value; },
      set: function (v, silent) { inp.value = v; sync(); if (!silent && o.onInput) o.onInput(+inp.value); }
    };
  };

  /* ---------- 拖曳把手 ---------- */
  SK.handle = function (parent, x, y, color, label) {
    var g = SK.s("g", { class: "handle", tabindex: 0, role: "slider", "aria-label": label || "拖曳點" }, parent);
    SK.s("circle", { class: "hit", r: 22 }, g);
    var k = SK.s("circle", { class: "knob", r: 9 }, g);
    if (color) k.style.fill = color;
    SK.s("circle", { r: 15, fill: "none", stroke: color || "#B8674A", "stroke-width": 1.2, "stroke-dasharray": "2 3", class: "pulse" }, g);
    g.moveTo = function (px, py) { g.setAttribute("transform", "translate(" + px + " " + py + ")"); };
    g.moveTo(x, y);
    return g;
  };
  /* onMove(x, y) 收到 SVG 座標；方向鍵每次移動 step */
  SK.drag = function (svg, handle, onMove, getPos, step) {
    step = step || 6;
    function toSvg(ev) {
      var pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
      return pt.matrixTransform(svg.getScreenCTM().inverse());
    }
    var dragging = false;
    handle.addEventListener("pointerdown", function (ev) {
      dragging = true; handle.setPointerCapture(ev.pointerId); ev.preventDefault();
    });
    handle.addEventListener("pointermove", function (ev) {
      if (!dragging) return;
      var p = toSvg(ev); onMove(p.x, p.y);
    });
    function end() { dragging = false; }
    handle.addEventListener("pointerup", end);
    handle.addEventListener("pointercancel", end);
    handle.addEventListener("keydown", function (ev) {
      if (!getPos) return;
      var p = getPos(), dx = 0, dy = 0;
      if (ev.key === "ArrowLeft") dx = -step; else if (ev.key === "ArrowRight") dx = step;
      else if (ev.key === "ArrowUp") dy = -step; else if (ev.key === "ArrowDown") dy = step; else return;
      ev.preventDefault(); ev.stopPropagation(); onMove(p[0] + dx, p[1] + dy);
    });
  };

  /* ---------- 步驟播放器 ---------- */
  SK.players = [];
  /* frames: [{cap, tex}]；onShow(i) 由單元負責重畫圖形 */
  SK.StepPlayer = function (root, frames, onShow) {
    var self = this;
    this.i = 0; this.n = frames.length;
    var card = root.querySelector(".step-card");
    var dots = root.querySelector(".dots");
    var prev = root.querySelector(".prev"), next = root.querySelector(".next");
    var seen = {};
    frames.forEach(function (f, i) {
      var d = SK.h("button", { class: "dot", type: "button", "aria-label": "第 " + (i + 1) + " 步" });
      d.addEventListener("click", function () { self.go(i); });
      dots.appendChild(d);
    });
    this.go = function (i) {
      i = SK.clamp(i, 0, self.n - 1);
      self.i = i; seen[i] = true;
      var f = frames[i];
      card.innerHTML =
        '<div class="step-anim"><div class="step-no">Step ' + (i + 1) + " / " + self.n + "</div>" +
        '<p class="caption">' + SK.md(f.cap) + "</p>" +
        (f.tex ? '<div class="formula">' + SK.tex(f.tex, true) + "</div>" : "") + "</div>";
      Array.prototype.forEach.call(dots.children, function (d, k) {
        d.setAttribute("aria-current", k === i ? "true" : "false");
        d.classList.toggle("seen", !!seen[k]);
      });
      prev.disabled = i === 0;
      next.disabled = i === self.n - 1;
      next.innerHTML = i === self.n - 2 ? "最後一步 " + SK.icon("arrow") : "下一步 " + SK.icon("arrow");
      if (onShow) onShow(i);
    };
    prev.addEventListener("click", function () { self.go(self.i - 1); });
    next.addEventListener("click", function () { self.go(self.i + 1); });
    this.next = function () { if (self.i < self.n - 1) { self.go(self.i + 1); return true; } return false; };
    this.prev = function () { if (self.i > 0) { self.go(self.i - 1); return true; } return false; };
    SK.players.push(this);
  };

  /* ---------- 成長型思維便條 ---------- */
  SK.note = function (text, en) {
    return '<div class="note">' + SK.icon("sparkle") + "<div>" + SK.md(text) + (en ? "<small>" + en + "</small>" : "") + "</div></div>";
  };
  var NOTES = {
    hook: ["還沒有頭緒？很好——「還沒」正是學習開始的地方。", "Not yet is where learning begins."],
    guess: ["猜錯完全沒關係！Jo Boaler 引用的腦科學研究指出：犯錯的那一刻，大腦特別活躍。錯誤是成長的時刻。", "Mistakes grow your brain."],
    derive: ["慢慢來，數學不是比快，是比看得深。每一步都可以倒回去再看一次。", "Depth over speed."],
    angles: ["同一個想法換一種方式看，大腦裡負責圖像和符號的區域就會一起合作。", "Many ways to see."],
    challenge: ["沒有標準答案的問題，才是數學家每天在玩的東西。卡住了？卡住就是在長大。", "Struggle is where the growth is."]
  };

  /* ---------- 頁首／頁尾 ---------- */
  SK.topbar = function (base, isUnit) {
    var bar = SK.h("header", { class: "topbar" });
    bar.innerHTML = '<div class="wrap">' +
      '<a class="brand" href="' + base + 'index.html">' + SK.icon("sprig") + "圖解數學小鎮</a>" +
      "<nav>" +
      '<a class="nav-link" href="' + base + 'index.html#town">' + SK.icon("map") + '<span>地圖</span></a>' +
      (isUnit ? '<button class="nav-link teach-toggle" type="button" aria-pressed="false" title="投影用：一次顯示一段，鍵盤 ← → 逐步">' + SK.icon("teach") + "<span>上課模式</span></button>" : "") +
      "</nav></div>";
    return bar;
  };
  SK.footer = function () {
    var f = SK.h("footer", { class: "site-foot" });
    f.innerHTML = '<div class="wrap"><div class="foot-row" aria-hidden="true">' + [0, 1, 2, 3, 1, 0].map(function (k) { return SK.botanical(k); }).join("") + "</div>" +
      '<p class="latin-hand">See it, then say it · A gentle way to learn math</p>' +
      "<p>內容依據 108 課綱（高一共同必修、數學 A／B、選修數學甲）整理；教學設計參考 Jo Boaler 的數學心態研究（youcubed）。</p></div>";
    return f;
  };

  /* ---------- 上課模式 ---------- */
  var teach = { on: false, slides: [], idx: 0, hud: null };
  SK.teach = teach;
  function teachShow(i) {
    teach.idx = SK.clamp(i, 0, teach.slides.length - 1);
    teach.slides.forEach(function (s, k) { s.classList.toggle("slide-active", k === teach.idx); });
    teach.hud.querySelector(".pos").textContent = (teach.idx + 1) + " / " + teach.slides.length;
    window.scrollTo(0, 0);
  }
  function playerIn(slide) {
    for (var k = 0; k < SK.players.length; k++) if (slide.contains(SK.players[k].root)) return SK.players[k];
    return null;
  }
  function teachStep(dir) {
    var p = playerIn(teach.slides[teach.idx]);
    if (p && (dir > 0 ? p.next() : p.prev())) return;
    var ni = teach.idx + dir;
    if (ni < 0 || ni >= teach.slides.length) return;
    teachShow(ni);
    var np = playerIn(teach.slides[teach.idx]);
    if (np) np.go(dir > 0 ? 0 : np.n - 1);
  }
  function setTeach(on) {
    teach.on = on;
    document.body.classList.toggle("teach", on);
    var btn = document.querySelector(".teach-toggle");
    if (btn) btn.setAttribute("aria-pressed", on ? "true" : "false");
    if (on) {
      teach.slides = Array.prototype.slice.call(document.querySelectorAll(".unit-hero, .unit-sec"));
      teachShow(0);
      if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
      if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(function () {});
    } else {
      teach.slides.forEach(function (s) { s.classList.remove("slide-active"); });
      if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(function () {});
    }
  }
  function initTeach() {
    var btn = document.querySelector(".teach-toggle");
    if (!btn) return;
    teach.hud = SK.h("div", { class: "teach-hud", role: "toolbar", "aria-label": "上課模式控制" });
    teach.hud.innerHTML = '<span class="pos"></span>' +
      '<button class="btn small ghost t-prev" type="button" aria-label="上一步">' + SK.icon("arrowL") + "</button>" +
      '<button class="btn small t-next" type="button" aria-label="下一步">' + SK.icon("arrow") + "</button>" +
      '<button class="btn small ghost t-exit" type="button">離開</button>';
    document.body.appendChild(teach.hud);
    teach.hud.querySelector(".t-prev").onclick = function () { teachStep(-1); };
    teach.hud.querySelector(".t-next").onclick = function () { teachStep(1); };
    teach.hud.querySelector(".t-exit").onclick = function () { setTeach(false); };
    btn.addEventListener("click", function () { setTeach(!teach.on); });
    document.addEventListener("keydown", function (ev) {
      if (!teach.on) return;
      var t = ev.target, tag = ((t && t.tagName) || "").toLowerCase();
      if (tag === "input" || (t && t.getAttribute && t.getAttribute("role") === "slider")) return;
      if (ev.key === "ArrowRight" || ev.key === "PageDown" || ev.key === " ") { ev.preventDefault(); teachStep(1); }
      else if (ev.key === "ArrowLeft" || ev.key === "PageUp") { ev.preventDefault(); teachStep(-1); }
      else if (ev.key === "Escape") setTeach(false);
    });
    document.addEventListener("fullscreenchange", function () {
      // 使用者按 Esc 離開全螢幕時，保持上課模式但不強制
    });
  }

  /* =========================================================
     mountUnit：把單元設定組成六步頁面
     ========================================================= */
  SK.mountUnit = function (cfg) {
    injectFilters();
    var cat = window.CATALOG, meta = cat.get(cfg.slug), region = cat.region(meta.region);
    document.title = meta.title + "｜圖解數學小鎮";

    document.body.appendChild(SK.topbar("../", true));
    var main = SK.h("main", { class: "wrap", id: "main" });
    document.body.appendChild(main);

    /* ---- Hero ---- */
    var tracks = meta.tracks.map(function (t) {
      var tr = cat.tracks[t]; return '<span class="chip ' + tr.cls + '"><i class="dot-i"></i>' + tr.name + "</span>";
    }).join("");
    var codes = meta.codes.map(function (c) { return '<span class="code">' + c + "</span>"; }).join(" ");
    var hero = SK.h("section", { class: "unit-hero" });
    hero.innerHTML =
      '<div class="crumb"><a href="../index.html#town">小鎮地圖</a><span>›</span><span>' + region.name + "</span></div>" +
      "<h1>" + meta.title + "</h1>" +
      '<p class="en-sub">' + cfg.en + "</p>" +
      '<div class="hero-formula sk-frame">' + SK.tex(cfg.formula, true) + "</div>" +
      '<div class="hero-meta">' + tracks + codes + "</div>" +
      (meta.tracks.indexOf("X") >= 0 ? '<p class="beyond-note">' + SK.icon("leaf") + "這是<b>課綱外的補充單元</b>：不在考試範圍內，放在這裡是因為它能幫助理解正式內容，或值得欣賞。</p>" : "") +
      '<div class="hero-deco">' + SK.bouquet() + "</div>";
    main.appendChild(hero);

    var steps = [
      ["01", "好奇入口", "Wonder"],
      ["02", "先猜猜看", "Make a Guess"],
      ["03", "看圖推導", "See It Unfold"],
      ["04", "換個角度看", "Another Way to See"],
      ["05", "天花板挑戰", "Go Further"],
      ["06", "地圖定位", "Where It Lives"]
    ];
    function section(k, id) {
      var s = SK.h("section", { class: "unit-sec sk-card sk-frame", id: id, "aria-labelledby": id + "-t" });
      s.innerHTML = '<span class="corner-bot" aria-hidden="true">' + SK.botanical(k) + "</span>" +
        '<h2 class="sec-title" id="' + id + '-t"><span class="num">' + steps[k][0] + "</span>" + steps[k][1] +
        '<span class="en">/ ' + steps[k][2] + "</span></h2>";
      main.appendChild(s);
      return s;
    }

    /* ---- 01 好奇入口 ---- */
    var s1 = section(0, "wonder");
    var hookBody = SK.h("div", { class: cfg.hook.visual ? "two-col" : "" });
    var hookText = SK.h("div", {}, '<p class="lead">' + SK.md(cfg.hook.html) + "</p>" +
      (cfg.hook.ask ? '<p class="hand" style="font-size:1.2rem">' + SK.icon("bulb").replace("<svg", '<svg style="width:22px;height:22px;vertical-align:-4px"') + " " + SK.md(cfg.hook.ask) + "</p>" : "") +
      SK.note(NOTES.hook[0], NOTES.hook[1]));
    hookBody.appendChild(hookText);
    if (cfg.hook.visual) {
      var hv = SK.h("div", { class: "stage sk-frame dashed" });
      hookBody.appendChild(hv);
      cfg.hook.visual(hv);
    }
    s1.appendChild(hookBody);

    /* ---- 02 先猜猜看 ---- */
    var s2 = section(1, "guess");
    var g = cfg.guess;
    var qEl = SK.h("div", {}, '<p class="q-text">' + SK.md(g.q) + "</p>");
    if (g.visual) { var gv = SK.h("div", { class: "stage", style: "max-width:520px;margin:0 auto 16px" }); qEl.appendChild(gv); g.visual(gv); }
    var opts = SK.h("div", { class: "opts", role: "group", "aria-label": "選一個你的猜測" });
    var explain = SK.h("div", { "aria-live": "polite" });
    var letters = "ABCD";
    g.options.forEach(function (o, i) {
      var b = SK.h("button", { class: "opt" + (o.truth ? " is-truth" : ""), type: "button" },
        '<span class="letter">' + letters[i] + "</span>" + SK.md(o.t) +
        '<span class="tag t-truth">✓ 真相</span><span class="tag t-mine">你的猜測</span>');
      b.addEventListener("click", function () {
        opts.classList.add("revealed");
        Array.prototype.forEach.call(opts.children, function (x, k) {
          x.classList.toggle("truth", !!g.options[k].truth);
          x.classList.toggle("chosen", k === i);
        });
        var head = o.truth ? "✦ 正是如此！" : (o.common ? "✦ 很多人都這樣想！" : "✦ 有趣的想法！");
        explain.innerHTML = '<div class="explain">' + "<h4>" + (o.head || head) + "</h4>" + SK.md(o.explain) +
          '<div class="mini"></div>' +
          (o.truth ? "" : '<p class="muted" style="margin:10px 0 0;font-size:.92rem">點點看其他選項，每一個都有它的故事。</p>') + "</div>";
        if (o.mini) o.mini(explain.querySelector(".mini"));
      });
      opts.appendChild(b);
    });
    qEl.appendChild(opts);
    var skip = SK.h("button", { class: "skip", type: "button" }, "先跳過，直接往下看 ↓");
    skip.addEventListener("click", function () { document.getElementById("derive").scrollIntoView({ behavior: "smooth" }); });
    qEl.appendChild(skip);
    qEl.appendChild(explain);
    s2.appendChild(qEl);
    s2.insertAdjacentHTML("beforeend", '<div style="margin-top:18px">' + SK.note(NOTES.guess[0], NOTES.guess[1]) + "</div>");

    /* ---- 03 看圖推導 ---- */
    var s3 = section(2, "derive");
    if (cfg.derive.intro) s3.insertAdjacentHTML("beforeend", '<p class="lead">' + SK.md(cfg.derive.intro) + "</p>");
    var pl = SK.h("div", { class: "player" });
    pl.innerHTML =
      '<div class="stage sk-frame' + (cfg.derive.tall ? " tall" : "") + '"></div>' +
      '<div class="player-side">' +
      '<div class="step-card" aria-live="polite"></div>' +
      '<div class="controls"><button class="btn small ghost prev" type="button">' + SK.icon("arrowL") + ' 上一步</button>' +
      '<div class="dots"></div><button class="btn small next" type="button">下一步 ' + SK.icon("arrow") + "</button></div>" +
      '<div class="sliders"></div>' +
      '<div class="extra"></div>' +
      '<p class="hint-line">' + SK.icon("sparkle") + SK.md(cfg.derive.hint || "拖拖看滑桿，任何一步都可以改數字，圖和式子會一起變。") + "</p>" +
      "</div>";
    s3.appendChild(pl);
    var ctx = {
      stage: pl.querySelector(".stage"),
      sliders: pl.querySelector(".sliders"),
      extra: pl.querySelector(".extra"),
      frame: 0
    };
    var api = cfg.derive.setup(ctx) || {};
    var player = new SK.StepPlayer(pl, cfg.derive.frames, function (i) { ctx.frame = i; if (api.show) api.show(i); });
    player.root = pl;
    player.go(0);
    s3.insertAdjacentHTML("beforeend", '<div style="margin-top:20px">' + SK.note(NOTES.derive[0], NOTES.derive[1]) + "</div>");

    /* ---- 04 換個角度看 ---- */
    var s4 = section(3, "angles");
    var angles = SK.h("div", { class: "angles" });
    cfg.angles.forEach(function (a) {
      var box = SK.h("div", { class: "angle sk-frame" });
      box.innerHTML = "<h3>" + SK.icon(a.icon || "leaf") + SK.md(a.title) + "</h3>" + (a.html ? "<div>" + SK.md(a.html) + "</div>" : "");
      var body = SK.h("div", {});
      box.appendChild(body);
      if (a.render) a.render(body);
      if (a.after) box.insertAdjacentHTML("beforeend", "<div>" + SK.md(a.after) + "</div>");
      angles.appendChild(box);
    });
    s4.appendChild(angles);
    s4.insertAdjacentHTML("beforeend", '<div style="margin-top:20px">' + SK.note(NOTES.angles[0], NOTES.angles[1]) + "</div>");

    /* ---- 05 天花板挑戰 ---- */
    var s5 = section(4, "challenge");
    s5.insertAdjacentHTML("beforeend", '<p class="muted">由淺到深，沒有時間限制，也不用全部做。挑一題你最好奇的就好。</p>');
    var chs = SK.h("div", { class: "challenges" });
    cfg.challenges.forEach(function (c, i) {
      var d = SK.h("div", { class: "challenge" });
      d.innerHTML = '<span class="lv">' + (c.lv || ["Warm-up", "Explore", "Wonder"][Math.min(i, 2)]) + "</span>" +
        '<p class="q">' + SK.md(c.q) + "</p>" +
        (c.hint ? "<details><summary>給我一點提示</summary><div>" + SK.md(c.hint) + "</div></details>" : "") +
        (c.idea ? "<details><summary>看一種想法（不是唯一答案）</summary><div>" + SK.md(c.idea) + "</div></details>" : "");
      chs.appendChild(d);
    });
    s5.appendChild(chs);
    s5.insertAdjacentHTML("beforeend", '<div style="margin-top:20px">' + SK.note(NOTES.challenge[0], NOTES.challenge[1]) + "</div>");

    /* ---- 06 地圖定位 ---- */
    var s6 = section(5, "where");
    var w = cfg.where;
    var linkSlugs = (meta.links || []).concat(cat.units.filter(function (u) { return u.links && u.links.indexOf(meta.slug) >= 0; }).map(function (u) { return u.slug; }));
    var seenL = {};
    var linkHtml = linkSlugs.filter(function (s) { if (seenL[s]) return false; seenL[s] = 1; return true; }).map(function (s) {
      var u = cat.get(s);
      return u.ready ? '<a class="btn small sky" href="' + s + '.html">' + u.title + "</a>" : '<span class="chip">' + u.title + "（施工中）</span>";
    }).join("");
    s6.insertAdjacentHTML("beforeend",
      '<div class="where">' +
      '<div class="where-box sk-frame"><h4>' + SK.icon("map") + "課綱位置</h4><ul>" +
      w.codes.map(function (c) { return '<li><span class="code">' + c[0] + "</span> " + SK.md(c[1]) + "</li>"; }).join("") + "</ul></div>" +
      '<div class="where-box sk-frame"><h4>' + SK.icon("star") + "考試與重要性</h4><p>" + SK.md(w.exam) + "</p></div>" +
      '<div class="where-box stopline"><h4>' + SK.icon("stop") + "停止線：講到這裡就好</h4><p>" + SK.md(w.stop) + "</p></div>" +
      "</div>" +
      (linkHtml ? '<h3 class="hand" style="margin:22px 0 10px;display:flex;gap:8px;align-items:center">' + SK.icon("path").replace("<svg", '<svg style="width:24px;height:24px"') + "小鎮小路：這條公式通往…</h3><div class=\"links-row\">" + linkHtml + "</div>" : ""));

    /* ---- 上一篇／下一篇 ---- */
    var ord = cat.order, k = ord.indexOf(meta.slug);
    var foot = SK.h("nav", { class: "unit-foot", "aria-label": "單元導覽" });
    foot.innerHTML =
      (k > 0 ? '<a class="btn ghost" href="' + ord[k - 1] + '.html">' + SK.icon("arrowL") + " " + cat.get(ord[k - 1]).title + "</a>" : "<span></span>") +
      (k < ord.length - 1 ? '<a class="btn" href="' + ord[k + 1] + '.html">' + cat.get(ord[k + 1]).title + " " + SK.icon("arrow") + "</a>" : '<a class="btn" href="../index.html#town">回到小鎮地圖 ' + SK.icon("arrow") + "</a>");
    main.appendChild(foot);
    document.body.appendChild(SK.footer());
    initTeach();
  };

  SK.injectFilters = injectFilters;
})();
