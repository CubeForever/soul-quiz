/**
 * main.js — 灵魂解码 Vite 入口
 * 按顺序加载所有模块（通过 window.* 全局访问）
 */

// 加载顺序必须与 index.html 原始顺序一致
import './questions';
import './scoring';
import './utils';
import './report';
import './webhook';
import './share';
import './theme';

// ui.js 在 DOMContentLoaded 时自动初始化，最后加载
import './ui';