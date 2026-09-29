import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SimulationWaitScreen } from './SimulationWaitScreen';
import { portfolioService } from '../../services/portfolioService';

vi.mock('../../services/portfolioService', () => ({
  portfolioService: { getLastResult: vi.fn(), getCurrent: vi.fn() },
}));

const aindaSemResultado = () =>
  vi.mocked(portfolioService.getLastResult).mockRejectedValue({ response: { status: 400 } });

describe('SimulationWaitScreen', () => {
  beforeEach(() => vi.clearAllMocks());

  it('com o mercado aberto, oferece editar a carteira enviada', async () => {
    aindaSemResultado();
    vi.mocked(portfolioService.getCurrent).mockResolvedValue({ competitionId: 'c1', portfolio: { a1: 50000 } });
    const onEdit = vi.fn();
    render(<SimulationWaitScreen onViewResults={vi.fn()} onBack={vi.fn()} onEdit={onEdit} />);

    await userEvent.setup().click(await screen.findByRole('button', { name: 'Editar carteira' }));
    expect(onEdit).toHaveBeenCalled();
  });

  it('com o mercado fechado, não há o que editar', async () => {
    aindaSemResultado();
    vi.mocked(portfolioService.getCurrent).mockResolvedValue(null);
    render(<SimulationWaitScreen onViewResults={vi.fn()} onBack={vi.fn()} onEdit={vi.fn()} />);

    await screen.findByText(/aguardando a simulação/);
    expect(portfolioService.getCurrent).toHaveBeenCalled();
    expect(screen.queryByRole('button', { name: 'Editar carteira' })).not.toBeInTheDocument();
  });
});
