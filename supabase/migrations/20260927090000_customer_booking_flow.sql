-- Public-safe availability and atomic guest submission for the booking MVP.
-- Candidate starts are aligned to a 30-minute grid from each day's opening time.

create function public.get_booking_slots(
  p_package_id uuid,
  p_booking_date date
)
returns table (
  time_slot time without time zone,
  is_available boolean
)
language sql
stable
security definer
set search_path = ''
as $$
  with booking_context as (
    select
      p.duration_minutes,
      a.start_time,
      a.end_time
    from public.packages as p
    join public.availability as a
      on a.day_of_week = extract(dow from p_booking_date)::smallint
    where p.id = p_package_id
      and p.is_active
      and a.is_available
      and p_booking_date >= timezone('Asia/Yangon', now())::date
      and not exists (
        select 1
        from public.blocked_dates as bd
        where bd.blocked_date = p_booking_date
      )
  ),
  candidate_slots as (
    select
      generated_slot::time as time_slot,
      bc.duration_minutes
    from booking_context as bc
    cross join lateral generate_series(
      p_booking_date + bc.start_time,
      p_booking_date + bc.end_time - make_interval(mins => bc.duration_minutes),
      interval '30 minutes'
    ) as generated_slot
  )
  select
    cs.time_slot,
    (
      p_booking_date + cs.time_slot > timezone('Asia/Yangon', now())
      and not exists (
        select 1
        from public.bookings as b
        where b.status in ('pending', 'confirmed')
          and tsrange(
            b.booking_date + b.time_slot,
            b.booking_date + b.time_slot + make_interval(mins => b.duration_minutes),
            '[)'
          ) && tsrange(
            p_booking_date + cs.time_slot,
            p_booking_date + cs.time_slot + make_interval(mins => cs.duration_minutes),
            '[)'
          )
      )
    ) as is_available
  from candidate_slots as cs
  order by cs.time_slot;
$$;

create function public.submit_booking_request(
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
  addons jsonb,
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
  v_daily_number integer;
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

  if p_social_contact is not null and char_length(p_social_contact) > 120 then
    raise exception using errcode = '22023', message = 'The social contact is too long.';
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
  for share;

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
      and mod(
        extract(epoch from (p_time_slot - a.start_time))::integer,
        1800
      ) = 0
  ) then
    raise exception using errcode = '22023', message = 'The selected time is not a valid studio slot.';
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
  for share;

  select count(*), coalesce(sum(a.price), 0)
  into v_addon_count, v_addon_total
  from public.addons as a
  where a.id = any(v_addon_ids) and a.is_active;

  if v_addon_count <> cardinality(v_addon_ids) then
    raise exception using errcode = '22023', message = 'One or more selected add-ons are unavailable.';
  end if;

  perform pg_advisory_xact_lock(
    hashtextextended('snapora-booking:' || p_booking_date::text, 0)
  );

  select coalesce(
    max(substring(b.booking_number from '([0-9]+)$')::integer),
    0
  ) + 1
  into v_daily_number
  from public.bookings as b
  where b.booking_date = p_booking_date;

  v_booking_number := format(
    'PS-%s-%s',
    to_char(p_booking_date, 'YYYYMMDD'),
    lpad(v_daily_number::text, 3, '0')
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
    coalesce(
      (
        select jsonb_agg(
          jsonb_build_object('name', a.name, 'price', ba.price)
          order by a.name
        )
        from public.booking_addons as ba
        join public.addons as a on a.id = ba.addon_id
        where ba.booking_id = v_booking_id
      ),
      '[]'::jsonb
    ),
    v_total_price,
    'pending'::public.booking_status;
exception
  when exclusion_violation then
    raise exception using
      errcode = '23P01',
      message = 'The selected time overlaps an existing booking.';
end;
$$;

revoke execute on function public.create_booking_request(
  text, text, uuid, date, time without time zone, text, text, integer, text, uuid[]
) from anon, authenticated;

revoke all on function public.get_booking_slots(uuid, date) from public;
grant execute on function public.get_booking_slots(uuid, date) to anon, authenticated;

revoke all on function public.submit_booking_request(
  text, text, uuid, date, time without time zone, text, text, integer, text, uuid[]
) from public;
grant execute on function public.submit_booking_request(
  text, text, uuid, date, time without time zone, text, text, integer, text, uuid[]
) to anon, authenticated;

comment on function public.get_booking_slots is
  'Returns public-safe 30-minute candidate starts and availability for one package/date.';
comment on function public.submit_booking_request is
  'Atomically validates and creates a pending guest booking with authoritative price snapshots.';
