create table public.studio_settings (
  id text primary key default 'default' check (id = 'default'),
  studio_name text not null default 'Snapora Photography Studio' check (char_length(btrim(studio_name)) between 1 and 160),
  description text,
  address text,
  phone text,
  email text,
  hours text,
  updated_at timestamptz not null default now()
);
create trigger studio_settings_set_updated_at before update on public.studio_settings
for each row execute function private.set_updated_at();
alter table public.studio_settings enable row level security;
create policy "Public can read studio settings" on public.studio_settings for select to anon, authenticated using (true);
create policy "Admins can manage studio settings" on public.studio_settings for all to authenticated
using ((select private.is_admin())) with check ((select private.is_admin()));
revoke all on table public.studio_settings from anon, authenticated;
grant select on table public.studio_settings to anon, authenticated;
grant insert, update on table public.studio_settings to authenticated;
insert into public.studio_settings (id, studio_name) values ('default', 'Snapora Photography Studio');
