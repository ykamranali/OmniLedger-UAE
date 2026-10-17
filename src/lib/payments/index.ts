// OmniInvoice UAE - Payment Gateway Registry & Modular Factory
// Supports PayPal today and enables adding future payment providers seamlessly

import { IPaymentGateway, PaymentProviderName } from "./payment-gateway.interface";
import { PayPalAdapter } from "./paypal/paypal-adapter";

export * from "./payment-gateway.interface";
export * from "./paypal/paypal-adapter";

const gatewayRegistry = new Map<PaymentProviderName, IPaymentGateway>();

export function getPaymentGateway(provider?: PaymentProviderName): IPaymentGateway {
  const selectedProvider: PaymentProviderName =
    provider || (process.env.PAYMENT_PROVIDER as PaymentProviderName) || "paypal";

  if (!gatewayRegistry.has(selectedProvider)) {
    switch (selectedProvider) {
      case "paypal":
        gatewayRegistry.set("paypal", new PayPalAdapter());
        break;
      default:
        // Default to PayPal as primary provider
        gatewayRegistry.set("paypal", new PayPalAdapter());
    }
  }

  return gatewayRegistry.get(selectedProvider) || gatewayRegistry.get("paypal")!;
}
