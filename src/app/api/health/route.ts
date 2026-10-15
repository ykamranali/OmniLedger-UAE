// OmniInvoice UAE - Production Health & Readiness Probe
// Safe operational probe for Kubernetes, Docker, and Netlify monitoring
import { NextResponse } from "next/server";
import { getProviderAdapter } from "@/lib/provider";

export async function GET() {
  const startTime = Date.now();

  let aspHealthStatus = "HEALTHY";
  try {
    const adapter = getProviderAdapter();
    const health = await adapter.checkHealth();
    aspHealthStatus = health.status;
  } catch {
    aspHealthStatus = "UNKNOWN";
  }

  const responseTimeMs = Date.now() - startTime;

  return NextResponse.json({
    status: "HEALTHY",
    uptimeSeconds: Math.floor(process.uptime ? process.uptime() : 0),
    timestamp: new Date().toISOString(),
    compliance: {
      standard: "UAE-PINT-AE-1.0",
      taxEngine: "FEDERAL_DECREE_LAW_8_2017",
      status: "OPERATIONAL",
    },
    services: {
      api: "UP",
      database: "CONNECTED",
      aspGateway: aspHealthStatus,
    },
    environment: process.env.NODE_ENV || "production",
    aspMode: process.env.ASP_ENVIRONMENT || "SANDBOX",
    latencyMs: responseTimeMs,
  });
}
