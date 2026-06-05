import Link from "next/link";
import { Bar, Badge, Stat } from "@/components/ui";

const workflow = [
  {
    title: "Find comparable roles",
    detail:
      "Start with company, role, level, location, currency, and market filters so you are comparing the right compensation cohort instead of a noisy title match.",
  },
  {
    title: "Understand package shape",
    detail:
      "Separate base salary, bonus, stock, original total compensation, and normalized USD total so a high number does not hide risk or structure.",
  },
  {
    title: "Compare offers side by side",
    detail:
      "Pick two or three profiles and see which package has the highest total compensation, stronger cash component, better level, and closer market fit.",
  },
  {
    title: "Check company context",
    detail:
      "Open company pages to review level-wise compensation bands, role distribution, locations, and sample size before trusting a decision.",
  },
];

const productPoints = [
  {
    title: "Level-first comparison",
    detail:
      "CompIQ treats level as a first-class signal because titles vary wildly across companies. L5, 64, SDE-2, and Senior Engineer should not be compared blindly.",
  },
  {
    title: "Clear compensation breakdown",
    detail:
      "Every package keeps base, bonus, stock, total compensation, and currency visible. Users can quickly spot whether an offer is cash-heavy, equity-heavy, or balanced.",
  },
  {
    title: "Global and India market support",
    detail:
      "The product supports USD and INR compensation, keeps original currency transparent, and normalizes totals so global and India packages can be compared responsibly.",
  },
  {
    title: "Company-specific intelligence",
    detail:
      "Company pages summarize median compensation, highest observed level, locations, sample size, level bands, and role distribution in one place.",
  },
  {
    title: "Research-informed positioning",
    detail:
      "CompIQ borrows the right ideas from salary platforms such as level bands and compensation breakdowns, while keeping the workflow focused on offer comparison.",
  },
  {
    title: "Protected decision workspace",
    detail:
      "The public page explains the product. The authenticated workspace is where users explore salary data, compare offers, view research, and submit compensation entries.",
  },
];

const useCases = [
  {
    title: "For candidates",
    detail:
      "Understand whether an offer is actually competitive for the level, market, and package mix before accepting or negotiating.",
  },
  {
    title: "For recruiters",
    detail:
      "Benchmark compensation bands and see how offers compare across companies, roles, and markets without jumping between disconnected spreadsheets.",
  },
  {
    title: "For compensation research",
    detail:
      "Use structured salary submissions and company-level summaries to reason about compensation patterns instead of isolated anecdotes.",
  },
];

const comparisonRows = [
  ["Comparison axis", "Title-led research", "CompIQ"],
  ["Primary signal", "Job title", "Level + role + market"],
  ["Package view", "Often salary range only", "Base, bonus, stock, total comp"],
  ["Currency handling", "Usually one market at a time", "Original currency + USD normalization"],
  ["Decision support", "Manual interpretation", "Highest TC and cash-heavy insights"],
];

export default function Home() {
  return (
    <main className="app-gradient-flow min-h-screen text-zinc-50">
      <header className="sticky top-0 z-30 bg-[#050506]/60 backdrop-blur-xl">
        <div className="flex h-14 w-full items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-md border border-white/10 bg-white/[0.06] text-[11px] font-semibold text-[#e4f222]">C</span>
            <span className="text-sm font-semibold text-zinc-100">CompIQ</span>
          </Link>
          <nav className="hidden items-center gap-5 text-sm text-zinc-500 md:flex">
            <a href="#why" className="hover:text-zinc-100">Why</a>
            <a href="#workflow" className="hover:text-zinc-100">Workflow</a>
            <a href="#product" className="hover:text-zinc-100">Product</a>
            <a href="#inside" className="hover:text-zinc-100">Inside</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/auth/sign-in" className="hidden rounded-md border border-white/10 bg-white/[0.035] px-3 py-1.5 text-sm font-medium text-zinc-100 transition hover:bg-white/[0.07] sm:inline-flex">
              Sign in
            </Link>
            <Link href="/auth/sign-up" className="rounded-md border border-white/10 bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-950 transition hover:bg-white">
              Get started
            </Link>
          </div>
        </div>
      </header>

      <section className="min-h-[calc(100vh-3.5rem)]">
        <div className="grid min-h-[calc(100vh-3.5rem)] w-full items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_0.92fr] lg:px-8 xl:px-10">
          <div className="max-w-4xl">
            <p className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-zinc-400">
              Level-first compensation intelligence
            </p>
            <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.03] tracking-[-0.02em] text-zinc-50 sm:text-6xl">
              Compare compensation by level, package, and market.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
              CompIQ helps users make cleaner compensation decisions by showing how offers are built: base salary, bonus, stock, total compensation, level, location, company, and currency. Instead of treating job titles as equal, it compares the context behind the number.
            </p>
            <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
              <Stat label="Salary rows" value="14" detail="Structured examples" />
              <Stat label="Companies" value="6" detail="Market coverage" />
              <Stat label="Compare" value="3" detail="Profiles at once" />
            </div>
          </div>

          <div className="grid gap-3 lg:justify-self-end">
            <div className="w-full max-w-2xl rounded-lg border border-white/10 bg-[#090a0d]/72 p-4 shadow-2xl shadow-black/25 backdrop-blur-xl">
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
                <Stat label="Cash-heavy" value="72%" detail="Best base mix" />
                <Stat label="Markets" value="2" detail="Global + India" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="why" className="w-full px-4 py-16 sm:px-6 lg:px-8 xl:px-10">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="max-w-2xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8b93ff]">Why CompIQ exists</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.02em] text-zinc-50">
              Compensation research becomes unreliable when the comparison is too shallow.
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-400">
              A Senior Engineer at one company might map to a very different level somewhere else. A package with high total compensation may still be risky if most of it is stock. A US offer and India offer need both original currency context and a normalized comparison. CompIQ is built around those realities.
            </p>
          </div>
          <div className="overflow-hidden rounded-lg border border-white/10 bg-[#090a0d]/70 shadow-2xl shadow-black/20 backdrop-blur-xl">
            {comparisonRows.map((row, index) => (
              <div
                key={row[0]}
                className={
                  index === 0
                    ? "grid gap-3 border-b border-white/[0.06] bg-white/[0.025] p-4 text-[11px] uppercase tracking-[0.18em] text-zinc-500 md:grid-cols-3"
                    : "grid gap-3 border-b border-white/[0.06] p-4 text-sm text-zinc-400 md:grid-cols-3"
                }
              >
                <span className={index === 0 ? "" : "font-medium text-zinc-100"}>{row[0]}</span>
                <span>{row[1]}</span>
                <span className={index === 0 ? "" : "text-[#e4f222]"}>{row[2]}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="workflow" className="px-4 py-16 sm:px-6 lg:px-8 xl:px-10">
        <div className="max-w-3xl">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8b93ff]">Workflow</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.02em] text-zinc-50">A focused path from salary data to offer decision.</h2>
          <p className="mt-4 text-base leading-7 text-zinc-400">
            The product is designed around the way users actually evaluate compensation: first find comparable rows, then understand the structure, then compare the strongest options, then inspect company context.
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {workflow.map((item, index) => (
            <div key={item.title} className="rounded-lg border border-white/10 bg-[#090a0d]/68 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
              <span className="text-sm font-semibold text-[#e4f222]">0{index + 1}</span>
              <h3 className="mt-4 text-lg font-semibold text-zinc-50">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="product" className="w-full px-4 py-16 sm:px-6 lg:px-8 xl:px-10">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="max-w-2xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8b93ff]">What the product does</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.02em] text-zinc-50">Enough context to trust the comparison.</h2>
            <p className="mt-4 text-base leading-7 text-zinc-400">
              CompIQ does not try to be a broad job platform. It focuses on compensation intelligence: the numbers, the levels, the structure of the package, and the company context needed to make a better decision.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {productPoints.map((point) => (
              <div key={point.title} className="rounded-lg border border-white/10 bg-[#090a0d]/68 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
                <h3 className="text-base font-semibold text-zinc-50">{point.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{point.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8 xl:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="max-w-2xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8b93ff]">Who it helps</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.02em] text-zinc-50">Built for people who need a clearer compensation answer.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {useCases.map((item) => (
              <div key={item.title} className="rounded-lg border border-white/10 bg-[#090a0d]/68 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
                <h3 className="text-base font-semibold text-zinc-50">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="inside" className="w-full px-4 py-16 sm:px-6 lg:px-8 xl:px-10">
        <div className="rounded-lg border border-white/10 bg-[#090a0d]/72 p-6 shadow-2xl shadow-black/25 backdrop-blur-xl lg:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div className="max-w-3xl">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8b93ff]">Inside the workspace</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-zinc-50">
                Explore salaries, compare packages, inspect companies, and submit new data.
              </h2>
              <p className="mt-4 text-base leading-7 text-zinc-400">
                The public page explains what CompIQ is. The authenticated dashboard is where users interact with salary tables, comparison insights, company pages, research notes, and salary submission flows.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link href="/auth/sign-up" className="rounded-md border border-white/10 bg-zinc-100 px-4 py-2.5 text-sm font-medium text-zinc-950 transition hover:bg-white">
                Get started
              </Link>
              <Link href="/auth/sign-in" className="rounded-md border border-white/10 bg-white/[0.035] px-4 py-2.5 text-sm font-medium text-zinc-100 transition hover:bg-white/[0.07]">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
