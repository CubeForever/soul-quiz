# 🔮 灵魂解码 — 项目规划文档

> 基于现代心理学的在线灵魂问答与人格解读系统

---

## 一、项目概述

### 1.1 项目定位
一个面向大众的**在线灵魂问答网页**，用户通过回答一系列精心设计的心理学问题，获得一份**详细、完整、个性化**的灵魂解读报告。

核心卖点：
- **科学底座**：问题与评分算法基于现代心理学公开研究成果
- **体验包装**：用「灵魂解码」的叙事方式包装，增强沉浸感和趣味性
- **真实洞察**：解读结果基于真实心理学维度，对用户有自我认知价值
- **免责提醒**：明确标注「仅供娱乐参考，不构成专业心理建议」

### 1.2 目标用户
- 18-35 岁对自我探索感兴趣的年轻人
- 社交媒体活跃用户（易传播分享）
- 对 MBTI/星座/塔罗等感兴趣的泛心理学爱好者

### 1.3 核心体验流程
```
用户进入 → 浏览问题（逐题/分组） → 回答完成 → 生成灵魂解读报告 → 可分享/截图
                                         ↓（静默）
                                   Webhook 推送至管理员
```

---

## 二、心理学理论基础

本项目的评分和解读体系融合以下**三个维度**的现代心理学框架：

### 2.1 大五人格模型（Big Five / OCEAN）— 主框架

| 维度 | 英文 | 含义 | 灵魂包装名称 |
|------|------|------|-------------|
| **开放性** | Openness | 对新体验、想象力、好奇心的倾向 | ✨ 灵魂的光芒 — 探索之火 |
| **尽责性** | Conscientiousness | 自律、组织性、目标导向 | 🏛️ 灵魂的基石 — 意志之塔 |
| **外向性** | Extraversion | 社交活力、积极情绪、冒险倾向 | 🌊 灵魂的潮汐 — 能量之流 |
| **宜人性** | Agreeableness | 合作、同理心、信任他人 | 💚 灵魂的温度 — 共情之光 |
| **神经质** | Neuroticism | 情绪波动、焦虑、敏感性 | 🌙 灵魂的暗面 — 感知之渊 |

> **来源**：IPIP-NEO（国际人格题库）公开量表，[ipip.ori.org](https://ipip.ori.org)  
> **学术依据**：Costa & McCrae (1992) NEO-PI-R；被公认为最科学的人格模型

### 2.2 九型人格（Enneagram）— 补充维度

作为 OCEAN 的补充，增加「核心动机/恐惧」维度：

| 类型 | 核心动机 | 灵魂包装 |
|------|---------|---------|
| 1 完美主义者 | 追求正确、避免犯错 | 🎯 秩序守护者 |
| 2 助人者 | 被需要、给予爱 | 🤲 温暖织者 |
| 3 成就者 | 被认可、追求成功 | 👑 光芒追寻者 |
| 4 个人主义者 | 独特身份、深层情感 | 🎭 灵魂诗人 |
| 5 观察者 | 知识、理解、自主 | 🔮 智慧守望者 |
| 6 忠诚者 | 安全感、忠诚可靠 | 🛡️ 信念守卫 |
| 7 热情者 | 快乐、自由、新体验 | 🌈 自由旅人 |
| 8 挑战者 | 力量、掌控、保护 | ⚡ 力量化身 |
| 9 和平者 | 和谐、内在平静 | ☁️ 宁静使者 |

> **来源**：Riso-Hudson Enneagram Type Indicator；[Open-Source Psychometrics Project](https://openpsychometrics.org)

### 2.3 投射心理学 & 隐喻场景 — 增强趣味性

借鉴投射测试（如罗夏墨迹测试、TAT 主题统觉测试）的思路，设计**隐喻场景题**：

- 不直接问「你容易焦虑吗？」
- 而是问「你在一片漆黑的森林中，听到身后有脚步声，你第一反应是？」
- 通过场景选择投射潜意识倾向

> 这类题目增加趣味性和"灵魂感"，同时仍可映射到心理学维度

---

## 三、问题体系设计

### 3.1 问题分类与数量

基础版共 **28 道题**，进阶版共 **50 道题**，分为 **5 个灵魂维度**：

| 维度 | 基础版 | 进阶版 | 题目类型 | 测量目标 |
|------|--------|--------|---------|---------|
| 🌌 **认知之门** | 6 题 | 10 题 | 场景选择 + 偏好判断 | 开放性、想象力 |
| 🔥 **意志熔炉** | 6 题 | 10 题 | 行为倾向 + 自评 | 尽责性、自律 |
| 🌊 **情感海洋** | 6 题 | 10 题 | 情绪反应 + 社交场景 | 外向性、情绪风格 |
| 💚 **关系之网** | 5 题 | 10 题 | 人际场景 + 价值判断 | 宜人性、同理心 |
| 🌙 **内心深渊** | 5 题 | 10 题 | 投射场景 + 自我认知 | 情绪调节、核心动机 |

### 3.2 题型设计（三种题型混合）

#### 题型 A：场景投射题（4 选 1 图文卡片）
```
问题：你走进一个从未到过的房间，房间里有四扇门。
你会先打开哪一扇？

A. 散发温暖光芒的金色门 ——（开放性↑，外向性↑）
B. 雕刻精密花纹的黑色门 ——（尽责性↑，内省↑）
C. 半掩着，能听到笑声的白色门 ——（外向性↑，宜人性↑）
D. 被藤蔓缠绕的翠绿色门 ——（开放性↑，冒险↑）
```

#### 题型 B：行为倾向题（Likert 5 级量表）
```
问题：当计划被突然打乱时，我通常会……

1 = 感到非常烦躁，很难适应
2 = 有些不安，但能慢慢调整
3 = 没什么特别的感觉
4 = 有点兴奋，觉得新变化有趣
5 = 非常欢迎，喜欢意想不到的事
```

#### 题型 C：价值排序题（拖拽排序）
```
问题：以下五个词，按照对你最重要的程度排序（拖拽排序）：

自由 / 安全 / 爱 / 成就 / 平静
```

### 3.3 计分映射规则

每道题的每个选项对应不同维度的加分：

```javascript
// 示例：题目1 的选项映射
{
  questionId: 1,
  type: "scenario",
  options: [
    { id: "A", scores: { openness: 3, extraversion: 1, agreeableness: 0, conscientiousness: 0, neuroticism: 0 } },
    { id: "B", scores: { openness: 0, extraversion: 0, agreeableness: 0, conscientiousness: 3, neuroticism: 1 } },
    { id: "C", scores: { openness: 0, extraversion: 3, agreeableness: 2, conscientiousness: 0, neuroticism: 0 } },
    { id: "D", scores: { openness: 2, extraversion: 0, agreeableness: 0, conscientiousness: 0, neuroticism: 2 } }
  ]
}
```

---

## 四、评分算法设计

### 4.1 评分流程

```
用户回答 → 汇总各维度得分 → 归一化为百分比 → 生成人格画像 → 匹配九型人格 → 生成解读报告
```

### 4.2 五维评分（OCEAN）

```javascript
// 伪代码
const rawScores = { openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 0, neuroticism: 0 };

answers.forEach(answer => {
  const option = getOption(answer.questionId, answer.choice);
  Object.keys(option.scores).forEach(dim => {
    rawScores[dim] += option.scores[dim];
  });
});

// 归一化为 0-100 百分比
const maxPossible = getMaxScores(); // 每个维度的理论最高分
const percentScores = {};
Object.keys(rawScores).forEach(dim => {
  percentScores[dim] = Math.round((rawScores[dim] / maxPossible[dim]) * 100);
});
```

### 4.3 人格类型判定

根据五维得分的高低组合，生成**人格类型标签**：

```javascript
function generatePersonaTag(scores) {
  const tags = [];

  // 开放性
  if (scores.openness >= 70) tags.push("梦想家");
  else if (scores.openness >= 40) tags.push("平衡者");
  else tags.push("务实者");

  // 尽责性
  if (scores.conscientiousness >= 70) tags.push("建造者");
  else if (scores.conscientiousness >= 40) tags.push("航行者");
  else tags.push("流浪者");

  // 外向性
  if (scores.extraversion >= 70) tags.push("发光体");
  else if (scores.extraversion >= 40) tags.push("适应者");
  else tags.push("独行者");

  // 宜人性
  if (scores.agreeableness >= 70) tags.push("治愈者");
  else if (scores.agreeableness >= 40) tags.push("协调者");
  else tags.push("守界者");

  // 神经质（反向包装）
  if (scores.neuroticism >= 70) tags.push("深感者");
  else if (scores.neuroticism >= 40) tags.push("波澜者");
  else tags.push("平静者");

  return tags;
}
```

### 4.4 九型人格匹配

```javascript
function matchEnneagram(scores) {
  // 基于五维得分的组合模式，推算最可能的九型人格
  const patterns = [
    { type: 1, pattern: { conscientiousness: "high", agreeableness: "mid", neuroticism: "mid" }, name: "秩序守护者" },
    { type: 2, pattern: { agreeableness: "high", extraversion: "high", conscientiousness: "mid" }, name: "温暖织者" },
    { type: 3, pattern: { extraversion: "high", conscientiousness: "high", openness: "mid" }, name: "光芒追寻者" },
    { type: 4, pattern: { openness: "high", neuroticism: "high", extraversion: "low" }, name: "灵魂诗人" },
    { type: 5, pattern: { openness: "high", extraversion: "low", agreeableness: "low" }, name: "智慧守望者" },
    { type: 6, pattern: { conscientiousness: "high", neuroticism: "high", agreeableness: "high" }, name: "信念守卫" },
    { type: 7, pattern: { extraversion: "high", openness: "high", conscientiousness: "low" }, name: "自由旅人" },
    { type: 8, pattern: { extraversion: "high", agreeableness: "low", conscientiousness: "high" }, name: "力量化身" },
    { type: 9, pattern: { agreeableness: "high", neuroticism: "low", extraversion: "low" }, name: "宁静使者" }
  ];
  // 计算与每种模式的匹配度，返回最匹配的
  return bestMatch(patterns, scores);
}
```

---

## 五、灵魂解读报告设计

### 5.1 报告结构（6 个板块）

#### 板块 1：灵魂总览
```
🔮 你的灵魂类型：「深海梦想家 × 灵魂诗人」
- 一句话灵魂概述（基于五维得分组合的个性化文案）
- 灵魂色卡（根据得分映射到一个渐变色彩方案）
```

#### 板块 2：五维灵魂图谱
```
用雷达图/花瓣图展示五个维度的得分：
- 每个维度有 3 档描述（低/中/高），共 15 段个性化文案
- 使用组合文案：高开放性 + 低外向性 = "你的灵魂是一颗在深海中发光的珍珠"
```

#### 板块 3：灵魂深处（九型人格解读）
```
- 匹配的九型人格类型
- 核心动机 & 核心恐惧
- 成长方向建议
- 与其他类型的互动关系
```

#### 板块 4：灵魂暗面
```
- 基于神经质维度得分的解读
- 可能的内在冲突
- 压力下的反应模式
- 包装为"灵魂的阴影"叙事
```

#### 板块 5：灵魂成长路径
```
- 基于得分短板给出 3 条成长建议
- 每条建议配有心理学依据
- 用「灵魂修炼」的叙事包装
```

#### 板块 6：灵魂共鸣
```
- 与你灵魂类型最契合的 2-3 种其他类型
- 适合你的社交/工作/亲密关系建议
- 一句总结性灵魂寄语
```

### 5.2 文案数量估算

| 维度 | 低(0-33) | 中(34-66) | 高(67-100) |
|------|---------|---------|---------|
| 开放性 | 1段 | 1段 | 1段 |
| 尽责性 | 1段 | 1段 | 1段 |
| 外向性 | 1段 | 1段 | 1段 |
| 宜人性 | 1段 | 1段 | 1段 |
| 神经质 | 1段 | 1段 | 1段 |

- 单维度文案：5 维 × 3 档 = **15 段**
- 双维度组合文案：10 种组合 × 3 档 = **30 段**（精选关键组合）
- 九型人格文案：9 种 × 每种 3 段 = **27 段**
- 成长建议文案：**15 条**
- 总述/寄语文案：**20 条**
- **合计约 107 段独立文案**

### 5.3 报告视觉呈现

```
┌─────────────────────────────────────────┐
│  🔮 灵魂解码报告                         │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │     你的灵魂类型                  │    │
│  │  「深海梦想家 × 灵魂诗人」        │    │
│  │     灵魂色彩渐变条               │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────── 五维雷达图 ──────────┐    │
│  │         开放性 85               │    │
│  │        ╱          ╲            │    │
│  │  神经质60    🌟     外向性45    │    │
│  │        ╲          ╱            │    │
│  │     宜人性70  尽责性55          │    │
│  └─────────────────────────────────┘    │
│                                         │
│  [灵魂深处] [灵魂暗面] [成长路径]        │
│                                         │
│  ┌─ 免责声明 ──────────────────────┐    │
│  │ 本报告仅供娱乐参考，              │    │
│  │ 不构成专业心理评估或建议。         │    │
│  └─────────────────────────────────┘    │
│                                         │
│  [保存图片]  [分享给朋友]                │
└─────────────────────────────────────────┘
```

---

## 六、管理员数据回传系统（Webhook）

### 6.0 方案概述

用户答题完成后，前端通过 `fetch` 向管理员配置的 Webhook 地址**静默发送一条消息**，包含用户的全部答案、五维得分、九型人格结果和完整解读报告。管理员在群聊中即可实时查看每一份报告。

> **对用户无感**：Webhook 发送在后台静默执行，失败不影响用户体验，不阻塞结果页展示。

### 6.1 支持的 Webhook 平台

| 平台 | Webhook URL 格式 | 消息类型 | 文档 |
|------|-----------------|---------|------|
| **企业微信** | `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxx` | text / markdown / news | [官方文档](https://developer.work.weixin.qq.com/document/path/91770) |
| **飞书** | `https://open.feishu.cn/open-apis/bot/v2/hook/xxx` | text / post / interactive | [官方文档](https://open.feishu.cn/document/client-docs/bot-v3/add-custom-bot) |
| **钉钉** | `https://oapi.dingtalk.com/robot/send?access_token=xxx` | text / markdown / actionCard | [官方文档](https://open.dingtalk.com/document/orgapp/the-robot-sends-a-group-message) |

> 代码中做平台自适应：通过 Webhook URL 自动识别平台，构造对应格式的消息体。

### 6.2 推送数据结构

```javascript
// 推送给管理员的完整数据
const webhookPayload = {
  // 元信息
  timestamp: "2026-06-20T14:32:00Z",       // 提交时间
  sessionId: "a7f3c2e1",                    // 匿名会话ID（8位随机哈希）

  // 答题概要
  soulType: "深海梦想家 × 灵魂诗人",         // 灵魂类型标题
  enneagramType: 4,                          // 九型人格编号
  enneagramName: "灵魂诗人",                 // 九型人格名称

  // 五维得分（百分制）
  scores: {
    openness: 85,
    conscientiousness: 55,
    extraversion: 45,
    agreeableness: 70,
    neuroticism: 60
  },

  // 原始答案（每题选择记录）
  answers: [
    { qid: 1, choice: "B", text: "雕刻精密花纹的黑色门" },
    { qid: 2, choice: 4, text: "有点兴奋，觉得新变化有趣" },
    // ... 共25-30题
  ],

  // 灵魂解读摘要（核心段落，非全文）
  reportDigest: "你的灵魂是一颗在深海中发光的珍珠。你拥有丰富的内心世界..."
};
```

### 6.3 管理员看到的消息样式

#### 企业微信群效果（Markdown 格式）：
```
🔮 新的灵魂报告

📌 灵魂类型：深海梦想家 × 灵魂诗人
🎭 九型人格：4号 - 灵魂诗人
⏰ 时间：2026-06-20 14:32

📊 五维图谱：
> ✨ 开放性：85 ████████▓░
> 🏛️ 尽责性：55 █████▓▓▓▓░
> 🌊 外向性：45 ████▓▓▓▓▓░
> 💚 宜人性：70 ███████▓░░
> 🌙 神经质：60 ██████▓▓▓░

📖 灵魂片段：你的灵魂是一颗在深海中发光的珍珠...

🔑 原始答案：共28题（点击查看完整记录）
```

#### 飞书群效果（交互式卡片）：
```
┌──────────────────────────────────┐
│ 🔮 新的灵魂报告                  │  ← 蓝色卡片头
├──────────────────────────────────┤
│ 灵魂类型：深海梦想家 × 灵魂诗人   │
│ 九型人格：4号 - 灵魂诗人          │
│ 时间：2026-06-20 14:32           │
│                                  │
│ ┌─ 五维图谱 ─────────────────┐  │
│ │ 开放性   ████████░░  85    │  │
│ │ 尽责性   █████░░░░░  55    │  │
│ │ 外向性   ████░░░░░░  45    │  │
│ │ 宜人性   ███████░░░  70    │  │
│ │ 神经质   ██████░░░░  60    │  │
│ └────────────────────────────┘  │
│                                  │
│ 「你的灵魂是一颗在深海中发光的...  │
│                                  │
│ [展开完整答案]                    │  ← 按钮
└──────────────────────────────────┘
```

### 6.4 核心实现逻辑

```javascript
// webhook.js — 核心逻辑

class SoulWebhook {
  constructor(webhookUrl) {
    this.url = webhookUrl;
    this.platform = this.detectPlatform(webhookUrl);
  }

  // 自动识别平台
  detectPlatform(url) {
    if (url.includes('qyapi.weixin.qq.com')) return 'wecom';
    if (url.includes('open.feishu.cn')) return 'feishu';
    if (url.includes('oapi.dingtalk.com')) return 'dingtalk';
    return 'generic';  // 通用 JSON POST
  }

  // 构造消息体（根据平台适配）
  buildMessage(payload) {
    switch (this.platform) {
      case 'wecom': return this.buildWecomMarkdown(payload);
      case 'feishu': return this.buildFeishuCard(payload);
      case 'dingtalk': return this.buildDingtalkMarkdown(payload);
      default: return { msgtype: 'text', text: { content: JSON.stringify(payload, null, 2) } };
    }
  }

  // 发送（静默，失败不阻塞）
  async send(payload) {
    try {
      const body = this.buildMessage(payload);
      await fetch(this.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        mode: 'no-cors'  // 跨域兼容
      });
    } catch (e) {
      console.warn('[Webhook] 推送失败（不影响用户体验）:', e);
    }
  }
}
```

### 6.5 安全设计

| 措施 | 说明 |
|------|------|
| **Webhook URL 不暴露** | URL 编译在 JS 中，可混淆处理；或通过环境变量在构建时注入 |
| **无用户个人信息** | 推送数据仅含匿名会话ID、答案和得分，不含 IP/设备/姓名 |
| **频率限制** | 内置防抖：同一用户短时间内重复提交只推送一次 |
| **静默失败** | Webhook 请求失败完全不影响用户端体验 |
| **CORS 处理** | 使用 `mode: 'no-cors'` 或通过管理员自建的轻量代理转发 |

> ⚠️ **CORS 注意**：企业微信和飞书 Webhook 不支持浏览器直接跨域调用。  
> **解决方案**：部署一个极简的代理函数（如 Cloudflare Worker / Vercel Edge Function，免费额度足够），前端 → 代理 → Webhook。  
> 代理仅做请求转发，不存储任何数据。

### 6.6 管理员配置方式

在 `webhook.js` 顶部提供配置区：

```javascript
// ═══ 管理员配置区 ═══
const ADMIN_CONFIG = {
  // 你的 Webhook 地址（替换为实际地址）
  webhookUrl: 'https://your-webhook-url-here',

  // 代理地址（解决 CORS，可选）
  // 如不使用代理，留空则直接调用 Webhook
  proxyUrl: '',  // 例如: 'https://your-worker.workers.dev'

  // 推送开关
  enabled: true,

  // 推送完整答案详情（true=每题答案，false=仅得分概要）
  includeAnswers: true
};
// ═════════════════════
```

---

## 七、技术架构（原第六章，顺延）

### 7.1 技术选型

| 层级 | 方案 | 理由 |
|------|------|------|
| **前端框架** | 纯 HTML + CSS + JavaScript（单文件 SPA） | 项目规模适中，无需框架，便于部署和分享 |
| **样式方案** | CSS 变量 + 原生 CSS | 夜空/灵魂主题自定义能力强 |
| **图表** | Canvas 手绘雷达图 | 轻量、无依赖、可定制美观 |
| **动画** | CSS Animation + Transition | 流畅的灵魂流动效果 |
| **数据存储** | localStorage | 纯前端，无需后端，用户答案本地存储 |
| **分享功能** | html2canvas 截图 | 生成分享图片 |
| **数据回传** | 即时通讯 Webhook | 答题完成后静默推送至企业微信/飞书/钉钉群 |
| **部署** | 静态托管（任意平台） | 零后端成本 |

### 7.2 文件结构

```
灵魂问答/
├── index.html          # 主页面（入口）
├── css/
│   └── style.css       # 全局样式（灵魂主题）
├── js/
│   ├── questions.js    # 题库数据（25-30题 + 计分映射）
│   ├── scoring.js      # 评分算法（OCEAN + 九型匹配）
│   ├── report.js       # 报告生成引擎（文案组装）
│   ├── ui.js           # UI 控制（题目展示、动画、进度）
│   ├── share.js        # 分享功能（截图/链接）
│   └── webhook.js      # 管理员数据回传（Webhook 推送）
├── assets/
│   ├── fonts/          # 字体文件
│   └── images/         # 图标、背景素材
└── docs/
    └── plan.md         # 本文档
```

### 7.3 页面状态机

```
[欢迎页] → [答题页（逐题）] → [加载动画] → [结果页（6板块）] → [分享页]
   |              |                                        |
   |         可返回上一题                              可重新测试
   |________________________________________________________|
```

---

## 八、UI/UX 设计方向

### 8.1 视觉主题：「深空灵魂」

| 元素 | 设计 |
|------|------|
| **背景** | 深蓝紫渐变 + 微粒子星空动画 |
| **主色调** | `#0a0a2e` → `#1a1a4e` → `#2d1b69`（深空渐变） |
| **强调色** | `#f0c27f`（金色灵魂光芒）、`#a18cd1`（紫色灵韵） |
| **文字** | 白色主文字 + 半透明辅助文字 |
| **卡片** | 毛玻璃效果（backdrop-filter）+ 微光边框 |
| **字体** | 标题用衬线体（灵魂感），正文用无衬线体（可读性） |
| **动效** | 粒子漂浮、选项卡hover发光、维度切换渐变、雷达图绘制动画 |

### 8.2 交互设计

| 阶段 | 交互方式 |
|------|---------|
| **欢迎页** | 大标题缓慢淡入 + 粒子背景 + 开始按钮脉冲发光 |
| **答题** | 逐题展示，选择后自动滑入下一题，顶部进度条 |
| **场景题** | 4张卡片横向排列，hover放大，点击选择 |
| **量表题** | 5个圆形按钮，点击后带有涟漪效果 |
| **排序题** | 拖拽排序，带动物理回弹动效 |
| **加载** | 灵魂凝聚动画（粒子从四周聚拢形成图形） |
| **结果页** | 板块逐个淡入，雷达图从中心向外绘制 |
| **分享** | 一键生成图片，带二维码和个人灵魂类型 |

### 8.3 响应式适配

- **移动端优先**：以 375px 宽度为基准设计
- **平板**：768px 断点，适当增大卡片
- **桌面**：1024px+ 断点，居中限宽容器

---

## 九、免责与合规

### 9.1 免责声明（必须包含的位置）

1. **欢迎页底部**（开始前）：
   > ⚠️ 本测试基于公开心理学模型设计，仅供娱乐和自我探索参考，不构成任何专业心理评估、诊断或治疗建议。如有心理健康问题，请咨询专业心理咨询师。

2. **结果页底部**（报告后）：
   > 📋 本报告基于大五人格模型（OCEAN）和九型人格理论生成，仅供娱乐参考。心理学人格测评应由专业机构在规范环境下进行。如有需要，请拨打全国心理援助热线：400-161-9995

3. **分享图片水印**：
   > 灵魂解码 · 仅供娱乐

### 9.2 数据隐私
- **不收集用户个人身份信息**（无姓名、手机号、邮箱等）
- 答题数据仅存储在用户浏览器 localStorage
- Webhook 推送数据仅含：匿名会话ID、答案选项、五维得分、灵魂解读摘要
- 无 Cookie、无第三方追踪、无广告 SDK
- 管理员可在 `webhook.js` 中一键关闭推送功能（`enabled: false`）

---

## 十、实施路线图

### Phase 1：题库与算法（核心基础）⭐
- [ ] 编写 25-30 道题及计分映射
- [ ] 实现 OCEAN 评分算法
- [ ] 实现九型人格匹配逻辑
- [ ] 编写全部灵魂解读文案（~107段）

### Phase 2：UI 框架搭建
- [ ] 创建项目文件结构
- [ ] 实现欢迎页（深空主题 + 粒子背景）
- [ ] 实现答题页（逐题展示 + 进度条 + 动画）
- [ ] 实现三种题型的交互组件

### Phase 3：结果报告系统
- [ ] 实现雷达图绘制（Canvas）
- [ ] 实现 6 个报告板块的布局和渲染
- [ ] 实现文案组装引擎（根据得分选取对应段落）
- [ ] 添加报告页入场动画

### Phase 4：Webhook 管理员系统
- [ ] 实现 Webhook 推送模块（多平台自适应）
- [ ] 构造消息模板（Markdown/飞书卡片）
- [ ] 配置 CORS 代理（Cloudflare Worker）
- [ ] 推送防抖与静默失败处理

### Phase 5：视觉打磨与动效
- [ ] 粒子星空背景动画
- [ ] 答题卡 hover/click 动效
- [ ] 加载动画（灵魂凝聚）
- [ ] 结果页板块依次淡入
- [ ] 响应式适配完善

### Phase 6：分享与收尾
- [ ] html2canvas 截图分享功能
- [ ] 分享图片模板设计（含灵魂类型 + 水印）
- [ ] 免责声明完善
- [ ] 整体测试与优化

---

## 十一、关键技术难点与解决方案

| 难点 | 解决方案 |
|------|---------|
| 题目计分的科学性 | 参考 IPIP-NEO 量表的计分逻辑，每题选项非对称加分，避免天花板效应 |
| 文案数量大且需个性化 | 建立文案模板系统：维度 × 档位 × 组合，用模板变量插入个性化元素 |
| 粒子动画性能 | 使用 Canvas 2D 而非 DOM，控制粒子数量（移动端 ≤80，桌面 ≤150） |
| 报告生成的组合爆炸 | 五维 × 3 档 = 243 种基础组合，聚焦高频组合写文案，其余用模板拼接 |
| 移动端体验 | touch 事件适配、防止拖拽时页面滚动、合理的触摸区域大小 |
| Webhook 跨域 | 通过 Cloudflare Worker 做轻量代理转发，不存储数据，免费额度足够 |
| Webhook 消息格式 | 根据 URL 自动识别平台（企微/飞书/钉钉），构造对应 Markdown 或卡片格式 |

---

## 十二、参考资料

| 资源 | 链接 |
|------|------|
| IPIP-NEO 人格题库 | [ipip.ori.org](https://ipip.ori.org) |
| Open-Source Psychometrics | [openpsychometrics.org](https://openpsychometrics.org) |
| PsyToolkit 心理学工具 | [psytoolkit.org](https://www.psytoolkit.org) |
| Big Five JS 实现 | [GitHub: big-five-personality-test](https://github.com/haldun/big-five) |
| Enneagram Institute | [enneagraminstitute.com](https://www.enneagraminstitute.com) |

---

> 📝 **文档版本**：v1.2  
> **创建日期**：2026-06-20  
> **最后更新**：2026-06-29 — 代码审计修复：统一维度名称、修复评分一致性、WCAG 对比度、ES 模块化  
> **状态**：已实施，持续迭代中
