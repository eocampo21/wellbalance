function initPreloader(root = document) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const count = root.querySelector('[data-preloader-count]');
  let progress = 0;
  let loadingTimer;
  let hasFinished = false;

  root.body.classList.add('is-loading');

  const finish = () => {
    if (hasFinished) return;
    hasFinished = true;
    window.clearInterval(loadingTimer);
    if (count) count.textContent = '100';
    root.body.classList.remove('is-loading');
    root.body.classList.add('is-loaded');
  };

  if (reducedMotion) {
    finish();
    return;
  }

  loadingTimer = window.setInterval(() => {
    progress = Math.min(96, progress + Math.ceil(Math.random() * 9));
    if (count) count.textContent = String(progress);
  }, 70);

  if (root.readyState === 'complete') {
    window.setTimeout(finish, 250);
  } else {
    window.addEventListener('load', () => window.setTimeout(finish, 250), { once: true });
  }
  window.setTimeout(finish, 2200);
}

window.WellBalance.register('initPreloader', initPreloader);
