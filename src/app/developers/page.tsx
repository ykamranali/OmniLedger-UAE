import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Code2,
  Terminal,
  Webhook,
  Key,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Copy,
} from "lucide-react";

export default function DevelopersPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-brand-50 text-brand-800 border border-brand-200 text-xs font-semibold">
            <Terminal className="h-3.5 w-3.5" />
            <span>OmniInvoice REST API v1 & Webhooks</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Developer Documentation & API Reference
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            Integrate your ERP, CRM, or POS system with OmniInvoice UAE. Create invoices, trigger Peppol PINT AE validation, and receive asynchronous delivery callbacks.
          </p>
        </div>

        {/* Endpoints Table */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">Core REST Endpoints</h2>
            <p className="text-xs text-slate-500 mt-1">Base URL: https://api.omni-einvoice.ae/api/v1</p>
          </div>
          <div className="divide-y divide-slate-100 text-xs font-mono">
            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/50">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">GET</span>
                <span className="text-slate-900 font-semibold">/api/v1/invoices</span>
              </div>
              <span className="text-slate-500 font-sans">List invoices with companyId and status filtering</span>
            </div>

            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/50">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">POST</span>
                <span className="text-slate-900 font-semibold">/api/v1/invoices</span>
              </div>
              <span className="text-slate-500 font-sans">Create a new invoice draft with sequential numbering</span>
            </div>

            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/50">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold">POST</span>
                <span className="text-slate-900 font-semibold">/api/v1/invoices/:id/submit</span>
              </div>
              <span className="text-slate-500 font-sans">Synthesize PINT AE XML, calculate SHA-256, and transmit to ASP</span>
            </div>

            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/50">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">POST</span>
                <span className="text-slate-900 font-semibold">/api/v1/compliance/validate</span>
              </div>
              <span className="text-slate-500 font-sans">Validate canonical document against UAE Schematron rules</span>
            </div>

            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/50">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">GET</span>
                <span className="text-slate-900 font-semibold">/api/v1/compliance/register</span>
              </div>
              <span className="text-slate-500 font-sans">Get active compliance rules and verification status</span>
            </div>
          </div>
        </div>

        {/* cURL Request Example */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Create & Submit Invoice Example</h2>
          <div className="rounded-2xl bg-slate-900 text-slate-200 p-6 font-mono text-xs overflow-x-auto border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-3 mb-4">
              <span>bash (cURL)</span>
              <span>API Version 1.0</span>
            </div>
            <pre className="text-emerald-400">
{`curl -X POST https://api.omni-einvoice.ae/api/v1/invoices \\
  -H "Authorization: Bearer omni_live_secret_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "companyId": "comp-dxb-01",
    "customerId": "cust-01",
    "invoiceType": "TAX_INVOICE",
    "issueDate": "2026-10-14",
    "dueDate": "2026-11-13",
    "rawLines": [
      {
        "description": "Enterprise Cloud Architecture Consulting",
        "quantity": 1,
        "unitPrice": 15000.00,
        "taxCategory": "S",
        "taxRatePercent": 5.0
      }
    ]
  }'`}
            </pre>
          </div>
        </div>

        {/* Webhooks Section */}
        <div id="webhooks" className="space-y-4">
          <div className="flex items-center gap-2">
            <Webhook className="h-5 w-5 text-brand-700" />
            <h2 className="text-xl font-bold text-slate-900">Webhook HMAC-SHA256 Verification</h2>
          </div>
          <p className="text-xs text-slate-600 max-w-2xl">
            When an Accredited Service Provider returns an exchange acknowledgement or buyer delivery confirmation, a webhook event is dispatched with an HMAC signature in header <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">x-asp-signature</code>.
          </p>

          <div className="rounded-2xl bg-slate-900 text-slate-200 p-6 font-mono text-xs overflow-x-auto border border-slate-800">
            <div className="text-slate-400 border-b border-slate-800 pb-3 mb-4">
              Node.js / TypeScript Webhook Verifier
            </div>
            <pre className="text-teal-400">
{`import crypto from "crypto";

export function verifyWebhook(rawPayload: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(rawPayload);
  const digest = hmac.digest("hex");
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}`}
            </pre>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
