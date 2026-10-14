"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/app/AppShell";
import { invoicingStore, CustomerModel } from "@/lib/store/invoicing-store";
import { validateUaeTrn } from "@/lib/compliance/trn-validator";
import {
  Users2,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Building,
  Mail,
  Phone,
  X,
} from "lucide-react";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerModel[]>([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trnError, setTrnError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    legalNameEn: "",
    legalNameAr: "",
    customerType: "B2B" as "B2B" | "B2C" | "B2G",
    trn: "",
    email: "",
    phone: "",
    streetAddress: "",
    city: "Dubai",
    emirate: "Dubai",
    paymentTermsDays: 30,
  });

  const refreshData = () => {
    setCustomers([...invoicingStore.getCustomers()]);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleTrnBlur = () => {
    if (formData.customerType === "B2B" && formData.trn) {
      const res = validateUaeTrn(formData.trn);
      if (!res.isValid) {
        setTrnError(res.error || "Invalid UAE TRN");
      } else {
        setTrnError(null);
      }
    } else {
      setTrnError(null);
    }
  };

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.customerType === "B2B" && formData.trn) {
      const res = validateUaeTrn(formData.trn);
      if (!res.isValid) {
        setTrnError(res.error || "Invalid TRN");
        return;
      }
    }

    invoicingStore.addCustomer({
      companyId: "comp-dxb-01",
      legalNameEn: formData.legalNameEn,
      legalNameAr: formData.legalNameAr || undefined,
      customerType: formData.customerType,
      trn: formData.trn || undefined,
      email: formData.email,
      phone: formData.phone,
      streetAddress: formData.streetAddress,
      city: formData.city,
      emirate: formData.emirate,
      countryCode: "AE",
      paymentTermsDays: Number(formData.paymentTermsDays),
    });

    refreshData();
    setIsModalOpen(false);
    setFormData({
      legalNameEn: "",
      legalNameAr: "",
      customerType: "B2B",
      trn: "",
      email: "",
      phone: "",
      streetAddress: "",
      city: "Dubai",
      emirate: "Dubai",
      paymentTermsDays: 30,
    });
  };

  const filtered = customers.filter(
    (c) =>
      c.legalNameEn.toLowerCase().includes(search.toLowerCase()) ||
      (c.trn && c.trn.includes(search)) ||
      c.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Customers & Counterparties
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Maintain verified UAE TRN records, billing addresses, and credit payment terms.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand-900 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-brand-800 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Counterparty</span>
          </button>
        </div>

        {/* Search */}
        <div className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by customer name, city, or TRN..."
              value={search}
              onChange={(e) => setSearch}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <span className="text-xs text-slate-500 font-medium hidden sm:block">
            {filtered.length} Registered Counterparties
          </span>
        </div>

        {/* Table */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Legal Name</th>
                  <th className="py-3 px-4">UAE TRN Status</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Contact Info</th>
                  <th className="py-3 px-4">Payment Terms</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{c.legalNameEn}</div>
                      {c.legalNameAr && (
                        <div className="text-[11px] text-slate-500 font-arabic">{c.legalNameAr}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      {c.trn ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>{c.trn}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">Non-registered / B2C</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-[10px] text-slate-700">
                        {c.customerType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div>{c.city}, UAE</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[140px]">{c.streetAddress}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="truncate max-w-[150px]">{c.email}</div>
                      <div className="text-[10px] text-slate-400">{c.phone}</div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      Net {c.paymentTermsDays} Days
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Customer Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900">Add New UAE Counterparty</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCustomer} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Legal Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={formData.legalNameEn}
                    onChange={(e) => setFormData({ ...formData, legalNameEn: e.target.value })}
                    placeholder="e.g. Al Futtaim Trading LLC"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Customer Classification</label>
                    <select
                      value={formData.customerType}
                      onChange={(e) => setFormData({ ...formData, customerType: e.target.value as any })}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900"
                    >
                      <option value="B2B">B2B (Business)</option>
                      <option value="B2C">B2C (Consumer)</option>
                      <option value="B2G">B2G (Government)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">UAE TRN (15 Digits)</label>
                    <input
                      type="text"
                      maxLength={15}
                      value={formData.trn}
                      onBlur={handleTrnBlur}
                      onChange={(e) => setFormData({ ...formData, trn: e.target.value })}
                      placeholder="100XXXXXXXXXXXX"
                      className={`w-full rounded-xl border px-3 py-2 text-slate-900 ${
                        trnError ? "border-rose-500 bg-rose-50" : "border-slate-200"
                      }`}
                    />
                    {trnError && <span className="text-[10px] text-rose-600 mt-1 block">{trnError}</span>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Billing Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="ap@company.ae"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+971 4 000 0000"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Street Address *</label>
                  <input
                    type="text"
                    required
                    value={formData.streetAddress}
                    onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                    placeholder="Building name, street, free zone or district"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Emirate / City</label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value, emirate: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900"
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
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Payment Terms (Days)</label>
                    <input
                      type="number"
                      value={formData.paymentTermsDays}
                      onChange={(e) => setFormData({ ...formData, paymentTermsDays: parseInt(e.target.value) || 30 })}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-900"
                    />
                  </div>
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
                    Save Customer
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
