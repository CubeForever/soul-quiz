/**
 * 灵魂解码 — Webhook 模块单元测试
 * 覆盖平台检测、消息构造、发送防抖、配置路径
 */

var mockResult, mockReport, mockAnswers;

beforeAll(function() {
  mockResult = {
    scores: { openness: 80, conscientiousness: 50, extraversion: 40, agreeableness: 60, neuroticism: 30 },
    enneagram: { type: 4, name: '灵魂诗人', icon: '🎭' }
  };
  mockReport = { soulType: '深海梦想家 × 灵魂诗人', summary: '测试摘要内容。' };
  mockAnswers = [
    { questionId: 1, choice: 'A' },
    { questionId: 4, choice: 5 },
    { questionId: 5, choice: ['explore', 'learn', 'create', 'serve', 'compete'] }
  ];
});

beforeEach(function() {
  window.SoulWebhook.config.enabled = false;
  window.SoulWebhook.config.webhookUrl = '';
  window.SoulWebhook.config.proxyUrl = '';
  window.SoulWebhook.config.includeAnswers = true;
  window.SoulWebhook._testReset();
  jest.clearAllMocks();
});

// ── 1. 配置默认值 ──

describe('SoulWebhook 配置', function() {
  test('enabled 默认关闭', function() {
    expect(window.SoulWebhook.config.enabled).toBe(false);
  });
  test('webhookUrl 默认为空', function() {
    expect(window.SoulWebhook.config.webhookUrl).toBe('');
  });
  test('includeAnswers 默认开启', function() {
    expect(window.SoulWebhook.config.includeAnswers).toBe(true);
  });
});

// ── 2. 发送行为 ──

describe('SoulWebhook.send', function() {
  beforeEach(function() {
    global.fetch = jest.fn(function() { return Promise.resolve({ status: 200 }); });
  });

  test('enabled=false 不发送', function() {
    window.SoulWebhook.send(mockResult, mockReport, mockAnswers);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('webhookUrl="" 不发送', function() {
    window.SoulWebhook.config.enabled = true;
    window.SoulWebhook.send(mockResult, mockReport, mockAnswers);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('企微 Webhook → markdown 格式', function() {
    window.SoulWebhook.config.enabled = true;
    window.SoulWebhook.config.webhookUrl = 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=test';
    return window.SoulWebhook.send(mockResult, mockReport, mockAnswers).then(function() {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      var opts = global.fetch.mock.calls[0][1];
      expect(opts.method).toBe('POST');
      expect(opts.mode).toBe('no-cors');
      var body = JSON.parse(opts.body);
      expect(body.msgtype).toBe('markdown');
      expect(body.markdown.content).toContain('🔮');
    });
  });

  test('飞书 Webhook → interactive 卡片', function() {
    window.SoulWebhook.config.enabled = true;
    window.SoulWebhook.config.webhookUrl = 'https://open.feishu.cn/open-apis/bot/v2/hook/test';
    return window.SoulWebhook.send(mockResult, mockReport, mockAnswers).then(function() {
      var body = JSON.parse(global.fetch.mock.calls[0][1].body);
      expect(body.msg_type).toBe('interactive');
      expect(body.card.header.title.tag).toBe('plain_text');
    });
  });

  test('通用 Webhook → 直传 payload', function() {
    window.SoulWebhook.config.enabled = true;
    window.SoulWebhook.config.webhookUrl = 'https://hooks.example.com/test';
    return window.SoulWebhook.send(mockResult, mockReport, mockAnswers).then(function() {
      var body = JSON.parse(global.fetch.mock.calls[0][1].body);
      expect(body.soulType).toBe('深海梦想家 × 灵魂诗人');
      expect(body.scores.openness).toBe(80);
    });
  });

  test('proxyUrl 优先', function() {
    window.SoulWebhook.config.enabled = true;
    window.SoulWebhook.config.webhookUrl = 'https://qyapi.weixin.qq.com/test';
    window.SoulWebhook.config.proxyUrl = 'https://my-proxy.workers.dev';
    return window.SoulWebhook.send(mockResult, mockReport, mockAnswers).then(function() {
      var url = global.fetch.mock.calls[0][0];
      expect(url).toBe('https://my-proxy.workers.dev');
    });
  });

  test('钉钉 → 企微 markdown 格式', function() {
    window.SoulWebhook.config.enabled = true;
    window.SoulWebhook.config.webhookUrl = 'https://oapi.dingtalk.com/robot/send?access_token=test';
    var r = { scores: { openness: 50, conscientiousness: 50, extraversion: 50, agreeableness: 50, neuroticism: 50 }, enneagram: { type: 1, name: 't', icon: '?' } };
    var p = { soulType: 't', summary: 't' };
    return window.SoulWebhook.send(r, p, []).then(function() {
      var body = JSON.parse(global.fetch.mock.calls[0][1].body);
      expect(body.msgtype).toBe('markdown');
    });
  });

  test('includeAnswers=false 不包含答案', function() {
    window.SoulWebhook.config.enabled = true;
    window.SoulWebhook.config.includeAnswers = false;
    window.SoulWebhook.config.webhookUrl = 'https://hooks.example.com/test';
    return window.SoulWebhook.send(mockResult, mockReport, mockAnswers).then(function() {
      var body = JSON.parse(global.fetch.mock.calls[0][1].body);
      expect(body.answers).toEqual([]);
    });
  });

  test('网络失败不抛异常', function() {
    global.fetch = jest.fn(function() { return Promise.reject(new Error('fail')); });
    window.SoulWebhook.config.enabled = true;
    window.SoulWebhook.config.webhookUrl = 'https://hooks.example.com/test';
    return expect(window.SoulWebhook.send(mockResult, mockReport, mockAnswers)).resolves.toBeUndefined();
  });
});

// ── 3. 防抖行为 ──

describe('SoulWebhook 防抖', function() {
  test('短时间内重复调用只发送一次', function() {
    global.fetch = jest.fn(function() { return Promise.resolve({ status: 200 }); });
    window.SoulWebhook.config.enabled = true;
    window.SoulWebhook.config.webhookUrl = 'https://hooks.example.com/test';

    var r = { scores: { openness: 50, conscientiousness: 50, extraversion: 50, agreeableness: 50, neuroticism: 50 }, enneagram: { type: 1, name: 't', icon: '?' } };
    var p = { soulType: 't', summary: 't' };

    // 第一次调用
    return window.SoulWebhook.send(r, p, []).then(function() {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      // 清空 mock 计数
      global.fetch.mockClear();
      // 第二次调用（应在防抖窗口内）
      return window.SoulWebhook.send(r, p, []);
    }).then(function() {
      // 防抖窗口内不应直接发送
      // doSend 会延迟发送，但我们需要检查 debounce 是否工作
      expect(global.fetch).toHaveBeenCalledTimes(0);
    });
  });
});
