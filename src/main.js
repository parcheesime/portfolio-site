import { initBackToTop } from "./features/back-to-top.js";
import { initFunFacts } from "./features/fun-facts.js";
import { initProjectExplorer } from "./features/project-explorer.js";
import { initAnalyticsTracking } from "./features/analytics.js";

document.addEventListener("DOMContentLoaded", async () => {
    initAnalyticsTracking();
    initBackToTop();

    initFunFacts();
    initProjectExplorer();
});
