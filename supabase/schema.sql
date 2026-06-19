create extension if not exists "pgcrypto";

create table if not exists public.songs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  artist text default 'R.ON',
  language text,
  genre text,
  description text,
  lyrics text,
  story text,
  seo_title text,
  seo_description text,
  social_caption text,
  mood_tags text,
  release_kit jsonb default '{}'::jsonb,
  translations jsonb default '{}'::jsonb,
  cover_prompt text,
  cover_url text,
  audio_url text,
  youtube_url text,
  release_date date,
  status text default 'draft' check (status in ('draft', 'published')),
  play_count integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists public.albums (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  cover_url text,
  release_date date,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists public.song_albums (
  id uuid primary key default gen_random_uuid(),
  song_id uuid references public.songs(id) on delete cascade,
  album_id uuid references public.albums(id) on delete cascade,
  track_number integer,
  unique(song_id, album_id)
);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  inquiry_type text,
  message text not null,
  source text default 'website',
  status text default 'new' check (status in ('new', 'replied', 'booked', 'archived')),
  admin_notes text,
  created_at timestamp with time zone default now()
);

create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  created_at timestamp with time zone default now()
);

alter table public.songs add column if not exists seo_title text;
alter table public.songs add column if not exists seo_description text;
alter table public.songs add column if not exists social_caption text;
alter table public.songs add column if not exists mood_tags text;
alter table public.songs add column if not exists release_kit jsonb default '{}'::jsonb;
alter table public.songs add column if not exists translations jsonb default '{}'::jsonb;
alter table public.songs add column if not exists cover_prompt text;
alter table public.inquiries add column if not exists source text default 'website';
alter table public.inquiries add column if not exists status text default 'new';
alter table public.inquiries add column if not exists admin_notes text;
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'inquiries_status_check'
  ) then
    alter table public.inquiries
    add constraint inquiries_status_check check (status in ('new', 'replied', 'booked', 'archived'));
  end if;
end $$;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.admin_users
    where admin_users.id = auth.uid()
  );
$$;

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists songs_set_updated_at on public.songs;
create trigger songs_set_updated_at
before update on public.songs
for each row execute function public.set_updated_at();

drop trigger if exists albums_set_updated_at on public.albums;
create trigger albums_set_updated_at
before update on public.albums
for each row execute function public.set_updated_at();

alter table public.songs enable row level security;
alter table public.albums enable row level security;
alter table public.song_albums enable row level security;
alter table public.inquiries enable row level security;
alter table public.admin_users enable row level security;

drop policy if exists "Public can read published songs" on public.songs;
create policy "Public can read published songs"
on public.songs for select
using (status = 'published');

drop policy if exists "Admins can manage songs" on public.songs;
create policy "Admins can manage songs"
on public.songs for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read albums with published songs" on public.albums;
create policy "Public can read albums with published songs"
on public.albums for select
using (
  exists (
    select 1
    from public.song_albums sa
    join public.songs s on s.id = sa.song_id
    where sa.album_id = albums.id and s.status = 'published'
  )
);

drop policy if exists "Admins can manage albums" on public.albums;
create policy "Admins can manage albums"
on public.albums for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read published song album links" on public.song_albums;
create policy "Public can read published song album links"
on public.song_albums for select
using (
  exists (
    select 1
    from public.songs s
    where s.id = song_albums.song_id and s.status = 'published'
  )
);

drop policy if exists "Admins can manage song album links" on public.song_albums;
create policy "Admins can manage song album links"
on public.song_albums for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can submit inquiries" on public.inquiries;
create policy "Public can submit inquiries"
on public.inquiries for insert
to anon, authenticated
with check (true);

drop policy if exists "Admins can view inquiries" on public.inquiries;
create policy "Admins can view inquiries"
on public.inquiries for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can update inquiries" on public.inquiries;
create policy "Admins can update inquiries"
on public.inquiries for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can view admin users" on public.admin_users;
create policy "Admins can view admin users"
on public.admin_users for select
to authenticated
using (public.is_admin());

-- Storage bucket policies. Create buckets named `audio` and `covers` in Supabase Storage first.
drop policy if exists "Public read audio" on storage.objects;
create policy "Public read audio"
on storage.objects for select
using (bucket_id = 'audio');

drop policy if exists "Public read covers" on storage.objects;
create policy "Public read covers"
on storage.objects for select
using (bucket_id = 'covers');

drop policy if exists "Admins upload audio" on storage.objects;
create policy "Admins upload audio"
on storage.objects for insert
to authenticated
with check (bucket_id = 'audio' and public.is_admin());

drop policy if exists "Admins upload covers" on storage.objects;
create policy "Admins upload covers"
on storage.objects for insert
to authenticated
with check (bucket_id = 'covers' and public.is_admin());

drop policy if exists "Admins update storage objects" on storage.objects;
create policy "Admins update storage objects"
on storage.objects for update
to authenticated
using (bucket_id in ('audio', 'covers') and public.is_admin())
with check (bucket_id in ('audio', 'covers') and public.is_admin());

drop policy if exists "Admins delete storage objects" on storage.objects;
create policy "Admins delete storage objects"
on storage.objects for delete
to authenticated
using (bucket_id in ('audio', 'covers') and public.is_admin());
