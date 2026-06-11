export async function renderJourney() {
    const response = await fetch("./src/data/journey.json");

    if (!response.ok) {
        throw new Error(`Failed to load journey data: ${response.status}`);
    }

    const journeyItems = await response.json();
    const container = document.querySelector(".timeline-vertical");

    if (!container) return;

    container.innerHTML = journeyItems.map(createJourneyNodeHTML).join("");
}

function createJourneyNodeHTML(item) {
    const tooltipAttribute = item.tooltips
        ? `data-tooltips='${JSON.stringify(item.tooltips)}'`
        : `data-tooltip="${escapeAttribute(item.tooltip)}"`;

    return `
        <div class="timeline-step" ${tooltipAttribute}>
            ${item.label}
        </div>
    `;
}

function escapeAttribute(value = "") {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll('"', "&quot;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}