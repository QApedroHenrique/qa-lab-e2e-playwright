import { expect, type Locator, type Page } from '@playwright/test';
import { type Produto } from '@dados/produtos';
import { PaginaBase } from './PaginaBase';

/** Detalhe de um produto (/inventory-item.html?id=N). */
export class ProdutoPage extends PaginaBase {
  readonly nome: Locator;
  readonly descricao: Locator;
  readonly preco: Locator;
  readonly botaoAdicionar: Locator;
  readonly botaoRemover: Locator;
  readonly botaoVoltar: Locator;

  constructor(page: Page) {
    super(page);
    this.nome = page.getByTestId('inventory-item-name');
    this.descricao = page.getByTestId('inventory-item-desc');
    this.preco = page.getByTestId('inventory-item-price');
    this.botaoAdicionar = page.getByTestId('add-to-cart');
    this.botaoRemover = page.getByTestId('remove');
    this.botaoVoltar = page.getByTestId('back-to-products');
  }

  async abrir(produto: Pick<Produto, 'id'>): Promise<void> {
    await this.page.goto(`/inventory-item.html?id=${produto.id}`);
    await expect(this.nome).toBeVisible();
  }
}
