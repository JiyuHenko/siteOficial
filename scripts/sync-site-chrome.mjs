import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const check = process.argv.includes('--check');
const excludedRoots = new Set(['configurator', 'demo', '.git', 'node_modules']);
const whatsappNumber = '5511923734039';
const defaultWhatsappMessage = 'Olá! Vim pelo site da Custom Mind e quero conversar sobre um projeto.';
const clientHeaderContacts = new Map([
  ['clientes/livia-lopes.html', { label: 'Falar com a Lívia', href: 'https://wa.me/5535997238058' }],
]);

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

function activeClass(on) { return on ? ' class="active"' : ''; }

function pageContext(file) {
  const nested=file.includes('/');
  const prefix=file==='404.html'?'/':nested?'../':'';
  let active='';
  if(file==='index.html') active='home';
  else if(file.startsWith('clientes/')) active='projects';
  else if(file==='sobre.html') active='about';
  else if(file.startsWith('products/') || solutionPages.has(file)) active='solutions';
  return {prefix,active};
}

function extractHeaderMessage(html) {
  const m=html.match(/<a class="nav-cta"[^>]*data-wa="([^"]*)"/);
  return m ? m[1] : defaultWhatsappMessage;
}

function decodeAttribute(value) {
  const entities = {amp:'&', quot:'"', apos:"'", lt:'<', gt:'>', nbsp:'\u00a0'};
  return value.replace(/&(?:amp|AMP|quot|QUOT|apos|lt|LT|gt|GT|nbsp|#\d+|#[xX][\da-fA-F]+);/g, entity => {
    const key = entity.slice(1, -1).toLowerCase();
    if (!key.startsWith('#')) return entities[key];
    const code = key.startsWith('#x') ? Number.parseInt(key.slice(2), 16) : Number(key.slice(1));
    return code > 0 && code <= 0x10ffff && (code < 0xd800 || code > 0xdfff)
      ? String.fromCodePoint(code)
      : '\ufffd';
  });
}

function syncWhatsappLinks(html) {
  return html.replace(/<a\s(?:[^>"']|"[^"]*"|'[^']*')*>/gi, tag => {
    const attributes = [...tag.matchAll(/\s+([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)];
    const message = attributes.find(([, name]) => name.toLowerCase() === 'data-wa');
    if (!message) return tag;

    const text = decodeAttribute(message[2] ?? message[3] ?? message[4] ?? '') || defaultWhatsappMessage;
    const keep = attributes.filter(([, name]) => !['href', 'target', 'rel'].includes(name.toLowerCase()));
    const href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    return `<a${keep.map(([attr]) => attr).join('')} href="${href}" target="_blank" rel="noopener">`;
  });
}

function header(file, message) {
  const {prefix:p,active}=pageContext(file);
  const clientContact = clientHeaderContacts.get(file);
  const contactLink = clientContact
    ? `<a class="nav-cta" href="${clientContact.href}" target="_blank" rel="noopener">${clientContact.label} <i>↗</i></a>`
    : `<a class="nav-cta" data-wa="${message}" href="#">Falar com a gente <i>↗</i></a>`;
  const mobileContactLink = clientContact
    ? `<a href="${clientContact.href}" target="_blank" rel="noopener">${clientContact.label}</a>`
    : `<a href="/contato">Contato</a>`;
  return `<!-- CM:SHARED-HEADER START -->\n<header class="site-header"><div class="container nav-shell">\n<a class="brand-pill" href="/" aria-label="Custom Mind — início"><img src="${p}assets/img/custommind-logo-animated.svg" alt=""><span><strong>Custom Mind</strong><small>Software Solutions</small></span></a>\n<nav class="nav-pill" aria-label="Navegação principal"><a${activeClass(active==='home')} href="/">Início</a><a${activeClass(active==='solutions')} href="/solucoes">Soluções</a><a${activeClass(active==='projects')} href="/clientes/">Projetos</a><a${activeClass(active==='about')} href="/sobre">Sobre</a></nav>\n${contactLink}\n<button class="menu-toggle" aria-expanded="false" aria-label="Abrir menu">☰</button>\n<nav class="mobile-nav" aria-label="Navegação móvel"><a${activeClass(active==='home')} href="/">Início</a><a${activeClass(active==='solutions')} href="/solucoes">Soluções</a><a${activeClass(active==='projects')} href="/clientes/">Projetos</a><a${activeClass(active==='about')} href="/sobre">Sobre</a>${mobileContactLink}</nav>\n</div></header>\n<!-- CM:SHARED-HEADER END -->`;
}

function footer(file) {
  const {prefix:p}=pageContext(file);
  return `<!-- CM:SHARED-FOOTER START -->\n<footer class="site-footer"><div class="container"><div class="footer-grid"><div><a class="footer-brand" href="/"><img src="${p}assets/img/custommind-logo-animated.svg" alt=""><span><strong>Custom Mind</strong><small>Software Solutions</small></span></a><p class="footer-copy">Presença digital, software, automação e inteligência artificial construídos a partir da necessidade real de cada negócio.</p></div><div class="footer-col"><h4>Soluções</h4><a href="/presenca-digital">Presença Digital</a><a href="/software-sob-medida">Software sob medida</a><a href="/automacao">Automação</a><a href="/inteligencia-artificial">Inteligência Artificial</a></div><div class="footer-col"><h4>Empresa</h4><a href="/clientes/">Projetos</a><a href="/sobre">Sobre</a><a href="/contato">Contato</a><a href="/politica-de-privacidade">Privacidade</a></div><div class="footer-col"><h4>Contato</h4><a data-wa="Olá! Vim pelo site da Custom Mind." href="#">WhatsApp</a><a href="mailto:custommind.softwaresolutions@gmail.com">E-mail</a><a href="https://www.instagram.com/custommind.solutions/" target="_blank" rel="noopener">Instagram</a><span class="kicker">Passos–MG • Brasil</span></div></div><div class="footer-bottom"><span>© Custom Mind. Todos os direitos reservados.</span><span>Design + engenharia + operação</span></div></div></footer>\n<!-- CM:SHARED-FOOTER END -->`;
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
  const eol = original.includes('\r\n') ? '\r\n' : '\n';
  const chrome = original
    .replace(headerRe, () => header(file, msg).replaceAll('\n', eol))
    .replace(footerRe, () => footer(file).replaceAll('\n', eol));
  const next = syncWhatsappLinks(chrome);
  if(next===original) continue;
  changed++;
  if(check) stale.push(file); else fs.writeFileSync(abs,next);
}

if(check && stale.length) {
  console.error('Shared site chrome or WhatsApp links are out of sync:');
  stale.forEach(f=>console.error(` - ${f}`));
  process.exit(1);
}
console.log(check ? 'Shared site chrome and WhatsApp links are synchronized.' : `Synchronized shared chrome and WhatsApp links in ${changed} page(s).`);
