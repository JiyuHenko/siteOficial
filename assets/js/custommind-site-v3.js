/* Custom Mind site: progressive enhancement only. Content and navigation work without effects. */
(() => {
  'use strict';

  const links = document.querySelectorAll('[data-wa]');
  const phone = '5511923734039';
  for (const link of links) {
    const message = link.getAttribute('data-wa') || 'Olá! Vim pelo site da Custom Mind.';
    link.href = 'https://wa.me/' + phone + '?text=' + encodeURIComponent(message);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }

  const button = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.mobile-nav');
  if (!button || !menu) return;

  const setOpen = (open) => {
    menu.classList.toggle('open', open);
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    button.textContent = open ? '×' : '☰';
  };

  button.setAttribute('aria-controls', 'custommind-mobile-menu');
  menu.id = 'custommind-mobile-menu';
  setOpen(false);

  button.addEventListener('click', () => {
    setOpen(button.getAttribute('aria-expanded') !== 'true');
  });

  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      button.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.site-header')) setOpen(false);
  });

  const media = matchMedia('(min-width: 1041px)');
  const onResize = () => { if (media.matches) setOpen(false); };
  if (media.addEventListener) media.addEventListener('change', onResize);
})();
