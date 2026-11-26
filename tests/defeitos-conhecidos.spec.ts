import { test, expect, USUARIOS } from '@suporte/fixtures';
import { PRODUTOS, TODOS_OS_PRODUTOS } from '@dados/produtos';
import { CLIENTE_VALIDO } from '@dados/clientes';
import { MENSAGENS } from '@dados/mensagens';

/**
 * DEFEITOS CONHECIDOS do site (relatados em docs/relatorio-de-defeitos.md).
 *
 * Cada teste descreve o comportamento CORRETO e está marcado com `test.fail`:
 * - enquanto o defeito existir, o teste falha como esperado e a suíte continua verde;
 * - se o defeito for corrigido, o teste passa "inesperadamente" e o Playwright acusa erro,
 *   avisando que o bug foi resolvido e que o relatório precisa ser atualizado.
 * Assim o defeito fica registrado, reproduzível e monitorado a cada execução.
 */
const bug = (id: string, descricao: string) => ({ annotation: { type: 'defeito', description: `${id}: ${descricao}` } });

test.describe('problem_user', () => {
  test.use({ usuarioLogado: USUARIOS.comProblema });

  test.beforeEach(async ({ inventario }) => {
    await inventario.abrir();
  });

  test.fail('[CT-DEF-01] cada produto tem a sua própria imagem', bug('BUG-01', 'todos os produtos exibem a mesma imagem'), async ({ inventario }) => {
    const imagens = await Promise.all(TODOS_OS_PRODUTOS.map((p) => inventario.imagem(p).getAttribute('src')));

    expect(new Set(imagens).size).toBe(TODOS_OS_PRODUTOS.length);
  });

  test.fail('[CT-DEF-02] ordenar de Z a A reordena a lista', bug('BUG-02', 'a ordenação é ignorada'), async ({ inventario }) => {
    await inventario.ordenarPor('za');

    await expect(inventario.nomes.first()).toHaveText(PRODUTOS.camisetaVermelha.nome);
  });

  test.fail('[CT-DEF-03] adicionar 3 produtos leva o contador a 3', bug('BUG-03', 'alguns botões "Add to cart" não funcionam'), async ({ inventario }) => {
    await inventario.adicionar(PRODUTOS.mochila, PRODUTOS.camiseta, PRODUTOS.jaqueta);

    await expect(inventario.cabecalho.contadorCarrinho).toHaveText('3');
  });

  test.fail('[CT-DEF-04] o sobrenome digitado fica no campo de sobrenome', bug('BUG-04', 'o texto do sobrenome vai para o campo de nome'), async ({ carrinho, checkoutDados }) => {
    await carrinho.abrir();
    await carrinho.finalizarCompra();

    await checkoutDados.preencher(CLIENTE_VALIDO);

    await expect(checkoutDados.campoNome).toHaveValue(CLIENTE_VALIDO.nome);
    await expect(checkoutDados.campoSobrenome).toHaveValue(CLIENTE_VALIDO.sobrenome);
  });
});

test.describe('error_user', () => {
  test.use({ usuarioLogado: USUARIOS.comErro });

  test.beforeEach(async ({ inventario, carrinho }) => {
    await inventario.abrir();
    await inventario.adicionar(PRODUTOS.mochila);
    await carrinho.abrir();
    await carrinho.finalizarCompra();
  });

  test.fail('[CT-DEF-05] checkout sem sobrenome é bloqueado', bug('BUG-05', 'o checkout avança sem o sobrenome obrigatório'), async ({ page, checkoutDados }) => {
    await checkoutDados.continuarCom({ nome: CLIENTE_VALIDO.nome, cep: CLIENTE_VALIDO.cep });

    await expect(checkoutDados.mensagemErro).toHaveText(MENSAGENS.sobrenomeObrigatorio);
    await expect(page).toHaveURL(/checkout-step-one\.html$/);
  });

  test.fail('[CT-DEF-06] "Finish" conclui o pedido', bug('BUG-06', 'o botão "Finish" não conclui a compra'), async ({ page, checkoutDados, checkoutResumo }) => {
    await checkoutDados.continuarCom(CLIENTE_VALIDO);

    await checkoutResumo.finalizar();

    await expect(page).toHaveURL(/checkout-complete\.html$/);
  });
});

test.describe('visual_user', () => {
  test.use({ usuarioLogado: USUARIOS.visual });

  test.fail('[CT-DEF-07] os preços exibidos batem com o catálogo', bug('BUG-07', 'preços diferentes do catálogo'), async ({ inventario }) => {
    await inventario.abrir();

    const esperados = TODOS_OS_PRODUTOS.map((p) => p.precoCentavos).sort((a, b) => a - b);
    const exibidos = (await inventario.precosExibidosEmCentavos()).sort((a, b) => a - b);
    expect(exibidos).toEqual(esperados);
  });
});

test.describe('performance_glitch_user', () => {
  test.use({ usuarioLogado: null });

  test.fail('[CT-DEF-08] a lista de produtos aparece em até 2 segundos após o login', bug('BUG-08', 'a lista demora ~5 s para carregar'), async ({ login, inventario }) => {
    await login.abrir();
    await login.preencherCredenciais(USUARIOS.lento);

    // Cronômetro explícito: o site trava a página durante o atraso e o próprio clique só "termina"
    // depois dele, então um timeout de asserção começaria a contar tarde demais
    const inicio = Date.now();
    await login.botaoEntrar.click();
    await expect(inventario.lista).toBeVisible({ timeout: 15_000 });
    const duracaoMs = Date.now() - inicio;

    test.info().annotations.push({ type: 'tempo medido', description: `${duracaoMs} ms` });
    expect(duracaoMs).toBeLessThanOrEqual(2_000);
  });
});

test.describe('standard_user', () => {
  test.fail('[CT-DEF-09] não é possível finalizar compra com o carrinho vazio', bug('BUG-09', 'o checkout aceita carrinho vazio e "conclui" o pedido'), async ({ page, carrinho }) => {
    await carrinho.abrir();
    await expect(carrinho.itens).toHaveCount(0);

    await carrinho.finalizarCompra();

    await expect(page).toHaveURL(/\/cart\.html$/);
  });

  test.fail('[CT-DEF-10] "Reset App State" também volta os botões para "Add to cart"', bug('BUG-10', 'o carrinho é esvaziado, mas os botões continuam como "Remove"'), async ({ inventario }) => {
    await inventario.abrir();
    await inventario.adicionar(PRODUTOS.mochila);

    await inventario.cabecalho.resetarEstadoDoApp();

    await expect(inventario.cabecalho.contadorCarrinho).toBeHidden(); // esta parte funciona
    await expect(inventario.botaoAdicionar(PRODUTOS.mochila)).toBeVisible(); // esta não
  });

  test.fail('[CT-DEF-11] produto inexistente não exibe preço nem botão de compra', bug('BUG-11', 'mostra preço "$√-1" e permite adicionar ao carrinho'), async ({ produto }) => {
    await produto.abrir({ id: 999 });

    await expect(produto.nome).toHaveText('ITEM NOT FOUND');
    await expect(produto.preco).toBeHidden();
    await expect(produto.botaoAdicionar).toBeHidden();
  });
});
