// OmniInvoice UAE - PayPal Checkout Session Creation API Route
// Initiates secure PayPal payment session for SaaS subscriptions

import { NextRequest, NextResponse } from "next/server";
import { getPaymentGateway } from "@/lib/payments";
import { appConfig } from "@/lib/config/app-config";
import { getServerSession } from "@/lib/auth/server-auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      planId,
      billingCycle = "MONTHLY",
      companyId = "comp-dxb-01",
      companyName = "Default Company",
      customerEmail = "billing@omniinvoice.ae",
    } = body;

    const plan = appConfig.subscriptionPlans.find((p) => p.id === planId) || appConfig.subscriptionPlans[1];
    const amount = billingCycle === "ANNUAL" ? plan.annualPriceAed : plan.monthlyPriceAed;
    const totalWithVat = Math.round(amount * 1.05 * 100) / 100;

    const origin = req.nextUrl.origin || "http://localhost:3000";
    const returnUrl = `${origin}/checkout?status=APPROVED&plan=${plan.id}&cycle=${billingCycle}`;
    const cancelUrl = `${origin}/checkout?status=CANCELLED&plan=${plan.id}`;

    const gateway = getPaymentGateway("paypal");
    const result = await gateway.createSubscriptionCheckout({
      planId: plan.id,
      planName: plan.name,
      billingCycle,
      amountAed: totalWithVat,
      tenantId: "tenant-omni-01",
      companyId,
      companyName,
      customerEmail,
      returnUrl,
      cancelUrl,
    });

    return NextResponse.json({
      success: true,
      provider: result.provider,
      checkoutUrl: result.checkoutUrl,
      orderId: result.providerOrderId,
      status: result.status,
      amountAed: totalWithVat,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error initiating PayPal checkout";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
