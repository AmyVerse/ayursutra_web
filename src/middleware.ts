import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /dashboard/patient)
  const path = request.nextUrl.pathname;

  // Check if this is a dashboard route
  if (path.startsWith("/dashboard")) {
    // For now, allow all dashboard access since we handle auth in the components
    // In production, you might want to check for session tokens here
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
