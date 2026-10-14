import { NextResponse } from "next/server";
import { invoicingStore } from "@/lib/store/invoicing-store";

// GET /api/v1/metrics
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId") || undefined;
    const metrics = invoicingStore.getDashboardMetrics(companyId);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: metrics,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
