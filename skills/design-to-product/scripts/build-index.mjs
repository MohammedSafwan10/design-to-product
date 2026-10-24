#!/usr/bin/env node
import {readdir,readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {SURFACES} from './library.mjs';
const root=fileURLToPath(new URL('../library/',import.meta.url));
const index={schemaVersion:1,status:'draft',surfaces:SURFACES,entries:[],modules:{}};
for(const surface of SURFACES){
 for(const name of (await readdir(join(root,'recipes',surface))).filter(n=>n.endsWith('.json')).sort()){
  const recipe=JSON.parse(await readFile(join(root,'recipes',surface,name),'utf8'));
  index.entries.push(Object.fromEntries(['id','title','surface','familyId','tasks','density','inputModes','requiredAssets','reviewStatus'].map(k=>[k,recipe[k]])));
  index.entries.at(-1).path=`recipes/${surface}/${name}`;
 }
}
for(const group of ['families','patterns','compositions','typography','palettes','imagery']){
 index.modules[group]={};
 for(const name of (await readdir(join(root,group))).filter(n=>n.endsWith('.json')).sort()){
  const item=JSON.parse(await readFile(join(root,group,name),'utf8'));
  if(index.modules[group][item.id])throw Error(`Duplicate ${group} ID: ${item.id}`);
  index.modules[group][item.id]=`${group}/${name}`;
 }
}
await writeFile(join(root,'index.json'),JSON.stringify(index,null,2)+'\n');
console.log(`Indexed ${index.entries.length} draft-status-aware recipes.`);
