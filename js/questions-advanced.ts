/**
 * 灵魂解码 — 进阶版题库（50 题）
 * 每维度 10 题，ID 2001-2050
 * 混合 scenario / likert / ranking 题型
 */

export const BANK_ADVANCED: QuestionData[] = [

  /* ========================================================
     开放性（openness）  Q2001 – Q2010
     ======================================================== */

  {
    id: 2001, type: 'scenario', dimension: '认知之门',
    text: '你在一家古董店里发现一个从未见过的乐器，上面刻着陌生的符号。你会……',
    options: [
      { id: 'A', text: '试着弹奏它，听它发出什么声音', scores: { openness: 3, extraversion: 1 } },
      { id: 'B', text: '仔细研究符号，猜测它的来历', scores: { openness: 3, conscientiousness: 2 } },
      { id: 'C', text: '拍下来发到社交媒体问大家', scores: { extraversion: 2, openness: 1 } },
      { id: 'D', text: '觉得来路不明的东西不该碰，放回去', scores: { conscientiousness: 2, neuroticism: 1 } }
    ]
  },
  {
    id: 2002, type: 'likert', dimension: '认知之门',
    text: '面对一种从未吃过的异国食物，我……',
    options: [
      { id: 1, text: '绝对不会尝试，看起来就很奇怪', scores: { conscientiousness: 1 } },
      { id: 2, text: '可能会犹豫很久，最终放弃', scores: { neuroticism: 1 } },
      { id: 3, text: '看别人吃了之后再决定', scores: { agreeableness: 1 } },
      { id: 4, text: '愿意尝一口试试味道', scores: { openness: 2 } },
      { id: 5, text: '非常兴奋，想了解它的做法和文化背景', scores: { openness: 4 } }
    ]
  },
  {
    id: 2003, type: 'scenario', dimension: '认知之门',
    text: '一个朋友邀请你参加一个你完全不了解的艺术工作坊，比如陶艺或即兴戏剧。你会……',
    options: [
      { id: 'A', text: '欣然前往，越陌生越有趣', scores: { openness: 3, extraversion: 2 } },
      { id: 'B', text: '犹豫但最终去试试', scores: { openness: 2, agreeableness: 1 } },
      { id: 'C', text: '礼貌拒绝，更想做自己熟悉的事', scores: { conscientiousness: 2 } },
      { id: 'D', text: '感到焦虑，不确定自己能否融入', scores: { neuroticism: 2 } }
    ]
  },
  {
    id: 2004, type: 'ranking', dimension: '认知之门',
    text: '以下五种学习方式，按你最偏好的排序：',
    options: [
      { id: 'visual', text: '通过看视频和图片学习', scores: { openness: 2 } },
      { id: 'reading', text: '通过阅读书籍和文章学习', scores: { openness: 2, conscientiousness: 2 } },
      { id: 'practice', text: '通过动手实践来学习', scores: { openness: 1, conscientiousness: 2 } },
      { id: 'discuss', text: '通过和别人讨论来学习', scores: { extraversion: 3, agreeableness: 1 } },
      { id: 'reflect', text: '通过独处思考来理解', scores: { openness: 2, neuroticism: 1 } }
    ]
  },
  {
    id: 2005, type: 'likert', dimension: '认知之门',
    text: '我喜欢生活在……',
    options: [
      { id: 1, text: '一切按部就班、不会出意外的环境中', scores: { conscientiousness: 2 } },
      { id: 2, text: '大部分稳定，偶尔有一些小惊喜', scores: { conscientiousness: 1, openness: 1 } },
      { id: 3, text: '变化和稳定各占一半', scores: { openness: 2 } },
      { id: 4, text: '经常有新鲜事发生的环境中', scores: { openness: 3, extraversion: 1 } },
      { id: 5, text: '每一天都可能完全不同的冒险中', scores: { openness: 4, extraversion: 1 } }
    ]
  },
  {
    id: 2006, type: 'scenario', dimension: '认知之门',
    text: '你在深夜偶然听到一首从未听过的曲子，旋律非常打动你。你会……',
    options: [
      { id: 'A', text: '反复循环播放，试图理解它为什么打动你', scores: { openness: 3, neuroticism: 2 } },
      { id: 'B', text: '查出作曲家是谁，听他的其他作品', scores: { openness: 3, conscientiousness: 1 } },
      { id: 'C', text: '分享给朋友们，希望他们也听到', scores: { extraversion: 2, agreeableness: 2 } },
      { id: 'D', text: '听完就睡，觉得美好的瞬间不需要分析', scores: { openness: 1, agreeableness: 1 } }
    ]
  },
  {
    id: 2007, type: 'scenario', dimension: '认知之门',
    text: '你被邀请参加一个"24 小时不说话"的挑战。你的反应是……',
    options: [
      { id: 'A', text: '兴奋地接受——终于有理由安静地观察世界了', scores: { openness: 3, neuroticism: 1 } },
      { id: 'B', text: '觉得有趣，想知道沉默中自己会想什么', scores: { openness: 2, neuroticism: 2 } },
      { id: 'C', text: '可以坚持，但会觉得有点无聊', scores: { conscientiousness: 1 } },
      { id: 'D', text: '完全做不到——说话是我的氧气', scores: { extraversion: 3 } }
    ]
  },
  {
    id: 2008, type: 'likert', dimension: '认知之门',
    text: '面对一个没有标准答案的问题，我……',
    options: [
      { id: 1, text: '感到不舒服，需要找到一个确定的答案', scores: { conscientiousness: 2, neuroticism: 1 } },
      { id: 2, text: '倾向于接受大多数人认可的答案', scores: { agreeableness: 2 } },
      { id: 3, text: '能接受模糊，但心里还是想要一个结论', scores: { conscientiousness: 1 } },
      { id: 4, text: '享受探索的过程，答案不重要', scores: { openness: 3 } },
      { id: 5, text: '觉得没有答案本身就是最美的答案', scores: { openness: 4, neuroticism: 1 } }
    ]
  },
  {
    id: 2009, type: 'scenario', dimension: '认知之门',
    text: '你意外获得了一张去任何地方的单程机票。你会选择……',
    options: [
      { id: 'A', text: '一个你从未听说过的偏僻小国', scores: { openness: 4 } },
      { id: 'B', text: '一个文化完全不同的大城市', scores: { openness: 3, extraversion: 2 } },
      { id: 'C', text: '一个你一直向往的知名目的地', scores: { openness: 1, extraversion: 1 } },
      { id: 'D', text: '送给别人——你更喜欢待在熟悉的地方', scores: { agreeableness: 2 } }
    ]
  },
  {
    id: 2010, type: 'ranking', dimension: '认知之门',
    text: '以下五种创意活动，按你最想尝试的排序：',
    options: [
      { id: 'write', text: '写一本小说或诗集', scores: { openness: 3, neuroticism: 2 } },
      { id: 'paint', text: '画一幅油画或水彩', scores: { openness: 3, agreeableness: 1 } },
      { id: 'music', text: '作曲或演奏乐器', scores: { openness: 2, extraversion: 1 } },
      { id: 'code', text: '开发一个小软件或游戏', scores: { openness: 2, conscientiousness: 2 } },
      { id: 'cook', text: '发明一道新菜式', scores: { openness: 2, agreeableness: 2 } }
    ]
  },

  /* ========================================================
     尽责性（conscientiousness）  Q2011 – Q2020
     ======================================================== */

  {
    id: 2011, type: 'scenario', dimension: '意志熔炉',
    text: '你收到一份重要的工作任务，截止日期是一周后。你通常会……',
    options: [
      { id: 'A', text: '当天就开始规划，每天按进度推进', scores: { conscientiousness: 4 } },
      { id: 'B', text: '先收集信息，第三天左右开始动手', scores: { conscientiousness: 2, openness: 1 } },
      { id: 'C', text: '灵感来了就做，没灵感就先做别的', scores: { openness: 2 } },
      { id: 'D', text: '最后两天集中爆发式完成', scores: { neuroticism: 1, extraversion: 1 } }
    ]
  },
  {
    id: 2012, type: 'likert', dimension: '意志熔炉',
    text: '关于"日常作息"，我……',
    options: [
      { id: 1, text: '严格遵守固定时间表，雷打不动', scores: { conscientiousness: 4 } },
      { id: 2, text: '有大致规律，但允许灵活调整', scores: { conscientiousness: 2 } },
      { id: 3, text: '起床和睡觉时间不太固定', scores: { openness: 1 } },
      { id: 4, text: '完全跟着感觉走，想睡就睡', scores: { openness: 2 } },
      { id: 5, text: '作息非常混乱，经常熬夜或晚起', scores: { neuroticism: 1, openness: 1 } }
    ]
  },
  {
    id: 2013, type: 'scenario', dimension: '意志熔炉',
    text: '你的书桌上堆满了各种物品。你的第一反应是……',
    options: [
      { id: 'A', text: '立刻整理——整洁的环境让我思路清晰', scores: { conscientiousness: 4 } },
      { id: 'B', text: '有空的时候会收拾一下', scores: { conscientiousness: 2 } },
      { id: 'C', text: '只要自己能找到东西就行', scores: { openness: 1 } },
      { id: 'D', text: '混乱中自有秩序，我不觉得需要整理', scores: { openness: 2 } }
    ]
  },
  {
    id: 2014, type: 'likert', dimension: '意志熔炉',
    text: '当我说"我会做这件事"的时候……',
    options: [
      { id: 1, text: '百分之百会做到，承诺对我来说是神圣的', scores: { conscientiousness: 4, agreeableness: 1 } },
      { id: 2, text: '大部分时候能做到，偶尔会忘', scores: { conscientiousness: 2 } },
      { id: 3, text: '会尽力，但不保证结果', scores: { openness: 1 } },
      { id: 4, text: '取决于当时的心情和条件', scores: { openness: 2 } },
      { id: 5, text: '说实话，我说话有时候不太算数', scores: { extraversion: 1 } }
    ]
  },
  {
    id: 2015, type: 'scenario', dimension: '意志熔炉',
    text: '你正在做一个长期项目，中途遇到一个看似无法解决的障碍。你会……',
    options: [
      { id: 'A', text: '分解问题，列出所有可能的解决方案逐一尝试', scores: { conscientiousness: 4, openness: 1 } },
      { id: 'B', text: '先休息一下，换个角度再看', scores: { conscientiousness: 1, openness: 2 } },
      { id: 'C', text: '找人帮忙或请教专家', scores: { agreeableness: 2, conscientiousness: 1 } },
      { id: 'D', text: '考虑放弃这个方向，换一个新项目', scores: { openness: 3 } }
    ]
  },
  {
    id: 2016, type: 'ranking', dimension: '意志熔炉',
    text: '以下五种品质，按你最看重的排序：',
    options: [
      { id: 'discipline', text: '自律', scores: { conscientiousness: 3 } },
      { id: 'creativity', text: '创造力', scores: { openness: 3 } },
      { id: 'kindness', text: '善良', scores: { agreeableness: 3 } },
      { id: 'courage', text: '勇气', scores: { extraversion: 2, openness: 1 } },
      { id: 'calm', text: '冷静', scores: { neuroticism: -2, conscientiousness: 1 } }
      // "冷静" 反向计分：选中此项表示低神经质特质（情绪稳定），用负分反向标记
    ]
  },
  {
    id: 2017, type: 'likert', dimension: '意志熔炉',
    text: '关于"金钱管理"，我……',
    options: [
      { id: 1, text: '有详细的预算和记账习惯', scores: { conscientiousness: 4 } },
      { id: 2, text: '大致知道自己的收支情况', scores: { conscientiousness: 2 } },
      { id: 3, text: '不太关注，够用就行', scores: { openness: 1 } },
      { id: 4, text: '经常冲动消费', scores: { extraversion: 1, openness: 1 } },
      { id: 5, text: '对数字完全没有概念', scores: { openness: 1 } }
    ]
  },
  {
    id: 2018, type: 'scenario', dimension: '意志熔炉',
    text: '你发现自己忘记了一个朋友的生日。你会……',
    options: [
      { id: 'A', text: '立刻补送礼物并真诚道歉', scores: { conscientiousness: 3, agreeableness: 2 } },
      { id: 'B', text: '发消息说"生日快乐，迟到了！"', scores: { agreeableness: 2 } },
      { id: 'C', text: '在心里记下，下次一定记住', scores: { conscientiousness: 1 } },
      { id: 'D', text: '觉得没什么大不了的', scores: { openness: 1 } }
    ]
  },
  {
    id: 2019, type: 'scenario', dimension: '意志熔炉',
    text: '你要准备一场重要的演讲。你的做法是……',
    options: [
      { id: 'A', text: '提前两周开始写稿、排练、计时、修改', scores: { conscientiousness: 4 } },
      { id: 'B', text: '提前列好大纲，临场发挥具体内容', scores: { conscientiousness: 2, openness: 2 } },
      { id: 'C', text: '凭自己的经验和口才临场发挥', scores: { extraversion: 2, openness: 1 } },
      { id: 'D', text: '感到焦虑，可能会失眠好几天', scores: { neuroticism: 3 } }
    ]
  },
  {
    id: 2020, type: 'likert', dimension: '意志熔炉',
    text: '当我制定一个目标后……',
    options: [
      { id: 1, text: '会坚持到底，不管遇到什么困难', scores: { conscientiousness: 4 } },
      { id: 2, text: '会努力一段时间，但如果真的不行就调整', scores: { conscientiousness: 2, openness: 1 } },
      { id: 3, text: '经常改变目标，因为新的想法更吸引我', scores: { openness: 3 } },
      { id: 4, text: '不太制定目标，走一步看一步', scores: { openness: 2 } },
      { id: 5, text: '制定了也很难坚持，容易分心', scores: { neuroticism: 1, openness: 1 } }
    ]
  },

  /* ========================================================
     外向性（extraversion）  Q2021 – Q2030
     ======================================================== */

  {
    id: 2021, type: 'scenario', dimension: '情感海洋',
    text: '你参加一个大型派对，大部分人都不认识。你的做法是……',
    options: [
      { id: 'A', text: '主动跟看起来有趣的人搭话', scores: { extraversion: 4, openness: 1 } },
      { id: 'B', text: '等别人来找你聊天', scores: { agreeableness: 1 } },
      { id: 'C', text: '找到认识的人待在一起', scores: { agreeableness: 2, neuroticism: 1 } },
      { id: 'D', text: '找个安静的角落观察人群', scores: { neuroticism: 2, openness: 1 } }
    ]
  },
  {
    id: 2022, type: 'likert', dimension: '情感海洋',
    text: '对我来说，独处一整天是……',
    options: [
      { id: 1, text: '一种享受——我能做很多想做的事', scores: { neuroticism: 1, openness: 2 } },
      { id: 2, text: '挺好的，但晚上会想找人聊聊天', scores: { agreeableness: 1 } },
      { id: 3, text: '还行，不会特别喜欢也不会特别难受', scores: { agreeableness: 1 } },
      { id: 4, text: '有点闷，需要出门走走', scores: { extraversion: 2 } },
      { id: 5, text: '非常煎熬——我需要人和声音', scores: { extraversion: 4 } }
    ]
  },
  {
    id: 2023, type: 'scenario', dimension: '情感海洋',
    text: '你在一个团队项目中，大家都不太说话。你会……',
    options: [
      { id: 'A', text: '主动打破沉默，引导大家开始讨论', scores: { extraversion: 3, conscientiousness: 1 } },
      { id: 'B', text: '先等一等，看有没有人先开口', scores: { agreeableness: 1 } },
      { id: 'C', text: '通过文字消息私下和队友沟通', scores: { conscientiousness: 1, neuroticism: 1 } },
      { id: 'D', text: '享受这种安静的氛围', scores: { neuroticism: 1 } }
    ]
  },
  {
    id: 2024, type: 'likert', dimension: '情感海洋',
    text: '周末我更倾向于……',
    options: [
      { id: 1, text: '一个人待在家看书、看电影、做喜欢的事', scores: { openness: 2, neuroticism: 1 } },
      { id: 2, text: '和一两个亲密朋友小聚', scores: { agreeableness: 2 } },
      { id: 3, text: '看情况，有时候想出门有时候不想', scores: { extraversion: 1 } },
      { id: 4, text: '参加社交活动或聚会', scores: { extraversion: 3 } },
      { id: 5, text: '组织一场大活动，人越多越开心', scores: { extraversion: 4 } }
    ]
  },
  {
    id: 2025, type: 'scenario', dimension: '情感海洋',
    text: '你在一个陌生城市旅行，身边没有同伴。你会……',
    options: [
      { id: 'A', text: '主动和当地人聊天，了解隐藏的好去处', scores: { extraversion: 3, openness: 2 } },
      { id: 'B', text: '按照旅行攻略走，享受一个人的自由', scores: { openness: 1, conscientiousness: 1 } },
      { id: 'C', text: '找一家咖啡馆坐下，观察这座城市', scores: { openness: 2, neuroticism: 1 } },
      { id: 'D', text: '觉得一个人旅行很无聊，想找人结伴', scores: { extraversion: 2, agreeableness: 1 } }
    ]
  },
  {
    id: 2026, type: 'ranking', dimension: '情感海洋',
    text: '以下五种社交场合，按你最享受的排序：',
    options: [
      { id: 'party', text: '热闹的大型派对', scores: { extraversion: 3 } },
      { id: 'dinner', text: '温馨的小型聚餐', scores: { agreeableness: 3 } },
      { id: 'online', text: '线上的群聊或论坛', scores: { openness: 2 } },
      { id: 'workshop', text: '兴趣小组或工作坊', scores: { openness: 3, conscientiousness: 1 } },
      { id: 'solo', text: '一个人待着', scores: { neuroticism: 2, openness: 1 } }
    ]
  },
  {
    id: 2027, type: 'scenario', dimension: '情感海洋',
    text: '你在电梯里遇到一个不太熟的同事。你会……',
    options: [
      { id: 'A', text: '自然地打招呼并聊几句', scores: { extraversion: 3, agreeableness: 1 } },
      { id: 'B', text: '微笑点头就算了', scores: { agreeableness: 1 } },
      { id: 'C', text: '假装在看手机', scores: { neuroticism: 1 } },
      { id: 'D', text: '完全不在意——电梯就是用来坐的', scores: { openness: 1 } }
    ]
  },
  {
    id: 2028, type: 'likert', dimension: '情感海洋',
    text: '在一群人中，我通常……',
    options: [
      { id: 1, text: '是话题的发起者和推动者', scores: { extraversion: 4 } },
      { id: 2, text: '积极参与讨论，但不会主导', scores: { extraversion: 2, agreeableness: 1 } },
      { id: 3, text: '大部分时候在听，偶尔发言', scores: { openness: 1 } },
      { id: 4, text: '很少主动说话，除非被问到', scores: { neuroticism: 1 } },
      { id: 5, text: '尽量不引起注意', scores: { neuroticism: 2 } }
    ]
  },
  {
    id: 2029, type: 'scenario', dimension: '情感海洋',
    text: '你的手机一整天都没有任何消息。你的感受是……',
    options: [
      { id: 'A', text: '享受了一整天的清静', scores: { neuroticism: 1, openness: 1 } },
      { id: 'B', text: '偶尔想起来看看，但不太在意', scores: { conscientiousness: 1 } },
      { id: 'C', text: '有点失落，觉得被遗忘了', scores: { neuroticism: 2, agreeableness: 1 } },
      { id: 'D', text: '坐立不安，主动发消息找人聊天', scores: { extraversion: 3 } }
    ]
  },
  {
    id: 2030, type: 'likert', dimension: '情感海洋',
    text: '当众发言对我来说……',
    options: [
      { id: 1, text: '是展示自己的好机会', scores: { extraversion: 4 } },
      { id: 2, text: '虽然紧张但能应对', scores: { conscientiousness: 1, extraversion: 1 } },
      { id: 3, text: '需要提前做很多准备才能做到', scores: { conscientiousness: 2, neuroticism: 1 } },
      { id: 4, text: '尽量避免，能不上就不上', scores: { neuroticism: 2 } },
      { id: 5, text: '非常恐惧，可能因此失眠', scores: { neuroticism: 4 } }
    ]
  },

  /* ========================================================
     宜人性（agreeableness）  Q2031 – Q2040
     ======================================================== */

  {
    id: 2031, type: 'scenario', dimension: '关系之网',
    text: '一个不太熟的同事向你倾诉他的烦恼。你会……',
    options: [
      { id: 'A', text: '放下手头的事认真倾听', scores: { agreeableness: 4, extraversion: 1 } },
      { id: 'B', text: '耐心听完，给一些建议', scores: { agreeableness: 3, conscientiousness: 1 } },
      { id: 'C', text: '表示理解，但暗示自己很忙', scores: { conscientiousness: 1 } },
      { id: 'D', text: '不知道该怎么回应，感到尴尬', scores: { neuroticism: 2 } }
    ]
  },
  {
    id: 2032, type: 'likert', dimension: '关系之网',
    text: '当我和别人意见不同时……',
    options: [
      { id: 1, text: '会坚持自己的立场，据理力争', scores: { extraversion: 2, conscientiousness: 1 } },
      { id: 2, text: '会表达自己的看法，但尊重对方', scores: { agreeableness: 2, conscientiousness: 1 } },
      { id: 3, text: '看情况，有时候会坚持有时候会妥协', scores: { agreeableness: 1 } },
      { id: 4, text: '通常会退一步，不想引起冲突', scores: { agreeableness: 3, neuroticism: 1 } },
      { id: 5, text: '完全避免争论，哪怕心里不同意', scores: { agreeableness: 4, neuroticism: 1 } }
    ]
  },
  {
    id: 2033, type: 'scenario', dimension: '关系之网',
    text: '你在排队时，有人插队到你前面。你的反应是……',
    options: [
      { id: 'A', text: '直接指出："请到后面排队"', scores: { extraversion: 2, conscientiousness: 2 } },
      { id: 'B', text: '心里不舒服但不会说什么', scores: { agreeableness: 2, neuroticism: 1 } },
      { id: 'C', text: '想一想对方可能有急事，就算了', scores: { agreeableness: 4 } },
      { id: 'D', text: '感到愤怒，但不确定该不该开口', scores: { neuroticism: 2 } }
    ]
  },
  {
    id: 2034, type: 'ranking', dimension: '关系之网',
    text: '在人际关系中，以下五个要素按你最看重的排序：',
    options: [
      { id: 'honest', text: '坦诚相待', scores: { conscientiousness: 2, agreeableness: 2 } },
      { id: 'care', text: '互相照顾', scores: { agreeableness: 3 } },
      { id: 'space', text: '尊重个人空间', scores: { openness: 2, neuroticism: -1 } },
      { id: 'fun', text: '一起开心', scores: { extraversion: 3 } },
      { id: 'grow', text: '共同成长', scores: { openness: 3, conscientiousness: 1 } }
    ]
  },
  {
    id: 2035, type: 'likert', dimension: '关系之网',
    text: '看到街上的流浪动物，我……',
    options: [
      { id: 1, text: '会忍不住想帮它', scores: { agreeableness: 4, neuroticism: 1 } },
      { id: 2, text: '会感到心疼，但知道自己帮不了太多', scores: { agreeableness: 2, neuroticism: 1 } },
      { id: 3, text: '会同情但不会特别在意', scores: { agreeableness: 1 } },
      { id: 4, text: '觉得这是自然规律', scores: { openness: 1 } },
      { id: 5, text: '几乎不会注意到', scores: { conscientiousness: 1 } }
    ]
  },
  {
    id: 2036, type: 'scenario', dimension: '关系之网',
    text: '你的好朋友做了一个你认为很不明智的决定（比如辞职创业）。你会……',
    options: [
      { id: 'A', text: '直言不讳地说出你的担忧', scores: { extraversion: 2, conscientiousness: 2 } },
      { id: 'B', text: '委婉地提醒风险，但表示支持', scores: { agreeableness: 3, conscientiousness: 1 } },
      { id: 'C', text: '全力支持——朋友的决定就是我的决定', scores: { agreeableness: 4 } },
      { id: 'D', text: '不表态，避免卷入', scores: { neuroticism: 1 } }
    ]
  },
  {
    id: 2037, type: 'scenario', dimension: '关系之网',
    text: '在一次小组作业中，一个组员几乎没有参与但署了名。你会……',
    options: [
      { id: 'A', text: '直接向老师反映', scores: { conscientiousness: 3, extraversion: 1 } },
      { id: 'B', text: '先跟对方谈谈，给一个改正的机会', scores: { agreeableness: 3, conscientiousness: 1 } },
      { id: 'C', text: '算了，不影响大局', scores: { agreeableness: 3 } },
      { id: 'D', text: '在心里记下，以后不再合作', scores: { neuroticism: 1, conscientiousness: 1 } }
    ]
  },
  {
    id: 2038, type: 'likert', dimension: '关系之网',
    text: '别人请我帮忙时，我……',
    options: [
      { id: 1, text: '几乎从不拒绝，哪怕自己很忙', scores: { agreeableness: 4 } },
      { id: 2, text: '大部分时候会帮，除非真的很忙', scores: { agreeableness: 3 } },
      { id: 3, text: '会评估自己是否有时间和能力再决定', scores: { conscientiousness: 2 } },
      { id: 4, text: '会帮忙，但心里有时不太情愿', scores: { agreeableness: 1, neuroticism: 1 } },
      { id: 5, text: '不太喜欢被人麻烦', scores: { extraversion: 1 } }
    ]
  },
  {
    id: 2039, type: 'scenario', dimension: '关系之网',
    text: '你无意中听到有人在背后说你坏话。你会……',
    options: [
      { id: 'A', text: '直接走过去问清楚', scores: { extraversion: 3, conscientiousness: 1 } },
      { id: 'B', text: '感到受伤，但选择沉默', scores: { neuroticism: 3, agreeableness: 1 } },
      { id: 'C', text: '反思自己是不是真的有做得不好的地方', scores: { agreeableness: 3, conscientiousness: 1 } },
      { id: 'D', text: '不太在意——别人说什么不重要', scores: { openness: 1, neuroticism: -1 } }
    ]
  },
  {
    id: 2040, type: 'ranking', dimension: '关系之网',
    text: '在帮助别人时，以下五种方式按你最习惯的排序：',
    options: [
      { id: 'listen', text: '倾听和陪伴', scores: { agreeableness: 3 } },
      { id: 'advice', text: '给出建议和方案', scores: { conscientiousness: 2, openness: 1 } },
      { id: 'action', text: '直接行动帮忙', scores: { extraversion: 2, conscientiousness: 2 } },
      { id: 'resource', text: '提供资源和人脉', scores: { extraversion: 2, agreeableness: 1 } },
      { id: 'space', text: '给对方空间和时间', scores: { openness: 2, neuroticism: -1 } }
    ]
  },

  /* ========================================================
     神经质（neuroticism）  Q2041 – Q2050
     ======================================================== */

  {
    id: 2041, type: 'scenario', dimension: '内心深渊',
    text: '你在一个重要的场合迟到了 15 分钟。你的内心活动是……',
    options: [
      { id: 'A', text: '非常焦虑，脑子里一直在想别人会怎么看我', scores: { neuroticism: 4 } },
      { id: 'B', text: '有些不安，但到了之后能迅速调整', scores: { neuroticism: 2, conscientiousness: 1 } },
      { id: 'C', text: '到了之后跟大家道个歉就过去了', scores: { agreeableness: 2 } },
      { id: 'D', text: '不太在意——迟到又不是什么大事', scores: { openness: 1, neuroticism: -1 } }
    ]
  },
  {
    id: 2042, type: 'likert', dimension: '内心深渊',
    text: '在没有任何明确原因的情况下，我突然感到低落……',
    options: [
      { id: 1, text: '这种情况经常发生', scores: { neuroticism: 4 } },
      { id: 2, text: '偶尔会发生', scores: { neuroticism: 2 } },
      { id: 3, text: '很少发生', scores: { neuroticism: 1 } },
      { id: 4, text: '几乎不会，我大部分时候情绪稳定', scores: { conscientiousness: 1 } },
      { id: 5, text: '从来没有过', scores: { openness: 1 } }
    ]
  },
  {
    id: 2043, type: 'scenario', dimension: '内心深渊',
    text: '你即将进行一场非常重要的面试。前一天晚上你会……',
    options: [
      { id: 'A', text: '反复准备可能的问题，几乎无法入睡', scores: { neuroticism: 4, conscientiousness: 2 } },
      { id: 'B', text: '做些准备然后尽量放松', scores: { conscientiousness: 2, neuroticism: 1 } },
      { id: 'C', text: '按照正常作息睡觉', scores: { conscientiousness: 2 } },
      { id: 'D', text: '毫不紧张，甚至有点期待', scores: { extraversion: 2, openness: 1 } }
    ]
  },
  {
    id: 2044, type: 'likert', dimension: '内心深渊',
    text: '当别人没有回复我的消息时……',
    options: [
      { id: 1, text: '会反复检查自己是不是说错了什么', scores: { neuroticism: 4, agreeableness: 1 } },
      { id: 2, text: '会有点担心，但能控制住', scores: { neuroticism: 2 } },
      { id: 3, text: '觉得对方可能在忙', scores: { agreeableness: 1 } },
      { id: 4, text: '不太在意，对方有空自然会回', scores: { conscientiousness: 1 } },
      { id: 5, text: '完全没有注意到', scores: { openness: 1 } }
    ]
  },
  {
    id: 2045, type: 'scenario', dimension: '内心深渊',
    text: '你在工作中犯了一个小错误被领导指出来。你的第一反应是……',
    options: [
      { id: 'A', text: '极度自责，觉得自己很没用', scores: { neuroticism: 4 } },
      { id: 'B', text: '感到尴尬，但会立即纠正', scores: { neuroticism: 2, conscientiousness: 2 } },
      { id: 'C', text: '承认错误并从中学习', scores: { conscientiousness: 3 } },
      { id: 'D', text: '觉得领导小题大做', scores: { openness: 1, neuroticism: -1 } }
    ]
  },
  {
    id: 2046, type: 'ranking', dimension: '内心深渊',
    text: '以下五种情绪，按你最常体验的排序：',
    options: [
      { id: 'anxious', text: '焦虑', scores: { neuroticism: 3 } },
      { id: 'curious', text: '好奇', scores: { openness: 3 } },
      { id: 'joyful', text: '快乐', scores: { extraversion: 3 } },
      { id: 'calm', text: '平静', scores: { agreeableness: 2, neuroticism: -1 } },
      { id: 'determined', text: '坚定', scores: { conscientiousness: 3 } }
    ]
  },
  {
    id: 2047, type: 'likert', dimension: '内心深渊',
    text: '面对不确定性，我通常……',
    options: [
      { id: 1, text: '会非常不安，需要尽快找到确定的答案', scores: { neuroticism: 4, conscientiousness: 1 } },
      { id: 2, text: '会有些焦虑，但能慢慢接受', scores: { neuroticism: 2 } },
      { id: 3, text: '会做我能做的准备，然后顺其自然', scores: { conscientiousness: 2 } },
      { id: 4, text: '不太受影响，继续做自己的事', scores: { openness: 1 } },
      { id: 5, text: '反而觉得不确定中藏着惊喜', scores: { openness: 3 } }
    ]
  },
  {
    id: 2048, type: 'scenario', dimension: '内心深渊',
    text: '你做了一个非常真实的噩梦，醒来后心跳加速。你会……',
    options: [
      { id: 'A', text: '久久不能平静，反复回想梦中的画面', scores: { neuroticism: 4, openness: 1 } },
      { id: 'B', text: '喝杯水缓一缓，几分钟后就恢复了', scores: { neuroticism: 2 } },
      { id: 'C', text: '记录下来，觉得梦是潜意识的表达', scores: { openness: 3, neuroticism: 1 } },
      { id: 'D', text: '翻个身继续睡——只是个梦而已', scores: { conscientiousness: 1, neuroticism: -1 } }
    ]
  },
  {
    id: 2049, type: 'scenario', dimension: '内心深渊',
    text: '你的一段关系出现了微妙的变化——对方似乎没有以前那么热情了。你会……',
    options: [
      { id: 'A', text: '反复分析自己哪里做错了', scores: { neuroticism: 4, agreeableness: 1 } },
      { id: 'B', text: '找个合适的时机坦诚地聊一聊', scores: { agreeableness: 3, conscientiousness: 1 } },
      { id: 'C', text: '给对方一些空间，也许只是太忙了', scores: { agreeableness: 2, openness: 1 } },
      { id: 'D', text: '不太会注意到这种变化', scores: { openness: 1, neuroticism: -1 } }
    ]
  },
  {
    id: 2050, type: 'likert', dimension: '内心深渊',
    text: '回顾过去一周，我感到压力的频率是……',
    options: [
      { id: 1, text: '几乎每天都有明显的压力感', scores: { neuroticism: 4 } },
      { id: 2, text: '大概有一半时间会感到压力', scores: { neuroticism: 3 } },
      { id: 3, text: '偶尔一两次', scores: { neuroticism: 1 } },
      { id: 4, text: '很少，大多数时候心态平稳', scores: { conscientiousness: 1 } },
      { id: 5, text: '几乎没有，生活很轻松', scores: { openness: 1, neuroticism: -1 } }
    ]
  }

];
