import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Building2,
  Users,
  Boxes,
  Cpu,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function SolutionsPage() {
  const solutions = [
    {
      icon: Building2,
      title: "UAE SMEs & Growing Businesses",
      subtitle: "Effortless compliance without enterprise complexity.",
      highlights: [
        "Create verified UAE Tax Invoices in under 60 seconds",
        "Automatic 15-digit TRN validation for counterparties",
        "Dual English & Arabic PDF generation",
        "Automatic Peppol PINT transmission to buyer endpoints",
      ],
      ctaText: "Explore SME Plan",
      href: "/pricing",
    },
    {
      icon: Users,
      title: "Accounting & Bookkeeping Firms",
      subtitle: "Multi-client portal for UAE tax practitioners.",
      highlights: [
        "Manage up to 25 client legal entities from a single dashboard",
        "Consolidated UAE VAT Return 201 quarterly reports",
        "Client permission delegation and manager sign-off workflows",
        "Bulk batch invoice submission to Accredited Service Providers",
      ],
      ctaText: "View Accountant Tier",
      href: "/pricing",
    },
    {
      icon: Boxes,
      title: "Trading & Logistics Companies",
      subtitle: "High-volume line items, customs & freight billing.",
      highlights: [
        "Complex line-item discounts and currency conversion",
        "Zero-rated export documentation & customs code classification",
        "Multi-branch and warehouse location attribution",
        "Real-time receivables ageing and payment tracking",
      ],
      ctaText: "View Solutions",
      href: "/pricing",
    },
    {
      icon: Cpu,
      title: "Enterprise ERP & Tech Partners",
      subtitle: "REST API & Webhook middleware for SAP, Oracle & Custom ERPs.",
      highlights: [
        "High-throughput REST API with idempotent submission tokens",
        "HMAC SHA-256 signed webhook callbacks for status events",
        "Pre-configured Sandbox Adapter for testing ERP integration",
        "Dedicated cloud or private self-hosted deployment options",
      ],
      ctaText: "Read Developer Docs",
      href: "/developers",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Tailored E-Invoicing Solutions by Industry
          </h1>
          <p className="text-slate-600 text-lg">
            Whether you operate a single Dubai mainland shop or manage tax compliance for 50 group entities, OmniLedger UAE scales with you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {solutions.map((sol, idx) => {
            const Icon = sol.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md transition-all"
              >
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{sol.title}</h2>
                    <p className="text-xs text-slate-500 mt-1">{sol.subtitle}</p>
                  </div>
                  <ul className="space-y-2.5 pt-2 text-xs text-slate-600">
                    {sol.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <Link
                    href={sol.href}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:text-brand-800"
                  >
                    <span>{sol.ctaText}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
