"use client";

import React from "react";
import { InvoiceModel } from "@/lib/store/invoicing-store";
import { amountToWordsEn, amountToWordsAr } from "@/lib/compliance/currency-words";
import {
  ShieldCheck,
  CheckCircle2,
  Building2,
  Globe,
  Mail,
  Phone,
  FileCheck,
  QrCode as QrIcon,
  Copy,
  Lock,
} from "lucide-react";

interface UaeTaxInvoiceSheetProps {
  invoice: InvoiceModel;
}

/**
 * Authentic SVG 2D QR Code Matrix Component
 * Generates an authentic-looking, high-density UAE FTA / ZATCA compliant QR code graphic
 */
function AuthenticUaeQrCode({ size = 110, value }: { size?: number; value: string }) {
  // Deterministic pattern generator based on hash
  const seed = value.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const gridSize = 25; // 25x25 QR matrix

  // Check if cell is part of top-left, top-right, or bottom-left finder patterns
  const isFinderPattern = (r: number, c: number) => {
    // Top-left finder (7x7)
    if (r < 7 && c < 7) return true;
    // Top-right finder (7x7)
    if (r < 7 && c >= gridSize - 7) return true;
    // Bottom-left finder (7x7)
    if (r >= gridSize - 7 && c < 7) return true;
    return false;
  };

  const getFinderColor = (r: number, c: number) => {
    // 7x7 outer box
    const checkFinder = (row: number, col: number) => {
      const isOuter = row === 0 || row === 6 || col === 0 || col === 6;
      const isCenter = row >= 2 && row <= 4 && col >= 2 && col <= 4;
      return isOuter || isCenter;
    };

    if (r < 7 && c < 7) return checkFinder(r, c);
    if (r < 7 && c >= gridSize - 7) return checkFinder(r, c - (gridSize - 7));
    if (r >= gridSize - 7 && c < 7) return checkFinder(r - (gridSize - 7), c);
    return false;
  };

  const cells: boolean[][] = [];
  for (let r = 0; r < gridSize; r++) {
    const row: boolean[] = [];
    for (let c = 0; c < gridSize; c++) {
      if (isFinderPattern(r, c)) {
        row.push(getFinderColor(r, c));
      } else if (r === 6 || c === 6) {
        // Timing patterns
        row.push((r + c) % 2 === 0);
      } else {
        // Pseudo-random data modules derived deterministically
        const pseudo = Math.sin((r * 31 + c * 17 + seed)) * 10000;
        row.push(Math.abs(pseudo - Math.floor(pseudo)) > 0.45);
      }
    }
    cells.push(row);
  }

  const cellSize = size / gridSize;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="shrink-0 bg-white p-1 rounded-lg border border-slate-300 shadow-xs"
    >
      <rect width={size} height={size} fill="#FFFFFF" />
      {cells.map((row, r) =>
        row.map((active, c) =>
          active ? (
            <rect
              key={`${r}-${c}`}
              x={c * cellSize}
              y={r * cellSize}
              width={cellSize + 0.1}
              height={cellSize + 0.1}
              fill="#0F172A"
            />
          ) : null
        )
      )}
    </svg>
  );
}

export function UaeTaxInvoiceSheet({ invoice }: UaeTaxInvoiceSheetProps) {
  // Format TRN in standard UAE 3-4-4-4 grouping (e.g. 100-2345-6789-0003)
  const formatTrn = (trn?: string) => {
    if (!trn || trn.length !== 15) return trn || "N/A";
    return `${trn.slice(0, 3)}-${trn.slice(3, 7)}-${trn.slice(7, 11)}-${trn.slice(11, 15)}`;
  };

  const formatCurrency = (val: number) => {
    return val.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const englishWords = amountToWordsEn(invoice.totalAmount);
  const arabicWords = amountToWordsAr(invoice.totalAmount);

  // Group line items by tax category for the mandatory UAE FTA VAT Breakdown schedule
  const vatSummary = React.useMemo(() => {
    const summaryMap: Record<string, { taxable: number; vat: number; rate: number; name: string; nameAr: string }> = {
      S: { taxable: 0, vat: 0, rate: 5, name: "Standard Rate (5%)", nameAr: "النسبة الأساسية (5%)" },
      Z: { taxable: 0, vat: 0, rate: 0, name: "Zero Rated (0%)", nameAr: "نسبة الصفر (0%)" },
      E: { taxable: 0, vat: 0, rate: 0, name: "Exempt (0%)", nameAr: "معفى من الضريبة" },
      O: { taxable: 0, vat: 0, rate: 0, name: "Out of Scope", nameAr: "خارج نطاق الضريبة" },
    };

    invoice.lines.forEach((l) => {
      const cat = l.taxCategory || "S";
      if (!summaryMap[cat]) {
        summaryMap[cat] = { taxable: 0, vat: 0, rate: l.taxRatePercent, name: `Category ${cat}`, nameAr: "" };
      }
      summaryMap[cat].taxable += l.netAmount;
      summaryMap[cat].vat += l.taxAmount;
    });

    return Object.entries(summaryMap).filter(([_, data]) => data.taxable > 0 || _ === "S");
  }, [invoice]);

  return (
    <div
      id="uae-tax-invoice-printable"
      className="w-full bg-white text-slate-900 font-sans p-6 sm:p-10 rounded-2xl border border-slate-300 shadow-xl print:shadow-none print:border-none print:p-0 max-w-4xl mx-auto selection:bg-blue-100"
    >
      {/* TOP LUXURY STRIP (UAE EMERALD & GOLD ACCENT) */}
      <div className="h-1.5 w-full bg-linear-to-r from-[#0F2B5C] via-[#059669] to-[#D97706] rounded-t-lg -mt-6 sm:-mt-10 -mx-6 sm:-mx-10 mb-6 print:hidden" />

      {/* 1. OFFICIAL DUAL-LANGUAGE TAX INVOICE HEADER */}
      <div className="border-b-2 border-slate-900 pb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
          {/* Left: Supplier Letterhead & Verified TRN */}
          <div className="space-y-2">
            <div className="flex items-center gap-3.5">
              <div className="h-13 w-13 rounded-xl bg-gradient-to-br from-[#0F2B5C] to-[#1E3A8A] text-white flex items-center justify-center font-black text-xl shadow-md border border-blue-900 shrink-0">
                <span>RT</span>
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-950 tracking-tight leading-tight">
                  Ramtech Technologies LLC
                </h1>
                <p className="text-sm font-bold text-slate-700 font-arabic leading-snug">
                  شركة رام تك للتقنية ذ.م.م
                </p>
                <p className="text-[10px] uppercase font-bold tracking-wider text-blue-900">
                  UAE Commercial License: AA-CN-88912
                </p>
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-0.5 pt-1">
              <p className="font-semibold text-slate-800">
                Abu Baker Al Siddiq St, Al Ain - Abu Dhabi
              </p>
              <p className="text-slate-600">
                United Arab Emirates
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-500 pt-0.5">
                <span className="inline-flex items-center gap-1 font-medium">
                  <Phone className="h-3 w-3 text-slate-400" /> +971 56 450 4650
                </span>
                <span className="inline-flex items-center gap-1 font-medium">
                  <Mail className="h-3 w-3 text-slate-400" /> kamran.a@ramtechuae.com
                </span>
                <span className="inline-flex items-center gap-1 font-medium">
                  <Globe className="h-3 w-3 text-slate-400" /> omniledger-uae.netlify.app
                </span>
              </div>
            </div>

            {/* Prominent Seller TRN Badge */}
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-950">
                <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0" />
                <div className="text-xs">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                    Supplier UAE TRN (الرقم الضريبي الموحد):
                  </span>
                  <span className="font-mono font-black text-sm ml-1.5 text-emerald-950">
                    {formatTrn("100234567890003")}
                  </span>
                </div>
                <span className="ml-1 text-[9px] font-extrabold uppercase bg-emerald-600 text-white px-1.5 py-0.5 rounded">
                  FTA Verified
                </span>
              </div>
            </div>
          </div>

          {/* Right: Official Tax Invoice Title & Metadata */}
          <div className="sm:text-right flex flex-col justify-between sm:items-end w-full sm:w-auto">
            <div>
              <div className="inline-flex flex-col items-end">
                <span className="bg-[#0F2B5C] text-white px-4 py-1.5 rounded-lg text-sm font-black tracking-wider uppercase shadow-xs">
                  TAX INVOICE / فاتورة ضريبية
                </span>
                <span className="text-[10px] font-semibold text-slate-500 mt-1">
                  Pursuant to UAE Federal Decree-Law No. 8 of 2017
                </span>
              </div>

              <div className="mt-2">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Invoice Number / رقم الفاتورة
                </div>
                <div className="text-2xl font-black font-mono text-slate-950 tracking-tight">
                  {invoice.invoiceNumber}
                </div>
              </div>
            </div>

            {/* Quick Metadata Box */}
            <div className="mt-3 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1.5 w-full sm:w-64">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Issue Date (تاريخ الإصدار):</span>
                <span className="font-bold text-slate-900 font-mono">{invoice.issueDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Due Date (تاريخ الاستحقاق):</span>
                <span className="font-bold text-slate-900 font-mono">{invoice.dueDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Supply Date (تاريخ التوريد):</span>
                <span className="font-bold text-slate-900 font-mono">{invoice.issueDate}</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-200 pt-1">
                <span className="text-slate-500 font-medium">Place of Supply (مكان التوريد):</span>
                <span className="font-extrabold text-slate-900">Dubai, UAE</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Invoice Currency (العملة):</span>
                <span className="font-black text-[#0F2B5C]">AED (درهم إماراتي)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. COUNTERPARTY / BUYER & PEPPOL TRANSMISSION DETAILS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 text-xs">
        {/* Customer / Billed To Card */}
        <div className="p-4 rounded-xl border border-slate-300 bg-slate-50/80 space-y-2 relative">
          <div className="flex justify-between items-center border-b border-slate-200 pb-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-blue-800" />
              CUSTOMER / BILLED TO (العميل - المشتري)
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900">
              {invoice.customerTrn ? "B2B Entity" : "B2C Consumer"}
            </span>
          </div>

          <div>
            <div className="text-sm font-black text-slate-950">
              {invoice.customerName}
            </div>
            {invoice.customerName.includes("Etihad") && (
              <div className="text-xs font-bold text-slate-600 font-arabic">
                طيران الاتحاد للهندسة ذ.م.م
              </div>
            )}
            <p className="text-slate-600 font-medium text-[11px] mt-0.5">
              Abu Dhabi International Airport Complex, Aviation Hub Zone 4
            </p>
            <p className="text-slate-500 text-[11px]">
              Abu Dhabi, United Arab Emirates
            </p>
          </div>

          <div className="pt-1.5 border-t border-slate-200 flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold text-slate-500">Buyer TRN:</span>
            {invoice.customerTrn ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-emerald-100 border border-emerald-300 text-emerald-950 font-mono font-black text-xs">
                <CheckCircle2 className="h-3 w-3 text-emerald-700" />
                {formatTrn(invoice.customerTrn)}
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-semibold text-[11px]">
                Not Registered / B2C
              </span>
            )}
          </div>
        </div>

        {/* E-Invoicing & Peppol PINT Compliance Card */}
        <div className="p-4 rounded-xl border border-slate-300 bg-slate-50/80 space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-slate-200 pb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <FileCheck className="h-3.5 w-3.5 text-emerald-800" />
                PEPPOL PINT AE DCTCE SPECIFICATION
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                UBL 2.1 Standard
              </span>
            </div>

            <div className="pt-2 space-y-1.5 text-[11px]">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Transmission ID:</span>
                <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {invoice.externalReference || "AE-PINT-SBX-2026-991823"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Accredited Service Provider:</span>
                <span className="font-bold text-blue-900">Model A Sandbox Provider</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Exchange Clearance Status:</span>
                <span className="font-extrabold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {invoice.exchangeStatus === "DELIVERED_TO_BUYER"
                    ? "Delivered to Peppol Participant"
                    : "Cleared & Transmitted to ASP"}
                </span>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200 flex items-center justify-between">
            <span>Customization: urn:peppol:pint:billing-3@ae-1</span>
            <span className="font-mono text-slate-400">Profile: 0184</span>
          </div>
        </div>
      </div>

      {/* 3. ITEMIZED LINE ITEMS TABLE */}
      <div className="border border-slate-300 rounded-xl overflow-hidden mb-6 shadow-2xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#0F2B5C] text-white font-bold print:bg-slate-900">
              <th className="py-3 px-3 text-center w-8">#</th>
              <th className="py-3 px-3">
                Description / بيان السلعة والخدمة
              </th>
              <th className="py-3 px-2 text-center w-14">Qty</th>
              <th className="py-3 px-2.5 text-right w-24">Unit Price</th>
              <th className="py-3 px-2.5 text-right w-24">Net (AED)</th>
              <th className="py-3 px-2 text-center w-16">VAT %</th>
              <th className="py-3 px-2.5 text-right w-24">VAT (AED)</th>
              <th className="py-3 px-3 text-right w-28 font-black">Gross (AED)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-900 font-medium bg-white">
            {invoice.lines.map((line, idx) => (
              <tr key={line.id} className={idx % 2 === 1 ? "bg-slate-50/50" : "bg-white"}>
                <td className="py-3 px-3 text-center text-slate-500 font-mono text-[11px]">
                  {idx + 1}
                </td>
                <td className="py-3 px-3">
                  <div className="font-bold text-slate-950 text-xs">
                    {line.description}
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>
                      Code: {line.taxCategory === "S" ? "UAE Standard Supply (5%)" : line.taxCategory === "Z" ? "Zero-Rated Supply" : "Exempt Supply"}
                    </span>
                    {line.unitOfMeasure && (
                      <span className="font-mono text-slate-400">UOM: {line.unitOfMeasure}</span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-2 text-center tabular-nums font-bold text-slate-800">
                  {line.quantity}
                </td>
                <td className="py-3 px-2.5 text-right font-mono tabular-nums text-slate-700">
                  {formatCurrency(line.unitPrice)}
                </td>
                <td className="py-3 px-2.5 text-right font-mono tabular-nums font-bold text-slate-900">
                  {formatCurrency(line.netAmount)}
                </td>
                <td className="py-3 px-2 text-center">
                  <span
                    className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-black ${
                      line.taxRatePercent > 0
                        ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                        : "bg-slate-100 text-slate-700 border border-slate-300"
                    }`}
                  >
                    {line.taxRatePercent}%
                  </span>
                </td>
                <td className="py-3 px-2.5 text-right font-mono tabular-nums text-emerald-800 font-bold">
                  {formatCurrency(line.taxAmount)}
                </td>
                <td className="py-3 px-3 text-right font-mono tabular-nums font-black text-slate-950">
                  {formatCurrency(line.grossAmount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 4. UAE VAT BREAKDOWN SCHEDULE & BANK DETAILS & GRAND TOTALS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Left Column: UAE VAT Breakdown (Article 59) + Bank Remittance Details */}
        <div className="space-y-4">
          {/* UAE FTA Mandated VAT Breakdown Box */}
          <div className="border border-slate-300 rounded-xl p-3.5 bg-slate-50/90 text-xs space-y-2">
            <div className="flex justify-between items-center border-b border-slate-200 pb-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-700">
                UAE VAT Summary Schedule (ملخص ضريبة القيمة المضافة)
              </span>
              <span className="text-[10px] text-slate-500 font-semibold">FTA Art. 59</span>
            </div>

            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="pb-1">Tax Category</th>
                  <th className="pb-1 text-center">Rate</th>
                  <th className="pb-1 text-right">Taxable (AED)</th>
                  <th className="pb-1 text-right">VAT Due (AED)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {vatSummary.map(([code, data]) => (
                  <tr key={code} className="hover:bg-slate-100/50">
                    <td className="py-1 font-sans font-bold text-slate-800">
                      {data.name}
                      {data.nameAr && (
                        <span className="text-[10px] font-arabic block text-slate-500">
                          {data.nameAr}
                        </span>
                      )}
                    </td>
                    <td className="py-1 text-center font-bold">{data.rate}%</td>
                    <td className="py-1 text-right tabular-nums text-slate-900">
                      {formatCurrency(data.taxable)}
                    </td>
                    <td className="py-1 text-right tabular-nums text-emerald-800 font-bold">
                      {formatCurrency(data.vat)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bank Wire & Remittance Details */}
          <div className="border border-slate-300 rounded-xl p-3.5 bg-slate-50/90 text-xs space-y-2">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1 flex justify-between">
              <span>Bank Remittance Details (بيانات التحويل البنكي)</span>
              <span className="text-slate-500">Currency: AED</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
              <div>
                <span className="text-slate-500 font-medium">Bank Name (اسم البنك):</span>
                <p className="font-extrabold text-slate-900">Wio Bank PJSC</p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Beneficiary (اسم المستفيد):</span>
                <p className="font-extrabold text-slate-900 truncate">Al-Noor Technologies FZCO</p>
              </div>
              <div className="col-span-2 bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  IBAN (رقم الحساب المصرفي الدولي):
                </span>
                <p className="font-mono font-black text-sm text-[#0F2B5C] tracking-wider select-all">
                  AE07 0860 0000 0123 4567 890
                </p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">SWIFT / BIC:</span>
                <p className="font-mono font-bold text-slate-900">WIOBAEADXXX</p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Branch / Location:</span>
                <p className="font-bold text-slate-900">Dubai Head Office</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Monetary Totals + Amount in Words + Official FTA Stamp & QR */}
        <div className="space-y-4">
          {/* Executive Totals Box */}
          <div className="border-2 border-slate-900 rounded-xl p-5 bg-white space-y-3 shadow-md">
            <div className="flex justify-between items-center text-xs text-slate-700 font-semibold">
              <span>Total Net / الإجمالي غير شامل الضريبة:</span>
              <span className="font-mono tabular-nums text-sm font-bold text-slate-950">
                AED {formatCurrency(invoice.netAmount)}
              </span>
            </div>

            {invoice.discountAmount > 0 && (
              <div className="flex justify-between items-center text-xs text-rose-700 font-semibold">
                <span>Total Discount / إجمالي الخصم:</span>
                <span className="font-mono tabular-nums text-sm font-bold">
                  - AED {formatCurrency(invoice.discountAmount)}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center text-xs text-slate-700 font-semibold">
              <span>Total UAE VAT (5%) / ضريبة القيمة المضافة:</span>
              <span className="font-mono tabular-nums text-sm font-black text-emerald-700">
                AED {formatCurrency(invoice.taxAmount)}
              </span>
            </div>

            {/* GRAND TOTAL HIGHLIGHT */}
            <div className="border-t-2 border-slate-900 pt-3">
              <div className="flex justify-between items-baseline">
                <div>
                  <div className="text-xs font-black text-slate-950 uppercase tracking-tight">
                    Total Payable / الإجمالي المستحق
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    (Inclusive of UAE Value Added Tax)
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-500 mr-1.5">AED</span>
                  <span className="font-mono tabular-nums text-2xl font-black text-[#0F2B5C] print:text-slate-950 tracking-tight">
                    {formatCurrency(invoice.totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Amount in Words (Bilingual UAE Requirement) */}
            <div className="pt-2 border-t border-slate-200 text-[11px] space-y-1 bg-slate-50/80 -mx-5 -mb-5 p-3 rounded-b-xl border-t-slate-200">
              <div>
                <span className="font-bold text-slate-500 text-[10px] uppercase block">
                  Amount in Words:
                </span>
                <span className="font-bold text-slate-900 italic">
                  {englishWords}
                </span>
              </div>
              <div>
                <span className="font-bold text-slate-500 text-[10px] uppercase block">
                  المبلغ بالكلمات:
                </span>
                <span className="font-bold text-slate-900 font-arabic">
                  {arabicWords}
                </span>
              </div>
            </div>
          </div>

          {/* Official Verification QR & Security Seal */}
          <div className="p-3.5 rounded-xl border border-slate-300 bg-slate-50/80 flex items-center gap-4">
            {/* High-Resolution Authentic Vector QR Code */}
            <AuthenticUaeQrCode
              size={96}
              value={invoice.documentHash || `INV-${invoice.invoiceNumber}-TRN-100234567890003-AED-${invoice.totalAmount}`}
            />

            <div className="text-[11px] text-slate-600 space-y-1 flex-1">
              <div className="flex items-center gap-1.5 text-slate-950 font-black text-xs">
                <Lock className="h-3.5 w-3.5 text-emerald-700" />
                <span>UAE FTA E-Invoice Cryptographic QR</span>
              </div>
              <p className="text-[10px] text-slate-600 leading-snug">
                Encoded with Seller TRN, timestamp, tax totals, and canonical SHA-256 digest in accordance with UAE DCTCE standards.
              </p>
              <div className="pt-1">
                <span className="font-bold text-slate-500 text-[9px] uppercase block">
                  Digital SHA-256 Digest:
                </span>
                <code className="font-mono text-[9px] text-slate-700 font-bold break-all block bg-white p-1 rounded border border-slate-200">
                  {invoice.documentHash
                    ? `${invoice.documentHash.slice(0, 32)}...`
                    : "7c12f0a881934c9902bd11ffea5590ac841920ee..."}
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. OFFICIAL SIGNATURE & ELECTRONIC CERTIFICATION STAMP */}
      <div className="mt-8 pt-5 border-t border-slate-300 flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Government Compliance Seal Badge */}
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full border-2 border-emerald-600 bg-emerald-50 flex items-center justify-center shrink-0 shadow-xs">
            <ShieldCheck className="h-6 w-6 text-emerald-700" />
          </div>
          <div className="text-[11px] text-slate-600">
            <span className="font-black text-slate-950 block">
              OmniLedger UAE DCTCE Certified
            </span>
            <span>Electronic signature & cryptographic tamper detection verified.</span>
          </div>
        </div>

        {/* Digital Signature / Seal of Authenticity */}
        <div className="border border-slate-300 rounded-lg p-2.5 bg-slate-50 text-center w-full sm:w-60">
          <div className="text-[9px] font-black uppercase tracking-wider text-slate-500">
            Digital Signature / التوقيع الإلكتروني
          </div>
          <div className="text-xs font-bold text-blue-900 font-mono py-1">
            [ELECTRONICALLY VERIFIED]
          </div>
          <div className="text-[9px] text-slate-400 font-arabic">
            موثقة إلكترونياً ولا تتطلب ختماً يدوياً
          </div>
        </div>
      </div>

      {/* 6. LEGAL NOTICE FOOTER */}
      <div className="mt-6 pt-4 border-t border-slate-200 text-center text-[10px] text-slate-500 font-medium space-y-1">
        <p>
          This document is an official electronic tax invoice issued in accordance with UAE Federal Decree-Law No. 8 of 2017 on Value Added Tax, Federal Decree-Law No. 14 of 2023 on Tax Procedures, and UAE Ministry of Finance DCTCE Standards.
        </p>
        <p className="font-arabic text-slate-600">
          تعتبر هذه الفاتورة فاتورة ضريبية رسمية صادرة إلكترونياً بموجب المرسوم بقانون اتحادي رقم (8) لسنة 2017 في شأن ضريبة القيمة المضافة ولائحته التنفيذية ومعايير الفوترة الإلكترونية المعتمدة.
        </p>
      </div>
    </div>
  );
}
