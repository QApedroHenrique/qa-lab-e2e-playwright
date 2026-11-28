# Plano — Estudo de caso de QA manual

## Arquivos
| Arquivo | Mudança |
|---|---|
| `docs/qa-manual/README.md` | Estudo de caso: resumo, achados, decisão de automação, recomendação |
| `docs/qa-manual/plano-de-teste.md` | Plano de teste |
| `docs/qa-manual/casos-de-teste.md` | Casos manuais (CTM-XXX-NN) com status da execução |
| `docs/qa-manual/sessoes-exploratorias.md` | Charters e notas das sessões |
| `docs/qa-manual/checklist.md` | Checklist com o resultado desta rodada |
| `docs/qa-manual/bugs/BUG-13.md` … `BUG-25.md` | Um bug report por arquivo |
| `docs/qa-manual/evidencias/` | Prints anotados e recibos PDF |
| `docs/relatorio-de-defeitos.md` | Aponta para os bugs do estudo manual (sem linha na tabela) |
| `README.md`, `CLAUDE.md` | Link para o estudo e onde ficam os arquivos |

## Passos
1. Sessões exploratórias por área de risco (checkout, teclado, catálogo dinâmico, visual, recibo/mobile).
2. Confirmar cada suspeita em mais de um navegador ou mais de uma execução antes de virar bug.
3. Gerar evidências anotadas e conferir cada imagem (a evidência não pode sugerir um defeito que não existe).
4. Escrever plano, casos, bugs, checklist e o resumo do estudo.
5. Rodar `npm run docs:verificar` para confirmar que a rastreabilidade da automação não quebrou.

## Numeração
- Casos manuais usam o prefixo **CTM-** para não se misturarem com os automatizados (CT-) verificados no CI.
- Bugs continuam a numeração do projeto (**BUG-13 em diante**), mas ficam em `docs/qa-manual/bugs/` e não na tabela
  de `docs/relatorio-de-defeitos.md`: aquela tabela só lista defeitos monitorados por teste, e o script de
  rastreabilidade exige isso. Quando um bug manual for automatizado, a linha dele passa para a tabela.

## Riscos
- **Evidência enganosa:** print tirado no meio de animação. Esperar a transição terminar antes de capturar.
- **Hipótese não confirmada virar bug:** checar o atributo/comportamento real antes de escrever.
- **Duplicar defeito conhecido:** comparar com BUG-01 a BUG-12 e referenciar em vez de repetir.
- **Site muda:** registrar data e ambiente em cada bug.

## Como validar
`npm run docs:verificar` · `npm run lint` · conferir todos os links relativos dos `.md`.
