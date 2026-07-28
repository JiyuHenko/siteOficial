(() => {
  'use strict';

  const CONTACT = {
    whatsapp: '5511923734039',
    email: 'custommind.softwaresolutions@gmail.com',
    instagram: 'custommind.solutions'
  };

  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];
  const waUrl = (message = '') => `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;

  // Contact placeholders and links.
  qsa('[data-wa]').forEach((link) => {
    link.href = waUrl(link.dataset.wa || 'Olá! Vim pelo site da Custom Mind e quero entender qual solução faz mais sentido para o meu negócio.');
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.addEventListener('click', () => {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'conversion', { send_to: 'AW-17945612305/r57ECOnT-4McEJGgke1C' });
        window.gtag('event', 'click_whatsapp', { event_category: 'lead', event_label: link.dataset.track || 'site' });
      }
    });
  });
  qsa('[data-email]').forEach((link) => {
    link.href = `mailto:${CONTACT.email}`;
    if (!link.textContent.trim()) link.textContent = CONTACT.email;
  });
  qsa('[data-instagram]').forEach((link) => {
    link.href = `https://instagram.com/${CONTACT.instagram}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });
  qsa('[data-current-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  // Floating navigation.
  const header = qs('.site-header');
  const menuToggle = qs('.menu-toggle');
  const mobileMenu = qs('.mobile-menu');
  const setHeaderState = () => header?.classList.toggle('scrolled', window.scrollY > 18);
  setHeaderState();
  window.addEventListener('scroll', setHeaderState, { passive: true });

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const open = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!open));
      mobileMenu.classList.toggle('open', !open);
    });
    qsa('a', mobileMenu).forEach((link) => link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('open');
    }));
  }

  // Reveal on scroll.
  const revealEls = qsa('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px' });
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  // Cursor spotlight, implemented without dependencies.
  qsa('.spotlight').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`);
    });
  });

  // Product showcase tabs.
  qsa('[data-tabs]').forEach((tabs) => {
    const buttons = qsa('[data-tab]', tabs);
    const panels = qsa('[data-panel]', tabs);
    const activate = (id) => {
      buttons.forEach((button) => {
        const active = button.dataset.tab === id;
        button.classList.toggle('active', active);
        button.setAttribute('aria-selected', String(active));
        button.tabIndex = active ? 0 : -1;
      });
      panels.forEach((panel) => panel.classList.toggle('active', panel.dataset.panel === id));
    };
    buttons.forEach((button, index) => {
      button.addEventListener('click', () => activate(button.dataset.tab));
      button.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
        event.preventDefault();
        const nextIndex = event.key === 'ArrowRight' ? (index + 1) % buttons.length : (index - 1 + buttons.length) % buttons.length;
        buttons[nextIndex].focus();
        activate(buttons[nextIndex].dataset.tab);
      });
    });
  });

  // Animated numeric counters.
  const counterEls = qsa('[data-counter]');
  const animateCounter = (el) => {
    const end = Number(el.dataset.counter || 0);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const decimals = Number(el.dataset.decimals || 0);
    const duration = 1100;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = end * eased;
      el.textContent = `${prefix}${current.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    }), { threshold: .45 });
    counterEls.forEach((el) => counterObserver.observe(el));
  }

  // Qualification form -> WhatsApp.
  const qualificationForm = qs('[data-qualification-form]');
  if (qualificationForm) {
    qualificationForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(qualificationForm);
      const required = [...qualificationForm.querySelectorAll('[required]')];
      const error = qs('.form-feedback.error', qualificationForm);
      const success = qs('.form-feedback.success', qualificationForm);
      const valid = required.every((field) => String(field.value || '').trim());
      if (!valid) {
        if (error) error.style.display = 'block';
        if (success) success.style.display = 'none';
        return;
      }
      if (error) error.style.display = 'none';
      const lines = [
        'Olá! Vim pela qualificação da Jade.',
        '',
        `*Nome:* ${formData.get('nome') || '-'}`,
        `*Empresa:* ${formData.get('empresa') || '-'}`,
        `*Segmento:* ${formData.get('segmento') || '-'}`,
        `*Canal principal:* ${formData.get('canal') || '-'}`,
        `*Volume de mensagens:* ${formData.get('volume') || '-'}`,
        `*Objetivo:* ${formData.get('objetivo') || '-'}`,
        `*Principal gargalo:* ${formData.get('gargalo') || '-'}`,
        '',
        'Quero entender se a Jade faz sentido para minha operação.'
      ];
      if (success) success.style.display = 'block';
      if (typeof window.gtag === 'function') window.gtag('event', 'generate_lead', { event_category: 'qualification', event_label: 'violet' });
      window.open(waUrl(lines.join('\n')), '_blank', 'noopener,noreferrer');
    });
  }
})();
