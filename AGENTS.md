# AGENTS.md

> Instructions and context for AI agents working on this repository.

## Project Overview

This is a **personal portfolio website** for Giovanni Zanotti, hosted via **GitHub Pages** at [gizano.dev](https://gizano.dev). It is a static site built with plain HTML, CSS, and JavaScript — no frameworks, no build step, no bundlers.

## Tech Stack

- **HTML5** — semantic, accessible markup
- **CSS3** — custom stylesheets in `Style/`, no preprocessors
- **JavaScript (ES6+)** — vanilla JS in `Script/`, no dependencies
- **Bootstrap 5.3** — loaded via CDN (`bootstrap.bundle.min.js`)
- **Font Awesome** — icons, served locally from `Style/font-awesome/`
- **Google Analytics** — GA4 via `gtag.js`
- **GitHub Pages** — deployment (automatic on push to `main`)

## Directory Structure

```
├── index.html                    # Homepage / portfolio landing page
├── privacy.html                  # Privacy policy page
├── 404.html                      # Custom 404 page
├── projects/                     # Project detail pages
│   ├── bench.html
│   ├── burrows-wheeler.html
│   ├── curious-traveler.html
│   ├── private-chat.html
│   ├── quakeguard.html
│   ├── telegram-bot.html
│   ├── web-presentations.html
│   ├── ajax-presentation/        # Reveal.js presentation subprojects
│   ├── api-presentation/
│   ├── be-more/
│   ├── digital-well-being-presentation/
│   ├── gabriele-dannunzio-presentation/
│   ├── mind-of-computers-presentation/
│   ├── software-architecture-presentation/
│   └── war-poets-presentation/
├── Style/
│   ├── globals.css               # Shared styles (CSS variables, base reset)
│   ├── index.css                 # Homepage-specific styles
│   ├── projects.css              # Shared project page styles
│   ├── quakeguard.css            # QuakeGuard-specific styles
│   └── font-awesome/             # Font Awesome icons (local)
├── Script/
│   ├── i18n.js                   # Internationalization engine (EN/IT)
│   ├── i18n/                     # Translation JSON files per page
│   ├── nav.js                    # Navbar behavior
│   ├── projects-grid.js          # Project grid filtering
│   ├── burrows-wheeler-demo.js   # BWT interactive demo
│   ├── quakeguard-demo.js        # QuakeGuard interactive demo
│   └── update-medium.py          # Script to pull latest Medium articles
├── assets/                       # Images, PDFs, and media per project
├── .github/workflows/            # CI: sitemap generation, Medium RSS, badges
├── CNAME                         # Custom domain config
├── sitemap.xml                   # Auto-generated sitemap
└── robots.txt                    # Crawler directives
```

## Conventions & Rules

### HTML
- All pages are **standalone HTML files** — there is no templating engine or includes system.
- Each project page and the homepage contain their own `<footer>` block. **Footer content must be kept in sync across all pages.**
- Use `data-i18n="key_name"` attributes for translatable text. The i18n system reads keys from JSON files in `Script/i18n/`.
- External links must include `target="_blank"` and `rel="noopener noreferrer"`.
- Email addresses in `mailto:` links are HTML-entity obfuscated (e.g., `&#46;` for dots, `&#64;` for `@`).

### Footer Structure
There are two footer patterns:

1. **Homepage (`index.html`)**: Social icons use class `social-icon` with `fa-2x` icons, placed in the `#contact` section above the `<footer>` copyright bar. Links are single-line `<a>` tags. The homepage footer is **inline** (not centralized).

2. **Project pages & privacy.html**: Footer is **centralized** via `Script/footer.js`. Each page only contains:
   ```html
   <div id="site-footer"></div>
   <script src="../Script/footer.js"></script>
   ```
   The script generates the full 3-column layout (brand/tagline, email CTA, social icons) + copyright bar. Social links are defined once in the `socials[]` array inside `footer.js`.

> **To add/remove social links**: edit the `socials[]` array in `Script/footer.js`. No need to touch individual HTML files (except `index.html` which has its own inline social icons in `#contact`, and `projects/quakeguard.html` which has its own independent footer with custom `qg-footer-bg` styling).

**Current social links (in order):** ORCID → LinkedIn → GitHub → Medium → YouTube

### CSS
- CSS custom properties are defined in `Style/globals.css` (`:root` block).
- Page-specific styles go in their own CSS files, not in `globals.css`.
- Use Bootstrap utility classes when possible; write custom CSS only when needed.

### JavaScript
- Vanilla JS only — no jQuery, no npm packages.
- Translation files are per-page JSON in `Script/i18n/` (e.g., `index.js`, `bench.js`).
- Scripts use `defer` attribute in `<script>` tags.

### Accessibility
- All links and buttons must have `aria-label` attributes.
- Focus states are styled with `outline` (defined in `globals.css`).
- Images should have meaningful `alt` text.

### Deployment
- Push to `main` → GitHub Pages auto-deploys.
- Three GitHub Actions workflows handle:
  - `generate-sitemap.yml` — rebuilds `sitemap.xml`
  - `medium-rss.yml` — fetches latest Medium articles
  - `badges.yml` — generates repo badges

## Social Links

When adding or modifying social links, update **all** footer instances across every HTML file:

| Platform | URL |
|----------|-----|
| ORCID | https://orcid.org/0009-0000-8900-9586 |
| LinkedIn | https://www.linkedin.com/in/giovanni-zanotti-it/ |
| GitHub | https://github.com/GiZano |
| Medium | https://medium.com/@gizano |
| YouTube | https://www.youtube.com/channel/UCgjix1Xt4O97c2sFsFN6_fQ |
