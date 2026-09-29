import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { toast } from 'sonner';
import { AdminScreen } from './AdminScreen';
import { adminCompetitionService } from '../../services/adminCompetitionService';

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock('../../services/adminCompetitionService', () => ({
  adminCompetitionService: {
    list: vi.fn(),
    assets: vi.fn(),
    create: vi.fn(),
    close: vi.fn(),
  },
}));
// O formulário tem testes próprios; aqui basta saber como o painel o abre e reage.
vi.mock('../admin/NovaRodadaForm', () => ({
  NovaRodadaForm: (p: { proximoNumero: number; onCriada: (n: number) => void; onCancelar: () => void }) => (
    <div>
      <p>Formulário da rodada {p.proximoNumero}</p>
      <button onClick={() => p.onCriada(p.proximoNumero)}>Simular criação</button>
      <button onClick={p.onCancelar}>Cancelar</button>
    </div>
  ),
}));

const rodadas = [
  { id: 'c1', roundNumber: 1, status: 'revealed', scenarioTitle: 'Boom', startYear: 2004, endYear: 2011 },
  { id: 'c5', roundNumber: 5, status: 'open', scenarioTitle: 'Pandemia', startYear: 2020, endYear: 2024 },
];

describe('AdminScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(adminCompetitionService.list).mockResolvedValue({ data: rodadas } as never);
  });

  it('mostra o status das rodadas em português', async () => {
    render(<AdminScreen />);
    expect(await screen.findByText('Revelada')).toBeInTheDocument();
    expect(screen.getByText('Aberta')).toBeInTheDocument();
  });

  it('"Nova rodada" abre o formulário com o próximo número e recarrega a lista ao criar', async () => {
    const user = userEvent.setup();
    render(<AdminScreen />);
    await user.click(await screen.findByRole('button', { name: 'Nova rodada' }));

    expect(screen.getByText('Formulário da rodada 6')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Simular criação' }));

    expect(toast.success).toHaveBeenCalledWith('Rodada 6 criada como rascunho. Use "Iniciar" quando quiser abri-la.');
    expect(screen.queryByText('Formulário da rodada 6')).not.toBeInTheDocument();
    expect(adminCompetitionService.list).toHaveBeenCalledTimes(2);
  });

  it('quando uma ação falha, mostra o motivo que a API deu', async () => {
    vi.mocked(adminCompetitionService.close).mockRejectedValue({
      response: { data: { erro: 'A rodada precisa estar aberta para ser encerrada' } },
    });
    const user = userEvent.setup();
    render(<AdminScreen />);
    await user.click(await screen.findByRole('button', { name: 'Fechar' }));

    expect(toast.error).toHaveBeenCalledWith('A rodada precisa estar aberta para ser encerrada');
  });
});
