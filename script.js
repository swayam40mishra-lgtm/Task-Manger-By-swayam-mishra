document.addEventListener("DOMContentLoaded", () => { const routes = { "open-ai-module": "pages/muskan-ai.html", "open-tracker-module": "pages/tracker.html", "open-quiet-mode": "pages/quiet-mode.html", "open-shield-module": "pages/shield.html", };

Object.entries(routes).forEach(([id, target]) => { const element = document.getElementById(id);

if (!element) return;

element.addEventListener("click", (event) => {
  event.preventDefault();
  window.location.href = target;
});

}); });
