#!/usr/bin/env node
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {withChromium} from './lib/chromium.mjs';
import {localSite} from './lib/local-site.mjs';
import {measure} from './lib/measure.mjs';
import {evaluate} from './lib/evaluate.mjs';

export async function inspect(target,{profile='marketing',widths,out='.design-to-product/inspection',root,contract={},reducedMotion=false}={}){
 if(!['marketing','app','dashboard'].includes(profile))throw Error('Profile must be marketing, app or dashboard.');
 const sizes=widths||({marketing:[1440,768,390],app:[390,320,430],dashboard:[1440,1024,390]})[profile];
 if(!sizes.length||sizes.some(n=>!Number.isInteger(n)||n<240||n>3840)||new Set(sizes).size!==sizes.length)throw Error('Use unique integer widths between 240 and 3840.');
 const folder=resolve(out);await mkdir(folder,{recursive:true});
 let site;
 let url=target;
 if(!/^https?:\/\//.test(target)){site=await localSite(target,root);url=site.url;}
 else if(!['http:','https:'].includes(new URL(target).protocol))throw Error('Use an HTTP(S) URL or a local HTML path.');
 const safeTarget=/^https?:\/\//.test(target)?new URL(target).origin+new URL(target).pathname:target;
 const report={tool:'design-to-product',profile,target:safeTarget,at:new Date().toISOString(),reducedMotion,viewports:[],findings:[],limits:['DOM sampling is not a complete accessibility or usability audit.','Complex image/gradient/opacity compositing is unverified, not a passing contrast measurement.','Browser screenshots of a native-app study do not establish native device behavior.','Screenshots are evidence for manual critique, not an automatic taste score.','Font-face status is not proof of every rendered glyph font.','Full-page screenshot height is capped at 16000 pixels; internal scroll areas need separate review.']};
 try{
  await withChromium(async browser=>{
   for(const width of sizes){
    const height=width<600?844:width<1100?1024:900;
    const page=await browser.page(width,height,reducedMotion);
    try{
     await page.navigate(url);
     // Trigger a bounded set of lazy/scroll states; this does not certify every state.
     const total=await page.evaluate(()=>document.documentElement.scrollHeight);
     for(const y of [Math.floor(total/2),Math.max(0,total-height),0]){await page.evaluate(value=>scrollTo({top:value,behavior:'instant'}),y);await new Promise(done=>setTimeout(done,120));}
     const metrics=await page.evaluate(measure);
     const findings=evaluate(metrics,{profile,contract});
     for(const issue of page.issues){if(issue.url?.endsWith('/favicon.ico'))continue;findings.push({severity:issue.type==='console-error'?'warning':'error',id:issue.type,message:'Page reported a runtime or resource problem.',evidence:issue});}
     const fold=`${profile}-${width}-fold.png`,full=`${profile}-${width}-page.png`;
     await writeFile(resolve(folder,fold),await page.screenshot());
     await writeFile(resolve(folder,full),await page.screenshot(true));
     report.viewports.push({width,height,metrics,screenshots:{fold,full}});
     report.findings.push(...findings.map(f=>({...f,width})));
    }finally{await page.close();}
   }
  });
 }finally{await site?.close();}
 report.summary={errors:report.findings.filter(f=>f.severity==='error').length,warnings:report.findings.filter(f=>f.severity==='warning').length,advice:report.findings.filter(f=>f.severity==='advice').length};
 await writeFile(resolve(folder,'report.json'),JSON.stringify(report,null,2));
 return report;
}

async function main(args){
 const [target,...rest]=args;
 if(!target||target==='--help'){console.log('node inspect.mjs <URL|HTML> [--profile marketing|app|dashboard] [--widths 1440,390] [--out folder] [--root static-root] [--contract JSON] [--reduced-motion]');return;}
 const options={};
 for(let i=0;i<rest.length;i++){
  const key=rest[i];
  if(key==='--reduced-motion'){options.reducedMotion=true;continue;}
  if(!['--profile','--widths','--out','--root','--contract'].includes(key)||!rest[i+1]||rest[i+1].startsWith('--'))throw Error(`Unknown/incomplete option: ${key}`);
  const value=rest[++i];
  options[key.slice(2)]=key==='--widths'?value.split(',').map(Number):key==='--contract'?JSON.parse(await readFile(resolve(value),'utf8')):value;
 }
 const report=await inspect(target,options);
 console.log(JSON.stringify({profile:report.profile,summary:report.summary,report:resolve(options.out||'.design-to-product/inspection','report.json'),findings:report.findings},null,2));
 process.exitCode=report.summary.errors?1:0;
}
if(process.argv[1]&&pathToFileURL(resolve(process.argv[1])).href===import.meta.url)main(process.argv.slice(2)).catch(error=>{console.error(error.message);process.exitCode=2;});
