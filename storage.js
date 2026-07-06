window.TravelerStorage = (() => {
  const key = "traveleros22_progression_state";
  const oldKey = "traveleros20";

  function load() {
    const current = localStorage.getItem(key);
    if (current) return JSON.parse(current);

    const old = localStorage.getItem(oldKey);
    if (old) {
      try {
        const migrated = JSON.parse(old);
        migrated.version = "22-dev";
        migrated.archive = migrated.archive || [];
        migrated.daily = migrated.daily || {};
        migrated.bossHp = migrated.bossHp || {};
        return migrated;
      } catch (_) {}
    }
    return null;
  }

  function save(state) {
    localStorage.setItem(key, JSON.stringify(state));
  }

  function clear() {
    localStorage.removeItem(key);
  }

  function exportText(state) {
    return JSON.stringify(state, null, 2);
  }

  function importText(text) {
    const parsed = JSON.parse(text);
    save(parsed);
    return parsed;
  }

  return { load, save, clear, exportText, importText };
})();

