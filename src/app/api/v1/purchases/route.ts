import { NextResponse } from "next/server";
import { invoicingStore } from "@/lib/store/invoicing-store";

// Purchase Invoices Store Extension
export interface PurchaseInvoiceModel {
  id: string;
  companyId: string;
  supplierName: string;
  supplierTrn?: string;
  supplierInvoiceNumber: string;
  issueDate: string;
  dueDate: string;
  currency: string;
  netAmount: number;
  taxAmount: number;
  totalAmount: number;
  category: "OFFICE_EXPENSES" | "IT_INFRASTRUCTURE" | "PROFESSIONAL_FEES" | "LOGISTICS";
  status: "DRAFT" | "PENDING_REVIEW" | "APPROVED" | "PAID";
  duplicateRisk: boolean;
  notes?: string;
}

// In-memory purchase invoices
let purchaseInvoices: PurchaseInvoiceModel[] = [
  {
    id: "purch-001",
    companyId: "comp-dxb-01",
    supplierName: "Etisalat Telecommunications PJSC",
    supplierTrn: "100111222333003",
    supplierInvoiceNumber: "ET-2026-89104",
    issueDate: "2026-10-01",
    dueDate: "2026-10-25",
    currency: "AED",
    netAmount: 2450.0,
    taxAmount: 122.5,
    totalAmount: 2572.5,
    category: "IT_INFRASTRUCTURE",
    status: "APPROVED",
    duplicateRisk: false,
    notes: "High-speed optical fiber dedicated lease",
  },
  {
    id: "purch-002",
    companyId: "comp-dxb-01",
    supplierName: "Dubai Silicon Oasis Authority",
    supplierTrn: "100444555666003",
    supplierInvoiceNumber: "DSOA-INV-4412",
    issueDate: "2026-10-05",
    dueDate: "2026-11-04",
    currency: "AED",
    netAmount: 15000.0,
    taxAmount: 750.0,
    totalAmount: 15750.0,
    category: "OFFICE_EXPENSES",
    status: "PAID",
    duplicateRisk: false,
    notes: "Office 504 commercial lease and service charge",
  },
];

// GET /api/v1/purchases
export async function GET(request: Request) {
  return NextResponse.json({
    success: true,
    count: purchaseInvoices.length,
    data: purchaseInvoices,
  });
}

// POST /api/v1/purchases
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.supplierName || !body.supplierInvoiceNumber || !body.totalAmount) {
      return NextResponse.json(
        { success: false, error: "Supplier name, supplier invoice #, and total amount are mandatory." },
        { status: 400 }
      );
    }

    // Duplicate Detection: check if invoice from same supplier with same invoice # exists
    const duplicate = purchaseInvoices.some(
      (p) =>
        p.supplierInvoiceNumber.trim().toLowerCase() === body.supplierInvoiceNumber.trim().toLowerCase() &&
        p.supplierName.trim().toLowerCase() === body.supplierName.trim().toLowerCase()
    );

    const netAmount = Number(body.netAmount) || Math.round((Number(body.totalAmount) / 1.05) * 100) / 100;
    const taxAmount = Math.round((Number(body.totalAmount) - netAmount) * 100) / 100;

    const newPurchase: PurchaseInvoiceModel = {
      id: `purch-${Date.now().toString().slice(-4)}`,
      companyId: body.companyId || "comp-dxb-01",
      supplierName: body.supplierName,
      supplierTrn: body.supplierTrn,
      supplierInvoiceNumber: body.supplierInvoiceNumber,
      issueDate: body.issueDate || new Date().toISOString().split("T")[0],
      dueDate: body.dueDate || new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      currency: "AED",
      netAmount,
      taxAmount,
      totalAmount: Number(body.totalAmount),
      category: body.category || "OFFICE_EXPENSES",
      status: "PENDING_REVIEW",
      duplicateRisk: duplicate,
      notes: body.notes,
    };

    purchaseInvoices.unshift(newPurchase);

    invoicingStore.recordAudit(
      "PURCHASE_INVOICE_RECORDED",
      "PurchaseInvoice",
      newPurchase.supplierInvoiceNumber,
      `Recorded purchase invoice from ${newPurchase.supplierName} for AED ${newPurchase.totalAmount}`
    );

    return NextResponse.json(
      { success: true, message: "Purchase invoice recorded", data: newPurchase },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
