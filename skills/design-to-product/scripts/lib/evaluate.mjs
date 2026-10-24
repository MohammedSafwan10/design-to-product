export function evaluate(metrics,{profile='marketing',contract={}}={}){
 const findings=[];
 const add=(severity,id,message,evidence)=>findings.push({severity,id,message,evidence});
 if(metrics.overflow>2)add('error','horizontal-overflow','Content extends past the viewport.',metrics.overflow);
 if(metrics.media.broken.length)add('error','broken-image','Images failed to load.',metrics.media.broken);
 if(metrics.media.missingAlt)add('error','missing-alt','Images need an alt attribute; decorative images can use an empty value.',metrics.media.missingAlt);
 if(metrics.unnamedControls.length)add('error','control-name','Interactive elements have no detected accessible name.',metrics.unnamedControls);
 if(metrics.clippedControls.length)add('error','clipped-control','Control text appears clipped.',metrics.clippedControls);
 if(metrics.contrast.length)add('error','text-contrast','Sampled text falls below its applicable contrast ratio.',metrics.contrast.slice(0,15));
 if(metrics.unverifiedContrast.length)add('warning','contrast-unverified','Complex styling/compositing prevents reliable contrast measurement; inspect manually.',metrics.unverifiedContrast);
 if(metrics.media.pending)add('warning','pending-images','Some images are not complete; check lazy-load and unavailable states.',metrics.media.pending);
 if(metrics.smallTargets.length)add('warning','target-size','Some controls are under the 44px design target; assess layout and applicable accessibility exceptions.',metrics.smallTargets.slice(0,20));
 if(metrics.fonts.some(f=>f.status!=='loaded'))add('warning','font-loading','Declared font faces are not all loaded. This does not establish which glyph face actually rendered.',metrics.fonts.filter(f=>f.status!=='loaded'));
 if(profile==='marketing'&&metrics.headings.some(h=>h.tag==='H1'&&h.lines>2))add('advice','headline-wrap','Consider a shorter headline or wider measure; do not damage meaning/localization just to reach two lines.',metrics.headings.filter(h=>h.tag==='H1'&&h.lines>2));
 if(contract.maxHeroLines!=null){if(!Number.isInteger(contract.maxHeroLines)||contract.maxHeroLines<1)throw Error('maxHeroLines must be a positive integer.');if(metrics.headings.some(h=>h.tag==='H1'&&h.lines>contract.maxHeroLines))add('error','contract-heading','The explicit heading line contract is not met.',metrics.headings.filter(h=>h.tag==='H1'));}
 if(metrics.textSampleLimit)add('warning','sample-limit','Text sampling reached its limit; the remainder was not measured.',metrics.sampledTextNodes);
 return findings;
}
