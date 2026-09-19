// 由 catalog.js 產生每個已完成單元的 HTML 外殼：node tools/make-unit-pages.js
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, "assets/js/catalog.js"), "utf8"), ctx);
const cat = ctx.window.CATALOG;

const favicon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 1.5c.9 5.6 3.3 8.3 9.5 10.4-6.2 1.6-8.6 4.4-9.5 10.6-1-6.2-3.4-9-9.5-10.6C8.7 9.8 11.1 7.1 12 1.5z' fill='%23FFD36E' stroke='%23B8860B' stroke-width='1.3'/%3E%3C/svg%3E";

for (const u of cat.units.filter((u) => u.ready)) {
  const html = `<!doctype html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${u.title}｜圖解數學小鎮</title>
<meta name="description" content="${u.title}：${u.sub}。用圖像一步一步推導公式。">
<link rel="icon" href="${favicon}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Chiron+GoRound+TC:wght@400;600;700&family=LXGW+WenKai+TC:wght@400;700&family=Patrick+Hand&display=swap">
<link rel="stylesheet" href="../assets/vendor/katex/katex.min.css">
<link rel="stylesheet" href="../assets/css/storybook.css">
</head>
<body>
<noscript><p style="padding:2em">這個頁面的互動圖需要開啟 JavaScript。</p></noscript>
<script src="../assets/vendor/katex/katex.min.js"></script>
<script src="../assets/js/catalog.js"></script>
<script src="../assets/js/core.js"></script>
<script src="${u.slug}.js"></script>
</body>
</html>
`;
  fs.writeFileSync(path.join(root, "units", u.slug + ".html"), html);
  console.log("wrote units/" + u.slug + ".html");
}
