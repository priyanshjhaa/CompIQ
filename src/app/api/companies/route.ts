import { NextResponse } from "next/server";
import { DATA_SOURCE, listCompanies } from "@/lib/data-access";
import type { CompanyListResponse } from "@/lib/types";

export async function GET() {
  const response: CompanyListResponse = {
    data: await listCompanies(),
    meta: {
      source: DATA_SOURCE,
    },
  };

  return NextResponse.json(response);
}
