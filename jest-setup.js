/**
 * 测试 setup：在 JSDOM 中加载全局 JS 模块
 */
const fs = require('fs');
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

// 加载 questions.js（数据依赖）
const questionsCode = fs.readFileSync(path.resolve(__dirname, 'js/questions.js'), 'utf8');
eval(questionsCode);

// 加载 scoring.js
const scoringCode = fs.readFileSync(path.resolve(__dirname, 'js/scoring.js'), 'utf8');
eval(scoringCode);
