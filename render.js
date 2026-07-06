window.TravelerActions = (() => {
  const State = window.TravelerState;
  const Store = window.TravelerStorage;

  function bindTabs() {
    document.querySelectorAll("[data-tab]").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("[data-tab]").forEach(b => b.classList.remove("is-active"));
        document.querySelectorAll(".page").forEach(p => p.classList.remove("is-active"));
        btn.classList.add("is-active");
        document.getElementById(`page-${btn.dataset.tab}`).classList.add("is-active");
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
  }

  function bindDailyForm() {
    document.querySelectorAll("[data-daily]").forEach(input => {
      input.addEventListener("input", () => State.updateDaily(input.dataset.daily, input.value));
    });
  }

  function bindGlobalActions() {
    document.getElementById("saveBtn").addEventListener("click", () => State.save("手动保存。"));
    document.getElementById("rescueBtn").addEventListener("click", () => {
      const task = State.rescue();
      document.getElementById("rescueTask").textContent = task;
    });
    document.getElementById("settleBtn").addEventListener("click", () => {
      const record = State.settleDaily();
      window.TravelerRender.showToast(`结算完成：${record.summary}`);
    });
    document.getElementById("exportBtn").addEventListener("click", () => {
      document.getElementById("saveText").value = Store.exportText(State.get());
    });
    document.getElementById("importBtn").addEventListener("click", () => {
      const text = document.getElementById("saveText").value.trim();
      if (!text) return;
      try {
        State.replace(Store.importText(text));
      } catch (err) {
        window.TravelerRender.showToast("导入失败：存档文本格式不正确");
      }
    });
    document.getElementById("resetBtn").addEventListener("click", () => {
      if (confirm("确认重置 TravelerOS 本地存档？")) State.reset();
    });
  }

  function init() {
    bindTabs();
    bindDailyForm();
    bindGlobalActions();
  }

  return { init };
})();
