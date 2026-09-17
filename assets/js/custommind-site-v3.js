/* Content, project links, FAQs and contact destinations work without JavaScript. */
(() => {
  'use strict';
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.mobile-nav');
  if (!toggle || !nav) return;
  const mobile = window.matchMedia('(max-width: 900px)');
  const links = [...nav.querySelectorAll('a')];
  const setOpen = (open, restoreFocus = false) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    nav.classList.toggle('open', open);
    nav.inert = !open;
    if (restoreFocus) toggle.focus();
  };
  setOpen(false);
  document.documentElement.classList.add('nav-enhanced');
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', event => { if (event.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', event => {
    if (toggle.getAttribute('aria-expanded') !== 'true') return;
    if (event.key === 'Escape') { setOpen(false, true); return; }
    if (event.key !== 'Tab') return;
    if (event.shiftKey && document.activeElement === toggle) {
      event.preventDefault(); links.at(-1)?.focus();
    } else if (!event.shiftKey && document.activeElement === links.at(-1)) {
      event.preventDefault(); toggle.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header') && toggle.getAttribute('aria-expanded') === 'true') setOpen(false);
  });
  mobile.addEventListener('change', () => setOpen(false));
})();
