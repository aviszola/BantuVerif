"use client";

import React, { useState } from "react";
import {
  Search,
  Bell,
  HelpCircle,
  Filter,
  SlidersHorizontal,
  ShieldCheck,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  MapPin,
  Users,
  ArrowUpDown,
  RefreshCw,
  Download,
} from "lucide-react";
import Link from "next/link";
import OpsSidebar from "@/components/OpsSidebar";

type StatusFilter = "all" | "pending" | "in_review" | "urgent" | "completed" | "rejected";
type SortKey = "newest" | "oldest" | "urgency" | "region";

const verificationQueue = [
  {
    id: "BV-2024-8891",
    ref: "USR-9921-X",
    name: "Pemohon Anonim",
    sector: "Sektor 4-B, Distrik Utara",
    type: "Domisili Baru",
    status: "urgent",
    votes: 2,
    totalVotes: 3,
    submittedAgo: "2 jam lalu",
    deadline: "4 jam lagi",
    tags: ["Prioritas", "Alamat Tidak Cocok"],
  },
  {
    id: "BV-2024-8890",
    ref: "USR-1044-A",
    name: "Pemohon Anonim",
    sector: "Sektor 2-A, Distrik Timur",
    type: "Edit Kartu Keluarga",
    status: "pending",
    votes: 1,
    totalVotes: 3,
    submittedAgo: "5 jam lalu",
    deadline: "19 jam lagi",
    tags: ["Standar"],
  },
  {
    id: "BV-2024-8887",
    ref: "USR-0567-K",
    name: "Pemohon Anonim",
    sector: "Sektor 7-C, Distrik Selatan",
    type: "Perpindahan Domisili",
    status: "in_review",
    votes: 2,
    totalVotes: 3,
    submittedAgo: "8 jam lalu",
    deadline: "16 jam lagi",
    tags: ["Bendera Duplikasi"],
  },
  {
    id: "BV-2024-8882",
    ref: "USR-3310-M",
    name: "Pemohon Anonim",
    sector: "Sektor 1-D, Distrik Pusat",
    type: "Pembaruan Identitas",
    status: "in_review",
    votes: 1,
    totalVotes: 3,
    submittedAgo: "1 hari lalu",
    deadline: "8 jam lagi",
    tags: ["Standar"],
  },
  {
    id: "BV-2024-8878",
    ref: "USR-6621-B",
    name: "Pemohon Anonim",
    sector: "Sektor 9-F, Distrik Barat",
    type: "Domisili Baru",
    status: "completed",
    votes: 3,
    totalVotes: 3,
    submittedAgo: "2 hari lalu",
    deadline: "Ditutup",
    tags: ["Disetujui"],
  },
  {
    id: "BV-2024-8875",
    ref: "USR-4412-Z",
    name: "Pemohon Anonim",
    sector: "Sektor 3-B, Distrik Utara",
    type: "Edit Kartu Keluarga",
    status: "rejected",
    votes: 3,
    totalVotes: 3,
    submittedAgo: "2 hari lalu",
    deadline: "Ditutup",
    tags: ["Ditolak", "Penipuan Data"],
  },
  {
    id: "BV-2024-8869",
    ref: "USR-7703-P",
    name: "Pemohon Anonim",
    sector: "Sektor 6-A, Distrik Timur",
    type: "Pindah Domisili",
    status: "pending",
    votes: 0,
    totalVotes: 3,
    submittedAgo: "3 jam lalu",
    deadline: "21 jam lagi",
    tags: ["Baru"],
  },
  {
    id: "BV-2024-8861",
    ref: "USR-1188-R",
    name: "Pemohon Anonim",
    sector: "Sektor 5-E, Distrik Selatan",
    type: "Pembaruan Identitas",
    status: "urgent",
    votes: 1,
    totalVotes: 3,
    submittedAgo: "6 jam lalu",
    deadline: "2 jam lagi",
    tags: ["Prioritas", "Dokumen Kedaluwarsa"],
  },
];

const statusConfig: Record<
  string,
  { label: string; bg: string; text: string; icon: typeof ShieldCheck; dot: string }
> = {
  pending: {
    label: "Menunggu",
    bg: "bg-surface-container-high",
    text: "text-on-surface-variant",
    icon: Clock,
    dot: "bg-outline",
  },
  in_review: {
    label: "Ditinjau",
    bg: "bg-primary/10",
    text: "text-primary",
    icon: ShieldCheck,
    dot: "bg-primary",
  },
  urgent: {
    label: "Mendesak",
    bg: "bg-danger/10",
    text: "text-danger",
    icon: AlertTriangle,
    dot: "bg-danger",
  },
  completed: {
    label: "Selesai",
    bg: "bg-success/10",
    text: "text-success",
    icon: CheckCircle2,
    dot: "bg-success",
  },
  rejected: {
    label: "Ditolak",
    bg: "bg-danger/10",
    text: "text-danger",
    icon: XCircle,
    dot: "bg-danger",
  },
};

const tagColorMap: Record<string, string> = {
  Prioritas: "bg-danger/10 text-danger border-danger/20",
  "Alamat Tidak Cocok": "bg-warning/10 text-warning border-warning/20",
  "Bendera Duplikasi": "bg-warning/10 text-warning border-warning/20",
  "Penipuan Data": "bg-danger/10 text-danger border-danger/20",
  "Dokumen Kedaluwarsa": "bg-danger/10 text-danger border-danger/20",
  Standar: "bg-surface-container-high text-on-surface-variant border-border-subtle",
  Baru: "bg-primary/10 text-primary border-primary/20",
  Disetujui: "bg-success/10 text-success border-success/20",
  Ditolak: "bg-danger/10 text-danger border-danger/20",
};

const statusFilters: { key: StatusFilter; label: string; count?: number }[] = [
  { key: "all", label: "Semua", count: verificationQueue.length },
  { key: "urgent", label: "Mendesak", count: 2 },
  { key: "pending", label: "Menunggu", count: 3 },
  { key: "in_review", label: "Ditinjau", count: 2 },
  { key: "completed", label: "Selesai", count: 1 },
  { key: "rejected", label: "Ditolak", count: 1 },
];

export default function VerificationsListPage() {
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("urgency");

  const filtered = verificationQueue.filter((v) => {
    const matchesStatus = activeFilter === "all" || v.status === activeFilter;
    const matchesSearch =
      searchQuery === "" ||
      v.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.sector.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const urgentCount = verificationQueue.filter((v) => v.status === "urgent").length;

  return (
    <div className="bg-background text-on-surface font-body min-h-screen selection:bg-primary-container selection:text-white">
      <OpsSidebar active="verifications" />

      <main className="md:ml-64 min-h-screen">
        {/* Top Nav */}
        <header className="sticky top-0 z-40 bg-surface border-b border-border-subtle">
          <div className="flex justify-between items-center px-4 md:px-gutter h-16 w-full max-w-container-max mx-auto">
            <div className="flex items-center gap-8">
              <h1 className="font-display text-lg font-extrabold text-on-surface">
                Dasbor Operasi
              </h1>
              <nav className="hidden md:flex gap-6 text-sm font-semibold">
                <Link
                  className="text-on-surface-variant hover:text-on-surface transition-colors"
                  href="#"
                >
                  Laporan
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input
                  type="text"
                  placeholder="Cari kasus..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                  <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full ring-2 ring-surface" />
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

        {/* Page Content */}
        <div className="pt-8 pb-12 px-4 md:px-gutter max-w-container-max mx-auto">
          {/* Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-on-surface mb-1">
                Antrean Verifikasi
              </h2>
              <p className="text-on-surface-variant text-sm md:text-base max-w-2xl leading-relaxed">
                Tinjau dan kelola semua kasus verifikasi komunitas yang menunggu
                di wilayah Anda.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 bg-surface border border-border-subtle rounded-lg text-sm font-semibold text-on-surface-variant hover:bg-surface-container-low transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Muat Ulang
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm hover:bg-primary-container transition-colors"
              >
                <Download className="w-4 h-4" />
                Ekspor
              </button>
            </div>
          </div>

          {/* Urgent Alert Banner */}
          {urgentCount > 0 && (
            <div className="mb-6 p-4 bg-danger/5 border border-danger/20 rounded-xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-danger/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-danger" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-danger">
                  {urgentCount} Kasus Mendesak Perlu Tindakan Segera
                </p>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Kasus yang akan berakhir dalam 4 jam membutuhkan suara Anda untuk mencapai ambang konsensus.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveFilter("urgent")}
                className="px-4 py-2 bg-danger text-white text-xs font-bold rounded-lg hover:bg-danger/90 transition-colors shrink-0"
              >
                Lihat Mendesak
              </button>
            </div>
          )}

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Antrean", value: verificationQueue.length, color: "text-on-surface" },
              {
                label: "Mendesak",
                value: verificationQueue.filter((v) => v.status === "urgent").length,
                color: "text-danger",
              },
              {
                label: "Ditinjau",
                value: verificationQueue.filter((v) => v.status === "in_review").length,
                color: "text-primary",
              },
              {
                label: "Selesai Hari Ini",
                value: verificationQueue.filter((v) => v.status === "completed").length,
                color: "text-success",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-surface border border-border-subtle rounded-xl p-4 shadow-level1"
              >
                <p className="text-xs font-bold tracking-widest text-on-surface-variant uppercase mb-1">
                  {stat.label}
                </p>
                <p className={`font-display text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Filter + Sort Bar */}
          <div className="bg-surface border border-border-subtle rounded-xl p-4 mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between shadow-level1">
            {/* Status Tabs */}
            <div className="flex gap-2 flex-wrap">
              {statusFilters.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setActiveFilter(f.key)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeFilter === f.key
                      ? "bg-primary text-white shadow-sm"
                      : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  {f.label}
                  {f.count !== undefined && (
                    <span
                      className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-[10px] font-black ${
                        activeFilter === f.key
                          ? "bg-white/20 text-white"
                          : "bg-surface-container-highest text-on-surface-variant"
                      }`}
                    >
                      {f.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Sort + Filter */}
            <div className="flex gap-2 shrink-0">
              <div className="flex items-center gap-2 px-3 py-2 bg-surface-container-low rounded-lg text-xs font-semibold text-on-surface-variant">
                <ArrowUpDown className="w-3.5 h-3.5" />
                <select
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value as SortKey)}
                  className="bg-transparent outline-none cursor-pointer"
                >
                  <option value="urgency">Berdasarkan Urgensi</option>
                  <option value="newest">Terbaru Dulu</option>
                  <option value="oldest">Terlama Dulu</option>
                  <option value="region">Berdasarkan Wilayah</option>
                </select>
              </div>
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-2 bg-surface-container-low rounded-lg text-xs font-semibold text-on-surface-variant hover:bg-surface-container-high transition-colors"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filter
              </button>
            </div>
          </div>

          {/* Verification Cards */}
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="bg-surface border border-border-subtle rounded-xl p-12 text-center shadow-level1">
                <Filter className="w-10 h-10 text-outline mx-auto mb-3" />
                <p className="font-semibold text-on-surface-variant">Tidak ada kasus yang cocok dengan filter Anda.</p>
                <p className="text-xs text-on-surface-variant mt-1">Coba sesuaikan filter status atau kata kunci pencarian.</p>
              </div>
            ) : (
              filtered.map((item) => {
                const cfg = statusConfig[item.status];
                const Icon = cfg.icon;
                const progressPct = `${Math.round((item.votes / item.totalVotes) * 100)}%`;
                const isActive = item.status !== "completed" && item.status !== "rejected";

                return (
                  <div
                    key={item.id}
                    className={`bg-surface border rounded-xl p-5 shadow-level1 flex flex-col sm:flex-row sm:items-center gap-4 transition-all hover:shadow-level2 hover:border-primary/40 group ${
                      item.status === "urgent"
                        ? "border-danger/30 bg-danger/[0.02]"
                        : "border-border-subtle"
                    }`}
                  >
                    {/* Status Indicator */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cfg.bg}`}
                    >
                      <Icon className={`w-5 h-5 ${cfg.text}`} />
                    </div>

                    {/* Main Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-display font-bold text-on-surface text-sm">
                          Kasus {item.id}
                        </span>
                        <span className="text-xs text-on-surface-variant font-mono">
                          • {item.ref}
                        </span>
                        {/* Tags */}
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              tagColorMap[tag] || "bg-surface-container-high text-on-surface-variant border-border-subtle"
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-on-surface-variant">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {item.sector}
                        </span>
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          {item.type}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {item.submittedAgo}
                        </span>
                      </div>

                      {/* Consensus Progress */}
                      {isActive && (
                        <div className="mt-3 flex items-center gap-3">
                          <div className="flex-1 bg-surface-container-low rounded-full h-1.5 max-w-[120px]">
                            <div
                              className={`h-full rounded-full transition-all ${
                                item.status === "urgent" ? "bg-danger" : "bg-primary"
                              }`}
                              style={{ width: progressPct }}
                            />
                          </div>
                          <span className="text-[11px] text-on-surface-variant font-semibold flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {item.votes}/{item.totalVotes} suara
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-4 shrink-0">
                      {/* Deadline */}
                      <div className="text-right hidden sm:block">
                        <p
                          className={`text-xs font-bold ${
                            item.status === "urgent"
                              ? "text-danger"
                              : item.deadline === "Ditutup"
                              ? "text-on-surface-variant"
                              : "text-on-surface"
                          }`}
                        >
                          {item.deadline}
                        </p>
                        <p className="text-[10px] text-on-surface-variant">batas waktu</p>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 ${cfg.bg} ${cfg.text}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </span>

                      {/* Action Button */}
                      {isActive ? (
                        <Link
                          href={`/ops/verifications/${item.id}`}
                          className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-container transition-all group-hover:shadow-md"
                        >
                          Tinjau
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      ) : (
                        <Link
                          href={`/ops/verifications/${item.id}`}
                          className="flex items-center gap-2 px-4 py-2 bg-surface-container-low text-on-surface-variant text-xs font-bold rounded-lg hover:bg-surface-container-high transition-colors"
                        >
                          Lihat
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Load More */}
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              className="px-8 py-3 border border-dashed border-outline text-on-surface-variant text-sm font-semibold rounded-xl hover:border-primary hover:text-primary transition-all"
            >
              Muat Lebih Banyak Kasus
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
