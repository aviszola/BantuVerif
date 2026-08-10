-- ============================================
-- [Storage bukti penyaluran]
-- Tujuan: Kolom proof_url + bucket storage bukti-penyaluran + policy upload/read
-- Status: BELUM DIJALANKAN
-- Dijalankan oleh: -
-- Tanggal: -
-- ============================================

-- ============================================
-- Kolom bukti foto penyaluran
-- ============================================
ALTER TABLE disbursements ADD COLUMN IF NOT EXISTS proof_url text;

-- ============================================
-- Storage bucket bukti-penyaluran (private)
-- ============================================
insert into storage.buckets (id, name, public)
values ('bukti-penyaluran', 'bukti-penyaluran', false)
on conflict (id) do nothing;

DROP POLICY IF EXISTS "petugas_upload_bukti" ON storage.objects;
create policy "petugas_upload_bukti"
on storage.objects for insert
with check (
  bucket_id = 'bukti-penyaluran'
  and auth.role() = 'authenticated'
  and get_my_role() in ('rtrw','admin')
);

DROP POLICY IF EXISTS "petugas_read_bukti" ON storage.objects;
create policy "petugas_read_bukti"
on storage.objects for select
using (
  bucket_id = 'bukti-penyaluran'
  and get_my_role() in ('rtrw','admin')
);
