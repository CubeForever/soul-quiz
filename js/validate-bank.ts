/**
 * validate-bank.ts — 自定义题库 JSON 校验
 * 校验结构、类型、维度覆盖、ID 冲突
 */

const VALID_DIMENSIONS: DimensionKey[] = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];
const VALID_TYPES: QuestionType[] = ['scenario', 'likert', 'ranking'];
const CUSTOM_ID_START = 9001;

interface ValidationResult {
  valid: boolean;
  bank: QuestionBank | null;
  errors: string[];
}

/**
 * 校验自定义题库 JSON 数据
 */
export function validateCustomBank(raw: unknown): ValidationResult {
  const errors: string[] = [];

  // 1. 检查是数组
  if (!Array.isArray(raw)) {
    return { valid: false, bank: null, errors: ['题库数据必须是一个数组'] };
  }

  if (raw.length === 0) {
    return { valid: false, bank: null, errors: ['题库不能为空'] };
  }

  const questions: QuestionData[] = [];
  const seenIds = new Set<number>();
  let nextId = CUSTOM_ID_START;

  for (let i = 0; i < raw.length; i++) {
    const item = raw[i] as Record<string, unknown>;
    const prefix = `题目 #${i + 1}`;

    // 2. 必填字段检查
    if (typeof item.text !== 'string' || item.text.trim() === '') {
      errors.push(`${prefix}: 缺少题目文本 (text)`);
      continue;
    }

    if (!VALID_TYPES.includes(item.type as QuestionType)) {
      errors.push(`${prefix}: 无效题型 "${item.type}"，支持: ${VALID_TYPES.join(', ')}`);
      continue;
    }

    if (!Array.isArray(item.options) || item.options.length < 2) {
      errors.push(`${prefix}: 选项 (options) 至少需要 2 个`);
      continue;
    }

    // 3. 分配唯一 ID
    let qId: number;
    if (typeof item.id === 'number' && item.id >= CUSTOM_ID_START && !seenIds.has(item.id)) {
      qId = item.id;
    } else {
      qId = nextId;
    }
    while (seenIds.has(qId)) qId = nextId++;
    seenIds.add(qId);
    if (qId >= nextId) nextId = qId + 1;

    // 4. 校验每个选项
    let optionsValid = true;
    const options: QuestionOption[] = [];

    for (let j = 0; j < item.options.length; j++) {
      const opt = item.options[j] as Record<string, unknown>;
      const optPrefix = `${prefix} 选项 #${j + 1}`;

      if (opt.id === undefined || opt.id === null) {
        errors.push(`${optPrefix}: 缺少选项 ID`);
        optionsValid = false;
        break;
      }

      if (typeof opt.text !== 'string' || opt.text.trim() === '') {
        errors.push(`${optPrefix}: 缺少选项文本`);
        optionsValid = false;
        break;
      }

      if (typeof opt.scores !== 'object' || opt.scores === null) {
        errors.push(`${optPrefix}: 缺少分数映射 (scores)`);
        optionsValid = false;
        break;
      }

      // 校验 scores 中的 key 都是合法的 DimensionKey
      const scoreEntries = opt.scores as Record<string, unknown>;
      const validScores: Partial<Record<DimensionKey, number>> = {};
      for (const key of Object.keys(scoreEntries)) {
        if (!VALID_DIMENSIONS.includes(key as DimensionKey)) {
          errors.push(`${optPrefix}: 无效维度 "${key}"，支持: ${VALID_DIMENSIONS.join(', ')}`);
          optionsValid = false;
          break;
        }
        const val = scoreEntries[key];
        if (typeof val !== 'number') {
          errors.push(`${optPrefix}: 维度 "${key}" 的分值必须是数字`);
          optionsValid = false;
          break;
        }
        validScores[key as DimensionKey] = val;
      }

      if (!optionsValid) break;

      options.push({
        id: opt.id as string | number,
        text: opt.text as string,
        scores: validScores
      });
    }

    if (!optionsValid) continue;

    questions.push({
      id: qId,
      type: item.type as QuestionType,
      dimension: (typeof item.dimension === 'string' ? item.dimension : '自定义') as string,
      text: item.text as string,
      options
    });
  }

  // 5. 检查维度覆盖
  const coveredDims = new Set<string>();
  questions.forEach(q => {
    q.options.forEach(opt => {
      Object.keys(opt.scores).forEach(dim => coveredDims.add(dim));
    });
  });

  const missingDims = VALID_DIMENSIONS.filter(d => !coveredDims.has(d));
  if (missingDims.length > 0) {
    errors.push(`以下维度没有被任何题目覆盖: ${missingDims.join(', ')}`);
  }

  if (questions.length === 0) {
    return { valid: false, bank: null, errors };
  }

  // 6. 构建 QuestionBank
  const bank: QuestionBank = {
    id: 'custom',
    name: `自定义题库（${questions.length} 题）`,
    desc: `用户导入 · ${questions.length} 道灵魂之问`,
    count: questions.length,
    questions
  };

  return {
    valid: errors.length === 0,
    bank,
    errors
  };
}

// 导出到全局
(window as unknown as Record<string, unknown>).validateCustomBank = validateCustomBank;
