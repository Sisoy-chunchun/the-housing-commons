'use strict';
// The About chapters retain their original copy in the page. The dialog
// presents a cloned chapter rather than modifying the original source.
(() => {
  const dialog = document.getElementById('about-dialog');
  const content = document.getElementById('about-dialog-content');
  const closeButton = document.getElementById('about-dialog-close');
  const buttons = [...document.querySelectorAll('.about-choice[data-about-target]')];
  if (!dialog || !content || !closeButton || !buttons.length) return;
  if (typeof dialog.showModal !== 'function') {
    buttons.forEach(button => button.addEventListener('click', () => {
      document.getElementById(button.dataset.aboutTarget)?.scrollIntoView({block:'start'});
    }));
    return;
  }
  let lastTrigger = null;
  function openSection(button) {
    const original = document.getElementById(button.dataset.aboutTarget);
    if (!original) return;
    const panel = document.createElement('div');
    panel.className = 'about-dialog-body';
    for (const node of original.childNodes) panel.appendChild(node.cloneNode(true));
    const heading = panel.querySelector('h2');
    if (!heading) return;
    heading.id = 'about-dialog-title';
    content.replaceChildren(panel);
    dialog.style.setProperty('--about-tone', getComputedStyle(button).backgroundColor);
    lastTrigger = button;
    if (!dialog.open) dialog.showModal();
    dialog.scrollTop = 0;
    closeButton.focus();
  }
  buttons.forEach(button => button.addEventListener('click', () => openSection(button)));
  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    if (lastTrigger?.isConnected) lastTrigger.focus();
  });
  document.documentElement.classList.add('about-modal-ready');
  const hashId = decodeURIComponent(location.hash.slice(1));
  const selected = buttons.find(button => button.dataset.aboutTarget === hashId);
  if (selected) openSection(selected);
})();
