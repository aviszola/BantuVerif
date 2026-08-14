-- ============================================
-- [00: FIX infinite recursion 42P17 — policy profiles]
-- Tujuan: Ganti subquery self-referencing di policy `profiles_select_own`
--         (dari schema.sql lama) dengan SECURITY DEFINER function.
--         WAJIB dijalankan PALING PERTAMA, sebelum Blok 01-07.
-- Status: BELUM DIJALANKAN
-- Dijalankan oleh: -
-- Tanggal: -
-- ============================================

-- ============================================
-- AKAR MASALAH
-- ============================================
-- Policy lama (schema.sql):
--   create policy "profiles_select_own" on public.profiles
--     for select using (auth.uid() = id or exists (
--       select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','rtrw')));
--
-- Setiap SELECT ke profiles → policy dievaluasi → subquery SELECT ke profiles
-- → RLS di profiles dievaluasi LAGI → policy yang sama dipanggil lagi
-- → muter terus → error 42P17 "infinite recursion detected in policy for relation profiles".
--
-- Semua tabel lain ikut rusak karena policy-nya (applications/verifications/disbursements)
-- juga subquery ke profiles untuk cek role → masuk ke policy recursive ini.

-- ============================================
-- SOLUSI: SECURITY DEFINER function
-- ============================================
-- Fungsi ini dieksekusi sebagai pemilik tabel (postgres), sehingga RLS TIDAK
-- dievaluasi ulang di dalam fungsi → rantai recursion putus.
-- Role tetap dibaca dari tabel profiles (single source of truth) → perubahan
-- role berlaku langsung, tanpa menunggu refresh token.

create or replace function public.has_role(roles text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = any (roles)
  );
$$;

-- Semua role yang bisa kena evaluasi policy wajib bisa eksekusi fungsi ini
-- (default PUBLIC sudah dapat — baris ini eksplisit biar jelas)
grant execute on function public.has_role(text[]) to anon, authenticated;

-- ============================================
-- Ganti policy recursive → function-based
-- ============================================
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (
    auth.uid() = id or public.has_role(array['admin','rtrw'])
  );

-- ============================================
-- Verifikasi setelah dijalankan:
--   node scratch-verify-rls.cjs
-- Harusnya: SEMUA query ke 5 tabel sukses (0 row untuk anon), TANPA error 42P17.
-- Baru lanjut Blok 01.
-- ============================================
