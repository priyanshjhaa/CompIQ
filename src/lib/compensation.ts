import type {
  Company,
  CompanySummary,
  SalaryFilters,
  SalarySubmission,
  SortKey,
  SubmissionDraft,
} from "./types";

export const INR_PER_USD = 83.33;

export function formatMoney(value: number, currency: "USD" | "INR") {
  if (currency === "INR") {
    return `₹${(value / 100000).toFixed(value >= 10000000 ? 1 : 2)}L`;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatUsdCompact(value: number) {
  return `$${Math.round(value / 1000)}K`;
}

export function median(values: number[]) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}

export function normalizeCompanyName(name: string) {
  return name
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\b(inc|llc|ltd|pvt|private|limited)\b\.?/gi, "")
    .trim()
    .toLowerCase();
}

export function calculateTotalComp({
  base,
  bonus = 0,
  stock = 0,
}: Pick<SubmissionDraft, "base" | "bonus" | "stock">) {
  return base + bonus + stock;
}

export function toUsd(total: number, currency: "USD" | "INR") {
  return currency === "USD" ? total : total / INR_PER_USD;
}

export function filterSalaries(
  rows: SalarySubmission[],
  filters: SalaryFilters,
  sortKey: SortKey,
) {
  const query = filters.query.trim().toLowerCase();

  return rows
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
}

export function getCompanySummaries(
  companies: Company[],
  rows: SalarySubmission[],
): CompanySummary[] {
  return companies.map((company) => {
    const companyRows = rows.filter((row) => row.companyId === company.id);
    const roleCounts = companyRows.reduce<Record<string, number>>((acc, row) => {
      acc[row.role] = (acc[row.role] ?? 0) + 1;
      return acc;
    }, {});

    const topRole =
      Object.entries(roleCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ??
      "Not enough data";

    const highest = [...companyRows].sort((a, b) => b.levelRank - a.levelRank)[0];

    return {
      ...company,
      sampleSize: companyRows.length,
      medianTotalUsd: median(companyRows.map((row) => row.totalCompUsd)),
      highestLevel: highest?.level ?? "N/A",
      topRole,
      locations: Array.from(new Set(companyRows.map((row) => row.location))),
    };
  });
}

export function getCompanySummary(
  companies: Company[],
  rows: SalarySubmission[],
  slug: string,
) {
  return getCompanySummaries(companies, rows).find(
    (company) => company.slug === slug,
  );
}

export function getCompanyRows(rows: SalarySubmission[], slug: string) {
  return rows.filter((row) => row.companySlug === slug);
}

export function groupMedianByLevel(rows: SalarySubmission[]) {
  return Object.entries(
    rows.reduce<Record<string, SalarySubmission[]>>((acc, row) => {
      acc[row.level] = [...(acc[row.level] ?? []), row];
      return acc;
    }, {}),
  )
    .map(([level, levelRows]) => ({
      level,
      levelRank: levelRows[0].levelRank,
      medianUsd: median(levelRows.map((row) => row.totalCompUsd)),
      sampleSize: levelRows.length,
    }))
    .sort((a, b) => a.levelRank - b.levelRank);
}

export function buildSubmission(draft: SubmissionDraft) {
  const totalComp = calculateTotalComp(draft);
  return {
    ...draft,
    company: draft.company.trim(),
    bonus: draft.bonus ?? 0,
    stock: draft.stock ?? 0,
    totalComp,
    totalCompUsd: toUsd(totalComp, draft.currency),
  };
}

export function validateSubmission(draft: SubmissionDraft) {
  const errors: string[] = [];
  if (draft.company.trim().length < 2) errors.push("Company name is required.");
  if (draft.role.trim().length < 2) errors.push("Role is required.");
  if (draft.level.trim().length < 1) errors.push("Level is required.");
  if (draft.location.trim().length < 2) errors.push("Location is required.");
  if (draft.base <= 0) errors.push("Base salary must be greater than zero.");
  if ((draft.bonus ?? 0) < 0) errors.push("Bonus cannot be negative.");
  if ((draft.stock ?? 0) < 0) errors.push("Stock cannot be negative.");
  if (draft.yearsExperience < 0) errors.push("Experience cannot be negative.");
  return errors;
}

export function isLikelyDuplicate(rows: SalarySubmission[], draft: SubmissionDraft) {
  const normalized = normalizeCompanyName(draft.company);
  const total = calculateTotalComp(draft);

  return rows.some(
    (row) =>
      normalizeCompanyName(row.company) === normalized &&
      row.role.toLowerCase() === draft.role.toLowerCase() &&
      row.level.toLowerCase() === draft.level.toLowerCase() &&
      row.location.toLowerCase() === draft.location.toLowerCase() &&
      row.currency === draft.currency &&
      Math.abs(row.totalComp - total) <= Math.max(total * 0.02, 1000),
  );
}
