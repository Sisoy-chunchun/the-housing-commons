'use strict';
// Motion is a progressive enhancement; all paragraphs remain in the document.
if('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches){
 const sections=[...document.querySelectorAll('.reveal')];
 const watcher=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');watcher.unobserve(e.target);}}),{rootMargin:'0px 0px 12% 0px',threshold:.08});
 sections.forEach(s=>watcher.observe(s));
 document.documentElement.classList.add('js-enhanced');
}
