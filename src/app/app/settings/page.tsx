"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { invoicingStore } from "@/lib/store/invoicing-store";
import { appConfig } from "@/lib/config/app-config";
import {
  Settings,
  Building,
  Hash,
  CreditCard,
  ShieldCheck,
  Check,
  Sparkles,
} from "lucide-react";

export default function SettingsPage() {
  const company = invoicingStore.getCompanies()[0];
  const subscription = invoicingStore.getSubscription();
  const [saved, setSaved] = useState(false);

  const [prefix, setPrefix] = useState(company.invoiceSequencePrefix);
  const [nextSeq, setNextSeq] = useState(company.currentInvoiceSequence);
  const [legalNameEn, setLegalNameEn] = useState(company.legalNameEn);
  const [legalNameAr, setLegalNameAr] = useState(company.legalNameAr || "");
  const [trn, setTrn] = useState(company.trn);
  const [address, setAddress] = useState(company.streetAddress);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    company.invoiceSequencePrefix = prefix;
    company.currentInvoiceSequence = Number(nextSeq);
    company.legalNameEn = legalNameEn;
    company.legalNameAr = legalNameAr;
    company.trn = trn;
    company.streetAddress = address;
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Company & Subscription Settings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure legal entity tax registration, document numbering series, and monthly usage quotas.
          </p>
        </div>

        {/* Subscription Quota Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-brand-900 to-navy-900 text-white p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-800 text-brand-200 text-[11px] font-semibold">
              <Sparkles className="h-3 w-3" />
              <span>Active Plan: {subscription?.planCode || "BUSINESS"}</span>
            </div>
            <h3 className="text-xl font-bold mt-1">Monthly Invoicing Quota</h3>
            <p className="text-xs text-slate-300">
              {subscription?.usedThisMonth || 18} of {subscription?.monthlyQuota || 250} documents consumed this cycle.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-300">Renews Nov 01, 2026</span>
            <button
              onClick={() => alert("Subscription tier can be upgraded or managed in billing settings.")}
              className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-semibold text-xs transition-colors"
            >
              Manage Plan
            </button>
          </div>
        </div>

        {/* Configuration Form */}
        <form onSubmit={handleSave} className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-6 text-xs">
          {saved && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold flex items-center gap-2">
              <Check className="h-4 w-4" />
              <span>Configuration successfully saved and applied to sequential generator.</span>
            </div>
          )}

          {/* Legal Entity Details */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Building className="h-4 w-4 text-brand-700" />
              <span>UAE Legal Entity Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Legal Name (English) *</label>
                <input
                  type="text"
                  required
                  value={legalNameEn}
                  onChange={(e) => setLegalNameEn(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Legal Name (Arabic)</label>
                <input
                  type="text"
                  value={legalNameAr}
                  onChange={(e) => setLegalNameAr(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 font-arabic text-right"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">UAE TRN (15 Digits) *</label>
                <input
                  type="text"
                  required
                  maxLength={15}
                  value={trn}
                  onChange={(e) => setTrn(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Registered Address *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Sequential Numbering Rules */}
          <div className="space-y-4 pt-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Hash className="h-4 w-4 text-brand-700" />
              <span>Document Sequential Numbering Engine</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Invoice Number Prefix *</label>
                <input
                  type="text"
                  required
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  placeholder="e.g. INV-2026-"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Next Sequential Integer *</label>
                <input
                  type="number"
                  required
                  value={nextSeq}
                  onChange={(e) => setNextSeq(parseInt(e.target.value) || 1)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 font-mono"
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-500">
              Next generated invoice number will be:{" "}
              <strong className="text-brand-900 font-mono">{prefix}{nextSeq}</strong>.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-brand-900 font-semibold text-white shadow hover:bg-brand-800 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
