# OmniInvoice UAE — Netlify Cloud Deployment Guide

This guide walks you through deploying **OmniInvoice UAE** to your **Netlify Cloud** account with zero hassle. The repository is already pre-configured with `netlify.toml` and `@netlify/plugin-nextjs` for full App Router compatibility.

---

## 1. Fast Deploy via Netlify Dashboard (Git-Connected)

### Step 1: Push Code to GitHub / GitLab
Make sure your project repository is committed and pushed to your remote Git repository (e.g., GitHub, GitLab, or Bitbucket):
```bash
git add .
git commit -m "Production release: luxury UAE Tax Invoice & Netlify configuration"
git push origin master
```

### Step 2: Import into Netlify
1. Log in to your [Netlify Dashboard](https://app.netlify.com/).
2. Click **"Add new site"** &rarr; **"Import an existing project"**.
3. Select your Git provider (e.g., GitHub) and choose your `Omni E Invoicing` repository.

### Step 3: Verify Build Settings
Netlify will automatically detect the settings from `netlify.toml`:
- **Base directory:** *(leave empty or set to `/`)*
- **Build command:** `npm run build`
- **Publish directory:** `.next`
- **Next.js Plugin:** `@netlify/plugin-nextjs` *(auto-detected and loaded)*

### Step 4: Configure Environment Variables
In the Netlify deployment setup (or under **Site configuration &rarr; Environment variables**), add the following environment variables:

| Variable Name | Recommended Value | Description |
| :--- | :--- | :--- |
| `NODE_VERSION` | `20` | Node.js LTS runtime |
| `NEXT_PUBLIC_APP_NAME` | `OmniInvoice UAE` | Brand display name |
| `COMPLIANCE_VERSION` | `PINT-AE-2026-v1` | Peppol PINT AE specification version |
| `ASP_ENVIRONMENT` | `sandbox` | Accredited Service Provider sandbox mode |
| `DATABASE_URL` | `file:./dev.db` | SQLite local db or PostgreSQL connection string |
| `NEXT_TELEMETRY_DISABLED` | `1` | Disables telemetry for faster builds |

### Step 5: Click "Deploy OmniInvoice UAE"
Netlify will build your application, execute TypeScript type checking, and deploy your site to a global CDN.

---

## 2. Deploy via Netlify CLI (Direct Terminal Method)

If you prefer deploying directly from your local computer without connecting Git:

```bash
# 1. Install Netlify CLI globally
npm install -g netlify-cli

# 2. Login to your Netlify account
netlify login

# 3. Initialize Netlify site link
netlify init

# 4. Deploy production build directly
netlify deploy --prod --build
```

---

## 3. Custom Domain & SSL Setup (e.g., `invoicing.yourcompany.ae`)

1. In the Netlify dashboard, navigate to **Site configuration &rarr; Domain management**.
2. Click **"Add a domain"** and enter your desired custom domain (e.g. `invoice.yourcompany.ae`).
3. In your DNS provider (e.g., GoDaddy, Cloudflare, Etisalat Domain Registrar):
   - Add a `CNAME` record pointing your subdomain (e.g., `invoice`) to your Netlify site URL (e.g., `omni-invoice-uae.netlify.app`).
4. Netlify will automatically provision a **free Let's Encrypt SSL/TLS certificate** for your domain.

---

## 4. Post-Deployment Verification Checklist

Once your Netlify site is live, verify the following core features:
- [ ] **Public Marketing Website:** Visit `/` and verify hero section, pricing table, UAE e-invoicing hub, and compliance architecture.
- [ ] **Customer SaaS Portal:** Navigate to `/app/dashboard` and verify UAE metrics, recent invoices, and compliance gauges.
- [ ] **UAE Tax Invoice Creation:** Go to `/app/invoices`, click **"Create Tax Invoice"**, select a customer (e.g., Etihad Airways Engineering), and verify the live 5% VAT calculation.
- [ ] **Luxury Invoice View:** Open the newly created invoice to inspect the executive bilingual letterhead, FTA TRN badge, line items, Article 59 VAT schedule, and authentic QR code.
- [ ] **Print / PDF Export:** Click **"Print Tax Invoice PDF"** & verify that clean A4 printing triggers without browser headers or background clutter.
- [ ] **UBL 2.1 XML Download:** Click **"Download UBL XML"** and verify that a valid Peppol PINT AE XML file (`INV-XXXX.xml`) is downloaded.
- [ ] **Super Admin Console:** Visit `/admin` to verify multi-tenant metrics and sandbox ASP connection status.
