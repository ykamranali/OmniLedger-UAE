"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight, ShieldCheck, AlertCircle, Building, CheckCircle2 } from "lucide-react";
import { OmniLedgerLogo } from "@/components/brand/OmniLedgerLogo";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "Kamran Mansoor",
    email: "kamran@tech-solutions.ae",
    password: "SecurePass2026!",
    companyName: "Tech Solutions FZCO",
    trn: "100987654321003",
    emirate: "Dubai",
    city: "Dubai",
    plan: "BUSINESS",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to complete tenant registration.");
        setLoading(false);
        return;
      }

      // Success: redirect to onboarding
      router.push("/onboarding");
    } catch {
      setError("Network or server connection failed. Please retry.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link href="/" className="inline-flex justify-center">
          <OmniLedgerLogo size="lg" />
        </Link>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Create UAE E-Invoicing Tenant
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Provision your legal company entity, Peppol Access Point, and sequential numbering series.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-900/5 rounded-2xl border border-slate-200 sm:px-8">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Your Full Name *</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#0F2B5C]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Corporate Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#0F2B5C]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Password *</label>
              <div className="relative">
                <Lock className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Min 8 chars, 1 uppercase, 1 number, 1 symbol"
                  className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#0F2B5C]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">UAE Legal Company Name *</label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#0F2B5C]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">UAE TRN (15 Digits) *</label>
                <input
                  type="text"
                  maxLength={15}
                  required
                  value={formData.trn}
                  onChange={(e) => setFormData({ ...formData, trn: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#0F2B5C]"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Emirate Jurisdiction</label>
                <select
                  value={formData.emirate}
                  onChange={(e) => setFormData({ ...formData, emirate: e.target.value, city: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#0F2B5C]"
                >
                  <option value="Dubai">Dubai</option>
                  <option value="Abu Dhabi">Abu Dhabi</option>
                  <option value="Sharjah">Sharjah</option>
                  <option value="Ajman">Ajman</option>
                  <option value="Ras Al Khaimah">Ras Al Khaimah</option>
                  <option value="Fujairah">Fujairah</option>
                  <option value="Umm Al Quwain">Umm Al Quwain</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Subscription Plan</label>
              <select
                value={formData.plan}
                onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#0F2B5C]"
              >
                <option value="STARTER">Starter Plan (AED 149/mo - 50 Invoices)</option>
                <option value="BUSINESS">Business Plan (AED 349/mo - 250 Invoices)</option>
                <option value="PROFESSIONAL">Professional Plan (AED 799/mo - 1,000 Invoices)</option>
                <option value="ACCOUNTANT">Accounting Firm Plan (AED 1,299/mo - 25 Clients)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#0F2B5C] hover:bg-[#1E40AF] text-white font-extrabold text-xs shadow-md shadow-blue-950/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              <span>{loading ? "Creating Account & Entity..." : "Create Tenant & Begin Onboarding"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="text-center pt-3 border-t border-slate-100 text-slate-500 font-medium">
              Already registered?{" "}
              <Link href="/login" className="font-bold text-[#0F2B5C] hover:text-blue-700">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
