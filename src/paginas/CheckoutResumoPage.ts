import { expect, type Locator, type Page } from '@playwright/test';
import { paraCentavos } from '@suporte/dinheiro';
import { PaginaBase } from './PaginaBase';

/** Checkout passo 2: resumo e valores (/checkout-step-two.html). */
export class CheckoutResumoPage extends PaginaBase {
  readonly nomes: Locator;
  readonly subtotal: Locator;
  readonly imposto: Locator;
  readonly total: Locator;
  readonly pagamento: Locator;
  readonly entrega: Locator;
  readonly botaoFinalizar: Locator;
  readonly botaoCancelar: Locator;

  constructor(page: Page) {
    super(page);
    this.nomes = page.getByTestId('inventory-item-name');
    this.subtotal = page.getByTestId('subtotal-label');
    this.imposto = page.getByTestId('tax-label');
    this.total = page.getByTestId('total-label');
    this.pagamento = page.getByTestId('payment-info-value');
    this.entrega = page.getByTestId('shipping-info-value');
    this.botaoFinalizar = page.getByTestId('finish');
    this.botaoCancelar = page.getByTestId('cancel');
  }

  /** Valores do resumo em centavos. */
  async valores(): Promise<{ subtotal: number; imposto: number; total: number }> {
    await expect(this.total).toBeVisible();
    return {
      subtotal: paraCentavos(await this.subtotal.innerText()),
      imposto: paraCentavos(await this.imposto.innerText()),
      total: paraCentavos(await this.total.innerText()),
    };
  }

  async finalizar(): Promise<void> {
    await this.botaoFinalizar.click();
  }
}
