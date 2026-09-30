# Revisão das páginas de clientes e navegação dos projetos

Branch: `feat/cases-clientes-navegacao`. Base aprovada: `6bc45521daceaad38c9d049ad5aef00bcc0997d0`, já publicada na main com a Joias Leopoldina. As capturas desta pasta correspondem ao código desta revisão; os arquivos verificados têm hashes em `verificacao.json`.

## Conteúdo e direção visual

As cinco páginas passam a apresentar o cliente, seus serviços, sua história e seus destinos oficiais. A explicação sobre a execução do projeto pela agência dá lugar ao conteúdo da marca; o crédito Custom Mind fica no encerramento e a navegação institucional continua compartilhada.

| Página | Conteúdo próprio | Direção e imagem real |
|---|---|---|
| `/clientes/auto-eletrica-avelar.html` | Diagnóstico, bancada, módulos, climatização, aplicações pesada/agrícola, Dimsport e contato local | Amarelo, azul e vermelho; logo original, fachada limpa, oficina e fotos dos serviços |
| `/clientes/lb-fit.html` | Campanha ICE, famílias de peças, catálogo e ligação com a Lara | Rosa editorial, marca original e campanha já existente |
| `/clientes/patricia-biagioni.html` | Trajetória profissional e sequência da consultoria individual, incluindo MFIT | Marfim e vinho, retrato original e títulos serifados |
| `/clientes/lara-biagioni.html` | Canais oficiais, LB Fit e parcerias selecionadas | Rosa/lilás, retrato oficial e logos originais da LB Fit, Growth e Oficial Farma |
| `/clientes/caligulas-poker-live.html` | História do online ao live, casa, programação, ranking, galeria, CPS e comunidade | Preto/dourado, marca original e fotografias locais da casa e dos encontros |

Fontes consultadas: [siteAutoEletrica](https://github.com/JiyuHenko/siteAutoEletrica), [SiteLara](https://github.com/JiyuHenko/SiteLara), [sitePatricia](https://github.com/JiyuHenko/sitePatricia), [siteCaligulas](https://github.com/JiyuHenko/siteCaligulas) e [loja oficial LB Fit](https://www.uselbfit.com.br/). O repositório da LB Fit não estava entre os disponíveis; o logo veio dos assets de parcerias do SiteLara e a campanha foi reaproveitada do próprio portfólio. A loja retornou indisponibilidade durante a navegação; o texto comercial usa as categorias públicas encontradas, com links para o catálogo, sem preços ou estoque copiados.

Os commits e caminhos exatos das imagens estão em [origem-assets.json](origem-assets.json). Textos se baseiam nos sites e repositórios oficiais; não foram acrescentadas métricas, depoimentos, datas de eventos, descontos ou promessas de resultados. Cupons e ofertas permanecem nos canais oficiais.

## Assets e preservação

São 17 novos arquivos de imagem, todos WebP, somando 1.144.964 bytes. Fotografias foram dimensionadas para o uso; imagens já em WebP e adequadas foram preservadas. Logos mantêm proporção e transparência. As imagens do conteúdo têm dimensões no HTML, carregamento assíncrono e lazy loading quando estão abaixo da abertura.

O retrato real da Lara substitui a arte de Open Graph na página, na home e no diretório. A fachada limpa da Avelar substitui nesses pontos a captura com interface do Google Maps; ambas representam a mesma oficina. As fotos do Caligulas passam a ser locais. Os assets anteriores continuam disponíveis para URLs de compartilhamento e referências existentes. A campanha original da LB Fit e o retrato da Patrícia permanecem visíveis. Nenhuma imagem sintética foi criada.

`client-cases-v2.css` é carregado apenas nas cinco páginas revisadas e usa `.client-refresh-page` para isolar as regras. Ajustes de tamanho no celular também ficam nesse escopo. HTML, CSS exclusivo, fonte e imagens da Leopoldina permanecem idênticos à base aprovada. Canonicals, GTM, header/footer e contatos institucionais continuam preservados. Descrições, schemas de WebPage/BreadcrumbList, sitemap e `llms.txt` foram atualizados; o schema AutoRepair existente foi mantido.

## Interação da home

- No desktop, clicar na parte exposta de um projeto ao fundo coloca esse projeto em foco, atualiza o contador e o link principal, sem sair da home.
- Clicar no projeto em foco abre sua página. Roda do mouse e setas continuam navegando, incluindo a volta do último ao primeiro.
- Cliques com modificadores preservam o comportamento nativo do link.
- No celular, o carrossel continua nativo e os cards levam diretamente ao projeto. Reduced motion mantém a grade de links sem a animação do deck.

## Verificação e evidências

Render real em Chromium, com as imagens e fontes locais carregadas. As cinco páginas foram verificadas em 1440, 1024, 760, 390 e 320 × 960: 25 estados sem overflow de layout/texto, imagens quebradas, erros de JavaScript ou referências locais ausentes. Um H1, schemas válidos, CTA oficial e contato institucional foram conferidos. Menu móvel abre e fecha.

| Estado revisado | Evidência |
|---|---|
| Avelar e LB Fit, páginas completas em 1440 × 960 | [Desktop](desktop-avelar-lbfit.webp) |
| Patrícia, Lara e Caligulas, páginas completas em 1440 × 960 | [Desktop](desktop-patricia-lara-caligulas.webp) |
| Cinco aberturas em 1024 × 960 | [Intermediário](tablet.webp) |
| Cinco aberturas em 390 × 960 | [Celular](mobile.webp) |
| Home após selecionar um projeto ao fundo, 1440 × 960 | [Clique no deck](home-clique.webp) |
| Matriz de layout, links, imagens, navegação e hashes | [Verificação](verificacao.json) |

Os testes de desktop usaram cliques físicos nos cards realmente expostos, sem forçar elementos escondidos: oito seleções por largura em 1440 e 1024, cobrindo os seis projetos e a passagem do último ao primeiro. Também passaram teclado, roda do mouse e abertura do projeto ativo. Os links diretos em reduced motion e celular, a volta ao diretório e a abertura do Caligulas foram conferidos.

A comparação da abertura da home com a base aceita até três níveis de cor por canal para a rasterização do círculo desfocado existente. A comparação completa da Leopoldina usa igualdade de pixels após carregar/decodificar as imagens. Os resultados medidos ficam no JSON. Requisições de analytics foram bloqueadas somente no ambiente de teste.

Checks locais: sintaxe JavaScript, sincronização de header/footer, auditoria de assets, harness, SEO gerado e `git diff --check`. O harness apresenta zero erros e somente o aviso já existente sobre 22 imports de CSS.
