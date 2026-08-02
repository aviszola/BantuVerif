"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell,
  User,
  LayoutDashboard,
  FileText,
  CheckCircle2,
  ClipboardCheck,
  History,
  Settings,
  Plus,
  Download,
  HelpCircle,
  Users,
  Timer,
  ShieldCheck,
  ArrowRight,
  Activity,
} from "lucide-react";

export default function TrackingPage() {
  const [badgeVisible, setBadgeVisible] = useState(true);

  // Simulasi real-time update pulse (dikonversi dari setInterval vanilla HTML)
  useEffect(() => {
    const interval = setInterval(() => {
      setBadgeVisible(false);
      setTimeout(() => setBadgeVisible(true), 500);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background text-on-background font-body flex flex-col">
      {/* TopNavBar */}
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-10 h-16 bg-surface/80 backdrop-blur-md border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <span className="font-display text-2xl font-bold text-primary">
            Bantu<span className="text-primary-container">Verif</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/dashboard"
            className="text-on-surface-variant hover:text-primary transition-colors text-base"
          >
            Dashboard
          </Link>
          <a
            href="#"
            className="text-primary font-bold border-b-2 border-primary pb-1 text-base"
          >
            Applications
          </a>
          <a
            href="#"
            className="text-on-surface-variant hover:text-primary transition-colors text-base"
          >
            History
          </a>
          <a
            href="#"
            className="text-on-surface-variant hover:text-primary transition-colors text-base"
          >
            FAQ
          </a>
        </div>
        <div className="flex items-center gap-4">
          <button
            title="Notifications"
            className="p-2 rounded-full hover:bg-surface-container-high transition-colors"
          >
            <Bell className="w-5 h-5 text-on-surface-variant" />
          </button>
          <button
            title="Akun"
            className="p-2 rounded-full hover:bg-surface-container-high transition-colors"
          >
            <User className="w-5 h-5 text-on-surface-variant" />
          </button>
        </div>
      </nav>

      <div className="flex pt-16 flex-1">
        {/* SideNavBar */}
        <aside className="hidden lg:flex flex-col h-[calc(100vh-64px)] sticky top-16 p-4 border-r border-border-subtle bg-surface-container-low w-64 shrink-0">
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
              <User className="w-5 h-5 fill-current" />
            </div>
            <div>
              <p className="text-sm font-semibold text-on-surface">
                Citizen Profile
              </p>
              {/* TODO: sambungkan ke data asli (nama user dari Supabase auth) */}
              <p className="text-xs text-on-surface-variant">Portal Access</p>
            </div>
          </div>
          <nav className="flex-1 space-y-1">
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-surface-container-highest rounded-lg transition-colors text-sm font-semibold"
            >
              <LayoutDashboard className="w-5 h-5" />
              Overview
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 bg-primary-container text-on-primary-container rounded-lg font-bold text-sm transition-transform active:scale-95"
            >
              <FileText className="w-5 h-5 fill-current" />
              My Applications
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-surface-container-highest rounded-lg transition-colors text-sm font-semibold"
            >
              <ClipboardCheck className="w-5 h-5" />
              Eligibility
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-surface-container-highest rounded-lg transition-colors text-sm font-semibold"
            >
              <History className="w-5 h-5" />
              History
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-surface-container-highest rounded-lg transition-colors text-sm font-semibold"
            >
              <Settings className="w-5 h-5" />
              Settings
            </a>
          </nav>
          <button className="mt-auto w-full py-3 px-4 bg-primary text-on-primary text-sm font-semibold rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" />
            New Application
          </button>
        </aside>

        {/* Main Content Canvas */}
        <main className="flex-1 p-4 md:p-10 overflow-y-auto">
          <div className="max-w-[1280px] mx-auto">
            {/* Header & Summary Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`px-3 py-1 rounded-full bg-secondary-container/20 text-secondary text-sm font-semibold transition-opacity duration-500 ${
                      badgeVisible ? "opacity-100" : "opacity-50"
                    }`}
                  >
                    In Progress
                  </span>
                  {/* TODO: sambungkan ke data asli (ID pengajuan dari Supabase) */}
                  <span className="text-on-surface-variant text-sm">
                    ID: BV-2024-883921
                  </span>
                </div>
                <h1 className="font-display text-3xl font-bold text-on-surface">
                  Community Support Grant Tracking
                </h1>
                <p className="text-on-surface-variant text-base mt-1">
                  Updated 2 hours ago by System Auditor
                </p>
              </div>
              <div className="flex gap-3">
                <button className="px-6 h-12 border border-border-subtle rounded-lg text-sm font-semibold hover:bg-surface-container-low transition-colors flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Export Data
                </button>
                <button className="px-6 h-12 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:shadow-lg transition-all flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  Get Help
                </button>
              </div>
            </div>

            {/* Bento Grid Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Vertical Timeline Column */}
              <div className="lg:col-span-8 bg-surface rounded-xl border border-border-subtle p-8 shadow-level1">
                <h2 className="font-display text-2xl font-semibold text-on-surface mb-8">
                  Verification Journey
                </h2>
                <div className="relative pl-8">
                  {/* Vertical Step Rail */}
                  <div className="absolute left-[15px] top-2 bottom-2 w-1 bg-surface-container-highest rounded-full">
                    {/* Progress fill */}
                    <div className="absolute top-0 left-0 w-full h-[45%] bg-success rounded-full"></div>
                    <div className="absolute top-[45%] left-0 w-full h-[5%] bg-primary"></div>
                  </div>

                  {/* Steps */}
                  <div className="space-y-12">
                    {/* Step 1: Submitted (Completed) */}
                    <div className="relative flex flex-col md:flex-row gap-4 md:gap-10">
                      <div className="absolute -left-[25px] top-1 w-5 h-5 rounded-full bg-success flex items-center justify-center ring-4 ring-background">
                        <CheckCircle2 className="w-3.5 h-3.5 text-white font-bold" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-on-surface">
                            Submitted
                          </h3>
                          <span className="text-on-surface-variant text-sm">
                            Oct 12, 09:14 AM
                          </span>
                        </div>
                        <p className="text-on-surface-variant text-base mt-1">
                          Application successfully received by the BantuVerif
                          engine and initial documentation checksum verified.
                        </p>
                      </div>
                    </div>

                    {/* Step 2: Community Verification (Active/Pulsing) */}
                    <div className="relative flex flex-col md:flex-row gap-4 md:gap-10">
                      <div className="absolute -left-[25px] top-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center ring-4 ring-background">
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                      </div>
                      <div className="flex-1 p-6 bg-surface-container-low rounded-xl border-l-4 border-primary transition-all duration-200 hover:shadow-md hover:-translate-y-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-display text-lg font-bold text-primary">
                            Community Verification
                          </h3>
                          <span className="px-2 py-0.5 rounded-full bg-primary-container/20 text-primary text-[10px] font-bold uppercase tracking-wider">
                            Active
                          </span>
                        </div>
                        <p className="text-on-surface text-base mt-2">
                          Local verifiers are currently reviewing your community
                          contributions. Consensus reached:{" "}
                          {/* TODO: sambungkan ke data asli (skor konsensus real-time) */}
                          <span className="font-bold">65%</span>
                        </p>
                        <div className="mt-4 flex gap-2">
                          <span className="inline-flex items-center px-2 py-1 rounded bg-white text-on-surface-variant text-xs border border-border-subtle">
                            <Users className="w-4 h-4 mr-1" />
                            {/* TODO: sambungkan ke data asli (jumlah verifier) */}
                            12 Verifiers assigned
                          </span>
                          <span className="inline-flex items-center px-2 py-1 rounded bg-white text-on-surface-variant text-xs border border-border-subtle">
                            <Timer className="w-4 h-4 mr-1" />
                            2 days remaining
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Step 3: RT Review (Pending) */}
                    <div className="relative flex flex-col md:flex-row gap-4 md:gap-10">
                      <div className="absolute -left-[25px] top-1 w-5 h-5 rounded-full bg-surface-container-highest ring-4 ring-background"></div>
                      <div className="flex-1 opacity-60">
                        <h3 className="text-sm font-semibold text-on-surface">
                          RT Review
                        </h3>
                        <p className="text-on-surface-variant text-base mt-1">
                          Final validation by Regional Taskforce to ensure
                          cross-district policy alignment.
                        </p>
                      </div>
                    </div>

                    {/* Step 4: Distribution (Pending) */}
                    <div className="relative flex flex-col md:flex-row gap-4 md:gap-10">
                      <div className="absolute -left-[25px] top-1 w-5 h-5 rounded-full bg-surface-container-highest ring-4 ring-background"></div>
                      <div className="flex-1 opacity-60">
                        <h3 className="text-sm font-semibold text-on-surface">
                          Distribution
                        </h3>
                        <p className="text-on-surface-variant text-base mt-1">
                          Funds or services scheduled for disbursement through
                          your chosen digital wallet.
                        </p>
                      </div>
                    </div>

                    {/* Step 5: Completed (Pending) */}
                    <div className="relative flex flex-col md:flex-row gap-4 md:gap-10 pb-4">
                      <div className="absolute -left-[25px] top-1 w-5 h-5 rounded-full bg-surface-container-highest ring-4 ring-background"></div>
                      <div className="flex-1 opacity-60">
                        <h3 className="text-sm font-semibold text-on-surface">
                          Completed
                        </h3>
                        <p className="text-on-surface-variant text-base mt-1">
                          Full journey archival and confirmation of grant impact.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Sidebar Info Cards */}
              <div className="lg:col-span-4 space-y-6">
                {/* Who is verifying Card */}
                <div className="bg-surface-container-low rounded-xl p-6 border border-border-subtle relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700"></div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-4 shadow-sm border border-border-subtle">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-display text-xl text-on-surface mb-3">
                      Who is verifying?
                    </h3>
                    <p className="text-on-surface-variant text-sm leading-relaxed mb-4">
                      BantuVerif uses a <strong>Community Consensus</strong>{" "}
                      model. Your application is reviewed by verified local
                      citizens who live within 5km of your registered address.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2 text-sm text-on-surface">
                        <ShieldCheck className="w-[18px] h-[18px] text-success shrink-0" />
                        Anonymous peer review
                      </li>
                      <li className="flex items-start gap-2 text-sm text-on-surface">
                        <ShieldCheck className="w-[18px] h-[18px] text-success shrink-0" />
                        Fraud-resistant voting
                      </li>
                      <li className="flex items-start gap-2 text-sm text-on-surface">
                        <ShieldCheck className="w-[18px] h-[18px] text-success shrink-0" />
                        Transparent audit logs
                      </li>
                    </ul>
                    <button className="mt-6 w-full text-primary text-sm font-semibold flex items-center justify-center gap-2 hover:underline transition-all">
                      Read about Consensus
                      <ArrowRight className="w-[18px] h-[18px]" />
                    </button>
                  </div>
                </div>

                {/* System Status Card */}
                <div className="bg-white rounded-xl p-6 border border-border-subtle shadow-sm">
                  <h4 className="text-on-surface-variant text-xs font-bold tracking-widest uppercase mb-4">
                    Network Status
                  </h4>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-on-surface text-sm">
                      Blockchain Ledger
                    </span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-success"></div>
                      <span className="text-success text-xs font-bold">LIVE</span>
                    </div>
                  </div>
                  <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                    <div className="bg-success h-full w-[99.9%]"></div>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-3 italic">
                    &quot;Public verification promotes absolute civic
                    transparency.&quot;
                  </p>
                </div>

                {/* Visual Asset Section */}
                <div className="rounded-xl overflow-hidden h-48 border border-border-subtle relative">
                  {/* TODO: ganti dengan asset lokal/generate — jangan pakai URL eksternal di production */}
                  <div
                    className="w-full h-full bg-cover bg-center"
                    role="img"
                    aria-label="Peta digital minimalist menampilkan titik-titik biru menyala yang merepresentasikan verifier komunitas di grid kota"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAflbhZtltIQLGqJH80ZKYveshw_vh2td6rWbcLrwhspS1S51yx4Jd8vPpguZc2CbtGOWo7JdjDwlStxR44DuSRDLE7QFgaOdv2aDvvLdx21S4mvPxJdEfgxuBbDSOo0OIYJNVdBopAk3MQDY0a9s5jXHjuJqbC1l5FrQhFBnLPx27xhXh5p12h1XYdC4aorppoucFqcpr7WiXyYfXc7SE3saxBWISF-HNc7KluFc3ca0hgDRWjranFKg')",
                    }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <p className="text-white text-sm font-semibold">
                      Real-time Node Distribution
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="w-full py-12 px-6 md:px-10 bg-surface-container-low border-t border-border-subtle mt-auto">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-xs font-bold tracking-widest uppercase text-on-surface-variant mb-2">
              BantuVerif Citizen Platform
            </span>
            <p className="text-sm text-on-surface-variant text-center md:text-left">
              © 2024 BantuVerif Citizen Platform. Secure &amp; Transparent Civic
              Tech.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <a
              href="#"
              className="text-on-surface-variant hover:text-primary underline transition-all text-sm"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-on-surface-variant hover:text-primary underline transition-all text-sm"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-on-surface-variant hover:text-primary underline transition-all text-sm"
            >
              FAQ
            </a>
            <a
              href="#"
              className="text-on-surface-variant hover:text-primary underline transition-all text-sm"
            >
              Audit Transparency
            </a>
            <a
              href="#"
              className="text-on-surface-variant hover:text-primary underline transition-all text-sm"
            >
              Contact Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
