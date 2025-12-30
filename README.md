# Kevin & Sophie Wedding Website

A beautiful, elegant bilingual wedding website for Kevin (Gensheng) Zhang & Sophie (Ziqi) Su.

**Date**: May 30, 2026
**Venue**: Spencer's at the Waterfront, Burlington

## Tech Stack

- [Astro](https://astro.build/) - Static site generator
- TypeScript
- Pure CSS (no frameworks)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) in your browser.

### Build

```bash
npm run build
```

Static files will be generated in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
/
├── public/          # Static assets (images, fonts)
├── src/
│   ├── components/  # Astro components
│   ├── layouts/     # Page layouts
│   ├── pages/       # Page routes
│   ├── styles/      # Global CSS
│   ├── i18n/        # Translations (EN/CN)
│   └── utils/       # Utility functions
└── package.json
```

## Features

- Bilingual support (English / 中文)
- Responsive design
- Elegant white theme inspired by Spencer's at the Waterfront
- Sections: Hero, Our Story, Event Details, Travel, Gifts, RSVP

## Deployment

The `dist/` folder can be deployed to any static hosting:
- Netlify
- Vercel
- GitHub Pages
- Cloudflare Pages

---

Made with love for Kevin & Sophie's special day.
