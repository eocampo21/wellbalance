function initNavigation(root = document) {
  const nav = root.querySelector('[data-nav]');
  const navLinks = [...root.querySelectorAll('.nav__link')];
  const indicator = root.querySelector('.nav__indicator');
  const sections = [...root.querySelectorAll('[data-section]')];
  const burger = root.querySelector('[data-burger]');
  const mobileMenu = root.querySelector('[data-mobile-menu]');
  let lastScrollY = window.scrollY;

  const moveIndicator = (link) => {
    if (!indicator || !link) return;
    indicator.style.width = `${link.offsetWidth}px`;
    indicator.style.transform = `translateX(${link.offsetLeft}px)`;
  };

  const update = () => {
    const y = window.scrollY;
    nav?.classList.toggle('is-scrolled', y > 40);
    const menuOpen = mobileMenu?.classList.contains('is-open');
    nav?.classList.toggle('is-hidden', !menuOpen && y > lastScrollY && y > 500);
    lastScrollY = Math.max(0, y);

    const current = [...sections]
      .reverse()
      .find((section) => y + window.innerHeight * .38 >= section.offsetTop);
    if (!current) return;

    const active = navLinks.find((link) => link.hash === `#${current.id}`);
    if (active && !active.classList.contains('is-active')) {
      navLinks.forEach((link) => link.classList.toggle('is-active', link === active));
      moveIndicator(active);
    }
  };

  const closeMenu = () => {
    burger?.setAttribute('aria-expanded', 'false');
    burger?.setAttribute('aria-label', 'Open menu');
    mobileMenu?.classList.remove('is-open');
    mobileMenu?.setAttribute('aria-hidden', 'true');
    root.body.style.overflow = '';
  };

  const openMenu = () => {
    burger?.setAttribute('aria-expanded', 'true');
    burger?.setAttribute('aria-label', 'Close menu');
    mobileMenu?.classList.add('is-open');
    mobileMenu?.setAttribute('aria-hidden', 'false');
    nav?.classList.remove('is-hidden');
    root.body.style.overflow = 'hidden';
  };

  burger?.addEventListener('click', () => {
    const isOpen = burger.getAttribute('aria-expanded') !== 'true';
    if (isOpen) openMenu();
    else closeMenu();
  });
  mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  mobileMenu?.addEventListener('click', (event) => {
    if (event.target === mobileMenu) closeMenu();
  });
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', () => moveIndicator(root.querySelector('.nav__link.is-active')));
  window.setTimeout(() => moveIndicator(root.querySelector('.nav__link.is-active')), 100);
  update();
}

window.WellBalance.register('initNavigation', initNavigation);
