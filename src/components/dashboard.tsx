"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  buildSubmission,
  formatMoney,
  formatUsdCompact,
  isLikelyDuplicate,
  median,
  validateSubmission,
} from "@/lib/compensation";
import { companies, researchRows, salarySubmissions } from "@/lib/mock-data";
import type {
  Currency,
  Market,
  SalaryFilters,
  SalarySubmission,
  SortKey,
  SubmissionDraft,
} from "@/lib/types";
import { Badge, Bar, CompanyLink, Section, SelectField, Stat, TextInput } from "./ui";

const defaultFilters: SalaryFilters = {
  query: "",
  company: "",
  role: "",
  level: "",
  location: "",
  currency: "All",
  market: "All",
};

function unique<T>(values: T[]) {
  return Array.from(new Set(values));
}

export function Dashboard() {
  const [filters, setFilters] = useState<SalaryFilters>(defaultFilters);
  const [sortKey, setSortKey] = useState<SortKey>("totalCompUsd");
  const [selectedIds, setSelectedIds] = useState<string[]>(["s2", "s5"]);
  const [draft, setDraft] = useState<SubmissionDraft>({
    company: "",
    role: "Software Engineer",
    level: "",
    location: "",
    market: "India",
    currency: "INR",
    base: 0,
    bonus: 0,
    stock: 0,
    yearsExperience: 0,
  });
  const [formStatus, setFormStatus] = useState<string>("");

  const filteredRows = useMemo(() => {
    const query = filters.query.trim().toLowerCase();

    return salarySubmissions
      .filter((row) => {
        const searchable = [
          row.company,
          row.role,
          row.level,
          row.location,
          row.market,
        ]
          .join(" ")
          .toLowerCase();

        return (
          (!query || searchable.includes(query)) &&
          (!filters.company || row.company === filters.company) &&
          (!filters.role || row.role === filters.role) &&
          (!filters.level || row.level === filters.level) &&
          (!filters.location || row.location === filters.location) &&
          (filters.currency === "All" || row.currency === filters.currency) &&
          (filters.market === "All" || row.market === filters.market)
        );
      })
      .sort((a, b) => {
        if (sortKey === "company") return a.company.localeCompare(b.company);
        if (sortKey === "levelRank") return b.levelRank - a.levelRank;
        return b[sortKey] - a[sortKey];
      });
  }, [filters, sortKey]);

  const selectedRows = selectedIds
    .map((id) => salarySubmissions.find((row) => row.id === id))
    .filter(Boolean) as SalarySubmission[];

  const maxTotal = Math.max(...filteredRows.map((row) => row.totalCompUsd), 1);
  const globalRows = salarySubmissions.filter((row) => row.market === "Global");
  const indiaRows = salarySubmissions.filter((row) => row.market === "India");
  const topCompany = [...salarySubmissions].sort(
    (a, b) => b.totalCompUsd - a.totalCompUsd,
  )[0];

  const roleOptions = unique(salarySubmissions.map((row) => row.role)).sort();
  const levelOptions = unique(salarySubmissions.map((row) => row.level)).sort();
  const locationOptions = unique(salarySubmissions.map((row) => row.location)).sort();

  function setFilter<K extends keyof SalaryFilters>(key: K, value: SalaryFilters[K]) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function toggleSelected(id: string) {
    setSelectedIds((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= 3) return [current[1], current[2], id];
      return [...current, id];
    });
  }

  function submitDraft() {
    const errors = validateSubmission(draft);
    if (errors.length > 0) {
      setFormStatus(errors[0]);
      return;
    }

    const built = buildSubmission(draft);
    const duplicate = isLikelyDuplicate(draft);

    setFormStatus(
      duplicate
        ? "Likely duplicate detected. Backend will return 409 with the matching cohort."
        : `Valid submission. Total comp would be ${formatMoney(
            built.totalComp,
            built.currency,
          )} (${formatUsdCompact(built.totalCompUsd)} normalized).`,
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_18%_0%,rgba(139,147,255,0.18),transparent_28%),radial-gradient(circle_at_82%_8%,rgba(68,215,182,0.12),transparent_24%),#050506]">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#050506]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-md border border-white/10 bg-white/[0.06] text-[11px] font-semibold text-[#e4f222]">
              C
            </span>
            <span className="text-sm font-semibold text-zinc-100">CompIQ</span>
          </Link>
          <nav className="hidden items-center gap-5 text-sm text-zinc-500 md:flex">
            <a href="#explorer" className="hover:text-zinc-100">
              Explorer
            </a>
            <a href="#compare" className="hover:text-zinc-100">
              Compare
            </a>
            <a href="#research" className="hover:text-zinc-100">
              Research
            </a>
          </nav>
          <a
            href="#submit"
            className="rounded-md border border-white/10 bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-950 transition hover:bg-white"
          >
            Add salary
          </a>
        </div>
      </header>

      <section className="border-b border-white/10">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1.25fr_0.75fr] lg:px-8 lg:py-20">
          <div>
            <p className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-zinc-400 shadow-[0_1px_0_rgba(255,255,255,0.05)_inset]">
              Track C · Full Stack Engineer
            </p>
            <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-0.02em] text-zinc-50 sm:text-6xl">
              Compensation intelligence built around levels, not titles.
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-400 sm:text-lg">
              Compare total compensation across companies, levels, roles, and
              markets with original-currency transparency and normalized USD
              decision support.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#explorer"
                className="rounded-md bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-white"
              >
                Explore salaries
              </a>
              <a
                href="#compare"
                className="rounded-md border border-white/10 bg-white/[0.035] px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.06]"
              >
                Compare levels
              </a>
            </div>
          </div>
          <div className="grid content-end gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <Stat
              label="Median global TC"
              value={formatUsdCompact(median(globalRows.map((row) => row.totalCompUsd)))}
              detail="Normalized across submitted roles"
            />
            <Stat
              label="Median India TC"
              value={formatUsdCompact(median(indiaRows.map((row) => row.totalCompUsd)))}
              detail="Original INR preserved per row"
            />
            <Stat
              label="Highest package"
              value={formatUsdCompact(topCompany.totalCompUsd)}
              detail={`${topCompany.company} ${topCompany.level}`}
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mt-8 rounded-lg border border-white/10 bg-white/[0.03] p-3 shadow-2xl shadow-black/40">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-md border border-white/10 bg-[#0b0c10] p-4">
              <p className="text-xs font-medium text-zinc-500">Live API Contract</p>
              <p className="mt-2 font-mono text-sm text-[#44d7b6]">GET /api/salaries</p>
            </div>
            <div className="rounded-md border border-white/10 bg-[#0b0c10] p-4">
              <p className="text-xs font-medium text-zinc-500">Normalized market view</p>
              <p className="mt-2 font-mono text-sm text-[#e4f222]">USD + INR/LPA</p>
            </div>
            <div className="rounded-md border border-white/10 bg-[#0b0c10] p-4">
              <p className="text-xs font-medium text-zinc-500">Review story</p>
              <p className="mt-2 font-mono text-sm text-[#8b93ff]">Frontend first → Prisma next</p>
            </div>
          </div>
        </div>

        <div id="explorer" />
        <Section title="Salary Explorer" eyebrow="Filtered compensation table">
          <div className="rounded-lg border border-white/10 bg-[#090a0d]/95 p-4 shadow-2xl shadow-black/30">
            <div className="grid gap-3 md:grid-cols-4 lg:grid-cols-7">
              <TextInput
                label="Search"
                value={filters.query}
                onChange={(value) => setFilter("query", value)}
                placeholder="company, role, city"
              />
              <SelectField
                label="Company"
                value={filters.company}
                onChange={(value) => setFilter("company", value)}
                options={["All", ...companies.map((company) => company.name)]}
              />
              <SelectField
                label="Role"
                value={filters.role}
                onChange={(value) => setFilter("role", value)}
                options={["All", ...roleOptions]}
              />
              <SelectField
                label="Level"
                value={filters.level}
                onChange={(value) => setFilter("level", value)}
                options={["All", ...levelOptions]}
              />
              <SelectField
                label="Location"
                value={filters.location}
                onChange={(value) => setFilter("location", value)}
                options={["All", ...locationOptions]}
              />
              <SelectField
                label="Market"
                value={filters.market === "All" ? "" : filters.market}
                onChange={(value) => setFilter("market", (value || "All") as Market | "All")}
                options={["All", "Global", "India"]}
              />
              <SelectField
                label="Sort"
                value={sortKey}
                onChange={(value) => setSortKey(value as SortKey)}
                options={["totalCompUsd", "base", "levelRank", "company"]}
              />
            </div>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                    <th className="py-3 pr-3">Compare</th>
                    <th className="py-3 pr-3">Company</th>
                    <th className="py-3 pr-3">Role</th>
                    <th className="py-3 pr-3">Level</th>
                    <th className="py-3 pr-3">Location</th>
                    <th className="py-3 pr-3">Base</th>
                    <th className="py-3 pr-3">Bonus</th>
                    <th className="py-3 pr-3">Stock</th>
                    <th className="py-3 pr-3">Total</th>
                    <th className="py-3">USD TC</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row) => (
                    <tr key={row.id} className="border-b border-white/[0.06] transition hover:bg-white/[0.025]">
                      <td className="py-3 pr-3">
                        <input
                          aria-label={`Compare ${row.company} ${row.level}`}
                          checked={selectedIds.includes(row.id)}
                          type="checkbox"
                          onChange={() => toggleSelected(row.id)}
                          className="h-4 w-4 accent-[#8b93ff]"
                        />
                      </td>
                      <td className="py-3 pr-3">
                        <CompanyLink slug={row.companySlug}>{row.company}</CompanyLink>
                      </td>
                      <td className="py-3 pr-3 text-zinc-300">{row.role}</td>
                      <td className="py-3 pr-3">
                        <Badge>{row.level}</Badge>
                      </td>
                      <td className="py-3 pr-3 text-zinc-500">{row.location}</td>
                      <td className="py-3 pr-3 text-zinc-300">
                        {formatMoney(row.base, row.currency)}
                      </td>
                      <td className="py-3 pr-3 text-zinc-300">
                        {formatMoney(row.bonus, row.currency)}
                      </td>
                      <td className="py-3 pr-3 text-zinc-300">
                        {formatMoney(row.stock, row.currency)}
                      </td>
                      <td className="py-3 pr-3 font-medium text-zinc-100">
                        {formatMoney(row.totalComp, row.currency)}
                      </td>
                      <td className="py-3 font-semibold text-[#e4f222]">
                        {formatUsdCompact(row.totalCompUsd)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredRows.length === 0 ? (
              <div className="mt-5 rounded-lg border border-dashed border-white/15 p-6 text-center text-sm text-zinc-500">
                No compensation rows match these filters.
              </div>
            ) : null}
          </div>
        </Section>

        <div id="compare" />
        <Section title="Comparison Workflow" eyebrow="2-3 selected profiles">
          <div className="grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
            <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4 shadow-2xl shadow-black/30">
              <h3 className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">
                Decision insight
              </h3>
              {selectedRows.length > 0 ? (
                <div className="mt-4 grid gap-3 text-sm leading-6 text-zinc-400">
                  <p>
                    Highest normalized package:{" "}
                    <strong className="text-zinc-100">
                      {
                        [...selectedRows].sort(
                          (a, b) => b.totalCompUsd - a.totalCompUsd,
                        )[0].company
                      }
                    </strong>
                  </p>
                  <p>
                    Most cash-heavy package:{" "}
                    <strong className="text-zinc-100">
                      {
                        [...selectedRows].sort(
                          (a, b) =>
                            b.base / b.totalComp - a.base / a.totalComp,
                        )[0].company
                      }
                    </strong>
                  </p>
                  <p>
                    Selection rule: newest pick replaces the oldest after three
                    profiles, matching the planned compare API contract.
                  </p>
                </div>
              ) : (
                <p className="mt-4 text-sm text-zinc-500">
                  Pick up to three rows in the explorer.
                </p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {selectedRows.map((row) => (
                <div
                  key={row.id}
                  className="rounded-lg border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.025))] p-4 shadow-2xl shadow-black/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-zinc-50">{row.company}</h3>
                      <p className="text-sm text-zinc-500">
                        {row.role} · {row.level}
                      </p>
                    </div>
                    <Badge>{row.market}</Badge>
                  </div>
                  <p className="mt-5 text-3xl font-semibold tracking-[-0.02em] text-zinc-50">
                    {formatUsdCompact(row.totalCompUsd)}
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">
                    {formatMoney(row.totalComp, row.currency)} original
                  </p>
                  <div className="mt-5 grid gap-3">
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section title="Company Intelligence" eyebrow="Database-backed page contract">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {companies.map((company) => {
              const rows = salarySubmissions.filter((row) => row.companyId === company.id);
              const med = median(rows.map((row) => row.totalCompUsd));
              return (
                <Link
                  key={company.id}
                  href={`/companies/${company.slug}`}
                  className="rounded-lg border border-white/10 bg-white/[0.035] p-4 shadow-2xl shadow-black/20 transition hover:border-[#8b93ff]/60 hover:bg-white/[0.055]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-zinc-50">{company.name}</h3>
                      <p className="mt-1 text-sm text-zinc-500">
                        {company.headquarters}
                      </p>
                    </div>
                    <Badge>{company.market}</Badge>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-zinc-400">
                    {company.description}
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/10 pt-4 text-sm">
                    <div>
                      <p className="text-zinc-500">Median TC</p>
                      <p className="font-semibold text-zinc-50">
                        {formatUsdCompact(med)}
                      </p>
                    </div>
                    <div>
                      <p className="text-zinc-500">Samples</p>
                      <p className="font-semibold text-zinc-50">{rows.length}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </Section>

        <Section title="Compensation Visualizations" eyebrow="Frontend polish">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4 shadow-2xl shadow-black/20">
              <h3 className="font-semibold text-zinc-50">Top normalized packages</h3>
              <div className="mt-5 grid gap-4">
                {[...salarySubmissions]
                  .sort((a, b) => b.totalCompUsd - a.totalCompUsd)
                  .slice(0, 6)
                  .map((row) => (
                    <Bar
                      key={row.id}
                      label={`${row.company} ${row.level}`}
                      value={row.totalCompUsd}
                      max={maxTotal}
                      detail={formatUsdCompact(row.totalCompUsd)}
                    />
                  ))}
              </div>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4 shadow-2xl shadow-black/20">
              <h3 className="font-semibold text-zinc-50">Market comparison</h3>
              <div className="mt-5 grid gap-4">
                <Bar
                  label="Global median"
                  value={median(globalRows.map((row) => row.totalCompUsd))}
                  max={maxTotal}
                  detail={formatUsdCompact(
                    median(globalRows.map((row) => row.totalCompUsd)),
                  )}
                />
                <Bar
                  label="India median"
                  value={median(indiaRows.map((row) => row.totalCompUsd))}
                  max={maxTotal}
                  detail={formatUsdCompact(
                    median(indiaRows.map((row) => row.totalCompUsd)),
                  )}
                />
                <p className="text-sm leading-6 text-zinc-400">
                  Original currency remains visible in rows, while normalized USD
                  enables fair cross-market comparison for the decision workflow.
                </p>
              </div>
            </div>
          </div>
        </Section>

        <div id="submit" />
        <Section title="Salary Submission" eyebrow="Frontend validation now, API later">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4 shadow-2xl shadow-black/20">
              <div className="grid gap-3 md:grid-cols-3">
                <TextInput
                  label="Company"
                  value={draft.company}
                  onChange={(value) => setDraft((current) => ({ ...current, company: value }))}
                  placeholder="Example: Google"
                />
                <TextInput
                  label="Role"
                  value={draft.role}
                  onChange={(value) => setDraft((current) => ({ ...current, role: value }))}
                />
                <TextInput
                  label="Level"
                  value={draft.level}
                  onChange={(value) => setDraft((current) => ({ ...current, level: value }))}
                  placeholder="L4, SDE-2, 63"
                />
                <TextInput
                  label="Location"
                  value={draft.location}
                  onChange={(value) => setDraft((current) => ({ ...current, location: value }))}
                  placeholder="Bengaluru, IN"
                />
                <SelectField
                  label="Market"
                  value={draft.market}
                  onChange={(value) =>
                    setDraft((current) => ({ ...current, market: value as Market }))
                  }
                  options={["Global", "India"]}
                />
                <SelectField
                  label="Currency"
                  value={draft.currency}
                  onChange={(value) =>
                    setDraft((current) => ({ ...current, currency: value as Currency }))
                  }
                  options={["USD", "INR"]}
                />
                <TextInput
                  label="Base"
                  type="number"
                  value={draft.base || ""}
                  onChange={(value) =>
                    setDraft((current) => ({ ...current, base: Number(value) }))
                  }
                />
                <TextInput
                  label="Bonus"
                  type="number"
                  value={draft.bonus || ""}
                  onChange={(value) =>
                    setDraft((current) => ({ ...current, bonus: Number(value) }))
                  }
                />
                <TextInput
                  label="Stock"
                  type="number"
                  value={draft.stock || ""}
                  onChange={(value) =>
                    setDraft((current) => ({ ...current, stock: Number(value) }))
                  }
                />
              </div>
              <button
                type="button"
                onClick={submitDraft}
                className="mt-4 h-10 rounded-md bg-zinc-100 px-4 text-sm font-semibold text-zinc-950 transition hover:bg-white"
              >
                Validate submission
              </button>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4 shadow-2xl shadow-black/20">
              <h3 className="font-semibold text-zinc-50">Backend contract</h3>
              <ul className="mt-4 grid gap-2 text-sm leading-6 text-zinc-400">
                <li>POST /api/salaries accepts this exact draft shape.</li>
                <li>Missing bonus or stock defaults to 0.</li>
                <li>Invalid numbers return 400 with field errors.</li>
                <li>Likely duplicate rows return 409.</li>
              </ul>
              {formStatus ? (
                <div className="mt-4 rounded-md border border-[#44d7b6]/30 bg-[#44d7b6]/10 p-3 text-sm text-[#b7f8e9]">
                  {formStatus}
                </div>
              ) : null}
            </div>
          </div>
        </Section>

        <div id="research" />
        <Section title="Research Comparison Sheet" eyebrow="Mandatory research">
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
        </Section>
      </div>
    </main>
  );
}
