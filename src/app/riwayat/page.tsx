"use client";

import React, { useState } from "react";
import Link from "next/link";
import PortalSidebar from "@/components/PortalSidebar";
import {
  ShieldCheck,
  Timer,
  Shield,
  FileText,
  CheckCircle2,
  ArrowRight,
  AlertTriangle,
  BadgeCheck,
  Home,
  Wallet,
  Users,
  ClipboardList,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const kriteria = [
  {
    id: 1,
    label: "Status Ekonomi",
    icon: Wallet,
    color: "text-primary",
    bg: "bg-primary/10",
    items: [
      "Pendapatan rumah tangga di bawah Rp 2.000.000 per bulan",
      "Tidak tercatat sebagai pegawai negeri sipil (ASN) atau TNI/Polri aktif",
      "Tidak memiliki aset properti lebih dari 1 (satu) bidang tanah/rumah",
    ],
  },
  {
    id: 2,
    label: "Status Kepemilikan Rumah",
    icon: Home,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    items: [
      "Menempati rumah sendiri, sewa, atau menumpang pada keluarga",
      "Kondisi hunian tergolong tidak layak atau sederhana",
      "Belum pernah menerima bantuan rumah dari pemerintah dalam 5 tahun terakhir",
    ],
  },
  {
    id: 3,
    label: "Status Keluarga & Tanggungan",
    icon: Users,
    color: "text-secondary",
    bg: "bg-secondary/10",
    items: [
      "Kepala keluarga atau anggota keluarga yang membutuhkan bantuan",
      "Terdapat anggota keluarga lanjut usia, penyandang disabilitas, atau balita gizi buruk",
      "Jumlah tanggungan minimal 2 (dua) orang dalam satu KK",
    ],
  },
  {
    id: 4,
    label: "Rekam Jejak Bantuan Sebelumnya",
    icon: ClipboardList,
    color: "text-amber-600",
    bg: "bg-amber-50",
    items: [
      "Belum pernah menerima bantuan sosial di program yang sama dalam 12 bulan terakhir",
      "Tidak sedang dalam proses pengajuan bantuan ganda di instansi lain",
      "Pengajuan sebelumnya (jika ada) tidak dicabut karena pelanggaran data",
    ],
  },
];

const dokumenWajib = [
  {
    icon: BadgeCheck,
    judul: "KTP (Kartu Tanda Penduduk)",
    deskripsi: "KTP asli yang masih berlaku, bukan fotokopi. Pastikan data sudah sesuai dengan kondisi terkini.",
    warna: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: FileText,
    judul: "Kartu Keluarga (KK)",
    deskripsi: "Kartu Keluarga yang diterbitkan oleh Dinas Kependudukan dan Pencatatan Sipil setempat.",
    warna: "text-secondary",
    bg: "bg-secondary/10",
  },
  {
    icon: Home,
    judul: "Bukti Tempat Tinggal",
    deskripsi: "Foto tempat tinggal atau surat keterangan domisili dari RT/RW setempat.",
    warna: "text-emerald-600",
    bg: "bg-emerald-50",
  },
];

const faq = [
  {
    pertanyaan: "Siapa saja yang berhak mengajukan bantuan ini?",
    jawaban:
      "Warga negara Indonesia yang memenuhi kriteria ekonomi dan sosial yang telah ditetapkan, berdomisili di wilayah program, dan memiliki dokumen kependudukan yang sah.",
  },
  {
    pertanyaan: "Berapa lama proses verifikasi berlangsung?",
    jawaban:
      "Proses verifikasi umumnya berlangsung 7–14 hari kerja setelah pengajuan diterima. Status dapat dipantau secara real-time melalui fitur Tracking di portal ini.",
  },
  {
    pertanyaan: "Apakah saya bisa mengajukan untuk lebih dari satu program bantuan?",
    jawaban:
      "Satu akun hanya dapat mengajukan satu pengajuan aktif pada waktu yang sama. Jika pengajuan pertama selesai diproses, Anda dapat mengajukan kembali untuk program lain.",
  },
  {
    pertanyaan: "Apa yang terjadi jika pengajuan saya ditolak?",
    jawaban:
      "Anda akan menerima notifikasi beserta alasan penolakan. Anda dapat mengajukan keberatan atau memperbaiki data dan mengajukan ulang setelah 30 hari.",
  },
];

export default function RiwayatPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-on-background font-body flex flex-col selection:bg-primary-container selection:text-white">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-6 md:py-8 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
          {/* Unified Portal Sidebar */}
          <PortalSidebar active="eligibility" />

          {/* Main Content (9 cols) */}
          <main className="lg:col-span-9 space-y-6">

            {/* Hero Header Card */}
            <div className="bg-white border border-border-subtle rounded-2xl p-6 md:p-8 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider mb-3">
                <ShieldCheck className="w-4 h-4" />
                KRITERIA KELAYAKAN BANTUAN SOSIAL
              </div>
              <h1 className="font-display text-2xl md:text-[30px] font-extrabold text-on-surface mb-2 tracking-tight leading-snug">
                Periksa Kelayakan Anda Sebelum Mengajukan
              </h1>
              <p className="text-on-surface-variant text-sm md:text-base leading-relaxed max-w-2xl">
                Pastikan Anda memenuhi seluruh kriteria di bawah ini sebelum memulai pengajuan. 
                Proses verifikasi biasanya membutuhkan waktu <strong>12–15 menit</strong> dan data Anda dilindungi enkripsi 256-bit SSL.
              </p>

              {/* Info Chips */}
              <div className="flex flex-wrap gap-3 mt-5">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                  <Timer className="w-3.5 h-3.5" />
                  ±12 Menit Proses
                </span>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold">
                  <Shield className="w-3.5 h-3.5" />
                  Enkripsi 256-bit SSL
                </span>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold">
                  <FileText className="w-3.5 h-3.5" />
                  Simpan Otomatis
                </span>
              </div>
            </div>

            {/* Kriteria Grid */}
            <div>
              <h2 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-4 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Kriteria yang Harus Dipenuhi
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {kriteria.map((k) => {
                  const Icon = k.icon;
                  return (
                    <div
                      key={k.id}
                      className="bg-white border border-border-subtle rounded-2xl p-6 shadow-2xs hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-10 h-10 rounded-xl ${k.bg} flex items-center justify-center ${k.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-sm text-on-surface">{k.label}</h3>
                      </div>
                      <ul className="space-y-2.5">
                        {k.items.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs text-on-surface-variant leading-relaxed">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dokumen Wajib */}
            <div className="bg-white border border-border-subtle rounded-2xl overflow-hidden shadow-2xs">
              <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between">
                <h2 className="font-bold text-sm text-on-surface flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-primary" />
                  Dokumen Wajib Disiapkan
                </h2>
                <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest bg-surface-container-low px-3 py-1 rounded-full">
                  {dokumenWajib.length} Dokumen
                </span>
              </div>
              <div className="p-6 flex flex-col gap-3">
                {dokumenWajib.map((doc, idx) => {
                  const Icon = doc.icon;
                  return (
                    <div
                      key={idx}
                      className="flex items-start gap-4 p-4 rounded-xl bg-surface-container-lowest border border-border-subtle group hover:border-primary transition-colors"
                    >
                      <div className={`w-10 h-10 rounded-xl ${doc.bg} flex items-center justify-center ${doc.warna} shrink-0`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-grow">
                        <span className="block font-semibold text-sm text-on-surface mb-0.5">{doc.judul}</span>
                        <span className="block text-xs text-on-surface-variant leading-relaxed">{doc.deskripsi}</span>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-outline-variant group-hover:text-emerald-600 transition-colors shrink-0 mt-0.5" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Peringatan Penting */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-sm text-amber-800 mb-1">Peringatan Penting</h3>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Memberikan data palsu atau tidak akurat dalam pengajuan bantuan sosial merupakan pelanggaran hukum 
                  yang dapat mengakibatkan pembatalan bantuan dan proses hukum lebih lanjut. Pastikan seluruh 
                  informasi yang Anda isi sesuai dengan dokumen resmi.
                </p>
              </div>
            </div>

            {/* FAQ */}
            <div>
              <h2 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-4">
                Pertanyaan yang Sering Diajukan
              </h2>
              <div className="space-y-2">
                {faq.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-border-subtle rounded-xl overflow-hidden shadow-2xs"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left gap-4 hover:bg-surface-container-low transition-colors"
                    >
                      <span className="font-semibold text-sm text-on-surface">{item.pertanyaan}</span>
                      {openFaq === idx ? (
                        <ChevronUp className="w-4 h-4 text-primary shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-on-surface-variant shrink-0" />
                      )}
                    </button>
                    {openFaq === idx && (
                      <div className="px-5 pb-4 text-xs text-on-surface-variant leading-relaxed border-t border-border-subtle pt-3">
                        {item.jawaban}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Start Application */}
            <div className="bg-white border border-border-subtle rounded-2xl p-6 md:p-8 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="font-display text-lg font-extrabold text-on-surface mb-1">
                  Sudah siap untuk mengajukan?
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Jika Anda telah memenuhi seluruh kriteria di atas, segera mulai proses pengajuan bantuan sosial Anda.
                </p>
              </div>
              <Link
                href="/apply"
                className="shrink-0 h-12 px-7 bg-primary text-white font-bold text-sm rounded-xl flex items-center gap-2 hover:bg-primary-container transition-all active:scale-95 shadow-md hover:shadow-lg whitespace-nowrap"
              >
                Mulai Pengajuan
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full py-8 px-6 bg-white mt-auto border-t border-border-subtle">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-on-surface-variant">
          <div className="flex flex-col gap-1">
            <span className="font-bold tracking-wider uppercase text-on-surface">BANTUVERIF</span>
            <p className="text-secondary">© 2026 BantuVerif Citizen Platform. Secure &amp; Transparent Civic Tech.</p>
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
