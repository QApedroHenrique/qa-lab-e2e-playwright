# BUG-22 — Todas as páginas têm o mesmo título ("Swag Labs") e nenhum cabeçalho `h1`

| Campo | Valor |
|---|---|
| **Severidade** | 🟢 Baixa |
| **Prioridade** | P3 |
| **Tipo** | Acessibilidade · WCAG 2.2 **2.4.2 Página com título (A)** e **1.3.1 Informações e relações (A)** |
| **Usuário** | `standard_user` |
| **Ambiente** | Chromium (Playwright 1.65), desktop 1280×720 · 2026-11-27 |
| **Reprodutibilidade** | Sempre |
| **Caso / sessão** | [CTM-NAV-03 e CTM-ACS-02](../casos-de-teste.md#navegação-e-técnico) · [Sessão S2](../sessoes-exploratorias.md#s2--navegação-só-com-teclado) |

## Passos para reproduzir
1. Entrar com `standard_user` e abrir cada página da tabela abaixo em uma aba.
2. Ler o título da aba e procurar o cabeçalho principal da página (no leitor de tela, atalho "próximo cabeçalho").

## Resultado obtido

| Página | Título da aba | `h1` na página |
|---|---|---|
| Produtos (`/inventory.html`) | Swag Labs | 0 |
| Detalhe do produto (`/inventory-item.html?id=4`) | Swag Labs | 0 |
| Carrinho (`/cart.html`) | Swag Labs | 0 |
| Checkout (`/checkout-step-one.html`) | Swag Labs | 0 |
| Slider (`/dynamic-catalog-slider.html`) | Swag Labs | 0 |

Os textos "Products", "Your Cart" e "Checkout: Your Information" parecem títulos, mas não são marcados como
cabeçalho ("Products" é um `<span>`). Produtos, carrinho e checkout não têm nenhum cabeçalho, de `h1` a `h6`.

## Resultado esperado
Título da aba específico ("Carrinho – Swag Labs") e um `h1` com o nome da página.

## Impacto
Com várias abas abertas, todas aparecem iguais. Quem usa leitor de tela não ouve em qual página está ao trocar de
tela e não consegue pular direto para o conteúdo principal pelos cabeçalhos.

## Automação
✅ **Candidato** de baixa prioridade (`toHaveTitle` por página e contagem de `h1`).
