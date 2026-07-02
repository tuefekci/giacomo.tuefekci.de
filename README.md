# Giacomo Tüfekci´s Portfolio (giacomo.tuefekci.de)

A personal portfolio website built with modern web technologies.

## Tech Stack

- **Framework:** [SvelteKit](https://kit.svelte.dev/) - Fast, lightweight web framework
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **Syntax Highlighting:** [Shiki](https://shiki.matsu.io/) - Beautiful code highlighting
- **Typography:** [Tailwind CSS Typography](https://github.com/tailwindcss/typography) - Beautiful default prose styles

## Features

- Responsive design for all devices
- Dark/Light mode support
- Blog with markdown support
- Portfolio showcase
- Resume/CV in multiple formats
- SEO optimized
- Fast page loads

## Quick Start

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
git clone https://github.com/tuefekci/portfolio.git
cd portfolio
npm install
npm run dev
```

### Building for Production

```bash
npm run build
```

The built files will be in the `docs/` directory.

## Project Structure

```
src/
├── lib/
│   ├── components/     # Reusable Svelte components
│   ├── stores/         # Svelte stores for state management
│   └── helper.ts       # Utility functions
├── routes/
│   ├── +layout.svelte  # Main layout
│   ├── +page.svelte    # Home page
│   ├── blog/           # Blog section
│   ├── portfolio/      # Portfolio section
│   └── resume/         # Resume section
└── data/
    ├── resume.json     # Main resume data
    └── posts/          # Blog posts (markdown)
```

## Customization

### Resume Data

Edit `src/data/resume.json` to update your personal information, work experience, education, skills, etc.
(There still might be some static data somewhere so dont just upload it!)

### Blog Posts

Create new markdown files in `src/data/posts/` with frontmatter:

```
---
title: Your Post Title
date: 2024-01-01
description: A brief description
categories: [Tag1, Tag2]
---
```

## Deployment

The site is automatically deployed to GitHub Pages using GitHub Actions on every push to the main branch.

## License

MIT License - free to use for personal and commercial projects.

If you have questions or need help understanding something, feel free to reach out.

## Contact

- Website: https://giacomo.tuefekci.de
- GitHub: https://github.com/tuefekci
- Email: [giacomo@tuefekci.de](mailto:giacomo@tuefekci.de)
