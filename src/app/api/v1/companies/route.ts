// OmniInvoice UAE - Authorized Companies API Route
// Retrieves and registers legal companies strictly scoped by authenticated session permissions

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/server-auth";
import { CompanyService } from "@/lib/services/company-service";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(req);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "UNAUTHORIZED: Active session required." },
        { status: 401 }
      );
    }

    const companies = await CompanyService.getCompaniesForUser(session);

    return NextResponse.json({
      success: true,
      count: companies.length,
      data: companies,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to retrieve companies";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(req);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "UNAUTHORIZED: Active session required." },
        { status: 401 }
      );
    }

    // Only Super Admin or Owner can add legal company entities
    if (!session.isSuperAdmin && session.role !== "OWNER" && session.role !== "COMPANY_ADMIN") {
      return NextResponse.json(
        { success: false, error: "FORBIDDEN: Insufficient permissions to register legal company entities." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      legalNameEn,
      legalNameAr,
      tradingName,
      trn,
      crn,
      currency = "AED",
      streetAddress,
      city = "Dubai",
      emirate = "Dubai",
      contactEmail,
      contactPhone,
      invoiceSequencePrefix = "INV-",
    } = body;

    if (!legalNameEn || !trn || !contactEmail) {
      return NextResponse.json(
        { success: false, error: "Legal Name, UAE TRN, and Contact Email are mandatory." },
        { status: 400 }
      );
    }

    const result = await CompanyService.registerCompany(
      {
        legalNameEn,
        legalNameAr,
        tradingName,
        trn,
        crn,
        currency,
        streetAddress,
        city,
        emirate,
        contactEmail,
        contactPhone,
        invoiceSequencePrefix,
        tenantId: session.tenantId,
      },
      session
    );

    return NextResponse.json(
      {
        success: true,
        message: "Legal company entity registered successfully.",
        data: result.company,
        persistedToDb: result.persistedToDb,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to register company";
    const status = message.includes("Duplicate") ? 409 : 422;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
