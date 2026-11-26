# Plano — Suíte E2E do Sauce Demo

## Arquivos
| Arquivo | Mudança |
|---|---|
| `src/dados/*` | usuários, catálogo (oráculo), clientes, mensagens |
| `src/paginas/*` | Page Objects: Login, Inventario, Produto, Carrinho, CheckoutDados, CheckoutResumo, CheckoutConcluido + Cabecalho |
| `src/suporte/fixtures.ts` | injeta Page Objects; sessão por cookie (`usuarioLogado`) |
| `src/suporte/acoes.ts`, `dinheiro.ts` | preenchimento confirmado; preço → centavos |
| `tests/*.spec.ts` | login, inventario, produto, carrinho, checkout, navegacao, mobile, acessibilidade, defeitos-conhecidos |
| `playwright.config.ts` | 5 projetos e quais specs rodam em cada um |
| `docs/*`, `README.md`, `.github/workflows/e2e.yml` | casos, defeitos, CI com relatório no Pages |

## Passos
1. Observar o site (seletores `data-test`, mensagens, usuários com defeito) com scripts descartáveis.
2. Dados → Page Objects → fixtures → specs (um por funcionalidade).
3. Rodar em todos os projetos com `--workers=4` e `--repeat-each` nos specs instáveis.
4. Lint (regras do eslint-plugin-playwright), typecheck, rastreabilidade, docs e CI.

## Casos de teste
51 casos (CT-LOG 7, INV 6, PRD 3, CAR 5, CHK 6, NAV 5, MOB 5, ACS 3, DEF 11), detalhados em `docs/casos-de-teste.md`.

## Riscos de automação
- **Seletor frágil:** afeta → só `data-test`/role.
- **Espera fixa:** afeta → proibida no lint; asserções web-first.
- **Corrida de navegação:** afeta (URL muda antes do DOM) → Page Object espera elemento exclusivo do destino.
- **Dependência entre testes / dado compartilhado:** não afeta → contexto novo por teste; sessão por cookie.
- **Diferença entre navegadores:** afeta → 5 projetos; WebKit observado com mais cuidado.
- **Mobile:** afeta → `tap()`, `isMobile`, viewport real dos dispositivos.
- **Oráculo:** afeta → catálogo em `src/dados`, cálculo independente do imposto e valor de referência $140.34.
- **Defeito do site vs. erro do teste:** afeta → `test.fail` só para BUG confirmado e documentado.

## Como validar
`npm run lint` · `npm run typecheck` · `npm run docs:verificar` · `npx playwright test --workers=4` ·
`npx playwright test --project=webkit --project=mobile-safari --repeat-each=4`.
