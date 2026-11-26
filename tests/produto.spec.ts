import { test, expect } from '@suporte/fixtures';
import { PRODUTOS, TODOS_OS_PRODUTOS } from '@dados/produtos';

test.describe('Detalhe do produto', () => {
  for (const produto of TODOS_OS_PRODUTOS) {
    test(`[CT-PRD-01] "${produto.nome}": detalhe mostra o mesmo nome, descrição e preço da lista`, async ({
      page,
      inventario,
      produto: detalhe,
    }) => {
      await inventario.abrir();
      const descricaoNaLista = await inventario.item(produto).getByTestId('inventory-item-desc').innerText();

      await inventario.abrirDetalhe(produto);

      await expect(page).toHaveURL(new RegExp(`inventory-item\\.html\\?id=${produto.id}$`));
      await expect(detalhe.nome).toHaveText(produto.nome);
      await expect(detalhe.descricao).toHaveText(descricaoNaLista);
      await expect(detalhe.preco).toHaveText(`$${(produto.precoCentavos / 100).toFixed(2)}`);
    });
  }

  test('[CT-PRD-02] adicionar pelo detalhe reflete no contador e na lista ao voltar', async ({ inventario, produto }) => {
    await produto.abrir(PRODUTOS.jaqueta);

    await produto.botaoAdicionar.click();
    await expect(produto.botaoRemover).toBeVisible();
    await expect(produto.cabecalho.contadorCarrinho).toHaveText('1');

    await produto.botaoVoltar.click();
    await expect(inventario.botaoRemover(PRODUTOS.jaqueta)).toBeVisible();
  });

  test('[CT-PRD-03] remover pelo detalhe esvazia o carrinho', async ({ produto }) => {
    await produto.abrir(PRODUTOS.macacao);
    await produto.botaoAdicionar.click();

    await produto.botaoRemover.click();

    await expect(produto.botaoAdicionar).toBeVisible();
    await expect(produto.cabecalho.contadorCarrinho).toBeHidden();
  });
});
