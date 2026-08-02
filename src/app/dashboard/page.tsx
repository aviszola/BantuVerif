"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  LayoutGrid,
  FileText,
  CheckCircle2,
  History,
  Settings,
  Plus,
  Download,
  Headphones,
  Users,
  Clock,
  Info,
  Eye,
  Home,
  GraduationCap,
  Briefcase,
  Bell,
  User,
  ArrowRight,
  X,
  FilePlus,
  Shield,
  Share2,
  Globe,
} from "lucide-react";

type NavItem = "overview" | "applications" | "eligibility" | "history" | "settings";

export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState<NavItem>("overview");
  const [isNewAppModalOpen, setIsNewAppModalOpen] = useState(false);
  const [appSubmitted, setAppSubmitted] = useState(false);

  // New Application Form State
  const [formCategory, setFormCategory] = useState("BLT Sembako");
  const [formNotes, setFormNotes] = useState("");

  const handleCreateApp = (e: React.FormEvent) => {
    e.preventDefault();
    setAppSubmitted(true);
    setTimeout(() => {
      setAppSubmitted(false);
      setIsNewAppModalOpen(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-body flex flex-col justify-between selection:bg-[#2563eb] selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#e2e8f0]">
        <div className="max-w-[1280px] mx-auto px-6 h-18 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-primary-container rounded-lg flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="font-display font-extrabold text-xl tracking-tight text-on-surface">
              Bantu<span className="text-primary-container">Verif</span>
            </span>
          </Link>

          {/* Top Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/dashboard"
              className="text-[15px] font-semibold text-primary-container border-b-2 border-primary-container pb-0.5"
            >
              Dashboard
            </Link>
            <a
              href="#applications"
              className="text-[15px] font-medium text-on-surface-variant hover:text-primary-container transition-colors"
            >
              Applications
            </a>
            <a
              href="#history"
              className="text-[15px] font-medium text-on-surface-variant hover:text-primary-container transition-colors"
            >
              History
            </a>
            <a
              href="#faq"
              className="text-[15px] font-medium text-on-surface-variant hover:text-primary-container transition-colors"
            >
              FAQ
            </a>
          </nav>

          {/* User & Notification Controls */}
          <div className="flex items-center gap-4">
            <button
              title="Notifications"
              className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-[#f2f4f6] transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
            </button>

            <div className="flex items-center gap-2.5 pl-2 border-l border-[#e2e8f0]">
              <div className="w-9 h-9 rounded-full bg-[#2563eb]/10 text-[#2563eb] border border-[#2563eb]/20 flex items-center justify-center font-bold text-sm">
                <User className="w-5 h-5" />
              </div>
              <span className="font-semibold text-sm text-on-surface hidden sm:inline-block">
                Sarah
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-[1280px] mx-auto px-6 py-8 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar */}
          <aside className="lg:col-span-3 bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-2xs">
            <div className="text-[11px] font-bold tracking-widest text-[#737686] uppercase mb-4 px-3">
              CITIZEN PORTAL
            </div>

            <nav className="flex flex-col gap-1 mb-8">
              <button
                onClick={() => setActiveNav("overview")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  activeNav === "overview"
                    ? "bg-[#2563eb] text-white shadow-sm"
                    : "text-on-surface-variant hover:bg-[#f2f4f6] hover:text-on-surface"
                }`}
              >
                <LayoutGrid className="w-4.5 h-4.5" />
                <span>Overview</span>
              </button>

              <button
                onClick={() => setActiveNav("applications")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  activeNav === "applications"
                    ? "bg-[#2563eb] text-white shadow-sm"
                    : "text-on-surface-variant hover:bg-[#f2f4f6] hover:text-on-surface"
                }`}
              >
                <FileText className="w-4.5 h-4.5" />
                <span>My Applications</span>
              </button>

              <button
                onClick={() => setActiveNav("eligibility")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  activeNav === "eligibility"
                    ? "bg-[#2563eb] text-white shadow-sm"
                    : "text-on-surface-variant hover:bg-[#f2f4f6] hover:text-on-surface"
                }`}
              >
                <CheckCircle2 className="w-4.5 h-4.5" />
                <span>Eligibility</span>
              </button>

              <button
                onClick={() => setActiveNav("history")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  activeNav === "history"
                    ? "bg-[#2563eb] text-white shadow-sm"
                    : "text-on-surface-variant hover:bg-[#f2f4f6] hover:text-on-surface"
                }`}
              >
                <History className="w-4.5 h-4.5" />
                <span>History</span>
              </button>

              <button
                onClick={() => setActiveNav("settings")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  activeNav === "settings"
                    ? "bg-[#2563eb] text-white shadow-sm"
                    : "text-on-surface-variant hover:bg-[#f2f4f6] hover:text-on-surface"
                }`}
              >
                <Settings className="w-4.5 h-4.5" />
                <span>Settings</span>
              </button>
            </nav>

            <button
              onClick={() => setIsNewAppModalOpen(true)}
              className="btn-48 w-full rounded-xl font-semibold text-sm bg-[#2563eb] text-white hover:bg-[#1d4ed8] shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4.5 h-4.5" />
              <span>New Application</span>
            </button>
          </aside>

          {/* Main Dashboard Content */}
          <main className="lg:col-span-9 space-y-8">
            {/* Top Greeting Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-[34px] font-bold font-display text-on-surface tracking-tight">
                  Good morning, Sarah
                </h1>
                <p className="text-sm text-on-surface-variant mt-1">
                  Your citizen profile is 85% complete. You have 2 pending tasks.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button className="h-10 px-4 rounded-xl border border-[#e2e8f0] bg-white text-xs font-semibold text-on-surface hover:bg-[#f2f4f6] transition-all flex items-center gap-2 shadow-2xs">
                  <Download className="w-4 h-4 text-on-surface-variant" />
                  <span>Download History</span>
                </button>

                <button className="h-10 px-4 rounded-xl border border-[#e2e8f0] bg-white text-xs font-semibold text-on-surface hover:bg-[#f2f4f6] transition-all flex items-center gap-2 shadow-2xs">
                  <Headphones className="w-4 h-4 text-on-surface-variant" />
                  <span>Contact Support</span>
                </button>
              </div>
            </div>

            {/* Grid Row 1: Active Progress (8 cols) + Updates (4 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-stretch">
              {/* Community Verification Card (8 cols) */}
              <div className="lg:col-span-8 bg-white border border-[#e2e8f0] rounded-2xl p-7 shadow-level1 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#eff6ff] text-[#2563eb] border border-[#dbeafe]">
                      IN PROGRESS
                    </span>
                    <div className="text-right">
                      <div className="text-lg font-bold text-[#2563eb] font-display">Step 3/4</div>
                      <div className="text-xs text-on-surface-variant">Expected: 2 Days</div>
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold font-display text-on-surface mb-1">
                    Community Verification
                  </h2>
                  <div className="text-xs text-on-surface-variant mb-8">
                    Application ID: #BANTU-2024-8842
                  </div>

                  {/* 4-Step Progress Rail */}
                  <div className="relative mb-8">
                    {/* Connecting Line */}
                    <div className="absolute top-5 left-6 right-6 h-0.5 bg-[#e2e8f0] z-0">
                      <div className="h-full bg-[#2563eb] w-3/4 transition-all duration-500"></div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 relative z-10 text-center">
                      {/* Step 1: Identity */}
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-2 shadow-sm">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-on-surface">Identity</span>
                      </div>

                      {/* Step 2: Documents */}
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-2 shadow-sm">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-on-surface">Documents</span>
                      </div>

                      {/* Step 3: Verification */}
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-[#2563eb] text-white flex items-center justify-center mb-2 shadow-[0_0_0_4px_rgba(37,99,235,0.2)]">
                          <Users className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-[#2563eb]">Verification</span>
                      </div>

                      {/* Step 4: Finalize */}
                      <div className="flex flex-col items-center opacity-60">
                        <div className="w-10 h-10 rounded-full bg-[#eceef0] text-[#737686] flex items-center justify-center mb-2">
                          <Clock className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-medium text-on-surface-variant">Finalize</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Next Action Required Box */}
                <div className="bg-[#f2f4f6] rounded-xl p-4 border border-[#e2e8f0]/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-[#2563eb]/10 text-[#2563eb] flex items-center justify-center shrink-0 mt-0.5">
                      <Info className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-on-surface">Next Action Required</div>
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        Please schedule a 10-minute video call with your community leader to finalize the verification process.
                      </p>
                    </div>
                  </div>

                  <button className="h-9 px-4 rounded-lg bg-[#2563eb] text-white text-xs font-semibold hover:bg-[#1d4ed8] transition-colors shrink-0 shadow-2xs">
                    Schedule Call
                  </button>
                </div>
              </div>

              {/* Updates Card (4 cols) */}
              <div className="lg:col-span-4 bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-level1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#e2e8f0]">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg font-display text-on-surface">Updates</h3>
                      <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center">
                        2
                      </span>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {/* Item 1 */}
                    <div className="flex items-start gap-3 text-xs">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb] shrink-0 mt-1"></span>
                      <div>
                        <div className="font-bold text-on-surface text-sm mb-0.5">Verification update</div>
                        <p className="text-on-surface-variant leading-relaxed mb-1">
                          Your community leader has acknowledged your request. Initial screening complete.
                        </p>
                        <span className="text-[11px] text-[#737686]">10 minutes ago</span>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="flex items-start gap-3 text-xs">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0 mt-1"></span>
                      <div>
                        <div className="font-bold text-on-surface text-sm mb-0.5">New document required</div>
                        <p className="text-on-surface-variant leading-relaxed mb-1">
                          Proof of residency is outdated. Please upload a utility bill from the last 3 months.
                        </p>
                        <span className="text-[11px] text-[#737686]">2 hours ago</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button className="mt-6 pt-3 border-t border-[#e2e8f0] text-center text-xs font-semibold text-on-surface-variant hover:text-primary-container transition-colors w-full">
                  Clear all notifications
                </button>
              </div>
            </div>

            {/* Grid Row 2: Application History Table (8 cols) + Eligibility Guide (4 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-stretch">
              {/* Application History Table Card (8 cols) */}
              <div className="lg:col-span-8 bg-white border border-[#e2e8f0] rounded-2xl p-7 shadow-level1">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-xl font-display text-on-surface">
                    Application History
                  </h3>
                  <button className="text-xs font-bold text-[#2563eb] hover:underline">
                    View All
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#e2e8f0] text-[#737686] uppercase font-bold tracking-wider">
                        <th className="pb-3 font-semibold">SERVICE</th>
                        <th className="pb-3 font-semibold">SUBMITTED</th>
                        <th className="pb-3 font-semibold">STATUS</th>
                        <th className="pb-3 font-semibold text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e2e8f0]/60">
                      {/* Row 1 */}
                      <tr className="hover:bg-[#f8fafc] transition-colors">
                        <td className="py-4 font-semibold text-on-surface">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#f2f4f6] flex items-center justify-center text-on-surface-variant">
                              <Home className="w-4 h-4" />
                            </div>
                            <span>Residential Grant</span>
                          </div>
                        </td>
                        <td className="py-4 text-on-surface-variant">Oct 12, 2023</td>
                        <td className="py-4">
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Approved
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <button className="w-7 h-7 rounded-md hover:bg-[#eceef0] inline-flex items-center justify-center text-on-surface-variant">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>

                      {/* Row 2 */}
                      <tr className="hover:bg-[#f8fafc] transition-colors">
                        <td className="py-4 font-semibold text-on-surface">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#f2f4f6] flex items-center justify-center text-on-surface-variant">
                              <GraduationCap className="w-4 h-4" />
                            </div>
                            <span>Education Waiver</span>
                          </div>
                        </td>
                        <td className="py-4 text-on-surface-variant">Aug 24, 2023</td>
                        <td className="py-4">
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            Completed
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <button className="w-7 h-7 rounded-md hover:bg-[#eceef0] inline-flex items-center justify-center text-on-surface-variant">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>

                      {/* Row 3 */}
                      <tr className="hover:bg-[#f8fafc] transition-colors">
                        <td className="py-4 font-semibold text-on-surface">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#f2f4f6] flex items-center justify-center text-on-surface-variant">
                              <Briefcase className="w-4 h-4" />
                            </div>
                            <span>Health Card Renewal</span>
                          </div>
                        </td>
                        <td className="py-4 text-on-surface-variant">Jan 05, 2024</td>
                        <td className="py-4">
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            Pending
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <button className="w-7 h-7 rounded-md hover:bg-[#eceef0] inline-flex items-center justify-center text-on-surface-variant">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Eligibility Guide Banner Card (4 cols) */}
              <div className="lg:col-span-4 rounded-2xl overflow-hidden relative border border-[#e2e8f0] shadow-level1 group flex flex-col justify-end p-6 min-h-[260px]">
                <Image
                  src="/eligibility-banner.png"
                  alt="Eligibility Guide"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 z-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1d4ed8]/90 via-[#2563eb]/70 to-transparent z-10"></div>

                <div className="relative z-20 text-white">
                  <h3 className="font-bold text-xl font-display mb-2 text-white">
                    Eligibility Guide
                  </h3>
                  <p className="text-xs text-white/80 leading-relaxed mb-4">
                    Learn about the new criteria for 2024 housing subsidies and digital literacy programs.
                  </p>

                  <a
                    href="#"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:underline"
                  >
                    <span>Read Guide</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-[#e2e8f0] pt-12 pb-8 text-xs text-on-surface-variant mt-12">
        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="font-bold text-sm text-on-surface font-display mb-3 uppercase tracking-wider">
              BANTUVERIF
            </div>
            <p className="text-xs leading-relaxed text-on-surface-variant">
              Empowering citizens through transparent, secure, and accessible verification technology. Government as a platform, simplified for everyone.
            </p>
          </div>

          <div>
            <div className="font-bold text-on-surface mb-3 text-xs uppercase tracking-wider">Platform</div>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-primary-container">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary-container">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <div className="font-bold text-on-surface mb-3 text-xs uppercase tracking-wider">Resources</div>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-primary-container">FAQ</a></li>
              <li><a href="#" className="hover:text-primary-container">Audit Transparency</a></li>
            </ul>
          </div>

          <div>
            <div className="font-bold text-on-surface mb-3 text-xs uppercase tracking-wider">Support</div>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-primary-container">Contact Support</a></li>
              <li><a href="#" className="hover:text-primary-container">Accessibility</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto px-6 pt-6 border-t border-[#e2e8f0] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#737686] gap-4">
          <div>
            © 2026 BantuVerif Citizen Platform. Secure & Transparent Civic Tech.
          </div>
          <div className="flex items-center gap-3">
            <button title="Share" className="w-7 h-7 rounded-full bg-[#f2f4f6] flex items-center justify-center hover:bg-[#eceef0]">
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <button title="Language" className="w-7 h-7 rounded-full bg-[#f2f4f6] flex items-center justify-center hover:bg-[#eceef0]">
              <Globe className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </footer>

      {/* Modal: New Application */}
      {isNewAppModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-elevated w-full max-w-[500px] p-7 relative">
            <button
              onClick={() => setIsNewAppModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#f2f4f6] flex items-center justify-center text-on-surface-variant hover:bg-[#eceef0] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#2563eb]/10 text-[#2563eb] rounded-xl flex items-center justify-center">
                <FilePlus className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-on-surface font-display">
                  Buat Pengajuan Bantuan Baru
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Pilih kategori bantuan sosial yang sesuai dengan kebutuhan Anda.
                </p>
              </div>
            </div>

            {appSubmitted ? (
              <div className="py-8 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-base text-on-surface mb-1">Pengajuan Berhasil Dikirim!</h4>
                <p className="text-xs text-on-surface-variant">
                  ID Permohonan Anda: <strong>#BANTU-2026-9901</strong>
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateApp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1.5 uppercase tracking-wider">
                    Kategori Bantuan Sosial
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] text-sm text-on-surface outline-none focus:border-[#2563eb]"
                  >
                    <option value="BLT Sembako">BLT Sembako & Bahan Pangan</option>
                    <option value="Subsidi Perumahan">Subsidi Perumahan & Kelayakan Huni</option>
                    <option value="Beasiswa Pendidikan">Beasiswa & Keringanan Pendidikan</option>
                    <option value="Kartu Sehat">Perpanjangan Kartu Kesehatan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1.5 uppercase tracking-wider">
                    Catatan Alasan Pengajuan
                  </label>
                  <textarea
                    rows={3}
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="Jelaskan secara singkat kondisi atau keperluan Anda..."
                    className="w-full p-3 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] text-sm text-on-surface outline-none focus:border-[#2563eb]"
                  ></textarea>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsNewAppModalOpen(false)}
                    className="h-11 px-5 rounded-lg border border-[#e2e8f0] text-xs font-semibold hover:bg-[#f2f4f6]"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="h-11 px-6 rounded-lg bg-[#2563eb] text-white text-xs font-semibold hover:bg-[#1d4ed8] shadow-sm"
                  >
                    Kirim Permohonan
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
