import { createClient, type User } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY wajib diisi di .env.local"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/** Mode demo: mengaktifkan jalur login cepat (passkey/OTP-bypass) — HANYA untuk demo live, matikan di production. */
export const isDemoMode = () => process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export type AppRole = "warga" | "verifikator" | "rtrw" | "admin";

/** Ambil role dari tabel profiles; null kalau profil belum ada / gagal. */
export async function getUserRole(userId: string | undefined): Promise<AppRole | null> {
  if (!userId) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();
  if (error || !data) return null;
  return (data.role as AppRole) ?? null;
}

export type { User };
