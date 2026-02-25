import { NextResponse, type NextRequest } from "next/server";
import rateLimit from "@/lib/rate-limit";

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per second
});

export async function middleware(request: NextRequest) {
  const start = Date.now();
  const { pathname } = request.nextUrl;

  // Rate Limiting for Auth Routes
  if (pathname.startsWith("/api/auth")) {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    try {
      // 20 requests per minute for auth routes
      await limiter.check(20, ip);
    } catch {
      return NextResponse.json(
        { error: "Too Many Requests" },
        { status: 429 }
      );
    }
  }

  // Log request for observability
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    method: request.method,
    path: pathname,
    userAgent: request.headers.get('user-agent'),
  }));

  // Define paths that do not require authentication
  const isPublicPath =
    pathname === "/" ||
    pathname.startsWith("/auth") || // Public auth pages (login/signup)
    pathname.startsWith("/api") || // API endpoints are public (auth handled in route handlers)
    pathname.startsWith("/_next") || // Next.js internals
    pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js|txt|xml)$/) || // Static files
    // Allow public discovery
    pathname.startsWith("/app/search") ||
    pathname.startsWith("/app/salons") ||
    pathname.startsWith("/app/marketplace") ||
    pathname.startsWith("/app/ai-stylist") ||
    pathname.startsWith("/app/videos-creations");

  if (isPublicPath) {
    const response = NextResponse.next();
    // Add custom header for debugging
    response.headers.set("x-orchids-latency", `${Date.now() - start}ms`);
    return response;
  }

  // Check for session cookie presence to avoid blocking API calls in middleware
  // Actual session validation happens on the client (UserAccount) and server (API routes)
  const hasSessionCookie =
    request.cookies.has("better-auth.session_token") ||
    request.cookies.has("__Secure-better-auth.session_token");

  if (!hasSessionCookie) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  const response = NextResponse.next();
  response.headers.set("x-orchids-latency", `${Date.now() - start}ms`);
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
