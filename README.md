# Custom Mind — site oficial

Site estático publicado via GitHub Pages.

## Posicionamento
A Custom Mind é apresentada pelo site em quatro pilares estratégicos:
- Presença Digital
- Software sob medida
- Automação
- Inteligência Artificial

Jade, Zuri e Loja Inteligente permanecem como produtos desenvolvidos pela Custom Mind, com páginas próprias em `products/`, mas não definem sozinhos o posicionamento da empresa.

Os projetos em `clientes/` continuam centrados nas empresas atendidas e funcionam como portfólio e descoberta. A home também reaproveita `assets/img/empresas/` como prova social separada dos projetos em destaque.

## Arquitetura
A camada visual v3 permanece modular: `assets/css/custommind-site-v3.css` carrega os módulos em `assets/css/v3/`. Os módulos `17-pillars.css`, `18-trust-products.css` e `19-pillar-pages.css` concentram a expansão da marca sem reescrever os módulos visuais anteriores. O comportamento principal fica em `assets/js/custommind-site-v3.js`.

As páginas de pilares são:
- `presenca-digital.html`
- `software-sob-medida.html`
- `automacao.html`
- `inteligencia-artificial.html`

Mudanças visuais exigem revisão em desktop e mobile, especialmente hero neural, deck de projetos, marquee de empresas e carrossel mobile.

## SEO e qualidade
A fonte central das páginas públicas fica em `.harness/site/site-content.json`. O projeto mantém sitemap, `llms.txt`, 404 com `noindex` e validações automáticas de JavaScript, SEO técnico, referências, JSON-LD e assets pelo GitHub Actions.

O `llms.txt` diferencia explicitamente os quatro pilares dos produtos próprios para que mecanismos de busca e sistemas de IA entendam a arquitetura correta da marca.

## Publicação
Antes de levar mudanças da branch de trabalho para `main`, revise a home, `/solucoes.html`, os quatro pilares, produtos, clientes e comportamento mobile.
