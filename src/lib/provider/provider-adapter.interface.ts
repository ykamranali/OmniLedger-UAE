// Accredited Service Provider (ASP) Adapter Interface
// Establishes a standard contract for communicating with UAE accredited e-invoicing service providers (Model A)
import { CanonicalInvoiceDocument } from "../compliance/pint-ae-generator";
import { ValidationSummary } from "../compliance/pint-ae-validator";

export interface ProviderSubmissionRequest {
  invoiceId: string;
  invoiceNumber: string;
  canonicalDoc: CanonicalInvoiceDocument;
  xmlContent: string;
  documentHash: string;
  idempotencyKey: string;
}

export interface ProviderSubmissionResponse {
  success: boolean;
  externalReference: string; // ASP-issued tracking identifier
  status: "ACCEPTED" | "QUEUED" | "REJECTED" | "UNKNOWN_TIMEOUT";
  exchangeStatus: "TRANSMITTED" | "DELIVERED_TO_BUYER" | "BUYER_REJECTED" | "QUEUED";
  taxReportingStatus: "REPORTED_CONFIRMED" | "PENDING" | "FAILED";
  responseCode: string;
  responseMessage: string;
  timestamp: string;
  errors?: string[];
}

export interface ProviderStatusCheckResponse {
  externalReference: string;
  status: "ACCEPTED" | "DELIVERED" | "REJECTED" | "PROCESSING";
  exchangeStatus: string;
  taxReportingStatus: string;
  confirmedAt?: string;
  details: string;
}

export interface IProviderAdapter {
  providerCode: string;
  providerName: string;
  environment: "SANDBOX" | "PRODUCTION";
  
  validate(doc: CanonicalInvoiceDocument): Promise<ValidationSummary>;
  submit(req: ProviderSubmissionRequest): Promise<ProviderSubmissionResponse>;
  checkStatus(externalReference: string): Promise<ProviderStatusCheckResponse>;
  verifyWebhookSignature(rawBody: string, signatureHeader: string): boolean;
  checkHealth(): Promise<{ status: "HEALTHY" | "DEGRADED" | "DOWN"; latencyMs: number }>;
}
