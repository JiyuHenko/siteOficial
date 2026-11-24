async function syncPortfolio() {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const root = process.cwd();
  const check = process.argv.includes('--check');
  const data = JSON.parse(fs.readFileSync(path.join(root,'.harness/site/portfolio-content.json'),'utf8'));
  const sitePath = path.join(root,'.harness/site/site-content.json');
  const siteRaw = fs.readFileSync(sitePath,'utf8');
  const site = JSON.parse(siteRaw);
  const base = site.brand.baseUrl;
  const source = fs.readFileSync(path.join(root,'clientes/index.html'),'utf8');
  const header = source.match(/<!-- CM:SHARED-HEADER START -->[\s\S]*?<!-- CM:SHARED-HEADER END -->/)?.[0];
  const footer = source.match(/<!-- CM:SHARED-FOOTER START -->[\s\S]*?<!-- CM:SHARED-FOOTER END -->/)?.[0];
  const analytics = source.match(/<script>if\(location\.protocol[\s\S]*?<\/script>/)?.[0];
  if(!header || !footer || !analytics) throw new Error('Shared chrome or analytics source is missing.');
  const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const json = x=>JSON.stringify(x).replaceAll('<','\\u003c');
  const caseUrl = p=>`/portfolio/${p.slug}`;
  const absolute = url=>new URL(url,base).href;
  const org = {'@type':'Organization',name:'Custom Mind',url:base+'/'};
  const date = d=>new Intl.DateTimeFormat('pt-BR',{timeZone:'UTC'}).format(new Date(d+'T00:00:00Z'));
  const categories = {
    clientes:{name:'Clientes',title:'Projetos que partem de cada negócio.',intro:'Sites, identidades digitais e sistemas desenvolvidos para contextos específicos. Conheça nossa participação e o que foi construído em cada trabalho.'},
    produtos:{name:'Produtos',title:'Produtos e ferramentas com uma ideia própria.',intro:'Jade, Zuri, Loja Inteligente e outros projetos da Custom Mind. Conheça também as ferramentas e frentes experimentais, com seu estágio identificado.'}
  };
  const seen = new Set(['clientes','produtos','index']);
  const publicUrl = raw=>{
    const u=new URL(raw,base);
    if(u.protocol!=='https:' || u.username || u.password) throw new Error('Only public HTTPS links are allowed: '+raw);
    return u;
  };
  for(const p of data.projects) {
    if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug) || seen.has(p.slug)) throw new Error('Invalid, reserved or duplicate slug: '+p.slug);
    seen.add(p.slug);
    if(!categories[p.category]) throw new Error('Invalid project category: '+p.slug);
    if(!p.deliveries?.length || !p.outcomes?.length || !p.services?.length) throw new Error('Missing project content: '+p.slug);
    for(const metric of p.metrics || []) if(!metric.source || !metric.asOf) throw new Error('Metric needs source and date: '+p.slug);
    for(const u of [p.officialUrl,...(p.evidence||[]).map(x=>x.url)].filter(Boolean)) publicUrl(u);
    for(const img of [p.image,p.secondaryImage].filter(Boolean)) {
      if(!img.src.startsWith('/assets/') || !fs.existsSync(path.join(root,img.src.slice(1)))) throw new Error('Missing local project image: '+p.slug);
      if(!img.alt || !img.width || !img.height) throw new Error('Image needs alt and dimensions: '+p.slug);
    }
  }
  const image = (img,hero=false)=>`<img src="${esc(img.src)}" width="${img.width}" height="${img.height}" alt="${esc(img.alt)}" ${hero?'fetchpriority="high"':'loading="lazy"'} decoding="async"${img.position?` style="--folio-position:${esc(img.position)}"`:''}>`;
  const markImage = p=>p.image && (p.image.presentation==='logo' || /icon\.(png|webp)$/.test(p.image.src));
  const links = services=>services.map(s=>`<a href="${esc(s.url)}">${esc(s.label)}</a>`).join('');
  const talk = p=>`https://wa.me/5511923734039?text=${encodeURIComponent(p?'Olá! Conheci o projeto '+p.name+' no portfólio da Custom Mind e quero conversar sobre uma solução semelhante.':'Olá! Conheci o portfólio da Custom Mind e quero conversar sobre um projeto.')}`;
  const nav = current=>`<nav class="folio-category-nav" aria-label="Áreas do portfólio"><a href="/portfolio/"${current==='all'?' aria-current="page"':''}>Visão geral</a>${Object.entries(categories).map(([key,c])=>`<a href="/portfolio/${key}"${current===key?' aria-current="page"':''}>${c.name}</a>`).join('')}</nav>`;
  const cta = `<section class="folio-cta"><div class="container folio-cta-inner"><div><h2>Qual desafio o seu projeto precisa resolver?</h2><p>Conte o contexto do seu negócio. A partir dele, podemos definir uma primeira entrega e um caminho para evoluir.</p></div><a class="btn" href="${talk()}" target="_blank" rel="noopener">Conversar sobre meu projeto</a></div></section>`;
  function page({title,description,url,ogImage='/assets/img/custommind-og.jpg',body,schema}) {
    return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#09090d">
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${base}${url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Custom Mind">
<meta property="og:locale" content="pt_BR">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${base}${url}">
<meta property="og:image" content="${base}${ogImage}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${base}${ogImage}">
<link rel="icon" href="/assets/img/favicon-32.png" type="image/png">
<link rel="stylesheet" href="/assets/css/custommind-site-v3.css">
<link rel="stylesheet" href="/assets/css/portfolio-v1.css">
<script type="application/ld+json">${json({'@context':'https://schema.org','@graph':schema})}</script>
${analytics}
</head>
<body class="portfolio-page">
<a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
${header}
<main id="conteudo">${body}</main>
${cta}
${footer}
<script src="/assets/js/custommind-site-v3.js?v=20261112-urls" defer></script>
</body>
</html>
`;
  }
  const breadcrumbSchema = (category,p)=>({'@type':'BreadcrumbList',itemListElement:[
    {'@type':'ListItem',position:1,name:'Início',item:base+'/'},
    {'@type':'ListItem',position:2,name:'Portfólio',item:base+'/portfolio/'},
    ...(category?[{'@type':'ListItem',position:3,name:categories[category].name,item:base+'/portfolio/'+category}]:[]),
    ...(p?[{'@type':'ListItem',position:4,name:p.name,item:base+caseUrl(p)}]:[])
  ]});
  const collectionSchema = (name,url,projects)=>({'@type':'CollectionPage',name,url:base+url,publisher:org,mainEntity:{'@type':'ItemList',itemListElement:projects.map((p,i)=>({'@type':'ListItem',position:i+1,url:base+caseUrl(p),name:p.name}))}});
  const stage = p=>p.stage?`<span class="folio-stage">${esc(p.stage)}</span>`:'';
  function card(p) {
    return `<article class="folio-catalog-card${p.image?'':' folio-catalog-card--text'}${markImage(p)?' folio-catalog-card--mark':''}">
${p.image?`<a class="folio-catalog-image" href="${caseUrl(p)}" aria-label="Conhecer ${esc(p.name)}">${image(p.image)}</a>`:''}
<div class="folio-catalog-copy"><div class="folio-card-meta">${stage(p)}<p class="folio-project-kind">${esc(p.kind)}</p></div><h2><a href="${caseUrl(p)}">${esc(p.name)}</a></h2><p>${esc(p.summary)}</p><a class="folio-inline-link" href="${caseUrl(p)}">Conhecer o projeto</a></div>
</article>`;
  }
  const categorySections = `<section class="folio-collections"><div class="container folio-collections-grid">${Object.entries(categories).map(([key,c])=>`<a class="folio-collection" href="/portfolio/${key}"><p class="folio-label">Portfólio ${c.name}</p><h2>${key==='clientes'?'Trabalhos para cada negócio.':'Produtos, ferramentas e novas ideias.'}</h2><p>${key==='clientes'?'Identidade, presença digital e software a partir de contextos reais.':'Soluções próprias e frentes experimentais, com escopo e estágio identificados.'}</p><span class="folio-inline-link">Explorar ${c.name.toLowerCase()}</span></a>`).join('')}</div></section>`;
  const featured = (data.featured || ['livia-lopes','joias-leopoldina','games-retro']).map(slug=>data.projects.find(p=>p.slug===slug)).filter(Boolean);
  const listBody = `<section class="folio-hero"><div class="container"><p class="folio-label">Portfólio Custom Mind</p>
<h1>Projetos reais.<br><span>O trabalho por trás de cada entrega.</span></h1>
<div class="folio-intro"><p>Conheça o contexto, as escolhas e o que construímos. Projetos para clientes, produtos próprios e experiências digitais têm espaço nesta coleção.</p><p class="folio-intro-note">Explore o trabalho por cliente ou por produto. Cada história apresenta a nossa participação, seu escopo e os caminhos disponíveis para conhecê-la.</p></div>${nav('all')}</div></section>
${categorySections}
<section class="folio-projects" aria-label="Projetos em destaque"><div class="container">${featured.map(p=>`<article class="folio-project${p.image ? '' : ' folio-project--text'}">${p.image ? `<a class="folio-project-image" href="${caseUrl(p)}" aria-label="Conhecer o projeto ${esc(p.name)}">${image(p.image)}</a>` : ''}<div><p class="folio-project-kind">${esc(p.kind)}</p><h2><a href="${caseUrl(p)}">${esc(p.name)}</a></h2><p class="folio-project-summary">${esc(p.summary)}</p><div class="folio-project-links"><a class="btn btn-dark" href="${caseUrl(p)}">Conhecer o projeto</a>${p.officialUrl?`<a href="${esc(p.officialUrl)}" target="_blank" rel="noopener">Visitar site publicado</a>`:''}</div></div></article>`).join('\n')}</div></section>
<section class="folio-services"><div class="container"><h2>Do projeto à sua necessidade.</h2><div class="folio-service-links">${links(site.solutions.map(x=>({label:x.name,url:x.url})))}</div><p>Conheça também os negócios e seus canais oficiais na <a class="folio-inline-link" href="/clientes/">área de clientes.</a></p></div></section>`;
  const outputs = new Map();
  outputs.set('portfolio/index.html',page({title:'Portfólio de clientes e produtos | Custom Mind',description:'Conheça os trabalhos da Custom Mind: projetos para clientes, produtos próprios e ferramentas, com contexto, entregas e evidências.',url:'/portfolio/',body:listBody,schema:[collectionSchema('Portfólio Custom Mind','/portfolio/',data.projects),breadcrumbSchema()]}));
  for(const [key,c] of Object.entries(categories)) {
    const projects = data.projects.filter(p=>p.category===key);
    const body = `<section class="folio-hero"><div class="container"><p class="folio-label">Portfólio ${c.name}</p><h1>${esc(c.title)}</h1><div class="folio-intro"><p>${esc(c.intro)}</p><p class="folio-intro-note">${key==='clientes'?'Cada case descreve o escopo do trabalho e a participação da Custom Mind.':'Os estágios ajudam a conhecer cada iniciativa: produtos, ferramentas, protótipos e projetos em desenvolvimento.'}</p></div>${nav(key)}</div></section><section class="folio-catalog" aria-label="Projetos ${c.name.toLowerCase()}"><div class="container folio-catalog-grid folio-catalog-grid--${key}">${projects.map(card).join('\n')}</div></section>`;
    outputs.set(`portfolio/${key}.html`,page({title:`Portfólio ${c.name}: ${key==='clientes'?'sites e sistemas sob medida':'soluções e ferramentas próprias'} | Custom Mind`,description:c.intro,url:'/portfolio/'+key,body,schema:[collectionSchema('Portfólio '+c.name,'/portfolio/'+key,projects),breadcrumbSchema(key)]}));
  }
  for(const p of data.projects) {
    const section = (id,title,body)=>`<section class="folio-story" id="${id}"><h2>${title}</h2><div class="folio-story-copy">${body}</div></section>`;
    const deliveries = items=>`<ul class="folio-deliveries">${items.map(x=>`<li><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p></li>`).join('')}</ul>`;
    const metricBlock = p.metrics?.length?`<dl class="folio-metrics">${p.metrics.map(m=>`<div><dt>${esc(m.label)}</dt><dd>${esc(m.value)}</dd></div>`).join('')}</dl>`:'';
    const metricSource = p.metrics?.length?`<p class="folio-metric-source">${p.metrics.map(m=>`${esc(m.value)} ${esc(m.label)} — ${esc(m.source)}. Conferência em ${date(m.asOf)}.`).join('<br>')}</p>`:'';
    const evidence = (p.evidence||[]).map(e=>`<div><a href="${esc(e.url)}" target="_blank" rel="noopener">${esc(e.label)}</a><p>${esc(e.text)}</p></div>`).join('');
    const profile = p.profileUrl?`<div><a href="${esc(p.profileUrl)}">${esc(p.profileLabel)}</a><p>Identidade e canais oficiais na nossa área de clientes e projetos.</p></div>`:'';
    const hasEvidence = !!(evidence||profile);
    const primaryAction = p.officialUrl?`<a class="btn btn-dark" href="${esc(p.officialUrl)}" target="_blank" rel="noopener">${esc(p.officialLabel||'Conhecer o projeto')}</a>`:`<a class="btn btn-dark" href="${talk(p)}" target="_blank" rel="noopener">Conversar sobre esta solução</a>`;
    const body = `<div class="container">
<nav aria-label="Indicadores de localização"><ol class="folio-breadcrumb"><li><a href="/">Início</a></li><li><a href="/portfolio/">Portfólio</a></li><li><a href="/portfolio/${p.category}">${categories[p.category].name}</a></li><li aria-current="page">${esc(p.name)}</li></ol></nav>
<section class="folio-case-hero"><div class="folio-card-meta"><p class="folio-label">${esc(p.kind)}</p>${stage(p)}</div><h1>${esc(p.name)}</h1><p class="folio-case-title">${esc(p.title)}</p><p class="folio-case-lead">${esc(p.summary)}</p><div class="folio-case-actions">${primaryAction}<a class="folio-inline-link" href="#participacao">Conhecer nossa participação</a></div></section>
${p.image?`<figure class="folio-cover${markImage(p)?' folio-cover--mark':''}">${image(p.image,true)}${p.image.caption?`<figcaption>${esc(p.image.caption)}</figcaption>`:''}</figure>`:''}
<nav class="folio-case-nav" aria-label="Nesta história"><a href="#contexto">Contexto</a><a href="#participacao">Nossa participação</a><a href="#entregas">O projeto</a><a href="#resultado">Na prática</a>${hasEvidence?'<a href="#publicado">Confira o projeto</a>':''}</nav>
${section('contexto','O contexto',`<p>${esc(p.context)}</p>`)}
${section('participacao','Nossa participação',`<p>${esc(p.approach)}</p>`)}
${section('entregas',p.stage && /protótipo|desenvolvimento|pesquisa/i.test(p.stage)?'Como o projeto foi estruturado':'O que construímos',deliveries(p.deliveries)+(p.secondaryImage?`<figure class="folio-story-figure">${image(p.secondaryImage)}<figcaption>${esc(p.secondaryImage.caption||'')}</figcaption></figure>`:''))}
${section('resultado','O que o projeto permite',metricBlock+deliveries(p.outcomes)+metricSource)}
${hasEvidence?section('publicado','Confira o projeto',`<div class="folio-evidence">${evidence}${profile}</div>`):''}
<section class="folio-services"><h2>Soluções relacionadas</h2><div class="folio-service-links">${links(p.services)}</div></section>
<section class="folio-related"><h2>Continue explorando</h2><div>${data.projects.filter(x=>x.slug!==p.slug && x.category===p.category).slice(0,3).map(x=>`<a href="${caseUrl(x)}">${esc(x.name)}</a>`).join('')}<a href="/portfolio/${p.category}">Portfólio ${categories[p.category].name.toLowerCase()}</a></div></section>
</div>`;
    const work = {'@type':'CreativeWork',name:p.name,description:p.description,url:base+caseUrl(p),creator:org,...(p.image?{image:base+p.image.src}:{})};
    outputs.set(`portfolio/${p.slug}.html`,page({title:p.seoTitle||`${p.name} | Portfólio Custom Mind`,description:p.description,url:caseUrl(p),ogImage:p.image?.src,body,schema:[{'@type':'WebPage',name:p.name,url:base+caseUrl(p),description:p.description,dateModified:p.updatedAt||data.updatedAt,mainEntity:work},breadcrumbSchema(p.category,p)]}));
  }
  const portfolioDir=path.join(root,'portfolio');
  const extra=fs.existsSync(portfolioDir)?fs.readdirSync(portfolioDir).filter(file=>file.endsWith('.html')&&!outputs.has('portfolio/'+file)):[];
  if(extra.length) throw new Error('Unlisted portfolio HTML needs explicit review (remove or redirect): '+extra.join(', '));
  const expectedRoutes = [
    {path:'/portfolio/',lastmod:data.updatedAt,priority:'0.9'},
    ...Object.keys(categories).map(key=>({path:'/portfolio/'+key,lastmod:data.updatedAt,priority:'0.9'})),
    ...data.projects.map(p=>({path:caseUrl(p),lastmod:p.updatedAt||data.updatedAt,priority:'0.8'}))
  ];
  const stale=[];
  if(JSON.stringify(site.pages.filter(p=>p.path.startsWith('/portfolio/')))!==JSON.stringify(expectedRoutes)) {
    if(check) stale.push('.harness/site/site-content.json (portfolio routes)');
    else {
      const pages=[...site.pages.filter(p=>!p.path.startsWith('/portfolio/')),...expectedRoutes];
      const block='"pages": [\n'+pages.map(p=>'    '+JSON.stringify(p).replaceAll('":','": ').replaceAll(',"',', "')+',').join('\n').replace(/,$/,'')+'\n  ],';
      fs.writeFileSync(sitePath,siteRaw.replace(/"pages": \[[\s\S]*?\n  \],/,block).replace(/"updatedAt": "[^"]+"/,`"updatedAt": "${data.updatedAt}"`));
    }
  }
  for(const [file,html] of outputs) {
    const target=path.join(root,file);
    const current=fs.existsSync(target)?fs.readFileSync(target,'utf8').replaceAll('\r\n','\n'):'';
    if(current===html.replaceAll('\r\n','\n')) continue;
    if(check) stale.push(file);
    else {fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,html);}
  }
  if(stale.length) {console.error('Portfolio out of sync:\n'+stale.join('\n'));process.exitCode=1;}
  else console.log(check?'Portfolio pages and routes are synchronized.':`Generated ${outputs.size} portfolio page(s).`);
}
await syncPortfolio();
