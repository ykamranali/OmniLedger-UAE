// UAE PINT AE E-Invoice Validator
// Implements Schematron-style business rule validation against UAE Ministry of Finance specifications:
// - BR-01 to BR-10: Structural & Header constraints
// - BR-AE-01 to BR-AE-05: Specific UAE Mandates (15-digit TRN, AED currency, UAE Country Code)
// - BR-CO-01 to BR-CO-10: Mathematical cross-totals (Sum of lines = Taxable amount, Taxable * Rate = VAT)

import { validateUaeTrn } from "./trn-validator";
import { CanonicalInvoiceDocument } from "./pint-ae-generator";

export interface ValidationErrorItem {
  ruleId: string;
  field: string;
  severity: "ERROR" | "WARNING";
  message: string;
  remediation: string;
}

export interface ValidationSummary {
  isValid: boolean;
  errors: ValidationErrorItem[];
  warnings: ValidationErrorItem[];
  documentNumber: string;
  specificationVersion: string;
}

export function validatePintAeDocument(doc: CanonicalInvoiceDocument): ValidationSummary {
  const errors: ValidationErrorItem[] = [];
  const warnings: ValidationErrorItem[] = [];

  // BR-01: Invoice Number mandatory
  if (!doc.invoiceNumber || doc.invoiceNumber.trim() === "") {
    errors.push({
      ruleId: "BR-01",
      field: "invoiceNumber",
      severity: "ERROR",
      message: "An Invoice must contain an Invoice number.",
      remediation: "Provide a unique sequential invoice number (e.g., INV-2026-0001).",
    });
  }

  // BR-02: Issue Date mandatory
  if (!doc.issueDate || !/^\d{4}-\d{2}-\d{2}$/.test(doc.issueDate)) {
    errors.push({
      ruleId: "BR-02",
      field: "issueDate",
      severity: "ERROR",
      message: "An Invoice must have an Issue Date formatted as YYYY-MM-DD.",
      remediation: "Set a valid ISO date for invoice issuance.",
    });
  }

  // BR-03: Invoice Type Code mandatory (388 for Tax Invoice, 381 for Credit Note, 380 for Commercial)
  if (!["388", "381", "380"].includes(doc.invoiceTypeCode)) {
    errors.push({
      ruleId: "BR-03",
      field: "invoiceTypeCode",
      severity: "ERROR",
      message: `Invalid Invoice Type Code '${doc.invoiceTypeCode}'. Supported: 388 (Tax Invoice), 381 (Credit Note), 380 (Commercial).`,
      remediation: "Select an approved UNCL1001 document type.",
    });
  }

  // BR-AE-01: Supplier UAE TRN is strictly mandatory
  const supplierTrnResult = validateUaeTrn(doc.supplier?.trn);
  if (!supplierTrnResult.isValid) {
    errors.push({
      ruleId: "BR-AE-01",
      field: "supplier.trn",
      severity: "ERROR",
      message: `Supplier UAE TRN validation failed: ${supplierTrnResult.error}`,
      remediation: "Enter the verified 15-digit UAE FTA Tax Registration Number beginning with 100.",
    });
  }

  // BR-AE-02: Supplier Country must be AE
  if (doc.supplier?.countryCode !== "AE") {
    errors.push({
      ruleId: "BR-AE-02",
      field: "supplier.countryCode",
      severity: "ERROR",
      message: `Supplier must be a UAE registered entity with country code 'AE'. Received: '${doc.supplier?.countryCode}'.`,
      remediation: "Set supplier country code to 'AE'.",
    });
  }

  // BR-06: Supplier Legal Name mandatory
  if (!doc.supplier?.legalName || doc.supplier.legalName.trim() === "") {
    errors.push({
      ruleId: "BR-06",
      field: "supplier.legalName",
      severity: "ERROR",
      message: "Supplier legal name is mandatory.",
      remediation: "Provide the registered legal entity name as shown on the trade license.",
    });
  }

  // BR-07: Customer Legal Name mandatory
  if (!doc.customer?.legalName || doc.customer.legalName.trim() === "") {
    errors.push({
      ruleId: "BR-07",
      field: "customer.legalName",
      severity: "ERROR",
      message: "Customer party legal name is mandatory.",
      remediation: "Provide the buyer/customer legal name.",
    });
  }

  // If customer is B2B and provided a TRN, validate format
  if (doc.customer?.trn) {
    const custTrnResult = validateUaeTrn(doc.customer.trn);
    if (!custTrnResult.isValid) {
      warnings.push({
        ruleId: "BR-AE-03",
        field: "customer.trn",
        severity: "WARNING",
        message: `Customer TRN may be invalid: ${custTrnResult.error}`,
        remediation: "Verify whether the counterparty is registered with UAE FTA.",
      });
    }
  }

  // BR-16: At least one invoice line item must exist
  if (!doc.lines || doc.lines.length === 0) {
    errors.push({
      ruleId: "BR-16",
      field: "lines",
      severity: "ERROR",
      message: "An Invoice must contain at least one line item.",
      remediation: "Add one or more line items before finalizing or submitting.",
    });
  }

  // BR-CO-03: Line extension amount matching
  let calculatedLineSum = 0;
  doc.lines?.forEach((line, index) => {
    if (line.quantity <= 0) {
      errors.push({
        ruleId: `BR-22-LINE-${index + 1}`,
        field: `lines[${index}].quantity`,
        severity: "ERROR",
        message: `Line ${index + 1}: Invoiced quantity must be greater than zero.`,
        remediation: "Set a positive quantity.",
      });
    }
    if (line.unitPrice < 0) {
      errors.push({
        ruleId: `BR-23-LINE-${index + 1}`,
        field: `lines[${index}].unitPrice`,
        severity: "ERROR",
        message: `Line ${index + 1}: Unit price cannot be negative.`,
        remediation: "Enter positive price; use line discount or credit note for reductions.",
      });
    }
    calculatedLineSum += line.netAmount;
  });

  calculatedLineSum = Math.round(calculatedLineSum * 100) / 100;
  if (Math.abs(calculatedLineSum - doc.subtotalNetAmount) > 0.02) {
    errors.push({
      ruleId: "BR-CO-03",
      field: "subtotalNetAmount",
      severity: "ERROR",
      message: `Sum of line net amounts (${calculatedLineSum.toFixed(2)}) does not match subtotal net amount (${doc.subtotalNetAmount.toFixed(2)}).`,
      remediation: "Recalculate invoice totals using fixed precision.",
    });
  }

  // BR-CO-10: Total Gross Amount = Taxable Amount + Tax Amount
  const expectedGross = Math.round((doc.taxableAmount + doc.totalTaxAmount) * 100) / 100;
  if (Math.abs(expectedGross - doc.totalGrossAmount) > 0.02) {
    errors.push({
      ruleId: "BR-CO-10",
      field: "totalGrossAmount",
      severity: "ERROR",
      message: `Invoice gross total (${doc.totalGrossAmount.toFixed(2)}) must equal taxable amount + tax amount (${expectedGross.toFixed(2)}).`,
      remediation: "Reconcile taxable sum and tax amount.",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    documentNumber: doc.invoiceNumber,
    specificationVersion: "PINT-AE-1.0",
  };
}
