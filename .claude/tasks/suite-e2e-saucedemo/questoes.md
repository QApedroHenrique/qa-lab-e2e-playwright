# Questões — suite-e2e-saucedemo

| # | Ponto | Impacto | Severidade | Decisão |
|---|---|---|---|---|
| 1 | **CT-INV-03 compara a tela com uma cópia ordenada da própria tela.** Se um produto sumisse ou duplicasse, a ordenação continuaria "correta" e o teste passaria | falso positivo | 🔴 | Conferir também que o conjunto exibido é exatamente o catálogo (`src/dados/produtos.ts`). |
| 2 | **WebKit perde texto digitado e cliques logo após a página aparecer** (observado: "First Name is required" com o campo enviado vazio; menu que abre e fecha sozinho) | instabilidade | 🔴 | `preencherCampo` confirma o valor; navegação espera elemento do destino; o menu clica **uma vez** (repetir o clique o fecha). Resta 1 caso intermitente só em WebKit **no Windows** sob 4 workers: aceito, o CI roda em Linux com 1 nova tentativa e o relatório marca como *flaky*. |
| 3 | **CT-DEF-08 passou uma vez sem o bug ter sumido.** O site trava a página durante o atraso e o `click()` só retorna depois dele, então o timeout da asserção começava a contar tarde demais | falso negativo no defeito | 🔴 | Cronômetro explícito antes do clique; tempo medido anexado ao relatório. Medido: ~5,1 s em 6 de 6 execuções. |
| 4 | Um `test.fail` "passa" com qualquer falha, inclusive seletor quebrado, e aí o defeito poderia ter sido corrigido sem ninguém perceber | falso positivo | 🟡 | Os seletores usados nos CT-DEF são os mesmos dos testes do `standard_user` (que precisam passar); CT-DEF-09 e 10 conferem primeiro a parte que funciona. |
| 5 | O CT-CHK-05 usa a mesma fórmula de imposto que poderia estar errada | oráculo | 🟡 | CT-CHK-06 confere o total com valores escritos à mão ($129.94 / $10.40 / $140.34). |
| 6 | Login por cookie pula a tela de login na maioria dos testes | cobertura | 🟢 | A tela é coberta por CT-LOG-01 a 07 e CT-MOB-05; o atalho deixa o resto mais rápido e estável. |
| 7 | O site é público e pode mudar ou sair do ar | uso | 🟢 | Execução diária agendada no CI; falha de rede aparece como *flaky*/erro, não como BUG. |
| 8 | axe-core cobre só parte da WCAG (o que dá para verificar automaticamente) | cobertura | 🟢 | Documentado; CT-LOG-07 cobre o login só com teclado. |
