document.addEventListener("DOMContentLoaded", () => {
    // Wiggle animation for fun fact button
    const button = document.querySelector('.fun-fact-button');
    if (button) {
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
  
    // Toggle between icon and tooltip
    steps.forEach(step => {
      const originalText = step.textContent;
      const tooltip = step.getAttribute('data-tooltip');
  
      step.addEventListener('click', () => {
        step.textContent = (step.textContent === originalText) ? tooltip : originalText;
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
  