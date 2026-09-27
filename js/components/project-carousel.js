function initProjectCarousel(root = document) {
  const carousel = root.querySelector('[data-carousel]');
  const track = root.querySelector('[data-carousel-track]');
  if (!carousel || !track) return;

  const previousButton = root.querySelector('[data-carousel-prev]');
  const nextButton = root.querySelector('[data-carousel-next]');
  const progressBar = root.querySelector('[data-carousel-progress]');
  const filters = [...root.querySelectorAll('[data-filter]')];
  const originals = [...track.querySelectorAll('.work-card')];
  let position = 0;
  let setWidth = 0;
  let visibleCount = originals.length;
  let animationFrame = 0;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartPosition = 0;
  let lastPointerX = 0;
  let lastPointerTime = 0;
  let velocity = 0;

  const cloneSet = () => {
    const fragment = document.createDocumentFragment();
    originals.forEach((card) => {
      const clone = card.cloneNode(true);
      clone.dataset.carouselClone = 'true';
      clone.setAttribute('aria-hidden', 'true');
      fragment.appendChild(clone);
    });
    return fragment;
  };

  // Two buffer sets on either side make the loop safe on wide screens.
  const leading = document.createDocumentFragment();
  leading.append(cloneSet(), cloneSet());
  track.prepend(leading);
  track.append(cloneSet(), cloneSet());

  const allCards = [...track.querySelectorAll('.work-card')];
  const gapSize = () => parseFloat(getComputedStyle(track).gap) || 0;

  const measureSetWidth = () => {
    const visible = originals.filter((card) => !card.classList.contains('is-filtered'));
    const gap = gapSize();
    return visible.reduce((total, card) => total + card.offsetWidth + gap, 0);
  };

  const step = () => (visibleCount ? measureSetWidth() / visibleCount : 0);

  const normalizePosition = () => {
    if (!setWidth) return;
    while (position < setWidth) position += setWidth;
    while (position >= setWidth * 3) position -= setWidth;
  };

  const updateProgress = () => {
    if (!progressBar || !setWidth) return;
    const visibleCards = Math.max(1, Math.floor(carousel.clientWidth / step()));
    const width = Math.min(100, visibleCards / visibleCount * 100);
    const cycle = ((position % setWidth) + setWidth) % setWidth;
    const offset = cycle / setWidth * (100 - width);
    progressBar.style.setProperty('--width', `${width}%`);
    progressBar.style.setProperty('--offset', `${offset / (width / 100)}%`);
  };

  const render = () => {
    normalizePosition();
    track.style.transform = `translate3d(${-position}px, 0, 0)`;
    updateProgress();
  };

  const measure = (preservePosition = true) => {
    const previousWidth = setWidth;
    const cycleRatio = previousWidth
      ? (((position % previousWidth) + previousWidth) % previousWidth) / previousWidth
      : 0;
    setWidth = measureSetWidth();
    position = setWidth * (2 + (preservePosition ? cycleRatio : 0));
    render();
  };

  const stopMotion = () => {
    window.cancelAnimationFrame(animationFrame);
    carousel.classList.remove('is-gliding');
  };

  const glide = () => {
    stopMotion();
    carousel.classList.add('is-gliding');
    let previousTime = performance.now();

    const frame = (now) => {
      const elapsed = Math.min(32, now - previousTime);
      previousTime = now;
      position += velocity * elapsed;
      velocity *= Math.pow(.95, elapsed / 16);
      render();

      if (Math.abs(velocity) > .015) {
        animationFrame = requestAnimationFrame(frame);
      } else {
        carousel.classList.remove('is-gliding');
      }
    };
    animationFrame = requestAnimationFrame(frame);
  };

  const moveOneCard = (direction) => {
    stopMotion();
    velocity = direction * 1.2;
    glide();
  };

  previousButton?.addEventListener('click', () => moveOneCard(-1));
  nextButton?.addEventListener('click', () => moveOneCard(1));
  if (previousButton) previousButton.disabled = false;
  if (nextButton) nextButton.disabled = false;

  filters.forEach((button) => {
    button.addEventListener('click', () => {
      filters.forEach((item) => item.classList.toggle('is-active', item === button));
      const filter = button.dataset.filter;
      allCards.forEach((card) => {
        card.classList.toggle(
          'is-filtered',
          filter !== 'all' && card.dataset.category !== filter,
        );
      });
      visibleCount = originals.filter(
        (card) => filter === 'all' || card.dataset.category === filter,
      ).length;
      stopMotion();
      measure(false);
    });
  });

  carousel.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    stopMotion();
    isDragging = true;
    dragStartX = event.clientX;
    dragStartPosition = position;
    lastPointerX = event.clientX;
    lastPointerTime = performance.now();
    velocity = 0;
    carousel.classList.add('is-dragging');
    carousel.setPointerCapture(event.pointerId);
  });

  carousel.addEventListener('pointermove', (event) => {
    if (!isDragging) return;
    const now = performance.now();
    const elapsed = Math.max(1, now - lastPointerTime);
    const movement = event.clientX - lastPointerX;
    position = dragStartPosition - (event.clientX - dragStartX);
    velocity = Math.max(-1.5, Math.min(1.5, -movement / elapsed));
    lastPointerX = event.clientX;
    lastPointerTime = now;
    render();
  });

  const finishDrag = () => {
    if (!isDragging) return;
    isDragging = false;
    carousel.classList.remove('is-dragging');
    if (Math.abs(velocity) > .05) glide();
  };

  carousel.addEventListener('pointerup', finishDrag);
  carousel.addEventListener('pointercancel', finishDrag);
  window.addEventListener('resize', () => measure());
  measure(false);
}

window.WellBalance.register('initProjectCarousel', initProjectCarousel);
