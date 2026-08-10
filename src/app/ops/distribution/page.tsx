"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  Clock,
  Printer,
  Truck,
  RefreshCw,
  AlertTriangle,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import OpsSidebar from "@/components/OpsSidebar";

type ApprovedApp = {
  id: string;
  tracking_code: string | null;
  full_name: string | null;
  category: string;
  rt_rw: string | null;
  kelurahan: string | null;
  kecamatan: string | null;
  status: string;
  created_at: string;
};

type DisbursedApp = {
  id: string;
  amount: number;
  disbursed_at: string;
  receipt_code: string | null;
  application_id: string;
  applications: {
    tracking_code: string | null;
    category: string;
    rt_rw: string | null;
  } | null;
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} menit lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  return `${Math.floor(hours / 24)} hari lalu`;
}

export default function DistributionLogisticsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDistributing, setIsDistributing] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [approvedApps, setApprovedApps] = useState<ApprovedApp[]>([]);
  const [disbursedList, setDisbursedList] = useState<DisbursedApp[]>([]);

  const fetchData = async () => {
    const [appsRes, disbRes] = await Promise.all([
      supabase
        .from("applications")
        .select("id, tracking_code, full_name, category, rt_rw, kelurahan, kecamatan, status, created_at")
        .eq("status", "approved")
        .order("created_at", { ascending: false }),
      supabase
        .from("disbursements")
        .select("id, amount, disbursed_at, receipt_code, application_id, applications(tracking_code, category, rt_rw)")
        .order("disbursed_at", { ascending: false })
        .limit(10),
    ]);
    if (appsRes.data) setApprovedApps(appsRes.data as ApprovedApp[]);
    if (disbRes.data) setDisbursedList(disbRes.data as any[]);
  };

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/login"); return; }

      const { data: prof } = await supabase
        .from("profiles")
        .select("id, role, full_name, rt_rw")
        .eq("id", session.user.id)
        .maybeSingle();

      if (!prof || !["rtrw", "admin"].includes(prof.role)) {
        router.replace("/dashboard");
        return;
      }
      setProfile(prof);
      await fetchData();
      setIsLoading(false);
    };
    init();
  }, [router]);

  const handleDistribute = async (app: ApprovedApp) => {
    setIsDistributing(app.id);
    setErrorMsg(null);
    setSuccessMsg(null);

    // 1. Buat record disbursement
    const receiptCode = `DIST-${Date.now().toString().slice(-6)}`;
    const { error: disbError } = await supabase.from("disbursements").insert({
      application_id: app.id,
      amount: 0, // nominal diinput default 0; bisa dikembangkan dengan form input
      receipt_code: receiptCode,
    });

    if (disbError) {
      setErrorMsg(`Gagal mencatat distribusi: ${disbError.message}`);
      setIsDistributing(null);
      return;
    }

    // 2. Update status applications menjadi 'distributed'
    const { error: updateError } = await supabase
      .from("applications")
      .update({ status: "distributed" })
      .eq("id", app.id);

    if (updateError) {
      setErrorMsg(`Gagal memperbarui status: ${updateError.message}`);
    } else {
      setSuccessMsg(`Distribusi untuk ${app.tracking_code || app.id.slice(0, 8)} berhasil dicatat. Kode: ${receiptCode}`);
      await fetchData();
    }

    setIsDistributing(null);
    setTimeout(() => { setSuccessMsg(null); setErrorMsg(null); }, 5000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-surface font-body min-h-screen selection:bg-primary-container selection:text-white">
      <OpsSidebar active="distribution" />

      <main className="md:ml-64 min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-surface border-b border-border-subtle">
          <div className="flex justify-between items-center px-4 md:px-gutter h-16 w-full max-w-container-max mx-auto">
            <h1 className="font-display text-lg font-extrabold text-on-surface">
              Manajemen Distribusi
            </h1>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={fetchData}
                className="flex items-center gap-2 px-3 py-2 border border-border-subtle bg-surface rounded-lg text-sm font-semibold hover:bg-surface-container-low transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Perbarui
              </button>
              <div className="hidden md:flex items-center gap-3 pl-4 border-l border-border-subtle">
                <p className="text-sm font-semibold text-on-surface">{profile?.full_name || "Petugas"}</p>
                <div className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center font-bold text-sm text-on-surface-variant">
                  {profile?.full_name?.slice(0, 2).toUpperCase() || "P"}
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

        <div className="p-4 md:p-gutter max-w-container-max mx-auto space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-surface border border-border-subtle rounded-xl p-5 shadow-sm">
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">Menunggu Distribusi</p>
              <p className="font-display text-3xl font-bold text-on-surface mt-2">{approvedApps.length}</p>
              <p className="text-xs text-warning mt-1 font-semibold">Perlu ditindaklanjuti</p>
            </div>
            <div className="bg-surface border border-border-subtle rounded-xl p-5 shadow-sm">
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">Sudah Didistribusi</p>
              <p className="font-display text-3xl font-bold text-on-surface mt-2">{disbursedList.length}</p>
              <p className="text-xs text-success mt-1 font-semibold">Tersalurkan</p>
            </div>
            <div className="bg-surface border border-border-subtle rounded-xl p-5 shadow-sm col-span-2 md:col-span-1">
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">Wilayah Anda</p>
              <p className="font-display text-base font-bold text-on-surface mt-2">{profile?.rt_rw || "Semua Wilayah"}</p>
              <p className="text-xs text-on-surface-variant mt-1">{profile?.role === "admin" ? "Admin — akses penuh" : "RT/RW"}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Antrian Distribusi */}
            <section className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-bold text-on-surface">
                  Pengajuan Siap Distribusi
                </h2>
                <span className="text-sm text-on-surface-variant">
                  {approvedApps.length} pengajuan
                </span>
              </div>

              {approvedApps.length === 0 ? (
                <div className="bg-surface border border-border-subtle rounded-2xl p-12 text-center">
                  <CheckCircle2 className="w-10 h-10 text-success mx-auto mb-3 opacity-50" />
                  <p className="font-semibold text-on-surface-variant">Semua pengajuan telah didistribusikan!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {approvedApps.map((app) => (
                    <div
                      key={app.id}
                      className="bg-surface border border-border-subtle rounded-2xl p-5 shadow-sm hover:shadow-level2 transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-mono text-sm font-bold text-on-surface">
                              {app.tracking_code || app.id.slice(0, 8).toUpperCase()}
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-success/10 text-success border border-success/20">
                              <CheckCircle2 className="w-3 h-3" />
                              Disetujui
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-on-surface">{app.category}</p>
                          <div className="flex items-center gap-1 text-xs text-on-surface-variant mt-0.5">
                            <User className="w-3 h-3" />
                            <span>{app.full_name || "Anonim"}</span>
                          </div>
                          <p className="text-xs text-on-surface-variant mt-0.5">
                            {[app.rt_rw, app.kelurahan, app.kecamatan].filter(Boolean).join(" · ")}
                          </p>
                          <p className="text-xs text-on-surface-variant mt-1">{timeAgo(app.created_at)}</p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button
                            type="button"
                            className="flex items-center gap-2 px-3 py-2 border border-border-subtle rounded-lg text-xs font-semibold hover:bg-surface-container-low transition-colors"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            Cetak
                          </button>
                          <button
                            type="button"
                            disabled={isDistributing === app.id}
                            onClick={() => handleDistribute(app)}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary-container transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                          >
                            {isDistributing === app.id ? (
                              <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Memproses...</>
                            ) : (
                              <><Truck className="w-3.5 h-3.5" /> Konfirmasi Distribusi</>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Riwayat Distribusi */}
            <section className="space-y-4">
              <h2 className="font-display text-xl font-bold text-on-surface">
                Riwayat Distribusi
              </h2>
              <div className="bg-surface border border-border-subtle rounded-xl overflow-hidden shadow-sm">
                {disbursedList.length === 0 ? (
                  <div className="p-8 text-center">
                    <Clock className="w-8 h-8 text-on-surface-variant mx-auto mb-2 opacity-40" />
                    <p className="text-sm text-on-surface-variant">Belum ada riwayat distribusi.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border-subtle">
                    {disbursedList.map((d) => (
                      <div key={d.id} className="px-5 py-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center shrink-0 mt-0.5">
                            <CheckCircle2 className="w-4 h-4 text-success" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-on-surface font-mono">
                              {(d.applications as any)?.tracking_code || d.application_id.slice(0, 8).toUpperCase()}
                            </p>
                            <p className="text-xs text-on-surface-variant">
                              {(d.applications as any)?.category}
                            </p>
                            <p className="text-[10px] text-on-surface-variant mt-0.5">
                              Kode: {d.receipt_code} · {timeAgo(d.disbursed_at)}
                            </p>
                          </div>
                          <span className="text-xs font-bold text-success shrink-0">
                            Tersalurkan
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
