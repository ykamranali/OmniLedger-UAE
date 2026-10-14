import React from "react";
import Link from "next/link";
import { appConfig } from "@/lib/config/app-config";
import { OmniLedgerLogo } from "@/components/brand/OmniLedgerLogo";
import { FileCheck2, ShieldCheck, Lock, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <OmniLedgerLogo size="md" />
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
              {appConfig.description}
            </p>
            <div className="space-y-1.5 pt-1 text-xs text-slate-600">
              <div className="font-semibold text-slate-900">Contact & Head Office:</div>
              <div className="text-slate-600">
                <span className="font-medium text-slate-900">Kamran Ali</span> — {appConfig.officeAddress}, UAE
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href={`tel:${appConfig.contactPhone.replace(/\s+/g, "")}`}
                  className="font-bold text-emerald-700 hover:text-emerald-800"
                >
                  {appConfig.contactPhone}
                </a>
                <span className="text-slate-300">|</span>
                <a
                  href={`mailto:${appConfig.supportEmail}`}
                  className="font-medium text-blue-700 hover:text-blue-800 font-mono"
                >
                  {appConfig.supportEmail}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Designed strictly for UAE Ministry of Finance E-Invoicing</span>
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
              Solutions
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/solutions" className="hover:text-brand-600">
                  UAE SME Invoicing
                </Link>
              </li>
              <li>
                <Link href="/solutions" className="hover:text-brand-600">
                  Accountants & Bookkeepers
                </Link>
              </li>
              <li>
                <Link href="/solutions" className="hover:text-brand-600">
                  Trading & Logistics
                </Link>
              </li>
              <li>
                <Link href="/solutions" className="hover:text-brand-600">
                  Enterprise ERP Connectors
                </Link>
              </li>
            </ul>
          </div>

          {/* Compliance & Regulatory */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
              UAE E-Invoicing Hub
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/uae-einvoicing" className="hover:text-brand-600">
                  Mandate Timelines
                </Link>
              </li>
              <li>
                <Link href="/uae-einvoicing#pint" className="hover:text-brand-600">
                  Peppol PINT AE Standards
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-brand-600">
                  Data Residency & Security
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-brand-600">
                  Pricing Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Developers & Platform */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
              Developers & Admin
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/developers" className="hover:text-brand-600">
                  REST API Reference
                </Link>
              </li>
              <li>
                <Link href="/developers#webhooks" className="hover:text-brand-600">
                  Webhooks & HMAC Signatures
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-brand-600">
                  Platform Admin Console
                </Link>
              </li>
              <li>
                <Link href="/app/dashboard" className="hover:text-brand-600 font-medium text-brand-700">
                  Customer SaaS Portal &rarr;
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} {appConfig.name}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>UAE Federal Decree-Law No. 8 of 2017</span>
            <span>UBL 2.1 / Peppol BIS Billing 3.0</span>
            <span className="flex items-center gap-1 text-slate-400">
              <Lock className="h-3 w-3" /> 256-Bit TLS & At-Rest Encryption
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
