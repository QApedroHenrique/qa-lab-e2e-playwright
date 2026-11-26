/**
 * Gera um resumo em Markdown a partir do JSON do Playwright (usado no resumo do job do GitHub Actions).
 * Uso: node scripts/resumo-execucao.mjs playwright-report/resultado.json
 */
import { readFileSync } from 'node:fs';

const relatorio = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const { expected = 0, unexpected = 0, flaky = 0, skipped = 0, duration = 0 } = relatorio.stats ?? {};

// Testes marcados com test.fail (defeitos conhecidos) contam como "expected" quando falham como esperado
let defeitosMonitorados = 0;
const visitar = (suite) => {
  for (const spec of suite.specs ?? []) {
    for (const t of spec.tests ?? []) if (t.expectedStatus === 'failed' && t.status === 'expected') defeitosMonitorados += 1;
  }
  for (const filha of suite.suites ?? []) visitar(filha);
};
for (const suite of relatorio.suites ?? []) visitar(suite);

const status = unexpected === 0 ? '✅ Todos os testes se comportaram como esperado' : `❌ ${unexpected} teste(s) falharam`;
console.log(`## Resultado E2E\n\n${status}\n`);
console.log('| Passou | Defeitos conhecidos confirmados (`test.fail`) | Instáveis (passaram na 2ª tentativa) | Falhou | Pulado | Duração |');
console.log('|---:|---:|---:|---:|---:|---:|');
console.log(
  `| ${expected - defeitosMonitorados} | ${defeitosMonitorados} | ${flaky} | ${unexpected} | ${skipped} | ${(duration / 1000).toFixed(0)} s |`,
);
