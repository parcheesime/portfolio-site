

// --- App State & Feature Flags ---
const appState = {
  mode: sessionStorage.getItem('portfolioMode') || "recruiter"
};

function applyMode() {
  const toggle = document.getElementById("modeSwitch");
  if (appState.mode === "explore") {
    document.body.classList.add("explore-mode");
    if (toggle) toggle.checked = true;
  } else {
    document.body.classList.remove("explore-mode");
    if (toggle) toggle.checked = false;
  }
}

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
    banner.textContent = "SYSTEM OVERRIDE DETECTED. HACKER MODE ENGAGED.";
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

  // Mode System Initialization
  applyMode();
  const modeSwitch = document.getElementById("modeSwitch");
  if (modeSwitch) {
    modeSwitch.addEventListener("change", (e) => {
      appState.mode = e.target.checked ? "explore" : "recruiter";
      sessionStorage.setItem('portfolioMode', appState.mode);
      window.location.reload();
    });
  }

  // Score count
  let score = 0;
  const scoreDisplay = document.getElementById("scoreCount");

  // Reward message
  let rewardShown = false;
  const rewardMessage = document.getElementById("rewardMessage");

  function incrementScore() {
    score++;
    scoreDisplay.textContent = score;

    // 10-point reward (only once)
    if (score >= 10 && !rewardShown) {
      rewardShown = true;
      rewardMessage.classList.add("show");

      // Hide 10-point message after 4 seconds
      setTimeout(() => {
        rewardMessage.classList.remove("show");
      }, 4000);
    }

    // 20-point message (trigger exactly at 20)
    if (score === 20) {
      const finalMessage = document.getElementById("finalMessage");
      finalMessage.classList.add("show");

      // Hide 20-point message after 6 seconds
      setTimeout(() => {
        finalMessage.classList.remove("show");
      }, 7000);
    }
  }

  // Pulse animation for fun fact button (starts on scroll into view)
  const button = document.querySelector('.fun-fact-button');
  let factPulseInterval;

  if (button) {
    const buttonObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !factPulseInterval) {
          factPulseInterval = setInterval(() => {
            button.classList.add('pulse');
            setTimeout(() => button.classList.remove('pulse'), 1500);
          }, 3500);
        }
      });
    }, { threshold: 0.5 });
    let factClicks = 0;

    button.addEventListener('click', () => {
      updateQuest('fact');
      showNextFact();
      if (factClicks < facts.length) {
        incrementScore();
        factClicks++;
      }
    });

    buttonObserver.observe(button);
  }



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


  // Timeline: Pulse each step when skill-path is in view
  const steps = document.querySelectorAll('.timeline-step');
  let pulseInterval;
  let currentPulse = 0;

  function startPulseAnimation() {
    currentPulse = 0;
    function pulseNext() {
      steps.forEach(s => s.classList.remove('pulse'));
      if (currentPulse < steps.length) {
        steps[currentPulse].classList.add('pulse');
        currentPulse++;
      } else {
        clearInterval(pulseInterval);
        pulseInterval = null;
      }
    }
    pulseNext();
    pulseInterval = setInterval(pulseNext, 1500);
  }

  // Observer to trigger animation when visible
  const journeySection = document.querySelector("#skill-path");
  let unrollTimeouts = [];

  const journeyObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!pulseInterval) {
          steps.forEach((step, index) => {
            const t = setTimeout(() => step.classList.add('visible'), index * 350);
            unrollTimeouts.push(t);
          });
          const t2 = setTimeout(() => {
            startPulseAnimation();
          }, steps.length * 350 + 500);
          unrollTimeouts.push(t2);
        }
      } else {
        // Reset animation when scrolled away
        if (pulseInterval) {
          clearInterval(pulseInterval);
          pulseInterval = null;
        }
        unrollTimeouts.forEach(clearTimeout);
        unrollTimeouts = [];
        steps.forEach(step => {
          step.classList.remove('visible');
          step.classList.remove('pulse');
        });
      }
    });
  }, { threshold: 0.15 });

  if (journeySection) {
    journeyObserver.observe(journeySection);
  }


  function resetSpiral() {
    if (pulseInterval) {
      clearInterval(pulseInterval);
      pulseInterval = null;
    }
    unrollTimeouts.forEach(clearTimeout);
    unrollTimeouts = [];

    steps.forEach(step => {
      step.classList.remove('visible', 'pulse', 'wiggle', 'active');
      step.style.zIndex = '';
      if (step.hasAttribute('data-original-text')) {
        step.textContent = step.getAttribute('data-original-text');
      }
      step.classList.add('is-icon-state');
    });
    setTimeout(() => {
      steps.forEach((step, index) => {
        const t = setTimeout(() => step.classList.add('visible'), index * 350);
        unrollTimeouts.push(t);
      });
      const t2 = setTimeout(startPulseAnimation, steps.length * 350 + 500);
      unrollTimeouts.push(t2);
    }, 50);
  }

  // Multi-tooltip + popup card support + wiggle
  let lastClickedStep = null;
  const clickedSteps = new Set();
  let completeTimeout = null;

  steps.forEach(step => {
    const tooltips = JSON.parse(step.getAttribute('data-tooltips') || '[]');
    const originalText = step.textContent.trim();
    step.setAttribute('data-original-text', originalText);
    step.classList.add('is-icon-state');

    step.addEventListener('click', () => {
      updateQuest('timeline');
      // Restore previous node
      if (lastClickedStep && lastClickedStep !== step) {
        lastClickedStep.classList.remove('active');
        lastClickedStep.textContent = lastClickedStep.getAttribute('data-original-text');
        lastClickedStep.classList.add('is-icon-state');
      }

      if (step.classList.contains('active')) {
        // Toggle off if clicking the same node
        step.classList.remove('active');
        step.textContent = step.getAttribute('data-original-text');
        step.classList.add('is-icon-state');
        lastClickedStep = null;
        return;
      }

      lastClickedStep = step;
      clickedSteps.add(step);

      // Build card content
      let contentHtml = `<div class="card-title">${originalText}</div><div class="card-content">`;
      if (tooltips.length > 0) {
        contentHtml += '<ul>';
        tooltips.forEach(t => contentHtml += `<li style="margin-bottom: 4px;">${t}</li>`);
        contentHtml += '</ul>';
      } else {
        const tooltip = step.getAttribute('data-tooltip');
        if (tooltip) {
          contentHtml += `<p>${tooltip}</p>`;
        }
      }
      contentHtml += `</div>`;

      step.innerHTML = contentHtml;
      step.classList.remove('is-icon-state');
      step.classList.add('active'); // Glide node exactly to front and center

      // Trigger wiggle
      step.classList.add("wiggle");
      setTimeout(() => step.classList.remove("wiggle"), 600);
      incrementScore();

      // Check if all nodes are clicked
      if (clickedSteps.size === steps.length) {
        clearTimeout(completeTimeout);
        completeTimeout = setTimeout(() => {
          clickedSteps.clear();
          if (lastClickedStep) {
            lastClickedStep.textContent = lastClickedStep.getAttribute('data-original-text');
            lastClickedStep.classList.remove('active');
          }
          lastClickedStep = null;
          resetSpiral();
        }, 5000); // 5 sec finale timer!
      }
    });
  });



  // Back to top button behavior
  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    window.addEventListener("scroll", () => {
      backToTop.classList.toggle("show", window.scrollY > 400);
    });

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});


