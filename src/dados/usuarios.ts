/**
 * Usuários públicos do Sauce Demo (estão na própria tela de login).
 * Cada um simula um cenário: alguns têm defeitos de propósito, ótimos para mostrar testes que acham bug.
 */
export const SENHA = 'secret_sauce';

export const USUARIOS = {
  padrao: 'standard_user',
  bloqueado: 'locked_out_user',
  comProblema: 'problem_user',
  lento: 'performance_glitch_user',
  comErro: 'error_user',
  visual: 'visual_user',
} as const;

export type Usuario = (typeof USUARIOS)[keyof typeof USUARIOS];
