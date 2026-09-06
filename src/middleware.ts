import { NextResponse, type NextRequest } from "next/server";
import rateLimit from "@/lib/rate-limit";

const limiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
});

export async function middleware(request: NextRequest) {
  const start = Date.now();
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/auth")) {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    try {
      await limiter.check(20, ip);
    } catch {
      return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
    }
  }

  const isPublicPath =
    pathname === "/" ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/test-ai-fit") ||
    pathname.startsWith("/app/shop/product/") || // Allow product pages publicly for test
    pathname.startsWith("/_next") ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js|txt|xml)$/) ||
    pathname.startsWith("/app/search") ||
    pathname.startsWith("/app/salons") ||
    pathname.startsWith("/app/marketplace") ||
    pathname.startsWith("/app/ai-stylist") ||
    pathname.startsWith("/app/videos-creations");

  if (isPublicPath) {
    const response = NextResponse.next();
    response.headers.set("x-orchids-latency", `${Date.now() - start}ms`);
    return response;
  }

  if (pathname.startsWith("/admin")) {
     const hasSessionCookie =
        request.cookies.has("better-auth.session_token") ||
        request.cookies.has("__Secure-better-auth.session_token");

     if (!hasSessionCookie) {
        return NextResponse.redirect(new URL("/auth/sign-in", request.url));
     }
  }

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
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
