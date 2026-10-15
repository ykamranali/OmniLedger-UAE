// OmniInvoice UAE - Production Server-Side Registration Route
// Handles account creation, company initialization, TRN validation, password hashing, and session initialization
import { NextRequest, NextResponse } from "next/server";
import { validatePasswordStrength, hashPassword } from "@/lib/auth/password";
import { validateUaeTrn } from "@/lib/compliance/trn-validator";
import { createSessionToken, getSessionCookieConfig } from "@/lib/auth/session";
import { invoicingStore } from "@/lib/store/invoicing-store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName,
      email,
      password,
      companyName,
      trn,
      city = "Dubai",
      emirate = "Dubai",
      phone = "+971 50 000 0000",
      plan = "BUSINESS",
    } = body;

    // 1. Mandatory Fields Validation
    if (!fullName || !email || !password || !companyName || !trn) {
      return NextResponse.json(
        { error: "Full Name, Email, Password, Company Name, and UAE TRN are required." },
        { status: 400 }
      );
    }

    // 2. Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address format." }, { status: 400 });
    }

    // 3. Password Strength Validation
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.errors.join(" ") },
        { status: 400 }
      );
    }

    // 4. UAE TRN Validation (15 digits, starts with 100)
    const trnValidation = validateUaeTrn(trn);
    if (!trnValidation.isValid) {
      return NextResponse.json({ error: trnValidation.error }, { status: 400 });
    }

    // 5. Check if user already exists
    const existingUser = invoicingStore.getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email address already exists." },
        { status: 409 }
      );
    }

    // 6. Hash password with bcrypt
    const passwordHash = await hashPassword(password);

    // 7. Register Company in Store
    const companyId = `comp-${Date.now().toString().slice(-4)}`;
    const newCompany = invoicingStore.registerCompany({
      id: companyId,
      tenantId: `tenant-${Date.now().toString().slice(-4)}`,
      legalNameEn: companyName,
      legalNameAr: companyName,
      tradingName: companyName,
      trn: trn.replace(/[\s-]/g, ""),
      crn: `CR-${Date.now().toString().slice(-5)}`,
      currency: "AED",
      streetAddress: "Commercial District",
      city,
      emirate,
      countryCode: "AE",
      contactEmail: email,
      contactPhone: phone,
      invoiceSequencePrefix: "INV-",
    });

    // 8. Create User with Company Admin privileges
    const newUser = invoicingStore.createUser({
      name: fullName,
      email,
      password: passwordHash,
      role: "COMPANY_ADMIN",
      assignedCompanyIds: [newCompany.id],
      status: "ACTIVE",
      phoneNumber: phone,
      notes: `Registered via portal with plan ${plan}`,
    });

    // 9. Generate Authenticated Session Token
    const sessionPayload = {
      userId: newUser.id,
      email: newUser.email,
      fullName: newUser.name,
      isSuperAdmin: false,
      tenantId: newCompany.tenantId,
      tenantSlug: newCompany.tenantId,
      role: "COMPANY_ADMIN",
      permissions: ["invoice:read", "invoice:create", "invoice:issue", "company:manage"],
      companyIds: [newCompany.id],
      mfaVerified: true,
      sessionId: `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    };

    const token = await createSessionToken(sessionPayload);
    const cookieConfig = getSessionCookieConfig();

    // 10. Set as current active user
    invoicingStore.setCurrentUser(newUser.id);

    const response = NextResponse.json({
      success: true,
      message: "Account and legal company registered successfully.",
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.name,
        role: newUser.role,
        assignedCompanyIds: newUser.assignedCompanyIds,
      },
      company: {
        id: newCompany.id,
        legalNameEn: newCompany.legalNameEn,
        trn: newCompany.trn,
      },
      token,
    });

    response.cookies.set(cookieConfig.name, token, cookieConfig.options);

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error during account registration";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
