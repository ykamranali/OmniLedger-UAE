"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { appConfig } from "@/lib/config/app-config";
import {
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  Building,
  Lock,
  ArrowRight,
  Receipt,
  FileCheck2,
  Building2,
  Check,
} from "lucide-react";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPlanId = searchParams.get("plan") || "BUSINESS";

  const [selectedPlanId, setSelectedPlanId] = useState(initialPlanId);
  const [billingCycle, setBillingCycle] = useState<"MONTHLY" | "ANNUAL">("MONTHLY");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Billing form state
  const [companyName, setCompanyName] = useState("Al-Khaleej Commercial Services LLC");
  const [contactName, setContactName] = useState("Saeed Al-Maktoum");
  const [email, setEmail] = useState("saeed@alkhaleej-services.ae");
  const [trn, setTrn] = useState("100456789012003");
  const [emirate, setEmirate] = useState("Dubai");

  // Payment form state
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8912");
  const [cardExpiry, setCardExpiry] = useState("11/28");
  const [cardCvv, setCardCvv] = useState("421");
  const [cardHolder, setCardHolder] = useState("Saeed Al-Maktoum");

  const plan =
    appConfig.subscriptionPlans.find((p) => p.id === selectedPlanId) ||
    appConfig.subscriptionPlans[1];

  const netPrice =
    billingCycle === "ANNUAL" ? plan.annualPriceAed : plan.monthlyPriceAed;
  const vatAmount = Math.round(netPrice * 0.05 * 100) / 100;
  const grandTotal = Math.round((netPrice + vatAmount) * 100) / 100;

  const handlePayAndSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        {isSuccess ? (
          /* SUCCESSFUL PAYMENT & TAX INVOICE RECEIPT SCREEN */
          <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 p-8 shadow-xl text-center space-y-6">
            <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Payment Authorized &amp; Subscription Active
              </span>
              <h1 className="text-2xl font-black text-slate-950 mt-3">
                Welcome to OmniLedger UAE!
              </h1>
              <p className="text-xs text-slate-600 mt-1">
                Your tenant has been provisioned and your sequential numbering series is ready for e-invoicing.
              </p>
            </div>

            {/* Official Tax Invoice Receipt Box */}
            <div className="text-left bg-slate-50 rounded-xl p-5 border border-slate-200 text-xs space-y-3 font-mono">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="font-sans font-bold text-slate-700">Receipt Ref:</span>
                <span className="font-bold text-slate-900">RCP-2026-90412</span>
              </div>
              <div className="flex justify-between">
                <span className="font-sans text-slate-500">Plan Subscribed:</span>
                <span className="font-sans font-bold text-slate-900">{plan.name} ({billingCycle})</span>
              </div>
              <div className="flex justify-between">
                <span className="font-sans text-slate-500">Billed Company:</span>
                <span className="font-sans font-bold text-slate-900">{companyName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-sans text-slate-500">Customer TRN:</span>
                <span className="font-bold text-emerald-800">{trn}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2">
                <span className="font-sans text-slate-500">Subtotal Net:</span>
                <span>AED {netPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-sans text-slate-500">UAE VAT (5%):</span>
                <span className="text-emerald-700 font-bold">AED {vatAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-300 pt-2 text-sm font-black font-sans text-slate-950">
                <span>Total Paid (AED):</span>
                <span className="font-mono text-[#0F2B5C]">AED {grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/app/dashboard"
                className="flex-1 py-3 px-4 rounded-xl bg-[#0F2B5C] text-white font-bold text-xs shadow-md hover:bg-[#1E40AF] transition-colors flex items-center justify-center gap-2"
              >
                <span>Open General Ledger &amp; Invoices Workbench</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/app/invoices?new=true"
                className="py-3 px-4 rounded-xl border border-slate-300 bg-white text-slate-800 font-bold text-xs hover:bg-slate-50"
              >
                Issue First E-Invoice
              </Link>
            </div>
          </div>
        ) : (
          /* CHECKOUT INTERACTION SCREEN */
          <div className="space-y-8">
            <div className="max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-800">
                Secure UAE SaaS Subscription Checkout
              </span>
              <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight mt-1">
                Activate Your OmniLedger Subscription
              </h1>
              <p className="text-xs text-slate-600 font-medium mt-1">
                Instant provisioning. Fully compliant with UAE Ministry of Finance DCTCE standards and Federal Decree-Law No. 8 of 2017.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Plan & Company & Payment Form (8 cols) */}
              <div className="lg:col-span-7 space-y-6">
                {/* 1. Plan Selector Bar */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xs font-black uppercase tracking-wider text-slate-800">
                      1. Select Your Subscription Plan
                    </h2>
                    <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-[11px] font-bold">
                      <button
                        type="button"
                        onClick={() => setBillingCycle("MONTHLY")}
                        className={`px-3 py-1 rounded-md transition-colors ${
                          billingCycle === "MONTHLY" ? "bg-white text-slate-950 shadow-xs" : "text-slate-500"
                        }`}
                      >
                        Monthly
                      </button>
                      <button
                        type="button"
                        onClick={() => setBillingCycle("ANNUAL")}
                        className={`px-3 py-1 rounded-md transition-colors ${
                          billingCycle === "ANNUAL" ? "bg-white text-slate-950 shadow-xs" : "text-slate-500"
                        }`}
                      >
                        Annual (Save 20%)
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {appConfig.subscriptionPlans.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedPlanId(p.id)}
                        className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                          selectedPlanId === p.id
                            ? "border-blue-700 bg-blue-50/70 shadow-xs"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <div>
                          <div className="font-black text-slate-900">{p.name}</div>
                          <div className="text-[10px] text-slate-500 font-medium">{p.invoiceQuotaMonthly} docs/mo</div>
                        </div>
                        <div className="font-extrabold text-[#0F2B5C] mt-2 font-mono">
                          AED {billingCycle === "ANNUAL" ? Math.round(p.annualPriceAed / 12) : p.monthlyPriceAed}/mo
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. UAE Entity & Billing Details */}
                <form id="checkout-form" onSubmit={handlePayAndSubscribe} className="space-y-6">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
                    <h2 className="text-xs font-black uppercase tracking-wider text-slate-800">
                      2. UAE Company Legal Information (For Tax Invoice)
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Company Legal Name *</label>
                        <input
                          type="text"
                          required
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">UAE TRN (15 Digits) *</label>
                        <input
                          type="text"
                          required
                          maxLength={15}
                          value={trn}
                          onChange={(e) => setTrn(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-mono font-bold text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Authorized Contact *</label>
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Corporate Email *</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Emirate *</label>
                        <select
                          value={emirate}
                          onChange={(e) => setEmirate(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-900"
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
                  </div>

                  {/* 3. Payment Method */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-blue-700" />
                        3. Secure Payment Gateway (UAE Online Authorization)
                      </h2>
                      <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        256-Bit SSL Encrypted
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block font-bold text-slate-700 mb-1">Card Number (Visa / Mastercard / AMEX)</label>
                        <input
                          type="text"
                          required
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-mono font-bold text-slate-900 tracking-wider"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Cardholder Name</label>
                        <input
                          type="text"
                          required
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-900"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Expiry</label>
                          <input
                            type="text"
                            required
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-mono font-bold text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">CVV</label>
                          <input
                            type="password"
                            maxLength={4}
                            required
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-mono font-bold text-slate-900"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* Right Column: Order Summary & VAT Schedule (5 cols) */}
              <div className="lg:col-span-5 space-y-4 sticky top-20">
                <div className="bg-white rounded-2xl border-2 border-slate-900 p-6 shadow-xl space-y-4 text-xs">
                  <div className="border-b border-slate-200 pb-3">
                    <span className="text-[10px] uppercase font-black tracking-wider text-slate-500">
                      Subscription Order Summary
                    </span>
                    <h3 className="text-xl font-black text-slate-950 mt-1">
                      {plan.name} Tier
                    </h3>
                    <p className="text-slate-600 text-[11px] font-medium mt-0.5">
                      Billed {billingCycle.toLowerCase()} in UAE Dirhams (AED)
                    </p>
                  </div>

                  {/* Plan Features Checklist */}
                  <ul className="space-y-2 text-[11px] text-slate-700">
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>{plan.companyLimit} UAE Legal Entity License</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>Up to {plan.invoiceQuotaMonthly} e-invoices / month</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>Peppol PINT AE UBL 2.1 XML Generator</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>General Ledger &amp; Double-Entry Audit Trail</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>Automatic FTA Return 201 Reports</span>
                    </li>
                  </ul>

                  {/* UAE VAT Calculation Breakdown */}
                  <div className="pt-3 border-t border-slate-200 space-y-2">
                    <div className="flex justify-between text-slate-600 font-semibold">
                      <span>Subtotal (Net Amount):</span>
                      <span className="font-mono tabular-nums text-slate-900">AED {netPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 font-semibold">
                      <span>UAE VAT (5% Standard Rate):</span>
                      <span className="font-mono tabular-nums text-emerald-700 font-bold">AED {vatAmount.toFixed(2)}</span>
                    </div>
                    <div className="border-t-2 border-slate-900 pt-3 flex justify-between items-baseline">
                      <span className="font-black text-slate-950 text-sm uppercase">Total Payable:</span>
                      <span className="font-mono font-black text-2xl text-[#0F2B5C] tabular-nums">
                        AED {grandTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    form="checkout-form"
                    disabled={isProcessing}
                    className="w-full py-3.5 rounded-xl bg-[#0F2B5C] text-white font-extrabold text-xs shadow-lg hover:bg-[#1E40AF] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Lock className="h-4 w-4" />
                    <span>
                      {isProcessing ? "Authorizing Payment..." : `Authorize & Pay AED ${grandTotal.toFixed(2)}`}
                    </span>
                  </button>

                  <div className="text-center text-[10px] text-slate-500 space-y-1 pt-1">
                    <p className="flex items-center justify-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                      Includes Official FTA Tax Invoice Receipt with QR code
                    </p>
                    <p>Cancel or upgrade subscription anytime from your tenant settings.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-500">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
