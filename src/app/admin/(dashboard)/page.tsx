import { AdminSection } from "@/components/admin/admin-section";

export const metadata = { title: "Admin overview" };

export default function AdminOverviewPage() {
  return (
    <AdminSection
      description="Dashboard metrics will come from authenticated Supabase queries. No sample business figures are displayed."
      title="Overview"
    />
  );
}
