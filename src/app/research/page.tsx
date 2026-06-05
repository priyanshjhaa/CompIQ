import Link from "next/link";
import { listResearchRows } from "@/lib/data-access";

export default function ResearchPage() {
  const researchRows = listResearchRows();

  return (
    <main className="app-gradient-flow min-h-screen text-zinc-50">
      <header className="border-b border-white/10 bg-[#050506]/70 backdrop-blur-xl">
        <div className="flex h-14 w-full items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-md border border-white/10 bg-white/[0.06] text-[11px] font-semibold text-[#e4f222]">C</span>
            <span className="text-sm font-semibold text-zinc-100">CompIQ</span>
          </Link>
          <Link href="/dashboard" className="text-sm font-medium text-zinc-400 hover:text-zinc-100">Dashboard</Link>
        </div>
      </header>

      <section className="border-b border-white/10">
        <div className="w-full px-4 py-14 sm:px-6 lg:px-8 xl:px-10">
          <p className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-zinc-400">
            Competitive research
          </p>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-[-0.02em] text-zinc-50 sm:text-5xl">
            What CompIQ borrows, avoids, and builds differently.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-400">
            The product takes level-first comparison from Levels.fyi, India market familiarity from AmbitionBox and 6figr, and a cleaner workflow for comparing compensation structures.
          </p>
        </div>
      </section>

      <section className="w-full px-4 py-10 sm:px-6 lg:px-8 xl:px-10">
        <div className="mb-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8b93ff]">Mandatory research</p>
          <h2 className="mt-2 text-xl font-semibold text-zinc-50">Research Comparison Sheet</h2>
        </div>
        <div className="overflow-x-auto rounded-lg border border-white/10 bg-[#090a0d]/95 shadow-2xl shadow-black/20">
          <table className="w-full min-w-[900px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.025] text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                <th className="p-3">Feature</th>
                <th className="p-3">Levels.fyi</th>
                <th className="p-3">6figr</th>
                <th className="p-3">AmbitionBox</th>
                <th className="p-3">Glassdoor</th>
                <th className="p-3">Build?</th>
              </tr>
            </thead>
            <tbody>
              {researchRows.map((row) => (
                <tr key={row.feature} className="border-b border-white/[0.06]">
                  <td className="p-3 font-medium text-zinc-50">{row.feature}</td>
                  <td className="p-3 text-zinc-400">{row.levelsFyi}</td>
                  <td className="p-3 text-zinc-400">{row.sixfigr}</td>
                  <td className="p-3 text-zinc-400">{row.ambitionBox}</td>
                  <td className="p-3 text-zinc-400">{row.glassdoor}</td>
                  <td className="p-3 text-[#e4f222]">{row.build}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
