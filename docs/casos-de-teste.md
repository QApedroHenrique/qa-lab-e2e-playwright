# Casos de teste

Catálogo dos casos automatizados. O ID aparece no nome do teste (`[CT-CHK-05] ...`), então dá para ir do
relatório de execução ao documento e ao código. A consistência entre este arquivo e a suíte é verificada no CI
(`npm run docs:verificar`).

**Resumo:** 51 casos → 293 execuções (casos com várias entradas geram um teste por entrada, e cada teste roda
nos projetos indicados).

**Projetos:** 🖥️ desktop = chromium, firefox e webkit · 📱 mobile = Pixel 7 e iPhone 15 · `C` = só chromium.

### Técnicas (nomenclatura ISTQB CTFL)
**PE** particionamento de equivalência · **AVL** valor-limite · **TD** tabela de decisão · **TE** transição de estado ·
**CU** caso de uso (fluxo ponta a ponta) · **SE** suposição de erro · **ACS** acessibilidade · **COMPAT** compatibilidade

**Prioridade:** 🔴 alta (impede compra ou expõe dado) · 🟡 média · 🟢 baixa

---

## Login — `tests/login.spec.ts`
| ID | Cenário | Técnica | Prioridade | Projetos |
|---|---|---|---|---|
| CT-LOG-01 | Usuário válido entra e vê os 6 produtos | CU | 🔴 | 🖥️ 📱 |
| CT-LOG-02 | 6 combinações inválidas (vazio, senha errada, inexistente, maiúsculas) → mensagem exata | TD, PE | 🔴 | 🖥️ 📱 |
| CT-LOG-03 | Usuário bloqueado não entra | PE | 🔴 | 🖥️ 📱 |
| CT-LOG-04 | Mensagem de erro pode ser fechada | SE | 🟢 | 🖥️ 📱 |
| CT-LOG-05 | Campo de senha mascarado | SE | 🟡 | 🖥️ 📱 |
| CT-LOG-06 | 4 páginas internas sem sessão → login com aviso | PE | 🔴 | 🖥️ 📱 |
| CT-LOG-07 | Login só com teclado (Tab/Enter) | ACS | 🟡 | 🖥️ 📱 |

## Lista de produtos — `tests/inventario.spec.ts`
| ID | Cenário | Técnica | Prioridade | Projetos |
|---|---|---|---|---|
| CT-INV-01 | 6 produtos com nome, descrição, imagem e botão | PE | 🔴 | 🖥️ 📱 |
| CT-INV-02 | Preços exibidos = catálogo | SE | 🔴 | 🖥️ 📱 |
| CT-INV-03 | 4 ordenações, conferindo ordem e que nenhum produto sumiu | PE | 🟡 | 🖥️ 📱 |
| CT-INV-04 | Adicionar troca o botão e incrementa o contador | TE | 🔴 | 🖥️ 📱 |
| CT-INV-05 | Remover decrementa e esconde o contador em zero | TE, AVL | 🟡 | 🖥️ 📱 |
| CT-INV-06 | Todos os 6 produtos no carrinho | AVL | 🟢 | 🖥️ 📱 |

## Detalhe do produto — `tests/produto.spec.ts`
| ID | Cenário | Técnica | Prioridade | Projetos |
|---|---|---|---|---|
| CT-PRD-01 | Para cada um dos 6 produtos, o detalhe mostra o mesmo nome, descrição e preço | PE | 🟡 | 🖥️ 📱 |
| CT-PRD-02 | Adicionar pelo detalhe reflete no contador e na lista | TE | 🟡 | 🖥️ 📱 |
| CT-PRD-03 | Remover pelo detalhe esvazia o carrinho | TE | 🟢 | 🖥️ 📱 |

## Carrinho — `tests/carrinho.spec.ts`
| ID | Cenário | Técnica | Prioridade | Projetos |
|---|---|---|---|---|
| CT-CAR-01 | Itens adicionados com quantidade 1 e preço | CU | 🔴 | 🖥️ 📱 |
| CT-CAR-02 | Remover item atualiza lista e contador | TE | 🟡 | 🖥️ 📱 |
| CT-CAR-03 | "Continue Shopping" mantém os itens | TE | 🟡 | 🖥️ 📱 |
| CT-CAR-04 | Carrinho persiste ao recarregar | SE | 🟡 | 🖥️ 📱 |
| CT-CAR-05 | Remover tudo deixa o carrinho vazio | AVL | 🟢 | 🖥️ 📱 |

## Checkout — `tests/checkout.spec.ts`
| ID | Cenário | Técnica | Prioridade | Projetos |
|---|---|---|---|---|
| CT-CHK-01 | Compra completa até a confirmação; carrinho esvaziado | CU | 🔴 | 🖥️ 📱 |
| CT-CHK-02 | Sem nome / sobrenome / CEP → mensagem exata e não avança | PE | 🔴 | 🖥️ 📱 |
| CT-CHK-03 | "Cancel" nos dados volta ao carrinho sem perder itens | TE | 🟡 | 🖥️ 📱 |
| CT-CHK-04 | "Cancel" no resumo volta à lista sem finalizar | TE | 🟡 | 🖥️ 📱 |
| CT-CHK-05 | 1, 3 e 6 itens: subtotal, imposto de 8% e total corretos | PE, AVL | 🔴 | 🖥️ 📱 |
| CT-CHK-06 | Total de todos os produtos = $140.34 (oráculo escrito à mão) | SE | 🔴 | 🖥️ 📱 |

## Menu e navegação — `tests/navegacao.spec.ts`
| ID | Cenário | Técnica | Prioridade | Projetos |
|---|---|---|---|---|
| CT-NAV-01 | Logout encerra a sessão de verdade | TE | 🔴 | 🖥️ 📱 |
| CT-NAV-02 | "Reset App State" esvazia o carrinho | TE | 🟡 | 🖥️ 📱 |
| CT-NAV-03 | "All Items" volta à lista | CU | 🟢 | 🖥️ 📱 |
| CT-NAV-04 | "About" aponta para saucelabs.com | SE | 🟢 | 🖥️ 📱 |
| CT-NAV-05 | Menu abre e fecha | TE | 🟢 | 🖥️ 📱 |

## Mobile — `tests/mobile.spec.ts`
| ID | Cenário | Técnica | Prioridade | Projetos |
|---|---|---|---|---|
| CT-MOB-01 | 4 páginas sem rolagem horizontal | COMPAT | 🔴 | 📱 |
| CT-MOB-02 | Produtos em uma coluna | COMPAT | 🟡 | 📱 |
| CT-MOB-03 | Menu lateral por toque | COMPAT | 🟡 | 📱 |
| CT-MOB-04 | Compra completa só com toques | CU, COMPAT | 🔴 | 📱 |
| CT-MOB-05 | Login cabe na tela, botão visível sem rolar | COMPAT | 🟡 | 📱 |

## Acessibilidade — `tests/acessibilidade.spec.ts`
| ID | Cenário | Técnica | Prioridade | Projetos |
|---|---|---|---|---|
| CT-ACS-01 | Login sem violações WCAG 2.1 A/AA (axe-core) | ACS | 🟡 | C |
| CT-ACS-02 | Lista, detalhe, carrinho e dados de entrega sem violações | ACS | 🟡 | C |
| CT-ACS-03 | Resumo e confirmação do pedido sem violações | ACS | 🟡 | C |

## Defeitos conhecidos — `tests/defeitos-conhecidos.spec.ts`
Testes do comportamento **correto**, marcados com `test.fail` enquanto o defeito existir.
Detalhes, passos e evidências em [relatorio-de-defeitos.md](relatorio-de-defeitos.md).

| ID | Cenário (comportamento correto) | Defeito | Técnica | Prioridade | Projetos |
|---|---|---|---|---|---|
| CT-DEF-01 | Cada produto tem a sua imagem | BUG-01 | SE | 🟡 | C |
| CT-DEF-02 | Ordenar Z→A reordena | BUG-02 | PE | 🟡 | C |
| CT-DEF-03 | 3 produtos adicionados → contador 3 | BUG-03 | SE | 🔴 | C |
| CT-DEF-04 | Sobrenome fica no campo de sobrenome | BUG-04 | SE | 🔴 | C |
| CT-DEF-05 | Checkout sem sobrenome é bloqueado | BUG-05 | PE | 🔴 | C |
| CT-DEF-06 | "Finish" conclui o pedido | BUG-06 | CU | 🔴 | C |
| CT-DEF-07 | Preços batem com o catálogo | BUG-07 | SE | 🔴 | C |
| CT-DEF-08 | Lista aparece em até 2 s após o login | BUG-08 | AVL | 🟡 | C |
| CT-DEF-09 | Carrinho vazio não pode ser finalizado | BUG-09 | AVL | 🔴 | C |
| CT-DEF-10 | Reset também volta os botões para "Add to cart" | BUG-10 | TE | 🟢 | C |
| CT-DEF-11 | Produto inexistente não exibe preço nem botão de compra | BUG-11 | SE | 🟢 | C |
