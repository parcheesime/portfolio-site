const PROJECT_ORDER = [
    "google-io",
    "google-sustainability",
    "bondcliq-data-quality",
    "airthings-dashboard",
    "hack-for-la",
    "hopeview-mobile",
];

const explorerState = {
    projects: [],
    skills: [],
    selectedProjectId: null,
    selectedSkillId: null,
    selectedView: { type: "project", id: null },
    detailPanel: null,
    navPanel: null,
    skillMap: null,
};

export async function initProjectExplorer() {
    const explorer = document.querySelector("[data-project-explorer]");
    if (!explorer) return;

    const detailPanel = explorer.querySelector("[data-project-detail]");
    if (!detailPanel) return;
    const navPanel = explorer.querySelector("[data-project-nav]");
    const skillMap = document.querySelector("[data-skill-map]");

    try {
        const [projects, skills] = await Promise.all([
            loadProjectData(),
            loadSkillData(),
        ]);

        explorerState.projects = orderProjects(projects);
        explorerState.skills = skills;
        explorerState.selectedProjectId = explorerState.projects[0]?.id || null;
        explorerState.selectedSkillId = null;
        explorerState.selectedView = {
            type: "project",
            id: explorerState.selectedProjectId,
        };
        explorerState.detailPanel = detailPanel;
        explorerState.navPanel = navPanel;
        explorerState.skillMap = skillMap;

        renderProjectNavigation();
        renderSkillMap();
        updateSelectedProject();
    } catch (error) {
        renderStatus(detailPanel, "Project details are unavailable right now.");
    }
}

function orderProjects(projects) {
    const projectsById = new Map(projects.map((project) => [project.id, project]));
    return PROJECT_ORDER
        .map((projectId) => projectsById.get(projectId))
        .filter(Boolean);
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

function renderProjectNavigation() {
    const { navPanel, projects } = explorerState;
    if (!navPanel) return;

    navPanel.replaceChildren();

    if (projects.length === 0) {
        renderStatus(navPanel, "Project navigation coming next.");
        return;
    }

    const list = document.createElement("ul");
    list.className = "project-nav__list";

    projects.forEach((project) => {
        const item = document.createElement("li");
        const button = document.createElement("button");

        button.type = "button";
        button.className = "project-nav__button";
        button.dataset.projectId = project.id;
        button.textContent = getProjectNavLabel(project);
        button.addEventListener("click", () => selectProject(project.id));
        button.addEventListener("keydown", handleProjectNavKeydown);

        item.append(button);
        list.append(item);
    });

    navPanel.append(list);
    updateNavigationState();
}

function selectProject(projectId) {
    if (
        projectId === explorerState.selectedProjectId &&
        explorerState.selectedView?.type === "project"
    ) {
        return;
    }

    explorerState.selectedProjectId = projectId;
    explorerState.selectedView = { type: "project", id: projectId };
    updateSelectedProject();
}

function updateSelectedProject() {
    renderSelectedView();
    updateNavigationState();
    updateSkillMap();
}

function updateNavigationState() {
    const { navPanel, selectedView } = explorerState;
    if (!navPanel) return;

    navPanel.querySelectorAll("[data-project-id]").forEach((button) => {
        const projectId = button.dataset.projectId;
        const isProjectViewActive =
            selectedView?.type === "project" && projectId === selectedView.id;
        const isRelatedProject =
            selectedView?.type === "skill" &&
            getProjectSkillIds(projectId).has(selectedView.id);
        const isHighlighted = isProjectViewActive || isRelatedProject;

        button.classList.toggle("is-active", isHighlighted);
        button.classList.toggle("is-selected", isProjectViewActive);
        button.classList.toggle("is-related", isRelatedProject);
        button.setAttribute("aria-current", isProjectViewActive ? "true" : "false");
        button.setAttribute("aria-pressed", String(isHighlighted));
    });
}

function handleProjectNavKeydown(event) {
    const buttons = Array.from(
        explorerState.navPanel?.querySelectorAll("[data-project-id]") || []
    );
    const currentIndex = buttons.indexOf(event.currentTarget);
    if (currentIndex === -1) return;

    const keyActions = {
        ArrowDown: () => (currentIndex + 1) % buttons.length,
        ArrowRight: () => (currentIndex + 1) % buttons.length,
        ArrowUp: () => (currentIndex - 1 + buttons.length) % buttons.length,
        ArrowLeft: () => (currentIndex - 1 + buttons.length) % buttons.length,
        Home: () => 0,
        End: () => buttons.length - 1,
    };

    const getNextIndex = keyActions[event.key];
    if (!getNextIndex) return;

    event.preventDefault();
    const nextButton = buttons[getNextIndex()];
    nextButton.focus();
    selectProject(nextButton.dataset.projectId);
}

function renderSkillMap() {
    const { skillMap, skills } = explorerState;
    if (!skillMap) return;

    skillMap.replaceChildren();

    const list = document.createElement("ul");
    list.className = "skill-map__list";

    skills.forEach((skill) => {
        if (!skill?.id || !skill?.label) return;

        const item = document.createElement("li");
        const button = document.createElement("button");
        button.type = "button";
        button.className = "skill-map__node";
        button.dataset.skillId = skill.id;
        button.setAttribute("aria-pressed", "false");
        button.addEventListener("click", () => selectSkill(skill.id));
        button.addEventListener("keydown", handleSkillMapKeydown);

        const label = document.createElement("span");
        label.className = "skill-map__label";
        label.textContent = skill.label;

        const status = document.createElement("span");
        status.className = "skill-map__status";
        status.textContent = "Used in selected project";

        button.append(label, status);
        item.append(button);
        list.append(item);
    });

    skillMap.append(list);
}

function updateSkillMap() {
    const { skillMap } = explorerState;
    if (!skillMap) return;

    const selectedView = explorerState.selectedView || {
        type: "project",
        id: explorerState.selectedProjectId,
    };
    const activeSkillIds =
        selectedView.type === "skill"
            ? new Set([selectedView.id].filter(Boolean))
            : getActiveSkillIds();

    skillMap.querySelectorAll("[data-skill-id]").forEach((node) => {
        const isActive = activeSkillIds.has(node.dataset.skillId);
        const isSelected =
            selectedView.type === "skill" && node.dataset.skillId === selectedView.id;
        node.classList.toggle("is-active", isActive);
        node.classList.toggle("is-selected", isSelected);
        node.setAttribute("aria-pressed", String(isSelected));
    });
}

function selectSkill(skillId) {
    explorerState.selectedSkillId = skillId;
    explorerState.selectedView = { type: "skill", id: skillId };
    renderSelectedView();
    updateSkillMap();
    updateNavigationState();
}

function getProjectsForSkill(skillId) {
    if (!skillId) return [];

    return explorerState.projects.filter((project) =>
        Array.isArray(project?.relatedSkills) && project.relatedSkills.includes(skillId)
    );
}

function getProjectSkillIds(projectId) {
    const project = explorerState.projects.find((item) => item.id === projectId);
    return new Set(project?.relatedSkills || []);
}

function getActiveSkillIds() {
    const selectedProject = explorerState.projects.find(
        (project) => project.id === explorerState.selectedProjectId
    );

    return new Set(selectedProject?.relatedSkills || []);
}

function renderSelectedView() {
    const selectedView = explorerState.selectedView || {
        type: "project",
        id: explorerState.selectedProjectId,
    };

    if (selectedView.type === "skill") {
        renderSkillDetail(selectedView.id);
        return;
    }

    renderProjectDetail(selectedView.id);
}

function renderProjectDetail(projectId) {
    const { detailPanel: container, projects } = explorerState;
    const project = projects.find((item) => item.id === projectId);

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

    const metrics = createMetricsSection(project.metrics);
    if (metrics) fragment.append(metrics);

    const links = createLinksSection(project.links);
    if (links) fragment.append(links);

    container.append(fragment);
}

function renderSkillDetail(skillId) {
    const { detailPanel: container, skills } = explorerState;
    const skill = skills.find((item) => item?.id === skillId);
    const projects = getProjectsForSkill(skillId);

    container.replaceChildren();

    if (!skillId) {
        renderStatus(container, "Skill details coming next.");
        return;
    }

    const fragment = document.createDocumentFragment();
    const header = document.createElement("header");
    header.className = "project-detail__header";

    const title = document.createElement("h3");
    title.textContent = skill?.label || humanizeId(skillId);
    header.append(title);

    const summary = document.createElement("p");
    summary.className = "skill-detail__summary";
    summary.textContent = `Demonstrated in ${projects.length} ${
        projects.length === 1 ? "project" : "projects"
    }`;
    header.append(summary);

    const category = skill?.category || skill?.type;
    if (category) {
        const meta = document.createElement("p");
        meta.className = "project-detail__meta";
        meta.textContent = category;
        header.append(meta);
    }

    const description = skill?.description || skill?.summary;
    if (description) {
        const copy = document.createElement("p");
        copy.className = "skill-detail__description";
        copy.textContent = description;
        header.append(copy);
    }

    fragment.append(header);
    fragment.append(createSkillProjectsList(projects));
    container.append(fragment);
}

function createSkillProjectsList(projects) {
    if (projects.length === 0) {
        const emptyState = document.createElement("p");
        emptyState.className = "skill-detail__empty";
        emptyState.textContent = "No projects use this skill yet.";
        return emptyState;
    }

    const list = document.createElement("ul");
    list.className = "skill-detail__projects-list";

    projects.forEach((project) => {
        const item = document.createElement("li");
        const button = document.createElement("button");

        button.type = "button";
        button.className = "skill-detail__project-button";
        button.textContent = getProjectNavLabel(project);
        button.addEventListener("click", () => selectProject(project.id));

        item.append(button);
        list.append(item);
    });

    return list;
}

function handleSkillMapKeydown(event) {
    const buttons = Array.from(
        explorerState.skillMap?.querySelectorAll("[data-skill-id]") || []
    );
    const currentIndex = buttons.indexOf(event.currentTarget);
    if (currentIndex === -1) return;

    const keyActions = {
        ArrowDown: () => (currentIndex + 1) % buttons.length,
        ArrowRight: () => (currentIndex + 1) % buttons.length,
        ArrowUp: () => (currentIndex - 1 + buttons.length) % buttons.length,
        ArrowLeft: () => (currentIndex - 1 + buttons.length) % buttons.length,
        Home: () => 0,
        End: () => buttons.length - 1,
    };

    const getNextIndex = keyActions[event.key];
    if (!getNextIndex) return;

    event.preventDefault();
    const nextButton = buttons[getNextIndex()];
    nextButton.focus();
    selectSkill(nextButton.dataset.skillId);
}

function getProjectNavLabel(project) {
    if (project.id === "bondcliq-data-quality") return "BondCliQ Data Platform";
    if (project.id === "google-sustainability") return "Sustainability Platform";
    return project.title || project.frontTitle || humanizeId(project.id);
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
