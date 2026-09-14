import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const check = process.argv.includes('--check');
const excludedRoots = new Set(['configurator', 'demo', '.git', 'node_modules']);

function walk(dir='.') {
  const out=[];
  for (const ent of fs.readdirSync(path.join(root,dir), {withFileTypes:true})) {
    if (ent.isDirectory() && excludedRoots.has(ent.name) && dir === '.') continue;
    const rel=path.posix.join(dir==='.'?'':dir,ent.name);
    if (ent.isDirectory()) out.push(...walk(rel));
    else if (ent.name.endsWith('.html')) out.push(rel);
  }
  return out;
}

const solutionPages = new Set([
  'solucoes.html','presenca-digital.html','software-sob-medida.html','automacao.html','inteligencia-artificial.html',
  'empresa-de-software-em-passos-mg.html','criacao-de-sites-em-passos-mg.html','automacao-empresarial-em-passos-mg.html'
]);

function escAttr(s='') { return s.replace(/&/g,'&amp;').replace(/"/g,'&quot;'); }
function activeClass(on) { return on ? ' class="active"' : ''; }

function pageContext(file) {
  const nested=file.includes('/');
  const prefix=nested?'../':'';
  let active='';
  if(file==='index.html') active='home';
  else if(file.startsWith('clientes/')) active='projects';
  else if(file==='sobre.html') active='about';
  else if(file.startsWith('products/') || solutionPages.has(file)) active='solutions';
  return {prefix,active};
}

function extractHeaderMessage(html) {
  const m=html.match(/<a class="nav-cta"[^>]*data-wa="([^"]*)"/);
  return m ? m[1] : 'Olá! Vim pelo site da Custom Mind e quero conversar sobre um projeto.';
}

function header(file, message) {
  const {prefix:p,active}=pageContext(file);
  return `<!-- CM:SHARED-HEADER START -->\n<header class="site-header"><div class="container nav-shell">\n<a class="brand-pill" href="${p}index.html" aria-label="Custom Mind — início"><img src="${p}assets/img/custommind-logo-animated.svg" alt=""><span><strong>Custom Mind</strong><small>Software Solutions</small></span></a>\n<nav class="nav-pill" aria-label="Navegação principal"><a${activeClass(active==='home')} href="${p}index.html">Início</a><a${activeClass(active==='solutions')} href="${p}solucoes.html">Soluções</a><a${activeClass(active==='projects')} href="${p}clientes/index.html">Projetos</a><a${activeClass(active==='about')} href="${p}sobre.html">Sobre</a></nav>\n<a class="nav-cta" data-wa="${escAttr(message)}" href="#">Falar com a gente <i>↗</i></a>\n<button class="menu-toggle" aria-expanded="false" aria-label="Abrir menu">☰</button>\n<nav class="mobile-nav" aria-label="Navegação móvel"><a${activeClass(active==='home')} href="${p}index.html">Início</a><a${activeClass(active==='solutions')} href="${p}solucoes.html">Soluções</a><a${activeClass(active==='projects')} href="${p}clientes/index.html">Projetos</a><a${activeClass(active==='about')} href="${p}sobre.html">Sobre</a><a href="${p}contato.html">Contato</a></nav>\n</div></header>\n<!-- CM:SHARED-HEADER END -->`;
}

function footer(file) {
  const {prefix:p}=pageContext(file);
  return `<!-- CM:SHARED-FOOTER START -->\n<footer class="site-footer"><div class="container"><div class="footer-grid"><div><a class="footer-brand" href="${p}index.html"><img src="${p}assets/img/custommind-logo-animated.svg" alt=""><span><strong>Custom Mind</strong><small>Software Solutions</small></span></a><p class="footer-copy">Presença digital, software, automação e inteligência artificial construídos a partir da necessidade real de cada negócio.</p></div><div class="footer-col"><h4>Soluções</h4><a href="${p}presenca-digital.html">Presença Digital</a><a href="${p}software-sob-medida.html">Software sob medida</a><a href="${p}automacao.html">Automação</a><a href="${p}inteligencia-artificial.html">Inteligência Artificial</a></div><div class="footer-col"><h4>Empresa</h4><a href="${p}clientes/index.html">Projetos</a><a href="${p}sobre.html">Sobre</a><a href="${p}contato.html">Contato</a><a href="${p}politica-de-privacidade.html">Privacidade</a></div><div class="footer-col"><h4>Contato</h4><a data-wa="Olá! Vim pelo site da Custom Mind." href="#">WhatsApp</a><a href="mailto:custommind.softwaresolutions@gmail.com">E-mail</a><a href="https://www.instagram.com/custommind.solutions/" target="_blank" rel="noopener">Instagram</a><span class="kicker">Passos–MG • Brasil</span></div></div><div class="footer-bottom"><span>© Custom Mind. Todos os direitos reservados.</span><span>Design + engenharia + operação</span></div></div></footer>\n<!-- CM:SHARED-FOOTER END -->`;
}

const headerRe=/(?:<!-- CM:SHARED-HEADER START -->\s*)?<header class="site-header">[\s\S]*?<\/header>(?:\s*<!-- CM:SHARED-HEADER END -->)?/;
const footerRe=/(?:<!-- CM:SHARED-FOOTER START -->\s*)?<footer class="site-footer">[\s\S]*?<\/footer>(?:\s*<!-- CM:SHARED-FOOTER END -->)?/;
let changed=0;
const stale=[];

for(const file of walk()) {
  const abs=path.join(root,file);
  const original=fs.readFileSync(abs,'utf8');
  if(!original.includes('<header class="site-header">') || !original.includes('<footer class="site-footer">')) continue;
  const msg=extractHeaderMessage(original);
  let next=original.replace(headerRe,header(file,msg)).replace(footerRe,footer(file));
  if(next===original) continue;
  changed++;
  if(check) stale.push(file); else fs.writeFileSync(abs,next);
}

if(check && stale.length) {
  console.error('Shared site chrome is out of sync:');
  stale.forEach(f=>console.error(` - ${f}`));
  process.exit(1);
}
console.log(check ? 'Shared site chrome is synchronized.' : `Synchronized shared header/footer in ${changed} page(s).`);
