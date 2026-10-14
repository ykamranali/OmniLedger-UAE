"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/app/AppShell";
import { invoicingStore, InvoiceModel } from "@/lib/store/invoicing-store";
import {
  TrendingUp,
  Receipt,
  FileCheck2,
  Clock,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Send,
  Building,
  Plus,
} from "lucide-react";

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [invoices, setInvoices] = useState<InvoiceModel[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  useEffect(() => {
    // Load persisted store data
    const m = invoicingStore.getDashboardMetrics();
    const invs = invoicingStore.getInvoices();
    const logs = invoicingStore.getAuditLogs();
    setMetrics(m);
    setInvoices(invs);
    setAuditLogs(logs);
  }, []);

  if (!metrics) {
    return (
      <AppShell>
        <div className="flex h-64 items-center justify-center text-xs font-semibold text-slate-500">
          Loading UAE financial metrics...
        </div>
      </AppShell>
    );
  }

  const quotaPercent = Math.min(100, Math.round((metrics.usedThisMonth / metrics.monthlyQuota) * 100));

  return (
    <AppShell>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight">
              UAE Financial Dashboard
            </h1>
            <p className="text-xs text-slate-600 font-medium mt-1">
              Real-time invoicing metrics, VAT accruals, and Peppol ASP submission logs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/app/invoices?new=true"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F2B5C] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#1E40AF] transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Create New Invoice</span>
            </Link>
          </div>
        </div>

        {/* 4 Primary KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Sales */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2 finance-card">
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Total Sales Invoiced</span>
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
                <Receipt className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-950 tabular-nums">
              AED {metrics.totalSales.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-emerald-700 flex items-center gap-1 font-bold">
              <TrendingUp className="h-3 w-3" />
              <span>Includes 5% Standard VAT</span>
            </div>
          </div>

          {/* UAE VAT 5% Accrued */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2 finance-card">
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">UAE 5% VAT Accrued</span>
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-emerald-700 tabular-nums">
              AED {metrics.totalVat.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-slate-600 font-semibold">
              FTA Box 1a VAT Return Ready
            </div>
          </div>

          {/* Outstanding Receivables */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2 finance-card">
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Outstanding Receivables</span>
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-950 tabular-nums">
              AED {metrics.outstandingReceivables.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-amber-800 font-bold">
              {metrics.draftCount} Drafts awaiting approval
            </div>
          </div>

          {/* Monthly Quota Consumption */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2 finance-card">
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Monthly Document Quota</span>
              <span className="text-xs font-extrabold text-slate-900">{quotaPercent}%</span>
            </div>
            <div className="text-2xl font-extrabold text-slate-950 tabular-nums">
              {metrics.usedThisMonth} / {metrics.monthlyQuota}
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-1 overflow-hidden">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${quotaPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Middle Section: Recent Invoices & Compliance Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Invoices Table (2 Cols) */}
          <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
            <div>
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900">Recent E-Invoices</h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Live lifecycle from Draft to ASP submission</p>
                </div>
                <Link
                  href="/app/invoices"
                  className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1"
                >
                  <span>View All Invoices</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                      <th className="py-3 px-4">Invoice #</th>
                      <th className="py-3 px-4">Counterparty</th>
                      <th className="py-3 px-4">Issue Date</th>
                      <th className="py-3 px-4 text-right">Amount (AED)</th>
                      <th className="py-3 px-4">Lifecycle Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                    {invoices.slice(0, 5).map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-[#0F2B5C]">
                          <Link href={`/app/invoices?view=${inv.id}`} className="hover:underline">
                            {inv.invoiceNumber}
                          </Link>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 truncate max-w-[170px]">
                            {inv.customerName}
                          </div>
                          {inv.customerTrn && (
                            <div className="text-[10px] text-slate-500 font-mono font-semibold">
                              TRN: {inv.customerTrn}
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 tabular-nums text-slate-700">{inv.issueDate}</td>
                        <td className="py-3.5 px-4 text-right font-extrabold text-slate-950 tabular-nums">
                          {inv.totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3.5 px-4">
                          {inv.status === "SUBMITTED" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[11px]">
                              <CheckCircle2 className="h-3 w-3" /> Submitted to ASP
                            </span>
                          )}
                          {inv.status === "ISSUED" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-bold text-[11px]">
                              <Send className="h-3 w-3" /> Issued
                            </span>
                          )}
                          {inv.status === "DRAFT" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200 font-semibold text-[11px]">
                              <Clock className="h-3 w-3" /> Draft
                            </span>
                          )}
                          {inv.status === "REJECTED" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 font-bold text-[11px]">
                              <AlertTriangle className="h-3 w-3" /> Rejected
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: ASP Status & Recent Audit Trail */}
          <div className="space-y-6">
            {/* ASP Gateway Status Card */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Accredited Service Provider
                </h3>
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1.5 font-medium">
                <div className="flex justify-between">
                  <span className="text-slate-600">Adapter:</span>
                  <span className="font-bold text-slate-900">OMNI_ASP_SANDBOX</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Profile:</span>
                  <span className="font-bold text-blue-700">Peppol PINT AE 1.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Latency:</span>
                  <span className="font-mono font-bold text-emerald-700">42ms (Healthy)</span>
                </div>
              </div>
              <Link
                href="/app/compliance"
                className="block text-center text-xs font-bold text-blue-700 hover:text-blue-800 pt-1"
              >
                Inspect Compliance Gateway &rarr;
              </Link>
            </div>

            {/* Audit Log Activity */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Security & Transaction Audit
              </h3>
              <div className="space-y-3 text-xs">
                {auditLogs.slice(0, 3).map((log) => (
                  <div key={log.id} className="pb-2.5 border-b border-slate-100 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-900">[{log.action}]</span>
                      <span className="text-slate-500 font-mono">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-700 text-xs font-medium mt-0.5">{log.details}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
