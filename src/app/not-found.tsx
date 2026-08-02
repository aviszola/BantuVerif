"use client";

import Link from "next/link";
import { ShieldCheck, ArrowLeft, Home, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-on-surface font-body flex flex-col justify-between">
      {/* Header */}
      <header className="bg-white border-b border-border-subtle">
        <div className="max-w-[1280px] mx-auto px-6 h-[72px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 no-underline">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-container to-primary rounded-DEFAULT flex items-center justify-center text-white shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="font-display text-2xl font-extrabold text-on-surface tracking-tight">
              Bantu<span className="text-primary-container">Verif</span>
            </span>
          </Link>
          <Link
            href="/"
            className="btn-48 px-5 rounded-DEFAULT font-semibold text-sm bg-primary-container/10 text-primary-container hover:bg-primary-container/20 transition-colors flex items-center gap-2"
          >
            <Home className="w-4 h-4" /> Ke Beranda
          </Link>
        </div>
      </header>

      {/* 404 Content */}
      <main className="max-w-[640px] mx-auto px-6 py-20 text-center flex-1 flex flex-col justify-center items-center">
        <div className="w-20 h-20 bg-primary-container/10 text-primary-container rounded-full flex items-center justify-center mb-6 border border-primary-container/20 shadow-sm">
          <FileQuestion className="w-10 h-10" />
        </div>
        <div className="text-xs font-bold tracking-widest text-primary-container uppercase mb-2">
          KESALAHAN 404
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold font-display text-text-ink mb-4">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-lg text-on-surface-variant mb-8 leading-relaxed">
          Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan. Silakan kembali ke halaman utama untuk melanjutkan navigasi.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="btn-48 px-7 rounded-DEFAULT font-semibold text-[15px] bg-primary-container text-white hover:bg-primary shadow-[0_4px_12px_rgba(37,99,235,0.2)] transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-4.5 h-4.5" /> Kembali ke Beranda
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest border-t border-border-subtle py-6 text-xs text-center text-on-surface-variant">
        © 2026 Platform BantuVerif. Teknologi Kewargaan Aman & Transparan.
      </footer>
    </div>
  );
}
