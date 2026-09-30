// Service worker do RetroBolsa: guarda só os arquivos estáticos do app, para ele
// abrir rápido e continuar abrindo sem internet. Nada da API entra no cache: rodadas,
// resultados e rankings vêm sempre da rede. Troque a versão para descartar o cache antigo.
const VERSAO = 'retrobolsa-estaticos-v1';
const ESSENCIAIS = ['/', '/manifest.webmanifest', '/icons/icon-192.png', '/icons/icon-512.png', '/icons/icon.svg'];

self.addEventListener('install', (evento) => {
  evento.waitUntil(caches.open(VERSAO).then((cache) => cache.addAll(ESSENCIAIS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches
      .keys()
      .then((nomes) => Promise.all(nomes.filter((nome) => nome !== VERSAO).map((nome) => caches.delete(nome))))
      .then(() => self.clients.claim()),
  );
});

/** O que fazer com cada pedido: ignorar (vai direto à rede), navegação ou arquivo estático. */
function estrategia(pedido) {
  if (pedido.method !== 'GET') return 'ignorar';
  const url = new URL(pedido.url);
  // A API mora em outro endereço (VITE_API_URL); o prefixo /api/ fica de fora por garantia.
  if (url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return 'ignorar';
  if (pedido.mode === 'navigate') return 'navegacao';
  if (url.pathname.startsWith('/assets/') || url.pathname.startsWith('/icons/') || url.pathname === '/manifest.webmanifest') {
    return 'estatico';
  }
  return 'ignorar';
}

self.addEventListener('fetch', (evento) => {
  const tipo = estrategia(evento.request);
  if (tipo === 'navegacao') {
    // Rede primeiro, para pegar a versão nova; sem rede, o index guardado (o vercel.json já manda toda rota para ele).
    evento.respondWith(fetch(evento.request).catch(() => caches.match('/')));
  } else if (tipo === 'estatico') {
    // Os arquivos de /assets têm o hash no nome: a mesma URL nunca muda de conteúdo.
    evento.respondWith(
      caches.match(evento.request).then(
        (guardado) =>
          guardado ||
          fetch(evento.request).then((resposta) => {
            if (resposta.ok) {
              const copia = resposta.clone();
              caches.open(VERSAO).then((cache) => cache.put(evento.request, copia));
            }
            return resposta;
          }),
      ),
    );
  }
});
