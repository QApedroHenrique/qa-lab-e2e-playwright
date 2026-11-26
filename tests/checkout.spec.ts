import { test, expect } from '@suporte/fixtures';
import { ALIQUOTA_IMPOSTO, PRODUTOS, TODOS_OS_PRODUTOS, type Produto } from '@dados/produtos';
import { CLIENTE_VALIDO } from '@dados/clientes';
import { MENSAGENS } from '@dados/mensagens';
import { impostoEsperado } from '@suporte/dinheiro';

test.describe('Checkout', () => {
  test('[CT-CHK-01] compra completa: carrinho → dados → resumo → pedido concluído @smoke', async ({
    page,
    inventario,
    carrinho,
    checkoutDados,
    checkoutResumo,
    checkoutConcluido,
  }) => {
    await inventario.abrir();
    await inventario.adicionar(PRODUTOS.mochila, PRODUTOS.lanterna);
    await inventario.cabecalho.abrirCarrinho();
    await carrinho.finalizarCompra();

    await checkoutDados.continuarCom(CLIENTE_VALIDO);
    await expect(page).toHaveURL(/checkout-step-two\.html$/);
    await expect(checkoutResumo.nomes).toHaveText([PRODUTOS.mochila.nome, PRODUTOS.lanterna.nome]);
    await expect(checkoutResumo.pagamento).toHaveText('SauceCard #31337');
    await expect(checkoutResumo.entrega).toHaveText('Free Pony Express Delivery!');

    await checkoutResumo.finalizar();

    await expect(page).toHaveURL(/checkout-complete\.html$/);
    await expect(checkoutConcluido.titulo).toHaveText(MENSAGENS.pedidoConcluido);
    await expect(checkoutConcluido.cabecalho.contadorCarrinho).toBeHidden(); // carrinho esvaziado

    await checkoutConcluido.botaoVoltar.click();
    await expect(page).toHaveURL(/\/inventory\.html$/);
  });

  test.describe('dados de entrega', () => {
    test.beforeEach(async ({ inventario, carrinho }) => {
      await inventario.abrir();
      await inventario.adicionar(PRODUTOS.macacao);
      await carrinho.abrir();
      await carrinho.finalizarCompra();
    });

    const camposObrigatorios = [
      { campo: 'nome', dados: { sobrenome: 'Teste', cep: '01310-100' }, mensagem: MENSAGENS.nomeObrigatorio },
      { campo: 'sobrenome', dados: { nome: 'Ana', cep: '01310-100' }, mensagem: MENSAGENS.sobrenomeObrigatorio },
      { campo: 'CEP', dados: { nome: 'Ana', sobrenome: 'Teste' }, mensagem: MENSAGENS.cepObrigatorio },
    ];

    for (const { campo, dados, mensagem } of camposObrigatorios) {
      test(`[CT-CHK-02] sem ${campo}: mostra erro e não avança`, async ({ page, checkoutDados }) => {
        await checkoutDados.continuarCom(dados);

        await expect(checkoutDados.mensagemErro).toHaveText(mensagem);
        await expect(page).toHaveURL(/checkout-step-one\.html$/);
      });
    }

    test('[CT-CHK-03] "Cancel" nos dados volta para o carrinho sem perder itens', async ({ page, checkoutDados, carrinho }) => {
      await checkoutDados.botaoCancelar.click();

      await expect(page).toHaveURL(/\/cart\.html$/);
      await expect(carrinho.nomes).toHaveText([PRODUTOS.macacao.nome]);
    });

    test('[CT-CHK-04] "Cancel" no resumo volta para a lista sem finalizar a compra', async ({
      page,
      checkoutDados,
      checkoutResumo,
      inventario,
    }) => {
      await checkoutDados.continuarCom(CLIENTE_VALIDO);
      await expect(checkoutResumo.botaoFinalizar).toBeVisible(); // o passo 1 também tem um "Cancel"
      await checkoutResumo.botaoCancelar.click();

      await expect(page).toHaveURL(/\/inventory\.html$/);
      await expect(inventario.cabecalho.contadorCarrinho).toHaveText('1');
    });
  });

  // Particionamento por quantidade de itens: 1, vários e todos (com total conhecido de $140.34)
  const carrinhos: { descricao: string; produtos: Produto[] }[] = [
    { descricao: '1 item', produtos: [PRODUTOS.macacao] },
    { descricao: '3 itens', produtos: [PRODUTOS.mochila, PRODUTOS.camiseta, PRODUTOS.camisetaVermelha] },
    { descricao: 'todos os 6 itens', produtos: TODOS_OS_PRODUTOS },
  ];

  for (const { descricao, produtos } of carrinhos) {
    test(`[CT-CHK-05] ${descricao}: subtotal, imposto de 8% e total estão corretos`, async ({
      inventario,
      carrinho,
      checkoutDados,
      checkoutResumo,
    }) => {
      await inventario.abrir();
      await inventario.adicionar(...produtos);
      await carrinho.abrir();
      await carrinho.finalizarCompra();
      await checkoutDados.continuarCom(CLIENTE_VALIDO);

      const subtotalEsperado = produtos.reduce((soma, p) => soma + p.precoCentavos, 0);
      const impostoCalculado = impostoEsperado(subtotalEsperado, ALIQUOTA_IMPOSTO);
      const { subtotal, imposto, total } = await checkoutResumo.valores();

      expect(subtotal).toBe(subtotalEsperado);
      expect(imposto).toBe(impostoCalculado);
      expect(total).toBe(subtotalEsperado + impostoCalculado);
    });
  }

  test('[CT-CHK-06] o total de todos os produtos é exatamente $140.34', async ({
    inventario,
    carrinho,
    checkoutDados,
    checkoutResumo,
  }) => {
    await inventario.abrir();
    await inventario.adicionar(...TODOS_OS_PRODUTOS);
    await carrinho.abrir();
    await carrinho.finalizarCompra();
    await checkoutDados.continuarCom(CLIENTE_VALIDO);

    // Valor de referência escrito à mão: confere a fórmula do CT-CHK-05 com um oráculo externo
    await expect(checkoutResumo.subtotal).toHaveText('Item total: $129.94');
    await expect(checkoutResumo.imposto).toHaveText('Tax: $10.40');
    await expect(checkoutResumo.total).toHaveText('Total: $140.34');
  });
});
