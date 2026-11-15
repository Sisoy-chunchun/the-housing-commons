/* Frames resize themselves after layout changes; only messages from the local network frame are accepted. */
(() => {
  const frame = document.getElementById('housing-network-frame');
  if (!frame) return;
  window.addEventListener('message', event => {
    if (event.source !== frame.contentWindow || event.origin !== window.location.origin) return;
    const data = event.data;
    if (!data || data.type !== 'housing-commons-network-height') return;
    const height = Number(data.height);
    if (!Number.isFinite(height) || height < 450 || height > 7000) return;
    frame.style.height = Math.ceil(height + 8) + 'px';
  });
})();
