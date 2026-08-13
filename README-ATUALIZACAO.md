# Custom Mind — pacote atualizado

Pacote reconstruído sobre a arquitetura pública atual do `JiyuHenko/siteOficial`, com foco em home, produtos, clientes, SEO e responsividade.

## Upload manual
Substitua/adicone estes arquivos no repositório. Os diretórios legados `configurator/` e `demo/` não fazem parte deste pacote porque não precisaram de alteração; mantenha-os no repositório se ainda forem usados.

## Principais mudanças
- Hero da home com diagrama mais forte, menos texto comprimido e melhor distribuição de espaço.
- Cards de clientes em carrossel horizontal com scroll-snap no mobile.
- Patrícia Biagioni adicionada em Clientes e à home.
- Páginas de clientes com identidades próprias.
- Sitemap, llms.txt, canonicals, dados estruturados e metadados atualizados.
- CSS/JS consolidados em `assets/css/site.css` e `assets/js/site.js`.

## Compatibilidade
Os URLs legados `products/violet*.html` foram mantidos como redirects `noindex` para evitar 404s. As páginas antigas de qualificação da Jade também permanecem como redirects de compatibilidade.
