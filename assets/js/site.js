(()=>{
  const visualFixes=document.createElement('style');
  visualFixes.textContent=`
/* Real-product screenshot framing: scoped to the current product captures. */
.product-page.theme-zuri .product-hero h1{font-size:clamp(48px,5.25vw,70px);max-width:12ch;text-wrap:balance}
.product-page.theme-zuri .product-demo{height:auto!important;aspect-ratio:1/1;max-width:500px;width:100%;justify-self:end;padding:0!important}
.product-page.theme-zuri .product-demo>img{width:100%!important;height:100%!important;object-fit:cover!important;object-position:center!important;border-radius:26px!important;padding:0!important}

/* Home product cards: keep Jade/Zuri close; show Loja Inteligente fully without awkward cropping. */
.visual-product-card .visual-product-media img[src*="jade-inicio"],
.visual-product-card .visual-product-media img[src*="zuri-inicio"]{object-fit:cover!important;object-position:center top!important;padding:0!important;background:#090a10!important}
.visual-product-card.store-card{grid-template-columns:minmax(0,1.18fr) minmax(210px,.82fr)}
.visual-product-card.store-card .visual-product-media{display:grid;place-items:center;min-height:0;background:#090a10}
.visual-product-card.store-card .visual-product-media img[src*="loja.webp"]{width:94%!important;height:auto!important;max-height:210px!important;object-fit:contain!important;object-position:center!important;padding:0!important;margin:auto!important;background:#090a10!important}

/* Experience section: center Jade, shorten the store card and remove unnecessary letterboxing. */
.experience-mosaic{grid-template-rows:minmax(315px,auto) 205px;align-items:stretch}
.experience-mosaic article{min-height:0}
.experience-mosaic .experience-main{min-height:0;display:grid;place-items:center;padding:24px 18px 86px}
.experience-mosaic .experience-main img{width:92%!important;height:auto!important;max-height:100%!important;object-fit:contain!important;object-position:center!important;padding:0!important;margin:auto!important;background:#090a10!important}
.experience-mosaic article img[src*="zuri-chat"]{object-fit:contain!important;object-position:center top!important;padding:0!important;background:#090a10!important}
.experience-mosaic article:has(img[src*="loja.webp"]){min-height:205px}
.experience-mosaic article img[src*="loja.webp"]{width:calc(100% - 24px)!important;height:auto!important;max-height:132px!important;object-fit:contain!important;object-position:center top!important;padding:0!important;margin:12px auto 58px!important;background:#090a10!important}

@media(max-width:980px){
  .product-page.theme-zuri .product-demo{justify-self:start;max-width:560px}
  .visual-product-card.store-card{grid-template-columns:minmax(0,1.08fr) minmax(200px,.92fr)}
  .experience-mosaic{grid-template-rows:auto}
  .experience-mosaic .experience-main{min-height:360px;padding:22px 16px 82px}
  .experience-mosaic article:has(img[src*="loja.webp"]){min-height:190px}
  .experience-mosaic article img[src*="loja.webp"]{max-height:124px!important;margin-bottom:54px!important}
}
@media(max-width:720px){
  .product-page.theme-zuri .product-hero h1{font-size:clamp(42px,11.5vw,58px);max-width:none}
  .product-page.theme-zuri .product-demo{max-width:none}
  .visual-product-card.store-card{grid-template-columns:1fr}
  .visual-product-card.store-card .visual-product-media img[src*="loja.webp"]{width:min(92%,520px)!important;max-height:none!important}
  .experience-mosaic .experience-main{min-height:300px;padding:18px 12px 78px}
  .experience-mosaic .experience-main img{width:96%!important}
  .experience-mosaic article:has(img[src*="loja.webp"]){min-height:180px}
  .experience-mosaic article img[src*="loja.webp"]{max-height:116px!important;margin:10px auto 52px!important}
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