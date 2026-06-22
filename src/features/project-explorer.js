const explorerState = {
    projects: [],
    skills: [],
    selectedProjectId: null,
};

export async function initProjectExplorer() {
    const explorer = document.querySelector("[data-project-explorer]");
    if (!explorer) return;

    const detailPanel = explorer.querySelector("[data-project-detail]");
    if (!detailPanel) return;

    try {
        const [projects, skills] = await Promise.all([
            loadProjectData(),
            loadSkillData(),
        ]);

        explorerState.projects = projects;
        explorerState.skills = skills;
        explorerState.selectedProjectId = projects[0]?.id || null;

        const selectedProject = projects.find((project) => project.id === explorerState.selectedProjectId);
        renderProjectDetail(detailPanel, selectedProject, skills);
    } catch (error) {
        renderStatus(detailPanel, "Project details are unavailable right now.");
    }
}

async function loadProjectData() {
    const response = await fetch("./src/data/projects.json");
    if (!response.ok) {
        throw new Error(`Failed to load project data: ${response.status}`);
    }

    const projects = await response.json();
    return Array.isArray(projects) ? projects : [];
}

async function loadSkillData() {
    const response = await fetch("./src/data/skills.json");
    if (!response.ok) {
        throw new Error(`Failed to load skill data: ${response.status}`);
    }

    const skills = await response.json();
    return Array.isArray(skills) ? skills : [];
}

function getSkillLabels(skillIds = [], skills = []) {
    const labelsById = new Map(
        skills
            .filter((skill) => skill?.id && skill?.label)
            .map((skill) => [skill.id, skill.label])
    );

    return skillIds
        .filter(Boolean)
        .map((skillId) => labelsById.get(skillId) || humanizeId(skillId));
}

function renderProjectDetail(container, project, skills) {
    container.replaceChildren();

    if (!project) {
        renderStatus(container, "Project details coming next.");
        return;
    }

    const fragment = document.createDocumentFragment();

    const header = createProjectHeader(project);
    if (header) fragment.append(header);

    const image = createProjectImage(project);
    if (image) fragment.append(image);

    const badges = createTextList("Tools", project.badges, "project-pill-list");
    if (badges) fragment.append(badges);

    const bullets = createBulletSection(project.bullets);
    if (bullets) fragment.append(bullets);

    const relatedSkills = createTextList(
        "Related Skills",
        getSkillLabels(project.relatedSkills, skills),
        "project-pill-list"
    );
    if (relatedSkills) fragment.append(relatedSkills);

    const codeSample = createCodeSample(project.code);
    if (codeSample) fragment.append(codeSample);

    const metrics = createMetricsSection(project.metrics);
    if (metrics) fragment.append(metrics);

    const links = createLinksSection(project.links);
    if (links) fragment.append(links);

    container.append(fragment);
}

function createProjectHeader(project) {
    const header = document.createElement("header");
    header.className = "project-detail__header";

    if (project.title) {
        const title = document.createElement("h3");
        title.textContent = project.title;
        header.append(title);
    }

    const metaItems = [project.organization, project.role, project.dates].filter(Boolean);
    if (metaItems.length > 0) {
        const meta = document.createElement("p");
        meta.className = "project-detail__meta";
        meta.textContent = metaItems.join(" · ");
        header.append(meta);
    }

    return header.childElementCount > 0 ? header : null;
}

function createProjectImage(project) {
    const imageData = project.image;
    const src = typeof imageData === "string" ? imageData : imageData?.src;
    if (!src) return null;

    const figure = document.createElement("figure");
    figure.className = "project-detail__image";

    const image = document.createElement("img");
    image.src = src;
    image.alt = typeof imageData === "object" && imageData.alt ? imageData.alt : project.title || "";
    image.loading = "lazy";
    figure.append(image);

    return figure;
}

function createTextList(title, items = [], className = "") {
    const values = items.filter(Boolean);
    if (values.length === 0) return null;

    const section = createSection(title);
    const list = document.createElement("ul");
    if (className) list.className = className;

    values.forEach((value) => {
        const item = document.createElement("li");
        item.textContent = value;
        list.append(item);
    });

    section.append(list);
    return section;
}

function createBulletSection(bullets = []) {
    const values = bullets.filter((bullet) => bullet?.label || bullet?.text);
    if (values.length === 0) return null;

    const section = createSection("Highlights");
    const list = document.createElement("ul");
    list.className = "project-detail__bullets";

    values.forEach((bullet) => {
        const item = document.createElement("li");

        if (bullet.label) {
            const label = document.createElement("strong");
            label.textContent = bullet.label;
            item.append(label);
        }

        if (bullet.text) {
            if (bullet.label) item.append(document.createTextNode(": "));
            item.append(document.createTextNode(bullet.text));
        }

        list.append(item);
    });

    section.append(list);
    return section;
}

function createCodeSample(code) {
    if (!code) return null;

    const section = createSection("Code Sample");
    const pre = document.createElement("pre");
    const codeElement = document.createElement("code");
    codeElement.textContent = code;

    pre.append(codeElement);
    section.append(pre);
    return section;
}

function createMetricsSection(metrics) {
    const values = normalizeItems(metrics);
    if (values.length === 0) return null;

    const section = createSection("Metrics");
    const list = document.createElement("ul");
    list.className = "project-detail__metrics";

    values.forEach((metric) => {
        const item = document.createElement("li");
        item.textContent = metric;
        list.append(item);
    });

    section.append(list);
    return section;
}

function createLinksSection(links) {
    const values = normalizeLinks(links);
    if (values.length === 0) return null;

    const section = createSection("Links");
    const list = document.createElement("ul");

    values.forEach((link) => {
        const item = document.createElement("li");
        const anchor = document.createElement("a");
        anchor.href = link.href;
        anchor.textContent = link.label;
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
        item.append(anchor);
        list.append(item);
    });

    section.append(list);
    return section;
}

function createSection(titleText) {
    const section = document.createElement("section");
    section.className = "project-detail__section";

    const title = document.createElement("h4");
    title.textContent = titleText;
    section.append(title);

    return section;
}

function normalizeItems(items) {
    if (!items) return [];
    const values = Array.isArray(items) ? items : Object.entries(items);

    return values
        .map((item) => {
            if (typeof item === "string") return item;
            if (Array.isArray(item)) return `${humanizeId(item[0])}: ${item[1]}`;
            if (item?.label && item?.value) return `${item.label}: ${item.value}`;
            if (item?.text) return item.text;
            return "";
        })
        .filter(Boolean);
}

function normalizeLinks(links) {
    if (!links) return [];
    const values = Array.isArray(links) ? links : Object.entries(links);

    return values
        .map((link) => {
            if (typeof link === "string") return { href: link, label: link };
            if (Array.isArray(link)) return { href: link[1], label: humanizeId(link[0]) };
            return {
                href: link?.href || link?.url,
                label: link?.label || link?.title || link?.text || link?.href || link?.url,
            };
        })
        .filter((link) => link.href && link.label);
}

function renderStatus(container, message) {
    container.replaceChildren();
    const status = document.createElement("p");
    status.textContent = message;
    container.append(status);
}

function humanizeId(value = "") {
    return String(value)
        .split("-")
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}
