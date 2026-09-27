import "server-only";
import { createClient } from "@/lib/supabase/server";
export async function getCalendarBookings(start: string, end: string) { const db = await createClient(); const { data, error } = await db.from("bookings").select("id,booking_date,time_slot,customer_name,status,packages(name)").gte("booking_date", start).lt("booking_date", end).order("booking_date").order("time_slot"); return { data: (data ?? []).map(({ packages, ...booking }) => ({ ...booking, package_name: packages?.name ?? "Package" })), error: !!error }; }
