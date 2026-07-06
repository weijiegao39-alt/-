window.TravelerState = (() => {
  const D = window.TravelerData;
  const Store = window.TravelerStorage;

  const baseDaily = {
    location: "A7中枢城", weather: "", wake: "", sleep: "",
    skincare: 0, researchMinutes: 0, outputWords: 0, database: 0, ppt: 0,
    exerciseMinutes: 0, marketHours: 0, deer: 0, aiFantasy: 0, oldPhotos: 0,
    tradeState: "无交易", weight: "", note: ""
  };

  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  function createDefault() {
    const bossHp = {};
    D.bosses.forEach(b => bossHp[b.id] = b.hp);
    const starterInventory = Object.values(D.startEquip);
    return {
      version: "22-dev",
      date: today(),
      stage: "行者",
      rp: 28,
      rpMax: 80,
      sv: 18,
      debt: 12,
      stability: 42,
      inventory: starterInventory,
      equip: { ...D.startEquip },
      bossHp,
      archive: [],
      logs: ["系统初始化：TravelerOS 22 继续开发版已加载。"],
      daily: { ...baseDaily, date: today() },
      rescueIndex: 0,
      mapProgress: { wake: 1, research: 0, market: 0, night: 0, reality: 0 }
    };
  }

  let state = normalize(Store.load() || createDefault());

  function normalize(s) {
    s.version = s.version || "22-dev";
    s.date = s.date || today();
    s.stage = s.stage || "行者";
    s.rp = Number.isFinite(+s.rp) ? +s.rp : 28;
    s.rpMax = Number.isFinite(+s.rpMax) ? +s.rpMax : 80;
    s.sv = Number.isFinite(+s.sv) ? +s.sv : 18;
    s.debt = Number.isFinite(+s.debt) ? +s.debt : 12;
    s.stability = Number.isFinite(+s.stability) ? +s.stability : 42;
    s.inventory = Array.isArray(s.inventory) ? s.inventory : Object.values(D.startEquip);
    s.equip = s.equip || {};
    Object.entries(D.startEquip).forEach(([slot, id]) => { if (!s.equip[slot]) s.equip[slot] = id; });
    s.bossHp = s.bossHp || {};
    D.bosses.forEach(b => { if (!Number.isFinite(+s.bossHp[b.id])) s.bossHp[b.id] = b.hp; });
    s.archive = Array.isArray(s.archive) ? s.archive : [];
    s.logs = Array.isArray(s.logs) ? s.logs : [];
    s.daily = { ...baseDaily, ...(s.daily || {}), date: today() };
    s.mapProgress = { wake: 0, research: 0, market: 0, night: 0, reality: 0, ...(s.mapProgress || {}) };
    s.rescueIndex = Number.isFinite(+s.rescueIndex) ? +s.rescueIndex : 0;
    return s;
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function save(message) {
    if (message) state.logs.unshift(`${new Date().toLocaleString()}｜${message}`);
    state.logs = state.logs.slice(0, 80);
    Store.save(state);
    document.dispatchEvent(new CustomEvent("traveler:changed"));
  }

  function equippedItems() {
    return Object.values(state.equip).map(id => D.items[id]).filter(Boolean);
  }

  function setCounts() {
    const counts = {};
    equippedItems().forEach(item => counts[item.set] = (counts[item.set] || 0) + 1);
    return counts;
  }

  function power() {
    const p = { research: 0, resist: 0, market: 0, charm: 0, stability: state.stability };
    equippedItems().forEach(item => {
      Object.entries(item.stats || {}).forEach(([k, v]) => {
        if (p[k] !== undefined) p[k] += v;
      });
    });
    const sets = setCounts();
    if ((sets["旅者"] || 0) >= 4) p.stability += 3;
    if ((sets["研究院"] || 0) >= 2) p.research += 4;
    if ((sets["夜潮"] || 0) >= 2) p.resist += 4;
    if ((sets["纪律"] || 0) >= 2) p.market += 4;
    if ((sets["深渊"] || 0) >= 2) p.charm += 4;
    return p;
  }

  function permissions() {
    const p = power();
    return {
      girl: state.debt <= 18 && state.sv <= 24 && p.charm >= 5 ? "开放" : "锁定",
      meal: state.debt <= 22 && p.stability >= 45 ? "开放" : "锁定",
      ai: state.sv <= 12 && state.debt <= 12 ? "1次契约许可" : "冻结",
      movie: state.debt <= 15 && state.rp >= 45 ? "开放" : "锁定",
      trade: state.debt <= 14 && p.market >= 8 && state.sv <= 18 ? "谨慎观察" : "冻结"
    };
  }

  function updateStage() {
    const total = state.rp + power().research + power().market + power().resist;
    state.stage = total >= 220 ? "先知" : total >= 160 ? "礁石" : total >= 105 ? "先驱" : total >= 60 ? "勇士" : "行者";
  }

  function equip(slot, itemId) {
    const item = D.items[itemId];
    if (!item || item.slot !== slot || !state.inventory.includes(itemId)) return;
    state.equip[slot] = itemId;
    updateStage();
    save(`装备变更：${item.name}`);
  }

  function updateDaily(name, value) {
    const numeric = ["skincare", "researchMinutes", "outputWords", "database", "ppt", "exerciseMinutes", "marketHours", "deer", "aiFantasy", "oldPhotos"];
    state.daily[name] = numeric.includes(name) ? Number(value || 0) : value;
    Store.save(state);
  }

  function settleDaily() {
    const d = state.daily;
    let rp = 0, sv = 0, debt = 0, stability = 0;
    const boss = { desire: 0, market: 0, phantom: 0, fakeResearch: 0, inertia: 0 };
    const drops = [];

    rp += Math.floor(d.researchMinutes / 30) * 4;
    rp += Math.floor(d.outputWords / 100) * 2;
    rp += Math.floor(d.exerciseMinutes / 10) * 2;
    rp += d.database * 2 + d.ppt * 2 + d.skincare;
    rp += d.sleep && d.sleep <= "23:45" ? 4 : 0;

    stability += d.exerciseMinutes >= 20 ? 4 : 0;
    stability += d.researchMinutes >= 60 ? 3 : 0;
    stability += d.marketHours <= 2 ? 2 : -4;
    stability += d.deer === 0 ? 2 : -d.deer * 5;

    sv += d.deer * 9 + d.aiFantasy * 5 + d.oldPhotos * 5;
    sv -= d.exerciseMinutes >= 20 ? 4 : 0;
    sv -= d.researchMinutes >= 60 ? 3 : 0;
    sv -= d.outputWords >= 300 ? 4 : 0;

    debt += d.deer * 6 + d.aiFantasy * 4 + d.oldPhotos * 4;
    debt += d.marketHours > 4 ? 8 : 0;
    debt += /冲动|加仓|爆仓|翻本/.test(d.tradeState) ? 10 : 0;
    debt -= d.researchMinutes >= 60 ? 5 : 0;
    debt -= d.outputWords >= 300 ? 4 : 0;
    debt -= d.exerciseMinutes >= 20 ? 3 : 0;

    boss.desire += d.deer > 0 ? d.deer * 7 : -6;
    boss.desire -= d.exerciseMinutes >= 20 ? 5 : 0;
    boss.phantom += d.aiFantasy * 6 + d.oldPhotos * 6;
    boss.phantom -= d.outputWords >= 300 ? 7 : 0;
    boss.market += d.marketHours > 4 ? 9 : -3;
    boss.market += /冲动|加仓|爆仓|翻本/.test(d.tradeState) ? 10 : 0;
    boss.fakeResearch += d.researchMinutes > 0 && d.outputWords < 100 ? 6 : -5;
    boss.inertia += d.researchMinutes + d.exerciseMinutes === 0 ? 8 : -5;

    state.rp = clamp(state.rp + rp, 0, state.rpMax);
    state.sv = clamp(state.sv + sv, 0, 100);
    state.debt = clamp(state.debt + debt, 0, 100);
    state.stability = clamp(state.stability + stability, 0, 100);

    Object.entries(boss).forEach(([id, delta]) => {
      state.bossHp[id] = clamp((state.bossHp[id] || 70) + delta, 0, 100);
    });

    if (d.outputWords >= 300 && !state.inventory.includes("research_amulet")) drops.push("research_amulet");
    if (d.researchMinutes >= 90 && d.outputWords >= 300 && !state.inventory.includes("research_coat")) drops.push("research_coat");
    if (d.deer === 0 && d.aiFantasy === 0 && !state.inventory.includes("night_helm")) drops.push("night_helm");
    if (d.marketHours <= 2 && /复盘|无交易|计划/.test(d.tradeState) && !state.inventory.includes("discipline_ring")) drops.push("discipline_ring");
    drops.forEach(id => state.inventory.push(id));

    state.mapProgress.research += d.researchMinutes >= 60 ? 1 : 0;
    state.mapProgress.market += d.marketHours <= 2 ? 1 : 0;
    state.mapProgress.night += d.deer === 0 && d.aiFantasy === 0 ? 1 : 0;
    state.mapProgress.reality += d.exerciseMinutes >= 20 || d.skincare > 0 ? 1 : 0;

    const record = {
      date: today(), rp, sv, debt, stability, boss, drops,
      summary: `研究${d.researchMinutes}分钟 / 输出${d.outputWords}字 / 运动${d.exerciseMinutes}分钟 / 看盘${d.marketHours}小时`,
      note: d.note || ""
    };
    state.archive.unshift(record);
    state.daily = { ...baseDaily, date: today(), location: d.location, weather: d.weather };
    updateStage();
    save(`日报结算：RP ${rp >= 0 ? "+" : ""}${rp}，SV ${sv >= 0 ? "+" : ""}${sv}，现实债务 ${debt >= 0 ? "+" : ""}${debt}`);
    return record;
  }

  function rescue() {
    const steps = ["洗脸并喝水", "站起来离开床", "10个深蹲", "打开燃机资料5分钟", "打开PPT或数据库", "记录一句真实进展"];
    const task = steps[state.rescueIndex % steps.length];
    state.rescueIndex += 1;
    state.rp = clamp(state.rp + 2, 0, state.rpMax);
    state.sv = clamp(state.sv - 1, 0, 100);
    state.debt = clamp(state.debt - 1, 0, 100);
    state.bossHp.inertia = clamp((state.bossHp.inertia || 70) - 4, 0, 100);
    save(`懒惰急救：${task}。RP +2，惰性王 -4HP`);
    return task;
  }

  function reset() {
    state = createDefault();
    save("系统已重置。");
  }

  function replace(next) {
    state = normalize(next);
    save("已导入存档。");
  }

  function get() {
    return state;
  }

  save();
  return { get, save, equip, updateDaily, settleDaily, rescue, power, permissions, setCounts, reset, replace };
})();
