import "server-only";
import { createClient } from "@/lib/supabase/server";
export async function getAvailabilityData() { const db = await createClient(); const [weekly, blocked] = await Promise.all([db.from("availability").select("*").order("day_of_week"), db.from("blocked_dates").select("*").order("blocked_date")]); return { weekly: weekly.data ?? [], blocked: blocked.data ?? [], error: !!weekly.error || !!blocked.error }; }
