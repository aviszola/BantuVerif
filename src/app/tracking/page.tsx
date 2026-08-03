"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Download,
  HelpCircle,
  Users,
  Timer,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import PortalSidebar from "@/components/PortalSidebar";

export default function TrackingPage() {
  const [badgeVisible, setBadgeVisible] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) setUser(session.user);
    };
    checkUser();
  }, []);

  // Simulasi real-time update pulse
  useEffect(() => {
    const interval = setInterval(() => {
      setBadgeVisible(false);
      setTimeout(() => setBadgeVisible(true), 500);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-body flex flex-col justify-between selection:bg-[#2563eb] selection:text-white">
      <div className="max-w-[1280px] mx-auto px-6 py-8 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <PortalSidebar active="applications" />

          {/* Main Content Canvas */}
          <main className="lg:col-span-9 space-y-8">
            {/* Header & Summary Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`px-3 py-1 rounded-full bg-[#dbeafe] text-[#1e40af] text-sm font-semibold transition-opacity duration-500 ${
                      badgeVisible ? "opacity-100" : "opacity-60"
                    }`}
                  >
                    Dalam Proses
                  </span>
                  <span className="text-on-surface-variant text-sm font-medium">
                    ID: BV-2026-883921
                  </span>
                </div>
                <h1 className="font-display text-2xl md:text-3xl font-bold text-on-surface tracking-tight">
                  Pelacakan Pengajuan Bantuan Sosial
                </h1>
                <p className="text-on-surface-variant text-sm md:text-base mt-1">
                  Diperbarui 2 jam lalu oleh Auditor Sistem
                </p>
              </div>
              <div className="flex gap-3">
                <button className="px-5 h-11 border border-border-subtle bg-white text-on-surface rounded-lg text-sm font-semibold hover:bg-surface-container-low transition-colors flex items-center gap-2 shadow-2xs">
                  <Download className="w-4.5 h-4.5 text-on-surface-variant" />
                  Ekspor Data
                </button>
                <button className="px-5 h-11 bg-primary-container text-white rounded-lg text-sm font-semibold hover:bg-primary transition-all flex items-center gap-2 shadow-sm">
                  <HelpCircle className="w-4.5 h-4.5" />
                  Bantuan
                </button>
              </div>
            </div>

            {/* Bento Grid Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Vertical Timeline Column */}
              <div className="lg:col-span-8 bg-white rounded-xl border border-border-subtle p-6 md:p-8 shadow-xs">
                <h2 className="font-display text-xl md:text-2xl font-bold text-on-surface mb-8">
                  Alur Verifikasi
                </h2>
                <div className="relative pl-8">
                  {/* Vertical Step Rail */}
                  <div className="absolute left-[15px] top-2 bottom-2 w-1 bg-surface-container-highest rounded-full">
                    {/* Progress fill */}
                    <div className="absolute top-0 left-0 w-full h-[40%] bg-success rounded-full"></div>
                    <div className="absolute top-[40%] left-0 w-full h-[5%] bg-primary-container"></div>
                  </div>

                  {/* Steps */}
                  <div className="space-y-10">
                    {/* Step 1: Submitted (Completed) */}
                    <div className="relative flex flex-col md:flex-row gap-4 md:gap-8">
                      <div className="absolute -left-[25px] top-1 w-5 h-5 rounded-full bg-success flex items-center justify-center ring-4 ring-white shadow-2xs">
                        <ShieldCheck className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-on-surface">
                            Pengajuan Diterima
                          </h3>
                          <span className="text-on-surface-variant text-xs md:text-sm font-medium">
                            12 Okt, 09:14 WIB
                          </span>
                        </div>
                        <p className="text-on-surface-variant text-sm mt-1 leading-relaxed">
                          Pengajuan berhasil diterima oleh sistem BantuVerif dan
                          checksum dokumen awal telah diverifikasi.
                        </p>
                      </div>
                    </div>

                    {/* Step 2: Community Verification (Active/Pulsing) */}
                    <div className="relative flex flex-col md:flex-row gap-4 md:gap-8">
                      <div className="absolute -left-[25px] top-1 w-5 h-5 rounded-full bg-primary-container flex items-center justify-center ring-4 ring-white shadow-2xs">
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                      </div>
                      <div className="flex-1 p-5 md:p-6 bg-[#f8fafc] rounded-xl border-l-4 border-primary-container border border-border-subtle shadow-xs transition-all duration-200">
                        <div className="flex items-center justify-between">
                          <h3 className="font-display text-base md:text-lg font-bold text-primary-container">
                            Verifikasi Komunitas
                          </h3>
                          <span className="px-2.5 py-0.5 rounded-full bg-primary-container/10 text-primary-container text-[10px] font-extrabold uppercase tracking-wider">
                            AKTIF
                          </span>
                        </div>
                        <p className="text-on-surface text-sm md:text-base mt-2 leading-relaxed">
                          Verifikator lokal sedang meninjau kontribusi komunitas Anda.
                          Konsensus dicapai:{" "}
                          <span className="font-bold text-primary-container">65%</span>
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className="inline-flex items-center px-2.5 py-1 rounded bg-white text-on-surface-variant text-xs border border-border-subtle shadow-2xs font-medium">
                            <Users className="w-3.5 h-3.5 mr-1.5 text-primary-container" />
                            12 Verifikator Ditugaskan
                          </span>
                          <span className="inline-flex items-center px-2.5 py-1 rounded bg-white text-on-surface-variant text-xs border border-border-subtle shadow-2xs font-medium">
                            <Timer className="w-3.5 h-3.5 mr-1.5 text-warning" />
                            Sisa 2 Hari
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Step 3: RT Review (Pending) */}
                    <div className="relative flex flex-col md:flex-row gap-4 md:gap-8">
                      <div className="absolute -left-[25px] top-1 w-5 h-5 rounded-full bg-surface-dim ring-4 ring-white"></div>
                      <div className="flex-1 opacity-60">
                        <h3 className="text-sm font-semibold text-on-surface">
                          Peninjauan RT / RW & Satgas
                        </h3>
                        <p className="text-on-surface-variant text-sm mt-1 leading-relaxed">
                          Validasi akhir oleh Satgas Wilayah untuk memastikan
                          kesesuaian kebijakan antar-distrik.
                        </p>
                      </div>
                    </div>

                    {/* Step 4: Distribution (Pending) */}
                    <div className="relative flex flex-col md:flex-row gap-4 md:gap-8">
                      <div className="absolute -left-[25px] top-1 w-5 h-5 rounded-full bg-surface-dim ring-4 ring-white"></div>
                      <div className="flex-1 opacity-60">
                        <h3 className="text-sm font-semibold text-on-surface">
                          Penyaluran Bantuan
                        </h3>
                        <p className="text-on-surface-variant text-sm mt-1 leading-relaxed">
                          Dana atau bantuan dijadwalkan untuk disalurkan melalui
                          dompet digital pilihan Anda.
                        </p>
                      </div>
                    </div>

                    {/* Step 5: Completed (Pending) */}
                    <div className="relative flex flex-col md:flex-row gap-4 md:gap-8 pb-2">
                      <div className="absolute -left-[25px] top-1 w-5 h-5 rounded-full bg-surface-dim ring-4 ring-white"></div>
                      <div className="flex-1 opacity-60">
                        <h3 className="text-sm font-semibold text-on-surface">
                          Selesai
                        </h3>
                        <p className="text-on-surface-variant text-sm mt-1 leading-relaxed">
                          Pengarsipan seluruh proses dan konfirmasi dampak bantuan.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Sidebar Info Cards */}
              <div className="lg:col-span-4 space-y-6">
                {/* Who is verifying Card */}
                <div className="bg-[#f8fafc] rounded-xl p-6 border border-border-subtle relative overflow-hidden group shadow-2xs">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary-container/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700"></div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-4 shadow-2xs border border-border-subtle">
                      <Users className="w-6 h-6 text-primary-container" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-on-surface mb-3">
                      Siapa yang memverifikasi?
                    </h3>
                    <p className="text-on-surface-variant text-xs md:text-sm leading-relaxed mb-4">
                      BantuVerif menggunakan model{" "}
                      <strong className="text-on-surface">Konsensus Komunitas</strong>.
                      Pengajuan Anda ditinjau oleh warga lokal terverifikasi yang tinggal
                      dalam radius 5km dari alamat terdaftar Anda.
                    </p>
                    <ul className="space-y-2.5">
                      <li className="flex items-start gap-2 text-xs md:text-sm text-on-surface">
                        <ShieldCheck className="w-4 h-4 text-success shrink-0 mt-0.5" />
                        Peninjauan oleh sesama warga secara anonim
                      </li>
                      <li className="flex items-start gap-2 text-xs md:text-sm text-on-surface">
                        <ShieldCheck className="w-4 h-4 text-success shrink-0 mt-0.5" />
                        Pemungutan suara tahan kecurangan
                      </li>
                      <li className="flex items-start gap-2 text-xs md:text-sm text-on-surface">
                        <ShieldCheck className="w-4 h-4 text-success shrink-0 mt-0.5" />
                        Log audit transparan
                      </li>
                    </ul>
                    <button className="mt-6 w-full text-primary-container text-sm font-semibold flex items-center justify-center gap-1.5 hover:underline transition-all">
                      Pelajari Tentang Konsensus
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* System Status Card */}
                <div className="bg-white rounded-xl p-6 border border-border-subtle shadow-2xs">
                  <h4 className="text-on-surface-variant text-[11px] font-bold tracking-widest uppercase mb-4">
                    Status Jaringan
                  </h4>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-on-surface text-xs md:text-sm font-semibold">
                      Ledger Blockchain
                    </span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-success"></div>
                      <span className="text-success text-xs font-extrabold">LIVE</span>
                    </div>
                  </div>
                  <div className="w-full bg-[#e2e8f0] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-success h-full w-[99.9%]"></div>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-3 italic">
                    &quot;Verifikasi publik mendorong transparansi sipil mutlak.&quot;
                  </p>
                </div>

                {/* Visual Asset Section */}
                <div className="rounded-xl overflow-hidden h-48 border border-border-subtle relative bg-slate-900 group">
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    role="img"
                    aria-label="Peta digital minimalist menampilkan titik-titik biru menyala"
                    style={{
                      backgroundImage:
                        "url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=800&auto=format&fit=crop')",
                    }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-4">
                    <p className="text-white text-xs md:text-sm font-semibold tracking-wide">
                      Distribusi Node Real-time
                    </p>
                  </div>
                </div>
              </div>
            </div>
        </main>
      </div>
    </div>
      {/* Footer */}
      <footer className="w-full py-8 md:py-10 px-6 md:px-10 bg-surface-container-low border-t border-border-subtle mt-auto">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-xs font-bold tracking-widest uppercase text-on-surface-variant mb-1">
              Platform Warga BantuVerif
            </span>
            <p className="text-xs md:text-sm text-on-surface-variant text-center md:text-left">
              © 2026 Platform Warga BantuVerif. Teknologi Publik Aman & Transparan.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-5 text-xs md:text-sm">
            <a
              href="#"
              className="text-on-surface-variant hover:text-primary transition-all font-medium"
            >
              Kebijakan Privasi
            </a>
            <a
              href="#"
              className="text-on-surface-variant hover:text-primary transition-all font-medium"
            >
              Syarat &amp; Ketentuan
            </a>
            <a
              href="#"
              className="text-on-surface-variant hover:text-primary transition-all font-medium"
            >
              FAQ
            </a>
            <a
              href="#"
              className="text-on-surface-variant hover:text-primary transition-all font-medium"
            >
              Transparansi Audit
            </a>
            <a
              href="#"
              className="text-on-surface-variant hover:text-primary transition-all font-medium"
            >
              Hubungi Bantuan
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

