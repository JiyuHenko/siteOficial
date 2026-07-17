# Custom Mind | Software Solutions

Site oficial da Custom Mind, desenvolvido como projeto estático em HTML, CSS e JavaScript, com foco em performance, acessibilidade, conversão e manutenção simples.

## Páginas principais

- `/` — apresentação da empresa, soluções, processo e case;
- `/products/zuri.html` — crescimento orgânico para Instagram;
- `/products/violet.html` — visão geral da assistente de atendimento e vendas;
- `/products/violet-whatsapp.html` — landing específica para WhatsApp;
- `/products/violet-instagram.html` — landing específica para Instagram;
- `/products/violet-formulario.html` — qualificação rápida;
- `/products/loja-inteligente.html` — sistema modular de gestão;
- `/configurator/` — configurador da Loja Inteligente;
- `/configurator/checkout.html` — checkout do serviço de configuração.

## Rodar localmente

```bash
python -m http.server 5500
```

Abra `http://localhost:5500`.

Não existe etapa de build ou dependência obrigatória.

## Estrutura visual

A identidade principal está em:

- `assets/css/modern.css`
- `assets/js/modern.js`
- `assets/img/*.webp`

O site usa HTML semântico, componentes visuais próprios, animações leves em CSS e JavaScript sem frameworks.

## SEO e rastreamento

- canonicals padronizados em `custommind.com.br`;
- sitemap e robots atualizados;
- Open Graph e Twitter Cards;
- JSON-LD para Organization, WebSite, SoftwareApplication, BreadcrumbList e FAQPage;
- Google Tag Manager e Google Ads preservados;
- páginas internas de checkout, demonstração e formulário marcadas como `noindex`.

Veja `SEO_RECOMMENDATIONS.md` antes da publicação.

## Publicação

O projeto pode continuar sendo hospedado como site estático. Faça commit dos arquivos e publique no serviço já utilizado pelo domínio.
