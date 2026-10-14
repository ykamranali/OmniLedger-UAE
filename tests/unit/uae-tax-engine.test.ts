import { describe, it, expect } from "vitest";
import {
  calculateInvoiceTotals,
  calculateCreditNoteReversal,
  roundToFils,
} from "../../src/lib/compliance/uae-tax-engine";

describe("UAE VAT & Decimal Precision Calculation Suite", () => {
  it("should calculate exact standard 5.00% VAT without floating point drift", () => {
    // 3 items @ AED 33.33 each with standard 5% VAT
    const lines = [
      {
        description: "Office Supplies",
        quantity: 3,
        unitPrice: 33.3333,
        taxCategory: "S" as const,
      },
    ];

    const result = calculateInvoiceTotals(lines, "AED");

    // 3 * 33.3333 = 100.00 AED net
    expect(result.subtotalNetAmount).toBe(100.0);
    // 5% of 100 = 5.00 AED
    expect(result.totalTaxAmount).toBe(5.0);
    // Gross = 105.00 AED
    expect(result.grandTotalGrossAmount).toBe(105.0);
  });

  it("should handle line discounts accurately", () => {
    const lines = [
      {
        description: "Cloud Server Hosting",
        quantity: 2,
        unitPrice: 1000.0,
        discountAmount: 200.0, // 200 AED discount on this line
        taxCategory: "S" as const,
      },
    ];

    const result = calculateInvoiceTotals(lines, "AED");

    // (2 * 1000) - 200 = 1800.00 net
    expect(result.subtotalNetAmount).toBe(1800.0);
    // 5% of 1800 = 90.00 AED
    expect(result.totalTaxAmount).toBe(90.0);
    expect(result.grandTotalGrossAmount).toBe(1890.0);
  });

  it("should calculate Zero-Rated (0%) transactions with 0 tax amount", () => {
    const lines = [
      {
        description: "Export of Software Development Services to UK",
        quantity: 1,
        unitPrice: 25000.0,
        taxCategory: "Z" as const,
      },
    ];

    const result = calculateInvoiceTotals(lines, "AED");

    expect(result.subtotalNetAmount).toBe(25000.0);
    expect(result.totalTaxAmount).toBe(0.0);
    expect(result.grandTotalGrossAmount).toBe(25000.0);
    expect(result.taxSubtotals[0].categoryCode).toBe("Z");
  });

  it("should calculate Exempt (E) and Out of Scope (O) supplies with 0 tax", () => {
    const lines = [
      {
        description: "Residential Lease Payment",
        quantity: 1,
        unitPrice: 12000.0,
        taxCategory: "E" as const,
      },
      {
        description: "Disbursement Fee (Sovereign Charges)",
        quantity: 1,
        unitPrice: 500.0,
        taxCategory: "O" as const,
      },
    ];

    const result = calculateInvoiceTotals(lines, "AED");

    expect(result.subtotalNetAmount).toBe(12500.0);
    expect(result.totalTaxAmount).toBe(0.0);
    expect(result.grandTotalGrossAmount).toBe(12500.0);
  });

  it("should calculate partial credit note reversals correctly", () => {
    const originalTotal = 21000.0;
    const originalTax = 1000.0;

    // 50% reversal
    const partial = calculateCreditNoteReversal(originalTotal, originalTax, 50);

    expect(partial.reversalTotal).toBe(10500.0);
    expect(partial.reversalTax).toBe(500.0);
    expect(partial.reversalNet).toBe(10000.0);
  });
});
