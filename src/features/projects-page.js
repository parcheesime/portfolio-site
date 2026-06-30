const PROJECT_PAGE_ORDER = [
    "airthings-dashboard",
    "barkey-pet-sitting",
    "hack-for-la",
    "static-website-qa-toolkit",
    "bondcliq-data-quality",
    "google-io",
];

const state = {
    projects: [],
    featuredContainer: null,
};

export async function initProjectsPage() {
    const featuredContainer = document.querySelector("[data-featured-projects]");
    if (!featuredContainer) return;

    state.featuredContainer = featuredContainer;

    try {
        const projects = await loadProjects();
        state.projects = orderProjects(projects);
        renderFeaturedProjects();
    } catch {
        renderStatus(featuredContainer, "Featured projects are unavailable right now.");
    }
}

async function loadProjects() {
    const dataUrl = new URL("../data/projects.json", import.meta.url);
    const response = await fetch(dataUrl);
    if (!response.ok) {
        throw new Error(`Failed to load projects: ${response.status}`);
    }

    const projects = await response.json();
    return Array.isArray(projects) ? projects : [];
}

function orderProjects(projects) {
    const byId = new Map(projects.map((project) => [project.id, project]));
    return PROJECT_PAGE_ORDER.map((id) => byId.get(id)).filter(Boolean);
}

function renderFeaturedProjects() {
    const container = state.featuredContainer;
    if (!container) return;

    container.replaceChildren();
    const featured = state.projects.filter((project) => project.featured);

    if (featured.length === 0) {
        renderStatus(container, "Featured projects coming soon.");
        return;
    }

    featured.forEach((project) => {
        container.append(createProjectCard(project));
    });
}

function createProjectCard(project) {
    const article = document.createElement("article");
    article.className = "project-card project-card--featured";
    article.dataset.category = (project.projectFilters || project.categories || []).join(" ");

    const media = createProjectMedia(project);
    const body = document.createElement("div");
    body.className = "project-card__body";

    const eyebrow = document.createElement("p");
    eyebrow.className = "project-card__eyebrow";
    eyebrow.textContent = [project.status, getCategoryLabel(project)].filter(Boolean).join(" · ");

    const title = document.createElement("h3");
    title.textContent = getProjectTitle(project);

    const description = document.createElement("p");
    description.className = "project-card__description";
    description.textContent = project.shortDescription || project.summary || getFirstBullet(project) || "";

    body.append(eyebrow, title, description);

    const tags = createTagList(project.stackTags || project.badges);
    if (tags) body.append(tags);

    const outcomes = createOutcomeList(project.outcomes || project.bullets);
    if (outcomes) body.append(outcomes);

    const links = createProjectLinks(project.links);
    if (links) body.append(links);

    article.append(media, body);
    return article;
}

function createProjectMedia(project) {
    const figure = document.createElement("figure");
    figure.className = "project-card__media";

    const screenshot = project.screenshot || project.image;
    const src = typeof screenshot === "string" ? screenshot : screenshot?.src;

    if (src) {
        const image = document.createElement("img");
        image.src = src;
        image.alt = screenshot?.alt || `${project.title} screenshot`;
        image.loading = "lazy";
        image.width = 640;
        image.height = 360;
        figure.append(image);
        return figure;
    }

    const placeholder = document.createElement("div");
    placeholder.className = "project-card__placeholder";
    placeholder.setAttribute("role", "img");
    placeholder.setAttribute("aria-label", `${project.title} screenshot placeholder`);
    placeholder.textContent = project.screenshot?.label || project.organization || project.title || "Project";
    figure.append(placeholder);
    return figure;
}

function createTagList(tags = []) {
    const values = tags.filter(Boolean).slice(0, 6);
    if (values.length === 0) return null;

    const list = document.createElement("ul");
    list.className = "project-card__tags";

    values.forEach((tag) => {
        const item = document.createElement("li");
        item.textContent = tag;
        list.append(item);
    });

    return list;
}

function createOutcomeList(outcomes = []) {
    const values = outcomes.map((outcome) => outcome?.text || outcome).filter(Boolean).slice(0, 3);
    if (values.length === 0) return null;

    const list = document.createElement("ul");
    list.className = "project-card__outcomes";

    values.forEach((outcome) => {
        const item = document.createElement("li");
        item.textContent = outcome;
        list.append(item);
    });

    return list;
}

function createProjectLinks(links = {}) {
    const normalized = [
        normalizeLink(links.github, "GitHub"),
        normalizeLink(links.live, "Live demo"),
        normalizeLink(links.caseStudy, "Case study"),
    ].filter(Boolean);

    if (normalized.length === 0) return null;

    const list = document.createElement("ul");
    list.className = "project-card__links";

    normalized.forEach((link) => {
        const item = document.createElement("li");
        const anchor = document.createElement("a");
        anchor.href = link.href;
        anchor.textContent = link.label;
        if (link.href.startsWith("http")) {
            anchor.target = "_blank";
            anchor.rel = "noopener noreferrer";
        }
        item.append(anchor);
        list.append(item);
    });

    return list;
}

function normalizeLink(link, fallbackLabel) {
    if (!link) return null;
    if (typeof link === "string") return { href: link, label: fallbackLabel };
    if (!link.href) return null;
    return { href: link.href, label: link.label || fallbackLabel };
}

function getCategoryLabel(project) {
    if (project.projectCategory) return project.projectCategory;
    if (project.type === "client") return "Client Work";
    if ((project.categories || []).includes("civic-tech")) return "Civic/Education";
    if ((project.categories || []).includes("data-engineering")) return "Data";
    if ((project.categories || []).includes("web-engineering")) return "Web";
    return project.organization || "";
}

function getProjectTitle(project) {
    return project.cardTitle || project.title || project.frontTitle || "Untitled project";
}

function getFirstBullet(project) {
    const firstBullet = project.bullets?.find((bullet) => bullet?.text);
    return firstBullet?.text || "";
}

function renderStatus(container, message) {
    container.replaceChildren();
    const status = document.createElement("p");
    status.className = "project-card-status";
    status.textContent = message;
    container.append(status);
}
