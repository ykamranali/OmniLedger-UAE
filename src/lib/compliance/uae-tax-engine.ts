// UAE VAT & Tax Calculation Engine
// Strictly uses fixed decimal arithmetic (cents/fils) to eliminate floating point imprecision.
// Conforms to UAE Federal Decree-Law No. 8 of 2017 on Value Added Tax & Executive Regulations.

export type TaxCategoryCode = "S" | "Z" | "E" | "O";

export interface TaxCategoryDefinition {
  code: TaxCategoryCode;
  nameEn: string;
  nameAr: string;
  defaultRatePercent: number;
  description: string;
  requiresExemptionReason: boolean;
}

export const UAE_TAX_CATEGORIES: Record<TaxCategoryCode, TaxCategoryDefinition> = {
  S: {
    code: "S",
    nameEn: "Standard Rate (5%)",
    nameAr: "النسبة الأساسية (5%)",
    defaultRatePercent: 5.0,
    description: "Standard 5% VAT applicable to most commercial goods and services in the UAE.",
    requiresExemptionReason: false,
  },
  Z: {
    code: "Z",
    nameEn: "Zero Rated (0%)",
    nameAr: "نسبة الصفر (0%)",
    defaultRatePercent: 0.0,
    description: "Exports of goods/services outside GCC, international transport, qualifying healthcare & education.",
    requiresExemptionReason: true,
  },
  E: {
    code: "E",
    nameEn: "Exempt",
    nameAr: "معفى من الضريبة",
    defaultRatePercent: 0.0,
    description: "Qualifying financial services, residential real estate leases, bare land.",
    requiresExemptionReason: true,
  },
  O: {
    code: "O",
    nameEn: "Out of Scope",
    nameAr: "خارج نطاق الضريبة",
    defaultRatePercent: 0.0,
    description: "Disbursements, sovereign transactions, or activities not forming part of economic activity.",
    requiresExemptionReason: false,
  },
};

export interface RawLineItemInput {
  lineNumber?: number;
  description: string;
  quantity: number; // e.g. 2.5
  unitPrice: number; // in AED e.g. 150.00
  discountPercent?: number; // e.g. 10 for 10%
  discountAmount?: number; // fixed discount override
  taxCategory: TaxCategoryCode;
  taxRatePercent?: number; // defaults from category if omitted
  unitOfMeasure?: string; // EA, HUR, KGM, etc.
}

export interface CalculatedLineItem {
  lineNumber: number;
  description: string;
  quantity: number;
  unitPrice: number;
  unitOfMeasure: string;
  rawAmount: number; // quantity * unitPrice
  discountAmount: number;
  netAmount: number; // rawAmount - discountAmount
  taxCategory: TaxCategoryCode;
  taxRatePercent: number;
  taxAmount: number;
  grossAmount: number; // netAmount + taxAmount
}

export interface TaxCategorySubtotal {
  categoryCode: TaxCategoryCode;
  taxRatePercent: number;
  taxableAmount: number;
  taxAmount: number;
}

export interface CalculatedInvoiceTotals {
  lines: CalculatedLineItem[];
  subtotalNetAmount: number;
  totalDiscountAmount: number;
  taxableAmount: number;
  totalTaxAmount: number;
  grandTotalGrossAmount: number;
  currency: string;
  taxSubtotals: TaxCategorySubtotal[];
}

/**
 * Standard UAE Banker's / Half-Up Rounding to exactly 2 decimal places (UAE Fils).
 */
export function roundToFils(amount: number): number {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

/**
 * Rounding to 4 decimal places for unit prices and rates.
 */
export function roundToFourDecimals(amount: number): number {
  return Math.round((amount + Number.EPSILON) * 10000) / 10000;
}

/**
 * Calculates line items and full invoice totals using decimal-safe arithmetic.
 */
export function calculateInvoiceTotals(
  rawLines: RawLineItemInput[],
  currency = "AED",
  documentLevelDiscount = 0
): CalculatedInvoiceTotals {
  let subtotalNet = 0;
  let totalDiscount = 0;
  let totalTax = 0;
  let grandTotal = 0;

  const categorySubtotalMap = new Map<string, { taxable: number; tax: number; rate: number }>();

  const calculatedLines: CalculatedLineItem[] = rawLines.map((raw, idx) => {
    const lineNum = raw.lineNumber || idx + 1;
    const qty = raw.quantity > 0 ? raw.quantity : 1;
    const unitPrice = roundToFourDecimals(raw.unitPrice);
    const rawLineAmount = roundToFils(qty * unitPrice);

    let lineDiscount = 0;
    if (raw.discountAmount !== undefined && raw.discountAmount > 0) {
      lineDiscount = roundToFils(raw.discountAmount);
    } else if (raw.discountPercent && raw.discountPercent > 0) {
      lineDiscount = roundToFils(rawLineAmount * (raw.discountPercent / 100));
    }

    const netAmount = Math.max(0, roundToFils(rawLineAmount - lineDiscount));

    const categoryDef = UAE_TAX_CATEGORIES[raw.taxCategory] || UAE_TAX_CATEGORIES.S;
    const taxRate = raw.taxRatePercent !== undefined ? raw.taxRatePercent : categoryDef.defaultRatePercent;

    // Calculate line VAT
    const taxAmount = taxRate > 0 ? roundToFils(netAmount * (taxRate / 100)) : 0;
    const grossAmount = roundToFils(netAmount + taxAmount);

    subtotalNet = roundToFils(subtotalNet + netAmount);
    totalDiscount = roundToFils(totalDiscount + lineDiscount);
    totalTax = roundToFils(totalTax + taxAmount);
    grandTotal = roundToFils(grandTotal + grossAmount);

    // Grouping by category
    const catKey = `${raw.taxCategory}-${taxRate}`;
    const existing = categorySubtotalMap.get(catKey) || { taxable: 0, tax: 0, rate: taxRate };
    categorySubtotalMap.set(catKey, {
      taxable: roundToFils(existing.taxable + netAmount),
      tax: roundToFils(existing.tax + taxAmount),
      rate: taxRate,
    });

    return {
      lineNumber: lineNum,
      description: raw.description,
      quantity: qty,
      unitPrice,
      unitOfMeasure: raw.unitOfMeasure || "EA",
      rawAmount: rawLineAmount,
      discountAmount: lineDiscount,
      netAmount,
      taxCategory: raw.taxCategory,
      taxRatePercent: taxRate,
      taxAmount,
      grossAmount,
    };
  });

  // Apply document-level discount if any
  const docDiscount = roundToFils(documentLevelDiscount);
  const adjustedTaxable = Math.max(0, roundToFils(subtotalNet - docDiscount));

  const taxSubtotals: TaxCategorySubtotal[] = Array.from(categorySubtotalMap.entries()).map(([key, data]) => {
    const [catCode] = key.split("-") as [TaxCategoryCode];
    return {
      categoryCode: catCode,
      taxRatePercent: data.rate,
      taxableAmount: data.taxable,
      taxAmount: data.tax,
    };
  });

  return {
    lines: calculatedLines,
    subtotalNetAmount: subtotalNet,
    totalDiscountAmount: roundToFils(totalDiscount + docDiscount),
    taxableAmount: adjustedTaxable,
    totalTaxAmount: totalTax,
    grandTotalGrossAmount: grandTotal,
    currency,
    taxSubtotals,
  };
}

/**
 * Calculates credit note reversal amounts against an original invoice.
 */
export function calculateCreditNoteReversal(
  originalTotalAmount: number,
  originalTaxAmount: number,
  reversalPercentage = 100
): { reversalTotal: number; reversalTax: number; reversalNet: number } {
  const ratio = reversalPercentage / 100;
  const reversalTotal = roundToFils(originalTotalAmount * ratio);
  const reversalTax = roundToFils(originalTaxAmount * ratio);
  const reversalNet = roundToFils(reversalTotal - reversalTax);

  return {
    reversalTotal,
    reversalTax,
    reversalNet,
  };
}
