"use client";

import React, { useEffect } from "react";
import {
  BadgeCheck,
  Plus,
  LayoutDashboard,
  ShieldCheck,
  History,
  Settings,
  HelpCircle,
  Bell,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Clock,
  BarChart3,
  Target,
} from "lucide-react";
import OpsSidebar from "@/components/OpsSidebar";

const pendingTasks = [
  {
    id: "#821",
    ref: "USR-9921-X",
    type: "Residential Address",
    distance: "0.4 km",
    expiry: "2h Left",
    urgent: true,
  },
  {
    id: "#815",
    ref: "USR-1044-B",
    type: "Business License",
    distance: "1.2 km",
    expiry: "8h Left",
    urgent: false,
  },
  {
    id: "#798",
    ref: "USR-0567-K",
    type: "Identity Document",
    distance: "2.1 km",
    expiry: "14h Left",
    urgent: false,
  },
  {
    id: "#782",
    ref: "USR-3312-Z",
    type: "Asset Inspection",
    distance: "4.5 km",
    expiry: "1d Left",
    urgent: false,
  },
];

export default function VerifierDashboardPage() {
  // Smooth entrance animation untuk metric cards — replicasi script HTML asli
  useEffect(() => {
    const cards = document.querySelectorAll("[data-entrance]");
    cards.forEach((card, index) => {
      (card as HTMLElement).style.opacity = "0";
      (card as HTMLElement).style.transform = "translateY(20px)";
      setTimeout(() => {
        (card as HTMLElement).style.transition =
          "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
        (card as HTMLElement).style.opacity = "1";
        (card as HTMLElement).style.transform = "translateY(0)";
      }, index * 100);
    });
  }, []);

  return (
    <div className="bg-background text-on-surface font-body min-h-screen selection:bg-primary-container selection:text-white">
      {/* Side Navigation Bar */}
      <OpsSidebar active="dashboard" />

      {/* Main Content Area */}
      <main className="md:ml-64 min-h-screen flex flex-col">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 right-0 z-40 bg-surface border-b border-border-subtle">
          <div className="flex justify-between items-center px-4 md:px-gutter h-16 w-full max-w-container-max mx-auto">
            <div className="flex items-center gap-8">
              <span className="font-display text-lg font-extrabold text-on-surface">
                BantuVerif Ops
              </span>
              <nav className="hidden lg:flex items-center gap-6 text-sm">
                <a
                  className="text-primary border-b-2 border-primary pb-1 font-semibold"
                  href="#"
                >
                  Ikhtisar
                </a>
                <a
                  className="text-on-surface-variant hover:text-on-surface transition-colors"
                  href="#"
                >
                  Laporan
                </a>
                <a
                  className="text-on-surface-variant hover:text-on-surface transition-colors"
                  href="#"
                >
                  Inventaris
                </a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative group">
                <Bell className="w-5 h-5 p-0.5 hover:bg-surface-container-low rounded-full cursor-pointer text-on-surface-variant transition-colors" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-danger rounded-full ring-2 ring-surface"></span>
              </div>
              <HelpCircle className="w-5 h-5 p-0.5 hover:bg-surface-container-low rounded-full cursor-pointer text-on-surface-variant transition-colors" />
              <div className="flex items-center gap-3 pl-4 border-l border-border-subtle">
                <div className="text-right">
                  <p className="text-sm font-semibold text-on-surface leading-none">
                    James Kwesi
                  </p>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mt-0.5">
                    Verifikator Komunitas
                  </p>
                </div>
                <div className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center">
                  <span className="text-sm font-bold text-on-surface-variant">
                    JK
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Canvas */}
        <div className="mt-6 p-4 md:p-gutter flex-1 space-y-8 max-w-container-max mx-auto w-full">
          {/* Page Header */}
          <section className="flex flex-col md:flex-row justify-between items-end gap-4">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-on-surface">
                Dasbor Verifikator
              </h2>
              {/* TODO: sambungkan ke data asli — nama verifier & jumlah tugas */}
              <p className="text-sm md:text-base text-on-surface-variant">
                Selamat kembali, James. Anda memiliki 12 tugas tertunda di sekitar Anda.
              </p>
            </div>
            {/* TODO: sambungkan ke data asli — toggle range waktu */}
            <div className="flex gap-2 bg-surface p-1 rounded-xl border border-border-subtle shadow-sm">
              <button
                type="button"
                className="px-4 py-2 bg-surface-container-high text-on-surface rounded-lg text-sm font-semibold"
              >
                Real-time
              </button>
              <button
                type="button"
                className="px-4 py-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg text-sm font-semibold transition-colors"
              >
                30 Hari Terakhir
              </button>
            </div>
          </section>

          {/* Metrics Bento Grid — data statis, TODO sambungkan ke API */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              data-entrance
              className="bg-surface p-6 rounded-xl border border-border-subtle shadow-sm flex flex-col justify-between hover:shadow-level2 transition-shadow"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold tracking-[0.05em] text-on-surface-variant uppercase">
                  Skor Kepercayaan Komunitas
                </span>
                <BadgeCheck className="w-5 h-5 text-success" />
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-display text-4xl font-bold text-on-surface">
                  98%
                </span>
                <span className="text-success text-sm font-semibold">
                  +0.5%
                </span>
              </div>
              <div className="mt-4 w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
                <div className="bg-success h-full w-[98%] rounded-full"></div>
              </div>
            </div>

            <div
              data-entrance
              className="bg-surface p-6 rounded-xl border border-border-subtle shadow-sm flex flex-col justify-between hover:shadow-level2 transition-shadow"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold tracking-[0.05em] text-on-surface-variant uppercase">
                  Verifikasi Tertunda
                </span>
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <div className="mt-4">
                <span className="font-display text-4xl font-bold text-on-surface">
                  12
                </span>
                <p className="text-on-surface-variant text-sm mt-1">
                  4 Mendesak (dalam 2km)
                </p>
              </div>
              <div className="mt-4 flex -space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-surface bg-surface-container-highest flex items-center justify-center text-[10px] font-bold text-on-surface">
                  BV
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-surface bg-primary-fixed flex items-center justify-center text-[10px] font-bold text-on-surface">
                  AJ
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-surface bg-secondary-fixed flex items-center justify-center text-[10px] font-bold text-on-surface">
                  KM
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-surface bg-surface-container text-[10px] flex items-center justify-center font-bold text-on-surface">
                  +9
                </div>
              </div>
            </div>

            <div
              data-entrance
              className="bg-surface p-6 rounded-xl border border-border-subtle shadow-sm flex flex-col justify-between hover:shadow-level2 transition-shadow"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold tracking-[0.05em] text-on-surface-variant uppercase">
                  Total Dikontribusikan
                </span>
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <div className="mt-4">
                <span className="font-display text-4xl font-bold text-on-surface">
                  452
                </span>
                <p className="text-on-surface-variant text-sm mt-1">
                  Verifikasi Seumur Hidup
                </p>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="px-2 py-1 bg-primary/10 text-primary rounded text-[10px] font-bold uppercase tracking-widest">
                  Tingkat Platinum
                </span>
              </div>
            </div>

            <div
              data-entrance
              className="bg-surface p-6 rounded-xl border border-border-subtle shadow-sm flex flex-col justify-between hover:shadow-level2 transition-shadow"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold tracking-[0.05em] text-on-surface-variant uppercase">
                  Akurasi Verifikasi
                </span>
                <Target className="w-5 h-5 text-secondary" />
              </div>
              <div className="mt-4">
                <span className="font-display text-4xl font-bold text-on-surface">
                  99.4%
                </span>
                <p className="text-on-surface-variant text-sm mt-1">
                  Berdasarkan audit rekan
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-success"></div>
                <span className="text-xs text-on-surface-variant">
                  Standar Presisi Tinggi
                </span>
              </div>
            </div>
          </section>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Table Section (2/3 width) */}
            <section className="lg:col-span-2 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-bold text-on-surface">
                  Tugas Verifikasi Tertunda
                </h3>
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-on-surface-variant cursor-pointer p-0.5 hover:bg-surface-container-low rounded-full transition-colors" />
                  <Search className="w-5 h-5 text-on-surface-variant cursor-pointer p-0.5 hover:bg-surface-container-low rounded-full transition-colors" />
                </div>
              </div>

              <div className="bg-surface border border-border-subtle rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-surface-container-low border-b border-border-subtle">
                      <tr>
                        {[
                          "ID Pelamar",
                          "Tipe",
                          "Jarak",
                          "Kadaluarsa",
                          "Aksi",
                        ].map((h) => (
                          <th
                            key={h}
                            className="px-6 py-4 text-xs font-bold tracking-[0.05em] text-on-surface-variant uppercase"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {pendingTasks.map((task) => (
                        <tr
                          key={task.id}
                          className="hover:bg-surface-container-lowest transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center font-bold text-xs text-on-surface-variant">
                                {task.id}
                              </div>
                              <span className="text-sm font-semibold text-on-surface">
                                {task.ref}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-on-surface-variant">
                            {task.type}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-on-surface">
                            {task.distance}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                task.urgent
                                  ? "bg-error-container text-on-error-container"
                                  : "bg-surface-container-highest text-on-surface-variant"
                              }`}
                            >
                              {task.expiry}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {/* TODO: sambungkan ke data asli — navigasi verifikasi task */}
                            <button
                              type="button"
                              className="bg-primary text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-primary-container transition-all active:scale-95 shadow-sm"
                            >
                              Mulai Verifikasi
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-4 bg-surface-container-low border-t border-border-subtle flex items-center justify-between">
                  <span className="text-xs text-on-surface-variant font-medium">
                    Menampilkan 4 dari 12 tugas aktif
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="w-8 h-8 flex items-center justify-center rounded border border-border-subtle hover:bg-surface-container-high text-on-surface-variant transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="w-8 h-8 flex items-center justify-center rounded border border-border-subtle hover:bg-surface-container-high text-on-surface-variant transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Sidebar Content (1/3 width) */}
            <section className="flex flex-col gap-6">
              {/* Verification History Card */}
              <div className="bg-surface rounded-xl border border-border-subtle shadow-sm flex flex-col overflow-hidden">
                <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between">
                  <h3 className="font-display text-lg font-bold text-on-surface">
                    Riwayat Terbaru
                  </h3>
                  <a
                    className="text-primary text-xs font-semibold hover:underline"
                    href="#"
                  >
                    Lihat Semua
                  </a>
                </div>
                <div className="p-4 space-y-4">
                  <div className="flex items-center gap-4 cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-success shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-on-surface truncate">
                        USR-8821-M Terverifikasi
                      </p>
                      <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-tighter">
                        Selesai 2 jam lalu
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-on-surface">
                        +Rp 150.000
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-success shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-on-surface truncate">
                        USR-7712-P Terverifikasi
                      </p>
                      <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-tighter">
                        Selesai 5 jam lalu
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-on-surface">
                        +Rp 100.000
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center text-error shrink-0">
                      <XCircle className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-on-surface truncate">
                        USR-4410-L Ditolak
                      </p>
                      <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-tighter">
                        Selesai kemarin
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-on-surface">
                        +Rp 50.000
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Visualizer */}
              <div className="bg-surface rounded-xl border border-border-subtle shadow-sm overflow-hidden h-64 relative">
                <div
                  className="w-full h-full bg-cover bg-center"
                  role="img"
                  aria-label="Peta digital kota dengan penanda lokasi verifikasi berwarna biru"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAEXewu5niGZ7IQzwx9M3b9D34thSzC7KxPLqnZiD-hRqRbZFHnTbycjIDkc7rgyhMEbws12SN3APi1gXbFDgNPsBUhxBqR0tCGQgWj4G1zHrpFMlzF_T3hzPqD2hSdkuo7D_yJ7w2bE1s3FTU_pkPGkLNzJQCwV0rROfk8GRdWNcnBu95gNJ5QKLp6Oxp0BMuH5SLJJFQJ5Ro+Z2VY9XQ')",
                  }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-surface/80 to-transparent p-4 flex flex-col justify-end">
                  <p className="font-semibold text-on-surface">
                    Tugas di Sekitar Anda
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    Kecamatan Gambir, Jakarta Pusat
                  </p>
                </div>
                <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-level2">
                  Peta Aktif
                </div>
              </div>

              {/* Pro-Tip Card */}
              <div className="bg-primary-container p-6 rounded-xl border border-primary/20 relative overflow-hidden">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
                <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Kiat Pro
                </h4>
                <p className="text-sm text-white/90 leading-relaxed">
                  Selesaikan 3 verifikasi lagi hari ini untuk memicu{" "}
                  <span className="font-bold underline">
                    Pengali Imbalan 1,5x
                  </span>{" "}
                  untuk kontribusi Anda minggu depan!
                </p>
                <button
                  type="button"
                  className="mt-4 text-xs font-bold text-white underline decoration-2 underline-offset-4"
                >
                  Pelajari Lebih Lanjut
                </button>
              </div>
            </section>
          </div>
        </div>

        {/* Sticky Mobile Bottom Bar */}
        <div className="md:hidden sticky bottom-0 left-0 right-0 h-16 bg-surface border-t border-border-subtle flex items-center justify-around px-4">
          <LayoutDashboard className="w-6 h-6 text-primary" />
          <ShieldCheck className="w-6 h-6 text-on-surface-variant" />
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white -mt-8 shadow-level2">
            <Plus className="w-6 h-6" />
          </div>
          <History className="w-6 h-6 text-on-surface-variant" />
          <Settings className="w-6 h-6 text-on-surface-variant" />
        </div>
      </main>
    </div>
  );
}
