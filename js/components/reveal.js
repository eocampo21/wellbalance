function initReveals(root = document) {
  const animateCount = (element) => {
    if (element.dataset.counted) return;
    element.dataset.counted = 'true';
    const target = Number(element.dataset.count);
    const start = performance.now();
    const duration = 2200;

    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = Math.pow(progress, 3);
      element.textContent = String(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      entry.target.querySelectorAll('[data-count]').forEach(animateCount);
      if (entry.target.matches('[data-count]')) animateCount(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: .12 });

  root.querySelectorAll('[data-reveal], .stat').forEach((element) => observer.observe(element));

  const footerWord = root.querySelector('.footer__word');
  if (footerWord) {
    const orbs = [...footerWord.querySelectorAll('.logo__mark span')];
    const playOrbs = () => {
      orbs.forEach((orb) => {
        orb.style.animation = 'none';
        orb.getBoundingClientRect();
        orb.style.animation = '';
      });
      footerWord.classList.add('is-live');
    };
    const footerObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) playOrbs();
        else footerWord.classList.remove('is-live');
      });
    }, { threshold: .2 });
    footerObserver.observe(footerWord);
  }

  const scrollText = root.querySelector('[data-scroll-text]');
  if (!scrollText) return;

  scrollText.innerHTML = scrollText.textContent
    .trim()
    .split(/\s+/)
    .map((word) => `<span>${word} </span>`)
    .join('');
  const words = [...scrollText.querySelectorAll('span')];
  const highlightWords = () => {
    const rect = scrollText.getBoundingClientRect();
    const ratio = Math.max(
      0,
      Math.min(1, (window.innerHeight * .8 - rect.top) / (rect.height + window.innerHeight * .35)),
    );
    words.forEach((word, index) => word.classList.toggle('is-lit', index / words.length < ratio));
  };

  window.addEventListener('scroll', highlightWords, { passive: true });
  highlightWords();
}

window.WellBalance.register('initReveals', initReveals);
