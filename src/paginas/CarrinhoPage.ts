import { expect, type Locator, type Page } from '@playwright/test';
import { type Produto } from '@dados/produtos';
import { PaginaBase } from './PaginaBase';

/** Carrinho (/cart.html). */
export class CarrinhoPage extends PaginaBase {
  readonly itens: Locator;
  readonly nomes: Locator;
  readonly quantidades: Locator;
  readonly botaoContinuarComprando: Locator;
  readonly botaoFinalizarCompra: Locator;

  constructor(page: Page) {
    super(page);
    this.itens = page.getByTestId('inventory-item');
    this.nomes = page.getByTestId('inventory-item-name');
    this.quantidades = page.getByTestId('item-quantity');
    this.botaoContinuarComprando = page.getByTestId('continue-shopping');
    this.botaoFinalizarCompra = page.getByTestId('checkout');
  }

  async abrir(): Promise<void> {
    await this.page.goto('/cart.html');
    await expect(this.botaoFinalizarCompra).toBeVisible();
  }

  item(produto: Produto): Locator {
    return this.itens.filter({ hasText: produto.nome });
  }

  async remover(produto: Produto): Promise<void> {
    await this.page.getByTestId(`remove-${produto.slug}`).click();
  }

  async finalizarCompra(): Promise<void> {
    await this.botaoFinalizarCompra.click();
    await expect(this.page.getByTestId('firstName')).toBeVisible();
  }
}
