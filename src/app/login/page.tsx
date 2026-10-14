"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { appConfig } from "@/lib/config/app-config";
import { FileCheck2, Lock, Mail, ArrowRight, ShieldCheck, KeyRound } from "lucide-react";

import { OmniLedgerLogo } from "@/components/brand/OmniLedgerLogo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("tariq.controller@alnoor-tech.ae");
  const [password, setPassword] = useState("OmniSecure2026!");
  const [mfaCode, setMfaCode] = useState("892104");
  const [showMfa, setShowMfa] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (!showMfa) {
        setShowMfa(true);
      } else {
        router.push("/app/dashboard");
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link href="/" className="inline-flex justify-center">
          <OmniLedgerLogo size="lg" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Sign In to Customer SaaS Portal
        </h1>
        <p className="text-xs text-slate-500">
          Access your UAE legal entities, PINT AE e-invoices, and tax returns.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-900/5 rounded-2xl border border-slate-200 sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            {!showMfa ? (
              <>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Corporate Email Address
                  </label>
                  <div className="relative">
                    <Mail className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-slate-900"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-brand-50 border border-brand-200 text-brand-900 text-[11px] space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span>Two-Factor Authentication (MFA) Required</span>
                  </div>
                  <div>Enter the 6-digit TOTP verification token from your authenticator app.</div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
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
                      className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-slate-900 font-mono text-center tracking-widest font-bold"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-brand-900 text-white font-semibold text-xs shadow hover:bg-brand-800 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>{loading ? "Verifying..." : showMfa ? "Verify & Enter Portal" : "Continue with MFA"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>

            <div className="text-center pt-2 border-t border-slate-100 text-slate-500">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-semibold text-brand-700 hover:text-brand-800">
                Register company
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
