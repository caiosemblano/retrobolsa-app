import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router';
import { Termo } from './Termo';
import { glossario, termoDoIndicador, termoDoTitulo } from '../content/glossario';
import { rotas } from '../routes';

const renderizar = (ui: React.ReactNode) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('Termo', () => {
  it('mostra a sigla e, ao tocar, explica o que é, como ler e leva à aula', async () => {
    const user = userEvent.setup();
    renderizar(<Termo id="ROE" />);

    const gatilho = screen.getByRole('button', { name: 'O que é ROE (Retorno sobre o Patrimônio)?' });
    expect(gatilho).toHaveTextContent('ROE');
    await user.click(gatilho);

    expect(screen.getByText(glossario.ROE.oQueE)).toBeInTheDocument();
    expect(screen.getByText(glossario.ROE.comoLer)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Assistir à aula' })).toHaveAttribute(
      'href',
      rotas.aula(glossario.ROE.aula.moduloId, glossario.ROE.aula.aulaId),
    );
  });

  it('verbete sem aula não mostra o link', async () => {
    const user = userEvent.setup();
    renderizar(<Termo id="PVP" />);

    await user.click(screen.getByRole('button', { name: /O que é P\/VP/ }));

    expect(screen.getByText(glossario.PVP.oQueE)).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Assistir à aula' })).not.toBeInTheDocument();
  });

  it('aceita outro texto no lugar da sigla', () => {
    renderizar(<Termo id="IPCA">Inflação (IPCA)</Termo>);
    expect(screen.getByRole('button', { name: /O que é Inflação/ })).toHaveTextContent('Inflação (IPCA)');
  });
});

describe('glossário', () => {
  it('toda aula citada aponta para um ID de aula e de módulo do seed', () => {
    for (const verbete of Object.values(glossario)) {
      if (!('aula' in verbete)) continue;
      expect(verbete.aula.moduloId).toMatch(/^aaaaaaaa-000\d-0000-0000-00000000000\d$/);
      expect(verbete.aula.aulaId).toMatch(/^bbbbbbbb-000\d-0000-0000-00000000000\d$/);
    }
  });

  it('acha o verbete do tipo de título e do indicador econômico como a API envia', () => {
    expect(termoDoTitulo('Prefixado')).toBe('PREFIXADO');
    expect(termoDoTitulo('IPCA+')).toBe('IPCA_MAIS');
    expect(termoDoTitulo('Selic')).toBe('TESOURO_SELIC');
    expect(termoDoTitulo('Debênture')).toBeNull();
    expect(termoDoTitulo(undefined)).toBeNull();

    expect(termoDoIndicador('SELIC')).toBe('SELIC');
    expect(termoDoIndicador('DOLAR')).toBe('DOLAR');
    expect(termoDoIndicador('DESCONHECIDO')).toBeNull();
  });
});
