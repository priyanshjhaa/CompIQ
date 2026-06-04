import { companies, researchRows, salarySubmissions } from "./mock-data";
import {
  buildSubmission,
  filterSalaries,
  getCompanyRows,
  getCompanySummaries,
  getCompanySummary,
  groupMedianByLevel,
  isLikelyDuplicate,
  normalizeCompanyName,
  toUsd,
} from "./compensation";
import { hasDatabaseUrl, prisma } from "./prisma";
import { salaryIngestionSchema } from "./validation";
import type {
  ApiError,
  Company,
  CompanyDetail,
  ComparisonInsight,
  DashboardData,
  FilterOptions,
  SalaryFilters,
  SalaryIngestionRequest,
  SalarySubmission,
  SortKey,
} from "./types";

export const DATA_SOURCE = hasDatabaseUrl() ? "database" : "mock";

type DbSalaryWithCompany = Awaited<
  ReturnType<typeof prisma.salarySubmission.findMany>
>[number] & {
  company?: {
    id: string;
    name: string;
    slug: string;
    market: string;
    headquarters: string;
    description: string;
  };
};

function dbCompanyToContract(company: {
  id: string;
  name: string;
  slug: string;
  market: string;
  headquarters: string;
  description: string;
}): Company {
  return {
    id: company.id,
    name: company.name,
    slug: company.slug,
    market: company.market as Company["market"],
    headquarters: company.headquarters,
    description: company.description,
  };
}

function dbSalaryToContract(row: DbSalaryWithCompany): SalarySubmission {
  const company = row.company;
  return {
    id: row.id,
    companyId: row.companyId,
    company: company?.name ?? "Unknown company",
    companySlug: company?.slug ?? "unknown",
    role: row.role,
    level: row.level,
    levelRank: row.levelRank,
    location: row.location,
    market: row.market as SalarySubmission["market"],
    currency: row.currency as SalarySubmission["currency"],
    base: row.base,
    bonus: row.bonus,
    stock: row.stock,
    totalComp: row.totalComp,
    totalCompUsd: row.totalCompUsd,
    yearsExperience: row.yearsExperience,
    submittedAt: row.submittedAt.toISOString().slice(0, 10),
    verified: row.verified,
  };
}

function normalizedKey(input: {
  company: string;
  role: string;
  level: string;
  location: string;
  currency: string;
  totalComp: number;
}) {
  return [
    normalizeCompanyName(input.company),
    input.role.toLowerCase(),
    input.level.toLowerCase(),
    input.location.toLowerCase(),
    input.currency,
    input.totalComp,
  ].join("|");
}

export async function getDashboardData(): Promise<DashboardData> {
  if (!hasDatabaseUrl()) {
    return getMockDashboardData();
  }

  const [dbCompanies, dbSalaries] = await Promise.all([
    prisma.company.findMany({ orderBy: { name: "asc" } }),
    prisma.salarySubmission.findMany({ include: { company: true } }),
  ]);

  const salaries = dbSalaries.map(dbSalaryToContract);

  return {
    companies: dbCompanies.map(dbCompanyToContract),
    salaries,
    researchRows,
    filterOptions: getFilterOptionsFromRows(salaries, dbCompanies.map((company) => company.name)),
  };
}

export function getMockDashboardData(): DashboardData {
  return {
    companies,
    salaries: salarySubmissions,
    researchRows,
    filterOptions: getFilterOptionsFromRows(
      salarySubmissions,
      companies.map((company) => company.name),
    ),
  };
}

export async function listSalaries(filters: SalaryFilters, sortKey: SortKey) {
  if (!hasDatabaseUrl()) return filterSalaries(salarySubmissions, filters, sortKey);

  const rows = await prisma.salarySubmission.findMany({ include: { company: true } });
  return filterSalaries(rows.map(dbSalaryToContract), filters, sortKey);
}

export async function getSalaryList(filters: SalaryFilters, sortKey: SortKey) {
  return listSalaries(filters, sortKey);
}

export async function listCompanies() {
  if (!hasDatabaseUrl()) return getCompanySummaries(companies, salarySubmissions);

  const [dbCompanies, dbSalaries] = await Promise.all([
    prisma.company.findMany({ orderBy: { name: "asc" } }),
    prisma.salarySubmission.findMany({ include: { company: true } }),
  ]);

  return getCompanySummaries(
    dbCompanies.map(dbCompanyToContract),
    dbSalaries.map(dbSalaryToContract),
  );
}

export async function getCompanies() {
  return listCompanies();
}

export async function findCompanyDetail(slug: string): Promise<CompanyDetail | null> {
  if (!hasDatabaseUrl()) {
    const summary = getCompanySummary(companies, salarySubmissions, slug);
    const rows = getCompanyRows(salarySubmissions, slug);

    if (!summary) return null;

    return {
      summary,
      rows,
      levelBands: groupMedianByLevel(rows),
    };
  }

  const company = await prisma.company.findUnique({
    where: { slug },
    include: { salaries: { include: { company: true } } },
  });

  if (!company) return null;

  const allRows = (
    await prisma.salarySubmission.findMany({ include: { company: true } })
  ).map(dbSalaryToContract);
  const contractCompany = dbCompanyToContract(company);
  const rows = company.salaries.map(dbSalaryToContract);
  const summary = getCompanySummary([contractCompany], allRows, slug);

  if (!summary) return null;

  return {
    summary,
    rows,
    levelBands: groupMedianByLevel(rows),
  };
}

export async function getCompanyDetail(slug: string) {
  return findCompanyDetail(slug);
}

export function listResearchRows() {
  return researchRows;
}

export async function getResearchRows() {
  return listResearchRows();
}

export function getFilterOptionsFromRows(
  rows: SalarySubmission[],
  companyNames: string[],
): FilterOptions {
  return {
    companies: [...companyNames].sort(),
    roles: Array.from(new Set(rows.map((row) => row.role))).sort(),
    levels: Array.from(new Set(rows.map((row) => row.level))).sort(),
    locations: Array.from(new Set(rows.map((row) => row.location))).sort(),
  };
}

export function getFilterOptions(): FilterOptions {
  return getFilterOptionsFromRows(
    salarySubmissions,
    companies.map((company) => company.name),
  );
}

export async function compareSalaryRows(ids: string[]) {
  const limitedIds = ids.slice(0, 3);
  const rows = hasDatabaseUrl()
    ? (
        await prisma.salarySubmission.findMany({
          where: { id: { in: limitedIds } },
          include: { company: true },
        })
      ).map(dbSalaryToContract)
    : limitedIds
        .map((id) => salarySubmissions.find((row) => row.id === id))
        .filter((row): row is NonNullable<typeof row> => Boolean(row));

  if (rows.length === 0) return null;

  const highestTotal = [...rows].sort(
    (a, b) => b.totalCompUsd - a.totalCompUsd,
  )[0];
  const mostCashHeavy = [...rows].sort(
    (a, b) => b.base / b.totalComp - a.base / a.totalComp,
  )[0];

  return {
    rows,
    insight: {
      highestTotal,
      mostCashHeavy,
    } satisfies ComparisonInsight,
  };
}

export async function ingestSalaryDraft(body: SalaryIngestionRequest) {
  const parsed = salaryIngestionSchema.safeParse(body);

  if (!parsed.success) {
    return {
      ok: false as const,
      status: 400,
      error: {
        errors: parsed.error.issues.map((issue) => issue.message),
      } satisfies ApiError,
    };
  }

  const draft = parsed.data;
  const totalComp = draft.base + draft.bonus + draft.stock;

  if (!hasDatabaseUrl()) {
    if (isLikelyDuplicate(salarySubmissions, draft)) {
      return duplicateError();
    }
    return {
      ok: true as const,
      data: buildSubmission(draft),
      persisted: false,
    };
  }

  const company = await prisma.company.upsert({
    where: { slug: normalizeCompanyName(draft.company).replace(/[^a-z0-9]+/g, "-") },
    update: { name: draft.company.trim(), market: draft.market },
    create: {
      name: draft.company.trim(),
      slug: normalizeCompanyName(draft.company).replace(/[^a-z0-9]+/g, "-"),
      market: draft.market,
      headquarters: draft.location,
      description: "Community submitted compensation data.",
    },
  });

  const key = normalizedKey({ ...draft, totalComp });
  const duplicate = await prisma.salarySubmission.findFirst({
    where: { normalizedKey: key },
  });

  if (duplicate) return duplicateError();

  const created = await prisma.salarySubmission.create({
    data: {
      companyId: company.id,
      role: draft.role.trim(),
      level: draft.level.trim(),
      levelRank: Number(draft.level.match(/\d+/)?.[0] ?? 1),
      location: draft.location.trim(),
      market: draft.market,
      currency: draft.currency,
      base: draft.base,
      bonus: draft.bonus,
      stock: draft.stock,
      totalComp,
      totalCompUsd: toUsd(totalComp, draft.currency),
      yearsExperience: draft.yearsExperience,
      verified: false,
      normalizedKey: key,
    },
    include: { company: true },
  });

  return {
    ok: true as const,
    data: dbSalaryToContract(created),
    persisted: true,
  };
}

function duplicateError() {
  return {
    ok: false as const,
    status: 409,
    error: {
      errors: ["Likely duplicate salary submission."],
      code: "DUPLICATE_SUBMISSION",
    } satisfies ApiError,
  };
}
