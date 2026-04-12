# Mall of America - Interactive Sales Deck

A cinematic, video-first interactive sales deck built to present a large-scale retail destination as a commercial opportunity.

Single-page interactive sales presentation for Mall of America, built as a static web experience. The project is designed to communicate leasing, sponsorship, dining, entertainment, and event opportunities through cinematic media, editorial storytelling, and lightweight interactive modules.

---

## Overview

This project delivers a polished **browser-based sales deck**, not a traditional marketing website.

It uses a **narrative-driven, single-page structure** to guide stakeholders through the commercial value of the property, supported by interactive components such as:

* Animated KPIs
* Section-aware navigation
* Horizontal dining showcase
* Expandable events sub-module with dynamic venue details

---

## Key Highlights

* Single-page storytelling optimized for **sales presentations and stakeholder walkthroughs**
* Cinematic **video-led hero section** with strong commercial positioning
* Modular sections for **retail, luxury, dining, entertainment, events, and opportunities**
* Expandable **events module** with switchable venue data and capacity details
* Fully responsive across **desktop, tablet, and mobile**
* Motion effects implemented using **progressive enhancement**
* Built-in **reduced-motion support** for accessibility

---

## Tech Stack

* **HTML5** — semantic structure
* **CSS3** — custom properties, gradients, responsive layouts
* **JavaScript** — UI logic and interactivity
* **Bootstrap 5** — layout/grid utilities
* **GSAP** — animations and counters
* **Google Fonts** — `Montserrat`, `Playfair Display`
* **Browser APIs** — `IntersectionObserver`, `requestAnimationFrame`, `requestIdleCallback`

---

## Project Structure

```text
.
├── index.html
├── README.md
└── assets
    ├── css
    │   └── styles.css
    ├── img
    ├── js
    │   └── app.js
    └── video
```

---

## Getting Started

### Prerequisites

* Modern browser (Chrome, Edge, Firefox)
* Optional: Python or Node.js for local server

### Local Setup

Clone or download the project, then run:

#### Using Python

```bash
python -m http.server 8080
```

#### Using Node

```bash
npx serve .
```

Open in browser:

```text
http://localhost:8080
```

> You can open `index.html` directly, but a local server is recommended.

---

## How to Work on the Project

* **HTML:** `index.html` → structure & content
* **CSS:** `assets/css/styles.css` → layout, theme, responsiveness
* **JS:** `assets/js/app.js` → animations, interactions, modules

---

## Core Experience Areas

* **Hero** — cinematic intro with animated metrics
* **Why This Property** — positioning and demand narrative
* **Retail Power** — merchandising and commercial story
* **Luxury** — premium brand-fit positioning
* **Dining** — horizontally scrollable lifestyle cards
* **Attractions & Entertainment** — key differentiators
* **Events Platform** — venue and activation storytelling
* **Opportunities** — leasing, sponsorship, event CTAs
* **Events Module** — dynamic expandable venue details

---

## Design Decisions

* **Static-first architecture** — easy deployment, no build system
* **Single-page narrative model** — optimized for presentation storytelling
* **Hybrid styling** — Bootstrap for layout, custom CSS for identity
* **Lightweight JS** — no framework overhead
* **Selective animation** — GSAP for key moments, native APIs for efficiency
* **Content-driven interaction** — dynamic data without duplicating markup
* **Responsive tuning** — section-specific adaptation

---

## Frontend Architecture Notes

* Single entry point: `index.html`
* Centralized styling: `assets/css/styles.css`
* Centralized logic: `assets/js/app.js`
* Some assets sourced from public Mall of America media

---

## Accessibility & Performance

* Semantic HTML structure
* Proper `alt` usage for images
* Reduced motion support (`prefers-reduced-motion`)
* Lazy loading for heavy media
* Scroll updates optimized with `requestAnimationFrame`
* Video playback optimized for visibility
* Deferred animation initialization

---

## External Dependencies

Loaded via CDN:

* Bootstrap
* GSAP
* Google Fonts

Some imagery/video sourced from public Mall of America assets.

> Can be vendored locally for offline or enterprise deployments.

---

## Deployment

Deploy directly to:

* GitHub Pages
* Netlify
* Vercel
* Any static server (Nginx/Apache)

No build step required.

---

## Content & Asset Notes

* Local assets: `assets/img`, `assets/video`
* Some remote assets used from public sources
* Content structured for **leasing, sponsorship, and event storytelling**

---

### Scope

* Used for documentation and code understanding
* Not part of runtime
* Core implementation remains **pure HTML/CSS/JS**

---
## 🔗 Live Demo

(https://khushalsehrawat.github.io/mall-project/)



## Author

**Khushal Sehrawat**

---

## Notes

This repository is optimized for **direct frontend editing without a build system**, enabling rapid iteration and easy deployment.
As the project scales, maintainability strategies may be required.
