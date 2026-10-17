"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { invoicingStore } from "@/lib/store/invoicing-store";
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { OmniLedgerLogo } from "@/components/brand/OmniLedgerLogo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("kamran.a@ramtechuae.com");
  const [password, setPassword] = useState("SuperAdmin2026!");
  const [mfaCode, setMfaCode] = useState("");
  const [showMfa, setShowMfa] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const demoAccounts = [
    {
      id: "usr-super-admin",
      name: "Kamran Ali",
      email: "kamran.a@ramtechuae.com",
      password: "SuperAdmin2026!",
      role: "Super Admin",
      scope: "All Registered Companies",
      badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
    },
    {
      id: "usr-gulf-admin",
      name: "Saeed Al-Maktoum",
      email: "saeed@gulfhorizon.ae",
      password: "ClientPass2026!",
      role: "Client Admin",
      scope: "Gulf Horizon Logistics LLC Only",
      badgeColor: "bg-blue-100 text-blue-900 border-blue-300",
    },
    {
      id: "usr-ramtech-fin",
      name: "Tariq Al-Hashimi",
      email: "tariq.controller@ramtechuae.com",
      password: "ClientPass2026!",
      role: "Financial Controller",
      scope: "Ramtech Technologies LLC Only",
      badgeColor: "bg-purple-100 text-purple-900 border-purple-300",
    },
    {
      id: "usr-gulf-billing",
      name: "Fatima Al-Zahra",
      email: "fatima.billing@gulfhorizon.ae",
      password: "ClientPass2026!",
      role: "Billing Clerk",
      scope: "Gulf Horizon Logistics LLC Only",
      badgeColor: "bg-teal-100 text-teal-900 border-teal-300",
    },
  ];

  const handleSelectDemoAccount = (acc: (typeof demoAccounts)[0]) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setShowMfa(false);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          mfaCode: showMfa ? mfaCode : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Authentication failed.");
        setLoading(false);
        return;
      }

      if (data.requiresMfa) {
        setShowMfa(true);
        if (data.devOtpHint) {
          setMfaCode(data.devOtpHint);
        }
        setLoading(false);
        return;
      }

      // Successful server authentication: session cookie is set
      invoicingStore.setCurrentUser(data.user.id);
      router.push("/app/dashboard");
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
          Sign In to Customer SaaS Portal
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Access your authorized UAE legal entities and Peppol PINT AE e-invoices.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4 space-y-5">
        {/* Quick Demo Account Selector for testing */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-blue-700" />
              <span>Select Account to Test Company Access Control:</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {demoAccounts.map((acc) => (
              <button
                key={acc.id}
                type="button"
                onClick={() => handleSelectDemoAccount(acc)}
                className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  email === acc.email
                    ? "border-[#0F2B5C] bg-blue-50/60 shadow-xs"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">{acc.name}</span>
                  <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded border ${acc.badgeColor}`}>
                    {acc.role}
                  </span>
                </div>
                <div className="text-[10px] text-slate-600 font-medium mt-1">
                  Scope: <strong className="text-slate-900">{acc.scope}</strong>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-900/5 rounded-2xl border border-slate-200 sm:px-8">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {!showMfa ? (
              <>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Corporate Email Address
                  </label>
                  <div className="relative">
                    <Mail className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#0F2B5C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#0F2B5C]"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-[11px] space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span>Two-Factor Authentication (MFA) Required</span>
                  </div>
                  <div>Enter the 6-digit verification code sent to your registered device.</div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    6-Digit Security Code
                  </label>
                  <div className="relative">
                    <KeyRound className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={mfaCode}
                      onChange={(e) => setMfaCode(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-slate-900 font-mono font-bold tracking-widest text-center text-sm focus:outline-none focus:ring-2 focus:ring-[#0F2B5C]"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#0F2B5C] hover:bg-[#1E40AF] py-3 text-white font-extrabold text-xs shadow-md shadow-blue-950/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              <span>{loading ? "Authenticating..." : showMfa ? "Verify MFA & Enter Portal" : "Sign In with Credentials"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <Link href="/register" className="hover:text-blue-700 font-bold">
              Register New Company &rarr;
            </Link>
            <Link href="/admin" className="hover:text-blue-700 font-bold text-[#0F2B5C]">
              Super Admin Console &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
