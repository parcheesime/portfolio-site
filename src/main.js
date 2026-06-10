import { initModeToggle } from "./features/mode-toggle.js";
import { initBackToTop } from "./features/back-to-top.js";
import { initFunFacts } from "./features/fun-facts.js";
import { initJourney } from "./features/journey.js";
import { incrementScore } from "./features/score-system.js";

document.addEventListener("DOMContentLoaded", () => {
    initModeToggle();
    initBackToTop();

    initFunFacts(() => { });
    initJourney(() => { }, incrementScore);
});