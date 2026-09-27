import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database.types";
export type AddonInput = Pick<Tables<"addons">, "name" | "description" | "price" | "is_active">;
export async function getAllAddons() { const db = await createClient(); const { data, error } = await db.from("addons").select("*").order("name"); return { data: data ?? [], error: !!error }; }
export async function saveAddonRow(id: string | null, input: AddonInput) { const db = await createClient(); const { error } = id ? await db.from("addons").update(input).eq("id", id) : await db.from("addons").insert(input); return !error; }
