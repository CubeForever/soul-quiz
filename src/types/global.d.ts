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

interface SoulReport {
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

// ═══ Webhook 类型 ═══

interface WebhookConfig {
  webhookUrl: string;
  proxyUrl: string;
  enabled: boolean;
  includeAnswers: boolean;
}

// ═══ 全局命名空间声明 ═══

interface SoulScoringEngine {
  CONFIG: {
    NORMALIZE_FACTOR: number;
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
  esc(str: any): string;
  el(tag: string, attrs: Record<string, any> | null, ...children: any[]): HTMLElement;
  empty(el: HTMLElement): void;
  html(strings: TemplateStringsArray, ...values: any[]): string;
}

interface SoulReportAPI {
  generate(scores: NormalizedScores, enneagram: EnneagramResult): SoulReport;
}

interface SoulWebhookAPI {
  config: WebhookConfig;
  send(result: EvaluationResult, report: SoulReport, answers: AnswerData[]): Promise<void>;
  _testReset(): void;
}

interface SoulShareAPI {
  captureReport(): Promise<void>;
  copyShareLink(scores: NormalizedScores, enneagram: { type: number }): void;
  parseShareLink(): { scores: NormalizedScores; enneagramType: number } | null;
}

interface SoulUIAPI {
  init(): void;
  showError(msg: string): void;
  showConfirm(title: string, text: string): Promise<boolean>;
}

// 全局 window 扩展
interface Window {
  SOUL_QUESTIONS: QuestionData[];
  SOUL_DIMENSIONS: Record<DimensionKey, DimensionMeta>;
  SoulScoring: SoulScoringEngine;
  SoulUtils: SoulUtilsAPI;
  SoulReport: SoulReportAPI;
  SoulWebhook: SoulWebhookAPI;
  SoulShare: SoulShareAPI;
  SoulUI: SoulUIAPI;
  setupSoulDOM?: () => void;
}