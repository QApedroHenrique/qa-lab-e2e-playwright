# Plano de teste — QA manual do Sauce Demo

| | |
|---|---|
| **Sistema sob teste** | Sauce Demo / Swag Labs — https://www.saucedemo.com (loja pública de treino da Sauce Labs) |
| **Versão** | A publicada em 2026-11-27 (o site não expõe número de versão) |
| **Tipo de teste** | Funcional manual (FQA), exploratório, visual e de acessibilidade |
| **Autor** | Pedro Henrique Barbosa dos Santos |
| **Estrutura** | Inspirada na ISO/IEC/IEEE 29119-3 (plano de teste), em versão enxuta |

---

## 1. Objetivo
Encontrar o que a suíte automatizada não encontra. A [automação](../../README.md) confirma a cada execução que os
fluxos previstos continuam funcionando. Este plano procura o que ninguém previu: problemas de **uso**, **visual**,
**acessibilidade**, **dados no limite** e **funcionalidades novas** que ainda não têm teste.

## 2. Escopo

**Dentro:**
| Área | Por quê |
|---|---|
| Checkout com dados no limite | Valida dados que viram pedido; a automação só testa vazio e válido |
| Navegação só com teclado | Requisito legal de acessibilidade em vários países; o axe-core não testa a navegação |
| **Dynamic Catalog** (Lazy Load, Spinner, Slider) | Área **nova**, sem nenhum teste |
| **Recibo em PDF** ("Generate PDF order") | Funcionalidade **nova**; documento que o cliente guarda |
| Comparação visual do `visual_user` | O equivalente a um FQA contra o Figma; teste de screenshot ficou fora da automação |
| Mobile (Pixel 7, iPhone 15) | Alvos de toque e layout das páginas novas |
| Comportamento HTTP | Achado durante a exploração; afeta monitoramento |

**Fora:** desempenho e carga, segurança (além de observar se HTML digitado é interpretado), API, e os defeitos
BUG-01 a BUG-12, que já são monitorados pela automação (só referenciados quando um achado novo se relaciona a eles).

## 3. Riscos que orientam a prioridade

| Risco | Probabilidade | Impacto | Prioridade | Como é coberto |
|---|---|---|---|---|
| Pedido registrado com dado inválido | Média | Alto (entrega falha) | 🔴 | CTM-CHK-01 a 03, sessão S1 |
| Cliente sem mouse não consegue comprar | Média | Alto (exclusão; risco legal) | 🔴 | CTM-CAR-01, CTM-ACS-01, sessão S2 |
| Área nova com defeitos não vistos | Alta | Médio | 🟡 | CTM-DIN-*, sessão S3 |
| Tela diferente do aprovado | Média | Médio (confiança) | 🟡 | CTM-VIS-*, sessão S4 |
| Recibo com dado errado | Baixa | Médio | 🟡 | CTM-REC-*, sessão S5 |
| Alvos pequenos no celular | Média | Baixo | 🟢 | CTM-MOB-*, sessão S5 |

## 4. Abordagem

1. **Exploratório baseado em sessão (SBTM):** uma sessão por risco, cada uma com um *charter* (missão), timebox de
   45 min e notas. Registro em [sessoes-exploratorias.md](sessoes-exploratorias.md).
2. **Casos roteirizados:** o que a exploração confirmou vira caso com passos e resultado esperado, para poder ser
   repetido por outra pessoa. Registro em [casos-de-teste.md](casos-de-teste.md).
3. **Técnicas ISTQB:** particionamento de equivalência e valor-limite nos campos, transição de estado na navegação
   (voltar, cancelar), suposição de erro (espaços, símbolos, URL inexistente).
4. **Comparação visual com referência:** captura lado a lado, no mesmo tamanho de janela, conferindo posição,
   tamanho, imagem, texto e alinhamento.
5. **Checklist de acessibilidade:** WCAG 2.2 AA, só os critérios que exigem uma pessoa (teclado, foco, rótulos,
   movimento, alvos). Registro em [checklist.md](checklist.md).

## 5. Oráculos: como saber o que é "certo" sem especificação
O Sauce Demo não tem documento de requisitos nem Figma público. Cada achado cita o oráculo usado:

| Oráculo | Uso |
|---|---|
| **Referência visual** | A tela do `standard_user` faz o papel do design aprovado |
| **Consistência interna** | O site contra ele mesmo (ex.: "$0" num lugar e "$0.00" no outro; Cancel com destinos diferentes) |
| **Regras já verificadas pela automação** | Imposto de 8%, campos obrigatórios, preços do catálogo (`src/dados/`) |
| **WCAG 2.2 nível AA** | Critérios citados pelo número em cada bug de acessibilidade |
| **Produtos comparáveis** | Convenções de e-commerce (recibo com número do pedido, quantidade editável) |

Quando nenhum oráculo condena o comportamento, ele vira **observação** (pergunta ao produto), não bug.

## 6. Ambiente
| Item | Valor |
|---|---|
| Navegadores | Chromium (principal), Firefox e WebKit, versões do Playwright 1.65 |
| Desktop | Janela de 1280×720 |
| Mobile | Pixel 7 e iPhone 15, emulados (viewport, toque e user agent) |
| Usuários | `standard_user`; `visual_user` para a comparação visual (senha `secret_sauce`) |
| Ferramentas | DevTools (atributos, estilos, foco), `curl` (status HTTP), leitor de PDF |
| Fuso da máquina | UTC−3 (relevante para o BUG-25) |

## 7. Critérios
- **Entrada:** site no ar; os 4 usuários respondem; a suíte automatizada está verde (então o caminho feliz funciona
  e a exploração pode focar no resto).
- **Suspensão:** site fora do ar ou mudança grande de layout durante a execução. Os achados são revalidados antes
  de continuar.
- **Saída:** todas as áreas do escopo exploradas; todo caso executado; todo bug com evidência e reproduzido pelo
  menos 2 vezes (ou em 2 navegadores); toda hipótese descartada registrada.

## 8. Severidade e prioridade
São coisas diferentes: severidade é o **impacto** para quem usa; prioridade é a **ordem de correção**, que também
considera esforço e contexto.

| Severidade | Critério |
|---|---|
| 🔴 Alta | Impede comprar, cobra errado ou burla uma validação |
| 🟡 Média | Atrapalha o uso ou exclui um grupo de usuários de uma parte do site, com contorno possível |
| 🟢 Baixa | Cosmético, de conteúdo ou técnico, sem impedir o uso |

| Prioridade | Quando |
|---|---|
| P1 | Corrigir antes de liberar |
| P2 | Próxima entrega |
| P3 | Backlog |

## 9. Entregáveis
| Documento | Conteúdo |
|---|---|
| [README.md](README.md) | Resumo do estudo, achados e recomendação |
| Este plano | Escopo, riscos, abordagem, oráculos |
| [casos-de-teste.md](casos-de-teste.md) | 38 casos com status e observações |
| [sessoes-exploratorias.md](sessoes-exploratorias.md) | 5 sessões com charter e notas |
| [bugs/](bugs/) | 13 bug reports (BUG-13 a BUG-25) com evidência |
| [checklist.md](checklist.md) | Checklist reaproveitável com o resultado desta rodada |
| [evidencias/](evidencias/) | Prints anotados e recibos em PDF |

## 10. Premissas e limitações
- O site é de treino e alguns usuários têm defeitos **de propósito** (`problem_user`, `visual_user`…). Os achados
  com `standard_user` são os mais relevantes, porque é o usuário que deveria funcionar.
- Leitores de tela reais (NVDA, VoiceOver) não foram usados. A verificação de acessibilidade se baseou em atributos
  ARIA e no comportamento do teclado; um teste com leitor de tela é o próximo passo recomendado.
- O mobile foi emulado, não testado em aparelho físico.
