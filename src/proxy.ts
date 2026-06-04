import { NextResponse, type NextRequest } from "next/server";
import { auth, isNeonAuthConfigured } from "@/lib/auth/server";

const protectedProxy = auth.middleware({ loginUrl: "/auth/sign-in" });

export default function proxy(request: NextRequest) {
  if (!isNeonAuthConfigured) {
    const setupUrl = new URL("/auth/setup", request.url);
    setupUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(setupUrl);
  }

  return protectedProxy(request);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/companies/:path*",
    "/research",
    "/api/salaries/:path*",
    "/api/companies/:path*",
    "/api/compare/:path*",
    "/api/research/:path*",
  ],
};
