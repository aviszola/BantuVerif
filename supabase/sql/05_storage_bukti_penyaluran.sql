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

create policy "petugas_upload_bukti"
on storage.objects for insert
with check (
  bucket_id = 'bukti-penyaluran'
  and auth.role() = 'authenticated'
  and exists (
    select 1 from profiles p
    where p.id = auth.uid() and p.role in ('rtrw','admin')
  )
);

create policy "petugas_read_bukti"
on storage.objects for select
using (
  bucket_id = 'bukti-penyaluran'
  and exists (
    select 1 from profiles p
    where p.id = auth.uid() and p.role in ('rtrw','admin')
  )
);
