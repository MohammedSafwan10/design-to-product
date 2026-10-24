const labels={marketing:'Website','product-web':'Product',dashboard:'Dashboard',mobile:'Mobile',desktop:'Desktop',game:'Game UI'};
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let entries=[];
function render(surface=''){
 const filtered=entries.filter(entry=>!surface||entry.surface===surface);
 document.querySelector('#studies').innerHTML=filtered.map(entry=>`<article class="study" data-surface="${entry.surface}" style="--ground:${entry.ground}"><a href="${entry.id}/index.html" aria-label="Open ${escape(entry.name)} study"><div class="image"><img src="previews/${entry.id}.png" alt="${escape(entry.alt)}" loading="lazy" width="1440" height="900"></div><div class="caption"><h2>${escape(entry.name)} ↗</h2><span>${labels[entry.surface]}</span></div><p>${escape(entry.idea)}</p></a></article>`).join('');
 document.querySelector('#status').textContent=`${filtered.length} studies shown.`;
}
try{const response=await fetch('manifest.json');if(!response.ok)throw Error('Catalog unavailable');entries=(await response.json()).entries;render();document.documentElement.dataset.showcaseReady='true';}catch(error){document.querySelector('#status').classList.remove('sr');document.querySelector('#status').textContent=error.message;}
for(const button of document.querySelectorAll('[data-surface]'))button.addEventListener('click',()=>{for(const other of document.querySelectorAll('nav button'))other.setAttribute('aria-pressed',String(other===button));render(button.dataset.surface);});
