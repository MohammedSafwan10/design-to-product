// Serialized into an isolated browser page. This is a bounded DOM sample, not a
// full accessibility auditor. Complex backgrounds are explicitly unverified.
export function measure(){
 const visible=element=>{const box=element.getBoundingClientRect();const style=getComputedStyle(element);return box.width>0&&box.height>0&&style.visibility!=='hidden'&&element.checkVisibility?.({checkOpacity:true,checkVisibilityCSS:true})!==false;};
 const label=element=>(element.getAttribute('aria-label')||element.textContent||element.tagName).trim().replace(/\s+/g,' ').slice(0,100);
 const colors=value=>{const match=value.match(/^rgba?\(([^)]+)\)$/);if(!match)return null;const parts=match[1].split(/[,\s/]+/).filter(Boolean).map(Number);if(parts.some(n=>!Number.isFinite(n)))return null;return parts.slice(0,3).concat(parts[3]??1);};
 const mix=(top,bottom)=>[0,1,2].map(i=>top[i]*top[3]+bottom[i]*(1-top[3])).concat(1);
 const mediaBoxes=[...document.querySelectorAll('img,video,canvas,svg,iframe')].filter(visible).map(element=>({element,box:element.getBoundingClientRect()}));
 const background=(element,textBox)=>{if(mediaBoxes.some(({element:media,box})=>!element.contains(media)&&box.left<textBox.right&&box.right>textBox.left&&box.top<textBox.bottom&&box.bottom>textBox.top))return null;const layers=[];for(let p=element;p;p=p.parentElement){const s=getComputedStyle(p);if(s.backgroundImage!=='none'||Number(s.opacity)<1||s.mixBlendMode!=='normal'||s.filter!=='none'||s.backdropFilter!=='none'||s.textShadow!=='none')return null;const c=colors(s.backgroundColor);if(!c)return null;layers.push(c);if(c[3]===1)break;}let result=[255,255,255,1];for(const color of layers.reverse())result=mix(color,result);return result;};
 const luminance=color=>color.slice(0,3).map(v=>{const c=v/255;return c<=.04045?c/12.92:((c+.055)/1.055)**2.4;}).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
 const ratio=(a,b)=>{const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
 const texts=[];const headings=[];const contrast=[];const unverified=[];
 const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
 let node,count=0;
 while((node=walker.nextNode())&&count<4000){
  const text=node.textContent.trim();const parent=node.parentElement;
  if(!text||!parent||parent.closest('script,style,template,noscript,svg')||!visible(parent))continue;
  count++;
  const style=getComputedStyle(parent);const range=document.createRange();range.selectNodeContents(node);const rectangles=[...range.getClientRects()].filter(r=>r.width>1&&r.height>1);
  if(!rectangles.length)continue;
  const size=parseFloat(style.fontSize),weight=Number(style.fontWeight)||400;
  texts.push({text:text.slice(0,100),family:style.fontFamily,size});
  if(parent.matches('h1,h2,h3,h4,h5,h6')){const ys=new Set(rectangles.map(r=>Math.round(r.top)));headings.push({text:text.slice(0,100),tag:parent.tagName,lines:ys.size,size});}
  const fg=colors(style.color),bg=background(parent,range.getBoundingClientRect());
  if(parent.closest(':disabled,[aria-disabled="true"]'))continue;
  if(!fg||!bg){unverified.push(text.slice(0,80));continue;}
  const value=ratio(mix(fg,bg),bg),required=size>=24||(size>=18.666&&weight>=700)?3:4.5;
  if(value+1e-9<required)contrast.push({text:text.slice(0,100),ratio:Math.round(value*100)/100,required});
 }
 const controls=[...document.querySelectorAll('button,input:not([type=hidden]),select,textarea,a[href],[role=button]')].filter(visible);
 const name=element=>{
  const labelled=element.getAttribute('aria-labelledby');
  if(labelled){const text=labelled.split(/\s+/).map(id=>document.getElementById(id)?.textContent||'').join(' ').trim();if(text)return text;}
  return element.getAttribute('aria-label')||[...(element.labels||[])].map(l=>l.textContent).join(' ').trim()||element.textContent.trim()||[...element.querySelectorAll('img[alt]')].map(i=>i.alt).join(' ')||element.getAttribute('title')||(['submit','reset','button'].includes(element.type)?element.value:'');
 };
 const unnamed=controls.filter(e=>!name(e)).map(e=>e.tagName.toLowerCase()+ (e.id?'#'+e.id:''));
 const targets=controls.filter(e=>!e.disabled&&e.tagName!=='A').map(e=>{const r=e.getBoundingClientRect();return {name:name(e).slice(0,80),width:Math.round(r.width),height:Math.round(r.height)};}).filter(e=>e.width<44||e.height<44);
 const clipped=controls.filter(e=>{const s=getComputedStyle(e);return e.scrollWidth>e.clientWidth+2&&['hidden','clip'].includes(s.overflowX)&&s.textOverflow!=='ellipsis';}).map(label);
 const imgs=[...document.images];
 const media={broken:imgs.filter(i=>i.complete&&!i.naturalWidth).map(i=>{try{const u=new URL(i.currentSrc||i.src);return u.origin+u.pathname;}catch{return '<image>';}}),missingAlt:imgs.filter(i=>!i.hasAttribute('alt')).length,pending:imgs.filter(i=>!i.complete).length};
 const fonts=[...document.fonts].map(face=>({family:face.family,status:face.status}));
 return {viewport:{width:innerWidth,height:innerHeight},title:document.title,overflow:Math.max(0,document.documentElement.scrollWidth-innerWidth),headings,contrast,unverifiedContrast:unverified.slice(0,15),sampledTextNodes:count,textSampleLimit:count===4000,textFamilies:[...new Set(texts.map(t=>t.family))],fonts,unnamedControls:unnamed,smallTargets:targets,clippedControls:clipped,media,reducedMotion:matchMedia('(prefers-reduced-motion:reduce)').matches,documentHeight:document.documentElement.scrollHeight};
}
