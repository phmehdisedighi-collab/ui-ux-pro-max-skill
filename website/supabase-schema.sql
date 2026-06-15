-- AI Consultant Website — Supabase Schema
-- Run this in the Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles (extends auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Services (consultation types)
create table public.services (
  id uuid default uuid_generate_v4() primary key,
  name_fa text not null,
  name_en text not null,
  description_fa text not null,
  description_en text not null,
  duration_minutes integer not null,
  price integer not null, -- in Toman
  is_active boolean default true not null,
  created_at timestamptz default now() not null
);

-- Available time slots (set by admin)
create table public.available_slots (
  id uuid default uuid_generate_v4() primary key,
  service_id uuid references public.services(id) on delete cascade not null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  is_booked boolean default false not null,
  created_at timestamptz default now() not null
);

-- Bookings
create table public.bookings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  service_id uuid references public.services(id) not null,
  slot_id uuid references public.available_slots(id) not null,
  platform text check (platform in ('google_meet', 'zoom')) not null,
  meeting_link text,
  notes text,
  status text check (status in ('pending', 'confirmed', 'completed', 'cancelled')) default 'pending' not null,
  payment_id uuid,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Payments
create table public.payments (
  id uuid default uuid_generate_v4() primary key,
  booking_id uuid references public.bookings(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  amount integer not null, -- in Toman
  authority text,
  ref_id text,
  status text check (status in ('pending', 'success', 'failed')) default 'pending' not null,
  gateway text check (gateway in ('zarinpal')) default 'zarinpal' not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Webinars (for future use)
create table public.webinars (
  id uuid default uuid_generate_v4() primary key,
  title_fa text not null,
  title_en text not null,
  description_fa text,
  description_en text,
  price integer default 0 not null,
  max_participants integer,
  starts_at timestamptz not null,
  duration_minutes integer not null,
  recording_url text,
  is_published boolean default false not null,
  created_at timestamptz default now() not null
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.services enable row level security;
alter table public.available_slots enable row level security;
alter table public.bookings enable row level security;
alter table public.payments enable row level security;
alter table public.webinars enable row level security;

-- Policies
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Anyone can view active services" on public.services for select using (is_active = true);

create policy "Anyone can view available slots" on public.available_slots for select using (true);

create policy "Users can view own bookings" on public.bookings for select using (auth.uid() = user_id);
create policy "Users can insert own bookings" on public.bookings for insert with check (auth.uid() = user_id);

create policy "Users can view own payments" on public.payments for select using (auth.uid() = user_id);

create policy "Anyone can view published webinars" on public.webinars for select using (is_published = true);

-- Seed: Default services
insert into public.services (name_fa, name_en, description_fa, description_en, duration_minutes, price) values
  ('جلسه ۳۰ دقیقه‌ای', '30-Minute Session', 'بررسی سریع استراتژی یا پرسش‌وپاسخ تخصصی', 'Quick strategy review or focused Q&A', 30, 990000),
  ('جلسه ۶۰ دقیقه‌ای', '60-Minute Session', 'مشاوره عمیق و برنامه‌ریزی نقشه راه', 'Deep-dive consultation and roadmap planning', 60, 1790000);
