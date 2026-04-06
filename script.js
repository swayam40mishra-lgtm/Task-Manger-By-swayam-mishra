// =========================
// SCREEN REFERENCES
// =========================
const introScreen = document.getElementById("introScreen");
const bootScreen = document.getElementById("bootScreen");
const chatScreen = document.getElementById("chatScreen");

const enterUniverseBtn = document.getElementById("enterUniverseBtn");
const bootLines = document.getElementById("bootLines");

const chatMessages = document.getElementById("chatMessages");
const chipsWrap = document.getElementById("chipsWrap");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

const unlockBanner = document.getElementById("unlockBanner");
const connectionLevel = document.getElementById("connectionLevel");

const finalOverlay = document.getElementById("finalOverlay");
const finalLines = document.getElementById("finalLines");
const backToChatBtn = document.getElementById("backToChatBtn");
const inputWrap = document.getElementById("inputWrap");

// =========================
// STATE
// =========================
let hiddenMemoryIndex = 0;
let meaningfulInteractions = 0;
let unlockShown = false;

const levels = [
  "Connection: Noticed",
  "Connection: Remembered",
  "Connection: Cherished",
  "Connection: Unforgettable"
];

// =========================
// BOOT SEQUENCE
// =========================
const bootSequence = [
  "Loading memory core…",
  "Opening emotional archive…",
  "Reading moments that became unforgettable…",
  "Matching identity…",
  "Identity confirmed: Renu Mishra ❤️",
  "RenuVerse is ready."
];

// =========================
// RESPONSE BANK
// =========================
const hiddenMemories = [
  `Hidden Memory Unlocked…

It was never only the big moments that stayed with me.

Sometimes the smallest thing became the most unforgettable —
like the way you still replied even when life kept you busy.

That may have felt ordinary to you.
To me, it never was.`,

  `Hidden Memory Unlocked…

Some people don’t realize when they become special.

It doesn’t happen in one dramatic second.

It happens in little moments…
a reply, a smile, a tone, a small kindness —
and one day you realize they quietly became important.`,

  `Hidden Memory Unlocked…

One of the things I remember most is not just what you said…

It’s how you made things feel lighter.

That kind of presence is rare.
And the rare things are the ones people remember longest.`
];

const routes = {
  begin: {
    text: `If I had to trace the beginning…

It started with little moments that didn’t look important at first…
but somehow, they became unforgettable.

Some stories don’t begin loudly.
They begin softly…
and still become special.`,
    memoryCard: {
      title: "Memory Timeline Unlocked",
      items: [
        "5 March — I noticed you for the first time",
        "8 March — You texted me for the first time",
        "11 March — We met twice",
        "12 March — We talked in person for the first time",
        "Your first word to me was: “Hello”",
        "5 April — It had already become 25 days of something I knew I would remember"
      ]
    }
  },

  special: {
    text: `What makes you special isn’t one big thing.

It’s the quiet way you care.

The way you still reply, even when life keeps you busy.
The way you make people feel heard.
The way your patience feels like comfort.
The way your presence makes things lighter.

That kind of warmth is rare.
And rare things are never forgotten.`
  },

  purpose: {
    text: `Because normal messages felt too small.

Because some people deserve effort…
not just words.

Because I didn’t want appreciation to disappear in a simple chat.

I wanted to build something you could feel.

Some people receive texts.
You deserved a universe.`
  },

  meaning: {
    text: `You entered my life as my bhabhi…

But that was never the whole story.

To me, you became:
• a safe person
• a calm presence
• someone I deeply respect
• someone I can talk to
• someone whose kindness I never forget

Some people become family by relation.
Some become special by heart.

You became both.`
  },

  hidden: {
    text: "" // dynamic from hiddenMemories
  },

  final: {
    text: `There are some things better felt than explained.

I think… this is one of them.`
  }
};

// =========================
// HELPERS
// =========================
function switchScreen(showEl) {
  [introScreen, bootScreen, chatScreen].forEach(screen => {
    screen.classList.remove("active");
  });
  showEl.classList.add("active");
}

function addMessage(text, sender = "bot", memoryCard = null) {
  const row = document.createElement("div");
  row.className = `message-row ${sender}`;

  const bubble = document.createElement("div");
  bubble.className = "message-bubble";
  bubble.textContent = text;

  if (memoryCard && sender === "bot") {
    const card = document.createElement("div");
    card.className = "memory-card";

    const title = document.createElement("h4");
    title.textContent = memoryCard.title;

    const list = document.createElement("ul");
    memoryCard.items.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item;
      list.appendChild(li);
    });

    card.appendChild(title);
    card.appendChild(list);
    bubble.appendChild(card);
  }

  row.appendChild(bubble);
  chatMessages.appendChild(row);
  scrollToBottom();
}

function addTyping() {
  const row = document.createElement("div");
  row.className = "message-row bot";
  row.id = "typingRow";

  const bubble = document.createElement("div");
  bubble.className = "message-bubble";

  const typing = document.createElement("div");
  typing.className = "typing";
  typing.innerHTML = "<span></span><span></span><span></span>";

  bubble.appendChild(typing);
  row.appendChild(bubble);
  chatMessages.appendChild(row);
  scrollToBottom();
}

function removeTyping() {
  const typingRow = document.getElementById("typingRow");
  if (typingRow) typingRow.remove();
}

function scrollToBottom() {
  setTimeout(() => {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 50);
}

function botReply(text, memoryCard = null, isMeaningful = true) {
  addTyping();

  setTimeout(() => {
    removeTyping();
    addMessage(text, "bot", memoryCard);

    if (isMeaningful) {
      meaningfulInteractions++;
      updateConnectionLevel();
      maybeUnlockHiddenChapter();
    }
  }, 900);
}

function normalize(text) {
  return text.trim().toLowerCase();
}

function updateConnectionLevel() {
  if (meaningfulInteractions >= 5) {
    connectionLevel.textContent = levels[3];
  } else if (meaningfulInteractions >= 3) {
    connectionLevel.textContent = levels[2];
  } else if (meaningfulInteractions >= 1) {
    connectionLevel.textContent = levels[1];
  } else {
    connectionLevel.textContent = levels[0];
  }
}

function maybeUnlockHiddenChapter() {
  if (!unlockShown && meaningfulInteractions >= 4) {
    unlockShown = true;
    unlockBanner.classList.remove("hidden");
  }
}

function getHiddenMemory() {
  const memory = hiddenMemories[hiddenMemoryIndex];
  hiddenMemoryIndex = (hiddenMemoryIndex + 1) % hiddenMemories.length;
  return memory;
}

// =========================
// ROUTE MATCHING
// =========================
function handleUserMessage(rawInput) {
  const input = normalize(rawInput);

  // User message on screen
  addMessage(rawInput, "user");

  // FINAL route
  if (
    input.includes("one last message") ||
    input.includes("last message") ||
    input.includes("final message")
  ) {
    botReply(routes.final.text, null, true);
    setTimeout(() => {
      showFinalOverlay();
    }, 1500);
    return;
  }

  // MAIN ROUTES
  if (
    input.includes("how did it all begin") ||
    input.includes("begin") ||
    input.includes("start") ||
    input.includes("how it started")
  ) {
    botReply(routes.begin.text, routes.begin.memoryCard, true);
    return;
  }

  if (
    input.includes("what makes me special") ||
    input.includes("makes me special") ||
    input.includes("special")
  ) {
    botReply(routes.special.text, null, true);
    return;
  }

  if (
    input.includes("why did you make this") ||
    input.includes("why did you make") ||
    input.includes("why this")
  ) {
    botReply(routes.purpose.text, null, true);
    return;
  }

  if (
    input.includes("what do i mean to you") ||
    input.includes("mean to you") ||
    input.includes("what am i to you")
  ) {
    botReply(routes.meaning.text, null, true);
    return;
  }

  if (
    input.includes("hidden memory") ||
    input.includes("tell me a hidden memory") ||
    input.includes("memory")
  ) {
    botReply(getHiddenMemory(), null, true);
    return;
  }

  // SECRET TRIGGERS
  if (input.includes("hello")) {
    botReply(
      `That word means more here than you know.

Because the first word you ever said to me in person…
was “Hello.”

And somehow, even something that simple became unforgettable.`,
      null,
      true
    );
    return;
  }

  if (input.includes("5 march")) {
    botReply(
      `5 March…

That was the first day I noticed you.

Sometimes the beginning doesn’t announce itself.
It just quietly arrives.`,
      null,
      true
    );
    return;
  }

  if (input.includes("8 march")) {
    botReply(
      `8 March…

The first time you texted me.

To anyone else, maybe just a message.
To me, it became part of the story.`,
      null,
      true
    );
    return;
  }

  if (input.includes("11 march")) {
    botReply(
      `11 March…

The day we met twice.

Funny how a normal day can become a date your mind keeps forever.`,
      null,
      true
    );
    return;
  }

  if (input.includes("12 march")) {
    botReply(
      `12 March…

The first time we really talked in person.

And the first word you said to me was:
“Hello.”

Simple.
Soft.
Unforgettable.`,
      null,
      true
    );
    return;
  }

  if (input.includes("bhabhi")) {
    botReply(
      `That is the relation.

But never the limit.

Some people enter life through a title…
and stay through what they become in the heart.`,
      null,
      true
    );
    return;
  }

  if (input.includes("why me")) {
    botReply(
      `Because some people can be kind to everyone…

and still feel different to one person.

That is why.`,
      null,
      true
    );
    return;
  }

  if (input.includes("thank you")) {
    botReply(
      `No…

thank you.

For your care.
For your patience.
For your presence.
For the quiet way you make life feel lighter.

Some gratitude is too big for ordinary words.`,
      null,
      true
    );
    return;
  }

  if (input.includes("swayam")) {
    botReply(
      `The one who built this may be Swayam…

But every word here
was written by what you made him feel.`,
      null,
      true
    );
    return;
  }

  // FALLBACK
  botReply(
    `I may not know everything…

but I know the parts of you that became unforgettable.

Try asking me about:
• how it all began
• what makes you special
• why this was made
• what you mean to me
• a hidden memory
• one last message`,
    null,
    false
  );
}

// =========================
// FINAL OVERLAY
// =========================
const finalMessageLines = [
  "Maybe this started as a website…",
  "Then became a memory…",
  "And now… a universe.",
  "But the truth is simple.",
  "I made all of this for one reason.",
  "Because you are truly special, Renu Mishra ❤️",
  "— From Swayam"
];

function showFinalOverlay() {
  finalOverlay.classList.remove("hidden");
  finalLines.innerHTML = "";
  inputWrap.classList.add("hidden");

  finalMessageLines.forEach((line, index) => {
    setTimeout(() => {
      const lineEl = document.createElement("div");
      lineEl.className = "final-line";

      if (line.includes("Renu Mishra") || line.includes("❤️")) {
        lineEl.classList.add("heart");
      }

      lineEl.textContent = line;
      lineEl.style.animationDelay = "0s";
      finalLines.appendChild(lineEl);
    }, index * 1200);
  });
}

function hideFinalOverlay() {
  finalOverlay.classList.add("hidden");
  inputWrap.classList.remove("hidden");
}

// =========================
// BOOT FLOW
// =========================
function startBootSequence() {
  switchScreen(bootScreen);
  bootLines.innerHTML = "";

  bootSequence.forEach((line, index) => {
    setTimeout(() => {
      const div = document.createElement("div");
      div.className = "boot-line";
      div.textContent = line;
      bootLines.appendChild(div);
    }, index * 700);
  });

  setTimeout(() => {
    switchScreen(chatScreen);
    loadInitialBotMessage();
  }, bootSequence.length * 700 + 1200);
}

// =========================
// INITIAL BOT MESSAGE
// =========================
function loadInitialBotMessage() {
  addMessage(
    `Hi Renu… I’m not a normal chatbot.

I was made only to remember you.

Ask me anything…
and I’ll answer only from memories, feelings, and the things I never wanted to leave unsaid.`,
    "bot"
  );
}

// =========================
// EVENTS
// =========================
enterUniverseBtn.addEventListener("click", startBootSequence);

sendBtn.addEventListener("click", () => {
  const text = userInput.value.trim();
  if (!text) return;

  handleUserMessage(text);
  userInput.value = "";
  userInput.focus();
});

userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendBtn.click();
  }
});

chipsWrap.addEventListener("click", (e) => {
  if (e.target.classList.contains("chip")) {
    const chipText = e.target.textContent.trim();
    handleUserMessage(chipText);
  }
});

backToChatBtn.addEventListener("click", hideFinalOverlay);
