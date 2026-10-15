// OmniInvoice UAE - Provider Adapter Registry & Factory
// Provides strict separation between SANDBOX simulation and certified PRODUCTION gateways

import { IProviderAdapter } from "./provider-adapter.interface";
import { SandboxProviderAdapter } from "./sandbox-provider-adapter";
import { ProductionProviderAdapter } from "./production-provider-adapter";

export * from "./provider-adapter.interface";
export * from "./sandbox-provider-adapter";
export * from "./production-provider-adapter";

let sandboxInstance: SandboxProviderAdapter | null = null;
let productionInstance: ProductionProviderAdapter | null = null;

export function getProviderAdapter(envOverride?: "SANDBOX" | "PRODUCTION"): IProviderAdapter {
  const env = envOverride || (process.env.ASP_ENVIRONMENT === "PRODUCTION" ? "PRODUCTION" : "SANDBOX");

  if (env === "PRODUCTION") {
    if (!productionInstance) {
      productionInstance = new ProductionProviderAdapter();
    }
    return productionInstance;
  }

  if (!sandboxInstance) {
    sandboxInstance = new SandboxProviderAdapter(
      process.env.ASP_WEBHOOK_SECRET || "whsec_omni_test_secret_signature"
    );
  }
  return sandboxInstance;
}
