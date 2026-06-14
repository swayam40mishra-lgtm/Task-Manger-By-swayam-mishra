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
/* =========================
   QUIET MODE
   ========================= */

document.addEventListener("DOMContentLoaded", () => {

    const migraineBtn = document.getElementById("migraine-btn");
    const periodBtn = document.getElementById("period-btn");
    const responseBox = document.getElementById("ai-response");

    if (migraineBtn && responseBox) {

        migraineBtn.addEventListener("click", () => {

            responseBox.innerHTML = `
                <p>
                    <strong>Swayam has been alerted.</strong>
                    <br><br>
                    No need to reply immediately.
                    <br><br>
                    Drink some water.
                    Reduce screen brightness.
                    Try resting in a quiet place.
                    <br><br>
                    Your only task right now is to take care of yourself.
                </p>
            `;

        });

    }

    if (periodBtn && responseBox) {

        periodBtn.addEventListener("click", () => {

            responseBox.innerHTML = `
                <p>
                    <strong>Swayam has been alerted.</strong>
                    <br><br>
                    No need to explain anything.
                    <br><br>
                    Take things slowly today.
                    Rest whenever possible.
                    Stay hydrated.
                    <br><br>
                    You are allowed to have an easy day.
                </p>
            `;

        });

    }

});
/* =========================
   MUSKAN SHIELD
   ========================= */

document.addEventListener("DOMContentLoaded", () => {

    const shieldBtn = document.getElementById("shield-btn");
    const shieldResponse = document.getElementById("shield-response");

    if (shieldBtn && shieldResponse) {

        shieldBtn.addEventListener("click", () => {

            shieldBtn.innerHTML = `
                <span class="shield-icon">
                    ✓
                </span>

                <span class="shield-text">
                    ALERT<br>
                    SENT
                </span>
            `;

            shieldBtn.disabled = true;

            shieldResponse.innerHTML = `
                <p>
                    <strong>Swayam has been alerted.</strong>
                    <br><br>
                    Your current location and device status have been prepared for sharing.
                    <br><br>
                    If possible, move to a safe place.
                    Stay calm.
                    <br><br>
                    Help is on the way.
                </p>
            `;

        });

    }

});
            
