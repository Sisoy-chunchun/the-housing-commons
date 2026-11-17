'use strict';
// Accessible two-column About section selector. The original chapter paragraphs
// stay in the HTML, and only one panel is displayed once JavaScript has loaded.
(() => {
  const tabs = [...document.querySelectorAll('.about-choice[role="tab"]')];
  const panels = [...document.querySelectorAll('.about-tabpanel[role="tabpanel"]')];
  if (!tabs.length || tabs.length !== panels.length) return;

  const valid = tabs.every(tab => panels.some(panel =>
    panel.id === tab.getAttribute('aria-controls')
  ));
  if (!valid) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = window.matchMedia('(max-width: 850px)');

  function activate(tab, options = {}) {
    const panelId = tab.getAttribute('aria-controls');
    let activePanel = null;

    tabs.forEach(item => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    panels.forEach(panel => {
      const selected = panel.id === panelId;
      panel.classList.toggle('is-active', selected);
      panel.hidden = !selected;
      if (selected) activePanel = panel;
    });

    if (!activePanel) return;
    if (options.updateHash) {
      history.replaceState(null, '', '#' + encodeURIComponent(panelId));
    }
    if (options.focusTab) tab.focus();
    if (options.scrollPanel && mobile.matches) {
      activePanel.scrollIntoView({
        behavior: reduceMotion.matches ? 'auto' : 'smooth',
        block: 'start'
      });
    } else if (options.scrollPanel && activePanel.getBoundingClientRect().top < 96) {
      activePanel.scrollIntoView({
        behavior: reduceMotion.matches ? 'auto' : 'smooth',
        block: 'start'
      });
    }
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab, {
      updateHash: true, scrollPanel: true
    }));
    tab.addEventListener('keydown', event => {
      let next = -1;
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next < 0) return;
      event.preventDefault();
      activate(tabs[next], {updateHash: true, focusTab: true});
    });
  });

  function fromHash() {
    const id = decodeURIComponent(location.hash.slice(1));
    return tabs.find(tab => tab.getAttribute('aria-controls') === id);
  }

  // After wiring interactions, hide inactive panels while retaining their
  // source content in the DOM for a no-script fallback.
  document.documentElement.classList.add('about-tabs-ready');
  activate(fromHash() || tabs[0]);
  window.addEventListener('hashchange', () => {
    const tab = fromHash();
    if (tab) activate(tab);
  });
})();
