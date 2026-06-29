/**
 * scoring.ts — 灵魂解码评分引擎
 * OCEAN 五维评分 + 九型人格匹配
 */

export const SoulScoring = {

  // ═══ 评分配置常量 ═══
  CONFIG: {
    MAX_PERCENT: 95,
    MIN_PERCENT: 5,
    TAG_THRESHOLDS: [82, 62, 45, 28],
    // 灵魂标签分档阈值: veryHigh >= 82, high >= 62, midHigh >= 45, midLow >= 28, low < 28
    ENNEAGRAM_HIGH: 70,
    ENNEAGRAM_MID_LOW: 42,
    RANK_MULTIPLIERS: [1, 0.6, 0.3, 0, 0]
  },

  DIMENSIONS: ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'] as DimensionKey[],

  /**
   * 计算五维原始得分
   */
  calculateRawScores(answers: AnswerData[]): RawScores {
    const raw: RawScores = { openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 0, neuroticism: 0 };

    answers.forEach(function(answer: AnswerData) {
      const question: QuestionData | undefined = window.SOUL_QUESTIONS.find(function(q: QuestionData) { return q.id === answer.questionId; });
      if (!question) return;

      if (question.type === 'ranking') {
        const choice = answer.choice as string[];
        if (!Array.isArray(choice)) return;
        const multipliers = SoulScoring.CONFIG.RANK_MULTIPLIERS;
        choice.forEach(function(optId: string, rank: number) {
          const option = question.options.find(function(o: QuestionOption) { return o.id === optId; });
          if (!option) return;
          const m = multipliers[rank] || 0;
          const scores = option.scores as Record<string, number>;
          Object.keys(scores).forEach(function(dim: string) {
            raw[dim] = (raw[dim] || 0) + scores[dim] * m;
          });
        });
      } else {
        const option = question.options.find(function(o: QuestionOption) { return String(o.id) === String(answer.choice); });
        if (!option) return;
        const scores = option.scores as Record<string, number>;
        Object.keys(scores).forEach(function(dim: string) {
          raw[dim] = (raw[dim] || 0) + scores[dim];
        });
      }
    });

    return raw;
  },

  /**
   * 获取每维度理论最高分
   * 对每道题，按维度取所有选项中的最大值并累加
   */
  getMaxScores(questions: QuestionData[]): RawScores {
    const max: RawScores = { openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 0, neuroticism: 0 };

    questions.forEach(function(q: QuestionData) {
      const dimMaxes: Record<string, number> = {};
      q.options.forEach(function(opt: QuestionOption) {
        const scores = opt.scores as Record<string, number>;
        Object.keys(scores).forEach(function(dim: string) {
          dimMaxes[dim] = Math.max(dimMaxes[dim] !== undefined ? dimMaxes[dim] : -Infinity, scores[dim]);
        });
      });
      Object.keys(dimMaxes).forEach(function(dim: string) {
        max[dim] = (max[dim] || 0) + dimMaxes[dim];
      });
    });

    return max;
  },

  /**
   * 原始分 → 百分制
   */
  normalizeScores(raw: RawScores, max: RawScores): NormalizedScores {
    const result: Record<string, number> = {};
    const cfg = this.CONFIG;
    this.DIMENSIONS.forEach(function(dim: DimensionKey) {
      const baseline = Math.max(max[dim], 1);
      result[dim] = Math.min(cfg.MAX_PERCENT, Math.max(cfg.MIN_PERCENT, Math.round((raw[dim] / baseline) * 100)));
    });
    return result as RawScores;
  },

  /**
   * 生成人格标签
   */
  generatePersonaTags(scores: NormalizedScores): string[] {
    const tags: string[] = [];
    const [T1, T2, T3, T4] = this.CONFIG.TAG_THRESHOLDS;

    if (scores.openness >= T1) tags.push('梦想家');
    else if (scores.openness >= T2) tags.push('探索者');
    else if (scores.openness >= T3) tags.push('平衡者');
    else if (scores.openness >= T4) tags.push('务实者');
    else tags.push('守恒者');

    if (scores.conscientiousness >= T1) tags.push('建造者');
    else if (scores.conscientiousness >= T2) tags.push('规划师');
    else if (scores.conscientiousness >= T3) tags.push('航行者');
    else if (scores.conscientiousness >= T4) tags.push('随性者');
    else tags.push('自由魂');

    if (scores.extraversion >= T1) tags.push('发光体');
    else if (scores.extraversion >= T2) tags.push('社交家');
    else if (scores.extraversion >= T3) tags.push('适应者');
    else if (scores.extraversion >= T4) tags.push('旁观者');
    else tags.push('独行者');

    if (scores.agreeableness >= T1) tags.push('治愈者');
    else if (scores.agreeableness >= T2) tags.push('守护者');
    else if (scores.agreeableness >= T3) tags.push('协调者');
    else if (scores.agreeableness >= T4) tags.push('直率者');
    else tags.push('守界者');

    if (scores.neuroticism >= T1) tags.push('深感者');
    else if (scores.neuroticism >= T2) tags.push('感应者');
    else if (scores.neuroticism >= T3) tags.push('波澜者');
    else if (scores.neuroticism >= T4) tags.push('沉稳者');
    else tags.push('平静者');

    return tags;
  },

  /**
   * 九型人格五维模式数据
   */
  getEnneagramPatterns(): EnneagramPattern[] {
    return [
      { type: 1, name: '秩序守护者', icon: '🎯', motivation: '追求正确与完美，希望世界井然有序', fear: '害怕犯错、堕落或变得腐败',
        w: { conscientiousness:{e:'high',w:2}, agreeableness:{e:'high',w:1.5}, neuroticism:{e:'mid',w:1}, openness:{e:'mid',w:1}, extraversion:{e:'mid',w:0.5} } },
      { type: 2, name: '温暖织者', icon: '🤲', motivation: '渴望被需要，通过给予爱来获得爱', fear: '害怕不被需要、不被爱',
        w: { agreeableness:{e:'high',w:2}, extraversion:{e:'high',w:1.5}, neuroticism:{e:'high',w:1}, openness:{e:'mid',w:1}, conscientiousness:{e:'mid',w:0.5} } },
      { type: 3, name: '光芒追寻者', icon: '👑', motivation: '追求成就与认可，希望被视为有价值的人', fear: '害怕失败、毫无价值',
        w: { extraversion:{e:'high',w:2}, conscientiousness:{e:'high',w:1.5}, agreeableness:{e:'mid',w:1}, neuroticism:{e:'low',w:1}, openness:{e:'mid',w:0.5} } },
      { type: 4, name: '灵魂诗人', icon: '🎭', motivation: '寻找独特的自我身份，表达深层情感', fear: '害怕没有独特身份、平庸无意义',
        w: { neuroticism:{e:'high',w:2}, openness:{e:'high',w:1.5}, extraversion:{e:'low',w:1.5}, agreeableness:{e:'mid',w:1}, conscientiousness:{e:'low',w:0.5} } },
      { type: 5, name: '智慧守望者', icon: '🔮', motivation: '渴望知识与理解，保持自主与独立', fear: '害怕无能、被外界消耗殆尽',
        w: { openness:{e:'high',w:2}, extraversion:{e:'low',w:1.5}, agreeableness:{e:'low',w:1.5}, neuroticism:{e:'mid',w:1}, conscientiousness:{e:'mid',w:0.5} } },
      { type: 6, name: '信念守卫', icon: '🛡️', motivation: '寻求安全感，忠诚于信仰与群体', fear: '害怕失去支持和安全',
        w: { neuroticism:{e:'high',w:1.5}, conscientiousness:{e:'high',w:1.5}, agreeableness:{e:'high',w:1.5}, extraversion:{e:'mid',w:0.5}, openness:{e:'mid',w:0.5} } },
      { type: 7, name: '自由旅人', icon: '🌈', motivation: '追求快乐、自由和丰富多彩的体验', fear: '害怕被限制、错过美好的事物',
        w: { extraversion:{e:'high',w:2}, openness:{e:'high',w:1.5}, conscientiousness:{e:'low',w:1.5}, agreeableness:{e:'mid',w:1}, neuroticism:{e:'low',w:0.5} } },
      { type: 8, name: '力量化身', icon: '⚡', motivation: '渴望掌控和保护，成为强者', fear: '害怕被控制、示弱',
        w: { extraversion:{e:'high',w:2}, agreeableness:{e:'low',w:1.5}, conscientiousness:{e:'high',w:1}, neuroticism:{e:'low',w:1}, openness:{e:'mid',w:0.5} } },
      { type: 9, name: '宁静使者', icon: '☁️', motivation: '追求内在平静与外在和谐', fear: '害怕冲突、失去连接',
        w: { agreeableness:{e:'high',w:2}, neuroticism:{e:'low',w:1.5}, extraversion:{e:'low',w:1.5}, openness:{e:'mid',w:1}, conscientiousness:{e:'mid',w:0.5} } }
    ];
  },

  /**
   * 九型人格参考人群分布
   */
  ENNEAGRAM_POPULATION_STATS: {
    openness:          { mean: 65, std: 12 },
    conscientiousness: { mean: 57, std: 12 },
    extraversion:      { mean: 51, std: 12 },
    agreeableness:     { mean: 55, std: 12 },
    neuroticism:       { mean: 53, std: 12 }
  },

  /**
   * 匹配九型人格（相对位置法）
   */
  matchEnneagram(scores: NormalizedScores): EnneagramResult {
    const patterns = this.getEnneagramPatterns();
    const stats = this.ENNEAGRAM_POPULATION_STATS;
    const idealScore: Record<string, number> = { high: 78, mid: 48, low: 18 };

    const results: Array<{ type: EnneagramPattern; score: number }> = patterns.map(function(type: EnneagramPattern) {
      let totalMatch = 0;

      (['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'] as DimensionKey[]).forEach(function(dim: DimensionKey) {
        const entry = type.w[dim];
        const w = entry.w;
        const mean = stats[dim].mean;
        const std = stats[dim].std;

        const userZ = (scores[dim] - mean) / std;
        const ideal = idealScore[entry.e];
        const idealZ = (ideal - mean) / std;
        const product = userZ * idealZ;
        totalMatch += product > 0 ? w * Math.min(Math.abs(product), 2) : w * Math.max(product, -1);
      });

      return { type: type, score: totalMatch };
    });

    results.sort(function(a, b) { return b.score - a.score; });
    const best = results[0].type;

    return {
      type: best.type,
      name: best.name,
      icon: best.icon,
      motivation: best.motivation,
      fear: best.fear
    };
  },

  /**
   * 完整评分流程
   */
  evaluate(answers: AnswerData[]): EvaluationResult {
    const questions = window.SOUL_QUESTIONS;
    const raw = this.calculateRawScores(answers);
    const max = this.getMaxScores(questions);
    const scores = this.normalizeScores(raw, max);
    const tags = this.generatePersonaTags(scores);
    const enneagram = this.matchEnneagram(scores);

    return { raw: raw, max: max, scores: scores, tags: tags, enneagram: enneagram };
  }
};

// Backward compatibility bridge
window.SoulScoring = SoulScoring;