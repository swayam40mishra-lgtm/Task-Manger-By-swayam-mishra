const screens = document.querySelectorAll(".screen");
const progressBar = document.getElementById("progressBar");
const loadingStatus = document.getElementById("loadingStatus");
const typedText = document.getElementById("typedText");
const revealNextBtn = document.getElementById("revealNextBtn");
const finalTyped = document.getElementById("finalTyped");
const dayStatus = document.getElementById("dayStatus");

let loadingStarted = false;
let revealTyped = false;
let finalTypedDone = false;

function goToScreen(screenNumber) {
  screens.forEach((screen) => screen.classList.remove("active"));
  document.getElementById(`screen${screenNumber}`).classList.add("active");

  if (screenNumber === 2 && !loadingStarted) {
    startLoadingSequence();
    loadingStarted = true;
  }

  if (screenNumber === 3 && !revealTyped) {
    startRevealTyping();
    revealTyped = true;
  }

  if (screenNumber === 5) {
    checkDayStatus();
  }

  if (screenNumber === 6 && !finalTypedDone) {
    startFinalTyping();
    finalTypedDone = true;
  }
}

function startLoadingSequence() {
  let progress = 0;

  const statuses = [
    "Please wait...",
    "Analyzing presentation structure...",
    "Validating project identity...",
    "System interruption detected..."
  ];

  let statusIndex = 0;

  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 8) + 5;
    if (progress > 100) progress = 100;

    progressBar.style.width = progress + "%";

    if (statusIndex < statuses.length && progress > (statusIndex + 1) * 25) {
      loadingStatus.textContent = statuses[statusIndex];
      statusIndex++;
    }

    if (progress >= 100) {
      clearInterval(interval);
      loadingStatus.textContent = "ERROR: This was never a class project.";
      setTimeout(() => {
        goToScreen(3);
      }, 1200);
    }
  }, 300);
}

function typeWriter(element, text, speed = 45, callback = null) {
  let i = 0;
  element.textContent = "";

  function typing() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(typing, speed);
    } else if (callback) {
      callback();
    }
  }

  typing();
}

function startRevealTyping() {
  const message = `It was never a project for my class...
It was always something made for you. ❤️

Verifying the Best Bhabhi in the World...
Searching...
Matching...
Identity confirmed.`;

  typeWriter(typedText, message, 38, () => {
    revealNextBtn.classList.remove("hidden");
  });
}

function startFinalTyping() {
  const message = `Good.
Because your Dever has already started. ❤️

This was never just a website.
This was the beginning of a 7-day memory.`;

  typeWriter(finalTyped, message, 42);
}

function checkDayStatus() {
  const now = new Date();
  const hours = now.getHours();

  if (hours >= 19) {
    dayStatus.textContent = "UNLOCKED 🔓";
  } else {
    dayStatus.textContent = "LOCKED 🔒";
  }
}
