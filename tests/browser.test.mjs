import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {inspect} from '../skills/design-to-product/scripts/inspect.mjs';

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
