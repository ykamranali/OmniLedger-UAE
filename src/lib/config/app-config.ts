// OmniInvoice UAE - Central Configuration
// All branding and application metadata are strictly configurable from here

export interface AppConfig {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  supportEmail: string;
  salesEmail: string;
  contactPerson: string;
  contactPhone: string;
  officeAddress: string;
  city: string;
  country: string;
  defaultCurrency: string;
  defaultTaxRatePercent: number;
  complianceVersion: string;
  regulatoryBody: string;
  supportedLocales: Array<{ code: string; label: string; dir: "ltr" | "rtl" }>;
  subscriptionPlans: Array<{
    id: string;
    name: string;
    monthlyPriceAed: number;
    annualPriceAed: number;
    invoiceQuotaMonthly: number;
    companyLimit: number;
    features: string[];
    isPopular?: boolean;
  }>;
}

export const appConfig: AppConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME || "OmniLedger UAE",
  shortName: "OmniLedger",
  tagline: "The Modern General Ledger & UAE E-Invoicing Platform",
  description:
    "Enterprise-grade general ledger & UAE e-invoicing for SMEs, accounting firms, and enterprises. Fully aligned with UAE Ministry of Finance mandates and Peppol PINT AE standards.",
  supportEmail: "kamran.a@ramtechuae.com",
  salesEmail: "kamran.a@ramtechuae.com",
  contactPerson: "Kamran Ali",
  contactPhone: "+971 56 450 4650",
  officeAddress: "Abu Baker Al Siddiq St, Al Ain - Abu Dhabi",
  city: "Al Ain - Abu Dhabi",
  country: "United Arab Emirates",
  defaultCurrency: process.env.DEFAULT_CURRENCY || "AED",
  defaultTaxRatePercent: 5.0,
  complianceVersion: process.env.COMPLIANCE_VERSION || "PINT-AE-1.0",
  regulatoryBody: "UAE Ministry of Finance & Federal Tax Authority (FTA)",
  supportedLocales: [
    { code: "en", label: "English", dir: "ltr" },
    { code: "ar", label: "العربية", dir: "rtl" },
  ],
  subscriptionPlans: [
    {
      id: "STARTER",
      name: "Starter",
      monthlyPriceAed: 149,
      annualPriceAed: 1490,
      invoiceQuotaMonthly: 50,
      companyLimit: 1,
      features: [
        "1 UAE Legal Entity (TRN)",
        "Up to 50 structured invoices / month",
        "UAE PINT AE XML validation",
        "Standard 5% VAT calculations",
        "Customer & supplier directory",
        "PDF tax invoice generation",
        "Email support",
      ],
    },
    {
      id: "BUSINESS",
      name: "Business",
      monthlyPriceAed: 349,
      annualPriceAed: 3490,
      invoiceQuotaMonthly: 250,
      companyLimit: 2,
      isPopular: true,
      features: [
        "2 UAE Legal Entities & 5 Branches",
        "Up to 250 structured invoices / month",
        "Direct ASP Peppol Sandbox integration",
        "SHA-256 Document Hash Chain",
        "Credit notes & debit adjustments",
        "Dual English & Arabic PDF invoices",
        "Automated VAT return summary reports",
        "Priority 4h support SLA",
      ],
    },
    {
      id: "PROFESSIONAL",
      name: "Professional",
      monthlyPriceAed: 799,
      annualPriceAed: 7990,
      invoiceQuotaMonthly: 1000,
      companyLimit: 5,
      features: [
        "5 Legal Entities & Unlimited Branches",
        "Up to 1,000 structured invoices / month",
        "Full REST API & Webhook dispatch",
        "Multi-user RBAC & Audit trail",
        "Custom sequential numbering series",
        "Automatic counterparty TRN verification",
        "Receivables & Payables ageing analysis",
        "Dedicated account manager",
      ],
    },
    {
      id: "ACCOUNTANT",
      name: "Accounting Firm",
      monthlyPriceAed: 1299,
      annualPriceAed: 12990,
      invoiceQuotaMonthly: 3000,
      companyLimit: 25,
      features: [
        "Up to 25 Client Companies under 1 portal",
        "3,000 pooled invoices / month",
        "Accountant multi-client switcher",
        "Bulk batch invoice submission to ASP",
        "Consolidated VAT summary & FTA export",
        "Client permission delegating & review mode",
        "Priority phone & WhatsApp support",
      ],
    },
    {
      id: "ENTERPRISE",
      name: "Enterprise",
      monthlyPriceAed: 2499,
      annualPriceAed: 24990,
      invoiceQuotaMonthly: 10000,
      companyLimit: 50,
      features: [
        "Unlimited Legal Entities & Branches",
        "10,000+ invoices / month",
        "Custom ERP integration (SAP, Oracle, NetSuite)",
        "Dedicated Accredited Service Provider connection",
        "Self-hosted / Private Cloud deployment option",
        "Custom SLA & 99.99% uptime guarantee",
        "24/7 technical incident response",
      ],
    },
  ],
};
