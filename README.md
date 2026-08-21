# Emme Enojado — Portfolio

A personal portfolio site for Emme Enojado, product designer. Features an interactive floating node canvas on desktop and a responsive stacked card layout on mobile, with a dark galaxy-inspired aesthetic.

Live: [emme-e-site.vercel.app](https://emme-e-site.vercel.app)

---

## Project Structure

```
my-site/
├── index.html          # Work page — floating project node canvas
├── about.html          # About page — centered bio layout
├── css/
│   ├── styles.css      # All styles (imports layout.css)
│   └── layout.css      # Base layout utilities
├── js/
│   ├── main.js         # Canvas nodes, hover cards, motion, mobile stack
│   ├── weather.js      # Live weather widget (geolocation + Open-Meteo API)
│   ├── clock.js        # Live digital clock widget
│   └── transitions.js  # Page fade/shimmer transitions + scroll contrast
├── assets/
│   ├── profile.jpg     # Profile photo
│   └── project-*.jpg  # Project thumbnail images
└── README.md
```

---

## Features

- **Desktop** — Floating animated project nodes with hover-to-freeze, draggable repositioning, and frosted-glass hover cards
- **Mobile** — Stacked project card view with staggered scroll entrance animations and tap feedback
- **Nav pill** — Centered glassmorphic pill with bracket `[ ]` hover/active states and page transitions
- **Weather widget** — Live single-line pill using Geolocation + Open-Meteo + BigDataCloud reverse geocoding
- **Clock widget** — Live digital clock mirrored opposite the weather widget
- **Page transitions** — Opacity fade with blue-white shimmer on entry; smooth fade on exit
- **Scroll contrast** — Nav and widgets darken automatically when scrolled over lighter content on mobile

---

## Tech Stack

- Vanilla HTML5, CSS3, JavaScript (no frameworks)
- Google Fonts: Instrument Sans, Oxygen Mono
- [Open-Meteo](https://open-meteo.com) — weather data (no API key required)
- [BigDataCloud](https://www.bigdatacloud.com) — reverse geocoding (no API key required)
- Deployed on [Vercel](https://vercel.com)

---

## Local Development

1. Clone the repo
2. Open with **VS Code Live Server** (required — geolocation does not work on `file://` URLs)
3. Visit `http://localhost:5500`
