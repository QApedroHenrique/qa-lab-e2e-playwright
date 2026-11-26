import { type Locator, type Page } from '@playwright/test';
import { PaginaBase } from './PaginaBase';

/** Pedido concluído (/checkout-complete.html). */
export class CheckoutConcluidoPage extends PaginaBase {
  readonly titulo: Locator;
  readonly texto: Locator;
  readonly botaoVoltar: Locator;

  constructor(page: Page) {
    super(page);
    this.titulo = page.getByTestId('complete-header');
    this.texto = page.getByTestId('complete-text');
    this.botaoVoltar = page.getByTestId('back-to-products');
  }
}
