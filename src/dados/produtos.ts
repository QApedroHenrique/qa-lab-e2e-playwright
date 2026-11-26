/**
 * Catálogo esperado (oráculo dos testes). Preços em CENTAVOS para não comparar float.
 * O `slug` compõe o data-test dos botões: add-to-cart-<slug> / remove-<slug>.
 */
export interface Produto {
  id: number;
  slug: string;
  nome: string;
  precoCentavos: number;
}

export const PRODUTOS = {
  mochila: { id: 4, slug: 'sauce-labs-backpack', nome: 'Sauce Labs Backpack', precoCentavos: 2999 },
  lanterna: { id: 0, slug: 'sauce-labs-bike-light', nome: 'Sauce Labs Bike Light', precoCentavos: 999 },
  camiseta: { id: 1, slug: 'sauce-labs-bolt-t-shirt', nome: 'Sauce Labs Bolt T-Shirt', precoCentavos: 1599 },
  jaqueta: { id: 5, slug: 'sauce-labs-fleece-jacket', nome: 'Sauce Labs Fleece Jacket', precoCentavos: 4999 },
  macacao: { id: 2, slug: 'sauce-labs-onesie', nome: 'Sauce Labs Onesie', precoCentavos: 799 },
  camisetaVermelha: {
    id: 3,
    slug: 'test.allthethings()-t-shirt-(red)',
    nome: 'Test.allTheThings() T-Shirt (Red)',
    precoCentavos: 1599,
  },
} as const satisfies Record<string, Produto>;

export const TODOS_OS_PRODUTOS: Produto[] = Object.values(PRODUTOS);

/** Alíquota de imposto aplicada no checkout do site (8%). */
export const ALIQUOTA_IMPOSTO = 0.08;
