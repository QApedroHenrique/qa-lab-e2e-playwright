import { type Locator, type Page } from '@playwright/test';
import { type Cliente } from '@dados/clientes';
import { preencherCampo } from '@suporte/acoes';
import { PaginaBase } from './PaginaBase';

/** Checkout passo 1: dados de entrega (/checkout-step-one.html). */
export class CheckoutDadosPage extends PaginaBase {
  readonly campoNome: Locator;
  readonly campoSobrenome: Locator;
  readonly campoCep: Locator;
  readonly botaoContinuar: Locator;
  readonly botaoCancelar: Locator;
  readonly mensagemErro: Locator;

  constructor(page: Page) {
    super(page);
    this.campoNome = page.getByTestId('firstName');
    this.campoSobrenome = page.getByTestId('lastName');
    this.campoCep = page.getByTestId('postalCode');
    this.botaoContinuar = page.getByTestId('continue');
    this.botaoCancelar = page.getByTestId('cancel');
    this.mensagemErro = page.getByTestId('error');
  }

  async preencher(cliente: Partial<Cliente>): Promise<void> {
    if (cliente.nome !== undefined) await preencherCampo(this.campoNome, cliente.nome);
    if (cliente.sobrenome !== undefined) await preencherCampo(this.campoSobrenome, cliente.sobrenome);
    if (cliente.cep !== undefined) await preencherCampo(this.campoCep, cliente.cep);
  }

  async continuarCom(cliente: Partial<Cliente>): Promise<void> {
    await this.preencher(cliente);
    await this.botaoContinuar.click();
  }
}
