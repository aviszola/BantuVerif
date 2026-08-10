-- ============================================
-- [RLS: disbursements]
-- Tujuan: RLS tabel disbursements — RT/RW admin kelola, warga baca miliknya
-- Status: BELUM DIJALANKAN
-- Dijalankan oleh: -
-- Tanggal: -
-- ============================================

-- ============================================
-- RLS: disbursements
-- ============================================
ALTER TABLE disbursements ENABLE ROW LEVEL SECURITY;

-- RT/RW & admin: SELECT/INSERT/UPDATE (petugas distribusi)
DROP POLICY IF EXISTS "disbursements_select" ON disbursements;
CREATE POLICY "disbursements_select" ON disbursements
  FOR SELECT USING (
    get_my_role() IN ('rtrw','admin')
    OR EXISTS (
      SELECT 1 FROM applications a
      WHERE a.id = disbursements.application_id AND a.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "disbursements_insert" ON disbursements;
CREATE POLICY "disbursements_insert" ON disbursements
  FOR INSERT WITH CHECK (
    get_my_role() IN ('rtrw','admin')
  );

DROP POLICY IF EXISTS "disbursements_update" ON disbursements;
CREATE POLICY "disbursements_update" ON disbursements
  FOR UPDATE USING (
    get_my_role() IN ('rtrw','admin')
  );
