document.addEventListener("DOMContentLoaded", () => {
    // Score count
    let score = 0;
    const scoreDisplay = document.getElementById("scoreCount");

    function incrementScore() {
        score++;
        scoreDisplay.textContent = score;
    }
    // Reward message
    let rewardShown = false;
    const rewardMessage = document.getElementById("rewardMessage");

    function incrementScore() {
        score++;
        scoreDisplay.textContent = score;

        if (score >= 10 && !rewardShown) {
            rewardShown = true;
            rewardMessage.classList.add("show");

        // Hide it after 4 seconds
        setTimeout(() => {
      rewardMessage.classList.remove("show");
    }, 4000);
  }
}


    // Wiggle animation for fun fact button
    const button = document.querySelector('.fun-fact-button');

    if (button) {
      // Add click listener ONCE
      button.addEventListener('click', () => {
        showNextFact();
        incrementScore();
      });
    
      // Wiggle every 5 seconds independently
      setInterval(() => {
        button.classList.add('wiggle');
        setTimeout(() => button.classList.remove('wiggle'), 1000);
      }, 5000);
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
  
    // Timeline animation + pulse + toggle
    const steps = document.querySelectorAll('.timeline-step');
    steps.forEach((step, index) => {
      setTimeout(() => {
        step.classList.add('visible');
      }, index * 300);
    });
  
    // Sequential pulsing one at a time
    let currentPulse = 0;
    function pulseStep() {
      steps.forEach((s, i) => s.classList.remove('pulse'));
      steps[currentPulse].classList.add('pulse');
      currentPulse = (currentPulse + 1) % steps.length;
    }
    setInterval(pulseStep, 1000);
  
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
  