import { NextResponse } from "next/server";
import { compareSalaryRows, DATA_SOURCE } from "@/lib/data-access";
import type { ComparisonResponse } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const result = await compareSalaryRows(searchParams.getAll("id"));

  if (!result) {
    return NextResponse.json(
      { errors: ["Pass 1-3 salary row ids as repeated id query params."] },
      { status: 400 },
    );
  }

  const response: ComparisonResponse = {
    data: result,
    meta: {
      source: DATA_SOURCE,
      nextBackendStep: "Resolve ids from database and compute cohort insights.",
    },
  };

  return NextResponse.json(response);
}
