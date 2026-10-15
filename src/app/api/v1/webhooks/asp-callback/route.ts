// OmniInvoice UAE - Production ASP Webhook Callback Handler
// Enforces HMAC-SHA256 signature verification, replay protection, duplicate suppression,
// and state transitions on target invoices.

import { NextRequest, NextResponse } from "next/server";
import { getProviderAdapter } from "@/lib/provider";
import { invoicingStore } from "@/lib/store/invoicing-store";

const processedWebhookEvents = new Set<string>();
const MAX_TIMESTAMP_DRIFT_SECONDS = 300; // 5 minutes

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-asp-signature") || request.headers.get("x-signature") || "";
    const timestampHeader = request.headers.get("x-asp-timestamp");
    const eventId = request.headers.get("x-event-id") || "";

    const adapter = getProviderAdapter();

    // 1. Mandatory Signature Verification
    if (!signature) {
      return NextResponse.json(
        { success: false, error: "UNAUTHORIZED: Missing mandatory x-asp-signature cryptographic header." },
        { status: 401 }
      );
    }

    const isValidSignature = adapter.verifyWebhookSignature(rawBody, signature);
    if (!isValidSignature) {
      return NextResponse.json(
        { success: false, error: "UNAUTHORIZED: Invalid HMAC-SHA256 signature. Webhook rejected." },
        { status: 401 }
      );
    }

    // 2. Replay Protection via Timestamp Verification
    if (timestampHeader) {
      const eventTime = parseInt(timestampHeader, 10);
      const currentTime = Math.floor(Date.now() / 1000);
      if (!isNaN(eventTime) && Math.abs(currentTime - eventTime) > MAX_TIMESTAMP_DRIFT_SECONDS) {
        return NextResponse.json(
          { success: false, error: "REPLAY_DETECTED: Webhook timestamp drifted beyond allowed 5-minute threshold." },
          { status: 400 }
        );
      }
    }

    // 3. Duplicate Event Suppression (Idempotent Delivery)
    if (eventId && processedWebhookEvents.has(eventId)) {
      return NextResponse.json({
        success: true,
        message: "Duplicate webhook event already processed. Skipped.",
        duplicate: true,
      });
    }

    let payload: Record<string, unknown>;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ success: false, error: "Invalid JSON payload structure." }, { status: 400 });
    }

    const externalRef = String(payload.externalReference || payload.transmissionId || "");
    const eventType = String(payload.eventType || "STATUS_UPDATE");
    const status = String(payload.status || "");
    const invoiceNumber = String(payload.invoiceNumber || "");

    // 4. Update Target Invoice Status
    if (invoiceNumber) {
      const invoice = invoicingStore.getInvoices().find((i) => i.invoiceNumber === invoiceNumber);
      if (invoice) {
        if (eventType === "BUYER_ACCEPTED" || status === "DELIVERED") {
          invoice.exchangeStatus = "DELIVERED_TO_BUYER";
          invoice.updatedAt = new Date().toISOString();
        } else if (eventType === "BUYER_REJECTED" || status === "REJECTED") {
          invoice.exchangeStatus = "BUYER_REJECTED";
          invoice.updatedAt = new Date().toISOString();
        } else if (eventType === "TAX_REPORTED_CONFIRMED") {
          invoice.taxReportingStatus = "REPORTED_CONFIRMED";
          invoice.updatedAt = new Date().toISOString();
        }
      }
    }

    // Mark event ID as processed
    if (eventId) {
      processedWebhookEvents.add(eventId);
    }

    // Record persistent audit log
    invoicingStore.recordAudit(
      "WEBHOOK_PROCESSED",
      "ProviderSubmission",
      externalRef || invoiceNumber || "UNKNOWN",
      `Verified webhook [${eventType}] processed for invoice ${invoiceNumber || "N/A"}. Status: ${status}`
    );

    return NextResponse.json({
      success: true,
      message: "Webhook cryptographically verified and processed successfully.",
      processedAt: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Webhook processing exception";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
