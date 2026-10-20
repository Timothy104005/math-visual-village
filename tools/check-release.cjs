/* Structural checks independent of the lesson renderer; run from a repository root. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const repo = process.cwd(), site = path.join(repo, 'site');
const files = dir => fs.readdirSync(dir, {withFileTypes:true}).flatMap(e => e.isDirectory() ? files(path.join(dir,e.name)) : [path.join(dir,e.name)]);
const box = {window:{}};
vm.runInNewContext(fs.readFileSync(path.join(site,'assets/js/catalog.js'),'utf8'),box);
const units = box.window.CATALOG.units;
assert.equal(new Set(units.map(u=>u.slug)).size, units.length, 'duplicate slugs');
const slugs = new Set(units.map(u=>u.slug));
for (const u of units) {
  assert(fs.existsSync(path.join(site,'units',u.slug+'.html')), 'missing HTML: '+u.slug);
  assert(fs.existsSync(path.join(site,'units',u.slug+'.js')), 'missing JS: '+u.slug);
  for(const link of u.links||[])assert(slugs.has(link),'unknown linked unit: '+link);
}
// Release-scope gate: official-paper copies must never be part of this distribution.
const forbidden=path.join(site,'assets/papers');
assert(!fs.existsSync(forbidden)||fs.readdirSync(forbidden).length===0,'official-paper directory must be empty');
for(const file of files(site)) {
  if(file.endsWith('.pdf'))assert(path.relative(site,file).replaceAll('\\','/').startsWith('assets/exams/116/'),'unreviewed PDF location: '+file);
}
let scripts=0, pages=0, deps=0;
const missing=[];
for(const file of files(site)) {
  if (/\.(?:js|cjs)$/.test(file)) {new vm.Script(fs.readFileSync(file,'utf8'),{filename:path.relative(repo,file)});scripts++;}
  if (!file.endsWith('.html'))continue;
  pages++;
  const html=fs.readFileSync(file,'utf8');
  for(const match of html.matchAll(/<(script|link|img)\b[^>]*>/gi)) {
    const tag=match[0],kind=match[1].toLowerCase();
    if(kind==='link'&&!/\brel=["'](?:stylesheet|icon)["']/i.test(tag))continue;
    const attr=/\b(?:src|href)=["']([^"']+)["']/i.exec(tag);
    if(!attr)continue;
    const url=attr[1].split(/[?#]/)[0];
    if(!url||/^(?:[a-z]+:|\/\/)/i.test(url))continue;
    const target=url.startsWith('/')?path.join(site,url):path.resolve(path.dirname(file),url);
    deps++;
    if(!fs.existsSync(target))missing.push(path.relative(site,file)+' -> '+url);
  }
}
assert.deepEqual(missing,[],'missing page dependencies');
const cfg={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(site,'assets/js/account-config.js'),'utf8'),cfg);
assert.equal(cfg.window.ACCOUNT_CONFIG.anonKey,'','fork must not use production account settings');
assert.equal(cfg.window.ACCOUNT_CONFIG.supabaseUrl,'');
console.log(JSON.stringify({units:units.length,htmlPages:pages,parsedScripts:scripts,localDependencies:deps,accountIntegration:'disabled'}));
