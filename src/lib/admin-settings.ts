import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database.types";
export type StudioSettingsInput = Pick<Tables<"studio_settings">, "studio_name" | "description" | "address" | "phone" | "email" | "hours">;
export async function getAdminStudioSettings() { const db = await createClient(); const { data, error } = await db.from("studio_settings").select("*").eq("id", "default").maybeSingle(); return { data, error: !!error }; }
export async function saveStudioSettingsRow(input: StudioSettingsInput) { const db = await createClient(); const { error } = await db.from("studio_settings").upsert({ id: "default", ...input }); return !error; }
