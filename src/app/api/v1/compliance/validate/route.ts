import { NextResponse } from "next/server";
import { validatePintAeDocument } from "@/lib/compliance/pint-ae-validator";
import { CanonicalInvoiceDocument } from "@/lib/compliance/pint-ae-generator";

// POST /api/v1/compliance/validate
export async function POST(request: Request) {
  try {
    const doc: CanonicalInvoiceDocument = await request.json();
    const validation = validatePintAeDocument(doc);

    return NextResponse.json({
      success: true,
      data: validation,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
