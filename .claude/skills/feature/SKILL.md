---
name: feature
description: Implementa uma tarefa de testes E2E seguindo o plano.md aprovado, com Page Objects, specs e documentação. Quarto passo do fluxo.
argument-hint: <slug da task>
disable-model-invocation: true
---

# /feature — implementação

Siga `.claude/tasks/$ARGUMENTS/plano.md` (com `task.md` e `questoes.md` como referência).
Sem argumento: pasta mais recente em `.claude/tasks/`. Se não existir plano, pare e sugira `/task` e `/plano`.

## Regras
- Siga o plano. Se precisar desviar, diga o motivo e atualize o `plano.md`. Nada fora do escopo.
- Respeite as "Regras que não podem ser quebradas" do `CLAUDE.md` (seletores, sem espera fixa, `test.fail` para defeito do site).
- Siga o estilo vizinho: Page Object expõe `Locator`s `readonly` e métodos de ação com nome de negócio;
  asserções ficam no teste, exceto a espera pela página de destino ao navegar.

## Ordem
1. Dados → Page Objects/componentes → fixtures → specs → `playwright.config.ts` (se mudar projetos).
2. Testes com ID no nome (`[CT-XXX-NN]`), caminho feliz, erro e valor-limite; `@smoke` no caminho crítico.
3. Docs: `docs/casos-de-teste.md` (linhas e resumo), `docs/relatorio-de-defeitos.md` se achou BUG, README se mudou contagem.

## Validação (obrigatória)
1. `npx playwright test -g "<prefixos novos>" --repeat-each=5` em todos os projetos afetados (pega instabilidade).
2. `npm run lint`, `npm run typecheck`, `npm run docs:verificar`, `npm test`.

Ao final, informe: arquivos alterados, CTs criados, resultado real dos comandos (cole a falha, se houver).
Sugira `/revisar <slug>`. Não faça commit sem o usuário pedir.
