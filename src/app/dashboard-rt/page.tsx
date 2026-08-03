"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ShieldCheck, Clock, ArrowRight } from "lucide-react";

export default function DashboardRtPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      }
      setIsLoading(false);
    };

    checkUser();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f9fb]">
        <div className="w-8 h-8 border-4 border-[#2563eb] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-body flex flex-col justify-between selection:bg-[#2563eb] selection:text-white">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-6 md:py-8 w-full flex-1">
        <div className="max-w-2xl mx-auto bg-white border border-[#e2e8f0] rounded-2xl shadow-level1 overflow-hidden">
          <div className="p-8 md:p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-[#fef3c7] text-[#d97706] border border-[#fde68a] flex items-center justify-center mx-auto mb-5 shadow-2xs">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fef3c7] text-[#b45309] border border-[#fde68a] text-[11px] font-bold uppercase tracking-wider mb-4">
              <Clock className="w-3.5 h-3.5" /> Menunggu Verifikasi Admin
            </div>

            <h1 className="text-2xl md:text-[28px] font-extrabold font-display text-on-surface tracking-tight mb-3">
              Akun RT/RW Anda sedang diverifikasi
            </h1>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-8 max-w-md mx-auto">
              Terima kasih telah mendaftar sebagai pengurus wilayah. Tim admin
              BantuVerif akan memeriksa dokumen SK penunjukan Anda. Anda akan
              mendapatkan akses penuh portal RT/RW setelah akun disetujui.
            </p>

            <Link
              href="/dashboard"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#2563eb] text-white text-sm font-semibold hover:bg-[#1d4ed8] px-6 shadow-sm hover:shadow-md transition-all"
            >
              Kembali ke Beranda <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-[#f2f4f6] border-t border-[#e2e8f0]/70 py-3.5 px-6 text-center">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-on-surface-variant">
              <ShieldCheck className="w-4 h-4 text-[#2563eb]" />
              <span>
                Dilindungi secara aman oleh{" "}
                <strong className="text-[#2563eb] font-bold">
                  BantuVerif Privacy Shield
                </strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
