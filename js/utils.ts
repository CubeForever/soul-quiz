/**
 * utils.ts — 灵魂解码通用工具函数
 * XSS 防护、DOM 构建、安全模板
 */

/**
 * HTML 转义，防止 XSS
 */
function esc(str: unknown): string {
  if (str == null) return '';
  return String(str).replace(/[&<>"']/g, function(c) {
    return '&#' + c.charCodeAt(0) + ';';
  });
}

/**
 * 安全创建 DOM 元素
 */
function el(
  tag: string,
  attrs: Record<string, string | number | boolean | Record<string, string>> | null,
  ...children: Array<Node | string | number | null | undefined>
): HTMLElement {
  const e = document.createElement(tag);
  if (attrs) {
    Object.entries(attrs).forEach(function([k, v]) {
      if (k === 'className') { e.className = String(v); }
      else if (k === 'dataset') { Object.assign(e.dataset, v); }
      else if (k === 'style') { Object.assign(e.style, v); }
      else if (v != null) { e.setAttribute(k, String(v)); }
    });
  }
  for (let i = 0; i < children.length; i++) {
    const c = children[i];
    if (c instanceof Node) e.appendChild(c);
    else if (c != null) e.appendChild(document.createTextNode(String(c)));
  }
  return e;
}

/**
 * 清空容器所有子节点
 */
function empty(el: HTMLElement): void {
  while (el.firstChild) el.removeChild(el.firstChild);
}

/**
 * 安全 HTML 标签模板：自动转义所有插值变量，防止 XSS
 */
function html(strings: TemplateStringsArray, ...values: unknown[]): string {
  let result = strings[0];
  for (let i = 1; i < strings.length; i++) {
    const val = values[i - 1];
    if (Array.isArray(val)) {
      result += val.map(function(v) { return esc(v); }).join('');
    } else {
      result += esc(val);
    }
    result += strings[i];
  }
  return result;
}

/**
 * 读取 CSS 变量值（用于 Canvas 绘图等非 CSS 场景）
 */
function readCSSVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

// 导出到全局供各模块使用
window.SoulUtils = { esc, el, empty, html, readCSSVar };
