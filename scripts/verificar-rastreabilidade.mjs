/**
 * Verifica a RASTREABILIDADE entre testes e documentação:
 *  - todo caso automatizado ([CT-XXX-NN] no nome do teste) precisa estar em docs/casos-de-teste.md;
 *  - todo caso documentado precisa existir na suíte;
 *  - todo BUG citado nos testes precisa estar no relatório de defeitos.
 * Roda no CI: se alguém criar um teste sem documentar (ou o contrário), o pipeline falha.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const raiz = join(import.meta.dirname, '..');
const ler = (caminho) => readFileSync(join(raiz, caminho), 'utf8');

const nosTestes = new Map();
const bugsNosTestes = new Set();
for (const arquivo of readdirSync(join(raiz, 'tests')).filter((n) => n.endsWith('.spec.ts'))) {
  const conteudo = ler(join('tests', arquivo));
  for (const [, id] of conteudo.matchAll(/\[(CT-[A-Z]{3}-\d{2})\]/g)) nosTestes.set(id, `tests/${arquivo}`);
  for (const [, id] of conteudo.matchAll(/'(BUG-\d{2})'/g)) bugsNosTestes.add(id);
}

const linhasDoc = ler('docs/casos-de-teste.md').split('\n');
const naDocumentacao = new Set(
  linhasDoc.map((l) => /^\|\s*(CT-[A-Z]{3}-\d{2})\s*\|/.exec(l)?.[1]).filter(Boolean),
);
const bugsNoRelatorio = new Set(
  ler('docs/relatorio-de-defeitos.md')
    .split('\n')
    .map((l) => /^\|\s*(BUG-\d{2})\s*\|/.exec(l)?.[1])
    .filter(Boolean),
);

const problemas = [
  ...[...nosTestes.keys()].filter((id) => !naDocumentacao.has(id)).map((id) => `${id} está em ${nosTestes.get(id)} mas não em docs/casos-de-teste.md`),
  ...[...naDocumentacao].filter((id) => !nosTestes.has(id)).map((id) => `${id} está documentado mas não existe na suíte`),
  ...[...bugsNosTestes].filter((id) => !bugsNoRelatorio.has(id)).map((id) => `${id} é citado nos testes mas não está no relatório de defeitos`),
  ...[...bugsNoRelatorio].filter((id) => !bugsNosTestes.has(id)).map((id) => `${id} está no relatório mas nenhum teste o monitora`),
];

console.log(`Casos nos testes: ${nosTestes.size} | documentados: ${naDocumentacao.size} | defeitos monitorados: ${bugsNosTestes.size}`);
if (problemas.length) {
  console.error('\n✖ Rastreabilidade quebrada:');
  for (const p of problemas.sort()) console.error(`   ${p}`);
  process.exit(1);
}
console.log('✔ Rastreabilidade completa: testes, casos documentados e defeitos batem.');
