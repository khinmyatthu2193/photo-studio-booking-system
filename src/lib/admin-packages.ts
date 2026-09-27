import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database.types";
export type PackageInput = Pick<Tables<"packages">, "name" | "description" | "price" | "duration_minutes" | "included_photos" | "included_outfits" | "included_locations" | "display_order" | "is_active">;
export async function getAllPackages() { const db = await createClient(); const { data, error } = await db.from("packages").select("*").order("display_order").order("name"); return { data: data ?? [], error: !!error }; }
export async function savePackageRow(id: string | null, input: PackageInput) { const db = await createClient(); const { error } = id ? await db.from("packages").update(input).eq("id", id) : await db.from("packages").insert(input); return !error; }
