import { companies, researchRows, salarySubmissions } from "./mock-data";
import {
  buildSubmission,
  filterSalaries,
  getCompanyRows,
  getCompanySummaries,
  getCompanySummary,
  groupMedianByLevel,
  isLikelyDuplicate,
  validateSubmission,
} from "./compensation";
import type {
  ApiError,
  CompanyDetail,
  ComparisonInsight,
  DashboardData,
  FilterOptions,
  SalaryFilters,
  SalaryIngestionRequest,
  SortKey,
} from "./types";

export const DATA_SOURCE = "mock" as const;

export function getDashboardData(): DashboardData {
  return {
    companies,
    salaries: salarySubmissions,
    researchRows,
    filterOptions: getFilterOptions(),
  };
}

export function listSalaries(filters: SalaryFilters, sortKey: SortKey) {
  return filterSalaries(salarySubmissions, filters, sortKey);
}

export async function getSalaryList(filters: SalaryFilters, sortKey: SortKey) {
  return listSalaries(filters, sortKey);
}

export function listCompanies() {
  return getCompanySummaries(companies, salarySubmissions);
}

export async function getCompanies() {
  return listCompanies();
}

export function findCompanyDetail(slug: string): CompanyDetail | null {
  const summary = getCompanySummary(companies, salarySubmissions, slug);
  const rows = getCompanyRows(salarySubmissions, slug);

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

export function getFilterOptions(): FilterOptions {
  return {
    companies: companies.map((company) => company.name),
    roles: Array.from(new Set(salarySubmissions.map((row) => row.role))).sort(),
    levels: Array.from(new Set(salarySubmissions.map((row) => row.level))).sort(),
    locations: Array.from(
      new Set(salarySubmissions.map((row) => row.location)),
    ).sort(),
  };
}

export function compareSalaryRows(ids: string[]) {
  const rows = ids
    .slice(0, 3)
    .map((id) => salarySubmissions.find((row) => row.id === id))
    .filter((row): row is NonNullable<typeof row> => Boolean(row));

  if (rows.length === 0) return null;

  const highestTotal = [...rows].sort(
    (a, b) => b!.totalCompUsd - a!.totalCompUsd,
  )[0];
  const mostCashHeavy = [...rows].sort(
    (a, b) => b!.base / b!.totalComp - a!.base / a!.totalComp,
  )[0];

  return {
    rows,
    insight: {
      highestTotal,
      mostCashHeavy,
    } satisfies ComparisonInsight,
  };
}

export function ingestSalaryDraft(body: SalaryIngestionRequest) {
  const errors = validateSubmission(body);

  if (errors.length > 0) {
    return {
      ok: false as const,
      status: 400,
      error: { errors } satisfies ApiError,
    };
  }

  if (isLikelyDuplicate(salarySubmissions, body)) {
    return {
      ok: false as const,
      status: 409,
      error: {
        errors: ["Likely duplicate salary submission."],
        code: "DUPLICATE_SUBMISSION",
      } satisfies ApiError,
    };
  }

  return {
    ok: true as const,
    data: buildSubmission(body),
  };
}
