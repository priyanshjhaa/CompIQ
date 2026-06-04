import { NextResponse } from "next/server";
import { DATA_SOURCE, listResearchRows } from "@/lib/data-access";

export async function GET() {
  return NextResponse.json({
    data: listResearchRows(),
    meta: {
      source: DATA_SOURCE,
      nextBackendStep: "Keep static or move into a research_observations table.",
    },
  });
}
