# OmniInvoice UAE — Production-Ready UAE E-Invoicing SaaS Platform

[![UAE MoF Compliance Ready](https://img.shields.io/badge/UAE%20MoF%20Mandate-Ready-emerald.svg)](https://mof.gov.ae)
[![Peppol PINT AE](https://img.shields.io/badge/Peppol-PINT%20AE%201.0-blue.svg)](https://peppol.org)
[![Next.js 16](https://img.shields.io/badge/Framework-Next.js%2016%20App%20Router-black.svg)](https://nextjs.org)
[![Tests Passing](https://img.shields.io/badge/Vitest%20Suite-20%2F20%20Passing-success.svg)](https://vitest.dev)

OmniInvoice UAE is an original, cloud-first UAE Electronic Invoicing (E-Invoicing) SaaS platform engineered specifically for UAE businesses, accounting practices, and enterprises. The platform is designed from first principles to satisfy the **UAE Ministry of Finance (MoF)** federal e-invoicing framework, Federal Decree-Law No. 8 of 2017 on Value Added Tax, and the **Peppol International (PINT) Billing for UAE** standard.

---

## 1. System Architecture

```
+-----------------------------------------------------------------------------------+
|                           OmniInvoice UAE SaaS Platform                           |
+-----------------------------------------------------------------------------------+
|  PUBLIC MARKETING WEBSITE   |   CUSTOMER SAAS APP (B2B)   |   PLATFORM ADMIN      |
|  - Value Proposition & Hero |   - Multi-tenant Dashboard  |   - Super Admin View  |
|  - Solutions (SME/Acct/ERP) |   - Sequential Invoicing    |   - Tenant Health     |
|  - UAE E-Invoice Mandate Hub|   - Customer Directory (TRN)|   - ASP Gateway Logs  |
|  - Transparent AED Pricing  |   - Live PINT XML Validator |   - Queue Inspector   |
|  - Security & Developers Doc|   - VAT 201 Return Breakdown|   - Central Audit Log |
+-----------------------------+-----------------------------+-----------------------+
|                       Next.js App Router & TypeScript                             |
|         Tailwind CSS + Headless Accessible UI + LTR/RTL (EN & AR) Support         |
+-----------------------------------------------------------------------------------+
|                      API & Application Services Layer (/api/v1)                   |
|  - Auth & RBAC Guard        - Sequential Numbering Engine - Provider Adapters     |
|  - Tenant & Branch Context  - Decimal Tax & Rounding Calc - Webhook Signatures   |
|  - PINT AE XML Builder      - Audit Logging Interceptor   - Job & Event Dispatch  |
+-----------------------------------------------------------------------------------+
|                        Data Persistence & Security Layer                          |
|  - Prisma ORM / PostgreSQL with UUID PKs and strict Tenant Isolation Constraints  |
|  - AES-256 Encryption for secrets & API keys, SHA-256 for Invoice Document Hashes |
|  - Redis / Queue Interface for asynchronous submissions & webhook deliveries      |
+-----------------------------------------------------------------------------------+
```

---

## 2. Core Functional Modules

### A. UAE VAT & Tax Engine (`src/lib/compliance/uae-tax-engine.ts`)
- Fixed-point decimal arithmetic in fils eliminates IEEE 754 floating point drift.
- Supports Standard 5% VAT (Category `S`), Zero-rated (Category `Z`), Exempt (Category `E`), and Out-of-scope (Category `O`).
- Banker's half-up rounding to nearest 2 decimal places.
- Partial and full credit note reversal logic.

### B. Peppol PINT AE XML Generator & Validator (`src/lib/compliance/pint-ae-generator.ts`)
- Translates internal canonical invoice structures into official UBL 2.1 PINT AE XML with CustomizationID `urn:peppol:pint:billing-3@ae-1`.
- Automatically computes 64-character SHA-256 document digests for tamper-evidence.
- Generates base64 encoded QR stamp payloads conforming to FTA specifications.
- Schematron-style business rule validation engine (`BR-01` to `BR-AE-05` and `BR-CO-01` to `BR-CO-10`).

### C. Accredited Service Provider (ASP) Adapter (`src/lib/provider/`)
- Pluggable `IProviderAdapter` contract for connecting to UAE Accredited Service Providers.
- Ships with an internal `SandboxProviderAdapter` for safe development and demonstration:
  - Generates realistic ASP transmission references (`AE-PINT-SBX-2026-XXXXXX`).
  - Strict idempotency key enforcement.
  - HMAC-SHA256 signature generation and verification for webhook callbacks.

### D. Interactive Invoicing Workbench (`/app/invoices`)
- Real-time invoice creator with customer autocomplete, dynamic line repeater, and live AED calculation.
- Dual English & Arabic official Tax Invoice printable paper sheet.
- Direct "Issue & Transmit to ASP" asynchronous workflow.
- UBL 2.1 XML Inspector with 1-click clipboard copy.
- Cryptographic SHA-256 digest monitor.

### E. UAE VAT Return 201 Breakdown (`/app/reports`)
- Formatted directly to match Federal Tax Authority VAT 201 filing boxes:
  - **Box 1a:** Standard-rated supplies & 5% VAT due.
  - **Box 2:** Reverse charge supplies.
  - **Box 3:** Zero-rated supplies.
  - **Box 4:** Exempt supplies.
  - **Box 8:** Total net VAT payable to FTA.
- 1-click CSV audit export.

---

## 3. Technology Stack

- **Framework:** Next.js 16 (App Router, Turbopack, Standalone container build support)
- **Language:** TypeScript 5.8
- **Styling:** Tailwind CSS v4 & PostCSS
- **Database & ORM:** PostgreSQL 16 + Prisma ORM 6.19
- **Icons & UI:** Lucide React
- **Cryptography:** CryptoJS (SHA-256 & HMAC-SHA256)
- **Testing Runner:** Vitest 5.0

---

## 4. Quick Start & Local Execution

### Prerequisites
- Node.js `v20+` (tested on Node v24)
- npm `10+`

### 1. Installation
```bash
git clone <repo-url>
cd "Omni E Invoicing"
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env.local
```

### 3. Generate Prisma Schema
```bash
npx prisma generate
```

### 4. Run Automated Test Suite
```bash
npm test
```
*Output: 20 passed tests across 4 test suites (VAT engine, TRN validator, PINT AE generator, Provider adapter).*

### 5. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Key Routes Reference

| Route | Description |
|---|---|
| `/` | Public marketing homepage with hero, value propositions, and live preview |
| `/features` | Technical feature breakdown (PINT AE, decimal arithmetic, numbering series) |
| `/solutions` | Tailored solutions for SMEs, Accountants, Trading, and ERP connectors |
| `/uae-einvoicing` | Regulatory overview, MoF mandate details, and official Compliance Register |
| `/pricing` | Transparent AED subscription tiers (Starter, Business, Professional, Accountant, Enterprise) |
| `/security` | DevSecOps standards, AES-256 encryption, and UAE data residency |
| `/developers` | REST API v1 reference, cURL examples, and HMAC webhook verification code |
| `/contact` | Advisory and enterprise consultation request form |
| `/app/dashboard` | Customer SaaS Dashboard (Sales, VAT, Receivables, Overdue, Quota gauge) |
| `/app/invoices` | Invoicing workbench (creation modal, PINT XML inspector, Tax PDF print) |
| `/app/customers` | Customer directory with 15-digit TRN validation |
| `/app/compliance` | Interactive Schematron Validator & ASP Gateway status monitor |
| `/app/reports` | FTA VAT Return 201 breakdown report with CSV export |
| `/app/settings` | Company profile, sequential numbering configuration, and quota controls |
| `/admin` | Platform administration console (tenants, ASP status, queue, audit trail) |

---

## 6. Docker & Container Deployment

To launch the full production environment including PostgreSQL 16 and Redis 7:

```bash
docker compose up -d --build
```

Healthchecks:
- Web App: `http://localhost:3000/api/v1/compliance/register`
- PostgreSQL: `localhost:5432` (`omni_invoicing_db`)
- Redis: `localhost:6379`

---

## 7. License & Compliance Notice

OmniInvoice UAE is an original proprietary platform built for compliance with UAE Federal Decree-Law No. 8 of 2017 and UAE Ministry of Finance e-invoicing standards.
