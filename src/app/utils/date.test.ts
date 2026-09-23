import { describe, expect, it } from 'vitest';
import { formatarData } from './date';

describe('formatarData', () => {
  it('lê o LocalDateTime da API com 6 casas de fração de segundo', () => {
    expect(formatarData('2026-09-20T14:30:00.123456')).toBe('20/09/2026');
  });

  it('lê datas sem fração e datas sem hora', () => {
    expect(formatarData('2026-01-05T08:00:00')).toBe('05/01/2026');
    expect(formatarData('2026-12-31')).toBe('31/12/2026');
  });

  it('não empurra o fim do dia para o dia seguinte', () => {
    expect(formatarData('2026-03-10T23:59:59.999999')).toBe('10/03/2026');
  });
});
