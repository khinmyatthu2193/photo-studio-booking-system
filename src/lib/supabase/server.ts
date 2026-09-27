import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import {
  getSupabasePublicEnv,
  SUPABASE_DB_TIMEOUT_MS,
} from "@/lib/supabase/env";
import type { Database } from "@/types/database.types";

export async function createClient() {
  const cookieStore = await cookies();
  const { publishableKey, url } = getSupabasePublicEnv();

  return createServerClient<Database>(url, publishableKey, {
    db: { timeout: SUPABASE_DB_TIMEOUT_MS },
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, options, value }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot write cookies. The auth proxy added with
          // admin authentication will own session refreshes.
        }
      },
    },
  });
}
