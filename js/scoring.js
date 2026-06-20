/**
 * scoring.js — 灵魂解码评分引擎
 * OCEAN 五维评分 + 九型人格匹配
 */

window.SoulScoring = {

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
        const multipliers = [1, 0.6, 0.3, 0, 0];
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
   */
  normalizeScores(raw, max) {
    const result = {};
    this.DIMENSIONS.forEach(dim => {
      result[dim] = max[dim] > 0 ? Math.round((raw[dim] / max[dim]) * 100) : 50;
    });
    return result;
  },

  /**
   * 生成人格标签
   */
  generatePersonaTags(scores) {
    const tags = [];

    if (scores.openness >= 67) tags.push('梦想家');
    else if (scores.openness >= 34) tags.push('平衡者');
    else tags.push('务实者');

    if (scores.conscientiousness >= 67) tags.push('建造者');
    else if (scores.conscientiousness >= 34) tags.push('航行者');
    else tags.push('流浪者');

    if (scores.extraversion >= 67) tags.push('发光体');
    else if (scores.extraversion >= 34) tags.push('适应者');
    else tags.push('独行者');

    if (scores.agreeableness >= 67) tags.push('治愈者');
    else if (scores.agreeableness >= 34) tags.push('协调者');
    else tags.push('守界者');

    if (scores.neuroticism >= 67) tags.push('深感者');
    else if (scores.neuroticism >= 34) tags.push('波澜者');
    else tags.push('平静者');

    return tags;
  },

  /**
   * 匹配九型人格
   */
  matchEnneagram(scores) {
    const patterns = [
      {
        type: 1, name: '秩序守护者', icon: '🎯',
        motivation: '追求正确与完美，希望世界井然有序',
        fear: '害怕犯错、堕落或变得腐败',
        pattern: { conscientiousness: 'high', agreeableness: 'mid', neuroticism: 'mid' }
      },
      {
        type: 2, name: '温暖织者', icon: '🤲',
        motivation: '渴望被需要，通过给予爱来获得爱',
        fear: '害怕不被需要、不被爱',
        pattern: { agreeableness: 'high', extraversion: 'high', conscientiousness: 'mid' }
      },
      {
        type: 3, name: '光芒追寻者', icon: '👑',
        motivation: '追求成就与认可，希望被视为有价值的人',
        fear: '害怕失败、毫无价值',
        pattern: { extraversion: 'high', conscientiousness: 'high', openness: 'mid' }
      },
      {
        type: 4, name: '灵魂诗人', icon: '🎭',
        motivation: '寻找独特的自我身份，表达深层情感',
        fear: '害怕没有独特身份、平庸无意义',
        pattern: { openness: 'high', neuroticism: 'high', extraversion: 'low' }
      },
      {
        type: 5, name: '智慧守望者', icon: '🔮',
        motivation: '渴望知识与理解，保持自主与独立',
        fear: '害怕无能、被外界消耗殆尽',
        pattern: { openness: 'high', extraversion: 'low', agreeableness: 'low' }
      },
      {
        type: 6, name: '信念守卫', icon: '🛡️',
        motivation: '寻求安全感，忠诚于信仰与群体',
        fear: '害怕失去支持和安全',
        pattern: { conscientiousness: 'high', neuroticism: 'high', agreeableness: 'high' }
      },
      {
        type: 7, name: '自由旅人', icon: '🌈',
        motivation: '追求快乐、自由和丰富多彩的体验',
        fear: '害怕被限制、错过美好的事物',
        pattern: { extraversion: 'high', openness: 'high', conscientiousness: 'low' }
      },
      {
        type: 8, name: '力量化身', icon: '⚡',
        motivation: '渴望掌控和保护，成为强者',
        fear: '害怕被控制、示弱',
        pattern: { extraversion: 'high', agreeableness: 'low', conscientiousness: 'high' }
      },
      {
        type: 9, name: '宁静使者', icon: '☁️',
        motivation: '追求内在平静与外在和谐',
        fear: '害怕冲突、失去连接',
        pattern: { agreeableness: 'high', neuroticism: 'low', extraversion: 'low' }
      }
    ];

    const getLevel = (val) => val >= 65 ? 'high' : val >= 35 ? 'mid' : 'low';

    let bestMatch = null;
    let bestScore = -Infinity;

    patterns.forEach(type => {
      let matchPoints = 0;
      let totalChecks = 0;

      this.DIMENSIONS.forEach(dim => {
        if (type.pattern[dim]) {
          totalChecks++;
          const userLevel = getLevel(scores[dim]);
          const expectedLevel = type.pattern[dim];

          if (userLevel === expectedLevel) {
            matchPoints += 2;
          } else if (
            (userLevel === 'mid' && expectedLevel === 'high') ||
            (userLevel === 'high' && expectedLevel === 'mid') ||
            (userLevel === 'mid' && expectedLevel === 'low') ||
            (userLevel === 'low' && expectedLevel === 'mid')
          ) {
            matchPoints += 1;
          }
        }
      });

      const finalScore = totalChecks > 0 ? matchPoints / totalChecks : 0;
      if (finalScore > bestScore) {
        bestScore = finalScore;
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
