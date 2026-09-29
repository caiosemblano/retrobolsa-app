import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router';
import { PrimeiroAcesso } from './PrimeiroAcesso';
import { userService } from '../services/userService';

const updateUser = vi.fn();
vi.mock('../contexts/AuthContext', () => ({ useAuth: () => ({ updateUser }) }));
vi.mock('../services/userService', () => ({ userService: { markOnboarded: vi.fn() } }));

const renderizar = () =>
  render(
    <MemoryRouter>
      <PrimeiroAcesso />
    </MemoryRouter>,
  );

describe('PrimeiroAcesso', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(userService.markOnboarded).mockResolvedValue({} as never);
  });

  it('passa pelos 4 passos e, ao começar, marca o primeiro acesso como visto', async () => {
    const user = userEvent.setup();
    renderizar();

    expect(await screen.findByRole('dialog', { name: 'Como funciona uma rodada' })).toHaveTextContent('Passo 1 de 4');
    await user.click(screen.getByRole('button', { name: 'Próximo' }));
    expect(screen.getByRole('dialog', { name: 'Onde aprender' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Voltar' }));
    expect(screen.getByRole('dialog', { name: 'Como funciona uma rodada' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Próximo' }));
    await user.click(screen.getByRole('button', { name: 'Próximo' }));
    expect(screen.getByRole('dialog', { name: 'O que é XP' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Próximo' }));

    const ultimo = screen.getByRole('dialog', { name: 'Como entrar numa turma' });
    expect(ultimo).toHaveTextContent('Perfil → Minhas turmas');
    expect(screen.getByRole('link', { name: 'Veja como funciona' })).toHaveAttribute('href', '/como-funciona');
    await user.click(screen.getByRole('button', { name: 'Começar' }));

    expect(userService.markOnboarded).toHaveBeenCalledTimes(1);
    expect(updateUser).toHaveBeenCalledWith({ onboarded: true });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('pular também conta como visto', async () => {
    const user = userEvent.setup();
    renderizar();

    await user.click(await screen.findByRole('button', { name: 'Pular' }));

    expect(userService.markOnboarded).toHaveBeenCalledTimes(1);
    expect(updateUser).toHaveBeenCalledWith({ onboarded: true });
  });
});
