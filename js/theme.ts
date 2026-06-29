/**
 * theme.ts — 主题管理模块
 * 深空紫 / 海洋蓝 / 森林绿 / 浅色模式
 */

type ThemeId = 'deep-space' | 'ocean' | 'forest' | 'light';

interface ThemeDef {
  id: ThemeId;
  name: string;
  preview: string;   // CSS 颜色（用于选择器圆点）
  metaColor: string;  // meta theme-color
}

const THEMES: ThemeDef[] = [
  { id: 'deep-space', name: '深空紫', preview: '#a18cd1', metaColor: '#1a1a4e' },
  { id: 'ocean',      name: '海洋蓝', preview: '#4a90d9', metaColor: '#0e3456' },
  { id: 'forest',     name: '森林绿', preview: '#6db36d', metaColor: '#1a3a1a' },
  { id: 'light',      name: '浅色',   preview: '#f0f0f5', metaColor: '#e0e0ea' },
];

const STORAGE_KEY = 'soul-theme';

/**
 * 应用主题
 */
function setTheme(id: ThemeId): void {
  const theme = THEMES.find(t => t.id === id);
  if (!theme) return;

  // 设置 data-theme 属性（非默认主题需要）
  if (id === 'deep-space') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.dataset.theme = id;
  }

  // 更新 meta theme-color
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme.metaColor);

  // 持久化
  try { localStorage.setItem(STORAGE_KEY, id); } catch (_e) { /* ignore */ }

  // 更新选择器激活态
  document.querySelectorAll('.theme-dot').forEach(dot => {
    dot.classList.toggle('active', (dot as HTMLElement).dataset.theme === id);
  });
}

/**
 * 读取保存的主题，回退到 prefers-color-scheme
 */
function getInitialTheme(): ThemeId {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeId | null;
    if (saved && THEMES.some(t => t.id === saved)) return saved;
  } catch (_e) { /* ignore */ }

  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'deep-space';
}

/**
 * 渲染主题选择器（浮动在右下角）
 */
function renderPicker(): void {
  const container = document.createElement('div');
  container.className = 'theme-picker';
  container.setAttribute('aria-label', '主题切换');
  container.setAttribute('role', 'radiogroup');

  THEMES.forEach(theme => {
    const dot = document.createElement('button');
    dot.className = 'theme-dot';
    dot.dataset.theme = theme.id;
    dot.style.background = theme.preview;
    dot.setAttribute('role', 'radio');
    dot.setAttribute('aria-label', theme.name);
    dot.setAttribute('title', theme.name);
    dot.addEventListener('click', () => setTheme(theme.id));
    container.appendChild(dot);
  });

  document.body.appendChild(container);
}

/**
 * 初始化主题系统
 */
function initTheme(): void {
  const initial = getInitialTheme();
  setTheme(initial);
  renderPicker();
}

// DOM Ready 后初始化
document.addEventListener('DOMContentLoaded', initTheme);
