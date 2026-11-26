import { type Page } from '@playwright/test';
import { test, expect, USUARIOS } from '@suporte/fixtures';
import { PRODUTOS } from '@dados/produtos';
import { CLIENTE_VALIDO } from '@dados/clientes';
import { MENSAGENS } from '@dados/mensagens';

/**
 * Específicos de celular. Rodam só nos projetos mobile-chrome (Pixel 7) e mobile-safari (iPhone 15),
 * que emulam tela, densidade de pixels, toque e user agent. Os demais specs também rodam nesses projetos.
 */

/** Largura total do conteúdo vs. largura da tela: se for maior, existe rolagem horizontal. */
async function larguras(page: Page): Promise<{ conteudo: number; tela: number }> {
  return page.evaluate(() => ({ conteudo: document.documentElement.scrollWidth, tela: window.innerWidth }));
}

test.describe('Mobile', () => {
  test.beforeEach(({ isMobile }) => {
    expect(isMobile, 'este arquivo deve rodar apenas nos projetos mobile').toBe(true);
  });

  for (const caminho of ['/inventory.html', '/cart.html', '/checkout-step-one.html', '/inventory-item.html?id=4']) {
    test(`[CT-MOB-01] ${caminho} cabe na tela, sem rolagem horizontal`, async ({ page }) => {
      await page.goto(caminho);
      await expect(page.getByTestId('primary-header')).toBeVisible();

      const { conteudo, tela } = await larguras(page);
      expect(conteudo).toBeLessThanOrEqual(tela);
    });
  }

  test('[CT-MOB-02] produtos aparecem em uma coluna, um abaixo do outro', async ({ inventario }) => {
    await inventario.abrir();

    const [primeiro, segundo] = await Promise.all([inventario.itens.nth(0).boundingBox(), inventario.itens.nth(1).boundingBox()]);
    expect(primeiro).not.toBeNull();
    expect(segundo).not.toBeNull();
    expect(segundo!.y).toBeGreaterThan(primeiro!.y + primeiro!.height - 1); // abaixo, não ao lado
    expect(Math.abs(segundo!.x - primeiro!.x)).toBeLessThan(2); // mesma coluna
  });

  test('[CT-MOB-03] menu lateral abre e funciona com toque', async ({ page, inventario }) => {
    await inventario.abrir();

    await inventario.cabecalho.abrirMenu({ toque: true }); // confirma que o menu entrou na tela

    await inventario.cabecalho.linkSair.tap();
    await expect(page).toHaveURL(/\/$/);
  });

  test('[CT-MOB-04] compra completa usando só toques @smoke', async ({
    page,
    inventario,
    carrinho,
    checkoutDados,
    checkoutResumo,
    checkoutConcluido,
  }) => {
    await inventario.abrir();
    await inventario.botaoAdicionar(PRODUTOS.mochila).tap();
    await inventario.cabecalho.linkCarrinho.tap();
    await carrinho.botaoFinalizarCompra.tap();
    await checkoutDados.preencher(CLIENTE_VALIDO);
    await checkoutDados.botaoContinuar.tap();
    await checkoutResumo.botaoFinalizar.scrollIntoViewIfNeeded();
    await checkoutResumo.botaoFinalizar.tap();

    await expect(page).toHaveURL(/checkout-complete\.html$/);
    await expect(checkoutConcluido.titulo).toHaveText(MENSAGENS.pedidoConcluido);
  });

  test.describe('login no celular', () => {
    test.use({ usuarioLogado: null });

    test('[CT-MOB-05] tela de login cabe na tela e o botão de entrar fica visível sem rolar', async ({ page, login }) => {
      await login.abrir();

      await expect(login.botaoEntrar).toBeInViewport();
      const { conteudo, tela } = await larguras(page);
      expect(conteudo).toBeLessThanOrEqual(tela);

      await login.entrar(USUARIOS.padrao);
      await expect(page).toHaveURL(/\/inventory\.html$/);
    });
  });
});
