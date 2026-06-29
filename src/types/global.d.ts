/**
 * 灵魂解码 — 全局类型声明
 */

// ═══ 题库类型 ═══

interface QuestionOption {
  id: string | number;
  text: string;
  scores: Partial<Record<DimensionKey, number>>;
}

type QuestionType = 'scenario' | 'likert' | 'ranking';

interface QuestionData {
  id: number;
  type: QuestionType;
  dimension: string;
  text: string;
  options: QuestionOption[];
}

interface DimensionMeta {
  name: string;
  icon: string;
  soulName: string;
}

type DimensionKey = 'openness' | 'conscientiousness' | 'extraversion' | 'agreeableness' | 'neuroticism';

// ═══ 答案类型 ═══

interface AnswerData {
  questionId: number;
  choice: string | number | string[];
}

// ═══ 评分类型 ═══

interface RawScores {
  [key: string]: number;
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

type NormalizedScores = RawScores;

// 九型模式中的维度权重配置
interface WeightEntry {
  e: 'high' | 'mid' | 'low';
  w: number;
}

type WeightMap = Record<DimensionKey, WeightEntry>;

interface EnneagramPattern {
  type: number;
  name: string;
  icon: string;
  motivation: string;
  fear: string;
  w: WeightMap;
}

interface EnneagramResult {
  type: number;
  name: string;
  icon: string;
  motivation: string;
  fear: string;
}

interface EvaluationResult {
  raw: RawScores;
  max: RawScores;
  scores: NormalizedScores;
  tags: string[];
  enneagram: EnneagramResult;
}

// ═══ 报告类型 ═══

interface DimensionDetail {
  score: number;
  level: 'veryHigh' | 'high' | 'midHigh' | 'midLow' | 'low';
  text: string;
  icon: string;
  name: string;
}

interface EnneagramDetail {
  type: number;
  name: string;
  icon: string;
  motivation: string;
  fear: string;
  growth: string;
  relation: string;
}

interface ShadowDetail {
  title: string;
  level: string;
  text: string;
  conflict: string;
  stress: string;
}

interface GrowthItem {
  title: string;
  text: string;
  psychology: string;
}

interface ResonanceDetail {
  compatible: string[];
  advice: string;
  blessing: string;
}

interface SoulReportData {
  soulType: string;
  soulColor: { from: string; to: string };
  summary: string;
  dimensions: Record<DimensionKey, DimensionDetail>;
  combination: string;
  enneagram: EnneagramDetail;
  shadow: ShadowDetail;
  growth: GrowthItem[];
  resonance: ResonanceDetail;
}

// ═══ UI 类型 ═══

interface ElementRefMap {
  welcome: HTMLElement | null;
  quiz: HTMLElement | null;
  loading: HTMLElement | null;
  report: HTMLElement | null;
  progressBar: HTMLElement | null;
  progressText: HTMLElement | null;
  questionArea: HTMLElement | null;
  btnStart: HTMLElement | null;
  btnBack: HTMLElement | null;
  btnRestart: HTMLElement | null;
  btnShare: HTMLElement | null;
  btnSave: HTMLElement | null;
  reportContainer: HTMLElement | null;
  canvas: HTMLCanvasElement | null;
}

interface UIAnswer {
  questionId: number;
  choice: string | number | string[];
}

interface UIState {
  currentQuestion: number;
  answers: UIAnswer[];
  result: EvaluationResult | null;
  report: SoulReportData | null;
  phase: 'welcome' | 'quiz' | 'loading' | 'report';
  bankId: string;
}

interface LoadingParticle {
  angle: number;
  dist: number;
  speed: number;
  radius: number;
  shrink: number;
  color: string;
}

interface StarFieldStar {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  speed: number;
  phase: number;
}

interface ToastElement extends HTMLElement {
  _hideTimer?: ReturnType<typeof setTimeout>;
}

interface SharedReportData {
  scores: NormalizedScores;
  enneagramType: number;
}

// ═══ 报告引擎类型 ═══

type SoulLevel = 'veryHigh' | 'high' | 'midHigh' | 'midLow' | 'low';

interface LevelTextMap {
  veryHigh: string;
  high: string;
  midHigh: string;
  midLow: string;
  low: string;
}

interface ComboTextMap {
  bothHigh: string;
  mixed: string;
  bothLow: string;
}

interface EnneagramTextMap {
  motivation: string;
  fear: string;
  growth: string;
  relation: string;
}

interface ShadowLevelTexts {
  text: LevelTextMap;
  conflict: LevelTextMap;
  stress: LevelTextMap;
}

interface GrowthPoolEntry {
  title: string;
  text: string;
  psychology: string;
}

interface Phenomenon {
  phenomenon: string;
  desc: string;
}

interface SoulTitleRule {
  check: (s: NormalizedScores) => boolean;
  title: string;
}

interface DimLevelDescs {
  veryHigh: string;
  high: string;
  midHigh: string;
  midLow: string;
  low: string;
}

// ═══ Webhook 类型 ═══

interface WebhookConfig {
  webhookUrl: string;
  proxyUrl: string;
  enabled: boolean;
  includeAnswers: boolean;
}

interface WebhookPayload {
  timestamp: string;
  sessionId: string;
  soulType: string;
  enneagramType: number;
  enneagramName: string;
  scores: NormalizedScores;
  answers: WebhookAnswerDetail[];
  reportDigest: string;
  includeAnswers: boolean;
}

interface WebhookAnswerDetail {
  qid: number;
  choice: string | number | string[];
  text: string;
}

// ═══ 全局命名空间声明 ═══

interface SoulScoringEngine {
  CONFIG: {
    MAX_PERCENT: number;
    MIN_PERCENT: number;
    TAG_THRESHOLDS: number[];
    ENNEAGRAM_HIGH: number;
    ENNEAGRAM_MID_LOW: number;
    RANK_MULTIPLIERS: number[];
  };
  DIMENSIONS: DimensionKey[];
  ENNEAGRAM_POPULATION_STATS: Record<string, { mean: number; std: number }>;
  calculateRawScores(answers: AnswerData[]): RawScores;
  getMaxScores(questions: QuestionData[]): RawScores;
  normalizeScores(raw: RawScores, max: RawScores): NormalizedScores;
  generatePersonaTags(scores: NormalizedScores): string[];
  getEnneagramPatterns(): EnneagramPattern[];
  matchEnneagram(scores: NormalizedScores): EnneagramResult;
  evaluate(answers: AnswerData[]): EvaluationResult;
}

interface SoulUtilsAPI {
  esc(str: unknown): string;
  el(tag: string, attrs: Record<string, string | number | boolean | Record<string, string>> | null, ...children: Array<Node | string | number | null | undefined>): HTMLElement;
  empty(el: HTMLElement): void;
  html(strings: TemplateStringsArray, ...values: unknown[]): string;
  readCSSVar(name: string): string;
}

interface SoulReportAPI {
  generate(scores: NormalizedScores, enneagram: EnneagramResult): SoulReportData;
}

interface SoulWebhookAPI {
  config: WebhookConfig;
  send(result: EvaluationResult, report: SoulReportData, answers: AnswerData[]): Promise<void>;
  _testReset(): void;
}

interface SoulShareAPI {
  captureReport(): Promise<void>;
  copyShareLink(scores: NormalizedScores, enneagram: { type: number }): void;
  parseShareLink(): SharedReportData | null;
  addWatermark(canvas: HTMLCanvasElement): void;
  _signData(data: Record<string, unknown>): string;
  loadScript(src: string, timeoutMs?: number): Promise<void>;
  showTip(text: string): HTMLElement;
  updateTip(el: HTMLElement, text: string): void;
  showTemporaryTip(text: string): void;
}

interface SoulUIAPI {
  init(): void;
  showError(msg: string): void;
  showConfirm(title: string, text: string): Promise<boolean>;
}

// ═══ 题库类型 ═══

interface QuestionBank {
  id: string;
  name: string;
  desc: string;
  count: number;
  questions: QuestionData[];
}

// 全局 window 扩展
interface Window {
  SOUL_QUESTIONS: QuestionData[];
  SOUL_DIMENSIONS: Record<DimensionKey, DimensionMeta>;
  SOUL_BANKS: Record<string, QuestionBank>;
  SoulScoring: SoulScoringEngine;
  SoulUtils: SoulUtilsAPI;
  SoulReport: SoulReportAPI;
  SoulWebhook: SoulWebhookAPI;
  SoulShare: SoulShareAPI;
  SoulUI: SoulUIAPI;
  setupSoulDOM?: () => void;
  html2canvas?: (el: HTMLElement, opts: Record<string, unknown>) => Promise<HTMLCanvasElement>;
}

// Vite 构建时注入的环境变量（通过 .env 文件或 CI 配置）
declare const __WEBHOOK_URL__: string | undefined;
declare const __PROXY_URL__: string | undefined;
declare const __WEBHOOK_ENABLED__: string | undefined;
