# Relatório de defeitos

Defeitos encontrados no **Sauce Demo** (https://www.saucedemo.com) durante a automação, no formato que eu
abriria num Jira. O site tem usuários com defeitos **inseridos de propósito** para treino; ainda assim, cada item
foi reproduzido, isolado e transformado em teste automatizado que monitora o defeito a cada execução
(`tests/defeitos-conhecidos.spec.ts`, marcados com `test.fail`).

**Ambiente:** Chromium (Playwright), desktop 1280×720 · Observado em 2026-11-26 · Senha de todos os usuários: `secret_sauce`.

**Severidade:** 🔴 crítica/alta (impede compra, cobra errado ou burla validação) · 🟡 média · 🟢 baixa (cosmético)

| ID | Resumo | Usuário | Severidade | Teste |
|---|---|---|---|---|
| BUG-01 | Todos os produtos exibem a mesma imagem | `problem_user` | 🟡 | CT-DEF-01 |
| BUG-02 | Ordenação da lista é ignorada | `problem_user` | 🟡 | CT-DEF-02 |
| BUG-03 | Alguns botões "Add to cart" não funcionam | `problem_user` | 🔴 | CT-DEF-03 |
| BUG-04 | Sobrenome digitado vai para o campo "First Name" | `problem_user` | 🔴 | CT-DEF-04 |
| BUG-05 | Checkout avança sem o sobrenome obrigatório | `error_user` | 🔴 | CT-DEF-05 |
| BUG-06 | "Finish" não conclui o pedido | `error_user` | 🔴 | CT-DEF-06 |
| BUG-07 | Preços diferentes do catálogo | `visual_user` | 🔴 | CT-DEF-07 |
| BUG-08 | Lista de produtos leva ~5 s para carregar | `performance_glitch_user` | 🟡 | CT-DEF-08 |
| BUG-09 | Pedido "concluído" com carrinho vazio | `standard_user` | 🔴 | CT-DEF-09 |
| BUG-10 | "Reset App State" não atualiza os botões | `standard_user` | 🟢 | CT-DEF-10 |
| BUG-11 | Produto inexistente mostra preço "$√-1" e botão de compra | `standard_user` | 🟢 | CT-DEF-11 |

> Há ainda o **BUG-12** (intermitente, no fim deste documento). BUG-09, BUG-10 e BUG-11 acontecem com o usuário **padrão**, ou seja, não fazem parte dos usuários "quebrados"
> de propósito: foram achados explorando valores-limite (carrinho vazio, id inexistente) e transições de estado.

---

### BUG-01 — Todos os produtos exibem a mesma imagem
- **Passos:** entrar com `problem_user` → observar a lista.
- **Esperado:** cada produto com a sua foto.
- **Obtido:** as 6 imagens têm o mesmo `src`.
- **Impacto:** cliente não reconhece o produto que está comprando.

### BUG-02 — Ordenação da lista é ignorada
- **Passos:** `problem_user` → "Name (Z to A)".
- **Esperado:** primeiro item "Test.allTheThings() T-Shirt (Red)".
- **Obtido:** lista permanece de A a Z.

### BUG-03 — Alguns botões "Add to cart" não funcionam
- **Passos:** `problem_user` → adicionar Backpack, Bolt T-Shirt e Fleece Jacket.
- **Esperado:** contador = 3.
- **Obtido:** contador = 1; os botões dos demais não mudam. "Remove" também não remove.
- **Impacto:** perda de venda.

### BUG-04 — Sobrenome vai para o campo "First Name"
- **Passos:** `problem_user` → carrinho → Checkout → digitar "Ana" em First Name e "Teste" em Last Name.
- **Esperado:** cada valor no seu campo.
- **Obtido:** First Name = "Teste" (sobrescrito), Last Name vazio; o checkout não avança.
- **Impacto:** cliente não consegue concluir a compra.

### BUG-05 — Checkout avança sem o sobrenome obrigatório
- **Passos:** `error_user` → item no carrinho → Checkout → preencher só First Name e Zip → Continue.
- **Esperado:** "Error: Last Name is required" (como acontece com `standard_user`).
- **Obtido:** vai para o resumo do pedido.
- **Impacto:** validação burlada; pedido com dados incompletos.

### BUG-06 — "Finish" não conclui o pedido
- **Passos:** `error_user` → checkout completo → Finish.
- **Esperado:** página "Thank you for your order!".
- **Obtido:** permanece no resumo; o pedido não é concluído.

### BUG-07 — Preços diferentes do catálogo
- **Passos:** `visual_user` → observar os preços.
- **Esperado:** $29.99, $9.99, $15.99, $49.99, $7.99, $15.99.
- **Obtido:** valores diferentes (ex.: $27.35, $63.19, $79.98…).
- **Impacto:** cobrança diferente do anunciado.

### BUG-08 — Lista de produtos leva ~5 s para carregar
- **Passos:** entrar com `performance_glitch_user`.
- **Esperado:** lista em até 2 s.
- **Obtido:** 5,1 s em 6 de 6 medições; o mesmo atraso ao voltar do detalhe para a lista. A página fica travada no período.

### BUG-09 — Pedido "concluído" com carrinho vazio
- **Passos:** `standard_user` → abrir o carrinho vazio → Checkout → preencher dados → Continue → Finish.
- **Esperado:** botão Checkout desabilitado ou aviso de carrinho vazio.
- **Obtido:** "Thank you for your order!" com zero itens.
- **Impacto:** pedido vazio registrado; confunde o cliente.

### BUG-10 — "Reset App State" não atualiza os botões
- **Passos:** `standard_user` → adicionar Backpack → menu → Reset App State.
- **Esperado:** carrinho vazio e botão "Add to cart".
- **Obtido:** contador some, mas o botão continua "Remove" até recarregar a página.

### BUG-11 — Produto inexistente mostra preço "$√-1"
- **Passos:** `standard_user` → abrir `/inventory-item.html?id=999`.
- **Esperado:** página de "produto não encontrado" sem preço nem botão de compra.
- **Obtido:** título "ITEM NOT FOUND", preço "$√-1" e botão "Add to cart" ativo.

---

## Defeito intermitente (documentado, sem teste automatizado)

### BUG-12 — Menu reaberto logo após fechar fica aberto, porém invisível
- **Usuário:** qualquer · **Severidade:** 🟡 (o usuário fica sem acesso ao menu até recarregar) · **Mais frequente no Safari (WebKit)**
- **Como foi achado:** o teste "o menu abre e fecha" aparecia como *instável* no CI (passava só na 2ª tentativa)
  em WebKit e iPhone. Em vez de aceitar a nova tentativa, o trace da falha foi analisado.
- **Causa observada:** o menu fechado recebe o atributo `hidden` por um temporizador, ~0,3 s depois de a página
  carregar e ~0,4 s depois de o menu ser fechado. Se o menu for aberto dentro dessa janela, o temporizador
  pode disparar depois da abertura: o estado fica "aberto" (`aria-hidden="false"`), mas o painel continua `hidden`.
- **Passos:** abrir o menu → fechar → reabrir em menos de ~0,4 s.
- **Esperado:** o menu aparece.
- **Obtido (medido em 2026-11-26):** WebKit, sem carga: **3 de 5** tentativas com o menu invisível;
  Chromium e Firefox, sem carga: 0 de 5; sob carga (vários testes em paralelo), também ocorre em Chromium e Firefox.
- **Por que não há teste automatizado:** o defeito depende de tempo; qualquer teste dele seria instável em todos os
  navegadores, e um teste que falha ao acaso faz o time parar de confiar na suíte. O defeito fica registrado aqui
  e os Page Objects esperam o menu assentar antes de abrir (como uma pessoa faria), para não herdar a instabilidade.
