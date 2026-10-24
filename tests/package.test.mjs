import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,writeFile,symlink,unlink,access,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {packageSkill} from '../scripts/package-skill.mjs';

test('skill export retains runnable source and evidence while excluding native builds and local state',async()=>{
 const temp=await mkdtemp(join(tmpdir(),'dtp-export-')),out=join(temp,'design-to-product');
 try{
  const report=await packageSkill(out);assert.ok(report.files>400);assert.ok(report.bytes<20*1024*1024);
  const paths=report.manifest.map(e=>e.path);assert.ok(paths.includes('examples/native-lab/lib/main.dart'));assert.ok(paths.includes('evals/native-windows/report.json'));assert.ok(paths.includes('examples/showcase/manifest.json'));
  assert.ok(!paths.some(path=>/(^|\/)(build|\.dart_tool|\.idea|ephemeral|node_modules)(\/|$)/.test(path)));
  for(const entry of report.manifest){const data=await readFile(join(out,entry.path));assert.equal(createHash('sha256').update(data).digest('hex'),entry.sha256);}
  await access(`${out}.manifest.json`);await assert.rejects(()=>packageSkill(out),/already exists/);
  const collision=join(temp,'collision');await writeFile(`${collision}.manifest.json`,'keep');
  await assert.rejects(()=>packageSkill(collision),/manifest already exists/);assert.equal(await readFile(`${collision}.manifest.json`,'utf8'),'keep');
 }finally{await rm(temp,{recursive:true,force:true});}
});

test('skill export cannot be redirected into source through a directory link',async t=>{
 const temp=await mkdtemp(join(tmpdir(),'dtp-link-')),link=join(temp,'source-link');let linked=false;
 try{
  try{await symlink(fileURLToPath(new URL('../skills/design-to-product',import.meta.url)),link,process.platform==='win32'?'junction':'dir');linked=true;}catch(error){if(['EPERM','EACCES'].includes(error.code)){t.skip('Directory links unavailable on this host.');return;}throw error;}
  await assert.rejects(()=>packageSkill(join(link,'not-an-export')),/outside the source/);
 }finally{if(linked)await unlink(link);await rm(temp,{recursive:true,force:true});}
});
