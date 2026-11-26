import { defineConfig, devices } from '@playwright/test';

const CI = !!process.env.CI;

/**
 * Projetos (navegadores/dispositivos):
 * - chromium: suíte completa + acessibilidade + defeitos conhecidos (o defeito é do site, não do navegador).
 * - firefox / webkit: fluxos funcionais (compatibilidade entre navegadores).
 * - mobile-chrome / mobile-safari: fluxos funcionais + testes específicos de layout mobile.
 */
const SO_CHROMIUM = [/acessibilidade\.spec\.ts/, /defeitos-conhecidos\.spec\.ts/];
const SO_MOBILE = /mobile\.spec\.ts/;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: CI,
  // Site público: 1 nova tentativa no CI absorve instabilidade de rede, e o relatório marca o teste como "flaky"
  retries: CI ? 1 : 0,
  workers: CI ? 4 : undefined,
  timeout: 30_000,
  expect: { timeout: 7_000 },
  // No CI cada projeto roda num job separado e gera um "blob"; o job final junta tudo num único relatório HTML
  reporter: CI
    ? [['list'], ['github'], ['blob', { fileName: `relatorio-${process.env.PROJETO ?? 'ci'}.zip` }]]
    : [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: process.env.BASE_URL ?? 'https://www.saucedemo.com',
    testIdAttribute: 'data-test', // o site usa data-test="..." nos elementos
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] }, testIgnore: SO_MOBILE },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] }, testIgnore: [SO_MOBILE, ...SO_CHROMIUM] },
    { name: 'webkit', use: { ...devices['Desktop Safari'] }, testIgnore: [SO_MOBILE, ...SO_CHROMIUM] },
    { name: 'mobile-chrome', use: { ...devices['Pixel 7'] }, testIgnore: SO_CHROMIUM },
    { name: 'mobile-safari', use: { ...devices['iPhone 15'] }, testIgnore: SO_CHROMIUM },
  ],
});
