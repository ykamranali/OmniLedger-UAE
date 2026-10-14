"use client";

import React, { useState } from "react";
import Link from "next/link";
import { appConfig } from "@/lib/config/app-config";
import {
  FileCheck2,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Lock,
  Globe2,
  Database,
  Building2,
  FileCode2,
  Receipt,
  Scale,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Check,
  Code2,
  Laptop2,
  FileSpreadsheet,
  Layers,
  HelpCircle,
  ChevronDown,
  ExternalLink,
} from "lucide-react";

export function HomeLanding() {
  const [activeTab, setActiveTab] = useState<"invoice" | "network" | "ledger" | "api">("invoice");
  const [demoAmount, setDemoAmount] = useState(25000);
  const [showXmlModal, setShowXmlModal] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const demoVat = demoAmount * 0.05;
  const demoTotal = demoAmount + demoVat;

  const faqs = [
    {
      q: "What is the UAE E-Invoicing mandate and when does it take effect?",
      a: "The UAE Ministry of Finance (MoF) and Federal Tax Authority (FTA) have mandated electronic invoicing based on the Peppol PINT AE standard and a decentralized 5-Corner continuous transaction control (CTC) model. Phase 1 begins in July 2026 for large corporate taxpayers, expanding to universal B2B and B2G adoption across all 7 Emirates through 2027.",
    },
    {
      q: "Do we have to replace our existing ERP or billing software?",
      a: "No. OmniLedger is designed specifically to connect your existing ERP (such as Microsoft Dynamics 365, SAP, Oracle NetSuite, Odoo, or Zoho) or custom billing systems via direct REST APIs, pre-built connectors, or Excel spreadsheets without disrupting your business workflows.",
    },
    {
      q: "How does OmniLedger validate UAE TRNs and 5% VAT calculations?",
      a: "OmniLedger enforces strict 15-digit UAE Tax Registration Number (TRN) structure checks, calculates 5% VAT using banker's half-up decimal rounding in fils, and performs instantaneous Schematron validation against the official Peppol PINT AE specification before cryptographic clearing.",
    },
    {
      q: "What is the UAE 5-Corner Peppol model?",
      a: "In the UAE model: Corner 1 is the Seller/ERP, Corner 2 is the Seller's Accredited Service Provider (OmniLedger), Corner 3 is the Buyer's Accredited Service Provider, Corner 4 is the Buyer's ERP, and Corner 5 is the UAE Federal Tax Authority (FTA) receiving continuous transaction reporting for tax audit integrity.",
    },
    {
      q: "Can accounting firms manage multiple UAE client companies?",
      a: "Yes. Our Accounting Firm plan enables certified tax agents and bookkeeping practices to manage up to 25 legal entities under a single unified portal with multi-client switching, bulk batch processing, and consolidated VAT 201 return exports.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFC] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Regulatory Ticker / Banner */}
      <div className="bg-[#0A192F] text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-white">UAE MoF E-Invoicing Mandate:</span>
            <span className="text-slate-300">Phase 1 July 2026 • Peppol PINT AE Standard</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span>Accredited ASP Model A Ready</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">100% In-Country UAE Data Residency</span>
            <span className="hidden md:inline">•</span>
            <Link href="/contact" className="text-emerald-400 hover:text-emerald-300 font-bold">
              Direct Advisory with Kamran Ali &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200/80 bg-radial-[at_top_center] from-blue-50/40 via-white to-slate-50">
        {/* Subtle decorative grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f2b5c08_1px,transparent_1px),linear-gradient(to_bottom,#0f2b5c08_1px,transparent_1px)] bg-[size:32px_32px]"></div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200/90 px-4 py-1.5 text-xs font-bold text-slate-900 shadow-xs hover:border-slate-300 transition-colors">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-emerald-700 font-extrabold">Accredited ASP Interoperability</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-600 font-semibold">Peppol PINT AE Standards</span>
            </div>

            {/* Main Headline (Inspired by getjam.ae simplicity and punch) */}
            <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-extrabold tracking-tight text-slate-950 leading-[1.08]">
              Connect Your ERP to the UAE E-Invoicing Network{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0F2B5C] via-[#059669] to-[#10B981]">
                Without Replacing It.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
              OmniLedger seamlessly bridges Microsoft Dynamics 365, SAP, NetSuite, Odoo, or spreadsheets to the UAE Peppol PINT AE network. Automated 5% VAT decimal rounding, 15-digit TRN validation, and cryptographic invoice clearing.
            </p>

            {/* CTA Buttons */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                href="/app/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#0F2B5C] px-8 py-4 text-sm font-extrabold text-white shadow-xl shadow-blue-950/20 hover:bg-[#1E40AF] transition-all hover:scale-[1.02]"
              >
                <span>Launch SaaS Workbench</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-7 py-4 text-sm font-bold text-slate-800 shadow-xs hover:bg-slate-50 transition-colors"
              >
                <Phone className="h-4 w-4 text-emerald-600" />
                <span>Contact Kamran Ali for Advisory</span>
              </Link>
              <Link
                href="/checkout?plan=BUSINESS"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-300 px-5 py-4 text-xs font-bold text-emerald-950 hover:bg-emerald-100 transition-colors"
              >
                <span>Instant Checkout &rarr;</span>
              </Link>
            </div>

            {/* Trust Badges Bar */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-700 font-semibold">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> UAE Ministry of Finance Mandate Ready
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> 5-Corner Peppol CTC Model
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> 15-Digit TRN FTA Check
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> 100% UAE Data Residency
              </span>
            </div>
          </div>

          {/* Interactive Live Product Showcase (The Centerpiece) */}
          <div className="mt-14 rounded-2xl border border-slate-200/90 bg-white shadow-2xl shadow-slate-900/10 max-w-5xl mx-auto overflow-hidden">
            {/* Top Showcase Toolbar */}
            <div className="bg-slate-900 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-rose-500"></div>
                  <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                  <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                </div>
                <span className="font-mono text-xs font-semibold text-slate-400 hidden sm:inline">
                  omniledger.ae/workbench/preview
                </span>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl text-xs">
                <button
                  onClick={() => setActiveTab("invoice")}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                    activeTab === "invoice" ? "bg-white text-slate-900 shadow-xs" : "text-slate-300 hover:text-white"
                  }`}
                >
                  Live UAE Invoice
                </button>
                <button
                  onClick={() => setActiveTab("network")}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                    activeTab === "network" ? "bg-white text-slate-900 shadow-xs" : "text-slate-300 hover:text-white"
                  }`}
                >
                  5-Corner Network Flow
                </button>
                <button
                  onClick={() => setActiveTab("ledger")}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                    activeTab === "ledger" ? "bg-white text-slate-900 shadow-xs" : "text-slate-300 hover:text-white"
                  }`}
                >
                  Double-Entry Ledger
                </button>
                <button
                  onClick={() => setActiveTab("api")}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                    activeTab === "api" ? "bg-white text-slate-900 shadow-xs" : "text-slate-300 hover:text-white"
                  }`}
                >
                  ERP API / Webhooks
                </button>
              </div>
            </div>

            {/* Tab 1 Content: Live UAE Invoice Workbench */}
            {activeTab === "invoice" && (
              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">
                      Standard UAE Tax Invoice • Peppol PINT AE Profile
                    </span>
                    <h3 className="text-xl font-black text-slate-900 mt-0.5">
                      INV-2026-1045 — Ramtech Technologies LLC
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Abu Baker Al Siddiq St, Al Ain - Abu Dhabi • TRN: 100234567890003
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      PINT AE 100% Valid
                    </span>
                    <Link
                      href="/app/invoices/inv-001"
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                    >
                      View Full Tax Sheet &rarr;
                    </Link>
                  </div>
                </div>

                {/* Interactive Slider Bar */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-2">
                    <span>Adjust Line Item Amount to Test Live 5% VAT Calculation:</span>
                    <span className="font-mono text-slate-950 font-black text-sm">
                      AED {demoAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="100000"
                    step="5000"
                    value={demoAmount}
                    onChange={(e) => setDemoAmount(Number(e.target.value))}
                    className="w-full accent-[#0F2B5C] cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-600 mt-1">
                    <span>AED 5,000.00 (Minimum)</span>
                    <span>AED 100,000.00 (Enterprise)</span>
                  </div>
                </div>

                {/* Financial Summary Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-slate-200 bg-white">
                    <div className="text-xs font-semibold text-slate-500">Taxable Net Amount</div>
                    <div className="text-2xl font-black text-slate-900 mt-1 font-mono">
                      AED {demoAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">Category S (Standard 5%)</div>
                  </div>
                  <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
                    <div className="text-xs font-semibold text-emerald-800">UAE Output VAT (5%)</div>
                    <div className="text-2xl font-black text-emerald-700 mt-1 font-mono">
                      AED {demoVat.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-[11px] text-emerald-600 mt-1">Reported to FTA Box 1a</div>
                  </div>
                  <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50">
                    <div className="text-xs font-semibold text-blue-900">Total Invoice Amount (Gross)</div>
                    <div className="text-2xl font-black text-[#0F2B5C] mt-1 font-mono">
                      AED {demoTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-[11px] text-blue-700 mt-1">Banker&apos;s Half-Up Precision</div>
                  </div>
                </div>

                {/* Validation and Security Strip */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 font-mono text-slate-600">
                    <Lock className="h-4 w-4 text-emerald-600" />
                    <span>SHA-256 Digest: 9e3b8a1c4f0288d... (Cryptographically chained)</span>
                  </div>
                  <button
                    onClick={() => setShowXmlModal(!showXmlModal)}
                    className="font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1"
                  >
                    <Code2 className="h-4 w-4" />
                    <span>{showXmlModal ? "Hide Peppol PINT AE XML" : "Inspect Peppol PINT AE XML"}</span>
                  </button>
                </div>

                {showXmlModal && (
                  <div className="rounded-xl bg-slate-950 p-4 font-mono text-[11px] text-emerald-400 overflow-x-auto max-h-48 border border-slate-800">
                    <pre>{`<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
         xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
         xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
  <cbc:CustomizationID>urn:peppol:pint:billing-3.0:ae-1.0</cbc:CustomizationID>
  <cbc:ProfileID>urn:peppol:bis:billing</cbc:ProfileID>
  <cbc:ID>INV-2026-1045</cbc:ID>
  <cbc:IssueDate>2026-10-14</cbc:IssueDate>
  <cbc:DocumentCurrencyCode>AED</cbc:DocumentCurrencyCode>
  <cac:AccountingSupplierParty>
    <cac:Party>
      <cac:PartyTaxScheme>
        <cbc:CompanyID>100234567890003</cbc:CompanyID>
        <cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme>
      </cac:PartyTaxScheme>
      <cac:PartyLegalEntity>
        <cbc:RegistrationName>Ramtech Technologies LLC</cbc:RegistrationName>
      </cac:PartyLegalEntity>
    </cac:Party>
  </cac:AccountingSupplierParty>
  <cac:LegalMonetaryTotal>
    <cbc:LineExtensionAmount currencyID="AED">${demoAmount.toFixed(2)}</cbc:LineExtensionAmount>
    <cbc:TaxExclusiveAmount currencyID="AED">${demoAmount.toFixed(2)}</cbc:TaxExclusiveAmount>
    <cbc:TaxInclusiveAmount currencyID="AED">${demoTotal.toFixed(2)}</cbc:TaxInclusiveAmount>
    <cbc:PayableAmount currencyID="AED">${demoTotal.toFixed(2)}</cbc:PayableAmount>
  </cac:LegalMonetaryTotal>
</Invoice>`}</pre>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2 Content: 5-Corner Peppol Network Architecture */}
            {activeTab === "network" && (
              <div className="p-6 sm:p-8 space-y-6">
                <div className="text-center max-w-xl mx-auto">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">
                    Decentralized Continuous Transaction Control (CTC)
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-1">
                    The Official UAE 5-Corner Peppol Model
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Mandated by the UAE Ministry of Finance & Federal Tax Authority for all B2B transactions.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-4">
                  {/* C1 */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-center space-y-2">
                    <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-xs mx-auto">
                      C1
                    </div>
                    <div className="font-extrabold text-xs text-slate-900">Seller ERP</div>
                    <div className="text-[11px] text-slate-500 leading-tight">
                      Dynamics 365, SAP, NetSuite, Odoo, or Excel
                    </div>
                  </div>

                  {/* C2 */}
                  <div className="p-4 rounded-xl border-2 border-emerald-500 bg-emerald-50/40 text-center space-y-2 shadow-sm">
                    <div className="h-9 w-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs mx-auto">
                      C2
                    </div>
                    <div className="font-extrabold text-xs text-emerald-950">OmniLedger (ASP)</div>
                    <div className="text-[11px] text-emerald-800 leading-tight font-medium">
                      PINT AE Validation, XML conversion & signing
                    </div>
                  </div>

                  {/* C5 (Top or Center) */}
                  <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/60 text-center space-y-2">
                    <div className="h-9 w-9 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs mx-auto">
                      C5
                    </div>
                    <div className="font-extrabold text-xs text-slate-900">UAE FTA Platform</div>
                    <div className="text-[11px] text-amber-900 leading-tight">
                      Continuous Tax Reporting & Clearance (Model A)
                    </div>
                  </div>

                  {/* C3 */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-center space-y-2">
                    <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-xs mx-auto">
                      C3
                    </div>
                    <div className="font-extrabold text-xs text-slate-900">Buyer ASP</div>
                    <div className="text-[11px] text-slate-500 leading-tight">
                      Accredited Access Point receiving Peppol packet
                    </div>
                  </div>

                  {/* C4 */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-center space-y-2">
                    <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-xs mx-auto">
                      C4
                    </div>
                    <div className="font-extrabold text-xs text-slate-900">Buyer ERP</div>
                    <div className="text-[11px] text-slate-500 leading-tight">
                      Customer AP ledger auto-posted & matched
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-100/70 border border-slate-200 text-xs text-slate-600 leading-relaxed text-center">
                  💡 <span className="font-bold text-slate-900">How it works:</span> When you issue an invoice in OmniLedger or your ERP, our engine (Corner 2) formats it into Peppol PINT AE XML, secures it with a cryptographic hash, clears it with the UAE FTA (Corner 5), and routes it over the Peppol eDelivery network to the buyer (Corner 3 & 4) in sub-seconds.
                </div>
              </div>
            )}

            {/* Tab 3 Content: Real-Time Double-Entry General Ledger */}
            {activeTab === "ledger" && (
              <div className="p-6 sm:p-8 space-y-5">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-700">
                      Real-Time General Ledger Integration
                    </span>
                    <h3 className="text-lg font-black text-slate-900">
                      Voucher #GL-2026-9041 (Auto-Posted from Invoice INV-2026-1045)
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    100% Balanced • Debits = Credits
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                        <th className="pb-2">Account Code & Title</th>
                        <th className="pb-2">Classification</th>
                        <th className="pb-2 text-right">Debit (AED)</th>
                        <th className="pb-2 text-right">Credit (AED)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                      <tr>
                        <td className="py-2.5 font-bold text-slate-950">1200 - Trade Accounts Receivable</td>
                        <td className="py-2.5 text-slate-500">Current Asset</td>
                        <td className="py-2.5 text-right font-mono font-bold text-slate-950">26,250.00</td>
                        <td className="py-2.5 text-right font-mono text-slate-400">-</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-bold text-slate-950">4000 - Enterprise Software Revenue</td>
                        <td className="py-2.5 text-slate-500">Operating Revenue</td>
                        <td className="py-2.5 text-right font-mono text-slate-400">-</td>
                        <td className="py-2.5 text-right font-mono font-bold text-slate-950">25,000.00</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-bold text-emerald-950">2150 - UAE VAT Output Payable (5%)</td>
                        <td className="py-2.5 text-emerald-700 font-bold">FTA Return 201 Box 1a</td>
                        <td className="py-2.5 text-right font-mono text-slate-400">-</td>
                        <td className="py-2.5 text-right font-mono font-bold text-emerald-700">1,250.00</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-slate-900 font-bold">
                        <td colSpan={2} className="pt-2.5 uppercase text-slate-900">Total Balanced Ledger:</td>
                        <td className="pt-2.5 text-right font-mono text-slate-950">AED 26,250.00</td>
                        <td className="pt-2.5 text-right font-mono text-slate-950">AED 26,250.00</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 4 Content: ERP API / Webhooks */}
            {activeTab === "api" && (
              <div className="p-6 sm:p-8 space-y-5">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-700">
                      Developer REST API & ERP Connectors
                    </span>
                    <h3 className="text-lg font-black text-slate-900">
                      POST /api/v1/invoices — Create & Transmit
                    </h3>
                  </div>
                  <Link
                    href="/developers"
                    className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1"
                  >
                    <span>Read API Docs</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <div className="rounded-xl bg-slate-950 p-4 font-mono text-[11px] text-slate-200 overflow-x-auto border border-slate-800">
                  <pre>{`curl -X POST https://omniledger-uae.netlify.app/api/v1/invoices \\
  -H "Authorization: Bearer omni_live_sec_9941829" \\
  -H "X-Entity-TRN: 100234567890003" \\
  -H "Content-Type: application/json" \\
  -d '{
    "customerTrn": "100456789012003",
    "invoiceType": "STANDARD",
    "currency": "AED",
    "items": [
      {
        "description": "Enterprise Cloud ERP Integration Service",
        "quantity": 1,
        "unitPrice": 25000.00,
        "taxCategory": "S",
        "taxRatePercent": 5.0
      }
    ]
  }'`}</pre>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-900 block">Sub-Second</span>
                    <span className="text-[11px] text-slate-500">API Latency</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-900 block">HMAC-SHA256</span>
                    <span className="text-[11px] text-slate-500">Webhook Signatures</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-900 block">Automatic</span>
                    <span className="text-[11px] text-slate-500">XML Generation</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-900 block">Sandbox Mode</span>
                    <span className="text-[11px] text-slate-500">Instant Test Keys</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4 Ways to Connect Section (Inspired by getjam.ae) */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">
              Zero ERP Disruption
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              Four Ways to Connect Your Business
            </h2>
            <p className="text-slate-600 text-sm font-medium">
              Choose the integration route that fits your IT landscape without replacing your accounting software.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Option 1 */}
            <div className="rounded-2xl border border-slate-200/90 bg-slate-50/50 p-6 hover:bg-white hover:shadow-lg transition-all space-y-4">
              <div className="h-12 w-12 rounded-xl bg-blue-100 text-[#0F2B5C] flex items-center justify-center font-bold">
                <Laptop2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Pre-built ERP Extensions</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Native plug-ins for Microsoft Dynamics 365, SAP S/4HANA, Oracle NetSuite, and Odoo. Keep your existing purchase and sales workflows intact.
              </p>
              <div className="pt-2 text-xs font-bold text-blue-700 flex items-center gap-1">
                <span>View ERP Connectors</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Option 2 */}
            <div className="rounded-2xl border border-slate-200/90 bg-slate-50/50 p-6 hover:bg-white hover:shadow-lg transition-all space-y-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Code2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Developer REST API</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Direct JSON endpoints, instant UBL 2.1 XML conversion, Peppol envelope packaging, and real-time HMAC-signed webhook delivery.
              </p>
              <Link href="/developers" className="pt-2 text-xs font-bold text-emerald-700 flex items-center gap-1">
                <span>API Reference & Keys</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Option 3 */}
            <div className="rounded-2xl border border-slate-200/90 bg-slate-50/50 p-6 hover:bg-white hover:shadow-lg transition-all space-y-4">
              <div className="h-12 w-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                <FileSpreadsheet className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Smart Excel Ingest</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Upload your monthly sales spreadsheets. Automated header mapping, TRN validation, and batch ASP clearance in minutes.
              </p>
              <div className="pt-2 text-xs font-bold text-teal-700 flex items-center gap-1">
                <span>Spreadsheet Upload</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Option 4 */}
            <div className="rounded-2xl border border-slate-200/90 bg-slate-50/50 p-6 hover:bg-white hover:shadow-lg transition-all space-y-4">
              <div className="h-12 w-12 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Turnkey SaaS Workbench</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Standalone cloud web application with dual English & Arabic tax invoice sheets, customer TRN directory, and general ledger posting.
              </p>
              <Link href="/app/dashboard" className="pt-2 text-xs font-bold text-indigo-700 flex items-center gap-1">
                <span>Launch Portal</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Executive Contact & Advisory Banner (Featuring Kamran Ali) */}
      <section className="py-16 bg-[#0F2B5C] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-linear-to-r from-[#0F2B5C] via-[#1E3A8A] to-[#0A192F] border border-blue-900/60 p-8 sm:p-12 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 text-xs font-bold text-emerald-300">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
                  Official UAE Advisory & Technical Consultation
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                  Speak Directly With Kamran Ali
                </h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                  Get personalized technical advice on your company&apos;s UAE E-Invoicing mandate roadmap, chart of accounts mapping, or ERP connector deployment.
                </p>

                <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="flex items-center gap-2.5 text-slate-300">
                    <MapPin className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Abu Baker Al Siddiq St, Al Ain - Abu Dhabi</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-300">
                    <Phone className="h-4 w-4 text-emerald-400 shrink-0" />
                    <a href="tel:+971564504650" className="hover:text-white font-bold">
                      +971 56 450 4650
                    </a>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-300">
                    <Mail className="h-4 w-4 text-emerald-400 shrink-0" />
                    <a href="mailto:kamran.a@ramtechuae.com" className="hover:text-white font-mono">
                      kamran.a@ramtechuae.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-3">
                <Link
                  href="/contact"
                  className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm text-center shadow-lg transition-all hover:scale-[1.02]"
                >
                  Request Technical Consultation
                </Link>
                <a
                  href="tel:+971564504650"
                  className="w-full py-3.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 text-white font-bold text-xs text-center transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="h-4 w-4 text-emerald-400" />
                  <span>Call +971 56 450 4650</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section with Instant Online Checkout */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-700">
              Transparent UAE SaaS Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              Predictable Plans for Every UAE Business
            </h2>
            <p className="text-slate-600 text-sm font-medium">
              Subscribe online in 2 minutes with automated 5% VAT calculation and instant official tax invoice receipt.
            </p>

            {/* Monthly / Annual Toggle */}
            <div className="pt-2 flex items-center justify-center gap-3">
              <span
                className={`text-xs font-bold ${
                  billingCycle === "monthly" ? "text-slate-950" : "text-slate-400"
                }`}
              >
                Monthly Billing
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")}
                className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-slate-300 transition-colors duration-200 ease-in-out focus:outline-none"
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    billingCycle === "annual" ? "translate-x-5 bg-emerald-500" : "translate-x-0"
                  }`}
                />
              </button>
              <span
                className={`text-xs font-bold flex items-center gap-1.5 ${
                  billingCycle === "annual" ? "text-slate-950" : "text-slate-400"
                }`}
              >
                Annual Billing{" "}
                <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 font-black">
                  Save 17%
                </span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {appConfig.subscriptionPlans.slice(0, 4).map((plan) => {
              const price =
                billingCycle === "annual"
                  ? Math.round(plan.annualPriceAed / 12)
                  : plan.monthlyPriceAed;

              return (
                <div
                  key={plan.id}
                  className={`rounded-2xl p-6 flex flex-col justify-between transition-all ${
                    plan.isPopular
                      ? "bg-white border-2 border-[#0F2B5C] shadow-xl relative scale-[1.02]"
                      : "bg-white border border-slate-200/90 shadow-xs hover:shadow-md"
                  }`}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0F2B5C] text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-sm">
                      Most Popular in UAE
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-black text-slate-900">{plan.name}</h3>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-3xl font-black text-slate-950 font-mono">
                        AED {price}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">/ month</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      {billingCycle === "annual"
                        ? `Billed annually (AED ${plan.annualPriceAed}) + 5% VAT`
                        : "Billed monthly + 5% VAT"}
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-100 space-y-2.5 text-xs text-slate-700">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100">
                    <Link
                      href={`/checkout?plan=${plan.id}&cycle=${billingCycle.toUpperCase()}`}
                      className={`w-full py-3 rounded-xl font-bold text-xs text-center block transition-all ${
                        plan.isPopular
                          ? "bg-[#0F2B5C] text-white hover:bg-[#1E40AF] shadow-md"
                          : "border border-slate-300 text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      Subscribe Online &rarr;
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center text-xs text-slate-500">
            Need an enterprise tier with custom ERP connectors and dedicated SLA?{" "}
            <Link href="/contact" className="font-bold text-blue-700 hover:underline">
              Contact Kamran Ali for Enterprise Pricing &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions (FAQ) */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-700">
              Clear Answers
            </span>
            <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              Everything you need to know about UAE E-Invoicing mandates and OmniLedger.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50/40 transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 hover:bg-slate-100/60 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-slate-500 shrink-0 transition-transform ${
                        isOpen ? "rotate-180 text-blue-700" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="p-5 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-white font-medium">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 bg-[#0A192F] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Comply with the UAE E-Invoicing Mandate?
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto font-medium">
            Launch our live SaaS workbench today or connect directly with Kamran Ali at Ramtech UAE in Al Ain - Abu Dhabi.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/app/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-lg transition-all"
            >
              Launch Live Portal
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-colors"
            >
              Contact Kamran Ali
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
