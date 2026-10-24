import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm,writeFile,access} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {inspect} from '../skills/design-to-product/scripts/inspect.mjs';

test('real Chromium: text outside a painted ancestor does not inherit a fabricated contrast background',async()=>{
 const folder=await mkdtemp(join(tmpdir(),'design-contrast-test-'));
 try{
  const report=await inspect(fileURLToPath(new URL('./fixtures/outside-background.html',import.meta.url)),{profile:'app',widths:[390],out:folder});
  assert.ok(!report.findings.some(f=>f.id==='text-contrast'));
  assert.ok(report.viewports[0].metrics.unverifiedContrast.includes('North route'));
 }finally{await rm(folder,{recursive:true,force:true});}
});

test('real Chromium: usable app needs neither decorative media nor animation',async()=>{
 const folder=await mkdtemp(join(tmpdir(),'design-browser-test-'));
 try{
  const result=await inspect(fileURLToPath(new URL('./fixtures/readable.html',import.meta.url)),{profile:'app',widths:[320,390],reducedMotion:true,out:folder});
  assert.equal(result.summary.errors,0,JSON.stringify(result.findings));
  assert.ok(result.viewports.every(v=>v.metrics.reducedMotion));
  assert.ok(result.viewports.every(v=>v.metrics.contrast.length===0));
 }finally{await rm(folder,{recursive:true,force:true});}
});
test('real Chromium: broken resources, runtime, names, overflow and contrast fail',async()=>{
 const folder=await mkdtemp(join(tmpdir(),'design-browser-test-'));
 try{
  const result=await inspect(fileURLToPath(new URL('./fixtures/broken.html',import.meta.url)),{profile:'dashboard',widths:[390],out:folder});
  const ids=new Set(result.findings.filter(f=>f.severity==='error').map(f=>f.id));
  for(const id of ['horizontal-overflow','broken-image','missing-alt','control-name','text-contrast','exception'])assert.ok(ids.has(id),`${id}: ${JSON.stringify(result.findings)}`);
 }finally{await rm(folder,{recursive:true,force:true});}
});
test('real Chromium: overlapping artwork produces unverified contrast, not a guessed solid-background failure',async()=>{
 const folder=await mkdtemp(join(tmpdir(),'design-browser-test-'));
 try{
  const result=await inspect(fileURLToPath(new URL('./fixtures/overlay.html',import.meta.url)),{profile:'marketing',widths:[390],out:folder});
  assert.ok(result.findings.some(f=>f.id==='contrast-unverified'));
  assert.ok(!result.findings.some(f=>f.id==='text-contrast'));
 }finally{await rm(folder,{recursive:true,force:true});}
});

test('real Chromium: descendant headings, link targets, vertical clipping and uncertain names have evidence',async()=>{
 const folder=await mkdtemp(join(tmpdir(),'design-baseline-test-'));
 try{
  const fixture=join(folder,'index.html');
  await writeFile(fixture,`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Baseline faults</title><style>body{margin:20px;background:white;color:black;font:18px Arial}h1{width:180px;font-size:32px}button{font:inherit}.vertical{height:22px;overflow:hidden;width:90px;line-height:28px}.clip{height:20px;overflow:hidden}.clip button{height:50px}.nav{display:inline-block;width:20px;height:20px}</style><h1><span>Several words wrap across lines</span></h1><a class="nav" href="#">Go</a><p>A paragraph with an <a href="#">inline text link</a>.</p><button class="vertical">Long content wraps</button><div class="clip"><button>Clipped by parent</button></div><div role="switch" tabindex="0" style="width:30px;height:30px"></div><button id="unnamed"></button></html>`);
  const result=await inspect(fixture,{profile:'app',viewports:[{width:320,height:568}],touch:true,mobile:true,contract:{maxHeroLines:2},out:join(folder,'report')});
  const ids=new Set(result.findings.map(f=>f.id));
  for(const id of ['contract-heading','target-size','clipped-control','ancestor-clipping','control-name-unverified','control-name'])assert.ok(ids.has(id),JSON.stringify(result.findings));
  const viewport=result.viewports[0];
  assert.equal(viewport.height,568);
  assert.equal(viewport.emulation.touch,true);
  assert.equal(viewport.emulation.nativeBehavior,'unverified');
  assert.equal(viewport.readiness.documentComplete,true);
  assert.equal(viewport.readiness.applicationReady,'unverified');
  assert.ok(viewport.metrics.targetExceptions.some(e=>e.reason==='inline-text-link'));
  assert.equal(viewport.metrics.headings.length,1);
 }finally{await rm(folder,{recursive:true,force:true});}
});

test('real Chromium: inline heading styles, SVG naming, scroll containers and disabled targets are counterexamples',async()=>{
 const folder=await mkdtemp(join(tmpdir(),'design-counterexample-test-'));
 try{
  const fixture=join(folder,'index.html');
  await writeFile(fixture,`<!doctype html><html lang="en"><meta charset="utf-8"><title>Counterexamples</title><style>body{margin:20px;background:white;color:black;font:18px Arial}h1{font-size:28px}button{min-height:48px;min-width:48px;font:inherit}.scroll{height:30px;overflow:auto}.scroll button{height:60px}</style><h1>A <em>short</em> title<sup>2</sup></h1><button><svg width="20" height="20"><title>Open settings</title><rect width="20" height="20"/></svg></button><div class="scroll"><button>Scrollable option</button></div><button style="min-width:10px;min-height:10px" disabled>Off</button></html>`);
  const result=await inspect(fixture,{profile:'app',widths:[390],contract:{maxHeroLines:1},out:join(folder,'report')});
  assert.ok(!result.findings.some(f=>['contract-heading','control-name','control-name-unverified','ancestor-clipping'].includes(f.id)),JSON.stringify(result.findings));
  assert.equal(result.viewports[0].metrics.headings[0].lines,1);
  assert.ok(!result.viewports[0].metrics.smallTargets.some(e=>e.name==='Off'));
 }finally{await rm(folder,{recursive:true,force:true});}
});

test('real Chromium: bounded occlusion separates blocking layers from children, menus and modal overlays; whitespace stays advice',async()=>{
 const folder=await mkdtemp(join(tmpdir(),'design-occlusion-test-'));
 try{
  const fixture=join(folder,'index.html');
  await writeFile(fixture,`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Occlusion fault and counterexamples</title><style>body{margin:0;background:white;color:black;font:18px Arial}button,.cover{position:absolute;left:20px;width:160px;height:48px;font:inherit}button{background:white;color:black}.cover{background:#eee}#blocking{top:70px}#unexpected-layer{top:70px}#child-control{top:140px}#menu-control{top:210px}#menu-layer{top:210px}#modal-control{top:280px}#modal-layer{top:280px}section{position:relative;top:400px;height:900px}section h2{margin:0;padding-top:40px}</style><button id="blocking">Blocked action</button><div class="cover" id="unexpected-layer">Blocking layer</div><button id="child-control"><span>Child hit allowed</span></button><button id="menu-control">Behind menu</button><div class="cover" id="menu-layer" role="menu">Open menu</div><button id="modal-control">Behind modal</button><div class="cover" id="modal-layer" role="dialog" aria-modal="true">Open dialog</div><section id="intentional-rest"><h2>Deliberate pause</h2></section></html>`);
  const result=await inspect(fixture,{profile:'app',viewports:[{width:390,height:568},{width:390,height:844}],out:join(folder,'report')});
  assert.equal(result.viewports.length,2);
  assert.notEqual(result.viewports[0].screenshots.fold,result.viewports[1].screenshots.fold);
  for(const v of result.viewports){
   await access(join(folder,'report',v.screenshots.fold));
   const occluded=v.metrics.occludedControls;
   assert.equal(occluded.length,1,JSON.stringify(occluded));
   assert.equal(occluded[0].name,'Blocked action');
   assert.equal(occluded[0].confidence,'high');
   assert.ok(occluded[0].coordinates.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)));
   assert.equal(v.metrics.occlusionExceptions.length,2);
   assert.ok(Number.isInteger(v.metrics.uncertaintyCounts.contrast));
  }
  assert.ok(result.findings.some(f=>f.id==='control-occlusion'&&f.severity==='warning'));
  assert.ok(result.findings.some(f=>f.id==='sparse-region'&&f.severity==='advice'));
  assert.ok(!result.findings.some(f=>f.id==='sparse-region'&&f.severity==='error'));
  await assert.rejects(()=>inspect(fixture,{viewports:[{width:390,height:568},{width:390,height:568}],out:join(folder,'duplicate')}),/tuples must be unique/);
 }finally{await rm(folder,{recursive:true,force:true});}
});
