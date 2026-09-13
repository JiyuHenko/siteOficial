(() => {
  'use strict';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const qs = (s, r=document) => r.querySelector(s);
  const qsa = (s, r=document) => [...r.querySelectorAll(s)];
  const clamp = (n,min=0,max=1) => Math.min(max,Math.max(min,n));

  // Keep published project surfaces synchronized without duplicating page markup.
  function initPublishedProjects() {
    const caseStage = qs('.case-stage');
    if (caseStage && !qs('.case-e', caseStage)) {
      caseStage.insertAdjacentHTML('beforeend', `
        <a class="case-card case-e" data-case-card href="clientes/caligulas-poker-live.html"><div class="case-card-inner"><small>Poker live • Passos–MG</small><div><h3>Caligulas Poker Live</h3><p>Atmosfera de clube, programação, ranking e comunidade reunidos em uma presença digital própria.</p><span class="case-link">Ver projeto →</span></div><div class="case-asset-panel"><img src="https://caligulaspoker.com.br/assets/img/perf/photos/hero-desktop-1440.webp" alt="Caligulas Poker Live" loading="lazy" decoding="async"></div><span class="case-card-foot">CM / WORK 05</span></div></a>
      `);
      const counter = qs('.case-counter');
      if (counter) counter.innerHTML = '<strong data-case-number>01</strong> / 05 • role sobre os cards';
    }

    const clientGrid = qs('.page-main .content-section .product-grid');
    if (clientGrid && qs('.client-board', clientGrid) && !qs('.theme-caligulas', clientGrid)) {
      clientGrid.insertAdjacentHTML('beforeend', `
        <a class="client-board theme-caligulas" href="caligulas-poker-live.html"><img class="client-index-shot" src="https://caligulaspoker.com.br/assets/img/perf/photos/hero-desktop-1440.webp" alt="Caligulas Poker Live" loading="lazy" decoding="async"><span class="client-index-shade"></span><span>POKER LIVE • PASSOS–MG</span><strong>Caligulas Poker Live</strong><span>Programação, ranking, galeria, eventos e comunidade em uma experiência própria. →</span></a>
      `);
    }
  }
  initPublishedProjects();

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
      { href:'presenca-digital.html', title:'Presença Digital', subtitle:'busca + posicionamento' },
      { href:'inteligencia-artificial.html', title:'Inteligência Artificial', subtitle:'agentes + IA aplicada' },
      { href:'automacao.html', title:'Automação', subtitle:'processos + operação' },
      { href:'software-sob-medida.html', title:'Software sob medida', subtitle:'sistemas + integrações' }
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

  // CM-S01 — restrained framing: shorter travel, smaller scale delta.
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
    const scale = 1 - p * .028;
    heroFrame.style.transform = `scale(${scale})`;
    heroFrame.style.borderRadius = `${p * 18}px`;
    heroFrame.style.width = '100vw';
    heroFrame.style.height = '100vh';
  }

  // CM-S05 v2 — page flow stays natural; the active card owns wheel only under the pointer.
  const caseStage = qs('.case-stage');
  const caseCards = qsa('[data-case-card]');
  const caseNumber = qs('[data-case-number]');
  let caseClickProxy = null;
  let caseIndex = 0;
  let caseWheel = 0;
  let lastCaseMove = 0;
  const wrapCaseIndex = value => ((value % caseCards.length) + caseCards.length) % caseCards.length;

  if (caseStage && caseCards.length) {
    caseClickProxy = document.createElement('a');
    caseClickProxy.className = 'case-click-proxy';
    caseClickProxy.setAttribute('aria-label', 'Abrir projeto em destaque');
    caseStage.appendChild(caseClickProxy);
    caseStage.classList.add('is-wheel-deck');
    caseStage.setAttribute('tabindex','0');
    caseStage.setAttribute('aria-label','Projetos em destaque. Use a roda do mouse sobre o card ou as setas para navegar pelos projetos.');
  }

  function resetCaseFlow() {
    caseCards.forEach(card => {
      card.style.removeProperty('transform');
      card.style.removeProperty('opacity');
      card.style.removeProperty('z-index');
      card.style.removeProperty('filter');
      card.style.pointerEvents = 'auto';
      card.removeAttribute('aria-hidden');
      card.removeAttribute('tabindex');
    });
    if (caseClickProxy) {
      caseClickProxy.removeAttribute('href');
      caseClickProxy.setAttribute('tabindex','-1');
      caseClickProxy.style.removeProperty('transform');
    }
  }

  let mobileCaseLoop = false, mobileCaseTimer, mobileCaseJumping = false;
  function setupMobileCaseLoop() {
    if (mobileCaseLoop || !caseStage || caseCards.length < 2 || innerWidth >= 761) return;

    const beforeCaseClones = caseCards.map(card => card.cloneNode(true));
    const afterCaseClones = caseCards.map(card => card.cloneNode(true));
    const prepareClone = (clone, cycle, index) => {
      clone.removeAttribute('data-case-card');
      clone.dataset.caseClone = `${cycle}-${index}`;
      clone.setAttribute('aria-hidden','true');
      clone.setAttribute('tabindex','-1');
    };
    beforeCaseClones.forEach((clone, index) => prepareClone(clone, 'before', index));
    afterCaseClones.forEach((clone, index) => prepareClone(clone, 'after', index));

    const beforeFragment = document.createDocumentFragment();
    beforeCaseClones.forEach(clone => beforeFragment.appendChild(clone));
    caseStage.insertBefore(beforeFragment, caseCards[0]);

    const afterFragment = document.createDocumentFragment();
    afterCaseClones.forEach(clone => afterFragment.appendChild(clone));
    caseStage.insertBefore(afterFragment, caseClickProxy);

    const inset = () => parseFloat(getComputedStyle(caseStage).paddingLeft) || 0;
    const centerStart = () => caseCards[0].offsetLeft - inset();
    const nextCycleStart = () => afterCaseClones[0].offsetLeft - inset();
    const cycleWidth = () => nextCycleStart() - centerStart();

    const shiftCycle = delta => {
      if (!delta || mobileCaseJumping) return;
      mobileCaseJumping = true;
      caseStage.scrollLeft += delta;
      requestAnimationFrame(() => { mobileCaseJumping = false; });
    };

    const normalizeLoop = () => {
      if (mobileCaseJumping || innerWidth >= 761) return;
      const width = cycleWidth();
      if (width <= 0) return;
      const x = caseStage.scrollLeft;
      const start = centerStart();
      const end = nextCycleStart();
      if (x < start - 2) shiftCycle(width);
      else if (x >= end - 2) shiftCycle(-width);
    };

    mobileCaseLoop = true;
    requestAnimationFrame(() => {
      caseStage.scrollLeft = centerStart();
      requestAnimationFrame(normalizeLoop);
    });

    if ('onscrollend' in caseStage) {
      caseStage.addEventListener('scrollend', normalizeLoop, { passive:true });
    } else {
      caseStage.addEventListener('scroll', () => {
        clearTimeout(mobileCaseTimer);
        mobileCaseTimer = setTimeout(normalizeLoop, 120);
      }, { passive:true });
    }
  }

  function updateCases() {
    if (!caseStage || !caseCards.length) return;

    if (reduceMotion || innerWidth < 761) {
      resetCaseFlow();
      setupMobileCaseLoop();
      return;
    }

    caseIndex = wrapCaseIndex(Math.round(caseIndex));
    const activeCard = caseCards[caseIndex];
    if (caseNumber) caseNumber.textContent = String(caseIndex + 1).padStart(2,'0');

    caseCards.forEach((card, i) => {
      let d = i - caseIndex;
      if (d > caseCards.length / 2) d -= caseCards.length;
      else if (d < -caseCards.length / 2) d += caseCards.length;
      const previousLoopOffset = Number(card.dataset.caseLoopOffset);
      const loopWrapped = Number.isFinite(previousLoopOffset) && Math.abs(previousLoopOffset - d) > 1;
      if (loopWrapped) card.style.setProperty('transition', 'none', 'important');
      card.dataset.caseLoopOffset = String(d);
      const y = d * 38;
      const z = -Math.abs(d) * 155;
      const rx = d * -2.8;
      const scale = 1 - Math.min(Math.abs(d) * .065, .22);
      const opacity = clamp(1 - Math.abs(d) * .34, .1, 1);
      const isActive = i === caseIndex;

      card.style.transform = `translate3d(0, calc(-50% + ${y}%), ${z}px) rotateX(${rx}deg) scale(${scale})`;
      card.style.opacity = opacity;
      card.style.zIndex = String(100 - Math.round(Math.abs(d) * 10));
      card.style.filter = `saturate(${clamp(1 - Math.abs(d) * .23,.55,1)})`;
      if (loopWrapped) requestAnimationFrame(() => card.style.removeProperty('transition'));
      card.style.pointerEvents = 'none';
      card.setAttribute('tabindex','-1');
      if (isActive) card.removeAttribute('aria-hidden');
      else card.setAttribute('aria-hidden','true');
    });

    if (caseClickProxy && activeCard) {
      caseClickProxy.href = activeCard.getAttribute('href') || '#';
      caseClickProxy.setAttribute('aria-label', `Abrir ${qs('h3', activeCard)?.textContent?.trim() || 'projeto em destaque'}`);
      caseClickProxy.setAttribute('tabindex','0');
      caseClickProxy.style.transform = 'translateY(-50%)';
    }
  }

  function moveCase(direction) {
    caseIndex = wrapCaseIndex(caseIndex + direction);
    updateCases();
    return true;
  }

  if (caseStage && caseCards.length) {
    caseStage.addEventListener('wheel', e => {
      if (reduceMotion || innerWidth < 761 || !caseClickProxy) return;

      const cardRect = caseClickProxy.getBoundingClientRect();
      const pointerOverCard = e.clientX >= cardRect.left && e.clientX <= cardRect.right && e.clientY >= cardRect.top && e.clientY <= cardRect.bottom;
      if (!pointerOverCard) {
        caseWheel = 0;
        return;
      }

      const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (!delta) return;
      e.preventDefault();
      caseWheel += delta;
      const now = performance.now();
      if (Math.abs(caseWheel) < 28 || now - lastCaseMove < 220) return;

      const step = caseWheel > 0 ? 1 : -1;
      caseWheel = 0;
      if (moveCase(step)) lastCaseMove = now;
    }, { passive:false });

    caseStage.addEventListener('pointerleave', () => { caseWheel = 0; });
    caseStage.addEventListener('keydown', e => {
      if (reduceMotion || innerWidth < 761) return;
      const forward = e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown';
      const backward = e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp';
      if (!forward && !backward) return;
      if (moveCase(forward ? 1 : -1)) e.preventDefault();
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