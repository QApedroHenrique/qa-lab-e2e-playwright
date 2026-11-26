import { test, expect, USUARIOS } from '@suporte/fixtures';
import { MENSAGENS } from '@dados/mensagens';

test.use({ usuarioLogado: null }); // todos os testes deste arquivo começam deslogados

test.describe('Login', () => {
  test.beforeEach(async ({ login }) => {
    await login.abrir();
  });

  test('[CT-LOG-01] usuário válido entra e vê a lista de produtos @smoke', async ({ page, login, inventario }) => {
    await login.entrar(USUARIOS.padrao);

    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(inventario.cabecalho.titulo).toHaveText('Products');
    await expect(inventario.itens).toHaveCount(6);
  });

  // Tabela de decisão: usuário (vazio/válido/inexistente) × senha (vazia/correta/errada)
  const casosInvalidos = [
    { caso: 'usuário e senha vazios', usuario: '', senha: '', mensagem: MENSAGENS.usuarioObrigatorio },
    { caso: 'usuário vazio', usuario: '', senha: 'secret_sauce', mensagem: MENSAGENS.usuarioObrigatorio },
    { caso: 'senha vazia', usuario: USUARIOS.padrao, senha: '', mensagem: MENSAGENS.senhaObrigatoria },
    { caso: 'senha errada', usuario: USUARIOS.padrao, senha: 'senha-errada', mensagem: MENSAGENS.credenciaisInvalidas },
    { caso: 'usuário inexistente', usuario: 'usuario_ficticio', senha: 'secret_sauce', mensagem: MENSAGENS.credenciaisInvalidas },
    { caso: 'usuário em maiúsculas', usuario: 'STANDARD_USER', senha: 'secret_sauce', mensagem: MENSAGENS.credenciaisInvalidas },
  ];

  for (const { caso, usuario, senha, mensagem } of casosInvalidos) {
    test(`[CT-LOG-02] ${caso}: mostra erro e continua na tela de login`, async ({ page, login }) => {
      await login.entrar(usuario, senha);

      await expect(login.mensagemErro).toHaveText(mensagem);
      await expect(page).toHaveURL(/\/$/);
    });
  }

  test('[CT-LOG-03] usuário bloqueado não entra @smoke', async ({ page, login }) => {
    await login.entrar(USUARIOS.bloqueado);

    await expect(login.mensagemErro).toHaveText(MENSAGENS.usuarioBloqueado);
    await expect(page).not.toHaveURL(/inventory/);
  });

  test('[CT-LOG-04] a mensagem de erro pode ser fechada', async ({ login }) => {
    await login.entrar('', '');
    await expect(login.mensagemErro).toBeVisible();

    await login.botaoFecharErro.click();

    await expect(login.mensagemErro).toBeHidden();
  });

  test('[CT-LOG-05] o campo de senha não mostra o que é digitado', async ({ login }) => {
    await expect(login.campoSenha).toHaveAttribute('type', 'password');
  });

  for (const caminho of ['/inventory.html', '/cart.html', '/checkout-step-one.html', '/checkout-step-two.html']) {
    test(`[CT-LOG-06] acessar ${caminho} sem login volta para o login com aviso`, async ({ page, login }) => {
      await page.goto(caminho);

      await expect(page).toHaveURL(/\/$/);
      await expect(login.mensagemErro).toHaveText(MENSAGENS.acessoSemLogin(caminho));
    });
  }

  test('[CT-LOG-07] dá para entrar só com o teclado (Tab e Enter)', async ({ page, login }) => {
    await login.campoUsuario.focus();
    await page.keyboard.type(USUARIOS.padrao);
    await page.keyboard.press('Tab');
    await page.keyboard.type('secret_sauce');
    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(/\/inventory\.html$/);
  });
});
