"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminAccess } from "@/lib/admin";
import { getAdminBooking, canTransition, saveBookingStatus, type BookingStatus } from "@/lib/admin-bookings";
import { savePackageRow } from "@/lib/admin-packages";
import { saveAddonRow } from "@/lib/admin-addons";
import { saveStudioSettingsRow } from "@/lib/admin-settings";
import { uploadPortfolioRow, savePortfolioRow, deletePortfolioRow, type PortfolioCategory, type PortfolioInput } from "@/lib/admin-portfolio";
import { getStudioToday } from "@/lib/booking";
import { createClient } from "@/lib/supabase/server";

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const date = /^\d{4}-\d{2}-\d{2}$/;
const time = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
const categories = ["portrait", "graduation", "couple", "family", "wedding", "birthday", "product", "other"];
async function admin() { if ((await getAdminAccess()).status !== "authorized") redirect("/admin/login"); }
function text(form: FormData, key: string) { const value = form.get(key); return typeof value === "string" ? value.trim() : ""; }
function integer(form: FormData, key: string) { const value = Number(text(form, key)); return Number.isSafeInteger(value) ? value : Number.NaN; }
function finish(path: string, kind: "error" | "notice", message: string): never { redirect(`${path}?${kind}=${encodeURIComponent(message)}`); }
function refresh(...paths: string[]) { for (const path of paths) revalidatePath(path); }

export async function savePackage(form: FormData) {
  await admin(); const id = text(form, "id");
  const input = { name: text(form, "name"), description: text(form, "description"), price: integer(form, "price"), duration_minutes: integer(form, "duration_minutes"), included_photos: integer(form, "included_photos"), included_outfits: integer(form, "included_outfits"), included_locations: integer(form, "included_locations"), display_order: integer(form, "display_order"), is_active: form.get("is_active") === "on" };
  if ((id && !uuid.test(id)) || !input.name || input.name.length > 120 || input.duration_minutes < 15 || input.duration_minutes > 1440 || [input.price, input.included_photos, input.included_outfits, input.included_locations, input.display_order].some((n) => !Number.isSafeInteger(n) || n < 0)) finish("/admin/packages", "error", "Check the package fields and try again.");
  if (!await savePackageRow(id || null, input)) finish("/admin/packages", "error", "Package could not be saved.");
  refresh("/admin/packages", "/packages", "/book", "/"); finish("/admin/packages", "notice", "Package saved.");
}
export async function setPackageActive(id: string, active: boolean) {
  await admin(); if (!uuid.test(id)) finish("/admin/packages", "error", "Invalid package.");
  const db = await createClient(); const { error } = await db.from("packages").update({ is_active: active }).eq("id", id);
  if (error) finish("/admin/packages", "error", "Package could not be updated.");
  refresh("/admin/packages", "/packages", "/book", "/"); finish("/admin/packages", "notice", active ? "Package activated." : "Package deactivated.");
}
export async function saveAddon(form: FormData) {
  await admin(); const id = text(form, "id"); const input = { name: text(form, "name"), description: text(form, "description"), price: integer(form, "price"), is_active: form.get("is_active") === "on" };
  if ((id && !uuid.test(id)) || !input.name || input.name.length > 120 || !Number.isSafeInteger(input.price) || input.price < 0) finish("/admin/addons", "error", "Enter a valid name and price.");
  if (!await saveAddonRow(id || null, input)) finish("/admin/addons", "error", "Add-on could not be saved.");
  refresh("/admin/addons", "/book"); finish("/admin/addons", "notice", "Add-on saved.");
}
export async function setAddonActive(id: string, active: boolean) {
  await admin(); if (!uuid.test(id)) finish("/admin/addons", "error", "Invalid add-on.");
  const db = await createClient(); const { error } = await db.from("addons").update({ is_active: active }).eq("id", id);
  if (error) finish("/admin/addons", "error", "Add-on could not be updated.");
  refresh("/admin/addons", "/book"); finish("/admin/addons", "notice", active ? "Add-on activated." : "Add-on deactivated.");
}
export async function changeBookingStatus(id: string, next: BookingStatus) {
  await admin(); if (!uuid.test(id)) finish("/admin/bookings", "error", "Invalid booking.");
  const booking = await getAdminBooking(id); if (!booking) finish("/admin/bookings", "error", "Booking not found.");
  if (!canTransition(booking.status, next)) finish(`/admin/bookings/${id}`, "error", "That status change is not allowed.");
  if (!await saveBookingStatus(id, next)) finish(`/admin/bookings/${id}`, "error", "Booking could not be updated. Refresh and try again.");
  refresh("/admin", "/admin/bookings", "/admin/calendar"); finish(`/admin/bookings/${id}`, "notice", `Booking marked ${next}.`);
}
export async function saveWeeklyAvailability(form: FormData) {
  await admin(); const rows = Array.from({ length: 7 }, (_, day) => { const open = form.get(`open-${day}`) === "on"; return { day_of_week: day, is_available: open, start_time: open ? text(form, `start-${day}`) : null, end_time: open ? text(form, `end-${day}`) : null }; });
  if (rows.some((row) => row.is_available && (!row.start_time || !row.end_time || !time.test(row.start_time) || !time.test(row.end_time) || row.start_time >= row.end_time))) finish("/admin/availability", "error", "Open days need valid start and end times.");
  const db = await createClient(); const { error } = await db.from("availability").upsert(rows, { onConflict: "day_of_week" });
  if (error) finish("/admin/availability", "error", "Weekly hours could not be saved.");
  refresh("/admin/availability", "/book"); finish("/admin/availability", "notice", "Weekly hours saved.");
}
export async function addBlockedDate(form: FormData) {
  await admin(); const blockedDate = text(form, "blocked_date"); const reason = text(form, "reason");
  if (!date.test(blockedDate) || blockedDate < getStudioToday() || reason.length > 500) finish("/admin/availability", "error", "Choose today or a future date.");
  const db = await createClient(); const { error } = await db.from("blocked_dates").insert({ blocked_date: blockedDate, reason });
  if (error) finish("/admin/availability", "error", error.code === "23505" ? "That date is already blocked." : "Date could not be blocked.");
  refresh("/admin/availability", "/book"); finish("/admin/availability", "notice", "Date blocked.");
}
export async function removeBlockedDate(id: string) {
  await admin(); if (!uuid.test(id)) finish("/admin/availability", "error", "Invalid date.");
  const db = await createClient(); const { error } = await db.from("blocked_dates").delete().eq("id", id);
  if (error) finish("/admin/availability", "error", "Date could not be unblocked.");
  refresh("/admin/availability", "/book"); finish("/admin/availability", "notice", "Date unblocked.");
}
export async function saveStudioSettings(form: FormData) {
  await admin(); const studioName = text(form, "studio_name"); const email = text(form, "email");
  if (!studioName || studioName.length > 160 || (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) finish("/admin/settings", "error", "Enter a studio name and valid email.");
  if (!await saveStudioSettingsRow({ studio_name: studioName, description: text(form, "description") || null, address: text(form, "address") || null, phone: text(form, "phone") || null, email: email || null, hours: text(form, "hours") || null })) finish("/admin/settings", "error", "Studio settings could not be saved.");
  refresh("/admin/settings", "/", "/about", "/contact"); finish("/admin/settings", "notice", "Studio settings saved.");
}
function portfolioInput(form: FormData): PortfolioInput | null { const category = text(form, "category"); const title = text(form, "title"); const order = integer(form, "display_order"); if (!title || title.length > 160 || !categories.includes(category) || !Number.isSafeInteger(order) || order < 0) return null; return { title, category: category as PortfolioCategory, description: text(form, "description"), display_order: order, is_featured: form.get("is_featured") === "on", is_published: form.get("is_published") === "on" }; }
export async function uploadPortfolio(form: FormData) {
  await admin(); const input = portfolioInput(form); const file = form.get("image");
  if (!input || !(file instanceof File)) finish("/admin/portfolio", "error", "Choose an image and complete its details.");
  const error = await uploadPortfolioRow(input, file); if (error) finish("/admin/portfolio", "error", error);
  refresh("/admin/portfolio", "/portfolio", "/"); finish("/admin/portfolio", "notice", "Image uploaded.");
}
export async function savePortfolioItem(form: FormData) {
  await admin(); const id = text(form, "id"); const input = portfolioInput(form);
  if (!uuid.test(id) || !input) finish("/admin/portfolio", "error", "Enter valid image details.");
  if (!await savePortfolioRow(id, input)) finish("/admin/portfolio", "error", "Image details could not be saved.");
  refresh("/admin/portfolio", "/portfolio", "/"); finish("/admin/portfolio", "notice", "Image details saved.");
}
export async function removePortfolioItem(id: string) {
  await admin(); if (!uuid.test(id)) finish("/admin/portfolio", "error", "Invalid image.");
  if (!await deletePortfolioRow(id)) finish("/admin/portfolio", "error", "Image could not be removed.");
  refresh("/admin/portfolio", "/portfolio", "/"); finish("/admin/portfolio", "notice", "Image removed.");
}
