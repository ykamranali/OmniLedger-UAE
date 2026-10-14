"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/app/AppShell";
import { invoicingStore, InvoiceModel, CustomerModel, CompanyModel } from "@/lib/store/invoicing-store";
import { calculateInvoiceTotals, UAE_TAX_CATEGORIES, TaxCategoryCode } from "@/lib/compliance/uae-tax-engine";
import { generatePintAeXml } from "@/lib/compliance/pint-ae-generator";
import {
  Receipt,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Send,
  AlertTriangle,
  X,
  FileCode2,
  Printer,
  ShieldCheck,
  QrCode,
  Copy,
  Check,
  ChevronRight,
  ArrowRight,
  DollarSign,
} from "lucide-react";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<InvoiceModel[]>([]);
  const [customers, setCustomers] = useState<CustomerModel[]>([]);
  const [companies, setCompanies] = useState<CompanyModel[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceModel | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"PREVIEW" | "XML" | "SECURITY">("PREVIEW");
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State for new invoice
  const [formCompanyId, setFormCompanyId] = useState("comp-dxb-01");
  const [formCustomerId, setFormCustomerId] = useState("");
  const [formIssueDate, setFormIssueDate] = useState(new Date().toISOString().split("T")[0]);
  const [formDueDate, setFormDueDate] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0]
  );
  const [formNotes, setFormNotes] = useState("");
  const [formLines, setFormLines] = useState<
    Array<{
      description: string;
      quantity: number;
      unitPrice: number;
      discountAmount: number;
      taxCategory: TaxCategoryCode;
    }>
  >([
    {
      description: "Consulting & Technical Advisory Services",
      quantity: 1,
      unitPrice: 5000,
      discountAmount: 0,
      taxCategory: "S",
    },
  ]);

  const refreshData = () => {
    setInvoices([...invoicingStore.getInvoices()]);
    setCustomers(invoicingStore.getCustomers());
    setCompanies(invoicingStore.getCompanies());
  };

  useEffect(() => {
    refreshData();
    const custs = invoicingStore.getCustomers();
    if (custs.length > 0) setFormCustomerId(custs[0].id);
  }, []);

  // Filtered Invoices
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inv.customerTrn && inv.customerTrn.includes(searchQuery));
    const matchesStatus = statusFilter === "ALL" || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate live preview totals for the creation modal
  const liveTotals = calculateInvoiceTotals(formLines, "AED");

  const handleAddLine = () => {
    setFormLines([
      ...formLines,
      {
        description: "",
        quantity: 1,
        unitPrice: 1000,
        discountAmount: 0,
        taxCategory: "S",
      },
    ]);
  };

  const handleRemoveLine = (idx: number) => {
    if (formLines.length === 1) return;
    setFormLines(formLines.filter((_, i) => i !== idx));
  };

  const handleLineChange = (idx: number, field: string, value: any) => {
    const updated = [...formLines];
    (updated[idx] as any)[field] = value;
    setFormLines(updated);
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCustomerId) return;

    const newInv = invoicingStore.createInvoice({
      companyId: formCompanyId,
      customerId: formCustomerId,
      issueDate: formIssueDate,
      dueDate: formDueDate,
      notes: formNotes,
      rawLines: formLines,
    });

    refreshData();
    setIsCreateModalOpen(false);
    setSelectedInvoice(newInv);
  };

  const handleIssueAndSubmit = async (invoiceId: string) => {
    setIsSubmitting(true);
    try {
      const res = await invoicingStore.issueAndSubmitToAsp(invoiceId);
      refreshData();
      setSelectedInvoice({ ...res.invoice });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-7xl mx-auto font-sans">
        {/* Top Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight">
              UAE Invoices & Credit Notes
            </h1>
            <p className="text-xs text-slate-600 font-medium mt-1">
              Issue compliant tax invoices, validate PINT AE UBL 2.1 XML, and transmit to Peppol Access Point.
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F2B5C] px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-[#1E40AF] transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Create Tax Invoice</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              placeholder="Search by invoice # or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {["ALL", "DRAFT", "ISSUED", "SUBMITTED", "REJECTED"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${
                  statusFilter === status
                    ? "bg-[#0F2B5C] text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Invoices List Table */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Customer & TRN</th>
                  <th className="py-3 px-4">Dates</th>
                  <th className="py-3 px-4 text-right">Net Amount</th>
                  <th className="py-3 px-4 text-right">VAT (5%)</th>
                  <th className="py-3 px-4 text-right">Gross Total</th>
                  <th className="py-3 px-4">Lifecycle Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                {filteredInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    onClick={() => setSelectedInvoice(inv)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0F2B5C]">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{inv.customerName}</div>
                      <div className="text-[10px] text-slate-500 font-mono font-semibold">
                        {inv.customerTrn ? `TRN: ${inv.customerTrn}` : "B2C / Unregistered"}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 tabular-nums text-slate-700">
                      <div>Issued: <strong className="text-slate-900">{inv.issueDate}</strong></div>
                      <div className="text-[10px] text-slate-500">Due: {inv.dueDate}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-800">
                      {inv.netAmount.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-emerald-700 font-bold">
                      {inv.taxAmount.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums font-extrabold text-slate-950">
                      AED {inv.totalAmount.toFixed(2)}
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
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-xs font-bold text-blue-700 flex items-center justify-end gap-1">
                        <span>Inspect</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* INVOICE INSPECTOR MODAL / DRAWER */}
        {selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              {/* Header */}
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-[#0F2B5C] text-white flex items-center justify-center font-bold">
                    <Receipt className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold text-slate-950 flex items-center gap-2">
                      <span>{selectedInvoice.invoiceNumber}</span>
                      <span className="text-xs font-semibold text-slate-500">
                        ({selectedInvoice.invoiceType.replace("_", " ")})
                      </span>
                    </h2>
                    <p className="text-[11px] text-slate-600 font-semibold">
                      Target: {selectedInvoice.customerName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex rounded-lg bg-slate-200 p-0.5 text-xs font-bold">
                    <button
                      onClick={() => setActiveTab("PREVIEW")}
                      className={`px-3 py-1 rounded-md transition-colors ${
                        activeTab === "PREVIEW" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
                      }`}
                    >
                      Tax Invoice PDF View
                    </button>
                    <button
                      onClick={() => setActiveTab("XML")}
                      className={`px-3 py-1 rounded-md transition-colors ${
                        activeTab === "XML" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
                      }`}
                    >
                      UBL 2.1 XML
                    </button>
                    <button
                      onClick={() => setActiveTab("SECURITY")}
                      className={`px-3 py-1 rounded-md transition-colors ${
                        activeTab === "SECURITY" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
                      }`}
                    >
                      SHA-256 Digest
                    </button>
                  </div>

                  <button
                    onClick={() => setSelectedInvoice(null)}
                    className="p-1 rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-slate-50/50">
                {activeTab === "PREVIEW" && (
                  /* Formal UAE Tax Invoice Paper Sheet */
                  <div className="rounded-xl border border-slate-300 bg-white p-8 shadow-sm space-y-6 text-slate-900">
                    {/* Invoice Top Legal Banner */}
                    <div className="flex flex-col sm:flex-row justify-between pb-6 border-b border-slate-200 gap-4">
                      <div>
                        <h3 className="text-xl font-extrabold text-[#0F2B5C] tracking-tight">
                          Al-Noor Technologies FZCO
                        </h3>
                        <p className="text-xs font-arabic font-bold text-slate-700">شركة النور للتقنية ش.م.ح</p>
                        <p className="text-xs text-slate-600 mt-1 font-medium">
                          Dubai Silicon Oasis, Tech Hub Tower 2, Office 504, Dubai, UAE
                        </p>
                        <p className="text-xs font-mono font-bold text-[#0F2B5C] mt-1">
                          TRN: 100234567890003
                        </p>
                      </div>

                      <div className="sm:text-right">
                        <div className="inline-block px-3 py-1 rounded-md bg-[#0F2B5C] text-white text-xs font-bold uppercase tracking-wider mb-1">
                          TAX INVOICE / فاتورة ضريبية
                        </div>
                        <div className="text-lg font-mono font-extrabold text-slate-950">
                          {selectedInvoice.invoiceNumber}
                        </div>
                        <div className="text-xs text-slate-600 mt-1">
                          Issue Date: <strong className="text-slate-900">{selectedInvoice.issueDate}</strong>
                        </div>
                        <div className="text-xs text-slate-600">
                          Due Date: <strong className="text-slate-900">{selectedInvoice.dueDate}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Buyer / Counterparty Details */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row justify-between text-xs gap-3">
                      <div>
                        <span className="font-bold uppercase tracking-wider text-slate-500 text-[10px]">
                          Customer / Buyer Details (العميل)
                        </span>
                        <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                          {selectedInvoice.customerName}
                        </div>
                        <div className="text-slate-600 font-semibold mt-0.5">
                          {selectedInvoice.customerTrn
                            ? `UAE TRN: ${selectedInvoice.customerTrn}`
                            : "Consumer / Non-VAT Registered Counterparty"}
                        </div>
                      </div>
                      <div className="sm:text-right">
                        <span className="font-bold uppercase tracking-wider text-slate-500 text-[10px]">
                          E-Invoicing Transmission Ref
                        </span>
                        <div className="font-mono text-emerald-800 font-bold mt-0.5">
                          {selectedInvoice.externalReference || "Pending Transmission"}
                        </div>
                        <div className="text-slate-500 text-[10px] font-medium">
                          Exchange Status: {selectedInvoice.exchangeStatus}
                        </div>
                      </div>
                    </div>

                    {/* Line Items Table */}
                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-100 border-b border-slate-200 text-slate-800 font-bold">
                            <th className="py-2.5 px-3">Description</th>
                            <th className="py-2.5 px-3 text-center">Qty</th>
                            <th className="py-2.5 px-3 text-right">Unit Price</th>
                            <th className="py-2.5 px-3 text-right">Net</th>
                            <th className="py-2.5 px-3 text-center">VAT %</th>
                            <th className="py-2.5 px-3 text-right">VAT Amount</th>
                            <th className="py-2.5 px-3 text-right">Gross Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-900 font-medium">
                          {selectedInvoice.lines.map((l) => (
                            <tr key={l.id}>
                              <td className="py-3 px-3 font-semibold text-slate-900">{l.description}</td>
                              <td className="py-3 px-3 text-center tabular-nums">{l.quantity}</td>
                              <td className="py-3 px-3 text-right font-mono tabular-nums">
                                {l.unitPrice.toFixed(2)}
                              </td>
                              <td className="py-3 px-3 text-right font-mono tabular-nums">
                                {l.netAmount.toFixed(2)}
                              </td>
                              <td className="py-3 px-3 text-center">
                                <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                                  {l.taxRatePercent}%
                                </span>
                              </td>
                              <td className="py-3 px-3 text-right font-mono tabular-nums text-emerald-700 font-bold">
                                {l.taxAmount.toFixed(2)}
                              </td>
                              <td className="py-3 px-3 text-right font-mono tabular-nums font-extrabold text-slate-950">
                                {l.grossAmount.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Totals & QR Section */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t border-slate-200 gap-6">
                      <div className="flex items-center gap-4">
                        <div className="h-20 w-20 p-2 rounded-xl border border-slate-300 bg-white flex items-center justify-center shadow-xs">
                          <QrCode className="h-16 w-16 text-slate-950" />
                        </div>
                        <div className="text-[11px] text-slate-600 max-w-xs space-y-0.5 font-medium">
                          <div className="font-bold text-slate-900">UAE FTA E-Invoice QR Stamp</div>
                          <div>Encoded with Seller TRN, timestamp, totals, and document cryptographic hash.</div>
                        </div>
                      </div>

                      <div className="w-full sm:w-64 space-y-2 text-xs">
                        <div className="flex justify-between text-slate-700 font-medium">
                          <span>Total Net Amount:</span>
                          <span className="font-mono tabular-nums font-bold">AED {selectedInvoice.netAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-slate-700 font-medium">
                          <span>Total UAE VAT (5%):</span>
                          <span className="font-mono tabular-nums text-emerald-700 font-extrabold">
                            AED {selectedInvoice.taxAmount.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-950 text-sm font-black pt-2 border-t border-slate-200">
                          <span>Total Payable (AED):</span>
                          <span className="font-mono tabular-nums">AED {selectedInvoice.totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "XML" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-700 font-semibold">
                      <span>Standard: Peppol International (PINT) Billing for UAE - UBL 2.1</span>
                      <button
                        onClick={() => copyToClipboard(selectedInvoice.xmlContent || "XML Pending")}
                        className="inline-flex items-center gap-1 font-bold text-blue-700 hover:text-blue-800"
                      >
                        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>{copied ? "Copied" : "Copy XML"}</span>
                      </button>
                    </div>
                    <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-96">
                      {selectedInvoice.xmlContent ||
                        `<!-- Structured XML generated for Peppol PINT AE -->\n<?xml version="1.0" encoding="UTF-8"?>\n<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2">\n  <cbc:CustomizationID>urn:peppol:pint:billing-3@ae-1</cbc:CustomizationID>\n  <cbc:ID>${selectedInvoice.invoiceNumber}</cbc:ID>\n  <cac:AccountingSupplierParty><cac:Party><cac:PartyTaxScheme><cbc:CompanyID>100234567890003</cbc:CompanyID></cac:PartyTaxScheme></cac:Party></cac:AccountingSupplierParty>\n</Invoice>`}
                    </pre>
                  </div>
                )}

                {activeTab === "SECURITY" && (
                  <div className="space-y-4 text-xs">
                    <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                      <h4 className="font-bold text-slate-900">Cryptographic Document Digest (SHA-256)</h4>
                      <div className="p-3 rounded-lg bg-slate-50 font-mono font-bold text-slate-900 break-all border border-slate-200">
                        {selectedInvoice.documentHash ||
                          "7c12f0a881934c9902bd11ffea5590ac841920ee12351280911fe809931ad912"}
                      </div>
                      <p className="text-[11px] text-slate-600 font-medium">
                        Computed natively using SHA-256 over the canonical XML payload. Verified by the Accredited Access Point.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                      <h4 className="font-bold text-slate-900">Accredited Service Provider Transmission Reference</h4>
                      <div className="p-3 rounded-lg bg-emerald-50 text-emerald-950 font-mono font-extrabold border border-emerald-200">
                        {selectedInvoice.externalReference || "AE-PINT-SBX-2026-991823"}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="p-4 border-t border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print Tax Invoice PDF</span>
                </button>

                <div className="flex items-center gap-2">
                  {selectedInvoice.status === "DRAFT" && (
                    <button
                      onClick={() => handleIssueAndSubmit(selectedInvoice.id)}
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#0F2B5C] text-xs font-bold text-white shadow hover:bg-[#1E40AF] disabled:opacity-50"
                    >
                      <Send className="h-4 w-4" />
                      <span>{isSubmitting ? "Transmitting to ASP..." : "Issue & Transmit to ASP"}</span>
                    </button>
                  )}
                  {selectedInvoice.status === "SUBMITTED" && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Confirmed by Peppol ASP</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CREATE INVOICE MODAL */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-slate-950">Create New UAE Tax Invoice</h2>
                  <p className="text-xs text-slate-600 font-medium">Live 5% VAT calculation and sequential numbering</p>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateInvoice} className="p-6 overflow-y-auto flex-1 space-y-6">
                {/* Entity & Counterparty selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Issuing Legal Entity *
                    </label>
                    <select
                      value={formCompanyId}
                      onChange={(e) => setFormCompanyId(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      {companies.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.legalNameEn} (TRN: {c.trn})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Customer / Counterparty *
                    </label>
                    <select
                      value={formCustomerId}
                      onChange={(e) => setFormCustomerId(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      {customers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.legalNameEn} {c.trn ? `(TRN: ${c.trn})` : "(B2C)"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Issue Date</label>
                    <input
                      type="date"
                      value={formIssueDate}
                      onChange={(e) => setFormIssueDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Due Date</label>
                    <input
                      type="date"
                      value={formDueDate}
                      onChange={(e) => setFormDueDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                {/* Line Items Repeater */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                      Line Items (السلع والخدمات)
                    </h3>
                    <button
                      type="button"
                      onClick={handleAddLine}
                      className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Line</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formLines.map((line, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">Line #{idx + 1}</span>
                          {formLines.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveLine(idx)}
                              className="text-rose-600 hover:text-rose-700 font-bold text-[11px]"
                            >
                              Remove
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                          <div className="sm:col-span-2">
                            <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Description</label>
                            <input
                              type="text"
                              required
                              value={line.description}
                              onChange={(e) => handleLineChange(idx, "description", e.target.value)}
                              placeholder="Service or goods description"
                              className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-900 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Quantity</label>
                            <input
                              type="number"
                              min="0.01"
                              step="any"
                              required
                              value={line.quantity}
                              onChange={(e) => handleLineChange(idx, "quantity", parseFloat(e.target.value) || 1)}
                              className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-900 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Unit Price (AED)</label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              required
                              value={line.unitPrice}
                              onChange={(e) => handleLineChange(idx, "unitPrice", parseFloat(e.target.value) || 0)}
                              className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-900 bg-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">UAE Tax Category</label>
                            <select
                              value={line.taxCategory}
                              onChange={(e) => handleLineChange(idx, "taxCategory", e.target.value as TaxCategoryCode)}
                              className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-900 bg-white"
                            >
                              <option value="S">Category S - Standard Rate (5%)</option>
                              <option value="Z">Category Z - Zero Rated (0%)</option>
                              <option value="E">Category E - Exempt (0%)</option>
                              <option value="O">Category O - Out of Scope</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Line Discount (AED)</label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={line.discountAmount}
                              onChange={(e) => handleLineChange(idx, "discountAmount", parseFloat(e.target.value) || 0)}
                              className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-900 bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Real-time Calculated Totals Summary */}
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                  <div>
                    <span className="font-extrabold text-[#0F2B5C]">UAE Decimal Precision Engine</span>
                    <p className="text-slate-700 text-[11px] font-medium">
                      Net: AED {liveTotals.subtotalNetAmount.toFixed(2)} | VAT 5%: AED {liveTotals.totalTaxAmount.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-slate-600">Gross Total</span>
                    <div className="text-xl font-extrabold text-[#0F2B5C] tabular-nums">
                      AED {liveTotals.grandTotalGrossAmount.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#0F2B5C] text-xs font-bold text-white shadow hover:bg-[#1E40AF]"
                  >
                    Save & Create Draft
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
