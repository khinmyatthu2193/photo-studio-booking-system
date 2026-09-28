# Snapora

**Photography Studio Booking Platform**

Snapora is a modern web application for a single photography studio, combining a photography-focused public website with a simple guest booking experience and an authenticated studio admin dashboard.

Customers can explore the studio's portfolio, compare photoshoot packages, select an available date and time, add optional services, and submit a booking request without creating an account.

Studio staff can manage bookings, packages, add-ons, portfolio images, and studio availability from a protected admin dashboard.

> **MVP:** Built for one photography studio. No multi-vendor or marketplace functionality.

---

## ✨ Features

### Customer Experience

* 📸 Photography-focused studio website
* 🖼️ Portfolio and gallery
* 📦 Photoshoot packages
* 📅 Date and time availability
* ➕ Optional add-ons
* 📝 Guest booking — no account required
* 💰 Automatic booking total calculation
* 📋 Booking review before submission
* ✅ Booking confirmation with booking number
* 📱 Mobile-first booking experience

### Studio Admin

* 🔐 Supabase authentication
* 📊 Dashboard overview
* 📋 Booking management
* 📅 Calendar view
* 📦 Package management
* ➕ Add-on management
* 🖼️ Portfolio management
* 🕐 Weekly studio availability
* 🚫 Block specific dates
* 🔄 Booking status management

### Booking Workflow

```text
Browse Studio
      ↓
Choose Package
      ↓
Choose Date
      ↓
Choose Time
      ↓
Select Add-ons
      ↓
Enter Contact Information
      ↓
Review Booking
      ↓
Submit Request
      ↓
Booking Confirmation
      ↓
Studio Confirms Booking
```

Customer submissions are created as **Pending** booking requests. A booking does not become confirmed until the studio approves it.

---

## 🛠️ Tech Stack

| Technology       | Purpose                           |
| ---------------- | --------------------------------- |
| **Next.js**      | Full-stack React framework        |
| **TypeScript**   | Type-safe development             |
| **Tailwind CSS** | Styling and responsive UI         |
| **Supabase**     | PostgreSQL, Auth, Storage and RLS |
| **Vercel**       | Deployment                        |
| **Lucide React** | Icons                             |

### Architecture

```text
Next.js App Router
        │
        ├── Public Website
        │      ├── Home
        │      ├── Portfolio
        │      ├── Packages
        │      └── Booking
        │
        ├── Customer Booking
        │      └── Guest Checkout
        │
        └── Admin Dashboard
               ├── Bookings
               ├── Calendar
               ├── Packages
               ├── Add-ons
               ├── Portfolio
               ├── Availability
               └── Settings
                        │
                        ▼
                   Supabase
              ┌─────────┼─────────┐
              │         │         │
          PostgreSQL   Auth     Storage
              │
             RLS
```

---

## 🔒 Booking & Security

Booking availability is checked on the client for a responsive user experience, but **client-side availability is never trusted for booking creation**.

When a customer submits a booking, the server/database revalidates:

* Package availability
* Add-on validity
* Booking date
* Blocked dates
* Studio availability
* Selected time slot
* Booking conflicts

PostgreSQL prevents overlapping **Pending** or **Confirmed** sessions.

Cancelled bookings do not continue to occupy the time slot.

All customer bookings remain private. Public users cannot access the booking database.

The admin area requires:

1. A valid Supabase Auth session
2. A matching `admin_profiles` record
3. Appropriate Row Level Security permissions

> **Security:** Never expose a Supabase service-role key to the browser or commit it to the repository.

---

## 📁 Project Structure

```text
snapora/
├── public/
│   └── images/
│
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── portfolio/
│   │   ├── packages/
│   │   ├── book/
│   │   ├── booking/
│   │   └── admin/
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── booking/
│   │   ├── portfolio/
│   │   ├── packages/
│   │   └── admin/
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   ├── validations/
│   │   └── utils/
│   │
│   ├── types/
│   └── config/
│
├── supabase/
│   ├── migrations/
│   └── seed.sql
│
├── prd.md
├── AGENTS.md
├── .env.example
└── README.md
```

---

## 🚀 Getting Started

### Requirements

* Node.js **20.9+**
* A Supabase project
* npm

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Configure:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Only public Supabase configuration belongs in these variables.

**Never add a service-role key to the frontend or commit secrets to Git.**

---

## 🗄️ Database Setup

Apply the migrations in:

```text
supabase/migrations/
```

in filename order.

If the Supabase CLI is linked to your project:

```bash
supabase db push
```

Alternatively, run the migration SQL files through the Supabase SQL Editor.

### Development Seed Data

For a development or test project, you can optionally run:

```text
supabase/seed.sql
```

The seed provides sample:

* Packages
* Add-ons
* Weekly availability
* Blocked dates

The seed does **not** create:

* Customer bookings
* Portfolio photographs
* Admin accounts

> Do not run `seed.sql` against a production studio database.

Replace sample catalog data before launching the application.

---

## 👤 Admin Setup

Create an admin user in:

**Supabase Dashboard → Authentication → Users**

Create an email and password that you control.

Then copy the user's UUID and create the matching admin profile:

```sql
insert into public.admin_profiles (id, email, name)
values (
  'AUTH_USER_UUID',
  'admin@example.com',
  'Studio Admin'
);
```

The admin dashboard requires both:

* A valid Supabase Auth session
* A matching `admin_profiles` record

After setup, open:

```text
/admin/login
```

and sign in.

---

## ▶️ Run Locally

Start the development server:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

### Main Routes

#### Public

```text
/
 /portfolio
 /packages
 /book
 /booking/success
 /about
 /contact
```

#### Admin

```text
/admin/login
/admin
/admin/bookings
/admin/bookings/[id]
/admin/calendar
/admin/packages
/admin/addons
/admin/portfolio
/admin/availability
/admin/settings
```

---

## 🧪 Development Checks

Run the complete verification suite:

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

The application should pass all checks before deployment.

---

## 🕐 Timezone

Booking dates and times use the studio's:

```text
Asia/Yangon
```

The booking system should consistently interpret and validate studio availability using this timezone.

---

## 🖼️ Portfolio Images

Portfolio images are stored using **Supabase Storage**.

When the portfolio database is empty, the public website may display clearly labeled licensed reference imagery for development purposes.

These images are **illustrative only and do not represent the studio's actual work**.

Once approved studio photographs are uploaded through:

```text
/admin/portfolio
```

the published Supabase portfolio images replace the development previews.

---

## 📊 Booking Status

Bookings follow this lifecycle:

```text
Pending
   │
   ▼
Confirmed
   │
   ▼
Completed
```

Cancellation can occur from:

```text
Pending ──────► Cancelled
Confirmed ────► Cancelled
```

Customer submission creates a **Pending** request.

The studio must explicitly confirm the request.

---

## 🎯 MVP Scope

Snapora intentionally keeps the first version small.

### Included

* Single photography studio
* Public studio website
* Portfolio
* Packages
* Add-ons
* Guest booking
* Availability management
* Booking conflict protection
* Admin authentication
* Booking management
* Calendar
* Portfolio management
* Supabase Storage
* PostgreSQL + RLS
* Vercel deployment

### Not Included

* Multiple studios
* Photographer marketplace
* Customer accounts
* Online payment gateway
* Customer photo delivery
* Private client galleries
* AI photo editing
* AI pose recommendations
* Real-time chat
* SMS/Viber/Telegram notifications
* Complex accounting
* Multi-branch management

Keeping these outside the MVP helps maintain a focused and maintainable product.

---

## 🌱 Future Possibilities

Potential future versions could introduce:

* Email booking notifications
* Deposit tracking
* Customer booking history
* Rescheduling and cancellation policies
* Customer accounts
* Private photo galleries
* Photo selection and favorites
* Final photo downloads
* AI-assisted shoot planning
* Analytics

These features are intentionally excluded from the MVP.

---

## 🚢 Deployment

Snapora can be deployed to **Vercel** with Supabase as its backend.

Before deployment:

1. Apply all Supabase migrations.
2. Configure the required environment variables.
3. Verify RLS policies.
4. Verify the portfolio Storage bucket and policies.
5. Create the production admin account.
6. Verify admin authorization.
7. Replace development seed/catalog data.
8. Upload approved studio photographs.
9. Submit a real test booking.
10. Confirm the booking from the admin dashboard.
11. Run the production build.

Configure the same environment variable names in Vercel:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Use the appropriate Supabase project for each environment.

**Do not run `supabase/seed.sql` against production.**

---

## 📌 Product Requirements

The complete product requirements are documented in:

```text
prd.md
```

Development instructions for Codex are documented in:

```text
AGENTS.md
```

---

## 📄 License

This project is developed as a portfolio/business application concept.
