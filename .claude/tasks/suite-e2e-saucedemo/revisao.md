# Revisão — suite-e2e-saucedemo

**Veredito:** aprovado

## Checklist
1. **Critérios de aceite:** todos têm teste; cada asserção falharia se o comportamento quebrasse (CT-INV-03 também compara com o catálogo).
2. **Oráculo:** preços e nomes de `src/dados`, imposto recalculado em centavos, total de referência escrito à mão (CT-CHK-06).
3. **Estabilidade:** sem `waitForTimeout`/`force` (ESLint); navegação espera a página de destino; `preencherCampo` confirma o valor;
   `abrirMenu` espera o menu assentar (BUG-12). Testes do menu: 160/160 com 6 workers e `--repeat-each=10`.
4. **Page Objects:** `data-test`/role, com uma exceção documentada (`.bm-menu-wrap`); regras de negócio ficam nos testes.
5. **Isolamento:** contexto novo por teste; sessão por cookie; nenhum teste depende de outro.
6. **Defeitos:** 11 `test.fail` com BUG-NN no relatório (verificado por script); BUG-12 intermitente documentado sem teste, com motivo.
7. **Rastreabilidade:** 51 casos = 51 documentados.
8. **Escopo:** sem `test.only`, `console.log` ou código morto.

## Histórico
- 1ª revisão: aprovado com ressalvas (CT-NAV-05 intermitente em WebKit, atribuído ao Windows).
- 1º CI: 2 testes *flaky* (WebKit e iPhone), provando que não era só Windows → investigação pelo trace → BUG-12 → correção do `abrirMenu`.

## Ressalvas
| Severidade | Arquivo | Problema | Cenário | Correção sugerida |
|---|---|---|---|---|
| 🟢 | `tests/defeitos-conhecidos.spec.ts` | `test.fail` aceita qualquer falha | Seletor quebrado mascararia a correção de um bug | Mitigado: os mesmos seletores são exercitados pelos testes do `standard_user`. |
