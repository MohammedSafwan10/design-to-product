#!/usr/bin/env node
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

export async function suggest({profile='marketing',assets=[],count=3,seed=1,brief='',keep=[]}={}){
 if(!['marketing','app','dashboard'].includes(profile))throw Error('Profile must be marketing, app or dashboard.');
 if(!Number.isInteger(count)||count<1||count>12)throw Error('Count must be an integer from 1 to 12.');
 if(!Number.isSafeInteger(seed))throw Error('Seed must be a safe integer.');
 const catalog=JSON.parse(await readFile(new URL('../library/directions.json',import.meta.url),'utf8'));
 const usable=catalog.filter(d=>d.profiles.includes(profile)&&d.media.every(a=>assets.includes(a)));
 let n=seed>>>0;
 const noise=()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296;};
 const selected=usable.map(d=>({d,tie:noise()})).sort((a,b)=>b.tie-a.tie).slice(0,count).map(({d})=>({...d,fit:`Supports ${profile}; ${d.media.length?`uses available ${d.media.join(', ')}`:'does not require unavailable imagery'}.`}));
 return {brief,profile,seed,keep,requested:count,available:usable.length,directions:selected,notes:['These are starting hypotheses. Choose by the actual subject and task, not random rank.','Keep the supplied brand constraints; this tool does not invent or overwrite palette/font decisions.',...(selected.length<count?['Fewer eligible directions exist than requested. Do not duplicate one to fake variety.']:[])]};
}

export async function main(args){
 const options={};
 for(let i=0;i<args.length;i++){if(!args[i].startsWith('--')||!args[i+1]||args[i+1].startsWith('--'))throw Error(`Expected --key value: ${args[i]}`);options[args[i].slice(2)]=args[++i];}
 for(const key of Object.keys(options))if(!['profile','assets','count','seed','brief','keep','out'].includes(key))throw Error(`Unknown option: ${key}`);
 const list=value=>(value||'').split(',').map(x=>x.trim()).filter(Boolean);
 const report=await suggest({profile:options.profile,count:Number(options.count||3),seed:Number(options.seed||1),brief:options.brief||'',assets:list(options.assets),keep:list(options.keep)});
 if(options.out){const folder=resolve(options.out);await mkdir(folder,{recursive:true});await writeFile(resolve(folder,'directions.json'),JSON.stringify(report,null,2));}
 process.stdout.write(JSON.stringify(report,null,2)+'\n');
}
if(process.argv[1]&&pathToFileURL(resolve(process.argv[1])).href===import.meta.url)main(process.argv.slice(2)).catch(e=>{console.error(e.message);process.exitCode=2;});
