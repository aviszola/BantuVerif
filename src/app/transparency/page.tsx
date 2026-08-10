"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Wallet,
  BadgeCheck,
  Users,
  Timer,
  ClipboardCheck,
  TrendingUp,
  TrendingDown,
  Download,
  Share2,
  Globe,
  MoreVertical,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Landmark,
  RefreshCw,
  Mail,
} from "lucide-react";

const ledgerEvents = [
  {
    icon: BadgeCheck,
    iconColor: "text-primary",
    title: "Batch Verified",
    region: "REG-8821-X",
    hash: "0x4f...9e21",
    status: "Berhasil",
    statusBg: "bg-success/10 text-success",
    time: "Baru saja",
  },
  {
    icon: Landmark,
    iconColor: "text-primary",
    title: "Dana Disalurkan",
    region: "REG-1044-A",
    hash: "0x8a...331b",
    status: "Selesai",
    statusBg: "bg-success/10 text-success",
    time: "2 menit lalu",
  },
  {
    icon: RefreshCw,
    iconColor: "text-tertiary",
    title: "Konsensus Tercapai",
    region: "NODE-004",
    hash: "0x22...ff11",
    status: "Aktif",
    statusBg: "bg-primary/10 text-primary",
    time: "5 menit lalu",
  },
];

export default function TransparencyDashboardPage() {
  const [totalApps, setTotalApps] = useState(0);
  const [approvedApps, setApprovedApps] = useState(0);
  const [distributedApps, setDistributedApps] = useState(0);
  const [approvalRate, setApprovalRate] = useState("100%");

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("applications")
        .select("id, status");
      if (data) {
        const total = data.length;
        const approved = data.filter((a) => a.status === "approved" || a.status === "distributed").length;
        const distributed = data.filter((a) => a.status === "distributed").length;
        setTotalApps(total);
        setApprovedApps(approved);
        setDistributedApps(distributed);
        if (total > 0) {
          setApprovalRate(`${((approved / total) * 100).toFixed(1)}%`);
        }
      }
    })();
  }, []);
  return (
    <div className="bg-background text-on-surface font-body min-h-screen flex flex-col selection:bg-primary-container selection:text-white">
      <main className="pt-10 md:pt-16 pb-12 px-4 md:px-gutter max-w-container-max mx-auto w-full">
        {/* Hero Section */}
        <section className="mb-12 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-success/10 text-success rounded-full mb-4">
              <BadgeCheck className="w-[18px] h-[18px]" />
              <span className="text-xs font-bold tracking-[0.05em] uppercase">
                Transparansi Publik Langsung
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-extrabold text-on-surface mb-2 tracking-tight">
              BantuVerif Dasbor
            </h1>
            <p className="text-lg text-on-surface-variant max-w-2xl leading-relaxed">
              Metrik tata kelola dan penyaluran secara real-time. BantuVerif
              meyakini empati institusional&mdash;bukti yang jelas, tanpa
              suntingan, bahwa bantuan sampai ke yang membutuhkan.
            </p>
          </div>
          {/* TODO: sambungkan ke data asli — export & share report */}
          <div className="flex gap-3">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-3 bg-surface border border-border-subtle rounded-xl text-sm font-semibold hover:bg-surface-container-low transition-colors shadow-level2"
            >
              <Download className="w-5 h-5" />
              Ekspor Laporan Transparansi
            </button>
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-3 bg-surface border border-border-subtle rounded-xl text-sm font-semibold hover:bg-surface-container-low transition-colors shadow-level2"
            >
              <Share2 className="w-5 h-5" />
              Bagikan Data
            </button>
          </div>
        </section>

        {/* Metrics Grid — data statis, TODO sambungkan ke API */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-surface p-6 rounded-xl border border-border-subtle shadow-level2 transition-transform hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-primary-fixed rounded-lg">
                <Wallet className="w-5 h-5 text-primary" />
              </div>
              <span className="text-success text-sm font-semibold flex items-center gap-1">
                <TrendingUp className="w-4 h-4" /> 12%
              </span>
            </div>
            <p className="text-on-surface-variant text-xs font-bold tracking-[0.05em] mb-1 uppercase">
              Total Pengajuan Terdaftar
            </p>
            <h2 className="text-2xl md:text-3xl font-bold">{totalApps}</h2>
            <p className="text-sm text-outline mt-2 italic">Data langsung dari database</p>
          </div>

          <div className="bg-surface p-6 rounded-xl border border-border-subtle shadow-level2 transition-transform hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-secondary-fixed rounded-lg">
                <Users className="w-5 h-5 text-secondary" />
              </div>
              <span className="text-success text-sm font-semibold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Real-time
              </span>
            </div>
            <p className="text-on-surface-variant text-xs font-bold tracking-[0.05em] mb-1 uppercase">
              Pengajuan Disetujui / Disalurkan
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-on-surface">
              {approvedApps}
            </h2>
            <div className="flex items-center gap-1 mt-2">
              <ShieldCheck className="w-4 h-4 text-success" />
              <span className="text-sm text-outline">Penerima Manfaat</span>
            </div>
          </div>

          <div className="bg-surface p-6 rounded-xl border border-border-subtle shadow-level2 transition-transform hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-tertiary-fixed rounded-lg">
                <Timer className="w-5 h-5 text-tertiary" />
              </div>
            </div>
            <p className="text-on-surface-variant text-xs font-bold tracking-[0.05em] mb-1 uppercase">
              Bantuan Tersalurkan
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-on-surface">
              {distributedApps}
            </h2>
            <div className="w-full bg-surface-container-high h-1 rounded-full mt-4">
              <div className="bg-tertiary h-1 rounded-full w-[100%]"></div>
            </div>
          </div>

          <div className="bg-surface p-6 rounded-xl border border-border-subtle shadow-level2 transition-transform hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-success/20 rounded-lg">
                <ClipboardCheck className="w-5 h-5 text-success" />
              </div>
              <span className="text-outline text-sm font-semibold">
                Target: 100%
              </span>
            </div>
            <p className="text-on-surface-variant text-xs font-bold tracking-[0.05em] mb-1 uppercase">
              Tingkat Persetujuan
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-on-surface">
              {approvalRate}
            </h2>
            <div className="w-full bg-surface-container-high h-1 rounded-full mt-4">
              <div className="bg-success h-1 rounded-full w-[100%]"></div>
            </div>
            <p className="text-sm text-outline mt-2">Terverifikasi via node multi-sig</p>
            <p className="mt-2 inline-flex px-2 py-0.5 rounded bg-warning/10 text-warning text-[10px] font-bold uppercase tracking-wider">
              Data Simulasi
            </p>
          </div>
        </section>

        {/* Bento: Heatmap + Side Insights */}
        <div className="grid grid-cols-12 gap-gutter">
          {/* Heatmap Visualization */}
          <div className="col-span-12 lg:col-span-8 bg-surface border border-border-subtle rounded-2xl p-8 shadow-level2 overflow-hidden relative min-h-[500px]">
            <div className="flex flex-col sm:flex-row justify-between items-start mb-8 relative z-10">
              <div>
                <h3 className="font-display text-xl md:text-2xl font-bold text-on-surface">
                  Peta Panas Distribusi Regional
                </h3>
                <p className="text-on-surface-variant text-sm">
                  Intensitas mencerminkan volume bantuan dan kepadatan rumah tangga per provinsi.
                </p>
              </div>
              {/* TODO: sambungkan ke data asli — toggle metrik */}
              <div className="flex bg-surface-container-low p-1 rounded-lg border border-border-subtle mt-3 sm:mt-0">
                <button
                  type="button"
                  className="px-3 py-1 bg-surface shadow-sm rounded-md text-sm font-semibold"
                >
                  Volume
                </button>
                <button
                  type="button"
                  className="px-3 py-1 hover:bg-surface-container rounded-md text-sm font-semibold text-on-surface-variant transition-colors"
                >
                  Households
                </button>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="w-full h-[360px] rounded-xl bg-surface-container-low overflow-hidden relative border border-border-subtle">
              {/* TODO: sambungkan ke data asli — peta distribusi */}
              <div
                className="bg-cover bg-center w-full h-full opacity-90 grayscale-[0.5]"
                role="img"
                aria-label="Peta panas digital distribusi bantuan per provinsi"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCi483AedKqB7_FbZe6oBPKQrd6abWWZ1gQxYKrhQjNAsNGz69NzhI2Jefuxm2ZRREAKCWXknIdejdzYh-m5U_gVv8BkH_Fc8uZFPl5Xt6UVHIXZYUq6eJNKZfAvR9Sn4DrooBpqT3k8pVxX0toz8mF8h7wj_FooTUg_ahuHm_E_K4xZBXI0vltvvJKvbM_5N9BeYmk-99YogTzXr0AyBEMQDPR73zgE6_hvHNkZ0ocDkd9OLwZ9CW1bQ1BQ')",
                }}
              ></div>
              {/* Floating Map Legend */}
              <div className="absolute bottom-6 right-6 glass-card p-4 rounded-xl border border-border-subtle shadow-level2">
                <p className="text-[10px] mb-2 uppercase font-bold tracking-wider text-on-surface-variant">
                  Intensitas Distribusi
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs">Low</span>
                  <div className="w-32 h-2 rounded-full bg-gradient-to-r from-primary-fixed to-primary"></div>
                  <span className="text-xs">High</span>
                </div>
              </div>
              {/* Interactive Marker */}
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 group cursor-pointer">
                <div className="w-4 h-4 bg-primary rounded-full ring-4 ring-primary/20 animate-pulse"></div>
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-48 glass-card p-3 rounded-xl border border-border-subtle opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {/* TODO: sambungkan ke data asli — data district */}
                  <p className="text-sm font-semibold">Distrik Pusat</p>
                  <p className="text-xs text-on-surface-variant mb-1">Bantuan: $12.4 Jt</p>
                  <div className="flex justify-between items-center text-[10px] text-success font-bold">
                    <span>98% Terverifikasi</span>
                    <span>Pembaruan Langsung</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Side Insights */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            {/* Trend Chart */}
            <div className="bg-surface border border-border-subtle rounded-2xl p-6 shadow-level2 flex-1">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-semibold text-on-surface">
                  Tren Pengajuan
                </h3>
                <MoreVertical className="w-5 h-5 text-outline" />
              </div>
              {/* TODO: sambungkan ke data asli — data chart bulanan */}
              <div className="space-y-4">
                <div className="flex items-end justify-between gap-1 h-32 px-2">
                  {[
                    "40%",
                    "55%",
                    "45%",
                    "70%",
                    "65%",
                    "85%",
                    "95%",
                  ].map((h, i) => (
                    <div
                      key={i}
                      className={`w-full bg-primary/10 rounded-t-sm relative group hover:bg-primary/30 transition-colors ${h === "40%" ? "h-[40%]" : h === "95%" ? "h-[95%]" : h}`}
                    ></div>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] font-bold tracking-wider text-outline uppercase">
                  <span>Jan</span>
                  <span>Mar</span>
                  <span>May</span>
                  <span>Jul</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-border-subtle space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span className="text-sm text-on-surface-variant">Pengajuan</span>
                  </div>
                  <span className="text-sm font-semibold">245.2k</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success"></div>
                    <span className="text-sm text-on-surface-variant">Persetujuan</span>
                  </div>
                  <span className="text-sm font-semibold">212.8k</span>
                </div>
              </div>
            </div>

            {/* Privacy Badge Card */}
            <div className="bg-inverse-surface text-inverse-on-surface border border-outline-variant rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-on-surface-variant/30 rounded text-[10px] font-bold tracking-widest uppercase mb-4">
                  Kunci Privasi
                </div>
                <h3 className="font-display text-xl font-bold mb-2">
                  Hanya Data Agregat
                </h3>
                <p className="text-surface-variant text-sm mb-6 leading-relaxed">
                  Informasi identitas pribadi (PII) dibersihkan secara kriptografis
                  sebelum masuk ke buku besar publik.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary-fixed-dim" />
                    <span className="text-sm font-semibold">
                      Verifikasi Zero-Knowledge
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary-fixed-dim" />
                    <span className="text-sm font-semibold">
                      Sesuai UU PDP
                    </span>
                  </li>
                </ul>
              </div>
              <ShieldCheck className="absolute -bottom-4 -right-4 w-36 h-36 text-white/5 rotate-12" />
            </div>
          </div>
        </div>

        {/* Recent Ledger Events */}
        <section className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-display text-xl md:text-2xl font-bold">
              Buku Besar Verifikasi Langsung
            </h3>
            <a
              className="text-primary text-sm font-semibold hover:underline flex items-center gap-1"
              href="#"
            >
              Lihat Audit Log Penuh
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <div className="bg-surface border border-border-subtle rounded-2xl overflow-hidden shadow-level2">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-border-subtle">
                    {["Tipe Event", "ID Wilayah", "Tanda Tangan Hash", "Status", "Waktu"].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-6 py-4 text-xs font-bold tracking-[0.05em] text-on-surface-variant uppercase"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {ledgerEvents.map((ev) => {
                    const Icon = ev.icon;
                    return (
                      <tr
                        key={ev.hash}
                        className="hover:bg-surface-container-lowest transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Icon className={`w-5 h-5 ${ev.iconColor}`} />
                            <span className="text-sm font-semibold">
                              {ev.title}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-mono">
                          {ev.region}
                        </td>
                        <td className="px-6 py-4 text-sm font-mono text-outline">
                          {ev.hash}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${ev.statusBg}`}
                          >
                            {ev.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-outline">
                          {ev.time}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border-border-subtle py-12 px-gutter mt-12">
        <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-7 h-7 text-primary" />
              <span className="font-display text-lg font-extrabold text-on-surface">
                BantuVerif Ops
              </span>
            </div>
            <p className="text-on-surface-variant text-sm max-w-sm mb-6 leading-relaxed">
              Platform yang didedikasikan untuk transparansi radikal dalam
              penyaluran bantuan sosial. Dibangun untuk warga, diverifikasi oleh
              komunitas.
            </p>
            <div className="flex gap-4">
              <a
                className="w-10 h-10 rounded-full bg-surface-container border border-border-subtle flex items-center justify-center hover:bg-surface-container-high transition-colors"
                href="#"
                aria-label="Globe"
              >
                <Globe className="w-5 h-5" />
              </a>
              <a
                className="w-10 h-10 rounded-full bg-surface-container border border-border-subtle flex items-center justify-center hover:bg-surface-container-high transition-colors"
                href="#"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-on-surface mb-4 uppercase tracking-wider text-xs">
              Sumber Daya
            </h4>
            <ul className="space-y-3 text-sm">
              {["Proses Verifikasi", "Daftar Node Wilayah", "Kebijakan Privasi", "Dokumentasi API"].map(
                (l) => (
                  <li key={l}>
                    <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">
                      {l}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-on-surface mb-4 uppercase tracking-wider text-xs">
              Tata Kelola
            </h4>
            <ul className="space-y-3 text-sm">
              {["Dewan Integritas", "Piagam Transparansi", "Portal Whistleblower", "Laporan Tahunan"].map(
                (l) => (
                  <li key={l}>
                    <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">
                      {l}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
        <div className="max-w-container-max mx-auto mt-12 pt-8 border-t border-border-subtle flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-outline">
            © 2026 Portal Transparansi BantuVerif. Informasi publik disediakan
            di bawah Lisensi Pemerintah Terbuka.
          </p>
          <div className="flex gap-6 text-xs text-outline">
            {["Privasi", "Ketentuan", "Aksesibilitas"].map((l) => (
              <a key={l} className="hover:text-on-surface" href="#">
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
