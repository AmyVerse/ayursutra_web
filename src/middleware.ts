import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // API key verification only for non-browser requests (Flutter app)
  if (path.startsWith("/api/")) {
    // Check if this is a browser request from our website
    // Browser requests include a 'referer' header with our domain
    // Or they include standard browser headers like 'sec-fetch-site'
    const referer = request.headers.get("referer");
    const secFetchSite = request.headers.get("sec-fetch-site");
    const isBrowserRequest = referer !== null || secFetchSite !== null;

    // Only check API key for non-browser requests (Flutter app)
    if (!isBrowserRequest) {
      const apiKey = request.headers.get("x-api-key");

      // Check if API key is correct using environment variable
      if (apiKey !== process.env.FLUTTER_API_KEY) {
        return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
      }
    }
  }

  // Check if this is a dashboard route
  if (path.startsWith("/dashboard")) {
    // For now, allow all dashboard access since we handle auth in the components
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
