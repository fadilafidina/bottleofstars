create extension if not exists pgcrypto;

create table if not exists public.bottles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  recipient_names text not null,
  occasion_type text,
  theme text not null default 'default',
  guest_token text not null unique,
  view_token text not null unique,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  bottle_id uuid not null references public.bottles(id) on delete cascade,
  sender_name text,
  message_text text not null,
  photo_url text,
  stickers jsonb not null default '[]'::jsonb,
  star_color text not null,
  created_at timestamptz not null default timezone('utc', now()),
  opened_at timestamptz
);

create index if not exists messages_bottle_id_idx
  on public.messages (bottle_id);

create index if not exists messages_bottle_opened_idx
  on public.messages (bottle_id, opened_at);

create index if not exists bottles_slug_idx
  on public.bottles (slug);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'message-photos',
  'message-photos',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

alter table public.bottles enable row level security;
alter table public.messages enable row level security;

create policy "No direct bottle reads yet"
on public.bottles
for select
to anon, authenticated
using (false);

create policy "No direct bottle writes yet"
on public.bottles
for all
to anon, authenticated
using (false)
with check (false);

create policy "No direct message reads yet"
on public.messages
for select
to anon, authenticated
using (false);

create policy "No direct message writes yet"
on public.messages
for all
to anon, authenticated
using (false)
with check (false);
