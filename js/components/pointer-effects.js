function initPointerEffects(root = document) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cursor = root.querySelector('.cursor');
  const dot = root.querySelector('.cursor__dot');
  const ring = root.querySelector('.cursor__ring');

  if (cursor && dot && ring && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;

    window.addEventListener('pointermove', (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    const renderCursor = () => {
      ringX += (mouseX - ringX) * .16;
      ringY += (mouseY - ringY) * .16;
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
      requestAnimationFrame(renderCursor);
    };
    renderCursor();

    root.querySelectorAll('a, button, input, textarea, [data-tilt]').forEach((element) => {
      element.addEventListener('pointerenter', () => cursor.classList.add('is-hover'));
      element.addEventListener('pointerleave', () => cursor.classList.remove('is-hover'));
    });
  }

  root.querySelectorAll('[data-magnetic]').forEach((element) => {
    if (element.classList.contains('btn')) return;

    element.addEventListener('pointermove', (event) => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      if (!reducedMotion) {
        element.style.transform = `translate(${(x - rect.width / 2) * .12}px, ${(y - rect.height / 2) * .12}px)`;
      }
    });
    element.addEventListener('pointerleave', () => {
      element.style.transform = '';
    });
  });
}

window.WellBalance.register('initPointerEffects', initPointerEffects);
