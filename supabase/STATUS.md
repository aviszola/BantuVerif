# Status Backend Hardening — BantuVerif

Checklist ini dipakai bareng-bareng. Update kolom Status & Dijalankan Oleh setiap kali sebuah file SQL dieksekusi manual di Supabase Dashboard > SQL Editor.

| # | File | Tujuan Singkat | Status | Dijalankan Oleh | Tanggal |
|---|------|-----------------|--------|------------------|---------|
| 1 | `sql/01_rls_applications.sql` | RLS applications, tutup akses PII ke verifikator | ⬜ Belum | - | - |
| 2 | `sql/02_view_verifier_summary.sql` | View non-PII untuk verifikator | ⬜ Belum | - | - |
| 3 | `sql/03_rls_verifications.sql` | RLS tabel verifications | ⬜ Belum | - | - |
| 4 | `sql/04_rls_disbursements.sql` | RLS tabel disbursements | ⬜ Belum | - | - |
| 5 | `sql/05_storage_bukti_penyaluran.sql` | Bucket + policy upload bukti foto | ⬜ Belum | - | - |
| 6 | `sql/06_view_public_transparency.sql` | View agregat publik transparency | ⬜ Belum | - | - |
| 7 | `sql/07_test_rls_manual.sql` | Skrip tes manual pembuktian RLS | ⬜ Belum | - | - |

## ⚠️ Urutan wajib
Blok 1 dan 2 HARUS dijalankan berpasangan — Blok 2 (view non-PII) tidak menambah keamanan apapun kalau Blok 1 (yang mencabut policy lama verifikator) belum dijalankan duluan.

## Perubahan kode yang SUDAH selesai (bukan SQL, sudah dieksekusi)
- [x] `.env.local`: NEXT_PUBLIC_DEMO_MODE=true → false
- [x] `login/page.tsx`: perbaikan handleSubmitIdentifier & handleVerifyOtp (error ditampilkan, tidak fallback sukses)
- [ ] `/ops/distribution`: sambung ke disbursements + upload bukti — MASIH PENDING, butuh Blok 04 & 05 dijalankan dulu
- [ ] `/transparency`: fetch dari public_transparency_stats — MASIH PENDING, butuh Blok 06 dijalankan dulu

## Manual di luar kode/SQL (harus dilakukan lewat Supabase Dashboard)
- [ ] Aktifkan Email OTP provider: Authentication > Providers > Email
- [ ] (Opsional, untuk Blok 07) buat user demo per role untuk testing
