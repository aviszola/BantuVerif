"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
import { supabase, isDemoMode, type AppRole, DEFAULT_ROUTE_BY_ROLE } from "@/lib/supabase";

const DEMO_BYPASS = isDemoMode();

export default function LoginPage() {
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

  // Helper: label tampilan per role
  const getRoleName = (role: RegisterRole) => {
    if (role === "rtrw") return "Pengurus RT/RW";
    if (role === "verifikator") return "Verifikator Lapangan (Ops)";
    return "Warga Pemohon";
  };

  // Helper: URL dashboard — ambil dari konstanta terpusat
  const getDashboardUrlForRole = (role: RegisterRole): string =>
    DEFAULT_ROUTE_BY_ROLE[role as AppRole] ?? "/dashboard";

  // Simpan role ke tabel profiles setelah auth sukses
  const persistRole = async (userId: string, role: AppRole) => {
    try {
      // Upsert baris profile secara langsung
      const { error } = await supabase
        .from("profiles")
        .upsert(
          {
            id: userId,
            role: role,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        );

      if (error) {
        console.warn("Upsert role gagal, mencoba update fallback:", error.message);
        await supabase
          .from("profiles")
          .update({ role, updated_at: new Date().toISOString() })
          .eq("id", userId);
      }
    } catch (err) {
      console.error("Gagal simpan role ke DB:", err);
    }
  };

  /**
   * Navigasi ke dashboard yang benar setelah login sukses.
   * Menggunakan full-page navigation (window.location.href) agar cookie Supabase
   * dibaca secara instan oleh middleware Next.js.
   */
  const goToDashboard = async (targetRole: AppRole) => {
    const targetUrl = DEFAULT_ROUTE_BY_ROLE[targetRole] ?? "/dashboard";

    const params = new URLSearchParams(window.location.search);
    const nextUrl = params.get("next");

    const finalDest = nextUrl && nextUrl.startsWith("/") ? nextUrl : targetUrl;

    window.location.href = finalDest;
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
        setIsSuccess(true);
        await goToDashboard(selectedRole as AppRole);
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
    const roleDemoEmails: Record<RegisterRole, string> = {
      warga: "warga.terverifikasi@bantuverif.go.id",
      verifikator: "verifikator.terverifikasi@bantuverif.go.id",
      rtrw: "rtrw.terverifikasi@bantuverif.go.id",
    };
    const demoEmail = identifier.trim() || roleDemoEmails[selectedRole] || "warga.terverifikasi@bantuverif.go.id";
    setIdentifier(demoEmail);
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: demoEmail,
      password: "BantuVerif!2026",
    });
    if (error || !data.session) {
      setIsLoading(false);
      setErrorMessage("Akun demo belum dibuat. Daftar dulu lewat email + OTP.");
      return;
    }
    await persistRole(data.session.user.id, selectedRole as AppRole);
    setIsSuccess(true);
    await goToDashboard(selectedRole as AppRole);
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
    await goToDashboard("rtrw");
  };

  // Quick switch role from side panel
  const handleSelectRoleFromSide = (roleId: RegisterRole) => {
    setSelectedRole(roleId);
    setRoleError("");
  };

  return (