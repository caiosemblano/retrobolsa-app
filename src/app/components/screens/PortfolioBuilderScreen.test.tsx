import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router';
import { PortfolioBuilderScreen } from './PortfolioBuilderScreen';
import { competitionService } from '../../services/competitionService';
import { portfolioService } from '../../services/portfolioService';
import { Competition } from '../../types';

vi.mock('../../services/competitionService', () => ({ competitionService: { getActive: vi.fn() } }));
vi.mock('../../services/portfolioService', () => ({
  portfolioService: { getCurrent: vi.fn(), submit: vi.fn(), update: vi.fn() },
}));

const rodada: Competition = {
  id: 'c1',
  round: 3,
  status: 'open',
  budget: 100000,
  economicContext: { title: 'Crise de 2015', indicators: [] },
  assets: [
    { id: 'a1', type: 'stock', anonymousName: 'Empresa A' },
    { id: 't1', type: 'bond', anonymousName: 'Título 1', bondType: 'Selic', rate: 0.1425 },
  ],
};

const renderizar = async (titulo: string) => {
  vi.mocked(competitionService.getActive).mockResolvedValue({ data: rodada } as never);
  const onConfirm = vi.fn();
  render(
    <MemoryRouter>
      <PortfolioBuilderScreen onConfirm={onConfirm} onBack={vi.fn()} />
    </MemoryRouter>,
  );
  await screen.findByRole('heading', { name: titulo });
  return { onConfirm, user: userEvent.setup() };
};

describe('PortfolioBuilderScreen na rodada de verdade', () => {
  beforeEach(() => vi.clearAllMocks());

  it('sem carteira enviada, monta e envia a primeira', async () => {
    vi.mocked(portfolioService.getCurrent).mockResolvedValue(null);
    vi.mocked(portfolioService.submit).mockResolvedValue({ data: { message: 'Carteira submetida com sucesso' } } as never);
    const { onConfirm, user } = await renderizar('Monte sua carteira');

    await user.click(screen.getByRole('button', { name: 'Investir em Título 1' }));
    const campo = await screen.findByLabelText('Valor a investir (R$)');
    await user.clear(campo);
    await user.type(campo, '100000');
    await user.click(screen.getByRole('button', { name: 'Alocar' }));
    await user.click(screen.getByRole('button', { name: 'Confirmar carteira' }));

    expect(portfolioService.submit).toHaveBeenCalledWith({
      competitionId: 'c1',
      allocations: [{ assetId: 't1', amount: 100000 }],
    });
    expect(portfolioService.update).not.toHaveBeenCalled();
    expect(onConfirm).toHaveBeenCalled();
  });

  it('com carteira já enviada, abre preenchida e salva a edição com o PUT', async () => {
    vi.mocked(portfolioService.getCurrent).mockResolvedValue({ competitionId: 'c1', portfolio: { a1: 70000, t1: 30000 } });
    vi.mocked(portfolioService.update).mockResolvedValue({ data: { message: 'Carteira atualizada com sucesso' } } as never);
    const { onConfirm, user } = await renderizar('Edite sua carteira');

    expect(screen.getByText(/Você já enviou uma carteira nesta rodada/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Alterar valor em Empresa A' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Remover alocação em Título 1' }));
    await user.click(screen.getByRole('button', { name: 'Salvar alterações' }));

    expect(portfolioService.update).toHaveBeenCalledWith({
      competitionId: 'c1',
      allocations: [{ assetId: 'a1', amount: 70000 }],
    });
    expect(portfolioService.submit).not.toHaveBeenCalled();
    expect(onConfirm).toHaveBeenCalled();
  });

  it('a carteira de uma rodada anterior não preenche a montagem da atual', async () => {
    vi.mocked(portfolioService.getCurrent).mockResolvedValue({ competitionId: 'outra', portfolio: { a1: 70000 } });
    await renderizar('Monte sua carteira');

    expect(screen.getByRole('button', { name: 'Investir em Empresa A' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirmar carteira' })).toBeDisabled();
  });
});
