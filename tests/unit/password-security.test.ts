// OmniInvoice UAE - Password Security & Complexity Unit Tests
import { describe, it, expect } from "vitest";
import { validatePasswordStrength, hashPassword, verifyPassword } from "../../src/lib/auth/password";

describe("Password Security & NIST Compliance", () => {
  it("rejects short passwords (< 8 characters)", () => {
    const res = validatePasswordStrength("Ab1!");
    expect(res.valid).toBe(false);
    expect(res.errors).toContain("Password must be at least 8 characters in length.");
  });

  it("rejects passwords missing uppercase letters", () => {
    const res = validatePasswordStrength("lowercase123!");
    expect(res.valid).toBe(false);
    expect(res.errors).toContain("Password must contain at least one uppercase letter.");
  });

  it("rejects passwords missing numerical digits", () => {
    const res = validatePasswordStrength("NoDigitsHere!");
    expect(res.valid).toBe(false);
    expect(res.errors).toContain("Password must contain at least one numerical digit.");
  });

  it("rejects passwords missing special symbols", () => {
    const res = validatePasswordStrength("NoSymbols2026");
    expect(res.valid).toBe(false);
    expect(res.errors).toContain("Password must contain at least one special character.");
  });

  it("accepts strong passwords meeting all complexity criteria", () => {
    const res = validatePasswordStrength("SecureUaePass2026!");
    expect(res.valid).toBe(true);
    expect(res.errors.length).toBe(0);
  });

  it("hashes password with BCrypt factor 12 and verifies correctly", async () => {
    const rawPass = "ComplexSecret2026@!";
    const hashed = await hashPassword(rawPass);

    expect(hashed).toBeDefined();
    expect(hashed.startsWith("$2a$") || hashed.startsWith("$2b$")).toBe(true);

    const matches = await verifyPassword(rawPass, hashed);
    expect(matches).toBe(true);

    const wrongMatches = await verifyPassword("WrongPassword123!", hashed);
    expect(wrongMatches).toBe(false);
  });
});
