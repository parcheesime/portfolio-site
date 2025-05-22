// --- App State & Feature Flags ---
const appState = {
  mode: localStorage.getItem('portfolioMode') || "recruiter",
  features: {
    explorePreview: true,
    aiGuide: false,
    sandboxMap: false,
    achievements: false
  }
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
            localStorage.setItem('portfolioMode', appState.mode);
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

    // Fade-in effect on scroll
    const fadeEls = document.querySelectorAll('.project-block');
    const appearOptions = { threshold: 0.3 };
    const appearOnScroll = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, appearOptions);
  
    fadeEls.forEach(el => {
      el.classList.add('fade-in');
      appearOnScroll.observe(el);
    });

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
      currentPulse = 0; // restart from top
      pulseInterval = setInterval(() => {
        steps.forEach((s, i) => s.classList.remove('pulse'));
        steps[currentPulse].classList.add('pulse');
        currentPulse = (currentPulse + 1) % steps.length;
      }, 300);
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

  
    // Multi-tooltip + reset + wiggle support
    steps.forEach(step => {
    const tooltips = JSON.parse(step.getAttribute('data-tooltips') || '[]');
    const originalText = step.textContent;
    let clickIndex = 0;
  
    if (tooltips.length > 0) {
      step.addEventListener('click', () => {
        if (clickIndex === 0) {
          step.textContent = tooltips[0];
        } else if (clickIndex < tooltips.length) {
          step.textContent = tooltips[clickIndex];
        } else {
          step.textContent = originalText; // reset back to icon
        }
  
        // Trigger wiggle
        step.classList.add("wiggle");
        setTimeout(() => step.classList.remove("wiggle"), 600);
        incrementScore(); // 
        clickIndex = (clickIndex + 1) % (tooltips.length + 1); // loop including original icon
      });
    } else {
      const tooltip = step.getAttribute('data-tooltip');
      step.addEventListener('click', () => {
        step.textContent = (step.textContent === originalText) ? tooltip : originalText;
        incrementScore();
      });
    }
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
  
