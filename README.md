# Snapora MVP

Single-studio photography website, guest booking, and authenticated studio admin. See `prd.md` for product requirements.

## Run locally

1. Use Node.js 20.9+ and run `npm install`.
2. Copy `.env.example` to `.env.local`. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` for your Supabase project. Do not add a service-role key.
3. Apply the SQL files in `supabase/migrations/` to that project in filename order. A Supabase CLI linked to the project can run `supabase db push`; the SQL editor can also run each file in order.
4. In a **development or test project only**, run `supabase/seed.sql` after migrations to add sample packages, add-ons, weekly hours, and one blocked date. These records have natural public names but are still sample data: replace them before launch and never run this seed against a live studio catalog. It does not create customer bookings, portfolio photos, or an admin account.
5. In the Supabase dashboard, create an admin user under **Authentication → Users** with an email and password you control. Copy that user's UUID. In the SQL editor, insert a matching row into `public.admin_profiles` using that UUID and email (replace the placeholders):

   ```sql
   insert into public.admin_profiles (id, email, name)
   values ('AUTH_USER_UUID', 'admin@example.com', 'Studio Admin');
   ```

6. Run `npm run dev` and open `/admin/login`. Sign in with the Auth email and password from step 5. The dashboard and management pages require both a valid Auth session and the matching `admin_profiles` row. Use `/admin/settings` to set real studio details and `/admin/portfolio` to upload approved photographs. Until you submit a guest booking at `/book`, booking dashboard counts will correctly show zero.

No admin email or password is stored in the repository or seed. While the portfolio is empty, the public site shows credited [licensed reference images](public/images/editorial/SOURCES.md) clearly identified as illustrative, not as studio work. Published Supabase portfolio images replace that preview.

## Checks

Run `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build`.

Booking dates and times use the studio's Asia/Yangon timezone. Public availability is advisory; the Supabase booking function revalidates inputs and PostgreSQL prevents overlapping pending or confirmed sessions. New guest requests remain pending until an admin confirms them.

## Deployment

Apply migrations before deploying the matching code. Configure the same two public environment variable names in Vercel, using the appropriate Supabase project for each environment. Confirm RLS, the portfolio bucket, admin authorization, and a real test booking before release. Keep `supabase/seed.sql` out of production.
