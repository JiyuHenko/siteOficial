(()=>{
  const visualFixes=document.createElement('style');
  visualFixes.textContent=`
/* Real-product screenshot framing: scoped to the current product captures. */
.product-page.theme-zuri .product-hero h1{font-size:clamp(48px,5.25vw,70px);max-width:12ch;text-wrap:balance}
.product-page.theme-zuri .product-demo{height:auto!important;aspect-ratio:1/1;max-width:500px;width:100%;justify-self:end;padding:0!important}
.product-page.theme-zuri .product-demo>img{width:100%!important;height:100%!important;object-fit:cover!important;object-position:center!important;border-radius:26px!important;padding:0!important}

/* Home product cards: Jade and Zuri benefit from a close crop; Loja Inteligente must remain fully visible. */
.visual-product-card .visual-product-media img[src*="jade-inicio"],
.visual-product-card .visual-product-media img[src*="zuri-inicio"]{object-fit:cover!important;object-position:center top!important;padding:0!important;background:#090a10!important}
.visual-product-card .visual-product-media img[src*="loja.webp"]{object-fit:contain!important;object-position:center!important;padding:12px!important;background:#090a10!important}

/* Experience section: preserve the actual screens instead of zooming/cropping them. */
.experience-mosaic article{min-height:220px}
.experience-mosaic .experience-main{min-height:460px}
.experience-mosaic .experience-main img{object-fit:contain!important;object-position:center top!important;padding:0!important;background:#090a10!important}
.experience-mosaic article img[src*="zuri-chat"]{object-fit:contain!important;object-position:center top!important;padding:0!important;background:#090a10!important}
.experience-mosaic article img[src*="loja.webp"]{object-fit:contain!important;object-position:center!important;padding:12px!important;background:#090a10!important}

@media(max-width:980px){
  .product-page.theme-zuri .product-demo{justify-self:start;max-width:560px}
  .experience-mosaic .experience-main{min-height:390px}
}
@media(max-width:720px){
  .product-page.theme-zuri .product-hero h1{font-size:clamp(42px,11.5vw,58px);max-width:none}
  .product-page.theme-zuri .product-demo{max-width:none}
  .experience-mosaic .experience-main{min-height:300px}
}
`;
  document.head.appendChild(visualFixes);

  const WA='5511923734039';
  document.querySelectorAll('[data-wa]').forEach(a=>{
    const msg=a.getAttribute('data-wa')||'Olá! Vim pelo site da Custom Mind.';
    a.href=`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
    a.target='_blank';
    a.rel='noopener';
  });

  document.querySelectorAll('[data-year]').forEach(e=>e.textContent=new Date().getFullYear());

  const t=document.querySelector('.menu-toggle'),m=document.querySelector('.mobile-menu');
  if(t&&m){
    t.addEventListener('click',()=>{
      const open=m.classList.toggle('open');
      t.setAttribute('aria-expanded',String(open));
      t.textContent=open?'×':'☰';
    });
    m.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
      m.classList.remove('open');
      t.setAttribute('aria-expanded','false');
      t.textContent='☰';
    }));
  }

  const io=new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  }),{threshold:.08});
  document.querySelectorAll('.solution-card,.capability-grid article,.process-grid article,.client-card,.feature-grid article,.contact-card').forEach(e=>io.observe(e));
})();