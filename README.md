# CompIQ - Compensation Intelligence System

Track C demo task for the Full Stack Engineer role.

CompIQ is a level-first compensation intelligence MVP. It compares compensation by company, role, level, location, market, and compensation structure instead of treating job title as the main source of truth.

## Current Build

- Next.js App Router with TypeScript and TailwindCSS
- Frontend-first product with realistic typed mock data
- Salary explorer with search, filters, sorting, and comparison selection
- Company detail pages with level bands, role distribution, location distribution, and compensation breakdowns
- Research comparison sheet for Levels.fyi, 6figr, AmbitionBox, and Glassdoor
- Salary submission form with client-side validation, total compensation calculation, normalization, and duplicate warning behavior
- Mock API contract routes ready to swap to Prisma/Postgres:
  - `GET /api/salaries`
  - `POST /api/salaries`
  - `GET /api/companies`
  - `GET /api/companies/[slug]`
  - `GET /api/compare`

## Product Decisions

- Levels matter more than job titles, so the app treats level as a core comparison axis.
- Hybrid market support is included with USD and INR inputs.
- Original currency is preserved, while normalized USD total compensation enables cross-market comparison.
- Authentication is intentionally excluded from v1 so the demo focuses on compensation intelligence, validation, and end-to-end architecture.
- Data is synthetic for demo reliability. The app does not scrape competitor websites.

## Architecture

The frontend reads from a thin data-access layer in `src/lib/data-access.ts`. Today that layer returns typed mock data. The backend phase can replace the mock source with Prisma queries without rewriting UI screens.

Core domain logic lives in `src/lib/compensation.ts`:

- company name normalization
- total compensation calculation
- INR to USD normalization
- filtering and sorting
- median calculations
- submission validation
- likely duplicate detection

The route handlers in `src/app/api` expose the future backend contract even before Postgres is connected.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verify

```bash
npm run lint
npm run build
```

## Backend Next Steps

- Add Prisma schema for company, role, level, location, and salary submissions.
- Seed Neon/Postgres using the current mock dataset shape.
- Replace data-access functions with Prisma-backed queries.
- Persist `POST /api/salaries` after validation and duplicate detection.
- Keep the frontend response shapes unchanged.
