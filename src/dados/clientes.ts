/** Dados fictícios de entrega para o checkout. */
export interface Cliente {
  nome: string;
  sobrenome: string;
  cep: string;
}

export const CLIENTE_VALIDO: Cliente = { nome: 'Ana', sobrenome: 'Teste', cep: '01310-100' };
