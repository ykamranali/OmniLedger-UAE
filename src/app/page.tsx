import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { appConfig } from "@/lib/config/app-config";
import {
  FileCheck2,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Lock,
  Globe2,
  Database,
  Building2,
  FileCode2,
  Receipt,
  Scale,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200 bg-gradient-to-b from-white via-slate-50 to-blue-50/20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f2b5c0a_1px,transparent_1px),linear-gradient(to_bottom,#0f2b5c0a_1px,transparent_1px)] bg-[size:32px_32px]"></div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Regulatory Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200/90 px-4 py-1.5 text-xs font-bold text-blue-900 shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>UAE MoF E-Invoicing & General Ledger Infrastructure</span>
              <span className="text-blue-300">|</span>
              <span className="text-slate-600 font-semibold">2026 Mandate Ready</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 leading-[1.12]">
              The Modern General Ledger.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0F2B5C] via-[#059669] to-[#10B981]">
                Unified UAE E-Invoicing.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-700 font-medium leading-relaxed max-w-2xl mx-auto">
              Automate compliant tax invoices, real-time double-entry ledger posting, 15-digit TRN validation,
              and seamless Peppol PINT AE XML transmission for UAE businesses and accounting firms.
            </p>

            {/* Call to Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/app/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#0F2B5C] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-950/20 hover:bg-[#1E40AF] transition-all hover:scale-[1.02]"
              >
                <span>Launch OmniLedger Portal</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/uae-einvoicing"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-800 shadow-xs hover:bg-slate-50 transition-colors"
              >
                <span>Explore UAE Mandate Guide</span>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-700 font-semibold">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Double-Entry General Ledger
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> 15-Digit TRN FTA Check
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Peppol PINT AE UBL 2.1
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> SHA-256 Tamper Detection
              </span>
            </div>
          </div>

          {/* Interactive SaaS Workbench Preview Card */}
          <div className="mt-14 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-2xl shadow-slate-900/10 max-w-5xl mx-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-rose-400"></div>
                <div className="h-3 w-3 rounded-full bg-amber-400"></div>
                <div className="h-3 w-3 rounded-full bg-emerald-400"></div>
                <span className="ml-2 text-xs font-mono font-bold text-slate-500">
                  omniledger.ae/app/general-ledger
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                Peppol ASP Sandbox: Connected
              </span>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5 text-left">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="text-xs font-semibold text-slate-600">Total Ledger Receivables</div>
                <div className="text-xl font-extrabold text-slate-950 mt-1 tabular-nums">AED 63,525.00</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="text-xs font-semibold text-slate-600">UAE Output VAT 5%</div>
                <div className="text-xl font-extrabold text-emerald-700 mt-1 tabular-nums">AED 3,025.00</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="text-xs font-semibold text-slate-600">Balanced Ledger Accounts</div>
                <div className="text-xl font-extrabold text-slate-950 mt-1">100% Balanced</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="text-xs font-semibold text-slate-600">PINT AE Compliance</div>
                <div className="text-xl font-extrabold text-blue-700 mt-1">Verified Pass</div>
              </div>
            </div>

            {/* Simulated Live Ledger Transaction Log */}
            <div className="rounded-xl border border-slate-200 overflow-hidden text-left bg-slate-50/50">
              <div className="bg-[#0F2B5C] px-4 py-2.5 text-xs font-bold text-white flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                  General Ledger Entry #GL-2026-9041 (Auto-Posted from Invoice INV-2026-1044)
                </span>
                <span className="text-emerald-300 font-mono text-[11px]">Reconciled & Transmitted</span>
              </div>
              <div className="p-4 bg-white space-y-3">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                      <th className="pb-1.5">Account Code & Title</th>
                      <th className="pb-1.5">Counterparty & Reference</th>
                      <th className="pb-1.5 text-right">Debit (AED)</th>
                      <th className="pb-1.5 text-right">Credit (AED)</th>
                      <th className="pb-1.5 text-right">Balance (AED)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    <tr>
                      <td className="py-2 font-bold text-slate-900">
                        1200 - Trade Accounts Receivable
                      </td>
                      <td className="py-2 text-slate-600">Etihad Airways Engineering</td>
                      <td className="py-2 text-right font-mono font-bold text-slate-900">19,425.00</td>
                      <td className="py-2 text-right font-mono text-slate-400">-</td>
                      <td className="py-2 text-right font-mono font-bold text-slate-900">19,425.00</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-bold text-slate-900">
                        4000 - Enterprise Software Revenue
                      </td>
                      <td className="py-2 text-slate-600">Tax Category S (5%)</td>
                      <td className="py-2 text-right font-mono text-slate-400">-</td>
                      <td className="py-2 text-right font-mono font-bold text-slate-900">18,500.00</td>
                      <td className="py-2 text-right font-mono text-slate-600">18,500.00</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-bold text-slate-900">
                        2150 - UAE VAT Output Payable (5%)
                      </td>
                      <td className="py-2 text-emerald-800 font-semibold">FTA Box 1a Return 201</td>
                      <td className="py-2 text-right font-mono text-slate-400">-</td>
                      <td className="py-2 text-right font-mono font-bold text-emerald-700">925.00</td>
                      <td className="py-2 text-right font-mono font-bold text-emerald-700">925.00</td>
                    </tr>
                  </tbody>
                </table>

                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="font-mono text-slate-600 font-medium truncate max-w-sm">
                    SHA-256 Digest: 7c12f0a881934c9902bd11ffea5590ac841920ee...
                  </div>
                  <Link
                    href="/app/invoices"
                    className="inline-flex items-center gap-1 font-bold text-blue-700 hover:text-blue-800"
                  >
                    Manage Invoices & General Ledger in SaaS &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillar Highlights */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-blue-700 mb-2">
              Why OmniLedger UAE
            </h2>
            <p className="text-3xl font-extrabold text-slate-950 tracking-tight">
              Engineered From First Principles for UAE Federal Regulations & General Ledger
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:shadow-lg transition-all space-y-4">
              <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                <Scale className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                UAE VAT & Decimal Precision
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                Full support for standard-rated (5%), zero-rated (0%), exempt, and out-of-scope transactions.
                Banker&apos;s half-up rounding in fils with zero floating-point calculation errors.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:shadow-lg transition-all space-y-4">
              <div className="h-12 w-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                <FileCode2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Peppol PINT AE XML Engine
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                Automatically generate valid UBL 2.1 structured documents adhering to UAE Ministry of Finance
                profiles. Real-time Schematron validation catches issues before transmission.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:shadow-lg transition-all space-y-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Accredited Provider Ready
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                Pluggable provider adapter interface connects effortlessly to UAE accredited service providers
                (Model A). Includes a fully functional Sandbox Adapter for testing without external blockers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview Banner */}
      <section className="py-16 bg-[#0F2B5C] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Predictable SaaS Pricing for Every UAE Business
          </h2>
          <p className="text-slate-200 max-w-xl mx-auto text-sm font-medium">
            From sole establishments at AED 149/mo to multi-entity accounting practices and enterprise ERP integrations.
          </p>
          <div className="pt-2">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-7 py-3 text-sm font-bold text-white shadow-md hover:bg-blue-400 transition-colors"
            >
              <span>View Transparent Plans & Quotas</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
