-- ============================================
-- [RLS: applications]
-- Tujuan: RLS applications — warga hanya akses miliknya, RT/RW hanya wilayahnya, cabut akses PII verifikator
-- Status: BELUM DIJALANKAN
-- Dijalankan oleh: -
-- Tanggal: -
-- ============================================

-- ============================================
-- RLS: applications
-- ============================================
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Warga: SELECT/UPDATE hanya baris miliknya
DROP POLICY IF EXISTS "applications_select_own" ON applications;
CREATE POLICY "applications_select_own" ON applications
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "applications_update_own" ON applications;
CREATE POLICY "applications_update_own" ON applications
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Warga: INSERT
DROP POLICY IF EXISTS "applications_insert_own" ON applications;
CREATE POLICY "applications_insert_own" ON applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RT/RW & admin: SELECT hanya wilayahnya (rt_rw text match)
DROP POLICY IF EXISTS "applications_select_rtrw" ON applications;
CREATE POLICY "applications_select_rtrw" ON applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('rtrw','admin')
        AND (p.role = 'admin' OR p.rt_rw = applications.rt_rw)
    )
  );

-- RT/RW & admin: UPDATE keputusan hanya wilayahnya
DROP POLICY IF EXISTS "applications_update_rtrw" ON applications;
CREATE POLICY "applications_update_rtrw" ON applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('rtrw','admin')
        AND (p.role = 'admin' OR p.rt_rw = applications.rt_rw)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('rtrw','admin')
        AND (p.role = 'admin' OR p.rt_rw = applications.rt_rw)
    )
  );
