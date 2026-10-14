"use client";

import React from "react";

interface OmniLedgerLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showWordmark?: boolean;
  showSubtitle?: boolean;
  theme?: "light" | "dark" | "auto";
}

/**
 * OmniLedger UAE - Official Corporate Brand Logo
 * Features an interlocking double-entry ledger crest with UAE Emerald, Royal Navy, and Gold accents.
 */
export function OmniLedgerLogo({
  className = "",
  size = "md",
  showWordmark = true,
  showSubtitle = true,
  theme = "auto",
}: OmniLedgerLogoProps) {
  // Dimensions mapping
  const iconDimensions = {
    sm: { width: 32, height: 32 },
    md: { width: 40, height: 40 },
    lg: { width: 48, height: 48 },
    xl: { width: 64, height: 64 },
  }[size];

  const textSizes = {
    sm: { title: "text-base", sub: "text-[9px]", badge: "text-[9px]" },
    md: { title: "text-lg", sub: "text-[10px]", badge: "text-[10px]" },
    lg: { title: "text-2xl", sub: "text-xs", badge: "text-xs" },
    xl: { title: "text-3xl", sub: "text-sm", badge: "text-xs" },
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* 1. EMBLEM / LEDGER CREST */}
      <svg
        width={iconDimensions.width}
        height={iconDimensions.height}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-sm transition-transform duration-200 group-hover:scale-105"
      >
        <defs>
          <linearGradient id="omniLedgerNavy" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B1E3F" />
            <stop offset="50%" stopColor="#0F2B5C" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>

          <linearGradient id="omniLedgerEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>

          <linearGradient id="omniLedgerGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>

        {/* Outer Rounded Ledger Shield */}
        <rect
          x="3"
          y="3"
          width="42"
          height="42"
          rx="12"
          fill="url(#omniLedgerNavy)"
          stroke="#1E40AF"
          strokeWidth="1.5"
        />

        {/* Diagonal Ledger Grid Line Accent */}
        <path
          d="M3 16L45 16"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="1"
        />
        <path
          d="M3 32L45 32"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="1"
        />
        <path
          d="M24 3L24 45"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="1"
        />

        {/* Left Vertical Ledger Balance Column (Debit) */}
        <rect
          x="10"
          y="12"
          width="5"
          height="24"
          rx="2.5"
          fill="#FFFFFF"
          fillOpacity="0.95"
        />

        {/* Center Interlocking Ledger Step (General Ledger spine) */}
        <rect
          x="19"
          y="18"
          width="5"
          height="18"
          rx="2.5"
          fill="url(#omniLedgerGold)"
        />

        {/* Right Ascending Ledger Growth Column (Credit / Revenue) */}
        <rect
          x="28"
          y="10"
          width="5"
          height="26"
          rx="2.5"
          fill="url(#omniLedgerEmerald)"
        />

        {/* Double-Entry Balance Crossbar (Horizontal reconciliation tick) */}
        <path
          d="M34 16L39 21L34 26"
          stroke="url(#omniLedgerGold)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Cryptographic Trust Indicator Pip */}
        <circle cx="38" cy="11" r="2.5" fill="#10B981" />
      </svg>

      {/* 2. TYPOGRAPHIC WORDMARK */}
      {showWordmark && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black tracking-tight ${textSizes.title} ${
                theme === "dark" ? "text-white" : "text-slate-950"
              }`}
            >
              Omni<span className="text-[#059669]">Ledger</span>
            </span>

            <span
              className={`inline-flex items-center font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-md border ${textSizes.badge} ${
                theme === "dark"
                  ? "bg-emerald-950/80 text-emerald-300 border-emerald-800"
                  : "bg-emerald-50 text-emerald-800 border-emerald-200"
              }`}
            >
              UAE
            </span>
          </div>

          {showSubtitle && (
            <p
              className={`font-medium tracking-tight -mt-0.5 ${textSizes.sub} ${
                theme === "dark" ? "text-slate-400" : "text-slate-500"
              }`}
            >
              General Ledger &amp; E-Invoicing Platform
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Compact Icon-only mark for Favicon / Navigation pills
 */
export function OmniLedgerIcon({ size = 32 }: { size?: number }) {
  return <OmniLedgerLogo size="sm" showWordmark={false} showSubtitle={false} />;
}
