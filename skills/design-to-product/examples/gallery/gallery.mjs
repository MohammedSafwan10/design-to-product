import {enhanceSelects,closeIcon,lockPageScroll} from '../controls.mjs';
const labels={marketing:'Marketing web','product-web':'Product web',mobile:'Mobile apps',desktop:'Desktop apps',dashboard:'Dashboards',game:'Game interfaces'};
const pilot={marketing:['artifact-demonstration','editorial-proof','contextual-place','output-gallery','guided-comparison','process-cutaway'],'product-web':['search-workbench','booking-decision','cart-review','upload-review','collection-curator','permission-console'],mobile:['capture-review','daily-brief','route-companion','conversation-focus','collection-pocket','quiet-timer'],desktop:['document-studio','media-library','timeline-editor','command-workbench','file-transfer','connection-inspector'],dashboard:['exception-triage','operations-board','comparison-table','cohort-explorer','audit-trail','capacity-planner'],game:['focus-hud','tactical-command','route-map','inventory-bench','run-preparation','results-recap']};
const $=selector=>document.querySelector(selector);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const hasStudy=e=>pilot[e.surface]?.includes(e.id.split('/').at(-1));
const studyURL=e=>`../specimens/index.html?${new URLSearchParams({surface:e.surface,screen:e.id.split('/').at(-1)})}`;
const list=value=>Array.isArray(value)?value:[value];
const human=s=>s.replace(/([A-Z])/g,' $1').replace(/[-_]/g,' ').replace(/^./,c=>c.toUpperCase());
const section=(title,value)=>`<h3>${esc(title)}</h3>${Array.isArray(value)?`<ul>${value.map(v=>`<li>${esc(v)}</li>`).join('')}</ul>`:typeof value==='object'?`<dl>${Object.entries(value||{}).map(([key,v])=>`<dt>${esc(human(key))}</dt><dd>${esc(v)}</dd>`).join('')}</dl>`:`<p>${esc(value)}</p>`}`;
let unlock;
let entries=[],selected;
async function details(id){
 const entry=entries.find(e=>e.id===id);if(!entry)return;
 selected=document.activeElement;$('#detail-body').textContent='Loading recipe…';unlock=lockPageScroll();$('#detail').showModal();
 try{const response=await fetch(new URL(`../../library/${entry.path}`,import.meta.url));if(!response.ok)throw Error('Recipe could not be loaded.');const recipe=await response.json();
 $('#detail-body').innerHTML=`<p class="eyebrow">${esc(labels[entry.surface])} / ${esc(recipe.reviewStatus)}</p><h2>${esc(recipe.title)}</h2><p>${esc(recipe.idea.startsWith(recipe.title+":")?recipe.idea.slice(recipe.title.length+1).trim():recipe.idea)}</p>${section('Works well when',recipe.worksWellWhen)}${section('Avoid when',recipe.avoidWhen)}<details class=recipe-technical><summary>Layout and responsive notes</summary>${section('Composition',recipe.composition)}${section('Responsive behavior',recipe.responsiveRules)}</details><details class=recipe-technical><summary>States and implementation</summary>${section('State contracts',recipe.stateContracts)}${section('Accessibility risks',recipe.accessibilityRisks)}${section('Linked modules',[...(recipe.typeRecipeIds||[]),...(recipe.paletteRecipeIds||[]),...(recipe.patternIds||[])])}</details>${hasStudy(entry)?`<a class="study-link" href="${studyURL(entry)}">Open study ↗</a>`:''}`;
 }catch(error){$('#detail-body').textContent=error.message;}
}
function render(){const surface=$('#surface').value,term=$('#search').value.toLowerCase().trim(),example=$('#examples').value;
 const filtered=entries.filter(e=>(!surface||e.surface===surface)&&(!example||hasStudy(e))&&(!term||`${e.title} ${e.id} ${(e.tasks||[]).join(' ')}`.toLowerCase().includes(term)));
 $('#count').textContent=`${filtered.length} directions`;
 $('#list').innerHTML=filtered.length?filtered.map((e,n)=>`<article class="recipe"><span class="number">${String(n+1).padStart(2,'0')}</span><div><small>${esc(labels[e.surface])}</small><h3>${esc(e.title)}</h3></div><div class="actions">${hasStudy(e)?`<a href="${studyURL(e)}" aria-label="Open ${esc(e.title)} browser study">Open study ↗</a>`:''}<button data-id="${esc(e.id)}" aria-label="Read ${esc(e.title)} recipe">Details</button></div></article>`).join(''):'<p class="empty">No matching recipes. Try a broader task or another surface.</p>';
 const query=new URLSearchParams();if(surface)query.set('surface',surface);if(term)query.set('q',term);if(example)query.set('examples',example);history.replaceState(null,'',`${location.pathname}${query.size?'?'+query:''}`);
}
$('#filters').addEventListener('submit',e=>e.preventDefault());for(const control of document.querySelectorAll('#filters input,#filters select'))control.addEventListener('input',render);
$('#list').addEventListener('click',e=>{const button=e.target.closest('[data-id]');if(button)details(button.dataset.id);});$('#close').addEventListener('click',()=>{unlock?.();$('#detail').close();});$('#detail').addEventListener('close',()=>{unlock?.();selected?.focus();});closeIcon($('#close'));
try{const response=await fetch('../../library/index.json');if(!response.ok)throw Error('The library could not be loaded. Serve this folder over HTTP; opening file:// does not permit JSON loading.');const index=await response.json();entries=index.entries;const query=new URLSearchParams(location.search);$('#surface').value=query.get('surface')||'';$('#search').value=query.get('q')||'';$('#examples').value=query.get('examples')||'';render();enhanceSelects();document.documentElement.dataset.galleryReady='true';}catch(error){$('#error').hidden=false;$('#error').textContent=error.message;$('#count').textContent='Catalog unavailable';}
