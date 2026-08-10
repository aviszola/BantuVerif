-- ============================================
-- [RLS & Helpers: profiles]
-- Tujuan: Membuat helper functions dan mengamankan tabel profiles dari infinite recursion
-- ============================================

-- Helper functions: dijalankan dengan SECURITY DEFINER agar bypass RLS tabel profiles
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION get_my_rtrw()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT rt_rw FROM profiles WHERE id = auth.uid();
$$;

-- Aktifkan RLS pada tabel profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop policy lama agar bersih
DROP POLICY IF EXISTS "Admin bisa lihat semua profil" ON profiles;
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;

-- Warga/RT/RW/Admin: SELECT profil milik sendiri
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Admin: SELECT semua profil (menggunakan get_my_role() agar terhindar dari recursion)
CREATE POLICY "Admin bisa lihat semua profil" ON profiles
  FOR SELECT USING (get_my_role() = 'admin');

-- Warga/RT/RW/Admin: INSERT profil milik sendiri
CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Warga/RT/RW/Admin: UPDATE profil milik sendiri
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
