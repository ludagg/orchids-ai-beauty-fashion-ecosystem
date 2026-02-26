import { NextResponse, type NextRequest } from "next/server";
import rateLimit from "@/lib/rate-limit";
import { createRequestLogger } from "@/lib/logger";

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per second
});

// Hash function for IP to avoid storing PII
function hashIp(ip: string): string {
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `hash_${Math.abs(hash).toString(16)}`;
}

export async function middleware(request: NextRequest) {
  const start = Date.now();
  const { pathname } = request.nextUrl;
  const logger = createRequestLogger({
    method: request.method,
    url: pathname,
  });

  // Rate Limiting for Auth Routes
  if (pathname.startsWith("/api/auth")) {
    const rawIp = request.headers.get("x-forwarded-for") || "unknown";
    const ip = hashIp(rawIp);
    try {
      // 20 requests per minute for auth routes
      await limiter.check(20, ip);
    } catch {
      logger.warn('Rate limit exceeded', { ip });
      return NextResponse.json(
        { error: "Too Many Requests" },
        { status: 429 }
      );
    }
  }

  // Log request for observability (without PII)
  logger.info('Request started', {
    method: request.method,
    path: pathname,
  });

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
    const duration = Date.now() - start;
    
    // Add custom header for debugging
    response.headers.set("x-orchids-latency", `${duration}ms`);
    
    logger.debug('Public path served', { 
      path: pathname, 
      duration: `${duration}ms`,
    });
    
    return response;
  }

  // Check for session cookie presence to avoid blocking API calls in middleware
  // Actual session validation happens on the client (UserAccount) and server (API routes)
  const hasSessionCookie =
    request.cookies.has("better-auth.session_token") ||
    request.cookies.has("__Secure-better-auth.session_token");

  if (!hasSessionCookie) {
    logger.info('Redirecting unauthenticated user to sign-in', { path: pathname });
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  const response = NextResponse.next();
  const duration = Date.now() - start;
  response.headers.set("x-orchids-latency", `${duration}ms`);
  
  logger.debug('Authenticated request served', { 
    path: pathname, 
    duration: `${duration}ms`,
  });
  
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
