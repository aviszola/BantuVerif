"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Timer,
  Shield,
  FileText,
  Badge,
  Home,
  Wallet,
  CheckCircle2,
  ArrowRight,
  Check,
} from "lucide-react";

export default function RiwayatPage() {
  return (
    <div className="bg-background text-on-surface font-body min-h-screen flex flex-col selection:bg-primary-container selection:text-white">
      {/* Main Content Area */}
      <main className="flex-grow pt-10 md:pt-16 pb-16 px-4 md:px-margin-desktop max-w-container-max mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Left Column: Context & Readiness */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <section>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-primary-fixed text-on-primary-fixed rounded-full font-semibold text-xs md:text-sm mb-4">
                <ShieldCheck className="w-4 h-4 text-primary" />
                Pre-Application Checklist
              </span>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold text-on-surface mb-4 tracking-tight">
                Are you ready to apply?
              </h1>
              <p className="font-body text-sm md:text-base text-on-surface-variant max-w-xl leading-relaxed">
                To ensure a smooth verification process, please review the requirements below. Most applicants finish the entire process in under 15 minutes.
              </p>
            </section>

            {/* Bento Style Readiness Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bento-card p-6 bg-surface border border-border-subtle rounded-xl flex flex-col gap-4 shadow-2xs">
                <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                  <Timer className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-on-surface mb-1">Time Estimate</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Takes about 12 minutes to complete all sections including document uploads.
                  </p>
                </div>
              </div>

              <div className="bento-card p-6 bg-surface border border-border-subtle rounded-xl flex flex-col gap-4 shadow-2xs">
                <div className="w-12 h-12 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-on-surface mb-1">Secure Process</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Your data is encrypted end-to-end using BantuVerif military-grade protocols.
                  </p>
                </div>
              </div>

              <div className="bento-card p-6 bg-surface border border-border-subtle rounded-xl flex flex-col gap-4 shadow-2xs md:col-span-2">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 shrink-0 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-on-surface mb-1">Save for Later</h3>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      You can pause at any step. Your progress is automatically saved to your Citizen Profile.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Document Checklist */}
            <div className="bg-surface border border-border-subtle rounded-xl overflow-hidden shadow-2xs">
              <div className="px-6 py-4 bg-surface-container-low border-b border-border-subtle flex justify-between items-center">
                <h2 className="font-bold text-sm text-on-surface">Required Documents List</h2>
                <span className="font-semibold text-xs text-on-surface-variant uppercase tracking-widest">
                  3 Documents Total
                </span>
              </div>
              <div className="p-6 flex flex-col gap-4">
                {/* Item 1 */}
                <div className="flex items-center gap-4 p-4 rounded-lg bg-surface-container-lowest border border-border-subtle group hover:border-primary transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary-container shrink-0">
                    <Badge className="w-5 h-5" />
                  </div>
                  <div className="flex-grow">
                    <span className="block font-semibold text-sm text-on-surface">National ID</span>
                    <span className="block text-xs text-on-surface-variant">
                      Must be a valid, non-expired original document.
                    </span>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-outline-variant group-hover:text-emerald-600 transition-colors shrink-0" />
                </div>

                {/* Item 2 */}
                <div className="flex items-center gap-4 p-4 rounded-lg bg-surface-container-lowest border border-border-subtle group hover:border-primary transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary-container shrink-0">
                    <Home className="w-5 h-5" />
                  </div>
                  <div className="flex-grow">
                    <span className="block font-semibold text-sm text-on-surface">Proof of Residence</span>
                    <span className="block text-xs text-on-surface-variant">
                      Utility bill or bank statement (less than 3 months old).
                    </span>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-outline-variant group-hover:text-emerald-600 transition-colors shrink-0" />
                </div>

                {/* Item 3 */}
                <div className="flex items-center gap-4 p-4 rounded-lg bg-surface-container-lowest border border-border-subtle group hover:border-primary transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary-container shrink-0">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div className="flex-grow">
                    <span className="block font-semibold text-sm text-on-surface">Income Statement</span>
                    <span className="block text-xs text-on-surface-variant">
                      Latest 3 payslips or tax assessment for self-employed.
                    </span>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-outline-variant group-hover:text-emerald-600 transition-colors shrink-0" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual & CTA */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="bg-surface border border-border-subtle rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden h-full min-h-[420px]">
              {/* Ambient Tonal Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 -z-10"></div>
              
              {/* Illustration Container */}
              <div className="relative w-56 h-56 md:w-64 md:h-64 mb-8 flex items-center justify-center">
                <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse"></div>
                <img
                  className="relative z-10 w-full h-full object-contain drop-shadow-md"
                  alt="A clean, minimalist 3D illustration of a professional navy blue document folder with a secure holographic seal."
                  src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop"
                />
              </div>

              <h3 className="font-display text-2xl md:text-3xl font-bold text-on-surface mb-2">
                Almost there!
              </h3>
              <p className="font-body text-xs md:text-sm text-on-surface-variant mb-8 px-4 leading-relaxed">
                Verify your eligibility now to unlock access to civic services and benefits.
              </p>

              {/* TODO: sambungkan ke data asli / flow pengajuan */}
              <Link
                href="/apply"
                className="w-full max-w-sm h-14 bg-primary text-on-primary font-bold text-sm md:text-base rounded-xl flex items-center justify-center gap-2 hover:bg-primary-container transition-all active:scale-95 shadow-md hover:shadow-lg"
              >
                <span>Start Application</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <p className="mt-6 font-body text-xs text-outline">
                By starting, you agree to our{" "}
                <a className="underline hover:text-primary transition-colors" href="#">
                  Data Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Shared Footer */}
      <footer className="w-full py-12 px-4 md:px-margin-desktop bg-surface-container-low mt-auto border-t border-border-subtle dark:border-outline-variant">
        <div className="max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8 text-xs text-on-surface-variant">
          <div className="flex flex-col gap-2">
            <span className="font-bold tracking-wider uppercase text-on-surface-variant">
              BANTUVERIF
            </span>
            <p className="text-secondary dark:text-secondary-fixed max-w-xs">
              © 2026 BantuVerif Citizen Platform. Secure &amp; Transparent Civic Tech.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-4 font-medium">
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
          </nav>
        </div>
      </footer>
    </div>
  );
}
