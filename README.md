# Aletia Trepte | Portfolio Website

A responsive portfolio site for presenting selected software engineering, data systems, analytics, automation, and civic technology work. The current site centers on a JSON-driven Professional Experience section with a connected Skill Map and a dedicated About page.

## Live Site

[Visit the portfolio](https://parcheesime.github.io/portfolio-site/)

## Current Architecture

- `index.html` contains the homepage, professional summary, Professional Experience shell, Skill Map panel, and technology section.
- `about.html` contains the dedicated About page and Fun Fact interaction.
- `src/main.js` initializes shared page features on `DOMContentLoaded`.
- `src/features/project-explorer.js` loads professional work and skill data, renders the selected professional highlight, renders navigation, and updates Skill Map highlights.
- `src/features/analytics.js` centralizes GA4 event tracking helpers.
- `src/features/back-to-top.js` handles the shared back-to-top button.
- `src/features/fun-facts.js` powers the About page Fun Fact button when present.
- `style.css` contains the responsive layout, Professional Experience section, Skill Map, technology pills, and shared page styles.

## Project Structure

```text
.
├── index.html
├── about.html
├── style.css
├── src/
│   ├── main.js
│   ├── data/
│   │   ├── projects.json
│   │   └── skills.json
│   └── features/
│       ├── analytics.js
│       ├── back-to-top.js
│       ├── fun-facts.js
│       └── project-explorer.js
└── assets/
    ├── Aletia Trepte 2026.pdf
    ├── resume.pdf
    ├── me2.webp
    └── icons/
```

## Professional Experience

Professional Experience is the primary homepage experience. It loads `src/data/projects.json`, selects the first ordered professional highlight by default, and renders:

- title, organization, role, and dates
- tools from the `badges` field
- highlight bullets
- related skills resolved from `skills.json`
- optional image, metrics, and links when present

Professional experience navigation is rendered as real buttons, supports keyboard navigation, and updates the selected highlight without reloading JSON.

## Skill Map

The Skill Map loads every skill from `src/data/skills.json`. When a professional highlight is selected, `project-explorer.js` compares the selected highlight's `relatedSkills` IDs against the skill list and applies active styles to matching skills.

Active skills use both visual styling and text exposed in the DOM so the state is not color-only.

## Data Model

### `projects.json`

Each project is an object with an `id` plus optional display fields:

- `title`
- `organization`
- `role`
- `dates`
- `badges`
- `bullets`
- `relatedSkills`
- `image`
- `metrics`
- `links`

The renderer skips missing or empty optional fields so incomplete project records do not create empty headings or containers.

### `skills.json`

Each skill is an object with:

- `id`
- `label`

Professional highlight `relatedSkills` values should match skill IDs. Unknown skill IDs fall back to a human-readable version of the ID.

## Accessibility

- Professional experience navigation uses native buttons.
- The selected navigation item uses `aria-current` and `aria-pressed`.
- Skill Map active states use an additional class and DOM text, not color alone.
- Focus styles are visible for keyboard users.
- Layouts are responsive and avoid horizontal scrolling.
- Reduced motion preferences are respected for animated elements.

## Analytics

GA4 is initialized in each HTML page. `src/features/analytics.js` provides a shared `trackEvent()` helper used by interactive features such as contact links, resume downloads, and Fun Facts.

## Running Locally

Use a local static server so JSON files load correctly:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

## Deployment

The site is published through GitHub Pages:

`https://parcheesime.github.io/portfolio-site/`

## Contact

**Aletia Trepte**  
`aletia.trepte@gmail.com`  
[linkedin.com/in/aletia-trepte](https://www.linkedin.com/in/aletia-trepte)
