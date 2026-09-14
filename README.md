# Kolik rohlíků?

A small Czech expense converter built with React, TypeScript, and Vite. No registration or backend. Example prices are illustrative, not live market data.

## Development

```sh
npm install
npm run dev
```

Open http://localhost:4318. Requires Node.js 22.12+ (or a newer supported LTS).

```sh
npm test          # Calculation tests
npm run build    # Strict TypeScript check and production build
npm run preview  # Serve the production build locally
```

Deploy the generated `dist/` directory to any static host.

## Structure

- `src/MountainApp.tsx`: Rohlíky-only React UI and growing bread mountain.
- `src/items.ts`: Typed comparison items, Czech formatting and result text.
- `src/math.ts`: Pure parsing and integer-cent calculations.
- `src/preferences.ts`: Validated local prices and share-link initialization.
- `src/style.css`: Existing responsive design and interaction styles.
- `public/assets/`: Flat isometric images, also used for the favicon.

Prices stay in browser storage when available. The amount and price accept Czech decimal commas. Invalid input pauses the calculation.

## Mountain version

The mountain calculator is the only app on `main`, served at `/`. The exact quantity and change use integer-cent calculations. The visual pile grows logarithmically and is capped at 240 sprites to keep extreme amounts responsive; reduced-motion preferences disable animation.

The two-version experiment (receipt plus mountain) is preserved in the separate `2ver` branch checkout at `../kolik-rohliku-2ver`. Its changes are staged for a manual commit.

## Launch metadata and policies

Set `url` (HTTPS), `operator`, `email`, and `hostingProvider` in `site.config.json`. `SITE_URL`, `SITE_OPERATOR`, and `SITE_EMAIL` environment variables can override the first three. Then run `npm run build` and `npm run check:launch`.

The generator creates Open Graph/Twitter metadata, canonical URLs, WebApplication structured data, `robots.txt`, `sitemap.xml`, `llms.txt`, a web manifest, and standalone Czech `/podminky.html` and `/soukromi.html` pages. `public/og.png` is the generated social preview. Fonts are served locally.

Until launch details are supplied, the output deliberately uses noindex/Disallow and an empty sitemap, and policy pages are marked as local drafts. Before publishing, confirm the hosting provider's actual log retention, purposes and handling of personal data and incorporate those details in the privacy text. The policy drafts describe this application's current behavior; they are not a claim of legal compliance.

Privacy drafting references: https://europa.eu/youreurope/business/governance-and-sustainability/digital-and-data-compliance/data-protection-gdpr/index_en.htm and https://commission.europa.eu/law/law-topic/data-protection/information-individuals_en .
