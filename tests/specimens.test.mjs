import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {withChromium} from '../skills/design-to-product/scripts/lib/chromium.mjs';
import {localSite} from '../skills/design-to-product/scripts/lib/local-site.mjs';
import {measure} from '../skills/design-to-product/scripts/lib/measure.mjs';
import {evaluate} from '../skills/design-to-product/scripts/lib/evaluate.mjs';
const groups={marketing:['artifact-demonstration','editorial-proof','contextual-place','output-gallery','guided-comparison','process-cutaway'],'product-web':['search-workbench','booking-decision','cart-review','upload-review','collection-curator','permission-console'],mobile:['capture-review','daily-brief','route-companion','conversation-focus','collection-pocket','quiet-timer'],desktop:['document-studio','media-library','timeline-editor','command-workbench','file-transfer','connection-inspector'],dashboard:['exception-triage','operations-board','comparison-table','cohort-explorer','audit-trail','capacity-planner'],game:['focus-hud','tactical-command','route-map','inventory-bench','run-preparation','results-recap']};
test('36 browser studies render at short phone and desktop sizes with truthful alternate states',async()=>{
 const root=resolve('skills/design-to-product');const site=await localSite(resolve(root,'examples/specimens/index.html'),root);
 const out=resolve('.design-to-product/specimens');await mkdir(out,{recursive:true});const records=[];
 try{await withChromium(async browser=>{
  for(const [surface,screens] of Object.entries(groups))for(const screen of screens){
   for(const [width,height,state] of [[320,568,'normal'],[390,844,'stress'],[1440,900,'normal']]){
    const page=await browser.page(width,height,false,{touch:width<600});
    try{const url=new URL(site.url);url.search=new URLSearchParams({surface,screen,state});await page.navigate(url.href);
     assert.equal(await page.evaluate(()=>document.documentElement.dataset.specimenReady),'true',`${surface}/${screen} ready`);
     const metrics=await page.evaluate(measure),findings=evaluate(metrics,{profile:surface==='marketing'?'marketing':'app'});
     const errors=findings.filter(f=>f.severity==='error');assert.equal(page.issues.filter(i=>i.type!=='console-error').length,0,JSON.stringify(page.issues));
     const file=`${surface}-${screen}-${width}-${state}.png`;await writeFile(resolve(out,file),await page.screenshot(true));
     records.push({surface,screen,width,height,state,screenshot:file,errors,findings});
    }finally{await page.close();}
   }
  }
 });}finally{await site.close();await writeFile(resolve(out,'report.json'),JSON.stringify({method:'Chromium DOM sampling and screenshots',nativeBehavior:'unverified',records},null,2));}
 const broken=records.filter(r=>r.errors.length);assert.equal(broken.length,0,JSON.stringify(broken.map(r=>({id:`${r.surface}/${r.screen}`,width:r.width,errors:r.errors})),null,2));
});
test('catalog filtering, recipe dialog, booking review, timer and message interactions work locally',async()=>{
 const root=resolve('skills/design-to-product'),site=await localSite(resolve(root,'examples/gallery/index.html'),root);
 try{await withChromium(async browser=>{
  const page=await browser.page(390,844);try{
   await page.navigate(site.url);for(let n=0;n<30;n++){if(await page.evaluate(()=>document.documentElement.dataset.galleryReady==='true'))break;await new Promise(r=>setTimeout(r,100));}
   assert.equal(await page.evaluate(()=>document.querySelectorAll('.recipe').length),150);
   await page.evaluate(()=>{const select=document.querySelector('#surface');select.value='mobile';select.dispatchEvent(new Event('input'));});assert.equal(await page.evaluate(()=>document.querySelectorAll('.recipe').length),25);
   await page.evaluate(()=>document.querySelector('[data-id]').click());for(let n=0;n<30;n++){if(await page.evaluate(()=>document.querySelector('#detail-body h2')!==null))break;await new Promise(r=>setTimeout(r,100));}
   assert.equal(await page.evaluate(()=>document.querySelector('dialog').open),true);assert.ok(await page.evaluate(()=>document.querySelector('#detail-body h2').textContent.length>0));
   const base=new URL('../specimens/index.html',site.url);
   for(const [surface,screen,action,expected] of [['product-web','booking-decision',()=>document.querySelector('form').requestSubmit(),()=>document.querySelector('[role=dialog]')?.textContent.includes('No reservation')],['mobile','conversation-focus',()=>{document.querySelector('[name=message]').value='Local test message';document.querySelector('form').requestSubmit();},()=>document.querySelector('#messages').textContent.includes('Local test message')],['mobile','quiet-timer',()=>document.querySelector('[data-action=timer]').click(),()=>document.querySelector('[data-action=timer]').textContent==='Pause']]){
    const url=new URL(base);url.search=new URLSearchParams({surface,screen});await page.navigate(url.href);await page.evaluate(action);assert.equal(await page.evaluate(expected),true,`${surface}/${screen} interaction`);
   }
  }finally{await page.close();}
 });}finally{await site.close();}
});
