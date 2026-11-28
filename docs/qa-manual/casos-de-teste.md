# Casos de teste manuais

Casos roteirizados executados em **2026-11-27** com `standard_user` (exceto onde indicado). Eles complementam os
[casos automatizados](../casos-de-teste.md) (prefixo CT-) e por isso usam o prefixo **CTM-**: nenhum repete o que a
suíte já verifica a cada execução.

A coluna **Automação** registra a decisão sobre cada caso: **Candidato** (deveria virar teste automatizado),
**Manual** (depende de julgamento visual, de tempo ou de um documento gerado) ou **Fora do E2E** (pertence a outra camada).

**Status:** ✅ passou · ❌ falhou (gerou bug) · ⚠️ observação (comportamento discutível, vai como pergunta ao produto,
ver [observações](#observações-sem-bug))

**Técnicas (ISTQB CTFL):** **PE** particionamento de equivalência · **AVL** valor-limite · **TE** transição de estado ·
**SE** suposição de erro · **EXP** exploratório · **ACS** acessibilidade · **VIS** comparação visual com referência

**Resumo:** 38 casos · ✅ 13 · ❌ 18 · ⚠️ 7 → 13 bugs (BUG-13 a BUG-25) e 7 observações.

---

## Login
| ID | Cenário | Passos | Esperado | Técnica | Status | Automação |
|---|---|---|---|---|---|---|
| CTM-LOG-01 | Login com Enter | Digitar usuário e senha, apertar Enter no campo senha | Abre a lista de produtos | ACS | ✅ | Já coberto (CT-LOG-07) |
| CTM-LOG-02 | Espaço antes do usuário | Usuário `" standard_user"` + senha certa | Entra (remove os espaços) ou explica o erro | SE | ⚠️ O-01 | n/a |
| CTM-LOG-03 | Erro anunciado pelo leitor de tela | Login vazio → conferir o papel ARIA da mensagem | Mensagem com `role="alert"` ou `aria-live` | ACS | ✅ | Candidato |

## Produtos
| ID | Cenário | Passos | Esperado | Técnica | Status | Automação |
|---|---|---|---|---|---|---|
| CTM-CAT-01 | Ordenação mantida | Ordenar "Price (high to low)" → abrir um produto → "Back to products" | Ordenação continua a escolhida | TE | ⚠️ O-02 | n/a |
| CTM-CAT-02 | Texto alternativo das imagens | Conferir o `alt` das 6 imagens | Cada `alt` é o nome do produto | ACS | ✅ | Candidato |
| CTM-CAT-03 | Links do rodapé | Conferir X, Facebook, LinkedIn, Terms of Service e Privacy Policy | Abrem em nova aba com `rel="noreferrer"`; termos e privacidade são links | EXP | ⚠️ O-03 | n/a |

## Carrinho
| ID | Cenário | Passos | Esperado | Técnica | Status | Automação |
|---|---|---|---|---|---|---|
| CTM-CAR-01 | Chegar ao carrinho só com teclado | Adicionar produto → Tab desde o topo (Chromium, Firefox, WebKit) | Carrinho recebe foco e abre com Enter | ACS | ❌ [BUG-13](bugs/BUG-13.md) | Candidato |
| CTM-CAR-02 | Nome acessível do carrinho | Ler o `aria-label` com 0 e 1 item | "Cart, empty" / "Cart, 1 item" | ACS | ⚠️ O-04 | n/a |
| CTM-CAR-03 | Alterar quantidade | Na página do carrinho, tentar mudar a quantidade | Campo editável ou botões +/− | EXP | ⚠️ O-05 | n/a |

## Checkout
| ID | Cenário | Passos | Esperado | Técnica | Status | Automação |
|---|---|---|---|---|---|---|
| CTM-CHK-01 | Campos só com espaços | 3 espaços em nome, sobrenome e CEP → Continue | "Error: First Name is required" | PE, SE | ❌ [BUG-14](bugs/BUG-14.md) | Candidato |
| CTM-CHK-02 | CEP com letras e símbolos | CEP `abc!@#` → Continue | Mensagem de CEP inválido | PE | ❌ [BUG-15](bugs/BUG-15.md) | Candidato* |
| CTM-CHK-03 | Nome muito longo | Nome com 150 caracteres → Continue | Limite no campo ou mensagem | AVL | ❌ [BUG-15](bugs/BUG-15.md) | Candidato* |
| CTM-CHK-04 | Rótulos e preenchimento automático | Preencher os 3 campos; conferir `<label>`, `aria-label` e `autocomplete` | Rótulo visível depois de preencher; `autocomplete` correto | ACS | ❌ [BUG-21](bugs/BUG-21.md) | Candidato |
| CTM-CHK-05 | Cancel nos dois passos | Cancel no passo 1; Cancel no passo 2 (resumo) | Os dois voltam ao mesmo lugar (carrinho) | TE | ⚠️ O-06 | n/a |
| CTM-CHK-06 | Voltar depois de concluir | Concluir pedido → botão Voltar do navegador | Não exibe resumo zerado com Finish ativo | TE | ❌ [BUG-19](bugs/BUG-19.md) | Candidato |
| CTM-CHK-07 | Erro de campo anunciado | Continue com tudo vazio → papel ARIA da mensagem | `role="alert"` | ACS | ✅ | Candidato |

\* Depois que o produto definir o formato do CEP.

## Recibo em PDF
Botão **Generate PDF order**, na tela de pedido concluído (funcionalidade sem cobertura automatizada).

| ID | Cenário | Passos | Esperado | Técnica | Status | Automação |
|---|---|---|---|---|---|---|
| CTM-REC-01 | Valores do recibo | Comprar 1 item e depois 2 itens → gerar PDF | Itens, subtotal, imposto (8%) e total iguais ao resumo | EXP | ✅ | Manual |
| CTM-REC-02 | Dados do cliente | Nome "Ana Teste", CEP "01001-000" | Aparecem como digitados em "SHIP TO" | EXP | ✅ | Manual |
| CTM-REC-03 | Hora do recibo | Comparar hora do conteúdo com a do nome do arquivo | Mesmo horário (ou fuso explícito) | SE | ❌ [BUG-25](bugs/BUG-25.md) | Manual |
| CTM-REC-04 | Nome longo no recibo | Nome com 150 caracteres → gerar PDF | Quebra de linha sem cortar texto | AVL | ✅ | Manual |
| CTM-REC-05 | Identificação do pedido | Procurar número ou código do pedido | Recibo identifica o pedido | EXP | ❌ [BUG-25](bugs/BUG-25.md) | Manual |

## Catálogo dinâmico
Área nova do menu (**Dynamic Catalog**: Lazy Load, Spinner, Slider), sem cobertura automatizada.

| ID | Cenário | Passos | Esperado | Técnica | Status | Automação |
|---|---|---|---|---|---|---|
| CTM-DIN-01 | Lazy Load carrega ao rolar | Abrir e rolar até o fim | Novos itens a cada rolagem | EXP | ✅ | Candidato |
| CTM-DIN-02 | Lazy Load sem repetição | Rolar 3 levas e ler os nomes | Cada produto/tamanho uma vez; lista termina | EXP | ❌ [BUG-18](bugs/BUG-18.md) | Candidato |
| CTM-DIN-03 | Spinner | Abrir a página e observar | Indicador de carregamento e depois os 6 produtos | EXP | ✅ (~3 s) | Manual |
| CTM-DIN-04 | Slider pode ser pausado | Parar o mouse sobre o card; procurar controle de pausa | Pausa no hover ou botão de pausa | ACS | ❌ [BUG-17](bugs/BUG-17.md) | Manual (tempo) |
| CTM-DIN-05 | Pontos do slider | Clicar no 6º ponto | Mostra o 6º produto (Fleece Jacket) | EXP | ✅ | Candidato |
| CTM-DIN-06 | Itens levam ao produto | Clicar num card do catálogo dinâmico | Abre o detalhe ou permite comprar | EXP | ⚠️ O-07 | n/a |

## Navegação e técnico
| ID | Cenário | Passos | Esperado | Técnica | Status | Automação |
|---|---|---|---|---|---|---|
| CTM-NAV-01 | Status HTTP das páginas internas | `curl` em `/cart.html` (e outras 3) | 200 | SE | ❌ [BUG-24](bugs/BUG-24.md) | Fora do E2E |
| CTM-NAV-02 | Endereço inexistente | Abrir `/pagina-inexistente.html` | Página "não encontrada" com link de volta | SE | ❌ [BUG-24](bugs/BUG-24.md) | Candidato |
| CTM-NAV-03 | Título da aba | Abrir 5 páginas e ler o título | Título específico por página | ACS | ❌ [BUG-22](bugs/BUG-22.md) | Candidato |
| CTM-NAV-04 | Duração da sessão | Ler a validade do cookie `session-username` ao entrar | Documentada | EXP | ✅ (10 min) | n/a |

## Acessibilidade
| ID | Cenário | Passos | Esperado | Técnica | Status | Automação |
|---|---|---|---|---|---|---|
| CTM-ACS-01 | Foco visível | Tab pelos 5 primeiros elementos de Produtos | Elemento focado destacado | ACS | ❌ [BUG-16](bugs/BUG-16.md) | Manual |
| CTM-ACS-02 | Cabeçalhos da página | Listar `h1`–`h6` em Produtos, Carrinho e Checkout | Um `h1` por página | ACS | ❌ [BUG-22](bugs/BUG-22.md) | Candidato |

## Visual
Comparação com a referência (`standard_user`), como num FQA contra o Figma. Detalhes no [BUG-20](bugs/BUG-20.md).

| ID | Cenário | Passos | Esperado | Técnica | Status | Automação |
|---|---|---|---|---|---|---|
| CTM-VIS-01 | Produtos: `visual_user` × referência | Mesma janela, lado a lado | Igual à referência | VIS | ❌ [BUG-20](bugs/BUG-20.md) (6 desvios) | Manual |
| CTM-VIS-02 | Carrinho: `visual_user` × referência | Mesmo item, lado a lado | Igual à referência | VIS | ❌ [BUG-20](bugs/BUG-20.md) (1 desvio) | Manual |
| CTM-VIS-03 | Resumo do `visual_user` | Comprar a mochila e ver o resumo | Valores do catálogo ($29.99 + $2.40 = $32.39) | VIS | ✅ (a lista mostra outro preço: BUG-07) | Já coberto (CT-DEF-07) |

## Mobile
Pixel 7 (Chromium) e iPhone 15 (WebKit), emulados.

| ID | Cenário | Passos | Esperado | Técnica | Status | Automação |
|---|---|---|---|---|---|---|
| CTM-MOB-01 | Sem rolagem horizontal na página nova | Abrir Lazy Load (e Produtos, como controle) | Conteúdo cabe na largura | EXP | ✅ | Candidato |
| CTM-MOB-02 | Tamanho dos alvos de toque | Medir botão do menu e pontos do slider | ≥ 24×24 px | ACS | ❌ [BUG-23](bugs/BUG-23.md) | Candidato |

---

## Observações (sem bug)
Comportamentos que não violam uma regra clara. Vão como **pergunta ao produto**, não como defeito, porque abrir bug
sem oráculo gera discussão em vez de correção.

| # | Observação | Pergunta ao produto |
|---|---|---|
| O-01 | `" standard_user"` (com espaço antes) é recusado com "Username and password do not match", sem dizer que o problema é o espaço. | O login deve remover espaços nas pontas? Usuários que colam o login costumam trazer espaço junto. |
| O-02 | A ordenação volta para "Name (A to Z)" depois de visitar um produto. | A escolha deveria persistir durante a sessão? |
| O-03 | "Terms of Service" e "Privacy Policy" no rodapé são texto, não links. | Os documentos existem? Numa loja real, o link para a política de privacidade costuma ser obrigatório. |
| O-04 | O leitor de tela anuncia o carrinho como "Cart, 1 items" (plural com 1). | Ajustar para "1 item"? (texto) |
| O-05 | A quantidade no carrinho é fixa em 1; para levar 2, não há como. | É limitação intencional da loja? |
| O-06 | Cancel no passo 1 volta ao carrinho; Cancel no resumo (passo 2) vai para a lista de produtos. | Qual é o destino esperado? A inconsistência confunde quem quer só corrigir um dado. |
| O-07 | Os cards do Dynamic Catalog não são clicáveis e não têm "Add to cart". | A área é só vitrine? Se for, falta dizer isso ao usuário. |
