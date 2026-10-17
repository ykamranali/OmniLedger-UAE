// OmniInvoice UAE - PayPal Payment Verification Endpoint
import { NextRequest, NextResponse } from "next/server";
import { getPaymentGateway } from "@/lib/payments";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, subscriptionId } = body;

    const targetId = subscriptionId || orderId;
    if (!targetId) {
      return NextResponse.json({ error: "Missing orderId or subscriptionId" }, { status: 400 });
    }

    const gateway = getPaymentGateway("paypal");
    const result = await gateway.verifySubscription(targetId);

    return NextResponse.json({
      success: true,
      verified: result.active,
      status: result.status,
      planId: result.planId,
      nextBillingTime: result.nextBillingTime,
      details: result.details,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error verifying PayPal transaction";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
