-- ============================================
-- [RLS: verifications]
-- Tujuan: RLS tabel verifications — verifikator insert suara, warga baca verifikasi miliknya
-- Status: BELUM DIJALANKAN
-- Dijalankan oleh: -
-- Tanggal: -
-- ============================================

-- ============================================
-- RLS: verifications
-- ============================================
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;

-- Verifikator: INSERT suara, verifier_id = auth.uid()
DROP POLICY IF EXISTS "verifications_insert" ON verifications;
CREATE POLICY "verifications_insert" ON verifications
  FOR INSERT WITH CHECK (
    auth.uid() = verifier_id
    AND get_my_role() IN ('verifikator','rtrw','admin')
  );

-- Verifikator/RT/RW/admin: SELECT verifikasi
DROP POLICY IF EXISTS "verifications_select" ON verifications;
CREATE POLICY "verifications_select" ON verifications
  FOR SELECT USING (
    get_my_role() IN ('verifikator','rtrw','admin')
    OR EXISTS (
      SELECT 1 FROM applications a
      WHERE a.id = verifications.application_id AND a.user_id = auth.uid()
    )
  );
