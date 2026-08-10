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
FROM applications
WHERE get_my_role() IN ('verifikator','admin');
