import { NextResponse } from "next/server";
import { DATA_SOURCE, ingestSalaryDraft, listSalaries } from "@/lib/data-access";
import type {
  SalaryFilters,
  SalaryIngestionRequest,
  SalaryIngestionResponse,
  SalaryListResponse,
  SortKey,
} from "@/lib/types";

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
  const rows = await listSalaries(filters, sortKey);

  const response: SalaryListResponse = {
    data: rows,
    meta: {
      total: rows.length,
      source: DATA_SOURCE,
    },
  };

  return NextResponse.json(response);
}

export async function POST(request: Request) {
  const body = (await request.json()) as SalaryIngestionRequest;
  const result = await ingestSalaryDraft(body);

  if (!result.ok) {
    return NextResponse.json(result.error, { status: result.status });
  }

  const response: SalaryIngestionResponse = {
    data: result.data,
    meta: {
      persisted: result.persisted,
      source: DATA_SOURCE,
    },
  };

  return NextResponse.json(response, { status: 201 });
}
