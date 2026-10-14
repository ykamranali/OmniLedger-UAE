import { describe, it, expect } from "vitest";
import CryptoJS from "crypto-js";
import { SandboxProviderAdapter } from "../../src/lib/provider/sandbox-provider-adapter";
import { CanonicalInvoiceDocument } from "../../src/lib/compliance/pint-ae-generator";
import { invoicingStore } from "../../src/lib/store/invoicing-store";

describe("ASP Provider Integration & Tenant Isolation Suite", () => {
  const adapter = new SandboxProviderAdapter("test_secret_hmac_123");

  const sampleDoc: CanonicalInvoiceDocument = {
    uuid: "test-uuid-001",
    invoiceNumber: "INV-2026-TEST-99",
    issueDate: "2026-10-14",
    issueTime: "12:00:00",
    dueDate: "2026-11-13",
    invoiceTypeCode: "388",
    currency: "AED",
    supplier: {
      trn: "100234567890003",
      legalName: "Al-Noor Technologies FZCO",
      streetAddress: "Dubai Silicon Oasis",
      city: "Dubai",
      emirate: "Dubai",
      countryCode: "AE",
    },
    customer: {
      trn: "100555666777003",
      legalName: "Emaar Retail Holdings PJSC",
      streetAddress: "Downtown Dubai",
      city: "Dubai",
      emirate: "Dubai",
      countryCode: "AE",
    },
    lines: [
      {
        id: 1,
        name: "Security Audit",
        quantity: 1,
        unitOfMeasure: "EA",
        unitPrice: 2000.0,
        discountAmount: 0,
        netAmount: 2000.0,
        taxCategory: "S",
        taxRatePercent: 5.0,
        taxAmount: 100.0,
      },
    ],
    subtotalNetAmount: 2000.0,
    taxableAmount: 2000.0,
    totalTaxAmount: 100.0,
    totalGrossAmount: 2100.0,
  };

  it("should successfully transmit valid document to ASP and return external reference", async () => {
    const submission = await adapter.submit({
      invoiceId: "inv-test-1",
      invoiceNumber: "INV-2026-TEST-99",
      canonicalDoc: sampleDoc,
      xmlContent: "<Invoice></Invoice>",
      documentHash: "hash123456",
      idempotencyKey: "idemp-unique-key-001",
    });

    expect(submission.success).toBe(true);
    expect(submission.status).toBe("ACCEPTED");
    expect(submission.exchangeStatus).toBe("DELIVERED_TO_BUYER");
    expect(submission.taxReportingStatus).toBe("REPORTED_CONFIRMED");
    expect(submission.externalReference).toMatch(/^AE-PINT-SBX-2026-\d{6}$/);
  });

  it("should enforce idempotency by returning the identical submission on duplicate request", async () => {
    const key = "idemp-duplicate-test-key";

    const res1 = await adapter.submit({
      invoiceId: "inv-test-2",
      invoiceNumber: "INV-2026-TEST-99",
      canonicalDoc: sampleDoc,
      xmlContent: "<Invoice></Invoice>",
      documentHash: "hash123456",
      idempotencyKey: key,
    });

    const res2 = await adapter.submit({
      invoiceId: "inv-test-2",
      invoiceNumber: "INV-2026-TEST-99",
      canonicalDoc: sampleDoc,
      xmlContent: "<Invoice></Invoice>",
      documentHash: "hash123456",
      idempotencyKey: key,
    });

    expect(res1.externalReference).toBe(res2.externalReference);
    expect(res1.timestamp).toBe(res2.timestamp);
  });

  it("should verify valid HMAC-SHA256 webhook signatures and reject forged ones", () => {
    const payload = JSON.stringify({ event: "STATUS_UPDATE", reference: "AE-PINT-SBX-2026-9999" });
    const validSignature = CryptoJS.HmacSHA256(payload, "test_secret_hmac_123").toString(CryptoJS.enc.Hex);

    expect(adapter.verifyWebhookSignature(payload, validSignature)).toBe(true);
    expect(adapter.verifyWebhookSignature(payload, "forged_signature_value")).toBe(false);
  });

  it("should enforce company-level isolation across customer records", () => {
    const dxbCustomers = invoicingStore.getCustomers("comp-dxb-01");
    expect(dxbCustomers.length).toBeGreaterThan(0);
    expect(dxbCustomers.every((c) => c.companyId === "comp-dxb-01")).toBe(true);
  });
});
