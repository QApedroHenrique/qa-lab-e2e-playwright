import { test as base, expect } from '@playwright/test';
import { USUARIOS, type Usuario } from '@dados/usuarios';
import { LoginPage } from '@paginas/LoginPage';
import { InventarioPage } from '@paginas/InventarioPage';
import { ProdutoPage } from '@paginas/ProdutoPage';
import { CarrinhoPage } from '@paginas/CarrinhoPage';
import { CheckoutDadosPage } from '@paginas/CheckoutDadosPage';
import { CheckoutResumoPage } from '@paginas/CheckoutResumoPage';
import { CheckoutConcluidoPage } from '@paginas/CheckoutConcluidoPage';

interface Opcoes {
  /**
   * Usuário com sessão já aberta no início do teste (padrão: standard_user).
   * Use `test.use({ usuarioLogado: null })` para começar deslogado (ex.: testes de login).
   */
  usuarioLogado: Usuario | null;
}

interface Paginas {
  login: LoginPage;
  inventario: InventarioPage;
  produto: ProdutoPage;
  carrinho: CarrinhoPage;
  checkoutDados: CheckoutDadosPage;
  checkoutResumo: CheckoutResumoPage;
  checkoutConcluido: CheckoutConcluidoPage;
}

export const test = base.extend<Opcoes & Paginas>({
  usuarioLogado: [USUARIOS.padrao, { option: true }],

  /**
   * Login "por atalho": o site guarda a sessão no cookie `session-username`.
   * Gravar o cookie direto evita repetir a tela de login em todo teste (mais rápido e menos instável).
   * A tela de login em si é coberta pela UI em tests/login.spec.ts.
   * Cada teste ganha um contexto novo, então carrinho (localStorage) e sessão nunca vazam entre testes.
   */
  context: async ({ context, usuarioLogado, baseURL }, use) => {
    if (usuarioLogado) {
      await context.addCookies([{ name: 'session-username', value: usuarioLogado, url: baseURL! }]);
    }
    await use(context);
  },

  login: async ({ page }, use) => use(new LoginPage(page)),
  inventario: async ({ page }, use) => use(new InventarioPage(page)),
  produto: async ({ page }, use) => use(new ProdutoPage(page)),
  carrinho: async ({ page }, use) => use(new CarrinhoPage(page)),
  checkoutDados: async ({ page }, use) => use(new CheckoutDadosPage(page)),
  checkoutResumo: async ({ page }, use) => use(new CheckoutResumoPage(page)),
  checkoutConcluido: async ({ page }, use) => use(new CheckoutConcluidoPage(page)),
});

export { expect, USUARIOS };
