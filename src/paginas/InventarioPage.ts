import { expect, type Locator, type Page } from '@playwright/test';
import { type Produto } from '@dados/produtos';
import { paraCentavos } from '@suporte/dinheiro';
import { PaginaBase } from './PaginaBase';

export type Ordenacao = 'az' | 'za' | 'lohi' | 'hilo';

/** Lista de produtos (/inventory.html). */
export class InventarioPage extends PaginaBase {
  readonly lista: Locator;
  readonly itens: Locator;
  readonly nomes: Locator;
  readonly precos: Locator;
  readonly seletorOrdenacao: Locator;

  constructor(page: Page) {
    super(page);
    this.lista = page.getByTestId('inventory-list');
    this.itens = page.getByTestId('inventory-item');
    this.nomes = page.getByTestId('inventory-item-name');
    this.precos = page.getByTestId('inventory-item-price');
    this.seletorOrdenacao = page.getByTestId('product-sort-container');
  }

  async abrir(): Promise<void> {
    await this.page.goto('/inventory.html');
    await expect(this.lista).toBeVisible();
  }

  /** Card de um produto específico. */
  item(produto: Produto): Locator {
    return this.itens.filter({ has: this.page.getByTestId(`item-${produto.id}-title-link`) });
  }

  imagem(produto: Produto): Locator {
    return this.page.getByTestId(`inventory-item-${produto.slug}-img`);
  }

  botaoAdicionar(produto: Produto): Locator {
    return this.page.getByTestId(`add-to-cart-${produto.slug}`);
  }

  botaoRemover(produto: Produto): Locator {
    return this.page.getByTestId(`remove-${produto.slug}`);
  }

  async adicionar(...produtos: Produto[]): Promise<void> {
    for (const produto of produtos) await this.botaoAdicionar(produto).click();
  }

  async remover(...produtos: Produto[]): Promise<void> {
    for (const produto of produtos) await this.botaoRemover(produto).click();
  }

  async abrirDetalhe(produto: Produto): Promise<void> {
    await this.page.getByTestId(`item-${produto.id}-title-link`).click();
    // Espera a página de detalhe montar: logo após o clique a URL muda, mas a lista ainda está no DOM
    await expect(this.page.getByTestId('back-to-products')).toBeVisible();
  }

  async ordenarPor(ordenacao: Ordenacao): Promise<void> {
    await this.seletorOrdenacao.selectOption(ordenacao);
  }

  async nomesExibidos(): Promise<string[]> {
    return this.nomes.allTextContents();
  }

  async precosExibidosEmCentavos(): Promise<number[]> {
    return (await this.precos.allTextContents()).map(paraCentavos);
  }
}
