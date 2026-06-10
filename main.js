// import { incrementScore } from "./src/features/score-system.js";

// --- App State & Feature Flags ---
const appState = {
  mode: sessionStorage.getItem('portfolioMode') || "recruiter"
};

// function applyMode() {
//   const toggle = document.getElementById("modeSwitch");
//   if (appState.mode === "explore") {
//     document.body.classList.add("explore-mode");
//     if (toggle) toggle.checked = true;
//   } else {
//     document.body.classList.remove("explore-mode");
//     if (toggle) toggle.checked = false;
//   }
// }

// applyMode();

// const modeSwitch = document.getElementById("modeSwitch");
// if (modeSwitch) {
//   modeSwitch.addEventListener("change", (e) => {
//     appState.mode = e.target.checked ? "explore" : "recruiter";
//     sessionStorage.setItem('portfolioMode', appState.mode);
//     window.location.reload();
//   });
// }

document.addEventListener("DOMContentLoaded", () => {
  // --- Hacker Quest System ---
  const exploredFeatures = new Set();
  const questBox = document.getElementById("questBox");
  const questProgressEl = document.getElementById("questProgress");

  function unlockHackerMode() {
    if (questBox) {
      questBox.innerHTML = "🏆 Hack The Planet. You're In.";
      questBox.classList.add("mission-complete");
      questBox.classList.remove("update-flash");
    }

    document.body.classList.add("hacker-mode");

    // Magic Cursor Particle Engine
    let lastTime = 0;
    document.addEventListener("mousemove", (e) => {
      if (!document.body.classList.contains('explore-mode')) return;

      const now = Date.now();
      if (now - lastTime < 50) return;
      lastTime = now;

      const particle = document.createElement("div");
      particle.classList.add("magic-particle");
      const chars = ['0', '1', '\\\\', '/', '*', '>', '<'];
      particle.textContent = chars[Math.floor(Math.random() * chars.length)];
      particle.style.left = e.clientX + 'px';
      particle.style.top = e.clientY + 'px';

      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 1000);
    });

    const banner = document.createElement("div");
    banner.classList.add("quest-complete-banner");
    banner.textContent = "🏗️ Engineering Lab Unlocked";
    document.body.appendChild(banner);
    setTimeout(() => banner.remove(), 4000);
  }

  function updateQuest(featureName) {
    if (appState.mode !== 'explore') return;
    if (exploredFeatures.has(featureName) || exploredFeatures.size >= 3) return;

    exploredFeatures.add(featureName);

    if (questProgressEl && questBox) {
      questProgressEl.textContent = `(${exploredFeatures.size}/3)`;
      questBox.classList.remove("update-flash");
      void questBox.offsetWidth; // trigger reflow
      questBox.classList.add("update-flash");
    }

    if (exploredFeatures.size === 3) {
      unlockHackerMode();
    }
  }

  // // Mode System Initialization
  // applyMode();
  // const modeSwitch = document.getElementById("modeSwitch");
  // if (modeSwitch) {
  //   modeSwitch.addEventListener("change", (e) => {
  //     appState.mode = e.target.checked ? "explore" : "recruiter";
  //     sessionStorage.setItem('portfolioMode', appState.mode);
  //     window.location.reload();
  //   });
  // }

  let score = 0;
  const scoreDisplay = document.getElementById("scoreCount");

  let rewardShown = false;
  const rewardMessage = document.getElementById("rewardMessage");

  function incrementScore() {
    score++;
    if (scoreDisplay) scoreDisplay.textContent = score;

    // Only show score announcements in explore mode
    if (appState.mode !== 'explore') return;

    // 10-point reward (only once)
    if (score >= 10 && !rewardShown) {
      rewardShown = true;
      if (rewardMessage) rewardMessage.classList.add("show");

      // Hide 10-point message after 4 seconds
      setTimeout(() => {
        if (rewardMessage) rewardMessage.classList.remove("show");
      }, 4000);
    }

    // 20-point message (trigger exactly at 20)
    if (score === 20) {
      const finalMessage = document.getElementById("finalMessage");
      if (finalMessage) {
        finalMessage.classList.add("show");

        // Hide 20-point message after 6 seconds
        setTimeout(() => {
          finalMessage.classList.remove("show");
        }, 7000);
      }
    }
  }

  // // Pulse animation for fun fact button (starts on scroll into view)
  // const button = document.querySelector('.fun-fact-button');
  // let factPulseInterval;

  // if (button) {
  //   const buttonObserver = new IntersectionObserver(entries => {
  //     entries.forEach(entry => {
  //       if (entry.isIntersecting && !factPulseInterval) {
  //         factPulseInterval = setInterval(() => {
  //           button.classList.add('pulse');
  //           setTimeout(() => button.classList.remove('pulse'), 1500);
  //         }, 3500);
  //       }
  //     });
  //   }, { threshold: 0.5 });
  //   let factClicks = 0;

  //   button.addEventListener('click', () => {
  //     updateQuest('fact');
  //     showNextFact();
  //     if (factClicks < facts.length) {
  //       incrementScore();
  //       factClicks++;
  //     }
  //   });

  //   buttonObserver.observe(button);
  // }

  // Track which cards have been hovered
  const hoveredCards = new Set();

  // Add hover logic for flip-cards (once only)
  document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      updateQuest('card');
      if (!hoveredCards.has(card)) {
        hoveredCards.add(card);
        incrementScore();
      }
    });
  });

});

