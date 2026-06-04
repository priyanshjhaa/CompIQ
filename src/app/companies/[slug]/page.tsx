import Link from "next/link";
import { notFound } from "next/navigation";
import { Bar, Badge, Section, Stat } from "@/components/ui";
import { formatMoney, formatUsdCompact, median } from "@/lib/compensation";
import { getCompanyDetail } from "@/lib/data-access";

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const detail = await getCompanyDetail(slug);

  if (!detail) notFound();

  const { summary, rows, levelBands } = detail;
  const maxLevelMedian = Math.max(...levelBands.map((level) => level.medianUsd), 1);
  const maxComp = Math.max(...rows.map((row) => row.totalCompUsd), 1);
  const roles = Object.entries(
    rows.reduce<Record<string, number>>((acc, row) => {
      acc[row.role] = (acc[row.role] ?? 0) + 1;
      return acc;
    }, {}),
  ).sort((a, b) => b[1] - a[1]);

  return (
    <main className="app-gradient-flow min-h-screen">
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Link
            href="/dashboard"
            className="text-sm font-semibold text-[#e4f222] underline decoration-white/20 underline-offset-4"
          >
            Back to dashboard
          </Link>
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-4xl font-semibold tracking-[-0.02em] text-zinc-50">
                  {summary.name}
                </h1>
                <Badge>{summary.market}</Badge>
              </div>
              <p className="mt-2 text-sm font-medium text-zinc-500">
                {summary.headquarters}
              </p>
              <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-400">
                {summary.description}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <Stat
                label="Median total comp"
                value={formatUsdCompact(summary.medianTotalUsd)}
                detail="Normalized USD"
              />
              <Stat
                label="Highest level"
                value={summary.highestLevel}
                detail="Level-first progression"
              />
              <Stat
                label="Sample size"
                value={`${summary.sampleSize}`}
                detail="Database-backed API contract"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Section title="Level-Wise Compensation Bands" eyebrow="Median TC by seniority">
          <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4 shadow-2xl shadow-black/20">
            <div className="grid gap-5">
              {levelBands.map((level) => (
                <Bar
                  key={level.level}
                  label={level.level}
                  value={level.medianUsd}
                  max={maxLevelMedian}
                  detail={`${formatUsdCompact(level.medianUsd)} · ${level.sampleSize} sample`}
                />
              ))}
            </div>
          </div>
        </Section>

        <Section title="Role And Location Distribution" eyebrow="Company intelligence">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4 shadow-2xl shadow-black/20">
              <h2 className="font-semibold text-zinc-50">Roles</h2>
              <div className="mt-4 grid gap-4">
                {roles.map(([role, count]) => (
                  <Bar
                    key={role}
                    label={role}
                    value={count}
                    max={rows.length}
                    detail={`${count} sample${count === 1 ? "" : "s"}`}
                  />
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4 shadow-2xl shadow-black/20">
              <h2 className="font-semibold text-zinc-50">Locations</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {summary.locations.map((location) => (
                  <Badge key={location}>{location}</Badge>
                ))}
              </div>
              <p className="mt-5 text-sm leading-6 text-zinc-400">
                Location distribution matters because the same level can carry
                different cash and equity shapes across US, Europe, and India
                markets.
              </p>
            </div>
          </div>
        </Section>

        <Section title="Submitted Compensation Rows" eyebrow="Future API response shape">
          <div className="overflow-x-auto rounded-lg border border-white/10 bg-[#090a0d]/95 shadow-2xl shadow-black/20">
            <table className="w-full min-w-[820px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.025] text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                  <th className="p-3">Role</th>
                  <th className="p-3">Level</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Base</th>
                  <th className="p-3">Bonus</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Original TC</th>
                  <th className="p-3">USD TC</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-white/[0.06]">
                    <td className="p-3 font-medium text-zinc-50">{row.role}</td>
                    <td className="p-3">
                      <Badge>{row.level}</Badge>
                    </td>
                    <td className="p-3 text-zinc-500">{row.location}</td>
                    <td className="p-3 text-zinc-400">
                      {formatMoney(row.base, row.currency)}
                    </td>
                    <td className="p-3 text-zinc-400">
                      {formatMoney(row.bonus, row.currency)}
                    </td>
                    <td className="p-3 text-zinc-400">
                      {formatMoney(row.stock, row.currency)}
                    </td>
                    <td className="p-3 font-medium text-zinc-100">
                      {formatMoney(row.totalComp, row.currency)}
                    </td>
                    <td className="p-3 font-semibold text-[#e4f222]">
                      {formatUsdCompact(row.totalCompUsd)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="Company Breakdown" eyebrow="Comp structure">
          <div className="grid gap-4 lg:grid-cols-2">
            {rows.map((row) => (
              <div
                key={row.id}
                className="rounded-lg border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.025))] p-4 shadow-2xl shadow-black/20"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-zinc-50">
                      {row.role} · {row.level}
                    </h3>
                    <p className="text-sm text-zinc-500">{row.location}</p>
                  </div>
                  <Badge>{row.verified ? "Verified" : "Unverified"}</Badge>
                </div>
                <p className="mt-4 text-2xl font-semibold text-zinc-50">
                  {formatUsdCompact(row.totalCompUsd)}
                </p>
                <div className="mt-4 grid gap-3">
                  <Bar
                    label="Base"
                    value={row.base}
                    max={row.totalComp}
                    detail={formatMoney(row.base, row.currency)}
                  />
                  <Bar
                    label="Bonus"
                    value={row.bonus}
                    max={row.totalComp}
                    detail={formatMoney(row.bonus, row.currency)}
                  />
                  <Bar
                    label="Stock"
                    value={row.stock}
                    max={row.totalComp}
                    detail={formatMoney(row.stock, row.currency)}
                  />
                  <Bar
                    label="Against company max"
                    value={row.totalCompUsd}
                    max={maxComp}
                    detail={`${Math.round((row.totalCompUsd / maxComp) * 100)}%`}
                  />
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Backend Handoff" eyebrow="Ready for Prisma">
          <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4 text-sm leading-6 text-zinc-400 shadow-2xl shadow-black/20">
            <p>
              This page consumes the same company detail shape expected from
              GET /api/companies/{summary.slug}: summary metadata, raw salary
              rows, and derived level bands. The Prisma implementation can reuse
              the mock seed data and keep the frontend unchanged.
            </p>
            <p className="mt-3">
              Company median in this view is{" "}
              <strong className="text-zinc-50">
                {formatUsdCompact(median(rows.map((row) => row.totalCompUsd)))}
              </strong>
              , calculated from normalized USD totals.
            </p>
          </div>
        </Section>
      </div>
    </main>
  );
}
