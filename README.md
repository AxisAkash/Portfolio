# Rakibul Islam Akash — Portfolio

Editorial engineering portfolio for Rakibul Islam Akash, a software engineer in Dhaka building secure, role-based full-stack and mobile products.

## Stack

- Semantic HTML5
- CSS custom properties, fluid type, responsive CSS grid
- Vanilla ES modules
- GitHub Pages from `main` / root
- No framework, bundler, or build step

## Run locally

From the repository root:

```bash
python -m http.server 4173
```

Open `http://localhost:4173/`. ES modules and relative asset paths require a server rather than opening `index.html` directly.

## Single source of truth

Edit `data/site.js` for identity, the authoritative `baseUrl`, availability text, résumé path, contact endpoint, and optional content flags. Project facts and project links live in `data/projects.js`.

`baseUrl` is currently `https://axisakash.github.io/Portfolio/`. Runtime canonical, Open Graph, Twitter, JSON-LD, and image URLs are derived from it. The static `robots.txt` and `sitemap.xml` must also be updated when changing deployment location:

- Custom domain: set `baseUrl` to the HTTPS domain with a trailing slash, then update the two static SEO files and GitHub Pages custom-domain setting.
- Root repository `axisakash.github.io`: set `baseUrl` to `https://axisakash.github.io/`, then update `robots.txt` and `sitemap.xml`; relative paths remain unchanged.

Null, empty, and false values are intentionally hidden by the renderer. There are no placeholder links.

## Fill-in checklist

- [x] Resume PDF: `assets/Rakibul_Islam_Akash_CV.pdf` is included and enabled through `data/site.js` → `resumePath`.
- [x] LinkedIn URL: verified against the included CV: `linkedin.com/in/rakibul-islam-akash-2a0054347`.
- [ ] Form endpoint: `data/site.js` → `formEndpoint` is `null`. Add a Formspree or Web3Forms endpoint to enable the form; email-first mode is the current safe fallback.
- [ ] SOFOL live URL: `data/projects.js` → `links.live` is `null`.
- [ ] SOFOL GitHub URL: `data/projects.js` → `links.github` is `null`.
- [ ] SOFOL backend URL: `data/projects.js` → `links.backend` is `null`.
- [ ] Car Rent live URL: `data/projects.js` → `links.live` is `null`.
- [ ] Car Rent GitHub URL: `data/projects.js` → `links.github` is `null`.
- [ ] Car Rent backend URL: `data/projects.js` → `links.backend` is `null`.
- [ ] AI Calculator live URL: `data/projects.js` → `links.live` is `null`.
- [ ] AI Calculator GitHub URL: `data/projects.js` → `links.github` is `null`.
- [ ] AI Calculator backend URL: `data/projects.js` → `links.backend` is `null`.
- [ ] Rental live URL: `data/projects.js` → `links.live` is `null`.
- [ ] Rental backend URL: `data/projects.js` → `links.backend` is `null`.
- [ ] Project screenshots: each `visual.type` is currently `diagram`. Add files under `assets/projects/<slug>/`, set `visual.type` to `screenshot`, and provide each file's `src`, explicit `width`/`height`, and descriptive `alt` in `visual.files`.
- [ ] Optional Hindi: `data/site.js` → `optional.hindi` is `false`.
- [ ] Optional Docker & CI/CD: `data/site.js` → `optional.dockerCi` is `false`.
- [ ] Optional research interests: `data/site.js` → `optional.research` is `false`.

## Accessibility and motion

The site includes a skip link, keyboard-operable navigation, focus-visible rings, dialog focus management, an Escape close path, reduced-motion handling, forced-colors support, and an email fallback for contact failures. The mobile menu is a full-screen sheet with Escape support and focus return.

## Deployment

The intended deployment is GitHub Pages: repository `Settings` → `Pages` → `Deploy from a branch` → `main` → `/ (root)`. `.nojekyll` is included so static assets are served as-is.

## Design notes

The visual language is editorial engineering: warm paper tones, a restrained jade accent, serif display type, sans body copy, mono metadata, system-map covers, hairlines, and no stock imagery. The dark theme is default and the selected theme is persisted without a first-paint flash.
