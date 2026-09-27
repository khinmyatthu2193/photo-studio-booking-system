-- Snapora development/test seed data.
-- Apply only after all migrations, and only to a non-production Supabase project.
-- Sample content for local/test use only; replace it before launch.
-- Re-running this file updates only the fixed sample IDs below and the sample studio description.

update public.studio_settings
set description = 'A portrait-focused studio experience for previewing Snapora. Replace this text with your real studio introduction before launch.'
where id = 'default'
  and (
    description is null
    or description like '[TEST]%'
    or description like '[DEMO]%'
    or description = 'A portrait-focused studio experience for previewing Snapora. Replace this text with your real studio introduction before launch.'
  );

insert into public.packages (
  id,
  name,
  description,
  price,
  duration_minutes,
  included_photos,
  included_outfits,
  included_locations,
  is_active,
  display_order
) values
  (
    '00000000-0000-4000-8000-000000000101',
    'Portrait Essentials',
    'A relaxed individual portrait session with one outfit and one location. Includes ten carefully edited digital photographs.',
    80000,
    60,
    10,
    1,
    1,
    true,
    1
  ),
  (
    '00000000-0000-4000-8000-000000000102',
    'Couples Story',
    'A longer session for two people, with time for two outfits at one location. Includes eighteen edited digital photographs.',
    130000,
    90,
    18,
    2,
    1,
    true,
    2
  ),
  (
    '00000000-0000-4000-8000-000000000103',
    'Graduation Portraits',
    'A graduation portrait session for one person, with one outfit and one location. Includes twelve edited digital photographs.',
    95000,
    60,
    12,
    1,
    1,
    true,
    3
  )
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  duration_minutes = excluded.duration_minutes,
  included_photos = excluded.included_photos,
  included_outfits = excluded.included_outfits,
  included_locations = excluded.included_locations,
  is_active = excluded.is_active,
  display_order = excluded.display_order;

insert into public.addons (
  id,
  name,
  description,
  price,
  is_active
) values
  (
    '00000000-0000-4000-8000-000000000201',
    'Ten Extra Edited Photos',
    'Add ten more professionally edited digital photographs to your package.',
    15000,
    true
  ),
  (
    '00000000-0000-4000-8000-000000000202',
    'Makeup Styling',
    'Camera-ready makeup before the photography session.',
    25000,
    true
  ),
  (
    '00000000-0000-4000-8000-000000000203',
    'Outfit Change',
    'Allow time for one additional outfit during your session.',
    10000,
    true
  )
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  is_active = excluded.is_active;

insert into public.availability (
  id,
  day_of_week,
  start_time,
  end_time,
  is_available
) values
  ('00000000-0000-4000-8000-000000000300', 0, '09:00', '17:00', true),
  ('00000000-0000-4000-8000-000000000301', 1, '10:00', '18:00', true),
  ('00000000-0000-4000-8000-000000000302', 2, '10:00', '18:00', true),
  ('00000000-0000-4000-8000-000000000303', 3, null, null, false),
  ('00000000-0000-4000-8000-000000000304', 4, '10:00', '18:00', true),
  ('00000000-0000-4000-8000-000000000305', 5, '10:00', '18:00', true),
  ('00000000-0000-4000-8000-000000000306', 6, '09:00', '17:00', true)
on conflict (day_of_week) do update set
  start_time = excluded.start_time,
  end_time = excluded.end_time,
  is_available = excluded.is_available
where public.availability.id = excluded.id;

insert into public.blocked_dates (
  id,
  blocked_date,
  reason
) values (
  '00000000-0000-4000-8000-000000000401',
  timezone('Asia/Yangon', now())::date + 3,
  'Studio closed for availability testing'
)
on conflict (id) do update set
  blocked_date = excluded.blocked_date,
  reason = excluded.reason;
