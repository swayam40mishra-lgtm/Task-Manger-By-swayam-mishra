// 🎬 START PROJECT (Landing → Loading → Error)

function startProject() {
    document.getElementById("landing").classList.add("hidden");
    document.getElementById("loading").classList.remove("hidden");

    const loadingText = document.getElementById("loadingText");

    const steps = [
        "Loading Project...",
        "Initializing Files...",
        "Decrypting Data...",
        "Almost There..."
    ];

    let i = 0;

    let interval = setInterval(() => {
        loadingText.innerText = steps[i];
        i++;

        if (i >= steps.length) {
            clearInterval(interval);

            setTimeout(() => {
                document.getElementById("loading").classList.add("hidden");
                document.getElementById("error").classList.remove("hidden");
            }, 1200);
        }
    }, 1500);
}


// 🎬 ERROR → MAIN REVEAL

function reveal() {
    document.getElementById("error").classList.add("hidden");
    document.getElementById("main").classList.remove("hidden");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// 🎬 SCROLL ANIMATION (Reveal sections gradually)

const sections = document.querySelectorAll(".section");

function revealOnScroll() {
    const triggerBottom = window.innerHeight * 0.85;

    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;

        if (sectionTop < triggerBottom) {
            section.classList.add("show");
        }
    });
}

window.addEventListener("scroll", revealOnScroll);


// 🎬 OPTIONAL: Slight delay on first load for smoothness

window.addEventListener("load", () => {
    setTimeout(() => {
        revealOnScroll();
    }, 300);
});
