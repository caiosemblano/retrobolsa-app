import { ComponentType } from 'react';
import {
  Balanca,
  Capelo,
  Carteira,
  Divisas,
  Foguete,
  GraficoEmAlta,
  LivroAberto,
  Medalha,
  PilhaDeMoedas,
  Pizza,
  Podio,
  Trofeu,
} from './art/pictograms';

/**
 * Pictograma de cada conquista, pelo `code` da API. As chaves precisam cobrir o
 * catálogo do backend (AchievementCodes / V9) — o teste do AchievementBadge confere.
 */
export const artRegistry: Record<string, ComponentType> = {
  PRIMEIRA_CARTEIRA: Carteira,
  TUDO_INVESTIDO: PilhaDeMoedas,
  PRIMEIRA_AULA: LivroAberto,
  NO_AZUL: GraficoEmAlta,
  EQUILIBRISTA: Balanca,
  DIVERSIFICADOR: Pizza,
  DOIS_DIGITOS: Foguete,
  VETERANO: Divisas,
  PODIO: Podio,
  MODULO_COMPLETO: Medalha,
  CAMPEAO_RODADA: Trofeu,
  FORMADO: Capelo,
};
