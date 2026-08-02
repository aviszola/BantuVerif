"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Bell,
  User,
  CheckCircle2,
  Copy,
  Check,
  UserCheck,
  LayoutDashboard,
  Download,
} from "lucide-react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  gravity: number;
  life: number;
}

export default function ApplicationSubmittedPage() {
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // TODO: sambungkan ke data asli (ID pengajuan dari Supabase setelah submit form)
  const applicationId = "#BANTU-2024-8842";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(applicationId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard tidak tersedia — abaikan
    }
  };

  // Confetti burst on load (dikonversi dari skrip vanilla HTML)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let rafId = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    const createConfetti = () => {
      for (let i = 0; i < 50; i++) {
        particles.push({
          x: canvas.width / 2,
          y: canvas.height / 2,
          size: Math.random() * 8 + 4,
          speedX: Math.random() * 10 - 5,
          speedY: Math.random() * -15 - 5,
          color: `hsl(${Math.random() * 360}, 70%, 60%)`,
          gravity: 0.2,
          life: 100,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter((p) => p.life > 0);
      particles.forEach((p) => {
        p.speedY += p.gravity;
        p.x += p.speedX;
        p.y += p.speedY;
        p.life -= 0.8;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / 100;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });
      rafId = requestAnimationFrame(animate);
    };

    const timer = setTimeout(() => {
      createConfetti();
      animate();
    }, 300);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-on-surface font-body flex flex-col selection:bg-primary-container selection:text-white">
      {/* TopNavBar — pola sama dengan dashboard */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-border-subtle">
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-primary-container rounded-lg flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="font-display font-extrabold text-xl tracking-tight text-on-surface">
              Bantu<span className="text-primary-container">Verif</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/dashboard"
              className="text-[15px] font-medium text-on-surface-variant hover:text-primary-container transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/application-submitted"
              className="text-[15px] font-semibold text-primary-container border-b-2 border-primary-container pb-0.5"
            >
              Applications
            </Link>
            <a
              href="#"
              className="text-[15px] font-medium text-on-surface-variant hover:text-primary-container transition-colors"
            >
              History
            </a>
            <a
              href="#"
              className="text-[15px] font-medium text-on-surface-variant hover:text-primary-container transition-colors"
            >
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <button
              title="Notifications"
              className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              <Bell className="w-5 h-5" />
            </button>
            <button
              title="Akun"
              className="w-9 h-9 rounded-full bg-primary-container/10 text-primary-container border border-primary-container/20 flex items-center justify-center"
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-16 relative overflow-hidden">
        {/* Background Atmospheric Element */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-success/5 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        {/* Confetti */}
        <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-40" />

        <section className="w-full max-w-[672px] mx-auto animate-fade-in-up">
          {/* Success Card */}
          <div className="bg-surface border border-border-subtle rounded-xl p-8 md:p-12 text-center shadow-level2 relative z-10">
            {/* Animated Checkmark Circle */}
            <div className="mb-8 flex justify-center">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-success/10 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.15)] relative">
                <div className="absolute inset-0 border-4 border-success rounded-full opacity-20 scale-110 animate-ping"></div>
                <CheckCircle2 className="w-12 h-12 md:w-16 md:h-16 text-success" />
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-display font-extrabold text-on-surface mb-3 tracking-tight">
              Application Submitted Successfully
            </h1>
            <p className="text-lg text-on-surface-variant mb-8 max-w-md mx-auto leading-relaxed">
              Thank you for submitting your verification request. We&apos;ve received
              your details.
            </p>

            {/* Application ID Badge */}
            <div className="inline-flex items-center gap-3 bg-surface-container-low border border-border-subtle rounded-full px-6 py-2.5 mb-12">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                Application ID
              </span>
              <span className="text-sm font-semibold text-primary">{applicationId}</span>
              <button
                onClick={handleCopy}
                className="ml-1 p-1 hover:bg-surface-container-highest rounded-full transition-colors"
                title="Copy ID"
                aria-label="Salin ID pengajuan"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-success" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Next Steps Grid (Asymmetric) */}
            <div className="text-left mb-12 grid md:grid-cols-12 gap-6">
              <div className="md:col-span-8 bg-surface-container-lowest border border-border-subtle p-6 rounded-xl">
                <div className="flex gap-4 items-start">
                  <div className="bg-primary/10 p-3 rounded-lg text-primary">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-on-surface mb-1">
                      Next Steps
                    </h3>
                    <p className="text-base text-on-surface-variant leading-relaxed">
                      Your community leader will now verify your request. This
                      typically takes 2-3 business days.
                    </p>
                  </div>
                </div>
              </div>
              <div className="md:col-span-4 bg-surface-container-low p-6 rounded-xl flex flex-col justify-center">
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">
                  EXPECTED BY
                </p>
                {/* TODO: sambungkan ke data asli (estimasi selesai verifikasi) */}
                <p className="text-2xl font-bold font-display text-on-surface">
                  Oct 24, 2024
                </p>
              </div>
            </div>

            {/* Action Group */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
              <Link
                href="/dashboard"
                className="w-full md:w-auto min-h-[48px] px-8 py-3 bg-primary text-on-primary text-sm font-semibold rounded-lg hover:bg-primary-container transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                Go to My Dashboard
              </Link>
              <button className="w-full md:w-auto min-h-[48px] px-8 py-3 border border-border-subtle bg-surface text-on-surface-variant text-sm font-semibold rounded-lg hover:bg-surface-container-low transition-all active:scale-95 flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Download Receipt
              </button>
            </div>
          </div>

          {/* Support Footer Inside Content Canvas */}
          <div className="mt-8 text-center">
            <p className="text-sm text-on-surface-variant">
              Need help?{" "}
              <a href="#" className="text-primary font-bold hover:underline">
                Contact our support desk
              </a>{" "}
              or visit our{" "}
              <a href="#" className="text-primary font-bold hover:underline">
                FAQ
              </a>
              .
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-low border-t border-border-subtle py-12 mt-auto">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex flex-col gap-4">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              BANTUVERIF
            </span>
            <p className="text-sm text-secondary">
              © 2024 BantuVerif Citizen Platform. Secure &amp; Transparent Civic
              Tech.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-4">
            <a href="#" className="text-sm text-on-surface-variant hover:text-primary underline transition-all">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-on-surface-variant hover:text-primary underline transition-all">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-on-surface-variant hover:text-primary underline transition-all">
              FAQ
            </a>
            <a href="#" className="text-sm text-on-surface-variant hover:text-primary underline transition-all">
              Audit Transparency
            </a>
            <a href="#" className="text-sm text-on-surface-variant hover:text-primary underline transition-all">
              Contact Support
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
