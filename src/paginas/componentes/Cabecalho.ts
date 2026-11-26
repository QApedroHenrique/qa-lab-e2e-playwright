import { expect, type Locator, type Page } from '@playwright/test';

/** Cabeçalho comum a todas as páginas logadas: menu lateral, título e carrinho. */
export class Cabecalho {
  readonly titulo: Locator;
  readonly linkCarrinho: Locator;
  readonly contadorCarrinho: Locator;
  readonly botaoAbrirMenu: Locator;
  readonly botaoFecharMenu: Locator;
  readonly linkTodosOsProdutos: Locator;
  readonly linkSobre: Locator;
  readonly linkSair: Locator;
  readonly linkResetarEstado: Locator;
  /** Painel do menu (biblioteca react-burger-menu, sem `data-test`: única exceção à regra de seletores). */
  private readonly painelMenu: Locator;

  constructor(private readonly page: Page) {
    this.painelMenu = page.locator('.bm-menu-wrap');
    this.titulo = page.getByTestId('title');
    this.linkCarrinho = page.getByTestId('shopping-cart-link');
    this.contadorCarrinho = page.getByTestId('shopping-cart-badge');
    this.botaoAbrirMenu = page.getByRole('button', { name: 'Open Menu' });
    this.botaoFecharMenu = page.getByRole('button', { name: 'Close Menu' });
    this.linkTodosOsProdutos = page.getByTestId('inventory-sidebar-link');
    this.linkSobre = page.getByTestId('about-sidebar-link');
    this.linkSair = page.getByTestId('logout-sidebar-link');
    this.linkResetarEstado = page.getByTestId('reset-sidebar-link');
  }

  /** Abre o menu lateral e espera ele estar na tela (`toque: true` usa tap, para celular). */
  async abrirMenu({ toque = false }: { toque?: boolean } = {}): Promise<void> {
    // O menu fechado só termina de "se esconder" (atributo `hidden`) ~0,3 s depois de carregar ou fechar.
    // Abrir antes disso pode deixar o menu aberto porém invisível (BUG-12, intermitente).
    // Aqui esperamos o menu assentar, como uma pessoa que não clica em menos de 300 ms.
    await expect(this.painelMenu).toHaveAttribute('hidden');
    await (toque ? this.botaoAbrirMenu.tap() : this.botaoAbrirMenu.click());
    await expect(this.linkSair).toBeInViewport();
  }

  async fecharMenu(): Promise<void> {
    await this.botaoFecharMenu.click();
    await expect(this.linkSair).toBeHidden();
  }

  async sair(): Promise<void> {
    await this.abrirMenu();
    await this.linkSair.click();
  }

  async resetarEstadoDoApp(): Promise<void> {
    await this.abrirMenu();
    await this.linkResetarEstado.click();
    await this.fecharMenu();
  }

  async irParaTodosOsProdutos(): Promise<void> {
    await this.abrirMenu();
    await this.linkTodosOsProdutos.click();
  }

  async abrirCarrinho(): Promise<void> {
    await this.linkCarrinho.click();
    await expect(this.page.getByTestId('cart-list')).toBeVisible();
  }
}
