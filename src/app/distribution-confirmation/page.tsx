"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Wallet,
  BadgeCheck,
  LayoutDashboard,
  Download,
  HelpCircle,
} from "lucide-react";

export default function DistributionConfirmationPage() {
  // TODO: sambungkan ke data asli — timestamp disbursement dari DB
  const [disbursementDate, setDisbursementDate] = useState("");

  useEffect(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    };
    setDisbursementDate(now.toLocaleDateString("en-US", options));
  }, []);

  return (
    <div className="bg-background text-on-surface font-body min-h-screen flex flex-col selection:bg-primary-container selection:text-white">
      {/* Main Content Canvas */}
      <main className="flex-grow pt-10 md:pt-16 pb-20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Success Status Header */}
          <section className="lg:col-span-12 text-center mb-base">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 text-success mb-6 float-animation">
              <CheckCircle2 className="w-12 h-12" strokeWidth={2.5} />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-extrabold text-on-surface mb-2 tracking-tight">
              Aid Received Successfully
            </h1>
            <p className="text-on-surface-variant max-w-2xl mx-auto text-sm md:text-lg leading-relaxed">
              Your support disbursement has been processed and transferred to
              your registered account. Please keep this receipt for your
              records.
            </p>
          </section>

          {/* Digital Receipt Component (Bento Item) */}
          <div className="lg:col-span-7">
            <div className="bg-surface border border-border-subtle rounded-xl shadow-level1 overflow-hidden receipt-cut">
              <div className="bg-primary p-8 text-on-primary">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold tracking-[0.05em] opacity-80 mb-1">
                      OFFICIAL DISBURSEMENT RECEIPT
                    </p>
                    <h2 className="font-display text-2xl font-bold">
                      BantuVerif System
                    </h2>
                  </div>
                  <Wallet className="w-10 h-10 opacity-90" />
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 border-b border-dashed border-outline-variant">
                  <div>
                    <p className="text-on-surface-variant text-sm font-semibold mb-1">
                      Transaction ID
                    </p>
                    {/* TODO: sambungkan ke data asli — transaction ID dari DB */}
                    <p className="font-mono text-primary font-bold">
                      BV-9842-XLL-2024
                    </p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-on-surface-variant text-sm font-semibold mb-1">
                      Disbursement Date
                    </p>
                    <p className="text-on-surface text-sm md:text-base">
                      {disbursementDate || "..."}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-on-surface-variant text-sm font-semibold mb-1">
                      Recipient Name
                    </p>
                    {/* TODO: sambungkan ke data asli — nama penerima dari profil */}
                    <p className="text-on-surface text-sm md:text-base font-bold">
                      Adama Traoré
                    </p>
                  </div>
                  <div>
                    <p className="text-on-surface-variant text-sm font-semibold mb-1">
                      Fund Category
                    </p>
                    {/* TODO: sambungkan ke data asli — kategori bantuan */}
                    <p className="text-on-surface text-sm md:text-base">
                      Housing Sustainability Aid
                    </p>
                  </div>
                </div>

                <div className="bg-surface-container-low p-6 rounded-lg flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className="text-on-surface-variant text-sm font-semibold mb-1">
                      Amount Credited
                    </p>
                    {/* TODO: sambungkan ke data asli — nominal bantuan */}
                    <p className="font-display text-3xl md:text-4xl font-bold text-primary leading-none">
                      $1,250.00
                    </p>
                  </div>
                  <div className="bg-surface p-2 rounded-lg border border-border-subtle">
                    <img
                      className="w-24 h-24"
                      alt="A clean, high-contrast QR code generated on a white background, symbolizing a secure digital transaction link for a government verification system. The aesthetic is professional, minimalist, and utilitarian, featuring crisp black geometric patterns that imply precision and transparency in financial processing."
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrWGiOHuZfgQcQJuI7UlLezaJWJ35XuDPluICKyLDUdu0QUKXWtXc9fjLroWJ7Rf5WS-FV1jYr1C5z_ZvIiLOw6o21nIRihT4wc5y2OSkNxe8DDxwwRoRG6f4xv0hR4WKMfJMLKKeGWlbNOEX45Okp_WOMrJC_DQrW5nmUWTXBwBAe0MqoNDuYEFXH_hSnVho0V7rwGDuHbV-E_yG102j70L7I7jJWMf4U2_CCcfSRc3Qej9MftCuqrQ"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-success text-sm font-semibold">
                  <BadgeCheck className="w-5 h-5" />
                  <span>Blockchain Verified Transaction</span>
                </div>
              </div>
              <div className="h-10"></div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/dashboard"
                className="flex-1 h-12 bg-primary text-on-primary font-semibold rounded-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <LayoutDashboard className="w-5 h-5" />
                Back to Dashboard
              </Link>
              <button
                type="button"
                onClick={() => window.print()}
                className="h-12 px-6 border border-primary text-primary font-semibold rounded-lg hover:bg-primary/5 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Save PDF
              </button>
            </div>
          </div>

          {/* Side Bento Column */}
          <div className="lg:col-span-5 space-y-gutter">
            {/* What happens next section */}
            <div className="bg-surface border border-border-subtle rounded-xl p-8 shadow-level1">
              <h3 className="font-display text-2xl text-on-surface mb-6 flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-secondary" />
                What happens next?
              </h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-container/20 text-primary flex items-center justify-center shrink-0">
                    <span className="font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-on-surface">
                      Check your Bank
                    </h4>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      Funds may take 1-3 business days to reflect in your local
                      account depending on your provider.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-container/20 text-primary flex items-center justify-center shrink-0">
                    <span className="font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-on-surface">
                      Ongoing Compliance
                    </h4>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      You will receive a notification in 30 days to provide a
                      simple utilization report through the portal.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-container/20 text-primary flex items-center justify-center shrink-0">
                    <span className="font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-on-surface">
                      Renewal Period
                    </h4>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      Your eligibility for next quarter&apos;s aid will be
                      automatically assessed on January 1st, 2025.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-surface-container-low rounded-lg border border-border-subtle">
                <p className="text-sm text-on-surface-variant italic">
                  &quot;Transparency builds trust. Our automated audit system
                  ensures every cent reaches those in need.&quot;
                </p>
              </div>
            </div>

            {/* Support Card */}
            <div className="bg-surface-container border border-border-subtle rounded-xl p-6 flex items-center gap-6">
              <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-surface">
                <img
                  className="w-full h-full object-cover"
                  alt="A professional and friendly portrait of a female customer support agent wearing a headset. She is smiling warmly in a bright, modern office environment. The image uses a soft, daylight-inspired color palette with clean lines, conveying approachability, empathy, and institutional reliability."
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuClAn7_xmg1QDjY85oOzOnIe-ChIZ37uzeawgT6Vo-Jlk3BRh9Sjjk_rEMVY3HSTHpRiMKTh2SXpSaO5njDb0iluIY8Jwtt_2w7tHJuNKAz7GLgDkDJwUqWhIKBm_8OaXUudQGB6kEIwuRGTFWbGQwjhixiqv9LJREXkmS65BOYbSu5jSDZ0fbfxoiYGMoTqpMqjb0SRoq4ehht_5UnUUksA0hBvdvk2TYpxzahK556SfbKT1_r8UY9XQ"
                />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-on-surface">
                  Need help?
                </h4>
                <p className="text-sm text-on-surface-variant mb-2 leading-relaxed">
                  Our support team is available 24/7 for disbursement queries.
                </p>
                <a
                  className="text-primary text-sm font-semibold hover:underline"
                  href="#"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-4 md:px-margin-desktop bg-surface-container-low mt-auto border-t border-border-subtle dark:border-outline-variant">
        <div className="max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-xs text-on-surface-variant">
          <div className="flex flex-col items-center md:items-start gap-4">
            <span className="font-bold tracking-[0.05em] uppercase text-on-surface-variant">
              BANTUVERIF CITIZEN PLATFORM
            </span>
            <p className="text-secondary dark:text-secondary-fixed">
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
