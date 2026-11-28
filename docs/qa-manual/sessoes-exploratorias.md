# Sessões exploratórias

Teste exploratório baseado em sessão (SBTM): cada sessão tem uma **missão** (charter), um timebox planejado de
45 minutos e notas do que foi feito, achado e descartado. As notas abaixo são resumidas, mas mantêm as
**hipóteses descartadas**, porque elas mostram o que foi conferido antes de virar bug.

Formato do charter: *Explorar* \<área\> *com* \<recursos\> *para descobrir* \<informação\>.

Todas as sessões: 2026-11-27, `standard_user` (exceto S4).

---

## S1 — Checkout com dados no limite
**Charter:** explorar o **formulário de checkout e a navegação depois da compra** com **entradas inválidas,
espaços, textos longos e o botão Voltar**, para descobrir **dados ruins que chegam ao pedido**.

**Notas**
- A automação testa campos vazios e válidos. O que fica entre os dois? Espaços, símbolos, texto longo, HTML.
- Três espaços nos três campos → **avança sem erro**. O recibo sai com "SHIP TO" em branco. → **BUG-14**
- CEP `abc!@#` e nome com 150 caracteres → aceitos; nenhum campo tem `maxlength`. → **BUG-15**
- `<b>x</b>` no sobrenome é exibido como texto, não interpretado. ✅ (sem risco de injeção visível)
- Cancel no passo 1 → carrinho; Cancel no passo 2 → lista de produtos. Inconsistente, mas sem regra que diga qual
  é o certo. → **O-06**
- Concluí a compra e apertei Voltar: resumo sem itens com **"Item total: $0"** (sem centavos) logo acima de
  "Tax: $0.00", e Finish ativo. → **BUG-19** (relacionado ao BUG-09)

**Bugs:** BUG-14, BUG-15, BUG-19 · **Observações:** O-06

---

## S2 — Navegação só com teclado
**Charter:** explorar **todas as telas** usando **só o teclado e o DevTools** para descobrir **onde quem não usa
mouse fica preso**.

**Notas**
- Login com Tab e Enter funciona (já coberto pelo CT-LOG-07).
- Na lista de produtos, o Tab vai do menu para a ordenação e **pula o carrinho**. O elemento é um `<a>` sem `href`.
  Conferi em Firefox e WebKit: mesmo comportamento. Sem o carrinho não há como comprar. → **BUG-13**
- Em nenhum momento dá para ver onde está o foco: `outline: none` nos 5 primeiros elementos focáveis. → **BUG-16**
- Formulário do checkout: só placeholder, sem `<label>` nem `aria-label` (o login tem `aria-label`, o checkout não),
  sem `autocomplete`. → **BUG-21**
- Todas as abas se chamam "Swag Labs" e não existe nenhum `h1` nas páginas. → **BUG-22**
- O leitor de tela anunciaria "Cart, 1 items". → **O-04**
- **Hipótese descartada:** o contêiner da mensagem de erro (`.error-message-container`) não tem `role` nem
  `aria-live`, o que sugeria que o erro não seria anunciado. Mas o `h3[data-test=error]` dentro dele tem
  `role="alert"`, no login e no checkout. **Não é bug.** → CTM-LOG-03 e CTM-CHK-07 ✅
- Desvio da missão: ao recarregar uma página interna, o console mostrou um erro 404. Confirmei com `curl` fora do
  navegador: todas as páginas internas respondem 404, e um endereço inexistente mostra tela branca. → **BUG-24**

**Bugs:** BUG-13, BUG-16, BUG-21, BUG-22, BUG-24 · **Observações:** O-04

---

## S3 — Área nova: Dynamic Catalog
**Charter:** explorar **Lazy Load, Spinner e Slider** com **rolagem, espera e mouse parado** para descobrir **como
a área nova se comporta e o que ela deveria fazer**.

**Notas**
- Área nova no menu, sem nenhum teste automatizado e sem nenhuma documentação. Primeiro passo: entender o que existe.
- **Lazy Load:** 8 itens, depois +8 a cada rolagem. Os produtos agora têm tamanhos (XS…XXL), que não existem no
  catálogo principal.
  - Lendo os nomes: "Test.allTheThings() T-Shirt (Red) **(L)**" aparece duas vezes seguidas; na Bolt T-Shirt, o
    tamanho S vem depois do XXL.
  - Depois de 22 itens, a lista recomeça do primeiro, sem fim. Repeti o carregamento: mesma posição. → **BUG-18**
- **Spinner:** indicador por ~3 s, depois os 6 produtos. ✅
- **Slider:** troca de produto a cada ~2 s (medi 6 trocas: 1,94 s a 2,07 s), sem botão de pausa, e não para com o
  mouse em cima. → **BUG-17**
  - **Hipótese descartada:** um print mostrou o nome de um produto com a foto de outro. Era o print no meio da
    transição (o texto troca antes da imagem). Esperando a animação terminar, eles batem. **Não é bug**; refiz a evidência.
- Os pontos do slider funcionam (6º ponto → Fleece Jacket). ✅
- Nenhum card dessa área é clicável nem tem "Add to cart". → **O-07**

**Bugs:** BUG-17, BUG-18 · **Observações:** O-07

---

## S4 — FQA visual: visual_user vs referência
**Charter:** explorar **produtos e carrinho do `visual_user`** **lado a lado com o `standard_user`** para descobrir
**todo desvio visual**, como num FQA contra o Figma.

**Notas**
- Sem Figma, a referência é a tela do `standard_user`: mesma janela de 1280×720, mesma página, mesmo produto no
  carrinho.
- Comparação elemento por elemento, de cima para baixo e da esquerda para a direita:
  1. carrinho deslocado ~190 px e girado; 2. menu girado; 3. foto de cachorro no lugar da mochila;
  4. preços diferentes (já é o BUG-07); 5. dois nomes recuados; 6. botão saindo do card; 7. Checkout no topo da tela.
- Ponto 4: o preço **muda a cada carregamento** ($42.7, depois $19.68) e às vezes tem uma casa decimal só.
  Detalhe novo, mas é o mesmo defeito do BUG-07, então anotei lá em vez de abrir outro número.
- Resumo do checkout do `visual_user`: valores certos ($29.99 + $2.40 = $32.39). Ou seja, a lista anuncia um preço
  e o pedido cobra outro (BUG-07).

**Bugs:** BUG-20 (7 desvios em um relatório, como num FQA)

---

## S5 — Recibo em PDF e mobile
**Charter:** explorar o **botão "Generate PDF order"** e as **páginas novas no celular** com **dados no limite e
aparelhos emulados** para descobrir **erros no documento gerado e problemas de toque**.

**Notas**
- Botão novo na tela de pedido concluído. Baixa `swag-labs-order-<data>_<hora>.pdf`.
- Conteúdo conferido contra o resumo: itens, subtotal, imposto e total corretos com 1 e 2 itens. ✅
- Nome do cliente e CEP aparecem como digitados; um nome de 150 caracteres quebra linha sem cortar. ✅
- Com os campos só com espaços (BUG-14), o "SHIP TO" sai em branco: evidência forte para o BUG-14.
- Nome do arquivo `…_14-44-02.pdf` × conteúdo "11:44 AM": UTC num, hora local no outro. E não existe número de pedido.
  → **BUG-25**
- Mobile: sem rolagem horizontal no Lazy Load (Pixel 7 e iPhone 15). ✅
- Botão de menu 20×20 px e pontos do slider 10×10 px, com 10 px entre eles. → **BUG-23**

**Bugs:** BUG-23, BUG-25

---

## Métricas das sessões
| Sessão | Área | Bugs | Observações | Hipóteses descartadas |
|---|---|---|---|---|
| S1 | Checkout | 3 | 1 | 0 |
| S2 | Teclado e acessibilidade | 5 | 1 | 1 |
| S3 | Dynamic Catalog | 2 | 1 | 1 |
| S4 | Visual | 1 (7 desvios) | 0 | 0 |
| S5 | Recibo e mobile | 2 | 0 | 0 |
| **Total** | | **13** | **3** | **2** |

As outras 4 observações (O-01, O-02, O-03, O-05) vieram dos casos roteirizados de login, produtos e carrinho.
