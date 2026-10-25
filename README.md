# Chirag Mittal — Data Analyst Portfolio

A responsive, no-build portfolio for Chirag Mittal, Data Analyst and future Data Scientist. It uses semantic HTML, modular CSS, native JavaScript ES modules, JSON project records, native canvas charts, and an optional Three.js scene.

## Run locally

The site fetches `data/projects.json` and uses ES modules, so serve it over HTTP rather than opening `index.html` with `file://`.

```bash
cd DA-resume
python3 -m http.server 3000
```

Open [http://localhost:3000](http://localhost:3000). Node.js users can instead run `npx serve .`.

## Structure

```text
.
├── index.html
├── css/
│   ├── base.css          # Theme tokens, document defaults, and accessibility
│   ├── layout.css        # Page layout, responsive rules, and effects
│   ├── components.css    # Buttons, cards, modal, and navigation
│   └── style.css         # Existing section styles imported by layout.css
├── js/
│   ├── main.js           # App initialization and project-data loading
│   ├── three-scene.js    # Lazy-loaded Three.js scene
│   ├── projects.js       # Reusable project-card rendering
│   ├── charts.js         # Native canvas charts (no chart dependency)
│   ├── animations.js     # Reveal, tilt, cursor, and count-up effects
│   ├── data.js           # Personal profile, skills, and certifications
│   ├── filters.js        # Skill and project filtering/search
│   ├── modal.js          # Accessible project detail modal
│   ├── navigation.js     # Theme, mobile menu, scroll progress
│   └── utils.js          # Profile content and link population
├── data/
│   └── projects.json     # Project records; add future Data Science work here
└── assets/
    ├── Chirag_Mittal_Resume.pdf
    ├── favicon-32.png
    ├── favicon-192.png
    └── favicon-512.png
```

The existing section and component CSS is retained in `css/style.css`; `css/layout.css` composes it with the responsive and animation styles. The requested entry-point stylesheets are loaded from `index.html`.

## Customize

- **Personal information:** edit `OWNER_CONFIG` near the top of `js/data.js`. The resume and favicon assets are in `assets/`.
- **Accent color:** change `--accent-primary`, `--accent-secondary`, and `--accent-glow` in `css/variables.css`.
- **Projects:** edit or append objects in `data/projects.json`. Each record has a `category` (`Data Analytics`, `Data Science`, or another category), description, problem, approach, tool list, quantified insight, chart type/data, links, and thumbnail/alt text. Supported chart types are `bar`, `line`, and `donut`. Project cards and detail modals render from this same schema. Current thumbnails use Unsplash's `auto=format` delivery so supported browsers receive optimized formats.

Serve the site over HTTP after editing so the JSON fetch and ES module imports work. Three.js is imported on demand from the pinned `three@0.170.0` CDN URL; if WebGL is unavailable, motion is reduced, or the device is low-end/data-saving, the page remains usable with its CSS gradient background. Charts use the built-in Canvas API.

## Accessibility and performance

- Keyboard-operable navigation, project cards, and modal; visible focus styling; status announcements for search and contact.
- Honors `prefers-reduced-motion`, pauses Three.js rendering when hidden or no page section is visible, and caps renderer pixel ratio at 2.
- Project thumbnails are lazy-loaded. The Three.js module is downloaded only when the hero nears the viewport.
- Responsive layouts cover narrow mobile (360px), tablet (768px), and desktop (1440px) widths.

## Push to GitHub

From this folder, create a repository on GitHub and use its URL in the first command:

```bash
git add index.html README.md css js data assets
git commit -m "Refactor and upgrade analyst portfolio"
git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPOSITORY>.git
git push -u origin HEAD
```

If an `origin` remote already exists, skip `git remote add origin ...`. For GitHub Pages, configure Pages in repository **Settings → Pages** and deploy from the root of the chosen branch.
