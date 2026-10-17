"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { appConfig } from "@/lib/config/app-config";
import { invoicingStore, UserModel, UserRole } from "@/lib/store/invoicing-store";
import { COMPLIANCE_REGISTER } from "@/lib/compliance/compliance-register";
import {
  ShieldCheck,
  Building,
  Users,
  Activity,
  FileCheck2,
  Cpu,
  Layers,
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Server,
  Zap,
  Plus,
  Search,
  Lock,
  UserCheck,
  UserX,
  Eye,
  KeyRound,
  Edit2,
  Trash2,
  Check,
  X,
  ExternalLink,
  ChevronRight,
  Filter,
} from "lucide-react";

import { OmniLedgerLogo } from "@/components/brand/OmniLedgerLogo";

export default function AdminConsolePage() {
  const router = useRouter();

  // Store data
  const [refreshKey, setRefreshKey] = useState(0);
  const companies = invoicingStore.getCompanies();
  const users = invoicingStore.getUsers();
  const invoices = invoicingStore.getInvoices();
  const auditLogs = invoicingStore.getAuditLogs();
  const subscription = invoicingStore.getSubscription();

  const [activeTab, setActiveTab] = useState<
    "USERS" | "TENANTS" | "PROVIDERS" | "QUEUES" | "LOGS"
  >("USERS");

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [companyFilter, setCompanyFilter] = useState("ALL");
  const [roleFilter, setRoleFilter] = useState("ALL");

  // Modal states
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserModel | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // New User Form State
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("ClientSecure2026!");
  const [newUserRole, setNewUserRole] = useState<UserRole>("COMPANY_ADMIN");
  const [selectedCompanyIds, setSelectedCompanyIds] = useState<string[]>([]);
  const [newUserPhone, setNewUserPhone] = useState("+971 50 000 0000");

  // New Company Form State
  const [newCompNameEn, setNewCompNameEn] = useState("");
  const [newCompNameAr, setNewCompNameAr] = useState("");
  const [newCompTrn, setNewCompTrn] = useState("100");
  const [newCompCrn, setNewCompCrn] = useState("");
  const [newCompCity, setNewCompCity] = useState("Abu Dhabi");
  const [newCompEmirate, setNewCompEmirate] = useState("Abu Dhabi");
  const [newCompPrefix, setNewCompPrefix] = useState("INV-2026-");
  const [newCompEmail, setNewCompEmail] = useState("");

  const triggerRefresh = () => setRefreshKey((prev) => prev + 1);

  const showAlert = (msg: string) => {
    setAlertMessage(msg);
    setTimeout(() => setAlertMessage(null), 4000);
  };

  // Toggle company assignment for user
  const handleToggleCompany = (companyId: string) => {
    if (selectedCompanyIds.includes(companyId)) {
      setSelectedCompanyIds(selectedCompanyIds.filter((id) => id !== companyId));
    } else {
      setSelectedCompanyIds([...selectedCompanyIds, companyId]);
    }
  };

  // Submit New User
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();

    if (newUserRole !== "SUPER_ADMIN" && selectedCompanyIds.length === 0) {
      alert("Please assign at least one company to this client user.");
      return;
    }

    invoicingStore.createUser({
      name: newUserName,
      email: newUserEmail,
      password: newUserPassword,
      role: newUserRole,
      assignedCompanyIds: newUserRole === "SUPER_ADMIN" ? ["*"] : selectedCompanyIds,
      status: "ACTIVE",
      phoneNumber: newUserPhone,
      notes: `Client account created by Super Admin`,
    });

    setShowCreateUserModal(false);
    showAlert(`User ${newUserName} successfully created and restricted to selected companies.`);
    // Reset form
    setNewUserName("");
    setNewUserEmail("");
    setSelectedCompanyIds([]);
    triggerRefresh();
  };

  // Submit New Company
  const handleRegisterCompany = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newCompTrn.length !== 15 || !newCompTrn.startsWith("100")) {
      alert("UAE TRN must be exactly 15 digits and start with '100'.");
      return;
    }

    try {
      const res = await fetch("/api/v1/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          legalNameEn: newCompNameEn,
          legalNameAr: newCompNameAr || newCompNameEn,
          tradingName: newCompNameEn,
          trn: newCompTrn,
          crn: newCompCrn || `CR-${Date.now().toString().slice(-5)}`,
          currency: "AED",
          streetAddress: `Commercial Tower, ${newCompCity}`,
          city: newCompCity,
          emirate: newCompEmirate,
          contactEmail: newCompEmail || "finance@clientcompany.ae",
          contactPhone: "+971 4 000 0000",
          invoiceSequencePrefix: newCompPrefix.endsWith("-") ? newCompPrefix : `${newCompPrefix}-`,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to register company.");
        return;
      }

      setShowAddCompanyModal(false);
      showAlert(`Legal Entity ${data.data.legalNameEn} registered successfully and persisted.`);
      // Reset form
      setNewCompNameEn("");
      setNewCompNameAr("");
      setNewCompTrn("100");
      triggerRefresh();
    } catch {
      alert("Error submitting company registration request.");
    }
  };

  // Toggle user status
  const handleToggleUserStatus = (user: UserModel) => {
    const nextStatus = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    invoicingStore.updateUser(user.id, { status: nextStatus });
    showAlert(`User ${user.name} status updated to ${nextStatus}.`);
    triggerRefresh();
  };

  // Simulate login as client user
  const handleSimulateLogin = (user: UserModel) => {
    invoicingStore.setCurrentUser(user.id);
    router.push("/app/dashboard");
  };

  // Update existing user company access
  const handleSaveUserEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    invoicingStore.updateUser(editingUser.id, {
      role: editingUser.role,
      assignedCompanyIds: editingUser.role === "SUPER_ADMIN" ? ["*"] : editingUser.assignedCompanyIds,
      status: editingUser.status,
    });

    setEditingUser(null);
    showAlert(`Permissions for ${editingUser.name} updated.`);
    triggerRefresh();
  };

  // Filter users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;

    const matchesCompany =
      companyFilter === "ALL" ||
      u.assignedCompanyIds.includes("*") ||
      u.assignedCompanyIds.includes(companyFilter);

    return matchesSearch && matchesRole && matchesCompany;
  });

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case "SUPER_ADMIN":
        return <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px]">Super Admin</span>;
      case "COMPANY_ADMIN":
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold text-[10px]">Company Admin</span>;
      case "FINANCIAL_CONTROLLER":
        return <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 font-extrabold text-[10px]">Financial Controller</span>;
      case "BILLING_CLERK":
        return <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-900 font-extrabold text-[10px]">Billing Clerk</span>;
      case "AUDITOR":
        return <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800 font-extrabold text-[10px]">Auditor (Read-Only)</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans">
      {/* Top Admin Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-950 text-white px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <OmniLedgerLogo size="sm" showSubtitle={false} theme="dark" />
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-900/60 text-blue-300 border border-blue-700/50">
            Super Admin Console
          </span>
          <span className="text-xs text-slate-400 border-l border-slate-800 pl-3">
            Logged in as: <strong className="text-white">Kamran Ali</strong> (Super Admin)
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="text-slate-400 hidden sm:inline">
            Environment: <strong className="text-emerald-400">Production / Sandbox Dual</strong>
          </span>
          <Link
            href="/app/dashboard"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to SaaS App</span>
          </Link>
        </div>
      </header>

      {/* Alert Banner */}
      {alertMessage && (
        <div className="bg-emerald-600 text-white px-6 py-2.5 text-xs font-bold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>{alertMessage}</span>
          </div>
          <button onClick={() => setAlertMessage(null)}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Admin Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab("USERS")}
            className={`pb-3 transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === "USERS"
                ? "border-b-2 border-brand-900 text-brand-900 font-extrabold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Client Users & Company Access ({users.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("TENANTS")}
            className={`pb-3 transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === "TENANTS"
                ? "border-b-2 border-brand-900 text-brand-900 font-extrabold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Building className="h-4 w-4" />
            <span>Registered Legal Entities ({companies.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("PROVIDERS")}
            className={`pb-3 transition-colors shrink-0 ${
              activeTab === "PROVIDERS"
                ? "border-b-2 border-brand-900 text-brand-900 font-extrabold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Accredited Service Providers (ASP Gateway)
          </button>
          <button
            onClick={() => setActiveTab("QUEUES")}
            className={`pb-3 transition-colors shrink-0 ${
              activeTab === "QUEUES"
                ? "border-b-2 border-brand-900 text-brand-900 font-extrabold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Async Job Queues ({invoices.length})
          </button>
          <button
            onClick={() => setActiveTab("LOGS")}
            className={`pb-3 transition-colors shrink-0 ${
              activeTab === "LOGS"
                ? "border-b-2 border-brand-900 text-brand-900 font-extrabold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Platform Audit Trail
          </button>
        </div>

        {/* TAB 1: CLIENT USERS & ACCESS CONTROL (THE USER REQUESTED FEATURE) */}
        {activeTab === "USERS" && (
          <div className="space-y-6">
            {/* Top Stat Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="text-xs text-slate-500 font-medium">Total Platform Users</div>
                <div className="text-2xl font-black text-slate-900 mt-1">{users.length} Users</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {users.filter((u) => u.role !== "SUPER_ADMIN").length} Client Accounts
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="text-xs text-slate-500 font-medium">Company Isolation</div>
                <div className="text-2xl font-black text-emerald-700 mt-1">100% Enforced</div>
                <div className="text-[11px] text-emerald-700 mt-0.5">Zero Cross-Tenant Leakage</div>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="text-xs text-slate-500 font-medium">Available Legal Entities</div>
                <div className="text-2xl font-black text-slate-900 mt-1">{companies.length} Companies</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Mainland & Freezones</div>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="text-xs text-slate-500 font-medium">Active Super Admin</div>
                <div className="text-2xl font-black text-[#0F2B5C] mt-1">Kamran Ali</div>
                <div className="text-[11px] text-blue-700 font-medium mt-0.5">Unrestricted Master Access</div>
              </div>
            </div>

            {/* Toolbar: Search, Filters & Action Buttons */}
            <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search user name or email..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F2B5C]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={companyFilter}
                    onChange={(e) => setCompanyFilter(e.target.value)}
                    className="py-2 px-3 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0F2B5C]"
                  >
                    <option value="ALL">All Companies</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.legalNameEn}
                      </option>
                    ))}
                  </select>

                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="py-2 px-3 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0F2B5C]"
                  >
                    <option value="ALL">All Roles</option>
                    <option value="COMPANY_ADMIN">Company Admin</option>
                    <option value="FINANCIAL_CONTROLLER">Financial Controller</option>
                    <option value="BILLING_CLERK">Billing Clerk</option>
                    <option value="AUDITOR">Auditor</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <button
                  onClick={() => setShowAddCompanyModal(true)}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-800 transition-colors flex items-center gap-1.5"
                >
                  <Building className="h-3.5 w-3.5 text-blue-700" />
                  <span>+ Add Client Company</span>
                </button>
                <button
                  onClick={() => setShowCreateUserModal(true)}
                  className="px-4 py-2 rounded-xl bg-[#0F2B5C] hover:bg-[#1E40AF] text-xs font-bold text-white transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="h-4 w-4" />
                  <span>+ Create Client User</span>
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">
                  Client Users & Authorized Company Scopes ({filteredUsers.length})
                </span>
                <span className="text-slate-500">
                  Each user is restricted strictly to their assigned companies below
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Assigned Company Scope (Strict Access)</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredUsers.map((u) => {
                      const isSuper = u.role === "SUPER_ADMIN";
                      const assignedComps = isSuper
                        ? companies
                        : companies.filter((c) => u.assignedCompanyIds.includes(c.id));

                      return (
                        <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                          {/* User Name & Email */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                                isSuper
                                  ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                                  : "bg-blue-100 text-blue-900 border border-blue-200"
                              }`}>
                                {u.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .slice(0, 2)
                                  .join("")}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                  <span>{u.name}</span>
                                  {isSuper && (
                                    <span className="text-[9px] bg-emerald-50 text-emerald-800 px-1 rounded font-bold">
                                      Owner
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-500 font-mono">{u.email}</div>
                              </div>
                            </div>
                          </td>

                          {/* Role */}
                          <td className="py-3.5 px-4">{getRoleBadge(u.role)}</td>

                          {/* Assigned Companies (THE CORE SCOPE) */}
                          <td className="py-3.5 px-4">
                            {isSuper ? (
                              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                                <span>🌐 All Registered Companies (Master Access)</span>
                              </div>
                            ) : assignedComps.length > 0 ? (
                              <div className="space-y-1">
                                {assignedComps.map((c) => (
                                  <div
                                    key={c.id}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50/70 text-blue-950 text-[11px] font-bold border border-blue-200 mr-1.5"
                                  >
                                    <Building className="h-3 w-3 text-blue-700 shrink-0" />
                                    <span>{c.legalNameEn}</span>
                                    <span className="font-mono text-[10px] text-slate-500">
                                      (TRN: {c.trn})
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-rose-600 font-bold text-[11px] flex items-center gap-1">
                                <AlertTriangle className="h-3.5 w-3.5" /> No companies assigned (Cannot view data)
                              </span>
                            )}
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => handleToggleUserStatus(u)}
                              disabled={isSuper}
                              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                                u.status === "ACTIVE"
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                                  : "bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100"
                              } ${isSuper ? "cursor-default" : "cursor-pointer"}`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  u.status === "ACTIVE" ? "bg-emerald-500" : "bg-rose-500"
                                }`}
                              ></span>
                              <span>{u.status}</span>
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="inline-flex items-center gap-2">
                              {/* Simulate Login As Client User */}
                              <button
                                onClick={() => handleSimulateLogin(u)}
                                title="Log in as this client user to verify their scoped company view"
                                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#0F2B5C] hover:text-white text-slate-700 text-[11px] font-bold transition-colors flex items-center gap-1"
                              >
                                <Eye className="h-3 w-3" />
                                <span>Test View</span>
                              </button>

                              {/* Edit Access */}
                              {!isSuper && (
                                <button
                                  onClick={() => setEditingUser(u)}
                                  title="Edit assigned companies"
                                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-blue-700"
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </button>
                              )}

                              {/* Delete */}
                              {!isSuper && (
                                <button
                                  onClick={() => {
                                    if (confirm(`Are you sure you want to delete user ${u.name}?`)) {
                                      invoicingStore.deleteUser(u.id);
                                      showAlert(`User ${u.name} deleted.`);
                                      triggerRefresh();
                                    }
                                  }}
                                  title="Delete user"
                                  className="p-1 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TENANTS & REGISTERED COMPANIES */}
        {activeTab === "TENANTS" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">UAE Legal Entities & Trade Licenses</h3>
                <p className="text-xs text-slate-500">All registered companies available for client user assignment</p>
              </div>
              <button
                onClick={() => setShowAddCompanyModal(true)}
                className="px-3.5 py-2 rounded-xl bg-[#0F2B5C] text-white text-xs font-bold hover:bg-[#1E40AF] transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>+ Register New Legal Entity</span>
              </button>
            </div>

            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                    <th className="py-3 px-4">Company Name (English / Arabic)</th>
                    <th className="py-3 px-4">UAE TRN</th>
                    <th className="py-3 px-4">Trade License / CRN</th>
                    <th className="py-3 px-4">Emirate / City</th>
                    <th className="py-3 px-4">Invoice Sequence</th>
                    <th className="py-3 px-4">Assigned Users</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {companies.map((c) => {
                    const assignedUserCount = users.filter(
                      (u) => u.assignedCompanyIds.includes("*") || u.assignedCompanyIds.includes(c.id)
                    ).length;

                    return (
                      <tr key={c.id} className="hover:bg-slate-50/50">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{c.legalNameEn}</div>
                          <div className="text-[11px] text-slate-500 font-arabic">{c.legalNameAr}</div>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-[#0F2B5C]">{c.trn}</td>
                        <td className="py-3.5 px-4 font-mono text-slate-500">{c.crn}</td>
                        <td className="py-3.5 px-4">{c.city} ({c.emirate})</td>
                        <td className="py-3.5 px-4 font-mono text-slate-600 font-bold">
                          {c.invoiceSequencePrefix}{c.currentInvoiceSequence}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 text-[10px] font-bold">
                            {assignedUserCount} Users with access
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                            ACTIVE
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: PROVIDERS */}
        {activeTab === "PROVIDERS" && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">UAE MoF Accredited Service Provider Adapters</h3>
                  <p className="text-xs text-slate-500">Configured Peppol Access Point connections</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                  Sandbox Active
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-900">OMNI_ASP_SANDBOX (Active)</span>
                  <p className="text-slate-600 text-[11px]">
                    Internal test adapter generating valid UBL 2.1 XML and simulated access point transmission references.
                  </p>
                  <div className="pt-2 text-[11px] font-mono text-slate-500">
                    Endpoint: https://sandbox.asp.omni-einvoice.ae/v1
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 opacity-60">
                  <span className="font-bold text-slate-900">UAE Production ASP Connector (Model A)</span>
                  <p className="text-slate-600 text-[11px]">
                    Commercial integration to verified accredited partner. Requires commercial API keys and client certificates.
                  </p>
                  <div className="pt-2 text-[11px] font-mono text-amber-700 font-bold">
                    Status: Configurable upon partner contract execution
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: QUEUES */}
        {activeTab === "QUEUES" && (
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-bold text-slate-900">Live Invoices & ASP Transmission Submissions</span>
              <span className="text-slate-500">Total queued/processed: {invoices.length}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                    <th className="py-2">Invoice #</th>
                    <th className="py-2">Company</th>
                    <th className="py-2">Buyer</th>
                    <th className="py-2 text-right">Amount (AED)</th>
                    <th className="py-2">PINT AE Status</th>
                    <th className="py-2">Exchange Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoices.map((inv) => (
                    <tr key={inv.id}>
                      <td className="py-2 font-mono font-bold text-slate-900">{inv.invoiceNumber}</td>
                      <td className="py-2 text-slate-600">{inv.companyId}</td>
                      <td className="py-2">{inv.customerName}</td>
                      <td className="py-2 text-right font-mono font-bold">{inv.totalAmount.toFixed(2)}</td>
                      <td className="py-2">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-2 font-mono text-[11px] text-slate-500">{inv.exchangeStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: AUDIT LOGS */}
        {activeTab === "LOGS" && (
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-bold text-slate-900">Immutable Audit Trail</span>
              <span className="text-slate-500">Security & RBAC Events</span>
            </div>
            <div className="space-y-2">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#0F2B5C]">{log.action}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-600 font-semibold">{log.resourceType}: {log.resourceId}</span>
                    </div>
                    <p className="text-slate-500 text-[11px]">{log.details}</p>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono text-right shrink-0">
                    {new Date(log.timestamp).toLocaleString("en-US", { hour12: true })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: CREATE CLIENT USER (THE USER REQUESTED FEATURE) */}
      {showCreateUserModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-900 text-[10px] font-bold mb-1">
                  <Lock className="h-3 w-3" />
                  <span>Strict Company Isolation</span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">Create Client User</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Set user login credentials and strictly assign which companies they can access.
                </p>
              </div>
              <button
                onClick={() => setShowCreateUserModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="e.g. Fatima Al-Nuaimi"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#0F2B5C]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Corporate Email Address *</label>
                  <input
                    type="email"
                    required
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="fatima@clientcompany.ae"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#0F2B5C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Initial Password *</label>
                  <input
                    type="text"
                    required
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#0F2B5C]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Role / Permissions *</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0F2B5C]"
                  >
                    <option value="COMPANY_ADMIN">Company Admin (Full Management)</option>
                    <option value="FINANCIAL_CONTROLLER">Financial Controller (Approve & Transmit)</option>
                    <option value="BILLING_CLERK">Billing Clerk (Draft Invoices)</option>
                    <option value="AUDITOR">Auditor (Read-Only Inspection)</option>
                  </select>
                </div>
              </div>

              {/* CRITICAL: ASSIGNED COMPANY ACCESS CHECKBOXES */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-900">
                    Assign Company Access Scope (Strictly Enforced) *
                  </label>
                  <span className="text-[10px] text-blue-700 font-bold">
                    {selectedCompanyIds.length} Selected
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Select which legal entity this client user is permitted to see. They will have ZERO access to any other company.
                </p>

                <div className="rounded-xl border border-slate-200 p-3 bg-slate-50 space-y-2 max-h-48 overflow-y-auto">
                  {companies.map((c) => {
                    const isChecked = selectedCompanyIds.includes(c.id);
                    return (
                      <label
                        key={c.id}
                        className={`flex items-start gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                          isChecked ? "bg-white border border-blue-200 shadow-2xs" : "hover:bg-slate-100"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleCompany(c.id)}
                          className="mt-1 h-4 w-4 rounded accent-[#0F2B5C]"
                        />
                        <div className="flex-1">
                          <div className="font-bold text-slate-900 text-xs">{c.legalNameEn}</div>
                          <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                            <span>TRN: <strong className="font-mono text-slate-700">{c.trn}</strong></span>
                            <span>•</span>
                            <span>{c.city}</span>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateUserModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0F2B5C] hover:bg-[#1E40AF] text-white font-bold shadow-md shadow-blue-950/15"
                >
                  Create & Grant Scoped Access
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: REGISTER NEW LEGAL ENTITY */}
      {showAddCompanyModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Register New UAE Client Company</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Add a new client entity so you can assign users and manage compliant e-invoicing for them.
                </p>
              </div>
              <button
                onClick={() => setShowAddCompanyModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterCompany} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Company Legal Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={newCompNameEn}
                    onChange={(e) => setNewCompNameEn(e.target.value)}
                    placeholder="e.g. Al-Mansoor Global Trading LLC"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#0F2B5C]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Company Legal Name (Arabic)</label>
                  <input
                    type="text"
                    value={newCompNameAr}
                    onChange={(e) => setNewCompNameAr(e.target.value)}
                    placeholder="شركة المنصور للتجارة العامة ذ.م.م"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-arabic focus:outline-none focus:ring-2 focus:ring-[#0F2B5C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">15-Digit UAE TRN *</label>
                  <input
                    type="text"
                    required
                    maxLength={15}
                    value={newCompTrn}
                    onChange={(e) => setNewCompTrn(e.target.value)}
                    placeholder="100XXXXXXXXXXXX"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#0F2B5C]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Trade License / CRN</label>
                  <input
                    type="text"
                    value={newCompCrn}
                    onChange={(e) => setNewCompCrn(e.target.value)}
                    placeholder="e.g. CN-499120"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#0F2B5C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Emirate / Jurisdiction</label>
                  <select
                    value={newCompEmirate}
                    onChange={(e) => {
                      setNewCompEmirate(e.target.value);
                      setNewCompCity(e.target.value);
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0F2B5C]"
                  >
                    <option value="Abu Dhabi">Abu Dhabi</option>
                    <option value="Dubai">Dubai</option>
                    <option value="Sharjah">Sharjah</option>
                    <option value="Ajman">Ajman</option>
                    <option value="Ras Al Khaimah">Ras Al Khaimah</option>
                    <option value="Fujairah">Fujairah</option>
                    <option value="Umm Al Quwain">Umm Al Quwain</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Invoice Numbering Prefix</label>
                  <input
                    type="text"
                    required
                    value={newCompPrefix}
                    onChange={(e) => setNewCompPrefix(e.target.value)}
                    placeholder="e.g. MNS-2026-"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#0F2B5C]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddCompanyModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0F2B5C] hover:bg-[#1E40AF] text-white font-bold shadow-md shadow-blue-950/15"
                >
                  Register Legal Entity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: EDIT USER COMPANY ACCESS */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Edit Access for {editingUser.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 font-mono">{editingUser.email}</p>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUserEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">User Role</label>
                <select
                  value={editingUser.role}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, role: e.target.value as UserRole })
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0F2B5C]"
                >
                  <option value="COMPANY_ADMIN">Company Admin (Full Management)</option>
                  <option value="FINANCIAL_CONTROLLER">Financial Controller (Approve & Transmit)</option>
                  <option value="BILLING_CLERK">Billing Clerk (Draft Invoices)</option>
                  <option value="AUDITOR">Auditor (Read-Only Inspection)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-900 mb-1">
                  Permitted Companies (Strict Isolation)
                </label>
                <div className="rounded-xl border border-slate-200 p-3 bg-slate-50 space-y-2 max-h-48 overflow-y-auto">
                  {companies.map((c) => {
                    const isChecked = editingUser.assignedCompanyIds.includes(c.id);
                    return (
                      <label
                        key={c.id}
                        className={`flex items-start gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                          isChecked ? "bg-white border border-blue-200 shadow-2xs" : "hover:bg-slate-100"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            const newIds = isChecked
                              ? editingUser.assignedCompanyIds.filter((id) => id !== c.id)
                              : [...editingUser.assignedCompanyIds, c.id];
                            setEditingUser({ ...editingUser, assignedCompanyIds: newIds });
                          }}
                          className="mt-1 h-4 w-4 rounded accent-[#0F2B5C]"
                        />
                        <div className="flex-1">
                          <div className="font-bold text-slate-900 text-xs">{c.legalNameEn}</div>
                          <div className="text-[10px] text-slate-500">TRN: {c.trn} • {c.city}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0F2B5C] hover:bg-[#1E40AF] text-white font-bold shadow-md shadow-blue-950/15"
                >
                  Save Permissions
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
