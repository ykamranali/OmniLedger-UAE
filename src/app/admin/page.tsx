"use client";

import React, { useState } from "react";
import Link from "next/link";
import { appConfig } from "@/lib/config/app-config";
import { invoicingStore } from "@/lib/store/invoicing-store";
import { COMPLIANCE_REGISTER } from "@/lib/compliance/compliance-register";
import {
  ShieldCheck,
  Building,
  Users,
  Activity,
  FileCheck2,
  Cpu,
  Layers,
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Server,
  Zap,
} from "lucide-react";

export default function AdminConsolePage() {
  const companies = invoicingStore.getCompanies();
  const invoices = invoicingStore.getInvoices();
  const auditLogs = invoicingStore.getAuditLogs();
  const subscription = invoicingStore.getSubscription();

  const [activeTab, setActiveTab] = useState<"TENANTS" | "PROVIDERS" | "QUEUES" | "LOGS">("TENANTS");

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col">
      {/* Top Admin Header */}
      <header className="h-16 border-b border-slate-200 bg-slate-900 text-white px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-tight text-white">
              {appConfig.shortName} Platform Administration
            </span>
            <span className="ml-2 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-brand-800 text-brand-200">
              Super Admin Console
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="text-slate-400">Environment: <strong className="text-emerald-400">Production / Sandbox Dual</strong></span>
          <Link
            href="/app/dashboard"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to SaaS App</span>
          </Link>
        </div>
      </header>

      {/* Admin Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("TENANTS")}
            className={`pb-3 transition-colors ${
              activeTab === "TENANTS"
                ? "border-b-2 border-brand-900 text-brand-900"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Tenants & Registered Companies ({companies.length})
          </button>
          <button
            onClick={() => setActiveTab("PROVIDERS")}
            className={`pb-3 transition-colors ${
              activeTab === "PROVIDERS"
                ? "border-b-2 border-brand-900 text-brand-900"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Accredited Service Providers (ASP Gateway)
          </button>
          <button
            onClick={() => setActiveTab("QUEUES")}
            className={`pb-3 transition-colors ${
              activeTab === "QUEUES"
                ? "border-b-2 border-brand-900 text-brand-900"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Async Job Queues & Submissions ({invoices.length})
          </button>
          <button
            onClick={() => setActiveTab("LOGS")}
            className={`pb-3 transition-colors ${
              activeTab === "LOGS"
                ? "border-b-2 border-brand-900 text-brand-900"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Platform Audit Trail
          </button>
        </div>

        {/* Tab 1: Tenants */}
        {activeTab === "TENANTS" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="text-xs text-slate-500">Active Customer Tenants</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">1 Primary Tenant</div>
                <div className="text-[11px] text-emerald-600 font-medium">Isolation Status: Strictly Enforced</div>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="text-xs text-slate-500">Total Legal Entities</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">{companies.length} Companies</div>
                <div className="text-[11px] text-slate-500">Dubai & Abu Dhabi Mainland / Freezone</div>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="text-xs text-slate-500">Active Subscription Plan</div>
                <div className="text-2xl font-bold text-brand-900 mt-1">{subscription?.planCode || "BUSINESS"}</div>
                <div className="text-[11px] text-slate-500">Quota: {subscription?.monthlyQuota} docs/month</div>
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50 font-bold text-xs text-slate-900">
                Registered Legal Entities & Trade Licenses
              </div>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                    <th className="py-2.5 px-4">Company Name</th>
                    <th className="py-2.5 px-4">UAE TRN</th>
                    <th className="py-2.5 px-4">Trade License / CRN</th>
                    <th className="py-2.5 px-4">Emirate</th>
                    <th className="py-2.5 px-4">Sequence Prefix</th>
                    <th className="py-2.5 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {companies.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-semibold text-slate-900">{c.legalNameEn}</td>
                      <td className="py-3 px-4 font-mono text-brand-900">{c.trn}</td>
                      <td className="py-3 px-4 font-mono text-slate-500">{c.crn}</td>
                      <td className="py-3 px-4">{c.city}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{c.invoiceSequencePrefix}</td>
                      <td className="py-3 px-4 text-right">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                          ACTIVE
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Providers */}
        {activeTab === "PROVIDERS" && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">UAE MoF Accredited Service Provider Adapters</h3>
                  <p className="text-xs text-slate-500">Configured Peppol Access Point connections</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                  Sandbox Active
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-900">OMNI_ASP_SANDBOX (Active)</span>
                  <p className="text-slate-600 text-[11px]">
                    Internal test adapter generating valid UBL 2.1 XML and simulated access point transmission references.
                  </p>
                  <div className="pt-2 text-[11px] font-mono text-slate-500">
                    Endpoint: https://sandbox.asp.omni-einvoice.ae/v1
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 opacity-60">
                  <span className="font-bold text-slate-900">UAE Production ASP Connector (Model A)</span>
                  <p className="text-slate-600 text-[11px]">
                    Commercial integration to verified accredited partner. Requires commercial API keys and client certificates.
                  </p>
                  <div className="pt-2 text-[11px] font-mono text-amber-700 font-bold">
                    Status: Configurable upon partner contract execution
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Queues */}
        {activeTab === "QUEUES" && (
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden text-xs">
            <div className="p-4 border-b border-slate-100 bg-slate-50 font-bold text-slate-900">
              Live Asynchronous Transmission Queue
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                  <th className="py-2.5 px-4">Document #</th>
                  <th className="py-2.5 px-4">Target Party</th>
                  <th className="py-2.5 px-4">Transmission Ref</th>
                  <th className="py-2.5 px-4">Exchange Status</th>
                  <th className="py-2.5 px-4">Tax Repo Status</th>
                  <th className="py-2.5 px-4 text-right">Job Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{inv.invoiceNumber}</td>
                    <td className="py-3 px-4">{inv.customerName}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">
                      {inv.externalReference || "N/A (Draft)"}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">{inv.exchangeStatus}</td>
                    <td className="py-3 px-4 font-semibold text-emerald-700">{inv.taxReportingStatus}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-mono font-bold text-[10px]">
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 4: Logs */}
        {activeTab === "LOGS" && (
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm">Central Security & Financial Audit Logs</h3>
            <div className="space-y-2 font-mono">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-start justify-between">
                  <div>
                    <span className="font-bold text-brand-900">[{log.action}]</span>{" "}
                    <span className="text-slate-700">{log.details}</span>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Resource: {log.resourceType} ({log.resourceId}) | Actor: {log.performedBy}
                    </div>
                  </div>
                  <span className="text-slate-400 text-[11px] tabular-nums shrink-0">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
