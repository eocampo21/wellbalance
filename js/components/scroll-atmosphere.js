function initScrollAtmosphere(root = document) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = window.scrollY;
  let target = window.scrollY;
  let ticking = false;

  const apply = (value) => {
    const max = root.documentElement.scrollHeight - window.innerHeight;
    root.documentElement.style.setProperty('--progress', max > 0 ? value / max : 0);
    root.documentElement.style.setProperty('--parallax', `${value * .12}px`);
    root.documentElement.style.setProperty('--parallax-rings', `${value * .07}px`);
  };

  const tick = () => {
    current += (target - current) * .08;
    if (Math.abs(target - current) < .2) current = target;
    apply(current);
    if (current !== target) {
      requestAnimationFrame(tick);
    } else {
      ticking = false;
    }
  };

  const onScroll = () => {
    target = window.scrollY;
    if (reducedMotion) {
      apply(target);
      return;
    }
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(tick);
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  apply(current);
}

window.WellBalance.register('initScrollAtmosphere', initScrollAtmosphere);
