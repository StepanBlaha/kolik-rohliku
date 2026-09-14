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

- `src/App.tsx`: React UI, controlled inputs, copy and share actions.
- `src/items.ts`: Typed comparison items, Czech formatting and result text.
- `src/math.ts`: Pure parsing and integer-cent calculations.
- `src/preferences.ts`: Validated local prices and share-link initialization.
- `src/style.css`: Existing responsive design and interaction styles.
- `public/assets/`: Flat isometric images, also used for the favicon.

Prices stay in browser storage when available. Share links preserve the amount, selected item, and unit price. Invalid input disables copying/sharing. Clipboard failures provide selectable text.
