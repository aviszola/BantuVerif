-- ============================================
-- [Test manual RLS]
-- Tujuan: Skrip pembuktian manual bahwa RLS benar-benar memblokir
-- Status: BELUM DIJALANKAN
-- Dijalankan oleh: -
-- Tanggal: -
-- ============================================

-- ============================================
-- TEST RLS — ganti UUID dengan user nyata
-- ============================================

-- TEST 1: Warga hanya lihat pengajuannya sendiri
select set_config('request.jwt.claims', '{"sub":"UUID_WARGA","role":"authenticated"}', true);
select set_config('role', 'authenticated', true);
select count(*) from applications;  -- EXPECT: hanya row milik UUID_WARGA

-- TEST 2: Verifikator TIDAK bisa baca PII applications
select set_config('request.jwt.claims', '{"sub":"UUID_VERIFIKATOR","role":"authenticated"}', true);
select set_config('role', 'authenticated', true);
select * from applications;                     -- EXPECT: 0 row (policy SELECT dicabut)
select * from verifier_application_summary;     -- EXPECT: ringkasan non-PII

-- TEST 3: Verifikator INSERT verifikasi
select set_config('request.jwt.claims', '{"sub":"UUID_VERIFIKATOR","role":"authenticated"}', true);
select set_config('role', 'authenticated', true);
insert into verifications (application_id, verifier_id, decision, notes)
values ('UUID_APLIKASI', 'UUID_VERIFIKATOR', 'agree', 'test');
-- EXPECT: sukses. Lalu coba verifier_id = UUID_ORANG_LAIN → EXPECT: RLS blokir (0 row)

-- TEST 4: RT/RW hanya wilayahnya
select set_config('request.jwt.claims', '{"sub":"UUID_RTRW","role":"authenticated"}', true);
select set_config('role', 'authenticated', true);
select distinct rt_rw from applications;
-- EXPECT: hanya rt_rw milik UUID_RTRW (profilnya 'RT 004 / RW 007')

-- TEST 5: Anon tanpa login
select set_config('role', 'anon', true);
select * from applications;             -- EXPECT: 0 row / RLS blokir
select * from public_transparency_stats; -- EXPECT: OK (view publik)
