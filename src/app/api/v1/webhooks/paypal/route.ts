// OmniInvoice UAE - Official PayPal Webhook Handler
// Validates cryptographic signature headers and safely handles billing events idempotently

import { NextRequest, NextResponse } from "next/server";
import { getPaymentGateway } from "@/lib/payments";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();

    const headers: Record<string, string | null> = {
      "paypal-auth-algo": req.headers.get("paypal-auth-algo"),
      "paypal-cert-url": req.headers.get("paypal-cert-url"),
      "paypal-transmission-id": req.headers.get("paypal-transmission-id"),
      "paypal-transmission-sig": req.headers.get("paypal-transmission-sig"),
      "paypal-transmission-time": req.headers.get("paypal-transmission-time"),
    };

    const gateway = getPaymentGateway("paypal");

    // 1. Verify Cryptographic Signature
    const verification = await gateway.verifyWebhookSignature({
      headers,
      rawBody,
    });

    if (!verification.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: "UNAUTHORIZED: PayPal webhook cryptographic signature verification failed.",
          details: verification.error,
        },
        { status: 401 }
      );
    }

    // 2. Parse event payload
    let parsedBody: Record<string, unknown>;
    try {
      parsedBody = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
    }

    // 3. Process Event Idempotently
    const result = await gateway.handleWebhookEvent(parsedBody);

    return NextResponse.json({
      success: true,
      message: "PayPal webhook received, cryptographically verified, and processed.",
      eventId: verification.eventId,
      eventType: verification.eventType,
      action: result.action,
      processedAt: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error processing PayPal webhook";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
