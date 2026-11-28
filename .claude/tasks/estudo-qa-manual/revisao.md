# Revisão — Estudo de caso de QA manual

**Veredito:** aprovado com ressalvas

## Checklist adaptado (documentação em vez de código)
1. **Critérios de aceite:** plano, casos, sessões, bugs, checklist e decisão de automação existem e se referenciam. ✅
2. **Oráculo:** cada bug cita de onde vem o "esperado" (referência visual, WCAG pelo número, consistência interna ou
   regra já automatizada). Os comportamentos sem oráculo viraram observação (O-01 a O-07), não bug. ✅
3. **Evidência:** todas as imagens foram conferidas depois de geradas. Uma foi refeita (slider capturado no meio da
   transição) e uma etiqueta cortada foi corrigida. ✅
4. **Números conferidos na fonte:** espaçamento dos pontos do slider (10 px, e não ~4 px como no primeiro rascunho),
   estilo de foco dos 5 elementos, `h1` por página e totais da tabela de casos foram recontados. ✅
5. **Duplicidade:** os achados relacionados a BUG-04, 05, 07 e 09 apontam para eles em vez de criar números novos. ✅
6. **Rastreabilidade da automação:** `npm run docs:verificar` passa; a tabela de `relatorio-de-defeitos.md` não
   ganhou linhas sem teste. ✅
7. **Links:** 152 links relativos e âncoras conferidos por script; nenhum quebrado nos arquivos novos. ✅

## Ressalvas
| Severidade | Onde | Ponto | Sugestão |
|---|---|---|---|
| 🟡 | `docs/qa-manual/` | A execução foi feita por navegador controlado (dito explicitamente no README do estudo). | Antes de publicar, o autor reproduz cada bug à mão, para conseguir defender cada um numa entrevista. |
| 🟢 | BUG-16, BUG-21 | Sem teste com leitor de tela real. | Uma rodada com NVDA confirmaria o impacto descrito. |
| 🟢 | Site público | O site pode mudar e invalidar os passos. | Data e ambiente estão em cada bug; revalidar antes de citar o estudo. |
