"use client";

import React, { useState, useEffect } from "react";
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
  Sparkles,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    // Ambil sesi awal
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();

    // Dengarkan perubahan auth real-time
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Jangan tampilkan Navbar utama di halaman login
  // (semua hooks harus dipanggil dulu sebelum early return)
  if (pathname === "/login") {
    return null;
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsDropdownOpen(false);
    router.push("/login");
  };

  const isLanding = pathname === "/";

  const navItems = isLanding
    ? [
        { label: "Dashboard", href: "#beranda" },
        { label: "Pengajuan", href: "#cara-kerja" },
        { label: "Riwayat", href: "#simulasi" },
        { label: "FAQ", href: "#faq" },
      ]
    : [
        { label: "Dashboard", href: "/dashboard" },
        {
          label: "Pengajuan Saya",
          href: "/tracking",
          matchRoutes: ["/apply", "/tracking", "/application-submitted"],
        },
        { label: "Riwayat", href: "/dashboard#riwayat" },
        { label: "FAQ", href: "/dashboard#faq" },
      ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-[#e2e8f0] transition-all">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href={isLanding ? "#beranda" : "/dashboard"} className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 md:w-10 md:h-10 bg-primary-container rounded-xl flex items-center justify-center text-white shadow-md shadow-primary-container/20 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <span className="font-display font-extrabold text-xl md:text-2xl tracking-tight text-on-surface">
            Bantu<span className="text-primary-container">Verif</span>
          </span>
        </Link>

        {/* Central Navigation Items */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive =
              (!isLanding && pathname === item.href) ||
              (item.matchRoutes && item.matchRoutes.includes(pathname));

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`text-[15px] transition-all relative py-1 ${
                  isActive
                    ? "font-bold text-primary-container border-b-2 border-primary-container"
                    : "font-medium text-on-surface-variant hover:text-primary-container"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right User Controls & Profile */}
        <div className="flex items-center gap-3 md:gap-4">
          <button
            title="Notifikasi"
            className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-[#f2f4f6] transition-colors relative border border-transparent hover:border-[#e2e8f0]"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2.5 p-1 md:pl-2 md:pr-3 rounded-full hover:bg-[#f2f4f6] border border-transparent hover:border-[#e2e8f0] transition-all"
              >
                <div className="w-9 h-9 rounded-full bg-primary-container/10 border border-primary-container/20 text-primary-container font-extrabold text-sm flex items-center justify-center shadow-2xs">
                  {user.email ? user.email.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                </div>
                <span className="hidden sm:block text-xs font-bold text-on-surface max-w-[120px] truncate">
                  {user.email?.split("@")[0]}
                </span>
                <ChevronDown className="w-4 h-4 text-on-surface-variant hidden sm:block" />
              </button>

              {/* Profile Dropdown */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-[#e2e8f0] shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2.5 border-b border-[#e2e8f0]">
                    <p className="text-xs font-bold text-on-surface truncate">
                      {user.email}
                    </p>
                    <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Warga Terverifikasi
                    </p>
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-on-surface-variant hover:bg-[#f2f4f6] hover:text-primary-container transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard Utama</span>
                  </Link>

                  <Link
                    href="/tracking"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-on-surface-variant hover:bg-[#f2f4f6] hover:text-primary-container transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Pengajuan Saya</span>
                  </Link>

                  <div className="pt-1 mt-1 border-t border-[#e2e8f0]">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Keluar Akun</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : isLanding ? (
            <div className="hidden sm:flex items-center gap-2.5 ml-2">
              <Link
                href="/login"
                className="btn-48 px-5 rounded-md font-semibold text-[14px] text-on-surface hover:bg-surface-container transition-colors flex items-center justify-center h-10"
              >
                Masuk
              </Link>
              <Link
                href="/login"
                className="btn-48 px-5 rounded-md font-semibold text-[14px] bg-primary-container text-white hover:bg-primary shadow-sm hover:shadow-md transition-all flex items-center justify-center h-10"
              >
                Ajukan Bantuan
              </Link>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl bg-primary-container text-white text-xs md:text-sm font-semibold hover:bg-primary transition-all shadow-2xs"
            >
              Masuk Akun
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
