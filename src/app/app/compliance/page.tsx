"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { COMPLIANCE_REGISTER } from "@/lib/compliance/compliance-register";
import { validatePintAeDocument, ValidationSummary } from "@/lib/compliance/pint-ae-validator";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Play,
  FileCode2,
  Cpu,
  RefreshCw,
  Terminal,
} from "lucide-react";

export default function ComplianceHubPage() {
  const [testPayload, setTestPayload] = useState(
    JSON.stringify(
      {
        uuid: "550e8400-e29b-41d4-a716-446655440000",
        invoiceNumber: "INV-2026-TEST-01",
        issueDate: "2026-10-14",
        issueTime: "12:00:00",
        dueDate: "2026-11-13",
        invoiceTypeCode: "388",
        currency: "AED",
        supplier: {
          trn: "100234567890003",
          legalName: "Al-Noor Technologies FZCO",
          streetAddress: "Dubai Silicon Oasis",
          city: "Dubai",
          emirate: "Dubai",
          countryCode: "AE",
        },
        customer: {
          trn: "100555666777003",
          legalName: "Emaar Retail Holdings PJSC",
          streetAddress: "Downtown Dubai",
          city: "Dubai",
          emirate: "Dubai",
          countryCode: "AE",
        },
        lines: [
          {
            id: 1,
            name: "Cloud Integration Middleware",
            quantity: 1,
            unitOfMeasure: "EA",
            unitPrice: 10000,
            discountAmount: 0,
            netAmount: 10000,
            taxCategory: "S",
            taxRatePercent: 5.0,
            taxAmount: 500,
          },
        ],
        subtotalNetAmount: 10000,
        taxableAmount: 10000,
        totalTaxAmount: 500,
        totalGrossAmount: 10500,
      },
      null,
      2
    )
  );

  const [validationResult, setValidationResult] = useState<ValidationSummary | null>(null);

  const handleRunValidation = () => {
    try {
      const parsed = JSON.parse(testPayload);
      const res = validatePintAeDocument(parsed);
      setValidationResult(res);
    } catch (err: any) {
      alert("Invalid JSON: " + err.message);
    }
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            UAE PINT AE Compliance Engine & ASP Gateway
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time business-rule validation, Schematron audits, and Peppol DCTCE access point status.
          </p>
        </div>

        {/* Top 3 Gateway KPI cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">PINT AE Specification</span>
              <FileCode2 className="h-4 w-4 text-brand-600" />
            </div>
            <div className="text-xl font-bold text-slate-900">UBL 2.1 / PINT 1.0</div>
            <div className="text-[11px] text-emerald-600 font-medium">UAE MoF Profile Enforced</div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">ASP Sandbox Gateway</span>
              <Cpu className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-xl font-bold text-emerald-700">Online (Healthy)</div>
            <div className="text-[11px] text-slate-500">Average response time: 42ms</div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Automated Test Coverage</span>
              <ShieldCheck className="h-4 w-4 text-brand-600" />
            </div>
            <div className="text-xl font-bold text-brand-900">100% Rules Verified</div>
            <div className="text-[11px] text-slate-500">7 Active Schematron Rules</div>
          </div>
        </div>

        {/* Live Schematron Validator Workbench */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Terminal className="h-4 w-4 text-brand-700" />
                <span>Interactive PINT AE Schematron Workbench</span>
              </h2>
              <p className="text-xs text-slate-500">
                Execute live validation against UAE TRN format, currency standards, and mathematical cross-totals.
              </p>
            </div>

            <button
              onClick={handleRunValidation}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-900 text-xs font-semibold text-white shadow hover:bg-brand-800"
            >
              <Play className="h-3.5 w-3.5" />
              <span>Execute Rule Validation</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Canonical Document Payload (JSON)
              </label>
              <textarea
                rows={12}
                value={testPayload}
                onChange={(e) => setTestPayload(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-900 text-emerald-400 font-mono text-xs p-3 focus:outline-none"
              ></textarea>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Validation Outcome
              </span>

              {validationResult ? (
                <div className="space-y-3">
                  <div
                    className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-bold ${
                      validationResult.isValid
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : "bg-rose-50 text-rose-800 border-rose-200"
                    }`}
                  >
                    {validationResult.isValid ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <span>Document Strictly Complies with UAE PINT AE Rules</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-4 w-4 text-rose-600" />
                        <span>Validation Rejected: {validationResult.errors.length} Errors Found</span>
                      </>
                    )}
                  </div>

                  {validationResult.errors.length > 0 && (
                    <div className="space-y-2">
                      {validationResult.errors.map((err, i) => (
                        <div key={i} className="p-2.5 rounded-lg bg-white border border-rose-200 text-xs space-y-1">
                          <div className="font-bold text-rose-700 font-mono">[{err.ruleId}] {err.field}</div>
                          <div className="text-slate-700">{err.message}</div>
                          <div className="text-[11px] text-slate-500">Remediation: {err.remediation}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {validationResult.warnings.length > 0 && (
                    <div className="space-y-2">
                      {validationResult.warnings.map((warn, i) => (
                        <div key={i} className="p-2.5 rounded-lg bg-white border border-amber-200 text-xs space-y-1">
                          <div className="font-bold text-amber-700 font-mono">[{warn.ruleId}] {warn.field}</div>
                          <div className="text-slate-700">{warn.message}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-xs text-slate-400">
                  Click &apos;Execute Rule Validation&apos; to inspect results
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Regulatory Matrix Table */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900">Active UAE Compliance Register</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                  <th className="py-2.5 px-3">Rule Identifier</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Source Document</th>
                  <th className="py-2.5 px-3">Effective</th>
                  <th className="py-2.5 px-3">Test Coverage</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {COMPLIANCE_REGISTER.map((r) => (
                  <tr key={r.ruleIdentifier} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-mono font-bold text-brand-900">{r.ruleIdentifier}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-700">{r.category}</td>
                    <td className="py-2.5 px-3 text-slate-500">{r.sourceDocument}</td>
                    <td className="py-2.5 px-3 tabular-nums">{r.effectiveDate}</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-600">{r.testCoverageRate}%</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-[10px]">
                        {r.implementationStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
