"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { appConfig } from "@/lib/config/app-config";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building2,
  MessageSquare,
  User,
} from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    trn: "",
    erpSystem: "SAP",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 font-sans">
      <Navbar />

      <main className="flex-1 py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Top Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200/90 px-3.5 py-1 text-xs font-bold text-emerald-800 shadow-2xs mb-3">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            UAE E-Invoicing Advisory & Enterprise Architecture
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight">
            Connect With Our UAE Compliance Team
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed font-medium">
            Direct regulatory advisory, ERP connector deployment, and Peppol PINT AE onboarding with our dedicated UAE engineering team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Executive Contact Card (Kamran Ali) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs">
              <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
                <div className="h-14 w-14 rounded-2xl bg-[#0F2B5C] text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
                  KA
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">Kamran Ali</h2>
                  <p className="text-xs font-semibold text-emerald-700">UAE E-Invoicing Lead & Solutions Architect</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Ramtech UAE / OmniLedger Platform</p>
                </div>
              </div>

              <div className="space-y-4 pt-6 text-xs text-slate-700">
                {/* Office Location */}
                <div className="flex items-start gap-3.5">
                  <div className="h-8 w-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-[#0F2B5C]">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Office Location</div>
                    <div className="text-slate-600 mt-0.5 leading-relaxed font-medium">
                      Abu Baker Al Siddiq St, Al Ain - Abu Dhabi
                    </div>
                    <div className="text-[11px] text-slate-400">United Arab Emirates</div>
                  </div>
                </div>

                {/* Direct Phone / WhatsApp */}
                <div className="flex items-start gap-3.5">
                  <div className="h-8 w-8 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 text-emerald-700">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Direct Telephone & WhatsApp</div>
                    <a
                      href="tel:+971564504650"
                      className="text-emerald-700 hover:text-emerald-800 font-bold block mt-0.5"
                    >
                      +971 56 450 4650
                    </a>
                    <div className="text-[11px] text-slate-500">Available Sunday – Thursday, 8:00 AM – 6:00 PM GST</div>
                  </div>
                </div>

                {/* Direct Email */}
                <div className="flex items-start gap-3.5">
                  <div className="h-8 w-8 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 text-blue-700">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Direct Official Email</div>
                    <a
                      href="mailto:kamran.a@ramtechuae.com"
                      className="text-[#0F2B5C] hover:text-blue-700 font-bold block mt-0.5 font-mono"
                    >
                      kamran.a@ramtechuae.com
                    </a>
                    <div className="text-[11px] text-slate-500">Inquiries answered within 2 hours</div>
                  </div>
                </div>
              </div>

              {/* Direct Action Buttons */}
              <div className="pt-6 mt-6 border-t border-slate-100 grid grid-cols-2 gap-3">
                <a
                  href="tel:+971564504650"
                  className="rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 py-2.5 px-3 text-center text-xs font-bold text-slate-800 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Phone className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Call Direct</span>
                </a>
                <a
                  href="mailto:kamran.a@ramtechuae.com?subject=UAE%20E-Invoicing%20Inquiry%20-%20OmniLedger"
                  className="rounded-xl bg-[#0F2B5C] hover:bg-[#1E40AF] py-2.5 px-3 text-center text-xs font-bold text-white transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>Send Email</span>
                </a>
              </div>
            </div>

            {/* Regulatory Accreditations Box */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-xs text-slate-600 space-y-2.5">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>UAE Compliance Standards</span>
              </div>
              <ul className="space-y-1.5 text-slate-500 font-medium">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  UAE Ministry of Finance & FTA Mandate Specifications
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  Peppol PINT AE (UBL 2.1) Profile & Schematron Rules
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  Accredited Service Provider (ASP Model A) Interoperability
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  Strict Local UAE Data Residency & Encryption
                </li>
              </ul>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7 rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-sm">
            {submitted ? (
              <div className="text-center py-16 space-y-4">
                <div className="h-14 w-14 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900">Inquiry Dispatched</h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you, <span className="font-bold text-slate-900">{formData.name}</span>. Kamran Ali and the UAE engineering team will review your specifications and contact you directly at <span className="font-mono font-bold text-slate-900">{formData.email}</span>.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-bold text-blue-700 hover:text-blue-800"
                  >
                    Submit another inquiry &rarr;
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-950">Request Implementation or Demo</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Receive technical consultation, ERP integration review, or custom volume pricing.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F2B5C] bg-slate-50/50 focus:bg-white transition-all"
                      placeholder="e.g. Tariq Al-Hashimi"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Corporate Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F2B5C] bg-slate-50/50 focus:bg-white transition-all"
                      placeholder="tariq@company.ae"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number (with Country Code)</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F2B5C] bg-slate-50/50 focus:bg-white transition-all"
                      placeholder="+971 50 000 0000"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Company Legal Name</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F2B5C] bg-slate-50/50 focus:bg-white transition-all"
                      placeholder="e.g. Al-Mansoor Enterprises LLC"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">UAE TRN (15-Digit, Optional)</label>
                    <input
                      type="text"
                      maxLength={15}
                      value={formData.trn}
                      onChange={(e) => setFormData({ ...formData, trn: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F2B5C] bg-slate-50/50 focus:bg-white font-mono"
                      placeholder="100XXXXXXXXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Primary ERP or Accounting System</label>
                    <select
                      value={formData.erpSystem}
                      onChange={(e) => setFormData({ ...formData, erpSystem: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F2B5C] bg-slate-50/50 focus:bg-white font-medium"
                    >
                      <option value="Microsoft Dynamics 365">Microsoft Dynamics 365 (F&O / BC)</option>
                      <option value="SAP">SAP S/4HANA / Business One</option>
                      <option value="Oracle NetSuite">Oracle NetSuite / ERP Cloud</option>
                      <option value="Odoo">Odoo Enterprise</option>
                      <option value="Zoho Books">Zoho Books</option>
                      <option value="QuickBooks / Xero">QuickBooks / Xero</option>
                      <option value="TallyPrime">TallyPrime</option>
                      <option value="Custom In-House / API">Custom In-House ERP / Direct API</option>
                      <option value="Excel / Spreadsheets">Excel & CSV Spreadsheets</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Requirements / Timeline</label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F2B5C] bg-slate-50/50 focus:bg-white transition-all font-medium"
                    placeholder="Tell us about your estimated monthly invoice volumes, number of branches/entities, or specific ERP workflows..."
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-[#0F2B5C] hover:bg-[#1E40AF] py-3.5 text-xs font-extrabold text-white shadow-md shadow-blue-950/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
                  >
                    <Send className="h-4 w-4" />
                    <span>Send Implementation Request to Kamran Ali</span>
                  </button>
                </div>

                <div className="text-[11px] text-center text-slate-400 pt-1">
                  🔒 All company data is protected under UAE data privacy regulations. No spam.
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
