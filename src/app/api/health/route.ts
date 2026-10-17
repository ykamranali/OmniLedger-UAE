// OmniInvoice UAE - Production Health & Readiness Probe
// Safe operational probe for Kubernetes, Docker, Netlify, and server health monitoring
import { NextResponse } from "next/server";
import { getProviderAdapter } from "@/lib/provider";
import { checkDatabaseConnection } from "@/lib/db/prisma";

export async function GET() {
  const startTime = Date.now();

  // 1. Genuine Database Connectivity Check
  const dbHealth = await checkDatabaseConnection();

  // 2. Genuine ASP Gateway Health Check
  let aspHealthStatus = "HEALTHY";
  try {
    const adapter = getProviderAdapter();
    const health = await adapter.checkHealth();
    aspHealthStatus = health.status;
  } catch {
    aspHealthStatus = "UNKNOWN";
  }

  const responseTimeMs = Date.now() - startTime;
  const isHealthy = dbHealth.connected && aspHealthStatus !== "DOWN";

  return NextResponse.json(
    {
      status: isHealthy ? "HEALTHY" : "DEGRADED",
      uptimeSeconds: Math.floor(process.uptime ? process.uptime() : 0),
      timestamp: new Date().toISOString(),
      compliance: {
        standard: "UAE-PINT-AE-1.0",
        taxEngine: "FEDERAL_DECREE_LAW_8_2017",
        status: "OPERATIONAL",
      },
      services: {
        api: "UP",
        database: dbHealth.connected ? "CONNECTED" : "DISCONNECTED",
        databaseLatencyMs: dbHealth.latencyMs ?? null,
        databaseError: dbHealth.error ? "Database host unreachable or credentials invalid" : null,
        aspGateway: aspHealthStatus,
      },
      environment: process.env.NODE_ENV || "production",
      aspMode: process.env.ASP_ENVIRONMENT || "SANDBOX",
      latencyMs: responseTimeMs,
    },
    { status: isHealthy ? 200 : 503 }
  );
}
