import { NextResponse } from "next/server";
import { defaultProviderAdapter } from "@/lib/provider/sandbox-provider-adapter";
import { invoicingStore } from "@/lib/store/invoicing-store";

// POST /api/v1/webhooks/asp-callback
export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-asp-signature") || "";

    // Security Verification: In sandbox/dev mode allow test payloads; verify HMAC signature if provided
    if (signature && !defaultProviderAdapter.verifyWebhookSignature(rawBody, signature)) {
      return NextResponse.json(
        { success: false, error: "Invalid webhook cryptographic HMAC signature" },
        { status: 401 }
      );
    }

    const payload = JSON.parse(rawBody);

    // Record audit of external callback
    invoicingStore.recordAudit(
      "WEBHOOK_RECEIVED",
      "ProviderMessage",
      payload.externalReference || "UNKNOWN",
      `Received ${payload.eventType || "STATUS_UPDATE"} from ASP access point.`
    );

    return NextResponse.json({
      success: true,
      message: "Webhook processed and registered in event log",
      acknowledgedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Webhook processing failed" },
      { status: 400 }
    );
  }
}
