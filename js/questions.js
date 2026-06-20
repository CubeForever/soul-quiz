/**
 * 灵魂解码 — 完整题库
 * 28 道灵魂之问，涵盖五大人格维度
 */

window.SOUL_DIMENSIONS = {
  openness:          { name: '开放性', icon: '✨', soulName: '灵魂的光芒 — 探索之火' },
  conscientiousness: { name: '尽责性', icon: '🏛️', soulName: '灵魂的基石 — 意志之塔' },
  extraversion:      { name: '外向性', icon: '🌊', soulName: '灵魂的潮汐 — 能量之流' },
  agreeableness:     { name: '宜人性', icon: '💚', soulName: '灵魂的温度 — 共情之光' },
  neuroticism:       { name: '神经质', icon: '🌙', soulName: '灵魂的暗面 — 感知之渊' }
};

window.SOUL_QUESTIONS = [

  /* ========================================================
     第一章 · 认知之门（openness）  Q1 – Q6
     ======================================================== */

  // Q1 — scenario
  {
    id: 1,
    type: 'scenario',
    dimension: '认知之门',
    text: '你走进一个从未到过的房间，房间里有四扇门。你会先打开哪一扇？',
    options: [
      { id: 'A', text: '散发温暖光芒的金色门', scores: { openness: 3, extraversion: 1 } },
      { id: 'B', text: '雕刻精密花纹的黑色门', scores: { conscientiousness: 3, neuroticism: 1 } },
      { id: 'C', text: '半掩着、能听到笑声的白色门', scores: { extraversion: 3, agreeableness: 2 } },
      { id: 'D', text: '被藤蔓缠绕的翠绿色门', scores: { openness: 2, neuroticism: 2 } }
    ]
  },

  // Q2 — scenario
  {
    id: 2,
    type: 'scenario',
    dimension: '认知之门',
    text: '夜空中突然出现一颗从未被记录过的流星，你会……',
    options: [
      { id: 'A', text: '立刻拿出手机记录轨迹，想查清它是什么', scores: { openness: 3, conscientiousness: 2 } },
      { id: 'B', text: '闭上眼睛默默许一个愿', scores: { openness: 2, agreeableness: 2 } },
      { id: 'C', text: '兴奋地叫身边的人一起看', scores: { extraversion: 3, agreeableness: 1 } },
      { id: 'D', text: '感到一丝不安，担心这是某种预兆', scores: { neuroticism: 3, openness: 1 } }
    ]
  },

  // Q3 — scenario
  {
    id: 3,
    type: 'scenario',
    dimension: '认知之门',
    text: '你发现一本没有封面、没有作者名的旧书，翻开第一页写着一行陌生的文字。你会……',
    options: [
      { id: 'A', text: '花整晚尝试破译那些文字', scores: { openness: 4, conscientiousness: 1 } },
      { id: 'B', text: '把书放回原处，觉得来路不明的东西不该碰', scores: { conscientiousness: 3, neuroticism: 2 } },
      { id: 'C', text: '拍照发给朋友们，问他们怎么看', scores: { extraversion: 3, agreeableness: 1 } },
      { id: 'D', text: '闻一闻书页的气味，想象它曾经历过什么', scores: { openness: 3, agreeableness: 1 } }
    ]
  },

  // Q4 — likert
  {
    id: 4,
    type: 'likert',
    dimension: '认知之门',
    text: '当所有人都说某部电影"看不懂"时，我……',
    options: [
      { id: 1, text: '绝不会去看，浪费时间', scores: { conscientiousness: 2 } },
      { id: 2, text: '可能跳着看几个片段就够了', scores: { conscientiousness: 1, extraversion: 1 } },
      { id: 3, text: '有空的话会去了解一下', scores: { openness: 1 } },
      { id: 4, text: '很感兴趣，想找出它哪里让人困惑', scores: { openness: 3, neuroticism: 1 } },
      { id: 5, text: '反而更想看了，越复杂越迷人', scores: { openness: 4, neuroticism: 1 } }
    ]
  },

  // Q5 — ranking
  {
    id: 5,
    type: 'ranking',
    dimension: '认知之门',
    text: '以下五种旅程，按你最向往的程度排序：',
    options: [
      { id: 'explore', text: '去一个从未有人踏足的山谷探险', scores: { openness: 3, extraversion: 2 } },
      { id: 'learn',   text: '跟随大师学习一门古老的技艺', scores: { openness: 3, conscientiousness: 2 } },
      { id: 'create',  text: '独自住在海边写一本小说', scores: { openness: 2, neuroticism: 2 } },
      { id: 'serve',   text: '去偏远村庄支教一年', scores: { agreeableness: 3, conscientiousness: 2 } },
      { id: 'compete',  text: '参加一场世界级的极限挑战赛', scores: { extraversion: 3, conscientiousness: 1 } }
    ]
  },

  // Q6 — scenario
  {
    id: 6,
    type: 'scenario',
    dimension: '认知之门',
    text: '你在梦中来到一座漂浮在云上的图书馆。每本书都会根据读者的心境改变内容。你醒来后……',
    options: [
      { id: 'A', text: '立刻把梦记下来，试图理解它的象征', scores: { openness: 4, neuroticism: 1 } },
      { id: 'B', text: '觉得是个有趣的梦，但很快就忘了', scores: { extraversion: 2, conscientiousness: 1 } },
      { id: 'C', text: '想把这个梦境画出来或写成故事', scores: { openness: 3, agreeableness: 1 } },
      { id: 'D', text: '醒来有些恍惚，一整天都在回味那种感觉', scores: { neuroticism: 3, openness: 2 } }
    ]
  },

  /* ========================================================
     第二章 · 意志熔炉（conscientiousness）  Q7 – Q12
     ======================================================== */

  // Q7 — likert
  {
    id: 7,
    type: 'likert',
    dimension: '意志熔炉',
    text: '当计划被突然打乱时，我通常会……',
    options: [
      { id: 1, text: '感到非常烦躁，很难适应', scores: { neuroticism: 4, conscientiousness: 3 } },
      { id: 2, text: '有些不安，但能慢慢调整', scores: { neuroticism: 2, conscientiousness: 1 } },
      { id: 3, text: '没什么特别的感觉', scores: { extraversion: 1 } },
      { id: 4, text: '有点兴奋，觉得新变化有趣', scores: { openness: 3, extraversion: 2 } },
      { id: 5, text: '非常欢迎，喜欢意想不到的事', scores: { openness: 4, extraversion: 2 } }
    ]
  },

  // Q8 — scenario
  {
    id: 8,
    type: 'scenario',
    dimension: '意志熔炉',
    text: '你面前有一座巨大的钟楼，里面的齿轮正在缓缓转动。一个声音告诉你："每修好一个齿轮，你的某种能力就会提升。"你会……',
    options: [
      { id: 'A', text: '制定计划，从最小的齿轮开始逐个修复', scores: { conscientiousness: 4, openness: 1 } },
      { id: 'B', text: '直奔最核心的大齿轮，相信攻克难关才有意义', scores: { conscientiousness: 2, extraversion: 2 } },
      { id: 'C', text: '先不急着修，仔细观察整个钟楼的运作方式', scores: { openness: 3, conscientiousness: 1 } },
      { id: 'D', text: '问那个声音：修好了会失去什么？', scores: { neuroticism: 2, agreeableness: 2 } }
    ]
  },

  // Q9 — likert
  {
    id: 9,
    type: 'likert',
    dimension: '意志熔炉',
    text: '关于"规则"，我更倾向于认为……',
    options: [
      { id: 1, text: '规则是保护所有人的底线，必须遵守', scores: { conscientiousness: 4, agreeableness: 2 } },
      { id: 2, text: '大多数时候应该遵守，但可以有例外', scores: { conscientiousness: 2, openness: 1 } },
      { id: 3, text: '视情况而定，灵活最重要', scores: { openness: 2, extraversion: 1 } },
      { id: 4, text: '很多规则不合理，值得质疑', scores: { openness: 3, neuroticism: 1 } },
      { id: 5, text: '规则是用来打破的，突破才产生进步', scores: { openness: 4, extraversion: 2 } }
    ]
  },

  // Q10 — scenario
  {
    id: 10,
    type: 'scenario',
    dimension: '意志熔炉',
    text: '你正在攀登一座看不见顶的阶梯。每走一步，阶梯都会轻轻晃动。你会……',
    options: [
      { id: 'A', text: '集中注意力，一步一步稳稳地走', scores: { conscientiousness: 4, neuroticism: 1 } },
      { id: 'B', text: '加快脚步，趁阶梯还没塌之前冲上去', scores: { extraversion: 3, neuroticism: 2 } },
      { id: 'C', text: '停下来，观察阶梯晃动的规律再走', scores: { conscientiousness: 2, openness: 3 } },
      { id: 'D', text: '往下看一眼，评估自己还能不能安全返回', scores: { neuroticism: 3, conscientiousness: 2 } }
    ]
  },

  // Q11 — likert
  {
    id: 11,
    type: 'likert',
    dimension: '意志熔炉',
    text: '面对一份枯燥但必须完成的任务，我……',
    options: [
      { id: 1, text: '能心无旁骛地做完，哪怕要花很长时间', scores: { conscientiousness: 4 } },
      { id: 2, text: '会做完，但中间会走神好几次', scores: { conscientiousness: 2, openness: 1 } },
      { id: 3, text: '先做完再说，质量好不好无所谓', scores: { extraversion: 2, conscientiousness: 1 } },
      { id: 4, text: '会想办法把它变得有趣，比如当成游戏', scores: { openness: 3, extraversion: 2 } },
      { id: 5, text: '可能拖到最后一刻才开始', scores: { neuroticism: 2, openness: 1 } }
    ]
  },

  // Q12 — scenario
  {
    id: 12,
    type: 'scenario',
    dimension: '意志熔炉',
    text: '你在一片迷雾森林中捡到一块怀表，指针在逆时针转动。怀表背面刻着："时间属于持表人。"你会……',
    options: [
      { id: 'A', text: '把它放在口袋里，继续赶路——有更重要的事', scores: { conscientiousness: 3, extraversion: 1 } },
      { id: 'B', text: '反复研究它，试图理解"时间属于自己"意味着什么', scores: { openness: 3, neuroticism: 2 } },
      { id: 'C', text: '把怀表挂在路边的树上，让迷路的人也能看到', scores: { agreeableness: 4, conscientiousness: 1 } },
      { id: 'D', text: '上紧发条，看它逆走的速度会不会改变', scores: { openness: 2, conscientiousness: 3 } }
    ]
  },

  /* ========================================================
     第三章 · 情感海洋（extraversion）  Q13 – Q18
     ======================================================== */

  // Q13 — scenario
  {
    id: 13,
    type: 'scenario',
    dimension: '情感海洋',
    text: '你来到一个海边小镇的集市。人群熙熙攘攘，到处是陌生的气味和声音。你的第一反应是……',
    options: [
      { id: 'A', text: '深吸一口气，朝最热闹的摊位挤过去', scores: { extraversion: 4, openness: 1 } },
      { id: 'B', text: '先找个安静的角落观察一会儿', scores: { neuroticism: 2, openness: 1 } },
      { id: 'C', text: '跟身边同样在看的陌生人聊几句', scores: { extraversion: 3, agreeableness: 2 } },
      { id: 'D', text: '拿出本子记录打动自己的细节', scores: { openness: 3, neuroticism: 1 } }
    ]
  },

  // Q14 — likert
  {
    id: 14,
    type: 'likert',
    dimension: '情感海洋',
    text: '在一次聚会上，如果大多数人我都不认识……',
    options: [
      { id: 1, text: '我会尽量找借口不去', scores: { neuroticism: 3 } },
      { id: 2, text: '去了也只跟认识的人待在一起', scores: { neuroticism: 2, agreeableness: 1 } },
      { id: 3, text: '会去，但需要一点时间才能放松', scores: { neuroticism: 1, extraversion: 1 } },
      { id: 4, text: '觉得正好，认识新朋友是件开心的事', scores: { extraversion: 3, agreeableness: 2 } },
      { id: 5, text: '非常期待，人越多越兴奋', scores: { extraversion: 4, openness: 1 } }
    ]
  },

  // Q15 — scenario
  {
    id: 15,
    type: 'scenario',
    dimension: '情感海洋',
    text: '你站在一座悬崖边，面前是一片无尽的大海。海面上漂浮着无数发光的瓶子，每一个都装着一个陌生人的秘密。你会……',
    options: [
      { id: 'A', text: '捡起最近的一个瓶子，大声念出里面的秘密', scores: { extraversion: 3, openness: 2 } },
      { id: 'B', text: '小心翼翼地打开一个，默默读完再放回去', scores: { agreeableness: 3, neuroticism: 1 } },
      { id: 'C', text: '把自己最大的秘密也写下来，放进海里', scores: { openness: 3, neuroticism: 2 } },
      { id: 'D', text: '坐在崖边看瓶子随波漂流，不打开任何一个', scores: { neuroticism: 3, agreeableness: 1 } }
    ]
  },

  // Q16 — likert
  {
    id: 16,
    type: 'likert',
    dimension: '情感海洋',
    text: '当我感到精力充沛的时候，我更倾向于……',
    options: [
      { id: 1, text: '一个人安静地做喜欢的事', scores: { neuroticism: 1, openness: 2 } },
      { id: 2, text: '跟一两个亲密的朋友待在一起', scores: { agreeableness: 2, conscientiousness: 1 } },
      { id: 3, text: '出门走走，看看世界在发生什么', scores: { extraversion: 2, openness: 2 } },
      { id: 4, text: '组织一次聚会或活动', scores: { extraversion: 4, conscientiousness: 1 } },
      { id: 5, text: '打电话聊天，找人分享好心情', scores: { extraversion: 3, agreeableness: 2 } }
    ]
  },

  // Q17 — ranking
  {
    id: 17,
    type: 'ranking',
    dimension: '情感海洋',
    text: '以下五种状态，按你最享受的程度排序：',
    options: [
      { id: 'crowd',  text: '在人群中被快乐感染', scores: { extraversion: 3, agreeableness: 2 } },
      { id: 'alone',  text: '独自沉浸在自己的世界里', scores: { openness: 3, neuroticism: 2 } },
      { id: 'create', text: '专注于创造某样东西', scores: { conscientiousness: 3, openness: 2 } },
      { id: 'deep',   text: '与一个人进行深度对话', scores: { agreeableness: 3, openness: 1 } },
      { id: 'nature', text: '在自然中无声地行走', scores: { openness: 2, neuroticism: 2 } }
    ]
  },

  // Q18 — scenario
  {
    id: 18,
    type: 'scenario',
    dimension: '情感海洋',
    text: '你收到一封来自未来自己的信，只有一句话。但信封上写着："拆开后你需要把它读给一个人才有效。"你会……',
    options: [
      { id: 'A', text: '立刻找最亲近的人读给他听', scores: { extraversion: 3, agreeableness: 3 } },
      { id: 'B', text: '找一个完全不认识的陌生人读', scores: { extraversion: 3, openness: 3 } },
      { id: 'C', text: '对着镜子读给自己听——自己也是一个人', scores: { neuroticism: 2, openness: 2 } },
      { id: 'D', text: '不拆了，未来不该被提前知道', scores: { conscientiousness: 3, neuroticism: 2 } }
    ]
  },

  /* ========================================================
     第四章 · 关系之网（agreeableness）  Q19 – Q23
     ======================================================== */

  // Q19 — scenario
  {
    id: 19,
    type: 'scenario',
    dimension: '关系之网',
    text: '你在一座古老的桥上遇见一个哭泣的陌生人。他向你伸出手，手心里放着一颗碎了的宝石。你会……',
    options: [
      { id: 'A', text: '蹲下来问他发生了什么，帮他把宝石碎片拾起来', scores: { agreeableness: 4, extraversion: 1 } },
      { id: 'B', text: '点点头示意，然后继续走自己的路', scores: { conscientiousness: 2, neuroticism: 1 } },
      { id: 'C', text: '把自己口袋里的一样东西送给他作为安慰', scores: { agreeableness: 3, openness: 2 } },
      { id: 'D', text: '感到不安，不确定该不该介入陌生人的悲伤', scores: { neuroticism: 3, agreeableness: 1 } }
    ]
  },

  // Q20 — likert
  {
    id: 20,
    type: 'likert',
    dimension: '关系之网',
    text: '当朋友做了一个我完全不认同的决定时……',
    options: [
      { id: 1, text: '直截了当地告诉他我觉得他错了', scores: { extraversion: 2, conscientiousness: 2 } },
      { id: 2, text: '委婉地表达自己的看法，但尊重他的选择', scores: { agreeableness: 3, conscientiousness: 1 } },
      { id: 3, text: '选择沉默，不想影响他的心情', scores: { agreeableness: 2, neuroticism: 2 } },
      { id: 4, text: '试着从他的角度去理解为什么这样做', scores: { agreeableness: 4, openness: 2 } },
      { id: 5, text: '其实不太关心，那是他的人生', scores: { openness: 1, neuroticism: 1 } }
    ]
  },

  // Q21 — scenario
  {
    id: 21,
    type: 'scenario',
    dimension: '关系之网',
    text: '深夜，你听到隔壁邻居传来争吵声和摔东西的声音。你会……',
    options: [
      { id: 'A', text: '敲门问问是否需要帮忙', scores: { agreeableness: 4, extraversion: 2 } },
      { id: 'B', text: '戴上耳机，选择不去打扰别人的事', scores: { neuroticism: 1, conscientiousness: 1 } },
      { id: 'C', text: '担心但犹豫着要不要管，最终没有行动', scores: { neuroticism: 3, agreeableness: 2 } },
      { id: 'D', text: '如果持续很久就报警，觉得有义务介入', scores: { conscientiousness: 3, agreeableness: 2 } }
    ]
  },

  // Q22 — likert
  {
    id: 22,
    type: 'likert',
    dimension: '关系之网',
    text: '在团队合作中，我更在意的是……',
    options: [
      { id: 1, text: '每个人的想法都能被听见', scores: { agreeableness: 4, openness: 1 } },
      { id: 2, text: '大家和谐相处，没有冲突', scores: { agreeableness: 3, neuroticism: 1 } },
      { id: 3, text: '任务能按时完成，结果令人满意', scores: { conscientiousness: 4 } },
      { id: 4, text: '团队氛围轻松愉快，工作也有乐趣', scores: { extraversion: 3, agreeableness: 2 } },
      { id: 5, text: '能学到新东西，每个人都有成长', scores: { openness: 3, conscientiousness: 1 } }
    ]
  },

  // Q23 — ranking
  {
    id: 23,
    type: 'ranking',
    dimension: '关系之网',
    text: '在一段亲密关系中，以下五个品质按你最看重的程度排序：',
    options: [
      { id: 'trust',     text: '信任', scores: { conscientiousness: 3, agreeableness: 2 } },
      { id: 'passion',   text: '激情', scores: { extraversion: 3, openness: 2 } },
      { id: 'honesty',   text: '坦诚', scores: { agreeableness: 3, conscientiousness: 2 } },
      { id: 'growth',    text: '共同成长', scores: { openness: 3, conscientiousness: 2 } },
      { id: 'stability', text: '安全感', scores: { conscientiousness: 2, neuroticism: 2 } }
    ]
  },

  /* ========================================================
     第五章 · 内心深渊（neuroticism）  Q24 – Q28
     ======================================================== */

  // Q24 — scenario
  {
    id: 24,
    type: 'scenario',
    dimension: '内心深渊',
    text: '你走进一个巨大的镜子迷宫。每一面镜子里的自己表情都不一样。你注意到有一面镜子里的自己在微笑，但你并不觉得自己在笑。你会……',
    options: [
      { id: 'A', text: '伸手去触碰那面镜子，想感受它是不是真实的', scores: { openness: 3, neuroticism: 2 } },
      { id: 'B', text: '迅速转身离开，不想面对那个陌生的自己', scores: { neuroticism: 4 } },
      { id: 'C', text: '对着那面镜子也笑一下，看它怎么回应', scores: { extraversion: 2, openness: 2 } },
      { id: 'D', text: '仔细看每一面镜子里不同的自己，思考哪一个才是真实的', scores: { neuroticism: 3, openness: 3 } }
    ]
  },

  // Q25 — likert
  {
    id: 25,
    type: 'likert',
    dimension: '内心深渊',
    text: '在深夜独处时，我最容易……',
    options: [
      { id: 1, text: '享受安静，觉得独处是最放松的时刻', scores: { openness: 2, conscientiousness: 1 } },
      { id: 2, text: '想一些白天来不及想的事情', scores: { openness: 2, neuroticism: 1 } },
      { id: 3, text: '翻来覆去地回忆白天说过的话、做过的事', scores: { neuroticism: 3, agreeableness: 1 } },
      { id: 4, text: '感到莫名的焦虑或孤独', scores: { neuroticism: 4 } },
      { id: 5, text: '对未来感到不确定，甚至有一点恐惧', scores: { neuroticism: 3, conscientiousness: 2 } }
    ]
  },

  // Q26 — scenario
  {
    id: 26,
    type: 'scenario',
    dimension: '内心深渊',
    text: '一场暴风雨过后，你在海滩上发现一个漂流瓶。瓶中有一封很长的信，写信人似乎非常痛苦。读到一半你发现信的字迹越写越潦草，最后一行只写了半句话就断了。你会……',
    options: [
      { id: 'A', text: '为这个陌生人感到心痛，在沙滩上写下鼓励的话', scores: { agreeableness: 4, neuroticism: 2 } },
      { id: 'B', text: '把信仔细收好，想着有一天也许能寄出去', scores: { conscientiousness: 3, agreeableness: 2 } },
      { id: 'C', text: '久久不能平静，觉得自己的痛苦也被触动了', scores: { neuroticism: 4, openness: 1 } },
      { id: 'D', text: '把信放回瓶子扔回大海——它属于大海', scores: { openness: 2, conscientiousness: 1 } }
    ]
  },

  // Q27 — likert
  {
    id: 27,
    type: 'likert',
    dimension: '内心深渊',
    text: '当别人批评我的时候，我内心的第一反应通常是……',
    options: [
      { id: 1, text: '虚心倾听，看看有没有道理', scores: { agreeableness: 3, conscientiousness: 2 } },
      { id: 2, text: '表面平静，但内心会反复咀嚼那些话', scores: { neuroticism: 3, agreeableness: 1 } },
      { id: 3, text: '立刻想要辩解或反驳', scores: { extraversion: 2, neuroticism: 2 } },
      { id: 4, text: '感到受伤，会难过很长时间', scores: { neuroticism: 4 } },
      { id: 5, text: '认真反思，然后用行动证明自己', scores: { conscientiousness: 3, extraversion: 1 } }
    ]
  },

  // Q28 — ranking
  {
    id: 28,
    type: 'ranking',
    dimension: '内心深渊',
    text: '以下五个词，按照对你最重要的程度排序：',
    options: [
      { id: 'freedom',    text: '自由', scores: { openness: 3, extraversion: 2 } },
      { id: 'safety',     text: '安全', scores: { conscientiousness: 3, neuroticism: 2 } },
      { id: 'love',       text: '爱',   scores: { agreeableness: 3, extraversion: 1 } },
      { id: 'achievement', text: '成就', scores: { conscientiousness: 2, extraversion: 2 } },
      { id: 'peace',      text: '平静', scores: { agreeableness: 2, openness: 1 } }
    ]
  }

];
