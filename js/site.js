'use strict';
const menu = document.querySelector('.menu-toggle');
const nav = document.getElementById('main-nav');
if (menu && nav) {
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    nav.classList.toggle('open', open);
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false');
  }));
}
const previews = {
  commons:'The Commons connects learning, resources, and ideas.',
  learn:'Learn: explore ways of understanding housing ownership and systems.',
  explore:'Explore: find housing-related organizations and resources.',
  connect:'Connect: see possible relationships and opportunities for collaboration.',
  share:'Share: exchange tools, expertise, knowledge, and ideas.',
  imagine:'Imagine: develop possibilities for community-led housing projects.',
  build:'Build: move ideas toward practical community housing projects.',
  reinvest:'Reinvest: keep community-created value available for future benefit.'
};
document.querySelectorAll('[data-network="home"] .node').forEach(node => {
  node.addEventListener('click', () => {
    document.querySelectorAll('[data-network="home"] .node').forEach(n => n.setAttribute('aria-pressed', String(n === node)));
    const label = document.getElementById('home-node-label');
    if (label) label.textContent = previews[node.dataset.node] || previews.commons;
  });
});
