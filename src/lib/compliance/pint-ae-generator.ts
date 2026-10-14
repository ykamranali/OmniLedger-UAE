// UAE PINT AE Canonical Invoice Generator (UBL 2.1 XML / Peppol BIS Billing 3.0 PINT profile for UAE)
// Implements the UAE Ministry of Finance electronic invoicing structured standard specifications.
import CryptoJS from "crypto-js";

export interface CanonicalParty {
  trn: string;
  legalName: string;
  tradingName?: string;
  streetAddress: string;
  buildingNumber?: string;
  city: string;
  emirate: string;
  countryCode: string; // "AE"
  contactEmail?: string;
  contactPhone?: string;
}

export interface CanonicalLineItem {
  id: string | number;
  name: string;
  description?: string;
  quantity: number;
  unitOfMeasure: string; // e.g. "EA", "HUR"
  unitPrice: number;
  discountAmount: number;
  netAmount: number;
  taxCategory: string; // "S", "Z", "E", "O"
  taxRatePercent: number;
  taxAmount: number;
  itemClassificationCode?: string;
}

export interface CanonicalInvoiceDocument {
  uuid: string; // Unique UBL GUID
  invoiceNumber: string; // e.g. "INV-2026-0001"
  issueDate: string; // "YYYY-MM-DD"
  issueTime: string; // "HH:MM:SS"
  dueDate: string; // "YYYY-MM-DD"
  invoiceTypeCode: string; // "388" (Tax Invoice), "381" (Credit Note), "380" (Commercial)
  currency: string; // "AED"
  supplier: CanonicalParty;
  customer: CanonicalParty;
  lines: CanonicalLineItem[];
  subtotalNetAmount: number;
  taxableAmount: number;
  totalTaxAmount: number;
  totalGrossAmount: number;
  paymentMeansCode?: string; // "30" (Credit Transfer), "10" (Cash), "48" (Bank Card)
  paymentTermsNote?: string;
  previousInvoiceHash?: string; // For cryptographic hash chaining
}

export interface GeneratedPintDocument {
  xmlContent: string;
  sha256Hash: string;
  qrPayload: string;
  specificationVersion: string;
}

/**
 * Escapes characters for clean, valid XML attributes and text elements.
 */
function escapeXml(unsafe: string | number | undefined | null): string {
  if (unsafe === undefined || unsafe === null) return "";
  const str = String(unsafe);
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Generates official UAE PINT AE UBL 2.1 XML document and computes its SHA-256 integrity hash.
 */
export function generatePintAeXml(doc: CanonicalInvoiceDocument): GeneratedPintDocument {
  const customizationId = "urn:peppol:pint:billing-3@ae-1";
  const profileId = "urn:peppol:bis:billing";

  const xmlLines: string[] = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"`,
    `  xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"`,
    `  xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">`,
    `  <cbc:CustomizationID>${customizationId}</cbc:CustomizationID>`,
    `  <cbc:ProfileID>${profileId}</cbc:ProfileID>`,
    `  <cbc:ID>${escapeXml(doc.invoiceNumber)}</cbc:ID>`,
    `  <cbc:IssueDate>${escapeXml(doc.issueDate)}</cbc:IssueDate>`,
    `  <cbc:IssueTime>${escapeXml(doc.issueTime)}</cbc:IssueTime>`,
    `  <cbc:DueDate>${escapeXml(doc.dueDate)}</cbc:DueDate>`,
    `  <cbc:InvoiceTypeCode listID="UNCL1001">${escapeXml(doc.invoiceTypeCode)}</cbc:InvoiceTypeCode>`,
    `  <cbc:DocumentCurrencyCode>${escapeXml(doc.currency)}</cbc:DocumentCurrencyCode>`,
    `  <cbc:TaxCurrencyCode>${escapeXml(doc.currency)}</cbc:TaxCurrencyCode>`,
    `  <cbc:UUID>${escapeXml(doc.uuid)}</cbc:UUID>`,
    ``,
    `  <!-- Supplier Party (UAE Tax Resident) -->`,
    `  <cac:AccountingSupplierParty>`,
    `    <cac:Party>`,
    `      <cbc:EndpointID schemeID="0230">${escapeXml(doc.supplier.trn)}</cbc:EndpointID>`,
    `      <cac:PartyIdentification>`,
    `        <cbc:ID schemeID="AE:VAT">${escapeXml(doc.supplier.trn)}</cbc:ID>`,
    `      </cac:PartyIdentification>`,
    `      <cac:PartyName>`,
    `        <cbc:Name>${escapeXml(doc.supplier.legalName)}</cbc:Name>`,
    `      </cac:PartyName>`,
    `      <cac:PostalAddress>`,
    `        <cbc:StreetName>${escapeXml(doc.supplier.streetAddress)}</cbc:StreetName>`,
    `        <cbc:CityName>${escapeXml(doc.supplier.city)}</cbc:CityName>`,
    `        <cbc:CountrySubentity>${escapeXml(doc.supplier.emirate)}</cbc:CountrySubentity>`,
    `        <cac:Country>`,
    `          <cbc:IdentificationCode>${escapeXml(doc.supplier.countryCode)}</cbc:IdentificationCode>`,
    `        </cac:Country>`,
    `      </cac:PostalAddress>`,
    `      <cac:PartyTaxScheme>`,
    `        <cbc:CompanyID>${escapeXml(doc.supplier.trn)}</cbc:CompanyID>`,
    `        <cac:TaxScheme>`,
    `          <cbc:ID>VAT</cbc:ID>`,
    `        </cac:TaxScheme>`,
    `      </cac:PartyTaxScheme>`,
    `      <cac:PartyLegalEntity>`,
    `        <cbc:RegistrationName>${escapeXml(doc.supplier.legalName)}</cbc:RegistrationName>`,
    `      </cac:PartyLegalEntity>`,
    `    </cac:Party>`,
    `  </cac:AccountingSupplierParty>`,
    ``,
    `  <!-- Customer Party (Buyer) -->`,
    `  <cac:AccountingCustomerParty>`,
    `    <cac:Party>`,
    doc.customer.trn
      ? `      <cbc:EndpointID schemeID="0230">${escapeXml(doc.customer.trn)}</cbc:EndpointID>`
      : `      <cbc:EndpointID schemeID="AE:CRN">${escapeXml(doc.customer.legalName)}</cbc:EndpointID>`,
    doc.customer.trn
      ? `      <cac:PartyIdentification><cbc:ID schemeID="AE:VAT">${escapeXml(doc.customer.trn)}</cbc:ID></cac:PartyIdentification>`
      : ``,
    `      <cac:PartyName>`,
    `        <cbc:Name>${escapeXml(doc.customer.legalName)}</cbc:Name>`,
    `      </cac:PartyName>`,
    `      <cac:PostalAddress>`,
    `        <cbc:StreetName>${escapeXml(doc.customer.streetAddress)}</cbc:StreetName>`,
    `        <cbc:CityName>${escapeXml(doc.customer.city)}</cbc:CityName>`,
    `        <cac:Country>`,
    `          <cbc:IdentificationCode>${escapeXml(doc.customer.countryCode)}</cbc:IdentificationCode>`,
    `        </cac:Country>`,
    `      </cac:PostalAddress>`,
    `      <cac:PartyLegalEntity>`,
    `        <cbc:RegistrationName>${escapeXml(doc.customer.legalName)}</cbc:RegistrationName>`,
    `      </cac:PartyLegalEntity>`,
    `    </cac:Party>`,
    `  </cac:AccountingCustomerParty>`,
    ``,
    `  <!-- Payment Means & Terms -->`,
    `  <cac:PaymentMeans>`,
    `    <cbc:PaymentMeansCode>${escapeXml(doc.paymentMeansCode || "30")}</cbc:PaymentMeansCode>`,
    `  </cac:PaymentMeans>`,
    doc.paymentTermsNote ? `  <cac:PaymentTerms><cbc:Note>${escapeXml(doc.paymentTermsNote)}</cbc:Note></cac:PaymentTerms>` : ``,
    ``,
    `  <!-- Tax Total Aggregate (UAE VAT Summary) -->`,
    `  <cac:TaxTotal>`,
    `    <cbc:TaxAmount currencyID="${escapeXml(doc.currency)}">${doc.totalTaxAmount.toFixed(2)}</cbc:TaxAmount>`,
    `    <cac:TaxSubtotal>`,
    `      <cbc:TaxableAmount currencyID="${escapeXml(doc.currency)}">${doc.taxableAmount.toFixed(2)}</cbc:TaxableAmount>`,
    `      <cbc:TaxAmount currencyID="${escapeXml(doc.currency)}">${doc.totalTaxAmount.toFixed(2)}</cbc:TaxAmount>`,
    `      <cac:TaxCategory>`,
    `        <cbc:ID>S</cbc:ID>`,
    `        <cbc:Percent>5.00</cbc:Percent>`,
    `        <cac:TaxScheme>`,
    `          <cbc:ID>VAT</cbc:ID>`,
    `        </cac:TaxScheme>`,
    `      </cac:TaxCategory>`,
    `    </cac:TaxSubtotal>`,
    `  </cac:TaxTotal>`,
    ``,
    `  <!-- Monetary Totals -->`,
    `  <cac:LegalMonetaryTotal>`,
    `    <cbc:LineExtensionAmount currencyID="${escapeXml(doc.currency)}">${doc.subtotalNetAmount.toFixed(2)}</cbc:LineExtensionAmount>`,
    `    <cbc:TaxExclusiveAmount currencyID="${escapeXml(doc.currency)}">${doc.taxableAmount.toFixed(2)}</cbc:TaxExclusiveAmount>`,
    `    <cbc:TaxInclusiveAmount currencyID="${escapeXml(doc.currency)}">${doc.totalGrossAmount.toFixed(2)}</cbc:TaxInclusiveAmount>`,
    `    <cbc:PayableAmount currencyID="${escapeXml(doc.currency)}">${doc.totalGrossAmount.toFixed(2)}</cbc:PayableAmount>`,
    `  </cac:LegalMonetaryTotal>`,
    ``,
    `  <!-- Invoice Line Items -->`,
  ];

  doc.lines.forEach((line, idx) => {
    const lineId = line.id || idx + 1;
    xmlLines.push(`  <cac:InvoiceLine>`);
    xmlLines.push(`    <cbc:ID>${lineId}</cbc:ID>`);
    xmlLines.push(`    <cbc:InvoicedQuantity unitCode="${escapeXml(line.unitOfMeasure)}">${line.quantity}</cbc:InvoicedQuantity>`);
    xmlLines.push(`    <cbc:LineExtensionAmount currencyID="${escapeXml(doc.currency)}">${line.netAmount.toFixed(2)}</cbc:LineExtensionAmount>`);
    xmlLines.push(`    <cac:Item>`);
    xmlLines.push(`      <cbc:Description>${escapeXml(line.description || line.name)}</cbc:Description>`);
    xmlLines.push(`      <cbc:Name>${escapeXml(line.name)}</cbc:Name>`);
    xmlLines.push(`      <cac:ClassifiedTaxCategory>`);
    xmlLines.push(`        <cbc:ID>${escapeXml(line.taxCategory)}</cbc:ID>`);
    xmlLines.push(`        <cbc:Percent>${line.taxRatePercent.toFixed(2)}</cbc:Percent>`);
    xmlLines.push(`        <cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme>`);
    xmlLines.push(`      </cac:ClassifiedTaxCategory>`);
    xmlLines.push(`    </cac:Item>`);
    xmlLines.push(`    <cac:Price>`);
    xmlLines.push(`      <cbc:PriceAmount currencyID="${escapeXml(doc.currency)}">${line.unitPrice.toFixed(4)}</cbc:PriceAmount>`);
    xmlLines.push(`    </cac:Price>`);
    xmlLines.push(`  </cac:InvoiceLine>`);
  });

  xmlLines.push(`</Invoice>`);

  const xmlContent = xmlLines.filter((l) => l !== "").join("\n");

  // Generate SHA-256 cryptographic digest of the document
  const sha256Hash = CryptoJS.SHA256(xmlContent).toString(CryptoJS.enc.Hex);

  // Generate standard QR code payload containing Seller TRN, Timestamp, Invoice Total, VAT Amount, and Hash
  const qrData = {
    seller: doc.supplier.legalName,
    trn: doc.supplier.trn,
    timestamp: `${doc.issueDate}T${doc.issueTime}Z`,
    total: doc.totalGrossAmount.toFixed(2),
    vat: doc.totalTaxAmount.toFixed(2),
    hash: sha256Hash.substring(0, 32),
  };
  const qrPayload = Buffer.from(JSON.stringify(qrData)).toString("base64");

  return {
    xmlContent,
    sha256Hash,
    qrPayload,
    specificationVersion: "PINT-AE-1.0",
  };
}
