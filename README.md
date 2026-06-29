# 🔮 灵魂解码

基于现代心理学的**在线灵魂问答与人格解读系统**。

回答 28 道精心设计的问题，获取你的专属灵魂解读报告。

## 🎯 核心功能

- **28 道灵魂之问**：场景投射题、Likert 量表题、拖拽排序题三种题型混合
- **五维人格分析**：基于大五人格（OCEAN）模型的百分制评分
- **九型人格匹配**：五维加权模式匹配 9 种核心人格类型
- **灵魂解读报告**：6 大板块（总览 / 五维图谱 / 九型人格 / 灵魂暗面 / 成长路径 / 灵魂共鸣）
- **分享功能**：URL 链接分享（带签名校验）+ 图片保存（html2canvas + 双 CDN 回退）
- **排序题键盘操作**：↑↓ 方向键 + Home/End + 触屏 ↑↓ 按钮，无障碍支持
- **PWA 离线支持**：Service Worker 预缓存核心资源，二次加载秒开
- **XSS 安全防护**：HTML 自动转义标签模板，杜绝注入风险
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
| 分享 | html2canvas (CDN) 截图 + Base64 URL 分享（带签名防篡改） |
| PWA | Service Worker（版本化增量更新） |
| 测试 | Jest + JSDOM（40 个单元测试 + 覆盖率） |
| 代码质量 | ESLint + EditorConfig |

## 🌐 浏览器兼容

| 浏览器 | 最低版本 | 说明 |
|--------|---------|------|
| Chrome | 80+ | 完全支持 |
| Firefox | 80+ | 完全支持 |
| Safari | 14+ | 完全支持（已测试 touch 事件） |
| Edge | 80+ | 完全支持 |
| 微信内置浏览器 | 最新版 | 支持（页面分享需手动截图） |

> 依赖特性：CSS `backdrop-filter`（Safari 14+ 支持）、`PointerEvent`、`fetch`、`Service Worker`、`localStorage`。所有特性均有降级处理。

## 📂 项目结构

```
灵魂问答/
├── index.html          # 主页面
├── manifest.json       # PWA 清单
├── sw.js               # Service Worker（离线缓存 v2，版本自管理）
├── package.json        # 依赖与测试配置
├── jest.config.js      # Jest 配置（含覆盖率）
├── jest-setup.js       # 测试环境配置
├── eslint.config.mjs   # ESLint 配置
├── .prettierrc         # 代码格式化配置
├── .editorconfig       # 编辑器通用配置
├── .gitignore
├── css/
│   └── style.css       # 全局样式（深空灵魂主题）
├── js/
│   ├── questions.js    # 题库数据（28 题 + 计分映射）
│   ├── scoring.js      # 评分算法（OCEAN + 九型 z-score 匹配）
│   ├── utils.js        # 通用工具函数（XSS 防护模板、DOM 构建）
│   ├── report.js       # 报告生成引擎（148 段文案组合）
│   ├── ui.js           # UI 控制（页面状态机、动画、错误边界）
│   ├── share.js        # 分享功能（截图/链接签名）
│   └── webhook.js      # 管理员数据回传（防抖/多平台自适应）
├── __tests__/
│   ├── scoring.test.js           # 评分与九型匹配单元测试（19 用例）
│   ├── report_and_share.test.js  # 报告生成与分享测试（21 用例）
│   └── distribution_test.js      # 九型分布测试（手动运行）
└── docs/
    └── plan.md         # 详细设计文档
```

## 🚀 使用方式

直接打开 `index.html` 即可体验。支持所有现代浏览器。

### 安装依赖（可选，仅用于运行测试与代码检查）

```bash
npm install
npm test         # 运行单元测试（40 个用例）
npm run test:coverage  # 运行测试并生成覆盖率报告
npm run lint     # 代码风格检查
npm run lint:fix # 自动修复代码风格问题
```

### 九型人格分布测试（可选）

```bash
node __tests__/distribution_test.js
```

该脚本模拟 10,000 次随机答题 + 5 种偏科答题 + 极端情况，验证九型人格匹配算法无严重分布偏差。

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

## 📊 性能基线

| 指标 | 当前值 | 目标 |
|------|--------|------|
| JS 总大小（gzip 后） | ~35 KB | < 50 KB |
| 首屏 HTML | ~5 KB | < 10 KB |
| CSS 总大小 | ~19 KB（gzip 约 6 KB） | < 10 KB (gzip) |
| FCP（首次内容渲染） | < 1.5s（现代设备） | < 1.5s |
| LCP（最大内容渲染） | < 2.0s（现代设备） | < 2.5s |

> 当前无图片资源，最大渲染内容为报告页的 Canvas 雷达图和毛玻璃卡片。性能瓶颈主要在 html2canvas（截图分享时动态加载 ~83 KB 的 CDN 脚本）。

## 🛡️ 安全措施

| 维度 | 措施 | 状态 |
|------|------|------|
| **CSP** | meta 标签限制 script-src / style-src / connect-src | ✅ 已配置 |
| **XSS** | 安全 HTML 模板 `esc()` + `html()` 自动转义所有插值 | ✅ 全覆盖 |
| **DOM 操作** | 优先使用 `createElement()` + `textContent` 而非 `innerHTML` | ✅ 导览 |
| **分享签名** | HMAC 风格签名防止 URL 参数篡改 | ✅ 已实现 |
| **Webhook 安全** | 前端硬编码 URL 标注安全提醒，默认关闭，建议生产环境用代理 | ⚠️ 需使用者注意 |
| **隐私** | 无 Cookie、无第三方追踪、无用户实名信息收集 | ✅ |
| **错误边界** | `window.onerror` + `unhandledrejection` + 白屏降级 | ✅ |

## ✅ 当前状态

- **40 个单元测试全部通过**（评分 / 九型 / 报告生成 / 分享功能）
- **ESLint 零报警**（14 个 JS 文件零错误零警告）
- **覆盖率**：核心评分模块 96%，报告生成 95%
- PWA 离线可用（Service Worker v2，支持增量更新 + 版本通知）
- 全局错误边界 + 白屏降级 + Toast 提示
- XSS 防护（html 标签模板自动转义 + DOM 安全操作）
- 排序题键盘操作支持（↑↓ 方向键 / Home-End / 触屏 ↑↓ 按钮）
- ARIA 标签无障碍支持（进度条 / 按钮 / 排序项）
- 响应式适配（移动端/平板/桌面）
- 分享链接签名防篡改
- 九型人格分布经 10,000 次随机答题验证（极差 < 16%）

> ⚠️ 仅供娱乐参考，不构成专业心理评估或建议。如有心理健康问题，请咨询专业心理咨询师（全国心理援助热线：400-161-9995）。
