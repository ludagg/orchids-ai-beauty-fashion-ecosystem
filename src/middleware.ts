import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define paths that do not require authentication
  const isPublicPath =
    pathname === "/" ||
    pathname.startsWith("/auth") || // Public auth pages (login/signup)
    pathname.startsWith("/api/auth") || // Auth API endpoints must be public
    pathname.startsWith("/_next") || // Next.js internals
    pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js)$/); // Static files

  if (isPublicPath) {
    return NextResponse.next();
  }

  // Check for session cookie presence to avoid blocking API calls in middleware
  // Actual session validation happens on the client (UserAccount) and server (API routes)
  const hasSessionCookie =
    request.cookies.has("better-auth.session_token") ||
    request.cookies.has("__Secure-better-auth.session_token");

  if (!hasSessionCookie) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  return NextResponse.next();
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
