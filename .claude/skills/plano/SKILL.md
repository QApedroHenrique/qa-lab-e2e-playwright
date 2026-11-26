---
name: plano
description: Gera o plano de ação (plano.md) a partir do task.md de uma tarefa de testes E2E. Segundo passo do fluxo.
argument-hint: <slug da task>
disable-model-invocation: true
---

# /plano — plano de ação

Task: `.claude/tasks/$ARGUMENTS/task.md` (sem argumento: pasta mais recente em `.claude/tasks/`).

Objetivo: gerar `.claude/tasks/<slug>/plano.md`. **Não altere código nesta etapa.**

## Passos
1. Leia o `task.md` e **apenas** os arquivos que serão tocados.
2. Planeje na ordem: dados (`src/dados`) → Page Objects/componentes → fixtures → specs → config de projetos → docs.
3. Reaproveite Page Objects existentes. Método novo só se o teste ficar mais legível.
4. Para cada critério de aceite, defina o caso: próximo ID livre do prefixo, técnica ISTQB, prioridade e projetos.

## Formato do plano.md
```markdown
# Plano — <título>

## Arquivos
| Arquivo | Mudança |

## Passos
1. ... (pequenos e verificáveis)

## Casos de teste
| ID | Cenário | Técnica | Prioridade | Projetos | Arquivo |

## Riscos de automação
Para cada item, "afeta" ou "não afeta" + como será tratado:
seletor frágil · espera por tempo fixo · corrida de navegação (URL muda antes do DOM) ·
dependência entre testes · dado compartilhado · diferença entre navegadores · mobile (toque, viewport) ·
oráculo (de onde vem o valor esperado) · defeito do site vs. erro do teste.

## Como validar
Comandos exatos (`npx playwright test -g "CT-XXX" --repeat-each=5`, `npm run lint`, `npm run typecheck`, `npm run docs:verificar`).
```

Termine sugerindo `/questionar <slug>`.
