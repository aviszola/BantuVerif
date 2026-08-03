"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  Eye,
  Activity,
  FileText,
  Receipt,
  ChevronDown,
  Download,
  Info,
  RefreshCw,
  MessageSquare,
  Settings2,
  Wrench,
} from "lucide-react";
import PortalSidebar from "@/components/PortalSidebar";

interface AccordionItem {
  id: string;
  title: string;
  meta: string;
  status: "Verified" | "Reviewing";
  icon: typeof FileText;
  content: React.ReactNode;
}

export default function ApplicationDetailPage() {
  const [openAccordion, setOpenAccordion] = useState<string | null>("acc-1");
  const [dotPulse, setDotPulse] = useState(true);

  // Pulse effect untuk titik "In Review" — TODO: ganti dengan data realtime saat backend live
  useEffect(() => {
    const interval = setInterval(() => {
      setDotPulse((prev) => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const accordions: AccordionItem[] = [
    {
      id: "acc-1",
      title: "Proof of Residency.pdf",
      meta: "Verified by Node #102 • Oct 24",
      icon: FileText,
      status: "Verified",
      content: (
        <div className="py-4 space-y-4">
          <p className="text-sm text-on-surface-variant leading-relaxed">
            The digital signature on this document matches the issuer&apos;s
            public key (National ID Database). Verification hash:{" "}
            <code className="bg-surface-container rounded px-1 text-on-surface">
              0x88f...e92a
            </code>
          </p>
          <div className="flex gap-4">
            <button className="text-primary font-semibold text-sm flex items-center gap-1 hover:underline">
              <Download className="w-4 h-4" /> View File
            </button>
            <button className="text-on-surface-variant font-semibold text-sm flex items-center gap-1 hover:underline">
              <Info className="w-4 h-4" /> Details
            </button>
          </div>
        </div>
      ),
    },
    {
      id: "acc-2",
      title: "Income Statement_Q3.png",
      meta: "Manual Review Pending",
      icon: Receipt,
      status: "Reviewing",
      content: (
        <div className="py-4">
          <p className="text-sm text-on-surface-variant leading-relaxed">
            This document is currently being compared against taxation
            records. Expected verification by EOD tomorrow.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background text-on-surface font-body flex flex-col selection:bg-primary-container selection:text-white">
      <div className="relative">
        {/* Ambient Glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.03)_0%,transparent_70%)]" />

        <div className="relative z-10 max-w-[1280px] mx-auto px-4 md:px-6 py-8 w-full flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <PortalSidebar active="applications" />

            {/* Main Content Canvas */}
            <main className="lg:col-span-9 space-y-8">
              {/* Page Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Link
                      href="/tracking"
                      className="text-primary flex items-center text-sm font-semibold hover:underline"
                    >
                      <ArrowLeft className="w-4 h-4 mr-1" /> Back to List
                    </Link>
                  </div>
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-on-surface tracking-tight">
                    Application Detail
                  </h1>
                  <p className="text-on-surface-variant text-sm mt-1">
                    ID: #BV-2024-8842 • Community Grant Program
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="px-4 py-2 bg-success/10 text-success rounded-full border border-success/20 text-sm font-semibold flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full bg-success transition-opacity duration-1000 ${
                        dotPulse ? "opacity-100" : "opacity-40"
                      }`}
                    ></span>
                    In Review
                  </div>
                </div>
              </div>

              {/* Bento Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Core Info Card */}
                  <div className="bg-surface border border-border-subtle rounded-xl p-8 shadow-level1">
                    <h2 className="font-display text-2xl mb-6 font-bold">
                      Submitted Content
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div>
                          <p className="text-on-surface-variant text-xs font-bold tracking-[0.05em] mb-1">
                            PROGRAM NAME
                          </p>
                          <p className="text-lg text-on-surface leading-relaxed">
                            Small Business Stimulus Fund
                          </p>
                        </div>
                        <div>
                          <p className="text-on-surface-variant text-xs font-bold tracking-[0.05em] mb-1">
                            SUBMITTED ON
                          </p>
                          <p className="text-lg text-on-surface leading-relaxed">
                            October 24, 2024, 14:32 GMT
                          </p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-on-surface-variant text-xs font-bold tracking-[0.05em] mb-1">
                            ESTIMATED COMPLETION
                          </p>
                          <p className="text-lg text-on-surface leading-relaxed">
                            November 05, 2024
                          </p>
                        </div>
                        <div>
                          <p className="text-on-surface-variant text-xs font-bold tracking-[0.05em] mb-1">
                            VERIFICATION METHOD
                          </p>
                          <p className="text-lg text-on-surface flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-primary" />
                            Community Distributed Ledger
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Privacy Indicators */}
                  <div className="bg-surface border border-border-subtle rounded-xl p-8 shadow-level1">
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="font-display text-2xl flex items-center gap-2 font-bold">
                        <Lock className="w-6 h-6 text-primary" />
                        Privacy &amp; Encryption
                      </h2>
                      <span className="px-3 py-1 bg-primary-container/20 text-primary-container rounded-lg text-sm font-semibold">
                        AES-256 Enabled
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-4 bg-surface-container-low rounded-lg border border-border-subtle">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-4">
                          <ShieldCheck className="w-5 h-5 text-success" />
                        </div>
                        <p className="text-sm font-semibold mb-1">
                          End-to-End Encryption
                        </p>
                        <p className="text-sm text-on-surface-variant leading-relaxed">
                          Personal data is hashed before being stored on the
                          ledger.
                        </p>
                      </div>
                      <div className="p-4 bg-surface-container-low rounded-lg border border-border-subtle">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-4">
                          <Eye className="w-5 h-5 text-warning" />
                        </div>
                        <p className="text-sm font-semibold mb-1">
                          Access Tracking
                        </p>
                        <p className="text-sm text-on-surface-variant leading-relaxed">
                          3 Ministry Officials have accessed your PII in the
                          last 48h.
                        </p>
                      </div>
                      <div className="p-4 bg-surface-container-low rounded-lg border border-border-subtle">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-4">
                          <Activity className="w-5 h-5 text-primary" />
                        </div>
                        <p className="text-sm font-semibold mb-1">
                          Zero-Knowledge Proof
                        </p>
                        <p className="text-sm text-on-surface-variant leading-relaxed">
                          Validators check eligibility without seeing raw income
                          data.
                        </p>
                      </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-border-subtle">
                      <h3 className="text-sm font-semibold mb-4">
                        Recent Data Access Logs
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 text-sm">
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary"></span>
                            Ministry of Social Welfare (Auth Node #44)
                          </span>
                          <span className="text-on-surface-variant">
                            Today, 09:15 AM
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-2 text-sm">
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-outline"></span>
                            Automated Risk Scoring Engine
                          </span>
                          <span className="text-on-surface-variant">
                            Oct 25, 04:00 PM
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Supporting Documents (Accordion) */}
                  <div className="bg-surface border border-border-subtle rounded-xl overflow-hidden shadow-level1">
                    <div className="p-8 pb-4">
                      <h2 className="font-display text-2xl font-bold">
                        Supporting Documents
                      </h2>
                    </div>
                    <div className="divide-y divide-border-subtle">
                      {accordions.map((item) => {
                        const Icon = item.icon;
                        const isOpen = openAccordion === item.id;
                        return (
                          <div key={item.id}>
                            <button
                              onClick={() =>
                                setOpenAccordion(isOpen ? null : item.id)
                              }
                              className="w-full flex items-center justify-between p-6 text-left hover:bg-surface-container-low transition-colors"
                            >
                              <div className="flex items-center gap-4">
                                <div
                                  className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                                    item.status === "Verified"
                                      ? "bg-success/10 text-success"
                                      : "bg-warning/10 text-warning"
                                  }`}
                                >
                                  <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                  <p className="text-sm font-semibold">
                                    {item.title}
                                  </p>
                                  <p className="text-sm text-on-surface-variant">
                                    {item.meta}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <span
                                  className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                                    item.status === "Verified"
                                      ? "bg-success/10 text-success"
                                      : "bg-warning/10 text-warning"
                                  }`}
                                >
                                  {item.status}
                                </span>
                                <ChevronDown
                                  className={`w-5 h-5 text-on-surface-variant transition-transform duration-300 ${
                                    isOpen ? "rotate-180" : ""
                                  }`}
                                />
                              </div>
                            </button>
                            <div
                              className={`overflow-hidden transition-all duration-300 ${
                                isOpen ? "max-h-[500px]" : "max-h-0"
                              }`}
                            >
                              <div className="px-20 pb-6 bg-surface-container-low">
                                {item.content}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Audit Timeline */}
                  <div className="bg-surface border border-border-subtle rounded-xl p-6 shadow-level1">
                    <h3 className="font-display text-xl font-bold mb-6">
                      Audit Timeline
                    </h3>
                    <div className="relative pl-6 border-l-2 border-primary/20 space-y-8">
                      <div className="relative">
                        <div className="absolute -left-[33px] top-0 w-4 h-4 rounded-full bg-success ring-4 ring-white"></div>
                        <p className="text-sm font-semibold">
                          Submission Recorded
                        </p>
                        <p className="text-sm text-on-surface-variant">
                          Oct 24, 14:32:01
                        </p>
                        <p className="text-xs font-mono bg-surface-container-low px-2 py-1 rounded mt-1 inline-block">
                          TX: 0x4f...9c2
                        </p>
                      </div>

                      <div className="relative">
                        <div className="absolute -left-[33px] top-0 w-4 h-4 rounded-full bg-primary ring-4 ring-white"></div>
                        <p className="text-sm font-semibold">
                          Consensus Voting Initiated
                        </p>
                        <p className="text-sm text-on-surface-variant">
                          Oct 24, 15:45:12
                        </p>
                        <div className="mt-2 flex -space-x-2">
                          <div className="w-6 h-6 rounded-full bg-surface-container-highest border border-white flex items-center justify-center text-[10px] font-bold text-on-surface">
                            A1
                          </div>
                          <div className="w-6 h-6 rounded-full bg-surface-container-highest border border-white flex items-center justify-center text-[10px] font-bold text-on-surface">
                            V9
                          </div>
                          <div className="w-6 h-6 rounded-full bg-surface-container-highest border border-white flex items-center justify-center text-[10px] font-bold text-on-surface">
                            K4
                          </div>
                          <div className="w-6 h-6 rounded-full bg-primary-container text-on-primary border border-white flex items-center justify-center text-[10px] font-bold">
                            +12
                          </div>
                        </div>
                        <p className="text-xs text-on-surface-variant mt-1 italic">
                          15 anonymized community votes cast
                        </p>
                      </div>

                      <div className="relative">
                        <div className="absolute -left-[33px] top-0 w-4 h-4 rounded-full bg-outline-variant ring-4 ring-white"></div>
                        <p className="text-sm font-semibold text-on-surface-variant">
                          Final Verification
                        </p>
                        <p className="text-sm text-on-surface-variant italic">
                          Awaiting node finalization
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Activity History Log */}
                  <div className="bg-surface border border-border-subtle rounded-xl p-6 shadow-level1">
                    <h3 className="text-sm font-semibold mb-4 flex items-center justify-between">
                      Activity History
                      <Info className="w-4 h-4 text-on-surface-variant" />
                    </h3>
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <RefreshCw className="w-5 h-5 text-primary shrink-0" />
                        <div>
                          <p className="text-sm text-on-surface">
                            Status changed to{" "}
                            <span className="text-success font-bold">
                              In Review
                            </span>
                          </p>
                          <p className="text-xs text-on-surface-variant">
                            Today, 08:20 AM
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Wrench className="w-5 h-5 text-on-surface-variant shrink-0" />
                        <div>
                          <p className="text-sm text-on-surface">
                            Ministry Official added a note regarding document
                            clarity.
                          </p>
                          <p className="text-xs text-on-surface-variant">
                            Yesterday, 11:30 PM
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <FileText className="w-5 h-5 text-on-surface-variant shrink-0" />
                        <div>
                          <p className="text-sm text-on-surface">
                            Application was modified by the applicant.
                          </p>
                          <p className="text-xs text-on-surface-variant">
                            Oct 24, 02:40 PM
                          </p>
                        </div>
                      </div>
                    </div>
                    <button className="w-full mt-6 py-2 border border-border-subtle rounded-lg text-sm font-semibold hover:bg-surface-container transition-colors">
                      View Full Audit Log
                    </button>
                  </div>

                  {/* Help Card */}
                  <div className="bg-primary-container p-6 rounded-xl text-on-primary relative overflow-hidden">
                    <div className="relative z-10">
                      <h3 className="text-sm font-semibold mb-2">
                        Need Help?
                      </h3>
                      <p className="text-sm opacity-90 mb-4 leading-relaxed">
                        Our community moderators are here to help if you have
                        questions about the audit process.
                      </p>
                      <button className="px-4 py-2 bg-on-primary text-primary rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
                        Contact Support
                      </button>
                    </div>
                    <Wrench className="absolute -bottom-4 -right-4 w-32 h-32 opacity-10" />
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full py-12 px-4 md:px-10 bg-surface-container-low mt-auto border-t border-border-subtle">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-on-surface-variant">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="font-bold tracking-[0.05em] uppercase">
              BANTUVERIF
            </span>
            <p className="text-secondary">
              © 2026 BantuVerif Citizen Platform. Secure &amp; Transparent
              Civic Tech.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 font-medium">
            <a className="hover:text-primary underline transition-all" href="#">
              Privacy Policy
            </a>
            <a className="hover:text-primary underline transition-all" href="#">
              Terms of Service
            </a>
            <a className="hover:text-primary underline transition-all" href="#">
              FAQ
            </a>
            <a className="hover:text-primary underline transition-all" href="#">
              Audit Transparency
            </a>
            <a className="hover:text-primary underline transition-all" href="#">
              Contact Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
