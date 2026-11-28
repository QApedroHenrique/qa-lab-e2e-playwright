# Checklist de QA manual

Checklist **reaproveitável** para cada entrega da loja, preenchido com o resultado da rodada de **2026-11-27**.
Ele cobre o que a suíte automatizada não cobre. Itens já verificados pela automação a cada execução estão marcados
com 🤖 e só precisam de atenção se o CI acusar algo.

**Legenda:** ✅ ok · ❌ falhou (bug) · ⚠️ observação · 🤖 coberto pela automação · ➖ não se aplica

Para usar numa nova rodada: copie a coluna "Resultado", apague os valores e preencha de novo.

---

## 1. Funcional e regras de negócio
| # | Verificação | Resultado |
|---|---|---|
| 1.1 | Login, ordenação, carrinho, checkout completo e imposto de 8% | 🤖 |
| 1.2 | Campos obrigatórios rejeitam valor só com espaços | ❌ [BUG-14](bugs/BUG-14.md) |
| 1.3 | Campos têm formato e tamanho máximo (CEP, nome) | ❌ [BUG-15](bugs/BUG-15.md) |
| 1.4 | Texto com HTML é exibido como texto, não interpretado | ✅ |
| 1.5 | Voltar/avançar do navegador não leva a estado inválido | ❌ [BUG-19](bugs/BUG-19.md) |
| 1.6 | Cancel e Voltar levam a destinos consistentes | ⚠️ O-06 |
| 1.7 | Funcionalidades novas do menu foram exploradas (hoje: Dynamic Catalog) | ✅ S3 |

## 2. Documentos gerados (recibo em PDF)
| # | Verificação | Resultado |
|---|---|---|
| 2.1 | Itens e valores iguais ao resumo do checkout | ✅ |
| 2.2 | Dados do cliente como digitados | ✅ |
| 2.3 | Identificação do pedido (número ou código) | ❌ [BUG-25](bugs/BUG-25.md) |
| 2.4 | Data e hora coerentes (conteúdo × nome do arquivo; fuso explícito) | ❌ [BUG-25](bugs/BUG-25.md) |
| 2.5 | Texto longo quebra linha sem cortar | ✅ |

## 3. Visual (contra a referência aprovada)
| # | Verificação | Resultado |
|---|---|---|
| 3.1 | Ícones e botões na posição da referência | ❌ [BUG-20](bugs/BUG-20.md) (pontos 1, 7) |
| 3.2 | Nada girado, recuado ou saindo do contêiner | ❌ [BUG-20](bugs/BUG-20.md) (pontos 2, 5, 6) |
| 3.3 | Cada produto com a foto certa | ❌ [BUG-20](bugs/BUG-20.md) (ponto 3) |
| 3.4 | Preços no formato `$0.00` em todas as telas | ❌ [BUG-19](bugs/BUG-19.md), [BUG-20](bugs/BUG-20.md) (ponto 4) |
| 3.5 | Animações terminam antes de capturar a evidência (evita falso positivo) | ✅ (hipótese do slider descartada) |

## 4. Conteúdo e texto
| # | Verificação | Resultado |
|---|---|---|
| 4.1 | Plural e gramática ("1 items") | ⚠️ O-04 |
| 4.2 | Links do rodapé funcionam e levam ao lugar certo | ⚠️ O-03 (termos e privacidade não são links) |
| 4.3 | Listas sem itens duplicados nem fora de ordem | ❌ [BUG-18](bugs/BUG-18.md) |
| 4.4 | Mensagens de erro dizem o que corrigir | ⚠️ O-01 (espaço no usuário) |

## 5. Acessibilidade (WCAG 2.2 AA: o que exige uma pessoa)
O axe-core roda na automação (🤖 CT-ACS-01) e pega contraste, `alt` e nomes acessíveis. Os itens abaixo ele **não**
pega.

| # | Critério | Verificação | Resultado |
|---|---|---|---|
| 5.1 | 2.1.1 Teclado (A) | Tudo que funciona com mouse funciona com Tab/Enter | ❌ [BUG-13](bugs/BUG-13.md) |
| 5.2 | 2.4.7 Foco visível (AA) | O elemento focado é destacado | ❌ [BUG-16](bugs/BUG-16.md) |
| 5.3 | 2.4.3 Ordem do foco (A) | A ordem do Tab segue a ordem visual | ✅ (exceto o carrinho, BUG-13) |
| 5.4 | 3.3.2 Rótulos (A) | Rótulo visível depois de preencher | ❌ [BUG-21](bugs/BUG-21.md) |
| 5.5 | 1.3.5 Propósito da entrada (AA) | `autocomplete` em nome e CEP | ❌ [BUG-21](bugs/BUG-21.md) |
| 5.6 | 2.2.2 Pausar, parar, ocultar (A) | Conteúdo que se move pode ser pausado | ❌ [BUG-17](bugs/BUG-17.md) |
| 5.7 | 2.4.2 Página com título (A) | Título da aba descreve a página | ❌ [BUG-22](bugs/BUG-22.md) |
| 5.8 | 1.3.1 Informações e relações (A) | Um `h1` por página | ❌ [BUG-22](bugs/BUG-22.md) |
| 5.9 | 4.1.3 Mensagens de status (AA) | Erros com `role="alert"` | ✅ |
| 5.10 | 2.5.8 Tamanho do alvo (AA) | Alvos ≥ 24×24 px | ❌ [BUG-23](bugs/BUG-23.md) |
| 5.11 | Leitor de tela real (NVDA/VoiceOver) | Fluxo de compra completo | ➖ não executado nesta rodada |

## 6. Mobile
| # | Verificação | Resultado |
|---|---|---|
| 6.1 | Sem rolagem horizontal nas telas principais | 🤖 CT-MOB |
| 6.2 | Sem rolagem horizontal nas telas novas | ✅ (Lazy Load) |
| 6.3 | Alvos de toque confortáveis | ❌ [BUG-23](bugs/BUG-23.md) |
| 6.4 | Teclado numérico no CEP (`inputmode`) | ⚠️ não definido; depende do formato (BUG-15) |
| 6.5 | Aparelho físico | ➖ só emulado nesta rodada |

## 7. Técnico
| # | Verificação | Resultado |
|---|---|---|
| 7.1 | Páginas respondem HTTP 200 (inclusive ao recarregar) | ❌ [BUG-24](bugs/BUG-24.md) |
| 7.2 | Endereço inexistente mostra página de erro amigável | ❌ [BUG-24](bugs/BUG-24.md) |
| 7.3 | Links externos com `target="_blank"` têm `rel="noreferrer"`/`noopener` | ✅ |
| 7.4 | Duração da sessão conhecida | ✅ 10 minutos (cookie `session-username`) |
| 7.5 | Console sem erros da aplicação | ⚠️ só os 404 do item 7.1 e um aviso de "Permissions policy" |
