// @ts-nocheck
/**
 * utils.js — 灵魂解码通用工具函数
 * XSS 防护、DOM 构建、安全模板
 */

/**
 * HTML 转义，防止 XSS
 * @param {*} str - 需要转义的字符串
 * @returns {string} 转义后的安全 HTML
 */
function esc(str) {
  if (str == null) return '';
  return String(str).replace(/[&<>"']/g, function(c) {
    return '&#' + c.charCodeAt(0) + ';';
  });
}

/**
 * 安全创建 DOM 元素
 * @param {string} tag - 标签名
 * @param {Object|null} attrs - 属性对象
 * @param {...(Node|string)} children - 子元素
 * @returns {HTMLElement}
 */
function el(tag, attrs) {
  var e = document.createElement(tag);
  if (attrs) {
    Object.entries(attrs).forEach(function(_ref) {
      var k = _ref[0], v = _ref[1];
      if (k === 'className') { e.className = v; }
      else if (k === 'dataset') { Object.assign(e.dataset, v); }
      else if (k === 'style') { Object.assign(e.style, v); }
      else if (v != null) { e.setAttribute(k, v); }
    });
  }
  for (var i = 2; i < arguments.length; i++) {
    var c = arguments[i];
    if (c instanceof Node) e.appendChild(c);
    else if (c != null) e.appendChild(document.createTextNode(String(c)));
  }
  return e;
}

/**
 * 清空容器所有子节点
 * @param {HTMLElement} el - 目标容器
 */
function empty(el) {
  while (el.firstChild) el.removeChild(el.firstChild);
}

/**
 * 安全 HTML 标签模板：自动转义所有插值变量，防止 XSS
 * @param {string[]} strings - 模板字符串片段
 * @param {...*} values - 插值变量
 * @returns {string} 转义后的 HTML 字符串
 */
function html(strings) {
  var result = strings[0];
  for (var i = 1; i < arguments.length; i++) {
    var val = arguments[i];
    if (Array.isArray(val)) {
      result += val.map(function(v) { return esc(v); }).join('');
    } else {
      result += esc(val);
    }
    result += strings[i];
  }
  return result;
}

// 导出到全局供各模块使用
window.SoulUtils = { esc: esc, el: el, empty: empty, html: html };