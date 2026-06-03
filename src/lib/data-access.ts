import { companies, researchRows, salarySubmissions } from "./mock-data";
import {
  filterSalaries,
  getCompanyRows,
  getCompanySummaries,
  getCompanySummary,
  groupMedianByLevel,
} from "./compensation";
import type { SalaryFilters, SortKey } from "./types";

export async function getSalaryList(filters: SalaryFilters, sortKey: SortKey) {
  return filterSalaries(salarySubmissions, filters, sortKey);
}

export async function getCompanies() {
  return getCompanySummaries();
}

export async function getCompanyDetail(slug: string) {
  const summary = getCompanySummary(slug);
  const rows = getCompanyRows(slug);

  if (!summary) return null;

  return {
    summary,
    rows,
    levelBands: groupMedianByLevel(rows),
  };
}

export async function getResearchRows() {
  return researchRows;
}

export async function getFilterOptions() {
  return {
    companies: companies.map((company) => company.name),
    roles: Array.from(new Set(salarySubmissions.map((row) => row.role))).sort(),
    levels: Array.from(new Set(salarySubmissions.map((row) => row.level))).sort(),
    locations: Array.from(
      new Set(salarySubmissions.map((row) => row.location)),
    ).sort(),
  };
}
