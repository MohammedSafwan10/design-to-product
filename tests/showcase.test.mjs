import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {withChromium} from '../skills/design-to-product/scripts/lib/chromium.mjs';
import {localSite} from '../skills/design-to-product/scripts/lib/local-site.mjs';
import {measure} from '../skills/design-to-product/scripts/lib/measure.mjs';
import {evaluate} from '../skills/design-to-product/scripts/lib/evaluate.mjs';
const root=resolve('skills/design-to-product'),base=resolve(root,'examples/showcase');
const manifest=JSON.parse(await readFile(resolve(base,'manifest.json'),'utf8'));
test('twelve distinct studies have bounded browser evidence across four widths',async()=>{
 const site=await localSite(resolve(base,'index.html'),root),out=resolve('.design-to-product/showcase-final');await mkdir(out,{recursive:true});await mkdir(resolve(base,'previews'),{recursive:true});const records=[];
 try{await withChromium(async browser=>{for(const entry of manifest.entries)for(const [width,height] of [[320,568],[390,844],[768,900],[1440,900]]){
  const page=await browser.page(width,height,true,{touch:width<600});try{
   await page.navigate(new URL(`${entry.id}/index.html`,site.url).href);
   const metrics=await page.evaluate(measure),findings=evaluate(metrics,{profile:entry.surface==='marketing'?'marketing':'app'});
   const errors=findings.filter(f=>f.severity==='error');const name=`${entry.id}-${width}.png`;await writeFile(resolve(out,name),await page.screenshot(true));
   if(width===(entry.surface==='mobile'?390:1440))await writeFile(resolve(base,'previews',`${entry.id}.png`),await page.screenshot());
   records.push({id:entry.id,width,height,errors,findings,runtime:page.issues});
  }finally{await page.close();}
 }});}finally{await site.close();await writeFile(resolve(out,'report.json'),JSON.stringify({method:'Chromium DOM sampling and screenshots, not a taste score',records},null,2));}
 assert.equal(records.filter(r=>r.errors.length||r.runtime.length).length,0,JSON.stringify(records.filter(r=>r.errors.length||r.runtime.length)));
});
test('local interactions preserve honest failures and domain state across the study set',async()=>{
 const site=await localSite(resolve(base,'index.html'),root);
 const scenarios=[
  ['market-letterpress',()=>{document.querySelector('[aria-label="Oxblood"]').click();return document.querySelector('#ink-status').textContent.includes('Oxblood');}],
  ['market-brutalist',()=>{const buttons=[...document.querySelectorAll('[data-filter]')];buttons.at(-1).click();return buttons.at(-1).getAttribute('aria-pressed')==='true';}],
  ['market-botanical',()=>{document.querySelector('#sun').value='0';document.querySelector('form').requestSubmit();return document.querySelector('#result').textContent.includes('Too little');}],
  ['market-kinetic',()=>{document.querySelector('#light').checked=false;document.querySelector('#review').click();return document.querySelector('#result').textContent.includes('Lights are required');}],
  ['product-booking',()=>{document.querySelector('#review').click();return document.querySelector('#failure').hidden===false;}],
  ['product-inventory',()=>{document.querySelector('[data-id="BR-608"]').click();const focused=document.activeElement.id==='qty';document.querySelector('#qty').value='999';document.querySelector('form').requestSubmit();return focused&&document.querySelector('#result').textContent.includes('Not enough stock');}],
  ['dashboard-science',()=>{document.querySelector('[data-sample="Control"]').click();return document.querySelector('#peak').textContent==='No peak';}],
  ['dashboard-editorial',()=>{document.querySelector('[data-route="East"]').click();document.querySelector('form').requestSubmit();return document.querySelector('#result').textContent.includes('Cannot assign')&&document.querySelector('[data-route="East"]').getAttribute('aria-pressed')==='true';}],
  ['mobile-transit',()=>{document.querySelector('#start').click();return document.querySelector('#journey-status').textContent.includes('unavailable');}],
  ['mobile-music',()=>{document.querySelector('#play').click();return document.querySelector('#result').textContent.includes('Audio unavailable');}],
  ['desktop-audio',()=>{document.querySelector('.track .mute').click();document.querySelector('#export').click();return document.querySelector('.track .mute').getAttribute('aria-pressed')==='true'&&document.querySelector('#export-status').textContent.includes('unavailable');}],
  ['game-tactical',()=>{document.querySelector('[data-route="outer"]').click();document.querySelector('#commit').click();return document.querySelector('#result').textContent.includes('Insufficient fuel');}],
 ];
 try{await withChromium(async browser=>{const page=await browser.page(390,844);try{for(const [id,action] of scenarios){await page.navigate(new URL(`${id}/index.html`,site.url).href);assert.equal(await page.evaluate(action),true,id);}}finally{await page.close();}});}finally{await site.close();}
});
