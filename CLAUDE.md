# QA Lab — E2E com Playwright

Automação E2E do site público **Sauce Demo** (https://www.saucedemo.com), que é o sistema sob teste.
O site não é nosso: não dá para mudar o código dele, só testar. Tudo em português (código, docs, commits).

## Stack
Node 20+ · Playwright Test · TypeScript (strict) · @axe-core/playwright · ESLint (typescript-eslint + eslint-plugin-playwright) · GitHub Actions + Pages.

## Comandos
| Comando | Uso |
|---|---|
| `npm test` | Suíte completa nos 5 projetos (chromium, firefox, webkit, mobile-chrome, mobile-safari) |
| `npm run test:chromium` | Só desktop Chrome (mais rápido para desenvolver) |
| `npm run test:mobile` | Só Pixel 7 e iPhone 15 |
| `npx playwright test -g "CT-CHK"` | Um grupo de casos |
| `npm run lint` · `npm run typecheck` | Qualidade do código de teste |
| `npm run docs:verificar` | Rastreabilidade testes × `docs/casos-de-teste.md` (quebra o CI se divergir) |

## Onde fica cada coisa
- `src/paginas/` Page Objects (um por tela) + `componentes/Cabecalho.ts` (menu, carrinho).
- `src/suporte/fixtures.ts` injeta os Page Objects e abre a sessão pelo cookie `session-username` (opção `usuarioLogado`).
- `src/suporte/acoes.ts` ações robustas (`preencherCampo`). `src/suporte/dinheiro.ts` preço → centavos.
- `src/dados/` usuários, catálogo de produtos (oráculo), clientes e mensagens do site.
- `tests/*.spec.ts` um arquivo por funcionalidade. `playwright.config.ts` define qual spec roda em qual projeto.
- `docs/casos-de-teste.md` (CT-XXX-NN) e `docs/relatorio-de-defeitos.md` (BUG-NN).

## Regras que não podem ser quebradas
- Seletores: `getByTestId` (atributo `data-test`) ou `getByRole`. Nunca classe CSS ou XPath.
  Única exceção: `.bm-menu-wrap` (painel da biblioteca de menu, sem `data-test`), em `Cabecalho.ts`.
- Nada de `waitForTimeout`, `force: true` ou `if` dentro de teste (o ESLint barra).
- Asserções web-first (`await expect(locator).toHave...`), que repetem até passar.
- Teste não depende de outro: cada um ganha contexto novo (carrinho e sessão limpos).
- Navegação em Page Object espera um elemento **exclusivo da página de destino** (o site troca a URL antes de trocar o DOM).
- Valores monetários comparados em **centavos inteiros**.
- Defeito do site = teste do comportamento CORRETO marcado com `test.fail` + linha no relatório de defeitos. Nunca "ajustar" o teste para o bug passar.
- Teste *flaky* no CI se investiga pelo trace, não se resolve com mais tentativas. Defeito que depende de tempo vai
  para o relatório como intermitente, sem teste automatizado (teste que falha ao acaso destrói a confiança na suíte).

## Convenções de teste
- Todo teste tem ID no nome: `test('[CT-CHK-05] ...')`. Prefixos: LOG, INV, PRD, CAR, CHK, NAV, MOB, ACS, DEF.
- Teste novo ⇒ linha nova em `docs/casos-de-teste.md` (ID, cenário, técnica ISTQB, prioridade 🔴🟡🟢, projetos).
- `@smoke` no título marca o caminho crítico (`npm run test:smoke`).

## Fluxo de trabalho com skills
Para qualquer mudança não trivial, usar em ordem: `/task` → `/plano` → `/questionar` → `/feature` → `/revisar`.
Os artefatos ficam em `.claude/tasks/<slug>/` (`task.md`, `plano.md`, `questoes.md`, `revisao.md`).
