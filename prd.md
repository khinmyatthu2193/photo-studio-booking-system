# Photo Studio Booking System — Product Requirements Document

**Project Type:** Mini Business Web Application
**Target Business:** One Photography Studio
**Primary Stack:** Next.js + TypeScript + Supabase + Tailwind CSS
**Deployment:** Vercel
**Development Agent:** Codex

---

## 1. Product Overview

The **Photo Studio Booking System** is a web application for a single photography studio to showcase its services and allow customers to conveniently book photoshoot sessions online.

The system has two main experiences:

### Customer

Customers can:

* Browse the studio
* View portfolio/gallery
* Explore photoshoot packages
* Choose a package
* Select a date
* Select an available time slot
* Add optional services
* Enter their contact information
* Submit a booking
* Receive a booking confirmation

### Studio Admin

The studio owner/admin can:

* View bookings
* Manage booking status
* View customer information
* Manage packages
* Manage available time slots
* Manage portfolio images
* View booking details
* Manage studio information

> **Important:** This application is for **one photography studio only**. It is not a multi-vendor marketplace.

---

# 2. Goals

## Primary Goals

1. Make booking a photoshoot simple for customers.
2. Give the studio a professional online presence.
3. Reduce manual booking through phone/chat.
4. Prevent double-booking.
5. Give the studio a simple booking management dashboard.
6. Present the studio's photography work beautifully.

## Non-Goals

The MVP should **not** include:

* Multiple photography studios
* Photographer marketplace
* Complex payment gateway
* Delivery management
* Customer social network
* Complex accounting
* Multi-branch management
* Mobile application
* AI photo editing
* Real-time chat

Keep the project small and polished.

---

# 3. Target Users

## 3.1 Customer

A person looking to book a photography session.

Typical use cases:

* Graduation photoshoot
* Portrait
* Couple photoshoot
* Birthday
* Family
* Wedding/pre-wedding
* Product photography

## 3.2 Admin

The photography studio owner or staff member responsible for bookings.

---

# 4. Core User Journey

```text
Landing Page
     ↓
Explore Studio
     ↓
View Portfolio
     ↓
View Packages
     ↓
Choose Package
     ↓
Choose Date
     ↓
Choose Time Slot
     ↓
Choose Add-ons
     ↓
Enter Customer Information
     ↓
Review Booking
     ↓
Confirm Booking
     ↓
Booking Confirmation
```

---

# 5. Customer Features

## 5.1 Landing Page

The landing page should immediately communicate:

* Studio name
* Photography style
* Main visual
* Short introduction
* Primary CTA: **Book a Photoshoot**
* Secondary CTA: **View Portfolio**

### Suggested Sections

```text
Hero
↓
Featured Portfolio
↓
Photoshoot Packages
↓
Why Choose Us
↓
Simple Booking Process
↓
Studio Information
↓
CTA
↓
Footer
```

---

# 6. Portfolio

Customers can browse the studio's photography work.

## Categories

Possible categories:

* Portrait
* Graduation
* Couple
* Family
* Wedding
* Birthday
* Product
* Other

## Portfolio Item Data

Each portfolio item may contain:

```text
Image
Title
Category
Description
Featured / Not Featured
Display Order
```

## UI

Use a visually strong:

* Masonry gallery
* Grid gallery
* Lightbox
* Fullscreen image preview

Photography should be the visual focus of the website.

---

# 7. Packages

Customers can view available photoshoot packages.

### Example

**Graduation Package**

**80,000 MMK**

* 1-hour session
* 1 location
* 1 outfit
* 10 edited photos

CTA:

**Book This Package**

## Package Data

Each package should support:

```text
Name
Description
Price
Duration
Included Photos
Included Outfits
Included Locations
Image
Active / Inactive
Display Order
```

---

# 8. Add-ons

Customers can optionally add additional services.

### Example

| Add-on              |      Price |
| ------------------- | ---------: |
| +10 edited photos   | 15,000 MMK |
| Additional hour     | 30,000 MMK |
| Additional outfit   | 10,000 MMK |
| Makeup              | 25,000 MMK |
| Additional location | 20,000 MMK |

The system automatically calculates:

```text
Package Price
+ Add-ons
----------------
Total Price
```

---

# 9. Booking System

The booking system is the core feature.

## Step 1 — Select Package

Customer chooses one package.

## Step 2 — Select Date

Display a calendar.

The system should prevent customers from selecting:

* Past dates
* Fully booked dates
* Studio unavailable dates

## Step 3 — Select Time

Display available time slots.

Example:

```text
10:00 AM
11:30 AM
1:00 PM
2:30 PM
4:00 PM
```

Unavailable slots should be visually disabled.

---

# 10. Prevent Double Booking

A time slot should become unavailable when an existing booking occupies that slot.

The database must enforce booking uniqueness rather than relying only on frontend validation.

Example:

```text
booking_date
time_slot
```

must not allow conflicting confirmed/pending bookings.

> **Important:** Always re-check availability on the server/database before creating a booking.

---

# 11. Customer Information

## Required

* Full name
* Phone number

## Optional

* Email
* Social media/contact ID
* Number of people
* Special request

### Example Special Request

> "I would like outdoor graduation photos around sunset."

---

# 12. Booking Summary

Before submitting, customers see:

### Your Booking

**Package**
Graduation Package

**Date**
October 10, 2026

**Time**
2:30 PM

**Add-ons**

* Additional 10 photos
* Makeup

**Total**

**95,000 MMK**

CTA:

### Confirm Booking

---

# 13. Booking Confirmation

After submission:

```text
✓ Booking Request Received

Booking ID
PS-20261010-001

Thank you!

Your photoshoot request has been received.

Date: October 10, 2026
Time: 2:30 PM
Package: Graduation Package
Total: 95,000 MMK

The studio will contact you to confirm your booking.
```

The system should distinguish between:

**Booking Request**

and

**Confirmed Booking**

Customer submission does not automatically mean the studio has confirmed the booking.

---

# 14. Booking Status

Use these statuses:

```text
Pending
Confirmed
Completed
Cancelled
```

## Normal Flow

```text
Pending
   ↓
Confirmed
   ↓
Completed
```

Cancellation can happen from:

```text
Pending → Cancelled
Confirmed → Cancelled
```

---

# 15. Admin Dashboard

The admin dashboard should remain simple.

## Dashboard Overview

Display:

```text
Today's Bookings
Upcoming Bookings
Pending Requests
This Month's Bookings
This Month's Revenue
```

Example:

```text
┌────────────────┐
│ Today's        │
│ 3 Bookings     │
└────────────────┘

┌────────────────┐
│ Pending        │
│ 5 Requests     │
└────────────────┘

┌────────────────┐
│ This Month     │
│ 28 Bookings    │
└────────────────┘

┌────────────────┐
│ Revenue        │
│ 2,450,000 MMK  │
└────────────────┘
```

---

# 16. Admin Booking Management

Admin can view:

* Booking ID
* Customer
* Phone
* Package
* Date
* Time
* Total
* Status

## Actions

* View
* Confirm
* Cancel
* Mark completed

---

# 17. Booking Detail Page

Admin can see:

```text
Booking #PS-20261010-001

Customer
Khin Myat Thu

Phone
09xxxxxxxxx

Package
Graduation Package

Date
10 October 2026

Time
2:30 PM

Add-ons
+10 Edited Photos
Makeup

Total
120,000 MMK

Special Request
Outdoor location preferred.

Status
Pending
```

Admin actions:

* **Confirm Booking**
* **Cancel Booking**

---

# 18. Calendar

Admin should have a calendar view.

Possible views:

* Month
* Day

Example:

```text
Oct 10

10:00 — Portrait — Confirmed
13:00 — Graduation — Pending
15:00 — Couple — Confirmed
```

For a mini project, month + day views are enough.

---

# 19. Package Management

Admin can:

* Create package
* Edit package
* Deactivate package
* Change price
* Change duration
* Change included services

Example:

```text
Graduation Package
80,000 MMK
Active

[Edit] [Deactivate]
```

---

# 20. Portfolio Management

Admin can:

* Upload image
* Delete image
* Edit title
* Change category
* Mark featured
* Reorder images

Use **Supabase Storage** for portfolio images.

---

# 21. Availability Management

Admin should be able to configure studio availability.

### Example

```text
Monday       10:00 AM – 6:00 PM
Tuesday      10:00 AM – 6:00 PM
Wednesday    Closed
Thursday     10:00 AM – 6:00 PM
Friday       10:00 AM – 6:00 PM
Saturday     9:00 AM – 7:00 PM
Sunday       9:00 AM – 5:00 PM
```

Admin can also mark specific dates unavailable.

Example:

```text
October 12 — Studio Closed
```

---

# 22. Authentication

Only the **admin** needs authentication.

## Customer

No account required.

Customers simply provide:

* Name
* Phone number
* Email (optional)

## Admin

Use **Supabase Auth**.

```text
Admin Login
    ↓
Dashboard
```

Use Supabase Row Level Security to ensure customers cannot access admin data.

---

# 23. Database Design

Recommended Supabase tables:

## `admin_profiles`

```text
id
email
name
created_at
```

## `packages`

```text
id
name
description
price
duration_minutes
included_photos
included_outfits
included_locations
image_url
is_active
display_order
created_at
updated_at
```

## `addons`

```text
id
name
description
price
is_active
created_at
```

## `portfolio`

```text
id
title
category
description
image_url
is_featured
display_order
created_at
```

## `bookings`

```text
id
booking_number
customer_name
phone
email
people_count
package_id
booking_date
time_slot
special_request
total_price
status
created_at
updated_at
```

## `booking_addons`

```text
id
booking_id
addon_id
price
```

Store the add-on price at booking time so historical bookings don't change when the current add-on price changes.

## `availability`

```text
id
day_of_week
start_time
end_time
is_available
```

## `blocked_dates`

```text
id
date
reason
created_at
```

---

# 24. Security

Supabase RLS must be enabled.

## Public Users

Can:

* Read active packages
* Read active add-ons
* Read published portfolio
* Create booking requests

Cannot:

* Read all bookings
* Update bookings
* Delete bookings
* Access admin information

## Admin

Can:

* CRUD packages
* CRUD add-ons
* CRUD portfolio
* Read/update bookings
* Manage availability
* Manage blocked dates

> Never expose Supabase service-role keys to the frontend.

---

# 25. Responsive Design

The application must work well on:

* Desktop
* Tablet
* Mobile

The **customer booking flow should be mobile-first**, since customers will likely book from their phones.

The admin dashboard can prioritize desktop but must remain responsive.

---

# 26. Visual Direction

The application should **not look like a generic admin template**.

## Overall Style

**Elegant + modern + editorial + photography-focused**

Use:

* Large photography
* Generous whitespace
* Elegant typography
* Subtle animations
* Rounded cards where appropriate
* Minimal borders
* Soft shadows
* Clean booking components

Avoid:

* Excessive gradients
* Too many colors
* Generic SaaS dashboard appearance
* Excessive glassmorphism
* Huge animations
* Cluttered UI

## Suggested Color Direction

Use a neutral photography-inspired palette:

```text
Warm White
Charcoal
Soft Beige
Muted Taupe
Subtle Accent
```

The photographs themselves should provide most of the visual color.

---

# 27. Pages

## Public

```text
/
 /portfolio
 /packages
 /book
 /booking/success
 /about
 /contact
```

## Admin

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

# 28. Tech Stack

## Frontend

**Next.js + TypeScript**

Use the App Router.

## Styling

**Tailwind CSS**

## Backend

**Supabase**

Use:

* PostgreSQL
* Supabase Auth
* Supabase Storage
* Row Level Security

## Hosting

**Vercel**

## Forms

Use **React Hook Form + Zod** if needed.

## Icons

Use **Lucide React**.

## Date Handling

Use a lightweight date library only if necessary.

> Avoid unnecessary dependencies.

---

# 29. Project Architecture

Suggested structure:

```text
src/
├── app/
│   ├── page.tsx
│   ├── portfolio/
│   ├── packages/
│   ├── book/
│   ├── booking/
│   └── admin/
│
├── components/
│   ├── ui/
│   ├── booking/
│   ├── portfolio/
│   ├── packages/
│   └── admin/
│
├── lib/
│   ├── supabase/
│   ├── validations/
│   └── utils/
│
├── types/
│
└── config/
```

Keep components modular but don't over-engineer.

---

# 30. Error & Empty States

Every important action needs proper feedback.

## No Available Slots

> No time slots are available for this date. Please choose another date.

## Booking Error

> Something went wrong while submitting your booking. Please try again.

## Empty Portfolio

> New work is coming soon.

## No Bookings

> No bookings yet.

## Cancelled Booking

Show a clear cancelled status.

---

# 31. Loading States

Use skeleton loaders where appropriate.

Especially for:

* Portfolio
* Packages
* Booking availability
* Admin dashboard
* Booking list

Avoid blank screens while data loads.

---

# 32. Validation

Customer booking form should validate:

* Name required
* Valid phone number
* Valid email if provided
* Package selected
* Date selected
* Time selected
* No past date
* Selected slot still available
* Valid add-ons

> **Important:** Always re-check availability on the server/database before creating the booking.

Do not trust frontend availability alone.

---

# 33. Notifications

For the MVP, keep this simple.

After booking:

### Customer

Show confirmation page.

### Admin

Dashboard shows a new pending booking.

Optional future features:

* Email confirmation
* Telegram notification
* Viber notification
* SMS

These should **not** be required for MVP.

---

# 34. Payment

## MVP

No online payment gateway is required.

Instead:

```text
Booking Request
      ↓
Studio confirms
      ↓
Customer pays deposit manually
```

Optional admin tracking:

```text
Deposit Status
Unpaid
Paid
```

If implemented, add:

```text
deposit_amount
deposit_status
```

to the `bookings` table.

Do not integrate a payment gateway unless specifically required.

---

# 35. MVP Definition

The project is considered complete when a customer can:

> **Browse → Select Package → Select Date → Select Time → Add Add-ons → Submit Booking → Receive Confirmation**

And the admin can:

> **Login → View Booking → Confirm/Cancel → Manage Packages → Manage Portfolio → Manage Availability**

This is the complete MVP.

---

# 36. Future Features

Do not build these initially, but structure the code so they could be added later.

## Phase 2

* Email notifications
* Deposit tracking
* Customer booking history
* Reschedule booking
* Cancellation policy

## Phase 3

* Customer accounts
* Private photo galleries
* Photo selection/favorites
* Download final photos

## Phase 4

* AI shoot planner
* AI pose suggestions
* AI moodboard generation
* Automated customer messages
* Sales analytics

---

# 37. Success Criteria

The project should demonstrate:

## Product Thinking

A realistic business workflow rather than a generic CRUD application.

## Frontend Skills

* Responsive design
* Form handling
* Calendar
* Booking UX
* Image galleries
* Admin dashboard

## Backend Skills

* Database relationships
* CRUD
* Authentication
* Authorization
* RLS
* Availability validation

## Supabase Skills

* PostgreSQL
* Storage
* Auth
* RLS

## Deployment

Successfully deployed on Vercel with production Supabase configuration.

---

# 38. Important Development Rules for Antigravity

1. **Do not over-engineer the project.**
2. Keep the application suitable for a **single photography studio**.
3. Do not create multi-vendor functionality.
4. Do not create unnecessary customer accounts.
5. Use **TypeScript throughout**.
6. Use Supabase rather than creating a separate backend.
7. Use server-side/database validation for booking conflicts.
8. Never expose Supabase service-role credentials.
9. Use RLS properly.
10. Keep components reusable but simple.
11. Prioritize UX over unnecessary features.
12. Make the public website visually impressive because photography is the core business.
13. Make the booking process extremely clear on mobile.
14. Use realistic empty/loading/error states.
15. Do not use fake functionality that appears to work but isn't connected to Supabase.
16. Keep the code production-quality even though this is a mini project.

---

# 39. Recommended Project Positioning

For portfolio presentation, use a product-style name rather than simply calling it "Photo Studio Booking System."

### Project Name

**Snapora — Photography Studio Booking Platform**

### One-Line Description

> A streamlined booking platform for photography studios, allowing customers to explore packages, choose available sessions, and book photoshoots online.

### Portfolio Category

**Business Web Application**

### Technology

**Next.js · TypeScript · Supabase · Tailwind CSS · Vercel**
