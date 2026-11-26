# Suíte E2E do Sauce Demo (desktop e mobile)

## Objetivo
Cobrir os fluxos que um cliente de e-commerce usa (login, vitrine, carrinho, checkout, menu) em 3 navegadores
desktop e 2 celulares emulados, com acessibilidade automatizada e os defeitos reais do site documentados.

## Comportamento esperado (observado no site em 2026-11-26)
- Login: 6 usuários públicos, senha `secret_sauce`. Mensagens exatas em `src/dados/mensagens.ts`.
  Acesso direto a página interna sem sessão → volta ao login com "You can only access '<caminho>'...".
- Vitrine: 6 produtos; preços em `src/dados/produtos.ts` (centavos). Ordenação `az`, `za`, `lohi`, `hilo`.
- Checkout: nome, sobrenome e CEP obrigatórios; imposto de **8%**; com os 6 itens: subtotal $129.94, imposto $10.40, total **$140.34**.
- Sessão no cookie `session-username`; carrinho no `localStorage` (`cart-contents`).

## Escopo de execução
- chromium: tudo (inclui acessibilidade e defeitos, que são do site e não do navegador).
- firefox, webkit: fluxos funcionais.
- mobile-chrome (Pixel 7), mobile-safari (iPhone 15): fluxos funcionais + layout e toque.

## Critérios de aceite
- [ ] Login válido, inválidos (tabela de decisão), bloqueado, acesso sem sessão, teclado.
- [ ] Vitrine: dados do catálogo, 4 ordenações, adicionar/remover e contador.
- [ ] Detalhe dos 6 produtos igual à lista; adicionar/remover pelo detalhe.
- [ ] Carrinho: itens, remoção, continuar comprando, persistência ao recarregar.
- [ ] Checkout: fluxo completo, campos obrigatórios, cancelar, valores com 1, 3 e 6 itens.
- [ ] Menu: logout encerra sessão, reset, navegação, link externo.
- [ ] Mobile: sem rolagem horizontal, uma coluna, menu e compra por toque.
- [ ] WCAG 2.1 A/AA sem violações nas 7 telas.
- [ ] Defeitos reproduzíveis com `test.fail` + BUG-NN.

## Defeitos suspeitos (confirmados na observação)
problem_user (imagens, ordenação, botões, sobrenome), error_user (checkout sem sobrenome, Finish),
visual_user (preços), performance_glitch_user (~5 s), carrinho vazio no checkout, reset sem atualizar botões,
produto inexistente com preço "$√-1".

## Fora de escopo
Teste visual por screenshot (o site muda e a renderização varia por SO), carga/performance além do BUG-08, API.

## Suposições
O site público pode mudar sem aviso: a execução diária no CI serve para detectar isso.
