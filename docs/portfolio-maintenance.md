# Manutenção do portfólio

A área `/portfolio/` apresenta o trabalho da Custom Mind. `/portfolio/clientes` reúne trabalhos para negócios e profissionais; `/portfolio/produtos` reúne produtos, ferramentas e frentes experimentais próprias. `/clientes/` mantém as páginas centradas nos negócios e projetos e seus canais oficiais. Os dois conteúdos têm finalidades diferentes.

## Atualizar um trabalho

Edite `.harness/site/portfolio-content.json`. Cada projeto define contexto, participação, entregas, efeitos observáveis na experiência, imagens reais, evidências públicas e soluções relacionadas. Nunca edite diretamente o HTML gerado em `portfolio/`. Atualize `updatedAt` e o `lastmod` das páginas alteradas em `.harness/site/site-content.json`.

## Adicionar um trabalho

1. Confirme com o responsável a participação da Custom Mind, o conteúdo e a autorização para expor publicamente o trabalho antes de adicioná-lo ao material público. Registre as fontes aprovadas em `docs/portfolio-evidence.md`. Inventários, candidatos e anotações ainda não aprovados ficam fora do repositório público. Identifique projetos próprios e mantenha os créditos de terceiros.
2. Adicione um objeto em `projects`, com slug único, texto próprio, imagem existente/autorizada e pelo menos uma evidência pública.
3. Defina `category` como `clientes` ou `produtos` e informe `stage` quando houver desenvolvimento, protótipo ou pesquisa. O gerador sincroniza automaticamente as rotas de portfólio em `.harness/site/site-content.json`. Imagem, URL oficial, perfil e evidências públicas são opcionais; sem URL pública, a página oferece contato para conversar sobre a solução. Nunca use links de repositórios privados ou caminhos locais.
4. Execute os comandos abaixo e revise o resultado em desktop, intermediário e celular.

```sh
node scripts/sync-site-chrome.mjs
node scripts/sync-portfolio.mjs
node .harness/sync-seo.mjs
node scripts/sync-site-chrome.mjs --check
node scripts/sync-portfolio.mjs --check
node scripts/audit-unused-assets.mjs
node .harness/harness.mjs check
node .harness/sync-seo.mjs --check
```

O gerador reaproveita o header, o footer e o analytics sincronizados de `clientes/index.html`; todas as páginas atuais do portfólio ficam um nível abaixo da raiz. Se mudar a navegação, rode primeiro o sincronizador compartilhado e depois o gerador do portfólio. O CI detecta divergências.

## Números e resultados

`metrics` é opcional. Cada número exige `value`, `label`, `source` e `asOf`. Contagens de páginas ou imagens descrevem escopo, não vendas ou conversão. Métricas comerciais exigem medição, período comparável e autorização para publicação. Não exponha relatórios privados ou dados de pessoas. Na ausência dessas métricas, descreva as entregas disponíveis em uso, sem percentuais estimados.

Os campos `context` e `approach` devem descrever o que é conhecido. Um site publicado não comprova sozinho o briefing original nem o retorno financeiro.
