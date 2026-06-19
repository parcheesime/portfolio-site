# Aletia Trepte | Portfolio Website

A responsive portfolio site built as a modular front-end application. It combines static content, JSON-driven rendering, analytics, and two distinct interaction modes to present both a polished recruiter view and a more experimental explore view.

## Live Site

[Visit the portfolio](https://parcheesime.github.io/portfolio-site/)

## Highlights

- Modular ES module architecture for clear feature boundaries and maintainable behavior
- Data-driven rendering from JSON for projects and journey content
- Custom Web Components for reusable project card interactions
- GA4 analytics instrumentation for key engagement events
- Accessibility work with semantic structure, keyboard-friendly interactions, and Lighthouse-focused improvements
- Recruiter vs Explore Mode for two different presentation styles in one site
- Gamification system with score, quests, and feature-based interactions
- Responsive design improvements across mobile, tablet, and desktop layouts
- GitHub Pages deployment for static hosting
- Reduced motion support through `prefers-reduced-motion`
- Modern color system built from reusable CSS variables
- Future roadmap section to track planned enhancements

## Project Structure

```text
.
├── index.html
├── style.css
├── src/
│   ├── main.js
│   ├── app-state.js
│   ├── data/
│   │   ├── projects.json
│   │   └── journey.json
│   └── features/
│       ├── analytics.js
│       ├── back-to-top.js
│       ├── fun-facts.js
│       ├── journey.js
│       ├── mode-toggle.js
│       ├── quest-system.js
│       ├── render-journey.js
│       ├── render-projects.js
│       └── score-system.js
├── components/
│   └── project-card.js
└── assets/
    ├── resume.pdf
    ├── me2.webp
    └── icons/
```

## Architecture

- `src/main.js` wires up the app on `DOMContentLoaded`
- `src/features/render-projects.js` and `src/features/render-journey.js` load content from JSON
- `components/project-card.js` hydrates the custom project card interaction
- `src/features/analytics.js` centralizes GA4 event tracking
- `src/features/mode-toggle.js` manages Recruiter and Explore modes
- `src/features/quest-system.js` and `src/features/score-system.js` provide the gamified experience

## Design And Accessibility

- CSS variables define the palette and reusable color system in `style.css`
- Layout adapts through responsive flex and grid rules
- Motion is reduced for users who prefer less animation
- Interactive elements are instrumented and styled to keep the experience readable and usable

## Running Locally

1. Clone or download the repository
2. Open the folder in your editor
3. Open `index.html` in a browser, or use a local server such as Live Server

## Deployment

The site is published through GitHub Pages. The live URL is configured at:

`https://parcheesime.github.io/portfolio-site/`

## Future Roadmap

- Add more projects and case studies
- Expand the explore-mode gamification layer
- Add richer motion and transition states where appropriate
- Continue refining accessibility, performance, and content structure

## Contact

**Aletia Trepte**  
`aletia.trepte@gmail.com`  
[linkedin.com/in/aletia-trepte](https://www.linkedin.com/in/aletia-trepte)
