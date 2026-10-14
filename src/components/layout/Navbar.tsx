"use client";

import React, { useState } from "react";
import Link from "next/link";
import { appConfig } from "@/lib/config/app-config";
import {
  FileCheck2,
  ShieldCheck,
  ChevronDown,
  Menu,
  X,
  Globe,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isArabic, setIsArabic] = useState(false);

  const toggleLanguage = () => {
    const nextAr = !isArabic;
    setIsArabic(nextAr);
    document.documentElement.dir = nextAr ? "rtl" : "ltr";
    document.documentElement.lang = nextAr ? "ar" : "en";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-900 via-brand-700 to-teal-500 shadow-md shadow-brand-900/20 text-white transition-transform group-hover:scale-105">
            <FileCheck2 className="h-5 w-5" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900 flex items-center gap-1.5">
              {appConfig.shortName}
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200">
                UAE
              </span>
            </span>
            <p className="text-[10px] text-slate-500 font-medium -mt-1 hidden sm:block">
              Peppol PINT AE Compliant
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <Link href="/features" className="hover:text-brand-600 transition-colors">
            {isArabic ? "المميزات" : "Features"}
          </Link>
          <Link href="/solutions" className="hover:text-brand-600 transition-colors">
            {isArabic ? "الحلول" : "Solutions"}
          </Link>
          <Link href="/uae-einvoicing" className="hover:text-brand-600 transition-colors flex items-center gap-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            {isArabic ? "الفاتورة الإلكترونية" : "UAE Mandate Hub"}
          </Link>
          <Link href="/pricing" className="hover:text-brand-600 transition-colors">
            {isArabic ? "الأسعار" : "Pricing"}
          </Link>
          <Link href="/security" className="hover:text-brand-600 transition-colors">
            {isArabic ? "الأمان والامتثال" : "Security"}
          </Link>
          <Link href="/developers" className="hover:text-brand-600 transition-colors">
            {isArabic ? "واجهة المطورين" : "API & Docs"}
          </Link>
        </nav>

        {/* Action Controls */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            title="Switch Language / تبديل اللغة"
          >
            <Globe className="h-3.5 w-3.5 text-slate-500" />
            <span>{isArabic ? "English" : "العربية"}</span>
          </button>

          {/* Admin Link */}
          <Link
            href="/admin"
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 px-2 py-1.5"
          >
            {isArabic ? "لوحة الإدارة" : "Platform Admin"}
          </Link>

          {/* Customer Portal CTA */}
          <Link
            href="/app/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-800 transition-all hover:shadow"
          >
            <span>{isArabic ? "دخول المنصة" : "Launch SaaS Portal"}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleLanguage}
            className="p-1.5 text-xs font-medium rounded border border-slate-200 text-slate-700"
          >
            {isArabic ? "EN" : "عربي"}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/features"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-700 hover:text-brand-600"
          >
            Features
          </Link>
          <Link
            href="/solutions"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-700 hover:text-brand-600"
          >
            Solutions
          </Link>
          <Link
            href="/uae-einvoicing"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-700 hover:text-brand-600"
          >
            UAE E-Invoicing Mandate
          </Link>
          <Link
            href="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-700 hover:text-brand-600"
          >
            Pricing
          </Link>
          <Link
            href="/security"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-700 hover:text-brand-600"
          >
            Security & Privacy
          </Link>
          <Link
            href="/developers"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-700 hover:text-brand-600"
          >
            API & Webhooks
          </Link>
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg"
            >
              Platform Administration
            </Link>
            <Link
              href="/app/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-sm font-semibold text-white bg-brand-900 rounded-xl"
            >
              Launch SaaS Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
