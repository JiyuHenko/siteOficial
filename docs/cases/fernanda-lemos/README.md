# Fernanda Lemos · página de cliente

Página: `/clientes/fernanda-lemos.html`.

A apresentação parte da profissional e de sua proposta de cuidado. Rosé, papel rosado, pequenos detalhes verde-oliva, Cormorant e DM Sans locais vêm da identidade do site oficial. O retrato profissional abre a página; rotina, preferências e escuta conduzem o conteúdo. Não foram presumidos especialidades, modalidades, resultados, valores ou horários.

## Fontes e assets

- Site analisado: https://www.nutrifernandalemos.com.br/ — navegação visual pela home, Sobre, Acompanhamento e Conteúdos.
- Home, Sobre, Acompanhamento, Conteúdos, guia da primeira consulta, Dúvidas, Contato e retrato conferidos por HTTP: 200, sem divergência com o repositório fonte.
- Repositório fonte: https://github.com/JiyuHenko/siteMamae — `main`, commit `3b3cf6df08bd9f554b829b77c8a4b7b3fcad8036`.
- Logo fornecido ao projeto original. O retrato atual é a nova fotografia original `image(7).png`, enviada pelo usuário para os dois sites; conserva sua identidade, fundo e enquadramento integral, sem edição criativa.
- As imagens de mesa e alimento são composições editoriais ilustrativas já usadas no site, cuja origem está documentada em `siteMamae/docs/ASSETS.md`. Não representam pacientes, um consultório ou uma prescrição.
- Logo e quatro fotografias editoriais WebP copiados sem recodificação. Retrato original convertido para WebP em 1024 × 1536, 800 × 1200 e 480 × 720 px; capa social JPEG convertida para WebP, 1200 × 630. Procedência, dimensões, tamanhos e hashes em [origem-assets.json](origem-assets.json).
- As quatro fontes WOFF2 e suas licenças SIL OFL estão em `assets/fonts/fernanda/`.

## Integração

- Sétimo projeto da home, com seleção por clique nos cards ao fundo, rolagem e setas; o card em foco abre a página.
- Entrada própria no diretório, com o retrato da Fernanda.
- Canonical, Open Graph, Twitter, WebPage, Person e BreadcrumbList coerentes com a nova rota.
- Fonte central de SEO, sitemap e llms atualizados. A nova página, a home e o diretório têm lastmod de 2026-09-30; datas das páginas sem alteração foram preservadas.
- Header, footer, analytics, contato institucional e as seis páginas anteriores preservados. Estilos isolados em `client-fernanda-v1.css`.

## Revisão inicial e verificação

Base Git e HEAD durante a revisão: `22bb834388ccfdb7e31d52b993530f758cfc7294`, com alterações de trabalho. Os hashes da implementação renderizada estão em [verificacao.json](verificacao.json).

| Tela | Viewport | Evidência |
| --- | --- | --- |
| Página completa | 1440 × 960 | [Desktop](fernanda-1440.webp) |
| Página completa | 1024 × 960 | [Intermediário](fernanda-1024.webp) |
| Página completa | 390 × 960 | [Celular](fernanda-390.webp) |
| Fernanda em foco no deck | 1440 × 960 | [Home desktop](home-fernanda-1440.webp) |
| Fernanda em foco no deck | 1024 × 960 | [Home intermediário](home-fernanda-1024.webp) |
| Link direto no carrossel | 390 × 960 | [Home celular](home-direct-390.webp) |
| Diretório completo | 390 × 960 | [Projetos no celular](diretorio-390.webp) |

Verificações da página em 1440, 1024, 760, 390 e 320 px: um H1, canonical e dados estruturados corretos, fontes carregadas, imagens válidas, referências locais sem 404, ausência de erros JavaScript e de cortes horizontais. Menu mobile abre e fecha. Movimento normal e retrato com densidade 2× conferidos em 1440 e 390 px; foco de teclado visível.

O deck foi percorrido com nove cliques físicos nos cards expostos, em 1440 e 1024 px, incluindo o ciclo de retorno. Setas, roda do mouse e abertura da Fernanda em foco passaram. Links diretos em movimento reduzido/celular, retorno aos projetos e entrada no diretório passaram em 1440, 390 e 320 px.

A abertura da home permaneceu idêntica na comparação de pixels. As seis páginas anteriores permaneceram idênticas em bytes. Para a Leopoldina, HTML, CSS, JavaScript, fontes e imagens também foram comparados em bytes e o layout/estilos de todos os elementos do conteúdo permaneceram iguais. Houve variação de pixels restrita a fotografias WebP de bytes idênticos no Chromium de teste; essa comparação raster está registrada no JSON, junto das verificações independentes de geometria e dependências.

Checks locais: sintaxe JavaScript, sincronização de chrome, audit de assets, harness, sincronização de SEO e whitespace do diff. Zero erros; permanece apenas o aviso anterior de 22 imports CSS.

## Substituição do retrato · 30 de setembro de 2026

Nova foto original enviada pelo usuário, em proporção 2:3, com versões WebP de 1024 × 1536, 800 × 1200 e 480 × 720 px. Página, home e diretório usam os novos arquivos; o CSS recebeu uma nova versão para atualizar o cache. Os recortes dos cards preservam o cabelo e o rosto; o título no diretório fica na parte inferior da foto.

Revisão do retrato atual: [desktop e celular](retrato-preview.webp). Verificações de render em 1440, 1024 e 390 px, densidade 2× em desktop/celular, menu, foco do deck por clique, abertura do projeto e retorno ao diretório passaram. [Dados, hashes e base Git desta revisão](verificacao-retrato.json). As evidências da seção anterior correspondem à implementação inicial.

Sitemap e llms seguem sincronizados; os lastmods das três páginas continuam em 2026-09-30 porque a substituição ocorreu no mesmo dia local da criação do case.
