import { describe, it, expect, beforeEach } from "vitest";
import { CompanyService } from "../../src/lib/services/company-service";

describe("Company Registration & Multi-Tenant Persistence Integration Tests", () => {
  const testUserId = "usr-test-registrant-01";
  const uniqueTrn = `100${Date.now().toString().slice(-12)}`;
  const testCompanyPayload = {
    legalNameEn: "Al Ain Apex Engineering LLC",
    legalNameAr: "شركة العين أبيكس للهندسة ذ.م.م",
    tradeLicenseNo: "CN-8849201",
    trn: uniqueTrn,
    taxScheme: "VAT",
    city: "Al Ain",
    emirate: "Abu Dhabi",
    addressEn: "Abu Baker Al Siddiq St, Al Ain - Abu Dhabi",
    addressAr: "شارع أبو بكر الصديق، العين - أبو ظبي",
    contactEmail: "admin@apex-engineering.ae",
    contactPhone: "+971564504650",
    isFreeZone: false,
    peppolEndpointId: uniqueTrn,
  };

  it("should successfully register a company with complete UAE VAT details and assign owner", async () => {
    const result = await CompanyService.registerCompany(testCompanyPayload, testUserId);

    expect(result.success).toBe(true);
    expect(result.company).toBeDefined();
    expect(result.company.id).toBeDefined();
    expect(result.company.legalNameEn).toBe("Al Ain Apex Engineering LLC");
    expect(result.company.trn).toBe(uniqueTrn);
    expect(result.company.city).toBe("Al Ain");
    expect(result.company.emirate).toBe("Abu Dhabi");

    const userCompanies = await CompanyService.getCompaniesByUserId(testUserId);
    expect(userCompanies.some((c) => c.id === result.company.id)).toBe(true);
  });

  it("should persist the newly registered company and retrieve it by user ID", async () => {
    const companies = await CompanyService.getCompaniesByUserId(testUserId);
    expect(companies.length).toBeGreaterThanOrEqual(1);

    const found = companies.find((c) => c.trn === testCompanyPayload.trn);
    expect(found).toBeDefined();
    expect(found?.legalNameEn).toBe("Al Ain Apex Engineering LLC");
    expect(found?.contactPhone).toBe("+971564504650");
  });

  it("should reject duplicate company registration with the same TRN", async () => {
    const duplicatePayload = {
      ...testCompanyPayload,
      legalNameEn: "Duplicate Attempt Corp",
    };

    await expect(CompanyService.registerCompany(duplicatePayload, testUserId)).rejects.toThrow(
      new RegExp(`TRN ${uniqueTrn} is already registered`, "i")
    );
  });

  it("should enforce tenant isolation so an unauthorized user cannot see this company", async () => {
    const otherUserId = "usr-unauthorized-stranger-99";
    const unauthorizedCompanies = await CompanyService.getCompaniesByUserId(otherUserId);

    const leak = unauthorizedCompanies.find((c) => c.trn === testCompanyPayload.trn);
    expect(leak).toBeUndefined();
  });

  it("should allow Super Admin with wildcard scope to access all companies", async () => {
    const superAdminUserId = "usr-super-admin";
    const allCompanies = await CompanyService.getCompaniesByUserId(superAdminUserId, true);

    const registeredCompany = allCompanies.find((c) => c.trn === testCompanyPayload.trn);
    expect(registeredCompany).toBeDefined();
  });
});
