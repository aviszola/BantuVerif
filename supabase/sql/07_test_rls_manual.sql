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
-- Ganti '11111111-1111-1111-1111-111111111111' dengan UUID warga nyata dari tabel profiles Anda
select set_config('request.jwt.claims', '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}', true);
select set_config('role', 'authenticated', true);
select count(*) from applications;  -- EXPECT: hanya row milik warga tersebut

-- TEST 2: Verifikator TIDAK bisa baca PII applications
-- Ganti '22222222-2222-2222-2222-222222222222' dengan UUID verifikator nyata dari tabel profiles Anda
select set_config('request.jwt.claims', '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}', true);
select set_config('role', 'authenticated', true);
select * from applications;                     -- EXPECT: 0 row (policy SELECT dicabut)
select * from verifier_application_summary;     -- EXPECT: ringkasan non-PII

-- TEST 3: Verifikator INSERT verifikasi
-- Ganti '44444444-4444-4444-4444-444444444444' dengan UUID aplikasi nyata
select set_config('request.jwt.claims', '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}', true);
select set_config('role', 'authenticated', true);
insert into verifications (application_id, verifier_id, decision, notes)
values ('44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'agree', 'test');
-- EXPECT: sukses. Lalu coba verifier_id = UUID_ORANG_LAIN → EXPECT: RLS blokir (0 row)

-- TEST 4: RT/RW hanya wilayahnya
-- Ganti '33333333-3333-3333-3333-333333333333' dengan UUID RT/RW nyata
select set_config('request.jwt.claims', '{"sub":"33333333-3333-3333-3333-333333333333","role":"authenticated"}', true);
select set_config('role', 'authenticated', true);
select distinct rt_rw from applications;
-- EXPECT: hanya rt_rw milik RT/RW tersebut

-- TEST 5: Anon tanpa login
select set_config('role', 'anon', true);
select * from applications;             -- EXPECT: 0 row / RLS blokir
select * from public_transparency_stats; -- EXPECT: OK (view publik)
