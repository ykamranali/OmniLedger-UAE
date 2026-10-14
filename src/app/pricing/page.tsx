"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { appConfig } from "@/lib/config/app-config";
import { Check, ArrowRight, HelpCircle } from "lucide-react";

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            Transparent Pricing in UAE Dirhams (AED)
          </h1>
          <p className="text-slate-700 text-base font-medium">
            No hidden gateway surcharges. Choose the tier that matches your legal entities and document volume.
          </p>

          {/* Billing Switch */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span className={`text-xs font-bold ${!annual ? "text-slate-950" : "text-slate-500"}`}>
              Monthly Billing
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#0F2B5C] transition-colors"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  annual ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className={`text-xs font-bold ${annual ? "text-slate-950" : "text-slate-500"}`}>
              Annual Billing{" "}
              <span className="text-[10px] text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full font-extrabold">
                Save 17% (2 Months Free)
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {appConfig.subscriptionPlans.map((plan) => {
            const price = annual ? Math.round(plan.annualPriceAed / 12) : plan.monthlyPriceAed;

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-6 flex flex-col justify-between transition-all ${
                  plan.isPopular
                    ? "border-2 border-blue-600 bg-white shadow-xl shadow-blue-950/10 scale-105 z-10"
                    : "border border-slate-200 bg-white shadow-sm hover:border-slate-300"
                }`}
              >
                {plan.isPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0F2B5C] text-white text-[10px] font-extrabold tracking-wide uppercase px-3 py-0.5 rounded-full shadow-sm">
                    Most Popular in UAE
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-950">{plan.name}</h3>
                    <p className="text-xs font-semibold text-slate-600 mt-1">
                      {plan.companyLimit} Legal {plan.companyLimit === 1 ? "Entity" : "Entities"} | {plan.invoiceQuotaMonthly} docs/mo
                    </p>
                  </div>

                  <div className="pt-2">
                    <span className="text-3xl font-extrabold text-slate-950 tabular-nums">AED {price}</span>
                    <span className="text-xs text-slate-600 font-bold"> / month</span>
                    {annual && (
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        Billed annually (AED {plan.annualPriceAed})
                      </p>
                    )}
                  </div>

                  <ul className="space-y-2.5 pt-4 border-t border-slate-100 text-xs text-slate-700 font-medium">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100">
                  <Link
                    href={`/app/dashboard?plan=${plan.id}`}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs text-center flex items-center justify-center gap-1.5 transition-colors ${
                      plan.isPopular
                        ? "bg-[#0F2B5C] text-white hover:bg-[#1E40AF]"
                        : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                    }`}
                  >
                    <span>Select {plan.name}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* UAE Tax Invoicing Compliance Note */}
        <div className="mt-14 rounded-2xl bg-blue-50 border border-blue-200/90 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="font-extrabold text-[#0F2B5C] text-sm flex items-center gap-2 justify-center md:justify-start">
              <HelpCircle className="h-4 w-4 text-blue-700" />
              Do I need a separate subscription for each UAE trade license?
            </h4>
            <p className="text-xs text-slate-700 font-medium max-w-2xl">
              OmniLedger UAE supports multi-entity management within single customer tenants. Starter includes 1 company; Business includes 2; Professional includes 5; and Accounting Firm plans support up to 25 distinct client entities.
            </p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 px-4 py-2 text-xs font-bold rounded-xl bg-white border border-blue-300 text-blue-900 hover:bg-blue-50"
          >
            Consult Enterprise Advisor
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
