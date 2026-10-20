// Add crawlable HTML using the same catalog and lesson content as the interactive site.
// Run against the exact release directory before uploading it to Cloudflare Pages.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ORIGIN = 'https://math-visual-village.pages.dev';
const NAME = '圖解數學小鎮';
const DESCRIPTION = '圖解數學小鎮是高中數學互動學習網站，依 108 課綱整理高一、數 A、數 B、數甲、數乙，用圖像一步一步推導公式，並提供單元練習與模擬試題。';
const escape = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
function plain(value) {
  return String(value ?? '').replace(/<br\s*\/?>|<\/p>/gi, '\n').replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
}
function block(name, value) { return `<!-- seo:${name}:start -->\n${value}\n<!-- seo:${name}:end -->`; }
function clean(html) { return html.replace(/<!-- seo:(head|content|cleanup):start -->[\s\S]*?<!-- seo:\1:end -->\s*/g, ''); }

function buildSite(inputRoot) {
  const root = path.resolve(inputRoot);
  const ctx = {window: {}};
  vm.runInNewContext(fs.readFileSync(path.join(root, 'assets/js/catalog.js'), 'utf8'), ctx);
  const catalog = ctx.window.CATALOG;
  const units = catalog.units.filter(u => u.ready);
  const katex = require(path.join(root, 'assets/vendor/katex/katex.min.js'));
  const macros = {'\\co':'\\textcolor{B8674A}{#1}','\\cb':'\\textcolor{4F7479}{#1}','\\cg':'\\textcolor{647A58}{#1}','\\cp':'\\textcolor{A85E66}{#1}','\\cy':'\\textcolor{9C8038}{#1}','\\cv':'\\textcolor{7A6889}{#1}'};
  function math(source, displayMode = false) {
    return katex.renderToString(String(source), {displayMode, throwOnError:false, strict:false, macros:{...macros}});
  }
  function prose(source) {
    if (typeof source !== 'string') return '';
    // Copy lesson prose without interactive element IDs, then render its existing math.
    return plain(source).split(/(\$\$[\s\S]+?\$\$|\$[^$]+?\$)/g).map(part => {
      if (part.startsWith('$$') && part.endsWith('$$')) return math(part.slice(2, -2), true);
      if (part.startsWith('$') && part.endsWith('$')) return math(part.slice(1, -1));
      return escape(part).replace(/\n/g, '<br>');
    }).join('');
  }
  const nav = '<nav aria-label="網站導覽"><a href="/">圖解數學小鎮</a> · <a href="/practice/">解題練習場</a> · <a href="/exams/">全真模擬卷</a></nav>';
  const relatedLinks = list => list.map(u => `<li><a href="/units/${escape(u.slug)}">${escape(u.title)}</a>：${escape(u.sub)}</li>`).join('\n');
  const home = `${nav}\n<h1>${NAME}</h1>\n<p>${DESCRIPTION}</p>
<h2>用圖像理解高中數學</h2><p>先觀察與猜想，再一步一步看公式如何成立。每個單元都有互動圖像、不同看法與練習，老師也可以使用上課模式。</p>
<h2>高中數學課程目錄</h2>\n${catalog.regions.map(region => `<section><h3>${escape(region.name)}</h3><ul>${relatedLinks(units.filter(u => u.region === region.id))}</ul></section>`).join('\n')}`;

  function lesson(unit) {
    let cfg;
    const lessonContext = {window:ctx.window, SK:{C:{}, PAPERS:{}, mountUnit:value => { cfg = value; }}};
    vm.runInNewContext(fs.readFileSync(path.join(root, 'units', unit.slug + '.js'), 'utf8'), lessonContext, {timeout:2000});
    if (!cfg || cfg.slug !== unit.slug) throw new Error(`Cannot capture lesson ${unit.slug}`);
    const frames = (cfg.derive?.frames || []).map(frame => `<li>${prose(frame.cap)}${typeof frame.tex === 'string' ? math(frame.tex, true) : ''}</li>`).join('\n');
    const related = (unit.links || []).map(slug => units.find(u => u.slug === slug)).filter(Boolean);
    return `${nav}\n<h1>${escape(unit.title)}</h1><p>${escape(unit.sub)}</p>
<p>${escape(unit.tracks.map(track => catalog.tracks[track].name).join('、'))} · ${escape(unit.codes.join('、'))}</p>
${math(cfg.formula || unit.tex, true)}
<section><h2>先觀察</h2><p>${prose(cfg.hook?.html)}</p><p>${prose(cfg.hook?.ask)}</p></section>
<section><h2>一步一步推導</h2><ol>${frames}</ol></section>
${cfg.where?.exam ? `<section><h2>課綱與應用</h2><p>${prose(cfg.where.exam)}</p></section>` : ''}
<p><a href="/practice/?house=${escape(unit.slug)}">練這間小屋的 5 題</a></p>
${related.length ? `<section><h2>相關單元</h2><ul>${relatedLinks(related)}</ul></section>` : ''}
<noscript><p>開啟 JavaScript 後，可以操作互動圖、觀看動畫並作答。</p></noscript>`;
  }

  const entries = [{file:'index.html', route:'/', content:home, description:DESCRIPTION}];
  for (const unit of units) entries.push({file:`units/${unit.slug}.html`, route:`/units/${unit.slug}`, content:lesson(unit)});
  for (const [file, route] of [['practice/index.html','/practice/'], ['duo/index.html','/duo/'], ['exams/index.html','/exams/'], ['exams/116-math-a.html','/exams/116-math-a'], ['exams/116-math-a-05.html','/exams/116-math-a-05']]) {
    if (fs.existsSync(path.join(root, file))) entries.push({file, route});
  }
  for (const entry of entries) {
    const file = path.join(root, entry.file);
    let html = clean(fs.readFileSync(file, 'utf8'));
    const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || NAME;
    const description = entry.description || html.match(/<meta name="description" content="([^"]*)">/i)?.[1] || title;
    if (entry.description) html = html.replace(/<meta name="description" content="[^"]*">/i, `<meta name="description" content="${escape(description)}">`);
    html = html.replace(/<link\b[^>]*rel=["']canonical["'][^>]*>\s*/gi, '');
    html = html.replace(/<link\b[^>]*rel=["']icon["'][^>]*>/gi, '<link rel="icon" type="image/svg+xml" href="/favicon.svg">');
    const metadata = [`<link rel="canonical" href="${ORIGIN}${entry.route}">`];
    for (const [property, value] of [['og:site_name',NAME],['og:locale','zh_TW'],['og:type','website'],['og:url',ORIGIN + entry.route],['og:title',plain(title)],['og:description',plain(description)]]) {
      if (!html.includes(`property="${property}"`)) metadata.push(`<meta property="${property}" content="${escape(value)}">`);
    }
    if (entry.route === '/') metadata.push(`<script type="application/ld+json" id="seo-schema">${JSON.stringify({'@context':'https://schema.org','@type':'WebSite',name:NAME,url:ORIGIN+'/',inLanguage:'zh-Hant',description:DESCRIPTION}).replace(/</g, '\\u003c')}</script>`);
    html = html.replace('</head>', block('head', metadata.join('\n')) + '\n</head>');
    const content = entry.content || `${nav}<h1>${escape(plain(title).replace('｜'+NAME,''))}</h1><p>${escape(plain(description))}</p><noscript><p>開啟 JavaScript 後即可使用這個頁面的互動功能。</p></noscript>`;
    html = html.replace('<body>', '<body>\n' + block('content', `<main id="seo-content" class="wrap" style="padding-block:2rem">${content}</main>`));
    // Remove the static copy only after an interactive main heading has mounted successfully.
    html = html.replace('</body>', block('cleanup', '<script>if(document.querySelector("main:not(#seo-content) h1")){document.getElementById("seo-content").remove();}</script>') + '\n</body>');
    fs.writeFileSync(file, html);
  }
  fs.writeFileSync(path.join(root, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`);
  fs.writeFileSync(path.join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.map(entry => `  <url><loc>${ORIGIN}${entry.route}</loc></url>`).join('\n')}\n</urlset>\n`);
  fs.writeFileSync(path.join(root, 'favicon.svg'), '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><path d="M12 1.5c.9 5.6 3.3 8.3 9.5 10.4-6.2 1.6-8.6 4.4-9.5 10.6-1-6.2-3.4-9-9.5-10.6C8.7 9.8 11.1 7.1 12 1.5z" fill="#FFD36E" stroke="#B8860B" stroke-width="1.3"/></svg>\n');
  fs.writeFileSync(path.join(root, '404.html'), `<!doctype html>\n<html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, follow"><title>找不到這個頁面｜${NAME}</title><link rel="stylesheet" href="/assets/css/storybook.css"><link rel="icon" href="/favicon.svg"></head><body><main class="wrap" style="padding-block:4rem"><h1>這條小路還沒通</h1><p>找不到這個頁面，請回到小鎮地圖選擇單元。</p><p><a href="/">回到圖解數學小鎮</a></p></main></body></html>\n`);
  console.log(`Built crawlable HTML and canonical URLs for ${entries.length} pages in ${root}.`);
  return entries;
}

module.exports = {buildSite};
if (require.main === module) {
  const args = process.argv.slice(2);
  const flag = args.indexOf('--root');
  buildSite(flag >= 0 ? args[flag + 1] : path.join(__dirname, '..'));
}
