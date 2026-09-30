/**
 * Registra o service worker (public/sw.js) só no app publicado: em desenvolvimento
 * ele guardaria arquivos que o Vite troca a cada edição.
 */
export function registrarServiceWorker(producao: boolean = import.meta.env.PROD): boolean {
  if (!producao || typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return false;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => undefined); // Sem o SW, o app funciona igual, só sem cache.
  });
  return true;
}
