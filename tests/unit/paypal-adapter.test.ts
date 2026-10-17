import { describe, it, expect, beforeEach } from "vitest";
import { PayPalAdapter } from "../../src/lib/payments/paypal/paypal-adapter";
import { getPaymentGateway } from "../../src/lib/payments";

describe("PayPal Gateway Adapter & Webhook Security Unit Tests", () => {
  let adapter: PayPalAdapter;

  beforeEach(() => {
    adapter = new PayPalAdapter();
  });

  it("should initialize the modular gateway factory with PayPal provider", () => {
    const gateway = getPaymentGateway("paypal");
    expect(gateway).toBeDefined();
    expect(gateway.providerName).toBe("paypal");
  });

  it("should generate a checkout session for monthly subscription", async () => {
    const checkout = await adapter.createSubscriptionCheckout({
      tenantId: "tenant-test-01",
      companyId: "comp-alain-01",
      companyName: "Al Ain Apex Engineering LLC",
      planId: "growth",
      planName: "Growth Plan",
      billingCycle: "MONTHLY",
      amountAed: 799,
      customerEmail: "ykamranali@outlook.com",
      returnUrl: "http://localhost:3000/checkout?status=success",
      cancelUrl: "http://localhost:3000/checkout?status=cancelled",
    });

    expect(checkout.orderId).toBeDefined();
    expect(checkout.checkoutUrl).toBeDefined();
    expect(checkout.provider).toBe("paypal");
  });

  it("should verify subscription checkout status safely", async () => {
    const verification = await adapter.verifySubscription("PAYPAL-TEST-ORDER-12345");
    expect(verification).toBeDefined();
    expect(verification.orderId).toBe("PAYPAL-TEST-ORDER-12345");
    expect(["ACTIVE", "APPROVED", "COMPLETED"]).toContain(verification.status);
    expect(verification.amountAed).toBeGreaterThan(0);
  });

  it("should safely handle duplicate webhook events with idempotency", async () => {
    const mockHeaders = {
      "paypal-transmission-id": "trans-dup-check-001",
      "paypal-transmission-time": new Date().toISOString(),
      "paypal-cert-url": "https://api.sandbox.paypal.com/v1/cert",
      "paypal-auth-algo": "SHA256withRSA",
      "paypal-transmission-sig": "mock_sig_base64_payload",
    };

    const mockEvent = {
      id: "WH-EVT-DUPLICATE-TEST-001",
      event_type: "PAYMENT.CAPTURE.COMPLETED",
      resource: {
        id: "CAP-001",
        custom_id: JSON.stringify({
          tenantId: "tenant-test-01",
          companyId: "comp-01",
          planId: "growth",
          billingInterval: "monthly",
        }),
      },
    };

    // First delivery
    const result1 = await adapter.handleWebhookEvent(mockEvent);
    expect(result1.processed).toBe(true);

    // Second delivery (duplicate event ID)
    const result2 = await adapter.handleWebhookEvent(mockEvent);
    expect(result2.processed).toBe(true);
    expect(result2.message).toContain("Duplicate webhook event skipped");
  });

  it("should reject webhook validation when required PayPal signature headers are missing", async () => {
    const invalidHeaders = {
      "paypal-transmission-id": "",
    };

    const verification = await adapter.verifyWebhookSignature({
      rawBody: JSON.stringify({ test: "data" }),
      headers: invalidHeaders,
    });

    expect(verification.isValid).toBe(false);
  });
});
