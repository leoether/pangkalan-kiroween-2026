# Pangkalan — Digital Ojek Base Station

**Kiroween 2026 · Category: Resurrection**

Pangkalan brings the traditional Indonesian ojek pangkalan (motorcycle-taxi base station)
back to life as an offline-first web app. Drivers wait in a fair rotation at a physical
base; the app manages the queue, computes the official fare, and keeps the daily trip log.

Live demo: https://leoether.github.io/pangkalan-kiroween-2026/

## Features

- **Fair rotation queue** — add drivers to the queue, see each driver's position and the
  next turn ("Giliran Berikutnya"); starting a trip takes the front driver out, finishing
  a trip puts them back at the end of the line.
- **Fare calculator** — official government ceiling rate, Kepmenhub KP 348/2019 Zona III:
  **Rp 2,600/km**. Example: Sambaliung–Bandara, 12.5 km = Rp 32,500.
- **Trip log (offline-first)** — every completed trip (driver, destination, distance, fare,
  time) is stored in `localStorage`; daily summary shows trip count and total pangkalan
  revenue. Works fully offline after first load — no backend, no network calls.
- **Mobile-first UI in Bahasa Indonesia** — built for drivers' phones.

## Built with Kiro

This app was built spec-driven with **Kiro CLI** (agentic coding):

- `.kiro/specs/pangkalan/` — `requirements.md`, `design.md`, `tasks.md`
- `.kiro/steering/` — product, tech, and structure guidance
- `.kiro/hooks/` — build-check hook

The implementation (domain logic, components, styling, build) was produced by Kiro CLI
(`kiro-cli chat --no-interactive`) from those specs, then verified with a production
build and a headless-Chromium end-to-end smoke test (`npm run test:e2e`).

## Tech

Vite 6 + React 19 + TypeScript. No backend.

```bash
npm install
npm run build    # tsc + vite build
npm run preview  # serve the production build
npm run test:e2e # Playwright smoke test (needs Chromium in ~/.cache/ms-playwright)
```

## License

Apache-2.0 — see [LICENSE](LICENSE).
