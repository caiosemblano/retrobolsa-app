/** Endereços do app. Centralizados aqui para que telas e testes não repitam strings soltas. */
export const rotas = {
  inicio: '/',
  contexto: '/rodada/contexto',
  carteira: '/rodada/carteira',
  aguardando: '/rodada/aguardando',
  resultado: '/rodada/resultado',
  treinar: '/treinar',
  treino: (rodadaId: string) => `/treinar/${rodadaId}`,
  aprender: '/aprender',
  modulo: (moduloId: string) => `/aprender/${moduloId}`,
  aula: (moduloId: string, aulaId: string) => `/aprender/${moduloId}/${aulaId}`,
  rankings: '/rankings',
  perfil: '/perfil',
  admin: '/admin',
  entrar: '/entrar',
  cadastro: '/cadastro',
} as const;
