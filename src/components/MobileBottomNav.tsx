"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  History,
  ClipboardCheck,
  Settings,
} from "lucide-react";

const navItems = [
  { key: "dashboard", label: "Beranda", href: "/dashboard", icon: LayoutDashboard },
  { key: "applications", label: "Pengajuan", href: "/tracking", icon: FileText },
  { key: "eligibility", label: "Kriteria", href: "/riwayat", icon: ClipboardCheck },
  { key: "history", label: "Riwayat", href: "/history", icon: History },
  { key: "settings", label: "Pengaturan", href: "/settings", icon: Settings },
];

const PORTAL_ROUTES = ["/dashboard", "/tracking", "/apply", "/riwayat", "/history", "/settings", "/application-submitted", "/application-approved", "/distribution-confirmation", "/pengaturan", "/ops"];

export default function MobileBottomNav() {
  const pathname = usePathname();

  const isPortal = PORTAL_ROUTES.some((r) => pathname === r || pathname.startsWith(r + "/"));

  if (!isPortal) return null;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#e2e8f0] shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="flex items-stretch h-[60px]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.key === "applications" && ["/apply", "/tracking", "/application-submitted"].some((r) => pathname.startsWith(r))) ||
            (item.key === "history" && ["/history", "/distribution-confirmation", "/application-approved"].some((r) => pathname.startsWith(r)));

          return (
            <Link
              key={item.key}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition-all ${
                isActive
                  ? "text-[#004ac6] bg-[#f0f4ff]"
                  : "text-[#737686] hover:text-[#004ac6] hover:bg-[#f7f9fb]"
              }`}
            >
              <Icon
                className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : "stroke-[1.8]"}`}
              />
              <span>{item.label}</span>
              {isActive && (
                <span className="absolute bottom-0 w-8 h-0.5 rounded-t-full bg-[#004ac6]" />
              )}
            </Link>
          );
        })}
      </div>
      {/* iOS safe area padding */}
      <div className="h-safe-bottom bg-white" style={{ paddingBottom: "env(safe-area-inset-bottom)" }} />
    </nav>
  );
}
