import { test, expect } from '@suporte/fixtures';
import { PRODUTOS, TODOS_OS_PRODUTOS } from '@dados/produtos';
import { type Ordenacao } from '@paginas/InventarioPage';

test.describe('Lista de produtos', () => {
  test.beforeEach(async ({ inventario }) => {
    await inventario.abrir();
  });

  test('[CT-INV-01] exibe os 6 produtos com nome, descrição, preço, imagem e botão @smoke', async ({ inventario }) => {
    await expect(inventario.itens).toHaveCount(TODOS_OS_PRODUTOS.length);

    for (const produto of TODOS_OS_PRODUTOS) {
      const card = inventario.item(produto);
      await expect(card.getByTestId('inventory-item-name')).toHaveText(produto.nome);
      await expect(card.getByTestId('inventory-item-desc')).not.toBeEmpty();
      await expect(inventario.imagem(produto)).toBeVisible();
      await expect(inventario.botaoAdicionar(produto)).toHaveText('Add to cart');
    }
  });

  test('[CT-INV-02] os preços exibidos batem com o catálogo', async ({ inventario }) => {
    for (const produto of TODOS_OS_PRODUTOS) {
      const preco = inventario.item(produto).getByTestId('inventory-item-price');
      await expect(preco).toHaveText(`$${(produto.precoCentavos / 100).toFixed(2)}`);
    }
  });

  // Oráculo: a própria lista ordenada pelo teste, não uma lista fixa (pega qualquer item fora de ordem)
  const ordenacoes: { ordenacao: Ordenacao; descricao: string }[] = [
    { ordenacao: 'az', descricao: 'nome de A a Z' },
    { ordenacao: 'za', descricao: 'nome de Z a A' },
    { ordenacao: 'lohi', descricao: 'menor preço primeiro' },
    { ordenacao: 'hilo', descricao: 'maior preço primeiro' },
  ];

  for (const { ordenacao, descricao } of ordenacoes) {
    test(`[CT-INV-03] ordena por ${descricao}`, async ({ inventario }) => {
      await inventario.ordenarPor(ordenacao);

      await expect(inventario.seletorOrdenacao).toHaveValue(ordenacao);
      const nomes = await inventario.nomesExibidos();
      const precos = await inventario.precosExibidosEmCentavos();
      const esperado = {
        az: [...nomes].sort((a, b) => a.localeCompare(b)),
        za: [...nomes].sort((a, b) => b.localeCompare(a)),
        lohi: [...precos].sort((a, b) => a - b),
        hilo: [...precos].sort((a, b) => b - a),
      }[ordenacao];
      const exibido = { az: nomes, za: nomes, lohi: precos, hilo: precos }[ordenacao];
      expect(exibido).toEqual(esperado);
      // Ordenar a própria tela não pega produto sumido ou duplicado: confere contra o catálogo
      expect([...nomes].sort()).toEqual(TODOS_OS_PRODUTOS.map((p) => p.nome).sort());
    });
  }

  test('[CT-INV-04] adicionar ao carrinho troca o botão para "Remove" e atualiza o contador @smoke', async ({ inventario }) => {
    await inventario.adicionar(PRODUTOS.mochila);

    await expect(inventario.botaoRemover(PRODUTOS.mochila)).toHaveText('Remove');
    await expect(inventario.cabecalho.contadorCarrinho).toHaveText('1');

    await inventario.adicionar(PRODUTOS.lanterna);
    await expect(inventario.cabecalho.contadorCarrinho).toHaveText('2');
  });

  test('[CT-INV-05] remover da lista diminui o contador e o esconde ao chegar em zero', async ({ inventario }) => {
    await inventario.adicionar(PRODUTOS.mochila, PRODUTOS.lanterna);
    await expect(inventario.cabecalho.contadorCarrinho).toHaveText('2');

    await inventario.remover(PRODUTOS.mochila);
    await expect(inventario.cabecalho.contadorCarrinho).toHaveText('1');
    await expect(inventario.botaoAdicionar(PRODUTOS.mochila)).toBeVisible();

    await inventario.remover(PRODUTOS.lanterna);
    await expect(inventario.cabecalho.contadorCarrinho).toBeHidden();
  });

  test('[CT-INV-06] adicionar todos os produtos leva o contador a 6', async ({ inventario }) => {
    await inventario.adicionar(...TODOS_OS_PRODUTOS);

    await expect(inventario.cabecalho.contadorCarrinho).toHaveText('6');
  });
});
