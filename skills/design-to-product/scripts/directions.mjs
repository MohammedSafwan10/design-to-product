#!/usr/bin/env node
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {queryIndex,loadRecipe} from './library.mjs';

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

export async function suggestSurface({surface,tasks=[],inputModes=[],density,assets=[],count=3,seed=1,brief='',keep=[]}={}){
 if(!Number.isInteger(count)||count<1||count>25)throw Error('Count must be an integer from 1 to 25.');
 if(!Number.isSafeInteger(seed))throw Error('Seed must be a safe integer.');
 const entries=await queryIndex({surface,tasks,inputModes,density,assets});
 let n=seed>>>0;const noise=()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296;};
 const candidates=entries.map(entry=>({entry,tie:noise()})).sort((a,b)=>b.tie-a.tie);
 // Prefer different structural families; seeded order only resolves equivalent candidates.
 const seen=new Set(),diverse=[],remaining=[];
 for(const candidate of candidates){if(seen.has(candidate.entry.familyId))remaining.push(candidate);else{seen.add(candidate.entry.familyId);diverse.push(candidate);}}
 const selected=[...diverse,...remaining].slice(0,count);
 return {brief,surface,seed,keep,requested:count,available:entries.length,directions:await Promise.all(selected.map(({entry})=>loadRecipe(entry.id))),notes:['Exact task/input/asset constraints filter candidates; prose brief and keep roles are recorded, not semantically interpreted.','All draft entries are authored hypotheses. Assess the actual product and brand before selection.','Seeded family variety is not proof of visual distinction or usability.',...(selected.length<count?['Fewer eligible recipes exist than requested; do not duplicate a recipe.']:[])]};
}

export async function main(args){
 const options={};
 for(let i=0;i<args.length;i++){if(!args[i].startsWith('--')||!args[i+1]||args[i+1].startsWith('--'))throw Error(`Expected --key value: ${args[i]}`);options[args[i].slice(2)]=args[++i];}
 for(const key of Object.keys(options))if(!['profile','surface','task','input','density','assets','count','seed','brief','keep','out'].includes(key))throw Error(`Unknown option: ${key}`);
 if(options.surface&&options.profile)throw Error('Choose --surface or legacy --profile, not both.');
 const list=value=>(value||'').split(',').map(x=>x.trim()).filter(Boolean);
 const common={count:Number(options.count||3),seed:Number(options.seed||1),brief:options.brief||'',assets:list(options.assets),keep:list(options.keep)};
 const report=options.surface?await suggestSurface({...common,surface:options.surface,tasks:list(options.task),inputModes:list(options.input),density:options.density}):await suggest({...common,profile:options.profile});
 if(options.out){const folder=resolve(options.out);await mkdir(folder,{recursive:true});await writeFile(resolve(folder,'directions.json'),JSON.stringify(report,null,2));}
 process.stdout.write(JSON.stringify(report,null,2)+'\n');
}
if(process.argv[1]&&pathToFileURL(resolve(process.argv[1])).href===import.meta.url)main(process.argv.slice(2)).catch(e=>{console.error(e.message);process.exitCode=2;});
