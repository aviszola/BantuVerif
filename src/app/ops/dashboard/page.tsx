"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, type AppRole } from "@/lib/supabase";
import Link from "next/link";
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

type QueueItem = {
  id: string;
  tracking_code: string | null;
  category: string;
  rt_rw: string | null;
  status: string;
  verifier_count: number;
  consensus_score: number | null;
  created_at: string;
};

type RecentVerification = {
  id: string;
  decision: string;
  created_at: string;
  application_id: string;
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} menit lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  return `${Math.floor(hours / 24)} hari lalu`;
}

export default function VerifierDashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Stats
  const [totalPending, setTotalPending] = useState(0);
  const [totalApproved, setTotalApproved] = useState(0);
  const [totalRtReview, setTotalRtReview] = useState(0);
  const [myVerifCount, setMyVerifCount] = useState(0);

  // Queue & history
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [recentVerifs, setRecentVerifs] = useState<RecentVerification[]>([]);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/login"); return; }

      const { data: prof } = await supabase
        .from("profiles")
        .select("id, role, full_name")
        .eq("id", session.user.id)
        .maybeSingle();

      if (!prof || !["verifikator", "admin"].includes(prof.role)) {
        router.replace(prof?.role === "rtrw" ? "/dashboard-rt" : "/dashboard");
        return;
      }
      setProfile(prof);

      // Fetch statistik antrian
      const { data: apps } = await supabase
        .from("applications")
        .select("id, status, tracking_code, category, rt_rw, verifier_count, consensus_score, created_at")
        .in("status", ["submitted", "verification", "rt_review", "approved"])
        .order("created_at", { ascending: false })
        .limit(100);

      if (apps) {
        setTotalPending(apps.filter(a => ["submitted", "verification"].includes(a.status)).length);
        setTotalRtReview(apps.filter(a => a.status === "rt_review").length);
        setTotalApproved(apps.filter(a => a.status === "approved").length);
        setQueue(apps.filter(a => ["submitted", "verification"].includes(a.status)).slice(0, 8) as QueueItem[]);
      }

      // Riwayat verifikasi milik saya
      const { data: myVerifs } = await supabase
        .from("verifications")
        .select("id, decision, created_at, application_id")
        .eq("verifier_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(5);
      if (myVerifs) {
        setMyVerifCount(myVerifs.length);
        setRecentVerifs(myVerifs as RecentVerification[]);
      }

      setIsLoading(false);
    };
    init();

    // Entrance animation
    setTimeout(() => {
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
    }, 100);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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
                <Link
                  className="text-on-surface-variant hover:text-on-surface transition-colors"
                  href="/ops/verifications"
                >
                  Verifikasi
                </Link>
                <Link
                  className="text-on-surface-variant hover:text-on-surface transition-colors"
                  href="/ops/distribution"
                >
                  Distribusi
                </Link>
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
                    {profile?.full_name || "Verifikator"}
                  </p>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mt-0.5">
                    {profile?.role === "admin" ? "Admin Sistem" : "Verifikator Komunitas"}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center">
                  <span className="text-sm font-bold text-on-surface-variant">
                    {profile?.full_name?.slice(0, 2).toUpperCase() || "V"}
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
              <p className="text-sm md:text-base text-on-surface-variant">
                Selamat kembali, {profile?.full_name?.split(" ")[0] || "Verifikator"}. Terdapat{" "}
                <span className="font-semibold text-on-surface">{totalPending} pengajuan</span>{" "}
                menunggu verifikasi Anda.
              </p>
            </div>
          </section>

          {/* Metrics Bento Grid — data real */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  {totalPending}
                </span>
                <p className="text-on-surface-variant text-sm mt-1">
                  Menunggu suara verifikator
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-warning animate-pulse"></div>
                <span className="text-xs text-on-surface-variant">Perlu ditangani</span>
              </div>
            </div>

            <div
              data-entrance
              className="bg-surface p-6 rounded-xl border border-border-subtle shadow-sm flex flex-col justify-between hover:shadow-level2 transition-shadow"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold tracking-[0.05em] text-on-surface-variant uppercase">
                  Menunggu RT/RW
                </span>
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <div className="mt-4">
                <span className="font-display text-4xl font-bold text-on-surface">
                  {totalRtReview}
                </span>
                <p className="text-on-surface-variant text-sm mt-1">
                  Konsensus selesai, siap keputusan
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="text-xs text-on-surface-variant">Di tangan RT/RW</span>
              </div>
            </div>

            <div
              data-entrance
              className="bg-surface p-6 rounded-xl border border-border-subtle shadow-sm flex flex-col justify-between hover:shadow-level2 transition-shadow"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold tracking-[0.05em] text-on-surface-variant uppercase">
                  Total Disetujui
                </span>
                <BadgeCheck className="w-5 h-5 text-success" />
              </div>
              <div className="mt-4">
                <span className="font-display text-4xl font-bold text-on-surface">
                  {totalApproved}
                </span>
                <p className="text-on-surface-variant text-sm mt-1">
                  Pengajuan disetujui RT/RW
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-success"></div>
                <span className="text-xs text-on-surface-variant">Siap distribusi</span>
              </div>
            </div>

            <div
              data-entrance
              className="bg-surface p-6 rounded-xl border border-border-subtle shadow-sm flex flex-col justify-between hover:shadow-level2 transition-shadow"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold tracking-[0.05em] text-on-surface-variant uppercase">
                  Kontribusi Saya
                </span>
                <BarChart3 className="w-5 h-5 text-secondary" />
              </div>
              <div className="mt-4">
                <span className="font-display text-4xl font-bold text-on-surface">
                  {myVerifCount}
                </span>
                <p className="text-on-surface-variant text-sm mt-1">
                  Total suara verifikasi
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-secondary"></div>
                <span className="text-xs text-on-surface-variant">Riwayat pribadi</span>
              </div>
            </div>
          </section>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Queue Table (2/3 width) */}
            <section className="lg:col-span-2 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-bold text-on-surface">
                  Antrian Verifikasi
                </h3>
                <Link
                  href="/ops/verifications"
                  className="text-primary text-sm font-semibold hover:underline"
                >
                  Lihat Semua →
                </Link>
              </div>

              <div className="bg-surface border border-border-subtle rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-surface-container-low border-b border-border-subtle">
                      <tr>
                        {["Kode Tracking", "Kategori", "Wilayah", "Suara", "Aksi"].map((h) => (
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
                      {queue.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-10 text-center text-on-surface-variant text-sm">
                            Tidak ada pengajuan yang perlu diverifikasi saat ini.
                          </td>
                        </tr>
                      ) : (
                        queue.map((item) => (
                          <tr
                            key={item.id}
                            className="hover:bg-surface-container-lowest transition-colors"
                          >
                            <td className="px-6 py-4">
                              <span className="text-sm font-semibold text-on-surface font-mono">
                                {item.tracking_code || item.id.slice(0, 8).toUpperCase()}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-on-surface-variant">
                              {item.category}
                            </td>
                            <td className="px-6 py-4 text-sm text-on-surface-variant">
                              {item.rt_rw || "-"}
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm font-bold text-on-surface">
                                {item.verifier_count}
                                <span className="text-on-surface-variant font-normal">/3</span>
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <Link
                                href={`/ops/verifications`}
                                className="bg-primary text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-primary-container transition-all active:scale-95 shadow-sm inline-block"
                              >
                                Verifikasi
                              </Link>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-4 bg-surface-container-low border-t border-border-subtle flex items-center justify-between">
                  <span className="text-xs text-on-surface-variant font-medium">
                    Menampilkan {Math.min(queue.length, 8)} dari {totalPending} pengajuan tertunda
                  </span>
                  <Link href="/ops/verifications" className="text-primary text-xs font-semibold hover:underline">
                    Lihat semua →
                  </Link>
                </div>
              </div>
            </section>

            {/* Sidebar (1/3 width) */}
            <section className="flex flex-col gap-6">
              {/* Riwayat verifikasi saya */}
              <div className="bg-surface rounded-xl border border-border-subtle shadow-sm flex flex-col overflow-hidden">
                <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between">
                  <h3 className="font-display text-lg font-bold text-on-surface">
                    Verifikasi Terakhir Saya
                  </h3>
                </div>
                <div className="p-4 space-y-4">
                  {recentVerifs.length === 0 ? (
                    <p className="text-sm text-on-surface-variant text-center py-4">
                      Belum ada riwayat verifikasi.
                    </p>
                  ) : (
                    recentVerifs.map((v) => (
                      <div key={v.id} className="flex items-center gap-4 cursor-pointer">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                          v.decision === "agree" ? "bg-success/10 text-success" :
                          v.decision === "disagree" ? "bg-danger/10 text-danger" :
                          "bg-warning/10 text-warning"
                        }`}>
                          {v.decision === "agree" ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : v.decision === "disagree" ? (
                            <XCircle className="w-5 h-5" />
                          ) : (
                            <Clock className="w-5 h-5" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-on-surface truncate">
                            {v.application_id.slice(0, 8).toUpperCase()}
                          </p>
                          <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-tighter">
                            {timeAgo(v.created_at)}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            v.decision === "agree" ? "bg-success/10 text-success" :
                            v.decision === "disagree" ? "bg-danger/10 text-danger" :
                            "bg-warning/10 text-warning"
                          }`}>
                            {v.decision === "agree" ? "Setuju" : v.decision === "disagree" ? "Tolak" : "Tidak Yakin"}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Pro-Tip Card */}
              <div className="bg-primary-container p-6 rounded-xl border border-primary/20 relative overflow-hidden">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
                <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Panduan Verifikasi
                </h4>
                <p className="text-sm text-white/90 leading-relaxed">
                  Setiap pengajuan membutuhkan <span className="font-bold">minimal 3 suara</span> dari verifikator untuk mencapai konsensus dan dilanjutkan ke keputusan RT/RW.
                </p>
                <Link
                  href="/ops/verifications"
                  className="mt-4 text-xs font-bold text-white underline decoration-2 underline-offset-4 block"
                >
                  Mulai Verifikasi →
                </Link>
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
