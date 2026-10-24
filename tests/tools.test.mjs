import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,mkdir,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {suggest} from '../skills/design-to-product/scripts/directions.mjs';
import {evaluate} from '../skills/design-to-product/scripts/lib/evaluate.mjs';
import {localSite} from '../skills/design-to-product/scripts/lib/local-site.mjs';

test('catalog respects unavailable media, surface, uniqueness and requested size',async()=>{
 const result=await suggest({profile:'app',assets:[],count:12,seed:4,keep:['palette']});
 assert.ok(result.directions.every(d=>d.profiles.includes('app')&&d.media.length===0));
 assert.equal(new Set(result.directions.map(d=>d.id)).size,result.directions.length);
 assert.ok(result.directions.length<12);
 assert.deepEqual(result.keep,['palette']);
 assert.deepEqual((await suggest({profile:'app',assets:[],count:12,seed:4})).directions,result.directions);
 await assert.rejects(()=>suggest({profile:'native-unknown'}));
 await assert.rejects(()=>suggest({count:0}));
});

const healthy=()=>({overflow:0,media:{broken:[],missingAlt:0,pending:0},unnamedControls:[],clippedControls:[],contrast:[],unverifiedContrast:[],smallTargets:[],fonts:[],headings:[],sampledTextNodes:20,textSampleLimit:false});
test('functional errors cannot become style advice or be suppressed by extra allow input',()=>{
 const metrics=healthy();metrics.overflow=20;metrics.contrast=[{text:'Price',ratio:3.1,required:4.5}];
 const result=evaluate(metrics,{profile:'app',allow:['horizontal-overflow','text-contrast']});
 assert.deepEqual(result.map(f=>[f.id,f.severity]),[['horizontal-overflow','error'],['text-contrast','error']]);
});
test('unknown contrast stays unverified and a long task heading is not an app failure',()=>{
 const metrics=healthy();metrics.unverifiedContrast=['Title over photo'];metrics.headings=[{tag:'H1',lines:3}];
 assert.equal(evaluate(metrics,{profile:'app'}).filter(f=>f.severity==='error').length,0);
 assert.ok(evaluate(metrics,{profile:'marketing'}).some(f=>f.id==='headline-wrap'&&f.severity==='advice'));
 assert.ok(evaluate(metrics,{profile:'app',contract:{maxHeroLines:2}}).some(f=>f.id==='contract-heading'&&f.severity==='error'));
});
test('static server serves intended assets and blocks secrets, traversal and writes',async()=>{
 const folder=await mkdtemp(join(tmpdir(),'design-tools-test-'));
 let site;
 try{
  await writeFile(join(folder,'index.html'),'<h1>Allowed</h1>');
  await mkdir(join(folder,'.private'));await writeFile(join(folder,'.private','data.json'),'{}');
  site=await localSite(join(folder,'index.html'));
  assert.equal((await fetch(site.url)).status,200);
  const origin=new URL(site.url).origin;
  assert.equal((await fetch(origin+'/.private/data.json')).status,403);
  assert.notEqual((await fetch(origin+'/%2e%2e%2fsecret.json')).status,200);
  assert.equal((await fetch(site.url,{method:'POST',body:'change'})).status,405);
  await assert.rejects(()=>localSite(join(folder,'index.html'),join(folder,'.private')));
 }finally{await site?.close();await rm(folder,{recursive:true,force:true});}
});
