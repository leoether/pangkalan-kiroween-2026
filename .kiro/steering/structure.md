# Structure — Pangkalan

```
.
├── .kiro/
│   ├── specs/pangkalan/      # requirements.md, design.md, tasks.md
│   ├── steering/             # product.md, tech.md, structure.md
│   └── hooks/                # agent hooks (JSON)
├── public/
│   └── favicon.svg
├── src/
│   ├── lib/pangkalan.ts      # pure domain logic (fare, queue, summary)
│   ├── components/
│   │   ├── QueueSection.tsx
│   │   ├── FareCalculator.tsx
│   │   └── TripLog.tsx
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```
