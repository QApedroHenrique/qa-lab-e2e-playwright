import { expect, type Locator, type Page } from '@playwright/test';
import { preencherCampo } from '@suporte/acoes';
import { SENHA, type Usuario } from '@dados/usuarios';

/** Tela de login (/). */
export class LoginPage {
  readonly campoUsuario: Locator;
  readonly campoSenha: Locator;
  readonly botaoEntrar: Locator;
  readonly mensagemErro: Locator;
  readonly botaoFecharErro: Locator;

  constructor(private readonly page: Page) {
    this.campoUsuario = page.getByTestId('username');
    this.campoSenha = page.getByTestId('password');
    this.botaoEntrar = page.getByTestId('login-button');
    this.mensagemErro = page.getByTestId('error');
    this.botaoFecharErro = page.getByTestId('error-button');
  }

  async abrir(): Promise<void> {
    await this.page.goto('/');
    await expect(this.botaoEntrar).toBeVisible();
  }

  async preencherCredenciais(usuario: string, senha: string = SENHA): Promise<void> {
    await preencherCampo(this.campoUsuario, usuario);
    await preencherCampo(this.campoSenha, senha);
  }

  async entrar(usuario: string, senha: string = SENHA): Promise<void> {
    await this.preencherCredenciais(usuario, senha);
    await this.botaoEntrar.click();
  }

  async entrarComo(usuario: Usuario): Promise<void> {
    await this.abrir();
    await this.entrar(usuario);
  }
}
