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
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200/80 bg-gradient-to-b from-white via-slate-50 to-slate-100/50">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a08_1px,transparent_1px),linear-gradient(to_bottom,#0f172a08_1px,transparent_1px)] bg-[size:32px_32px]"></div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Regulatory Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 border border-brand-200/80 px-4 py-1.5 text-xs font-semibold text-brand-800 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>UAE MoF E-Invoicing & Peppol PINT AE Standard Ready</span>
              <span className="text-brand-400">|</span>
              <span className="text-slate-600 font-normal">Effective 2026 Mandate</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              Seamless UAE E-Invoicing.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-700 via-brand-600 to-teal-600">
                Guaranteed Tax Compliance.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Built specifically for UAE businesses, accounting practices, and growing enterprises.
              Automate compliant tax invoices, validate TRNs, and connect to Accredited Service Providers.
            </p>

            {/* Call to Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/app/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-brand-900 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-950/20 hover:bg-brand-800 transition-all hover:scale-[1.02]"
              >
                <span>Open Invoicing Workbench</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/uae-einvoicing"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
              >
                <span>Explore UAE Mandate Guide</span>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> 15-Digit TRN FTA Check
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> UBL 2.1 / PINT XML Output
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> SHA-256 Tamper-Proof Hash
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Dual English & Arabic Output
              </span>
            </div>
          </div>

          {/* Interactive SaaS Workbench Preview Card */}
          <div className="mt-14 rounded-2xl border border-slate-200/90 bg-white p-3 sm:p-5 shadow-2xl shadow-slate-900/10 max-w-5xl mx-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-rose-400"></div>
                <div className="h-3 w-3 rounded-full bg-amber-400"></div>
                <div className="h-3 w-3 rounded-full bg-emerald-400"></div>
                <span className="ml-2 text-xs font-mono text-slate-400">
                  omni-invoice.ae/app/workbench
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                Peppol ASP Sandbox: Connected
              </span>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-xs text-slate-500">Monthly Invoiced Sales</div>
                <div className="text-xl font-bold text-slate-900 mt-1 tabular-nums">AED 63,525.00</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-xs text-slate-500">UAE 5% VAT Accrued</div>
                <div className="text-xl font-bold text-emerald-700 mt-1 tabular-nums">AED 3,025.00</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-xs text-slate-500">Active UAE Legal Entities</div>
                <div className="text-xl font-bold text-slate-900 mt-1">2 Companies</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-xs text-slate-500">PINT AE Validation Rate</div>
                <div className="text-xl font-bold text-brand-700 mt-1">100% Pass</div>
              </div>
            </div>

            {/* Simulated Invoice Row */}
            <div className="rounded-xl border border-slate-200 overflow-hidden text-left">
              <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 text-xs font-semibold text-slate-600 flex justify-between">
                <span>Active E-Invoice: INV-2026-1044</span>
                <span className="text-brand-700">Counterparty: Etihad Airways Engineering (TRN: 100888999111003)</span>
              </div>
              <div className="p-4 bg-white space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm gap-2">
                  <div>
                    <span className="font-semibold text-slate-900">Enterprise ERP Connector Middleware License</span>
                    <p className="text-xs text-slate-500">Category S (Standard 5% VAT) - 1 Unit @ AED 18,500.00</p>
                  </div>
                  <div className="text-right tabular-nums">
                    <div className="font-bold text-slate-900">AED 19,425.00 <span className="text-xs text-slate-500 font-normal">(Incl. VAT)</span></div>
                    <div className="text-xs text-emerald-600 font-medium">VAT (5%): AED 925.00</div>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="font-mono text-slate-500 truncate max-w-sm">
                    SHA-256 Digest: 7c12f0a881934c9902bd11ffea5590ac841920ee...
                  </div>
                  <Link
                    href="/app/invoices"
                    className="inline-flex items-center gap-1 font-semibold text-brand-700 hover:text-brand-800"
                  >
                    Manage Invoices in SaaS &rarr;
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
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-700 mb-2">
              Why OmniInvoice UAE
            </h2>
            <p className="text-3xl font-extrabold text-slate-900">
              Engineered From First Principles for UAE Federal Regulations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="p-6 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all space-y-4">
              <div className="h-12 w-12 rounded-xl bg-brand-100 text-brand-800 flex items-center justify-center">
                <Scale className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                UAE VAT & Decimal Precision
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Full support for standard-rated (5%), zero-rated (0%), exempt, and out-of-scope transactions.
                Banker&apos;s half-up rounding in fils with zero floating-point calculation errors.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all space-y-4">
              <div className="h-12 w-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                <FileCode2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Peppol PINT AE XML Engine
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Automatically generate valid UBL 2.1 structured documents adhering to UAE Ministry of Finance
                profiles. Real-time Schematron validation catches issues before transmission.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all space-y-4">
              <div className="h-12 w-12 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Accredited Provider Ready
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Pluggable provider adapter interface connects effortlessly to UAE accredited service providers
                (Model A). Includes a fully functional Sandbox Adapter for testing without external blockers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview Banner */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl font-extrabold">
            Predictable SaaS Pricing for Every UAE Business
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-base">
            From sole establishments at AED 149/mo to multi-entity accounting practices and enterprise ERP integrations.
          </p>
          <div className="pt-2">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3 font-semibold text-white shadow hover:bg-brand-400 transition-colors"
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
