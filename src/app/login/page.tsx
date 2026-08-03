"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
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
  MapPin,
  UploadCloud,
  Check,
} from "lucide-react";
import { REGISTER_ROLES, type RegisterRole } from "@/lib/register";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [step, setStep] = useState<"input" | "otp">("input");
  const [identifier, setIdentifier] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Register role flow state
  const [roleStep, setRoleStep] = useState<"input" | "role" | "wilayah">("input");
  const [selectedRole, setSelectedRole] = useState<RegisterRole | null>(null);
  const [kodeWilayah, setKodeWilayah] = useState("");
  const [skFile, setSkFile] = useState<File | null>(null);
  const [roleError, setRoleError] = useState("");

  const handleSubmitIdentifier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;
    setErrorMessage("");

    if (mode === "register") {
      // Register skips OTP gate (ponytail: add when email confirmation enforced).
      // Advance immediately — don't wait on network; OTP send is best-effort to create the user.
      setStep("input");
      setRoleStep("role");
      supabase.auth
        .signInWithOtp({
          email: identifier,
          options: { shouldCreateUser: true },
        })
        .then(({ error }) => {
          if (error) console.warn("signInWithOtp (register) warning:", error.message);
        })
        .catch((err: any) => console.warn("signInWithOtp (register) failed:", err?.message ?? err));
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: identifier,
        options: {
          shouldCreateUser: true,
        },
      });

      setIsLoading(false);

      if (error) {
        console.error("Supabase signInWithOtp error:", error);
        const msg = error.message && error.message !== "{}" ? error.message : "Gagal mengirim OTP. Periksa konfigurasi SMTP/Auth Logs di Supabase.";
        setErrorMessage(msg);
      } else {
        setStep("otp");
      }
    } catch (err: any) {
      console.error("Unexpected signIn error:", err);
      setIsLoading(false);
      setErrorMessage("Terjadi kesalahan koneksi.");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) return;
    setErrorMessage("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: identifier,
        token: otpCode,
        type: "email",
      });

      setIsLoading(false);

      if (error) {
        console.error("Supabase verifyOtp error:", error);
        const msg = error.message && error.message !== "{}" ? error.message : "Kode OTP tidak valid atau kedaluwarsa.";
        setErrorMessage(msg);
      } else if (data?.session) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      }
    } catch (err: any) {
      console.error("Unexpected verify error:", err);
      setIsLoading(false);
      setErrorMessage("Terjadi kesalahan koneksi.");
    }
  };

  const handleContinueRole = () => {
    if (!selectedRole) {
      setRoleError("Pilih salah satu peran terlebih dahulu.");
      return;
    }
    setRoleError("");
    if (selectedRole === "rtrw") {
      setRoleStep("wilayah");
    } else if (selectedRole === "verifikator") {
      router.push("/dashboard?role=tetangga");
    } else {
      router.push("/dashboard");
    }
  };

  const handleContinueWilayah = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kodeWilayah.trim()) {
      setRoleError("Kode Wilayah RT/RW wajib diisi.");
      return;
    }
    if (!skFile) {
      setRoleError("Unggah dokumen SK penunjukan terlebih dahulu.");
      return;
    }
    setRoleError("");
    router.push("/dashboard-rt");
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
                  : roleStep === "wilayah"
                  ? "Verifikasi Wilayah"
                  : roleStep === "role"
                  ? "Pilih Peran Anda"
                  : "Buat Akun Warga Baru"}
              </h1>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {isSuccess
                  ? "Anda akan dialihkan ke portal warga terverifikasi."
                  : step === "otp"
                  ? `Kode verifikasi OTP telah dikirim ke ${identifier}`
                  : mode === "login"
                  ? "Masuk dengan aman ke portal verifikasi warga Anda."
                  : roleStep === "wilayah"
                  ? "Lengkapi data wilayah RT/RW untuk melanjutkan pendaftaran."
                  : roleStep === "role"
                  ? "Pilih peran Anda di platform BantuVerif."
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
            ) : step === "input" && !(mode === "register" && roleStep !== "input") ? (
              /* Step 1: Identifier Input Form */
              <form onSubmit={handleSubmitIdentifier} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-2 uppercase tracking-wider">
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. nama@contoh.com"
                    className="w-full h-12 px-4 rounded-lg bg-[#f2f4f6] border border-transparent text-sm text-on-surface placeholder:text-outline outline-none focus:bg-white focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all font-medium"
                  />
                  {errorMessage && <p className="text-[#ba1a1a] text-xs font-semibold mt-2">{errorMessage}</p>}
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
            ) : mode === "register" && roleStep === "role" ? (
              /* Step 2: Role Selection */
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {REGISTER_ROLES.map((role) => {
                    const isSelected = selectedRole === role.id;
                    const Icon = role.icon;
                    const accent = role.accent as "blue" | "green" | "amber";
                    const accentStyles: Record<string, { border: string; bg: string; text: string; icon: string }> = {
                      blue: {
                        border: "border-[#2563eb]",
                        bg: "bg-[#eff6ff]",
                        text: "text-[#2563eb]",
                        icon: "bg-[#eff6ff] text-[#2563eb] border-[#dbeafe]",
                      },
                      green: {
                        border: "border-role-verifier",
                        bg: "bg-role-verifier-container/60",
                        text: "text-role-verifier",
                        icon: "bg-role-verifier-container text-role-verifier border-role-verifier/20",
                      },
                      amber: {
                        border: "border-role-rt",
                        bg: "bg-role-rt-container/60",
                        text: "text-role-rt",
                        icon: "bg-role-rt-container text-role-rt border-role-rt/20",
                      },
                    };
                    const s = accentStyles[accent];

                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => {
                          setSelectedRole(role.id);
                          setRoleError("");
                        }}
                        aria-pressed={isSelected}
                        className={`relative text-left rounded-xl border-2 p-4 transition-all cursor-pointer text-center ${
                          isSelected
                            ? `${s.border} ${s.bg} shadow-sm`
                            : "border-[#e2e8f0] bg-white hover:border-outline-variant hover:bg-[#f8fafc]"
                        }`}
                      >
                        {role.badge && (
                          <span className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${s.bg} ${s.text} ${s.border}`}>
                            {role.badge}
                          </span>
                        )}
                        <div className={`w-11 h-11 rounded-full border flex items-center justify-center mx-auto mb-2.5 ${isSelected ? s.icon : "bg-[#f2f4f6] text-on-surface-variant border-[#e2e8f0]"}`}>
                          <Icon className="w-5.5 h-5.5" />
                        </div>
                        <div className={`font-bold text-sm mb-1 ${isSelected ? s.text : "text-on-surface"}`}>
                          {role.label}
                        </div>
                        <p className="text-[11px] leading-snug text-on-surface-variant">
                          {role.description}
                        </p>
                        {isSelected && (
                          <span className={`absolute top-2.5 left-2.5 w-5 h-5 rounded-full text-white flex items-center justify-center ${s.border} ${s.bg}`}>
                            <Check className="w-3 h-3" strokeWidth={3} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {roleError && <p className="text-[#ba1a1a] text-xs font-semibold text-center">{roleError}</p>}

                <button
                  type="button"
                  onClick={handleContinueRole}
                  className="btn-48 w-full rounded-lg font-semibold text-[15px] bg-[#2563eb] text-white hover:bg-[#1d4ed8] active:scale-[0.99] shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Lanjutkan</span>
                  <ArrowRight className="w-4.5 h-4.5" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRoleStep("input");
                    setSelectedRole(null);
                    setRoleError("");
                  }}
                  className="w-full text-xs font-semibold text-on-surface-variant hover:text-primary-container transition-colors inline-flex items-center justify-center gap-1.5 py-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Email
                </button>
              </div>
            ) : mode === "register" && roleStep === "wilayah" ? (
              /* Step 3: RT/RW Wilayah Verification */
              <form onSubmit={handleContinueWilayah} className="space-y-5">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#fef3c7]/50 border border-[#fde68a] text-xs text-[#92400e] leading-relaxed">
                  <Shield className="w-4 h-4 shrink-0 mt-0.5 text-[#d97706]" />
                  <p>
                    Akun akan diverifikasi admin sebelum aktif. Pastikan dokumen SK penunjukan sesuai dengan data wilayah yang Anda isi.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface mb-2 uppercase tracking-wider">
                    Kode Wilayah RT/RW
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-outline" />
                    <input
                      type="text"
                      required
                      value={kodeWilayah}
                      onChange={(e) => setKodeWilayah(e.target.value)}
                      placeholder="Contoh: RT 004 / RW 007, Kel. Sukamaju"
                      className="w-full h-12 pl-10 pr-4 rounded-lg bg-[#f2f4f6] border border-transparent text-sm text-on-surface placeholder:text-outline outline-none focus:bg-white focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface mb-2 uppercase tracking-wider">
                    Dokumen SK Penunjukan
                  </label>
                  <label className="flex flex-col items-center justify-center gap-1.5 w-full h-32 rounded-xl border-2 border-dashed border-border-subtle bg-[#f8fafc] cursor-pointer hover:border-primary-container hover:bg-[#eff6ff] transition-all text-center px-4">
                    <UploadCloud className="w-6 h-6 text-primary-container" />
                    <span className="text-xs font-semibold text-on-surface">
                      {skFile ? skFile.name : "Klik untuk mengunggah dokumen SK"}
                    </span>
                    <span className="text-[11px] text-on-surface-variant">
                      {skFile ? `${(skFile.size / 1024).toFixed(0)} KB` : "PDF / JPG / PNG, maks. 5 MB"}
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => {
                        setSkFile(e.target.files?.[0] ?? null);
                        setRoleError("");
                      }}
                    />
                  </label>
                </div>

                {roleError && <p className="text-[#ba1a1a] text-xs font-semibold text-center">{roleError}</p>}

                <button
                  type="submit"
                  className="btn-48 w-full rounded-lg font-semibold text-[15px] bg-[#2563eb] text-white hover:bg-[#1d4ed8] active:scale-[0.99] shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Kirim & Lanjutkan</span>
                  <ArrowRight className="w-4.5 h-4.5" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRoleStep("role");
                    setKodeWilayah("");
                    setSkFile(null);
                    setRoleError("");
                  }}
                  className="w-full text-xs font-semibold text-on-surface-variant hover:text-primary-container transition-colors inline-flex items-center justify-center gap-1.5 py-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Pilih Peran
                </button>
              </form>
            ) : (
              /* Step 3: OTP Verification Form */
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
                    maxLength={8}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Masukkan kode OTP (6-8 digit)"
                    className="w-full h-12 px-4 text-center tracking-[0.3em] text-lg font-bold rounded-lg bg-[#f2f4f6] border border-transparent text-on-surface placeholder:tracking-normal placeholder:text-sm placeholder:font-normal outline-none focus:bg-white focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all"
                  />
                  <p className="text-[12px] text-on-surface-variant mt-2 text-center">
                    Tidak menerima kode?{" "}
                    <button type="button" onClick={handleSubmitIdentifier} className="text-primary-container font-semibold hover:underline">
                      Kirim Ulang OTP
                    </button>
                  </p>
                  {errorMessage && <p className="text-[#ba1a1a] text-xs font-semibold mt-2 text-center">{errorMessage}</p>}
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
                        setRoleStep("input");
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
                        setRoleStep("input");
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
