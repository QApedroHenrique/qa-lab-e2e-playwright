/** Mensagens exibidas pelo site (em inglês, como no sistema sob teste). */
export const MENSAGENS = {
  usuarioObrigatorio: 'Epic sadface: Username is required',
  senhaObrigatoria: 'Epic sadface: Password is required',
  credenciaisInvalidas: 'Epic sadface: Username and password do not match any user in this service',
  usuarioBloqueado: 'Epic sadface: Sorry, this user has been locked out.',
  acessoSemLogin: (caminho: string) => `Epic sadface: You can only access '${caminho}' when you are logged in.`,
  nomeObrigatorio: 'Error: First Name is required',
  sobrenomeObrigatorio: 'Error: Last Name is required',
  cepObrigatorio: 'Error: Postal Code is required',
  pedidoConcluido: 'Thank you for your order!',
} as const;
