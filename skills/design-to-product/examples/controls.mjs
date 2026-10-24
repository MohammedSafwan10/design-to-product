// Select-only combobox for these authored browser studies. Native select remains
// the form value and no-JS fallback. APG semantics do not replace AT/device tests.
let serial=0,openControl;
const closeOpen=()=>openControl?.close();
document.addEventListener('pointerdown',event=>{if(openControl&&!openControl.wrapper.contains(event.target))closeOpen();});
window.addEventListener('resize',closeOpen);
document.addEventListener('scroll',event=>{if(openControl&&!openControl.popup.contains(event.target))closeOpen();},true);
export function enhanceSelects(root=document){
 for(const select of root.querySelectorAll('select:not([multiple]):not([data-enhanced])')){
  // Required/large/native specialized pickers keep their native validation UX.
  if(select.required||select.size>1)continue;
  select.dataset.enhanced='true';const wrapper=document.createElement('span');wrapper.className='select-control';select.before(wrapper);wrapper.append(select);
  const button=document.createElement('button');button.type='button';button.className='select-trigger';button.setAttribute('role','combobox');button.setAttribute('aria-haspopup','listbox');button.setAttribute('aria-expanded','false');
  const label=select.labels?.[0];if(label){if(!label.id)label.id=`select-label-${++serial}`;button.setAttribute('aria-label',[...label.childNodes].filter(n=>n.nodeType===Node.TEXT_NODE).map(n=>n.textContent.trim()).join(' ')||'Choose an option');}
  else button.setAttribute('aria-label',select.getAttribute('aria-label')||'Choose an option');
  const text=document.createElement('span');text.className='select-value';button.append(text);const arrow=document.createElement('span');arrow.className='select-arrow';arrow.setAttribute('aria-hidden','true');button.append(arrow);
  const popup=document.createElement('span');popup.id=`select-popup-${++serial}`;popup.className='select-popup';popup.setAttribute('role','listbox');popup.setAttribute('aria-label',button.getAttribute('aria-label'));popup.hidden=true;button.setAttribute('aria-controls',popup.id);wrapper.append(button,popup);select.hidden=true;
  const options=[...select.options];let active=select.selectedIndex,typed='',typedAt=0;
  const nodes=options.map((option,index)=>{const node=document.createElement('span');node.className='select-option';node.id=`${popup.id}-${index}`;node.setAttribute('role','option');node.setAttribute('aria-disabled',String(option.disabled));node.textContent=option.textContent;node.addEventListener('pointerdown',event=>event.preventDefault());node.addEventListener('click',()=>{if(!option.disabled){active=index;commit();button.focus();}});popup.append(node);return node;});
  const sync=()=>{text.textContent=options[select.selectedIndex]?.textContent||'Choose';button.disabled=select.disabled;nodes.forEach((node,index)=>{node.setAttribute('aria-selected',String(index===select.selectedIndex));node.classList.toggle('is-active',index===active);});};
  const close=()=>{popup.hidden=true;button.setAttribute('aria-expanded','false');button.removeAttribute('aria-activedescendant');if(openControl?.wrapper===wrapper)openControl=undefined;};
  const highlight=()=>{sync();button.setAttribute('aria-activedescendant',nodes[active]?.id||'');nodes[active]?.scrollIntoView({block:'nearest'});};
  const show=()=>{closeOpen();active=select.selectedIndex;popup.hidden=false;button.setAttribute('aria-expanded','true');openControl={wrapper,popup,close};const rect=button.getBoundingClientRect();const width=Math.min(Math.max(rect.width,220),innerWidth-24);const below=innerHeight-rect.bottom-12,above=rect.top-12;const height=Math.min(320,Math.max(below,above));popup.style.width=`${width}px`;popup.style.left=`${Math.min(Math.max(12,rect.left),innerWidth-width-12)}px`;popup.style.maxHeight=`${height}px`;popup.style.top=below>=Math.min(240,above)?`${rect.bottom+6}px`:'auto';popup.style.bottom=below>=Math.min(240,above)?'auto':`${innerHeight-rect.top+6}px`;highlight();};
  function commit(){if(active>=0&&!options[active].disabled){select.selectedIndex=active;sync();select.dispatchEvent(new Event('input',{bubbles:true}));select.dispatchEvent(new Event('change',{bubbles:true}));}close();}
  function step(delta){let next=active;do{next+=delta;}while(next>=0&&next<options.length&&options[next].disabled);if(next>=0&&next<options.length)active=next;highlight();}
  button.addEventListener('click',()=>popup.hidden?show():close());
  button.addEventListener('blur',close);
  button.addEventListener('keydown',event=>{
   if(event.key==='Escape'){event.preventDefault();event.stopPropagation();close();return;}
   if(event.key==='Tab'){close();return;}
   if(['Enter',' '].includes(event.key)){event.preventDefault();if(popup.hidden)show();else commit();return;}
   if(['ArrowDown','ArrowUp','Home','End'].includes(event.key)){event.preventDefault();const wasClosed=popup.hidden;if(wasClosed)show();if(event.key==='Home')active=options.findIndex(o=>!o.disabled);else if(event.key==='End')active=options.findLastIndex(o=>!o.disabled);else if(!wasClosed)step(event.key==='ArrowDown'?1:-1);highlight();return;}
   if(event.key.length===1&&!event.ctrlKey&&!event.metaKey&&!event.altKey){event.preventDefault();if(popup.hidden)show();typed=Date.now()-typedAt>700?event.key:typed+event.key;typedAt=Date.now();const match=options.findIndex(o=>!o.disabled&&o.textContent.trim().toLowerCase().startsWith(typed.toLowerCase()));if(match>=0){active=match;highlight();}}
  });select.addEventListener('input',sync);select.addEventListener('change',sync);select.form?.addEventListener('reset',()=>queueMicrotask(sync));sync();
 }
}
export function closeIcon(button){button.classList.add('icon-close');button.setAttribute('aria-label','Close dialog');button.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m6 6 12 12M18 6 6 18"/></svg>';}
export function lockPageScroll(){const html=document.documentElement,body=document.body;const before=[html.style.overflow,body.style.overflow];html.style.overflow='hidden';body.style.overflow='hidden';let done=false;return ()=>{if(done)return;done=true;[html.style.overflow,body.style.overflow]=before;};}
