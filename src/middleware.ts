import { type NextRequest, NextResponse } from "next/server";

// Routes accessibles aux entreprises uniquement
const COMPANY_ONLY_ROUTES = [
  "/dashboard/my-jobs",
  "/dashboard/analytics",
  "/dashboard/billing",
  "/dashboard/leads",
  "/dashboard/company",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isCompanyRoute = COMPANY_ONLY_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  if (isCompanyRoute) {
    const userRole = request.cookies.get("user_role")?.value;
    if (userRole && userRole !== "company") {
      return NextResponse.redirect(new URL("/dashboard/default", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
