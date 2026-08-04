"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase, getDefaultRouteForRole, type AppRole } from "@/lib/supabase";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  FileText,
  Download,
  Bell,
  Search,
  ChevronRight,
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
} from "lucide-react";

type QueueItem = {
  id: string;
  category: string;
  full_name: string;
  rt_rw: string;
  consensus_score: number | null;
  verifier_count: number;
  status: string;
  tracking_code: string | null;
  created_at: string;
};

const STATUS_LABEL: Record<string, { text: string; cls: string }> = {
  submitted: { text: "Menunggu Verifikasi", cls: "bg-slate-100 text-slate-700 border-slate-200" },
  verification: { text: "Konsensus Berjalan", cls: "bg-blue-50 text-blue-700 border-blue-200" },
  rt_review: { text: "Menunggu Keputusan RT/RW", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  approved: { text: "Disetujui", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  rejected: { text: "Ditolak", cls: "bg-rose-50 text-rose-700 border-rose-200" },
  distributed: { text: "Tersalurkan", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
};

export default function DashboardRtPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [approveTarget, setApproveTarget] = useState<QueueItem | null>(null);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, role, full_name, rt_rw, verification_status")
        .eq("id", session.user.id)
        .maybeSingle();

      // Proteksi role: bukan RT/RW/admin → lempar ke dashboard rolenya
      if (!profile || !["rtrw", "admin"].includes(profile.role)) {
        router.replace(getDefaultRouteForRole(profile?.role as AppRole));
        return;
      }
      setProfile(profile);
      setIsLoading(false);
    };
    checkUser();
  }, [router]);

  useEffect(() => {
    if (!profile) return;
    const fetchQueue = async () => {
      const { data } = await supabase
        .from("applications")
        .select("*")
        .in("status", ["submitted", "verification", "rt_review"])
        .order("created_at", { ascending: false })
        .limit(10);
      if (data) setQueue(data as QueueItem[]);
    };
    fetchQueue();
  }, [profile]);

  const handleDecision = async (decision: "approve" | "reject", target: QueueItem) => {
    setActionError("");
    const { error } = await supabase
      .from("applications")
      .update({
        status: decision === "approve" ? "approved" : "rejected",
        rt_decision: decision,
        rt_notes: "Keputusan pengurus RT/RW",
      })
      .eq("id", target.id);
    if (error) {
      setActionError("Gagal menyimpan keputusan. Periksa izin RLS (role rtrw).");
      return;
    }
    setApproveTarget(null);
    setQueue((q) => q.filter((item) => item.id !== target.id));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // RT/RW yang belum disetujui admin → tetap tampilkan kartu verifikasi
  if (profile?.verification_status !== "approved") {
    return (
      <div className="min-h-screen bg-background text-on-surface font-body flex flex-col justify-between">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-6 md:py-8 w-full flex-1">
          <div className="max-w-2xl mx-auto bg-surface border border-border-subtle rounded-2xl shadow-level1 overflow-hidden">
            <div className="p-8 md:p-10 text-center">
              <div className="w-16 h-16 rounded-full bg-role-rt-container text-role-rt border border-[#fde68a] flex items-center justify-center mx-auto mb-5 shadow-2xs">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-role-rt-container text-role-rt border border-[#fde68a] text-[11px] font-bold uppercase tracking-wider mb-4">
                <Clock className="w-3.5 h-3.5" /> Menunggu Verifikasi Admin
              </div>
              <h1 className="text-2xl md:text-[28px] font-extrabold font-display text-on-surface tracking-tight mb-3">
                Akun RT/RW Anda sedang diverifikasi
              </h1>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-8 max-w-md mx-auto">
                Tim admin BantuVerif akan memeriksa dokumen SK penunjukan Anda.
                Akses penuh portal RT/RW diberikan setelah akun disetujui.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary text-on-primary text-sm font-semibold hover:bg-primary-container px-6 shadow-sm hover:shadow-md transition-all"
              >
                Kembali ke Beranda <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="bg-surface-container-low border-t border-border-subtle/70 py-3.5 px-6 text-center">
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-on-surface-variant">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>
                  Dilindungi secara aman oleh{" "}
                  <strong className="text-primary font-bold">BantuVerif Privacy Shield</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const pendingCount = queue.filter((q) => q.status === "rt_review").length;
  const inConsensusCount = queue.filter((q) => q.status === "verification").length;
  const newCount = queue.filter((q) => q.status === "submitted").length;

  return (
    <div className="min-h-screen bg-background text-on-surface font-body flex flex-col selection:bg-primary-container selection:text-white">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-surface border-b border-border-subtle">
        <div className="max-w-container-max mx-auto px-4 md:px-gutter h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-display text-base font-extrabold leading-tight">Portal RT/RW</h1>
              <p className="text-[11px] text-on-surface-variant">{profile?.rt_rw || "Wilayah belum ditetapkan"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low text-xs font-semibold text-on-surface-variant">
              <BadgeCheck className="w-4 h-4 text-success" /> Terverifikasi Admin
            </div>
            <button type="button" className="p-2 hover:bg-surface-container-low rounded-full transition-colors relative" aria-label="Notifikasi">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full"></span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-container-max mx-auto px-4 md:px-gutter py-6 md:py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-on-surface mb-1">
            Selamat datang, {profile?.full_name?.split(" ")[0] || "Pengurus"}
          </h2>
          <p className="text-sm md:text-base text-on-surface-variant">
            Kelola keputusan akhir pengajuan bantuan sosial di wilayah Anda berdasarkan konsensus komunitas.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-surface border border-border-subtle rounded-xl p-4 shadow-level1">
            <p className="text-xs font-bold tracking-widest text-on-surface-variant uppercase mb-1">Menunggu Keputusan</p>
            <p className="font-display text-3xl font-bold text-role-rt">{pendingCount}</p>
          </div>
          <div className="bg-surface border border-border-subtle rounded-xl p-4 shadow-level1">
            <p className="text-xs font-bold tracking-widest text-on-surface-variant uppercase mb-1">Konsensus Berjalan</p>
            <p className="font-display text-3xl font-bold text-primary">{inConsensusCount}</p>
          </div>
          <div className="bg-surface border border-border-subtle rounded-xl p-4 shadow-level1">
            <p className="text-xs font-bold tracking-widest text-on-surface-variant uppercase mb-1">Pengajuan Baru</p>
            <p className="font-display text-3xl font-bold text-on-surface">{newCount}</p>
          </div>
          <div className="bg-surface border border-border-subtle rounded-xl p-4 shadow-level1">
            <p className="text-xs font-bold tracking-widest text-on-surface-variant uppercase mb-1">Antrean Total</p>
            <p className="font-display text-3xl font-bold text-on-surface">{queue.length}</p>
          </div>
        </div>

        {/* Queue */}
        <div className="bg-surface border border-border-subtle rounded-2xl shadow-level1 overflow-hidden">
          <div className="p-5 md:p-6 border-b border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <h3 className="font-display text-lg font-bold">Antrean Pengajuan</h3>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                type="text"
                placeholder="Cari pengajuan..."
                className="pl-9 pr-4 py-2 bg-surface-container-low border-none rounded-full text-sm w-full sm:w-56 focus:ring-2 focus:ring-primary placeholder:text-on-surface-variant"
              />
            </div>
          </div>

          <div className="divide-y divide-border-subtle">
            {queue.length === 0 ? (
              <div className="p-12 text-center">
                <CheckCircle2 className="w-10 h-10 text-success mx-auto mb-3" />
                <p className="font-semibold text-on-surface-variant">Belum ada pengajuan masuk.</p>
                <p className="text-xs text-on-surface-variant mt-1">Pengajuan baru akan muncul di sini setelah melewati verifikasi tetangga.</p>
              </div>
            ) : (
              queue.map((item) => {
                const s = STATUS_LABEL[item.status] || STATUS_LABEL.submitted;
                const needsDecision = item.status === "rt_review";
                return (
                  <div key={item.id} className="p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4 hover:bg-surface-container-lowest transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-bold text-sm text-on-surface">
                          {item.full_name || "Pemohon"}
                        </span>
                        <span className="text-xs text-on-surface-variant font-mono">
                          {item.tracking_code || item.id.slice(0, 8)}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${s.cls}`}>
                          {s.text}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-on-surface-variant">
                        <span className="flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5" /> {item.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" /> Konsensus {item.verifier_count}/3
                        </span>
                        {item.consensus_score !== null && (
                          <span className="font-semibold text-primary">
                            Skor {item.consensus_score}%
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {needsDecision ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setApproveTarget(item)}
                            className="px-4 py-2 bg-success text-white text-xs font-bold rounded-lg hover:bg-success/90 transition-all flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Setujui
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDecision("reject", item)}
                            className="px-4 py-2 border border-danger/30 text-danger text-xs font-bold rounded-lg hover:bg-danger/10 transition-all flex items-center gap-1.5"
                          >
                            <XCircle className="w-4 h-4" /> Tolak
                          </button>
                        </>
                      ) : (
                        <Link
                          href={`/tracking/${item.id}`}
                          className="px-4 py-2 bg-surface-container-low text-on-surface-variant text-xs font-bold rounded-lg hover:bg-surface-container-high transition-colors flex items-center gap-1.5"
                        >
                          Detail <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Info banner */}
        <div className="mt-8 p-4 bg-primary-fixed text-on-primary-fixed rounded-xl flex items-center gap-4 shadow-sm border border-primary/10">
          <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center text-primary shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold">Keputusan Tercatat di Buku Publik</h4>
            <p className="text-sm opacity-90 leading-relaxed">
              Setiap persetujuan/penolakan dicatat dengan identitas pengurus dan dapat diaudit
              melalui dashboard transparansi publik.
            </p>
          </div>
        </div>
      </main>

      {/* Approval Modal */}
      {approveTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/60 backdrop-blur-sm">
          <div className="bg-surface rounded-2xl border border-border-subtle shadow-elevated w-full max-w-[420px] p-7 relative">
            <h3 className="font-bold text-lg text-on-surface mb-2">Setujui Pengajuan</h3>
            <p className="text-sm text-on-surface-variant mb-4">
              Konfirmasi persetujuan untuk <strong>{approveTarget.full_name}</strong>{" "}
              ({approveTarget.category}). Tindakan ini akan dicatat.
            </p>
            {actionError && (
              <p className="mb-4 p-3 rounded-lg bg-danger/10 text-danger text-xs font-semibold">{actionError}</p>
            )}
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setApproveTarget(null)}
                className="px-5 h-11 rounded-lg border border-border-subtle text-xs font-semibold hover:bg-surface-container-low transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleDecision("approve", approveTarget)}
                className="px-6 h-11 rounded-lg bg-success text-white text-xs font-bold hover:bg-success/90 transition-colors"
              >
                Ya, Setujui
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
