import { NextResponse } from "next/server";
import { invoicingStore } from "@/lib/store/invoicing-store";

// POST /api/v1/invoices/[id]/submit
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await invoicingStore.issueAndSubmitToAsp(id);

    return NextResponse.json({
      success: true,
      message: "Invoice successfully processed through UAE Compliance Engine and submitted to ASP",
      data: {
        invoiceNumber: result.invoice.invoiceNumber,
        status: result.invoice.status,
        exchangeStatus: result.invoice.exchangeStatus,
        taxReportingStatus: result.invoice.taxReportingStatus,
        documentHash: result.invoice.documentHash,
        externalReference: result.invoice.externalReference,
        submissionDetails: result.submissionResult,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit invoice to ASP" },
      { status: 400 }
    );
  }
}
