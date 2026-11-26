import { test, expect } from '@suporte/fixtures';
import { PRODUTOS } from '@dados/produtos';

test.describe('Carrinho', () => {
  test.beforeEach(async ({ inventario }) => {
    await inventario.abrir();
    await inventario.adicionar(PRODUTOS.mochila, PRODUTOS.camiseta);
    await inventario.cabecalho.abrirCarrinho();
  });

  test('[CT-CAR-01] lista os produtos adicionados com quantidade 1 e preço @smoke', async ({ page, carrinho }) => {
    await expect(page).toHaveURL(/\/cart\.html$/);
    await expect(carrinho.nomes).toHaveText([PRODUTOS.mochila.nome, PRODUTOS.camiseta.nome]);
    await expect(carrinho.quantidades).toHaveText(['1', '1']);
    await expect(carrinho.item(PRODUTOS.mochila).getByTestId('inventory-item-price')).toHaveText('$29.99');
  });

  test('[CT-CAR-02] remover um item tira ele do carrinho e atualiza o contador', async ({ carrinho }) => {
    await carrinho.remover(PRODUTOS.mochila);

    await expect(carrinho.nomes).toHaveText([PRODUTOS.camiseta.nome]);
    await expect(carrinho.cabecalho.contadorCarrinho).toHaveText('1');
  });

  test('[CT-CAR-03] "Continue Shopping" volta para a lista mantendo os itens', async ({ page, carrinho, inventario }) => {
    await carrinho.botaoContinuarComprando.click();

    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(inventario.botaoRemover(PRODUTOS.mochila)).toBeVisible();
    await expect(inventario.cabecalho.contadorCarrinho).toHaveText('2');
  });

  test('[CT-CAR-04] o carrinho continua preenchido depois de recarregar a página', async ({ page, carrinho }) => {
    await page.reload();

    await expect(carrinho.nomes).toHaveText([PRODUTOS.mochila.nome, PRODUTOS.camiseta.nome]);
  });

  test('[CT-CAR-05] remover todos os itens deixa o carrinho vazio', async ({ carrinho }) => {
    await carrinho.remover(PRODUTOS.mochila);
    await carrinho.remover(PRODUTOS.camiseta);

    await expect(carrinho.itens).toHaveCount(0);
    await expect(carrinho.cabecalho.contadorCarrinho).toBeHidden();
  });
});
