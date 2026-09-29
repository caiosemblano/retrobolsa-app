import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { anosFaltando, NovaRodadaForm, prazoPadrao, validar } from './NovaRodadaForm';
import { adminCompetitionService, AdminAsset } from '../../services/adminCompetitionService';

vi.mock('../../services/adminCompetitionService', () => ({
  adminCompetitionService: { assets: vi.fn(), create: vi.fn() },
}));

const anos = (de: number, ate: number) => Array.from({ length: ate - de + 1 }, (_, i) => de + i);

const ativos: AdminAsset[] = [
  { id: 'a1', anonymousName: 'Empresa A', realName: 'Vale S.A.', ticker: 'VALE3', type: 'stock', sector: 'Mineração', years: anos(2004, 2023) },
  { id: 'a2', anonymousName: 'Empresa B', realName: 'Magazine Luiza', ticker: 'MGLU3', type: 'stock', sector: 'Varejo', years: anos(2014, 2023) },
  { id: 't1', anonymousName: 'Título 1', realName: 'Tesouro Selic', type: 'bond', bondType: 'Selic', years: anos(2004, 2023) },
];

const renderizar = async () => {
  vi.mocked(adminCompetitionService.assets).mockResolvedValue({ data: ativos } as never);
  const onCriada = vi.fn();
  render(<NovaRodadaForm proximoNumero={7} onCriada={onCriada} onCancelar={vi.fn()} />);
  await screen.findByRole('checkbox', { name: /Empresa A/ });
  return { onCriada, user: userEvent.setup() };
};

const preencher = async (user: ReturnType<typeof userEvent.setup>, inicio: string, fim: string) => {
  await user.type(screen.getByLabelText('Título do cenário'), 'Crise de 2015');
  await user.type(screen.getByLabelText('Descrição do cenário'), 'Recessão e juros altos.');
  await user.type(screen.getByLabelText('Ano inicial'), inicio);
  await user.type(screen.getByLabelText('Ano final'), fim);
};

describe('NovaRodadaForm', () => {
  beforeEach(() => vi.clearAllMocks());

  it('cria a rodada com os campos e os ativos escolhidos', async () => {
    vi.mocked(adminCompetitionService.create).mockResolvedValue({ data: {} } as never);
    const { onCriada, user } = await renderizar();

    expect(screen.getByLabelText('Número da rodada')).toHaveValue(7);
    await preencher(user, '2015', '2018');
    expect(screen.getByText('O jogo simula de 2015 a 2017; 2018 é só o ponto de chegada do gráfico.')).toBeInTheDocument();
    await user.click(screen.getByRole('checkbox', { name: /Empresa A · Vale S\.A\. \(VALE3\)/ }));
    await user.click(screen.getByRole('checkbox', { name: /Título 1/ }));
    expect(screen.getByText('(2 escolhidos)')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Criar rodada' }));

    expect(adminCompetitionService.create).toHaveBeenCalledWith({
      roundNumber: 7,
      budget: 100000,
      scenarioTitle: 'Crise de 2015',
      scenarioDescription: 'Recessão e juros altos.',
      startYear: 2015,
      endYear: 2018,
      endsAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T23:59$/),
      assetIds: ['a1', 't1'],
    });
    expect(onCriada).toHaveBeenCalledWith(7);
  });

  it('ativo sem dados em algum ano do período fica bloqueado e diz quais anos faltam', async () => {
    const { user } = await renderizar();
    await preencher(user, '2012', '2016');

    const magalu = screen.getByRole('checkbox', { name: /Empresa B/ });
    expect(magalu).toBeDisabled();
    expect(magalu).toHaveAccessibleDescription(/sem dados em 2012, 2013/);
    expect(screen.getByRole('checkbox', { name: /Empresa A/ })).toBeEnabled();
  });

  it('a busca filtra por nome real, código ou setor', async () => {
    const { user } = await renderizar();
    await user.type(screen.getByRole('textbox', { name: 'Buscar ativo' }), 'varejo');

    expect(screen.getByRole('checkbox', { name: /Empresa B/ })).toBeInTheDocument();
    expect(screen.queryByRole('checkbox', { name: /Empresa A/ })).not.toBeInTheDocument();
  });

  it('confere o formulário antes de enviar', async () => {
    const { user } = await renderizar();
    await preencher(user, '2018', '2015');
    await user.click(screen.getByRole('button', { name: 'Criar rodada' }));

    expect(screen.getByRole('alert')).toHaveTextContent('O ano final precisa vir depois do inicial.');
    expect(adminCompetitionService.create).not.toHaveBeenCalled();
  });

  it('mostra a mensagem da API quando ela recusa', async () => {
    vi.mocked(adminCompetitionService.create).mockRejectedValue({
      response: { data: { erro: 'Ja existe uma rodada com o numero 7' } },
    });
    const { onCriada, user } = await renderizar();
    await preencher(user, '2015', '2018');
    await user.click(screen.getByRole('checkbox', { name: /Empresa A/ }));
    await user.click(screen.getByRole('button', { name: 'Criar rodada' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Ja existe uma rodada com o numero 7');
    expect(onCriada).not.toHaveBeenCalled();
  });
});

describe('regras do formulário', () => {
  const campos = {
    roundNumber: '7', budget: '100000', scenarioTitle: 'Cenário', scenarioDescription: '',
    startYear: '2015', endYear: '2018', endsAt: '2026-10-05T23:59',
  };

  it('o ano final não precisa ter dados: a simulação para no ano anterior', () => {
    expect(anosFaltando({ ...ativos[0], years: [2015, 2016, 2017] }, 2015, 2018)).toEqual([]);
    expect(anosFaltando({ ...ativos[0], years: [2015, 2017] }, 2015, 2018)).toEqual([2016]);
  });

  it('recusa dois ativos com o mesmo nome anônimo', () => {
    const repetido = { ...ativos[2], id: 't2' };
    expect(validar(campos, [ativos[2], repetido])).toMatch(/mesmo nome anônimo \(Título 1\)/);
  });

  it('exige título, orçamento positivo e ao menos um ativo', () => {
    expect(validar({ ...campos, scenarioTitle: '  ' }, [ativos[0]])).toBe('Dê um título ao cenário.');
    expect(validar({ ...campos, budget: '0' }, [ativos[0]])).toBe('O orçamento precisa ser maior que zero.');
    expect(validar(campos, [])).toBe('Escolha ao menos um ativo.');
    expect(validar(campos, [ativos[0]])).toBeNull();
  });

  it('o prazo padrão é daqui a uma semana, às 23:59', () => {
    expect(prazoPadrao(new Date(2026, 8, 29, 10, 0))).toBe('2026-10-06T23:59');
  });
});
