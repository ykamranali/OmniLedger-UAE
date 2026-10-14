import { NextResponse } from "next/server";
import { COMPLIANCE_REGISTER } from "@/lib/compliance/compliance-register";

// GET /api/v1/compliance/register
export async function GET() {
  return NextResponse.json({
    success: true,
    specification: "UAE Ministry of Finance E-Invoicing & Peppol PINT AE",
    version: "1.0.0",
    verifiedRuleCount: COMPLIANCE_REGISTER.length,
    data: COMPLIANCE_REGISTER,
  });
}
