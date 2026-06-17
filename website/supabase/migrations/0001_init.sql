-- ============================================================
-- آکادمی اوج — اسکیمای پایه (profiles, packages, slots, bookings, payments)
-- + اسکلت آینده (webinars, courses, enrollments)
-- ============================================================

-- ---------- helper: تشخیص مدیر ----------
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ---------- profiles ----------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  phone       text,
  role        text not null default 'user' check (role in ('user','admin')),
  created_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own_or_admin" on public.profiles
  for select using (auth.uid() = id or public.is_admin());
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- ساخت خودکار profile هنگام ثبت‌نام
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'phone'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- consultation_packages ----------
create table if not exists public.consultation_packages (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  title_fa        text not null,
  title_en        text not null,
  description_fa  text,
  description_en  text,
  duration_min    int not null default 60,
  sessions_count  int not null default 1,
  price_toman     bigint not null,
  is_active       boolean not null default true,
  sort_order      int not null default 0,
  created_at      timestamptz not null default now()
);

alter table public.consultation_packages enable row level security;

create policy "packages_public_read" on public.consultation_packages
  for select using (is_active = true or public.is_admin());
create policy "packages_admin_write" on public.consultation_packages
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- availability_slots ----------
create table if not exists public.availability_slots (
  id          uuid primary key default gen_random_uuid(),
  start_at    timestamptz not null,
  end_at      timestamptz not null,
  status      text not null default 'open' check (status in ('open','held','booked')),
  held_until  timestamptz,
  created_at  timestamptz not null default now()
);

alter table public.availability_slots enable row level security;

-- خواندن عمومی فقط اسلات‌های باز؛ مدیر همه را می‌بیند
create policy "slots_public_read_open" on public.availability_slots
  for select using (status = 'open' or public.is_admin());
create policy "slots_admin_write" on public.availability_slots
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- bookings ----------
create table if not exists public.bookings (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  package_id     uuid not null references public.consultation_packages(id),
  slot_id        uuid references public.availability_slots(id),
  meeting_type   text not null default 'online',
  status         text not null default 'pending' check (status in ('pending','paid','confirmed','cancelled')),
  amount_toman   bigint not null,
  gcal_event_id  text,
  meet_link      text,
  created_at     timestamptz not null default now()
);

alter table public.bookings enable row level security;

-- کاربر فقط رزروهای خودش را می‌بیند؛ مدیر همه را
create policy "bookings_select_own_or_admin" on public.bookings
  for select using (auth.uid() = user_id or public.is_admin());
-- درج/تغییر وضعیت پرداخت فقط سمت سرور با service role انجام می‌شود (RLS را دور می‌زند).

-- ---------- payments ----------
create table if not exists public.payments (
  id           uuid primary key default gen_random_uuid(),
  booking_id   uuid not null references public.bookings(id) on delete cascade,
  gateway      text not null default 'zarinpal',
  authority    text,
  ref_id       text,
  amount_toman bigint not null,
  status       text not null default 'pending' check (status in ('pending','success','failed')),
  created_at   timestamptz not null default now()
);

alter table public.payments enable row level security;

create policy "payments_select_via_owner_or_admin" on public.payments
  for select using (
    public.is_admin()
    or exists (
      select 1 from public.bookings b
      where b.id = payments.booking_id and b.user_id = auth.uid()
    )
  );
-- نوشتن فقط با service role.

-- ============================================================
-- اسکلت آینده: وبینار و کلاس آنلاین (UI بعداً اضافه می‌شود)
-- ============================================================
create table if not exists public.webinars (
  id           uuid primary key default gen_random_uuid(),
  title_fa     text not null,
  title_en     text,
  description  text,
  starts_at    timestamptz,
  price_toman  bigint not null default 0,
  is_published boolean not null default false,
  created_at   timestamptz not null default now()
);
alter table public.webinars enable row level security;
create policy "webinars_public_read" on public.webinars
  for select using (is_published = true or public.is_admin());
create policy "webinars_admin_write" on public.webinars
  for all using (public.is_admin()) with check (public.is_admin());

create table if not exists public.courses (
  id           uuid primary key default gen_random_uuid(),
  title_fa     text not null,
  title_en     text,
  description  text,
  price_toman  bigint not null default 0,
  is_published boolean not null default false,
  created_at   timestamptz not null default now()
);
alter table public.courses enable row level security;
create policy "courses_public_read" on public.courses
  for select using (is_published = true or public.is_admin());
create policy "courses_admin_write" on public.courses
  for all using (public.is_admin()) with check (public.is_admin());

create table if not exists public.enrollments (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  course_id   uuid references public.courses(id),
  webinar_id  uuid references public.webinars(id),
  status      text not null default 'active',
  created_at  timestamptz not null default now()
);
alter table public.enrollments enable row level security;
create policy "enrollments_select_own_or_admin" on public.enrollments
  for select using (auth.uid() = user_id or public.is_admin());

-- ============================================================
-- داده‌های نمونه — پکیج‌های مشاوره (قابل ویرایش از پنل/Supabase)
-- ============================================================
insert into public.consultation_packages
  (slug, title_fa, title_en, description_fa, description_en, duration_min, sessions_count, price_toman, sort_order)
values
  ('single-60', 'جلسهٔ مشاورهٔ تکی', 'Single consultation', 'یک جلسهٔ ۶۰ دقیقه‌ای آنلاین برای کشیدن نقشهٔ رشد کلینیک.', 'A 60-minute online session to map your clinic growth.', 60, 1, 2500000, 1),
  ('deep-90', 'جلسهٔ عمیق', 'Deep-dive session', 'جلسهٔ ۹۰ دقیقه‌ای برای بررسی دقیق سیستم، فروش و تیم.', 'A 90-minute deep session on system, sales and team.', 90, 1, 3800000, 2),
  ('pack-3', 'بستهٔ ۳ جلسه‌ای', '3-session package', 'سه جلسهٔ مشاوره برای پیاده‌سازی گام‌به‌گام نقشهٔ رشد.', 'Three sessions for step-by-step growth implementation.', 60, 3, 6500000, 3)
on conflict (slug) do nothing;
