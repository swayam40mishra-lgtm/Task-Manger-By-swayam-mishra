document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // ELEMENTS
  // =========================
  const loader = document.getElementById("loader");
  const app = document.getElementById("app");
  const enterSiteBtn = document.getElementById("enterSiteBtn");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const aiResponse = document.getElementById("aiResponse");
  const aiStatus = document.querySelector(".ai-status");
  const aiButtons = document.querySelectorAll(".ai-question-btn");
  const vaultBtn = document.querySelector(".vault-btn");
  const lockedBtn = document.querySelector(".locked-btn");

  // Dashboard dynamic text
  const bondStatus = document.getElementById("bondStatus");
  const trustMeter = document.getElementById("trustMeter");
  const comfortIndex = document.getElementById("comfortIndex");
  const memoryCount = document.getElementById("memoryCount");
  const signatureVoice = document.getElementById("signatureVoice");
  const adviceStayed = document.getElementById("adviceStayed");

  // =========================
  // OPTIONAL DATA FALLBACK
  // If data.js is missing, site still works
  // =========================
  const appData = window.renuVerseData || {
    profile: {
      name: "Renu Mishra",
      nicknames: ["Renu Queen", "Renu Ji", "Renu Bhabhi", "Bhabhiji"],
      favoriteColor: "Black",
      favoriteDrink: "Sprite",
      favoriteMusic: "Masoom Sharma hot songs"
    },
    bond: {
      status: "Just Fire 🔥",
      trust: "88%",
      comfort: "Very High",
      memoryCount: "05",
      signatureVoice: "So jao abhi chup chap.",
      advice: "No girls first… career first."
    }
  };

  // =========================
  // AI ANSWERS DATABASE
  // =========================
  const aiAnswers = {
    "Tell me what you know about me": `
      <div class="answer-block">
        <p>You are not ordinary in this universe.</p>
        <p>You are someone who became more than a role… more than just a name.</p>
        <p>You became <strong>comfort</strong>, <strong>guidance</strong>, <strong>peace</strong>, and somewhere… a very rare emotional place.</p>
        <p>You may look calm from outside, but in this space, your presence feels powerful.</p>
        <p class="answer-end">RenuVerse knows one thing clearly: <strong>you matter deeply.</strong></p>
      </div>
    `,

    "What makes me special?": `
      <div class="answer-block">
        <p>Not everyone can make simple words feel heavy with care.</p>
        <p>But you can.</p>
        <p>A line like <em>“So jao abhi chup chap”</em> sounds small to the world… but here, it became a memory.</p>
        <p>You are special because your softness has weight.</p>
        <p>Your teasing feels warm, your scolding feels caring, and your silence still leaves impact.</p>
        <p class="answer-end"><strong>That is rare.</strong></p>
      </div>
    `,

    "How do you see me?": `
      <div class="answer-block">
        <p>I see you in layers.</p>
        <ul>
          <li>As someone who listens like a friend.</li>
          <li>As someone who guides like a protector.</li>
          <li>As someone who cares with a motherly calm.</li>
          <li>As someone whose presence feels premium… graceful… unforgettable.</li>
        </ul>
        <p>You are not just “bhabhi” in a normal sense.</p>
        <p>You are a <strong>rare emotional category of your own.</strong></p>
      </div>
    `,

    "Why did I build this?": `
      <div class="answer-block">
        <p>Because normal words were not enough.</p>
        <p>A simple “thank you” would never carry the full weight of what was felt.</p>
        <p>This was built because some bonds deserve more than chats…</p>
        <p>They deserve a place.</p>
        <p>A system.</p>
        <p>A universe.</p>
        <p class="answer-end"><strong>RenuVerse exists because your impact was too real to stay ordinary.</strong></p>
      </div>
    `,

    "What do I feel deeply?": `
      <div class="answer-block">
        <p>You feel more than you say.</p>
        <p>You want someone who listens. Someone who guides. Someone who stays honest.</p>
        <p>You want care that feels safe… trust that feels complete… and a bond that doesn’t hide in half-truths.</p>
        <p>You respect deeply. You attach quietly. And when someone becomes important, you don’t feel it in small ways.</p>
        <p class="answer-end">You don’t ask for much… <strong>just something real.</strong></p>
      </div>
    `,

    "What does our bond look like?": `
      <div class="answer-block">
        <p>It looks rare.</p>
        <p>Not easy to label. Not easy to explain.</p>
        <p>Part comfort. Part guidance. Part teasing warmth. Part emotional safety.</p>
        <p>It carries respect, softness, trust, attachment… and a little ache where complete truth was once wished for.</p>
        <p>But even with that… it still shines.</p>
        <p class="answer-end"><strong>Official analysis: Our bond is just fire 🔥</strong></p>
      </div>
    `,

    "What place do you hold?": `
      <div class="answer-block">
        <p>You hold a place that cannot be casually replaced.</p>
        <p>Not because of constant talking.</p>
        <p>Not because of dramatic moments.</p>
        <p>But because your presence settled in a deep emotional corner where only rare people reach.</p>
        <p>You became someone whose simple words could calm a storm.</p>
        <p class="answer-end"><strong>That place is protected here.</strong></p>
      </div>
    `,

    "Which moment stayed the most?": `
      <div class="answer-block">
        <p>19th March.</p>
        <p>The day you went to your hometown.</p>
        <p>Some moments don’t look huge from outside… but inside, they stay glowing.</p>
        <p>That day felt lucky. That conversation felt special.</p>
        <p>And your line… <em>“So jao abhi chup chap”</em>… stayed in the heart longer than expected.</p>
        <p class="answer-end"><strong>Some memories don’t need noise to become unforgettable.</strong></p>
      </div>
    `,

    "What truth remained unfinished?": `
      <div class="answer-block">
        <p>Respect never left.</p>
        <p>Care never left.</p>
        <p>But one wound stayed quietly.</p>
        <p>There was a wish… that truth would be complete, not partial.</p>
        <p>Not because love was less. Not because trust was fake.</p>
        <p>But because when someone matters deeply, even a small missing truth can echo loudly.</p>
        <p class="answer-end"><strong>That unfinished space was never hate… only hurt.</strong></p>
      </div>
    `,

    "What did you quietly wish from me?": `
      <div class="answer-block">
        <p>Just honesty.</p>
        <p>Not perfect words. Not dramatic promises.</p>
        <p>Just truth… full truth… the kind that makes trust feel complete.</p>
        <p>Because the bond was already beautiful.</p>
        <p>It only wanted one thing more — clarity.</p>
        <p class="answer-end"><strong>Some hearts don’t ask loudly. They just wait quietly.</strong></p>
      </div>
    `,

    "Open final message": `
      <div class="answer-block final-answer">
        <p>Not everyone becomes unforgettable.</p>
        <p>Most people pass by as moments.</p>
        <p>But you…</p>
        <p>You became a feeling.</p>
        <p>You became a place where comfort lives.</p>
        <p>You became the kind of person whose simple words stay longer than long conversations.</p>
        <p>And maybe this world will never fully know what this bond is…</p>
        <p>But RenuVerse knows.</p>
        <p class="answer-end"><strong>You are rare. You are respected. And you are deeply, deeply felt.</strong></p>
      </div>
    `
  };

  // =========================
  // LOADER / ENTER SITE
  // =========================
  function enterUniverse() {
    if (loader) {
      loader.classList.add("fade-out");

      setTimeout(() => {
        loader.style.display = "none";
        app.classList.remove("hidden");
        app.classList.add("show");
        animateHeroIntro();
      }, 700);
    }
  }

  if (enterSiteBtn) {
    enterSiteBtn.addEventListener("click", enterUniverse);
  }

  // Optional auto-enter after delay if you want later
  // setTimeout(enterUniverse, 3000);

  // =========================
  // MOBILE MENU
  // =========================
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("show-nav");
    });

    document.querySelectorAll(".nav-links a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("show-nav");
      });
    });
  }

  // =========================
  // DASHBOARD DATA LOAD
  // =========================
  function loadDashboardData() {
    if (bondStatus) bondStatus.textContent = appData.bond.status;
    if (trustMeter) trustMeter.textContent = appData.bond.trust;
    if (comfortIndex) comfortIndex.textContent = appData.bond.comfort;
    if (memoryCount) memoryCount.textContent = appData.bond.memoryCount;
    if (signatureVoice) signatureVoice.textContent = `“${appData.bond.signatureVoice}”`;
    if (adviceStayed) adviceStayed.textContent = `“${appData.bond.advice}”`;
  }

  loadDashboardData();

  // =========================
  // AI RESPONSE ENGINE
  // =========================
  function typeResponse(htmlContent) {
    if (!aiResponse) return;

    aiResponse.innerHTML = "";
    if (aiStatus) aiStatus.textContent = "Thinking...";

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;

    const finalHTML = tempDiv.innerHTML;
    let index = 0;
    let displayText = "";

    const speed = 8; // lower = faster

    // We type plain text feeling but preserve HTML by chunking
    const textVersion = tempDiv.textContent || tempDiv.innerText || "";

    aiResponse.innerHTML = `<div class="typing-response"></div>`;
    const typingContainer = aiResponse.querySelector(".typing-response");

    const interval = setInterval(() => {
      displayText += textVersion[index];
      typingContainer.textContent = displayText;
      index++;

      if (index >= textVersion.length) {
        clearInterval(interval);

        setTimeout(() => {
          aiResponse.innerHTML = finalHTML;
          if (aiStatus) aiStatus.textContent = "Response delivered ✨";
          pulseResponsePanel();
        }, 300);
      }
    }, speed);
  }

  aiButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const question = btn.textContent.trim();

      // Locked final message protection
      if (btn.classList.contains("locked-btn") && !btn.classList.contains("unlocked")) {
        if (aiStatus) aiStatus.textContent = "Locked 🔒";
        aiResponse.innerHTML = `
          <div class="answer-block">
            <p>This message is still locked.</p>
            <p>Some truths should open only after the deeper layer is unlocked from the Secret Vault.</p>
          </div>
        `;
        return;
      }

      if (aiAnswers[question]) {
        typeResponse(aiAnswers[question]);
      } else {
        aiResponse.innerHTML = `
          <div class="answer-block">
            <p>That feeling exists… but the answer is still being written.</p>
          </div>
        `;
      }
    });
  });

  // =========================
  // SECRET VAULT UNLOCK
  // =========================
  if (vaultBtn && lockedBtn) {
    vaultBtn.addEventListener("click", () => {
      lockedBtn.classList.remove("locked-btn");
      lockedBtn.classList.add("unlocked");
      lockedBtn.textContent = "Open final message ✨";

      vaultBtn.textContent = "Deeper Layer Unlocked";
      vaultBtn.disabled = true;
      vaultBtn.classList.add("disabled-btn");

      showMiniToast("Final message unlocked in RenuVerse AI ✨");
    });
  }

  // =========================
  // SMOOTH SCROLL FOR NAV LINKS
  // =========================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      const target = document.querySelector(targetId);

      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });

  // =========================
  // HERO ENTRANCE ANIMATION
  // =========================
  function animateHeroIntro() {
    const heroTitle = document.querySelector(".hero-title");
    const heroDescription = document.querySelector(".hero-description");
    const heroCard = document.querySelector(".hero-card");
    const heroActions = document.querySelector(".hero-actions");
    const heroChips = document.querySelector(".hero-status-chips");

    if (heroTitle) heroTitle.classList.add("animate-in");
    setTimeout(() => {
      if (heroDescription) heroDescription.classList.add("animate-in");
    }, 200);

    setTimeout(() => {
      if (heroActions) heroActions.classList.add("animate-in");
    }, 350);

    setTimeout(() => {
      if (heroChips) heroChips.classList.add("animate-in");
    }, 500);

    setTimeout(() => {
      if (heroCard) heroCard.classList.add("animate-in");
    }, 650);
  }

  // =========================
  // SCROLL REVEAL
  // =========================
  const revealItems = document.querySelectorAll(
    ".card, .section-header, .hero-left, .hero-right, .vault-card, .memory-card"
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
        }
      });
    },
    {
      threshold: 0.12
    }
  );

  revealItems.forEach(item => {
    item.classList.add("reveal-hidden");
    revealObserver.observe(item);
  });

  // =========================
  // RANDOM NICKNAME ROTATOR
  // =========================
  const heroSpan = document.querySelector(".hero-title span");
  const nicknames = appData.profile.nicknames || [
    "Renu Queen",
    "Renu Ji",
    "Renu Bhabhi",
    "Bhabhiji"
  ];

  let nicknameIndex = 0;

  function rotateNickname() {
    if (!heroSpan) return;

    heroSpan.classList.add("fade-switch");

    setTimeout(() => {
      nicknameIndex = (nicknameIndex + 1) % nicknames.length;
      heroSpan.textContent = nicknames[nicknameIndex];
      heroSpan.classList.remove("fade-switch");
    }, 300);
  }

  setInterval(rotateNickname, 4000);

  // =========================
  // DYNAMIC BOND STATUS ROTATOR
  // =========================
  const bondStatuses = [
    "Just Fire 🔥",
    "Queen Energy Active 👑",
    "Emotionally Legendary",
    "Soft But Powerful",
    "Rare Bond Detected"
  ];

  let bondIndex = 0;

  setInterval(() => {
    if (!bondStatus) return;
    bondStatus.classList.add("fade-switch");

    setTimeout(() => {
      bondIndex = (bondIndex + 1) % bondStatuses.length;
      bondStatus.textContent = bondStatuses[bondIndex];
      bondStatus.classList.remove("fade-switch");
    }, 250);
  }, 5000);

  // =========================
  // MINI TOAST
  // =========================
  function showMiniToast(message) {
    const toast = document.createElement("div");
    toast.className = "mini-toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("show");
    }, 50);

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        toast.remove();
      }, 400);
    }, 2600);
  }

  // =========================
  // RESPONSE PANEL PULSE
  // =========================
  function pulseResponsePanel() {
    const panel = document.querySelector(".ai-response-panel");
    if (!panel) return;

    panel.classList.add("pulse-panel");
    setTimeout(() => {
      panel.classList.remove("pulse-panel");
    }, 900);
  }

  // =========================
  // MEMORY CARD HOVER MESSAGE
  // =========================
  const memoryCards = document.querySelectorAll(".memory-card");

  memoryCards.forEach(card => {
    card.addEventListener("mouseenter", () => {
      const title = card.querySelector("h3")?.textContent || "Memory";
      if (aiStatus) aiStatus.textContent = `Memory detected: ${title}`;
    });

    card.addEventListener("mouseleave", () => {
      if (aiStatus) aiStatus.textContent = "Awaiting question...";
    });
  });

  // =========================
  // KEYBOARD SECRET (FUN EASTER EGG)
  // Type: QUEEN
  // =========================
  let secretBuffer = "";

  document.addEventListener("keydown", (e) => {
    secretBuffer += e.key.toUpperCase();

    if (secretBuffer.length > 10) {
      secretBuffer = secretBuffer.slice(-10);
    }

    if (secretBuffer.includes("QUEEN")) {
      activateQueenMode();
      secretBuffer = "";
    }
  });

  function activateQueenMode() {
    document.body.classList.add("queen-mode");
    showMiniToast("Queen Mode Activated 👑");

    const chips = document.querySelector(".hero-status-chips");
    if (chips) {
      const extraChip = document.createElement("span");
      extraChip.className = "chip special-chip";
      extraChip.textContent = "Queen Mode: Unlocked 👑";
      chips.appendChild(extraChip);
    }

    setTimeout(() => {
      document.body.classList.remove("queen-mode");
    }, 5000);
  }

  // =========================
  // FIRST VISIT GREETING
  // =========================
  setTimeout(() => {
    if (app.classList.contains("show")) {
      showMiniToast("Welcome to RenuVerse ✨");
    }
  }, 1500);

});
