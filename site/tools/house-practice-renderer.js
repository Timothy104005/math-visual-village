// Included inside the generated house-practice.js closure.
SK.houseItems = function (slug) {
  return (SK.HOUSE_SETS[slug] || []).map(function (item) { return Object.assign({}, item, { slug: slug }); });
};
SK.renderHousePractice = function (slug) {
  var items = SK.houseItems(slug);
  if (!items.length) return null;
  var esc = function (value) { return String(value).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var section = SK.h("section", { class: "unit-sec sk-card sk-frame house-practice", id: "house-practice", "aria-labelledby": "house-practice-t" });
  section.innerHTML = '<h2 class="sec-title" id="house-practice-t"><span class="num">' + items.length + '題</span>這間小屋的練習<span class="en">/ Practice here</span></h2>' +
    '<p class="muted">從暖身開始，依序練這間小屋的觀念。先自己想，再打開解法；想寫觀察、加進錯題本，就到練習場一題一題做。</p>' +
    '<p><a class="btn" href="../practice/index.html?house=' + encodeURIComponent(slug) + '">開始本單元練習 ' + SK.icon("arrow") + '</a></p>' +
    '<ol class="house-questions">' + items.map(function (it, i) {
      var title = it.kind === "try" ? "暖身與運用" : it.kind === "challenge" ? "延伸思考" : "綜合練習";
      return '<li class="house-question" data-house-item="' + it.id + '"><div class="house-q-head"><b>第 ' + (i + 1) + ' 題</b><span class="chip">' + title + '</span></div>' +
        '<p class="house-source muted">' + esc(it.src) + (it.url ? '・<a href="' + esc(it.url) + '" target="_blank" rel="noopener">原試卷 PDF ↗</a>' : '') + '</p>' +
        '<div class="past-q">' + SK.md(it.q) + '</div>' +
        (it.opts ? '<ol class="house-options">' + it.opts.map(function (o) { return '<li>' + SK.md(o) + '</li>'; }).join("") + '</ol>' : "") +
        '<details class="house-solution"><summary>想好後，再看解法與答案</summary>' +
        it.ways.map(function (w) { return '<div class="house-way"><b>' + SK.md(w.t) + '</b><div>' + SK.md(w.html) + '</div></div>'; }).join("") +
        (it.trap ? '<p class="house-trap">' + SK.md(it.trap) + '</p>' : "") + '<div class="house-answer"><b>答案：</b>' + SK.md(it.ans) + '</div></details></li>';
    }).join("") + '</ol>';
  return section;
};
