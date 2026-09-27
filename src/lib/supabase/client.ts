"use client";

import { createBrowserClient } from "@supabase/ssr";

import {
  getSupabasePublicEnv,
  SUPABASE_DB_TIMEOUT_MS,
} from "@/lib/supabase/env";
import type { Database } from "@/types/database.types";

export function createClient() {
  const { publishableKey, url } = getSupabasePublicEnv();

  return createBrowserClient<Database>(url, publishableKey, {
    db: { timeout: SUPABASE_DB_TIMEOUT_MS },
  });
}
