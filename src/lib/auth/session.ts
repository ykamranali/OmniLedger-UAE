// OmniInvoice UAE - Production Session Management
// Built using standard Jose JWT signed tokens with HttpOnly, Secure, SameSite cookie flags
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE_NAME = "omni_session_token";
const DEFAULT_SESSION_EXPIRY = "24h";

export interface AuthSessionPayload {
  userId: string;
  email: string;
  fullName: string;
  isSuperAdmin: boolean;
  tenantId: string;
  tenantSlug: string;
  role: string;
  permissions: string[];
  companyIds: string[];
  mfaVerified: boolean;
  sessionId: string;
}

function getJwtSecret(): Uint8Array {
  const secret = process.env.APP_SECRET || "omni-invoice-uae-default-dev-secret-32bytes-secure!";
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(
  payload: AuthSessionPayload,
  expiresIn: string = DEFAULT_SESSION_EXPIRY
): Promise<string> {
  const secret = getJwtSecret();
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .setIssuer("omniinvoice-uae")
    .setAudience("omniinvoice-users")
    .sign(secret);
}

export async function verifySessionToken(token: string): Promise<AuthSessionPayload | null> {
  if (!token) return null;
  try {
    const secret = getJwtSecret();
    const { payload } = await jwtVerify(token, secret, {
      issuer: "omniinvoice-uae",
      audience: "omniinvoice-users",
    });
    return payload as unknown as AuthSessionPayload;
  } catch {
    return null;
  }
}

export function getSessionCookieConfig() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    name: SESSION_COOKIE_NAME,
    options: {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax" as const,
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours in seconds
    },
  };
}
