import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  FileCheck2,
  Receipt,
  Scale,
  ShieldCheck,
  Hash,
  Database,
  Building,
  ArrowRight,
  FileCode2,
  Cpu,
  Clock,
  Printer,
} from "lucide-react";

export default function FeaturesPage() {
  const features = [
    {
      icon: Scale,
      title: "Decimal-Safe UAE Tax Engine",
      description: "Calculates UAE VAT at 5.00% standard, 0% zero-rated, exempt, and out-of-scope without floating point errors. Automatic banker's half-up rounding in fils.",
    },
    {
      icon: Hash,
      title: "Sequential Numbering Series",
      description: "Configure custom prefix rules (e.g. INV-2026-) with atomic sequence increments, preventing duplicates and ensuring gapless audit trails.",
    },
    {
      icon: FileCode2,
      title: "Peppol PINT AE XML Synthesis",
      description: "Instant translation of internal canonical invoice models into official UBL 2.1 PINT AE XML with Schematron validation before dispatch.",
    },
    {
      icon: ShieldCheck,
      title: "SHA-256 Cryptographic Hash Chaining",
      description: "Every issued document generates a cryptographic SHA-256 digest linked to the preceding invoice hash, ensuring tamper-evident chronological integrity.",
    },
    {
      icon: Printer,
      title: "Dual English & Arabic PDF Generation",
      description: "Generate compliant tax invoice documents featuring legal company registration details, VAT itemization, and FTA-compliant QR codes.",
    },
    {
      icon: Cpu,
      title: "Accredited ASP Sandbox & Live Adapters",
      description: "Plug-and-play adapter layer allowing seamless switching between Peppol sandbox environments and commercial access-point providers.",
    },
    {
      icon: Building,
      title: "Multi-Tenant & Multi-Branch Hierarchy",
      description: "Manage multiple UAE trade licenses, free zone entities, and geographical branches within a single tenant workspace with role-based access.",
    },
    {
      icon: Clock,
      title: "Full Audit Trail & Event History",
      description: "Track document state transitions from Draft, Pending Approval, Issued, Queued, Submitted to ASP, Delivered, and Reported.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Engineered for High-Precision UAE Invoicing
          </h1>
          <p className="text-slate-600 text-lg">
            Every feature is designed specifically for UAE tax regulations, Peppol PINT interoperability, and daily business speed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-3"
              >
                <div className="h-10 w-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">{f.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{f.description}</p>
              </div>
            );
          })}
        </div>

        <div className="rounded-2xl bg-brand-900 text-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl font-bold">Ready to test the invoicing engine?</h2>
            <p className="text-sm text-slate-300">
              Open the interactive SaaS customer portal to create live invoices and test PINT XML validation.
            </p>
          </div>
          <Link
            href="/app/invoices"
            className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-brand-950 shadow hover:bg-slate-100 transition-colors"
          >
            <span>Launch Invoices Workbench</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
