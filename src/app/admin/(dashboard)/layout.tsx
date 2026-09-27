import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminAccess } from "@/lib/admin";

export default async function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const access = await getAdminAccess();

  if (access.status === "anonymous") {
    redirect("/admin/login");
  }

  if (access.status === "unauthorized") {
    redirect("/admin/login?reason=unauthorized");
  }

  return <AdminShell admin={access.admin}>{children}</AdminShell>;
}
