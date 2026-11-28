# Questões — Estudo de caso de QA manual

| # | Ponto | Impacto | Severidade | Resolução |
|---|---|---|---|---|
| 1 | "Mensagem de erro não é anunciada por leitor de tela": o contêiner do erro não tem `role` nem `aria-live`. Mas o elemento de dentro pode ter. | Falso positivo | 🔴 | Conferido: o `h3[data-test=error]` tem `role="alert"` no login e no checkout. **Hipótese descartada**, não virou bug. |
| 2 | No slider, o print mostrou nome e imagem de produtos diferentes. Defeito ou print no meio da transição? | Falso positivo | 🔴 | Com 800 ms após a troca, nome e imagem batem. Era a animação (o texto troca antes da imagem). **Descartado**; evidência refeita. |
| 3 | Carrinho fora do Tab pode ser comportamento do Chromium. | Cobertura | 🟡 | Reproduzido em Chromium, Firefox e WebKit (no WebKit com Alt+Tab, que é como o Safari navega por links). |
| 4 | Duplicação no Lazy Load pode ser aleatória. | Reprodutibilidade | 🟡 | 2 de 2 execuções com o mesmo item duplicado na mesma posição. |
| 5 | HTTP 404 nas páginas internas pode ser do navegador automatizado. | Falso positivo | 🟡 | Confirmado com `curl` (sem navegador): `cart.html` → 404, raiz → 200. |
| 6 | O axe-core já roda nessas telas e passa. Os achados de acessibilidade contradizem a suíte? | Contradição | 🟡 | Não: o axe aceita placeholder como nome acessível e não avalia foco visível, ordem de Tab nem movimento automático. O estudo registra isso como limite da automação. |
| 7 | Preço do `visual_user` muda a cada carregamento. Bug novo ou o BUG-07? | Duplicidade | 🟢 | Mesmo defeito do BUG-07; o detalhe novo foi anotado no BUG-20, sem número novo. |
| 8 | Hora do recibo diferente da hora do nome do arquivo: pode ser fuso da máquina. | Falso positivo | 🟢 | É justamente o fuso: o nome usa UTC e o recibo usa a hora local (UTC−3). A inconsistência entre os dois é o defeito. |
