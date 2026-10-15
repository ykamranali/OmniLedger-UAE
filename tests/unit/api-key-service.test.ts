// OmniInvoice UAE - API Key Management & Hashing Tests
import { describe, it, expect } from "vitest";
import { ApiKeyService } from "../../src/lib/services/api-key-service";

describe("API Key Service & SHA-256 Hashing", () => {
  it("generates API key with omni_live prefix and returns plaintext only once", async () => {
    const key = await ApiKeyService.generateKey(
      "tenant-omni-01",
      "ERP Integration Key",
      ["invoice:read", "invoice:create"],
      "live"
    );

    expect(key.plaintextKey.startsWith("omni_live_")).toBe(true);
    expect(key.keyPrefix.startsWith("omni_live_")).toBe(true);
    expect(key.name).toBe("ERP Integration Key");
    expect(key.scopes).toContain("invoice:read");
  });

  it("verifies genuine API key with permitted scopes", async () => {
    const key = await ApiKeyService.generateKey(
      "tenant-omni-01",
      "Accounting Sync",
      ["invoice:read"],
      "live"
    );

    const validResult = ApiKeyService.verifyKey(key.plaintextKey, "invoice:read");
    expect(validResult.valid).toBe(true);
    expect(validResult.tenantId).toBe("tenant-omni-01");

    // Lacks write scope
    const forbiddenResult = ApiKeyService.verifyKey(key.plaintextKey, "invoice:delete");
    expect(forbiddenResult.valid).toBe(false);
    expect(forbiddenResult.error).toContain("lacks required scope");
  });

  it("rejects invalid, unknown, or revoked API keys", async () => {
    const key = await ApiKeyService.generateKey(
      "tenant-omni-01",
      "Temporary Key",
      ["invoice:read"]
    );

    // Revoke key
    const revoked = ApiKeyService.revokeKey(key.id);
    expect(revoked).toBe(true);

    const result = ApiKeyService.verifyKey(key.plaintextKey);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("revoked");

    const nonExistentResult = ApiKeyService.verifyKey("omni_live_fake_key_12345");
    expect(nonExistentResult.valid).toBe(false);
  });
});
