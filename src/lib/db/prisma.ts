// OmniInvoice UAE - Singleton Prisma Client Initialization
// Resilient connection management across development hot-reloads and production deployment
import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __omniPrisma: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
  });
}

export const prisma: PrismaClient =
  global.__omniPrisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.__omniPrisma = prisma;
}

/**
 * Checks the real connectivity of the PostgreSQL database using an active query.
 * Never reports CONNECTED unless the actual query executes successfully.
 */
export async function checkDatabaseConnection(): Promise<{
  connected: boolean;
  latencyMs?: number;
  error?: string;
}> {
  const start = Date.now();
  try {
    // Timeout of 2.5 seconds to prevent hanging probes
    await Promise.race([
      prisma.$queryRaw`SELECT 1`,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Database ping query timed out after 2500ms")), 2500)
      ),
    ]);
    return { connected: true, latencyMs: Date.now() - start };
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : "Database connection refused or unavailable";
    return { connected: false, error };
  }
}

export default prisma;
