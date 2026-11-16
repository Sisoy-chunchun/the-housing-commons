/* Size the local network iframe to its content, not to the iframe viewport.
   The graph's legacy height message can include document.scrollHeight; using that
   value directly causes a growing iframe/scrollbar feedback loop. */
(() => {
  const frame = document.getElementById('housing-network-frame');
  if (!frame) return;

  function measuredContentHeight() {
    try {
      const main = frame.contentDocument?.querySelector('main');
      if (!main) return null;
      // The network is served from this same website, so its main element is readable.
      // Its bottom is independent of the iframe's often much taller viewport.
      return Math.ceil(main.getBoundingClientRect().bottom + (frame.contentWindow?.scrollY || 0));
    } catch {
      return null;
    }
  }

  function resizeFrame(reportedHeight) {
    const measured = measuredContentHeight();
    const height = measured ?? reportedHeight;
    if (!Number.isFinite(height) || height < 450 || height > 7000) return;
    const target = Math.ceil(height + 8);
    if (Math.abs(frame.getBoundingClientRect().height - target) > 3) {
      frame.style.height = target + 'px';
    }
  }

  window.addEventListener('message', event => {
    if (event.source !== frame.contentWindow || event.origin !== window.location.origin) return;
    const data = event.data;
    if (!data || data.type !== 'housing-commons-network-height') return;
    resizeFrame(Number(data.height));
  });

  frame.addEventListener('load', () => resizeFrame(null));
})();
