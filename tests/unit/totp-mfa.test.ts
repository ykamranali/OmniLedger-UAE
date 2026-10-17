import { describe, it, expect } from "vitest";
import {
  base32Encode,
  base32Decode,
  generateRandomTotpSecret,
  generateTotpToken,
  verifyTotpToken,
  getTotpAuthUri,
  getUserTotpSecret,
} from "../../src/lib/auth/totp";

describe("RFC 6238 TOTP Two-Factor Authentication Tests", () => {
  it("should correctly encode and decode standard Base32 strings", () => {
    const originalText = "OmniLedgerUAE2026!";
    const buffer = Buffer.from(originalText, "utf-8");
    const encoded = base32Encode(buffer);
    const decoded = base32Decode(encoded).toString("utf-8");

    expect(decoded).toBe(originalText);
  });

  it("should generate a 20-byte cryptographically secure Base32 secret", () => {
    const secret = generateRandomTotpSecret();
    expect(secret).toBeDefined();
    expect(secret.length).toBeGreaterThanOrEqual(32);
    // Decode should produce 20 bytes
    const buf = base32Decode(secret);
    expect(buf.length).toBe(20);
  });

  it("should generate a valid 6-digit numerical token", () => {
    const secret = "JBSWY3DPEHPK3PXPJBSWY3DPEHPK3PXP"; // Standard test base32 key
    const token = generateTotpToken(secret);

    expect(token).toBeDefined();
    expect(token.length).toBe(6);
    expect(/^\d{6}$/.test(token)).toBe(true);
  });

  it("should verify a matching token generated at current time", () => {
    const secret = generateRandomTotpSecret();
    const token = generateTotpToken(secret);

    const isValid = verifyTotpToken(token, secret);
    expect(isValid).toBe(true);
  });

  it("should accept token within the +/- 1 step (30s) drift tolerance window", () => {
    const secret = generateRandomTotpSecret();
    const now = Date.now();
    // 25 seconds ago (within 30s window)
    const token25sAgo = generateTotpToken(secret, now - 25000);

    const isValid = verifyTotpToken(token25sAgo, secret, { timestamp: now, window: 1 });
    expect(isValid).toBe(true);
  });

  it("should reject an invalid token or wrong secret", () => {
    const secretA = generateRandomTotpSecret();
    const secretB = generateRandomTotpSecret();
    const tokenA = generateTotpToken(secretA);

    expect(verifyTotpToken("123456", secretA)).toBe(false);
    expect(verifyTotpToken(tokenA, secretB)).toBe(false);
    expect(verifyTotpToken("", secretA)).toBe(false);
    expect(verifyTotpToken("abc", secretA)).toBe(false);
  });

  it("should construct a valid otpauth:// URI for authenticator app enrollment", () => {
    const secret = "JBSWY3DPEHPK3PXP";
    const uri = getTotpAuthUri("kamran.a@ramtechuae.com", secret, "OmniLedger UAE");

    expect(uri).toContain("otpauth://totp/OmniLedger%20UAE:kamran.a%40ramtechuae.com");
    expect(uri).toContain(`secret=${secret}`);
    expect(uri).toContain("algorithm=SHA1");
    expect(uri).toContain("digits=6");
  });

  it("should deterministically generate a consistent TOTP secret for a user", () => {
    const secret1 = getUserTotpSecret("usr-001", "kamran.a@ramtechuae.com");
    const secret2 = getUserTotpSecret("usr-001", "kamran.a@ramtechuae.com");
    const secret3 = getUserTotpSecret("usr-002", "other@example.com");

    expect(secret1).toBe(secret2);
    expect(secret1).not.toBe(secret3);
  });
});
