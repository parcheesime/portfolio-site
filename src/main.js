import { initBackToTop } from "./features/back-to-top.js";
import { initFunFacts } from "./features/fun-facts.js";
import { initJourney } from "./features/journey.js";
import { renderProjects } from "./features/render-projects.js";
import { hydrateProjectCards } from "../components/project-card.js";
import { renderJourney } from "./features/render-journey.js";
import { initAnalyticsTracking } from "./features/analytics.js";

document.addEventListener("DOMContentLoaded", async () => {
    initAnalyticsTracking();
    initBackToTop();

    initFunFacts();
    await renderJourney();
    initJourney();

    await renderProjects();
    hydrateProjectCards();
});
