// @ts-nocheck
/**
 * webhook.js — 管理员数据回传模块
 * 支持企业微信 / 飞书 / 钉钉，自动识别平台
 */

window.SoulWebhook = (() => {

  // ═══ 防抖与频率限制 ═══
  let lastSendTime = 0;
  let pendingTimer = null;
  const DEBOUNCE_MS = 3000;   // 3 秒内不重复推送
  const MAX_RETRIES = 1;

  // ═══ 管理员配置区 ═══
  const ADMIN_CONFIG = {
    // 你的 Webhook 地址（替换为实际地址）
    // ⚠️ 安全提醒：前端代码中的 URL 对用户可见。
    // 生产环境建议通过后端代理转发，而非直接暴露 Webhook URL。
    webhookUrl: '',

    // 代理地址（解决 CORS，推荐）
    // Cloudflare Worker 示例：https://your-worker.workers.dev
    //  Worker 代码见 docs/plan.md 或项目文档
    proxyUrl: '',

    // 推送开关
    enabled: false,

    // 推送完整答案详情
    includeAnswers: true
  };
  // ═════════════════════

  /**
   * 自动识别平台
   */
  function detectPlatform(url) {
    if (url.includes('qyapi.weixin.qq.com')) return 'wecom';
    if (url.includes('open.feishu.cn')) return 'feishu';
    if (url.includes('oapi.dingtalk.com')) return 'dingtalk';
    return 'generic';
  }

  /**
   * 构建文本进度条
   */
  function buildBar(value, max = 10) {
    const filled = Math.round((value / 100) * max);
    return '█'.repeat(filled) + '░'.repeat(max - filled);
  }

  /**
   * 企业微信 Markdown 消息体
   */
  function buildWecomMarkdown(payload) {
    const scores = payload.scores;
    const lines = [
      `🔮 **新的灵魂报告**`,
      ``,
      `📌 **灵魂类型**：${payload.soulType}`,
      `🎭 **九型人格**：${payload.enneagramType}号 - ${payload.enneagramName}`,
      `⏰ **时间**：${payload.timestamp}`,
      ``,
      `📊 **五维图谱**：`,
      `> ✨ 开放性：${scores.openness} ${buildBar(scores.openness)}`,
      `> 🏛️ 尽责性：${scores.conscientiousness} ${buildBar(scores.conscientiousness)}`,
      `> 🌊 外向性：${scores.extraversion} ${buildBar(scores.extraversion)}`,
      `> 💚 宜人性：${scores.agreeableness} ${buildBar(scores.agreeableness)}`,
      `> 🌙 神经质：${scores.neuroticism} ${buildBar(scores.neuroticism)}`,
      ``,
      `📖 **灵魂片段**：${payload.reportDigest}`,
    ];

    if (payload.includeAnswers && payload.answers.length > 0) {
      lines.push('', '🔑 **原始答案**：');
      payload.answers.forEach((a, i) => {
        lines.push(`> ${i + 1}. ${a.text}`);
      });
    }

    return {
      msgtype: 'markdown',
      markdown: { content: lines.join('\n') }
    };
  }

  /**
   * 飞书交互式卡片消息体
   */
  function buildFeishuCard(payload) {
    const scores = payload.scores;
    const scoreLines = [
      `开放性   ${buildBar(scores.openness)}  ${scores.openness}`,
      `尽责性   ${buildBar(scores.conscientiousness)}  ${scores.conscientiousness}`,
      `外向性   ${buildBar(scores.extraversion)}  ${scores.extraversion}`,
      `宜人性   ${buildBar(scores.agreeableness)}  ${scores.agreeableness}`,
      `神经质   ${buildBar(scores.neuroticism)}  ${scores.neuroticism}`,
    ].join('\n');

    const elements = [
      {
        tag: 'div',
        text: {
          tag: 'lark_md',
          content: `**灵魂类型**：${payload.soulType}\n**九型人格**：${payload.enneagramType}号 - ${payload.enneagramName}\n**时间**：${payload.timestamp}`
        }
      },
      { tag: 'hr' },
      {
        tag: 'div',
        text: { tag: 'lark_md', content: `**📊 五维图谱**\n\`\`\`\n${scoreLines}\n\`\`\`` }
      },
      { tag: 'hr' },
      {
        tag: 'div',
        text: { tag: 'lark_md', content: `📖 ${payload.reportDigest}` }
      }
    ];

    if (payload.includeAnswers && payload.answers.length > 0) {
      const answerText = payload.answers.map((a, i) => `${i + 1}. ${a.text}`).join('\n');
      elements.push(
        { tag: 'hr' },
        { tag: 'div', text: { tag: 'lark_md', content: `**🔑 原始答案**（共${payload.answers.length}题）\n${answerText}` } }
      );
    }

    return {
      msg_type: 'interactive',
      card: {
        config: { wide_screen_mode: true },
        header: {
          title: { tag: 'plain_text', content: '🔮 新的灵魂报告' },
          template: 'purple'
        },
        elements
      }
    };
  }

  /**
   * 通用 JSON 消息体
   */
  function buildGeneric(payload) {
    return payload;
  }

  /**
   * 构造推送数据
   */
  function buildPayload(result, report, answers) {
    const answerDetails = answers.map(a => {
      const q = window.SOUL_QUESTIONS.find(q => q.id === a.questionId);
      let text = '';
      if (q) {
        if (q.type === 'ranking' && Array.isArray(a.choice)) {
          text = a.choice.map(id => {
            const opt = q.options.find(o => o.id === id);
            return opt ? opt.text : id;
          }).join(' > ');
        } else {
          const opt = q.options.find(o => String(o.id) === String(a.choice));
          text = opt ? opt.text : String(a.choice);
        }
      }
      return { qid: a.questionId, choice: a.choice, text };
    });

    return {
      timestamp: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
      sessionId: Math.random().toString(36).substr(2, 8),
      soulType: report.soulType,
      enneagramType: result.enneagram.type,
      enneagramName: result.enneagram.name,
      scores: result.scores,
      answers: ADMIN_CONFIG.includeAnswers ? answerDetails : [],
      reportDigest: report.summary.substring(0, 200),
      includeAnswers: ADMIN_CONFIG.includeAnswers
    };
  }

  /**
   * 发送 Webhook（静默，不阻塞用户体验）
   * 内置防抖：3 秒内重复调用只发送一次
   */
  async function send(result, report, answers) {
    if (!ADMIN_CONFIG.enabled || !ADMIN_CONFIG.webhookUrl) return;

    // 防抖：清除待发送任务
    if (pendingTimer) {
      clearTimeout(pendingTimer);
      pendingTimer = null;
    }

    const now = Date.now();
    if (now - lastSendTime < DEBOUNCE_MS) {
      // 安排一次延迟发送（覆盖上次的）
      pendingTimer = setTimeout(() => {
        pendingTimer = null;
        lastSendTime = Date.now();
        doSend(result, report, answers);
      }, DEBOUNCE_MS);
      return;
    }

    lastSendTime = now;
    await doSend(result, report, answers);
  }

  async function doSend(result, report, answers) {
    const payload = buildPayload(result, report, answers);
    const platform = detectPlatform(ADMIN_CONFIG.webhookUrl);
    let body;

    switch (platform) {
      case 'wecom': body = buildWecomMarkdown(payload); break;
      case 'feishu': body = buildFeishuCard(payload); break;
      case 'dingtalk': body = buildWecomMarkdown(payload); break;
      default: body = buildGeneric(payload);
    }

    const targetUrl = ADMIN_CONFIG.proxyUrl || ADMIN_CONFIG.webhookUrl;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        await fetch(targetUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          mode: 'no-cors'
        });
        console.log('[SoulWebhook] 推送完成');
        return;
      } catch (e) {
        console.warn(`[SoulWebhook] 推送失败（第${attempt + 1}次）:`, e.message);
        if (attempt < MAX_RETRIES) {
          await new Promise(r => setTimeout(r, 1000));
        }
      }
    }
  }

  // ═══ 重置内部状态（仅测试用） ═══
  function _testReset() {
    lastSendTime = 0;
    if (pendingTimer) {
      clearTimeout(pendingTimer);
      pendingTimer = null;
    }
  }

  return { send: send, config: ADMIN_CONFIG, _testReset: _testReset };
})();
