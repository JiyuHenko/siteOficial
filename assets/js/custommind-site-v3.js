(() => {
  'use strict';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const qs = (s, r=document) => r.querySelector(s);
  const qsa = (s, r=document) => [...r.querySelectorAll(s)];
  const clamp = (n,min=0,max=1) => Math.min(max,Math.max(min,n));

  // WhatsApp CTAs preserve the existing public contact number.
  qsa('[data-wa]').forEach(a => {
    const text = a.dataset.wa || 'Olá! Vim pelo site da Custom Mind e quero conversar sobre um projeto.';
    a.href = `https://wa.me/5511923734039?text=${encodeURIComponent(text)}`;
    a.target = '_blank';
    a.rel = 'noopener';
  });

  const menuToggle = qs('.menu-toggle');
  const mobileNav = qs('.mobile-nav');
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });
    qsa('a', mobileNav).forEach(a => a.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded','false');
    }));
  }

  // CM-S09 — contextual spotlight only on product cards.
  qsa('[data-spotlight]').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX-r.left}px`);
      card.style.setProperty('--my', `${e.clientY-r.top}px`);
    });
  });

  // Controlled reveal — not every section.
  const reveals = qsa('[data-reveal]');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { threshold: .16 });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  // CM-S01 — the single primary motion signature.
  const heroStage = qs('[data-hero-stage]');
  const heroFrame = qs('[data-hero-frame]');
  function updateHero() {
    if (!heroStage || !heroFrame) return;
    if (reduceMotion || innerWidth < 761) {
      heroFrame.style.removeProperty('transform');
      heroFrame.style.removeProperty('border-radius');
      heroFrame.style.removeProperty('width');
      heroFrame.style.removeProperty('height');
      return;
    }
    const rect = heroStage.getBoundingClientRect();
    const travel = Math.max(1, heroStage.offsetHeight - innerHeight);
    const p = clamp(-rect.top / travel);
    // Keep the signature restrained: frame the hero, don't make it feel detached.
    const scale = 1 - p * .045;
    heroFrame.style.transform = `scale(${scale})`;
    heroFrame.style.borderRadius = `${p * 28}px`;
    heroFrame.style.width = '100vw';
    heroFrame.style.height = '100vh';
  }

  // CM-S05 — depth case deck. One expressive portfolio moment.
  const casesShell = qs('[data-cases-shell]');
  const caseCards = qsa('[data-case-card]');
  const caseNumber = qs('[data-case-number]');
  function updateCases() {
    if (!casesShell || !caseCards.length || reduceMotion || innerWidth < 761) return;
    const rect = casesShell.getBoundingClientRect();
    const travel = Math.max(1, casesShell.offsetHeight - innerHeight);
    const progress = clamp(-rect.top / travel);
    const indexFloat = progress * (caseCards.length - 1);
    const active = Math.round(indexFloat);
    if (caseNumber) caseNumber.textContent = String(active + 1).padStart(2,'0');
    caseCards.forEach((card, i) => {
      const d = i - indexFloat;
      const y = d * 44;
      const z = -Math.abs(d) * 170;
      const rx = d * -3.2;
      const scale = 1 - Math.min(Math.abs(d) * .07, .22);
      const opacity = clamp(1 - Math.abs(d) * .35, .1, 1);
      card.style.transform = `translate3d(0, calc(-50% + ${y}%), ${z}px) rotateX(${rx}deg) scale(${scale})`;
      card.style.opacity = opacity;
      card.style.zIndex = String(100 - Math.round(Math.abs(d)*10));
      card.style.filter = `saturate(${clamp(1 - Math.abs(d)*.25,.55,1)})`;
    });
  }

  let ticking = false;
  function frame() {
    updateHero();
    updateCases();
    ticking = false;
  }
  function requestFrame() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(frame);
  }
  addEventListener('scroll', requestFrame, { passive:true });
  addEventListener('resize', requestFrame);
  requestFrame();
})();
