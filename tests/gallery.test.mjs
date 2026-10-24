import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {localSite} from '../skills/design-to-product/scripts/lib/local-site.mjs';
import {withChromium} from '../skills/design-to-product/scripts/lib/chromium.mjs';
const wait=ms=>new Promise(r=>setTimeout(r,ms));
test('gallery control labels and themed popups fit phone and intermediate widths',async()=>{
 const root=resolve('skills/design-to-product'),site=await localSite(resolve(root,'examples/gallery/index.html'),root);
 const out=resolve('.design-to-product/gallery-review');await mkdir(out,{recursive:true});
 try{await withChromium(async browser=>{for(const width of [320,390,540,700,768,960,1024,1440]){
  const page=await browser.page(width,900);try{
   await page.navigate(site.url);for(let n=0;n<30;n++){if(await page.evaluate(()=>document.documentElement.dataset.galleryReady==='true'))break;await wait(50);}
   await page.evaluate(()=>document.querySelector('#examples').parentElement.querySelector('[role=combobox]').click());
   const metrics=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,controls:[...document.querySelectorAll('.select-trigger')].map(e=>{const r=e.getBoundingClientRect();return {clipped:e.scrollWidth>e.clientWidth+1,left:r.left,right:r.right,text:e.textContent};}),popup:(()=>{const r=document.querySelector('.select-popup:not([hidden])').getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom};})()}));
   assert.equal(metrics.overflow,false,JSON.stringify({width,metrics}));assert.ok(metrics.controls.every(e=>!e.clipped&&e.left>=0&&e.right<=width),JSON.stringify({width,metrics}));
   assert.ok(metrics.popup.left>=0&&metrics.popup.right<=width&&metrics.popup.top>=0&&metrics.popup.bottom<=900,JSON.stringify({width,metrics}));
   await writeFile(resolve(out,`gallery-${width}-dropdown.png`),await page.screenshot());
  }finally{await page.close();}
 }});}finally{await site.close();}
});
test('custom select keyboard cancellation, filtering, close feedback and dialog scroll containment',async()=>{
 const root=resolve('skills/design-to-product'),site=await localSite(resolve(root,'examples/gallery/index.html'),root);
 try{await withChromium(async browser=>{const page=await browser.page(768,700);try{
  await page.navigate(site.url);for(let n=0;n<30;n++){if(await page.evaluate(()=>document.documentElement.dataset.galleryReady==='true'))break;await wait(50);}
  await page.evaluate(()=>document.querySelector('#surface').parentElement.querySelector('button').focus());
  const key=async name=>{await page.send('Input.dispatchKeyEvent',{type:'keyDown',key:name});await page.send('Input.dispatchKeyEvent',{type:'keyUp',key:name});};
  await key('ArrowDown');await key('ArrowDown');await key('Escape');assert.equal(await page.evaluate(()=>document.querySelector('#surface').value),'');
  await key('ArrowDown');await key('ArrowDown');await key('Enter');assert.equal(await page.evaluate(()=>document.querySelector('#surface').value),'marketing');assert.equal(await page.evaluate(()=>document.querySelectorAll('.recipe').length),25);
  await page.evaluate(()=>{window.scrollTo(0,500);document.querySelector('[data-id]').click();});
  for(let n=0;n<30;n++){if(await page.evaluate(()=>document.querySelector('#detail-body h2')))break;await wait(50);}
  const before=await page.evaluate(()=>({y:scrollY,locked:getComputedStyle(document.documentElement).overflow,close:document.querySelector('#close').getAttribute('aria-label'),text:document.querySelector('#close').textContent}));
  assert.equal(before.locked,'hidden');assert.equal(before.close,'Close dialog');assert.equal(before.text,'');
  const rect=await page.evaluate(()=>{const r=document.querySelector('#close').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};});
  const idle=await page.evaluate(()=>getComputedStyle(document.querySelector('#close')).backgroundColor);await page.send('Input.dispatchMouseEvent',{type:'mouseMoved',...rect});await wait(200);assert.notEqual(await page.evaluate(()=>getComputedStyle(document.querySelector('#close')).backgroundColor),idle);
  await page.evaluate(()=>{document.querySelector('.recipe-technical').open=true;const dialog=document.querySelector('dialog');dialog.scrollTop=dialog.scrollHeight;});
  await page.send('Input.dispatchMouseEvent',{type:'mouseWheel',x:380,y:500,deltaX:0,deltaY:600});await wait(150);assert.equal(await page.evaluate(()=>scrollY),before.y);
  await page.evaluate(()=>document.querySelector('#close').click());assert.notEqual(await page.evaluate(()=>getComputedStyle(document.documentElement).overflow),'hidden');assert.equal(await page.evaluate(()=>scrollY),before.y);
 }finally{await page.close();}});}finally{await site.close();}
});
