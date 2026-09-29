import { afterEach, describe, expect, it, vi } from 'vitest';
import { compartilharResultado, frenteAoCdi, montarSvg } from './compartilhar';

describe('cartão do resultado', () => {
  afterEach(() => vi.restoreAllMocks());

  it('compara com o CDI em pontos percentuais', () => {
    expect(frenteAoCdi(16.7, 30.7)).toBe('14 p.p. abaixo do CDI');
    expect(frenteAoCdi(12.35, 7.31)).toBe('5 p.p. acima do CDI');
    expect(frenteAoCdi(7.33, 7.31)).toBe('Empatou com o CDI');
  });

  it('o SVG traz a rentabilidade, o período, o CDI e o nível', () => {
    const svg = montarSvg({ rentabilidade: 16.7, cdi: 30.7, periodo: '2011–2013', nivel: 3, tituloDoNivel: 'Estagiário' });

    expect(svg).toContain('width="1080"');
    expect(svg).toContain('+16,7%');
    expect(svg).toContain('Minha carteira em 2011–2013');
    expect(svg).toContain('14 p.p. abaixo do CDI');
    expect(svg).toContain('O CDI rendeu +30,7% no período');
    expect(svg).toContain('Nível 3 · Estagiário');
    // Negativo em vermelho, positivo em verde.
    expect(svg).toContain('fill="#22c55e">+16,7%');
    expect(montarSvg({ rentabilidade: -4.2, periodo: '2014–2016' })).toContain('fill="#f4626f">-4,2%');
  });

  it('sem CDI nem nível, essas linhas não aparecem; textos são escapados', () => {
    const svg = montarSvg({ rentabilidade: 3, periodo: '<2020>' });
    expect(svg).not.toContain('CDI');
    expect(svg).not.toContain('Nível');
    expect(svg).toContain('&lt;2020&gt;');
  });

  it('sem o menu de compartilhar do aparelho, baixa a imagem', async () => {
    Object.assign(URL, { createObjectURL: vi.fn(() => 'blob:x'), revokeObjectURL: vi.fn() });
    const clique = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);
    const png = async () => new Blob(['png'], { type: 'image/png' });

    expect(await compartilharResultado({ rentabilidade: 5, periodo: '2020–2021' }, png)).toBe('baixado');
    expect(clique).toHaveBeenCalled();
  });

  it('com o menu de compartilhar, manda a imagem com um texto', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { share, canShare: () => true });
    const png = async () => new Blob(['png'], { type: 'image/png' });

    expect(await compartilharResultado({ rentabilidade: 5, periodo: '2020–2021' }, png)).toBe('compartilhado');
    expect(share).toHaveBeenCalledWith(expect.objectContaining({
      text: 'Minha carteira rendeu +5% em 2020–2021 no RetroBolsa.',
      files: [expect.any(File)],
    }));
    Object.assign(navigator, { share: undefined, canShare: undefined });
  });
});
