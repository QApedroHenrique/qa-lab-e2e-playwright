# Estudo de caso de QA manual (FQA) do Sauce Demo

## Objetivo
Mostrar o trabalho de QA que não é script: planejar, explorar, comparar com uma referência visual e escrever
bug reports que um time consiga reproduzir. O foco é o que a suíte automatizada **não vê**: acessibilidade por
teclado, layout, conteúdo, dados no limite, recibo em PDF e a área nova "Dynamic Catalog".

## Comportamento esperado (oráculos, já que não há especificação nem Figma)
- **Referência visual:** a tela do `standard_user` faz o papel do design aprovado; o `visual_user` é comparado com ela.
- **Regras de negócio:** as mesmas da suíte E2E (`src/dados/`), como imposto de 8% e campos obrigatórios no checkout.
- **Acessibilidade:** WCAG 2.2 nível AA, com verificação manual do que o axe-core não cobre.
- **Convenções de e-commerce:** campo obrigatório não aceita valor vazio disfarçado, recibo identifica o pedido,
  conteúdo em movimento pode ser pausado.

## Escopo de execução
Chromium desktop 1280×720 como principal. Firefox e WebKit para confirmar achados de teclado.
Pixel 7 e iPhone 15 (emulados) para layout e alvos de toque.

## Critérios de aceite
- [ ] Plano de teste com escopo, riscos, abordagem, oráculos, critérios de entrada/saída e severidade × prioridade.
- [ ] Casos de teste manuais executados, com status real e ligação ao bug.
- [ ] Sessões exploratórias com charter e notas, incluindo hipóteses descartadas.
- [ ] Bug reports completos (passos, esperado, obtido, evidência anotada, impacto, reprodutibilidade).
- [ ] Checklist reaproveitável com o resultado desta rodada.
- [ ] Para cada bug, decisão justificada: vira teste automatizado ou continua manual.

## Defeitos suspeitos (observados antes de planejar)
Carrinho fora da ordem do Tab; checkout aceita campos só com espaços; foco invisível; slider sem pausa;
Lazy Load repete itens; páginas internas respondem HTTP 404.

## Fora de escopo
Testes de carga, segurança, API, e os 12 defeitos já cobertos pela automação (BUG-01 a BUG-12), exceto quando
um achado novo se relaciona a eles.

## Suposições
O site público pode mudar sem aviso; tudo foi observado em 2026-11-27.
