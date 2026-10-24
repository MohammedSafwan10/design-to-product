// Serialized into an isolated browser page. This is a bounded DOM sample, not a
// full accessibility auditor. Complex backgrounds are explicitly unverified.
export function measure(){
 const visible=element=>{const box=element.getBoundingClientRect();const style=getComputedStyle(element);return box.width>0&&box.height>0&&style.visibility!=='hidden'&&element.checkVisibility?.({checkOpacity:true,checkVisibilityCSS:true})!==false;};
 const label=element=>(element.getAttribute('aria-label')||element.textContent||element.tagName).trim().replace(/\s+/g,' ').slice(0,100);
 const colors=value=>{const match=value.match(/^rgba?\(([^)]+)\)$/);if(!match)return null;const parts=match[1].split(/[,\s/]+/).filter(Boolean).map(Number);if(parts.some(n=>!Number.isFinite(n)))return null;return parts.slice(0,3).concat(parts[3]??1);};
 const mix=(top,bottom)=>[0,1,2].map(i=>top[i]*top[3]+bottom[i]*(1-top[3])).concat(1);
 const mediaBoxes=[...document.querySelectorAll('img,video,canvas,svg,iframe')].filter(visible).map(element=>({element,box:element.getBoundingClientRect()}));
 const background=(element,textBox)=>{if(mediaBoxes.some(({element:media,box})=>!element.contains(media)&&box.left<textBox.right&&box.right>textBox.left&&box.top<textBox.bottom&&box.bottom>textBox.top))return null;const layers=[];for(let p=element;p;p=p.parentElement){const s=getComputedStyle(p);if(s.backgroundImage!=='none'||Number(s.opacity)<1||s.mixBlendMode!=='normal'||s.filter!=='none'||s.backdropFilter!=='none'||s.textShadow!=='none')return null;const c=colors(s.backgroundColor);if(!c)return null;if(c[3]>0){const box=p.getBoundingClientRect();if(textBox.left<box.left-2||textBox.right>box.right+2||textBox.top<box.top-2||textBox.bottom>box.bottom+2)return null;}layers.push(c);if(c[3]===1)break;}let result=[255,255,255,1];for(const color of layers.reverse())result=mix(color,result);return result;};
 const luminance=color=>color.slice(0,3).map(v=>{const c=v/255;return c<=.04045?c/12.92:((c+.055)/1.055)**2.4;}).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
 const ratio=(a,b)=>{const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
 const texts=[];const headings=[];const contrast=[];const unverified=[];const headingRects=new Map();const contentRects=[];
 const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
 let node,count=0;
 while((node=walker.nextNode())&&count<4000){
  const text=node.textContent.trim();const parent=node.parentElement;
  if(!text||!parent||parent.closest('script,style,template,noscript,svg')||!visible(parent))continue;
  count++;
  const style=getComputedStyle(parent);const range=document.createRange();range.selectNodeContents(node);const rectangles=[...range.getClientRects()].filter(r=>r.width>1&&r.height>1);
  if(!rectangles.length)continue;
  contentRects.push(...rectangles);
  const size=parseFloat(style.fontSize),weight=Number(style.fontWeight)||400;
  texts.push({text:text.slice(0,100),family:style.fontFamily,size});
  const heading=parent.closest('h1,h2,h3,h4,h5,h6');
  if(heading){const entry=headingRects.get(heading)||[];entry.push(...rectangles);headingRects.set(heading,entry);}
  const fg=colors(style.color),bg=background(parent,range.getBoundingClientRect());
  if(parent.closest(':disabled,[aria-disabled="true"]'))continue;
  if(!fg||!bg){unverified.push(text.slice(0,80));continue;}
  const value=ratio(mix(fg,bg),bg),required=size>=24||(size>=18.666&&weight>=700)?3:4.5;
  if(value+1e-9<required)contrast.push({text:text.slice(0,100),ratio:Math.round(value*100)/100,required});
 }
 for(const [element,rects] of headingRects){
  // Group overlapping vertical text bands, so inline emphasis and superscripts
  // do not create extra lines merely because their font metrics differ.
  const bands=[];for(const r of rects.sort((a,b)=>a.top-b.top)){const band=bands.find(b=>Math.min(b.bottom,r.bottom)-Math.max(b.top,r.top)>Math.min(b.bottom-b.top,r.height)*.35);if(band){band.top=Math.min(band.top,r.top);band.bottom=Math.max(band.bottom,r.bottom);}else bands.push({top:r.top,bottom:r.bottom});}
  headings.push({text:element.innerText.trim().slice(0,100),tag:element.tagName,lines:bands.length,size:parseFloat(getComputedStyle(element).fontSize)});
 }
 const controls=[...document.querySelectorAll('button,input:not([type=hidden]),select,textarea,a[href],[role=button],[role=tab],[role=switch],[role=checkbox],[role=radio],[role=slider],[role=combobox]')].filter(e=>visible(e)&&!e.closest('[aria-hidden="true"],[inert]'));
 const contents=element=>{const copy=element.cloneNode(true);for(const hidden of copy.querySelectorAll('[aria-hidden="true"],[hidden],script,style'))hidden.remove();return copy.textContent.trim();};
 const name=element=>{
  const labelled=element.getAttribute('aria-labelledby');
  if(labelled){const text=labelled.split(/\s+/).map(id=>document.getElementById(id)?.textContent||'').join(' ').trim();if(text)return text;}
  return (element.getAttribute('aria-label')||'').trim()||[...(element.labels||[])].map(l=>contents(l)).join(' ').trim()||contents(element)||[...element.querySelectorAll('img[alt]')].map(i=>i.alt).join(' ')||element.getAttribute('title')||(['submit','reset','button'].includes(element.type)?element.value:'');
 };
 const unnamed=[],uncertainNames=[];
 for(const e of controls.filter(e=>!name(e))){const id=e.tagName.toLowerCase()+(e.id?'#'+e.id:'');if(e.shadowRoot||e.localName.includes('-')||e.querySelector('svg,use')||e.getAttribute('role'))uncertainNames.push(id);else unnamed.push(id);}
 const targetExceptions=[];
 const targets=controls.filter(e=>!e.disabled&&e.getAttribute('aria-disabled')!=='true').map(e=>{const r=e.getBoundingClientRect();const result={name:name(e).slice(0,80),width:Math.round(r.width),height:Math.round(r.height)};if(e.tagName==='A'&&getComputedStyle(e).display==='inline'&&e.closest('p,li,dd,dt')){targetExceptions.push({...result,reason:'inline-text-link'});return null;}return result;}).filter(e=>e&&(e.width<44||e.height<44));
 const clipped=controls.filter(e=>{const s=getComputedStyle(e);return (e.scrollWidth>e.clientWidth+2&&['hidden','clip'].includes(s.overflowX)&&s.textOverflow!=='ellipsis')||(e.scrollHeight>e.clientHeight+2&&['hidden','clip'].includes(s.overflowY));}).map(label);
 const ancestorClipping=[];
 for(const e of controls){const r=e.getBoundingClientRect();for(let p=e.parentElement;p&&p!==document.body;p=p.parentElement){const s=getComputedStyle(p),b=p.getBoundingClientRect();const x=['hidden','clip'].includes(s.overflowX)&&(r.left<b.left-2||r.right>b.right+2),y=['hidden','clip'].includes(s.overflowY)&&(r.top<b.top-2||r.bottom>b.bottom+2);if(x||y){ancestorClipping.push({name:label(e),axis:[x?'x':'',y?'y':''].filter(Boolean).join(','),ancestor:p.tagName.toLowerCase()+(p.id?'#'+p.id:'')});break;}}}
 // Hit tests cover only sampled on-screen controls. Parent/child hits and
 // intentional modal/menu layers are counterexamples, not automatic failures.
 const occludedControls=[],occlusionExceptions=[];let occlusionUnverified=0,occlusionSampled=0;
 for(const e of controls.slice(0,300)){
  if(e.disabled||e.getAttribute('aria-disabled')==='true')continue;
  const r=e.getBoundingClientRect();
  if(r.right<=0||r.bottom<=0||r.left>=innerWidth||r.top>=innerHeight){occlusionUnverified++;continue;}
  if(getComputedStyle(e).pointerEvents==='none'){occlusionUnverified++;continue;}
  const left=Math.max(0,r.left),right=Math.min(innerWidth,r.right),top=Math.max(0,r.top),bottom=Math.min(innerHeight,r.bottom);
  const points=[[.5,.5],[.2,.2],[.8,.2],[.2,.8],[.8,.8]].map(([x,y])=>({x:Math.round((left+(right-left)*x)*100)/100,y:Math.round((top+(bottom-top)*y)*100)/100}));
  const hits=points.map(point=>({...point,element:document.elementFromPoint(point.x,point.y)}));occlusionSampled++;
  const blockers=hits.filter(hit=>hit.element&&!e.contains(hit.element)&&!hit.element.contains(e));
  if(!blockers.length)continue;
  const modal=blockers.every(hit=>hit.element.closest('dialog[open],[aria-modal="true"],[role="menu"],[popover]:popover-open'));
  const evidence={name:label(e),confidence:blockers.length===points.length?'high':'medium',blockedSamples:blockers.length,totalSamples:points.length,coordinates:blockers.map(({x,y,element})=>({x,y,blocker:element.tagName.toLowerCase()+(element.id?'#'+element.id:'')}))};
  if(modal)occlusionExceptions.push({...evidence,reason:'modal-or-menu-overlay'});
  else occludedControls.push(evidence);
 }
 // Geometric content occupancy is a review aid. It does not judge a section's
 // quality, background imagery, artistic whitespace or in-canvas UI content.
 const occupancy=[];let occupancyUnverified=0;
 const regions=[...document.querySelectorAll('main > section,body > section,[data-design-section]')].filter(visible).slice(0,60);
 for(const section of regions){const box=section.getBoundingClientRect();if(box.height<innerHeight*.75||box.width<innerWidth*.5)continue;
  const complex=section.querySelector('canvas,iframe')||getComputedStyle(section).backgroundImage!=='none';
  if(complex){occupancyUnverified++;continue;}
  const rects=[...contentRects,...mediaBoxes.map(item=>item.box)];let filled=0;
  for(let y=0;y<16;y++)for(let x=0;x<12;x++){const px=box.left+box.width*(x+.5)/12,py=box.top+box.height*(y+.5)/16;if(rects.some(r=>r.left<=px&&r.right>=px&&r.top<=py&&r.bottom>=py))filled++;}
  occupancy.push({region:section.id||section.tagName.toLowerCase(),method:'12x16-text-media-rectangle-grid',fraction:Math.round(filled/192*1000)/1000,height:Math.round(box.height),coordinates:{x:Math.round(box.left),y:Math.round(box.top)},confidence:'low'});
 }
 const imgs=[...document.images];
 const media={broken:imgs.filter(i=>i.complete&&!i.naturalWidth).map(i=>{try{const u=new URL(i.currentSrc||i.src);return u.origin+u.pathname;}catch{return '<image>';}}),missingAlt:imgs.filter(i=>!i.hasAttribute('alt')).length,pending:imgs.filter(i=>!i.complete).length};
 const fonts=[...document.fonts].map(face=>({family:face.family,status:face.status}));
 return {viewport:{width:innerWidth,height:innerHeight},title:document.title,overflow:Math.max(0,document.documentElement.scrollWidth-innerWidth),headings,contrast,unverifiedContrast:unverified.slice(0,15),sampledTextNodes:count,textSampleLimit:count===4000,textFamilies:[...new Set(texts.map(t=>t.family))],fonts,unnamedControls:unnamed,uncertainControlNames:uncertainNames,smallTargets:targets,targetExceptions,clippedControls:clipped,ancestorClipping,occludedControls,occlusionExceptions,occlusionSampled,occupancy,uncertaintyCounts:{contrast:unverified.length,controlNames:uncertainNames.length,occlusionOffscreenOrUnsupported:occlusionUnverified,occlusionUnsampled:Math.max(0,controls.length-300),occupancyUnsupported:occupancyUnverified},media,reducedMotion:matchMedia('(prefers-reduced-motion:reduce)').matches,documentHeight:document.documentElement.scrollHeight};
}
