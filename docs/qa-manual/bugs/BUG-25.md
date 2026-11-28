# BUG-25 — Recibo em PDF não tem número do pedido, e a hora diverge do nome do arquivo

| Campo | Valor |
|---|---|
| **Severidade** | 🟢 Baixa |
| **Prioridade** | P3 |
| **Tipo** | Funcional e conteúdo · documento gerado |
| **Usuário** | `standard_user` |
| **Ambiente** | Chromium (Playwright 1.65), desktop, máquina no fuso UTC−3 · 2026-11-27 |
| **Reprodutibilidade** | Sempre |
| **Caso / sessão** | [CTM-REC-03 e CTM-REC-05](../casos-de-teste.md#recibo-em-pdf) · [Sessão S5](../sessoes-exploratorias.md#s5--recibo-em-pdf-e-mobile) |

## Passos para reproduzir
1. Entrar com `standard_user`, comprar "Sauce Labs Backpack" até "Thank you for your order!".
2. Clicar em **Generate PDF order** e abrir o arquivo baixado.
3. Comparar a hora no nome do arquivo com a hora no recibo, e procurar um número de pedido.

## Resultado esperado
- O recibo identifica o pedido (número ou código), para o cliente conseguir reclamar ou acompanhar.
- Nome do arquivo e conteúdo usam o mesmo horário (ou o fuso aparece de forma explícita).

## Resultado obtido
- **Sem número do pedido:** o recibo tem data, destinatário, itens e totais, mas nada que identifique o pedido.
- **Hora diferente:** arquivo `swag-labs-order-2026-11-27_14-44-02.pdf`, conteúdo "November 27, 2026 at **11:44 AM**".
  A diferença de 3 h é o fuso: o nome do arquivo usa UTC e o recibo usa a hora local, e nenhum dos dois diz qual é.

Recibo desta execução: [bug-25-recibo.pdf](../evidencias/bug-25-recibo.pdf) (baixado como
`swag-labs-order-2026-11-27_14-44-02.pdf` e renomeado para ficar junto das evidências).

## Verificado e correto (CTM-REC-01, 02 e 04)
Itens, subtotal, imposto de 8% e total batem com o resumo do checkout ($29.99 + $2.40 = $32.39 com 1 item;
$79.98 + $6.40 = $86.38 com 2 itens), e o nome do cliente aparece como digitado. Um nome com 150 caracteres quebra
a linha sem cortar texto.

## Impacto
Dois pedidos iguais no mesmo dia geram recibos indistinguíveis. Para um cliente que ordena arquivos pelo nome, a
hora "errada" parece outro pedido.

## Automação
❌ **Manual.** Ler e conferir o conteúdo de um PDF fica frágil no E2E, e a divergência depende do fuso da máquina.
Está no [checklist](../checklist.md) de documentos gerados.
