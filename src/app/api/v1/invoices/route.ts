// OmniInvoice UAE - Production Invoices API Route
// Enforces server-side authentication, company access scoping, and input validation
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/server-auth";
import { InvoiceService } from "@/lib/services/invoice-service";

// GET /api/v1/invoices - Filtered strictly by user's permitted companies
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(request);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "UNAUTHORIZED: Active session required." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId") || undefined;
    const status = searchParams.get("status") || undefined;

    let invoices = await InvoiceService.getInvoices(session, companyId);
    if (status) {
      invoices = invoices.filter((i) => i.status === status);
    }

    return NextResponse.json({
      success: true,
      count: invoices.length,
      data: invoices,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to retrieve invoices";
    const status = message.includes("UNAUTHORIZED") ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

// POST /api/v1/invoices - Creates draft with server-side tax recalculation & company authorization
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(request);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "UNAUTHORIZED: Active session required." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const lines = body.rawLines || body.lines;

    if (!body.companyId || !body.customerId || !lines || lines.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing mandatory fields: companyId, customerId, and at least one line item required.",
        },
        { status: 400 }
      );
    }

    const newInvoice = await InvoiceService.createDraft(session, {
      companyId: body.companyId,
      customerId: body.customerId,
      invoiceType: body.invoiceType,
      issueDate: body.issueDate,
      dueDate: body.dueDate,
      notes: body.notes,
      currency: body.currency || "AED",
      lines,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Invoice draft created successfully with server-verified tax calculations",
        data: newInvoice,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create invoice";
    const status = message.includes("UNAUTHORIZED") ? 403 : 422;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
