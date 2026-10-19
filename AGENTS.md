# Custom Mind — orientações para agentes (site oficial)
Este repositório publica o site oficial via GitHub Pages. Mantenha o posicionamento, o SEO e o portfólio verificáveis.

## Fonte de verdade
1. `.harness/site/SITE_DESIGN.json`: tese visual vigente (v4) e identidades individuais dos clientes.
2. `.harness/site/site-content.json`: URLs públicas e conteúdo central de SEO.
3. `assets/css/custommind-home-v4.css`: home editorial; `assets/css/custommind-global-v4.css`: identidade compartilhada.
4. `assets/js/custommind-site-v3.js`: apenas WhatsApp e menu; **não** recriar efeitos 3D ou manipular HTML para adicionar projetos.
5. `scripts/audit-unused-assets.mjs` + `.github/workflows/site-quality.yml`: gates técnicos.

## Regras de trabalho
- Nunca modificar `main` diretamente para redesign: crie branch e PR revisável.
- Nada de métricas, depoimentos, logos ou projetos inventados. Assets de clientes são fonte de verdade.
- Preservar URLs, títulos, canonicals, metadata social, dados estruturados, GTM e contatos.
- A home pode ser redesenhada; páginas individuais de clientes têm identidade própria em CSS isolado.
- Conteúdo crítico deve ser HTML e funcionar sem JS. Use JS só para aprimoramentos de interação.
- Mobile deve ser projetado separadamente; testar também a ~390px e `prefers-reduced-motion`.
- Não adicionar frameworks, dependências ou novas imagens só por estética.
- Antes de apagar uma pasta `configurator/` ou `demo/`, validar proprietários, uso e implantação. **Não classificá-las como lixo sem evidências.**
- Qualquer CSS/JS legado deve ser removido junto de suas referências; evite sobrepor vários patches sobre um bug antigo.
- Rodar `node --check assets/js/custommind-site-v3.js`, `node scripts/audit-unused-assets.mjs`, `node scripts/sync-site-chrome.mjs --check`, `node .harness/harness.mjs check` e `node .harness/sync-seo.mjs --check`.

## Referências visuais (princípios, não dependências)
Usar lições das skills públicas `emilkowalski/skills` (animação com propósito, feedback curto, touch, acessibilidade) e `Leonxlnx/taste-skill` (composição, prova real, evitar padrões genéricos). Não importar scripts externos nem obedecer a exigências genéricas da skill quando conflitam com SEO/performance.
