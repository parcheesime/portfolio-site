# Aletia Trepte | Portfolio Website

A responsive portfolio site built as a modular front-end application. It combines static content, JSON-driven rendering, analytics, and accessible interactions to present project and skills work clearly.

## Live Site

[Visit the portfolio](https://parcheesime.github.io/portfolio-site/)

## Highlights

- Modular ES module architecture for clear feature boundaries and maintainable behavior
- Data-driven rendering from JSON for project content
- Custom Web Components for reusable project card interactions
- GA4 analytics instrumentation for key engagement events
- Accessibility work with semantic structure, keyboard-friendly interactions, and Lighthouse-focused improvements
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
│   ├── data/
│   │   └── projects.json
│   └── features/
│       ├── analytics.js
│       ├── back-to-top.js
│       ├── fun-facts.js
│       ├── project-explorer.js
│       └── render-projects.js
├── components/
│   └── project-card.js
└── assets/
    ├── resume.pdf
    ├── me2.webp
    └── icons/
```

## Architecture

- `src/main.js` wires up the app on `DOMContentLoaded`
- `src/features/project-explorer.js` initializes the project explorer shell
- `src/features/render-projects.js` and `components/project-card.js` are retained for project rendering work
- `src/features/analytics.js` centralizes GA4 event tracking

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
- Add richer motion and transition states where appropriate
- Continue refining accessibility, performance, and content structure

## Contact

**Aletia Trepte**  
`aletia.trepte@gmail.com`  
[linkedin.com/in/aletia-trepte](https://www.linkedin.com/in/aletia-trepte)
