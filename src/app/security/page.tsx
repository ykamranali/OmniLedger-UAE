import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  ShieldCheck,
  Lock,
  Server,
  FileKey,
  Users2,
  CheckCircle2,
  Database,
  ArrowRight,
} from "lucide-react";

export default function SecurityPage() {
  const securityPillars = [
    {
      icon: Lock,
      title: "AES-256 & TLS 1.3 Encryption",
      description: "All sensitive credentials, API keys, and counterparty records are encrypted at rest using AES-256. All communications transit through TLS 1.3.",
    },
    {
      icon: Server,
      title: "Strict Multi-Tenant Isolation",
      description: "Data access enforces database-level tenant constraints and row-level security. Cross-tenant access is strictly forbidden and tested automatically.",
    },
    {
      icon: FileKey,
      title: "Cryptographic SHA-256 Tamper Proofing",
      description: "Once an invoice is issued, its canonical UBL 2.1 XML digest is locked into an immutable hash chain, preventing retrospective alteration.",
    },
    {
      icon: Users2,
      title: "Granular RBAC & MFA Protection",
      description: "Roles: Owner, Admin, Financial Controller, Accountant, and Viewer. Privileged roles require Multi-Factor Authentication (TOTP).",
    },
    {
      icon: Database,
      title: "UAE Data Residency Compatibility",
      description: "Architecture is portable to UAE hyperscaler regions (AWS me-central-1 Dubai / Abu Dhabi) or private on-premise cloud infrastructure.",
    },
    {
      icon: ShieldCheck,
      title: "Immutable Security Audit Logs",
      description: "All critical business actions, invoice status changes, and platform support sessions are permanently logged with IP and actor details.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold">
            <Lock className="h-3.5 w-3.5 text-brand-700" />
            <span>DevSecOps & Financial Governance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Enterprise Security & UAE Compliance Standards
          </h1>
          <p className="text-slate-600 text-lg">
            OmniLedger UAE implements bank-grade security protocols to protect confidential commercial transactions and financial records.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {securityPillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3"
              >
                <div className="h-10 w-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">{p.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{p.description}</p>
              </div>
            );
          })}
        </div>

        <div className="rounded-2xl bg-slate-900 text-white p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-bold">Have Specific Security or Data Residency Inquiries?</h3>
            <p className="text-xs text-slate-400 max-w-xl">
              Our DevSecOps architects can provide SOC2 alignment documentation, penetration testing reports, and private VPC deployment blueprints.
            </p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-xs font-semibold"
          >
            Contact Security Team
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
