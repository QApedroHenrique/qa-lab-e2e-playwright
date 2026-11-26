# Revisão — suite-e2e-saucedemo

**Veredito:** aprovado com ressalvas

## Checklist
1. **Critérios de aceite:** todos têm teste; cada asserção falharia se o comportamento quebrasse (ex.: CT-INV-03 agora também compara com o catálogo).
2. **Oráculo:** preços e nomes de `src/dados`, imposto recalculado em centavos, total de referência escrito à mão (CT-CHK-06).
3. **Estabilidade:** sem `waitForTimeout`/`force` (ESLint); Page Objects esperam elemento exclusivo do destino; `preencherCampo` confirma o valor.
4. **Page Objects:** só `data-test`/role; asserções de regra ficam nos testes.
5. **Isolamento:** contexto novo por teste; sessão por cookie; nenhum teste depende de outro.
6. **Defeitos:** 11 `test.fail`, cada um com BUG-NN no relatório (verificado por script); CT-DEF-08 com cronômetro explícito.
7. **Rastreabilidade:** 51 casos = 51 documentados; `docs:verificar` também cruza BUG-NN.
8. **Escopo:** sem `test.only`, `console.log` ou código morto.

## Ressalvas
| Severidade | Arquivo:linha | Problema | Cenário | Correção sugerida |
|---|---|---|---|---|
| 🟡 | `src/paginas/componentes/Cabecalho.ts` (`abrirMenu`) | CT-NAV-05 intermitente em WebKit/mobile-safari **no Windows** com 4 workers: o menu não abre (ou abre e fecha) | 1 a 2 falhas em 293 execuções locais; 8/8 ao rodar isolado | Confirmar no CI (Linux). Se repetir lá, abrir o menu por teclado (`focus` + `Enter`), que não sofre com a sobreposição animada do menu. |
| 🟢 | `tests/defeitos-conhecidos.spec.ts` | `test.fail` aceita qualquer falha | Seletor quebrado mascararia a correção de um bug | Mitigado: os mesmos seletores são exercitados pelos testes do `standard_user`. |

## Execução (local, Windows, Node 26, Playwright 1.65)
- `npm run lint`, `npm run typecheck`, `npm run docs:verificar`: ok.
- `npx playwright test --workers=4`: **291 passaram, 2 falharam** (CT-NAV-05 em webkit e mobile-safari).
- Chromium isolado: 58 passaram + 11 defeitos confirmados.
