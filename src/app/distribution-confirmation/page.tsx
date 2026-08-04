"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Wallet,
  BadgeCheck,
  LayoutDashboard,
  Download,
  HelpCircle,
  Bell,
  User,
  ShieldCheck,
  Headphones,
} from "lucide-react";

export default function DistributionConfirmationPage() {
  const [disbursementDate, setDisbursementDate] = useState("");

  useEffect(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    };
    setDisbursementDate(now.toLocaleDateString("id-ID", options));
  }, []);

  return (
    <div className="bg-[#f7f9fb] text-on-surface font-body min-h-screen flex flex-col selection:bg-primary-container selection:text-white">


      {/* Main Content Area */}
      <main className="flex-grow py-8 md:py-14 px-4 md:px-6 max-w-[1280px] mx-auto w-full">
        {/* Success Status Header */}
        <section className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100/70 text-emerald-600 mb-5 border border-emerald-200/80 shadow-2xs">
            <CheckCircle2 className="w-11 h-11 stroke-[2.5]" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-on-surface mb-2.5 tracking-tight">
            Bantuan Berhasil Diterima
          </h1>
          <p className="text-on-surface-variant max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Pencairan dana bantuan Anda telah berhasil diproses dan ditransfer ke rekening terdaftar. 
            Harap simpan tanda terima digital ini untuk arsip Anda.
          </p>
        </section>

        {/* Two-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Official Receipt Card */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-border-subtle rounded-2xl shadow-level1 overflow-hidden">
              
              {/* Receipt Header Banner */}
              <div className="bg-primary p-6 md:p-8 text-white relative overflow-hidden">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
                  <ShieldCheck className="w-40 h-40" />
                </div>
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <p className="text-[11px] font-bold tracking-widest text-blue-200 uppercase mb-1">
                      TANDA TERIMA PENCAIRAN RESMI
                    </p>
                    <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight">
                      Sistem BantuVerif
                    </h2>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-xs">
                    <Wallet className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              {/* Receipt Body */}
              <div className="p-6 md:p-8 space-y-6">
                
                {/* Meta Rows */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-5 border-b border-dashed border-border-subtle">
                  <div>
                    <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                      ID Transaksi
                    </p>
                    <p className="font-mono text-primary font-bold text-base">
                      BV-9842-XLL-2026
                    </p>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                      Tanggal Pencairan
                    </p>
                    <p className="text-on-surface text-sm font-semibold">
                      {disbursementDate || "2 Agustus 2026, 06:43:48 WIB"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-5 border-b border-dashed border-border-subtle">
                  <div>
                    <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                      Nama Penerima
                    </p>
                    <p className="text-on-surface text-base font-bold">
                      Adama Traoré
                    </p>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                      Kategori Bantuan
                    </p>
                    <p className="text-on-surface text-sm font-semibold">
                      Bantuan Keberlanjutan Hunian
                    </p>
                  </div>
                </div>

                {/* Amount Credited Box */}
                <div className="bg-surface-container-low p-6 rounded-xl border border-border-subtle flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                      Jumlah Diterima
                    </p>
                    <p className="font-display text-3xl md:text-4xl font-extrabold text-primary leading-none">
                      Rp 12.500.000
                    </p>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-border-subtle shadow-2xs">
                    <img
                      className="w-20 h-20"
                      alt="QR Code Verifikasi Tanda Terima Resmi BantuVerif"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrWGiOHuZfgQcQJuI7UlLezaJWJ35XuDPluICKyLDUdu0QUKXWtXc9fjLroWJ7Rf5WS-FV1jYr1C5z_ZvIiLOw6o21nIRihT4wc5y2OSkNxe8DDxwwRoRG6f4xv0hR4WKMfJMLKKeGWlbNOEX45Okp_WOMrJC_DQrW5nmUWTXBwBAe0MqoNDuYEFXH_hSnVho0V7rwGDuHbV-E_yG102j70L7I7jJWMf4U2_CCcfSRc3Qej9MftCuqrQ"
                    />
                  </div>
                </div>

                {/* Verification Badge */}
                <div className="flex items-center gap-2 text-emerald-600 text-xs md:text-sm font-bold bg-emerald-50 px-3.5 py-2 rounded-lg border border-emerald-200/60 w-fit">
                  <BadgeCheck className="w-4.5 h-4.5" />
                  <span>Transaksi Terverifikasi Blockchain</span>
                </div>
              </div>

              {/* Receipt Bottom Decorative Edge */}
              <div className="w-full h-3 bg-surface-container-low border-t border-border-subtle flex">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-white border-b border-border-subtle transform rotate-45 scale-75"
                  />
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                href="/dashboard"
                className="flex-1 h-12 bg-primary text-white font-bold rounded-xl hover:bg-primary-container active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg text-sm"
              >
                <LayoutDashboard className="w-4.5 h-4.5" />
                Kembali ke Dasbor
              </Link>
              <button
                type="button"
                onClick={() => window.print()}
                className="h-12 px-6 border border-primary text-primary font-bold rounded-xl hover:bg-primary/5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm bg-white shadow-2xs"
              >
                <Download className="w-4.5 h-4.5" />
                Simpan PDF
              </button>
            </div>
          </div>

          {/* Right Column: Side Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* What happens next? */}
            <div className="bg-white border border-border-subtle rounded-2xl p-6 md:p-8 shadow-2xs space-y-6">
              <h3 className="font-display text-xl font-bold text-on-surface flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-secondary" />
                Apa langkah selanjutnya?
              </h3>
              
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-on-surface mb-0.5">
                      Cek Rekening Bank Anda
                    </h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Dana dapat membutuhkan 1–3 hari kerja untuk masuk ke rekening lokal Anda tergantung penyedia bank Anda.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-on-surface mb-0.5">
                      Kepatuhan Berkelanjutan
                    </h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Anda akan menerima notifikasi dalam 30 hari untuk memberikan laporan penggunaan singkat melalui portal.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-on-surface mb-0.5">
                      Periode Perpanjangan
                    </h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Kelayakan bantuan Anda untuk kuartal berikutnya akan dievaluasi secara otomatis pada 1 Januari 2027.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-surface-container-low rounded-xl border border-border-subtle">
                <p className="text-xs text-on-surface-variant italic leading-relaxed">
                  &quot;Transparansi membangun kepercayaan. Sistem audit otomatis kami memastikan setiap rupiah sampai kepada yang berhak.&quot;
                </p>
              </div>
            </div>

            {/* Support Card */}
            <div className="bg-white border border-border-subtle rounded-2xl p-6 flex items-center gap-4 shadow-2xs">
              <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-primary/20 shadow-2xs">
                <img
                  className="w-full h-full object-cover"
                  alt="Tim Dukungan Pelanggan BantuVerif"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuClAn7_xmg1QDjY85oOzOnIe-ChIZ37uzeawgT6Vo-Jlk3BRh9Sjjk_rEMVY3HSTHpRiMKTh2SXpSaO5njDb0iluIY8Jwtt_2w7tHJuNKAz7GLgDkDJwUqWhIKBm_8OaXUudQGB6kEIwuRGTFWbGQwjhixiqv9LJREXkmS65BOYbSu5jSDZ0fbfxoiYGMoTqpMqjb0SRoq4ehht_5UnUUksA0hBvdvk2TYpxzahK556SfbKT1_r8UY9XQ"
                />
              </div>
              <div>
                <h4 className="text-sm font-bold text-on-surface mb-0.5 flex items-center gap-1.5">
                  <Headphones className="w-4 h-4 text-primary" />
                  Butuh bantuan?
                </h4>
                <p className="text-xs text-on-surface-variant mb-2 leading-relaxed">
                  Tim dukungan kami tersedia 24/7 untuk pertanyaan seputar pencairan dana.
                </p>
                <a
                  className="text-primary text-xs font-bold hover:underline inline-flex items-center gap-1"
                  href="#"
                >
                  Hubungi Dukungan
                </a>
              </div>
            </div>

          </div>

        </div>
      </main>

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
