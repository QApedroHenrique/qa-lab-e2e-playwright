# BUG-24 — Páginas internas respondem HTTP 404 e URL inexistente mostra tela em branco

| Campo | Valor |
|---|---|
| **Severidade** | 🟢 Baixa (não afeta quem já está navegando; afeta monitoramento, links e buscadores) |
| **Prioridade** | P3 |
| **Tipo** | Técnico · HTTP e roteamento |
| **Usuário** | qualquer |
| **Ambiente** | `curl` (sem navegador) e Chromium (Playwright 1.65) · 2026-11-27 |
| **Reprodutibilidade** | Sempre |
| **Caso / sessão** | [CTM-NAV-01 e CTM-NAV-02](../casos-de-teste.md#navegação-e-técnico) · [Sessão S2](../sessoes-exploratorias.md#s2--navegação-só-com-teclado) |

## Passos para reproduzir
```bash
curl -s -o /dev/null -w "%{http_code}\n" https://www.saucedemo.com/            # 200
curl -s -o /dev/null -w "%{http_code}\n" https://www.saucedemo.com/cart.html   # 404
```
No navegador: entrar com `standard_user`, abrir `/cart.html` e apertar **F5**; depois abrir `/pagina-inexistente.html`.

## Resultado esperado
- Páginas que existem respondem **200**.
- Endereço inexistente responde 404 **e mostra uma página** "não encontrada" com um link de volta.

## Resultado obtido

| Endereço | Status HTTP | O que aparece |
|---|---|---|
| `/` | 200 | Login |
| `/inventory.html`, `/cart.html`, `/checkout-step-one.html`, `/inventory-item.html?id=4` | **404** | A página certa (renderizada pelo JavaScript) |
| `/pagina-inexistente.html` | 404 | **Tela totalmente em branco**, sem mensagem e sem link |

![URL inexistente: tela em branco](../evidencias/bug-24-url-inexistente.png)

## Impacto
- Ferramentas de monitoramento e verificadores de links acusam "página fora do ar" em páginas que funcionam.
- Buscadores não indexam páginas que respondem 404, e caches e proxies podem se recusar a guardá-las.
- Quem digita um endereço errado fica numa tela vazia, sem saída.

## Análise técnica
O servidor não conhece as rotas da aplicação: entrega a página de erro 404, que carrega o mesmo JavaScript, e o
roteador do navegador desenha a tela certa. **Correção sugerida:** configurar o servidor para responder 200 com o
`index.html` nas rotas conhecidas, e criar uma rota "não encontrada" na aplicação.

## Automação
⚠️ **Fora do E2E.** O lugar certo é um teste de API ou um monitor de disponibilidade, que olha o status HTTP. O E2E
olha a tela, e a tela está certa.
