/**
 * 测试 setup：在 JSDOM 中加载全局 JS 模块 + 模拟 DOM 结构
 */
const path = require('path');

// === Canvas mock（全局复用） ===
var mockCtx = {
  clearRect: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  closePath: jest.fn(),
  stroke: jest.fn(),
  fill: jest.fn(),
  arc: jest.fn(),
  fillText: jest.fn(),
  scale: jest.fn(),
  createRadialGradient: jest.fn(function() { return { addColorStop: jest.fn() }; }),
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 0,
  font: '',
  textAlign: '',
  textBaseline: '',
  save: jest.fn(),
  restore: jest.fn(),
  globalAlpha: 0,
  measureText: jest.fn(function() { return { width: 100 }; })
};

HTMLCanvasElement.prototype.getContext = jest.fn(function() { return mockCtx; });

// === 全局 mock ===
global.requestAnimationFrame = jest.fn(function(cb) { return setTimeout(cb, 0); });
global.cancelAnimationFrame = jest.fn(function(id) { return clearTimeout(id); });
global.console = { log: console.log, warn: jest.fn(), error: jest.fn() };
if (!global.navigator) global.navigator = {};
global.navigator.clipboard = {
  writeText: jest.fn(function() { return Promise.resolve(); }),
  readText: jest.fn(function() { return Promise.resolve(''); })
};

// === 灵魂解码 DOM 结构（ui.js 所需） ===
function setupSoulDOM() {
  document.body.innerHTML =
    '<canvas id="starfield"></canvas>' +
    '<canvas id="loading-canvas"></canvas>' +
    '<canvas id="radar-canvas"></canvas>' +
    '<div id="welcome-screen" class="screen active">' +
      '<div class="welcome-content">' +
        '<button id="btn-start">开始探索灵魂</button>' +
      '</div>' +
    '</div>' +
    '<div id="quiz-screen" class="screen">' +
      '<div class="quiz-header">' +
        '<div class="progress-wrapper">' +
          '<div class="progress-track" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">' +
            '<div id="progress-bar" class="progress-bar"></div>' +
          '</div>' +
          '<span id="progress-text" class="progress-text">1 / 28</span>' +
        '</div>' +
      '</div>' +
      '<div class="btn-back-wrapper">' +
        '<button id="btn-back" class="btn-back" style="visibility:hidden">← 上一题</button>' +
      '</div>' +
      '<div id="question-area" class="question-area"></div>' +
    '</div>' +
    '<div id="loading-screen" class="screen">' +
      '<p class="loading-text">正在解读你的灵魂密码...</p>' +
    '</div>' +
    '<div id="report-screen" class="screen">' +
      '<div id="report-container"></div>' +
      '<div class="report-actions">' +
        '<button id="btn-restart" class="btn-restart">重新测试</button>' +
        '<button id="btn-share" class="btn-share">📋 复制链接</button>' +
        '<button id="btn-save" class="btn-save">📸 保存图片</button>' +
      '</div>' +
    '</div>' +
    '<div id="error-toast" class="error-toast" style="display:none" role="alert"></div>' +
    '<div id="announce" class="sr-only" aria-live="polite"></div>';
}

// === 加载模块 ===
require(path.resolve(__dirname, 'js/questions.js'));
require(path.resolve(__dirname, 'js/scoring.js'));
require(path.resolve(__dirname, 'js/utils.js'));
require(path.resolve(__dirname, 'js/report.js'));
require(path.resolve(__dirname, 'js/share.js'));
require(path.resolve(__dirname, 'js/webhook.js'));
// ui.js 不在全局加载：它会在 DOMContentLoaded 时自动执行 init()，
// 需要精确的 DOM 结构，由各测试文件按需加载

// 导出 DOM 设置函数供测试文件使用
global.setupSoulDOM = setupSoulDOM;