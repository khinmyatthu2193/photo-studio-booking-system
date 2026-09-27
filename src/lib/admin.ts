import "server-only";

import { createClient } from "@/lib/supabase/server";

export type CurrentAdmin = {
  email: string;
  id: string;
  name: string;
};

export type AdminAccess =
  | { status: "anonymous" }
  | { status: "unauthorized" }
  | { admin: CurrentAdmin; status: "authorized" };

export async function getAdminAccess(): Promise<AdminAccess> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return { status: "anonymous" };
  }

  const { data: profile, error: profileError } = await supabase
    .from("admin_profiles")
    .select("id,email,name")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profileError || !profile) {
    return { status: "unauthorized" };
  }

  return { admin: profile, status: "authorized" };
}
