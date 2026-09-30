# Custom Mind — site oficial

Site estático publicado via GitHub Pages.

## Posicionamento
A Custom Mind é apresentada pelo site em quatro pilares estratégicos:
- Presença Digital
- Software sob medida
- Automação
- Inteligência Artificial

Jade, Zuri e Loja Inteligente permanecem como produtos desenvolvidos pela Custom Mind, com páginas próprias em `products/`, mas não definem sozinhos o posicionamento da empresa.

As páginas em `clientes/` apresentam as empresas atendidas e seus canais oficiais. Os cases em `projetos/` mostram as entregas da Custom Mind e se conectam às páginas dos clientes. A home também reaproveita `assets/img/empresas/` como prova social separada dos projetos em destaque.

## Arquitetura
A camada visual v3 permanece modular: `assets/css/custommind-site-v3.css` carrega os módulos em `assets/css/v3/`. O comportamento principal fica em `assets/js/custommind-site-v3.js`.

As páginas de pilares são:
- `presenca-digital.html`
- `software-sob-medida.html`
- `automacao.html`
- `inteligencia-artificial.html`

O site publicado continua 100% estático. Header e footer permanecem escritos no HTML final para não depender de JavaScript, mas são mantidos a partir de uma única fonte por `scripts/sync-site-chrome.mjs`. Ao alterar navegação, branding ou footer, rode:

```bash
node scripts/sync-site-chrome.mjs
```

O CI usa `--check` para impedir que páginas voltem a divergir.

Mudanças visuais exigem revisão em desktop e mobile, especialmente hero neural, deck de projetos, marquee de empresas e carrossel mobile.

## Assets
A árvore de produção deve conter somente assets efetivamente referenciados pelas superfícies atuais. Imagens raster de interface usam WebP sempre que possível; PNG/JPG ficam reservados para casos em que o formato é necessário.

A auditoria abaixo falha quando um asset fantasma ou um bundle legado volta para a árvore:

```bash
node scripts/audit-unused-assets.mjs
```

O histórico do Git funciona como arquivo dos assets antigos; não é necessário manter cópias órfãs dentro de `assets/`.

## SEO e qualidade
A fonte central das páginas públicas fica em `.harness/site/site-content.json`. O projeto mantém sitemap, `llms.txt`, 404 com `noindex` e validações automáticas de JavaScript, SEO técnico, referências, JSON-LD, sincronização do chrome compartilhado e assets pelo GitHub Actions.

O `llms.txt` diferencia explicitamente clientes, projetos, os quatro pilares e os produtos próprios para que mecanismos de busca e sistemas de IA entendam a arquitetura correta da marca. O modelo editorial dos novos cases está em `projetos/CASE_TEMPLATE.md`.

## Publicação
Antes de levar mudanças da branch de trabalho para `main`, revise a home, `/solucoes.html`, os quatro pilares, produtos, clientes e comportamento mobile.
