import { incrementScore } from "./score-system.js";
import { trackEvent } from "./analytics.js";

const facts = [
    "Started college as a physics major. I'm drawn to the strange beauty of math in modern physics.",
    "I love building data tools that do the work for you — automation, analytics, and a little AI magic go a long way.",
    "MATLAB was my first programming language.",
    "My second language was Java!",
    "I founded a coding workshop business where I wore every hat, from instructor, to tech troubleshooter, to social media manager.",
    "Favorite math proof: Euler’s formula. It’s even inked as a tattoo — that's how deep the connection runs.",
];

let currentFactIndex = 0;
let factClicks = 0;
let factPulseInterval;

function showNextFact() {
    const factBox = document.getElementById("fact-box");
    if (!factBox) return;

    factBox.style.opacity = 0;

    const factToShow = facts[currentFactIndex];
    currentFactIndex = (currentFactIndex + 1) % facts.length;

    setTimeout(() => {
        factBox.innerText = factToShow;
        factBox.style.opacity = 1;
    }, 200);
}

export function initFunFacts(updateQuest) {
    const button = document.querySelector(".fun-fact-button");
    if (!button) return;

    const buttonObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !factPulseInterval) {
                    factPulseInterval = setInterval(() => {
                        button.classList.add("pulse");
                        setTimeout(() => button.classList.remove("pulse"), 1500);
                    }, 3500);
                }
            });
        },
        { threshold: 0.5 }
    );

    button.addEventListener("click", () => {
        trackEvent("fun_fact_click");
        updateQuest("fact");
        showNextFact();

        if (factClicks < facts.length) {
            incrementScore();
            factClicks++;
        }
    });

    buttonObserver.observe(button);
}
