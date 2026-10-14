import { describe, it, expect } from "vitest";
import { generatePintAeXml, CanonicalInvoiceDocument } from "../../src/lib/compliance/pint-ae-generator";
import { validatePintAeDocument } from "../../src/lib/compliance/pint-ae-validator";

describe("UAE PINT AE XML Generator & Schematron Business Rules", () => {
  const validCanonicalDoc: CanonicalInvoiceDocument = {
    uuid: "11223344-5566-7788-9900-aabbccddeeff",
    invoiceNumber: "INV-2026-9001",
    issueDate: "2026-10-14",
    issueTime: "10:30:00",
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
        name: "Enterprise Cloud Subscription",
        quantity: 1,
        unitOfMeasure: "EA",
        unitPrice: 5000.0,
        discountAmount: 0.0,
        netAmount: 5000.0,
        taxCategory: "S",
        taxRatePercent: 5.0,
        taxAmount: 250.0,
      },
    ],
    subtotalNetAmount: 5000.0,
    taxableAmount: 5000.0,
    totalTaxAmount: 250.0,
    totalGrossAmount: 5250.0,
  };

  it("should generate compliant UBL 2.1 XML with PINT AE customization ID and SHA-256 hash", () => {
    const result = generatePintAeXml(validCanonicalDoc);

    expect(result.xmlContent).toContain("<cbc:CustomizationID>urn:peppol:pint:billing-3@ae-1</cbc:CustomizationID>");
    expect(result.xmlContent).toContain("<cbc:ID>INV-2026-9001</cbc:ID>");
    expect(result.xmlContent).toContain("<cbc:EndpointID schemeID=\"0230\">100234567890003</cbc:EndpointID>");
    expect(result.xmlContent).toContain("<cbc:TaxAmount currencyID=\"AED\">250.00</cbc:TaxAmount>");
    expect(result.xmlContent).toContain("<cbc:PayableAmount currencyID=\"AED\">5250.00</cbc:PayableAmount>");

    // Check SHA-256 hash length (64 hex characters)
    expect(result.sha256Hash).toMatch(/^[a-f0-9]{64}$/);
    expect(result.qrPayload).toBeDefined();
  });

  it("should pass all Schematron validation rules for a valid invoice", () => {
    const summary = validatePintAeDocument(validCanonicalDoc);
    expect(summary.isValid).toBe(true);
    expect(summary.errors.length).toBe(0);
  });

  it("should catch BR-AE-01 when supplier TRN is missing or invalid", () => {
    const invalidDoc = {
      ...validCanonicalDoc,
      supplier: {
        ...validCanonicalDoc.supplier,
        trn: "INVALID_TRN",
      },
    };

    const summary = validatePintAeDocument(invalidDoc);
    expect(summary.isValid).toBe(false);
    expect(summary.errors.some((e) => e.ruleId === "BR-AE-01")).toBe(true);
  });

  it("should catch BR-AE-02 when supplier country is not AE", () => {
    const foreignSupplierDoc = {
      ...validCanonicalDoc,
      supplier: {
        ...validCanonicalDoc.supplier,
        countryCode: "US",
      },
    };

    const summary = validatePintAeDocument(foreignSupplierDoc);
    expect(summary.isValid).toBe(false);
    expect(summary.errors.some((e) => e.ruleId === "BR-AE-02")).toBe(true);
  });

  it("should catch BR-CO-03 when line item sum does not equal subtotal net", () => {
    const mismatchedDoc = {
      ...validCanonicalDoc,
      subtotalNetAmount: 9999.0, // Should be 5000.00
    };

    const summary = validatePintAeDocument(mismatchedDoc);
    expect(summary.isValid).toBe(false);
    expect(summary.errors.some((e) => e.ruleId === "BR-CO-03")).toBe(true);
  });
});
