export type AdminLoginState = {
  message: string;
  status: "idle" | "error";
};

export const initialAdminLoginState: AdminLoginState = {
  message: "",
  status: "idle",
};

export function validateAdminCredentials(value: {
  email: FormDataEntryValue | null;
  password: FormDataEntryValue | null;
}):
  | { credentials: { email: string; password: string }; valid: true }
  | { message: string; valid: false } {
  const email = typeof value.email === "string" ? value.email.trim() : "";
  const password = typeof value.password === "string" ? value.password : "";

  if (!email || !password) {
    return { message: "Enter your admin email and password.", valid: false };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return { message: "Enter a valid admin email address.", valid: false };
  }

  return { credentials: { email, password }, valid: true };
}
