-- =============================================
-- BantuVerif — Supabase Schema + RLS
-- Cara pakai: Buka Supabase Dashboard → SQL Editor → New query → paste & Run
-- Jalankan SEKALI saja (idempotent: pakai IF NOT EXISTS / OR REPLACE)
-- =============================================

-- ---------- ENUM ----------
create type public.app_role as enum ('warga', 'verifikator', 'rtrw', 'admin');
create type public.application_status as enum ('draft', 'submitted', 'verification', 'rt_review', 'approved', 'rejected', 'distributed');
create type public.verification_decision as enum ('agree', 'unsure', 'disagree');

-- ---------- PROFILES ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.app_role not null default 'warga',
  full_name text,
  nik text unique,
  phone text,
  address text,
  rt_rw text,                      -- contoh: 'RT 004 / RW 007'
  kelurahan text,
  kecamatan text,
  verification_status text not null default 'pending',  -- pending | approved | rejected (khusus rtrw)
  sk_file_path text,               -- path storage dokumen SK
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- trigger: buat baris profiles otomatis saat user daftar
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------- APPLICATIONS ----------
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null default 'BLT Sembako',
  status public.application_status not null default 'draft',
  full_name text,
  nik text,
  email text,
  phone text,
  birth_date text,
  family_members int,
  house_ownership text,
  address text,
  rt_rw text,
  kelurahan text,
  kecamatan text,
  monthly_income text,
  occupation text,
  reason_category text,
  reason_description text,
  ktp_uploaded boolean not null default false,
  kk_uploaded boolean not null default false,
  house_photo_uploaded boolean not null default false,
  consensus_score numeric default null,        -- 0..100, dihitung saat 3 suara masuk
  verifier_count int not null default 0,
  rt_decision text,                             -- approve | reject
  rt_notes text,
  tracking_code text,                           -- tampilan publik: BANTU-XXXX
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- VERIFICATIONS ----------
create table if not exists public.verifications (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  verifier_id uuid not null references auth.users(id) on delete cascade,
  decision public.verification_decision,
  notes text,
  created_at timestamptz not null default now(),
  unique (application_id, verifier_id)
);

-- ---------- DISBURSEMENTS ----------
create table if not exists public.disbursements (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  amount numeric not null default 0,
  disbursed_at timestamptz not null default now(),
  receipt_code text,
  confirmed_by uuid references auth.users(id)
);

-- ---------- NOTIFICATIONS ----------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null default 'info',
  message text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

-- ---------- AUTO: update konsensus saat suara masuk ----------
create or replace function public.handle_verification_insert()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_agree int; v_unsure int; v_total int;
  v_score numeric;
begin
  select
    count(*) filter (where decision = 'agree'),
    count(*) filter (where decision = 'unsure'),
    count(*)
  into v_agree, v_unsure, v_total
  from public.verifications
  where application_id = new.application_id;

  update public.applications
  set verifier_count = v_total,
      updated_at = now()
  where id = new.application_id;

  if v_total >= 3 then
    v_score := (v_agree * 100.0 + v_unsure * 40.0) / v_total;
    update public.applications
    set consensus_score = round(v_score::numeric, 1),
        status = case when v_score >= 60 then 'rt_review' else 'rejected' end,
        updated_at = now()
    where id = new.application_id;
  end if;

  return new;
end;
$$;

drop trigger if exists on_verification_insert on public.verifications;
create trigger on_verification_insert
  after insert on public.verifications
  for each row execute procedure public.handle_verification_insert();

-- ---------- RLS: AKTIFKAN ----------
alter table public.profiles enable row level security;
alter table public.applications enable row level security;
alter table public.verifications enable row level security;
alter table public.disbursements enable row level security;
alter table public.notifications enable row level security;

-- ---------- RLS POLICY ----------
-- PROFILES: user hanya bisa baca/tulis profil sendiri; admin baca semua
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id or exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','rtrw')));

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- APPLICATIONS: pemohon kelola punya sendiri; verifikator baca antrean; rtrw/admin baca semua utk keputusan
drop policy if exists "applications_select_own" on public.applications;
create policy "applications_select_own" on public.applications
  for select using (
    auth.uid() = user_id
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('verifikator','rtrw','admin'))
  );

drop policy if exists "applications_insert_own" on public.applications;
create policy "applications_insert_own" on public.applications
  for insert with check (auth.uid() = user_id);

drop policy if exists "applications_update_own" on public.applications;
create policy "applications_update_own" on public.applications
  for update using (
    auth.uid() = user_id
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('rtrw','admin'))
  );

-- VERIFICATIONS: verifikator baca & tulis; pemohon baca milik pengajuannya
drop policy if exists "verifications_select" on public.verifications;
create policy "verifications_select" on public.verifications
  for select using (
    exists (select 1 from public.applications a where a.id = application_id and a.user_id = auth.uid())
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('verifikator','rtrw','admin'))
  );

drop policy if exists "verifications_insert" on public.verifications;
create policy "verifications_insert" on public.verifications
  for insert with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'verifikator')
  );

-- DISBURSEMENTS: pemohon baca punya sendiri; petugas/rtrw/admin kelola
drop policy if exists "disbursements_select" on public.disbursements;
create policy "disbursements_select" on public.disbursements
  for select using (
    exists (select 1 from public.applications a where a.id = application_id and a.user_id = auth.uid())
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('rtrw','admin'))
  );

drop policy if exists "disbursements_insert" on public.disbursements;
create policy "disbursements_insert" on public.disbursements
  for insert with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('rtrw','admin'))
  );

-- NOTIFICATIONS: hanya pemilik
drop policy if exists "notifications_select_own" on public.notifications;
create policy "notifications_select_own" on public.notifications
  for select using (auth.uid() = user_id);

drop policy if exists "notifications_update_own" on public.notifications;
create policy "notifications_update_own" on public.notifications
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------- SEED (opsional, hapus kalau mau mulai bersih) ----------
-- Demo account referensi — password di-set manual via dashboard Auth > Users
-- insert into public.profiles (id, role, full_name, verification_status, rt_rw) values
--   ('00000000-0000-0000-0000-000000000001', 'rtrw', 'Admin RT 04', 'approved', 'RT 004 / RW 007')
-- on conflict (id) do nothing;
