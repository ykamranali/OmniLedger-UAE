import { NextResponse } from "next/server";
import { invoicingStore } from "@/lib/store/invoicing-store";
import { validateUaeTrn } from "@/lib/compliance/trn-validator";

// GET /api/v1/customers
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId") || undefined;
    const customers = invoicingStore.getCustomers(companyId);

    return NextResponse.json({
      success: true,
      count: customers.length,
      data: customers,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/v1/customers
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.companyId || !body.legalNameEn || !body.streetAddress || !body.city) {
      return NextResponse.json(
        { success: false, error: "Missing required customer details." },
        { status: 400 }
      );
    }

    if (body.customerType === "B2B" && body.trn) {
      const trnCheck = validateUaeTrn(body.trn);
      if (!trnCheck.isValid) {
        return NextResponse.json({ success: false, error: trnCheck.error }, { status: 422 });
      }
    }

    const newCustomer = invoicingStore.addCustomer({
      companyId: body.companyId,
      legalNameEn: body.legalNameEn,
      legalNameAr: body.legalNameAr,
      customerType: body.customerType || "B2B",
      trn: body.trn,
      email: body.email || "info@counterparty.ae",
      phone: body.phone || "+971 4 000 0000",
      streetAddress: body.streetAddress,
      city: body.city,
      emirate: body.emirate || "Dubai",
      countryCode: body.countryCode || "AE",
      paymentTermsDays: Number(body.paymentTermsDays) || 30,
    });

    return NextResponse.json(
      { success: true, message: "Customer created successfully", data: newCustomer },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
