#!/usr/bin/env node
import {execFileSync} from 'node:child_process';
import {mkdir,readFile,writeFile,realpath,lstat,access} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve,relative,isAbsolute,dirname,basename} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

const repo=fileURLToPath(new URL('../',import.meta.url));
const prefix='skills/design-to-product';
const within=(base,path)=>{const rel=relative(base,path);return !isAbsolute(rel)&&rel!=='..'&&!rel.startsWith('../')&&!rel.startsWith('..\\');};

/** Export source controlled/visible to Git, never the whole working directory. */
export async function packageSkill(destination){
 if(!destination)throw Error('Pass a new output directory. Existing directories are never overwritten.');
 const source=await realpath(resolve(repo,prefix)),out=resolve(destination);
 let ancestor=dirname(out);
 while(true){try{await lstat(ancestor);break;}catch(error){if(error.code!=='ENOENT')throw error;const parent=dirname(ancestor);if(parent===ancestor)throw error;ancestor=parent;}}
 const canonicalOut=resolve(await realpath(ancestor),relative(ancestor,out));
 if(within(source,out)||within(source,canonicalOut))throw Error('Output must be outside the source skill directory.');
 try{await access(out);throw Error('Output directory already exists. Choose a new directory.');}catch(error){if(error.code!=='ENOENT')throw error;}
 try{await access(`${out}.manifest.json`);throw Error('Output manifest already exists. Choose a new directory.');}catch(error){if(error.code!=='ENOENT')throw error;}
 const files=[...new Set(execFileSync('git',['ls-files','--cached','--others','--exclude-standard','-z','--',prefix],{cwd:repo,encoding:'utf8'}).split('\0').filter(Boolean))].sort();
 const entries=[];
 // Preflight before writing: fail on unsafe or accidentally tracked build artifacts.
 for(const file of files){
  const path=resolve(repo,file);let info;try{info=await lstat(path);}catch(error){if(error.code==='ENOENT')continue;throw error;}
  const rel=relative(source,path),parts=rel.split(/[\\/]/);
  if(!within(source,path)||info.isSymbolicLink()||!info.isFile()||!within(source,await realpath(path)))throw Error(`Unsupported source path: ${file}`);
  if(parts.some(p=>['build','.dart_tool','.idea','.gradle','ephemeral','node_modules'].includes(p))||/\.(exe|dll|pdb|iml)$/i.test(file)||basename(file)==='local.properties')throw Error(`Generated/local artifact is Git-visible: ${file}`);
  entries.push({path:rel.split('\\').join('/'),source:path});
 }
 await mkdir(dirname(out),{recursive:true});
 await mkdir(out);
 const manifest=[];
 for(const entry of entries){const data=await readFile(entry.source),target=resolve(out,entry.path);if(!within(out,target))throw Error('Output path escaped export.');await mkdir(dirname(target),{recursive:true});await writeFile(target,data,{flag:'wx'});manifest.push({path:entry.path,bytes:data.length,sha256:createHash('sha256').update(data).digest('hex')});}
 const report={sourceCommit:execFileSync('git',['rev-parse','HEAD'],{cwd:repo,encoding:'utf8'}).trim(),includesWorkingChanges:execFileSync('git',['status','--porcelain','--',prefix],{cwd:repo,encoding:'utf8'}).trim().length>0,files:manifest.length,bytes:manifest.reduce((n,f)=>n+f.bytes,0),manifest};
 await writeFile(`${out}.manifest.json`,JSON.stringify(report,null,2)+'\n',{flag:'wx'});
 return report;
}
if(process.argv[1]&&pathToFileURL(resolve(process.argv[1])).href===import.meta.url){
 packageSkill(process.argv[2]).then(report=>console.log(JSON.stringify({files:report.files,bytes:report.bytes,output:resolve(process.argv[2]),manifest:`${resolve(process.argv[2])}.manifest.json`},null,2))).catch(error=>{console.error(error.message);process.exitCode=1;});
}
