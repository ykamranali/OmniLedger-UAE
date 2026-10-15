// OmniInvoice UAE - Multi-Tenant & Company Isolation Integration Tests
import { describe, it, expect } from "vitest";
import { InvoiceService } from "../../src/lib/services/invoice-service";
import { AuthSessionPayload } from "../../src/lib/auth/session";

describe("Tenant & Company Scoping Isolation", () => {
  const superAdminSession: AuthSessionPayload = {
    userId: "usr-super-admin",
    email: "kamran.a@ramtechuae.com",
    fullName: "Kamran Ali",
    isSuperAdmin: true,
    tenantId: "tenant-omni-01",
    tenantSlug: "omni-tenant",
    role: "SUPER_ADMIN",
    permissions: ["*"],
    companyIds: ["*"],
    mfaVerified: true,
    sessionId: "sess_super",
  };

  const gulfClientSession: AuthSessionPayload = {
    userId: "usr-gulf-admin",
    email: "saeed@gulfhorizon.ae",
    fullName: "Saeed Al-Maktoum",
    isSuperAdmin: false,
    tenantId: "tenant-omni-01",
    tenantSlug: "omni-tenant",
    role: "COMPANY_ADMIN",
    permissions: ["invoice:read", "invoice:create"],
    companyIds: ["comp-auh-02"], // STRICTLY GULF HORIZON LOGISTICS ONLY
    mfaVerified: true,
    sessionId: "sess_gulf",
  };

  it("permits client user to fetch invoices for their assigned company", async () => {
    const invoices = await InvoiceService.getInvoices(gulfClientSession, "comp-auh-02");
    expect(Array.isArray(invoices)).toBe(true);
  });

  it("strictly blocks client user from accessing unassigned company data (cross-company breach prevention)", async () => {
    await expect(
      InvoiceService.getInvoices(gulfClientSession, "comp-dxb-01")
    ).rejects.toThrow(/UNAUTHORIZED: You do not have permission to access company entity \[comp-dxb-01\]/);
  });

  it("allows super admin unrestricted access across all companies", async () => {
    const dxbInvoices = await InvoiceService.getInvoices(superAdminSession, "comp-dxb-01");
    const auhInvoices = await InvoiceService.getInvoices(superAdminSession, "comp-auh-02");
    expect(Array.isArray(dxbInvoices)).toBe(true);
    expect(Array.isArray(auhInvoices)).toBe(true);
  });

  it("blocks editing of issued invoices (Financial Immutability Rule)", async () => {
    // Find an issued invoice in the system (e.g. inv-002)
    const issuedInvoice = await InvoiceService.getInvoiceById(superAdminSession, "inv-002");
    expect(issuedInvoice).not.toBeNull();
    expect(issuedInvoice?.status).toBe("ISSUED");

    await expect(
      InvoiceService.updateDraft(superAdminSession, "inv-002", {
        notes: "Attempted illegal modification after issuance",
      })
    ).rejects.toThrow(/IMMUTABILITY VIOLATION: Invoices with status ISSUED cannot be edited/);
  });

  it("blocks deletion of issued invoices (Document Retention Rule)", async () => {
    await expect(
      InvoiceService.deleteDraft(superAdminSession, "inv-002")
    ).rejects.toThrow(/IMMUTABILITY RULE: Cannot delete non-draft invoice/);
  });
});
