import { initModeToggle } from "./features/mode-toggle.js";
import { initBackToTop } from "./features/back-to-top.js";
import { initFunFacts } from "./features/fun-facts.js";
import { initJourney } from "./features/journey.js";
import { incrementScore } from "./features/score-system.js";
import { createQuestSystem } from "./features/quest-system.js";
import { renderProjects } from "./features/render-projects.js";
import { hydrateProjectCards } from "../components/project-card.js";
import { renderJourney } from "./features/render-journey.js";

document.addEventListener("DOMContentLoaded", async () => {
    const quest = createQuestSystem();

    initModeToggle();
    initBackToTop();

    initFunFacts(quest.updateQuest);
    await renderJourney();
    initJourney(quest.updateQuest, incrementScore);

    await renderProjects();
    hydrateProjectCards();
});