"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { appConfig } from "@/lib/config/app-config";
import { invoicingStore } from "@/lib/store/invoicing-store";
import {
  FileCheck2,
  LayoutDashboard,
  Receipt,
  Boxes,
  Users2,
  ShieldAlert,
  FileBarChart,
  Settings,
  ChevronDown,
  Building,
  Plus,
  Bell,
  Search,
  ExternalLink,
  ShieldCheck,
  Globe,
  LogOut,
  Sparkles,
} from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [selectedCompanyId, setSelectedCompanyId] = useState("comp-dxb-01");
  const [isArabic, setIsArabic] = useState(false);
  const companies = invoicingStore.getCompanies();
  const selectedCompany = companies.find((c) => c.id === selectedCompanyId) || companies[0];

  const navItems = [
    { name: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard },
    { name: "Invoices & Credits", href: "/app/invoices", icon: Receipt },
    { name: "Purchase Bills", href: "/app/purchases", icon: Boxes },
    { name: "Customers & Parties", href: "/app/customers", icon: Users2 },
    { name: "UAE Compliance Hub", href: "/app/compliance", icon: ShieldCheck },
    { name: "VAT 201 Reports", href: "/app/reports", icon: FileBarChart },
    { name: "Settings & Quotas", href: "/app/settings", icon: Settings },
  ];

  const toggleLanguage = () => {
    const nextAr = !isArabic;
    setIsArabic(nextAr);
    document.documentElement.dir = nextAr ? "rtl" : "ltr";
    document.documentElement.lang = nextAr ? "ar" : "en";
  };

  return (
    <div className="min-h-screen flex bg-slate-100 text-slate-800">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-slate-200/90 bg-white flex flex-col justify-between shrink-0 shadow-sm z-30">
        <div>
          {/* Brand Header */}
          <div className="h-16 border-b border-slate-200/80 px-5 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-900 text-white shadow-sm">
                <FileCheck2 className="h-5 w-5" />
              </div>
              <div>
                <span className="font-extrabold text-slate-900 tracking-tight text-sm">
                  {appConfig.shortName}
                </span>
                <span className="ml-1 text-[10px] font-semibold px-1 rounded bg-brand-50 text-brand-700">
                  SaaS
                </span>
              </div>
            </Link>
          </div>

          {/* UAE Legal Entity Selector */}
          <div className="p-3 border-b border-slate-100">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 px-1">
              Active UAE Company
            </label>
            <div className="relative">
              <select
                value={selectedCompanyId}
                onChange={(e) => setSelectedCompanyId(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/70 py-2 pl-3 pr-8 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.legalNameEn}
                  </option>
                ))}
              </select>
              <ChevronDown className="h-4 w-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
            <div className="mt-1.5 px-1 flex items-center justify-between text-[11px] text-slate-500">
              <span className="font-mono">TRN: {selectedCompany?.trn}</span>
              <span className="text-emerald-700 font-semibold">{selectedCompany?.city}</span>
            </div>
          </div>

          {/* Primary Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-brand-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-brand-300" : "text-slate-500"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="p-4 border-t border-slate-200 space-y-3">
          <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-[11px] text-emerald-900 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
            <div>
              <div className="font-bold">ASP Sandbox Live</div>
              <div className="text-[10px] text-emerald-700">Peppol DCTCE Connected</div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
            <Link href="/admin" className="hover:text-brand-700 font-medium text-[11px]">
              Platform Admin &rarr;
            </Link>
            <button onClick={toggleLanguage} className="p-1 rounded hover:bg-slate-100 text-[11px]">
              {isArabic ? "English" : "العربية"}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-200/80 bg-white px-6 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search invoices by number, counterparty, or TRN..."
                className="w-80 rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/app/invoices?new=true"
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-brand-800 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create Invoice</span>
            </Link>

            <div className="h-5 w-px bg-slate-200 mx-1"></div>

            <div className="flex items-center gap-2 text-xs">
              <div className="h-7 w-7 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center font-bold">
                TC
              </div>
              <div className="hidden sm:block text-left">
                <div className="font-semibold text-slate-900 text-xs leading-tight">Tariq Controller</div>
                <div className="text-[10px] text-slate-500 leading-tight">Financial Controller</div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
