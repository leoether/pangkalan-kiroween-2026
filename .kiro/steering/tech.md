# Tech — Pangkalan

- Vite 6 + React 19 + TypeScript (strict).
- No backend, no runtime network calls. State in localStorage (`pangkalan-state-v1`).
- Vite `base` is `/pangkalan-kiroween-2026/` (GitHub Pages project site).
- Domain logic lives in pure functions under `src/lib/` (no React imports there).
- UI text in Bahasa Indonesia; code comments and docs in English.
- Build: `npm run build` (tsc -b && vite build) must pass with zero errors.
- Formatting: 2-space indent, single quotes, semicolons.
