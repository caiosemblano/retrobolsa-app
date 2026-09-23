import { format, parseISO } from 'date-fns';

/**
 * Formata uma data da API como dd/MM/aaaa.
 *
 * A API envia LocalDateTime com até 6 casas de fração de segundo
 * ("2026-09-20T14:30:00.123456"), e o Date nativo só garante esse formato com 3 —
 * fora disso, cada navegador decide, e há os que devolvem "Invalid Date".
 * O parseISO lê qualquer quantidade de casas, igual em todos.
 */
export function formatarData(iso: string): string {
  return format(parseISO(iso), 'dd/MM/yyyy');
}
