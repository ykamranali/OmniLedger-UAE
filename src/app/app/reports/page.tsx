"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { invoicingStore } from "@/lib/store/invoicing-store";
import {
  FileBarChart,
  Download,
  Calendar,
  Building,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

export default function ReportsPage() {
  const [period, setPeriod] = useState("2026-Q3");
  const metrics = invoicingStore.getDashboardMetrics();
  const invoices = invoicingStore.getInvoices();

  // Calculate Box 1a, Zero, Exempt breakdowns
  const standardSupplies = metrics.totalSales - metrics.totalVat;
  const standardVat = metrics.totalVat;

  const handleExportCsv = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "InvoiceNumber,IssueDate,Customer,NetAED,VatAED,GrossAED,Status\n" +
      invoices
        .map(
          (i) =>
            `${i.invoiceNumber},${i.issueDate},"${i.customerName}",${i.netAmount},${i.taxAmount},${i.totalAmount},${i.status}`
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `UAE_VAT_Return_Summary_${period}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              UAE VAT Return 201 & Financial Reports
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Federal Tax Authority (FTA) formatted box aggregates, tax periods, and audit trail exports.
            </p>
          </div>

          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV Audit Summary</span>
          </button>
        </div>

        {/* Period Selector */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs">
            <span className="font-semibold text-slate-700">Tax Return Period:</span>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-900 font-medium"
            >
              <option value="2026-Q3">Quarter 3, 2026 (01 Jul 2026 - 30 Sep 2026)</option>
              <option value="2026-Q4">Quarter 4, 2026 (01 Oct 2026 - 31 Dec 2026)</option>
            </select>
          </div>
          <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Filing Status: Ready for FTA Submission
          </span>
        </div>

        {/* VAT 201 Form Grid */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              VAT On Sales and All Other Outputs (ضريبة المخرجات)
            </h2>
            <span className="text-xs font-mono text-slate-500">Form VAT 201 Box Reference</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="max-w-md">
                <span className="font-bold text-slate-900">Box 1a: Standard Rated Supplies (5%)</span>
                <p className="text-[11px] text-slate-500">
                  Standard commercial supplies made across Dubai, Abu Dhabi, and Northern Emirates.
                </p>
              </div>
              <div className="flex items-center gap-8 tabular-nums font-mono text-right">
                <div>
                  <div className="text-[10px] text-slate-400">Amount (AED)</div>
                  <div className="font-bold text-slate-900">{standardSupplies.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">VAT Amount (AED)</div>
                  <div className="font-bold text-emerald-600">{standardVat.toFixed(2)}</div>
                </div>
              </div>
            </div>

            <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="max-w-md">
                <span className="font-bold text-slate-900">Box 2: Supplies Subject to Reverse Charge</span>
                <p className="text-[11px] text-slate-500">Imported services and goods under Article 48.</p>
              </div>
              <div className="flex items-center gap-8 tabular-nums font-mono text-right">
                <div>
                  <div className="text-[10px] text-slate-400">Amount (AED)</div>
                  <div className="font-bold text-slate-900">0.00</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">VAT Amount (AED)</div>
                  <div className="font-bold text-slate-900">0.00</div>
                </div>
              </div>
            </div>

            <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="max-w-md">
                <span className="font-bold text-slate-900">Box 3: Zero-Rated Supplies</span>
                <p className="text-[11px] text-slate-500">Exports of services, international transport.</p>
              </div>
              <div className="flex items-center gap-8 tabular-nums font-mono text-right">
                <div>
                  <div className="text-[10px] text-slate-400">Amount (AED)</div>
                  <div className="font-bold text-slate-900">0.00</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">VAT Amount (AED)</div>
                  <div className="font-bold text-slate-900">0.00</div>
                </div>
              </div>
            </div>

            <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="max-w-md">
                <span className="font-bold text-slate-900">Box 4: Exempt Supplies</span>
                <p className="text-[11px] text-slate-500">Qualifying financial services & residential leases.</p>
              </div>
              <div className="flex items-center gap-8 tabular-nums font-mono text-right">
                <div>
                  <div className="text-[10px] text-slate-400">Amount (AED)</div>
                  <div className="font-bold text-slate-900">0.00</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">VAT Amount (AED)</div>
                  <div className="font-bold text-slate-900">0.00</div>
                </div>
              </div>
            </div>

            {/* Total Due VAT */}
            <div className="p-5 bg-brand-50/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="font-extrabold text-sm text-brand-900">
                  Box 8: Total Value of Due Tax for the Period
                </span>
                <p className="text-slate-600 text-xs">Total payable to the UAE Federal Tax Authority (FTA)</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-extrabold text-brand-900 font-mono tabular-nums">
                  AED {standardVat.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
