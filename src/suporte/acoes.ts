import { expect, type Locator } from '@playwright/test';

/**
 * Preenche um campo e CONFIRMA que o valor ficou nele.
 * Em navegadores mais lentos (WebKit), o React às vezes ainda não está pronto quando o campo aparece
 * e o texto digitado se perde. Repetir até o valor "pegar" elimina essa instabilidade sem esconder bug:
 * se o campo nunca aceitar o valor (ex.: BUG-04), a ação falha depois de 5 s com a mensagem do expect.
 */
export async function preencherCampo(campo: Locator, valor: string): Promise<void> {
  await expect(async () => {
    await campo.fill(valor);
    await expect(campo).toHaveValue(valor, { timeout: 1_000 });
  }).toPass({ timeout: 5_000 });
}

/** Clica (ou toca) e confirma o efeito esperado; repete o clique se a página ainda não reagia. */
export async function acionarAte(
  alvo: Locator,
  efeito: () => Promise<void>,
  { toque = false }: { toque?: boolean } = {},
): Promise<void> {
  await expect(async () => {
    await (toque ? alvo.tap() : alvo.click());
    await efeito();
  }).toPass({ timeout: 10_000 });
}
