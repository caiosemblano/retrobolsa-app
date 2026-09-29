import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router';
import { AssetCard } from './AssetCard';
import { Asset } from '../types';

const acao: Asset = {
  id: 'a1',
  type: 'stock',
  anonymousName: 'Empresa A',
  sector: 'Mineração',
  indicators: {
    pl: 8.3,
    roe: 32.1,
    dividendYield: 4.2,
    lvp: 2.66,
    lucroPositivo: true,
    cagrLucro: 0.28,
    cagrReceita: 0.22,
    margemEbitda: 42.1,
  },
};

const titulo: Asset = { id: 't1', type: 'bond', anonymousName: 'Título 2', bondType: 'IPCA+', rate: 0.0725 };

const renderizar = (asset: Asset, props: Partial<React.ComponentProps<typeof AssetCard>> = {}) => {
  const onClick = vi.fn();
  render(
    <MemoryRouter>
      <AssetCard asset={asset} onClick={onClick} {...props} />
    </MemoryRouter>,
  );
  return { onClick, user: userEvent.setup() };
};

describe('AssetCard', () => {
  it('mostra primeiro os indicadores que as aulas ensinam: P/L, ROE e DY', () => {
    renderizar(acao);

    expect(screen.getByRole('button', { name: /O que é P\/L/ })).toBeInTheDocument();
    expect(screen.getByText('8,3')).toBeInTheDocument();
    expect(screen.getByText('32,1%')).toBeInTheDocument();
    expect(screen.getByText('4,2%')).toBeInTheDocument();
    // Os demais ficam recolhidos.
    expect(screen.queryByText('2,66')).not.toBeInTheDocument();
  });

  it('"ver todos" abre P/VP, margem, crescimento e lucro, e fecha de novo', async () => {
    const { user, onClick } = renderizar(acao);

    const alternar = screen.getByRole('button', { name: /Ver todos os indicadores/ });
    expect(alternar).toHaveAttribute('aria-expanded', 'false');
    await user.click(alternar);

    expect(alternar).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: /O que é P\/VP/ })).toBeInTheDocument();
    expect(screen.getByText('2,66')).toBeInTheDocument();
    expect(screen.getByText('42,1%')).toBeInTheDocument();
    expect(screen.getByText('28% a.a.')).toBeInTheDocument();
    expect(screen.getByText('Sim')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Ver menos' }));
    expect(screen.queryByText('2,66')).not.toBeInTheDocument();
    // Abrir e fechar os indicadores não escolhe o ativo.
    expect(onClick).not.toHaveBeenCalled();
  });

  it('indicador ausente aparece como traço', () => {
    renderizar({ ...acao, indicators: { pl: 12 } });
    expect(screen.getAllByText('—')).toHaveLength(2);
  });

  it('tocar no card escolhe o ativo; tocar numa sigla só explica', async () => {
    const { user, onClick } = renderizar(acao);

    await user.click(screen.getByRole('button', { name: /O que é ROE/ }));
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByText(/lucro a empresa gera por ano/)).toBeInTheDocument();

    await user.keyboard('{Escape}');
    await user.click(screen.getByRole('button', { name: 'Investir em Empresa A' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('com valor alocado, o botão diz que vai alterar e fica marcado', () => {
    renderizar(acao, { allocatedAmount: 25000 });
    const botao = screen.getByRole('button', { name: 'Alterar valor em Empresa A' });
    expect(botao).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText(/R\$ 25\.000/)).toBeInTheDocument();
  });

  it('título mostra a taxa e explica o tipo de título', () => {
    renderizar(titulo);

    expect(screen.getByText('7,25% a.a.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /O que é Título IPCA\+/ })).toHaveTextContent('IPCA+');
    expect(screen.queryByRole('button', { name: /Ver todos/ })).not.toBeInTheDocument();
  });
});
