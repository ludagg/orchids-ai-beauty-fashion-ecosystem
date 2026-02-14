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

  // Check for session by calling the auth API
  try {
    const response = await fetch(`${request.nextUrl.origin}/api/auth/get-session`, {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    });

    if (!response.ok) {
        // If the session check fails (e.g. 401 or 500), assume unauthenticated
        console.error("Middleware auth check failed. Status:", response.status);
        return NextResponse.redirect(new URL("/auth", request.url));
    }

    const sessionData = await response.json();

    // Better Auth typically returns null or an object with session/user if authenticated
    if (!sessionData || !sessionData.session) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware auth check failed:", error);
    return NextResponse.redirect(new URL("/auth", request.url));
  }
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
