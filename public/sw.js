/**
 * sw.js — 灵魂解码 Service Worker v2
 * 提供离线缓存支持，提升二次访问加载速度
 *
 * 版本管理：修改 VERSION 触发新安装，自动清理旧缓存
 */

const VERSION = 'v2';
const CACHE_NAME = 'soul-decoder-' + VERSION;

// 预缓存资源列表
const PRECACHE_URLS = [
  './',
  './index.html',
  './css/style.css',
  './js/questions.js',
  './js/scoring.js',
  './js/utils.js',
  './js/report.js',
  './js/ui.js',
  './js/share.js',
  './js/webhook.js',
  './manifest.json'
];

/**
 * 安装事件：预缓存核心资源
 * 任一资源失败则安装失败（确保缓存完整性）
 */
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) { return cache.addAll(PRECACHE_URLS); })
      .then(function() { return self.skipWaiting(); })
      .catch(function(err) {
        console.error('[SW] 预缓存失败:', err);
        throw err;
      })
  );
});

/**
 * 激活事件：清理旧版本缓存，接管页面
 */
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function(name) { return name !== CACHE_NAME; })
          .map(function(name) { return caches.delete(name); })
      );
    }).then(function() { return self.clients.claim(); })
  );
});

/**
 * 版本升级通知：通知所有页面有新版本可用
 * ui.js 可监听该消息显示 "发现新版本" 提示
 */
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage(VERSION);
  }
});

/**
 * 缓存策略：
 * - 导航请求（页面）：网络优先，缓存兜底
 * - 静态资源：缓存优先，网络回退并更新缓存
 * - 外部请求：直接网络，不缓存
 */
self.addEventListener('fetch', function(event) {
  // 非 GET 请求不处理
  if (event.request.method !== 'GET') return;

  var url = new URL(event.request.url);

  // 外部资源不缓存
  if (url.origin !== self.location.origin) return;

  if (event.request.mode === 'navigate') {
    // 导航请求：网络优先，离线时用缓存首页兜底
    event.respondWith(networkFirst(event.request));
  } else {
    // 静态资源：缓存优先
    event.respondWith(cacheFirst(event.request));
  }
});

/**
 * 缓存优先策略：从缓存读取，未命中则联网
 */
function cacheFirst(request) {
  return caches.match(request).then(function(cached) {
    if (cached) return cached;
    return fetch(request).then(function(response) {
      if (response && response.status === 200) {
        var copy = response.clone();
        caches.open(CACHE_NAME).then(function(cache) { cache.put(request, copy); });
      }
      return response;
    });
  });
}

/**
 * 网络优先策略：先联网，失败时用缓存兜底
 */
function networkFirst(request) {
  // 设置网络超时
  var timeout = new Promise(function(resolve) {
    setTimeout(resolve, 3000);
  });

  return Promise.race([
    fetch(request).then(function(response) {
      if (response && response.status === 200) {
        var copy = response.clone();
        caches.open(CACHE_NAME).then(function(cache) { cache.put(request, copy); });
      }
      return response;
    }),
    timeout
  ]).catch(function() {
    return caches.match(request).then(function(cached) {
      return cached || caches.match('./index.html');
    });
  });
}