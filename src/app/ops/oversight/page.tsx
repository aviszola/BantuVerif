import React from "react";
import {
  Handshake,
  MessageSquarePlus,
  BadgeCheck,
  Calendar,
  Download,
  Search,
  Bell,
  HelpCircle,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  ChevronDown,
} from "lucide-react";
import OpsSidebar from "@/components/OpsSidebar";

const criticalReviews = [
  {
    name: "Bambang Susanto",
    time: "2h ago",
    note: "Address verification mismatch in Kelurahan Senayan. Needs manual site survey.",
    border: "border-l-danger",
    rejectHover: true,
  },
  {
    name: "Siti Aminah",
    time: "5h ago",
    note: "Duplicate NIK detected across two RW regions. Potential residency update required.",
    border: "border-l-warning",
    rejectHover: false,
  },
  {
    name: "Agus Mulyadi",
    time: "1d ago",
    note: "Incomplete document upload: Missing RT Stamp of Approval.",
    border: "border-l-danger",
    rejectHover: false,
  },
];

const operationsLog = [
  {
    initials: "DW",
    name: "Dewi Wulansari",
    nik: "3174**********01",
    type: "New Residency",
    dot: "bg-success",
    status: "text-success",
    label: "Approved",
    admin: "Admin RT 04",
  },
  {
    initials: "RM",
    name: "Rian Mahendra",
    nik: "3174**********05",
    type: "Family Card Edit",
    dot: "bg-warning",
    status: "text-warning",
    label: "In Consensus",
    admin: "Admin RW 08",
  },
  {
    initials: "LS",
    name: "Lestari Sari",
    nik: "3174**********12",
    type: "Residency Exit",
    dot: "bg-primary",
    status: "text-primary",
    label: "Final Review",
    admin: "System (AI)",
  },
];

const chartBars = [
  { day: "MON", total: "60%", inner: "60%", tooltip: "120 App." },
  { day: "TUE", total: "50%", inner: "50%" },
  { day: "WED", total: "70%", inner: "70%" },
  { day: "THU", total: "45%", inner: "45%" },
  { day: "FRI", total: "85%", inner: "85%" },
  { day: "SAT", total: "40%", inner: "40%" },
  { day: "SUN", total: "25%", inner: "25%" },
];

export default function OversightDashboardPage() {
  return (
    <div className="bg-background text-on-surface font-body min-h-screen selection:bg-primary-container selection:text-white">
      <OpsSidebar active="dashboard" />

      <main className="md:ml-64 min-h-screen">
        {/* TopNavBar */}
        <header className="sticky top-0 z-40 bg-surface border-b border-border-subtle">
          <div className="flex justify-between items-center px-4 md:px-gutter h-16 w-full max-w-container-max mx-auto">
            <div className="flex items-center gap-8">
              <h1 className="font-display text-lg font-extrabold text-on-surface">
                Dashboard Ops
              </h1>
              <nav className="hidden md:flex gap-6 text-sm font-semibold">
                <a
                  className="text-primary border-b-2 border-primary pb-1"
                  href="#"
                >
                  Ringkasan
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
                  Audit Logs
                </a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input
                  type="text"
                  placeholder="Cari aplikasi..."
                  className="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-primary focus:bg-surface transition-all placeholder:text-on-surface-variant"
                />
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  className="p-2 hover:bg-surface-container-low rounded-full transition-colors relative"
                  aria-label="Notifikasi"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full ring-2 ring-surface"></span>
                </button>
                <button
                  type="button"
                  className="p-2 hover:bg-surface-container-low rounded-full transition-colors"
                  aria-label="Bantuan"
                >
                  <HelpCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Canvas */}
        <div className="pt-8 pb-12 px-4 md:px-gutter max-w-container-max mx-auto">
          {/* Header Section */}
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-on-surface mb-1">
                Pengawasan Institusional
              </h2>
              <p className="text-on-surface-variant text-sm md:text-base max-w-2xl leading-relaxed">
                Pantau alur verifikasi warga secara real-time di seluruh yurisdiksi RT/RW dengan empati dan presisi institusional.
              </p>
            </div>
            <div className="flex gap-3">
              {/* TODO: sambungkan ke data asli — rentang waktu */}
              <div className="flex items-center gap-2 px-4 py-2 bg-surface border border-border-subtle rounded-lg text-sm font-semibold text-on-surface-variant">
                <Calendar className="w-4 h-4" />
                30 Hari Terakhir
              </div>
              <button
                type="button"
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm"
              >
                <Download className="w-4 h-4" />
                Ekspor Laporan
              </button>
            </div>
          </div>

          {/* Analytics Bento Grid — data statis, TODO sambungkan ke API */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-surface p-6 rounded-xl border border-border-subtle shadow-level2 group hover:border-primary transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-secondary-container/20 rounded-xl">
                  <Handshake className="w-5 h-5 text-secondary" />
                </div>
                <span className="px-2 py-1 bg-success/10 text-success rounded text-[11px] font-bold">
                  +12% minggu lalu
                </span>
              </div>
              <h3 className="text-xs font-bold tracking-[0.05em] text-on-surface-variant mb-1 uppercase">
                Aplikasi dalam Konsensus
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-4xl font-bold text-on-surface leading-none">
                  1,284
                </span>
                <span className="text-on-surface-variant text-sm font-semibold">
                  Menunggu
                </span>
              </div>
              <div className="mt-4 w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
                <div className="bg-secondary h-full w-[72%] rounded-full"></div>
              </div>
            </div>

            <div className="bg-surface border border-border-subtle rounded-2xl p-6 shadow-level2 group hover:border-warning transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-warning/10 rounded-xl">
                  <MessageSquarePlus className="w-5 h-5 text-warning" />
                </div>
                <span className="px-2 py-1 bg-danger/10 text-danger rounded text-[11px] font-bold">
                  Tindakan Prioritas
                </span>
              </div>
              <h3 className="text-xs font-bold tracking-[0.05em] text-on-surface-variant mb-1 uppercase">
                Siap untuk Ulasan Final
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-4xl font-bold text-on-surface leading-none">
                  42
                </span>
                <span className="text-on-surface-variant text-sm font-semibold">
                  Antrian
                </span>
              </div>
              <div className="mt-4 flex -space-x-2">
                {/* TODO: sambungkan ke data asli — avatar admin */}
                <img
                  className="w-8 h-8 rounded-full border-2 border-surface object-cover"
                  alt="Foto admin perempuan"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA48hS57W_JkKjXMJQUtaXr0nQyC3_roSzK0lW1oxlC5wv1_GO-vrHMNqlAYeV6xND_6-GviX_tO9IzqGKUn-nRy1Xe5biYf_Y8h6O8kParfVj9SRR1mDzdCw0rAodLFbW1oxlC5wv1"
                />
                <img
                  className="w-8 h-8 rounded-full border-2 border-surface object-cover"
                  alt="Avatar pimpinan komunitas"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDPAihZOkvYPeYoA1enAbMjoxouD5-Hodf0bTV3ACsxZho_ol7TzFH2lbNCKmcmGO0VN7x0W0GLM-t2d1iGOODT2XkfBCNjRlykmtnE2"
                />
                <div className="w-8 h-8 rounded-full bg-surface-container-high border-2 border-surface flex items-center justify-center text-[10px] font-bold text-on-surface-variant">
                  +3
                </div>
              </div>
            </div>

            <div className="bg-surface border border-border-subtle rounded-2xl p-6 shadow-level2 group hover:border-success transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-success/10 rounded-xl">
                  <BadgeCheck className="w-5 h-5 text-success" />
                </div>
                <span className="px-2 py-1 bg-surface-container-high text-on-surface-variant rounded text-[11px] font-bold">
                  Stabil
                </span>
              </div>
              <h3 className="text-xs font-bold tracking-[0.05em] text-on-surface-variant mb-1 uppercase">
                Persetujuan Terbaru
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-4xl font-bold text-on-surface leading-none">
                  8,902
                </span>
                <span className="text-on-surface-variant text-sm font-semibold">
                  Seumur Hidup
                </span>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-success" />
                <span className="text-sm text-on-surface-variant font-semibold">
                  98.2% Tingkat Persetujuan
                </span>
              </div>
            </div>
          </div>

          {/* Visualization & List Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Verification Timeline Chart */}
            <div className="lg:col-span-2 bg-surface border border-border-subtle rounded-2xl p-8 shadow-level2">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <div>
                  <h3 className="font-display text-xl font-bold text-on-surface">
                    Garis Waktu Verifikasi
                  </h3>
                  <p className="text-sm text-on-surface-variant">
                    Volume aplikasi harian vs waktu penyelesaian
                  </p>
                </div>
                {/* TODO: sambungkan ke data asli — toggle rentang */}
                <div className="flex gap-2 mt-3 sm:mt-0">
                  <button
                    type="button"
                    className="p-1.5 px-3 bg-surface-container-low text-on-surface rounded text-[11px] font-bold"
                  >
                    Day
                  </button>
                  <button
                    type="button"
                    className="p-1.5 px-3 bg-primary text-white rounded text-[11px] font-bold"
                  >
                    Week
                  </button>
                  <button
                    type="button"
                    className="p-1.5 px-3 bg-surface-container-low text-on-surface rounded text-[11px] font-bold"
                  >
                    Month
                  </button>
                </div>
              </div>
              <div className="relative h-[300px] w-full flex items-end justify-between gap-4">
                {/* Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                  <div className="border-t border-dashed border-outline w-full"></div>
                  <div className="border-t border-dashed border-outline w-full"></div>
                  <div className="border-t border-dashed border-outline w-full"></div>
                  <div className="border-t border-solid border-outline w-full"></div>
                </div>
                {chartBars.map((bar) => (
                  <div
                    key={bar.day}
                    className={`flex-1 relative group cursor-pointer transition-all ${bar.total}`}
                  >
                    <div className="absolute bottom-[-10px] left-0 right-0 bg-primary/10 rounded-t-lg h-full flex items-end overflow-hidden">
                      <div
                        className="w-full bg-primary rounded-t-lg transition-all"
                        style={{ height: bar.inner }}
                      ></div>
                    </div>
                    {bar.tooltip && (
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-inverse-surface text-surface px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {bar.tooltip}
                      </div>
                    )}
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-bold text-on-surface-variant">
                      {bar.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Critical Reviews List */}
            <div className="bg-surface border border-border-subtle rounded-2xl p-8 shadow-level2">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-xl font-bold text-on-surface">
                  Critical Reviews
                </h3>
                <span className="w-6 h-6 bg-danger text-white text-[10px] font-black flex items-center justify-center rounded-full">
                  4
                </span>
              </div>
              <div className="space-y-4">
                {criticalReviews.map((item) => (
                  <div
                    key={item.name}
                    className={`p-4 rounded-xl hover:bg-surface-container-low transition-all cursor-pointer border-l-4 ${item.border}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      {/* TODO: sambungkan ke data asli — nama applicant */}
                      <h4 className="text-sm font-semibold group-hover:text-primary transition-colors">
                        {item.name}
                      </h4>
                      <span className="text-[10px] font-bold text-on-surface-variant">
                        {item.time}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant mb-3 leading-relaxed">
                      {item.note}
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="flex-1 py-2 bg-primary text-white text-[11px] font-bold rounded"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        className={`flex-1 py-2 border border-outline text-on-surface-variant text-[11px] font-bold rounded transition-all ${
                          item.rejectHover
                            ? "hover:bg-warning/10 hover:border-warning hover:text-warning"
                            : "hover:bg-danger/10 hover:border-danger hover:text-danger"
                        }`}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="w-full mt-6 py-3 border border-dashed border-outline text-on-surface-variant text-sm font-semibold rounded-lg hover:border-primary hover:text-primary transition-all"
              >
                View All Critical Items
              </button>
            </div>
          </div>

          {/* Recent Activity Table */}
          <div className="mt-8 bg-surface border border-border-subtle rounded-2xl shadow-level2 overflow-hidden">
            <div className="p-6 border-b border-border-subtle flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <h3 className="font-display text-xl font-bold text-on-surface">
                Recent Operations Log
              </h3>
              {/* TODO: sambungkan ke data asli — filter jurisdiksi & status */}
              <div className="flex gap-4">
                <select className="bg-surface-container-low border-none rounded-lg text-sm font-semibold text-on-surface-variant focus:ring-primary">
                  <option>All Jurisdictions</option>
                  <option>RT 01</option>
                  <option>RT 02</option>
                </select>
                <select className="bg-surface-container-low border-none rounded-lg text-sm font-semibold text-on-surface-variant focus:ring-primary">
                  <option>All Status</option>
                  <option>Approved</option>
                  <option>Pending</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-lowest">
                  <tr>
                    {["Citizen Name", "ID (NIK)", "Process Type", "Status", "Admin In Charge", "Actions"].map(
                      (h) => (
                        <th
                          key={h}
                          className={`px-6 py-4 text-xs font-bold tracking-[0.05em] text-on-surface-variant uppercase ${
                            h === "Actions" ? "text-right" : ""
                          }`}
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {operationsLog.map((row) => (
                    <tr
                      key={row.nik}
                      className="hover:bg-surface-container-low transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
                            {row.initials}
                          </div>
                          {/* TODO: sambungkan ke data asli — nama citizen */}
                          <span className="text-sm font-semibold">
                            {row.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant font-mono">
                        {row.nik}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-surface-container text-on-surface-variant rounded text-[11px] font-bold">
                          {row.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${row.dot}`}></span>
                          <span className={`text-sm font-semibold ${row.status}`}>
                            {row.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant">
                        {row.admin}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          className="p-2 hover:bg-surface-container-high rounded-full"
                          aria-label="Menu aksi"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-surface-container-low flex justify-center">
              <button
                type="button"
                className="text-primary text-sm font-semibold flex items-center gap-2 hover:underline"
              >
                Load more activity records
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
