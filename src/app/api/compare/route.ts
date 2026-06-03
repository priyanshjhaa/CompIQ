import { NextResponse } from "next/server";
import { salarySubmissions } from "@/lib/mock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.getAll("id").slice(0, 3);
  const rows = ids
    .map((id) => salarySubmissions.find((row) => row.id === id))
    .filter(Boolean);

  if (rows.length === 0) {
    return NextResponse.json(
      { errors: ["Pass 1-3 salary row ids as repeated id query params."] },
      { status: 400 },
    );
  }

  const highestTotal = [...rows].sort(
    (a, b) => b!.totalCompUsd - a!.totalCompUsd,
  )[0];
  const mostCashHeavy = [...rows].sort(
    (a, b) => b!.base / b!.totalComp - a!.base / a!.totalComp,
  )[0];

  return NextResponse.json({
    data: {
      rows,
      insight: {
        highestTotal,
        mostCashHeavy,
      },
    },
    meta: {
      source: "mock",
      nextBackendStep: "Resolve ids from database and compute cohort insights.",
    },
  });
}
