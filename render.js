window.TravelerRender = (() => {
  const D = window.TravelerData;
  const State = window.TravelerState;

  let filter = "all";

  function el(id) {
    return document.getElementById(id);
  }

  function pct(value) {
    return `${Math.max(0, Math.min(100, Math.round(value)))}%`;
  }

  function rarityClass(rarity) {
    return `rarity-${rarity}`;
  }

  function showToast(text) {
    const toast = el("toast");
    toast.textContent = text;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2400);
  }

  function assetSrc(src) {
    return src || "";
  }

  function fallbackSrc(src) {
    if (!src) return "";
    return src.includes("/") ? src.split("/").pop() : `assets/${src}`;
  }

  function setImage(img, src) {
    img.onerror = () => {
      img.onerror = null;
      const fallback = fallbackSrc(src);
      if (fallback && fallback !== src) img.src = fallback;
    };
    img.src = src || "";
  }

  function renderHome() {
    const s = State.get();
    const p = State.power();
    const locks = State.permissions();
    const dominant = dominantSet();
    const portrait = portraitForSet(dominant);
    if (el("homeHeroImg")) setImage(el("homeHeroImg"), portrait);
    el("homeStage").textContent = s.stage;
    el("homeRp").textContent = `${s.rp} / ${s.rpMax}`;
    el("homeSv").textContent = s.sv;
    el("homeDebt").textContent = s.debt;
    el("homeStability").textContent = p.stability;
    el("homeResearch").textContent = p.research;
    el("homeResist").textContent = p.resist;
    el("homeMarket").textContent = p.market;
    el("homeCharm").textContent = p.charm;
    el("lineReality").style.width = pct(100 - s.debt);
    el("lineFall").style.width = pct(s.sv + s.debt / 2);
    el("permissionGrid").innerHTML = [
      ["认识新女生", locks.girl], ["外食升级", locks.meal], ["AI娱乐", locks.ai],
      ["电影/游戏", locks.movie], ["交易观察", locks.trade]
    ].map(([name, value]) => `<div class="permission ${value.includes("锁") || value.includes("冻") ? "locked" : "open"}"><span>${name}</span><strong>${value}</strong></div>`).join("");
  }

  function renderRole() {
    const s = State.get();
    renderOutfit();
    const slotBox = el("slotGrid");
    slotBox.innerHTML = "";
    D.slots.forEach(([slot, name]) => {
      const item = D.items[s.equip[slot]];
      const node = document.createElement("button");
      node.className = "slot";
      node.innerHTML = `
        <span class="itemIcon ${rarityClass(item.rarity)}">${item.icon}</span>
        <span class="slotText">
          <small>${name}</small>
          <strong>${item.name}</strong>
          <em class="${rarityClass(item.rarity)}">${item.rarity}｜${item.set}</em>
        </span>
      `;
      node.addEventListener("click", () => openEquip(slot));
      slotBox.appendChild(node);
    });

    const sets = State.setCounts();
    el("setBox").innerHTML = [
      ["旅者", "2件：最低行动更稳；4件：稳定度额外提升"],
      ["研究院", "2件：研究战力提升；4件：伪研究员额外掉血"],
      ["夜潮", "2件：欲望抗性提升；4件：SV增长降低"],
      ["纪律", "2件：投资纪律提升；4件：市场先生额外掉血"],
      ["深渊", "2件：现实权限更容易解锁；4件：地图奖励提升"]
    ].map(([name, effect]) => {
      const count = sets[name] || 0;
      return `<div class="set ${count >= 2 ? "active" : ""}"><strong>${name}套 · ${count}件</strong><span>${effect}</span></div>`;
    }).join("");

    const p = State.power();
    el("powerSummary").innerHTML = [
      ["研究战力", p.research], ["欲望抗性", p.resist], ["投资纪律", p.market], ["社交魅力", p.charm], ["稳定度", p.stability]
    ].map(([name, value]) => `<div><span>${name}</span><strong>${value}</strong></div>`).join("");
  }

  function renderOutfit() {
    const s = State.get();
    const sets = State.setCounts();
    const dominant = dominantSet();
    const weapon = D.items[s.equip.weapon];
    const chest = D.items[s.equip.chest];
    const acc = D.items[s.equip.acc] || D.items[s.equip.ring];
    const outfitNames = {
      "旅者": "旅者初装",
      "研究院": "灰烬研究装束",
      "夜潮": "夜潮断欲装束",
      "纪律": "冷钢风控装束",
      "深渊": "深渊行者装束"
    };
    const outfitDesc = {
      "旅者": "开局只装备基础旅者套，属性朴素，但能稳定启动最低行动。",
      "研究院": "研究院装备强化输出、数据库和PPT推进，是二级市场研究主线的核心成长。",
      "夜潮": "夜潮装备代表离屏、断欲、封存旧照片和削弱AI幻想入口。",
      "纪律": "冷钢纪律装备绑定复盘、仓位约束和限制看盘，用来压制市场先生。",
      "深渊": "深渊装备是高阶奖励，来自地图推进和Boss掉落，不会开局白送。"
    };
    el("outfitTitle").textContent = outfitNames[dominant] || "旅行者装束";
    el("outfitDesc").textContent = outfitDesc[dominant] || "当前装束会随装备和套装变化。";
    if (el("roleHeroImg")) setImage(el("roleHeroImg"), portraitForSet(dominant));
    const layer = layerForSet(dominant);
    if (el("gearLayerImg")) {
      setImage(el("gearLayerImg"), layer);
      el("gearLayerImg").classList.toggle("show", !!layer);
    }
    el("outfitAura").className = `outfitAura outfit-${dominant}`;
    el("outfitBadges").innerHTML = [
      ["武器", weapon?.name || "未装备"],
      ["胸甲", chest?.name || "未装备"],
      ["饰品", acc?.name || "未装备"],
      ["主套装", `${dominant} ${sets[dominant] || 0}件`]
    ].map(([k, v]) => `<span><small>${k}</small>${v}</span>`).join("");
  }

  function dominantSet() {
    const sets = State.setCounts();
    const advanced = Object.entries(sets).filter(([name, count]) => name !== "旅者" && count > 0);
    if (advanced.length) return advanced.sort((a, b) => b[1] - a[1])[0][0];
    return "旅者";
  }

  function portraitForSet(setName) {
    return setName === "深渊" ? "hero.png" : "hero_starter.png";
  }

  function layerForSet(setName) {
    return {
      "研究院": "layer_research.png",
      "夜潮": "layer_night.png",
      "纪律": "layer_discipline.png",
      "深渊": "layer_abyss.png"
    }[setName] || "";
  }

  function openEquip(slot) {
    const s = State.get();
    const sheet = el("equipSheet");
    const slotName = D.slots.find(([id]) => id === slot)?.[1] || slot;
    const items = Object.values(D.items).filter(item => item.slot === slot);
    sheet.innerHTML = `
      <div class="sheetHead">
        <h3>切换${slotName}</h3>
        <button class="iconBtn" id="closeEquip" aria-label="关闭">×</button>
      </div>
      <div class="sheetList">
        ${items.map(item => {
          const owned = s.inventory.includes(item.id);
          const equipped = s.equip[slot] === item.id;
          return `<article class="gearRow ${owned ? "" : "locked"}">
            <span class="itemIcon ${rarityClass(item.rarity)}">${item.icon}</span>
            <div>
              <strong>${item.name}</strong>
              <small class="${rarityClass(item.rarity)}">${item.rarity}｜${item.set}｜来源：${item.source}</small>
              <p>${item.meaning}</p>
            </div>
            <button class="smallBtn" data-equip="${item.id}" ${owned ? "" : "disabled"}>${equipped ? "已装备" : owned ? "装备" : "未解锁"}</button>
          </article>`;
        }).join("")}
      </div>`;
    el("equipModal").classList.add("show");
    el("closeEquip").addEventListener("click", closeEquip);
    sheet.querySelectorAll("[data-equip]").forEach(btn => {
      btn.addEventListener("click", () => {
        State.equip(slot, btn.dataset.equip);
        closeEquip();
      });
    });
  }

  function closeEquip() {
    el("equipModal").classList.remove("show");
  }

  function renderInventory() {
    const filters = [["all", "全部"], ...D.slots.map(([id, name]) => [id, name])];
    el("gearFilter").innerHTML = filters.map(([id, name]) => `<button class="${filter === id ? "is-active" : ""}" data-filter="${id}">${name}</button>`).join("");
    el("gearFilter").querySelectorAll("[data-filter]").forEach(btn => {
      btn.addEventListener("click", () => {
        filter = btn.dataset.filter;
        renderInventory();
      });
    });

    const s = State.get();
    const items = Object.values(D.items).filter(item => filter === "all" || item.slot === filter);
    el("gearGrid").innerHTML = items.map(item => {
      const owned = s.inventory.includes(item.id);
      const equipped = s.equip[item.slot] === item.id;
      const stats = Object.entries(item.stats).map(([k, v]) => `${statName(k)} +${v}`).join(" / ");
      return `<article class="gearCard ${owned ? "" : "locked"}">
        <div class="gearTop"><span class="itemIcon ${rarityClass(item.rarity)}">${item.icon}</span><div><strong>${item.name}</strong><small class="${rarityClass(item.rarity)}">${item.rarity}｜${item.set}</small></div></div>
        <p>${item.meaning}</p>
        <small>属性：${stats}</small>
        <small>来源：${item.source}</small>
        <button class="smallBtn" data-equip-card="${item.id}" ${owned ? "" : "disabled"}>${equipped ? "已装备" : owned ? "装备" : "未解锁"}</button>
      </article>`;
    }).join("");
    el("gearGrid").querySelectorAll("[data-equip-card]").forEach(btn => {
      btn.addEventListener("click", () => State.equip(D.items[btn.dataset.equipCard].slot, btn.dataset.equipCard));
    });
  }

  function statName(key) {
    return { research: "研究", resist: "抗性", market: "纪律", charm: "魅力", stability: "稳定" }[key] || key;
  }

  function renderDaily() {
    const d = State.get().daily;
    document.querySelectorAll("[data-daily]").forEach(input => {
      if (document.activeElement !== input) input.value = d[input.dataset.daily] ?? "";
    });
  }

  function renderBosses() {
    const s = State.get();
    el("bossList").innerHTML = D.bosses.map(b => {
      const hp = s.bossHp[b.id];
      return `<article class="bossCard talkCard" data-talk-type="boss" data-talk-id="${b.id}">
        <img src="${assetSrc(b.image)}" onerror="this.onerror=null;this.src='${fallbackSrc(b.image)}'" alt="${b.name}">
        <div>
          <div class="rowBetween"><h3>${b.name}</h3><strong>${Math.round(hp)} HP</strong></div>
          <div class="hp"><span style="width:${pct(hp)}"></span></div>
          <p>${b.problem}</p>
          <small>回血：${b.heal}</small>
          <small>掉血：${b.damage}</small>
          <small>掉落：${b.drop}</small>
          <button class="talkHint" type="button">交流</button>
        </div>
      </article>`;
    }).join("");
    el("bossList").querySelectorAll("[data-talk-id]").forEach(card => {
      card.addEventListener("click", () => openDialogue("boss", card.dataset.talkId));
    });
  }

  function renderMap() {
    const progress = State.get().mapProgress;
    el("mapGrid").innerHTML = D.mapNodes.map(node => {
      const value = progress[node.id] || 0;
      return `<article class="mapNode">
        <div class="mapOrb">${value}</div>
        <h3>${node.name}</h3>
        <p>${node.desc}</p>
        <small>奖励：${node.reward}</small>
        <div class="thinBar"><span style="width:${pct(value * 18)}"></span></div>
      </article>`;
    }).join("");
  }

  function renderNpcs() {
    el("npcList").innerHTML = D.npcs.map(npc => `<article class="npcCard talkCard" data-talk-type="npc" data-talk-id="${npc.id}">
      <img src="${assetSrc(npc.image)}" onerror="this.onerror=null;this.src='${fallbackSrc(npc.image)}'" alt="${npc.name}">
      <div><h3>${npc.name}</h3><p>${npc.role}</p><small>${npc.offer}</small><button class="talkHint" type="button">交流</button></div>
    </article>`).join("");
    el("npcList").querySelectorAll("[data-talk-id]").forEach(card => {
      card.addEventListener("click", () => openDialogue("npc", card.dataset.talkId));
    });
  }

  function openDialogue(type, id) {
    const source = type === "boss" ? D.bosses.find(x => x.id === id) : D.npcs.find(x => x.id === id);
    if (!source) return;
    const lines = source.dialogue || [source.offer || source.problem || "没有可用对话。"];
    el("dialogueSheet").innerHTML = `
      <div class="sheetHead">
        <h3>${source.name}</h3>
        <button class="iconBtn" id="closeDialogue" aria-label="关闭">×</button>
      </div>
      <div class="dialogueHero">
        <img src="${assetSrc(source.image)}" onerror="this.onerror=null;this.src='${fallbackSrc(source.image)}'" alt="${source.name}">
        <div>
          <strong>${type === "boss" ? "Boss交流" : "NPC委托"}</strong>
          <span>${type === "boss" ? source.problem : source.role}</span>
        </div>
      </div>
      <div class="dialogueLines">
        ${lines.map(line => `<p>${line}</p>`).join("")}
      </div>
      <div class="dialogueAdvice">${source.advice || source.offer || ""}</div>
      <div class="dialogueActions">
        <button class="primaryBtn" id="acceptDialogue">记入今日行动</button>
        <button class="smallBtn" id="closeDialogue2">稍后处理</button>
      </div>
    `;
    el("dialogueModal").classList.add("show");
    el("closeDialogue").addEventListener("click", closeDialogue);
    el("closeDialogue2").addEventListener("click", closeDialogue);
    el("acceptDialogue").addEventListener("click", () => {
      State.save(`${source.name}交流：${source.advice || source.offer || "已记录建议。"}`);
      showToast("已记入系统日志");
      closeDialogue();
    });
  }

  function closeDialogue() {
    el("dialogueModal").classList.remove("show");
  }

  function renderArchive() {
    const s = State.get();
    const records = s.archive.slice(0, 30);
    el("archiveList").innerHTML = records.length ? records.map(r => `<article class="archiveItem">
      <strong>${r.date}</strong>
      <span>${r.summary}</span>
      <small>RP ${signed(r.rp)} / SV ${signed(r.sv)} / 债务 ${signed(r.debt)} / 稳定 ${signed(r.stability)}</small>
      ${r.drops.length ? `<small>掉落：${r.drops.map(id => D.items[id]?.name || id).join("、")}</small>` : ""}
      ${r.note ? `<p>${r.note}</p>` : ""}
    </article>`).join("") : `<div class="empty">还没有日报结算记录。</div>`;
    el("logList").innerHTML = s.logs.slice(0, 40).map(x => `<div class="logItem">${x}</div>`).join("");
  }

  function signed(n) {
    return `${n >= 0 ? "+" : ""}${n}`;
  }

  function renderAll() {
    renderHome();
    renderRole();
    renderInventory();
    renderDaily();
    renderBosses();
    renderMap();
    renderNpcs();
    renderArchive();
  }

  function init() {
    el("equipModal").addEventListener("click", e => { if (e.target.id === "equipModal") closeEquip(); });
    el("dialogueModal").addEventListener("click", e => { if (e.target.id === "dialogueModal") closeDialogue(); });
    document.addEventListener("traveler:changed", renderAll);
    renderAll();
  }

  return { init, renderAll, showToast };
})();

