import { NextResponse } from "next/server";
import {
  buildSubmission,
  filterSalaries,
  isLikelyDuplicate,
  validateSubmission,
} from "@/lib/compensation";
import { salarySubmissions } from "@/lib/mock-data";
import type { SalaryFilters, SortKey, SubmissionDraft } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filters: SalaryFilters = {
    query: searchParams.get("query") ?? "",
    company: searchParams.get("company") ?? "",
    role: searchParams.get("role") ?? "",
    level: searchParams.get("level") ?? "",
    location: searchParams.get("location") ?? "",
    currency: (searchParams.get("currency") as SalaryFilters["currency"]) ?? "All",
    market: (searchParams.get("market") as SalaryFilters["market"]) ?? "All",
  };
  const sortKey = (searchParams.get("sort") as SortKey) ?? "totalCompUsd";
  const rows = filterSalaries(salarySubmissions, filters, sortKey);

  return NextResponse.json({
    data: rows,
    meta: {
      total: rows.length,
      source: "mock",
      nextBackendStep: "Replace salarySubmissions with Prisma query filters.",
    },
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as SubmissionDraft;
  const errors = validateSubmission(body);

  if (errors.length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  if (isLikelyDuplicate(body)) {
    return NextResponse.json(
      {
        errors: ["Likely duplicate salary submission."],
        code: "DUPLICATE_SUBMISSION",
      },
      { status: 409 },
    );
  }

  return NextResponse.json(
    {
      data: buildSubmission(body),
      meta: {
        persisted: false,
        source: "mock",
        nextBackendStep: "Persist using Prisma once DATABASE_URL is configured.",
      },
    },
    { status: 201 },
  );
}
