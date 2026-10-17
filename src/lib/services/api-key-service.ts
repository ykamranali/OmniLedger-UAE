// OmniInvoice UAE - API Key Security & Scope Verification Service
// Stores SHA-256 hashed keys only. Plaintext secret keys are returned only upon initial generation.

import crypto from "crypto";
import { prisma } from "../db/prisma";
import { invoicingStore } from "../store/invoicing-store";

export interface GeneratedApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  plaintextKey: string; // ONLY returned once upon generation
  scopes: string[];
  createdAt: string;
}

export interface ApiKeyVerificationResult {
  valid: boolean;
  tenantId?: string;
  scopes?: string[];
  error?: string;
}

// In-memory registry fallback for non-database runtime or testing
const memoryApiKeyRegistry = new Map<
  string,
  {
    id: string;
    tenantId: string;
    keyPrefix: string;
    name: string;
    scopes: string[];
    status: "ACTIVE" | "REVOKED";
    createdAt: string;
  }
>();

export class ApiKeyService {
  /**
   * Hashes an API key using SHA-256
   */
  public static hashKey(key: string): string {
    return crypto.createHash("sha256").update(key).digest("hex");
  }

  /**
   * Generates a secure API key with live or test prefix and cryptographic randomness
   */
  public static async generateKey(
    tenantId: string,
    name: string,
    scopes: string[] = ["invoice:read", "invoice:create"],
    environment: "live" | "test" = "live"
  ): Promise<GeneratedApiKey> {
    const rawSecret = crypto.randomBytes(24).toString("hex");
    const prefix = `omni_${environment}_${rawSecret.slice(0, 6)}`;
    const plaintextKey = `${prefix}_${rawSecret.slice(6)}`;
    const keyHash = this.hashKey(plaintextKey);

    const id = `apk-${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
    const nowIso = new Date().toISOString();

    memoryApiKeyRegistry.set(keyHash, {
      id,
      tenantId,
      keyPrefix: prefix,
      name,
      scopes,
      status: "ACTIVE",
      createdAt: nowIso,
    });

    invoicingStore.recordAudit(
      "API_KEY_CREATED",
      "ApiKey",
      id,
      `Generated new API key '${name}' with prefix [${prefix}] and scopes [${scopes.join(", ")}]`
    );

    return {
      id,
      name,
      keyPrefix: prefix,
      plaintextKey,
      scopes,
      createdAt: nowIso,
    };
  }

  /**
   * Verifies an incoming API key against stored SHA-256 hashes
   */
  public static verifyKey(plaintextKey: string, requiredScope?: string): ApiKeyVerificationResult {
    if (!plaintextKey) {
      return { valid: false, error: "Missing API key" };
    }

    const keyHash = this.hashKey(plaintextKey);
    const entry = memoryApiKeyRegistry.get(keyHash);

    if (!entry) {
      return { valid: false, error: "Invalid API key" };
    }

    if (entry.status !== "ACTIVE") {
      return { valid: false, error: "API key has been revoked" };
    }

    if (requiredScope && !entry.scopes.includes(requiredScope) && !entry.scopes.includes("*")) {
      return { valid: false, error: `Forbidden: API key lacks required scope [${requiredScope}]` };
    }

    return {
      valid: true,
      tenantId: entry.tenantId,
      scopes: entry.scopes,
    };
  }

  /**
   * Revokes an existing API key
   */
  public static revokeKey(id: string): boolean {
    for (const [hash, record] of memoryApiKeyRegistry.entries()) {
      if (record.id === id) {
        record.status = "REVOKED";
        memoryApiKeyRegistry.set(hash, record);
        invoicingStore.recordAudit("API_KEY_REVOKED", "ApiKey", id, `Revoked API key '${record.name}'`);
        return true;
      }
    }
    return false;
  }
}
