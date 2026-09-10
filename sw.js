/* =============================================================================
   Service worker — Orlando 2026
   -----------------------------------------------------------------------------
   Estratégia: precache total no install, cache-first no fetch.
   O app inteiro cabe em ~260 KB, então não há motivo para cache parcial:
   ou está tudo lá, ou o app não cumpre a promessa de funcionar sem sinal.

   A VERSAO deriva do HASH do conteúdo precacheado, não de um número manual.
   Mudou um arquivo, muda o hash, muda o nome do cache, o precache refaz.
   Depois de editar qualquer arquivo do app:  node tools/checar.js --selar
   ========================================================================== */

const VERSAO = 'orlando2026-88733561';
const CACHE = VERSAO;

const ARQUIVOS = [
  './',
  './index.html',
  './manifest.json',
  './css/app.css',
  './data/roteiro.js',
  './js/estado.js',
  './js/busca.js',
  './js/fase3.js',
  './js/fase4.js',
  './js/fase5.js',
  './js/app.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
];

self.addEventListener('install', function (evento) {
  evento.waitUntil(
    caches.open(CACHE)
      .then(function (cache) {
        // addAll é atômico: se um arquivo falhar, nada é gravado — e é isso que
        // queremos. Cache pela metade é pior que cache nenhum, porque mente.
        return cache.addAll(ARQUIVOS);
      })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (evento) {
  evento.waitUntil(
    caches.keys()
      .then(function (chaves) {
        return Promise.all(chaves.map(function (c) {
          if (c !== CACHE) return caches.delete(c);
        }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (evento) {
  const req = evento.request;

  // Só mexemos em GET do próprio domínio. Deep link do Google Maps abre fora
  // do app e não pode passar por aqui.
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== self.location.origin) return;

  evento.respondWith(
    caches.match(req).then(function (achado) {
      if (achado) return achado;

      return fetch(req)
        .then(function (resposta) {
          // Guarda o que vier novo, para o app aguentar um arquivo esquecido
          // na lista de precache.
          if (resposta && resposta.status === 200 && resposta.type === 'basic') {
            const copia = resposta.clone();
            caches.open(CACHE).then(function (c) { c.put(req, copia); });
          }
          return resposta;
        })
        .catch(function () {
          // Offline e não está no cache: se for navegação, devolve o app.
          if (req.mode === 'navigate') return caches.match('./index.html');
          return new Response('', { status: 504, statusText: 'Offline' });
        });
    })
  );
});

/* Responde ao app quando ele pergunta o estado do cache (tela de status). */
self.addEventListener('message', function (evento) {
  if (!evento.data || evento.data.tipo !== 'status-cache') return;

  caches.open(CACHE)
    .then(function (cache) { return cache.keys(); })
    .then(function (chaves) {
      evento.source.postMessage({
        tipo: 'status-cache',
        versao: VERSAO,
        emCache: chaves.length,
        esperado: ARQUIVOS.length,
        completo: chaves.length >= ARQUIVOS.length,
      });
    });
});
