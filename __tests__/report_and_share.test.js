/**
 * 灵魂解码 — 报告生成 & 分享功能 单元测试
 */

// 模块已由 jest-setup.js 加载，通过 window.* 全局访问
const mockEnneagram = { type: 4, name: '灵魂诗人', icon: '🎭' };

// ════════════════════════════════════════════════
// 报告生成测试
// ════════════════════════════════════════════════

describe('SoulReport.generate', () => {

  test('返回结构包含所有必要字段', () => {
    const scores = { openness: 75, conscientiousness: 45, extraversion: 30, agreeableness: 60, neuroticism: 80 };
    const report = window.SoulReport.generate(scores, mockEnneagram);
    expect(report).toHaveProperty('soulType');
    expect(report).toHaveProperty('soulColor');
    expect(report).toHaveProperty('summary');
    expect(report).toHaveProperty('dimensions');
    expect(report).toHaveProperty('combination');
    expect(report).toHaveProperty('enneagram');
    expect(report).toHaveProperty('shadow');
    expect(report).toHaveProperty('growth');
    expect(report).toHaveProperty('resonance');
  });

  test('soulType 包含两个标题（如 "xxx × yyy"）', () => {
    const scores = { openness: 85, conscientiousness: 85, extraversion: 85, agreeableness: 85, neuroticism: 30 };
    const report = window.SoulReport.generate(scores, mockEnneagram);
    expect(report.soulType).toContain('×');
    expect(report.soulType.split('×').length).toBe(2);
  });

  test('dimensions 包含全部 5 个维度', () => {
    const scores = { openness: 70, conscientiousness: 50, extraversion: 40, agreeableness: 60, neuroticism: 55 };
    const report = window.SoulReport.generate(scores, mockEnneagram);
    const dims = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];
    dims.forEach(d => {
      expect(report.dimensions[d]).toBeDefined();
      expect(report.dimensions[d]).toHaveProperty('score');
      expect(report.dimensions[d]).toHaveProperty('level');
      expect(report.dimensions[d]).toHaveProperty('text');
      expect(report.dimensions[d]).toHaveProperty('icon');
    });
  });

  test('dimension level 有效', () => {
    const scores = { openness: 70, conscientiousness: 50, extraversion: 40, agreeableness: 60, neuroticism: 55 };
    const report = window.SoulReport.generate(scores, mockEnneagram);
    Object.values(report.dimensions).forEach(d => {
      expect(['veryHigh', 'high', 'midHigh', 'midLow', 'low']).toContain(d.level);
    });
  });

  test('shadow 包含 text/conflict/stress 三个字段', () => {
    const scores = { openness: 50, conscientiousness: 50, extraversion: 50, agreeableness: 50, neuroticism: 50 };
    const report = window.SoulReport.generate(scores, mockEnneagram);
    expect(report.shadow.text).toBeTruthy();
    expect(report.shadow.conflict).toBeTruthy();
    expect(report.shadow.stress).toBeTruthy();
  });

  test('shadow level 与 neuroticism 得分对应', () => {
    const scores = { openness: 50, conscientiousness: 50, extraversion: 50, agreeableness: 50, neuroticism: 85 };
    const report = window.SoulReport.generate(scores, mockEnneagram);
    expect(report.shadow.level).toBe('veryHigh');
  });

  test('growth 返回 3 条建议', () => {
    const scores = { openness: 30, conscientiousness: 85, extraversion: 30, agreeableness: 30, neuroticism: 50 };
    const report = window.SoulReport.generate(scores, mockEnneagram);
    expect(report.growth).toHaveLength(3);
    report.growth.forEach(g => {
      expect(g).toHaveProperty('title');
      expect(g).toHaveProperty('text');
      expect(g).toHaveProperty('psychology');
    });
  });

  test('growth 建议对应最弱的维度', () => {
    const scores = { openness: 85, conscientiousness: 30, extraversion: 85, agreeableness: 30, neuroticism: 50 };
    const report = window.SoulReport.generate(scores, mockEnneagram);
    // 最弱维度是 conscientiousness(30) 和 agreeableness(30)
    // 验证成长建议标题包含相关维度关键词
    const weakTitles = report.growth.map(g => g.title);
    const hasConscOrAgree = weakTitles.some(t => t.includes('意志') || t.includes('共情') || t.includes('边界') || t.includes('培育'));
    expect(hasConscOrAgree).toBe(true);
  });

  test('resonance 包含兼容类型和建议', () => {
    const scores = { openness: 50, conscientiousness: 50, extraversion: 50, agreeableness: 50, neuroticism: 50 };
    const report = window.SoulReport.generate(scores, mockEnneagram);
    expect(report.resonance.compatible).toBeDefined();
    expect(Array.isArray(report.resonance.compatible)).toBe(true);
    expect(report.resonance.compatible.length).toBeGreaterThanOrEqual(2);
    expect(report.resonance.advice).toBeTruthy();
    expect(report.resonance.blessing).toBeTruthy();
  });

  test('enneagram 包含 motivation/fear/growth/relation', () => {
    const scores = { openness: 70, conscientiousness: 40, extraversion: 30, agreeableness: 50, neuroticism: 70 };
    const report = window.SoulReport.generate(scores, mockEnneagram);
    expect(report.enneagram.motivation).toBeTruthy();
    expect(report.enneagram.fear).toBeTruthy();
    expect(report.enneagram.growth).toBeTruthy();
    expect(report.enneagram.relation).toBeTruthy();
  });

  test('对应九型 1-9 每种类型都不报错', () => {
    const scores = { openness: 50, conscientiousness: 50, extraversion: 50, agreeableness: 50, neuroticism: 50 };
    for (let t = 1; t <= 9; t++) {
      const ennea = { type: t, name: '测试类型', icon: '🎯' };
      expect(() => window.SoulReport.generate(scores, ennea)).not.toThrow();
    }
  });

  test('summary 不为空', () => {
    const scores = { openness: 60, conscientiousness: 60, extraversion: 60, agreeableness: 60, neuroticism: 60 };
    const report = window.SoulReport.generate(scores, mockEnneagram);
    expect(report.summary.length).toBeGreaterThan(20);
  });

  test('soulColor 包含 from 和 to', () => {
    const scores = { openness: 80, conscientiousness: 40, extraversion: 30, agreeableness: 50, neuroticism: 60 };
    const report = window.SoulReport.generate(scores, mockEnneagram);
    expect(report.soulColor.from).toBeTruthy();
    expect(report.soulColor.to).toBeTruthy();
  });

  test('维度组合 insight 不为空', () => {
    const scores = { openness: 85, conscientiousness: 30, extraversion: 85, agreeableness: 30, neuroticism: 30 };
    const report = window.SoulReport.generate(scores, mockEnneagram);
    expect(report.combination.length).toBeGreaterThan(5);
  });
});

// ════════════════════════════════════════════════
// 分享功能测试
// ════════════════════════════════════════════════

describe('SoulShare', () => {

  test('copyShareLink 生成包含 #r= 的正确 URL', async () => {
    const scores = { openness: 80, conscientiousness: 60, extraversion: 40, agreeableness: 70, neuroticism: 50 };
    const enneagram = { type: 6 };
    const origClip = global.navigator.clipboard;

    let writtenUrl = '';
    global.navigator.clipboard = {
      writeText: jest.fn(function(url) { writtenUrl = url; return Promise.resolve(); })
    };

    window.SoulShare.copyShareLink(scores, enneagram);

    // 检查 clipboard 写入的内容
    expect(writtenUrl).toContain('#r=');
    const hashPart = writtenUrl.split('#r=')[1];
    const decoded = JSON.parse(atob(hashPart));
    expect(decoded.s).toEqual([80, 60, 40, 70, 50]);
    expect(decoded.e).toBe(6);
    expect(decoded.k).toBeTruthy();

    global.navigator.clipboard = origClip;
  });

  test('parseShareLink 解析自己生成的数据', () => {
    const data = { s: [80, 60, 40, 70, 50], e: 6 };
    data.k = window.SoulShare._signData(data);
    window.location.hash = '#r=' + btoa(JSON.stringify(data));

    const parsed = window.SoulShare.parseShareLink();
    expect(parsed).not.toBeNull();
    expect(parsed.scores.openness).toBe(80);
    expect(parsed.scores.conscientiousness).toBe(60);
    expect(parsed.scores.extraversion).toBe(40);
    expect(parsed.scores.agreeableness).toBe(70);
    expect(parsed.scores.neuroticism).toBe(50);
    expect(parsed.enneagramType).toBe(6);
  });

  test('parseShareLink 拒绝篡改的数据', () => {
    window.location.hash = '#r=' + btoa(JSON.stringify({ s: [80, 60, 40, 70, 50], e: 6, k: 'fake_signature' }));

    const parsed = window.SoulShare.parseShareLink();
    expect(parsed).toBeNull();
  });

  test('parseShareLink 返回 null for 无效 hash', () => {
    window.location.hash = '#some_other_hash';
    expect(window.SoulShare.parseShareLink()).toBeNull();

    window.location.hash = '';
    expect(window.SoulShare.parseShareLink()).toBeNull();
  });

  test('parseShareLink 返回 null for 损坏的 base64', () => {
    window.location.hash = '#r=这不是base64!!!';
    expect(window.SoulShare.parseShareLink()).toBeNull();
  });

  test('_signData 对相同输入产生相同输出', () => {
    const data1 = { s: [1, 2, 3, 4, 5], e: 1 };
    const data2 = { s: [1, 2, 3, 4, 5], e: 1 };
    expect(window.SoulShare._signData(data1)).toBe(window.SoulShare._signData(data2));
  });

  test('_signData 对不同输入产生不同输出', () => {
    const data1 = { s: [1, 2, 3, 4, 5], e: 1 };
    const data2 = { s: [1, 2, 3, 4, 5], e: 2 };
    expect(window.SoulShare._signData(data1)).not.toBe(window.SoulShare._signData(data2));
  });
});
