/**
 * 灵魂解码 — 评分 & 九型匹配 单元测试
 */
const fs = require('fs');
const path = require('path');

// 先加载 questions
const questionsCode = fs.readFileSync(path.resolve(__dirname, '../js/questions.js'), 'utf8');
eval(questionsCode);

// 再加载 scoring
const scoringCode = fs.readFileSync(path.resolve(__dirname, '../js/scoring.js'), 'utf8');
eval(scoringCode);

// ════════════════════════════════════════════════
// 1. 基础：原始得分计算
// ════════════════════════════════════════════════

describe('calculateRawScores', () => {

  test('空答案数组返回全零', () => {
    const result = window.SoulScoring.calculateRawScores([]);
    expect(result).toEqual({ openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 0, neuroticism: 0 });
  });

  test('一道场景题正确累加分数', () => {
    // Q1 选 A: openness +3, extraversion +1, others 0
    const answers = [{ questionId: 1, choice: 'A' }];
    const result = window.SoulScoring.calculateRawScores(answers);
    expect(result.openness).toBe(3);
    expect(result.extraversion).toBe(1);
    expect(result.conscientiousness).toBe(0);
  });

  test('量表题选择 5 分选项', () => {
    // Q4 选 5: openness +4, neuroticism +1
    const answers = [{ questionId: 4, choice: 5 }];
    const result = window.SoulScoring.calculateRawScores(answers);
    expect(result.openness).toBe(4);
    expect(result.neuroticism).toBe(1);
  });

  test('无效 questionId 跳过不报错', () => {
    const answers = [{ questionId: 999, choice: 'A' }];
    const result = window.SoulScoring.calculateRawScores(answers);
    expect(result).toEqual({ openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 0, neuroticism: 0 });
  });

  test('排序题按 rank 权重计算', () => {
    // Q5: 排序 [explore, learn, create, serve, compete]
    // 第1名(explore): openness+3, extraversion+2  权重1.0
    // 第2名(learn): openness+3, conscientiousness+2 权重0.6
    // 第3名(create): openness+2, neuroticism+2     权重0.3
    // 第4名(serve): agreeableness+3, conscientiousness+2 权重0.0
    // 第5名(compete): extraversion+3, conscientiousness+1 权重0.0
    const answers = [{ questionId: 5, choice: ['explore', 'learn', 'create', 'serve', 'compete'] }];
    const result = window.SoulScoring.calculateRawScores(answers);
    expect(result.openness).toBeCloseTo(3 * 1 + 3 * 0.6 + 2 * 0.3, 5);
    expect(result.extraversion).toBeCloseTo(2 * 1, 5);
    expect(result.conscientiousness).toBeCloseTo(2 * 0.6, 5);
    expect(result.neuroticism).toBeCloseTo(2 * 0.3, 5);
  });

  test('多题累加', () => {
    // Q1(openness+3,extraversion+1) + Q4(openness+4,neuroticism+1)
    const answers = [
      { questionId: 1, choice: 'A' },
      { questionId: 4, choice: 5 }
    ];
    const result = window.SoulScoring.calculateRawScores(answers);
    expect(result.openness).toBe(3 + 4);
    expect(result.extraversion).toBe(1);
    expect(result.neuroticism).toBe(1);
  });
});

// ════════════════════════════════════════════════
// 2. 归一化
// ════════════════════════════════════════════════

describe('normalizeScores', () => {

  test('在 [5, 95] 范围内', () => {
    const raw = { openness: 10, conscientiousness: 10, extraversion: 10, agreeableness: 10, neuroticism: 10 };
    const max = { openness: 20, conscientiousness: 20, extraversion: 20, agreeableness: 20, neuroticism: 20 };
    const result = window.SoulScoring.normalizeScores(raw, max);
    Object.values(result).forEach(v => {
      expect(v).toBeGreaterThanOrEqual(5);
      expect(v).toBeLessThanOrEqual(95);
    });
  });

  test('大分不溢出 95', () => {
    const raw = { openness: 1000, conscientiousness: 1000, extraversion: 1000, agreeableness: 1000, neuroticism: 1000 };
    const max = { openness: 50, conscientiousness: 50, extraversion: 50, agreeableness: 50, neuroticism: 50 };
    const result = window.SoulScoring.normalizeScores(raw, max);
    Object.values(result).forEach(v => {
      expect(v).toBeLessThanOrEqual(95);
    });
  });

  test('极小分不低于 5', () => {
    const raw = { openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 0, neuroticism: 0 };
    const max = { openness: 100, conscientiousness: 100, extraversion: 100, agreeableness: 100, neuroticism: 100 };
    const result = window.SoulScoring.normalizeScores(raw, max);
    Object.values(result).forEach(v => {
      expect(v).toBeGreaterThanOrEqual(5);
    });
  });
});

// ════════════════════════════════════════════════
// 3. 人格标签生成
// ════════════════════════════════════════════════

describe('generatePersonaTags', () => {

  test('高分生成高端标签', () => {
    const scores = { openness: 90, conscientiousness: 90, extraversion: 90, agreeableness: 90, neuroticism: 90 };
    const tags = window.SoulScoring.generatePersonaTags(scores);
    expect(tags).toContain('梦想家');
    expect(tags).toContain('建造者');
    expect(tags).toContain('发光体');
    expect(tags).toContain('治愈者');
    expect(tags).toContain('深感者');
  });

  test('低分生成低端标签', () => {
    const scores = { openness: 10, conscientiousness: 10, extraversion: 10, agreeableness: 10, neuroticism: 10 };
    const tags = window.SoulScoring.generatePersonaTags(scores);
    expect(tags).toContain('守恒者');
    expect(tags).toContain('自由魂');
    expect(tags).toContain('独行者');
    expect(tags).toContain('守界者');
    expect(tags).toContain('平静者');
  });

  test('中等分数生成中间标签', () => {
    const scores = { openness: 50, conscientiousness: 50, extraversion: 50, agreeableness: 50, neuroticism: 50 };
    const tags = window.SoulScoring.generatePersonaTags(scores);
    expect(tags).toContain('平衡者');
    expect(tags).toContain('航行者');
    expect(tags).toContain('适应者');
    expect(tags).toContain('协调者');
    expect(tags).toContain('波澜者');
  });
});

// ════════════════════════════════════════════════
// 4. 九型人格匹配
// ════════════════════════════════════════════════

describe('matchEnneagram', () => {

  test('九型有 9 种模式', () => {
    const patterns = window.SoulScoring.getEnneagramPatterns();
    expect(patterns).toHaveLength(9);
  });

  test('每种模式都有 type/name/icon/w', () => {
    const patterns = window.SoulScoring.getEnneagramPatterns();
    patterns.forEach(p => {
      expect(p.type).toBeGreaterThanOrEqual(1);
      expect(p.type).toBeLessThanOrEqual(9);
      expect(p.name).toBeTruthy();
      expect(p.icon).toBeTruthy();
      expect(p.w).toBeTruthy();
      // 必须包含全部 5 个维度
      const keys = Object.keys(p.w);
expect(keys).toHaveLength(5);
expect(keys).toEqual(expect.arrayContaining(['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism']));
    });
  });

  test('高开放性+高神经质+低外向 → 4号灵魂诗人', () => {
    const scores = { openness: 85, conscientiousness: 40, extraversion: 20, agreeableness: 40, neuroticism: 85 };
    const result = window.SoulScoring.matchEnneagram(scores);
    expect(result.type).toBe(4);
    expect(result.name).toBe('灵魂诗人');
  });

  test('高尽责+高宜人 → 1号秩序守护者', () => {
    const scores = { openness: 40, conscientiousness: 85, extraversion: 50, agreeableness: 80, neuroticism: 50 };
    const result = window.SoulScoring.matchEnneagram(scores);
    expect(result.type).toBe(1);
  });

  test('高外向+高尽责 → 8号力量化身或3号光芒追寻者', () => {
    const scores = { openness: 50, conscientiousness: 80, extraversion: 85, agreeableness: 50, neuroticism: 30 };
    const result = window.SoulScoring.matchEnneagram(scores);
    // 高外向+高尽责+低神经质匹配力量化身(8)或光芒追寻者(3)
    expect([3, 8]).toContain(result.type);
  });
});

// ════════════════════════════════════════════════
// 5. 完整评分流程
// ════════════════════════════════════════════════

describe('evaluate 完整流程', () => {

  test('返回结构完整', () => {
    const answers = [
      { questionId: 1, choice: 'A' },
      { questionId: 2, choice: 'A' },
      { questionId: 3, choice: 'A' },
      { questionId: 4, choice: 5 },
      { questionId: 5, choice: ['explore', 'learn', 'create', 'serve', 'compete'] },
    ];
    const result = window.SoulScoring.evaluate(answers);
    expect(result).toHaveProperty('raw');
    expect(result).toHaveProperty('max');
    expect(result).toHaveProperty('scores');
    expect(result).toHaveProperty('tags');
    expect(result).toHaveProperty('enneagram');
    expect(result.tags).toHaveLength(5);
    expect(result.enneagram).toHaveProperty('type');
    expect(result.enneagram).toHaveProperty('name');
    expect(result.enneagram).toHaveProperty('icon');
  });

  test('全部 28 题完整作答不报错', () => {
    const allAnswers = window.SOUL_QUESTIONS.map(q => ({
      questionId: q.id,
      choice: q.type === 'ranking' ? q.options.map(o => o.id) : q.options[0].id
    }));
    const result = window.SoulScoring.evaluate(allAnswers);
    expect(result.scores.openness).toBeGreaterThanOrEqual(5);
    expect(result.scores.openness).toBeLessThanOrEqual(95);
    expect(result.enneagram.type).toBeGreaterThanOrEqual(1);
    expect(result.enneagram.type).toBeLessThanOrEqual(9);
  });
});
