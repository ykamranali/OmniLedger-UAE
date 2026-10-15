// OmniInvoice UAE - Session Inspection Endpoint
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/server-auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(req);
    if (!session) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        userId: session.userId,
        email: session.email,
        fullName: session.fullName,
        isSuperAdmin: session.isSuperAdmin,
        tenantId: session.tenantId,
        role: session.role,
        permissions: session.permissions,
        companyIds: session.companyIds,
        mfaVerified: session.mfaVerified,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error inspecting session";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
