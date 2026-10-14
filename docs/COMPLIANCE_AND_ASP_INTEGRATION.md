# UAE E-Invoicing Compliance & Accredited Service Provider Integration Guide

---

## 1. Regulatory Context

The United Arab Emirates Ministry of Finance (MoF) and the Federal Tax Authority (FTA) have mandated structured electronic invoicing under a Decentralized Continuous Transaction Controls with Exchange (DCTCE) framework based on Peppol International (PINT) standards.

### Legal Foundations
- **Federal Decree-Law No. 8 of 2017 on Value Added Tax**
- **Executive Regulation of Federal Decree-Law No. 8 of 2017**
- **UAE MoF Electronic Invoicing Technical Standard v1.0**

---

## 2. Business Model Architecture: Model A vs Model B

OmniInvoice UAE is architected to support two distinct operating models:

### Model A: Partner with an Accredited Service Provider (ASP) — [Recommended Initial Path]
In this model, OmniInvoice acts as the financial operating system, tax engine, and ERP middleware for the taxpayer:
1. OmniInvoice generates the canonical document and validates all business rules.
2. OmniInvoice synthesizes the official Peppol PINT AE UBL 2.1 XML document and computes the SHA-256 digest.
3. OmniInvoice transmits the document to an accredited ASP Access Point (via `IProviderAdapter`).
4. The ASP Access Point performs transmission to the buyer's access point and reports transaction metadata to the UAE Tax Repository.
5. Status acknowledgements and reporting confirmations return to OmniInvoice via webhooks.

### Model B: Build Toward Direct Accreditation
Under Model B, OmniInvoice operates directly as an accredited Peppol Access Point:
- **Prerequisites for Model B:**
  - OpenPeppol Access Point Service Provider accreditation and cryptographic certificates.
  - Formal UAE Ministry of Finance ASP accreditation and technical conformance testing.
  - 24/7 high-availability operational NOC in the UAE.
  - ISO/IEC 27001 certification and independent third-party penetration testing.
  - Commercial bank guarantee and continuous insurance coverage.

> [!IMPORTANT]
> Until direct accreditation is officially conferred by the UAE Ministry of Finance, OmniInvoice UAE operates strictly under **Model A**, utilizing its verified `SandboxProviderAdapter` for pre-flight testing and commercial ASP adapters for production delivery.

---

## 3. UAE PINT AE Profile Mapping

| Field | Source Field | Target UBL 2.1 PINT Element | Rule Reference |
|---|---|---|---|
| Specification Profile | Constant | `cbc:CustomizationID` = `urn:peppol:pint:billing-3@ae-1` | BR-01 |
| Process Identifier | Constant | `cbc:ProfileID` = `urn:peppol:bis:billing` | BR-01 |
| Invoice Number | `invoice.invoiceNumber` | `cbc:ID` | BR-01 |
| Document Type | `invoice.invoiceType` | `cbc:InvoiceTypeCode` (`388` for Tax Invoice, `381` for Credit Note) | BR-03 |
| Supplier TRN | `company.trn` | `cac:AccountingSupplierParty/cac:Party/cbc:EndpointID[@schemeID='0230']` | BR-AE-01 |
| Supplier Country | `company.countryCode` | `cac:PostalAddress/cac:Country/cbc:IdentificationCode` = `AE` | BR-AE-02 |
| Buyer Identification | `customer.trn` | `cac:AccountingCustomerParty/cac:Party/cbc:EndpointID` | BR-07 |
| Tax Category | `line.taxCategory` | `cac:ClassifiedTaxCategory/cbc:ID` (`S`, `Z`, `E`, `O`) | BR-CO-05 |
| Tax Rate | `line.taxRatePercent` | `cac:ClassifiedTaxCategory/cbc:Percent` (`5.00`) | BR-CO-05 |
| Monetary Total | Calculated | `cac:LegalMonetaryTotal/cbc:PayableAmount` | BR-CO-10 |
| Cryptographic Hash | Computed SHA-256 | Metadata envelope & QR Code payload | BR-HASH-01 |

---

## 4. Production Readiness Checklist & Blockers

Before connecting a live UAE enterprise to production endpoints:
- [x] Canonical invoice model implemented and tested.
- [x] Decimal arithmetic and fils rounding verified (no floating point errors).
- [x] Sequential invoice numbering series enforced without gaps.
- [x] Schematron business rules verified (`BR-AE-01`, `BR-AE-02`, `BR-CO-03`, `BR-CO-10`).
- [x] Sandbox ASP adapter functional with idempotency and webhook HMAC signatures.
- [ ] Commercial agreement executed with an official UAE MoF Accredited Service Provider.
- [ ] Production ASP API credentials and client TLS certificate installed in secure secret vault.
- [ ] Taxpayer company TRN registered and verified on the UAE FTA EmaraTax portal.
