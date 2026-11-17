'use strict';
// These are content type labels only. The first prototype has no lessons or articles.
const areas={ownership:{title:'OWNERSHIP MODELS',description:'How community land trusts, cooperatives and other models could be explained.',modules:['Model library','Illustrated explainers','Model comparison']},systems:{title:'HOUSING SYSTEMS',description:'How housing finance, development, governance, and affordability could be explored.',modules:['System overview','Process diagrams','Key concepts']},tools:{title:'INTERACTIVE LEARNING TOOLS',description:'Interactive examples and tools for learning about housing.',modules:['Interactive explorer','Comparison tool','Practice scenarios']},studies:{title:'CASE STUDIES & FIELD NOTES',description:'Examples from projects and communities, when sourced and developed.',modules:['Field notes','Project profiles','Lessons learned']},policy:{title:'POLICY & PARTICIPATION',description:'A place for public decisions, policies, and ways to participate.',modules:['Policy basics','Public processes','Participation guides']},guides:{title:'GUIDES & PRACTICAL RESOURCES',description:'Practical materials for housing projects and organizational work.',modules:['Step-by-step guides','Templates & checklists','Resource library']}};
const cards=[...document.querySelectorAll('[data-area]')];

// The Precedents and Proposals cards reuse the authoritative Model Explorer data.
// Do not duplicate, paraphrase, or change the text or URLs from data.js.
function renderPrecedentsAndProposals() {
  const grid = document.getElementById('learn-context-grid');
  if (grid.childElementCount) return;
  const contexts = window.HOUSING_DATA?.contexts;
  if (!Array.isArray(contexts) || contexts.length === 0) {
    grid.textContent = 'The precedents and proposals could not be loaded.';
    return;
  }
  const card = (entry) => {
    const article = document.createElement('article');
    article.className = 'learn-context-card';
    article.dataset.kind = entry.status === 'Historical precedent' ? 'historical' : 'proposal';
    const field = (tag, className, value) => {
      const element = document.createElement(tag);
      element.className = className;
      element.textContent = value;
      return element;
    };
    const badge = field('span', 'learn-context-status', entry.status);
    const title = field('h3', '', entry.title);
    const location = field('p', 'learn-context-location', entry.place);
    const body = field('p', 'learn-context-body', entry.body);
    const lesson = field('p', 'learn-context-lesson', entry.lesson);
    const source = document.createElement('a');
    source.className = 'learn-context-source';
    source.textContent = 'Read the source';
    source.href = entry.url;
    source.target = '_blank';
    source.rel = 'noopener noreferrer';
    article.append(badge, title, location, body, lesson, source);
    return article;
  };
  grid.replaceChildren(...contexts.map(card));
}

function showArea(id, scroll=false){const a=areas[id];if(!a)return;cards.forEach(c=>c.setAttribute('aria-pressed',String(c.dataset.area===id)));document.getElementById('learn-preview-title').textContent=a.title;document.getElementById('learn-preview-description').textContent=a.description;const showContexts = id === 'studies';
  document.getElementById('learn-preview').classList.toggle('show-contexts', showContexts);
  document.getElementById('learn-preview-placeholder').hidden = showContexts;
  document.getElementById('learn-contexts').hidden = !showContexts;
  if(showContexts){renderPrecedentsAndProposals();}else{const grid=document.getElementById('learn-preview-modules');grid.replaceChildren(...a.modules.map((name,i)=>{const div=document.createElement('article');div.className='module';const h=document.createElement('h4');h.textContent=name;const p=document.createElement('p');p.textContent=`MODULE 0${i+1} · PLACEHOLDER`;div.append(h,p);return div;}));}if(scroll){const target=document.getElementById('preview');target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});target.focus({preventScroll:true});}}
cards.forEach(c=>c.addEventListener('click',()=>{if(c.dataset.area==='ownership'){window.location.assign('model-explorer.html');return;}showArea(c.dataset.area,true);}));showArea('ownership');
