// OmniInvoice UAE - Edge/Server Authentication & Authorization Middleware
// Protects customer portal routes (/app/*) and administrative routes (/admin/*)
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE_NAME = "omni_session_token";

function getJwtSecret(): Uint8Array {
  const secret = process.env.APP_SECRET || "omni-invoice-uae-default-dev-secret-32bytes-secure!";
  return new TextEncoder().encode(secret);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Identify protected routes
  const isAppRoute = pathname.startsWith("/app");
  const isAdminRoute = pathname.startsWith("/admin");
  const isProtectedApi = pathname.startsWith("/api/v1/invoices") ||
    pathname.startsWith("/api/v1/purchases") ||
    pathname.startsWith("/api/v1/customers") ||
    pathname.startsWith("/api/v1/metrics");

  if (!isAppRoute && !isAdminRoute && !isProtectedApi) {
    return NextResponse.next();
  }

  // 2. Extract token from cookie or Authorization Bearer header
  let token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
  }

  // 3. Unauthenticated request to protected page
  if (!token) {
    if (isProtectedApi) {
      return NextResponse.json(
        { error: "Authentication required. Missing or expired session token." },
        { status: 401 }
      );
    }
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Verify token
  try {
    const secret = getJwtSecret();
    const { payload } = await jwtVerify(token, secret, {
      issuer: "omniinvoice-uae",
      audience: "omniinvoice-users",
    });

    const isSuperAdmin = Boolean(payload.isSuperAdmin);

    // 5. Protect Super Admin routes
    if (isAdminRoute && !isSuperAdmin) {
      const forbiddenUrl = new URL("/app/dashboard", req.url);
      return NextResponse.redirect(forbiddenUrl);
    }

    // 6. Enrich downstream request headers with authenticated context
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", String(payload.userId || ""));
    requestHeaders.set("x-user-email", String(payload.email || ""));
    requestHeaders.set("x-tenant-id", String(payload.tenantId || ""));
    requestHeaders.set("x-user-role", String(payload.role || ""));
    requestHeaders.set("x-is-super-admin", isSuperAdmin ? "true" : "false");
    requestHeaders.set("x-company-ids", JSON.stringify(payload.companyIds || []));

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch {
    // Invalid / expired token
    if (isProtectedApi) {
      return NextResponse.json(
        { error: "Invalid session token. Please sign in again." },
        { status: 401 }
      );
    }
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    "/app/:path*",
    "/admin/:path*",
    "/api/v1/invoices/:path*",
    "/api/v1/purchases/:path*",
    "/api/v1/customers/:path*",
    "/api/v1/metrics/:path*",
  ],
};
