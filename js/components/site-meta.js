function initSiteMeta(root = document) {
  const clock = root.querySelector('[data-clock]');
  const year = root.querySelector('[data-year]');

  const updateClock = () => {
    if (!clock) return;
    clock.textContent = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date());
  };

  updateClock();
  if (clock) window.setInterval(updateClock, 30000);
  if (year) year.textContent = String(new Date().getFullYear());
}

window.WellBalance.register('initSiteMeta', initSiteMeta);
