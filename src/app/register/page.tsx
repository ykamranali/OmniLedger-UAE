"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { appConfig } from "@/lib/config/app-config";
import { FileCheck2, Building, Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";

import { OmniLedgerLogo } from "@/components/brand/OmniLedgerLogo";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "Kamran Mansoor",
    email: "kamran@tech-solutions.ae",
    companyName: "Tech Solutions FZCO",
    trn: "100987654321003",
    emirate: "Dubai",
    plan: "BUSINESS",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/onboarding");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link href="/" className="inline-flex justify-center">
          <OmniLedgerLogo size="lg" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Create UAE E-Invoicing Tenant
        </h1>
        <p className="text-xs text-slate-500">
          Provision your company entity, Peppol Access Point, and sequential numbering series.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-900/5 rounded-2xl border border-slate-200 sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Your Full Name *</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Corporate Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">UAE Legal Company Name *</label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">UAE TRN (15 Digits)</label>
                <input
                  type="text"
                  maxLength={15}
                  value={formData.trn}
                  onChange={(e) => setFormData({ ...formData, trn: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Emirate Jurisdiction</label>
                <select
                  value={formData.emirate}
                  onChange={(e) => setFormData({ ...formData, emirate: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900"
                >
                  <option value="Dubai">Dubai</option>
                  <option value="Abu Dhabi">Abu Dhabi</option>
                  <option value="Sharjah">Sharjah</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Subscription Plan</label>
              <select
                value={formData.plan}
                onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 font-medium"
              >
                <option value="STARTER">Starter Plan (AED 149/mo - 50 Invoices)</option>
                <option value="BUSINESS">Business Plan (AED 349/mo - 250 Invoices)</option>
                <option value="PROFESSIONAL">Professional Plan (AED 799/mo - 1,000 Invoices)</option>
                <option value="ACCOUNTANT">Accounting Firm Plan (AED 1,299/mo - 25 Clients)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-brand-900 text-white font-semibold text-xs shadow hover:bg-brand-800 transition-colors flex items-center justify-center gap-1.5 pt-2"
            >
              <span>Create Tenant & Begin Onboarding</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>

            <div className="text-center pt-2 border-t border-slate-100 text-slate-500">
              Already registered?{" "}
              <Link href="/login" className="font-semibold text-brand-700 hover:text-brand-800">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
