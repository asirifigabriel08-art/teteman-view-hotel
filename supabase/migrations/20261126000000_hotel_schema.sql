create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  price_per_night integer not null check (price_per_night >= 0),
  description text not null default '',
  image_url text,
  active boolean not null default true
);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'manager',
  created_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  phone text not null,
  email text,
  room_category text not null,
  price_per_night integer not null check (price_per_night >= 0),
  check_in date not null,
  check_out date not null,
  guests integer not null check (guests between 1 and 8),
  nights integer generated always as (check_out - check_in) stored,
  estimated_total integer not null,
  special_requests text,
  status text not null default 'pending'
    check (status in ('pending','confirmed','checked_in','checked_out','cancelled')),
  check (check_out > check_in)
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  author text not null,
  rating integer not null check (rating between 1 and 5),
  text text not null,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  image_url text not null,
  alt_text text not null,
  sort_order integer not null default 0
);

alter table public.rooms enable row level security;
alter table public.bookings enable row level security;
alter table public.admin_users enable row level security;
alter table public.reviews enable row level security;
alter table public.gallery_images enable row level security;

create or replace function public.is_hotel_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

create policy "Public room information" on public.rooms
  for select using (active);

create policy "Administrators manage rooms" on public.rooms
  for all using (public.is_hotel_admin()) with check (public.is_hotel_admin());

create policy "Administrators manage bookings" on public.bookings
  for all using (public.is_hotel_admin()) with check (public.is_hotel_admin());

create policy "Administrators manage users" on public.admin_users
  for all using (public.is_hotel_admin()) with check (public.is_hotel_admin());

create policy "Approved reviews are public" on public.reviews
  for select using (approved);

create policy "Administrators manage reviews" on public.reviews
  for all using (public.is_hotel_admin()) with check (public.is_hotel_admin());

create policy "Gallery is public" on public.gallery_images
  for select using (true);

create policy "Administrators manage gallery" on public.gallery_images
  for all using (public.is_hotel_admin()) with check (public.is_hotel_admin());

insert into public.rooms (slug,name,price_per_night) values
  ('economy','Economy Room',250),
  ('standard','Standard Room',400),
  ('executive','Executive Room',500)
on conflict (slug) do update set name=excluded.name, price_per_night=excluded.price_per_night;
