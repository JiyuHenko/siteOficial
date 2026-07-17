# Custom Mind — nova versão do site

## Direção visual

A interface foi reconstruída em HTML, CSS e JavaScript puros, mantendo a hospedagem estática. O design usa padrões contemporâneos encontrados em galerias como o 21st.dev, reinterpretados para a identidade da Custom Mind:

- navegação flutuante com efeito de vidro;
- hero com mockup de produto;
- cards bento;
- cards de produto com destaque por cor;
- abas de demonstração;
- fluxo de implantação em etapas;
- métricas e comparativo visual de case;
- microinterações e animações leves;
- tratamento específico para desktop e celular.

Nenhuma biblioteca de animação ou framework pesado foi adicionado.

## Páginas reconstruídas

- `index.html`
- `products/zuri.html`
- `products/violet.html`
- `products/violet-whatsapp.html`
- `products/violet-instagram.html`
- `products/violet-formulario.html`
- `products/loja-inteligente.html`

O configurador e checkout foram preservados para evitar regressão no fluxo existente. Neles foram corrigidos domínio e telefone.

## Novos arquivos principais

- `assets/css/modern.css`
- `assets/js/modern.js`
- imagens WebP em `assets/img/`
- `SEO_RECOMMENDATIONS.md`

## Rastreamento preservado

- Google Tag Manager: `GTM-MF32WD9H`
- Google Ads: `AW-17945612305`
- Conversão de WhatsApp: `AW-17945612305/r57ECOnT-4McEJGgke1C`
- Google Search Console: meta de verificação preservada na home

## Testes executados

- validação de links e arquivos internos;
- verificação de IDs duplicados;
- parsing de todos os blocos JSON-LD;
- títulos, descrições, canonicals e H1;
- menu mobile;
- abas da home;
- links automáticos de WhatsApp;
- formulário de qualificação da Violet;
- funcionamento básico do configurador, módulos, tenants e exportação JSON;
- renderização da home e produtos em desktop e celular.

## Publicação

Substitua o conteúdo atual do repositório por esta pasta, faça commit e publique normalmente. Como o projeto continua estático, não há etapa de build nem dependências para instalar.
