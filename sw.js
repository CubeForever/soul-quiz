/**
 * sw.js — 灵魂解码 Service Worker
 * 提供离线缓存支持，提升二次访问加载速度
 */

const CACHE_NAME = 'soul-decoder-v1';

// 预缓存资源
const PRECACHE_URLS = [
  './',
  './index.html',
  './css/style.css',
  './js/questions.js',
  './js/scoring.js',
  './js/report.js',
  './js/ui.js',
  './js/share.js',
  './js/webhook.js',
  './manifest.json'
];

// 安装：预缓存核心资源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// 激活：清理旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// 拦截请求：缓存优先，网络回退
self.addEventListener('fetch', event => {
  // 只缓存 GET 请求
  if (event.request.method !== 'GET') return;

  // 不缓存外部 CDN 和 API
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request).then(response => {
          // 只缓存成功响应的核心资源
          if (response && response.status === 200) {
            const cacheCopy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, cacheCopy));
          }
          return response;
        });
      })
      .catch(() => {
        // 完全离线时返回缓存的首页
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
        return new Response('离线中', { status: 503 });
      })
  );
});
