---
name: task
description: Transforma um pedido solto em uma especificação fechada (task.md) de testes E2E no Sauce Demo. Primeiro passo do fluxo task → plano → questionar → feature → revisar.
argument-hint: <descrição do que você quer testar>
disable-model-invocation: true
---

# /task — especificar a tarefa

Pedido do usuário: **$ARGUMENTS**

Objetivo: gerar `.claude/tasks/<slug>/task.md`, curto e sem ambiguidade. **Não escreva código nesta etapa.**

## Passos
1. Escolha um `<slug>` curto em kebab-case (ex.: `filtro-de-ordenacao`).
2. Leia só o necessário: `docs/casos-de-teste.md`, os Page Objects e specs da área.
3. **Observe o site de verdade** antes de afirmar comportamento (seletores `data-test`, mensagens, URL).
   Comportamento do site não se supõe: se não conferiu, registre como suposição.
4. Se faltar informação que **muda o resultado** (fluxo, usuário, dispositivo), pergunte ao usuário.

## Formato do task.md
```markdown
# <título>

## Objetivo
1–3 frases: o que será coberto e por quê (risco para o usuário do site).

## Comportamento esperado
- Regras observáveis com valores exatos (mensagem, URL, contagem, preço em centavos).

## Escopo de execução
Projetos: chromium / firefox / webkit / mobile-chrome / mobile-safari (e por quê).

## Critérios de aceite
- [ ] Dado / quando / então, verificáveis por teste. Inclua caminho feliz, erro e valor-limite.

## Defeitos suspeitos
Comportamentos que parecem bug (viram `test.fail` + BUG-NN se confirmados).

## Fora de escopo
## Suposições
```

Termine dizendo o caminho do arquivo e sugerindo `/plano <slug>`.
