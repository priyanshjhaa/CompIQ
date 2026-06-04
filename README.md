# CompIQ - Compensation Intelligence System

Track C demo task for the Full Stack Engineer role.

CompIQ is a level-first compensation intelligence MVP. It compares compensation by company, role, level, location, market, and compensation structure instead of treating job title as the main source of truth.

## Current Build

- Next.js App Router with TypeScript and TailwindCSS
- Prisma schema for Postgres/Neon with seeded synthetic compensation data
- Public SaaS landing page with Neon Auth protected dashboard workspace
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
- Neon Auth protects the dashboard, company pages, research page, and backend API routes.
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

Route shape:

- `/` is the public landing page.
- `/dashboard` is the protected compensation workspace.
- `/auth/sign-in` and `/auth/sign-up` are Neon Auth entry points.
- `src/proxy.ts` protects dashboard pages and API routes.

## Run Locally

```bash
npm install
npm run db:generate
npm run dev
```

Open `http://localhost:3000`.

Without `DATABASE_URL`, the app runs in mock mode. API responses include `meta.source: "mock"`. Without Neon Auth env vars, protected routes redirect to `/auth/setup` with setup instructions.

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

## Neon Auth Setup

1. Enable Neon Auth in the Neon console for the project.
2. Add these variables to `.env` and to Vercel:

```bash
NEON_AUTH_BASE_URL="https://your-neon-auth-url"
NEON_AUTH_COOKIE_SECRET="generate-with-openssl-rand-base64-32"
```

Generate the cookie secret with:

```bash
openssl rand -base64 32
```

Restart the dev server after adding the variables.

## Verify

```bash
npm run lint
npm run build
```

Once signed in, useful API smoke checks:

```bash
curl http://localhost:3000/api/salaries
curl http://localhost:3000/api/companies
curl http://localhost:3000/api/companies/google
curl 'http://localhost:3000/api/compare?id=s2&id=s5'
```

## Tradeoffs

- Neon Auth is used for access control only; salary submissions are not user-owned yet.
- Duplicate detection is cohort/key based, not user-identity based.
- Currency conversion uses a fixed demo INR-to-USD rate for deterministic results.
- Competitor research is manually modeled for product comparison and is not scraped.
