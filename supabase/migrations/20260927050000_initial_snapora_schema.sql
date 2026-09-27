-- Snapora single-studio MVP schema.
-- Booking dates and times use the studio's Asia/Yangon wall-clock timezone.

create extension if not exists pgcrypto with schema extensions;

create schema if not exists private;
revoke all on schema private from public;

create type public.booking_status as enum (
  'pending',
  'confirmed',
  'completed',
  'cancelled'
);

create type public.portfolio_category as enum (
  'portrait',
  'graduation',
  'couple',
  'family',
  'wedding',
  'birthday',
  'product',
  'other'
);

create sequence public.booking_number_seq;

create table public.admin_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  name text not null,
  created_at timestamptz not null default now(),
  constraint admin_profiles_email_valid check (
    char_length(email) between 3 and 254 and position('@' in email) > 1
  ),
  constraint admin_profiles_name_valid check (
    char_length(btrim(name)) between 1 and 120
  )
);

create unique index admin_profiles_email_unique_idx
  on public.admin_profiles (lower(email));

create table public.packages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  price bigint not null,
  duration_minutes integer not null,
  included_photos integer not null default 0,
  included_outfits integer not null default 0,
  included_locations integer not null default 0,
  image_url text,
  is_active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint packages_name_valid check (char_length(btrim(name)) between 1 and 120),
  constraint packages_price_valid check (price >= 0),
  constraint packages_duration_valid check (duration_minutes between 15 and 1440),
  constraint packages_included_photos_valid check (included_photos >= 0),
  constraint packages_included_outfits_valid check (included_outfits >= 0),
  constraint packages_included_locations_valid check (included_locations >= 0),
  constraint packages_display_order_valid check (display_order >= 0)
);

create index packages_public_order_idx
  on public.packages (display_order, name)
  where is_active;

create table public.addons (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  price bigint not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint addons_name_valid check (char_length(btrim(name)) between 1 and 120),
  constraint addons_price_valid check (price >= 0)
);

create index addons_public_name_idx
  on public.addons (name)
  where is_active;

create table public.portfolio (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category public.portfolio_category not null default 'other',
  description text not null default '',
  image_path text not null,
  is_featured boolean not null default false,
  is_published boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint portfolio_title_valid check (char_length(btrim(title)) between 1 and 160),
  constraint portfolio_image_path_valid check (
    image_path like 'images/%' and image_path not like '%..%'
  ),
  constraint portfolio_display_order_valid check (display_order >= 0),
  constraint portfolio_image_path_unique unique (image_path)
);

create index portfolio_public_order_idx
  on public.portfolio (is_featured desc, display_order, created_at desc)
  where is_published;

create index portfolio_public_category_idx
  on public.portfolio (category, display_order)
  where is_published;

create table public.availability (
  id uuid primary key default gen_random_uuid(),
  day_of_week smallint not null,
  start_time time without time zone,
  end_time time without time zone,
  is_available boolean not null default true,
  constraint availability_day_unique unique (day_of_week),
  constraint availability_day_valid check (day_of_week between 0 and 6),
  constraint availability_hours_valid check (
    (is_available and start_time is not null and end_time is not null and start_time < end_time)
    or
    (not is_available and start_time is null and end_time is null)
  )
);

comment on column public.availability.day_of_week is
  'PostgreSQL day number: Sunday = 0 through Saturday = 6.';

create table public.blocked_dates (
  id uuid primary key default gen_random_uuid(),
  blocked_date date not null,
  reason text not null default '',
  created_at timestamptz not null default now(),
  constraint blocked_dates_date_unique unique (blocked_date),
  constraint blocked_dates_reason_valid check (char_length(reason) <= 500)
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  booking_number text not null,
  customer_name text not null,
  phone text not null,
  email text,
  social_contact text,
  people_count integer,
  package_id uuid not null references public.packages (id) on delete restrict,
  package_price bigint not null,
  booking_date date not null,
  time_slot time without time zone not null,
  duration_minutes integer not null,
  special_request text,
  total_price bigint not null,
  status public.booking_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bookings_number_unique unique (booking_number),
  constraint bookings_customer_name_valid check (
    char_length(btrim(customer_name)) between 1 and 120
  ),
  constraint bookings_phone_valid check (char_length(btrim(phone)) between 5 and 32),
  constraint bookings_email_valid check (
    email is null or (char_length(email) <= 254 and position('@' in email) > 1)
  ),
  constraint bookings_social_contact_valid check (
    social_contact is null or char_length(social_contact) <= 120
  ),
  constraint bookings_people_count_valid check (people_count is null or people_count > 0),
  constraint bookings_package_price_valid check (package_price >= 0),
  constraint bookings_duration_valid check (duration_minutes between 15 and 1440),
  constraint bookings_special_request_valid check (
    special_request is null or char_length(special_request) <= 2000
  ),
  constraint bookings_total_price_valid check (total_price >= package_price),
  constraint bookings_end_same_day check (
    booking_date + time_slot + make_interval(mins => duration_minutes) < booking_date + 1
  )
);

alter table public.bookings
  add constraint bookings_active_time_exclusion
  exclude using gist (
    tsrange(
      booking_date + time_slot,
      booking_date + time_slot + make_interval(mins => duration_minutes),
      '[)'
    ) with &&
  )
  where (status in ('pending', 'confirmed'));

create index bookings_schedule_idx
  on public.bookings (booking_date, time_slot, status);

create index bookings_created_at_idx
  on public.bookings (created_at desc);

create index bookings_package_id_idx
  on public.bookings (package_id);

create table public.booking_addons (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings (id) on delete cascade,
  addon_id uuid not null references public.addons (id) on delete restrict,
  price bigint not null,
  constraint booking_addons_unique unique (booking_id, addon_id),
  constraint booking_addons_price_valid check (price >= 0)
);

create index booking_addons_addon_id_idx
  on public.booking_addons (addon_id);

create function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_profiles
    where id = (select auth.uid())
  );
$$;

create function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = statement_timestamp();
  return new;
end;
$$;

create trigger packages_set_updated_at
before update on public.packages
for each row execute function private.set_updated_at();

create trigger bookings_set_updated_at
before update on public.bookings
for each row execute function private.set_updated_at();

create function private.enforce_booking_update()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.id is distinct from old.id
    or new.booking_number is distinct from old.booking_number
    or new.customer_name is distinct from old.customer_name
    or new.phone is distinct from old.phone
    or new.email is distinct from old.email
    or new.social_contact is distinct from old.social_contact
    or new.people_count is distinct from old.people_count
    or new.package_id is distinct from old.package_id
    or new.package_price is distinct from old.package_price
    or new.booking_date is distinct from old.booking_date
    or new.time_slot is distinct from old.time_slot
    or new.duration_minutes is distinct from old.duration_minutes
    or new.special_request is distinct from old.special_request
    or new.total_price is distinct from old.total_price
    or new.created_at is distinct from old.created_at
  then
    raise exception using
      errcode = '23514',
      message = 'Booking details are immutable after creation.';
  end if;

  if new.status is distinct from old.status and not (
    (old.status = 'pending' and new.status in ('confirmed', 'cancelled'))
    or
    (old.status = 'confirmed' and new.status in ('completed', 'cancelled'))
  ) then
    raise exception using
      errcode = '23514',
      message = 'Invalid booking status transition.';
  end if;

  return new;
end;
$$;

create trigger bookings_enforce_update
before update on public.bookings
for each row execute function private.enforce_booking_update();

create function public.create_booking_request(
  p_customer_name text,
  p_phone text,
  p_package_id uuid,
  p_booking_date date,
  p_time_slot time without time zone,
  p_email text default null,
  p_social_contact text default null,
  p_people_count integer default null,
  p_special_request text default null,
  p_addon_ids uuid[] default '{}'::uuid[]
)
returns table (
  booking_id uuid,
  booking_number text,
  booking_date date,
  time_slot time without time zone,
  package_name text,
  total_price bigint,
  status public.booking_status
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_addon_count integer;
  v_addon_ids uuid[] := coalesce(p_addon_ids, '{}'::uuid[]);
  v_addon_total bigint := 0;
  v_booking_id uuid;
  v_booking_number text;
  v_duration_minutes integer;
  v_package_name text;
  v_package_price bigint;
  v_total_price bigint;
begin
  if p_customer_name is null or char_length(btrim(p_customer_name)) not between 1 and 120 then
    raise exception using errcode = '22023', message = 'A valid customer name is required.';
  end if;

  if p_phone is null or char_length(btrim(p_phone)) not between 5 and 32 then
    raise exception using errcode = '22023', message = 'A valid phone number is required.';
  end if;

  if p_booking_date is null or p_time_slot is null then
    raise exception using errcode = '22023', message = 'A booking date and time are required.';
  end if;

  if p_booking_date + p_time_slot <= timezone('Asia/Yangon', now()) then
    raise exception using errcode = '22023', message = 'The booking time must be in the future.';
  end if;

  if p_email is not null and (
    char_length(p_email) > 254 or position('@' in p_email) <= 1
  ) then
    raise exception using errcode = '22023', message = 'The email address is invalid.';
  end if;

  if p_people_count is not null and p_people_count <= 0 then
    raise exception using errcode = '22023', message = 'People count must be positive.';
  end if;

  if p_special_request is not null and char_length(p_special_request) > 2000 then
    raise exception using errcode = '22023', message = 'The special request is too long.';
  end if;

  select p.name, p.price, p.duration_minutes
  into v_package_name, v_package_price, v_duration_minutes
  from public.packages as p
  where p.id = p_package_id and p.is_active
  for key share;

  if not found then
    raise exception using errcode = '22023', message = 'The selected package is unavailable.';
  end if;

  if exists (
    select 1
    from public.blocked_dates as bd
    where bd.blocked_date = p_booking_date
  ) then
    raise exception using errcode = '22023', message = 'The studio is unavailable on this date.';
  end if;

  if not exists (
    select 1
    from public.availability as a
    where a.day_of_week = extract(dow from p_booking_date)::smallint
      and a.is_available
      and p_time_slot >= a.start_time
      and p_booking_date + p_time_slot + make_interval(mins => v_duration_minutes)
        <= p_booking_date + a.end_time
  ) then
    raise exception using errcode = '22023', message = 'The selected time is outside studio availability.';
  end if;

  if exists (select 1 from unnest(v_addon_ids) as addon_id where addon_id is null)
    or cardinality(v_addon_ids) <> (
      select count(distinct addon_id)
      from unnest(v_addon_ids) as addon_id
    )
  then
    raise exception using errcode = '22023', message = 'Add-ons must be unique and valid.';
  end if;

  perform 1
  from public.addons as a
  where a.id = any(v_addon_ids) and a.is_active
  for key share;

  select count(*), coalesce(sum(a.price), 0)
  into v_addon_count, v_addon_total
  from public.addons as a
  where a.id = any(v_addon_ids) and a.is_active;

  if v_addon_count <> cardinality(v_addon_ids) then
    raise exception using errcode = '22023', message = 'One or more selected add-ons are unavailable.';
  end if;

  v_booking_number := format(
    'PS-%s-%s',
    to_char(p_booking_date, 'YYYYMMDD'),
    lpad(nextval('public.booking_number_seq')::text, 6, '0')
  );
  v_total_price := v_package_price + v_addon_total;

  insert into public.bookings (
    booking_number,
    customer_name,
    phone,
    email,
    social_contact,
    people_count,
    package_id,
    package_price,
    booking_date,
    time_slot,
    duration_minutes,
    special_request,
    total_price,
    status
  ) values (
    v_booking_number,
    btrim(p_customer_name),
    btrim(p_phone),
    nullif(btrim(p_email), ''),
    nullif(btrim(p_social_contact), ''),
    p_people_count,
    p_package_id,
    v_package_price,
    p_booking_date,
    p_time_slot,
    v_duration_minutes,
    nullif(btrim(p_special_request), ''),
    v_total_price,
    'pending'
  )
  returning id into v_booking_id;

  insert into public.booking_addons (booking_id, addon_id, price)
  select v_booking_id, a.id, a.price
  from public.addons as a
  where a.id = any(v_addon_ids);

  return query
  select
    v_booking_id,
    v_booking_number,
    p_booking_date,
    p_time_slot,
    v_package_name,
    v_total_price,
    'pending'::public.booking_status;
exception
  when exclusion_violation then
    raise exception using
      errcode = '23P01',
      message = 'The selected time overlaps an existing booking.';
end;
$$;

alter table public.admin_profiles enable row level security;
alter table public.packages enable row level security;
alter table public.addons enable row level security;
alter table public.portfolio enable row level security;
alter table public.bookings enable row level security;
alter table public.booking_addons enable row level security;
alter table public.availability enable row level security;
alter table public.blocked_dates enable row level security;

create policy "Admins can read their own profile"
on public.admin_profiles for select
to authenticated
using ((select auth.uid()) = id);

create policy "Admins can update their own profile"
on public.admin_profiles for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "Public can read active packages"
on public.packages for select
to anon, authenticated
using (is_active);

create policy "Admins can manage packages"
on public.packages for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "Public can read active add-ons"
on public.addons for select
to anon, authenticated
using (is_active);

create policy "Admins can manage add-ons"
on public.addons for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "Public can read published portfolio"
on public.portfolio for select
to anon, authenticated
using (is_published);

create policy "Admins can manage portfolio"
on public.portfolio for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "Admins can read bookings"
on public.bookings for select
to authenticated
using ((select private.is_admin()));

create policy "Admins can update booking status"
on public.bookings for update
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "Admins can read booking add-ons"
on public.booking_addons for select
to authenticated
using ((select private.is_admin()));

create policy "Public can read availability"
on public.availability for select
to anon, authenticated
using (true);

create policy "Admins can manage availability"
on public.availability for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "Public can read blocked dates"
on public.blocked_dates for select
to anon, authenticated
using (true);

create policy "Admins can manage blocked dates"
on public.blocked_dates for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

revoke all on table public.admin_profiles from anon, authenticated;
revoke all on table public.packages from anon, authenticated;
revoke all on table public.addons from anon, authenticated;
revoke all on table public.portfolio from anon, authenticated;
revoke all on table public.bookings from anon, authenticated;
revoke all on table public.booking_addons from anon, authenticated;
revoke all on table public.availability from anon, authenticated;
revoke all on table public.blocked_dates from anon, authenticated;
revoke all on sequence public.booking_number_seq from anon, authenticated;

grant usage on schema private to authenticated;
grant execute on function private.is_admin() to authenticated;

grant select on table public.admin_profiles to authenticated;
grant update (name) on table public.admin_profiles to authenticated;

grant select on table public.packages, public.addons, public.portfolio,
  public.availability, public.blocked_dates to anon, authenticated;

grant insert, update, delete on table public.packages, public.addons,
  public.portfolio, public.availability, public.blocked_dates to authenticated;

grant select on table public.bookings, public.booking_addons to authenticated;
grant update (status) on table public.bookings to authenticated;

revoke execute on function public.create_booking_request(
  text, text, uuid, date, time without time zone, text, text, integer, text, uuid[]
) from public;
grant execute on function public.create_booking_request(
  text, text, uuid, date, time without time zone, text, text, integer, text, uuid[]
) to anon, authenticated;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
) values (
  'portfolio',
  'portfolio',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']::text[]
)
on conflict (id) do nothing;

create policy "Portfolio images are publicly readable"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'portfolio');

create policy "Admins can upload portfolio images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'portfolio'
  and (select private.is_admin())
  and (storage.foldername(name))[1] = 'images'
);

create policy "Admins can update portfolio images"
on storage.objects for update
to authenticated
using (
  bucket_id = 'portfolio'
  and (select private.is_admin())
)
with check (
  bucket_id = 'portfolio'
  and (select private.is_admin())
  and (storage.foldername(name))[1] = 'images'
);

create policy "Admins can delete portfolio images"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'portfolio'
  and (select private.is_admin())
);

comment on table public.bookings is
  'Guest booking requests. Customer fields are private and readable only by authorized admins.';
comment on column public.bookings.package_price is
  'Package price snapshot in integer MMK at booking time.';
comment on column public.bookings.duration_minutes is
  'Package duration snapshot used for overlap protection.';
comment on column public.booking_addons.price is
  'Add-on price snapshot in integer MMK at booking time.';
comment on function public.create_booking_request is
  'Creates a pending guest booking atomically from authoritative catalog and availability data.';
