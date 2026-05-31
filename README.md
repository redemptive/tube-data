# tube-data

## Description
A static SvelteKit site that fetches live Tube and DLR service information from the TfL Unified API in the browser.

## Technologies
- SvelteKit
- Vite
- JavaScript
- CSS
- ESLint

## Local development
```sh
npm install
npm run dev
```

The dev server prints the local URL, usually `http://localhost:5173/`.

## Quality checks
```sh
npm run lint
npm run check
npm run build
```

`npm test` runs the lint and Svelte checks.

## Deployment
The site deploys to GitHub Pages with GitHub Actions on pushes to `main`.

Before the first deployment, set the repository Pages source to **GitHub Actions** in the GitHub repository settings. The production site is expected to be published at:

```text
https://redemptive.github.io/tube-data/
```
