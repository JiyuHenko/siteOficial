# Custom Mind | Site (GitHub Pages)

Este pacote é um site **100% estático** (HTML/CSS/JS) pronto para publicar no **GitHub Pages**.

## Como usar

1. Substitua a logo em `assets/img/logo.png`
2. Edite seu WhatsApp e e-mail em `assets/js/site.js`
3. Suba para um repositório no GitHub (branch `main`)
4. Em **Settings → Pages**, selecione:
   - Source: `Deploy from a branch`
   - Branch: `main` / folder: `/ (root)`

## Domínio próprio (opcional)
Após comprar um domínio, você pode apontar para o GitHub Pages e adicionar um arquivo `CNAME` na raiz com seu domínio.

## Páginas
- `index.html` (institucional + lista de produtos)
- `products/zuri.html`
- `products/violet.html`
- `products/loja-inteligente.html`

> Observação: eu deixei textos profissionais e genéricos.  
> Quando você me mandar sua **logo** e as **landing pages** da Zuri/Violet, eu adapto o visual/texto 100% no seu padrão e te devolvo um novo ZIP.


## Configurador Loja Inteligente (sem backend)
- Acesse `configurator/index.html`
- Configura tema, tenants e módulos
- Persiste em localStorage e permite baixar o JSON `app_config.json`


## Área de Teste (sem backend)
- Acesse `demo/index.html`
- Simula Dashboard, Produtos, Vendas e Registro
- Usa o mesmo JSON do configurador (localStorage)
