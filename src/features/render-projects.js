export async function renderProjects() {
    const response = await fetch("./src/data/projects.json");
    const projects = await response.json();

    const container = document.querySelector(".project-grid");

    function escapeHTML(str) {
        return str
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;");
    }

    container.innerHTML = projects.map(project => `
        <project-card
            front-title="${escapeHTML(project.frontTitle)}"
            back-title="${escapeHTML(project.backTitle)}">
            
            ${project.badges
            .map(badge => `<span class="badge">${badge}</span>`)
            .join("")}

            <pre><code>${escapeHTML(project.code)}</code></pre>

            <ul>
                ${project.bullets
            .map(item => `
                        <li>
                            <strong>${item.label}:</strong>
                            ${item.text}
                        </li>
                    `)
            .join("")}
            </ul>

        </project-card>
    `).join("");
}