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
A entrada pública de estilos permanece `assets/css/custommind-site-v3.css`. Nesta branch, ela carrega `editorial.css` (identidade compartilhada, home e páginas institucionais) e `editorial-products.css` (produtos). As páginas de clientes carregam também `editorial-clients.css`, preservando a identidade de cada marca. Os módulos anteriores em `assets/css/v3/` não são carregados por esta versão.

O comportamento principal fica em `assets/js/custommind-site-v3.js`: apenas o menu móvel progressivamente aprimorado. Conteúdo, projetos, FAQs e links de WhatsApp estão no HTML e funcionam sem JavaScript.

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

Mudanças visuais exigem revisão em desktop e mobile, especialmente composição inicial, portfólio, imagens de produtos, navegação e rodapé.

## Assets
A árvore de produção deve conter somente assets efetivamente referenciados pelas superfícies atuais. Imagens raster de interface usam WebP sempre que possível; PNG/JPG ficam reservados para casos em que o formato é necessário.

A auditoria abaixo falha quando um asset fantasma ou um bundle legado volta para a árvore:

```bash
node scripts/audit-unused-assets.mjs
```

O histórico do Git funciona como arquivo dos assets antigos; não é necessário manter cópias órfãs dentro de `assets/`.

## SEO e qualidade
A fonte central das páginas públicas fica em `.harness/site/site-content.json`. O projeto mantém sitemap, `llms.txt`, 404 com `noindex` e validações automáticas de JavaScript, SEO técnico, referências, JSON-LD, sincronização do chrome compartilhado e assets pelo GitHub Actions.

O `llms.txt` diferencia explicitamente os quatro pilares dos produtos próprios para que mecanismos de busca e sistemas de IA entendam a arquitetura correta da marca.

## Publicação
Antes de levar mudanças da branch de trabalho para `main`, revise a home, `/solucoes.html`, os quatro pilares, produtos, clientes e comportamento mobile.

## Redesign editorial — branch de avaliação

`redesign/editorial-2026-09-17` propõe fundo claro, texto em carvão, roxo como destaque, tipografia mais aberta e projetos reais em fluxo normal de página. A home passa por contexto, serviços, portfólio, confiança, produtos, processo e dúvidas. As interfaces reais de Jade, Zuri e Loja Inteligente continuam visíveis.

A mudança abrange as 22 páginas públicas que usam a identidade compartilhada, o enquadramento das páginas de clientes, a aparência do configurador/checkout e a estrutura visual da demonstração. As opções de tema do produto, campos, exportação, contratação e dados de pagamento mantêm sua lógica original.

### Verificações desta entrega

- Checks existentes de JavaScript, HTML, SEO, JSON-LD, referências, assets e cabeçalho/rodapé: aprovados.
- Comparação com `9015c1c`: títulos, metadados, canônicas, dados estruturados e analytics preservados nas 24 páginas HTML alteradas.
- `CNAME`, `robots.txt`, `sitemap.xml`, `llms.txt` e a fonte de conteúdo SEO preservados integralmente.
- Links internos com fragmentos, IDs e links estáticos de contato conferidos.
- A animação da marca e os efeitos CSS respeitam redução de movimento.

**Revisão visual pendente:** o navegador disponibilizado para esta tarefa bloqueou a prévia local por política de acesso. Não foram obtidas capturas nem confirmados os layouts renderizados. Antes de promover a branch, revisar em aproximadamente 1440 px, 1024 px e 390 px, incluindo o menu por teclado, formulários e páginas de produto/cliente.

Para avaliar localmente, na raiz desta branch:

```bash
python -m http.server 8080
```

Abra `http://localhost:8080/`. A entrega nesta branch não altera a publicação da `main`.
