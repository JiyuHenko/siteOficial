# Custom Mind — site oficial

Site estático da [Custom Mind](https://www.custommind.com.br/), hospedado no GitHub Pages. Atuação: presença digital, software sob medida, automação e inteligência artificial. Produtos próprios: Jade, Zuri e Loja Inteligente. Cases de clientes preservam identidade específica e URLs públicas.

## Arquitetura

- `index.html`: home editorial v4 em HTML sem renderização por JavaScript.
- `assets/css/custommind-home-v4.css`: composição da home (hero de cases reais, serviços, portfólio, produtos, processo e FAQ).
- `assets/css/custommind-global-v4.css`: cabeçalho, rodapé e retoques globais. É importado ao final de `assets/css/custommind-site-v3.css`.
- `assets/css/v3/`: **base de compatibilidade** para páginas interiores e produtos. Não adicionar módulos com nomes numéricos novos; migrar estilos de forma planejada.
- `assets/css/client-*.css`: estilos isolados por cliente — **não** substituir por um tema genérico da agência.
- `assets/js/custommind-site-v3.js`: apenas conversão de CTAs WhatsApp e comportamento do menu móvel.
- `scripts/sync-site-chrome.mjs`: fonte do header/footer estáticos de páginas interiores e home; rodar para qualquer mudança no chrome.
- `.harness/site/site-content.json`: SEO central; `.harness/site/SITE_DESIGN.json`: manifesto de design por marca.

## Diretórios com finalidade própria
`configurator/` e `demo/` são superfícies separadas e ficam fora do redesign visual. Não apagar sem confirmar usos externos. `docs/cases/` guarda evidências e QA de projetos reais, não CSS de produção.

## Qualidade
Requer Node.js 22+; não há etapa de build nem framework no site público.

```bash
node --check assets/js/custommind-site-v3.js
node scripts/sync-site-chrome.mjs --check
node scripts/audit-unused-assets.mjs
node .harness/harness.mjs check
node .harness/sync-seo.mjs --check
```

Para verificar visualmente, servir os arquivos via servidor HTTP local e testar em desktop (~1440px), tablet (~768px), mobile (~390px), navegação por teclado e reduced motion. A branch de redesign não deve ir para `main` sem essa revisão.

## Política de limpeza
Excluir somente arquivos cuja ausência de uso foi verificada. Git mantém histórico das versões anteriores; não duplicar imagens nem manter experimentos de interface em produção. O redesign v4 eliminou módulos de hero neural, deck mobile legado e carrossel antigo, e substituiu o JS de efeitos por aprimoramentos mínimos.

## Publicação
As páginas mantêm URLs, sitemap e canonicals. Publicação de produção ocorre ao integrar em `main` após revisão do PR.
