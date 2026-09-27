import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";
export { canTransition } from "@/lib/booking-status";
export type BookingStatus = Database["public"]["Enums"]["booking_status"];
export async function getAdminBookings(status: BookingStatus | "all" = "all") { const db = await createClient(); let query = db.from("bookings").select("*,packages(name)").order("booking_date", { ascending: false }).order("time_slot"); if (status !== "all") query = query.eq("status", status); const { data, error } = await query; return { data: (data ?? []).map(({ packages, ...booking }) => ({ ...booking, package_name: packages?.name ?? "Package" })), error: !!error }; }
export async function getAdminBooking(id: string) { const db = await createClient(); const { data, error } = await db.from("bookings").select("*,packages(name),booking_addons(price,addons(name))").eq("id", id).maybeSingle(); if (error || !data) return null; const { packages, booking_addons, ...booking } = data; return { ...booking, package_name: packages?.name ?? "Package", addons: booking_addons.map((entry) => ({ name: entry.addons?.name ?? "Add-on", price: entry.price })) }; }
export async function saveBookingStatus(id: string, status: BookingStatus) { const db = await createClient(); const { error } = await db.from("bookings").update({ status }).eq("id", id); return !error; }
