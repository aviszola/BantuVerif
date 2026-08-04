"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  ShieldCheck,
  Bell,
  User,
  LogOut,
  FileText,
  LayoutDashboard,
  ChevronDown,
  History,
  ClipboardCheck,
  Settings,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => { authListener.subscription.unsubscribe(); };
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (pathname === "/login" || pathname.startsWith("/ops")) return null;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    router.push("/login");
  };

  const isLanding = pathname === "/";

  const navItems = isLanding
    ? [
        { label: "Beranda", href: "#beranda" },
        { label: "Cara Kerja", href: "#cara-kerja" },
        { label: "Simulasi", href: "#simulasi" },
        { label: "Kriteria & FAQ", href: "#faq" },
      ]
    : [
        { label: "Dasbor", href: "/dashboard", matchRoutes: ["/dashboard"] },
        {
          label: "Pengajuan Saya",
          href: "/tracking",
          matchRoutes: ["/apply", "/tracking", "/application-submitted"],
          matchPrefixes: ["/tracking", "/apply"],
        },
        {
          label: "Riwayat",
          href: "/history",
          matchRoutes: ["/history", "/distribution-confirmation", "/application-approved"],
          matchPrefixes: ["/history", "/distribution-confirmation"],
        },
        {
          label: "FAQ & Kriteria",
          href: "/riwayat",
          matchRoutes: ["/riwayat"],
        },
      ];

  const isNavActive = (item: typeof navItems[number]) => {
    if (isLanding) return false;
    const i = item as any;
    return (
      pathname === item.href ||
      (i.matchRoutes && i.matchRoutes.includes(pathname)) ||
      (i.matchPrefixes && i.matchPrefixes.some((p: string) => pathname.startsWith(p)))
    );
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[#e6e8ea] transition-all shadow-sm">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">

          {/* Brand Logo */}
          <Link
            href={isLanding ? "#beranda" : "/dashboard"}
            className="flex items-center gap-2.5 group shrink-0"
          >
            <div className="w-9 h-9 bg-[#004ac6] rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-700/20 group-hover:scale-105 transition-all duration-200">
              <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="font-display font-black text-xl tracking-tight text-[#191c1e]">
              Bantu<span className="text-[#004ac6]">Verif</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7">
            {navItems.map((item) => {
              const active = isNavActive(item);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`text-sm font-semibold transition-all relative py-5 border-b-2 ${
                    active
                      ? "font-bold text-[#004ac6] border-[#004ac6]"
                      : "text-[#434655] hover:text-[#004ac6] border-transparent hover:border-[#004ac6]/30"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Bell (portal only) */}
            {!isLanding && (
              <button
                title="Notifikasi"
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#434655] hover:bg-[#f2f4f6] transition-colors relative border border-transparent hover:border-[#e6e8ea]"
              >
                <Bell className="w-4.5 h-4.5" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
              </button>
            )}

            {user ? (
              <div className="flex items-center gap-2">
                {isLanding && (
                  <Link
                    href="/dashboard"
                    className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-[#004ac6] text-white text-xs font-bold hover:bg-[#2563eb] transition-all shadow-md"
                  >
                    <span>Portal Warga</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}

                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 p-1 md:pl-2 md:pr-3 rounded-full hover:bg-[#f2f4f6] border border-transparent hover:border-[#e6e8ea] transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#004ac6]/10 border border-[#004ac6]/20 text-[#004ac6] font-extrabold text-sm flex items-center justify-center">
                      {user.email ? user.email.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                    </div>
                    <span className="hidden sm:block text-xs font-bold text-[#191c1e] max-w-[100px] truncate">
                      {user.email?.split("@")[0]}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-[#434655] hidden sm:block transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-[#e6e8ea] shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2.5 border-b border-[#e6e8ea]">
                        <p className="text-xs font-bold text-[#191c1e] truncate">{user.email}</p>
                        <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Warga Terverifikasi
                        </p>
                      </div>

                      {[
                        { href: "/dashboard", icon: LayoutDashboard, label: "Dasbor Utama" },
                        { href: "/tracking", icon: FileText, label: "Pengajuan Saya" },
                        { href: "/history", icon: History, label: "Riwayat Pencairan" },
                        { href: "/riwayat", icon: ClipboardCheck, label: "Kriteria Kelayakan" },
                        { href: "/settings", icon: Settings, label: "Pengaturan Akun" },
                      ].map(({ href, icon: Icon, label }) => (
                        <Link
                          key={href}
                          href={href}
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-[#434655] hover:bg-[#f2f4f6] hover:text-[#004ac6] transition-colors"
                        >
                          <Icon className="w-4 h-4 text-[#004ac6]" />
                          {label}
                        </Link>
                      ))}

                      <div className="pt-1 mt-1 border-t border-[#e6e8ea]">
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Keluar Akun
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl font-semibold text-sm text-[#191c1e] hover:bg-[#f2f4f6] transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  href="/login"
                  className="px-5 py-2.5 rounded-xl font-bold text-sm bg-[#004ac6] text-white hover:bg-[#2563eb] shadow-md hover:shadow-lg transition-all"
                >
                  Ajukan Bantuan
                </Link>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-[#434655] hover:bg-[#f2f4f6] transition-colors border border-[#e6e8ea]"
              aria-label="Buka menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div ref={mobileMenuRef} className="md:hidden border-t border-[#e6e8ea] bg-white animate-in slide-in-from-top-2 fade-in duration-200">
            <div className="max-w-[1280px] mx-auto px-4 py-3 space-y-1">
              {/* Nav items */}
              {navItems.map((item) => {
                const active = isNavActive(item);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      active
                        ? "bg-[#f0f4ff] text-[#004ac6] border border-[#dbeafe]"
                        : "text-[#434655] hover:bg-[#f7f9fb] hover:text-[#004ac6]"
                    }`}
                  >
                    {item.label}
                    {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#004ac6]" />}
                  </Link>
                );
              })}

              {/* Auth section */}
              {!user ? (
                <div className="pt-3 mt-2 border-t border-[#e6e8ea] flex flex-col gap-2">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center px-4 py-3 rounded-xl font-semibold text-sm border border-[#e6e8ea] text-[#191c1e] hover:bg-[#f2f4f6] transition-colors"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center px-4 py-3 rounded-xl font-bold text-sm bg-[#004ac6] text-white hover:bg-[#2563eb] transition-all shadow-sm"
                  >
                    Ajukan Bantuan
                  </Link>
                </div>
              ) : (
                <div className="pt-3 mt-2 border-t border-[#e6e8ea]">
                  <div className="px-4 py-2.5 flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-full bg-[#004ac6]/10 border border-[#004ac6]/20 text-[#004ac6] font-extrabold text-sm flex items-center justify-center shrink-0">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#191c1e] truncate">{user.email}</p>
                      <p className="text-[10px] text-emerald-600 font-semibold">Warga Terverifikasi</p>
                    </div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Keluar Akun
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
