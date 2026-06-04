# CompIQ - Compensation Intelligence System

Track C demo task for the Full Stack Engineer role.

CompIQ is a level-first compensation intelligence MVP. It compares compensation by company, role, level, location, market, and compensation structure instead of treating job title as the main source of truth.

## Current Build

- Next.js App Router with TypeScript and TailwindCSS
- Prisma schema for Postgres/Neon with seeded synthetic compensation data
- API-backed dashboard with mock fallback when `DATABASE_URL` is not configured
- Salary explorer with search, filters, sorting, and comparison selection
- Company detail pages with level bands, role distribution, location distribution, and compensation breakdowns
- Research comparison sheet for Levels.fyi, 6figr, AmbitionBox, and Glassdoor
- Salary submission form with client-side validation, total compensation calculation, normalization, and duplicate warning behavior
- Backend API contract routes:
  - `GET /api/salaries`
  - `POST /api/salaries`
  - `GET /api/companies`
  - `GET /api/companies/[slug]`
  - `GET /api/compare`
  - `GET /api/research`

## Product Decisions

- Levels matter more than job titles, so the app treats level as a core comparison axis.
- Hybrid market support is included with USD and INR inputs.
- Original currency is preserved, while normalized USD total compensation enables cross-market comparison.
- Authentication is intentionally excluded from v1 so the demo focuses on compensation intelligence, validation, and end-to-end architecture.
- Data is synthetic for demo reliability. The app does not scrape competitor websites.

## Architecture

The frontend reads from a thin data-access layer in `src/lib/data-access.ts`. That layer uses Prisma/Postgres when `DATABASE_URL` exists and automatically falls back to the typed mock dataset when no database is configured. This keeps the frontend stable for demos while preserving the same response shapes for production.

Core domain logic lives in `src/lib/compensation.ts`:

- company name normalization
- total compensation calculation
- INR to USD normalization
- filtering and sorting
- median calculations
- likely duplicate detection

Request validation lives in `src/lib/validation.ts` using Zod. The salary ingestion route defaults missing bonus and stock to `0`, rejects invalid values, calculates total compensation, and blocks likely duplicates.

## Run Locally

```bash
npm install
npm run db:generate
npm run dev
```

Open `http://localhost:3000`.

Without `DATABASE_URL`, the app runs in mock mode. API responses include `meta.source: "mock"`.

## Neon/Postgres Setup

1. Create a Neon Postgres database.
2. Copy `.env.example` to `.env`.
3. Set `DATABASE_URL` to the Neon pooled connection string.
4. Run the Prisma setup:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

With `DATABASE_URL` configured, API responses use Prisma-backed data and salary submissions are persisted.

## Verify

```bash
npm run lint
npm run build
```

Useful API smoke checks:

```bash
curl http://localhost:3000/api/salaries
curl http://localhost:3000/api/companies
curl http://localhost:3000/api/companies/google
curl 'http://localhost:3000/api/compare?id=s2&id=s5'
```

## Tradeoffs

- No authentication in v1.
- Duplicate detection is cohort/key based, not user-identity based.
- Currency conversion uses a fixed demo INR-to-USD rate for deterministic results.
- Competitor research is manually modeled for product comparison and is not scraped.
