# Custom Mind — site oficial

Reconstrução estática, pronta para GitHub Pages em `www.custommind.com.br`.

## Estrutura principal
- `index.html` — página inicial
- `solucoes.html` — serviços e processo
- `products/jade.html` — Jade
- `products/zuri.html` — Zuri
- `products/loja-inteligente.html` — Loja Inteligente
- `clientes/` — índice e páginas individuais
- `sitemap.xml`, `robots.txt`, dados estruturados e Open Graph

## Integrações preservadas
- Google Tag Manager: `GTM-MF32WD9H`
- Verificação do Search Console: preservada no HTML
- Domínio: `www.custommind.com.br`

O Google Ads e o GA4 devem ser configurados dentro do GTM para evitar medição duplicada.

## Adicionar um cliente
1. Crie `clientes/slug-do-cliente.html` usando uma página existente como base.
2. Adicione imagens em `assets/img/clients/`.
3. Crie título, descrição, canonical, Open Graph e JSON-LD exclusivos.
4. Adicione o card em `clientes/index.html` e, se for destaque, em `index.html`.
5. Inclua a URL em `sitemap.xml` com `lastmod` real.
6. Atualize `data/clientes.json` como registro de referência.

Não crie páginas escondidas de tags nem cópias do site do cliente. Cada página deve ser útil e editorial.
