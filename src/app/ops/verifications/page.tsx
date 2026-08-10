"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Bell,
  HelpCircle,
  ShieldCheck,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import OpsSidebar from "@/components/OpsSidebar";

type ApplicationItem = {
  id: string;
  tracking_code: string | null;
  category: string;
  rt_rw: string | null;
  kelurahan: string | null;
  status: string;
  verifier_count: number;
  consensus_score: number | null;
  created_at: string;
};

type MyVote = {
  application_id: string;
  decision: string;
};

type StatusFilter = "all" | "submitted" | "verification" | "rt_review";

const STATUS_LABEL: Record<string, { text: string; cls: string; icon: typeof ShieldCheck }> = {
  submitted: {
    text: "Menunggu Verifikasi",
    cls: "bg-slate-100 text-slate-700 border-slate-200",
    icon: Clock,
  },
  verification: {
    text: "Konsensus Berjalan",
    cls: "bg-blue-50 text-blue-700 border-blue-200",
    icon: ShieldCheck,
  },
  rt_review: {
    text: "Menunggu RT/RW",
    cls: "bg-amber-50 text-amber-700 border-amber-200",
    icon: AlertTriangle,
  },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} menit lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  return `${Math.floor(hours / 24)} hari lalu`;
}

export default function VerificationsListPage() {
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [myVotes, setMyVotes] = useState<Record<string, string>>({});
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async (userId: string) => {
    const { data: apps } = await supabase
      .from("applications")
      .select("id, tracking_code, category, rt_rw, kelurahan, status, verifier_count, consensus_score, created_at")
      .in("status", ["submitted", "verification", "rt_review"])
      .order("created_at", { ascending: false })
      .limit(50);
    if (apps) setApplications(apps as ApplicationItem[]);

    const { data: votes } = await supabase
      .from("verifications")
      .select("application_id, decision")
      .eq("verifier_id", userId);
    if (votes) {
      const map: Record<string, string> = {};
      votes.forEach((v: MyVote) => { map[v.application_id] = v.decision; });
      setMyVotes(map);
    }
  };

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
      setCurrentUserId(session.user.id);
      await fetchData(session.user.id);
      setIsLoading(false);
    };
    init();
  }, [router]);

  const handleVote = async (applicationId: string, decision: "agree" | "unsure" | "disagree") => {
    if (!currentUserId) return;
    setIsSubmitting(applicationId);
    setErrorMsg(null);
    setSuccessMsg(null);

    const { error } = await supabase.from("verifications").insert({
      application_id: applicationId,
      verifier_id: currentUserId,
      decision,
    });

    if (error) {
      if (error.code === "23505") {
        setErrorMsg("Anda sudah memberikan suara untuk pengajuan ini.");
      } else {
        setErrorMsg(`Gagal menyimpan suara: ${error.message}`);
      }
    } else {
      setSuccessMsg(`Suara "${decision === "agree" ? "Setuju" : decision === "disagree" ? "Tidak Setuju" : "Tidak Yakin"}" berhasil disimpan.`);
      // Refresh data
      await fetchData(currentUserId);
    }
    setIsSubmitting(null);
    setTimeout(() => { setSuccessMsg(null); setErrorMsg(null); }, 4000);
  };

  const filtered = applications.filter((a) => {
    const matchStatus = activeFilter === "all" || a.status === activeFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q ||
      (a.tracking_code || "").toLowerCase().includes(q) ||
      (a.category || "").toLowerCase().includes(q) ||
      (a.rt_rw || "").toLowerCase().includes(q) ||
      (a.kelurahan || "").toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const filters: { key: StatusFilter; label: string }[] = [
    { key: "all", label: `Semua (${applications.length})` },
    { key: "submitted", label: `Menunggu (${applications.filter(a => a.status === "submitted").length})` },
    { key: "verification", label: `Berjalan (${applications.filter(a => a.status === "verification").length})` },
    { key: "rt_review", label: `RT/RW (${applications.filter(a => a.status === "rt_review").length})` },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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
            </div>
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input
                  type="text"
                  placeholder="Cari kode, kategori, wilayah..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-primary focus:bg-surface transition-all placeholder:text-on-surface-variant"
                />
              </div>
              <button
                type="button"
                className="p-2 hover:bg-surface-container-low rounded-full transition-colors relative"
                aria-label="Notifikasi"
              >
                <Bell className="w-5 h-5" />
              </button>
              <button
                type="button"
                className="p-2 hover:bg-surface-container-low rounded-full transition-colors"
                aria-label="Bantuan"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
              <div className="hidden md:flex items-center gap-3 pl-4 border-l border-border-subtle">
                <p className="text-sm font-semibold text-on-surface">{profile?.full_name || "Verifikator"}</p>
                <div className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center font-bold text-sm text-on-surface-variant">
                  {profile?.full_name?.slice(0, 2).toUpperCase() || "V"}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Flash messages */}
        {(successMsg || errorMsg) && (
          <div className={`mx-4 md:mx-gutter mt-4 px-4 py-3 rounded-lg text-sm font-semibold ${successMsg ? "bg-success/10 text-success border border-success/30" : "bg-danger/10 text-danger border border-danger/30"}`}>
            {successMsg || errorMsg}
          </div>
        )}

        <div className="p-4 md:p-gutter max-w-container-max mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-on-surface">Antrian Verifikasi</h2>
              <p className="text-on-surface-variant text-sm mt-1">
                Berikan suara Anda untuk setiap pengajuan bantuan sosial yang masuk.
              </p>
            </div>
            <button
              type="button"
              onClick={() => currentUserId && fetchData(currentUserId)}
              className="flex items-center gap-2 px-4 py-2 border border-border-subtle bg-surface rounded-lg text-sm font-semibold hover:bg-surface-container-low transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Perbarui
            </button>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 flex-wrap">
            {filters.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setActiveFilter(f.key)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                  activeFilter === f.key
                    ? "bg-primary text-white border-primary"
                    : "bg-surface text-on-surface-variant border-border-subtle hover:bg-surface-container-low"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Mobile search */}
          <div className="relative md:hidden">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input
              type="text"
              placeholder="Cari..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full bg-surface border border-border-subtle rounded-xl text-sm focus:ring-2 focus:ring-primary transition-all placeholder:text-on-surface-variant"
            />
          </div>

          {/* Application Cards */}
          <div className="space-y-4">
            {filtered.length === 0 ? (
              <div className="bg-surface border border-border-subtle rounded-2xl p-12 text-center">
                <ShieldCheck className="w-10 h-10 text-on-surface-variant mx-auto mb-3 opacity-40" />
                <p className="text-on-surface-variant font-semibold">Tidak ada pengajuan ditemukan.</p>
              </div>
            ) : (
              filtered.map((app) => {
                const statusInfo = STATUS_LABEL[app.status] || STATUS_LABEL.submitted;
                const StatusIcon = statusInfo.icon;
                const myVote = myVotes[app.id];
                const alreadyVoted = !!myVote;

                return (
                  <div
                    key={app.id}
                    className="bg-surface border border-border-subtle rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-level2 transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap mb-2">
                          <span className="font-mono text-sm font-bold text-on-surface">
                            {app.tracking_code || app.id.slice(0, 8).toUpperCase()}
                          </span>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusInfo.cls}`}>
                            <StatusIcon className="w-3 h-3" />
                            {statusInfo.text}
                          </span>
                        </div>
                        <p className="text-sm text-on-surface font-semibold">{app.category}</p>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          {[app.rt_rw, app.kelurahan].filter(Boolean).join(" · ")}
                        </p>
                        <p className="text-xs text-on-surface-variant mt-1">{timeAgo(app.created_at)}</p>
                      </div>

                      <div className="flex flex-col items-end gap-3 shrink-0">
                        {/* Progress suara */}
                        <div className="text-right">
                          <p className="text-xs text-on-surface-variant font-semibold">
                            Suara: <span className="text-on-surface font-bold">{app.verifier_count}/3</span>
                          </p>
                          <div className="w-24 h-1.5 bg-surface-container-high rounded-full mt-1">
                            <div
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${Math.min((app.verifier_count / 3) * 100, 100)}%` }}
                            />
                          </div>
                        </div>

                        {/* Tombol vote */}
                        {alreadyVoted ? (
                          <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${
                            myVote === "agree" ? "bg-success/10 text-success" :
                            myVote === "disagree" ? "bg-danger/10 text-danger" :
                            "bg-warning/10 text-warning"
                          }`}>
                            ✓ Sudah bersuara: {myVote === "agree" ? "Setuju" : myVote === "disagree" ? "Tidak Setuju" : "Tidak Yakin"}
                          </span>
                        ) : app.status === "rt_review" ? (
                          <span className="text-xs px-3 py-1.5 rounded-full font-semibold bg-amber-50 text-amber-700">
                            Konsensus selesai
                          </span>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              type="button"
                              disabled={isSubmitting === app.id}
                              onClick={() => handleVote(app.id, "agree")}
                              className="flex items-center gap-1 px-3 py-1.5 bg-success/10 text-success border border-success/30 rounded-lg text-xs font-semibold hover:bg-success/20 transition-colors disabled:opacity-50"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Setuju
                            </button>
                            <button
                              type="button"
                              disabled={isSubmitting === app.id}
                              onClick={() => handleVote(app.id, "unsure")}
                              className="flex items-center gap-1 px-3 py-1.5 bg-warning/10 text-warning border border-warning/30 rounded-lg text-xs font-semibold hover:bg-warning/20 transition-colors disabled:opacity-50"
                            >
                              <Clock className="w-3.5 h-3.5" />
                              Ragu
                            </button>
                            <button
                              type="button"
                              disabled={isSubmitting === app.id}
                              onClick={() => handleVote(app.id, "disagree")}
                              className="flex items-center gap-1 px-3 py-1.5 bg-danger/10 text-danger border border-danger/30 rounded-lg text-xs font-semibold hover:bg-danger/20 transition-colors disabled:opacity-50"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              Tolak
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Consensus score bar (jika ada) */}
                    {app.consensus_score !== null && (
                      <div className="mt-4 pt-4 border-t border-border-subtle">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-on-surface-variant font-semibold">Skor Konsensus</span>
                          <span className={`text-xs font-bold ${app.consensus_score >= 60 ? "text-success" : "text-danger"}`}>
                            {app.consensus_score}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-surface-container-high rounded-full">
                          <div
                            className={`h-full rounded-full transition-all ${app.consensus_score >= 60 ? "bg-success" : "bg-danger"}`}
                            style={{ width: `${app.consensus_score}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
