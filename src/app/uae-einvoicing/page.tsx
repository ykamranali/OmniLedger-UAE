import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { COMPLIANCE_REGISTER } from "@/lib/compliance/compliance-register";
import {
  FileCheck2,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowRight,
} from "lucide-react";

export default function UaeEInvoicingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-emerald-600"></span>
            Official Regulatory Guide
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            UAE Electronic Invoicing (E-Invoicing) System
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            The UAE Ministry of Finance (MoF) is rolling out a federal e-invoicing framework based on the Decentralized Continuous Transaction Controls (DCTCE) model utilizing Peppol International (PINT) Billing standards.
          </p>
        </div>

        {/* Regulatory Architecture Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="h-10 w-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
              <Calendar className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Phased Implementation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Rollout begins with large taxpayers and accredited service providers (ASPs) before expanding to all VAT-registered entities across the 7 Emirates.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Peppol 5-Corner DCTCE Model</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Invoices are structured in UBL 2.1 XML, cryptographically hashed, transmitted to an ASP (Access Point), delivered to the buyer, and reported to the UAE Tax Repository.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Mandatory Validation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Invoices must include valid 15-digit FTA TRNs, UN/ECE unit codes, currency ISO 4217, exact fils rounding, and a tamper-evident SHA-256 digest.
            </p>
          </div>
        </div>

        {/* Live Compliance Matrix Table */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Official OmniInvoice UAE Compliance Register
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Audited against MoF Technical Specifications & Executive Regulations
              </p>
            </div>
            <Link
              href="/app/compliance"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-brand-50 text-brand-700 hover:bg-brand-100"
            >
              <span>Test Schematron Validator</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Rule Identifier</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Source Specification</th>
                  <th className="py-3 px-4">Effective Date</th>
                  <th className="py-3 px-4">Coverage</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {COMPLIANCE_REGISTER.map((rule) => (
                  <tr key={rule.ruleIdentifier} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-mono font-semibold text-brand-900">
                      {rule.ruleIdentifier}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]">
                        {rule.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{rule.sourceDocument}</td>
                    <td className="py-3 px-4 tabular-nums">{rule.effectiveDate}</td>
                    <td className="py-3 px-4 font-bold text-emerald-600">{rule.testCoverageRate}%</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-[11px]">
                        <CheckCircle2 className="h-3 w-3" />
                        {rule.implementationStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="space-y-6 pt-4">
          <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-2">
              <h4 className="font-semibold text-slate-900 text-sm">
                Is a standard PDF invoice compliant with the UAE mandate?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                No. While human-readable PDFs remain essential for client delivery and bookkeeping, the legal standard requires structured UBL 2.1 XML exchanged between Accredited Service Providers. OmniInvoice generates both simultaneously.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-2">
              <h4 className="font-semibold text-slate-900 text-sm">
                What is the difference between Model A and Model B in OmniInvoice?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Model A connects your company to an existing Accredited Service Provider (ASP) via our modular adapter. Model B lays the architectural foundation for direct access-point operation once all regulatory accreditations are achieved.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
