/**
 * 灵魂解码 — UI 模块单元测试
 * 覆盖页面状态机、题目渲染、选项选择、错误处理
 */

var QUESTIONS;

beforeAll(function() {
  QUESTIONS = window.SOUL_QUESTIONS;
});

beforeEach(function() {
  jest.clearAllMocks();
  jest.useFakeTimers();
  // 设置 DOM 结构
  setupSoulDOM();
  // 加载 ui.js（清除 require 缓存后重新加载）
  delete require.cache[require.resolve('../js/ui')];
  require('../js/ui');
  // 初始化 UI
  window.SoulUI.init();
});

afterEach(function() {
  jest.useRealTimers();
});

// ─────────────────────────────────────────
// 1. 页面状态机
// ─────────────────────────────────────────

describe('页面状态机', function() {
  test('初始状态为 welcome', function() {
    var welcome = document.getElementById('welcome-screen');
    var quiz = document.getElementById('quiz-screen');
    expect(welcome.classList.contains('active')).toBe(true);
    expect(quiz.classList.contains('active')).toBe(false);
  });

  test('点击开始按钮切换到 quiz 页', function() {
    document.getElementById('btn-start').click();
    var welcome = document.getElementById('welcome-screen');
    var quiz = document.getElementById('quiz-screen');
    expect(welcome.classList.contains('active')).toBe(false);
    expect(quiz.classList.contains('active')).toBe(true);
  });

  test('答题页显示第一题', function() {
    document.getElementById('btn-start').click();
    var area = document.getElementById('question-area');
    expect(area.children.length).toBe(1);
    var card = area.querySelector('.question-card');
    expect(card).not.toBeNull();
    // 检查维度标签
    var badge = card.querySelector('.dimension-badge');
    expect(badge).not.toBeNull();
    expect(badge.textContent).toBe('认知之门');
    // 检查题目文本
    var title = card.querySelector('.question-text');
    expect(title).not.toBeNull();
    expect(title.textContent.length).toBeGreaterThan(5);
  });

  test('进度条初始值正确', function() {
    document.getElementById('btn-start').click();
    var bar = document.getElementById('progress-bar');
    var text = document.getElementById('progress-text');
    expect(bar.style.width).toBe('0%');
    expect(text.textContent).toContain('1 / 28');
  });

  test('返回按钮默认隐藏', function() {
    document.getElementById('btn-start').click();
    var btnBack = document.getElementById('btn-back');
    expect(btnBack.style.visibility).toBe('hidden');
  });
});

// ─────────────────────────────────────────
// 2. 题目渲染类型检测
// ─────────────────────────────────────────

describe('题目类型', function() {
  test('场景题 (scenario) Q1 有 4 个选项', function() {
    expect(QUESTIONS[0].type).toBe('scenario');
    expect(QUESTIONS[0].options.length).toBe(4);
  });

  test('量表题 (likert) Q4 有 5 个选项', function() {
    expect(QUESTIONS[3].type).toBe('likert');
    expect(QUESTIONS[3].options.length).toBe(5);
  });

  test('排序题 (ranking) Q5 有 5 个选项', function() {
    expect(QUESTIONS[4].type).toBe('ranking');
    expect(QUESTIONS[4].options.length).toBe(5);
  });

  test('场景题渲染选项网格', function() {
    document.getElementById('btn-start').click();
    var optionsContainer = document.querySelector('.options-grid');
    expect(optionsContainer).not.toBeNull();
    var buttons = optionsContainer.querySelectorAll('.option-card');
    expect(buttons.length).toBe(4);
    expect(buttons[0].querySelector('.option-id').textContent).toBeTruthy();
    expect(buttons[0].querySelector('.option-text').textContent).toBeTruthy();
  });
});

// ─────────────────────────────────────────
// 3. 选项选择
// ─────────────────────────────────────────

describe('selectOption 选项选择', function() {
  beforeEach(function() {
    document.getElementById('btn-start').click();
  });

  test('选择选项后增加 selected 类', function() {
    var firstOption = document.querySelector('.option-card');
    expect(firstOption).not.toBeNull();
    firstOption.click();
    expect(firstOption.classList.contains('selected')).toBe(true);
  });

  test('切换选项转移 selected 类', function() {
    var options = document.querySelectorAll('.option-card');
    options[0].click();
    expect(options[0].classList.contains('selected')).toBe(true);
    options[1].click();
    expect(options[0].classList.contains('selected')).toBe(false);
    expect(options[1].classList.contains('selected')).toBe(true);
  });
});

// ─────────────────────────────────────────
// 4. 返回功能
// ─────────────────────────────────────────

describe('goBack 返回', function() {
  test('答完第一题后可返回', function() {
    document.getElementById('btn-start').click();
    // 答第一题（模拟点击选项 A）
    var firstOption = document.querySelector('.option-card');
    firstOption.click();
    // 推进计时器：400ms 选择延迟 + 300ms 滑出动画
    jest.advanceTimersByTime(800);
    // 现在应在第二题
    var progressText = document.getElementById('progress-text');
    expect(progressText.textContent).toContain('2 / 28');
    // 点击返回
    document.getElementById('btn-back').click();
    expect(document.getElementById('progress-text').textContent).toContain('1 / 28');
  });
});

// ─────────────────────────────────────────
// 5. 错误提示 Toast
// ─────────────────────────────────────────

describe('showError 错误提示', function() {
  test('显示错误 toast', function() {
    window.SoulUI.showError('测试错误消息');
    var toast = document.getElementById('error-toast');
    expect(toast.style.display).toBe('block');
    expect(toast.textContent).toBe('测试错误消息');
  });

  test('多次调用更新内容', function() {
    window.SoulUI.showError('第一条');
    window.SoulUI.showError('第二条');
    var toast = document.getElementById('error-toast');
    expect(toast.textContent).toBe('第二条');
  });

  test('toast 定时隐藏', function() {
    window.SoulUI.showError('测试消息');
    jest.advanceTimersByTime(6100);
    var toast = document.getElementById('error-toast');
    expect(toast.style.display).toBe('none');
  });
});

// ─────────────────────────────────────────
// 6. 确认弹窗
// ─────────────────────────────────────────

describe('showConfirm 确认弹窗', function() {
  test('创建确认弹窗元素', function() {
    window.SoulUI.showConfirm('确认标题', '确认内容');
    var overlay = document.querySelector('.modal-overlay');
    expect(overlay).not.toBeNull();
    expect(overlay.querySelector('.modal-title').textContent).toBe('确认标题');
    expect(overlay.querySelector('.modal-text').textContent).toBe('确认内容');
    expect(overlay.querySelector('.modal-btn-cancel')).not.toBeNull();
    expect(overlay.querySelector('.modal-btn-confirm')).not.toBeNull();
  });

  test('点击取消返回 false', function(done) {
    var promise = window.SoulUI.showConfirm('标题', '内容');
    document.querySelector('.modal-btn-cancel').click();
    promise.then(function(result) {
      expect(result).toBe(false);
      expect(document.querySelector('.modal-overlay')).toBeNull();
      done();
    });
  });

  test('点击确认返回 true', function(done) {
    var promise = window.SoulUI.showConfirm('标题', '内容');
    document.querySelector('.modal-btn-confirm').click();
    promise.then(function(result) {
      expect(result).toBe(true);
      expect(document.querySelector('.modal-overlay')).toBeNull();
      done();
    });
  });
});

// ─────────────────────────────────────────
// 7. 全局错误边界（通过 dispatchEvent 触发）
// ─────────────────────────────────────────

describe('全局错误边界', function() {
  test('dispatch error 事件不抛出异常', function() {
    expect(function() {
      window.dispatchEvent(new ErrorEvent('error', { message: '测试', error: new Error('test') }));
    }).not.toThrow();
  });
});

// ─────────────────────────────────────────
// 8. 模块完整性
// ─────────────────────────────────────────

describe('SoulUI 模块', function() {
  test('导出了必要方法', function() {
    expect(window.SoulUI).toBeDefined();
    expect(typeof window.SoulUI.init).toBe('function');
    expect(typeof window.SoulUI.showError).toBe('function');
    expect(typeof window.SoulUI.showConfirm).toBe('function');
  });
});
