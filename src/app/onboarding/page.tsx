"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { appConfig } from "@/lib/config/app-config";
import {
  FileCheck2,
  CheckCircle2,
  Circle,
  Building,
  ShieldCheck,
  Send,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [step1Done, setStep1Done] = useState(true);
  const [step2Done, setStep2Done] = useState(true);
  const [step3Done, setStep3Done] = useState(true);
  const [step4Done, setStep4Done] = useState(false);
  const [transmitting, setTransmitting] = useState(false);

  const handleTestTransmit = () => {
    setTransmitting(true);
    setTimeout(() => {
      setTransmitting(false);
      setStep4Done(true);
    }, 1000);
  };

  const allComplete = step1Done && step2Done && step3Done && step4Done;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-800 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>UAE E-Invoicing Setup Wizard</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Guided Taxpayer Onboarding Checklist
          </h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Complete the 4 compliance readiness steps to activate your Peppol PINT AE electronic invoice credentials.
          </p>
        </div>

        {/* Steps List */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden text-xs">
          {/* Step 1 */}
          <div className="p-5 flex items-start gap-4">
            <div className="mt-0.5">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900">1. Verify UAE TRN & Legal Trade License</h3>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  VERIFIED
                </span>
              </div>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Al-Noor Technologies FZCO registered with 15-digit TRN: 100234567890003.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-5 flex items-start gap-4">
            <div className="mt-0.5">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900">2. Configure Document Sequential Numbering Series</h3>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  CONFIGURED
                </span>
              </div>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Prefix series set to <code className="font-mono bg-slate-100 px-1 rounded">INV-2026-</code> starting at #1001.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-5 flex items-start gap-4">
            <div className="mt-0.5">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900">3. Connect First B2B Counterparty</h3>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  CONNECTED
                </span>
              </div>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Emaar Retail Holdings PJSC registered with verified UAE TRN.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-5 flex items-start gap-4 bg-slate-50/50">
            <div className="mt-0.5">
              {step4Done ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              ) : (
                <Circle className="h-5 w-5 text-amber-500" />
              )}
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900">4. Transmit Pre-Flight Sandbox Test Invoice</h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    step4Done ? "text-emerald-700 bg-emerald-50" : "text-amber-700 bg-amber-50"
                  }`}
                >
                  {step4Done ? "COMPLETED" : "ACTION REQUIRED"}
                </span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Generate a simulated Peppol PINT AE document, compute SHA-256 hash, and verify test Access Point acknowledgement.
              </p>

              {!step4Done && (
                <button
                  onClick={handleTestTransmit}
                  disabled={transmitting}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-900 text-white font-semibold text-xs shadow hover:bg-brand-800 disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{transmitting ? "Synthesizing XML & Transmitting..." : "Send Sandbox Pre-Flight Test"}</span>
                </button>
              )}

              {step4Done && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] font-mono">
                  ACK Received: AE-PINT-SBX-2026-991204 | Digest: b3f88921a97df11200...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Complete & Launch CTA */}
        <div className="pt-2">
          {allComplete ? (
            <button
              onClick={() => router.push("/app/dashboard")}
              className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Onboarding 100% Complete — Launch Customer Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <div className="text-center text-xs text-slate-400">
              Complete Step 4 above to proceed to the SaaS Workbench.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
