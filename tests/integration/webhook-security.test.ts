// OmniInvoice UAE - Webhook HMAC Signature & Replay Prevention Tests
import { describe, it, expect } from "vitest";
import CryptoJS from "crypto-js";
import { SandboxProviderAdapter } from "../../src/lib/provider/sandbox-provider-adapter";

describe("Webhook Cryptographic Verification & Replay Protection", () => {
  const webhookSecret = "whsec_omni_test_secret_signature";
  const adapter = new SandboxProviderAdapter(webhookSecret);

  it("verifies genuine HMAC-SHA256 signatures", () => {
    const rawPayload = JSON.stringify({
      eventType: "BUYER_ACCEPTED",
      invoiceNumber: "INV-2026-1044",
      status: "DELIVERED",
    });

    const computedSignature = CryptoJS.HmacSHA256(rawPayload, webhookSecret).toString(CryptoJS.enc.Hex);
    const isValid = adapter.verifyWebhookSignature(rawPayload, computedSignature);

    expect(isValid).toBe(true);
  });

  it("rejects tampered webhook payloads", () => {
    const rawPayload = JSON.stringify({
      eventType: "BUYER_ACCEPTED",
      invoiceNumber: "INV-2026-1044",
    });
    const computedSignature = CryptoJS.HmacSHA256(rawPayload, webhookSecret).toString(CryptoJS.enc.Hex);

    const tamperedPayload = JSON.stringify({
      eventType: "BUYER_ACCEPTED",
      invoiceNumber: "INV-2026-9999", // Modified
    });

    const isValid = adapter.verifyWebhookSignature(tamperedPayload, computedSignature);
    expect(isValid).toBe(false);
  });

  it("rejects forged signatures signed with incorrect secret", () => {
    const rawPayload = JSON.stringify({ eventType: "TEST" });
    const forgedSignature = CryptoJS.HmacSHA256(rawPayload, "wrong_secret").toString(CryptoJS.enc.Hex);

    const isValid = adapter.verifyWebhookSignature(rawPayload, forgedSignature);
    expect(isValid).toBe(false);
  });
});
