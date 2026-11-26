---
name: revisar
description: Revisa a implementação de uma tarefa de testes E2E contra o task.md, o plano e as regras do projeto. Último passo do fluxo.
argument-hint: <slug da task>
disable-model-invocation: true
---

# /revisar — revisão final

Revise o que foi implementado para `.claude/tasks/$ARGUMENTS/` (sem argumento: pasta mais recente).
Base: `git diff`, `task.md` e `plano.md`.

Papel: revisor exigente. Só aponte problemas reais, com arquivo:linha e um cenário concreto.
Não corrija nada sem o usuário pedir.

## Checklist
1. **Critérios de aceite:** cada um tem teste que **falharia** se o comportamento quebrasse?
2. **Oráculo:** valores esperados vêm de `src/dados` ou de cálculo independente, não da própria tela.
3. **Estabilidade:** sem `waitForTimeout`/`force`; navegação espera a página de destino; passou com `--repeat-each=5`.
4. **Page Objects:** seletores `data-test`/role; sem asserção de regra de negócio dentro do Page Object.
5. **Isolamento:** nenhum teste depende de outro ou de dado deixado por outro.
6. **Defeitos:** cada `test.fail` tem BUG-NN no relatório e falha pelo motivo certo (não por seletor quebrado).
7. **Rastreabilidade:** IDs sem repetir, `docs/casos-de-teste.md` atualizado, `npm run docs:verificar` passa.
8. **Escopo:** nada além do pedido; nenhum `test.only`, `console.log` ou código morto.

## Saída
Grave `.claude/tasks/<slug>/revisao.md` e mostre:
```markdown
**Veredito:** aprovado | aprovado com ressalvas | reprovado

| Severidade | Arquivo:linha | Problema | Cenário | Correção sugerida |
```
Se rodou os testes, informe o resultado real. Se não rodou, diga que não rodou.
