"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Search,
  Bell,
  HelpCircle,
  ShieldCheck,
  X,
  UserX,
  MapPin,
  Map,
  FileText,
  Image as ImageIcon,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import OpsSidebar from "@/components/OpsSidebar";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Decision = "agree" | "unsure" | "disagree";

const evidenceFiles = [
  {
    name: "Surat_Keterangan_Masyarakat_Redacted.pdf",
    meta: "Ditandatangani Ketua RW",
    icon: FileText,
    iconBg: "bg-error-container text-error",
  },
  {
    name: "Tagihan_Listrik_M4.jpg",
    meta: "Validasi Alamat",
    icon: ImageIcon,
    iconBg: "bg-primary-fixed text-primary",
  },
  {
    name: "Kartu_Identitas_Masked.png",
    meta: "Bukti Pekerjaan",
    icon: FileText,
    iconBg: "bg-tertiary-fixed text-tertiary",
  },
];

export default function VerificationDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const appId = params?.id;
  const [decision, setDecision] = useState<Decision | null>(null);
  const [notes, setNotes] = useState("");
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "done" | "error">("idle");

  const decisionActive = (type: Decision) =>
    decision === type ? "ring-2 ring-primary bg-primary/5 border-primary" : "border-border-subtle";

  const handleSubmitVerification = async () => {
    if (!decision || !appId) return;
    setSubmitState("loading");
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setSubmitState("error");
      return;
    }
    const { error } = await supabase.from("verifications").insert({
      application_id: appId,
      verifier_id: session.user.id,
      decision,
      notes,
    });
    if (error) {
      console.error("Gagal menyimpan verifikasi:", error.message);
      setSubmitState("error");
      return;
    }
    setSubmitState("done");
    setTimeout(() => router.push("/ops/verifications"), 1200);
  };

  return (
    <div className="bg-background text-on-surface font-body min-h-screen selection:bg-primary-container selection:text-white overflow-x-hidden">
      {/* Side Nav Shell */}
      <OpsSidebar active="verifications" />

      {/* Main Content Shell */}
      <main className="md:pl-64 min-h-screen transition-all duration-300">
        {/* Top Nav Bar */}
        <header className="h-16 bg-surface border-b border-border-subtle sticky top-0 z-40">
          <div className="flex justify-between items-center px-4 md:px-gutter h-full w-full max-w-container-max mx-auto">
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="p-2 hover:bg-surface-container-low rounded-full transition-colors"
                aria-label="Kembali"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="h-8 w-px bg-border-subtle"></div>
              {/* TODO: sambungkan ke data asli — ID kasus */}
              <h2 className="font-display text-base md:text-lg font-extrabold text-on-surface">
                Case #BV-2024-8891
              </h2>
            </div>
            <div className="hidden lg:flex items-center gap-4 flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input
                  type="text"
                  placeholder="Cari operasi..."
                  className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full focus:ring-2 focus:ring-primary text-sm placeholder:text-on-surface-variant"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="hover:bg-surface-container-low rounded-full p-2 relative"
                aria-label="Notifikasi"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
              </button>
              <button
                type="button"
                className="hover:bg-surface-container-low rounded-full p-2"
                aria-label="Bantuan"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
              <button
                type="button"
                className="hover:bg-surface-container-low rounded-full p-1 pl-3 flex items-center gap-2 border border-border-subtle ml-2"
              >
                <span className="text-sm font-semibold pr-1">Ketua Tim</span>
                <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                  <span className="text-xs font-bold">OL</span>
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 md:p-8 max-w-container-max mx-auto">
          {/* Privacy Banner */}
          <div className="mb-8 p-4 bg-primary-fixed text-on-primary-fixed rounded-xl flex items-center gap-4 shadow-sm border border-primary/10">
            <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center text-primary shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold">Pengingat Privasi</h4>
              <p className="text-sm opacity-90 leading-relaxed">
                Informasi Identitas Pribadi (PII) disamarkan untuk peran Verifikator
                Komunitas ini. Anda melihat profil umum untuk validasi konsensus.
              </p>
            </div>
            <button
              type="button"
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-12 gap-8">
            {/* Left Column: Applicant Profile */}
            <div className="col-span-12 lg:col-span-8 space-y-8">
              {/* Applicant Summary Card */}
              <section className="bg-surface border border-border-subtle rounded-xl p-6 shadow-level1">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center text-outline">
                      <UserX className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl md:text-2xl font-bold text-on-surface">
                        Anonymous Applicant
                      </h3>
                      <p className="text-on-surface-variant flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4" />
                        Sektor 4-B, Distrik Utara
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-start sm:items-end">
                    <span className="px-3 py-1 bg-warning/10 text-warning rounded-full text-xs font-bold tracking-[0.05em] border border-warning/20 uppercase">
                      Konsensus Berjalan
                    </span>
                    <span className="text-sm text-on-surface-variant mt-2">
                      Diajukan 14 jam lalu
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-border-subtle">
                  <div className="space-y-1">
                    <p className="text-xs font-bold tracking-[0.05em] text-on-surface-variant uppercase">
                      Jumlah Anggota Rumah Tangga
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-on-surface">
                        5 Anggota
                      </span>
                      <span className="text-sm text-on-surface-variant">
                        (3 anak)
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold tracking-[0.05em] text-on-surface-variant uppercase">
                      Penghasilan Dilaporkan
                    </p>
                    <span className="text-xl font-bold text-success">
                      L-Tier 1
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold tracking-[0.05em] text-on-surface-variant uppercase">
                      Lama Tinggal
                    </p>
                    <span className="text-xl font-bold text-on-surface">
                      8.4 Tahun
                    </span>
                  </div>
                </div>
              </section>

              {/* Bento Grid for Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Location & Map */}
                <div className="bg-surface border border-border-subtle rounded-xl overflow-hidden shadow-level1 flex flex-col">
                  <div className="p-6">
                    <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
                      <Map className="w-5 h-5 text-primary" />
                      Kedekatan Geografis
                    </h4>
                    <div className="relative h-64 w-full rounded-lg bg-surface-container overflow-hidden">
                      {/* TODO: sambungkan ke data asli — peta lokasi applicant */}
                      <img
                        className="w-full h-full object-cover grayscale opacity-80"
                        alt="Peta topografis distrik perumahan dengan penanda lokasi"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAm9g2GFTriOAJq8C0cd51vpih6F_OlFYtpjdKEUAq7dNv54KDn4YWJHay5RmGDq2kOPxmC1ZMvgSNnqeU5zKpO5HJFBCNjRlykmtnEFiGwF8iWEoYhqnzqzF56e3P9Pf8Dp6U3mmlXAdetP_M_k2MDDj_NBrF_s6RloA9cKiJg_PfRCZgGw1wrpw6uSTY4rEKP2XIJjSwWFKV1TUanUEwWuYv7GzYxvMLCJfyKsBfeUvDwRybgNEs-nhHdW05oEjwC0hg"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 bg-primary/10 rounded-full border-2 border-primary/30 animate-pulse flex items-center justify-center">
                          <div className="w-4 h-4 bg-primary rounded-full shadow-level2"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-auto p-4 bg-surface-container-low border-t border-border-subtle flex justify-between">
                    <span className="text-sm text-on-surface-variant">
                      Jarak ke pusat: 1.2km
                    </span>
                    <span className="text-sm font-semibold text-primary">
                      Zona Terverifikasi
                    </span>
                  </div>
                </div>

                {/* Supporting Documents */}
                <div className="bg-surface border border-border-subtle rounded-xl p-6 shadow-level1">
                  <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Berkas Pendukung
                  </h4>
                  <div className="space-y-3">
                    {evidenceFiles.map((file) => {
                      const Icon = file.icon;
                      return (
                        <div
                          key={file.name}
                          className="flex items-center gap-3 p-3 border border-border-subtle rounded-lg hover:bg-surface-container-low cursor-pointer transition-colors group"
                        >
                          <div
                            className={`w-10 h-10 rounded flex items-center justify-center shrink-0 ${file.iconBg}`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            {/* TODO: sambungkan ke data asli — daftar dokumen evidence */}
                            <p className="text-sm font-semibold truncate">
                              {file.name}
                            </p>
                            <p className="text-sm text-on-surface-variant">
                              {file.meta}
                            </p>
                          </div>
                          <Eye className="w-5 h-5 text-outline group-hover:text-primary transition-colors" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Verification Panel */}
            <div className="col-span-12 lg:col-span-4 space-y-8">
              {/* Consensus Progress */}
              <section className="bg-surface border border-border-subtle rounded-xl p-6 shadow-level1">
                <h4 className="text-sm font-semibold mb-6">Progres Konsensus</h4>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex -space-x-2">
                    <div className="w-10 h-10 rounded-full border-2 border-surface bg-success text-white flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-surface bg-success text-white flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-surface bg-surface-container-highest text-outline flex items-center justify-center">
                      <Clock className="w-5 h-5" />
                    </div>
                  </div>
                  <span className="text-base font-bold">2 dari 3 suara terkumpul</span>
                </div>
                <div className="w-full bg-surface-container-low rounded-full h-2">
                  <div className="bg-success h-2 rounded-full w-[66%]"></div>
                </div>
                <p className="text-sm text-on-surface-variant mt-4 leading-relaxed">
                  Satu verifikasi lagi diperlukan untuk memfinalisasi kelayakan
                  pemohon ini.
                </p>
              </section>

              {/* Action Panel */}
              <section className="bg-surface border border-border-subtle rounded-xl p-6 shadow-level1 border-t-4 border-t-primary">
                <h4 className="text-sm font-semibold mb-4">Penilaian Anda</h4>
                <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
                  Berdasarkan ringkasan rumah tangga dan bukti yang diberikan,
                  apakah Anda memverifikasi klaim pemohon ini?
                </p>
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => setDecision("agree")}
                    className={`w-full flex items-center justify-between p-4 border rounded-xl hover:border-success hover:bg-success/5 transition-all group ${decisionActive("agree")}`}
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-outline group-hover:text-success" />
                      <span className="text-sm font-semibold">Setuju</span>
                    </div>
                    <span className="text-sm opacity-60">Informasi Terkonfirmasi</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDecision("unsure")}
                    className={`w-full flex items-center justify-between p-4 border rounded-xl hover:border-warning hover:bg-warning/5 transition-all group ${decisionActive("unsure")}`}
                  >
                    <div className="flex items-center gap-3">
                      <HelpCircle className="w-5 h-5 text-outline group-hover:text-warning" />
                      <span className="text-sm font-semibold">Ragu</span>
                    </div>
                    <span className="text-sm opacity-60">Perlu Info Lebih Lanjut</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDecision("disagree")}
                    className={`w-full flex items-center justify-between p-4 border rounded-xl hover:border-danger hover:bg-danger/5 transition-all group ${decisionActive("disagree")}`}
                  >
                    <div className="flex items-center gap-3">
                      <XCircle className="w-5 h-5 text-outline group-hover:text-danger" />
                      <span className="text-sm font-semibold">Tolak</span>
                    </div>
                    <span className="text-sm opacity-60">Terdapat Ketidaksesuaian</span>
                  </button>
                </div>
                <div className="mt-8 space-y-2">
                  <label className="text-xs font-bold tracking-[0.05em] text-on-surface-variant uppercase">
                    Catatan Justifikasi
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary h-32 text-sm resize-none placeholder:text-on-surface-variant"
                    placeholder="Jelaskan keputusan Anda untuk keperluan audit..."
                  ></textarea>
                </div>
                {/* Submit keputusan ke tabel verifications (RLS: verifikator) */}
                <button
                  type="button"
                  disabled={!decision || submitState === "loading"}
                  onClick={handleSubmitVerification}
                  className="w-full py-4 mt-6 bg-primary text-white rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
                >
                  {submitState === "loading"
                    ? "Menyimpan..."
                    : submitState === "done"
                      ? "Tersimpan ✓"
                      : "Kirim Verifikasi"}
                </button>
                {submitState === "error" && (
                  <p className="text-center text-danger text-xs font-semibold mt-3">
                    Gagal menyimpan. Pastikan tabel verifications sudah dibuat (jalankan supabase/schema.sql) dan akun Anda berperan verifikator.
                  </p>
                )}
                <p className="text-center text-sm text-on-surface-variant mt-4">
                  Tindakan ini akan dicatat pada buku publik dengan ID anonim Anda.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
