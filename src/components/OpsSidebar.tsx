"use client";

import React from "react";
import {
  BadgeCheck,
  Plus,
  LayoutDashboard,
  ShieldCheck,
  Clipboard,
  Truck,
  Globe,
  History,
  Settings,
  HelpCircle,
} from "lucide-react";

type ActiveItem =
  | "dashboard"
  | "verifications"
  | "approvals"
  | "distribution"
  | "transparency"
  | "audit";

interface OpsSidebarProps {
  active?: ActiveItem;
}

/** Sidebar portal ops/verifikator — dipakai ulang di /ops/* */
export default function OpsSidebar({ active = "verifications" }: OpsSidebarProps) {
  const navItems: { key: ActiveItem; label: string; icon: typeof LayoutDashboard }[] = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "verifications", label: "Verifications", icon: ShieldCheck },
    { key: "approvals", label: "Approvals", icon: Clipboard },
    { key: "distribution", label: "Distribution", icon: Truck },
    { key: "transparency", label: "Transparency", icon: Globe },
    { key: "audit", label: "Audit Logs", icon: History },
  ];

  return (
    <aside className="hidden md:flex h-screen w-64 fixed left-0 top-0 overflow-y-auto bg-surface shadow-level1 border-r border-border-subtle z-50 flex-col p-4 gap-2 custom-scrollbar">
      <div className="mb-8 px-2 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">
          <BadgeCheck className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold text-primary">BantuVerif</h1>
          <p className="text-sm text-on-surface-variant">Ops Platform</p>
        </div>
      </div>

      <button
        type="button"
        className="w-full py-3 mb-6 bg-primary text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary-container transition-all"
      >
        <Plus className="w-5 h-5" />
        New Verification
      </button>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.key === active;
          return (
            <a
              key={item.key}
              href="#"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-transform active:scale-[0.98] ${
                isActive
                  ? "bg-secondary-container text-on-secondary-container"
                  : "text-on-surface-variant hover:bg-surface-container-low transition-colors"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </a>
          );
        })}
      </nav>

      <div className="pt-4 mt-4 border-t border-border-subtle space-y-1">
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors transition-transform active:scale-[0.98]"
        >
          <Settings className="w-5 h-5" />
          Settings
        </a>
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors transition-transform active:scale-[0.98]"
        >
          <HelpCircle className="w-5 h-5" />
          Support
        </a>
      </div>
    </aside>
  );
}
