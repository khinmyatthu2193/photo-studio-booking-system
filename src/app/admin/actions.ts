"use server";

import { redirect } from "next/navigation";

import {
  type AdminLoginState,
  validateAdminCredentials,
} from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";

export async function loginAdmin(
  _previousState: AdminLoginState,
  formData: FormData,
): Promise<AdminLoginState> {
  const validation = validateAdminCredentials({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validation.valid) {
    return { message: validation.message, status: "error" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(validation.credentials);

  if (error || !data.user) {
    return { message: "The email or password is incorrect.", status: "error" };
  }

  const { data: profile, error: profileError } = await supabase
    .from("admin_profiles")
    .select("id")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profileError || !profile) {
    await supabase.auth.signOut();
    return {
      message: "This account is not authorized to access the studio dashboard.",
      status: "error",
    };
  }

  redirect("/admin");
}

export async function logoutAdmin(): Promise<never> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
