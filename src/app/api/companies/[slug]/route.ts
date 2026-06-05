import { NextResponse } from "next/server";
import { DATA_SOURCE, findCompanyDetail } from "@/lib/data-access";
import type { CompanyDetailResponse } from "@/lib/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const detail = await findCompanyDetail(slug);

  if (!detail) {
    return NextResponse.json({ errors: ["Company not found."] }, { status: 404 });
  }

  const response: CompanyDetailResponse = {
    data: detail,
    meta: {
      source: DATA_SOURCE,
    },
  };

  return NextResponse.json(response);
}
