# Status Backend Hardening — BantuVerif

Checklist ini dipakai bareng-bareng. Update kolom Status & Dijalankan Oleh setiap kali sebuah file SQL dieksekusi manual di Supabase Dashboard > SQL Editor.

## 🚨 URUTAN EKSEKUSI FINAL (WAJIB BERURUTAN)

| # | File | Tujuan Singkat | Status | Dijalankan Oleh | Tanggal |
|---|------|-----------------|--------|------------------|---------|
| 0 | `sql/00_fix_profiles_recursion.sql` | **FIX infinite recursion 42P17** di policy `profiles_select_own` (schema.sql lama) → ganti subquery self-referencing dengan SECURITY DEFINER function `has_role()` | ⬜ Belum | - | - |
| 1 | `sql/01_rls_applications.sql` | RLS applications, tutup akses PII ke verifikator | ⬜ Belum | - | - |
| 2 | `sql/02_view_verifier_summary.sql` | View non-PII untuk verifikator | ⬜ Belum | - | - |
| 3 | `sql/03_rls_verifications.sql` | RLS tabel verifications | ⬜ Belum | - | - |
| 4 | `sql/04_rls_disbursements.sql` | RLS tabel disbursements | ⬜ Belum | - | - |
| 5 | `sql/05_storage_bukti_penyaluran.sql` | Bucket + policy upload bukti foto | ⬜ Belum | - | - |
| 6 | `sql/06_view_public_transparency.sql` | View agregat publik transparency | ⬜ Belum | - | - |
| 7 | `sql/07_test_rls_manual.sql` | Skrip tes manual pembuktian RLS | ⬜ Belum | - | - |

### Catatan verifikasi per blok (SEBELUM lanjut ke blok berikutnya)

1. **Setelah Blok 00** → jalankan `node scratch-verify-rls.cjs` dulu. Pastikan **SEMUA query ke 5 tabel (applications, profiles, verifications, disbursements, notifications) sukses tanpa error 42P17** (untuk anon key: 0 row, bukan error). Kalau masih ada 42P17, JANGAN lanjut ke Blok 01 — laporkan ke agent dulu.
2. **Setelah Blok 01** → jalankan `node scratch-verify-rls.cjs`. Pastikan query `applications` (via anon key) **sukses 0 row** (sebelumnya error 42P17). Kalau masih error, JANGAN lanjut ke Blok 02.
3. **Setelah Blok 02** → jalankan `node scratch-verify-rls.cjs`. Pastikan view `verifier_application_summary` **ADA** (query sukses, bukan PGRST205 "MISSING TABLE/VIEW"). Kalau belum ada, JANGAN lanjut ke Blok 03.
4. **Setelah Blok 03** → jalankan `node scratch-verify-rls.cjs`. Pastikan query `verifications` **sukses 0 row** (sebelumnya error 42P17). Kalau masih error, JANGAN lanjut ke Blok 04.
5. **Setelah Blok 04** → jalankan `node scratch-verify-rls.cjs`. Pastikan query `disbursements` **sukses 0 row** (sebelumnya error 42P17). Kalau masih error, JANGAN lanjut ke Blok 05.
6. **Setelah Blok 05** → jalankan `node scratch-verify-rls.cjs`. Pastikan kolom `proof_url` **ADA** (query sukses, bukan 42703). Cek manual di Dashboard: bucket `bukti-penyaluran` harus ada (Storage > Buckets). Kalau belum, JANGAN lanjut ke Blok 06.
7. **Setelah Blok 06** → jalankan `node scratch-verify-rls.cjs`. Pastikan view `public_transparency_stats` **ADA** dan query-nya sukses (bukan PGRST205). Kalau belum ada, JANGAN lanjut ke Blok 07.
8. **Setelah Blok 07** → jalankan `node scratch-verify-rls.cjs` (regression check: 5 tabel masih sukses + 2 view masih ada). Lalu jalankan skrip tes manual Blok 07 dengan UUID user nyata per role untuk pembuktian akhir RLS.

> [!IMPORTANT]
> **Blok 00 WAJIB sukses duluan.** Tanpa fix 42P17, semua query ke tabel utama error dan Blok 1-6 tidak bisa diverifikasi maupun dipakai. Blok 00 baru selesai kalau `node scratch-verify-rls.cjs` tidak lagi menampilkan error 42P17.

## 🚨 TEMUAN KRITIS — Verifikasi otomatis 2026-08-08 (read-only, anon key)

**`supabase/schema.sql` SUDAH dijalankan di database** (tabel + RLS aktif + policy lama), **tapi 7 blok hardening belum berfungsi**:

- **INFINITE RECURSION (42P17)** di policy `profiles` dari schema.sql lama: `profiles_select_own` melakukan subquery ke tabel `profiles` sendiri. Akibatnya **SEMUA query ke `applications`, `profiles`, `verifications`, `disbursements` gagal dengan error**, bukan sekadar diblokir RLS. Aplikasi dalam kondisi broken.
- View Blok 2 (`verifier_application_summary`) dan Blok 6 (`public_transparency_stats`): **tidak ada di DB**.
- Kolom `proof_url` dan bucket `bukti-penyaluran` (Blok 5): **tidak ada di DB**.
- Policy lama schema.sql (mis. `applications_select_own` yang masih memberi akses PII ke verifikator) **tidak bisa dicabut** selama recursion 42P17 belum diperbaiki.

### Urutan perbaikan WAJIB
1. **FIX DULU recursion 42P17** (policy `profiles` di schema.sql) — tanpa ini, Blok 1/3/4 tidak bisa diverifikasi maupun dipakai.
2. Baru jalankan Blok 1 → 2 → 3 → 4 → 5 → 6 berurutan.
3. Blok 7 (test RLS) baru bisa dijalankan setelah semua blok di atas.

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
