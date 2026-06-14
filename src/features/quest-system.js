import { appState } from "../app-state.js";
import { trackEvent } from "./analytics.js";

export function createQuestSystem() {

    // --- Hacker Quest System ---
    const exploredFeatures = new Set();
    const questBox = document.getElementById("questBox");
    const questProgressEl = document.getElementById("questProgress");

    function unlockHackerMode() {
        trackEvent("achievement_unlocked", { achievement: "engineering_lab" });

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


    return {
        updateQuest
    };
}
