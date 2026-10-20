// Check the public crawl surface, either on disk or through the real HTTP routes.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');

const args = process.argv.slice(2);
const option = name => args.includes(name) ? args[args.indexOf(name) + 1] : null;
const root = path.resolve(option('--root') || path.join(__dirname, '..'));
const origin = 'https://math-visual-village.pages.dev';
const remote = option('--url');
const ctx = {window: {}};
vm.runInNewContext(fs.readFileSync(path.join(root, 'assets/js/catalog.js'), 'utf8'), ctx);
const units = ctx.window.CATALOG.units.filter(u => u.ready);
const failures = [];
function check(label, test) {
  try { test(); } catch (error) { failures.push(`${label}: ${error.message}`); }
}
function pageCheck(html, url) {
  assert(html.includes(`<link rel="canonical" href="${url}">`), 'missing canonical');
  assert(/<main id="seo-content"/.test(html), 'missing initial HTML content');
  assert(/<h1[ >]/.test(html), 'missing initial heading');
  assert(!/noindex/i.test(html), 'public page is noindex');
}

async function main() {
  if (!remote) {
    for (const file of ['robots.txt', 'sitemap.xml', '404.html', 'favicon.svg']) {
      check(file, () => assert(fs.existsSync(path.join(root, file)), 'missing file'));
    }
    check('homepage', () => {
      const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
      pageCheck(html, origin + '/');
      const schema = JSON.parse(html.match(/<script type="application\/ld\+json" id="seo-schema">([\s\S]*?)<\/script>/)[1]);
      assert.equal(schema['@type'], 'WebSite');
      assert.equal(schema.name, '圖解數學小鎮');
      for (const u of units) assert(html.includes(`href="/units/${u.slug}"`), `missing link: ${u.slug}`);
    });
    for (const u of units) check(u.slug, () => pageCheck(fs.readFileSync(path.join(root, 'units', u.slug + '.html'), 'utf8'), `${origin}/units/${u.slug}`));
    check('sitemap', () => {
      const xml = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
      const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
      assert.equal(urls.length, new Set(urls).size, 'duplicate URLs');
      assert(urls.includes(origin + '/'), 'missing homepage');
      assert(!urls.some(url => /notebook|\.html|\?|#/.test(url)), 'noncanonical or private URL');
      for (const u of units) assert(urls.includes(`${origin}/units/${u.slug}`), `missing unit: ${u.slug}`);
      for (const url of urls) {
        const route = new URL(url).pathname;
        const file = route.endsWith('/') ? route.slice(1) + 'index.html' : route.slice(1) + '.html';
        pageCheck(fs.readFileSync(path.join(root, file), 'utf8'), url);
      }
      console.log(`Checked ${urls.length} sitemap pages.`);
    });
    check('robots', () => assert(fs.readFileSync(path.join(root, 'robots.txt'), 'utf8').includes(`Sitemap: ${origin}/sitemap.xml`)));
    check('404', () => assert(/noindex/.test(fs.readFileSync(path.join(root, '404.html'), 'utf8'))));
  } else {
    const get = async route => {
      const response = await fetch(new URL(route, remote), {signal: AbortSignal.timeout(20000)});
      return {response, html: await response.text()};
    };
    const sitemap = await get('/sitemap.xml');
    check('sitemap HTTP', () => {
      assert.equal(sitemap.response.status, 200);
      assert(/xml/.test(sitemap.response.headers.get('content-type')), 'not XML');
      assert(sitemap.html.includes('<urlset'), 'not a sitemap');
    });
    const robots = await get('/robots.txt');
    check('robots HTTP', () => {
      assert.equal(robots.response.status, 200);
      assert(/text\/plain/.test(robots.response.headers.get('content-type')), 'not plain text');
      assert(robots.html.includes(`Sitemap: ${origin}/sitemap.xml`));
    });
    const missing = await get('/seo-check-this-page-does-not-exist');
    check('missing page HTTP', () => assert.equal(missing.response.status, 404));
    const urls = [...sitemap.html.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
    check('sitemap URLs', () => assert(urls.length >= units.length + 1));
    let index = 0;
    await Promise.all(Array.from({length: 6}, async () => {
      while (index < urls.length) {
        const url = urls[index++];
        try {
          const route = new URL(url).pathname;
          const {response, html} = await get(route);
          check(route, () => {
            assert.equal(response.status, 200);
            assert.equal(new URL(response.url).pathname, route, 'canonical URL redirects');
            assert(!/noindex/i.test(response.headers.get('x-robots-tag') || ''), 'noindex header');
            pageCheck(html, url);
          });
        } catch (error) { failures.push(`${url}: ${error.message}`); }
      }
    }));
    console.log(`Checked ${urls.length} live sitemap pages and robots/404 routes.`);
  }
  if (failures.length) {
    console.error(failures.join('\n'));
    process.exitCode = 1;
  } else console.log('SEO crawl checks passed. Google ranking/indexing is checked separately in Search Console.');
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
