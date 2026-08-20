(() => {
  'use strict';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const qs = (s, r=document) => r.querySelector(s);
  const qsa = (s, r=document) => [...r.querySelectorAll(s)];
  const clamp = (n,min=0,max=1) => Math.min(max,Math.max(min,n));

  // Build the neural ecosystem from the existing semantic product links.
  function initNeuralHero() {
    const map = qs('.architecture-map');
    const windowEl = map?.closest('.system-window');
    if (!map || !windowEl || map.dataset.neuralized === 'true') return;

    const existing = qsa('.map-node', map).map(node => ({
      href: node.getAttribute('href') || '#',
      title: qs('b', node)?.textContent?.trim() || '',
      subtitle: qs('span', node)?.textContent?.trim() || ''
    }));

    const fallback = [
      { href:'products/jade.html', title:'Jade', subtitle:'atendimento + contexto' },
      { href:'products/zuri.html', title:'Zuri', subtitle:'descoberta + cadência' },
      { href:'products/loja-inteligente.html', title:'Loja Inteligente', subtitle:'vendas + operação' },
      { href:'solucoes.html', title:'Sob medida', subtitle:'sistemas + integrações' }
    ];
    const items = existing.length === 4 ? existing : fallback;
    const keys = ['jade','zuri','store','custom'];

    map.dataset.neuralized = 'true';
    map.classList.add('neural-map');
    windowEl.classList.add('neural-window');

    map.innerHTML = `
      <div class="neural-grid" aria-hidden="true"></div>
      <div class="neural-stars" aria-hidden="true"></div>
      <svg class="neural-svg" viewBox="0 0 720 560" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="neuralGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#7b31ff"/><stop offset=".48" stop-color="#c466ff"/><stop offset="1" stop-color="#53d8ff"/>
          </linearGradient>
          <filter id="neuralGlow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <filter id="neuralSoftGlow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>

        <g class="neural-route-group" data-neural-link="jade">
          <path id="route-jade" class="neural-route-base" d="M360 284 C326 250 306 188 247 136 C224 116 211 105 190 96"/>
          <path class="neural-route-flow r1" d="M360 284 C326 250 306 188 247 136 C224 116 211 105 190 96"/>
          <path class="neural-twig t1" d="M316 227 C286 216 274 191 252 175 C231 160 213 165 198 151"/>
          <path class="neural-twig t2" d="M291 194 C283 164 292 146 279 126 C267 107 244 112 232 91"/>
          <circle class="neural-particle" r="4"><animateMotion dur="3.4s" repeatCount="indefinite" begin="-.3s"><mpath href="#route-jade"/></animateMotion></circle>
        </g>
        <g class="neural-route-group" data-neural-link="zuri">
          <path id="route-zuri" class="neural-route-base" d="M360 284 C397 247 418 190 476 143 C502 122 520 111 542 101"/>
          <path class="neural-route-flow r2" d="M360 284 C397 247 418 190 476 143 C502 122 520 111 542 101"/>
          <path class="neural-twig t3" d="M409 224 C438 212 451 187 474 173 C497 158 516 164 533 149"/>
          <path class="neural-twig t4" d="M431 192 C441 163 434 143 450 124 C464 107 486 111 500 89"/>
          <circle class="neural-particle" r="4"><animateMotion dur="3.7s" repeatCount="indefinite" begin="-1.2s"><mpath href="#route-zuri"/></animateMotion></circle>
        </g>
        <g class="neural-route-group" data-neural-link="store">
          <path id="route-store" class="neural-route-base" d="M351 292 C310 326 294 378 240 421 C218 438 202 448 179 458"/>
          <path class="neural-route-flow r3" d="M351 292 C310 326 294 378 240 421 C218 438 202 448 179 458"/>
          <path class="neural-twig t5" d="M304 344 C276 355 263 380 241 393 C221 405 203 401 185 417"/>
          <path class="neural-twig t6" d="M281 378 C272 405 278 422 264 441 C251 458 231 454 218 477"/>
          <circle class="neural-particle" r="4"><animateMotion dur="3.9s" repeatCount="indefinite" begin="-2.1s"><mpath href="#route-store"/></animateMotion></circle>
        </g>
        <g class="neural-route-group" data-neural-link="custom">
          <path id="route-custom" class="neural-route-base" d="M369 292 C409 326 427 377 482 417 C506 435 524 445 547 454"/>
          <path class="neural-route-flow r4" d="M369 292 C409 326 427 377 482 417 C506 435 524 445 547 454"/>
          <path class="neural-twig t7" d="M416 344 C444 354 458 377 481 390 C503 403 520 399 540 414"/>
          <path class="neural-twig t8" d="M440 378 C450 404 444 423 459 441 C472 456 493 453 507 475"/>
          <circle class="neural-particle" r="4"><animateMotion dur="4.1s" repeatCount="indefinite" begin="-2.8s"><mpath href="#route-custom"/></animateMotion></circle>
        </g>
      </svg>

      <div class="neural-core" aria-hidden="true">
        <div class="neural-brain"><img src="assets/img/custommind-symbol.png" alt=""></div>
        <span class="neural-core-label">Custom Mind / núcleo</span>
      </div>

      ${items.map((item, i) => `<a class="neural-node ${keys[i]}" data-neural-node="${keys[i]}" href="${item.href}"><small>CM / 0${i+1}</small><b>${item.title}</b><span>${item.subtitle}</span></a>`).join('')}
    `;

    const core = qs('.neural-core', map);
    qsa('[data-neural-node]', map).forEach(node => {
      const key = node.dataset.neuralNode;
      const route = qs(`[data-neural-link="${key}"]`, map);
      const activate = () => { route?.classList.add('is-active'); core?.classList.add('is-sending'); };
      const deactivate = () => { route?.classList.remove('is-active'); core?.classList.remove('is-sending'); };
      node.addEventListener('pointerenter', activate);
      node.addEventListener('pointerleave', deactivate);
      node.addEventListener('focus', activate);
      node.addEventListener('blur', deactivate);
      node.addEventListener('pointermove', e => {
        const r = node.getBoundingClientRect();
        node.style.setProperty('--hx', `${e.clientX-r.left}px`);
        node.style.setProperty('--hy', `${e.clientY-r.top}px`);
      });
    });
  }
  initNeuralHero();

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
    const scale = 1 - p * .045;
    heroFrame.style.transform = `scale(${scale})`;
    heroFrame.style.borderRadius = `${p * 28}px`;
    heroFrame.style.width = '100vw';
    heroFrame.style.height = '100vh';
  }

  // CM-S05 — depth case deck. Only the visually active card may intercept clicks.
  const casesShell = qs('[data-cases-shell]');
  const caseCards = qsa('[data-case-card]');
  const caseNumber = qs('[data-case-number]');
  function updateCases() {
    if (!casesShell || !caseCards.length) return;

    if (reduceMotion || innerWidth < 761) {
      caseCards.forEach(card => {
        card.style.pointerEvents = 'auto';
        card.removeAttribute('aria-hidden');
        card.removeAttribute('tabindex');
      });
      return;
    }

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
      const isActive = i === active;

      card.style.transform = `translate3d(0, calc(-50% + ${y}%), ${z}px) rotateX(${rx}deg) scale(${scale})`;
      card.style.opacity = opacity;
      card.style.zIndex = String(100 - Math.round(Math.abs(d)*10));
      card.style.filter = `saturate(${clamp(1 - Math.abs(d)*.25,.55,1)})`;
      card.style.pointerEvents = isActive ? 'auto' : 'none';
      card.setAttribute('tabindex', isActive ? '0' : '-1');
      if (isActive) card.removeAttribute('aria-hidden');
      else card.setAttribute('aria-hidden','true');
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
