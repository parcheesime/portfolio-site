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
  // Mode System Initialization
  applyMode();
  const modeSwitch = document.getElementById("modeSwitch");
  if (modeSwitch) {
    modeSwitch.addEventListener("change", (e) => {
      appState.mode = e.target.checked ? "explore" : "recruiter";
      sessionStorage.setItem('portfolioMode', appState.mode);
      applyMode();
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

  // Wiggle animation for fun fact button (starts on scroll into view)
  const button = document.querySelector('.fun-fact-button');
  let wiggleInterval;

  if (button) {
    const buttonObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !wiggleInterval) {
          wiggleInterval = setInterval(() => {
            button.classList.add('wiggle');
            setTimeout(() => button.classList.remove('wiggle'), 1000);
          }, 3500);
        }
      });
    }, { threshold: 0.5 });
    let factClicks = 0;

    button.addEventListener('click', () => {
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

  // Multi-tooltip + reset + wiggle support
  let lastClickedStep = null;
  const clickedSteps = new Set();
  let completeTimeout = null;

  steps.forEach(step => {
    const tooltips = JSON.parse(step.getAttribute('data-tooltips') || '[]');
    const originalText = step.textContent;
    step.setAttribute('data-original-text', originalText);
    step.classList.add('is-icon-state');
    let clickIndex = 0;

    step.addEventListener('click', () => {
      // Hide the previous node
      if (lastClickedStep && lastClickedStep !== step) {
        lastClickedStep.classList.remove('visible', 'active');
      }
      lastClickedStep = step;
      clickedSteps.add(step);
      step.classList.add('active'); // Glide node exactly to front and center

      if (tooltips.length > 0) {
        if (clickIndex === 0) {
          step.textContent = tooltips[0];
        } else if (clickIndex < tooltips.length) {
          step.textContent = tooltips[clickIndex];
        } else {
          step.textContent = originalText; // reset back to icon
        }

        step.classList.toggle('is-icon-state', step.textContent === originalText);

        // Trigger wiggle
        step.classList.add("wiggle");
        setTimeout(() => step.classList.remove("wiggle"), 600);
        incrementScore();
        clickIndex = (clickIndex + 1) % (tooltips.length + 1);
      } else {
        const tooltip = step.getAttribute('data-tooltip');
        step.textContent = (step.textContent === originalText) ? tooltip : originalText;
        step.classList.toggle('is-icon-state', step.textContent === originalText);
        incrementScore();
      }

      // Check if all nodes are clicked
      if (clickedSteps.size === steps.length) {
        clearTimeout(completeTimeout);
        completeTimeout = setTimeout(() => {
          clickedSteps.clear();
          lastClickedStep = null;
          steps.forEach(s => s.dispatchEvent(new Event('reset-timeline')));
          resetSpiral();
        }, 4000); // 4 sec finale timer!
      }
    });

    step.addEventListener('reset-timeline', () => {
      clickIndex = 0;
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

