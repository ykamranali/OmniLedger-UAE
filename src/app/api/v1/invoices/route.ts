import { NextResponse } from "next/server";
import { invoicingStore } from "@/lib/store/invoicing-store";

// GET /api/v1/invoices
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId") || undefined;
    const status = searchParams.get("status") || undefined;

    let invoices = invoicingStore.getInvoices(companyId);
    if (status) {
      invoices = invoices.filter((i) => i.status === status);
    }

    return NextResponse.json({
      success: true,
      count: invoices.length,
      data: invoices,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to retrieve invoices" },
      { status: 500 }
    );
  }
}

// POST /api/v1/invoices
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.companyId || !body.customerId || !body.rawLines || body.rawLines.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing mandatory fields: companyId, customerId, and at least one line item required.",
        },
        { status: 400 }
      );
    }

    const newInvoice = invoicingStore.createInvoice({
      companyId: body.companyId,
      customerId: body.customerId,
      invoiceType: body.invoiceType,
      issueDate: body.issueDate || new Date().toISOString().split("T")[0],
      dueDate: body.dueDate || new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      notes: body.notes,
      rawLines: body.rawLines,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Invoice draft created successfully with sequential numbering",
        data: newInvoice,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create invoice" },
      { status: 422 }
    );
  }
}
