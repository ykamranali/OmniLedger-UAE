"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/app/AppShell";
import {
  Boxes,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Building,
  Upload,
  X,
  FileCheck2,
} from "lucide-react";

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const [formSupplier, setFormSupplier] = useState("");
  const [formTrn, setFormTrn] = useState("");
  const [formInvNum, setFormInvNum] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [formCategory, setFormCategory] = useState("IT_INFRASTRUCTURE");
  const [formNotes, setFormNotes] = useState("");

  const fetchPurchases = async () => {
    try {
      const res = await fetch("/api/v1/purchases");
      const json = await res.json();
      if (json.data) setPurchases(json.data);
    } catch {
      // fallback
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/v1/purchases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        supplierName: formSupplier,
        supplierTrn: formTrn,
        supplierInvoiceNumber: formInvNum,
        totalAmount: parseFloat(formAmount) || 0,
        category: formCategory,
        notes: formNotes,
      }),
    });
    setIsModalOpen(false);
    fetchPurchases();
  };

  const filtered = purchases.filter(
    (p) =>
      p.supplierName.toLowerCase().includes(search.toLowerCase()) ||
      p.supplierInvoiceNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Purchase Invoices & Supplier Bills
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Record supplier tax invoices, perform duplicate detection, and claim input VAT.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand-900 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-brand-800 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Record Supplier Bill</span>
          </button>
        </div>

        {/* Search */}
        <div className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by supplier or bill number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {filtered.length} Recorded Bills
          </span>
        </div>

        {/* Table */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Supplier Bill #</th>
                  <th className="py-3 px-4">Supplier & TRN</th>
                  <th className="py-3 px-4">Expense Category</th>
                  <th className="py-3 px-4 text-right">Net (AED)</th>
                  <th className="py-3 px-4 text-right">Input VAT (5%)</th>
                  <th className="py-3 px-4 text-right">Total Payable</th>
                  <th className="py-3 px-4">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-mono font-semibold text-brand-900">
                      {p.supplierInvoiceNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{p.supplierName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {p.supplierTrn ? `TRN: ${p.supplierTrn}` : "No TRN (Non-VAT)"}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[10px]">
                        {p.category.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums">
                      {p.netAmount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-emerald-600 font-semibold">
                      {p.taxAmount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-slate-900">
                      AED {p.totalAmount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      {p.duplicateRisk ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold text-[10px] border border-rose-200">
                          <AlertTriangle className="h-3 w-3" /> Potential Duplicate
                        </span>
                      ) : p.status === "APPROVED" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[10px]">
                          <CheckCircle2 className="h-3 w-3" /> Approved
                        </span>
                      ) : p.status === "PAID" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold text-[10px]">
                          Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-medium text-[10px]">
                          <Clock className="h-3 w-3" /> Pending Review
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900">Record Incoming Supplier Invoice</h2>
                <button onClick={() => setIsModalOpen(false)}>
                  <X className="h-5 w-5 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Supplier Name *</label>
                  <input
                    type="text"
                    required
                    value={formSupplier}
                    onChange={(e) => setFormSupplier(e.target.value)}
                    placeholder="e.g. Amazon Web Services MENA FZ-LLC"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Supplier Bill # *</label>
                    <input
                      type="text"
                      required
                      value={formInvNum}
                      onChange={(e) => setFormInvNum(e.target.value)}
                      placeholder="e.g. AWS-2026-9901"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Supplier UAE TRN</label>
                    <input
                      type="text"
                      maxLength={15}
                      value={formTrn}
                      onChange={(e) => setFormTrn(e.target.value)}
                      placeholder="100XXXXXXXXXXXX"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Total Amount (AED) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formAmount}
                      onChange={(e) => setFormAmount(e.target.value)}
                      placeholder="e.g. 5250.00"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Expense Category</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900"
                    >
                      <option value="IT_INFRASTRUCTURE">IT & Cloud Infrastructure</option>
                      <option value="OFFICE_EXPENSES">Office Lease & Utilities</option>
                      <option value="PROFESSIONAL_FEES">Legal & Accounting Fees</option>
                      <option value="LOGISTICS">Logistics & Freight</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Internal Notes</label>
                  <textarea
                    rows={2}
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="Cost center or project reference..."
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900"
                  ></textarea>
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-brand-900 font-semibold text-white hover:bg-brand-800"
                  >
                    Save & Match Bill
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
