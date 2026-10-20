(function () {
  document.body.appendChild(SK.topbar("../", false));
  var main = SK.h("main", { class: "wrap", id: "main" });
  main.innerHTML =
    '<section class="exam-hero sk-frame">' +
      '<p class="eyebrow">Practice like the real day</p>' +
      '<h1>全真模擬卷</h1>' +
      '<p class="lead">本區試題由網路公開題目改編。</p>' +
    '</section>' +
    '<section class="unit-sec" aria-label="已上架考卷">' +
      '<h2 class="sec-title">' + SK.icon("star").replace("<svg", '<svg class="spark"') + '已上架考卷 <span class="en">/ Available Papers</span></h2>' +
      '<div class="exam-grid">' +
        '<a class="exam-cover sk-frame" href="116-math-a-05.html">' +
          '<span class="badge">NEW · 第五回</span>' +
          '<h2>116 學測數學 A<br>模擬試卷・第五回</h2>' +
          '<p>100 分鐘完整練習，附學生題本、教師詳解及線上逐題閱讀。</p>' +
          '<div class="meta"><span>20 題</span><span>100 分鐘</span><span>PDF 下載</span></div>' +
          '<span class="go">開始作答與看詳解 →</span>' +
        '</a>' +
        '<a class="exam-cover sk-frame" href="116-math-a.html">' +
          '<span class="badge">NEW · 題目改編</span>' +
          '<h2>116 學測數學 A<br>全真模擬卷</h2>' +
          '<p>完整 100 分鐘配置，含單選、多選、選填與混合題。</p>' +
          '<div class="meta"><span>20 題</span><span>100 分鐘</span><span>逐題算法</span></div>' +
          '<span class="go">開始作答與看算法 →</span>' +
        '</a>' +
      '</div>' +
    '</section>';
  document.body.appendChild(main);
  document.body.appendChild(SK.footer());
})();
