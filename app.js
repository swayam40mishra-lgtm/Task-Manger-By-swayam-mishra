document.addEventListener("DOMContentLoaded", () => {

    /* ======================================================
       ROUTES
       ====================================================== */

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

    /* ======================================================
       HELPERS
       ====================================================== */

    const MS_PER_DAY = 24 * 60 * 60 * 1000;
    const START_DATE = new Date(2026, 4, 13); // 13 May 2026, local time

    const HOME_QUOTES = [
        "Built around you.",
        "You never have to carry everything alone.",
        "Some days are softer, and that is okay.",
        "A small space can hold a lot of care.",
        "One tap away is still close."
    ];

    const TODAY_NOTES = [
        "A quiet pace still counts as progress.",
        "Soft days matter too.",
        "You do not need to prove anything today.",
        "Little steps are still steps.",
        "You can move gently today."
    ];

    const REMINDERS = [
        "Take Medicine",
        "Attend Lecture",
        "Complete DPP"
    ];

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function getGreeting(date = new Date()) {
        const hour = date.getHours();

        if (hour >= 5 && hour < 12) return "Good Morning";
        if (hour >= 12 && hour < 17) return "Good Afternoon";
        return "Good Evening";
    }

    function formatDashboardDate(date = new Date()) {
        const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
        const day = date.toLocaleDateString("en-US", { day: "numeric" });
        const month = date.toLocaleDateString("en-US", { month: "long" });
        const year = date.toLocaleDateString("en-US", { year: "numeric" });

        return `${weekday} • ${day} ${month} ${year}`;
    }

    function getDaysTogether(date = new Date()) {
        const today = new Date(date);
        today.setHours(0, 0, 0, 0);

        const start = new Date(START_DATE);
        start.setHours(0, 0, 0, 0);

        const diff = Math.floor((today.getTime() - start.getTime()) / MS_PER_DAY);

        // Inclusive count from the start date
        return Math.max(1, diff + 1);
    }

    function getDailyIndex(date = new Date(), length = 1) {
        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);
        const seed = Math.floor(dayStart.getTime() / MS_PER_DAY);
        return Math.abs(seed) % length;
    }

    function pickDailyItem(items, date = new Date()) {
        return items[getDailyIndex(date, items.length)];
    }

    function setText(el, text) {
        if (!el) return;
        el.textContent = text;
    }

    function collapseSection(sectionEl) {
        if (!sectionEl) return;

        sectionEl.style.transition = "opacity 0.25s ease, transform 0.25s ease, max-height 0.25s ease, margin 0.25s ease, padding 0.25s ease";
        sectionEl.style.overflow = "hidden";
        sectionEl.style.maxHeight = "0px";
        sectionEl.style.opacity = "0";
        sectionEl.style.transform = "translateY(-8px)";
        sectionEl.style.marginBottom = "0";
        sectionEl.style.paddingTop = "0";
        sectionEl.style.paddingBottom = "0";
        sectionEl.style.pointerEvents = "none";

        setTimeout(() => {
            sectionEl.style.display = "none";
        }, 280);
    }

    function styleTypedParagraph(p) {
        p.style.margin = "0";
        p.style.lineHeight = "1.95";
        p.style.opacity = "0.98";
    }

    async function typeWords(target, text, speed = 34) {
        if (!target) return;

        const words = String(text).trim().split(/\s+/).filter(Boolean);
        target.textContent = "";

        for (let i = 0; i < words.length; i++) {
            target.textContent += (i === 0 ? "" : " ") + words[i];
            await wait(speed + Math.floor(Math.random() * 14));
        }
    }

    async function typeParagraphs(container, paragraphs, options = {}) {
        if (!container) return;

        const {
            wordDelay = 34,
            paragraphDelay = 320
        } = options;

        container.innerHTML = "";

        for (let i = 0; i < paragraphs.length; i++) {
            const p = document.createElement("p");
            styleTypedParagraph(p);
            container.appendChild(p);

            await typeWords(p, paragraphs[i], wordDelay);

            if (i < paragraphs.length - 1) {
                await wait(paragraphDelay);
            }
        }
    }

    function setQuietStatus(text) {
        const status = document.querySelector(".quiet-status p");
        if (status) status.textContent = text;
    }

    function setShieldPromise(text) {
        const promise = document.querySelector(".shield-promise p");
        if (promise) promise.textContent = text;
    }

    /* ======================================================
       HOME DASHBOARD
       ====================================================== */

    function updateHomeDashboard() {
        const now = new Date();
        const greeting = getGreeting(now);
        const dateText = formatDashboardDate(now);
        const daysTogether = getDaysTogether(now);
        const quote = pickDailyItem(HOME_QUOTES, now);
        const dailyNote = pickDailyItem(TODAY_NOTES, now);

        setText(document.getElementById("greeting"), greeting);

        const dashboardCards = document.querySelectorAll(".dashboard .dashboard-card");

        // Card 1: Greeting + date
        if (dashboardCards[0]) {
            const h3 = dashboardCards[0].querySelector("h3");
            const p = dashboardCards[0].querySelector("p");

            if (h3) h3.textContent = `👋 ${greeting}, Muskan`;
            if (p) p.textContent = dateText;
        }

        // Card 2: Days together
        if (dashboardCards[1]) {
            const h3 = dashboardCards[1].querySelector("h3");
            const h2 = dashboardCards[1].querySelector("h2");
            const p = dashboardCards[1].querySelector("p");

            if (h3) h3.textContent = "❤️ Days Together";
            if (h2) h2.textContent = `${daysTogether} Days`;
            if (p) p.textContent = "Since 13 May 2026";
        }

        // Card 3: Personal quote
        if (dashboardCards[2]) {
            const h3 = dashboardCards[2].querySelector("h3");
            const p = dashboardCards[2].querySelector("p");

            if (h3) h3.textContent = "💭 Personal Quote";
            if (p) p.textContent = quote;
        }

        // Card 4: Personal reminders
        if (dashboardCards[3]) {
            const h3 = dashboardCards[3].querySelector("h3");
            const items = dashboardCards[3].querySelectorAll("li");

            if (h3) h3.textContent = "📝 Personal Reminders";

            items.forEach((item, index) => {
                if (REMINDERS[index]) {
                    item.textContent = `□ ${REMINDERS[index]}`;
                }
            });
        }

        // Card 5: System status
        if (dashboardCards[4]) {
            const h3 = dashboardCards[4].querySelector("h3");
            const lines = dashboardCards[4].querySelectorAll("p");

            if (h3) h3.textContent = "🛡 System Status";

            const systemLines = [
                "🤖 Muskan AI — Ready",
                "🛰️ Swayam Tracker — Active",
                "🛡️ Shield — Protected",
                "🌙 Quiet Mode — Available"
            ];

            lines.forEach((line, index) => {
                if (systemLines[index]) {
                    line.textContent = systemLines[index];
                }
            });
        }

        // Today section
        const todayParagraph = document.querySelector(".today p");
        if (todayParagraph) {
            todayParagraph.innerHTML = `Take your time.<br>${dailyNote}`;
        }

        // Make the page feel alive when opened
        if (document.querySelector(".container")) {
            document.title = `Muskan • ${greeting}`;
        }
    }

    updateHomeDashboard();
    setInterval(updateHomeDashboard, 60 * 1000);

    /* ======================================================
       QUIET MODE
       ====================================================== */

    const migraineBtn = document.getElementById("migraine-btn");
    const periodBtn = document.getElementById("period-btn");
    const quietActions = document.getElementById("quiet-actions");
    const quietResponseBox = document.getElementById("ai-response");
    const quietAiBox = document.getElementById("muskan-ai-box");

    const quietMessages = {
        migraine: [
            "Hey baccha... ❤️",
            "I received your migraine update.",
            "Notification has already been sent to Swayam, so you need not reply immediately.",
            "I'm sorry you're going through this right now. Just know that you're not alone.",
            "Everything else can wait. Right now, your comfort matters most.",
            "Take rest, baccha. 🤍"
        ],
        period: [
            "Baccha... 💖",
            "I saw your update.",
            "Notification has already been sent to Swayam, so you don't need to reply immediately.",
            "For now, just focus on yourself. I'm here with you.",
            "I know periods can be uncomfortable and exhausting sometimes. Be gentle with yourself today.",
            "Take rest, baccha. 🌷"
        ]
    };

    let quietBusy = false;

    async function runQuietMode(type) {
        if (quietBusy) return;
        quietBusy = true;

        setQuietStatus("✓ Alert sent to Swayam ❤️");

        collapseSection(quietActions);

        if (quietAiBox) {
            quietAiBox.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }

        await wait(250);

        if (quietResponseBox) {
            await typeParagraphs(quietResponseBox, quietMessages[type], {
                wordDelay: 32,
                paragraphDelay: 360
            });
        }

        quietBusy = false;
    }

    if (migraineBtn) {
        migraineBtn.addEventListener("click", () => runQuietMode("migraine"));
    }

    if (periodBtn) {
        periodBtn.addEventListener("click", () => runQuietMode("period"));
    }

    /* ======================================================
       MUSKAN SHIELD
       ====================================================== */

    const shieldBtn = document.getElementById("shield-btn");
    const shieldAction = document.getElementById("shield-action");
    const shieldResponseBox = document.getElementById("shield-response");

    const shieldMessages = [
        "Hey baccha... ❤️",
        "I know things may feel overwhelming right now, but please remember this:",
        "You are not alone.",
        "Swayam has already been notified and he knows you need him. Help is on the way.",
        "You don't need to type, explain, or respond right now.",
        "Just hold on, baccha. Someone who cares about you has already been alerted.",
        "I'm here with you. 🤍"
    ];

    let shieldBusy = false;

    async function runShieldMode() {
        if (shieldBusy) return;
        shieldBusy = true;

        if (shieldBtn) {
            shieldBtn.innerHTML = `
                <span class="shield-icon">✓</span>
                <span class="shield-text">ALERT SENT</span>
            `;
            shieldBtn.disabled = true;
        }

        setShieldPromise("✓ Alert sent to Swayam • Someone is already on your side.");

        collapseSection(shieldAction);

        if (shieldResponseBox?.parentElement) {
            shieldResponseBox.parentElement.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }

        await wait(250);

        if (shieldResponseBox) {
            await typeParagraphs(shieldResponseBox, shieldMessages, {
                wordDelay: 32,
                paragraphDelay: 360
            });
        }

        shieldBusy = false;
    }

    if (shieldBtn) {
        shieldBtn.addEventListener("click", runShieldMode);
    }

});
