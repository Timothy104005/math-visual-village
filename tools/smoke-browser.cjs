// Browser initialization smoke check; does not certify scientific accuracy or all controls.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=process.cwd(),base=process.env.SMOKE_URL;
if(!base)throw new Error('Set SMOKE_URL to a locally served site.');
const box={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'site/assets/js/catalog.js'),'utf8'),box);
(async()=>{
  const browser=await chromium.launch({channel:'chrome',headless:true});
  const results=[];let cursor=0;
  try{
    await Promise.all(Array.from({length:4},async()=>{
      const context=await browser.newContext({viewport:{width:1280,height:900}});
      await context.route('**/*',route=>new URL(route.request().url()).origin===new URL(base).origin?route.continue():route.abort());
      const page=await context.newPage();
      let errors=[];
      page.on('pageerror',e=>errors.push(e.message));
      for(;;){
        const unit=box.window.CATALOG.units[cursor++];if(!unit)break;
        errors=[];
        try{
          const response=await page.goto(base+'/units/'+unit.slug+'.html',{waitUntil:'load'});
          await page.waitForTimeout(60);
          const state=await page.evaluate(()=>({heading:!!document.querySelector('h1'),svg:document.querySelectorAll('svg').length,body:document.body.innerText.length,login:window.ACCOUNT&&window.ACCOUNT.available()}));
          results.push({slug:unit.slug,http:response.status(),...state,errors:[...errors]});
        }catch(e){results.push({slug:unit.slug,errors:[e.message]});}
      }
      await context.close();
    }));
    const failures=results.filter(r=>r.http!==200||!r.heading||r.body<100||r.errors.length||r.login===true);
    const summary={tested:results.length,failed:failures.length,mode:'desktop initialization; external requests blocked',failures,results};
    const output=process.env.SMOKE_REPORT||path.join(root,'output/browser-smoke.json');
    fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(summary,null,2));
    console.log(JSON.stringify({tested:results.length,failed:failures.length,report:output,failures:failures.map(r=>({slug:r.slug,errors:r.errors}))}));
    if(failures.length)process.exitCode=1;
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
