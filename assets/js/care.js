(() => {
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

  const demoForm = document.querySelector('#demo-form');
  const demoButton = document.querySelector('#demo-check');
  const demoResult = document.querySelector('#demo-result');

  demoForm?.addEventListener('submit', event => event.preventDefault());
  demoButton?.addEventListener('click', () => {
    if (!demoResult) return;
    demoResult.hidden = false;
    demoResult.focus();
  });
})();
