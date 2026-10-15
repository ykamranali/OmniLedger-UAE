// OmniInvoice UAE - Jose JWT Session Unit Tests
import { describe, it, expect } from "vitest";
import { createSessionToken, verifySessionToken, AuthSessionPayload } from "../../src/lib/auth/session";

describe("Jose JWT Session Management", () => {
  const mockPayload: AuthSessionPayload = {
    userId: "usr-kamran-01",
    email: "kamran.a@ramtechuae.com",
    fullName: "Kamran Ali",
    isSuperAdmin: true,
    tenantId: "tenant-omni-01",
    tenantSlug: "omni-tenant",
    role: "SUPER_ADMIN",
    permissions: ["*"],
    companyIds: ["comp-dxb-01", "comp-auh-02"],
    mfaVerified: true,
    sessionId: "sess_123456",
  };

  it("creates a signed JWT token and verifies the payload claims", async () => {
    const token = await createSessionToken(mockPayload, "1h");
    expect(token).toBeDefined();
    expect(typeof token).toBe("string");

    const decoded = await verifySessionToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.userId).toBe(mockPayload.userId);
    expect(decoded?.email).toBe(mockPayload.email);
    expect(decoded?.isSuperAdmin).toBe(true);
    expect(decoded?.companyIds).toEqual(mockPayload.companyIds);
  });

  it("fails to verify tampered tokens", async () => {
    const token = await createSessionToken(mockPayload, "1h");
    const tampered = token.slice(0, -6) + "abcdef";

    const result = await verifySessionToken(tampered);
    expect(result).toBeNull();
  });

  it("fails to verify empty or invalid strings", async () => {
    expect(await verifySessionToken("")).toBeNull();
    expect(await verifySessionToken("invalid.jwt.token")).toBeNull();
  });
});
