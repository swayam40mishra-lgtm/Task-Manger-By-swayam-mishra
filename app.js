document.addEventListener("DOMContentLoaded", () => {

    const routes = {
        "open-ai-module": "muskan-ai.html",
        "open-tracker-module": "tracker.html",
        "open-quiet-mode": "quiet-mode.html",
        "open-shield-module": "shield.html"
    };

    Object.entries(routes).forEach(([id, page]) => {

        const button = document.getElementById(id);

        if (!button) return;

        button.addEventListener("click", (e) => {

            e.preventDefault();

            window.location.href = page;

        });

    });

});
