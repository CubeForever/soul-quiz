# 🔮 灵魂解码

基于现代心理学的**在线灵魂问答与人格解读系统**。

回答 28 道精心设计的问题，获取你的专属灵魂解读报告。

## 🎯 核心功能

- **28 道灵魂之问**：场景投射题、Likert 量表题、拖拽排序题三种题型混合
- **五维人格分析**：基于大五人格（OCEAN）模型的百分制评分
- **九型人格匹配**：五维加权模式匹配 9 种核心人格类型
- **灵魂解读报告**：6 大板块（总览 / 五维图谱 / 九型人格 / 灵魂暗面 / 成长路径 / 灵魂共鸣）
- **分享功能**：URL 链接分享（带签名校验）+ 图片保存（html2canvas + 双 CDN 回退）
- **PWA 离线支持**：Service Worker 预缓存核心资源，二次加载秒开
- **Webhook 推送**：支持企业微信 / 飞书 / 钉钉自动识别（带防抖保护）
- **星空动画背景**：Canvas 实现的动态粒子星空

## 🧠 心理学基础

| 模型 | 说明 | 来源 |
|------|------|------|
| **大五人格 (OCEAN)** | 开放性、尽责性、外向性、宜人性、神经质 | Costa & McCrae (1992) NEO-PI-R |
| **九型人格 (Enneagram)** | 9 种核心动机与恐惧模式 | Riso-Hudson Enneagram Type Indicator |
| **投射心理学** | 隐喻场景投射潜意识倾向 | 罗夏墨迹测试 / TAT 主题统觉测试 |

## 🛠️ 技术栈

纯前端 — HTML + CSS + JavaScript（零运行时依赖）。

| 层级 | 技术方案 |
|------|---------|
| 框架 | 无框架 SPA |
| 样式 | CSS 变量 + 毛玻璃效果 (backdrop-filter) |
| 图表 | Canvas 手绘雷达图（DPR 适配） |
| 动画 | CSS Animation + Transition + requestAnimationFrame |
| 存储 | localStorage（答题进度持久化） |
| 分享 | html2canvas (CDN) 截图 + Base64 URL 分享 |
| PWA | Service Worker + manifest.json |
| 测试 | Jest + JSDOM（19 个单元测试） |

## 📂 项目结构

```
灵魂问答/
├── index.html          # 主页面
├── manifest.json       # PWA 清单
├── sw.js               # Service Worker（离线缓存）
├── package.json        # 依赖与测试配置
├── jest-setup.js       # 测试环境配置
├── css/
│   └── style.css       # 全局样式（深空灵魂主题）
├── js/
│   ├── questions.js    # 题库数据（28 题 + 计分映射）
│   ├── scoring.js      # 评分算法（OCEAN + 九型匹配）
│   ├── report.js       # 报告生成引擎（文案组装）
│   ├── ui.js           # UI 控制（页面切换、动画、全局错误处理）
│   ├── share.js        # 分享功能（截图/链接签名）
│   └── webhook.js      # 管理员数据回传（防抖/多平台）
├── __tests__/
│   └── scoring.test.js # 评分与九型匹配单元测试
└── docs/
    └── plan.md         # 详细设计文档
```

## 🚀 使用方式

直接打开 `index.html` 即可体验。支持所有现代浏览器。

### 安装依赖（可选，仅用于运行测试）

```bash
npm install
npm test
```

## ⚙️ 配置说明

### 评分参数（`js/scoring.js` 顶部）

```javascript
CONFIG: {
  NORMALIZE_FACTOR: 0.72,       // 归一化因子
  MAX_PERCENT: 95,              // 分数上限
  MIN_PERCENT: 5,               // 分数下限
  TAG_THRESHOLDS: [82, 62, 45, 28],  // 5 档标签阈值
  ENNEAGRAM_HIGH: 70,           // 九型高分阈值
  ENNEAGRAM_MID_LOW: 42,        // 九型中分阈值
  RANK_MULTIPLIERS: [1, 0.6, 0.3, 0, 0]  // 排序题权重
}
```

### Webhook（`js/webhook.js`）

```javascript
// 修改 ADMIN_CONFIG 配置项
webhookUrl: '',   // 替换为你的 Webhook 地址
proxyUrl: '',     // 可选：CORS 代理地址
enabled: false,   // 开启推送
```

## ✅ 当前状态

- 19 个单元测试全部通过
- PWA 离线可用（Service Worker 缓存核心资源）
- 全局错误边界 + 白屏降级
- 响应式适配（移动端/平板/桌面）
- 无障碍支持（prefers-reduced-motion）
- 分享链接签名防篡改

> ⚠️ 仅供娱乐参考，不构成专业心理评估或建议。如有心理健康问题，请咨询专业心理咨询师（全国心理援助热线：400-161-9995）。
