"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { appConfig } from "@/lib/config/app-config";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    trn: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info Side */}
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
                UAE Advisory & Technical Support
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
                Speak With a UAE E-Invoicing Specialist
              </h1>
              <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                Whether you need assistance mapping your chart of accounts to UAE PINT AE, connecting an ERP system, or provisioning an accounting firm portal, our Dubai team is here to assist.
              </p>
            </div>

            <div className="space-y-4 pt-4 text-sm text-slate-700">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-brand-700 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-900">Dubai Office</div>
                  <div className="text-slate-500 text-xs">
                    Tech Hub Tower 2, Dubai Silicon Oasis, Dubai, United Arab Emirates
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-brand-700 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-900">Email Inquiries</div>
                  <div className="text-slate-500 text-xs">{appConfig.salesEmail}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-brand-700 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-900">Direct Telephone</div>
                  <div className="text-slate-500 text-xs">+971 4 398 7654</div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="rounded-2xl bg-white border border-slate-200 p-8 shadow-sm">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Inquiry Received</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Thank you, {formData.name}. A UAE E-Invoicing specialist will review your company details and contact you within 2 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-lg font-bold text-slate-900">Request Consultation or Demo</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="e.g. Tariq Al-Hashimi"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Corporate Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="tariq@company.ae"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Company Legal Name</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="e.g. Al-Hashimi Trading LLC"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">UAE TRN (Optional)</label>
                    <input
                      type="text"
                      maxLength={15}
                      value={formData.trn}
                      onChange={(e) => setFormData({ ...formData, trn: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="100XXXXXXXXXXXX"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Requirements</label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="Tell us about your document volume, legal entities, or ERP systems..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-brand-900 py-3 text-xs font-semibold text-white shadow hover:bg-brand-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  <span>Send Advisory Request</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
