/**
 * 灵魂解码 — 报告文案完整性测试
 * 验证 5 维 × 5 档 = 25 段维度文案全部存在且非空
 */

const DIMS = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];

const LEVELS = [
  { score: 95, expected: 'veryHigh' },
  { score: 72, expected: 'high' },
  { score: 53, expected: 'midHigh' },
  { score: 36, expected: 'midLow' },
  { score: 15, expected: 'low' },
];

describe('维度文案完整性', () => {
  DIMS.forEach(dim => {
    LEVELS.forEach(({ score, expected }) => {
      test(`${dim} 分数 ${score} 应匹配 ${expected} 档且文案长度 > 20`, () => {
        const scores = {
          openness: 50,
          conscientiousness: 50,
          extraversion: 50,
          agreeableness: 50,
          neuroticism: 50,
        };
        scores[dim] = score;

        const ennea = window.SoulScoring.matchEnneagram(scores);
        const report = window.SoulReport.generate(scores, ennea);
        const detail = report.dimensions[dim];

        expect(detail.level).toBe(expected);
        expect(detail.text.length).toBeGreaterThan(20);
      });
    });
  });
});

describe('灵魂类型标题', () => {
  test('高开放性 + 高神经质应返回深海梦想家', () => {
    const scores = {
      openness: 90,
      conscientiousness: 50,
      extraversion: 50,
      agreeableness: 50,
      neuroticism: 85,
    };
    const ennea = window.SoulScoring.matchEnneagram(scores);
    const report = window.SoulReport.generate(scores, ennea);
    expect(report.soulType).toContain('深海梦想家');
  });

  test('全部 50 分应返回默认标题灵魂旅人', () => {
    const scores = {
      openness: 50,
      conscientiousness: 50,
      extraversion: 50,
      agreeableness: 50,
      neuroticism: 50,
    };
    const ennea = window.SoulScoring.matchEnneagram(scores);
    const report = window.SoulReport.generate(scores, ennea);
    expect(report.soulType).toContain('灵魂旅人');
  });
});

describe('成长建议', () => {
  test('应返回 2-3 条成长建议', () => {
    const scores = {
      openness: 30,
      conscientiousness: 40,
      extraversion: 50,
      agreeableness: 60,
      neuroticism: 70,
    };
    const ennea = window.SoulScoring.matchEnneagram(scores);
    const report = window.SoulReport.generate(scores, ennea);

    expect(report.growth.length).toBeGreaterThanOrEqual(2);
    expect(report.growth.length).toBeLessThanOrEqual(3);
    report.growth.forEach(g => {
      expect(g.title.length).toBeGreaterThan(0);
      expect(g.text.length).toBeGreaterThan(20);
      expect(g.psychology.length).toBeGreaterThan(10);
    });
  });
});

describe('灵魂暗面', () => {
  test('高神经质应生成暗面文案', () => {
    const scores = {
      openness: 50,
      conscientiousness: 50,
      extraversion: 50,
      agreeableness: 50,
      neuroticism: 85,
    };
    const ennea = window.SoulScoring.matchEnneagram(scores);
    const report = window.SoulReport.generate(scores, ennea);

    expect(report.shadow.text.length).toBeGreaterThan(20);
    expect(report.shadow.conflict.length).toBeGreaterThan(20);
    expect(report.shadow.stress.length).toBeGreaterThan(20);
  });

  test('低神经质应生成不同暗面文案', () => {
    const scores = {
      openness: 50,
      conscientiousness: 50,
      extraversion: 50,
      agreeableness: 50,
      neuroticism: 15,
    };
    const ennea = window.SoulScoring.matchEnneagram(scores);
    const report = window.SoulReport.generate(scores, ennea);

    expect(report.shadow.text.length).toBeGreaterThan(20);
    expect(report.shadow.level).toBe('low');
  });
});
