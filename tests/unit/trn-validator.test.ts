import { describe, it, expect } from "vitest";
import { validateUaeTrn } from "../../src/lib/compliance/trn-validator";

describe("UAE TRN Validation Suite (Federal Tax Authority rules)", () => {
  it("should accept valid 15-digit UAE TRN starting with 100", () => {
    const validTrn = "100234567890003";
    const result = validateUaeTrn(validTrn);
    expect(result.isValid).toBe(true);
    expect(result.formattedTrn).toBe("100-2345-6789-0003");
  });

  it("should accept valid TRN with hyphens and format cleanly", () => {
    const hyphenated = "100-5556-6677-7003";
    const result = validateUaeTrn(hyphenated);
    expect(result.isValid).toBe(true);
    expect(result.formattedTrn).toBe("100-5556-6677-7003");
  });

  it("should reject TRN with length other than 15 digits", () => {
    const shortTrn = "10023456789000"; // 14 digits
    const result = validateUaeTrn(shortTrn);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("15 digits");
  });

  it("should reject TRN that does not start with 100", () => {
    const wrongPrefix = "200123456789012";
    const result = validateUaeTrn(wrongPrefix);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("prefix '100'");
  });

  it("should reject alphabetic or special characters", () => {
    const invalidChars = "10023456789000A";
    const result = validateUaeTrn(invalidChars);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("digits only");
  });

  it("should reject null or empty string", () => {
    expect(validateUaeTrn(null).isValid).toBe(false);
    expect(validateUaeTrn("").isValid).toBe(false);
  });
});
