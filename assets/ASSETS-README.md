# Assets do site

A pasta `assets/` contém somente arquivos usados pelas superfícies atuais do site ou pelo harness de qualidade.

## Regras de manutenção
- Prefira WebP para imagens raster exibidas no site.
- PNG/JPG ficam apenas quando o formato é necessário (favicon, QR Code ou imagem social/OG).
- Não mantenha cópias com nomes diferentes do mesmo arquivo.
- Antes de adicionar um asset, confirme a referência no HTML/CSS/JS que o consome.
- O CI executa uma auditoria de assets para evitar novos arquivos fantasma.

Os originais históricos continuam recuperáveis pelo Git; não precisam permanecer na árvore de produção.
