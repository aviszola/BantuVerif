import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Wajib: NEXT_PUBLIC_SUPABASE_URL & ANON_KEY dibaca dari env (sudah divalidasi di lib/supabase)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** Route yang butuh role spesifik. */
const ROLE_GUARD: Record<string, string[]> = {
  "/dashboard-rt": ["rtrw", "admin"],
  "/ops": ["verifikator", "rtrw", "admin"],
};

/** Route yang butuh login (role apa pun). */
const AUTH_ROUTES = [
  "/dashboard",
  "/dashboard-rt",
  "/apply",
  "/tracking",
  "/settings",
  "/pengaturan",
  "/riwayat",
  "/history",
  "/ops",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Lewati aset statis & API internal
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const res = NextResponse.next();
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) =>
          res.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Route publik: login & landing selalu boleh
  const isPublicRoute = pathname === "/" || pathname.startsWith("/login");
  if (isPublicRoute) return res;

  const needsAuth = AUTH_ROUTES.some((r) => pathname === r || pathname.startsWith(r + "/"));

  if (needsAuth && !user) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (user) {
    // Ambil role dari profiles (RLS mengizinkan select profil sendiri)
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, verification_status")
      .eq("id", user.id)
      .maybeSingle();

    const role = profile?.role as string | undefined;

    // Cek guard per-route
    for (const [prefix, allowedRoles] of Object.entries(ROLE_GUARD)) {
      if (pathname === prefix || pathname.startsWith(prefix + "/")) {
        if (!role || !allowedRoles.includes(role)) {
          const url = req.nextUrl.clone();
          url.pathname = "/dashboard"; // fallback portal warga
          return NextResponse.redirect(url);
        }
        // RT/RW belum disetujui admin → placeholder verifikasi
        if (prefix === "/dashboard-rt" && profile?.verification_status !== "approved") {
          return res; // biarkan halaman handle state-nya sendiri
        }
      }
    }
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
