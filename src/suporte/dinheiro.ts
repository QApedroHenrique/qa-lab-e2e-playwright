/**
 * Converte textos de preço do site em CENTAVOS (inteiro):
 * "$29.99" → 2999 · "Item total: $39.98" → 3998 · "Tax: $3.20" → 320.
 * Comparar inteiros evita erro de arredondamento de ponto flutuante.
 */
export function paraCentavos(texto: string): number {
  const encontrado = /\$(\d+)\.(\d{2})/.exec(texto);
  if (!encontrado) throw new Error(`Preço não encontrado em "${texto}"`);
  return Number(encontrado[1]) * 100 + Number(encontrado[2]);
}

/** Imposto esperado em centavos, arredondado para o centavo mais próximo. */
export function impostoEsperado(subtotalCentavos: number, aliquota: number): number {
  return Math.round(subtotalCentavos * aliquota);
}
