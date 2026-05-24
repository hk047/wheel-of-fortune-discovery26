# City Fortune Wheel

A local React + TypeScript MVP for deterministic “Wheel of Fortune”-style city reveals.

## Run Locally

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in your terminal.

## CSV Format

```csv
name,city
Alice,Paris
Bob,Tokyo
Charlie,Paris
Dina,New York
```

Names are matched case-insensitively after trimming whitespace. CSV data is stored in `localStorage` so it persists after refresh.

## Scripts

```bash
npm run dev
npm run build
npm run test
```
