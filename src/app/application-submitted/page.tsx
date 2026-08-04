"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  CheckCircle2,
  Copy,
  Check,
  UserCheck,
  LayoutDashboard,
  Download,
  ArrowRight,
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
  const [applicationId, setApplicationId] = useState("#BANTU-2026-8842");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Ambil ID pengajuan dari query param ?id=<uuid> dan tampilkan kode tracking asli
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) return;
    (async () => {
      const { data } = await supabase
        .from("applications")
        .select("tracking_code")
        .eq("id", id)
        .maybeSingle();
      setApplicationId(data?.tracking_code ? `#${data.tracking_code}` : `#${id.slice(0, 8).toUpperCase()}`);
    })();
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(applicationId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard tidak tersedia — abaikan
    }
  };

  // Confetti burst on load
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
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-body flex flex-col selection:bg-[#2563eb] selection:text-white">
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 md:py-16 relative overflow-hidden">
        {/* Confetti Canvas */}
        <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-40" />

        <section className="w-full max-w-[720px] mx-auto">
          {/* Success Card */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-8 md:p-12 text-center shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative z-10">
            {/* Animated Checkmark Circle */}
            <div className="mb-6 flex justify-center">
              <div className="w-24 h-24 md:w-28 md:h-28 bg-[#ecfdf5] border border-[#a7f3d0] rounded-full flex items-center justify-center shadow-xs relative">
                <div className="absolute inset-0 border-4 border-[#10b981] rounded-full opacity-20 scale-110 animate-ping"></div>
                <CheckCircle2 className="w-12 h-12 md:w-14 md:h-14 text-[#10b981]" />
              </div>
            </div>

            <h1 className="text-2xl md:text-4xl font-display font-extrabold text-on-surface mb-3 tracking-tight">
              Pengajuan Berhasil Dikirim!
            </h1>
            <p className="text-sm md:text-base text-on-surface-variant mb-8 max-w-md mx-auto leading-relaxed">
              Terima kasih telah mengirimkan permohonan verifikasi Anda. Detail data Anda telah kami terima dan masuk ke sistem.
            </p>

            {/* Application ID Badge */}
            <div className="inline-flex items-center gap-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-full px-5 py-2.5 mb-10">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                ID PENGAJUAN
              </span>
              <span className="text-sm font-extrabold text-[#2563eb]">{applicationId}</span>
              <button
                onClick={handleCopy}
                className="ml-1 p-1 hover:bg-[#e2e8f0] rounded-full transition-colors text-on-surface-variant"
                title="Salin ID"
                aria-label="Salin ID pengajuan"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Next Steps Grid */}
            <div className="text-left mb-10 grid grid-cols-1 md:grid-cols-12 gap-5">
              <div className="md:col-span-8 bg-[#f8fafc] border border-[#e2e8f0] p-5 rounded-xl">
                <div className="flex gap-3.5 items-start">
                  <div className="bg-[#eff6ff] p-2.5 rounded-lg text-[#2563eb] border border-[#dbeafe] shrink-0">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface mb-1">
                      Langkah Selanjutnya
                    </h3>
                    <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                      Ketua komunitas / Satgas setempat sekarang akan memverifikasi permohonan Anda. Proses ini biasanya memerlukan waktu 2-3 hari kerja.
                    </p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-4 bg-[#f8fafc] border border-[#e2e8f0] p-5 rounded-xl flex flex-col justify-center">
                <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                  PERKIRAAN SELESAI
                </p>
                <p className="text-xl md:text-2xl font-bold font-display text-on-surface">
                  24 Okt 2026
                </p>
              </div>
            </div>

            {/* Action Group */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto min-h-[48px] px-6 py-3 bg-[#2563eb] text-white text-sm font-semibold rounded-lg hover:bg-[#1d4ed8] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                <LayoutDashboard className="w-4.5 h-4.5" />
                <span>Ke Dashboard Saya</span>
              </Link>
              <Link
                href="/tracking"
                className="w-full sm:w-auto min-h-[48px] px-6 py-3 bg-white border border-[#e2e8f0] text-on-surface text-sm font-semibold rounded-lg hover:bg-[#f8fafc] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-2xs"
              >
                <span>Lacak Status Pengajuan</span>
                <ArrowRight className="w-4.5 h-4.5 text-[#2563eb]" />
              </Link>
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full sm:w-auto min-h-[48px] px-5 py-3 border border-[#e2e8f0] bg-white text-on-surface-variant text-sm font-semibold rounded-lg hover:bg-[#f8fafc] transition-all flex items-center justify-center gap-2 shadow-2xs"
              >
                <Download className="w-4.5 h-4.5" />
                <span>Unduh Bukti</span>
              </button>
            </div>
          </div>

          {/* Support Footer */}
          <div className="mt-6 text-center text-xs md:text-sm text-on-surface-variant">
            <p>
              Butuh bantuan?{" "}
              <a href="#" className="text-[#2563eb] font-bold hover:underline">
                Hubungi meja bantuan kami
              </a>{" "}
              atau kunjungi{" "}
              <a href="#" className="text-[#2563eb] font-bold hover:underline">
                FAQ kami
              </a>
              .
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 px-6 bg-white border-t border-[#e2e8f0] mt-auto">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant">
          <div>
            <span className="font-bold text-on-surface uppercase tracking-wider block mb-0.5">
              BANTUVERIF
            </span>
            © 2026 Platform Warga BantuVerif. Teknologi Publik Aman &amp; Transparan.
          </div>
          <div className="flex flex-wrap gap-5 font-medium">
            <a href="#" className="hover:text-primary-container">Kebijakan Privasi</a>
            <a href="#" className="hover:text-primary-container">Syarat &amp; Ketentuan</a>
            <a href="#" className="hover:text-primary-container">FAQ</a>
            <a href="#" className="hover:text-primary-container">Transparansi Audit</a>
            <a href="#" className="hover:text-primary-container">Hubungi Bantuan</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
