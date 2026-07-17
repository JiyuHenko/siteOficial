# SEO — estado atual e próximos passos

## O que já foi implementado nesta versão

- `title` e `meta description` exclusivos nas páginas comerciais.
- Canonicals padronizados em `https://custommind.com.br/`.
- Open Graph e Twitter Cards em todas as páginas principais.
- Dados estruturados JSON-LD:
  - `Organization` e `WebSite` na home;
  - `SoftwareApplication` nos produtos;
  - `BreadcrumbList` nas páginas internas;
  - `FAQPage` onde as perguntas e respostas estão visíveis na página.
- Sitemap atualizado com as páginas comerciais relevantes.
- `noindex,follow` no checkout, demonstração e formulário de qualificação, evitando que páginas internas ou pouco informativas concorram com as páginas comerciais.
- Imagens principais convertidas para WebP e dimensões declaradas no HTML.
- Atributos `alt`, hierarquia de títulos, link de acessibilidade e conteúdo utilizável sem JavaScript.
- Google Tag Manager preservado: `GTM-MF32WD9H`.
- Google Ads preservado: `AW-17945612305` e evento de conversão dos botões de WhatsApp.
- Verificação do Google Search Console preservada na home.

## Conferir antes de publicar

1. **WhatsApp:** os links públicos foram padronizados para `+55 (35) 99762-5467`, número que estava na configuração ativa do projeto. Confirme se ele continua correto.
2. **Valores e condições:** confirme os preços da Zuri e o valor inicial da Violet para WhatsApp.
3. **Case da Zuri:** confira os números de 144 → 1.450, 56,7 mil visualizações, R$ 0,04 e R$ 0,47 antes da publicação.
4. **Logos:** confirme se todas as marcas da pasta `assets/img/empresas/` podem aparecer publicamente.
5. **GTM:** publique e teste se o container ainda contém as tags desejadas.

## Próximas melhorias de maior impacto

### 1. Imagens sociais dedicadas

Criar uma imagem de 1200 × 630 para cada página:

- `/assets/img/og/home.webp`
- `/assets/img/og/zuri.webp`
- `/assets/img/og/violet.webp`
- `/assets/img/og/loja-inteligente.webp`

Depois, trocar `og:image` e `twitter:image` pelo arquivo correspondente. Isso melhora a apresentação ao compartilhar no WhatsApp, LinkedIn e redes sociais.

### 2. Google Analytics 4

O código visível tem Google Ads e GTM, mas não é possível confirmar pelo repositório se existe uma propriedade GA4 dentro do container. Caso não exista, adicionar no GTM uma tag com o ID `G-XXXXXXXXXX` e eventos como:

- `click_whatsapp`;
- `view_product`;
- `start_qualification`;
- `generate_lead`;
- `open_configurator`;
- `select_plan`.

Não é necessário instalar outro script diretamente no HTML se o GA4 for gerenciado pelo GTM.

### 3. Páginas de serviço com intenção de busca

Tags sozinhas não criam posicionamento. Criar páginas realmente úteis para temas como:

- desenvolvimento de software sob medida;
- automação de processos empresariais;
- inteligência artificial para atendimento no WhatsApp;
- criação de sistemas para lojas e prestadores de serviço;
- desenvolvimento de software em Passos, MG.

Cada página deve ter exemplos, processo, perguntas frequentes e conteúdo próprio. Evitar páginas quase iguais mudando apenas a cidade ou palavra-chave.

### 4. Case completo

Criar uma página própria para o case da Zuri, explicando:

- contexto inicial;
- período analisado;
- estratégia aplicada;
- métricas antes e depois;
- limitações da comparação;
- aprendizados.

Ela pode usar `Article` ou `BlogPosting` somente quando o conteúdo estiver publicado e visível.

### 5. Confiança e conformidade

Adicionar páginas reais, revisadas pelo responsável pela empresa:

- Política de Privacidade;
- Termos de Uso;
- Política de Cookies;
- informações empresariais e contato.

Essas páginas não devem ser preenchidas com texto jurídico genérico sem revisão.

### 6. LocalBusiness somente com informações completas

A versão atual usa `Organization`, que é a opção mais segura. Migrar para `LocalBusiness` apenas quando o site exibir dados consistentes como endereço ou área de atendimento, telefone, horários e identificação empresarial.

### 7. Outras verificações úteis

- Validar as URLs no Rich Results Test e no Schema Markup Validator.
- Enviar novamente `/sitemap.xml` ao Search Console depois da publicação.
- Solicitar indexação da home e das páginas principais.
- Acompanhar Core Web Vitals e experiência mobile.
- Configurar Bing Webmaster Tools caso o canal seja relevante.
- Adicionar Meta Pixel ou LinkedIn Insight Tag apenas se houver campanha e consentimento adequado; não instalar tags sem objetivo mensurável.
- Usar `hreflang` apenas se existirem versões reais do site em outros idiomas.
