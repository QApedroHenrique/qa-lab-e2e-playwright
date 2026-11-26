import { type Page } from '@playwright/test';
import { Cabecalho } from './componentes/Cabecalho';

/** Base das páginas logadas: todas têm o mesmo cabeçalho. */
export abstract class PaginaBase {
  readonly cabecalho: Cabecalho;

  constructor(protected readonly page: Page) {
    this.cabecalho = new Cabecalho(page);
  }
}
