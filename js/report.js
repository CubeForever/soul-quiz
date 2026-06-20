/**
 * report.js — 灵魂解码报告生成引擎
 * 根据 OCEAN 五维得分和九型人格，生成完整个性化灵魂报告
 */

window.SoulReport = (() => {

  // ═══ 灵魂类型标题 ═══
  const SOUL_TITLES = [
    { check: (s) => s.openness >= 67 && s.neuroticism >= 67, title: '深海梦想家' },
    { check: (s) => s.openness >= 67 && s.extraversion <= 33, title: '星夜独行者' },
    { check: (s) => s.openness >= 67 && s.extraversion >= 67, title: '光芒探险家' },
    { check: (s) => s.openness >= 67 && s.conscientiousness >= 67, title: '精密梦想家' },
    { check: (s) => s.conscientiousness >= 67 && s.agreeableness >= 67, title: '温暖建造者' },
    { check: (s) => s.conscientiousness >= 67 && s.extraversion >= 67, title: '璀璨指挥官' },
    { check: (s) => s.conscientiousness >= 67 && s.neuroticism >= 67, title: '负重行者' },
    { check: (s) => s.extraversion >= 67 && s.agreeableness >= 67, title: '阳光治愈师' },
    { check: (s) => s.extraversion >= 67 && s.neuroticism >= 67, title: '风暴之心' },
    { check: (s) => s.agreeableness >= 67 && s.neuroticism >= 67, title: '敏感织梦者' },
    { check: (s) => s.openness <= 33 && s.conscientiousness >= 67, title: '磐石守护者' },
    { check: (s) => s.extraversion <= 33 && s.neuroticism <= 33, title: '静水隐士' },
    { check: (s) => s.extraversion <= 33 && s.openness >= 67, title: '深渊观星者' },
    { check: (s) => s.agreeableness <= 33 && s.extraversion >= 67, title: '烈焰独裁者' },
    { check: (s) => s.neuroticism <= 33 && s.agreeableness >= 67, title: '晨曦和平者' },
    { check: (s) => s.openness >= 67, title: '幻境漫游者' },
    { check: (s) => s.conscientiousness >= 67, title: '意志铸造师' },
    { check: (s) => s.extraversion >= 67, title: '能量漩涡' },
    { check: (s) => s.agreeableness >= 67, title: '灵魂拥抱者' },
    { check: (s) => s.neuroticism >= 67, title: '暗潮感知者' },
    { check: (s) => s.openness <= 33, title: '大地之子' },
    { check: (s) => s.extraversion <= 33, title: '月光独行客' },
    { check: (s) => s.neuroticism <= 33, title: '永恒平静者' },
    { check: () => true, title: '灵魂旅人' }
  ];

  // ═══ 五维灵魂文案（5维 × 3档 = 15段） ═══
  const DIMENSION_TEXTS = {
    openness: {
      high: '你的灵魂是一座永远敞开大门的图书馆，每一本书都是一个新宇宙。你被未知吸引，被可能性点燃，在想象与现实的边界上自由行走。你的内心世界如同一片浩瀚的星海，充满了奇思妙想和未被命名的颜色。',
      mid: '你在秩序与冒险之间找到了属于自己的节奏。你既珍惜熟悉的安全感，也不会拒绝一次意外的旅途。你像一条在已知与未知之间流淌的河，懂得在稳定中保持好奇。',
      low: '你的灵魂扎根于大地，稳定而坚实。你信任经得起考验的事物，用双手建造看得见摸得着的世界。对你来说，真实的砖瓦比幻想的城堡更有分量。'
    },
    conscientiousness: {
      high: '你的灵魂深处住着一位建筑师，每一块砖都严丝合缝。你拥有将混沌变为秩序的天赋，你的意志如同一座灯塔，无论风暴如何都不会熄灭。你相信每一个细节都值得被认真对待。',
      mid: '你懂得何时该握紧方向盘，何时该顺流而行。你不是被计划束缚的人，但也不会让生活失控。你在自律与随性之间，找到了属于自己的平衡点。',
      low: '你的灵魂是一阵自由的风，不愿被任何框架囚禁。你更相信直觉而非计划，更喜欢即兴发挥而非按部就班。你的生活可能没有精确的时间表，但充满了意想不到的精彩。'
    },
    extraversion: {
      high: '你的灵魂是一团温暖的火焰，照亮你所在的每一个角落。你在人群中汲取能量，在交流中获得灵感。你的声音是房间里的阳光，你的存在让周围的人感到温暖和活力。',
      mid: '你像潮汐一样，在社交的海洋中自如进退。你享受热闹的聚会，也珍惜独处的时光。你知道何时该走向人群，何时该回到自己的小世界，这种弹性是你的天赋。',
      low: '你的灵魂是一颗在深海中发光的珍珠——安静，却有着不可忽视的光芒。你在独处中获得力量，在沉默中聆听世界最细微的声音。你不害怕孤独，因为你与自己的内心有着深刻的对话。'
    },
    agreeableness: {
      high: '你的灵魂散发着治愈的温度。你天生能够感知他人的痛苦与喜悦，你的同理心如同一条无形的丝线，将你与周围的生命紧紧相连。给予对你来说不是牺牲，而是一种本能。',
      mid: '你在善良与自我保护之间找到了智慧的平衡。你愿意伸出援手，但也不会忘记照顾自己。你懂得说"是"的慷慨，也懂得说"不"的艺术。',
      low: '你的灵魂有着清晰的边界和锋利的棱角。你不是冷漠，而是真实。你宁可说出不舒服的真话，也不愿用虚假的温柔掩盖真相。你的坦率是一种勇气，也是一种力量。'
    },
    neuroticism: {
      high: '你的灵魂像一面极其精密的镜子，能够映照出世间最细微的震动。你的敏感不是脆弱，而是一种超凡的感知力。你比大多数人更深地感受快乐，也更深刻地体验悲伤——这是你灵魂的深度所在。',
      mid: '你的内心有一片变幻莫测的海。有时风平浪静，有时微起波澜。你能够感知情绪的潮汐，但不会被它吞没。你在情感的起伏中，学会了与自己的内心和平共处。',
      low: '你的灵魂如同一座宁静的深湖——表面波澜不惊，深处沉稳有力。你拥有罕见的情绪稳定性，无论外界如何风雨飘摇，你的内心总能找到锚点。这份平静是你最珍贵的礼物。'
    }
  };

  // ═══ 维度组合洞察（精选 10 种关键组合，每种 3 档 = 30 段） ═══
  const COMBO_INSIGHTS = {
    'openness_extraversion': {
      bothHigh: '你的灵魂同时拥有广度和亮度——你既探索世界的每一个角落，又照亮每一个你经过的地方。',
      mixed: '你的内心有一座巨大的花园，但你有选择地邀请访客。你渴望连接，但只在真正触动你灵魂的时刻才完全绽放。',
      bothLow: '你的灵魂是一颗深埋在地下的宝石——不为人知，却有着惊人的价值。你在安静的探索中找到了属于自己的宝藏。'
    },
    'openness_neuroticism': {
      bothHigh: '你是一个灵魂的深渊潜泳者——你的想象力和感受力都远超常人。你能在一朵花中看到整个宇宙，也能在一首歌中听见整个世纪的悲伤。',
      mixed: '你用好奇心驾驭情绪的波浪。当内心涌动时，你选择将它转化为创造力。你的敏感是你艺术天赋的源泉。',
      bothLow: '你脚踏实地，心如止水。你不需要太多刺激就能感到满足，简单的真理对你来说比复杂的理论更有力量。'
    },
    'conscientiousness_agreeableness': {
      bothHigh: '你是最可靠的灵魂伙伴——你既信守承诺，又真心关怀。在你身边，人们会感到世界是安全的、温暖的、可以信任的。',
      mixed: '你像一座有温度的堡垒——既坚固又不失柔软。你知道何时该坚持原则，何时该为他人让步。',
      bothLow: '你是一个彻底的自由灵魂——不受规则束缚，也不被人情世故牵绊。你按照自己的节奏生活，真实而不妥协。'
    },
    'extraversion_agreeableness': {
      bothHigh: '你是人群中的太阳——温暖、慷慨、充满感染力。你天生就知道如何让每个人感到被看见、被接纳。',
      mixed: '你在社交中有着精确的温度计。你热情但不盲目，善良但不软弱。你选择性地散发温暖，让每一次付出都有意义。',
      bothLow: '你是一座独立的灯塔——不需要依靠他人的认可来定义自己的价值。你的真实有时会刺痛人，但认识你的人都知道这是你最珍贵的品质。'
    },
    'openness_conscientiousness': {
      bothHigh: '你是梦想家与建筑师的完美结合——你不仅能看到远方的星辰，还能一步一步地建造通往星辰的阶梯。',
      mixed: '你在创造与执行之间灵活切换。你有时沉浸在灵感中忘记时间，有时又能以惊人的专注力完成任务。',
      bothLow: '你更喜欢顺其自然的生活方式。你不需要宏大的目标来驱动自己，当下这一刻的美好就足够让你满足。'
    },
    'extraversion_neuroticism': {
      bothHigh: '你的灵魂是一场盛大的烟火——灿烂而炽烈。你用全部的热情拥抱生活，也用全部的感受力承受它的重量。',
      mixed: '你在喧嚣与沉思之间找到了独特的节奏。社交为你充电，独处让你消化。这种循环是你保持平衡的方式。',
      bothLow: '你是人群中最冷静的存在——不被情绪左右，也不被社交绑架。你的平静源于内心的深度自信。'
    },
    'agreeableness_neuroticism': {
      bothHigh: '你是一面能感受他人痛苦的镜子——你的同理心如此强烈，以至于有时需要提醒自己，别人的情绪不是你的责任。',
      mixed: '你既敏感又务实。你能感知他人的需求，但也有足够的内在力量来保护自己的边界。',
      bothLow: '你拥有一种稀有的清醒——既不被他人的情绪裹挟，也不被自己的情绪淹没。你用理性和冷静来看待人与人之间的关系。'
    },
    'conscientiousness_neuroticism': {
      bothHigh: '你对自己有着近乎苛刻的要求——你的高标准和强烈责任感让你成为最可靠的执行者，但也请记得对自己温柔一些。',
      mixed: '你能够在追求卓越和接受不完美之间找到平衡。你有动力，但不会被焦虑吞噬。',
      bothLow: '你是天生的"船到桥头自然直"主义者——不过度担忧，不过度计划。你的轻松自在是一种令人羡慕的生活智慧。'
    },
    'openness_agreeableness': {
      bothHigh: '你的灵魂对世界和他人都敞开着大门——你既能接纳新思想，又能拥抱不同的灵魂。你是天生的桥梁建造者。',
      mixed: '你在思想的开放和人际的谨慎之间保持微妙平衡。你愿意倾听不同的声音，但也有自己的判断标准。',
      bothLow: '你有着自己坚固的精神堡垒——你不容易被新事物动摇，也不容易被人情左右。你的坚定是一种力量。'
    },
    'conscientiousness_extraversion': {
      bothHigh: '你是一位天生的领袖——你既有带领团队冲锋的热情，也有精密规划的耐心。在你身边，人们会自然而然地跟随你的步伐。',
      mixed: '你能在独处的专注和社交的活跃之间切换自如。你享受合作，但独立工作时效率更高。',
      bothLow: '你是一位安静的探索者——你更喜欢按照自己的节奏独自前行，而非跟随人群的方向。你的力量在于内省和独立思考。'
    }
  };

  // ═══ 九型人格完整文案（9种 × 4字段 = 36段） ═══
  const ENNEAGRAM_TEXTS = {
    1: {
      motivation: '你内心深处燃烧着对"正确"的渴望。你相信世界应该有秩序、有标准、有底线，而你愿意成为那个守护标准的人。你的动力来自一种内在的声音——它告诉你，事情可以做得更好。',
      fear: '你最深的恐惧是犯错、堕落或失去道德指南针。你害怕被内心的"不够好"所吞噬，害怕在最重要的时刻做出错误的选择。这种恐惧驱使你不断追求完美。',
      growth: '成长的道路在于学会拥抱"足够好"。完美是一种方向，而非目的地。试着对自己说："我已经尽力了，这就够了。"学会在严格中注入温柔，在标准中留出弹性。你的善良不需要完美来证明。',
      relation: '你最适合与能够欣赏你高标准、同时又能温柔提醒你放松的灵魂在一起。你需要一个能说"你已经很好了"的伙伴。在关系中，试着放下评判，多一些接纳——包括对自己。'
    },
    2: {
      motivation: '你的灵魂是一团温暖的火焰，燃烧的动力来自被需要的感觉。你天生就能感知他人的需求，而满足这些需求让你感到存在的意义。对你来说，爱是动词——它需要行动来证明。',
      fear: '你最深的恐惧是不被爱、不被需要。你害怕如果停止付出，就没有人会留下来。这种恐惧有时会让你忽略自己的需求，把所有的温柔都给了别人。',
      growth: '成长的道路在于学会先爱自己。你不需要通过付出来赚取爱——你本身就值得被爱。试着在给予他人之前，先问自己："我需要什么？"记住，空杯无法倒水。',
      relation: '你需要一个能够主动给予你关怀的伙伴——而不是总在等待你付出的人。在关系中，学会接受帮助，学会说"我也需要"。真正的亲密是双向的河流。'
    },
    3: {
      motivation: '你的灵魂渴望在世界上留下印记。成就对你来说不仅仅是外在的认可，更是内在价值的证明。你有着惊人的执行力和适应力，能够在任何环境中脱颖而出。',
      fear: '你最深的恐惧是毫无价值、被遗忘。你害怕如果失去了成就和光环，就失去了自己。这种恐惧驱动你不断奔跑，但有时也让你忘记停下来问自己真正想要什么。',
      growth: '成长的道路在于区分"我做的"和"我是"。你的价值不取决于你的成就。试着摘下面具，展示真实的自己——包括脆弱和不完美。你不需要赢得爱。',
      relation: '你需要一个能看到你成就背后真实自我的伙伴。在关系中，试着放慢脚步，展示你的脆弱面。真正的亲密来自于"我看到了真实的你"，而非"我崇拜你的成就"。'
    },
    4: {
      motivation: '你的灵魂在寻找一种独特的存在方式——你渴望成为独一无二的自己，而非人群中的一张面孔。你对美、对深度、对真实有着超乎寻常的敏感，你的情感世界如同一片深邃的海洋。',
      fear: '你最深的恐惧是没有独特的身份，过着平庸无意义的生活。你害怕被淹没在人群中，害怕自己的存在没有任何特别之处。这种恐惧有时会让你沉溺于忧伤。',
      growth: '成长的道路在于认识到——独特不在于你与别人有多不同，而在于你有多真实。你不需要通过痛苦来证明深度。试着在平凡的日常中发现美，在稳定中找到灵感。',
      relation: '你需要一个能欣赏你灵魂深度、同时又能带你回到地面的伙伴。在关系中，试着不要把"被理解"当作永远达不到的完美目标。被爱，比被完全理解更重要。'
    },
    5: {
      motivation: '你的灵魂是一座知识的宝库。你渴望理解世界的运作方式，通过观察和思考来获得安全感。你珍视独立和自主，在内心世界中你是最自由的。你用思考代替喧嚣，用洞察代替表态。',
      fear: '你最深的恐惧是被外界消耗殆尽——你害怕如果打开门让世界涌入，你将失去自己最珍贵的东西：内心的宁静和独立思考的空间。',
      growth: '成长的道路在于学会参与，而非仅仅观察。知识的价值在于分享和应用。试着走出书房，把你的洞察力转化为行动。你不需要准备好一切才开始——行动本身就是最好的学习。',
      relation: '你需要一个尊重你独处需求、同时又能温和邀请你走出壳外的伙伴。在关系中，试着分享你的内心世界，而不只是你掌握的知识。情感的连接和智力的连接同样重要。'
    },
    6: {
      motivation: '你的灵魂在寻找可以信赖的锚点。你重视忠诚、安全和归属感，你愿意为你信任的人和信念付出一切。你的警觉性是你最大的天赋——你总能在问题出现之前嗅到危险。',
      fear: '你最深的恐惧是失去支持和安全感。你害怕被抛弃、被背叛、独自面对未知。这种恐惧让你在做决定时反复权衡，有时甚至让你在两个选择之间犹豫不决。',
      growth: '成长的道路在于学会信任自己。你已经拥有应对一切挑战的能力——你只是还不相信。试着在不确定中找到勇气，在怀疑中做出选择。行动是恐惧最好的解药。',
      relation: '你需要一个稳定、忠诚、言行一致的伙伴。对你来说，安全感来自一致性——当对方说到做到时，你的心才能真正放下。在关系中，试着用信任代替测试。'
    },
    7: {
      motivation: '你的灵魂渴望自由和丰富多彩的体验。你是一个天生的乐观主义者，能够在任何事物中发现乐趣和可能性。你的思维像烟花一样快速绽放，每一个新想法都让你兴奋不已。',
      fear: '你最深的恐惧是被困住、错过美好的事物。你害怕无聊、害怕痛苦、害怕停下来面对内心可能存在的空虚。你用忙碌和新鲜感来填满每一个空隙。',
      growth: '成长的道路在于学会与不适共处。快乐不是痛苦的反面，而是穿越痛苦后的奖赏。试着在一件事上深耕，而非在十件事上浅尝。你想要的自由，可能恰恰来自承诺和专注。',
      relation: '你需要一个能跟上你节奏、同时又能让你安心停下来的伙伴。在关系中，试着接受"足够好"的快乐，而非永远追逐"更好的"。深层的满足感来自深度，而非广度。'
    },
    8: {
      motivation: '你的灵魂渴望力量和掌控。你天生就是领导者——你有保护弱者的本能，有对抗不公的勇气。你相信力量应该被用来守护重要的人和事，而非被浪费在无意义的争斗中。',
      fear: '你最深的恐惧是被控制、被伤害、暴露脆弱。你用强大来保护自己，用掌控来确保安全。你害怕一旦示弱，就会被世界吞噬。',
      growth: '成长的道路在于认识到真正的力量来自柔软。最有勇气的事不是永远不倒下，而是倒下后坦然接受帮助。试着把盔甲放下，让信任的人看到真实的你——包括你的脆弱。',
      relation: '你需要一个不被你的力量吓退、同时又能温柔触碰你脆弱核心的伙伴。在关系中，试着把"保护"升级为"连接"。最深的亲密来自于双方都愿意卸下盔甲。'
    },
    9: {
      motivation: '你的灵魂渴望内在的平静与外在的和谐。你天生就是和平的使者——你能够看到每个人的角度，理解每种立场的合理性。你的存在本身就是一种让人放松的力量。',
      fear: '你最深的恐惧是冲突和失去连接。你害怕坚持自己会引发对抗，害怕说"不"会失去关系。这种恐惧有时会让你忽略自己的需求，融入他人的期望中。',
      growth: '成长的道路在于认识到——你的声音同样重要。和谐不是压抑自我，而是在尊重自己的前提下与世界和平共处。试着说出你的真实想法，即使它可能引发小小的波澜。',
      relation: '你需要一个既能与你共享宁静、又能鼓励你表达自我的伙伴。在关系中，试着不要为了避免冲突而妥协自己的需求。健康的关系允许不同意见的存在。'
    }
  };

  // ═══ 灵魂暗面文案（3字段 × 3档 = 9段） ═══
  const SHADOW_TEXTS = {
    text: {
      high: '你的灵魂暗面是一片深不可测的海洋。你的敏感让你能够感知到别人看不到的暗流——那些细微的变化、未说出口的情绪、空气中若有若无的紧张。这种深度感知力既是天赋，也是负担。当你不加控制时，它可能将你卷入焦虑和过度思考的漩涡。',
      mid: '你的灵魂暗面如同月光下的阴影——时隐时现，不会完全笼罩你，但也不会完全消失。你偶尔会陷入自我怀疑，会在深夜反复咀嚼白天的对话。但你有从阴影中走出来的能力，你知道阳光总会再次到来。',
      low: '你的灵魂暗面像一池静水，少有波澜。你有着罕见的情绪稳定性，但这也意味着你有时可能忽略了内心深处的声音。偶尔允许自己感受不安和脆弱，反而能让你的灵魂更加完整。'
    },
    conflict: {
      high: '你内心最大的冲突在于——你既渴望被理解，又害怕被看穿。你的高标准与现实的不完美之间永远存在张力。你可能在"做自己"和"被接纳"之间反复拉扯，难以找到那个平衡点。',
      mid: '你偶尔会在理性与感性之间摇摆。你知道该怎么做，但你的心有时不听大脑的话。这种内在的对话虽然消耗能量，但也是你深度思考的证明。',
      low: '你的内在冲突较少，但偶尔会面临"为什么我感受不到别人那么强烈的情绪"的困惑。你的平静有时会被误认为冷漠——请记住，稳定本身就是一种力量。'
    },
    stress: {
      high: '在压力下，你可能会陷入过度思考的循环——反复分析、过度准备、难以做出决定。你的情绪反应可能比平时更强烈，你需要提醒自己：深呼吸，这只是一场风暴，风暴会过去。',
      mid: '面对压力时，你可能会暂时失去平衡，但你有恢复的能力。你倾向于先允许自己感受压力，然后寻找解决办法。给自己一些时间和空间，你会重新找到方向。',
      low: '面对压力时，你通常能保持冷静和理性。你像一艘稳定的船，在风浪中依然能保持航向。但请留意——有时候适当地释放压力，比一直压抑更健康。'
    }
  };

  // ═══ 成长建议池（12条，根据短板选取3条） ═══
  const GROWTH_POOL = {
    openness: {
      title: '🔥 点燃探索之火',
      text: '尝试每周做一件你从未做过的事——哪怕只是走一条新的路回家，吃一种没尝过的食物，读一本不在你书单上的书。好奇心是一块肌肉，越用越强。',
      psychology: '心理学研究表明，新体验能激活大脑的多巴胺系统，提升创造力和幸福感（Costa & McCrae, 1992）'
    },
    conscientiousness: {
      title: '🏛️ 修建意志之塔',
      text: '从一个小习惯开始——每天在固定的时间做一件小事。不需要宏大的计划，微小的纪律会像雪球一样越滚越大。当你发现自己能信守对自己的承诺时，你的自信会自然生长。',
      psychology: '行为心理学证明，小习惯的"复利效应"能显著提升自我效能感（Baumeister & Tierney, 2011）'
    },
    extraversion: {
      title: '🌊 打开情感之门',
      text: '给自己设定一个"社交实验"——每周主动和一个不太熟的人聊天。你不需要变成社交达人，只需要让自己的世界多开一扇窗。你可能会发现，与人连接比你想象的更轻松。',
      psychology: '研究显示，即使是内向者也能从适度的社交互动中获得情绪提升（Fleeson, 2001）'
    },
    agreeableness: {
      title: '💚 培育共情之花',
      text: '练习"先理解，再被理解"——在下一次分歧中，试着先复述对方的观点，确认你理解了，再表达自己的看法。这个简单的动作，能彻底改变你的人际关系质量。',
      psychology: '临床心理学证实，主动倾听是建立信任和亲密关系最有效的方法之一（Rogers, 1957）'
    },
    neuroticism: {
      title: '🌙 安抚内心暗面',
      text: '建立一个"情绪急救箱"——当焦虑来袭时，准备一套固定的应对流程：三次深呼吸、写下此刻的感受、去散步十分钟。工具化的情绪管理比硬扛有效得多。',
      psychology: '认知行为疗法（CBT）证实，结构化的情绪调节策略能有效降低焦虑水平（Beck, 1979）'
    }
  };

  // ═══ 总述模板（20条，根据标签选取） ═══
  const SUMMARY_TEMPLATES = [
    '你的灵魂是一颗多面的宝石，每一面都折射出不同的光芒。{combo}，这种独特的组合造就了你不可复制的灵魂色彩。',
    '在你的灵魂深处，{dim1}与{dim2}交织成一幅复杂的画卷。你不是非黑即白的——你是光与影完美交融的那个存在。',
    '你是一个{tag1}的灵魂，同时也是一个{tag2}。你的魅力恰恰在于这些看似矛盾的特质在你身上和谐共存。',
    '如果灵魂有颜色，你的一定是{color}的。{combo}在你的生命中写下了一首独特的诗。',
    '你的灵魂密码由{dim1}和{dim2}组成——前者赋予你独特的视角，后者赋予你前行的力量。',
    '你是那种能在{scenario1}中发现美的人，也是那种在{scenario2}中找到力量的人。这就是你独特的灵魂配方。',
    '你的存在本身就是一种{trait}。{combo}，让你在人群中拥有不可替代的位置。',
    '有些灵魂像太阳——炽热而耀眼。有些灵魂像月亮——温柔而深邃。而你，{combo}，是一颗有着独特轨道的星。',
    '你的灵魂告诉你：{insight}。这是你与生俱来的天赋，也是你此生需要探索的课题。',
    '如果把你比作一种自然现象，你更像{phenomenon}——{desc}。',
    '你的灵魂密码已经解码：你是一个集{tag1}和{tag2}于一身的独特存在。在这个世界上，没有人能替代你。',
    '在你安静的外表下，藏着一颗{trait}的灵魂。你不需要向世界证明什么——你的存在本身就已经是一种力量。',
    '你的灵魂是一本精彩的书——{dim1}是它的主题，{dim2}是它的风格。每一章都值得细细品读。',
    '你走过的每一步、做过的每一个选择，都在诉说着同一个故事——{insight}。',
    '你是{tag1}的化身，也是{tag2}的代言人。这两个维度在你身上碰撞出了独特的人生火花。',
    '你的灵魂有一种{quality}的气质。你不需要成为别人——你已经是最好的自己。',
    '如果要给你的灵魂写一句话的传记，那就是："{insight}"。',
    '你的灵魂既不完全是光明的，也不完全是黑暗的——它是黎明前那一刻最美的微光。',
    '世界需要你这样的人——{combo}。你的存在让这个世界多了一种看待事物的角度。',
    '你的灵魂已经告诉了你一切：{combo}。现在，带着这份认知，去拥抱属于你的精彩人生吧。'
  ];

  // ═══ 灵魂寄语（10条） ═══
  const BLESSINGS = [
    '愿你的灵魂永远保持那份独特的光芒，照亮你前行的每一步路。',
    '在人生的旅途中，愿你既有勇气面对暗面，也有智慧拥抱光明。',
    '你的灵魂比你想象的更强大。相信它，它会带你去该去的地方。',
    '世间所有的相遇都是久别重逢——愿你的灵魂找到它一直在寻找的共鸣。',
    '不必急于定义自己。你的灵魂是一条流动的河，每一刻都在创造新的风景。',
    '愿你在这个喧嚣的世界里，始终听到自己灵魂的声音。',
    '你的不完美恰恰是你最完美的部分。拥抱它，它会让你自由。',
    '灵魂没有标准答案——你走的每一步，都是正确的路。',
    '愿你有勇气做真实的自己，因为真实的你，已经足够美好。',
    '你是宇宙间独一无二的存在。这一点，从你诞生的那一刻起，就已经是事实。'
  ];

  // ═══ 灵魂配色映射 ═══
  const COLOR_MAP = {
    openness: { from: '#667eea', to: '#764ba2' },
    conscientiousness: { from: '#f093fb', to: '#f5576c' },
    extraversion: { from: '#f0c27f', to: '#fc4a1a' },
    agreeableness: { from: '#11998e', to: '#38ef7d' },
    neuroticism: { from: '#0f0c29', to: '#302b63' }
  };

  // ═══ 自然现象描述 ═══
  const PHENOMENA = [
    { phenomenon: '北极光', desc: '变幻莫测却始终美丽，在寂静的夜空中绽放出令人屏息的色彩' },
    { phenomenon: '深海暖流', desc: '表面波澜不惊，内心却蕴含着改变整个海洋温度的力量' },
    { phenomenon: '流星', desc: '短暂却耀眼，在划过天际的瞬间点燃无数人的愿望' },
    { phenomenon: '古老的森林', desc: '根深叶茂，充满生命的秘密，每一寸土壤都藏着故事' },
    { phenomenon: '潮汐', desc: '在月光的牵引下有节律地进退，温柔却势不可挡' }
  ];

  // ═══ 辅助函数 ═══

  function getLevel(score) {
    if (score >= 67) return 'high';
    if (score >= 34) return 'mid';
    return 'low';
  }

  function getDominantDimensions(scores) {
    return Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .map(e => e[0]);
  }

  function getWeakestDimensions(scores) {
    return Object.entries(scores)
      .sort((a, b) => a[1] - b[1])
      .map(e => e[0]);
  }

  function pickSoulTitle(scores) {
    for (const item of SOUL_TITLES) {
      if (item.check(scores)) return item.title;
    }
    return '灵魂旅人';
  }

  function pickComboKey(dim1, dim2) {
    // 组合 key 的顺序
    const order = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];
    const i1 = order.indexOf(dim1);
    const i2 = order.indexOf(dim2);
    if (i1 < 0 || i2 < 0) return null;
    return i1 < i2 ? `${dim1}_${dim2}` : `${dim2}_${dim1}`;
  }

  function getComboText(dim1, dim2, scores) {
    const key = pickComboKey(dim1, dim2);
    if (!key || !COMBO_INSIGHTS[key]) return '';

    const l1 = getLevel(scores[dim1]);
    const l2 = getLevel(scores[dim2]);
    const combo = COMBO_INSIGHTS[key];

    if (l1 === 'high' && l2 === 'high') return combo.bothHigh;
    if (l1 === 'low' && l2 === 'low') return combo.bothLow;
    return combo.mixed;
  }

  function fillTemplate(template, data) {
    let result = template;
    Object.keys(data).forEach(key => {
      result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), data[key]);
    });
    return result;
  }

  // ═══ 主生成函数 ═══

  function generate(scores, enneagram) {
    const dim1 = getDominantDimensions(scores)[0];
    const dim2 = getDominantDimensions(scores)[1];
    const weakest = getWeakestDimensions(scores).slice(0, 2);
    const tags = window.SoulScoring.generatePersonaTags(scores);

    // 1. 灵魂类型标题
    const title1 = pickSoulTitle(scores);
    const title2 = enneagram.name;
    const soulType = `${title1} × ${title2}`;

    // 2. 灵魂色彩
    const soulColor = COLOR_MAP[dim1] || COLOR_MAP.openness;

    // 3. 总述
    const tplIdx = (scores.openness + scores.conscientiousness + scores.extraversion) % SUMMARY_TEMPLATES.length;
    const randomPhenomenon = PHENOMENA[(scores.openness + scores.neuroticism) % PHENOMENA.length];
    const summary = fillTemplate(SUMMARY_TEMPLATES[tplIdx], {
      dim1: getDimName(dim1),
      dim2: getDimName(dim2),
      tag1: tags[0] || '独特',
      tag2: tags[1] || '深邃',
      combo: getComboText(dim1, dim2, scores),
      color: getDimName(dim1),
      trait: getDimLevelDesc(dim1, scores[dim1]),
      scenario1: getScenario(dim1, 'high'),
      scenario2: getScenario(dim2, 'high'),
      insight: getComboText(dim1, dim2, scores),
      phenomenon: randomPhenomenon.phenomenon,
      desc: randomPhenomenon.desc,
      quality: getDimLevelDesc(dim1, scores[dim1])
    });

    // 4. 五维详情
    const dimensions = {};
    const dimNames = { openness: '开放性', conscientiousness: '尽责性', extraversion: '外向性', agreeableness: '宜人性', neuroticism: '神经质' };
    const dimIcons = { openness: '✨', conscientiousness: '🏛️', extraversion: '🌊', agreeableness: '💚', neuroticism: '🌙' };

    Object.keys(dimNames).forEach(dim => {
      const level = getLevel(scores[dim]);
      dimensions[dim] = {
        score: scores[dim],
        level,
        text: DIMENSION_TEXTS[dim][level],
        icon: dimIcons[dim],
        name: dimNames[dim]
      };
    });

    // 5. 组合洞察
    const combination = getComboText(dim1, dim2, scores);

    // 6. 九型人格
    const enneaTexts = ENNEAGRAM_TEXTS[enneagram.type] || ENNEAGRAM_TEXTS[9];

    // 7. 灵魂暗面
    const neuroLevel = getLevel(scores.neuroticism);
    const shadow = {
      title: '灵魂暗面',
      text: SHADOW_TEXTS.text[neuroLevel],
      conflict: SHADOW_TEXTS.conflict[neuroLevel],
      stress: SHADOW_TEXTS.stress[neuroLevel]
    };

    // 8. 成长建议（取最弱的 2-3 个维度）
    const growth = weakest.map(dim => ({
      title: GROWTH_POOL[dim].title,
      text: GROWTH_POOL[dim].text,
      psychology: GROWTH_POOL[dim].psychology
    }));

    // 如果只有 2 个短板，再加一个次弱的
    if (growth.length < 3) {
      const thirdWeak = getWeakestDimensions(scores)[2];
      if (thirdWeak && GROWTH_POOL[thirdWeak]) {
        growth.push({
          title: GROWTH_POOL[thirdWeak].title,
          text: GROWTH_POOL[thirdWeak].text,
          psychology: GROWTH_POOL[thirdWeak].psychology
        });
      }
    }

    // 9. 共鸣
    const blessingIdx = (scores.openness + scores.neuroticism) % BLESSINGS.length;
    const compatible = getCompatibleTypes(enneagram.type);
    const resonance = {
      compatible,
      advice: getRelationshipAdvice(scores.agreeableness, scores.extraversion),
      blessing: BLESSINGS[blessingIdx]
    };

    return {
      soulType,
      soulColor,
      summary,
      dimensions,
      combination,
      enneagram: {
        type: enneagram.type,
        name: enneagram.name,
        icon: enneagram.icon,
        motivation: enneaTexts.motivation,
        fear: enneaTexts.fear,
        growth: enneaTexts.growth,
        relation: enneaTexts.relation
      },
      shadow,
      growth,
      resonance
    };
  }

  // ═══ 辅助：维度名称 ═══
  function getDimName(dim) {
    const map = { openness: '开放性', conscientiousness: '尽责性', extraversion: '外向性', agreeableness: '宜人性', neuroticism: '神经质' };
    return map[dim] || dim;
  }

  function getDimLevelDesc(dim, score) {
    const level = getLevel(score);
    const descs = {
      openness: { high: '无限好奇', mid: '平衡探索', low: '脚踏实地' },
      conscientiousness: { high: '钢铁意志', mid: '张弛有度', low: '自由不羁' },
      extraversion: { high: '光芒四射', mid: '收放自如', low: '深邃内敛' },
      agreeableness: { high: '温暖如春', mid: '善良有度', low: '真实坦率' },
      neuroticism: { high: '深邃感知', mid: '潮起潮落', low: '波澜不惊' }
    };
    return (descs[dim] && descs[dim][level]) || '独特';
  }

  function getScenario(dim, level) {
    const scenarios = {
      openness: { high: '未知的星空下', low: '熟悉的壁炉旁' },
      conscientiousness: { high: '精密的蓝图中', low: '自由的风里' },
      extraversion: { high: '热闹的人群中', low: '安静的书房里' },
      agreeableness: { high: '温暖的拥抱中', low: '独立的思考中' },
      neuroticism: { high: '暴风雨的夜里', low: '平静的湖面上' }
    };
    return (scenarios[dim] && scenarios[dim][level]) || '旅途中';
  }

  // ═══ 辅助：匹配类型 ═══
  function getCompatibleTypes(type) {
    const compatMap = {
      1: ['温暖织者', '宁静使者'],
      2: ['秩序守护者', '力量化身'],
      3: ['灵魂诗人', '信念守卫'],
      4: ['光芒追寻者', '自由旅人'],
      5: ['自由旅人', '灵魂诗人'],
      6: ['力量化身', '温暖织者'],
      7: ['智慧守望者', '秩序守护者'],
      8: ['温暖织者', '信念守卫'],
      9: ['秩序守护者', '光芒追寻者']
    };
    return compatMap[type] || ['灵魂旅人', '智慧守望者'];
  }

  // ═══ 辅助：关系建议 ═══
  function getRelationshipAdvice(agree, extra) {
    if (agree >= 67 && extra >= 67) return '你在关系中是天然的给予者。记住，最健康的关系是双向的——也要学会接受他人的爱和关怀。';
    if (agree >= 67 && extra < 34) return '你用无声的温柔守护着身边的人。试着更主动地表达你的感受，让爱你的人知道你的心意。';
    if (agree < 34 && extra >= 67) return '你的直率和活力让人着迷。在关系中，试着给对方多一些耐心和空间，真正的连接需要温柔的土壤。';
    if (agree < 34 && extra < 34) return '你享受独处，也有能力深度连接。找到那个尊重你空间、同时愿意走进你内心世界的人。';
    return '在关系中，做真实的自己比做完美的伴侣更重要。真诚是连接灵魂最短的距离。';
  }

  return { generate };
})();
