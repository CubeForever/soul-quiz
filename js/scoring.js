/**
 * scoring.js — 灵魂解码评分引擎
 * OCEAN 五维评分 + 九型人格匹配
 */

window.SoulScoring = {

  // ═══ 评分配置常量 ═══
  CONFIG: {
    // 归一化因子：数值越低，最终得分越高
    // 0.62 时典型主维度可达 80-95 分，次维度 30-60 分
    NORMALIZE_FACTOR: 0.72,
    // 百分制上限/下限
    MAX_PERCENT: 95,
    MIN_PERCENT: 5,
    // 5 档标签阈值（>=）
    TAG_THRESHOLDS: [82, 62, 45, 28],
    // 九型档位映射
    ENNEAGRAM_HIGH: 70,
    ENNEAGRAM_MID_LOW: 42,
    // 排序题权重
    RANK_MULTIPLIERS: [1, 0.6, 0.3, 0, 0]
  },

  DIMENSIONS: ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'],

  /**
   * 计算五维原始得分
   * @param {Array} answers - [{questionId, choice}]
   * @returns {Object} 原始分数
   */
  calculateRawScores(answers) {
    const raw = { openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 0, neuroticism: 0 };

    answers.forEach(answer => {
      const question = window.SOUL_QUESTIONS.find(q => q.id === answer.questionId);
      if (!question) return;

      if (question.type === 'ranking') {
        // 排序题：第1名得满分，第2名60%，第3名30%，第4-5名0
        const choice = answer.choice; // Array of option ids in ranked order
        if (!Array.isArray(choice)) return;
        const multipliers = this.CONFIG.RANK_MULTIPLIERS;
        choice.forEach((optId, rank) => {
          const option = question.options.find(o => o.id === optId);
          if (!option) return;
          const m = multipliers[rank] || 0;
          Object.keys(option.scores).forEach(dim => {
            raw[dim] += option.scores[dim] * m;
          });
        });
      } else {
        // 场景题 / 量表题
        const option = question.options.find(o => String(o.id) === String(answer.choice));
        if (!option) return;
        Object.keys(option.scores).forEach(dim => {
          raw[dim] += option.scores[dim];
        });
      }
    });

    return raw;
  },

  /**
   * 获取每维度理论最高分
   */
  getMaxScores(questions) {
    const max = { openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 0, neuroticism: 0 };

    questions.forEach(q => {
      if (q.type === 'ranking') {
        // 最高分 = 最佳选项的满分（第一名 100%）
        const dimMaxes = {};
        q.options.forEach(opt => {
          Object.keys(opt.scores).forEach(dim => {
            dimMaxes[dim] = Math.max(dimMaxes[dim] || 0, opt.scores[dim]);
          });
        });
        Object.keys(dimMaxes).forEach(dim => {
          max[dim] += dimMaxes[dim];
        });
      } else {
        // 场景题/量表题：取每个维度在所有选项中的最高值
        const dimMaxes = {};
        q.options.forEach(opt => {
          Object.keys(opt.scores).forEach(dim => {
            dimMaxes[dim] = Math.max(dimMaxes[dim] || 0, opt.scores[dim]);
          });
        });
        Object.keys(dimMaxes).forEach(dim => {
          max[dim] += dimMaxes[dim];
        });
      }
    });

    return max;
  },

  /**
   * 原始分 → 百分制
   * 归一化因子 0.72：聚焦型用户主维度可达 80+，自然答题在 40-75 区间
   * 避免分数过高导致所有九型人格都匹配到同一种类型
   */
  normalizeScores(raw, max) {
    const result = {};
    const cfg = this.CONFIG;
    this.DIMENSIONS.forEach(dim => {
      const baseline = Math.max(max[dim] * cfg.NORMALIZE_FACTOR, 1);
      result[dim] = Math.min(cfg.MAX_PERCENT, Math.max(cfg.MIN_PERCENT, Math.round((raw[dim] / baseline) * 100)));
    });
    return result;
  },

  /**
   * 生成人格标签
   */
  generatePersonaTags(scores) {
    const tags = [];
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
   * 九型人格五维模式数据（可被 report.js 共用）
   * w: 权重(2=核心 1.5=重要 1=次要 0.5=弱相关), e: 期望档位
   */
  getEnneagramPatterns() {
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
   * 匹配九型人格
   */
  matchEnneagram(scores) {
    const patterns = this.getEnneagramPatterns();

    const cfg = this.CONFIG;
    const getLevel = (val) => val >= cfg.ENNEAGRAM_HIGH ? 'high' : val >= cfg.ENNEAGRAM_MID_LOW ? 'mid' : 'low';

    let bestMatch = null;
    let bestScore = -Infinity;

    patterns.forEach(type => {
      let score = 0, maxScore = 0;

      this.DIMENSIONS.forEach(dim => {
        const entry = type.w[dim];
        const userLevel = getLevel(scores[dim]);
        maxScore += entry.w * 2;

        if (userLevel === entry.e) {
          score += entry.w * 2;
        } else if (
          (userLevel === 'mid' && entry.e === 'high') ||
          (userLevel === 'high' && entry.e === 'mid') ||
          (userLevel === 'mid' && entry.e === 'low') ||
          (userLevel === 'low' && entry.e === 'mid')
        ) {
          score += entry.w * 0.8;
        }
      });

      const normalized = maxScore > 0 ? score / maxScore : 0;
      if (normalized > bestScore) {
        bestScore = normalized;
        bestMatch = type;
      }
    });

    return {
      type: bestMatch.type,
      name: bestMatch.name,
      icon: bestMatch.icon,
      motivation: bestMatch.motivation,
      fear: bestMatch.fear
    };
  },

  /**
   * 完整评分流程
   */
  evaluate(answers) {
    const questions = window.SOUL_QUESTIONS;
    const raw = this.calculateRawScores(answers);
    const max = this.getMaxScores(questions);
    const scores = this.normalizeScores(raw, max);
    const tags = this.generatePersonaTags(scores);
    const enneagram = this.matchEnneagram(scores);

    return { raw, max, scores, tags, enneagram };
  }
};
