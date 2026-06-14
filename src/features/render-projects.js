export async function renderProjects() {
    const response = await fetch("./src/data/projects.json");

    if (!response.ok) {
        throw new Error(`Failed to load projects: ${response.status}`);
    }

    const projects = await response.json();
    const container = document.querySelector(".project-grid");

    container.innerHTML = projects.map(project => `
        <project-card
            project-id="${project.id}"
            front-title="${project.frontTitle}"
            back-title="${project.backTitle}">

            ${project.badges.map(badge => `<span class="badge">${badge}</span>`).join("")}

            <pre><code>${escapeHTML(project.code)}</code></pre>

            <ul>
                ${project.bullets.map(item => `
                    <li><strong>${item.label}:</strong> ${item.text}</li>
                `).join("")}
            </ul>

        </project-card>
    `).join("");
}

function escapeHTML(str) {
    return str
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}
