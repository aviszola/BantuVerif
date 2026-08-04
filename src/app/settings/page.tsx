"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import PortalSidebar from "@/components/PortalSidebar";
import {
  User,
  Shield,
  KeyRound,
  Bell,
  CheckCircle2,
  Lock,
  Smartphone,
  Mail,
  MapPin,
  Camera,
  Save,
  ShieldCheck,
  BadgeCheck,
  Eye,
  EyeOff,
  LogOut,
  Sparkles,
  AlertCircle,
  QrCode,
  Laptop,
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "notifications" | "verification">("profile");
  const [user, setUser] = useState<any>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [fullName, setFullName] = useState("Budi Santoso");
  const [nik, setNik] = useState("3171012345670001");
  const [email, setEmail] = useState("budi.santoso@example.com");
  const [phone, setPhone] = useState("81234567890");
  const [address, setAddress] = useState("Jl. Kebon Sirih No. 42, RT 003/RW 005, Kel. Gambir, Kec. Gambir, Jakarta Pusat");

  // Security states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // Notification states
  const [waNotify, setWaNotify] = useState(true);
  const [emailNotify, setEmailNotify] = useState(true);
  const [auditConsent, setAuditConsent] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        if (session.user.email) setEmail(session.user.email);
        // Ambil profil dari DB
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .maybeSingle();
        if (profile) {
          if (profile.full_name) setFullName(profile.full_name);
          if (profile.nik) setNik(profile.nik);
          if (profile.phone) setPhone(profile.phone);
          if (profile.address) setAddress(profile.address);
        }
      }
    };
    fetchSession();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const { error } = await supabase.from("profiles").update({
      full_name: fullName,
      nik,
      phone,
      address,
    }).eq("id", user.id);
    if (error) {
      console.error("Gagal menyimpan profil:", error.message);
      return;
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-on-surface font-body flex flex-col selection:bg-primary-container selection:text-white">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-6 md:py-8 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
          {/* Unified Left Navigation Sidebar */}
          <PortalSidebar active="settings" />

          {/* Main Content Area (9 cols) */}
          <main className="lg:col-span-9 space-y-6">
            
            {/* Settings Header Banner */}
            <div className="bg-white border border-border-subtle rounded-2xl p-6 md:p-8 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider mb-2">
                  <ShieldCheck className="w-4 h-4" />
                  PENGATURAN AKUN WARGA
                </div>
                <h1 className="font-display text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight mb-1">
                  Kelola Profil &amp; Keamanan Akun
                </h1>
                <p className="text-on-surface-variant text-xs md:text-sm leading-relaxed max-w-xl">
                  Perbarui informasi pribadi, pengaturan otentikasi dua langkah, dan preferensi notifikasi untuk keamanan maksimal.
                </p>
              </div>

              {/* Status Badge */}
              <div className="shrink-0 bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-xs">
                  <BadgeCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-900">Level Verifikasi 3</div>
                  <div className="text-[11px] text-emerald-700">Dukcapil &amp; Biometrik Aktif</div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs Bar */}
            <div className="bg-white border border-border-subtle rounded-2xl p-2 shadow-2xs flex overflow-x-auto gap-1">
              {[
                { id: "profile", label: "Profil Warga", icon: User },
                { id: "security", label: "Keamanan & Sandi", icon: KeyRound },
                { id: "notifications", label: "Notifikasi & Privasi", icon: Bell },
                { id: "verification", label: "Status Verifikasi", icon: ShieldCheck },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2.5 px-4 py-3 rounded-xl font-semibold text-xs md:text-sm whitespace-nowrap transition-all flex-1 justify-center ${
                      isActive
                        ? "bg-primary text-white shadow-sm"
                        : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Toast Success Notification */}
            {isSaved && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-xs md:text-sm font-semibold text-emerald-900">
                  Perubahan pengaturan berhasil disimpan dan diperbarui di sistem.
                </span>
              </div>
            )}

            {/* TAB 1: PROFIL WARGA */}
            {activeTab === "profile" && (
              <form onSubmit={handleSaveProfile} className="space-y-6">
                
                {/* Photo & Basic Info Card */}
                <div className="bg-white border border-border-subtle rounded-2xl p-6 md:p-8 shadow-level1 space-y-6">
                  <h2 className="font-display text-lg font-bold text-on-surface flex items-center gap-2 border-b border-border-subtle pb-4">
                    <User className="w-5 h-5 text-primary" />
                    Foto &amp; Data Resmi Kependudukan
                  </h2>

                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary text-primary font-black text-3xl flex items-center justify-center shadow-md">
                        {fullName.charAt(0)}
                      </div>
                      <button
                        type="button"
                        className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                        title="Ganti Foto Profil"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-on-surface">{fullName}</h3>
                      <p className="text-xs text-on-surface-variant mb-2">NIK: {nik}</p>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Terverifikasi Dukcapil KTP-el
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <div className="flex flex-col gap-2">
                      <label className="font-semibold text-xs text-on-surface uppercase tracking-wider">
                        Nama Lengkap (Sesuai KTP)
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="h-12 bg-surface-container-low border border-border-subtle rounded-xl px-4 text-sm focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-semibold text-xs text-on-surface uppercase tracking-wider">
                        Nomor Induk Kependudukan (NIK)
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          disabled
                          value={nik}
                          className="h-12 bg-surface-container-low/70 border border-border-subtle rounded-xl px-4 text-sm text-on-surface-variant font-mono outline-none w-full cursor-not-allowed"
                        />
                        <Lock className="w-4 h-4 text-outline absolute right-4 top-1/2 -translate-y-1/2" />
                      </div>
                      <span className="text-[11px] text-on-surface-variant">NIK telah dikunci setelah verifikasi KTP resmi.</span>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-semibold text-xs text-on-surface uppercase tracking-wider">
                        Alamat Email
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="h-12 bg-surface-container-low border border-border-subtle rounded-xl px-4 pl-10 text-sm focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all w-full"
                        />
                        <Mail className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-semibold text-xs text-on-surface uppercase tracking-wider">
                        Nomor Handphone (WhatsApp)
                      </label>
                      <div className="flex gap-2">
                        <div className="w-16 bg-surface-container-highest flex items-center justify-center rounded-xl font-bold text-xs text-on-surface shrink-0 h-12">
                          +62
                        </div>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="flex-1 h-12 bg-surface-container-low border border-border-subtle rounded-xl px-4 text-sm focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="font-semibold text-xs text-on-surface uppercase tracking-wider">
                        Alamat Domisili Lengkap
                      </label>
                      <div className="relative">
                        <textarea
                          rows={3}
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="p-4 pl-10 bg-surface-container-low border border-border-subtle rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all w-full"
                        />
                        <MapPin className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-4" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="h-12 px-8 bg-primary text-white font-bold text-sm rounded-xl hover:bg-primary-container active:scale-[0.98] transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <Save className="w-4 h-4" />
                    Simpan Perubahan Profil
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: KEAMANAN & SANDI */}
            {activeTab === "security" && (
              <div className="space-y-6">
                
                {/* Change Password Card */}
                <div className="bg-white border border-border-subtle rounded-2xl p-6 md:p-8 shadow-level1 space-y-6">
                  <h2 className="font-display text-lg font-bold text-on-surface flex items-center gap-2 border-b border-border-subtle pb-4">
                    <KeyRound className="w-5 h-5 text-primary" />
                    Ubah Kata Sandi
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="font-semibold text-xs text-on-surface uppercase tracking-wider">
                        Kata Sandi saat Ini
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••••••"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="h-12 bg-surface-container-low border border-border-subtle rounded-xl px-4 text-sm focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all w-full"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-semibold text-xs text-on-surface uppercase tracking-wider">
                        Kata Sandi Baru
                      </label>
                      <input
                        type="password"
                        placeholder="Minimal 8 karakter"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="h-12 bg-surface-container-low border border-border-subtle rounded-xl px-4 text-sm focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all w-full"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-semibold text-xs text-on-surface uppercase tracking-wider">
                        Konfirmasi Kata Sandi Baru
                      </label>
                      <input
                        type="password"
                        placeholder="Ketik ulang kata sandi baru"
                        className="h-12 bg-surface-container-low border border-border-subtle rounded-xl px-4 text-sm focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all w-full"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsSaved(true);
                      setTimeout(() => setIsSaved(false), 3000);
                    }}
                    className="h-11 px-6 bg-primary text-white font-bold text-xs md:text-sm rounded-xl hover:bg-primary-container transition-all flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Perbarui Kata Sandi
                  </button>
                </div>

                {/* 2FA Card */}
                <div className="bg-white border border-border-subtle rounded-2xl p-6 md:p-8 shadow-level1 space-y-6">
                  <div className="flex items-start justify-between gap-4 border-b border-border-subtle pb-4">
                    <div>
                      <h2 className="font-display text-lg font-bold text-on-surface flex items-center gap-2">
                        <Shield className="w-5 h-5 text-emerald-600" />
                        Otentikasi Dua Langkah (2FA)
                      </h2>
                      <p className="text-xs text-on-surface-variant mt-1">
                        Lindungi akun Anda dengan kode otentikator sekali pakai (OTP) saat masuk.
                      </p>
                    </div>

                    {/* Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                      className={`w-14 h-8 rounded-full p-1 transition-colors duration-200 ease-in-out shrink-0 ${
                        twoFactorEnabled ? "bg-emerald-500" : "bg-surface-container-highest"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                          twoFactorEnabled ? "translate-x-6" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {twoFactorEnabled && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-4">
                      <QrCode className="w-10 h-10 text-emerald-700 shrink-0" />
                      <div>
                        <h4 className="text-xs font-bold text-emerald-900">2FA Berbasis Aplikasi (TOTP) Aktif</h4>
                        <p className="text-[11px] text-emerald-700">
                          Kode verifikasi terhubung dengan Google Authenticator / Aplikasi Keamanan Publik Anda.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Active Sessions */}
                <div className="bg-white border border-border-subtle rounded-2xl p-6 md:p-8 shadow-level1 space-y-4">
                  <h2 className="font-display text-lg font-bold text-on-surface flex items-center gap-2 border-b border-border-subtle pb-4">
                    <Laptop className="w-5 h-5 text-primary" />
                    Sesi Aktif Saat Ini
                  </h2>

                  <div className="flex items-center justify-between p-4 bg-surface-container-low border border-border-subtle rounded-xl">
                    <div className="flex items-center gap-3">
                      <Laptop className="w-8 h-8 text-primary shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-on-surface">Windows PC — Google Chrome</p>
                        <p className="text-[11px] text-on-surface-variant">Jakarta, Indonesia • Aktif Sekarang (Sesi Ini)</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      Perangkat Ini
                    </span>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 3: NOTIFIKASI & PRIVASI */}
            {activeTab === "notifications" && (
              <div className="bg-white border border-border-subtle rounded-2xl p-6 md:p-8 shadow-level1 space-y-6">
                <h2 className="font-display text-lg font-bold text-on-surface flex items-center gap-2 border-b border-border-subtle pb-4">
                  <Bell className="w-5 h-5 text-primary" />
                  Preferensi Notifikasi Bantuan &amp; Privasi Data
                </h2>

                <div className="space-y-5">
                  <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-border-subtle">
                    <div>
                      <h4 className="text-sm font-bold text-on-surface">Notifikasi WhatsApp Real-time</h4>
                      <p className="text-xs text-on-surface-variant">
                        Kirim pembaruan status pengajuan dan instruksi pencairan ke nomor WhatsApp terdaftar.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setWaNotify(!waNotify)}
                      className={`w-12 h-7 rounded-full p-1 transition-colors ${
                        waNotify ? "bg-primary" : "bg-surface-container-highest"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white shadow-xs transform transition-transform ${waNotify ? "translate-x-5" : ""}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-border-subtle">
                    <div>
                      <h4 className="text-sm font-bold text-on-surface">Laporan &amp; Ringkasan Email Bulanan</h4>
                      <p className="text-xs text-on-surface-variant">
                        Terima transparansi audit penyaluran dan pengumuman kriteria bantuan terbaru.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEmailNotify(!emailNotify)}
                      className={`w-12 h-7 rounded-full p-1 transition-colors ${
                        emailNotify ? "bg-primary" : "bg-surface-container-highest"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white shadow-xs transform transition-transform ${emailNotify ? "translate-x-5" : ""}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-border-subtle">
                    <div>
                      <h4 className="text-sm font-bold text-on-surface">Izin Konsensus Audit Komunitas</h4>
                      <p className="text-xs text-on-surface-variant">
                        Izinkan data kelayakan anonim digunakan oleh sistem audit validator publik untuk keadilan penyaluran.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAuditConsent(!auditConsent)}
                      className={`w-12 h-7 rounded-full p-1 transition-colors ${
                        auditConsent ? "bg-emerald-500" : "bg-surface-container-highest"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white shadow-xs transform transition-transform ${auditConsent ? "translate-x-5" : ""}`} />
                    </button>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSaved(true);
                      setTimeout(() => setIsSaved(false), 3000);
                    }}
                    className="h-12 px-8 bg-primary text-white font-bold text-sm rounded-xl hover:bg-primary-container transition-all flex items-center gap-2 shadow-md"
                  >
                    <Save className="w-4 h-4" />
                    Simpan Preferensi Notifikasi
                  </button>
                </div>
              </div>
            )}

            {/* TAB 4: STATUS VERIFIKASI IDENTITAS */}
            {activeTab === "verification" && (
              <div className="bg-white border border-border-subtle rounded-2xl p-6 md:p-8 shadow-level1 space-y-6">
                <h2 className="font-display text-lg font-bold text-on-surface flex items-center gap-2 border-b border-border-subtle pb-4">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  Status Identitas Terverifikasi (KTP-el &amp; Biometrik)
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Dukcapil Match</span>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <p className="font-display text-xl font-extrabold text-emerald-950">100% Cocok</p>
                    <p className="text-xs text-emerald-700 leading-relaxed">
                      Data NIK, Nama Lengkap, dan Tanggal Lahir sesuai dengan Basis Data Kependudukan Nasional.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-primary">Biometric Face Match</span>
                      <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <p className="font-display text-xl font-extrabold text-blue-950">99.4% Kemiripan</p>
                    <p className="text-xs text-blue-700 leading-relaxed">
                      Verifikasi swafoto cocok dengan foto resmi KTP-el melalui kecerdasan buatan berbasis AI.
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-border-subtle bg-surface-container-low space-y-3">
                  <h3 className="font-bold text-sm text-on-surface">Jaminan Perlindungan Data Pribadi</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Sistem BantuVerif menerapkan standar enkripsi AES 256-bit dan mematuhi Undang-Undang Perlindungan Data Pribadi (UU PDP). Data Anda tidak pernah dijual atau dibagikan ke pihak ketiga tanpa izin konsensus Anda.
                  </p>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full py-8 px-6 bg-white mt-auto border-t border-border-subtle">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-on-surface-variant">
          <div className="flex flex-col gap-1">
            <span className="font-bold tracking-wider uppercase text-on-surface">
              BANTUVERIF CITIZEN PLATFORM
            </span>
            <p className="text-secondary">
              © 2026 BantuVerif — Platform Warga yang Aman &amp; Transparan.
            </p>
          </div>
          <nav className="flex flex-wrap justify-center gap-6 font-medium">
            <a className="hover:text-primary transition-all" href="#">Kebijakan Privasi</a>
            <a className="hover:text-primary transition-all" href="#">Syarat Layanan</a>
            <a className="hover:text-primary transition-all" href="#">FAQ</a>
            <a className="hover:text-primary transition-all" href="#">Transparansi Audit</a>
            <a className="hover:text-primary transition-all" href="#">Kontak Dukungan</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
