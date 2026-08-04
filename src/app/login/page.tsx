"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
  Home,
  Users,
  Award,
  Info,
  Building2,
  ChevronRight,
  UserCheck,
  Zap,
} from "lucide-react";
import { REGISTER_ROLES, type RegisterRole } from "@/lib/register";
import { supabase, isDemoMode, type AppRole } from "@/lib/supabase";

const DEMO_BYPASS = isDemoMode();

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
  const [selectedRole, setSelectedRole] = useState<RegisterRole>("warga");
  const [kodeWilayah, setKodeWilayah] = useState("");
  const [skFile, setSkFile] = useState<File | null>(null);
  const [roleError, setRoleError] = useState("");

  // Helper mapping destination URL & Label based on selected role
  const getDashboardUrlForRole = (role: RegisterRole) => {
    if (role === "rtrw") return "/dashboard-rt";
    if (role === "verifikator") return "/ops/verifications";
    return "/dashboard";
  };

  const getRoleName = (role: RegisterRole) => {
    if (role === "rtrw") return "Pengurus RT/RW";
    if (role === "verifikator") return "Verifikator Lapangan (Ops)";
    return "Warga Pemohon";
  };

  // Simpan role ke tabel profiles setelah auth sukses (jika belum ada)
  const persistRole = async (userId: string, role: AppRole) => {
    const { error } = await supabase.from("profiles").upsert(
      { id: userId, role },
      { onConflict: "id" }
    );
    if (error) console.warn("Persist role gagal:", error.message);
  };

  const goToDashboard = (role: RegisterRole, delayMs = 1000) => {
    const targetUrl = getDashboardUrlForRole(role);
    setTimeout(() => router.push(targetUrl), delayMs);
    return targetUrl;
  };

  const handleSubmitIdentifier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;
    setErrorMessage("");

    if (mode === "register") {
      setStep("input");
      if (selectedRole === "rtrw" && roleStep === "input") {
        setRoleStep("wilayah");
      } else {
        setRoleStep("role");
      }
      supabase.auth
        .signInWithOtp({
          email: identifier,
          options: { shouldCreateUser: true },
        })
        .then(({ error }) => {
          if (error) console.warn("signInWithOtp (register) warning:", error.message);
        })
        .catch((err) => console.warn("signInWithOtp (register) failed:", err?.message ?? err));
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
        // Fallback for dev/demo if OTP email isn't configured
        setStep("otp");
      } else {
        setStep("otp");
      }
    } catch (err: any) {
      console.error("Unexpected signIn error:", err);
      setIsLoading(false);
      setStep("otp");
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

      if (error) {
        setIsLoading(false);
        setErrorMessage("Kode OTP salah atau kedaluwarsa. Coba lagi.");
        return;
      }

      if (data?.session) {
        await persistRole(data.session.user.id, selectedRole);
        setIsLoading(false);
        setIsSuccess(true);
        goToDashboard(selectedRole);
      }
    } catch {
      setIsLoading(false);
      setErrorMessage("Terjadi kesalahan saat verifikasi. Coba lagi.");
    }
  };

  const handlePasskeyLogin = async () => {
    if (!DEMO_BYPASS) {
      setErrorMessage("Fitur demo dinonaktifkan. Gunakan email + OTP.");
      return;
    }
    const demoEmail = identifier || "warga.terverifikasi@bantuverif.go.id";
    setIdentifier(demoEmail);
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: demoEmail,
      password: "BantuVerif!2026",
    });
    setIsLoading(false);
    if (error || !data.session) {
      setErrorMessage("Akun demo belum dibuat. Daftar dulu lewat email + OTP.");
      return;
    }
    await persistRole(data.session.user.id, selectedRole);
    setIsSuccess(true);
    goToDashboard(selectedRole);
  };

  const handleContinueRole = async () => {
    if (!selectedRole) {
      setRoleError("Pilih salah satu peran terlebih dahulu.");
      return;
    }
    setRoleError("");
    if (selectedRole === "rtrw") {
      setRoleStep("wilayah");
      return;
    }
    // warga & verifikator: lanjut ke OTP (email sudah dikirim saat submit identitas)
    setStep("otp");
  };

  const handleContinueWilayah = async (e: React.FormEvent) => {
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
    setIsLoading(true);

    // Pastikan kode OTP sudah dikirim ke email (untuk alur RT/RW yang
    // melewati step wilayah langsung)
    if (!otpCode.trim()) {
      const { error } = await supabase.auth.signInWithOtp({
        email: identifier,
        options: { shouldCreateUser: true },
      });
      setIsLoading(false);
      if (error) {
        setRoleError("Gagal mengirim kode OTP. Coba lagi.");
        return;
      }
      setRoleError("Kode OTP telah dikirim ke email Anda. Masukkan kode di kolom di atas.");
      return;
    }

    const { data, error } = await supabase.auth.verifyOtp({
      email: identifier,
      token: otpCode,
      type: "email",
    });
    setIsLoading(false);
    if (error || !data.session) {
      setRoleError("Verifikasi OTP gagal. Pastikan email & kode benar.");
      return;
    }
    await persistRole(data.session.user.id, "rtrw");
    setIsSuccess(true);
    goToDashboard("rtrw");
  };

  // Quick switch role from side panel
  const handleSelectRoleFromSide = (roleId: RegisterRole) => {
    setSelectedRole(roleId);
    setRoleError("");
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-body flex flex-col justify-between relative overflow-hidden selection:bg-[#2563eb] selection:text-white">
      {/* Background Decorative Ambient Circles */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-40">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-blue-400/10 blur-3xl"></div>
        <div className="absolute top-1/2 -right-40 w-[700px] h-[700px] rounded-full bg-emerald-400/10 blur-3xl"></div>
      </div>

      {/* Top Navbar */}
      <header className="w-full max-w-[1280px] mx-auto px-6 py-5 flex items-center justify-between relative z-10">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="font-display font-extrabold text-xl tracking-tight text-on-surface">
              Bantu<span className="text-primary-container">Verif</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
              Portal Akses Publik
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="text-xs font-semibold text-on-surface-variant hover:text-primary-container flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-border-subtle shadow-2xs transition-all hover:shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Beranda
        </Link>
      </header>

      {/* Main Grid Container (Form + Illustration & Role Selector Side-by-Side) */}
      <main className="flex-1 flex items-center justify-center px-4 py-6 md:py-8 relative z-10">
        <div className="w-full max-w-[1140px] grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* LEFT / PRIMARY FORM COLUMN (lg:col-span-6 or 5) */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center">
            <div className="bg-white rounded-2xl border border-border-subtle shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden transition-all flex flex-col h-full justify-between">
              
              {/* Header & Tabs */}
              <div>
                <div className="p-6 pb-4 border-b border-border-subtle bg-slate-50/60">
                  {/* Mode Selector Tabs (Login vs Register) */}
                  <div className="flex bg-slate-200/80 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => {
                        setMode("login");
                        setStep("input");
                        setRoleStep("input");
                        setErrorMessage("");
                      }}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                        mode === "login"
                          ? "bg-white text-primary-container shadow-2xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <Lock className="w-3.5 h-3.5" /> Masuk Akun
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMode("register");
                        setStep("input");
                        setRoleStep("input");
                        setErrorMessage("");
                      }}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                        mode === "register"
                          ? "bg-white text-primary-container shadow-2xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <UserCheck className="w-3.5 h-3.5" /> Daftar Baru
                    </button>
                  </div>
                </div>

                {/* Form Inner Content */}
                <div className="p-6 md:p-8">
                  {/* Active Selected Role Banner */}
                  <div className="mb-6 p-3.5 rounded-xl bg-blue-50/80 border border-blue-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8.5 h-8.5 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                        {selectedRole === "warga" ? (
                          <Home className="w-4.5 h-4.5" />
                        ) : selectedRole === "verifikator" ? (
                          <Users className="w-4.5 h-4.5" />
                        ) : (
                          <ShieldCheck className="w-4.5 h-4.5" />
                        )}
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-blue-900 uppercase tracking-wider">
                          Target Peran / Dashboard
                        </div>
                        <div className="text-xs font-bold text-blue-700">
                          {getRoleName(selectedRole)}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-blue-700 bg-blue-100/90 px-2.5 py-1 rounded-md font-semibold border border-blue-200">
                      Ubah Role
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="mb-6">
                    <h1 className="text-2xl font-extrabold font-display text-on-surface tracking-tight mb-1.5">
                      {isSuccess
                        ? "Verifikasi Berhasil!"
                        : mode === "login"
                        ? `Masuk (${getRoleName(selectedRole)})`
                        : roleStep === "wilayah"
                        ? "Verifikasi Dokumen RT/RW"
                        : roleStep === "role"
                        ? "Pilih Peran Pendaftaran"
                        : `Registrasi (${getRoleName(selectedRole)})`}
                    </h1>
                    <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                      {isSuccess
                        ? `Mengalihkan Anda ke portal dashboard ${getRoleName(selectedRole)}...`
                        : step === "otp"
                        ? `Kode verifikasi OTP telah dikirim ke ${identifier}`
                        : mode === "login"
                        ? `Masuk secara aman untuk mengakses dashboard ${getRoleName(selectedRole)}.`
                        : roleStep === "wilayah"
                        ? "Lengkapi identitas wilayah RT/RW dan unggah dokumen SK."
                        : roleStep === "role"
                        ? "Pilih peran Anda untuk menyesuaikan hak akses aplikasi."
                        : `Daftarkan email Anda untuk mulai akses portal ${getRoleName(selectedRole)}.`}
                    </p>
                  </div>

                  {/* SUCCESS STATE */}
                  {isSuccess ? (
                    <div className="text-center py-6">
                      <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
                        <CheckCircle2 className="w-10 h-10" />
                      </div>
                      <p className="text-sm font-semibold text-on-surface mb-2">
                        Sesi masuk aman berhasil dibuat.
                      </p>
                      <p className="text-xs text-blue-600 font-bold mb-6">
                        Menuju: {getRoleName(selectedRole)} ({getDashboardUrlForRole(selectedRole)})
                      </p>
                      <Link
                        href={getDashboardUrlForRole(selectedRole)}
                        className="btn-48 w-full rounded-lg font-semibold text-sm bg-primary-container text-white hover:bg-primary flex items-center justify-center gap-2 shadow-sm"
                      >
                        Buka Dashboard ({getRoleName(selectedRole)}) <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  ) : step === "input" && !(mode === "register" && roleStep !== "input") ? (
                    /* STEP 1: Email Form */
                    <form onSubmit={handleSubmitIdentifier} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-on-surface mb-1.5 uppercase tracking-wider">
                          Alamat Email Aktif
                        </label>
                        <input
                          type="email"
                          required
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          placeholder="contoh: nama@email.com"
                          className="w-full h-11 px-4 rounded-xl bg-[#f2f4f6] border border-transparent text-sm text-on-surface placeholder:text-outline outline-none focus:bg-white focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all font-medium"
                        />
                        {errorMessage && (
                          <p className="text-[#ba1a1a] text-xs font-semibold mt-2">{errorMessage}</p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-48 w-full rounded-xl font-semibold text-sm bg-[#2563eb] text-white hover:bg-[#1d4ed8] active:scale-[0.99] shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                      >
                        {isLoading ? (
                          <span>Memproses...</span>
                        ) : (
                          <>
                            <span>
                              {mode === "login"
                                ? `Masuk Ke ${getRoleName(selectedRole)}`
                                : `Daftar Sebagai ${getRoleName(selectedRole)}`}
                            </span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>

                      {/* OR Divider */}
                      <div className="relative flex items-center justify-center my-4">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-border-subtle"></div>
                        </div>
                        <span className="relative px-3 bg-white text-[10px] font-bold tracking-widest text-[#737686] uppercase">
                          ATAU OPSI CEPAT
                        </span>
                      </div>

                      {/* Passkey / Demo Quick Button */}
                      <button
                        type="button"
                        onClick={handlePasskeyLogin}
                        className="w-full h-11 rounded-xl border border-border-subtle bg-white text-on-surface hover:bg-slate-50 transition-all font-semibold text-xs flex items-center justify-center gap-2 shadow-2xs"
                      >
                        <Fingerprint className="w-4.5 h-4.5 text-primary-container" />
                        <span>Masuk Instan Passkey ({getRoleName(selectedRole)})</span>
                      </button>
                    </form>
                  ) : mode === "register" && roleStep === "role" ? (
                    /* STEP 2: Role Selection inside Form */
                    <div className="space-y-4 animate-fade-in-up">
                      <div className="space-y-2.5">
                        {REGISTER_ROLES.map((role) => {
                          const isSelected = selectedRole === role.id;
                          const Icon = role.icon;
                          return (
                            <button
                              key={role.id}
                              type="button"
                              onClick={() => {
                                setSelectedRole(role.id);
                                setRoleError("");
                              }}
                              className={`w-full text-left p-3.5 rounded-xl border-2 transition-all flex items-start gap-3 ${
                                isSelected
                                  ? "border-blue-600 bg-blue-50/60 shadow-2xs"
                                  : "border-slate-200 bg-white hover:border-slate-300"
                              }`}
                            >
                              <div
                                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                                  isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                <Icon className="w-4.5 h-4.5" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-xs text-slate-900">{role.label}</span>
                                  {isSelected && (
                                    <Check className="w-4 h-4 text-blue-600" strokeWidth={3} />
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                                  {role.description}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {roleError && (
                        <p className="text-[#ba1a1a] text-xs font-semibold text-center">{roleError}</p>
                      )}

                      <button
                        type="button"
                        onClick={handleContinueRole}
                        className="btn-48 w-full rounded-xl font-semibold text-sm bg-[#2563eb] text-white hover:bg-[#1d4ed8] transition-all flex items-center justify-center gap-2"
                      >
                        <span>Konfirmasi & Buka {getRoleName(selectedRole)}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setRoleStep("input")}
                        className="w-full text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors inline-flex items-center justify-center gap-1 py-1"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Ulangi Email
                      </button>
                    </div>
                  ) : mode === "register" && roleStep === "wilayah" ? (
                    /* STEP 3: Wilayah RT/RW */
                    <form onSubmit={handleContinueWilayah} className="space-y-4 animate-fade-in-up">
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2.5">
                        <Shield className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                        <p className="leading-snug">
                          Akun RT/RW membutuhkan verifikasi admin. Unggah SK resmi untuk pembukaan akses.
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-on-surface mb-1.5 uppercase tracking-wider">
                          Kode Wilayah RT/RW
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            required
                            value={kodeWilayah}
                            onChange={(e) => setKodeWilayah(e.target.value)}
                            placeholder="Contoh: RT 004 / RW 007, Kel. Sukamaju"
                            className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#f2f4f6] border border-transparent text-sm outline-none focus:bg-white focus:border-blue-600 font-medium"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-on-surface mb-1.5 uppercase tracking-wider">
                          Unggah Dokumen SK Penunjukan
                        </label>
                        <label className="flex flex-col items-center justify-center gap-1 w-full h-28 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-blue-50/50 hover:border-blue-400 cursor-pointer transition-all text-center px-4">
                          <UploadCloud className="w-5 h-5 text-blue-600" />
                          <span className="text-xs font-semibold text-slate-700 truncate max-w-full">
                            {skFile ? skFile.name : "Klik untuk upload SK Penunjukan"}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {skFile ? `${(skFile.size / 1024).toFixed(0)} KB` : "PDF / JPG / PNG (Maks 5MB)"}
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

                      <div>
                        <label className="block text-xs font-bold text-on-surface mb-1.5 uppercase tracking-wider">
                          Kode OTP Email
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={8}
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          placeholder="Masukkan 6 digit kode OTP dari email Anda"
                          className="w-full h-11 px-4 rounded-xl bg-[#f2f4f6] border border-transparent text-sm outline-none focus:bg-white focus:border-blue-600 font-medium"
                        />
                        <p className="text-[11px] text-slate-500 mt-1.5">
                          Kode OTP dikirim ke {identifier || "email Anda"} saat pendaftaran.
                        </p>
                      </div>

                      {roleError && (
                        <p className="text-[#ba1a1a] text-xs font-semibold text-center">{roleError}</p>
                      )}

                      <button
                        type="submit"
                        className="btn-48 w-full rounded-xl font-semibold text-sm bg-[#2563eb] text-white hover:bg-[#1d4ed8] transition-all flex items-center justify-center gap-2"
                      >
                        <span>Kirim Dokumen & Masuk Dashboard RT/RW</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  ) : (
                    /* STEP OTP VERIFY */
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-on-surface mb-1.5 uppercase tracking-wider text-center">
                          Masukkan 6-Digit Kode OTP
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={8}
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          placeholder="KODE OTP"
                          className="w-full h-12 text-center tracking-[0.4em] text-lg font-extrabold rounded-xl bg-[#f2f4f6] border border-transparent outline-none focus:bg-white focus:border-blue-600 transition-all"
                        />
                        {errorMessage && (
                          <p className="text-[#ba1a1a] text-xs font-semibold mt-2 text-center">{errorMessage}</p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-48 w-full rounded-xl font-semibold text-sm bg-[#2563eb] text-white hover:bg-[#1d4ed8] transition-all flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <span>Memverifikasi...</span>
                        ) : (
                          <>
                            <span>Verifikasi & Masuk Dashboard {getRoleName(selectedRole)}</span>
                            <CheckCircle2 className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="bg-slate-50 border-t border-border-subtle py-3 px-6 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Enkripsi Kriptografi & Privasi Data Terjamin</span>
              </div>
            </div>
          </div>

          {/* RIGHT / ILLUSTRATION & ROLE SELECTOR COLUMN (lg:col-span-6 or 7) */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-between space-y-6">
            
            {/* Visual Banner Card with Hero Illustration */}
            <div className="relative rounded-2xl overflow-hidden border border-border-subtle bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white p-6 md:p-8 shadow-md">
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                {/* Illustration Image */}
                <div className="w-full md:w-1/2 relative h-48 md:h-56 rounded-xl overflow-hidden shadow-lg border border-white/10 group">
                  <Image
                    src="/hero-community.png"
                    alt="Ilustrasi Komunitas BantuVerif"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-semibold text-white/90">
                    <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Verifikasi Presisi
                    </span>
                    <span className="bg-emerald-500/80 text-white px-2 py-0.5 rounded text-[10px] font-bold">
                      LIVE DATA
                    </span>
                  </div>
                </div>

                {/* Banner Content */}
                <div className="w-full md:w-1/2 space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
                    <Building2 className="w-3.5 h-3.5" /> Portal Gotong Royong
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold font-display leading-tight text-white">
                    Verifikasi Bansos Lebih Adil & Transparan
                  </h2>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Sistem verifikasi berjenjang menghubungkan warga, tetangga verifikator, dan pengurus RT/RW demi kemudahan bantuan tepat sasaran.
                  </p>
                  <div className="pt-1 flex items-center gap-4 text-xs font-semibold text-emerald-400">
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% Bebas Pungli
                    </div>
                    <div className="flex items-center gap-1">
                      <Shield className="w-4 h-4 text-blue-400" /> Desentralisasi Data
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Role Selector Cards Side Panel ("Pilihan Role Akses") */}
            <div className="bg-white rounded-2xl border border-border-subtle p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold font-display text-slate-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    Pilih Peran Akses Anda
                  </h3>
                  <p className="text-xs text-slate-500">
                    Klik peran di bawah ini untuk berpindah mode dan menentukan tujuan dashboard Anda.
                  </p>
                </div>
                <span className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                  3 Opsi Peran
                </span>
              </div>

              {/* Grid of 3 Role Selector Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {REGISTER_ROLES.map((r) => {
                  const active = selectedRole === r.id;
                  const Icon = r.icon;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleSelectRoleFromSide(r.id)}
                      className={`text-left p-4 rounded-xl border-2 transition-all relative group cursor-pointer flex flex-col justify-between ${
                        active
                          ? "border-blue-600 bg-blue-50/70 shadow-sm ring-2 ring-blue-600/20"
                          : "border-slate-200 bg-slate-50/50 hover:border-blue-300 hover:bg-white"
                      }`}
                    >
                      {active && (
                        <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5" strokeWidth={3} />
                        </span>
                      )}
                      <div>
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors ${
                            active
                              ? "bg-blue-600 text-white"
                              : "bg-white text-slate-700 border border-slate-200 group-hover:border-blue-400 group-hover:text-blue-600"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="font-bold text-xs text-slate-900 mb-1">{r.label}</div>
                        <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                          {r.description}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-semibold">
                        <span className={active ? "text-blue-700 font-bold" : "text-slate-500"}>
                          {r.id === "warga" ? "→ /dashboard" : r.id === "verifikator" ? "→ /ops/verifications" : "→ /dashboard-rt"}
                        </span>
                        <ChevronRight
                          className={`w-3.5 h-3.5 transition-transform ${
                            active ? "text-blue-600 translate-x-0.5" : "text-slate-400"
                          }`}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Feature Checklist based on Selected Role */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>Tujuan Dashboard: <span className="text-blue-600 font-extrabold">{getDashboardUrlForRole(selectedRole)}</span></span>
                  <Zap className="w-4 h-4 text-amber-500" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600">
                  {selectedRole === "warga" && (
                    <>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        Pengajuan bansos mandiri
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        Pelacakan status real-time
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        Riwayat verifikasi & penerimaan
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        Akses QR bukti penerimaan
                      </div>
                    </>
                  )}
                  {selectedRole === "verifikator" && (
                    <>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        Form validasi survei lapangan
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        Penilaian indikator ekonomi
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        Cross-check tetangga anonim
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        Upload bukti kelayakan fisik
                      </div>
                    </>
                  )}
                  {selectedRole === "rtrw" && (
                    <>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        Dashboard Rekapitulasi RT/RW
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        Otorisasi rekomendasi wilayah
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        Verifikasi berkas fisik warga
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        Laporan penyaluran kuota
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Page Footer */}
      <footer className="w-full max-w-[1280px] mx-auto px-6 py-5 relative z-10 flex flex-col items-center gap-3">
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-500">
          <a href="#" className="hover:text-blue-600 transition-colors">Kebijakan Privasi</a>
          <span>•</span>
          <a href="#" className="hover:text-blue-600 transition-colors">Pusat Bantuan Bansos</a>
          <span>•</span>
          <a href="#" className="hover:text-blue-600 transition-colors">Keamanan Data NIK</a>
        </div>

        <div className="w-full pt-3 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2 text-center sm:text-left">
          <div>
            © 2026 Platform Verifikasi Bansos Transparan (BantuVerif).
          </div>
          <div className="font-mono font-semibold">
            V 2.4.0-STABLE
          </div>
        </div>
      </footer>
    </div>
  );
}
