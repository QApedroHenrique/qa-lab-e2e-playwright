import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@suporte/fixtures';
import { PRODUTOS } from '@dados/produtos';
import { CLIENTE_VALIDO } from '@dados/clientes';

/**
 * Varredura automática de acessibilidade com axe-core (critérios WCAG 2.0/2.1 níveis A e AA).
 * Pega problemas objetivos (contraste, rótulos, nomes de botão, estrutura). Não substitui teste manual
 * com leitor de tela, mas impede regressões óbvias.
 */
const WCAG = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

test.describe('Acessibilidade (WCAG 2.1 A/AA)', () => {
  test.describe('sem login', () => {
    test.use({ usuarioLogado: null });

    test('[CT-ACS-01] tela de login não tem violações', async ({ page, login }) => {
      await login.abrir();

      const { violations } = await new AxeBuilder({ page }).withTags(WCAG).analyze();
      expect(violations, JSON.stringify(violations.map((v) => v.id))).toEqual([]);
    });
  });

  const paginas = [
    { nome: 'lista de produtos', caminho: '/inventory.html', pronto: 'inventory-list' },
    { nome: 'detalhe do produto', caminho: `/inventory-item.html?id=${PRODUTOS.mochila.id}`, pronto: 'back-to-products' },
    { nome: 'carrinho', caminho: '/cart.html', pronto: 'checkout' },
    { nome: 'dados de entrega', caminho: '/checkout-step-one.html', pronto: 'firstName' },
  ];

  for (const { nome, caminho, pronto } of paginas) {
    test(`[CT-ACS-02] ${nome} não tem violações`, async ({ page }) => {
      await page.goto(caminho);
      await expect(page.getByTestId(pronto)).toBeVisible();

      const { violations } = await new AxeBuilder({ page }).withTags(WCAG).analyze();
      expect(violations, JSON.stringify(violations.map((v) => v.id))).toEqual([]);
    });
  }

  test('[CT-ACS-03] resumo e confirmação do pedido não têm violações', async ({
    page,
    inventario,
    carrinho,
    checkoutDados,
    checkoutResumo,
    checkoutConcluido,
  }) => {
    await inventario.abrir();
    await inventario.adicionar(PRODUTOS.mochila);
    await carrinho.abrir();
    await carrinho.finalizarCompra();
    await checkoutDados.continuarCom(CLIENTE_VALIDO);
    await expect(checkoutResumo.total).toBeVisible();
    const resumo = await new AxeBuilder({ page }).withTags(WCAG).analyze();

    await checkoutResumo.finalizar();
    await expect(checkoutConcluido.titulo).toBeVisible();
    const confirmacao = await new AxeBuilder({ page }).withTags(WCAG).analyze();

    expect(resumo.violations.map((v) => v.id)).toEqual([]);
    expect(confirmacao.violations.map((v) => v.id)).toEqual([]);
  });
});
