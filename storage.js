window.TravelerData = (() => {
  const slots = [
    ["helm", "头盔"], ["shoulder", "肩甲"], ["chest", "胸甲"], ["weapon", "武器"],
    ["offhand", "副手"], ["cape", "披风"], ["acc", "项链"], ["ring", "戒指"], ["boots", "鞋子"]
  ];

  const items = {
    traveler_hat: { id: "traveler_hat", slot: "helm", name: "旅行兜帽", rarity: "普通", set: "旅者", icon: "兜", source: "初始", stats: { stability: 1, resist: 1 }, meaning: "把最低行动戴在头上，不等状态好再开始。" },
    traveler_shoulder: { id: "traveler_shoulder", slot: "shoulder", name: "轻皮护肩", rarity: "普通", set: "旅者", icon: "肩", source: "初始", stats: { stability: 1 }, meaning: "承受今天最小的一段压力。" },
    traveler_coat: { id: "traveler_coat", slot: "chest", name: "黑色长风衣", rarity: "普通", set: "旅者", icon: "衣", source: "初始", stats: { charm: 1, stability: 1 }, meaning: "保持现实形象，不向混乱让步。" },
    old_sword: { id: "old_sword", slot: "weapon", name: "旧剑", rarity: "普通", set: "旅者", icon: "剑", source: "初始", stats: { research: 1 }, meaning: "行动先于心情。" },
    old_shield: { id: "old_shield", slot: "offhand", name: "旧盾", rarity: "普通", set: "旅者", icon: "盾", source: "初始", stats: { resist: 1 }, meaning: "挡住第一波短刺激。" },
    black_cape: { id: "black_cape", slot: "cape", name: "黑色披风", rarity: "普通", set: "旅者", icon: "披", source: "初始", stats: { charm: 1 }, meaning: "别把自己过成后台记录。" },
    wood_amulet: { id: "wood_amulet", slot: "acc", name: "木质护符", rarity: "普通", set: "旅者", icon: "符", source: "初始", stats: { stability: 1 }, meaning: "睡眠、洗脸、站起来，也算秩序。" },
    old_ring: { id: "old_ring", slot: "ring", name: "旧戒指", rarity: "普通", set: "旅者", icon: "戒", source: "初始", stats: { charm: 1 }, meaning: "现实关系只奖励现实状态。" },
    old_boots: { id: "old_boots", slot: "boots", name: "旧靴", rarity: "普通", set: "旅者", icon: "靴", source: "初始", stats: { stability: 1 }, meaning: "离开床和手机，是地图推进的第一格。" },

    research_amulet: { id: "research_amulet", slot: "acc", name: "灰烬研究坠饰", rarity: "史诗", set: "研究院", icon: "研", source: "300字研究输出", stats: { research: 6, stability: 1 }, meaning: "观点必须沉淀为文字。" },
    research_coat: { id: "research_coat", slot: "chest", name: "研究院黑袍", rarity: "传说", set: "研究院", icon: "袍", source: "数据库与PPT双推进", stats: { research: 9, stability: 2 }, meaning: "燃机产业链、供需、估值逻辑成为主线。" },
    research_blade: { id: "research_blade", slot: "weapon", name: "估值刻刀", rarity: "稀有", set: "研究院", icon: "刻", source: "完成一次估值拆解", stats: { research: 4 }, meaning: "把模糊判断削成可复盘的模型。" },

    night_helm: { id: "night_helm", slot: "helm", name: "夜潮静息兜帽", rarity: "稀有", set: "夜潮", icon: "夜", source: "一次离屏训练", stats: { resist: 4, stability: 1 }, meaning: "欲望来时先离屏，而不是争论。" },
    night_cape: { id: "night_cape", slot: "cape", name: "静海夜潮披风", rarity: "史诗", set: "夜潮", icon: "潮", source: "连续3天无失守", stats: { resist: 7, charm: 1 }, meaning: "幻想不能替代现实关系。" },
    judgement_ring: { id: "judgement_ring", slot: "ring", name: "断欲审判戒", rarity: "传说", set: "夜潮", icon: "断", source: "击退旧日幻影", stats: { resist: 9, stability: 2 }, meaning: "旧照片与AI幻想不得拥有指挥权。" },

    discipline_blade: { id: "discipline_blade", slot: "weapon", name: "冷钢纪律之刃", rarity: "史诗", set: "纪律", icon: "钢", source: "交易复盘", stats: { market: 7 }, meaning: "先写计划，再谈交易。" },
    discipline_ring: { id: "discipline_ring", slot: "ring", name: "止损戒环", rarity: "稀有", set: "纪律", icon: "止", source: "连续3天不过度看盘", stats: { market: 4, stability: 1 }, meaning: "不让翻本心态接管仓位。" },
    risk_shield: { id: "risk_shield", slot: "offhand", name: "风控圆盾", rarity: "传说", set: "纪律", icon: "控", source: "完成爆仓复盘", stats: { market: 9, stability: 2 }, meaning: "回撤必须变成规则，而不是创伤。" },

    abyss_boots: { id: "abyss_boots", slot: "boots", name: "深渊行者长靴", rarity: "传说", set: "深渊", icon: "渊", source: "通关地图章节", stats: { research: 3, charm: 5, stability: 3 }, meaning: "现实推进越多，系统权柄越大。" },
    abyss_shoulder: { id: "abyss_shoulder", slot: "shoulder", name: "深渊肩铠", rarity: "传说", set: "深渊", icon: "铠", source: "Boss掉落", stats: { research: 3, resist: 3, market: 3, charm: 3 }, meaning: "长期主义不是口号，是连续记录。" }
  };

  const startEquip = {
    helm: "traveler_hat", shoulder: "traveler_shoulder", chest: "traveler_coat", weapon: "old_sword",
    offhand: "old_shield", cape: "black_cape", acc: "wood_amulet", ring: "old_ring", boots: "old_boots"
  };

  const bosses = [
    {
      id: "desire", name: "欲望魔神", image: "assets/boss_desire.png", hp: 82,
      problem: "短刺激、深夜失控、身体欲望上头",
      heal: "失守、连续失守、深夜刷刺激内容",
      damage: "运动、离屏、冷水洗脸、最低行动",
      drop: "夜潮静息兜帽",
      dialogue: ["你不是输给欲望，你是输给第一秒的纵容。", "别跟我谈意志力。离屏、洗脸、站起来，先把身体从入口拖走。", "今晚你每多拖一分钟，我就多一层回血。"],
      advice: "立刻执行：离屏10分钟、冷水洗脸、10个深蹲。"
    },
    {
      id: "market", name: "市场先生", image: "assets/boss_market.png", hp: 74,
      problem: "满杠杆、爆仓、追涨、看盘过量",
      heal: "看盘超过4小时、冲动加仓、暴跌后翻本",
      damage: "交易复盘、限制看盘、先做行业研究",
      drop: "冷钢纪律之刃",
      dialogue: ["你以为你在盯盘，其实你在求一个立刻翻身的幻觉。", "无计划的交易不是勇敢，是把现实债务再抵押一次。", "先写复盘。写不出来，就没有资格加仓。"],
      advice: "立刻执行：停止看盘30分钟，写下交易计划或复盘三句话。"
    },
    {
      id: "phantom", name: "旧日幻影", image: "assets/boss_phantom.png", hp: 88,
      problem: "旧照片、AI改图、怀旧沉溺、幻想扩建",
      heal: "翻旧照片、AI生成/改图、刷主页刺激",
      damage: "现实社交、研究输出、纸质阅读、走出去",
      drop: "断欲审判戒",
      dialogue: ["我不需要打败你，我只要让你相信过去比今天更真实。", "每一次AI幻想，都是把现实行动延期给影子。", "关掉入口，去做一件现实里能留下证据的事。"],
      advice: "立刻执行：关闭图片入口，写100字研究输出或出门走5分钟。"
    },
    {
      id: "fakeResearch", name: "伪研究员", image: "assets/npc_scholar.png", hp: 69,
      problem: "只看盘、不输出、收藏资料但不消化",
      heal: "用看盘冒充研究、只问观点不建模型",
      damage: "300字输出、数据库推进、产业链拆解",
      drop: "灰烬研究坠饰",
      dialogue: ["你收藏的资料不会替你面试。", "没有输出的研究，只是在给焦虑换一个高级名字。", "打开数据库。今天至少推进一个字段。"],
      advice: "立刻执行：写300字，或补一个燃机产业链字段。"
    },
    {
      id: "inertia", name: "惰性王", image: "assets/hero.png", hp: 77,
      problem: "赖床、拖延、什么都不想做、刷手机空耗",
      heal: "躺着不动、继续刷、把装修系统当逃避",
      damage: "洗脸、站起来、5分钟资料、打开PPT",
      drop: "深渊行者长靴",
      dialogue: ["你不用输很多，只要继续躺着就够了。", "宏大计划是我的盟友。最低行动才是我的敌人。", "站起来。只要站起来，我就会掉血。"],
      advice: "立刻执行：首页点击懒惰急救，完成一个最低行动。"
    }
  ];

  const npcs = [
    { id: "scholar", name: "灰烬研究员", image: "assets/npc_scholar.png", role: "研究任务、数据库、PPT、行业逻辑", offer: "今日委托：燃气轮机数据库推进90分钟。", dialogue: ["研究不是看起来很忙。研究是留下可检验的文字、表格和假设。", "今天先不要追求完整框架，先推进一个真实字段。"], advice: "接受委托：90分钟研究 + 300字输出。" },
    { id: "forge", name: "铸火工匠", image: "assets/npc_forge.png", role: "装备强化、任务奖励、现实契约", offer: "契约：完成300字输出后解锁研究院装备。", dialogue: ["装备不是送的，是现实行动烧出来的。", "你完成输出，我给你铸造；你只装修系统，我什么都不给。"], advice: "接受契约：完成今日日报结算，触发装备掉落。" },
    { id: "watcher", name: "守夜顾问", image: "assets/boss_desire.png", role: "欲望急救、离屏训练、深夜防线", offer: "急救：先冷水洗脸，再做10个深蹲。", dialogue: ["夜里不要讲道理，夜里只执行流程。", "入口关掉，身体移动，幻想链条自然断。"], advice: "守夜流程：离屏、洗脸、深蹲、纸面记录。" },
    { id: "risk", name: "风控仲裁者", image: "assets/boss_market.png", role: "交易纪律、复盘、仓位约束", offer: "禁令：无复盘，不开放交易观察。", dialogue: ["市场不欠你翻本机会。", "你可以错，但不能不复盘；可以慢，但不能满杠杆。"], advice: "风控流程：写复盘、限制看盘、冻结冲动加仓。" }
  ];

  const mapNodes = [
    { id: "wake", name: "晨间锚点", desc: "起床、洗脸、护肤、离开床", reward: "稳定度与社交魅力" },
    { id: "research", name: "燃机研究所", desc: "数据库、产业链、估值、答辩PPT", reward: "研究战力与RP" },
    { id: "market", name: "风控塔", desc: "看盘限制、交易复盘、仓位纪律", reward: "投资纪律" },
    { id: "night", name: "守夜回廊", desc: "欲望急救、AI幻想中断、旧照片封存", reward: "欲望抗性与SV下降" },
    { id: "reality", name: "现实广场", desc: "运动、形象、现实社交、外出行动", reward: "现实权限解锁" }
  ];

  return { slots, items, startEquip, bosses, npcs, mapNodes };
})();
