import { initBackToTop } from "./features/back-to-top.js";
import { initFunFacts } from "./features/fun-facts.js";
import { renderProjects } from "./features/render-projects.js";
import { hydrateProjectCards } from "../components/project-card.js";
import { initAnalyticsTracking } from "./features/analytics.js";

document.addEventListener("DOMContentLoaded", async () => {
    initAnalyticsTracking();
    initBackToTop();

    initFunFacts();

    await renderProjects();
    hydrateProjectCards();
});
