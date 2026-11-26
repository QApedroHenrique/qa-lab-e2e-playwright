import { test, expect } from '@suporte/fixtures';
import { PRODUTOS } from '@dados/produtos';
import { MENSAGENS } from '@dados/mensagens';

test.describe('Menu e navegação', () => {
  test.beforeEach(async ({ inventario }) => {
    await inventario.abrir();
  });

  test('[CT-NAV-01] "Logout" encerra a sessão: páginas internas voltam a exigir login @smoke', async ({
    page,
    inventario,
    login,
  }) => {
    await inventario.cabecalho.sair();

    await expect(page).toHaveURL(/\/$/);
    await expect(login.botaoEntrar).toBeVisible();

    await page.goto('/inventory.html');
    await expect(login.mensagemErro).toHaveText(MENSAGENS.acessoSemLogin('/inventory.html'));
  });

  test('[CT-NAV-02] "Reset App State" esvazia o carrinho', async ({ inventario, carrinho }) => {
    await inventario.adicionar(PRODUTOS.mochila, PRODUTOS.lanterna);

    await inventario.cabecalho.resetarEstadoDoApp();

    await expect(inventario.cabecalho.contadorCarrinho).toBeHidden();
    await carrinho.abrir();
    await expect(carrinho.itens).toHaveCount(0);
  });

  test('[CT-NAV-03] "All Items" volta para a lista a partir do carrinho', async ({ page, inventario, carrinho }) => {
    await carrinho.abrir();

    await carrinho.cabecalho.irParaTodosOsProdutos();

    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(inventario.itens).toHaveCount(6);
  });

  test('[CT-NAV-04] "About" aponta para o site da Sauce Labs', async ({ inventario }) => {
    await inventario.cabecalho.abrirMenu();

    // Só confere o destino: navegar para um site externo deixaria o teste dependente dele
    await expect(inventario.cabecalho.linkSobre).toHaveAttribute('href', 'https://saucelabs.com/');
  });

  test('[CT-NAV-05] o menu abre e fecha', async ({ inventario }) => {
    await inventario.cabecalho.abrirMenu();
    await expect(inventario.cabecalho.linkSair).toBeVisible();

    await inventario.cabecalho.fecharMenu();
    await expect(inventario.cabecalho.linkSair).toBeHidden();
  });
});
