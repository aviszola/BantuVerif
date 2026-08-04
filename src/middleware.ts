import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// ─── Tipe role ──────────────────────────────────────────────────────────────
type AppRole = "warga" | "verifikator" | "rtrw" | "admin";

// ─── Env vars ────────────────────────────────────────────────────────────────
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// ─── Halaman default per role setelah login ──────────────────────────────────
const DEFAULT_ROUTE: Record<AppRole, string> = {
  warga: "/dashboard",
  verifikator: "/ops/dashboard",
  rtrw: "/dashboard-rt",
  admin: "/ops/dashboard",
};

// ─── Route yang terproteksi (butuh login) ────────────────────────────────────
const AUTH_PREFIXES = [
  "/dashboard",
  "/dashboard-rt",
  "/apply",
  "/tracking",
  "/settings",
  "/pengaturan",
  "/riwayat",
  "/history",
  "/ops",
  "/application-approved",
  "/application-submitted",
  "/distribution-confirmation",
];

// ─── Guard eksplisit per route: 3 Role = 3 Dashboard terpisah ────────────────
// Urutan pencocokan dari atas ke bawah.
const ROLE_GUARD: { prefix: string; allowed: AppRole[] }[] = [
  // ① Dashboard & Halaman Khusus RT/RW
  { prefix: "/dashboard-rt",              allowed: ["rtrw", "admin"] },
  { prefix: "/distribution-confirmation", allowed: ["rtrw", "admin"] },

  // ② Dashboard & Halaman Khusus Verifikator Lapangan (Ops)
  { prefix: "/ops",                       allowed: ["verifikator", "admin"] },

  // ③ Dashboard & Halaman Khusus Warga Pemohon
  { prefix: "/dashboard",                 allowed: ["warga", "admin"] },
  { prefix: "/apply",                     allowed: ["warga", "admin"] },
  { prefix: "/tracking",                  allowed: ["warga", "admin"] },
  { prefix: "/history",                   allowed: ["warga", "admin"] },
  { prefix: "/riwayat",                   allowed: ["warga", "admin"] },
  { prefix: "/application-approved",      allowed: ["warga", "admin"] },
  { prefix: "/application-submitted",     allowed: ["warga", "admin"] },

  // Halaman bersama (Settings)
  { prefix: "/settings",                  allowed: ["warga", "verifikator", "rtrw", "admin"] },
  { prefix: "/pengaturan",                allowed: ["warga", "verifikator", "rtrw", "admin"] },
];

// ─── Helper: cek auth route ──────────────────────────────────────────────────
function isAuthRoute(pathname: string): boolean {
  return AUTH_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

// ─── Helper: dapatkan guard role ─────────────────────────────────────────────
function getRoleGuard(pathname: string): { prefix: string; allowed: AppRole[] } | null {
  return (
    ROLE_GUARD.find(
      ({ prefix }) => pathname === prefix || pathname.startsWith(prefix + "/")
    ) ?? null
  );
}

// ─── Middleware Utama ────────────────────────────────────────────────────────
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ① Lewati aset statis, API internal, dan file
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    /\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|otf|css|js|map)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  // ② Buat response awal & Supabase SSR Client
  let res = NextResponse.next({ request: req });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
        res = NextResponse.next({ request: req });
        cookiesToSet.forEach(({ name, value, options }) =>
          res.cookies.set(name, value, options)
        );
      },
    },
  });

  // ③ Verifikasi user aktif
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ④ User sudah login & coba buka /login -> lempar ke dashboard rolenya
  if (user && (pathname === "/login" || pathname.startsWith("/login/"))) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const role = (profile?.role as AppRole | undefined) ?? "warga";
    const dest = req.nextUrl.clone();
    dest.pathname = DEFAULT_ROUTE[role] ?? "/dashboard";
    return NextResponse.redirect(dest);
  }

  // ⑤ Route publik (/ dan /login) -> boleh lewat
  if (pathname === "/" || pathname.startsWith("/login")) {
    return res;
  }

  // ⑥ Belum login & buka route terproteksi -> redirect ke /login
  if (isAuthRoute(pathname) && !user) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // ⑦ User login -> periksa kesesuaian role dengan route yang dibuka
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, verification_status")
      .eq("id", user.id)
      .maybeSingle();

    const role = (profile?.role as AppRole | undefined) ?? "warga";
    const guard = getRoleGuard(pathname);

    if (guard) {
      // Role tidak diizinkan di route ini -> kembalikan ke dashboard rolenya sendiri
      if (!guard.allowed.includes(role)) {
        const fallback = req.nextUrl.clone();
        fallback.pathname = DEFAULT_ROUTE[role] ?? "/dashboard";
        return NextResponse.redirect(fallback);
      }

      // Khusus RT/RW yang belum disetujui admin di /dashboard-rt
      if (
        guard.prefix === "/dashboard-rt" &&
        profile?.verification_status !== "approved"
      ) {
        return res;
      }
    }

    // Redirect /ops persis (tanpa sub-path) ke /ops/dashboard
    if (pathname === "/ops") {
      const dest = req.nextUrl.clone();
      dest.pathname = "/ops/dashboard";
      return NextResponse.redirect(dest);
    }
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
