"use client";

import React, { useEffect, useRef } from "react";
import {
  BadgeCheck,
  Users,
  Calendar,
  ArrowRight,
  Gavel,
} from "lucide-react";

export default function ApplicationApprovedPage() {
  const confettiRef = useRef<HTMLCanvasElement>(null);

  // Micro-interaction confetti — replicasi script HTML asli
  useEffect(() => {
    const canvas = confettiRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    interface Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      color: string;
      rotation: number;
      rotationSpeed: number;
    }

    const COLORS = ["#004ac6", "#10B981", "#6eb2fe", "#dbe1ff"];
    let particles: Particle[] = [];
    let rafId = 0;

    const createParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: -20,
      size: Math.random() * 8 + 4,
      speedY: Math.random() * 3 + 2,
      speedX: Math.random() * 2 - 1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 5 - 2.5,
    });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotationSpeed;
        if (p.y > canvas.height) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });
      rafId = requestAnimationFrame(animate);
    };

    // Start after 500ms, stop after 6s
    const startTimer = setTimeout(() => {
      for (let i = 0; i < 40; i++) particles.push(createParticle());
      animate();
      setTimeout(() => {
        particles = [];
      }, 6000);
    }, 500);

    return () => {
      clearTimeout(startTimer);
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="bg-background text-on-surface font-body min-h-screen flex flex-col selection:bg-primary-container selection:text-white">
      {/* Confetti Canvas */}
      <canvas
        ref={confettiRef}
        className="pointer-events-none fixed top-0 left-0 w-full h-full z-[100]"
      />

      <main className="flex-grow pt-24 pb-12 px-margin-mobile md:px-margin-desktop flex items-center justify-center">
        <div className="max-w-[800px] mx-auto w-full">
          {/* Decision Hero Section */}
          <section className="bg-surface rounded-xl border border-border-subtle p-8 md:p-12 shadow-level1 mb-gutter text-center relative overflow-hidden">
            {/* Subtle Decorative Background */}
            <div className="absolute top-0 left-0 w-full h-2 bg-success"></div>
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-success/5 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-success/10 rounded-full mb-6 float-animation">
                <BadgeCheck className="w-12 h-12 text-success" strokeWidth={2.5} />
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-extrabold text-on-surface mb-4 tracking-tight">
                Application Approved
              </h1>
              <p className="text-sm md:text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
                Your request for{" "}
                <span className="font-bold text-on-surface">
                  Social Assistance
                </span>{" "}
                has been verified by your community. We are pleased to inform
                you that your eligibility status is confirmed.
              </p>
            </div>
          </section>

          {/* Details Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            {/* Disbursement Details */}
            <div className="md:col-span-7 bg-surface rounded-xl border border-border-subtle p-6 hover:shadow-level2 transition-shadow">
              <h3 className="text-xs font-bold tracking-[0.05em] text-on-surface-variant mb-6 uppercase">
                Assistance Summary
              </h3>
              <div className="space-y-6">
                <div className="flex justify-between items-end border-b border-surface-container-high pb-4">
                  <div>
                    <p className="text-sm text-on-surface-variant">
                      Total Aid Amount
                    </p>
                    {/* TODO: sambungkan ke data asli — nominal bantuan dari DB */}
                    <p className="font-display text-2xl md:text-3xl font-bold text-primary leading-tight">
                      ₦125,000.00
                    </p>
                  </div>
                  <div className="bg-primary-fixed px-3 py-1 rounded-full mb-1">
                    <p className="text-sm font-semibold text-on-primary-fixed">
                      One-time Grant
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-on-surface-variant mb-1">
                      Verification Method
                    </p>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-success" />
                      <span className="text-sm font-semibold">
                        Community Consensus
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-on-surface-variant mb-1">
                      Disbursement Date
                    </p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-secondary" />
                      {/* TODO: sambungkan ke data asli — tanggal penyaluran */}
                      <span className="text-sm font-semibold">
                        Within 48 Hours
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Actions Card */}
            <div className="md:col-span-5 bg-surface-container-low rounded-xl p-6 flex flex-col">
              <h3 className="text-xs font-bold tracking-[0.05em] text-on-surface-variant mb-6 uppercase">
                Next Step
              </h3>
              <p className="text-sm md:text-base text-on-surface-variant mb-8 leading-relaxed">
                To finalize your payment, please confirm your preferred
                distribution method below. You can choose between direct bank
                transfer or local community center pickup.
              </p>
              <div className="mt-auto space-y-4">
                {/* TODO: sambungkan ke data asli — redirect ke /distribution-confirmation */}
                <a
                  href="/distribution-confirmation"
                  className="w-full bg-primary-container text-white font-semibold text-sm py-4 px-6 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all"
                >
                  Confirm Distribution Method
                  <ArrowRight className="w-5 h-5" />
                </a>
                <div className="relative group">
                  <button
                    type="button"
                    disabled
                    className="w-full border border-outline-variant text-outline font-semibold text-sm py-4 px-6 rounded-lg cursor-not-allowed opacity-50 flex items-center justify-center gap-2"
                  >
                    <Gavel className="w-5 h-5" />
                    Appeal Decision
                  </button>
                  {/* Tooltip for Disabled State */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-full max-w-[200px] bg-inverse-surface text-inverse-on-surface text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-center">
                    Appeals are only available for rejected applications.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Transparency Note */}
          <div className="mt-12 text-center max-w-lg mx-auto">
            <p className="text-sm text-on-surface-variant leading-relaxed">
              This decision was reached based on the verified data provided and
              local community validation. All disbursements are subject to
              audit for transparency.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-4 md:px-10 bg-surface-container-low mt-auto border-t border-border-subtle">
        <div className="max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-xs text-on-surface-variant">
          <div className="text-center md:text-left">
            <span className="font-bold tracking-[0.05em] uppercase block mb-2">
              BantuVerif
            </span>
            <p className="text-secondary">
              © 2026 BantuVerif Citizen Platform. Secure &amp; Transparent
              Civic Tech.
            </p>
          </div>
          <nav className="flex flex-wrap justify-center gap-6 font-medium">
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
