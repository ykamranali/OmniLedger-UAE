// OmniInvoice UAE - Server-Side Authentication & Scope Authorization
// Validates session credentials, tenant boundaries, company permissions, and rate limits
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionToken, AuthSessionPayload } from "./session";

// In-memory rate-limiter for login brute-force prevention
interface RateLimitBucket {
  attempts: number;
  blockedUntil: number;
}
const rateLimitMap = new Map<string, RateLimitBucket>();
const MAX_LOGIN_ATTEMPTS = 5;
const BLOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes lockout

export function checkLoginRateLimit(ipOrEmail: string): { allowed: boolean; retryAfterSeconds?: number } {
  const bucket = rateLimitMap.get(ipOrEmail);
  if (!bucket) return { allowed: true };

  const now = Date.now();
  if (bucket.blockedUntil > now) {
    const retryAfterSeconds = Math.ceil((bucket.blockedUntil - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  if (bucket.attempts >= MAX_LOGIN_ATTEMPTS && bucket.blockedUntil <= now) {
    // Reset after expiry
    rateLimitMap.delete(ipOrEmail);
    return { allowed: true };
  }

  return { allowed: true };
}

export function recordFailedLoginAttempt(ipOrEmail: string): void {
  const now = Date.now();
  const bucket = rateLimitMap.get(ipOrEmail) || { attempts: 0, blockedUntil: 0 };
  bucket.attempts += 1;
  if (bucket.attempts >= MAX_LOGIN_ATTEMPTS) {
    bucket.blockedUntil = now + BLOCK_DURATION_MS;
  }
  rateLimitMap.set(ipOrEmail, bucket);
}

export function clearFailedLoginAttempts(ipOrEmail: string): void {
  rateLimitMap.delete(ipOrEmail);
}

/**
 * Extracts and verifies the authenticated session from cookies or Authorization Bearer header
 */
export async function getServerSession(req?: Request): Promise<AuthSessionPayload | null> {
  // 1. Check Authorization Bearer header if request provided
  if (req) {
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const session = await verifySessionToken(token);
      if (session) return session;
    }
  }

  // 2. Check Next.js server cookie store
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (token) {
      return await verifySessionToken(token);
    }
  } catch {
    // In environments where cookies() cannot be evaluated or in direct unit tests
  }

  return null;
}

/**
 * Requires an active authenticated session. Throws 401 error if not authenticated.
 */
export async function requireAuth(req?: Request): Promise<AuthSessionPayload> {
  const session = await getServerSession(req);
  if (!session) {
    throw new Error("UNAUTHORIZED: Active session required.");
  }
  return session;
}

/**
 * Verifies that the user has Super Admin platform privileges.
 */
export async function requireSuperAdmin(req?: Request): Promise<AuthSessionPayload> {
  const session = await requireAuth(req);
  if (!session.isSuperAdmin) {
    throw new Error("FORBIDDEN: Platform Super Admin role required.");
  }
  return session;
}

/**
 * Verifies that the user belongs to the tenant or is super admin.
 */
export async function requireTenantAccess(tenantId: string, req?: Request): Promise<AuthSessionPayload> {
  const session = await requireAuth(req);
  if (session.isSuperAdmin) return session;
  if (session.tenantId !== tenantId) {
    throw new Error("FORBIDDEN: Cross-tenant access denied.");
  }
  return session;
}

/**
 * Verifies that the user has access to a specific company ID within their tenant scope.
 */
export async function requireCompanyAccess(companyId: string, req?: Request): Promise<AuthSessionPayload> {
  const session = await requireAuth(req);
  if (session.isSuperAdmin) return session;
  if (!session.companyIds.includes(companyId)) {
    throw new Error("FORBIDDEN: Access to this legal company entity is not authorized.");
  }
  return session;
}

/**
 * Checks if the user holds a specific permission code.
 */
export function hasPermission(session: AuthSessionPayload, permissionCode: string): boolean {
  if (session.isSuperAdmin) return true;
  if (session.role === "OWNER" || session.role === "ADMIN") return true;
  return session.permissions.includes(permissionCode);
}
