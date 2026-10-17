// OmniInvoice UAE - Modular Payment Gateway Interface
// Defines a provider-independent contract supporting PayPal now and future gateways (Stripe, Network International, etc.)

export type PaymentProviderName = "paypal" | "stripe" | "network_international" | "wio_pay";

export interface SubscriptionCheckoutInput {
  planId: string; // STARTER, BUSINESS, PROFESSIONAL, ACCOUNTANT, ENTERPRISE
  planName: string;
  billingCycle: "MONTHLY" | "ANNUAL";
  amountAed: number;
  tenantId: string;
  companyId: string;
  companyName: string;
  customerEmail: string;
  returnUrl: string;
  cancelUrl: string;
}

export interface SubscriptionCheckoutResult {
  provider: PaymentProviderName;
  checkoutUrl: string;
  approvalUrl?: string;
  providerSubscriptionId?: string;
  providerOrderId?: string;
  orderId?: string;
  status: "CREATED" | "APPROVAL_PENDING" | "ACTIVE" | "MOCK_SANDBOX";
  metadata?: Record<string, unknown>;
}

export interface WebhookVerificationInput {
  headers: Record<string, string | undefined | null>;
  rawBody: string;
}

export interface WebhookVerificationResult {
  isValid: boolean;
  eventId?: string;
  eventType?: string;
  resource?: Record<string, unknown>;
  error?: string;
}

export interface SubscriptionStatusResult {
  active: boolean;
  status: "ACTIVE" | "SUSPENDED" | "CANCELLED" | "EXPIRED" | "APPROVAL_PENDING";
  providerSubscriptionId: string;
  orderId?: string;
  planId: string;
  amountAed?: number;
  nextBillingTime?: string;
  lastPaymentTime?: string;
  details?: string;
}

export interface IPaymentGateway {
  readonly providerName: PaymentProviderName;
  readonly mode: "sandbox" | "live";

  createSubscriptionCheckout(input: SubscriptionCheckoutInput): Promise<SubscriptionCheckoutResult>;
  verifySubscription(providerSubscriptionId: string): Promise<SubscriptionStatusResult>;
  cancelSubscription(providerSubscriptionId: string, reason?: string): Promise<boolean>;
  verifyWebhookSignature(input: WebhookVerificationInput): Promise<WebhookVerificationResult>;
  handleWebhookEvent(eventPayload: Record<string, unknown>): Promise<{ handled: boolean; action: string }>;
}
