import { AdminSection } from "@/components/admin/admin-section";

export const metadata = { title: "Manage add-ons" };

export default function AdminAddonsPage() {
  return (
    <AdminSection
      description="The authenticated optional-service catalog workflow will be implemented here."
      title="Add-ons"
    />
  );
}
