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
} from "lucide-react";

type ActiveItem = "dashboard" | "applications" | "eligibility" | "history" | "settings";

interface PortalSidebarProps {
  active?: ActiveItem;
}

/** Sidebar navigasi portal warga — dipakai ulang di /tracking & /tracking/[id] */
export default function PortalSidebar({ active = "applications" }: PortalSidebarProps) {
  const items: { key: ActiveItem; label: string; href: string; icon: typeof LayoutDashboard }[] = [
    { key: "dashboard", label: "Ringkasan Utama", href: "/dashboard", icon: LayoutDashboard },
    { key: "applications", label: "Pengajuan Saya", href: "/tracking", icon: FileText },
    { key: "eligibility", label: "Kriteria Kelayakan", href: "/riwayat", icon: ClipboardCheck },
    { key: "history", label: "Riwayat Verifikasi", href: "/riwayat", icon: History },
    { key: "settings", label: "Pengaturan Akun", href: "/dashboard", icon: Settings },
  ];

  return (
    <aside className="hidden lg:block lg:col-span-3 bg-white rounded-2xl border border-border-subtle p-5 shadow-level1">
      <div className="text-[11px] font-bold tracking-widest text-outline uppercase mb-4 px-3">
        PORTAL WARGA
      </div>

      <nav className="flex flex-col gap-1.5 mb-8">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = item.key === active;
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
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all text-rose-600 hover:bg-rose-50 mt-2"
        >
          <User className="w-4.5 h-4.5" />
          <span>Keluar Akun</span>
        </button>
      </nav>

      <Link
        href="/apply"
        className="btn-48 w-full rounded-xl font-semibold text-sm bg-primary text-on-primary hover:bg-primary-container shadow-elevated hover:shadow-level2 transition-all flex items-center justify-center gap-2.5 h-12"
      >
        <Plus className="w-5 h-5" />
        <span>+ Pengajuan Baru</span>
      </Link>
    </aside>
  );
}
