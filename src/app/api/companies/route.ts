import { NextResponse } from "next/server";
import { getCompanySummaries } from "@/lib/compensation";

export async function GET() {
  return NextResponse.json({
    data: getCompanySummaries(),
    meta: {
      source: "mock",
      nextBackendStep: "Group salary submissions by company with Prisma.",
    },
  });
}
