// OmniInvoice UAE - Central Data Store & Service Layer
// Backed by in-memory data structures initialized with realistic UAE enterprise datasets.
import { calculateInvoiceTotals, roundToFils } from "../compliance/uae-tax-engine";
import { generatePintAeXml, CanonicalInvoiceDocument } from "../compliance/pint-ae-generator";
import { defaultProviderAdapter } from "../provider/sandbox-provider-adapter";

export interface CompanyModel {
  id: string;
  tenantId: string;
  legalNameEn: string;
  legalNameAr: string;
  tradingName: string;
  trn: string;
  crn: string;
  currency: string;
  streetAddress: string;
  city: string;
  emirate: string;
  countryCode: string;
  contactEmail: string;
  contactPhone: string;
  invoiceSequencePrefix: string;
  currentInvoiceSequence: number;
}

export interface CustomerModel {
  id: string;
  companyId: string;
  legalNameEn: string;
  legalNameAr?: string;
  customerType: "B2B" | "B2C" | "B2G";
  trn?: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  emirate: string;
  countryCode: string;
  paymentTermsDays: number;
  status: "ACTIVE" | "ARCHIVED";
}

export interface InvoiceItemModel {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  unitOfMeasure: string;
  discountAmount: number;
  netAmount: number;
  taxCategory: "S" | "Z" | "E" | "O";
  taxRatePercent: number;
  taxAmount: number;
  grossAmount: number;
}

export interface InvoiceModel {
  id: string;
  companyId: string;
  customerId: string;
  customerName: string;
  customerTrn?: string;
  invoiceNumber: string;
  invoiceType: "TAX_INVOICE" | "SIMPLIFIED_INVOICE" | "COMMERCIAL_INVOICE";
  status: "DRAFT" | "PENDING_APPROVAL" | "APPROVED" | "ISSUED" | "SUBMITTED" | "REJECTED" | "CANCELLED";
  exchangeStatus: "NOT_SUBMITTED" | "QUEUED" | "TRANSMITTED" | "DELIVERED_TO_BUYER" | "BUYER_REJECTED";
  taxReportingStatus: "PENDING" | "REPORTED_CONFIRMED" | "EXEMPT" | "FAILED";
  issueDate: string;
  dueDate: string;
  currency: string;
  netAmount: number;
  discountAmount: number;
  taxableAmount: number;
  taxAmount: number;
  totalAmount: number;
  amountPaid: number;
  paymentStatus: "UNPAID" | "PARTIAL" | "PAID";
  documentHash?: string;
  xmlContent?: string;
  externalReference?: string;
  notes?: string;
  lines: InvoiceItemModel[];
  createdAt: string;
  updatedAt: string;
}

export interface CreditNoteModel {
  id: string;
  companyId: string;
  originalInvoiceId: string;
  originalInvoiceNumber: string;
  creditNoteNumber: string;
  reason: string;
  totalAmount: number;
  taxAmount: number;
  issueDate: string;
  documentHash?: string;
}

export interface AuditLogModel {
  id: string;
  action: string;
  resourceType: string;
  resourceId: string;
  performedBy: string;
  timestamp: string;
  details: string;
}

export interface SubscriptionModel {
  tenantId: string;
  planCode: string;
  status: "ACTIVE" | "TRIAL" | "PAST_DUE";
  monthlyQuota: number;
  usedThisMonth: number;
  currentPeriodEnd: string;
}

class InvoicingDataStore {
  private companies: CompanyModel[] = [];
  private customers: CustomerModel[] = [];
  private invoices: InvoiceModel[] = [];
  private creditNotes: CreditNoteModel[] = [];
  private auditLogs: AuditLogModel[] = [];
  private subscriptions: SubscriptionModel[] = [];

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    // 1. Seed Main UAE Company
    this.companies = [
      {
        id: "comp-dxb-01",
        tenantId: "tenant-omni-01",
        legalNameEn: "Al-Noor Technologies FZCO",
        legalNameAr: "شركة النور للتقنية ش.م.ح",
        tradingName: "Al-Noor Tech UAE",
        trn: "100234567890003",
        crn: "DSO-FZCO-88912",
        currency: "AED",
        streetAddress: "Dubai Silicon Oasis, Tech Hub Tower 2, Office 504",
        city: "Dubai",
        emirate: "Dubai",
        countryCode: "AE",
        contactEmail: "billing@alnoor-tech.ae",
        contactPhone: "+971 4 398 7654",
        invoiceSequencePrefix: "INV-2026-",
        currentInvoiceSequence: 1045,
      },
      {
        id: "comp-auh-02",
        tenantId: "tenant-omni-01",
        legalNameEn: "Gulf Horizon Logistics LLC",
        legalNameAr: "شركة آفاق الخليج للخدمات اللوجستية ذ.م.م",
        tradingName: "Gulf Horizon Logistics",
        trn: "100456789012003",
        crn: "AD-CN-99812",
        currency: "AED",
        streetAddress: "Khalifa Port Logistics Zone, Warehouse 12",
        city: "Abu Dhabi",
        emirate: "Abu Dhabi",
        countryCode: "AE",
        contactEmail: "finance@gulfhorizon.ae",
        contactPhone: "+971 2 445 1122",
        invoiceSequencePrefix: "GHL-INV-",
        currentInvoiceSequence: 2021,
      },
    ];

    // 2. Seed Customers
    this.customers = [
      {
        id: "cust-01",
        companyId: "comp-dxb-01",
        legalNameEn: "Emaar Retail Holdings PJSC",
        legalNameAr: "إعمار لمتاجر التجزئة ش.م.ع",
        customerType: "B2B",
        trn: "100555666777003",
        email: "accounts.payable@emaar-retail.ae",
        phone: "+971 4 367 3333",
        streetAddress: "Downtown Dubai, Emaar Square Building 3",
        city: "Dubai",
        emirate: "Dubai",
        countryCode: "AE",
        paymentTermsDays: 30,
        status: "ACTIVE",
      },
      {
        id: "cust-02",
        companyId: "comp-dxb-01",
        legalNameEn: "Etihad Airways Engineering",
        legalNameAr: "طيران الاتحاد للهندسة",
        customerType: "B2B",
        trn: "100888999111003",
        email: "ap-invoices@etihadengineering.ae",
        phone: "+971 2 511 0000",
        streetAddress: "Abu Dhabi International Airport Complex",
        city: "Abu Dhabi",
        emirate: "Abu Dhabi",
        countryCode: "AE",
        paymentTermsDays: 45,
        status: "ACTIVE",
      },
      {
        id: "cust-03",
        companyId: "comp-dxb-01",
        legalNameEn: "Sharjah Federal University",
        customerType: "B2G",
        trn: "100999000111003",
        email: "procurement@sharjah-edu.ae",
        phone: "+971 6 505 0000",
        streetAddress: "University City Road",
        city: "Sharjah",
        emirate: "Sharjah",
        countryCode: "AE",
        paymentTermsDays: 30,
        status: "ACTIVE",
      },
      {
        id: "cust-04",
        companyId: "comp-dxb-01",
        legalNameEn: "Rashid Salem Al-Mansouri",
        customerType: "B2C",
        email: "rashid.mansouri@outlook.ae",
        phone: "+971 50 123 4567",
        streetAddress: "Jumeirah 2, Villa 45",
        city: "Dubai",
        emirate: "Dubai",
        countryCode: "AE",
        paymentTermsDays: 14,
        status: "ACTIVE",
      },
    ];

    // 3. Seed Realistic Invoices with calculations & PINT hashes
    const inv1Lines: InvoiceItemModel[] = [
      {
        id: "line-1",
        description: "Cloud Architecture & UAE E-Invoicing Advisory (Quarterly)",
        quantity: 1,
        unitPrice: 24000.0,
        unitOfMeasure: "EA",
        discountAmount: 0.0,
        netAmount: 24000.0,
        taxCategory: "S",
        taxRatePercent: 5.0,
        taxAmount: 1200.0,
        grossAmount: 25200.0,
      },
      {
        id: "line-2",
        description: "API Gateway High-Availability Managed Cluster",
        quantity: 3,
        unitPrice: 3500.0,
        unitOfMeasure: "EA",
        discountAmount: 500.0,
        netAmount: 10000.0,
        taxCategory: "S",
        taxRatePercent: 5.0,
        taxAmount: 500.0,
        grossAmount: 10500.0,
      },
    ];

    const inv2Lines: InvoiceItemModel[] = [
      {
        id: "line-3",
        description: "Enterprise ERP Connector Middleware License",
        quantity: 1,
        unitPrice: 18500.0,
        unitOfMeasure: "EA",
        discountAmount: 0.0,
        netAmount: 18500.0,
        taxCategory: "S",
        taxRatePercent: 5.0,
        taxAmount: 925.0,
        grossAmount: 19425.0,
      },
    ];

    const inv3Lines: InvoiceItemModel[] = [
      {
        id: "line-4",
        description: "Staff Training & Peppol Compliance Workshop (2 Days)",
        quantity: 2,
        unitPrice: 4200.0,
        unitOfMeasure: "EA",
        discountAmount: 400.0,
        netAmount: 8000.0,
        taxCategory: "S",
        taxRatePercent: 5.0,
        taxAmount: 400.0,
        grossAmount: 8400.0,
      },
    ];

    this.invoices = [
      {
        id: "inv-001",
        companyId: "comp-dxb-01",
        customerId: "cust-01",
        customerName: "Emaar Retail Holdings PJSC",
        customerTrn: "100555666777003",
        invoiceNumber: "INV-2026-1043",
        invoiceType: "TAX_INVOICE",
        status: "SUBMITTED",
        exchangeStatus: "DELIVERED_TO_BUYER",
        taxReportingStatus: "REPORTED_CONFIRMED",
        issueDate: "2026-10-02",
        dueDate: "2026-11-01",
        currency: "AED",
        netAmount: 34000.0,
        discountAmount: 500.0,
        taxableAmount: 34000.0,
        taxAmount: 1700.0,
        totalAmount: 35700.0,
        amountPaid: 35700.0,
        paymentStatus: "PAID",
        documentHash: "b3f88921a97df1120092c42d689b140feaa45cde8290132bcf742918451fec11",
        externalReference: "AE-PINT-SBX-2026-991204",
        notes: "Payment received via Wio Bank transfer ref #TXN-90214",
        lines: inv1Lines,
        createdAt: "2026-10-02T09:30:00Z",
        updatedAt: "2026-10-02T10:15:00Z",
      },
      {
        id: "inv-002",
        companyId: "comp-dxb-01",
        customerId: "cust-02",
        customerName: "Etihad Airways Engineering",
        customerTrn: "100888999111003",
        invoiceNumber: "INV-2026-1044",
        invoiceType: "TAX_INVOICE",
        status: "ISSUED",
        exchangeStatus: "TRANSMITTED",
        taxReportingStatus: "REPORTED_CONFIRMED",
        issueDate: "2026-10-10",
        dueDate: "2026-11-24",
        currency: "AED",
        netAmount: 18500.0,
        discountAmount: 0.0,
        taxableAmount: 18500.0,
        taxAmount: 925.0,
        totalAmount: 19425.0,
        amountPaid: 0.0,
        paymentStatus: "UNPAID",
        documentHash: "7c12f0a881934c9902bd11ffea5590ac841920ee12351280911fe809931ad912",
        externalReference: "AE-PINT-SBX-2026-991823",
        notes: "Due in 45 days per procurement SLA",
        lines: inv2Lines,
        createdAt: "2026-10-10T11:00:00Z",
        updatedAt: "2026-10-10T11:05:00Z",
      },
      {
        id: "inv-003",
        companyId: "comp-dxb-01",
        customerId: "cust-03",
        customerName: "Sharjah Federal University",
        customerTrn: "100999000111003",
        invoiceNumber: "INV-2026-1045",
        invoiceType: "TAX_INVOICE",
        status: "DRAFT",
        exchangeStatus: "NOT_SUBMITTED",
        taxReportingStatus: "PENDING",
        issueDate: "2026-10-14",
        dueDate: "2026-11-13",
        currency: "AED",
        netAmount: 8000.0,
        discountAmount: 400.0,
        taxableAmount: 8000.0,
        taxAmount: 400.0,
        totalAmount: 8400.0,
        amountPaid: 0.0,
        paymentStatus: "UNPAID",
        notes: "Pending manager approval before issuance and ASP dispatch",
        lines: inv3Lines,
        createdAt: "2026-10-14T08:15:00Z",
        updatedAt: "2026-10-14T08:15:00Z",
      },
    ];

    // 4. Seed Credit Notes
    this.creditNotes = [
      {
        id: "cn-001",
        companyId: "comp-dxb-01",
        originalInvoiceId: "inv-001",
        originalInvoiceNumber: "INV-2026-1043",
        creditNoteNumber: "CN-2026-0012",
        reason: "Volume rebate credit adjustment for Q3 target achievement",
        totalAmount: 2100.0,
        taxAmount: 100.0,
        issueDate: "2026-10-05",
        documentHash: "44abcc998129aaeeff0019283746152435465768798091a2b3c4d5e6f7a8b9c0",
      },
    ];

    // 5. Seed Subscriptions
    this.subscriptions = [
      {
        tenantId: "tenant-omni-01",
        planCode: "BUSINESS",
        status: "ACTIVE",
        monthlyQuota: 250,
        usedThisMonth: 18,
        currentPeriodEnd: "2026-11-01T00:00:00Z",
      },
    ];

    // 6. Seed Audit Logs
    this.auditLogs = [
      {
        id: "log-1",
        action: "INVOICE_ISSUED",
        resourceType: "Invoice",
        resourceId: "INV-2026-1044",
        performedBy: "finance.manager@alnoor-tech.ae",
        timestamp: "2026-10-10T11:05:00Z",
        details: "Issued invoice for Etihad Airways Engineering and queued for ASP transmission.",
      },
      {
        id: "log-2",
        action: "ASP_TRANSMISSION_CONFIRMED",
        resourceType: "ProviderSubmission",
        resourceId: "AE-PINT-SBX-2026-991204",
        performedBy: "OMNI_ASP_SANDBOX_WORKER",
        timestamp: "2026-10-02T10:15:00Z",
        details: "Document received and verified by Access Point. Delivery acknowledgement confirmed.",
      },
    ];
  }

  // --- Company Methods ---
  public getCompanies(): CompanyModel[] {
    return this.companies;
  }

  public getCompanyById(id: string): CompanyModel | undefined {
    return this.companies.find((c) => c.id === id);
  }

  // --- Customer Methods ---
  public getCustomers(companyId?: string): CustomerModel[] {
    if (companyId) {
      return this.customers.filter((c) => c.companyId === companyId);
    }
    return this.customers;
  }

  public addCustomer(customer: Omit<CustomerModel, "id" | "status">): CustomerModel {
    const newCust: CustomerModel = {
      ...customer,
      id: `cust-${Date.now().toString().slice(-4)}`,
      status: "ACTIVE",
    };
    this.customers.unshift(newCust);
    this.recordAudit("CUSTOMER_CREATED", "Customer", newCust.id, `Created customer ${newCust.legalNameEn}`);
    return newCust;
  }

  // --- Invoice Methods ---
  public getInvoices(companyId?: string): InvoiceModel[] {
    if (companyId) {
      return this.invoices.filter((inv) => inv.companyId === companyId);
    }
    return this.invoices;
  }

  public getInvoiceById(id: string): InvoiceModel | undefined {
    return this.invoices.find((inv) => inv.id === id);
  }

  public createInvoice(data: {
    companyId: string;
    customerId: string;
    invoiceType?: "TAX_INVOICE" | "SIMPLIFIED_INVOICE" | "COMMERCIAL_INVOICE";
    issueDate: string;
    dueDate: string;
    notes?: string;
    rawLines: Array<{
      description: string;
      quantity: number;
      unitPrice: number;
      discountAmount?: number;
      taxCategory: "S" | "Z" | "E" | "O";
      unitOfMeasure?: string;
    }>;
  }): InvoiceModel {
    const company = this.getCompanyById(data.companyId);
    const customer = this.customers.find((c) => c.id === data.customerId);

    if (!company) throw new Error("Company not found");
    if (!customer) throw new Error("Customer not found");

    // Sequential numbering
    company.currentInvoiceSequence += 1;
    const invoiceNumber = `${company.invoiceSequencePrefix}${company.currentInvoiceSequence}`;

    // Compute totals using precision decimal tax engine
    const calculated = calculateInvoiceTotals(data.rawLines, company.currency);

    const lines: InvoiceItemModel[] = calculated.lines.map((l, idx) => ({
      id: `line-${idx + 1}`,
      description: l.description,
      quantity: l.quantity,
      unitPrice: l.unitPrice,
      unitOfMeasure: l.unitOfMeasure,
      discountAmount: l.discountAmount,
      netAmount: l.netAmount,
      taxCategory: l.taxCategory,
      taxRatePercent: l.taxRatePercent,
      taxAmount: l.taxAmount,
      grossAmount: l.grossAmount,
    }));

    const newInvoice: InvoiceModel = {
      id: `inv-${Date.now().toString().slice(-6)}`,
      companyId: company.id,
      customerId: customer.id,
      customerName: customer.legalNameEn,
      customerTrn: customer.trn,
      invoiceNumber,
      invoiceType: data.invoiceType || "TAX_INVOICE",
      status: "DRAFT",
      exchangeStatus: "NOT_SUBMITTED",
      taxReportingStatus: "PENDING",
      issueDate: data.issueDate,
      dueDate: data.dueDate,
      currency: company.currency,
      netAmount: calculated.subtotalNetAmount,
      discountAmount: calculated.totalDiscountAmount,
      taxableAmount: calculated.taxableAmount,
      taxAmount: calculated.totalTaxAmount,
      totalAmount: calculated.grandTotalGrossAmount,
      amountPaid: 0.0,
      paymentStatus: "UNPAID",
      notes: data.notes,
      lines,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.invoices.unshift(newInvoice);
    this.recordAudit("INVOICE_CREATED", "Invoice", newInvoice.invoiceNumber, `Created draft invoice ${invoiceNumber}`);

    return newInvoice;
  }

  public async issueAndSubmitToAsp(invoiceId: string): Promise<{ invoice: InvoiceModel; submissionResult: any }> {
    const invoice = this.getInvoiceById(invoiceId);
    if (!invoice) throw new Error("Invoice not found");

    const company = this.getCompanyById(invoice.companyId);
    const customer = this.customers.find((c) => c.id === invoice.customerId);

    if (!company || !customer) throw new Error("Company or Customer record missing");

    // 1. Build Canonical Document
    const canonicalDoc: CanonicalInvoiceDocument = {
      uuid: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      issueDate: invoice.issueDate,
      issueTime: "12:00:00",
      dueDate: invoice.dueDate,
      invoiceTypeCode: invoice.invoiceType === "TAX_INVOICE" ? "388" : "380",
      currency: invoice.currency,
      supplier: {
        trn: company.trn,
        legalName: company.legalNameEn,
        streetAddress: company.streetAddress,
        city: company.city,
        emirate: company.emirate,
        countryCode: "AE",
      },
      customer: {
        trn: customer.trn || "",
        legalName: customer.legalNameEn,
        streetAddress: customer.streetAddress,
        city: customer.city,
        emirate: customer.emirate,
        countryCode: customer.countryCode,
      },
      lines: invoice.lines.map((l) => ({
        id: l.id,
        name: l.description,
        quantity: l.quantity,
        unitOfMeasure: l.unitOfMeasure,
        unitPrice: l.unitPrice,
        discountAmount: l.discountAmount,
        netAmount: l.netAmount,
        taxCategory: l.taxCategory,
        taxRatePercent: l.taxRatePercent,
        taxAmount: l.taxAmount,
      })),
      subtotalNetAmount: invoice.netAmount,
      taxableAmount: invoice.taxableAmount,
      totalTaxAmount: invoice.taxAmount,
      totalGrossAmount: invoice.totalAmount,
    };

    // 2. Generate XML and SHA-256 Hash
    const pintOutput = generatePintAeXml(canonicalDoc);
    invoice.xmlContent = pintOutput.xmlContent;
    invoice.documentHash = pintOutput.sha256Hash;
    invoice.status = "ISSUED";

    // 3. Transmit to Accredited Provider Adapter
    const idempotencyKey = `idemp-${invoice.id}-${invoice.documentHash.slice(0, 10)}`;
    const submission = await defaultProviderAdapter.submit({
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      canonicalDoc,
      xmlContent: pintOutput.xmlContent,
      documentHash: pintOutput.sha256Hash,
      idempotencyKey,
    });

    if (submission.success) {
      invoice.status = "SUBMITTED";
      invoice.exchangeStatus = submission.exchangeStatus;
      invoice.taxReportingStatus = submission.taxReportingStatus;
      invoice.externalReference = submission.externalReference;
    } else {
      invoice.status = "REJECTED";
      invoice.exchangeStatus = "BUYER_REJECTED";
      invoice.taxReportingStatus = "FAILED";
    }

    invoice.updatedAt = new Date().toISOString();

    // Increment usage
    const sub = this.subscriptions.find((s) => s.tenantId === company.tenantId);
    if (sub) {
      sub.usedThisMonth += 1;
    }

    this.recordAudit(
      "INVOICE_SUBMITTED_ASP",
      "Invoice",
      invoice.invoiceNumber,
      `Submitted to ASP with status ${submission.status}. External Ref: ${submission.externalReference || "N/A"}`
    );

    return { invoice, submissionResult: submission };
  }

  // --- Credit Notes ---
  public getCreditNotes(companyId?: string): CreditNoteModel[] {
    if (companyId) {
      return this.creditNotes.filter((cn) => cn.companyId === companyId);
    }
    return this.creditNotes;
  }

  // --- Subscriptions & Quotas ---
  public getSubscription(tenantId = "tenant-omni-01"): SubscriptionModel | undefined {
    return this.subscriptions.find((s) => s.tenantId === tenantId);
  }

  // --- Audit Logs ---
  public getAuditLogs(): AuditLogModel[] {
    return this.auditLogs;
  }

  public recordAudit(action: string, resourceType: string, resourceId: string, details: string) {
    this.auditLogs.unshift({
      id: `log-${Date.now().toString().slice(-5)}`,
      action,
      resourceType,
      resourceId,
      performedBy: "authenticated.user@omni-tenant.ae",
      timestamp: new Date().toISOString(),
      details,
    });
  }

  // --- Dashboard Metrics Aggregator ---
  public getDashboardMetrics(companyId?: string) {
    const list = this.getInvoices(companyId);

    const totalSales = roundToFils(list.reduce((acc, inv) => acc + inv.totalAmount, 0));
    const totalVat = roundToFils(list.reduce((acc, inv) => acc + inv.taxAmount, 0));
    const totalPaid = roundToFils(list.reduce((acc, inv) => acc + inv.amountPaid, 0));
    const outstandingReceivables = roundToFils(Math.max(0, totalSales - totalPaid));

    const draftCount = list.filter((i) => i.status === "DRAFT").length;
    const issuedCount = list.filter((i) => i.status === "ISSUED" || i.status === "SUBMITTED").length;
    const submittedCount = list.filter((i) => i.status === "SUBMITTED").length;
    const rejectedCount = list.filter((i) => i.status === "REJECTED").length;

    const subscription = this.getSubscription();

    return {
      totalSales,
      totalVat,
      outstandingReceivables,
      draftCount,
      issuedCount,
      submittedCount,
      rejectedCount,
      invoiceCount: list.length,
      subscriptionRemainingQuota: subscription ? subscription.monthlyQuota - subscription.usedThisMonth : 100,
      monthlyQuota: subscription ? subscription.monthlyQuota : 100,
      usedThisMonth: subscription ? subscription.usedThisMonth : 0,
    };
  }
}

export const invoicingStore = new InvoicingDataStore();
