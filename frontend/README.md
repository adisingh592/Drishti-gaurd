# DrishtiGuard — Frontend

React 19 + Vite 6 + Tailwind CSS v4 web app for DrishtiGuard. It talks to the FastAPI backend in [`../backend`](../backend) through the `/api` proxy.

## Run

```bash
pnpm install
pnpm dev          # http://localhost:5173  (proxies /api → http://127.0.0.1:8000)
```

| Script | Purpose |
|---|---|
| `pnpm dev` | Dev server with hot reload |
| `pnpm build` | Production build to `dist/` |
| `pnpm preview` | Serve the production build |
| `pnpm typecheck` | TypeScript check (`tsc --noEmit`) |

Copy `.env.example` to `.env` only if the API is on a different origin. Then set `VITE_API_BASE_URL`.

## Source layout

```
src/
├── main.tsx                    # entry point
├── vite-env.d.ts               # Vite + env typings
├── app/
│   ├── App.tsx                 # ThemeProvider + router
│   ├── routes.tsx              # route table (/, /auth/*, /app/*)
│   ├── layouts/
│   │   └── RootLayout.tsx      # sidebar, top bar, module wheel/deck
│   ├── pages/                  # one file per route
│   │   ├── auth/               # login, signup, OTP, forgot password
│   │   └── *.tsx               # Dashboard, LiveDetection, UploadAnalyze, …
│   ├── components/
│   │   ├── brand/              # BrandMark logo
│   │   ├── landing/            # sections of the public landing page
│   │   ├── navigation/         # radial module wheel + bottom deck
│   │   └── theme/              # ThemeProvider, ThemeToggle
│   └── hooks/
│       └── useBackendHealth.ts # polls /api/health
├── services/api.ts             # typed client for the backend API
├── types/analysis.ts           # API response types
├── utils/analysisUi.ts         # maps API results to UI models
└── styles/
    ├── index.css               # imports the files below in order
    ├── fonts.css
    ├── tailwind.css
    ├── theme.css               # design tokens (olive theme, light + dark)
    └── globals.css             # shared utilities (glass, card-soft, …)
```

## Conventions

- **Imports:** use `@/` for anything under `src/` (for example `@/services/api`) and relative paths within a feature folder.
- **Pages** are route-level components. Reusable pieces go in `components/<group>/`.
- **Colours:** use the theme tokens (`bg-card`, `text-muted-foreground`, `text-safe`, `bg-olive-500`, …) instead of hex values. See the theme section in the [root README](../README.md#ui-and-theme).
