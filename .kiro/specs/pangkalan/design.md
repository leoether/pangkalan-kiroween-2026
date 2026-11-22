# Pangkalan — Design

## Overview
Single-page Vite + React + TypeScript app. No backend, no network calls after first load.
State lives in React and persists to `localStorage` (key `pangkalan-state-v1`).
Mobile-first single column, Bahasa Indonesia UI.

## Architecture
- `src/App.tsx` — root component, owns state, composes sections.
- `src/lib/pangkalan.ts` — pure domain logic (queue rotation, fare calc, trip summary).
  Pure functions, easily unit-testable, no React imports.
- `src/components/QueueSection.tsx` — driver queue: add driver, show positions, next turn, start trip.
- `src/components/FareCalculator.tsx` — distance input → fare (Rp 2.600/km), example routes.
- `src/components/TripLog.tsx` — trip list + daily summary + delete.
- `src/App.css` / `src/index.css` — simple, high-contrast mobile styling.

## Data Model
```ts
interface Driver { id: string; name: string; joinedAt: number }
interface Trip {
  id: string;
  driverId: string;
  driverName: string;
  destination: string;
  distanceKm: number;
  fare: number;       // rupiah
  finishedAt: number; // epoch ms
}
interface PangkalanState { drivers: Driver[]; trips: Trip[] }
```

## Key Rules
- Fare: `fare = Math.round(distanceKm * 2600)` (Kepmenhub KP 348/2019 Zona III ceiling).
- Rotation: starting a trip removes the front driver; finishing a trip re-appends them.
- "Giliran Berikutnya" = `drivers[0]`.
- Daily summary: trips whose `finishedAt` falls on the current local calendar day.
- Rupiah formatting: `Intl.NumberFormat('id-ID')` with `Rp` prefix.
- Persistence: every state change writes the whole state to localStorage (debounce not needed at this scale).
- No external requests at runtime (no fonts/CDN) so the app works offline after first load.

## Testing
- Build must pass: `npm run build` (tsc + vite build).
- Smoke test: load the built page, add a driver, start + finish a trip, check the trip appears
  in the log and the daily summary updates; reload and confirm persistence.
