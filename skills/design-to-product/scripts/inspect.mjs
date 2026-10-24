#!/usr/bin/env node
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {withChromium} from './lib/chromium.mjs';
import {localSite} from './lib/local-site.mjs';
import {measure} from './lib/measure.mjs';
import {evaluate} from './lib/evaluate.mjs';

export async function inspect(target,{profile='marketing',widths,viewports,out='.design-to-product/inspection',root,contract={},reducedMotion=false,touch=false,mobile=false,deviceScaleFactor=1}={}){
 if(!['marketing','app','dashboard'].includes(profile))throw Error('Profile must be marketing, app or dashboard.');
 const sizes=viewports?.map(v=>v.width)||widths||({marketing:[1440,768,390],app:[390,320,430],dashboard:[1440,1024,390]})[profile];
 if(!sizes.length||sizes.some(n=>!Number.isInteger(n)||n<240||n>3840)||(!viewports&&new Set(sizes).size!==sizes.length))throw Error('Use integer widths between 240 and 3840; standalone widths must be unique.');
 if(viewports?.some(v=>!Number.isInteger(v.height)||v.height<240||v.height>3840))throw Error('Viewport heights must be integers between 240 and 3840.');
 if(viewports&&new Set(viewports.map(v=>`${v.width}x${v.height}`)).size!==viewports.length)throw Error('Viewport width/height tuples must be unique.');
 if(typeof touch!=='boolean'||typeof mobile!=='boolean'||!Number.isFinite(deviceScaleFactor)||deviceScaleFactor<1||deviceScaleFactor>4)throw Error('Invalid browser emulation options.');
 const folder=resolve(out);await mkdir(folder,{recursive:true});
 let site;
 let url=target;
 if(!/^https?:\/\//.test(target)){site=await localSite(target,root);url=site.url;}
 else if(!['http:','https:'].includes(new URL(target).protocol))throw Error('Use an HTTP(S) URL or a local HTML path.');
 const safeTarget=/^https?:\/\//.test(target)?new URL(target).origin+new URL(target).pathname:target;
 const report={tool:'design-to-product',profile,target:safeTarget,at:new Date().toISOString(),reducedMotion,viewports:[],findings:[],limits:['DOM sampling is not a complete accessibility or usability audit.','Complex image/gradient/opacity compositing is unverified, not a passing contrast measurement.','Browser screenshots of a native-app study do not establish native device behavior.','Screenshots are evidence for manual critique, not an automatic taste score.','Font-face status is not proof of every rendered glyph font.','Full-page screenshot height is capped at 16000 pixels; internal scroll areas need separate review.']};
 report.limits.push('Control names use a bounded heuristic, not the full accessible-name algorithm.','Occlusion samples five points on up to 300 controls at the final top-of-page state; offscreen, pointer-events:none, shadow/canvas internals and other interaction states are not certified.','Modal/menu occlusion is recorded as an intentional-layer candidate, not proof of correct focus management.','Content occupancy samples text/media rectangles in up to 60 large section regions; background/canvas/iframe content and subjective composition are not assessed.','Application readiness remains unverified; document/font readiness does not establish completed data loading.');
 try{
  await withChromium(async browser=>{
   for(const [index,width] of sizes.entries()){
    const height=viewports?.[index].height||(width<600?844:width<1100?1024:900);
    const page=await browser.page(width,height,reducedMotion,{touch,mobile,deviceScaleFactor});
    try{
     const readiness=await page.navigate(url);
     // Trigger a bounded set of lazy/scroll states; this does not certify every state.
     const total=await page.evaluate(()=>document.documentElement.scrollHeight);
     for(const y of [Math.floor(total/2),Math.max(0,total-height),0]){await page.evaluate(value=>scrollTo({top:value,behavior:'instant'}),y);await new Promise(done=>setTimeout(done,120));}
     const metrics=await page.evaluate(measure);
     const findings=evaluate(metrics,{profile,contract});
     if(!readiness.fontsReady)findings.push({severity:'warning',id:'font-readiness-timeout',message:'Font readiness timed out; measurements may include fallback fonts.',evidence:readiness});
     for(const issue of page.issues){if(issue.url?.endsWith('/favicon.ico'))continue;findings.push({severity:issue.type==='console-error'?'warning':'error',id:issue.type,message:'Page reported a runtime or resource problem.',evidence:issue});}
     const suffix=viewports?`${width}x${height}`:width;
     const fold=`${profile}-${suffix}-fold.png`,full=`${profile}-${suffix}-page.png`;
     await writeFile(resolve(folder,fold),await page.screenshot());
     await writeFile(resolve(folder,full),await page.screenshot(true));
     report.viewports.push({width,height,emulation:{surface:'browser',mobile,touch,deviceScaleFactor,nativeBehavior:'unverified'},readiness,metrics,screenshots:{fold,full}});
     report.findings.push(...findings.map(f=>({...f,width,height})));
    }finally{await page.close();}
   }
  });
 }finally{await site?.close();}
 report.summary={errors:report.findings.filter(f=>f.severity==='error').length,warnings:report.findings.filter(f=>f.severity==='warning').length,advice:report.findings.filter(f=>f.severity==='advice').length};
 report.uncertainty=report.viewports.map(v=>({width:v.width,height:v.height,counts:v.metrics.uncertaintyCounts}));
 await writeFile(resolve(folder,'report.json'),JSON.stringify(report,null,2));
 return report;
}

async function main(args){
 const [target,...rest]=args;
 if(!target||target==='--help'){console.log('node inspect.mjs <URL|HTML> [--profile marketing|app|dashboard] [--widths 1440,390 | --viewports 320x568,390x844] [--touch] [--mobile] [--device-scale-factor 1] [--out folder] [--root static-root] [--contract JSON] [--reduced-motion]');return;}
 const options={};
 for(let i=0;i<rest.length;i++){
  const key=rest[i];
  if(['--reduced-motion','--touch','--mobile'].includes(key)){options[key==='--reduced-motion'?'reducedMotion':key.slice(2)]=true;continue;}
  if(!['--profile','--widths','--viewports','--device-scale-factor','--out','--root','--contract'].includes(key)||!rest[i+1]||rest[i+1].startsWith('--'))throw Error(`Unknown/incomplete option: ${key}`);
  const value=rest[++i];
  if(key==='--viewports'){options.viewports=value.split(',').map(pair=>{const [width,height]=pair.split('x').map(Number);return {width,height};});continue;}
  if(key==='--device-scale-factor'){options.deviceScaleFactor=Number(value);continue;}
  options[key.slice(2)]=key==='--widths'?value.split(',').map(Number):key==='--contract'?JSON.parse(await readFile(resolve(value),'utf8')):value;
 }
 const report=await inspect(target,options);
 console.log(JSON.stringify({profile:report.profile,summary:report.summary,report:resolve(options.out||'.design-to-product/inspection','report.json'),findings:report.findings},null,2));
 process.exitCode=report.summary.errors?1:0;
}
if(process.argv[1]&&pathToFileURL(resolve(process.argv[1])).href===import.meta.url)main(process.argv.slice(2)).catch(error=>{console.error(error.message);process.exitCode=2;});
