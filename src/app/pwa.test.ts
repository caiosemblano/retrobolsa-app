import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { registrarServiceWorker } from './pwa';

type Ouvinte = (evento: any) => void;

/** Carrega public/sw.js com um "self" falso e devolve os ouvintes que ele registrou. */
function carregarServiceWorker() {
  const ouvintes: Record<string, Ouvinte> = {};
  const self = {
    location: { origin: 'https://retrobolsa-app.vercel.app' },
    addEventListener: (tipo: string, ouvinte: Ouvinte) => (ouvintes[tipo] = ouvinte),
    skipWaiting: vi.fn(),
    clients: { claim: vi.fn() },
  };
  const codigo = readFileSync(resolve(__dirname, '../../public/sw.js'), 'utf-8');
  const caches = {
    match: vi.fn(() => Promise.resolve(undefined)),
    open: vi.fn(() => Promise.resolve({ put: vi.fn() })),
    keys: vi.fn(() => Promise.resolve([])),
  };
  const rede = vi.fn(() => Promise.resolve({ ok: true, clone: () => ({}) }));
  new Function('self', 'caches', 'fetch', codigo)(self, caches, rede);
  return ouvintes;
}

const pedido = (url: string, extra: Partial<{ method: string; mode: string }> = {}) => {
  const respondWith = vi.fn();
  return { respondWith, request: { url, method: 'GET', mode: 'no-cors', ...extra } };
};

describe('service worker', () => {
  it('nunca responde pela API: nem a de outro endereço, nem um /api/ no mesmo', () => {
    const { fetch } = carregarServiceWorker();
    for (const evento of [
      pedido('https://jubilant-expression.up.railway.app/api/competitions/active'),
      pedido('https://retrobolsa-app.vercel.app/api/rankings'),
      pedido('https://retrobolsa-app.vercel.app/assets/index-abc.js', { method: 'POST' }),
    ]) {
      fetch(evento);
      expect(evento.respondWith).not.toHaveBeenCalled();
    }
  });

  it('responde as navegações e os arquivos estáticos do app', () => {
    const { fetch } = carregarServiceWorker();
    const navegacao = pedido('https://retrobolsa-app.vercel.app/rankings', { mode: 'navigate' });
    const estatico = pedido('https://retrobolsa-app.vercel.app/assets/index-abc.js');
    fetch(navegacao);
    fetch(estatico);
    expect(navegacao.respondWith).toHaveBeenCalled();
    expect(estatico.respondWith).toHaveBeenCalled();
  });
});

describe('registrarServiceWorker', () => {
  afterEach(() => vi.restoreAllMocks());

  it('em desenvolvimento não registra', () => {
    expect(registrarServiceWorker(false)).toBe(false);
  });

  it('no app publicado, registra /sw.js quando a página termina de carregar', () => {
    const register = vi.fn().mockResolvedValue({});
    Object.defineProperty(navigator, 'serviceWorker', { value: { register }, configurable: true });

    expect(registrarServiceWorker(true)).toBe(true);
    window.dispatchEvent(new Event('load'));
    expect(register).toHaveBeenCalledWith('/sw.js');
  });
});
