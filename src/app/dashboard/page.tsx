"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  ShieldCheck,
  LayoutGrid,
  FileText,
  CheckCircle2,
  History,
  Settings,
  Plus,
  Download,
  Headphones,
  Users,
  Clock,
  Info,
  Eye,
  Home,
  GraduationCap,
  Briefcase,
  Bell,
  User,
  ArrowRight,
  X,
  FilePlus,
  Shield,
  Share2,
  Globe,
  Sparkles,
  ChevronRight,
  AlertCircle,
  FileCheck2,
} from "lucide-react";

type NavItem = "overview" | "applications" | "eligibility" | "history" | "settings";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [activeNav, setActiveNav] = useState<NavItem>("overview");
  const [isNewAppModalOpen, setIsNewAppModalOpen] = useState(false);
  const [appSubmitted, setAppSubmitted] = useState(false);

  // New Application Form State
  const [formCategory, setFormCategory] = useState("BLT Sembako");
  const [formNotes, setFormNotes] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      } else {
        setUser(session.user);
      }
      setIsLoading(false);
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT") {
          router.push("/login");
        } else if (session) {
          setUser(session.user);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  const handleCreateApp = (e: React.FormEvent) => {
    e.preventDefault();
    setAppSubmitted(true);
    setTimeout(() => {
      setAppSubmitted(false);
      setIsNewAppModalOpen(false);
    }, 1200);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f9fb]">
        <div className="w-8 h-8 border-4 border-[#2563eb] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-body flex flex-col justify-between selection:bg-[#2563eb] selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#e2e8f0]">
        <div className="max-w-[1280px] mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center text-white shadow-md shadow-primary-container/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="font-display font-extrabold text-2xl tracking-tight text-on-surface">
              Bantu<span className="text-primary-container">Verif</span>
            </span>
          </Link>

          {/* Top Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/dashboard"
              className="text-[15px] font-semibold text-primary-container border-b-2 border-primary-container pb-0.5"
            >
              Dashboard
            </Link>
            <a
              href="#pengajuan"
              className="text-[15px] font-medium text-on-surface-variant hover:text-primary-container transition-colors"
            >
              Pengajuan
            </a>
            <a
              href="#riwayat"
              className="text-[15px] font-medium text-on-surface-variant hover:text-primary-container transition-colors"
            >
              Riwayat
            </a>
            <a
              href="#faq"
              className="text-[15px] font-medium text-on-surface-variant hover:text-primary-container transition-colors"
            >
              FAQ
            </a>
          </nav>

          {/* User & Controls */}
          <div className="flex items-center gap-4">
            <button
              title="Notifikasi"
              className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-[#f2f4f6] transition-colors relative border border-transparent hover:border-[#e2e8f0]"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white"></span>
            </button>

            <div className="flex items-center gap-3 pl-3 border-l border-[#e2e8f0]">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2563eb]/20 to-[#2563eb]/5 text-[#2563eb] border border-[#2563eb]/30 flex items-center justify-center font-bold text-sm shadow-2xs relative">
                <User className="w-5 h-5" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
              </div>
              <div className="hidden sm:block text-left">
                <div className="font-bold text-sm text-on-surface leading-tight">{user?.email?.split('@')[0] || 'Warga'}</div>
                <div className="text-[11px] text-on-surface-variant">{user?.email}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <div className="max-w-[1280px] mx-auto px-6 py-8 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar Menu */}
          <aside className="lg:col-span-3 bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-2xs">
            <div className="text-[11px] font-bold tracking-widest text-[#737686] uppercase mb-4 px-3">
              PORTAL WARGA
            </div>

            <nav className="flex flex-col gap-1.5 mb-8">
              <button
                onClick={() => setActiveNav("overview")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                  activeNav === "overview"
                    ? "bg-[#2563eb] text-white shadow-md shadow-primary-container/20"
                    : "text-on-surface-variant hover:bg-[#f2f4f6] hover:text-on-surface"
                }`}
              >
                <LayoutGrid className="w-4.5 h-4.5" />
                <span>Ringkasan Utama</span>
              </button>

              <button
                onClick={() => setActiveNav("applications")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                  activeNav === "applications"
                    ? "bg-[#2563eb] text-white shadow-md shadow-primary-container/20"
                    : "text-on-surface-variant hover:bg-[#f2f4f6] hover:text-on-surface"
                }`}
              >
                <FileText className="w-4.5 h-4.5" />
                <span>Pengajuan Saya</span>
              </button>

              <button
                onClick={() => setActiveNav("eligibility")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                  activeNav === "eligibility"
                    ? "bg-[#2563eb] text-white shadow-md shadow-primary-container/20"
                    : "text-on-surface-variant hover:bg-[#f2f4f6] hover:text-on-surface"
                }`}
              >
                <CheckCircle2 className="w-4.5 h-4.5" />
                <span>Kriteria Kelayakan</span>
              </button>

              <button
                onClick={() => setActiveNav("history")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                  activeNav === "history"
                    ? "bg-[#2563eb] text-white shadow-md shadow-primary-container/20"
                    : "text-on-surface-variant hover:bg-[#f2f4f6] hover:text-on-surface"
                }`}
              >
                <History className="w-4.5 h-4.5" />
                <span>Riwayat Verifikasi</span>
              </button>

              <button
                onClick={() => setActiveNav("settings")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                  activeNav === "settings"
                    ? "bg-[#2563eb] text-white shadow-md shadow-primary-container/20"
                    : "text-on-surface-variant hover:bg-[#f2f4f6] hover:text-on-surface"
                }`}
              >
                <Settings className="w-4.5 h-4.5" />
                <span>Pengaturan Akun</span>
              </button>

              <button
                onClick={async () => await supabase.auth.signOut()}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all text-rose-600 hover:bg-rose-50 mt-2"
              >
                <User className="w-4.5 h-4.5" />
                <span>Keluar Akun</span>
              </button>
            </nav>

            <button
              onClick={() => setIsNewAppModalOpen(true)}
              className="btn-48 w-full rounded-xl font-semibold text-sm bg-[#2563eb] text-white hover:bg-[#1d4ed8] shadow-[0_4px_14px_rgba(37,99,235,0.25)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.35)] transition-all flex items-center justify-center gap-2.5"
            >
              <Plus className="w-5 h-5" />
              <span>+ Pengajuan Baru</span>
            </button>
          </aside>

          {/* Main Dashboard Panel */}
          <main className="lg:col-span-9 space-y-8">
            {/* Top Greeting Header */}
            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 md:p-7 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#2563eb] uppercase tracking-wider mb-1.5">
                  <Sparkles className="w-4 h-4 text-[#2563eb]" /> DASHBOARD UTAMA WARGA
                </div>
                <h1 className="text-2xl md:text-[32px] font-extrabold font-display text-on-surface tracking-tight mb-2">
                  Selamat Pagi, {user?.email?.split('@')[0] || 'Warga'}
                </h1>
                <div className="flex items-center gap-3 text-xs text-on-surface-variant">
                  <span>Profil warga Anda <strong>85% lengkap</strong>.</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e2e8f0]"></span>
                  <span className="text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    2 Tugas Memerlukan Tindakan
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button className="h-10 px-4 rounded-xl border border-[#e2e8f0] bg-surface text-xs font-semibold text-on-surface hover:bg-[#f2f4f6] transition-all flex items-center gap-2 shadow-2xs">
                  <Download className="w-4 h-4 text-on-surface-variant" />
                  <span>Unduh Riwayat PDF</span>
                </button>

                <button className="h-10 px-4 rounded-xl border border-[#e2e8f0] bg-surface text-xs font-semibold text-on-surface hover:bg-[#f2f4f6] transition-all flex items-center gap-2 shadow-2xs">
                  <Headphones className="w-4 h-4 text-on-surface-variant" />
                  <span>Bantuan Layanan</span>
                </button>
              </div>
            </div>

            {/* Grid Row 1: Active Progress Card (8 cols) + Updates Panel (4 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-stretch">
              {/* Community Verification Card (8 cols) */}
              <div className="lg:col-span-8 bg-white border border-[#e2e8f0] rounded-2xl p-7 shadow-level1 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      SEDANG BERJALAN
                    </span>
                    <div className="text-right">
                      <div className="text-lg font-black text-[#2563eb] font-display">Langkah 3 dari 4</div>
                      <div className="text-xs text-on-surface-variant">Estimasi Selesai: 2 Hari</div>
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold font-display text-on-surface mb-1">
                    Verifikasi Konsensus Komunitas
                  </h2>
                  <div className="text-xs text-on-surface-variant mb-8 flex items-center gap-2">
                    <span>ID Pengajuan: <strong>#BANTU-2024-8842</strong></span>
                    <span>•</span>
                    <span className="text-[#2563eb] font-semibold">Subsidi Perumahan Warga</span>
                  </div>

                  {/* 4-Step Progress Rail */}
                  <div className="relative mb-8 px-2">
                    {/* Connecting Rail Line */}
                    <div className="absolute top-5 left-8 right-8 h-1 bg-[#e2e8f0] z-0 rounded-full">
                      <div className="h-full bg-gradient-to-r from-emerald-500 via-emerald-500 to-[#2563eb] w-3/4 rounded-full transition-all duration-500"></div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 relative z-10 text-center">
                      {/* Step 1: Identitas */}
                      <div className="flex flex-col items-center">
                        <div className="w-11 h-11 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-2 shadow-md shadow-emerald-500/20">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold text-on-surface">1. Identitas</span>
                        <span className="text-[10px] text-emerald-600 font-semibold mt-0.5">Selesai</span>
                      </div>

                      {/* Step 2: Dokumen */}
                      <div className="flex flex-col items-center">
                        <div className="w-11 h-11 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-2 shadow-md shadow-emerald-500/20">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold text-on-surface">2. Dokumen</span>
                        <span className="text-[10px] text-emerald-600 font-semibold mt-0.5">Selesai</span>
                      </div>

                      {/* Step 3: Verifikasi Tetangga */}
                      <div className="flex flex-col items-center">
                        <div className="w-11 h-11 rounded-full bg-[#2563eb] text-white flex items-center justify-center mb-2 shadow-[0_0_0_5px_rgba(37,99,235,0.25)] animate-pulse">
                          <Users className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold text-[#2563eb]">3. Verifikasi</span>
                        <span className="text-[10px] text-[#2563eb] font-bold mt-0.5">Aktif (2/3 Suara)</span>
                      </div>

                      {/* Step 4: Persetujuan RT/RW */}
                      <div className="flex flex-col items-center opacity-60">
                        <div className="w-11 h-11 rounded-full bg-[#eceef0] text-[#737686] flex items-center justify-center mb-2">
                          <Clock className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-medium text-on-surface-variant">4. Persetujuan</span>
                        <span className="text-[10px] text-outline mt-0.5">Menunggu</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Next Action Required Box */}
                <div className="bg-gradient-to-r from-[#eff6ff] to-[#f8fafc] rounded-xl p-4.5 border border-[#dbeafe] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
                  <div className="flex gap-3.5 items-start">
                    <div className="w-9 h-9 rounded-full bg-[#2563eb] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <Info className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-on-surface uppercase tracking-wider text-[#2563eb] mb-0.5">
                        Tindakan Diperlukan
                      </div>
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        Silakan atur jadwal panggilan konfirmasi 10 menit dengan pengurus RT untuk menyelesaikan verifikasi final.
                      </p>
                    </div>
                  </div>

                  <button className="h-10 px-5 rounded-xl bg-[#2563eb] text-white text-xs font-semibold hover:bg-[#1d4ed8] transition-all shrink-0 shadow-sm hover:shadow-md">
                    Atur Jadwal Call
                  </button>
                </div>
              </div>

              {/* Updates Panel (4 cols) */}
              <div className="lg:col-span-4 bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-level1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#e2e8f0]">
                    <div className="flex items-center gap-2.5">
                      <h3 className="font-bold text-lg font-display text-on-surface">Pembaruan Terbaru</h3>
                      <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[11px] font-bold">
                        2 Baru
                      </span>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {/* Item 1 */}
                    <div className="flex items-start gap-3 text-xs">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb] shrink-0 mt-1 ring-4 ring-[#2563eb]/15"></span>
                      <div>
                        <div className="font-bold text-on-surface text-sm mb-0.5">Verifikasi RT Diterima</div>
                        <p className="text-on-surface-variant leading-relaxed mb-1">
                          Pengurus RT 04 telah mengonfirmasi berkas Anda. Penapisan tahap awal selesai.
                        </p>
                        <span className="text-[11px] text-[#737686]">10 menit lalu</span>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="flex items-start gap-3 text-xs">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0 mt-1 ring-4 ring-rose-500/15"></span>
                      <div>
                        <div className="font-bold text-on-surface text-sm mb-0.5">Pembaruan Dokumen Bukti</div>
                        <p className="text-on-surface-variant leading-relaxed mb-1">
                          Struk pembayaran listrik/air sudah melewati 3 bulan. Harap unggah versi terbaru.
                        </p>
                        <span className="text-[11px] text-[#737686]">2 jam lalu</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button className="mt-6 pt-3 border-t border-[#e2e8f0] text-center text-xs font-semibold text-on-surface-variant hover:text-[#2563eb] transition-colors w-full">
                  Bersihkan Semua Notifikasi
                </button>
              </div>
            </div>

            {/* Grid Row 2: Application History Table (8 cols) + Eligibility Banner (4 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-stretch">
              {/* Application History Table (8 cols) */}
              <div className="lg:col-span-8 bg-white border border-[#e2e8f0] rounded-2xl p-7 shadow-level1">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-xl font-display text-on-surface">
                    Riwayat Pengajuan Bantuan
                  </h3>
                  <button className="text-xs font-bold text-[#2563eb] hover:underline flex items-center gap-1">
                    <span>Lihat Semua</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#e2e8f0] text-[#737686] uppercase font-bold tracking-wider">
                        <th className="pb-3.5 font-semibold">JENIS BANTUAN</th>
                        <th className="pb-3.5 font-semibold">TANGGAL DIMAJUKAN</th>
                        <th className="pb-3.5 font-semibold">STATUS</th>
                        <th className="pb-3.5 font-semibold text-right">AKSI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e2e8f0]/60">
                      {/* Row 1 */}
                      <tr className="hover:bg-[#f8fafc] transition-colors">
                        <td className="py-4 font-semibold text-on-surface">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-[#eff6ff] text-[#2563eb] border border-[#dbeafe] flex items-center justify-center">
                              <Home className="w-4.5 h-4.5" />
                            </div>
                            <div>
                              <div className="font-bold text-sm">Subsidi Perumahan Warga</div>
                              <div className="text-[11px] text-on-surface-variant font-normal">Program RT 04</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-on-surface-variant font-medium">12 Okt 2023</td>
                        <td className="py-4">
                          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Disetujui
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <button className="w-8 h-8 rounded-lg hover:bg-[#eceef0] inline-flex items-center justify-center text-on-surface-variant transition-colors">
                            <Eye className="w-4.5 h-4.5" />
                          </button>
                        </td>
                      </tr>

                      {/* Row 2 */}
                      <tr className="hover:bg-[#f8fafc] transition-colors">
                        <td className="py-4 font-semibold text-on-surface">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-[#f2f4f6] text-on-surface-variant border border-[#e2e8f0] flex items-center justify-center">
                              <GraduationCap className="w-4.5 h-4.5" />
                            </div>
                            <div>
                              <div className="font-bold text-sm">Beasiswa Pendidikan Anak</div>
                              <div className="text-[11px] text-on-surface-variant font-normal">Tingkat Sekolah Dasar</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-on-surface-variant font-medium">24 Agt 2023</td>
                        <td className="py-4">
                          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            Selesai
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <button className="w-8 h-8 rounded-lg hover:bg-[#eceef0] inline-flex items-center justify-center text-on-surface-variant transition-colors">
                            <Eye className="w-4.5 h-4.5" />
                          </button>
                        </td>
                      </tr>

                      {/* Row 3 */}
                      <tr className="hover:bg-[#f8fafc] transition-colors">
                        <td className="py-4 font-semibold text-on-surface">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-[#f2f4f6] text-on-surface-variant border border-[#e2e8f0] flex items-center justify-center">
                              <Briefcase className="w-4.5 h-4.5" />
                            </div>
                            <div>
                              <div className="font-bold text-sm">Perpanjangan Kartu Sehat</div>
                              <div className="text-[11px] text-on-surface-variant font-normal">Layanan Jaminan KIS</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-on-surface-variant font-medium">05 Jan 2024</td>
                        <td className="py-4">
                          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 inline-flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Menunggu
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <button className="w-8 h-8 rounded-lg hover:bg-[#eceef0] inline-flex items-center justify-center text-on-surface-variant transition-colors">
                            <Eye className="w-4.5 h-4.5" />
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Eligibility Banner Card (4 cols) */}
              <div className="lg:col-span-4 rounded-2xl overflow-hidden relative border border-[#e2e8f0] shadow-level1 group flex flex-col justify-end p-7 min-h-[280px]">
                <Image
                  src="/eligibility-banner.png"
                  alt="Panduan Kelayakan"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 z-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1d4ed8]/95 via-[#2563eb]/75 to-transparent z-10"></div>

                <div className="relative z-20 text-white">
                  <div className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md mb-3 border border-white/30">
                    PANDUAN KELAYAKAN 2026
                  </div>
                  <h3 className="font-bold text-xl font-display mb-2 text-white leading-tight">
                    Panduan Kriteria Kelayakan Terbaru
                  </h3>
                  <p className="text-xs text-white/85 leading-relaxed mb-5">
                    Pelajari syarat kelayakan bantuan sosial subsidi perumahan warga dan program literasi digital 2026.
                  </p>

                  <a
                    href="#"
                    className="inline-flex items-center gap-2 text-xs font-bold text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl backdrop-blur-md transition-colors border border-white/25"
                  >
                    <span>Baca Panduan Lengkap</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-[#e2e8f0] pt-12 pb-8 text-xs text-on-surface-variant mt-12">
        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="font-bold text-sm text-on-surface font-display mb-3 uppercase tracking-wider">
              BANTUVERIF
            </div>
            <p className="text-xs leading-relaxed text-on-surface-variant">
              Memberdayakan masyarakat melalui teknologi verifikasi bantuan sosial yang transparan, aman, dan dapat diakses oleh semua warga.
            </p>
          </div>

          <div>
            <div className="font-bold text-on-surface mb-3 text-xs uppercase tracking-wider">Platform</div>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-primary-container">Kebijakan Privasi</a></li>
              <li><a href="#" className="hover:text-primary-container">Syarat & Ketentuan</a></li>
            </ul>
          </div>

          <div>
            <div className="font-bold text-on-surface mb-3 text-xs uppercase tracking-wider">Sumber Daya</div>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-primary-container">FAQ</a></li>
              <li><a href="#" className="hover:text-primary-container">Audit Transparansi</a></li>
            </ul>
          </div>

          <div>
            <div className="font-bold text-on-surface mb-3 text-xs uppercase tracking-wider">Dukungan</div>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-primary-container">Layanan Bantuan</a></li>
              <li><a href="#" className="hover:text-primary-container">Aksesibilitas</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto px-6 pt-6 border-t border-[#e2e8f0] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#737686] gap-4">
          <div>
            © 2026 Platform Civic BantuVerif. Teknologi Publik Aman & Transparan.
          </div>
          <div className="flex items-center gap-3">
            <button title="Bagikan" className="w-7 h-7 rounded-full bg-[#f2f4f6] flex items-center justify-center hover:bg-[#eceef0]">
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <button title="Bahasa" className="w-7 h-7 rounded-full bg-[#f2f4f6] flex items-center justify-center hover:bg-[#eceef0]">
              <Globe className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </footer>

      {/* Modal: New Application */}
      {isNewAppModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-elevated w-full max-w-[500px] p-7 relative">
            <button
              onClick={() => setIsNewAppModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#f2f4f6] flex items-center justify-center text-on-surface-variant hover:bg-[#eceef0] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#2563eb]/10 text-[#2563eb] rounded-xl flex items-center justify-center">
                <FilePlus className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-on-surface font-display">
                  Buat Pengajuan Bantuan Baru
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Pilih kategori bantuan sosial yang sesuai dengan kebutuhan Anda.
                </p>
              </div>
            </div>

            {appSubmitted ? (
              <div className="py-8 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-base text-on-surface mb-1">Pengajuan Berhasil Dikirim!</h4>
                <p className="text-xs text-on-surface-variant">
                  ID Permohonan Anda: <strong>#BANTU-2026-9901</strong>
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateApp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1.5 uppercase tracking-wider">
                    Kategori Bantuan Sosial
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] text-sm text-on-surface outline-none focus:border-[#2563eb]"
                  >
                    <option value="BLT Sembako">BLT Sembako & Bahan Pangan</option>
                    <option value="Subsidi Perumahan">Subsidi Perumahan & Kelayakan Huni</option>
                    <option value="Beasiswa Pendidikan">Beasiswa & Keringanan Pendidikan</option>
                    <option value="Kartu Sehat">Perpanjangan Kartu Kesehatan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1.5 uppercase tracking-wider">
                    Catatan Alasan Pengajuan
                  </label>
                  <textarea
                    rows={3}
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="Jelaskan secara singkat kondisi atau keperluan Anda..."
                    className="w-full p-3 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] text-sm text-on-surface outline-none focus:border-[#2563eb]"
                  ></textarea>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsNewAppModalOpen(false)}
                    className="h-11 px-5 rounded-lg border border-[#e2e8f0] text-xs font-semibold hover:bg-[#f2f4f6]"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="h-11 px-6 rounded-lg bg-[#2563eb] text-white text-xs font-semibold hover:bg-[#1d4ed8] shadow-sm"
                  >
                    Kirim Permohonan
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
