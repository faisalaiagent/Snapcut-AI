import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/rate-limiter";

// Routes that require authentication
const PROTECTED_PREFIXES = ["/dashboard", "/tools", "/settings"];
// API routes to rate-limit
const RATE_LIMITED_PREFIXES = ["/api/process", "/api/upload"];

export default auth(function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Auth guard ─────────────────────────────────────────────────────────
  const needsAuth = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (needsAuth && !(req as any).auth) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Rate limiting ──────────────────────────────────────────────────────
  const needsRateLimit = RATE_LIMITED_PREFIXES.some((p) => pathname.startsWith(p));
  if (needsRateLimit) {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "anonymous";

    const result = checkRateLimit(`api:${ip}`, 30, 60_000);

    if (!result.success) {
      return new NextResponse(
        JSON.stringify({ error: "Too many requests. Please slow down." }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(Math.ceil((result.resetAt - Date.now()) / 1000)),
          },
        }
      );
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
