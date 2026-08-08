(() => {
  const slides = [...document.querySelectorAll('[data-slide]')];
  const previousButton = document.querySelector('[data-prev]');
  const nextButton = document.querySelector('[data-next]');
  const playButton = document.querySelector('[data-play]');
  const position = document.querySelector('[data-position]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const interval = 7000;
  let current = 0;
  let timer = null;
  let playing = !reducedMotion.matches;

  const clearTimer = () => {
    if (timer !== null) {
      window.clearTimeout(timer);
      timer = null;
    }
  };

  const updatePlayButton = () => {
    if (!playButton) return;
    playButton.textContent = playing ? '一時停止' : '再生';
    playButton.setAttribute('aria-label', playing ? '自動再生を一時停止' : '自動再生を再開');
  };

  const showSlide = index => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === current;
      slide.classList.toggle('is-active', active);
      slide.inert = !active;
      slide.setAttribute('aria-hidden', String(!active));
    });
    if (position) position.textContent = `${current + 1} / ${slides.length}`;
  };

  const scheduleNext = () => {
    clearTimer();
    if (!playing || document.hidden) return;
    timer = window.setTimeout(() => {
      showSlide(current + 1);
      scheduleNext();
    }, interval);
  };

  const stopAutoPlay = () => {
    playing = false;
    clearTimer();
    updatePlayButton();
  };

  const moveManually = index => {
    stopAutoPlay();
    showSlide(index);
  };

  previousButton?.addEventListener('click', () => moveManually(current - 1));
  nextButton?.addEventListener('click', () => moveManually(current + 1));
  playButton?.addEventListener('click', () => {
    if (playing) {
      stopAutoPlay();
      return;
    }
    playing = true;
    updatePlayButton();
    scheduleNext();
  });

  document.querySelectorAll('[data-slide-target]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      moveManually(Number(link.dataset.slideTarget));
      document.querySelector('#loop-hero')?.scrollIntoView();
    });
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAutoPlay();
  });

  reducedMotion.addEventListener('change', event => {
    if (event.matches) stopAutoPlay();
  });

  const header = document.querySelector('[data-header]');
  const menuButton = header?.querySelector('.menu-button');
  const menu = header?.querySelector('.site-menu');
  if (header && menuButton && menu) {
    const closeMenu = () => {
      header.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
    };
    menuButton.addEventListener('click', () => {
      const willOpen = menuButton.getAttribute('aria-expanded') !== 'true';
      header.classList.toggle('is-open', willOpen);
      menuButton.setAttribute('aria-expanded', String(willOpen));
    });
    menu.addEventListener('click', event => {
      if (event.target.closest('a')) closeMenu();
    });
    document.addEventListener('click', event => {
      if (!header.contains(event.target)) closeMenu();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        menuButton.focus();
      }
    });
  }

  showSlide(0);
  updatePlayButton();
  scheduleNext();
})();
