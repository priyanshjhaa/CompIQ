import { NextResponse } from "next/server";
import { getCompanyDetail } from "@/lib/data-access";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const detail = await getCompanyDetail(slug);

  if (!detail) {
    return NextResponse.json({ errors: ["Company not found."] }, { status: 404 });
  }

  return NextResponse.json({
    data: detail,
    meta: {
      source: "mock",
      nextBackendStep: "Fetch company, salary rows, and derived bands via Prisma.",
    },
  });
}
