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
        ? ["query", "error", "warn"]
        : ["error"],
  });
}

export const prisma: PrismaClient =
  global.__omniPrisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.__omniPrisma = prisma;
}

export default prisma;
