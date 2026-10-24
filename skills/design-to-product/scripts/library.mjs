#!/usr/bin/env node
import {readFile,stat} from 'node:fs/promises';
import {resolve, relative, isAbsolute} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

export const SURFACES = ['marketing','product-web','mobile','desktop','dashboard','game'];
const ROOT = fileURLToPath(new URL('../library/', import.meta.url));
const GROUPS = ['families','patterns','compositions','typography','palettes','imagery'];
const read = async path => JSON.parse(await readFile(path, 'utf8'));
function safePath(path, root=ROOT) {
 if (typeof path !== 'string' || isAbsolute(path)) throw Error('Library path must be relative.');
 const result=resolve(root,path), rel=relative(root,result);
 if(rel==='..'||rel.startsWith('../')||rel.startsWith('..\\')||isAbsolute(rel))throw Error('Library path escapes root.');
 return result;
}
export async function loadIndex({root=ROOT}={}) {return read(resolve(root,'index.json'));}

/** Filters are exact catalog constraints, never semantic matching of a prose brief. */
export async function queryIndex({surface,tasks=[],inputModes=[],assets=[],density,status,includeDraft=true,root=ROOT}={}) {
 if(surface&&!SURFACES.includes(surface))throw Error(`Unknown surface: ${surface}`);
 if(density&&!['spacious','balanced','compact'].includes(density))throw Error(`Unknown density: ${density}`);
 if(status&&!['draft','reviewed','validated'].includes(status))throw Error(`Unknown review status: ${status}`);
 for(const [name,value] of Object.entries({tasks,inputModes,assets}))if(!Array.isArray(value)||value.some(x=>typeof x!=='string'))throw Error(`${name} must be a string array.`);
 const index=await loadIndex({root});
 return index.entries.filter(e=>(!surface||e.surface===surface)&&(!density||e.density===density)&&(!status||e.reviewStatus===status)&&(includeDraft||e.reviewStatus!=='draft')&&tasks.every(t=>e.tasks.includes(t))&&inputModes.every(i=>e.inputModes.includes(i))&&e.requiredAssets.every(a=>assets.includes(a)));
}

export async function loadRecipe(id,{modules=false,root=ROOT}={}) {
 const index=await loadIndex({root}), entry=index.entries.find(e=>e.id===id);
 if(!entry)throw Error(`Unknown recipe: ${id}`);
 const recipe=await read(safePath(entry.path,root));
 if(!modules)return recipe;
 const wanted={families:[recipe.familyId],patterns:recipe.patternIds,compositions:recipe.compositionIds,typography:recipe.typeRecipeIds,palettes:recipe.paletteRecipeIds,imagery:recipe.imagery.treatmentIds};
 const selected={};
 for(const group of GROUPS)selected[group]=await Promise.all(wanted[group].map(async moduleId=>{
  const path=index.modules[group]?.[moduleId];
  if(!path)throw Error(`Unknown ${group} reference: ${moduleId}`);
  return read(safePath(path,root));
 }));
 return {...recipe,modules:selected};
}

export function contrastRatio(first,second) {
 const luminance=hex=>{
  if(!/^#[\da-f]{6}$/i.test(hex))throw Error(`Expected opaque #rrggbb color: ${hex}`);
  const channels=hex.slice(1).match(/../g).map(c=>parseInt(c,16)/255).map(c=>c<=0.04045?c/12.92:((c+0.055)/1.055)**2.4);
  return channels[0]*0.2126+channels[1]*0.7152+channels[2]*0.0722;
 };
 const a=luminance(first),b=luminance(second);return (Math.max(a,b)+0.05)/(Math.min(a,b)+0.05);
}

/** Structural validation is not visual review. Draft recipes may have no render. */
export async function validateLibrary({root=ROOT}={}) {
 const errors=[],index=await loadIndex({root}),counts=Object.fromEntries(SURFACES.map(s=>[s,0]));
 const ids=new Set(), ideas=new Set(), compositions=new Set(), signatures=new Set();
 const fail=(id,message)=>errors.push(`${id}: ${message}`);
 if(index.schemaVersion!==1)fail('index','unsupported schemaVersion');
 const moduleIds={};
 for(const group of GROUPS){
  moduleIds[group]=new Set(Object.keys(index.modules[group]||{}));
  for(const [id,path] of Object.entries(index.modules[group]||{})){
   try{
    const item=await read(safePath(path,root));
    if(item.id!==id||item.kind!==group)fail(id,'module identity/kind mismatch');
    if(!['draft','reviewed','validated'].includes(item.reviewStatus))fail(id,'invalid module review status');
    if(item.reviewStatus!=='draft'&&!item.evidence?.length)fail(id,'reviewed module has no evidence');
    if(group==='palettes')for(const pair of item.contrastPairs||[]){
     const ratio=contrastRatio(item.roles[pair.foreground],item.roles[pair.background]);
     if(ratio<pair.minimum)fail(id,`contrast ${pair.foreground}/${pair.background} ${ratio.toFixed(2)} below ${pair.minimum}`);
    }
   }catch(error){fail(id,error.message);}
  }
 }
 for(const entry of index.entries){
  try{
   if(ids.has(entry.id))fail(entry.id,'duplicate id');ids.add(entry.id);
   const r=await read(safePath(entry.path,root));
   for(const key of ['id','title','surface','familyId','density','reviewStatus'])if(r[key]!==entry[key])fail(entry.id,`index ${key} mismatch`);
   for(const key of ['tasks','inputModes','requiredAssets'])if(JSON.stringify(r[key])!==JSON.stringify(entry[key]))fail(entry.id,`index ${key} mismatch`);
   if(!SURFACES.includes(r.surface))fail(r.id,'unknown surface');else counts[r.surface]++;
   if(r.schemaVersion!==1||r.version!==1)fail(r.id,'unsupported version');
   for(const key of ['title','idea','audience','navigation'])if(typeof r[key]!=='string'||r[key].trim().length<5)fail(r.id,`missing ${key}`);
   for(const key of ['tasks','worksWellWhen','avoidWhen','distinctFrom','patternIds','compositionIds','typeRecipeIds','paletteRecipeIds','inputModes','brandConstraints','responsiveRules','accessibilityRisks'])if(!Array.isArray(r[key])||!r[key].length||r[key].some(x=>typeof x!=='string'||!x.trim()))fail(r.id,`missing/invalid ${key}`);
   if(!['spacious','balanced','compact'].includes(r.density))fail(r.id,'invalid density');
   if(!['draft','reviewed','validated'].includes(r.reviewStatus))fail(r.id,'invalid reviewStatus');
   if(!Array.isArray(r.requiredAssets)||!Array.isArray(r.sources)||!Array.isArray(r.examplePaths)||!Array.isArray(r.evidence))fail(r.id,'missing asset/evidence arrays');
   if(r.reviewStatus!=='draft'){
    if(!r.examplePaths?.length||!r.evidence?.length)fail(r.id,'reviewed recipe needs renders and evidence');
    for(const example of r.examplePaths||[]){
     if(typeof example!=='object'||!example.path||!['normal','stress'].includes(example.state)) {fail(r.id,'reviewed example needs relative path and normal/stress state');continue;}
     try{if(!(await stat(safePath(example.path,resolve(root,'..')))).isFile())fail(r.id,'example is not a file');}catch{fail(r.id,`missing or unsafe example: ${example.path}`);}
    }
    if(!['normal','stress'].every(state=>r.examplePaths?.some(e=>e.state===state)))fail(r.id,'reviewed recipe requires normal and stress examples');
    for(const evidence of r.evidence||[]){
     if(!evidence||typeof evidence!=='object'||!['method','date','reviewer','limits','artifactPath'].every(key=>typeof evidence[key]==='string'&&evidence[key].trim())){fail(r.id,'review evidence needs method date reviewer limits artifactPath');continue;}
     if(!/^\d{4}-\d{2}-\d{2}$/.test(evidence.date))fail(r.id,'review date must use YYYY-MM-DD');
     try{await stat(safePath(evidence.artifactPath,resolve(root,'..')));}catch{fail(r.id,'missing or unsafe review artifact');}
    }
    if(r.reviewStatus==='validated'&&!r.evidence?.some(e=>e.method==='task-study'))fail(r.id,'validated requires task-study evidence');
   }
   for(const state of ['loading','empty','failure','offline','success','interruption'])if(typeof r.stateContracts?.[state]!=='string'||!r.stateContracts[state].trim())fail(r.id,`missing state ${state}`);
   for(const part of ['entry','continuation','priority'])if(typeof r.composition?.[part]!=='string'||!r.composition[part].trim())fail(r.id,`missing composition ${part}`);
   if(!r.performanceBudget?.principle||!r.performanceBudget?.verify)fail(r.id,'missing performance contract');
   if(!r.imagery?.treatmentIds?.length||!r.imagery?.role)fail(r.id,'missing imagery strategy');
   const references={families:[r.familyId],patterns:r.patternIds,compositions:r.compositionIds,typography:r.typeRecipeIds,palettes:r.paletteRecipeIds,imagery:r.imagery?.treatmentIds};
   for(const [group,refs] of Object.entries(references))for(const ref of refs||[])if(!moduleIds[group].has(ref))fail(r.id,`unknown ${group}: ${ref}`);
   if(ideas.has(r.idea))fail(r.id,'duplicate idea');ideas.add(r.idea);
   if(compositions.has(r.composition?.entry))fail(r.id,'duplicate entry composition');compositions.add(r.composition?.entry);
   const signature=JSON.stringify([r.surface,r.tasks,r.composition,r.navigation]);
   if(signatures.has(signature))fail(r.id,'duplicate structural recipe');signatures.add(signature);
  }catch(error){fail(entry.id,error.message);}
 }
 return {valid:errors.length===0,errors,counts,total:index.entries.length,uniqueFamilies:moduleIds.families.size,statusCounts:index.entries.reduce((a,e)=>(a[e.reviewStatus]=(a[e.reviewStatus]||0)+1,a),{}),limits:['Validation checks authored structure and token pairs; it does not establish visual quality, distinctness of renders, platform conformance or task usability.']};
}

export async function main(args) {
 const options={};
 for(let i=0;i<args.length;i++){
  const key=args[i];if(key==='--validate'||key==='--modules'){options[key.slice(2)]=true;continue;}
  if(!key.startsWith('--')||!args[i+1]||args[i+1].startsWith('--'))throw Error(`Expected --key value: ${key}`);
  options[key.slice(2)]=args[++i];
 }
 for(const key of Object.keys(options))if(!['validate','modules','surface','task','input','assets','density','status','id','count'].includes(key))throw Error(`Unknown option: ${key}`);
 let result;
 if(options.validate){result=await validateLibrary();if(!result.valid)process.exitCode=1;}
 else if(options.id)result=await loadRecipe(options.id,{modules:options.modules});
 else{
  const list=value=>(value||'').split(',').map(x=>x.trim()).filter(Boolean);
  const entries=await queryIndex({surface:options.surface,tasks:list(options.task),inputModes:list(options.input),assets:list(options.assets),density:options.density,status:options.status});
  const count=options.count===undefined?entries.length:Number(options.count);
  if(!Number.isInteger(count)||count<0)throw Error('Count must be a nonnegative integer.');
  result={available:entries.length,entries:entries.slice(0,count),limits:['Exact filters only; draft entries are original unreviewed candidates, not researched or validated designs.']};
 }
 process.stdout.write(JSON.stringify(result,null,2)+'\n');return result;
}
if(process.argv[1]&&pathToFileURL(resolve(process.argv[1])).href===import.meta.url)main(process.argv.slice(2)).catch(error=>{console.error(error.message);process.exitCode=2;});
