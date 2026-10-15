"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { appConfig } from "@/lib/config/app-config";
import { OmniLedgerLogo } from "@/components/brand/OmniLedgerLogo";
import { invoicingStore, UserModel } from "@/lib/store/invoicing-store";
import {
  FileCheck2,
  LayoutDashboard,
  Receipt,
  Boxes,
  Users2,
  ShieldCheck,
  FileBarChart,
  Settings,
  ChevronDown,
  Building,
  Plus,
  Bell,
  Search,
  ExternalLink,
  Globe,
  Sparkles,
  CheckCircle2,
  Lock,
  UserCheck,
  ShieldAlert,
} from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Current session & access control
  const currentUser = invoicingStore.getCurrentUser();
  const accessibleCompanies = invoicingStore.getAccessibleCompanies();
  const [selectedCompanyId, setSelectedCompanyId] = useState(
    accessibleCompanies[0]?.id || "comp-dxb-01"
  );
  const [isArabic, setIsArabic] = useState(false);

  const selectedCompany =
    accessibleCompanies.find((c) => c.id === selectedCompanyId) ||
    accessibleCompanies[0];

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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "Super Administrator";
      case "COMPANY_ADMIN":
        return "Client Company Admin";
      case "FINANCIAL_CONTROLLER":
        return "Financial Controller";
      case "BILLING_CLERK":
        return "Billing Clerk";
      case "AUDITOR":
        return "Tax Auditor (Read-Only)";
      default:
        return role;
    }
  };

  const handleSwitchToSuperAdmin = () => {
    invoicingStore.setCurrentUser("usr-super-admin");
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 font-sans">
      {/* Simulation / Scoped Access Alert Banner when logged in as a Client User */}
      {currentUser.role !== "SUPER_ADMIN" && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-bold flex items-center justify-between border-b border-amber-600 print:hidden">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span>
              Restricted Client Access: Logged in as <strong>{currentUser.name}</strong> ({getRoleLabel(currentUser.role)}).
              Access strictly scoped to: <strong>{accessibleCompanies.map((c) => c.legalNameEn).join(", ")}</strong>.
            </span>
          </div>
          <button
            onClick={handleSwitchToSuperAdmin}
            className="px-3 py-1 rounded-lg bg-slate-950 text-white text-[11px] font-extrabold hover:bg-slate-800 transition-colors shadow-xs"
          >
            Switch back to Super Admin (Kamran Ali) &rarr;
          </button>
        </div>
      )}

      <div className="flex-1 flex min-h-0">
        {/* Sidebar Navigation */}
        <aside className="w-64 border-r border-slate-200 bg-white flex flex-col justify-between shrink-0 shadow-sm z-30 print:hidden">
          <div>
            {/* Brand Header */}
            <div className="h-16 border-b border-slate-200/90 px-5 flex items-center justify-between bg-white">
              <Link href="/" className="group">
                <OmniLedgerLogo size="sm" showSubtitle={false} />
              </Link>
            </div>

            {/* UAE Legal Entity Selector (STRICTLY SCOPED TO ACCESSIBLE COMPANIES) */}
            <div className="p-3.5 border-b border-slate-100 bg-slate-50/70">
              <div className="flex items-center justify-between mb-1 px-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Active Legal Entity
                </label>
                {accessibleCompanies.length === 1 && (
                  <span className="text-[9px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded">
                    Client Scoped
                  </span>
                )}
              </div>

              {accessibleCompanies.length > 1 ? (
                <div className="relative">
                  <select
                    value={selectedCompanyId}
                    onChange={(e) => setSelectedCompanyId(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-8 text-xs font-bold text-slate-900 shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {accessibleCompanies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.legalNameEn}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-500 absolute right-3 top-3 pointer-events-none" />
                </div>
              ) : (
                <div className="p-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900">
                  {selectedCompany?.legalNameEn || "No Company Assigned"}
                </div>
              )}

              <div className="mt-1.5 px-1 flex items-center justify-between text-[11px] text-slate-600">
                <span className="font-mono font-semibold text-slate-800">
                  TRN: {selectedCompany?.trn || "—"}
                </span>
                <span className="text-emerald-700 font-bold">{selectedCompany?.city}</span>
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
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? "bg-[#0F2B5C] text-white shadow-md shadow-blue-950/15"
                        : "text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-blue-300" : "text-slate-500"}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer Controls */}
          <div className="p-4 border-t border-slate-200 bg-slate-50/50 space-y-3">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/90 text-[11px] text-emerald-950 flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
              </span>
              <div>
                <div className="font-extrabold text-emerald-900">ASP Sandbox Live</div>
                <div className="text-[10px] text-emerald-700 font-medium">Peppol DCTCE Connected</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs text-slate-600">
              {currentUser.role === "SUPER_ADMIN" ? (
                <Link href="/admin" className="hover:text-blue-700 font-bold text-[11px]">
                  Super Admin Console &rarr;
                </Link>
              ) : (
                <span className="text-[10px] text-slate-400 font-medium">
                  Tenant: {currentUser.assignedCompanyIds.length} Entity
                </span>
              )}
              <button
                onClick={toggleLanguage}
                className="p-1 px-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 font-semibold text-[11px] text-slate-700"
              >
                {isArabic ? "English" : "العربية"}
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 print:block print:w-full print:p-0">
          {/* Top Navbar */}
          <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between shrink-0 shadow-2xs print:hidden">
            <div className="flex items-center gap-4">
              <div className="relative hidden sm:block">
                <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search invoices by number, counterparty, or TRN..."
                  className="w-80 rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-1.5 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/app/invoices?new=true"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F2B5C] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#1E40AF] transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Create Invoice</span>
              </Link>

              <div className="h-5 w-px bg-slate-200 mx-1"></div>

              {/* User Avatar & Role */}
              <div className="flex items-center gap-2.5 text-xs">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center font-extrabold text-xs border ${
                  currentUser.role === "SUPER_ADMIN"
                    ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                    : "bg-blue-100 text-blue-900 border-blue-300"
                }`}>
                  {getInitials(currentUser.name)}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="font-bold text-slate-900 text-xs leading-tight flex items-center gap-1.5">
                    <span>{currentUser.name}</span>
                    <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                      currentUser.role === "SUPER_ADMIN"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-100 text-slate-700"
                    }`}>
                      {currentUser.role === "SUPER_ADMIN" ? "Super Admin" : "Client User"}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium leading-tight font-mono">
                    {currentUser.email}
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Dynamic Page Content */}
          <main className="flex-1 p-6 overflow-y-auto print:p-0 print:overflow-visible print:block">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
