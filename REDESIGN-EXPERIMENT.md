# Site Cookbook Experiment

Branch alvo: `experiment/site-cookbook-v1`

## Visual thesis
Laboratório digital preciso com energia criativa controlada.

## Motion budget
- Signature: CM-S01 Hero Shrink Frame
- Supporting: CM-S05 Depth Case Deck
- Supporting: CM-S09 Contextual Spotlight

## Preserved
- URLs públicas principais
- Canonicals e descrições
- GTM `GTM-MF32WD9H` (somente em HTTP/HTTPS)
- WhatsApp público +55 11 92373-4039
- Produtos, cases e métricas factuais já publicados

## Local preview
`python -m http.server 8080` e abrir `http://localhost:8080/`.

## Asset preservation correction
A primeira passagem do experimento preservou os arquivos na árvore Git, mas deixou de referenciá-los na composição nova. Isso foi tratado como regressão de design. A versão atual reintegra screenshots reais de produto e imagens reais de cases e adiciona um gate de preservação de assets ao Harness.
