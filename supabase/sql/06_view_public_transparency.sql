-- ============================================
-- [View agregat publik transparency]
-- Tujuan: View statistik agregat non-PII untuk akses publik (anon)
-- Status: BELUM DIJALANKAN
-- Dijalankan oleh: -
-- Tanggal: -
-- ============================================

-- ============================================
-- VIEW: public_transparency_stats (statistik agregat, non-PII)
-- ============================================
CREATE OR REPLACE VIEW public_transparency_stats AS
SELECT
  rt_rw,
  COUNT(*) AS total_pengajuan,
  COUNT(*) FILTER (WHERE status = 'approved')    AS disetujui,
  COUNT(*) FILTER (WHERE status = 'rejected')    AS ditolak,
  COUNT(*) FILTER (WHERE status = 'distributed') AS tersalurkan
FROM applications
GROUP BY rt_rw;

-- Publik (anon) HANYA akses view ini
GRANT SELECT ON public_transparency_stats TO anon;
REVOKE ALL ON applications FROM anon;
