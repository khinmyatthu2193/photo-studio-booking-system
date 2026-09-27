---
name: booking
description: Implement or review Snapora's guest booking flow, availability, pricing, confirmation, and admin booking lifecycle. Use for booking-domain work, not unrelated catalog or visual changes.
---

# Booking

- Read PRD sections 8–18 and 30–35, `AGENTS.md`, and the current schema/booking code before changing the flow.
- Keep the guest journey: package, date, available slot, add-ons, customer details, review, submit, confirmation. Require no customer account.
- Make the mobile flow clear, resumable within the current session, and explicit about the difference between a request and a confirmed booking.
- Treat client availability and totals as previews. On submission, a trusted transactional operation must revalidate date, availability, blocked dates, slot, active package/add-ons, conflict, and authoritative prices.
- Consider `pending` and `confirmed` bookings slot-blocking. Allow `cancelled` and `completed` slots to become available; encode this rule in PostgreSQL.
- Never implement conflict prevention as a separate read followed by an unprotected insert. Map database conflicts to a specific retry message and refreshed slots.
- Create bookings as `pending`. Allow only `pending -> confirmed`, `pending -> cancelled`, `confirmed -> completed`, and `confirmed -> cancelled` unless the PRD is explicitly revised.
- Calculate totals in integer MMK units from database prices and persist add-on price snapshots. Ignore client-supplied totals, status, and booking numbers.
- Validate required name and phone, optional email and people count, selected package/date/slot, add-ons, and no-past-date rules on the server.
- Minimize returned customer data. Confirmation access must not make other bookings guessable or publicly readable.
- Cover pricing, availability, status transitions, stale availability, duplicate/concurrent submission, validation, and success/error states with focused tests.
- Stop when timezone, slot-duration/overlap semantics, or a requested status transition cannot be derived from established project decisions without changing behavior.
