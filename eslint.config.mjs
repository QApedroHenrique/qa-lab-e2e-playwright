import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';

export default tseslint.config(
  { ignores: ['node_modules', 'playwright-report', 'test-results', 'scripts'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['tests/**/*.ts'],
    ...playwright.configs['flat/recommended'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      // Regras que pegam os erros mais comuns em E2E
      'playwright/no-wait-for-timeout': 'error', // nada de sleep fixo
      'playwright/no-force-option': 'error', // não "forçar" clique em elemento invisível
      'playwright/prefer-web-first-assertions': 'error', // asserções com retry automático
      'playwright/no-conditional-in-test': 'error',
      'playwright/expect-expect': ['error', { assertFunctionNames: ['expect*', 'validar*'] }],
    },
  },
);
