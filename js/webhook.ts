/**
 * webhook.ts — 管理员数据回传模块
 * 支持企业微信 / 飞书 / 钉钉，自动识别平台
 */

export const SoulWebhook = (() => {

  // ═══ 防抖与频率限制 ═══
  let lastSendTime = 0;
  let pendingTimer: ReturnType<typeof setTimeout> | null = null;
  const DEBOUNCE_MS = 3000;   // 3 秒内不重复推送
  const MAX_RETRIES = 1;

  // ═══ 管理员配置区 ═══
  // ⚠️ CORS 说明：企业微信/飞书/钉钉 Webhook 不支持浏览器直接跨域调用。
  // 推荐方案：部署代理（如 Cloudflare Worker），将 proxyUrl 设为代理地址。
  // 无代理时使用 mode:'no-cors'，请求会发出但无法确认是否到达。
  // 可通过 .env 文件配置 VITE_WEBHOOK_URL / VITE_PROXY_URL / VITE_WEBHOOK_ENABLED
  const ADMIN_CONFIG: WebhookConfig = {
    webhookUrl: (typeof __WEBHOOK_URL__ !== 'undefined' ? __WEBHOOK_URL__ : '') || '',
    proxyUrl: (typeof __PROXY_URL__ !== 'undefined' ? __PROXY_URL__ : '') || '',
    enabled: (typeof __WEBHOOK_ENABLED__ !== 'undefined' ? __WEBHOOK_ENABLED__ === 'true' : false),
    includeAnswers: true
  };
  // ═════════════════════

  /**
   * 自动识别平台
   */
  function detectPlatform(url: string): string {
    if (url.includes('qyapi.weixin.qq.com')) return 'wecom';
    if (url.includes('open.feishu.cn')) return 'feishu';
    if (url.includes('oapi.dingtalk.com')) return 'dingtalk';
    return 'generic';
  }

  /**
   * 构建文本进度条
   */
  function buildBar(value: number, max: number = 10): string {
    const filled = Math.round((value / 100) * max);
    return '█'.repeat(filled) + '░'.repeat(max - filled);
  }

  /**
   * 企业微信 Markdown 消息体
   */
  function buildWecomMarkdown(payload: WebhookPayload): Record<string, unknown> {
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
      payload.answers.forEach(function(a, i) {
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
  function buildFeishuCard(payload: WebhookPayload): Record<string, unknown> {
    const scores = payload.scores;
    const scoreLines = [
      `开放性   ${buildBar(scores.openness)}  ${scores.openness}`,
      `尽责性   ${buildBar(scores.conscientiousness)}  ${scores.conscientiousness}`,
      `外向性   ${buildBar(scores.extraversion)}  ${scores.extraversion}`,
      `宜人性   ${buildBar(scores.agreeableness)}  ${scores.agreeableness}`,
      `神经质   ${buildBar(scores.neuroticism)}  ${scores.neuroticism}`,
    ].join('\n');

    const elements: Array<Record<string, unknown>> = [
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
      const answerText = payload.answers.map((a, i) => i + 1 + '. ' + a.text).join('\n');
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
  function buildGeneric(payload: WebhookPayload): WebhookPayload {
    return payload;
  }

  /**
   * 构造推送数据
   */
  function buildPayload(result: EvaluationResult, report: SoulReportData, answers: AnswerData[]): WebhookPayload {
    const answerDetails: WebhookAnswerDetail[] = answers.map(function(a) {
      const q = window.SOUL_QUESTIONS.find(q => q.id === a.questionId);
      let text = '';
      if (q) {
        if (q.type === 'ranking' && Array.isArray(a.choice)) {
          text = (a.choice as string[]).map(function(id) {
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
  async function send(result: EvaluationResult, report: SoulReportData, answers: AnswerData[]): Promise<void> {
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

  async function doSend(result: EvaluationResult, report: SoulReportData, answers: AnswerData[]): Promise<void> {
    const payload = buildPayload(result, report, answers);
    const platform = detectPlatform(ADMIN_CONFIG.webhookUrl);
    let body: Record<string, unknown> | WebhookPayload;

    switch (platform) {
      case 'wecom': body = buildWecomMarkdown(payload); break;
      case 'feishu': body = buildFeishuCard(payload); break;
      case 'dingtalk': body = buildWecomMarkdown(payload); break;
      default: body = buildGeneric(payload);
    }

    const targetUrl = ADMIN_CONFIG.proxyUrl || ADMIN_CONFIG.webhookUrl;
    const isProxy = !!ADMIN_CONFIG.proxyUrl;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const resp = await fetch(targetUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          mode: isProxy ? 'cors' : 'no-cors'
        });
        if (isProxy && !resp.ok) {
          throw new Error(`HTTP ${resp.status}: ${resp.statusText}`);
        }
        console.log(`[SoulWebhook] 推送${isProxy ? '成功 (通过代理)' : '已发出 (opaque, 无法确认到达。建议配置 proxyUrl)'}`);
        return;
      } catch (err) {
        console.warn(`[SoulWebhook] 推送失败（第${attempt + 1}次）:`, (err as Error).message);
        if (attempt < MAX_RETRIES) {
          await new Promise<void>(r => setTimeout(r, 1000));
        }
      }
    }
  }

  // ═══ 重置内部状态（仅测试用） ═══
  function _testReset(): void {
    lastSendTime = 0;
    if (pendingTimer) {
      clearTimeout(pendingTimer);
      pendingTimer = null;
    }
  }

  return { send, config: ADMIN_CONFIG, _testReset };
})();

// Backward compatibility bridge
window.SoulWebhook = SoulWebhook;
