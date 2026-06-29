/**
 * 测试 setup：在 JSDOM 中加载全局 JS 模块
 */
const path = require('path');

// 模拟 Canvas 上下文
HTMLCanvasElement.prototype.getContext = function() {
  return {
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
    createRadialGradient: jest.fn(() => ({
      addColorStop: jest.fn()
    })),
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 0,
    font: '',
    textAlign: '',
    textBaseline: '',
    save: jest.fn(),
    restore: jest.fn(),
    globalAlpha: 0,
    measureText: jest.fn(() => ({ width: 100 }))
  };
};

// 模拟 requestAnimationFrame
global.requestAnimationFrame = jest.fn(cb => setTimeout(cb, 0));
global.cancelAnimationFrame = jest.fn(id => clearTimeout(id));

// 模拟 console
global.console = { ...console, warn: jest.fn(), error: jest.fn() };

// 模拟 navigator.clipboard
if (!global.navigator) global.navigator = {};
global.navigator.clipboard = {
  writeText: jest.fn(() => Promise.resolve()),
  readText: jest.fn(() => Promise.resolve(''))
};

// 加载模块（使用 require 替代 eval）
// 这些文件通过 window.* 全局赋值，require() 在 JSDOM 中自动挂载到全局
require(path.resolve(__dirname, 'js/questions.js'));
require(path.resolve(__dirname, 'js/scoring.js'));
require(path.resolve(__dirname, 'js/utils.js'));
require(path.resolve(__dirname, 'js/report.js'));
require(path.resolve(__dirname, 'js/share.js'));
