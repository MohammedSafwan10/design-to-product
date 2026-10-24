import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,cp,readFile,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {validateLibrary,queryIndex,loadRecipe,contrastRatio} from '../skills/design-to-product/scripts/library.mjs';
import {suggestSurface} from '../skills/design-to-product/scripts/directions.mjs';
import {createHash} from 'node:crypto';

test('published native evidence matches portable source fingerprints and original capture bytes',async()=>{
 const root=new URL('../skills/design-to-product/',import.meta.url);
 const report=JSON.parse(await readFile(new URL('evals/native-windows/report.json',root),'utf8'));
 assert.ok(report.sourceHashNormalization.includes('CRLF normalized to LF'));
 for(const [path,digest] of Object.entries(report.sourceSha256)){
  const bytes=await readFile(new URL(`examples/native-lab/${path}`,root));
  const canonical=Buffer.from(bytes.toString('utf8').replace(/\r\n/g,'\n'),'utf8');
  assert.equal(createHash('sha256').update(canonical).digest('hex'),digest,path);
 }
 for(const capture of report.captures){const bytes=await readFile(new URL(`evals/native-windows/${capture.artifact}`,root));assert.equal(createHash('sha256').update(bytes).digest('hex'),capture.sha256,capture.artifact);}
});
test('catalog resolves all linked modules and distinguishes candidates from reviewed work',async()=>{
 const result=await validateLibrary();assert.equal(result.valid,true,JSON.stringify(result.errors));assert.equal(result.total,150);
 assert.ok(Object.values(result.counts).every(n=>n===25));assert.deepEqual(result.statusCounts,{draft:150});
 const mobile=await queryIndex({surface:'mobile',tasks:['capture'],inputModes:['touch']});assert.equal(mobile.length,1);
 assert.equal(mobile[0].id,'mobile/capture-review');assert.equal((await queryIndex({includeDraft:false})).length,0);
 const recipe=await loadRecipe(mobile[0].id,{modules:true});assert.equal(recipe.modules.typography.length,1);assert.ok(!recipe.modules.typography.some(t=>t.id==='data-grotesk'));
 await assert.rejects(()=>queryIndex({surface:'unknown'}));await assert.rejects(()=>loadRecipe('../../private'));
 assert.equal(contrastRatio('#000000','#ffffff'),21);
 const options={surface:'mobile',count:3,seed:8,keep:['palette']};
 const first=await suggestSurface(options),second=await suggestSurface(options);
 assert.deepEqual(first,second);assert.equal(new Set(first.directions.map(r=>r.familyId)).size,3);
 assert.deepEqual(first.keep,['palette']);
});
test('review promotion rejects fake evidence and missing or unsafe render paths',async()=>{
 const folder=await mkdtemp(join(tmpdir(),'dtp-library-'));
 try{
  await cp(fileURLToPath(new URL('../skills/design-to-product/library/',import.meta.url)),folder,{recursive:true});
  const indexPath=join(folder,'index.json'),index=JSON.parse(await readFile(indexPath,'utf8')),entry=index.entries[0];
  const path=join(folder,entry.path),recipe=JSON.parse(await readFile(path,'utf8'));
  entry.reviewStatus=recipe.reviewStatus='validated';recipe.examplePaths=[{state:'normal',path:'../escape.png'}];recipe.evidence=[{method:'opinion'}];
  await writeFile(indexPath,JSON.stringify(index));await writeFile(path,JSON.stringify(recipe));
  const result=await validateLibrary({root:folder});assert.equal(result.valid,false);
  assert.ok(result.errors.some(e=>e.includes('normal and stress')));assert.ok(result.errors.some(e=>e.includes('missing or unsafe example')));
  assert.ok(result.errors.some(e=>e.includes('task-study')));assert.ok(result.errors.some(e=>e.includes('review evidence needs')));
 }finally{await rm(folder,{recursive:true,force:true});}
});
