-- ============================================
-- [View non-PII verifikator]
-- Tujuan: View ringkasan aplikasi tanpa kolom privat untuk verifikator
-- Status: BELUM DIJALANKAN
-- Dijalankan oleh: -
-- Tanggal: -
-- ============================================

-- ============================================
-- VIEW: verifier_application_summary (non-PII)
-- ============================================
CREATE OR REPLACE VIEW verifier_application_summary AS
SELECT
  id,
  full_name,
  rt_rw,
  kelurahan,
  kecamatan,
  category,
  status,
  consensus_score,
  created_at
FROM applications;

-- RLS view: verifikator & admin hanya lewat view, bukan tabel
DROP POLICY IF EXISTS "verifier_summary_select" ON verifier_application_summary;
CREATE POLICY "verifier_summary_select" ON verifier_application_summary
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role IN ('verifikator','admin')
    )
  );
