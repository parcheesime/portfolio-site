import { trackEvent } from "./analytics.js";

export function initJourney(updateQuest, incrementScore) {
    // all journey code
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

    steps.forEach((step, index) => {
        const tooltips = JSON.parse(step.getAttribute('data-tooltips') || '[]');
        const originalText = step.textContent.trim();
        step.setAttribute('data-original-text', originalText);
        step.classList.add('is-icon-state');

        step.addEventListener('click', () => {
            trackEvent("journey_step_click", { step_index: index + 1 });
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
}
