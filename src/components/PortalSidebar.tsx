"use client";

import React from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  User,
  LayoutDashboard,
  FileText,
  ClipboardCheck,
  History,
  Settings,
  Plus,
  Check,
  ListOrdered,
} from "lucide-react";

type ActiveItem = "dashboard" | "applications" | "eligibility" | "history" | "settings" | "apply";

export interface StepItem {
  id: number;
  title: string;
  desc?: string;
}

interface PortalSidebarProps {
  active?: ActiveItem;
  currentStep?: number;
  stepsList?: StepItem[];
  onStepClick?: (stepId: number) => void;
}

/** Sidebar navigasi portal warga — dipakai di /dashboard, /tracking, /apply, dll. */
export default function PortalSidebar({
  active = "applications",
  currentStep,
  stepsList,
  onStepClick,
}: PortalSidebarProps) {
  const items: { key: ActiveItem; label: string; href: string; icon: typeof LayoutDashboard }[] = [
    { key: "dashboard", label: "Ringkasan Utama", href: "/dashboard", icon: LayoutDashboard },
    { key: "applications", label: "Pengajuan Saya", href: "/tracking", icon: FileText },
    { key: "eligibility", label: "Kriteria Kelayakan", href: "/riwayat", icon: ClipboardCheck },
    { key: "history", label: "Riwayat Pencairan", href: "/history", icon: History },
    { key: "settings", label: "Pengaturan Akun", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="hidden lg:block lg:col-span-3 bg-white rounded-2xl border border-border-subtle p-5 shadow-level1 space-y-6">
      <div>
        <div className="text-[11px] font-bold tracking-widest text-outline uppercase mb-4 px-3">
          PORTAL WARGA
        </div>

        <nav className="flex flex-col gap-1.5">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = item.key === active && !stepsList;
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                  isActive
                    ? "bg-primary text-white shadow-md shadow-primary-container/20"
                    : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                }`}
              >
                <Icon className="w-4.5 h-4.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <button
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = "/login";
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all text-rose-600 hover:bg-rose-50 mt-1"
          >
            <User className="w-4.5 h-4.5" />
            <span>Keluar Akun</span>
          </button>
        </nav>
      </div>

      {/* Tahapan Pengajuan (Jika dalam mode form pengajuan) */}
      {stepsList && stepsList.length > 0 && (
        <div className="pt-4 border-t border-border-subtle">
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-primary uppercase mb-3 px-3">
            <ListOrdered className="w-4 h-4" />
            <span>TAHAPAN PENGAJUAN</span>
          </div>

          <div className="flex flex-col gap-1">
            {stepsList.map((step) => {
              const isActive = currentStep === step.id;
              const isPassed = (currentStep || 1) > step.id;

              return (
                <button
                  key={step.id}
                  onClick={() => onStepClick && onStepClick(step.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all flex items-center justify-between text-xs font-semibold ${
                    isActive
                      ? "bg-primary-container/15 text-primary border-l-4 border-primary font-bold shadow-xs"
                      : isPassed
                      ? "text-emerald-700 hover:bg-emerald-50"
                      : "text-on-surface-variant opacity-70 hover:opacity-100 hover:bg-surface-container-low"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                        isActive
                          ? "bg-primary text-white"
                          : isPassed
                          ? "bg-emerald-500 text-white"
                          : "bg-surface-container-high text-on-surface-variant"
                      }`}
                    >
                      {isPassed ? <Check className="w-3 h-3 stroke-[3]" /> : step.id}
                    </span>
                    <span className="truncate">{step.title}</span>
                  </div>

                  {isActive && (
                    <span className="text-[10px] font-extrabold bg-primary/10 text-primary px-2 py-0.5 rounded-full shrink-0">
                      Aktif
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Button Action Pengajuan Baru */}
      <Link
        href="/apply"
        className={`btn-48 w-full rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2.5 h-12 ${
          active === "apply"
            ? "bg-primary text-white shadow-md shadow-primary/20"
            : "bg-primary text-on-primary hover:bg-primary-container shadow-elevated hover:shadow-level2"
        }`}
      >
        <Plus className="w-5 h-5" />
        <span>+ Pengajuan Baru</span>
      </Link>
    </aside>
  );
}

