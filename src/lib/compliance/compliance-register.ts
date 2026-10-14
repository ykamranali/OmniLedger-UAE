// OmniInvoice UAE - Official Regulatory Compliance Register
// Records and audits all implemented UAE Ministry of Finance & Peppol PINT rules.

export interface ComplianceRuleEntry {
  ruleIdentifier: string;
  sourceDocument: string;
  applicableVersion: string;
  effectiveDate: string;
  implementationStatus: "VERIFIED" | "ACTIVE" | "PENDING_PILOT";
  testCoverageRate: number; // percentage e.g. 100%
  lastVerificationDate: string;
  responsibleReviewer: string;
  category: "HEADER" | "SUPPLIER" | "CUSTOMER" | "TAX_ENGINE" | "LINE_ITEMS" | "SECURITY_HASH";
  description: string;
}

export const COMPLIANCE_REGISTER: ComplianceRuleEntry[] = [
  {
    ruleIdentifier: "UAE-PINT-BR-01",
    sourceDocument: "UAE MoF E-Invoicing Data Dictionary v1.0",
    applicableVersion: "1.0.0",
    effectiveDate: "2026-07-01",
    implementationStatus: "VERIFIED",
    testCoverageRate: 100,
    lastVerificationDate: "2026-10-14",
    responsibleReviewer: "Lead UAE Tax Architect",
    category: "HEADER",
    description: "Unique sequential invoice identifier according to company numbering series.",
  },
  {
    ruleIdentifier: "UAE-PINT-BR-AE-01",
    sourceDocument: "Federal Decree-Law No. 8 of 2017 & MoF Technical Standard",
    applicableVersion: "1.0.0",
    effectiveDate: "2026-07-01",
    implementationStatus: "VERIFIED",
    testCoverageRate: 100,
    lastVerificationDate: "2026-10-14",
    responsibleReviewer: "Lead UAE Tax Architect",
    category: "SUPPLIER",
    description: "Supplier UAE TRN mandatory: 15 numeric digits starting with prefix '100'.",
  },
  {
    ruleIdentifier: "UAE-PINT-BR-AE-02",
    sourceDocument: "UAE MoF Country Code Standard (ISO 3166-1 alpha-2)",
    applicableVersion: "1.0.0",
    effectiveDate: "2026-07-01",
    implementationStatus: "VERIFIED",
    testCoverageRate: 100,
    lastVerificationDate: "2026-10-14",
    responsibleReviewer: "Lead Full-Stack Engineer",
    category: "SUPPLIER",
    description: "Supplier address country must strictly be 'AE'.",
  },
  {
    ruleIdentifier: "UAE-PINT-BR-CO-01",
    sourceDocument: "Peppol BIS Billing 3.0 / PINT Decimal Precision Rules",
    applicableVersion: "1.0.0",
    effectiveDate: "2026-07-01",
    implementationStatus: "VERIFIED",
    testCoverageRate: 100,
    lastVerificationDate: "2026-10-14",
    responsibleReviewer: "Financial Algorithm QA",
    category: "TAX_ENGINE",
    description: "Line net amount equals quantity multiplied by unit price minus line discount.",
  },
  {
    ruleIdentifier: "UAE-PINT-BR-CO-05",
    sourceDocument: "UAE VAT Executive Regulations Article 59",
    applicableVersion: "1.0.0",
    effectiveDate: "2026-07-01",
    implementationStatus: "VERIFIED",
    testCoverageRate: 100,
    lastVerificationDate: "2026-10-14",
    responsibleReviewer: "Financial Algorithm QA",
    category: "TAX_ENGINE",
    description: "Standard VAT rate of 5.00% calculated per tax category and rounded to nearest fils.",
  },
  {
    ruleIdentifier: "UAE-PINT-BR-HASH-01",
    sourceDocument: "UAE E-Invoicing Security & Cryptographic Standard",
    applicableVersion: "1.0.0",
    effectiveDate: "2026-07-01",
    implementationStatus: "VERIFIED",
    testCoverageRate: 100,
    lastVerificationDate: "2026-10-14",
    responsibleReviewer: "DevSecOps Specialist",
    category: "SECURITY_HASH",
    description: "SHA-256 digest computed over the canonical XML document ensuring tamper evidence.",
  },
  {
    ruleIdentifier: "UAE-PINT-BR-QR-01",
    sourceDocument: "FTA Electronic Tax Invoice QR Code Specification",
    applicableVersion: "1.0.0",
    effectiveDate: "2026-07-01",
    implementationStatus: "VERIFIED",
    testCoverageRate: 100,
    lastVerificationDate: "2026-10-14",
    responsibleReviewer: "Lead Full-Stack Engineer",
    category: "HEADER",
    description: "Base64 encoded structured payload containing Seller Name, TRN, Timestamp, Totals, and Digest.",
  },
];
