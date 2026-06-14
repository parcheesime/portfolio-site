import { trackEvent } from "../src/features/analytics.js";

// Vanilla JS Component Engine for <project-card> tags
export function hydrateProjectCards() {
  document.querySelectorAll("project-card").forEach(card => {
    const projectId = card.getAttribute("project-id") || "";
    const frontTitle = card.getAttribute("front-title") || "";
    const backTitle = card.getAttribute("back-title") || frontTitle;
    const quote = card.getAttribute("quote") || "";

    const preContent = card.querySelector("pre");
    const ulContent = card.querySelector("ul");
    const badges = Array.from(card.querySelectorAll(".badge"));

    const badgesHTML = badges.length > 0
      ? `<div class="badges">${badges.map(b => b.outerHTML).join("")}</div>`
      : quote
        ? `<p>👉 "${quote}"</p>`
        : "";

    const wrapper = document.createElement("div");

    wrapper.innerHTML = `
      <div class="flip-card">
        <div class="flip-card-inner">
          <div class="flip-card-front">
            <h3 class="wiggle-text">${frontTitle}</h3>
            ${preContent ? `<div class="code-scroll-wrapper">\n${preContent.outerHTML}\n</div>` : ""}
            ${badgesHTML}
          </div>
          <div class="flip-card-back">
            <h3>${backTitle}</h3>
            ${ulContent ? ulContent.outerHTML : ""}
          </div>
        </div>
      </div>
    `;

    const hydratedCard = wrapper.firstElementChild;

    hydratedCard.addEventListener("click", () => {
      hydratedCard.classList.toggle("flipped");
      trackEvent("project_card_click", { project_id: projectId });
    });

    card.replaceWith(hydratedCard);
  });
}
