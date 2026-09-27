function initMarquees(root = document) {
  root.querySelectorAll('.marquee__track').forEach((track) => {
    if (track.dataset.cloned === 'true') return;
    [...track.children].forEach((item) => {
      const clone = item.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });
    track.dataset.cloned = 'true';
  });
}

window.WellBalance.register('initMarquees', initMarquees);
