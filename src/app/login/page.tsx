"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  ArrowRight,
  Fingerprint,
  Lock,
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  Shield,
  HelpCircle,
  Sparkles,
} from "lucide-react";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [step, setStep] = useState<"input" | "otp">("input");
  const [identifier, setIdentifier] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmitIdentifier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("otp");
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-body flex flex-col justify-between relative overflow-hidden selection:bg-[#2563eb] selection:text-white">
      {/* Background Subtle Radial Patterns */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-40">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-primary-container/10 bg-radial from-primary-container/5 to-transparent"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full border border-primary-container/5"></div>
      </div>

      {/* Top Navbar / Back Link */}
      <header className="w-full max-w-[1280px] mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-primary-container rounded-lg flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="font-display font-extrabold text-xl tracking-tight text-on-surface">
            Bantu<span className="text-primary-container">Verif</span>
          </span>
        </Link>

        <Link
          href="/"
          className="text-xs font-semibold text-on-surface-variant hover:text-primary-container flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-border-subtle shadow-2xs transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Beranda
        </Link>
      </header>

      {/* Main Centered Auth Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <div className="w-full max-w-[440px] bg-white rounded-2xl border border-border-subtle shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden transition-all">
          {/* Card Header & Content */}
          <div className="p-8 md:p-9">
            {/* Shield Icon Top */}
            <div className="flex justify-center mb-5">
              <div className="w-14 h-14 rounded-full bg-[#eff6ff] text-[#2563eb] border border-[#dbeafe] flex items-center justify-center shadow-2xs">
                <ShieldCheck className="w-7 h-7 text-[#2563eb]" />
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="text-center mb-7">
              <h1 className="text-2xl md:text-[26px] font-extrabold font-display text-on-surface tracking-tight mb-2">
                {isSuccess
                  ? "Verifikasi Berhasil!"
                  : mode === "login"
                  ? "Selamat datang kembali."
                  : "Buat Akun Warga Baru"}
              </h1>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {isSuccess
                  ? "Anda akan dialihkan ke portal warga terverifikasi."
                  : step === "otp"
                  ? `Kode verifikasi OTP telah dikirim ke ${identifier}`
                  : mode === "login"
                  ? "Masuk dengan aman ke portal verifikasi warga Anda."
                  : "Daftarkan identitas Anda untuk mulai pengajuan bantuan."}
              </p>
            </div>

            {/* Success State */}
            {isSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <p className="text-sm font-semibold text-on-surface mb-6">
                  Sesi masuk aman berhasil dibuat.
                </p>
                <Link
                  href="/dashboard"
                  className="btn-48 w-full rounded-lg font-semibold text-sm bg-primary-container text-white hover:bg-primary flex items-center justify-center gap-2 shadow-sm"
                >
                  Masuk ke Portal Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : step === "input" ? (
              /* Step 1: Identifier Input Form */
              <form onSubmit={handleSubmitIdentifier} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-2 uppercase tracking-wider">
                    {mode === "login" ? "Email atau Nomor Telepon / NIK" : "Nomor HP / NIK Terdaftar"}
                  </label>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. nama@contoh.com atau 08123456789"
                    className="w-full h-12 px-4 rounded-lg bg-[#f2f4f6] border border-transparent text-sm text-on-surface placeholder:text-outline outline-none focus:bg-white focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all font-medium"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-48 w-full rounded-lg font-semibold text-[15px] bg-[#2563eb] text-white hover:bg-[#1d4ed8] active:scale-[0.99] shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isLoading ? (
                    <span>Memproses...</span>
                  ) : (
                    <>
                      <span>Lanjutkan</span>
                      <ArrowRight className="w-4.5 h-4.5" />
                    </>
                  )}
                </button>

                {/* OR Divider */}
                <div className="relative flex items-center justify-center my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border-subtle"></div>
                  </div>
                  <span className="relative px-3 bg-white text-[11px] font-bold tracking-widest text-[#737686] uppercase">
                    ATAU
                  </span>
                </div>

                {/* Passkey Button */}
                <button
                  type="button"
                  onClick={() => {
                    setIdentifier("warga.terverifikasi@bantuverif.go.id");
                    setStep("otp");
                  }}
                  className="btn-48 w-full rounded-lg border border-border-subtle bg-white text-on-surface hover:bg-surface-container-low transition-all font-semibold text-sm flex items-center justify-center gap-2.5 shadow-2xs"
                >
                  <Fingerprint className="w-5 h-5 text-primary-container" />
                  <span>Masuk dengan Passkey / Biometrik</span>
                </button>
              </form>
            ) : (
              /* Step 2: OTP Verification Form */
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-bold text-on-surface uppercase tracking-wider">
                      Kode Verifikasi OTP
                    </label>
                    <button
                      type="button"
                      onClick={() => setStep("input")}
                      className="text-xs font-semibold text-primary-container hover:underline"
                    >
                      Ubah NIK/HP
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Masukkan 6 angka OTP"
                    className="w-full h-12 px-4 text-center tracking-[0.3em] text-lg font-bold rounded-lg bg-[#f2f4f6] border border-transparent text-on-surface placeholder:tracking-normal placeholder:text-sm placeholder:font-normal outline-none focus:bg-white focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all"
                  />
                  <p className="text-[12px] text-on-surface-variant mt-2 text-center">
                    Tidak menerima kode?{" "}
                    <button type="button" className="text-primary-container font-semibold hover:underline">
                      Kirim Ulang OTP
                    </button>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-48 w-full rounded-lg font-semibold text-[15px] bg-[#2563eb] text-white hover:bg-[#1d4ed8] active:scale-[0.99] shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isLoading ? (
                    <span>Memverifikasi...</span>
                  ) : (
                    <>
                      <span>Verifikasi & Masuk</span>
                      <CheckCircle2 className="w-4.5 h-4.5" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Mode Switch Link */}
            {!isSuccess && (
              <div className="mt-6 text-center text-xs text-on-surface-variant">
                {mode === "login" ? (
                  <>
                    Belum punya akun warga?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setMode("register");
                        setStep("input");
                      }}
                      className="text-primary-container font-bold hover:underline"
                    >
                      Daftar Baru
                    </button>
                  </>
                ) : (
                  <>
                    Sudah terdaftar?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setMode("login");
                        setStep("input");
                      }}
                      className="text-primary-container font-bold hover:underline"
                    >
                      Masuk Akun
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Card Bottom Security Shield Footer */}
          <div className="bg-[#f2f4f6] border-t border-border-subtle/70 py-3.5 px-6 text-center">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-on-surface-variant">
              <ShieldCheck className="w-4 h-4 text-[#2563eb]" />
              <span>
                Dilindungi secara aman oleh{" "}
                <strong className="text-[#2563eb] font-bold">BantuVerif Privacy Shield</strong>
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Page Bottom Footer */}
      <footer className="w-full max-w-[1280px] mx-auto px-6 py-6 relative z-10 flex flex-col items-center gap-4">
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-on-surface-variant">
          <a href="#" className="hover:text-primary-container transition-colors">Kebijakan Privasi</a>
          <span>•</span>
          <a href="#" className="hover:text-primary-container transition-colors">Butuh Bantuan?</a>
          <span>•</span>
          <a href="#" className="hover:text-primary-container transition-colors">Pusat Keamanan</a>
        </div>

        <div className="w-full pt-4 border-t border-border-subtle/50 flex flex-col sm:flex-row items-center justify-between text-[12px] text-outline gap-2 text-center sm:text-left">
          <div>
            © 2026 Platform Civic BantuVerif. Teknologi Publik Aman & Transparan.
          </div>
          <div className="font-mono text-[11px] font-semibold text-outline-variant">
            V 2.4.0-STABLE
          </div>
        </div>
      </footer>
    </div>
  );
}
