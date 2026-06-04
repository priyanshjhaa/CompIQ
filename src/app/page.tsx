import Link from "next/link";
import { Bar, Badge, Stat } from "@/components/ui";

const workflow = [
  {
    title: "Explore compensation",
    detail: "Search and filter salary rows by company, role, level, location, currency, and market.",
  },
  {
    title: "Compare offers",
    detail: "Select two or three packages and inspect base, bonus, stock, total comp, and derived insights.",
  },
  {
    title: "Inspect company bands",
    detail: "Open company pages to see level-wise medians, role mix, locations, and sample size.",
  },
];

const proof = [
  "Neon Postgres + Prisma schema",
  "Neon Auth protected workspace",
  "Zod salary ingestion validation",
  "Duplicate submission detection",
];

export default function Home() {
  return (
    <main className="app-gradient-flow min-h-screen text-zinc-50">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#050506]/70 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-md border border-white/10 bg-white/[0.06] text-[11px] font-semibold text-[#e4f222]">C</span>
            <span className="text-sm font-semibold text-zinc-100">CompIQ</span>
          </Link>
          <nav className="hidden items-center gap-5 text-sm text-zinc-500 md:flex">
            <a href="#problem" className="hover:text-zinc-100">Problem</a>
            <a href="#workflow" className="hover:text-zinc-100">Workflow</a>
            <a href="#stack" className="hover:text-zinc-100">Stack</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/auth/sign-in" className="hidden rounded-md border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm font-medium text-zinc-100 transition hover:bg-white/[0.08] sm:inline-flex">
              Sign in
            </Link>
            <Link href="/auth/sign-up" className="rounded-md border border-white/10 bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-950 transition hover:bg-white">
              Get started
            </Link>
          </div>
        </div>
      </header>

      <section className="border-b border-white/10">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
          <div>
            <p className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-zinc-400 shadow-[0_1px_0_rgba(255,255,255,0.05)_inset]">
              Level-first compensation intelligence
            </p>
            <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-0.02em] text-zinc-50 sm:text-6xl">
              Compensation intelligence for level-based offer decisions.
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-400 sm:text-lg">
              CompIQ helps candidates and recruiters compare base salary, bonus, stock, total compensation, company bands, and geography without pretending job titles mean the same thing everywhere.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/auth/sign-up" className="rounded-md border border-white/10 bg-zinc-100 px-4 py-2.5 text-sm font-medium text-zinc-950 transition hover:bg-white">
                Create workspace
              </Link>
              <Link href="/auth/sign-in" className="rounded-md border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-zinc-100 transition hover:bg-white/[0.08]">
                Sign in
              </Link>
            </div>
          </div>

          <div className="grid content-center gap-3">
            <div className="rounded-lg border border-white/10 bg-[#090a0d]/80 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">Offer comparison</p>
                  <h2 className="mt-2 text-xl font-semibold text-zinc-50">Google L5 vs Microsoft 64</h2>
                </div>
                <Badge>USD normalized</Badge>
              </div>
              <div className="mt-5 grid gap-4">
                <Bar label="Google L5" value={414000} max={414000} detail="$414K TC" />
                <Bar label="Microsoft 64" value={310000} max={414000} detail="$310K TC" />
                <Bar label="Amazon L6" value={360000} max={414000} detail="$360K TC" />
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <Stat label="Highest TC" value="$414K" detail="Google L5" />
                <Stat label="Cash heavy" value="72%" detail="Best base mix" />
                <Stat label="Markets" value="2" detail="Global + India" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="problem" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8b93ff]">Why it exists</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-zinc-50">Titles are noisy. Levels explain compensation.</h2>
          </div>
          <p className="text-base leading-7 text-zinc-400">
            A Senior Engineer at one company can map to a mid-level or staff-equivalent package somewhere else. CompIQ makes the comparison around level, market, and compensation structure so the decision feels grounded instead of anecdotal.
          </p>
        </div>
      </section>

      <section id="workflow" className="border-y border-white/10 bg-white/[0.015]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8b93ff]">Workflow</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-zinc-50">From search to offer insight.</h2>
            </div>
            <Link href="/auth/sign-up" className="w-fit rounded-md border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-zinc-100 transition hover:bg-white/[0.08]">
              Enter app
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {workflow.map((item, index) => (
              <div key={item.title} className="rounded-lg border border-white/10 bg-[#090a0d]/75 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl">
                <span className="text-sm font-semibold text-[#e4f222]">0{index + 1}</span>
                <h3 className="mt-4 text-lg font-semibold text-zinc-50">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="stack" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8b93ff]">Full-stack proof</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-zinc-50">A real backend contract behind the polished UI.</h2>
            <p className="mt-4 text-base leading-7 text-zinc-400">
              The dashboard runs against API routes backed by Prisma and Neon Postgres, with Neon Auth gating the workspace and salary APIs.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {proof.map((item) => (
              <div key={item} className="rounded-lg border border-white/10 bg-white/[0.035] p-4 text-sm font-medium text-zinc-200">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
