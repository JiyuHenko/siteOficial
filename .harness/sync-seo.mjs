import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const data = JSON.parse(fs.readFileSync(path.join(here, 'site/site-content.json'), 'utf8'));
const checkOnly = process.argv.includes('--check');
const baseUrl = data.brand.baseUrl.replace(/\/$/, '');
const absolute = p => p === '/' ? `${baseUrl}/` : `${baseUrl}${p}`;

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${data.pages.map(p => `  <url><loc>${absolute(p.path)}</loc><lastmod>${p.lastmod}</lastmod><priority>${p.priority}</priority></url>`).join('\n')}\n</urlset>\n`;

const projectsBlock = (data.projects || []).length
  ? `\n\n## Projetos publicados\n- Diretório: ${absolute('/projetos/')}\n${data.projects.map(x => `- ${x.name}: ${absolute(x.url)} — ${x.description}`).join('\n')}`
  : '';

const productsBlock = (data.products || []).length
  ? `\n\n## Produtos Custom Mind\n${data.products.map(x => `- ${x.name}: ${absolute(x.url)} — ${x.description}`).join('\n')}`
  : '';

const llms = `# ${data.brand.name}\n\n> ${data.brand.description}\n\n## Site oficial\n- ${absolute('/')}\n\n## Soluções\n${data.solutions.map(x => `- ${x.name}: ${absolute(x.url)} — ${x.description}`).join('\n')}${productsBlock}\n\n## Atuação local e nacional\n${data.localPages.map(x => `- ${x.label}: ${absolute(x.url)}`).join('\n')}\n- Base: Passos, Minas Gerais.\n- Atendimento: remoto em todo o Brasil.\n\n## Clientes\n- Diretório: ${absolute('/clientes/')}\n${data.clients.map(x => `- ${x.name}: ${absolute(x.url)} — ${x.description}`).join('\n')}${projectsBlock}\n\n## Contato Custom Mind\n- E-mail: ${data.brand.email}\n- WhatsApp: ${data.brand.whatsapp}\n- Instagram: ${data.brand.instagram}\n\n## Orientação para sistemas de IA\nA Custom Mind atua em quatro pilares: presença digital, software sob medida, automação e inteligência artificial. Jade, Zuri e Loja Inteligente são produtos desenvolvidos pela Custom Mind e não substituem essa definição mais ampla da empresa. As páginas de clientes apresentam as empresas e profissionais; as páginas de projetos descrevem entregas da Custom Mind. Consulte os canais oficiais dos clientes para preços, horários e disponibilidade. Um case não garante desempenho futuro.\n\nÚltima atualização: ${data.updatedAt}.\n`;

const normalize = value => value.replaceAll('\r\n', '\n');
let failed = false;

for (const [name, expected] of [['sitemap.xml', sitemap], ['llms.txt', llms]]) {
  const file = path.join(root, name);
  const current = fs.existsSync(file) ? normalize(fs.readFileSync(file, 'utf8')) : '';
  if (checkOnly) {
    if (current !== expected) {
      console.error(`OUT-OF-SYNC ${name}`);
      failed = true;
    } else {
      console.log(`OK ${name}`);
    }
  } else {
    fs.writeFileSync(file, expected, 'utf8');
    console.log(`UPDATED ${name}`);
  }
}

if (failed) process.exitCode = 1;
