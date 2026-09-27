function initCardEffects(root = document) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion || !window.matchMedia('(hover: hover)').matches) return;

  root.querySelectorAll('[data-tilt]').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      card.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 5}deg) rotateY(${(x - 0.5) * 7}deg)`;
      card.style.setProperty('--gx', `${x * 100}%`);
      card.style.setProperty('--gy', `${y * 100}%`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });

  root.querySelectorAll('[data-spotlight]').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--sx', `${event.clientX - rect.left}px`);
      card.style.setProperty('--sy', `${event.clientY - rect.top}px`);
    });
  });
}

window.WellBalance.register('initCardEffects', initCardEffects);
