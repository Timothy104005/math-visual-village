/* 第五回：題目與解答取自隨附試卷資料。 */
(function () {
  "use strict";
  var base = "../assets/exams/116/05/";
  var sections = window.MOCK_116_MATH_A_05;

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character];
    });
  }

  function mathText(value) {
    return String(value || "").split(/(\[\[math:[\s\S]*?\]\])/g).map(function (part) {
      if (part.slice(0, 7) === "[[math:") return SK.tex(part.slice(7, -2), false);
      return escapeHtml(part).replace(/\n/g, "<br>");
    }).join("");
  }

  document.body.appendChild(SK.topbar("../", false));
  var main = SK.h("main", { class: "wrap", id: "main" });
  var hero = SK.h("section", { class: "exam-hero sk-frame" });
  hero.innerHTML =
    '<p class="eyebrow">116 GSAT Math A · Mock exam 05</p>' +
    '<h1>116 學測數學 A<br>模擬試卷・第五回</h1>' +
    '<p class="lead">100 分鐘、20 題。先下載學生題本完整作答，再展開逐題詳解核對想法。</p>' +
    '<div class="exam-actions">' +
      '<a class="btn" href="' + base + 'student.pdf" target="_blank" rel="noopener">下載學生題本</a>' +
      '<a class="btn ghost" href="' + base + 'teacher.pdf" target="_blank" rel="noopener">下載教師詳解</a>' +
      '<a class="btn sky" href="index.html">回模擬卷專區</a>' +
    '</div>';
  main.appendChild(hero);

  var jump = SK.h("nav", { class: "exam-jump", "aria-label": "跳到題號" });
  sections.forEach(function (section) {
    section.questions.forEach(function (q) {
      jump.insertAdjacentHTML("beforeend", '<a href="#q' + q.number + '">' + q.number + '</a>');
    });
  });
  main.appendChild(jump);

  sections.forEach(function (section) {
    main.appendChild(SK.h("div", { class: "exam-part" },
      '<h2>' + escapeHtml(section.title) + '</h2><span>' + escapeHtml(section.description) + '</span>'));
    section.questions.forEach(function (q) {
      var article = SK.h("article", { class: "exam-question sk-frame", id: "q" + q.number });
      var figure = q.visual ? '<img class="exam-figure" src="' + escapeHtml(q.visual.path) + '" alt="' + escapeHtml(q.visual.alt) + '">' : '';
      var options = q.options ? '<ol class="exam-options">' + q.options.map(function (option, i) {
        return '<li><b>(' + (i + 1) + ')</b>　' + mathText(option) + '</li>';
      }).join('') + '</ol>' : '';
      var mistakes = q.common_errors && q.common_errors.length ?
        '<details class="pitfall"><summary>常見錯誤</summary><div><ul>' +
        q.common_errors.map(function (error) { return '<li>' + mathText(error) + '</li>'; }).join('') +
        '</ul></div></details>' : '';
      article.innerHTML =
        '<div class="exam-qhead"><span class="exam-qnum">' + q.number + '</span><span class="points">' + q.points + ' 分</span></div>' +
        '<div class="exam-stem">' + mathText(q.stem) + '</div>' + figure + options +
        '<details class="algorithm"><summary>詳解</summary><div>' + mathText(q.solution) + '</div></details>' +
        mistakes +
        '<details class="answer"><summary>◆ 答案</summary><div>' + mathText(q.answer) + '</div></details>';
      main.appendChild(article);
    });
  });

  document.body.appendChild(main);
  document.body.appendChild(SK.footer());
})();
